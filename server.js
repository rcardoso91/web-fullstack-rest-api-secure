require('dotenv').config()
const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static (path.join (__dirname, '/public')))

const apiProdutosRouter = require('./api/routes/apiProdutosRouter');
app.use('/api', apiProdutosRouter);//produtos

const apiUsuariosRouter = require('./api/routes/apiUsuariosRouter');
app.use('/api', apiUsuariosRouter);//usuarios

const segRouter = require('./api/routes/segRouter');
app.use('/auth', segRouter);//autenticacao


app.get('/not-found', (req, res) => {
  res.status(404).send('Página não encontrada');
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'not-found.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
});


let port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    const address = server.address();
    const ip = address.address === '::' ? 'localhost' : address.address;
    const port = address.port;
  
    console.log(`Server is running at http://${ip}:${port}`);
  });
