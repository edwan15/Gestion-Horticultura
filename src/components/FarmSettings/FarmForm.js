import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FaSave, FaMapMarkerAlt } from 'react-icons/fa';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const FarmForm = ({ db, userId }) => {
    const [farmData, setFarmData] = useState({
        name: '',
        administrator: '',
        area: '',
        technicalAssistant: '',
        internalCode: '',
        // Ubicación
        country: 'España',
        address: '',
        province: '',
        postalCode: '',
        city: '',
        locality: '',
        latitude: '',
        longitude: '',
        // Empresa
        companyName: '',
        cif: '',
        companyAddress: '',
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [farmId, setFarmId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const appId = getAppId();
    const FARMS_PATH = `artifacts/${appId}/public/data/farms`;

    // Cargar datos de la finca si existe
    useEffect(() => {
        const loadFarm = async () => {
            try {
                const q = query(
                    collection(db, FARMS_PATH),
                    where("userId", "==", userId)
                );
                const snapshot = await getDocs(q);
                
                if (!snapshot.empty) {
                    const farmDoc = snapshot.docs[0];
                    setFarmId(farmDoc.id);
                    setFarmData(farmDoc.data());
                }
            } catch (error) {
                console.error("Error loading farm:", error);
                setMessage({ type: 'error', text: 'Error al cargar los datos de la finca' });
            } finally {
                setLoading(false);
            }
        };

        loadFarm();
    }, [db, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFarmData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const dataToSave = {
                ...farmData,
                userId,
                updatedAt: serverTimestamp(),
            };

            if (farmId) {
                // Actualizar finca existente
                await updateDoc(doc(db, FARMS_PATH, farmId), dataToSave);
                setMessage({ type: 'success', text: 'Finca actualizada correctamente' });
            } else {
                // Crear nueva finca
                const docRef = await addDoc(collection(db, FARMS_PATH), {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                });
                setFarmId(docRef.id);
                setMessage({ type: 'success', text: 'Finca creada correctamente' });
            }
        } catch (error) {
            console.error("Error saving farm:", error);
            setMessage({ type: 'error', text: 'Error al guardar la finca' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {/* Mensaje de feedback */}
            {message.text && (
                <div className={`p-4 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Información General */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la finca *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={farmData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Ej: EURO Balsicas"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Administrador *
                        </label>
                        <input
                            type="text"
                            name="administrator"
                            value={farmData.administrator}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Ej: Israel Martínez"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Área (ha)
                        </label>
                        <input
                            type="number"
                            name="area"
                            value={farmData.area}
                            onChange={handleChange}
                            step="0.001"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="9.050"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asistente técnico
                        </label>
                        <input
                            type="text"
                            name="technicalAssistant"
                            value={farmData.technicalAssistant}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código interno
                        </label>
                        <input
                            type="text"
                            name="internalCode"
                            value={farmData.internalCode}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Ubicación */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-600" />
                    Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            País *
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={farmData.country}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={farmData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Diseminado Colonia"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Provincia
                        </label>
                        <input
                            type="text"
                            name="province"
                            value={farmData.province}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código Postal
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={farmData.postalCode}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="30591"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={farmData.city}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Torre-Pacheco"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localidad
                        </label>
                        <input
                            type="text"
                            name="locality"
                            value={farmData.locality}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitud *
                        </label>
                        <input
                            type="number"
                            name="latitude"
                            value={farmData.latitude}
                            onChange={handleChange}
                            step="0.00001"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="37.82365"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitud *
                        </label>
                        <input
                            type="number"
                            name="longitude"
                            value={farmData.longitude}
                            onChange={handleChange}
                            step="0.00001"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="-0.94053"
                        />
                    </div>
                </div>
            </div>

            {/* Empresa */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={farmData.companyName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Balsicas"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CIF
                        </label>
                        <input
                            type="text"
                            name="cif"
                            value={farmData.cif}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="companyAddress"
                            value={farmData.companyAddress}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={saving}
                    className={`
                        flex items-center gap-2 px-6 py-3 
                        bg-gradient-to-r from-emerald-600 to-green-600
                        text-white font-semibold rounded-lg
                        shadow-lg hover:shadow-emerald-500/50
                        transition-all duration-200
                        ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    `}
                >
                    <FaSave />
                    {saving ? 'Guardando...' : 'Guardar Finca'}
                </button>
            </div>
        </form>
    );
};

export default FarmForm;
