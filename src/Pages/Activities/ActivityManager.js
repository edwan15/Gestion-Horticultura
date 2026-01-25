import React, { useState, useEffect, useMemo } from 'react';
import { 
    FaPlus, FaArrowLeft, FaSearch, FaFilter, FaCheckCircle, 
    FaClock, FaExclamationCircle, FaTrash, FaEdit, FaTasks,
    FaClipboardList, FaFire
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, 
    onSnapshot, query, where, orderBy, serverTimestamp 
} from "firebase/firestore";
import { db } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';

// --- CONFIGURATION & HELPERS ---
const PRIORITY_CONFIG = {
    low: { label: 'Baja', color: 'bg-blue-100 text-blue-800', icon: FaClock },
    medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800', icon: FaClipboardList },
    high: { label: 'Alta', color: 'bg-orange-100 text-orange-800', icon: FaExclamationCircle },
    urgent: { label: 'URGENTE', color: 'bg-red-100 text-red-800', icon: FaFire },
};

const STATUS_COLUMNS = [
    { id: 'pending', title: 'Pendiente', color: 'border-l-4 border-gray-400' },
    { id: 'in_progress', title: 'En Progreso', color: 'border-l-4 border-blue-500' },
    { id: 'done', title: 'Completado', color: 'border-l-4 border-green-500' }
];

const getAppId = () => window.__app_id || "default-calendar-app-id";

// --- COMPONENTS ---

