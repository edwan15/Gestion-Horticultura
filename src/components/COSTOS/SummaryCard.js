// import React, { useMemo, useState } from 'react';
// import { 
//     FaUserFriends, FaSeedling, FaListAlt, FaTools, // Iconos FA5
//     FaClock, FaEuroSign 
// } from 'react-icons/fa'; 
// import {motion} from "framer-motion"

// // =======================================================================
// // === COMPONENTE SummaryCard (Profesional, Interactivo y Detallado)
// // =======================================================================

// const SummaryCard = ({ timesheets = [] }) => {
//     // Estado para la categoría activa, inicializado en 'Trabajadores'
//     const [activeCategory, setActiveCategory] = useState('Trabajadores');

//     const { 
//         totalHours, 
//         totalCost, 
//         workerDetails, // Ahora guardamos los nombres para mostrar
//         localDetails, 
//         operationDetails, 
//         machineryDetails 
//     } = useMemo(() => {
//         let totalHours = 0;
//         let totalCost = 0;
        
//         // Usamos Sets para obtener nombres únicos para los detalles
//         const uniqueWorkers = new Set();
//         const uniqueLocals = new Set();
//         const uniqueOperations = new Set();
//         const uniqueMachinery = new Set();

//         timesheets.forEach(record => {
//             if (!record) return;

//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             totalHours += hours;
//             totalCost += hours * rate;

//             if (record.workerName) uniqueWorkers.add(record.workerName);
//             if (record.localName) uniqueLocals.add(record.localName);
//             if (record.operationName) uniqueOperations.add(record.operationName);
//             // Solo contamos maquinaria si el ID existe y no es nulo/vacío
//             if (record.machineryId && record.machineryId.trim() !== '') uniqueMachinery.add(record.machineryId);
//         });

//         return {
//             totalHours: totalHours, 
//             totalCost: totalCost, 
//             workerDetails: Array.from(uniqueWorkers), // Convertir Set a Array
//             localDetails: Array.from(uniqueLocals),
//             operationDetails: Array.from(uniqueOperations),
//             machineryDetails: Array.from(uniqueMachinery),
//         };
//     }, [timesheets]); 

//     // Definición de las tarjetas de contador
//     const counters = [
//         { 
//             title: "Trabajadores", 
//             count: workerDetails.length, 
//             icon: FaUserFriends, 
//             color: "text-green-600",
//             details: workerDetails, // Asociar los detalles
//         },
//         { 
//             title: "Cultivos", 
//             count: localDetails.length, 
//             icon: FaSeedling, 
//             color: "text-amber-600",
//             details: localDetails,
//         },
//         { 
//             title: "Operación", 
//             count: operationDetails.length, 
//             icon: FaListAlt, 
//             color: "text-blue-600",
//             details: operationDetails,
//         },
//         { 
//             title: "Maquinaria", 
//             count: machineryDetails.length, 
//             icon: FaTools, 
//             color: "text-indigo-600",
//             details: machineryDetails,
//         },
//     ];

//     // Obtener los detalles de la categoría activa
//     const activeDetails = counters.find(c => c.title === activeCategory)?.details || [];

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
//             {/* 1. Encabezado */}
//             <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                     <FaClock className="text-green-500 mr-3 text-3xl"/> Horas de Trabajo
//                 </h2>
//                 <span className="text-sm text-gray-500 font-medium">Últimos Registros</span>
//             </div>

//             {/* 2. Grid de Contadores Interactivos */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                 {counters.map((item) => (
//                     <div 
//                         key={item.title} 
//                         // Estilos de la tarjeta interactiva
//                         className={`
//                             group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer 
//                             transition-all duration-300 ease-in-out transform hover:scale-105 
//                             ${activeCategory === item.title 
//                                 ? `bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-md`
//                                 : `bg-gray-50 border border-gray-200 hover:bg-gray-100`}
//                         `}
//                         onClick={() => setActiveCategory(item.title)}
//                     >
//                         <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 
//                                         ${activeCategory === item.title ? item.color : 'text-gray-600 group-hover:text-gray-800'}`}>
//                             {item.title}
//                         </h3>
//                         <div className="flex justify-center items-center">
//                             <item.icon className={`text-2xl mr-2 transition-colors duration-300 
//                                                    ${activeCategory === item.title ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} /> 
//                             <p className={`text-4xl font-extrabold transition-colors duration-300 
//                                            ${activeCategory === item.title ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
//                                 {item.count}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* 3. Área de Detalles y Mensaje (Inferior) */}
//             <div className="pt-6 border-t-2 border-gray-100">
//                 {timesheets.length > 0 ? (
//                     <>
//                         {/* Detalles de la Categoría Activa */}
//                         <motion.div 
//                             key={activeCategory} // Clave para la animación de cambio de contenido
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
//                         >
//                             <h4 className="text-lg font-bold text-blue-800 mb-3">
//                                 <span className="mr-2">✨</span> {activeCategory}:
//                             </h4>
//                             {activeDetails.length > 0 ? (
//                                 <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-700">
//                                     {activeDetails.map((detail, index) => (
//                                         <li key={index} className="flex items-center text-sm">
//                                             <span className="text-blue-500 mr-2">●</span> {detail}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-gray-600 italic">No hay {activeCategory.toLowerCase()} registrados aún.</p>
//                             )}
//                         </motion.div>

//                         {/* Totales Generales */}
//                         <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-inner">
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Horas Totales</span>
//                                 <span className="text-3xl font-extrabold text-green-700 mt-1">{totalHours.toFixed(2)}h</span>
//                             </div>
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Coste Total Estimado</span>
//                                 <span className="text-3xl font-extrabold text-red-700 mt-1 flex items-center">
//                                     <FaEuroSign className='text-2xl mr-1'/> {totalCost.toFixed(2)}
//                                 </span>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         {/* Mensaje cuando no hay registros */}
//                         <div className="mb-6 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
//                             <img src="https://via.placeholder.com/60/cccccc/ffffff?text=🧑‍🌾" alt="Hat icon" className="w-16 h-16 mb-4 opacity-70"/>
//                             <p className="text-xl text-green-700 font-bold mb-3">
//                                 Haga registros en Actividades de Campo &gt;
//                             </p>
//                             <p className="text-gray-600 text-sm">Aún no hay registros de trabajo para mostrar.</p>
//                         </div>

