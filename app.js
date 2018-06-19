const express = require('express');
const moongose = require('mongoose');
const app = express();

//Importar Rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes=require('./routes/login');
//conexion a base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if (err) throw err;
  console.log("[Data Base] \x1b[32m%s\x1b[0m", "Online");
});

app.use('/',appRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);



app.listen(3000, console.log("[Server] \x1b[32m%s\x1b[0m", "Online"));