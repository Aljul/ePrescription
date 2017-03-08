require("dotenv").config({path: './../../.env'});
const Web3                            = require('web3');
const EthereumTx                      = require('ethereumjs-tx')
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const seed                            = require('./eth-seed.js');
const encryption                      = require('./encryption.js');
// var provider = new Web3.providers.HttpProvider("http://localhost:4000");


const web3   = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:4000'));
// web3.setProvider(new web3.providers.HttpProvider(process.env.TUNNEL));
// var provider = new Web3.providers.HttpProvider("http://localhost:8545");
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:4000'));

// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys
web3.setProvider(new web3.providers.HttpProvider('http://lhl3a6m5u.eastus.cloudapp.azure.com:8545'));
var provider = new Web3.providers.HttpProvider('http://lhl3a6m5u.eastus.cloudapp.azure.com:8545');

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
    return contractInstance.createPrescription(prescriptionName, prescriptionData, patientAddress, {from: web3.eth.accounts[0], gas: GAS, gasPrice: web3.toHex(10)})
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
    const privateKey = Buffer.from(decoded, 'hex')

    let secret = encryption.generateSecret();

    console.log("the secret is", secret)
    let encryptedPrescription = encryption.createCipher(secret, prescriptionData);
    console.log(web3.eth.getBalance(doctorKeys.public_key))

    console.log("THE PUBLIC KEY IS", doctorKeys.public_key)
    var contractInstance;
    return PrescriptionFactory.deployed().then((instance) => {
      // console.log(instance)
      contractInstance = instance;
      // console.log(contractInstance)
      return contractInstance.createPrescription.request(prescriptionName, encryptedPrescription, patientAddress, {gas: GAS, gasPrice: web3.toHex(10)})
      })
      .then((data) => {
      var rawTx = data.params[0];
      console.log(web3.eth.getTransactionCount(doctorKeys.public_key))
      var nonce = web3.eth.getTransactionCount(doctorKeys.public_key)
      console.log(nonce)
      rawTx.from = doctorKeys.public_key,
      rawTx.to = contractInstance.address;
      rawTx.nonce = web3.toHex(nonce)
      // rawTxgasPrice: '0x0918 4e72a000'
      rawTx.gasLimit = web3.toHex(100)
      rawTx.value = '0x00'
      rawTx.gas = web3.toHex(GAS);
      console.log(web3.eth.estimateGas(rawTx))
      var tx = new EthereumTx(rawTx);
      console.log(tx)
      tx.sign(privateKey);
      // console.log(privateKey)
      var serializedTx = tx.serialize();
      console.log(tx.validate())
      return web3.eth.sendRawTransaction('0x' + serializedTx.toString("hex"))
      })
      .then((result) => {
      console.log("this is the result",result)
      return {txHash: result.toString("hex"), secret: secret};
      })
      .catch((err) => {
      console.log("THe error is: >>>>>>>>>", err)
      throw err;
    })

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
    console.log("HIII")
    console.log(prescriptionAddress)
   return Prescription.at(prescriptionAddress).then(function(instance){
    console.log("HIII")
      prescription = instance;
      // console.log(instance);
      return prescription.getPrescriptionData()
    }).then((data) => {
      console.log("the data is",data)
      prescriptionData = data
      return prescription.name()
    }).then((name) => {
      console.log(name)
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
      console.log("The error happened in printing the prescription", err)
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