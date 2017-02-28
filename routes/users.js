"use strict";

const express = require("express");
const router  = express.Router();

module.exports = (knex) => {
  // Require db helpers functions
  const dbHelpers = require("./lib/db_helpers.js")(knex);
  // Require app helpers functions
  const appHelpers = require("./lib/app_helpers.js")();

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
    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirmation = req.body.passwordConfirmation;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let address = req.body.address;
    let phone = req.body.phone;
    let birthdate = req.body.birthdate;
    if (email && password && passwordConfirmation && firstName && lastName && address && phone && birthdate) {
      dbHelpers.emailAvailable(req, res, email).then((response) => {
        if (response === true) {
          if (password === passwordConfirmation) {
            appHelpers.hashElement(password).then((response) => {
              knex("users")
              .insert([
                {email: email},
                {password_digest: response},
                {first_name: firstName},
                {last_name: lastName},
                {address: address},
                {phone: phone},
                {birthdate: birthdate}
              ]).then(() => {
                console.log('New user successfully inserted in DB');
                dbHelpers.logIn(req, res, email, password);
              });
            });
          } else { res.send("passwords do not match") }
        } else { res.send("email already exists") }
    });
  } else { res.send("please fill all the fields") }
  });

  return router;
}
