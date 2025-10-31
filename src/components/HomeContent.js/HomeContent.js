// import React from 'react';
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
// import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de Tarjeta de Pronóstico (Weather Card) ---
// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// // --- Componente principal del contenido de inicio ---
// const HomeContent = () => {
//     const summaryData = [
//         { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//         { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
//         { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//         { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
//     ];

//     const weatherForecast = [
//         { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//         { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//         { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//         { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
//     ];

//     const recentActivities = [
//         { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//         { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//         { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
//     ];

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (2 columnas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Espacio Principal) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* Mapa (Estilo WiseCrop) */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-96">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Estado del Cultivo</h2>
//                         <div className="h-[calc(100%-4rem)] bg-gray-200 flex items-center justify-center rounded-lg border-2 border-gray-300">
//                             <p className="text-gray-500 italic">Aquí va el Mapa (ej: Leaflet/Google Maps)</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Predicción del Tiempo y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;










// // src/components/HomeContent.js/HomeContent.jsx

// import React from 'react';
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
// import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast'; 

// // 🚨 IMPORTACIÓN CLAVE: Importamos el componente GreenhouseMap
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de Tarjeta de Pronóstico (Weather Card) ---
// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// // --- Componente principal del contenido de inicio ---
// // 🚨 NOTA: Para que el mapa funcione, HomeContent debe recibir las props de datos de invernadero.
// const HomeContent = ({ 
//     greenhouseList = [], // Lista real de invernaderos de Firebase
//     selectedGreenhouseId = 'gh-1', // ID del invernadero actualmente seleccionado
//     onGreenhouseChange = (id) => toast.success(`Seleccionado Invernadero ID: ${id}`) // Función para cambiar el invernadero en el componente padre
// }) => {
    
//     // 🚨 DATOS DE EJEMPLO para simular un escenario de producción y el mapa:
//     const mockGreenhouseList = greenhouseList.length > 0 ? greenhouseList : [
//         { id: 'gh-1', name: "Finca Este", latitude: 40.45, longitude: -3.7, currentCrop: "Calabacín" },
//         { id: 'gh-2', name: "Finca Oeste", latitude: 39.9, longitude: -4.3, currentCrop: "Tomate" },
//         { id: 'gh-3', name: "Finca Norte", latitude: 40.8, longitude: -3.0, currentCrop: "Pimiento" },
//     ];
    
//     // Funciones y datos que ya tenías
//     const summaryData = [
//         { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//         { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
//         { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//         { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
//     ];

//     const weatherForecast = [
//         { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//         { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//         { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//         { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
//     ];

//     const recentActivities = [
//         { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//         { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//         { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
//     ];
    
//     // Función que se dispara cuando se hace clic en un marcador del mapa
//     const handleMapSelect = (id) => {
//         onGreenhouseChange(id);
//     };


//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (2 columnas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Espacio Principal) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 🚨 INTEGRACIÓN DEL MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-96">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Estado del Cultivo</h2>
//                         <div className="h-[calc(100%-4rem)]">
//                             <GreenhouseMap 
//                                 greenhouses={mockGreenhouseList} // Usamos la lista de invernaderos (real o mock)
//                                 onGreenhouseSelect={handleMapSelect} // Función de manejo de selección
//                                 selectedGreenhouseId={selectedGreenhouseId} // ID seleccionado
//                             />
//                         </div>
//                     </div>

//                     {/* Espacio para Gráficas de Producción */}
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
//                          <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Predicción del Tiempo y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;



// src/components/HomeContent.js/HomeContent.jsx

// import React, { useState } from 'react';
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
// import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast'; 

// // 🚨 Importación clave del mapa
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 

