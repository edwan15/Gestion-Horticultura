import React, { useMemo } from 'react';
import { formatDate } from '../Util/util';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CalendarGrid = ({
    dailyData,
    selectedDate,
    setSelectedDate,
    handleDayClick,
    formatNumber
}) => {
    const dateObject = useMemo(() => {
        if (selectedDate) {
            const date = new Date(selectedDate + 'T00:00:00');
            return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
    }, [selectedDate]);

    if (isNaN(dateObject.getTime())) {
        return <div>Error: Fecha inválida recibida en CalendarGrid.</div>;
    }

    const today = formatDate(new Date());
    const getDayData = (dateKey) => dailyData[dateKey] || {};
    
    const getDailyTotal = (dateKey) => {
        const dayData = getDayData(dateKey);
        return (dayData?.items?.reduce((sum, item) => sum + parseFloat(item.result || 0), 0) || 0);
    };

    const getDayStyle = (dateKey, total, hasAnyCostData) => {
        let base = "rounded-xl p-2 cursor-pointer transition-all duration-300 border h-20 sm:h-28 flex flex-col justify-between group relative overflow-hidden";
        const isToday = dateKey === today;
        const isSelected = dateKey === selectedDate;

        // Base background styling
        if (isSelected) {
            // Updated to Emerald Gradient as requested
            base += " bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent shadow-lg shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2 scale-[1.05] z-10";
        } else if (isToday) {
            base += " bg-white border-emerald-400 shadow-md ring-2 ring-emerald-100";
        } else if (total > 0 && hasAnyCostData) {
            base += " bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:shadow-md";
        } else if (total > 0) {
            base += " bg-teal-50 border-teal-200 hover:border-teal-300 hover:shadow-md";
        } else if (hasAnyCostData) {
            base += " bg-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-md";
        } else {
            base += " bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50";
        }
        return base;
    };

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyCellsBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    for (let i = 0; i < emptyCellsBefore; i++) {
        days.push(<div key={`empty-${i}`} className="h-20 sm:h-28 bg-slate-50/30 rounded-xl m-1"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = formatDate(new Date(year, month, i));
        const total = getDailyTotal(dateKey);
        const dayData = dailyData[dateKey];
        const hasCostInputs = dayData?.costData?.numWorkers > 0 || dayData?.costData?.hoursWorked > 0;
        const finalCostPerKg = parseFloat(dayData?.finalProductionCost || 0);
        const hasFinalCost = finalCostPerKg > 0;
        const hasAnyCostData = hasCostInputs || hasFinalCost;
        const isSelected = dateKey === selectedDate;

        days.push(
            <div 
                key={dateKey} 
                className={getDayStyle(dateKey, total, hasAnyCostData)}
                onClick={() => handleDayClick && handleDayClick(dateKey, total > 0 || hasAnyCostData ? "day_view" : "edit_products")}
            >
                {/* Header d├¡a */}
                <div className="flex justify-between items-start">
                    <span className={`text-base font-bold w-7 h-7 flex items-center justify-center rounded-full ${isSelected ? "bg-white/20 text-white backdrop-blur-sm shadow-sm" : "text-slate-600 bg-slate-100 group-hover:bg-white"}`}>
                        {i}
                    </span>
                    
                    {/* Indicadores (Puntos) */}
                    <div className="flex gap-1">
                        {total > 0 && (
                            <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"} shadow-sm`} title="Producci├│n Registrada"></div>
                        )}
                         {hasAnyCostData && (
                            <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-amber-200" : "bg-amber-500"} shadow-sm`} title="Costes Registrados"></div>
                        )}
                    </div>
                </div>

                {/* Contenido principal (Kg) - Visible en todas las pantallas si hay espacio, priorizado */}
                <div className="flex flex-col items-center justify-center flex-grow">
                     {total > 0 ? (
                        <div className="text-center">
                            <span className={`block text-xs font-bold uppercase tracking-wider mb-0.5 ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>Total</span>
                            <span className={`block font-extrabold ${isSelected ? "text-white text-lg drop-shadow-sm" : "text-emerald-700 text-base sm:text-lg"}`}>
                                {formatNumber(total, 0)} <span className={`text-xs font-bold ${isSelected ? "text-emerald-100" : "text-emerald-500/80"}`}>Kg</span>
                            </span>
                        </div>
                     ) : (
                         <span className={`text-xs font-medium ${isSelected ? "text-emerald-200/50" : "text-slate-300"} group-hover:text-slate-400 transition-colors`}>
                             -
                         </span>
                     )}
                </div>

                 {/* Footer (Coste) */}
                 {hasFinalCost && (
                     <div className={`text-xs text-right font-bold ${isSelected ? "text-white/90" : "text-blue-600"} truncate px-1`}>
                        {formatNumber(finalCostPerKg, 2)} €/kg
                     </div>
                 )}
            </div>
        );
    }

    const setPreviousMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setSelectedDate(formatDate(newDate));
    };

    const setNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setSelectedDate(formatDate(newDate));
    };

    return (
        <div className="w-full">
            {/* Controles de Navegaci├│n del Mes */}
            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
                <button 
                    onClick={setPreviousMonth} 
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                
                {/* T├¡tulo del Mes y A├▒o */}  
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-2">
                     <span className="capitalize">{dateObject.toLocaleDateString("es-ES", { month: "long" })}</span>
                     <span className="text-slate-400 text-lg font-bold">{dateObject.getFullYear()}</span>
                </h2>
                
                <button 
                    onClick={setNextMonth} 
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                >
                    <FaChevronRight className="w-4 h-4" />
                </button>
            </div>
            
            {/* Grid */}
            <div className="bg-slate-50/50 p-2 sm:p-4 rounded-3xl border border-slate-100">
                {/* Encabezados */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day, idx) => (
                        <div key={day} className={`text-center text-xs font-bold uppercase tracking-widest ${idx >= 5 ? "text-rose-400" : "text-slate-400"}`}>
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* D├¡as */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {days}
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;