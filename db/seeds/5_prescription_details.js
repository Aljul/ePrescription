
exports.seed = function(knex, Promise) {
  return knex('prescription_details').insert([
    {
      prescription_id: 1,
      drug_id: 1,
      quantity: 200,
      measurement: "mg",
      frequency: "twice a day",
      note: "Take the medication with a meal"
    },
    {
      prescription_id: 1,
      drug_id: 2,
      quantity: 2.5,
      measurement: "tablets",
      frequency: "once every morning",
      note: "MUST be mixed with liquor beforehand"
    },
    {
      prescription_id: 1,
      drug_id: 3,
      quantity: 1,
      measurement: "tablet",
      frequency: "once a day",
      note: "Any time of the day"
    },
    {
      prescription_id: 2,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: ""
    },
    {
      prescription_id: 3,
      drug_id: 5,
      quantity: 1,
      measurement: "tablespoon",
      frequency: "once before bed",
      note: "Measure carefully, 1.1 tablespoon will lead to overdose"
    },
    {
      prescription_id: 4,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: ""
    },
    {
      prescription_id: 5,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: ""
    }
  ]).then(function () {
    console.log("prescriptions_details seeded");
  });
};
