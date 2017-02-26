pragma solidity ^0.4.4;

contract AbstractPrescriptionFactory{

  function PrescriptionFactory();
  function addToDoctors(address newAddress) returns (bool);
  function addToPharmacies(address newAddress) returns (bool);
  function isDoctorTrusted(address docAddress) constant returns(bool);
  function isPharmacyTrusted(address pharmAddress) constant returns(bool);
  function destroy() returns(bool);
  function createPrescription(bytes32 name) returns(address);
  function getInfo(uint i) constant returns(address);
  // function getPrescription(uint i) constant returns(Prescription);
}