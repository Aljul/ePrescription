pragma solidity ^0.4.4;

contract Prescription {

  bytes32 public Astring;
  bytes32 public name;
  address public owner;

  function Prescription(bytes32 prescriptionName, address from) {
    Astring = "hi";
    prescriptionName = name;
    owner = from;

    // constructor
  }

}


// PrescriptionFactory.deployed().then((r) => {r.createPrescription("thename").then((a)=> {return console.log(a)})})