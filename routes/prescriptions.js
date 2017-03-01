"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

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
    let prescription_id = req.params.id;
    res.render("prescription_details", { user: req.user, prescription_id: prescription_id });
  });

  //  ***** POST routes *****

  router.post("/new", (req, res) => {
    console.log(req)
    // if(!req.user.isDoctor){
    //   return res.send('Not a doctor, you cannot do this');
    // }


    // clause to say that if something is missing in req.body -- then send an error
    // for (var key in req.body){
    //   if (!req.body[key]){
    //     return res.send('need to be filled')
    //   }
    // }

    res.send("post to prescriptions/new worked");
  });

  return router;
}
