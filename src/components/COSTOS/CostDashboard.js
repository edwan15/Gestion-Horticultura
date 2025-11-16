
// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // Importaciones de Firebase Firestore
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
//     updateDoc, // para la edición
// } from "firebase/firestore";
// // Importamos todos los iconos necesarios
// import {
//     FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling,
//     FaBuilding, FaUserTie, FaTags, FaTrashAlt, FaEdit, FaTimes,
//     FaPlus, // Nuevo icono para el botón
//     FaChevronRight, FaChevronLeft, // Iconos para navegación en el modal
//     FaSave // Icono para guardar
// } from "react-icons/fa";

// // NOTA: Asumo que tienes una instancia de Firestore (db) disponible. 
// // Si no, necesitarás importarla aquí. Por ejemplo:
// // import { db } from '../firebaseConfig'; 
// const db = {}; // Placeholder si el `db` se inyecta desde fuera o se importa.

// // Constantes
// const COST_CATEGORIES = [
//     "Mano de Obra",
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
// const TIMESHEET_ENTITY_NAME = 'Mano de Obra Propia';

// // Función para obtener el ID de la aplicación
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();

// // Función auxiliar para obtener el primer valor de un array
// const getFirstItem = (list, fallback = "") => {
//     return list.length > 0 ? list[0] : fallback;
// };

// // --- SUB-COMPONENTE: DynamicCostModal (Registro Dinámico) ---
// const DynamicCostModal = ({ onClose, onSave, projects, entities, workers, setErrorMessage }) => {
//     const defaultData = useMemo(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: '',
//         amount: '',
//         category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
//         project: getFirstItem(projects, "General"),
//         entity: getFirstItem(entities, ""),
//         worker: getFirstItem(workers, ""),
//     }), [projects, entities, workers]);

//     const [costData, setCostData] = useState(defaultData);
//     const [step, setStep] = useState(1);
//     const [isSaving, setIsSaving] = useState(false);

//     // Reiniciar los datos al abrir/cerrar (similar al didMount/willUnmount)
//     useEffect(() => {
//         setCostData(defaultData);
//     }, [defaultData]);


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newValue = value;

//         // Resetear entity/worker si se cambia la categoría
//         if (name === 'category') {
//             newValue = value;
//             setCostData(prev => ({
//                 ...prev,
//                 entity: value === "Mano de Obra" ? '' : getFirstItem(entities, ""),
//                 worker: value !== "Mano de Obra" ? '' : getFirstItem(workers, ""),
//             }));
//         }

//         setCostData(prev => ({ ...prev, [name]: newValue }));
//     };

//     const nextStep = () => {
//         // Validación básica antes de avanzar
//         if (step === 1) {
//             if (!costData.category) {
//                 setErrorMessage("Seleccione una categoría.");
//                 return;
//             }
//         }
//         if (step === 2) {
//             if (!costData.project) {
//                 setErrorMessage("Seleccione un proyecto.");
//                 return;
//             }
//             if (costData.category === "Mano de Obra" && !costData.worker) {
//                  setErrorMessage("Seleccione un trabajador.");
//                  return;
//             }
//             if (costData.category !== "Mano de Obra" && !costData.entity) {
//                 setErrorMessage("Seleccione una entidad proveedora.");
//                 return;
//             }
//         }
//         setErrorMessage("");
//         setStep(prev => prev + 1);
//     };

