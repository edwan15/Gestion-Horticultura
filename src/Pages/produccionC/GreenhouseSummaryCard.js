// import React from 'react';
// import { FaSeedling, FaCalendarAlt, FaSquare, FaTag } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // --- Función de utilidad para formatear la fecha (si viene como timestamp) ---
// const formatDate = (dateValue) => {
//     if (!dateValue) return 'No definida';
    
//     // Si es un objeto de Firebase Timestamp, usa toDate()
//     if (dateValue.toDate) {
//         return dateValue.toDate().toLocaleDateString('es-ES');
//     }
//     // Si es una cadena o número, intenta crear una fecha
//     try {
//         const date = new Date(dateValue);
//         return date.toLocaleDateString('es-ES');
//     } catch (e) {
//         return dateValue;
//     }
// };

// const GreenhouseSummaryCard = ({ 
//     config = {}, // Usamos un objeto vacío como fallback
//     dailyData = {}, // Para posibles usos futuros (como área total)
//     // 🚨 Ya no necesitamos onSaveConfig ni formatNumber aquí
// }) => {

//     const {
//         cropName,           // Nombre o tipo del cultivo (ej: Tomate, Calabacín)
//         plantVariety,       // Variedad de la planta (ej: Cherry, Larga)
//         plantationDate,     // Fecha de siembra/trasplante (Timestamp o string)
//         area,               // Área del invernadero (ej: 0.5 ha)
//         productionMode,     // Modo de producción (ej: Ecológico, Convencional)
//     } = config;

//     const formattedArea = area ? `${area} ha` : 'N/A';
//     const formattedDate = formatDate(plantationDate);

//     // --- Componente de Fila de Detalle ---
//     const DetailItem = ({ Icon, label, value, color = 'text-indigo-500' }) => (
//         <div className="flex items-start text-sm md:text-base text-gray-700 p-2 border-b last:border-b-0">
//             <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${color}`} />
//             <div className="flex flex-col flex-grow truncate">
//                 <span className="font-medium text-gray-500 text-xs uppercase">{label}</span>
//                 <span className="font-bold text-gray-800 truncate">{value || "Sin especificar"}</span>
//             </div>
//         </div>
//     );

//     return (
//         <motion.div
//             className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-teal-500"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="flex items-center justify-between border-b pb-3 mb-4">
//                 <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                     <FaSquare className="w-5 h-5 mr-2" />
//                     Resumen del Cultivo
//                 </h3>
//                 <span className="text-xs font-semibold text-gray-500">{productionMode}</span>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Columna 1: Información Principal del Cultivo */}
//                 <div className="space-y-2 border-r sm:pr-4">
//                     <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                         <FaSeedling className="w-4 h-4 mr-2" />
//                         Cultivo Actual
//                     </h4>
                    
//                     <DetailItem
//                         Icon={FaTag}
//                         label="Tipo de Cultivo"
//                         value={cropName}
//                         color="text-teal-600"
//                     />
//                     <DetailItem
//                         Icon={MdLocalFlorist}
//                         label="Variedad"
//                         value={plantVariety}
//                         color="text-teal-500"
//                     />
//                 </div>

//                 {/* Columna 2: Logística y Tiempos */}
//                 <div className="space-y-2 sm:pl-4">
//                     <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                         <FaCalendarAlt className="w-4 h-4 mr-2" />
//                         Logística y Tiempos
//                     </h4>

//                     <DetailItem
//                         Icon={FaSquare}
//                         label="Área Total"
//                         value={formattedArea}
//                         color="text-green-500"
//                     />
//                     <DetailItem
//                         Icon={FaCalendarAlt}
//                         label="Fecha de Plantación"
//                         value={formattedDate}
//                         color="text-indigo-500"
//                     />
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default GreenhouseSummaryCard;



// import React from 'react';
// import { FaSeedling, FaCalendarAlt, FaSquare, FaTag, FaFlask } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // Función de utilidad para formatear la fecha (si viene como timestamp de Firebase o string)
// const formatDate = (dateValue) => {
//     if (!dateValue) return 'No definida';
    
//     // Si es un objeto de Firebase Timestamp
//     if (dateValue.toDate) {
//         return dateValue.toDate().toLocaleDateString('es-ES');
//     }
//     // Si es una cadena o número, intenta crear una fecha
//     try {
//         const date = new Date(dateValue);
//         // Validar si la fecha es válida
//         if (isNaN(date)) return dateValue;
//         return date.toLocaleDateString('es-ES');
//     } catch (e) {
//         return dateValue;
//     }
// };

// const GreenhouseSummaryCard = ({ 
//     config = {}, // Espera el objeto de configuración ya cargado del invernadero
// }) => {

