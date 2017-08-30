require("babel-register");
require("babel-polyfill");

var ConvertLib = artifacts.require("./ConvertLib.sol");
var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var Bloom = artifacts.require("./Bloom.sol");
var BloomTokenSale = artifacts.require("./BloomTokenSale.sol");

module.exports = function deploy(deployer) {
  deployer.deploy(MiniMeTokenFactory);
  deployer.deploy(Bloom);

  deployer.deploy(BloomTokenSale).then(() => {
    return MiniMeTokenFactory.deployed()
      .then(f => {
        factory = f;
        return BloomTokenSale.deployed();
      })
      .then(s => {
        sale = s;
        return Bloom.new(factory.address);
      })
      .then(b => {
        bloom = b;
        return Bloom.deployed();
      })
      .then(() => {
        return bloom.changeController(sale.address);
      })
      .then(() => {
        return sale.setToken(bloom.address);
      });
  });
};
