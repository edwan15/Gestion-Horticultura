import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaSeedling, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from '../../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

// =======================================================================
// === CONFIGURACIÓN DE ICONOS DE LEAFLET
// =======================================================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icon for Greenhouses
const greenhouseIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// =======================================================================
// === COMPONENTE AUXILIAR PARA CONTROLAR LA VISTA
// =======================================================================
const MapViewUpdater = ({ markers, defaultCenter }) => {
    const map = useMap();
    // Clave única para localStorage
    const STORAGE_KEY = 'greenhouseMap_viewState';

    useEffect(() => {
        // 1. Intentar restaurar vista guardada
        const savedView = localStorage.getItem(STORAGE_KEY);
        let hasRestored = false;

        if (savedView) {
            try {
                const { center, zoom } = JSON.parse(savedView);
                if (center && zoom) {
                    map.setView(center, zoom);
                    hasRestored = true;
                }
            } catch (e) {
                console.error("Error parsing saved map view", e);
            }
        }

        // 2. Si no se restauró, usar lógica original (markers o default)
        if (!hasRestored) {
            if (markers.length > 0) {
                const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            } else if (defaultCenter) {
                map.setView(defaultCenter, 14);
            }
        }

        // 3. Guardar estado al mover el mapa
        const onMoveEnd = () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ center, zoom }));
        };

        map.on('moveend', onMoveEnd);
        map.on('zoomend', onMoveEnd);

        return () => {
            map.off('moveend', onMoveEnd);
            map.off('zoomend', onMoveEnd);
        };
    }, [map, markers, defaultCenter]);

    return null;
};

// =======================================================================
// === COMPONENTE PRINCIPAL: GreenhouseMap
// =======================================================================
const GreenhouseMap = () => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [farmCenter, setFarmCenter] = useState([37.825, -0.941]); // Default fallback
    const [hasFarmLocation, setHasFarmLocation] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const appId = getAppId();
        const PARCELS_PATH = `artifacts/${appId}/public/data/parcels`;
        const FARMS_PATH = `artifacts/${appId}/public/data/farms`;

        // 1. Fetch Farm Location for Center
        const fetchFarmContext = async () => {
             try {
                const qFarm = query(collection(db, FARMS_PATH), where("userId", "==", user.uid));
                const farmSnap = await getDocs(qFarm);
                if (!farmSnap.empty) {
                    const farmData = farmSnap.docs[0].data();
                    if (farmData.latitude && farmData.longitude) {
                        setFarmCenter([parseFloat(farmData.latitude), parseFloat(farmData.longitude)]);
                        setHasFarmLocation(true);
                    }
                }
             } catch (error) {
                 console.error("Error fetching farm location:", error);
             }
        };
        fetchFarmContext();

        // 2. Listen to Parcels for Markers
        const qParcels = query(collection(db, PARCELS_PATH), where("userId", "==", user.uid));
        
        const unsubscribe = onSnapshot(qParcels, (snapshot) => {
            const loadedMarkers = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    if (data.latitude && data.longitude && data.visible !== false) {
                        return {
                            id: doc.id,
                            name: data.name,
                            area: data.area,
                            soilType: data.soilType,
                            crop: data.crop || 'Sin cultivo', // Assuming crop might be added later to parcel
                            lat: parseFloat(data.latitude),
                            lng: parseFloat(data.longitude),
                        };
                    }
                    return null;
                })
                .filter(m => m !== null);
            
            setMarkers(loadedMarkers);
            setLoading(false);
        }, (error) => {
            console.error("Error loading parcels map data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="h-96 w-full rounded-xl bg-gray-100 flex items-center justify-center animate-pulse">
                <span className="text-gray-400 font-medium">Cargando mapa...</span>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-hidden relative z-0">
             <MapContainer 
                center={farmCenter} 
                zoom={14} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Mapa Normal">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satélite (ESRI)">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <MapViewUpdater markers={markers} defaultCenter={farmCenter} />

                {/* Show Farm Center if no parcels yet, or just as context? Maybe just parcels for now to keep it clean like Wisecrop */}
                
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={greenhouseIcon}
                    >
                        <Tooltip 
                            direction="top" 
                            offset={[0, -40]} 
                            opacity={1} 
                            permanent={false}
                            className="custom-tooltip font-bold text-gray-800"
                        >
                           {marker.name}
                        </Tooltip>

                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg text-emerald-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                                    <FaSeedling className="mr-2" /> 
                                    {marker.name}
                                </h3>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center text-gray-500">
                                            <FaRulerCombined className="mr-2 w-4" /> Área:
                                        </span>
                                        <span className="font-semibold">{marker.area} ha</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center text-gray-500">
                                            <FaMapMarkerAlt className="mr-2 w-4" /> Suelo:
                                        </span>
                                        <span className="font-semibold">{marker.soilType || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Optional Overlay Legend or Info */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200 text-xs text-gray-600">
                <p className="font-bold text-gray-800 mb-1">Leyenda</p>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></span>
                    <span>Parcelas/Invernaderos Activos</span>
                </div>
            </div>
        </div>
    );
};

export default GreenhouseMap;