import React, { useState, useEffect, useMemo } from 'react';
import {
    collection,
    query,
    onSnapshot,
    where,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';
import {
    FaUser, FaTools, FaCalendarAlt, FaClock, FaSeedling, FaTruck, FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaUsers
} from 'react-icons/fa';

// --- CONFIGURACIÓN BASE (Sin cambios) ---
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
    { id: '01', name: 'Fumigar' },
    { id: '02', name: 'Instalar riego' },
    { id: '03', name: 'Desmontar Riego' },
    { id: '04', name: 'Riego' },
    { id: '05', name: 'Labores hierba' },
    { id: '06', name: 'Labores plástico' },
    { id: '07', name: 'Entutorado / Poda' },
    { id: '08', name: 'Trasplante/siembra' },
    { id: '09', name: 'Recolección' },
    { id: '10', name: 'Mantenimiento finca' },
    { id: '11', name: 'Ventilación Invernaderos' },
    { id: '12', name: 'Transporte mercancía' },
    { id: '13', name: 'Traslado maquinaria' },
    { id: '14', name: 'Preparación tierra' },
    { id: '15', name: 'Labores pre-trasplante' },
    { id: '16', name: 'Desbrozar' },
    { id: '17', name: 'Supervisión' },
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

// A. ProgressBar
const ProgressBar = ({ currentStep }) => {
    const steps = [
        { name: 'Trabajadores', icon: FaUsers, step: 1 },
        { name: 'Operación', icon: FaTools, step: 2 },
        { name: 'Tiempo', icon: FaClock, step: 3 },
        { name: 'Cultivo', icon: FaSeedling, step: 5 },
        { name: 'Máquina', icon: FaTruck, step: 6 },
        { name: 'Resumen', icon: FaFileAlt, step: 7 },
    ];
    
    return (
        <div className="flex justify-between items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-center mb-4 overflow-x-auto p-1">
            {steps.map((stepInfo, index) => {
                const isActive = currentStep >= stepInfo.step;
                const isCurrent = currentStep === stepInfo.step;
                
                return (
                    <React.Fragment key={stepInfo.step}>
                        <div className={`flex flex-col items-center flex-1 min-w-[70px] ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold transition-colors duration-300 ${isCurrent ? 'bg-red-600 text-white' : isActive ? 'bg-red-200' : 'bg-gray-200'}`}>
                                <stepInfo.icon className="text-sm sm:text-base"/>
                            </div>
                            <span className="mt-1 text-[10px] sm:text-xs font-medium">{stepInfo.name}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`h-1 flex-1 transition-colors duration-300 ${currentStep > steps[index+1].step ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// B. Step 1: Selección de Trabajador
const Step1_WorkerSelection = ({ workers, onSelect, formData, onNext }) => {
    const selectedIds = formData.workerIds;
    const isNextDisabled = selectedIds.length === 0;

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center"><FaUsers className="mr-2"/> ¿Quiénes realizaron esta tarea? <span className='ml-4 text-xs sm:text-sm font-normal text-red-500'>(Selección Múltiple)</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                {workers.map(worker => (
                    <button
                        key={worker.id}
                        onClick={() => onSelect(worker)}
                        className={`p-3 sm:p-4 rounded-lg shadow-md transition-all duration-200 ${
                            selectedIds.includes(worker.id) ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                    >
                        <FaUser className="mx-auto mb-1 text-lg sm:text-xl" />
                        <span className="font-medium text-sm sm:text-base">{worker.name}</span>
                        <span className="block text-[10px] sm:text-xs opacity-75">{worker.identification}</span>
                    </button>
                ))}
            </div>
            {workers.length === 0 && (
                <p className="text-center text-sm sm:text-lg text-red-500 mt-8">⚠️ No hay trabajadores registrados. Regístrelos en 'Gestión de Empleados'.</p>
            )}

            <div className="flex justify-end mt-8">
                <button
                    onClick={onNext}
                    className={`px-4 py-2 sm:px-6 sm:py-3 text-white font-bold rounded-lg shadow-xl transition duration-300 text-sm sm:text-base ${isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    disabled={isNextDisabled}
                >
                    Siguiente: Operación ({selectedIds.length} selec.) &rarr;
                </button>
            </div>
        </div>
    );
};


// C. Step 2: Selección de Operación
const Step2_OperationSelection = ({ operations, onSelect, onBack }) => {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">¿Qué operación se realizó?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto p-2">
                {operations.map(op => (
                    <button
                        key={op.id}
                        onClick={() => onSelect(op)}
                        className="p-3 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-green-500 hover:text-white transition duration-200 text-sm font-medium text-left"
                    >
                        {op.id} - {op.name}
                    </button>
                ))}
                <button className="p-3 bg-yellow-200 text-gray-800 rounded-md shadow text-sm font-medium text-left">Fertilizantes</button>
                <button className="p-3 bg-blue-200 text-gray-800 rounded-md shadow text-sm font-medium text-left">Fitosanitarios</button>
            </div>
            <div className="flex justify-start mt-8">
                <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">&larr; Volver a Trabajadores</button>
            </div>
        </div>
    );
};


// D. Step 3/4: Fecha, Horario y Pausas (Ajustes de responsividad en TimeInput y PauseSelector)
const Step3_TimeAndDate = ({ formData, onChange, calculateHours, onBack, onNext }) => {
    
    const TimeInput = ({ name, value, label, type = 'time' }) => {
        if (type === 'time') {
            return (
                <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                        type="time"
                        name={name}
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        // CLASE RESPONSIVE: Ancho y tamaño de fuente ajustados para móviles
                        className="w-28 sm:w-32 text-center text-xl sm:text-2xl p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    min="0"
                    max={label === 'h' ? '23' : '59'}
                    step="1"
                    // CLASE RESPONSIVE: Ancho y tamaño de fuente ajustados
                    className="w-16 sm:w-20 text-center text-xl sm:text-2xl p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
        );
    };

    const PauseSelector = ({ nameH, nameM, valueH, valueM }) => {
        
        const handleIncrement = (name, value, max) => {
            const numValue = Number(value);
            const newValue = numValue < max ? numValue + 1 : 0;
            onChange(name, String(newValue).padStart(2, '0'));
        };

        const handleDecrement = (name, value, max) => {
            const numValue = Number(value);
            const newValue = numValue > 0 ? numValue - 1 : max;
            onChange(name, String(newValue).padStart(2, '0'));
        };

        return (
            <div className="flex justify-center items-center space-x-4">
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => handleIncrement(nameH, valueH, 23)}
                        className="p-1 sm:p-2 bg-gray-300 rounded-t-md hover:bg-gray-400 text-lg"
                    >
                        &#9650;
                    </button>
                    {/* CLASE RESPONSIVE: Tamaño de fuente del número ajustado */}
                    <span className="text-3xl sm:text-4xl font-bold p-2 sm:p-3 bg-gray-200 rounded-md">{String(valueH).padStart(2, '0')}</span>
                    <button
                        onClick={() => handleDecrement(nameH, valueH, 23)}
                        className="p-1 sm:p-2 bg-gray-300 rounded-b-md hover:bg-gray-400 text-lg"
                    >
                        &#9660;
                    </button>
                    <span className="mt-1">h</span>
                </div>
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => handleIncrement(nameM, valueM, 59)}
                        className="p-1 sm:p-2 bg-gray-300 rounded-t-md hover:bg-gray-400 text-lg"
                    >
                        &#9650;
                    </button>
                    {/* CLASE RESPONSIVE: Tamaño de fuente del número ajustado */}
                    <span className="text-3xl sm:text-4xl font-bold p-2 sm:p-3 bg-gray-200 rounded-md">{String(valueM).padStart(2, '0')}</span>
                    <button
                        onClick={() => handleDecrement(nameM, valueM, 59)}
                        className="p-1 sm:p-2 bg-gray-300 rounded-b-md hover:bg-gray-400 text-lg"
                    >
                        &#9660;
                    </button>
                    <span className="mt-1">m</span>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">🗓️ Fecha, Horario y Pausas</h2>

            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3">Fecha de la Tarea:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    // CLASE RESPONSIVE: Ancho completo en móvil, 1/3 en md+
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md text-base sm:text-lg"
                    required
                />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-around items-center mb-8 border-b pb-6 space-y-6 sm:space-y-0">
                <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold mb-4">Hora de Inicio</h3>
                    <TimeInput name="startTime" value={formData.startTime} label="09:00" type="time" />
                </div>
                <div className="text-center">
                    <h3 className="text-base sm:text-lg font-bold mb-4">Hora Final</h3>
                    <TimeInput name="endTime" value={formData.endTime} label="18:00" type="time" />
                </div>
            </div>

            <div className="text-center">
                <h3 className="text-base sm:text-lg font-bold mb-6">Pausas de la Tarea</h3>
                <PauseSelector
                    nameH="breakHours"
                    nameM="breakMinutes"
                    valueH={formData.breakHours}
                    valueM={formData.breakMinutes}
                />
                
                <div className="mt-8 p-4 bg-red-50 rounded-lg inline-block">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">Horas trabajadas: <span className="text-red-600">{calculateHours.workedHours.toFixed(2)} h</span></p>
                    <p className="text-xs sm:text-sm text-gray-600">Duración de la pausa: {calculateHours.breakDuration.toFixed(2)} h</p>
                </div>
            </div>
            
            <div className="flex justify-between mt-8">
                <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">&larr; Volver</button>
                <button onClick={onNext} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={calculateHours.workedHours <= 0}>Siguiente &rarr;</button>
            </div>
        </div>
    );
};

// E. Step 5: Selección de Cultivo/Local
const Step5_LocalSelection = ({ locals, onSelect, formData, onBack }) => {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">¿En qué Cultivos/Locales?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto p-2">
                {locals.map(local => (
                    <button
                        key={local.id}
                        onClick={() => onSelect(local)}
                        className={`p-4 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base ${
                            formData.localId === local.id ? 'bg-green-600 text-white ring-4 ring-green-300' : 'bg-blue-100 hover:bg-blue-200 text-gray-800'
                        }`}
                    >
                        <FaSeedling className="mr-2 inline"/> {local.name}
                        <span className="block text-[10px] sm:text-xs opacity-75">{local.type || 'Invernadero'}</span>
                    </button>
                ))}
            </div>
            {locals.length === 0 && (
                <p className="text-center text-sm sm:text-lg text-red-500 mt-8">⚠️ No hay Cultivos/Locales disponibles. Cree uno en 'Proyectos'.</p>
            )}
            <div className="flex justify-start mt-8">
                <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">&larr; Volver</button>
            </div>
        </div>
    );
};

// F. Step 6: Selección de Maquinaria
const Step6_MachinerySelection = ({ machineryList, onSelect, formData, setCurrentStep }) => {
    
    const selected = formData.machineryId;

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">¿Maquinaria utilizada?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => onSelect(null)}
                    className={`p-4 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base ${
                        selected === null ? 'bg-blue-600 text-white ring-4 ring-blue-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                    <FaCheckCircle className="mr-2 inline"/> Sin Maquinaria
                </button>
                
                {machineryList.map(machine => (
                    <button
                        key={machine.id}
                        onClick={() => onSelect(machine.id)}
                        className={`p-4 rounded-lg shadow-md transition-all duration-200 text-left text-sm sm:text-base ${
                            selected === machine.id ? 'bg-red-600 text-white ring-4 ring-red-300' : 'bg-orange-100 hover:bg-orange-200 text-gray-800'
                        }`}
                    >
                        <FaTruck className="mr-2 inline"/> **{machine.name}**
                        <span className="block text-[10px] sm:text-xs opacity-75">Placa: {machine.plate || 'N/A'}</span>
                    </button>
                ))}
            </div>

            {machineryList.length === 0 && selected === null && (
                <p className="text-center text-sm sm:text-lg text-gray-500 mt-8">Todavía no hay elementos configurados para maquinaria. ¡Click en Siguiente!</p>
            )}

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setCurrentStep(5)} // Vuelve al paso de Cultivos/Locales
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    &larr; Volver
                </button>
                <button onClick={() => onSelect(formData.machineryId)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Siguiente &rarr;</button>
            </div>
        </div>
    );
};

// G. Step 7: Resumen y Guardar (Ajustes de responsividad en la tabla)
const Step7_Summary = ({ formData, calculateHours, onSave, workers, setCurrentStep }) => {
    
    const selectedWorkers = workers.filter(w => formData.workerIds.includes(w.id));

    const workerNames = selectedWorkers.map(w => w.name).join(', ');
    const workerRate = selectedWorkers[0]?.ratePerHour || 0;
    
    // Costo *por trabajador* para el resumen
    const costPerWorker = (calculateHours.workedHours * parseFloat(workerRate)).toFixed(2);
    // Costo total para todos los trabajadores (Nuevo)
    const totalCost = (calculateHours.workedHours * parseFloat(workerRate) * selectedWorkers.length).toFixed(2);
    
    const machineryName = formData.machineryId ? `ID Máquina: ${formData.machineryId}` : 'Ninguna';
    
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center"><FaFileAlt className="mr-3"/> Resumen de Tarea Múltiple ({selectedWorkers.length} Trabajadores)</h2>
            
            {/* CLASE RESPONSIVE: overflow-x-auto para forzar el scroll horizontal de la tabla en pantallas pequeñas */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]">Detalle</th>
                            <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        <tr className="bg-green-50">
                            <td className="px-4 py-4 sm:px-6 font-bold text-gray-900">Trabajadores</td>
                            <td className="px-4 py-4 sm:px-6 font-bold text-green-700">{workerNames}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Operación</td>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">{formData.operationId} - {formData.operationName}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Local / Cultivo</td>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">{formData.localName || 'N/D'}</td>
                        </tr>
                        <tr className="bg-yellow-50">
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Día</td>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">{formData.date}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Horario</td>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">{formData.startTime} a {formData.endTime}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Horas Trabajadas (c/u)</td>
                            <td className="px-4 py-4 sm:px-6 text-base font-extrabold text-red-600">{calculateHours.workedHours.toFixed(2)} h</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Costo Estimado (c/u)</td>
                            <td className="px-4 py-4 sm:px-6 text-base font-extrabold text-red-600">{costPerWorker} €</td>
                        </tr>
                        <tr className='bg-red-100'>
                            <td className="px-4 py-4 sm:px-6 font-bold text-gray-900">Costo Estimado TOTAL</td>
                            <td className="px-4 py-4 sm:px-6 text-lg font-extrabold text-red-800">{totalCost} €</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">Maquinaria Usada</td>
                            <td className="px-4 py-4 sm:px-6 text-gray-700">{machineryName}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setCurrentStep(1)} // Vuelve al paso de selección de trabajadores
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    ← Nuevo Registro
                </button>
                <button
                    onClick={onSave}
                    className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white font-bold rounded-lg shadow-xl hover:bg-green-700 transition duration-300 text-sm sm:text-base"
                >
                    <FaCheckCircle className="mr-2"/> Guardar {selectedWorkers.length} Registros
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
        workerIds: [], // CAMBIO CLAVE: array para múltiples IDs
        workerNames: [], // CAMBIO CLAVE: array para múltiples nombres
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

    // --- LÓGICA DE CARGA DE DATOS (Sin cambios) ---
    useEffect(() => {
        // ... (Tu lógica de carga de datos de Firestore) ...
        if (!db || !userId) return;

        // 1. Carga de Trabajadores (Workers)
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
        
        // 2. Carga de Maquinaria (Machinery)
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


    // --- CÁLCULO DE HORAS TOTALES Y TRABAJADAS (Sin cambios) ---
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


    // --- NAVEGACIÓN Y MANEJO DE ESTADO ---
    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleDataChange = (name, value) => {
        if (name === 'breakHours' || name === 'breakMinutes') {
              setFormData(prev => ({ ...prev, [name]: String(value).padStart(2, '0') }));
        } else {
              setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // MODIFICADO: Manejo de selección múltiple de trabajadores
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
        // Ya no avanza al siguiente paso automáticamente, el botón 'Siguiente' lo hace.
    };
    
    const handleOperationSelect = (operation) => {
        setFormData(prev => ({ ...prev, operationId: operation.id, operationName: operation.name }));
        handleNext();
    };

    const handleLocalSelect = (local) => {
        setFormData(prev => ({ ...prev, localId: local.id, localName: local.name }));
        handleNext();
    };

    // --- LÓGICA DE GUARDAR (MODIFICADO para múltiples registros) ---
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

                // Crear el objeto para guardar con los datos del formulario + los detalles del trabajador
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
                    
                    // Datos específicos del trabajador
                    workerId: workerId,
                    workerName: worker?.name || 'Desconocido',
                    ratePerHour: worker?.ratePerHour || 0,

                    // Metadatos
                    createdBy: userId,
                    createdAt: serverTimestamp(),
                };
            });
            
            // Subir cada registro a Firestore
            const savePromises = recordsToSave.map(doc =>
                addDoc(collection(db, TIMESHEET_COLLECTION_PATH), doc)
            );

            await Promise.all(savePromises);
            
            setErrorMessage({ message: `✅ ¡Se han registrado ${recordsToSave.length} tareas con éxito!`, type: 'success' });
            
            setFormData(initialData); // Reiniciar el formulario
            setCurrentStep(1); // Volver al primer paso
            
        } catch (error) {
            console.error("Error al guardar los registros:", error);
            setErrorMessage({ message: `❌ Error al guardar los registros: ${error.message}`, type: 'error' });
        }
    };
    
    // --- RENDERIZADO DEL WIZARD ---
    const renderStep = () => {
        if (loading) return <p className="text-center text-xl p-8">Cargando datos de trabajadores y maquinaria...</p>;
        
        switch (currentStep) {
            case 1:
                // Pasamos onNext directamente al Step1 para que el botón funcione con la validación de selección
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
                // Le pasamos la lista completa de workers para que pueda buscar los nombres y tarifas
                return <Step7_Summary formData={formData} calculateHours={calculateHours} onSave={handleSave} workers={workers} setCurrentStep={setCurrentStep} />;
            default:
                return <p className="text-red-500">Paso no encontrado.</p>;
        }
    };

    return (
        // Ajuste de padding: `p-4` por defecto, `sm:p-6` en pantallas más grandes
        <div className="max-w-4xl mx-auto bg-gray-50 p-4 sm:p-6 rounded-xl shadow-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">
                <span className="text-red-600">Registro de Tareas</span> | Paso {currentStep} de 7
            </h1>
            
            <ProgressBar currentStep={currentStep} />
            
            <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-inner min-h-[400px]">
                {renderStep()}
            </div>
        </div>
    );
};


export default TimeSheetWizard;