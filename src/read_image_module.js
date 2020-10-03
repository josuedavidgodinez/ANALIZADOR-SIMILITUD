var jsonstring;

function makeblob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
 function analyze(file) {

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function(){
            var resultData = this.result;            
            resultData = resultData.split(',')[1];
            let image_promise = await processImage(resultData);       
           resolve(image_promise);
        };
    
        reader.onerror = reject;
    
        
      });
   


}



async function processImage(binaryImage) {    //    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    var resultado = await $.ajax({
        url: "https://2dociclourl2020.cognitiveservices.azure.com/face/v1.0/detect?" + $.param(params),

        method: "POST",
        type: "POST",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "1113e698f4574f19af28cb44de439789");


        },
        contentType: "application/octet-stream",
        mime: "application/octet-stream",
        data: makeblob(binaryImage, 'image/jpeg'),
        cache: false,
        processData: false


    }).done(function (data) {
        // Show formatted JSON on webpage.
        data;
    });

    console.log(resultado);
    return resultado;
}
