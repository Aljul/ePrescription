
exports.up = function(knex, Promise) {
  return Promise.all([
     knex.schema.createTable("prescriptions", function(table) {
      table.increments("id").primary();
      table.integer('doctor_id');
      table.foreign("doctor_id").references("doctors.id");
      table.integer('user_id');
      table.foreign("user_id").references("users.id");
      table.string("status");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('prescriptions')
  ]);
};
