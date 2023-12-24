const express = require('express');
const apiProdutosRouter = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);
const { checkToken, isAdmin } = require('../seguranca/seguranca'); 


const endpoint = '/produtos';

apiProdutosRouter.get(`${endpoint}/`, checkToken, (req, res) => {
  res.send(`Bem-vindo à API de produtos!`);
});

apiProdutosRouter.use(async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

apiProdutosRouter.get(`${endpoint}/listar`, checkToken, async (req, res) => {
  try {
    const { marca, descricao, precoMin, precoMax,id } = req.query;

    let query = knex.select('*').from('produto');

    if (marca) {
      query = query.where('marca', 'like', `%${marca}%`);
    }

    if (descricao) {
      query = query.where('descricao', 'like', `%${descricao}%`);
    }

    if (precoMin) {
      query = query.where('valor', '>=', precoMin);
    }

    if (precoMax) {
      query = query.where('valor', '<=', precoMax);
    }

    if (id) {
      query = query.where('id', '=', id);
  }
  

    query = query.orderBy(req.query.orderBy || 'id');

    const produtos = await query;

    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});



apiProdutosRouter.post(endpoint, checkToken, isAdmin, async (req, res) => {
  const { descricao, valor, marca } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
  }

  const [produto] = await knex('produto').insert({ descricao, valor, marca }).returning('*');
  res.status(201).json(produto);
});



apiProdutosRouter.put(`${endpoint}/:id`, checkToken, isAdmin, async (req, res) => {
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
apiProdutosRouter.delete(`${endpoint}/:id`, checkToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const rowsAffected = await knex('produto').where('id', id).del();

  if (rowsAffected > 0) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});



module.exports = apiProdutosRouter;
