const bcrypt  = require('bcrypt');
let saltRounds = 10;

// Here goes db functions that require database interaction
module.exports = function makeDbHelpers(knex) {
  return {

    // Checks if email is in database
    emailAvailable: function(req, res, email) {
      return knex
      .select("email")
      .from("users")
      .where("email", email)
    },

    // Build user cookie with his info upon login
    logIn: function(email, password, callback) {
      return knex
      .select("id", "password_digest", "first_name", "last_name", "isDoctor")
      .from("users")
      .where("email", email)
      .then((result) => {
        if (!result[0]) {
          callback(null, "Email is invalid");
        } else if (result[0] && bcrypt.compareSync(password, result[0].password_digest)) {
          callback(result[0], null);
        } else {
          callback(null, "Password is invalid");
        }
      });
    },

    register: function(userObject, callback) {
        knex
        .returning(["id","isDoctor"])
        .insert({
          email: userObject.email,
          password_digest: bcrypt.hashSync(userObject.password, saltRounds),
          first_name: userObject.firstName,
          last_name: userObject.lastName,
          address: userObject.address,
          phone: userObject.phone,
          birthdate: userObject.birthdate
        })
        .into("users")
        .then((result) => {
          // expand user object with returning values and pass it to callback
          userObject.id = result[0].id;
          userObject.isDoctor = result[0].isDoctor;
          callback(userObject);
          console.log("New user successfully added to DB");
        });
    },

    getDrugId: function(drugName){
      return knex
      .select("id")
      .from("drugs")
      .where("name", drugName)
      .then((result) => {
        console.log(result)
        if(result.length === 0){
          throw "Error, drug not found"
        }
        return result;
      })
      .catch((err) => {
        throw err;
      })
    },

    createRx: function(Rx, drugName, callback){
      let prescription = Rx;
      this.getDrugId(drugName)
      .then((drugId) => {
        prescription["drug_id"] = drugId[0].id;
        return knex
        .insert(prescription)
        .into("prescription_details")
      }).then((result) => {

        console.log("New prescripton generated");
        return;
      })
      .catch((err) => {
        console.log(err)
        return err;
      })


    }
  }
}
