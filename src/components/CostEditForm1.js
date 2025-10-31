// src/components/CostEditForm.js

import React, { useState, useMemo } from 'react';
// Importa las utilidades del archivo creado
import { 
    formatNumber, 
    calculateCosts, 
    HOURLY_COST_RATE 
} from '../Util/costCalculations'; 

// Intenta importar 'motion' de framer-motion si está instalado. Si no, usa 'div' estándar.
let motion = { div: 'div' };
try {
    motion = require('framer-motion');
} catch (e) {
    // framer-motion no está disponible, se usa div estándar
}
const MotionDiv = motion.div;


// =======================================================
// 🛠️ Componente Auxiliar InputField
// =======================================================
const InputField = ({ label, type, value, field, handleChange, placeholder }) => (
    <div className="flex flex-col space-y-1">
        <label htmlFor={field} className="block text-sm font-semibold text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={field}
            name={field}
            // Permite que el input esté vacío visualmente si el valor es 0
            value={value === 0 || value === null || value === undefined ? "" : value}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150 ease-in-out text-base font-medium text-gray-800"
            placeholder={placeholder}
            // Permite decimales en Horas Trabajadas
            step={field === "hoursWorked" ? "0.1" : "1"}
            min="0"
        />
    </div>
);


// =======================================================
// 🛠️ Componente Principal CostEditForm
// =======================================================
const CostEditForm1 = ({
    dateKey,
    dailyData,
    handleDayClick, // Para volver a la vista del día
    handleSave,     // Función unificada de guardado (en App.js)
}) => {
    
    // --- Configuración de Animación (framer-motion) ---
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    // ---------------------------------------------------
    
    // Obtener datos existentes de forma segura
    const existingDayData = dailyData[dateKey] || {};
    const existingCostData = existingDayData.costData || {};
    
    // Calcular la producción total del día para el cálculo de costes
    const dailyTotalProduction = useMemo(() => {
        return existingDayData.items 
            ? existingDayData.items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0)
            : 0;
    }, [existingDayData.items]);

    // 1. Estado Local para la edición
    const [costState, setCostState] = useState({
        // Inicializa con los valores guardados o cadenas vacías
        numWorkers: existingCostData.numWorkers?.toString() || '',
        hoursWorked: existingCostData.hoursWorked?.toString() || '',
    });

    const [isSaving, setIsSaving] = useState(false);

    // 2. Valores parseados para el cálculo
    const numWorkers = parseFloat(costState.numWorkers) || 0;
    const hoursWorked = parseFloat(costState.hoursWorked) || 0;

    // Recalcula los costes usando useMemo para optimización
    const { productionCostVariable, finalProductionCost } = useMemo(() => {
        return calculateCosts(
            dailyTotalProduction,
            numWorkers,
            hoursWorked,
        );
    }, [dailyTotalProduction, numWorkers, hoursWorked]);


    // 3. Manejador de Cambios Local (Solo permite números o cadena vacía)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
             setCostState(prev => ({
                 ...prev,
                 [name]: value,
             }));
        }
    };
    
    // 4. Manejador de Guardado
    const handleSaveLocal = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // 🚨 Datos a guardar en Firebase dentro de la clave 'costData'
        const dataToSave = {
            numWorkers: numWorkers, 
            hoursWorked: hoursWorked,
            productionCostVariable: parseFloat(productionCostVariable), // Convertir de nuevo a número
            finalProductionCost: parseFloat(finalProductionCost),       // Convertir de nuevo a número
        };

        // Llama a la función de guardado unificada en el componente padre
        // Le pasamos el dayData completo y la data específica de costos
        await handleSave(dateKey, existingDayData.items, dataToSave);
        
        setIsSaving(false);
        // Volver a la vista del día después de guardar
        handleDayClick(dateKey, 'day_view');
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
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver a la vista del día
            </button>

            <h3 className="text-3xl font-extrabold text-teal-800 border-b-2 border-teal-200 pb-3 flex items-center">
                <svg className="w-8 h-8 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01M9 13h2m4-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m0 0h.01M17 19v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h.01"></path></svg>
                Coste de Producción: {dateKey}
            </h3>

            {/* Total del Día (Producción en Kg) */}
            <MotionDiv
                className="p-4 bg-indigo-50 rounded-xl shadow-lg border-l-4 border-indigo-500 flex justify-between items-center"
                variants={itemVariants}
                transition={{ delay: 0.1 }}
            >
                <div>
                    <p className="text-md font-medium text-indigo-700">Producción Total (Kg):</p>
                </div>
                <p className="text-3xl font-extrabold text-indigo-900">
                    {formatNumber(dailyTotalProduction)} Kg
                </p>
            </MotionDiv>

            <form onSubmit={handleSaveLocal} className="space-y-6">
                {/* Campos de Input */}
                <MotionDiv
                    className="grid grid-cols-2 gap-4"
                    variants={itemVariants}
                    transition={{ delay: 0.2 }}
                >
                    <InputField
                        label="👨‍🌾 N. Trabajadores"
                        type="number"
                        value={costState.numWorkers}
                        field="numWorkers"
                        handleChange={handleChange}
                        placeholder="Ejem: 5"
                    />
                    <InputField
                        label="⏱ H. Trabajadas (p/trabajador)"
                        type="number"
                        value={costState.hoursWorked}
                        field="hoursWorked"
                        handleChange={handleChange}
                        placeholder="Ejem: 8"
                    />
                </MotionDiv>

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
                        type="submit"
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
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                Guardar Costes
                            </>
                        )}
                    </button>
                </MotionDiv>
            </form>
        </MotionDiv>
    );
};

export default CostEditForm1;