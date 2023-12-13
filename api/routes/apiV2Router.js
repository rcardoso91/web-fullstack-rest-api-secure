const express = require('express');
const apiV2Router = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);


apiV2Router.get('/', (req, res) => {
  res.send(`API V2<br>
        <a href="/api/usuarios/users">API de Users</a>`);
});

apiV2Router.get('/users', async (req, res) => {
  try {
    const result = await knex.select('id', 'login', 'senha', 'nome', 'numero').from('users');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao recuperar os usuários do banco de dados.' });
  }
});

apiV2Router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await knex.select('id', 'login', 'senha', 'nome', 'numero').from('users').where({ id: id }).first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao recuperar o usuário do banco de dados.' });
  }
});

apiV2Router.post('/users', async (req, res) => {
  const newUser = req.body;

  try {
    const [id] = await knex('users').insert(newUser);
    const userInserted = await knex.select('id', 'login', 'senha', 'nome', 'numero').from('users').where({ id: id }).first();
    res.status(201).json({ mensagem: 'Usuário adicionado com sucesso.', user: userInserted });
  } catch (error) {
    res.status(400).json({ erro: 'Os dados do usuário são obrigatórios.' });
  }
});

apiV2Router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedQuantity = await knex('users').where({ id: id }).update(updatedData);
    if (updatedQuantity > 0) {
      const userUpdated = await knex.select('id', 'login', 'senha', 'nome', 'numero').from('users').where({ id: id }).first();
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.', user: userUpdated });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar o usuário no banco de dados.' });
  }
});

apiV2Router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userRemoved = await knex.select('id', 'login', 'senha', 'nome', 'numero').from('users').where({ id: id }).first();
    const removedQuantity = await knex('users').where({ id: id }).del();
    if (removedQuantity > 0) {
      res.status(200).json({ mensagem: 'Usuário removido com sucesso.', user: userRemoved });
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover o usuário do banco de dados.' });
  }
});


module.exports = apiV2Router;

