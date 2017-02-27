pragma solidity ^0.4.4;


contract Prescription {

  bytes32 public name;
  string  private data;
  address public issuingDoctor;



  function Prescription(bytes32 prescriptionName, address doctorAddress, string thePrescription) {
    name = prescriptionName;
    issuingDoctor = doctorAddress;
    data = thePrescription;
    log0('his');
  }

  function getPrescriptionData() returns(address){
    // if(creator.)
    // how to access pharmacies?? from a level up
  }
}


// PrescriptionFactory.deployed().then((r) => {r.createPrescription("thename").then((a)=> {return console.log(a)})})