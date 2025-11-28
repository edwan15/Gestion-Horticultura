// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//     FaEuroSign, FaHome, FaUserFriends, FaCalculator, FaHourglassHalf, FaMoneyBillWave, 
//     FaListAlt, FaSeedling, FaTruckLoading, FaRulerCombined, FaClock, FaUser, FaTools, 
//     FaCalendarDay, FaTruck, FaTrash, FaEdit, FaTimes, FaSave // 💡 Nuevos iconos
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion'; // 💡 Añadida AnimatePresence
// import { onAuthStateChanged } from 'firebase/auth';
// import {
//     collection,
//     query,
//     onSnapshot,
//     where,
//     orderBy,
//     getFirestore,
//     deleteDoc, 
//     doc, 
//     updateDoc
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // --- Componentes que se asume que están importados de otros archivos ---
// // Si necesitas que el código de estos componentes se unifique también,
// // avísame, pero por ahora se mantienen las importaciones ya que no proporcionaste su código.
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import  {CostDashboard} from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';
// import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
// import SummaryCard from '../COSTOS/SummaryCard';

// // =======================================================================
// // === 0. CONSTANTES DE CONFIGURACIÓN DE FIREBASE
// // =======================================================================
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
// const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/employees`; 
// const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;
// const ENTITIES_COLLECTION_PATH = `artifacts/${appId}/public/data/entities`;


// // =======================================================================
// // === 1. COMPONENTE: EditLaborCostModal (Modal de Edición)
// // =======================================================================
// const EditLaborCostModal = ({ isOpen, onClose, record, onSave, availableLocals, availableWorkers }) => {
    
//     const [formData, setFormData] = useState({
//         date: record?.date || '',
//         totalHours: record?.totalHours || 0,
//         ratePerHour: record?.ratePerHour || 0,
//         localName: record?.localName || '',
//         workerNames: record?.workerNames || (record?.workerName ? [record.workerName] : []),
//         operationName: record?.operationName || '',
//     });
    
//     // Recalcula el coste estimado basado en el formulario
//     const workersCount = Array.isArray(formData.workerNames) ? formData.workerNames.length : 1;
//     const cost = (parseFloat(formData.totalHours || 0) * parseFloat(formData.ratePerHour || 0) * workersCount).toFixed(2);
    
//     // Inicializar estado al abrir el modal con el registro actual
//     useEffect(() => {
//         if (record) {
//             const initialWorkerNames = Array.isArray(record.workerNames) 
//                 ? record.workerNames 
//                 : (record.workerName ? [record.workerName] : []);

//             setFormData({
//                 date: record.date || '',
//                 totalHours: parseFloat(record.totalHours || 0),
//                 ratePerHour: parseFloat(record.ratePerHour || 0),
//                 localName: record.localName || '',
//                 workerNames: initialWorkerNames,
//                 operationName: record.operationName || '',
//             });
//         }
//     }, [record]);


//     const handleChange = (e) => {
//         const { name, value, type, selectedOptions } = e.target;
        
//         if (name === 'workerNames' && type === 'select-multiple') {
//             const selectedWorkers = Array.from(selectedOptions, option => option.value);
//             setFormData(prev => ({ ...prev, workerNames: selectedWorkers }));
//         } else if (name === 'totalHours' || name === 'ratePerHour') {
//              const numericValue = value === '' ? 0 : (parseFloat(value) || 0);
//              setFormData(prev => ({ ...prev, [name]: numericValue }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };
    
//     const handleSave = () => {
//         if (!formData.date || !formData.localName || (Array.isArray(formData.workerNames) && formData.workerNames.length === 0)) {
//             alert("Por favor, complete los campos obligatorios: Fecha, Proyecto y al menos un Trabajador.");
//             return;
//         }
        
//         const updatedData = {
//             ...record, 
//             date: formData.date,
//             totalHours: parseFloat(formData.totalHours),
//             ratePerHour: parseFloat(formData.ratePerHour),
//             localName: formData.localName,
//             operationName: formData.operationName,
//             workerNames: formData.workerNames,
//             workerName: Array.isArray(formData.workerNames) && formData.workerNames.length === 1 ? formData.workerNames[0] : null,
//         };
        
//         onSave(record.id, updatedData);
//     };

//     const modalVariants = {
//         hidden: { opacity: 0, scale: 0.8, y: "-100vh" },
//         visible: { 
//             opacity: 1, 
//             scale: 1, 
//             y: "0",
//             transition: { type: "spring", stiffness: 300, damping: 25, ease: "easeOut" }
//         },
//         exit: { opacity: 0, scale: 0.8, y: "100vh" }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={onClose} 
//                 >
//                     <motion.div
//                         className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
//                         variants={modalVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         onClick={e => e.stopPropagation()} 
//                     >
//                         <h3 className="text-2xl font-extrabold text-red-800 border-b-2 border-red-100 pb-3 mb-4 flex items-center">
//                             <FaEdit className="mr-2 text-red-500" /> Edición Rápida de Registro
//                         </h3>
                        
//                         <button 
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
//                             aria-label="Cerrar Modal"
//                         >
//                             <FaTimes className="text-2xl" />
//                         </button>

//                         <form className="space-y-4">
//                             {/* Fila 1: Fecha y Horas */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaCalendarDay className="mr-2 text-red-500" /> Fecha
//                                     </label>
//                                     <input 
//                                         type="date"
//                                         name="date"
//                                         value={formData.date}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaClock className="mr-2 text-gray-500" /> Horas Netas (h)
//                                     </label>
//                                     <input 
//                                         type="number"
//                                         name="totalHours"
//                                         value={formData.totalHours}
//                                         onChange={handleChange}
//                                         step="0.01"
//                                         min="0"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Fila 2: Tasa y Operación */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaMoneyBillWave className="mr-2 text-green-500" /> Tasa/Hora (€)
//                                     </label>
//                                     <input 
//                                         type="number"
//                                         name="ratePerHour"
//                                         value={formData.ratePerHour}
//                                         onChange={handleChange}
//                                         step="0.01"
//                                         min="0"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaTools className="mr-2 text-blue-500" /> Operación
//                                     </label>
//                                     <input 
//                                         type="text"
//                                         name="operationName"
//                                         value={formData.operationName}
//                                         onChange={handleChange}
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                         placeholder="Ej: Poda, Cosecha, Siembra..."
//                                     />
//                                 </div>
//                             </div>

//                             {/* Fila 3: Proyecto (Local) */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                     <FaSeedling className="mr-2 text-green-500" /> Proyecto/Cultivo
//                                 </label>
//                                 <select
//                                     name="localName"
//                                     value={formData.localName}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
//                                 >
//                                     <option value="">Selecciona Proyecto</option>
//                                     {availableLocals.map(local => (
//                                         <option key={local.id} value={local.name}>{local.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Fila 4: Trabajadores (Multi-select) */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                     <FaUserFriends className="mr-2 text-purple-500" /> Trabajador(es)
//                                 </label>
//                                 <select
//                                     name="workerNames"
//                                     multiple={true}
//                                     value={formData.workerNames}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-24 transition duration-150"
//                                 >
//                                     {availableWorkers.map(worker => (
//                                         <option key={worker} value={worker}>{worker}</option>
//                                     ))}
//                                 </select>
//                                 <p className="text-xs text-gray-500 mt-1">Mantén **Ctrl/Cmd** presionado para seleccionar múltiples.</p>
//                             </div>
//                         </form>

//                         {/* Resumen de Costo y Botones de Acción */}
//                         <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center">
//                             <p className="flex items-center font-bold text-lg text-red-700">
//                                 <FaEuroSign className="mr-2"/> Nuevo Coste Est.: **{cost} €**
//                             </p>
//                             <button 
//                                 onClick={handleSave}
//                                 className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg flex items-center transition-all duration-300 transform hover:scale-105 active:scale-95"
//                                 aria-label="Guardar Cambios"
//                             >
//                                 <FaSave className="mr-2"/> Guardar Cambios
//                             </button>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };


// // =======================================================================
// // === 2. COMPONENTE LaborCostDashboardDisplay (Modificado para acciones)
// // =======================================================================
// const LaborCostDashboardDisplay = ({ 
//     timesheets = [], 
//     error,
//     onEditRecord, 
//     onDeleteRecord 
// }) => {
    
//     if (error) {
//         return (
//             <div className="text-center p-10 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <p className="text-lg font-semibold text-red-800">{error}</p>
//             </div>
//         );
//     }

//     // Función que maneja la eliminación con confirmación
//     const handleDelete = (record) => {
//         const workerInfo = record.workerNames?.join(', ') || record.workerName || 'Registro';
//         if (window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${workerInfo} del ${record.date}? Esta acción es irreversible.`)) {
//             onDeleteRecord(record.id);
//         }
//     };


//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

//             {timesheets.length === 0 ? (
//                 <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
//                     <p className="text-lg text-yellow-800">No se encontraron registros de tiempo.</p>
//                 </div>
//             ) : (
//                 // 💡 Aplicamos AnimatePresence y motion a los elementos de la lista
//                 <AnimatePresence mode="popLayout">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {timesheets.map((record) => {
//                             const totalHours = parseFloat(record.totalHours) || 0;
//                             const ratePerHour = parseFloat(record.ratePerHour) || 0;
//                             const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1)); 
//                             const cost = (totalHours * ratePerHour * workersCount).toFixed(2);
                            
//                             const workerDisplay = Array.isArray(record.workerNames) && record.workerNames.length > 0 
//                                 ? record.workerNames.join(', ')
//                                 : record.workerName || 'Personal no especificado';

//                             const machineryInfo = Array.isArray(record.machineryIds) && record.machineryIds.length > 0
//                                 ? `${record.machineryIds.length} Máquina(s) (Ej: ${record.machineryIds[0].substring(0, 4)}...)`
//                                 : (record.machineryId ? `ID: ${record.machineryId.substring(0, 4)}...` : 'No aplica');
                            
//                             return (
//                                 <motion.div 
//                                     key={record.id} 
//                                     initial={{ opacity: 0, y: 50, scale: 0.8 }}
//                                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                                     exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
//                                     layout // Permite animaciones de reorganización
//                                     className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500 flex flex-col justify-between"
//                                 >
//                                     {/* Información del Registro */}
//                                     <div>
//                                         <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
//                                             <div className="flex items-center">
//                                                 <FaCalendarDay className="mr-2 text-red-500"/> **{record.date}**
//                                             </div>
//                                             <span className="text-xs">Reg. ID: {record.id.substring(0, 4)}...</span>
//                                         </div>
                                        
//                                         <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
//                                             <FaUser className="mr-2"/> {workerDisplay}
//                                         </h3>

//                                         <ul className="space-y-1 text-sm text-gray-700">
//                                             <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
//                                             <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
//                                             <li className="flex items-center"><FaTruck className="mr-2 text-orange-500"/> Maquinaria: {machineryInfo}</li>
//                                             <li className="flex items-center mt-2 pt-2 border-t"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{totalHours.toFixed(2)} h</span></li>
//                                         </ul>

//                                         <div className="mt-3 p-2 bg-red-50 rounded-md">
//                                             <p className="flex items-center font-bold text-lg text-red-700">
//                                                 <FaEuroSign className="mr-2"/> Coste Total: {cost} €
//                                             </p>
//                                         </div>
//                                     </div>
                                    
//                                     {/* Botones de Acción */}
//                                     <div className="mt-4 flex justify-end space-x-2">
//                                         <button 
//                                             onClick={() => onEditRecord(record)}
//                                             className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center transition-colors transform hover:scale-105"
//                                         >
//                                             <FaEdit className="mr-1"/> Editar
//                                         </button>
//                                         <button 
//                                             onClick={() => handleDelete(record)}
//                                             className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center transition-colors transform hover:scale-105"
//                                         >
//                                             <FaTrash className="mr-1"/> Eliminar
//                                         </button>
//                                     </div>
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </AnimatePresence>
//             )}
//         </div>
//     );
// };


// // =======================================================================
// // === 3. HOOKS PERSONALIZADOS
// // =======================================================================
// // (Se mantienen como los proporcionaste, ya que son correctos)
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });
//         return () => unsubscribe(); 
//     }, []); 
//     return { db, userId, loadingAuth };
// };

// const useProjectAndEntityData = (db, userId, setNotification) => {
//     const [availableLocals, setAvailableLocals] = useState([]); 
//     const [availableEntityObjects, setAvailableEntityObjects] = useState([]); 
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingData(false); return; }
//         const firestore = getFirestore();
        
//         const qProjects = query(collection(firestore, PROJECTS_COLLECTION_PATH), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, type: doc.data().cropType || 'Proyecto General', ...doc.data() }));
//             setAvailableLocals(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
//             setLoadingData(false);
//         });

//         const qEntities = query(collection(firestore, ENTITIES_COLLECTION_PATH), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntityObjects(entities); 
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => { unsubscribeProjects(); unsubscribeEntities(); };
//     }, [db, userId, setNotification]);
//     return { availableLocals, availableEntityObjects, loadingData }; 
// };

// const useWorkerData = (db, userId, setNotification) => {
//     const [availableWorkers, setAvailableWorkers] = useState([]); 
//     const [loadingWorkers, setLoadingWorkers] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingWorkers(false); return; }
//         const firestore = getFirestore();
//         const qWorkers = query(collection(firestore, WORKERS_COLLECTION_PATH), where("userId", "==", userId));
        
//         const unsubscribeWorkers = onSnapshot(qWorkers, (snapshot) => {
//             const workers = snapshot.docs.map(doc => doc.data().name).sort(); 
//             setAvailableWorkers(workers);
//             setLoadingWorkers(false);
//         }, (error) => {
//             console.error("Firestore worker data error:", error);
//             setNotification({ message: "Error al cargar la lista de trabajadores.", type: "error" });
//             setLoadingWorkers(false);
//         });
//         return () => unsubscribeWorkers();
//     }, [db, userId, setNotification]);
//     return { availableWorkers, loadingWorkers };
// };

// const useTimesheetsData = (db, userId, setErrorMessage) => {
//     const [timesheets, setTimesheets] = useState([]);
//     const [loadingTimesheets, setLoadingTimesheets] = useState(true);
//     const [errorTimesheets, setErrorTimesheets] = useState(null);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingTimesheets(false); return; }
//         setErrorTimesheets(null);
//         setLoadingTimesheets(true);

//         try {
//             const firestore = db || getFirestore();
//             const timesheetQuery = query(
//                 collection(firestore, TIMESHEET_COLLECTION_PATH),
//                 where("createdBy", "==", userId),
//                 orderBy("createdAt", "desc") 
//             );

