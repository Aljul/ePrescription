exports.seed = function(knex, Promise) {
  return knex('drugs').insert([
    { name: "hydrocodone" },
    { name: "crestor" },
    { name: "nexium" },
    { name: "synthroid" },
    { name: "sovaldi" }
  ]).then(function () {
    console.log("drugs seeded");
  });
};
