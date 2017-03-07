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
const bcrypt        = require("bcrypt");
// var flash           = require('connect-flash-plus');
const cookieParser  = require('cookie-parser')
// var session         = require('express-session')

// seperated Routes for each Resource
const mainRoutes  = require("./routes/main");
const prescriptionsRoutes  = require("./routes/prescriptions");
const usersRoutes  = require("./routes/users");
const pharmaciesRoutes = require("./routes/pharmacies");

// require our middleware.js
const middleware = require("./routes/lib/middleware")

// set ejs as view engine
app.set("view engine", "ejs");
// use cookie-session

app.use(cookieParser('oss117'));

app.use(cookieSession({
  name: "session_id",
  secret: "oss117"
}));

//TO BE CONTINUED IN THE FUTURE
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(flash());
// parse application/x-www-form-urlencoded
  // app.use(function(req, res, next){
  //     res.locals.success_messages = req.flash('success_messages');
  //     res.locals.error_messages = req.flash('error_messages');
  //     next();
  // });
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// use middleware.js
app.use(middleware);

// connect routes
app.use("/", mainRoutes(knex));
app.use("/pharmacies", pharmaciesRoutes(knex));
app.use("/prescriptions", prescriptionsRoutes(knex));
app.use("/users", usersRoutes(knex));

// listening on port
app.listen(PORT, () => {
  console.log("ePrescription listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
