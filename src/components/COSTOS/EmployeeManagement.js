// import React, { useState } from 'react';
// import { collection, addDoc } from 'firebase/firestore';
// import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding } from 'react-icons/fa';

// // 🚨 La prop availableEntities ahora se usa en lugar de mockEntities
// const EmployeeManagement = ({ db, userId, setErrorMessage, availableEntities }) => {
//     const [employeeData, setEmployeeData] = useState({
//         name: '',
//         identification: '', // NIF, NIE, DNI, etc.
//         email: '',
//         ratePerHour: '15.00', // Tarifa por hora por defecto
//         entityId: '', // La empresa a la que pertenece
//         createdAt: new Date(),
//         createdBy: userId,
//     });
    
//     // Nuevo estado para la lista de empleados (para mostrar una tabla más adelante)
//     // Por ahora, solo usamos el estado para el formulario
//     // const [employees, setEmployees] = useState([]); 


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployeeData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMessage(null); // Limpiar errores previos

//         if (!employeeData.entityId) {
//             setErrorMessage({ message: "Debe seleccionar una Entidad/Empresa para el empleado.", type: "error" });
//             return;
//         }

//         try {
//             // Utilizamos el path genérico de artifacts que ya usas en HomeContent
//             const employeesPath = `artifacts/${window.__app_id || "default-calendar-app-id"}/public/data/employees`;
//             const employeesCollectionRef = collection(db, employeesPath);
            
//             // Añadir el documento a Firestore
//             await addDoc(employeesCollectionRef, employeeData);
            
//             // Limpiar formulario
//             setEmployeeData({
//                 name: '',
//                 identification: '',
//                 email: '',
//                 ratePerHour: '15.00',
//                 entityId: '',
//                 createdAt: new Date(),
//                 createdBy: userId,
//             });

//             setErrorMessage({ message: "Trabajador registrado exitosamente.", type: "success" }); 
            
//         } catch (error) {
//             console.error("Error al guardar el empleado:", error);
//             setErrorMessage({ message: `Error al guardar: ${error.message}`, type: "error" });
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
//             <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
//                 <FaUserPlus className="text-red-600"/>
//                 <span>Registro de Nuevo Trabajador</span>
//             </h2>

//             {/* Formulario de Creación */}
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                
//                 {/* 1. Nombre Completo */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={employeeData.name}
//                         onChange={handleChange}
//                         placeholder="Ej: David García"
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                     />
//                 </div>

//                 {/* 2. Identificación (DNI/NIF) */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                         <FaIdCard className="text-sm"/> <span>DNI/NIF/NIE</span>
//                     </label>
//                     <input
//                         type="text"
//                         name="identification"
//                         value={employeeData.identification}
//                         onChange={handleChange}
//                         placeholder="Ej: 12345678A"
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                     />
//                 </div>

//                 {/* 3. Correo Electrónico */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                         <FaEnvelope className="text-sm"/> <span>Email</span>
//                     </label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={employeeData.email}
//                         onChange={handleChange}
//                         placeholder="Ej: david@empresa.com"
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                     />
//                 </div>

//                 {/* 4. Tarifa por Hora */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                         <FaMoneyBillWave className="text-sm"/> <span>Tarifa por Hora (€)</span>
//                     </label>
//                     <input
//                         type="number"
//                         name="ratePerHour"
//                         value={employeeData.ratePerHour}
//                         onChange={handleChange}
//                         step="0.01"
//                         min="0"
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                     />
//                 </div>
                
//                 {/* 5. Entidad/Empresa (AHORA USA availableEntities REALES) */}
//                 <div className="col-span-full">
//                     <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1"><FaBuilding/> Entidad/Empresa a la que pertenece</label>
//                     <select
//                         name="entityId"
//                         value={employeeData.entityId}
//                         onChange={handleChange}
//                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                     >
//                         <option value="">-- Seleccione una Entidad --</option>
//                         {/* 🟢 Mapeo de Entidades REALES */}
//                         {availableEntities.map(entity => (
//                             <option key={entity.id} value={entity.id}>{entity.name}</option>
//                         ))}
//                     </select>
//                      {availableEntities.length === 0 && (
//                         <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
//                     )}
//                 </div>

