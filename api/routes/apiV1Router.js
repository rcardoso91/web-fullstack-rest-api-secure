const express = require('express');
const apiV1Router = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
console.log('Configuração do Knex:', knexConfig);

const knex = require('knex')(knexConfig);
console.log('Instância do Knex criada.');

const endpoint = '/produtos';

apiV1Router.use(async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

apiV1Router.get(endpoint, async (req, res) => {
  const produtos = await knex.select('*').from('produto');
  res.status(200).json(produtos);
});

apiV1Router.get(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const produto = await knex.select('*').from('produto').where('id', id);

  if (produto.length > 0) {
    res.status(200).json(produto[0]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

apiV1Router.post(endpoint, async (req, res) => {
  const { descricao, valor, marca } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
  }

  const [produto] = await knex('produto').insert({ descricao, valor, marca }).returning('*');
  res.status(201).json(produto);
});

apiV1Router.put(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, marca } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
  }

  const [produto] = await knex('produto').where('id', id).update({ descricao, valor, marca }).returning('*');

  if (produto) {
    res.status(200).json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Excluir um produto por ID
apiV1Router.delete(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const rowsAffected = await knex('produto').where('id', id).del();

  if (rowsAffected > 0) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

module.exports = apiV1Router;
