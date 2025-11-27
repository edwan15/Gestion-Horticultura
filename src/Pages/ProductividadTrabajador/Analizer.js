// import React, { 
//     useState, useEffect, useCallback, useMemo 
// } from "react";
// import { 
//     FaFileExcel, FaChartLine, FaUserPlus, FaEdit, FaTrashAlt, FaSave, FaTimes, 
//     FaRunning, FaSeedling, FaWeightHanging, FaHourglassHalf, FaCalculator, 
//     FaUsers, FaCalendarAlt, FaMoneyBillWave, FaClock, FaCheckCircle, 
//     FaExclamationCircle, FaHistory, FaBullseye 
// } from "react-icons/fa";
// import {
//     initializeApp
// } from "firebase/app";
// import {
//     getFirestore,
//     doc,
//     setDoc,
//     onSnapshot,
//     updateDoc,
//     deleteDoc,
//     collection,
//     query,
//     orderBy,
//     limit,
//     getDocs,
//     where,
//     serverTimestamp,
// } from "firebase/firestore";
// import { toast, Toaster } from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import * as XLSX from 'xlsx-js-style';

// // Asumiendo que esta configuración está en su ruta correcta
// import { firebaseConfig } from "../../firebaseConfig"; 

// // --------------------------------------------------------
// // --- CONFIGURACIÓN Y UTILIDADES GLOBALES ---
// // --------------------------------------------------------

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const COLLECTION_NAME = "rendimientoDiario";
// const WORKERS_COLLECTION = "workersMasterList";
// const BUDGET_COLLECTION = "appSettings";
// const BUDGET_DOC_ID = "budgetSettings";

// const initialWorkerId = 1;

// const BOX_WEIGHTS = {
//     A: 10, B: 5, C: 8, D: 12, E: 15,
// };
// const BOX_TYPES = Object.keys(BOX_WEIGHTS);

// const emptyTaskData = () => ({
//     recoleccion: { recolectionDetails: [{ boxType: 'A', quantity: 0, uniqueId: Date.now() + Math.random() }], hours: 0, difficultyFactor: 1.0, rows: 0 },
//     entutorado: { progress: 0, hours: 0, difficultyFactor: 1.0, rows: 0 },
// });

// const calculateTotalWeight = (details) => {
//     if (!details || details.length === 0) return 0;
//     return details.reduce((total, detail) => {
//         const weight = BOX_WEIGHTS[detail.boxType] || 0;
//         return total + (detail.quantity || 0) * weight;
//     }, 0);
// };

// const calculateRA = (production, hours, fd) => {
//     if (hours <= 0 || production <= 0) return 0;
//     const factor = fd > 0 ? fd : 1.0;
//     return (production * factor) / hours;
// };

// const formatDate = (date) => {
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// };

// const MotionCard = motion.div;

// // --------------------------------------------------------
// // --- COMPONENTE: WorkerManagement (Gestión de Trabajadores) ---
// // --------------------------------------------------------

// const WorkerManagement = ({ workers, setWorkers, nextWorkerId, setNextWorkerId }) => {
//     const [newWorkerName, setNewWorkerName] = useState('');
//     const [editingWorkerId, setEditingWorkerId] = useState(null);
//     const [editingWorkerName, setEditingWorkerName] = useState('');
//     const workersRef = collection(db, WORKERS_COLLECTION);

//     useEffect(() => {
//         const unsubscribe = onSnapshot(workersRef, (snapshot) => {
//             const workerList = [];
//             let maxId = initialWorkerId - 1;
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 workerList.push({ id: data.id, name: data.name, docId: doc.id });
//                 if (data.id > maxId) maxId = data.id;
//             });
//             setWorkers(workerList.sort((a, b) => a.id - b.id));
//             setNextWorkerId(maxId + 1);
//         }, (error) => {
//             toast.error("Error al cargar lista maestra de trabajadores: " + error.message);
//         });
//         return unsubscribe;
//     }, [setWorkers, setNextWorkerId]);

//     const handleAddWorker = async () => {
//         if (!newWorkerName.trim()) return toast.error("El nombre no puede estar vacío.");
//         const workerId = nextWorkerId;
//         const newWorker = { id: workerId, name: newWorkerName.trim() };
//         try {
//             const docRef = doc(workersRef);
//             await setDoc(docRef, { ...newWorker, docId: docRef.id });
//             setNextWorkerId(prev => prev + 1);
//             setNewWorkerName('');
//             toast.success(`Trabajador ${newWorker.name} (#${workerId}) agregado exitosamente.`);
//         } catch (error) {
//             toast.error("Error al agregar trabajador: " + error.message);
//         }
//     };

//     const handleEditSave = async () => {
//         if (!editingWorkerId || !editingWorkerName.trim()) return;
//         const workerToUpdate = workers.find(w => w.id === editingWorkerId);
//         if (!workerToUpdate) return;
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION, workerToUpdate.docId);
//             await updateDoc(docRef, { name: editingWorkerName.trim() });
//             setEditingWorkerId(null);
//             setEditingWorkerName('');
//             toast.success("Nombre de trabajador actualizado.");
//         } catch (error) {
//             toast.error("Error al editar trabajador: " + error.message);
//         }
//     };
    
//     const handleDeleteWorker = async (worker) => {
//         if (!window.confirm(`¿Seguro que quieres eliminar a ${worker.name} (#${worker.id}) de la lista maestra? Los datos históricos NO serán eliminados.`)) return;
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION, worker.docId);
//             await deleteDoc(docRef);
//             toast.info("Trabajador eliminado de la lista maestra.");
//         } catch (error) {
//             toast.error("Error al eliminar trabajador: " + error.message);
//         }
//     };

//     return (
//         <MotionCard 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5 }}
//             className="p-4 sm:p-6 mb-8 bg-green-50 border border-green-300 rounded-xl shadow-lg"
//         >
//             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-green-700 border-b-2 border-green-500 pb-2 flex items-center"><FaUsers className="mr-2"/>Gestión de Trabajadores</h2>
//             <div className="flex flex-col sm:flex-row gap-4 mb-5">
//                 <input
//                     type="text"
//                     placeholder="Nombre del nuevo trabajador"
//                     value={newWorkerName}
//                     onChange={(e) => setNewWorkerName(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddWorker()}
//                     className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                 />
//                 <button 
//                     onClick={handleAddWorker} 
//                     className="flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md sm:w-auto"
//                 >
//                     <FaUserPlus className="mr-2"/>Agregar
//                 </button>
//             </div>
//             <div className="max-h-64 overflow-y-auto border-t pt-4 border-green-200">
//                 {workers.map(worker => (
//                     <motion.div 
//                         key={worker.id} 
//                         initial={{ opacity: 0, x: -10 }} 
//                         animate={{ opacity: 1, x: 0 }} 
//                         transition={{ duration: 0.3 }}
//                         className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 mb-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-200"
//                     >
//                         {editingWorkerId === worker.id ? (
//                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-grow gap-2 w-full">
//                                 <input
//                                     type="text"
//                                     value={editingWorkerName}
//                                     onChange={(e) => setEditingWorkerName(e.target.value)}
//                                     className="p-2 border border-yellow-400 rounded-lg flex-grow"
//                                 />
//                                 <div className="flex gap-2 mt-2 sm:mt-0">
//                                     <button onClick={handleEditSave} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"><FaSave className="mr-1"/>Guardar</button>
//                                     <button onClick={() => setEditingWorkerId(null)} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-gray-500 rounded-lg hover:bg-gray-600 text-sm"><FaTimes className="mr-1"/>Cancelar</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex items-center justify-between flex-grow w-full">
//                                 <span className="font-semibold text-gray-700 text-sm sm:text-base truncate mr-4">**ID:** {worker.id} - **{worker.name}**</span>
//                                 <div className="flex gap-2 flex-shrink-0">
//                                     <button onClick={() => { setEditingWorkerId(worker.id); setEditingWorkerName(worker.name); }} className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"><FaEdit/></button>
//                                     <button onClick={() => handleDeleteWorker(worker)} className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"><FaTrashAlt/></button>
//                                 </div>
//                             </div>
//                         )}
//                     </motion.div>
//                 ))}
//             </div>
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- COMPONENTE: WorkerInputCard (Entrada de Datos) ---
// // --------------------------------------------------------

// const WorkerInputCard = ({ worker, handleTaskUpdate, handleBoxDetailChange, targetRA }) => {
//     // CORRECCIÓN: Usar el encadenamiento opcional (?.) para mayor seguridad.
//     const recoleccion = worker?.recoleccion || {}; 
//     const entutorado = worker?.entutorado || {};
//     // La inicialización de la lista de detalles debe ser robusta
//     const recolectionDetails = recoleccion?.recolectionDetails && recoleccion.recolectionDetails.length > 0 
//         ? recoleccion.recolectionDetails 
//         : [{ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() }];


//     const totalWeight = useMemo(() => calculateTotalWeight(recolectionDetails), [recolectionDetails]);
//     const RA_Recoleccion = useMemo(() => calculateRA(totalWeight, recoleccion.hours || 0, recoleccion.difficultyFactor || 1.0), [totalWeight, recoleccion.hours, recoleccion.difficultyFactor]);
//     const RA_Entutorado = useMemo(() => calculateRA(entutorado.progress || 0, entutorado.hours || 0, entutorado.difficultyFactor || 1.0), [entutorado.progress, entutorado.hours, entutorado.difficultyFactor]);
    
//     let sumRA = 0, completedTasks = 0;
//     if (RA_Recoleccion > 0) { sumRA += RA_Recoleccion; completedTasks++; }
//     if (RA_Entutorado > 0) { sumRA += RA_Entutorado; completedTasks++; }
//     const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
    
//     const raColor = RA_Global >= targetRA ? 'bg-green-500' : (RA_Global > 0.5 * targetRA ? 'bg-yellow-500' : 'bg-red-500');

//     const updateDetails = (index, field, value) => {
//         let newDetails = [...recolectionDetails];

//         if (field === 'add') {
//             // Añadir un identificador único para la key de React
//             newDetails.push({ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() }); 
//         } else if (field === 'remove') {
//             if (newDetails.length > 1) {
//                 newDetails.splice(index, 1);
//             } else {
//                 toast.error("Debe haber al menos un tipo de caja.");
//                 return;
//             }
//         } else {
//             if (newDetails[index]) {
//                 newDetails[index] = { ...newDetails[index], [field]: value };
//             }
//         }
//         handleBoxDetailChange(worker.id, newDetails);
//     };

//     return (
//         <MotionCard 
//             layout 
//             initial={{ opacity: 0, scale: 0.9 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             transition={{ duration: 0.3 }}
//             className="p-4 sm:p-5 bg-white border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
//         >
//             <h3 className="mb-4 text-lg sm:text-xl font-bold text-blue-600 border-b-2 border-blue-400 pb-2 flex justify-between items-center">
//                 <span className="truncate">{worker?.name} (# {worker?.id})</span> {/* Usar ?. por si acaso */}
//                 <div className={`px-2 py-1 text-xs sm:text-sm font-bold text-white rounded-full ${raColor} shadow-md flex-shrink-0`}>RA: {RA_Global.toFixed(2)}</div>
//             </h3>
            
//             {/* Horas Globales */}
//             <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
//                     <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-blue-500 flex-shrink-0"/>H. Rec.:</label>
//                     <input type="number" step="0.5" value={recoleccion.hours || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'hours', parseFloat(e.target.value) || 0)} 
//                             className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-blue-500" />
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
//                     <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-green-500 flex-shrink-0"/>H. Ent.:</label>
//                     <input type="number" step="0.5" value={entutorado.hours || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'hours', parseFloat(e.target.value) || 0)} 
//                             className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-green-500" />
//                 </div>
//             </div>
            
//             {/* Detalles de Recolección */}
//             <MotionCard 
//                 initial={{ opacity: 0 }} 
//                 animate={{ opacity: 1 }} 
//                 className="p-3 sm:p-4 mb-4 border border-indigo-300 rounded-lg bg-indigo-50"
//             >
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-indigo-700 flex items-center"><FaWeightHanging className="mr-2"/>Recolección ({totalWeight.toFixed(1)} kg)</h4>
                
//                 {recolectionDetails.map((detail, index) => (
//                     <motion.div 
//                         // CORRECCIÓN DE KEY: Usar el uniqueId
//                         key={detail.uniqueId || index} 
//                         layout 
//                         initial={{ opacity: 0, x: -50 }} 
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="flex items-center gap-2 mb-2 p-1 border-b border-indigo-200 text-sm"
//                     >
//                         <select
//                             value={detail.boxType}
//                             onChange={(e) => updateDetails(index, 'boxType', e.target.value)}
//                             className="flex-grow min-w-0 p-1 border rounded-lg"
//                         >
//                             {BOX_TYPES.map(type => <option key={type} value={type}>{type} ({BOX_WEIGHTS[type]}kg)</option>)}
//                         </select>
//                         <input type="number" value={detail.quantity || ''} 
//                                 onChange={(e) => updateDetails(index, 'quantity', parseInt(e.target.value) || 0)} 
//                                 className="w-12 sm:w-16 p-1 text-right border rounded-lg" />
                        
//                         {recolectionDetails.length > 1 && (
//                             <button onClick={() => updateDetails(index, 'remove')} className="p-1 text-white bg-red-500 rounded-md hover:bg-red-600 flex-shrink-0">
//                                 <FaTimes className="text-xs"/>
//                             </button>
//                         )}
//                         {/* Espaciador para la tarjeta con una sola caja */}
//                         {recolectionDetails.length === 1 && <div className="w-[20px] sm:w-[30px] flex-shrink-0"></div>}
//                     </motion.div>
//                 ))}
//                 <button onClick={() => updateDetails(null, 'add')} className="w-full py-1 mt-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 font-semibold text-sm">
//                     + Añadir Caja
//                 </button>
//             </MotionCard>
            
//             {/* Detalles de Entutorado */}
//             <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 border border-teal-300 rounded-lg bg-teal-50">
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-teal-700 flex items-center"><FaSeedling className="mr-2"/>Entutorado</h4>
//                 <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg text-sm">
//                     <label className="font-semibold text-gray-700 flex items-center">Progreso (Ud.):</label>
//                     <input type="number" value={entutorado.progress || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'progress', parseFloat(e.target.value) || 0)} 
//                             className="w-16 sm:w-20 p-1 text-right border rounded-lg focus:ring-teal-500" />
//                 </div>
//             </MotionCard>
            
//             {/* Factores Ajustables (Filas y FD) */}
//             <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 mt-4 border border-gray-300 rounded-lg bg-gray-50">
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-gray-700 flex items-center"><FaCalculator className="mr-2"/>Factores de Ajuste</h4>
//                 <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
//                     {/* Recolección */}
//                     <div className="flex justify-between items-center"><label>Filas Rec.:</label><input type="number" value={recoleccion.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     <div className="flex justify-between items-center"><label>FD Rec.:</label><input type="number" step="0.1" value={recoleccion.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     {/* Entutorado */}
//                     <div className="flex justify-between items-center"><label>Filas Ent.:</label><input type="number" value={entutorado.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     <div className="flex justify-between items-center"><label>FD Ent.:</label><input type="number" step="0.1" value={entutorado.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                 </div>
//             </MotionCard>
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- LÓGICA DE EXPORTACIÓN AVANZADA A EXCEL ---
// // --------------------------------------------------------

// const exportToExcelAdvanced = (data, selectedDate, dailySummary, targetRA, budgetMetrics) => {
//     if (Object.keys(data).length === 0) {
//         toast.error("No hay datos para exportar.");
//         return;
//     }

//     const ws_data = [];
//     const headers = [
//         "ID", "Nombre", 
//         "H. Rec.", "Peso (kg)", "FD Rec.", "RA Rec.", "Filas Rec.",
//         "H. Ent.", "Progreso (Ud.)", "FD Ent.", "RA Ent.", "Filas Ent.",
//         "RA Global", 
//         "Cajas A", "Cajas B", "Cajas C", "Cajas D", "Cajas E",
//         "Target RA", "Diferencia RA"
//     ];

//     ws_data.push(headers);

//     const targetRAValue = parseFloat(targetRA);

//     // 1. Datos por Trabajador
//     data.forEach(worker => {
//         // Usar encadenamiento opcional para evitar errores
//         const rec = worker?.recoleccion || {};
//         const ent = worker?.entutorado || {};
//         const recolectionDetails = rec.recolectionDetails || [];
//         const totalWeight = calculateTotalWeight(recolectionDetails);

//         const boxCounts = BOX_TYPES.reduce((acc, type) => {
//             const detail = recolectionDetails.find(d => d.boxType === type);
//             acc[type] = detail ? detail.quantity : 0;
//             return acc;
//         }, {});

//         const RA_Rec = calculateRA(totalWeight, rec.hours, rec.difficultyFactor);
//         const RA_Ent = calculateRA(ent.progress, ent.hours, ent.difficultyFactor);
        
//         let sumRA = 0, completedTasks = 0;
//         if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
//         if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
//         const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
//         const diffRA = RA_Global - targetRAValue;

//         ws_data.push([
//             worker.id, worker.name,
//             rec.hours || 0, totalWeight, rec.difficultyFactor || 1.0, RA_Rec.toFixed(2), rec.rows || 0,
//             ent.hours || 0, ent.progress || 0, ent.difficultyFactor || 1.0, RA_Ent.toFixed(2), ent.rows || 0,
//             RA_Global.toFixed(2),
//             boxCounts.A, boxCounts.B, boxCounts.C, boxCounts.D, boxCounts.E,
//             targetRAValue, diffRA.toFixed(2)
//         ]);
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet(ws_data);

//     // --- ANALÍTICA AVANZADA EN EXCEL (Hoja de Resumen) ---
//     const summary_data = [
//         ["RESUMEN ANALÍTICO DIARIO"],
//         ["Fecha:", selectedDate],
//         ["Target RA (Objetivo):", targetRAValue],
//         [],
//         ["MÉTRICAS CLAVE (HOY)"],
//         ["Total Trabajadores:", dailySummary.totalWorkers],
//         ["Total Horas (Recolección):", dailySummary.totalRecolectionHours.toFixed(2)],
//         ["Total Horas (Entutorado):", dailySummary.totalEntutoradoHours.toFixed(2)],
//         ["Peso Total (kg):", dailySummary.totalWeight.toFixed(2)],
//         ["RA Promedio Global:", dailySummary.avgRA.toFixed(2)],
//         ["Trabajadores por encima del Target RA:", dailySummary.aboveTargetCount],
//         [],
//         ["ANÁLISIS DE PRESUPUESTO"],
//         ["Presupuesto Horas (Objetivo):", budgetMetrics.targetHours],
//         ["Costo por Hora (€):", budgetMetrics.costPerHour],
//         ["Costo Total Esperado (€):", budgetMetrics.expectedTotalCost.toFixed(2)],
//         ["Horas Reales Trabajadas:", dailySummary.totalHours.toFixed(2)],
//         ["Desviación de Horas:", (dailySummary.totalHours - budgetMetrics.targetHours).toFixed(2)],
//         ["Costo Real (€):", (dailySummary.totalHours * budgetMetrics.costPerHour).toFixed(2)],
//     ];

//     const ws_summary = XLSX.utils.aoa_to_sheet(summary_data);

//     // --- ESTILOS AVANZADOS (XLSX-JS-STYLE) ---
//     const borderStyle = { style: "thin", color: { rgb: "000000" } };
//     const headerStyle = {
//         font: { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "007bff" } }, 
//         border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
//         alignment: { horizontal: "center", vertical: "center" }
//     };
//     const raHeaderStyle = { ...headerStyle, fill: { fgColor: { rgb: "ffc107" } }, font: { name: "Arial", sz: 11, bold: true, color: { rgb: "000000" } } }; 

//     // Aplicar estilos a la cabecera
//     headers.forEach((_, colIndex) => {
//         const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
//         if (worksheet[cellRef]) {
//             worksheet[cellRef].s = (headers[colIndex].includes("RA") || headers[colIndex] === "Peso (kg)") ? raHeaderStyle : headerStyle;
//         }
//     });

