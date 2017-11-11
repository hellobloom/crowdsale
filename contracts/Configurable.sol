pragma solidity 0.4.15;

import "zeppelin/ownership/Ownable.sol";

/**
 * @title Configurable
 * @dev Base contract which allows children to define certain functions as configurable
 *   (meaning only the owner can call it and it sets up initial state). Configuration
 *  functions can only be called when `configured` is false and once `finishConfiguration`
 *  is called `configured` is set to `true` and it cannot be rolled back.
 */
contract Configurable is Ownable {
  // Event triggered when the contract has been configured by the owner
  event Configured();

  bool public configured = false;

  // @dev Finalize configuration, prohibiting further configuration
  function finishConfiguration() public configuration returns (bool) {
    configured = true;
    Configured();
    return true;
  }

  // @dev Enforce that a function is an owner-only configuration method.
  //   Intentionally duplicates the `onlyOwner` check so that we can't
  //   accidentally create a configuration option that without the owner modifier.
  //   This modifier will not let a function be called if the `finalizeConfiguration`
  //   has been called.
  modifier configuration() {
    require(msg.sender == owner);
    require(!configured);
    _;
  }

  modifier onlyAfterConfiguration() {
    require(configured);
    _;
  }
}
