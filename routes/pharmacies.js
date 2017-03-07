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
    let pharmacy = "test";
    res.render("pharmacy_checkout", { user : req.user, phamarcy : pharmacy });
  });

  router.get("/login", (req, res) => {
    // if !phamarcy cookie, else redirect to "/"
    res.render("pharmacies_login", { user: req.user });
  });

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let email = req.body.email;
    let password = req.body.password;
    dbHelpers.logInPharmacy(email, password, function(userObject, err) {
      if (err) { return res.send(err) }
      //appHelpers.buildUserCookie(req, userObject);
      res.redirect("/pharmacies");
    });
  });


  return router;
}
