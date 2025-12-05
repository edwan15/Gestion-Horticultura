import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';

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

const ParcelModal = ({ isOpen, onClose, onSave, parcel }) => {
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
            });
        }
    }, [parcel]);

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
                        {/* Header */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        >
                            <FaTimes className="text-2xl"/>
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-2 border-emerald-200 pb-3">
                            {parcel ? 'Editar Parcela' : 'Nueva Parcela'}
                        </h2>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Detalles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de la parcela *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Ej: Invernadero 1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de parcelario
                                    </label>
                                    <input
                                        type="text"
                                        name="parcelNumber"
                                        value={formData.parcelNumber}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Área * (ha)
                                    </label>
                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        step="0.001"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="3.850"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de suelo
                                    </label>
                                    <select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="">Seleccionar</option>
                                        {SOIL_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código interno
                                    </label>
                                    <input
                                        type="text"
                                        name="internalCode"
                                        value={formData.internalCode}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

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
                                            className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="#10b981"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Localidad
                                    </label>
                                    <input
                                        type="text"
                                        name="locality"
                                        value={formData.locality}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Zona Vulnerable - Área (ha)
                                    </label>
                                    <input
                                        type="number"
                                        name="vulnerableArea"
                                        value={formData.vulnerableArea}
                                        onChange={handleChange}
                                        step="0.001"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="visible"
                                            checked={formData.visible}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            Visible
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Acerca
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Notas adicionales sobre la parcela..."
                                />
                            </div>

                            {/* Botones */}
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

export default ParcelModal;
