const Web3                            = require('web3');
const contract                        = require("truffle-contract");
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3   = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys

const rpcCalls= require('./ethereum-contracts.js');

// seed if testrpc is clean
var accountTotal = web3.eth.getBalance(web3.eth.accounts[0]).toNumber();


  rpcCalls.seedPrescriptionFactory().then(() => {

  return rpcCalls.seedPrescriptions();
  }).then( () => {



rpcCalls.publishPrescription(web3.eth.accounts[2], web3.eth.accounts[1], "this is the prescripiton", 'name').then(console.log)

rpcCalls.publishPrescription(web3.eth.accounts[2], web3.eth.accounts[1], "this is the prescripiton", 'name').then(console.log)

rpcCalls.retrieveAllPrescriptionAddresses(web3.eth.accounts[3], web3.eth.accounts[0])

rpcCalls.retrieveLatestPrescriptionAddress(web3.eth.accounts[3], web3.eth.accounts[0])


rpcCalls.retrieveLatestPrescriptionAddress(web3.eth.accounts[3], web3.eth.accounts[0])
.then((address) => {
  return rpcCalls.getPrescriptionData(address)
}).then((data) => {

  console.log(data);
})

rpcCalls.retrieveLatestPrescriptionAddress(web3.eth.accounts[2], web3.eth.accounts[0])
.then((address) => {
  // console.log(address)
  return rpcCalls.printPrescription(address)
}).then((data) => {
  console.log(data);
})


rpcCalls.retrieveLatestPrescriptionAddress(web3.eth.accounts[2], web3.eth.accounts[0])
.then((address) => {
  theAddress = address;
  // console.log(address)
  return rpcCalls.printPrescription(theAddress)
}).then(() => {
  return rpcCalls.fulfillPrescription(theAddress)
}).then((response) => {
  console.log(response);
})

})