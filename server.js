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
const prescriptionsRoutes  = require("./routes/prescriptions");
//const usersRoutes  = require("./routes/users");

// connect routes
app.use("/", mainRoutes(knex));
app.use("/prescriptions", prescriptionsRoutes(knex));
//app.use("/", userRoutes(knex));

// listening on port
app.listen(PORT, () => {
  console.log("ePrescription listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
