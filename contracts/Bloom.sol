pragma solidity ^0.4.15;

import "./MiniMeIrrevocableVestedToken.sol";

/**
 * @title Bloom
 * @dev Bloom's network token.
 */
contract Bloom is MiniMeIrrevocableVestedToken {
  function Bloom(address _tokenFactory) MiniMeIrrevocableVestedToken(
    _tokenFactory,
    0x0,           // no parent token
    0,             // no snapshot block number from parent
    "Bloom Token", // Token name
    18,            // Decimals
    "BLT",         // Symbol
    true           // Enable transfers
  ) {}
}