//             const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setTimesheets(data);
//                 setLoadingTimesheets(false);
//                 if (errorTimesheets) setErrorTimesheets(null); 
//             }, (err) => {
//                 console.error("Error al cargar timesheets:", err);
//                 const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
//                 setErrorTimesheets(userMessage);
//                 setErrorMessage({ message: userMessage, type: 'error' });
//                 setLoadingTimesheets(false);
//             });
//             return () => unsubscribe(); 
//         } catch (e) {
//             console.error("Error setting up timesheet listener:", e);
//             const userMessage = "Error interno al configurar la escucha de datos.";
//             setErrorTimesheets(userMessage);
//             setErrorMessage({ message: userMessage, type: 'error' });
//             setLoadingTimesheets(false);
//         }
//     }, [db, userId, setErrorMessage, errorTimesheets]);

//     return { timesheets, loadingTimesheets, errorTimesheets };
// };


// // =======================================================================
// // === 4. COMPONENTE HomeView (Se mantiene igual)
// // =======================================================================
// const HomeView = ({ dailyData, greenhouses = [], selectedGreenhouseId, setSelectedGreenhouseId, updateGreenhouseConfig, greenhouseConfig, timesheets }) => {
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
//     const handleCardSelect = (e) => { setSelectedGreenhouseId(e.target.value); };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. Tarjeta de Resumen de Mano de Obra */}
//             <div className="mb-8"><SummaryCard timesheets={timesheets} /></div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2 space-y-6">
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             {/*  */}
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>
//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <GreenhouseSummaryCard 
//                             config={config} totalProduction={totalProduction} currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} onSelectGreenhouse={handleCardSelect}
//                         />
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico 1</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico 2</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === 5. HOME CONTENT PRINCIPAL (Componente Padre)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
//     const [activeView, setActiveView] = useState('labor'); 
//     const [notification, setNotification] = useState(null); 
    
    
//     // 🚨 NUEVOS ESTADOS PARA EDICIÓN
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null); 

//     // 2. OBTENER PROYECTOS Y ENTIDADES (Objetos)
//     const { availableLocals, availableEntityObjects, loadingData } = useProjectAndEntityData(db, userId, setNotification); 
    
//     // 3. OBTENER TRABAJADORES (Nombres)
//     const { availableWorkers, loadingWorkers } = useWorkerData(db, userId, setNotification); 

//     // 4. CARGAR LOS TIMESHEETS GLOBALMENTE
//     const { timesheets, loadingTimesheets, errorTimesheets } = useTimesheetsData(db, userId, setNotification); 


//     const { ...restOfProps } = props;


//     // =======================================================================
//     // === CÁLCULO DE COSTES Y PREPARACIÓN DE LISTAS PARA SELECTS
//     // =======================================================================
//     const { 
//         timesheetTotalCost, 
//         timesheetTotalCostByProject, 
//         timesheetTotalCostByWorker,
//         availableProjectsNames, 
//         availableEntitiesNames 
//     } = useMemo(() => {
//         let totalCost = 0;
//         const costByProject = {};
//         const costByWorker = {}; 

//         timesheets.forEach(record => {
//             // Asegurar que las horas y tasas son números para el cálculo
//             const totalHours = parseFloat(record.totalHours) || 0;
//             const ratePerHour = parseFloat(record.ratePerHour) || 0;
//             // 💡 Manejar el formato de un trabajador o múltiples
//             const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1));
            
//             if (totalHours > 0 && ratePerHour > 0) {
//                 const cost = totalHours * ratePerHour * workersCount;
//                 totalCost += cost;
                
//                 // Agrupar por Proyecto
//                 const projectName = record.localName || 'General'; 
//                 costByProject[projectName] = (costByProject[projectName] || 0) + cost;

//                 // Agrupar por Trabajador (Solución para arrays o string)
//                 const workerNamesArray = Array.isArray(record.workerNames) ? record.workerNames : (record.workerName ? [record.workerName] : []);
                
//                 // Distribuir el coste total entre los trabajadores si son varios
//                 const costPerWorker = cost / workersCount;
//                 workerNamesArray.forEach(workerName => {
//                      costByWorker[workerName] = (costByWorker[workerName] || 0) + costPerWorker;
//                 });
//             }
//         });

//         // PREPARAR LISTAS DE NOMBRES (STRINGS) PARA EL CostDashboard
//         const projectsNames = availableLocals.map(l => l.name).sort();
//         const entitiesNames = availableEntityObjects.map(e => e.name).sort();

//         return {
//             timesheetTotalCost: totalCost, 
//             timesheetTotalCostByProject: costByProject, 
//             timesheetTotalCostByWorker: costByWorker, 
//             availableProjectsNames: projectsNames, 
//             availableEntitiesNames: entitiesNames, 
//         };
//     }, [timesheets, availableLocals, availableEntityObjects]); 

//     // =======================================================================
//     // === MANEJADORES DE ACCIÓN DE EDICIÓN Y ELIMINACIÓN
//     // =======================================================================
    
//     // MANEJADOR DE ELIMINACIÓN
//     const handleDeleteRecord = async (recordId) => {
//         try {
//             const firestore = db || getFirestore();
//             const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
//             await deleteDoc(recordRef);
//             setNotification({ message: "✅ Registro de tiempo eliminado con éxito.", type: 'success' });
//         } catch (error) {
//             console.error("Error al eliminar el registro:", error);
//             setNotification({ message: "❌ Error al eliminar el registro. Inténtelo de nuevo.", type: 'error' });
//         }
//     };
    
//     // MANEJADOR DE EDICIÓN (Abrir Modal)
//     const handleEditRecord = (record) => {
//         setEditingRecord(record);
//         setIsEditModalOpen(true);
//     };

//     // MANEJADOR DE GUARDADO DE EDICIÓN
//     const handleSaveEdit = async (recordId, updatedData) => {
//         try {
//             const firestore = db || getFirestore();
//             const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
            
//             // Excluir el 'id' al actualizar
//             const { id, ...dataToUpdate } = updatedData;
//             dataToUpdate.updatedAt = new Date(); // Opcional: añadir fecha de actualización
            
//             // Limpiar valores nulos o vacíos y asegurar tipo
//             dataToUpdate.totalHours = parseFloat(dataToUpdate.totalHours) || 0;
//             dataToUpdate.ratePerHour = parseFloat(dataToUpdate.ratePerHour) || 0;

//             await updateDoc(recordRef, dataToUpdate);

//             setNotification({ message: "✅ Registro actualizado con éxito.", type: 'success' });
//             setIsEditModalOpen(false); 
//             setEditingRecord(null);
//         } catch (error) {
//             console.error("Error al actualizar el registro:", error);
//             setNotification({ message: "❌ Error al actualizar el registro. Inténtelo de nuevo.", type: 'error' });
//         }
//     };

//     // --- Barra de Navegación de Vistas (Se mantiene igual) ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             <button
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'home' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'costs' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'employee_management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'labor' ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData || loadingTimesheets || loadingWorkers) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : loadingData ? "Cargando datos maestros..." : loadingWorkers ? "Cargando lista de trabajadores..." : "Cargando registros de trabajo..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* MOSTRAR NOTIFICACIÓN */}
//             <AnimatePresence>
//                 {notification && (
//                     <motion.div 
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                         className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4 ${notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}
//                     >
//                         <strong className="font-bold">{notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}</strong>
//                         <span className="block sm:inline ml-2">{notification.message}</span>
//                         <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setNotification(null)}>❌</span>
//                     </motion.div>
//                 )}
//             </AnimatePresence>


//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (<HomeView {...restOfProps} timesheets={timesheets} />)}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         availableProjects={availableProjectsNames} 
//                         availableEntities={availableEntitiesNames} 
//                         availableWorkers={availableWorkers} 
//                         timesheetTotalCost={timesheetTotalCost}
//                         timesheetTotalCostByProject={timesheetTotalCostByProject}
//                         timesheetTotalCostByWorker={timesheetTotalCostByWorker} 
//                         availableLocals={availableLocals} 
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager db={db} userId={userId} setErrorMessage={setNotification} initialProjects={availableLocals} initialEntities={availableEntityObjects} />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement db={db} userId={userId} setErrorMessage={setNotification} availableEntities={availableEntityObjects} />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
//                 <div className="p-4 sm:p-6 pt-0">
//                     <div className="mb-8">
//                         <TimeSheetWizard db={db} userId={userId} setErrorMessage={setNotification} availableLocals={availableLocals} availableWorkers={availableWorkers} />
//                     </div>
//                     <SummaryCard timesheets={timesheets} /> 
//                     <div className="mt-6">
//                         <LaborCostDashboardDisplay 
//                             timesheets={timesheets} 
//                             error={errorTimesheets} 
//                             onEditRecord={handleEditRecord} // 💡 Pasar manejador de edición
//                             onDeleteRecord={handleDeleteRecord} // 💡 Pasar manejador de eliminación
//                         />
//                     </div>
//                 </div>
//             )}
            
//             {/* 🚨 Modal de Edición (Flotante) */}
//             {editingRecord && (
//                 <EditLaborCostModal
//                     isOpen={isEditModalOpen}
//                     onClose={() => setIsEditModalOpen(false)}
//                     record={editingRecord}
//                     onSave={handleSaveEdit}
//                     availableLocals={availableLocals}
//                     availableWorkers={availableWorkers}
//                 />
//             )}
//         </div>
//     );
// };

// export default HomeContent;

















// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//     FaEuroSign, FaMapMarkerAlt, FaSeedling, FaCloudSun, FaBell, FaCalculator, 
//     FaMoneyBillWave, FaListAlt, FaRulerCombined, FaClock, FaCalendarAlt, FaChartLine,
//     FaEdit,
//     FaTimes,
//     FaCalendarDay,
//     FaUserFriends,
//     FaTools,
//     FaUser,
//     FaTruck,
//     FaSave,
//     FaHome,
//     FaTrash
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion'; // 💡 Añadida AnimatePresence
// import { onAuthStateChanged } from 'firebase/auth';
// import {
//     collection,
//     query,
//     onSnapshot,
//     where,
//     orderBy,
//     getFirestore,
//     deleteDoc, 
//     doc, 
//     updateDoc
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // --- Componentes que se asume que están importados de otros archivos ---
// // <=== SOLICITADO: Importación del componente WeatherForecast
// import WeatherForecast from '../COSTOS/WeatherForecast'; 

// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard} from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';
// import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
// import SummaryCard from '../COSTOS/SummaryCard';
// import SprayAdvisory from '../COSTOS/SprayAdvisory';

// // <=== SOLICITADO: Constantes de configuración para el componente de clima
// // ⚠️ ATENCIÓN: DEBES REEMPLAZAR ESTOS VALORES
// const OPENWEATHER_API_KEY = "25d21a264f7dcdfb5be61655b423da67"; // Reemplaza con tu clave
// const DEFAULT_CITY = "Balsicas,es"; // Reemplaza con la ciudad deseada


// // =======================================================================
// // === 0. CONSTANTES DE CONFIGURACIÓN DE FIREBASE
// // =======================================================================
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
// const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/employees`; 
// const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;
// const ENTITIES_COLLECTION_PATH = `artifacts/${appId}/public/data/entities`;


// // =======================================================================
// // === 1. COMPONENTE: EditLaborCostModal (Modal de Edición)
// // =======================================================================
// const EditLaborCostModal = ({ isOpen, onClose, record, onSave, availableLocals, availableWorkers }) => {
    
//     const [formData, setFormData] = useState({
//         date: record?.date || '',
//         totalHours: record?.totalHours || 0,
//         ratePerHour: record?.ratePerHour || 0,
//         localName: record?.localName || '',
//         workerNames: record?.workerNames || (record?.workerName ? [record.workerName] : []),
//         operationName: record?.operationName || '',
//     });
    
//     // Recalcula el coste estimado basado en el formulario
//     const workersCount = Array.isArray(formData.workerNames) ? formData.workerNames.length : 1;
//     const cost = (parseFloat(formData.totalHours || 0) * parseFloat(formData.ratePerHour || 0) * workersCount).toFixed(2);
    
//     // Inicializar estado al abrir el modal con el registro actual
//     useEffect(() => {
//         if (record) {
//             const initialWorkerNames = Array.isArray(record.workerNames) 
//                 ? record.workerNames 
//                 : (record.workerName ? [record.workerName] : []);

//             setFormData({
//                 date: record.date || '',
//                 totalHours: parseFloat(record.totalHours || 0),
//                 ratePerHour: parseFloat(record.ratePerHour || 0),
//                 localName: record.localName || '',
//                 workerNames: initialWorkerNames,
//                 operationName: record.operationName || '',
//             });
//         }
//     }, [record]);


//     const handleChange = (e) => {
//         const { name, value, type, selectedOptions } = e.target;
        
//         if (name === 'workerNames' && type === 'select-multiple') {
//             const selectedWorkers = Array.from(selectedOptions, option => option.value);
//             setFormData(prev => ({ ...prev, workerNames: selectedWorkers }));
//         } else if (name === 'totalHours' || name === 'ratePerHour') {
//              const numericValue = value === '' ? 0 : (parseFloat(value) || 0);
//              setFormData(prev => ({ ...prev, [name]: numericValue }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };
    
//     const handleSave = () => {
//         if (!formData.date || !formData.localName || (Array.isArray(formData.workerNames) && formData.workerNames.length === 0)) {
//             alert("Por favor, complete los campos obligatorios: Fecha, Proyecto y al menos un Trabajador.");
//             return;
//         }
        
//         const updatedData = {
//             ...record, 
//             date: formData.date,
//             totalHours: parseFloat(formData.totalHours),
//             ratePerHour: parseFloat(formData.ratePerHour),
//             localName: formData.localName,
//             operationName: formData.operationName,
//             workerNames: formData.workerNames,
//             workerName: Array.isArray(formData.workerNames) && formData.workerNames.length === 1 ? formData.workerNames[0] : null,
//         };
        
//         onSave(record.id, updatedData);
//     };

//     const modalVariants = {
//         hidden: { opacity: 0, scale: 0.8, y: "-100vh" },
//         visible: { 
//             opacity: 1, 
//             scale: 1, 
//             y: "0",
//             transition: { type: "spring", stiffness: 300, damping: 25, ease: "easeOut" }
//         },
//         exit: { opacity: 0, scale: 0.8, y: "100vh" }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={onClose} 
//                 >
//                     <motion.div
//                         className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
//                         variants={modalVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         onClick={e => e.stopPropagation()} 
//                     >
//                         <h3 className="text-2xl font-extrabold text-red-800 border-b-2 border-red-100 pb-3 mb-4 flex items-center">
//                             <FaEdit className="mr-2 text-red-500" /> Edición Rápida de Registro
//                         </h3>
                        
