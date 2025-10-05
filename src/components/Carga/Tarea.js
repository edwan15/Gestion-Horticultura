
import { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore, collection, doc, 
    onSnapshot, addDoc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { 
    Plus, Trash2, X, Calendar as CalendarIcon, Loader, Zap, 
    ArrowLeft, FileText, FileSpreadsheet, Activity, CheckCircle, Package, Edit, Upload,  Filter , Clock
} from 'lucide-react';

// --- Global Variables (Provided by Canvas Environment) ---
const firebaseConfig = {
  apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
  authDomain: "calend-e5f32.firebaseapp.com",
  projectId: "calend-e5f32",
  storageBucket: "calend-e5f32.firebasestorage.app",
  messagingSenderId: "960965784873",
  appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338"
};
const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};
const appId = getAppId();

const initialAuthToken = typeof window.__initial_auth_token !== "undefined"

// Inicialización de Firebase (se realiza una sola vez)
const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// Constantes
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** Utilidad para obtener referencias de colecciones de Firestore */
const getCalendarsCollectionRef = (userId) => {
    if (!db || !userId) return null;
    return collection(db, `artifacts/${appId}/users/${userId}/calendars`);
};
const getEventsCollectionRef = (userId, calendarId) => {
    if (!db || !userId || !calendarId) return null;
    return collection(db, `artifacts/${appId}/users/${userId}/calendars/${calendarId}/events`);
};

/** Formatea una fecha a 'YYYY-MM-DD' */
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

/** Formatea una fecha a 'YYYY-MM' */
const formatMonthYear = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    return [year, month].join('-');
};

// =========================================================================
// === Nuevo Componente: Modal de Exportación Global (ExportModal) =========
// =========================================================================

