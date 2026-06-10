import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJscvqgEnKbLHgtx4BZIgca2KmjsZX3mo",
  authDomain: "sportivopunilla.firebaseapp.com",
  projectId: "sportivopunilla",
  storageBucket: "sportivopunilla.firebasestorage.app",
  messagingSenderId: "396830261235",
  appId: "1:396830261235:web:d9b2365b40cae960349c86",
  measurementId: "G-Z8KTQWXZ6M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };