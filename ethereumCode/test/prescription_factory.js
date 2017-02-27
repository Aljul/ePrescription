const eth_helper = require('../lib/ethereum_helpers');
const PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
const Prescription = artifacts.require("./Prescription.sol")

contract('PrescriptionFactory', function(accounts) {

  var contract = PrescriptionFactory.deployed();
  var lastContractAddress;
  var p3Prescriptions = [];
  before(function () {
    var contractInstance;
    return contract.then(function(instance){
    contractInstance = instance;
    return contractInstance.createPrescription("P1", "Data1", accounts[1]);
    }).then(() => {
      return contractInstance.createPrescription("P2", "Data2", accounts[2]);
    }).then(() => {
      return contractInstance.createPrescription("P3", "Data3", accounts[3]);
    }).then((message) => {
      p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("P4", "Data4", accounts[3]);
    }).then((message) => {
      p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("P5", "Data5", accounts[3]);
    }).then((message) => {
      p3Prescriptions.push(message.logs[0].args._theAddress);
      lastContractAddress = message.logs[0].args._theAddress;
      return "Done";
    })
  });


  it("should add a trusted doctor to the mapping", function() {
     return  contract.then(function(instance){
      meta = instance;
      return meta.addToDoctors(accounts[1]);
      }).then(function(receipt){
        return meta.isDoctorTrusted.call(accounts[1]);
      }).then(function(thebool){
        assert.equal( thebool, true , "It did not add the doctor's address to the mapping");
      });
  });

   it("should not let me add a trusted doctor to the mapping", function() {
     return  contract.then(function(instance){
      meta = instance;
      return meta.addToDoctors(accounts[2], {from: accounts[1]});
      }).then(function(receipt){
        return meta.isDoctorTrusted.call(accounts[2]);
      }).then(function(thebool){
        assert.equal( thebool, false , "It did not add the doctor's address to the mapping");
      });
  });

  it("should add a trusted pharmacy to the mapping", function() {
     return  contract.then(function(instance){
      meta = instance;
      return meta.addToPharmacies(accounts[0]);
      }).then(function(receipt){
        return meta.isPharmacyTrusted.call(accounts[0]);
      }).then(function(thebool){
        assert.equal( thebool, true , "It did not add the pharmacies's address to the mapping");
      });
  });

  it("should return the last prescription made for patient3", function(){
    return contract.then(function (instance){
      meta = instance;
      return meta.getLatestPrescriptionForPatient(accounts[3])
    }).then(function(result){
      assert.equal(result, lastContractAddress, 'Last contract address does not match in patient3')
    })
  })


  it("should return the last prescription made for patient3", function(){
    return contract.then(function (instance){
      meta = instance;
      return meta.getAllPrescriptionsForPatient(accounts[3])
    }).then(function(arrayOfPrescriptions){
      // console.log(result)
      assert.deepEqual(arrayOfPrescriptions, p3Prescriptions, 'Not all the prescriptions are the same')
    })
  })
});

