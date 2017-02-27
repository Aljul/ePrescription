
exports.seed = function(knex, Promise) {
  // hashes seed password
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const seedPassword = "1";
  let seedHash = bcrypt.hashSync(seedPassword, saltRounds);
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          first_name: 'Julie',
          last_name: "Brodeur",
          email: "julie.brodeur@email.com",
          password_digest: seedHash,
          address: "360 rue saint-jacques",
          phone: "111-111-1111",
          birthdate: "1982-09-15",
          isDoctor: true
        },
        {
          first_name: 'Ling Yuan',
          last_name: "Kong",
          email: "lingyuan.kong@email.com",
          password_digest: seedHash,
          address: "361 rue saint-jacques",
          phone: "222-222-2222",
          birthdate: "1987-01-05",
          isDoctor: true
        },
        {
          first_name: "Claude",
          last_name: "Julien",
          email: "claude.julien@email.com",
          password_digest: seedHash,
          address: "1909 av. des canadiens",
          phone: "333-333-3333",
          birthdate: "1960-04-23",
          isDoctor: false
        },
        {
          first_name: "Marc",
          last_name: "Bergevin",
          email: "Marc.Bergevin@email.com",
          password_digest: seedHash,
          address: "1909 av. des canadiens",
          phone: "444-444-4444",
          birthdate: "1965-08-11",
          isDoctor: false
        },
        {
          first_name: "quick",
          last_name: "user",
          email: "1@1",
          password_digest: seedHash,
          address: "quelque part",
          phone: "555-555-5555",
          birthdate: "1999-12-31",
          isDoctor: false
        }
      ]);
    });
};
