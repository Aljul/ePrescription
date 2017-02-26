pragma solidity ^0.4.4;

import "./Prescription.sol";
contract PrescriptionFactory {

  address public owner;
  mapping (address => bool) doctors; // stores public keys of doctors and pharmacies that are trusted
  mapping (address => bool) pharmacies; // can only be added by the owner
  mapping (address => Prescription[]) patientsPrescriptions;
  Prescription[] prescriptions;


  event addingToDoctors(
    address  _from,
    bytes32  _status);

  event newPrescriptionCreated(
    address _from,
    bytes32 _message,
    address _theAddress);

  function PrescriptionFactory() {
    // constructor
    owner = msg.sender;
  }

  function addToDoctors(address newAddress) returns (bool){
    if(msg.sender != owner){
      return false;
    }
    doctors[newAddress] = true;
    addingToDoctors(msg.sender, "it happened!");
  }

  function addToPharmacies(address newAddress) returns (bool){
    if(msg.sender != owner){
      return false;
    }
    pharmacies[newAddress] = true;
  }

  function isDoctorTrusted(address docAddress) constant returns(bool){
    return doctors[docAddress];
  }

  function isPharmacyTrusted(address pharmAddress) constant returns(bool){
    return pharmacies[pharmAddress];
  }

  function destroy() returns(bool){
    if (msg.sender != owner){
     return false;
    }
    selfdestruct(owner); // change this, self destruct should go back to owner
  }

  function createPrescription(bytes32 name, bytes32 payload, address forWho) returns(Prescription prescriptionAddress){
    // should check if doctor is valid
    Prescription newPrescription = new Prescription(name, msg.sender, payload, forWho); // returns the address to the new contract
    prescriptions.push(newPrescription); // save the address of the newly created prescription in an array
    patientsPrescriptions[forWho].push(newPrescription);// for a specific patient, save its prescription in an artray of prescriptions
    newPrescriptionCreated(msg.sender, 'It happened', newPrescription);
    return newPrescription;
  }
// need to do it in 2 steps, when you make a transaction, it returns the txn receipt and stuff
// so a new accessor function will get what you need.
// make sure to write constant in front of it or it becomes a transaction
// creating a txn
  function getInfo(uint i) constant returns(address){
    Prescription p = Prescription(prescriptions[i]);
    return p.issuingDoctor();
  }

  function getPrescription(uint i) constant returns(Prescription){
    Prescription p = Prescription(prescriptions[i]);
    return p;
  }


  function getPrescriptionForSpecificPatient(address patient, uint index) constant returns (address){
    return patientsPrescriptions[patient][index];
  }

  function getLatestPrescriptionForPatient(address patient) constant returns (address){
    uint length;
    length = patientsPrescriptions[patient].length;
    return patientsPrescriptions[patient][length - 1];
    }

}