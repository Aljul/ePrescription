"use strict";

const express = require("express");
const router  = express.Router();
const bcrypt  = require('bcrypt');

module.exports = (knex) => {

  // ***** GET routes *****

  router.get("/", (req, res) => {
    if (req.session["user_id"]) {
      //(check if doctor or patient)
      knex
        .select("first_name", "last_name")
        .from("users")
        .where("id", req.session["user_id"])
        .then((result) => {
          let username = `${result[0].first_name} ${result[0].last_name}`;
          res.render("main", { username: username });
        });
    } else { res.redirect("login"); }
  });

  router.get("/login", (req, res) => {
    if (!req.session["user_id"]) {
      res.render("login");
    } else { res.redirect("/"); }
  });

  router.get("/logout", (req, res) => {
    req.session["user_id"] = null;
    res.redirect('/login');
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    // add escape function later
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
          req.session["user_id"] = result[0].id;
          res.redirect("/");
        } else {
          res.status(401).send("invalid password!");
        }
      });
  });

  return router;
}
