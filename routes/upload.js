const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')
const fs = require('fs')
app.use(fileUpload());
app.put('/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  
  //tipos de coleccion
  let tiposValidos = ['hospitales', 'medicos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error Tipo Coleccion no valida',
      errors: {
        message: 'debe seleccionar Tipo valido'
      }
    })
  }
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error Cargando Archivos',
      errors: {
        message: 'debe seleccionar una imagen'
      }
    })
  }
  //Obtener el nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split('.');
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];
  //solo estas extensiones aceptadas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'extensiones no validas',
      errors: {
        message: `Las extensiones validas son ${[...extensionesValidas]}`
      }
    })
  }
  //nombre de archivo personalizado
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`

  //Movel el archivo del temporal a un path
  let path = `./uploads/${tipo}/${nombreArchivo}`
  archivo.mv(path, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al movel el archivo',
        errors: err
      })
    }
    subirPortTiopo(tipo, id, nombreArchivo, res)
  })
});

function subirPortTiopo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      if(!usuario){
        return res.status(400).json({
          ok: true,
          mensaje: 'Usuario no existe',
          errors:{message:'usuario no existe'}
        })
      }
      let pathViejo = './uploads/usuarios/' + usuario.img
      //si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)){
        fs.unlink(pathViejo,(err)=>{
          if (err) {
            console.log(err)
          } 
        })
      }
      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada',
          usuario:usuarioActualizado
        })

      })

    })
  }
  if (tipo === 'medicos') {
    Medico.findById(id)
    .exec((err,medico)=>{
      if(!medico){
        return res.status(400).json({
          ok: true,
          mensaje: 'Medico no existe',
          errors:{message:'Medico no existe'}
        })
      }


      let pathViejo = './uploads/medicos/' + medico.img
      if (fs.existsSync(pathViejo)){
        fs.unlink(pathViejo,(err)=>{
          if (err) {
            console.log(err)
          } 
        })
      }
      medico.img=nombreArchivo
      medico.save((err,medicoActualizado)=>{
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de Medico actualizada',
          medico:medicoActualizado,
        })
      })
    })

  }
  if (tipo === 'hospitales') {
    Hospital.findById(id)
    .exec((err,hospital)=>{
      if(!hospital){
        return res.status(400).json({
          ok: true,
          mensaje: 'Hospital no existe',
          errors:{message:'Hospital no existe'}
        })
      }



      let pathViejo = './uploads/hospitales/' + hospital.img
      if (fs.existsSync(pathViejo)){
        fs.unlink(pathViejo,(err)=>{
          if (err) {
            console.log(err)
          } 
        })
      }
      hospital.img=nombreArchivo
      hospital.save((err,hospitalActualizado)=>{
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de Hospital actualizada',
          hospital:hospitalActualizado,
        })
      })
    })

  }

}

module.exports = app;