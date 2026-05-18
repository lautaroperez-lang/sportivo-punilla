// script.js

// =============================
// FECHA DEL VIAJE
// =============================

const tripDate = new Date("Jan 10, 2026 00:00:00").getTime();


// =============================
// MODAL LAUTARO
// =============================

function openModal() {

  document.getElementById("lautaroModal").style.display = "flex";

}

function closeModal() {

  document.getElementById("lautaroModal").style.display = "none";

}


// CERRAR MODAL SI HACEN CLICK AFUERA

window.onclick = function(event) {

  const modal = document.getElementById("lautaroModal");

  if (event.target == modal) {

    modal.style.display = "none";

  }

};


// =============================
// CONTADOR REGRESIVO
// =============================

const countdown = setInterval(() => {

  const now = new Date().getTime();

  const distance = tripDate - now;


  // SI EL CONTADOR TERMINA

  if (distance < 0) {

    clearInterval(countdown);

    document.getElementById("days").innerHTML = "00";
    document.getElementById("hours").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";

    return;

  }


  // CALCULOS

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24))
    /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60))
    /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60))
    /
    1000
  );


  // INSERTAR EN HTML

  document.getElementById("days").innerHTML = days;

  document.getElementById("hours").innerHTML = hours;

  document.getElementById("minutes").innerHTML = minutes;

  document.getElementById("seconds").innerHTML = seconds;

}, 1000);