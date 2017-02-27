"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // ***** GET routes *****

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

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    let emailField = req.body.email;
    let pwField = req.params["password"];
    req.session["user_id"] = "test_id";
    res.send(`
      post to /login worked.\n
      user_id = ${req.session["user_id"]}\n
      and email = ${emailField}
      and password = ${pwField}
    `);
  });

  return router;
}
