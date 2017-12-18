pragma solidity ^0.4.15;

import './../../contracts/BLT.sol';

contract MockBLT is BLT {
  event Gift(address recipient);

  function MockBLT() BLT(address(this)) {
  }

  function gift(address _recipient) returns (bool) {
    uint curTotalSupply = totalSupply();
    require(curTotalSupply + 1e18 >= curTotalSupply); // Check for overflow
    uint previousBalanceTo = balanceOf(_recipient);
    require(previousBalanceTo + 1e18 >= previousBalanceTo); // Check for overflow
    updateValueAtNow(totalSupplyHistory, curTotalSupply + 1e18);
    updateValueAtNow(balances[_recipient], previousBalanceTo + 1e18);
    Transfer(0, _recipient, 1e18);
    Gift(_recipient);
    return true;
  }
}
