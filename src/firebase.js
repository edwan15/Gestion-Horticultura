// src/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getFirestore, doc } from "firebase/firestore";

// --- Configuración Global de la Aplicación ---
const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};
const appId = getAppId();

const firebaseConfig = {
    apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
    authDomain: "calend-e5f32.firebaseapp.com",
    projectId: "calend-e5f32",
    storageBucket: "calend-e5f32.firebasestorage.app",
    messagingSenderId: "960965784873",
    appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338"
};

// 🌟 SOLUCIÓN SINGLETON: Inicializa la aplicación de forma segura
const app = !getApps().length 
    ? initializeApp(firebaseConfig)
    : getApp(); 

// Exportar servicios y la función de referencia del documento
export const auth = getAuth(app); 
export const db = getFirestore(app); 

/**
 * Genera la referencia del documento de Firestore específica para un usuario.
 * Path: artifacts/{appId}/users/{userId}/daily_data/data
 */
export const getDailyDataDocRef = (userId) => {
    return doc(db, `artifacts/${appId}/users/${userId}/daily_data/data`);
};

export default app;