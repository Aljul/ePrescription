
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('patients').del()
    .then(function () {
      // Inserts seed entries
      return knex('patients').insert([
        {
          first_name: "Claude",
          last_name: "Julien",
          address: "1909 av. des canadiens",
          phone: "333-333-3333",
          email: "claude.julien@email.com",
          birthdate: "1960-04-23"
        },
        {
          first_name: "Marc",
          last_name: "Bergevin",
          address: "1909 av. des canadiens",
          phone: "444-444-4444",
          email: "Marc.Bergevin@email.com",
          birthdate: "1965-08-11"
        }
      ]);
    });
};
