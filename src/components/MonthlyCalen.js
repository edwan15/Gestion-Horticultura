import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importa useNavigate
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const MonthlyCalendar = () => {
    // Hook para la navegación
    const navigate = useNavigate();
    
    // Estado para la fecha actualmente mostrada
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Lógica para generar los días del calendario
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) a 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        
        // Días de relleno del mes anterior (vacíos para el layout)
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ number: '', isCurrentMonth: false, fullDate: null });
        }

        // Días del mes actual
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isToday = (
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            );
            days.push({ 
                number: i, 
                isCurrentMonth: true, 
                isToday, 
                fullDate: date // Guardamos el objeto Date completo
            });
        }
        
        // Rellenar hasta el final de la última fila (opcional)
        const totalCells = days.length;
        if (totalCells % 7 !== 0) {
            const nextMonthDaysToShow = 7 - (totalCells % 7);
            for (let i = 0; i < nextMonthDaysToShow; i++) {
                days.push({ number: '', isCurrentMonth: false, fullDate: null });
            }
        }

        setCalendarDays(days);
    }, [currentDate]);

    // Función de manejo de clic para la navegación
    const handleDayClick = (day) => {
        if (!day.isCurrentMonth || !day.fullDate) return;

        const year = day.fullDate.getFullYear();
        // El mes en JS es 0-indexado, sumamos 1 y usamos padStart para el formato MM
        const month = String(day.fullDate.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(day.fullDate.getDate()).padStart(2, '0');

        const dateString = `${year}-${month}-${dayOfMonth}`;
        
        // Redirige a la URL deseada
        // Ejemplo de URL: /events/2025-10-07
        navigate(`/events/${dateString}`);
    };

    // Handlers de navegación
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            {/* Header y Navegación */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button 
                    onClick={goToNextMonth}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
            {/* --- */}
            {/* Nombres de los días */}
            <div className="grid grid-cols-7 gap-1">
                {dayNames.map(day => (
                    <div 
                        key={day} 
                        className="text-center text-xs font-medium text-gray-500 uppercase pb-2 border-b border-gray-200"
                    >
                        {day}
                    </div>
                ))}
            {/* --- */}
            {/* Días del Mes */}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        // Agregamos el onClick y clases condicionales para el cursor
                        onClick={() => handleDayClick(day)}
                        className={`
                            text-center p-2 rounded-full text-sm font-medium transition-all duration-150
                            ${day.isCurrentMonth
                                ? 'text-gray-800 hover:bg-indigo-100 cursor-pointer'
                                : 'text-gray-400 pointer-events-none'
                            } 
                            ${day.isToday
                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                                : ''
                            }
                            ${day.number ? 'aspect-square flex items-center justify-center' : ''}
                        `}
                    >
                        {day.number}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyCalendar;