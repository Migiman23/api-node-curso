const express = require('express');
const fileUpload = require('express-fileupload');

const fs= require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir : '/tmp/'
}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            status: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        })
    }

    // Validar tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            status: false,
            message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
            tipo: tipo
        })
    }
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Extenciones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones.indexOf(extension) < 0) {
        return res.json({
            status: false,
            message: 'Error, las extensiones permitidas son: '
                + extensiones.join(', '),
            ext: extension
        })
    }

    // Cambiar nombre al archivo
    let nombreCambiado = id + '-' + new Date().getMilliseconds() + '.' + extension;

    archivo.mv('uploads/' + tipo + '/' + nombreCambiado, (err) => {
        if (err)
            return res.status(500).json({
                status: false,
                err
            })
        
        if ( tipo === 'producto' ) imagenProducto(id, res, nombreCambiado, tipo);

        if ( tipo === 'usuario' )  imagenUsuario(id, res, nombreCambiado, tipo);
        
    });
});

function imagenUsuario(id, res, nombreCambiado, tipo) {

    Usuario.findOne({ _id: id }, (err, usuarioDB) => {

        if (err) {
            // Si ocurre un error la imagen ya se subió, por lo que
            // hay que eliminarla.
            borraArchivo(nombreCambiado, tipo);
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!usuarioDB) {
            // Si el usuario no existe se elimina la imagen.
            borraArchivo(nombreCambiado, tipo);
            return res.status(400).json({
                status: false,
                err: {
                    message: 'El usuario no existe.'
                }
            })
        }
        
        borraArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreCambiado;

        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            res.json({
                status: true,
                usuario: usuarioSave,
                img: nombreCambiado
            })
        })
    })
}

function imagenProducto(id, res, nombreCambiado, tipo) {

    Producto.findOne( { _id: id }, (err, productoDB) => {

        if (err) {
            // Si ocurre un error la imagen ya se subió, por lo que
            // hay que eliminarla.
            borraArchivo(nombreCambiado, tipo);
            return res.status(500).json({
                status: false,
                err
            })
        }

        if (!productoDB) {
            // Si el usuario no existe se elimina la imagen.
            borraArchivo(nombreCambiado, tipo);
            return res.status(400).json({
                status: false,
                err: {
                    message: 'El producto no existe.'
                }
            })
        }

        borraArchivo(productoDB.img, tipo);

        productoDB.img = nombreCambiado;

        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    err
                })
            }

            res.json({
                status: true,
                producto: productoSave,
                img: nombreCambiado
            })
        })
    });
}

function borraArchivo(nombreImagen, tipo) {
 
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
 
}

module.exports = app;