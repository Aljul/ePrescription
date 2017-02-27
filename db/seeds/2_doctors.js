
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('doctors').del()
    .then(function () {
      // Inserts seed entries
      return knex('doctors').insert([
        {
          user_id: 1,
          speciality: "Family Medicine",
          permit_number: "11111",
          permit_registration_date: "2017-02-23",
          status: "Registered - Active"
        },
        {
          user_id: 2,
          speciality: "Internal Medicine Medicine",
          permit_number: "22222",
          permit_registration_date: "2017-02-23",
          status: "Registered - Active"
        }
      ]);
    });
};
