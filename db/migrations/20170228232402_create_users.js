

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("users", function(table) {
      table.increments("id").primary();
      table.string("email");
      table.string("password_digest");
      table.string("first_name");
      table.string("last_name");
      table.string("address");
      table.string("phone");
      table.date("birthdate");
      table.boolean("isDoctor").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
