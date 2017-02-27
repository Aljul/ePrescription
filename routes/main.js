"use strict";

const express = require("express");
const router  = express.Router();
const bcrypt  = require('bcrypt');

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
    let pwField = req.body.password;
    knex
      .select("id", "password_digest")
      .from("users")
      .where("email", emailField)
      .then((result) => {
        if (!result[0]) {
          res.send("invalid email");
        } else if (result[0] && bcrypt.compareSync(pwField, result[0].password_digest)) {
          req.session["user_id"] = result[0].user_id;
          res.redirect("/");
        } else {
          res.status(401).send("invalid password!");
        }
      });
  });

  return router;
}
