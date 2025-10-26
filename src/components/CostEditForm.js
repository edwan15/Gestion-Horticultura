// src/components/CostEditForm.js

import React, { useState, useEffect } from 'react';
// Importa motion si tienes framer-motion instalado
// import { motion } from 'framer-motion';

// --- Componente auxiliar InputField (definición local para el formulario de costes) ---
// NOTA: Es importante que el InputField dentro de CostEditForm sea sencillo,
// ya que el manejo de estado principal se hace en el componente padre (CostEditForm).
// const InputField = ({ label, type, value, field, handleCostChange, placeholder }) => {
//     return (
//         <div className="flex flex-col space-y-1">
//             <label className="text-sm font-semibold text-gray-700">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 // Convertir a cadena o usar cadena vacía para inputs controlados
//                 value={value || value === 0 ? String(value) : ""}
//                 // Llama a la función 'handleCostChange' del componente padre
//                 onChange={(e) => handleCostChange(field, e.target.value)}
//                 placeholder={placeholder}
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 ease-in-out text-base font-medium text-gray-800"
//             />
//         </div>

//     );
// };

// const InputField = ({ label, type, value, field, handleCostChange, placeholder }) => {

//     // ✅ CORRECCIÓN CLAVE: Si el valor es 0, null, o undefined, mostramos "".
//     // Esto permite al usuario borrar completamente el campo.
//     const displayValue = (value === 0 || value === null || value === undefined)
//         ? ""
//         : String(value);

//     // Nota: Asumiendo que handleCostChange recibe (field, value) y que el CostEditForm
//     // se encarga de añadir la dateKey antes de llamar a la función del padre.
//     const handleChange = (e) => {
//         handleCostChange(field, e.target.value);
//     };

//     return (
//         <div className="flex flex-col space-y-1">
//             <label className="text-sm font-semibold text-gray-700">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 // Usamos la lógica corregida para el display
//                 value={displayValue}

//                 // Llama a la función 'handleCostChange' del componente padre
//                 onChange={handleChange}
//                 placeholder={placeholder}
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 ease-in-out text-base font-medium text-gray-800"
//             />
//         </div>
//     );
// };

// const InputField = ({ label, type, value, field, handleCostChange, placeholder }) => {

//     // ✅ CORRECCIÓN CLAVE: Transforma el 0 (número del estado) en "" (cadena vacía)
//     // para que el input controlado permita escribir.
//     const displayValue = (value === 0 || value === null || value === undefined)
//         ? ""
//         : String(value);

//     const handleChange = (e) => {
//         // Asume que el CostEditForm ya ha anidado la dateKey
//         handleCostChange(field, e.target.value);
//     };

//     return (
//         <div className="flex flex-col space-y-1">
//             <label className="text-sm font-semibold text-gray-700">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 // Usamos la lógica corregida para el display
//                 value={displayValue}
//                 onChange={handleChange}
//                 placeholder={placeholder}
//                 className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 ease-in-out text-base font-medium text-gray-800"
//             />
//         </div>
//     );
// };

// // --- Componente principal CostEditForm ---
// const CostEditForm = ({
//     dateKey,
//     dailyTotalProduction,
//     costData,
//     handleCostChange,
//     handleSaveCostData,
//     handleDayClick,
//     productionCostVariable,
//     finalProductionCost,
//     HOURLY_COST_RATE,
//     formatNumber, // Esta utilidad debe pasarse como prop
// }) => {

//     // --- Definición de variantes de animación (opcional, si usas framer-motion) ---
//     // Si no usas framer-motion, elimina las referencias a 'motion.div' y deja solo 'div'
//     const MotionDiv = window.motion?.div || 'div';

//     const containerVariants = {
//         hidden: { opacity: 0, scale: 0.9 },
//         visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 },
//     };
//     // ---------------------------------------------------------------------------

//     const numWorkers = costData?.numWorkers || 0;
//     const hoursWorked = costData?.hoursWorked || 0;

