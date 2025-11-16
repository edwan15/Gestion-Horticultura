// --- src/components/dashboard/AdminSummaryWidgets.js ---
import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxes, FaUsers, FaArrowUp } from 'react-icons/fa'; 

// Datos de ejemplo para el Admin
const adminMetrics = [
    { title: "Total Productos", value: "2,145", icon: FaBoxes, color: "bg-blue-100 text-blue-600", delay: 0 },
    { title: "Total Fincas/Usuarios", value: "48", icon: FaUsers, color: "bg-green-100 text-green-600", delay: 0.1 },
    { title: "Productos Creados Hoy", value: "12", icon: FaArrowUp, color: "bg-yellow-100 text-yellow-600", delay: 0.2 },
];

const AdminSummaryWidgets = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMetrics.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: metric.delay }}
                    className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-green-500 hover:shadow-2xl transition duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 uppercase">{metric.title}</div>
                        <div className={`p-3 rounded-full ${metric.color}`}>
                            <metric.icon className="text-xl"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-3xl font-extrabold text-gray-900">{metric.value}</h2>
                        <p className="text-xs text-gray-400 mt-1">Última actualización hace 5 minutos</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AdminSummaryWidgets;