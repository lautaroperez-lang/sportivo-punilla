import { db } from './firebase.js';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Función de login ultra simple
function verificarPassword() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === "MALSP2026") { 
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');
    cargarPostulacionesPendientes();
    cargarIntegrantesActivos(); // <--- Nueva función
  } else {
    alert("❌ Contraseña incorrecta");
  }
}

// 1. CARGAR PENDIENTES (CON TODOS LOS DATOS VISIBLES)
async function cargarPostulacionesPendientes() {
  const listaJugadores = document.getElementById('lista-jugadores-pendientes');
  const listaProfesores = document.getElementById('lista-profesores-pendientes');
  
  listaJugadores.innerHTML = "";
  listaProfesores.innerHTML = "";

  try {
    const q = query(collection(db, "postulaciones"), where("estado", "==", "pendiente"));
    const querySnapshot = await getDocs(q);

    let countJugadores = 0;
    let countProfesores = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      let itemHtml = "";

      if (data.tipo === 'jugador') {
        // Renderizado con TODOS los campos del formulario para el Admin
        itemHtml = `
          <div class="pendiente-item" id="card-${id}" style="border-left: 5px solid #ff7a00; padding: 15px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <h4>📋 Ficha de Jugador: <strong>${data.nombre}</strong></h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; font-size: 0.9rem; color: #ccc;">
              <p>🎂 <strong>Categoría:</strong> ${data.categoria || 'No especifica'}</p>
              <p>📍 <strong>Ciudad:</strong> ${data.ciudad || 'No especifica'}</p>
              <p>📞 <strong>Teléfono:</strong> ${data.telefono || 'No especifica'}</p>
              <p>⚽ <strong>Posición:</strong> ${data.posicion || 'No especifica'}</p>
              <p>👟 <strong>Pie Hábil:</strong> ${data.pieHabil || 'No especifica'}</p>
              <p>📏 <strong>Altura:</strong> ${data.altura ? data.altura + ' cm' : 'No especifica'}</p>
              <p>🏢 <strong>Club Actual:</strong> ${data.clubActual || 'No especifica'}</p>
              <p>📸 <strong>Instagram:</strong> <a href="https://instagram.com/${data.instagram}" target="_blank" style="color: #ff7a00;">@${data.instagram || 'No tiene'}</a></p>
            </div>
            ${data.videoDestacado ? `<p style="font-size: 0.9rem;">🎥 <strong>Video:</strong> <a href="${data.videoDestacado}" target="_blank" style="color: #00a8ff;">Ver Link Adjunto</a></p>` : ''}
            <div class="panel-actions" style="margin-top: 15px;">
              <button class="btn" style="background: #2ecc71; margin-right: 10px;" onclick="procesarSolicitud('${id}', 'aprobado')">✓ Aprobar</button>
              <button class="btn" style="background: #e74c3c;" onclick="procesarSolicitud('${id}', 'rechazado')">✕ Rechazar</button>
            </div>
          </div>
        `;
        listaJugadores.innerHTML += itemHtml;
        countJugadores++;
      } else {
        // Todos los campos de los Profesores
        itemHtml = `
          <div class="pendiente-item" id="card-${id}" style="border-left: 5px solid #00a8ff; padding: 15px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <h4>📋 Ficha de Profesor/DT: <strong>${data.nombre}</strong></h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; font-size: 0.9rem; color: #ccc;">
              <p>📞 <strong>Teléfono:</strong> ${data.telefono || 'No especifica'}</p>
              <p>📍 <strong>Ciudad:</strong> ${data.ciudad || 'No especifica'}</p>
              <p>🏢 <strong>Club Actual:</strong> ${data.clubActual || 'No especifica'}</p>
              <p>👨‍🏫 <strong>Experiencia:</strong> ${data.experiencia || 'No especificada'}</p>
              <p>📜 <strong>Cursos/Títulos:</strong> ${data.cursos || 'No especificados'}</p>
            </div>
            <div class="panel-actions" style="margin-top: 15px;">
              <button class="btn" style="background: #2ecc71; margin-right: 10px;" onclick="procesarSolicitud('${id}', 'aprobado')">✓ Aprobar</button>
              <button class="btn" style="background: #e74c3c;" onclick="procesarSolicitud('${id}', 'rechazado')">✕ Rechazar</button>
            </div>
          </div>
        `;
        listaProfesores.innerHTML += itemHtml;
        countProfesores++;
      }
    });

    if (countJugadores === 0) listaJugadores.innerHTML = '<p class="empty-msg">No hay jugadores pendientes.</p>';
    if (countProfesores === 0) listaProfesores.innerHTML = '<p class="empty-msg">No hay profesores pendientes.</p>';

  } catch (error) {
    console.error("Error cargando pendientes: ", error);
  }
}

// 2. NUEVA FUNCIÓN: CARGAR INTEGRANTES YA PUBLICADOS
async function cargarIntegrantesActivos() {
  const listaActivos = document.getElementById('lista-integrantes-activos');
  if (!listaActivos) return;

  listaActivos.innerHTML = "";

  try {
    const q = query(collection(db, "postulaciones"), where("estado", "==", "aprobado"));
    const querySnapshot = await getDocs(q);

    let countActivos = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const itemHtml = `
        <div class="activo-item" id="card-${id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">
          <div>
            <span style="font-weight: bold; color: #fff;">${data.nombre}</span> 
            <span style="font-size: 0.85rem; padding: 2px 6px; background: #ff7a00; border-radius: 4px; margin-left: 10px; text-transform: uppercase;">${data.tipo}</span>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #aaa;">${data.tipo === 'jugador' ? 'Posición: ' + data.posicion + ' | Cat: ' + data.categoria : 'Club: ' + data.clubActual}</p>
          </div>
          <button class="btn" style="background: #c0392b; padding: 6px 12px; font-size: 0.85rem;" onclick="eliminarIntegrante('${id}')">🗑️ Eliminar de la Web</button>
        </div>
      `;
      listaActivos.innerHTML += itemHtml;
      countActivos++;
    });

    if (countActivos === 0) {
      listaActivos.innerHTML = '<p class="empty-msg">No hay ningún integrante público todavía.</p>';
    }

  } catch (error) {
    console.error("Error cargando activos: ", error);
  }
}

// Procesar aprobaciones/rechazos
async function procesarSolicitud(id, nuevoEstado) {
  try {
    const docRef = doc(db, "postulaciones", id);
    if (nuevoEstado === 'aprobado') {
      await updateDoc(docRef, { estado: 'aprobado' });
      alert("👍 Aprobado con éxito. Ya figura en la web.");
    } else {
      await deleteDoc(docRef);
      alert("🗑️ Postulación rechazada y eliminada.");
    }
    // Recargar ambas listas para actualizar cambios
    cargarPostulacionesPendientes();
    cargarIntegrantesActivos();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Eliminar un integrante que ya era público
async function eliminarIntegrante(id) {
  if (confirm("⚠️ ¿Estás seguro de que deseas eliminar a este integrante del panel público? Se borrará por completo.")) {
    try {
      await deleteDoc(doc(db, "postulaciones", id));
      alert("🗑️ Registro eliminado correctamente.");
      // Actualizar la interfaz
      document.getElementById(`card-${id}`).remove();
    } catch (error) {
      console.error("Error al eliminar integrante: ", error);
    }
  }
}

// Exponer funciones globales para los botones onclick
window.verificarPassword = verificarPassword;
window.procesarSolicitud = procesarSolicitud;
window.eliminarIntegrante = eliminarIntegrante;