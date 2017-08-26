const mnemonic =
  process.env.TEST_MNETONIC ||
  "burger burger burger burger burger burger burger burger burger burger burger burger";

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
  },
  build: {}
};
