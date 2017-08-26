require("babel-register");
require("babel-polyfill");

var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
var Bloom = artifacts.require("./Bloom.sol");

module.exports = function deploy(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Bloom);

  deployer.deploy(MiniMeTokenFactory);
  deployer.deploy(
    Bloom,
    0,
    9000000,
    "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef",
    "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef",
    100,
    66,
    2,
    "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef"
  );

  MiniMeTokenFactory.deployed().then(() => {
    return MiniMeTokenFactory.deployed()
      .then(factory => {
        return Bloom.new(factory.address);
      })
      .then(bloom => {
        factory.generateTokens();
      });
  });
};
