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
    // if session id correspond a doctor
    res.render("prescriptions", { user: req.user });
    // else redirect login
  });

  router.get("/new", (req, res) => {
    res.render("prescription_new", { user: req.user });
  });

  router.get("/:id", (req, res) => {
    let rx_id = req.params.id;
    let user_id = req.user.id;
    if (rx_id === "mostrecent") {
      dbHelpers.getMostRecentRxId(user_id).then((result) => {
        if (result[0].id) {
          dbHelpers.rxObjectBuilder(result[0].id).then((rxObject) => {
            res.render("prescription_details", { user: req.user, rxObject: rxObject });
          });
        } else { res.send("You currently have no prescriptions") }
      })
    } else {
      dbHelpers.rxObjectBuilder(rx_id).then((rxObject) => {
        res.render("prescription_details", { user: req.user, rxObject: rxObject });
      });
    }
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    if(!req.user.isDoctor){
      return res.send('Not a doctor, you cannot do this');
    }
    // clause to say that if something is missing in req.body -- then send an error
    for (var key in req.body){
      if (!req.body[key]){
        return res.send('need to be filled')
      }
    }

// // Add the prescription to our database
//     dbHelpers.createFullRx(req.user, req.body)
//     .then(console.log)
//     .catch((err) => {
//       console.log("There was an error while adding the prescription to the DB:", err);
//       return err
//     })

// Add the prescription to the blockchain
console.log(JSON.stringify(req.body))
  dbHelpers.getDoctorKeys(req.user.id)
  .then((keys) => {
    return eth_connect.publishPrescriptionSIGNED(req.body.patientPublicKey, keys, req.body.password, JSON.stringify(req.body), "test")
  }).then(console.log)
  // eth_connect.publishPrescription(req.body.patientPublicKey, req.user.)




    res.send("post to prescriptions/new worked");
  });

  return router;
}







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