//                 {/* Botón de envío */}
//                 <div className="col-span-full">
//                     <button
//                         type="submit"
//                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                         <FaUserPlus className="mr-2 h-5 w-5"/>
//                         Registrar Trabajador
//                     </button>
//                 </div>
//             </form>
            
//             {/* Sección de Lista de Empleados (Placeholder) */}
//             <div className="pt-4">
//                 <h3 className="text-xl font-semibold text-gray-700">Lista de Trabajadores Registrados</h3>
//                 <p className="text-gray-500 italic mt-2">La lista completa de trabajadores aparecerá aquí, obtenida de Firestore.</p>
//             </div>
//         </div>
//     );
// };

// export default EmployeeManagement;



// import React, { useState, useEffect } from 'react';
// import { collection, addDoc, query, onSnapshot, where } from 'firebase/firestore';
// import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding } from 'react-icons/fa';

// // Función auxiliar para obtener el AppId
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();

// const EmployeeManagement = ({ db, userId, setErrorMessage, availableEntities }) => {
//     const [employeeData, setEmployeeData] = useState({
//         name: '',
//         identification: '',
//         email: '',
//         ratePerHour: '15.00',
//         entityId: '',
//         createdAt: new Date(),
//         createdBy: userId,
//     });
    
//     const [employees, setEmployees] = useState([]);
//     const [loadingEmployees, setLoadingEmployees] = useState(true);

//     // --- 1. Lógica de Listado (Carga Inicial y Suscripción) ---
//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingEmployees(false);
//             return;
//         }

//         const employeesPath = `artifacts/${appId}/public/data/employees`;
        
//         // La consulta solo trae los empleados asociados al userId actual
//         const qEmployees = query(
//             collection(db, employeesPath), 
//             where("createdBy", "==", userId)
//         );

//         // Suscripción en tiempo real
//         const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
//             const employeesData = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 ...doc.data() 
//             }));
//             setEmployees(employeesData);
//             setLoadingEmployees(false);
//         }, (error) => {
//             console.error("Firestore employee data error:", error);
//             // CORREGIDO: Pasar solo string
//             setErrorMessage("Error al cargar la lista de empleados."); 
//             setLoadingEmployees(false);
//         });

//         // Limpiar la suscripción al desmontar
//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]); // Dependencias del hook


//     // --- 2. Lógica del Formulario de Registro ---
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployeeData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMessage(null); // Limpiar errores previos

//         if (!employeeData.entityId) {
//             // CORREGIDO: Antes pasaba un objeto, ahora es string
//             setErrorMessage("Debe seleccionar una Entidad/Empresa para el empleado."); 
//             return;
//         }

//         try {
//             const employeesPath = `artifacts/${appId}/public/data/employees`;
//             const employeesCollectionRef = collection(db, employeesPath);
            
//             // Usamos el estado actual del formulario, incluyendo la hora de creación y el ID de usuario
//             await addDoc(employeesCollectionRef, { ...employeeData, createdAt: new Date(), createdBy: userId });
            
//             // Limpiar formulario (manteniendo los defaults para next round)
//             setEmployeeData({
//                 name: '',
//                 identification: '',
//                 email: '',
//                 ratePerHour: '15.00',
//                 entityId: '',
//                 createdAt: new Date(),
//                 createdBy: userId,
//             });

//             // CORREGIDO: Antes pasaba un objeto, ahora es string
//             setErrorMessage("Trabajador registrado exitosamente."); 
            
//         } catch (error) {
//             console.error("Error al guardar el empleado:", error);
//             // CORREGIDO: Antes pasaba un objeto, ahora es string
//             setErrorMessage(`Error al guardar: ${error.message}`);
//         }
//     };


//     // --- 3. Renderizado del Componente ---
//     // Buscar la entidad/empresa para mostrar el nombre en la tabla
//     const getEntityName = (entityId) => {
//         const entity = availableEntities.find(ent => ent.id === entityId);
//         return entity ? entity.name : 'N/A';
//     };

//     return (
//         <div className="p-4 bg-white rounded-xl shadow-lg">
            
