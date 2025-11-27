import React, { useState, useEffect, useCallback } from "react";
import {
    FaSun,
    FaCloud,
    FaCloudRain,
    FaSnowflake,
    FaBolt,
    FaSmog,
    FaWind,
    FaHome,
    FaArrowUp,
    FaArrowDown,
    FaCloudShowersHeavy,
    FaCalendarAlt, // Icono moderno para pronóstico
} from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";

// =======================================================================
// === FUNCIONES DE UTILIDAD (Mantenidas y mejoradas)
// =======================================================================

/**
 * Selecciona un icono y color basado en el estado principal del clima.
 */
const getWeatherIcon = (main, isSmall = false) => {
    // Clases para el tamaño: grande (principal) o pequeño (pronóstico)
    const sizeClass = isSmall ? "text-2xl" : "text-7xl lg:text-8xl";
    
    // Mapeo de condiciones con colores de gradiente y descripciones
    const colorMap = {
        Clear: { icon: <FaSun className={`text-yellow-400 ${sizeClass}`} />, grad: "from-blue-400 to-sky-300", desc: "Despejado" },
        Clouds: { icon: <FaCloud className={`text-gray-400 ${sizeClass}`} />, grad: "from-gray-300 to-gray-200", desc: "Nublado" },
        Rain: { icon: <FaCloudRain className={`text-blue-500 ${sizeClass}`} />, grad: "from-blue-600 to-blue-400", desc: "Lluvia" },
        Drizzle: { icon: <FaCloudShowersHeavy className={`text-blue-400 ${sizeClass}`} />, grad: "from-blue-500 to-blue-300", desc: "Llovizna" },
        Snow: { icon: <FaSnowflake className={`text-blue-200 ${sizeClass}`} />, grad: "from-blue-300 to-cyan-100", desc: "Nieve" },
        Thunderstorm: { icon: <FaBolt className={`text-yellow-600 ${sizeClass}`} />, grad: "from-gray-700 to-yellow-600", desc: "Tormenta" },
        Mist: { icon: <FaSmog className={`text-gray-300 ${sizeClass}`} />, grad: "from-gray-400 to-gray-100", desc: "Niebla/Bruma" },
        Haze: { icon: <FaSmog className={`text-gray-300 ${sizeClass}`} />, grad: "from-gray-400 to-gray-100", desc: "Bruma" },
        default: { icon: <FaWind className={`text-gray-400 ${sizeClass}`} />, grad: "from-gray-300 to-gray-100", desc: "Condición" },
    };

    return colorMap[main] || colorMap.default;
};

/**
 * Agrupa los datos del pronóstico (cada 3 horas) por día.
 */
const groupForecastByDay = (list) => {
    const dailyForecast = {};

    list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        // Usa 'long' para el nombre del día para la vista profesional (luego se acortará en la UI)
        const dayKey = date.toLocaleDateString("es-ES", { weekday: 'long', day: '2-digit', month: '2-digit' });

        if (!dailyForecast[dayKey]) {
            dailyForecast[dayKey] = {
                date: dayKey,
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                main: item.weather[0].main,
                description: item.weather[0].description,
            };
        } else {
            dailyForecast[dayKey].minTemp = Math.min(dailyForecast[dayKey].minTemp, item.main.temp_min);
            dailyForecast[dayKey].maxTemp = Math.max(dailyForecast[dayKey].maxTemp, item.main.temp_max);
        }
    });

    // Devuelve el array de pronósticos, omitiendo el primer día (el día actual)
    return Object.values(dailyForecast).slice(1);
};


// =======================================================================
// === SUB-COMPONENTES AUXILIARES PARA LA UI (Mejorados)
// =======================================================================

/**
 * Tarjeta de detalle (Mínima y elegante).
 */
const DetailCard = ({ icon, label, value }) => (
    <div className="flex flex-col items-center p-3 rounded-lg border border-gray-100 bg-white/70 backdrop-blur-sm">
        <div className="text-gray-500 mb-1">{icon}</div>
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="font-bold text-gray-800 text-sm">{value}</span>
    </div>
);

