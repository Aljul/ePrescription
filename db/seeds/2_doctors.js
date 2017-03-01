
exports.seed = function(knex, Promise) {
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
  ]).then(function () {
    console.log("doctors seeded");
  });
};
