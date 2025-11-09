import React, { useState, useEffect } from 'react';
import { FaWind, FaTint, FaThermometerHalf, FaBell } from 'react-icons/fa';

// --- Configuración (Reemplazar con tus datos) ---
const API_KEY = 'TU_CLAVE_API_METEOROLOGICA';
const LATITUD = '40.4168'; // Ejemplo: Madrid
const LONGITUD = '-3.7038'; // Ejemplo: Madrid

// --- Lógica del Asesoramiento de Pulverización (Sin cambios) ---
const getSprayAdvice = (windSpeed_kph, humidity_perc) => {
    // 1. Criterio de Viento (Principal para deriva)
    const isOptimalWind = windSpeed_kph >= 6 && windSpeed_kph <= 15;
    const isNoSprayWind = windSpeed_kph < 5 || windSpeed_kph > 25;

    // 2. Criterio de Humedad (Secundario para evaporación)
    const isOptimalHumidity = humidity_perc >= 50 && humidity_perc <= 85;

    // Combinación de criterios (Simplificado)
    if (isNoSprayWind) {
        return { status: 'Prohibido 🛑', colorClass: 'bg-red-100 text-red-700 border-red-500' };
    }
    if (isOptimalWind && isOptimalHumidity) {
        return { status: 'Óptimo ✅', colorClass: 'bg-green-100 text-green-700 border-green-500' };
    }
    
    return { status: 'Marginal ⚠️', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-500' };
};

// --- Componente React Principal ---
const SprayAdvisory = () => {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            // Lógica de la API...
            try {
                // Simula la respuesta de la API por simplicidad del ejemplo:
                await new Promise(resolve => setTimeout(resolve, 1500)); 
                
                const mockData = [
                    { time: '10:00', temp: 18, wind: 4, humidity: 90 }, 
                    { time: '11:00', temp: 20, wind: 8, humidity: 75 }, 
                    { time: '12:00', temp: 23, wind: 12, humidity: 65 }, 
                    { time: '13:00', temp: 26, wind: 18, humidity: 50 }, 
                    { time: '14:00', temp: 28, wind: 28, humidity: 45 }, 
                ];
                
                const processedForecast = mockData.map(hour => ({
                    ...hour,
                    advice: getSprayAdvice(hour.wind, hour.humidity)
                }));
                
                setForecast(processedForecast);
                setLoading(false);

            } catch (err) {
                setError("Error al cargar el pronóstico. Revisa tu clave y la URL de la API.");
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // --- Estados de Carga y Error ---
    if (loading) {
        return (
            <div className="text-center p-5 text-gray-500">
                <FaBell className="inline-block animate-spin mr-2" /> Cargando pronóstico agrícola...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center bg-red-50 text-red-700 rounded-lg border border-red-300">
                Error: {error}
            </div>
        );
    }

    // --- RENDERIZADO RESPONSIVO ---
    return (
        <div className="w-full space-y-3">
            
            {/* Título y Subtítulo (Responsive) */}
            <p className="text-sm text-gray-500 border-b border-gray-200 pb-2 mb-2">
                Basado en Viento (6-15 km/h) y Humedad (50-85%).
            </p>
            
            {/* Encabezados de la Tabla (Visible en MD+, oculto en móvil) */}
            <div className="hidden md:grid grid-cols-5 gap-2 text-xs font-semibold text-gray-600 border-b pb-1">
                <span className="col-span-1">Hora</span>
                <span className="col-span-1 text-center">Temp</span>
                <span className="col-span-1 text-center">Viento</span>
                <span className="col-span-1 text-center">HR</span>
                <span className="col-span-1 text-center">Recomendación</span>
            </div>

            {/* BUCLE DE PRONÓSTICO HORARIO */}
            <div className="space-y-3 md:space-y-0">
                {forecast.map((hourData, index) => (
                    
                    // Contenedor de Fila: Se transforma de Flexbox (móvil) a Grid (MD+)
                    <div 
                        key={index} 
                        className={`
                            border border-gray-200 rounded-lg p-3 md:p-0 
                            md:border-none md:rounded-none md:grid md:grid-cols-5 md:gap-2 
                            items-center transition duration-200 hover:bg-gray-50
                        `}
                    >
                        
                        {/* 1. HORA (Siempre visible) */}
                        <strong className="block md:col-span-1 text-sm md:text-base font-bold text-gray-800 border-b md:border-b-0 pb-1 mb-1 md:pb-0 md:mb-0">
                            {hourData.time}
                        </strong>

                        {/* 2. DATOS: Se apilan en móvil y se distribuyen en grid en MD+ */}
                        <div className="flex justify-between items-center text-sm md:contents">
                            
                            {/* Temperatura */}
                            <span className="md:col-span-1 text-gray-700 md:text-center flex items-center md:inline-block">
                                <FaThermometerHalf className="mr-1 md:hidden text-orange-500" /> {hourData.temp}°C
                            </span>

                            {/* Viento */}
                            <span className="md:col-span-1 text-gray-700 md:text-center flex items-center md:inline-block">
                                <FaWind className="mr-1 md:hidden text-blue-500" /> {hourData.wind} km/h
                            </span>

                            {/* Humedad */}
                            <span className="md:col-span-1 text-gray-700 md:text-center flex items-center md:inline-block">
                                <FaTint className="mr-1 md:hidden text-blue-400" /> {hourData.humidity}%
                            </span>
                        </div>

                        {/* 3. RECOMENDACIÓN (Siempre destacada) */}
                        <div className="mt-2 md:mt-0 md:col-span-1 flex justify-end md:justify-center">
                            <span 
                                className={`
                                    text-xs font-semibold 
                                    py-1 px-3 rounded-full border 
                                    ${hourData.advice.colorClass}
                                `}
                            >
                                {hourData.advice.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SprayAdvisory;