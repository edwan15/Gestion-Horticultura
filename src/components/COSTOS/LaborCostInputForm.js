// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
// import { FaClock, FaSeedling, FaEuroSign, FaUser, FaTools } from 'react-icons/fa';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;

// // --- Componente principal de visualización ---
// const LaborCostDashboard = ({ db, userId, setErrorMessage }) => {
//     const [timesheets, setTimesheets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // --- Carga de datos en tiempo real de Firestore ---
//     useEffect(() => {
//         if (!db || !userId) {
//             setLoading(false);
//             return;
//         }

//         setError(null);
//         setLoading(true);

//         try {
//             // 1. Crear consulta: Filtrar por usuario y ordenar por fecha
//             const timesheetQuery = query(
//                 collection(db, TIMESHEET_COLLECTION_PATH),
//                 where("createdBy", "==", userId),
//                 orderBy("createdAt", "desc") // Mostrar los más recientes primero
//             );

//             // 2. Suscribirse a los cambios en tiempo real
//             const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
//                 setTimesheets(data);
//                 setLoading(false);
//             }, (err) => {
//                 console.error("Error al cargar timesheets:", err);
//                 setError("Error al cargar los registros de tiempo. Revise la consola.");
//                 setErrorMessage({ message: "Error de conexión: No se pudieron cargar los registros de trabajo.", type: 'error' });
//                 setLoading(false);
//             });

//             return () => unsubscribe(); // Limpiar la suscripción al desmontar
//         } catch (e) {
//             console.error("Error setting up timesheet listener:", e);
//             setError("Error interno al configurar la escucha de datos.");
//             setLoading(false);
//         }
//     }, [db, userId, setErrorMessage]);

//     if (loading) {
//         return <p className="text-center text-xl p-8 text-indigo-600">Cargando registros de trabajo...</p>;
//     }

//     if (error) {
//         return <p className="text-center text-xl p-8 text-red-600">{error}</p>;
//     }

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

//             {timesheets.length === 0 ? (
//                 <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
//                     <p className="text-lg text-yellow-800">No se encontraron registros de tiempo. ¡Use el formulario de la parte superior para añadir uno!</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {timesheets.map((record) => {
//                         // Calcular el costo (redundante, pero útil si no se guardó bien)
//                         const cost = (record.totalHours * (record.ratePerHour || 0)).toFixed(2);
                        
//                         return (
//                             <div key={record.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500">
//                                 <p className="text-sm text-gray-500 mb-2">{record.date} (Registro ID: {record.id.substring(0, 4)}...)</p>
                                
//                                 <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
//                                     <FaUser className="mr-2"/> {record.workerName}
//                                 </h3>

//                                 <ul className="space-y-1 text-sm text-gray-700">
//                                     <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
//                                     <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
//                                     <li className="flex items-center"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{record.totalHours.toFixed(2)} h</span></li>
//                                     <li className="flex items-center font-bold text-lg text-red-600 border-t mt-2 pt-2"><FaEuroSign className="mr-2"/> Coste: {cost} €</li>
//                                 </ul>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LaborCostDashboard;


import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy, getFirestore } from 'firebase/firestore';
import { FaClock, FaSeedling, FaEuroSign, FaUser, FaTools, FaCalendarDay, FaTruck } from 'react-icons/fa';

// --- CONFIGURACIÓN DE FIREBASE/APP ID ---
const getAppId = () => {
    // Busca el ID de la aplicación en el entorno global si está disponible
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    // Retorna un ID predeterminado si no se encuentra
    return "default-calendar-app-id";
};
const appId = getAppId();

// La ruta de la colección DEBE coincidir exactamente con la usada en TimeSheetWizard.js
const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;

// --- Componente principal de visualización ---
const LaborCostDashboard = ({ db, userId, setErrorMessage }) => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Carga de datos en tiempo real de Firestore ---
    useEffect(() => {
        // 1. Verificación de dependencias y estado
        if (!db || !userId) {
            setLoading(false);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Utilizamos la instancia de Firestore si es necesario, aunque 'db' ya debería serlo.
            // Si 'db' es la instancia correcta, 'getFirestore()' es opcional aquí.
            const firestore = db || getFirestore(); 
            
            // 2. Crear consulta: Filtrar por usuario y ordenar por fecha de creación (los más recientes primero)
            const timesheetQuery = query(
                collection(firestore, TIMESHEET_COLLECTION_PATH),
                where("createdBy", "==", userId),
                orderBy("createdAt", "desc") 
            );

            // 3. Suscribirse a los cambios en tiempo real
            const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setTimesheets(data);
                setLoading(false);
                
                // Limpiar errores si la carga fue exitosa
                if (error) setError(null); 
            }, (err) => {
                // 🚨 Este es el callback de error que captura el fallo de conexión/permisos
                console.error("Error al cargar timesheets:", err);
                const userMessage = "Error al cargar los registros de trabajo. Confirme las Reglas de Seguridad de Firestore.";
                setError(userMessage);
                setErrorMessage({ message: userMessage, type: 'error' });
                setLoading(false);
            });

            return () => unsubscribe(); // Limpiar la suscripción al desmontar
        } catch (e) {
            console.error("Error setting up timesheet listener (Try/Catch):", e);
            const userMessage = "Error interno al configurar la escucha de datos. Verifique la constante 'db'.";
            setError(userMessage);
            setErrorMessage({ message: userMessage, type: 'error' });
            setLoading(false);
        }
    }, [db, userId, setErrorMessage, error]);

    if (loading) {
        return <p className="text-center text-xl p-8 text-indigo-600">Cargando registros de trabajo...</p>;
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-lg font-semibold text-red-800">{error}</p>
                <p className="text-sm text-red-600 mt-2">Asegúrese de que su usuario (`{userId}`) tiene permisos de lectura (`allow list`) en la colección Firestore: **`{TIMESHEET_COLLECTION_PATH}`**.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

            {timesheets.length === 0 ? (
                <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <p className="text-lg text-yellow-800">No se encontraron registros de tiempo. ¡Use el formulario de la parte superior para añadir uno!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timesheets.map((record) => {
                        const cost = (record.totalHours * (record.ratePerHour || 0)).toFixed(2);
                        const machineryInfo = record.machineryId ? `ID: ${record.machineryId}` : 'No aplica';
                        
                        return (
                            <div key={record.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500">
                                
                                <div className="text-sm text-gray-500 mb-3 flex items-center">
                                    <FaCalendarDay className="mr-2 text-red-500"/> **{record.date}** | Reg. ID: {record.id.substring(0, 4)}...
                                </div>
                                
                                <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
                                    <FaUser className="mr-2"/> {record.workerName}
                                </h3>

                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
                                    <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
                                    <li className="flex items-center"><FaTruck className="mr-2 text-orange-500"/> Maquinaria: {machineryInfo}</li>
                                    <li className="flex items-center mt-2 pt-2 border-t"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{record.totalHours.toFixed(2)} h</span></li>
                                </ul>

                                <div className="mt-3 p-2 bg-red-50 rounded-md">
                                    <p className="flex items-center font-bold text-lg text-red-700">
                                        <FaEuroSign className="mr-2"/> Coste Estimado: {cost} €
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LaborCostDashboard;