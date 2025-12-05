import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice'; 
import { db } from '../../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore'; 
// Components
import WeatherForecast from '../../components/COSTOS/WeatherForecast';
import SprayConditions from '../../components/COSTOS/SprayConditions';
import SprayAdvisory from '../../components/COSTOS/SprayAdvisory';
import AdvancedWeather from '../../components/Weather/AdvancedWeather';

// Helper local (mismo que en HomeContent)
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const WeatherPage = () => {
    const userId = useSelector(selectUserId);
    const appId = getAppId(); 
    
    // Configuración API
    const OPENWEATHER_API_KEY = "25d21a264f7dcdfb5be61655b423da67"; // Usando la misma key del HomeContent
    
    const [location, setLocation] = useState({
        lat: null, 
        lon: null, 
        city: "Balsicas,ES", // Default
        name: "Ubicación Predeterminada"
    });
    const [loadingLocation, setLoadingLocation] = useState(true);

    // 1. Fetch Farm Location
    useEffect(() => {
        if (!userId) return;

        const fetchFarmLocation = async () => {
            try {
                // Ruta: artifacts/{appId}/public/data/farms
                // Buscamos farm del usuario
                const farmsRef = collection(db, `artifacts/${appId}/public/data/farms`);
                // Asumimos que el usuario tiene 'created_by' o que filtramos por userId si hay campo
                // En HomeContent no filtran explícitamente en la query mostrada, pero aqui voy a buscar por el usuario o tomar el primero
                
                // Opción A: Buscar por owner
                // const q = query(farmsRef, where("userId", "==", userId));
                
                // Opción B: Tomar todos y filtrar (si la colección es pequeña) o si userId es parte del documento
                const querySnapshot = await getDocs(farmsRef);
                
                let foundFarm = null;
                querySnapshot.forEach((doc) => {
                   const data = doc.data();
                   if (data.userId === userId || data.ownerId === userId) { // Ajustar según esquema real
                       foundFarm = data;
                   }
                });

                // Si no encontramos con filtro, cogemos el primero (para demo) o el que tenga coordenadas
                if (!foundFarm && !querySnapshot.empty) {
                     // Fallback inteligente: buscar el que tenga lat/lon
                     querySnapshot.forEach(doc => {
                         const d = doc.data();
                         if (d.latitude && d.longitude) foundFarm = d;
                     });
                }

                if (foundFarm && foundFarm.latitude && foundFarm.longitude) {
                    setLocation({
                        lat: foundFarm.latitude,
                        lon: foundFarm.longitude,
                        city: foundFarm.municipality || "Mi Finca", // O usar lat/lon directamente
                        name: foundFarm.farmName || "Mi Finca"
                    });
                }
            } catch (error) {
                console.error("Error fetching farm location:", error);
            } finally {
                setLoadingLocation(false);
            }
        };

        fetchFarmLocation();
    }, [userId, appId]);

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-50/50">
            
            {/* Header Page */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Clima y Fitosanidad</h1>
                    <p className="text-gray-500 mt-1">
                        Análisis meteorológico avanzado para {location.name} 
                        {location.lat && <span className="text-xs font-mono ml-2 opacity-60">({parseFloat(location.lat).toFixed(4)}, {parseFloat(location.lon).toFixed(4)})</span>}
                    </p>
                </div>
                {/* Could add date/time here */}
            </div>

            {/* Grid Layout - Ajustado para mejor visualización */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
                
                {/* Left Column: Forecast (Reducido a ~40% width) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {/* Main Forecast Card */}
                    <div className="h-full">
                         {/* Usamos el componente WeatherForecast existente.
                             NOTA: Si el componente no acepta lat/lon, le pasamos la city. 
                             Si queremos usar lat/lon, deberíamos actualizar WeatherForecast. 
                             Por ahora, si lat/lon existe, WeatherForecast debería usarlo si lo modificamos.
                             Si no ha sido modificado, pasamos location.city o una city construida.
                         */}
                        <WeatherForecast 
                            apiKey={OPENWEATHER_API_KEY} 
                            city={location.lat ? undefined : location.city} 
                            // Pasamos props extra por si acaso actualizamos el componente después
                            lat={location.lat}
                            lon={location.lon}
                        />
                    </div>
                </div>

                {/* Right Column: Advanced Details & Advisory (Ampliado a ~60% width) */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                    {/* Advanced Current Weather (New Component) */}
                    <AdvancedWeather 
                        apiKey={OPENWEATHER_API_KEY} 
                        lat={location.lat} 
                        lon={location.lon} 
                        city={location.city} 
                    />

                    {/* Quick Advisory Card */}
                    <SprayAdvisory 
                        apiKey={OPENWEATHER_API_KEY} 
                        city={location.city} // SprayAdvisory necesita City o Lat/Lon. Revisar si lo actualizamos.
                        lat={location.lat}
                        lon={location.lon}
                    />
                </div>
            </div>

            {/* Bottom Section: Full Width Spray Timeline */}
            <div className="mb-8">
                <SprayConditions 
                    apiKey={OPENWEATHER_API_KEY} 
                    city={location.city}
                    lat={location.lat}
                    lon={location.lon}
                />
            </div>

        </div>
    );
};

export default WeatherPage;
