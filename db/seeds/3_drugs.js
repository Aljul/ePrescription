
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('drugs').del()
    .then(function () {
      // Inserts seed entries
      return knex('drugs').insert([
        { name: "Hydrocodone" },
        { name: "Crestor" },
        { name: "Nexium" },
        { name: "Synthroid" },
        { name: "Sovaldi" }
      ]);
    });
};
