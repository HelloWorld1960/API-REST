'use strict';

//Express es un framework que nos permite crear la estructura necesaria para comenzar a trabajar.
//body-parser funciona como midlware, extrae la parte del cuerpo completo de una secuencia de solicitud entrante y lo convierte a un formato JSON.
//mongoose tiene un metodo llamado conect que nos permite pasarle un string con una url de donde esta la bd y empezar a ejecutar la palicacion.
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Usar el modelo para la BD.
const Product = require('./models/product');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended : false}));
//Para poder admitir mensajes en formato json.
app.use(bodyParser.json());

//Peticion de tipo get.
//Retorna todos los productos de la BD.
app.get('/api/product', (req, res) => {
  //La funcion find se usa para especificar que queremos recuperar todos los documentos de la coleccion de MongoDB.
  //Al pasarle un objeto vacio a la funcion find(), se le indica que busque todos.
  Product.find({}, (err, products) => {
    if (err) return (res.status(500).send({message : `Error al realizar la peticion: ${err}`}));
    if (!products) return (res.status(404).send({message : `No existen productos.`}));

    res.status(200).send({products : products});
  });
});

//Peticion de tipo get que recibe un parametro.
//Buscara en la BD un productId que tenga un producto en concreto.
app.get('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return (res.status(500).send({message : `Error al realizar la peticion: ${err}`}));
    if (!product) return (res.status(404).send({message : `El producto no existe`}));

    res.status(200).send({product : product});
  });
});

//Peticion de tipo post.
//Para almacenar un nuevo producto.
app.post('/api/product', (req, res) => {
  console.log('POST /api/product');
  console.log(req.body);

  //Almacenar en la BD el producto.
  //instanciamos un Objeto de Product que es el modelo de la BD.
  let product = new Product();
  product.name = req.body.name;
  product.picture = req.body.picture;
  product.price = req.body.price;
  product.category = req.body.category;
  product.description = req.body.description;

  //Salvar datos en la BD.
  product.save((err, productStored) => {
    if (err) res.status(500).send({message : `Error al salvar en la BD: ${err}`});

    res.status(200).send({product : productStored});
  });
});

//Peticion de tipo put.
//Esta funcion actualiza un recurso de l BD.
app.put('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
    if (err) res.status(500).send({message : `Error al actualizar el producto: ${err}`});

    res.status(200).send({ product : productUpdate});
  });
});

//Peticion de tipo delete.
//Esta funcion borra un recurso de la BD
app.delete('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;
  //findById es una funcion de mongoose.
  Product.findById(productId, (err, product) => {
    if (err) res.status(500).send({message : `Error al borrar el producto: ${err}`});

    product.remove((err) => {
      if (err) res.status(500).send({message : `Error al borrar el producto: ${err}`});
      res.status(200).send({message : `EL producto ha sido eliminado.`});
    });
  });
});

//funcion para conectar a la BD
//Es necesario tener en ejecucion la BD de mongo.
mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
  if(err)  {
    console.log('Error al conectar a la Base de Datos.');
  }
  console.log('Conexion a la base de datos establecida');

  //funcion que ejecuta el servidor API.
  app.listen(port, function() {
    console.log(`API RESTfull corriendo en http://localhost:${port}`);
  });
});