//     // Desestructurar las propiedades del objeto de configuración. 
//     // Asegúrate de que tu lógica de Firebase en el componente padre use estos nombres.
//     const {
//         cropName,           // Tipo de Cultivo (ej: Solanácea)
//         plantVariety,       // Nombre de la Planta (ej: Tomate Cherry)
//         plantationDate,     // Fecha de Plantación
//         area,               // Área (ej: 0.5 ha)
//         productionMode,     // Modo (ej: Ecológico)
//     } = config;

//     const formattedArea = area ? `${area} ha` : 'N/A';
//     const formattedDate = formatDate(plantationDate);

//     // --- Componente de Fila de Detalle ---
//     const DetailItem = ({ Icon, label, value, color = 'text-indigo-500' }) => (
//         <div className="flex items-start text-sm md:text-base text-gray-700 p-2 border-b last:border-b-0">
//             <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${color}`} />
//             <div className="flex flex-col flex-grow truncate">
//                 <span className="font-medium text-gray-500 text-xs uppercase">{label}</span>
//                 <span className="font-bold text-gray-800 truncate">{value || "Sin especificar"}</span>
//             </div>
//         </div>
//     );

//     return (
//         <motion.div
//             className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-teal-500"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="flex items-center justify-between border-b pb-3 mb-4">
//                 <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                     <FaFlask className="w-5 h-5 mr-2" />
//                     Datos Clave de Producción
//                 </h3>
//                 <span className="text-xs font-semibold text-gray-500 bg-teal-100 px-2 py-1 rounded-full">{productionMode || 'N/A'}</span>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Columna 1: Cultivo y Planta */}
//                 <div className="space-y-2 border-r sm:pr-4">
//                     <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                         <FaSeedling className="w-4 h-4 mr-2" />
//                         Identificación
//                     </h4>
                    
//                     <DetailItem
//                         Icon={FaTag}
//                         label="Tipo de Cultivo"
//                         value={cropName}
//                         color="text-teal-600"
//                     />
//                     <DetailItem
//                         Icon={MdLocalFlorist}
//                         label="Nombre de Planta"
//                         value={plantVariety}
//                         color="text-teal-500"
//                     />
//                 </div>

//                 {/* Columna 2: Logística y Tiempos */}
//                 <div className="space-y-2 sm:pl-4">
//                     <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                         <FaCalendarAlt className="w-4 h-4 mr-2" />
//                         Logística
//                     </h4>

//                     <DetailItem
//                         Icon={FaSquare}
//                         label="Área Total"
//                         value={formattedArea}
//                         color="text-green-500"
//                     />
//                     <DetailItem
//                         Icon={FaCalendarAlt}
//                         label="Fecha de Plantación"
//                         value={formattedDate}
//                         color="text-indigo-500"
//                     />
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default GreenhouseSummaryCard;

// src/Pages/produccionC/GreenhouseSummaryCard.jsx

// import React, { useState } from 'react'; 
// import { FaEdit, FaSeedling, FaRulerCombined, FaTag } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// // Importa el nuevo componente Modal (Asegúrate que la ruta sea correcta)
// import ConfigModal from '../../components/HomeContent.js/ConfigModal'; 

// const GreenhouseSummaryCard = ({ 
//     config = {}, 
//     totalProduction = 0, 
//     currentCrop = "Sin especificar", 
//     selectedGreenhouseId, 
//     updateGreenhouseConfig, 
// }) => {
//     // Estado para controlar la visibilidad del modal
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     // Calcular el porcentaje de avance
//     const progress = (config.goal > 0 && totalProduction > 0) 
//         ? Math.min(100, (totalProduction / config.goal) * 100).toFixed(1) 
//         : 0;
        
//     // Datos clave para mostrar en la tarjeta
//     const primaryData = [
//         { title: "Meta", value: config.goal?.toLocaleString() || '0', unit: "Kg", icon: FaSeedling, color: "text-green-600" },
//         { title: "Área", value: config.area?.toFixed(2) || '0.00', unit: "Ha", icon: FaRulerCombined, color: "text-blue-600" },
//         { title: "Variedad", value: config.variety || 'N/A', unit: "", icon: FaTag, color: "text-purple-600" },
//     ];


//     return (
//         <>
//             <motion.div 
//                 className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 space-y-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 <div className="flex justify-between items-start border-b pb-3">
//                     <h2 className="text-xl font-bold text-indigo-700">
//                         Datos Clave de Producción
//                     </h2>
//                     <button 
//                         onClick={() => setIsModalOpen(true)}
//                         className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md flex items-center space-x-2"
//                         title="Editar Configuración Detallada"
//                     >
//                         <FaEdit className="w-4 h-4" />
//                     </button>
//                 </div>

