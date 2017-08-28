pragma solidity ^0.4.15;

import "minimetoken/contracts/MiniMeToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Bloom.sol";

contract BloomTokenSale is Ownable {
  Bloom public token;

  function BloomTokenSale() {}

  function setToken(address _token) onlyOwner {
    token = Bloom(_token);
  }

  function allocateSupply(uint _amount) onlyOwner {
    token.generateTokens(address(this), _amount);
  }
}
