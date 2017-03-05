const encryption = require('../../routes/lib/encryption.js')

priv1 = encryption.createCipher('1234', "d945ee0cd491049b49402e8631e4def386b8dd87cc528f88e810691646d0ae9a")
priv2 = encryption.createCipher('1234', "29c3b4e236c30dfeaae67fd7e5447c7dc4f36e76ee726daccb6e4a7023a37d90")

exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('doctors').insert([
    {
      user_id: 1,
      speciality: "Family Medicine",
      permit_number: "11111",
      permit_registration_date: "2017-02-23",
      public_key: "0xeab9085c947bf296aa20d8301061659f0f100628",
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

