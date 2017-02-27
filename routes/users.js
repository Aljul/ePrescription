"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // ***** GET routes *****

  router.get("/", (req, res) => {
    res.render("users");
  });

  router.get("/:id", (req, res) => {
    let user_id = req.params.id;
    res.render("user_details", { user_id: user_id });
  });

  // ***** POST routes *****

  router.post("/new", (req, res) => {
    res.send("post to /users/new worked");
  });

  return router;
}