//     // Aplicar estilos a las filas de datos
//     for (let R = 1; R < ws_data.length; R++) {
//         for (let C = 0; C < headers.length; C++) {
//             const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//             if (worksheet[cellRef]) {
//                 const isRA = headers[C].includes("RA");
//                 const isDiff = headers[C] === "Diferencia RA";
                
//                 let cellStyle = { 
//                     border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
//                     alignment: { horizontal: "center" } 
//                 };

//                 if (typeof ws_data[R][C] === 'number' || (typeof ws_data[R][C] === 'string' && !isNaN(parseFloat(ws_data[R][C])))) {
//                     cellStyle.numFmt = isRA || isDiff ? "0.00" : "0";
//                 }
                
//                 if (isDiff) {
//                     const value = parseFloat(ws_data[R][C]);
//                     if (value >= 0) { 
//                         cellStyle.fill = { fgColor: { rgb: "e9f7ef" } }; 
//                         cellStyle.font = { color: { rgb: "155724" } }; 
//                     } else { 
//                         cellStyle.fill = { fgColor: { rgb: "f8d7da" } }; 
//                         cellStyle.font = { color: { rgb: "721c24" } }; 
//                     }
//                 } else if (isRA) {
//                     cellStyle.fill = { fgColor: { rgb: "fff3cd" } }; 
//                 }

//                 worksheet[cellRef].s = cellStyle;
//             }
//         }
//     }

//     // Configuración de ancho de columnas
//     worksheet['!cols'] = [
//         { wch: 5 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, 
//         { wch: 9 }, { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, 
//         { wch: 9 }, { wch: 10 }, { wch: 11 }, { wch: 7 }, { wch: 7 }, 
//         { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 10 }, { wch: 13 },
//     ];

//     // Combinar hojas y exportar
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Diarios");
//     XLSX.utils.book_append_sheet(workbook, ws_summary, "Resumen Analítico");

//     XLSX.writeFile(workbook, `Rendimiento_Diario_Analitica_${selectedDate}.xlsx`);
//     toast.success("Exportación avanzada a Excel completada.");
// };


// // --------------------------------------------------------
// // --- COMPONENTE: DailySummaryMobile (Resumen Diario) ---
// // --------------------------------------------------------

// const DailySummaryMobile = ({ dailySummary, targetRA }) => {
//     const RA_Global_Color = dailySummary.avgRA >= targetRA ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
//     const performanceIcon = dailySummary.avgRA >= targetRA ? <FaChartLine className="text-green-500 text-xl" /> : <FaRunning className="text-yellow-500 text-xl" />;
    
//     const MetricItem = ({ icon, label, value, unit, color }) => (
//         <MotionCard 
//             initial={{ opacity: 0, scale: 0.8 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             transition={{ duration: 0.3 }}
//             className={`p-3 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center`}
//         >
//             <div className={`text-xl ${color} mb-1`}>{icon}</div>
//             <p className="text-xs text-gray-500 font-medium text-center">{label}</p>
//             <p className="text-lg font-bold text-gray-800 text-center">
//                 {value}<span className="text-sm font-normal ml-1">{unit}</span>
//             </p>
//         </MotionCard>
//     );

//     return (
//         <MotionCard className="mb-6 p-4 border border-blue-400 rounded-xl bg-blue-50 shadow-lg">
//             <h2 className="text-xl font-extrabold text-blue-700 mb-4 border-b pb-2 flex items-center">
//                 {performanceIcon} <span className="ml-2">Resumen Diario</span>
//             </h2>
            
//             {/* Métrica de Rendimiento Global (Destacada) */}
//             <div className={`p-4 mb-4 rounded-lg flex justify-between items-center ${RA_Global_Color} shadow-md`}>
//                 <div>
//                     <p className="text-lg font-semibold">RA Promedio Global</p>
//                     <p className="text-xs text-gray-600">Objetivo: **{targetRA}**</p>
//                 </div>
//                 <div className="text-3xl font-extrabold">
//                     {dailySummary.avgRA.toFixed(2)}
//                 </div>
//             </div>

//             {/* Grid de Métricas Clave */}
//             <div className="grid grid-cols-2 gap-3 text-center">
//                 <MetricItem 
//                     icon={<FaUsers />} 
//                     label="Total Trabajadores" 
//                     value={dailySummary.totalWorkers} 
//                     unit="pers." 
//                     color="text-indigo-500"
//                 />
//                 <MetricItem 
//                     icon={<FaWeightHanging />} 
//                     label="Peso Total" 
//                     value={dailySummary.totalWeight.toFixed(1)} 
//                     unit="kg" 
//                     color="text-red-500"
//                 />
//                 <MetricItem 
//                     icon={<FaHourglassHalf />} 
//                     label="Horas Recolección" 
//                     value={dailySummary.totalRecolectionHours.toFixed(1)} 
//                     unit="h" 
//                     color="text-blue-500"
//                 />
//                 <MetricItem 
//                     icon={<FaSeedling />} 
//                     label="Horas Entutorado" 
//                     value={dailySummary.totalEntutoradoHours.toFixed(1)} 
//                     unit="h" 
//                     color="text-teal-500"
//                 />
//             </div>
//             <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm font-medium text-center">
//                 <FaCheckCircle className="inline mr-1 text-green-500"/> Trabajadores sobre Target: **{dailySummary.aboveTargetCount}**
//             </div>
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- COMPONENTE: BudgetAnalysisMobile (Presupuesto) ---
// // --------------------------------------------------------

// const BudgetAnalysisMobile = ({ dailySummary, budgetMetrics, setTargetHours, setCostPerHour, saveBudgetSettings, targetRA, setTargetRA, saveTargetRA }) => {
//     const deviation = dailySummary.totalHours - budgetMetrics.targetHours;
//     const deviationColor = deviation > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
//     const deviationText = deviation > 0 ? `+${deviation.toFixed(1)}h` : `${deviation.toFixed(1)}h`;
//     const deviationIcon = deviation > 0 ? <FaExclamationCircle className="mr-1"/> : <FaCheckCircle className="mr-1"/>;
//     const costReal = dailySummary.totalHours * budgetMetrics.costPerHour;

//     const BudgetItem = ({ label, value, unit, color }) => (
//         <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
//             <span className="text-sm text-gray-600 flex items-center">
//                 <span className={`w-2 h-2 rounded-full ${color} mr-2`}></span>
//                 {label}
//             </span>
//             <span className="text-sm font-semibold text-gray-800">
//                 {value} <span className="text-xs font-normal">{unit}</span>
//             </span>
//         </div>
//     );

//     return (
//         <MotionCard 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5 }}
//             className="mb-6 p-4 border border-purple-400 rounded-xl bg-purple-50 shadow-lg"
//         >
//             <h2 className="text-xl font-extrabold text-purple-700 mb-4 border-b pb-2 flex items-center">
//                 <FaMoneyBillWave className="mr-2"/> Análisis de Presupuesto
//             </h2>

//             {/* Formulario de Configuración (Compacto) */}
//             <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-purple-100 rounded-lg">
//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-purple-700 mb-1">H. Objetivo</label>
//                     <input 
//                         type="number" 
//                         step="0.5" 
//                         value={budgetMetrics.targetHours || ''} 
//                         onChange={(e) => setTargetHours(parseFloat(e.target.value) || 0)} 
//                         className="p-1 text-sm border rounded-lg focus:ring-purple-500" 
//                     />
//                 </div>
//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-purple-700 mb-1">Costo/Hora (€)</label>
//                     <input 
//                         type="number" 
//                         step="0.01" 
//                         value={budgetMetrics.costPerHour || ''} 
//                         onChange={(e) => setCostPerHour(parseFloat(e.target.value) || 0)} 
//                         className="p-1 text-sm border rounded-lg focus:ring-purple-500" 
//                     />
//                 </div>
//                 <div className="flex flex-col col-span-2">
//                     <label className="text-xs font-semibold text-purple-700 mb-1 flex items-center"><FaBullseye className="mr-1"/>Target R.A.</label>
//                     <input 
//                         type="number" 
//                         step="0.1" 
//                         value={targetRA || ''} 
//                         onChange={(e) => setTargetRA(parseFloat(e.target.value) || 0)} 
//                         className="p-1 text-sm border rounded-lg focus:ring-purple-500" 
//                     />
//                 </div>
//                 <button 
//                     onClick={() => { saveBudgetSettings(); saveTargetRA(); }} 
//                     className="col-span-2 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md flex items-center justify-center text-sm font-semibold"
//                 >
//                     <FaSave className="mr-2"/>Guardar Configuración
//                 </button>
//             </div>

//             {/* Resumen de Costos */}
//             <h3 className="text-base font-bold text-purple-700 mb-2 mt-4">Resumen Diario de Costos</h3>
//             <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <BudgetItem label="Costo Total Esperado" value={budgetMetrics.expectedTotalCost.toFixed(2)} unit="€" color="bg-gray-400" />
//                 <BudgetItem label="Horas Reales Trabajadas" value={dailySummary.totalHours.toFixed(1)} unit="h" color="bg-blue-500" />
//                 <BudgetItem label="Costo Real (Hoy)" value={costReal.toFixed(2)} unit="€" color="bg-red-500" />
//             </div>

//             {/* Desviación */}
//             <div className={`mt-4 p-3 rounded-lg text-center font-bold shadow-sm ${deviationColor}`}>
//                 {deviationIcon} Desviación de Horas: **{deviationText}**
//             </div>
//         </MotionCard>
//     );
// };


// // Componente auxiliar para la navegación
// const NavButton = ({ icon, label, currentView, target, setView }) => {
//     const isActive = currentView === target;
//     const baseClasses = "flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-lg transition min-w-[120px] font-medium";
//     const activeClasses = "bg-indigo-600 text-white shadow-lg";
//     const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

//     return (
//         <button 
//             onClick={() => setView(target)} 
//             className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
//         >
//             {icon} <span className="ml-1 hidden sm:inline">{label}</span>
//         </button>
//     );
// };

// // --------------------------------------------------------
// // --- COMPONENTE PRINCIPAL: AppRendimiento ---
// // --------------------------------------------------------

// const AppRendimiento = () => {
//     // --- ESTADOS PRINCIPALES ---
//     const [workers, setWorkers] = useState([]); 
//     const [nextWorkerId, setNextWorkerId] = useState(initialWorkerId);
//     const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//     const [workerData, setWorkerData] = useState({}); 
//     const [budgetMetrics, setBudgetMetrics] = useState({ targetHours: 0, costPerHour: 0, expectedTotalCost: 0 });
//     const [targetRA, setTargetRA] = useState(0); 
//     const [view, setView] = useState('input'); 


//     // --------------------------------------
//     // --- LÓGICA DE FIREBASE (CARGA INICIAL Y BUDGET) ---
//     // --------------------------------------

//     // Carga inicial del Target RA y Budget
//     useEffect(() => {
//         const budgetDocRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
//         const unsubscribe = onSnapshot(budgetDocRef, (docSnap) => {
//             if (docSnap.exists()) {
//                 const data = docSnap.data();
//                 setBudgetMetrics({
//                     targetHours: data.targetHours || 0,
//                     costPerHour: data.costPerHour || 0,
//                     expectedTotalCost: (data.targetHours || 0) * (data.costPerHour || 0),
//                 });
//                 setTargetRA(data.targetRA || 0); 
//             } else {
//                 setBudgetMetrics({ targetHours: 0, costPerHour: 0, expectedTotalCost: 0 });
//                 setTargetRA(0);
//             }
//         }, (error) => {
//             toast.error("Error al cargar configuración de presupuesto: " + error.message);
//         });
//         return unsubscribe;
//     }, []);
    
//     // Función para guardar Budget 
//     const saveBudgetSettings = useCallback(async () => {
//         try {
//             const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
//             await setDoc(docRef, { 
//                 targetHours: budgetMetrics.targetHours, 
//                 costPerHour: budgetMetrics.costPerHour,
//                 expectedTotalCost: budgetMetrics.targetHours * budgetMetrics.costPerHour,
//                 targetRA: targetRA,
//                 updatedAt: serverTimestamp() 
//             }, { merge: true });
//             toast.success("Configuración de presupuesto guardada.");
//         } catch (error) {
//             toast.error("Error al guardar presupuesto: " + error.message);
//         }
//     }, [budgetMetrics, targetRA]);
    
//     // Función para guardar Target RA
//     const saveTargetRA = useCallback(async () => {
//         try {
//             const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
//             await updateDoc(docRef, { targetRA: targetRA, updatedAt: serverTimestamp() });
//             toast.success("Target RA guardado.");
//         } catch (error) {
//             toast.error("Error al guardar Target RA: " + error.message);
//         }
//     }, [targetRA]);


//     // Carga de Datos Diarios para la fecha seleccionada
//     useEffect(() => {
//         if (!selectedDate) return;

//         const dailyDocRef = doc(db, COLLECTION_NAME, selectedDate);
//         const unsubscribe = onSnapshot(dailyDocRef, (docSnap) => {
//             const savedData = docSnap.exists() ? docSnap.data().data || {} : {};
            
//             // CORRECCIÓN CLAVE: Garantizar que todos los trabajadores de la lista maestra
//             // tengan una estructura de datos válida, incluso si no tienen datos guardados.
//             const mergedData = workers.reduce((acc, worker) => {
//                 const savedWorkerData = savedData[worker.id];
                
//                 // Si hay datos guardados, úsalos y fusiónalos con la estructura vacía,
//                 // asegurando que 'recoleccion' y 'entutorado' existen y tienen la estructura de la función emptyTaskData
//                 if (savedWorkerData) {
//                     acc[worker.id] = { 
//                         ...emptyTaskData(),
//                         ...savedWorkerData, 
//                         name: worker.name, // Asegurar que el nombre es de la lista maestra
//                         recoleccion: { 
//                             ...emptyTaskData().recoleccion, 
//                             ...savedWorkerData.recoleccion,
//                             // Si recolectionDetails está vacío en DB, inicializar con uno por defecto
//                             recolelectionDetails: savedWorkerData.recoleccion?.recolectionDetails && savedWorkerData.recoleccion.recolectionDetails.length > 0
//                                 ? savedWorkerData.recoleccion.recolectionDetails
//                                 : emptyTaskData().recoleccion.recolectionDetails
//                         },
//                         entutorado: { 
//                             ...emptyTaskData().entutorado, 
//                             ...savedWorkerData.entutorado 
//                         },
//                     };
//                 } else {
//                     // Si no hay datos guardados, usar la estructura vacía
//                     acc[worker.id] = { 
//                         ...emptyTaskData(), 
//                         name: worker.name
//                     };
//                 }
//                 return acc;
//             }, {});

//             setWorkerData(mergedData);
//         }, (error) => {
//             toast.error("Error al cargar datos diarios: " + error.message);
//         });
        
//         // Si la lista de trabajadores cambia, se ejecuta este useEffect, 
//         // y necesitamos limpiar el listener si la fecha es la misma pero workers cambió.
//         // Pero, para la primera carga, si workers está vacío, no subscribimos
//         // y en el `workers.useEffect` se actualizará el estado `workers` y se volverá a ejecutar este efecto.
//         return unsubscribe;

//     }, [selectedDate, workers]); // Depende de la fecha y la lista de trabajadores
    
//     // --------------------------------------
//     // --- HANDLERS DE ESTADO Y FIREBASE (DATOS DIARIOS) ---
//     // --------------------------------------

//     /**
//      * Actualiza un campo específico de una tarea para un trabajador.
//      */
//     const handleTaskUpdate = (workerId, taskType, field, value) => {
//         setWorkerData(prevData => ({
//             ...prevData,
//             [workerId]: {
//                 ...prevData[workerId],
//                 [taskType]: {
//                     ...prevData[workerId][taskType],
//                     [field]: value
//                 }
//             }
//         }));
//     };

//     /**
//      * Actualiza los detalles de cajas de recolección (para la lista dinámica de cajas).
//      */
//     const handleBoxDetailChange = (workerId, newDetails) => {
//         setWorkerData(prevData => ({
//             ...prevData,
//             [workerId]: {
//                 ...prevData[workerId],
//                 recoleccion: {
//                     ...prevData[workerId].recoleccion,
//                     recolectionDetails: newDetails
//                 }
//             }
//         }));
//     };

//     /**
//      * Guarda la información de todos los trabajadores para el día seleccionado
//      */
//     const handleSaveDay = async () => {
//         try {
//             const dailyDocRef = doc(db, COLLECTION_NAME, selectedDate);
            
//             // Prepara los datos eliminando los nombres (que vienen de la lista maestra)
//             const dataToSave = Object.keys(workerData).reduce((acc, key) => {
//                 const { name, ...rest } = workerData[key];
//                 // Solo guarda datos si hay horas o progreso registrado
//                 const totalWeight = calculateTotalWeight(rest.recoleccion.recolectionDetails);
//                 if (rest.recoleccion.hours > 0 || rest.entutorado.hours > 0 || totalWeight > 0 || rest.entutorado.progress > 0) {
//                      acc[key] = rest;
//                 }
//                 return acc;
//             }, {});

//             if (Object.keys(dataToSave).length === 0) {
//                 // Si el documento existe, podemos optar por eliminarlo, pero por seguridad, solo advertimos
//                 toast.error("No hay datos significativos para guardar. No se ha escrito en la DB.");
//                 return;
//             }

//             await setDoc(dailyDocRef, { 
//                 date: selectedDate, 
//                 data: dataToSave, 
//                 timestamp: serverTimestamp() 
//             }, { merge: true });
            
//             toast.success(`Datos del día ${selectedDate} guardados exitosamente.`);
//         } catch (error) {
//             toast.error("Error al guardar datos diarios: " + error.message);
//         }
//     };
    
//     // --------------------------------------
//     // --- CÁLCULOS Y RESUMEN (useMemo) ---
//     // --------------------------------------

//     const dailySummary = useMemo(() => {
//         const workersArray = Object.values(workerData).filter(w => w.name); 
        
//         let totalRecolectionHours = 0;
//         let totalEntutoradoHours = 0;
//         let totalWeight = 0;
//         let totalRA = 0;
//         let completedWorkersCount = 0;
//         let aboveTargetCount = 0;

//         workersArray.forEach(worker => {
//             // Usar encadenamiento opcional para evitar errores
//             const rec = worker?.recoleccion || {};
//             const ent = worker?.entutorado || {};
            
//             // Horas
//             totalRecolectionHours += rec.hours || 0;
//             totalEntutoradoHours += ent.hours || 0;

//             // Peso Recolección
//             const weight = calculateTotalWeight(rec.recolectionDetails || []);
//             totalWeight += weight;

//             // Cálculo de RA
//             const RA_Rec = calculateRA(weight, rec.hours, rec.difficultyFactor);
//             const RA_Ent = calculateRA(ent.progress, ent.hours, ent.difficultyFactor);
            
//             let sumRA = 0;
//             let tasksCount = 0;
//             if (RA_Rec > 0) { sumRA += RA_Rec; tasksCount++; }
//             if (RA_Ent > 0) { sumRA += RA_Ent; tasksCount++; }
            
//             if (tasksCount > 0) {
//                 const RA_Global = sumRA / tasksCount;
//                 totalRA += RA_Global;
//                 completedWorkersCount++;
//                 if (RA_Global >= targetRA) {
//                     aboveTargetCount++;
//                 }
//             }
//         });
        
//         const totalHours = totalRecolectionHours + totalEntutoradoHours;
//         const avgRA = completedWorkersCount > 0 ? totalRA / completedWorkersCount : 0;

//         return {
//             totalWorkers: workersArray.length,
//             totalRecolectionHours,
//             totalEntutoradoHours,
//             totalHours,
//             totalWeight,
//             avgRA,
//             aboveTargetCount,
//             completedWorkersCount,
//         };
//     }, [workerData, targetRA]);

