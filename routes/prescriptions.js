"use strict";

const express = require('express');
const router  = express.Router();

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
    //check if :id === "mostRecent" and if so, render prescription_id: mostRecentRx() ou dekoi de mm
    //2e function qui get les details de la prescription qu'on lui pousse l'id en parametre ?
    //  genre result de mostRecentRx pour l'id dans getRxDetails(rx_id) pour populer la view?
    let id_param = req.params.id;
    let user_id = req.user.id;
    let prescription_id;
    if (id_param === "mostrecent") {
      dbHelpers.mostRecentRxId(user_id, (queryResult, err) => {
        if (err) { return res.send(err) }
        prescription_id = queryResult.id;
        res.render("prescription_details", { user: req.user, prescription_id: prescription_id });
      });
    } else {
      prescription_id = id_param
      res.render("prescription_details", { user: req.user, prescription_id: prescription_id });
    }
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    // if(!req.user.isDoctor){
    //   return res.send('Not a doctor, you cannot do this');
    // }

    // console.log(req)
    // clause to say that if something is missing in req.body -- then send an error
    // for (var key in req.body){
    //   if (!req.body[key]){
    //     return res.send('need to be filled')
    //   }
    // }
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

    dbHelpers.createFullRx(req.user, req.body)
    .then(console.log)
    .catch((err) => {
      console.log("There was an error while adding the prescription to the DB:", err);
      return err
    })
    res.send("post to prescriptions/new worked");
  });

  return router;
}
