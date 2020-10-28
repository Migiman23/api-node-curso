const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');

// ==============================
// Buscar todos los productos
// ==============================
app.get('/producto', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productosDB) => {
        
        if(err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if(!productosDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'No se encontraron productos.'
                }
            })
        }

        res.json({
            status: true,
            productos: productosDB
        })
    })
});

// ==============================
// Buscar producto por ID
// ==============================
app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, producto) => {

        if(err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if(!producto) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'No se encontraró el producto.'
                }
            })
        }

        res.json({
            status: true,
            producto: producto
        })
    })
});

// ==============================
// Buscar un producto por {nombre}
// ==============================
app.get('/producto/buscar/:query', verificarToken, (req, res) => {
    let query = req.params.query;
    let regex = new RegExp(query, 'i');
    Producto.find( { nombre: regex })
            .populate('categoria', 'descripcion')
            .exec((err, producto) => {

                if(err) {
                    return res.status(500).json({
                        status: false,
                        err
                    })
                }
        
                res.json({
                    status: true,
                    producto
                })
            })
})

// ==============================
// Crear producto
// ==============================
app.post('/producto',verificarToken, (req, res) => {

    let body = req.body;

    let producto = Producto ({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {

        if(err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Error al guardar el producto.'
                }
            })
        }

        res.json({
            status: true,
            producto: productoDB
        })
    })

});

// ==============================
// Actializar producto por ID
// ==============================
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

/*     let producto = Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
    }) */

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if(err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Error al actualizar el producto.'
                }
            })
        }

        res.json({
            status: true,
            producto: productoDB
        })
    })
});

// ==============================
// Eliminar producto por ID
// ==============================
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findOne({_id: id}, (err, producto) => {

        if(err) {
            return res.status(500).json({
                status: false,
                err
            })
        }

        if(!producto) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'No existe el producto.'
                }
            })
        } else {

            producto.disponible = false;

            producto.save((err, productoDeleted) => {

                if(err) {
                    return res.status(500).json({
                        status: false,
                        err
                    })
                }
        
                res.json({
                    status: true,
                    eliminado: true,
                    producto: productoDeleted,
                    message: 'El producto se eliminó correctamente.'
                })
            })
        }
    });

});

module.exports = app;