//     // --------------------------------------
//     // --- RENDERIZADO PRINCIPAL ---
//     // --------------------------------------

//     const renderView = () => {
//         // workersArray ahora se construye aquí para renderizar, filtrando por nombre para seguridad
//         const workersArray = workers.map(w => ({...w, ...workerData[w.id]})).filter(w => w.name);

//         switch (view) {
//             case 'workers':
//                 return (
//                     <WorkerManagement 
//                         workers={workers} 
//                         setWorkers={setWorkers} 
//                         nextWorkerId={nextWorkerId} 
//                         setNextWorkerId={setNextWorkerId} 
//                     />
//                 );
//             case 'budget':
//                 return (
//                     <BudgetAnalysisMobile 
//                         dailySummary={dailySummary}
//                         budgetMetrics={budgetMetrics}
//                         setTargetHours={(h) => setBudgetMetrics(prev => ({ ...prev, targetHours: h, expectedTotalCost: h * prev.costPerHour }))}
//                         setCostPerHour={(c) => setBudgetMetrics(prev => ({ ...prev, costPerHour: c, expectedTotalCost: prev.targetHours * c }))}
//                         saveBudgetSettings={saveBudgetSettings}
//                         targetRA={targetRA}
//                         setTargetRA={setTargetRA}
//                         saveTargetRA={saveTargetRA}
//                     />
//                 );
//             case 'summary':
//                 return <DailySummaryMobile dailySummary={dailySummary} targetRA={targetRA} />;
//             case 'input':
//             default:
//                 if (workersArray.length === 0) {
//                     return (
//                         <div className="text-center p-10 bg-white rounded-xl shadow-lg">
//                             <h3 className="text-xl font-semibold text-red-500 mb-4">No hay trabajadores registrados</h3>
//                             <p className="text-gray-600">Por favor, ve a **Gestión Trabajadores** para agregar personal a la lista maestra.</p>
//                             <button onClick={() => setView('workers')} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">Ir a Gestión</button>
//                         </div>
//                     );
//                 }
//                 return (
//                     <MotionCard 
//                         initial={{ opacity: 0, scale: 0.95 }} 
//                         animate={{ opacity: 1, scale: 1 }} 
//                         transition={{ duration: 0.5 }}
//                         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                     >
//                         {workersArray.map(worker => (
//                             <WorkerInputCard 
//                                 key={worker.id} 
//                                 worker={worker} // Pasar el objeto worker ya mezclado
//                                 handleTaskUpdate={handleTaskUpdate}
//                                 handleBoxDetailChange={handleBoxDetailChange}
//                                 targetRA={targetRA}
//                             />
//                         ))}
//                     </MotionCard>
//                 );
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//             <Toaster position="top-right"/>

//             {/* Encabezado y Selector de Fecha */}
//             <header className="mb-6 bg-white p-4 rounded-xl shadow-lg border-t-4 border-indigo-500">
//                 <h1 className="text-2xl font-extrabold text-gray-900 flex items-center mb-3">
//                     <FaChartLine className="mr-3 text-indigo-600"/> Dashboard de Rendimiento
//                 </h1>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                     <div className="flex items-center">
//                         <label htmlFor="date-selector" className="font-semibold text-gray-700 mr-2 flex items-center"><FaCalendarAlt className="mr-1 text-indigo-400"/> Fecha:</label>
//                         <input
//                             id="date-selector"
//                             type="date"
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                             className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
                    
//                     <button 
//                         onClick={handleSaveDay} 
//                         className="flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md w-full sm:w-auto font-semibold"
//                     >
//                         <FaSave className="mr-2"/>Guardar Datos del Día
//                     </button>
//                 </div>
//             </header>
            
//             {/* Barra de Navegación/Control */}
//             <nav className="mb-6 p-3 bg-white rounded-xl shadow-lg flex flex-wrap justify-between gap-2 sm:gap-4">
//                 <NavButton icon={<FaHourglassHalf/>} label="Entrada de Datos" currentView={view} target="input" setView={setView} />
//                 <NavButton icon={<FaChartLine/>} label="Resumen Diario" currentView={view} target="summary" setView={setView} />
//                 <NavButton icon={<FaUsers/>} label="Gestión Trabajadores" currentView={view} target="workers" setView={setView} />
//                 <NavButton icon={<FaMoneyBillWave/>} label="Presupuesto/Target" currentView={view} target="budget" setView={setView} />
//                 <button 
//                     onClick={() => exportToExcelAdvanced(Object.values(workerData).filter(w => w.name), selectedDate, dailySummary, targetRA, budgetMetrics)} 
//                     className="flex items-center justify-center flex-1 px-3 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition min-w-[120px]"
//                 >
//                     <FaFileExcel className="mr-1"/> Exportar Excel
//                 </button>
//             </nav>

//             {/* Contenido Dinámico de la Vista */}
//             <main className="mb-8">
//                 {renderView()}
//             </main>
//         </div>
//     );
// };

// export default AppRendimiento;














import React, { 
    useState, useEffect, useCallback, useMemo 
} from "react";
import { 
    FaFileExcel, FaChartLine, FaUserPlus, FaEdit, FaTrashAlt, FaSave, FaTimes, 
    FaRunning, FaSeedling, FaWeightHanging, FaHourglassHalf, FaCalculator, 
    FaUsers, FaCalendarAlt, FaMoneyBillWave, FaClock, FaCheckCircle, 
    FaExclamationCircle, FaHistory, FaBullseye, FaSignInAlt, FaSignOutAlt,
    FaUser
} from "react-icons/fa";
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
                                <span className="font-semibold text-gray-700 text-sm sm:text-base truncate mr-4">**ID:** {worker.id} - **{worker.name}**</span>
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
                );
            case 'summary':
                return <DailySummaryMobile dailySummary={dailySummary} targetRA={targetRA} />;
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
                        <NavButton icon={<FaHourglassHalf/>} label="Entrada de Datos" currentView={view} target="input" setView={setView} />
                        <NavButton icon={<FaChartLine/>} label="Resumen Diario" currentView={view} target="summary" setView={setView} />
                        <NavButton icon={<FaUsers/>} label="Gestión Trabajadores" currentView={view} target="workers" setView={setView} />
                        <NavButton icon={<FaMoneyBillWave/>} label="Presupuesto/Target" currentView={view} target="budget" setView={setView} />
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






















// import React, { 
//     useState, useEffect, useCallback, useMemo 
// } from "react";
// import { 
//     FaFileExcel, FaChartLine, FaUserPlus, FaEdit, FaTrashAlt, FaSave, FaTimes, 
//     FaRunning, FaSeedling, FaWeightHanging, FaHourglassHalf, FaCalculator, 
//     FaUsers, FaCalendarAlt, FaMoneyBillWave, FaClock, FaCheckCircle, 
//     FaExclamationCircle, FaHistory, FaBullseye, FaSignInAlt, FaSignOutAlt,
//     FaUser, FaFilter, FaChartBar, FaCalendarDay, FaChartArea,
//     FaExclamationTriangle,
//     FaGlobe,
//     FaCheckDouble
// } from "react-icons/fa";
// import {
//     initializeApp
// } from "firebase/app";
// import { 
//     getAuth, 
//     onAuthStateChanged, 
//     signInWithEmailAndPassword, 
//     signOut, 
//     createUserWithEmailAndPassword 
// } from "firebase/auth"; // IMPORTS DE AUTH
// import {
//     getFirestore,
//     doc,
//     setDoc,
//     onSnapshot,
//     updateDoc,
//     deleteDoc,
//     collection,
//     query,
//     orderBy,
//     getDocs,
//     where,
//     serverTimestamp,
// } from "firebase/firestore";
// import { toast, Toaster } from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import * as XLSX from 'xlsx-js-style';

// // Asumiendo que esta configuración está en su ruta correcta
// import { firebaseConfig } from "../../firebaseConfig"; 

// // --------------------------------------------------------
// // --- CONFIGURACIÓN Y UTILIDADES GLOBALES ---
// // --------------------------------------------------------

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // Inicializar Auth
// const db = getFirestore(app);
// const COLLECTION_NAME = "rendimientoDiario";
// const WORKERS_COLLECTION = "workersMasterList";
// const BUDGET_COLLECTION = "appSettings";
// const BUDGET_DOC_ID = "budgetSettings"; 

// const initialWorkerId = 1;
// const BOX_WEIGHTS = {
//     A: 10, B: 5, C: 8, D: 12, E: 15,
// };
// const BOX_TYPES = Object.keys(BOX_WEIGHTS);

// const emptyTaskData = () => ({
//     recoleccion: { recolectionDetails: [{ boxType: 'A', quantity: 0, uniqueId: Date.now() + Math.random() }], hours: 0, difficultyFactor: 1.0, rows: 0 },
//     entutorado: { progress: 0, hours: 0, difficultyFactor: 1.0, rows: 0 },
// });

// const calculateTotalWeight = (details) => {
//     if (!details || details.length === 0) return 0;
//     return details.reduce((total, detail) => {
//         const weight = BOX_WEIGHTS[detail.boxType] || 0;
//         return total + (detail.quantity || 0) * weight;
//     }, 0);
// };

// const calculateRA = (production, hours, fd) => {
//     if (hours <= 0 || production <= 0) return 0;
//     const factor = fd > 0 ? fd : 1.0;
//     return (production * factor) / hours;
// };

// const formatDate = (date) => {
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// };

// const MotionCard = motion.div;

// // --------------------------------------------------------
// // --- COMPONENTE: WorkerManagement (Gestión de Trabajadores) ---
// // --------------------------------------------------------

// const WorkerManagement = ({ workers, setWorkers, nextWorkerId, setNextWorkerId, userId }) => { // RECIBE userId
//     const [newWorkerName, setNewWorkerName] = useState('');
//     const [editingWorkerId, setEditingWorkerId] = useState(null);
//     const [editingWorkerName, setEditingWorkerName] = useState('');
//     const workersRef = collection(db, WORKERS_COLLECTION);
    
//     // Carga inicial de trabajadores (FILTRADO POR userId)
//     useEffect(() => {
//         if (!userId) return; // NO CARGAR TRABAJADORES SI NO HAY USUARIO
        
//         // Consulta para obtener SOLO los trabajadores del usuario actual
//         const q = query(workersRef, where("userId", "==", userId), orderBy("id", "asc"));

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const workerList = [];
//             let maxId = initialWorkerId - 1;
//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 if (data.userId === userId) { 
//                     workerList.push({ id: data.id, name: data.name, docId: doc.id });
//                     if (data.id > maxId) maxId = data.id;
//                 }
//             });
//             setWorkers(workerList.sort((a, b) => a.id - b.id));
//             setNextWorkerId(maxId + 1);
//         }, (error) => {
//             toast.error("Error al cargar lista maestra de trabajadores: " + error.message);
//         });
//         return unsubscribe;
//     }, [setWorkers, setNextWorkerId, userId]); // DEPENDENCIA: userId

//     const handleAddWorker = async () => {
//         if (!userId) return toast.error("Error: Usuario no autenticado.");
//         if (!newWorkerName.trim()) return toast.error("El nombre no puede estar vacío.");
//         const workerId = nextWorkerId;
        
//         // AÑADIR userId al documento
//         const newWorker = { id: workerId, name: newWorkerName.trim(), userId: userId };
        
//         try {
//             const docRef = doc(workersRef);
//             await setDoc(docRef, { ...newWorker, docId: docRef.id });
//             setNextWorkerId(prev => prev + 1);
//             setNewWorkerName('');
//             toast.success(`Trabajador ${newWorker.name} (#${workerId}) agregado exitosamente.`);
//         } catch (error) {
//             toast.error("Error al agregar trabajador: " + error.message);
//         }
//     };

//     const handleEditSave = async () => {
//         if (!editingWorkerId || !editingWorkerName.trim()) return;
//         const workerToUpdate = workers.find(w => w.id === editingWorkerId);
//         if (!workerToUpdate) return;
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION, workerToUpdate.docId);
//             await updateDoc(docRef, { name: editingWorkerName.trim() });
//             setEditingWorkerId(null);
//             setEditingWorkerName('');
//             toast.success("Nombre de trabajador actualizado.");
//         } catch (error) {
//             toast.error("Error al editar trabajador: " + error.message);
//         }
//     };
    


//    const handleDeleteWorker = async (worker) => {
//         if (!window.confirm(`¿Seguro que quieres eliminar a ${worker.name} (#${worker.id}) de la lista maestra? Los datos históricos NO serán eliminados.`)) return;
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION, worker.docId);
//             await deleteDoc(docRef);
            
//             // CORRECCIÓN: Usamos toast.success para un estilo más visible (verde)
//             toast.success("Trabajador eliminado de la lista maestra."); 
            
//         } catch (error) {
//             toast.error("Error al eliminar trabajador: " + error.message);
//         }
//     };

//     return (
//         <MotionCard 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5 }}
//             className="p-4 sm:p-6 mb-8 bg-green-50 border border-green-300 rounded-xl shadow-lg"
//         >
//             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-green-700 border-b-2 border-green-500 pb-2 flex items-center"><FaUsers className="mr-2"/>Gestión de Trabajadores</h2>
//             <div className="flex flex-col sm:flex-row gap-4 mb-5">
//                 <input
//                     type="text"
//                     placeholder="Nombre del nuevo trabajador"
//                     value={newWorkerName}
//                     onChange={(e) => setNewWorkerName(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddWorker()}
//                     className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                 />
//                 <button 
//                     onClick={handleAddWorker} 
//                     className="flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md sm:w-auto"
//                 >
//                     <FaUserPlus className="mr-2"/>Agregar
//                 </button>
//             </div>
//             <div className="max-h-64 overflow-y-auto border-t pt-4 border-green-200">
//                 {workers.map(worker => (
//                     <motion.div 
//                         key={worker.id} 
//                         initial={{ opacity: 0, x: -10 }} 
//                         animate={{ opacity: 1, x: 0 }} 
//                         transition={{ duration: 0.3 }}
//                         className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 mb-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-200"
//                     >
//                         {editingWorkerId === worker.id ? (
//                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-grow gap-2 w-full">
//                                 <input
//                                     type="text"
//                                     value={editingWorkerName}
//                                     onChange={(e) => setEditingWorkerName(e.target.value)}
//                                     className="p-2 border border-yellow-400 rounded-lg flex-grow"
//                                 />
//                                 <div className="flex gap-2 mt-2 sm:mt-0">
//                                     <button onClick={handleEditSave} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm"><FaSave className="mr-1"/>Guardar</button>
//                                     <button onClick={() => setEditingWorkerId(null)} className="flex items-center justify-center flex-1 px-3 py-1 text-white bg-gray-500 rounded-lg hover:bg-gray-600 text-sm"><FaTimes className="mr-1"/>Cancelar</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex items-center justify-between flex-grow w-full">
//                                 <span className="font-semibold text-gray-700 text-sm sm:text-base truncate mr-4">**ID:** {worker.id} - **{worker.name}**</span>
//                                 <div className="flex gap-2 flex-shrink-0">
//                                     <button onClick={() => { setEditingWorkerId(worker.id); setEditingWorkerName(worker.name); }} className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"><FaEdit/></button>
//                                     <button onClick={() => handleDeleteWorker(worker)} className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"><FaTrashAlt/></button>
//                                 </div>
//                             </div>
//                         )}
//                     </motion.div>
//                 ))}
//             </div>
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- COMPONENTE: WorkerInputCard (Entrada de Datos) ---
// // --------------------------------------------------------

// const WorkerInputCard = ({ worker, handleTaskUpdate, handleBoxDetailChange, targetRA }) => {
//     const recoleccion = worker?.recoleccion || {}; 
//     const entutorado = worker?.entutorado || {};
    
//     const recolectionDetails = recoleccion?.recolectionDetails && recoleccion.recolectionDetails.length > 0 
//         ? recoleccion.recolectionDetails 
//         : [{ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() }];
    
//     const totalWeight = useMemo(() => calculateTotalWeight(recolectionDetails), [recolectionDetails]);
//     const RA_Recoleccion = useMemo(() => calculateRA(totalWeight, recoleccion.hours || 0, recoleccion.difficultyFactor || 1.0), [totalWeight, recoleccion.hours, recoleccion.difficultyFactor]);
//     const RA_Entutorado = useMemo(() => calculateRA(entutorado.progress || 0, entutorado.hours || 0, entutorado.difficultyFactor || 1.0), [entutorado.progress, entutorado.hours, entutorado.difficultyFactor]);
    
//     let sumRA = 0, completedTasks = 0;
//     if (RA_Recoleccion > 0) { sumRA += RA_Recoleccion; completedTasks++; }
//     if (RA_Entutorado > 0) { sumRA += RA_Entutorado; completedTasks++; }
    
//     const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
//     const raColor = RA_Global >= targetRA ? 'bg-green-500' : (RA_Global > 0.5 * targetRA ? 'bg-yellow-500' : 'bg-red-500');

//     const updateDetails = (index, field, value) => {
//         let newDetails = [...recolectionDetails];
//         if (field === 'add') {
//             newDetails.push({ boxType: BOX_TYPES[0], quantity: 0, uniqueId: Date.now() + Math.random() });
//         } else if (field === 'remove') {
//             if (newDetails.length > 1) {
//                 newDetails.splice(index, 1);
//             } else {
//                 toast.error("Debe haber al menos un tipo de caja.");
//                 return;
//             }
//         } else {
//             if (newDetails[index]) {
//                 newDetails[index] = { ...newDetails[index], [field]: value };
//             }
//         }
//         handleBoxDetailChange(worker.id, newDetails);
//     };

//     return (
//         <MotionCard 
//             layout 
//             initial={{ opacity: 0, scale: 0.9 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             transition={{ duration: 0.3 }}
//             className="p-4 sm:p-5 bg-white border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
//         >
//             <h3 className="mb-4 text-lg sm:text-xl font-bold text-blue-600 border-b-2 border-blue-400 pb-2 flex justify-between items-center">
//                 <span className="truncate">{worker?.name} (# {worker?.id})</span>
//                 <div className={`px-2 py-1 text-xs sm:text-sm font-bold text-white rounded-full ${raColor} shadow-md flex-shrink-0`}>RA: {RA_Global.toFixed(2)}</div>
//             </h3>
            
//             {/* Horas Globales */}
//             <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
//                     <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-blue-500 flex-shrink-0"/>H. Rec.:</label>
//                     <input type="number" step="0.5" value={recoleccion.hours || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'hours', parseFloat(e.target.value) || 0)} 
//                             className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-blue-500" />
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border border-gray-200 rounded-lg">
//                     <label className="font-semibold text-gray-700 flex items-center mb-1 sm:mb-0"><FaHourglassHalf className="mr-1 text-green-500 flex-shrink-0"/>H. Ent.:</label>
//                     <input type="number" step="0.5" value={entutorado.hours || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'hours', parseFloat(e.target.value) || 0)} 
//                             className="w-full sm:w-16 p-1 text-right border rounded-lg focus:ring-green-500" />
//                 </div>
//             </div>
            
//             {/* Detalles de Recolección */}
//             <MotionCard 
//                 initial={{ opacity: 0 }} 
//                 animate={{ opacity: 1 }} 
//                 className="p-3 sm:p-4 mb-4 border border-indigo-300 rounded-lg bg-indigo-50"
//             >
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-indigo-700 flex items-center"><FaWeightHanging className="mr-2"/>Recolección ({totalWeight.toFixed(1)} kg)</h4>
                
//                 {recolectionDetails.map((detail, index) => (
//                     <motion.div 
//                         key={detail.uniqueId || index} 
//                         layout 
//                         initial={{ opacity: 0, x: -50 }} 
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="flex items-center gap-2 mb-2 p-1 border-b border-indigo-200 text-sm"
//                     >
//                         <select
//                             value={detail.boxType}
//                             onChange={(e) => updateDetails(index, 'boxType', e.target.value)}
//                             className="flex-grow min-w-0 p-1 border rounded-lg"
//                         >
//                             {BOX_TYPES.map(type => <option key={type} value={type}>{type} ({BOX_WEIGHTS[type]}kg)</option>)}
//                         </select>
//                         <input type="number" value={detail.quantity || ''} 
//                                 onChange={(e) => updateDetails(index, 'quantity', parseInt(e.target.value) || 0)} 
//                                 className="w-12 sm:w-16 p-1 text-right border rounded-lg" />
                        
