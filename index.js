'use strict';

//Express es un framework que nos permite crear la estructura necesaria para comenzar a trabajar.
//body-parser funciona como midlware, extrae la parte del cuerpo completo de una secuencia de solicitud entrante y la expone en req.body.
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended : false}));
//Para poder admitir mensajes en formato json.
app.use(bodyParser.json());

//
app.get('/hola/:name', (req, res) => {
  res.send({message : `Hola ${req.params.name}!`});
});

app.listen(port, function() {
  console.log(`API RESTfull corriendo en http://localhost:${port}`);
});
