// src/components/GreenhouseMap/GreenhouseMap.jsx

// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // =======================================================================
// // === CONFIGURACIÓN DE ICONOS DE LEAFLET
// // =======================================================================
// // 🚨 IMPORTANTE: Esto corrige el problema común donde los iconos de marcador
// // de Leaflet no se muestran debido a problemas con las rutas de Webpack.
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// // =======================================================================
// // === COMPONENTE AUXILIAR PARA CONTROLAR LA VISTA
// // =======================================================================
// // Este hook se usa dentro de MapContainer para ajustar el zoom y el centro
// // cada vez que la lista de invernaderos cambia.
// const MapViewUpdater = ({ markers }) => {
//     const map = useMap(); // Accede a la instancia del mapa

//     useEffect(() => {
//         if (markers.length > 0) {
//             // Si solo hay un marcador, centramos el mapa en él
//             if (markers.length === 1) {
//                 map.setView([markers[0].lat, markers[0].lng], 12); // Nivel de zoom 12
//             } else {
//                 // Si hay varios, calculamos los límites para verlos todos
//                 const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
//                 map.fitBounds(bounds, { padding: [50, 50] }); // Ajusta la vista con un margen
//             }
//         }
//     }, [map, markers]);

//     return null;
// };

// // =======================================================================
// // === COMPONENTE PRINCIPAL: GreenhouseMap
// // =======================================================================

// const GreenhouseMap = ({ greenhouses, onGreenhouseSelect, selectedGreenhouseId }) => {
    
//     const defaultCenter = [40.4165, -3.70256]; // Madrid, España (Centro por defecto)
//     const initialZoom = 6;

//     // Prepara los datos de los marcadores, asegurándose de que la lat/lng sean números
//     const markers = greenhouses
//         .filter(g => g.latitude && g.longitude)
//         .map(g => ({
//             id: g.id,
//             name: g.name,
//             // Convertimos a número para Leaflet
//             lat: parseFloat(g.latitude),
//             lng: parseFloat(g.longitude),
//         }));

//     return (
//         <div className="h-96 w-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
//             {/* MapContainer requiere una altura fija, definida por el div padre */}
//             <MapContainer 
//                 center={defaultCenter} 
//                 zoom={initialZoom} 
//                 scrollWheelZoom={true} // Permite el zoom con la rueda del ratón
//                 style={{ height: "100%", width: "100%" }}
//             >
//                 {/* Capa base de OpenStreetMap */}
//                 <TileLayer
//                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />

//                 {/* Usa el componente auxiliar para centrar/ajustar el mapa */}
//                 <MapViewUpdater markers={markers} />

//                 {/* Renderiza los marcadores para cada invernadero */}
//                 {markers.map((marker) => (
//                     <Marker
//                         key={marker.id}
//                         position={[marker.lat, marker.lng]}
//                         eventHandlers={{
//                             // Destacamos el invernadero seleccionado con una clase si usas un custom icon
//                             // click: () => onGreenhouseSelect(marker.id),
//                         }}
//                     >
//                         {/* Popup al hacer clic en el marcador */}
//                         <Popup>
//                             <div className='font-bold text-indigo-700 mb-1'>
//                                 {marker.name}
//                             </div>
//                             <span className='text-xs text-gray-500'>
//                                 Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
//                             </span>
//                             <button
//                                 onClick={() => onGreenhouseSelect(marker.id)}
//                                 className='mt-2 text-sm text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded transition w-full'
//                             >
//                                 {marker.id === selectedGreenhouseId ? 'Invernadero Actual' : 'Seleccionar Datos'}
//                             </button>
//                         </Popup>
//                     </Marker>
//                 ))}
//             </MapContainer>
//         </div>
//     );
// };

// export default GreenhouseMap;


import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaSeedling, FaTag, FaMapMarkerAlt } from 'react-icons/fa'; // Iconos para el Popup

// =======================================================================
// === CONFIGURACIÓN DE ICONOS DE LEAFLET
// =======================================================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// =======================================================================
// === DATOS DE LOS INVERNADEROS (HARDCODED)
// =======================================================================
const INITIAL_GREENHOUSES_DATA = [
    { id: '1', name: 'Invernadero 1', latitude: 37.823898, longitude: -0.942473, crop: 'Tomate Raff' },
    { id: '2', name: 'Invernadero 2', latitude: 37.824257, longitude: -0.941019, crop: 'Pimiento Lamuyo' },
    { id: '3', name: 'Invernadero 3', latitude: 37.825147, longitude: -0.939871, crop: 'Calabacín' },
    { id: '4', name: 'Invernadero 4', latitude: 37.827003, longitude: -0.940311, crop: 'Berenjena' },
    { id: '5', name: 'Invernadero 5', latitude: 37.825550, longitude: -0.940879, crop: 'Vacío' },
];

