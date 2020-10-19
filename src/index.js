var imagen1;
var imagen2;
var img1Lista = false;
var img2Lista = false;

async function loadImage(event, destino) {
  archivo = event.target.files[0];
  var myURL = window.URL || window.webkitURL
  if(archivo.type.startsWith("image")){
    var image = document.getElementById(destino);
    let source = myURL.createObjectURL(archivo);    
    destino == 'imagen1'? (ShowSpinner('spinner1'),
      imagen1 = null,
      imagen1 = await analyze(archivo),
      verifImg1 = setInterval(verifImg1Handler,100),HideSpinner('spinner1'),
      image.src = source
    ) : (ShowSpinner('spinner2'),
      imagen2 = null,
      imagen2 = await analyze(archivo),
      verifImg2 = setInterval(verifImg2Handler,100),HideSpinner('spinner2'),
      image.src = source
    );
  }else{
    alert("Seleccione una imagen");
  }  
};

async function predict(event) {
  ShowSpinner('GIF');
  event.preventDefault();
  var face1;
  var face2;
  var son_identicos;
  var porcentaje_parecido;
  var return_from_verify;

  (!img1Lista || !imagen2) ? alert("porfavor suba dos imagenes de caras de personas") : (
    face1 = imagen1[0].faceId,
    face2 = imagen2[0].faceId,
    return_from_verify = await call_api_for_verify(face1, face2),
    son_identicos = return_from_verify.isIdentical,
    porcentaje_parecido = return_from_verify.confidence,
    res_mess = porcentaje_parecido * 100,
    res_mess = res_mess.toFixed(2),
    res_mess = res_mess.toString() + "%",
    await sleep(3000),HideSpinner('GIF'),
    son_identicos ? alert('¡Son idénticos!') : alert('Parentesco: ' + getParentesco(porcentaje_parecido) + '\nPorcentaje de Similitud: ' + res_mess)
  );
}

async function call_api_for_verify(faceid1, faceid2) {
  var resultado = await $.ajax({
    url: "https://2dociclourl2020.cognitiveservices.azure.com/face/v1.0/verify",

    method: "POST",
    type: "POST",
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "1113e698f4574f19af28cb44de439789");
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
      alert("Imagen 1 Lista");
      img1Lista = true;
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
      alert("Imagen 2 Lista");
      img2Lista = true;
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