/**
 * Item para el pronóstico de un día (Diseño de barra de temperatura).
 */
const ForecastItem = ({ day }) => {
    const { icon } = getWeatherIcon(day.main, true);
    const tempMax = Math.round(day.maxTemp);
    const tempMin = Math.round(day.minTemp);

    const formattedDay = day.date.split(',')[0].substring(0, 3).toUpperCase(); // Jue, Vie
    const formattedDate = day.date.split(', ')[1]; // 07/11

    // Calculamos el rango de temperatura para la barra visual (ej: de 15 a 30)
    // Esto es un placeholder visual y requiere lógica compleja si se hace global.
    const minRange = 10;
    const maxRange = 35;
    const totalRange = maxRange - minRange;
    const leftOffset = ((tempMin - minRange) / totalRange) * 100;
    const width = ((tempMax - tempMin) / totalRange) * 100;


    return (
        <div className="flex items-center p-2 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150 ease-in-out">
            {/* Día y Fecha */}
            <div className="flex flex-col items-start w-1/5 min-w-[70px]">
                <p className="font-bold text-sm text-gray-800">{formattedDay}</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
            </div>
            
            {/* Icono y Descripción (Visible en todos los tamaños) */}
            <div className="flex items-center justify-start w-1/4 sm:w-1/5 min-w-[80px]">
                <div className="mr-2 text-xl">{icon}</div>
                <p className="capitalize text-sm text-gray-600 hidden md:block">
                    {day.description}
                </p>
            </div>
            
            {/* Temperaturas Min/Max y Barra Visual */}
            <div className="flex-1 flex items-center justify-end">
                <p className="font-medium text-blue-500 text-sm w-1/6 min-w-[30px] text-right">{tempMin}°</p>
                
                {/* Barra de Rango de Temperatura (Elemento Visual Avanzado) */}
                <div className="relative h-1 w-2/3 mx-4 bg-gray-200 rounded-full hidden sm:block">
                    {/* El gradiente simula la variación de frío a calor */}
                    <div 
                        className="absolute h-1 rounded-full bg-gradient-to-r from-blue-300 to-red-400"
                        style={{ 
                            left: `${leftOffset}%`, 
                            width: `${width}%`,
                            minWidth: '5px' // Evita que la barra desaparezca si Max = Min
                        }}
                    ></div>
                </div>

                <p className="font-bold text-red-500 text-sm w-1/6 min-w-[30px] text-left">{tempMax}°</p>
            </div>
        </div>
    );
};


