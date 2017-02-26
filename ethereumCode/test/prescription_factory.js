const eth_helper = require('../lib/ethereum_helpers');
const PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
const Prescription = artifacts.require("./Prescription.sol")

contract('PrescriptionFactory', function(accounts) {

  var contract = PrescriptionFactory.deployed();
  before(function () {
    var example;
    return contract.then(function(instance){
    example = instance;
    return example.createPrescription("P1", "Data1", accounts[1])
    }).then(() => {
      return example.createPrescription("P2", "Data2", accounts[2])
    }).then(() => {
      return example.createPrescription("P3", "Data3", accounts[3])
    }).then(() => {
      return example.createPrescription("P4", "Data4", accounts[3])
    }).then(() => {
      return example.createPrescription("P5", "Data5", accounts[3])
    }).then(() => {
      console.log("Done!")
      return;
    })
  });


  it("should add a trusted doctor to the mapping", function() {
     return  contract.then(function(instance){
      meta = instance;
      return meta.addToDoctors(accounts[0]);
      }).then(function(receipt){
        return meta.isDoctorTrusted.call(accounts[0]);
      }).then(function(thebool){
        assert.equal( thebool, true , "It did not add the doctor's address to the mapping");
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
    return PrescriptionFactory.deployed().then(function (instance){
      meta = instance;
      // console.log(accounts[3]);
      return meta.getLatestPrescriptionForPatient(accounts[3])
    }).then(function(result){
      console.log(result)
    })
  })
});



contract('Prescription', function(accounts) {

  it('should create a new prescription', function() {
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "MY PRESCRIPTION", accounts[1])
      }).then((receipt) => {
        // console.log(receipt)
        return meta.getPrescription(0);
      }).then((address) => {
        return Prescription.at(address)
      }).then((prescription) => {
        let isValidAddress = eth_helper.isAddress(prescription.address)
        assert(isValidAddress, true, "The prescription had a problem, a valid addess was not returned")
      })
  });

  it("should create a new prescription and return a valid address", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "accounts[0]", accounts[1]  )
      }).then(function(){
      return meta.getPrescription(1)
      }).then((address) => {
        // console.log(address);
        let isValidAddress = eth_helper.isAddress(address);
        assert.equal(isValidAddress, true, 'It is not a valid address');
    })
  })



  it("should create a new prescription and return its owner", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "accounts[0]", accounts[1])
      }).then(function(){
      return meta.getInfo(2)
      }).then((ownersAddress) => {
        assert.equal(ownersAddress, accounts[0], 'Owner is not the right one');
    })
  })
  it("should create a new prescription and return its data", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "DATA", accounts[1])
      }).then(function(){
        return meta.getPrescription(3)
      }).then((prescriptionAddress) => {
        // console.log(prescriptionAddress)
        return Prescription.at(prescriptionAddress)
      }).then((prescription) => {
        return prescription.getPrescriptionData()
      }).then((data) => {
        // console.log(web3.toAscii(data), "what web3 gives me")
        var prescriptionData = eth_helper.removeNull(web3.toAscii(data));
        assert.equal(prescriptionData, "DATA", "The prescription data is not the same")
      })
  });
  it("should create a new prescription and add it to the patientsPrescription Mapping", function(){
    var theAddress;
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "HELL YEA", accounts[2])
      }).then(function(tx){
        // console.log(tx)
        // console.log(tx.logs[0].args._theAddress)
        theAddress = tx.logs[0].args._theAddress;
      return meta.getPrescriptionForSpecificPatient(accounts[2], 0)
      }).then((prescription) => {
        // console.log(prescription);
        assert.equal(prescription, theAddress, 'It is not a valid address');
    })
  })
})
