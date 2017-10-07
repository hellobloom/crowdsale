pragma solidity ^0.4.15;

import '../../contracts/Configurable.sol';

// mock class using Configurable
contract ConfigurableMock is Configurable {
  bool public drasticMeasureTaken;
  uint256 public count;

  function ConfigurableMock() {
    count = 1;
  }

  function increment() external configuration {
    count++;
  }

  function decrement() external onlyAfterConfiguration {
    count--;
  }
}