//     const prevStep = () => setStep(prev => prev - 1);

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         const costAmount = parseFloat(costData.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!costData.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             await onSave({
//                 ...costData,
//                 amount: costAmount,
//                 // Lógica de 'N/A' al guardar (consistente con el formulario)
//                 entity: costData.entity.trim() || (costData.category === "Mano de Obra" ? 'N/A' : ''),
//                 worker: costData.worker.trim() || 'N/A',
//             });
//             onClose(); // Cerrar al éxito
//         } catch (error) {
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     // Contenido del Modal por pasos
//     const renderStepContent = () => {
//         switch (step) {
//             case 1:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-bold text-indigo-700 mb-4">Paso 1: Categoría y Proyecto</h3>
//                         {/* CATEGORÍA */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                             <select name="category" value={costData.category} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold">
//                                 {COST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                             </select>
//                         </div>
//                         {/* PROYECTO */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto/Cultivo:</label>
//                             <select name="project" value={costData.project} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg">
//                                 {projects.map(p => <option key={p} value={p}>{p}</option>)}
//                             </select>
//                         </div>
//                     </div>
//                 );
//             case 2:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-bold text-indigo-700 mb-4">Paso 2: Detalles de Origen</h3>
//                         {/* TRABAJADOR (Solo Mano de Obra) */}
//                         {costData.category === "Mano de Obra" ? (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//                                 <select
//                                     name="worker"
//                                     value={costData.worker}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
//                                 >
//                                     <option value="">Seleccionar Trabajador</option>
//                                     {workers.map(w => <option key={w} value={w}>{w}</option>)}
//                                 </select>
//                             </div>
//                         ) : (
//                             // ENTIDAD (Para el resto de categorías)
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
//                                 <select
//                                     name="entity"
//                                     value={costData.entity}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
//                                 >
//                                     <option value="">Seleccionar Entidad</option>
//                                     {entities.map(e => <option key={e} value={e}>{e}</option>)}
//                                 </select>
//                             </div>
//                         )}
//                         {/* FECHA */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Fecha del Coste:</label>
//                             <input type="date" name="date" value={costData.date} onChange={handleInputChange} required className="w-full p-3 border rounded-lg text-lg"/>
//                         </div>
//                     </div>
//                 );
//             case 3:
//                 return (
//                     <div className="space-y-4">
//                         <h3 className="text-lg font-bold text-indigo-700 mb-4">Paso 3: Monto y Descripción Final</h3>
//                         {/* MONTO */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                             <input
//                                 type="number"
//                                 name="amount"
//                                 value={costData.amount}
//                                 onChange={handleInputChange}
//                                 min="0.01" step="0.01"
//                                 required
//                                 placeholder="Ej: 150.50"
//                                 className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-xl font-bold"
//                             />
//                         </div>
//                         {/* DESCRIPCIÓN */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                             <input
//                                 type="text"
//                                 name="description"
//                                 value={costData.description}
//                                 onChange={handleInputChange}
//                                 required
//                                 placeholder="Ej: Compra de fertilizante X para parcela 1"
//                                 className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                         </div>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100">
//                 <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b-2 border-indigo-200 pb-3 flex items-center justify-between">
//                     <FaPlus className="mr-3 text-2xl text-green-600"/> Registro Dinámico de Coste
//                 </h2>
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
//                     aria-label="Cerrar Modal"
//                 >
//                     <FaTimes className="text-2xl"/>
//                 </button>

//                 <div className="mt-4 mb-6">
//                     <div className="flex justify-between text-sm font-medium text-gray-500">
//                         <span>Paso {step} de 3</span>
//                         <span className="text-indigo-600">{step === 1 ? 'Origen' : step === 2 ? 'Destino' : 'Monto'}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                         <div
//                             className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
//                             style={{ width: `${(step / 3) * 100}%` }}
//                         ></div>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSave} className="space-y-6">
//                     {renderStepContent()}

//                     <div className="flex justify-between pt-4 border-t border-gray-100">
//                         {/* Botón ATRÁS */}
//                         <button
//                             type="button"
//                             onClick={prevStep}
//                             disabled={step === 1}
//                             className={`px-4 py-2 rounded-lg transition duration-200 flex items-center ${
//                                 step === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
//                             }`}
//                         >
//                             <FaChevronLeft className="mr-2"/> Anterior
//                         </button>

//                         {/* Botón SIGUIENTE / GUARDAR */}
//                         {step < 3 ? (
//                             <button
//                                 type="button"
//                                 onClick={nextStep}
//                                 className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
//                             >
//                                 Siguiente <FaChevronRight className="ml-2"/>
//                             </button>
//                         ) : (
//                             <button
//                                 type="submit"
//                                 disabled={isSaving}
//                                 className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 flex items-center ${
//                                     isSaving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//                                 }`}
//                             >
//                                 {isSaving ? "Guardando..." : "Guardar Coste"} <FaSave className="ml-2"/>
//                             </button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };


// // --- SUB-COMPONENTE: EditCostModal (Mantenido para la edición) ---
// const EditCostModal = ({ cost, onClose, onSave, projects, entities, workers, setErrorMessage }) => {
//     // ... [Tu código original de EditCostModal sin cambios] ...
//     const [editData, setEditData] = useState({
//         date: cost.date || new Date().toISOString().split("T")[0],
//         description: cost.description || '',
//         amount: cost.amount || 0,
//         category: cost.category || COST_CATEGORIES[0],
//         project: cost.project || 'General',
//         entity: cost.entity || '',
//         worker: cost.worker || '',
//     });
//     const [isSaving, setIsSaving] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         const costAmount = parseFloat(editData.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!editData.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             await onSave(cost.id, {
//                 ...editData,
//                 amount: costAmount,
//                 // Lógica de 'N/A' al guardar (consistente con el formulario de creación)
//                 entity: editData.entity.trim() || (editData.category === "Mano de Obra" ? 'N/A' : ''),
//                 worker: editData.worker.trim() || 'N/A',
//             });
//             onClose();
//         } catch (error) {
//             setErrorMessage("Error al guardar la edición: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//                     <FaEdit className="inline mr-2 text-indigo-600"/> Editar Coste Manual
//                 </h2>
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
//                 >
//                     <FaTimes className="text-xl"/>
//                 </button>

//                 <form onSubmit={handleSave} className="space-y-4">
//                     {/* Campos de Edición */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción:</label>
//                         <input type="text" name="description" value={editData.description} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                             <input type="date" name="date" value={editData.date} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                             <input type="number" name="amount" value={editData.amount} onChange={handleInputChange} min="0.01" step="0.01" required className="w-full p-2 border rounded"/>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select name="category" value={editData.category} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             {COST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
//                             <select name="project" value={editData.project} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                                 {projects.map(p => <option key={p} value={p}>{p}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                              <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
//                             <select
//                                 name="entity"
//                                 value={editData.entity}
//                                 onChange={handleInputChange}
//                                 required={editData.category !== "Mano de Obra"}
//                                 disabled={editData.category === "Mano de Obra"}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 <option value="">Seleccionar Entidad</option>
//                                 {entities.map(e => <option key={e} value={e}>{e}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     {editData.category === "Mano de Obra" && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//                             <select
//                                 name="worker"
//                                 value={editData.worker}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full p-2 border rounded"
//                             >
//                                 <option value="">Seleccionar Trabajador</option>
//                                 {workers.map(w => <option key={w} value={w}>{w}</option>)}
//                             </select>
//                         </div>
//                     )}

//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
//                         >
//                             Cancelar
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSaving}
//                             className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 ${
//                                 isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//                             }`}
//                         >
//                             {isSaving ? "Guardando..." : "Guardar Cambios"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };


// // --- SUB-COMPONENTE: GeneralSummaryCard ---
// const BAR_COLOR = 'bg-indigo-600';
// const GeneralSummaryCard = ({
//     title,
//     icon: CardIcon,
//     dataArray,
//     totalCostCombined,
//     averageLabel,
//     showCostPerHectare = false,
//     surfaceAreaMap = {},
//     emptyMessage = "No hay costes registrados.",
//     renderItemExtra = null
// }) => {
//     // ... [Tu código original de GeneralSummaryCard sin cambios] ...
//     const averageCost = dataArray.length > 0
//         ? totalCostCombined / dataArray.length
//         : 0;

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
//                 {CardIcon && <CardIcon className="mr-3 text-2xl text-green-600"/>}
//                 {title}
//             </h3>

//             <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">

//                 {dataArray.length === 0 ? (
//                     <div className="flex items-center justify-center h-full min-h-[200px]">
//                         <p className="text-gray-500 italic text-lg">
//                             {emptyMessage}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {dataArray.map((item) => {
//                             const { name, cost, percentageOfTotal, isGeneral } = item;

//                             const surfaceArea = showCostPerHectare ? (surfaceAreaMap[name] || 1) : 1;
//                             const costPerHectare = showCostPerHectare ? (cost / surfaceArea) : 0;

//                             return (
//                                 <div
//                                     key={name}
//                                     className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
//                                 >
//                                     <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
//                                         {showCostPerHectare && <FaRulerCombined className='mr-1 text-xs text-gray-400'/>}
//                                         <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
//                                         {showCostPerHectare && !isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
//                                         {renderItemExtra && renderItemExtra(item)}
//                                     </p>

//                                     <div className="flex items-center justify-between">
//                                         <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
//                                             <div
//                                                 className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`}
//                                                 style={{ width: `${percentageOfTotal}%` }}
//                                             ></div>
//                                         </div>
//                                         <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
//                                             {cost.toFixed(2)} €
//                                             <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {totalCostCombined > 0 && (
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between text-sm font-semibold text-gray-700">
//                         <span className='text-gray-500'>Promedio {averageLabel}</span>
//                         <span className='text-indigo-700 font-extrabold'>
//                             {averageCost.toFixed(2)} €
//                         </span>
//                     </div>
//                     <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
//                         <span className='mr-2 text-sm text-gray-600'>Total Global</span>
//                         <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };
// const GeneralSummaryCardMemo = memo(GeneralSummaryCard);


// // --- SUB-COMPONENTE: CostSummaryTabs ---
// const CostSummaryTabs = ({
//     costByProjectCombined,
//     costByEntityCombined,
//     costByWorkerCombined,
//     distributionDataCombined,
//     totalCostCombined,
//     availableLocals,
//     setCostToEdit, // Añadido para habilitar la edición desde la lista
//     handleDeleteCost, // Añadido para habilitar la eliminación
//     setErrorMessage // Añadido para mostrar errores
// }) => {
//     // ... [Tu código original de CostSummaryTabs sin cambios] ...
//     const [activeTab, setActiveTab] = useState('project');

//     const projectSurfaceMap = useMemo(() => {
//         return availableLocals.reduce((acc, local) => {
//             acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1;
//             return acc;
//         }, { 'General': 1 });
//     }, [availableLocals]);

//     const processDataForSummaryCard = useCallback((dataObject, currentTotalCost) => {
//         if (currentTotalCost === 0) return [];
//         return Object.entries(dataObject)
//             .map(([name, cost]) => ({
//                 name,
//                 cost,
//                 percentageOfTotal: (cost / currentTotalCost) * 100,
//                 isGeneral: name === 'General',
//             }))
//             .filter(item => item.cost > 0)
//             .sort((a, b) => b.cost - a.cost);
//     }, []);

//     const projectDataForCard = useMemo(() =>
//         processDataForSummaryCard(costByProjectCombined, totalCostCombined),
//         [costByProjectCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const entityDataForCard = useMemo(() =>
//         processDataForSummaryCard(costByEntityCombined, totalCostCombined),
//         [costByEntityCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const workerDataForCard = useMemo(() =>
//         processDataForSummaryCard(costByWorkerCombined, totalCostCombined),
//         [costByWorkerCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const categoryDataForCard = useMemo(() =>
//         processDataForSummaryCard(distributionDataCombined, totalCostCombined),
//         [distributionDataCombined, totalCostCombined, processDataForSummaryCard]
//     );


//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'project':
//                 return (
//                     <GeneralSummaryCard
//                         title="Detalle de Costes por Cultivo/Proyecto"
//                         icon={FaSeedling}
//                         dataArray={projectDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Proyectos"
//                         showCostPerHectare={true}
//                         surfaceAreaMap={projectSurfaceMap}
//                         emptyMessage="No hay costes registrados para proyectos."
//                     />
//                 );
//             case 'entity':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Entidad Proveedora"
//                         icon={FaBuilding}
//                         dataArray={entityDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Entidades"
//                         emptyMessage="No hay costes registrados para entidades."
//                     />
//                 );
//             case 'worker':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Trabajador"
//                         icon={FaUserTie}
//                         dataArray={workerDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Trabajadores"
//                         emptyMessage="No hay costes registrados para trabajadores."
//                     />
//                 );
//             case 'category':
//                 // La categoría usa los datos de distribución
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Categoría"
//                         icon={FaTags}
//                         dataArray={categoryDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Categorías"
//                         emptyMessage="No hay costes registrados para categorías."
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     const tabClasses = "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 text-center cursor-pointer";
//     const activeTabClasses = "border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50";
//     const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";


//     return (
//         <section className="bg-white shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]">
//             <div className="flex border-b border-gray-200">
//                 <button
//                     className={`${tabClasses} ${activeTab === 'project' ? activeTabClasses : inactiveTabClasses}`}
//                     onClick={() => setActiveTab('project')}
//                 >
//                     <FaSeedling className="inline-block mr-2 text-lg"/> Cultivo
//                 </button>
//                 <button
//                     className={`${tabClasses} ${activeTab === 'entity' ? activeTabClasses : inactiveTabClasses}`}
//                     onClick={() => setActiveTab('entity')}
//                 >
//                     <FaBuilding className="inline-block mr-2 text-lg"/> Entidad
//                 </button>
//                 <button
//                     className={`${tabClasses} ${activeTab === 'worker' ? activeTabClasses : inactiveTabClasses}`}
//                     onClick={() => setActiveTab('worker')}
//                     disabled={workerDataForCard.length === 0}
//                 >
//                     <FaUserTie className="inline-block mr-2 text-lg"/> Trabajador
//                 </button>
//                 <button
//                     className={`${tabClasses} ${activeTab === 'category' ? activeTabClasses : inactiveTabClasses}`}
//                     onClick={() => setActiveTab('category')}
//                 >
//                     <FaTags className="inline-block mr-2 text-lg"/> Categoría
//                 </button>
//             </div>
//             <div className="flex-grow p-0 overflow-hidden">
//                 {renderTabContent()}
//             </div>
//         </section>
//     );
// };


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboard = () => {
//     // --- ESTADOS PRINCIPALES ---
//     const [costs, setCosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showCostModal, setShowCostModal] = useState(false);
//     const [costToEdit, setCostToEdit] = useState(null);
//     const [errorMessage, setErrorMessage] = useState("");

//     // --- DATOS DE REFERENCIA (PLACEHOLDERS) ---
//     // En una aplicación real, estos vendrían de Firebase/Redux/Context.
//     const availableProjects = useMemo(() => ["General", "Parcela 1: Trigo", "Parcela 2: Maíz"], []);
//     const availableEntities = useMemo(() => ["AgroSuministros S.L.", "Maquinaria Rápida", "Transportes Juan"], []);
//     const availableWorkers = useMemo(() => ["Trabajador 1", "Trabajador 2", TIMESHEET_ENTITY_NAME], []);
//     const availableLocals = useMemo(() => [
//         { name: "Parcela 1: Trigo", surfaceArea: 10 },
//         { name: "Parcela 2: Maíz", surfaceArea: 5.5 },
//     ], []);


//     // --- FUNCIÓN DE CÁLCULO DE DATOS (Memoized) ---
//     const { 
//         totalCostCombined, 
//         distributionDataCombined, 
//         costByProjectCombined, 
//         costByEntityCombined, 
//         costByWorkerCombined, 
//         chartData 
//     } = useMemo(() => {
//         const initialCostObject = COST_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

//         const { totalCost, distribution, byProject, byEntity, byWorker } = costs.reduce((acc, cost) => {
//             const amount = cost.amount || 0;

//             acc.totalCost += amount;
//             acc.distribution[cost.category] = (acc.distribution[cost.category] || 0) + amount;
//             acc.byProject[cost.project] = (acc.byProject[cost.project] || 0) + amount;

//             if (cost.category === "Mano de Obra") {
//                 // La mano de obra se clasifica por trabajador
//                 acc.byWorker[cost.worker] = (acc.byWorker[cost.worker] || 0) + amount;
//             } else {
//                 // El resto se clasifica por entidad
//                 const entityName = cost.entity.trim() === 'N/A' ? 'No Especificado' : cost.entity;
//                 acc.byEntity[entityName] = (acc.byEntity[entityName] || 0) + amount;
//             }

//             return acc;
//         }, {
//             totalCost: 0,
//             distribution: { ...initialCostObject },
//             byProject: { "General": 0 },
//             byEntity: { "No Especificado": 0 },
//             byWorker: { "N/A": 0 }
//         });

//         // Formato para el PieChart
//         const chartData = Object.entries(distribution)
//             .filter(([, cost]) => cost > 0)
//             .map(([name, cost], index) => ({
//                 name,
//                 value: cost,
//                 color: COLORS[index % COLORS.length],
//             }));

//         return {
//             totalCostCombined: totalCost,
//             distributionDataCombined: distribution,
//             costByProjectCombined: byProject,
//             costByEntityCombined: byEntity,
//             costByWorkerCombined: byWorker,
//             chartData
//         };
//     }, [costs]);


//     // --- FUNCIÓN PARA OBTENER DATOS (Firebase) ---
//     const fetchCosts = useCallback(() => {
//         if (!db.collection) { // Verifica si la base de datos está disponible
//             console.error("Firebase Firestore instance (db) is not available.");
//             setLoading(false);
//             return () => {};
//         }

//         setLoading(true);
//         setError(null);

//         const costsCollection = collection(db, "costs");
//         // Filtra por el appId y ordena por fecha de creación descendente
//         const q = query(
//             costsCollection,
//             where("appId", "==", appId),
//             // orderBy("createdAt", "desc") // Asumiendo que quieres el más reciente primero
//         );

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             try {
//                 const fetchedCosts = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data(),
//                     date: doc.data().date, // Asegura el formato de fecha (YYYY-MM-DD)
//                 }));
//                 setCosts(fetchedCosts);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching costs:", err);
//                 setError("Error al cargar los costes. Inténtelo de nuevo.");
//                 setLoading(false);
//             }
//         }, (err) => {
//             console.error("onSnapshot error:", err);
//             setError("Error de conexión con la base de datos.");
//             setLoading(false);
//         });

//         return unsubscribe; // Retorna la función para desuscribirse
//     }, []);

//     useEffect(() => {
//         const unsubscribe = fetchCosts();
//         return () => {
//             if (unsubscribe) unsubscribe();
//         };
//     }, [fetchCosts]);


//     // --- FUNCIONES CRUD (CREATE, UPDATE, DELETE) ---

//     // CREATE
//     const handleAddCost = useCallback(async (newCostData) => {
//         try {
//             await addDoc(collection(db, "costs"), {
//                 ...newCostData,
//                 appId,
//                 createdAt: serverTimestamp(),
//             });
//             setErrorMessage("");
//         } catch (e) {
//             console.error("Error adding document: ", e);
//             setErrorMessage("Error al crear el coste. Verifique la conexión.");
//             throw e; // Lanza el error para que el modal lo maneje
//         }
//     }, []);

//     // UPDATE
//     const handleEditCost = useCallback(async (costId, updatedData) => {
//         try {
//             await updateDoc(doc(db, "costs", costId), updatedData);
//             setErrorMessage("");
//         } catch (e) {
//             console.error("Error updating document: ", e);
//             setErrorMessage("Error al actualizar el coste. Verifique la conexión.");
//             throw e;
//         }
//     }, []);

//     // DELETE
//     const handleDeleteCost = useCallback(async (costId) => {
//         if (!window.confirm("¿Está seguro de que desea eliminar este coste? Esta acción es irreversible.")) {
//             return;
//         }
//         try {
//             await deleteDoc(doc(db, "costs", costId));
//             setErrorMessage("");
//         } catch (e) {
//             console.error("Error deleting document: ", e);
//             setErrorMessage("Error al eliminar el coste. Verifique la conexión.");
//         }
//     }, []);


//     // --- RENDERIZADO DEL COMPONENTE ---
//     if (loading) {
//         return <div className="p-8 text-center text-lg text-indigo-600 font-semibold">Cargando datos del Dashboard de Costos...</div>;
//     }

//     if (error) {
//         return <div className="p-8 text-center text-red-600 font-semibold">Error: {error}</div>;
//     }

//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <header className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
//                     <FaChartBar className="mr-3 text-indigo-600"/> Dashboard de Costos
//                 </h1>
//                 <button
//                     onClick={() => setShowCostModal(true)}
//                     className="flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
//                 >
//                     <FaPlus className="mr-2"/> Registrar Coste
//                 </button>
//             </header>

//             {/* Mensaje de Error Global */}
//             {errorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                     <strong className="font-bold">¡Error! </strong>
//                     <span className="block sm:inline">{errorMessage}</span>
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage("")}>
//                         <FaTimes/>
//                     </span>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                 {/* Tarjeta de Costo Total */}
//                 <div className="bg-white p-6 shadow-2xl rounded-xl border-l-4 border-indigo-600">
//                     <p className="text-lg font-medium text-gray-500">Total de Costos Registrados</p>
//                     <p className="mt-1 text-4xl font-extrabold text-indigo-700">
//                         <FaEuroSign className="inline mr-1 text-3xl"/> {totalCostCombined.toFixed(2)}
//                     </p>
//                     <p className="text-sm text-gray-400 mt-2">{costs.length} movimientos</p>
//                 </div>

//                 {/* Tarjeta de Distribución de Costos (Gráfico de Torta) */}
//                 <div className="lg:col-span-2 bg-white p-6 shadow-2xl rounded-xl border-t-4 border-green-600 h-96">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución por Categoría</h2>
//                     {chartData.length > 0 ? (
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={chartData}
//                                     dataKey="value"
//                                     nameKey="name"
//                                     cx="50%"
//                                     cy="50%"
//                                     outerRadius={100}
//                                     fill="#8884d8"
//                                     labelLine={false}
//                                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                 >
//                                     {chartData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-gray-500 italic">
//                             No hay suficientes datos para el gráfico.
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Secciones de Detalle (Tarjetas de Pestañas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <CostSummaryTabs
//                     costByProjectCombined={costByProjectCombined}
//                     costByEntityCombined={costByEntityCombined}
//                     costByWorkerCombined={costByWorkerCombined}
//                     distributionDataCombined={distributionDataCombined}
//                     totalCostCombined={totalCostCombined}
//                     availableLocals={availableLocals}
//                     setCostToEdit={setCostToEdit}
//                     handleDeleteCost={handleDeleteCost}
//                     setErrorMessage={setErrorMessage}
//                 />
                
//                 {/* Tabla de Movimientos Recientes */}
//                 <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]">
//                     <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
//                         <FaTags className="mr-3 text-2xl text-red-600"/> Últimos Movimientos
//                     </h3>
//                     <div className="overflow-y-auto flex-grow">
//                         {costs.length > 0 ? (
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50 sticky top-0">
//                                     <tr>
//                                         <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
//                                         <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
//                                         <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
//                                         <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto (€)</th>
//                                         <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {costs.slice(0, 50).map((cost) => ( // Limita a 50 movimientos
//                                         <tr key={cost.id} className="hover:bg-gray-50 transition duration-100">
//                                             <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{cost.date}</td>
//                                             <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{cost.project}</td>
//                                             <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{cost.category}</td>
//                                             <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">{cost.amount.toFixed(2)}</td>
//                                             <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                 <button
//                                                     onClick={() => setCostToEdit(cost)}
//                                                     className="text-indigo-600 hover:text-indigo-900 mr-3"
//                                                     title="Editar"
//                                                 >
//                                                     <FaEdit/>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteCost(cost.id)}
//                                                     className="text-red-600 hover:text-red-900"
//                                                     title="Eliminar"
//                                                 >
//                                                     <FaTrashAlt/>
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <div className="flex items-center justify-center h-full text-gray-500 italic">
//                                 No hay movimientos de costos registrados.
//                             </div>
//                         )}
//                     </div>
//                 </section>
//             </div>


//             {/* Modales */}
//             {showCostModal && (
//                 <DynamicCostModal
//                     onClose={() => { setShowCostModal(false); setErrorMessage(""); }}
//                     onSave={handleAddCost}
//                     projects={availableProjects}
//                     entities={availableEntities}
//                     workers={availableWorkers}
//                     setErrorMessage={setErrorMessage}
//                 />
//             )}

//             {costToEdit && (
//                 <EditCostModal
//                     cost={costToEdit}
//                     onClose={() => { setCostToEdit(null); setErrorMessage(""); }}
//                     onSave={handleEditCost}
//                     projects={availableProjects}
//                     entities={availableEntities}
//                     workers={availableWorkers}
//                     setErrorMessage={setErrorMessage}
//                 />
//             )}
//         </div>
//     );
// };

// export default CostDashboard;






// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // Importaciones de Firebase Firestore
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
//     updateDoc, // para la edición
// } from "firebase/firestore";
// // Importamos todos los iconos necesarios
// import { 
//     FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling, 
//     FaBuilding, FaUserTie, FaTags, FaTrashAlt, FaEdit, FaTimes 
// } from "react-icons/fa"; 

// // Constantes
// const COST_CATEGORIES = [
//     "Mano de Obra", 
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
// const TIMESHEET_ENTITY_NAME = 'Mano de Obra Propia'; 

// // Función para obtener el ID de la aplicación
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: EditCostModal ---
// const EditCostModal = ({ cost, onClose, onSave, projects, entities, workers, setErrorMessage }) => {
//     const [editData, setEditData] = useState({
//         date: cost.date || new Date().toISOString().split("T")[0],
//         description: cost.description || '',
//         amount: cost.amount || 0, 
//         category: cost.category || COST_CATEGORIES[0], 
//         project: cost.project || 'General',
//         entity: cost.entity || '',
//         worker: cost.worker || '',
//     });
//     const [isSaving, setIsSaving] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         const costAmount = parseFloat(editData.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!editData.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             await onSave(cost.id, {
//                 ...editData,
//                 amount: costAmount,
//                 // Lógica de 'N/A' al guardar (consistente con el formulario de creación)
//                 entity: editData.entity.trim() || (editData.category === "Mano de Obra" ? 'N/A' : ''), 
//                 worker: editData.worker.trim() || 'N/A', 
//             });
//             onClose();
//         } catch (error) {
//             setErrorMessage("Error al guardar la edición: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     };
    
//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//                     <FaEdit className="inline mr-2 text-indigo-600"/> Editar Coste Manual
//                 </h2>
//                 <button 
//                     onClick={onClose} 
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
//                 >
//                     <FaTimes className="text-xl"/>
//                 </button>

//                 <form onSubmit={handleSave} className="space-y-4">
//                     {/* Campos de Edición */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción:</label>
//                         <input type="text" name="description" value={editData.description} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                             <input type="date" name="date" value={editData.date} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                             <input type="number" name="amount" value={editData.amount} onChange={handleInputChange} min="0.01" step="0.01" required className="w-full p-2 border rounded"/>
//                         </div>
//                     </div>
                    
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select name="category" value={editData.category} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             {COST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
//                             <select name="project" value={editData.project} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                                 {projects.map(p => <option key={p} value={p}>{p}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                              <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
//                             <select 
//                                 name="entity" 
//                                 value={editData.entity} 
//                                 onChange={handleInputChange} 
//                                 required={editData.category !== "Mano de Obra"}
//                                 disabled={editData.category === "Mano de Obra"}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 <option value="">Seleccionar Entidad</option>
//                                 {entities.map(e => <option key={e} value={e}>{e}</option>)}
//                             </select>
//                         </div>
//                     </div>
                    
//                     {editData.category === "Mano de Obra" && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//                             <select 
//                                 name="worker" 
//                                 value={editData.worker} 
//                                 onChange={handleInputChange} 
//                                 required 
//                                 className="w-full p-2 border rounded"
//                             >
//                                 <option value="">Seleccionar Trabajador</option>
//                                 {workers.map(w => <option key={w} value={w}>{w}</option>)}
//                             </select>
//                         </div>
//                     )}
                    
//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
//                         >
//                             Cancelar
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSaving}
//                             className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 ${
//                                 isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//                             }`}
//                         >
//                             {isSaving ? "Guardando..." : "Guardar Cambios"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };


// // --- SUB-COMPONENTE: GeneralSummaryCard ---
// const BAR_COLOR = 'bg-indigo-600';
// const GeneralSummaryCard = ({ 
//     title, 
//     icon: CardIcon, 
//     dataArray, 
//     totalCostCombined, 
//     averageLabel,
//     showCostPerHectare = false, 
//     surfaceAreaMap = {}, 
//     emptyMessage = "No hay costes registrados.",
//     renderItemExtra = null 
// }) => {
    
//     const averageCost = dataArray.length > 0 
//         ? totalCostCombined / dataArray.length 
//         : 0;

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
//                 {CardIcon && <CardIcon className="mr-3 text-2xl text-green-600"/>} 
//                 {title}
//             </h3>

//             <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
                
//                 {dataArray.length === 0 ? (
//                     <div className="flex items-center justify-center h-full min-h-[200px]">
//                         <p className="text-gray-500 italic text-lg">
//                             {emptyMessage}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {dataArray.map((item) => {
//                             const { name, cost, percentageOfTotal, isGeneral } = item;
                            
//                             const surfaceArea = showCostPerHectare ? (surfaceAreaMap[name] || 1) : 1; 
//                             const costPerHectare = showCostPerHectare ? (cost / surfaceArea) : 0;

//                             return (
//                                 <div 
//                                     key={name} 
//                                     className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
//                                 >
//                                     <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
//                                         {showCostPerHectare && <FaRulerCombined className='mr-1 text-xs text-gray-400'/>} 
//                                         <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
//                                         {showCostPerHectare && !isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
//                                         {renderItemExtra && renderItemExtra(item)}
//                                     </p>

//                                     <div className="flex items-center justify-between">
//                                         <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`} 
//                                                 style={{ width: `${percentageOfTotal}%` }}
//                                             ></div>
//                                         </div>
//                                         <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
//                                             {cost.toFixed(2)} € 
//                                             <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {totalCostCombined > 0 && (
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between text-sm font-semibold text-gray-700">
//                         <span className='text-gray-500'>Promedio {averageLabel}</span>
//                         <span className='text-indigo-700 font-extrabold'>
//                             {averageCost.toFixed(2)} €
//                         </span>
//                     </div>
//                     <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
//                         <span className='mr-2 text-sm text-gray-600'>Total Global</span>
//                         <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };
// const GeneralSummaryCardMemo = memo(GeneralSummaryCard);


// // --- SUB-COMPONENTE: CostSummaryTabs ---
// const CostSummaryTabs = ({ 
//     costByProjectCombined, 
//     costByEntityCombined, 
//     costByWorkerCombined, 
//     distributionDataCombined, 
//     totalCostCombined, 
//     availableLocals, // <-- ¡COMA AÑADIDA AQUÍ EN LA LÍNEA 638!
// }) => {
    
//     const [activeTab, setActiveTab] = useState('project'); 

//     const projectSurfaceMap = useMemo(() => {
//         return availableLocals.reduce((acc, local) => {
//             acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1; 
//             return acc;
//         }, { 'General': 1 });
//     }, [availableLocals]);

//     const processDataForSummaryCard = useCallback((dataObject, currentTotalCost) => {
//         if (currentTotalCost === 0) return [];
//         return Object.entries(dataObject)
//             .map(([name, cost]) => ({
//                 name, 
//                 cost,
//                 percentageOfTotal: (cost / currentTotalCost) * 100,
//                 isGeneral: name === 'General',
//             }))
//             .filter(item => item.cost > 0)
//             .sort((a, b) => b.cost - a.cost);
//     }, []);

//     const projectDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByProjectCombined, totalCostCombined), 
//         [costByProjectCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const entityDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByEntityCombined, totalCostCombined), 
//         [costByEntityCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const workerDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByWorkerCombined, totalCostCombined), 
//         [costByWorkerCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const categoryDataForCard = useMemo(() => 
//         processDataForSummaryCard(distributionDataCombined, totalCostCombined), 
//         [distributionDataCombined, totalCostCombined, processDataForSummaryCard]
//     );


//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'project':
//                 return (
//                     <GeneralSummaryCard
//                         title="Detalle de Costes por Cultivo/Proyecto"
//                         icon={FaSeedling}
//                         dataArray={projectDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Proyectos"
//                         showCostPerHectare={true}
//                         surfaceAreaMap={projectSurfaceMap}
//                         emptyMessage="No hay costes registrados para proyectos."
//                     />
//                 );
//             case 'entity':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Entidad Proveedora"
//                         icon={FaBuilding}
//                         dataArray={entityDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Entidades"
//                         emptyMessage="No hay costes registrados para entidades."
//                     />
//                 );
//             case 'worker':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Trabajador"
//                         icon={FaUserTie}
//                         dataArray={workerDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Trabajadores"
//                         emptyMessage="No hay costes registrados para trabajadores."
//                     />
//                 );
//             case 'category':
//                 // La categoría usa los datos de distribución
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Categoría"
//                         icon={FaTags}
//                         dataArray={categoryDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Categorías"
//                         emptyMessage="No hay costes registrados para categorías."
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     const tabClasses = "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 text-center cursor-pointer";
//     const activeTabClasses = "border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50";
//     const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";


//     return (
//         <section className="bg-white shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]"> 
//             <div className="flex border-b border-gray-200">
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'project' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('project')}
//                 >
//                     <FaSeedling className="inline-block mr-2 text-lg"/> Cultivo
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'entity' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('entity')}
//                 >
//                     <FaBuilding className="inline-block mr-2 text-lg"/> Entidad
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'worker' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('worker')}
//                 >
//                     <FaUserTie className="inline-block mr-2 text-lg"/> Trabajador
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'category' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('category')}
//                 >
//                     <FaTags className="inline-block mr-2 text-lg"/> Categoría
//                 </button>
//             </div>
//             <div className="flex-grow p-4 sm:p-6 overflow-hidden">
//                 {renderTabContent()}
//             </div>
//         </section>
//     );
// };
// const CostSummaryTabsMemo = memo(CostSummaryTabs);


