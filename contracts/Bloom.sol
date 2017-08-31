pragma solidity ^0.4.15;

// import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "./vendor/minimetoken/contracts/MiniMeToken.sol";
// import "./ConvertLib.sol";
// import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
// import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
// import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";

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

// contract BloomSale is RefundableCrowdsale, CappedCrowdsale, Pausable {
// }