//                         {recolectionDetails.length > 1 && (
//                             <button onClick={() => updateDetails(index, 'remove')} className="p-1 text-white bg-red-500 rounded-md hover:bg-red-600 flex-shrink-0">
//                                 <FaTimes className="text-xs"/>
//                             </button>
//                         )}
//                         {/* Espaciador para la tarjeta con una sola caja */}
//                         {recolectionDetails.length === 1 && <div className="w-[20px] sm:w-[30px] flex-shrink-0"></div>}
//                     </motion.div>
//                 ))}
//                 <button onClick={() => updateDetails(null, 'add')} className="w-full py-1 mt-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 font-semibold text-sm">
//                     + Añadir Caja
//                 </button>
//             </MotionCard>
            
//             {/* Detalles de Entutorado */}
//             <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 border border-teal-300 rounded-lg bg-teal-50">
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-teal-700 flex items-center"><FaSeedling className="mr-2"/>Entutorado</h4>
//                 <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg text-sm">
//                     <label className="font-semibold text-gray-700 flex items-center">Progreso (Ud.):</label>
//                     <input type="number" value={entutorado.progress || ''} 
//                             onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'progress', parseFloat(e.target.value) || 0)} 
//                             className="w-16 sm:w-20 p-1 text-right border rounded-lg focus:ring-teal-500" />
//                 </div>
//             </MotionCard>
            
//             {/* Factores Ajustables (Filas y FD) */}
//             <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 sm:p-4 mt-4 border border-gray-300 rounded-lg bg-gray-50">
//                 <h4 className="mb-3 text-base sm:text-lg font-bold text-gray-700 flex items-center"><FaCalculator className="mr-2"/>Factores de Ajuste</h4>
//                 <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
//                     {/* Recolección */}
//                     <div className="flex justify-between items-center"><label>Filas Rec.:</label><input type="number" value={recoleccion.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     <div className="flex justify-between items-center"><label>FD Rec.:</label><input type="number" step="0.1" value={recoleccion.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'recoleccion', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     {/* Entutorado */}
//                     <div className="flex justify-between items-center"><label>Filas Ent.:</label><input type="number" value={entutorado.rows || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'rows', parseFloat(e.target.value) || 0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                     <div className="flex justify-between items-center"><label>FD Ent.:</label><input type="number" step="0.1" value={entutorado.difficultyFactor || ''} onChange={(e) => handleTaskUpdate(worker.id, 'entutorado', 'difficultyFactor', parseFloat(e.target.value) || 1.0)} className="w-12 sm:w-16 p-1 text-right border rounded-lg" /></div>
//                 </div>
//             </MotionCard>
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- LÓGICA DE EXPORTACIÓN AVANZADA A EXCEL ---
// // --------------------------------------------------------

// const exportToExcelAdvanced = (data, selectedDate, dailySummary, targetRA, budgetMetrics) => {
//     if (Object.keys(data).length === 0) {
//         toast.error("No hay datos para exportar.");
//         return;
//     }

//     const ws_data = [];
//     const headers = [
//         "ID", "Nombre", 
//         "H. Rec.", "Peso (kg)", "FD Rec.", "RA Rec.", "Filas Rec.",
//         "H. Ent.", "Progreso (Ud.)", "FD Ent.", "RA Ent.", "Filas Ent.",
//         "RA Global", 
//         "Cajas A", "Cajas B", "Cajas C", "Cajas D", "Cajas E",
//         "Target RA", "Diferencia RA"
//     ];
//     ws_data.push(headers);

//     const targetRAValue = parseFloat(targetRA);

//     // 1. Datos por Trabajador
//     data.forEach(worker => {
//         // Usar encadenamiento opcional para evitar errores
//         const rec = worker?.recoleccion || {};
//         const ent = worker?.entutorado || {};
//         const recolectionDetails = rec.recolectionDetails || [];
//         const totalWeight = calculateTotalWeight(recolectionDetails);

//         const boxCounts = BOX_TYPES.reduce((acc, type) => {
//             const detail = recolectionDetails.find(d => d.boxType === type);
//             acc[type] = detail ? detail.quantity : 0;
//             return acc;
//         }, {});

//         const RA_Rec = calculateRA(totalWeight, rec.hours, rec.difficultyFactor);
//         const RA_Ent = calculateRA(ent.progress, ent.hours, ent.difficultyFactor);
        
//         let sumRA = 0, completedTasks = 0;
//         if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
//         if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
//         const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
//         const diffRA = RA_Global - targetRAValue;

//         ws_data.push([
//             worker.id, worker.name,
//             rec.hours || 0, totalWeight, rec.difficultyFactor || 1.0, RA_Rec.toFixed(2), rec.rows || 0,
//             ent.hours || 0, ent.progress || 0, ent.difficultyFactor || 1.0, RA_Ent.toFixed(2), ent.rows || 0,
//             RA_Global.toFixed(2),
//             boxCounts.A, boxCounts.B, boxCounts.C, boxCounts.D, boxCounts.E,
//             targetRAValue, diffRA.toFixed(2)
//         ]);
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
    
//     // --- ANALÍTICA AVANZADA EN EXCEL (Hoja de Resumen) ---
//     const summary_data = [
//         ["RESUMEN ANALÍTICO DIARIO"],
//         ["Fecha:", selectedDate],
//         ["Target RA (Objetivo):", targetRAValue],
//         [],
//         ["MÉTRICAS CLAVE (HOY)"],
//         ["Total Trabajadores:", dailySummary.totalWorkers],
//         ["Total Horas (Recolección):", dailySummary.totalRecolectionHours.toFixed(2)],
//         ["Total Horas (Entutorado):", dailySummary.totalEntutoradoHours.toFixed(2)],
//         ["Peso Total (kg):", dailySummary.totalWeight.toFixed(2)],
//         ["RA Promedio Global:", dailySummary.avgRA.toFixed(2)],
//         ["Trabajadores por encima del Target RA:", dailySummary.aboveTargetCount],
//         [],
//         ["ANÁLISIS DE PRESUPUESTO"],
//         ["Presupuesto Horas (Objetivo):", budgetMetrics.targetHours],
//         ["Costo por Hora (€):", budgetMetrics.costPerHour],
//         ["Costo Total Esperado (€):", budgetMetrics.expectedTotalCost.toFixed(2)],
//         ["Horas Reales Trabajadas:", dailySummary.totalHours.toFixed(2)],
//         ["Desviación de Horas:", (dailySummary.totalHours - budgetMetrics.targetHours).toFixed(2)],
//         ["Costo Real (€):", (dailySummary.totalHours * budgetMetrics.costPerHour).toFixed(2)],
//     ];
//     const ws_summary = XLSX.utils.aoa_to_sheet(summary_data);

//     // --- ESTILOS AVANZADOS (XLSX-JS-STYLE) ---
//     const borderStyle = { style: "thin", color: { rgb: "000000" } };
//     const headerStyle = {
//         font: { name: "Arial", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "007bff" } }, 
//         border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
//         alignment: { horizontal: "center", vertical: "center" }
//     };
//     const raHeaderStyle = { ...headerStyle, fill: { fgColor: { rgb: "ffc107" } }, font: { name: "Arial", sz: 11, bold: true, color: { rgb: "000000" } } };
    
//     // Aplicar estilos a la cabecera
//     headers.forEach((_, colIndex) => {
//         const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
//         if (worksheet[cellRef]) {
//             worksheet[cellRef].s = (headers[colIndex].includes("RA") || headers[colIndex] === "Peso (kg)") ? raHeaderStyle : headerStyle;
//         }
//     });
    
//     // Aplicar estilos a las filas de datos
//     for (let R = 1; R < ws_data.length; R++) {
//         for (let C = 0; C < headers.length; C++) {
//             const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
//             if (worksheet[cellRef]) {
//                 const isRA = headers[C].includes("RA");
//                 const isDiff = headers[C] === "Diferencia RA";
                
//                 let cellStyle = { 
//                     border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
//                     alignment: { horizontal: "center" } 
//                 };
                
//                 if (typeof ws_data[R][C] === 'number' || (typeof ws_data[R][C] === 'string' && !isNaN(parseFloat(ws_data[R][C])))) {
//                     cellStyle.numFmt = isRA || isDiff ? "0.00" : "0";
//                 }
                
//                 if (isDiff) {
//                     const value = parseFloat(ws_data[R][C]);
//                     if (value >= 0) { 
//                         cellStyle.fill = { fgColor: { rgb: "e9f7ef" } };
//                         cellStyle.font = { color: { rgb: "155724" } }; 
//                     } else { 
//                         cellStyle.fill = { fgColor: { rgb: "f8d7da" } };
//                         cellStyle.font = { color: { rgb: "721c24" } }; 
//                     }
//                 } else if (isRA) {
//                     cellStyle.fill = { fgColor: { rgb: "fff3cd" } };
//                 }

//                 worksheet[cellRef].s = cellStyle;
//             }
//         }
//     }

//     // Configuración de ancho de columnas
//     worksheet['!cols'] = [
//         { wch: 5 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, 
//         { wch: 9 }, { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, 
//         { wch: 9 }, { wch: 10 }, { wch: 11 }, { wch: 7 }, { wch: 7 }, 
//         { wch: 7 }, { wch: 7 }, { wch: 7 }, { wch: 10 }, { wch: 13 },
//     ];
    
//     // Combinar hojas y exportar
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Diarios");
//     XLSX.utils.book_append_sheet(workbook, ws_summary, "Resumen Analítico");
//     XLSX.writeFile(workbook, `Rendimiento_Diario_Analitica_${selectedDate}.xlsx`);
//     toast.success("Exportación avanzada a Excel completada.");
// };


// // --------------------------------------------------------
// // --- COMPONENTE: DailySummaryMobile (Resumen Diario) ---
// // --------------------------------------------------------

// // const DailySummaryMobile = ({ dailySummary, targetRA }) => {
// //     const RA_Global_Color = dailySummary.avgRA >= targetRA ?
// //         'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
// //     const performanceIcon = dailySummary.avgRA >= targetRA ?
// //         <FaChartLine className="text-green-500 text-2xl"/> : <FaExclamationCircle className="text-yellow-500 text-2xl"/>;

// //     const MetricItem = ({ icon, label, value, unit, color }) => (
// //         <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
// //             <span className={`${color} text-xl mb-1`}>{icon}</span>
// //             <p className="text-xs font-medium text-gray-500">{label}</p>
// //             <p className="text-base font-bold text-gray-800">{value} <span className="text-xs font-normal">{unit}</span></p>
// //         </div>
// //     );
    
// //     return (
// //         <MotionCard 
// //             initial={{ opacity: 0, y: 20 }} 
// //             animate={{ opacity: 1, y: 0 }} 
// //             transition={{ duration: 0.5 }}
// //             className="p-4 sm:p-6 mb-8 bg-white rounded-xl shadow-lg border border-gray-200"
// //         >
// //             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-gray-700 border-b-2 border-gray-300 pb-2 flex items-center">
// //                 {performanceIcon}
// //                 <span className="ml-2">Resumen Diario</span>
// //             </h2>

// //             {/* Métrica de Rendimiento Global (Destacada) */}
// //             <div className={`p-4 mb-4 rounded-lg flex justify-between items-center ${RA_Global_Color} shadow-md`}>
// //                 <div>
// //                     <p className="text-lg font-semibold">RA Promedio Global</p>
// //                     <p className="text-xs text-gray-600">Objetivo: **{targetRA}**</p>
// //                 </div>
// //                 <div className="text-3xl font-extrabold">
// //                     {dailySummary.avgRA.toFixed(2)}
// //                 </div>
// //             </div>

// //             {/* Grid de Métricas Clave */}
// //             <div className="grid grid-cols-2 gap-3 text-center">
// //                 <MetricItem icon={<FaUsers />} label="Total Trabajadores" value={dailySummary.totalWorkers} unit="pers." color="text-indigo-500" />
// //                 <MetricItem icon={<FaWeightHanging />} label="Peso Total" value={dailySummary.totalWeight.toFixed(1)} unit="kg" color="text-red-500" />
// //                 <MetricItem icon={<FaHourglassHalf />} label="Horas Recolección" value={dailySummary.totalRecolectionHours.toFixed(1)} unit="h" color="text-blue-500" />
// //                 <MetricItem icon={<FaSeedling />} label="Horas Entutorado" value={dailySummary.totalEntutoradoHours.toFixed(1)} unit="h" color="text-teal-500" />
// //             </div>

// //             <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm font-medium text-center">
// //                 <FaCheckCircle className="inline mr-1 text-green-500"/> Trabajadores sobre Target: **{dailySummary.aboveTargetCount}**
// //             </div>
// //         </MotionCard>
// //     );
// // };



// // const DailySummaryMobile = ({ dailySummary, targetRA }) => {
// //     // 1. Lógica Global de Presupuesto
// //     const isBudgetMet = dailySummary.avgRA >= targetRA;
    
// //     // Configuración de Colores y Texto
// //     const globalStatusConfig = isBudgetMet
// //         ? {
// //             color: 'bg-green-100 text-green-800 border-green-300',
// //             icon: <FaChartLine className="text-green-600 text-3xl mr-3"/>,
// //             title: 'Objetivo de Presupuesto: ¡CUMPLIDO!',
// //             description: `El Rendimiento Promedio (${dailySummary.avgRA.toFixed(2)}) está sobre el objetivo diario de ${targetRA}.`
// //           }
// //         : {
// //             color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
// //             icon: <FaExclamationTriangle className="text-yellow-600 text-3xl mr-3"/>,
// //             title: 'Objetivo de Presupuesto: POR DEBAJO',
// //             description: `El Rendimiento Promedio (${dailySummary.avgRA.toFixed(2)}) está por debajo del objetivo diario de ${targetRA}.`
// //           };

// //     const RA_Global_Color_Highlight = isBudgetMet ? 
// //         'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    
// //     const performanceIconHeader = isBudgetMet ? 
// //         <FaChartLine className="text-green-500 text-2xl"/> : <FaExclamationCircle className="text-yellow-500 text-2xl"/>;

// //     const MetricItem = ({ icon, label, value, unit, color }) => (
// //         <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
// //             <span className={`${color} text-2xl mb-1`}>{icon}</span>
// //             <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
// //             <p className="text-lg font-extrabold text-gray-800 mt-0.5">{value} <span className="text-sm font-normal text-gray-600">{unit}</span></p>
// //         </div>
// //     );
    
// //     return (
// //         <MotionCard 
// //             initial={{ opacity: 0, y: 20 }} 
// //             animate={{ opacity: 1, y: 0 }} 
// //             transition={{ duration: 0.5 }}
// //             className="p-4 sm:p-6 mb-8 bg-white rounded-2xl shadow-xl border border-gray-100"
// //         >
// //             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-gray-700 border-b-2 border-gray-300 pb-2 flex items-center">
// //                 {performanceIconHeader}
// //                 <span className="ml-2">Resumen Diario de Operaciones</span>
// //             </h2>

// //             {/* Bloque de Análisis Global (Presupuesto) */}
// //             <div className={`p-4 mb-6 rounded-xl shadow-lg border-2 ${globalStatusConfig.color} transition duration-500 ease-in-out`}>
// //                 <div className="flex items-start">
// //                     {globalStatusConfig.icon}
// //                     <div>
// //                         <p className="text-lg font-bold leading-tight">{globalStatusConfig.title}</p>
// //                         <p className="text-sm mt-1">{globalStatusConfig.description}</p>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Métrica de Rendimiento Global (Destacada) */}
// //             <div className={`p-4 mb-6 rounded-xl flex justify-between items-center ${RA_Global_Color_Highlight} shadow-lg transition duration-300`}>
// //                 <div>
// //                     <p className="text-lg font-bold">RA Promedio Global</p>
// //                     <p className="text-sm font-medium text-gray-600">Objetivo (Target): **{targetRA.toFixed(2)}**</p>
// //                 </div>
// //                 <div className="text-4xl font-extrabold">
// //                     {dailySummary.avgRA.toFixed(2)}
// //                 </div>
// //             </div>

// //             {/* Grid de Métricas Clave */}
// //             <div className="grid grid-cols-2 gap-4 text-center">
// //                 <MetricItem icon={<FaUsers />} label="Total Trabajadores" value={dailySummary.totalWorkers} unit="pers." color="text-indigo-600" />
// //                 <MetricItem icon={<FaWeightHanging />} label="Peso Total" value={dailySummary.totalWeight.toFixed(1)} unit="kg" color="text-red-600" />
// //                 <MetricItem icon={<FaHourglassHalf />} label="Horas Recolección" value={dailySummary.totalRecolectionHours.toFixed(1)} unit="h" color="text-blue-600" />
// //                 <MetricItem icon={<FaSeedling />} label="Horas Entutorado" value={dailySummary.totalEntutoradoHours.toFixed(1)} unit="h" color="text-teal-600" />
// //             </div>

// //             <div className="mt-6 p-3 bg-gray-100 rounded-xl text-sm font-semibold text-center shadow-inner">
// //                 <FaCheckCircle className="inline mr-2 text-green-500"/> Trabajadores sobre Target: **{dailySummary.aboveTargetCount}**
// //             </div>
// //         </MotionCard>
// //     );
// // };
// // --
// // 



// const DailySummaryMobile = ({ dailySummary, targetRA }) => {
//     // 1. Lógica Global de Presupuesto
    
//     // 🚨 CORRECCIÓN CLAVE: Asegurar que avgRA es un número antes de la comparación.
//     const safeAvgRA = dailySummary?.avgRA || 0;
//     const isBudgetMet = safeAvgRA >= targetRA;
    
//     // Configuración de Colores y Texto
//     const globalStatusConfig = isBudgetMet
//         ? {
//             color: 'bg-green-100 text-green-800 border-green-300',
//             icon: <FaChartLine className="text-green-600 text-3xl mr-3"/>,
//             // 🚨 CORRECCIÓN: Usar safeAvgRA aquí.
//             title: 'Objetivo de Presupuesto: ¡CUMPLIDO!',
//             description: `El Rendimiento Promedio (${safeAvgRA.toFixed(2)}) está sobre el objetivo diario de ${targetRA}.`
//           }
//         : {
//             color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//             icon: <FaExclamationTriangle className="text-yellow-600 text-3xl mr-3"/>,
//             // 🚨 CORRECCIÓN: Usar safeAvgRA aquí.
//             title: 'Objetivo de Presupuesto: POR DEBAJO',
//             description: `El Rendimiento Promedio (${safeAvgRA.toFixed(2)}) está por debajo del objetivo diario de ${targetRA}.`
//           };

//     const RA_Global_Color_Highlight = isBudgetMet ? 
//         'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    
//     const performanceIconHeader = isBudgetMet ? 
//         <FaChartLine className="text-green-500 text-2xl"/> : <FaExclamationCircle className="text-yellow-500 text-2xl"/>;

//     const MetricItem = ({ icon, label, value, unit, color }) => (
//         <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
//             <span className={`${color} text-2xl mb-1`}>{icon}</span>
//             <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
//             <p className="text-lg font-extrabold text-gray-800 mt-0.5">{value} <span className="text-sm font-normal text-gray-600">{unit}</span></p>
//         </div>
//     );
    
//     return (
//         <MotionCard 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5 }}
//             className="p-4 sm:p-6 mb-8 bg-white rounded-2xl shadow-xl border border-gray-100"
//         >
//             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-gray-700 border-b-2 border-gray-300 pb-2 flex items-center">
//                 {performanceIconHeader}
//                 <span className="ml-2">Resumen Diario de Operaciones</span>
//             </h2>

