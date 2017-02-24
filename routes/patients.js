"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    let patientId = req.params.id;
    res.render("patients", { patientId: patientId });
  });

  router.get("/login", (req, res) => {
    res.render("login", { patient: true });
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
}
