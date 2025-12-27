import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import TimeSheetWizard from '../../components/COSTOS/TimeSheetWizard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();
const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;
const CROPS_COLLECTION_PATH = `artifacts/${appId}/public/data/crops`;

const TimeRegistrationPage = () => {
    const userId = useSelector(selectUserId);
    const navigate = useNavigate();
    
    const [projects, setProjects] = useState([]);
    const [crops, setCrops] = useState([]);
    const [availableLocals, setAvailableLocals] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    // Manejar errores
    useEffect(() => {
        if (errorMessage) {
            if (errorMessage.type === 'success') {
                toast.success(typeof errorMessage === 'object' ? errorMessage.message : errorMessage);
            } else {
                toast.error(typeof errorMessage === 'object' ? errorMessage.message : errorMessage);
            }
            // Limpiar error después de mostrar toast para evitar bucle si el componente lo usa
            // Pero TimeSheetWizard usa setErrorMessage directamente, así que lo dejamos para mostrar toast y ya.
            setErrorMessage("");
        }
    }, [errorMessage]);

    // Cargar proyectos
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, PROJECTS_COLLECTION_PATH),
            where("createdBy", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(data);
        });

        return () => unsubscribe();
    }, [userId]);

    // Cargar cultivos
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, CROPS_COLLECTION_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCrops(data);
        });

        return () => unsubscribe();
    }, [userId]);

    // Combinar proyectos y cultivos
    useEffect(() => {
        const combined = [
            ...projects.map(p => ({ 
                ...p, 
                type: p.cropType || 'Proyecto General' 
            })),
            ...crops.map(c => ({ 
                id: c.id, 
                name: c.name, 
                type: 'Cultivo', 
                area: c.plantedArea, 
                cropName: c.name,
                ...c 
            }))
        ];
        setAvailableLocals(combined);
    }, [projects, crops]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden h-screen"> {/* h-screen and overflow-hidden to prevent body scroll */}
            {/* Header Compacto */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm flex items-center justify-between shrink-0 h-14 z-30">
                <div className="flex items-center gap-3">
                     <button 
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        title="Volver"
                    >
                        <FaArrowLeft className="text-lg" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">⏱️</span> Registro
                    </h1>
                </div>
            </div>

            {/* Contenido centrado y expandido */}
            <div className="flex-1 p-2 md:p-4 flex justify-center overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 overflow-hidden flex flex-col relative">
                         {/* Pasamos key userId para reiniciar si cambia el usuario */}
                        <TimeSheetWizard
                            key={userId} 
                            db={db}
                            userId={userId}
                            setErrorMessage={setErrorMessage}
                            availableLocals={availableLocals}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeRegistrationPage;
