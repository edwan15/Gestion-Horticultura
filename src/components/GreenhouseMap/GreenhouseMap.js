// src/components/GreenhouseMap/GreenhouseMap.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// =======================================================================
// === CONFIGURACIÓN DE ICONOS DE LEAFLET
// =======================================================================
// 🚨 IMPORTANTE: Esto corrige el problema común donde los iconos de marcador
// de Leaflet no se muestran debido a problemas con las rutas de Webpack.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// =======================================================================
// === COMPONENTE AUXILIAR PARA CONTROLAR LA VISTA
// =======================================================================
// Este hook se usa dentro de MapContainer para ajustar el zoom y el centro
// cada vez que la lista de invernaderos cambia.
const MapViewUpdater = ({ markers }) => {
    const map = useMap(); // Accede a la instancia del mapa

    useEffect(() => {
        if (markers.length > 0) {
            // Si solo hay un marcador, centramos el mapa en él
            if (markers.length === 1) {
                map.setView([markers[0].lat, markers[0].lng], 12); // Nivel de zoom 12
            } else {
                // Si hay varios, calculamos los límites para verlos todos
                const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
                map.fitBounds(bounds, { padding: [50, 50] }); // Ajusta la vista con un margen
            }
        }
    }, [map, markers]);

    return null;
};

// =======================================================================
// === COMPONENTE PRINCIPAL: GreenhouseMap
// =======================================================================

const GreenhouseMap = ({ greenhouses, onGreenhouseSelect, selectedGreenhouseId }) => {
    
    const defaultCenter = [40.4165, -3.70256]; // Madrid, España (Centro por defecto)
    const initialZoom = 6;

    // Prepara los datos de los marcadores, asegurándose de que la lat/lng sean números
    const markers = greenhouses
        .filter(g => g.latitude && g.longitude)
        .map(g => ({
            id: g.id,
            name: g.name,
            // Convertimos a número para Leaflet
            lat: parseFloat(g.latitude),
            lng: parseFloat(g.longitude),
        }));

    return (
        <div className="h-96 w-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* MapContainer requiere una altura fija, definida por el div padre */}
            <MapContainer 
                center={defaultCenter} 
                zoom={initialZoom} 
                scrollWheelZoom={true} // Permite el zoom con la rueda del ratón
                style={{ height: "100%", width: "100%" }}
            >
                {/* Capa base de OpenStreetMap */}
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Usa el componente auxiliar para centrar/ajustar el mapa */}
                <MapViewUpdater markers={markers} />

                {/* Renderiza los marcadores para cada invernadero */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        eventHandlers={{
                            // Destacamos el invernadero seleccionado con una clase si usas un custom icon
                            // click: () => onGreenhouseSelect(marker.id),
                        }}
                    >
                        {/* Popup al hacer clic en el marcador */}
                        <Popup>
                            <div className='font-bold text-indigo-700 mb-1'>
                                {marker.name}
                            </div>
                            <span className='text-xs text-gray-500'>
                                Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
                            </span>
                            <button
                                onClick={() => onGreenhouseSelect(marker.id)}
                                className='mt-2 text-sm text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded transition w-full'
                            >
                                {marker.id === selectedGreenhouseId ? 'Invernadero Actual' : 'Seleccionar Datos'}
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default GreenhouseMap;