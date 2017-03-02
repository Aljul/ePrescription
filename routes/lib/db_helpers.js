const bcrypt  = require('bcrypt');
let saltRounds = 10;

// Here goes db functions that require database interaction
module.exports = function makeDbHelpers(knex) {
  return {

    // Checks if email is in database
    emailAvailable: function(email) {
      return knex
      .select("email")
      .from("users")
      .where("email", email)
    },

    // Get most recent prescription for user_id
    getMostRecentRxId: function(user_id) {
      return knex("prescriptions")
      .max("id as id")
      .where("user_id", user_id)
    },

    // Return prescription by prescriptions.id
    getRxById: function(rx_id) {
      return knex("prescriptions")
      .where("id", rx_id)
      .then((result) => {
        if(result.length === 0){
          throw "There's no prescription with this id"
        }
        return result[0];
      })
      .catch((err) => {
        throw err;
      })
    },

    // Get prescription_details for prescriptions.id = rx_id
    getRxDetailsById: function(rx_id) {
      return knex("prescription_details")
      .where("prescription_id", rx_id)
      .then((result) => {
        if(result.length === 0){
          throw "There's no prescription details with this id"
        }
        return result;
      })
      .catch((err) => {
        throw err;
      })
    },

    // Get fist and last name of a user corresponding to user_id
    getUserNameById: function(user_id) {
      return knex
      .select("first_name", "last_name")
      .from("users")
      .where("id", user_id)
      .then((result) => {
        if(result.length === 0){
          throw "Error, user not found"
        }
        return result[0];
      })
    },

    // Get name (in users table) of the doctor with corresponding doctor_id
    getDoctorNameById: function(doctor_id) {
      return knex
      .select("user_id")
      .from("doctors")
      .where("id", doctor_id)
      .then((result) => {
        if(result.length === 0){
          throw "Error, doctor not found"
        }
        return this.getUserNameById(result[0].user_id)
      })
    },

    // Return name of drug assigned to id
    getDrugNameById: function(drug_id){
      return knex
      .select("name")
      .from("drugs")
      .where("id", drug_id)
      .then((result) => {
        if(result.length === 0){
          throw "Error, drug not found"
        }
        return result[0];
      })
    },

    rxObjectDetailsBuilder: function (rxDetails) {
      let rxDetailsObject = {};
      return this.getDrugNameById(rxDetails["drug_id"]).then((getDrugNameByIdResult) => {
        rxDetailsObject.drugName = getDrugNameByIdResult["name"];
      }).then(() => {
        rxDetailsObject.quantity = rxDetails.quantity
        rxDetailsObject.measurement = rxDetails.measurement
        rxDetailsObject.frequency = rxDetails.frequency
        rxDetailsObject.note = rxDetails.note
        //rxObject.rxDetails.push(rxDetailsObject);
        return rxDetailsObject
      });
    },

    // Returns object with user-friendly data about a prescription
    rxObjectBuilder: function(rx_id) {
      let rxObject = {};
      return this.getRxById(rx_id).then((getRxByIdResult) => {
        rxObject.status = getRxByIdResult["status"];
        rxObject.createdAt = getRxByIdResult["created_at"];
        return this.getDoctorNameById(getRxByIdResult["doctor_id"]).then((getDoctorNameByIdResult) => {
          rxObject.doctorName = `${getDoctorNameByIdResult["first_name"]} ${getDoctorNameByIdResult["last_name"]}`;
          return this.getUserNameById(getRxByIdResult["user_id"]).then((getUserNameByIdResult) => {
            rxObject.patientName = `${getUserNameByIdResult["first_name"]} ${getDoctorNameByIdResult["last_name"]}`;
            return this.getRxDetailsById(rx_id).then((getRxDetailsByIdResult) => {
              // for object in getRxDetailsByIdResult array.
              //  I want to this.getDrugNameById(drug_id) and add it to an object
              //  I also want to add quantity, measurement, frequency and note to that object
              // All of these objects (if more than one) would be pushed in to rxObject.rxdetails (an array).
              // I would then return rxObject ready to be fed to my view in prescriptions.js (get prescriptions/:id)
              // console.log(rxObject);
              // console.log(getRxDetailsByIdResult);
              // rxObject.rxDetails = [];
              var promises = [];
              for (let i = 0; i <= getRxDetailsByIdResult.length - 1; i++) {
                var p = this.rxObjectDetailsBuilder(getRxDetailsByIdResult[i]);
                // .then((rxObjectDetailsBuilderResult) => {
                //   console.log(rxObjectDetailsBuilderResult);
                //   rxObject.rxDetails.push(rxObjectDetailsBuilderResult);
                // });
                promises.push(p);
              }
              return Promise.all(promises).then((values) => {
                rxObject.rxDetails = values;
                return rxObject
              });
            }).catch((err) => {
              console.log(err);
            });
          });
        });
      });
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

    // Insert new user into database
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
        birthdate: userObject.birthdate,
        public_key: userObject.public_key
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
        // console.log(result)
        if(result.length === 0){
          throw "Error, drug not found"
        }
        return result[0].id;
      })

    },

    getUserByPublicKey: function(patientAddress){
      return knex
      .select("id")
      .from("users")
      .where("public_key", patientAddress)
      .then((address) => {
        // console.log(address);
        if(address.length === 0){
          throw "Error, no user found at that address"
        }
        return address[0].id;
      })

    },

    createRxDetails: function(Rx){
      return knex
      .insert(Rx)
      .into("prescription_details")
      .then((result) => {

      console.log("New prescription generated");
      return result;
      })
    },

    createRxTemplate: function(doctorId, patientId){
      return knex
      .returning("id")
      .insert({
        doctor_id: doctorId,
        user_id: patientId,
        status: "active"
        })
      .into('prescriptions')
      .then((result) => {
        // console.log(result)
        return result;
      })
    },

    createFullRx: function(user, body){
      console.log(user)
      console.log(body)
      let Rx = {
        quantity: body.quantity,
        measurement: body.measurement,
        frequency: body.frequency,
        note: body.note
      }
      let patient_id;
      let prescriptionId;
      return this.getUserByPublicKey(body.patientPublicKey)
      .then((userId) => {
        patient_id = userId;
      return this.createRxTemplate(user.id, patient_id)
      })
      .then((prescription_id) => {
        prescriptionId = prescription_id[0];
        return this.getDrugId(body.drugName)
      })
      .then((drug_id) => {
        Rx["prescription_id"] = prescriptionId;
        Rx["drug_id"] = drug_id;
        console.log(Rx);
        return this.createRxDetails(Rx);
      })
    }
  }
}
