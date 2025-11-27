import React, { useState, useMemo } from 'react';
// IMPORTACIONES NECESARIAS
import { FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';

// -------------------------------------------------------------------------
// --- 3. Componente de Resumen por Rango de Fechas (DateRangeSummary) ---
// -------------------------------------------------------------------------
const DateRangeSummary = ({ dailyData }) => {
    // 1. Estados para el rango de fechas
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Función de cálculo
    const calculateTotal = (start, end) => {
        // Valida que ambas fechas estén seleccionadas
        if (!start || !end) return { sum: '0.00', days: 0 };

        // Convertir fechas a timestamps para una comparación numérica confiable
        const startTimestamp = new Date(start + 'T00:00:00').getTime();
        const endTimestamp = new Date(end + 'T00:00:00').getTime();

        // Validar rango (Inicio no puede ser posterior a Fin)
        if (startTimestamp > endTimestamp) {
            // Nota: En un entorno real, usarías 'toast' para notificar. Aquí usamos 'alert' por simplicidad.
            console.error('La fecha de inicio no puede ser posterior a la fecha final.');
            return { sum: '0.00', days: 0, error: true };
        }

        let sum = 0;
        let daysWithRecords = 0;

        // Iterar sobre todos los días en dailyData
        for (const dateKey in dailyData) {
            // Convertir la clave de la fecha del registro a timestamp
            const dateTimestamp = new Date(dateKey + 'T00:00:00').getTime();

            // Verificar si la fecha está dentro del rango (inclusivo)
            if (dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp) {
                const dayRecords = dailyData[dateKey] || [];
                if (dayRecords.length > 0) {
                    daysWithRecords++;
                    // Sumar el M2 de todos los registros de ese día
                    const dayTotalM2 = dayRecords.reduce((daySum, item) => daySum + parseFloat(item.M2 || 0), 0);
                    sum += dayTotalM2;
                }
            }
        }

        return { sum: sum.toFixed(2), days: daysWithRecords, error: false };
    };

    // UseMemo para el cálculo del total (solo se recalcula si cambian las dependencias)
    const summary = useMemo(() => {
        return calculateTotal(startDate, endDate);
    }, [startDate, endDate, dailyData]);


    return (
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-indigo-200 mb-6">
            <h3 className="flex items-center text-xl font-bold text-indigo-700 mb-3 pb-2 border-b border-indigo-100">
                <FaChartBar className="mr-2 text-indigo-500" /> Resumen de Rango
            </h3>

            {/* SELECCIÓN DE FECHAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                    <label htmlFor="start-date" className="flex items-center text-sm font-medium text-gray-700">
                        <FaCalendarAlt className="mr-1 text-gray-500" /> Fecha de Inicio
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        max={endDate || undefined} // Restricción visual: no puede ser mayor que la fecha final
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="end-date" className="flex items-center text-sm font-medium text-gray-700">
                        <FaCalendarAlt className="mr-1 text-gray-500" /> Fecha Final
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        min={startDate || undefined} // Restricción visual: no puede ser menor que la fecha inicial
                    />
                </div>
            </div>

            {/* RESULTADO DEL RESUMEN */}
            {(startDate && endDate && !summary.error) ? (
                <div className="mt-4 p-4 bg-indigo-50 border-2 border-indigo-300 rounded-xl shadow-inner text-center">
                    <p className="text-sm font-semibold text-indigo-800 uppercase">
                        Total de Producción en el Rango
                    </p>
                    <div className="flex items-center justify-center space-x-3 mt-2">
                        <GiWaterDrop className="text-4xl text-blue-500" />
                        <span className="text-4xl font-extrabold text-indigo-900">
                            {summary.sum}
                        </span>
                        <span className="text-xl font-semibold text-gray-600">
                            M²
                        </span>
                    </div>
                    <p className="text-xs italic text-gray-500 mt-2">
                        Se encontraron {summary.days} días con registros en el rango seleccionado.
                    </p>
                </div>
            ) : (
                <div className={`mt-4 p-4 text-center rounded-lg border ${summary.error ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`italic ${summary.error ? 'text-red-700 font-semibold' : 'text-gray-600'}`}>
                        {summary.error 
                            ? '🚨 La fecha de inicio debe ser anterior o igual a la final.' 
                            : 'Selecciona un rango de fechas para ver el total de M².'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default DateRangeSummary;