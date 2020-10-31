const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports = (correo,porcentaje,parentesco,nombre) =>{

    var transporter = nodemailer.createTransport({

        service : 'gmail',
        auth :{
            user:'fabianalvarez23@gmail.com',
            pass: 'mwphtplhsjwohjpw'
        }


    });

    


        let archivo1;
        let archivo2;

    fs.readFile("./image.png", function (err, data) { 

       archivo1=data;

       fs.readFile("./image1.png", function (err, data) { 

        archivo2=data;
         
        const mailOptions = {
            from: 'ANALIZADOR DE SIMILITUD',
            to: correo, //formulario.email, // Cambia esta parte por el destinatario
            subject: 'Resultados de Análisis de Similitud',
            html:
            
            '<p><img class="center" style="display: block; margin-left: auto; margin-right: auto;" src="https://img.icons8.com/cotton/1600/financial-growth-analysis.png" alt="" width="150" height="150" /></p>'+
            '<h1 style="color: #5e9ca0; text-align: center;">HOLA '+nombre+'</h1>'+
            '<h1 style="color: #5e9ca0; text-align: center;">Tus Resultados del análisis</h1>'+
            '<p>&nbsp;</p>'+
            '<ol style="list-style: none; font-size: 14px; line-height: 32px; font-weight: bold;">'+
            '<li style="clear: both;"><h3>Porcentaje de Similitud: '+porcentaje+'</h3></li>'+
            '<li style="clear: both;"><h3>Parentesco: '+parentesco+'</h3></li>'+
            '</ol>'+
            '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>'+
            '<p><strong>Gracias por usar nuestros servicios!!!!!</strong></p>',
            attachments: [{'filename': 'image.png', 'content': archivo1},{'filename': 'image1.png', 'content': archivo2}] 
            };
    
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
            console.log(err)
            else
            console.log(info);
            });
    


     }); 


        
    }); 

   
    
}

