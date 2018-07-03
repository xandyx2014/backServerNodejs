const express = require('express');
const moongose = require('mongoose');
const app = express();

//CORS
//ADVERTENSIA DEBERIAOS USAR UNA LIBRERIA COMO EXPRESSCORE
/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Contro-Allow-Methods',"POST, GET, PUT, DELETE, OPTIONS")
  next();
}); */
app.use(function(req, res, next) {
 
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  next();
});



//Importar Rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes=require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const ImagenesRoutes = require('./routes/imagenes');
//conexion a base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if (err) throw err;
  console.log("[Data Base] \x1b[32m%s\x1b[0m", "Online");
});
//------------server index config--------------
//muestra las imagenes del servidor
//http://localhost:3000/uploads/
// let serveIndex=require('serve-index')
// app.use(express.static(__dirname+'/'))
// app.use('/uploads',serveIndex(__dirname+'/uploads'))

app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/hospital',hospitalRoutes);
app.use('/medico',medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',ImagenesRoutes);

app.use('/',appRoutes);



app.listen(3000, console.log("[Server] \x1b[32m%s\x1b[0m", "Online"));