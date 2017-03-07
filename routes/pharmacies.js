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
    res.redirect("login");
    //res.render("pharmacy_checkout", { user : null });
  });

  router.get("/login", (req, res) => {
    res.render("pharmacies_login", { user: req.user });
  });

  //  ***** POST routes *****

  router.post("/login", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let email = req.body.email;
    let password = req.body.password;
    // dbHelpers.logIn(email, password, function(userObject, err) {
    //   if (err) { return res.send(err) }
    //   appHelpers.buildUserCookie(req, userObject);
    //   res.redirect("/");
    // });
  });


  return router;
}
