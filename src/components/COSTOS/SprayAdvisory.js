import React, { useState, useEffect } from 'react';
import { FaWind, FaTint, FaThermometerHalf, FaBell } from 'react-icons/fa';

// --- Lógica del Asesoramiento de Pulverización (Sin cambios) ---
const getSprayAdvice = (windSpeed_kph, humidity_perc) => {
    // 1. Criterio de Viento (Principal para deriva)
    const isOptimalWind = windSpeed_kph >= 6 && windSpeed_kph <= 15;
    const isNoSprayWind = windSpeed_kph < 3 || windSpeed_kph > 20; // Ajustado un poco más estricto para "No Spray"

    // 2. Criterio de Humedad (Secundario para evaporación)
    const isOptimalHumidity = humidity_perc >= 50 && humidity_perc <= 85;

    // Combinación de criterios
    if (isNoSprayWind) {
        return { status: 'Prohibido 🛑', colorClass: 'bg-red-100 text-red-700 border-red-500' };
    }
    if (isOptimalWind && isOptimalHumidity) {
        return { status: 'Óptimo ✅', colorClass: 'bg-green-100 text-green-700 border-green-500' };
    }
    
    return { status: 'Marginal ⚠️', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-500' };
};

// --- Componente React Principal ---
const SprayAdvisory = ({ apiKey, city, lat, lon }) => {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!apiKey) {
                setLoading(false);
                return; // Esperamos a que llegue la prop
            }

            try {
                // Fetch de 5 días / 3 horas de OpenWeatherMap
                let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&lang=es`;
                
                if (lat && lon) {
                    url += `&lat=${lat}&lon=${lon}`;
                } else {
                    url += `&q=${city}`;
                }

                const response = await fetch(url);
                
                if (!response.ok) {
                   throw new Error("Error en la respuesta de la API");
                }

                const data = await response.json();
                
                // Tomamos los próximos 5 intervalos (aprox. 15 horas)
                const nextIntervals = data.list.slice(0, 5);

                const processedForecast = nextIntervals.map(item => {
                    // La API devuelve metros/segundo. Multiplicar por 3.6 para km/h
                    const windKph = Math.round(item.wind.speed * 3.6);
                    const humidity = item.main.humidity;
                    const temp = Math.round(item.main.temp);
                    
                    // Formatear hora (HH:mm)
                    const dateObj = new Date(item.dt * 1000);
                    const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                    return {
                        time: timeStr,
                        temp: temp,
                        wind: windKph,
                        humidity: humidity,
                        advice: getSprayAdvice(windKph, humidity)
                    };
                });
                
                setForecast(processedForecast);
                setLoading(false);

            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el clima.");
                setLoading(false);
            }
        };

        fetchWeather();
    }, [apiKey, city, lat, lon]);

    // --- Estados de Carga y Error ---
    if (loading) {
        return (
            <div className="text-center p-5 text-gray-500 flex items-center justify-center h-full">
                <FaBell className="animate-spin mr-2" /> Calculando condiciones...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center bg-red-50 text-red-700 rounded-lg border border-red-300">
                {error}
            </div>
        );
    }

    // --- RENDERIZADO RESPONSIVO ---
    return (
        <div className="w-full space-y-3">
            
            {/* Título y Subtítulo (Responsive) */}
            <p className="text-sm text-gray-500 border-b border-gray-200 pb-2 mb-2">
                Condiciones actuales en <span className="font-semibold text-gray-700">{city}</span>.
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