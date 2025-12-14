import React, {
    useState, useEffect, useCallback, useMemo
} from "react";
import {
    FaFileExcel, FaChartLine, FaUserPlus, FaEdit, FaTrashAlt, FaSave, FaTimes,
    FaRunning, FaSeedling, FaWeightHanging, FaHourglassHalf, FaCalculator,
    FaUsers, FaCalendarAlt, FaMoneyBillWave, FaClock, FaCheckCircle,
    FaExclamationCircle, FaHistory, FaBullseye, FaSignInAlt, FaSignOutAlt,
    FaUser, FaChartBar, FaChartPie, FaListAlt
} from "react-icons/fa";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    initializeApp
} from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword 
} from "firebase/auth"; // IMPORTS DE AUTH
import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    collection,
    query,
    orderBy,
    getDocs,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx-js-style';

// Asumiendo que esta configuración está en su ruta correcta
import { firebaseConfig } from "../../firebaseConfig"; 

// --------------------------------------------------------
// --- CONFIGURACIÓN Y UTILIDADES GLOBALES ---
// --------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializar Auth
const db = getFirestore(app);
const COLLECTION_NAME = "rendimientoDiario";
const WORKERS_COLLECTION = "workersMasterList";
const BUDGET_COLLECTION = "appSettings";
const BUDGET_DOC_ID = "budgetSettings"; 

const initialWorkerId = 1;
const BOX_WEIGHTS = {
    A: 10, B: 5, C: 8, D: 12, E: 15,
};
const BOX_TYPES = Object.keys(BOX_WEIGHTS);

const emptyTaskData = () => ({
    recoleccion: { recolectionDetails: [{ boxType: 'A', quantity: 0, uniqueId: Date.now() + Math.random() }], hours: 0, difficultyFactor: 1.0, rows: 0 },
    entutorado: { progress: 0, hours: 0, difficultyFactor: 1.0, rows: 0 },
});

const calculateTotalWeight = (details) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((total, detail) => {
        const weight = BOX_WEIGHTS[detail.boxType] || 0;
        return total + (detail.quantity || 0) * weight;
    }, 0);
};

const calculateRA = (production, hours, fd) => {
    if (hours <= 0 || production <= 0) return 0;
    const factor = fd > 0 ? fd : 1.0;
    return (production * factor) / hours;
};

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const MotionCard = motion.div;

// --------------------------------------------------------
// --- COMPONENTE: WorkerManagement (Gestión de Trabajadores) ---
// --------------------------------------------------------

