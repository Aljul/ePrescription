var PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PrescriptionFactory);
};
