const Web3                            = require('web3');
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const seed                            = require('./eth-seed.js');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3   = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys

// set the contract abstractions so we can directly call their functions
const PrescriptionFactory         = contract(PrescriptionFactoryJSON);
const Prescription                = contract(PrescriptionJSON);
const AbstractPrescriptionFactory = contract(AbstractPrescriptionFactoryJSON);

// set their providers (right now testrpc)
PrescriptionFactory.setProvider(provider);
Prescription.setProvider(provider);
AbstractPrescriptionFactory.setProvider(provider);

// seed if testrpc is clean
var accountTotal = web3.eth.getBalance(web3.eth.accounts[0]).toNumber();

if (accountTotal == 99861106200000000000){
  seed.populatePrescriptionFactory(web3, PrescriptionFactory, Prescription);
  seed.createPrescriptions(web3, PrescriptionFactory, Prescription);
}



function publishPrescription(patientAddress, doctorAddress, prescriptionData, prescriptionName){
 return PrescriptionFactory.deployed().then(function(instance){
  var contractInstance = instance;
  return contractInstance.createPrescription(prescriptionName, prescriptionData, patientAddress, {from: doctorAddress, gas: 400000})
 }).then((message) => {
  // console.log(message)
  if(message.logs.length == 0){
    throw 'Something went wrong when creating the prescription';
  }
  // console.log(message.logs[0].args._theAddress);
  return message.logs[0].args._theAddress
 }).catch((err) => {
  console.log(err)
  return err;
  })
}

// publishPrescription(web3.eth.accounts[2], web3.eth.accounts[1], "this is the prescripiton", 'name').then(console.log)

function retrieveAllPrescriptionAddresses(patientAddress, doctorAddress){
  return PrescriptionFactory.deployed().then(function(instance){
  var contractInstance = instance;
  return contractInstance.getAllPrescriptionsForPatient(patientAddress, {from: doctorAddress})
 }).then((message) => {
  // console.log(message)
  return message
 }).catch((err) => {
  console.log(err)
  return err;
  })
}
// retrieveAllPrescriptionAddresses(web3.eth.accounts[3], web3.eth.accounts[0])

function retrieveLatestPrescriptionAddress(patientAddress, doctorAddress){
  return PrescriptionFactory.deployed().then(function(instance){
  var contractInstance = instance;
  return contractInstance.getLatestPrescriptionForPatient(patientAddress, {from: doctorAddress})
 }).then((message) => {
  console.log(message)
  return message
 }).catch((err) => {
  console.log(err)
  return err;
  })
}

// retrieveLatestPrescriptionAddress(web3.eth.accounts[3], web3.eth.accounts[0])

function getPrescriptionData(prescriptionAddress){
  return Prescription.at(prescriptionAddress).then(function(instance){
    prescription = instance;
    console.log(instance);
    return prescription.getPrescriptionData()
  }).then((data) => {
    console.log(data);
    return web3.toAscii(data)
  }).catch((err) => {
    console.log(err)
  return err;
  })
}
// retrieveLatestPrescriptionAddress(web3.eth.accounts[3], web3.eth.accounts[0])
// .then((address) => {
//   return getPrescriptionData(address)
// }).then((data) => {

//   console.log(data);
// })


function printPrescription(prescriptionAddress){
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
}

// retrieveLatestPrescriptionAddress(web3.eth.accounts[2], web3.eth.accounts[0])
// .then((address) => {
//   // console.log(address)
//   return printPrescription(address)
// }).then((data) => {
//   console.log(data);
// })


function fulfillPrescription(prescriptionAddress){
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


// retrieveLatestPrescriptionAddress(web3.eth.accounts[2], web3.eth.accounts[0])
// .then((address) => {
//   // console.log(address)
//   return fulfillPrescription(address)
// }).then((response) => {
//   console.log(response);
// })
