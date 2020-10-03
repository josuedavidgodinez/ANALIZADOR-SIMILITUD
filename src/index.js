var imagen1;
var imagen2;

async function loadImage(event, destino) {

  var myURL = window.URL || window.webkitURL
  console.log('winurl=' + myURL);
  var image = document.getElementById(destino);
  let source = myURL.createObjectURL(event.target.files[0]);
  image.src = source;

  destino == 'imagen1' ? (
    imagen1 = null,
    imagen1 = await analyze(event.target.files[0])
  )
    : (
      imagen2 = null,
      imagen2 = await analyze(event.target.files[0])
    );




};


async function predict(event) {
  event.preventDefault();

  var face1;
  var face2;

  var son_identicos;
  var porcentaje_parecido;
  var return_from_verify;



  (imagen1.length == 0 || imagen2.length == 0) ? alert("porfavor suba dos imagenes de caras de personas") : (
    face1 = imagen1[0].faceId,
    face2 = imagen2[0].faceId,
    return_from_verify = await call_api_for_verify(face1, face2),
    son_identicos = return_from_verify.isIdentical,
    porcentaje_parecido = return_from_verify.confidence,
    son_identicos ? alert("¡Son idéntidos! por un porcentaje de " + porcentaje_parecido) : alert(" No se parecen mucho, por un porcentaje de " + porcentaje_parecido)
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

  console.log(resultado);
  return resultado;

}

