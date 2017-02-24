pragma solidity ^0.4.4;

contract Prescription {

  bytes32 public Astring;
  bytes32 public name;

  function Prescription(bytes32 prescriptionName) {
    Astring = "hi";
    prescriptionName = name;
    // constructor
  }

}


// PrescriptionFactory.deployed().then((r) => {r.createPrescription("thename").then((a)=> {return console.log(a)})})