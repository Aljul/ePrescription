var PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
var Prescription = artifacts.require("./Prescription.sol");
var OwnedToken = artifacts.require('./OwnedToken.sol');
module.exports = function(deployer) {
  // deployer.deploy(Prescription);
  // deployer.deploy(OwnedToken);
  deployer.deploy(PrescriptionFactory);
};
