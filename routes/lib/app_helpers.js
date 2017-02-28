const bcrypt  = require('bcrypt');

// Here goes app functions that do NOT require database interaction
module.exports = {

  // To be used as a callback to build user cookie
  buildUserCookie: function(req, userObject) {
    req.session["user"] = JSON.stringify({
      id: userObject.id,
      username: `${userObject.first_name} ${userObject.last_name}`,
      isDoctor: userObject.isDoctor
    });
  }

}
