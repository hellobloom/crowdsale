var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic =
  "rent notice region deal good lucky fee indicate inject fit melody animal teach twice region";

const rinkebyProvider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/"
);

console.log(rinkebyProvider);

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
    rinkeby: {
      network_id: 4,
      provider: rinkebyProvider,
      gasPrice: "20000000000",
      gasLimit: "4704624",
      gas: "4704624"
    }
  }
};
