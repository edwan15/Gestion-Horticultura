// --- src/components/dashboard/UserSummaryWidgets.js ---
import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaRegCalendarCheck, FaEuroSign } from 'react-icons/fa'; 

// Datos de ejemplo para el Usuario estándar
const userMetrics = [
    { title: "Productos Registrados", value: "24", icon: FaBoxOpen, color: "bg-indigo-100 text-indigo-600", delay: 0 },
    { title: "Último Producto (días)", value: "7", icon: FaRegCalendarCheck, color: "bg-pink-100 text-pink-600", delay: 0.1 },
    { title: "Valor Estimado Total", value: "€5,200", icon: FaEuroSign, color: "bg-teal-100 text-teal-600", delay: 0.2 },
];

const UserSummaryWidgets = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {userMetrics.map((metric, index) => (
                <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: metric.delay }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">{metric.title}</div>
                        <div className={`p-3 rounded-full ${metric.color}`}>
                            <metric.icon className="text-xl"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-3xl font-bold text-gray-900">{metric.value}</h2>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default UserSummaryWidgets;