//             <div className="space-y-8 border-b pb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
//                     <FaUserPlus className="text-red-600"/>
//                     <span>Registro de Nuevo Trabajador</span>
//                 </h2>

//                 {/* Formulario de Creación */}
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* 1. Nombre Completo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={employeeData.name}
//                             onChange={handleChange}
//                             placeholder="Ej: David García"
//                             className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                             required
//                         />
//                     </div>

//                     {/* 2. Identificación (DNI/NIF) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                             <FaIdCard className="text-sm"/> <span>DNI/NIF/NIE</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="identification"
//                             value={employeeData.identification}
//                             onChange={handleChange}
//                             placeholder="Ej: 12345678A"
//                             className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                             required
//                         />
//                     </div>

//                     {/* 3. Correo Electrónico */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                             <FaEnvelope className="text-sm"/> <span>Email</span>
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={employeeData.email}
//                             onChange={handleChange}
//                             placeholder="Ej: david@empresa.com"
//                             className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         />
//                     </div>

//                     {/* 4. Tarifa por Hora */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
//                             <FaMoneyBillWave className="text-sm"/> <span>Tarifa por Hora (€)</span>
//                         </label>
//                         <input
//                             type="number"
//                             name="ratePerHour"
//                             value={employeeData.ratePerHour}
//                             onChange={handleChange}
//                             step="0.01"
//                             min="0"
//                             className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                             required
//                         />
//                     </div>
                    
//                     {/* 5. Entidad/Empresa */}
//                     <div className="col-span-full">
//                         <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1"><FaBuilding/> Entidad/Empresa a la que pertenece</label>
//                         <select
//                             name="entityId"
//                             value={employeeData.entityId}
//                             onChange={handleChange}
//                             className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                             required
//                         >
//                             <option value="">-- Seleccione una Entidad --</option>
//                             {availableEntities.map(entity => (
//                                 <option key={entity.id} value={entity.id}>{entity.name}</option>
//                             ))}
//                         </select>
//                          {availableEntities.length === 0 && (
//                             <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
//                         )}
//                     </div>

//                     {/* Botón de envío */}
//                     <div className="col-span-full">
//                         <button
//                             type="submit"
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                         >
//                             <FaUserPlus className="mr-2 h-5 w-5"/>
//                             Registrar Trabajador
//                         </button>
//                     </div>
//                 </form>
//             </div>
            
//             {/* --- LISTA DE EMPLEADOS --- */}
//             <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-t pt-4">Lista de Trabajadores Registrados</h3>
            
//             {loadingEmployees ? (
//                 <p className="text-blue-500">Cargando trabajadores...</p>
//             ) : employees.length === 0 ? (
//                 <p className="text-gray-500 italic">No hay trabajadores registrados por el usuario.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa/h</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
//                                 <th className="px-6 py-3"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {employees.map((emp) => (
//                                 <tr key={emp.id}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                         <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EmployeeManagement;


import React, { useState, useEffect } from 'react';
import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    where,
    serverTimestamp // ⬅️ IMPORTACIÓN CLAVE para la marca de tiempo
} from 'firebase/firestore';
import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding } from 'react-icons/fa';

// Función auxiliar para obtener el AppId
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();

