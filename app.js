const express = require('express');
const moongose = require('mongoose');
const app = express();
//conexion a base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if (err) throw err;
  console.log("[Data Base] \x1b[32m%s\x1b[0m", "Online");
});
//ruta get '/'
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada Correctamente'
  })
});


app.listen(3000, console.log("[Server] \x1b[32m%s\x1b[0m", "Online"));