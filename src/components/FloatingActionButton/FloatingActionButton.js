import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import { getFirestore, collection, query, onSnapshot, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import NewCostWizardModal from '../COSTOS/NewCostWizardModal';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`;
const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;
const ENTITIES_COLLECTION_PATH = `artifacts/${appId}/public/data/entities`;

const FloatingActionButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    
    // Estados para datos
    const [workers, setWorkers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [entities, setEntities] = useState([]);
    const [userId, setUserId] = useState(null);

    // Obtener usuario autenticado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // Auto-minimizar después de 3 segundos de inactividad
    useEffect(() => {
        const timer = setTimeout(() => {
            const timeSinceLastInteraction = Date.now() - lastInteraction;
            if (timeSinceLastInteraction >= 3000) {
                setIsExpanded(false);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [lastInteraction]);

    // El botón solo se expande al hacer hover directo sobre él
    // No hay listener global de mousemove

    // Cargar trabajadores
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, WORKERS_COLLECTION_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data().name || 'Sin nombre');
            setWorkers(data);
        });

        return () => unsubscribe();
    }, [userId]);

    // Cargar proyectos/locales
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

    // Cargar entidades (proveedores)
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, ENTITIES_COLLECTION_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEntities(data);
        });

        return () => unsubscribe();
    }, [userId]);

    // Control de visibilidad con scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Preparar listas para el modal
    const projectsForSelect = useMemo(() => {
        return ['General', ...projects.map(l => l.name)];
    }, [projects]);

    const entitiesForSelect = useMemo(() => {
        return entities.map(e => e.name || e);
    }, [entities]);

    const workersForSelect = useMemo(() => {
        return workers;
    }, [workers]);

    // Guardar coste
    const handleSaveCost = async (costData) => {
        try {
            const costsPath = `artifacts/${appId}/public/data/costs`;
            await addDoc(collection(db, costsPath), {
                ...costData,
                userId,
                createdAt: serverTimestamp(),
            });
            setErrorMessage("");
            return Promise.resolve();
        } catch (error) {
            console.error("Error al guardar coste:", error);
            setErrorMessage("Error al guardar el coste: " + error.message);
            return Promise.reject(error);
        }
    };

    const handleButtonClick = () => {
        setIsModalOpen(true);
        setLastInteraction(Date.now());
        setIsExpanded(true);
    };

    const handleMouseEnter = () => {
        setIsExpanded(true);
        setLastInteraction(Date.now());
    };

    return (
        <>
            {/* Botón Flotante Mejorado */}
            <button
                onClick={handleButtonClick}
                onMouseEnter={handleMouseEnter}
                className={`
                    group fixed bottom-6 right-6 z-50 
                    flex items-center justify-center
                    bg-gradient-to-r from-emerald-600 to-green-600
                    text-white font-bold 
                    rounded-full
                    shadow-2xl hover:shadow-emerald-500/50
                    transition-all duration-500 ease-in-out
                    transform hover:scale-110
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
                    ${isExpanded ? 'px-6 py-4 w-auto' : 'w-14 h-14 sm:w-16 sm:h-16'}
                `}
                style={{
                    backdropFilter: 'blur(10px)',
                }}
                title="Nuevo Registro"
            >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Contenido del botón */}
                <div className="relative flex items-center gap-2">
                    <FaPlus className={`
                        transition-all duration-300
                        ${isExpanded ? 'text-lg' : 'text-xl sm:text-2xl'}
                    `} />
                    
                    <span className={`
                        whitespace-nowrap overflow-hidden
                        transition-all duration-500 ease-in-out
                        text-sm sm:text-base
                        ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}
                    `}>
                        Nuevo registro
                    </span>
                </div>

                {/* Indicador de pulso */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </button>

            {/* Modal usando el componente de CostDashboard */}
            <NewCostWizardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCost}
                projects={projectsForSelect}
                entities={entitiesForSelect}
                workers={workersForSelect}
                setErrorMessage={setErrorMessage}
            />

            {/* Mensaje de error mejorado */}
            {errorMessage && (
                <div className="fixed bottom-24 right-6 z-50 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg shadow-2xl max-w-md animate-slide-in">
                    <div className="flex items-start">
                        <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">Error</p>
                            <p className="text-xs">{errorMessage}</p>
                        </div>
                        <button
                            onClick={() => setErrorMessage("")}
                            className="ml-4 text-red-600 hover:text-red-800 font-bold text-lg leading-none transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default FloatingActionButton;
