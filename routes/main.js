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
    if (!req.session["user"]) {
      res.render("register", { user: req.user });
    } else { res.redirect("/"); }
  });

  //  ***** POST routes *****

  // When you log in, user info are stored in JSON object req.session["user"].
  // This info is parsed in middleware.js to be called easily in views
  router.post("/login", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let email = req.body.email;
    let password = req.body.password;
    dbHelpers.logIn(req, res, email, password);
  });

  return router;
}
