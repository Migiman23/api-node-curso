const express = require('express');

const app = express();

const Categoria = require('../models/categoria');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
             .sort('descripcion')
             .populate('usuario', 'nombre email')
             .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            })
        }
        if (categorias) {
            return res.json({
                status: true,
                categorias
            })
        }
    })
});

app.get('/categoria/:id', verificarToken, (req, res) => {
    let idCategoria = req.params.id;

    Categoria.findById(idCategoria, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err: {
                    message: 'Error al buscar la categoría.'
                }
            })
        }

        if (!categoriaDB) {
            return res.status(404).json({
                status: false,
                err: {
                    message: 'No existe la categoría.'
                }
            })
        }

        res.json({
            status: true,
            categoria: categoriaDB
        })
    });
});

app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;
    console.log(req.usuario._id)

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Error al crear categoría.'
                }
            })
        }

        res.json({
            status: true,
            categoria: categoriaDB
        })
    });
});

app.put('/categoria/:id', [verificarToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let categoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'La categoría no existe.'
                }
            })
        }

        res.json({
            status: true,
            categoriaDB
        })
    })
});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {

    let id = req.params.id
    Categoria.findOne( { _id: id }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(404).json({
                status: false,
                err: {
                    message: 'No existe la categeoria.'
                }
            })
        } else {

            Categoria.deleteOne({ _id: id }, (err, categoriaDB) => {

                if (err) {
                    return res.status(500).json({
                        status: false,
                        err
                    })
                }
        
                res.json({
                    status: true,
                    eliminado: true,
                    message: 'La categoría se eliminó correctamente.'
                })
            });
        }
    });

});

module.exports = app;