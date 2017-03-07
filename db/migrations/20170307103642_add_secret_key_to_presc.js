exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('prescription_details', function (table) {
      table.string('secret');
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('prescription_details', function (table) {
      table.dropColumn('secret');
    })
  ])
};