//             {/* Bloque de Análisis Global (Presupuesto) */}
//             <div className={`p-4 mb-6 rounded-xl shadow-lg border-2 ${globalStatusConfig.color} transition duration-500 ease-in-out`}>
//                 <div className="flex items-start">
//                     {globalStatusConfig.icon}
//                     <div>
//                         <p className="text-lg font-bold leading-tight">{globalStatusConfig.title}</p>
//                         <p className="text-sm mt-1">{globalStatusConfig.description}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Métrica de Rendimiento Global (Destacada) */}
//             <div className={`p-4 mb-6 rounded-xl flex justify-between items-center ${RA_Global_Color_Highlight} shadow-lg transition duration-300`}>
//                 <div>
//                     <p className="text-lg font-bold">RA Promedio Global</p>
//                     <p className="text-sm font-medium text-gray-600">Objetivo (Target): **{targetRA.toFixed(2)}**</p>
//                 </div>
//                 <div className="text-4xl font-extrabold">
//                     {/* 🚨 CORRECCIÓN: Usar safeAvgRA directamente */}
//                     {safeAvgRA.toFixed(2)} 
//                 </div>
//             </div>

//             {/* Grid de Métricas Clave */}
//             <div className="grid grid-cols-2 gap-4 text-center">
//                 {/* 🚨 CORRECCIÓN: Usar safe access y default (|| 0) en todos los valores */}
//                 <MetricItem icon={<FaUsers />} label="Total Trabajadores" value={dailySummary?.totalWorkers || 0} unit="pers." color="text-indigo-600" />
//                 <MetricItem icon={<FaWeightHanging />} label="Peso Total" value={(dailySummary?.totalWeight || 0).toFixed(1)} unit="kg" color="text-red-600" />
//                 <MetricItem icon={<FaHourglassHalf />} label="Horas Recolección" value={(dailySummary?.totalRecolectionHours || 0).toFixed(1)} unit="h" color="text-blue-600" />
//                 <MetricItem icon={<FaSeedling />} label="Horas Entutorado" value={(dailySummary?.totalEntutoradoHours || 0).toFixed(1)} unit="h" color="text-teal-600" />
//             </div>

//             <div className="mt-6 p-3 bg-gray-100 rounded-xl text-sm font-semibold text-center shadow-inner">
//                 {/* 🚨 CORRECCIÓN: Usar safe access en aboveTargetCount */}
//                 <FaCheckCircle className="inline mr-2 text-green-500"/> Trabajadores sobre Target: **{dailySummary?.aboveTargetCount || 0}**
//             </div>
//         </MotionCard>
//     );
// };


// // --- COMPONENTE: BudgetAnalysisMobile (Presupuesto) ---
// // --------------------------------------------------------

// // const BudgetAnalysisMobile = ({ dailySummary, budgetMetrics, setTargetHours, setCostPerHour, saveBudgetSettings, targetRA, setTargetRA, saveTargetRA }) => {
// //     const deviation = dailySummary.totalHours - budgetMetrics.targetHours;
// //     const deviationColor = deviation > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
// //     const deviationText = deviation > 0 ? 'Mayor' : 'Menor o Igual';
// //     const actualCost = dailySummary.totalHours * budgetMetrics.costPerHour;
// //     const expectedCost = budgetMetrics.expectedTotalCost;
// //     const costDeviation = actualCost - expectedCost;
// //     const costDeviationColor = costDeviation > 0 ? 'text-red-600' : 'text-green-600';
    
// //     return (
// //         <MotionCard
// //             initial={{ opacity: 0, y: 20 }} 
// //             animate={{ opacity: 1, y: 0 }} 
// //             transition={{ duration: 0.5, delay: 0.1 }}
// //             className="p-4 sm:p-6 mb-8 bg-blue-50 border border-blue-300 rounded-xl shadow-lg"
// //         >
// //             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-blue-700 border-b-2 border-blue-500 pb-2 flex items-center"><FaMoneyBillWave className="mr-2"/>Análisis de Costos y Presupuesto</h2>
            
// //             {/* Indicador Principal de Costo */}
// //             <div className="mb-4 p-4 bg-white rounded-lg shadow-md border border-blue-200">
// //                 <div className="flex justify-between items-center mb-2">
// //                     <p className="text-sm font-semibold text-gray-700">Costo Real Hoy:</p>
// //                     <p className={`text-2xl font-extrabold ${costDeviationColor}`}>
// //                         {actualCost.toFixed(2)} €
// //                     </p>
// //                 </div>
// //                 <div className="text-xs text-right">
// //                     Desviación vs. Esperado ({expectedCost.toFixed(2)} €): 
// //                     <span className={`font-bold ml-1 ${costDeviationColor}`}>
// //                         {costDeviation.toFixed(2)} €
// //                     </span>
// //                 </div>
// //             </div>

// //             {/* Configuración de Presupuesto y Target RA */}
// //             <h3 className="text-lg font-bold text-blue-600 mt-6 mb-3 flex items-center"><FaBullseye className="mr-2"/>Configuración</h3>
            
// //             <div className="space-y-4">
// //                 {/* Horas Objetivo */}
// //                 <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
// //                     <label htmlFor="targetHours" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaClock className="mr-1 text-blue-500"/>Horas Objetivo Diarias</label>
// //                     <div className="flex gap-2">
// //                         <input
// //                             type="number"
// //                             id="targetHours"
// //                             step="0.5"
// //                             value={budgetMetrics.targetHours}
// //                             onChange={(e) => setTargetHours(parseFloat(e.target.value))}
// //                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
// //                         />
// //                         <span className="flex-shrink-0 px-3 py-2 text-sm bg-gray-100 rounded-lg">Horas</span>
// //                     </div>
// //                 </div>

// //                 {/* Costo por Hora */}
// //                 <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
// //                     <label htmlFor="costPerHour" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaMoneyBillWave className="mr-1 text-blue-500"/>Costo por Hora (€)</label>
// //                     <div className="flex gap-2">
// //                         <input
// //                             type="number"
// //                             id="costPerHour"
// //                             step="0.1"
// //                             value={budgetMetrics.costPerHour}
// //                             onChange={(e) => setCostPerHour(parseFloat(e.target.value))}
// //                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
// //                         />
// //                         <span className="flex-shrink-0 px-3 py-2 text-sm bg-gray-100 rounded-lg">€ / h</span>
// //                     </div>
// //                 </div>

// //                 {/* Target RA */}
// //                 <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
// //                     <label htmlFor="targetRA" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaBullseye className="mr-1 text-blue-500"/>Target RA (Objetivo)</label>
// //                     <div className="flex gap-2">
// //                         <input
// //                             type="number"
// //                             id="targetRA"
// //                             step="0.1"
// //                             value={targetRA}
// //                             onChange={(e) => setTargetRA(parseFloat(e.target.value))}
// //                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
// //                         />
// //                     </div>
// //                 </div>

// //                 {/* Botón Guardar Configuración */}
// //                 <div className="flex gap-2">
// //                     <button 
// //                         onClick={saveBudgetSettings}
// //                         className="flex-1 flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-sm"
// //                     >
// //                         <FaSave className="mr-2"/>Guardar Presupuesto
// //                     </button>
// //                      <button 
// //                         onClick={saveTargetRA}
// //                         className="flex-1 flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md text-sm"
// //                     >
// //                         <FaSave className="mr-2"/>Guardar Target RA
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Resumen de Desviación de Horas */}
// //             <div className={`mt-5 p-3 rounded-lg text-sm font-medium text-center shadow-inner ${deviationColor}`}>
// //                 <FaHistory className="inline mr-1"/> Horas Trabajadas Hoy: **{dailySummary.totalHours.toFixed(1)}**
// //                 <p className="mt-1">
// //                     Desviación vs. Objetivo ({budgetMetrics.targetHours.toFixed(1)} h): 
// //                     <span className="font-bold ml-1">
// //                         {deviation.toFixed(1)} h ({deviationText})
// //                     </span>
// //                 </p>
// //             </div>
// //         </MotionCard>
// //     );
// // };





// const BudgetAnalysisMobile = ({ 
//     // Props con valores por defecto para seguridad (anti-undefined error)
//     dailySummary = {}, 
//     budgetMetrics = {}, 
//     targetRA = 0, 
//     globalTargetHours = 0,
    
//     // Funciones de manejo de estado (sin defensas, ya que son callbacks)
//     setTargetHours, 
//     setCostPerHour, 
//     saveBudgetSettings, 
//     setTargetRA, 
//     saveTargetRA,
//     setGlobalTargetHours, 
//     saveGlobalTargetHours 
// }) => {
    
//     // --- 1. Definición de Valores Seguros (para evitar el error 'toFixed') ---
    
//     const safeDailySummary = {
//         totalHours: dailySummary.totalHours || 0,
//         avgRA: dailySummary.avgRA || 0,
//     };

//     const safeBudgetMetrics = {
//         targetHours: budgetMetrics.targetHours || 0,
//         costPerHour: budgetMetrics.costPerHour || 0,
//         expectedTotalCost: budgetMetrics.expectedTotalCost || 0,
//     };
    
//     // --- 2. Lógica de Cálculos (usando valores seguros) ---
    
//     // Costo y Horas Diarias
//     const dailyDeviation = safeDailySummary.totalHours - safeBudgetMetrics.targetHours;
//     const dailyDeviationColor = dailyDeviation > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
    
//     const actualCost = safeDailySummary.totalHours * safeBudgetMetrics.costPerHour;
//     const expectedCost = safeBudgetMetrics.expectedTotalCost;
//     const costDeviation = actualCost - expectedCost;
//     const costDeviationColor = costDeviation > 0 ? 'text-red-600' : 'text-green-600';
//     const costStatusText = costDeviation > 0 ? '¡Exceso de Gasto!' : 'Dentro de Presupuesto';

//     // Metas de Rendimiento y Horas Globales
//     const isBudgetMet = costDeviation <= 0;
//     const isRAMet = safeDailySummary.avgRA >= targetRA;
//     const isGlobalHoursMet = safeDailySummary.totalHours <= globalTargetHours;
//     const globalHoursDeviation = safeDailySummary.totalHours - globalTargetHours;

//     // --- 3. Determinación del Estado Global ---

//     let globalStatus = {};
//     if (isBudgetMet && isRAMet && isGlobalHoursMet) {
//         globalStatus = {
//             color: 'bg-green-100 text-green-800 border-green-300',
//             icon: <FaCheckDouble className="text-green-600 text-3xl mr-3"/>,
//             title: 'OBJETIVOS CUMPLIDOS (TODO OK)',
//             description: 'Objetivos de Costo, Rendimiento (RA) y Horas Globales alcanzados. Día perfecto.'
//         };
//     } else if (!isRAMet || !isBudgetMet || !isGlobalHoursMet) {
//         globalStatus = {
//             color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//             icon: <FaExclamationTriangle className="text-yellow-600 text-3xl mr-3"/>,
//             title: 'EVALUACIÓN MIXTA',
//             description: 'Algunos objetivos se cumplieron, pero hay áreas de mejora (Ver detalles).'
//         };
//     } 
//     // Se podría añadir un 'else' para el peor escenario (rojo), pero el amarillo ya cubre las desviaciones parciales.

//     // --- Componente auxiliar para el estado de una métrica ---
//     const StatusMetric = ({ label, value, isMet }) => (
//         <div className="flex justify-between items-center p-2 border-b last:border-b-0 border-gray-200">
//             <p className="text-sm font-medium text-gray-700">{label}</p>
//             <div className={`flex items-center text-sm font-bold ${isMet ? 'text-green-600' : 'text-red-600'}`}>
//                 {isMet ? <FaCheckCircle className="mr-1"/> : <FaExclamationTriangle className="mr-1"/>}
//                 {value}
//             </div>
//         </div>
//     );

//     // --- 4. Renderizado JSX ---

//     return (
//         <MotionCard
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="p-4 sm:p-6 mb-8 bg-white border border-gray-200 rounded-2xl shadow-xl"
//         >
//             <h2 className="mb-4 text-xl sm:text-2xl font-extrabold text-blue-700 border-b-2 border-blue-500 pb-2 flex items-center">
//                 <FaMoneyBillWave className="mr-2"/>Análisis de Presupuesto y Metas
//             </h2>
            
//             {/* Bloque de Análisis Global (Resumen de Metas) */}
//             <div className={`p-4 mb-6 rounded-xl shadow-lg border-2 ${globalStatus.color} transition duration-500 ease-in-out`}>
//                 <div className="flex items-start">
//                     {globalStatus.icon}
//                     <div className="flex-1">
//                         <p className="text-lg font-bold leading-tight">{globalStatus.title}</p>
//                         <p className="text-sm mt-1">{globalStatus.description}</p>
                        
//                         <div className="mt-3 p-2 bg-white/70 rounded-lg space-y-1">
//                             <StatusMetric label="Meta de Rendimiento (RA)" value={isRAMet ? 'Cumplida' : 'Pendiente'} isMet={isRAMet}/>
//                             <StatusMetric label="Meta de Costo (€)" value={costStatusText} isMet={isBudgetMet}/>
//                             <StatusMetric label="Meta Horas Globales" value={isGlobalHoursMet ? 'Dentro de Horas' : 'Excedido'} isMet={isGlobalHoursMet}/>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Indicador Principal de Costo */}
//             <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-blue-200">
//                 <div className="flex justify-between items-center mb-2">
//                     <p className="text-sm font-semibold text-gray-700">Costo Real Hoy:</p>
//                     <p className={`text-3xl font-extrabold ${costDeviationColor}`}>
//                         {actualCost.toFixed(2)} €
//                     </p>
//                 </div>
//                 <div className="text-xs text-right border-t pt-2 mt-2">
//                     Esperado ({expectedCost.toFixed(2)} €): 
//                     <span className={`font-bold ml-1 ${costDeviationColor}`}>
//                         {costDeviation > 0 ? '+' : ''}{costDeviation.toFixed(2)} € (Desviación)
//                     </span>
//                 </div>
//             </div>

//             {/* Resumen de Desviación de Horas GLOBALES */}
//             <div className={`mb-6 p-3 rounded-xl text-sm font-medium text-center shadow-inner ${globalHoursDeviation > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
//                 <FaGlobe className="inline mr-1"/> Horas Trabajadas Hoy: **{safeDailySummary.totalHours.toFixed(1)} h**
//                 <p className="mt-1">
//                     Desviación vs. Objetivo Global ({globalTargetHours.toFixed(1)} h): 
//                     <span className="font-bold ml-1">
//                         {globalHoursDeviation > 0 ? '+' : ''}{globalHoursDeviation.toFixed(1)} h
//                     </span>
//                 </p>
//             </div>
            
//             <h3 className="text-lg font-bold text-blue-600 mt-6 mb-3 flex items-center"><FaBullseye className="mr-2"/>Ajuste de Metas</h3>
            
//             <div className="space-y-4">
                
//                 {/* HORAS OBJETIVO GLOBAL */}
//                 <div className="p-3 bg-blue-50 rounded-lg shadow-md border border-blue-200">
//                     <label htmlFor="globalTargetHours" className="block text-sm font-bold text-blue-700 flex items-center mb-1"><FaGlobe className="mr-1 text-blue-500"/>Horas Objetivo Globales</label>
//                     <div className="flex gap-2">
//                         <input
//                             type="number"
//                             id="globalTargetHours"
//                             step="0.5"
//                             value={globalTargetHours}
//                             onChange={(e) => setGlobalTargetHours(parseFloat(e.target.value))}
//                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <span className="flex-shrink-0 px-3 py-2 text-sm bg-blue-200 rounded-lg font-bold">Horas</span>
//                     </div>
//                     <button 
//                         onClick={saveGlobalTargetHours}
//                         className="w-full mt-3 flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md text-sm font-semibold"
//                     >
//                         <FaSave className="mr-2"/>Guardar Meta Global
//                     </button>
//                 </div>

//                 <hr className="border-gray-300"/>

//                 <h4 className="text-base font-bold text-gray-700">Metas Diarias</h4>
                
//                 {/* Horas Objetivo DIARIAS */}
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
//                     <label htmlFor="targetHours" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaClock className="mr-1 text-blue-500"/>Horas Objetivo Diarias</label>
//                     <div className="flex gap-2">
//                         <input
//                             type="number"
//                             id="targetHours"
//                             step="0.5"
//                             value={safeBudgetMetrics.targetHours}
//                             onChange={(e) => setTargetHours(parseFloat(e.target.value))}
//                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <span className="flex-shrink-0 px-3 py-2 text-sm bg-gray-200 rounded-lg font-semibold">Horas</span>
//                     </div>
//                 </div>

//                 {/* Costo por Hora */}
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
//                     <label htmlFor="costPerHour" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaMoneyBillWave className="mr-1 text-blue-500"/>Costo por Hora (€)</label>
//                     <div className="flex gap-2">
//                         <input
//                             type="number"
//                             id="costPerHour"
//                             step="0.1"
//                             value={safeBudgetMetrics.costPerHour}
//                             onChange={(e) => setCostPerHour(parseFloat(e.target.value))}
//                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <span className="flex-shrink-0 px-3 py-2 text-sm bg-gray-200 rounded-lg font-semibold">€ / h</span>
//                     </div>
//                 </div>

//                 {/* Target RA */}
//                 <div className="p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
//                     <label htmlFor="targetRA" className="block text-sm font-medium text-gray-700 flex items-center mb-1"><FaChartLine className="mr-1 text-blue-500"/>Target RA (Objetivo de Rendimiento)</label>
//                     <div className="flex gap-2">
//                         <input
//                             type="number"
//                             id="targetRA"
//                             step="0.1"
//                             value={targetRA}
//                             onChange={(e) => setTargetRA(parseFloat(e.target.value))}
//                             className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                          <span className="flex-shrink-0 px-3 py-2 text-sm bg-gray-200 rounded-lg font-semibold">RA</span>
//                     </div>
//                 </div>

//                 {/* Botones Guardar Configuración DIARIA */}
//                 <div className="flex gap-3 pt-2">
//                     <button 
//                         onClick={saveBudgetSettings}
//                         className="flex-1 flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-sm font-semibold"
//                     >
//                         <FaSave className="mr-2"/>Guardar Presupuesto Diario
//                     </button>
//                     <button 
//                         onClick={saveTargetRA}
//                         className="flex-1 flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md text-sm font-semibold"
//                     >
//                         <FaSave className="mr-2"/>Guardar Target RA
//                     </button>
//                 </div>
//             </div>
//         </MotionCard>
//     );
// };



// // --------------------------------------------------------
// // --- NUEVO COMPONENTE: AnalyticsView (Analítica) ---
// // --------------------------------------------------------

// // const AnalyticsView = ({ userId, workers, budgetMetrics, targetRA }) => {
// //     // 1. ESTADOS DE FILTRO
// //     const today = formatDate(new Date());
// //     const [startDate, setStartDate] = useState(today);
// //     const [endDate, setEndDate] = useState(today);
// //     const [filterWorkerId, setFilterWorkerId] = useState('all');
    
// //     // 2. ESTADO DE DATOS FILTRADOS
// //     const [historicalData, setHistoricalData] = useState([]);
// //     const [loading, setLoading] = useState(false);

// //     // 3. FUNCIÓN DE CARGA DE DATOS HISTÓRICOS (con filtro por fecha y usuario)
// //     const fetchHistoricalData = useCallback(async () => {
// //         if (!userId) {
// //             toast.error("Error: Usuario no autenticado.");
// //             return;
// //         }
// //         setLoading(true);
// //         try {
// //             const dataRef = collection(db, COLLECTION_NAME);
// //             let q = query(dataRef, where("userId", "==", userId));

// //             // Filtrar por rango de fechas (usando la fecha como string YYYY-MM-DD)
// //             // Se asume que el campo 'date' en Firestore es el string en formato YYYY-MM-DD
// //             if (startDate) {
// //                 q = query(q, where("date", ">=", startDate));
// //             }
// //             if (endDate) {
// //                 // Para incluir el día final, buscamos hasta el final de ese día si estuviera en timestamp, 
// //                 // pero si es string, simplemente usamos el operador de igualdad o menor.
// //                 q = query(q, where("date", "<=", endDate));
// //             }

