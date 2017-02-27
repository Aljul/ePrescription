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
    console.log(`emailField: ${emailField}`);
    knex
      .select("id", "password_digest")
      .from("users")
      .where("email", emailField)
      .then((result) => {
        console.log("knex query worked");
        console.log(`result: ${result}`);
        console.log(`result[0]: ${result[0]}`);
        console.log(JSON.stringify(result));
        if (result[0]) {
          var passwordOK = bcrypt.compareSync(pwField, result[0].password_digest);
          if (passwordOK) {
            console.log("passwordOK === true");
            req.session["user_id"] = result[0].user_id;
            res.send(`
              emailField: ${emailField}\n
              pwField: ${pwField}\n
              user_id: ${result[0].user_id}
            `)
          }
        } else if (!result[0]) {
          res.send("invalid email");
        }
          else res.status(401).send("invalid password!");
      });
  });

  return router;
}
