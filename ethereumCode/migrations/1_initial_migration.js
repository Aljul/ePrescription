var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network) {
  if (network != "ropsten") {
    // Do something specific to the network named "live".
  deployer.deploy(Migrations);
  }
};
