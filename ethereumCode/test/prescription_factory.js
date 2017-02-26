const eth_helper = require('../lib/ethereum_helpers');
const PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");
const Prescription = artifacts.require("./Prescription.sol")

contract('PrescriptionFactory', function(accounts) {

  it("should add a trusted doctor to the mapping", function() {
     return  PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.addToDoctors(accounts[0]);
      }).then(function(receipt){
        return meta.isDoctorTrusted.call(accounts[0]);
      }).then(function(thebool){
        assert.equal( thebool, true , "It did not add the doctor's address to the mapping");
      });
  });

  it("should add a trusted pharmacy to the mapping", function() {
     return  PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.addToPharmacies(accounts[0]);
      }).then(function(receipt){
        return meta.isPharmacyTrusted.call(accounts[0]);
      }).then(function(thebool){
        assert.equal( thebool, true , "It did not add the pharmacies's address to the mapping");
      });
  });

  it("should create a new prescription and return a valid address", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "accounts[0]", accounts[1]  )
      }).then(function(){
      return meta.getPrescription(0)
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
      return meta.getInfo(1)
      }).then((ownersAddress) => {
        assert.equal(ownersAddress, accounts[0], 'Owner is not the right one');
    })
  })
  it("should create a new prescription and return its data", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "DATA", accounts[1])
      }).then(function(){
        return meta.getPrescription(2)
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
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", "HELL YEA", accounts[2]  )
      }).then(function(){
      return meta.getPrescriptionForSpecificPatient(accounts[2], 0)
      }).then((prescription) => {
        console.log(prescription);
        // assert.equal(isValidAddress, true, 'It is not a valid address');
    })
  })
});

contract('Prescription', function(accounts) {
  // beforeEach(function (done) {
  //   console.log("hi");
  //   done();
  // });
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

  // it("should read the deployed prescription", function(){
  //   Prescription.deployed().then(console.log)
  // Prescription.deployed().then((r) => {console.log(r)})
  // });
})



// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})


// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
// PrescriptionFactory.deployed().then(r => {console.log(r.addToDoctors(0x938fdc87b4b1fa4b83e301abe978569d9c85d636))})
// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
// PrescriptionFactory.deployed().then(r => {console.log(r.addToPharmacies(0x938fdc87b4b1fa4b83e301abe978569d9c85d636))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.isPharmacyTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.owner.call().then(console.log))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.destroy())})
 // PrescriptionFactory.deployed().then(r => {console.log(r.owner.call().then(console.log))})

//  PrescriptionFactory.deployed().then(function(r) {return r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636)})

// adddress of current contract
//PrescriptionFactory.deployed().then((r) => {return r}).then((r) => {return r.constructor.class_defaults.from})