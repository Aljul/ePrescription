
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("drugs", function(table) {
      table.increments("id").primary();
      table.string("name");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('drugs')
  ]);
};
