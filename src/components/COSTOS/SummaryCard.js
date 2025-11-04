// import React, { useMemo } from 'react';
// import { FaCalculator, FaHourglassHalf, FaMoneyBillWave, FaListAlt } from 'react-icons/fa';

// // --- Componente de Tarjeta de Resumen ---
// const SummaryCard = ({ timesheets }) => {
    
//     // Calcula las métricas clave (Total de Horas y Coste)
//     const { totalHours, totalCost } = useMemo(() => {
//         if (!timesheets || timesheets.length === 0) {
//             return { totalHours: 0, totalCost: 0 };
//         }

//         const calculated = timesheets.reduce((acc, record) => {
//             // Asegúrate de que los campos numéricos existen antes de calcular
//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
            
//             acc.totalHours += hours;
//             acc.totalCost += hours * rate;

//             return acc;
//         }, { totalHours: 0, totalCost: 0 });

//         return {
//             totalHours: calculated.totalHours.toFixed(2),
//             totalCost: calculated.totalCost.toFixed(2)
//         };
//     }, [timesheets]); // Recalcula solo cuando los timesheets cambien

//     // Estilo base de la tarjeta (similar al LaborCostDashboard)
//     const cardStyle = "bg-white p-6 rounded-lg shadow-xl border-l-4 border-indigo-600";
    
//     return (
//         <div className={cardStyle}>
//             <div className="flex items-center justify-between mb-4 border-b pb-2">
//                 <h3 className="text-xl font-bold text-indigo-800 flex items-center">
//                     <FaCalculator className="mr-3 text-2xl"/> 📊 Resumen de Costes de Mano de Obra
//                 </h3>
//                 <span className="text-sm text-gray-500">
//                     <FaListAlt className="inline mr-1"/> Registros: {timesheets.length}
//                 </span>
//             </div>

//             <div className="space-y-4">
//                 {/* Métrica 1: Total de Horas */}
//                 <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-md">
//                     <p className="text-sm font-semibold text-indigo-700 flex items-center">
//                         <FaHourglassHalf className="mr-3 text-xl"/> Horas Trabajadas Totales:
//                     </p>
//                     <span className="text-2xl font-extrabold text-indigo-900">
//                         {totalHours} h
//                     </span>
//                 </div>

//                 {/* Métrica 2: Coste Total Estimado */}
//                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-200">
//                     <p className="text-sm font-semibold text-red-700 flex items-center">
//                         <FaMoneyBillWave className="mr-3 text-xl"/> Coste Total Estimado:
//                     </p>
//                     <span className="text-2xl font-extrabold text-red-900">
//                         {totalCost} €
//                     </span>
//                 </div>
//             </div>

//             <div className="mt-4 text-xs text-gray-500 pt-3 border-t">
//                 <p>Este cálculo es un resumen de los {timesheets.length} registros mostrados abajo.</p>
//             </div>
//         </div>
//     );
// };

// export default SummaryCard;



// import React, { useMemo } from 'react';
// import { FaCalculator, FaHourglassHalf, FaMoneyBillWave, FaListAlt } from 'react-icons/fa';

// // --- Componente de Tarjeta de Resumen ---
// // CORRECCIÓN CLAVE: Asignar un valor por defecto (array vacío [])
// const SummaryCard = ({ timesheets = [] }) => {
//     
//     // Calcula las métricas clave (Total de Horas y Coste)
//     const { totalHours, totalCost } = useMemo(() => {
//         // Si timesheets es [], el bloque ya maneja el caso base.
//         if (timesheets.length === 0) {
//             return { totalHours: 0, totalCost: 0 };
//         }

//         const calculated = timesheets.reduce((acc, record) => {
//             // Asegúrate de que los campos numéricos existen antes de calcular
//             // También se recomienda verificar si 'record' es null o undefined, aunque es raro si viene de un array.
//             if (!record) return acc;
//             
//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             
//             acc.totalHours += hours;
//             acc.totalCost += hours * rate;

//             return acc;
//         }, { totalHours: 0, totalCost: 0 });

