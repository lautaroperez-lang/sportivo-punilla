// =============================
// MODALES
// =============================

// LAUTARO

function openModall() {

  document.getElementById("lautaroModal").style.display = "flex";

}

function closeModall() {

  document.getElementById("lautaroModal").style.display = "none";

}


// MARCOS

function openModalm() {

  document.getElementById("marcosModal").style.display = "flex";

}

function closeModalm() {

  document.getElementById("marcosModal").style.display = "none";

}


// ARIEL

function openModala() {

  document.getElementById("arielModal").style.display = "flex";

}

function closeModala() {

  document.getElementById("arielModal").style.display = "none";

}


// =============================
// CERRAR AL HACER CLICK AFUERA
// =============================

window.onclick = function(event) {

  const lautaroModal = document.getElementById("lautaroModal");

  const marcosModal = document.getElementById("marcosModal");

  const arielModal = document.getElementById("arielModal");


  if (event.target == lautaroModal) {

    lautaroModal.style.display = "none";

  }

  if (event.target == marcosModal) {

    marcosModal.style.display = "none";

  }

  if (event.target == arielModal) {

    arielModal.style.display = "none";

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