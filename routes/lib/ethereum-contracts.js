const Web3                            = require('web3');
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys

const PrescriptionFactory         = contract(PrescriptionFactoryJSON);
const Prescription                = contract(PrescriptionJSON);
const AbstractPrescriptionFactory = contract(AbstractPrescriptionFactoryJSON);

PrescriptionFactory.setProvider(provider);
Prescription.setProvider(provider);
AbstractPrescriptionFactory.setProvider(provider);

console.log(web3.eth.accounts)


// this would be the actual address where the contract is deployed
const prescriptionFactory_addr = "0x22b3557ebf8061df8e0f96fd31d74017371b6249";


PrescriptionFactory.at(prescriptionFactory_addr)
.then((instance) => {
  factory = instance;
  // console.log(factory)
  return factory.owner()
}).then((ownerAddress) => {
  console.log(ownerAddress);
})
.catch((err) => {console.log(err)})


