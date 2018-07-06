const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/usuario');
const {verificaToken,verificaAdminRole,verificaAdmin_o_MismoUsuario} = require('../middlewares/autentificacion')
//body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//obtener todos los usuarios
app.get('/', (req, res) => {
  //el query son las variables obciones de la uri
  //ejemplo ?desde=5
  let desde = Number(req.query.desde) || 0;

  Usuario.find({}, 'nombre email img role google')
  .skip(desde)
  .limit(5)
  .exec(
    (err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error Cargando Usuario',
          errors: err
        })
      }
      Usuario.count({},(err,conteo)=>{
        res.status(200).json({
          ok: true,
          usuarios: usuarios,
          total:conteo
        })
      });
      
    }
  )
});

//creando usuario
app.post('/',(req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    rolee: body.role
  })
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Crear Usuario',
        errors: err
      })
    }
    res.status(201).json({
      ok: true,
      usuarios: usuarioGuardado,
      usuarioToken:req.usuario
    })
  })
})






//actualizar usuario
app.put('/:id',[verificaToken,verificaAdmin_o_MismoUsuario] ,(req, res) => {
  let id = req.params.id;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al Buscar Usuario',
        errors: err
      })
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al Buscar ID Usuario no existe',
        errors: {
          message: 'No existe un usuario con ese ID'
        }
      })
    }
    
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.role = req.body.role;

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });
        }

        usuarioGuardado.password = '...';

        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });
  });
});
//Eliminar Usuario
app.delete('/:id',[verificaToken,verificaAdminRole] ,(req, res) => {
  let id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuario) => {
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
      usuario: usuario
    })
  });
})
module.exports = app;