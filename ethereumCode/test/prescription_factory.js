const eth_helper = require('../lib/ethereum_helpers');
var PrescriptionFactory = artifacts.require("./PrescriptionFactory.sol");






contract('PrescriptionFactory', function(accounts) {
  let account;

    beforeEach(function(done) {
      account = PrescriptionFactory.deployed().then((r) => {return r}).then((r) => {return r.constructor.class_defaults.from}).then(() => {done()})
    });




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
      return meta.createPrescription("new prescription", account  )
      }).then(function(){
      return meta.getPrescription(0)
      }).then((address) => {
        // console.log(address);
        let isValidAddress = eth_helper.isAddress(address);
        assert(isValidAddress, true, 'It is not a valid address');
    })
  })


   it("should create a new prescription and return its owner", function(){
    return PrescriptionFactory.deployed().then(function(instance){
      meta = instance;
      return meta.createPrescription("new prescription", account)
      }).then(function(){
      return meta.getInfo(0)
      }).then((ownersAddress) => {
        console.log(account)
    })
  })
 });





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