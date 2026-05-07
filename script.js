function actualizarInterfaz(){
    document.getElementById('visitas').innerText = localStorage.getItem('contadorVisitas') || 0;
    document.getElementById('Registros').innerText = localStorage.getItem('contadorRegistros') || 0;
    document.getElementById('Comentarios').innerText = localStorage.getItem('contadorComentarios') || 0;
}

window.onload = function(){
    let visitas = parseInt(localStorage.getItem('contadorVisitas')) || 0;
    visitas++;
    localStorage.setItem('contadorVisitas', visitas);
    actualizarInterfaz();
}

const registroForm = document.getElementById('registroForms');

registrosForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let registros = parseInt(localStorage.getItem('contadorRegistros')) || 0;
    registros++;
    localStorage.setItem('contadorRegistros', registros);

    actualizarInterfaz();
    alert("¡Gracias por registrarte!");
    registroForm.reset();
});

function enviarFeedback(){
    const cajaTexto = document-getElementById('comentario');
    const texto = cajaTexto.value.trim();

    if(texto !== "") {
        let comentarios = parseInt(localStorage.getItem('contadorComentarios')) || 0;
        comentarios++;
        localStorage.setItem('contadorComentaerios', comentarios);

        actualizarInterfaz();
        alert("Comentarios enviados, ¡gracias por tu feedback!");
        cajaTexto.value = "";
    } else {
        alert("Por Favor, escribe un comentario antes de enviar.");
    }
}

function animarNumero(id, valorFinal){
    let obj = document.getElementById(id);
    let inicio = 0;
    let duracion = 500;
    let paso = valorFinal / (duracion / 10);

    let temporizador = setInterval(() =>{
        inicio += paso;
        if(inicio >= valorFinal){
            obj.innerText = valorFinal;
            clearInterval(temporizador)
        } else {
            obj.innerText = Math.floor(inicio)
        }
    }, 10);
}
