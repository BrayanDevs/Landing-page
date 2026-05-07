const firebaseConfig = {
  apiKey: "AIzaSyCgYBgHW_eUC_SbeXSBnjURyqOkrxkIAJE",
  authDomain: "lading-page-metrics.firebaseapp.com",
  databaseURL: "https://lading-page-metrics-default-rtdb.firebaseio.com",
  projectId: "lading-page-metrics",
  storageBucket: "lading-page-metrics.firebasestorage.app",
  messagingSenderId: "456968293121",
  appId: "1:456968293121:web:3f27776dce601b7a1c6900",
  measurementId: "G-5SLD0D9RZQ"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const visitasRef = database.ref('metricas/visitas');
const registrosRef = database.ref('metricas/registros');
const comentariosRef = database.ref('metricas/comentarios');

// ==========================================
// LÓGICA DE VISITAS (Automática)
// ==========================================

// Sumar 1 visita cada vez que se carga la página

visitasRef.transaction((currentValue) => {
    return(currentValue || 0 ) + 1;
});

// Escuchar cambios en el contador de visitas y actualizar el HTML
visitasRef.on('value', (snapshot) => {
    document.getElementById('visitas').innerText = snapshot.val() || 0;
});

// ==========================================
// LÓGICA DE REGISTROS (Formulario)
// ==========================================

const registroForms = document.getElementById('registroForms');

registroForms.addEventListener('submit', (e) => {
    e.preventDefault();

    database.ref('metricas/registros').transaction((valorActual) => {
        return (valorActual || 0) +1;
    }).then(() => {
        alert("Gracias por registrarte");
        registroForms.reset();
    
    }).catch((error) => {
        console.error("Error al actualizar registros: ", error);
    });    
});

database.ref('metricas/registros').on('value', (snapshot) => {
    const totalRegistros = snapshot.val() || 0;
    const elemenentoContador = document.getElementById('registros');
    if(elemenentoContador){
        elemenentoContador.innerText = totalRegistros;
    }
});

// ==========================================
// LÓGICA DE COMENTARIOS (Feedback)
// ==========================================
function enviarFeedback(){
    const cajaTexto = document.getElementById('comentario');
    const mensaje = cajaTexto.value;

    const nombreUsuario = document.querySelector('input[name="nombre"]').value || "Anónimo";
    const correoUsuario = document.querySelector('input[name="email"]').value || "Sin correo";

    if(mensaje.trim() !== ""){
        const nuevoComentarioRef = database.ref('detalles_comentarios').push();
        nuevoComentarioRef.set({
            nombre: nombreUsuario,
            correo: correoUsuario,
            comentario: mensaje,
            fecha: Date.now()
        });

        database.ref('metricas/comentarios').transaction((valorActual) => {
            return (valorActual || 0) + 1;
        });

        alert("Gracias por el comentario");
        cajaTexto.value = "";
    } else {
        alert("Por favor, escribe un comentario antes de enviar.");
    }
}

database.ref('detalles_comentarios').on('value', (snapshot) => {
    const contenedor = document.getElementById('listaComentarios');
    contenedor.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        
    
        const div = document.createElement('div');
        div.classList.add('tarjeta-comentario');
        div.innerHTML = `
            <div class="user-info">
                <strong>${data.nombre}</strong> 
                <span>Usuario: ${data.correo}</span>
            </div>
            <p class="text-comment">${data.comentario}</p>
            <hr>
        `;
        contenedor.prepend(div);
    });
});