//                 {/* Cultivo Actual */}
//                 <p className="text-lg font-semibold text-gray-800 border-b pb-2">
//                     Cultivo: <span className="text-green-600">{currentCrop}</span>
//                 </p>

//                 {/* Mostrar datos relevantes */}
//                 <div className="space-y-3">
//                     {primaryData.map((data, index) => (
//                         <div key={index} className="flex items-center space-x-3">
//                             <data.icon className={`text-xl ${data.color}`} />
//                             <p className="font-medium w-32">{data.title}:</p>
//                             <p className="font-bold text-gray-800">
//                                 {data.value}
//                                 <span className="text-sm font-normal text-gray-500 ml-1">{data.unit}</span>
//                             </p>
//                         </div>
//                     ))}
//                 </div>
                
//                 {/* Barra de Progreso */}
//                 <div className="pt-3 border-t">
//                     <p className="text-sm font-medium text-gray-600 mb-1">
//                         Progreso de Meta: <span className="font-bold text-indigo-600">{progress}%</span>
//                     </p>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                             className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                         {totalProduction.toFixed(0)} Kg cosechados de {config.goal?.toLocaleString() || 0} Kg
//                     </p>
//                 </div>
//             </motion.div>

//             {/* 🚀 IMPLEMENTACIÓN DEL MODAL 🚀 */}
//             {isModalOpen && (
//                 <ConfigModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     currentConfig={config}
//                     selectedGreenhouseId={selectedGreenhouseId}
//                     updateGreenhouseConfig={updateGreenhouseConfig}
//                     currentCrop={currentCrop}
//                 />
//             )}
//         </>
//     );
// };

// export default GreenhouseSummaryCard;




// src/Pages/produccionC/GreenhouseSummaryCard.jsx

// import React, { useState } from 'react'; 


// import { FaEdit, FaSeedling, FaRulerCombined, FaTag, FaFlask, FaCalendarAlt, FaSquare } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md'; // Asegúrate de tener instalado react-icons/md
// import { motion } from 'framer-motion';

// // Importa el componente Modal (asegurando que sigue siendo la ruta correcta)
// import ConfigModal from '../../components/HomeContent.js/ConfigModal'; 

// // Componente auxiliar DetailItem (Asumiendo que lo pones al inicio del archivo o lo importas)
// const DetailItem = ({ Icon, label, value, color }) => (
//     <div className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
//         <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
//         <div className="flex flex-col">
//             <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
//             <span className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</span>
//         </div>
//     </div>
// );


// const GreenhouseSummaryCard = ({ 
//     config = {}, 
//     totalProduction = 0, 
//     currentCrop = "Sin especificar", 
//     selectedGreenhouseId, 
//     updateGreenhouseConfig, 
// }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     // 💡 NUEVOS DATOS y FORMATO
//     // Asumimos que productionMode, plantVariety, y plantingDate vienen en el objeto 'config'
//     const cropName = currentCrop; // Se usa la prop 'currentCrop'
//     const productionMode = config.productionMode || 'Estándar'; // Nuevo dato
//     const plantVariety = config.variety || 'N/A'; // Dato que ya existía en config
//     const plantingDate = config.plantingDate || '2025-01-01'; // Asume un nuevo campo
    
//     // Formato de datos
//     const formattedArea = `${config.area?.toFixed(2) || '0.00'} Ha`;
//     const formattedDate = plantingDate; // Usaremos la fecha tal cual para simplicidad
//     const goal = config.goal || 0;
    
//     // Cálculo de Progreso
//     const progress = (goal > 0 && totalProduction > 0) 
//         ? Math.min(100, (totalProduction / goal) * 100).toFixed(1) 
//         : 0;

//     return (
//         <>
//             <motion.div 
//                 className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-teal-500 space-y-4" // 👈 Estilos de la CARD
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 <div className="flex justify-between items-center border-b pb-3">
//                     {/* ENCABEZADO ESTILIZADO */}
//                     <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                         <FaFlask className="w-5 h-5 mr-2" />
//                         Datos Clave de Producción
//                     </h3>
//                     <div className="flex items-center space-x-3">
//                         <span className="text-xs font-semibold text-gray-500 bg-teal-100 px-2 py-1 rounded-full">{productionMode}</span>
                        
//                         {/* BOTÓN DEL MODAL (CRUCIAL: Mantiene la funcionalidad) */}
//                         <button 
//                             onClick={() => setIsModalOpen(true)}
//                             className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md"
//                             title="Editar Configuración Detallada"
//                         >
//                             <FaEdit className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ESTRUCTURA DE GRID 2 COLUMNAS */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
//                     {/* Columna 1: Cultivo e Identificación */}
//                     <div className="space-y-3 border-r sm:pr-4">
//                         <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                             <FaSeedling className="w-4 h-4 mr-2" />
//                             Identificación del Lote
//                         </h4>
                        
