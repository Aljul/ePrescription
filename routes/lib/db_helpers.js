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

    getAllRxWrittenByDoctor: function(doctor_id){
      return knex
      .select("prescription_id", "quantity", "measurement","frequency", "note", "drugs.name", "rx_address", "status", "first_name", "last_name")
      .from("prescription_details")
      .innerJoin("prescriptions", "prescriptions.id", "prescription_details.prescription_id")
      .innerJoin("drugs", "drugs.id", "prescription_details.drug_id")
      .innerJoin("users", "users.id", "prescriptions.user_id")
      .where("prescriptions.doctor_id", doctor_id)
      .then((result) => {
        return result
      })
    },

    getAllDoctorsForPatient: function(patient_id){
      return knex
      .select("first_name", "last_name", "users.id", "speciality", "permit_number")
      .distinct("doctors.public_key")
      .from("prescription_details")
      .innerJoin("prescriptions", "prescriptions.id", "prescription_details.prescription_id")
      .innerJoin("doctors", "doctors.id", "prescriptions.doctor_id")
      .innerJoin("users", "users.id", "prescriptions.user_id")
      .where("prescriptions.user_id", patient_id)
      .then((result) => {
        console.log(result)
        return result
      })
    },

    getAllPatientsForDoctor: function(doctor_id){
      return knex
      .select("first_name", "last_name", "users.id")
      .distinct("public_key")
      .from("prescription_details")
      .innerJoin("prescriptions", "prescriptions.id", "prescription_details.prescription_id")
      .innerJoin("drugs", "drugs.id", "prescription_details.drug_id")
      .innerJoin("users", "users.id", "prescriptions.user_id")
      .where("prescriptions.doctor_id", doctor_id)
      .then((result) => {
        console.log(result)
        return result
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

    // Get users.id of the doctor corresponding to doctor_id
    getUserIdByDoctorId: function(doctor_id) {
      return knex
      .select("user_id")
      .from("doctors")
      .where("id", doctor_id)
      .then((result) => {
        if(result.length === 0){
          throw "Error, doctor not found"
        }
        return result[0].id
      })
    },

    // Get name (in users table) of the doctor with corresponding doctor_id
    getDoctorNameByDoctorId: function(doctor_id) {
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

    // Returns an object with view ready prescription header
    rxObjectHeaderBuilder: function(rx_id) {
      let rxHeaderObject = {};
      return this.getRxById(rx_id).then((getRxByIdResult) => {
        rxHeaderObject.status = getRxByIdResult["status"];
        rxHeaderObject.createdAt = getRxByIdResult["created_at"];
        rxHeaderObject.doctor_id = getRxByIdResult["doctor_id"];
        return this.getDoctorNameByDoctorId(getRxByIdResult["doctor_id"]).then((getDoctorNameByDoctorIdResult) => {
          rxHeaderObject.doctorName = `${getDoctorNameByDoctorIdResult["first_name"]} ${getDoctorNameByDoctorIdResult["last_name"]}`;
          return this.getUserNameById(getRxByIdResult["user_id"]).then((getUserNameByIdResult) => {
            rxHeaderObject.patientName = `${getUserNameByIdResult["first_name"]} ${getUserNameByIdResult["last_name"]}`;
            return rxHeaderObject
          });
        });
      });
    },

    // Returns an object with view ready prescription_details
    rxObjectDetailsBuilder: function (rxDetails) {
      let rxDetailsObject = {};
      return this.getDrugNameById(rxDetails["drug_id"]).then((getDrugNameByIdResult) => {
        rxDetailsObject.drugName = getDrugNameByIdResult["name"];
      }).then(() => {
        rxDetailsObject.quantity = rxDetails.quantity
        rxDetailsObject.measurement = rxDetails.measurement
        rxDetailsObject.frequency = rxDetails.frequency
        rxDetailsObject.note = rxDetails.note,
        rxDetailsObject.rx_address = rxDetails.rx_address
        return rxDetailsObject
      });
    },

    // Assembling rxObjectHeaderBuilder and rxObjectDetailsBuilder loop results.
    // Returns a promise of an object containing view-friendly data about a prescription.
    rxObjectBuilder: function(rx_id) {
      return this.rxObjectHeaderBuilder(rx_id).then((rxObject) => {
        return this.getRxDetailsById(rx_id).then((getRxDetailsByIdResult) => {
          // Building promises array to execute a loop with promise(s) within.
          var promises = [];
          for (let i = 0; i <= getRxDetailsByIdResult.length - 1; i++) {
            var p = this.rxObjectDetailsBuilder(getRxDetailsByIdResult[i]);
            promises.push(p);
          }
          return Promise.all(promises).then((rxDetailsObject) => {
            // Assigning array of rxDetailsObject(s) to key
            rxObject.rxDetails = rxDetailsObject;
            return rxObject
          });
        }).catch((err) => {
          return console.log(err);
        });
      });
    },

    // Returns all the prescriptions ids written by a doctor (doctorBoolean === true)
    // Or returns all the prescriptions ids received by a user (doctorBoolean === false)
    getUserRxIds: function(user_id, doctorBoolean) {
      if (doctorBoolean === true) {
        return knex
        .select("id")
        .from("prescriptions")
        .where("doctor_id", user_id)
        .then((result) => {
          return result;
        });
      } else {
        return knex
        .select("id")
        .from("prescriptions")
        .where("user_id", user_id)
        .then((result) => {
          return result;
        });
      }
    },

    // Returns array of all prescriptions headers (objects) of a user
    getUserRxHeadersList: function(user_id, doctorBoolean) {
      return this.getUserRxIds(user_id, doctorBoolean).then((result) => {
        // Building promises array to execute a loop with promise(s) within.
        var promises = [];
        for (let i = 0; i <= result.length - 1; i++) {
          var p = this.rxObjectHeaderBuilder(result[i].id);
          promises.push(p);
        }
        return Promise.all(promises).then((rxHeadersArray) => {
          return rxHeadersArray
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

    getDoctorKeys: function(doctorId){
      return knex
      .select("public_key", "priv_key")
      .from("doctors")
      .where("id", doctorId)
      .then((keys) => {
        // console.log(keys)
        return keys[0];
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
        note: body.note,
        rx_address: body.rx_address
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
      }).then(() => {
        return prescriptionId;
      })
    }
  }
}
