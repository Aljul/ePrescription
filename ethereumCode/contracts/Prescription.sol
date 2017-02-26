pragma solidity ^0.4.4;

import "./abstract/AbstractPrescriptionFactory.sol";

contract Prescription {

  AbstractPrescriptionFactory creator;
  bytes32 public name;
  bytes32  public data;
  address public issuingDoctor;
  address patientAddress;


  function Prescription(bytes32 prescriptionName, address doctorAddress, bytes32 thePrescription, address patient) {
    name = prescriptionName;
    issuingDoctor = doctorAddress;
    data = thePrescription;
    creator = AbstractPrescriptionFactory(msg.sender); // keep the reference to the creator contract
    patientAddress = patient;
    log0('hi');
  }

  function getPrescriptionData() constant returns(bytes32){
    return data;
  }

  function isTrusted() returns(bool){
    return creator.isPharmacyTrusted(msg.sender);
  }

  function destroy(){
    if (!creator.isPharmacyTrusted(msg.sender)){
      throw;
    }
    selfdestruct(msg.sender);
  }

}