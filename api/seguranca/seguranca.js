
const knexConfig = require('../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig)
const jwt = require('jsonwebtoken');


const checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"];
    if (!authToken) {
        return res.status(401).json({ message: 'Token de acesso requerido' });
    }

    let token = authToken.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            return res.status(401).json({ message: 'Acesso negado' });
        }
        req.usuarioId = decodeToken.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const usuarios = await knex.select('*').from('usuario').where({ id: req.usuarioId });

        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            const roles = usuario.roles.split(';');
            const adminRole = roles.includes('ADMIN');

            if (adminRole) {
                return next();
            } else {
                return res.status(403).json({ message: 'Role de ADMIN requerida' });
            }
        } else {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Erro ao verificar roles de usuário - ' + err.message
        });
    }
};

module.exports = { checkToken, isAdmin };
