import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaWind, FaTint, FaCompressArrowsAlt, FaEye, FaThermometerThreeQuarters, FaRegClock } from 'react-icons/fa';
import { WiHumidity, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';

const AdvancedWeather = ({ apiKey, lat, lon, city }) => {
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apiKey) return;

        const fetchData = async () => {
            let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&lang=es`;
            if (lat && lon) {
                url += `&lat=${lat}&lon=${lon}`;
            } else {
                url += `&q=${city}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) setCurrent(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching current weather:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [apiKey, lat, lon, city]);

    if (loading) return <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse border border-gray-100"></div>;
    if (!current) return null;

    // Conversiones
    const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const windDeg = current.wind.deg || 0;
    const visibilityKm = (current.visibility / 1000).toFixed(1);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider flex items-center gap-2">
                    <FaThermometerThreeQuarters className="text-red-500"/> Tiempo Real
                </h3>
                <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                    Actualizado: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* COL 1: Main Temp & Feel */}
                    <div className="flex flex-col justify-center items-center md:items-start min-w-[140px]">
                        <div className="relative">
                            <span className="text-6xl font-black text-gray-800 tracking-tighter">{Math.round(current.main.temp)}°</span>
                            <span className="absolute top-2 -right-4 text-2xl text-gray-400">C</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mt-1">Sensación: <span className="text-gray-700 font-bold">{Math.round(current.main.feels_like)}°</span></p>
                        <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold capitalize border border-blue-100">
                            {current.weather[0].description}
                        </div>
                    </div>

                    {/* COL 2: Compass & Wind */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden group">
                        
                        {/* Brújula Visual */}
                        <div className="relative w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center shadow-inner mb-2 bg-white">
                            <span className="absolute top-1 text-[8px] font-bold text-gray-400">N</span>
                            <span className="absolute bottom-1 text-[8px] font-bold text-gray-400">S</span>
                            <span className="absolute left-1 text-[8px] font-bold text-gray-400">O</span>
                            <span className="absolute right-1 text-[8px] font-bold text-gray-400">E</span>
                            
                            {/* Flecha */}
                            <div 
                                className="w-1 h-10 bg-gradient-to-t from-gray-300 to-red-500 absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom transition-transform duration-1000 ease-out shadow-sm"
                                style={{ transform: `translateX(-50%) rotate(${windDeg}deg)` }}
                            ></div>
                            <div className="w-2 h-2 bg-gray-700 rounded-full absolute z-10"></div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Viento</p>
                            <p className="text-xl font-black text-gray-700">{Math.round(current.wind.speed * 3.6)} <span className="text-xs font-normal text-gray-400">km/h</span></p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{windDeg}° Dirección</p>
                        </div>
                    </div>

                    {/* COL 3: Detailed Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        {/* Sunrise/Sunset */}
                         <div className="flex flex-col p-3 rounded-lg hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100 group/sun">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1 group-hover/sun:text-orange-500">
                                <WiSunrise className="text-xl -ml-1 text-orange-400" /> Sol
                            </span>
                            <div className="flex justify-between items-end mt-1">
                                <div className="text-xs">
                                    <p className="text-gray-700 font-bold">{sunrise}</p>
                                    <p className="text-gray-400">Amanecer</p>
                                </div>
                                <div className="text-xs text-right">
                                    <p className="text-gray-700 font-bold">{sunset}</p>
                                    <p className="text-gray-400">Puesta</p>
                                </div>
                            </div>
                        </div>

                        {/* Visibilidad */}
                        <div className="flex flex-col p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <FaEye className="text-purple-400" /> Visibilidad
                            </span>
                             <p className="text-lg font-bold text-gray-700 mt-1">{visibilityKm} <span className="text-xs font-normal text-gray-400">km</span></p>
                        </div>

                        {/* Presión */}
                        <div className="flex flex-col p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <WiBarometer className="text-xl -ml-1 text-emerald-400" /> Presión
                            </span>
                             <p className="text-lg font-bold text-gray-700 mt-1">{current.main.pressure} <span className="text-xs font-normal text-gray-400">hPa</span></p>
                        </div>

                         {/* Humedad */}
                        <div className="flex flex-col p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <WiHumidity className="text-xl -ml-1 text-blue-400" /> Humedad
                            </span>
                             <p className="text-lg font-bold text-gray-700 mt-1">{current.main.humidity}<span className="text-xs font-normal text-gray-400">%</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdvancedWeather;
