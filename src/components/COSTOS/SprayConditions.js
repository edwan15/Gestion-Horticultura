import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaWind, FaTint, FaThermometerHalf, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaLeaf, FaTimes } from 'react-icons/fa';

// =======================================================================
// === UTILS & LOGIC
// =======================================================================

// Calcula si es de día o de noche basado en la hora (Simplificado para España)
const isDaytime = (hour) => hour >= 7 && hour < 20;

// Clasificación detallada: Retorna estado + factores limitantes
// Clasificación detallada: Retorna estado + factores limitantes
const evaluateCondition = (windKph, windGustKph, humidity, temp, rainProb = 0) => {
    const factors = [];
    
    // 1. VIENTO (Factor Crítico - Actualizado con Ráfagas)
    // Se considera el VIENTO MÁXIMO (Ráfaga o sostenido)
    const maxWind = Math.max(windKph, windGustKph);

    // Rojo: > 20 km/h (Ya sea sostenido o ráfaga)
    if (maxWind > 20) factors.push('wind'); // PROHIBIDO
    
    // 2. HUMEDAD
    if (humidity < 40 || humidity > 90) factors.push('humidity');
    
    // 3. TEMPERATURA
    if (temp > 28 || temp < 5) factors.push('temp');

    // 4. LLUVIA
    if (rainProb > 0.5) factors.push('rain');

    // Evaluación Final
    
    if (factors.includes('wind') || factors.includes('rain')) {
         return { status: 'bad', color: 'bg-rose-500', text: 'text-rose-600', icon: 'red', factors };
    }

    if (factors.length >= 2) {
        return { status: 'bad', color: 'bg-rose-500', text: 'text-rose-600', icon: 'red', factors };
    }

    // Precaución: < 5 (inversión) o 12-20 (deriva moderada)
    // Analizamos el viento sostenido para la inversión, y el máximo para la deriva
    const isWindCaution = windKph < 5 || (maxWind >= 12 && maxWind <= 20);
    
    if (isWindCaution || factors.length > 0) {
        if (isWindCaution && !factors.includes('wind')) factors.push('wind'); 
        return { status: 'marginal', color: 'bg-amber-400', text: 'text-amber-500', icon: 'orange', factors };
    }
    
    return { status: 'good', color: 'bg-emerald-500', text: 'text-emerald-600', icon: 'green', factors: [] };
};

const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
};

// Interpolación Lineal
const lerp = (start, end, t) => start * (1 - t) + end * t;

// =======================================================================
// === COMPONENTE PRINCIPAL
// =======================================================================

