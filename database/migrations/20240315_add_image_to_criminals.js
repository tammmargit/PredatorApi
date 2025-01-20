exports.up = function(knex) {
  return knex.schema.alterTable('criminals', table => {
    table.string('ImageUrl').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('criminals', table => {
    table.dropColumn('ImageUrl');
  });
}; 