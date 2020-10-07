require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.urlDB,
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
 (err, res) =>{
  if(err) throw err;
  console.log("Conectado a la base de datos")
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});
// mongodb+srv://Migiman23:manclp1@cluster0.xowgh.mongodb.net/test