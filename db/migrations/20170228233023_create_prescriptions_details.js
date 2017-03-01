
exports.up = function(knex, Promise) {
  return Promise.all([
     knex.schema.createTable("prescription_details", function(table) {
      table.integer('prescription_id');
      table.foreign("prescription_id").references("prescriptions.id");
      table.integer('drug_id');
      table.foreign("drug_id").references("drugs.id");
      table.float("quantity");
      table.string("measurement");
      table.string("frequency");
      table.string("note");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('prescription_details')
  ]);
};
