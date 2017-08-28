pragma solidity ^0.4.5;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "minimetoken/contracts/MiniMeToken.sol";
import "../contracts/Bloom.sol";
import "../contracts/BloomTokenSale.sol";
import "zeppelin-solidity/contracts/token/ERC20.sol";
import "./helpers/ThrowProxy.sol";

contract TestBloom {
  uint256 public initialBalance = 1 ether;

  ThrowProxy throwProxy;

  function beforeEach() {
    throwProxy = new ThrowProxy(address(this));
  }

  function testTotalSupplyUsingDeployedContract() {
    Bloom bloom = new Bloom(new MiniMeTokenFactory());
    BloomTokenSale sale = new BloomTokenSale();
    bloom.changeController(address(sale));
    sale.setToken(address(bloom));

    uint256 totalBefore = sale.token().totalSupply();
    sale.allocateSupply(500);
    uint256 totalAfter = sale.token().totalSupply();

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

    Assert.equal(
      sale.token().balanceOf(address(0)),
      0,
      "Non-owner addresses should have a balance of zero"
    );

    Assert.equal(
      sale.token().balanceOf(address(sale)),
      500,
      "Token controller should be allocated the initial tokens"
    );
  }

  function testOwnerOnlySetToken() {
    TestBloom(throwProxy).throwsWhenNonOwnerSetsToken();

    throwProxy.assertThrows("Should throw when non-owner tries to setToken");
  }

  function testOwnerOnlyAllocateSupply() {
    TestBloom(throwProxy).throwsWhenNonOwnerAllocatesSupply();

    throwProxy.assertThrows("Should throw when non-owner tries to allocateSupply");
  }

  function throwsWhenNonOwnerSetsToken() {
    BloomTokenSale sale = BloomTokenSale(DeployedAddresses.BloomTokenSale());

    sale.setToken(address(this));
  }

  function throwsWhenNonOwnerAllocatesSupply() {
    BloomTokenSale sale = BloomTokenSale(DeployedAddresses.BloomTokenSale());

    sale.allocateSupply(500);
  }
}
