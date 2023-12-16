const express = require('express');
const apiProdutosRouter = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);

const endpoint = '/produtos';

apiProdutosRouter.get(`${endpoint}/`, (req, res) => {
  res.send(`Bem-vindo à API de produtos!`);
});

apiProdutosRouter.use(async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

apiProdutosRouter.get(endpoint, async (req, res) => {
  const produtos = await knex.select('*').from('produto');
  res.status(200).json(produtos);
});

apiProdutosRouter.get(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const produto = await knex.select('*').from('produto').where('id', id);

  if (produto.length > 0) {
    res.status(200).json(produto[0]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

apiProdutosRouter.post(endpoint, async (req, res) => {
  const { descricao, valor, marca } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
  }

  const [produto] = await knex('produto').insert({ descricao, valor, marca }).returning('*');
  res.status(201).json(produto);
});

apiProdutosRouter.put(`${endpoint}/:id`, async (req, res) => {
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
apiProdutosRouter.delete(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const rowsAffected = await knex('produto').where('id', id).del();

  if (rowsAffected > 0) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

module.exports = apiProdutosRouter;
