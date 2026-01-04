import axios from "axios";
import { db, auth } from "../firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    where,
    limit as limitQuery
} from "firebase/firestore";

const logsCollectionRef = collection(db, "logs");
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/logs`;

// Helper: Parsear fecha de manera segura
const parseDate = (dateVal) => {
    if (!dateVal) return new Date().toISOString();
    if (dateVal.toDate && typeof dateVal.toDate === 'function') {
        return dateVal.toDate().toISOString(); // Firestore Timestamp
    }
    if (typeof dateVal === 'string') {
        return dateVal; // Ya es ISO string
    }
    return new Date().toISOString(); // Fallback
};

// 1. Obtener Logs de Firestore
const getFirestoreLogs = async (limit, moduleFilter) => {
    try {
        let q = query(logsCollectionRef, orderBy("createdAt", "desc"), limitQuery(limit));
        
        // Intentamos filtrar por módulo si se provee
        if (moduleFilter) {
            // Nota: Si falta índice, esto fallará. En ese caso, capturamos error y devolvemos sin filtrar (o array vacío)
            // Para "Old Data Retrieval", a veces es mejor ser permisivo.
            // Pero mantendremos el intento de filtrado para logs nuevos.
             q = query(logsCollectionRef, where("module", "==", moduleFilter), limitQuery(limit));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: parseDate(doc.data().createdAt),
            source: 'firestore'
        }));
    } catch (error) {
        console.warn("⚠️ Firestore query warning (posible falta de índice o campo module):", error);
        // Fallback: intentar traer últimos sin filtro y filtrar en memoria
        try {
            const fallbackQ = query(logsCollectionRef, orderBy("createdAt", "desc"), limitQuery(limit));
            const snap = await getDocs(fallbackQ);
            const rawLogs = snap.docs.map(doc => ({
                 id: doc.id, 
                 ...doc.data(), 
                 createdAt: parseDate(doc.data().createdAt),
                 source: 'firestore'
            }));
            
            if (moduleFilter) {
                return rawLogs.filter(l => !l.module || l.module === moduleFilter);
            }
            return rawLogs;
        } catch (e) {
            console.error("Error crítico leyendo Firestore:", e);
            return [];
        }
    }
};

// 2. Obtener Logs de Legacy API (Axios)
const getApiLogs = async (token, limit) => {
    if (!token) return [];
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        // Asumimos que la API antigua soporta ?limit=
        const response = await axios.get(`${API_URL}?limit=${limit}`, config);
        
        if (Array.isArray(response.data)) {
            return response.data.map(l => ({
                ...l,
                createdAt: parseDate(l.createdAt), // Asegurar formato uniforme
                source: 'api'
            }));
        }
        return [];
    } catch (error) {
        console.warn("⚠️ Legacy API fetch failed (Backend podría no estar disponible):", error.message);
        return [];
    }
};

// --- SERVICIO PÚBLICO ---

// Crear Log (Solo Firestore - Nuevos datos)
const createLog = async (logData) => {
    try {
        const user = auth.currentUser;
        const finalLogData = {
            ...logData,
            userId: logData.userId || user?.uid,
            userName: logData.userName || user?.displayName || user?.email || "Usuario",
            createdAt: new Date(), 
            module: logData.module || 'SYSTEM' 
        };

        await addDoc(logsCollectionRef, finalLogData);
        // console.log("✅ Log guardado en Firestore:", finalLogData.action);
        return { success: true };
    } catch (error) {
        console.error("❌ Error al guardar log en Firestore:", error);
        return { success: false, error };
    }
};

// Obtener Logs (Combinado: Firestore + API)
const getLogs = async (token, limit = 50, moduleFilter = null) => {
    // Ejecutar ambas peticiones en paralelo para recuperar "todos los datos"
    const [firestoreLogs, apiLogs] = await Promise.all([
        getFirestoreLogs(limit, moduleFilter),
        getApiLogs(token, limit)
    ]);

    // Unificar
    let allLogs = [...firestoreLogs, ...apiLogs];

    // Ordenar descendente por fecha
    allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Si tenemos filtro y la API devolvió logs mezclados, filtramos de nuevo para asegurar consistencia
    if (moduleFilter) {
        allLogs = allLogs.filter(l => {
            // Lógica estricta de separación:
            // 1. Si estamos en INVENTORY: Aceptamos logs explícitos de 'INVENTORY' Y logs antiguos (sin modulo)
            if (moduleFilter === "INVENTORY") {
                return l.module === "INVENTORY" || !l.module;
            }
            
            // 2. Si estamos en PRODUCTION (u otro): SOLO aceptamos logs que sean explícitamente de ese módulo.
            // Esto elimina el ruido de los logs antiguos en vistas nuevas.
            return l.module === moduleFilter;
        });
    }

    // Devolver solo los 'limit' más recientes
    return allLogs.slice(0, limit);
};

const logService = {
    getLogs,
    createLog,
};

export default logService;