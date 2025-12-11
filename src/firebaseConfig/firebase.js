// Importar funciones de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwhF4-Kto5c2XOpaGRu-3OWfdiHTQ3m0w",
  authDomain: "soltima-c836a.firebaseapp.com",
  databaseURL: "https://soltima-c836a-default-rtdb.firebaseio.com",
  projectId: "soltima-c836a",
  storageBucket: "soltima-c836a.firebasestorage.app",
  messagingSenderId: "1025476438641",
  appId: "1:1025476438641:web:0bcf4adacde5a644b909d0",
  measurementId: "G-YBYZ193JH4",
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Exportar los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
