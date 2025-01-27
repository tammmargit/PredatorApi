exports.up = function(knex) {
  return knex.schema.createTable('criminal_user', table => {
    table.increments('id');
    table.integer('criminal_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.string('action_type').notNullable(); // e.g., 'created', 'updated', 'deleted'
    table.timestamps(true, true);

    // Foreign key constraints
    table.foreign('criminal_id').references('Id').inTable('criminals').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    table.index(['criminal_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('criminal_user');
}; 