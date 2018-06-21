const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const {
  verificaToken
} = require('../middlewares/autentificacion')
//body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//get hospital
app.get('/', (req, res) => {
  let desde = Number(req.query.desde) || 0;
  Hospital.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario','nombre email')
  .exec(
    (err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error Cargando Usuario',
          errors: err
        })
      }
      Hospital.count({},(err,conteo)=>{
        res.status(200).json({
          ok: true,
          hospitales,
          total:conteo
        })
        
      })
    }
  )
});

//creando usuario
app.post('/',verificaToken,(req, res) => {
  let body = req.body;
  let hospital = new Hospital({
    nombre: body.nombre,
    usuario:req.usuario._id
  })
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Crear Hospital',
        errors: err
      })
    }
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
     
    })
  })
})






//actualizar usuario
app.put('/:id',verificaToken ,(req, res) => {
  let id = req.params.id;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al Buscar hospital',
        errors: err
      })
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Buscar ID hospital no existe',
        errors: {
          message: 'No existe un hospital con ese ID'
        }
      })
    }
    hospital.nombre=req.body.nombre;
    hospital.usuario=req.usuario._id;
    hospital.save((err,hospitalGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al Actualizar hospital',
          errors: err
        })
      }
      res.status(200).json({
        ok: true,
        hospitalGuardado
      });
    });
  });
});
//Eliminar Hospital
app.delete('/:id',verificaToken ,(req, res) => {
  let id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalborrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Borrar hospital',
        errors: err
      })
    }
    if (!hospitalborrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Mo existe un hospital con ese id',
        errors: {message:'Id no encontrado'}
      })
    }
    res.status(200).json({
      ok: true,
      hospitalborrado: hospitalborrado
    })
  });
})
module.exports=app;