//                         <button 
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
//                             aria-label="Cerrar Modal"
//                         >
//                             <FaTimes className="text-2xl" />
//                         </button>

//                         <form className="space-y-4">
//                             {/* Fila 1: Fecha y Horas */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaCalendarDay className="mr-2 text-red-500" /> Fecha
//                                     </label>
//                                     <input 
//                                         type="date"
//                                         name="date"
//                                         value={formData.date}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaClock className="mr-2 text-gray-500" /> Horas Netas (h)
//                                     </label>
//                                     <input 
//                                         type="number"
//                                         name="totalHours"
//                                         value={formData.totalHours}
//                                         onChange={handleChange}
//                                         step="0.01"
//                                         min="0"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Fila 2: Tasa y Operación */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaMoneyBillWave className="mr-2 text-green-500" /> Tasa/Hora (€)
//                                     </label>
//                                     <input 
//                                         type="number"
//                                         name="ratePerHour"
//                                         value={formData.ratePerHour}
//                                         onChange={handleChange}
//                                         step="0.01"
//                                         min="0"
//                                         required
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                         <FaTools className="mr-2 text-blue-500" /> Operación
//                                     </label>
//                                     <input 
//                                         type="text"
//                                         name="operationName"
//                                         value={formData.operationName}
//                                         onChange={handleChange}
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                         placeholder="Ej: Poda, Cosecha, Siembra..."
//                                     />
//                                 </div>
//                             </div>

//                             {/* Fila 3: Proyecto (Local) */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                     <FaSeedling className="mr-2 text-green-500" /> Proyecto/Cultivo
//                                 </label>
//                                 <select
//                                     name="localName"
//                                     value={formData.localName}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
//                                 >
//                                     <option value="">Selecciona Proyecto</option>
//                                     {availableLocals.map(local => (
//                                         <option key={local.id} value={local.name}>{local.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Fila 4: Trabajadores (Multi-select) */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
//                                     <FaUserFriends className="mr-2 text-purple-500" /> Trabajador(es)
//                                 </label>
//                                 <select
//                                     name="workerNames"
//                                     multiple={true}
//                                     value={formData.workerNames}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-24 transition duration-150"
//                                 >
//                                     {availableWorkers.map(worker => (
//                                         <option key={worker} value={worker}>{worker}</option>
//                                     ))}
//                                 </select>
//                                 <p className="text-xs text-gray-500 mt-1">Mantén **Ctrl/Cmd** presionado para seleccionar múltiples.</p>
//                             </div>
//                         </form>

//                         {/* Resumen de Costo y Botones de Acción */}
//                         <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center">
//                             <p className="flex items-center font-bold text-lg text-red-700">
//                                 <FaEuroSign className="mr-2"/> Nuevo Coste Est.: **{cost} €**
//                             </p>
//                             <button 
//                                 onClick={handleSave}
//                                 className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg flex items-center transition-all duration-300 transform hover:scale-105 active:scale-95"
//                                 aria-label="Guardar Cambios"
//                             >
//                                 <FaSave className="mr-2"/> Guardar Cambios
//                             </button>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };


// // =======================================================================
// // === 2. COMPONENTE LaborCostDashboardDisplay (Rediseñado con tabla profesional)
// // =======================================================================
// const LaborCostDashboardDisplay = ({ 
//     timesheets = [], 
//     error,
//     onEditRecord, 
//     onDeleteRecord 
// }) => {
    
//     if (error) {
//         return (
//             <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm font-medium text-red-700">{error}</p>
//             </div>
//         );
//     }

//     // Función que maneja la eliminación con confirmación
//     const handleDelete = (record) => {
//         const workerInfo = record.workerNames?.join(', ') || record.workerName || 'Registro';
//         if (window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${workerInfo} del ${record.date}? Esta acción es irreversible.`)) {
//             onDeleteRecord(record.id);
//         }
//     };

//     if (timesheets.length === 0) {
//         return (
//             <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
//                 <FaListAlt className="text-4xl text-gray-300 mx-auto mb-3" />
//                 <p className="text-sm text-gray-500">No se encontraron registros de tiempo</p>
//             </div>
//         );
//     }

//     return (
//         <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//                 <thead>
//                     <tr className="border-b border-gray-200 bg-gray-50">
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trabajador(es)</th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operación</th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cultivo</th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Horas</th>
//                         <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Coste</th>
//                         <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                     <AnimatePresence mode="popLayout">
//                         {timesheets.map((record, index) => {
//                             const totalHours = parseFloat(record.totalHours) || 0;
//                             const ratePerHour = parseFloat(record.ratePerHour) || 0;
//                             const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1)); 
//                             const cost = (totalHours * ratePerHour * workersCount).toFixed(2);
                            
//                             const workerDisplay = Array.isArray(record.workerNames) && record.workerNames.length > 0 
//                                 ? record.workerNames.join(', ')
//                                 : record.workerName || 'Personal no especificado';

//                             return (
//                                 <motion.tr 
//                                     key={record.id}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
//                                     layout
//                                     className={`
//                                         hover:bg-gray-50 
//                                         transition-colors 
//                                         ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
//                                     `}
//                                 >
//                                     <td className="px-4 py-3 whitespace-nowrap">
//                                         <div className="flex items-center text-gray-700">
//                                             <FaCalendarDay className="mr-2 text-gray-400 text-xs" />
//                                             <span className="font-medium">{record.date}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center text-gray-700">
//                                             <FaUser className="mr-2 text-gray-400 text-xs flex-shrink-0" />
//                                             <span className="font-medium truncate max-w-[150px]" title={workerDisplay}>
//                                                 {workerDisplay}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center text-gray-600">
//                                             <FaTools className="mr-2 text-blue-400 text-xs" />
//                                             <span className="truncate max-w-[120px]" title={record.operationName}>
//                                                 {record.operationName}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center text-gray-600">
//                                             <FaSeedling className="mr-2 text-green-400 text-xs" />
//                                             <span className="truncate max-w-[120px]" title={record.localName}>
//                                                 {record.localName}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3 text-right">
//                                         <span className="font-semibold text-gray-700">
//                                             {totalHours.toFixed(2)} h
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 text-right">
//                                         <span className="font-bold text-green-600">
//                                             {cost} €
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center justify-center space-x-2">
//                                             <button 
//                                                 onClick={() => onEditRecord(record)}
//                                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                                                 title="Editar"
//                                             >
//                                                 <FaEdit className="text-sm" />
//                                             </button>
//                                             <button 
//                                                 onClick={() => handleDelete(record)}
//                                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                                                 title="Eliminar"
//                                             >
//                                                 <FaTrash className="text-sm" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </motion.tr>
//                             );
//                         })}
//                     </AnimatePresence>
//                 </tbody>
//             </table>
//         </div>
//     );
// };


// // =======================================================================
// // === 3. HOOKS PERSONALIZADOS
// // =======================================================================
// // (Se mantienen como los proporcionaste, ya que son correctos)
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });
//         return () => unsubscribe(); 
//     }, []); 
//     return { db, userId, loadingAuth };
// };

// const useProjectAndEntityData = (db, userId, setNotification) => {
//     const [availableLocals, setAvailableLocals] = useState([]); 
//     const [availableEntityObjects, setAvailableEntityObjects] = useState([]); 
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingData(false); return; }
//         const firestore = getFirestore();
        
//         const qProjects = query(collection(firestore, PROJECTS_COLLECTION_PATH), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, type: doc.data().cropType || 'Proyecto General', ...doc.data() }));
//             setAvailableLocals(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
//             setLoadingData(false);
//         });

//         const qEntities = query(collection(firestore, ENTITIES_COLLECTION_PATH), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntityObjects(entities); 
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => { unsubscribeProjects(); unsubscribeEntities(); };
//     }, [db, userId, setNotification]);
//     return { availableLocals, availableEntityObjects, loadingData }; 
// };

// const useWorkerData = (db, userId, setNotification) => {
//     const [availableWorkers, setAvailableWorkers] = useState([]); 
//     const [loadingWorkers, setLoadingWorkers] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingWorkers(false); return; }
//         const firestore = getFirestore();
//         const qWorkers = query(collection(firestore, WORKERS_COLLECTION_PATH), where("userId", "==", userId));
        
//         const unsubscribeWorkers = onSnapshot(qWorkers, (snapshot) => {
//             const workers = snapshot.docs.map(doc => doc.data().name).sort(); 
//             setAvailableWorkers(workers);
//             setLoadingWorkers(false);
//         }, (error) => {
//             console.error("Firestore worker data error:", error);
//             setNotification({ message: "Error al cargar la lista de trabajadores.", type: "error" });
//             setLoadingWorkers(false);
//         });
//         return () => unsubscribeWorkers();
//     }, [db, userId, setNotification]);
//     return { availableWorkers, loadingWorkers };
// };

// const useTimesheetsData = (db, userId, setErrorMessage) => {
//     const [timesheets, setTimesheets] = useState([]);
//     const [loadingTimesheets, setLoadingTimesheets] = useState(true);
//     const [errorTimesheets, setErrorTimesheets] = useState(null);

//     useEffect(() => {
//         if (!db || !userId) { setLoadingTimesheets(false); return; }
//         setErrorTimesheets(null);
//         setLoadingTimesheets(true);

//         try {
//             const firestore = db || getFirestore();
//             const timesheetQuery = query(
//                 collection(firestore, TIMESHEET_COLLECTION_PATH),
//                 where("createdBy", "==", userId),
//                 orderBy("createdAt", "desc") 
//             );

//             const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setTimesheets(data);
//                 setLoadingTimesheets(false);
//                 if (errorTimesheets) setErrorTimesheets(null); 
//             }, (err) => {
//                 console.error("Error al cargar timesheets:", err);
//                 const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
//                 setErrorTimesheets(userMessage);
//                 setErrorMessage({ message: userMessage, type: 'error' });
//                 setLoadingTimesheets(false);
//             });
//             return () => unsubscribe(); 
//         } catch (e) {
//             console.error("Error setting up timesheet listener:", e);
//             const userMessage = "Error interno al configurar la escucha de datos.";
//             setErrorTimesheets(userMessage);
//             setErrorMessage({ message: userMessage, type: 'error' });
//             setLoadingTimesheets(false);
//         }
//     }, [db, userId, setErrorMessage, errorTimesheets]);

//     return { timesheets, loadingTimesheets, errorTimesheets };
// };

// // const DashboardCard = ({ 
// //     title, 
// //     icon, 
// //     borderColor = 'border-blue-500', 
// //     titleColor = 'text-blue-700',   
// //     children, 
// //     className = '', 
// //     headerContent, 
// //     fullHeight = false 
// // }) => {

// //     const cardClasses = `
// //         bg-white 
// //         rounded-xl 
// //         shadow-xl 
// //         border-t-4 
// //         ${borderColor} 
// //         p-5 
// //         transition-all 
// //         duration-300 
// //         ${className} 
// //         ${fullHeight ? 'flex flex-col h-full' : ''}
// //     `;

// //     const headerClasses = `
// //         text-xl 
// //         font-extrabold 
// //         ${titleColor} 
// //         border-b-2 
// //         border-gray-100 
// //         pb-3 
// //         mb-4 
// //         flex 
// //         items-center
// //     `;

// //     return (
// //         <div className={cardClasses}>
// //             <h3 className={headerClasses}>
// //                 {icon && <span className="text-2xl mr-2">{icon}</span>}
// //                 {title}
// //                 {headerContent && <div className="ml-auto">{headerContent}</div>}
// //             </h3>
// //             <div className={`flex-grow ${fullHeight ? 'flex flex-col' : ''}`}>
// //                 {children}
// //             </div>
// //         </div>
// //     );
// // };

// // const DashboardCard = ({ 
// //     title, 
// //     icon, 
// //     // Usaremos un color neutro por defecto, más profesional
// //     borderColor = 'border-gray-300', 
// //     titleColor = 'text-gray-800', // Color más oscuro por defecto para legibilidad
// //     children, 
// //     className = '', 
// //     headerContent, 
// //     // Eliminamos 'fullHeight' ya que podemos manejar esto directamente en 'className' 
// //     // o el componente padre usando flex/grid.
// // }) => {

// //     const cardClasses = `
// //         bg-white 
// //         rounded-lg 
// //         shadow-lg          
// //         border-t-4 
// //         ${borderColor} 
// //         p-5 
// //         transition-shadow 
// //         duration-300 
// //         ${className} 
// //         // Siempre usamos flex-col para controlar mejor el espacio interno
// //         flex flex-col 
// //     `;

// //     const headerClasses = `
// //         text-lg sm:text-xl // Ajuste de tamaño de fuente responsivo
// //         font-bold 
// //         ${titleColor} 
// //         border-b 
// //         border-gray-100 
// //         pb-3 
// //         mb-3 
// //         flex 
// //         items-center
// //         justify-between // Asegura que title y headerContent se separen
// //         flex-wrap // Permite que el contenido del encabezado se ajuste en pantallas pequeñas
// //     `;

// //     return (
// //         <div className={cardClasses}>
            
// //             {/* ENCABEZADO */}
// //             <h3 className={headerClasses}>
// //                 <div className="flex items-center">
// //                     {icon && <span className="text-xl sm:text-2xl mr-2 text-gray-600">{icon}</span>}
// //                     {title}
// //                 </div>
// //                 {headerContent && <div className="mt-1 sm:mt-0 ml-4">{headerContent}</div>}
// //             </h3>
            
// //             {/* CONTENIDO (Aseguramos que el contenido ocupe el espacio restante) */}
// //             <div className="flex-grow min-h-0 overflow-auto">
// //                 {children}
// //             </div>
            
// //         </div>
// //     );
// // };



// // =======================================================================
// // === COMPONENTE: DashboardCard (Rediseñado con estilo empresarial)
// // =======================================================================
// const DashboardCard = ({ 
//     title, 
//     icon, 
//     borderColor = 'border-gray-200', 
//     titleColor = 'text-gray-800', 
//     className = '', 
//     children,
//     badge = null 
// }) => (
//     <div className={`
//         bg-white 
//         rounded-lg 
//         shadow-sm 
//         border border-gray-200
//         hover:shadow-md 
//         transition-all 
//         duration-300 
//         overflow-hidden
//         ${className}
//     `}>
//         {/* Header con diseño profesional */}
//         <div className={`
//             flex items-center justify-between 
//             px-5 py-4 
//             border-b border-gray-100
//             bg-gradient-to-r from-gray-50 to-white
//         `}>
//             <div className="flex items-center space-x-3">
//                 {icon && (
//                     <div className={`
//                         w-10 h-10 
//                         rounded-lg 
//                         bg-gradient-to-br from-gray-100 to-gray-50
//                         flex items-center justify-center
//                         text-xl
//                         ${titleColor}
//                     `}>
//                         {icon}
//                     </div>
//                 )}
//                 <h3 className={`text-base font-semibold ${titleColor}`}>
//                     {title}
//                 </h3>
//             </div>
//             {badge && (
//                 <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
//                     {badge}
//                 </span>
//             )}
//         </div>
        
