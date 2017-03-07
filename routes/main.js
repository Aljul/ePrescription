"use strict";

const express = require("express");
const router  = express.Router();

module.exports = (knex) => {
  // Require db helpers functions
  const dbHelpers = require('./lib/db_helpers.js')(knex);
  // Require app helpers functions
  const appHelpers = require('./lib/app_helpers.js');

  // ***** GET routes *****

  router.get("/", (req, res) => {
    if (req.session["user"]) {
      req.user.isDoctor ? res.redirect("prescriptions/new") : res.redirect("prescriptions/mostrecent");
    } else { res.redirect("login"); }
  });

  router.get("/login", (req, res) => {
    if (!req.session["user"]) {
      res.render("login", { user: req.user });
    } else { res.redirect("/"); }
  });

  router.get("/loginPharmacies", (req, res) => {
    res.render("login_pharmacies", { user : null });
  });

  router.get("/logout", (req, res) => {
    req.session["user"] = null;
    res.redirect('/login');
  });

  router.get("/register", (req, res) => {
    if (!req.session["user"]) {
      res.render("register", { user: req.user });
    } else { res.redirect("/"); }
  });

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let email = req.body.email;
    let password = req.body.password;
    dbHelpers.logIn(email, password, function(userObject, err) {
      if (err) { return res.send(err) }
      appHelpers.buildUserCookie(req, userObject);
      res.redirect("/");
    });
  });

  return router;
}
