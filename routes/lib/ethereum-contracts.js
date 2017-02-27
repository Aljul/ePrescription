const Web3                            = require('web3');
const contract                        = require("truffle-contract");
const PrescriptionFactoryJSON         = require('../../ethereumCode/build/contracts/PrescriptionFactory.json');
const PrescriptionJSON                = require('../../ethereumCode/build/contracts/Prescription.json')
const AbstractPrescriptionFactoryJSON = require('../../ethereumCode/build/contracts/AbstractPrescriptionFactory.json')
const web3 = new Web3();
var provider = new Web3.providers.HttpProvider("http://localhost:8545");


const PrescriptionFactory         = contract(PrescriptionFactoryJSON);
const Prescription                = contract(PrescriptionJSON);
const AbstractPrescriptionFactory = contract(AbstractPrescriptionFactoryJSON);

PrescriptionFactory.setProvider(provider);
Prescription.setProvider(provider);
AbstractPrescriptionFactory.setProvider(provider);


// two random accounts taken from testrpc (9) and (8)
var account_one = "0x0c6fd4d7caf93f82baa678c70ae51dc45f099b6c";
var account_two = "0x76630416aa298a647c558910def6833f711dbd3c";

// this would be the actual address where the contract is deployed
const prescriptionFactory_addr = "0xd6a2628d0cdfc8bf3e1898e87c6f423bb595a6f4";


PrescriptionFactory.at(prescriptionFactory_addr)
.then((instance) => {console.log(instance)})
.catch((err) => {console.log(err)})


