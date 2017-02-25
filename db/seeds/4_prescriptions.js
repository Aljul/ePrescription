
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('prescriptions').del()
    .then(function () {
      // Inserts seed entries
      return knex('prescriptions').insert([
        {
          doctor_id: 1,
          user_id: 1,
          status: "active"
        },
        {
          doctor_id: 2,
          user_id: 2,
          status: "active"
        }
      ]);
    });
};
