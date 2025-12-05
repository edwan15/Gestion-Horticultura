import React, { useState, useEffect, useMemo } from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaBolt,
  FaSmog,
  FaWind,
  FaTint,
  FaCompressArrowsAlt,
  FaEye,
  FaCalendarDay,
  FaInfoCircle
} from "react-icons/fa";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy } from "react-icons/wi";

// =======================================================================
// === UTILS & CONFIGURATION
// =======================================================================

// Mapeo profesional de iconos (usando iconos más limpios si es posible, o estilizando los FA)
const getWeatherConfig = (main) => {
  // Ajustamos tamaños y colores para ser más sobrios y empresariales
  switch (main) {
    case "Clear":
      return { icon: <FaSun />, color: "text-orange-400", label: "Despejado" };
    case "Clouds":
      return { icon: <FaCloud />, color: "text-gray-400", label: "Nublado" };
    case "Rain": 
    case "Drizzle":
      return { icon: <FaCloudRain />, color: "text-blue-500", label: "Lluvia" };
    case "Snow":
      return { icon: <FaSnowflake />, color: "text-cyan-300", label: "Nieve" };
    case "Thunderstorm":
      return { icon: <FaBolt />, color: "text-yellow-500", label: "Tormenta" };
    case "Mist":
    case "Fog":
    case "Haze":
      return { icon: <FaSmog />, color: "text-gray-300", label: "Niebla" };
    default:
      return { icon: <FaCloud />, color: "text-gray-400", label: "Variable" };
  }
};

const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return "";
  // dateStr viene como 'YYYY-MM-DD HH:mm:ss' o similar desde la API (dt_txt)
  // Pero aquí usamos el objeto Date
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

// =======================================================================
// === COMPONENT
// =======================================================================

const WeatherForecast = ({ city = "Balsicas,es", apiKey }) => {
  const [forecastList, setForecastList] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 es hoy, 1 mañana, etc.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data
  useEffect(() => {
    if (!apiKey) {
      setError("Falta API Key");
      setLoading(false);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );
        const data = await response.json();

        if (response.ok) {
          processForecastData(data.list);
        } else {
          setError(data.message || "Error al cargar datos");
        }
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, apiKey]);

  // Procesar datos para agrupar por días
  const processForecastData = (list) => {
    const dailyData = {};
    
    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: item.dt * 1000, // timestamp ms
          temps: [],
          weather: item.weather[0], // Tomamos el primer registro como referencia visual general
          wind: [],
          humidity: [],
          pressure: []
        };
      }
      
      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].wind.push(item.wind.speed);
      dailyData[dayKey].humidity.push(item.main.humidity);
      dailyData[dayKey].pressure.push(item.main.pressure);
    });

    // Convertir a array y calcular promedios/máximos
    const processedList = Object.values(dailyData).slice(0, 5).map(day => ({
      date: day.date,
      maxTemp: Math.max(...day.temps),
      minTemp: Math.min(...day.temps),
      avgTemp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      wind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 3.6), // km/h
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      pressure: Math.round(day.pressure.reduce((a, b) => a + b, 0) / day.pressure.length),
      weather: day.weather
    }));

    setForecastList(processedList);
  };

  // Render Helpers
  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Cargando pronóstico...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg text-sm">{error}</div>;
  if (forecastList.length === 0) return null;

  const currentDay = forecastList[selectedDayIndex];
  const { icon: currentIcon, color: currentColor, label: currentLabel } = getWeatherConfig(currentDay.weather.main);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full font-sans">
      {/* HEADER: Título y Fecha Seleccionada */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="text-green-700 font-bold uppercase text-xs tracking-wider mb-1 flex items-center gap-2">
            <FaCalendarDay /> Predicción
          </h3>
          <p className="text-gray-800 text-lg font-semibold">
            {formatDate(currentDay.date, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right hidden sm:block">
           <span className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded border border-gray-100">
             {city.split(',')[0]}
           </span>
        </div>
      </div>

      {/* MAIN CONTENT: Información Detallada del Día Seleccionado */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Parte Izquierda: Icono y Temperatura Grande */}
          <div className="flex items-center gap-6">
             <div className={`text-6xl sm:text-7xl ${currentColor} drop-shadow-sm transition-transform duration-300 transform scale-100`}>
               {currentIcon}
             </div>
             <div>
               <div className="flex items-start">
                  <span className="text-6xl sm:text-7xl font-bold text-gray-800 tracking-tighter">
                    {Math.round(currentDay.maxTemp)}°
                  </span>
                  <span className="text-2xl sm:text-3xl text-gray-400 font-light mt-2 ml-2">
                    / {Math.round(currentDay.minTemp)}°
                  </span>
               </div>
               <p className="text-gray-500 text-sm font-medium mt-1 capitalize pl-1">
                 {currentDay.weather.description}
               </p>
             </div>
          </div>

          {/* Parte Derecha: Grid de Detalles */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full sm:w-auto mt-4 sm:mt-0">
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                 <FaTint className="text-blue-300"/> Humedad
               </span>
               <span className="text-gray-700 font-semibold">{currentDay.humidity}%</span>
             </div>
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                 <FaWind className="text-gray-400"/> Viento
               </span>
               <span className="text-gray-700 font-semibold">{currentDay.wind} km/h</span>
             </div>
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                 <FaCompressArrowsAlt className="text-red-300"/> Presión
               </span>
               <span className="text-gray-700 font-semibold">{currentDay.pressure} hPa</span>
             </div>
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                 <FaEye className="text-purple-300"/> Estado
               </span>
               <span className="text-gray-700 font-semibold">{currentLabel}</span>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER: Selector de Días (Interactivo) */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-5 divide-x divide-gray-100">
          {forecastList.map((day, index) => {
             const isSelected = index === selectedDayIndex;
             const { icon, color } = getWeatherConfig(day.weather.main);
             
             return (
               <button
                 key={index}
                 onClick={() => setSelectedDayIndex(index)}
                 className={`
                    group relative flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 cursor-pointer outline-none
                    ${isSelected ? 'bg-white' : 'hover:bg-gray-100'}
                 `}
               >
                 {isSelected && (
                   <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500"></div>
                 )}
                 
                 <span className={`text-xs font-semibold mb-1 uppercase ${isSelected ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                   {index === 0 ? 'Hoy' : formatDate(day.date, { weekday: 'short' })}
                 </span>
                 
                 <div className={`text-xl mb-1 ${isSelected ? color : 'text-gray-400 group-hover:text-gray-500'}`}>
                   {icon}
                 </div>
                 
                 <div className="flex items-center space-x-1 text-xs">
                    <span className={`font-bold ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                      {Math.round(day.maxTemp)}°
                    </span>
                    <span className="text-gray-300">
                      {Math.round(day.minTemp)}°
                    </span>
                 </div>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
