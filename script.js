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
// 🔒 ENGINE DE ALMACENAMIENTO Y PANEL ADMIN (LOCALSTORAGE)
// ==========================================
// let postulaciones = JSON.parse(localStorage.getItem('punilla_postulaciones')) || [];

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

function procesarYGuardar(fileInput, objeto, formId) {
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      objeto.foto = e.target.result; // Imagen en formato Base64 para guardarla en LocalStorage
      postulaciones.push(objeto);
      localStorage.setItem('punilla_postulaciones', JSON.stringify(postulaciones));
      alert('¡Postulación enviada con éxito! Queda sujeta a revisión en el panel de aprobación.');
      document.getElementById(formId).reset();
      actualizarPantallas();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    objeto.foto = 'img/default-profile.png';
    postulaciones.push(objeto);
    localStorage.setItem('punilla_postulaciones', JSON.stringify(postulaciones));
    alert('Postulación enviada sin foto personalizada.');
    document.getElementById(formId).reset();
    actualizarPantallas();
  }
}

function cambiarEstado(id, nuevoEstado) {
  postulaciones = postulaciones.map(post => {
    if (post.id === id) post.estado = nuevoEstado;
    return post;
  });
  localStorage.setItem('punilla_postulaciones', JSON.stringify(postulaciones));
  actualizarPantallas();
}

function actualizarPantallas() {
  const listaPendientes = document.getElementById('lista-pendientes');
  const contenedorJugadores = document.getElementById('contenedor-jugadores');
  const contenedorProfesores = document.getElementById('contenedor-profesores');

  // Limpiar contenedores
  listaPendientes.innerHTML = '';
  contenedorJugadores.innerHTML = '';
  contenedorProfesores.innerHTML = '';

  let pendientesFiltrados = postulaciones.filter(p => p.estado === 'pendiente');
  let aprobadosFiltrados = postulaciones.filter(p => p.estado === 'aprobado');

  // Renderizar Pendientes
  if (pendientesFiltrados.length === 0) {
    listaPendientes.innerHTML = `<p style="color:#bdbdbd; text-align: center; padding: 20px;">No hay postulaciones pendientes de revisión en este momento.</p>`;
  } else {
    pendientesFiltrados.forEach(p => {
      const div = document.createElement('div');
      div.className = 'pendiente-item';
      div.innerHTML = `
        <div class="pendiente-info">
          <h4>${p.nombre} <span>(${p.tipo === 'jugador' ? 'Jugador ' + p.categoria : 'Profesor'})</span></h4>
          <p>Ciudad: ${p.ciudad} | Tel: ${p.telefono}</p>
        </div>
        <div class="panel-actions">
          <button class="btn-action btn-approve" onclick="cambiarEstado(${p.id}, 'aprobado')">Aprobar ✅</button>
          <button class="btn-action btn-reject" onclick="cambiarEstado(${p.id}, 'rechazado')">Rechazar ❌</button>
        </div>
      `;
      listaPendientes.appendChild(div);
    });
  }

  // Renderizar Públicos Aprobados
  const jugadoresAprobados = aprobadosFiltrados.filter(p => p.tipo === 'jugador');
  const profesoresAprobados = aprobadosFiltrados.filter(p => p.tipo === 'profesor');

  if (jugadoresAprobados.length === 0) {
    contenedorJugadores.innerHTML = `<p class="empty-msg">No hay jugadores aprobados cargados públicamente.</p>`;
  } else {
    jugadoresAprobados.forEach(j => {
      const card = document.createElement('div');
      card.className = 'p-card';
      card.innerHTML = `
        <img src="${j.foto}" class="p-card-img" alt="${j.nombre}">
        <div class="p-card-body">
          <h4>${j.nombre}</h4>
          <p><strong>Categoría:</strong> ${j.categoria}</p>
          <p><strong>Club Actual:</strong> ${j.clubActual}</p>
          <p><strong>Posición:</strong> ${j.posicion}</p>
        </div>
      `;
      contenedorJugadores.appendChild(card);
    });
  }

  if (profesoresAprobados.length === 0) {
    contenedorProfesores.innerHTML = `<p class="empty-msg">No hay profesionales aprobados cargados públicamente.</p>`;
  } else {
    profesoresAprobados.forEach(p => {
      const card = document.createElement('div');
      card.className = 'p-card';
      card.innerHTML = `
        <img src="${p.foto}" class="p-card-img" alt="${p.nombre}">
        <div class="p-card-body">
          <h4>${p.nombre}</h4>
          <p><strong>Experiencia:</strong> ${p.experiencia || 'No especificada'}</p>
          <p><strong>Cursos:</strong> ${p.cursos || 'Ninguno'}</p>
          <p><strong>Clubes previos:</strong> ${p.clubesAnteriores || 'Ninguno'}</p>
        </div>
      `;
      contenedorProfesores.appendChild(card);
    });
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
  actualizarPantallas();
});