//         return {
//             totalHours: calculated.totalHours.toFixed(2),
//             totalCost: calculated.totalCost.toFixed(2)
//         };
//     }, [timesheets]); // Recalcula solo cuando los timesheets cambien

//     // Estilo base de la tarjeta (similar al LaborCostDashboard)
//     const cardStyle = "bg-white p-6 rounded-lg shadow-xl border-l-4 border-indigo-600";
//     
//     return (
//         <div className={cardStyle}>
//             <div className="flex items-center justify-between mb-4 border-b pb-2">
//                 <h3 className="text-xl font-bold text-indigo-800 flex items-center">
//                     <FaCalculator className="mr-3 text-2xl"/> 📊 Resumen de Costes de Mano de Obra
//                 </h3>
//                 <span className="text-sm text-gray-500">
//                     <FaListAlt className="inline mr-1"/> Registros: {timesheets.length} 
//                 </span>
//             </div>

//             <div className="space-y-4">
//                 {/* Métrica 1: Total de Horas */}
//                 <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-md">
//                     <p className="text-sm font-semibold text-indigo-700 flex items-center">
//                         <FaHourglassHalf className="mr-3 text-xl"/> Horas Trabajadas Totales:
//                     </p>
//                     <span className="text-2xl font-extrabold text-indigo-900">
//                         {totalHours} h
//                     </span>
//                 </div>

//                 {/* Métrica 2: Coste Total Estimado */}
//                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-200">
//                     <p className="text-sm font-semibold text-red-700 flex items-center">
//                         <FaMoneyBillWave className="mr-3 text-xl"/> Coste Total Estimado:
//                     </p>
//                     <span className="text-2xl font-extrabold text-red-900">
//                         {totalCost} €
//                     </span>
//                 </div>
//             </div>

//             <div className="mt-4 text-xs text-gray-500 pt-3 border-t">
//                 <p>Este cálculo es un resumen de los {timesheets.length} registros mostrados abajo.</p>
//             </div>
//         </div>
//     );
// };

// export default SummaryCard;


// import React, { useMemo } from 'react';
// import { FaUserFriends, FaSeedling, FaListCheck, FaTractor } from 'react-icons/fa6'; // Íconos actualizados

// // =======================================================================
// // === COMPONENTE SummaryCard (ADAPTADO AL ESTILO DE LA IMAGEN)
// // =======================================================================

// const SummaryCard = ({ timesheets = [] }) => {
    
//     // 1. CÁLCULO DE MÉTRICAS CLAVE (Contadores únicos)
//     const { 
//         totalHours, 
//         totalCost, 
//         workerCount, 
//         localCount, 
//         operationCount, 
//         machineryCount 
//     } = useMemo(() => {
//         let totalHours = 0;
//         let totalCost = 0;
        
//         // Usamos Sets para contar elementos únicos
//         const uniqueWorkers = new Set();
//         const uniqueLocals = new Set();
//         const uniqueOperations = new Set();
//         const uniqueMachinery = new Set();

//         timesheets.forEach(record => {
//             if (!record) return;

//             // Totales de Horas y Coste
//             const hours = record.totalHours || 0;
//             const rate = record.ratePerHour || 0;
//             totalHours += hours;
//             totalCost += hours * rate;

//             // Contadores Únicos
//             if (record.workerName) uniqueWorkers.add(record.workerName);
//             if (record.localName) uniqueLocals.add(record.localName);
//             if (record.operationName) uniqueOperations.add(record.operationName);
//             // Solo contamos maquinaria si el ID existe y no es nulo/vacío
//             if (record.machineryId && record.machineryId.trim() !== '') uniqueMachinery.add(record.machineryId);
//         });

//         return {
//             totalHours: totalHours.toFixed(2),
//             totalCost: totalCost.toFixed(2),
//             workerCount: uniqueWorkers.size,
//             localCount: uniqueLocals.size,
//             operationCount: uniqueOperations.size,
//             machineryCount: uniqueMachinery.size,
//         };
//     }, [timesheets]); 

