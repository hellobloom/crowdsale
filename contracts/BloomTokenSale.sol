pragma solidity ^0.4.15;

import "./vendor/minimetoken/contracts/MiniMeToken.sol";
import "./vendor/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendor/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

contract BloomTokenSale is CappedCrowdsale, Ownable, TokenController {
  using SafeMath for uint256;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e25; // 150 million BLT with 18 decimals

  function BloomTokenSale(
    uint256 _startBlock,
    uint256 _endBlock,
    uint256 _rate,
    address _wallet,
    uint256 _cap
  ) Crowdsale(_startBlock, _endBlock, _rate, _wallet)
    CappedCrowdsale(_cap) {}

  function setToken(address _token) onlyOwner {
    token = Bloom(_token);
  }

  function allocateSupply() onlyOwner {
    token.generateTokens(address(this), TOTAL_SUPPLY);
  }

  function allocateTokens(address _beneficiary, uint256 _weiAmount) private {
    token.transferFrom(address(this), _beneficiary, _weiAmount.mul(rate));
  }

  // Required interface of MiniMeToken

  // low level token purchase function
  function proxyPayment(address beneficiary) payable returns (bool) {
    require(beneficiary != 0x0);
    require(validPurchase());

    uint256 weiAmount = msg.value;

    // update state
    weiRaised = weiRaised.add(weiAmount);

    allocateTokens(beneficiary, weiAmount);

    return forwardFunds();
  }

  function onTransfer(address _from, address, uint) returns(bool) {
    return _from == address(this);
  }

  function onApprove(address, address, uint) returns(bool) {
    return false;
  }
}
