pragma solidity ^0.4.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "minimetoken/contracts/MiniMeToken.sol";
import "../contracts/Bloom.sol";
import "../contracts/BloomTokenSale.sol";
import "zeppelin-solidity/contracts/token/ERC20.sol";

contract TestBloom {
  function testTotalSupplyUsingDeployedContract() {
    Bloom bloom = Bloom(DeployedAddresses.Bloom());
    BloomTokenSale sale = BloomTokenSale(DeployedAddresses.BloomTokenSale());

    uint256 totalBefore = ERC20(sale.token()).totalSupply();

    sale.allocateSupply();

    uint256 totalAfter = ERC20(sale.token()).totalSupply();

    Assert.equal(
      totalBefore,
      0,
      "The total supply should start at zero tokens."
    );

    Assert.equal(
      totalAfter,
      500,
      "The supply should be 500 after calling allocateSupply()"
    );
  }
}
