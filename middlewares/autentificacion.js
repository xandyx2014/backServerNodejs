const jwt = require('jsonwebtoken');
const {SEED} = require('../config/config');

exports.verificaToken=function(req,res,next){

  let token=req.query.token;
  jwt.verify(token,SEED,(err,decoded)=>{
      if(err){
        return res.status(401).json({
          ok: false,
          mensaje: 'Token incorrecto',
          errors: err
        })
      }
      //----el decoded es el payload los datos q se le asigno al token
      //----este se le asigna cuando se crea al al token
      //---- el SEED es la firma para verificar nuestra firma unica del programa
      //aqui le asignamos el usuario a los req  asi podremos acceder a cualquier lugar 
      req.usuario=decoded.usuario;
      //req.usuario = a q todas las petidiciones q utilisen este token tendran acceso al decoded del usuario
       next();
      /* res.status(200).json({
        ok:true,
        decoded
      }); */
      // decode = es el usuario que se guardo cuando se creo el token como un payload
  });
}
