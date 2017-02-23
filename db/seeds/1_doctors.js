
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('doctors').del()
    .then(function () {
      // Inserts seed entries
      return knex('doctors').insert([
        {
          first_name: 'Julie',
          last_name: "Brodeur",
          speciality: "Family Medicine",
          address: "360 rue saint-jacques",
          phone: "111-111-1111",
          email: "julie.brodeur@email.com",
          permit_number: "11111",
          permit_registration_date: "2017-02-23",
          status: "Registered - Active"
        },
        {
          first_name: 'Ling Yuan',
          last_name: "Kong",
          speciality: "Internal Medicine Medicine",
          address: "361 rue saint-jacques",
          phone: "222-222-2222",
          email: "lingyuan.kong@email.com",
          permit_number: "22222",
          permit_registration_date: "2017-02-23",
          status: "Registered - Active",
        }
      ]);
    });
};