//     return (
//         <MotionDiv
//             className="p-6 bg-white rounded-2xl shadow-2xl border-t-4 border-teal-600 max-w-lg mx-auto space-y-6 mt-8"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//         >
//             {/* Botón Volver */}
//             <button
//                 onClick={() => handleDayClick(dateKey, "view")} // Vuelve a la vista 'view'
//                 className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
//             >
//                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
//                 Volver a la vista del día
//             </button>

//             <h3 className="text-3xl font-extrabold text-teal-800 border-b-2 border-teal-200 pb-3 flex items-center">
//                 <svg className="w-8 h-8 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01M9 13h2m4-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m0 0h.01M17 19v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01"></path></svg>
//                 Coste de Producción: {dateKey}
//             </h3>

//             {/* Total del Día (Producción en Kg) */}
//             <MotionDiv
//                 className="p-4 bg-indigo-50 rounded-xl shadow-lg border-l-4 border-indigo-500 flex justify-between items-center"
//                 variants={itemVariants}
//                 transition={{ delay: 0.1 }}
//             >
//                 <div>
//                     <p className="text-md font-medium text-indigo-700">Producción Total (Kg):</p>
//                 </div>
//                 <p className="text-3xl font-extrabold text-indigo-900">
//                     {formatNumber(dailyTotalProduction)} Kg
//                 </p>
//             </MotionDiv>

//             {/* Campos de Input */}
//             <MotionDiv
//                 className="grid grid-cols-2 gap-4"
//                 variants={itemVariants}
//                 transition={{ delay: 0.2 }}
//             >
//                 <InputField
//                     label="👨‍🌾 N. Trabajadores"
//                     type="number"
//                     value={numWorkers}
//                     field="numWorkers"
//                     handleCostChange={handleCostChange}
//                     placeholder="Ejem: 5"
//                     dateKey={dateKey}
//                 />
//                 <InputField
//                     label="⏱ H. Trabajadas (p/trabajador)"
//                     type="number"
//                     value={hoursWorked}
//                     field="hoursWorked"
//                     handleCostChange={handleCostChange}
//                     placeholder="Ejem: 8"
//                     dateKey={dateKey}
//                 />
//             </MotionDiv>

//             {/* Campo fijo: Coste de Hora */}
//             <MotionDiv
//                 className="p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200 flex justify-between items-center"
//                 variants={itemVariants}
//                 transition={{ delay: 0.3 }}
//             >
//                 <p className="text-sm font-medium text-gray-700">
//                     Coste Fijo por Hora:
//                 </p>
//                 <p className="text-xl font-bold text-gray-800">
//                     {formatNumber(HOURLY_COST_RATE)} €
//                 </p>
//             </MotionDiv>

//             {/* Resultado 1: Produccion (Coste Variable Total) */}
//             <MotionDiv
//                 className="p-4 bg-yellow-50 rounded-xl border border-yellow-400 shadow-md"
//                 variants={itemVariants}
//                 transition={{ delay: 0.4 }}
//             >
//                 <p className="text-md font-bold text-yellow-800 mb-1">
//                     Coste Laboral Diario (Variable):
//                 </p>
//                 <p className="text-2xl font-extrabold text-yellow-900">
//                     {formatNumber(productionCostVariable)} €
//                 </p>
//             </MotionDiv>

//             {/* Resultado 2: Coste de Producción por Kg */}
//             <MotionDiv
//                 className="p-4 bg-green-50 rounded-xl border border-green-400 shadow-lg"
//                 variants={itemVariants}
//                 transition={{ delay: 0.5 }}
//             >
//                 <p className="text-md font-bold text-green-800 mb-1">
//                     Coste de Producción Final:
//                 </p>
//                 <p className="text-4xl font-extrabold text-green-900">
//                     {formatNumber(finalProductionCost, 4)} €/Kg
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                     Cálculo: (Coste Laboral / Producción Total)
//                 </p>
//             </MotionDiv>

