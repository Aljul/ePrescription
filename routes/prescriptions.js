"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    // if session id correspond a doctor
    res.render("prescriptions");
    // else redirect login
  });

  router.get("/new", (req, res) => {
    res.render("prescription_new");
  });

  router.get("/:id", (req, res) => {
    res.render("prescription_details");
  });

  return router;
}