// //             const querySnapshot = await getDocs(q);
// //             const data = [];
// //             querySnapshot.forEach(doc => {
// //                 data.push({ docId: doc.id, ...doc.data() });
// //             });
// //             setHistoricalData(data);
// //         } catch (error) {
// //             toast.error("Error al cargar datos históricos: " + error.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [userId, startDate, endDate]);

// //     useEffect(() => {
// //         fetchHistoricalData();
// //     }, [fetchHistoricalData]);


// //     // 4. CÁLCULO DE MÉTRICAS ANALÍTICAS (Globales y para el gráfico)
// //     const { 
// //         globalMetrics, 
// //         workerPerformanceData, 
// //         chartData
// //     } = useMemo(() => {
// //         const filteredData = filterWorkerId !== 'all'
// //             ? historicalData.filter(d => d.workerId === parseInt(filterWorkerId))
// //             : historicalData;

// //         // Estructuras de acumulación
// //         const totals = {
// //             totalHours: 0,
// //             totalRecolectionHours: 0,
// //             totalEntutoradoHours: 0,
// //             totalWeight: 0,
// //             totalProductionUnits: 0, // Peso + Progreso Entutorado
// //             totalDays: new Set(),
// //             workerStats: new Map(), // workerId -> { hours: 0, weight: 0, production: 0, days: new Set(), dailyRAs: [] }
// //         };

// //         filteredData.forEach(entry => {
// //             const rec = entry.taskData.recoleccion || {};
// //             const ent = entry.taskData.entutorado || {};
// //             const totalWeight = calculateTotalWeight(rec.recolectionDetails || []);
// //             const totalHours = (rec.hours || 0) + (ent.hours || 0);

// //             if (totalHours > 0) {
// //                 const RA_Rec = calculateRA(totalWeight, rec.hours || 0, rec.difficultyFactor || 1.0);
// //                 const RA_Ent = calculateRA(ent.progress || 0, ent.hours || 0, ent.difficultyFactor || 1.0);
                
// //                 let sumRA = 0, completedTasks = 0;
// //                 if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
// //                 if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
// //                 const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
                
// //                 totals.totalHours += totalHours;
// //                 totals.totalRecolectionHours += rec.hours || 0;
// //                 totals.totalEntutoradoHours += ent.hours || 0;
// //                 totals.totalWeight += totalWeight;
// //                 totals.totalProductionUnits += totalWeight + (ent.progress || 0); // Producción total

// //                 totals.totalDays.add(entry.date); // Contar días únicos

// //                 // Actualizar estadísticas por trabajador
// //                 if (!totals.workerStats.has(entry.workerId)) {
// //                     totals.workerStats.set(entry.workerId, { 
// //                         id: entry.workerId,
// //                         name: workers.find(w => w.id === entry.workerId)?.name || `ID ${entry.workerId}`,
// //                         hours: 0, weight: 0, production: 0, days: new Set(), dailyRAs: [] 
// //                     });
// //                 }
// //                 const workerStat = totals.workerStats.get(entry.workerId);
// //                 workerStat.hours += totalHours;
// //                 workerStat.weight += totalWeight;
// //                 workerStat.production += totalWeight + (ent.progress || 0);
// //                 workerStat.days.add(entry.date);
// //                 workerStat.dailyRAs.push(RA_Global);
// //             }
// //         });

// //         const totalWorkersCount = totals.workerStats.size;
// //         const totalProduction = totals.totalProductionUnits;
// //         const avgRA = totalWorkersCount > 0 
// //             ? Array.from(totals.workerStats.values()).reduce((sum, stat) => {
// //                 const avgDailyRA = stat.dailyRAs.length > 0 
// //                     ? stat.dailyRAs.reduce((s, ra) => s + ra, 0) / stat.dailyRAs.length
// //                     : 0;
// //                 return sum + avgDailyRA;
// //             }, 0) / totalWorkersCount
// //             : 0;

// //         const globalMetrics = {
// //             totalHours: totals.totalHours,
// //             totalDays: totals.totalDays.size,
// //             totalWeight: totals.totalWeight,
// //             totalProduction: totalProduction,
// //             avgRA: avgRA,
// //             costPerProductionUnit: totalProduction > 0 ? (totals.totalHours * budgetMetrics.costPerHour) / totalProduction : 0,
// //             productionPerHour: totals.totalHours > 0 ? totalProduction / totals.totalHours : 0,
// //             totalCost: totals.totalHours * budgetMetrics.costPerHour,
// //         };

// //         // Procesar datos para la tabla de rendimiento individual
// //         const workerPerformanceData = Array.from(totals.workerStats.values()).map(stat => {
// //             const totalDays = stat.days.size;
// //             const avgDailyRA = stat.dailyRAs.length > 0 ? stat.dailyRAs.reduce((s, ra) => s + ra, 0) / stat.dailyRAs.length : 0;
// //             const productionPerHour = stat.hours > 0 ? stat.production / stat.hours : 0;

// //             return {
// //                 ...stat,
// //                 totalDays,
// //                 avgDailyRA: avgDailyRA.toFixed(2),
// //                 productivity: productionPerHour.toFixed(2),
// //                 performanceIndex: (avgDailyRA / targetRA).toFixed(2), // Porcentaje de cumplimiento del objetivo
// //                 cost: (stat.hours * budgetMetrics.costPerHour).toFixed(2),
// //                 isAboveTarget: avgDailyRA >= targetRA,
// //             };
// //         }).sort((a, b) => parseFloat(b.avgDailyRA) - parseFloat(a.avgDailyRA));


// //         // Datos para el Gráfico (RA promedio por día)
// //         const dailyRA = {};
// //         filteredData.forEach(entry => {
// //             const rec = entry.taskData.recoleccion || {};
// //             const ent = entry.taskData.entutorado || {};
// //             const totalWeight = calculateTotalWeight(rec.recolectionDetails || []);
// //             const totalHours = (rec.hours || 0) + (ent.hours || 0);

// //             if (totalHours > 0) {
// //                  const RA_Rec = calculateRA(totalWeight, rec.hours || 0, rec.difficultyFactor || 1.0);
// //                 const RA_Ent = calculateRA(ent.progress || 0, ent.hours || 0, ent.difficultyFactor || 1.0);
                
// //                 let sumRA = 0, completedTasks = 0;
// //                 if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
// //                 if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
// //                 const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;

// //                 if (!dailyRA[entry.date]) {
// //                     dailyRA[entry.date] = { totalRA: 0, count: 0 };
// //                 }
// //                 dailyRA[entry.date].totalRA += RA_Global;
// //                 dailyRA[entry.date].count += 1;
// //             }
// //         });
        
// //         const chartData = Object.keys(dailyRA).sort().map(date => ({
// //             date: date,
// //             avgRA: (dailyRA[date].totalRA / dailyRA[date].count).toFixed(2),
// //             targetRA: targetRA,
// //         }));


// //         return { globalMetrics, workerPerformanceData, chartData };
// //     }, [historicalData, filterWorkerId, workers, budgetMetrics.costPerHour, targetRA]);

// //     const MetricCard = ({ icon, title, value, unit, color }) => (
// //         <MotionCard 
// //             initial={{ opacity: 0, scale: 0.95 }} 
// //             animate={{ opacity: 1, scale: 1 }} 
// //             transition={{ duration: 0.3 }}
// //             className={`p-4 bg-white rounded-xl shadow-md border ${color} flex flex-col items-center text-center`}
// //         >
// //             <span className="text-3xl mb-2">{icon}</span>
// //             <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
// //             <p className="text-2xl font-bold text-gray-800 mt-1">{value} <span className="text-sm font-normal text-gray-600">{unit}</span></p>
// //         </MotionCard>
// //     );

// //     return (
// //         <MotionCard 
// //             initial={{ opacity: 0, x: -20 }} 
// //             animate={{ opacity: 1, x: 0 }} 
// //             transition={{ duration: 0.5 }}
// //             className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-2xl"
// //         >
// //             <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-3 flex items-center"><FaChartBar className="mr-3"/> Panel de Análisis y Rendimiento</h2>
            
// //             {/* 1. FILTROS DE BÚSQUEDA */}
// //             <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-indigo-200">
// //                 <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center"><FaFilter className="mr-2"/>Filtros de Análisis</h3>
// //                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
// //                         <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
// //                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
// //                     </div>
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
// //                         <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
// //                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
// //                     </div>
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Trabajador</label>
// //                         <select value={filterWorkerId} onChange={(e) => setFilterWorkerId(e.target.value)} 
// //                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
// //                             <option value="all">Todos los Trabajadores</option>
// //                             {workers.map(w => (
// //                                 <option key={w.id} value={w.id}>{w.name} (# {w.id})</option>
// //                             ))}
// //                         </select>
// //                     </div>
// //                 </div>
// //                 <button 
// //                     onClick={fetchHistoricalData} 
// //                     disabled={loading}
// //                     className="mt-4 w-full flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md disabled:bg-indigo-400"
// //                 >
// //                     <FaChartLine className="mr-2"/> {loading ? 'Cargando...' : 'Aplicar Filtros y Recalcular'}
// //                 </button>
// //             </div>
            
// //             {/* 2. RESUMEN GLOBAL ANALÍTICO */}
// //             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaChartArea className="mr-2"/>Métricas Globales (Periodo)</h3>
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //                 <MetricCard 
// //                     icon={<FaCalendarDay className="text-indigo-500"/>} 
// //                     title="Días Analizados" 
// //                     value={globalMetrics.totalDays} 
// //                     unit="Días" 
// //                     color="border-indigo-300"
// //                 />
// //                 <MetricCard 
// //                     icon={<FaHourglassHalf className="text-blue-500"/>} 
// //                     title="Horas Totales" 
// //                     value={globalMetrics.totalHours.toFixed(1)} 
// //                     unit="h" 
// //                     color="border-blue-300"
// //                 />
// //                 <MetricCard 
// //                     icon={<FaBullseye className="text-green-500"/>} 
// //                     title="RA Promedio" 
// //                     value={globalMetrics.avgRA.toFixed(2)} 
// //                     unit={`/ ${targetRA}`} 
// //                     color="border-green-300"
// //                 />
// //                  <MetricCard 
// //                     icon={<FaMoneyBillWave className="text-red-500"/>} 
// //                     title="Costo Total" 
// //                     value={globalMetrics.totalCost.toFixed(2)} 
// //                     unit="€" 
// //                     color="border-red-300"
// //                 />
// //                 <MetricCard 
// //                     icon={<FaCalculator className="text-purple-500"/>} 
// //                     title="Prod. x Hora" 
// //                     value={globalMetrics.productionPerHour.toFixed(2)} 
// //                     unit="Unidades/h" 
// //                     color="border-purple-300"
// //                 />
// //                 <MetricCard 
// //                     icon={<FaMoneyBillWave className="text-orange-500"/>} 
// //                     title="Coste x Unidad" 
// //                     value={globalMetrics.costPerProductionUnit.toFixed(2)} 
// //                     unit="€ / Unidad" 
// //                     color="border-orange-300"
// //                 />
// //             </div>

// //             {/* 3. GRÁFICO DE TENDENCIA DE RA */}
// //             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaChartLine className="mr-2"/>Tendencia de Rendimiento (RA)</h3>
// //             <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 h-96 mb-8 flex items-center justify-center">
// //                 {/* Placeholder para Gráfico */}
// //                 <div className="text-center text-gray-400">
                    
// //                     <p className="mt-2 text-sm">Integra aquí tu librería de gráficos preferida (e.g., Recharts, Chart.js) usando los datos de `chartData`:</p>
// //                     <pre className="mt-1 p-2 bg-gray-100 rounded-lg text-xs overflow-x-auto">
// //                         {JSON.stringify(chartData, null, 2).substring(0, 300) + '...'}
// //                     </pre>
// //                 </div>
// //             </div>

// //             {/* 4. RENDIMIENTO INDIVIDUAL DETALLADO */}
// //             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaUsers className="mr-2"/>Rendimiento Individual Detallado</h3>
// //             <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                     <thead className="bg-indigo-50 sticky top-0">
// //                         <tr>
// //                             {["Trabajador", "Días", "H. Totales", "RA Prom.", "Target (%)", "Prod. (Ud/h)", "Costo (€)"].map(header => (
// //                                 <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
// //                                     {header}
// //                                 </th>
// //                             ))}
// //                         </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-gray-200">
// //                         {workerPerformanceData.length > 0 ? (
// //                             workerPerformanceData.map((w) => (
// //                                 <tr key={w.id} className={w.isAboveTarget ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{w.name}</td>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.totalDays}</td>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.hours.toFixed(1)}</td>
// //                                     <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${w.isAboveTarget ? 'text-green-700' : 'text-yellow-700'}`}>{w.avgDailyRA}</td>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{(parseFloat(w.performanceIndex) * 100).toFixed(0)}%</td>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.productivity}</td>
// //                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.cost} €</td>
// //                                 </tr>
// //                             ))
// //                         ) : (
// //                             <tr>
// //                                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No hay datos para el periodo o trabajador seleccionado.</td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>
            
// //         </MotionCard>
// //     );
// // };


// const AnalyticsView = ({ userId, workers, budgetMetrics, targetRA }) => {
//     // 1. ESTADOS DE FILTRO
//     const today = formatDate(new Date());
//     const [startDate, setStartDate] = useState(today);
//     const [endDate, setEndDate] = useState(today);
//     const [filterWorkerId, setFilterWorkerId] = useState('all');
    
//     // 2. ESTADO DE DATOS FILTRADOS
//     const [historicalData, setHistoricalData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // 3. FUNCIÓN DE CARGA DE DATOS HISTÓRICOS (con filtro por fecha y usuario)
//     const fetchHistoricalData = useCallback(async () => {
//         if (!userId) {
//             toast.error("Error: Usuario no autenticado.");
//             return;
//         }
//         setLoading(true);
//         try {
//             const dataRef = collection(db, COLLECTION_NAME);
//             let q = query(dataRef, where("userId", "==", userId));

//             // Filtrar por rango de fechas
//             if (startDate) {
//                 q = query(q, where("date", ">=", startDate));
//             }
//             if (endDate) {
//                 q = query(q, where("date", "<=", endDate));
//             }

//             const querySnapshot = await getDocs(q);
//             const data = [];
//             querySnapshot.forEach(doc => {
//                 data.push({ docId: doc.id, ...doc.data() });
//             });
//             setHistoricalData(data);
//         } catch (error) {
//             toast.error("Error al cargar datos históricos: " + error.message);
//         } finally {
//             setLoading(false);
//         }
//     }, [userId, startDate, endDate]);

//     useEffect(() => {
//         fetchHistoricalData();
//     }, [fetchHistoricalData]);


//     // 4. CÁLCULO DE MÉTRICAS ANALÍTICAS (Globales y para el gráfico)
//     const { 
//         globalMetrics, 
//         workerPerformanceData, 
//         chartData
//     } = useMemo(() => {
//         const filteredData = filterWorkerId !== 'all'
//             ? historicalData.filter(d => d.workerId === parseInt(filterWorkerId))
//             : historicalData;

//         // Estructuras de acumulación
//         const totals = {
//             totalHours: 0,
//             totalRecolectionHours: 0,
//             totalEntutoradoHours: 0,
//             totalWeight: 0,
//             totalProductionUnits: 0, 
//             totalDays: new Set(),
//             workerStats: new Map(), 
//         };

//         // --- Bucle para Global Metrics ---
//         filteredData.forEach(entry => {
//             // 🚨 CORRECCIÓN 1: Asegura que taskData existe antes de acceder a recoleccion
//             const taskData = entry.taskData || {};
//             const rec = taskData.recoleccion || {};
//             const ent = taskData.entutorado || {};
            
//             const totalWeight = calculateTotalWeight(rec.recolectionDetails || []);
//             const totalHours = (rec.hours || 0) + (ent.hours || 0);

//             if (totalHours > 0) {
//                 const RA_Rec = calculateRA(totalWeight, rec.hours || 0, rec.difficultyFactor || 1.0);
//                 const RA_Ent = calculateRA(ent.progress || 0, ent.hours || 0, ent.difficultyFactor || 1.0);
                
//                 let sumRA = 0, completedTasks = 0;
//                 if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
//                 if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
//                 const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
                
//                 totals.totalHours += totalHours;
//                 totals.totalRecolectionHours += rec.hours || 0;
//                 totals.totalEntutoradoHours += ent.hours || 0;
//                 totals.totalWeight += totalWeight;
//                 totals.totalProductionUnits += totalWeight + (ent.progress || 0); 

//                 totals.totalDays.add(entry.date); 

//                 // Actualizar estadísticas por trabajador
//                 if (!totals.workerStats.has(entry.workerId)) {
//                     totals.workerStats.set(entry.workerId, { 
//                         id: entry.workerId,
//                         name: workers.find(w => w.id === entry.workerId)?.name || `ID ${entry.workerId}`,
//                         hours: 0, weight: 0, production: 0, days: new Set(), dailyRAs: [] 
//                     });
//                 }
//                 const workerStat = totals.workerStats.get(entry.workerId);
//                 workerStat.hours += totalHours;
//                 workerStat.weight += totalWeight;
//                 workerStat.production += totalWeight + (ent.progress || 0);
//                 workerStat.days.add(entry.date);
//                 workerStat.dailyRAs.push(RA_Global);
//             }
//         });

//         // --- Cálculos Finales ---
//         const totalWorkersCount = totals.workerStats.size;
//         const totalProduction = totals.totalProductionUnits;
//         const avgRA = totalWorkersCount > 0 
//             ? Array.from(totals.workerStats.values()).reduce((sum, stat) => {
//                 const avgDailyRA = stat.dailyRAs.length > 0 
//                     ? stat.dailyRAs.reduce((s, ra) => s + ra, 0) / stat.dailyRAs.length
//                     : 0;
//                 return sum + avgDailyRA;
//             }, 0) / totalWorkersCount
//             : 0;

//         const globalMetrics = {
//             totalHours: totals.totalHours,
//             totalDays: totals.totalDays.size,
//             totalWeight: totals.totalWeight,
//             totalProduction: totalProduction,
//             avgRA: avgRA,
//             costPerProductionUnit: totalProduction > 0 ? (totals.totalHours * budgetMetrics.costPerHour) / totalProduction : 0,
//             productionPerHour: totals.totalHours > 0 ? totalProduction / totals.totalHours : 0,
//             totalCost: totals.totalHours * budgetMetrics.costPerHour,
//         };

//         // Procesar datos para la tabla de rendimiento individual
//         const workerPerformanceData = Array.from(totals.workerStats.values()).map(stat => {
//             const totalDays = stat.days.size;
//             const avgDailyRA = stat.dailyRAs.length > 0 ? stat.dailyRAs.reduce((s, ra) => s + ra, 0) / stat.dailyRAs.length : 0;
//             const productionPerHour = stat.hours > 0 ? stat.production / stat.hours : 0;

//             return {
//                 ...stat,
//                 totalDays,
//                 avgDailyRA: avgDailyRA, // Mantener como número para el sort, se formatea en la tabla.
//                 productivity: productionPerHour,
//                 performanceIndex: (avgDailyRA / targetRA), 
//                 cost: (stat.hours * budgetMetrics.costPerHour),
//                 isAboveTarget: avgDailyRA >= targetRA,
//             };
//         }).sort((a, b) => b.avgDailyRA - a.avgDailyRA); // Ordenar por número

//         // --- Bucle para Chart Data ---
//         const dailyRA = {};
//         filteredData.forEach(entry => {
//             // 🚨 CORRECCIÓN 2: Asegura que taskData existe antes de acceder a recoleccion
//             const taskData = entry.taskData || {};
//             const rec = taskData.recoleccion || {};
//             const ent = taskData.entutorado || {};
            
