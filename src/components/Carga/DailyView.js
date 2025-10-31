// src/components/DailyView.js

import React, { useState } from 'react';
// 🛑 NECESITAS ESTOS COMPONENTES 🛑
import CostEditForm from '../../components/CostEditForm1'; 
import { formatNumber, calculateCosts, HOURLY_COST_RATE } from '../../Util/costCalculations'; 


const DailyView = ({ dateKey, dailyData, handleSave, handleDayClick: parentHandleDayClick }) => {
    
    // 1. Estado para manejar la vista localmente en DailyView: 
    // 'day_view' (normal) o 'cost_edit' (formulario de costos)
    const [currentView, setCurrentView] = useState('day_view');

    // Función que DailyView usa para notificar a Tarea.js (el padre) que cambie la vista
    // A diferencia de la lógica anterior, Tarea.js debe manejar el cambio de vista,
    // por lo que usamos el prop handleDayClick (renombrado como parentHandleDayClick).
    
    // Función para manejar clics internos y delegar al padre si es necesario
    const handleViewChange = (targetView) => {
        // Llama a la función del padre para cambiar la vista en Tarea.js
        parentHandleDayClick(dateKey, targetView);
    };

    // --- RENDERIZADO CONDICIONAL: SI ESTAMOS EN MODO EDICIÓN ---
    if (currentView === 'cost_edit') {
        return (
            <CostEditForm 
                dateKey={dateKey}
                dailyData={dailyData}
                // Al guardar/cancelar, llamamos al padre para volver a la vista diaria
                handleDayClick={handleViewChange} 
                handleSave={handleSave}          
            />
        );
    }

    // --- OBTENER Y CALCULAR DATOS ---
    const dayData = dailyData[dateKey] || {};
    const totalDayCost = calculateCosts(dayData);
    
    // Simulación de horas totales para el cálculo de costos de mano de obra
    const totalHours = dayData.totalHours || 8; 

    // --- VISTA NORMAL ('day_view') ---
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">
                Detalle de Producción: {dateKey}
            </h2>
            
            {/* Sección de Resumen de Costos (¡El resultado de la edición!) */}
            <div className="bg-teal-50 p-6 rounded-xl shadow-inner mb-8">
                <h3 className="text-xl font-bold text-teal-700 mb-4">Resumen de Costos Estimados</h3>
                <div className="grid grid-cols-2 gap-4 text-lg">
                    <p>Costo de Materiales:</p>
                    <p className="font-semibold text-right">{formatNumber(dayData.costs?.materialCost)}</p>
                    
                    <p>Costo Indirecto (Overhead):</p>
                    <p className="font-semibold text-right">{formatNumber(dayData.costs?.overheadCost)}</p>
                    
                    <p>Costo de Mano de Obra ({totalHours}h x {formatNumber(HOURLY_COST_RATE)}):</p>
                    <p className="font-semibold text-right">{formatNumber(totalHours * HOURLY_COST_RATE)}</p>
                    
                    <div className="col-span-2 border-t mt-2 pt-2 flex justify-between font-bold text-xl text-teal-800">
                        <span>COSTO TOTAL DEL DÍA:</span>
                        <span>{formatNumber(totalDayCost)}</span>
                    </div>
                </div>
            </div>

            {/* Opciones del Día */}
            <div className="mt-10 p-5 bg-white rounded-xl shadow-lg border-l-4 border-teal-600">
                <h3 className="text-xl font-bold text-gray-700 flex items-center mb-4">
                    ⚙️ Acciones
                </h3>
                
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-4 md:space-y-0">
                    
                    {/* Botón de Volver al Calendario */}
                    <button 
                        onClick={() => handleViewChange('calendar')} 
                        className="flex-1 py-3 px-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition shadow-md"
                    >
                        Volver al Calendario
                    </button>
                    
                    {/* ✅ BOTÓN DE COSTOS: Cambia la vista A MODO EDICIÓN ✅ */}
                    <button 
                        onClick={() => setCurrentView('cost_edit')} 
                        className="flex-1 py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-md"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.111 0 2-.898 2-2s-.889-2-2-2m0 16c1.111 0 2-.898 2-2s-.889-2-2-2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            **Editar Costos**
                        </span>
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default DailyView;