//                         <DetailItem
//                             Icon={FaTag}
//                             label="Tipo de Cultivo"
//                             value={cropName}
//                             color="text-teal-600"
//                         />
//                         <DetailItem
//                             Icon={MdLocalFlorist}
//                             label="Variedad de Planta"
//                             value={plantVariety}
//                             color="text-teal-500"
//                         />
//                          <DetailItem
//                             Icon={FaRulerCombined}
//                             label="Tamaño de Calibre"
//                             value={config.size || 'N/A'} // Nuevo dato del modal
//                             color="text-yellow-600"
//                         />
//                     </div>

//                     {/* Columna 2: Metas y Logística */}
//                     <div className="space-y-3 sm:pl-4">
//                         <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                             <FaCalendarAlt className="w-4 h-4 mr-2" />
//                             Metas y Tiempos
//                         </h4>

//                         <DetailItem
//                             Icon={FaSquare}
//                             label="Área Total"
//                             value={formattedArea}
//                             color="text-green-500"
//                         />
//                         <DetailItem
//                             Icon={FaCalendarAlt}
//                             label="Fecha Límite Cosecha"
//                             value={config.deadline || 'N/A'}
//                             color="text-orange-500"
//                         />
//                         <DetailItem
//                             Icon={FaCalendarAlt}
//                             label="Fecha de Plantación"
//                             value={formattedDate}
//                             color="text-indigo-500"
//                         />
//                     </div>
//                 </div>
                
//                 {/* BARRA DE PROGRESO DE META (Parte inferior de la card) */}
//                 <div className="pt-4 border-t border-gray-200">
//                     <p className="text-md font-semibold text-gray-700 mb-1">
//                         Meta: <span className="text-green-600">{goal.toLocaleString()} Kg</span>
//                     </p>
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Progreso de Producción: <span className="font-bold text-teal-600">{progress}%</span>
//                     </p>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                         <div 
//                             className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1 text-right">
//                         {totalProduction.toFixed(0)} Kg cosechados
//                     </p>
//                 </div>
//             </motion.div>

//             {/* 🚀 MODAL DE CONFIGURACIÓN (MANTIENE LA FUNCIONALIDAD Y EL Z-INDEX) 🚀 */}
//             {isModalOpen && (
//                 <ConfigModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     currentConfig={config}
//                     selectedGreenhouseId={selectedGreenhouseId}
//                     updateGreenhouseConfig={updateGreenhouseConfig}
//                     currentCrop={currentCrop}
//                 />
//             )}
//         </>
//     );
// };

// export default GreenhouseSummaryCard;


// src/Pages/produccionC/GreenhouseSummaryCard.jsx

// import React, { useState } from 'react'; 
// import { FaEdit, FaSeedling, FaRulerCombined, FaTag, FaFlask, FaCalendarAlt, FaSquare } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md'; 
// import { motion } from 'framer-motion';

// // Importa el componente Modal (sin Portals, con Z-index alto)
// import ConfigModal from '../../components/HomeContent.js/ConfigModal'; 

// // Componente auxiliar DetailItem (Debe ser accesible, idealmente fuera del componente principal)
// const DetailItem = ({ Icon, label, value, color }) => (
//     <div className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
//         <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
//         <div className="flex flex-col">
//             <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
//             <span className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</span>
//         </div>
//     </div>
// );


// const GreenhouseSummaryCard = ({ 
//     config = {}, 
//     totalProduction = 0, 
//     currentCrop = "Sin especificar", 
//     selectedGreenhouseId, 
//     updateGreenhouseConfig, // Función para actualizar el estado del padre
// }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     // Extracción y formato de datos
//     const cropName = currentCrop; 
//     const productionMode = config.productionMode || 'Estándar'; 
//     const plantVariety = config.variety || 'N/A'; 
//     const plantingDate = config.plantingDate || 'N/A';
    
//     const formattedArea = `${config.area?.toFixed(2) || '0.00'} Ha`;
//     const goal = config.goal || 0;
    
//     // Cálculo de Progreso
//     const progress = (goal > 0 && totalProduction > 0) 
//         ? Math.min(100, (totalProduction / goal) * 100).toFixed(1) 
//         : 0;

//     return (
//         <>
//             <motion.div 
//                 className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-teal-500 space-y-4" 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 <div className="flex justify-between items-center border-b pb-3">
//                     {/* ENCABEZADO ESTILIZADO */}
//                     <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                         <FaFlask className="w-5 h-5 mr-2" />
//                         Datos Clave de Producción
//                     </h3>
//                     <div className="flex items-center space-x-3">
//                         <span className="text-xs font-semibold text-gray-500 bg-teal-100 px-2 py-1 rounded-full">{productionMode}</span>
                        