//                         {/* Totales por defecto si no hay registros */}
//                         <div className="flex justify-between items-end mt-4 text-xs">
//                             <span className="text-gray-500">Cultivos</span>
//                             <div>
//                                 <span className="text-gray-500 mr-2">Valor promedio</span>
//                                 <span className="text-xl font-bold text-gray-800">0h00</span>
//                             </div>
//                             <div className="flex items-center">
//                                 <span className="text-blue-500 mr-1">• Total</span>
//                                 <span className="text-xl font-bold text-gray-800">00h00</span>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SummaryCard;



// import React, { useMemo, useState } from 'react';
// import { 
//     FaUserFriends, FaSeedling, FaListAlt, FaTools, // Iconos FA5
//     FaClock, FaEuroSign, FaChevronRight // Nuevo Icono para anidación
// } from 'react-icons/fa'; 
// import {motion} from "framer-motion"

// // =======================================================================
// // === COMPONENTE SummaryCard (Profesional, Interactivo y Detallado)
// // =======================================================================

// const SummaryCard = ({ timesheets = [] }) => {
//     // Estado para la categoría activa, inicializado en 'Trabajadores'
//     const [activeCategory, setActiveCategory] = useState('Trabajadores');

//     const { 
//         totalHours, 
//         totalCost, 
//         // ¡La clave está en esta nueva estructura de datos!
//         summaryMap 
//     } = useMemo(() => {
//         let totalHours = 0;
//         let totalCost = 0;
        
//         // Objeto principal para almacenar la estructura relacional:
//         // { 
//         //   'Trabajadores': { 'Nombre Trabajador': { totalHours: X, locales: ['Local A', 'Local B'] } },
//         //   'Cultivos': { 'Local A': { totalHours: X, operaciones: ['Op 1', 'Op 2'], trabajadores: ['Trab A'] } }
//         //   ...
//         // }
//         const summaryMap = {
//             'Trabajadores': {},
//             'Cultivos': {},
//             'Operación': {},
//             'Maquinaria': {},
//         };

//         timesheets.forEach(record => {
//             if (!record) return;

//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             totalHours += hours;
//             totalCost += hours * rate;

//             const { workerName, localName, operationName, machineryId } = record;
            
//             // --- 1. Trabajadores: Mapear a Locales (Cultivos) ---
//             if (workerName) {
//                 if (!summaryMap['Trabajadores'][workerName]) {
//                     summaryMap['Trabajadores'][workerName] = { 
//                         totalHours: 0, 
//                         details: new Set(), // Usar Set para evitar duplicados de locales
//                         count: 0 // Contador de locales
//                     };
//                 }
//                 summaryMap['Trabajadores'][workerName].totalHours += hours;
//                 if (localName) {
//                     summaryMap['Trabajadores'][workerName].details.add(localName);
//                 }
//             }

//             // --- 2. Cultivos: Mapear a Operaciones ---
//             if (localName) {
//                 if (!summaryMap['Cultivos'][localName]) {
//                     summaryMap['Cultivos'][localName] = { 
//                         totalHours: 0, 
//                         details: new Set(), // Usar Set para operaciones
//                         count: 0 // Contador de operaciones
//                     };
//                 }
//                 summaryMap['Cultivos'][localName].totalHours += hours;
//                 if (operationName) {
//                     summaryMap['Cultivos'][localName].details.add(operationName);
//                 }
//             }

//             // --- 3. Operación: Mapear a Trabajadores/Maquinaria (o dejar plano) ---
//             // Por simplicidad, mantendremos las Operaciones y Maquinaria como una lista plana
//             // Si necesitaras la relación, aplicarías la misma lógica.
//             if (operationName && !summaryMap['Operación'][operationName]) {
//                 summaryMap['Operación'][operationName] = { totalHours: 0, details: new Set() };
//             }
//             if (operationName) summaryMap['Operación'][operationName].totalHours += hours;
            
//             if (machineryId && machineryId.trim() !== '' && !summaryMap['Maquinaria'][machineryId]) {
//                 summaryMap['Maquinaria'][machineryId] = { totalHours: 0, details: new Set() };
//             }
//             if (machineryId && machineryId.trim() !== '') summaryMap['Maquinaria'][machineryId].totalHours += hours;
//         });

//         // Convertir Sets a Arrays y calcular el 'count' final
//         Object.keys(summaryMap).forEach(category => {
//             Object.keys(summaryMap[category]).forEach(key => {
//                 const item = summaryMap[category][key];
//                 item.details = Array.from(item.details);
//                 item.count = item.details.length;
//             });
//         });


//         return {
//             totalHours: totalHours, 
//             totalCost: totalCost, 
//             summaryMap: summaryMap,
//         };
//     }, [timesheets]); 

//     // Extraer los detalles de la categoría activa para los contadores
//     const currentCategoryDetails = summaryMap[activeCategory] || {};
//     const detailKeys = Object.keys(currentCategoryDetails);

//     // Definición de las tarjetas de contador
//     const counters = [
//         { 
//             title: "Trabajadores", 
//             count: detailKeys.length, 
//             icon: FaUserFriends, 
//             color: "text-green-600",
//         },
//         { 
//             title: "Cultivos", 
//             count: detailKeys.length, 
//             icon: FaSeedling, 
//             color: "text-amber-600",
//         },
//         { 
//             title: "Operación", 
//             count: detailKeys.length, 
//             icon: FaListAlt, 
//             color: "text-blue-600",
//         },
//         { 
//             title: "Maquinaria", 
//             count: detailKeys.length, 
//             icon: FaTools, 
//             color: "text-indigo-600",
//         },
//     ].map(item => ({
//         ...item,
//         // Asignar el conteo correcto basado en el summaryMap
//         count: Object.keys(summaryMap[item.title] || {}).length
//     }));
    

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
//             {/* 1. Encabezado (Omitido por brevedad, no hay cambios) */}
//             <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                     <FaClock className="text-green-500 mr-3 text-3xl"/> Horas de Trabajo
//                 </h2>
//                 <span className="text-sm text-gray-500 font-medium">Últimos Registros</span>
//             </div>

