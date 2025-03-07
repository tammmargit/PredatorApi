exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id');
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable().defaultTo('user');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };