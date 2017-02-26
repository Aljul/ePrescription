"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    // if session id (check if doctor or patient)
    res.render("main");
    // else redirect login
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/logout", (req, res) => {
    res.send("logout");
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
}