// // =======================================================================
// // === DATOS DE EJEMPLO REALES DEL USUARIO (MOCK)
// // =======================================================================
// const REAL_GREENHOUSE_MOCK_LIST = [
//     { id: 'gh-1', name: "Invernadero #1", latitude: 37.824148, longitude: -0.942622, currentCrop: "Calabacín" },
//     { id: 'gh-2', name: "Invernadero #2", latitude: 37.824639, longitude: -0.941077, currentCrop: "Tomate" },
//     { id: 'gh-3', name: "Invernadero #3", latitude: 37.825182, longitude: -0.939897, currentCrop: "Pimiento" },
//     { id: 'gh-4', name: "Invernadero #4", latitude: 37.826961, longitude: -0.940219, currentCrop: "Lechuga" },
//     { id: 'gh-5', name: "Invernadero #5", latitude: 37.825588, longitude: -0.940841, currentCrop: "Berenjena" },
// ];
// // =======================================================================

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de Tarjeta de Pronóstico (Weather Card) ---
// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// // --- Componente principal del contenido de inicio ---
// const HomeContent = ({ 
//     greenhouseList = [], // Lista real de invernaderos de Firebase (si no hay, usamos el mock)
//     selectedGreenhouseId = 'gh-1', 
//     onGreenhouseChange = (id) => toast.success(`Seleccionado Invernadero ID: ${id}`)
// }) => {
    
//     // 🚨 USO DE DATOS: Si Firebase devuelve datos, los usamos. Si no, usamos el mock con las 5 coordenadas reales.
//     const currentGreenhouseList = greenhouseList.length > 0 ? greenhouseList : REAL_GREENHOUSE_MOCK_LIST;
    
//     // Funciones y datos que ya tenías
//     const summaryData = [
//         { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//         { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
//         { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//         { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
//     ];

//     const weatherForecast = [
//         { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//         { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//         { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//         { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
//     ];

//     const recentActivities = [
//         { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//         { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//         { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
//     ];
    
//     const handleMapSelect = (id) => {
//         onGreenhouseChange(id);
//     };


//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (2 columnas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Espacio Principal) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* INTEGRACIÓN DEL MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-96">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Estado del Cultivo</h2>
//                         <div className="h-[calc(100%-4rem)]">
//                             <GreenhouseMap 
//                                 // Pasamos la lista con las 5 coordenadas
//                                 greenhouses={currentGreenhouseList} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* Espacio para Gráficas de Producción */}
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
//                          <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Predicción del Tiempo y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;



// import React, { useState } from 'react';
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
// import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast'; 

// // Importación clave del mapa
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// // IMPORTAR EL NUEVO COMPONENTE DE DATOS
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 

// // =======================================================================
// // === DATOS DE EJEMPLO REALES DEL USUARIO (MOCK)
// // =======================================================================
// const REAL_GREENHOUSE_MOCK_LIST = [
//     { id: 'gh-1', name: "Invernadero #1", latitude: 37.824148, longitude: -0.942622, currentCrop: "Calabacín" },
//     { id: 'gh-2', name: "Invernadero #2", latitude: 37.824639, longitude: -0.941077, currentCrop: "Tomate" },
//     { id: 'gh-3', name: "Invernadero #3", latitude: 37.825182, longitude: -0.939897, currentCrop: "Pimiento" },
//     { id: 'gh-4', name: "Invernadero #4", latitude: 37.826961, longitude: -0.940219, currentCrop: "Lechuga" },
//     { id: 'gh-5', name: "Invernadero #5", latitude: 37.825588, longitude: -0.940841, currentCrop: "Berenjena" },
// ];
// // =======================================================================

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de Tarjeta de Pronóstico (Weather Card) ---
// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// // --- Componente principal del contenido de inicio ---
// const HomeContent = ({ 
//     greenhouseList = [], // Lista real de invernaderos de Firebase (si no hay, usamos el mock)
//     selectedGreenhouseId = 'gh-1', 
//     onGreenhouseChange = (id) => toast.success(`Seleccionado Invernadero ID: ${id}`),
//     // PROP RECIBIDA DEL PADRE
//     currentGreenhouseConfig = {},
// }) => {
    
//     // USO DE DATOS: Si Firebase devuelve datos, los usamos. Si no, usamos el mock con las 5 coordenadas reales.
//     const currentGreenhouseList = greenhouseList.length > 0 ? greenhouseList : REAL_GREENHOUSE_MOCK_LIST;
    
//     // Funciones y datos que ya tenías
//     const summaryData = [
//         { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//         { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
//         { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//         { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
//     ];

//     const weatherForecast = [
//         { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//         { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//         { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//         { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
//     ];

//     const recentActivities = [
//         { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//         { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//         { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
//     ];
    
//     const handleMapSelect = (id) => {
//         onGreenhouseChange(id);
//     };