//             const totalWeight = calculateTotalWeight(rec.recolectionDetails || []);
//             const totalHours = (rec.hours || 0) + (ent.hours || 0);

//             if (totalHours > 0) {
//                  const RA_Rec = calculateRA(totalWeight, rec.hours || 0, rec.difficultyFactor || 1.0);
//                 const RA_Ent = calculateRA(ent.progress || 0, ent.hours || 0, ent.difficultyFactor || 1.0);
                
//                 let sumRA = 0, completedTasks = 0;
//                 if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
//                 if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
//                 const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;

//                 if (!dailyRA[entry.date]) {
//                     dailyRA[entry.date] = { totalRA: 0, count: 0 };
//                 }
//                 dailyRA[entry.date].totalRA += RA_Global;
//                 dailyRA[entry.date].count += 1;
//             }
//         });
        
//         const chartData = Object.keys(dailyRA).sort().map(date => ({
//             date: date,
//             avgRA: (dailyRA[date].totalRA / dailyRA[date].count).toFixed(2),
//             targetRA: targetRA,
//         }));


//         return { globalMetrics, workerPerformanceData, chartData };
//     }, [historicalData, filterWorkerId, workers, budgetMetrics.costPerHour, targetRA]);

//     // --- Componente de Tarjeta de Métrica (local) ---
//     const MetricCard = ({ icon, title, value, unit, color }) => (
//         <MotionCard 
//             initial={{ opacity: 0, scale: 0.95 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             transition={{ duration: 0.3 }}
//             className={`p-4 bg-white rounded-xl shadow-md border ${color} flex flex-col items-center text-center`}
//         >
//             <span className="text-3xl mb-2">{icon}</span>
//             <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
//             <p className="text-2xl font-bold text-gray-800 mt-1">{value} <span className="text-sm font-normal text-gray-600">{unit}</span></p>
//         </MotionCard>
//     );
//     // --------------------------------------------------


//     return (
//         <MotionCard 
//             initial={{ opacity: 0, x: -20 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             transition={{ duration: 0.5 }}
//             className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-2xl"
//         >
//             <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-400 pb-3 flex items-center"><FaChartBar className="mr-3"/> Panel de Análisis y Rendimiento</h2>
            
//             <hr className="mb-6"/>

//             {/* 1. FILTROS DE BÚSQUEDA */}
//             <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-indigo-200">
//                 <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center"><FaFilter className="mr-2"/>Filtros de Análisis</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
//                         <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
//                         <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Trabajador</label>
//                         <select value={filterWorkerId} onChange={(e) => setFilterWorkerId(e.target.value)} 
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//                             <option value="all">Todos los Trabajadores</option>
//                             {workers.map(w => (
//                                 <option key={w.id} value={w.id}>{w.name} (# {w.id})</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//                 <button 
//                     onClick={fetchHistoricalData} 
//                     disabled={loading}
//                     className="mt-4 w-full flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md disabled:bg-indigo-400"
//                 >
//                     <FaChartLine className="mr-2"/> {loading ? 'Cargando...' : 'Aplicar Filtros y Recalcular'}
//                 </button>
//             </div>
            
//             <hr className="mb-6"/>

//             {/* 2. RESUMEN GLOBAL ANALÍTICO */}
//             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaChartArea className="mr-2"/>Métricas Globales (Periodo)</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 <MetricCard 
//                     icon={<FaCalendarDay className="text-indigo-500"/>} 
//                     title="Días Analizados" 
//                     value={globalMetrics.totalDays} 
//                     unit="Días" 
//                     color="border-indigo-300"
//                 />
//                 <MetricCard 
//                     icon={<FaHourglassHalf className="text-blue-500"/>} 
//                     title="Horas Totales" 
//                     value={globalMetrics.totalHours.toFixed(1)} 
//                     unit="h" 
//                     color="border-blue-300"
//                 />
//                 <MetricCard 
//                     icon={<FaBullseye className="text-green-500"/>} 
//                     title="RA Promedio" 
//                     value={globalMetrics.avgRA.toFixed(2)} 
//                     unit={`/ ${targetRA}`} 
//                     color="border-green-300"
//                 />
//                 <MetricCard 
//                     icon={<FaMoneyBillWave className="text-red-500"/>} 
//                     title="Costo Total" 
//                     value={globalMetrics.totalCost.toFixed(2)} 
//                     unit="€" 
//                     color="border-red-300"
//                 />
//                 <MetricCard 
//                     icon={<FaCalculator className="text-purple-500"/>} 
//                     title="Prod. x Hora" 
//                     value={globalMetrics.productionPerHour.toFixed(2)} 
//                     unit="Unidades/h" 
//                     color="border-purple-300"
//                 />
//                 <MetricCard 
//                     icon={<FaMoneyBillWave className="text-orange-500"/>} 
//                     title="Coste x Unidad" 
//                     value={globalMetrics.costPerProductionUnit.toFixed(2)} 
//                     unit="€ / Unidad" 
//                     color="border-orange-300"
//                 />
//             </div>
            
//             <hr className="mb-6"/>

//             {/* 3. GRÁFICO DE TENDENCIA DE RA */}
//             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaChartLine className="mr-2"/>Tendencia de Rendimiento (RA)</h3>
//             <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 h-96 mb-8 flex items-center justify-center">
//                 {/* Placeholder para Gráfico */}
//                 <div className="text-center text-gray-400">
                    
//                     <p className="mt-2 text-sm">Integra aquí tu librería de gráficos preferida (e.g., Recharts, Chart.js) usando los datos de `chartData`:</p>
//                     <pre className="mt-1 p-2 bg-gray-100 rounded-lg text-xs overflow-x-auto">
//                         {JSON.stringify(chartData, null, 2).substring(0, 300) + '...'}
//                     </pre>
//                 </div>
//             </div>

//             <hr className="mb-6"/>
            
//             {/* 4. RENDIMIENTO INDIVIDUAL DETALLADO */}
//             <h3 className="mb-4 text-xl font-bold text-gray-700 flex items-center"><FaUsers className="mr-2"/>Rendimiento Individual Detallado</h3>
//             <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-indigo-50 sticky top-0">
//                         <tr>
//                             {["Trabajador", "Días", "H. Totales", "RA Prom.", "Target (%)", "Prod. (Ud/h)", "Costo (€)"].map(header => (
//                                 <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {workerPerformanceData.length > 0 ? (
//                             workerPerformanceData.map((w) => (
//                                 <tr key={w.id} className={w.isAboveTarget ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{w.name}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.totalDays}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.hours.toFixed(1)}</td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${w.isAboveTarget ? 'text-green-700' : 'text-yellow-700'}`}>{w.avgDailyRA.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{(w.performanceIndex * 100).toFixed(0)}%</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.productivity.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{w.cost.toFixed(2)} €</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No hay datos para el periodo o trabajador seleccionado.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
            
//         </MotionCard>
//     );
// };

// // --------------------------------------------------------
// // --- COMPONENTE PRINCIPAL: AppContainer ---
// // --------------------------------------------------------

// // const AppContainer = () => {
// //     // ESTADOS GLOBALES
// //     const [workers, setWorkers] = useState([]);
// //     const [nextWorkerId, setNextWorkerId] = useState(initialWorkerId);
// //     const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
// //     const [dailyData, setDailyData] = useState([]);
// //     const [targetRA, setTargetRA] = useState(1.0);
// //     const [budgetMetrics, setBudgetMetrics] = useState({ targetHours: 8, costPerHour: 15, expectedTotalCost: 120 });
    
// //     // ESTADO PARA HORAS OBJETIVO GLOBALES (NUEVO)
// //     const [globalTargetHours, setGlobalTargetHours] = useState(160); 
    
// //     // ESTADOS de AUTH y VISTAS
// //     const [user, setUser] = useState(null);
// //     const [isLoggedIn, setIsLoggedIn] = useState(false);
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [isRegistering, setIsRegistering] = useState(false);
// //     const [currentView, setCurrentView] = useState('input'); 

// //     const userId = user?.uid; 

// //     // --- LÓGICA DE AUTH ---
// //     useEffect(() => {
// //         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// //             setUser(currentUser);
// //             setIsLoggedIn(!!currentUser);
// //         });
// //         return unsubscribe;
// //     }, []);

// //     const handleAuth = async () => {
// //         try {
// //             if (isRegistering) {
// //                 await createUserWithEmailAndPassword(auth, email, password);
// //                 toast.success("Registro exitoso. ¡Bienvenido!");
// //             } else {
// //                 await signInWithEmailAndPassword(auth, email, password);
// //                 toast.success("Inicio de sesión exitoso.");
// //             }
// //         } catch (error) {
// //             toast.error(error.message);
// //         }
// //     };

// //     const handleLogout = async () => {
// //         try {
// //             await signOut(auth);
// //             toast.success("Sesión cerrada.");
// //             setDailyData([]);
// //         } catch (error) {
// //             toast.error("Error al cerrar sesión: " + error.message);
// //         }
// //     };
    
// //     // --- FUNCIONES DE GUARDADO ---
    
// //     const saveBudgetSettings = async (isInitial = false) => {
// //         if (!userId) return toast.error("Usuario no autenticado para guardar.");
// //         const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
// //         try {
// //             await setDoc(docRef, { 
// //                 targetHours: budgetMetrics.targetHours, 
// //                 costPerHour: budgetMetrics.costPerHour,
// //                 expectedTotalCost: budgetMetrics.targetHours * budgetMetrics.costPerHour,
// //                 userId: userId, 
// //             }, { merge: true });
// //             if (!isInitial) toast.success("Configuración de presupuesto diaria guardada.");
// //         } catch (error) {
// //             toast.error("Error al guardar presupuesto diario: " + error.message);
// //         }
// //     };
    
// //     const saveTargetRA = async (isInitial = false) => {
// //         if (!userId) return toast.error("Usuario no autenticado para guardar.");
// //         const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
// //         try {
// //             await setDoc(docRef, { targetRA: targetRA, userId: userId }, { merge: true });
// //             if (!isInitial) toast.success("Target RA guardado.");
// //         } catch (error) {
// //             toast.error("Error al guardar Target RA: " + error.message);
// //         }
// //     };

// //     // --- FUNCIÓN DE GUARDADO PARA HORAS GLOBALES (NUEVA) ---
// //     const saveGlobalTargetHours = async (isInitial = false) => {
// //         if (!userId) return toast.error("Usuario no autenticado para guardar.");
// //         const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
// //         try {
// //             await setDoc(docRef, { 
// //                 globalTargetHours: globalTargetHours, 
// //                 userId: userId 
// //             }, { merge: true });
// //             if (!isInitial) toast.success("Horas Objetivo Globales guardadas.");
// //         } catch (error) {
// //             toast.error("Error al guardar Horas Globales: " + error.message);
// //         }
// //     };
    
// //     // --- LÓGICA DE CARGA DE CONFIGURACIÓN ---

// //     const loadBudgetSettings = useCallback(() => {
// //         if (!userId) return;
// //         const docRef = doc(db, BUDGET_COLLECTION, BUDGET_DOC_ID);
// //         const unsubscribe = onSnapshot(docRef, (docSnap) => {
// //             if (docSnap.exists() && docSnap.data().userId === userId) {
// //                 const data = docSnap.data();
// //                 setTargetRA(data.targetRA || 1.0);
// //                 setGlobalTargetHours(data.globalTargetHours || 160); // <-- Cargar Horas Globales
// //                 setBudgetMetrics({
// //                     targetHours: data.targetHours || 8,
// //                     costPerHour: data.costPerHour || 15,
// //                     expectedTotalCost: (data.targetHours || 8) * (data.costPerHour || 15),
// //                 });
// //             } else {
// //                 // Si no existe, guardar valores por defecto para el usuario
// //                 saveBudgetSettings(true); 
// //                 saveTargetRA(true);
// //                 saveGlobalTargetHours(true); // <-- Guardar Horas Globales por defecto
// //             }
// //         }, (error) => {
// //             toast.error("Error al cargar configuración: " + error.message);
// //         });
// //         return unsubscribe;
// //     }, [userId]); // Dependencias simplificadas para useCallback

// //     useEffect(() => {
// //         if (userId) {
// //             const unsubscribe = loadBudgetSettings();
// //             return unsubscribe;
// //         }
// //     }, [userId, loadBudgetSettings]);

// //     // --- LÓGICA DE CARGA DE DATOS DIARIOS ---

// //     const loadDailyData = useCallback(async () => {
// //         if (!userId) {
// //              setDailyData([]);
// //              return;
// //         }
// //         const docRef = doc(db, COLLECTION_NAME, `${selectedDate}_${userId}`);
// //         const unsubscribe = onSnapshot(docRef, (docSnap) => {
// //             if (docSnap.exists()) {
// //                 const data = docSnap.data().workersData || [];
// //                 setDailyData(data);
// //             } else {
// //                 setDailyData([]);
// //             }
// //         }, (error) => {
// //             toast.error("Error al cargar datos diarios: " + error.message);
// //         });
// //         return unsubscribe;
// //     }, [selectedDate, userId]);

// //     useEffect(() => {
// //          const unsubscribe = loadDailyData();
// //          return () => {
// //              if (typeof unsubscribe === 'function') {
// //                  unsubscribe();
// //              }
// //          };
// //     }, [loadDailyData]);

// //     const saveDailyData = async () => {
// //         if (!userId) return toast.error("Usuario no autenticado para guardar.");
// //         const docRef = doc(db, COLLECTION_NAME, `${selectedDate}_${userId}`);
// //         try {
// //             await setDoc(docRef, { 
// //                 date: selectedDate, 
// //                 workersData: dailyData,
// //                 userId: userId, 
// //                 timestamp: serverTimestamp() 
// //             }, { merge: true });
// //             toast.success("Datos diarios guardados exitosamente.");
// //         } catch (error) {
// //             toast.error("Error al guardar datos diarios: " + error.message);
// //         }
// //     };

// //     // --- FUNCIONES DE ACTUALIZACIÓN DE DATOS DIARIOS ---
    
// //     const handleTaskUpdate = (workerId, taskType, field, value) => {
// //         setDailyData(prevData => {
// //             const workerIndex = prevData.findIndex(w => w.id === workerId);
// //             if (workerIndex === -1) {
// //                 const newWorkerData = { 
// //                     id: workerId, 
// //                     name: workers.find(w => w.id === workerId)?.name || `ID ${workerId}`, 
// //                     ...emptyTaskData() 
// //                 };
// //                 newWorkerData[taskType][field] = value;
// //                 return [...prevData, newWorkerData];
// //             }
            
// //             const newData = [...prevData];
// //             const workerData = newData[workerIndex];
            
// //             if (!workerData[taskType]) {
// //                 workerData[taskType] = emptyTaskData()[taskType];
// //             }

// //             workerData[taskType] = {
// //                 ...workerData[taskType],
// //                 [field]: value
// //             };
            
// //             return newData;
// //         });
// //     };
    
// //     const handleBoxDetailChange = (workerId, newDetails) => {
// //         setDailyData(prevData => {
// //             const workerIndex = prevData.findIndex(w => w.id === workerId);
// //             if (workerIndex === -1) return prevData;

// //             const newData = [...prevData];
// //             newData[workerIndex].recoleccion.recolectionDetails = newDetails;
// //             return newData;
// //         });
// //     };
    
// //     // --- CÁLCULO DEL RESUMEN DIARIO ---
    
// //     const dailySummary = useMemo(() => {
// //         let totalRecolectionHours = 0;
// //         let totalEntutoradoHours = 0;
// //         let totalWeight = 0;
// //         let totalRA = 0;
// //         let raCount = 0;
// //         let aboveTargetCount = 0;

// //         dailyData.forEach(worker => {
// //             const rec = worker.recoleccion || {};
// //             const ent = worker.entutorado || {};

// //             const workerRecHours = rec.hours || 0;
// //             const workerEntHours = ent.hours || 0;
// //             totalRecolectionHours += workerRecHours;
// //             totalEntutoradoHours += workerEntHours;

// //             const recolectionDetails = rec.recolectionDetails || [];
// //             const workerWeight = calculateTotalWeight(recolectionDetails);
// //             totalWeight += workerWeight;

// //             const RA_Rec = calculateRA(workerWeight, workerRecHours, rec.difficultyFactor || 1.0);
// //             const RA_Ent = calculateRA(ent.progress || 0, workerEntHours, ent.difficultyFactor || 1.0);

// //             let sumRA = 0, completedTasks = 0;
// //             if (RA_Rec > 0) { sumRA += RA_Rec; completedTasks++; }
// //             if (RA_Ent > 0) { sumRA += RA_Ent; completedTasks++; }
// //             const RA_Global = completedTasks > 0 ? sumRA / completedTasks : 0;
            
// //             if (RA_Global > 0) {
// //                 totalRA += RA_Global;
// //                 raCount++;
// //                 if (RA_Global >= targetRA) {
// //                     aboveTargetCount++;
// //                 }
// //             }
// //         });

// //         const totalHours = totalRecolectionHours + totalEntutoradoHours;
// //         const avgRA = raCount > 0 ? totalRA / raCount : 0;
        
// //         const uniqueWorkerIds = new Set(dailyData.map(w => w.id));
        
// //         return {
// //             totalWorkers: uniqueWorkerIds.size,
// //             totalHours,
// //             totalRecolectionHours,
// //             totalEntutoradoHours,
// //             totalWeight,
// //             avgRA,
// //             aboveTargetCount
// //         };
// //     }, [dailyData, targetRA]);
    
// //     // FILTRAR LISTA DE TRABAJADORES PARA INPUT
// //     const activeWorkers = useMemo(() => {
// //         const activeIds = new Set(dailyData.map(d => d.id));
// //         const missingWorkers = workers.filter(w => !activeIds.has(w.id)).map(w => ({ 
// //             ...w, ...emptyTaskData() 
// //         }));
        
// //         const workersWithData = dailyData.map(d => ({
// //             ...d, 
// //             name: workers.find(w => w.id === d.id)?.name || d.name,
// //             recoleccion: d.recoleccion || emptyTaskData().recoleccion,
// //             entutorado: d.entutorado || emptyTaskData().entutorado,
// //         }));
        
// //         return [...workersWithData, ...missingWorkers].sort((a, b) => a.id - b.id);
// //     }, [workers, dailyData]);
    
// //     // --- RENDERIZACIÓN ---
    
// //     if (!isLoggedIn) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //                 <MotionCard 
// //                     initial={{ opacity: 0, scale: 0.8 }} 
// //                     animate={{ opacity: 1, scale: 1 }} 
// //                     transition={{ duration: 0.5 }}
// //                     className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200"
// //                 >
// //                     <h1 className="text-3xl font-extrabold text-center text-indigo-600 flex items-center justify-center">
// //                         <FaChartLine className="mr-2"/> AgroStats Pro
// //                     </h1>
// //                     <h2 className="text-xl font-semibold text-center text-gray-700">{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>
// //                     <input
// //                         type="email"
// //                         placeholder="Email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
// //                     />
// //                     <input
// //                         type="password"
// //                         placeholder="Contraseña"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
// //                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
// //                     />
// //                    <button 
// //                         onClick={handleAuth} 
// //                         className="w-full flex items-center justify-center px-4 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
// //                     >
// //                         {isRegistering 
// //                             ? (<><FaUserPlus className="mr-2"/>Registrarme</>) 
// //                             : (<><FaSignInAlt className="mr-2"/>Ingresar</>)
// //                         }
// //                     </button>
// //                     <button 
// //                         onClick={() => setIsRegistering(!isRegistering)} 
// //                         className="w-full p-2 text-sm text-indigo-600 hover:text-indigo-800 transition duration-300"
// //                     >
// //                         {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
// //                     </button>
// //                 </MotionCard>
// //             </div>
// //         );
// //     }
    
// //     // --- LAYOUT PRINCIPAL DE LA APLICACIÓN ---
// //     return (
// //         <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
// //             <Toaster position="top-right" reverseOrder={false} />
            
