var PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
var Prescription = artifacts.require("./Prescription.sol");

module.exports = function(deployer) {
  deployer.deploy(Prescription);
  deployer.deploy(PrescriptionFactory);
};
