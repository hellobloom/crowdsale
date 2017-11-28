pragma solidity 0.4.15;

import "./MiniMeToken.sol";
import "zeppelin/ownership/Ownable.sol";
import "zeppelin/lifecycle/Pausable.sol";
import "zeppelin/math/SafeMath.sol";
import "./Configurable.sol";
import "./CappedCrowdsale.sol";
import "./FinalizableCrowdsale.sol";
import "./BLT.sol";

/**
 * @title BloomTokenSale
 * @dev Contract for controlling the sale of Bloom tokens. This contract composes our modified
 *   `Crowdsale` and `CappedCrowdsale` contracts, implemented the MiniMeToken controller interface,
 *   supports owner pausing, and has initial owner-only configuration setup. The constructor requires
 *   a `_cap` and `_rate` that are passed to `Crowdsale` and `CappedCrowdsale` but these values aren't
 *   actually used. When `finalizePresale` is called a ETH/USD price is specified in cents. This price
 *   and the remaining unallocated tokens are used to determine the `rate` and `cap`. These unused
 *   constructor variables are awkward but intentional, see hellobloom/crowdsale#86 for more details.
 *
 *   The public functions within this contract are organized by their phase of the contract:
 *
 *     1. Setup + Presale (setting token, supply, grants, finalizing settings to get ready for sale)
 *     2. Public sale (purchasing tokens from this contract, approving transfers)
 *     3. Finalization (changing to our placeholder controller)
 *
 *   This contract is only available to the public for phase 2. The `Configurable` and `FinalizableCrowdsale`
 *   contracts enforce the invariant that we can only advance phases (e.g. from presale to public sale) but
 *   we can never go back and we can't call functions from previous phases once we have left them.
 */