//             {/* Botón de Guardar */}
//             <MotionDiv
//                 className="pt-4 border-t border-teal-200"
//                 variants={itemVariants}
//                 transition={{ delay: 0.6 }}
//             >
//                 <button
//                     onClick={handleSaveCostData}
//                     className="w-full py-3 bg-teal-600 text-white font-bold rounded-lg shadow-xl hover:bg-teal-700 transition transform hover:scale-[1.01] flex items-center justify-center text-lg"
//                 >
//                     <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
//                     Guardar Costes
//                 </button>
//             </MotionDiv>
//         </MotionDiv>
//     );
// };

// export default CostEditForm;

// =======================================================
// 🛠️ InputField CORREGIDO
// 1. Ahora recibe 'dateKey'
// 2. Llama correctamente a handleCostChange(dateKey, field, value)
// =======================================================
// const InputField = ({
//   label,
//   type,
//   value,
//   field,
//   handleCostChange,
//   placeholder,
//   dateKey,
// }) => {
//   // ✅ Lógica de Display: Convertimos el valor (que puede ser string crudo '5.' o número 5)
//   // a una cadena. Si es un valor vacío, lo mostramos vacío.
//   const displayValue =
//     value === 0 || value === null || value === undefined || value === ""
//       ? ""
//       : String(value);

//   const handleChange = (e) => {
//     // 🚨 CORRECCIÓN CRÍTICA: Debes pasar el dateKey.
//     // La firma es: handleCostChange(dateKey, field, value)
//     handleCostChange(dateKey, field, e.target.value);
//   };

//   return (
//     <div className="flex flex-col space-y-1">
//       <label className="text-sm font-semibold text-gray-700">{label}</label>
//       <input
//         type={type}
//         // Usamos la lógica corregida para el display
//         value={displayValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 ease-in-out text-base font-medium text-gray-800"
//       />
//     </div>
//   );
// };

// =======================================================
// 🛠️ CostEditForm CORREGIDO
// 1. Lee los valores 'raw_' del estado (que tu función handleCostChange guarda).
// 2. Pasa los valores 'raw_' al InputField para que la escritura sea fluida.
// =======================================================
// const CostEditForm = ({
//   dateKey,
//   dailyTotalProduction,
//   costData,
//   handleCostChange,
//   handleSaveCostData,
//   handleDayClick,
//   productionCostVariable,
//   finalProductionCost,
//   HOURLY_COST_RATE,
//   formatNumber,
// }) => {
//   // --- Definición de variantes de animación (Manteniendo tu código) ---
//   const MotionDiv = window.motion?.div || "div";

//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };
//   // ---------------------------------------------------------------------------

//   // 🔑 LECTURA DE VALORES NUMÉRICOS (para cálculos)
//   const numWorkers = costData?.numWorkers || 0;
//   const hoursWorked = costData?.hoursWorked || 0;

//   // 🔑 LECTURA CRÍTICA DE VALORES CRUDOS (para el input y los decimales)
//   const rawNumWorkers = costData?.raw_numWorkers;
//   const rawHoursWorked = costData?.raw_hoursWorked;

//   return (
//     <MotionDiv
//       className="p-6 bg-white rounded-2xl shadow-2xl border-t-4 border-teal-600 max-w-lg mx-auto space-y-6 mt-8"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Botón Volver */}
//       <button
//         onClick={() => handleDayClick(dateKey, "day_view")}
//         className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
//       >
//         <svg
//           className="w-4 h-4 mr-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M10 19l-7-7m0 0l7-7m-7 7h18"
//           ></path>
//         </svg>
//         Volver a la vista del día
//       </button>

//       <h3 className="text-3xl font-extrabold text-teal-800 border-b-2 border-teal-200 pb-3 flex items-center">
//         <svg
//           className="w-8 h-8 mr-2 text-teal-600"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01M9 13h2m4-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m0 0h.01M17 19v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01"
//           ></path>
//         </svg>
//         Coste de Producción: {dateKey}
//       </h3>

//       {/* Total del Día (Producción en Kg) */}
//       <MotionDiv
//         className="p-4 bg-indigo-50 rounded-xl shadow-lg border-l-4 border-indigo-500 flex justify-between items-center"
//         variants={itemVariants}
//         transition={{ delay: 0.1 }}
//       >
//         <div>
//           <p className="text-md font-medium text-indigo-700">
//             Producción Total (Kg):
//           </p>
//         </div>
//         <p className="text-3xl font-extrabold text-indigo-900">
//           {formatNumber(dailyTotalProduction)} Kg
//         </p>
//       </MotionDiv>

