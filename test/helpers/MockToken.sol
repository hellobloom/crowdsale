pragma solidity ^0.4.15;

import '../../contracts/Bloom.sol';
import "../../contracts/MiniMeIrrevocableVestedToken.sol";

contract MockToken is Bloom {
  function MockToken() Bloom(address(this)) {
  }

  function addGranter(address _subject) {
    doSetCanCreateGrants(_subject, true);
  }
}
