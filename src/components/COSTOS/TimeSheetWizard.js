import React, { useState, useEffect, useMemo } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { auth } from '../../firebaseConfig'; 
import { FaUsers, FaTools, FaClock, FaSeedling, FaTruck, FaFileAlt, FaCheckCircle, FaLeaf, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// ------------------------------------
// --- FUNCIÓN DE ID DE APLICACIÓN ---
// ------------------------------------
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();

const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`;
const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
const MACHINERYS_COLLECTION_PATH = `artifacts/${appId}/public/data/machinery`;

const OPERATIONS = [
    { id: '01', name: 'Fumigar', emoji: '🌿' },
    { id: '02', name: 'Instalar riego', emoji: '💧' },
    { id: '03', name: 'Desmontar Riego', emoji: '🔧' },
    { id: '04', name: 'Riego', emoji: '💦' },
    { id: '05', name: 'Labores hierba', emoji: '🌱' },
    { id: '06', name: 'Labores plástico', emoji: '📦' },
    { id: '07', name: 'Entutorado / Poda', emoji: '✂️' },
    { id: '08', name: 'Trasplante/siembra', emoji: '🌾' },
    { id: '09', name: 'Recolección', emoji: '🧺' },
    { id: '10', name: 'Mantenimiento finca', emoji: '🛠️' },
    { id: '11', name: 'Ventilación Invernaderos', emoji: '🌬️' },
    { id: '12', name: 'Transporte mercancía', emoji: '🚚' },
    { id: '13', name: 'Traslado maquinaria', emoji: '🚜' },
    { id: '14', name: 'Preparación tierra', emoji: '🏗️' },
    { id: '15', name: 'Labores pre-trasplante', emoji: '🌿' },
    { id: '16', name: 'Desbrozar', emoji: '🪓' },
    { id: '17', name: 'Supervisión', emoji: '👁️' },
];

const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

// ------------------------------------
// --- COMPONENTES DE LOS PASOS ---
// ------------------------------------

// A. ProgressBar - MODERN ANIMATED VERSION
const ProgressBar = ({ currentStep }) => {
    const steps = [
        { name: 'Trabajadores', icon: FaUsers, step: 1 },
        { name: 'Operación', icon: FaTools, step: 2 },
        { name: 'Tiempo', icon: FaClock, step: 3 },
        { name: 'Cultivo', icon: FaSeedling, step: 5 },
        { name: 'Máquina', icon: FaTruck, step: 6 },
        { name: 'Resumen', icon: FaFileAlt, step: 7 },
    ];
    
    const currentIndex = steps.findIndex(s => s.step === currentStep);
    const progressPercentage = ((currentIndex + 1) / steps.length) * 100;
    
    return (
        <div className="relative mb-12">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            
            {/* Animated progress line */}
            <div 
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
                {steps.map((stepInfo, index) => {
                    const isActive = currentStep >= stepInfo.step;
                    const isCurrent = currentStep === stepInfo.step;
                    
                    return (
                        <div key={stepInfo.step} className="flex flex-col items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300 transform ${
                                isCurrent 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110 ring-4 ring-green-200 shadow-lg' 
                                    : isActive 
                                        ? 'bg-green-500 text-white shadow-md' 
                                        : 'bg-white text-gray-400 border-2 border-gray-300'
                            }`}>
                                <stepInfo.icon className="text-lg"/>
                            </div>
                            <span className={`mt-2 text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {stepInfo.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// B. Step 1: Selección de Trabajador - MODERN CARD DESIGN
const Step1_WorkerSelection = ({ workers, onSelect, formData, onNext }) => {
    const selectedCount = formData.workerIds.length;
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FaUsers className="text-white text-xl"/>
                    </div>
                    Selecciona Trabajadores
                </h2>
                {selectedCount > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="font-bold">{selectedCount}</span> seleccionado{selectedCount !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                {workers.map(worker => {
                    const isSelected = formData.workerIds.includes(worker.id);
                    return (
                        <button
                            key={worker.id}
                            onClick={() => onSelect(worker)}
                            className={`p-4 rounded-xl shadow-md transition-all duration-300 text-left transform hover:scale-105 ${
                                isSelected 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-300 shadow-xl' 
                                    : 'bg-white hover:shadow-xl text-gray-800 border border-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FaUsers className={`text-lg ${isSelected ? 'text-white' : 'text-green-600'}`}/>
                                <span className="font-bold">{worker.name}</span>
                            </div>
                            <span className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                {worker.ratePerHour} €/h
                            </span>
                        </button>
                    );
                })}
                {workers.length === 0 && (
                    <p className="col-span-4 text-center text-gray-500 py-8">
                        No hay trabajadores disponibles 🚧
                    </p>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={onNext} 
                    disabled={selectedCount === 0}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                        selectedCount > 0 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// C. Step 2: Selección de Operación - ICON-BASED CARDS
const Step2_OperationSelection = ({ operations, onSelect, onBack }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaTools className="text-white text-xl"/>
                </div>
                ¿Qué operación se realizó?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                {operations.map(op => (
                    <button
                        key={op.id}
                        onClick={() => onSelect(op)}
                        className="p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border border-gray-200"
                    >
                        <div className="text-2xl mb-2">{op.emoji}</div>
                        <div className="font-semibold text-gray-800 text-sm">{op.id}</div>
                        <div className="text-xs text-gray-600">{op.name}</div>
                    </button>
                ))}
                <button 
                    onClick={() => onSelect({ id: '98', name: 'Fertilizantes', emoji: '🌾' })}
                    className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 border border-yellow-300"
                >
                    <div className="text-2xl mb-2">🌾</div>
                    <div className="font-semibold text-gray-800 text-sm">98</div>
                    <div className="text-xs text-gray-700">Fertilizantes</div>
                </button>
                <button 
                    onClick={() => onSelect({ id: '99', name: 'Fitosanitarios', emoji: '🧪' })}
                    className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105 border border-blue-300"
                >
                    <div className="text-2xl mb-2">🧪</div>
                    <div className="font-semibold text-gray-800 text-sm">99</div>
                    <div className="text-xs text-gray-700">Fitosanitarios</div>
                </button>
            </div>
            
            <div className="flex justify-start pt-4">
                <button 
                    onClick={onBack} 
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        </div>
    );
};

// D. Step 3: Fecha, Horario y Pausas - 15 MIN INCREMENTS + MODERN DESIGN
const Step3_TimeAndDate = ({ formData, onChange, calculateHours, onBack, onNext }) => {
    
    // Helper para incrementar/decrementar tiempo en pasos de 15 minutos
    const adjustTime = (timeString, minutesDelta) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes + minutesDelta;
        
        // Manejar overflow/underflow
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
        
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    };
    
    const TimeSelector = ({ label, name, value, colorClass = "green" }) => {
        return (
            <div className={`bg-gradient-to-br from-${colorClass}-50 to-${colorClass}-100 p-6 rounded-2xl shadow-lg border-2 border-${colorClass}-200`}>
                <h3 className={`text-lg font-bold mb-4 text-${colorClass}-700`}>{label}</h3>
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => onChange(name, adjustTime(value, -15))}
                        className={`w-12 h-12 bg-${colorClass}-500 hover:bg-${colorClass}-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold`}
                    >
                        ▲
                    </button>
                    <div className={`text-5xl font-bold text-${colorClass}-700 bg-white px-6 py-3 rounded-xl shadow-inner min-w-[140px] text-center`}>
                        {value}
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange(name, adjustTime(value, 15))}
                        className={`w-12 h-12 bg-${colorClass}-600 hover:bg-${colorClass}-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold`}
                    >
                        ▼
                    </button>
                </div>
                <p className="text-center mt-3 text-xs text-gray-600">Incrementos de 15 minutos</p>
            </div>
        );
    };
    
    const BreakSelector = () => {
        const breakTime = `${formData.breakHours}:${formData.breakMinutes}`;
        
        const adjustBreak = (delta) => {
            const totalMinutes = Number(formData.breakHours) * 60 + Number(formData.breakMinutes) + delta;
            const clampedMinutes = Math.max(0, Math.min(totalMinutes, 12 * 60)); // Max 12 horas de pausa
            
            const newHours = Math.floor(clampedMinutes / 60);
            const newMinutes = clampedMinutes % 60;
            
            onChange('breakHours', String(newHours).padStart(2, '0'));
            onChange('breakMinutes', String(newMinutes).padStart(2, '0'));
        };
        
        return (
            <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                <h3 className="text-lg font-bold mb-4 text-orange-700">Pausas / Descansos</h3>
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => adjustBreak(-15)}
                        className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold"
                    >
                        ▲
                    </button>
                    <div className="text-5xl font-bold text-orange-700 bg-white px-6 py-3 rounded-xl shadow-inner min-w-[140px] text-center">
                        {breakTime}
                    </div>
                    <button
                        type="button"
                        onClick={() => adjustBreak(15)}
                        className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold"
                    >
                        ▼
                    </button>
                </div>
                <p className="text-center mt-3 text-xs text-gray-600">Incrementos de 15 minutos</p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaClock className="text-white text-xl"/>
                </div>
                Fecha, Horario y Pausas
            </h2>

            {/* Fecha */}
            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                <label className="block text-lg font-bold text-blue-700 mb-3">📅 Fecha de la Tarea</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    className="w-full md:w-1/2 p-3 border-2 border-blue-300 rounded-xl text-lg font-semibold focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    required
                />
            </div>
            
            {/* Horarios */}
            <div className="grid md:grid-cols-2 gap-6">
                <TimeSelector label="⏰ Hora de Inicio" name="startTime" value={formData.startTime} colorClass="green" />
                <TimeSelector label="⏰ Hora Final" name="endTime" value={formData.endTime} colorClass="emerald" />
            </div>

            {/* Pausas */}
            <BreakSelector />
            
            {/* Resumen de horas */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Horas Trabajadas Netas</p>
                    <p className="text-6xl font-extrabold">{calculateHours.workedHours.toFixed(2)} h</p>
                    <p className="text-sm mt-2 opacity-90">Pausas: {calculateHours.breakDuration.toFixed(2)} h</p>
                </div>
            </div>
            
            <div className="flex justify-between pt-4">
                <button 
                    onClick={onBack} 
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={onNext} 
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105" 
                    disabled={calculateHours.workedHours <= 0}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// E. Step 5: Local/Cultivo - CLEAN CARD LAYOUT
const Step5_LocalSelection = ({ locals, onSelect, formData, onBack }) => {
    const selected = formData.localId;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaSeedling className="text-white text-xl"/>
                </div>
                ¿Dónde se realizó la tarea?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                {locals.map(local => (
                    <button
                        key={local.id}
                        onClick={() => onSelect(local)}
                        className={`p-4 rounded-xl shadow-md transition-all duration-300 text-left transform hover:scale-105 ${
                            selected === local.id 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-300 shadow-xl' 
                                : 'bg-white hover:shadow-xl text-gray-800 border border-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <FaLeaf className={`text-lg ${selected === local.id ? 'text-white' : 'text-green-600'}`}/>
                            <span className="font-bold">{local.name}</span>
                        </div>
                        <span className={`text-xs ${selected === local.id ? 'text-green-100' : 'text-gray-500'}`}>
                            {local.type || 'Local'}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <button 
                    onClick={onBack} 
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={() => onSelect({id: '', name: 'General'})} 
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                    Saltar / Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// F. Step 6: Maquinaria - ORANGE GRADIENT CARDS
const Step6_MachinerySelection = ({ machineryList, onSelect, formData, setCurrentStep }) => {
    const selected = formData.machineryId;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaTruck className="text-white text-xl"/>
                </div>
                ¿Maquinaria utilizada?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button
                    onClick={() => onSelect(null)}
                    className={`p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                        selected === null 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 shadow-xl' 
                            : 'bg-white hover:shadow-xl text-gray-800 border-2 border-gray-200'
                    }`}
                >
                    <FaCheckCircle className={`text-2xl mb-2 ${selected === null ? 'text-white' : 'text-blue-500'}`}/>
                    <div className="font-bold">Sin Maquinaria</div>
                    <div className={`text-xs mt-1 ${selected === null ? 'text-blue-100' : 'text-gray-500'}`}>
                        No se utilizó maquinaria
                    </div>
                </button>
                
                {machineryList.map(machine => (
                    <button
                        key={machine.id}
                        onClick={() => onSelect(machine.id)}
                        className={`p-6 rounded-xl shadow-md transition-all duration-300 text-left transform hover:scale-105 ${
                            selected === machine.id 
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-300 shadow-xl' 
                                : 'bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl text-gray-800 border-2 border-orange-200'
                        }`}
                    >
                        <FaTruck className={`text-2xl mb-2 ${selected === machine.id ? 'text-white' : 'text-orange-600'}`}/>
                        <div className="font-bold">{machine.name}</div>
                        <div className={`text-xs mt-1 ${selected === machine.id ? 'text-orange-100' : 'text-gray-600'}`}>
                            Placa: {machine.plate || 'N/A'}
                        </div>
                    </button>
                ))}
            </div>

            {machineryList.length === 0 && selected === null && (
                <p className="text-center text-gray-500 py-8">
                    No hay maquinaria configurada 🚧
                </p>
            )}

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setCurrentStep(5)}
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={() => onSelect(formData.machineryId)} 
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// G. Step 7: Resumen - COLOR-CODED INFORMATION CARDS
const Step7_Summary = ({ formData, calculateHours, onSave, workers, setCurrentStep }) => {
    
    const selectedWorkers = workers.filter(w => formData.workerIds.includes(w.id));
    const workerNames = selectedWorkers.map(w => w.name).join(', ');
    const workerRate = selectedWorkers[0]?.ratePerHour || 0; 
    const costPerWorker = (calculateHours.workedHours * parseFloat(workerRate)).toFixed(2);
    const totalCost = (calculateHours.workedHours * parseFloat(workerRate) * selectedWorkers.length).toFixed(2);
    const machineryName = formData.machineryId ? `ID Máquina: ${formData.machineryId}` : 'Ninguna';
    
    const InfoCard = ({ label, value, color = "gray", icon }) => (
        <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 border-${color}-500`}>
            <div className="flex items-start gap-3">
                {icon && <div className={`text-2xl text-${color}-500`}>{icon}</div>}
                <div className="flex-1">
                    <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
                    <div className="text-lg font-bold text-gray-800">{value}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaFileAlt className="text-white text-xl"/>
                </div>
                Resumen de Tarea
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <InfoCard 
                    label="Trabajadores Seleccionados" 
                    value={`${selectedWorkers.length} - ${workerNames}`} 
                    color="green"
                    icon="👥"
                />
                <InfoCard 
                    label="Operación" 
                    value={`${formData.operationId} - ${formData.operationName}`} 
                    color="blue"
                    icon="🛠️"
                />
                <InfoCard 
                    label="Local / Cultivo" 
                    value={formData.localName || 'General'} 
                    color="emerald"
                    icon="🌱"
                />
                <InfoCard 
                    label="Fecha" 
                    value={formData.date} 
                    color="yellow"
                    icon="📅"
                />
                <InfoCard 
                    label="Horario" 
                    value={`${formData.startTime} - ${formData.endTime}`} 
                    color="purple"
                    icon="⏰"
                />
                <InfoCard 
                    label="Maquinaria" 
                    value={machineryName} 
                    color="orange"
                    icon="🚜"
                />
            </div>

            {/* Resumen de costos */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl text-white">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-sm opacity-90 mb-2">Horas Trabajadas</p>
                        <p className="text-4xl font-extrabold">{calculateHours.workedHours.toFixed(2)} h</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-2">Costo por Trabajador</p>
                        <p className="text-4xl font-extrabold">{costPerWorker} €</p>
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-sm opacity-90 mb-2">COSTO TOTAL</p>
                        <p className="text-5xl font-extrabold">{totalCost} €</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    🔄 Nuevo Registro
                </button>
                <button
                    onClick={onSave}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 text-lg"
                >
                    <FaCheckCircle /> Guardar {selectedWorkers.length} Registros
                </button>
            </div>
        </div>
    );
};

// ------------------------------------
// --- COMPONENTE PRINCIPAL (WIZARD) ---
// ------------------------------------

const TimeSheetWizard = ({ db, userId, setErrorMessage, availableLocals = [] }) => {
    
    const initialData = {
        workerIds: [],
        workerNames: [],
        operationId: '',
        operationName: '',
        date: formatDate(new Date()),
        startTime: '09:00',
        endTime: '18:00',
        breakHours: '00',
        breakMinutes: '00',
        localId: '',
        localName: '',
        machineryId: null,
        totalHours: 9.00,
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialData);
    const [workers, setWorkers] = useState([]);
    const [machineryList, setMachineryList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !userId) return;

        const qWorkers = query(collection(db, WORKERS_COLLECTION_PATH), where("createdBy", "==", userId));
        const unsubscribeWorkers = onSnapshot(qWorkers, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkers(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading workers:", error);
            setErrorMessage({ message: "Error al cargar la lista de trabajadores.", type: 'error' });
            setLoading(false);
        });
        
        const qMachinery = query(collection(db, MACHINERYS_COLLECTION_PATH), where("createdBy", "==", userId));
        const unsubscribeMachinery = onSnapshot(qMachinery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMachineryList(data);
        }, (error) => {
            console.error("Error loading machinery:", error);
        });

        return () => {
            unsubscribeWorkers();
            unsubscribeMachinery();
        };
    }, [db, userId, setErrorMessage]);

    const calculateHours = useMemo(() => {
        const start = formData.startTime.split(':').map(Number);
        const end = formData.endTime.split(':').map(Number);

        const startMinutes = start[0] * 60 + start[1];
        let endMinutes = end[0] * 60 + end[1];

        if (endMinutes < startMinutes) {
              endMinutes += (24 * 60);
        }

        let totalDurationMinutes = endMinutes - startMinutes;
        const breakTotalMinutes = (Number(formData.breakHours) * 60) + Number(formData.breakMinutes);
        const workedMinutes = totalDurationMinutes - breakTotalMinutes;
        const workedHours = workedMinutes / 60;
        
        return {
            totalDuration: totalDurationMinutes / 60,
            breakDuration: breakTotalMinutes / 60,
            workedHours: workedHours < 0 ? 0 : parseFloat(workedHours.toFixed(2)),
        };

    }, [formData.startTime, formData.endTime, formData.breakHours, formData.breakMinutes]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            totalHours: calculateHours.workedHours
        }));
    }, [calculateHours.workedHours]);

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleDataChange = (name, value) => {
        if (name === 'breakHours' || name === 'breakMinutes') {
              setFormData(prev => ({ ...prev, [name]: String(value).padStart(2, '0') }));
        } else {
              setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleWorkerSelect = (worker) => {
        setFormData(prev => {
            const isSelected = prev.workerIds.includes(worker.id);
            if (isSelected) {
                return {
                    ...prev,
                    workerIds: prev.workerIds.filter(id => id !== worker.id),
                    workerNames: prev.workerNames.filter(name => name !== worker.name),
                };
            } else {
                return {
                    ...prev,
                    workerIds: [...prev.workerIds, worker.id],
                    workerNames: [...prev.workerNames, worker.name],
                };
            }
        });
    };
    
    const handleOperationSelect = (operation) => {
        setFormData(prev => ({ ...prev, operationId: operation.id, operationName: operation.name }));
        handleNext();
    };

    const handleLocalSelect = (local) => {
        setFormData(prev => ({ ...prev, localId: local.id, localName: local.name }));
        handleNext();
    };

    const handleSave = async () => {
        setErrorMessage(null);

        if (formData.workerIds.length === 0) {
            setErrorMessage({ message: "❌ Debe seleccionar al menos un trabajador.", type: 'error' });
            return;
        }

        const isConfirmed = window.confirm(`¿Está seguro de que desea guardar ${formData.workerIds.length} registros de tiempo?`);
        if (!isConfirmed) return;

        try {
            const recordsToSave = formData.workerIds.map(workerId => {
                const worker = workers.find(w => w.id === workerId);

                return {
                    operationId: formData.operationId,
                    operationName: formData.operationName,
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    breakHours: Number(formData.breakHours),
                    breakMinutes: Number(formData.breakMinutes),
                    localId: formData.localId,
                    localName: formData.localName,
                    machineryId: formData.machineryId,
                    totalHours: calculateHours.workedHours,
                    workerId: workerId,
                    workerName: worker?.name || 'Desconocido',
                    ratePerHour: worker?.ratePerHour || 0,
                    createdBy: userId,
                    createdAt: serverTimestamp(),
                    editedBy: auth.currentUser?.email || 'Sistema',
                };
            });
            
            const savePromises = recordsToSave.map(doc =>
                addDoc(collection(db, TIMESHEET_COLLECTION_PATH), doc)
            );

            await Promise.all(savePromises);
            
            setErrorMessage({ message: `✅ ¡Se han registrado ${recordsToSave.length} tareas con éxito!`, type: 'success' });
            
            setFormData(initialData);
            setCurrentStep(1);
            
        } catch (error) {
            console.error("Error al guardar los registros:", error);
            setErrorMessage({ message: `❌ Error al guardar los registros: ${error.message}`, type: 'error' });
        }
    };
    
    const renderStep = () => {
        if (loading) return (
            <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Cargando datos...</p>
            </div>
        );
        
        switch (currentStep) {
            case 1:
                return <Step1_WorkerSelection workers={workers} onSelect={handleWorkerSelect} formData={formData} onNext={handleNext} />;
            case 2:
                return <Step2_OperationSelection operations={OPERATIONS} onSelect={handleOperationSelect} onBack={handleBack} />;
            case 3:
            case 4:
                return <Step3_TimeAndDate formData={formData} onChange={handleDataChange} calculateHours={calculateHours} onBack={handleBack} onNext={handleNext}/>;
            case 5:
                return <Step5_LocalSelection locals={availableLocals} onSelect={handleLocalSelect} formData={formData} onBack={handleBack} />;
            case 6:
                return <Step6_MachinerySelection machineryList={machineryList} onSelect={(id) => {setFormData(prev => ({ ...prev, machineryId: id })); handleNext();}} formData={formData} setCurrentStep={setCurrentStep} />;
            case 7:
                return <Step7_Summary formData={formData} calculateHours={calculateHours} onSave={handleSave} workers={workers} setCurrentStep={setCurrentStep} />;
            default:
                return <p className="text-red-500">Paso no encontrado.</p>;
        }
    };

    return (
        <div className="w-full">
            {/* Modern Header with Branding */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-2xl mb-4 sm:mb-6 md:mb-8 text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                    <FaLeaf className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">Horticultura Del Sureste</h1>
                        <p className="text-green-100 text-xs sm:text-sm md:text-base mt-1">Sistema de Registro de Tareas Agrícolas</p>
                    </div>
                </div>
            </div>
            
            <ProgressBar currentStep={currentStep} />
            
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-xl">
                {renderStep()}
            </div>
        </div>
    );
};

export default TimeSheetWizard;