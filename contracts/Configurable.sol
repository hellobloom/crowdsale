pragma solidity ^0.4.15;

import "./vendor/zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Configurable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Configurable is Ownable {
  event Configured();

  bool public configured = false;

  function finishConfiguration() configuration returns (bool) {
    configured = true;
    Configured();
    return true;
  }

  modifier configuration() {
    require(msg.sender == owner);
    require(!configured);
    _;
  }
}