//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (2 columnas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Espacio Principal) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* INTEGRACIÓN DEL MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-96">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Estado del Cultivo</h2>
//                         <div className="h-[calc(100%-4rem)]">
//                             <GreenhouseMap 
//                                 // Pasamos la lista con las 5 coordenadas
//                                 greenhouses={currentGreenhouseList} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* TARJETA DE RESUMEN DE CULTIVO AQUÍ */}
//                     <GreenhouseSummaryCard 
//                         config={currentGreenhouseConfig}
//                     />

//                     {/* Espacio para Gráficas de Producción */}
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
//                         <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Predicción del Tiempo y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;


// import React, { useState } from 'react';
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
// import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast'; 

// // Importaciones
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 

// // =======================================================================
// // === DATOS DE EJEMPLO REALES DEL USUARIO (MOCK)
// // =======================================================================
// const REAL_GREENHOUSE_MOCK_LIST = [
//     { id: 'gh-1', name: "Invernadero #1", latitude: 37.824148, longitude: -0.942622, currentCrop: "Calabacín" },
//     { id: 'gh-2', name: "Invernadero #2", latitude: 37.824639, longitude: -0.941077, currentCrop: "Tomate" },
//     { id: 'gh-3', name: "Invernadero #3", latitude: 37.825182, longitude: -0.939897, currentCrop: "Pimiento" },
//     { id: 'gh-4', name: "Invernadero #4", latitude: 37.826961, longitude: -0.940219, currentCrop: "Lechuga" },
//     { id: 'gh-5', name: "Invernadero #5", latitude: 37.825588, longitude: -0.940841, currentCrop: "Berenjena" },
// ];
// // =======================================================================

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de Tarjeta de Pronóstico (Weather Card) ---
// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// // --- Componente principal del contenido de inicio ---
// const HomeContent = ({ 
//     greenhouseList = [],
//     selectedGreenhouseId = 'gh-1', 
//     onGreenhouseChange = (id) => toast.success(`Seleccionado Invernadero ID: ${id}`),
//     currentGreenhouseConfig = {},
// }) => {
    
//     const currentGreenhouseList = greenhouseList.length > 0 ? greenhouseList : REAL_GREENHOUSE_MOCK_LIST;
    
//     const summaryData = [
//         { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//         { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
//         { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//         { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
//     ];

//     const weatherForecast = [
//         { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//         { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//         { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//         { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
//     ];

//     const recentActivities = [
//         { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//         { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//         { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
//     ];
    
//     const handleMapSelect = (id) => {
//         onGreenhouseChange(id);
//     };


//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (La principal de 3 columnas) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Área de 2/3: Mapa, Configuración y Gráfica) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA (Ancho completo del espacio 2/3) */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col">
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={currentGreenhouseList} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica (Divide el espacio 2/3 en 2 columnas) */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* TARJETA DE RESUMEN DE CULTIVO (OCUPA 1/2) */}
//                         <GreenhouseSummaryCard 
//                             config={currentGreenhouseConfig}
//                         />

//                         {/* Espacio para Gráficas de Producción (OCUPA 1/2) */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Área de 1/3: Pronóstico y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//  ;

// export default HomeContent;


// src/components/HomeContent.jsx

// import React from 'react'; 
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // Componentes Requeridos (Asegura que estas rutas sean correctas)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 

// // --- Componentes y Datos MOCK Auxiliares ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );

// const summaryDataMock = [
//     { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//     { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <FaRulerCombined />, color: "border-blue-500" },
//     { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//     { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
// ];
// const weatherForecast = [
//     { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//     { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//     { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//     { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
// ];
// const recentActivities = [
//     { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//     { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//     { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
// ];


// // =======================================================================
// // === HOME CONTENT PRINCIPAL
// // =======================================================================

// const HomeContent = ({ 
//     greenhouseList = [],
//     selectedGreenhouseId = null, 
//     onGreenhouseChange = () => {},
//     currentGreenhouseConfig = {},
//     dailyData = {}, 
//     updateGreenhouseConfig, 
// }) => {
    
//     const currentGreenhouse = greenhouseList.find(g => g.id === selectedGreenhouseId) || {};
//     const currentCrop = currentGreenhouse.currentCrop || "Sin especificar"; 
    
