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
import { FaUsers, FaTools, FaClock, FaSeedling, FaTruck, FaFileAlt, FaCheckCircle, FaLeaf, FaArrowRight, FaArrowLeft, FaFileUpload, FaPlus } from 'react-icons/fa';
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

// ------------------------------------
// --- COMPONENTES DE LOS PASOS ---
// ------------------------------------

// A. ProgressBar - COMPACT VERSION
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
        <div className="relative mb-6">
            {/* Background line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            
            {/* Animated progress line */}
            <div 
                className="absolute top-4 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
                {steps.map((stepInfo, index) => {
                    const isActive = currentStep >= stepInfo.step;
                    const isCurrent = currentStep === stepInfo.step;
                    
                    return (
                        <div key={stepInfo.step} className="flex flex-col items-center group cursor-default">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-300 transform ${
                                isCurrent 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110 ring-2 ring-green-200 shadow-lg' 
                                    : isActive 
                                        ? 'bg-green-500 text-white shadow-md' 
                                        : 'bg-white text-gray-400 border border-gray-300'
                            }`}>
                                <stepInfo.icon className="text-xs"/>
                            </div>
                            <span className={`mt-1 text-[10px] font-medium hidden sm:block ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {stepInfo.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// B. Step 1: Selección de Trabajador - COMPACT CARD DESIGN
const Step1_WorkerSelection = ({ workers, onSelect, formData, onNext, onExcelUpload }) => {
    const selectedCount = formData.workerIds.length;
    const fileInputRef = useRef(null);
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-white text-sm"/>
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
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm flex items-center gap-2 transition-all text-xs font-semibold"
                    >
                        <FaFileUpload /> Importar
                    </button>
                    
                    {selectedCount > 0 && (
                        <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                            {selectedCount} sel.
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 overflow-y-auto custom-scrollbar p-1 py-2 flex-1 min-h-0 content-start">
                {workers.map(worker => {
                    const isSelected = formData.workerIds.includes(worker.id);
                    return (
                        <button
                            key={worker.id}
                            onClick={() => onSelect(worker)}
                            className={`p-3 rounded-xl shadow-sm transition-all duration-200 text-left border flex flex-col justify-between ${
                                isSelected 
                                    ? 'bg-green-50 border-green-500 ring-1 ring-green-500 shadow-md' 
                                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <FaUsers className={`text-sm ${isSelected ? 'text-green-600' : 'text-gray-400'}`}/>
                                <span className={`font-bold text-sm truncate ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{worker.name}</span>
                            </div>
                            <span className={`text-[10px] ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                                {worker.ratePerHour} €/h
                            </span>
                        </button>
                    );
                })}
                {workers.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10 h-full">
                        <FaUsers className="text-4xl mb-2 opacity-20" />
                        <p className="text-sm">No hay trabajadores disponibles</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 mt-auto shrink-0 border-t border-gray-100">
                <button 
                    onClick={onNext} 
                    disabled={selectedCount === 0}
                    className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 text-sm ${
                        selectedCount > 0 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// C. Step 2: Selección de Operación - COMPACT ICON CARDS
const Step2_OperationSelection = ({ operations, onSelect, onBack }) => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaTools className="text-white text-sm"/>
                </div>
                ¿Qué operación se realizó?
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 overflow-y-auto custom-scrollbar p-1 py-2 flex-1 min-h-0 content-start">
                {operations.map(op => (
                    <button
                        key={op.id}
                        onClick={() => onSelect(op)}
                        className="p-3 bg-white hover:bg-green-50 rounded-xl shadow-sm border border-gray-200 hover:border-green-300 transition-all duration-200 text-left flex flex-col items-center justify-center gap-1 group"
                    >
                        <div className="text-2xl group-hover:scale-110 transition-transform">{op.emoji}</div>
                        <div className="font-bold text-gray-700 text-xs text-center leading-tight">{op.name}</div>
                        <div className="text-[9px] text-gray-400 font-mono bg-gray-50 px-1 rounded">{op.id}</div>
                    </button>
                ))}
                
                {/* Fertilizantes y Fitosanitarios */}
                {[
                    { id: '98', name: 'Fertilizantes', emoji: '🌾', color: 'yellow' },
                    { id: '99', name: 'Fitosanitarios', emoji: '🧪', color: 'blue' }
                ].map(op => (
                    <button 
                        key={op.id}
                        onClick={() => onSelect(op)}
                        className={`p-3 bg-${op.color}-50 hover:bg-${op.color}-100 rounded-xl shadow-sm border border-${op.color}-200 transition-all duration-200 text-left flex flex-col items-center justify-center gap-1 group`}
                    >
                        <div className="text-2xl group-hover:scale-110 transition-transform">{op.emoji}</div>
                        <div className={`font-bold text-${op.color}-800 text-xs text-center leading-tight`}>{op.name}</div>
                        <div className={`text-[9px] text-${op.color}-600 bg-white/50 px-1 rounded font-mono`}>{op.id}</div>
                    </button>
                ))}
            </div>
            
            <div className="flex justify-start pt-4 mt-auto shrink-0 border-t border-gray-100">
                <button 
                    onClick={onBack} 
                    className="px-5 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 text-sm"
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        </div>
    );
};

// D. Step 3: Fecha, Horario y Pausas - COMPACT BUT IMPROVED CONTROLS
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
    
    // Improved Compact Time Selector (Bigger buttons)
    const TimeSelector = ({ label, name, value, colorClass = "green" }) => {
        return (
            <div className={`bg-gray-50 p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-center h-full`}>
                <h3 className={`text-xs font-bold mb-1 uppercase tracking-wide text-gray-500`}>{label}</h3>
                <div className="flex items-center gap-2 w-full justify-center">
                    <button
                        type="button"
                        onClick={() => onChange(name, adjustTime(value, -15))}
                        className={`w-10 h-10 bg-white border border-gray-300 text-gray-700 hover:bg-${colorClass}-50 hover:text-${colorClass}-700 hover:border-${colorClass}-400 rounded-lg shadow-sm flex items-center justify-center text-lg font-bold transition-all active:scale-95`}
                    >
                        -
                    </button>
                    <div className={`text-xl font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 min-w-[70px] text-center shadow-inner`}>
                        {value}
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange(name, adjustTime(value, 15))}
                         className={`w-10 h-10 bg-white border border-gray-300 text-gray-700 hover:bg-${colorClass}-50 hover:text-${colorClass}-700 hover:border-${colorClass}-400 rounded-lg shadow-sm flex items-center justify-center text-lg font-bold transition-all active:scale-95`}
                    >
                        +
                    </button>
                </div>
            </div>
        );
    };
    
    // Improved Compact Break Selector
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
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-row items-center justify-between px-4">
                <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                    ☕ <span className="hidden sm:inline">Pausas</span>
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => adjustBreak(-15)}
                        className="w-10 h-10 bg-white text-orange-600 border border-orange-200 hover:bg-orange-100 rounded-lg shadow-sm flex items-center justify-center font-bold text-lg active:scale-95"
                    >
                        -
                    </button>
                    <span className="text-xl font-mono font-bold text-orange-900 min-w-[60px] text-center">{breakTime}</span>
                    <button
                        type="button"
                        onClick={() => adjustBreak(15)}
                        className="w-10 h-10 bg-white text-orange-600 border border-orange-200 hover:bg-orange-100 rounded-lg shadow-sm flex items-center justify-center font-bold text-lg active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaClock className="text-white text-sm"/>
                </div>
                Fecha, Horario y Pausas
            </h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-4 p-1">
                {/* Fecha - Compacta */}
                <div className="flex items-center gap-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <label className="text-sm font-bold text-blue-800 whitespace-nowrap">📅 Fecha:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={(e) => onChange('date', e.target.value)}
                        className="w-full bg-white p-2 border border-blue-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                    />
                </div>
                
                {/* Horarios Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <TimeSelector label="Inicio" name="startTime" value={formData.startTime} colorClass="green" />
                    <TimeSelector label="Fin" name="endTime" value={formData.endTime} colorClass="emerald" />
                </div>

                {/* Pausas */}
                <BreakSelector />
                
                {/* Resumen de horas - Compacto */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 rounded-xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Total Horas</p>
                        <p className="text-3xl font-extrabold font-mono tracking-tight">{calculateHours.workedHours.toFixed(2)}h</p>
                    </div>
                    <div className="text-right">
                         <div className="text-xs opacity-75">Neto Trabajo</div>
                         <div className="text-[10px] opacity-60">Incl. pausas: {calculateHours.breakDuration.toFixed(2)}h</div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between pt-4 mt-auto shrink-0 border-t border-gray-100 pb-2"> {/* Added pb-2 to ensure buttons not cut off */}
                <button 
                    onClick={onBack} 
                    className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold flex items-center gap-2 transition-all duration-200 text-sm"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={onNext} 
                    className={`px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow hover:shadow-lg font-semibold flex items-center gap-2 transition-all duration-200 text-sm ${calculateHours.workedHours <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                    disabled={calculateHours.workedHours <= 0}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// E. Step 5: Local/Cultivo - CLEAN COMPACT CARD LAYOUT
const Step5_LocalSelection = ({ locals, onSelect, formData, onBack }) => {
    const selected = formData.localId;
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaSeedling className="text-white text-sm"/>
                </div>
                ¿Dónde se realizó?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 overflow-y-auto custom-scrollbar p-1 py-2 flex-1 min-h-0 content-start">
                {locals.map(local => (
                    <button
                        key={local.id}
                        onClick={() => onSelect(local)}
                        className={`p-3 rounded-xl shadow-sm transition-all duration-200 text-left transform border flex flex-col justify-between ${
                            selected === local.id 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-2 ring-green-300 shadow-md' 
                                : 'bg-white hover:shadow-md text-gray-800 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <FaLeaf className={`text-sm ${selected === local.id ? 'text-white' : 'text-green-600'}`}/>
                            <span className="font-bold text-sm truncate w-full">{local.name}</span>
                        </div>
                        <span className={`text-[10px] ${selected === local.id ? 'text-green-100' : 'text-gray-500'}`}>
                            {local.type || 'Local'}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between pt-4 mt-auto shrink-0 border-t border-gray-100">
                <button 
                    onClick={onBack} 
                    className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold flex items-center gap-2 transition-all duration-200 text-sm"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={() => onSelect({id: '', name: 'General'})} 
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow hover:shadow-lg font-semibold flex items-center gap-2 transition-all duration-200 text-sm hover:-translate-y-0.5"
                >
                    Saltar / Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// F. Step 6: Maquinaria - COMPACT CARDS
const Step6_MachinerySelection = ({ machineryList, onSelect, formData, setCurrentStep }) => {
    const selected = formData.machineryId;

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-white text-sm"/>
                </div>
                ¿Maquinaria?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto custom-scrollbar p-1 py-2 flex-1 min-h-0 content-start">
                <button
                    onClick={() => onSelect(null)}
                    className={`p-3 rounded-xl shadow-sm transition-all duration-200 transform border-2 flex flex-col justify-center items-center h-24 ${
                        selected === null 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 shadow-md border-transparent' 
                            : 'bg-white hover:shadow-md text-gray-800 border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <FaCheckCircle className={`text-xl mb-1 ${selected === null ? 'text-white' : 'text-blue-500'}`}/>
                    <div className="font-bold text-sm">Sin Maquinaria</div>
                </button>
                
                {machineryList.map(machine => (
                    <button
                        key={machine.id}
                        onClick={() => onSelect(machine.id)}
                        className={`p-3 rounded-xl shadow-sm transition-all duration-200 text-left transform border-2 flex flex-col justify-between h-24 ${
                            selected === machine.id 
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-2 ring-orange-300 shadow-md border-transparent' 
                                : 'bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md text-gray-800 border-orange-200'
                        }`}
                    >
                        <div>
                            <FaTruck className={`text-lg mb-1 ${selected === machine.id ? 'text-white' : 'text-orange-600'}`}/>
                            <div className="font-bold text-sm truncate">{machine.name}</div>
                        </div>
                        <div className={`text-[10px] ${selected === machine.id ? 'text-orange-100' : 'text-gray-600'}`}>
                            {machine.plate || 'N/A'}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-between pt-4 mt-auto shrink-0 border-t border-gray-100">
                <button
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold flex items-center gap-2 transition-all duration-200 text-sm"
                >
                    <FaArrowLeft /> Volver
                </button>
                <button 
                    onClick={() => onSelect(formData.machineryId)} 
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow hover:shadow-lg font-semibold flex items-center gap-2 transition-all duration-200 text-sm hover:-translate-y-0.5"
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

// G. Step 7: Resumen - COMPACT SUMMARY
const Step7_Summary = ({ formData, calculateHours, onSave, onSaveAndContinue, workers, setCurrentStep }) => {
    
    const selectedWorkers = workers.filter(w => formData.workerIds.includes(w.id));
    const workerNames = selectedWorkers.map(w => w.name).join(', ');
    const workerRate = selectedWorkers[0]?.ratePerHour || 0; 
    const costPerWorker = (calculateHours.workedHours * parseFloat(workerRate)).toFixed(2);
    const totalCost = (calculateHours.workedHours * parseFloat(workerRate) * selectedWorkers.length).toFixed(2);
    
    const InfoRow = ({ label, value, icon, color = "gray" }) => (
        <div className={`flex items-center p-3 bg-white rounded-lg border-l-4 border-${color}-500 shadow-sm`}>
            <div className={`w-8 h-8 rounded-full bg-${color}-50 flex items-center justify-center mr-3 shrink-0`}>
                <span className="text-lg">{icon}</span>
            </div>
            <div className="overflow-hidden">
                <div className="text-[10px] text-gray-500 uppercase font-bold">{label}</div>
                <div className="text-sm font-semibold text-gray-800 truncate" title={value}>{value}</div>
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm"/>
                </div>
                Resumen Final
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-3 p-1">
                <InfoRow 
                    label="Trabajadores" 
                    value={`${selectedWorkers.length} - ${workerNames}`} 
                    color="green" 
                    icon="👥"
                />
                <div className="grid grid-cols-2 gap-3">
                    <InfoRow 
                        label="Operación" 
                        value={formData.operationName} 
                        color="blue" 
                        icon="🛠️"
                    />
                    <InfoRow 
                        label="Lugar / Cultivo" 
                        value={formData.localName || 'General'} 
                        color="emerald" 
                        icon="🌱"
                    />
                </div>
                 <div className="grid grid-cols-2 gap-3">
                    <InfoRow 
                        label="Fecha" 
                        value={formData.date} 
                        color="purple" 
                        icon="📅"
                    />
                     <InfoRow 
                        label="Horario" 
                        value={`${formData.startTime} - ${formData.endTime}`} 
                        color="indigo" 
                        icon="⏰"
                    />
                </div>
                
                {formData.machineryId && (
                    <InfoRow 
                        label="Maquinaria" 
                        value={`ID: ${formData.machineryId}`} 
                        color="orange" 
                        icon="🚜"
                    />
                )}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center border-r border-gray-200">
                             <div className="text-xs text-gray-500 uppercase">Horas</div>
                             <div className="text-2xl font-bold text-gray-800">{calculateHours.workedHours.toFixed(2)}h</div>
                        </div>
                        <div className="text-center">
                             <div className="text-xs text-gray-500 uppercase">Coste Aprox.</div>
                             <div className="text-2xl font-bold text-green-600">{totalCost}€</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-auto shrink-0 border-t border-gray-100 pb-2"> {/* Added pb-2 */}
                <button
                    onClick={() => setCurrentStep(6)}
                     className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:w-auto w-full"
                >
                    <FaArrowLeft /> Atrás
                </button>
                
                <div className="flex gap-2 flex-1 flex-col sm:flex-row">
                    <button 
                        onClick={onSaveAndContinue}
                        className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md border border-blue-200 rounded-xl font-bold transition-all duration-200 text-sm flex items-center justify-center gap-2"
                    >
                        <FaPlus /> Guardar y Otro
                    </button>
                    <button 
                        onClick={onSave}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-bold transition-all duration-200 text-sm flex items-center justify-center gap-2"
                    >
                        <FaCheckCircle /> Finalizar
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
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm"/>
                </div>
                Verificación Importación
            </h2>

            {/* Tarjeta de Resumen Financiero - Compacta */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 rounded-xl shadow-md text-white shrink-0">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <p className="text-[10px] opacity-80 uppercase">Registros</p>
                        <p className="text-xl font-bold">{totalRecords}</p>
                    </div>
                    <div>
                        <p className="text-[10px] opacity-80 uppercase">Trabajadores</p>
                        <p className="text-xl font-bold">{uniqueWorkers}</p>
                    </div>
                    <div>
                        <p className="text-[10px] opacity-80 uppercase">Horas</p>
                        <p className="text-xl font-bold">{totalHours.toFixed(1)}h</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1">
                        <p className="text-[10px] opacity-90 uppercase">COSTE</p>
                        <p className="text-xl font-extrabold">{totalCost.toFixed(0)}€</p>
                    </div>
                </div>
            </div>

            {/* Lista Detallada Scrolleable */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-xl shadow-sm border border-gray-200">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase font-semibold sticky top-0 bg-white shadow-sm z-10">
                        <tr>
                            <th className="px-3 py-2">Trabajador</th>
                            <th className="px-3 py-2">Tarea</th>
                            <th className="px-3 py-2">Fecha</th>
                            <th className="px-3 py-2 text-right">Horas</th>
                            <th className="px-3 py-2 text-right">Coste</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((rec, i) => {
                            const cost = (rec.totalHours * (parseFloat(rec.ratePerHour) || 0)).toFixed(2);
                            return (
                                <tr key={i} className="hover:bg-green-50 transition-colors">
                                    <td className="px-3 py-2 font-medium text-gray-800">{rec.workerName}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{rec.operationName}</span>
                                            <span className="text-[10px] text-gray-500">{rec.localName}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                                        {rec.date} <br/> 
                                        <span className="text-[10px]">{rec.startTime}-{rec.endTime}</span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-bold">{rec.totalHours}</td>
                                    <td className="px-3 py-2 text-right text-gray-600">{cost}€</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between pt-4 mt-auto shrink-0 border-t border-gray-100 pb-2">
                <button
                    onClick={onCancel}
                    className="px-5 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold flex items-center gap-2 transition-all duration-300 shadow-md text-sm"
                >
                    🚨 Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 text-sm"
                >
                    <FaCheckCircle /> Confirmar ({totalRecords})
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
        startTime: '08:00',
        endTime: '16:00',
        breakHours: '00',
        breakMinutes: '30',
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

    // --- EFECTOS DE PERSISTENCIA (LOCALSTORAGE) ---
    const STORAGE_KEY_DATA = `timesheet_data_${userId}`;
    const STORAGE_KEY_STEP = `timesheet_step_${userId}`;
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Cargar estado al montar
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY_DATA);
        const savedStep = localStorage.getItem(STORAGE_KEY_STEP);

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Restaurar solo si hay datos válidos
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Error parsing saved wizard data", e);
            }
        }
        if (savedStep) {
            setCurrentStep(Number(savedStep));
        }
        setIsLoaded(true); // Permitir guardar cambios a partir de ahora
    }, [userId]);

    // 2. Guardar estado al cambiar (SOLO si ya cargó)
    useEffect(() => {
        if (isLoaded && formData) {
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(formData));
        }
    }, [formData, userId, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY_STEP, String(currentStep));
        }
    }, [currentStep, userId, isLoaded]);

    // 3. Helper para limpiar almacenamiento
    const clearPersistence = () => {
        localStorage.removeItem(STORAGE_KEY_DATA);
        localStorage.removeItem(STORAGE_KEY_STEP);
    };

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
                clearPersistence(); // Limpiar persistencia tras éxito total
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
            // No limpiamos persistencia completa aquí por si quieren reintentar otro archivo, 
            // pero el paso 1 ya setea estado base visualmente.
            // Si quieres limpiar todo:
            // clearPersistence(); 
            // setFormData(initialData);
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
            clearPersistence(); // Limpiar persistencia al finalizar flujo normal
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
        <div className="w-full h-full flex flex-col relative overflow-hidden p-2">
            {/* Modern Header with Branding */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg mb-4 text-white shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                    <FaLeaf className="text-3xl sm:text-4xl flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">Horticultura Del Sureste</h1>
                        <p className="text-green-100 text-xs sm:text-sm mt-1">Sistema de Registro de Tareas Agrícolas</p>
                    </div>
                </div>
            </div>
            
            <div className="shrink-0 mb-2">
                <ProgressBar currentStep={currentStep} />
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl flex-1 flex flex-col min-h-0 overflow-hidden relative border border-gray-100">
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