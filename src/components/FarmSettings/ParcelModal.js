import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaTrash, FaMapMarkedAlt, FaDrawPolygon } from 'react-icons/fa';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const SOIL_TYPES = [
    'Arcilloso',
    'Arenoso',
    'Limoso',
    'Franco',
    'Franco-arcilloso',
    'Franco-arenoso',
    'Franco-limoso',
    'Otro'
];

const ParcelModal = ({ isOpen, onClose, onSave, parcel, onDelete }) => {
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'geo'
    const [formData, setFormData] = useState({
        name: '',
        parcelNumber: '',
        area: '',
        soilType: '',
        internalCode: '',
        color: '#10b981',
        visible: true,
        locality: '',
        city: '',
        vulnerableArea: '0',
        latitude: '',
        longitude: '',
        notes: '',
        geometry: [] // Store coordinates here
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (parcel) {
            setFormData(parcel);
        } else {
            setFormData({
                name: '',
                parcelNumber: '',
                area: '',
                soilType: '',
                internalCode: '',
                color: '#10b981',
                visible: true,
                locality: '',
                city: '',
                vulnerableArea: '0',
                latitude: '',
                longitude: '',
                notes: '',
                geometry: []
            });
        }
        setActiveTab('details'); // Reset tab on open
    }, [parcel, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave(formData);
        } catch (err) {
            setError('Error al guardar la parcela');
            setSaving(false);
        }
    };
    
    // Map Handlers (Placeholder for now, logic to be refined)
    const _onCreated = (e) => {
        // Simple logic to capture polygon coords
         const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const latlngs = layer.getLatLngs()[0];
             setFormData(prev => ({ ...prev, geometry: latlngs }));
             console.log("Polygon Created:", latlngs);
        }
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]" // Increased size
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {parcel ? 'Detalles - Parcela' : 'Nueva Parcela'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-center border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-8 py-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === 'details' 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span className="p-1 rounded border border-current"><div className="w-2 h-2 bg-current rotate-45"></div></span> {/* Design icon simulation */}
                                Parcela
                            </button>
                            <button
                                onClick={() => setActiveTab('geo')}
                                className={`px-8 py-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === 'geo' 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span className="p-1 rounded border border-current"><FaMapMarkedAlt /></span>
                                Georreferenciación
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                             {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {activeTab === 'details' ? (
                                <form id="parcelForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre de la parcela *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" placeholder="Nombre" />
                                        </div>
                                         <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Área * (ha)</label>
                                             <div className="flex items-center">
                                                <input type="number" name="area" value={formData.area} onChange={handleChange} step="0.001" required className="flex-1 p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" placeholder="0.000" />
                                                <span className="text-gray-400 text-sm ml-2 bg-gray-100 px-2 py-0.5 rounded">ha</span>
                                             </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Código interno</label>
                                            <input type="text" name="internalCode" value={formData.internalCode} onChange={handleChange} className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" />
                                        </div>
                                         <div className="flex items-center pt-2">
                                             <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                            <label className="ml-2 block text-sm text-gray-700">Visible</label>
                                        </div>
                                         <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Localidad</label>
                                            <input type="text" name="locality" value={formData.locality} onChange={handleChange} className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Zona Vulnerable - Área</label>
                                             <div className="flex items-center">
                                                <input type="number" name="vulnerableArea" value={formData.vulnerableArea} onChange={handleChange} step="0.001" className="flex-1 p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" />
                                                <span className="text-gray-400 text-sm ml-2 bg-gray-100 px-2 py-0.5 rounded">ha</span>
                                             </div>
                                        </div>

                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Número de parcelario</label>
                                            <input type="text" name="parcelNumber" value={formData.parcelNumber} onChange={handleChange} className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tipo de suelo</label>
                                            <select name="soilType" value={formData.soilType} onChange={handleChange} className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors">
                                                <option value="">---------</option>
                                                {SOIL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                         <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Color *</label>
                                            <div className="flex items-center gap-2">
                                                  <div className="w-full h-8 rounded-md border border-gray-200 overflow-hidden relative">
                                                      <input type="color" name="color" value={formData.color} onChange={handleChange} className="absolute -top-2 -left-2 w-[110%] h-[150%] cursor-pointer p-0 border-0" />
                                                  </div>
                                            </div>
                                        </div>
                                         <div className="flex items-center pt-2">
                                             <input type="checkbox" name="archived" checked={formData.archived || false} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                            <label className="ml-2 block text-sm text-gray-700">Archivado</label>
                                        </div>
                                         <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ciudad</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Acerca</label>
                                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="1" className="w-full p-2 border-b border-gray-300 bg-transparent focus:border-emerald-500 focus:outline-none transition-colors resize-none" />
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="h-[500px] w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative">
                                    <MapContainer center={[37.8, -0.8]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                            attribution='Tiles &copy; Esri &mdash; XML Source: Esri'
                                        />
                                        <FeatureGroup>
                                            <EditControl
                                                position="topright"
                                                onCreated={_onCreated}
                                                draw={{
                                                    rectangle: false,
                                                    circle: false,
                                                    circlemarker: false,
                                                    marker: false,
                                                    polyline: false,
                                                    polygon: {
                                                        allowIntersection: false,
                                                        showArea: true,
                                                        shapeOptions: {
                                                            color: formData.color || '#10b981'
                                                        }
                                                    }
                                                }}
                                            />
                                              {/* Logic to render saved polygon would go here */}
                                        </FeatureGroup>
                                    </MapContainer>
                                     <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow text-xs font-semibold z-[1000]">
                                        Modo de Dibujo
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
                            {parcel ? (
                                <button
                                    type="button"
                                    onClick={() => onDelete && onDelete(parcel.id)}
                                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition text-sm"
                                >
                                    Borrar
                                </button>
                            ) : <div></div>} {/* Spacer if no delete button */}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit} // Trigger form submit externally from footer
                                    disabled={saving}
                                    className={`px-6 py-2 text-white font-semibold rounded shadow-sm transition text-sm ${
                                        saving ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                >
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ParcelModal;
