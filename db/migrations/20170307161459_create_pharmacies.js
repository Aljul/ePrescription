
exports.up = function(knex, Promise) {
  return Promise.all([
     knex.schema.createTable("pharmacies", function(table) {
      table.increments("id").primary();
      table.string("email");
      table.string("password_digest");
      table.string("public_key");
      table.string("private_key");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('pharmacies')
  ]);
};
