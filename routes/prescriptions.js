"use strict";

const express = require('express');
const router  = express.Router();
const eth_connect = require('./lib/ethereum-contracts.js');
module.exports = (knex) => {
  // Require db helpers functions
  const dbHelpers = require('./lib/db_helpers.js')(knex);
  // Require app helpers functions
  const appHelpers = require('./lib/app_helpers.js');

  // ***** GET routes *****

  router.get("/", (req, res) => {
    let user_id = req.user.id;
    let isDoctor = req.user.isDoctor;
    dbHelpers.getUserRxHeadersList(user_id, isDoctor).then((rxHeadersArray) => {
      res.render("prescriptions", { user: req.user, rxHeaders: rxHeadersArray });
    });
  });

  router.get("/new", (req, res) => {
    if (req.user.isDoctor) {
      dbHelpers.getAllUsersIdAndName().then((usersNamesAndId) => {
        res.render("prescription_new", { user: req.user, usersList: usersNamesAndId });
      });
    } else {
      let err = "Only doctors can issue a prescription"
      return res.render("error_page", { err : err })
    }
  });

  router.get("/:id", (req, res) => {
    let rx_id = req.params.id;
    let user_id = req.user.id;
    if (rx_id === "mostrecent") {
      dbHelpers.getMostRecentRxId(user_id).then((result) => {
        if (result[0].id) {
          return dbHelpers.rxObjectBuilder(result[0].id).then((result) => {
            return res.render("prescription_details", { user: req.user, rxObject: result });
          });
        } else { res.redirect("/prescriptions") }
      })
    } else {
      dbHelpers.getPrescriptionById(rx_id).then((rx) => {
        // If user is a doctor, checks if he's a doctor or the patient on the prescription
        if (req.user.isDoctor) {
          dbHelpers.getDoctorIdByUserId(user_id).then((doctor_id) => {
            let userDoctorId = doctor_id;
            if (user_id === rx[0].user_id || userDoctorId === rx[0].doctor_id) {
              return dbHelpers.rxObjectBuilder(rx_id).then((result) => {
                return res.render("prescription_details", { user: req.user, rxObject: result });
              });
            } else {
              let err = "You are not the doctor nor the patient on this prescription";
              return res.render("error_page", { err : err })
            }
          });
        // else if user is not a doctor and is the patient on the prescription, render it
        } else {
          if (user_id === rx[0].user_id) {
            return dbHelpers.rxObjectBuilder(rx_id).then((result) => {
              return res.render("prescription_details", { user: req.user, rxObject: result });
            });
          } else {
            let err = "You are not the patient on this prescription";
            return res.render("error_page", { err : err })
          }
        }
      }).catch((err) => {
        console.log(`${err} for id: ${rx_id}`);
        return res.render("error_page", { err : err })
      });
    }
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    let rxAddress;
    if(!req.user.isDoctor){
      return res.send('Not a doctor, you cannot do this');
    }
    // clause to say that if something is missing in req.body -- then send an error
    for (var key in req.body){
      if (!req.body[key]){
        return res.send('need to be filled')
      }
    }
    console.log(req.body);
    // first check if the patient's public key matches a patient
    let secret;
    dbHelpers.getPatientByPublicKey(req.body.patientPublicKey).then((user) => {
    // console.log(user)
      if (!user.length) {
        throw "No user with that public key"
      }
      return dbHelpers.getDrugId(req.body.drugName)
    }).then(() => {
      return dbHelpers.getDoctorKeys(req.user.id)
    }).then((keys) => {
      let prescriptionData = {
        drugName: req.body.drugName.toLowerCase(),
        quantity:  req.body.quantity,
        measurement: req.body.measurement,
        frequency: req.body.frequency,
        note: req.body.note,
        patientPublicKey: req.body.patientPublicKey
      }
      console.log(keys)
      return eth_connect.publishPrescriptionSIGNED(req.body.patientPublicKey, keys, req.body.password, JSON.stringify(prescriptionData), "NAhMrereE")
    }).then((txObject) => {
      secret = txObject.secret;
      console.log(txObject.txHash)
      console.log("the prescription has been published")
      // console.log(txHash.toString("hex"))
      var txDetails = eth_connect.getTransactionReceipt(txObject.txHash)
      var count = 0
      while(!txDetails){
        count++;
        txDetails = eth_connect.getTransactionReceipt(txObject.txHash)
      }
      console.log("the tx details are", txDetails)
      console.log(count)
      // eth_connect.getTransactionReceipt( txHash, function(err, result){
      //   console.log("the receipt actually is" ,result)
      // })
      // console.log(txDetails)
       rxAddress = txDetails.logs[0].address;
       console.log(rxAddress)
      return eth_connect.printPrescription(rxAddress)
    })
    .then((printedRx) => {
      console.log(printedRx)
      return printedRx
    })
    .then(() => {
      req.body["rx_address"] = rxAddress;
      req.body["secret"] = secret
    // Add the prescription to our database
    return dbHelpers.createFullRx(req.user, req.body)
    })
    .then((prescriptionId) => {
      return res.redirect(`${prescriptionId}`)
    })
    .catch((err) => {
      let errMsg = `There was an error while adding the prescription to the blockchain or our DB: ${err}`;
      return res.render("error_page", { err : errMsg })
    })
  });

  return router;
}





// dbHelpers.getDoctorKeys(req.user.id)
//   .then((keys) => {
// return eth_connect.publishPrescription(req.body.patientPublicKey, keys, req.body.password, JSON.stringify(req.body), "tedewst")
// })
// .then((address) => {
//   console.log("the address is:",address)
//   return eth_connect.printPrescription(address)
// })
// .then(console.log)

// Add the prescription to the blockchain
// console.log(JSON.stringify(req.body))


//RETRIVE ALL PRESCRIPTIONS LINKED OT A PATIENT

  // console.log(address)
  // eth_connect.printPrescription("0x3d90d98b5903e07b499312a7817cfa5d7b931f37")
  // .then(console.log)

    // let drugName = req.body.drugName;
    // let Rx = {
    //   quantity: req.body.quantity,
    //   measurement: req.body.measurement,
    //   frequency: req.body.frequency,
    //   note: req.body.note
    // }
    // // console.log(req)
    // dbHelpers
    // .getUserByPublicKey("0x6f46cf5569aefa1acc1009290c8e043747172d89")
    // .catch((err) => {console.log("the error is in the public key", err)})

    // dbHelpers
    // .createRxTemplate(req.user.id, req.body.patientPublicKey, "active")
    // .then(() => {
    //   console.log('hti')
    //   return dbHelpers.createRxDetails(Rx, drugName)
    // })
    // .catch((err) => {
    //   console.log("Error while trying to add a prescription to the database:", err);
    // })
