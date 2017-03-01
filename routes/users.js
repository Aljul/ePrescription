"use strict";

const express = require("express");
const router  = express.Router();

module.exports = (knex) => {
  // Require db helpers functions
  const dbHelpers = require("./lib/db_helpers.js")(knex);
  // Require app helpers functions
  const appHelpers = require("./lib/app_helpers.js");

  // ***** GET routes *****

  router.get("/", (req, res) => {
    res.render("users", { user: req.user });
  });

  router.get("/:id", (req, res) => {
    res.render("user_details", { user: req.user });
  });

  // ***** POST routes *****

  // Creater new user on successful registration
  router.post("/new", (req, res) => {
    // add escape function later in app_helpers.js and call it on req.bodys
    let userObject = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phone: req.body.phone,
      birthdate: req.body.birthdate
    }
    // return array of empty keys in userObject
    let emptyKeys = appHelpers.validatesObject(userObject);
    if (!emptyKeys.length) {
      dbHelpers.emailAvailable(req, res, userObject.email).then((result) => {
        if (!result[0]) {
          if (userObject.password === userObject.passwordConfirmation) {
            dbHelpers.register(userObject, function(expandedUserObject) {
              console.log(JSON.stringify(expandedUserObject));
              appHelpers.buildUserCookie(req, expandedUserObject);
              res.redirect("/");
            });
          } else { res.send("passwords do not match") }
        } else { res.send("email already exists") }
      });
    } else { res.send(`missing the following fields ${emptyKeys}`) }
  });

  return router;
}
