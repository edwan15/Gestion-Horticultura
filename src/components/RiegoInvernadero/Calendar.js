import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import DateRangeSummary from './DateRangeSummary';
import IrrigationExportModal from '../export/IrrigationExportModal';
import PrintableIrrigationReport from '../export/PrintableIrrigationReport';
import WaterManagement from './WaterManagement';

// --- FUNCIONES DE UTILDAD (Mantenidas) ---
const formatDateForLog = (dateKey) => {
    // Convierte 'YYYY-MM-DD' a un formato legible
    const date = new Date(dateKey + 'T00:00:00'); 
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

// -------------------------------------------------------
// --- 1. Componente de Registro de Actividad (Log) ---
// -------------------------------------------------------
const ActivityLog = ({ logActivities }) => {
    const ACTIVITIES_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(logActivities.length / ACTIVITIES_PER_PAGE);
    const startIndex = (currentPage - 1) * ACTIVITIES_PER_PAGE;
    const endIndex = startIndex + ACTIVITIES_PER_PAGE;
    const visibleActivities = logActivities.slice(startIndex, endIndex);

    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    
    const paginationButtonClasses = (isActive) => 
        `px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ${
            isActive 
                ? 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
        }`;
    
    return (
        // CLAVE: Aseguramos una altura fija mínima en móvil y usamos 'flex-col' para el contenido.
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-gray-200 h-96 lg:h-full flex flex-col">
            <h2 className="flex justify-between items-center text-xl sm:text-2xl font-extrabold text-indigo-800 mb-4 sm:mb-6 pb-2 border-b-4 border-indigo-100">
                <span className="flex items-center text-center sm:text-left"><span role="img" aria-label="checklist" className="mr-2 hidden sm:inline">📋</span>Registro</span>
            </h2>
            {/* Reducimos el padding horizontal con 'px-1' en móvil y mantenemos el 'flex-grow' para scroll */}
            <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-2 flex-grow"> 
                {visibleActivities.length > 0 ? (
                    visibleActivities.map((activity, index) => (
                        <div 
                            key={startIndex + index} 
                            className={`p-3 sm:p-4 rounded-xl shadow-md transition duration-300 ease-in-out ${activity.color === 'indigo' ? 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                        >
                            <p className={`text-xs sm:text-sm font-bold ${activity.color === 'indigo' ? 'text-indigo-800' : 'text-gray-800'}`}>{activity.time}</p>
                            {/* Ocultamos el detalle en móvil si es demasiado largo */}
                            <p className="font-semibold text-gray-700 mt-0.5 text-sm truncate">{activity.description}</p>
                            <p className="text-xs text-gray-500 italic mt-0.5 hidden sm:block">{activity.details}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-base py-6">💧 No hay registros de riego.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className={paginationButtonClasses(currentPage > 1)}>&larr; Prev</button>
                    <span className="text-sm font-medium text-gray-600">Pág {currentPage} de {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className={paginationButtonClasses(currentPage < totalPages)}>Sig &rarr;</button>
                </div>
            )}
            <p className="text-center text-gray-400 text-xs pt-2">--- Fin de registros ---</p>
        </div>
    );
};


// ----------------------------------------------------
// --- 2. Componente Principal Calendar (Responsivo)---
// ----------------------------------------------------
const Calendar = ({ dailyData = {} }) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [exportConfig, setExportConfig] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const reportRef = React.useRef();

    // ... (Log Activities Logic - Mantenida) ...
    const logActivities = useMemo(() => {
        const activities = [];
        const sortedDates = Object.keys(dailyData).sort().reverse(); 
        for (const dateKey of sortedDates) {
            const data = dailyData[dateKey];
            if (data && data.length > 0) {
                const totalM2 = data.reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0).toFixed(2);
                const firstRecord = data[0]; 
                activities.push({
                    time: `${formatDateForLog(dateKey)}`,
                    description: `Riego Completo de ${data.length} sectores`,
                    details: `Total aplicado: ${totalM2} M² en ${firstRecord.INVERNADERO}.`,
                    color: 'indigo', 
                    date: dateKey,
                });
            }
        }
        return activities;
    }, [dailyData]); 
    
    // --- Lógica de renderizado del calendario (Ajustada) ---
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); 
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = (firstDayOfMonth(year, month) + 6) % 7; 
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    // Usamos nombres de días más cortos para móvil
    const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const dayNamesFull = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const navButtonClasses = "px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-xl transition duration-300 ease-in-out shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-80 transform active:scale-95";
    // 🛑 AJUSTE CLAVE: Reducimos la altura en móvil ('h-12' o 'h-16') y la aumentamos en 'md'
    const baseCellClasses = "h-12 sm:h-16 md:h-28 p-1 text-right relative border border-gray-100 cursor-pointer rounded-lg transition duration-300 ease-in-out transform hover:z-10";

    const goToDetails = (day) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        navigate(`/day/${dateString}`);
    };
    
    const getDaySummary = (day) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const data = dailyData[dateKey] || [];
        if (data.length === 0) return null;
        const totalM2 = data.reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0);
        const firstRecord = data[0]; 
        return { count: data.length, totalM2: totalM2.toFixed(2), invernadero: firstRecord.INVERNADERO };
    };

    const renderDays = useMemo(() => {
        const days = [];
        
        for (let i = 0; i < startDay; i++) {
            // Celda vacía con altura responsiva
            days.push(<div key={`prev-${i}`} className="bg-gray-50 text-gray-400 border border-gray-100 h-12 sm:h-16 md:h-28 rounded-lg"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const summary = getDaySummary(day);
            const hasData = summary !== null;
            
            const cellClasses = `${baseCellClasses} ${
                hasData 
                    ? 'group bg-emerald-50 text-gray-800 font-bold shadow-md hover:shadow-xl hover:bg-emerald-100' 
                    : 'bg-white text-gray-900 hover:bg-indigo-50 hover:shadow-sm'
            }
            ${
                hasData 
                    ? 'border-2 border-emerald-400 hover:border-emerald-600 transform hover:scale-[1.03]' 
                    : 'border-gray-200'
            }`;

            days.push(
                <div 
                    key={day} 
                    className={cellClasses} 
                    onClick={() => goToDetails(day)}
                >
                    {/* Número del día (Tamaño responsivo) */}
                    <span className="text-lg sm:text-xl font-black block text-right text-indigo-800">{day}</span>
                    
                    {/* 🛑 CLAVE 1: Indicador de actividad simple para móviles */}
                    {hasData && (
                        <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-emerald-600 shadow-lg md:hidden"></div>
                    )}

                    {/* 🛑 CLAVE 2: ICONO DE RESUMEN PEQUEÑO (Visible solo en MD+) */}
                    {hasData && (
                        <div className="
                            hidden md:flex  
                            absolute top-1 left-1 text-xs md:text-sm font-semibold text-emerald-700 bg-emerald-200 rounded-full px-2 py-0.5 shadow-md 
                            items-center space-x-1
                        ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className='hidden sm:inline'>{summary.totalM2} M²</span> 
                            <span className='sm:hidden'>{summary.count}</span> {/* Muestra solo la cuenta si se reduce un poco el tamaño */}
                        </div>
                    )}
                    
                    {/* 🛑 CLAVE 3: MODAL DE PREVISUALIZACIÓN (OCULTO en móvil, solo en MD+) */}
                    {hasData && (
                        <div className="
                            // Oculto por defecto, solo aparece en group-hover en pantallas md y mayores
                            hidden md:group-hover:block 
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-56 p-4 text-sm text-left 
                            bg-indigo-700 text-white rounded-xl shadow-2xl z-20 
                            opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none 
                        ">
                            <p className="font-extrabold flex items-center mb-2 border-b border-indigo-400 pb-1">
                                <span className="text-yellow-300 mr-2 text-xl">💦</span> Datos de Riego
                            </p>
                            <p className="font-semibold text-base">
                                Total M²: <span className="text-yellow-200">{summary.totalM2}</span>
                            </p>
                            <p className="text-xs italic text-indigo-300 mt-2">
                                {summary.count} Registros
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        
        const remainingCells = 42 - (startDay + totalDays); 
        for (let i = 0; i < remainingCells; i++) {
            days.push(<div key={`next-${i}`} className="bg-gray-50 text-gray-400 border border-gray-100 h-12 sm:h-16 md:h-28 rounded-lg"></div>);
        }

        return days;
    }, [year, month, totalDays, startDay, dailyData, goToDetails, baseCellClasses]); // Incluimos baseCellClasses para evitar warnings

    const handleOpenExport = () => setIsExportModalOpen(true);

    const handlePreview = (config) => {
        setExportConfig(config);
        setIsExportModalOpen(false);

        // Helper function to format dates
        const formatDateHelper = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        // Filter Logic for irrigation data
        const irrigationRecords = [];
        let totalM2 = 0;
        let totalSectors = 0;
        let totalDays = 0;
        
        const now = new Date();
        const todayStr = formatDateHelper(now);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDateHelper(yesterday);

        const getStartDate = (range) => {
            const d = new Date();
            if (range === 'today') return d;
            if (range === 'yesterday') return yesterday;
            if (range === 'last_week') d.setDate(d.getDate() - 7);
            if (range === 'last_month') d.setMonth(d.getMonth() - 1);
            if (range === 'last_year') d.setFullYear(d.getFullYear() - 1);
            if (range === 'all') return new Date('2000-01-01');
            return new Date('2000-01-01');
        };

        const startDate = getStartDate(config.dateRange);

        Object.keys(dailyData).forEach(dateKey => {
            let isValidDate = false;
            
            if (config.dateRange === 'all') isValidDate = true;
            else if (config.dateRange === 'today') isValidDate = (dateKey === todayStr);
            else if (config.dateRange === 'yesterday') isValidDate = (dateKey === yesterdayStr);
            else {
                const currentDate = new Date(dateKey);
                if (!isNaN(currentDate.getTime())) {
                    isValidDate = currentDate >= startDate && currentDate <= now;
                }
            }

            if (isValidDate) {
                const dayRecords = dailyData[dateKey];
                if (dayRecords && dayRecords.length > 0) {
                    const dayM2 = dayRecords.reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0);
                    const firstRecord = dayRecords[0];
                    const lastRecord = dayRecords[dayRecords.length - 1];
                    
                    // Crear el contador combinando N_INIT del primer registro y N_FIN del último
                    const nInit = firstRecord.N_INIT || '';
                    const nFin = lastRecord.N_FIN || '';
                    const contador = (nInit && nFin) ? `${nInit}a${nFin}` : 'N/A';
                    
                    irrigationRecords.push({
                        dateRaw: dateKey, // Keep raw date for sorting
                        date: formatDateForLog(dateKey), // Formatted date for display
                        invernadero: firstRecord.INVERNADERO || 'N/A',
                        sectors: dayRecords.length,
                        m2: dayM2.toFixed(2),
                        contador: contador // New field
                    });
                    
                    totalM2 += dayM2;
                    totalSectors += dayRecords.length;
                    totalDays++;
                }
            }
        });

        // Sort irrigation records based on config.sortBy
        if (config.sortBy) {
            irrigationRecords.sort((a, b) => {
                switch (config.sortBy) {
                    case 'date_asc':
                        return new Date(a.dateRaw) - new Date(b.dateRaw);
                    case 'date_desc':
                        return new Date(b.dateRaw) - new Date(a.dateRaw);
                    case 'm2_desc':
                        return parseFloat(b.m2) - parseFloat(a.m2);
                    case 'm2_asc':
                        return parseFloat(a.m2) - parseFloat(b.m2);
                    case 'sectors_desc':
                        return b.sectors - a.sectors;
                    case 'sectors_asc':
                        return a.sectors - b.sectors;
                    case 'greenhouse_asc':
                        return a.invernadero.localeCompare(b.invernadero);
                    case 'greenhouse_desc':
                        return b.invernadero.localeCompare(a.invernadero);
                    default:
                        return 0;
                }
            });
        }

        setPreviewData({
            farm: 'Riego de Invernaderos',
            irrigationRecords,
            totals: {
                totalM2: totalM2.toFixed(2),
                totalSectors,
                totalDays
            }
        });
        
        setIsPreviewModalOpen(true);
    };

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: `Informe_Riego_${new Date().toISOString().split('T')[0]}`,
    });

    const changeMonth = (delta) => {
        const newDate = new Date(currentDate.getTime()); 
        newDate.setMonth(currentDate.getMonth() + delta);
        setCurrentDate(newDate);
    };


    return (
    // Contenedor principal sin un 'max-w' fijo, usando un poco más de padding en md+
    <div className="mx-auto p-2 sm:p-4 md:p-8 max-w-7xl bg-gray-50 shadow-2xl rounded-3xl mt-4 sm:mt-6 lg:mt-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-indigo-900 pb-2 sm:pb-3 border-b-4 border-emerald-300/50 tracking-tight flex-1">
                💧 Riego de Invernaderos
            </h1>
            <button
                className="mt-4 sm:mt-0 sm:ml-4 flex items-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all duration-200 text-sm"
                onClick={handleOpenExport}
            >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Exportar Informe
            </button>
        </div>

        {/* CLAVE: En móvil (col-span-1), todo en una columna. 
            En LG (desktop), dos columnas: 
            - Izquierda (lg:col-span-2) para el calendario.
            - Derecha (lg:col-span-1) para los resúmenes. 
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* ----------------------------------------------- */}
            {/* COLUMNA IZQUIERDA: CALENDARIO (2/3 del espacio) */}
            {/* ----------------------------------------------- */}
            <div className="lg:col-span-2">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-4 p-3 sm:p-4 bg-white rounded-2xl shadow-inner">
                    <button className={navButtonClasses} onClick={() => changeMonth(-1)}>&larr; Anterior</button>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 my-3 sm:my-0 capitalize text-center">{monthName}</h2>
                    <button className={navButtonClasses} onClick={() => changeMonth(1)}>Siguiente &rarr;</button>
                </header>

                <div className="calendar-grid grid grid-cols-7 gap-1 sm:gap-2 bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-gray-200">
                    {/* Nombres de los días */}
                    {dayNames.map((name, index) => (
                        <div key={name} className="bg-indigo-600 text-white text-center p-2 sm:p-3 font-extrabold text-xs sm:text-sm md:text-lg tracking-wider rounded-lg shadow-md">
                            <span className="hidden sm:inline">{dayNamesFull[index]}</span>
                            <span className="sm:hidden">{name}</span>
                        </div>
                    ))}
                    {renderDays}
                </div>
                
                {/* LEYENDA */}
                <div className="hidden md:block text-center mt-4 text-sm text-gray-600">
                    <span className="inline-block h-4 w-4 bg-emerald-50 border border-emerald-400 rounded mr-2"></span> 
                    Día con registros de riego (Haz click para ver detalles)
                </div>

            </div>
            
            {/* --------------------------------------------------------------------------------- */}
            {/* COLUMNA DERECHA: RESUMENES (1/3 del espacio) - DateRangeSummary y ActivityLog */}
            {/* --------------------------------------------------------------------------------- */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
                
                {/* 1. Componente de Resumen por Rango de Fechas */}
                <DateRangeSummary dailyData={dailyData} />
                
                {/* 2. Componente de Registro de Actividad */}
                <ActivityLog 
                    logActivities={logActivities} 
                />
            </div>

        </div>

        {/* Export Modal */}
        <IrrigationExportModal 
            isOpen={isExportModalOpen} 
            onClose={() => setIsExportModalOpen(false)} 
            onPreview={handlePreview}
        />

        {/* Preview Modal */}
        {isPreviewModalOpen && (
            <div className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95 backdrop-blur-md">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-lg shrink-0">
                    <button
                        onClick={() => setIsPreviewModalOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                    <h2 className="text-xl font-bold text-white">Vista Previa - Informe de Riego</h2>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Exportar a PDF / Imprimir
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-auto bg-slate-900 p-8 flex justify-center">
                    <div className="shadow-2xl">
                        <PrintableIrrigationReport 
                            config={exportConfig} 
                            data={previewData} 
                            reportRef={reportRef}
                            consumptionP1={Object.values(dailyData).flat().filter(r => r.reservoir === 'pantano1' || !r.reservoir).reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0)}
                            consumptionP2={Object.values(dailyData).flat().filter(r => r.reservoir === 'pantano2').reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0)}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Water Management Section */}
        <WaterManagement 
            consumptionP1={Object.values(dailyData).flat().filter(r => r.reservoir === 'pantano1' || !r.reservoir).reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0)}
            consumptionP2={Object.values(dailyData).flat().filter(r => r.reservoir === 'pantano2').reduce((sum, item) => sum + parseFloat(item.M2 || 0), 0)}
        />

    </div>
);

};

export default Calendar;
