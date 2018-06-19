const mongoose = require('mongoose')
const Schema= mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const ROLESVALIDOS ={
  values:[
    'ADMIN_ROLE',
    'USER_ROLE'
  ],
  message:'{VALUE} no es un rol permitido'
}
const usuarioSchema= new Schema({
  nombre:{
    type:String,
    required:[true,'El nombre es Necesario']
  },
  email:{
    type:String,
    required:[true,'El email es Necesario'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'El password es Necesario']
  },
  img:{
    type:String,
    required:false
  },
  role:{
    type:String,
    required:true,
    default:'USER_ROLE',
    enum:ROLESVALIDOS
  },
});
//sirve para mostrar un mensaje de error de validacion 
usuarioSchema.plugin(uniqueValidator,{
  message:'El {PATH} debe de ser unico'
})
module.exports=mongoose.model('Usuario',usuarioSchema);