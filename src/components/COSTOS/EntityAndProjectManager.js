import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaBuilding, FaSeedling, FaPlus, FaChartLine, FaTrash } from 'react-icons/fa';

// Función auxiliar para obtener el App ID
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();

// Componente DashboardCard reutilizable
const DashboardCard = ({ 
    title, 
    icon, 
    titleColor = 'text-gray-800', 
    className = '', 
    children,
    badge = null 
}) => (
    <div className={`
        bg-white 
        rounded-lg 
        shadow-sm 
        border border-gray-200
        hover:shadow-md 
        transition-all 
        duration-300 
        overflow-hidden
        ${className}
    `}>
        {/* Header con diseño profesional */}
        <div className={`
            flex items-center justify-between 
            px-5 py-4 
            border-b border-gray-100
            bg-gradient-to-r from-gray-50 to-white
        `}>
            <div className="flex items-center space-x-3">
                {icon && (
                    <div className={`
                        w-10 h-10 
                        rounded-lg 
                        bg-gradient-to-br from-gray-100 to-gray-50
                        flex items-center justify-center
                        text-xl
                        ${titleColor}
                    `}>
                        {icon}
                    </div>
                )}
                <h3 className={`text-base font-semibold ${titleColor}`}>
                    {title}
                </h3>
            </div>
            {badge && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {badge}
                </span>
            )}
        </div>
        
        {/* Contenido */}
        <div className="p-5">
            {children}
        </div>
    </div>
);

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
    }, [db, userId, setErrorMessage]);

    // --- Función de Creación Genérica ---
    const createNewItem = useCallback(async (type, name) => {
        let path;
        if (type === 'entity') {
            path = `artifacts/${appId}/public/data/entities`;
        } else if (type === 'project') {
            path = `artifacts/${appId}/public/data/projects`;
        } else {
            setErrorMessage("Tipo de creación desconocido.");
            return;
        }

        if (!name.trim()) {
            setErrorMessage(`El nombre del ${type === 'entity' ? 'entidad' : 'proyecto'} no puede estar vacío.`);
            return;
        }
        
        try {
            await addDoc(collection(db, path), {
                name: name.trim(),
                userId: userId,
                createdAt: serverTimestamp(),
            });
            
            // Limpiar el input basado en el tipo
            if (type === 'entity') {
                setNewEntityName('');
            } else {
                setNewProjectName('');
            }
            
        } catch (error) {
            console.error(`Error adding ${type}: `, error);
            setErrorMessage(`Error al crear ${type === 'entity' ? 'entidad' : 'proyecto'}: ` + error.message);
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

    // --- Función de Eliminación ---
    const handleDeleteItem = async (id, type, name) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente ${type === 'entity' ? 'la entidad' : 'el proyecto'} "${name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        let path;
        if (type === 'entity') {
            path = `artifacts/${appId}/public/data/entities`;
        } else if (type === 'project') {
            path = `artifacts/${appId}/public/data/projects`;
        }

        try {
            await deleteDoc(doc(db, path, id));
            // No necesitamos actualizar el estado manualmente porque onSnapshot lo hará
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            setErrorMessage(`Error al eliminar ${type === 'entity' ? 'entidad' : 'proyecto'}: ` + error.message);
        }
    };

    // --- UI DE RENDERIZADO ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">Cargando gestión de metadatos...</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Mensaje de Error */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{errorMessage}</span>
                </div>
            )}

            {/* Tarjetas de Resumen en Grid 2 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tarjeta de Resumen - Entidades */}
                <DashboardCard
                    title="Resumen de Entidades"
                    icon={<FaChartLine />}
                    titleColor="text-purple-700"
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Total Entidades</span>
                            <span className="text-2xl font-bold text-purple-600">{entities.length}</span>
                        </div>
                    </div>
                </DashboardCard>

                {/* Tarjeta de Resumen - Proyectos */}
                <DashboardCard
                    title="Resumen de Proyectos"
                    icon={<FaChartLine />}
                    titleColor="text-green-700"
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Total Proyectos</span>
                            <span className="text-2xl font-bold text-green-600">{projects.length}</span>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Grid Principal de 2 Columnas para Gestión */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* === Panel de Gestión de Entidades (Empresas) === */}
                <DashboardCard
                    title="Entidades (Empresas)"
                    icon={<FaBuilding />}
                    titleColor="text-purple-700"
                    badge={`${entities.length} registradas`}
                >
                    {/* Formulario de Creación */}
                    <form onSubmit={handleCreateEntity} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva Entidad
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nombre de la empresa..."
                                value={newEntityName}
                                onChange={(e) => setNewEntityName(e.target.value)}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-sm"
                            >
                                <FaPlus className="text-sm" />
                                <span>Crear</span>
                            </button>
                        </div>
                    </form>

                    {/* Lista de Entidades */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Entidades Registradas
                        </h4>
                        {entities.length === 0 ? (
                            <p className="text-sm text-gray-500 italic text-center py-4">
                                No hay entidades registradas
                            </p>
                        ) : (
                            <ul className="space-y-2 max-h-64 overflow-y-auto">
                                {entities.map(entity => (
                                    <li 
                                        key={entity.id} 
                                        className="p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors flex justify-between items-center"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FaBuilding className="text-purple-500 text-sm" />
                                            <span className="text-gray-800 font-medium text-sm">
                                                {entity.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(entity.id, 'entity', entity.name)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Eliminar Entidad"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </DashboardCard>

                
                {/* === Panel de Gestión de Proyectos (Invernaderos) === */}
                <DashboardCard
                    title="Proyectos (Cultivos)"
                    icon={<FaSeedling />}
                    titleColor="text-green-700"
                    badge={`${projects.length} registrados`}
                >
                    {/* Formulario de Creación */}
                    <form onSubmit={handleCreateProject} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nuevo Proyecto
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ej: Invernadero 3, Cultivo de Lechuga"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-sm"
                            >
                                <FaPlus className="text-sm" />
                                <span>Crear</span>
                            </button>
                        </div>
                    </form>

                    {/* Lista de Proyectos */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Proyectos Registrados
                        </h4>
                        {projects.length === 0 ? (
                            <p className="text-sm text-gray-500 italic text-center py-4">
                                No hay proyectos registrados
                            </p>
                        ) : (
                            <ul className="space-y-2 max-h-64 overflow-y-auto">
                                {projects.map(project => (
                                    <li 
                                        key={project.id} 
                                        className="p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors flex justify-between items-center"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FaSeedling className="text-green-500 text-sm" />
                                            <span className="text-gray-800 font-medium text-sm">
                                                {project.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(project.id, 'project', project.name)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Eliminar Proyecto"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </DashboardCard>

            </div>
        </div>
    );
};

export default EntityAndProjectManager;