pragma solidity ^0.4.4;

contract Prescription {

  bytes32 public Astring;
  function Prescription() {
    Astring = "hi";
    // constructor

  }

}


// PrescriptionFactory.deployed().then((r) => {r.createPrescription("thename").then((a)=> {return console.log(a)})})