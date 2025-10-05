import React, { useState, useMemo, } from 'react';
import { useNavigate } from 'react-router-dom';

// --- FUNCIONES DE UTILDAD ---
const formatDateForLog = (dateKey) => {
    // Convierte 'YYYY-MM-DD' a un formato legible
    const date = new Date(dateKey + 'T00:00:00'); 
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

// -------------------------------------------------------
// --- 1. Componente de Registro de Actividad (Log) ---
// -------------------------------------------------------
// (Mantenido con Paginación)
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
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 h-full flex flex-col">
            <h2 className="flex justify-between items-center text-2xl font-extrabold text-indigo-800 mb-6 pb-2 border-b-4 border-indigo-100">
                <span className="flex items-center"><span role="img" aria-label="checklist" className="mr-2">📋</span>Registro de Actividad</span>
            </h2>
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow"> 
                {visibleActivities.length > 0 ? (
                    visibleActivities.map((activity, index) => (
                        <div 
                            key={startIndex + index} 
                            className={`p-4 rounded-xl shadow-md transition duration-300 ease-in-out ${activity.color === 'indigo' ? 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                        >
                            <p className={`text-sm font-bold ${activity.color === 'indigo' ? 'text-indigo-800' : 'text-gray-800'}`}>{activity.time}</p>
                            <p className="font-semibold text-gray-700 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 italic mt-0.5">{activity.details}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg py-10">💧 No hay registros de riego disponibles para este período.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1} className={paginationButtonClasses(currentPage > 1)}>&larr; Anterior</button>
                    <span className="text-sm font-medium text-gray-600">Página {currentPage} de {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className={paginationButtonClasses(currentPage < totalPages)}>Siguiente &rarr;</button>
                </div>
            )}
            <p className="text-center text-gray-400 text-sm pt-4">--- Fin de registros disponibles ---</p>
        </div>
    );
};


// ----------------------------------------------------
// --- 2. Componente Principal Calendar (Contenedor)---
// ----------------------------------------------------
const Calendar = ({ dailyData = {} }) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // PROCESAMIENTO DE DATOS DE RIEGO A LOG (Mantenido)
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
    
    // --- Lógica de renderizado del calendario (Mantenida) ---
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); 
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = (firstDayOfMonth(year, month) + 6) % 7; 
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const navButtonClasses = "px-4 py-2 font-bold rounded-xl transition duration-300 ease-in-out shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-80 transform active:scale-95";
    const baseCellClasses = "h-16 md:h-28 p-1 text-right relative border border-gray-100 cursor-pointer rounded-lg transition duration-300 ease-in-out transform hover:z-10";

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
            days.push(<div key={`prev-${i}`} className="bg-gray-50 text-gray-400 border border-gray-100 h-16 md:h-28 rounded-lg"></div>);
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
                    {/* Número del día (SIEMPRE VISIBLE) */}
                    <span className="text-xl md:text-2xl font-black block mb-1 text-right text-indigo-800">{day}</span>
                    
                    {/* 🔑 1. ICONO DE RESUMEN PEQUEÑO (OCULTO en móvil) */}
                    {hasData && (
                        <div className="
                            hidden md:flex  {/* CLAVE: Oculto por defecto, visible desde MD */}
                            absolute top-1 left-1 text-xs md:text-sm font-semibold text-emerald-700 bg-emerald-200 rounded-full px-2 py-0.5 shadow-md 
                            items-center space-x-1
                        ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className='hidden md:inline'>{summary.totalM2} M²</span>
                            <span className='md:hidden'>{summary.count}</span>
                        </div>
                    )}
                    
                    {/* 2. MODAL DE PREVISUALIZACIÓN (OCULTO en móvil) */}
                    {hasData && (
                        <div className="
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            w-56 p-4 text-sm text-left 
                            bg-indigo-700 text-white rounded-xl shadow-2xl z-20 
                            hidden md:group-hover:block opacity-0 md:group-hover:opacity-100 
                            transition-opacity duration-300 ease-out pointer-events-none 
                        ">
                            <p className="font-extrabold flex items-center mb-2 border-b border-indigo-400 pb-1">
                                <span className="text-yellow-300 mr-2 text-xl">💦</span> Datos de Riego
                            </p>
                            <p className="font-semibold text-base">
                                Total M²: <span className="text-yellow-200">{summary.totalM2}</span>
                            </p>
                            <p className="text-xs text-indigo-200 mt-1">
                                🏠 Invernadero Ejemplo: {summary.invernadero || 'N/A'}
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
            days.push(<div key={`next-${i}`} className="bg-gray-50 text-gray-400 border border-gray-100 h-16 md:h-28 rounded-lg"></div>);
        }

        return days;
    }, [year, month, totalDays, startDay, dailyData, goToDetails]);

    const changeMonth = (delta) => {
        const newDate = new Date(currentDate.getTime()); 
        newDate.setMonth(currentDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    return (
        <div className="mx-auto p-4 md:p-8 max-w-7xl bg-gray-50 shadow-2xl rounded-3xl mt-10">
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-900 mb-8 pb-3 border-b-4 border-emerald-300/50 tracking-tight">
                Riego de Invernaderos
            </h1>

            {/* CLAVE: En móvil, todo en una columna. En LG, 3 columnas. */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: CALENDARIO (lg:col-span-2) */}
                <div className="lg:col-span-2">
                    <header className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 bg-white rounded-2xl shadow-inner">
                        <button className={navButtonClasses} onClick={() => changeMonth(-1)}>&larr; Anterior</button>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 my-4 md:my-0 capitalize">{monthName}</h2>
                        <button className={navButtonClasses} onClick={() => changeMonth(1)}>Siguiente &rarr;</button>
                    </header>
                    
                    <div className="calendar-grid grid grid-cols-7 gap-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-200">
                        {dayNames.map(name => (
                            <div key={name} className="bg-indigo-600 text-white text-center p-3 font-extrabold text-sm md:text-lg tracking-wider rounded-lg shadow-md">{name}</div>
                        ))}
                        {renderDays}
                    </div>
                    
                    {/* LEYENDA: Oculta en móvil, visible desde md (tablet) */}
                    <div className="hidden md:block text-center mt-6 text-sm text-gray-600">
                        <span className="inline-block h-4 w-4 bg-emerald-50 border border-emerald-400 rounded mr-2"></span> 
                        Día con registros de riego (Haz click para ver detalles)
                    </div>

                </div>
                
                {/* 🔑 COLUMNA DERECHA: REGISTRO DE ACTIVIDAD. Visible en todas las pantallas. En móvil se apila. */}
                <div className="lg:col-span-1"> {/* Se eliminó 'hidden lg:block' */}
                    <ActivityLog 
                        logActivities={logActivities} 
                    />
                </div>

            </div>
        </div>
    );
};

export default Calendar;


