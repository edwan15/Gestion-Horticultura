import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Asegúrate de la ruta
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { useSelector } from 'react-redux';
import { selectUserId } from '../features/auth/authSlice/authSlice'; // Asegúrate de la ruta
import { Route, Routes } from 'react-router-dom';

// Importa los componentes
import ProduccionCalendar from './ProduccionCalendar'; 
import ProduccionDayDetails from './ProduccionDayDetails'; 
import DailyProductionReport from './DailyProductionReport';

function ProduccionPage() {
    const userId = useSelector(selectUserId);
    const [cosechaData, setCosechaData] = useState({}); // <--- Data para el calendario
    const [isLoading, setIsLoading] = useState(true);

    const fetchCosechaData = async () => {
        // ... (código de la función explicado arriba) ...
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const q = query(
                collection(db, "cosecha_diaria"),
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);

            const groupedData = {};
            querySnapshot.docs.forEach(doc => {
                const data = doc.data();
                const dateKey = data.date; 
                
                if (!groupedData[dateKey]) {
                    groupedData[dateKey] = [];
                }
                groupedData[dateKey].push({ ...data, id: doc.id });
            });
            
            setCosechaData(groupedData);
        } catch (error) {
            console.error("Error al cargar data de cosecha:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // ----------------------------------------------------
    // 🚨 DEFINICIÓN DE LA FUNCIÓN

    useEffect(() => {
        // Llama a la función al cargar el componente
        fetchCosechaData(); 
    }, [userId]);
    
    // ... (Manejo de estado isLoading) ...
    if (isLoading) {
        return <div className="p-10 text-center text-xl font-semibold text-amber-700">Cargando datos de Producción...</div>;
    }

    // 🚨 USO DE LA FUNCIÓN Y LOS DATOS EN LAS RUTAS 🚨
    return (
        <div className="produccion-wrapper">
            <Routes>
                {/* 1. Calendario: dailyData={cosechaData} */}
                <Route 
                    path="/" 
                    element={<ProduccionCalendar dailyData={cosechaData} />} 
                />
                
                {/* 2. Detalle: refetchCalendar={fetchCosechaData} */}
                <Route 
                    path="/produccion-day/:date" 
                    element={<DailyProductionReport refetchCalendar={fetchCosechaData} />} 
                />
            </Routes>
        </div>
    );
}

export default ProduccionPage;