//                         {/* BOTÓN DEL MODAL (ACTIVA isModalOpen) */}
//                         <button 
//                             onClick={() => setIsModalOpen(true)}
//                             className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md"
//                             title="Editar Configuración Detallada"
//                         >
//                             <FaEdit className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ESTRUCTURA DE GRID 2 COLUMNAS */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
//                     {/* Columna 1: Cultivo e Identificación */}
//                     <div className="space-y-3 border-r sm:pr-4">
//                         <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                             <FaSeedling className="w-4 h-4 mr-2" />
//                             Identificación del Lote
//                         </h4>
                        
//                         <DetailItem Icon={FaTag} label="Tipo de Cultivo" value={cropName} color="text-teal-600" />
//                         <DetailItem Icon={MdLocalFlorist} label="Variedad de Planta" value={plantVariety} color="text-teal-500" />
//                         <DetailItem Icon={FaRulerCombined} label="Tamaño de Calibre" value={config.size || 'N/A'} color="text-yellow-600" />
//                     </div>

//                     {/* Columna 2: Metas y Logística */}
//                     <div className="space-y-3 sm:pl-4">
//                         <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                             <FaCalendarAlt className="w-4 h-4 mr-2" />
//                             Metas y Tiempos
//                         </h4>

//                         <DetailItem Icon={FaSquare} label="Área Total" value={formattedArea} color="text-green-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha Límite Cosecha" value={config.deadline || 'N/A'} color="text-orange-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha de Plantación" value={plantingDate} color="text-indigo-500" />
//                     </div>
//                 </div>
                
//                 {/* BARRA DE PROGRESO DE META */}
//                 <div className="pt-4 border-t border-gray-200">
//                     <p className="text-md font-semibold text-gray-700 mb-1">
//                         Meta: <span className="text-green-600">{goal.toLocaleString()} Kg</span>
//                     </p>
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Progreso de Producción: <span className="font-bold text-teal-600">{progress}%</span>
//                     </p>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                         <div 
//                             className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1 text-right">
//                         {totalProduction.toFixed(0)} Kg cosechados
//                     </p>
//                 </div>
//             </motion.div>

//             {/* MODAL DE CONFIGURACIÓN */}
//             {isModalOpen && (
//                 <ConfigModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     currentConfig={config}
//                     selectedGreenhouseId={selectedGreenhouseId}
//                     // 💡 PASAMOS LA FUNCIÓN PARA QUE EL MODAL LA EJECUTE AL GUARDAR
//                     updateGreenhouseConfig={updateGreenhouseConfig} 
//                     currentCrop={currentCrop}
//                 />
//             )}
//         </>
//     );
// };

// export default GreenhouseSummaryCard;


// src/Pages/produccionC/GreenhouseSummaryCard.jsx

// import React, { useState } from 'react'; 
// import { FaEdit, FaSeedling, FaRulerCombined, FaTag, FaFlask, FaCalendarAlt, FaSquare } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md'; 
// import { motion } from 'framer-motion';

// // Importa el componente Modal
// import ConfigModal from '../../components/HomeContent.js/ConfigModal'; 

// // Componente auxiliar DetailItem 
// const DetailItem = ({ Icon, label, value, color }) => (
//     <div className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
//         <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
//         <div className="flex flex-col">
//             <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
//             <span className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</span>
//         </div>
//     </div>
// );


// const GreenhouseSummaryCard = ({ 
//     config = {}, 
//     totalProduction = 0, 
//     currentCrop = "Sin especificar", 
//     selectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     // 💡 NUEVOS PROPS
//     greenhouses, 
//     onSelectGreenhouse,
// }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     // Extracción y formato de datos
//     const cropName = currentCrop; 
//     const productionMode = config.productionMode || 'Estándar'; 
//     const plantVariety = config.variety || 'N/A'; 
//     const plantingDate = config.plantingDate || 'N/A';
    
//     const formattedArea = `${config.area?.toFixed(2) || '0.00'} Ha`;
//     const goal = config.goal || 0;
    
//     // Cálculo de Progreso
//     const progress = (goal > 0 && totalProduction > 0) 
//         ? Math.min(100, (totalProduction / goal) * 100).toFixed(1) 
//         : 0;

//     return (
//         <>
//             <motion.div 
//                 className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-teal-500 space-y-4" 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 {/* 🚨 ENCABEZADO CON SELECTOR */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 space-y-2 sm:space-y-0">
                    
//                     <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                         <FaFlask className="w-5 h-5 mr-2" />
//                         Datos Clave de Producción
//                     </h3>
                    
