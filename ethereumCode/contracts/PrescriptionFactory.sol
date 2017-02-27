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
    string  _status);

  event addingToPharmacies(
    address  _from,
    string  _status);

  event newPrescriptionCreated(
    address _from,
    bytes32 _message,
    address _theAddress);


  function PrescriptionFactory() {
    // constructor
    owner = msg.sender;
    doctors[owner] = true; // the creators of the contract are trusted to create prescription
    pharmacies[owner] = true; // the creators of the contract are trusted to look at prescriptions and destroy them
  }

  function addToDoctors(address newAddress) returns (bool){
    if(msg.sender != owner){
      // throw; // shoulw be throw, this is here for testing only
      return false;
    }
    doctors[newAddress] = true;
    addingToDoctors(msg.sender, "Adding to doctors mapping successful!");
  }

  function addToPharmacies(address newAddress) returns (bool){
    if(msg.sender != owner){
      //throw;
      return false;
    }
    pharmacies[newAddress] = true;
    addingToPharmacies(msg.sender, "Added to Pharmacies mapping successful");
  }

 function destroy() returns(bool){
    if (msg.sender != owner){
     // throw;
     return false;
    }
    selfdestruct(owner);
  }

  function createPrescription(bytes32 name, bytes32 payload, address forWho) returns(Prescription prescriptionAddress){
    // should check if doctor is valid, then he can make prescriptions
    // if(!isDoctorTrusted(msg.sender)) throw;

    Prescription newPrescription = new Prescription(name, msg.sender, payload, forWho); // returns the address to the new contract
    prescriptions.push(newPrescription); // save the address of the newly created prescription in an array
    patientsPrescriptions[forWho].push(newPrescription);// for a specific patient, save its prescription in an artray of prescriptions, will probably keep this one in the future
    newPrescriptionCreated(msg.sender, 'Prescription created', newPrescription);
    return newPrescription;
  }

  //// CONSTANT FUNCTIONS, DOES NOT MAKE A TRANSACTION

  function isDoctorTrusted(address docAddress) constant returns(bool){
    return doctors[docAddress];
  }

  function isPharmacyTrusted(address pharmAddress) constant returns(bool){
    return pharmacies[pharmAddress];
  }
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

  function getAllPrescriptionsForPatient(address patient) constant returns(Prescription[]){
    Prescription[] allPrescriptions = patientsPrescriptions[patient];
    return allPrescriptions;
  }

}