//       {/* Campos de Input */}
//       <MotionDiv
//         className="grid grid-cols-2 gap-4"
//         variants={itemVariants}
//         transition={{ delay: 0.2 }}
//       >
//         <InputField
//           label="👨‍🌾 N. Trabajadores"
//           type="number"
//           // 🚨 CORRECCIÓN: Usamos rawNumWorkers si está disponible para manejar la cadena "5."
//           value={rawNumWorkers !== undefined ? rawNumWorkers : numWorkers}
//           field="numWorkers"
//           handleCostChange={handleCostChange}
//           placeholder="Ejem: 5"
//           dateKey={dateKey} // 🚨 CRÍTICO: Pasamos dateKey
//         />
//         <InputField
//           label="⏱ H. Trabajadas (p/trabajador)"
//           type="number"
//           // 🚨 CORRECCIÓN: Usamos rawHoursWorked si está disponible para manejar la cadena "8."
//           value={rawHoursWorked !== undefined ? rawHoursWorked : hoursWorked}
//           field="hoursWorked"
//           handleCostChange={handleCostChange}
//           placeholder="Ejem: 8"
//           dateKey={dateKey} // 🚨 CRÍTICO: Pasamos dateKey
//         />
//       </MotionDiv>

//       {/* Campo fijo: Coste de Hora */}
//       <MotionDiv
//         className="p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200 flex justify-between items-center"
//         variants={itemVariants}
//         transition={{ delay: 0.3 }}
//       >
//         <p className="text-sm font-medium text-gray-700">
//           Coste Fijo por Hora:
//         </p>
//         <p className="text-xl font-bold text-gray-800">
//           {formatNumber(HOURLY_COST_RATE)} €
//         </p>
//       </MotionDiv>

//       {/* Resultado 1: Produccion (Coste Variable Total) */}
//       <MotionDiv
//         className="p-4 bg-yellow-50 rounded-xl border border-yellow-400 shadow-md"
//         variants={itemVariants}
//         transition={{ delay: 0.4 }}
//       >
//         <p className="text-md font-bold text-yellow-800 mb-1">
//           Coste Laboral Diario (Variable):
//         </p>
//         <p className="text-2xl font-extrabold text-yellow-900">
//           {formatNumber(productionCostVariable)} €
//         </p>
//       </MotionDiv>

//       {/* Resultado 2: Coste de Producción por Kg */}
//       <MotionDiv
//         className="p-4 bg-green-50 rounded-xl border border-green-400 shadow-lg"
//         variants={itemVariants}
//         transition={{ delay: 0.5 }}
//       >
//         <p className="text-md font-bold text-green-800 mb-1">
//           Coste de Producción Final:
//         </p>
//         <p className="text-4xl font-extrabold text-green-900">
//           {formatNumber(finalProductionCost, 4)} €/Kg
//         </p>
//         <p className="text-xs text-gray-500 mt-1">
//           Cálculo: (Coste Laboral / Producción Total)
//         </p>
//       </MotionDiv>

//       {/* Botón de Guardar */}
//       <MotionDiv
//         className="pt-4 border-t border-teal-200"
//         variants={itemVariants}
//         transition={{ delay: 0.6 }}
//       >
//         <button
//           onClick={handleSaveCostData}
//           className="w-full py-3 bg-teal-600 text-white font-bold rounded-lg shadow-xl hover:bg-teal-700 transition transform hover:scale-[1.01] flex items-center justify-center text-lg"
//         >
//           <svg
//             className="w-6 h-6 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
//             ></path>
//           </svg>
//           Guardar Costes
//         </button>
//       </MotionDiv>
//     </MotionDiv>
//   );
// };



// const CostEditForm = ({ 
//     dateKey, 
//     dailyData, 
//     handleDayClick, 
//     handleSave, // La función unificada
//     formatNumber 
// }) => {
    
