require("dotenv").config({path: './../../.env'});
const Web3                            = require('web3');
const contract                        = require("truffle-contract");
const seed                            = require('./eth-seed.js');
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const rpcCalls                        = require('./ethereum-contracts.js');
const web3   = new Web3();
// var provider = new Web3.providers.HttpProvider("http://localhost:8545");
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var provider = new Web3.providers.HttpProvider('http://lhl3a6m5u.eastus.cloudapp.azure.com:8545');
web3.setProvider(new web3.providers.HttpProvider('http://lhl3a6m5u.eastus.cloudapp.azure.com:8545'));
// var provider = new Web3.providers.HttpProvider("http://localhost:4000");
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:4000'));

// set the contract abstractions so we can directly call their functions
const PrescriptionFactory         = contract(PrescriptionFactoryJSON);
const Prescription                = contract(PrescriptionJSON);
const AbstractPrescriptionFactory = contract(AbstractPrescriptionFactoryJSON);
const GAS = 4500000
// set their providers (right now testrpc)
PrescriptionFactory.setProvider(provider);
Prescription.setProvider(provider);
AbstractPrescriptionFactory.setProvider(provider);

// web3.setProvider(new web3.providers.HttpProvider('http://localhost:4000'));
// web3.personal.unlockAccount(web3.eth.accounts[0], process.env.ETH_ACCOUNT_PASSWORD, 1000)
// web3.personal.unlockAccount(web3.eth.accounts[1], process.env.ETH_ACCOUNT_PASSWORD)
// web3.personal.unlockAccount(web3.eth.accounts[2], process.env.ETH_ACCOUNT_PASSWORD)
// web3.personal.unlockAccount(web3.eth.accounts[3], process.env.ETH_ACCOUNT_PASSWORD)
// // connect web3 to the testrpc, so you get all the test accounts with valid public/private keys
let prescriptionAddress;
seed.deployContracts(web3, PrescriptionFactory, Prescription)
.then(() => {
  seed.initializeAddresses(web3)
})
.then(() => {
  return seed.populatePrescriptionFactory(web3, PrescriptionFactory, Prescription)
})
.then((address) => {
  prescriptionAddress = address
  return seed.createPrescriptions(web3, PrescriptionFactory, Prescription);
})
.then(() => {
  return rpcCalls.printPrescription(prescriptionAddress)
}).then(console.log)