const SprayConditions = ({ apiKey, city, lat, lon }) => {
    const [dailyData, setDailyData] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apiKey) return;
        
        const fetchData = async () => {
            try {
                let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&lang=es`;
                // Priorizar coordenadas si existen
                if (lat && lon) {
                    url += `&lat=${lat}&lon=${lon}`;
                } else {
                    url += `&q=${city}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                if (data.list) processData(data.list);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching forecast:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [apiKey, city, lat, lon]);

    const processData = (list) => {
        const daysMap = {};
        
        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0];
            
            if (!daysMap[dayKey]) {
                daysMap[dayKey] = {
                    date: date,
                    rawItems: []
                };
            }
            daysMap[dayKey].rawItems.push({
                hour: date.getHours(),
                temp: item.main.temp,
                wind: item.wind.speed * 3.6,
                gust: (item.wind.gust || item.wind.speed) * 3.6, // Capturamos ráfaga
                humidity: item.main.humidity,
                pop: item.pop || 0
            });
        });

        // Procesar interpolación 24h
        const processedDays = Object.values(daysMap).slice(0, 5).map(day => {
            const hourlyItems = [];
            
            for (let h = 0; h < 24; h++) {
                let prev = day.rawItems.find(i => i.hour <= h && i.hour > h - 4);
                let next = day.rawItems.find(i => i.hour > h);
                if (!prev && day.rawItems.length > 0) prev = day.rawItems[0];
                if (!next && day.rawItems.length > 0) next = day.rawItems[day.rawItems.length - 1];
                if (!prev || !next) continue;

                let t = 0;
                if (next.hour !== prev.hour) t = (h - prev.hour) / (next.hour - prev.hour);
                t = Math.max(0, Math.min(1, t));

                const wind = lerp(prev.wind, next.wind, t);
                const gust = lerp(prev.gust, next.gust, t); // Interpolamos ráfaga
                const hum = lerp(prev.humidity, next.humidity, t);
                const temp = lerp(prev.temp, next.temp, t);
                const pop = lerp(prev.pop, next.pop, t);

                const condition = evaluateCondition(wind, gust, hum, temp, pop);
                const isDay = isDaytime(h);

                hourlyItems.push({
                    hour: h,
                    wind: Math.round(wind),
                    gust: Math.round(gust),
                    humidity: Math.round(hum),
                    temp: Math.round(temp),
                    pop,
                    isDay,
                    condition
                });
            }

            // Estadísticas Avanzadas
            const stats = {
                goodDay: hourlyItems.filter(i => i.isDay && i.condition.status === 'good').length,
                goodNight: hourlyItems.filter(i => !i.isDay && i.condition.status === 'good').length,
                marginal: hourlyItems.filter(i => i.condition.status === 'marginal').length,
                bad: hourlyItems.filter(i => i.condition.status === 'bad').length,
            };

            return { ...day, hourlyItems, stats };
        });

        setDailyData(processedDays);
    };

    if (loading) return <div className="h-96 bg-gray-50 rounded-xl animate-pulse"></div>;
    if (dailyData.length === 0) return null;

    const currentDay = dailyData[selectedDayIndex];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
            
            {/* 1. Header Simple */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaLeaf className="text-emerald-500" />
                <h2 className="text-lg font-bold text-gray-700">Condiciones de pulverización</h2>
                <span className="text-sm text-gray-400 ml-auto">Próximos 5 días</span>
            </div>

            {/* 2. Tabs "Pro" (Stacked Bars) */}
            <div className="flex border-b border-gray-200 bg-gray-50/30 overflow-x-auto scrollbar-hide">
                {dailyData.map((day, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`
                            flex-1 min-w-[140px] px-2 py-3 flex flex-col items-center gap-2 border-r border-gray-100 transition-colors relative
                            ${selectedDayIndex === idx ? 'bg-white shadow-[inset_0_-3px_0_0_#10b981]' : 'hover:bg-white'}
                        `}
                    >
                        {/* Selected Indicator Top */}
                        {selectedDayIndex === idx && <div className="absolute top-0 w-full h-1 bg-emerald-500"></div>}

                        {/* Nombre Día */}
                        <span className={`text-xs font-bold uppercase ${selectedDayIndex === idx ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {idx === 0 ? 'Hoy' : formatDate(day.date)}
                        </span>

                        {/* Stats Row (Sol / Luna) */}
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                            <div className="flex items-center gap-1">
                                <FaSun className="text-orange-400" /> 
                                <span>{day.stats.goodDay}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaMoon className="text-indigo-400" />
                                <span>{day.stats.goodNight}h</span>
                            </div>
                        </div>

                        {/* Stacked Bar Visual */}
                        <div className="w-full h-8 flex rounded mt-1 overflow-hidden">
                            {/* Verde Día (Solo visual simplificado, usando % real sería ideal pero esto funciona bien) */}
                            {day.hourlyItems.map((h, i) => (
                                <div key={i} className={`flex-1 ${h.condition.color} h-full border-r border-white/20 opacity-80`} />
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* 3. Panel Principal del Día */}
            <div className="p-6">
                
                {/* Título del Panel */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-blue-500 flex items-center gap-2">
                            Condición horaria para {selectedDayIndex === 0 ? 'Hoy' : formatDate(currentDay.date)}:
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-1">{currentDay.date.toLocaleDateString()}</p>
                    </div>

                    {/* Resumen Stats Grande */}
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adecuado (Día)</div>
                            <span className="text-2xl font-light text-gray-700">{currentDay.stats.goodDay}h</span>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mb-1"><span className="w-2 h-2 rounded-full bg-emerald-700"></span> Adecuado (Noche)</div>
                            <span className="text-2xl font-light text-gray-700 underline decoration-emerald-500">{currentDay.stats.goodNight}h</span>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Evitar</div>
                            <span className="text-2xl font-light text-gray-700">{currentDay.stats.marginal}h</span>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center gap-1 text-xs text-rose-600 font-bold mb-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> No aconsejable</div>
                            <span className="text-2xl font-light text-gray-700">{currentDay.stats.bad}h</span>
                        </div>
                    </div>
                </div>

                {/* THE TIMELINE (Full Width) */}
                <div className="mb-8">
                    {/* Time Labels */}
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1 px-1">
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(h => (
                            <span key={h} className="w-[4%] text-center">{h}h</span>
                        ))}
                    </div>

                    <div className="h-6 w-full flex rounded overflow-hidden">
                        {currentDay.hourlyItems.map((h, i) => (
                            <div 
                                key={i} 
                                className={`flex-1 ${h.condition.color} border-r border-white/30 relative group`}
                                title={`${h.hour}:00 - ${Math.round(h.wind)} km/h`}
                            >
                                {/* Tooltip on Hover */}
                                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                    {h.hour}:00 | {h.wind}km/h | {h.humidity}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. RESTRICTION MATRIX (The "Why") */}
                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-gray-400 text-xs mb-4 uppercase tracking-wider">Motivos de las restricciones (Factores Limitantes)</h4>
                    
                    {/* Layout Grid: Icon Labels | Timeline Dots */}
                    
                    {/* Row: Wind */}
                    <div className="flex items-center mb-4">
                        <div className="w-8 flex justify-center text-gray-400" title="Viento"><FaWind /></div>
                        <div className="flex-1 flex px-1">
                            {currentDay.hourlyItems.map((h, i) => (
                                <div key={i} className="flex-1 flex justify-center">
                                    {h.condition.factors.includes('wind') && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row: Rain */}
                    <div className="flex items-center mb-4">
                        <div className="w-8 flex justify-center text-gray-400" title="Lluvia"><FaTint /></div>
                        <div className="flex-1 flex px-1">
                            {currentDay.hourlyItems.map((h, i) => (
                                <div key={i} className="flex-1 flex justify-center">
                                     {h.condition.factors.includes('rain') && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row: Temperature */}
                    <div className="flex items-center">
                        <div className="w-8 flex justify-center text-gray-400" title="Temperatura"><FaThermometerHalf /></div>
                        <div className="flex-1 flex px-1">
                            {currentDay.hourlyItems.map((h, i) => (
                                <div key={i} className="flex-1 flex justify-center">
                                     {h.condition.factors.includes('temp') && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SprayConditions;
