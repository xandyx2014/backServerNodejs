const express= require('express');
const app = express();


app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada Correctamente'
  })
});
module.exports=app;
