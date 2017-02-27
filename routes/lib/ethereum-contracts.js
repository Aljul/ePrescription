const Web3                            = require('web3');
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const seed                            = require('./eth-seed.js');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3();
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

// console.log(web3.eth.accounts)


PrescriptionFactory.deployed()
.then((instance) => {
  factory = instance;
  // console.log(factory)
  return factory.owner()
}).then((ownerAddress) => {
  console.log(ownerAddress);
})
.catch((err) => {console.log(err)})



// PrescriptionFactory.deployed()
// .then((instance) => {
//   factory = instance;
//   // console.log(factory)
//   return factory.addToPharmacies("0X29170A1E6D201AE7F03D571524C4F120D217057A", {from: web3.eth.accounts[0]})
// }).then((response) => {
//   console.log(response);
//   console.log(response.logs[0].args)
// })
// .catch((err) => {console.log(err)})



// console.log()
// console.log(web3.eth.getBalance(web3.eth.accounts[0]))

// seed.createPrescriptions(web3, PrescriptionFactory, Prescription);
seed.populatePrescriptionFactory(web3, PrescriptionFactory, Prescription);