contract BloomTokenSale is CappedCrowdsale, Ownable, TokenController, Pausable, Configurable, FinalizableCrowdsale {
  using SafeMath for uint256;

  BLT public token;

  // Solhint breaks on combination of scientific notation and `ether` keyword so disable next line
  // solhint-disable-next-line
  uint256 public constant TOTAL_SUPPLY = 1.5e8 ether; // 150 million BLT with 18 decimals
  uint256 internal constant FOUNDATION_SUPPLY = (TOTAL_SUPPLY * 4) / 10; // 40% supply
  uint256 internal constant ADVISOR_SUPPLY = TOTAL_SUPPLY / 20; // 5% supply
  uint256 internal constant PARTNERSHIP_SUPPLY = TOTAL_SUPPLY / 20; // 5% supply
  uint256 internal constant CONTROLLER_ALLOCATION =
    TOTAL_SUPPLY - FOUNDATION_SUPPLY - PARTNERSHIP_SUPPLY; // 55%
  uint256 internal constant WALLET_ALLOCATION = TOTAL_SUPPLY - CONTROLLER_ALLOCATION; // 45%
  uint256 internal constant MAX_RAISE_IN_USD = 5e7; // Maximum raise of $50M

  // Wei ether with two extra decimal places. Useful for conversion when we set the ether price
  uint256 internal constant WEI_PER_ETHER_TWO_DECIMALS = 1e20;
  uint256 internal constant TOKEN_UNITS_PER_TOKEN = 1e18; // Decimal units per BLT

  uint256 public advisorPool = ADVISOR_SUPPLY;

  uint256 internal constant DUST = 1 finney; // Minimum payment

  event NewPresaleAllocation(address indexed holder, uint256 bltAmount);

  function BloomTokenSale(
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet,
    uint256 _cap
  ) public
    Crowdsale(_startTime, _endTime, _rate, _wallet)
    CappedCrowdsale(_cap) { } // solhint-disable-line no-empty-blocks

  // @dev Link the token to the Crowdsale
  // @param _token address of the deployed token
  function setToken(address _token) public presaleOnly {
    token = BLT(_token);
  }

  // @dev Allocate our initial token supply
  function allocateSupply() public presaleOnly {
    require(token.totalSupply() == 0);
    token.generateTokens(address(this), CONTROLLER_ALLOCATION);
    token.generateTokens(wallet, WALLET_ALLOCATION);
  }

  // @dev Explicitly allocate tokens from the advisor pool, updating how much is left in the pool.
  //
  // @param _receiver Recipient of grant
  // @param _amount Total BLT units allocated
  // @param _cliffDate Vesting cliff
  // @param _vestingDate Date that the vesting finishes
  function allocateAdvisorTokens(address _receiver, uint256 _amount, uint64 _cliffDate, uint64 _vestingDate)
           public
           presaleOnly {
    require(_amount <= advisorPool);
    advisorPool = advisorPool.sub(_amount);
    allocatePresaleTokens(_receiver, _amount, _cliffDate, _vestingDate);
  }

  // @dev Allocate a normal presale grant. Does not necessarily come from a limited pool like the advisor tokens.
  //
  // @param _receiver Recipient of grant
  // @param _amount Total BLT units allocated
  // @param _cliffDate Vesting cliff
  // @param _vestingDate Date that the vesting finishes
  function allocatePresaleTokens(address _receiver, uint256 _amount, uint64 cliffDate, uint64 vestingDate)
           public
           presaleOnly {

    require(_amount <= 10 ** 25); // 10 million BLT. No presale partner will have more than this allocated. Prevent overflows.

    // solhint-disable-next-line not-rely-on-time
    token.grantVestedTokens(_receiver, _amount, uint64(now), cliffDate, vestingDate, true, false);

    NewPresaleAllocation(_receiver, _amount);
  }

  // @dev Set the stage for the sale:
  //   1. Sets the `cap` controller variable based on the USD/ETH price
  //   2. Updates the `weiRaised` to the balance of our wallet
  //   3. Takes the unallocated portion of the advisor pool and transfers to the wallet
  //   4. Sets the `rate` for the sale now based on the remaining tokens and cap
  //
  // @param _cents The number of cents in USD to purchase 1 ETH
  // @param _weiRaisedOffChain Total amount of wei raised (at specified conversion rate) outside of wallet
  function finishPresale(uint256 _cents, uint256 _weiRaisedOffChain) public presaleOnly returns (bool) {
    setCapFromEtherPrice(_cents);
    syncPresaleWeiRaised(_weiRaisedOffChain);
    transferUnallocatedAdvisorTokens();
    updateRateBasedOnFundsAndSupply();
    finishConfiguration();
  }

  // @dev Revoke a token grant, transfering the unvested tokens to our sale wallet
  //
  // @param _holder Owner of the vesting grant that is being revoked
  // @param _grantId ID of the grant being revoked
  function revokeGrant(address _holder, uint256 _grantId) public onlyOwner {
    token.revokeTokenGrant(_holder, wallet, _grantId);
  }

  // @dev low level token purchase function
  // @param _beneficiary address the tokens will be credited to
  function proxyPayment(address _beneficiary)
    public
    payable
    whenNotPaused
    onlyAfterConfiguration
    returns (bool) {
    require(_beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // Update the total wei raised
    weiRaised = weiRaised.add(weiAmount);

    // Transfer tokens from the controller to the _beneficiary
    allocateTokens(_beneficiary, weiAmount);

    // Send the transfered wei to our wallet
    forwardFunds();

    return true;
  }

  // @dev controller callback for approving token transfers. Only supports
  //   transfers from the controller for now.
  //
  // @param _from address that wants to transfer their tokens
  function onTransfer(address _from, address _to, uint) public returns (bool) {
    return _from == address(this) || _to == address(wallet);
  }

  // @dev controller callback for approving token transfers. This feature
  //   is disabled during the crowdsale for the sake of simplicity
  function onApprove(address, address, uint) public returns (bool) {
    return false;
  }

  // @dev Change the token controller once the sale is over
  //
  // @param _newController Address of new token controller
  function changeTokenController(address _newController) public onlyOwner whenFinalized {
    token.changeController(_newController);
  }

  // @dev Set the crowdsale cap based on the ether price
  // @param _cents The number of cents in USD to purchase 1 ETH
  function setCapFromEtherPrice(uint256 _cents) internal {
    require(_cents > 10000 && _cents < 100000);
    uint256 weiPerDollar = WEI_PER_ETHER_TWO_DECIMALS.div(_cents);
    cap = MAX_RAISE_IN_USD.mul(weiPerDollar);
  }

  // @dev Set the `weiRaised` for this contract to the balance of the sale wallet
  function syncPresaleWeiRaised(uint256 _weiRaisedOffChain) internal {
    require(weiRaised == 0);
    weiRaised = wallet.balance.add(_weiRaisedOffChain);
  }

  // @dev Transfer unallocated advisor tokens to our wallet. Lets us sell any leftovers
  function transferUnallocatedAdvisorTokens() internal {
    uint256 _unallocatedTokens = advisorPool;
    // Advisor pool will not be used again but we zero it out anyways for the sake of book keeping
    advisorPool = 0;
    token.transferFrom(address(this), wallet, _unallocatedTokens);
  }

  // @dev Set the `rate` based on our remaining token supply and how much we still need to raise
  function updateRateBasedOnFundsAndSupply() internal {
    uint256 _unraisedWei = cap - weiRaised;
    uint256 _tokensForSale = token.balanceOf(address(this));
    rate = _tokensForSale.mul(1e18).div(_unraisedWei);
  }

  // @dev Transfer funds from the controller's address to the _beneficiary. Uses
  //   _weiAmount to compute the number of tokens purchased.
  // @param _beneficiary recipient of tokens
  // @param _weiAmount wei transfered to crowdsale
  function allocateTokens(address _beneficiary, uint256 _weiAmount) internal {
    token.transferFrom(address(this), _beneficiary, tokensFor(_weiAmount));
  }

  // @dev Compute number of token units a given amount of wei gets
  //
  // @param _weiAmount Amount of wei to convert
  function tokensFor(uint256 _weiAmount) internal constant returns (uint256) {
    return _weiAmount.mul(rate).div(1e18);
  }

  // @dev validate purchases. Delegates to super method and also requires that
  //   the initial configuration phase is finished.
  function validPurchase() internal constant returns (bool) {
    return super.validPurchase() && msg.value >= DUST && configured;
  }

  // @dev transfer leftover tokens to our wallet
  function finalization() internal {
    token.transferFrom(address(this), wallet, token.balanceOf(address(this)));
  }

  function inPresalePhase() internal constant beforeSale configuration returns (bool) {
    return true;
  }

  modifier presaleOnly() {
    require(inPresalePhase());
    _;
  }

  modifier beforeSale {
    require(now < startTime); // solhint-disable-line not-rely-on-time
    _;
  }

  modifier whenFinalized {
    require(isFinalized);
    _;
  }
}
