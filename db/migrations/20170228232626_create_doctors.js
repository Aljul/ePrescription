exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("doctors", function(table) {
      table.increments("id").primary();
      table.integer('user_id');
      table.foreign("user_id").references("users.id");
      table.string("speciality");
      table.string("permit_number");
      table.date("permit_registration_date");
      table.string("status");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("doctors")
  ]);
};