// 💡 CORRECCIÓN CLAVE: Usamos 'workers' para que coincida con el componente de Costes (donde salía N/A)
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`; 

const EmployeeManagement = ({ db, userId, setErrorMessage, availableEntities }) => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        identification: '',
        email: '',
        ratePerHour: '15.00',
        entityId: '',
        // ❌ ELIMINADA inicialización local de 'createdAt'. Se usará serverTimestamp al guardar.
        createdBy: userId,
    });
    
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    // --- 1. Lógica de Listado (Carga Inicial y Suscripción) ---
    useEffect(() => {
        if (!db || !userId) {
            setLoadingEmployees(false);
            return;
        }

        // 💡 CORREGIDO: Usamos la ruta unificada WORKERS_COLLECTION_PATH
        const qEmployees = query(
            collection(db, WORKERS_COLLECTION_PATH), 
            where("createdBy", "==", userId)
        );

        // Suscripción en tiempo real
        const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
            const employeesData = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setEmployees(employeesData);
            setLoadingEmployees(false);
        }, (error) => {
            console.error("Firestore employee data error:", error);
            setErrorMessage("Error al cargar la lista de empleados."); 
            setLoadingEmployees(false);
        });

        // Limpiar la suscripción al desmontar
        return () => unsubscribe();
    }, [db, userId, setErrorMessage]);


    // --- 2. Lógica del Formulario de Registro ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null); // Limpiar errores previos

        if (!employeeData.entityId) {
            setErrorMessage("Debe seleccionar una Entidad/Empresa para el empleado."); 
            return;
        }
        
        if (!db) {
            setErrorMessage("La base de datos no está disponible.");
            return;
        }

        try {
            // 💡 CORREGIDO: Usamos la ruta unificada WORKERS_COLLECTION_PATH
            const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
            
            // Usamos el estado actual del formulario y añadimos la marca de tiempo del servidor
            await addDoc(employeesCollectionRef, { 
                ...employeeData, 
                createdAt: serverTimestamp(), // ✅ CORREGIDO: Marca de tiempo del servidor
                createdBy: userId 
            });
            
            // Limpiar formulario 
            setEmployeeData({
                name: '',
                identification: '',
                email: '',
                ratePerHour: '15.00',
                entityId: '',
                // ELIMINADA la inicialización de createdAt aquí también
                createdBy: userId,
            });

            setErrorMessage("Trabajador registrado exitosamente."); 
            
        } catch (error) {
            console.error("Error al guardar el empleado:", error);
            setErrorMessage(`Error al guardar: ${error.message}`);
        }
    };


    // --- 3. Renderizado del Componente ---
    // Buscar la entidad/empresa para mostrar el nombre en la tabla
    const getEntityName = (entityId) => {
        const entity = availableEntities.find(ent => ent.id === entityId);
        return entity ? entity.name : 'N/A';
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg">
            
            <div className="space-y-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <FaUserPlus className="text-red-600"/>
                    <span>Registro de Nuevo Trabajador</span>
                </h2>

                {/* Formulario de Creación */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* 1. Nombre Completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={employeeData.name}
                            onChange={handleChange}
                            placeholder="Ej: David García"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>

                    {/* 2. Identificación (DNI/NIF) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
                            <FaIdCard className="text-sm"/> <span>DNI/NIF/NIE</span>
                        </label>
                        <input
                            type="text"
                            name="identification"
                            value={employeeData.identification}
                            onChange={handleChange}
                            placeholder="Ej: 12345678A"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>

                    {/* 3. Correo Electrónico */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
                            <FaEnvelope className="text-sm"/> <span>Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={employeeData.email}
                            onChange={handleChange}
                            placeholder="Ej: david@empresa.com"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* 4. Tarifa por Hora */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1">
                            <FaMoneyBillWave className="text-sm"/> <span>Tarifa por Hora (€)</span>
                        </label>
                        <input
                            type="number"
                            name="ratePerHour"
                            value={employeeData.ratePerHour}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    
                    {/* 5. Entidad/Empresa */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 flex items-center space-x-1"><FaBuilding/> Entidad/Empresa a la que pertenece</label>
                        <select
                            name="entityId"
                            value={employeeData.entityId}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            required
                        >
                            <option value="">-- Seleccione una Entidad --</option>
                            {availableEntities.map(entity => (
                                <option key={entity.id} value={entity.id}>{entity.name}</option>
                            ))}
                        </select>
                           {availableEntities.length === 0 && (
                                <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
                            )}
                    </div>

                    {/* Botón de envío */}
                    <div className="col-span-full">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <FaUserPlus className="mr-2 h-5 w-5"/>
                            Registrar Trabajador
                        </button>
                    </div>
                </form>
            </div>
            
            {/* --- LISTA DE EMPLEADOS --- */}
            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-t pt-4">Lista de Trabajadores Registrados</h3>
            
            {loadingEmployees ? (
                <p className="text-blue-500">Cargando trabajadores...</p>
            ) : employees.length === 0 ? (
                <p className="text-gray-500 italic">No hay trabajadores registrados por el usuario.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa/h</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;