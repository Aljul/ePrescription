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

    let rx_id = req.params.id;
    let user_id = req.user.id;
    let prescription_id;

    //*** TEST ****
    dbHelpers.getRxById(rx_id).then((result) => {
      console.log("getRxById fct :");
      console.log(result[0]);
    });

    res.render("prescription_details", { user: req.user });
    //*** END TEST ***

    // if (rx_id === "mostrecent") {
    //   dbHelpers.getMostRecentRxId(user_id).then((result) => {
    //     if (result[0].id) {
    //       //passer result[0].id dans getFullRx()
    //     } else { res.send("You currently have no prescriptions") }
    //   })
    //   res.render("prescription_details", { user: req.user });
    // } else {
    //   prescription_id = rx_id
    //   passer rx_id a getFullRx()
    //   res.render("prescription_details", { user: req.user });
    // }
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    // if(!req.user.isDoctor){
    //   return res.send('Not a doctor, you cannot do this');
    // }


    // clause to say that if something is missing in req.body -- then send an error
    // for (var key in req.body){
    //   if (!req.body[key]){
    //     return res.send('need to be filled')
    //   }
    // }
    let drugName = req.body.drugName;
    let Rx = {
      quantity: req.body.quantity,
      measurement: req.body.measurement,
      frequency: req.body.frequency,
      note: req.body.note
    }
    console.log(req)

    // dbHelpers.createRx(Rx, drugName, function(){console.log("done!")})
    res.send("post to prescriptions/new worked");
  });

  return router;
}
