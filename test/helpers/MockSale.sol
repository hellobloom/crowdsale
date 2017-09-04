pragma solidity ^0.4.15;

import '../../contracts/BloomTokenSale.sol';

contract MockSale is BloomTokenSale {
  function MockSale() BloomTokenSale(
    block.number,
    block.number + 1000,
    1000,
    address(this),
    10000000
  ) {
  }

  function grantInstantlyVestedTokens(address _recipient, uint256 _amount) {
    token.grantVestedTokens(
      _recipient,
      _amount,
      uint64(now),
      uint64(now),
      uint64(now)
    );
  }

  function onApprove(address, address, uint) returns(bool) {
    return true;
  }

  function onTransfer(address, address, uint) returns(bool) {
    return true;
  }
}
