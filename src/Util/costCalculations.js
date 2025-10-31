// src/utils/costCalculations.js

// --- Constantes Fijas ---
export const HOURLY_COST_RATE = 10; // Coste fijo por hora (€)

// --- Fórmulas y Utilidades ---

/**
 * Formatea un número a cadena con el número de decimales especificado,
 * usando la localización 'es-ES' (punto para miles, coma para decimales).
 * @param {number|string} num - El número a formatear.
 * @param {number} decimales - Número de decimales (por defecto 2).
 * @returns {string} El número formateado.
 */
export const formatNumber = (num, decimales = 2) => {
    if (num === null || num === undefined || isNaN(num)) return "0.00";
    return Number(num).toLocaleString("es-ES", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
        useGrouping: true,
    });
};

/**
 * Calcula el Coste Laboral Diario (variable) y el Coste de Producción Final (€/Kg).
 * Basado en las funciones extraídas de tu App.js
 * @param {number} dailyTotal - Producción total del día en Kg.
 * @param {number|string} numWorkers - Número de trabajadores.
 * @param {number|string} hoursWorked - Horas trabajadas por trabajador.
 * @returns {{productionCostVariable: string, finalProductionCost: string}} Los costos calculados.
 */
export const calculateCosts = (dailyTotal, numWorkers, hoursWorked) => {
    
    // Convertir a número y usar 0 si no es válido
    const numW = parseFloat(numWorkers) || 0;
    const hoursW = parseFloat(hoursWorked) || 0;
    const totalProduction = parseFloat(dailyTotal) || 0;
    
    // 1. Coste Laboral Diario (Variable)
    const dailyLaborCost = numW * hoursW * HOURLY_COST_RATE; 
    
    // productionCostVariable: Formato a 2 decimales (€ total)
    const productionCostVariable = dailyLaborCost.toFixed(2);

    // 2. Coste de Producción Final (€/Kg)
    let finalProductionCost = 0;
    if (totalProduction > 0) {
        // finalProductionCost: Formato a 4 decimales (€/Kg)
        finalProductionCost = (dailyLaborCost / totalProduction).toFixed(4); 
    }

    return { productionCostVariable, finalProductionCost };
};