// =======================================================================
// === COMPONENTE PRINCIPAL: WeatherForecast
// =======================================================================
const WeatherForecast = ({ city = "Balsicas,es", apiKey }) => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    const fetchForecast = useCallback(async () => {
        // ... (Lógica de fetch mantenida)
        setLoading(true);
        setError(null);
        setForecastData(null);

        try {
            const response = await fetch(API_FORECAST_URL);
            const data = await response.json();

            if (response.ok) {
                setForecastData(data);
            } else {
                setError(`Error al cargar el clima: ${data.message || "Ciudad no encontrada o clave inválida."}`);
            }
        } catch (err) {
            setError("No se pudo conectar con el servicio del clima.");
        } finally {
            setLoading(false);
        }
    }, [API_FORECAST_URL]);

    useEffect(() => {
        if (!apiKey) {
            setError("Error: La clave API de OpenWeatherMap no ha sido proporcionada.");
            setLoading(false);
            return;
        }
        fetchForecast();
    }, [apiKey, fetchForecast]);

    // Manejo de Estados (Carga, Error, No Data)
    if (loading) return <div className="p-8 text-center text-gray-500">Cargando pronóstico para **{city}**...</div>;
    if (error) return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl m-4"><p className="font-semibold">⚠️ {error}</p></div>;
    if (!forecastData || !forecastData.list || forecastData.list.length === 0) return <div className="p-4 text-center text-gray-500">No hay datos de pronóstico disponibles.</div>;

    const currentWeather = forecastData.list[0];
    const mainWeather = currentWeather.weather[0];
    const { icon, grad } = getWeatherIcon(mainWeather.main);
    const dailyForecast = groupForecastByDay(forecastData.list); 

    const currentTemp = Math.round(currentWeather.main.temp);
    const maxTemp = Math.round(currentWeather.main.temp_max);
    const minTemp = Math.round(currentWeather.main.temp_min);

    // =======================================================================
    // === RENDERIZADO DEL COMPONENTE PRINCIPAL (Responsivo y Profesional)
    // =======================================================================
    return (
        // 🚀 RESPONSIVIDAD CLAVE: w-full h-full para llenar cualquier contenedor de grid.
        <div className="w-full h-full min-h-[500px] p-0 rounded-2xl shadow-3xl overflow-hidden bg-white/50 backdrop-blur-lg">
            
            {/* 1. SECCIÓN PRINCIPAL (CLIMA ACTUAL) - Fondo con Gradiente Dinámico */}
            <div className={`p-8 sm:p-10 text-white bg-gradient-to-br ${grad} shadow-xl flex flex-col items-center justify-center`}>
                
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 flex items-center">
                    <FaHome className="mr-2 text-white/80" /> {forecastData.city.name}
                </h3>
                <p className="text-sm font-light mb-6 opacity-80">{new Date().toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <div className="flex items-center justify-center w-full">
                    {/* Icono de Clima */}
                    <div className="mr-6 transform hover:scale-105 transition duration-300">
                        {icon}
                    </div>

                    {/* Temperatura Principal */}
                    <div className="text-right">
                        <p className="text-8xl lg:text-9xl font-extrabold leading-none">
                            {currentTemp}°
                        </p>
                        <p className="text-2xl font-light capitalize opacity-90 mt-1">
                            {mainWeather.description}
                        </p>
                    </div>
                </div>

                {/* Temperaturas Min/Max del Día Actual */}
                <div className="flex space-x-6 mt-6">
                    <p className="flex items-center text-lg font-medium">
                        <FaArrowUp className="mr-2 text-red-300" /> Máx: {maxTemp}°C
                    </p>
                    <p className="flex items-center text-lg font-medium">
                        <FaArrowDown className="mr-2 text-blue-200" /> Mín: {minTemp}°C
                    </p>
                </div>
            </div>

            {/* 2. DETALLES Y PRONÓSTICO (Fondo blanco/claro) */}
            <div className="p-6">
                
                {/* DETALLES DEL DÍA ACTUAL (Grid Responsivo) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <DetailCard 
                        icon={<FaDroplet className="text-cyan-500" />}
                        label="Humedad"
                        value={`${currentWeather.main.humidity}%`}
                    />
                    <DetailCard 
                        icon={<FaWind className="text-gray-500" />}
                        label="Viento"
                        value={`${Math.round(currentWeather.wind.speed * 3.6)} km/h`} 
                    />
                    <DetailCard 
                        icon={<FaArrowUp className="text-red-500" />}
                        label="Presión"
                        value={`${currentWeather.main.pressure} hPa`}
                    />
                    <DetailCard 
                        icon={<FaSun className="text-yellow-500" />}
                        label="Nubes"
                        value={`${currentWeather.clouds.all}%`}
                    />
                </div>

                {/* PRONÓSTICO DE 4 DÍAS */}
                <h3 className="text-xl font-extrabold mb-4 text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-indigo-500" /> Pronóstico de 4 Días
                </h3>
                
                <div className="space-y-1">
                    {dailyForecast.slice(0, 4).map((day, index) => (
                        <ForecastItem key={index} day={day} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;


// import React, { useState, useEffect } from "react";
// import {
//   FaSun,
//   FaCloud,
//   FaCloudRain,
//   FaSnowflake,
//   FaBolt,
//   FaSmog,
//   FaWind,
//   FaHome,
//   FaArrowUp,
//   FaArrowDown,
//   FaCloudShowersHeavy,
// } from "react-icons/fa"; // Iconos para el clima
// import { FaDroplet } from "react-icons/fa6"; // Icono de humedad

// // =======================================================================
// // === FUNCIONES DE UTILIDAD (Fuera del componente para mayor claridad)
// // =======================================================================

// /**
//  * Selecciona un icono y color basado en el código de OpenWeatherMap.
//  * @param {string} main - El estado principal del clima (e.g., "Clear", "Rain").
//  * @param {boolean} isSmall - Si el icono es para la vista de pronóstico pequeño.
//  */
// const getWeatherIcon = (main, isSmall = false) => {
//   const sizeClass = isSmall ? "text-xl" : "text-5xl";
//   const colorMap = {
//     Clear: { icon: <FaSun className={`text-yellow-400 ${sizeClass}`} />, color: "text-yellow-500", desc: "Despejado" },
//     Clouds: { icon: <FaCloud className={`text-gray-400 ${sizeClass}`} />, color: "text-gray-500", desc: "Nublado" },
//     Rain: { icon: <FaCloudRain className={`text-blue-500 ${sizeClass}`} />, color: "text-blue-500", desc: "Lluvia" },
//     Drizzle: { icon: <FaCloudShowersHeavy className={`text-blue-400 ${sizeClass}`} />, color: "text-blue-400", desc: "Llovizna" },
//     Snow: { icon: <FaSnowflake className={`text-blue-200 ${sizeClass}`} />, color: "text-blue-300", desc: "Nieve" },
//     Thunderstorm: { icon: <FaBolt className={`text-yellow-600 ${sizeClass}`} />, color: "text-yellow-700", desc: "Tormenta" },
//     Mist: { icon: <FaSmog className={`text-gray-300 ${sizeClass}`} />, color: "text-gray-400", desc: "Niebla/Bruma" },
//     Smoke: { icon: <FaSmog className={`text-gray-300 ${sizeClass}`} />, color: "text-gray-400", desc: "Humo" },
//     Haze: { icon: <FaSmog className={`text-gray-300 ${sizeClass}`} />, color: "text-gray-400", desc: "Bruma" },
//     default: { icon: <FaWind className={`text-gray-400 ${sizeClass}`} />, color: "text-gray-500", desc: "Condición" },
//   };

//   return colorMap[main] || colorMap.default;
// };

// /**
//  * Agrupa los datos del pronóstico (cada 3 horas) por día.
//  * @param {Array<Object>} list - La lista de pronósticos de la API.
//  * @returns {Array<Object>} Lista de pronósticos diarios con min/max.
//  */
// const groupForecastByDay = (list) => {
//   const dailyForecast = {};

//   list.forEach((item) => {
//     // Convierte el timestamp a fecha y obtiene el día (DD/MM)
//     const date = new Date(item.dt * 1000);
//     // Usa 'es-ES' y 'short' para un formato conciso
//     const dayKey = date.toLocaleDateString("es-ES", { weekday: 'short', day: '2-digit', month: '2-digit' });

//     if (!dailyForecast[dayKey]) {
//       dailyForecast[dayKey] = {
//         date: dayKey,
//         minTemp: item.main.temp_min,
//         maxTemp: item.main.temp_max,
//         // Almacenar la primera condición del día como representante
//         main: item.weather[0].main,
//         description: item.weather[0].description,
//       };
//     } else {
//       // Actualizar la min/max temperatura
//       dailyForecast[dayKey].minTemp = Math.min(dailyForecast[dayKey].minTemp, item.main.temp_min);
//       dailyForecast[dayKey].maxTemp = Math.max(dailyForecast[dayKey].maxTemp, item.main.temp_max);
//     }
//   });

//   // Convertir el objeto a un array, excluyendo el pronóstico de hoy (el primer día)
//   // Nota: slice(1) omite el primer día, ya que la info actual ya está en el DIV 1.
//   const result = Object.values(dailyForecast).slice(1);
//   return result;
// };


// // =======================================================================
// // === SUB-COMPONENTES AUXILIARES PARA LA UI
// // =======================================================================

// /**
//  * Tarjeta de detalle para el clima actual.
//  */
// const DetailCard = ({ icon, label, value }) => (
//   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
//     <div className="flex items-center text-gray-600">
//       {icon}
//       <span className="ml-2 text-sm font-medium">{label}</span>
//     </div>
//     <span className="font-bold text-gray-800">{value}</span>
//   </div>
// );

// /**
//  * Item para el pronóstico de un día.
//  */
// const ForecastItem = ({ day }) => {
//   const { icon, color } = getWeatherIcon(day.main, true); // Ícono pequeño
//   const tempMax = Math.round(day.maxTemp);
//   const tempMin = Math.round(day.minTemp);

//   return (
//     <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-gray-50">
//       {/* Día */}
//       <p className="font-semibold text-lg text-gray-700 w-1/4">{day.date}</p>
      
//       {/* Icono */}
//       <div className={`flex items-center justify-center w-1/4 ${color}`}>
//         {icon}
//       </div>

//       {/* Descripción (oculta en pantallas pequeñas) */}
//       <p className="capitalize text-sm text-gray-500 w-1/4 hidden sm:block">
//         {day.description}
//       </p>

//       {/* Temperaturas Min/Max */}
//       <div className="flex space-x-3 w-1/4 justify-end">
//         <p className="font-bold text-gray-800">{tempMax}°C</p>
//         <p className="font-medium text-gray-500">{tempMin}°C</p>
//       </div>
//     </div>
//   );
// };


// // =======================================================================
// // === COMPONENTE PRINCIPAL: WeatherForecast
// // =======================================================================

// /**
//  * Muestra el pronóstico del tiempo actual y de varios días.
//  * @param {string} city - El nombre de la ciudad para obtener el clima (por defecto "Balsicas,es").
//  * @param {string} apiKey - La clave API de OpenWeatherMap.
//  */
// const WeatherForecast = ({ city = "Balsicas,es", apiKey }) => {
//   const [forecastData, setForecastData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // URL base de OpenWeatherMap para el pronóstico de 5 días / 3 horas
//   const API_FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

//   useEffect(() => {
//     if (!apiKey) {
//       setError("Error: La clave API de OpenWeatherMap no ha sido proporcionada.");
//       setLoading(false);
//       return;
//     }

//     const fetchForecast = async () => {
//       setLoading(true);
//       setError(null);
//       setForecastData(null);

//       try {
//         const response = await fetch(API_FORECAST_URL);
//         const data = await response.json();

//         if (response.ok) {
//           setForecastData(data);
//         } else {
//           setError(
//             `Error al cargar el clima: ${
//               data.message || "Ciudad no encontrada o clave inválida."
//             }`
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching forecast:", err);
//         setError("No se pudo conectar con el servicio del clima.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchForecast();
//   }, [city, apiKey, API_FORECAST_URL]); // Se actualiza si la ciudad o clave cambian

//   // Manejo de Estados
//   if (loading) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         Cargando pronóstico para **{city}**...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//         <p className="font-semibold">⚠️ {error}</p>
//         <p className="text-sm mt-1">Verifique la ciudad o su clave API.</p>
//       </div>
//     );
//   }

//   if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         No hay datos de pronóstico disponibles.
//       </div>
//     );
//   }

//   // Los datos actuales son el primer elemento de la lista
//   const currentWeather = forecastData.list[0];
//   const mainWeather = currentWeather.weather[0];
//   const { icon, color } = getWeatherIcon(mainWeather.main);
//   const dailyForecast = groupForecastByDay(forecastData.list); 

//   // =======================================================================
//   // === RENDERIZADO DEL COMPONENTE PRINCIPAL
//   // =======================================================================
//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-4 bg-white rounded-xl shadow-2xl max-w-4xl mx-auto">
      
//       {/* DIV 1: Información Básica del Tiempo (Clima Actual) */}
//       <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center">
//         <h3 className="text-2xl font-extrabold mb-4 flex items-center text-gray-800">
//           <FaHome className="mr-2 text-red-600" /> Clima Actual en **{forecastData.city.name}**
//         </h3>

//         {/* Icono de Clima */}
//         <div className={`p-4 rounded-full ${color}/20 mb-4`}>{icon}</div>

//         {/* Temperatura y Descripción */}
//         <p className="text-7xl font-extrabold text-red-700 mb-2">
//           {Math.round(currentWeather.main.temp)}°C
//         </p>
//         <p className="text-xl font-semibold capitalize mb-6 text-gray-600">
//           {mainWeather.description}
//         </p>

//         {/* Detalles Adicionales */}
//         <div className="grid grid-cols-2 gap-4 text-base w-full max-w-xs">
//           <DetailCard 
//             icon={<FaArrowUp className="text-red-500" />}
//             label="Máx"
//             value={`${Math.round(currentWeather.main.temp_max)}°C`}
//           />
//           <DetailCard 
//             icon={<FaArrowDown className="text-blue-500" />}
//             label="Mín"
//             value={`${Math.round(currentWeather.main.temp_min)}°C`}
//           />
//           <DetailCard 
//             icon={<FaDroplet className="text-cyan-500" />}
//             label="Humedad"
//             value={`${currentWeather.main.humidity}%`}
//           />
//           <DetailCard 
//             icon={<FaWind className="text-gray-500" />}
//             label="Viento"
//             value={`${Math.round(currentWeather.wind.speed * 3.6)} km/h`} 
//           />
//         </div>
//       </div>

//       {/* DIV 2: Pronóstico de Varios Días Detallado */}
//       <div className="flex-1 p-6">
//         <h3 className="text-2xl font-extrabold mb-6 text-gray-800 border-b pb-2">
//           Pronóstico de 4 Días
//         </h3>
//         <div className="space-y-4">
//           {/* Muestra los siguientes 4 días del pronóstico */}
//           {dailyForecast.slice(0, 4).map((day, index) => (
//             <ForecastItem key={index} day={day} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherForecast;


// import React, { useState, useEffect } from "react";
// import {
//   FaSun,
//   FaCloud,
//   FaCloudRain,
//   FaSnowflake,
//   FaBolt,
//   FaSmog,
//   FaWind,
//   FaHome,
// } from "react-icons/fa"; // Iconos para el clima

// // =======================================================================
// // === NUEVO COMPONENTE: WeatherForecast
// // =======================================================================

// /**
//  * Muestra el pronóstico del tiempo actual para una ciudad.
//  * @param {string} city - El nombre de la ciudad para obtener el clima.
//  * @param {string} apiKey - La clave API de OpenWeatherMap.
//  */
// const WeatherForecast = ({ city = "CiudadEjemplo", apiKey }) => {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // URL base de OpenWeatherMap (usando la API actual)
//   const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

//   useEffect(() => {
//     if (!apiKey) {
//       setError(
//         "Error: La clave API de OpenWeatherMap no ha sido proporcionada."
//       );
//       setLoading(false);
//       return;
//     }

//     const fetchWeather = async () => {
//       setLoading(true);
//       setError(null);
//       setWeather(null);

//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();

//         if (response.ok) {
//           setWeather(data);
//         } else {
//           // Manejar errores como ciudad no encontrada (404) o clave inválida (401)
//           setError(
//             `Error al cargar el clima: ${
//               data.message || "Ciudad no encontrada."
//             }`
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching weather:", err);
//         setError("No se pudo conectar con el servicio del clima.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeather();
//   }, [city, apiKey, API_URL]); // Vuelve a cargar si cambian la ciudad o la clave

//   // Función auxiliar para seleccionar un icono basado en el código de OpenWeatherMap
//   const getWeatherIcon = (main) => {
//     switch (main) {
//       case "Clear":
//         return {
//           icon: <FaSun className="text-yellow-400 text-5xl" />,
//           color: "text-yellow-500",
//           desc: "Despejado",
//         };
//       case "Clouds":
//         return {
//           icon: <FaCloud className="text-gray-400 text-5xl" />,
//           color: "text-gray-500",
//           desc: "Nublado",
//         };
//       case "Rain":
//       case "Drizzle":
//         return {
//           icon: <FaCloudRain className="text-blue-500 text-5xl" />,
//           color: "text-blue-500",
//           desc: "Lluvia",
//         };
//       case "Snow":
//         return {
//           icon: <FaSnowflake className="text-blue-200 text-5xl" />,
//           color: "text-blue-300",
//           desc: "Nieve",
//         };
//       case "Thunderstorm":
//         return {
//           icon: <FaBolt className="text-yellow-600 text-5xl" />,
//           color: "text-yellow-700",
//           desc: "Tormenta",
//         };
//       case "Mist":
//       case "Smoke":
//       case "Haze":
//       case "Dust":
//       case "Fog":
//       case "Sand":
//       case "Ash":
//       case "Squall":
//       case "Tornado":
//         return {
//           icon: <FaSmog className="text-gray-300 text-5xl" />,
//           color: "text-gray-400",
//           desc: "Niebla/Bruma",
//         };
//       default:
//         return {
//           icon: <FaWind className="text-gray-400 text-5xl" />,
//           color: "text-gray-500",
//           desc: "Condición",
//         };
//     }
//   };

//   // Estados de carga y error
//   if (loading) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         Cargando pronóstico...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//         <p className="font-semibold">⚠️ {error}</p>
//         <p className="text-sm mt-1">Verifique la ciudad o su clave API.</p>
//       </div>
//     );
//   }

//   // Si no hay datos de clima, mostrar un mensaje por si acaso
//   if (!weather || !weather.weather || weather.weather.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500">
//         No hay datos de clima disponibles.
//       </div>
//     );
//   }

//   const mainWeather = weather.weather[0];
//   const { icon, desc, color } = getWeatherIcon(mainWeather.main);

//   return (
//     <div className="flex flex-col items-center justify-center h-full text-gray-800">
//       <h4 className="text-xl font-bold mb-2 flex items-center">
//         <FaHome className="mr-2 text-red-600" /> Clima en **{weather.name}**
//       </h4>

//       {/* Icono de Clima */}
//       <div className={`p-4 rounded-full ${color}/20 mb-4`}>{icon}</div>

//       {/* Temperatura y Descripción */}
//       <p className="text-6xl font-extrabold text-red-700 mb-2">
//         {Math.round(weather.main.temp)}°C
//       </p>
//       <p className="text-lg font-semibold capitalize mb-4">
//         {mainWeather.description}
//       </p>

//       {/* Detalles Adicionales */}
//       <div className="flex space-x-4 text-sm w-full justify-center">
//         <div className="text-center p-2 bg-gray-100 rounded-lg">
//           <p className="font-bold">{Math.round(weather.main.temp_max)}°C</p>
//           <p className="text-xs text-gray-500">Máx.</p>
//         </div>
//         <div className="text-center p-2 bg-gray-100 rounded-lg">
//           <p className="font-bold">{Math.round(weather.main.temp_min)}°C</p>
//           <p className="text-xs text-gray-500">Mín.</p>
//         </div>
//         <div className="text-center p-2 bg-gray-100 rounded-lg">
//           <p className="font-bold">{weather.main.humidity}%</p>
//           <p className="text-xs text-gray-500">Humedad</p>
//         </div>
//       </div>
//     </div>
//   );
// };




