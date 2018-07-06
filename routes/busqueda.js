const express = require('express');
const app = express();
const Hospital = require('../models/hospital')
const Medicos = require('../models/medico')
const Usuario = require('../models/usuario')
//busqueda por coleccion
app.get('/coleccion/:tabla/:busqueda',(req,res)=>{
    let tabla = req.params.tabla
    let busqueda=req.params.busqueda
    let promesa;
    let regex = new RegExp(busqueda, 'i')
    switch (tabla) {
      case 'usuario':
        promesa=buscarUsuario(busqueda,regex)
      break;
      case 'medicos':
        promesa=buscarMedico(busqueda,regex)
      break;
      case 'hospitales':
        promesa=buscarHospitales(busqueda,regex)
      break;
      default:
        return res.status(400).json({
          ok:false,
          mensaje:'Los tipos de busqueda solo son usuario medicos y hospitales',
          erro:{message:'tipo tabla/colecion no valido'}
        })
      
    }
    promesa.then(data=>{
       res.status(200).json({
        ok:true,
        [tabla]:data
        
      })
    })
})




//busqueda general
app.get('/todo/:busqueda', (req, res) => {
  let busqueda = req.params.busqueda;
  // se usa una expresion iiregular para insensibilar las mayusculas y miniscula
  let regex = new RegExp(busqueda, 'i')
  Promise.all([
      buscarHospitales(busqueda, regex),
      buscarMedico(busqueda,regex),
      buscarUsuario(busqueda,regex)
    ])
    .then(respuestas =>{
        let[hospitales,medicos,usuario]=respuestas
        res.status(200).json({
          ok: true,
          hospitales:hospitales,
          medicos:medicos,
          usuario:usuario
        })
      })
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({
      nombre: regex
    }).populate('usuario','nombre email img').exec( (err, hospitales) => {
      if (err) {
        reject('Error al cargar hospitales');
      } else {
        resolve(hospitales);
      }
    })
  })
}


function buscarMedico(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medicos.find({
      nombre: regex
    })
    .populate('usuario','nombre email img')
    .populate('hospital')
    .exec( (err, medicos) => {
      if (err) {
        reject('Error al cargar medicos');
      } else {
        resolve(medicos);
      }
    })
  })
}
function buscarUsuario(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({},'nombre email role img').or([{'nombre':regex},{'email':regex}]).exec((err,usuario)=>{
      if(err){
        reject('error al cargar los usuarios')
      }else{
        resolve(usuario)
      }
    })
  })
}

module.exports = app;