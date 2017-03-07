exports.seed = function(knex, Promise) {
  return knex("prescription_details").del().then(function () {
    console.log("pharmacies deleted");
    return knex("pharmacies").del()
  }).then(function () {
    console.log("prescription_details deleted");
    return knex("prescriptions").del()
  }).then(function () {
    console.log("prescriptions deleted");
    return knex("drugs").del()
  }).then(function () {
    console.log("drugs deleted");
    return knex("doctors").del()
  }).then(function () {
    console.log("doctors deleted");
    return knex("users").del()
  }).then(function () {
    console.log("users deleted");
    console.log("=== END OF DELETION SEED FILE ===");
  });
}
