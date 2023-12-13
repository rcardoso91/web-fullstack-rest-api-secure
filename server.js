const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/app', express.static(path.join(__dirname, '/public')));
app.use('/', express.static(path.join(__dirname, '/public')));


const apiV1Router = require('./api/routes/apiV1Router'); // produtos
const apiV2Router = require('./api/routes/apiV2Router'); // usuarios
const segRouter = require('./api/routes/segRouter'); // autenticacao

app.use('/api/', apiV1Router);
app.use('/api/usuarios', apiV2Router);
app.use('/seg', segRouter);

app.use((req, res, next) => {
  console.log(`Data: ${new Date()} - Method: ${req.method} - URL: ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
