var keyFrames = [];
var trasicion;
var opacidad = 0;
var audio = document.getElementById("audiop");
var nombre_guion = "guiones/guionLoveCraft.json";

function CargarJson() {
    fetch(nombre_guion)
        .then((respuesta) => respuesta.json()) //Indica el formato en el que se quiere la informacion

        .then(function (guion) {
            for (let i = 0; i < guion.data.length; i++) {
                keyFrames[i] = guion.data[i];
                console.log("sistema de fundido: Listo");
            }
        });
    /* 
    Fetch es una estandar para comunicarse con un servidor.
    El primer then indica en que formato guardas la data del Json.
    A partir del segundo then, el parametro que tengas dentro de la funcion es la variable de la data.
    */
}

function crearElementoDeTrasicion() {
    trasicion = document.createElement("fundido");
    //trasicion.setAttribute("id", "transicion");
    trasicion.style.opacity = opacidad;
    document.body.appendChild(trasicion);
}

function duracionDeFadeIn(_keyFrame) {
    if (_keyFrame.fadeIn != undefined) {
        return _keyFrame.fadeIn / 1000;
    } else return 0;
}
function duracionDeFadeOut(_keyFrame) {
    return _keyFrame.fadeOut / 1000;
}

function deTextoATiempo(texto) {
    var t = texto.split(":");
    var tFinal = 0;
    var nivel = 1;
    for (var i = t.length - 1; i >= 0; i--) {
        tFinal += parseInt(t[i]) * nivel;
        nivel *= 60;
    }
    return tFinal;
}

function fadeIn(_keyFrame) {
    let velocidad = 1 / (duracionDeFadeIn(_keyFrame) * 60); //60 es el framerate
    if (opacidad < 1) opacidad += velocidad;
    else opacidad = 1;
    trasicion.style.backgroundColor = _keyFrame.fadeColor;
    trasicion.style.opacity = opacidad;
}

function fadeOut(_keyFrame) {
    let velocidad = 1 / (duracionDeFadeOut(_keyFrame) * 60); //60 es el framerate
    if (opacidad > 0) opacidad -= velocidad;
    else opacidad = 0;
    trasicion.style.backgroundColor = _keyFrame.fadeColor;
    trasicion.style.opacity = opacidad;
}

function controlarTrasiciones() {
    requestAnimationFrame(controlarTrasiciones);
    for (let i = 0; i < keyFrames.length; i++) {
        if (keyFrames[i].fadeIn != undefined || keyFrames[i].fadeOut != undefined) {
            let finDelFadeIn = deTextoATiempo(keyFrames[i].tiempo) + duracionDeFadeIn(keyFrames[i]);
            let finDelFadeOut = finDelFadeIn + duracionDeFadeOut(keyFrames[i]);
            if (audio.currentTime >= deTextoATiempo(keyFrames[i].tiempo) && audio.currentTime < finDelFadeIn) {
                fadeIn(keyFrames[i]);
                console.log(`keyFrame ${i} fadeIn`);
                break;
            }
            if (audio.currentTime >= finDelFadeIn && audio.currentTime <= finDelFadeOut) {
                fadeOut(keyFrames[i]);
                console.log("fadeOut");
                break;
            }
        }
    }
    //console.log(opacidad);
}

CargarJson();
crearElementoDeTrasicion();
controlarTrasiciones();
