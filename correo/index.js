const express = require('express'),
bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());
// middlewares

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




// Settings
app.set('port', process.env.PORT || 8000);

// Routes
/*var IndexController = require("./index.controller");
app.use('/', IndexController);*/
var multer = require('multer');
var upload = multer();
app.use(upload.array()); 
app.use(express.static('public'));
const ConfigCorreo = require("./config_correo");
app.post("/EnviarSolicitudes", (req, res, next) => {
  
  //    console.log(req.body)
  
  var correo = req.body.email;
  var porcentaje = req.body.porcentaje;
  var parentesco = req.body.parentesco;
  var nombre = req.body.firstname;
  
  fs.writeFile('image.png', req.body.imgdata, {encoding: 'base64'}, function(err) {
    console.log('File created');
    fs.writeFile('image1.png', req.body.imgdata1, {encoding: 'base64'}, function(err) {
    ConfigCorreo(correo,porcentaje,parentesco,nombre);
  });
});
 
      
  res.status(200).json({mensaje: "Por favor revisar su correo electrónico, si no sale en principal también revisar Spam."});                
  res.end();

});

// Starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});