pragma solidity ^0.4.15;

import "./vendor/minimetoken/contracts/MiniMeToken.sol";
import "./vendor/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./vendor/zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./vendor/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

contract BloomTokenSale is CappedCrowdsale, Ownable, TokenController, Pausable {
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
    CappedCrowdsale(_cap) {
      paused = true;
    }

  function setToken(address _token) onlyOwner {
    token = Bloom(_token);
  }

  function allocateSupply() onlyOwner {
    token.generateTokens(address(this), TOTAL_SUPPLY);
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
}
