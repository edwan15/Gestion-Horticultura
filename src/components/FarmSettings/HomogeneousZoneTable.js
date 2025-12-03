import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaLayerGroup, FaEye, FaEyeSlash } from 'react-icons/fa';
import HomogeneousZoneModal from './HomogeneousZoneModal';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const HomogeneousZoneTable = ({ db, userId }) => {
    const [zones, setZones] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);

    const appId = getAppId();
    const ZONES_PATH = `artifacts/${appId}/public/data/homogeneous_zones`;
    const CROPS_PATH = `artifacts/${appId}/public/data/crops`;

    // Cargar cultivos para el selector y mostrar nombres
    useEffect(() => {
        const loadCrops = async () => {
            try {
                const q = query(collection(db, CROPS_PATH), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                const cropsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    area: doc.data().plantedArea || 0,
                    plants: doc.data().plantCount || 0
                }));
                setCrops(cropsData);
            } catch (error) {
                console.error("Error loading crops:", error);
            }
        };
        loadCrops();
    }, [db, userId]);

    // Cargar zonas en tiempo real
    useEffect(() => {
        const q = query(
            collection(db, ZONES_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setZones(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading zones:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    const handleAddNew = () => {
        setEditingZone(null);
        setIsModalOpen(true);
    };

    const handleEdit = (zone) => {
        setEditingZone(zone);
        setIsModalOpen(true);
    };

    const handleDelete = async (zoneId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta zona homogénea?')) {
            try {
                await deleteDoc(doc(db, ZONES_PATH, zoneId));
            } catch (error) {
                console.error("Error deleting zone:", error);
                alert('Error al eliminar la zona');
            }
        }
    };

    const handleSave = async (zoneData) => {
        try {
            // Calcular totales basados en cultivos seleccionados
            let totalArea = 0;
            let totalPlants = 0;
            
            if (zoneData.selectedCrops && zoneData.selectedCrops.length > 0) {
                zoneData.selectedCrops.forEach(cropId => {
                    const crop = crops.find(c => c.id === cropId);
                    if (crop) {
                        totalArea += parseFloat(crop.area || 0);
                        totalPlants += parseInt(crop.plants || 0);
                    }
                });
            }

            const dataToSave = {
                ...zoneData,
                totalArea: totalArea.toFixed(3),
                totalPlants,
                userId,
                updatedAt: serverTimestamp(),
            };

            if (editingZone) {
                await updateDoc(doc(db, ZONES_PATH, editingZone.id), dataToSave);
            } else {
                await addDoc(collection(db, ZONES_PATH), {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving zone:", error);
            throw error;
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
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Zonas Homogéneas</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Agrupa cultivos similares para una gestión unificada
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-200 hover:scale-105"
                >
                    <FaPlus /> Añadir nueva
                </button>
            </div>

            {/* Tabla */}
            {zones.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FaLayerGroup className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No hay zonas homogéneas registradas</p>
                    <button
                        onClick={handleAddNew}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Crear la primera zona
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Cultivos
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Área Total (ha)
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Plantas
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Color
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Visible
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {zones.map((zone) => (
                                <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {zone.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {zone.selectedCrops?.length || 0} cultivos
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {zone.totalArea} ha
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {zone.totalPlants}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div 
                                            className="w-6 h-6 rounded-full mx-auto border border-gray-200" 
                                            style={{ backgroundColor: zone.color }}
                                        ></div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {zone.visible ? (
                                            <FaEye className="inline text-green-600" />
                                        ) : (
                                            <FaEyeSlash className="inline text-gray-400" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(zone)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(zone.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <HomogeneousZoneModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    zone={editingZone}
                    crops={crops}
                />
            )}
        </div>
    );
};

export default HomogeneousZoneTable;
