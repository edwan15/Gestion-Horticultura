import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { toast } from 'react-toastify';
import { FaWarehouse, FaRulerCombined, FaClock, FaSortNumericUpAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Importaciones de Firebase (asegúrate de que las rutas son correctas)
import { db } from '../../firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc,
    orderBy,
    limit
} from 'firebase/firestore';

// Opciones fijas para el select de Invernadero
const INVERNADERO_OPTIONS = Array.from({ length: 10 }, (_, i) => `Invernadero ${i + 1}`);

// Estado inicial del formulario con los nuevos campos
const initialNewRecordState = (date) => ({
    INVERNADERO: '', // Ahora será el valor seleccionado del select
    M2: '',
    N_INIT: '',
    N_FIN: '',
    H_INIT: '',
    H_FIN: '',
    NOTAS: '',
    date: date,
});


function DayDetails({ refetchData }) {
    const { date } = useParams();
    const navigate = useNavigate();

    // Obtiene el ID del usuario
    const userId = useSelector(selectUserId);

    // --- ESTADOS ---
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [dayRecords, setDayRecords] = useState([]);
    const [error, setError] = useState(null);

    // Formulario de adición
    const [newRecord, setNewRecord] = useState(initialNewRecordState(date));

    // Edición
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const recordsCollectionRef = collection(db, "produccion_diaria");


    // --- LÓGICA DE RECARGA (Usada para CRUD) ---
    /**
     * Función interna para recargar los datos del día actual.
     * Usada después de crear, actualizar o eliminar.
     */
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
                // Asegura que M2 es un número para cálculos/visualización
                M2: parseFloat(doc.data().M2 || 0)
            }));

            setDayRecords(data);

        } catch (err) {
            console.error("Error al recargar datos:", err);
            // No usamos toast para la recarga silenciosa, solo para errores críticos
        }
    };

    // --- OBTENER EL ÚLTIMO N_FIN para secuencialidad (GLOBAL) ---
    /**
     * Busca el último registro existente (por fecha de creación global) y retorna su N_FIN.
     * Esta función garantiza la secuencia entre días.
     */
    const getSequentialNInit = async (currentUserId) => {
        if (!currentUserId) return '';

        try {
            // Consulta para encontrar el último registro del usuario, ordenado por fecha de creación (descendente)
            const latestRecordQuery = query(
                recordsCollectionRef,
                where("userId", "==", currentUserId),
                orderBy("createdAt", "desc"), // Campo clave para el secuencial global
                limit(1)
            );

            const querySnapshot = await getDocs(latestRecordQuery);

            if (querySnapshot.empty) {
                return ''; // No hay registros anteriores
            }

            const lastRecord = querySnapshot.docs[0].data();
            const lastNFin = lastRecord.N_FIN || '';
            
            // console.log("-> Último registro encontrado. N.FIN:", lastNFin, " de la fecha:", lastRecord.date);
            
            return lastNFin; // Retorna el N_FIN del último registro
        } catch (err) {
            // console.error("Error al buscar el último N.FIN para secuencialidad. ¡REVISA TUS ÍNDICES DE FIREBASE!", err);
            return '';
        }
    };

    // --- EFECTO CLAVE PARA CARGA INICIAL (LEER) ---
    useEffect(() => {
        // Inicializa el formulario al cambiar de fecha con valores por defecto
        setNewRecord(initialNewRecordState(date));
        setEditingId(null);

        // Función de carga inicial y secuencial
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);

            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                // 1. Cargar los registros del día actual
                await reloadData();

                // 2. OBTENER EL VALOR SECUENCIAL DEL ÚLTIMO REGISTRO GLOBAL
                const lastNFin = await getSequentialNInit(userId);

                // 3. Establecer el estado inicial del formulario de adición con el N_INIT secuencial
                setNewRecord(prev => ({
                    ...initialNewRecordState(date),
                    N_INIT: lastNFin || '', // Establece el N_INIT con el valor secuencial
                    INVERNADERO: INVERNADERO_OPTIONS[0] || '', // Establece el primer invernadero como default
                }));

            } catch (err) {
                console.error("Error en useEffect loadInitialData:", err);
                setError("Error al iniciar la carga de datos.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

        // Dependencias limpias
    }, [userId, date]); // eslint-disable-line react-hooks/exhaustive-deps


    // --- MANEJO DEL FORMULARIO DE ADICIÓN (CREAR) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 1. Preprocesamiento: Permite comas y puntos para números
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN'))
            ? value.replace(',', '.')
            : value;

        // 2. Crear el nuevo estado temporal del formulario
        let updatedRecord = {
            ...newRecord,
            [name]: processedValue
        };

        // 3. Lógica CLAVE: Cálculo automático de N.FIN
        if (name === 'N_INIT' || name === 'M2') {
            // Convertir N_INIT (string) y M2 (string) a números.
            const nInitStr = name === 'N_INIT' ? processedValue : updatedRecord.N_INIT;
            const m2Str = name === 'M2' ? processedValue : updatedRecord.M2;

            // Limpiar ceros a la izquierda para la conversión a número, y luego convertir a flotante.
            const N_INIT_Num = parseFloat(nInitStr.replace(/^0+/, ''));
            const M2_Num = parseFloat(m2Str);

            // Asegúrate de que ambos son números válidos antes de calcular
            if (!isNaN(N_INIT_Num) && !isNaN(M2_Num)) {
                let N_FIN_Num = N_INIT_Num + M2_Num;

                // Primero, redondeamos N_FIN_Num a un entero si es una unidad de conteo.
                N_FIN_Num = Math.round(N_FIN_Num);

                // Convertir a string y rellenar con ceros a la izquierda (padding)
                let N_FIN_Str = String(N_FIN_Num);

                // Intentamos mantener la longitud del N.INICIO, si está disponible.
                const initLength = nInitStr.length;
                if (initLength > 0 && N_FIN_Str.length < initLength) {
                    // Rellenar con ceros a la izquierda.
                    N_FIN_Str = N_FIN_Str.padStart(initLength, '0');
                }

                // Actualizar el valor de N_FIN en el objeto temporal
                updatedRecord.N_FIN = N_FIN_Str;
            } else {
                // Si falta alguno o no es un número válido, dejamos N_FIN vacío o sin calcular.
                updatedRecord.N_FIN = '';
            }
        }

        // 4. Establecer el estado con el valor del campo modificado y el N.FIN calculado (si aplica)
        setNewRecord(updatedRecord);
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.error("No se puede registrar. El ID de usuario no está disponible.");
            return;
        }

        // Validación básica
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

            // Asegurar que N_FIN se calcula si no se hizo manualmente (aunque handleInputChange lo hace)
            if (!recordToSave.N_FIN && recordToSave.N_INIT && recordToSave.M2) {
                 // Esta lógica es redundante si handleInputChange funciona, pero es un buen fallback
                 const N_INIT_Num = parseFloat(String(recordToSave.N_INIT).replace(/^0+/, ''));
                 const M2_Num = recordToSave.M2;
                 if (!isNaN(N_INIT_Num) && !isNaN(M2_Num)) {
                     let N_FIN_Num = Math.round(N_INIT_Num + M2_Num);
                     let N_FIN_Str = String(N_FIN_Num);

                     const initLength = String(recordToSave.N_INIT).length;
                     if (initLength > 0 && N_FIN_Str.length < initLength) {
                         N_FIN_Str = N_FIN_Str.padStart(initLength, '0');
                     }
                     recordToSave.N_FIN = N_FIN_Str;
                 }
            }


            await addDoc(recordsCollectionRef, recordToSave);

            toast.success("Registro de producción añadido con éxito.");

            await reloadData(); // 1. Recarga los datos del día
            refetchData(); // Notifica al calendario para actualizar puntos

            // 2. OBTENER EL VALOR SECUENCIAL del registro que ACABAMOS DE GUARDAR
            // Usamos el N_FIN del registro recién guardado para la inicialización del siguiente formulario
            const newSequentialNInit = recordToSave.N_FIN;

            // 3. Limpia el formulario, pero establece el nuevo N_INIT secuencial
            setNewRecord(prev => ({
                ...initialNewRecordState(date),
                N_INIT: newSequentialNInit || '',
                INVERNADERO: prev.INVERNADERO, // Mantiene el invernadero seleccionado para entrada rápida
            }));

        } catch (err) {
            console.error("Error al añadir registro:", err);
            setError("Error al guardar el registro en Firebase.");
            toast.error("Error al guardar el registro en Firebase.");
        } finally {
            setIsAdding(false);
        }
    };

    // --- MANEJO DE EDICIÓN Y ELIMINACIÓN (ACTUALIZAR y ELIMINAR) ---

    const startEdit = (record) => {
        setEditingId(record.id);
        // Asegura que M2 es una cadena para el input de texto
        setEditForm({ ...record, M2: String(record.M2) });
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };


    const handleEditChange = (e) => {
        const { name, value } = e.target;

        // 1. Preprocesamiento: Permite comas y puntos para números
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN'))
            ? value.replace(',', '.')
            : value;

        // 2. Crear el nuevo estado temporal del formulario de edición
        let updatedEditForm = {
            ...editForm,
            [name]: processedValue
        };

        // 3. Lógica CLAVE: Cálculo automático de N.FIN para edición
        if (name === 'N_INIT' || name === 'M2') {
            // Usamos la versión *actualizada* del estado para el cálculo.
            const nInitStr = name === 'N_INIT' ? processedValue : updatedEditForm.N_INIT;
            const m2Str = name === 'M2' ? processedValue : updatedEditForm.M2;

            const N_INIT_Num = parseFloat(nInitStr.replace(/^0+/, ''));
            const M2_Num = parseFloat(m2Str);

            if (!isNaN(N_INIT_Num) && !isNaN(M2_Num)) {
                let N_FIN_Num = N_INIT_Num + M2_Num;

                N_FIN_Num = Math.round(N_FIN_Num);
                let N_FIN_Str = String(N_FIN_Num);

                // Rellenar con ceros (misma lógica que en handleInputChange)
                const initLength = nInitStr.length;
                if (initLength > 0 && N_FIN_Str.length < initLength) {
                    N_FIN_Str = N_FIN_Str.padStart(initLength, '0');
                }

                updatedEditForm.N_FIN = N_FIN_Str;
            } else {
                updatedEditForm.N_FIN = '';
            }
        }

        // 4. Establecer el estado de edición
        setEditForm(updatedEditForm);
    };

    const saveEdit = async (recordId) => {
        if (!editForm || !userId) return;

        try {
            const docRef = doc(db, "produccion_diaria", recordId);
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

            toast.success("Registro actualizado.");
            cancelEdit();
            await reloadData(); // Recarga los datos
            refetchData();

        } catch (error) {
            console.error("Error al actualizar registro:", error);
            toast.error("Error al actualizar el registro.");
        }
    };

    const handleDelete = async (recordId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este registro? Esta acción es irreversible.")) return;

        try {
            const docRef = doc(db, "produccion_diaria", recordId);
            await deleteDoc(docRef);

            toast.success("Registro eliminado.");
            await reloadData(); // Recarga los datos
            refetchData();

        } catch (error) {
            console.error("Error al eliminar registro:", error);
            toast.error("Error al eliminar el registro.");
        }
    };


    // --- RENDERIZADO CONDICIONAL ---

    if (!userId) {
        return (
            <div className="p-6 my-8 rounded-lg text-center bg-red-100 border-2 border-red-500 text-red-800 shadow-lg">
                <p className="font-bold text-xl mb-2">⚠️ Acceso Denegado</p>
                <p>No hay una sesión de usuario activa o el ID de usuario no está disponible.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-6 text-center text-indigo-600">Cargando registros del día...</div>;
    }

    return (
        <div className="mx-auto p-4 max-w-6xl bg-white shadow-xl rounded-xl mt-6">
            <header className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-indigo-800">
                    Registros del Día: <span className="text-indigo-600">{date}</span>
                </h1>
                <button
                    onClick={() => navigate('/riego')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    &larr; Volver al Calendario
                </button>
            </header>

            {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">Error: {error}</p>}


            {/* SECCIÓN 1: FORMULARIO DE NUEVO REGISTRO (CREAR) */}
            <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
                <h2 className="text-xl font-bold mb-4 text-indigo-700">Añadir Nuevo Registro</h2>
                <form onSubmit={handleAddRecord} className="space-y-4">

                    {/* Fila 1: M2 e Invernadero */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="invernadero" className="block text-sm font-medium text-gray-700">Invernadero/Sección <span className="text-red-500">*</span></label>
                            {/* CAMPO SELECT IMPLEMENTADO AQUÍ */}
                            <select
                                id="invernadero"
                                name="INVERNADERO"
                                value={newRecord.INVERNADERO}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="" disabled>Selecciona un invernadero</option>
                                {INVERNADERO_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="m2" className="block text-sm font-medium text-gray-700">Producción (M²) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="m2"
                                name="M2"
                                value={newRecord.M2}
                                onChange={handleInputChange}
                                placeholder="Ej: 150.75"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Fila 2: Tiempos (Horas y N) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* H.INIT */}
                        <div>
                            <label htmlFor="h_init" className="block text-sm font-medium text-gray-700">H. INICIO</label>
                            <input
                                type="time"
                                id="h_init"
                                name="H_INIT"
                                value={newRecord.H_INIT}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* H.FIN */}
                        <div>
                            <label htmlFor="h_fin" className="block text-sm font-medium text-gray-700">H. FIN</label>
                            <input
                                type="time"
                                id="h_fin"
                                name="H_FIN"
                                value={newRecord.H_FIN}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* N.INIT */}
                        <div>
                            <label htmlFor="n_init" className="block text-sm font-medium text-gray-700">N. INICIO</label>
                            <input
                                type="text"
                                id="n_init"
                                name="N_INIT"
                                value={newRecord.N_INIT}
                                onChange={handleInputChange}
                                placeholder="Lectura N.I."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        {/* N.FIN */}
                        <div>
                            <label htmlFor="n_fin" className="block text-sm font-medium text-gray-700">N. FIN</label>
                            <input
                                type="text"
                                id="n_fin"
                                name="N_FIN"
                                value={newRecord.N_FIN}
                                onChange={handleInputChange}
                                placeholder="Lectura N.F."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Fila 3: Notas y Botón */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3">
                            <label htmlFor="notas" className="block text-sm font-medium text-gray-700">Notas/Reporte</label>
                            <textarea
                                id="notas"
                                name="NOTAS"
                                value={newRecord.NOTAS}
                                onChange={handleInputChange}
                                rows="2"
                                placeholder="Detalles o comentarios relevantes del proceso..."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isAdding}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200
                                ${isAdding ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
                            }
                        >
                            {isAdding ? 'Guardando...' : '💾 Registrar Producción'}
                        </button>
                    </div>
                </form>
            </div>


            {/* SECCIÓN 2: LISTA DE REGISTROS EXISTENTES (LEER, ACTUALIZAR, ELIMINAR) */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">Registros Existentes ({dayRecords.length})</h2>

            {dayRecords.length > 0 ? (
                <ul className="space-y-6">
                    {dayRecords.map(record => (
                        <li key={record.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            {editingId === record.id ? (

                                // --- MODO EDICIÓN ---
                                <form onSubmit={(e) => { e.preventDefault(); saveEdit(record.id); }} className="space-y-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                                    <h3 className="text-xl font-bold text-yellow-800 border-b pb-2 mb-3">Editando Registro: {record.INVERNADERO}</h3>

                                    {/* GRUPO 1: INVERNADERO y M2 */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Invernadero</label>
                                            {/* CAMPO SELECT PARA EDICIÓN */}
                                            <select
                                                name="INVERNADERO"
                                                value={editForm.INVERNADERO}
                                                onChange={handleEditChange}
                                                required
                                                className="p-2 border rounded w-full"
                                            >
                                                {INVERNADERO_OPTIONS.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Producción (M²)</label>
                                            <input type="text" name="M2" value={editForm.M2} onChange={handleEditChange} placeholder="M²" required className="p-2 border rounded w-full" />
                                        </div>
                                    </div>

                                    {/* GRUPO 2: H / N */}
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">H. INICIO</label>
                                            <input type="time" name="H_INIT" value={editForm.H_INIT} onChange={handleEditChange} className="p-2 border rounded w-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">H. FIN</label>
                                            <input type="time" name="H_FIN" value={editForm.H_FIN} onChange={handleEditChange} className="p-2 border rounded w-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">N. INICIO</label>
                                            <input type="text" name="N_INIT" value={editForm.N_INIT} onChange={handleEditChange} placeholder="N. INICIO" className="p-2 border rounded w-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">N. FIN</label>
                                            <input type="text" name="N_FIN" value={editForm.N_FIN} onChange={handleEditChange} placeholder="N. FIN" className="p-2 border rounded w-full" />
                                        </div>
                                    </div>

                                    {/* NOTAS */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Notas</label>
                                        <textarea name="NOTAS" value={editForm.NOTAS} onChange={handleEditChange} placeholder="Notas" rows="2" className="w-full p-2 border rounded"></textarea>
                                    </div>

                                    <div className="flex space-x-2 justify-end pt-2">
                                        <button type="button" onClick={cancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150">Cancelar</button>
                                        <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150">Guardar Cambios</button>
                                    </div>
                                </form>

                            ) : (

                                // --- MODO LECTURA ---
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

                                    {/* Columna 1: Producción Principal (INVERNADERO y M2) */}
                                    <div className="md:col-span-2 flex flex-col justify-start border-r border-gray-200 md:pr-6">
                                        <div className="flex items-center text-sm font-semibold text-indigo-600 uppercase mb-1">
                                            <FaWarehouse className="mr-2 text-indigo-500" /> Sección de Producción
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                                            {record.INVERNADERO || 'N/A'}
                                        </h3>
                                        <div className="flex items-center text-lg font-bold text-green-700 bg-green-50 px-3 py-1 rounded-md inline-flex mt-1 shadow-sm border border-green-100">
                                            <FaRulerCombined className="mr-2 text-green-600" />
                                            <span>{record.M2 ? `${(record.M2).toFixed(2)} M²` : '0.00 M²'}</span>
                                        </div>
                                    </div>

                                    {/* Columna 2: Detalles de Lectura (Horas y N) */}
                                    <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-4 pt-2 md:pt-0">

                                        {/* Lectura HORA */}
                                        <div className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded-lg">
                                            <div className="flex items-center text-xs font-semibold text-blue-700 uppercase mb-1">
                                                <FaClock className="mr-1" /> Horas
                                            </div>
                                            <span className="text-lg font-semibold text-gray-800 block">
                                                {record.H_INIT || 'N/A'}
                                                <span className="text-gray-500 font-normal text-sm mx-1">a</span>
                                                {record.H_FIN || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Lectura N (Números) */}
                                        <div className="border-l-4 border-purple-500 pl-3 bg-purple-50 p-2 rounded-lg">
                                            <div className="flex items-center text-xs font-semibold text-purple-700 uppercase mb-1">
                                                <FaSortNumericUpAlt className="mr-1" /> Contador N.
                                            </div>
                                            <span className="text-lg font-semibold text-gray-800 block">
                                                {record.N_INIT || 'N/A'}
                                                <span className="text-gray-500 font-normal text-sm mx-1">a</span>
                                                <strong className="text-purple-700">{record.N_FIN || 'N/A'}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Columna 3: Acciones */}
                                    <div className="md:col-span-1 flex flex-col space-y-2 md:justify-end md:items-end md:self-stretch pt-2 md:pt-0">
                                        <button
                                            onClick={() => startEdit(record)}
                                            className="w-full md:w-auto px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md transition duration-150 flex items-center justify-center"
                                        >
                                            <FaEdit className="mr-2" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="w-full md:w-auto px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-md transition duration-150 flex items-center justify-center"
                                        >
                                            <FaTrashAlt className="mr-2" /> Eliminar
                                        </button>
                                    </div>

                                    {/* FILA COMPLETA 4: NOTAS (MÁS INDEPENDIENTE) */}
                                    {record.NOTAS && (
                                        <div className="col-span-full mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
                                            <p className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                                📢 Reporte / Notas Adicionales
                                            </p>
                                            <p className="text-base text-gray-800 italic border-l-4 border-gray-400 pl-3">
                                                {record.NOTAS}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 italic text-lg">✨ Sin registros. ¡Añade el primero!</p>
                </div>
            )}


        </div>
    );
}

export default DayDetails;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectUserId } from '../../features/auth/authSlice/authSlice';
// import { toast } from 'react-toastify';
// import { FaWarehouse, FaRulerCombined, FaClock, FaSortNumericUpAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';

// // Importaciones de Firebase
// import { db } from '../../firebaseConfig';
// import {
//     collection,
//     query,
//     where,
//     getDocs,
//     addDoc,
//     serverTimestamp,
//     deleteDoc,
//     doc,
//     updateDoc,
//     orderBy,
// } from 'firebase/firestore';

// // Estado inicial del formulario
// const initialNewRecordState = (date) => ({
//     INVERNADERO: '',
//     M2: '',
//     N_INIT: '',
//     N_FIN: '',
//     H_INIT: '',
//     H_FIN: '',
//     NOTAS: '',
//     date: date,
// });


// function DayDetails({ refetchCalendar }) {
//     const { date } = useParams();
//     const navigate = useNavigate();

//     // Obtiene el ID del usuario
//     const userId = useSelector(selectUserId);

//     // --- ESTADOS ---
//     const [isLoading, setIsLoading] = useState(true);
//     const [isAdding, setIsAdding] = useState(false);
//     const [dayRecords, setDayRecords] = useState([]);
//     const [error, setError] = useState(null);

//     // Formulario de adición
//     const [newRecord, setNewRecord] = useState(initialNewRecordState(date));

//     // Edición
//     const [editingId, setEditingId] = useState(null);
//     const [editForm, setEditForm] = useState(null);

//     const recordsCollectionRef = collection(db, "produccion_diaria");


//     // --- LÓGICA DE RECARGA (Usando useCallback para estabilidad) ---
//     const reloadData = useCallback(async () => {
//         setError(null);
//         if (!userId || !date) return; // Asegura que las dependencias estén presentes

//         try {
//             // Se puede ordenar por createdAt para tener un orden consistente en la lista.
//             const q = query(
//                 recordsCollectionRef,
//                 where("date", "==", date),
//                 where("userId", "==", userId),
//                 orderBy("createdAt", "asc")
//             );
//             const querySnapshot = await getDocs(q);

//             const data = querySnapshot.docs.map(doc => ({
//                 ...doc.data(),
//                 id: doc.id,
//                 // Asegura que M2 es un número para cálculos/visualización
//                 M2: parseFloat(doc.data().M2 || 0)
//             }));

//             setDayRecords(data);

//         } catch (err) {
//             console.error("Error al recargar datos:", err);
//             // Si hay un error, dejamos el estado sin tocar o mostramos un error en la UI
//             setError("Error al cargar los registros del día.");
//         }
//     }, [userId, date, recordsCollectionRef]); // Dependencias limpias


//     // --- EFECTO CLAVE PARA CARGA INICIAL (LEER) ---
//     useEffect(() => {
//         // 1. Inicializa el formulario al cambiar de fecha
//         setNewRecord(initialNewRecordState(date));

//         const loadInitialData = async () => {
//             setIsLoading(true);
//             try {
//                 // Ejecuta la lógica de carga
//                 await reloadData();
//             } catch (err) {
//                 // El error ya se maneja en reloadData, pero es buena práctica catchall
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadInitialData();
//         // Dependencias: reloadData se resuelve con userId y date, es estable.
//     }, [reloadData, date]); 


//     // --- FUNCIÓN DE CÁLCULO ESTABLE (Comprobada en Adición y Edición) ---
//     const calculateNFin = (nInitStr, m2Str) => {
//         // 1. Limpieza de formato
//         const N_INIT_Num = parseFloat(nInitStr.replace(/^0+/, ''));
//         const M2_Num = parseFloat(m2Str);
//         const initLength = nInitStr.length;

//         if (!isNaN(N_INIT_Num) && !isNaN(M2_Num)) {
//             // 2. Cálculo
//             let N_FIN_Num = N_INIT_Num + M2_Num;
//             N_FIN_Num = Math.round(N_FIN_Num); // Redondear a entero (por ser lectura de contador)
            
//             // 3. Formato con ceros a la izquierda (Asegura la estabilidad)
//             let N_FIN_Str = String(N_FIN_Num);
            
//             // Si la longitud es menor que la original, rellenar
//             if (initLength > 0 && N_FIN_Str.length < initLength) {
//                 N_FIN_Str = N_FIN_Str.padStart(initLength, '0');
//             }
//             return N_FIN_Str;
//         }
//         return '';
//     };

//     // --- MANEJO DEL FORMULARIO DE ADICIÓN (CREAR) ---
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // 1. Preprocesamiento: Permite comas y puntos para números
//         const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN'))
//             ? value.replace(',', '.')
//             : value;

//         // 2. Crear el nuevo estado temporal del formulario
//         let updatedRecord = {
//             ...newRecord,
//             [name]: processedValue
//         };

//         // 3. Lógica CLAVE: Cálculo automático de N.FIN
//         if (name === 'N_INIT' || name === 'M2') {
//             const nInitStr = name === 'N_INIT' ? processedValue : updatedRecord.N_INIT;
//             const m2Str = name === 'M2' ? processedValue : updatedRecord.M2;
            
//             // 4. Actualizar N_FIN con la función estable
//             updatedRecord.N_FIN = calculateNFin(nInitStr, m2Str);
//         }

//         // 5. Establecer el estado
//         setNewRecord(updatedRecord);
//     };

//     const handleAddRecord = async (e) => {
//         e.preventDefault();

//         if (!userId) {
//             toast.error("No se puede registrar. El ID de usuario no está disponible.");
//             return;
//         }

//         // Validación básica
//         if (!newRecord.INVERNADERO || !newRecord.M2 || isNaN(parseFloat(newRecord.M2)) || parseFloat(newRecord.M2) <= 0) {
//             toast.error("Por favor, rellena los campos de Invernadero y M² con valores válidos.");
//             return;
//         }

//         setIsAdding(true);
//         setError(null);

//         try {
//             const recordToSave = {
//                 ...newRecord,
//                 userId: userId,
//                 createdAt: serverTimestamp(),
//                 M2: parseFloat(newRecord.M2),
//             };

//             await addDoc(recordsCollectionRef, recordToSave);

//             toast.success("Registro de producción añadido con éxito.");

//             await reloadData(); // Recarga los datos del día
//             refetchCalendar(); // Notifica al calendario para actualizar puntos
//             setNewRecord(initialNewRecordState(date)); // Limpia el formulario

//         } catch (err) {
//             console.error("Error al añadir registro:", err);
//             setError("Error al guardar el registro en Firebase.");
//             toast.error("Error al guardar el registro en Firebase.");
//         } finally {
//             setIsAdding(false);
//         }
//     };


//     // --- MANEJO DE EDICIÓN Y ELIMINACIÓN (ACTUALIZAR y ELIMINAR) ---

//     const startEdit = (record) => {
//         setEditingId(record.id);
//         // Asegura que M2 es una cadena para el input de texto
//         setEditForm({ ...record, M2: String(record.M2) });
//         setError(null);
//     };

//     const cancelEdit = () => {
//         setEditingId(null);
//         setEditForm(null);
//     };

//     const handleEditChange = (e) => {
//         const { name, value } = e.target;

//         // 1. Preprocesamiento: Permite comas y puntos para números
//         const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN'))
//             ? value.replace(',', '.')
//             : value;

//         // 2. Crear el nuevo estado temporal del formulario de edición
//         let updatedEditForm = {
//             ...editForm,
//             [name]: processedValue
//         };

//         // 3. Lógica CLAVE: Cálculo automático de N.FIN para edición
//         if (name === 'N_INIT' || name === 'M2') {
//             const nInitStr = name === 'N_INIT' ? processedValue : updatedEditForm.N_INIT;
//             const m2Str = name === 'M2' ? processedValue : updatedEditForm.M2;

//             // 4. Actualizar N_FIN con la función estable
//             updatedEditForm.N_FIN = calculateNFin(nInitStr, m2Str);
//         }

//         // 5. Establecer el estado de edición
//         setEditForm(updatedEditForm);
//     };

//     const saveEdit = async (recordId) => {
//         if (!editForm || !userId) return;

//         try {
//             const docRef = doc(db, "produccion_diaria", recordId);
//             const dataToUpdate = {
//                 INVERNADERO: editForm.INVERNADERO,
//                 // Convierte M2 a flotante para guardarlo
//                 M2: parseFloat(editForm.M2),
//                 N_INIT: editForm.N_INIT,
//                 N_FIN: editForm.N_FIN,
//                 H_INIT: editForm.H_INIT,
//                 H_FIN: editForm.H_FIN,
//                 NOTAS: editForm.NOTAS,
//                 updatedAt: serverTimestamp(),
//             };

//             await updateDoc(docRef, dataToUpdate);

//             toast.success("Registro actualizado.");
//             cancelEdit();
//             await reloadData(); // Recarga los datos
//             refetchCalendar();

//         } catch (error) {
//             console.error("Error al actualizar registro:", error);
//             toast.error("Error al actualizar el registro.");
//         }
//     };

//     const handleDelete = async (recordId) => {
//         if (!window.confirm("¿Estás seguro de que quieres eliminar este registro? Esta acción es irreversible.")) return;

//         try {
//             const docRef = doc(db, "produccion_diaria", recordId);
//             await deleteDoc(docRef);

//             toast.success("Registro eliminado.");
//             await reloadData(); // Recarga los datos
//             refetchCalendar();

//         } catch (error) {
//             console.error("Error al eliminar registro:", error);
//             toast.error("Error al eliminar el registro.");
//         }
//     };


//     // --- RENDERIZADO CONDICIONAL ---

//     if (!userId) {
//         return (
//             <div className="p-6 my-8 rounded-lg text-center bg-red-100 border-2 border-red-500 text-red-800 shadow-lg">
//                 <p className="font-bold text-xl mb-2">⚠️ Acceso Denegado</p>
//                 <p>No hay una sesión de usuario activa o el ID de usuario no está disponible.</p>
//             </div>
//         );
//     }

//     if (isLoading) {
//         // Usando Tailwind CSS como prefieres
//         return <div className="p-6 text-center text-indigo-600">Cargando registros del día...</div>;
//     }

//     return (
//         <div className="mx-auto p-4 max-w-6xl bg-white shadow-xl rounded-xl mt-6">
//             <header className="flex justify-between items-center border-b pb-4 mb-6">
//                 <h1 className="text-3xl font-extrabold text-indigo-800">
//                     Registros del Día: <span className="text-indigo-600">{date}</span>
//                 </h1>
//                 <button
//                     onClick={() => navigate('/riego')}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150"
//                 >
//                     &larr; Volver al Calendario
//                 </button>
//             </header>

//             {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">Error: {error}</p>}


//             {/* SECCIÓN 1: FORMULARIO DE NUEVO REGISTRO (CREAR) */}
//             <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
//                 <h2 className="text-xl font-bold mb-4 text-indigo-700">Añadir Nuevo Registro</h2>
//                 <form onSubmit={handleAddRecord} className="space-y-4">

//                     {/* Fila 1: M2 e Invernadero */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="invernadero" className="block text-sm font-medium text-gray-700">Invernadero/Sección <span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 id="invernadero"
//                                 name="INVERNADERO"
//                                 value={newRecord.INVERNADERO}
//                                 onChange={handleInputChange}
//                                 placeholder="Ej: A1, F-Central"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="m2" className="block text-sm font-medium text-gray-700">Producción (M²) <span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 id="m2"
//                                 name="M2"
//                                 value={newRecord.M2}
//                                 onChange={handleInputChange}
//                                 placeholder="Ej: 150.75"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Fila 2: Tiempos (Horas y N) */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {/* H.INIT */}
//                         <div>
//                             <label htmlFor="h_init" className="block text-sm font-medium text-gray-700">H. INICIO</label>
//                             <input
//                                 type="time"
//                                 id="h_init"
//                                 name="H_INIT"
//                                 value={newRecord.H_INIT}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                         {/* H.FIN */}
//                         <div>
//                             <label htmlFor="h_fin" className="block text-sm font-medium text-gray-700">H. FIN</label>
//                             <input
//                                 type="time"
//                                 id="h_fin"
//                                 name="H_FIN"
//                                 value={newRecord.H_FIN}
//                                 onChange={handleInputChange}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                         {/* N.INIT */}
//                         <div>
//                             <label htmlFor="n_init" className="block text-sm font-medium text-gray-700">N. INICIO</label>
//                             <input
//                                 type="text"
//                                 id="n_init"
//                                 name="N_INIT"
//                                 value={newRecord.N_INIT}
//                                 onChange={handleInputChange}
//                                 placeholder="Lectura N.I."
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                         {/* N.FIN */}
//                         <div>
//                             <label htmlFor="n_fin" className="block text-sm font-medium text-gray-700">N. FIN</label>
//                             <input
//                                 type="text"
//                                 id="n_fin"
//                                 name="N_FIN"
//                                 value={newRecord.N_FIN}
//                                 onChange={handleInputChange}
//                                 placeholder="Lectura N.F."
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Fila 3: Notas y Botón */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                         <div className="md:col-span-3">
//                             <label htmlFor="notas" className="block text-sm font-medium text-gray-700">Notas/Reporte</label>
//                             <textarea
//                                 id="notas"
//                                 name="NOTAS"
//                                 value={newRecord.NOTAS}
//                                 onChange={handleInputChange}
//                                 rows="2"
//                                 placeholder="Detalles o comentarios relevantes del proceso..."
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                             ></textarea>
//                         </div>
//                         <button
//                             type="submit"
//                             disabled={isAdding}
//                             className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200
//                                 ${isAdding ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
//                             }
//                         >
//                             {isAdding ? 'Guardando...' : '💾 Registrar Producción'}
//                         </button>
//                     </div>
//                 </form>
//             </div>


//             {/* SECCIÓN 2: LISTA DE REGISTROS EXISTENTES (LEER, ACTUALIZAR, ELIMINAR) */}
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Registros Existentes ({dayRecords.length})</h2>

//             {dayRecords.length > 0 ? (
//                 <ul className="space-y-6">
//                     {dayRecords.map(record => (
//                         <li key={record.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
//                             {editingId === record.id ? (

//                                 // --- MODO EDICIÓN ---
//                                 <form onSubmit={(e) => { e.preventDefault(); saveEdit(record.id); }} className="space-y-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
//                                     <h3 className="text-xl font-bold text-yellow-800 border-b pb-2 mb-3">Editando Registro: {record.INVERNADERO}</h3>

//                                     {/* GRUPO 1: INVERNADERO y M2 */}
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">Invernadero</label>
//                                             <input type="text" name="INVERNADERO" value={editForm.INVERNADERO} onChange={handleEditChange} placeholder="Invernadero" required className="p-2 border rounded w-full" />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">Producción (M²)</label>
//                                             <input type="text" name="M2" value={editForm.M2} onChange={handleEditChange} placeholder="M²" required className="p-2 border rounded w-full" />
//                                         </div>
//                                     </div>

//                                     {/* GRUPO 2: H / N */}
//                                     <div className="grid grid-cols-4 gap-4">
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">H. INICIO</label>
//                                             <input type="time" name="H_INIT" value={editForm.H_INIT} onChange={handleEditChange} className="p-2 border rounded w-full" />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">H. FIN</label>
//                                             <input type="time" name="H_FIN" value={editForm.H_FIN} onChange={handleEditChange} className="p-2 border rounded w-full" />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">N. INICIO</label>
//                                             <input type="text" name="N_INIT" value={editForm.N_INIT} onChange={handleEditChange} placeholder="N. INICIO" className="p-2 border rounded w-full" />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-sm font-medium text-gray-700">N. FIN</label>
//                                             <input type="text" name="N_FIN" value={editForm.N_FIN} onChange={handleEditChange} placeholder="N. FIN" className="p-2 border rounded w-full" />
//                                         </div>
//                                     </div>

//                                     {/* NOTAS */}
//                                     <div className="space-y-1">
//                                         <label className="text-sm font-medium text-gray-700">Notas</label>
//                                         <textarea name="NOTAS" value={editForm.NOTAS} onChange={handleEditChange} placeholder="Notas" rows="2" className="w-full p-2 border rounded"></textarea>
//                                     </div>

//                                     <div className="flex space-x-2 justify-end pt-2">
//                                         <button type="button" onClick={cancelEdit} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150">Cancelar</button>
//                                         <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150">Guardar Cambios</button>
//                                     </div>
//                                 </form>

//                             ) : (

//                                 // --- MODO LECTURA ---
//                                 <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

//                                     {/* Columna 1: Producción Principal (INVERNADERO y M2) */}
//                                     <div className="md:col-span-2 flex flex-col justify-start border-r border-gray-200 md:pr-6">
//                                         <div className="flex items-center text-sm font-semibold text-indigo-600 uppercase mb-1">
//                                             <FaWarehouse className="mr-2 text-indigo-500" /> Sección de Producción
//                                         </div>
//                                         <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
//                                             {record.INVERNADERO || 'N/A'}
//                                         </h3>
//                                         <div className="flex items-center text-lg font-bold text-green-700 bg-green-50 px-3 py-1 rounded-md inline-flex mt-1 shadow-sm border border-green-100">
//                                             <FaRulerCombined className="mr-2 text-green-600" />
//                                             <span>{record.M2 ? `${(record.M2).toFixed(2)} M²` : '0.00 M²'}</span>
//                                         </div>
//                                     </div>

//                                     {/* Columna 2: Detalles de Lectura (Horas y N) */}
//                                     <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-4 pt-2 md:pt-0">

//                                         {/* Lectura HORA */}
//                                         <div className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded-lg">
//                                             <div className="flex items-center text-xs font-semibold text-blue-700 uppercase mb-1">
//                                                 <FaClock className="mr-1" /> Horas
//                                             </div>
//                                             <span className="text-lg font-semibold text-gray-800 block">
//                                                 {record.H_INIT || 'N/A'}
//                                                 <span className="text-gray-500 font-normal text-sm mx-1">a</span>
//                                                 {record.H_FIN || 'N/A'}
//                                             </span>
//                                         </div>

//                                         {/* Lectura N (Números) */}
//                                         <div className="border-l-4 border-purple-500 pl-3 bg-purple-50 p-2 rounded-lg">
//                                             <div className="flex items-center text-xs font-semibold text-purple-700 uppercase mb-1">
//                                                 <FaSortNumericUpAlt className="mr-1" /> Contador N.
//                                             </div>
//                                             <span className="text-lg font-semibold text-gray-800 block">
//                                                 {record.N_INIT || 'N/A'}
//                                                 <span className="text-gray-500 font-normal text-sm mx-1">a</span>
//                                                 <strong className="text-purple-700">{record.N_FIN || 'N/A'}</strong>
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Columna 3: Acciones */}
//                                     <div className="md:col-span-1 flex flex-col space-y-2 md:justify-end md:items-end md:self-stretch pt-2 md:pt-0">
//                                         <button
//                                             onClick={() => startEdit(record)}
//                                             className="w-full md:w-auto px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md transition duration-150 flex items-center justify-center"
//                                         >
//                                             <FaEdit className="mr-2" /> Editar
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(record.id)}
//                                             className="w-full md:w-auto px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-md transition duration-150 flex items-center justify-center"
//                                         >
//                                             <FaTrashAlt className="mr-2" /> Eliminar
//                                         </button>
//                                     </div>

//                                     {/* FILA COMPLETA 4: NOTAS (MÁS INDEPENDIENTE) */}
//                                     {record.NOTAS && (
//                                         <div className="col-span-full mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
//                                             <p className="text-sm font-bold text-gray-700 mb-1 flex items-center">
//                                                 📢 Reporte / Notas Adicionales
//                                             </p>
//                                             <p className="text-base text-gray-800 italic border-l-4 border-gray-400 pl-3">
//                                                 {record.NOTAS}
//                                             </p>
//                                         </div>
//                                     )}

//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-gray-600 italic text-lg">✨ Sin registros. ¡Añade el primero!</p>
//                 </div>
//             )}


//         </div>
//     );
// }

// export default DayDetails;