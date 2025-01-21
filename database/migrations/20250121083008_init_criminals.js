/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('criminals', table => {
        table.increments('Id').primary();
        table.string('Name').notNullable();
        table.string('Gender').notNullable();
        table.string('Offence').notNullable();
        table.string('City').notNullable();
        table.boolean('InPrison').defaultTo(false);
        table.string('ImageUrl');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('criminals');
};
