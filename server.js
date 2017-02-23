"use strict";

require("dotenv").config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const app         = express();
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

app.set("view engine", "ejs");

// seperated Routes for each Resource
const mainRoutes  = require("./routes/main");

// connect routes
app.use("/", mainRoutes(knex));

// prepare server for bootstrap
app.use("/js", express.static("./node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static("./node_modules/jquery/dist")); // redirect JS jQuery
app.use("/css", express.static("./node_modules/bootstrap/dist/css")); // redirect CSS bootstrap

// listening on port
app.listen(PORT, () => {
  console.log("ePrescription listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