//     const totalProduction = Object.values(dailyData).reduce((sum, day) => {
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);
    
//     const handleMapSelect = (id) => {
//         onGreenhouseChange(id);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (MOCK VISIBLE) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryDataMock.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (SIEMPRE VISIBLE) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Tarjeta de Gestión) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col">
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouseList} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN (Con Modal de Edición) 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={currentGreenhouseConfig}
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCrop} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
                    
//                     {/* Predicción del Tiempo (Estático) */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
//                             Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
//                         </h2>
//                         <div className="grid grid-cols-4 gap-2">
//                             {weatherForecast.map((data, index) => (
//                                 <WeatherCard key={index} {...data} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumen de Actividades (Estático) */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
//                         <div className="space-y-3">
//                             {recentActivities.map((activity, index) => (
//                                 <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
//                                     <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
//                                     <div className="flex-1 ml-3">
//                                         <p className="text-sm font-medium text-gray-800">{activity.type}</p>
//                                         <p className="text-xs text-gray-500">{activity.details}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;

// src/components/HomeContent.jsx

// import React, { useState } from 'react'; 
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // Componentes Requeridos (Asegura que estas rutas sean correctas)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 

// // --- Componentes y Datos MOCK Auxiliares ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );


// const summaryDataMock = [
//     { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//     { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <FaRulerCombined />, color: "border-blue-500" },
//     { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//     { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
// ];
// const weatherForecast = [
//     { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//     { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//     { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//     { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
// ];
// const recentActivities = [
//     { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//     { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//     { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
// ];


// // =======================================================================
// // === HOME CONTENT PRINCIPAL
// // =======================================================================

// const HomeContent = ({ 
//     dailyData = {}, 
// }) => {
    
//     // 💡 1. ESTADO DE LOS INVERNADEROS (MOCK)
//     const [greenhouses, setGreenhouses] = useState([
//         { 
//             id: 'GH001', 
//             name: 'Invernadero Este', 
//             currentCrop: 'Calabacín',
//             config: { 
//                 goal: 1000, deadline: '2025-11-20', area: 2.5, 
//                 variety: 'Diamante F1', size: 'Medio', endDate: '2025-12-01',
//                 productionMode: 'Orgánico', plantingDate: '2025-09-01'
//             }
//         },
//         { 
//             id: 'GH002', 
//             name: 'Invernadero Oeste', 
//             currentCrop: 'Tomate',
//             config: { 
//                 goal: 2500, deadline: '2025-12-15', area: 4.0, 
//                 variety: 'Cherry', size: 'Pequeño', endDate: '2026-01-10',
//                 productionMode: 'Estándar', plantingDate: '2025-08-15'
//             }
//         },
//     ]);

//     // Estado para el invernadero seleccionado
//     const [selectedGreenhouseId, setSelectedGreenhouseId] = useState('GH001');

//     // Funciones para obtener la configuración y el invernadero seleccionado
//     const selectedGreenhouse = greenhouses.find(g => g.id === selectedGreenhouseId);
//     const currentGreenhouseConfig = selectedGreenhouse ? selectedGreenhouse.config : {};
//     const currentCrop = selectedGreenhouse ? selectedGreenhouse.currentCrop : "Sin especificar"; 
    
