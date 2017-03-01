
exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('doctors').insert([
    {
      user_id: 1,
      speciality: "Family Medicine",
      permit_number: "11111",
      permit_registration_date: "2017-02-23",
      public_key: "0x51f9c432a4e59ac86282d6adab4c2eb8919160eb",
      status: "Registered - Active"
    },
    {
      user_id: 2,
      speciality: "Internal Medicine Medicine",
      permit_number: "22222",
      permit_registration_date: "2017-02-23",
      public_key: "0x1b3cb81e51011b549d78bf720b0d924ac763a7c2",
      status: "Registered - Active"
    }
  ]).then(function () {
    console.log("doctors seeded");
  });
};
