pragma solidity ^0.4.15;

import "minimetoken/contracts/MiniMeToken.sol";
import "./Bloom.sol";

contract BloomTokenSale {
  Bloom public token;

  function BloomTokenSale() {}

  function setToken(address _token) {
    // ADD OWNER OBVIOUSLY;
    token = Bloom(_token);
  }

  function allocateSupply() {
    // ADD OWNER OBVIOUSLY
    token.generateTokens(address(this), 500);
  }
}
