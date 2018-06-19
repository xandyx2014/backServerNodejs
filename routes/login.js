const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const Usuario = require('../models/usuario');
const {SEED} = require('../config/config')
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//obtener todos los usuarios
app.post('/',(req,res)=>{
  let body = req.body;
  Usuario.findOne({email:body.email},(err,usuarioDB)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error Cargando Usuario',
        errors: err
      });
    }
    //verificamos el email
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorreta - email',
        errors: {
          message: 'No existe un usuario con ese ID'
        }
      })
    }
    //verificamos la contraseña
    if(!bcrypt.compareSync(body.password,usuarioDB.password)){
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorreta - contraseña',
        errors: {
          message: 'No existe un usuario con ese ID'
        }
      })
    }
    //crear un token
    usuarioDB.password='...';
    //el seed es la firma que sirve para identificar al usuario
    let token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn:14400})
    res.status(200).json({
      ok:true,
      usuarioDB,
      id:usuarioDB._id,
      token
    });
  })
  
})


module.exports = app;