const BloomTokenSale = artifacts.require("BloomTokenSale");

const presales = [
  { amount: "7500000", address: "0x0000000000000000000000000000000000000001" },
  { amount: "7500000", address: "0x0000000000000000000000000000000000000002" },
  { amount: "6000000", address: "0x0000000000000000000000000000000000000003" },
  { amount: "6000000", address: "0x0000000000000000000000000000000000000004" },
  { amount: "3000000", address: "0x0000000000000000000000000000000000000005" }
];

const now = +new Date() / 1000;
const month = 30 * 24 * 3600;

const cliff = now + 6 * month;
const vesting = now + 24 * month;

module.exports = function(callback) {
  let sale;
  BloomTokenSale.deployed()
    .then(s => {
      sale = s;
    })
    .then(() => {
      presales.forEach(presale => {
        console.log(`Granting ${presale.amount} to ${presale.address}.`);
        return sale.allocatePresaleTokens(
          presale.address,
          new web3.BigNumber(web3.toWei(presale.amount, "ether")),
          cliff,
          vesting
        );
      });
    });
};
