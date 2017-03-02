const encryption = require('../../routes/lib/encryption.js')

priv1 = encryption.createCipher('1234', "d126806aea8c43173a50854d0f35c09f738d68a86fa9e877e0f982cc4c774304")
priv2 = encryption.createCipher('1234', "29c3b4e236c30dfeaae67fd7e5447c7dc4f36e76ee726daccb6e4a7023a37d90")

exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('doctors').insert([
    {
      user_id: 1,
      speciality: "Family Medicine",
      permit_number: "11111",
      permit_registration_date: "2017-02-23",
      public_key: "0xe6be9892c9d39bbe3d29daa12da80420c20649fe",
      priv_key: priv1,
      status: "Registered - Active"
    },
    {
      user_id: 2,
      speciality: "Internal Medicine Medicine",
      permit_number: "22222",
      permit_registration_date: "2017-02-23",
      public_key: "0x15ff0ba44ddceb2caee5877b942518bdcc3e08b8",
      priv_key: priv2,
      status: "Registered - Active"
    }
  ]).then(function () {
    console.log("doctors seeded");
  });
};
