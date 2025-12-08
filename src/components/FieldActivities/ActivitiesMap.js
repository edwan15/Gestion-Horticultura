import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Polygon, Tooltip, FeatureGroup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { FaSeedling, FaMapMarkerAlt, FaRulerCombined, FaDrawPolygon, FaSave, FaTrash } from 'react-icons/fa';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc } from "firebase/firestore";
import GreenhouseDetailsModal from './GreenhouseDetailsModal';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const greenhouseIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapController = () => {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            localStorage.setItem('fieldActivities_mapState', JSON.stringify({ 
                center: [center.lat, center.lng], 
                zoom 
            }));
        }
    });
    return null;
};

const ActivitiesMap = ({ db, userId, activeTab }) => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialize from localStorage or default
    const savedState = JSON.parse(localStorage.getItem('fieldActivities_mapState') || 'null');
    const [farmCenter, setFarmCenter] = useState(savedState?.center || [37.825, -0.941]);
    const [zoomLevel, setZoomLevel] = useState(savedState?.zoom || 14);
    const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
    const [modalPosition, setModalPosition] = useState(null);

    // Helper to handle greenhouse selection and positioning
    const handleGreenhouseClick = (greenhouse, e) => {
        // Use clientX/Y for fixed positioning to avoid overflow clipping
        const x = e.originalEvent.clientX;
        const y = e.originalEvent.clientY;

        setModalPosition({ x, y });
        setSelectedGreenhouse(greenhouse);
    };

    const [isEditMode, setIsEditMode] = useState(false);
    const [tempLayer, setTempLayer] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentSelectedParcelId, setAssignmentSelectedParcelId] = useState('');
    const [parcels, setParcels] = useState([]);

    const handleCreated = (e) => {
        const { layer } = e;
        setTempLayer(layer);
        setAssignmentSelectedParcelId(''); // Reset selection
        setShowAssignmentModal(true);
    };

    const savePolygon = async (parcelId) => {
        if (!tempLayer || !parcelId) return;

        const latlngs = tempLayer.getLatLngs()[0].map(pt => ({ lat: pt.lat, lng: pt.lng }));
        
        try {
            const appId = getAppId();
            const PARCELS_PATH = `artifacts/${appId}/public/data/parcels`;
            const parcelRef = doc(db, PARCELS_PATH, parcelId);
            
            await updateDoc(parcelRef, {
                polygon: latlngs
            });
            
            // Cleanup
            // Remove the drawn layer from the map (FeatureGroup) because we will render it via state/Polygon component
            // But getting ensuring it disappears properly might need state update or ref.
            // For now, react-leaflet-draw keeps it. We might want to clear it.
             // Actually, simplest is to let key change or manual removal.
             // We'll rely on onSnapshot to update the main view.
            
             // Removing from the FeatureGroup if possible would be good, 
             // but reloading the component or ref lookup is needed.
             // We'll just hide the modal and the "Edit Mode" might clear?

            setShowAssignmentModal(false);
            setTempLayer(null);
            setIsEditMode(false); // Exit edit mode to refresh/clear
        } catch (error) {
            console.error("Error saving polygon:", error);
        }
    };

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const appId = getAppId();
        const PARCELS_PATH = `artifacts/${appId}/public/data/parcels`;
        const FARMS_PATH = `artifacts/${appId}/public/data/farms`;

        const fetchData = async () => {
            // Fetch Farm Center ONLY if no saved state exists
            if (!localStorage.getItem('fieldActivities_mapState')) {
                try {
                    const qFarm = query(collection(db, FARMS_PATH), where("userId", "==", userId));
                    const farmSnap = await getDocs(qFarm);
                    if (!farmSnap.empty) {
                        const farmData = farmSnap.docs[0].data();
                        if (farmData.latitude && farmData.longitude) {
                            setFarmCenter([parseFloat(farmData.latitude), parseFloat(farmData.longitude)]);
                        }
                    }
                } catch (error) { console.error(error); }
            }

            // Fetch Parcels
            const qParcels = query(collection(db, PARCELS_PATH), where("userId", "==", userId));
            const unsubscribe = onSnapshot(qParcels, (snapshot) => {
                const rawParcels = [];
                const loadedMarkers = snapshot.docs.map(doc => {
                    const d = doc.data();
                    rawParcels.push({ id: doc.id, name: d.name, ...d });

                    if (d.visible !== false) {
                        // Use saved polygon if exists, otherwise fallback/null
                        // If no polygon, we show the marker only.
                        const hasPolygon = d.polygon && d.polygon.length > 0;
                        
                        return {
                            id: doc.id,
                            name: d.name,
                            area: d.area,
                            soilType: d.soilType,
                            crop: d.crop || 'Sin cultivo',
                            lat: parseFloat(d.latitude || 0),
                            lng: parseFloat(d.longitude || 0),
                            polygon: hasPolygon ? d.polygon.map(p => [p.lat, p.lng]) : null
                        };
                    }
                    return null;
                }).filter(Boolean);
                
                setParcels(rawParcels);
                setMarkers(loadedMarkers);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, [db, userId]);

    if (loading) return <div className="h-full w-full flex items-center justify-center text-gray-400">Cargando mapa...</div>;

    return (
        <div className="h-[600px] w-full rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">
            {/* Toolbar */}
            <div className="absolute top-4 left-16 z-[1000] bg-white rounded-md shadow-md border border-gray-300 flex">
                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`p-2 flex items-center gap-2 text-sm font-bold ${
                        isEditMode ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Dibujar áreas de invernadero"
                >
                    <FaDrawPolygon /> {isEditMode ? 'Finalizar Edición' : 'Editar Límites'}
                </button>
            </div>

            {/* Assignment Modal */}
            {showAssignmentModal && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2000] bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-96">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Asignar Área Dibujada</h3>
                    <p className="text-sm text-gray-600 mb-3">Selecciona el invernadero correspondiente:</p>
                    
                    <div className="mb-4">
                        <select
                            value={assignmentSelectedParcelId}
                            onChange={(e) => setAssignmentSelectedParcelId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        >
                            <option value="">-- Seleccionar Invernadero --</option>
                            {parcels.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} {p.polygon ? '(Actualizar)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Preview Selected Details */}
                    {assignmentSelectedParcelId && (
                        <div className="mb-6 bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-sm">
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-500">Nombre:</span>
                                <span className="font-bold text-gray-800">
                                    {parcels.find(p => p.id === assignmentSelectedParcelId)?.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Área:</span>
                                <span className="font-bold text-gray-800">
                                    {parcels.find(p => p.id === assignmentSelectedParcelId)?.area} ha
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                         <button 
                            onClick={() => {
                                setShowAssignmentModal(false);
                                if (tempLayer) tempLayer.remove(); 
                                setTempLayer(null);
                                setAssignmentSelectedParcelId('');
                            }}
                            className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => savePolygon(assignmentSelectedParcelId)}
                            disabled={!assignmentSelectedParcelId}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-md ${
                                assignmentSelectedParcelId 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg' 
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <FaSave className="inline mr-2" /> Guardar
                        </button>
                    </div>
                </div>
            )}

            <MapContainer 
                center={farmCenter} 
                zoom={zoomLevel} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <MapController />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Mapa Normal">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Satélite (ESRI)">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {isEditMode && (
                    <FeatureGroup>
                        <EditControl
                            position='topright'
                            onCreated={handleCreated}
                            draw={{
                                rectangle: false,
                                circle: false,
                                circlemarker: false,
                                marker: false,
                                polyline: false,
                                polygon: {
                                    allowIntersection: false,
                                    drawError: {
                                        color: '#e1e100',
                                        message: '<strong>Error:</strong> No puedes cruzar líneas!'
                                    },
                                    shapeOptions: {
                                        color: '#f59e0b'
                                    }
                                }
                            }}
                            edit={{ edit: false, remove: false }} // Simple add-only mode for now
                        />
                    </FeatureGroup>
                )}

                {markers.map((marker) => (
                    <React.Fragment key={marker.id}>
                        {marker.polygon ? (
                            <Polygon 
                                positions={marker.polygon}
                                pathOptions={{ 
                                    color: selectedGreenhouse?.id === marker.id ? '#10B981' : '#F59E0B', 
                                    weight: 2, 
                                    fillOpacity: 0.1 
                                }}
                                eventHandlers={{
                                    click: (e) => handleGreenhouseClick(marker, e),
                                }}
                            >
                                <Tooltip 
                                    direction="center" 
                                    offset={[0, 0]} 
                                    opacity={1} 
                                    permanent={true}
                                    className="font-bold text-gray-800 bg-white/80 border-0 shadow-sm text-xs"
                                >
                                   {marker.name}
                                </Tooltip>
                            </Polygon>
                        ) : (
                            <Marker
                                position={[marker.lat, marker.lng]}
                                icon={new L.Icon.Default()} 
                                eventHandlers={{
                                    click: (e) => handleGreenhouseClick(marker, e),
                                }}
                            >
                                 <Tooltip 
                                    direction="top" 
                                    offset={[0, -40]} 
                                    opacity={1} 
                                    permanent={true}
                                    className="font-bold text-gray-800 bg-white/90 border-0 shadow-sm"
                                >
                                   {marker.name}
                                </Tooltip>
                            </Marker>
                        )}
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Selected Greenhouse Modal Trigger/Display */}
            {selectedGreenhouse && (
                <GreenhouseDetailsModal 
                    isOpen={!!selectedGreenhouse}
                    onClose={() => setSelectedGreenhouse(null)}
                    greenhouse={selectedGreenhouse}
                    db={db}
                    userId={userId}
                    position={modalPosition}
                />
            )}
        </div>
    );
};

export default ActivitiesMap;
