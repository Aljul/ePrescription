"use strict";

const express = require("express");
const router  = express.Router();
const bcrypt  = require('bcrypt');

module.exports = (knex) => {

  // ***** GET routes *****

  router.get("/", (req, res) => {
    if (req.session["user"]) {
      //(check if doctor or patient)
      res.render("main", { user: req.user });
    } else { res.redirect("login"); }
  });

  router.get("/login", (req, res) => {
    if (!req.session["user"]) {
      res.render("login", { user: req.user });
    } else { res.redirect("/"); }
  });

  router.get("/logout", (req, res) => {
    req.session["user"] = null;
    res.redirect('/login');
  });

  router.get("/register", (req, res) => {
    res.render("register", { user: req.user });
  });

  //  ***** POST routes *****

  // When you log in, user info are stored in JSON object req.session["user"].
  // This info is parsed in middleware.js to be called easily in views
  router.post("/login", (req, res) => {
    // add escape function later
    let emailField = req.body.email;
    let pwField = req.body.password;
    knex
      .select("id", "password_digest", "first_name", "last_name", "isDoctor")
      .from("users")
      .where("email", emailField)
      .then((result) => {
        if (!result[0]) {
          res.send("invalid email");
        } else if (result[0] && bcrypt.compareSync(pwField, result[0].password_digest)) {
          req.session["user"] = JSON.stringify({
            id: result[0].id,
            username: `${result[0].first_name} ${result[0].last_name}`,
            isDoctor: result[0].isDoctor
          });
          res.redirect("/");
        } else {
          res.status(401).send("invalid password!");
        }
      });
  });

  return router;
}