//             {/* 2. Grid de Contadores Interactivos (Mismo código, usa el nuevo 'count') */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                 {counters.map((item) => (
//                     <div 
//                         key={item.title} 
//                         className={`
//                             group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer 
//                             transition-all duration-300 ease-in-out transform hover:scale-105 
//                             ${activeCategory === item.title 
//                                 ? `bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-md`
//                                 : `bg-gray-50 border border-gray-200 hover:bg-gray-100`}
//                         `}
//                         onClick={() => setActiveCategory(item.title)}
//                     >
//                         <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 
//                                      ${activeCategory === item.title ? item.color : 'text-gray-600 group-hover:text-gray-800'}`}>
//                             {item.title}
//                         </h3>
//                         <div className="flex justify-center items-center">
//                             <item.icon className={`text-2xl mr-2 transition-colors duration-300 
//                                                  ${activeCategory === item.title ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} /> 
//                             <p className={`text-4xl font-extrabold transition-colors duration-300 
//                                        ${activeCategory === item.title ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
//                                 {item.count}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* 3. Área de Detalles Relacionales (MODIFICADO) */}
//             <div className="pt-6 border-t-2 border-gray-100">
//                 {timesheets.length > 0 ? (
//                     <>
//                         {/* Detalles de la Categoría Activa */}
//                         <motion.div 
//                             key={activeCategory} // Clave para la animación de cambio de contenido
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
//                         >
//                             <h4 className="text-lg font-bold text-blue-800 mb-3">
//                                 <span className="mr-2">🔗</span> Detalles de {activeCategory}:
//                             </h4>
//                             {detailKeys.length > 0 ? (
//                                 <ul className="space-y-4 text-gray-700">
//                                     {detailKeys.map((key) => {
//                                         const item = currentCategoryDetails[key];
//                                         return (
//                                             <li key={key} className="p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:border-blue-300 transition duration-150">
//                                                 <div className="flex justify-between items-center mb-1">
//                                                     {/* Título Principal y Horas */}
//                                                     <span className="text-base font-semibold text-gray-800 flex items-center">
//                                                         <FaChevronRight className="text-blue-500 mr-2 text-sm"/> {key} 
//                                                     </span>
//                                                     <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
//                                                         {item.totalHours.toFixed(2)}h
//                                                     </span>
//                                                 </div>

//                                                 {/* Detalles Relacionados (Locales, Operaciones, etc.) */}
//                                                 {item.details.length > 0 && (
//                                                     <div className="ml-5 mt-1 text-sm text-gray-600">
//                                                         <span className="font-medium mr-2">
//                                                             {activeCategory === 'Trabajadores' ? 'Cultivos Trabajados:' : 'Operaciones Realizadas:'}
//                                                         </span>
//                                                         {item.details.join(' | ')}
//                                                     </div>
//                                                 )}
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             ) : (
//                                 <p className="text-gray-600 italic">No hay {activeCategory.toLowerCase()} registrados con detalles.</p>
//                             )}
//                         </motion.div>

//                         {/* Totales Generales (Omitido por brevedad, no hay cambios) */}
//                         <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-inner">
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Horas Totales</span>
//                                 <span className="text-3xl font-extrabold text-green-700 mt-1">{totalHours.toFixed(2)}h</span>
//                             </div>
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Coste Total Estimado</span>
//                                 <span className="text-3xl font-extrabold text-red-700 mt-1 flex items-center">
//                                     <FaEuroSign className='text-2xl mr-1'/> {totalCost.toFixed(2)}
//                                 </span>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     // Mensaje cuando no hay registros (Omitido por brevedad, no hay cambios)
//                     <>
//                          <div className="mb-6 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
//                             <img src="https://via.placeholder.com/60/cccccc/ffffff?text=🧑‍🌾" alt="Hat icon" className="w-16 h-16 mb-4 opacity-70"/>
//                             <p className="text-xl text-green-700 font-bold mb-3">
//                                 Haga registros en Actividades de Campo &gt;
//                             </p>
//                             <p className="text-gray-600 text-sm">Aún no hay registros de trabajo para mostrar.</p>
//                         </div>
//                         <div className="flex justify-between items-end mt-4 text-xs">
//                             <span className="text-gray-500">Cultivos</span>
//                             <div>
//                                 <span className="text-gray-500 mr-2">Valor promedio</span>
//                                 <span className="text-xl font-bold text-gray-800">0h00</span>
//                             </div>
//                             <div className="flex items-center">
//                                 <span className="text-blue-500 mr-1">• Total</span>
//                                 <span className="text-xl font-bold text-gray-800">00h00</span>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SummaryCard;



// import React, { useMemo, useState } from 'react';
// import { 
//     FaUserFriends, FaSeedling, FaListAlt, FaTools, 
//     FaClock, FaEuroSign, FaChevronRight, FaCalendarAlt // FaCalendarAlt para el filtro
// } from 'react-icons/fa'; 
// import {motion} from "framer-motion"

// // =======================================================================
// // === COMPONENTE SummaryCard CON FILTRO POR FECHAS
// // =======================================================================

// const SummaryCard = ({ timesheets = [] }) => {
//     // Estado para la categoría activa
//     const [activeCategory, setActiveCategory] = useState('Trabajadores');
    
//     // --- NUEVO ESTADO PARA EL FILTRO DE FECHAS ---
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });

//     // --- Lógica Principal del SummaryCard (Usa useMemo para filtrar) ---
//     const { 
//         totalHours, 
//         totalCost, 
//         summaryMap 
//     } = useMemo(() => {
        
//         // --- 1. FILTRADO DE TIMESHEETS ANTES DE AGREGAR ---
//         const filteredTimesheets = timesheets.filter(record => {
//             if (!record || !record.date) return false; 
            
//             // Asumo que tu objeto timesheet tiene un campo 'date' (YYYY-MM-DD)
//             const recordDate = record.date; 

//             // Filtro por fecha de inicio
//             const isAfterStart = !dateRange.start || recordDate >= dateRange.start;
            
//             // Filtro por fecha de fin
//             const isBeforeEnd = !dateRange.end || recordDate <= dateRange.end;

