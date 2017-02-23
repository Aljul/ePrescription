pragma solidity ^0.4.4;

contract PrescriptionFactory {

  address public owner;
  mapping (address => bool) doctors; // stores public keys of doctors and pharmacies that are trusted
  mapping (address => bool) pharmacies; // can only be added by the owner

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