// //             {/* Cabecera y Navegación */}
// //             <header className="mb-6 p-4 bg-white rounded-xl shadow-lg flex flex-wrap justify-between items-center sticky top-0 z-10 border-b border-gray-200">
// //                 <div className="flex items-center mb-3 sm:mb-0">
// //                     <h1 className="text-2xl font-extrabold text-indigo-600">AgroStats Pro</h1>
// //                     <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:inline">Usuario: **{user?.email}**</span>
// //                 </div>

// //                 <div className="flex flex-col sm:flex-row items-center gap-3">
// //                     {currentView === 'input' && (
// //                         <div className="flex items-center bg-gray-50 p-2 rounded-lg border">
// //                             <label htmlFor="date-select" className="mr-2 text-sm font-medium text-gray-600 flex items-center"><FaCalendarAlt className="mr-1"/>Fecha:</label>
// //                             <input
// //                                 id="date-select"
// //                                 type="date"
// //                                 value={selectedDate}
// //                                 onChange={(e) => setSelectedDate(e.target.value)}
// //                                 className="p-1 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
// //                             />
// //                         </div>
// //                     )}
// //                     <button 
// //                         onClick={handleLogout} 
// //                         className="flex items-center px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
// //                     >
// //                         <FaSignOutAlt className="mr-2"/>Salir
// //                     </button>
// //                 </div>
// //             </header>

// //             {/* Menú de Navegación (Tabs) */}
// //             <div className="flex justify-center gap-3 sm:gap-6 mb-8 sticky top-20 z-10 bg-gray-100 py-3 rounded-xl">
// //                 {[
// //                     { key: 'input', label: 'Carga de Datos', icon: FaEdit },
// //                     { key: 'analytics', label: 'Analítica', icon: FaChartBar },
// //                     { key: 'management', label: 'Trabajadores', icon: FaUsers },
// //                     { key: 'budget', label: 'Presupuesto', icon: FaMoneyBillWave },
// //                 ].map(item => (
// //                     <button
// //                         key={item.key}
// //                         onClick={() => setCurrentView(item.key)}
// //                         className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-300 shadow-md ${
// //                             currentView === item.key 
// //                                 ? 'bg-indigo-600 text-white shadow-indigo-400/50' 
// //                                 : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
// //                         }`}
// //                     >
// //                         <item.icon className="mr-2"/>{item.label}
// //                     </button>
// //                 ))}
// //             </div>


// //             {/* --- CONTENIDO PRINCIPAL --- */}
            
// //             {currentView === 'input' && (
// //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Columna de Resumen y Guardado (Ocupa 1/3 en LG, y todo el ancho en SM) */}
// //         <div className="lg:col-span-1 space-y-6">
// //             <DailySummaryMobile dailySummary={dailySummary} targetRA={targetRA} />
// //             <MotionCard 
// //                 initial={{ opacity: 0, y: 20 }} 
// //                 animate={{ opacity: 1, y: 0 }} 
// //                 transition={{ duration: 0.5, delay: 0.2 }}
// //                 className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200"
// //             >
// //                 <h2 className="mb-4 text-xl font-extrabold text-gray-700 border-b pb-2 flex items-center"><FaSave className="mr-2"/>Acciones</h2>
// //                 <button 
// //                     onClick={saveDailyData} 
// //                     className="w-full flex items-center justify-center px-4 py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md mb-3"
// //                 >
// //                     <FaSave className="mr-2"/>Guardar Datos del Día
// //                 </button>
// //                 <button 
// //                     onClick={() => exportToExcelAdvanced(activeWorkers, selectedDate, dailySummary, targetRA, budgetMetrics)} 
// //                     className="w-full flex items-center justify-center px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
// //                 >
// //                     <FaFileExcel className="mr-2"/>Exportar a Excel (Avanzado)
// //                 </button>
// //             </MotionCard>
// //         </div>

// //         {/* Columna de Input de Trabajadores - AHORA CON GRID RESPONSIVO DENTRO */}
// //         <div className="lg:col-span-2 space-y-6">
// //             {/* GRID DENTRO: En móvil una columna, en tabletas dos columnas */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
// //                 {activeWorkers.map(worker => (
// //                     // La WorkerInputCard es ahora más pequeña ya que solo ocupa la mitad del ancho del contenedor en md
// //                     <WorkerInputCard 
// //                         key={worker.id} 
// //                         worker={worker} 
// //                         handleTaskUpdate={handleTaskUpdate} 
// //                         handleBoxDetailChange={handleBoxDetailChange}
// //                         targetRA={targetRA}
// //                     />
// //                 ))}
// //             </div>

// //             {activeWorkers.length === 0 && (
// //                 <MotionCard 
// //                     initial={{ opacity: 0, y: 20 }} 
// //                     animate={{ opacity: 1, y: 0 }} 
// //                     transition={{ duration: 0.5 }}
// //                     className="p-10 text-center bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-300"
// //                 >
// //                     <FaExclamationCircle className="text-4xl text-yellow-500 mx-auto mb-3"/>
// //                     <p className="font-semibold text-yellow-800">No hay trabajadores agregados aún. Vaya a la vista "Trabajadores" para comenzar.</p>
// //                 </MotionCard>
// //             )}
// //         </div>
// //     </div>
// // )}
// //             {/* VISTA DE ANALÍTICA */}
// //             {currentView === 'analytics' && (
// //                 <AnalyticsView 
// //                     userId={userId} 
// //                     workers={workers} 
// //                     budgetMetrics={budgetMetrics} 
// //                     targetRA={targetRA}
// //                 />
// //             )}

// //             {/* VISTAS EXISTENTES */}
// //             {currentView === 'management' && (
// //                 <WorkerManagement 
// //                     workers={workers} 
// //                     setWorkers={setWorkers} 
// //                     nextWorkerId={nextWorkerId} 
// //                     setNextWorkerId={setNextWorkerId}
// //                     userId={userId} 
// //                 />
// //             )}
            
// //             {/* VISTA DE PRESUPUESTO */}
// //             {currentView === 'budget' && (
// //                 <BudgetAnalysisMobile 
// //                     dailySummary={dailySummary}
// //                     budgetMetrics={budgetMetrics}
// //                     setTargetHours={(val) => setBudgetMetrics(prev => ({...prev, targetHours: val, expectedTotalCost: val * prev.costPerHour}))}
// //                     setCostPerHour={(val) => setBudgetMetrics(prev => ({...prev, costPerHour: val, expectedTotalCost: prev.targetHours * val}))}
// //                     saveBudgetSettings={saveBudgetSettings}
// //                     targetRA={targetRA}
// //                     setTargetRA={setTargetRA}
// //                     saveTargetRA={saveTargetRA}
                    
// //                     // --- Props corregidos y añadidos ---
// //                     globalTargetHours={globalTargetHours}
// //                     setGlobalTargetHours={setGlobalTargetHours} 
// //                     saveGlobalTargetHours={saveGlobalTargetHours}
// //                 />
// //             )}
            
// //         </div>
// //     );
// // };



// const AppContainer = () => {
//     // ESTADOS GLOBALES
//     // NOTA: Inicialicé 'workers' con datos dummy aquí para que el useMemo 'activeWorkers' funcione correctamente 
//     // y muestre tarjetas al inicio. Si los trabajadores se cargan de Firestore, elimina estos dummies.
//     const [workers, setWorkers] = useState([{id: 1001, name: "Juan P."}, {id: 1002, name: "María R."}, {id: 1003, name: "Pedro M."}, {id: 1004, name: "Ana S."}]); 
//     const [nextWorkerId, setNextWorkerId] = useState(initialWorkerId + 4);
//     const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//     const [dailyData, setDailyData] = useState([]);
//     const [targetRA, setTargetRA] = useState(1.0);
//     const [budgetMetrics, setBudgetMetrics] = useState({ targetHours: 8, costPerHour: 15, expectedTotalCost: 120 });
    
//     // ESTADO PARA HORAS OBJETIVO GLOBALES
//     const [globalTargetHours, setGlobalTargetHours] = useState(160); 
    
//     // ESTADOS de AUTH y VISTAS
//     const [user, setUser] = useState(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [currentView, setCurrentView] = useState('input'); 

//     const userId = user?.uid; 

//     // --- LÓGICA DE AUTH (Sin cambios) ---
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//             setIsLoggedIn(!!currentUser);
//         });
//         return unsubscribe;
//     }, []);

//     const handleAuth = async () => { /* ... */ };
//     const handleLogout = async () => { /* ... */ };
    
//     // --- FUNCIONES DE GUARDADO (Sin cambios) ---
//     const saveBudgetSettings = async (isInitial = false) => { /* ... */ };
//     const saveTargetRA = async (isInitial = false) => { /* ... */ };
//     const saveGlobalTargetHours = async (isInitial = false) => { /* ... */ };
    
//     // --- LÓGICA DE CARGA DE CONFIGURACIÓN (Sin cambios) ---
//     const loadBudgetSettings = useCallback(() => { /* ... */ }, [userId]); 

//     useEffect(() => {
//         if (userId) {
//             const unsubscribe = loadBudgetSettings();
//             return unsubscribe;
//         }
//     }, [userId, loadBudgetSettings]);

//     // --- LÓGICA DE CARGA DE DATOS DIARIOS (Sin cambios) ---
//     const loadDailyData = useCallback(async () => { /* ... */ }, [selectedDate, userId]);

//     useEffect(() => {
//          const unsubscribe = loadDailyData();
//          return () => {
//              if (typeof unsubscribe === 'function') {
//                  unsubscribe();
//              }
//          };
//     }, [loadDailyData]);

//     const saveDailyData = async () => { /* ... */ };

//     // --- FUNCIONES DE ACTUALIZACIÓN DE DATOS DIARIOS (Corregida) ---
    
//     const handleTaskUpdate = (workerId, taskType, field, value) => {
//         setDailyData(prevData => {
//             const workerIndex = prevData.findIndex(w => w.id === workerId);
//             if (workerIndex === -1) {
//                 const newWorkerData = { 
//                     id: workerId, 
//                     name: workers.find(w => w.id === workerId)?.name || `ID ${workerId}`, 
//                     ...emptyTaskData() 
//                 };
//                 newWorkerData[taskType][field] = value;
//                 return [...prevData, newWorkerData];
//             }
            
//             const newData = [...prevData];
//             const workerData = newData[workerIndex];
            
//             // Asegurar que el objeto de tarea exista
//             if (!workerData[taskType]) {
//                 workerData[taskType] = emptyTaskData()[taskType];
//             }

//             workerData[taskType] = {
//                 ...workerData[taskType],
//                 [field]: value
//             };
            
//             return newData;
//         });
//     };
    
//     // CORRECCIÓN: Asegurar que newData[workerIndex].recoleccion exista antes de acceder a recolectionDetails
//     const handleBoxDetailChange = (workerId, newDetails) => {
//         setDailyData(prevData => {
//             const workerIndex = prevData.findIndex(w => w.id === workerId);
//             if (workerIndex === -1) return prevData;

//             const newData = [...prevData];
//             // 🚨 Corrección Crítica: Si 'recoleccion' es undefined, inicializarlo antes de actualizar sus detalles
//             if (!newData[workerIndex].recoleccion) {
//                  newData[workerIndex].recoleccion = emptyTaskData().recoleccion;
//             }
//             newData[workerIndex].recoleccion.recolectionDetails = newDetails;
//             return newData;
//         });
//     };
    
//     // --- CÁLCULO DEL RESUMEN DIARIO (Sin cambios, ya corregido en la sesión anterior) ---
//     const dailySummary = useMemo(() => {
//         let totalRecolectionHours = 0;
//         // ... (resto de la lógica) ...
//         // Ya tienes las comprobaciones de seguridad: 
//         // const rec = worker.recoleccion || {};
//         // const ent = worker.entutorado || {};

//         (dailyData || []).forEach(worker => { 
//             const rec = worker.recoleccion || {};
//             const ent = worker.entutorado || {};
//             // ... (resto de la lógica) ...
//         });

//         // ... (resto de la lógica) ...
//         return { /* ... */ };
//     }, [dailyData, targetRA]);
    
//     // FILTRAR LISTA DE TRABAJADORES PARA INPUT
//     const activeWorkers = useMemo(() => {
//         const activeIds = new Set(dailyData.map(d => d.id));
        
//         // 1. Trabajadores que están en la lista global pero aún no tienen datos del día
//         const missingWorkers = workers.filter(w => !activeIds.has(w.id)).map(w => ({ 
//             ...w, 
//             ...emptyTaskData() // Inicializar con datos vacíos
//         }));
        
//         // 2. Trabajadores que ya tienen datos (usar esos datos)
//         const workersWithData = dailyData.map(d => ({
//             ...d, 
//             name: workers.find(w => w.id === d.id)?.name || d.name,
//             // Asegurar que recoleccion y entutorado existen, aunque sea vacíos
//             recoleccion: d.recoleccion || emptyTaskData().recoleccion,
//             entutorado: d.entutorado || emptyTaskData().entutorado,
//         }));
        
//         // Combinar y ordenar
//         return [...workersWithData, ...missingWorkers].sort((a, b) => a.id - b.id);
//     }, [workers, dailyData]);
    
//     // --- RENDERIZACIÓN ---
    
//     if (!isLoggedIn) { /* ... Auth JSX ... */ }
    
//     // --- LAYOUT PRINCIPAL DE LA APLICACIÓN ---
//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
//             <Toaster position="top-right" reverseOrder={false} />
            
//             {/* Cabecera y Navegación (Tailwind ajustado) */}
//             <header className="mb-6 p-4 bg-white rounded-xl shadow-lg flex flex-wrap justify-between items-center sticky top-0 z-20 border-b border-gray-200">
//                 <div className="flex items-center mb-3 sm:mb-0">
//                     <h1 className="text-2xl font-extrabold text-indigo-600">AgroStats Pro</h1>
//                     <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:inline">Usuario: **{user?.email}**</span>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-center gap-3">
//                     {currentView === 'input' && (
//                         <div className="flex items-center bg-gray-50 p-2 rounded-lg border">
//                             <label htmlFor="date-select" className="mr-2 text-sm font-medium text-gray-600 flex items-center"><FaCalendarAlt className="mr-1"/>Fecha:</label>
//                             <input
//                                 id="date-select"
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => setSelectedDate(e.target.value)}
//                                 className="p-1 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                         </div>
//                     )}
//                     <button 
//                         onClick={handleLogout} 
//                         className="flex items-center px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
//                     >
//                         <FaSignOutAlt className="mr-2"/>Salir
//                     </button>
//                 </div>
//             </header>

//             {/* Menú de Navegación (Tabs) - AHORA CON TAILWIND COMPACTO Y RESPONSIVE */}
//             <div className="flex justify-center gap-2 sm:gap-4 mb-8 sticky top-20 z-10 bg-gray-100 py-3 rounded-xl flex-wrap">
//                 {[
//                     { key: 'input', label: 'Carga de Datos', icon: FaEdit },
//                     { key: 'analytics', label: 'Analítica', icon: FaChartBar },
//                     { key: 'management', label: 'Trabajadores', icon: FaUsers },
//                     { key: 'budget', label: 'Presupuesto', icon: FaMoneyBillWave },
//                 ].map(item => (
//                     <button
//                         key={item.key}
//                         onClick={() => setCurrentView(item.key)}
//                         // CLASES AJUSTADAS PARA MAYOR COMPACIDAD EN MÓVIL
//                         className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition duration-300 shadow-md sm:px-4 sm:py-2 sm:text-sm ${
//                             currentView === item.key 
//                                 ? 'bg-indigo-600 text-white shadow-indigo-400/50' 
//                                 : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
//                         }`}
//                     >
//                         <item.icon className="mr-1 sm:mr-2"/>{item.label}
//                     </button>
//                 ))}
//             </div>


//             {/* --- CONTENIDO PRINCIPAL --- */}
            
//             {currentView === 'input' && (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Columna de Resumen y Guardado */}
//                     <div className="lg:col-span-1 space-y-6">
//                         <DailySummaryMobile dailySummary={dailySummary} targetRA={targetRA} />
//                         <MotionCard 
//                             initial={{ opacity: 0, y: 20 }} 
//                             animate={{ opacity: 1, y: 0 }} 
//                             transition={{ duration: 0.5, delay: 0.2 }}
//                             className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200"
//                         >
//                             <h2 className="mb-4 text-xl font-extrabold text-gray-700 border-b pb-2 flex items-center"><FaSave className="mr-2"/>Acciones</h2>
//                             <button 
//                                 onClick={saveDailyData} 
//                                 className="w-full flex items-center justify-center px-4 py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md mb-3"
//                             >
//                                 <FaSave className="mr-2"/>Guardar Datos del Día
//                             </button>
//                             <button 
//                                 onClick={() => exportToExcelAdvanced(activeWorkers, selectedDate, dailySummary, targetRA, budgetMetrics)} 
//                                 className="w-full flex items-center justify-center px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
//                             >
//                                 <FaFileExcel className="mr-2"/>Exportar a Excel (Avanzado)
//                             </button>
//                         </MotionCard>
//                     </div>

//                     {/* Columna de Input de Trabajadores - GRID RESPONSIVO DENTRO */}
//                     <div className="lg:col-span-2 space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
//                             {activeWorkers.map(worker => (
//                                 <WorkerInputCard 
//                                     key={worker.id} 
//                                     worker={worker} 
//                                     handleTaskUpdate={handleTaskUpdate} 
//                                     handleBoxDetailChange={handleBoxDetailChange}
//                                     targetRA={targetRA}
//                                 />
//                             ))}
//                         </div>

//                         {activeWorkers.length === 0 && (
//                             <MotionCard 
//                                 initial={{ opacity: 0, y: 20 }} 
//                                 animate={{ opacity: 1, y: 0 }} 
//                                 transition={{ duration: 0.5 }}
//                                 className="p-10 text-center bg-yellow-50 rounded-xl border-2 border-dashed border-yellow-300"
//                             >
//                                 <FaExclamationCircle className="text-4xl text-yellow-500 mx-auto mb-3"/>
//                                 <p className="font-semibold text-yellow-800">No hay trabajadores agregados aún. Vaya a la vista "Trabajadores" para comenzar.</p>
//                             </MotionCard>
//                         )}
//                     </div>
//                 </div>
//             )}
            
//             {/* VISTA DE ANALÍTICA (Sin cambios) */}
//             {currentView === 'analytics' && (
//                 <AnalyticsView 
//                     userId={userId} 
//                     workers={workers} 
//                     budgetMetrics={budgetMetrics} 
//                     targetRA={targetRA}
//                 />
//             )}

//             {/* VISTAS EXISTENTES (Sin cambios) */}
//             {currentView === 'management' && (
//                 <WorkerManagement 
//                     workers={workers} 
//                     setWorkers={setWorkers} 
//                     nextWorkerId={nextWorkerId} 
//                     setNextWorkerId={setNextWorkerId}
//                     userId={userId} 
//                 />
//             )}
            
//             {/* VISTA DE PRESUPUESTO (Sin cambios) */}
//             {currentView === 'budget' && (
//                 <BudgetAnalysisMobile 
//                     dailySummary={dailySummary}
//                     budgetMetrics={budgetMetrics}
//                     setTargetHours={(val) => setBudgetMetrics(prev => ({...prev, targetHours: val, expectedTotalCost: val * prev.costPerHour}))}
//                     setCostPerHour={(val) => setBudgetMetrics(prev => ({...prev, costPerHour: val, expectedTotalCost: prev.targetHours * val}))}
//                     saveBudgetSettings={saveBudgetSettings}
//                     targetRA={targetRA}
//                     setTargetRA={setTargetRA}
//                     saveTargetRA={saveTargetRA}
                    
//                     globalTargetHours={globalTargetHours}
//                     setGlobalTargetHours={setGlobalTargetHours} 
//                     saveGlobalTargetHours={saveGlobalTargetHours}
//                 />
//             )}
            
//         </div>
//     );
// };


// export default AppContainer;