//             return isAfterStart && isBeforeEnd;
//         });

//         // --- 2. LÓGICA DE AGREGACIÓN SOBRE LOS REGISTROS FILTRADOS ---
//         let totalHours = 0;
//         let totalCost = 0;
        
//         const summaryMap = {
//             'Trabajadores': {},
//             'Cultivos': {},
//             'Operación': {},
//             'Maquinaria': {},
//         };

//         filteredTimesheets.forEach(record => { // Usamos los filtrados
//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             totalHours += hours;
//             totalCost += hours * rate;

//             const { workerName, localName, operationName, machineryId } = record;
            
//             // Trabajadores: Mapear a Locales (Cultivos)
//             if (workerName) {
//                 if (!summaryMap['Trabajadores'][workerName]) {
//                     summaryMap['Trabajadores'][workerName] = { totalHours: 0, details: new Set() };
//                 }
//                 summaryMap['Trabajadores'][workerName].totalHours += hours;
//                 if (localName) summaryMap['Trabajadores'][workerName].details.add(localName);
//             }

//             // Cultivos: Mapear a Operaciones
//             if (localName) {
//                 if (!summaryMap['Cultivos'][localName]) {
//                     summaryMap['Cultivos'][localName] = { totalHours: 0, details: new Set() };
//                 }
//                 summaryMap['Cultivos'][localName].totalHours += hours;
//                 if (operationName) summaryMap['Cultivos'][localName].details.add(operationName);
//             }

//             // Operación y Maquinaria (Plano)
//             if (operationName) {
//                 if (!summaryMap['Operación'][operationName]) summaryMap['Operación'][operationName] = { totalHours: 0, details: new Set() };
//                 summaryMap['Operación'][operationName].totalHours += hours;
//             }
            
//             if (machineryId && machineryId.trim() !== '') {
//                 if (!summaryMap['Maquinaria'][machineryId]) summaryMap['Maquinaria'][machineryId] = { totalHours: 0, details: new Set() };
//                 summaryMap['Maquinaria'][machineryId].totalHours += hours;
//             }
//         });

//         // Finalizar: Convertir Sets a Arrays y contar
//         Object.keys(summaryMap).forEach(category => {
//             Object.keys(summaryMap[category]).forEach(key => {
//                 const item = summaryMap[category][key];
//                 item.details = Array.from(item.details);
//                 // Aseguramos que count sea el número de elementos principales
//                 if (category === 'Trabajadores' || category === 'Cultivos') {
//                      item.count = item.details.length;
//                 }
//             });
//         });


//         return {
//             totalHours: totalHours, 
//             totalCost: totalCost, 
//             summaryMap: summaryMap,
//         };
//     }, [timesheets, dateRange]); // ¡IMPORTANTE! Agregar dateRange como dependencia

//     // Extraer los detalles de la categoría activa para los contadores
//     const currentCategoryDetails = summaryMap[activeCategory] || {};

//     // Definición de contadores usando el nuevo mapa (mismo que antes)
//     const counters = [
//         { title: "Trabajadores", icon: FaUserFriends, color: "text-green-600" },
//         { title: "Cultivos", icon: FaSeedling, color: "text-amber-600" },
//         { title: "Operación", icon: FaListAlt, color: "text-blue-600" },
//         { title: "Maquinaria", icon: FaTools, color: "text-indigo-600" },
//     ].map(item => ({
//         ...item,
//         // Calcular el conteo usando el summaryMap filtrado
//         count: Object.keys(summaryMap[item.title] || {}).length
//     }));
    
//     const detailKeys = Object.keys(currentCategoryDetails);

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
            
//             {/* 1. Encabezado y Filtro de Fechas */}
//             <div className="mb-6 border-b-2 border-gray-100 pb-4">
//                 <div className="flex justify-between items-center mb-4">
//                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <FaClock className="text-green-500 mr-3 text-3xl"/> Resumen de Actividades
//                     </h2>
//                      <span className="text-sm text-gray-500 font-medium">Datos filtrados</span>
//                 </div>

//                 {/* --- Interfaz de Filtro por Rango de Fechas --- */}
//                 <div className="flex flex-col sm:flex-row gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                     <div className="flex items-center">
//                         <FaCalendarAlt className='text-blue-600 mr-3 text-xl'/>
//                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filtrar por Fecha:</span>
//                     </div>

//                     <div className="flex flex-1 gap-2">
//                          {/* Fecha Inicio */}
//                         <input
//                             type="date"
//                             value={dateRange.start}
//                             onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//                             className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
//                             placeholder="Desde"
//                         />
//                          {/* Fecha Fin */}
//                         <input
//                             type="date"
//                             value={dateRange.end}
//                             onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//                             className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
//                             placeholder="Hasta"
//                         />
//                     </div>
//                      {/* Botón de reset (opcional, pero útil) */}
//                      <button
//                         onClick={() => setDateRange({ start: '', end: '' })}
//                         className="p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150 sm:w-auto"
//                     >
//                         Reset
//                     </button>
//                 </div>
//             </div>

//             {/* 2. Grid de Contadores Interactivos (Mismo código, usa el nuevo 'count' filtrado) */}
//              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                 {counters.map((item) => (
//                     <div 
//                         key={item.title} 
//                         className={`
//                             group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer 
//                             transition-all duration-300 ease-in-out transform hover:scale-105 
//                             ${activeCategory === item.title 
//                                 ? `bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-md`
//                                 : `bg-gray-50 border border-gray-200 hover:bg-gray-100`}
//                         `}
//                         onClick={() => setActiveCategory(item.title)}
//                     >
//                         <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 
//                                      ${activeCategory === item.title ? item.color : 'text-gray-600 group-hover:text-gray-800'}`}>
//                             {item.title}
//                         </h3>
//                         <div className="flex justify-center items-center">
//                             <item.icon className={`text-2xl mr-2 transition-colors duration-300 
//                                                  ${activeCategory === item.title ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} /> 
//                             <p className={`text-4xl font-extrabold transition-colors duration-300 
//                                        ${activeCategory === item.title ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
//                                 {item.count}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* 3. Área de Detalles Relacionales (Usa datos filtrados) */}
//             <div className="pt-6 border-t-2 border-gray-100">
//                 {detailKeys.length > 0 ? (
//                     <>
//                         {/* Detalles de la Categoría Activa */}
//                         <motion.div 
//                             key={activeCategory + dateRange.start + dateRange.end} // Clave para animar cuando cambian las fechas/categoría
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
//                         >
//                             <h4 className="text-lg font-bold text-blue-800 mb-3">
//                                 <span className="mr-2">🔗</span> Detalles de {activeCategory}:
//                             </h4>
                            
