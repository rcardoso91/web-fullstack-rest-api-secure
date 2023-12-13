require('dotenv').config()
const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/app', express.static (path.join (__dirname, '/public')))

const apiV1Router = require('./api/routes/apiV1Router');
app.use('/api/', apiV1Router);//produtos

const apiV2Router = require('./api/routes/apiV1Router');
app.use('/api/usuarios', apiV2Router);//usuarios

const segRouter = require('./api/routes/segRouter');
app.use('/seg', segRouter);//autenticacao


let port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    const address = server.address();
    const ip = address.address === '::' ? 'localhost' : address.address;
    const port = address.port;
  
    console.log(`Server is running at http://${ip}:${port}`);
  });
