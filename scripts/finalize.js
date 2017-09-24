const BloomTokenSale = artifacts.require("BloomTokenSale");

module.exports = function(callback) {
  BloomTokenSale.deployed().then(sale => sale.finishConfiguration());
};
