const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Medico = require('../models/medico');
const {verificaToken} = require('../middlewares/autentificacion')
//body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(bodyParser.json())
//obtener todos los Hospital
app.get('/', (req, res) => {
  let desde = Number(req.query.desde) || 0;
  Medico.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario','nombre email')
  .populate('hospital')
  .exec(
    (err, medico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error Cargando Usuario',
          errors: err
        })
      }
      Medico.count({},(err,conteo)=>{ 
        res.status(200).json({
          ok: true,
          medico: medico,
          total:conteo
        })
      })
    }
  )
});

//creando usuario
app.post('/',verificaToken,(req, res) => {
  let body = req.body;
  let medico = new Medico({
    nombre: body.nombre,
    usuario:req.usuario._id,
    hospital:req.body.hospital
  })
  medico.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Crear medico',
        errors: err
      })
    }
    res.status(201).json({
      ok: true,
      Hospital: usuarioGuardado,
    })
  })
})






//actualizar usuario
app.put('/:id',verificaToken ,(req, res) => {
  let id = req.params.id;
  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al Buscar medico',
        errors: err
      })
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Buscar ID medico no existe',
        errors: {
          message: 'No existe un medico con ese ID'
        }
      })
    }
    medico.nombre = req.body.nombre;
    medico.usuario= req.usuario._id;
    medico.hospital=req.body.hospital;
    medico.save((err,medicoGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al Actualizar Usuario',
          errors: err
        })
      }
      
      res.status(200).json({
        ok: true,
        usuario: medico
      })
    })
    
    
  });
});
//Eliminar Usuario
app.delete('/:id',verificaToken ,(req, res) => {
  let id = req.params.id;
  Medico.findByIdAndRemove(id, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Actualizar Usuario',
        errors: err
      })
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Mo existe un usuario con ese id',
        errors: {message:'Id no encontrado'}
      })
    }
    res.status(200).json({
      ok: true,
      Medico: usuario
    })
  });
})

module.exports=app;