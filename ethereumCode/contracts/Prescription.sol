pragma solidity ^0.4.4;

import "./abstract/AbstractPrescriptionFactory.sol";

contract Prescription {

  AbstractPrescriptionFactory creator;
  bytes32 public name;
  string  private data;
  address public issuingDoctor;


  function Prescription(bytes32 prescriptionName, address doctorAddress, string thePrescription) {
    name = prescriptionName;
    issuingDoctor = doctorAddress;
    data = thePrescription;
    creator = AbstractPrescriptionFactory(msg.sender);
    log0('hi');
  }

 function getPrescriptionData() returns(string){
    return data;
  }

 function isTrusted() returns(bool){
    return creator.isPharmacyTrusted(msg.sender);
  }
}