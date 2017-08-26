require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      network_id: 15,
      host: "localhost",
      port: 8545,
      gas: 1e8
    },
    test: {
      provider: require("ethereumjs-testrpc").provider({ gasLimit: 100000000 }),
      network_id: "*"
    }
  }
};
