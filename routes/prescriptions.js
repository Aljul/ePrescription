"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // ***** GET routes *****

  router.get("/", (req, res) => {
    // if session id correspond a doctor
    res.render("prescriptions");
    // else redirect login
  });

  router.get("/new", (req, res) => {
    res.render("prescription_new");
  });

  router.get("/:id", (req, res) => {
    let prescription_id = req.params.id;
    res.render("prescription_details", { prescription_id: prescription_id });
  });

  //  ***** POST routes *****
  
  router.post("/new", (req, res) => {
    res.send("post to prescriptions/new worked");
  });

  return router;
}
