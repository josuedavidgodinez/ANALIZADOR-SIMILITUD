var express = require('express');
var router = express.Router();
const ConfigCorreo = require("./config_correo");
const imageToBase64 = require('image-to-base64');
router.post("/EnviarSolicitudes", (req, res, next) => {
    console.log(req.body)
    
    var correo = req.body.email;
    var porcentaje = req.body.porcentaje;
    var parentesco = req.body.parentesco;
    console.log(( req.files.imagen1.path))
 /*   imageToBase64( req.files.imagen1)
    .then(                    
        (foto) => {
            
           console.log(foto)
        }
    )*/
   // ConfigCorreo(correo,porcentaje,parentesco,req.body.imagen1);
    res.status(200).json({mensaje: "Por favor revisar su correo electrónico, si no sale en principal también revisar Spam."});                
    res.end();

});

module.exports = router;