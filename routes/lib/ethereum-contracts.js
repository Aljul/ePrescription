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
const GAS = 4000000
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

  publishPrescription: function(patientAddress, prescriptionData, prescriptionName){
     PrescriptionFactory.deployed().then((instance) => {
    // console.log(instance.createPrescription.request(prescriptionName, prescriptionData, patientAddress))
    })
   return PrescriptionFactory.deployed().then(function(instance){
    var contractInstance = instance;
    return contractInstance.createPrescription(prescriptionName, prescriptionData, patientAddress, {from: web3.eth.accounts[0], gas: GAS})
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

    const decoded = encryption.decipher(docPassword, doctorKeys.priv_key)

    console.log(decoded)
    const privateKey = Buffer.from(decoded, 'hex')

    return PrescriptionFactory.deployed().then((instance) => {
      let contractInstance = instance;
      // console.log(contractInstance)
      return contractInstance.createPrescription.request(prescriptionName, prescriptionData, patientAddress, {from: doctorKeys.public_key, gas: GAS})
      })
      .then((data) => {
      // console.log(data.params)
      var rawTx = data.params[0];
      var tx = new EthereumTx(rawTx);
      // console.log(tx)
      tx.sign(privateKey);
      // console.log(privateKey)
      var serializedTx = tx.serialize();
      balance = web3.eth.getBalance("0xeab9085c947bf296aa20d8301061659f0f100628")
      // console.log(balance)
      return web3.eth.sendRawTransaction(serializedTx.toString("hex"))
      })
      .then((result) => {
      // console.log("this is the result",result)
      return result;
      })
      .catch((err) => {
      console.log("THe error is: >>>>>>>>>", err)
      throw err;
    })
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
      // console.log(instance)
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

  getTransactionReceipt: function(txHash){
    return web3.eth.getTransactionReceipt(txHash)
  },

  getPrescriptionData: function(prescriptionAddress){
    return Prescription.at(prescriptionAddress).then(function(instance){
      prescription = instance;
      // console.log(instance);
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