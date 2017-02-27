const eth_helper = require('../lib/ethereum_helpers');
const PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
const Prescription = artifacts.require("./Prescription.sol")



contract('Prescription', function(accounts) {
  var contract = PrescriptionFactory.deployed();
  var createdPrescription;

  before(function(){
    // add trusted doctors and pharmacies to their mapping
    var factoryInstance;
    return contract.then(function(instance){
      factoryInstance = instance;
      return factoryInstance.addToDoctors(accounts[1]);
    }).then(function(){
      return factoryInstance.addToPharmacies(accounts[2])
    }).then(() => {
      return factoryInstance.createPrescription("Test", "Test Prescription", accounts[0])
    }).then((message) => {
      createdPrescription = message.logs[0].args._theAddress;
      return "Done";
    })
  })

  it('should return that the pharmacy is trusted', function(){
    return Prescription.at(createdPrescription).then(function(prescInstance){
      var prescription = prescInstance;
      return prescription.isTrusted({from: accounts[2]})
    }).then(function(response){
      assert.equal(response, true, "The pharmacist isn't trusted when he really should be");
    })
  })

  it('should return that the pharmacy is not trusted', function(){
    return Prescription.at(createdPrescription).then(function(prescInstance){
      var prescription = prescInstance;
      return prescription.isTrusted({from: accounts[1]})
    }).then(function(response){
      assert.equal(response, false, "The pharmacist is trusted when he really shouldn't be");
    })
  })

  it('should create a new prescription', function() {
    return contract.then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "MY PRESCRIPTION", accounts[1])
      }).then((receipt) => {
        // console.log(receipt)
        return meta.getPrescription(1);
      }).then((address) => {
        return Prescription.at(address)
      }).then((prescription) => {
        let isValidAddress = eth_helper.isAddress(prescription.address)
        assert(isValidAddress, true, "The prescription had a problem, a valid addess was not returned")
      })
  });

  it("should create a new prescription and return a valid address", function(){
    return contract.then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "accounts[0]", accounts[1]  )
      }).then(function(){
      return meta.getPrescription(2)
      }).then((address) => {
        // console.log(address);
        let isValidAddress = eth_helper.isAddress(address);
        assert.equal(isValidAddress, true, 'It is not a valid address');
    })
  })

  it("should create a new prescription and return its owner", function(){
    return contract.then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "accounts[0]", accounts[1])
      }).then(function(){
      return meta.getInfo(3)
      }).then((ownersAddress) => {
        assert.equal(ownersAddress, accounts[0], 'Owner is not the right one');
    })
  })

  it("should create a new prescription and return its data", function(){
    return contract.then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "DATA", accounts[1])
      }).then(function(){
        return meta.getPrescription(4)
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
    return contract.then(function(instance){
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