//     // Definición de las tarjetas de contador
//     const counters = [
//         { 
//             title: "Trabajadores", 
//             count: workerCount, 
//             icon: FaUserFriends, 
//             color: "text-green-600",
//             image: ""
//         },
//         { 
//             title: "Cultivos", 
//             count: localCount, 
//             icon: FaSeedling, 
//             color: "text-amber-600",
//             image: ""
//         },
//         { 
//             title: "Operación", 
//             count: operationCount, 
//             icon: FaListCheck, 
//             color: "text-blue-600",
//             image: ""
//         },
//         { 
//             title: "Maquinaria", 
//             count: machineryCount, 
//             icon: FaTractor, 
//             color: "text-indigo-600",
//             image: ""
//         },
//     ];

//     return (
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             {/* 1. Encabezado */}
//             <div className="flex justify-between items-center mb-6 border-b pb-3">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                     <span className="text-green-600 mr-2 text-3xl">🕢</span> Horas de trabajo
//                 </h2>
//                 <span className="text-sm text-gray-500">Ayer</span>
//             </div>

//             {/* 2. Grid de Contadores (Similar al de la imagen) */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
//                 {counters.map((item) => (
//                     <div 
//                         key={item.title} 
//                         className={`text-center py-4 border-r-2 last:border-r-0 border-gray-100`}
//                     >
//                         <h3 className="text-sm font-semibold text-gray-600 mb-2">{item.title}</h3>
//                         <div className="flex justify-center items-center">
//                              {/* Icono de la Categoría */}
//                             <item.icon className={`text-xl mr-2 ${item.color}`} /> 
//                             {/* Contador */}
//                             <p className="text-3xl font-extrabold text-gray-900">{item.count}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* 3. Área de Totales y Mensaje (Inferior) */}
//             <div className="text-center pt-4 border-t border-gray-200">
//                 {timesheets.length > 0 ? (
//                     <>
//                         <p className="text-lg font-semibold text-gray-700 mb-2">
//                             Se efectuaron <span className="text-green-600 font-bold">{timesheets.length}</span> registros.
//                         </p>
//                         <div className="flex justify-center space-x-8 mt-3">
//                              <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-500">Horas Totales</span>
//                                 <span className="text-2xl font-extrabold text-green-700">{totalHours}h</span>
//                             </div>
//                             <div className="flex flex-col items-center">
//                                 <span className="text-sm text-gray-500">Coste Total (€)</span>
//                                 <span className="text-2xl font-extrabold text-red-700">{totalCost}€</span>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         <div className="mb-4">
//                            {/* Imagen simplificada del sombrero central */}
//                                                    </div>
//                         <p className="text-base text-green-600 font-semibold mb-2">
//                             Haga registros en Actividades de Campo &gt;
//                         </p>
//                         <p className="text-gray-500">Sin registros efectuados</p>

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

// export default SummaryCard; // Asegúrate de exportar este componente



import React, { useMemo, useState } from 'react';
import { 
    FaUserFriends, FaSeedling, FaListAlt, FaTools, // Iconos FA5
    FaClock, FaEuroSign 
} from 'react-icons/fa'; 
import {motion} from "framer-motion"

// =======================================================================
// === COMPONENTE SummaryCard (Profesional, Interactivo y Detallado)
// =======================================================================

const SummaryCard = ({ timesheets = [] }) => {
    // Estado para la categoría activa, inicializado en 'Trabajadores'
    const [activeCategory, setActiveCategory] = useState('Trabajadores');

    const { 
        totalHours, 
        totalCost, 
        workerDetails, // Ahora guardamos los nombres para mostrar
        localDetails, 
        operationDetails, 
        machineryDetails 
    } = useMemo(() => {
        let totalHours = 0;
        let totalCost = 0;
        
        // Usamos Sets para obtener nombres únicos para los detalles
        const uniqueWorkers = new Set();
        const uniqueLocals = new Set();
        const uniqueOperations = new Set();
        const uniqueMachinery = new Set();

        timesheets.forEach(record => {
            if (!record) return;

            const hours = record.totalHours || 0;
            const rate = record.ratePerHour || 0;
            totalHours += hours;
            totalCost += hours * rate;

            if (record.workerName) uniqueWorkers.add(record.workerName);
            if (record.localName) uniqueLocals.add(record.localName);
            if (record.operationName) uniqueOperations.add(record.operationName);
            // Solo contamos maquinaria si el ID existe y no es nulo/vacío
            if (record.machineryId && record.machineryId.trim() !== '') uniqueMachinery.add(record.machineryId);
        });

        return {
            totalHours: totalHours, 
            totalCost: totalCost, 
            workerDetails: Array.from(uniqueWorkers), // Convertir Set a Array
            localDetails: Array.from(uniqueLocals),
            operationDetails: Array.from(uniqueOperations),
            machineryDetails: Array.from(uniqueMachinery),
        };
    }, [timesheets]); 

    // Definición de las tarjetas de contador
    const counters = [
        { 
            title: "Trabajadores", 
            count: workerDetails.length, 
            icon: FaUserFriends, 
            color: "text-green-600",
            details: workerDetails, // Asociar los detalles
        },
        { 
            title: "Cultivos", 
            count: localDetails.length, 
            icon: FaSeedling, 
            color: "text-amber-600",
            details: localDetails,
        },
        { 
            title: "Operación", 
            count: operationDetails.length, 
            icon: FaListAlt, 
            color: "text-blue-600",
            details: operationDetails,
        },
        { 
            title: "Maquinaria", 
            count: machineryDetails.length, 
            icon: FaTools, 
            color: "text-indigo-600",
            details: machineryDetails,
        },
    ];

    // Obtener los detalles de la categoría activa
    const activeDetails = counters.find(c => c.title === activeCategory)?.details || [];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
            {/* 1. Encabezado */}
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaClock className="text-green-500 mr-3 text-3xl"/> Horas de Trabajo
                </h2>
                <span className="text-sm text-gray-500 font-medium">Últimos Registros</span>
            </div>

            {/* 2. Grid de Contadores Interactivos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {counters.map((item) => (
                    <div 
                        key={item.title} 
                        // Estilos de la tarjeta interactiva
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

            {/* 3. Área de Detalles y Mensaje (Inferior) */}
            <div className="pt-6 border-t-2 border-gray-100">
                {timesheets.length > 0 ? (
                    <>
                        {/* Detalles de la Categoría Activa */}
                        <motion.div 
                            key={activeCategory} // Clave para la animación de cambio de contenido
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
                        >
                            <h4 className="text-lg font-bold text-blue-800 mb-3">
                                <span className="mr-2">✨</span> {activeCategory}:
                            </h4>
                            {activeDetails.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-700">
                                    {activeDetails.map((detail, index) => (
                                        <li key={index} className="flex items-center text-sm">
                                            <span className="text-blue-500 mr-2">●</span> {detail}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 italic">No hay {activeCategory.toLowerCase()} registrados aún.</p>
                            )}
                        </motion.div>

                        {/* Totales Generales */}
                        <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-inner">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600 font-medium">Horas Totales</span>
                                <span className="text-3xl font-extrabold text-green-700 mt-1">{totalHours.toFixed(2)}h</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600 font-medium">Coste Total Estimado</span>
                                <span className="text-3xl font-extrabold text-red-700 mt-1 flex items-center">
                                    <FaEuroSign className='text-2xl mr-1'/> {totalCost.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mensaje cuando no hay registros */}
                        <div className="mb-6 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                            <img src="https://via.placeholder.com/60/cccccc/ffffff?text=🧑‍🌾" alt="Hat icon" className="w-16 h-16 mb-4 opacity-70"/>
                            <p className="text-xl text-green-700 font-bold mb-3">
                                Haga registros en Actividades de Campo &gt;
                            </p>
                            <p className="text-gray-600 text-sm">Aún no hay registros de trabajo para mostrar.</p>
                        </div>

                        {/* Totales por defecto si no hay registros */}
                        <div className="flex justify-between items-end mt-4 text-xs">
                            <span className="text-gray-500">Cultivos</span>
                            <div>
                                <span className="text-gray-500 mr-2">Valor promedio</span>
                                <span className="text-xl font-bold text-gray-800">0h00</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-blue-500 mr-1">• Total</span>
                                <span className="text-xl font-bold text-gray-800">00h00</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;