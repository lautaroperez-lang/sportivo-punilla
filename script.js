import { db } from './firebase.js';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ==========================================
// 🏆 CUENTAS REGRESIVAS TRIPLES (V2.0)
// ==========================================
function inicializarContadores() {
  const cardsCopas = document.querySelectorAll('.copa-card');

  cardsCopas.forEach(card => {
    const targetDateStr = card.getAttribute('data-date');
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = card.querySelector('.days');
    const hoursEl = card.querySelector('.hours');
    const minutesEl = card.querySelector('.minutes');
    const secondsEl = card.querySelector('.seconds');

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        daysEl.innerText = "00";
        hoursEl.innerText = "00";
        minutesEl.innerText = "00";
        secondsEl.innerText = "00";
        card.querySelector('.copa-fecha').innerText = "¡El torneo ya comenzó!";
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.innerText = d < 10 ? '0' + d : d;
      hoursEl.innerText = h < 10 ? '0' + h : h;
      minutesEl.innerText = m < 10 ? '0' + m : m;
      secondsEl.innerText = s < 10 ? '0' + s : s;
    }, 1000);
  });
}

// ==========================================
// ⚽ GESTIÓN DE FORMULARIOS INTERACTIVOS
// ==========================================
function mostrarFormulario(tipo) {
  document.getElementById('form-jugador').classList.add('hidden');
  document.getElementById('form-profesor').classList.add('hidden');

  if (tipo === 'jugador') {
    document.getElementById('form-jugador').classList.remove('hidden');
  } else if (tipo === 'profesor') {
    document.getElementById('form-profesor').classList.remove('hidden');
  }
}