//                             <ul className="space-y-4 text-gray-700">
//                                 {detailKeys.map((key) => {
//                                     const item = currentCategoryDetails[key];
//                                     return (
//                                         <li key={key} className="p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:border-blue-300 transition duration-150">
//                                             <div className="flex justify-between items-center mb-1">
//                                                 {/* Título Principal y Horas */}
//                                                 <span className="text-base font-semibold text-gray-800 flex items-center">
//                                                     <FaChevronRight className="text-blue-500 mr-2 text-sm"/> {key} 
//                                                 </span>
//                                                 <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
//                                                     {item.totalHours.toFixed(2)}h
//                                                 </span>
//                                             </div>

//                                             {/* Detalles Relacionados (Locales, Operaciones, etc.) */}
//                                             {item.details.length > 0 && (
//                                                 <div className="ml-5 mt-1 text-sm text-gray-600">
//                                                     <span className="font-medium mr-2">
//                                                         {activeCategory === 'Trabajadores' ? 'Cultivos Trabajados:' : 'Operaciones Realizadas:'}
//                                                     </span>
//                                                     {item.details.join(' | ')}
//                                                 </div>
//                                             )}
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
                            
//                         </motion.div>

//                         {/* Totales Generales (Filtrados) */}
//                         <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-inner">
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Horas Totales (Filtradas)</span>
//                                 <span className="text-3xl font-extrabold text-green-700 mt-1">{totalHours.toFixed(2)}h</span>
//                             </div>
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-600 font-medium">Coste Total Estimado (Filtrado)</span>
//                                 <span className="text-3xl font-extrabold text-red-700 mt-1 flex items-center">
//                                     <FaEuroSign className='text-2xl mr-1'/> {totalCost.toFixed(2)}
//                                 </span>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     // Mensaje cuando no hay registros para los filtros seleccionados
//                     <div className="mb-6 flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg border border-yellow-200 shadow-inner">
//                         <p className="text-xl text-yellow-700 font-bold mb-3">
//                             ⚠️ No hay registros de trabajo para el rango de fechas seleccionado.
//                         </p>
//                         <p className="text-gray-600 text-sm">Pruebe a cambiar el rango de fechas para ver el resumen.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SummaryCard;



// import React, { useMemo, useState } from 'react';
// import { 
//     FaUserFriends, FaSeedling, FaListAlt, FaTools, FaEuroSign, 
//     FaChevronRight, FaCalendarAlt, FaClock, // Iconos originales
//     FaChartLine, FaChevronDown // Iconos modernos adicionales
// } from 'react-icons/fa'; 
// import { motion } from "framer-motion";

// // =======================================================================
// // === COMPONENTE SummaryCard CON DISEÑO MODERNIZADO
// // =======================================================================

// const SummaryCard = ({ timesheets = [] }) => {
//     // Estado para la categoría activa
//     const [activeCategory, setActiveCategory] = useState('Trabajadores');
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });
//     const [showDetails, setShowDetails] = useState(false); // Nuevo estado para alternar la visibilidad de detalles
    
//     // --- Lógica Principal (SIN CAMBIOS, es la base de los datos) ---
//     const { 
//         totalHours, totalCost, summaryMap 
//     } = useMemo(() => {
//         // [TU LÓGICA DE FILTRADO Y AGREGACIÓN VA AQUÍ]
//         // ... (Tu código useMemo completo con filtrado de fechas) ...
        
//         // --- 1. FILTRADO DE TIMESHEETS ANTES DE AGREGAR ---
//         const filteredTimesheets = timesheets.filter(record => {
//             if (!record || !record.date) return false; 
//             const recordDate = record.date; 
//             const isAfterStart = !dateRange.start || recordDate >= dateRange.start;
//             const isBeforeEnd = !dateRange.end || recordDate <= dateRange.end;
//             return isAfterStart && isBeforeEnd;
//         });

//         // --- 2. LÓGICA DE AGREGACIÓN SOBRE LOS REGISTROS FILTRADOS ---
//         let totalHours = 0;
//         let totalCost = 0;
        
//         const summaryMap = {
//             'Trabajadores': {}, 'Cultivos': {}, 'Operación': {}, 'Maquinaria': {},
//         };

//         filteredTimesheets.forEach(record => {
//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             totalHours += hours;
//             totalCost += hours * rate;

//             const { workerName, localName, operationName, machineryId } = record;
            
//             // Trabajadores: Mapear a Locales (Cultivos)
//             if (workerName) {
//                 if (!summaryMap['Trabajadores'][workerName]) {
//                     summaryMap['Trabajadores'][workerName] = { totalHours: 0, details: new Set() };
//                 }
//                 summaryMap['Trabajadores'][workerName].totalHours += hours;
//                 if (localName) summaryMap['Trabajadores'][workerName].details.add(localName);
//             }

//             // Cultivos: Mapear a Operaciones
//             if (localName) {
//                 if (!summaryMap['Cultivos'][localName]) {
//                     summaryMap['Cultivos'][localName] = { totalHours: 0, details: new Set() };
//                 }
//                 summaryMap['Cultivos'][localName].totalHours += hours;
//                 if (operationName) summaryMap['Cultivos'][localName].details.add(operationName);
//             }

//             // Operación y Maquinaria (Plano)
//             if (operationName) {
//                 if (!summaryMap['Operación'][operationName]) summaryMap['Operación'][operationName] = { totalHours: 0, details: new Set() };
//                 summaryMap['Operación'][operationName].totalHours += hours;
//             }
            
