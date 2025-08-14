import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlBqJmi7n0NUeElLEBk6-T7CUNmY5LGGo",
    authDomain: "e-gram-ecbf2.firebaseapp.com",
    projectId: "e-gram-ecbf2",
    storageBucket: "e-gram-ecbf2.firebasestorage.app",
    messagingSenderId: "690210783350",
    appId: "1:690210783350:web:1f71efde7f424b5ed89f57",
    measurementId: "G-T57GX1340Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };