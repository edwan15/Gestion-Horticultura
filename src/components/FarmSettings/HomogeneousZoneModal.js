import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';

const HomogeneousZoneModal = ({ isOpen, onClose, onSave, zone, crops }) => {
    const [formData, setFormData] = useState({
        name: '',
        selectedCrops: [],
        color: '#10b981',
        visible: true,
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (zone) {
            setFormData(zone);
        } else {
            setFormData({
                name: '',
                selectedCrops: [],
                color: '#10b981',
                visible: true,
                description: '',
            });
        }
    }, [zone]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCropToggle = (cropId) => {
        setFormData(prev => {
            const current = prev.selectedCrops || [];
            if (current.includes(cropId)) {
                return { ...prev, selectedCrops: current.filter(id => id !== cropId) };
            } else {
                return { ...prev, selectedCrops: [...current, cropId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await onSave(formData);
        } catch (err) {
            setError('Error al guardar la zona');
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                            <FaTimes className="text-2xl"/>
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-2 border-emerald-200 pb-3">
                            {zone ? 'Editar Zona Homogénea' : 'Nueva Zona Homogénea'}
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la zona *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Ej: Zona Norte"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Cultivos
                                </label>
                                <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                                    {crops.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center">No hay cultivos disponibles</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {crops.map(crop => (
                                                <label key={crop.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md transition cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selectedCrops?.includes(crop.id)}
                                                        onChange={() => handleCropToggle(crop.id)}
                                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">{crop.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({crop.area} ha)</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Color *
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            className="h-10 w-20 border rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                            className="flex-1 p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="visible"
                                            checked={formData.visible}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            Visible
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-6 py-2 text-white font-bold rounded-lg transition flex items-center gap-2 ${
                                        saving ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                >
                                    <FaSave />
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HomogeneousZoneModal;
