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

const feedbackForm = document.getElementById('feedbackForm');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Detiene el refresco de pantalla

        const nombre = document.getElementById('feedback-nombre').value;
        const correo = document.getElementById('feedback-correo').value;
        const mensaje = document.getElementById('feedback-mensaje').value;

        // 1. Guardar en la base de datos (Colección independiente)
        const nuevoComentarioRef = database.ref('lista_comentarios').push();

        nuevoComentarioRef.set({
            nombre: nombre,
            correo: correo,
            mensaje: mensaje,
            fecha: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            // 2. Aumentar el contador de la métrica (id="comentarios" en tu sección de métricas)
            return database.ref('metricas/comentarios').transaction((valorActual) => {
                return (valorActual || 0) + 1;
            });
        }).then(() => {
            alert("¡Gracias por tu comentario!");
            feedbackForm.reset(); // Limpia el formulario
        }).catch((error) => {
            console.error("Error al enviar:", error);
        });
    });
}

// 3. Escuchar el CONTADOR de métricas (id="comentarios" en el HTML de métricas)
database.ref('metricas/comentarios').on('value', (snapshot) => {
    const total = snapshot.val() || 0;
    const elementoContador = document.getElementById('comentarios');
    if (elementoContador) {
        elementoContador.innerText = total;
    }
});

// 4. Escuchar la LISTA para mostrar los comentarios abajo
database.ref('lista_comentarios').on('value', (snapshot) => {
    const listaContenedor = document.getElementById('listaComentarios');
    if (!listaContenedor) return;
    
    listaContenedor.innerHTML = ""; 

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const fechaLegible = data.fecha ? new Date(data.fecha).toLocaleString() : "";

        // AQUÍ APLICAMOS LA FUNCIÓN:
        const correoPrivado = ofuscarEmail(data.correo);

        const div = document.createElement('div');
        div.className = 'targeta-comentario'; 
        
        div.innerHTML = `
            <div class="user-info">
                <strong>${data.nombre}</strong>
                <span>${correoPrivado}</span> <!-- Ahora se verá privado -->
                <small>${fechaLegible}</small>
            </div>
            <p class="text-comment">${data.mensaje}</p>
        `;
        
        listaContenedor.prepend(div); 
    });
});
function ofuscarEmail(email) {
    if (!email || !email.includes("@")) return email;
    
    const [usuario, dominio] = email.split("@");
    
    // Si el nombre es muy corto, mostramos menos caracteres
    if (usuario.length <= 2) {
        return usuario.charAt(0) + "***@" + dominio;
    }
    
    // Mostramos la primera y última letra del nombre, y el resto con asteriscos
    const primeraLetra = usuario.charAt(0);
    const ultimaLetra = usuario.charAt(usuario.length - 1);
    const asteriscos = "*".repeat(usuario.length - 2);
    
    return `${primeraLetra}${asteriscos}${ultimaLetra}@${dominio}`;
}
