import React, { useMemo } from 'react';
// Asumimos que formatDate es importado correctamente desde esta ruta
import { formatDate } from '../Util/util';

const CalendarGrid = ({
    dailyData,
    selectedDate,
    setSelectedDate, // ✅ Asegúrate de que esta prop se pasa y se desestructura
    handleDayClick,
    globalGoal, // No usada en este componente, pero se mantiene por si acaso
    formatNumber,
}) => {

    // 🚨 CORRECCIÓN CLAVE 1: Manejar la espiral de cadena de fecha
    const dateObject = useMemo(() => {
        if (selectedDate) {
            const date = new Date(selectedDate + 'T00:00:00');
            // Vuelve a una fecha válida si la recibida no lo es, o usa la fecha recibida.
            return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
    }, [selectedDate]);

    if (isNaN(dateObject.getTime())) {
        return <div>Error: Fecha inválida recibida en CalendarGrid.</div>;
    }

    const today = formatDate(new Date());

    // ... (funciones auxiliares getDayData, getDailyTotal, getDayStyle - se mantienen sin cambios)
    
    const getDayData = (dateKey) => dailyData[dateKey] || {};

    const getDailyTotal = (dateKey) => {
        const dayData = getDayData(dateKey);
        return (dayData?.items?.reduce((sum, item) => sum + parseFloat(item.result || 0), 0) || 0);
    };

    const getDayStyle = (dateKey, total, hasAnyCostData) => {
        let base = "rounded-xl p-2 cursor-pointer transition duration-200 shadow-sm border border-gray-200 h-16 sm:h-24";
        const isToday = dateKey === today;
        const isSelected = dateKey === selectedDate;

        if (isToday) {
            base += " ring-4 ring-indigo-400 ring-offset-2";
        }

        if (isSelected) {
            base += " bg-indigo-50 border-indigo-500 shadow-lg";
        } else if (total > 0 && hasAnyCostData) {
            base += " bg-lime-100 border-lime-500 hover:bg-lime-200";
        } else if (total > 0) {
            base += " bg-teal-100 border-teal-500 hover:bg-teal-200";
        } else if (hasAnyCostData) {
            base += " bg-amber-100 border-amber-500 hover:bg-amber-200";
        } else {
            base += " bg-white hover:bg-gray-50";
        }
        return base;
    };

    // Generación del mes
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();

    // 0=Domingo, 1=Lunes...
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Ajuste para que la semana empiece en Lunes
    const emptyCellsBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];

    for (let i = 0; i < emptyCellsBefore; i++) {
        days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = formatDate(new Date(year, month, i));
        const total = getDailyTotal(dateKey);
        const dayData = dailyData[dateKey];
        
        // LÓGICA DE COSTE
        const hasCostInputs = dayData?.costData?.numWorkers > 0 || dayData?.costData?.hoursWorked > 0;
        const finalCostPerKg = parseFloat(dayData?.finalProductionCost || 0);
        const hasFinalCost = finalCostPerKg > 0;
        const hasAnyCostData = hasCostInputs || hasFinalCost;
        
        days.push(
            <div 
                key={dateKey} 
                className={getDayStyle(dateKey, total, hasAnyCostData)} 
                
                // Si hay producción o costes, vamos a la vista del día, si no, a editar
                onClick={() => handleDayClick && handleDayClick(dateKey, total > 0 || hasAnyCostData ? "day_view" : "edit_products")}
            >
                {/* Diseño de Celda - Responsividad Perfecta */}
                <div className="text-lg font-bold text-gray-800 flex justify-between items-center h-full flex-col sm:flex-row sm:items-start sm:h-auto">
                    {/* Número del Día - Siempre arriba a la izquierda */}
                    <span className="w-full text-left">{i}</span>
                    
                    {/* Indicador visual en móvil (Punto) */}
                    {(total > 0 || hasAnyCostData) && (
                        <span 
                            className={`w-2 h-2 rounded-full sm:hidden ${total > 0 ? 'bg-teal-500' : 'bg-amber-500'}`} 
                            title={total > 0 ? "Hay Producción" : "Hay Costes"}
                        ></span>
                    )}
                </div>
                
                {/* Producción en Kg - VISIBLE en desktop (sm:block) */}
                <p className="text-sm font-medium text-gray-600 mt-1 hidden sm:block">
                    {total > 0 ? `${formatNumber(total, 1)} Kg` : "Sin datos"}
                </p>
                
                {/* COSTE FINAL - VISIBLE en desktop (sm:block) */}
                {hasFinalCost && (
                    <p className="text-xs text-blue-600 font-semibold mt-1 hidden sm:block">
                        Coste/Kg:{" "}
                        <span className="font-bold">{formatNumber(finalCostPerKg, 4)} €</span>
                    </p>
                )}
            </div>
        );
    }

    // 🎯 FUNCIÓN CORREGIDA DE CAMBIO DE MES
    const setPreviousMonth = () => {
        // Llama a la prop setSelectedDate para cambiar la fecha del padre
        const newDate = new Date(year, month - 1, 1);
        setSelectedDate(formatDate(newDate));
    };

    // 🎯 FUNCIÓN CORREGIDA DE CAMBIO DE MES
    const setNextMonth = () => {
        // Llama a la prop setSelectedDate para cambiar la fecha del padre
        const newDate = new Date(year, month + 1, 1);
        setSelectedDate(formatDate(newDate));
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl transition duration-500">
            {/* Controles de Navegación del Mes */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={setPreviousMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                
                {/* Título del Mes y Año */}
                <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-wide">
                    {dateObject.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).toUpperCase()}
                </h2>
                
                <button onClick={setNextMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            
            {/* Encabezados de los Días de la Semana */}
            <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs sm:text-sm text-gray-500 mb-2 border-b-2 pb-2">
                {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day) => (<div key={day} className="tracking-wider">{day}</div>))}
            </div>
            
            {/* Grid de los Días del Mes */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days}
            </div>
        </div>
    );
};
export default CalendarGrid;