//         {/* Contenido */}
//         <div className="p-5">
//             {children}
//         </div>
//     </div>
// );



// // =======================================================================
// // === 4. COMPONENTE HomeView (Con componentes de clima)
// // =======================================================================

// // export const HomeView = ({ 
// //     dailyData, 
// //     greenhouses = [], 
// //     selectedGreenhouseId, 
// //     setSelectedGreenhouseId, 
// //     updateGreenhouseConfig, 
// //     greenhouseConfig, 
// //     timesheets,
// //     handleEdit, // Asumiendo que vienen de un hook
// //     handleDelete // Asumiendo que vienen de un hook
// // }) => {
    
// //     // Lógica existente
// //     const config = greenhouseConfig || {}; 
// //     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
// //     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
// //         const dayTotal = (day.items || []).reduce((itemSum, item) => 
// //             itemSum + parseFloat(item.result || 0), 0);
// //         return sum + dayTotal;
// //     }, 0);

// //     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
// //     const handleCardSelect = (e) => { setSelectedGreenhouseId(e.target.value); };






// // return (
// //     // 🚨 ÚNICO DIV PRINCIPAL: Fondo ligero, grilla fluida (1 col -> 2 cols -> 3 cols)
// //     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen 
// //         grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        
// //         {/* 1. RESUMEN GLOBAL (Ocupa todo el ancho siempre, alta prioridad) */}
// //         <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-0"> 
// //             <SummaryCard timesheets={timesheets} /> 
// //         </div>

// //         {/* --- SECCIÓN PRINCIPAL: MAPA Y DECISIONES CRÍTICAS --- */}

// //         {/* 2. MAPA: Máxima Prioridad Visual (Ocupa 1/2 en MD, 2/3 en LG) */}
// //         <div className="col-span-1 md:col-span-1 lg:col-span-2">
// //             <DashboardCard 
// //                 title="Visión General de Invernaderos" 
// //                 icon={<FaMapMarkerAlt />} 
// //                 borderColor="border-gray-500"
// //                 titleColor="text-gray-700" 
// //                 // Altura responsiva CLAVE para que el mapa sea el foco
// //                 className="h-[400px] sm:h-[500px] lg:h-[65vh] overflow-hidden" 
// //             >
// //                 {/* Asegúrate de que GreenhouseMap tiene h-full w-full internamente */}
// //                 <GreenhouseMap 
// //                     greenhouses={greenhouses} 
// //                     onGreenhouseSelect={handleMapSelect} 
// //                     selectedGreenhouseId={selectedGreenhouseId} 
// //                 />
// //             </DashboardCard>
// //         </div>

// //         {/* 3. ASESORAMIENTO CRÍTICO (Reposicionado para compartir fila con el Mapa) */}
// //         <div className="col-span-1 md:col-span-1 lg:col-span-1">
// //             <DashboardCard 
// //                 title="Asesoramiento Crítico de Pulverización" 
// //                 icon={<FaBell />} 
// //                 borderColor="border-green-600" 
// //                 titleColor="text-green-800"
// //                 // CLAVE RESPONSIVA: Altura completa (h-full) para estirarse al lado del mapa en desktop
// //                 className="h-full max-h-fit overflow-y-auto" 
// //             >
// //                 <div className="p-1"> 
// //                     {/* SprayAdvisory tiene que gestionar su propia responsividad dual (Tabla vs. Tarjetas) */}
// //                     <SprayAdvisory/>
// //                 </div>
// //             </DashboardCard>
// //         </div>

// //         {/* --- SECCIÓN SECUNDARIA: PRONÓSTICO Y ANÁLISIS --- */}

// //         {/* 4. PRONÓSTICO EXTENDIDO (Ocupa 2/3 en LG) */}
// //         <div className="col-span-1 md:col-span-1 lg:col-span-2">
// //             <DashboardCard 
// //                 title="Pronóstico Extendido (5 Días)" 
// //                 icon={<FaCloudSun />} 
// //                 borderColor="border-blue-500" 
// //                 titleColor="text-blue-700"
// //             >
// //                 {/* CLAVE ANTI-DESBORDE: Contenedor para manejar el scroll horizontal de la tabla de 5 días */}
// //                 <div className="p-2 overflow-x-auto">
// //                     <WeatherForecast apiKey={OPENWEATHER_API_KEY} city={DEFAULT_CITY} days={5} /> 
// //                 </div>
// //             </DashboardCard>
// //         </div>

// //         {/* 5. GRÁFICA / KPI (Añadido para balancear la fila 3, ocupa 1/3 en LG) */}
// //         {/* Tu código anterior estaba comentado, lo agregamos como un contenedor funcional */}
// //         <div className="col-span-1 md:col-span-1 lg:col-span-1"> 
// //             <DashboardCard 
// //                 title="Producción vs. Meta" 
// //                 icon={<FaChartLine />} 
// //                 borderColor="border-orange-500"
// //                 titleColor="text-orange-700"
// //                 // Altura completa para ajustarse al Pronóstico Extendido
// //                 className="h-full" 
// //             >
// //                 <div className="h-full flex items-center justify-center text-gray-400">
// //                     [Área para Gráfica de Series de Tiempo]
// //                 </div>
// //             </DashboardCard>
// //         </div>


// //         {/* 6. DETALLE DE MANO DE OBRA (Ocupa todo el ancho al final, baja prioridad de lectura) */}
// //         <div className="col-span-1 md:col-span-2 lg:col-span-3"> 
// //             <DashboardCard
// //                 title={`Detalle de Registros de Mano de Obra (${timesheets ? timesheets.length : 0})`}
// //                 icon={<FaListAlt />}
// //                 borderColor="border-gray-300" 
// //                 titleColor="text-gray-700"
// //                 // Altura limitada para que la tabla no sea infinita
// //                 className="h-auto max-h-[500px] overflow-y-auto" 
// //             >
// //                 {/* CLAVE ANTI-DESBORDE: Contenedor para manejar el scroll horizontal de la tabla de costos */}
// //                 <div className="overflow-x-auto">
// //                     <LaborCostDashboardDisplay 
// //                         timesheets={timesheets || []}
// //                         onEditRecord={handleEdit}
// //                         onDeleteRecord={handleDelete}
// //                     />
// //                 </div>
// //             </DashboardCard>
// //         </div>
        
// //     </div>
// //     // Fin del único DIV principal
// // );
// //  }






// // export const HomeView = ({ 
// //     dailyData, 
// //     greenhouses = [], 
// //     selectedGreenhouseId, 
// //     setSelectedGreenhouseId, 
// //     updateGreenhouseConfig, 
// //     greenhouseConfig, 
// //     timesheets,
// //     handleEdit,
// //     handleDelete
// // }) => {
    
// //     // ... [Lógica existente - sin cambios] ...
// //     const config = greenhouseConfig || {}; 
// //     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
// //     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
// //         const dayTotal = (day.items || []).reduce((itemSum, item) => 
// //             itemSum + parseFloat(item.result || 0), 0);
// //         return sum + dayTotal;
// //     }, 0);

// //     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
// //     const handleCardSelect = (e) => { setSelectedGreenhouseId(e.target.value); };
    
// //     // ------------------------------------------
// //     // El DashboardCard es crucial para el estilo:
// //     // Asegúrate de que DashboardCard aplica el estilo minimalista,
// //     // por ejemplo: "bg-white p-4 rounded-xl shadow-lg border border-l-4"
// //     // ------------------------------------------

// //     return (
// //         // 🚨 CAMBIO CLAVE: Grid principal con 1 columna por defecto, 2 en pantallas medianas y grandes.
// //         // Se añade `items-start` para evitar que las tarjetas se estiren infinitamente si no tienen `h-full`.
// //         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 items-start"> 
            
// //             {/* 1. RESUMEN GLOBAL (Ocupa todo el ancho siempre - Fila 1) */}
// //             <div className="col-span-1 md:col-span-2"> 
// //                 {/* SummaryCard ya es minimalista y compacto, encaja perfecto. */}
// //                 <SummaryCard timesheets={timesheets} /> 
// //             </div>

// //             {/* --- SECCIÓN PRINCIPAL DE 2 PANELES --- */}
            
// //             {/* PANELA I (Izquierda/Principal) - Ocupa 1/2 */}
// //             <div className="col-span-1 grid grid-cols-1 gap-6">
                
// //                 {/* 2. MAPA: Componente principal con altura fija/alta */}
// //                 <DashboardCard 
// //                     title="Visión General de Invernaderos" 
// //                     icon={<FaMapMarkerAlt />} 
// //                     borderColor="border-gray-500"
// //                     titleColor="text-gray-700" 
// //                     // Altura fija/mínima para dominar el panel
// //                     className="h-[400px] lg:h-[600px] overflow-hidden" 
// //                 >
// //                     <GreenhouseMap 
// //                         greenhouses={greenhouses} 
// //                         onGreenhouseSelect={handleMapSelect} 
// //                         selectedGreenhouseId={selectedGreenhouseId} 
// //                     />
// //                 </DashboardCard>
                
// //                 {/* 3. PRONÓSTICO EXTENDIDO (Debajo del Mapa) */}
// //                 <DashboardCard 
// //                     title="Pronóstico Extendido (5 Días)" 
// //                     icon={<FaCloudSun />} 
// //                     borderColor="border-blue-500" 
// //                     titleColor="text-blue-700"
// //                     className="h-auto" // Se ajusta al contenido
// //                 >
// //                     <div className="p-2 overflow-x-auto">
// //                         {/* WeatherForecast tiene que gestionar su propia tabla o diseño horizontal */}
// //                         <WeatherForecast apiKey={'OPENWEATHER_API_KEY'} city={'DEFAULT_CITY'} days={5} /> 
// //                     </div>
// //                 </DashboardCard>
                
// //             </div>
            
// //             {/* PANEL B (Derecha/Secundario) - Ocupa 1/2 */}
// //             <div className="col-span-1 grid grid-cols-1 gap-6">
                
// //                 {/* 4. ASESORAMIENTO CRÍTICO (Arriba, comparte el espacio vertical) */}
// //                 <DashboardCard 
// //                     title="Asesoramiento Crítico de Pulverización" 
// //                     icon={<FaBell />} 
// //                     borderColor="border-green-600" 
// //                     titleColor="text-green-800"
// //                     // Altura ajustada: CLAVE para encajar con los otros componentes del panel B
// //                     className="h-auto max-h-[400px] overflow-y-auto" 
// //                 >
// //                     <div className="p-1"> 
// //                         <SprayAdvisory/>
// //                     </div>
// //                 </DashboardCard>

// //                 {/* 5. GRÁFICA / KPI (Medio) */}
// //                 <DashboardCard 
// //                     title="Producción vs. Meta" 
// //                     icon={<FaChartLine />} 
// //                     borderColor="border-orange-500"
// //                     titleColor="text-orange-700"
// //                     className="h-[250px]" // Altura fija para visualización de gráfica
// //                 >
// //                     <div className="h-full flex items-center justify-center text-gray-400">
// //                         [Área para Gráfica de Series de Tiempo]
// //                     </div>
// //                 </DashboardCard>
                
// //                 {/* 6. OTRO KPI O TARJETA DE RESUMEN PEQUEÑA (Abajo) */}
// //                 <DashboardCard 
// //                     title="Resumen de Cultivo" 
// //                     icon={<FaCloudSun />} 
// //                     borderColor="border-purple-500"
// //                     titleColor="text-purple-700"
// //                     className="h-auto" 
// //                 >
// //                     <div className="p-2">
// //                          <div className="text-sm text-gray-600">Cultivo Activo: **{currentCropName}**</div>
// //                          <div className="text-sm text-gray-600">Producción Total: **{totalProduction.toFixed(2)}** kg</div>
// //                          {/* [Añadir más KPIs aquí] */}
// //                     </div>
// //                 </DashboardCard>
// //             </div>
            
// //             {/* 7. DETALLE DE MANO DE OBRA (Ocupa todo el ancho al final - Fila 3) */}
// //             <div className="col-span-1 md:col-span-2"> 
// //                 <DashboardCard
// //                     title={`Histórico de Registros de Mano de Obra (${timesheets ? timesheets.length : 0})`}
// //                     icon={<FaListAlt />}
// //                     borderColor="border-gray-300" 
// //                     titleColor="text-gray-700"
// //                     className="h-auto max-h-[400px] overflow-y-auto" 
// //                 >
// //                     <div className="overflow-x-auto p-1">
// //                         <LaborCostDashboardDisplay 
// //                             timesheets={timesheets || []}
// //                             onEditRecord={handleEdit}
// //                             onDeleteRecord={handleDelete}
// //                         />
// //                     </div>
// //                 </DashboardCard>
// //             </div>
            
// //         </div>
// //     );
// // };




// export const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets,
//     handleEdit,
//     handleDelete
// }) => {
    
//     // Lógica existente
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
    
//     return (
//         <div className="p-6 bg-[#F5F7FA] min-h-screen">
            
//             {/* 1. RESUMEN GLOBAL - Ancho completo */}
//             <div className="mb-6">
//                 {/* <SummaryCard timesheets={timesheets} />  */}
//             </div>

//             {/* 2. GRID PRINCIPAL - 2 Columnas uniformes y compactas */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
//                 {/* Mapa de Invernaderos */}
//                 <DashboardCard 
//                     title="Visión General de Invernaderos" 
//                     icon={<FaMapMarkerAlt />} 
//                     titleColor="text-gray-700"
//                     className="h-[400px]"
//                 >
//                     <div className="h-[300px] -m-5 mt-0">
//                         <GreenhouseMap 
//                             greenhouses={greenhouses} 
//                             onGreenhouseSelect={handleMapSelect} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                         />
//                     </div>
//                 </DashboardCard>

//                 {/* Pronóstico Hoy - Visual y Destacado */}
//                 <DashboardCard 
//                     title="Pronóstico Hoy" 
//                     icon={<FaCloudSun />} 
//                     titleColor="text-blue-600"
//                     className="h-[400px]"
//                 >
//                     <div className="h-[300px] flex items-center justify-center overflow-hidden">
//                         <WeatherForecast 
//                             apiKey={OPENWEATHER_API_KEY} 
//                             city={DEFAULT_CITY} 
//                             days={1} 
//                         />
//                     </div>
//                 </DashboardCard>

