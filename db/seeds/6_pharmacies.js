const encryption = require('../../routes/lib/encryption.js')

priv1 = encryption.createCipher('1234', "831a7313e0fdae9af9482fd74292eac8875a7139e70764d69bb3565deae1f75b")

exports.seed = function(knex, Promise) {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const seedPassword = "1";
  let seedHash = bcrypt.hashSync(seedPassword, saltRounds);
  return knex('pharmacies').insert([
    {
      public_key: "0xc4f993c3b9a388a5dc719c238ac7e00b81c62fb7",
      private_key: priv1,
      email: "jean@coutu",
      password_digest: seedHash
    }
  ]).then(function () {
    console.log("phamarcies seeded");
  });
};
