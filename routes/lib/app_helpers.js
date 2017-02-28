const bcrypt  = require('bcrypt');

// Here goes app functions that do NOT require database interaction
module.exports = function makeAppHelpers() {
  return {

    // Return hash of element
    hashElement: function(element) {
      const saltRounds = 10;
      bcrypt.hash(element, saltRounds, function(err, hash) {
        return hash
      });
    }

  }
}
