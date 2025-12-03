import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaLeaf } from 'react-icons/fa';
import CropModal from './CropModal';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const CropTable = ({ db, userId }) => {
    const [crops, setCrops] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const appId = getAppId();
    const CROPS_PATH = `artifacts/${appId}/public/data/crops`;
    const PARCELS_PATH = `artifacts/${appId}/public/data/parcels`;

    // Cargar parcelas para mostrar nombres
    useEffect(() => {
        const loadParcels = async () => {
            try {
                const q = query(collection(db, PARCELS_PATH), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                const parcelsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setParcels(parcelsData);
            } catch (error) {
                console.error("Error loading parcels:", error);
            }
        };
        loadParcels();
    }, [db, userId]);

    // Cargar cultivos en tiempo real
    useEffect(() => {
        const q = query(
            collection(db, CROPS_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCrops(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading crops:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    const handleAddNew = () => {
        setEditingCrop(null);
        setIsModalOpen(true);
    };

    const handleEdit = (crop) => {
        setEditingCrop(crop);
        setIsModalOpen(true);
    };

    const handleDelete = async (cropId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cultivo?')) {
            try {
                await deleteDoc(doc(db, CROPS_PATH, cropId));
            } catch (error) {
                console.error("Error deleting crop:", error);
                alert('Error al eliminar el cultivo');
            }
        }
    };

    const handleSave = async (cropData) => {
        try {
            if (editingCrop) {
                await updateDoc(doc(db, CROPS_PATH, editingCrop.id), {
                    ...cropData,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await addDoc(collection(db, CROPS_PATH), {
                    ...cropData,
                    userId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving crop:", error);
            throw error;
        }
    };

    const getParcelName = (parcelId) => {
        const parcel = parcels.find(p => p.id === parcelId);
        return parcel ? parcel.name : '-';
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCrops = crops.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(crops.length / itemsPerPage);

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
                    <h2 className="text-xl font-semibold text-gray-800">Cultivos</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {crops.length} cultivo{crops.length !== 1 ? 's' : ''} registrado{crops.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-200 hover:scale-105"
                >
                    <FaPlus /> Añadir nuevo
                </button>
            </div>

            {/* Tabla */}
            {crops.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No hay cultivos registrados</p>
                    <button
                        onClick={handleAddNew}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Crear el primer cultivo
                    </button>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Parcela Asociada
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Tipo de Cultivo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Área (ha)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Plantas
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentCrops.map((crop) => (
                                    <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {crop.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {getParcelName(crop.parcelId)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaLeaf className="text-emerald-500" />
                                                {crop.cropType}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {crop.plantedArea ? `${crop.plantedArea} ha` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {crop.plantCount || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                crop.archived 
                                                    ? 'bg-gray-100 text-gray-600' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {crop.archived ? 'Archivado' : 'Activo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(crop)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(crop.id)}
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

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-4">
                            <div className="text-sm text-gray-600">
                                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, crops.length)} de {crops.length} cultivos
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                                    {currentPage}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {isModalOpen && (
                <CropModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    crop={editingCrop}
                    parcels={parcels}
                />
            )}
        </div>
    );
};

export default CropTable;