// 1. Task Card Component
const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
    const PriorityIcon = PRIORITY_CONFIG[task.priority]?.icon || FaClock;
    
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all mb-3 group"
        >
            {/* Header: Priority & Actions */}
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${PRIORITY_CONFIG[task.priority]?.color || 'bg-gray-100'}`}>
                    <PriorityIcon className="w-3 h-3" />
                    {PRIORITY_CONFIG[task.priority]?.label}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-500"><FaEdit /></button>
                    <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500"><FaTrash /></button>
                </div>
            </div>

            {/* Content */}
            <h4 className="font-bold text-gray-800 mb-1">{task.title}</h4>
            {task.description && <p className="text-sm text-gray-500 mb-3">{task.description}</p>}

            {/* Footer: Date & Move Controls */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    {task.dueDate && <span className={`mr-2 font-bold ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>{new Date(task.dueDate).toLocaleDateString()}</span>}
                    {task.createdAt?.toDate ? task.createdAt.toDate().toLocaleDateString() : 'Hoy'}
                </span>
                
                {/* Status Movers */}
                <div className="flex bg-gray-50 rounded-md p-1 gap-1">
                    {task.status !== 'pending' && (
                        <button 
                            onClick={() => onStatusChange(task.id, 'pending')}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-gray-500 text-xs"
                            title="Mover a Pendiente"
                        >←</button>
                    )}
                    {task.status !== 'in_progress' && (
                         <button 
                            onClick={() => onStatusChange(task.id, 'in_progress')}
                            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-xs ${task.status === 'pending' ? 'text-blue-500' : 'text-yellow-600'}`}
                            title="Mover a En Progreso"
                        >
                            {task.status === 'pending' ? '→' : '←'}
                        </button>
                    )}
                    {task.status !== 'done' && (
                        <button 
                            onClick={() => onStatusChange(task.id, 'done')}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-green-500 text-xs"
                            title="Marcar como Completado"
                        >
                            <FaCheckCircle />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// 2. Main Manager Component
const ActivityManager = ({ greenhouse, onBack }) => {
    const userId = useSelector(selectUserId);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });

    // --- FIRESTORE SYNC ---
    useEffect(() => {
        if (!userId || !greenhouse?.id) return;
        
        const appId = getAppId();
        const collectionPath = `artifacts/${appId}/users/${userId}/greenhouses/${greenhouse.id}/activities`;
        const q = query(
            collection(db, collectionPath), 
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(loadedTasks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, greenhouse]);

    // --- ACTIONS ---
    const handleSaveTask = async (e) => {
        e.preventDefault();
        if(!newTask.title.trim()) return;

        const appId = getAppId();
        const collectionPath = `artifacts/${appId}/users/${userId}/greenhouses/${greenhouse.id}/activities`;

        if (newTask.id) {
             // Edit Mode
             const docPath = `artifacts/${appId}/users/${userId}/greenhouses/${greenhouse.id}/activities/${newTask.id}`;
             await updateDoc(doc(db, docPath), {
                 ...newTask,
                 updatedAt: serverTimestamp()
             });
        } else {
            // Create Mode
            await addDoc(collection(db, collectionPath), {
                ...newTask,
                greenhouseId: greenhouse.id,
                createdAt: serverTimestamp()
            });
        }

        setIsModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
    };

    const openEditModal = (task) => {
        setNewTask({ ...task, dueDate: task.dueDate || '' });
        setIsModalOpen(true);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const appId = getAppId();
        const docPath = `artifacts/${appId}/users/${userId}/greenhouses/${greenhouse.id}/activities/${taskId}`;
        await updateDoc(doc(db, docPath), { status: newStatus });
    };

    const handleDelete = async (taskId) => {
         if(!window.confirm("¿Seguro que quieres eliminar esta actividad?")) return;
         const appId = getAppId();
         const docPath = `artifacts/${appId}/users/${userId}/greenhouses/${greenhouse.id}/activities/${taskId}`;
         await deleteDoc(doc(db, docPath));
    };

    // --- DERIVED STATE ---
    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const progress = useMemo(() => {
        if(tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'done').length;
        return Math.round((completed / tasks.length) * 100);
    }, [tasks]);

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* --- HEADER --- */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                             {greenhouse.name}
                             <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Gestor de Actividades</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                             <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                             </div>
                             <span>{progress}% Completado</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                    >
                        <FaPlus /> Nueva Tarea
                    </button>
                </div>
            </div>

            {/* --- FILTERS TOOLBAR --- */}
            <div className="px-6 py-3 bg-white/50 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative group w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar tareas..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm flex items-center gap-1"><FaFilter /> Prioridad:</span>
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                    >
                        <option value="all">Todas</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                    </select>
                </div>
            </div>

            {/* --- KANBAN BOARD CONTENT --- */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-[1000px]">
                    {STATUS_COLUMNS.map(col => (
                        <div key={col.id} className="flex-1 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200/60">
                            {/* Column Header */}
                            <div className={`p-3 border-b border-gray-200 bg-white/50 rounded-t-xl flex justify-between items-center ${col.color}`}>
                                <h3 className="font-bold text-gray-700">{col.title}</h3>
                                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {filteredTasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>
                            
                            {/* Column Content (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                <AnimatePresence>
                                    {filteredTasks.filter(t => t.status === col.id).map(task => (
                                        <TaskCard 
                                            key={task.id} 
                                            task={task} 
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                            onEdit={openEditModal}
                                        />
                                    ))}
                                    {filteredTasks.filter(t => t.status === col.id).length === 0 && (
                                        <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                            Sin tareas
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ADD TASK MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <FaPlus /> {newTask.id ? 'Editar Tarea' : 'Nueva Tarea'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-indigo-200 hover:text-white">✕</button>
                            </div>
                            
                             <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newTask.title}
                                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ej: Revisar sistema de riego"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                                    <textarea 
                                        rows="3"
                                        value={newTask.description}
                                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                                        <select 
                                            value={newTask.priority}
                                            onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">URGENTE</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
                                        <select 
                                            value={newTask.status}
                                            onChange={e => setNewTask({...newTask, status: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Progreso</option>
                                            <option value="done">Completado</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                                    <input 
                                        type="date" 
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-all"
                                    >
                                        Guardar Tarea
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActivityManager;
