
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          first_name: 'Julie',
          last_name: "Brodeur",
          address: "360 rue saint-jacques",
          phone: "111-111-1111",
          email: "julie.brodeur@email.com",
          birthdate: "1982-09-15",
          isDoctor: true
        },
        {
          first_name: 'Ling Yuan',
          last_name: "Kong",
          address: "361 rue saint-jacques",
          phone: "222-222-2222",
          email: "lingyuan.kong@email.com",
          birthdate: "1987-01-05",
          isDoctor: true
        },
        {
          first_name: "Claude",
          last_name: "Julien",
          address: "1909 av. des canadiens",
          phone: "333-333-3333",
          email: "claude.julien@email.com",
          birthdate: "1960-04-23",
          isDoctor: false
        },
        {
          first_name: "Marc",
          last_name: "Bergevin",
          address: "1909 av. des canadiens",
          phone: "444-444-4444",
          email: "Marc.Bergevin@email.com",
          birthdate: "1965-08-11",
          isDoctor: false
        }
      ]);
    });
};