//             if (machineryId && machineryId.trim() !== '') {
//                 if (!summaryMap['Maquinaria'][machineryId]) summaryMap['Maquinaria'][machineryId] = { totalHours: 0, details: new Set() };
//                 summaryMap['Maquinaria'][machineryId].totalHours += hours;
//             }
//         });

//         // Finalizar: Convertir Sets a Arrays y contar
//         Object.keys(summaryMap).forEach(category => {
//             Object.keys(summaryMap[category]).forEach(key => {
//                 const item = summaryMap[category][key];
//                 item.details = Array.from(item.details);
//                 if (category === 'Trabajadores' || category === 'Cultivos') {
//                     item.count = item.details.length;
//                 }
//             });
//         });


//         return { totalHours, totalCost, summaryMap };
//     }, [timesheets, dateRange]); 


//     // Extraer los detalles y definir contadores
//     const currentCategoryDetails = summaryMap[activeCategory] || {};
//     const detailKeys = Object.keys(currentCategoryDetails);

//     const counters = [
//         { title: "Trabajadores", icon: FaUserFriends, color: "text-green-600", bg: "bg-green-50" },
//         { title: "Cultivos", icon: FaSeedling, color: "text-amber-600", bg: "bg-amber-50" },
//         { title: "Operación", icon: FaListAlt, color: "text-blue-600", bg: "bg-blue-50" },
//         { title: "Maquinaria", icon: FaTools, color: "text-indigo-600", bg: "bg-indigo-50" },
//     ].map(item => ({
//         ...item,
//         count: Object.keys(summaryMap[item.title] || {}).length
//     }));
    
//     // --- Variantes de animación para framer-motion ---
//     const containerVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { 
//             opacity: 1, 
//             y: 0, 
//             transition: { 
//                 staggerChildren: 0.1,
//                 duration: 0.4
//             } 
//         },
//     };

//     const itemVariants = {
//         hidden: { opacity: 0, scale: 0.9 },
//         visible: { opacity: 1, scale: 1 },
//     };

//     return (
//         <motion.div 
//             className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-100"
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//         >
            
//             {/* 1. Encabezado y Totales principales (compacto) */}
//             <div className="mb-6 pb-4 border-b border-gray-100">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//                     <h2 className="text-2xl font-extrabold text-gray-900 flex items-center mb-2 sm:mb-0">
//                         <FaChartLine className="text-indigo-600 mr-3 text-3xl"/> Dashboard Operacional
//                     </h2>
                    
//                     {/* Totales rápidos */}
//                     <motion.div 
//                         className="flex space-x-4 text-sm font-semibold"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2, duration: 0.5 }}
//                     >
//                         <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full">
//                             {totalHours.toFixed(1)}h
//                         </span>
//                         <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full flex items-center">
//                             <FaEuroSign className='text-xs mr-1'/> {totalCost.toFixed(0)}
//                         </span>
//                     </motion.div>
//                 </div>
                
//                 {/* --- Interfaz de Filtro por Rango de Fechas (Mejorado) --- */}
//                 <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
//                     <span className="text-sm font-semibold text-blue-700 flex items-center"><FaCalendarAlt className='mr-2'/> Rango:</span>
                    
//                     <input
//                         type="date"
//                         value={dateRange.start}
//                         onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//                         className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
//                     />
//                     <input
//                         type="date"
//                         value={dateRange.end}
//                         onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//                         className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
//                     />
                    
//                     <button
//                         onClick={() => setDateRange({ start: '', end: '' })}
//                         className="p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150 shrink-0"
//                     >
//                         Reset
//                     </button>
//                 </div>
//             </div>

//             {/* 2. Grid de Contadores Interactivos (Estilo de tarjeta más moderna) */}
//             <motion.div 
//                 className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
//                 variants={containerVariants} // Usamos las variantes del contenedor
//             >
//                 {counters.map((item) => (
//                     <motion.div 
//                         key={item.title} 
//                         variants={itemVariants} // Usamos las variantes de item
//                         className={`
//                             group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer 
//                             transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
//                             ${activeCategory === item.title 
//                                 ? `bg-white border-2 border-indigo-500 shadow-indigo-200 shadow-md` // Activo
//                                 : `${item.bg} border border-gray-200 hover:bg-white` // Inactivo
//                             }
//                         `}
//                         onClick={() => setActiveCategory(item.title)}
//                     >
//                         <item.icon className={`text-3xl mb-1 transition-colors duration-300 ${item.color}`} /> 
//                         <h3 className={`text-xs font-medium uppercase transition-colors duration-300 text-gray-500`}>
//                             {item.title}
//                         </h3>
//                         <p className={`text-4xl font-extrabold transition-colors duration-300 ${activeCategory === item.title ? 'text-indigo-600' : 'text-gray-800'}`}>
//                             {item.count}
//                         </p>
//                     </motion.div>
//                 ))}
//             </motion.div>

//             {/* 3. Área de Detalles Relacionales (Acordeón moderno) */}
//             <div className="pt-4 border-t border-gray-100">
//                 <button 
//                     onClick={() => setShowDetails(!showDetails)}
//                     className="w-full flex justify-between items-center py-3 px-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200 border border-gray-200"
//                 >
//                     <h4 className="text-lg font-bold text-gray-800 flex items-center">
//                         <FaChevronRight className="text-indigo-500 mr-2 text-sm"/> 
//                         Detalles y Desglose por <span className='text-indigo-600 ml-1'>{activeCategory}</span>
//                     </h4>
//                     <FaChevronDown 
//                         className={`text-gray-500 transition-transform duration-300 ${showDetails ? 'rotate-180' : 'rotate-0'}`}
//                     />
//                 </button>

