// MAKE THE ENCRYPTION
require("dotenv").config({path: './../../.env'});
const crypto = require('crypto');

module.exports = {

  createCipher: function(secret, message){
    const cipher = crypto.createCipher(process.env.ENCRYPTION_ALGORITHM, secret);


    let encrypted = cipher.update(message, process.env.ENCODING_FROM , process.env.ENCODING_TO);
    console.log(encrypted);
    encrypted += cipher.final(process.env.ENCODING_TO);
    return encrypted;

  },


  decipher: function(secret, encryptedMessage){
    const decipher = crypto.createDecipher(process.env.ENCRYPTION_ALGORITHM, secret);


  let decrypted = decipher.update(encryptedMessage, process.env.ENCODING_TO, process.env.ENCODING_FROM);
  try{
    decrypted += decipher.final(process.env.ENCODING_FROM);

  } catch(err) {
    console.log("Error:", err.message)
    return "Something went wrong with the decryption. Are you sure you have the correct secret?"
  }

  console.log(decrypted);
  return decrypted
  }

}
const encMessage = module.exports.createCipher('123', 'This is a very long prescription, you will need to take this and that anfd this and that')
const decMessage = module.exports.decipher('123', encMessage);