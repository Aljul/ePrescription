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
    // if logged in, render. Else render to login page
    if (req.session["pharmacy"]) {
      let pharmacy = req.pharmacy;
      res.render("pharmacy_checkout", { pharmacy : pharmacy });
    } else {
      res.redirect("login");
    }
  });

  router.get("/login", (req, res) => {
    // if logged in, redirect. Else render login page
    if (req.session["pharmacy"]) {
      res.redirect("/pharmacies");
    } else {
      let pharmacy = req.pharmacy;
      res.render("pharmacies_login", { pharmacy : pharmacy });
    }
  });

  router.get("/logout", (req, res) => {
    req.session["pharmacy"] = null;
    res.redirect('login');
  });

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let email = req.body.email;
    let password = req.body.password;
    dbHelpers.logInPharmacy(email, password, function(pharmacyObject, err) {
      if (err) { return res.render("error_page", { err : err }) }
      appHelpers.buildPharmacyCookie(req, pharmacyObject);
      res.redirect("/pharmacies");
    });
  });

  return router;
}
