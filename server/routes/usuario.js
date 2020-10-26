const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificarToken, function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({"estado": true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            Usuario.count({"estado": true}, (err, conteo) => {
                res.json({
                    status: true,
                    usuarios: usuarios,
                    count: conteo
                });
            })
        });
});

app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //Numero de vueltas al encriptado
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificarToken, verificarAdminRole], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body,
        ['nombre', 'email', 'img', 'role', 'estado']);
    console.log(body)
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: "Error al intentar actualizar",
                err
            });
        }

        res.json({
            status: true,
            usuario: usuarioDB
        });
    })
});

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], function (req, res) {


    let id = req.params.id

    let estadoBorrado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, estadoBorrado, { new: true, context: 'query' }, (err, borrado) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        if (!borrado) {
            return res.status(400).json({
                status: false,
                err: {
                    mensaje: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            status: true,
            usuario: borrado
        })
    })

});

module.exports = app;