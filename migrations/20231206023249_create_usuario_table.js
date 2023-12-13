/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('usuario', function (table) {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('login').notNullable().unique();
      table.string('senha').notNullable();
      table.string('roles').defaultTo('USER');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('usuario');
  };