//                     <div className="flex items-center space-x-3">
//                         {/* 💡 SELECTOR DE INVERNADEROS */}
//                         <select
//                             value={selectedGreenhouseId}
//                             onChange={onSelectGreenhouse}
//                             className="p-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
//                             aria-label="Seleccionar Invernadero"
//                         >
//                             {greenhouses.map((gh) => (
//                                 <option key={gh.id} value={gh.id}>
//                                     {gh.name} ({gh.currentCrop})
//                                 </option>
//                             ))}
//                         </select>
                        
//                         <span className="text-xs font-semibold text-gray-500 bg-teal-100 px-2 py-1 rounded-full">{productionMode}</span>
                        
//                         {/* BOTÓN DEL MODAL */}
//                         <button 
//                             onClick={() => setIsModalOpen(true)}
//                             className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md"
//                             title="Editar Configuración Detallada"
//                         >
//                             <FaEdit className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ESTRUCTURA DE GRID 2 COLUMNAS */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
//                     {/* Columna 1: Cultivo e Identificación */}
//                     <div className="space-y-3 border-r sm:pr-4">
//                         <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                             <FaSeedling className="w-4 h-4 mr-2" />
//                             Identificación del Lote
//                         </h4>
                        
//                         <DetailItem Icon={FaTag} label="Tipo de Cultivo" value={cropName} color="text-teal-600" />
//                         <DetailItem Icon={MdLocalFlorist} label="Variedad de Planta" value={plantVariety} color="text-teal-500" />
//                         <DetailItem Icon={FaRulerCombined} label="Tamaño de Calibre" value={config.size || 'N/A'} color="text-yellow-600" />
//                     </div>

//                     {/* Columna 2: Metas y Logística */}
//                     <div className="space-y-3 sm:pl-4">
//                         <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                             <FaCalendarAlt className="w-4 h-4 mr-2" />
//                             Metas y Tiempos
//                         </h4>

//                         <DetailItem Icon={FaSquare} label="Área Total" value={formattedArea} color="text-green-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha Límite Cosecha" value={config.deadline || 'N/A'} color="text-orange-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha de Plantación" value={plantingDate} color="text-indigo-500" />
//                     </div>
//                 </div>
                
//                 {/* BARRA DE PROGRESO DE META */}
//                 <div className="pt-4 border-t border-gray-200">
//                     <p className="text-md font-semibold text-gray-700 mb-1">
//                         Meta: <span className="text-green-600">{goal.toLocaleString()} Kg</span>
//                     </p>
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Progreso de Producción: <span className="font-bold text-teal-600">{progress}%</span>
//                     </p>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                         <div 
//                             className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1 text-right">
//                         {totalProduction.toFixed(0)} Kg cosechados
//                     </p>
//                 </div>
//             </motion.div>

//             {/* MODAL DE CONFIGURACIÓN */}
//             {isModalOpen && (
//                 <ConfigModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     currentConfig={config}
//                     selectedGreenhouseId={selectedGreenhouseId}
//                     updateGreenhouseConfig={updateGreenhouseConfig} 
//                     currentCrop={currentCrop}
//                 />
//             )}
//         </>
//     );
// };

// export default GreenhouseSummaryCard;



// import React, { useState } from 'react'; 
// import { FaEdit, FaSeedling, FaRulerCombined, FaTag, FaFlask, FaCalendarAlt, FaSquare } from 'react-icons/fa';
// import { MdLocalFlorist } from 'react-icons/md'; 
// import { motion } from 'framer-motion';

// // Importa el componente Modal (Asegúrate de que la ruta sea correcta)
// import ConfigModal from '../../components/HomeContent.js/ConfigModal'; 

// // Componente auxiliar DetailItem 
// const DetailItem = ({ Icon, label, value, color }) => (
//     <div className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
//         <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
//         <div className="flex flex-col">
//             <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
//             <span className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</span>
//         </div>
//     </div>
// );


// const GreenhouseSummaryCard = ({ 
//     config = {}, 
//     totalProduction = 0, 
//     currentCrop = "Sin especificar", 
//     selectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     // 💡 PROPS CLAVE PARA EL SELECTOR
//     greenhouses = [], // Aseguramos que sea un array vacío por defecto
//     onSelectGreenhouse,
// }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
    
//     // Extracción y formato de datos
//     const cropName = currentCrop; 
//     const productionMode = config.productionMode || 'Estándar'; 
//     const plantVariety = config.variety || 'N/A'; 
//     const plantingDate = config.plantingDate || 'N/A';
    
//     const formattedArea = `${config.area?.toFixed(2) || '0.00'} Ha`;
//     const goal = config.goal || 0;
    
