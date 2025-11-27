// ProgressBarItem.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBarItem = ({ name, weight, totalValue, stockPercentage }) => {
    // Calculamos el porcentaje, asegurando que no pase de 100% y sea al menos 0%.
    const percentage = Math.max(0, Math.min(100, stockPercentage));
    
    // Define el color de la barra (ej. azul para stock)
    const barColor = "bg-blue-500"; 

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            {/* Título y Valor */}
            <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span className="font-semibold">{name} {weight}</span>
                <span className="font-bold text-gray-800">{totalValue} €</span>
            </div>
            
            {/* Barra de Progreso */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
                    className={`${barColor} h-2.5 rounded-full`} 
                    // Se usa `style` para aplicar el valor calculado de porcentaje
                    style={{ width: `${percentage}%` }}
                />
            </div>
            
            {/* Opcional: Mostrar el porcentaje bajo la barra */}
            <p className="text-xs text-gray-500 mt-1 text-right">{percentage.toFixed(0)}% del stock ideal</p>
        </motion.div>
    );
};

export default ProgressBarItem;