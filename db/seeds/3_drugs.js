exports.seed = function(knex, Promise) {
  return knex('drugs').insert([
    { name: "Hydrocodone" },
    { name: "Crestor" },
    { name: "Nexium" },
    { name: "Synthroid" },
    { name: "Sovaldi" }
  ]).then(function () {
    console.log("drugs seeded");
  });
};
