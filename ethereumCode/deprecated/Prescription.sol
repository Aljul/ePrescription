pragma solidity ^0.4.4;


contract Prescription {
  PrescriptionFactory creator;
  bytes32 public name;
  string  private data;
  address public issuingDoctor;


  function Prescription(bytes32 prescriptionName, address doctorAddress, string thePrescription) {
    name = prescriptionName;
    issuingDoctor = doctorAddress;
    data = thePrescription;
    creator = PrescriptionFactory(msg.sender);
    log0('hi');
  }

  function getPrescriptionData() returns(string){
    // if(creator.)
    // how to access pharmacies?? from a level up
  }
}

// PrescriptionFactory.deployed().then((r) => {r.createPrescription("thename").then((a)=> {return console.log(a)})})