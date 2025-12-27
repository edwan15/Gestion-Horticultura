import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaLeaf, FaTint, FaShieldAlt, FaEllipsisH } from 'react-icons/fa';
import { CROP_TYPES } from '../../constants/cropTypes';

const TABS = [
    { id: 'general', label: 'General', icon: FaLeaf },
    { id: 'installation', label: 'Instalación', icon: FaTint },
    { id: 'practices', label: 'Buenas prácticas', icon: FaShieldAlt },
    { id: 'other', label: 'Otros', icon: FaEllipsisH },
];

const CropModal = ({ isOpen, onClose, onSave, crop, parcels }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        // General
        name: '',
        parcelId: '',
        plantedArea: '',
        plantingDate: '',
        removalDate: '',
        cropCode: '',
        cropType: '',
        variety: '',
        soilType: '',
        rootstock: '',
        daysToHarvest: '',
        createPlantingRecord: false,
        createHarvestRecommendation: false,

        // Instalación
        plantDistance: '',
        rowSpace: '',
        plantWidth: '',
        plantCount: '',
        conductionSystem: '', // Palmeta, Sebe, Eje, Florera
        rows: '',
        plantingDepth: '',
        irrigationSystem: '',

        // Buenas Prácticas
        groundCover: '',
        soilConservation: [], // Multi-select
        preventiveMeasures: [], // Multi-select

        // Otros
        productionMode: '',
        protectionType: 'Aire libre',
        agriculturalSystem: 'Tradicional',
        cultivationSystem: '',
        previousCrop: '',
        previousCropTypes: [],
        adjacentCrops: [],
        expectedProduction: '',
        certifications: [],
        workingWidth: '',
        internalCode: '',
        color: '#10b981',
        isNursery: false,
        archived: false,
        sigpacUse: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (crop) {
            setFormData(crop);
        } else {
            // Reset form
            setFormData({
                name: '',
                parcelId: '',
                plantedArea: '',
                plantingDate: '',
                removalDate: '',
                cropCode: '',
                cropType: '',
                variety: '',
                soilType: '',
                rootstock: '',
                daysToHarvest: '',
                createPlantingRecord: false,
                createHarvestRecommendation: false,
                plantDistance: '',
                rowSpace: '',
                plantWidth: '',
                plantCount: '',
                conductionSystem: '',
                rows: '',
                plantingDepth: '',
                irrigationSystem: '',
                groundCover: '',
                soilConservation: [],
                preventiveMeasures: [],
                productionMode: '',
                protectionType: 'Aire libre',
                agriculturalSystem: 'Tradicional',
                cultivationSystem: '',
                previousCrop: '',
                previousCropTypes: [],
                adjacentCrops: [],
                expectedProduction: '',
                certifications: [],
                workingWidth: '',
                internalCode: '',
                color: '#10b981',
                isNursery: false,
                archived: false,
                sigpacUse: '',
            });
        }
    }, [crop]);

    // Auto-calculate plant count
    useEffect(() => {
        if (formData.plantedArea && formData.plantDistance && formData.rowSpace) {
            const areaM2 = parseFloat(formData.plantedArea) * 10000; // ha to m2
            const distance = parseFloat(formData.plantDistance);
            const space = parseFloat(formData.rowSpace);
            
            if (distance > 0 && space > 0) {
                const count = Math.round(areaM2 / (distance * space));
                setFormData(prev => ({ ...prev, plantCount: count }));
            }
        }
    }, [formData.plantedArea, formData.plantDistance, formData.rowSpace]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleMultiSelectChange = (e, field) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave(formData);
        } catch (err) {
            setError('Error al guardar el cultivo');
            setSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cultivo *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parcela Asociada *</label>
                            <select name="parcelId" value={formData.parcelId} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="">Seleccionar parcela</option>
                                {parcels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Área plantada * (ha)</label>
                            <input type="number" name="plantedArea" value={formData.plantedArea} onChange={handleChange} required step="0.001" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Plantación</label>
                            <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de eliminación</label>
                            <input type="date" name="removalDate" value={formData.removalDate} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cultivo *</label>
                            <select name="cropType" value={formData.cropType} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="">Seleccionar tipo</option>
                                {CROP_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Variedades</label>
                            <input type="text" name="variety" value={formData.variety} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de suelo</label>
                            <select name="soilType" value={formData.soilType} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="">Seleccionar</option>
                                <option value="Arcilloso">Arcilloso</option>
                                <option value="Arenoso">Arenoso</option>
                                <option value="Franco">Franco</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Días para cosecha</label>
                            <input type="number" name="daysToHarvest" value={formData.daysToHarvest} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                );
            case 'installation':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Distancia entre plantas (m)</label>
                            <input type="number" name="plantDistance" value={formData.plantDistance} onChange={handleChange} step="0.01" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Espacio entre filas (m)</label>
                            <input type="number" name="rowSpace" value={formData.rowSpace} onChange={handleChange} step="0.01" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de plantas (Total)</label>
                            <input type="number" name="plantCount" value={formData.plantCount} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de conducción</label>
                            <div className="flex gap-2 text-sm">
                                {['Palmeta', 'Sebe', 'Eje', 'Florera'].map(sys => (
                                    <label key={sys} className="flex items-center gap-1">
                                        <input type="radio" name="conductionSystem" value={sys} checked={formData.conductionSystem === sys} onChange={handleChange} />
                                        {sys}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filas (Ej: 1-5, 8)</label>
                            <input type="text" name="rows" value={formData.rows} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de Riego</label>
                            <input type="text" name="irrigationSystem" value={formData.irrigationSystem} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                );
            case 'practices':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cubierta del Suelo</label>
                            <select name="groundCover" value={formData.groundCover} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="">Seleccionar</option>
                                <option value="Mobilização mínima">Mobilização mínima</option>
                                <option value="Cobertura del suelo">Cobertura del suelo</option>
                                <option value="Siembra directa">Siembra directa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medidas preventivas</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Bandas de compensación', 'Bordes herbales', 'Enemigos naturales', 'Podas de aireación', 'Refugios vida silvestre', 'Setos vegetales'].map(measure => (
                                    <label key={measure} className="flex items-center gap-2 text-sm">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.preventiveMeasures.includes(measure)}
                                            onChange={(e) => {
                                                const newMeasures = e.target.checked 
                                                    ? [...formData.preventiveMeasures, measure]
                                                    : formData.preventiveMeasures.filter(m => m !== measure);
                                                setFormData(prev => ({ ...prev, preventiveMeasures: newMeasures }));
                                            }}
                                        />
                                        {measure}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'other':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de protección *</label>
                            <select name="protectionType" value={formData.protectionType} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="Aire libre">Aire libre</option>
                                <option value="Invernadero">Invernadero</option>
                                <option value="Malla">Malla</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sistema agrícola *</label>
                            <select name="agriculturalSystem" value={formData.agriculturalSystem} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                                <option value="Tradicional">Tradicional</option>
                                <option value="Ecológico">Ecológico</option>
                                <option value="Integrado">Integrado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Producción Esperada (kg)</label>
                            <input type="number" name="expectedProduction" value={formData.expectedProduction} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                            <div className="flex gap-2">
                                <input type="color" name="color" value={formData.color} onChange={handleChange} className="h-10 w-20 border rounded-lg cursor-pointer" />
                                <input type="text" value={formData.color} onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))} className="flex-1 p-2 border rounded-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isNursery" checked={formData.isNursery} onChange={handleChange} />
                                <span className="text-sm">Vivero</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="archived" checked={formData.archived} onChange={handleChange} />
                                <span className="text-sm">Archivado</span>
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
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
                        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {crop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-center border-b border-gray-100">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            px-8 py-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-colors
                                            ${activeTab === tab.id 
                                                ? 'border-emerald-500 text-emerald-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }
                                        `}
                                    >
                                        <Icon className="text-lg" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <form id="cropForm" onSubmit={handleSubmit}>
                                {renderTabContent()}
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="cropForm"
                                disabled={saving}
                                className={`px-6 py-2 text-white font-semibold rounded shadow-sm transition text-sm ${
                                    saving ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            >
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CropModal;
