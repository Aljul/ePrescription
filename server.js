"use strict";

require("dotenv").config();
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const app           = express();
const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const cookieSession = require("cookie-session");
const bodyParser    = require("body-parser");

// seperated Routes for each Resource
const mainRoutes  = require("./routes/main");
const prescriptionsRoutes  = require("./routes/prescriptions");
const usersRoutes  = require("./routes/users");

// set ejs as view engine
app.set("view engine", "ejs");
// use cookie-session
app.use(cookieSession({
  name: "session_id",
  secret: "oss117"
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// connect routes
app.use("/", mainRoutes(knex));
app.use("/prescriptions", prescriptionsRoutes(knex));
app.use("/users", usersRoutes(knex));

// listening on port
app.listen(PORT, () => {
  console.log("ePrescription listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