//     const totalProduction = Object.values(dailyData).reduce((sum, day) => {
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     // 💡 2. FUNCIÓN DE ACTUALIZACIÓN DEL ESTADO GLOBAL
//     const updateGreenhouseConfig = (id, newConfig) => {
//         setGreenhouses(prevGreenhouses => 
//             prevGreenhouses.map(gh => 
//                 gh.id === id 
//                     ? { ...gh, config: newConfig } // Actualiza solo la config
//                     : gh
//             )
//         );
//         console.log(`Configuración del invernadero ${id} actualizada localmente.`);
//         // 🚨 AQUÍ HARÍAS LA LLAMADA AXIOS/FETCH A TU API PARA PERSISTIR LOS DATOS
//     };

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (MOCK VISIBLE) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryDataMock.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (SIEMPRE VISIBLE) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Tarjeta de Gestión) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     {/* Z-INDEX BAJO PARA QUE EL MODAL LO SUPERE */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN (Con Modal de Edición) 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={currentGreenhouseConfig}
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCrop} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             // 💡 PASAMOS LA FUNCIÓN DE ACTUALIZACIÓN
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     {/* ... (Contenido de Pronóstico y Actividades) ... */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;



// src/components/HomeContent.jsx

// import React, { useState } from 'react'; 
// import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { MdOutlineWbSunny } from 'react-icons/md';
// import { motion } from 'framer-motion';

// // Componentes Requeridos
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 




// // --- Componentes y Datos MOCK Auxiliares ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
//     <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
//         <p className="font-semibold">{day}</p>
//         <div className="text-4xl mx-auto my-2">{icon}</div>
//         <p className="text-lg font-bold">{tempMax}°</p>
//         <p className="text-sm opacity-80">{tempMin}°</p>
//     </div>
// );


// const summaryDataMock = [
//     { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
//     { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <FaRulerCombined />, color: "border-blue-500" },
//     { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
//     { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
// ];
// const weatherForecast = [
//     { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
//     { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
//     { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
//     { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
// ];
// const recentActivities = [
//     { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
//     { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
//     { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
// ];


// // =======================================================================
// // === HOME CONTENT PRINCIPAL
// // =======================================================================

// const HomeContent = ({ 
//     dailyData = {}, 
// }) => {
    
//     // ESTADO DE LOS INVERNADEROS (MOCK)
//     const [greenhouses, setGreenhouses] = useState([
//         { 
//             id: 'GH001', 
//             name: 'Invernadero Este', 
//             currentCrop: 'Calabacín',
//             config: { 
//                 goal: 1000, deadline: '2025-11-20', area: 2.5, 
//                 variety: 'Diamante F1', size: 'Medio', endDate: '2025-12-01',
//                 productionMode: 'Orgánico', plantingDate: '2025-09-01'
//             }
//         },
//         { 
//             id: 'GH002', 
//             name: 'Invernadero Oeste', 
//             currentCrop: 'Tomate',
//             config: { 
//                 goal: 2500, deadline: '2025-12-15', area: 4.0, 
//                 variety: 'Cherry', size: 'Pequeño', endDate: '2026-01-10',
//                 productionMode: 'Estándar', plantingDate: '2025-08-15'
//             }
//         },
//         { 
//             id: 'GH003', 
//             name: 'Invernadero Central', 
//             currentCrop: 'Pimiento',
//             config: { 
//                 goal: 1500, deadline: '2026-01-10', area: 1.8, 
//                 variety: 'California Wonder', size: 'Grande', endDate: '2026-02-01',
//                 productionMode: 'Convencional', plantingDate: '2025-10-01'
//             }
//         },
//     ]);

//     // Estado para el invernadero seleccionado
//     const [selectedGreenhouseId, setSelectedGreenhouseId] = useState('GH001');

//     // Datos del invernadero seleccionado
//     const selectedGreenhouse = greenhouses.find(g => g.id === selectedGreenhouseId);
//     const currentGreenhouseConfig = selectedGreenhouse ? selectedGreenhouse.config : {};
//     const currentCrop = selectedGreenhouse ? selectedGreenhouse.currentCrop : "Sin especificar"; 


    
    
//     // ... Cálculo de totalProduction ...
//     const totalProduction = Object.values(dailyData).reduce((sum, day) => {
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     // Función de actualización del estado global
//     const updateGreenhouseConfig = (id, newConfig) => {
//         setGreenhouses(prevGreenhouses => 
//             prevGreenhouses.map(gh => 
//                 gh.id === id 
//                     ? { ...gh, config: newConfig } 
//                     : gh
//             )
//         );
//         console.log(`Configuración del invernadero ${id} actualizada localmente.`);
//     };

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id);
//     };

