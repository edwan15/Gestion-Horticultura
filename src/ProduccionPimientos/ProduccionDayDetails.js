import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../src/features/auth/authSlice/authSlice'; 
import { toast } from 'react-toastify'; 

// Importaciones de Firebase (asegúrate de que las rutas son correctas)
import { db } from '../../src/firebaseConfig'; 
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp,
    deleteDoc, 
    doc, 
    updateDoc 
} from 'firebase/firestore'; 


// Mantenemos el mismo estado inicial ya que los campos son los mismos
const initialNewRecordState = (date) => ({
    INVERNADERO: '',
    M2: '',
    N_INIT: '', 
    N_FIN: '',  
    H_INIT: '', 
    H_FIN: '',  
    NOTAS: '',  
    date: date,
});


function ProduccionDayDetails({ refetchCalendar }) {
    const { date } = useParams();
    const navigate = useNavigate();
    const userId = useSelector(selectUserId); 
    
    // --- ESTADOS ---
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [dayRecords, setDayRecords] = useState([]);
    const [error, setError] = useState(null); 
    const [newRecord, setNewRecord] = useState(initialNewRecordState(date));
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null); 
    
    // 🚨 CLAVE: NUEVA COLECCIÓN DE FIREBASE
    const recordsCollectionRef = collection(db, "cosecha_diaria"); // <-- Cambiar el nombre de la colección
    
    // --- LÓGICA DE RECARGA (CRUD) ---
    const reloadData = async () => {
        setError(null);
        if (!userId) return;

        try {
            const q = query(recordsCollectionRef, 
                where("date", "==", date),
                where("userId", "==", userId) 
            );
            const querySnapshot = await getDocs(q);
            
            const data = querySnapshot.docs.map(doc => ({ 
                ...doc.data(), 
                id: doc.id,
                M2: parseFloat(doc.data().M2 || 0) 
            }));
            
            setDayRecords(data);
            
        } catch (err) {
            console.error("Error al recargar datos de cosecha:", err);
        }
    };
    
    
    // --- EFECTO CLAVE PARA CARGA INICIAL (LEER) ---
    useEffect(() => {
        setNewRecord(initialNewRecordState(date)); 
        
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null); 
            
            if (!userId) { 
                setIsLoading(false);
                return;
            }

            try {
                await reloadData();
            } catch (err) {
                console.error("Error en useEffect loadInitialData (Cosecha):", err);
                setError("Error al iniciar la carga de datos de cosecha.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
        
    }, [userId, date]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // --- MANEJO DEL FORMULARIO DE ADICIÓN (CREAR) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN')) 
            ? value.replace(',', '.') 
            : value;
            
        setNewRecord(prev => ({ ...prev, [name]: processedValue }));
    };
    
    const handleAddRecord = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            toast.error("No se puede registrar. El ID de usuario no está disponible.");
            return;
        }
        
        if (!newRecord.INVERNADERO || !newRecord.M2 || isNaN(parseFloat(newRecord.M2)) || parseFloat(newRecord.M2) <= 0) {
            toast.error("Por favor, rellena los campos de Invernadero y M² con valores válidos.");
            return;
        }

        setIsAdding(true);
        setError(null); 

        try {
            const recordToSave = {
                ...newRecord,
                userId: userId, 
                createdAt: serverTimestamp(),
                M2: parseFloat(newRecord.M2), 
            };
            
            await addDoc(recordsCollectionRef, recordToSave);
            
            toast.success("Registro de cosecha añadido con éxito.");
            
            await reloadData(); 
            refetchCalendar(); // Notifica al calendario para actualizar puntos
            setNewRecord(initialNewRecordState(date)); 
            
        } catch (err) {
            console.error("Error al añadir registro de cosecha:", err);
            setError("Error al guardar el registro de cosecha en Firebase.");
            toast.error("Error al guardar el registro de cosecha en Firebase.");
        } finally {
            setIsAdding(false);
        }
    };

    // --- MANEJO DE EDICIÓN Y ELIMINACIÓN (ACTUALIZAR y ELIMINAR) ---
    const startEdit = (record) => {
        setEditingId(record.id);
        setEditForm({ ...record, M2: String(record.M2) }); 
        setError(null); 
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN')) 
            ? value.replace(',', '.') 
            : value;
            
        setEditForm(prev => ({ ...prev, [name]: processedValue }));
    };

    const saveEdit = async (recordId) => {
        if (!editForm || !userId) return;
        
        try {
            const docRef = doc(db, "cosecha_diaria", recordId); // <-- Colección
            const dataToUpdate = {
                INVERNADERO: editForm.INVERNADERO,
                M2: parseFloat(editForm.M2), 
                N_INIT: editForm.N_INIT,
                N_FIN: editForm.N_FIN,
                H_INIT: editForm.H_INIT,
                H_FIN: editForm.H_FIN,
                NOTAS: editForm.NOTAS,
                updatedAt: serverTimestamp(),
            };
            
            await updateDoc(docRef, dataToUpdate);
            
            toast.success("Registro de cosecha actualizado.");
            cancelEdit();
            await reloadData(); 
            refetchCalendar(); 
            
        } catch (error) {
            console.error("Error al actualizar registro de cosecha:", error);
            toast.error("Error al actualizar el registro de cosecha.");
        }
    };

    const handleDelete = async (recordId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este registro de cosecha?")) return;

        try {
            const docRef = doc(db, "cosecha_diaria", recordId); // <-- Colección
            await deleteDoc(docRef);
            
            toast.success("Registro de cosecha eliminado.");
            await reloadData(); 
            refetchCalendar(); 
            
        } catch (error) {
            console.error("Error al eliminar registro de cosecha:", error);
            toast.error("Error al eliminar el registro de cosecha.");
        }
    };


    // --- RENDERIZADO ---
    if (!userId || isLoading) {
        // ... (Mismo renderizado de error/carga)
        return (
            <div className="p-6 text-center text-amber-600">
                {isLoading ? "Cargando registros de cosecha..." : "⚠️ Acceso Denegado (Usuario no activo)"}
            </div>
        );
    }
    
    return (
        <div className="mx-auto p-4 max-w-6xl bg-white shadow-xl rounded-xl mt-6">
            <header className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-amber-800">
                    Registros de Cosecha: <span className="text-amber-600">{date}</span>
                </h1>
                <button
                    // 🚨 CLAVE: RUTA DE RETORNO AL CALENDARIO DE PRODUCCIÓN
                    onClick={() => navigate('/produccion')} 
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    &larr; Volver al Calendario
                </button>
            </header>
            
            {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">Error: {error}</p>}


            {/* SECCIÓN 1: FORMULARIO DE NUEVO REGISTRO (CREAR) */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow-inner mb-8 border border-yellow-200">
                <h2 className="text-xl font-bold mb-4 text-amber-700">Añadir Nuevo Registro de Cosecha</h2>
                <form onSubmit={handleAddRecord} className="space-y-4">
                    
                    {/* Fila 1: M2 e Invernadero */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ... (inputs INVERNADERO y M2) ... */}
                        <div>
                            <label htmlFor="invernadero" className="block text-sm font-medium text-gray-700">Invernadero/Sección <span className="text-red-500">*</span></label>
                            <input type="text" id="invernadero" name="INVERNADERO" value={newRecord.INVERNADERO} onChange={handleInputChange} placeholder="Ej: A1, F-Central" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="m2" className="block text-sm font-medium text-gray-700">Producción (M²) <span className="text-red-500">*</span></label>
                            <input type="text" id="m2" name="M2" value={newRecord.M2} onChange={handleInputChange} placeholder="Ej: 150.75" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" />
                        </div>
                    </div>
                    
                    {/* Fila 2: Tiempos (Horas y N) - Responsivo: 2 columnas en móvil, 4 en LG */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* ... (inputs H.INIT, H.FIN, N.INIT, N.FIN) ... */}
                        <div><label htmlFor="h_init" className="block text-sm font-medium text-gray-700">H. INICIO</label><input type="time" id="h_init" name="H_INIT" value={newRecord.H_INIT} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" /></div>
                        <div><label htmlFor="h_fin" className="block text-sm font-medium text-gray-700">H. FIN</label><input type="time" id="h_fin" name="H_FIN" value={newRecord.H_FIN} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" /></div>
                        <div><label htmlFor="n_init" className="block text-sm font-medium text-gray-700">N. INICIO</label><input type="text" id="n_init" name="N_INIT" value={newRecord.N_INIT} onChange={handleInputChange} placeholder="Lectura N.I." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" /></div>
                        <div><label htmlFor="n_fin" className="block text-sm font-medium text-gray-700">N. FIN</label><input type="text" id="n_fin" name="N_FIN" value={newRecord.N_FIN} onChange={handleInputChange} placeholder="Lectura N.F." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500" /></div>
                    </div>
                    
                    {/* Fila 3: Notas y Botón */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label htmlFor="notas" className="block text-sm font-medium text-gray-700">Notas/Reporte</label>
                            <textarea id="notas" name="NOTAS" value={newRecord.NOTAS} onChange={handleInputChange} rows="2" placeholder="Detalles o comentarios relevantes del proceso..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-amber-500 focus:ring-amber-500"></textarea>
                        </div>
                        <button type="submit" disabled={isAdding} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200 ${isAdding ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'}`}>
                            {isAdding ? 'Guardando...' : '💾 Registrar Cosecha'}
                        </button>
                    </div>
                </form>
            </div>


            {/* SECCIÓN 2: LISTA DE REGISTROS EXISTENTES */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">Registros Existentes ({dayRecords.length})</h2>
            
            {dayRecords.length > 0 ? (
                <ul className="space-y-4">
                    {dayRecords.map(record => (
                        <li key={record.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                            {editingId === record.id ? (
                                
                                <form onSubmit={(e) => { e.preventDefault(); saveEdit(record.id); }} className="space-y-4">
                                    <h3 className="text-lg font-bold text-amber-700 border-b pb-2 mb-2">Editando Registro</h3>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {/* Mantenemos responsividad 2 en móvil, 4 en desktop */}
                                        <input type="text" name="INVERNADERO" value={editForm.INVERNADERO} onChange={handleEditChange} placeholder="Invernadero" required className="p-2 border rounded" />
                                        <input type="text" name="M2" value={editForm.M2} onChange={handleEditChange} placeholder="M²" required className="p-2 border rounded" />
                                        <input type="time" name="H_INIT" value={editForm.H_INIT} onChange={handleEditChange} className="p-2 border rounded" />
                                        <input type="time" name="H_FIN" value={editForm.H_FIN} onChange={handleEditChange} className="p-2 border rounded" />
                                        <input type="text" name="N_INIT" value={editForm.N_INIT} onChange={handleEditChange} placeholder="N. INICIO" className="p-2 border rounded" />
                                        <input type="text" name="N_FIN" value={editForm.N_FIN} onChange={handleEditChange} placeholder="N. FIN" className="p-2 border rounded" />
                                    </div>
                                    <textarea name="NOTAS" value={editForm.NOTAS} onChange={handleEditChange} placeholder="Notas" rows="2" className="w-full p-2 border rounded"></textarea>
                                    
                                    <div className="flex space-x-2 justify-end">
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                                        <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Guardar Cambios</button>
                                    </div>
                                </form>

                            ) : (
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <p className="text-xl font-bold text-gray-900 mb-1">
                                            {record.M2.toFixed(2)} M² en {record.INVERNADERO}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                                            <span>⏱️ **{record.H_INIT || 'N/A'}** a **{record.H_FIN || 'N/A'}**</span>
                                            <span>🔢 N: **{record.N_INIT || 'N/A'}** a **{record.N_FIN || 'N/A'}**</span>
                                        </div>
                                        {record.NOTAS && (
                                            <p className="text-sm mt-2 p-2 bg-gray-100 rounded italic border-l-2 border-amber-400">
                                                Notas: {record.NOTAS}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="md:col-span-1 flex space-x-2 justify-start lg:justify-end items-center mt-2 lg:mt-0">
                                        <button onClick={() => startEdit(record)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(record.id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-6 text-center bg-gray-100 rounded-lg">
                    <p className="text-gray-600 italic">Aún no hay registros de cosecha para esta fecha.</p>
                </div>
            )}
        </div>
    );
}

export default ProduccionDayDetails;