const ExportModal = ({ 
    isOpen, onClose, events, selectedCalendarName, 
    handleGlobalExport, isLoadingExport, initialMode = 'range' // Nuevo prop para modo inicial
}) => {
    const today = formatDate(new Date());
    
    // --- HOOKS: Deben declararse siempre al principio, sin condiciones ---
    
    // Modo de exportación: 'range' o 'single'. Usa initialMode al abrir.
    const [exportMode, setExportMode] = useState(initialMode); 
    
    // Estado para Rango
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    
    // Estado para Día Único
    const [singleDate, setSingleDate] = useState(today);
    
    // Opciones de Filtro y Formato
    const [filterPositiveResult, setFilterPositiveResult] = useState(false);
    const [exportFormat, setExportFormat] = useState('CSV');

    // Sincronizar estado del modo al abrir el modal
    useEffect(() => {
        setExportMode(initialMode);
    }, [initialMode, isOpen]);


    // Conteo de días y eventos basado en el modo y filtro (useMemo es un hook, debe ir antes del return condicional)
    const filteredDays = useMemo(() => {
        let dayKeys = [];

        if (exportMode === 'range') {
            dayKeys = Object.keys(events).filter(dateKey => {
                return dateKey >= startDate && dateKey <= endDate;
            }).sort();
        } else if (exportMode === 'single') {
            if (events[singleDate]) {
                dayKeys = [singleDate];
            }
        }

        // Aplicar filtro de resultado positivo si está activo
        if (filterPositiveResult) {
            dayKeys = dayKeys.filter(dateKey => {
                const dayEvents = events[dateKey] || [];
                const totalResult = dayEvents.reduce((sum, event) => sum + (event.result || 0), 0);
                return totalResult > 0;
            });
        }
        
        let totalEvents = 0;
        dayKeys.forEach(dateKey => {
            totalEvents += (events[dateKey] || []).length;
        });

        return { dayKeys, totalEvents };
    }, [events, exportMode, startDate, endDate, singleDate, filterPositiveResult]);

    // --- RETURN CONDICIONAL (después de los hooks) ---
    if (!isOpen) return null;
    
    
    const handleExport = () => {
        if (filteredDays.dayKeys.length === 0) return;
        
        // Determinar las fechas a enviar para el nombre del archivo
        const exportStart = exportMode === 'range' ? startDate : singleDate;
        const exportEnd = exportMode === 'range' ? endDate : singleDate;

        handleGlobalExport({ 
            startDate: exportStart, 
            endDate: exportEnd, 
            dayKeys: filteredDays.dayKeys, 
            format: exportFormat,
            filterPositiveResult
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Upload size={24} className="mr-2 text-blue-600"/> 
                        Exportar Registros de {selectedCalendarName}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="space-y-5">
                    
                    {/* Selector de Modo de Exportación */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Seleccionar Modo de Exportación</h3>
                        <div className="flex space-x-4">
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition flex-1 justify-center ${exportMode === 'range' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}>
                                <input type="radio" value="range" checked={exportMode === 'range'} onChange={() => setExportMode('range')} className="hidden" />
                                <CalendarIcon size={20} className="mr-2 text-blue-600" />
                                <span className='font-medium text-blue-700'>Rango de Fechas</span>
                            </label>
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition flex-1 justify-center ${exportMode === 'single' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}>
                                <input type="radio" value="single" checked={exportMode === 'single'} onChange={() => setExportMode('single')} className="hidden" />
                                <Clock size={20} className="mr-2 text-blue-700" />
                                <span className='font-medium text-blue-700'>Día Único</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Filtro de Fechas/Día */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Especificar Fechas</h3>
                        
                        {exportMode === 'range' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">Desde</label>
                                    <input 
                                        type="date" id="startDate" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)} 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">Hasta</label>
                                    <input 
                                        type="date" id="endDate" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)} 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="singleDate">Seleccionar Día</label>
                                <input 
                                    type="date" id="singleDate" 
                                    value={singleDate} 
                                    onChange={(e) => setSingleDate(e.target.value)} 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Filtro de Resultados */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                         <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <Filter size={18} className="mr-2 text-purple-600"/>
                            3. Opciones de Filtro
                         </h3>
                        <div className="flex items-center">
                            <input 
                                id="filterPositive" 
                                type="checkbox" 
                                checked={filterPositiveResult} 
                                onChange={(e) => setFilterPositiveResult(e.target.checked)}
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="filterPositive" className="ml-2 block text-sm font-medium text-gray-700">
                                Incluir solo días con Resultado Acumulado ($A \times B$) mayor que cero.
                            </label>
                        </div>
                    </div>
                    
                    {/* Formato de Exportación */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">4. Seleccionar Formato</h3>
                        <div className="flex space-x-4">
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${exportFormat === 'CSV' ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300'}`}>
                                <input type="radio" value="CSV" checked={exportFormat === 'CSV'} onChange={() => setExportFormat('CSV')} className="hidden" />
                                <FileSpreadsheet size={20} className="mr-2 text-green-600" />
                                <span className='font-medium text-green-700'>Excel (CSV)</span>
                            </label>
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${exportFormat === 'PDF' ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300'}`}>
                                <input type="radio" value="PDF" checked={exportFormat === 'PDF'} onChange={() => setExportFormat('PDF')} className="hidden" />
                                <FileText size={20} className="mr-2 text-red-600" />
                                <span className='font-medium text-red-700'>PDF</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Resumen y Botón de Acción */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                        <p className="font-semibold text-blue-800">Días a Exportar: <span className="text-xl font-bold">{filteredDays.dayKeys.length}</span></p>
                        <p className="text-sm text-blue-700">Productos Totales: {filteredDays.totalEvents}</p>
                    </div>

                    <button 
                        onClick={handleExport}
                        disabled={filteredDays.dayKeys.length === 0 || isLoadingExport}
                        className={`w-full py-3 font-semibold rounded-lg transition duration-150 shadow-lg text-xl flex items-center justify-center 
                            ${filteredDays.dayKeys.length > 0 && !isLoadingExport ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    >
                        {isLoadingExport ? (
                            <>
                                <Loader size={20} className="animate-spin mr-2" />
                                Generando {exportFormat}...
                            </>
                        ) : (
                             `Exportar ${filteredDays.totalEvents} Productos`
                        )}
                    </button>

                    <button 
                        onClick={onClose}
                        className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};


// =========================================================================
// === Componente de Vista de Calendario (CalendarView) ====================
// =========================================================================
const CalendarView = ({
    currentDate, navigateMonth, handleDayClick, setSelectedCalendarId,
    selectedCalendarId, calendars, events, isAuthReady, setIsCalendarModalOpen,
    selectedCalendarName, globalTotals, setIsExportModalOpen, openExportModalInSingleDayMode
}) => {
    // Lógica para generar los días del mes (Omitida por ser Boilerplate)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Días de relleno del mes anterior
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth; i > 0; i--) {
        const fullDate = new Date(year, month - 1, prevMonthDays - i + 1);
        days.push({ 
            key: `prev-${prevMonthDays - i + 1}`, 
            day: prevMonthDays - i + 1, 
            isCurrentMonth: false, 
            fullDate,
            events: []
        });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
        const fullDate = new Date(year, month, i);
        const dateKey = formatDate(fullDate);
        days.push({ 
            key: `curr-${i}`, 
            day: i, 
            isCurrentMonth: true, 
            fullDate,
            dateKey,
            events: events[dateKey] || []
        });
    }

    // Días de relleno del mes siguiente (rellena hasta 6 filas)
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 rows * 7 days = 42
    
    for (let i = 1; i <= remainingDays && days.length % 7 !== 0; i++) {
        const fullDate = new Date(year, month + 1, i);
        days.push({ 
            key: `next-${i}`, 
            day: i, 
            isCurrentMonth: false, 
            fullDate,
            events: []
        });
    }
    
    const today = formatDate(new Date());

    const selectedCalendarColor = calendars.find(c => c.id === selectedCalendarId)?.color || 'bg-blue-600';


    return (


        <div class="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 mx-3 my-6 sm:mx-auto max-w-sm sm:max-w-md lg:max-w-xl transition-all duration-300 transform hover:scale-[1.01]">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Contenedor Principal ✨
    </h2>

    <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 font-medium">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center mb-4 sm:mb-0">
                    <Zap className="w-6 h-6 text-yellow-600 mr-3 hidden sm:block" />
                    <label htmlFor="calendar-select" className="text-lg font-semibold text-gray-700 mr-3 whitespace-nowrap">Registro:</label>
                    <select
                        id="calendar-select"
                        value={selectedCalendarId || ''}
                        onChange={(e) => setSelectedCalendarId(e.target.value)}
                        className={`p-2 border rounded-lg shadow-sm text-lg font-medium bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition 
                        ${selectedCalendarId ? 'text-gray-800' : 'text-gray-500'}`}
                        disabled={!isAuthReady || calendars.length === 0}
                    >
                        {calendars.length === 0 ? (
                            <option value="">Crea un registro</option>
                        ) : (
                            calendars.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        )}
                    </select>
                </div>
                
                <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
                     {/* Botón de Exportar Día Único (NUEVO BOTÓN) */}
                    <button
                        onClick={openExportModalInSingleDayMode}
                        disabled={!selectedCalendarId || globalTotals.totalResult === 0}
                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md w-full sm:w-auto justify-center
                        ${selectedCalendarId && globalTotals.totalResult !== 0 ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        title="Exportar registros de un día específico"
                    >
                        <Clock size={16} className="mr-1" />
                        Exportar Día Específico
                    </button>
                    
                    {/* Botón de Exportar Rango/Global */}
                    <button
                        onClick={() => setIsExportModalOpen('range')} // 'range' es el modo inicial por defecto
                        disabled={!selectedCalendarId || globalTotals.totalResult === 0}
                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md w-full sm:w-auto justify-center
                        ${selectedCalendarId && globalTotals.totalResult !== 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        title="Exportar todos los registros filtrados (Rango de Fechas)"
                    >
                        <Upload size={16} className="mr-1" />
                        Exportar Global
                    </button>
                    
                    {/* Botón de Nuevo Registro */}
                    <button
                        onClick={() => setIsCalendarModalOpen(true)}
                        className="flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md bg-green-600 hover:bg-green-700 text-white shadow-green-500/50 w-full sm:w-auto justify-center"
                        title="Crear Nuevo Registro/Calendario"
                    >
                        <Plus size={16} className="mr-1" />
                        Nuevo Registro
                    </button>
                </div>
            </div>
        </div>

        <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium">
                  
            {selectedCalendarId ? (
                <>
                    {/* Totales Globales del Registro Seleccionado */}
                   
                    
                    {/* Navegación del Calendario */}
                    <div className="flex justify-between items-center mb-6 ">
                        <button 
                            onClick={() => navigateMonth(-1)} 
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                            title="Mes Anterior"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {MONTHS[month]} {year}
                        </h2>
                        <button 
                            onClick={() => navigateMonth(1)} 
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition rotate-180"
                            title="Mes Siguiente"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b pb-2">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="text-sm sm:text-base">{day}</div>
                        ))}
                    </div>

                    {/* Grid de Días del Mes */}
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {days.map((dayData) => (
                            <div 
                                key={dayData.key}
                                onClick={() => handleDayClick(dayData)}
                                className={`
                                    h-24 sm:h-28 p-1 sm:p-2 flex flex-col cursor-pointer transition duration-150 rounded-lg 
                                    ${dayData.isCurrentMonth ? 'bg-white hover:bg-blue-50 border border-gray-200' : 'bg-gray-100 text-gray-400'}
                                    ${formatDate(dayData.fullDate) === today && dayData.isCurrentMonth ? 'border-2 border-red-500 ring-4 ring-red-200' : ''}
                                `}
                            >
                                <span 
                                    className={`
                                        font-bold text-lg text-right w-full
                                        ${dayData.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                                    `}
                                >
                                    {dayData.day}
                                </span>
                                {dayData.events.length > 0 && (
                                    <div className="flex-1 overflow-hidden mt-1 px-1">
                                        <div className="text-center font-medium text-xs py-1 rounded-full text-white shadow-md"
                                            style={{ backgroundColor: selectedCalendarColor }}
                                        >
                                            <span className='font-bold'>{dayData.events.length}</span> {dayData.events.length === 1 ? 'Producto' : 'Productos'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="p-10 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-blue-400 mb-4" />
                    <p className="text-xl font-semibold">Crea un registro para comenzar</p>
                    <p className="mt-2">Utiliza el botón **Nuevo Registro** para organizar tus productos.</p>
                </div>
            )}
        </div>

        <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 font-medium">
           <div className="mb-8 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 shadow-md">
                        <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
                             <Activity size={20} className="text-purple-600 mr-2" />
                            Acumulado Total del Registro
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            
                            <div className='p-3 bg-purple-100 rounded-lg'>
                                <p className='font-medium text-xs text-purple-700 uppercase'>Total Valor A</p>
                                <p className="font-semibold text-purple-900 text-xl mt-1">{globalTotals.totalA.toFixed(2)}</p>
                            </div>
                            
                            <div className='p-3 bg-purple-100 rounded-lg'>
                                <p className='font-medium text-xs text-purple-700 uppercase'>Total Valor B</p>
                                <p className="font-semibold text-purple-900 text-xl mt-1">{globalTotals.totalB.toFixed(2)}</p>
                            </div>
                            
                            <div className='p-3 bg-purple-600 rounded-lg text-white shadow-lg'>
                                <p className='font-medium text-xs uppercase'>RESULTADO GLOBAL ($A \times B$)</p>
                                <p className="font-extrabold text-2xl mt-1">{globalTotals.totalResult.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
        </div>
    </div>
</div>
        // <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 mx-3 my-6 sm:mx-auto max-w-sm sm:max-w-md lg:max-w-xl transition-all duration-300 transform hover:scale-[1.01]">
        //     {/* Selector de Registro y Botones de Acción */}
        //     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b">
        //         <div className="flex items-center mb-4 sm:mb-0">
        //             <Zap className="w-6 h-6 text-yellow-600 mr-3 hidden sm:block" />
        //             <label htmlFor="calendar-select" className="text-lg font-semibold text-gray-700 mr-3 whitespace-nowrap">Registro:</label>
        //             <select
        //                 id="calendar-select"
        //                 value={selectedCalendarId || ''}
        //                 onChange={(e) => setSelectedCalendarId(e.target.value)}
        //                 className={`p-2 border rounded-lg shadow-sm text-lg font-medium bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition 
        //                 ${selectedCalendarId ? 'text-gray-800' : 'text-gray-500'}`}
        //                 disabled={!isAuthReady || calendars.length === 0}
        //             >
        //                 {calendars.length === 0 ? (
        //                     <option value="">Crea un registro</option>
        //                 ) : (
        //                     calendars.map(c => (
        //                         <option key={c.id} value={c.id}>{c.name}</option>
        //                     ))
        //                 )}
        //             </select>
        //         </div>
                
        //         <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
        //              {/* Botón de Exportar Día Único (NUEVO BOTÓN) */}
        //             <button
        //                 onClick={openExportModalInSingleDayMode}
        //                 disabled={!selectedCalendarId || globalTotals.totalResult === 0}
        //                 className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md w-full sm:w-auto justify-center
        //                 ${selectedCalendarId && globalTotals.totalResult !== 0 ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        //                 title="Exportar registros de un día específico"
        //             >
        //                 <Clock size={16} className="mr-1" />
        //                 Exportar Día Específico
        //             </button>
                    
        //             {/* Botón de Exportar Rango/Global */}
        //             <button
        //                 onClick={() => setIsExportModalOpen('range')} // 'range' es el modo inicial por defecto
        //                 disabled={!selectedCalendarId || globalTotals.totalResult === 0}
        //                 className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md w-full sm:w-auto justify-center
        //                 ${selectedCalendarId && globalTotals.totalResult !== 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        //                 title="Exportar todos los registros filtrados (Rango de Fechas)"
        //             >
        //                 <Upload size={16} className="mr-1" />
        //                 Exportar Global
        //             </button>
                    
        //             {/* Botón de Nuevo Registro */}
        //             <button
        //                 onClick={() => setIsCalendarModalOpen(true)}
        //                 className="flex items-center px-4 py-2 text-sm font-semibold rounded-full transition duration-150 shadow-md bg-green-600 hover:bg-green-700 text-white shadow-green-500/50 w-full sm:w-auto justify-center"
        //                 title="Crear Nuevo Registro/Calendario"
        //             >
        //                 <Plus size={16} className="mr-1" />
        //                 Nuevo Registro
        //             </button>
        //         </div>
        //     </div>
            
        //     {selectedCalendarId ? (
        //         <>
        //             {/* Totales Globales del Registro Seleccionado */}
                   
                    
        //             {/* Navegación del Calendario */}
        //             <div className="flex justify-between items-center mb-6">
        //                 <button 
        //                     onClick={() => navigateMonth(-1)} 
        //                     className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
        //                     title="Mes Anterior"
        //                 >
        //                     <ArrowLeft size={20} />
        //                 </button>
        //                 <h2 className="text-2xl font-bold text-gray-800">
        //                     {MONTHS[month]} {year}
        //                 </h2>
        //                 <button 
        //                     onClick={() => navigateMonth(1)} 
        //                     className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition rotate-180"
        //                     title="Mes Siguiente"
        //                 >
        //                     <ArrowLeft size={20} />
        //                 </button>
        //             </div>

        //             {/* Días de la semana */}
        //             <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b pb-2">
        //                 {DAYS_OF_WEEK.map(day => (
        //                     <div key={day} className="text-sm sm:text-base">{day}</div>
        //                 ))}
        //             </div>

        //             {/* Grid de Días del Mes */}
        //             <div className="grid grid-cols-7 gap-1 mt-2">
        //                 {days.map((dayData) => (
        //                     <div 
        //                         key={dayData.key}
        //                         onClick={() => handleDayClick(dayData)}
        //                         className={`
        //                             h-24 sm:h-28 p-1 sm:p-2 flex flex-col cursor-pointer transition duration-150 rounded-lg 
        //                             ${dayData.isCurrentMonth ? 'bg-white hover:bg-blue-50 border border-gray-200' : 'bg-gray-100 text-gray-400'}
        //                             ${formatDate(dayData.fullDate) === today && dayData.isCurrentMonth ? 'border-2 border-red-500 ring-4 ring-red-200' : ''}
        //                         `}
        //                     >
        //                         <span 
        //                             className={`
        //                                 font-bold text-lg text-right w-full
        //                                 ${dayData.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
        //                             `}
        //                         >
        //                             {dayData.day}
        //                         </span>
        //                         {dayData.events.length > 0 && (
        //                             <div className="flex-1 overflow-hidden mt-1 px-1">
        //                                 <div className="text-center font-medium text-xs py-1 rounded-full text-white shadow-md"
        //                                     style={{ backgroundColor: selectedCalendarColor }}
        //                                 >
        //                                     <span className='font-bold'>{dayData.events.length}</span> {dayData.events.length === 1 ? 'Producto' : 'Productos'}
        //                                 </div>
        //                             </div>
        //                         )}
        //                     </div>
        //                 ))}
        //             </div>
        //         </>
        //     ) : (
        //         <div className="p-10 text-center text-gray-500">
        //             <Package size={48} className="mx-auto text-blue-400 mb-4" />
        //             <p className="text-xl font-semibold">Crea un registro para comenzar</p>
        //             <p className="mt-2">Utiliza el botón **Nuevo Registro** para organizar tus productos.</p>
        //         </div>
        //     )}

        //      <div className="mb-8 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 shadow-md">
        //                 <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
        //                      <Activity size={20} className="text-purple-600 mr-2" />
        //                     Acumulado Total del Registro
        //                 </h3>
        //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            
        //                     <div className='p-3 bg-purple-100 rounded-lg'>
        //                         <p className='font-medium text-xs text-purple-700 uppercase'>Total Valor A</p>
        //                         <p className="font-semibold text-purple-900 text-xl mt-1">{globalTotals.totalA.toFixed(2)}</p>
        //                     </div>
                            
        //                     <div className='p-3 bg-purple-100 rounded-lg'>
        //                         <p className='font-medium text-xs text-purple-700 uppercase'>Total Valor B</p>
        //                         <p className="font-semibold text-purple-900 text-xl mt-1">{globalTotals.totalB.toFixed(2)}</p>
        //                     </div>
                            
        //                     <div className='p-3 bg-purple-600 rounded-lg text-white shadow-lg'>
        //                         <p className='font-medium text-xs uppercase'>RESULTADO GLOBAL ($A \times B$)</p>
        //                         <p className="font-extrabold text-2xl mt-1">{globalTotals.totalResult.toFixed(2)}</p>
        //                     </div>
        //                 </div>
        //             </div>
        // </div>
        
    );
};



                    
// =========================================================================
// === Componentes de Lista y Detalles (Omitido por ser Boilerplate) =======
// =========================================================================

const ProductList = ({ eventsForDay, deleteEvent, loadEventForEdit, resetFormAndScroll }) => {
     // ... Contenido de ProductList (sin cambios relevantes en la lógica)
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="text-xl font-bold text-gray-800">Productos Guardados: <span className="text-blue-600">{eventsForDay.length}</span></h3>
                <button 
                    onClick={resetFormAndScroll}
                    className="flex items-center px-3 py-1.5 text-sm font-semibold rounded-full transition duration-150 shadow-md bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50"
                    title="Añadir Nuevo Producto"
                >
                    <Package size={16} className="mr-1" />
                    Añadir Nuevo
                </button>
            </div>

            {eventsForDay.length > 0 ? (
                <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {eventsForDay.map((event) => (
                        <li key={event.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-md transition duration-150 hover:shadow-lg hover:bg-white">
                            
                            <div className="flex justify-between items-start mb-3">
                                <p className="font-bold text-gray-800 text-xl flex-1 mr-4">{event.title}</p>
                                <div className="flex space-x-2">
                                    {/* Botón de Editar */}
                                    <button 
                                        onClick={() => loadEventForEdit(event)} 
                                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition"
                                        title="Editar Producto"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    {/* Botón de Eliminar */}
                                    <button 
                                        onClick={() => deleteEvent(event.id)} 
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                                        title="Eliminar Producto"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            {event.imageBase64 && (
                                <img 
                                    src={event.imageBase64} 
                                    alt={`Imagen para ${event.title}`} 
                                    className="w-full h-auto max-h-40 object-contain rounded-lg mb-3 shadow-sm border border-gray-300" 
                                />
                            )}

                            <div className="w-full grid grid-cols-3 gap-2 text-sm text-gray-600 pt-2">
                                <div className='p-2 bg-purple-100 rounded-lg'>
                                    <p className='font-medium text-xs text-purple-700'>Valor A</p>
                                    <p className="font-semibold text-purple-900 text-lg mt-1">{event.valueA?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className='p-2 bg-purple-100 rounded-lg'>
                                    <p className='font-medium text-xs text-purple-700'>Valor B</p>
                                    <p className="font-semibold text-purple-900 text-lg mt-1">{event.valueB?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className='p-2 bg-purple-600 rounded-lg text-white'>
                                    <p className='font-medium text-xs'>RESULTADO ($A \times B$)</p>
                                    <p className="font-extrabold text-2xl mt-1">{event.result?.toFixed(2) || '0.00'}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                    No hay productos registrados para este día.
                </p>
            )}
        </div>
    );
};


const EventDetailsView = ({
    selectedDate, events, saveEvent, formTitle, setFormTitle, formImageBase64, handleImageChange,
    formValueA, setFormValueA, formValueB, setFormValueB, multiplicationResult, 
    deleteEvent, exportToPDF, exportToCSV, lastSaved, setLastSaved, currentDate, monthlyTotals,
    resetFormAndScroll, editingEventId, loadEventForEdit
}) => {
    // ... Contenido de EventDetailsView (sin cambios relevantes en la lógica)
    const dateStr = selectedDate?.toLocaleDateString('es-ES', { dateStyle: 'full' }) || 'Día No Seleccionado';
    const eventsForDay = events[formatDate(selectedDate)] || [];
    const currentMonthName = MONTHS[currentDate.getMonth()];
    
    const saveButtonText = editingEventId ? 'Actualizar Producto' : 'Guardar Producto y Agregar Otro';

    useEffect(() => {
        if (lastSaved) {
            const timer = setTimeout(() => {
                setLastSaved(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastSaved, setLastSaved]);
    
    const cancelEdit = () => {
        resetFormAndScroll();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            
            {/* Columna 1-2: Formulario para Añadir/Editar Evento (ORDER 1) */}
            <div className="lg:col-span-2 xl:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit order-1" id="product-form-container">
                <div className='flex justify-between items-center mb-2'>
                    <h2 className={`text-2xl font-bold ${editingEventId ? 'text-orange-600' : 'text-blue-600'}`}>
                        {editingEventId ? 'Editar Producto' : 'Añadir Producto'}
                    </h2>
                    {editingEventId && (
                        <button 
                            onClick={cancelEdit} 
                            className='text-sm text-gray-500 hover:text-gray-700 flex items-center p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition'
                        >
                            <X size={16} className='mr-1' /> Cancelar Edición
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-4 border-b pb-3">
                    Día de registro: <span className="font-semibold text-gray-800">{dateStr}</span>
                </p>

                {/* Mensaje de éxito al guardar/actualizar */}
                {lastSaved && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 flex items-center font-medium border border-green-300 animate-pulse">
                        <CheckCircle size={20} className="mr-2" />
                        Producto **{lastSaved}** {editingEventId ? 'actualizado' : 'guardado'} con éxito.
                    </div>
                )}


                <form onSubmit={saveEvent} className="space-y-4">
                    {/* Campo 1: Título/Nombre del Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formTitle">Nombre del Producto (Requerido)</label>
                        <input 
                            id="formTitle" type="text" value={formTitle} 
                            onChange={(e) => setFormTitle(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="Ej: Ítem Z - Lote 2024" required
                        />
                    </div>
                    
                    {/* Campos de Multiplicación (Valor A y Valor B) */}
                    <h3 className="text-md font-semibold text-gray-700 pt-3 border-t mt-6">Datos de Cálculo y Acumulación</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formValueA">Valor A (Cantidad/Precio)</label>
                            <input 
                                id="formValueA" type="number" step="0.01" value={formValueA} onChange={(e) => setFormValueA(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg font-mono"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formValueB">Valor B (Multiplicador)</label>
                            <input 
                                id="formValueB" type="number" step="0.01" value={formValueB} onChange={(e) => setFormValueB(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg font-mono"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Resultado de Multiplicación */}
                    <div className="p-4 bg-purple-50 border border-purple-300 rounded-xl text-center shadow-inner">
                        <p className="text-sm text-purple-700 font-semibold">Resultado ($A \times B$):</p>
                        <p className="text-3xl font-extrabold text-purple-900 mt-1">
                            {multiplicationResult.toFixed(2)}
                        </p>
                    </div>
                    
                    {/* Campo 2: Carga y Vista Previa de Imagen */}
                    <div className='pt-2'>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formImage">
                            <span className="flex items-center"><Package size={16} className="mr-1"/> Foto del Producto (Opcional)</span>
                        </label>
                        <input 
                            id="formImage" type="file" accept="image/*" onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {/* Vista Previa de la Imagen */}
                        {formImageBase64 && (
                            <div className="mt-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-xs text-gray-500 mb-1">Vista Previa:</p>
                                <img 
                                    src={formImageBase64} 
                                    alt="Vista previa de la imagen seleccionada" 
                                    className="w-full h-auto max-h-32 object-contain rounded-md shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit"
                        className={`w-full font-semibold py-3 rounded-lg transition duration-150 focus:ring-4 text-xl mt-6 
                            ${editingEventId 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/50 focus:ring-orange-300'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 focus:ring-blue-300'
                            }`}
                    >
                        {saveButtonText}
                    </button>
                </form>
            </div>
            
            {/* Columna 3-4: Lista de Productos Guardados (ORDER 2) */}
            <div className="lg:col-span-2 xl:col-span-3 order-2">
                {/* Botones de Exportación Diaria */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-6 flex space-x-4 justify-start items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Exportar Solo Este Día:</h3>
                    <button 
                        onClick={exportToPDF}
                        disabled={eventsForDay.length === 0}
                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 shadow-md ${eventsForDay.length > 0 ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        <FileText size={18} className="mr-2" />
                        PDF
                    </button>
                    <button 
                        onClick={exportToCSV}
                        disabled={eventsForDay.length === 0}
                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 shadow-md ${eventsForDay.length > 0 ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/50' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        <FileSpreadsheet size={18} className="mr-2" />
                        Excel (CSV)
                    </button>
                </div>

                {/* Contenedor de la Lista de Productos (ProductList Component) */}
                <ProductList
                    eventsForDay={eventsForDay}
                    deleteEvent={deleteEvent}
                    loadEventForEdit={loadEventForEdit}
                    resetFormAndScroll={resetFormAndScroll}
                />
            </div>
            
            
            {/* Columna 5: Totales Mensuales (ORDER 3) */}
            <div className="lg:col-span-1 xl:col-span-1 order-3">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Activity size={20} className="text-purple-600 mr-2" />
                        Totales de {currentMonthName}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-purple-500 rounded-lg border-2 border-purple-700 shadow-xl text-white">
                            <span className="text-base font-semibold">TOTAL ACUMULADO:</span>
                            <span className="text-3xl font-extrabold">{monthlyTotals.totalResult.toFixed(2)}</span>
                        </div>
                        {/* Pequeños totales para el mes */}
                        <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg text-sm">
                            <span className="font-medium text-purple-700">Total Valor A:</span>
                            <span className="font-semibold text-purple-900">{monthlyTotals.totalA.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg text-sm">
                            <span className="font-medium text-purple-700">Total Valor B:</span>
                            <span className="font-semibold text-purple-900">{monthlyTotals.totalB.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// ========================= COMPONENTE PRINCIPAL APP ======================
// =========================================================================

/**
 * Componente principal de la aplicación.
 */
const Tarea = () => {
    // --- Estado de la Aplicación ---
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentView, setCurrentView] = useState('calendar'); 
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [selectedDate, setSelectedDate] = useState(null); 
    const [events, setEvents] = useState({}); 
    const [monthlyTotals, setMonthlyTotals] = useState({ totalA: 0, totalB: 0, totalResult: 0 });
    const [globalTotals, setGlobalTotals] = useState({ totalA: 0, totalB: 0, totalResult: 0 });
    const [lastSaved, setLastSaved] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null); 
    const [formTitle, setFormTitle] = useState('');
    const [formImageBase64, setFormImageBase64] = useState(''); 
    const [formValueA, setFormValueA] = useState('');
    const [formValueB, setFormValueB] = useState('');
    const [newCalendarName, setNewCalendarName] = useState('');
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    
    // Estado para controlar el modal de exportación
    const [isExportModalOpen, setIsExportModalOpen] = useState(false); 
    // Estado para forzar el modo inicial del modal de exportación ('range' o 'single')
    const [exportModalInitialMode, setExportModalInitialMode] = useState('range'); 
    
    const [isLoadingExport, setIsLoadingExport] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const multiplicationResult = useMemo(() => {
        return (parseFloat(formValueA) || 0) * (parseFloat(formValueB) || 0);
    }, [formValueA, formValueB]);


    // --- Inicialización y Autenticación de Firebase (Boilerplate) ---
    useEffect(() => {
        if (!auth || !db) {
            setError('Error: Firebase no está configurado correctamente.');
            setIsLoading(false);
            return;
        }

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthReady(true);
            } else if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (e) {
                    console.error("Error signing in with custom token:", e);
                    await signInAnonymously(auth);
                }
            } else {
                await signInAnonymously(auth);
            }
        });
        
        return () => unsubscribeAuth();
    }, []);

    const createDefaultCalendar = useCallback(async () => {
        if (!userId || calendars.length > 0) return;
        try {
            const calendarsRef = getCalendarsCollectionRef(userId);
            const newCalendar = {
                name: 'Registro Principal',
                color: '#3b82f6',
                createdAt: new Date(),
            };
            const docRef = await addDoc(calendarsRef, newCalendar);
            setSelectedCalendarId(docRef.id);
        } catch (e) {
            console.error("Error creating default calendar:", e);
        }
    }, [userId, calendars]);

    const saveNewCalendar = useCallback(async (e) => {
        e.preventDefault();
        if (!userId || !newCalendarName.trim()) return;
        try {
            const calendarsRef = getCalendarsCollectionRef(userId);
            const newCalendar = {
                name: newCalendarName.trim(),
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
                createdAt: new Date(),
            };
            const docRef = await addDoc(calendarsRef, newCalendar);
            setSelectedCalendarId(docRef.id);
            setNewCalendarName('');
            setIsCalendarModalOpen(false);
        } catch (e) {
            console.error("Error adding calendar:", e);
        }
    }, [userId, newCalendarName]);


    // Listener para Calendarios (Registros)
    useEffect(() => {
        if (!isAuthReady || !userId) return;

        const calendarsRef = getCalendarsCollectionRef(userId);
        if (!calendarsRef) return;

        const unsubscribe = onSnapshot(calendarsRef, (snapshot) => {
            const fetchedCalendars = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCalendars(fetchedCalendars);
            
            if (fetchedCalendars.length === 0) {
                createDefaultCalendar();
            } else if (!selectedCalendarId || !fetchedCalendars.find(c => c.id === selectedCalendarId)) {
                setSelectedCalendarId(fetchedCalendars[0].id);
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching calendars:", err);
            setError("Error al cargar registros: " + err.message);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthReady, userId, createDefaultCalendar, selectedCalendarId]);


    // Listener para Eventos (Productos) del Registro Seleccionado
    useEffect(() => {
        if (!isAuthReady || !userId || !selectedCalendarId) {
            setEvents({});
            return;
        }

        const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);
        if (!eventsRef) return;

        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const newEvents = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const dateKey = data.date; 
                
                const eventData = {
                    id: doc.id,
                    ...data,
                    // Asegurar que los valores sean números para el cálculo
                    valueA: parseFloat(data.valueA) || 0,
                    valueB: parseFloat(data.valueB) || 0,
                    result: (parseFloat(data.valueA) || 0) * (parseFloat(data.valueB) || 0)
                };

                if (!newEvents[dateKey]) {
                    newEvents[dateKey] = [];
                }
                newEvents[dateKey].push(eventData);
            });
            setEvents(newEvents);
        }, (err) => {
            console.error("Error fetching events:", err);
            setError("Error al cargar productos: " + err.message);
        });

        return () => unsubscribe();
    }, [isAuthReady, userId, selectedCalendarId]);
    
    // --- Cálculo de Totales ---
    const calculateMonthlyTotals = useCallback(() => {
        const yearMonth = formatMonthYear(currentDate);
        let totalA = 0;
        let totalB = 0;
        let totalResult = 0;

        Object.keys(events).forEach(dateKey => {
            if (dateKey.startsWith(yearMonth)) {
                events[dateKey].forEach(event => {
                    totalA += event.valueA;
                    totalB += event.valueB;
                    totalResult += event.result;
                });
            }
        });
        setMonthlyTotals({ totalA, totalB, totalResult });
    }, [events, currentDate]);

    const calculateGlobalTotals = useCallback(() => {
        let totalA = 0;
        let totalB = 0;
        let totalResult = 0;

        Object.keys(events).forEach(dateKey => {
            events[dateKey].forEach(event => {
                totalA += event.valueA;
                totalB += event.valueB;
                totalResult += event.result;
            });
        });
        setGlobalTotals({ totalA, totalB, totalResult });
    }, [events]);

    useEffect(() => {
        calculateMonthlyTotals();
        calculateGlobalTotals();
    }, [events, currentDate, calculateMonthlyTotals, calculateGlobalTotals]);


    // --- Handlers de Interacción y CRUD (Boilerplate) ---
    const handleDayClick = (dayData) => {
        if (!dayData.isCurrentMonth) {
            setCurrentDate(dayData.fullDate);
        }
        setSelectedDate(dayData.fullDate);
        setCurrentView('details');
        setEditingEventId(null); 
        resetFormAndScroll(); 
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormImageBase64('');
        }
    };
    
    const navigateMonth = (amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev.getFullYear(), prev.getMonth() + amount, 1);
            return newDate;
        });
    };
    
    const backToCalendar = () => {
        setCurrentView('calendar');
        setSelectedDate(null);
        resetFormAndScroll();
    };

    const resetFormAndScroll = useCallback(() => {
        setEditingEventId(null);
        setFormTitle('');
        setFormImageBase64('');
        setFormValueA('');
        setFormValueB('');
        
        // Desplazar a la parte superior si está en la vista de detalles
        if (currentView === 'details') {
            const formContainer = document.getElementById('product-form-container');
            if (formContainer) {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [currentView]);

    const loadEventForEdit = useCallback((event) => {
        setEditingEventId(event.id);
        setFormTitle(event.title);
        setFormImageBase64(event.imageBase64 || '');
        setFormValueA(event.valueA.toString());
        setFormValueB(event.valueB.toString());
        
        const formContainer = document.getElementById('product-form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const saveEvent = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedCalendarId || !formTitle.trim()) return;

        const dateKey = formatDate(selectedDate);
        
        const eventData = {
            date: dateKey,
            title: formTitle.trim(),
            imageBase64: formImageBase64,
            valueA: parseFloat(formValueA) || 0,
            valueB: parseFloat(formValueB) || 0,
            createdAt: new Date(),
        };

        try {
            const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);

            if (editingEventId) {
                const eventDocRef = doc(eventsRef, editingEventId);
                await updateDoc(eventDocRef, eventData);
                setLastSaved('Producto');
                resetFormAndScroll();
            } else {
                await addDoc(eventsRef, eventData);
                setLastSaved('Producto');
                resetFormAndScroll();
            }
        } catch (e) {
            console.error("Error saving event:", e);
            setError("Error al guardar el producto: " + e.message);
        }
    }, [userId, selectedDate, formTitle, selectedCalendarId, formImageBase64, formValueA, formValueB, editingEventId, resetFormAndScroll]);

    const deleteEvent = useCallback(async (eventId) => {
        if (!selectedCalendarId || !eventId) return;
        
        const confirmation = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        if (!confirmation) return;

        try {
            const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);
            const eventDocRef = doc(eventsRef, eventId);
            await deleteDoc(eventDocRef);
        } catch (e) {
            console.error("Error deleting event:", e);
            setError("Error al eliminar el producto: " + e.message);
        }
    }, [userId, selectedCalendarId]);
    
    const selectedCalendarName = useMemo(() => calendars.find(c => c.id === selectedCalendarId)?.name || 'Sin Registro', [calendars, selectedCalendarId]);

    // --- Exportación Diaria (Boilerplate) ---
    const loadJsPDF = useCallback(() => {
        // Carga dinámica de jsPDF
        if (window.jspdf || window.jsPDF) return Promise.resolve();
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }, []);
    
    const exportToPDF = useCallback(async () => { 
        if (!selectedDate || !selectedCalendarId) return;

        const dateKey = formatDate(selectedDate);
        const dayEvents = events[dateKey] || [];
        if (dayEvents.length === 0) return;

        await loadJsPDF();
        const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
        if (typeof jsPDFConstructor !== 'function') return;

        const doc = new jsPDFConstructor();
        let y = 15;
        
        doc.setFontSize(18);
        doc.text(`Reporte Diario de Productos: ${selectedCalendarName}`, 10, y); y += 8;
        doc.setFontSize(12);
        doc.text(`Día: ${selectedDate.toLocaleDateString('es-ES', { dateStyle: 'full' })}`, 10, y); y += 10;
        
        let totalResult = 0;

        dayEvents.forEach((event, index) => {
            totalResult += event.result;
            
            if (y > 280) { // Salto de página
                doc.addPage();
                y = 15;
            }

            doc.setFontSize(11);
            doc.text(`${index + 1}. ${event.title}`, 15, y); y += 5;
            doc.setFontSize(9);
            doc.text(`Valor A: ${event.valueA.toFixed(2)} | Valor B: ${event.valueB.toFixed(2)}`, 20, y); y += 5;
            doc.text(`Resultado: ${event.result.toFixed(2)}`, 20, y); y += 7;
        });

        doc.line(10, y, 200, y); y += 5;
        doc.setFontSize(14);
        doc.text(`TOTAL DEL DÍA: ${totalResult.toFixed(2)}`, 150, y);
        
        doc.save(`Reporte_Diario_${dateKey}.pdf`);
    }, [selectedDate, events, loadJsPDF, selectedCalendarName, selectedCalendarId]);

    const exportToCSV = useCallback(() => { 
        if (!selectedDate || !selectedCalendarId) return;

        const dateKey = formatDate(selectedDate);
        const dayEvents = events[dateKey] || [];
        if (dayEvents.length === 0) return;

        const headers = ["Fecha", "Registro", "Título", "Valor A", "Valor B", "Resultado ($A \times B$)" ];
        
        const csvRows = dayEvents.map(item => [
            `"${dateKey}"`, 
            `"${selectedCalendarName}"`,
            `"${item.title.replace(/"/g, '""')}"`, 
            (item.valueA).toFixed(2),
            (item.valueB).toFixed(2),
            (item.result).toFixed(2)
        ]);

        const csvContent = [
            headers.join(";"),
            ...csvRows.map(row => row.join(";"))
        ].join("\n");

        const fileName = `Reporte_Diario_${dateKey}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [selectedDate, events, selectedCalendarName, selectedCalendarId]);
    
    
    // =========================================================================
    // === Lógica de Exportación GLOBAL (Ajustada para Día Único) ==============
    // =========================================================================
    
    const openExportModalInSingleDayMode = () => {
        // Abre el modal forzando el modo de "Día Único"
        setExportModalInitialMode('single');
        setIsExportModalOpen(true);
    };
    
    // Función que abre el modal en el modo de rango por defecto
    const openExportModalInRangeMode = () => {
        setExportModalInitialMode('range');
        setIsExportModalOpen(true);
    };

    const handleGlobalExport = useCallback(async ({ startDate, endDate, dayKeys, format, filterPositiveResult }) => {
        setIsLoadingExport(true);
        setError('');

        try {
            const allExportData = [];
            
            // 1. Recopilar datos filtrados
            for (const dateKey of dayKeys) {
                const dayEvents = events[dateKey] || [];
                const dayTotalResult = dayEvents.reduce((sum, e) => sum + (e.result || 0), 0);
                
                // Doble check del filtro, aunque ya se hizo en el modal
                if (filterPositiveResult && dayTotalResult <= 0) continue; 
                
                // Formato para CSV: Un producto por fila
                if (format === 'CSV') {
                    dayEvents.forEach(event => {
                        allExportData.push({
                            fecha: dateKey,
                            registro: selectedCalendarName,
                            producto_id: event.id,
                            titulo: event.title,
                            valor_a: event.valueA || 0,
                            valor_b: event.valueB || 0,
                            resultado: event.result || 0,
                        });
                    });
                } 
                // Formato para PDF: Agrupado por día con totales
                else if (format === 'PDF') {
                    allExportData.push({
                        dateKey,
                        events: dayEvents,
                        dayTotalResult
                    });
                }
            }

            if (allExportData.length === 0) {
                 throw new Error("No hay datos para exportar con los filtros seleccionados.");
            }

            if (format === 'CSV') {
                performGlobalCSVExport(allExportData, startDate, endDate);
            } else if (format === 'PDF') {
                await performGlobalPDFExport(allExportData, startDate, endDate);
            }
            
            setIsExportModalOpen(false);
            setError(null);
        } catch (err) {
            console.error("Error al exportar globalmente:", err);
            setError(err.message || "Error desconocido al generar el archivo.");
        } finally {
            setIsLoadingExport(false);
        }
    }, [events, selectedCalendarName, loadJsPDF]);

    const performGlobalCSVExport = (data, startDate, endDate) => {
        const headers = ["Fecha", "Registro", "Producto ID", "Título", "Valor A", "Valor B", "Resultado ($A \times B$)" ];
        
        const csvRows = data.map(item => [
            `"${item.fecha}"`, 
            `"${item.registro}"`,
            `"${item.producto_id}"`,
            `"${item.titulo.replace(/"/g, '""')}"`, 
            (item.valor_a).toFixed(2),
            (item.valor_b).toFixed(2),
            (item.resultado).toFixed(2)
        ]);

        const csvContent = [
            headers.join(";"),
            ...csvRows.map(row => row.join(";"))
        ].join("\n");

        // Ajustar nombre del archivo si es día único
        const fileName = startDate === endDate 
            ? `Reporte_${startDate}.csv` 
            : `Reporte_Global_${startDate}_a_${endDate}.csv`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const performGlobalPDFExport = async (data, startDate, endDate) => {
        await loadJsPDF();
        const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;

        if (typeof jsPDFConstructor !== 'function') {
            throw new Error("No se pudo cargar el constructor de jsPDF.");
        }
        
        const doc = new jsPDFConstructor('p', 'mm', 'a4');
        doc.setFontSize(18);
        
        const isSingleDay = startDate === endDate;
        const titleText = isSingleDay ? `REPORTE DEL DÍA: ${startDate}` : `REPORTE GLOBAL DE PRODUCTOS`;
        const rangeText = isSingleDay ? new Date(startDate).toLocaleDateString('es-ES', { dateStyle: 'full' }) : `${startDate} a ${endDate}`;
        const totalText = `Total de Días Incluidos: ${data.length}`;
        
        let y = 15;

        // Título del reporte
        doc.text(titleText, 10, y); y += 8;
        doc.setFontSize(10);
        doc.text(`Registro: ${selectedCalendarName}`, 10, y); y += 5;
        doc.text(`Rango/Día: ${rangeText}`, 10, y); y += 5;
        doc.text(totalText, 10, y); y += 5;
        doc.line(10, y, 200, y); y += 5;

        // Contenido por Día
        doc.setFontSize(12);
        
        let globalTotalResult = 0;
        
        data.forEach(dayData => {
            globalTotalResult += dayData.dayTotalResult;
            const dateStr = new Date(dayData.dateKey).toLocaleDateString('es-ES', { dateStyle: 'long' });
            
            if (y > 270) { // Si queda poco espacio, añadir nueva página
                doc.addPage();
                y = 15;
            }

            // Encabezado del Día
            doc.setFillColor(230, 240, 255); // Azul claro
            doc.rect(10, y, 190, 8, 'F');
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50); // Color oscuro
            doc.text(`DÍA: ${dateStr}`, 12, y + 6);
            doc.setTextColor(0, 0, 0); // Volver a negro
            y += 10;
            
            // Listar Productos del Día
            dayData.events.forEach((event) => {
                if (y > 280) { 
                    doc.addPage();
                    y = 15;
                }
                
                doc.setFontSize(9);
                doc.text(`- ${event.title}`, 15, y); y += 5;
                doc.text(`A: ${event.valueA?.toFixed(2) || '0.00'} | B: ${event.valueB?.toFixed(2) || '0.00'}`, 18, y); y += 5;
                doc.text(`Resultado: ${event.result?.toFixed(2) || '0.00'}`, 18, y); y += 5;
            });
            
            // Total del Día
            doc.setFontSize(11);
            doc.setTextColor(100, 0, 150); // Púrpura
            doc.text(`TOTAL DEL DÍA: ${dayData.dayTotalResult.toFixed(2)}`, 100, y + 2);
            doc.setTextColor(0, 0, 0); // Volver a negro
            
            y += 8;
            doc.line(10, y, 200, y); // Separador
            y += 5; 
        });

        if (!isSingleDay) {
            // Total Global al final
            if (y > 270) { 
                doc.addPage();
                y = 15;
            }
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255); // Blanco
            doc.setFillColor(0, 100, 0); // Verde oscuro
            doc.rect(10, y, 190, 10, 'F');
            doc.text(`RESULTADO GLOBAL DEL REPORTE: ${globalTotalResult.toFixed(2)}`, 12, y + 7);
        }

        const fileName = isSingleDay 
            ? `Reporte_${startDate}.pdf` 
            : `Reporte_Global_${startDate}_a_${endDate}.pdf`;

        doc.save(fileName);
    };


    // --- Renderizado Principal ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader className="animate-spin text-blue-600" size={32} />
                <p className="ml-3 text-lg text-gray-700">Cargando aplicación...</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
            {/* Modal para Crear Calendario (Boilerplate) */}
            <div className={`fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center ${isCalendarModalOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-2xl transform transition-all duration-300 scale-100">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Registro</h2>
                        <button onClick={() => setIsCalendarModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>
                    <form onSubmit={saveNewCalendar} className="space-y-4">
                        <input type="text" value={newCalendarName} onChange={(e) => setNewCalendarName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Nombre del Registro (Ej: Ventas 2024)" required/>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg">Crear Registro</button>
                    </form>
                </div>
            </div>
            
            {/* Modal de Exportación Global/Día Único */}
            <ExportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                events={events}
                selectedCalendarName={selectedCalendarName}
                handleGlobalExport={handleGlobalExport}
                isLoadingExport={isLoadingExport}
                initialMode={exportModalInitialMode} // Pasa el modo inicial
            />


            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-6">
                    {currentView === 'details' && (
                        <button 
                            onClick={backToCalendar} 
                            className="mr-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition shadow-md"
                            title="Volver al calendario"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                    )}
                    <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
                        <CalendarIcon className="mr-3 text-blue-600" size={36} /> 
                        {selectedCalendarName}
                        {currentView === 'calendar' && <span className="text-xl text-gray-400 ml-3">| {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>}
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 font-medium border border-red-300">
                        {error}
                    </div>
                )}
                
                {/* Renderizado Condicional de Vistas */}
                {currentView === 'calendar' ? (
                    <CalendarView 
                        currentDate={currentDate} 
                        navigateMonth={navigateMonth} 
                        handleDayClick={handleDayClick} 
                        setSelectedCalendarId={setSelectedCalendarId} 
                        selectedCalendarId={selectedCalendarId} 
                        calendars={calendars} 
                        events={events} 
                        isAuthReady={isAuthReady} 
                        setIsCalendarModalOpen={setIsCalendarModalOpen} 
                        selectedCalendarName={selectedCalendarName}
                        globalTotals={globalTotals} 
                        setIsExportModalOpen={openExportModalInRangeMode} // Función para modo Rango
                        openExportModalInSingleDayMode={openExportModalInSingleDayMode} // Función para modo Día Único
                    />
                ) : (
                    <EventDetailsView 
                        selectedDate={selectedDate} 
                        events={events} 
                        saveEvent={saveEvent} 
                        formTitle={formTitle} 
                        setFormTitle={setFormTitle} 
                        formImageBase64={formImageBase64} 
                        handleImageChange={handleImageChange}
                        formValueA={formValueA} 
                        setFormValueA={setFormValueA} 
                        formValueB={formValueB} 
                        setFormValueB={setFormValueB} 
                        multiplicationResult={multiplicationResult} 
                        deleteEvent={deleteEvent} 
                        exportToPDF={exportToPDF} 
                        exportToCSV={exportToCSV} 
                        lastSaved={lastSaved}
                        setLastSaved={setLastSaved}
                        currentDate={currentDate} 
                        monthlyTotals={monthlyTotals} 
                        resetFormAndScroll={resetFormAndScroll} 
                        editingEventId={editingEventId}
                        loadEventForEdit={loadEventForEdit} 
                    />
                )}

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        <span className="font-semibold">ID de Usuario:</span> 
                        <span className="truncate font-mono text-gray-500 ml-1">{userId || 'Cargando...'}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Tarea;
