require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // paquete por defecto

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
 (err, res) =>{
  if(err) throw err;
  console.log("Conectado a la base de datos")
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});
// mongodb+srv://Migiman23:manclp1@cluster0.xowgh.mongodb.net/test