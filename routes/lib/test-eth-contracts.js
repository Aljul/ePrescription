require("dotenv").config({path: './../../.env'});
const Web3                            = require('web3');
const contract                        = require("truffle-contract");
// var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var provider = new Web3.providers.HttpProvider("http://localhost:4000");
const web3   = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
web3.setProvider(new web3.providers.HttpProvider('http://localhost:4000'));
console.log(web3.personal.unlockAccount)
web3.personal.unlockAccount(web3.eth.accounts[0], process.env.ETH_FIRST_ACCOUNT_PASSWORD, 1000)
web3.personal.unlockAccount(web3.eth.accounts[1], process.env.ETH_ACCOUNT_PASSWORD)
web3.personal.unlockAccount(web3.eth.accounts[2], process.env.ETH_ACCOUNT_PASSWORD)
web3.personal.unlockAccount(web3.eth.accounts[3], process.env.ETH_ACCOUNT_PASSWORD)
// connect web3 to the testrpc, so you get all the test accounts with valid public/private keys
const rpcCalls= require('./ethereum-contracts.js');

// seed if testrpc is clean
var accountTotal = web3.eth.getBalance(web3.eth.accounts[0]).toNumber();

  console.log("start")
  rpcCalls.seedPrescriptionFactory().then(() => {
  console.log("after seeding pfactory")

  return rpcCalls.seedPrescriptions();
  }).then( () => {
  console.log("after seeding presc")

web3.eth.sendTransaction({from: web3.eth.accounts[0], to: "0xeab9085c947bf296aa20d8301061659f0f100628", value: 100000000}, function(err,address){
  if(err){
  console.log("sending txn")

    console.log("The erros is !!!!!!!", err)
  }
  console.log("THE ADDRESS IS HERE" ,address)
  console.log("getting recipt txn")

  web3.eth.getTransactionReceipt(address, function(data){
    console.log("the receipt is")
    console.log(data)
  })
})

web3.eth.sendTransaction({from: web3.eth.accounts[0], to: "0x15ff0ba44ddceb2caee5877b942518bdcc3e08b8", value: 100000000}, function(err,address){
  if(err){
  console.log("sending txn")

    console.log("The erros is !!!!!!!", err)
  }
  console.log("THE ADDRESS IS HERE" ,address)
  console.log("getting recipt txn")

  web3.eth.getTransactionReceipt(address, function(data){
    console.log(data) // will returnn null beacuse transaction is NOT mined in the network
  })
})
  console.log("publish 1")

rpcCalls.publishPrescription(web3.eth.accounts[3], "this is the prescripiton", 'name').then(console.log)

  console.log("publish 2")

rpcCalls.publishPrescription(web3.eth.accounts[3], "this is the prescripiton", 'name').then(console.log)
.catch((err) => {console.log(("The error is ", err))})

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
  // console.log(data);
})


rpcCalls.retrieveLatestPrescriptionAddress(web3.eth.accounts[2], web3.eth.accounts[0])
.then((address) => {
  theAddress = address;
  // console.log(address)
  return rpcCalls.printPrescription(theAddress)
}).then(() => {
  return rpcCalls.fulfillPrescription(theAddress)
}).then((response) => {
  // console.log(response);
})
.catch((err) => {
  console.log("caught error is", err)
})

})