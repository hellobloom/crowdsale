require("babel-register");
require("babel-polyfill");

var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var Bloom = artifacts.require("./Bloom.sol");
var BloomTokenSale = artifacts.require("./BloomTokenSale.sol");

module.exports = function deploy(deployer) {
  deployer.deploy(MiniMeTokenFactory);
  deployer.deploy(Bloom);

  var now = new Date().valueOf();
  web3.eth.getBlockNumber((error, blockNumber) => {
    deployer
      .deploy(BloomTokenSale, blockNumber + 10, 10000000, 1000, "0x1")
      .then(() => {
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
          })
          .catch(console.log);
      })
      .catch(error => console.log("Error: ", error));
  });
};
