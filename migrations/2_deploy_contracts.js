var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Bloom = artifacts.require("./Bloom.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.link(ConvertLib, Bloom);
  deployer.deploy(MetaCoin);
  deployer.deploy(Bloom);
};
