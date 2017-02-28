"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // ***** GET routes *****

  router.get("/", (req, res) => {
    res.render("users", { user: req.user });
  });

  router.get("/:id", (req, res) => {
    res.render("user_details", { user: req.user });
  });

  // ***** POST routes *****

  router.post("/new", (req, res) => {
    res.send("post to /users/new worked");
  });

  return router;
}
