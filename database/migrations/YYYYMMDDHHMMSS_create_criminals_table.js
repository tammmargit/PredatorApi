exports.up = function(knex) {
  return knex.schema.createTable('criminals', table => {
    table.increments('Id');
    table.string('Name').notNullable();
    table.string('Gender').notNullable();
    table.string('Offence').notNullable();
    table.string('City').notNullable();
    table.boolean('InPrison').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('criminals');
}; 