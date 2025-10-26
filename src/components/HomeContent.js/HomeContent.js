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

import React, { useState } from 'react';
import { BsDropletFill, BsCalendarWeek } from 'react-icons/bs';
import { FaSeedling, FaTruckLoading } from 'react-icons/fa';
import { MdOutlineGrass, MdOutlineWbSunny } from 'react-icons/md';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

// 🚨 Importación clave del mapa
import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 

// =======================================================================
// === DATOS DE EJEMPLO REALES DEL USUARIO (MOCK)
// =======================================================================
const REAL_GREENHOUSE_MOCK_LIST = [
    { id: 'gh-1', name: "Invernadero #1", latitude: 37.824148, longitude: -0.942622, currentCrop: "Calabacín" },
    { id: 'gh-2', name: "Invernadero #2", latitude: 37.824639, longitude: -0.941077, currentCrop: "Tomate" },
    { id: 'gh-3', name: "Invernadero #3", latitude: 37.825182, longitude: -0.939897, currentCrop: "Pimiento" },
    { id: 'gh-4', name: "Invernadero #4", latitude: 37.826961, longitude: -0.940219, currentCrop: "Lechuga" },
    { id: 'gh-5', name: "Invernadero #5", latitude: 37.825588, longitude: -0.940841, currentCrop: "Berenjena" },
];
// =======================================================================

// --- Componente de Tarjeta de Resumen ---
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

// --- Componente de Tarjeta de Pronóstico (Weather Card) ---
const WeatherCard = ({ day, tempMax, tempMin, icon, bgColor }) => (
    <div className={`p-4 rounded-xl text-center shadow-md ${bgColor} text-white`}>
        <p className="font-semibold">{day}</p>
        <div className="text-4xl mx-auto my-2">{icon}</div>
        <p className="text-lg font-bold">{tempMax}°</p>
        <p className="text-sm opacity-80">{tempMin}°</p>
    </div>
);

// --- Componente principal del contenido de inicio ---
const HomeContent = ({ 
    greenhouseList = [], // Lista real de invernaderos de Firebase (si no hay, usamos el mock)
    selectedGreenhouseId = 'gh-1', 
    onGreenhouseChange = (id) => toast.success(`Seleccionado Invernadero ID: ${id}`)
}) => {
    
    // 🚨 USO DE DATOS: Si Firebase devuelve datos, los usamos. Si no, usamos el mock con las 5 coordenadas reales.
    const currentGreenhouseList = greenhouseList.length > 0 ? greenhouseList : REAL_GREENHOUSE_MOCK_LIST;
    
    // Funciones y datos que ya tenías
    const summaryData = [
        { title: "Calabacín Cosechado", value: "850", unit: "Kg", icon: <FaSeedling />, color: "border-green-500" },
        { title: "Área Total (Hectáreas)", value: "6.4", unit: "ha", icon: <MdOutlineGrass />, color: "border-blue-500" },
        { title: "Riego Programado", value: "4", unit: "horas", icon: <BsDropletFill />, color: "border-cyan-500" },
        { title: "Carga de Trailer", value: "2", unit: "pendientes", icon: <FaTruckLoading />, color: "border-orange-500" },
    ];

    const weatherForecast = [
        { day: "Hoy", tempMax: 28, tempMin: 19, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-500" },
        { day: "Sáb", tempMax: 29, tempMin: 20, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-400" },
        { day: "Dom", tempMax: 24, tempMin: 18, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-300" },
        { day: "Lun", tempMax: 26, tempMin: 17, icon: <MdOutlineWbSunny />, bgColor: "bg-blue-200" },
    ];

    const recentActivities = [
        { time: "10:30", type: "Riego", details: "Iniciado sector N-45, 120 minutos", status: "text-cyan-500" },
        { time: "09:00", type: "Observación", details: "Revisión fitosanitaria campo 2: OK", status: "text-green-500" },
        { time: "Ayer", type: "Carga", details: "Trailer 1 cargado con 850 Kg de Calabacín", status: "text-orange-500" },
    ];
    
    const handleMapSelect = (id) => {
        onGreenhouseChange(id);
    };


    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 sm:hidden">Resumen de Producción</h1>

            {/* 1. GRID PRINCIPAL - Resumen de datos clave (4 columnas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryData.map((data, index) => (
                    <SummaryCard key={index} {...data} />
                ))}
            </div>

            {/* 2. GRID SECUNDARIO - Mapa, Producción, Tiempo (2 columnas) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna 1 y 2 (Mapa y Espacio Principal) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* INTEGRACIÓN DEL MAPA */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Estado del Cultivo</h2>
                        <div className="h-[calc(100%-4rem)]">
                            <GreenhouseMap 
                                // Pasamos la lista con las 5 coordenadas
                                greenhouses={currentGreenhouseList} 
                                onGreenhouseSelect={handleMapSelect} 
                                selectedGreenhouseId={selectedGreenhouseId} 
                            />
                        </div>
                    </div>

                    {/* Espacio para Gráficas de Producción */}
                    <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
                         <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
                    </div>
                </div>

                {/* Columna 3 (Predicción del Tiempo y Actividades) */}
                <div className="space-y-6">
                    
                    {/* Predicción del Tiempo */}
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            Pronóstico Próximos Días <BsCalendarWeek className="text-blue-500"/>
                        </h2>
                        <div className="grid grid-cols-4 gap-2">
                            {weatherForecast.map((data, index) => (
                                <WeatherCard key={index} {...data} />
                            ))}
                        </div>
                    </div>

                    {/* Resumen de Actividades */}
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h2>
                        <div className="space-y-3">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start border-b pb-2 last:border-b-0">
                                    <div className={`text-xs font-semibold w-12 pt-1 ${activity.status}`}>{activity.time}</div>
                                    <div className="flex-1 ml-3">
                                        <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                                        <p className="text-xs text-gray-500">{activity.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;