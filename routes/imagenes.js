const express= require('express');
const path=require('path');
const app = express();
const fs = require('fs');

app.get('/:tipo/:img', (req, res) => {
  let tipo =req.params.tipo
  let img = req.params.img
  let pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${img}`)
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen)
  }else{
    let pathNoimagen = path.resolve(__dirname,'../assets/no-image.png')
    res.sendFile(pathNoimagen)
  }
 
});
module.exports=app;
