pragma solidity ^0.4.15;

import "minimetoken/contracts/MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Bloom.sol";

contract BloomTokenSale is Ownable {
  using SafeMath for uint;

  Bloom public token;

  uint public constant TOTAL_SUPPLY = 15e10;

  function BloomTokenSale() {}

  function setToken(address _token) onlyOwner {
    token = Bloom(_token);
  }

  function allocateSupply() onlyOwner {
    token.generateTokens(address(this), TOTAL_SUPPLY);
  }
}
