var imagen1;
var imagen2;
var img1Lista = false;
var img2Lista = false;
var archivo1;
var archivo2;
var porcentaje;
var parentesco;
var inLoad = false;
imagen11 = new Array();
imagen22= new Array();
var $stream;
var $video1, $video2, $canvas1, $canvas2;
window.onload = function() {
  $video1 = document.getElementById('video1'),
  $video2 = document.getElementById('video2'),
  $canvas1 = document.getElementById('canvas1'),
  $canvas2 = document.getElementById('canvas2');
}

const tieneSoporteUserMedia = () =>
    !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
const _getUserMedia = (...arguments) =>
    (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);
    
    const obtenerDispositivos = () => navigator
    .mediaDevices
    .enumerateDevices();
    const mostrarStream = idDeDispositivo => {
      _getUserMedia({
              video: {
                  // Justo aquí indicamos cuál dispositivo usar
                  deviceId: idDeDispositivo,
              }
          },
          (streamObtenido) => {
            stream = streamObtenido;             
              $video1.style.display = 'block';
              $video1.srcObject = stream;
              $video1.play();                     
          }, (error) => {
            console.log("Permiso denegado o error: ", error);
            $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
        });
        }

function camera(clase){
  var elems = document.getElementsByClassName(clase);
  for (i = 0; i < elems.length; i++) {
    elems[i].style.display = 'none';
    elems[i].style.top = '100%';
  }

  if(!inLoad){  
    if (!tieneSoporteUserMedia()) {
      alert("Lo siento. Tu navegador no soporta esta característica");
      $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
      return;
    }    
    obtenerDispositivos()
        .then(dispositivos => {
            // Vamos a filtrarlos y guardar aquí los de vídeo
            const dispositivosDeVideo = [];

            // Recorrer y filtrar
            dispositivos.forEach(function(dispositivo) {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            // y le pasamos el id de dispositivo
            if (dispositivosDeVideo.length > 0) {
                // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
                mostrarStream(dispositivosDeVideo[0].deviceId);
            }
        });
    inLoad = true;
    alert("vuelva a presionar el botón de cámara para tomar la foto");
  }else{
    //Pausar reproducción
    $video1.pause();

    //Obtener contexto del canvas y dibujar sobre él
    let contexto = $canvas1.getContext("2d");
    $canvas1.width = $video1.videoWidth;
    $canvas1.height = $video1.videoHeight;
    contexto.drawImage($video1, 0, 0, $canvas1.width, $canvas1.height);

    let foto = $canvas1.toDataURL(); //Esta es la foto, en base 64

    let enlace = document.createElement('a'); // Crear un <a>
    enlace.download = "foto_analisis.png";
    enlace.href = foto;
    $video1.style.display = 'none';    
    inLoad = false;
    vidOff();
    alert("Después de descargar la imagen, podrás subirla para análisis"); 
    enlace.click();
    for (i = 0; i < elems.length; i++) {
      elems[i].style.display = 'block';
      
    }
    //Reanudar reproducción    
  }
  

}
async function loadImage(event, destino,archivo_fuente) {
  archivo_fuente == null ?
  (archivo = event.target.files[0] )
  :(archivo=archivo_fuente);

  var myURL = window.URL || window.webkitURL
  if(archivo.type.startsWith("image")){
    var image = document.getElementById(destino);
    console.log(image);
    let source = myURL.createObjectURL(archivo);
    console.log(source);
    destino == 'imagen1'? (
      ShowSpinner('spinner1'),
      imagen1 = null,
      imagen1 = await analyze(archivo),
      verifImg1 = setInterval(verifImg1Handler,100),
      HideSpinner('spinner1'),
      image.src = source,
      archivo1=archivo,
      imagen11 = event.target.files,
      image.style.display='none'
    ) : (ShowSpinner('spinner2'),
      imagen2 = null,
      imagen2 = await analyze(archivo),
      verifImg2 = setInterval(verifImg2Handler,100),
      HideSpinner('spinner2'),
      image.src = source,
      archivo2=archivo,
      archivo22 = event.target.files,
      image.style.display='none'
    );
  }else{
    alert("Seleccione una imagen");
  }  
};

async function predict(event) {
  event.preventDefault();
  var face1;
  var face2;
  var son_identicos;
  var porcentaje_parecido;
  var return_from_verify;

  (!img1Lista || !img2Lista) ? alert('por favor suba dos imagenes de caras de personas') : (
    ShowSpinner('analisis'),
    ShowSpinner('GIF'),
    face1 = imagen1[0].faceId,
    face2 = imagen2[0].faceId,
    return_from_verify = await call_api_for_verify(face1, face2),
    son_identicos = return_from_verify.isIdentical,
    porcentaje_parecido = return_from_verify.confidence,
    res_mess = porcentaje_parecido * 100,
    res_mess = res_mess.toFixed(2),
    res_mess = res_mess.toString() + '%',
    await sleep(3000),
    porcentaje = res_mess,
    parentesco = getParentesco(porcentaje_parecido),
    HideSpinner('GIF'),
    HideSpinner('analisis'),
    son_identicos ? alert('¡Son idénticos!') : alert('Parentesco: ' + getParentesco(porcentaje_parecido) + '\nPorcentaje de Similitud: ' + res_mess)
  );
}

async function call_api_for_verify(faceid1, faceid2) {
  var resultado = await $.ajax({
    url: "https://proyectoadmin.cognitiveservices.azure.com/face/v1.0/verify",

    method: "POST",
    type: "POST",
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "27d5999361474b23bc1d0f6dbdbbd424");
    },
    contentType: "application/json",
    data: '{"faceId1": ' + '"' + faceid1 + '","faceId2": ' + '"' + faceid2 + '"}',

  }).done(function (data) {
    // Show formatted JSON on webpage.
    data;
  });
  return resultado;
}

