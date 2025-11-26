import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase para Los Trigales
const firebaseConfig = {
    apiKey: "AIzaSyBO6JJH44Hk1G6qLgu10Y1mgjBipx790N4",
    authDomain: "inventario-insumos-trigales.firebaseapp.com",
    projectId: "inventario-insumos-trigales",
    storageBucket: "inventario-insumos-trigales.firebasestorage.app",
    messagingSenderId: "1015430835417",
    appId: "1:1015430835417:web:d64a09ebfb88ed7dc5e2c8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar Firestore (Base de datos)
export const db = getFirestore(app);

export default app;
