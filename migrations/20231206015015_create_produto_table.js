/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// 20211206120000_create_produto_table.js
exports.up = function (knex) {
    return knex.schema.createTable('produto', function (table) {
      table.increments('id').primary();
      table.string('descricao').notNullable();
      table.decimal('valor').notNullable();
      table.string('marca');
    })
  }; 
  exports.down = function (knex) {
    return knex.schema.dropTable('produto');
  };
  
  

