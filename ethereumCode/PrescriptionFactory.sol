pragma solidity ^0.4.4;

import "./Prescription.sol";

contract PrescriptionFactory {

  address public owner;
  mapping (address => bool) doctors; // stores public keys of doctors and pharmacies that are trusted
  mapping (address => bool) pharmacies; // can only be added by the owner
  address[] prescriptionAddresses;
  function PrescriptionFactory() {
    // constructor
    owner = msg.sender;
  }

  function addToDoctors(address newAddress) returns (bool done){
    if(msg.sender != owner){
      return false;
    }
    doctors[newAddress] = true;
  }

  function addToPharmacies(address newAddress) returns (bool done){
    if(msg.sender != owner){
      return false;
    }
    pharmacies[newAddress] = true;
  }

  function isDoctorTrusted(address docAddress) constant returns(bool trust){
    return doctors[docAddress];
  }

  function isPharmacyTrusted(address pharmAddress) constant returns(bool trust){
    return pharmacies[pharmAddress];
  }

  function destroy() returns(bool isDestroyed){
    if (msg.sender != owner){
     return false;
    }
    selfdestruct(this);
  }

  function createPrescription() returns(Prescription inside){
    address newPrescription = new Prescription();
    prescriptionAddresses.push(newPrescription);
    // Prescription pres = Prescription(newPrescription);
    // // bytes32 toReturn  = newPrescription.Astring;
    // return pres;

  }
// need to do it in 2 steps, when you make a transaction, it returns the txn receipt and stuff
// so a new accessor function will get what you need.
// make sure to write constant in front of it or it becomes a transaction
  function getInfo(uint i) constant returns(bytes32 ok){
    Prescription p = Prescription(prescriptionAddresses[i]);
    return p.Astring();
  }


}

// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})


// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
// PrescriptionFactory.deployed().then(r => {console.log(r.addToDoctors(0x938fdc87b4b1fa4b83e301abe978569d9c85d636))})
// PrescriptionFactory.deployed().then(r => {console.log(r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
// PrescriptionFactory.deployed().then(r => {console.log(r.addToPharmacies(0x938fdc87b4b1fa4b83e301abe978569d9c85d636))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.isPharmacyTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636).then(console.log))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.owner.call().then(console.log))})
 // PrescriptionFactory.deployed().then(r => {console.log(r.destroy())})
 // PrescriptionFactory.deployed().then(r => {console.log(r.owner.call().then(console.log))})

//  PrescriptionFactory.deployed().then(function(r) {return r.isDoctorTrusted(0x938fdc87b4b1fa4b83e301abe978569d9c85d636)})