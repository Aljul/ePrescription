
exports.seed = function(knex, Promise) {
  return knex('prescriptions').insert([
    {
      doctor_id: 1,
      user_id: 1,
      status: "active"
    },
    {
      doctor_id: 1,
      user_id: 3,
      status: "active"
    },
    {
      doctor_id: 1,
      user_id: 4,
      status: "active"
    },
    {
      doctor_id: 2,
      user_id: 3,
      status: "active"
    },
    {
      doctor_id: 2,
      user_id: 4,
      status: "active"
    }
  ]).then(function () {
    console.log("prescriptions seeded");
  });
};
