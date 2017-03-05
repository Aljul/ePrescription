  var lastContractAddress;
  var p3Prescriptions = [];
  const GAS = 4000000;

module.exports = {


  createPrescriptions: function (web3, PrescriptionFactory, Prescription) {
    var contractInstance;
    // console.log(web3.eth.accounts)
    const contract = PrescriptionFactory.deployed();
    return contract.then(function(instance){
    contractInstance = instance;
    // console.log(instance)
    return contractInstance.createPrescription("P1", "Data1", web3.eth.accounts[1], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)

      return contractInstance.createPrescription("P2", "Data2", web3.eth.accounts[2], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)

      return contractInstance.createPrescription("P3", "Data3", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("P4", "Data4", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("P5", "Data5", web3.eth.accounts[3],  {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // console.log(web3.eth.accounts[0])
// console.log(web3.eth.getBalance(web3.eth.accounts[0]))
      return "Done";
    }).catch((err) => {
      console.log("the error is ", err);
      return err;
    })
  },

  populatePrescriptionFactory: function(web3, PrescriptionFactory, Prescription){
    // add trusted doctors and pharmacies to their mapping
    var factoryInstance;
    const contract = PrescriptionFactory.deployed();
      return contract.then(function(instance){
      factoryInstance = instance;
      return factoryInstance.addToDoctors("0xeab9085c947bf296aa20d8301061659f0f100628", {from: web3.eth.accounts[0], gas: GAS});
    }).then(function(message){
      // console.log(message)
      return factoryInstance.addToPharmacies(web3.eth.accounts[2], {from: web3.eth.accounts[0], gas: GAS})
    }).then((message) => {
      // console.log(message)

      return factoryInstance.createPrescription("Test", "Test Prescription", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS})
    }).then((message) => {
      console.log(message.logs[0])
      // createdPrescription = message.logs[0].args._theAddress;
      return "Done";
    }).catch((err) => {
      console.log("the error is ", err);
      return err;
    })
  }

  }

