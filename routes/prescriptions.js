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
    // if user isn't doctor
    dbHelpers.getUserRxHeadersList(user_id, isDoctor).then((rxHeadersArray) => {
      res.render("prescriptions", { user: req.user, rxHeaders: rxHeadersArray });
    });
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
          dbHelpers.rxObjectBuilder(result[0].id).then((result) => {
            res.render("prescription_details", { user: req.user, rxObject: result });
          });
        } else { res.send("You currently have no prescriptions") }
      })
    } else {
      dbHelpers.rxObjectBuilder(rx_id).then((result) => {
        res.render("prescription_details", { user: req.user, rxObject: result });
      });
    }
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    let prescription_id;

    if(!req.user.isDoctor){
      return res.send('Not a doctor, you cannot do this');
    }
    // clause to say that if something is missing in req.body -- then send an error
    for (var key in req.body){
      if (!req.body[key]){
        return res.send('need to be filled')
      }
    }

// Add the prescription to our database
    dbHelpers.createFullRx(req.user, req.body)
    .then((prescriptionId) => {
      prescription_id = prescriptionId;
    })
    .catch((err) => {
      console.log("There was an error while adding the prescription to the DB:", err);
      return err
    })

// Add the prescription to the blockchain
  dbHelpers.getDoctorKeys(req.user.id)
  .then((keys) => {

    let prescriptionData = {
      drugName: req.body.drugName,
      quantity:  req.body.quantity,
      measurement: req.body.measurement,
      frequency: req.body.frequency,
      note: req.body.note,
      patientPublicKey: req.body.patientPublicKey
    }

    return eth_connect.publishPrescriptionSIGNED(req.body.patientPublicKey, keys, req.body.password, JSON.stringify(prescriptionData), "tedewst")
    })
    .then((result) => {
      var address = eth_connect.getTransactionReceipt(result)
      return eth_connect.printPrescription(address.logs[0].address)
    })
    .then((printedRx) => {
      console.log(printedRx)
      return printedRx
    })
    .catch((err) => {
      console.log(err, "this is it")
      return res.send("you messed up")
   })
    .then(() => {

      return res.redirect(`${prescription_id}`)
    // return res.send("post to prescriptions/new worked");
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
