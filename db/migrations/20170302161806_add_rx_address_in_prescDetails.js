exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('prescription_details', function (table) {
      table.string('rx_address');
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('prescription_details', function (table) {
      table.dropColumn('rx_address');
    })
  ])
};
