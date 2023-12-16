const express = require('express');
const apiUsuariosRouter = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);

const endpoint = '/usuarios';

apiUsuariosRouter.get(`${endpoint}/`, (req, res) => {
  res.send(`Bem-vindo à API de usuários!`);
});

const selectUserFields = ['id', 'login', 'senha', 'nome', 'numero'];

apiUsuariosRouter.get(endpoint, async (req, res) => {
  try {
    const result = await knex.select(...selectUserFields).from('users');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao recuperar os usuários do banco de dados.' });
  }
});

apiUsuariosRouter.get(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await knex.select(...selectUserFields).from('users').where({ id }).first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao recuperar o usuário do banco de dados.' });
  }
});

apiUsuariosRouter.post(endpoint, async (req, res) => {
  const newUser = req.body;

  try {
    const [id] = await knex('users').insert(newUser);
    const userInserted = await knex.select(...selectUserFields).from('users').where({ id }).first();
    res.status(201).json({ mensagem: 'Usuário adicionado com sucesso.', user: userInserted });
  } catch (error) {
    res.status(400).json({ erro: 'Os dados do usuário são obrigatórios.' });
  }
});

apiUsuariosRouter.put(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedQuantity = await knex('users').where({ id }).update(updatedData);
    if (updatedQuantity > 0) {
      const userUpdated = await knex.select(...selectUserFields).from('users').where({ id }).first();
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.', user: userUpdated });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar o usuário no banco de dados.' });
  }
});

apiUsuariosRouter.delete(`${endpoint}/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const userRemoved = await knex.select(...selectUserFields).from('users').where({ id }).first();
    const removedQuantity = await knex('users').where({ id }).del();
    if (removedQuantity > 0) {
      res.status(200).json({ mensagem: 'Usuário removido com sucesso.', user: userRemoved });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover o usuário do banco de dados.' });
  }
});

module.exports = apiUsuariosRouter;
