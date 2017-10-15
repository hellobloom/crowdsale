var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic =
  "rent notice region deal good lucky fee indicate inject fit melody animal teach twice region";

const ropstenProvider = new HDWalletProvider(
  mnemonic,
  "https://ropsten.infura.io/"
);

require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      network_id: 1,
      host: "localhost",
      port: 8545,
      gas: 1e7
    },
    test: {
      provider: require("ethereumjs-testrpc").provider({ gasLimit: 1e7 }),
      network_id: "*"
    },
    ropsten: {
      network_id: 3,
      provider: ropstenProvider,
      gasPrice: "500000000000",
      gasLimit: "2000000000000000000"
    }
  }
};