// // --- SUB-COMPONENTE: CostInputForm ---
// const CostInputForm = ({ db, userId, setErrorMessage, projects, entities, workers }) => {
    
//     const getDefaultValue = useCallback((list, fallback = "") => {
//         // Devuelve el primer elemento o un valor predeterminado si la lista está vacía
//         return list.length > 0 ? list[0] : fallback;
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "", 
//         category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
//         project: getDefaultValue(projects, "General"),
//         entity: getDefaultValue(entities, ""),
//         worker: getDefaultValue(workers, ""),
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para sincronizar los valores por defecto si las listas cambian
//     useEffect(() => {
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project);
//             const entityExists = entities.includes(prev.entity);
//             const workerExists = workers.includes(prev.worker);
            
//             return { 
//                 ...prev, 
//                 project: projectExists ? prev.project : getDefaultValue(projects, "General"),
//                 entity: entityExists ? prev.entity : getDefaultValue(entities, ""),
//                 worker: workerExists ? prev.worker : getDefaultValue(workers, ""),
//             };
//         });

//     }, [projects, entities, workers, getDefaultValue]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }
        
//         // Validaciones de Selects
//         if (newCost.category !== "Mano de Obra" && !newCost.entity.trim()) {
//             setErrorMessage("Debe seleccionar una entidad proveedora.");
//             return;
//         }
//         if (newCost.category === "Mano de Obra" && !newCost.worker.trim()) {
//              setErrorMessage("Debe seleccionar un trabajador para costes de Mano de Obra.");
//              return;
//         }
//         if (!newCost.project.trim()) {
//              setErrorMessage("Debe seleccionar un proyecto.");
//              return;
//         }