//     // 💡 Nueva función para manejar el cambio en el selector de la tarjeta (si aplica)
//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (MOCK VISIBLE) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryDataMock.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (SIEMPRE VISIBLE) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* Columna 1 y 2 (Mapa y Tarjeta de Gestión) */}
//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={currentGreenhouseConfig}
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCrop} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             // 💡 PASAMOS LA LISTA Y EL HANDLER
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     {/* ... */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeContent;


import React from 'react'; 
import { BsDropletFill } from 'react-icons/bs';
import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componentes Requeridos
import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// Importa tus componentes de clima y actividades si los tienes
// import WeatherCard from './WeatherCard'; 
// import RecentActivities from './RecentActivities'; 

// --- Componente Auxiliar para las Tarjetas de Resumen (Se mantiene) ---
const SummaryCard = ({ title, value, unit, icon, color }) => (
    <motion.div
        className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
    >
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
                {value}
                <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
            </p>
        </div>
        <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
            {icon}
        </div>
    </motion.div>
);

// =======================================================================
// === HOME CONTENT PRINCIPAL (COMPLETO Y CORREGIDO)
// =======================================================================

const HomeContent = ({ 
    dailyData = {}, 
    greenhouses = [], 
    selectedGreenhouseId, 
    setSelectedGreenhouseId, 
    updateGreenhouseConfig, 
    
    // 🔑 PROP CLAVE DE CONFIGURACIÓN CARGADA DE FIREBASE
    greenhouseConfig = {}, 
}) => {
    
    // 1. Asignamos la configuración de Firebase a una variable local
    const config = greenhouseConfig; 

    // 2. Extracción de datos para usar en los componentes (con fallbacks seguros)
    const currentCropName = config.cropName || "Cultivo no asignado"; 
    
    // 3. Cálculo de Producción Total (se mantiene igual)
    const totalProduction = Object.values(dailyData).reduce((sum, day) => {
        const dayTotal = (day.items || []).reduce((itemSum, item) => 
            itemSum + parseFloat(item.result || 0), 0);
        return sum + dayTotal;
    }, 0);

    // 4. Datos Dinámicos para las Tarjetas Superiores (usando 'config' de Firebase)
    const summaryData = [
        { 
            title: `${currentCropName} Cosechado`, 
            value: totalProduction.toFixed(1), 
            unit: "Kg", 
            icon: <FaSeedling />, 
            color: "border-green-500" 
        },
        { 
            title: "Área Total", 
            value: config.plantedArea || "0.0", // Usar un campo de la configuración
            unit: config.plantedAreaUnit || "ha", 
            icon: <FaRulerCombined />, 
            color: "border-blue-500" 
        },
        { 
            title: "Riego Programado", 
            value: config.scheduledIrrigationTime || "0", // Usar un campo de la configuración
            unit: "horas", 
            icon: <BsDropletFill />, 
            color: "border-cyan-500" 
        },
        { 
            title: "Cargas Pendientes", 
            value: config.pendingLoads || "0", // Usar un campo de la configuración
            unit: "pendientes", 
            icon: <FaTruckLoading />, 
            color: "border-orange-500" 
        },
    ];

    // 5. Handlers para la selección del invernadero
    const handleMapSelect = (id) => {
        setSelectedGreenhouseId(id); 
    };

    const handleCardSelect = (e) => {
        setSelectedGreenhouseId(e.target.value);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            
            {/* 1. GRID PRINCIPAL - Resumen de datos clave (DINÁMICO) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryData.map((data, index) => (
                    <SummaryCard key={index} {...data} />
                ))}
            </div>

            {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna 1 y 2 (Mapa y Tarjeta de Gestión) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 2.1. MAPA */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
                        <div className="flex-grow">
                            <GreenhouseMap 
                                greenhouses={greenhouses} 
                                onGreenhouseSelect={handleMapSelect} 
                                selectedGreenhouseId={selectedGreenhouseId} 
                            />
                        </div>
                    </div>

                    {/* 2.2. SUB-GRID para Resumen y Gráfica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
                        <GreenhouseSummaryCard 
                            config={config} // ✅ Configuración de Firebase para DatosEstadisticosCard
                            totalProduction={totalProduction} 
                            currentCrop={currentCropName} 
                            selectedGreenhouseId={selectedGreenhouseId} 
                            updateGreenhouseConfig={updateGreenhouseConfig} // ✅ Handler para guardar en Firebase
                            greenhouses={greenhouses} 
                            onSelectGreenhouse={handleCardSelect}
                        />

                        {/* Espacio para Gráficas de Producción */}
                        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
                            <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
                        </div>
                    </div>
                </div>

                {/* Columna 3 (Pronóstico y Actividades) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
                        {/* <WeatherCard /> */}
                        <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
                        {/* <RecentActivities /> */}
                        <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;