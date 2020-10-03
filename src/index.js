var imagenes = Array();

async function loadImage(event, destino) {
  var myURL = window.URL || window.webkitURL
  console.log('winurl=' + myURL);
  var image = document.getElementById(destino);
  let source = myURL.createObjectURL(event.target.files[0]);
  image.src = source;
  var imagen;
  imagen = await analyze(event.target.files[0]);
  imagenes.push(imagen);


};


function predict(event) {
  event.preventDefault();
  console.log(imagenes);

}

