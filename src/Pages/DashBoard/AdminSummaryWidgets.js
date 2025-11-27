// // --- src/components/dashboard/AdminSummaryWidgets.js ---
// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaBoxes, FaUsers, FaArrowUp } from 'react-icons/fa'; 

// // Datos de ejemplo para el Admin
// const adminMetrics = [
//     { title: "Total Productos", value: "2,145", icon: FaBoxes, color: "bg-blue-100 text-blue-600", delay: 0 },
//     { title: "Total Fincas/Usuarios", value: "48", icon: FaUsers, color: "bg-green-100 text-green-600", delay: 0.1 },
//     { title: "Productos Creados Hoy", value: "12", icon: FaArrowUp, color: "bg-yellow-100 text-yellow-600", delay: 0.2 },
// ];

// const AdminSummaryWidgets = () => {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {adminMetrics.map((metric, index) => (
//                 <motion.div
//                     key={metric.title}
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: metric.delay }}
//                     className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-green-500 hover:shadow-2xl transition duration-300"
//                 >
//                     <div className="flex items-center justify-between">
//                         <div className="text-sm font-medium text-gray-500 uppercase">{metric.title}</div>
//                         <div className={`p-3 rounded-full ${metric.color}`}>
//                             <metric.icon className="text-xl"/>
//                         </div>
//                     </div>
//                     <div className="mt-4">
//                         <h2 className="text-3xl font-extrabold text-gray-900">{metric.value}</h2>
//                         <p className="text-xs text-gray-400 mt-1">Última actualización hace 5 minutos</p>
//                     </div>
//                 </motion.div>
//             ))}
//         </div>
//     );
// };

// export default AdminSummaryWidgets;


// --- src/components/dashboard/AdminSummaryWidgets.js ---
import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxes, FaUsers, FaArrowUp, FaChartLine } from 'react-icons/fa'; 

// Datos de ejemplo para el Admin
const adminMetrics = [
    { 
        title: "Total Productos", 
        value: "2,145", 
        icon: FaBoxes, 
        color: "bg-blue-600", 
        iconBg: "bg-blue-100", 
        delay: 0,
        borderColor: "border-blue-500" // Nuevo color de borde
    },
    { 
        title: "Total Fincas/Usuarios", 
        value: "48", 
        icon: FaUsers, 
        color: "bg-green-600", 
        iconBg: "bg-green-100", 
        delay: 0.1,
        borderColor: "border-green-500"
    },
    { 
        title: "Productos Creados Hoy", 
        value: "12", 
        icon: FaArrowUp, 
        color: "bg-yellow-600", 
        iconBg: "bg-yellow-100", 
        delay: 0.2,
        borderColor: "border-yellow-500"
    },
    { 
        title: "Stock Crítico Total", 
        value: "7", 
        icon: FaChartLine, 
        color: "bg-red-600", 
        iconBg: "bg-red-100", 
        delay: 0.3,
        borderColor: "border-red-500"
    },
];

const AdminSummaryWidgets = () => {
    return (
        // CAMBIO CLAVE: Usamos grid-cols-2 por defecto, luego grid-cols-3 en pantallas grandes
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminMetrics.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: metric.delay }}
                    // Estilo de tarjeta AMPLIA: p-5, rounded-xl, shadow-2xl
                    className={`bg-white p-5 rounded-2xl shadow-2xl border-l-4 ${metric.borderColor} hover:shadow-3xl hover:translate-y-[-2px] transition duration-300 w-full h-full`}
                >
                    <div className="flex items-start justify-between">
                        {/* Título */}
                        <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase leading-snug pr-2">
                            {metric.title}
                        </div>
                        {/* Ícono de Alto Impacto */}
                        <div className={`p-3 rounded-full ${metric.iconBg} flex-shrink-0`}>
                            <metric.icon className={`text-2xl ${metric.color.replace('bg-', 'text-')}`}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        {/* Valor Grande */}
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-none">
                            {metric.value}
                        </h2>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-2">Última actualización hace 5 minutos</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AdminSummaryWidgets;