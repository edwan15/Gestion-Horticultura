import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, addDoc, doc, setDoc, getDoc, serverTimestamp, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaTint, FaPlus, FaChartBar, FaTrash } from 'react-icons/fa';

const WaterManagement = ({ consumptionP1 = 0, consumptionP2 = 0 }) => {
    const userId = useSelector(selectUserId);
    const [selectedReservoir, setSelectedReservoir] = useState('pantano1');
    const [reservoirs, setReservoirs] = useState({
        pantano1: { name: 'Pantano 1', capacity: 15000, currentLevel: 15000 },
        pantano2: { name: 'Pantano 2', capacity: 10000, currentLevel: 10000 }
    });
    const [supplyAmount, setSupplyAmount] = useState('');
    const [supplyNotes, setSupplyNotes] = useState('');
    const [supplyLog, setSupplyLog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load reservoir data from Firestore
    useEffect(() => {
        if (!userId) return;
        loadReservoirData();
        loadSupplyLog();
    }, [userId]);

    const loadReservoirData = async () => {
        try {
            const docRef = doc(db, 'water_reservoirs', userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setReservoirs(docSnap.data().reservoirs);
            } else {
                // Initialize with default values
                await setDoc(docRef, {
                    userId,
                    reservoirs: {
                        pantano1: { name: 'Pantano 1', capacity: 15000, currentLevel: 15000 },
                        pantano2: { name: 'Pantano 2', capacity: 10000, currentLevel: 10000 }
                    },
                    updatedAt: serverTimestamp()
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading reservoir data:', error);
            toast.error('Error al cargar datos de pantanos');
            setIsLoading(false);
        }
    };

    const loadSupplyLog = async () => {
        try {
            const q = query(
                collection(db, 'water_supply_log'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(10)
            );
            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSupplyLog(logs);
        } catch (error) {
            console.error('Error loading supply log:', error);
        }
    };

    const handleSupplyWater = async (e) => {
        e.preventDefault();
        
        const amount = parseFloat(supplyAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Ingresa una cantidad válida');
            return;
        }

        const reservoir = reservoirs[selectedReservoir];
        const currentUsage = selectedReservoir === 'pantano1' ? consumptionP1 : consumptionP2;
        // Calculamos el nivel efectivo real (lo que hay físicamente ahora)
        const currentEffectiveLevel = reservoir.currentLevel - currentUsage;
        
        // Validamos si al añadir agua superamos la capacidad física real
        if ((currentEffectiveLevel + amount) > reservoir.capacity) {
            const spaceAvailable = reservoir.capacity - currentEffectiveLevel;
            toast.error(`Solo puedes añadir hasta ${spaceAvailable.toLocaleString()} L en ${reservoir.name}`);
            return;
        }

        const newLevel = reservoir.currentLevel + amount;

        try {
            // Update reservoir level
            const updatedReservoirs = {
                ...reservoirs,
                [selectedReservoir]: {
                    ...reservoir,
                    currentLevel: newLevel
                }
            };

            await setDoc(doc(db, 'water_reservoirs', userId), {
                userId,
                reservoirs: updatedReservoirs,
                updatedAt: serverTimestamp()
            });

            // Add to supply log
            await addDoc(collection(db, 'water_supply_log'), {
                userId,
                reservoir: selectedReservoir,
                reservoirName: reservoir.name,
                amount,
                date: new Date().toISOString().split('T')[0],
                timestamp: serverTimestamp(),
                notes: supplyNotes || ''
            });

            setReservoirs(updatedReservoirs);
            setSupplyAmount('');
            setSupplyNotes('');
            toast.success(`${amount} L agregados a ${reservoir.name}`);
            loadSupplyLog();
        } catch (error) {
            console.error('Error supplying water:', error);
            toast.error('Error al registrar suministro');
        }
    };

    const handleDeleteSupply = async (logId, reservoirKey, amount) => {
        if (!window.confirm("¿Estás seguro de eliminar este suministro? Se restará el agua del pantano y volverá al nivel anterior.")) return;

        try {
            const reservoir = reservoirs[reservoirKey];
            // Calcular nuevo nivel (restar lo que se añadió)
            // Asegurarnos de no bajar de 0 por inconsistencias, aunque la lógica debería ser correcta.
            const newLevel = Math.max(0, reservoir.currentLevel - amount);

            // Actualizar pantano en Firestore
            const updatedReservoirs = {
                ...reservoirs,
                [reservoirKey]: {
                    ...reservoir,
                    currentLevel: newLevel
                }
            };

            await setDoc(doc(db, 'water_reservoirs', userId), {
                userId,
                reservoirs: updatedReservoirs,
                updatedAt: serverTimestamp()
            });

            // Eliminar log
            await deleteDoc(doc(db, 'water_supply_log', logId));

            // Actualizar estado local
            setReservoirs(updatedReservoirs);
            loadSupplyLog();
            toast.success("Registro eliminado y nivel de agua restaurado.");
        } catch (error) {
            console.error("Error deleting supply:", error);
            toast.error("Error al eliminar el suministro");
        }
    };

    if (!userId) {
        return (
            <div className="p-6 bg-red-100 border-2 border-red-500 rounded-lg text-center">
                <p className="font-bold text-red-800">⚠️ Acceso Denegado</p>
                <p className="text-red-700">Debes iniciar sesión para gestionar los pantanos</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-6 text-center text-indigo-600">Cargando datos de pantanos...</div>;
    }

    const currentReservoir = reservoirs[selectedReservoir];
    const waterUsed = selectedReservoir === 'pantano1' ? consumptionP1 : consumptionP2;
    const waterRemaining = currentReservoir.currentLevel - waterUsed;
    const percentageFull = ((waterRemaining / currentReservoir.capacity) * 100).toFixed(2);
    const percentageUsed = ((waterUsed / currentReservoir.capacity) * 100).toFixed(2);

    return (
        <div className="bg-white shadow-xl rounded-xl p-6 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-indigo-600 pb-4">
                <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                    <FaTint className="mr-3 text-blue-500" />
                    Gestión de Agua - Pantanos
                </h2>
            </div>

            {/* Reservoir Selection */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seleccionar Pantano
                </label>
                <select
                    value={selectedReservoir}
                    onChange={(e) => setSelectedReservoir(e.target.value)}
                    className="w-full md:w-1/2 p-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                    <option value="pantano1">Pantano 1 (15,000 L)</option>
                    <option value="pantano2">Pantano 2 (10,000 L)</option>
                </select>
            </div>

            {/* Current Status */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-indigo-200 mb-6">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
                    <FaChartBar className="mr-2" />
                    Estado Actual - {currentReservoir.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-xs text-gray-600 mb-1">Capacidad Total</p>
                        <p className="text-2xl font-bold text-indigo-600">{currentReservoir.capacity.toLocaleString()} L</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-xs text-gray-600 mb-1">Consumido (Riego)</p>
                        <p className="text-2xl font-bold text-orange-600">{waterUsed.toLocaleString()} L</p>
                        <p className="text-xs text-gray-500">({percentageUsed}%)</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-xs text-gray-600 mb-1">Disponible</p>
                        <p className="text-2xl font-bold text-green-600">{waterRemaining.toLocaleString()} L</p>
                        <p className="text-xs text-gray-500">({percentageFull}%)</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                        className={`h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ${
                            percentageFull > 50 ? 'bg-green-500' : percentageFull > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentageFull}%` }}
                    >
                        {percentageFull}%
                    </div>
                </div>
            </div>

            {/* Supply Water Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaPlus className="mr-2 text-green-600" />
                    Suministrar Agua
                </h3>
                <form onSubmit={handleSupplyWater} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad (Litros)
                            </label>
                            <input
                                type="number"
                                value={supplyAmount}
                                onChange={(e) => setSupplyAmount(e.target.value)}
                                placeholder="Ej: 5000"
                                required
                                min="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas (Opcional)
                            </label>
                            <input
                                type="text"
                                value={supplyNotes}
                                onChange={(e) => setSupplyNotes(e.target.value)}
                                placeholder="Ej: Suministro mensual"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl"
                    >
                        <FaPlus className="inline mr-2" />
                        Agregar Agua
                    </button>
                </form>
            </div>

            {/* Supply Log */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Historial de Suministros</h3>
                {supplyLog.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-indigo-600 text-white">
                                    <th className="border border-indigo-700 p-2 text-left">Fecha</th>
                                    <th className="border border-indigo-700 p-2 text-left">Pantano</th>
                                    <th className="border border-indigo-700 p-2 text-right">Cantidad</th>
                                    <th className="border border-indigo-700 p-2 text-left">Notas</th>
                                    <th className="border border-indigo-700 p-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplyLog.map((log, index) => (
                                    <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 p-2">{log.date}</td>
                                        <td className="border border-gray-300 p-2">{log.reservoirName}</td>
                                        <td className="border border-gray-300 p-2 text-right font-semibold text-blue-600">
                                            {log.amount.toLocaleString()} L
                                        </td>
                                        <td className="border border-gray-300 p-2 text-gray-600 italic">
                                            {log.notes || '-'}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center">
                                            <button 
                                                onClick={() => handleDeleteSupply(log.id, log.reservoir, log.amount)} 
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                                                title="Eliminar y restaurar nivel"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-600 italic">Sin registros de suministro</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaterManagement;
