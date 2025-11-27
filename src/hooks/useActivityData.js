import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
// 👑 Importar el contexto para obtener el targetUserId
import { useAppContext } from './SuperUser/AppContext'; 

const db = getFirestore(); // Asume que db está inicializado

/**
 * Hook para cargar los datos de actividad basados en el usuario objetivo.
 * @returns {object} { dailyData, loading, error }
 */
const useActivityData = () => {
    // 1. Obtener el ID del usuario que estamos viendo
    const { targetUserId } = useAppContext(); 
    
    const [dailyData, setDailyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para simular la carga de datos de la colección 'riego'
    const fetchDailyData = useCallback(async () => {
        if (!targetUserId) {
            setDailyData({});
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // 🎯 CONSULTA CLAVE: Filtrar los documentos por el ID del usuario objetivo
            const q = query(
                collection(db, "riego"), 
                where("userId", "==", targetUserId) 
            );

            const querySnapshot = await getDocs(q);
            const dataMap = {};
            
            querySnapshot.docs.forEach(doc => {
                const data = doc.data();
                const dateKey = data.DATE_KEY_FIELD; // ⚠️ Reemplaza 'DATE_KEY_FIELD' con el nombre de tu campo de fecha
                
                // Agrupar los registros por día
                if (dateKey) {
                    if (!dataMap[dateKey]) {
                        dataMap[dateKey] = [];
                    }
                    dataMap[dateKey].push(data);
                }
            });
            
            setDailyData(dataMap);
        } catch (err) {
            console.error("Error al cargar datos de riego:", err);
            setError("No se pudieron cargar los datos de riego.");
            setDailyData({});
        } finally {
            setLoading(false);
        }
    }, [targetUserId]); // 2. La dependencia es targetUserId

    useEffect(() => {
        fetchDailyData();
    }, [fetchDailyData]);

    return { dailyData, loading, error };
};

export default useActivityData;