//     // Cálculo de Progreso
//     const progress = (goal > 0 && totalProduction > 0) 
//         ? Math.min(100, (totalProduction / goal) * 100).toFixed(1) 
//         : 0;

//     // Handler para el cambio en el selector
//     const handleSelectChange = (e) => {
//         // Llama a la función que se pasa por prop, enviando el nuevo ID
//         if (onSelectGreenhouse) {
//             onSelectGreenhouse(e.target.value);
//         }
//     };

//     return (
//         <>
//             <motion.div 
//                 className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-teal-500 space-y-4" 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 {/* 🚨 ENCABEZADO CON SELECTOR */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 space-y-2 sm:space-y-0">
                    
//                     <h3 className="text-xl font-extrabold text-teal-700 flex items-center">
//                         <FaFlask className="w-5 h-5 mr-2" />
//                         Datos Clave de Producción
//                     </h3>
                    
//                     <div className="flex items-center space-x-3">
//                         {/* 💡 SELECTOR DE INVERNADEROS (POBLADO CON GREENHOUSES) */}
//                         <select
//                             value={selectedGreenhouseId || ''} // Usamos '' si es null
//                             onChange={handleSelectChange} // Usamos el handler que llama a onSelectGreenhouse
//                             className="p-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
//                             aria-label="Seleccionar Invernadero"
//                         >
//                             {/* 🔍 Mapeamos la lista de invernaderos */}
//                             {greenhouses.map((gh) => (
//                                 <option key={gh.id} value={gh.id}>
//                                     {gh.name}
//                                     {/* Opcional: Si 'currentCrop' viene en el objeto gh: */}
//                                     {gh.currentCrop ? ` (${gh.currentCrop})` : ''} 
//                                 </option>
//                             ))}
//                             {/* Opcional: Mostrar una opción si la lista está vacía */}
//                             {greenhouses.length === 0 && (
//                                 <option value="" disabled>No hay invernaderos creados</option>
//                             )}
//                         </select>
                        
//                         <span className="text-xs font-semibold text-gray-500 bg-teal-100 px-2 py-1 rounded-full">{productionMode}</span>
                        
//                         {/* BOTÓN DEL MODAL */}
//                         <button 
//                             onClick={() => setIsModalOpen(true)}
//                             className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md"
//                             title="Editar Configuración Detallada"
//                         >
//                             <FaEdit className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* ESTRUCTURA DE GRID 2 COLUMNAS */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
//                     {/* Columna 1: Cultivo e Identificación */}
//                     <div className="space-y-3 border-r sm:pr-4">
//                         <h4 className="font-bold text-lg text-teal-600 mb-2 border-b pb-1 flex items-center">
//                             <FaSeedling className="w-4 h-4 mr-2" />
//                             Identificación del Lote
//                         </h4>
                        
//                         <DetailItem Icon={FaTag} label="Tipo de Cultivo" value={cropName} color="text-teal-600" />
//                         <DetailItem Icon={MdLocalFlorist} label="Variedad de Planta" value={plantVariety} color="text-teal-500" />
//                         <DetailItem Icon={FaRulerCombined} label="Tamaño de Calibre" value={config.size || 'N/A'} color="text-yellow-600" />
//                     </div>

//                     {/* Columna 2: Metas y Logística */}
//                     <div className="space-y-3 sm:pl-4">
//                         <h4 className="font-bold text-lg text-indigo-600 mb-2 border-b pb-1 flex items-center">
//                             <FaCalendarAlt className="w-4 h-4 mr-2" />
//                             Metas y Tiempos
//                         </h4>

//                         <DetailItem Icon={FaSquare} label="Área Total" value={formattedArea} color="text-green-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha Límite Cosecha" value={config.deadline || 'N/A'} color="text-orange-500" />
//                         <DetailItem Icon={FaCalendarAlt} label="Fecha de Plantación" value={plantingDate} color="text-indigo-500" />
//                     </div>
//                 </div>
                
//                 {/* BARRA DE PROGRESO DE META */}
//                 <div className="pt-4 border-t border-gray-200">
//                     <p className="text-md font-semibold text-gray-700 mb-1">
//                         Meta: <span className="text-green-600">{goal.toLocaleString()} Kg</span>
//                     </p>
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Progreso de Producción: <span className="font-bold text-teal-600">{progress}%</span>
//                     </p>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                         <div 
//                             className="bg-teal-600 h-3 rounded-full transition-all duration-500" 
//                             style={{ width: `${progress}%` }}
//                         ></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1 text-right">
//                         {totalProduction.toFixed(0)} Kg cosechados
//                     </p>
//                 </div>
//             </motion.div>

