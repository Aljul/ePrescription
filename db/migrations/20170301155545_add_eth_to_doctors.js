exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('doctors', function (table) {
      table.string('public_key');
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('doctors', function (table) {
      table.dropColumn('public_key');
    })
  ])
};
