pragma solidity ^0.4.15;

import "./vendor/minimetoken/contracts/MiniMeToken.sol";

contract Bloom is MiniMeToken {
  function Bloom(address _tokenFactory) MiniMeToken(
    _tokenFactory,
    0x0,           // no parent token
    0,             // no snapshot block number from parent
    "Bloom Token", // Token name
    18,            // Decimals
    "BLT",         // Symbol
    true           // Enable transfers
  ) {}
}
