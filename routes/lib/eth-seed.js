  var lastContractAddress;
  var p3Prescriptions = [];
  const GAS = 4000000;

module.exports = {

  deployContracts: function(web3, PrescriptionFactory, Prescription){

    return PrescriptionFactory.deployed()
  },

  initializeAddresses: function(web3){
    console.log(web3.eth.accounts)
    web3.eth.sendTransaction({to: "0xeab9085c947bf296aa20d8301061659f0f100628", value: 100000000, from: web3.eth.accounts[0] })
    web3.eth.sendTransaction({to: "0x15ff0ba44ddceb2caee5877b942518bdcc3e08b8", value: 100000000, from: web3.eth.accounts[0]})
    return Promise.resolve()
  },

  populatePrescriptionFactory: function(web3, PrescriptionFactory, Prescription){
    // add trusted doctors and pharmacies to their mapping
    var factoryInstance;
    const contract = PrescriptionFactory.deployed();
      return contract.then(function(instance){
      factoryInstance = instance;
      // julie brodeur DOCTOR pub key
      return factoryInstance.addToDoctors("0xeab9085c947bf296aa20d8301061659f0f100628", {from: web3.eth.accounts[0], gas: GAS});
    }).then(function(message){
      //lingyuan.kong@email.com DOCTOR pub key
        return factoryInstance.addToDoctors("0x15ff0ba44ddceb2caee5877b942518bdcc3e08b8", {from: web3.eth.accounts[0], gas: GAS});
    }).then(function(message){
      // console.log(message)
      // will need to add actual pharmacy address
      return factoryInstance.addToPharmacies("0xc4f993c3b9a388a5dc719c238ac7e00b81c62fb7", {from: web3.eth.accounts[0], gas: GAS})
    }).then((message) => {
      // console.log(message)

      return factoryInstance.createPrescription("First Prescription", "One apple a day keeps the doctor away", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS})
    }).then((message) => {

      console.log("the prescription message is ", message.logs[0])
      // createdPrescription = message.logs[0].args._theAddress;
      console.log(message.logs[0].args._theAddress)
      return message.logs[0].args._theAddress;
    }).catch((err) => {
      console.log("the error is ", err);
      return err;
    })
  },

  createPrescriptions: function (web3, PrescriptionFactory, Prescription) {
    var contractInstance;
    // console.log(web3.eth.accounts)
    const contract = PrescriptionFactory.deployed();
    return contract.then(function(instance){
    contractInstance = instance;
    // console.log(instance)
    return contractInstance.createPrescription("Prescription 1", "Prescription Data 1", web3.eth.accounts[1], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)

      return contractInstance.createPrescription("Prescription 2", "Prescription Data 2", web3.eth.accounts[2], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)

      return contractInstance.createPrescription("Prescription 3", "Prescription Data 3", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("Prescription 4", "Prescription Data 4", web3.eth.accounts[3], {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // p3Prescriptions.push(message.logs[0].args._theAddress);
      return contractInstance.createPrescription("Prescription 5", "Prescription Data 5", web3.eth.accounts[3],  {from: web3.eth.accounts[0], gas: GAS});
    }).then((message) => {
      // console.log(message)
      // console.log(web3.eth.accounts[0])
// console.log(web3.eth.getBalance(web3.eth.accounts[0]))
      return "Done";
    }).catch((err) => {
      console.log("the error is ", err);
      return err;
    })
  }


  }

