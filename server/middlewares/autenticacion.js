const jwt = require('jsonwebtoken');

// Verificación de token
let verificarToken = (req, res, next) => {
    let token = req.get('token');

    
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};


// Verificación de token
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else {
        return res.json({
            status: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
};


// Verificación de token por url de imagen
let verificarTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
};
module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenImg
}