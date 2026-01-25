import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import ParcelModal from './ParcelModal';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const ParcelTable = ({ db, userId, currentUser }) => {
    const [crops, setCrops] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParcel, setEditingParcel] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const APP_ID = getAppId();
    const PARCELS_PATH = `artifacts/${APP_ID}/public/data/parcels`;
    const CROPS_PATH = `artifacts/${APP_ID}/public/data/crops`;

    // Cargar parcelas en tiempo real
    useEffect(() => {
        const q = query(
            collection(db, PARCELS_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setParcels(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading parcels:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    // Cargar cultivos en tiempo real para mostrar en la tabla
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
        }, (error) => {
            console.error("Error loading crops in ParcelTable:", error);
        });

        return () => unsubscribe();
    }, [db, userId]);

    const getCropNameForParcel = (parcelId) => {
        const foundCrop = crops.find(c => c.parcelId === parcelId && !c.archived);
        return foundCrop ? foundCrop.name : '-';
    };

    const handleAddNew = () => {
        setEditingParcel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (parcel) => {
        setEditingParcel(parcel);
        setIsModalOpen(true);
    };

    const handleDelete = async (parcelId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta parcela?')) {
            try {
                await deleteDoc(doc(db, PARCELS_PATH, parcelId));
            } catch (error) {
                console.error("Error deleting parcel:", error);
                alert('Error al eliminar la parcela');
            }
        }
    };

    const handleSave = async (parcelData) => {
        try {
            const updateInfo = {
                updatedBy: {
                    name: currentUser?.displayName || currentUser?.email || 'Usuario',
                    photoURL: currentUser?.photoURL || null,
                    email: currentUser?.email
                },
                updatedAt: serverTimestamp(),
            };

            if (editingParcel) {
                // Actualizar
                await updateDoc(doc(db, PARCELS_PATH, editingParcel.id), {
                    ...parcelData,
                    ...updateInfo
                });
            } else {
                // Crear nuevo
                await addDoc(collection(db, PARCELS_PATH), {
                    ...parcelData,
                    userId,
                    createdAt: serverTimestamp(),
                    ...updateInfo
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving parcel:", error);
            throw error;
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentParcels = parcels.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(parcels.length / itemsPerPage);

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
                    <h2 className="text-xl font-semibold text-gray-800">Parcelas</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {parcels.length} parcela{parcels.length !== 1 ? 's' : ''} registrada{parcels.length !== 1 ? 's' : ''}
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
            {parcels.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No hay parcelas registradas</p>
                    <button
                        onClick={handleAddNew}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Crear la primera parcela
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
                                        Número de parcelario
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Área (ha)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Cultivos
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Tipo de suelo
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Visible
                                    </th>
                                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Actualizado en
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentParcels.map((parcel) => (
                                    <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {parcel.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {parcel.parcelNumber || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {parcel.area ? `${parcel.area} ha` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block text-xs font-medium">
                                                {parcel.crop || getCropNameForParcel(parcel.id)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {parcel.soilType || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {parcel.visible ? (
                                                <FaEye className="inline text-green-600" />
                                            ) : (
                                                <FaEyeSlash className="inline text-gray-400" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {(() => {
                                                const isOwner = parcel.userId === currentUser?.uid;
                                                const userToDisplay = parcel.updatedBy || (isOwner ? {
                                                    name: currentUser?.displayName || currentUser?.email || 'Usuario',
                                                    photoURL: currentUser?.photoURL,
                                                    email: currentUser?.email
                                                } : null);

                                                const dateToDisplay = parcel.updatedAt || parcel.createdAt;
                                                
                                                // Usar la foto actual si es el dueño y la guardada no existe
                                                const finalPhotoURL = userToDisplay?.photoURL || (isOwner ? currentUser?.photoURL : null);

                                                if (userToDisplay) {
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            {finalPhotoURL ? (
                                                                <img src={finalPhotoURL} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-200">
                                                                    {(userToDisplay.name || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-gray-900">{userToDisplay.name}</span>
                                                                <span className="text-[10px] text-gray-500">
                                                                    {dateToDisplay?.seconds ? new Date(dateToDisplay.seconds * 1000).toLocaleDateString() + ' ' + new Date(dateToDisplay.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return <span className="text-xs text-gray-400">-</span>;
                                            })()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(parcel)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(parcel.id)}
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
                                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, parcels.length)} de {parcels.length} parcelas
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

            {/* Modal - Standard Enterprise Modal */}
            {isModalOpen && (
                <ParcelModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    parcel={editingParcel}
                    onDelete={handleDelete}
                    crops={crops}
                />
            )}
        </div>
    );
};

export default ParcelTable;
