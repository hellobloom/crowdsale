pragma solidity ^0.4.5;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
// import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
// import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
// import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";

contract Bloom is StandardToken {
  uint256 public constant INITIAL_SUPPLY = 10000;
  string public constant symbol = "BLT";
  uint8 public constant decimals = 18;

  function Bloom() {
    totalSupply = 500;
  }
}

// contract BloomSale is RefundableCrowdsale, CappedCrowdsale, Pausable {
// }