//                 {/* Asesoramiento Crítico */}
//                 <DashboardCard 
//                     title="Asesoramiento Crítico" 
//                     icon={<FaBell />} 
//                     titleColor="text-amber-600"
//                     className="h-[350px]"
//                 >
//                     <div className="overflow-y-auto h-[250px] -mx-5 px-5">
//                         <SprayAdvisory />
//                     </div>
//                 </DashboardCard>

//                 {/* Producción vs Meta */}
//                 <DashboardCard 
//                     title="Producción vs. Meta" 
//                     icon={<FaChartLine />} 
//                     titleColor="text-purple-600"
//                     className="h-[350px]"
//                 >
//                     <div className="h-[250px] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
//                         <FaChartLine className="text-6xl text-purple-300 mb-4" />
//                         <p className="text-sm font-medium text-gray-600">Gráfica en desarrollo</p>
//                         <div className="mt-4 grid grid-cols-2 gap-4 w-full px-8">
//                             <div className="text-center p-3 bg-white rounded-lg shadow-sm">
//                                 <p className="text-xs text-gray-500 mb-1">Producción</p>
//                                 <p className="text-lg font-bold text-green-600">{totalProduction.toFixed(0)} kg</p>
//                             </div>
//                             <div className="text-center p-3 bg-white rounded-lg shadow-sm">
//                                 <p className="text-xs text-gray-500 mb-1">Cultivo</p>
//                                 <p className="text-sm font-semibold text-gray-700 truncate">{currentCropName}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </DashboardCard>

//                 {/* Pronóstico 5 Días */}
//                 <DashboardCard 
//                     title="Pronóstico 5 Días" 
//                     icon={<FaCloudSun />} 
//                     titleColor="text-blue-600"
//                     className="h-[300px]"
//                 >
//                     <div className="overflow-x-auto -mx-5 px-5 h-[200px]">
//                         <WeatherForecast 
//                             apiKey={OPENWEATHER_API_KEY} 
//                             city={DEFAULT_CITY} 
//                             days={5} 
//                         />
//                     </div>
//                 </DashboardCard>

//                 {/* Información Rápida - Tipo Widget */}
//                 <DashboardCard 
//                     title="Información Rápida" 
//                     icon={<FaSeedling />} 
//                     titleColor="text-green-600"
//                     className="h-[300px]"
//                 >
//                     <div className="h-[200px] flex flex-col justify-center space-y-4">
//                         {/* Cultivo Activo */}
//                         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
//                                     <FaSeedling className="text-white text-xl" />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500 font-medium">Cultivo Activo</p>
//                                     <p className="text-base font-bold text-gray-800">{currentCropName}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Producción Total */}
//                         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
//                             <div className="flex items-center space-x-3">
//                                 <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
//                                     <FaChartLine className="text-white text-xl" />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500 font-medium">Producción Total</p>
//                                     <p className="text-xl font-bold text-green-600">{totalProduction.toFixed(2)} kg</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Última actualización */}
//                         <div className="text-center pt-2 border-t border-gray-100">
//                             <p className="text-xs text-gray-400">
//                                 Última actualización: {new Date().toLocaleDateString()}
//                             </p>
//                         </div>
//                     </div>
//                 </DashboardCard>
//             </div>

//             {/* 3. HISTORIAL DE MANO DE OBRA - Ancho completo */}
//             <DashboardCard
//                 title="Historial de Registros de Mano de Obra"
//                 icon={<FaListAlt />}
//                 titleColor="text-gray-700"
//                 badge={`${timesheets ? timesheets.length : 0} registros`}
//                 className="max-h-[500px]"
//             >
//                 <div className="overflow-y-auto max-h-[380px] -mx-5 px-5">
//                     <LaborCostDashboardDisplay 
//                         timesheets={timesheets || []}
//                         onEditRecord={handleEdit}
//                         onDeleteRecord={handleDelete}
//                     />
//                 </div>
//             </DashboardCard>
            
//         </div>
//     );
// };



// // =======================================================================
// // === 5. HOME CONTENT PRINCIPAL (Componente Padre)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
//     const [activeView, setActiveView] = useState('labor'); 
//     const [notification, setNotification] = useState(null); 
    
            
//     // 🚨 NUEVOS ESTADOS PARA EDICIÓN
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null); 

//     // 2. OBTENER PROYECTOS Y ENTIDADES (Objetos)
//     const { availableLocals, availableEntityObjects, loadingData } = useProjectAndEntityData(db, userId, setNotification); 
    
//     // 3. OBTENER TRABAJADORES (Nombres)
//     const { availableWorkers, loadingWorkers } = useWorkerData(db, userId, setNotification); 

//     // 4. CARGAR LOS TIMESHEETS GLOBALMENTE
//     const { timesheets, loadingTimesheets, errorTimesheets } = useTimesheetsData(db, userId, setNotification); 


//     const { ...restOfProps } = props;


//     // =======================================================================
//     // === CÁLCULO DE COSTES Y PREPARACIÓN DE LISTAS PARA SELECTS
//     // =======================================================================
//     const { 
//         timesheetTotalCost, 
//         timesheetTotalCostByProject, 
//         timesheetTotalCostByWorker,
//         availableProjectsNames, 
//         availableEntitiesNames 
//     } = useMemo(() => {
//         let totalCost = 0;
//         const costByProject = {};
//         const costByWorker = {}; 

//         timesheets.forEach(record => {
//             // Asegurar que las horas y tasas son números para el cálculo
//             const totalHours = parseFloat(record.totalHours) || 0;
//             const ratePerHour = parseFloat(record.ratePerHour) || 0;
//             // 💡 Manejar el formato de un trabajador o múltiples
//             const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1));
            
//             if (totalHours > 0 && ratePerHour > 0) {
//                 const cost = totalHours * ratePerHour * workersCount;
//                 totalCost += cost;
                
//                 // Agrupar por Proyecto
//                 const projectName = record.localName || 'General'; 
//                 costByProject[projectName] = (costByProject[projectName] || 0) + cost;

//                 // Agrupar por Trabajador (Solución para arrays o string)
//                 const workerNamesArray = Array.isArray(record.workerNames) ? record.workerNames : (record.workerName ? [record.workerName] : []);
                
//                 // Distribuir el coste total entre los trabajadores si son varios
//                 const costPerWorker = cost / workersCount;
//                 workerNamesArray.forEach(workerName => {
//                      costByWorker[workerName] = (costByWorker[workerName] || 0) + costPerWorker;
//                 });
//             }
//         });

//         // PREPARAR LISTAS DE NOMBRES (STRINGS) PARA EL CostDashboard
//         const projectsNames = availableLocals.map(l => l.name).sort();
//         const entitiesNames = availableEntityObjects.map(e => e.name).sort();

//         return {
//             timesheetTotalCost: totalCost, 
//             timesheetTotalCostByProject: costByProject, 
//             timesheetTotalCostByWorker: costByWorker, 
//             availableProjectsNames: projectsNames, 
//             availableEntitiesNames: entitiesNames, 
//         };
//     }, [timesheets, availableLocals, availableEntityObjects]); 

//     // =======================================================================
//     // === MANEJADORES DE ACCIÓN DE EDICIÓN Y ELIMINACIÓN
//     // =======================================================================
    
//     // MANEJADOR DE ELIMINACIÓN
//     const handleDeleteRecord = async (recordId) => {
//         try {
//             const firestore = db || getFirestore();
//             const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
//             await deleteDoc(recordRef);
//             setNotification({ message: "✅ Registro de tiempo eliminado con éxito.", type: 'success' });
//         } catch (error) {
//             console.error("Error al eliminar el registro:", error);
//             setNotification({ message: "❌ Error al eliminar el registro. Inténtelo de nuevo.", type: 'error' });
//         }
//     };
    
//     // MANEJADOR DE EDICIÓN (Abrir Modal)
//     const handleEditRecord = (record) => {
//         setEditingRecord(record);
//         setIsEditModalOpen(true);
//     };

//     // MANEJADOR DE GUARDADO DE EDICIÓN
//     const handleSaveEdit = async (recordId, updatedData) => {
//         try {
//             const firestore = db || getFirestore();
//             const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
            
//             // Excluir el 'id' al actualizar
//             const { id, ...dataToUpdate } = updatedData;
//             dataToUpdate.updatedAt = new Date(); // Opcional: añadir fecha de actualización
            
//             // Limpiar valores nulos o vacíos y asegurar tipo
//             dataToUpdate.totalHours = parseFloat(dataToUpdate.totalHours) || 0;
//             dataToUpdate.ratePerHour = parseFloat(dataToUpdate.ratePerHour) || 0;

//             await updateDoc(recordRef, dataToUpdate);

//             setNotification({ message: "✅ Registro actualizado con éxito.", type: 'success' });
//             setIsEditModalOpen(false); 
//             setEditingRecord(null);
//         } catch (error) {
//             console.error("Error al actualizar el registro:", error);
//             setNotification({ message: "❌ Error al actualizar el registro. Inténtelo de nuevo.", type: 'error' });
//         }
//     };

//     // --- Barra de Navegación de Vistas (Se mantiene igual) ---

//     const ViewTabs = () => (
//     // Contenedor principal: Quitamos el 'flex' de aquí y dejamos solo el borde inferior
//     <div className="mb-6 border-b border-gray-300"> 
//         {/* Nuevo Contenedor de Pestañas: 
//             - 'flex' mantiene los botones en línea.
//             - 'overflow-x-auto' permite el scroll horizontal si es necesario.
//             - 'whitespace-nowrap' asegura que los elementos NO se envuelvan.
//         */}
//         <div className="flex overflow-x-auto whitespace-nowrap"> 
//             <button
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 // Eliminé 'text-sm' de los botones para que el tamaño base sea sensible, pero puedes mantenerlo si quieres botones pequeños.
//                 className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
//                     ${ activeView === 'home' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
//                     ${ activeView === 'costs' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
//                     ${ activeView === 'employee_management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
//                     ${ activeView === 'management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
//                     ${ activeView === 'labor' ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     </div>
// );
//     // const ViewTabs = () => (
//     //     <div className="flex justify-start mb-6 border-b border-gray-300">
//     //         <button
//     //             onClick={() => { setActiveView('home'); setNotification(null); }}
//     //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'home' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//     //         >
//     //             <FaHome className="text-lg"/> <span>Dashboard</span>
//     //         </button>
//     //         <button
//     //             onClick={() => { setActiveView('costs'); setNotification(null); }}
//     //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'costs' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//     //         >
//     //             <FaEuroSign className="text-lg"/> <span>Costes</span>
//     //         </button>
//     //         <button
//     //             onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//     //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'employee_management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//     //         >
//     //             <FaUserFriends className="text-lg"/> <span>Personal</span>
//     //         </button>
//     //         <button
//     //             onClick={() => { setActiveView('management'); setNotification(null); }}
//     //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//     //         >
//     //             <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//     //         </button>
//     //         <button
//     //             onClick={() => { setActiveView('labor'); setNotification(null); }}
//     //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'labor' ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//     //         >
//     //             <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//     //         </button>
//     //     </div>
//     // );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData || loadingTimesheets || loadingWorkers) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : loadingData ? "Cargando datos maestros..." : loadingWorkers ? "Cargando lista de trabajadores..." : "Cargando registros de trabajo..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-[#F5F7FA]">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* MOSTRAR NOTIFICACIÓN */}
//             <AnimatePresence>
//                 {notification && (
//                     <motion.div 
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                         className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4 ${notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}
//                     >
//                         <strong className="font-bold">{notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}</strong>
//                         <span className="block sm:inline ml-2">{notification.message}</span>
//                         <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setNotification(null)}>❌</span>
//                     </motion.div>
//                 )}
//             </AnimatePresence>


//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (<HomeView {...restOfProps} timesheets={timesheets} />)}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         availableProjects={availableProjectsNames} 
//                         availableEntities={availableEntitiesNames} 
//                         availableWorkers={availableWorkers} 
//                         timesheetTotalCost={timesheetTotalCost}
//                         timesheetTotalCostByProject={timesheetTotalCostByProject}
//                         timesheetTotalCostByWorker={timesheetTotalCostByWorker} 
//                         availableLocals={availableLocals} 
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager db={db} userId={userId} setErrorMessage={setNotification} initialProjects={availableLocals} initialEntities={availableEntityObjects} />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement db={db} userId={userId} setErrorMessage={setNotification} availableEntities={availableEntityObjects} />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
//                 <div className="p-4 sm:p-6 pt-0">
//                     <div className="mb-8">
//                         <TimeSheetWizard db={db} userId={userId} setErrorMessage={setNotification} availableLocals={availableLocals} availableWorkers={availableWorkers} />
//                     </div>
//                     <SummaryCard timesheets={timesheets} /> 
//                     <div className="mt-6">
//                         <LaborCostDashboardDisplay 
//                             timesheets={timesheets} 
//                             error={errorTimesheets} 
//                             onEditRecord={handleEditRecord} // 💡 Pasar manejador de edición
//                             onDeleteRecord={handleDeleteRecord} // 💡 Pasar manejador de eliminación
//                         />
//                     </div>
//                 </div>
//             )}
            
//             {/* 🚨 Modal de Edición (Flotante) */}
//             {editingRecord && (
//                 <EditLaborCostModal
//                     isOpen={isEditModalOpen}
//                     onClose={() => setIsEditModalOpen(false)}
//                     record={editingRecord}
//                     onSave={handleSaveEdit}
//                     availableLocals={availableLocals}
//                     availableWorkers={availableWorkers}
//                 />
//             )}
//         </div>
//     );
// };

// export default HomeContent;










import React, { useState, useEffect, useMemo } from 'react';
import { 
    FaEuroSign, FaMapMarkerAlt, FaSeedling, FaCloudSun, FaBell, FaCalculator, 
    FaMoneyBillWave, FaListAlt, FaRulerCombined, FaClock, FaCalendarAlt, FaChartLine,
    FaEdit,
    FaTimes,
    FaCalendarDay,
    FaUserFriends,
    FaTools,
    FaUser,
    FaTruck,
    FaSave,
    FaHome,
    FaTrash
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // 💡 Añadida AnimatePresence
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    query,
    onSnapshot,
    where,
    orderBy,
    getFirestore,
    deleteDoc, 
    doc, 
    updateDoc
} from "firebase/firestore";

// 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
import { db, auth } from '../../firebaseConfig'; 

// --- Componentes que se asume que están importados de otros archivos ---
// <=== SOLICITADO: Importación del componente WeatherForecast
import WeatherForecast from '../COSTOS/WeatherForecast'; 

import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
import { CostDashboard} from '../COSTOS/CostDashboard'; 
import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
import EmployeeManagement from '../COSTOS/EmployeeManagement';
import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
import SummaryCard from '../COSTOS/SummaryCard';
import SprayAdvisory from '../COSTOS/SprayAdvisory';

