/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('produto').del()
    .then(function () {
      // Inserts seed entries
      return knex('produto').insert([
        { descricao: 'Arroz parboilizado 5Kg', valor: 25, marca: 'Tio João' },
        { descricao: 'Maionese 250gr', valor: 7.2, marca: 'Helmanns' },
        { descricao: 'Iogurte Natural 200ml', valor: 2.5, marca: 'Itambé' },
      ]);
    });
};
