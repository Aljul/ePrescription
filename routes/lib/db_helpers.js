const bcrypt  = require('bcrypt');

// Here goes db functions that require database interaction
module.exports = function makeDbHelpers(knex) {
  return {

    // Returns false if email is already in database
    emailAvailable: function(req, res, email) {
      return knex
      .select("email")
      .from("users")
      .where("email", email)
      .then((result) => {
        return result[0] ? false : true;
      });
    },

    // Build user cookie with his info upon login
    logIn: function(req, res, email, password) {
      return knex
      .select("id", "password_digest", "first_name", "last_name", "isDoctor")
      .from("users")
      .where("email", email)
      .then((result) => {
        if (!result[0]) {
          res.send("invalid email");
        } else if (result[0] && bcrypt.compareSync(password, result[0].password_digest)) {
          req.session["user"] = JSON.stringify({
            id: result[0].id,
            username: `${result[0].first_name} ${result[0].last_name}`,
            isDoctor: result[0].isDoctor
          });
          res.redirect("/");
        } else {
          res.status(401).send("invalid password!");
        }
      });
    }

  }
}
