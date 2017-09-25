pragma solidity ^0.4.15;

import '../../contracts/BLT.sol';
import "../../contracts/MiniMeVestedToken.sol";

contract MockToken is BLT {
  function MockToken() BLT(address(this)) {
  }

  function addGranter(address _subject) {
    doSetCanCreateGrants(_subject, true);
  }
}