//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 entity: newCost.entity.trim() || (newCost.category === "Mano de Obra" ? 'N/A' : ''), 
//                 worker: newCost.worker.trim() || 'N/A', 
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto seleccionado
//                 entity: getDefaultValue(entities, ""),
//                 worker: getDefaultValue(workers, ""),
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage, getDefaultValue, entities, workers]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste Manual
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {COST_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Proyecto/Cultivo (SELECT) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             disabled={projects.length === 0}
//                         >
//                             {projects.length === 0 && <option value="">Cargando Proyectos...</option>}
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Entidad Proveedora (SELECT) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
//                         <select
//                             name="entity"
//                             value={newCost.entity}
//                             onChange={handleInputChange}
//                             required={newCost.category !== "Mano de Obra"} 
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             disabled={entities.length === 0 || newCost.category === "Mano de Obra"}
//                         >
//                             <option value="">{entities.length > 0 ? 'Seleccionar Entidad' : 'Cargando Entidades...'}</option>
//                             {entities.map((entity) => (
//     <option key={entity} value={entity}>{entity}</option>
// ))}
//                         </select>
//                     </div>

//                     {/* Trabajador (SELECT) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador (Solo Mano de Obra):</label>
//                         <select
//                             name="worker"
//                             value={newCost.worker}
//                             onChange={handleInputChange}
//                             required={newCost.category === "Mano de Obra"} 
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                             disabled={workers.length === 0 || newCost.category !== "Mano de Obra"}
//                         >
//                             <option value="">{workers.length > 0 ? 'Seleccionar Trabajador' : 'Cargando Trabajadores...'}</option>
//                             {workers.map((worker) => (
//                                 <option key={worker} value={worker}>{worker}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Descripción */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                     <input
//                         type="text"
//                         name="description"
//                         value={newCost.description}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="Ej: Compra de fertilizante X"
//                         className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                 </div>


//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart ---
// const CustomTooltip = ({ active, payload, totalCost }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         const percentage = (data.value / totalCost) * 100;
//         return (
//             <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                 <p className="font-bold text-gray-800">{data.name}</p>
//                 <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                 <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//             </div>
//         );
//     }
//     return null;
// };


// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//    const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(i => i.value > 0); // <--- Línea completada y añadida la coma si fuera necesario.
//     }, [distributionData]);

//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                 📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40} 
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ 
//     db, 
//     userId, 
//     setErrorMessage, 
//     errorMessage, 
//     timesheetTotalCostByProject = {}, 
//     timesheetTotalCostByWorker = {}, 
//     timesheetTotalCost = 0, 
//     availableLocals = [], 
//     availableProjects = [], 
//     availableEntities = [], 
//     availableWorkers = [],
// }) => {
//     const [costData, setCostData] = useState([]); 
//     const [isLoading, setIsLoading] = useState(true);
//     const [editingCost, setEditingCost] = useState(null); 
    
//     // Filtros de Historial 
//     const [filterProject, setFilterProject] = useState('');
//     const [filterStartDate, setFilterStartDate] = useState('');
//     const [filterEndDate, setFilterEndDate] = useState('');


//     // 1. Hook de Lectura de Datos de Costes
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             if (!userId) {
//                 setErrorMessage("Autenticación requerida (userId no definido).");
//             }
//             return;
//         }

//         setErrorMessage("");
//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
                
//                 costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes: " + error.message);
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Lógica de Cálculo y Combinación
//     const { 
//         totalCostCombined, 
//         distributionDataCombined, 
//         projectsForSelect, 
//         costByProjectCombined,
//         costByEntityCombined, 
//         costByWorkerCombined, 
//     } = useMemo(() => {
        
//         // --- 1. Cálculos de Costes Manuales (desde Firestore) ---
//         const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distributionManual = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByProjectManual = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByEntityManual = costData.reduce((acc, entry) => {
//             const entity = entry.entity || 'N/A';
//             acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByWorkerManual = costData.reduce((acc, entry) => {
//             const worker = entry.worker || 'N/A';
//             acc[worker] = (acc[worker] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         // --- 2. Combinar con Costes de Timesheets (Mano de Obra) ---
//         const totalCombined = totalManual + timesheetTotalCost;
        
//         // Proyectos
//         const combinedProjectCosts = { ...costByProjectManual };
//         Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
//             if (cost > 0) {
//                 combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
//             }
//         });
        
//         // Distribución por Categoría
//         const combinedDistribution = { ...distributionManual };
//         combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;
        
//         // Costes por Trabajador
//         const combinedWorkerCosts = { ...costByWorkerManual };
//         Object.entries(timesheetTotalCostByWorker).forEach(([workerName, cost]) => {
//             const finalWorkerName = (workerName && workerName !== 'N/A') ? workerName : 'Trabajador Desconocido';
//             if (cost > 0) {
//                  combinedWorkerCosts[finalWorkerName] = (combinedWorkerCosts[finalWorkerName] || 0) + cost;
//             }
//         });
        
//         // Costes por Entidad
//         const combinedEntityCosts = { ...costByEntityManual };

//         if (timesheetTotalCost > 0) {
//             combinedEntityCosts[TIMESHEET_ENTITY_NAME] = (combinedEntityCosts[TIMESHEET_ENTITY_NAME] || 0) + timesheetTotalCost;
//         }

//         // Proyectos para el SELECT del formulario:
//         const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
//         const projects = Array.from(new Set([...availableProjects, 'General', ...uniqueProjectsTimesheet])).sort();

//         return { 
//             totalCostCombined: totalCombined, 
//             distributionDataCombined: combinedDistribution,
//             projectsForSelect: projects, 
//             costByProjectCombined: combinedProjectCosts,
//             costByEntityCombined: combinedEntityCosts, 
//             costByWorkerCombined: combinedWorkerCosts, 
//         };
//     }, [costData, timesheetTotalCost, timesheetTotalCostByProject, availableProjects, timesheetTotalCostByWorker]);


//     // 3. Lógica de Filtrado
//     const filteredCostData = useMemo(() => {
//         let filtered = costData;

//         // Filtro por Proyecto
//         if (filterProject) {
//             filtered = filtered.filter(cost => cost.project === filterProject);
//         }

//         // Filtro por Fecha de Inicio
//         if (filterStartDate) {
//             filtered = filtered.filter(cost => cost.date >= filterStartDate);
//         }

//         // Filtro por Fecha de Fin
//         if (filterEndDate) {
//             filtered = filtered.filter(cost => cost.date <= filterEndDate);
//         }

//         return filtered;
//     }, [costData, filterProject, filterStartDate, filterEndDate]);


//     // 4. Lógica de Acciones (Eliminar y Editar)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             const costDocRef = doc(db, collectionPath, costId);
//             await deleteDoc(costDocRef);
//         } catch (error) {
//             console.error("Error deleting cost: ", error);
//             setErrorMessage("Error al eliminar el coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);


//     const updateCostEntry = useCallback(async (costId, updatedFields) => {
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             const costDocRef = doc(db, collectionPath, costId);
            
//             await updateDoc(costDocRef, updatedFields);
//         } catch (error) {
//             console.error("Error updating cost: ", error);
//             setErrorMessage("Error al actualizar el coste: " + error.message);
//             throw error; // Re-lanza para que el modal lo capture
//         }
//     }, [db, setErrorMessage]);

//     // Renderizado del dashboard
//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-extrabold text-indigo-800 mb-8 flex items-center">
//                 <FaChartBar className="mr-3 text-4xl"/> Panel de Costes y Gastos
//             </h1>

//             {errorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                     <strong className="font-bold">Error:</strong>
//                     <span className="block sm:inline ml-2">{errorMessage}</span>
//                 </div>
//             )}
            
//             {/* Formulario de entrada de costes */}
//             <CostInputFormMemo
//                 db={db}
//                 userId={userId}
//                 setErrorMessage={setErrorMessage}
//                 projects={projectsForSelect}
//                 entities={availableEntities}
//                 workers={availableWorkers}
//             />

//             {isLoading && (
//                 <p className="text-center text-xl p-8 text-indigo-600">
//                     Cargando datos de costes y resúmenes...
//                 </p>
//             )}

//             {!isLoading && (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
//                     {/* Tarjetas de Resumen (Tabs) */}
//                     <div className="lg:col-span-2">
//                         <CostSummaryTabsMemo
//                             totalCostCombined={totalCostCombined}
//                             costByProjectCombined={costByProjectCombined}
//                             costByEntityCombined={costByEntityCombined}
//                             costByWorkerCombined={costByWorkerCombined}
//                             distributionDataCombined={distributionDataCombined}
//                             availableLocals={availableLocals}
//                         />
//                     </div>
//                     {/* Gráfico de Distribución */}
//                     <CostDistributionChartMemo 
//                         distributionData={distributionDataCombined} 
//                         totalCost={totalCostCombined} 
//                     />
//                 </div>
//             )}

//             {/* Listado de Costes Manuales Recientes con FILTROS */}
//             <h2 className="text-2xl font-semibold text-gray-700 mt-12 mb-6 border-b pb-2">
//                 Historial de Costes Manuales Recientes ({filteredCostData.length} registros)
//             </h2>
            
//             {/* Controles de Filtro */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
//                     <select
//                         value={filterProject}
//                         onChange={(e) => setFilterProject(e.target.value)}
//                         className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                     >
//                         <option value="">Todos los Proyectos</option>
//                         {projectsForSelect.map((proj) => (
//                             <option key={proj} value={proj}>{proj}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Inicio:</label>
//                     <input
//                         type="date"
//                         value={filterStartDate}
//                         onChange={(e) => setFilterStartDate(e.target.value)}
//                         className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Fin:</label>
//                     <input
//                         type="date"
//                         value={filterEndDate}
//                         onChange={(e) => setFilterEndDate(e.target.value)}
//                         className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                     />
//                 </div>
//                  <div className="flex items-end">
//                     <button
//                         onClick={() => {
//                             setFilterProject('');
//                             setFilterStartDate('');
//                             setFilterEndDate('');
//                         }}
//                         className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
//                     >
//                         Limpiar Filtros
//                     </button>
//                 </div>
//             </div>

//             {/* Tabla de Historial */}
//             <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//                 <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
//                     {filteredCostData.length === 0 ? (
//                         <p className="text-gray-500 italic text-center py-10">No hay entradas de costes manuales que coincidan con los filtros.</p>
//                     ) : (
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50 sticky top-0">
//                                 <tr>
//                                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
//                                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
//                                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
//                                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Proyecto</th>
//                                     <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Detalle</th>
//                                     <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredCostData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-gray-50">
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-red-600">{cost.amount.toFixed(2)} €</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{cost.category}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-indigo-600 font-medium hidden md:table-cell">{cost.project}</td>
//                                         <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs hidden lg:table-cell">{cost.description}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
//                                             <button
//                                                 onClick={() => setEditingCost(cost)} 
//                                                 className="text-blue-500 hover:text-blue-700 transition duration-150"
//                                                 title="Editar Coste"
//                                             >
//                                                 <FaEdit className="text-lg"/>
//                                             </button>
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-500 hover:text-red-700 transition duration-150"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 <FaTrashAlt className="text-lg"/>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>

//             {/* Modal de Edición */}
//             {editingCost && (
//                 <EditCostModal
//                     cost={editingCost}
//                     onClose={() => setEditingCost(null)}
//                     onSave={updateCostEntry}
//                     projects={projectsForSelect}
//                     entities={availableEntities}
//                     workers={availableWorkers}
//                     setErrorMessage={setErrorMessage}
//                 />
//             )}
//         </div>
//     );
// };

// export const CostDashboard = memo(CostDashboardComponent);









import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    // Importaciones de Firebase Firestore
    collection,
    query,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    deleteDoc,
    doc,
    updateDoc, // para la edición
} from "firebase/firestore";
// Importamos todos los iconos necesarios
import { 
    FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling, 
    FaBuilding, FaUserTie, FaTags, FaTrashAlt, FaEdit, FaTimes 
} from "react-icons/fa"; 

// Constantes
const COST_CATEGORIES = [
    "Mano de Obra", 
    "Productos",
    "Equipo",
    "Servicios",
    "Otros",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const TIMESHEET_ENTITY_NAME = 'Mano de Obra Propia'; 

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();


// --- SUB-COMPONENTE: EditCostModal ---
const EditCostModal = ({ cost, onClose, onSave, projects, entities, workers, setErrorMessage }) => {
    const [editData, setEditData] = useState({
        date: cost.date || new Date().toISOString().split("T")[0],
        description: cost.description || '',
        amount: cost.amount || 0, 
        category: cost.category || COST_CATEGORIES[0], 
        project: cost.project || 'General',
        entity: cost.entity || '',
        worker: cost.worker || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const costAmount = parseFloat(editData.amount);
        if (isNaN(costAmount) || costAmount <= 0) {
            setErrorMessage("El monto debe ser un número positivo.");
            return;
        }
        if (!editData.description.trim()) {
            setErrorMessage("La descripción no puede estar vacía.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(cost.id, {
                ...editData,
                amount: costAmount,
                // Lógica de 'N/A' al guardar (consistente con el formulario de creación)
                entity: editData.entity.trim() || (editData.category === "Mano de Obra" ? 'N/A' : ''), 
                worker: editData.worker.trim() || 'N/A', 
            });
            onClose();
        } catch (error) {
            setErrorMessage("Error al guardar la edición: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    <FaEdit className="inline mr-2 text-indigo-600"/> Editar Coste Manual
                </h2>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                >
                    <FaTimes className="text-xl"/>
                </button>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Campos de Edición */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Descripción:</label>
                        <input type="text" name="description" value={editData.description} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
                            <input type="date" name="date" value={editData.date} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
                            <input type="number" name="amount" value={editData.amount} onChange={handleInputChange} min="0.01" step="0.01" required className="w-full p-2 border rounded"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
                        <select name="category" value={editData.category} onChange={handleInputChange} required className="w-full p-2 border rounded">
                            {COST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
                            <select name="project" value={editData.project} onChange={handleInputChange} required className="w-full p-2 border rounded">
                                {projects.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
                            <select 
                                name="entity" 
                                value={editData.entity} 
                                onChange={handleInputChange} 
                                required={editData.category !== "Mano de Obra"}
                                disabled={editData.category === "Mano de Obra"}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Seleccionar Entidad</option>
                                {entities.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {editData.category === "Mano de Obra" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
                            <select 
                                name="worker" 
                                value={editData.worker} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Seleccionar Trabajador</option>
                                {workers.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    )}
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 ${
                                isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- SUB-COMPONENTE: GeneralSummaryCard ---
const BAR_COLOR = 'bg-indigo-600';
const GeneralSummaryCard = ({ 
    title, 
    icon: CardIcon, 
    dataArray, 
    totalCostCombined, 
    averageLabel,
    showCostPerHectare = false, 
    surfaceAreaMap = {}, 
    emptyMessage = "No hay costes registrados.",
    renderItemExtra = null 
}) => {
    
    const averageCost = dataArray.length > 0 
        ? totalCostCombined / dataArray.length 
        : 0;

    return (
        <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
                {CardIcon && <CardIcon className="mr-3 text-2xl text-green-600"/>} 
                {title}
            </h3>

            <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
                
                {dataArray.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                        <p className="text-gray-500 italic text-lg">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {dataArray.map((item) => {
                            const { name, cost, percentageOfTotal, isGeneral } = item;
                            
                            const surfaceArea = showCostPerHectare ? (surfaceAreaMap[name] || 1) : 1; 
                            const costPerHectare = showCostPerHectare ? (cost / surfaceArea) : 0;

                            return (
                                <div 
                                    key={name} 
                                    className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
                                >
                                    <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
                                        {showCostPerHectare && <FaRulerCombined className='mr-1 text-xs text-gray-400'/>} 
                                        <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
                                        {showCostPerHectare && !isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
                                        {renderItemExtra && renderItemExtra(item)}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`} 
                                                style={{ width: `${percentageOfTotal}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
                                            {cost.toFixed(2)} € 
                                            <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {totalCostCombined > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span className='text-gray-500'>Promedio {averageLabel}</span>
                        <span className='text-indigo-700 font-extrabold'>
                            {averageCost.toFixed(2)} €
                        </span>
                    </div>
                    <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
                        <span className='mr-2 text-sm text-gray-600'>Total Global</span>
                        <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
                    </div>
                </div>
            )}
        </section>
    );
};
const GeneralSummaryCardMemo = memo(GeneralSummaryCard);


// --- SUB-COMPONENTE: CostSummaryTabs ---
const CostSummaryTabs = ({ 
    costByProjectCombined, 
    costByEntityCombined, 
    costByWorkerCombined, 
    distributionDataCombined, 
    totalCostCombined, 
    availableLocals, // <-- ¡COMA AÑADIDA AQUÍ EN LA LÍNEA 638!
}) => {
    
    const [activeTab, setActiveTab] = useState('project'); 

    const projectSurfaceMap = useMemo(() => {
        return availableLocals.reduce((acc, local) => {
            acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1; 
            return acc;
        }, { 'General': 1 });
    }, [availableLocals]);

    const processDataForSummaryCard = useCallback((dataObject, currentTotalCost) => {
        if (currentTotalCost === 0) return [];
        return Object.entries(dataObject)
            .map(([name, cost]) => ({
                name, 
                cost,
                percentageOfTotal: (cost / currentTotalCost) * 100,
                isGeneral: name === 'General',
            }))
            .filter(item => item.cost > 0)
            .sort((a, b) => b.cost - a.cost);
    }, []);

    const projectDataForCard = useMemo(() => 
        processDataForSummaryCard(costByProjectCombined, totalCostCombined), 
        [costByProjectCombined, totalCostCombined, processDataForSummaryCard]
    );

    const entityDataForCard = useMemo(() => 
        processDataForSummaryCard(costByEntityCombined, totalCostCombined), 
        [costByEntityCombined, totalCostCombined, processDataForSummaryCard]
    );

    const workerDataForCard = useMemo(() => 
        processDataForSummaryCard(costByWorkerCombined, totalCostCombined), 
        [costByWorkerCombined, totalCostCombined, processDataForSummaryCard]
    );

    const categoryDataForCard = useMemo(() => 
        processDataForSummaryCard(distributionDataCombined, totalCostCombined), 
        [distributionDataCombined, totalCostCombined, processDataForSummaryCard]
    );


    const renderTabContent = () => {
        switch (activeTab) {
            case 'project':
                return (
                    <GeneralSummaryCard
                        title="Detalle de Costes por Cultivo/Proyecto"
                        icon={FaSeedling}
                        dataArray={projectDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Proyectos"
                        showCostPerHectare={true}
                        surfaceAreaMap={projectSurfaceMap}
                        emptyMessage="No hay costes registrados para proyectos."
                    />
                );
            case 'entity':
                return (
                    <GeneralSummaryCard
                        title="Costes por Entidad Proveedora"
                        icon={FaBuilding}
                        dataArray={entityDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Entidades"
                        emptyMessage="No hay costes registrados para entidades."
                    />
                );
            case 'worker':
                return (
                    <GeneralSummaryCard
                        title="Costes por Trabajador"
                        icon={FaUserTie}
                        dataArray={workerDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Trabajadores"
                        emptyMessage="No hay costes registrados para trabajadores."
                    />
                );
            case 'category':
                // La categoría usa los datos de distribución
                return (
                    <GeneralSummaryCard
                        title="Costes por Categoría"
                        icon={FaTags}
                        dataArray={categoryDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Categorías"
                        emptyMessage="No hay costes registrados para categorías."
                    />
                );
            default:
                return null;
        }
    };

    const tabClasses = "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 text-center cursor-pointer";
    const activeTabClasses = "border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50";
    const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";


    return (
        <section className="bg-white shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]"> 
            <div className="flex border-b border-gray-200">
                <button 
                    className={`${tabClasses} ${activeTab === 'project' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('project')}
                >
                    <FaSeedling className="inline-block mr-2 text-lg"/> Cultivo
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'entity' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('entity')}
                >
                    <FaBuilding className="inline-block mr-2 text-lg"/> Entidad
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'worker' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('worker')}
                >
                    <FaUserTie className="inline-block mr-2 text-lg"/> Trabajador
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'category' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('category')}
                >
                    <FaTags className="inline-block mr-2 text-lg"/> Categoría
                </button>
            </div>
            <div className="flex-grow p-4 sm:p-6 overflow-hidden">
                {renderTabContent()}
            </div>
        </section>
    );
};
const CostSummaryTabsMemo = memo(CostSummaryTabs);


// --- SUB-COMPONENTE: CostInputForm ---
const CostInputForm = ({ db, userId, setErrorMessage, projects, entities, workers }) => {
    
    const getDefaultValue = useCallback((list, fallback = "") => {
        // Devuelve el primer elemento o un valor predeterminado si la lista está vacía
        return list.length > 0 ? list[0] : fallback;
    }, []);

    const [newCost, setNewCost] = useState(() => ({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "", 
        category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
        project: getDefaultValue(projects, "General"),
        entity: getDefaultValue(entities, ""),
        worker: getDefaultValue(workers, ""),
    }));
    const [isSaving, setIsSaving] = useState(false);

    // useEffect para sincronizar los valores por defecto si las listas cambian
    useEffect(() => {
        setNewCost(prev => {
            const projectExists = projects.includes(prev.project);
            const entityExists = entities.includes(prev.entity);
            const workerExists = workers.includes(prev.worker);
            
            return { 
                ...prev, 
                project: projectExists ? prev.project : getDefaultValue(projects, "General"),
                entity: entityExists ? prev.entity : getDefaultValue(entities, ""),
                worker: workerExists ? prev.worker : getDefaultValue(workers, ""),
            };
        });

    }, [projects, entities, workers, getDefaultValue]);


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewCost((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const addCost = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }

        const costAmount = parseFloat(newCost.amount);
        if (isNaN(costAmount) || costAmount <= 0) {
            setErrorMessage("El monto debe ser un número positivo.");
            return;
        }
        if (!newCost.description.trim()) {
            setErrorMessage("La descripción no puede estar vacía.");
            return;
        }
        
        // Validaciones de Selects
        if (newCost.category !== "Mano de Obra" && !newCost.entity.trim()) {
            setErrorMessage("Debe seleccionar una entidad proveedora.");
            return;
        }
        if (newCost.category === "Mano de Obra" && !newCost.worker.trim()) {
             setErrorMessage("Debe seleccionar un trabajador para costes de Mano de Obra.");
             return;
        }
        if (!newCost.project.trim()) {
             setErrorMessage("Debe seleccionar un proyecto.");
             return;
        }


        setIsSaving(true);
        try {
            const collectionPath = `artifacts/${appId}/public/data/costEntries`;
            await addDoc(collection(db, collectionPath), {
                userId: userId,
                date: newCost.date,
                description: newCost.description.trim(),
                amount: costAmount,
                category: newCost.category,
                project: newCost.project,
                entity: newCost.entity.trim() || (newCost.category === "Mano de Obra" ? 'N/A' : ''), 
                worker: newCost.worker.trim() || 'N/A', 
                createdAt: serverTimestamp(),
            });

            // Restablecer el formulario
            setNewCost((prev) => ({
                date: new Date().toISOString().split("T")[0],
                description: "",
                amount: "",
                category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
                project: prev.project, // Mantiene el proyecto seleccionado
                entity: getDefaultValue(entities, ""),
                worker: getDefaultValue(workers, ""),
            }));

        } catch (error) {
            console.error("Error adding cost: ", error);
            setErrorMessage("Error al guardar el coste: " + error.message);
        } finally {
            setIsSaving(false);
        }
    }, [db, userId, newCost, setErrorMessage, getDefaultValue, entities, workers]);

    return (
        <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                💰 Registrar Nuevo Coste Manual
            </h2>
            <form onSubmit={addCost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
                        <input
                            type="date"
                            name="date"
                            value={newCost.date}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
                        <input
                            type="number"
                            name="amount"
                            value={newCost.amount}
                            onChange={handleInputChange}
                            min="0.01"
                            step="0.01"
                            required
                            placeholder="Ej: 150.50"
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
                        <select
                            name="category"
                            value={newCost.category}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {COST_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Proyecto/Cultivo (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
                        <select
                            name="project"
                            value={newCost.project}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={projects.length === 0}
                        >
                            {projects.length === 0 && <option value="">Cargando Proyectos...</option>}
                            {projects.map((proj) => (
                                <option key={proj} value={proj}>{proj}</option>
                            ))}
                        </select>
                    </div>

                    {/* Entidad Proveedora (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
                        <select
                            name="entity"
                            value={newCost.entity}
                            onChange={handleInputChange}
                            required={newCost.category !== "Mano de Obra"} 
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={entities.length === 0 || newCost.category === "Mano de Obra"}
                        >
                            <option value="">{entities.length > 0 ? 'Seleccionar Entidad' : 'Cargando Entidades...'}</option>
                            {entities.map((entity) => (
    <option key={entity} value={entity}>{entity}</option>
))}
                        </select>
                    </div>

                    {/* Trabajador (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador (Solo Mano de Obra):</label>
                        <select
                            name="worker"
                            value={newCost.worker}
                            onChange={handleInputChange}
                            required={newCost.category === "Mano de Obra"} 
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={workers.length === 0 || newCost.category !== "Mano de Obra"}
                        >
                            <option value="">{workers.length > 0 ? 'Seleccionar Trabajador' : 'Cargando Trabajadores...'}</option>
                            {workers.map((worker) => (
                                <option key={worker} value={worker}>{worker}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
                    <input
                        type="text"
                        name="description"
                        value={newCost.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Compra de fertilizante X"
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>


                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
                        isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {isSaving ? "Guardando..." : "Guardar Coste"}
                </button>
            </form>
        </section>
    );
};
const CostInputFormMemo = memo(CostInputForm);


// --- SUB-COMPONENTE: CostDistributionChart ---
const CustomTooltip = ({ active, payload, totalCost }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = (data.value / totalCost) * 100;
        return (
            <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
                <p className="font-bold text-gray-800">{data.name}</p>
                <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
                <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
            </div>
        );
    }
    return null;
};


const CostDistributionChart = ({ distributionData, totalCost }) => {
    
   const pieData = useMemo(() => {
        return COST_CATEGORIES.map((category, index) => ({
            name: category,
            value: distributionData[category] || 0,
            color: COLORS[index % COLORS.length],
        })).filter(i => i.value > 0); // <--- Línea completada y añadida la coma si fuera necesario.
    }, [distributionData]);

    return (
        <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
            </h3>
            {totalCost === 0 ? (
                <div className="flex items-center justify-center h-4/5">
                    <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40} 
                            outerRadius={80}
                            fill="#8884d8"
                            labelLine={false}
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
                        <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};
const CostDistributionChartMemo = memo(CostDistributionChart);


// --- COMPONENTE PRINCIPAL: CostDashboard ---
const CostDashboardComponent = ({ 
    db, 
    userId, 
    setErrorMessage, 
    errorMessage, 
    timesheetTotalCostByProject = {}, 
    timesheetTotalCostByWorker = {}, 
    timesheetTotalCost = 0, 
    availableLocals = [], 
    availableProjects = [], 
    availableEntities = [], 
    availableWorkers = [],
}) => {
    const [costData, setCostData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [editingCost, setEditingCost] = useState(null); 
    
    // Filtros de Historial 
    const [filterProject, setFilterProject] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');


    // 1. Hook de Lectura de Datos de Costes
    useEffect(() => {
        if (!db || !userId) {
            setCostData([]);
            setIsLoading(false);
            if (!userId) {
                setErrorMessage("Autenticación requerida (userId no definido).");
            }
            return;
        }

        setErrorMessage("");
        const collectionPath = `artifacts/${appId}/public/data/costEntries`;
        const entriesCollection = collection(db, collectionPath);
        
        const q = query(entriesCollection, where("userId", "==", userId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const costs = [];
                snapshot.forEach((doc) => {
                    costs.push({ id: doc.id, ...doc.data() });
                });
                
                costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

                setCostData(costs);
                setIsLoading(false);
            },
            (error) => {
                console.error("Firestore cost data error:", error);
                setErrorMessage("Error al cargar los datos de costes: " + error.message);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [db, userId, setErrorMessage]);


    // 2. Lógica de Cálculo y Combinación
    const { 
        totalCostCombined, 
        distributionDataCombined, 
        projectsForSelect, 
        costByProjectCombined,
        costByEntityCombined, 
        costByWorkerCombined, 
    } = useMemo(() => {
        
        // --- 1. Cálculos de Costes Manuales (desde Firestore) ---
        const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
        const distributionManual = costData.reduce((acc, entry) => {
            const category = entry.category || 'Otros';
            acc[category] = (acc[category] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByProjectManual = costData.reduce((acc, entry) => {
            const project = entry.project || 'General';
            acc[project] = (acc[project] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByEntityManual = costData.reduce((acc, entry) => {
            const entity = entry.entity || 'N/A';
            acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByWorkerManual = costData.reduce((acc, entry) => {
            const worker = entry.worker || 'N/A';
            acc[worker] = (acc[worker] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        // --- 2. Combinar con Costes de Timesheets (Mano de Obra) ---
        const totalCombined = totalManual + timesheetTotalCost;
        
        // Proyectos
        const combinedProjectCosts = { ...costByProjectManual };
        Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
            if (cost > 0) {
                combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
            }
        });
        
        // Distribución por Categoría
        const combinedDistribution = { ...distributionManual };
        combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;
        
        // Costes por Trabajador
        const combinedWorkerCosts = { ...costByWorkerManual };
        Object.entries(timesheetTotalCostByWorker).forEach(([workerName, cost]) => {
            const finalWorkerName = (workerName && workerName !== 'N/A') ? workerName : 'Trabajador Desconocido';
            if (cost > 0) {
                 combinedWorkerCosts[finalWorkerName] = (combinedWorkerCosts[finalWorkerName] || 0) + cost;
            }
        });
        
        // Costes por Entidad
        const combinedEntityCosts = { ...costByEntityManual };

        if (timesheetTotalCost > 0) {
            combinedEntityCosts[TIMESHEET_ENTITY_NAME] = (combinedEntityCosts[TIMESHEET_ENTITY_NAME] || 0) + timesheetTotalCost;
        }

        // Proyectos para el SELECT del formulario:
        const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
        const projects = Array.from(new Set([...availableProjects, 'General', ...uniqueProjectsTimesheet])).sort();

        return { 
            totalCostCombined: totalCombined, 
            distributionDataCombined: combinedDistribution,
            projectsForSelect: projects, 
            costByProjectCombined: combinedProjectCosts,
            costByEntityCombined: combinedEntityCosts, 
            costByWorkerCombined: combinedWorkerCosts, 
        };
    }, [costData, timesheetTotalCost, timesheetTotalCostByProject, availableProjects, timesheetTotalCostByWorker]);


    // 3. Lógica de Filtrado
    const filteredCostData = useMemo(() => {
        let filtered = costData;

        // Filtro por Proyecto
        if (filterProject) {
            filtered = filtered.filter(cost => cost.project === filterProject);
        }

        // Filtro por Fecha de Inicio
        if (filterStartDate) {
            filtered = filtered.filter(cost => cost.date >= filterStartDate);
        }

        // Filtro por Fecha de Fin
        if (filterEndDate) {
            filtered = filtered.filter(cost => cost.date <= filterEndDate);
        }

        return filtered;
    }, [costData, filterProject, filterStartDate, filterEndDate]);


    // 4. Lógica de Acciones (Eliminar y Editar)
    const deleteCostEntry = useCallback(async (costId) => {
        if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
            return;
        }
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }
        try {
            const collectionPath = `artifacts/${appId}/public/data/costEntries`;
            const costDocRef = doc(db, collectionPath, costId);
            await deleteDoc(costDocRef);
        } catch (error) {
            console.error("Error deleting cost: ", error);
            setErrorMessage("Error al eliminar el coste: " + error.message);
        }
    }, [db, setErrorMessage]);


    const updateCostEntry = useCallback(async (costId, updatedFields) => {
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }
        try {
            const collectionPath = `artifacts/${appId}/public/data/costEntries`;
            const costDocRef = doc(db, collectionPath, costId);
            
            await updateDoc(costDocRef, updatedFields);
        } catch (error) {
            console.error("Error updating cost: ", error);
            setErrorMessage("Error al actualizar el coste: " + error.message);
            throw error; // Re-lanza para que el modal lo capture
        }
    }, [db, setErrorMessage]);

    // Renderizado del dashboard
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-indigo-800 mb-8 flex items-center">
                <FaChartBar className="mr-3 text-4xl"/> Panel de Costes y Gastos
            </h1>

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{errorMessage}</span>
                </div>
            )}
            
            {/* Formulario de entrada de costes */}
            <CostInputFormMemo
                db={db}
                userId={userId}
                setErrorMessage={setErrorMessage}
                projects={projectsForSelect}
                entities={availableEntities}
                workers={availableWorkers}
            />

            {isLoading && (
                <p className="text-center text-xl p-8 text-indigo-600">
                    Cargando datos de costes y resúmenes...
                </p>
            )}

            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {/* Tarjetas de Resumen (Tabs) */}
                    <div className="lg:col-span-2">
                        <CostSummaryTabsMemo
                            totalCostCombined={totalCostCombined}
                            costByProjectCombined={costByProjectCombined}
                            costByEntityCombined={costByEntityCombined}
                            costByWorkerCombined={costByWorkerCombined}
                            distributionDataCombined={distributionDataCombined}
                            availableLocals={availableLocals}
                        />
                    </div>
                    {/* Gráfico de Distribución */}
                    <CostDistributionChartMemo 
                        distributionData={distributionDataCombined} 
                        totalCost={totalCostCombined} 
                    />
                </div>
            )}

            {/* Listado de Costes Manuales Recientes con FILTROS */}
            <h2 className="text-2xl font-semibold text-gray-700 mt-12 mb-6 border-b pb-2">
                Historial de Costes Manuales Recientes ({filteredCostData.length} registros)
            </h2>
            
            {/* Controles de Filtro */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    >
                        <option value="">Todos los Proyectos</option>
                        {projectsForSelect.map((proj) => (
                            <option key={proj} value={proj}>{proj}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Inicio:</label>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Fin:</label>
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    />
                </div>
                 <div className="flex items-end">
                    <button
                        onClick={() => {
                            setFilterProject('');
                            setFilterStartDate('');
                            setFilterEndDate('');
                        }}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Tabla de Historial */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                    {filteredCostData.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-10">No hay entradas de costes manuales que coincidan con los filtros.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Proyecto</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Detalle</th>
                                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCostData.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-red-600">{cost.amount.toFixed(2)} €</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{cost.category}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-indigo-600 font-medium hidden md:table-cell">{cost.project}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs hidden lg:table-cell">{cost.description}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => setEditingCost(cost)} 
                                                className="text-blue-500 hover:text-blue-700 transition duration-150"
                                                title="Editar Coste"
                                            >
                                                <FaEdit className="text-lg"/>
                                            </button>
                                            <button
                                                onClick={() => deleteCostEntry(cost.id)}
                                                className="text-red-500 hover:text-red-700 transition duration-150"
                                                title="Eliminar Coste"
                                            >
                                                <FaTrashAlt className="text-lg"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal de Edición */}
            {editingCost && (
                <EditCostModal
                    cost={editingCost}
                    onClose={() => setEditingCost(null)}
                    onSave={updateCostEntry}
                    projects={projectsForSelect}
                    entities={availableEntities}
                    workers={availableWorkers}
                    setErrorMessage={setErrorMessage}
                />
            )}
        </div>
    );
};

export const CostDashboard = memo(CostDashboardComponent);