// <=== SOLICITADO: Constantes de configuración para el componente de clima
// ⚠️ ATENCIÓN: DEBES REEMPLAZAR ESTOS VALORES
const OPENWEATHER_API_KEY = "25d21a264f7dcdfb5be61655b423da67"; // Reemplaza con tu clave
const DEFAULT_CITY = "Balsicas,es"; // Reemplaza con la ciudad deseada


// =======================================================================
// === 0. CONSTANTES DE CONFIGURACIÓN DE FIREBASE
// =======================================================================
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();
const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/employees`; 
const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;
const ENTITIES_COLLECTION_PATH = `artifacts/${appId}/public/data/entities`;


// =======================================================================
// === 1. COMPONENTE: EditLaborCostModal (Modal de Edición)
// =======================================================================
const EditLaborCostModal = ({ isOpen, onClose, record, onSave, availableLocals, availableWorkers }) => {
    
    const [formData, setFormData] = useState({
        date: record?.date || '',
        totalHours: record?.totalHours || 0,
        ratePerHour: record?.ratePerHour || 0,
        localName: record?.localName || '',
        workerNames: record?.workerNames || (record?.workerName ? [record.workerName] : []),
        operationName: record?.operationName || '',
    });
    
    // Recalcula el coste estimado basado en el formulario
    const workersCount = Array.isArray(formData.workerNames) ? formData.workerNames.length : 1;
    const cost = (parseFloat(formData.totalHours || 0) * parseFloat(formData.ratePerHour || 0) * workersCount).toFixed(2);
    
    // Inicializar estado al abrir el modal con el registro actual
    useEffect(() => {
        if (record) {
            const initialWorkerNames = Array.isArray(record.workerNames) 
                ? record.workerNames 
                : (record.workerName ? [record.workerName] : []);

            setFormData({
                date: record.date || '',
                totalHours: parseFloat(record.totalHours || 0),
                ratePerHour: parseFloat(record.ratePerHour || 0),
                localName: record.localName || '',
                workerNames: initialWorkerNames,
                operationName: record.operationName || '',
            });
        }
    }, [record]);


    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        
        if (name === 'workerNames' && type === 'select-multiple') {
            const selectedWorkers = Array.from(selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, workerNames: selectedWorkers }));
        } else if (name === 'totalHours' || name === 'ratePerHour') {
             const numericValue = value === '' ? 0 : (parseFloat(value) || 0);
             setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSave = () => {
        if (!formData.date || !formData.localName || (Array.isArray(formData.workerNames) && formData.workerNames.length === 0)) {
            alert("Por favor, complete los campos obligatorios: Fecha, Proyecto y al menos un Trabajador.");
            return;
        }
        
        const updatedData = {
            ...record, 
            date: formData.date,
            totalHours: parseFloat(formData.totalHours),
            ratePerHour: parseFloat(formData.ratePerHour),
            localName: formData.localName,
            operationName: formData.operationName,
            workerNames: formData.workerNames,
            workerName: Array.isArray(formData.workerNames) && formData.workerNames.length === 1 ? formData.workerNames[0] : null,
        };
        
        onSave(record.id, updatedData);
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: "-100vh" },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: "0",
            transition: { type: "spring", stiffness: 300, damping: 25, ease: "easeOut" }
        },
        exit: { opacity: 0, scale: 0.8, y: "100vh" }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose} 
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()} 
                    >
                        <h3 className="text-2xl font-extrabold text-red-800 border-b-2 border-red-100 pb-3 mb-4 flex items-center">
                            <FaEdit className="mr-2 text-red-500" /> Edición Rápida de Registro
                        </h3>
                        
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Cerrar Modal"
                        >
                            <FaTimes className="text-2xl" />
                        </button>

                        <form className="space-y-4">
                            {/* Fila 1: Fecha y Horas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                        <FaCalendarDay className="mr-2 text-red-500" /> Fecha
                                    </label>
                                    <input 
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                        <FaClock className="mr-2 text-gray-500" /> Horas Netas (h)
                                    </label>
                                    <input 
                                        type="number"
                                        name="totalHours"
                                        value={formData.totalHours}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                                    />
                                </div>
                            </div>

                            {/* Fila 2: Tasa y Operación */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                        <FaMoneyBillWave className="mr-2 text-green-500" /> Tasa/Hora (€)
                                    </label>
                                    <input 
                                        type="number"
                                        name="ratePerHour"
                                        value={formData.ratePerHour}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                        <FaTools className="mr-2 text-blue-500" /> Operación
                                    </label>
                                    <input 
                                        type="text"
                                        name="operationName"
                                        value={formData.operationName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        placeholder="Ej: Poda, Cosecha, Siembra..."
                                    />
                                </div>
                            </div>

                            {/* Fila 3: Proyecto (Local) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                    <FaSeedling className="mr-2 text-green-500" /> Proyecto/Cultivo
                                </label>
                                <select
                                    name="localName"
                                    value={formData.localName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
                                >
                                    <option value="">Selecciona Proyecto</option>
                                    {availableLocals.map(local => (
                                        <option key={local.id} value={local.name}>{local.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fila 4: Trabajadores (Multi-select) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 flex items-center mb-1">
                                    <FaUserFriends className="mr-2 text-purple-500" /> Trabajador(es)
                                </label>
                                <select
                                    name="workerNames"
                                    multiple={true}
                                    value={formData.workerNames}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-24 transition duration-150"
                                >
                                    {availableWorkers.map(worker => (
                                        <option key={worker} value={worker}>{worker}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Mantén **Ctrl/Cmd** presionado para seleccionar múltiples.</p>
                            </div>
                        </form>

                        {/* Resumen de Costo y Botones de Acción */}
                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex justify-between items-center">
                            <p className="flex items-center font-bold text-lg text-red-700">
                                <FaEuroSign className="mr-2"/> Nuevo Coste Est.: **{cost} €**
                            </p>
                            <button 
                                onClick={handleSave}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg flex items-center transition-all duration-300 transform hover:scale-105 active:scale-95"
                                aria-label="Guardar Cambios"
                            >
                                <FaSave className="mr-2"/> Guardar Cambios
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// =======================================================================
// === 2. COMPONENTE LaborCostDashboardDisplay (Rediseñado con tabla profesional)
// =======================================================================
const LaborCostDashboardDisplay = ({ 
    timesheets = [], 
    error,
    onEditRecord, 
    onDeleteRecord 
}) => {
    
    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
        );
    }

    // Función que maneja la eliminación con confirmación
    const handleDelete = (record) => {
        const workerInfo = record.workerNames?.join(', ') || record.workerName || 'Registro';
        if (window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${workerInfo} del ${record.date}? Esta acción es irreversible.`)) {
            onDeleteRecord(record.id);
        }
    };

    if (timesheets.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                <FaListAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No se encontraron registros de tiempo</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trabajador(es)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operación</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cultivo</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Horas</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Coste</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <AnimatePresence mode="popLayout">
                        {timesheets.map((record, index) => {
                            const totalHours = parseFloat(record.totalHours) || 0;
                            const ratePerHour = parseFloat(record.ratePerHour) || 0;
                            const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1)); 
                            const cost = (totalHours * ratePerHour * workersCount).toFixed(2);
                            
                            const workerDisplay = Array.isArray(record.workerNames) && record.workerNames.length > 0 
                                ? record.workerNames.join(', ')
                                : record.workerName || 'Personal no especificado';

                            return (
                                <motion.tr 
                                    key={record.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    layout
                                    className={`
                                        hover:bg-gray-50 
                                        transition-colors 
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                                    `}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center text-gray-700">
                                            <FaCalendarDay className="mr-2 text-gray-400 text-xs" />
                                            <span className="font-medium">{record.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-gray-700">
                                            <FaUser className="mr-2 text-gray-400 text-xs flex-shrink-0" />
                                            <span className="font-medium truncate max-w-[150px]" title={workerDisplay}>
                                                {workerDisplay}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaTools className="mr-2 text-blue-400 text-xs" />
                                            <span className="truncate max-w-[120px]" title={record.operationName}>
                                                {record.operationName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaSeedling className="mr-2 text-green-400 text-xs" />
                                            <span className="truncate max-w-[120px]" title={record.localName}>
                                                {record.localName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-semibold text-gray-700">
                                            {totalHours.toFixed(2)} h
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-bold text-green-600">
                                            {cost} €
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => onEditRecord(record)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit className="text-sm" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(record)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Eliminar"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};


// =======================================================================
// === 3. HOOKS PERSONALIZADOS
// =======================================================================
// (Se mantienen como los proporcionaste, ya que son correctos)
const useUserAuth = () => {
    const [userId, setUserId] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe(); 
    }, []); 
    return { db, userId, loadingAuth };
};

const useProjectAndEntityData = (db, userId, setNotification) => {
    const [availableLocals, setAvailableLocals] = useState([]); 
    const [availableEntityObjects, setAvailableEntityObjects] = useState([]); 
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!db || !userId) { setLoadingData(false); return; }
        const firestore = getFirestore();
        
        const qProjects = query(collection(firestore, PROJECTS_COLLECTION_PATH), where("userId", "==", userId));
        const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, type: doc.data().cropType || 'Proyecto General', ...doc.data() }));
            setAvailableLocals(projects);
            setLoadingData(false);
        }, (error) => {
            console.error("Firestore project data error:", error);
            setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
            setLoadingData(false);
        });

        const qEntities = query(collection(firestore, ENTITIES_COLLECTION_PATH), where("userId", "==", userId));
        const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
            const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvailableEntityObjects(entities); 
        }, (error) => {
            console.error("Firestore entity data error:", error);
            setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
        });

        return () => { unsubscribeProjects(); unsubscribeEntities(); };
    }, [db, userId, setNotification]);
    return { availableLocals, availableEntityObjects, loadingData }; 
};

const useWorkerData = (db, userId, setNotification) => {
    const [availableWorkers, setAvailableWorkers] = useState([]); 
    const [loadingWorkers, setLoadingWorkers] = useState(true);

    useEffect(() => {
        if (!db || !userId) { setLoadingWorkers(false); return; }
        const firestore = getFirestore();
        const qWorkers = query(collection(firestore, WORKERS_COLLECTION_PATH), where("userId", "==", userId));
        
        const unsubscribeWorkers = onSnapshot(qWorkers, (snapshot) => {
            const workers = snapshot.docs.map(doc => doc.data().name).sort(); 
            setAvailableWorkers(workers);
            setLoadingWorkers(false);
        }, (error) => {
            console.error("Firestore worker data error:", error);
            setNotification({ message: "Error al cargar la lista de trabajadores.", type: "error" });
            setLoadingWorkers(false);
        });
        return () => unsubscribeWorkers();
    }, [db, userId, setNotification]);
    return { availableWorkers, loadingWorkers };
};

const useTimesheetsData = (db, userId, setErrorMessage) => {
    const [timesheets, setTimesheets] = useState([]);
    const [loadingTimesheets, setLoadingTimesheets] = useState(true);
    const [errorTimesheets, setErrorTimesheets] = useState(null);

    useEffect(() => {
        if (!db || !userId) { setLoadingTimesheets(false); return; }
        setErrorTimesheets(null);
        setLoadingTimesheets(true);

        try {
            const firestore = db || getFirestore();
            const timesheetQuery = query(
                collection(firestore, TIMESHEET_COLLECTION_PATH),
                where("createdBy", "==", userId),
                orderBy("createdAt", "desc") 
            );

            const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTimesheets(data);
                setLoadingTimesheets(false);
                if (errorTimesheets) setErrorTimesheets(null); 
            }, (err) => {
                console.error("Error al cargar timesheets:", err);
                const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
                setErrorTimesheets(userMessage);
                setErrorMessage({ message: userMessage, type: 'error' });
                setLoadingTimesheets(false);
            });
            return () => unsubscribe(); 
        } catch (e) {
            console.error("Error setting up timesheet listener:", e);
            const userMessage = "Error interno al configurar la escucha de datos.";
            setErrorTimesheets(userMessage);
            setErrorMessage({ message: userMessage, type: 'error' });
            setLoadingTimesheets(false);
        }
    }, [db, userId, setErrorMessage, errorTimesheets]);

    return { timesheets, loadingTimesheets, errorTimesheets };
};

// const DashboardCard = ({ 
//     title, 
//     icon, 
//     borderColor = 'border-blue-500', 
//     titleColor = 'text-blue-700',   
//     children, 
//     className = '', 
//     headerContent, 
//     fullHeight = false 
// }) => {

//     const cardClasses = `
//         bg-white 
//         rounded-xl 
//         shadow-xl 
//         border-t-4 
//         ${borderColor} 
//         p-5 
//         transition-all 
//         duration-300 
//         ${className} 
//         ${fullHeight ? 'flex flex-col h-full' : ''}
//     `;

//     const headerClasses = `
//         text-xl 
//         font-extrabold 
//         ${titleColor} 
//         border-b-2 
//         border-gray-100 
//         pb-3 
//         mb-4 
//         flex 
//         items-center
//     `;

//     return (
//         <div className={cardClasses}>
//             <h3 className={headerClasses}>
//                 {icon && <span className="text-2xl mr-2">{icon}</span>}
//                 {title}
//                 {headerContent && <div className="ml-auto">{headerContent}</div>}
//             </h3>
//             <div className={`flex-grow ${fullHeight ? 'flex flex-col' : ''}`}>
//                 {children}
//             </div>
//         </div>
//     );
// };

// const DashboardCard = ({ 
//     title, 
//     icon, 
//     // Usaremos un color neutro por defecto, más profesional
//     borderColor = 'border-gray-300', 
//     titleColor = 'text-gray-800', // Color más oscuro por defecto para legibilidad
//     children, 
//     className = '', 
//     headerContent, 
//     // Eliminamos 'fullHeight' ya que podemos manejar esto directamente en 'className' 
//     // o el componente padre usando flex/grid.
// }) => {

//     const cardClasses = `
//         bg-white 
//         rounded-lg 
//         shadow-lg          
//         border-t-4 
//         ${borderColor} 
//         p-5 
//         transition-shadow 
//         duration-300 
//         ${className} 
//         // Siempre usamos flex-col para controlar mejor el espacio interno
//         flex flex-col 
//     `;

//     const headerClasses = `
//         text-lg sm:text-xl // Ajuste de tamaño de fuente responsivo
//         font-bold 
//         ${titleColor} 
//         border-b 
//         border-gray-100 
//         pb-3 
//         mb-3 
//         flex 
//         items-center
//         justify-between // Asegura que title y headerContent se separen
//         flex-wrap // Permite que el contenido del encabezado se ajuste en pantallas pequeñas
//     `;

