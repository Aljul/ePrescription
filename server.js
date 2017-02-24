"use strict";

require("dotenv").config();
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const app        = express();
const knexConfig = require("./knexfile");
const knex       = require("knex")(knexConfig[ENV]);

app.set("view engine", "ejs");

// seperated Routes for each Resource
const mainRoutes  = require("./routes/main");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const doctorsRoutes = require("./routes/doctors");

// connect routes
app.use("/", mainRoutes(knex));
app.use("/login", loginRoutes(knex));
app.use("/register", registerRoutes(knex));
app.use("/doctors", doctorsRoutes(knex));

// listening on port
app.listen(PORT, () => {
  console.log("ePrescription listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
