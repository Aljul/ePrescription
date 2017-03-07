const bcrypt  = require('bcrypt');

// Here goes app functions that do NOT require database interaction
module.exports = {

  // To be used as a callback to build user cookie
  buildUserCookie: function(req, userObject) {
    req.session["user"] = JSON.stringify({
      id: userObject.id,
      username: `${userObject.first_name} ${userObject.last_name}`,
      isDoctor: userObject.isDoctor,
      publicKey: userObject.public_key
    });
  },

  buildPharmacyCookie: function(req, pharmacyObject) {
    req.session["pharmacy"] = JSON.stringify({
      id: pharmacyObject.id,
      pharmacyEmail: pharmacyObject.email,
      publicKey: pharmacyObject.public_key,
      privateKey: pharmacyObject.private_key
    });
  },

  // Returns empty keys of an object in emptyKeys array
  validatesObject: function(userObject) {
    let emptyKeys = []
    for (key in userObject) {
      if (!userObject[key]) { emptyKeys.push(key); }
    }
    return emptyKeys
  }

}
