const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const Usuario = require('../models/usuario');
const {
  SEED
} = require('../config/config')
const {
  CLIENT_ID
} = require('../config/config')
const bodyParser = require('body-parser');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//obtener todos los usuarios
//====================================
//Autentificacion normal
//====================================
app.post('/', (req, res) => {
  let body = req.body;
  Usuario.findOne({
    email: body.email
  }, (err, usuarioDB) => {
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
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorreta - contraseña',
        errors: {
          message: 'No existe un usuario con ese ID'
        }
      })
    }
    //crear un token
    usuarioDB.password = '...';
    //el seed es la firma que sirve para identificar al usuario
    let token = jwt.sign({
      usuario: usuarioDB
    }, SEED, {
      expiresIn: 14400
    })
    res.status(200).json({
      ok: true,
      usuarioDB,
      id: usuarioDB._id,
      token,
      menu:obtenerMenu(usuarioDB.role)
    });
  })

})
//====================================
//por google
//====================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
  }
}
app.post('/google', async (req, res) => {
  let token = req.body.token;
  let googleUser = await verify(token).catch(err => {
    return res.status(403).json({
      ok: false,
      mensaje: 'Token no valido'
    })
  })
  Usuario.findOne({
    email: googleUser.email
  }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error Cargando Usuario',
        errors: err
      });
    }
    //si existe un usuario
    if (usuarioDB) {
      //si fue autenticado por google
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe de usar su autenticacion normal'
        });
      } else {
          let token = jwt.sign({usuario: usuarioDB}, SEED, {
            expiresIn: 14400
          })
          res.status(200).json({
            ok: true,
            usuarioDB,
            id: usuarioDB._id,
            token,
            menu:obtenerMenu(usuarioDB.role)
          });
      } 
    }else{
      //si el usuario fue creado con una cuenta de google
      let usuario = new Usuario()
      usuario.nombre=googleUser.nombre
      usuario.email=googleUser.email
      usuario.img=googleUser.img
      usuario.google=true
      usuario.password='...'
      usuario.save((err,usuarioDB)=>{
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error Cargando Usuario',
            errors: err
          });
        }
        let token = jwt.sign({usuario: usuarioDB}, SEED, {
          expiresIn: 14400
        })
        res.status(200).json({
          ok: true,
          usuarioDB,
          id: usuarioDB._id,
          token,
          menu:obtenerMenu(usuarioDB.role)
        });
      })

    }
  })

  // res.status(200).json({
  //   ok: true,
  //   mensaje: 'Peticion realizada Correctamente',
  //   googleUser:googleUser
  // })
});
function obtenerMenu(ROLE){
  menu=[
    {
      titulo:'Principal',
      icono:'mdi mdi-gauge',
      submenu:[
        {titulo:'DashBoard',url:'/dashboard'},
        {titulo:'ProgressBar',url:'/progress'},
        {titulo:'Graficas',url:'/graficas1'},
        {titulo:'Promesas',url:'/promesas'},
        {titulo:'Rxjs',url:'/rxjs'},
      ]
    },
    {
      titulo:'Mantenimiento',
      icono:'mdi mdi-folder-lock-open',
      submenu:[
        //{titulo:'Usuarios',url:'/usuarios'},
        {titulo:'Hospitales',url:'/hospitales'},
        {titulo:'Medicos',url:'/medicos'}
      ]
    }
  ]
  if (ROLE === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({titulo:'Usuarios',url:'/usuarios'})
  }
  return menu;
}
module.exports = app;