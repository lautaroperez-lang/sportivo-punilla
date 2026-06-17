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
  if (pass === "MALSP2026") { // <-- AQUÍ CAMBIAS TU CONTRASEÑA
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');
    cargarPostulacionesPendientes();
  } else {
    alert("❌ Contraseña incorrecta");
  }
}

// Traer datos de Firebase
async function cargarPostulacionesPendientes() {
  const listaJugadores = document.getElementById('lista-jugadores-pendientes');
  const listaProfesores = document.getElementById('lista-profesores-pendientes');
  
  listaJugadores.innerHTML = "";
  listaProfesores.innerHTML = "";

  try {
    // Consulta: Traer solo los que estén en estado 'pendiente'
    const q = query(collection(db, "postulaciones"), where("estado", "==", "pendiente"));
    const querySnapshot = await getDocs(q);

    let countJugadores = 0;
    let countProfesores = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const itemHtml = `
        <div class="pendiente-item" id="card-${id}" style="flex-direction: column; align-items: flex-start; gap: 10px;">
          <div class="pendiente-info">
            <h4><strong>${data.nombre}</strong> (${data.tipo === 'jugador' ? 'Cat: ' + data.categoria : 'Edad: ' + data.edad})</h4>
            <p>📍 Ciudad: ${data.ciudad} | 📞 Tel: ${data.telefono}</p>
            ${data.tipo === 'jugador' ? 
              `<p>⚽ Posición: ${data.posicion} | Club: ${data.clubActual}</p>` : 
              `<p>📋 Exp: ${data.experiencia || 'No especificada'} | Cursos: ${data.cursos || 'No'}</p>`
            }
          </div>
          <div class="panel-actions">
            <button class="btn-action btn-approve" onclick="procesarSolicitud('${id}', 'aprobado')">✓ Aprobar</button>
            <button class="btn-action btn-reject" onclick="procesarSolicitud('${id}', 'rechazado')">✕ Rechazar</button>
          </div>
        </div>
      `;

      if (data.tipo === 'jugador') {
        listaJugadores.innerHTML += itemHtml;
        countJugadores++;
      } else {
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

// Función para actualizar el estado en Firebase
async function procesarSolicitud(id, nuevoEstado) {
  try {
    const docRef = doc(db, "postulaciones", id);
    
    if (nuevoEstado === 'aprobado') {
      // Actualizamos el estado a aprobado
      await updateDoc(docRef, { estado: 'aprobado' });
      alert("👍 Postulación aprobada con éxito. Ya es visible públicamente.");
    } else {
      // Si se rechaza, lo eliminamos de la base de datos (o podrías hacer updateDoc a 'rechazado')
      await deleteDoc(docRef);
      alert("🗑️ Postulación descartada.");
    }

    // Remover la tarjeta de la pantalla de forma visual rápida
    document.getElementById(`card-${id}`).remove();
  } catch (error) {
    console.error("Error al procesar:", error);
    alert("❌ Ocurrió un error");
  }
}

// Hacer las funciones accesibles desde el HTML
window.verificarPassword = verificarPassword;
window.procesarSolicitud = procesarSolicitud;