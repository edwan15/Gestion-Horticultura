import React, { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { initializeApp } from "firebase/app";
import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    deleteDoc,
    doc,
    updateDoc,
    getDocs,
    writeBatch,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig"; // Asegúrate de que esta ruta sea correcta


// --- FUNCIONES Y CONSTANTES GENERALES ---

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();

// --- COMPONENTE ProductivityChart (Sin cambios) ---

const ProductivityChart = ({ summaryArray }) => {
    const colors = {
        typeA: "#8884d8",
        typeB: "#82ca9d",
        typeC: "#ffc658",
        typeD: "#ff7300",
        typeE: "#00c49f",
    };
    if (!summaryArray || summaryArray.length === 0) {
        return (
            <div className="h-64 sm:h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100">
                <p className="text-gray-500 italic">
                    No hay datos suficientes para generar el gráfico.
                </p>
            </div>
        );
    }
    return (
        <div className="h-64 sm:h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={summaryArray}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="name"
                        stroke="#333"
                        tick={{ fill: "#4b5563", fontSize: 10 }}
                    />
                    <YAxis stroke="#333" tick={{ fill: "#4b5563", fontSize: 10 }} />
                    <Tooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            background: "#fff",
                            fontSize: "12px",
                            padding: "5px",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
                        formatter={(value, name) => [value, name.replace("type", "Caja ")]}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                        formatter={(value) => value.replace("type", "Caja ")}
                    />
                    <Bar
                        dataKey="typeA"
                        stackId="a"
                        fill={colors.typeA}
                        name="Caja A"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="typeB"
                        stackId="a"
                        fill={colors.typeB}
                        name="Caja B"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="typeC"
                        stackId="a"
                        fill={colors.typeC}
                        name="Caja C"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="typeD"
                        stackId="a"
                        fill={colors.typeD}
                        name="Caja D"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="typeE"
                        stackId="a"
                        fill={colors.typeE}
                        name="Caja E"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- COMPONENTE WorkerManager (Sin cambios) ---
const WorkerManagerComponent = ({ db, userId, isAuthReady, setErrorMessage, workers, setWorkers, onDeleteWorker }) => {
    const [newWorkerName, setNewWorkerName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    
    // ESTADO PARA EDICIÓN
    const [editingWorker, setEditingWorker] = useState(null); // { id, name }
    const [editedName, setEditedName] = useState("");


    // 2. AGREGAR TRABAJADOR
    const addWorker = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage("");
        const name = newWorkerName.trim();
        if (!name) {
            setErrorMessage("Por favor, ingresa un nombre para el trabajador.");
            return;
        }
        if (workers.some(w => w.name.toLowerCase() === name.toLowerCase())) {
            setErrorMessage(`El trabajador "${name}" ya existe.`);
            return;
        }
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }

        setIsSaving(true);
        try {
            const collectionPath = `artifacts/${appId}/public/data/workers`; 
            await addDoc(collection(db, collectionPath), {
                name: name,
                userId: userId,
                createdAt: serverTimestamp(),
            });
            setNewWorkerName("");
        } catch (error) {
            console.error("Error adding worker: ", error);
            setErrorMessage("Error al guardar el trabajador: " + error.message);
        } finally {
            setIsSaving(false);
        }
    }, [db, newWorkerName, userId, setErrorMessage, workers]);
    
    // 3. ACTUALIZAR TRABAJADOR
    const updateWorker = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage("");
        const newName = editedName.trim();
        if (!newName) {
            setErrorMessage("El nombre del trabajador no puede estar vacío.");
            return;
        }
        if (!editingWorker) return;

        const nameConflict = workers.some(w => 
            w.name.toLowerCase() === newName.toLowerCase() && w.id !== editingWorker.id
        );
        if (nameConflict) {
            setErrorMessage(`El nombre "${newName}" ya está en uso por otro trabajador.`);
            return;
        }
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }

        setIsSaving(true);
        try {
            const workerRef = doc(db, `artifacts/${appId}/public/data/workers`, editingWorker.id);
            await updateDoc(workerRef, { 
                name: newName,
                updatedAt: serverTimestamp(),
            });
            
            setEditingWorker(null); 
            setEditedName("");
        } catch (error) {
            console.error("Error updating worker: ", error);
            setErrorMessage("Error al actualizar el trabajador: " + error.message);
        } finally {
            setIsSaving(false);
        }
    }, [db, editedName, editingWorker, setErrorMessage, workers]);


    // 4. ELIMINAR TRABAJADOR (MODIFICADO para eliminación en cascada)
    const deleteWorker = useCallback(async (workerId, workerName) => {
        if (!window.confirm(`⚠️ ADVERTENCIA: ¿Estás seguro de ELIMINAR al trabajador "${workerName}"? Esto también ELIMINARÁ todos los registros de producción asociados a su nombre (Visulización de Competitividad y Desempeño Acumulado).`)) {
            return;
        }
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }

        try {
            // 1. Eliminar entradas de producción (lógica de cascada)
            await onDeleteWorker(workerName);
            
            // 2. Eliminar el documento del trabajador
            const docRef = doc(db, `artifacts/${appId}/public/data/workers`, workerId);
            await deleteDoc(docRef);

        } catch (error) {
            console.error("Error deleting worker: ", error);
            setErrorMessage("Error al eliminar el trabajador y/o sus registros: " + error.message);
        }
    }, [db, setErrorMessage, onDeleteWorker]);


    // 5. Lógica de Subscripción para trabajadores
    useEffect(() => {
        if (!db || !isAuthReady || !userId) {
            setWorkers([]); 
            return;
        }

        const collectionPath = `artifacts/${appId}/public/data/workers`;
        const workersCollection = collection(db, collectionPath);
        
        const q = query(workersCollection, where("userId", "==", userId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const workerList = [];
                snapshot.forEach((doc) => {
                    workerList.push({ id: doc.id, ...doc.data() });
                });
                workerList.sort((a, b) => a.name.localeCompare(b.name)); 
                setWorkers(workerList);
            },
            (error) => {
                console.error("Firestore workers snapshot error:", error);
                setErrorMessage("Error al cargar la lista de trabajadores.");
            }
        );

        return () => unsubscribe();
    }, [db, isAuthReady, userId, setErrorMessage, setWorkers]);

    return (
        <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                👥 Administrar Trabajadores Guardados
            </h2>
            
            {/* Formulario para Agregar Trabajador */}
            <form onSubmit={addWorker} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Nuevo Nombre de Trabajador"
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    required
                    className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!isAuthReady || isSaving}
                    className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 shadow-md text-sm ${
                        !isAuthReady || isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isSaving ? "Guardando..." : "Agregar"}
                </button>
            </form>

            {/* Lista de Trabajadores */}
            <div className="border border-gray-200 rounded-lg p-3 max-h-60 overflow-y-auto">
                <h3 className="text-base font-medium text-gray-700 mb-2">Lista ({workers.length})</h3>
                <ul className="space-y-2">
                    {workers.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No hay trabajadores guardados aún.</p>
                    ) : (
                        workers.map((worker) => (
                            <li key={worker.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-100">
                                <span className="text-sm font-medium text-gray-800">{worker.name}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingWorker(worker);
                                            setEditedName(worker.name);
                                        }}
                                        className="text-indigo-500 hover:text-indigo-700 transition duration-150 p-1"
                                        title="Editar Trabajador"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => deleteWorker(worker.id, worker.name)}
                                        className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                                        title="Eliminar Trabajador y todos sus registros"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            
            {/* Modal de Edición */}
            {editingWorker && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <form onSubmit={updateWorker} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Editar Trabajador</h3>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo Nombre:</label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditingWorker(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white font-bold rounded-lg ${isSaving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
                                disabled={isSaving}
                            >
                                {isSaving ? "Actualizando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </section>
    );
};
const WorkerManager = memo(WorkerManagerComponent);


// --- COMPONENTE InputSection (Sin cambios) ---

const InputSectionComponent = ({
    db,
    userId,
    isAuthReady,
    setErrorMessage,
    isLoading,
    workers, 
}) => {
    // MODIFICADO: 'name' se convierte en 'selectedWorkers' (un array de nombres)
    const [newEntry, setNewEntry] = useState({
        selectedWorkers: [], // Array para guardar múltiples nombres
        date: new Date().toISOString().split("T")[0],
        typeA: 0,
        typeB: 0,
        typeC: 0,
        typeD: 0,
        typeE: 0,
    });

    const handleInputChange = useCallback((e) => {
        const { name, value, type } = e.target;
        if (name === "selectedWorkers") {
            // Manejar la selección de múltiples opciones
            const selectedOptions = Array.from(e.target.options)
                .filter(option => option.selected)
                .map(option => option.value);
            setNewEntry((prev) => ({
                ...prev,
                selectedWorkers: selectedOptions,
            }));
        } else {
            // Manejar inputs de número y fecha
            setNewEntry((prev) => ({
                ...prev,
                [name]: type === "number" ? parseInt(value) || 0 : value,
            }));
        }
    }, []);

    const addProduction = useCallback(
        async (e) => {
            e.preventDefault();
            setErrorMessage("");
            
            if (newEntry.selectedWorkers.length === 0) {
                setErrorMessage("Por favor, selecciona al menos un trabajador.");
                return;
            }

            const totalCajas = newEntry.typeA + newEntry.typeB + newEntry.typeC + newEntry.typeD + newEntry.typeE;
            if (totalCajas === 0) {
                setErrorMessage("Debes registrar al menos una caja en algún tipo.");
                return;
            }

            if (!db) {
                setErrorMessage("La base de datos no está lista.");
                return;
            }

            try {
                const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
                const batchPromises = newEntry.selectedWorkers.map(workerName => {
                    // Crea una entrada por cada trabajador seleccionado
                    return addDoc(collection(db, collectionPath), {
                        name: workerName, // El nombre del trabajador seleccionado
                        date: newEntry.date,
                        typeA: newEntry.typeA || 0,
                        typeB: newEntry.typeB || 0,
                        typeC: newEntry.typeC || 0,
                        typeD: newEntry.typeD || 0,
                        typeE: newEntry.typeE || 0,
                        userId: userId,
                        createdAt: serverTimestamp(),
                    });
                });

                await Promise.all(batchPromises);

                // Reinicia las cajas y la selección de trabajadores, manteniendo la fecha
                setNewEntry((prev) => ({
                    selectedWorkers: [],
                    date: prev.date,
                    typeA: 0,
                    typeB: 0,
                    typeC: 0,
                    typeD: 0,
                    typeE: 0,
                }));
            } catch (error) {
                console.error("Error adding documents: ", error);
                setErrorMessage("Error al registrar la producción: " + error.message);
            }
        },
        [db, newEntry, userId, setErrorMessage]
    );

    return (
        <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                ➕ Registrar Producción
            </h2>
            <form onSubmit={addProduction} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo Select para Trabajadores */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Trabajador(es):
                        </label>
                        <select
                            // MODIFICADO: Agregamos 'multiple' para seleccionar varios
                            multiple 
                            size={workers.length > 1 ? (workers.length > 5 ? 5 : workers.length) : 1} // Ajusta el tamaño de la lista
                            name="selectedWorkers"
                            value={newEntry.selectedWorkers}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
                            disabled={workers.length === 0}
                        >
                            {workers.length === 0 ? (
                                <option value="" disabled>-- Primero agrega trabajadores en el Administrador --</option>
                            ) : (
                                workers.map((worker) => (
                                    <option key={worker.id} value={worker.name}>
                                        {worker.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            (Mantén Ctrl o Cmd presionado para seleccionar múltiples)
                        </p>
                    </div>
                    {/* FIN DE MODIFICACIÓN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Fecha de Registro:
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={newEntry.date}
                            onChange={handleInputChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-3 sm:mb-4">
                        Cajas por Tipo (Cantidad)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        {["A", "B", "C", "D", "E"].map((type) => (
                            <div key={type}>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Tipo {type}:
                                </label>
                                <input
                                    type="number"
                                    name={`type${type}`}
                                    value={newEntry[`type${type}`]}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    // Deshabilita si no hay trabajadores seleccionados
                    disabled={!isAuthReady || isLoading || newEntry.selectedWorkers.length === 0} 
                    className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
                        !isAuthReady || isLoading || newEntry.selectedWorkers.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {isLoading ? "Guardando..." : `Registrar ${newEntry.selectedWorkers.length} Entrada(s)`}
                </button>
            </form>
        </section>
    );
};
const InputSection = memo(InputSectionComponent);


// --- COMPONENTE HistorySection (Sin cambios) ---

const HistorySection = ({
    workers, 
    selectedWorkerName, 
    setSelectedWorkerName, 
    selectedDate, 
    setSelectedDate,
    dailyEntries,
    setErrorMessage,
    onDeleteEntry, // Función para eliminar una sola entrada
    onUpdateEntry, // Función para actualizar una sola entrada
}) => {
    // Estado para la edición de una entrada de producción
    const [editingEntry, setEditingEntry] = useState(null); // Contiene la entrada completa a editar
    const [editData, setEditData] = useState({}); // Datos del formulario de edición

    // Inicia el proceso de edición
    const startEdit = useCallback((entry) => {
        setEditingEntry(entry);
        setEditData({
            typeA: entry.typeA || 0,
            typeB: entry.typeB || 0,
            typeC: entry.typeC || 0,
            typeD: entry.typeD || 0,
            typeE: entry.typeE || 0,
        });
    }, []);

    // Maneja los cambios en el formulario de edición
    const handleEditChange = useCallback((e) => {
        const { name, value, type } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value,
        }));
    }, []);

    // Guarda los cambios de la entrada editada
    const handleSaveEdit = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const totalCajas = editData.typeA + editData.typeB + editData.typeC + editData.typeD + editData.typeE;
        if (totalCajas === 0) {
            setErrorMessage("Debes registrar al menos una caja en algún tipo.");
            return;
        }

        try {
            await onUpdateEntry(editingEntry.id, {
                typeA: editData.typeA,
                typeB: editData.typeB,
                typeC: editData.typeC,
                typeD: editData.typeD,
                typeE: editData.typeE,
            });

            // Cierra el formulario de edición
            setEditingEntry(null);
            setEditData({});
        } catch (error) {
            setErrorMessage("Error al guardar la edición: " + error.message);
        }

    }, [editData, editingEntry, onUpdateEntry, setErrorMessage]);

    return (
        <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                🗓️ Historial por Trabajador y Fecha
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Seleccionar Trabajador:
                    </label>
                    <select
                        value={selectedWorkerName}
                        onChange={(e) => setSelectedWorkerName(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                        disabled={workers.length === 0}
                    >
                        {workers.length === 0 ? (
                            <option value="" disabled>No hay trabajadores</option>
                        ) : (
                            workers.map((worker) => (
                                <option key={worker.id} value={worker.name}>
                                    {worker.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Seleccionar Fecha:
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <h3 className="text-lg font-medium text-gray-700 mb-3">
                Registros para {selectedWorkerName || 'N/A'} el {selectedDate} ({dailyEntries.length})
            </h3>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hora
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cajas
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dailyEntries.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-3 py-4 text-center text-sm text-gray-500 italic">
                                    No hay registros para este trabajador en esta fecha.
                                </td>
                            </tr>
                        ) : (
                            dailyEntries.map((entry) => (
                                <tr key={entry.id}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                        {entry.createdAt?.toDate ? 
                                            entry.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                            : 'N/A'}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-600">
                                        {/* Muestra los tipos de caja que tienen valor > 0 */}
                                        {["A", "B", "C", "D", "E"].map(type => 
                                            (entry[`type${type}`] > 0) ? (
                                                <span key={type} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                                    T{type}: {entry[`type${type}`]}
                                                </span>
                                            ) : null
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => startEdit(entry)}
                                            className="text-indigo-600 hover:text-indigo-900 transition duration-150 p-1"
                                            title="Editar Entrada"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDeleteEntry(entry.id)}
                                            className="text-red-600 hover:text-red-900 transition duration-150 p-1"
                                            title="Eliminar Entrada"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición de Entrada */}
            {editingEntry && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Editar Entrada de {editingEntry.name} ({editingEntry.date})
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-yellow-50">
                            {["A", "B", "C", "D", "E"].map((type) => (
                                <div key={type}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cajas Tipo {type}:
                                    </label>
                                    <input
                                        type="number"
                                        name={`type${type}`}
                                        value={editData[`type${type}`]}
                                        onChange={handleEditChange}
                                        min="0"
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditingEntry(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white font-bold rounded-lg bg-green-600 hover:bg-green-700`}
                            >
                                Guardar Edición
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};


// --- COMPONENTE AuthForm (Sin cambios) ---

const AuthForm = ({
    email, setEmail, password, setPassword,
    isLoginMode, setIsLoginMode,
    authError, isLoadingAuth, handleAuth
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-4 border-blue-600">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
                    {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); handleAuth(e); }} className="space-y-4">
                    {/* Input de Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            type="email" id="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    {/* Input de Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Contraseña</label>
                        <input
                            type="password" id="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {authError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {authError}
                        </div>
                    )}

                    {/* Botón de Login/Registro */}
                    <button
                        type="submit"
                        disabled={isLoadingAuth}
                        className={`w-full py-3 font-bold rounded-lg transition duration-150 shadow-md text-white flex items-center justify-center ${isLoadingAuth ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoadingAuth ? (
                            <><span className="animate-spin mr-2">⚙️</span> Cargando...</> 
                        ) : (
                            isLoginMode ? 'Entrar' : 'Crear Cuenta'
                        )}
                    </button>
                </form>

                {/* Alternar modo Login/Registro */}
                <button
                    onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        setPassword(''); 
                        setEmail('');
                    }}
                    className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isLoginMode ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
    );
};


// --- COMPONENTE ProductivityAnalyzer (MODIFICADO con nuevo estilo de tabla) ---

const ProductivityAnalyzer = () => {
    const [productionData, setProductionData] = useState([]);
    const [workers, setWorkers] = useState([]); 
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [activeTab, setActiveTab] = useState("input"); 
    const [selectedWorkerName, setSelectedWorkerName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true); 
    const [authError, setAuthError] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const authRef = useRef(null);

    // --- FUNCIONES DE MANEJO DE DATOS CRUD (Sin cambios) ---

    const deleteProductionEntry = useCallback(async (entryId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta entrada de producción?")) {
            return;
        }
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }
        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/productivityEntries`, entryId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting production entry: ", error);
            setErrorMessage("Error al eliminar el registro: " + error.message);
        }
    }, [db, setErrorMessage]);

    const updateProductionEntry = useCallback(async (entryId, updatedFields) => {
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            throw new Error("La base de datos no está lista.");
        }
        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/productivityEntries`, entryId);
            await updateDoc(docRef, updatedFields);
        } catch (error) {
            console.error("Error updating production entry: ", error);
            throw new Error("Error al actualizar el registro: " + error.message);
        }
    }, [db, setErrorMessage]);

    const handleWorkerDeletion = useCallback(async (workerName) => {
        setErrorMessage("");
        if (!db || !userId) {
            setErrorMessage("La base de datos o autenticación no está lista.");
            return;
        }

        try {
            const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
            const entriesCollection = collection(db, collectionPath);
            
            const q = query(
                entriesCollection, 
                where("userId", "==", userId), 
                where("name", "==", workerName)
            );

            const snapshot = await getDocs(q);
            
            if (!snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.forEach((docEntry) => {
                    batch.delete(docEntry.ref);
                });
                await batch.commit();
                console.log(`Se eliminaron ${snapshot.size} registros de producción para ${workerName}.`);
            }

        } catch (error) {
            console.error("Error deleting worker's production entries: ", error);
            throw new Error("Fallo al limpiar registros de producción: " + error.message); 
        }
    }, [db, userId, setErrorMessage]);


    // --- useEffects (Sin cambios) ---

    useEffect(() => {
        if (!db || !isAuthReady || !userId) { 
            setProductionData([]);
            setIsLoading(false);
            return;
        }

        const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
        const entriesCollection = collection(db, collectionPath);
        
        const q = query(entriesCollection, where("userId", "==", userId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const entries = [];
                snapshot.forEach((doc) => {
                    entries.push({ id: doc.id, ...doc.data() });
                });
                setProductionData(entries);
                setIsLoading(false);
            },
            (error) => {
                console.error("Firestore data snapshot error:", error);
                setErrorMessage("Error al cargar los datos de la base de datos.");
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [db, isAuthReady, setErrorMessage, userId]); 


    useEffect(() => {
        const workerNames = workers.map(w => w.name);

        if (workers.length > 0) {
            if (!selectedWorkerName || !workerNames.includes(selectedWorkerName)) {
                setSelectedWorkerName(workers[0].name); 
            }
        } else {
            setSelectedWorkerName("");
        }
    }, [workers, selectedWorkerName]);

    useEffect(() => {
        try {
            if (Object.keys(firebaseConfig).length === 0) throw new Error("Firebase config not available.");
            
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);
            
            authRef.current = firebaseAuth; 
            setDb(firestore);

            setPersistence(firebaseAuth, browserLocalPersistence)
                .then(() => {
                    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
                        if (user) {
                            setUserId(user.uid);
                        } else {
                            setUserId(null); 
                        }
                        setIsAuthReady(true); 
                    });
                    return () => unsubscribeAuth();
                })
                .catch((error) => {
                    console.error("Error al configurar persistencia:", error);
                    setErrorMessage('Error de autenticación: No se pudo configurar la sesión.');
                    setIsAuthReady(true);
                });

        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setErrorMessage("Error al inicializar la base de datos.");
            setIsAuthReady(true);
            setIsLoading(false);
        }
    }, []); 

    const handleAuth = useCallback(async (e) => {
        e.preventDefault();
        setIsLoadingAuth(true);
        setAuthError(null);
        
        const authInstance = authRef.current;
        if (!authInstance) { setAuthError('Servicio de autenticación no inicializado.'); setIsLoadingAuth(false); return; }

        try {
            if (isLoginMode) {
                await signInWithEmailAndPassword(authInstance, email, password);
            } else {
                await createUserWithEmailAndPassword(authInstance, email, password);
            }
            setEmail('');
            setPassword('');
        } catch (error) {
            let errorMessage = "Ocurrió un error de autenticación.";
            if (error.code === 'auth/user-not-found') errorMessage = "Usuario no encontrado.";
            else if (error.code === 'auth/wrong-password') errorMessage = "Contraseña incorrecta.";
            else if (error.code === 'auth/invalid-email') errorMessage = "El formato del email es inválido.";
            else if (error.code === 'auth/email-already-in-use') errorMessage = "Este email ya está registrado.";
            else errorMessage = error.message;

            setAuthError(errorMessage);
        } finally {
            setIsLoadingAuth(false);
        }
    }, [email, password, isLoginMode]);

    const handleSignOut = useCallback(async () => {
        const authInstance = authRef.current;
        if (authInstance) {
            await signOut(authInstance);
        }
    }, []);


    // useMemo para el resumen
    const summary = useMemo(() => {
        const uniqueNames = [...new Set(productionData.map((e) => e.name))].sort(); 
        
        const totals = productionData.reduce((acc, entry) => {
            const entryA = Number(entry.typeA) || 0;
            const entryB = Number(entry.typeB) || 0;
            const entryC = Number(entry.typeC) || 0;
            const entryD = Number(entry.typeD) || 0;
            const entryE = Number(entry.typeE) || 0;

            if (!acc[entry.name])
                acc[entry.name] = {
                    total: 0,
                    typeA: 0,
                    typeB: 0,
                    typeC: 0,
                    typeD: 0,
                    typeE: 0,
                };
            acc[entry.name].typeA += entryA;
            acc[entry.name].typeB += entryB;
            acc[entry.name].typeC += entryC;
            acc[entry.name].typeD += entryD;
            acc[entry.name].typeE += entryE;
            acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;
            return acc;
        }, {});
        const summaryArray = Object.entries(totals)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.total - a.total);
        return { summaryArray, uniqueNames };
    }, [productionData]);


    const topPerformer = summary.summaryArray[0] || { name: "N/A", total: 0 };
    
    // useMemo para el historial diario (Sin cambios)
    const dailyEntries = useMemo(() => {
        if (!selectedWorkerName || !selectedDate) return [];
        return productionData
            .filter(
                (entry) =>
                    entry.name === selectedWorkerName && entry.date === selectedDate
            )
            .sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
            });
    }, [productionData, selectedWorkerName, selectedDate]);


    // Componente de Análisis (MODIFICADO AQUÍ con el nuevo estilo de tabla)
    const AnalysisSection = () => {
        
        // Función para calcular los máximos de cada tipo de caja (necesario para el resaltado verde)
        const maxByType = useMemo(() => {
            const types = ["typeA", "typeB", "typeC", "typeD", "typeE"];
            const maxes = {};
            types.forEach(type => {
                maxes[type] = Math.max(...summary.summaryArray.map(w => w[type] || 0));
            });
            return maxes;
        }, [summary.summaryArray]);

        // Función auxiliar para obtener el máximo (para usarlo dentro del map)
        const getMaxByType = useCallback((type) => {
            return maxByType[type] || 0;
        }, [maxByType]);

        return (
            <div className="space-y-6 sm:space-y-8">
                <section className="bg-yellow-100 p-4 sm:p-6 rounded-lg shadow-inner border border-yellow-300">
                    <h2 className="text-xl sm:text-2xl font-semibold text-yellow-800 mb-3">
                        ⭐ Resumen General Acumulado
                    </h2>
                    <p className="text-base sm:text-lg text-yellow-800">
                        El trabajador con el mayor rendimiento acumulado es:{" "}
                        <strong className="text-yellow-900">
                            {topPerformer.name}
                        </strong>{" "}
                        con un total de{" "}
                        <strong className="text-yellow-900">
                            {topPerformer.total}
                        </strong>{" "}
                        cajas producidas.
                    </p>
                </section>
                
                {/* Visualización de Competitividad (Gráfico - Sin cambios) */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    📊 Visualización de Competitividad (Todos los Trabajadores)
                </h2>
                <ProductivityChart summaryArray={summary.summaryArray} />
                
                {/* Desempeño por Categoría (Acumulado) - APLICANDO EL NUEVO ESTILO */}
                <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
                        🥇 Desempeño por Categoría (Acumulado)
                    </h2>
                    {summary.summaryArray.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
                                            Trabajador
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-blue-800">
                                            TOTAL
                                        </th>
                                        {['A', 'B', 'C', 'D', 'E'].map((type) => (
                                            <th key={type} className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
                                                Caja {type}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {summary.summaryArray.map((item, index) => (
                                        <tr 
                                            key={item.name} 
                                            // Primera fila resaltada en amarillo
                                            className={index === 0 ? 'bg-yellow-50 font-bold border-l-4 border-yellow-500' : 'hover:bg-gray-100'}
                                        >
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-left text-gray-900">
                                                {item.name}
                                            </td>
                                            {/* Columna TOTAL resaltada con estilo específico */}
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm sm:text-lg font-extrabold bg-blue-100 text-blue-900">
                                                {item.total}
                                            </td>
                                            {/* Columnas de Tipos de Caja con Resaltado Verde */}
                                            {['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
                                                <td 
                                                    key={typeIndex} 
                                                    className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm ${
                                                        // Aplica el resaltado verde si es el máximo en esa categoría
                                                        (item[type] || 0) > 0 && item[type] === getMaxByType(type) 
                                                            ? 'bg-green-100 font-bold text-green-800' 
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {item[type] || 0}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-sm">No hay datos de producción registrados aún.</p>
                    )}
                </section>
            </div>
        );
    };


    // Renderizado principal (Sin cambios)
    if (!userId) {
        return (
            <AuthForm 
                email={email} setEmail={setEmail} 
                password={password} setPassword={setPassword}
                isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode}
                authError={authError} isLoadingAuth={isLoadingAuth} 
                handleAuth={handleAuth} 
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
                    📈 Productivity Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden sm:inline">
                        Usuario: {authRef.current?.currentUser?.email || 'N/A'}
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-150 text-sm"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Mensaje de Error Global */}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                    <p className="font-bold">Error:</p>
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Navegación por Pestañas */}
            <div className="flex border-b border-gray-300 mb-8">
                {["input", "history", "analysis", "workers"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                            activeTab === tab
                                ? "border-blue-600 text-blue-600 font-bold"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab === "input" && "➕ Registro Diario"}
                        {tab === "history" && "🗓️ Historial"}
                        {tab === "analysis" && "📊 Análisis"}
                        {tab === "workers" && "👥 Trabajadores"}
                    </button>
                ))}
            </div>

            <main>
                {/* PESTAÑA DE REGISTRO */}
                {activeTab === "input" && (
                    <InputSection 
                        db={db}
                        userId={userId}
                        isAuthReady={isAuthReady}
                        setErrorMessage={setErrorMessage}
                        isLoading={isLoading}
                        workers={workers} 
                    />
                )}

                {/* PESTAÑA DE HISTORIAL */}
                {activeTab === "history" && (
                    <HistorySection 
                        workers={workers}
                        selectedWorkerName={selectedWorkerName}
                        setSelectedWorkerName={setSelectedWorkerName}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        dailyEntries={dailyEntries}
                        setErrorMessage={setErrorMessage}
                        onDeleteEntry={deleteProductionEntry}
                        onUpdateEntry={updateProductionEntry}
                    />
                )}


                {/* PESTAÑA DE ANÁLISIS */}
                {activeTab === "analysis" && <AnalysisSection />}

                {/* PESTAÑA DE ADMINISTRACIÓN DE TRABAJADORES */}
                {activeTab === "workers" && (
                    <WorkerManager
                        db={db}
                        userId={userId}
                        isAuthReady={isAuthReady}
                        setErrorMessage={setErrorMessage}
                        workers={workers}
                        setWorkers={setWorkers}
                        onDeleteWorker={handleWorkerDeletion} // La función de eliminación en cascada
                    />
                )}
            </main>
        </div>
    );
};

export default ProductivityAnalyzer;






