require("babel-register");
require("babel-polyfill");

var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var BLT = artifacts.require("./BLT.sol");
var BloomTokenSale = artifacts.require("./BloomTokenSale.sol");

module.exports = function deploy(deployer) {
  if (process.env.CI === "true") {
    return;
  }
  const wallet = "0x9d217bcbd0bfae4d7f8f12c7702108d162e3ab79";
  deployer.deploy(MiniMeTokenFactory);

  var now = new Date().valueOf();
  web3.eth.getBlock("latest", (error, block) => {
    deployer
      .deploy(
        BloomTokenSale,
        1510678800, // November 14, 2017 at 9AM PDT
        1513324800, // December 15, 2017 at 12AM PST
        1000,
        wallet,
        10000
      )
      .then(() => {
        return MiniMeTokenFactory.deployed()
          .then(f => {
            factory = f;
            return BloomTokenSale.deployed();
          })
          .then(s => {
            sale = s;
            return deployer.deploy(BLT, factory.address);
          })
          .then(() => {
            return BLT.deployed();
          })
          .then(b => {
            bloom = b;
            return bloom.changeController(sale.address);
          })
          .then(() => {
            return sale.setToken(bloom.address);
          })
          .then(() => {
            return bloom.setCanCreateGrants(sale.address, true);
          })
          .then(() => {
            return sale.allocateSupply();
          })
          .catch(console.log);
      })
      .catch(error => console.log("Error: ", error));
  });
};
