const express = require('express');
const apiSeg = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const endpoint = '/seguranca'; 

apiSeg.get('/', (req, res) => {
  res.send(`Bem-vindo à API de autenticacao!`);
});

apiSeg.post(endpoint + '/register', async (req, res) => {
  try {
    const result = await knex('usuario').insert({
      nome: req.body.nome,
      login: req.body.login,
      senha: bcrypt.hashSync(req.body.senha, 8),
      email: req.body.email
    }, ['id']);
    const usuario = result[0];
    res.status(200).json({ id: usuario.id });
  } catch (err) {
    res.status(500).json({
      message: 'Erro ao registrar usuario - ' + err.message
    });
  }
});

apiSeg.post(endpoint + '/login', async (req, res) => {
  try {
    const usuarios = await knex.select('*').from('usuario').where({ login: req.body.login });

    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      const checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha);

      if (checkSenha) {
        const tokenJWT = jwt.sign({ id: usuario.id },
          process.env.SECRET_KEY, {
            expiresIn: 3600
          });
        res.status(200).json({
          id: usuario.id,
          login: usuario.login,
          nome: usuario.nome,
          roles: usuario.roles,
          token: tokenJWT
        });
        return;
      }
    }

    res.status(401).json({ message: 'Login ou senha incorretos' });
  } catch (err) {
    res.status(500).json({
      message: 'Erro ao verificar login - ' + err.message
    });
  }
});

module.exports = apiSeg;
