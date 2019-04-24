'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creacion del esquema para la BD.
//Si llega una categoria diferente a las establecidas, entonces no se almacena.
const ProductSchema = mongoose.Schema({
  name: String,
  picture: String,
  price: {type: Number, default: 0},
  category: {type: String, enum: ['computers', 'phones', 'accesories']},
  description : String
});

//Exportar modelo para que pueda ser usado como modulo.
module.exports = mongoose.model('Product', ProductSchema);