//                 <motion.div 
//                     initial={false}
//                     animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
//                     transition={{ duration: 0.4, ease: "easeInOut" }}
//                     style={{ overflow: 'hidden' }}
//                     className="mt-4"
//                 >
//                     {detailKeys.length > 0 ? (
//                         <motion.ul 
//                             className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg shadow-inner"
//                             variants={containerVariants}
//                             initial="hidden"
//                             animate="visible"
//                         >
//                             {detailKeys.slice(0, 5).map((key) => { // Muestra solo los primeros 5 para mantener la compacidad
//                                 const item = currentCategoryDetails[key];
//                                 return (
//                                     <motion.li 
//                                         key={key} 
//                                         variants={itemVariants}
//                                         className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-green-300 transition duration-150 flex justify-between items-center"
//                                     >
//                                         <div className='flex flex-col'>
//                                             <span className="text-base font-semibold text-gray-800 flex items-center">
//                                                 <FaChevronRight className="text-green-500 mr-2 text-xs"/> {key} 
//                                             </span>
//                                             {/* Detalles Relacionados (Locales, Operaciones, etc.) */}
//                                             {item.details.length > 0 && (
//                                                 <span className="ml-5 mt-1 text-xs text-gray-500 italic">
//                                                     {item.details.join(' | ')}
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full shrink-0">
//                                             {item.totalHours.toFixed(1)}h
//                                         </span>
//                                     </motion.li>
//                                 );
//                             })}
//                              {detailKeys.length > 5 && (
//                                 <li className="text-center text-sm text-gray-500 italic pt-2">
//                                     y {detailKeys.length - 5} más...
//                                 </li>
//                             )}
//                         </motion.ul>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
//                             <p className="text-base text-yellow-700 font-bold">⚠️ Sin datos.</p>
//                             <p className="text-sm text-gray-600">No hay registros para la categoría/rango seleccionado.</p>
//                         </div>
//                     )}
//                 </motion.div>
//             </div>
//         </motion.div>
//     );
// };

// export default SummaryCard;


import React, { useMemo, useState, useCallback } from 'react';
import { 
    FaUserFriends, FaSeedling, FaListAlt, FaTools, 
    FaClock, FaEuroSign, FaChevronRight, FaCalendarAlt, FaTimes // FaTimes para cerrar el modal
} from 'react-icons/fa'; 
import { motion } from "framer-motion";

// =======================================================================
// === 1. COMPONENTE MODAL DE DETALLES
// =======================================================================

const DetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    // Agregación de datos de los trabajadores para el modal
    const workersSummary = data.records.reduce((acc, record) => {
        const name = record.workerName || 'Desconocido';
        const hours = record.totalHours || 0;
        
        if (!acc[name]) {
            acc[name] = { totalHours: 0, operations: new Set() };
        }
        acc[name].totalHours += hours;
        acc[name].operations.add(record.operationName);
        return acc;
    }, {});
    
    const totalModalHours = Object.values(workersSummary).reduce((sum, item) => sum + item.totalHours, 0);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-indigo-700">{data.title} ({data.type})</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <FaTimes className="text-xl"/>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700 font-semibold mb-2">Resumen de Horas Total: <span className="text-green-600">{totalModalHours.toFixed(2)}h</span></p>
                    <p className="text-sm text-gray-500">Personas que trabajaron en esta actividad/cultivo:</p>
                </div>

                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(workersSummary).map(([worker, summary]) => (
                        <li key={worker} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{worker}</p>
                                <p className="text-xs text-gray-500 italic mt-1">
                                    Tareas: {Array.from(summary.operations).join(' | ')}
                                </p>
                            </div>
                            <span className="font-bold text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                {summary.totalHours.toFixed(2)}h
                            </span>
                        </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onClose} 
                    className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Cerrar
                </button>
            </motion.div>
        </div>
    );
};


// =======================================================================
// === 2. COMPONENTE SUMMARY CARD PRINCIPAL
// =======================================================================

