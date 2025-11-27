import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- 1. Importar getStorage

// Tu configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
  authDomain: "calend-e5f32.firebaseapp.com",
  projectId: "calend-e5f32",
  storageBucket: "calend-e5f32.firebasestorage.app",
  messagingSenderId: "960965784873",
  appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338"
};

export const YOUR_BACKEND_UPLOAD_URL = "http://localhost:4500/api/upload/image";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- 2. Inicializar y 3. Exportar Storage

// Opcional: para usar en un componente si lo necesitas
export default app;



// import { initializeApp, getApps, getApp } from "firebase/app"; // 👈 Añadidos: getApps y getApp
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Tu configuración de Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
//     authDomain: "calend-e5f32.firebaseapp.com",
//     projectId: "calend-e5f32",
//     storageBucket: "calend-e5f32.firebasestorage.app",
//     messagingSenderId: "960965784873",
//     appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338"
// };

// // 🌟 SOLUCIÓN: Implementación del patrón Singleton
// // Si ya hay alguna app inicializada (!getApps().length es false), usa getApp().
// // Si no hay ninguna app inicializada, llama a initializeApp().
// const app = !getApps().length 
//     ? initializeApp(firebaseConfig)
//     : getApp(); 

// // Exportar servicios que usarás
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Opcional: para usar en un componente si lo necesitas
// export default app;