// ==========================================
// 🔒 ENGINE DE ALMACENAMIENTO Y PANEL ADMIN
// ==========================================
async function registrarPostulante(event, tipo) {
  event.preventDefault();

  let nuevoRegistro = {
    tipo,
    estado: 'pendiente',
    fecha: new Date().toISOString()
  };

  if (tipo === 'jugador') {
    nuevoRegistro.nombre = document.getElementById('j-nombre').value;
    nuevoRegistro.nacimiento = document.getElementById('j-nacimiento').value;
    nuevoRegistro.categoria = document.getElementById('j-categoria').value;
    nuevoRegistro.dni = document.getElementById('j-dni').value;
    nuevoRegistro.ciudad = document.getElementById('j-ciudad').value;
    nuevoRegistro.telefono = document.getElementById('j-telefono').value;
    nuevoRegistro.clubActual = document.getElementById('j-club-actual').value;
    nuevoRegistro.clubesAnteriores = document.getElementById('j-club-previo').value;
    nuevoRegistro.posicion = document.getElementById('j-posicion').value;
    nuevoRegistro.pieHabil = document.getElementById('j-pie').value;
    nuevoRegistro.altura = document.getElementById('j-altura').value;
    nuevoRegistro.instagram = document.getElementById('j-instagram').value;
    nuevoRegistro.video = document.getElementById('j-video').value;
  } else {
    nuevoRegistro.nombre = document.getElementById('p-nombre').value;
    nuevoRegistro.edad = document.getElementById('p-edad').value;
    nuevoRegistro.ciudad = document.getElementById('p-ciudad').value;
    nuevoRegistro.telefono = document.getElementById('p-telefono').value;
    nuevoRegistro.correo = document.getElementById('p-correo').value;
    nuevoRegistro.clubActual = document.getElementById('p-club').value;
    nuevoRegistro.clubesAnteriores = document.getElementById('p-historial').value;
    nuevoRegistro.categoriasDirigidas = document.getElementById('p-categorias').value;
    nuevoRegistro.cursos = document.getElementById('p-cursos').value;
    nuevoRegistro.licencias = document.getElementById('p-licencias').value;
    nuevoRegistro.experiencia = document.getElementById('p-experiencia').value;
    nuevoRegistro.cv = document.getElementById('p-cv').value;
  }

  try {
    await addDoc(collection(db, "postulaciones"), nuevoRegistro);
    alert("✅ Postulación enviada correctamente");

    if (tipo === 'jugador') {
      document.getElementById('f-jugadores').reset();
    } else {
      document.getElementById('f-profesores').reset();
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error al enviar la postulación");
  }
}
// ==========================================
// 🌍 CARGAR PERFILES PÚBLICOS APROBADOS DESDE FIREBASE
// ==========================================
async function cargarPerfilesPublicos() {
  const contenedorJugadores = document.getElementById('contenedor-jugadores');
  const contenedorProfesores = document.getElementById('contenedor-profesores');

  if (!contenedorJugadores || !contenedorProfesores) return; // Por si no está en este HTML

  try {
    // Consulta: Traer solo los aprobados
    const q = query(collection(db, "postulaciones"), where("estado", "==", "aprobado"));
    const querySnapshot = await getDocs(q);

    let htmlJugadores = "";
    let htmlProfesores = "";

    querySnapshot.forEach((docSnap) => {
      const p = docSnap.data();
      
      // Si el usuario no mandó foto de perfil, le asignamos una silueta por defecto
      const fotoPorDefecto = "img/e2039e06-6f30-42f2-86fc-8fe83b220213 (1).JPG"; 

      if (p.tipo === 'jugador') {
        htmlJugadores += `
          <div class="p-card">
            <img src="${p.foto || fotoPorDefecto}" class="p-card-img" alt="${p.nombre}">
            <div class="p-card-body">
              <h4>${p.nombre}</h4>
              <p><strong>Categoría:</strong> ${p.categoria}</p>
              <p><strong>Posición:</strong> ${p.posicion}</p>
              <p><strong>Club Actual:</strong> ${p.clubActual}</p>
              <p><strong>Ciudad:</strong> ${p.ciudad}</p>
            </div>
          </div>
        `;
      } else if (p.tipo === 'profesor') {
        htmlProfesores += `
          <div class="p-card">
            <img src="${p.foto || fotoPorDefecto}" class="p-card-img" alt="${p.nombre}">
            <div class="p-card-body">
              <h4>${p.nombre}</h4>
              <p><strong>Cargo/Exp:</strong> ${p.experiencia || 'Cuerpo Técnico'}</p>
              <p><strong>Cursos:</strong> ${p.cursos || 'Ninguno especificado'}</p>
              <p><strong>Club Actual:</strong> ${p.clubActual}</p>
            </div>
          </div>
        `;
      }
    });

    // Si hay tarjetas generadas, reemplazamos el mensaje de "No hay aprobados"
    if (htmlJugadores !== "") contenedorJugadores.innerHTML = htmlJugadores;
    if (htmlProfesores !== "") contenedorProfesores.innerHTML = htmlProfesores;

  } catch (error) {
    console.error("Error cargando perfiles públicos: ", error);
  }
}
// ==========================================
// 🏛️ MODALES ORIGINALES DEL STAFF
// ==========================================
function openModall() { document.getElementById("lautaroModal").style.display = "flex"; }
function closeModall() { document.getElementById("lautaroModal").style.display = "none"; }

function openModalm() { document.getElementById("marcosModal").style.display = "flex"; }
function closeModalm() { document.getElementById("marcosModal").style.display = "none"; }

function openModala() { document.getElementById("arielModal").style.display = "flex"; }
function closeModala() { document.getElementById("arielModal").style.display = "none"; }

window.onclick = function(event) {
  const lautaroModal = document.getElementById("lautaroModal");
  const marcosModal = document.getElementById("marcosModal");
  const arielModal = document.getElementById("arielModal");

  if (event.target == lautaroModal) lautaroModal.style.display = "none";
  if (event.target == marcosModal) marcosModal.style.display = "none";
  if (event.target == arielModal) arielModal.style.display = "none";
};

// Al cargar el documento, arrancar lógica
document.addEventListener('DOMContentLoaded', () => {
  inicializarContadores();
  cargarPerfilesPublicos(); // <-- AGREGA ESTA LÍNEA AQUÍ
});

// Asignaciones globales para que funcionen los eventos 'onclick' desde el HTML Modules
window.mostrarFormulario = mostrarFormulario;
window.registrarPostulante = registrarPostulante;
window.openModall = openModall;
window.closeModall = closeModall;
window.openModalm = openModalm;
window.closeModalm = closeModalm;
window.openModala = openModala;
window.closeModala = closeModala;

console.log("SCRIPT CARGADO CORRECTAMENTE");