const SummaryCard = ({ timesheets = [] }) => {
    const [activeCategory, setActiveCategory] = useState('Trabajadores');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    
    // --- NUEVOS ESTADOS PARA EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Función para abrir el modal al hacer clic en un detalle
    const openModal = useCallback((title, type, records) => {
        setModalData({ title, type, records });
        setIsModalOpen(true);
    }, []);

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    // --- Lógica Principal del SummaryCard (MODIFICADA) ---
    const { 
        totalHours, totalCost, summaryMap, filteredTimesheets 
    } = useMemo(() => {
        
        // 1. FILTRADO DE TIMESHEETS
        const filtered = timesheets.filter(record => {
            if (!record || !record.date) return false; 
            const recordDate = record.date; 
            const isAfterStart = !dateRange.start || recordDate >= dateRange.start;
            const isBeforeEnd = !dateRange.end || recordDate <= dateRange.end;
            return isAfterStart && isBeforeEnd;
        });

        // 2. LÓGICA DE AGREGACIÓN
        let totalHours = 0;
        let totalCost = 0;
        
        const summaryMap = {
            'Trabajadores': {},
            'Cultivos': {},
            'Operación': {},
            'Maquinaria': {},
        };

        filtered.forEach(record => {
            const hours = record.totalHours || 0;
            const rate = record.ratePerHour || 0;
            totalHours += hours;
            totalCost += hours * rate;

            const { workerName, localName, operationName, machineryId } = record;
            
            // Trabajadores (Detalles: Cultivos)
            if (workerName) {
                if (!summaryMap['Trabajadores'][workerName]) {
                    summaryMap['Trabajadores'][workerName] = { totalHours: 0, details: new Set(), records: [] };
                }
                summaryMap['Trabajadores'][workerName].totalHours += hours;
                if (localName) summaryMap['Trabajadores'][workerName].details.add(localName);
            }

            // Cultivos (Detalles: Operaciones y Registros para el Modal)
            if (localName) {
                if (!summaryMap['Cultivos'][localName]) {
                    summaryMap['Cultivos'][localName] = { totalHours: 0, details: new Set(), records: [] }; // records para modal
                }
                summaryMap['Cultivos'][localName].totalHours += hours;
                if (operationName) summaryMap['Cultivos'][localName].details.add(operationName);
                summaryMap['Cultivos'][localName].records.push(record); // Almacenar registro completo
            }

            // Operación (Detalles: Cultivos y Registros para el Modal)
            if (operationName) {
                if (!summaryMap['Operación'][operationName]) {
                    summaryMap['Operación'][operationName] = { totalHours: 0, details: new Set(), records: [] }; // records para modal
                }
                summaryMap['Operación'][operationName].totalHours += hours;
                if (localName) summaryMap['Operación'][operationName].details.add(localName); // Podríamos añadir el worker aquí si es plano
                summaryMap['Operación'][operationName].records.push(record); // Almacenar registro completo
            }
            
            // Maquinaria (Detalles: Operaciones/Cultivos)
            if (machineryId && machineryId.trim() !== '') {
                if (!summaryMap['Maquinaria'][machineryId]) {
                    summaryMap['Maquinaria'][machineryId] = { totalHours: 0, details: new Set(), records: [] };
                }
                summaryMap['Maquinaria'][machineryId].totalHours += hours;
                if (operationName) summaryMap['Maquinaria'][machineryId].details.add(operationName);
            }
        });

        // 3. FINALIZAR: Convertir Sets a Arrays
        Object.keys(summaryMap).forEach(category => {
            Object.keys(summaryMap[category]).forEach(key => {
                const item = summaryMap[category][key];
                item.details = Array.from(item.details);
            });
        });

        return {
            totalHours, 
            totalCost, 
            summaryMap,
            filteredTimesheets: filtered, // Exportar los filtrados para el modal
        };
    }, [timesheets, dateRange]);


    // Extracción de datos para el renderizado
    const currentCategoryDetails = summaryMap[activeCategory] || {};
    const detailKeys = Object.keys(currentCategoryDetails);

    // Definición de contadores usando el conteo real
    const counters = [
        { title: "Trabajadores", icon: FaUserFriends, color: "text-green-600", bg: "bg-green-50" },
        { title: "Cultivos", icon: FaSeedling, color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Operación", icon: FaListAlt, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Maquinaria", icon: FaTools, color: "text-indigo-600", bg: "bg-indigo-50" },
    ].map(item => ({
        ...item,
        count: Object.keys(summaryMap[item.title] || {}).length
    }));

    // Determina si el elemento de la lista debe ser clickeable para abrir el modal
    const isClickable = activeCategory === 'Cultivos' || activeCategory === 'Operación';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            
            {/* ... [Resto del Encabezado y Filtro de Fechas, SIN CAMBIOS] ... */}
            <div className="mb-6 border-b-2 border-gray-100 pb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaClock className="text-green-500 mr-3 text-3xl"/> Resumen de Actividades
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">Datos filtrados</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <FaCalendarAlt className='text-blue-600 mr-3 text-xl'/>
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filtrar por Fecha:</span>
                    </div>

                    <div className="flex flex-1 gap-2">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Desde"
                        />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Hasta"
                        />
                    </div>
                    <button
                        onClick={() => setDateRange({ start: '', end: '' })}
                        className="p-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150 sm:w-auto"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* 2. Grid de Contadores Interactivos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {counters.map((item) => (
                    <div 
                        key={item.title} 
                        className={`
                            group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer 
                            transition-all duration-300 ease-in-out transform hover:scale-105 
                            ${activeCategory === item.title 
                                ? `bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-md`
                                : `bg-gray-50 border border-gray-200 hover:bg-gray-100`}
                        `}
                        onClick={() => setActiveCategory(item.title)}
                    >
                        <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 
                                    ${activeCategory === item.title ? item.color : 'text-gray-600 group-hover:text-gray-800'}`}>
                            {item.title}
                        </h3>
                        <div className="flex justify-center items-center">
                            <item.icon className={`text-2xl mr-2 transition-colors duration-300 
                                                ${activeCategory === item.title ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} /> 
                            <p className={`text-4xl font-extrabold transition-colors duration-300 
                                        ${activeCategory === item.title ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                {item.count}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Área de Detalles Relacionales (Ahora con lógica de clic para modal) */}
            <div className="pt-6 border-t-2 border-gray-100">
                {detailKeys.length > 0 ? (
                    <>
                        <motion.div 
                            key={activeCategory + dateRange.start + dateRange.end}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
                        >
                            <h4 className="text-lg font-bold text-blue-800 mb-3">
                                <span className="mr-2">🔗</span> Detalles de {activeCategory}:
                            </h4>
                            
                            <ul className="space-y-4 text-gray-700">
                                {detailKeys.map((key) => {
                                    const item = currentCategoryDetails[key];
                                    const itemClass = isClickable 
                                        ? "p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition duration-150 cursor-pointer"
                                        : "p-3 bg-white rounded-md shadow-sm border border-gray-100 transition duration-150";

                                    return (
                                        <li 
                                            key={key} 
                                            className={itemClass}
                                            onClick={isClickable ? () => openModal(key, activeCategory, item.records) : undefined}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-base font-semibold text-gray-800 flex items-center">
                                                    <FaChevronRight className="text-blue-500 mr-2 text-sm"/> {key} 
                                                </span>
                                                <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                                    {item.totalHours.toFixed(2)}h
                                                </span>
                                            </div>

                                            {/* Detalles Relacionados (Pista de lo que contiene) */}
                                            {item.details.length > 0 && (
                                                <div className="ml-5 mt-1 text-sm text-gray-600">
                                                    <span className="font-medium mr-2">
                                                        {activeCategory === 'Trabajadores' ? 'Cultivos Trabajados:' : 'Relacionado con:'}
                                                    </span>
                                                    {item.details.slice(0, 3).join(' | ')}
                                                    {item.details.length > 3 && ` | y ${item.details.length - 3} más...`}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                            
                        </motion.div>

                        {/* Totales Generales (Filtrados) */}
                        <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-inner">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600 font-medium">Horas Totales (Filtradas)</span>
                                <span className="text-3xl font-extrabold text-green-700 mt-1">{totalHours.toFixed(2)}h</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600 font-medium">Coste Total Estimado (Filtrado)</span>
                                <span className="text-3xl font-extrabold text-red-700 mt-1 flex items-center">
                                    <FaEuroSign className='text-2xl mr-1'/> {totalCost.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mb-6 flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg border border-yellow-200 shadow-inner">
                        <p className="text-xl text-yellow-700 font-bold mb-3">
                            ⚠️ No hay registros de trabajo para el rango de fechas seleccionado.
                        </p>
                        <p className="text-gray-600 text-sm">Pruebe a cambiar el rango de fechas para ver el resumen.</p>
                    </div>
                )}
            </div>

            {/* 4. Implementación del Modal */}
            <DetailModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                data={modalData}
            />
        </div>
    );
};

export default SummaryCard;