const WorkerManagement = ({ workers, setWorkers, nextWorkerId, setNextWorkerId, userId }) => { // RECIBE userId
    const [newWorkerName, setNewWorkerName] = useState('');
    const [editingWorkerId, setEditingWorkerId] = useState(null);
    const [editingWorkerName, setEditingWorkerName] = useState('');
    const workersRef = collection(db, WORKERS_COLLECTION);
    
    // Carga inicial de trabajadores (FILTRADO POR userId)
    useEffect(() => {
        if (!userId) return; // NO CARGAR TRABAJADORES SI NO HAY USUARIO
        
        // Consulta para obtener SOLO los trabajadores del usuario actual
        const q = query(workersRef, where("userId", "==", userId), orderBy("id", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const workerList = [];
            let maxId = initialWorkerId - 1;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.userId === userId) { 
                    workerList.push({ id: data.id, name: data.name, docId: doc.id });
                    if (data.id > maxId) maxId = data.id;
                }
            });
            setWorkers(workerList.sort((a, b) => a.id - b.id));
            setNextWorkerId(maxId + 1);
        }, (error) => {
            toast.error("Error al cargar lista maestra de trabajadores: " + error.message);
        });
        return unsubscribe;
    }, [setWorkers, setNextWorkerId, userId]); // DEPENDENCIA: userId

    const handleAddWorker = async () => {
        if (!userId) return toast.error("Error: Usuario no autenticado.");
        if (!newWorkerName.trim()) return toast.error("El nombre no puede estar vacío.");
        const workerId = nextWorkerId;
        
        // AÑADIR userId al documento
        const newWorker = { id: workerId, name: newWorkerName.trim(), userId: userId };
        
        try {
            const docRef = doc(workersRef);
            await setDoc(docRef, { ...newWorker, docId: docRef.id });
            setNextWorkerId(prev => prev + 1);
            setNewWorkerName('');
            toast.success(`Trabajador ${newWorker.name} (#${workerId}) agregado exitosamente.`);
        } catch (error) {
            toast.error("Error al agregar trabajador: " + error.message);
        }
    };

    const handleEditSave = async () => {
        if (!editingWorkerId || !editingWorkerName.trim()) return;
        const workerToUpdate = workers.find(w => w.id === editingWorkerId);
        if (!workerToUpdate) return;
        try {
            const docRef = doc(db, WORKERS_COLLECTION, workerToUpdate.docId);
            await updateDoc(docRef, { name: editingWorkerName.trim() });
            setEditingWorkerId(null);
            setEditingWorkerName('');
            toast.success("Nombre de trabajador actualizado.");
        } catch (error) {
            toast.error("Error al editar trabajador: " + error.message);
        }
    };
    



   const handleDeleteWorker = async (worker) => {
        if (!window.confirm(`¿Seguro que quieres eliminar a ${worker.name} (#${worker.id}) de la lista maestra? Los datos históricos NO serán eliminados.`)) return;
        try {
            const docRef = doc(db, WORKERS_COLLECTION, worker.docId);
            await deleteDoc(docRef);
            
            // CORRECCIÓN: Usamos toast.success para un estilo más visible (verde)
            toast.success("Trabajador eliminado de la lista maestra."); 
            
        } catch (error) {
            toast.error("Error al eliminar trabajador: " + error.message);
        }
    };


    // const handleDeleteWorker = async (worker) => {
    //     if (!window.confirm(`¿Seguro que quieres eliminar a ${worker.name} (#${worker.id}) de la lista maestra? Los datos históricos NO serán eliminados.`)) return;
    //     try {
    //         const docRef = doc(db, WORKERS_COLLECTION, worker.docId);
    //         await deleteDoc(docRef);
    //         toast.info("Trabajador eliminado de la lista maestra.");
    //     } catch (error) {
    //         toast.error("Error al eliminar trabajador: " + error.message);
    //     }
    // };

    return (
        <MotionCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 mb-8 bg-green-50 border border-green-300 rounded-xl shadow-lg"
        >
            <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-green-700 border-b-2 border-green-500 pb-2 flex items-center"><FaUsers className="mr-2"/>Gestión de Trabajadores</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Nombre del nuevo trabajador"
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWorker()}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <button 
                    onClick={handleAddWorker} 
                    className="flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md sm:w-auto"
                >
                    <FaUserPlus className="mr-2"/>Agregar
                </button>
            </div>
            <div className="max-h-64 overflow-y-auto border-t pt-4 border-green-200">
                {workers.map(worker => (
                    <motion.div 
                        key={worker.id} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.3 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 mb-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                        {editingWorkerId === worker.id ? (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-grow gap-2 w-full">
                                <input
                                    type="text"
                                    value={editingWorkerName}
                                    onChange={(e) => setEditingWorkerName(e.target.value)}
                                    className="p-2 border border-yellow-400 rounded-lg flex-grow"
                                />
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <button onClick={handleEditSave} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"><FaSave className="mr-1"/>Guardar</button>
                                    <button onClick={() => setEditingWorkerId(null)} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-gray-500 rounded-lg hover:bg-gray-600 text-sm"><FaTimes className="mr-1"/>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between flex-grow w-full">
                                <span className="font-semibold text-gray-700 text-sm sm:text-base truncate mr-4">ID: {worker.id} - {worker.name}</span>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => { setEditingWorkerId(worker.id); setEditingWorkerName(worker.name); }} className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"><FaEdit/></button>
                                    <button onClick={() => handleDeleteWorker(worker)} className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"><FaTrashAlt/></button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </MotionCard>
    );
};

// --------------------------------------------------------
// --- COMPONENTE: WorkerInputCard (Entrada de Datos) ---
// --------------------------------------------------------

const WorkerInputCard = ({ worker, handleTaskUpdate, handleBoxDetailChange, targetRA }) => {
    const recoleccion = worker?.recoleccion || {}; 
    const entutorado = worker?.entutorado || {};
    
    const recolectionDetails = recoleccion?.recolectionDetails && recoleccion.recolectionDetails.length > 0 
        ? recoleccion.recolectionDetails 
        : [{ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() }];
    
    const totalWeight = useMemo(() => calculateTotalWeight(recolectionDetails), [recolectionDetails]);
    const RA_Recoleccion = useMemo(() => calculateRA(totalWeight, recoleccion.hours || 0, recoleccion.difficultyFactor || 1.0), [totalWeight, recoleccion.hours, recoleccion.difficultyFactor]);
    const RA_Entutorado = useMemo(() => calculateRA(entutorado.progress || 0, entutorado.hours || 0, entutorado.difficultyFactor || 1.0), [entutorado.progress, entutorado.hours, entutorado.difficultyFactor]);
    
    let sumRA = 0, completedTasks = 0;
    if (RA_Recoleccion > 0) { sumRA += RA_Recoleccion; completedTasks++; }
    if (RA_Entutorado > 0) { sumRA += RA_Entutorado; completedTasks++; }
    
    const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
    const raColor = RA_Global >= targetRA ? 'bg-green-500' : (RA_Global > 0.5 * targetRA ? 'bg-yellow-500' : 'bg-red-500');

    const updateDetails = (index, field, value) => {
        let newDetails = [...recolectionDetails];
        if (field === 'add') {
            newDetails.push({ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() });
        } else if (field === 'remove') {
            if (newDetails.length > 1) {
                newDetails.splice(index, 1);
            } else {
                toast.error("Debe haber al menos un tipo de caja.");
                return;
            }
        } else {
            if (newDetails[index]) {
                newDetails[index] = { ...newDetails[index], [field]: value };
            }
        }
        handleBoxDetailChange(worker.id, newDetails);
    };

    return (
        <MotionCard 
            layout 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 bg-white border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <h3 className="mb-4 text-lg sm:text-xl font-bold text-blue-600 border-b-2 border-blue-400 pb-2 flex justify-between items-center">
                <span className="truncate">{worker?.name} (# {worker?.id})</span>
                <div className={`px-2 py-1 text-xs sm:text-sm font-bold text-white rounded-full ${raColor} shadow-md flex-shrink-0`}>RA: {RA_Global.toFixed(2)}</div>
            </h3>
            
            {/* Horas Globales */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-blue-500 flex-shrink-0"/>H. Rec.:</label>
                    <input type="number" step="0.5" value={recoleccion.hours || ''} 
                            onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'hours', parseFloat(e.target.value) || 0)} 
                            className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-blue-500" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-green-500 flex-shrink-0"/>H. Ent.:</label>
                    <input type="number" step="0.5" value={entutorado.hours || ''} 
                            onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'hours', parseFloat(e.target.value) || 0)} 
                            className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-green-500" />
                </div>
            </div>
            
            {/* Detalles de Recolección */}
            <MotionCard 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-3 sm:p-4 mb-4 border border-indigo-300 rounded-lg bg-indigo-50"
            >
                <h4 className="mb-3 text-base sm:text-lg font-bold text-indigo-700 flex items-center"><FaWeightHanging className="mr-2"/>Recolección ({totalWeight.toFixed(1)} kg)</h4>
                
                {recolectionDetails.map((detail, index) => (
                    <motion.div 
                        key={detail.uniqueId || index} 
                        layout 
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mb-2 p-1 border-b border-indigo-200 text-sm"
                    >
                        <select
                            value={detail.boxType}
                            onChange={(e) => updateDetails(index, 'boxType', e.target.value)}
                            className="flex-grow min-w-0 p-1 border rounded-lg"
                        >
                            {BOX_TYPES.map(type => <option key={type} value={type}>{type} ({BOX_WEIGHTS[type]}kg)</option>)}
                        </select>
                        <input type="number" value={detail.quantity || ''} 
                                onChange={(e) => updateDetails(index, 'quantity', parseInt(e.target.value) || 0)} 
                                className="w-12 sm:w-16 p-1 text-right border rounded-lg" />
                        
                        {recolectionDetails.length > 1 && (
                            <button onClick={() => updateDetails(index, 'remove')} className="p-1 text-white bg-red-500 rounded-md hover:bg-red-600 flex-shrink-0">
                                <FaTimes className="text-xs"/>
                            </button>
                        )}
                        {/* Espaciador para la tarjeta con una sola caja */}
                        {recolectionDetails.length === 1 && <div className="w-[20px] sm:w-[30px] flex-shrink-0"></div>}
                    </motion.div>
                ))}
                <button onClick={() => updateDetails(null, 'add')} className="w-full py-1 mt-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 font-semibold text-sm">
                    + Añadir Caja
                </button>
            </MotionCard>
            
            {/* Detalles de Entutorado */}
            <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 border border-teal-300 rounded-lg bg-teal-50">
                <h4 className="mb-3 text-base sm:text-lg font-bold text-teal-700 flex items-center"><FaSeedling className="mr-2"/>Entutorado</h4>
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg text-sm">
                    <label className="font-semibold text-gray-700 flex items-center">Progreso (Ud.):</label>
                    <input type="number" value={entutorado.progress || ''} 
                            onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'progress', parseFloat(e.target.value) || 0)} 
                            className="w-16 sm:w-20 p-1 text-right border rounded-lg focus:ring-teal-500" />
                </div>
            </MotionCard>
            
            {/* Factores Ajustables (Filas y FD) */}
            <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 mt-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="mb-3 text-base sm:text-lg font-bold text-gray-700 flex items-center"><FaCalculator className="mr-2"/>Factores de Ajuste</h4>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    {/* Recolección */}
                    <div className="flex justify-between items-center"><label>Filas Rec.:</label><input type="number" value={recoleccion.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
                    <div className="flex justify-between items-center"><label>FD Rec.:</label><input type="number" step="0.1" value={recoleccion.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
                    {/* Entutorado */}
                    <div className="flex justify-between items-center"><label>Filas Ent.:</label><input type="number" value={entutorado.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
                    <div className="flex justify-between items-center"><label>FD Ent.:</label><input type="number" step="0.1" value={entutorado.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
                </div>
            </MotionCard>
        </MotionCard>
    );
};

// --------------------------------------------------------
// --- LÓGICA DE EXPORTACIÓN AVANZADA A EXCEL ---
// --------------------------------------------------------

const exportToExcelAdvanced = (data, selectedDate, dailySummary, targetRA, budgetMetrics) => {
    if (Object.keys(data).length === 0) {
        toast.error("No hay datos para exportar.");
        return;
    }

    const ws_data = [];
    const headers = [
        "ID", "Nombre", 
        "H. Rec.", "Peso (kg)", "FD Rec.", "RA Rec.", "Filas Rec.",
        "H. Ent.", "Progreso (Ud.)", "FD Ent.", "RA Ent.", "Filas Ent.",
        "RA Global", 
        "Cajas A", "Cajas B", "Cajas C", "Cajas D", "Cajas E",
        "Target RA", "Diferencia RA"
    ];
    ws_data.push(headers);

    const targetRAValue = parseFloat(targetRA);

    // 1. Datos por Trabajador
    data.forEach(worker => {
        // Usar encadenamiento opcional para evitar errores
        const rec = worker?.recoleccion || {};
        const ent = worker?.entutorado || {};
        const recolectionDetails = rec.recolectionDetails || [];
        const totalWeight = calculateTotalWeight(recolectionDetails);

        const boxCounts = BOX_TYPES.reduce((acc, type) => {
            const detail = recolectionDetails.find(d => d.boxType === type);
            acc[type] = detail ? detail.quantity : 0;
            return acc;
        }, {});

        const RA_Rec = calculateRA(totalWeight, rec.hours, rec.difficultyFactor);
        const RA_Ent = calculateRA(ent.progress, ent.hours, ent.difficultyFactor);
        
        let sumRA = 0, completedTasks = 0;
        if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
        if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
        const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
        const diffRA = RA_Global - targetRAValue;

        ws_data.push([
            worker.id, worker.name,
            rec.hours || 0, totalWeight, rec.difficultyFactor || 1.0, RA_Rec.toFixed(2), rec.rows || 0,
            ent.hours || 0, ent.progress || 0, ent.difficultyFactor || 1.0, RA_Ent.toFixed(2), ent.rows || 0,
            RA_Global.toFixed(2),
            boxCounts.A, boxCounts.B, boxCounts.C, boxCounts.D, boxCounts.E,
            targetRAValue, diffRA.toFixed(2)
        ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
    
    // --- ANALÍTICA AVANZADA EN EXCEL (Hoja de Resumen) ---
    const summary_data = [
        ["RESUMEN ANALÍTICO DIARIO"],
        ["Fecha:", selectedDate],
        ["Target RA (Objetivo):", targetRAValue],
        [],
        ["MÉTRICAS CLAVE (HOY)"],
        ["Total Trabajadores:", dailySummary.totalWorkers],
        ["Total Horas (Recolección):", dailySummary.totalRecolectionHours.toFixed(2)],
        ["Total Horas (Entutorado):", dailySummary.totalEntutoradoHours.toFixed(2)],
        ["Peso Total (kg):", dailySummary.totalWeight.toFixed(2)],
        ["RA Promedio Global:", dailySummary.avgRA.toFixed(2)],
        ["Trabajadores por encima del Target RA:", dailySummary.aboveTargetCount],
        [],
        ["ANÁLISIS DE PRESUPUESTO"],
        ["Presupuesto Horas (Objetivo):", budgetMetrics.targetHours],
        ["Costo por Hora (€):", budgetMetrics.costPerHour],
        ["Costo Total Esperado (€):", budgetMetrics.expectedTotalCost.toFixed(2)],
        ["Horas Reales Trabajadas:", dailySummary.totalHours.toFixed(2)],
        ["Desviación de Horas:", (dailySummary.totalHours - budgetMetrics.targetHours).toFixed(2)],
        ["Costo Real (€):", (dailySummary.totalHours * budgetMetrics.costPerHour).toFixed(2)],
    ];
    const ws_summary = XLSX.utils.aoa_to_sheet(summary_data);

    // --- ESTILOS AVANZADOS (XLSX-JS-STYLE) ---
    const borderStyle = { style: "thin", color: { rgb: "000000" } };
    const headerStyle = {
        font: { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "007bff" } }, 
        border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
        alignment: { horizontal: "center", vertical: "center" }
    };
    const raHeaderStyle = { ...headerStyle, fill: { fgColor: { rgb: "ffc107" } }, font: { name: "Arial", sz: 11, bold: true, color: { rgb: "000000" } } };
    
    // Aplicar estilos a la cabecera
    headers.forEach((_, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        if (worksheet[cellRef]) {
            worksheet[cellRef].s = (headers[colIndex].includes("RA") || headers[colIndex] === "Peso (kg)") ? raHeaderStyle : headerStyle;
        }
    });
    
    // Aplicar estilos a las filas de datos
    for (let R = 1; R < ws_data.length; R++) {
        for (let C = 0; C < headers.length; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (worksheet[cellRef]) {
                const isRA = headers[C].includes("RA");
                const isDiff = headers[C] === "Diferencia RA";
                
                let cellStyle = { 
                    border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
                    alignment: { horizontal: "center" } 
                };
                
                if (typeof ws_data[R][C] === 'number' || (typeof ws_data[R][C] === 'string' && !isNaN(parseFloat(ws_data[R][C])))) {
                    cellStyle.numFmt = isRA || isDiff ? "0.00" : "0";
                }
                
                if (isDiff) {
                    const value = parseFloat(ws_data[R][C]);
                    if (value >= 0) { 
                        cellStyle.fill = { fgColor: { rgb: "e9f7ef" } };
                        cellStyle.font = { color: { rgb: "155724" } }; 
                    } else { 
                        cellStyle.fill = { fgColor: { rgb: "f8d7da" } };
                        cellStyle.font = { color: { rgb: "721c24" } }; 
                    }
                } else if (isRA) {
                    cellStyle.fill = { fgColor: { rgb: "fff3cd" } };
                }

                worksheet[cellRef].s = cellStyle;
            }
        }
    }

    // Configuración de ancho de columnas
    worksheet['!cols'] = [
        { wch: 5 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, 
        { wch: 9 }, { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, 
        { wch: 9 }, { wch: 10 }, { wch: 11 }, { wch: 7 }, { wch: 7 }, 
        { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 10 }, { wch: 13 },
    ];
    
    // Combinar hojas y exportar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Diarios");
    XLSX.utils.book_append_sheet(workbook, ws_summary, "Resumen Analítico");
    XLSX.writeFile(workbook, `Rendimiento_Diario_Analitica_${selectedDate}.xlsx`);
    toast.success("Exportación avanzada a Excel completada.");
};


// --------------------------------------------------------
// --- COMPONENTE: DailySummaryMobile (Resumen Diario) ---
// --------------------------------------------------------

const DailySummaryMobile = ({ dailySummary, targetRA }) => {
    const RA_Global_Color = dailySummary.avgRA >= targetRA ?
        'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    const performanceIcon = dailySummary.avgRA >= targetRA ?
        <FaChartLine className="text-green-500 text-2xl"/> : <FaExclamationCircle className="text-yellow-500 text-2xl"/>;

    const MetricItem = ({ icon, label, value, unit, color }) => (
        <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <span className={`${color} text-xl mb-1`}>{icon}</span>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-base font-bold text-gray-800">{value} <span className="text-xs font-normal">{unit}</span></p>
        </div>
    );
    
    return (
        <MotionCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 mb-8 bg-white rounded-xl shadow-lg border border-gray-200"
        >
            <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-gray-700 border-b-2 border-gray-300 pb-2 flex items-center">
                {performanceIcon}
                <span className="ml-2">Resumen Diario</span>
            </h2>

            {/* Métrica de Rendimiento Global (Destacada) */}
            <div className={`p-4 mb-4 rounded-lg flex justify-between items-center ${RA_Global_Color} shadow-md`}>
                <div>
                    <p className="text-lg font-semibold">RA Promedio Global</p>
                    <p className="text-xs text-gray-600">Objetivo: **{targetRA}**</p>
                </div>
                <div className="text-3xl font-extrabold">
                    {dailySummary.avgRA.toFixed(2)}
                </div>
            </div>

            {/* Grid de Métricas Clave */}
            <div className="grid grid-cols-2 gap-3 text-center">
                <MetricItem icon={<FaUsers />} label="Total Trabajadores" value={dailySummary.totalWorkers} unit="pers." color="text-indigo-500" />
                <MetricItem icon={<FaWeightHanging />} label="Peso Total" value={dailySummary.totalWeight.toFixed(1)} unit="kg" color="text-red-500" />
                <MetricItem icon={<FaHourglassHalf />} label="Horas Recolección" value={dailySummary.totalRecolectionHours.toFixed(1)} unit="h" color="text-blue-500" />
                <MetricItem icon={<FaSeedling />} label="Horas Entutorado" value={dailySummary.totalEntutoradoHours.toFixed(1)} unit="h" color="text-teal-500" />
            </div>

            <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm font-medium text-center">
                <FaCheckCircle className="inline mr-1 text-green-500"/> Trabajadores sobre Target: **{dailySummary.aboveTargetCount}**
            </div>
        </MotionCard>
    );
};

// --------------------------------------------------------
// --- COMPONENTE: BudgetAnalysisMobile (Presupuesto) ---
// --------------------------------------------------------

const BudgetAnalysisMobile = ({ dailySummary, budgetMetrics, setTargetHours, setCostPerHour, saveBudgetSettings, targetRA, setTargetRA, saveTargetRA }) => {
    const deviation = dailySummary.totalHours - budgetMetrics.targetHours;
    const deviationColor = deviation > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
    const deviationText = deviation > 0 ?
        `+${deviation.toFixed(1)}h` : `${deviation.toFixed(1)}h`;
    const deviationIcon = deviation > 0 ? <FaExclamationCircle className="mr-1"/> : <FaCheckCircle className="mr-1"/>;
    const costReal = dailySummary.totalHours * budgetMetrics.costPerHour;

    const BudgetItem = ({ label, value, unit, color }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm text-gray-600 flex items-center">
                <span className={`w-2 h-2 rounded-full ${color} mr-2`}></span>
                {label}
            </span>
            <span className="text-sm font-semibold text-gray-800">
                {value} <span className="text-xs font-normal">{unit}</span>
            </span>
        </div>
    );
    
    return (
        <MotionCard 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 mb-8 bg-purple-50 border border-purple-300 rounded-xl shadow-lg"
        >
            <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-purple-700 border-b-2 border-purple-500 pb-2 flex items-center"><FaMoneyBillWave className="mr-2"/>Análisis de Presupuesto y Target</h2>
            
            {/* Controles de Configuración */}
            <div className="grid grid-cols-2 gap-4">
                {/* Target RA */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-purple-700 mb-1 flex items-center"><FaBullseye className="mr-1"/> Target RA (Objetivo)</label>
                    <input 
                        type="number" step="0.1" 
                        value={targetRA} 
                        onChange={(e) => setTargetRA(parseFloat(e.target.value) || 0)} 
                        className="p-2 border border-purple-400 rounded-lg focus:ring-purple-500" 
                    />
                </div>
                {/* Horas Presupuestadas */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-purple-700 mb-1 flex items-center"><FaClock className="mr-1"/> Horas Presupuesto</label>
                    <input 
                        type="number" step="1" 
                        value={budgetMetrics.targetHours} 
                        onChange={(e) => setTargetHours(parseFloat(e.target.value) || 0)} 
                        className="p-2 border border-purple-400 rounded-lg focus:ring-purple-500" 
                    />
                </div>
                {/* Costo por Hora */}
                <div className="col-span-2 flex flex-col">
                    <label className="text-sm font-medium text-purple-700 mb-1 flex items-center"><FaMoneyBillWave className="mr-1"/> Costo por Hora (€)</label>
                    <input 
                        type="number" step="0.01" 
                        value={budgetMetrics.costPerHour} 
                        onChange={(e) => setCostPerHour(parseFloat(e.target.value) || 0)} 
                        className="p-2 border border-purple-400 rounded-lg focus:ring-purple-500" 
                    />
                </div>
                <button 
                    onClick={() => { saveBudgetSettings(); saveTargetRA(); }} 
                    className="col-span-2 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md flex items-center justify-center text-sm font-semibold" 
                >
                    <FaSave className="mr-2"/>Guardar Configuración
                </button>
            </div>
            
            {/* Resumen de Costos */}
            <h3 className="text-base font-bold text-purple-700 mb-2 mt-4">Resumen Diario de Costos</h3>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
                <BudgetItem label="Costo Total Esperado" value={budgetMetrics.expectedTotalCost.toFixed(2)} unit="€" color="bg-gray-400" />
                <BudgetItem label="Horas Reales Trabajadas" value={dailySummary.totalHours.toFixed(1)} unit="h" color="bg-blue-500" />
                <BudgetItem label="Costo Real (Hoy)" value={costReal.toFixed(2)} unit="€" color="bg-red-500" />
            </div>

            {/* Desviación */}
            <div className={`mt-4 p-3 rounded-lg text-center font-bold shadow-sm ${deviationColor}`}>
                {deviationIcon} Desviación de Horas: **{deviationText}**
            </div>
        </MotionCard>
    );
};

// Componente auxiliar para la navegación
const NavButton = ({ icon, label, currentView, target, setView }) => {
    const isActive = currentView === target;
    const baseClasses = "flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-lg transition min-w-[120px] font-medium";
    const activeClasses = "bg-indigo-600 text-white shadow-lg";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <button 
            onClick={() => setView(target)} 
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="ml-1 hidden sm:inline">{label}</span>
        </button>
    );
};

// --------------------------------------------------------
// --- COMPONENTE: AuthUI (Control de Autenticación) ---
// --------------------------------------------------------

const AuthUI = ({ userId, user, isAuthReady, setErrorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAuth = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Registro exitoso. ¡Bienvenido!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Inicio de sesión exitoso.");
            }
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
            toast.error(isRegister ? "Error al registrar. Verifique la contraseña (mín. 6 caracteres) o el correo." : "Credenciales incorrectas.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // const handleLogout = async () => {
    //     await signOut(auth);
    //     toast.success("Sesión cerrada.");
    // };

    if (!isAuthReady) {
        return <div className="text-center p-6 text-indigo-700 font-semibold">Cargando autenticación...</div>;
    }

    if (userId) {
        return (
            <div className="p-4 bg-indigo-100 rounded-xl shadow-md border border-indigo-300">
                <p className="font-bold text-indigo-700 flex items-center"><FaUser className="mr-2"/>Usuario Activo:</p>
                <p className="text-sm text-gray-700 truncate mb-3">{user.email}</p>
                {/* <button onClick={handleLogout} className="w-full py-2 flex items-center justify-center text-white bg-red-500 rounded-lg hover:bg-red-600 text-sm">
                    <FaSignOutAlt className="mr-2"/>Cerrar Sesión
                </button> */}
            </div>
        );
    }

    return (
        <MotionCard 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl border border-indigo-200"
        >
            <h2 className="mb-4 text-2xl font-bold text-indigo-700 flex items-center justify-center">
                <FaSignInAlt className="mr-2"/> {isRegister ? 'Registro' : 'Iniciar Sesión'}
            </h2>
            <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button 
                onClick={handleAuth} 
                disabled={isLoading}
                className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold disabled:bg-indigo-400"
            >
                {isLoading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Entrar'}
            </button>
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="w-full mt-3 py-2 text-indigo-600 hover:text-indigo-800 transition duration-300 text-sm"
            >
                {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
        </MotionCard>
    );
};


// --------------------------------------------------------
// --- COMPONENTE PRINCIPAL: AppRendimiento (Modificado) ---
// --------------------------------------------------------

// --------------------------------------------------------
// --- COMPONENTE: GlobalSummaryView (Resumen Global) ---
// --------------------------------------------------------
const GlobalSummaryView = ({ rangeData, startDate, endDate, setStartDate, setEndDate, fetchRangeData }) => {
    const summary = useMemo(() => {
        if (!rangeData || rangeData.length === 0) return null;
        
        let totalKg = 0;
        let totalHours = 0;
        let days = rangeData.length;

        rangeData.forEach(day => {
            const dayData = day.data || {};
            Object.values(dayData).forEach(worker => {
                const rec = worker.recoleccion || {};
                const ent = worker.entutorado || {};
                
                // Peso
                if (rec.recolectionDetails) {
                    totalKg += calculateTotalWeight(rec.recolectionDetails);
                }

                // Horas
                totalHours += (rec.hours || 0) + (ent.hours || 0);
            });
        });

        return { totalKg, totalHours, days };
    }, [rangeData]);

    return (
        <MotionCard className="p-6 bg-white rounded-xl shadow-lg border border-indigo-200 mb-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
                <FaChartBar className="mr-2"/> Resumen Global
            </h2>

            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded-lg" />
                </div>
                <button onClick={fetchRangeData} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">
                    Analizar Rango
                </button>
            </div>

            {summary ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center shadow-sm">
                        <p className="text-sm text-blue-600 font-semibold">Total Kilogramos</p>
                        <p className="text-3xl font-bold text-blue-800">{summary.totalKg.toFixed(1)} kg</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center shadow-sm">
                        <p className="text-sm text-green-600 font-semibold">Total Horas</p>
                        <p className="text-3xl font-bold text-green-800">{summary.totalHours.toFixed(1)} h</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center shadow-sm">
                        <p className="text-sm text-purple-600 font-semibold">Días Analizados</p>
                        <p className="text-3xl font-bold text-purple-800">{summary.days}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-gray-200 border-dashed">Seleccione un rango de fechas y haga clic en "Analizar Rango".</p>
            )}
        </MotionCard>
    );
};

// --------------------------------------------------------
// --- COMPONENTE: EnhancedBudgetAnalytics (Analítica Avanzada) ---
// --------------------------------------------------------
const EnhancedBudgetAnalytics = ({ dailySummary, budgetMetrics, targetRA }) => {
    const costData = [
        { name: 'Presupuesto', amount: budgetMetrics.expectedTotalCost },
        { name: 'Real', amount: dailySummary.totalHours * budgetMetrics.costPerHour }
    ];

    return (
        <div className="space-y-6">
            <MotionCard className="p-6 bg-white rounded-xl shadow-lg border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                    <FaChartPie className="mr-2"/> Análisis de Costos y Eficiencia
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gráfico de Costos */}
                    <div className="h-64">
                        <h3 className="text-center font-semibold text-gray-700 mb-2">Comparativa de Costos (Hoy)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                                <Bar dataKey="amount" name="Costo (€)">
                                    {costData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : (entry.amount > costData[0].amount ? '#ff6b6b' : '#82ca9d')} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Métricas de Eficiencia */}
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500">Costo por Kg (Estimado)</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {dailySummary.totalWeight > 0 
                                    ? `€${((dailySummary.totalHours * budgetMetrics.costPerHour) / dailySummary.totalWeight).toFixed(2)}` 
                                    : '-'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500">Adherencia al Presupuesto</p>
                            <p className={`text-2xl font-bold ${dailySummary.totalHours <= budgetMetrics.targetHours ? 'text-green-600' : 'text-red-600'}`}>
                                {budgetMetrics.targetHours > 0 
                                    ? `${((dailySummary.totalHours / budgetMetrics.targetHours) * 100).toFixed(1)}%` 
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </MotionCard>
        </div>
    );
};

const AppRendimiento = () => {
    // --- ESTADOS DE AUTENTICACIÓN ---
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    // --- ESTADOS PRINCIPALES ---
    const [workers, setWorkers] = useState([]);
    const [nextWorkerId, setNextWorkerId] = useState(initialWorkerId);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [workerData, setWorkerData] = useState({});
    const [view, setView] = useState('input');
    const [budgetMetrics, setBudgetMetrics] = useState({
        targetHours: 80, 
        costPerHour: 15, 
        expectedTotalCost: 80 * 15 
    });
    const [targetRA, setTargetRA] = useState(1.0);
    const [errorMessage, setErrorMessage] = useState('');

    // --- ESTADOS PARA RESUMEN GLOBAL ---
    const [rangeStartDate, setRangeStartDate] = useState(formatDate(new Date()));
    const [rangeEndDate, setRangeEndDate] = useState(formatDate(new Date()));
    const [rangeData, setRangeData] = useState([]);

    // --- EFECTO: MANEJO DE ESTADO DE AUTENTICACIÓN ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserId(currentUser ? currentUser.uid : null);
            setIsAuthReady(true);
            if (!currentUser) {
                // Limpiar datos al cerrar sesión
                setWorkers([]);
                setWorkerData({});
            }
        });
        return unsubscribe;
    }, []);

    // --- EFECTO: CARGA DE CONFIGURACIÓN (FILTRADO POR userId) ---
    useEffect(() => {
        if (!userId) return; 
        
        // Usar el userId en el ID del documento de configuración para segregación
        const configDocId = `${BUDGET_DOC_ID}-${userId}`;
        const budgetDocRef = doc(db, BUDGET_COLLECTION, configDocId);
        
        const unsubscribeBudget = onSnapshot(budgetDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBudgetMetrics({
                    targetHours: data.targetHours || 80,
                    costPerHour: data.costPerHour || 15,
                    expectedTotalCost: (data.targetHours || 80) * (data.costPerHour || 15),
                });
                setTargetRA(data.targetRA || 1.0);
            } else {
                // Inicializar con valores por defecto si no existe
                setTargetRA(1.0); 
                setBudgetMetrics({ targetHours: 80, costPerHour: 15, expectedTotalCost: 80 * 15 });
            }
        }, (error) => {
            toast.error("Error al cargar configuración: " + error.message);
        });
        
        return () => unsubscribeBudget(); 
    }, [userId]); // DEPENDENCIA: userId

    // Funciones para guardar configuración (FILTRADO POR userId)
    const saveBudgetSettings = useCallback(async () => {
        if (!userId) { toast.error("Debe iniciar sesión para guardar."); return; }
        try {
            const configDocId = `${BUDGET_DOC_ID}-${userId}`;
            const docRef = doc(db, BUDGET_COLLECTION, configDocId);
            await setDoc(docRef, { 
                targetHours: budgetMetrics.targetHours, 
                costPerHour: budgetMetrics.costPerHour,
                targetRA: targetRA, 
                userId: userId, // Guardar el userId en el documento
                updatedAt: serverTimestamp() 
            }, { merge: true });
            toast.success("Configuración de presupuesto guardada.");
        } catch (error) {
            toast.error("Error al guardar presupuesto: " + error.message);
        }
    }, [budgetMetrics, targetRA, userId]);

    // Función para guardar Target RA (FILTRADO POR userId)
    const saveTargetRA = useCallback(async () => {
        if (!userId) { toast.error("Debe iniciar sesión para guardar."); return; }
        try {
            const configDocId = `${BUDGET_DOC_ID}-${userId}`;
            const docRef = doc(db, BUDGET_COLLECTION, configDocId);
            await updateDoc(docRef, { 
                targetRA: targetRA, 
                updatedAt: serverTimestamp() 
            });
            toast.success("Target RA guardado.");
        } catch (error) {
            toast.error("Error al guardar Target RA: " + error.message);
        }
    }, [targetRA, userId]);

    // Carga de Datos Diarios para la fecha seleccionada (FILTRADO POR userId)
    useEffect(() => {
        if (!selectedDate || workers.length === 0 || !userId) return; // ESPERAR userId
        
        // ID de Documento ÚNICO: Fecha + ID de Usuario
        const dailyDocId = `${selectedDate}-${userId}`; 
        const dailyDocRef = doc(db, COLLECTION_NAME, dailyDocId);
        
        const unsubscribe = onSnapshot(dailyDocRef, (docSnap) => {
            const savedData = docSnap.exists() ? docSnap.data().data || {} : {};
            
            // Fusión de datos (solo para los trabajadores del usuario actual)
            const mergedData = workers.reduce((acc, worker) => {
                const savedWorkerData = savedData[worker.id]; 
                
                if (savedWorkerData) {
                    acc[worker.id] = { 
                        ...emptyTaskData(), 
                        ...savedWorkerData, 
                        name: worker.name, 
                        recoleccion: { 
                            ...emptyTaskData().recoleccion, 
                            ...savedWorkerData.recoleccion, 
                            recolectionDetails: savedWorkerData.recoleccion?.recolectionDetails && savedWorkerData.recoleccion.recolectionDetails.length > 0 ?
                                savedWorkerData.recoleccion.recolectionDetails : emptyTaskData().recoleccion.recolectionDetails 
                        }, 
                        entutorado: { 
                            ...emptyTaskData().entutorado, 
                            ...savedWorkerData.entutorado 
                        },
                    };
                } else { 
                    acc[worker.id] = { ...emptyTaskData(), name: worker.name };
                }
                return acc;
            }, {});
            
            setWorkerData(mergedData);
        }, (error) => {
            toast.error("Error al cargar datos diarios: " + error.message);
        });
        
        return () => unsubscribe();
    }, [selectedDate, workers, userId]); // DEPENDENCIA: userId

    const handleTaskUpdate = (workerId, taskType, field, value) => {
        setWorkerData(prevData => ({
            ...prevData,
            [workerId]: {
                ...prevData[workerId],
                [taskType]: {
                    ...prevData[workerId][taskType],
                    [field]: value
                }
            }
        }));
    };

    const handleBoxDetailChange = (workerId, newDetails) => {
        setWorkerData(prevData => ({
            ...prevData,
            [workerId]: {
                ...prevData[workerId],
                recoleccion: {
                    ...prevData[workerId].recoleccion,
                    recolectionDetails: newDetails
                }
            }
        }));
    };

    /**
     * Guarda la información de todos los trabajadores para el día seleccionado (FILTRADO POR userId)
     */
    const handleSaveDay = async () => {
        if (!userId) { toast.error("Debe iniciar sesión para guardar."); return; } // Bloqueo de seguridad
        try {
            // ID de Documento ÚNICO: Fecha + ID de Usuario
            const dailyDocId = `${selectedDate}-${userId}`;
            const dailyDocRef = doc(db, COLLECTION_NAME, dailyDocId);
            
            // Prepara los datos eliminando los nombres (que vienen de la lista maestra)
            const dataToSave = Object.keys(workerData).reduce((acc, key) => {
                const { name, ...rest } = workerData[key]; 
                const totalWeight = calculateTotalWeight(rest.recoleccion.recolectionDetails); 
                if (rest.recoleccion.hours > 0 || rest.entutorado.hours > 0 || totalWeight > 0 || rest.entutorado.progress > 0) {
                    acc[key] = rest;
                }
                return acc;
            }, {});

            if (Object.keys(dataToSave).length === 0) {
                toast.error("No hay datos significativos para guardar. No se ha escrito en la DB.");
                return;
            }
            
            await setDoc(dailyDocRef, { 
                date: selectedDate, 
                userId: userId, // Clave de seguridad
                data: dataToSave, 
                timestamp: serverTimestamp() 
            }, { merge: true });
            
            toast.success(`Datos del día ${selectedDate} guardados exitosamente.`);
        } catch (error) {
            toast.error("Error al guardar datos diarios: " + error.message);
        }
    };

    // --- FUNCIÓN: FETCH RANGO DE FECHAS ---
    const fetchRangeData = async () => {
        if (!userId) return;
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId),
                where("date", ">=", rangeStartDate),
                where("date", "<=", rangeEndDate)
            );
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setRangeData(data);
            toast.success(`Datos cargados: ${data.length} días encontrados.`);
        } catch (error) {
            console.error("Error fetching range data:", error);
            toast.error("Error al cargar datos del rango.");
        }
    };

    // --------------------------------------
    // --- CÁLCULOS Y RESUMEN (useMemo) ---
    // --------------------------------------
    const dailySummary = useMemo(() => {
        const workersArray = Object.values(workerData).filter(w => w.name);
        let totalRecolectionHours = 0;
        let totalEntutoradoHours = 0;
        let totalWeight = 0;
        let totalRA = 0;
        let completedWorkersCount = 0;
        let aboveTargetCount = 0;

        workersArray.forEach(worker => {
            // Usar encadenamiento opcional para evitar errores
            const rec = worker?.recoleccion || {};
            const ent = worker?.entutorado || {};
            
            // Horas
            totalRecolectionHours += rec.hours || 0;
            totalEntutoradoHours += ent.hours || 0;
            
            // Peso Recolección
            const recDetails = rec.recolectionDetails || [];
            const currentWeight = calculateTotalWeight(recDetails);
            totalWeight += currentWeight;

            // Cálculo de RA Global
            const RA_Rec = calculateRA(currentWeight, rec.hours || 0, rec.difficultyFactor || 1.0);
            const RA_Ent = calculateRA(ent.progress || 0, ent.hours || 0, ent.difficultyFactor || 1.0);

            let sumRA = 0, tasksCount = 0;
            if (RA_Rec > 0) { sumRA += RA_Rec; tasksCount++; }
            if (RA_Ent > 0) { sumRA += RA_Ent; tasksCount++; }

            if (tasksCount > 0) { 
                const RA_Global = sumRA / tasksCount;
                totalRA += RA_Global;
                completedWorkersCount++; 
                if (RA_Global >= targetRA) { 
                    aboveTargetCount++;
                } 
            }
        });

        const totalHours = totalRecolectionHours + totalEntutoradoHours;
        const avgRA = completedWorkersCount > 0 ? totalRA / completedWorkersCount : 0;

        return { 
            totalWorkers: workersArray.length, 
            totalRecolectionHours, 
            totalEntutoradoHours, 
            totalHours, 
            totalWeight, 
            avgRA, 
            aboveTargetCount, 
            completedWorkersCount,
        };
    }, [workerData, targetRA]);

    // --------------------------------------
    // --- RENDERIZADO PRINCIPAL ---
    // --------------------------------------
    const renderView = () => {
        const workersArray = workers.map(w => ({...w, ...workerData[w.id]})).filter(w => w.name);

        switch (view) {
            case 'workers':
                return (
                    <WorkerManagement 
                        workers={workers} 
                        setWorkers={setWorkers} 
                        nextWorkerId={nextWorkerId} 
                        setNextWorkerId={setNextWorkerId}
                        userId={userId} // PASAR userId
                    />
                );
            case 'budget':
                return (
                    <div className="space-y-6">
                        <BudgetAnalysisMobile 
                            dailySummary={dailySummary} 
                            budgetMetrics={budgetMetrics} 
                            setTargetHours={(h) => setBudgetMetrics(prev => ({ ...prev, targetHours: h, expectedTotalCost: h * prev.costPerHour }))} 
                            setCostPerHour={(c) => setBudgetMetrics(prev => ({ ...prev, costPerHour: c, expectedTotalCost: prev.targetHours * c }))}
                            saveBudgetSettings={saveBudgetSettings}
                            targetRA={targetRA}
                            setTargetRA={setTargetRA}
                            saveTargetRA={saveTargetRA}
                        />
                        <EnhancedBudgetAnalytics 
                            dailySummary={dailySummary}
                            budgetMetrics={budgetMetrics}
                            targetRA={targetRA}
                        />
                    </div>
                );
            case 'summary':
                return <DailySummaryMobile dailySummary={dailySummary} targetRA={targetRA} />;
            case 'global-summary':
                return (
                    <GlobalSummaryView 
                        rangeData={rangeData}
                        startDate={rangeStartDate}
                        endDate={rangeEndDate}
                        setStartDate={setRangeStartDate}
                        setEndDate={setRangeEndDate}
                        fetchRangeData={fetchRangeData}
                    />
                );
            case 'input':
            default:
                if (workersArray.length === 0) {
                    return (
                        <div className="text-center p-6 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800">
                            <FaExclamationCircle className="inline text-2xl mr-2"/>
                            <p className="font-semibold">No hay trabajadores en la lista maestra.</p>
                            <p className="text-sm mt-1">Vaya a la pestaña "Gestión Trabajadores" para agregar.</p>
                        </div>
                    );
                }
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {workersArray.map(worker => (
                            <WorkerInputCard 
                                key={worker.id} 
                                worker={worker} 
                                handleTaskUpdate={handleTaskUpdate} 
                                handleBoxDetailChange={handleBoxDetailChange} 
                                targetRA={targetRA}
                            />
                        ))}
                    </div>
                );
        }
    };

    const ActiveUserDisplay = ({ user }) => {
    if (!user) return null;
    return (
        <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-300 shadow-sm flex-shrink-0 max-w-full">
            <div className="flex items-center text-sm">
                <FaUser className="mr-1 text-indigo-500 flex-shrink-0"/>
                {/* Ocultamos la etiqueta en móvil, mostramos solo el correo */}
                <span className="hidden sm:inline font-semibold text-indigo-700 mr-1 flex-shrink-0">Usuario Activo:</span>
                <span className="font-normal text-gray-700 truncate min-w-0">{user.email}</span>
            </div>
        </div>
    );
};
    
    // --- ESTRUCTURA PRINCIPAL DEL COMPONENTE ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Toaster position="top-right" reverseOrder={false} />
            
            {/* Si no está autenticado, solo muestra la UI de autenticación */}
            {!userId && (
                <div className="mt-10">
                    <AuthUI userId={userId} user={user} isAuthReady={isAuthReady} setErrorMessage={setErrorMessage} />
                    {errorMessage && <p className="text-red-500 text-center mt-4">Error: {errorMessage}</p>}
                </div>
            )}

            {/* Contenido principal solo si está autenticado */}
            {userId && (
                <>
                   <header className="mb-6 p-2">
    {/* Contenedor Principal: Se apilan en móvil (flex-col) y se alinean a los lados en escritorio (sm:flex-row) */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        
        {/* 1. GRUPO: Título Principal y Usuario Activo */}
        <div className="flex flex-col gap-2 flex-grow min-w-0">
            {/* Título: Usa un tamaño grande pero responsivo (2xl a 3xl) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 flex items-center">
                <FaRunning className="mr-2 text-indigo-500 flex-shrink-0"/>
                Gestión de Rendimiento Diario
            </h1>
            
            {/* Usuario Activo: Usa el componente compacto ActiveUserDisplay */}
            {user && <ActiveUserDisplay user={user} />}
        </div>
        
        {/* 2. GRUPO: Selector de Fecha y Botón de Guardar */}
        {/* Usamos shadow-lg para que destaque y flex-shrink-0 para que no se encoja en escritorio */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-lg border border-gray-200 flex-shrink-0 w-full sm:w-auto">
            
            {/* Selector de Fecha */}
            <div className="flex items-center w-full sm:w-auto">
                <FaCalendarAlt className="mr-2 text-gray-500"/>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    // w-full en móvil para ocupar todo el espacio
                    className="p-1 border border-gray-300 rounded-lg text-sm w-full"
                />
            </div>
            
            {/* Botón de Guardar */}
            <button 
                onClick={handleSaveDay} 
                className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 shadow-md text-sm font-semibold"
            >
                <FaSave className="mr-2"/> Guardar Datos del Día
            </button>
        </div>
    </div>
</header>
                    
                    {/* Sección de Autenticación Activa */}
                  

                    {/* Barra de Navegación/Control */}
                    <nav className="mb-6 p-3 bg-white rounded-xl shadow-lg flex flex-wrap justify-between gap-2 sm:gap-4">
                        <NavButton icon={<FaHourglassHalf/>} label="Entrada" currentView={view} target="input" setView={setView} />
                        <NavButton icon={<FaChartLine/>} label="Diario" currentView={view} target="summary" setView={setView} />
                        <NavButton icon={<FaListAlt/>} label="Global" currentView={view} target="global-summary" setView={setView} />
                        <NavButton icon={<FaUsers/>} label="Trabajadores" currentView={view} target="workers" setView={setView} />
                        <NavButton icon={<FaMoneyBillWave/>} label="Presupuesto" currentView={view} target="budget" setView={setView} />
                        <button 
                            onClick={() => exportToExcelAdvanced(Object.values(workerData).filter(w => w.name), selectedDate, dailySummary, targetRA, budgetMetrics)} 
                            className="flex items-center justify-center flex-1 px-3 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition min-w-[120px]"
                        >
                            <FaFileExcel className="mr-1"/> Exportar Excel
                        </button>
                    </nav>

                    {/* Contenido Dinámico de la Vista */}
                    <main className="mb-8">
                        {renderView()}
                    </main>
                </>
            )}
        </div>
    );
};

export default AppRendimiento;





















