pragma solidity ^0.4.15;

import "./vendor/minimetoken/contracts/MiniMeToken.sol";
import "./vendor/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendor/zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./vendor/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Configurable.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

/**
 * @title BloomTokenSale
 * @dev Contract for controlling the sale of Bloom tokens. This contract composes our modified
 *   `Crowdsale` and `CappedCrowdsale` contracts, implemented the MiniMeToken controller interface,
 *   supports owner pausing, and has initial owner-only configuration setup.
 */
contract BloomTokenSale is CappedCrowdsale, Ownable, TokenController, Pausable, Configurable {
  using SafeMath for uint256;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e25; // 150 million BLT with 18 decimals
  uint256 private constant MAX_RAISE_IN_USD = 5e7; // Maximum raise of $50M
  uint256 private constant TOKEN_PRICE_IN_CENTS = 333; // Target token price without a discount

  // Wei ether with two extra decimal places. Useful for conversion when we set the ether price
  uint256 private constant WEI_PER_ETHER_TWO_DECIMALS = 1e20;
  uint256 private constant TOKEN_UNITS_PER_TOKEN = 1e18; // Decimal units per BLT

  function BloomTokenSale(
    uint256 _startBlock,
    uint256 _endBlock,
    uint256 _rate,
    address _wallet,
    uint256 _cap
  ) Crowdsale(_startBlock, _endBlock, _rate, _wallet)
    CappedCrowdsale(_cap) {
      paused = true;
    }

  // @dev Link the token to the Crowdsale
  // @param _token address of the deployed token
  function setToken(address _token) configuration {
    token = Bloom(_token);
  }

  // @dev Allocate our initial token supply
  function allocateSupply() configuration {
    token.generateTokens(address(this), TOTAL_SUPPLY);
  }

  // @dev Configure the ether price which sets our cap and rate.
  // @param _cents The number of cents in USD to purchase 1 ETH
  function setEtherPriceInCents(uint256 _cents) configuration {
    require(_cents > 10000 && _cents < 100000);
    uint256 weiPerDollar = WEI_PER_ETHER_TWO_DECIMALS.div(_cents);
    cap = MAX_RAISE_IN_USD.mul(weiPerDollar);
    rate = weiPerDollar.mul(TOKEN_PRICE_IN_CENTS).div(100);
  }

  // @dev low level token purchase function
  // @param _beneficiary address the tokens will be credited to
  function proxyPayment(address _beneficiary) payable whenNotPaused returns (bool) {
    require(_beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // Update the total wei raised
    weiRaised = weiRaised.add(weiAmount);

    // Transfer tokens from the controller to the _beneficiary
    allocateTokens(_beneficiary, weiAmount);

    // Send the transfered wei to our wallet
    return forwardFunds();
  }

  // @dev Transfer funds from the controller's address to the _beneficiary. Uses
  //   _weiAmount to compute the number of tokens purchased.
  // @param _beneficiary recipient of tokens
  // @param _weiAmount wei transfered to crowdsale
  function allocateTokens(address _beneficiary, uint256 _weiAmount) private {
    token.transferFrom(address(this), _beneficiary, _weiAmount.mul(TOKEN_UNITS_PER_TOKEN).div(rate));
  }

  // @dev controller callback for approving token transfers. Only supports
  //   transfers from the controller for now.
  //
  // @param _from address that wants to transfer their tokens
  function onTransfer(address _from, address, uint) returns(bool) {
    return _from == address(this);
  }

  // @dev controller callback for approving token transfers. This feature
  //   is disabled during the crowdsale for the sake of simplicity
  function onApprove(address, address, uint) returns(bool) {
    return false;
  }

  // @dev validate purchases. Delegates to super method and also requires that
  //   the initial configuration phase is finished.
  function validPurchase() internal constant returns (bool) {
    return super.validPurchase() && configured;
  }
}
