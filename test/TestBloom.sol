pragma solidity ^0.4.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bloom.sol";

contract TestBloom {
  function testTotalSupplyUsingDeployedContract() {
    Bloom bloom = Bloom(DeployedAddresses.Bloom());

    uint expected = 500;

    Assert.equal(
      bloom.totalSupply(),
      expected,
      "Owner should have 500 Bloom initially"
    );
  }
}
