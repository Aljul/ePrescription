const Web3                            = require('web3');
const EthereumTx                      = require('ethereumjs-tx')
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const seed                            = require('./eth-seed.js');
const encryption                      = require('./encryption.js');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3   = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys

// set the contract abstractions so we can directly call their functions
const PrescriptionFactory         = contract(PrescriptionFactoryJSON);
const Prescription                = contract(PrescriptionJSON);
const AbstractPrescriptionFactory = contract(AbstractPrescriptionFactoryJSON);
const GAS = 40000
// set their providers (right now testrpc)
PrescriptionFactory.setProvider(provider);
Prescription.setProvider(provider);
AbstractPrescriptionFactory.setProvider(provider);

module.exports = {

  seedPrescriptionFactory: function(){
    return seed.populatePrescriptionFactory(web3, PrescriptionFactory, Prescription);
  },

  seedPrescriptions: function(){
   return seed.createPrescriptions(web3, PrescriptionFactory, Prescription);
  },

  publishPrescription: function(patientAddress, doctorKeys, docPassword, prescriptionData, prescriptionName){
    PrescriptionFactory.deployed().then((instance) => {
    console.log(instance.createPrescription.request(prescriptionName, prescriptionData, patientAddress))
    })
   return PrescriptionFactory.deployed().then(function(instance){
    var contractInstance = instance;
    return contractInstance.createPrescription(prescriptionName, prescriptionData, patientAddress, {from: doctorKeys.public_key, gas: GAS})
   }).then((message) => {
    // console.log(message)
    if(message.logs.length == 0){
      throw 'Something went wrong when creating the prescription';
    }
    // console.log(message.logs[0].args._theAddress);
    return message.logs[0].args._theAddress
   }).catch((err) => {
    // console.log(err)
    return err;
    })
   },

   publishPrescriptionSIGNED: function(patientAddress, doctorKeys, docPassword, prescriptionData, prescriptionName){
    // console.log(web3.eth)
//     web3.eth.sendTransaction({to: "0xe6be9892c9d39bbe3d29daa12da80420c20649fe", value: "1000000000000000000"},  function(err, address) {
//   if (!err)
//     console.log(address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
// })
    // const decoded = encryption.decipher('1234', doctorKeys.priv_key)
    // console.log(decoded)
    // const privateKey = Buffer.from(decoded, 'hex')
    const privateKey = Buffer.from("d126806aea8c43173a50854d0f35c09f738d68a86fa9e877e0f982cc4c774304", "hex")
    console.log(privateKey)
    PrescriptionFactory.deployed().then((instance) => {
      let contractInstance = instance;
    return instance.createPrescription.request(prescriptionName, prescriptionData, patientAddress)
    }).then((data) => {
      console.log(data.params[0].data)
      var rawTx = {
        nonce: '0x00',
        gasPrice: '0x09184e72a000',
        gasLimit: web3.toHex(GAS),
        value: '0x00',
        data: data.params[0].data
      }

      var tx = new EthereumTx(rawTx);
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      return web3.eth.sendRawTransaction(serializedTx.toString('hex'), {from: doctorKeys.public_key})
    }).then((result) => {console.log(result)})
      .catch((err) => {console.log(err)})
   //  // const privateKey = Buffer.from(encryption.decipher(doctorKeys.priv_key, docPassword), 'hex')
   // return PrescriptionFactory.deployed().then(function(instance){
   //  var contractInstance = instance;
   //  return contractInstance.createPrescription(prescriptionName, prescriptionData, patientAddress, {from: doctorKeys.public_key, gas: GAS})
   // }).then((message) => {
   //  // console.log(message)
   //  if(message.logs.length == 0){
   //    throw 'Something went wrong when creating the prescription';
   //  }
   //  // console.log(message.logs[0].args._theAddress);
   //  return message.logs[0].args._theAddress
   // }).catch((err) => {
   //  // console.log(err)
   //  return err;
   //  })
   },

  retrieveAllPrescriptionAddresses: function(patientAddress, doctorAddress){
    return PrescriptionFactory.deployed().then(function(instance){
      console.log(instance)
    var contractInstance = instance;
    return contractInstance.getAllPrescriptionsForPatient(patientAddress, {from: doctorAddress})
   }).then((message) => {
    // console.log(message)
    return message
   }).catch((err) => {
    // console.log(err)
    return err;
    })
  },

  retrieveLatestPrescriptionAddress: function(patientAddress, doctorAddress){
    return PrescriptionFactory.deployed().then(function(instance){
    var contractInstance = instance;
    return contractInstance.getLatestPrescriptionForPatient(patientAddress, {from: doctorAddress})
   }).then((message) => {
    // console.log(message)
    return message
   }).catch((err) => {
    // console.log(err)
    return err;
    })
  },


  getPrescriptionData: function(prescriptionAddress){
    return Prescription.at(prescriptionAddress).then(function(instance){
      prescription = instance;
      console.log(instance);
      return prescription.getPrescriptionData()
    }).then((data) => {
      // console.log(data);
      return web3.toAscii(data)
    }).catch((err) => {
      // console.log(err)
    return err;
    })
  },

  printPrescription: function(prescriptionAddress){
    let prescriptionData, prescriptionName, docAddress, patientAddr;

   return Prescription.at(prescriptionAddress).then(function(instance){
      prescription = instance;
      // console.log(instance);
      return prescription.getPrescriptionData()
    }).then((data) => {
      prescriptionData = web3.toAscii(data);
      return prescription.name()
    }).then((name) => {
      prescriptionName = web3.toAscii(name);
      return prescription.issuingDoctor()
    }).then((doctor) => {
      docAddress = doctor;
      return prescription.getPatientAddress()
    }).then((address) => {
      patientAddr = address
      var verbosePrescription = `Prescription
      NAME: ${prescriptionName}
      PATIENT ADDRESS: ${patientAddr}
      ISSUED BY: ${docAddress}
      DATA: ${prescriptionData}`;
      return verbosePrescription
    }).catch((err) => {
      console.log("The error is", err)
      return err;
    })
  },

  fulfillPrescription: function(prescriptionAddress){
     return Prescription.at(prescriptionAddress).then(function(instance){
      prescription = instance;
      // console.log(instance);
      return prescription.destroy({from: web3.eth.accounts[0]})
    }).then((response) => {
      // console.log(response)
      return response
    }).catch((err) => {
      console.log("The error is", err)
      return err;
    })
  }

}