//     return (
//         <div className={cardClasses}>
            
//             {/* ENCABEZADO */}
//             <h3 className={headerClasses}>
//                 <div className="flex items-center">
//                     {icon && <span className="text-xl sm:text-2xl mr-2 text-gray-600">{icon}</span>}
//                     {title}
//                 </div>
//                 {headerContent && <div className="mt-1 sm:mt-0 ml-4">{headerContent}</div>}
//             </h3>
            
//             {/* CONTENIDO (Aseguramos que el contenido ocupe el espacio restante) */}
//             <div className="flex-grow min-h-0 overflow-auto">
//                 {children}
//             </div>
            
//         </div>
//     );
// };



// =======================================================================
// === COMPONENTE: DashboardCard (Rediseñado con estilo empresarial)
// =======================================================================
const DashboardCard = ({ 
    title, 
    icon, 
    borderColor = 'border-gray-200', 
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



// =======================================================================
// === 4. COMPONENTE HomeView (Con componentes de clima)
// =======================================================================

// export const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets,
//     handleEdit, // Asumiendo que vienen de un hook
//     handleDelete // Asumiendo que vienen de un hook
// }) => {
    
//     // Lógica existente
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
//     const handleCardSelect = (e) => { setSelectedGreenhouseId(e.target.value); };






// return (
//     // 🚨 ÚNICO DIV PRINCIPAL: Fondo ligero, grilla fluida (1 col -> 2 cols -> 3 cols)
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen 
//         grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        
//         {/* 1. RESUMEN GLOBAL (Ocupa todo el ancho siempre, alta prioridad) */}
//         <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-0"> 
//             <SummaryCard timesheets={timesheets} /> 
//         </div>

//         {/* --- SECCIÓN PRINCIPAL: MAPA Y DECISIONES CRÍTICAS --- */}

//         {/* 2. MAPA: Máxima Prioridad Visual (Ocupa 1/2 en MD, 2/3 en LG) */}
//         <div className="col-span-1 md:col-span-1 lg:col-span-2">
//             <DashboardCard 
//                 title="Visión General de Invernaderos" 
//                 icon={<FaMapMarkerAlt />} 
//                 borderColor="border-gray-500"
//                 titleColor="text-gray-700" 
//                 // Altura responsiva CLAVE para que el mapa sea el foco
//                 className="h-[400px] sm:h-[500px] lg:h-[65vh] overflow-hidden" 
//             >
//                 {/* Asegúrate de que GreenhouseMap tiene h-full w-full internamente */}
//                 <GreenhouseMap 
//                     greenhouses={greenhouses} 
//                     onGreenhouseSelect={handleMapSelect} 
//                     selectedGreenhouseId={selectedGreenhouseId} 
//                 />
//             </DashboardCard>
//         </div>

//         {/* 3. ASESORAMIENTO CRÍTICO (Reposicionado para compartir fila con el Mapa) */}
//         <div className="col-span-1 md:col-span-1 lg:col-span-1">
//             <DashboardCard 
//                 title="Asesoramiento Crítico de Pulverización" 
//                 icon={<FaBell />} 
//                 borderColor="border-green-600" 
//                 titleColor="text-green-800"
//                 // CLAVE RESPONSIVA: Altura completa (h-full) para estirarse al lado del mapa en desktop
//                 className="h-full max-h-fit overflow-y-auto" 
//             >
//                 <div className="p-1"> 
//                     {/* SprayAdvisory tiene que gestionar su propia responsividad dual (Tabla vs. Tarjetas) */}
//                     <SprayAdvisory/>
//                 </div>
//             </DashboardCard>
//         </div>

//         {/* --- SECCIÓN SECUNDARIA: PRONÓSTICO Y ANÁLISIS --- */}

//         {/* 4. PRONÓSTICO EXTENDIDO (Ocupa 2/3 en LG) */}
//         <div className="col-span-1 md:col-span-1 lg:col-span-2">
//             <DashboardCard 
//                 title="Pronóstico Extendido (5 Días)" 
//                 icon={<FaCloudSun />} 
//                 borderColor="border-blue-500" 
//                 titleColor="text-blue-700"
//             >
//                 {/* CLAVE ANTI-DESBORDE: Contenedor para manejar el scroll horizontal de la tabla de 5 días */}
//                 <div className="p-2 overflow-x-auto">
//                     <WeatherForecast apiKey={OPENWEATHER_API_KEY} city={DEFAULT_CITY} days={5} /> 
//                 </div>
//             </DashboardCard>
//         </div>

//         {/* 5. GRÁFICA / KPI (Añadido para balancear la fila 3, ocupa 1/3 en LG) */}
//         {/* Tu código anterior estaba comentado, lo agregamos como un contenedor funcional */}
//         <div className="col-span-1 md:col-span-1 lg:col-span-1"> 
//             <DashboardCard 
//                 title="Producción vs. Meta" 
//                 icon={<FaChartLine />} 
//                 borderColor="border-orange-500"
//                 titleColor="text-orange-700"
//                 // Altura completa para ajustarse al Pronóstico Extendido
//                 className="h-full" 
//             >
//                 <div className="h-full flex items-center justify-center text-gray-400">
//                     [Área para Gráfica de Series de Tiempo]
//                 </div>
//             </DashboardCard>
//         </div>


//         {/* 6. DETALLE DE MANO DE OBRA (Ocupa todo el ancho al final, baja prioridad de lectura) */}
//         <div className="col-span-1 md:col-span-2 lg:col-span-3"> 
//             <DashboardCard
//                 title={`Detalle de Registros de Mano de Obra (${timesheets ? timesheets.length : 0})`}
//                 icon={<FaListAlt />}
//                 borderColor="border-gray-300" 
//                 titleColor="text-gray-700"
//                 // Altura limitada para que la tabla no sea infinita
//                 className="h-auto max-h-[500px] overflow-y-auto" 
//             >
//                 {/* CLAVE ANTI-DESBORDE: Contenedor para manejar el scroll horizontal de la tabla de costos */}
//                 <div className="overflow-x-auto">
//                     <LaborCostDashboardDisplay 
//                         timesheets={timesheets || []}
//                         onEditRecord={handleEdit}
//                         onDeleteRecord={handleDelete}
//                     />
//                 </div>
//             </DashboardCard>
//         </div>
        
//     </div>
//     // Fin del único DIV principal
// );
//  }






// export const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets,
//     handleEdit,
//     handleDelete
// }) => {
    
//     // ... [Lógica existente - sin cambios] ...
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
//     const handleCardSelect = (e) => { setSelectedGreenhouseId(e.target.value); };
    
//     // ------------------------------------------
//     // El DashboardCard es crucial para el estilo:
//     // Asegúrate de que DashboardCard aplica el estilo minimalista,
//     // por ejemplo: "bg-white p-4 rounded-xl shadow-lg border border-l-4"
//     // ------------------------------------------

//     return (
//         // 🚨 CAMBIO CLAVE: Grid principal con 1 columna por defecto, 2 en pantallas medianas y grandes.
//         // Se añade `items-start` para evitar que las tarjetas se estiren infinitamente si no tienen `h-full`.
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 items-start"> 
            
//             {/* 1. RESUMEN GLOBAL (Ocupa todo el ancho siempre - Fila 1) */}
//             <div className="col-span-1 md:col-span-2"> 
//                 {/* SummaryCard ya es minimalista y compacto, encaja perfecto. */}
//                 <SummaryCard timesheets={timesheets} /> 
//             </div>

//             {/* --- SECCIÓN PRINCIPAL DE 2 PANELES --- */}
            
//             {/* PANELA I (Izquierda/Principal) - Ocupa 1/2 */}
//             <div className="col-span-1 grid grid-cols-1 gap-6">
                
//                 {/* 2. MAPA: Componente principal con altura fija/alta */}
//                 <DashboardCard 
//                     title="Visión General de Invernaderos" 
//                     icon={<FaMapMarkerAlt />} 
//                     borderColor="border-gray-500"
//                     titleColor="text-gray-700" 
//                     // Altura fija/mínima para dominar el panel
//                     className="h-[400px] lg:h-[600px] overflow-hidden" 
//                 >
//                     <GreenhouseMap 
//                         greenhouses={greenhouses} 
//                         onGreenhouseSelect={handleMapSelect} 
//                         selectedGreenhouseId={selectedGreenhouseId} 
//                     />
//                 </DashboardCard>
                
//                 {/* 3. PRONÓSTICO EXTENDIDO (Debajo del Mapa) */}
//                 <DashboardCard 
//                     title="Pronóstico Extendido (5 Días)" 
//                     icon={<FaCloudSun />} 
//                     borderColor="border-blue-500" 
//                     titleColor="text-blue-700"
//                     className="h-auto" // Se ajusta al contenido
//                 >
//                     <div className="p-2 overflow-x-auto">
//                         {/* WeatherForecast tiene que gestionar su propia tabla o diseño horizontal */}
//                         <WeatherForecast apiKey={'OPENWEATHER_API_KEY'} city={'DEFAULT_CITY'} days={5} /> 
//                     </div>
//                 </DashboardCard>
                
//             </div>
            
//             {/* PANEL B (Derecha/Secundario) - Ocupa 1/2 */}
//             <div className="col-span-1 grid grid-cols-1 gap-6">
                
//                 {/* 4. ASESORAMIENTO CRÍTICO (Arriba, comparte el espacio vertical) */}
//                 <DashboardCard 
//                     title="Asesoramiento Crítico de Pulverización" 
//                     icon={<FaBell />} 
//                     borderColor="border-green-600" 
//                     titleColor="text-green-800"
//                     // Altura ajustada: CLAVE para encajar con los otros componentes del panel B
//                     className="h-auto max-h-[400px] overflow-y-auto" 
//                 >
//                     <div className="p-1"> 
//                         <SprayAdvisory/>
//                     </div>
//                 </DashboardCard>

//                 {/* 5. GRÁFICA / KPI (Medio) */}
//                 <DashboardCard 
//                     title="Producción vs. Meta" 
//                     icon={<FaChartLine />} 
//                     borderColor="border-orange-500"
//                     titleColor="text-orange-700"
//                     className="h-[250px]" // Altura fija para visualización de gráfica
//                 >
//                     <div className="h-full flex items-center justify-center text-gray-400">
//                         [Área para Gráfica de Series de Tiempo]
//                     </div>
//                 </DashboardCard>
                
//                 {/* 6. OTRO KPI O TARJETA DE RESUMEN PEQUEÑA (Abajo) */}
//                 <DashboardCard 
//                     title="Resumen de Cultivo" 
//                     icon={<FaCloudSun />} 
//                     borderColor="border-purple-500"
//                     titleColor="text-purple-700"
//                     className="h-auto" 
//                 >
//                     <div className="p-2">
//                          <div className="text-sm text-gray-600">Cultivo Activo: **{currentCropName}**</div>
//                          <div className="text-sm text-gray-600">Producción Total: **{totalProduction.toFixed(2)}** kg</div>
//                          {/* [Añadir más KPIs aquí] */}
//                     </div>
//                 </DashboardCard>
//             </div>
            
//             {/* 7. DETALLE DE MANO DE OBRA (Ocupa todo el ancho al final - Fila 3) */}
//             <div className="col-span-1 md:col-span-2"> 
//                 <DashboardCard
//                     title={`Histórico de Registros de Mano de Obra (${timesheets ? timesheets.length : 0})`}
//                     icon={<FaListAlt />}
//                     borderColor="border-gray-300" 
//                     titleColor="text-gray-700"
//                     className="h-auto max-h-[400px] overflow-y-auto" 
//                 >
//                     <div className="overflow-x-auto p-1">
//                         <LaborCostDashboardDisplay 
//                             timesheets={timesheets || []}
//                             onEditRecord={handleEdit}
//                             onDeleteRecord={handleDelete}
//                         />
//                     </div>
//                 </DashboardCard>
//             </div>
            
//         </div>
//     );
// };




export const HomeView = ({ 
    dailyData, 
    greenhouses = [], 
    selectedGreenhouseId, 
    setSelectedGreenhouseId, 
    updateGreenhouseConfig, 
    greenhouseConfig, 
    timesheets,
    handleEdit,
    handleDelete
}) => {
    
    // Lógica existente
    const config = greenhouseConfig || {}; 
    const currentCropName = config.cropName || "Cultivo no asignado"; 
    
    const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
        const dayTotal = (day.items || []).reduce((itemSum, item) => 
            itemSum + parseFloat(item.result || 0), 0);
        return sum + dayTotal;
    }, 0);

    const handleMapSelect = (id) => { setSelectedGreenhouseId(id); };
    
    return (
        <div className="p-6 bg-[#F5F7FA] min-h-screen">
            
            {/* 1. RESUMEN GLOBAL - Ancho completo */}
            <div className="mb-6">
                {/* <SummaryCard timesheets={timesheets} />  */}
            </div>

            {/* 2. GRID PRINCIPAL - 2 Columnas uniformes y compactas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* Mapa de Invernaderos */}
                <DashboardCard 
                    title="Visión General de Invernaderos" 
                    icon={<FaMapMarkerAlt />} 
                    titleColor="text-gray-700"
                    className="h-[400px]"
                >
                    <div className="h-[300px] -m-5 mt-0">
                        <GreenhouseMap 
                            greenhouses={greenhouses} 
                            onGreenhouseSelect={handleMapSelect} 
                            selectedGreenhouseId={selectedGreenhouseId} 
                        />
                    </div>
                </DashboardCard>

                {/* Pronóstico Hoy - Visual y Destacado */}
                <DashboardCard 
                    title="Pronóstico Hoy" 
                    icon={<FaCloudSun />} 
                    titleColor="text-blue-600"
                    className="h-[400px]"
                >
                    <div className="h-[300px] flex items-center justify-center overflow-hidden">
                        <WeatherForecast 
                            apiKey={OPENWEATHER_API_KEY} 
                            city={DEFAULT_CITY} 
                            days={1} 
                        />
                    </div>
                </DashboardCard>

                {/* Asesoramiento Crítico */}
                <DashboardCard 
                    title="Asesoramiento Crítico" 
                    icon={<FaBell />} 
                    titleColor="text-amber-600"
                    className="h-[350px]"
                >
                    <div className="overflow-y-auto h-[250px] -mx-5 px-5">
                        <SprayAdvisory />
                    </div>
                </DashboardCard>

                {/* Producción vs Meta */}
                <DashboardCard 
                    title="Producción vs. Meta" 
                    icon={<FaChartLine />} 
                    titleColor="text-purple-600"
                    className="h-[350px]"
                >
                    <div className="h-[250px] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                        <FaChartLine className="text-6xl text-purple-300 mb-4" />
                        <p className="text-sm font-medium text-gray-600">Gráfica en desarrollo</p>
                        <div className="mt-4 grid grid-cols-2 gap-4 w-full px-8">
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Producción</p>
                                <p className="text-lg font-bold text-green-600">{totalProduction.toFixed(0)} kg</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Cultivo</p>
                                <p className="text-sm font-semibold text-gray-700 truncate">{currentCropName}</p>
                            </div>
                        </div>
                    </div>
                </DashboardCard>

                {/* Pronóstico 5 Días */}
                <DashboardCard 
                    title="Pronóstico 5 Días" 
                    icon={<FaCloudSun />} 
                    titleColor="text-blue-600"
                    className="h-[300px]"
                >
                    <div className="overflow-x-auto -mx-5 px-5 h-[200px]">
                        <WeatherForecast 
                            apiKey={OPENWEATHER_API_KEY} 
                            city={DEFAULT_CITY} 
                            days={5} 
                        />
                    </div>
                </DashboardCard>

                {/* Información Rápida - Tipo Widget */}
                <DashboardCard 
                    title="Información Rápida" 
                    icon={<FaSeedling />} 
                    titleColor="text-green-600"
                    className="h-[300px]"
                >
                    <div className="h-[200px] flex flex-col justify-center space-y-4">
                        {/* Cultivo Activo */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaSeedling className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Cultivo Activo</p>
                                    <p className="text-base font-bold text-gray-800">{currentCropName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Producción Total */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaChartLine className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Producción Total</p>
                                    <p className="text-xl font-bold text-green-600">{totalProduction.toFixed(2)} kg</p>
                                </div>
                            </div>
                        </div>

                        {/* Última actualización */}
                        <div className="text-center pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Última actualización: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* 3. HISTORIAL DE MANO DE OBRA - Ancho completo */}
            <DashboardCard
                title="Historial de Registros de Mano de Obra"
                icon={<FaListAlt />}
                titleColor="text-gray-700"
                badge={`${timesheets ? timesheets.length : 0} registros`}
                className="max-h-[500px]"
            >
                <div className="overflow-y-auto max-h-[380px] -mx-5 px-5">
                    <LaborCostDashboardDisplay 
                        timesheets={timesheets || []}
                        onEditRecord={handleEdit}
                        onDeleteRecord={handleDelete}
                    />
                </div>
            </DashboardCard>
            
        </div>
    );
};



// =======================================================================
// === 5. HOME CONTENT PRINCIPAL (Componente Padre)
// =======================================================================

const HomeContent = (props) => {
    
    // 1. OBTENER DB, USERID y estado de carga de Autenticación
    const { db, userId, loadingAuth } = useUserAuth(); 
    const [activeView, setActiveView] = useState('labor'); 
    const [notification, setNotification] = useState(null); 
    
            
    // 🚨 NUEVOS ESTADOS PARA EDICIÓN
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null); 

    // 2. OBTENER PROYECTOS Y ENTIDADES (Objetos)
    const { availableLocals, availableEntityObjects, loadingData } = useProjectAndEntityData(db, userId, setNotification); 
    
    // 3. OBTENER TRABAJADORES (Nombres)
    const { availableWorkers, loadingWorkers } = useWorkerData(db, userId, setNotification); 

    // 4. CARGAR LOS TIMESHEETS GLOBALMENTE
    const { timesheets, loadingTimesheets, errorTimesheets } = useTimesheetsData(db, userId, setNotification); 


    const { ...restOfProps } = props;


    // =======================================================================
    // === CÁLCULO DE COSTES Y PREPARACIÓN DE LISTAS PARA SELECTS
    // =======================================================================
    const { 
        timesheetTotalCost, 
        timesheetTotalCostByProject, 
        timesheetTotalCostByWorker,
        availableProjectsNames, 
        availableEntitiesNames 
    } = useMemo(() => {
        let totalCost = 0;
        const costByProject = {};
        const costByWorker = {}; 

        timesheets.forEach(record => {
            // Asegurar que las horas y tasas son números para el cálculo
            const totalHours = parseFloat(record.totalHours) || 0;
            const ratePerHour = parseFloat(record.ratePerHour) || 0;
            // 💡 Manejar el formato de un trabajador o múltiples
            const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1));
            
            if (totalHours > 0 && ratePerHour > 0) {
                const cost = totalHours * ratePerHour * workersCount;
                totalCost += cost;
                
                // Agrupar por Proyecto
                const projectName = record.localName || 'General'; 
                costByProject[projectName] = (costByProject[projectName] || 0) + cost;

                // Agrupar por Trabajador (Solución para arrays o string)
                const workerNamesArray = Array.isArray(record.workerNames) ? record.workerNames : (record.workerName ? [record.workerName] : []);
                
                // Distribuir el coste total entre los trabajadores si son varios
                const costPerWorker = cost / workersCount;
                workerNamesArray.forEach(workerName => {
                     costByWorker[workerName] = (costByWorker[workerName] || 0) + costPerWorker;
                });
            }
        });

        // PREPARAR LISTAS DE NOMBRES (STRINGS) PARA EL CostDashboard
        const projectsNames = availableLocals.map(l => l.name).sort();
        const entitiesNames = availableEntityObjects.map(e => e.name).sort();

        return {
            timesheetTotalCost: totalCost, 
            timesheetTotalCostByProject: costByProject, 
            timesheetTotalCostByWorker: costByWorker, 
            availableProjectsNames: projectsNames, 
            availableEntitiesNames: entitiesNames, 
        };
    }, [timesheets, availableLocals, availableEntityObjects]); 

    // =======================================================================
    // === MANEJADORES DE ACCIÓN DE EDICIÓN Y ELIMINACIÓN
    // =======================================================================
    
    // MANEJADOR DE ELIMINACIÓN
    const handleDeleteRecord = async (recordId) => {
        try {
            const firestore = db || getFirestore();
            const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
            await deleteDoc(recordRef);
            setNotification({ message: "✅ Registro de tiempo eliminado con éxito.", type: 'success' });
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
            setNotification({ message: "❌ Error al eliminar el registro. Inténtelo de nuevo.", type: 'error' });
        }
    };
    
    // MANEJADOR DE EDICIÓN (Abrir Modal)
    const handleEditRecord = (record) => {
        setEditingRecord(record);
        setIsEditModalOpen(true);
    };

    // MANEJADOR DE GUARDADO DE EDICIÓN
    const handleSaveEdit = async (recordId, updatedData) => {
        try {
            const firestore = db || getFirestore();
            const recordRef = doc(firestore, TIMESHEET_COLLECTION_PATH, recordId);
            
            // Excluir el 'id' al actualizar
            const { id, ...dataToUpdate } = updatedData;
            dataToUpdate.updatedAt = new Date(); // Opcional: añadir fecha de actualización
            
            // Limpiar valores nulos o vacíos y asegurar tipo
            dataToUpdate.totalHours = parseFloat(dataToUpdate.totalHours) || 0;
            dataToUpdate.ratePerHour = parseFloat(dataToUpdate.ratePerHour) || 0;

            await updateDoc(recordRef, dataToUpdate);

            setNotification({ message: "✅ Registro actualizado con éxito.", type: 'success' });
            setIsEditModalOpen(false); 
            setEditingRecord(null);
        } catch (error) {
            console.error("Error al actualizar el registro:", error);
            setNotification({ message: "❌ Error al actualizar el registro. Inténtelo de nuevo.", type: 'error' });
        }
    };

    // --- Barra de Navegación de Vistas (Se mantiene igual) ---

    const ViewTabs = () => (
    // Contenedor principal: Quitamos el 'flex' de aquí y dejamos solo el borde inferior
    <div className="mb-6 border-b border-gray-300"> 
        {/* Nuevo Contenedor de Pestañas: 
            - 'flex' mantiene los botones en línea.
            - 'overflow-x-auto' permite el scroll horizontal si es necesario.
            - 'whitespace-nowrap' asegura que los elementos NO se envuelvan.
        */}
        <div className="flex overflow-x-auto whitespace-nowrap"> 
            <button
                onClick={() => { setActiveView('home'); setNotification(null); }}
                // Eliminé 'text-sm' de los botones para que el tamaño base sea sensible, pero puedes mantenerlo si quieres botones pequeños.
                className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
                    ${ activeView === 'home' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
                <FaHome className="text-lg"/> <span>Dashboard</span>
            </button>
            <button
                onClick={() => { setActiveView('costs'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
                    ${ activeView === 'costs' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
                <FaEuroSign className="text-lg"/> <span>Costes</span>
            </button>
            <button
                onClick={() => { setActiveView('employee_management'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
                    ${ activeView === 'employee_management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
                <FaUserFriends className="text-lg"/> <span>Personal</span>
            </button>
            <button
                onClick={() => { setActiveView('management'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
                    ${ activeView === 'management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
                <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
            </button>
            <button
                onClick={() => { setActiveView('labor'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 font-medium border-b-2 transition-colors duration-200 flex-shrink-0
                    ${ activeView === 'labor' ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
                <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
            </button>
        </div>
    </div>
);
    // const ViewTabs = () => (
    //     <div className="flex justify-start mb-6 border-b border-gray-300">
    //         <button
    //             onClick={() => { setActiveView('home'); setNotification(null); }}
    //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'home' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    //         >
    //             <FaHome className="text-lg"/> <span>Dashboard</span>
    //         </button>
    //         <button
    //             onClick={() => { setActiveView('costs'); setNotification(null); }}
    //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'costs' ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    //         >
    //             <FaEuroSign className="text-lg"/> <span>Costes</span>
    //         </button>
    //         <button
    //             onClick={() => { setActiveView('employee_management'); setNotification(null); }}
    //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'employee_management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    //         >
    //             <FaUserFriends className="text-lg"/> <span>Personal</span>
    //         </button>
    //         <button
    //             onClick={() => { setActiveView('management'); setNotification(null); }}
    //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'management' ? "border-purple-600 text-purple-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    //         >
    //             <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
    //         </button>
    //         <button
    //             onClick={() => { setActiveView('labor'); setNotification(null); }}
    //             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${ activeView === 'labor' ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    //         >
    //             <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
    //         </button>
    //     </div>
    // );


    // --- Estado de Carga y Restricciones de Acceso ---
    if (loadingAuth || loadingData || loadingTimesheets || loadingWorkers) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-indigo-600 animate-pulse">
                    {loadingAuth ? "Cargando autenticación..." : loadingData ? "Cargando datos maestros..." : loadingWorkers ? "Cargando lista de trabajadores..." : "Cargando registros de trabajo..."}
                </p>
            </div>
        );
    }
    
    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-10 text-center bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
                    <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            
            {/* Título y Navegación de Vistas */}
            <div className="p-4 sm:p-6 pb-0">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
                </h1>
                <ViewTabs />
            </div>

            {/* MOSTRAR NOTIFICACIÓN */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4 ${notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}
                    >
                        <strong className="font-bold">{notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}</strong>
                        <span className="block sm:inline ml-2">{notification.message}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setNotification(null)}>❌</span>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Renderizado de la Vista Activa */}
            {activeView === 'home' && (<HomeView {...restOfProps} timesheets={timesheets} />)}

            {activeView === 'costs' && (
                <div className="p-4 sm:p-6 pt-0">
                    <CostDashboard 
                        db={db}
                        userId={userId}
                        setErrorMessage={setNotification} 
                        errorMessage={notification} 
                        availableProjects={availableProjectsNames} 
                        availableEntities={availableEntitiesNames} 
                        availableWorkers={availableWorkers} 
                        timesheetTotalCost={timesheetTotalCost}
                        timesheetTotalCostByProject={timesheetTotalCostByProject}
                        timesheetTotalCostByWorker={timesheetTotalCostByWorker} 
                        availableLocals={availableLocals}
                        timesheets={timesheets}
                    />
                </div>
            )}


            {activeView === 'management' && (
                <div className="p-4 sm:p-6 pt-0">
                    <EntityAndProjectManager db={db} userId={userId} setErrorMessage={setNotification} initialProjects={availableLocals} initialEntities={availableEntityObjects} />
                </div>
            )}

            {activeView === 'employee_management' && (
                <div className="p-4 sm:p-6 pt-0">
                    <EmployeeManagement db={db} userId={userId} setErrorMessage={setNotification} availableEntities={availableEntityObjects} />
                </div>
            )}

            {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
                <div className="p-4 sm:p-6 pt-0 space-y-6">
                    {/* TimeSheet Wizard */}
                    <div>
                        <TimeSheetWizard db={db} userId={userId} setErrorMessage={setNotification} availableLocals={availableLocals} availableWorkers={availableWorkers} />
                    </div>
                    
                    {/* Summary Cards en Grid 2 Columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DashboardCard
                            title="Horas Totales Trabajadas"
                            icon={<FaClock />}
                            titleColor="text-blue-700"
                        >
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total de Horas</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-1">
                                        {timesheets.reduce((sum, ts) => sum + (parseFloat(ts.totalHours) || 0), 0).toFixed(2)} h
                                    </p>
                                </div>
                                <FaClock className="text-5xl text-blue-200" />
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Costes Totales de Mano de Obra"
                            icon={<FaMoneyBillWave />}
                            titleColor="text-green-700"
                        >
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Coste Total</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">
                                        {timesheets.reduce((sum, ts) => {
                                            const hours = parseFloat(ts.totalHours) || 0;
                                            const rate = parseFloat(ts.ratePerHour) || 0;
                                            const workers = ts.workerNames?.length || 1;
                                            return sum + (hours * rate * workers);
                                        }, 0).toFixed(2)} €
                                    </p>
                                </div>
                                <FaMoneyBillWave className="text-5xl text-green-200" />
                            </div>
                        </DashboardCard>
                    </div>

                    {/* SummaryCard existente */}
                    <SummaryCard timesheets={timesheets} /> 
                    
                    {/* Tabla de Registros de Tiempo en DashboardCard */}
                    <DashboardCard
                        title="Registros de Tiempo"
                        icon={<FaListAlt />}
                        titleColor="text-gray-800"
                        badge={`${timesheets.length} registros`}
                    >
                        <LaborCostDashboardDisplay 
                            timesheets={timesheets} 
                            error={errorTimesheets} 
                            onEditRecord={handleEditRecord}
                            onDeleteRecord={handleDeleteRecord}
                        />
                    </DashboardCard>
                </div>
            )}
            
            {/* 🚨 Modal de Edición (Flotante) */}
            {editingRecord && (
                <EditLaborCostModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    record={editingRecord}
                    onSave={handleSaveEdit}
                    availableLocals={availableLocals}
                    availableWorkers={availableWorkers}
                />
            )}
        </div>
    );
};

export default HomeContent;
