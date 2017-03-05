
exports.seed = function(knex, Promise) {
  return knex('prescription_details').insert([
    {
      prescription_id: 1,
      drug_id: 1,
      quantity: 200,
      measurement: "mg",
      frequency: "twice a day",
      note: "Take the medication with a meal",
      rx_address: "0x1b3cb81e51011b549d78bf720b0d924ac763a7c2"
    },
    {
      prescription_id: 1,
      drug_id: 2,
      quantity: 2.5,
      measurement: "tablets",
      frequency: "once every morning",
      note: "MUST be mixed with liquor beforehand",
      rx_address: "0x51f9c432a4e59ac86282d6adab4c2eb8919160eb"
    },
    {
      prescription_id: 1,
      drug_id: 3,
      quantity: 1,
      measurement: "tablet",
      frequency: "once a day",
      note: "Any time of the day",
      rx_address: "0x91337a300e0361bddb2e377dd4e88ccb7796663d"
    },
    {
      prescription_id: 2,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: "",
      rx_address: "0xc78310231aa53bd3d0fea2f8c705c67730929d8f"
    },
    {
      prescription_id: 3,
      drug_id: 5,
      quantity: 1,
      measurement: "tablespoon",
      frequency: "once before bed",
      note: "Measure carefully, 1.1 tablespoon will lead to overdose",
      rx_address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b"
    },
    {
      prescription_id: 4,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: "",
      rx_address: "0xf27daff52c38b2c373ad2b9392652ddf433303c4"
    },
    {
      prescription_id: 5,
      drug_id: 4,
      quantity: 0.5,
      measurement: "tablet",
      frequency: "once a day",
      note: "",
      rx_address: "0x281055afc982d96fab65b3a49cac8b878184cb16"
    }
  ]).then(function () {
    console.log("prescriptions_details seeded");
  });
};
