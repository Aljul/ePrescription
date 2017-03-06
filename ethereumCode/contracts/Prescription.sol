pragma solidity ^0.4.4;

import "./abstract/AbstractPrescriptionFactory.sol";

contract Prescription {

  AbstractPrescriptionFactory creator;
  bytes32 public name;
  string  private data;
  address public issuingDoctor;
  address private patientAddress;


  event destruction(
    address _from,
    bytes32 _message,
    uint _amount);

  function Prescription(bytes32 prescriptionName,address doctorAddress, string  thePrescription,  address patient) {
    name = prescriptionName;
    issuingDoctor = doctorAddress;
    data = thePrescription;
    creator = AbstractPrescriptionFactory(msg.sender); // keep the reference to the creator contract
    patientAddress = patient;
    log0('hi');
  }

  function destroy() {
    if (!creator.isPharmacyTrusted(msg.sender)){
      throw;
    }
    destruction(msg.sender, "Destroying the Prescription", 3);
    selfdestruct(msg.sender);

  }

  function getPrescriptionData() constant returns(string){
    return data;
  }

  function isTrusted() constant returns(bool){
    return creator.isPharmacyTrusted(msg.sender);
  }

   function getPatientAddress() constant returns(address){
    return patientAddress;
  }

}