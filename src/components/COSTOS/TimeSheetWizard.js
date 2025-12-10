import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { auth } from '../../firebaseConfig'; 
import { FaUsers, FaTools, FaClock, FaSeedling, FaTruck, FaFileAlt, FaCheckCircle, FaLeaf, FaArrowRight, FaArrowLeft, FaFileUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

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
const LOCAL_COLLECTION_PATH = `artifacts/${appId}/public/data/locals`; // Assuming this exists or needed for mapping

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
    { id: '18', name: 'Blanqueo', emoji: '🖌️' },
    { id: '19', name: 'Limpieza balsa', emoji: '🧹' },
    { id: '98', name: 'Fertilizantes', emoji: '🌾' },
    { id: '99', name: 'Fitosanitarios', emoji: '🧪' },
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

// --- HELPERS EXCEL ---

const cleanString = (str) => {
    return str ? String(str).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
};

const findBestMatch = (target, options, key = 'name') => {
    const targetClean = cleanString(target);
    if (!targetClean) return null;
    return options.find(opt => cleanString(opt[key]).includes(targetClean)) || null;
};

// Función para parsear Excel
const processExcelFile = async (file, dbWorkers, dbLocals) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                // 1. Encontrar Fila de Encabezados (Busca "TRABAJADOR")
                let headerRowIndex = -1;
                let workerColIndex = -1;
                
                for (let i = 0; i < Math.min(20, jsonData.length); i++) {
                    const row = jsonData[i];
                    if (!row) continue;
                    const foundIndex = row.findIndex(cell => cell && String(cell).toUpperCase().includes("TRABAJADOR"));
                    if (foundIndex !== -1) {
                        headerRowIndex = i;
                        workerColIndex = foundIndex;
                        break;
                    }
                }

                if (headerRowIndex === -1) throw new Error("No se encontró la columna 'TRABAJADOR' en las primeras 20 filas.");

                // 2. Buscar Fecha (Arriba del encabezado)
                let detectedDate = formatDate(new Date()); // Default hoy
                for (let i = 0; i < headerRowIndex; i++) {
                    const row = jsonData[i];
                    if (!row) continue;
                    // Buscar celda que contenga "FECHA"
                    const dateLabelIndex = row.findIndex(cell => cell && String(cell).toUpperCase().includes("FECHA"));
                    if (dateLabelIndex !== -1) {
                        // Buscar fecha en la misma fila (celdas adyacentes) o en el texto
                        // Intentar parsear las celdas siguientes
                        for (let k = 1; k <= 3; k++) {
                           const potentialDate = row[dateLabelIndex + k];
                           if (potentialDate) {
                               // Si es numero serial de excel
                               if (typeof potentialDate === 'number' && potentialDate > 20000) {
                                    const dateObj = new Date((potentialDate - (25567 + 2)) * 86400 * 1000); // Ajuste básico Excel epoch
                                    detectedDate = formatDate(dateObj);
                                    break;
                               }
                               // Si es string
                               if (typeof potentialDate === 'string' && (potentialDate.match(/\d{2}\/\d{2}\/\d{4}/) || potentialDate.match(/\d{4}-\d{2}-\d{2}/))) {
                                    // Parse string basic
                                    // Asumiendo DD/MM/YYYY
                                    if(potentialDate.includes('/')) {
                                        const [d, m, y] = potentialDate.split('/');
                                        detectedDate = `${y}-${m}-${d}`;
                                    } else {
                                        detectedDate = potentialDate;
                                    }
                                    break;
                               }
                           }
                        }
                    }
                }

                const parsedRecords = [];
                const errors = [];

                // 3. Iterar Filas de Datos
                for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || !row[workerColIndex]) continue; // Saltar filas vacías

                    const workerNameRaw = row[workerColIndex];
                    const matchedWorker = findBestMatch(workerNameRaw, dbWorkers, 'name');

                    if (!matchedWorker) {
                        errors.push(`Fila ${i + 1}: Trabajador "${workerNameRaw}" no encontrado en el sistema.`);
                        continue;
                    }

                    // 4. Leer Bloques de Tareas (Tarea | Horas | Parcela)
                    // Asumimos que los bloques empiezan inmediatamente después de alguna columna o seguimos el patrón del excel
                    // Según imagen: TOTAL H (B) | TRABAJADOR (C) | TAREA (D) | HORAS (E) | PARCELA (F) | ... (G separador?) | TAREA (H)...
                    // Columna inicial de bloques: woekerColIndex + 1
                    
                    let currentStartTime = "08:00"; // Inicio jornada por defecto

                    let col = workerColIndex + 1;
                    while (col < row.length) {
                        // Intentar leer un bloque de 3: Tarea, Horas, Parcela
                        // A veces hay columnas vacias entre bloques. Buscamos donde haya un valor de Tarea
                        
                        const tareaVal = row[col];
                        
                        // Si no hay tarea, saltamos columna (posible separador)
                        if (!tareaVal) {
                            col++; 
                            continue;
                        }

                        const pHours = row[col + 1];
                        const pParcela = row[col + 2];

                        // HELPER LOCAL: Normalizar ID (5 -> 05)
                        const normalizeId = (val) => {
                            const s = String(val).trim();
                            // Si es un solo dígito numérico, agregar 0 al inicio
                            return /^\d$/.test(s) ? '0' + s : s;
                        };

                        const normalizedInputId = normalizeId(tareaVal);

                        // Validar si es una tarea válida (ID o Nombre)
                        // 1. Intento por ID normalizado ('5' -> '05')
                        // 2. Intento por ID exacto (por si acaso)
                        // 3. Intento por Nombre
                        let matchedOp = OPERATIONS.find(op => op.id === normalizedInputId) || 
                                        OPERATIONS.find(op => op.id === String(tareaVal)) ||
                                        findBestMatch(tareaVal, OPERATIONS, 'name');

                        if (!matchedOp) {
                            // Debug: console.log(`No match for task: ${tareaVal} (norm: ${normalizedInputId})`);
                             col++;
                             continue;
                        }

                        const hoursDuration = parseFloat(pHours) || 0;
                        if (hoursDuration <= 0) {
                            col += 3; 
                            continue;
                        }

                        // Calcular Horas Inicio/Fin
                        // Helper para sumar horas
                        const addHours = (timeStr, h) => {
                            const [hh, mm] = timeStr.split(':').map(Number);
                            let totalMin = hh * 60 + mm + (h * 60);
                            let newH = Math.floor(totalMin / 60);
                            let newM = totalMin % 60;
                            if(newH >= 24) newH = newH - 24;
                            return `${String(newH).padStart(2,'0')}:${String(newM).padStart(2,'0')}`;
                        };

                        const nextTime = addHours(currentStartTime, hoursDuration);
                        
                        // Match Parcela/Local
                        let matchedLocal = null;
                        if (pParcela) {
                            const pStr = String(pParcela).trim();
                            
                            // Intento 1: Match exacto de ID
                            matchedLocal = dbLocals.find(l => l.id === pStr);
                            
                            // Intento 2: Buscar numero como PALABRA COMPLETA en el nombre
                            // Usamos \b para evitar que "2" haga match con "2026" o "12"
                            if (!matchedLocal) {
                                try {
                                    // Escapar caracteres especiales del regex por seguridad
                                    const safeStr = pStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                    const regex = new RegExp(`\\b${safeStr}\\b`, 'i');
                                    
                                    matchedLocal = dbLocals.find(l => {
                                         // Normalizar nombre del local tambien
                                         return regex.test(l.name);
                                    });
                                } catch (e) {
                                    console.warn("Regex error for local match", e);
                                    // Fallback simple si falla regex
                                    matchedLocal = dbLocals.find(l => l.name.toLowerCase().includes(pStr.toLowerCase()));
                                }
                            }
                        }

                        parsedRecords.push({
                            workerId: matchedWorker.id,
                            workerName: matchedWorker.name,
                            ratePerHour: matchedWorker.ratePerHour || 0,
                            operationId: matchedOp.id,
                            operationName: matchedOp.name,
                            date: detectedDate,
                            startTime: currentStartTime,
                            endTime: nextTime,
                            breakHours: 0,
                            breakMinutes: 0,
                            localId: matchedLocal ? matchedLocal.id : '',
                            localName: matchedLocal ? matchedLocal.name : (pParcela ? `Parcela ${pParcela}` : 'General'),
                            machineryId: null, // No soportado en este excel simple
                            totalHours: hoursDuration,
                            status: 'pending' // Para UI de revisión
                        });

                        currentStartTime = nextTime;
                        col += 3; // Avanzar al siguiente bloque
                    }
                }

                resolve({ records: parsedRecords, errors, date: detectedDate });

            } catch (err) {
                reject(err);
            }
        };
        reader.readAsArrayBuffer(file);
    });
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
const Step1_WorkerSelection = ({ workers, onSelect, formData, onNext, onExcelUpload }) => {
    const selectedCount = formData.workerIds.length;
    const fileInputRef = useRef(null);
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FaUsers className="text-white text-xl"/>
                    </div>
                    Selecciona Trabajadores
                </h2>
                
                <div className="flex gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={onExcelUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 transition-all text-sm font-semibold"
                    >
                        <FaFileUpload /> Importar Excel
                    </button>
                    
                    {selectedCount > 0 && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
                            <span className="font-bold">{selectedCount}</span> seleccionado{selectedCount !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
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
const Step7_Summary = ({ formData, calculateHours, onSave, onSaveAndContinue, workers, setCurrentStep }) => {
    
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
                Resumen de Tarea - Confirmación
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

            <div className="flex flex-col md:flex-row justify-between pt-6 gap-4">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                    🔄 Descartar
                </button>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={onSaveAndContinue}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                         💾 Guardar y Añadir Otra Tarea (+1)
                    </button>
                    
                    <button
                        onClick={onSave}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 border-2 border-white/20"
                    >
                        <FaCheckCircle /> Guardar y Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

// H. Step 8: Resumen y Confirmación por Lotes de Excel
const Step8_BatchSummary = ({ records, onConfirm, onCancel, workers }) => {
    
    // Cálculos de Totales
    const totalRecords = records.length;
    const uniqueWorkers = [...new Set(records.map(r => r.workerId))].length;
    const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0);
    
    const totalCost = records.reduce((sum, r) => {
        const rate = parseFloat(r.ratePerHour) || 0;
        return sum + (r.totalHours * rate);
    }, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaFileAlt className="text-white text-xl"/>
                </div>
                Verificación Final de Importación
            </h2>

            {/* Tarjeta de Resumen Financiero */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-2xl shadow-xl text-white">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-sm opacity-80 mb-1">Total Registros</p>
                        <p className="text-3xl font-bold">{totalRecords}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80 mb-1">Trabajadores</p>
                        <p className="text-3xl font-bold">{uniqueWorkers}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80 mb-1">Total Horas</p>
                        <p className="text-3xl font-bold">{totalHours.toFixed(2)} h</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2">
                        <p className="text-sm opacity-90 mb-1">COSTE ESTIMADO</p>
                        <p className="text-3xl font-extrabold">{totalCost.toFixed(2)} €</p>
                    </div>
                </div>
            </div>

            {/* Lista Detallada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase font-semibold sticky top-0 bg-white shadow-sm z-10">
                        <tr>
                            <th className="px-4 py-3">Trabajador</th>
                            <th className="px-4 py-3">Tarea</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Horario</th>
                            <th className="px-4 py-3 text-right">Horas</th>
                            <th className="px-4 py-3 text-right">Coste</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((rec, i) => {
                            const cost = (rec.totalHours * (parseFloat(rec.ratePerHour) || 0)).toFixed(2);
                            return (
                                <tr key={i} className="hover:bg-green-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800">{rec.workerName}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{rec.operationName}</span>
                                            <span className="text-xs text-gray-500">{rec.localName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{rec.date}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{rec.startTime} - {rec.endTime}</td>
                                    <td className="px-4 py-3 text-right font-bold">{rec.totalHours}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{cost} €</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between pt-6">
                <button
                    onClick={onCancel}
                    className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 shadow-md"
                >
                    🚨 Cancelar Todo
                </button>
                <button
                    onClick={onConfirm}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 text-lg"
                >
                    <FaCheckCircle /> Confirmar y Guardar ({totalRecords})
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
    
    // --- EXCEL STATES ---
    const [excelRecords, setExcelRecords] = useState([]);
    const [showExcelPreview, setShowExcelPreview] = useState(false);
    const [excelErrors, setExcelErrors] = useState([]);

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

    // --- HANDLERS EXCEL ---

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            // Usamos availableLocals que viene por props para mapear parcelas
            const { records, errors, date } = await processExcelFile(file, workers, availableLocals);
            
            setExcelRecords(records);
            setExcelErrors(errors);
            
            // Si hay fecha detectada en el excel, actualizar
            if (date) {
                setFormData(prev => ({ ...prev, date: date }));
            }
            
            setShowExcelPreview(true);
            setLoading(false);
        } catch (error) {
            console.error("Error processing excel:", error);
            setErrorMessage({ message: "Error al leer el archivo Excel. Verifique el formato.", type: 'error' });
            setLoading(false);
        }
        
        // Reset input
        e.target.value = null;
    };

    const handlePreviewExcelBatch = () => {
        if (excelRecords.length === 0) return;
        
        // Cierra el modal de previsualización simple
        setShowExcelPreview(false);
        // Avanza al Paso 8: Resumen Detallado y Financiero
        setCurrentStep(8);
    };

    const handleFinalBatchSave = async () => {
        // Validación final
        if (excelRecords.length === 0) return;
        
        const isConfirmed = window.confirm(`¿CONFIRMACIÓN FINAL: Guardar ${excelRecords.length} registros en la base de datos?`);
        if (!isConfirmed) return;

        setLoading(true);
        const successCount = 0;
        const failCount = 0;

        try {
            // Promise.allSettled es mejor para que no falle todo si uno falla
            const results = await Promise.allSettled(excelRecords.map(async (record) => {
                // Limpiar status y asegurar tipos básicos
                const { status, ...validRecord } = record;
                
                // Sanitize undefined
                const sanitizedRecord = Object.fromEntries(
                    Object.entries(validRecord).map(([k, v]) => [k, v === undefined ? null : v])
                );

                return addDoc(collection(db, TIMESHEET_COLLECTION_PATH), {
                    ...sanitizedRecord,
                    createdBy: userId,
                    createdAt: serverTimestamp(),
                    editedBy: auth.currentUser?.email || 'Sistema Excel',
                });
            }));

            // Analizar resultados
            const savedCount = results.filter(r => r.status === 'fulfilled').length;
            const failures = results.filter(r => r.status === 'rejected');

            if (failures.length > 0) {
                console.error("Algunos registros fallaron:", failures);
                setErrorMessage({ 
                    message: `⚠️ Hubo problemas: ${savedCount} guardados, ${failures.length} fallidos. Revise consola.`, 
                    type: 'error' 
                });
            } else {
                setErrorMessage({ 
                    message: `✅ ¡Importación Exitosa! ${savedCount} registros guardados y procesados.`, 
                    type: 'success' 
                });
                // Limpieza Total solo si todo ok (o parcial?)
                setExcelRecords([]);
                setExcelErrors([]);
                setFormData(initialData);
                setCurrentStep(1);
            }
            
            setLoading(false);
            
        } catch (error) {
            console.error("Error crítico saving excel records:", error);
            setErrorMessage({ message: `❌ Error de sistema al guardar: ${error.message}`, type: 'error' });
            setLoading(false);
        }
    };
    
    // Si se cancela desde el Paso 8
    const handleCancelBatch = () => {
        const confirmCancel = window.confirm("¿Estás seguro de cancelar toda la importación? Se perderán los datos leídos del Excel.");
        if (confirmCancel) {
            setExcelRecords([]);
            setExcelErrors([]);
            setCurrentStep(1);
        }
    };

    const handleCancelExcel = () => {
        setShowExcelPreview(false);
        setExcelRecords([]);
        setExcelErrors([]);
    };

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

    // --- Lógica de Guardado Flexible ---
    
    const saveData = async (onSuccessCallback) => {
        setErrorMessage(null);

        if (formData.workerIds.length === 0) {
            setErrorMessage({ message: "❌ Debe seleccionar al menos un trabajador.", type: 'error' });
            return;
        }

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
            
            if (onSuccessCallback) onSuccessCallback(recordsToSave.length);
            
        } catch (error) {
            console.error("Error al guardar los registros:", error);
            setErrorMessage({ message: `❌ Error al guardar los registros: ${error.message}`, type: 'error' });
        }
    };

    const handleSaveAndFinish = () => {
        const isConfirmed = window.confirm(`¿Está seguro de que desea guardar y FINALIZAR?`);
        if (!isConfirmed) return;

        saveData((count) => {
            setErrorMessage({ message: `✅ ¡Se han registrado ${count} tareas y el proceso ha finalizado!`, type: 'success' });
            setFormData(initialData);
            setCurrentStep(1);
        });
    };

    const handleSaveAndContinue = () => {
        const isConfirmed = window.confirm(`¿Desea guardar y AÑADIR OTRA actividad para los mismos trabajadores?`);
        if (!isConfirmed) return;

        saveData((count) => {
            setErrorMessage({ message: `✅ Tareas guardadas. Ahora añade la siguiente tarea para ${formData.workerNames.join(', ')}.`, type: 'success' });
            
            // INTELIGENCIA DE TIEMPO:
            // 1. Nueva Hora Inicio = Antigua Hora Fin
            // 2. Nueva Hora Fin = Sugerencia (+4h o fin de jornada)
            const nextStart = formData.endTime;
            
            setFormData(prev => ({
                ...prev,
                // MANTENER: WorkerIds, WorkerNames, Date
                // RESETEAR:
                operationId: '',
                operationName: '',
                localId: '',
                localName: '',
                machineryId: null,
                // ACTUALIZAR TIEMPOS:
                startTime: nextStart,
                endTime: calculateNextEndTime(nextStart),
                breakHours: '00',
                breakMinutes: '00',
            }));
            
            // Volver al Paso 2 (Operación)
            setCurrentStep(2);
        });
    };

    const calculateNextEndTime = (startTimeStr) => {
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        let newHours = hours + 4; 
        if (newHours >= 24) newHours = 23; 
        return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
                return (
                    <Step1_WorkerSelection 
                        workers={workers} 
                        onSelect={handleWorkerSelect} 
                        formData={formData} 
                        onNext={handleNext} 
                        onExcelUpload={handleExcelUpload}
                    />
                );
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
                return (
                    <Step7_Summary 
                        formData={formData} 
                        calculateHours={calculateHours} 
                        onSave={handleSaveAndFinish}
                        onSaveAndContinue={handleSaveAndContinue} 
                        workers={workers} 
                        setCurrentStep={setCurrentStep} 
                    />
                );
            case 8:
                return (
                    <Step8_BatchSummary 
                        records={excelRecords}
                        onConfirm={handleFinalBatchSave}
                        onCancel={handleCancelBatch}
                        workers={workers}
                    />
                );
            default:
                return <p className="text-red-500">Paso no encontrado.</p>;
        }
    };

    return (
        <div className="w-full relative">
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

            {/* MODAL DE PREVISUALIZACIÓN EXCEL */}
            {showExcelPreview && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        
                        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FaFileAlt /> Vista Previa Importación Excel
                            </h3>
                            <button onClick={handleCancelExcel} className="hover:bg-blue-700 p-2 rounded-lg transition-colors">
                                ✖
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {/* Errores */}
                            {excelErrors.length > 0 && (
                                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                    <h4 className="font-bold text-red-700 mb-2">Advertencias ({excelErrors.length}):</h4>
                                    <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                                        {excelErrors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                                        {excelErrors.length > 5 && <li>... y {excelErrors.length - 5} más.</li>}
                                    </ul>
                                </div>
                            )}

                            {/* Tabla de Registros */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Fecha</th>
                                            <th className="px-4 py-3">Trabajador</th>
                                            <th className="px-4 py-3">Tarea</th>
                                            <th className="px-4 py-3">Horario</th>
                                            <th className="px-4 py-3 text-center">Horas</th>
                                            <th className="px-4 py-3">Cultivo/Local</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {excelRecords.map((rec, i) => (
                                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-3">{rec.date}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800">{rec.workerName}</td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                                        {rec.operationName}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{rec.startTime} - {rec.endTime}</td>
                                                <td className="px-4 py-3 font-bold text-center">{rec.totalHours}</td>
                                                <td className="px-4 py-3 text-gray-500">{rec.localName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {excelRecords.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">No se encontraron registros válidos.</div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                             <button
                                onClick={handleCancelExcel}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                             >
                                Cancelar
                             </button>
                             <button
                                onClick={handlePreviewExcelBatch}
                                disabled={excelRecords.length === 0}
                                className={`px-6 py-2 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform transform hover:scale-105 ${
                                    excelRecords.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                             >
                                <FaCheckCircle /> Continuar a Verificación
                             </button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default TimeSheetWizard;