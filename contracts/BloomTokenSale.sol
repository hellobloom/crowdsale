pragma solidity ^0.4.15;

import "minimetoken/contracts/MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

contract BloomTokenSale is Crowdsale, Ownable, TokenController {
  using SafeMath for uint256;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e25; // 150 million BLT with 18 decimals

  function BloomTokenSale(
    uint256 _startBlock,
    uint256 _endBlock,
    uint256 _rate,
    address _wallet
  ) Crowdsale(_startBlock, _endBlock, _rate, _wallet) {}

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

  function proxyPayment(address _owner) payable returns(bool) {
    buyTokens(_owner);
    return true;
  }

  function onTransfer(address _from, address _to, uint _amount) returns(bool) {
    return true;
  }

  function onApprove(address _owner, address _spender, uint _amount) returns(bool) {
    return true;
  }
}
