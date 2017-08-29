pragma solidity ^0.4.15;

import "minimetoken/contracts/MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Crowdsale.sol";
import "./Bloom.sol";

contract BloomTokenSale is Crowdsale, Ownable {
  using SafeMath for uint256;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e10;

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
    token.transferFrom(address(this), _beneficiary, _weiAmount.div(1000));
  }

  function onTransfer(address _from, address _to, uint256 _amount) {
  }
}
