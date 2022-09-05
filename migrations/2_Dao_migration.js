const CeloDAO = artifacts.require("CeloDAO");
const Light = artifacts.require("Light");

module.exports = function (deployer) {
  deployer.deploy(CeloDAO);
  deployer.deploy(Light)
};