// =======================================================================
// === COMPONENTE AUXILIAR PARA CONTROLAR LA VISTA
// =======================================================================
const MapViewUpdater = ({ markers }) => {
    const map = useMap(); // Accede a la instancia del mapa

    useEffect(() => {
        if (markers.length > 0) {
            // Calculamos los límites para ver todos los marcadores
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            // Ajusta la vista con un margen y un zoom razonable
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 }); 
        }
    }, [map, markers]);

    return null;
};

// =======================================================================
// === COMPONENTE PRINCIPAL: GreenhouseMap
// =======================================================================

// Nota: He ignorado las props 'greenhouses', 'onGreenhouseSelect', 'selectedGreenhouseId'
// por simplicidad y he usado los datos hardcodeados, si quieres integrarlos
// con tu Firebase, usa 'greenhouses' en lugar de INITIAL_GREENHOUSES_DATA.
const GreenhouseMap = ({ /* ...props */ }) => {
    // 💡 Usamos un estado local para gestionar los datos de los invernaderos,
    // incluyendo el campo editable 'crop'.
    const [greenhouses, setGreenhouses] = useState(INITIAL_GREENHOUSES_DATA);

    const handleCropChange = useCallback((id, newCrop) => {
        setGreenhouses(prev => 
            prev.map(g => (g.id === id ? { ...g, crop: newCrop } : g))
        );
        // 🚨 Aquí podrías agregar la lógica para guardar el dato en Firebase 
        // o llamando a una función pasada por props.
        console.log(`Guardando Invernadero ${id}: ${newCrop}`);
    }, []);

    // Prepara los datos de los marcadores con coordenadas numéricas
    const markers = greenhouses
        .filter(g => g.latitude && g.longitude)
        .map(g => ({
            id: g.id,
            name: g.name,
            crop: g.crop,
            lat: parseFloat(g.latitude),
            lng: parseFloat(g.longitude),
        }));

    return (
        <div className="h-96 w-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <MapContainer 
                // Usamos el centro del primer invernadero como inicial antes del ajuste
                center={[markers[0]?.lat || 37.825, markers[0]?.lng || -0.941]} 
                zoom={12} // Un zoom inicial que será ajustado por MapViewUpdater
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Usa el componente auxiliar para centrar/ajustar el mapa a todos los marcadores */}
                <MapViewUpdater markers={markers} />

                {/* Renderiza los marcadores para cada invernadero */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                    >
                        {/* 💡 Tooltip: Muestra el nombre al pasar el cursor (hover) */}
                        <Tooltip 
                            direction="top" 
                            offset={[0, -10]} 
                            opacity={0.9} 
                            permanent={false} // Desaparece al mover el cursor
                        >
                            <div className='font-bold text-lg text-indigo-700 flex items-center'>
                                <FaMapMarkerAlt className='mr-1 text-red-500'/> {marker.name}
                            </div>
                        </Tooltip>

                        {/* 💡 Popup: Muestra la información y el campo de edición al hacer clic */}
                        <Popup>
                            <div className='p-1'>
                                <h3 className='font-extrabold text-xl text-green-700 border-b pb-1 mb-2 flex items-center'>
                                    <FaSeedling className='mr-2'/> {marker.name}
                                </h3>
                                
                                <label htmlFor={`crop-${marker.id}`} className='block text-sm font-semibold text-gray-600 mb-1 flex items-center'>
                                    <FaTag className='mr-1 text-amber-500'/> Producto Plantado:
                                </label>
                                <input
                                    id={`crop-${marker.id}`}
                                    type="text"
                                    value={marker.crop}
                                    onChange={(e) => handleCropChange(marker.id, e.target.value)}
                                    placeholder="Ej: Tomate, Pimiento, Vacío..."
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                                />

                                <p className='mt-2 text-xs text-gray-500'>
                                    Coordenadas: Lat: {marker.lat.toFixed(6)}, Lng: {marker.lng.toFixed(6)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default GreenhouseMap;