//             {/* MODAL DE CONFIGURACIÓN */}
//             {isModalOpen && (
//                 <ConfigModal
//                     isOpen={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     currentConfig={config}
//                     selectedGreenhouseId={selectedGreenhouseId}
//                     updateGreenhouseConfig={updateGreenhouseConfig} 
//                     currentCrop={currentCrop}
//                 />
//             )}
//         </>
//     );
// };

// export default GreenhouseSummaryCard;


import React from 'react';
import { FaLayerGroup, FaRulerCombined } from 'react-icons/fa';
import { BsFillCalendarFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import DatosEstadisticosCard from '../../Pages/produccionC/DatosEstadisticosCard'; 
// Asume que esta es la ruta correcta para tu componente Estadístico

// Componente para manejar las metas (si existe)
// import InlineGoalInput from '../../components/InlineGoalInput'; 
// Nota: Lo dejo comentado si aún no lo has implementado.

// --- Componente Auxiliar para mostrar el Resumen de Producción ---
const ProductionStat = ({ title, value, unit, icon: Icon, color }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-inner">
        <div className={`p-2 rounded-full text-white text-xl ${color}`}>
            <Icon />
        </div>
        <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-lg font-bold text-gray-800">
                {value}
                <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>
            </p>
        </div>
    </div>
);


// ====================================================================
// === COMPONENTE PRINCIPAL: GreenhouseSummaryCard
// ====================================================================

const GreenhouseSummaryCard = ({
    // Props requeridos por HomeContent
    config = {}, // Contiene la configuración cargada desde Firebase (config/meta)
    totalProduction = 0, // Producción calculada en HomeContent
    selectedGreenhouseId, // ID del invernadero actual
    updateGreenhouseConfig, // Función para guardar la configuración en Firebase
    
    // Props para el selector
    greenhouses = [], // Lista de todos los invernaderos
    onSelectGreenhouse, // Handler para cambiar el invernadero seleccionado
    
    // Otros (ej. si necesitas dailyData o globalGoal aquí)
    // dailyData,
    // globalGoal,
}) => {
    
    const formatNumber = (num) => (num || 0).toLocaleString('es-ES', { maximumFractionDigits: 1 });
    
    // Lógica para obtener el nombre de la cosecha o el nombre de invernadero si no hay datos
    const cropName = config.cropName || "Cultivo sin asignar";
    
    // Objeto para pasar al componente de metas (si lo usas)
    // const goalData = globalGoal || {}; 

    return (
        <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
                Gestión y Resumen
            </h2>

            {/* 1. Selector de Invernaderos */}
            <div className="mb-6">
                <label htmlFor="greenhouse-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Invernadero Seleccionado
                </label>
                <select
                    id="greenhouse-select"
                    value={selectedGreenhouseId || ''}
                    onChange={onSelectGreenhouse} // onSelectGreenhouse recibe el evento y pasa e.target.value
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    disabled={greenhouses.length === 0}
                >
                    {greenhouses.length === 0 ? (
                        <option value="">No hay invernaderos</option>
                    ) : (
                        greenhouses.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* 2. Resumen de Producción */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">
                    Resumen del Cultivo: <span className="text-indigo-600">{cropName}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <ProductionStat
                        title="Producción Total"
                        value={formatNumber(totalProduction)}
                        unit="Kg"
                        icon={FaLayerGroup}
                        color="bg-green-500"
                    />
                    <ProductionStat
                        title="Área Cultivada"
                        value={config.areaTotal || '0.0'}
                        unit="ha"
                        icon={FaRulerCombined}
                        color="bg-blue-500"
                    />
                    {/* Puedes añadir la meta si tienes el prop globalGoal */}
                    {/*
                    <ProductionStat
                        title="Meta Diaria"
                        value={formatNumber(goalData.dailyGoal || 0)}
                        unit="Kg"
                        icon={BsFillCalendarFill}
                        color="bg-orange-500"
                    />
                    */}
                </div>
            </div>

            {/* 3. Datos Estadísticos y Configuración (usa DatosEstadisticosCard) */}
            <div className="mt-auto">
                <DatosEstadisticosCard
                    // 🔑 Pasa la configuración actual de Firebase
                    initialConfig={config} 
                    
                    // 🔑 Pasa la función de guardado a Firebase
                    onSaveConfig={updateGreenhouseConfig} 
                    
                    // Si tienes el dailyData, lo puedes pasar
                    // dailyData={dailyData}
                />
            </div>
            
            {/* 4. Componente para Metas (Si lo usas) */}
            {/*
            <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Metas de Producción</h3>
                <InlineGoalInput
                    // Pasa props específicos para metas aquí
                />
            </div>
            */}
        </motion.div>
    );
};

export default GreenhouseSummaryCard;