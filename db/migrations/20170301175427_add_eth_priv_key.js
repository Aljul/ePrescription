exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('doctors', function (table) {
      table.string('priv_key');
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('doctors', function (table) {
      table.dropColumn('priv_key');
    })
  ])
};
