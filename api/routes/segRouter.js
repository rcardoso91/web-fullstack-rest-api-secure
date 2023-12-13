const express = require('express');
const apiSeg = express.Router();
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);
const bcrypt = require('bcryptjs');

apiSeg.post('/register', (req, res) => {
  let { login, senha, nome, numero } = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(senha, salt);
  knex('usuarios').insert({ login, senha: hash, nome, numero })
    .then((dados) => {
      res.status(201).json({ dados });
    })
    .catch((error) => {
      res.status(400).json({ erro: error });
    })
});


apiSeg.post('/login', (req, res) => {
  let { login, senha } = req.body;
  knex('usuarios').where('login', login)
    .then((dados) => {
      if (dados.length == 0) {
        res.status(401).json({ erro: 'Login não encontrado' });
        return;
      } else {
        let usuario = dados[0];
        if (bcrypt.compareSync(senha, usuario.senha)) {
          let token = jwt.sign({ id: usuario.id }, process.env.SECRET, { expiresIn: 600 });
          res.status(200).json({ token: token });
        } else {
          res.status(401).json({ erro: 'Uusário ou senha inválidos' });
        }
      }


    })
    .catch((error) => {
      res.status(500).json({ erro: error });
    })



});


module.exports = apiSeg;