pragma solidity 0.4.15;

import "zeppelin/math/SafeMath.sol";
import "zeppelin/ownership/Ownable.sol";
import "./MiniMeToken.sol";
import "./BLT.sol";

// @title Bloom token sale adjustment
//
// The rate calculated for our token sale was different from what was
// displayed on our terms and conditions. We are honoring the mistake
// by issuing additional tokens via this contract:
//
//   * The public sale price was 658.605105014684033361 BLT / ETH
//   * We are adjusting balances to match 703.641791044776119402 BLT / ETH ($0.67/BLT)
//   * This is a difference of 6.838192672236873042% for all participants
//
// This contract keeps transfer and approve calls disabled from everyone, so setting it
// as the token controller after the sale will preserve the balances from the token sale.
// A separate script should be setup that calls `grantAdditionalTokens` for every contributor
// that was not part of the presale (they will be handled separately).
//
// Tokens can be transfered to this controller from our wallet in order to fund the balance
// changes. Any leftovers will be sent back to the wallet once this controller is phased out.
contract BloomPriceAdjustmentController is Ownable, TokenController {
  using SafeMath for uint256;

  address public wallet;
  BLT public token;
  uint256 public constant PERCENT_INCREASE = 68381926722368730; // 18 decimals so 6.83% increase
  mapping(address => bool) public updatedAccounts;

  event BalanceUpdate(address indexed recipient, uint256 value);

  function BloomPriceAdjustmentController(BLT _token, address _wallet) public {
    token = _token;
    wallet = _wallet;
  }

  // Issue a one time balance update to anyone that contributed in the public sale.
  // @param _buyer Address of token sale contributor who should be issued additional tokens
  function grantAdditionalTokens(address _buyer) public onlyOwner {
    require(!updatedAccounts[_buyer]);

    uint256 balanceOfBuyer = token.balanceOf(_buyer);
    require(balanceOfBuyer > 0);

    uint256 newTokens = balanceOfBuyer.mul(PERCENT_INCREASE).div(1e18);

    BalanceUpdate(_buyer, newTokens);
    updatedAccounts[_buyer] = true;
    token.transfer(_buyer, newTokens);
  }

  // @dev Change the token controller once the price adjustment period is over
  //
  // @param _newController Address of new token controller
  function changeTokenController(address _newController) public onlyOwner {
    token.transfer(wallet, token.balanceOf(address(this)));
    token.changeController(_newController);
  }

  // @dev purchase function to match TokenController interface. All purchases rejected
  function proxyPayment(address) public payable returns (bool) {
    revert();
  }

  // @dev controller callback for approving token transfers. Only supports
  //   transfers from the controller (price adjustments) and to the controller
  //   from the wallet (funding for price adjustments)
  //
  // @param _from address that wants to transfer their tokens
  function onTransfer(address _from, address _to, uint) public returns (bool) {
    return _from == address(this) || (_to == address(this) && _from == address(wallet));
  }

  // @dev controller callback for approving token transfers. This feature
  //   is disabled during the price adjustmet period
  function onApprove(address, address, uint) public returns (bool) {
    return false;
  }
}
