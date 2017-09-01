pragma solidity ^0.4.15;

import "./vendor/minimetoken/contracts/MiniMeToken.sol";
import "./vendor/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendor/zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./vendor/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Configurable.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

contract BloomTokenSale is CappedCrowdsale, Ownable, TokenController, Pausable, Configurable {
  using SafeMath for uint256;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e25; // 150 million BLT with 18 decimals
  uint256 private constant MAX_RAISE_IN_USD = 5e7;

  uint256 private constant WEI_PER_ETHER_TWO_DECIMALS = 1e20;

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

  function setToken(address _token) configuration {
    token = Bloom(_token);
  }

  function allocateSupply() configuration {
    token.generateTokens(address(this), TOTAL_SUPPLY);
  }

  function setEtherPriceInCents(uint256 _cents) configuration {
    require(_cents > 10000 && _cents < 100000);
    uint256 weiPerDollar = WEI_PER_ETHER_TWO_DECIMALS.div(_cents);
    cap = MAX_RAISE_IN_USD.mul(weiPerDollar);
  }

  // low level token purchase function
  function proxyPayment(address beneficiary) payable whenNotPaused returns (bool) {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // update state
    weiRaised = weiRaised.add(weiAmount);

    allocateTokens(beneficiary, weiAmount);

    return forwardFunds();
  }

  function allocateTokens(address _beneficiary, uint256 _weiAmount) private {
    token.transferFrom(address(this), _beneficiary, _weiAmount.mul(rate));
  }

  function onTransfer(address _from, address, uint) returns(bool) {
    return _from == address(this);
  }

  function onApprove(address, address, uint) returns(bool) {
    return false;
  }

  function validPurchase() internal constant returns (bool) {
    return super.validPurchase() && configured;
  }
}
