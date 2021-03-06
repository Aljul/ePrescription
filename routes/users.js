"use strict";

const express = require("express");
const router  = express.Router();
  // Require app helpers functions
  const appHelpers = require("./lib/app_helpers.js");

module.exports = (knex) => {
  // Require db helpers functions
  const dbHelpers = require("./lib/db_helpers.js")(knex);

  // ***** GET routes *****

  router.get("/", (req, res) => {
    if(req.user.isDoctor){
      dbHelpers.getAllPatientsForDoctor(req.user.id)
      .then((result) => {
        return res.render("users", { user: req.user, usersList: result});
      });
    } else {
      dbHelpers.getAllDoctorsForPatient(req.user.id)
      .then((result) => {
        return res.render("users", { user: req.user, usersList: result});
      });
    }
  });

  router.get("/:id", (req, res) => {
    let user_id = req.params.id;
    let user = req.user
    // if the user is a doctor or is trying to view himself, render the page
    if (user.isDoctor || user.id === Number(user_id)) {
      dbHelpers.getUsersDetailsById(user_id).then((result) => {
        res.render("user_details", { user: user, userDetails: result });
      });
    // else he can only see users who are doctors.
    } else {
      dbHelpers.isDoctorById(user_id).then((result) => {
        if (result === true) {
          dbHelpers.getUsersDetailsById(user_id).then((result) => {
            res.render("user_details", { user: user, userDetails: result });
          });
        } else {
          let err = "You are not authorised to view this user";
          return res.render("error_page", { err : err })
        }
      })
    }
  });

  // ***** POST routes *****

  // Creater new user on successful registration
  router.post("/new", (req, res) => {

    // add escape function later in app_helpers.js and call it on req.bodys

    // To avoid bugs, set keys with the same name as their database's counterparts when applicable.
    let userObject = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      address: req.body.address,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      public_key: req.body.public_key
    }
    // return array of empty keys in userObject
    let emptyKeys = appHelpers.validatesObject(userObject);
    if (!emptyKeys.length) {
      dbHelpers.emailAvailable(userObject.email).then((result) => {
        if (!result[0]) {
          if (userObject.password === userObject.passwordConfirmation) {
            dbHelpers.register(userObject, function(expandedUserObject) {
              appHelpers.buildUserCookie(req, expandedUserObject);
              res.redirect("/");
            });
          } else {
            let err = "Passwords do not match";
            return res.render("error_page", { err : err })
          }
        } else {
          let err = "Email already exists";
          return res.render("error_page", { err : err })
        }
      });
    } else {
      let missingFields = "";
      for (let i = 0; i < emptyKeys.length; i++) {
        emptyKeys[i] === "public_key" ? missingFields += "Patient's Address<br>" : missingFields += `${emptyKeys[i]}<br>`;
      }
      let err = `<b>Make sure to fill all of the following fields</b><br>${missingFields}`;
      return res.render("error_page", { err : err })
    }
  });

  return router;
}
