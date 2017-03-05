exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("doctors", function(table) {
      table.increments("id").primary();
      table.string("first_name");
      table.string("last_name");
      table.string("speciality");
      table.string("address");
      table.string("phone");
      table.string("email");
      table.string("permit_number");
      table.date("permit_registration_date");
      table.string("status");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    }),
    knex.schema.createTable("patients", function(table) {
      table.increments("id").primary();
      table.string("first_name");
      table.string("last_name");
      table.string("address");
      table.string("phone");
      table.string("email");
      table.date("birthdate");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    }),
    knex.schema.createTable("drugs", function(table) {
      table.increments("id").primary();
      table.string("name");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    }),
    knex.schema.createTable("prescriptions", function(table) {
      table.increments("id").primary();
      table.integer('doctor_id');
      table.foreign("doctor_id").references("doctors.id");
      table.integer('patient_id');
      table.foreign("patient_id").references("patients.id");
      table.string("status");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");
    }),
    knex.schema.createTable("prescriptions_details", function(table) {
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
    knex.schema.dropTable('prescriptions_details'),
    knex.schema.dropTable('prescriptions'),
    knex.schema.dropTable('drugs'),
    knex.schema.dropTable('patients'),
    knex.schema.dropTable('doctors')
  ]);
};