//     // Obtener datos iniciales de forma segura
//     const existingData = dailyData[dateKey] || {};
//     // ✅ CRÍTICO: Acceder al objeto 'costData' que creamos en handleSave
//     const initialCostData = existingData.costData || {};

//     const [costState, setCostState] = useState({
//         // Inicializar desde el estado existente o a vacío
//         numWorkers: initialCostData.numWorkers?.toString() || '', 
//         hoursWorked: initialCostData.hoursWorked?.toString() || '',
//         // Añadir otros campos de coste aquí si existen...
//     });

//     const [isSaving, setIsSaving] = useState(false);

//     // 🚨 Sincronizar el estado interno con las props si dailyData cambia externamente
//     useEffect(() => {
//         const currentData = dailyData[dateKey]?.costData || {};
//         setCostState({
//             numWorkers: currentData.numWorkers?.toString() || '',
//             hoursWorked: currentData.hoursWorked?.toString() || '',
//             // ... otros campos
//         });
//     }, [dailyData, dateKey]);

//     // Función de manejo de cambios LOCAL
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCostState(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Función de guardado LOCAL
//     const handleSaveLocal = async (e) => {
//         e.preventDefault();
//         setIsSaving(true);
        
//         // 1. Limpieza de datos antes de enviar
//         const dataToSave = {
//             numWorkers: parseFloat(costState.numWorkers) || 0,
//             hoursWorked: parseFloat(costState.hoursWorked) || 0,
//             // ...
//         };

//         // 2. Llamar a la función de guardado global (Pasamos la clave, NULL para items, y los costes)
//         // La función global se encarga de calcular productionCostVariable y finalProductionCost.
//         await handleSave(dateKey, null, dataToSave);
        
//         setIsSaving(false);
//         // handleSave ya debe llamar a handleDayClick para cambiar la vista
//     };

//     // Renderizado...

//     const dayCostData = existingData; // Usamos la data completa para mostrar los costes calculados
    
//     return (
//         <div className="p-4 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
//             {/* Botón de Volver */}
//             <button 
//                 onClick={() => handleDayClick(dateKey, "day_view")} 
//                 className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
//             >
//                 Volver a la vista del día
//             </button>
            
//             <h2 className="text-3xl font-extrabold text-teal-700 border-b pb-3">
//                 Editar Costes del Día: {dateKey}
//             </h2>
            
//             {/* Display de Costes Actuales */}
//             <div className="p-4 bg-blue-50 rounded-xl border border-blue-300 shadow-md">
//                 <p className="text-lg font-semibold text-blue-800">Coste Laboral Diario:</p>
//                 <p className="text-2xl font-extrabold text-blue-700">
//                     {formatNumber(dayCostData.productionCostVariable || 0)} €
//                 </p>
//                 <p className="mt-2 text-lg font-semibold text-blue-800">Coste por Kg Producido:</p>
//                 <p className="text-2xl font-extrabold text-blue-700">
//                     {formatNumber(dayCostData.finalProductionCost || 0, 4)} €/Kg
//                 </p>
//             </div>

//             <form onSubmit={handleSaveLocal} className="space-y-6">
                
//                 {/* Campo Trabajadores */}
//                 <div>
//                     <label htmlFor="numWorkers" className="block text-sm font-medium text-gray-700">
//                         Número de Trabajadores
//                     </label>
//                     <input
//                         type="number"
//                         id="numWorkers"
//                         name="numWorkers"
//                         value={costState.numWorkers}
//                         onChange={handleChange}
//                         className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-teal-500 focus:border-teal-500"
//                         placeholder="Ej: 5"
//                         min="0"
//                     />
//                 </div>
                
//                 {/* Campo Horas Trabajadas */}
//                 <div>
//                     <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700">
//                         Horas Trabajadas por Turno
//                     </label>
//                     <input
//                         type="number"
//                         id="hoursWorked"
//                         name="hoursWorked"
//                         value={costState.hoursWorked}
//                         onChange={handleChange}
//                         className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-teal-500 focus:border-teal-500"
//                         placeholder="Ej: 8.5"
//                         step="0.1"
//                         min="0"
//                     />
//                 </div>

//                 {/* Botón Guardar */}
//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className="w-full py-3 bg-teal-600 text-white font-bold rounded-lg shadow-xl hover:bg-teal-700 transition disabled:bg-teal-400 flex items-center justify-center"
//                 >
//                     {isSaving ? (
//                         <>
//                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                             Guardando...
//                         </>
//                     ) : (
//                         "Guardar Costes"
//                     )}
//                 </button>
//             </form>
//         </div>
//     );
// };












const InputField = ({ label, type, value, field, handleChange, placeholder }) => (
    <div>
        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={field}
            name={field}
            value={value}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-teal-500 focus:border-teal-500"
            placeholder={placeholder}
            step={field === "hoursWorked" ? "0.1" : "1"}
            min="0"
        />
    </div>
);


const CostEditForm = ({
    dateKey,
    dailyData,
    handleDayClick,
    handleSave, // ⬅️ Utilizamos la función unificada
    formatNumber,
    HOURLY_COST_RATE, // ⬅️ Asegúrate de pasar esta prop desde el padre
    calculateCosts // ⬅️ Necesitas esta función para el cálculo local temporal
}) => {

    // --- Definición de variantes de animación (Manteniendo tu código) ---
    const MotionDiv = window.motion?.div || "div"; // Asegúrate de que 'window.motion' existe si lo usas.

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    // -------------------------------------------------------------------
    
    // Obtener datos existentes de forma segura
    const existingDayData = dailyData[dateKey] || {};
    const existingCostData = existingDayData.costData || {};
    const dailyTotalProduction = parseFloat(existingDayData.dailyTotal || 0);

    // 1. Estado Local para la edición
    const [costState, setCostState] = useState({
        // Inicializar desde los datos existentes o a vacío (usamos toString para inputs)
        numWorkers: existingCostData.numWorkers?.toString() || '',
        hoursWorked: existingCostData.hoursWorked?.toString() || '',
    });

    const [isSaving, setIsSaving] = useState(false);

    // 2. Cálculo Temporal de Costes (para mostrar el resultado en tiempo real)
    // Estos valores se recalculan en tiempo real mientras el usuario escribe.
    const numWorkers = parseFloat(costState.numWorkers) || 0;
    const hoursWorked = parseFloat(costState.hoursWorked) || 0;

    const { productionCostVariable, finalProductionCost } = calculateCosts(
        dailyTotalProduction,
        numWorkers,
        hoursWorked,
        HOURLY_COST_RATE // Pasa la tarifa si calculateCosts la requiere
    );


    // 3. Manejador de Cambios Local (solo actualiza el estado string)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Solo aceptamos números (incluyendo decimales)
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
             setCostState(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    
    // 4. Manejador de Guardado (Llama a la función unificada del padre)
    const handleSaveLocal = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Formatear los datos para el guardado (a number)
        const dataToSave = {
            numWorkers: numWorkers, // Ya está convertido arriba
            hoursWorked: hoursWorked, // Ya está convertido arriba
        };

        // 🚨 Llamar a la función unificada: (dateKey, items = null, costData)
        await handleSave(dateKey, null, dataToSave);
        
        setIsSaving(false);
        // handleSave se encarga de cambiar la vista y mostrar el toast.
    };


    return (
        <MotionDiv
            className="p-6 bg-white rounded-2xl shadow-2xl border-t-4 border-teal-600 max-w-lg mx-auto space-y-6 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Botón Volver */}
            <button
                onClick={() => handleDayClick(dateKey, "day_view")}
                className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
            >
                {/* SVG del botón... */}
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a la vista del día
            </button>

            <h3 className="text-3xl font-extrabold text-teal-800 border-b-2 border-teal-200 pb-3 flex items-center">
                {/* SVG del título... */}
                <svg className="w-8 h-8 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01M9 13h2m4-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m0 0h.01M17 19v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01"></path>
                </svg>
                Coste de Producción: {dateKey}
            </h3>

            {/* Total del Día (Producción en Kg) */}
            <MotionDiv
                className="p-4 bg-indigo-50 rounded-xl shadow-lg border-l-4 border-indigo-500 flex justify-between items-center"
                variants={itemVariants}
                transition={{ delay: 0.1 }}
            >
                <div>
                    <p className="text-md font-medium text-indigo-700">
                        Producción Total (Kg):
                    </p>
                </div>
                <p className="text-3xl font-extrabold text-indigo-900">
                    {formatNumber(dailyTotalProduction)} Kg
                </p>
            </MotionDiv>

            <form onSubmit={handleSaveLocal}>
                {/* Campos de Input */}
                <MotionDiv
                    className="grid grid-cols-2 gap-4"
                    variants={itemVariants}
                    transition={{ delay: 0.2 }}
                >
                    {/* 🚨 Usamos costState.numWorkers (string) directamente en el value */}
                    <InputField
                        label="👨‍🌾 N. Trabajadores"
                        type="text" // Usamos 'text' para permitir la edición de decimales como strings
                        value={costState.numWorkers}
                        field="numWorkers"
                        handleChange={handleChange} // ⬅️ Usamos el handler local
                        placeholder="Ejem: 5"
                    />
                    {/* 🚨 Usamos costState.hoursWorked (string) directamente en el value */}
                    <InputField
                        label="⏱ H. Trabajadas (p/trabajador)"
                        type="text" // Usamos 'text' para permitir la edición de decimales como strings
                        value={costState.hoursWorked}
                        field="hoursWorked"
                        handleChange={handleChange} // ⬅️ Usamos el handler local
                        placeholder="Ejem: 8"
                    />
                </MotionDiv>
            </form>

            {/* Campo fijo: Coste de Hora */}
            <MotionDiv
                className="p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200 flex justify-between items-center"
                variants={itemVariants}
                transition={{ delay: 0.3 }}
            >
                <p className="text-sm font-medium text-gray-700">
                    Coste Fijo por Hora:
                </p>
                <p className="text-xl font-bold text-gray-800">
                    {formatNumber(HOURLY_COST_RATE)} €
                </p>
            </MotionDiv>

            {/* Resultado 1: Produccion (Coste Variable Total) */}
            <MotionDiv
                className="p-4 bg-yellow-50 rounded-xl border border-yellow-400 shadow-md"
                variants={itemVariants}
                transition={{ delay: 0.4 }}
            >
                <p className="text-md font-bold text-yellow-800 mb-1">
                    Coste Laboral Diario (Variable):
                </p>
                {/* Usamos el valor calculado en tiempo real */}
                <p className="text-2xl font-extrabold text-yellow-900">
                    {formatNumber(productionCostVariable)} €
                </p>
            </MotionDiv>

            {/* Resultado 2: Coste de Producción por Kg */}
            <MotionDiv
                className="p-4 bg-green-50 rounded-xl border border-green-400 shadow-lg"
                variants={itemVariants}
                transition={{ delay: 0.5 }}
            >
                <p className="text-md font-bold text-green-800 mb-1">
                    Coste de Producción Final:
                </p>
                {/* Usamos el valor calculado en tiempo real */}
                <p className="text-4xl font-extrabold text-green-900">
                    {formatNumber(finalProductionCost, 4)} €/Kg
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Cálculo: (Coste Laboral / Producción Total)
                </p>
            </MotionDiv>

            {/* Botón de Guardar */}
            <MotionDiv
                className="pt-4 border-t border-teal-200"
                variants={itemVariants}
                transition={{ delay: 0.6 }}
            >
                <button
                    onClick={handleSaveLocal} // ⬅️ Llamamos al manejador local
                    disabled={isSaving}
                    className="w-full py-3 bg-teal-600 text-white font-bold rounded-lg shadow-xl hover:bg-teal-700 transition transform hover:scale-[1.01] disabled:bg-teal-400 flex items-center justify-center text-lg"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                            Guardar Costes
                        </>
                    )}
                </button>
            </MotionDiv>
        </MotionDiv>
    );
};


export default CostEditForm;