function verifImg1Handler(){
  if(typeof imagen1 == 'undefined'){
    return
  }else{
    if(imagen1 == null){
      return
    }else{
      if(imagen1.length == 0){
        imagen1 = null;
        document.getElementById('imagen1').src = '';
        alert('No se detectó un rostro en la imagen');
        return
      }
      if(!img1Lista){
        alert('Imagen 1 Lista');
        img1Lista = true;
      }
      clearInterval(verifImg1);
    }
  }
}

function verifImg2Handler (){
  if(typeof imagen2 == 'undefined'){
    return
  }else{
    if(imagen2 == null){
      return
    }else{
      if(imagen2.length == 0){
        imagen2 = null;
        document.getElementById('imagen2').src = '';
        alert('No se detectó un rostro en la imagen');
        return
      }
      if(!img2Lista){
        alert('Imagen 2 Lista');
        img2Lista = true;
      }
      clearInterval(verifImg2);
    }
  }
}

function getParentesco(porcentaje){
  if(porcentaje < .20) return 'Ninguno';
  if(porcentaje < .40) return 'Primos Lejanos';
  if(porcentaje < .60) return 'Primos/Tios';
  if(porcentaje < .80) return 'Hemanos';
  if(porcentaje < .90) return 'Papá/Mamá e hijos';
  return 'Misma Persona';
}

function HideSpinner(id){
  document.getElementById(id) 
  .style.display = 'none';
}
function ShowSpinner(id){
  document.getElementById(id) 
  .style.display = 'block';
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getBase64OfFile = (file, callback) => {
  const fr = new FileReader();
  fr.addEventListener('load', (e) => {
    if(typeof callback === 'function') {
      callback(fr.result.split('base64,')[1]);
    }
  });
  fr.readAsDataURL(file);
}

function mandarCorreo(){
  const file = archivo1;
  const file1 = archivo2;
    file && getBase64OfFile(file, (data) => {
      file1 && getBase64OfFile(file1, (data1) => {
        $.ajax({
          url: "http://localhost:8000/EnviarSolicitudes",    
          data: {
                 imgdata:data,
                 imgdata1:data1,
                 email:$("#email").val(),
                 firstname:$("#firstname").val(),
                 porcentaje:porcentaje,
                 parentesco:parentesco
               },
          type: 'post',
          success: function (response) {   
                   console.log(response);
             //$('#image_id img').attr('src', response);
          }
        });
    });
  });
}

function vidOff() {  
  var media = $video1.srcObject;
  var tracks = media.getTracks();
  tracks.forEach(track => track.stop());  
}