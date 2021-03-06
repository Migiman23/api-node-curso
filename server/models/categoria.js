const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es oblogatoria'] },
    usuario: { type: Schema.ObjectId, ref: 'Usuario'}
})

module.exports = mongoose.model('Categoria', categoriaSchema);