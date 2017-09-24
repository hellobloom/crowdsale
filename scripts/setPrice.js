const BloomTokenSale = artifacts.require("BloomTokenSale");

const ethInCents = 28487;

module.exports = function(callback) {
  let sale;
  BloomTokenSale.deployed()
    .then(s => {
      sale = s;
    })
    .then(() => sale.setEtherPriceInCents(ethInCents))
    .then(() => sale.rate())
    .then(rate => {
      console.log("Wei per BLT: ", rate.toString());
      console.log("ETH per BLT: ", rate.div("1e18").toString());
    });
};
