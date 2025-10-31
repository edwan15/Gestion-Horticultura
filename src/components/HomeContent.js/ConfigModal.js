// src/Pages/produccionC/ConfigModal.jsx

import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaSeedling, FaCalendarAlt, FaRulerCombined, FaTag, FaArrowsAltH } from 'react-icons/fa';

// Uso de console.error/log en lugar de 'toast' mock
const toast = { error: (msg) => console.error("TOAST ERROR:", msg), success: (msg) => console.log("TOAST SUCCESS:", msg) }; 

// ====================================================================
// COMPONENTE AUXILIAR FORMROW (Separado para evitar errores de ámbito)
// ====================================================================
const FormRow = ({ title, stateValue, setState, icon: Icon, type = "text", unit = "" }) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
        <Icon className="text-xl text-indigo-500 sm:w-6" />
        <label className="font-medium sm:w-36">{title}:</label>
        <div className="flex-1 flex items-center">
            <input 
                type={type} 
                value={stateValue} 
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 border rounded focus:ring-indigo-500 text-gray-800"
            />
            {unit && <span className="ml-2 text-gray-500">{unit}</span>}
        </div>
    </div>
);


// ====================================================================
// 2. COMPONENTE PRINCIPAL (ConfigModal) - SIN PORTAL, Z-INDEX ALTO
// ====================================================================

const ConfigModal = ({ isOpen, onClose, currentConfig, selectedGreenhouseId, updateGreenhouseConfig, currentCrop }) => {

    // ESTADO LOCAL DEL FORMULARIO
    const [goal, setGoal] = useState(currentConfig.goal || 0);
    const [deadline, setDeadline] = useState(currentConfig.deadline || '');
    const [area, setArea] = useState(currentConfig.area || 0);
    const [variety, setVariety] = useState(currentConfig.variety || '');
    const [size, setSize] = useState(currentConfig.size || '');
    const [endDate, setEndDate] = useState(currentConfig.endDate || '');

    // Sincronización al abrir
    useEffect(() => {
        if (isOpen) {
            setGoal(currentConfig.goal || 0);
            setDeadline(currentConfig.deadline || '');
            setArea(currentConfig.area || 0);
            setVariety(currentConfig.variety || '');
            setSize(currentConfig.size || '');
            setEndDate(currentConfig.endDate || '');
        }
    }, [isOpen, currentConfig]);

    if (!isOpen) return null; 

    // Lógica de Guardado
    const handleSave = () => {
        // ... (Validación y actualización) ...
        if (!selectedGreenhouseId) {
             toast.error("Selecciona un invernadero para guardar.");
             return;
        }

        const newGoal = parseFloat(goal);
        const newArea = parseFloat(area);
        
        if (isNaN(newGoal) || newGoal < 0 || isNaN(newArea) || newArea < 0) {
            toast.error("La Meta y el Área deben ser números positivos.");
            return;
        }

        const updatedConfig = {
            goal: newGoal,
            deadline: deadline,
            area: newArea,
            variety: variety,
            size: size,
            endDate: endDate,
        };

        updateGreenhouseConfig(selectedGreenhouseId, updatedConfig);
        toast.success("Configuración actualizada.");
        onClose(); 
    };

    return (
        // 🚨 AQUÍ EL Z-INDEX MÁXIMO
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                
                {/* Header del Modal */}
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-indigo-700">
                        Editar Configuración: {currentCrop}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Cuerpo del Formulario */}
                <div className="p-6 space-y-6">
                    
                    <h3 className="text-xl font-semibold text-gray-700 border-b pb-1">Metas y Medidas</h3>
                    <FormRow icon={FaSeedling} title="Meta de Producción" stateValue={goal} setState={setGoal} type="number" unit="Kg" />
                    <FormRow icon={FaRulerCombined} title="Área Total" stateValue={area} setState={setArea} type="number" unit="Ha" />
                    
                    <h3 className="text-xl font-semibold text-gray-700 border-b pb-1 pt-4">Detalles del Cultivo</h3>
                    <FormRow icon={FaTag} title="Variedad" stateValue={variety} setState={setVariety} />
                    <FormRow icon={FaArrowsAltH} title="Tamaño/Calibre" stateValue={size} setState={setSize} />

                    <h3 className="text-xl font-semibold text-gray-700 border-b pb-1 pt-4">Fechas Clave</h3>
                    <FormRow icon={FaCalendarAlt} title="Fecha Límite Cosecha" stateValue={deadline} setState={setDeadline} type="date" />
                    <FormRow icon={FaCalendarAlt} title="Fecha Fin de Ciclo" stateValue={endDate} setState={setEndDate} type="date" />

                </div>

                {/* Footer del Modal (Botones de Acción) */}
                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
                    <button 
                        onClick={onClose} 
                        className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                    >
                        <FaSave /> <span>Guardar Configuración</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal;