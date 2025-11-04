import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// Función auxiliar para obtener el App ID
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();


const EntityAndProjectManager = ({ db, userId, setErrorMessage, errorMessage }) => {
    const [entities, setEntities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [newEntityName, setNewEntityName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- Hooks de Lectura de Firestore ---
    useEffect(() => {
        if (!db || !userId) {
            setIsLoading(false);
            return;
        }

        const entityPath = `artifacts/${appId}/public/data/entities`;
        const projectPath = `artifacts/${appId}/public/data/projects`;

        // 1. Suscripción a Entidades (Empresas)
        const unsubscribeEntities = onSnapshot(query(collection(db, entityPath)), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEntities(list);
            setIsLoading(false);
        }, (error) => {
            console.error("Error loading entities:", error);
            setErrorMessage("Error al cargar entidades: " + error.message);
            setIsLoading(false);
        });

        // 2. Suscripción a Proyectos (Invernaderos)
        const unsubscribeProjects = onSnapshot(query(collection(db, projectPath)), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(list);
            setIsLoading(false);
        }, (error) => {
            console.error("Error loading projects:", error);
            setErrorMessage("Error al cargar proyectos: " + error.message);
            setIsLoading(false);
        });
        
        return () => {
            unsubscribeEntities();
            unsubscribeProjects();
        };
    }, [db, userId, setErrorMessage]); // Las dependencias son correctas

    // --- Función de Creación Genérica ---
    // const createNewItem = useCallback(async (type, name) => {
    //     setErrorMessage(null);

    //     if (!name.trim()) {
    //         setErrorMessage(`El nombre del ${type} no puede estar vacío.`);
    //         return;
    //     }
        
    //     const path = `artifacts/${appId}/public/data/${type}s`; // projects o entities

    //     try {
    //         await addDoc(collection(db, path), {
    //             name: name.trim(),
    //             userId: userId,
    //             createdAt: serverTimestamp(),
    //         });

    //         // Limpiar el input basado en el tipo
    //         if (type === 'entity') {
    //             setNewEntityName('');
    //         } else {
    //             setNewProjectName('');
    //         }

    //     } catch (error) {
    //         console.error(`Error adding ${type}: `, error);
    //         setErrorMessage(`Error al crear ${type}: ` + error.message);
    //     }
    // }, [db, userId, setErrorMessage]);


    const createNewItem = useCallback(async (type, name) => {
    // ... validación

    // 🔴 CORRECCIÓN: Definir el nombre de la colección correctamente
    let path;
    if (type === 'entity') {
        path = `artifacts/${appId}/public/data/entities`; // <--- USAMOS EL PLURAL CORRECTO
    } else if (type === 'project') {
        path = `artifacts/${appId}/public/data/projects`;
    } else {
        setErrorMessage("Tipo de creación desconocido.");
        return;
    }
    
    try {
        await addDoc(collection(db, path), {
            name: name.trim(),
            userId: userId,
            createdAt: serverTimestamp(),
        });
        
        // ... (limpieza de inputs)
        
    } catch (error) {
        // ...
    }
}, [db, userId, setErrorMessage]);


    // --- Handlers específicos para el formulario ---
    const handleCreateEntity = (e) => {
        e.preventDefault();
        createNewItem('entity', newEntityName);
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        createNewItem('project', newProjectName);
    };


    // --- UI DE RENDERIZADO ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
                <p className="text-gray-500 text-lg">Cargando gestión de metadatos...</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-purple-600 pb-2">
                ⚙️ Gestión de Entidades y Proyectos
            </h1>

            {/* Mensaje de Error (Usando el prop que viene de HomeContent) */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* === Panel de Gestión de Entidades (Empresas) === */}
                <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        🏢 Entidades (Empresas)
                    </h2>
                    
                    <form onSubmit={handleCreateEntity} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Nombre de la nueva empresa..."
                            value={newEntityName}
                            onChange={(e) => setNewEntityName(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                        >
                            Crear
                        </button>
                    </form>

                    <h3 className="text-lg font-medium text-gray-600 mb-3">Lista de Entidades Creadas ({entities.length}):</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {entities.map(entity => (
                            <li key={entity.id} className="p-3 bg-purple-50 rounded-md border border-purple-200 flex justify-between items-center">
                                <span className="text-gray-800 font-medium">{entity.name}</span>
                                {/* Aquí puedes añadir un botón de editar/eliminar si lo deseas */}
                            </li>
                        ))}
                    </ul>
                </section>

                
                {/* === Panel de Gestión de Proyectos (Invernaderos Definibles) === */}
                <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        🌱 Proyectos (Invernaderos/Cultivos Personalizados)
                    </h2>
                    
                    <form onSubmit={handleCreateProject} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Ej: Invernadero 3, Cultivo de Lechuga"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Crear
                        </button>
                    </form>

                    <h3 className="text-lg font-medium text-gray-600 mb-3">Lista de Proyectos Creados ({projects.length}):</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {projects.map(project => (
                            <li key={project.id} className="p-3 bg-green-50 rounded-md border border-green-200 flex justify-between items-center">
                                <span className="text-gray-800 font-medium">{project.name}</span>
                                {/* Aquí puedes añadir un botón de editar/eliminar si lo deseas */}
                            </li>
                        ))}
                    </ul>
                </section>

            </div>
        </div>
    );
};

export default EntityAndProjectManager;