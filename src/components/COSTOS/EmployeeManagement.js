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


// import React, { useState, useEffect } from 'react';
// import { 
//     collection, 
//     addDoc, 
//     query, 
//     onSnapshot, 
//     where,
//     serverTimestamp // ⬅️ IMPORTACIÓN CLAVE para la marca de tiempo
// } from 'firebase/firestore';
// import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding } from 'react-icons/fa';

// // Función auxiliar para obtener el AppId
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();

// // 💡 CORRECCIÓN CLAVE: Usamos 'workers' para que coincida con el componente de Costes (donde salía N/A)
// const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`; 

// const EmployeeManagement = ({ db, userId, setErrorMessage, availableEntities }) => {
//     const [employeeData, setEmployeeData] = useState({
//         name: '',
//         identification: '',
//         email: '',
//         ratePerHour: '15.00',
//         entityId: '',
//         // ❌ ELIMINADA inicialización local de 'createdAt'. Se usará serverTimestamp al guardar.
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

//         // 💡 CORREGIDO: Usamos la ruta unificada WORKERS_COLLECTION_PATH
//         const qEmployees = query(
//             collection(db, WORKERS_COLLECTION_PATH), 
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
//             setErrorMessage("Error al cargar la lista de empleados."); 
//             setLoadingEmployees(false);
//         });

//         // Limpiar la suscripción al desmontar
//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // --- 2. Lógica del Formulario de Registro ---
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployeeData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMessage(null); // Limpiar errores previos

//         if (!employeeData.entityId) {
//             setErrorMessage("Debe seleccionar una Entidad/Empresa para el empleado."); 
//             return;
//         }
        
//         if (!db) {
//             setErrorMessage("La base de datos no está disponible.");
//             return;
//         }

//         try {
//             // 💡 CORREGIDO: Usamos la ruta unificada WORKERS_COLLECTION_PATH
//             const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
            
//             // Usamos el estado actual del formulario y añadimos la marca de tiempo del servidor
//             await addDoc(employeesCollectionRef, { 
//                 ...employeeData, 
//                 createdAt: serverTimestamp(), // ✅ CORREGIDO: Marca de tiempo del servidor
//                 createdBy: userId 
//             });
            
//             // Limpiar formulario 
//             setEmployeeData({
//                 name: '',
//                 identification: '',
//                 email: '',
//                 ratePerHour: '15.00',
//                 entityId: '',
//                 // ELIMINADA la inicialización de createdAt aquí también
//                 createdBy: userId,
//             });

//             setErrorMessage("Trabajador registrado exitosamente."); 
            
//         } catch (error) {
//             console.error("Error al guardar el empleado:", error);
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
//                            {availableEntities.length === 0 && (
//                                 <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
//                             )}
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




// import React, { useState, useEffect } from 'react';
// import { 
//     collection, 
//     addDoc, 
//     query, 
//     onSnapshot, 
//     where,
//     serverTimestamp,
//     // 💡 IMPORTACIONES NUEVAS PARA EDITAR Y ELIMINAR
//     doc,
//     updateDoc,
//     deleteDoc
// } from 'firebase/firestore';
// import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding, FaEdit, FaTrash } from 'react-icons/fa'; // FaEdit y FaTrash para los iconos

// // (Resto de las funciones auxiliares y path de la colección sin cambios)
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`; 

// const EmployeeManagement = ({ db, userId, setErrorMessage, availableEntities }) => {
//     // Estado inicial del formulario (vacío)
//     const initialState = {
//         name: '',
//         identification: '',
//         email: '',
//         ratePerHour: '15.00',
//         entityId: '',
//         createdBy: userId,
//     };

//     const [employeeData, setEmployeeData] = useState(initialState);
//     const [employees, setEmployees] = useState([]);
//     const [loadingEmployees, setLoadingEmployees] = useState(true);
    
//     // 💡 ESTADO NUEVO: Guarda el ID del trabajador que se está editando. Si es null, estamos creando.
//     const [editingId, setEditingId] = useState(null); 
    

//     // --- 1. Lógica de Listado (Carga Inicial y Suscripción) ---
//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingEmployees(false);
//             return;
//         }

//         const qEmployees = query(
//             collection(db, WORKERS_COLLECTION_PATH), 
//             where("createdBy", "==", userId)
//         );

//         const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
//             const employeesData = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 ...doc.data() 
//             }));
//             setEmployees(employeesData);
//             setLoadingEmployees(false);
//         }, (error) => {
//             console.error("Firestore employee data error:", error);
//             setErrorMessage("Error al cargar la lista de empleados."); 
//             setLoadingEmployees(false);
//         });

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // --- 2. Lógica del Formulario de Registro/Edición ---
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployeeData(prev => ({ ...prev, [name]: value }));
//     };
    
//     // Función para manejar el inicio de la edición
//     const handleEditStart = (employee) => {
//         setEditingId(employee.id); // Establece el ID para saber que estamos editando
//         // Llena el formulario con los datos del empleado
//         setEmployeeData({
//             name: employee.name,
//             identification: employee.identification,
//             email: employee.email,
//             // Asegúrate de que el ratePerHour sea una cadena para el input
//             ratePerHour: String(employee.ratePerHour || '0.00'), 
//             entityId: employee.entityId,
//             createdBy: userId,
//         });
//     };
    
//     // Función para cancelar la edición
//     const handleCancelEdit = () => {
//         setEditingId(null);
//         setEmployeeData(initialState); // Resetea el formulario al estado inicial
//         setErrorMessage(null);
//     };

//     // Función principal para manejar el envío (Creación o Edición)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMessage(null);

//         if (!employeeData.entityId) {
//             setErrorMessage("Debe seleccionar una Entidad/Empresa para el empleado."); 
//             return;
//         }
        
//         if (!db) {
//             setErrorMessage("La base de datos no está disponible.");
//             return;
//         }

//         try {
//             const dataToSave = { ...employeeData, createdBy: userId };
//             const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
            
//             if (editingId) {
//                 // Modo Edición
//                 const docRef = doc(db, WORKERS_COLLECTION_PATH, editingId);
//                 // No actualizamos 'createdAt' ni 'createdBy' para mantener el registro original
//                 delete dataToSave.createdBy; 
                
//                 await updateDoc(docRef, dataToSave);
//                 setErrorMessage("Trabajador actualizado exitosamente."); 
//                 setEditingId(null); // Sale del modo edición
//             } else {
//                 // Modo Creación
//                 await addDoc(employeesCollectionRef, { 
//                     ...dataToSave, 
//                     createdAt: serverTimestamp(),
//                 });
//                 setErrorMessage("Trabajador registrado exitosamente."); 
//             }
            
//             // Limpiar formulario y salir del modo edición/creación
//             setEmployeeData(initialState);
            
//         } catch (error) {
//             console.error("Error al guardar/actualizar el empleado:", error);
//             setErrorMessage(`Error al guardar: ${error.message}`);
//         }
//     };
    
//     // Función para manejar la Eliminación
//     const handleDelete = async (employeeId, employeeName) => {
//         if (!db) {
//             setErrorMessage("La base de datos no está disponible.");
//             return;
//         }
        
//         // Confirmación para evitar eliminaciones accidentales
//         if (!window.confirm(`¿Está seguro de que desea eliminar al trabajador: ${employeeName}? \nEsta acción no se puede deshacer.`)) {
//             return;
//         }
        
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION_PATH, employeeId);
//             await deleteDoc(docRef);
//             setErrorMessage(`Trabajador "${employeeName}" eliminado exitosamente.`);
//         } catch (error) {
//             console.error("Error al eliminar el empleado:", error);
//             setErrorMessage(`Error al eliminar: ${error.message}`);
//         }
//     };


//     // --- 3. Renderizado del Componente ---
//     const getEntityName = (entityId) => {
//         const entity = availableEntities.find(ent => ent.id === entityId);
//         return entity ? entity.name : 'N/A';
//     };

//     return (
//         <div className="p-4 bg-white rounded-xl shadow-lg">
            
//             <div className="space-y-8 border-b pb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
//                     <FaUserPlus className="text-red-600"/>
//                     <span>{editingId ? 'Editando Trabajador' : 'Registro de Nuevo Trabajador'}</span>
//                 </h2>

//                 {/* Formulario de Creación/Edición */}
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* ... (Campos del formulario: Nombre, Identificación, Email, Tarifa, Entidad) ... */}
                    
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
//                             // 💡 Clave: Deshabilitar la edición de la identificación
//                             disabled={!!editingId} 
//                         />
//                          {editingId && (
//                             <p className="text-xs text-gray-500 mt-1">
//                                 No se recomienda cambiar la identificación. Si es un error grave, elimine y registre de nuevo.
//                             </p>
//                         )}
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
//                             {availableEntities.length === 0 && (
//                                 <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
//                             )}
//                     </div>

//                     {/* Botones de envío / cancelación */}
//                     <div className="col-span-full flex space-x-4">
//                         <button
//                             type="submit"
//                             className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
//                                 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
//                         >
//                             {editingId ? (
//                                 <>
//                                     <FaEdit className="mr-2 h-5 w-5"/>
//                                     Guardar Cambios
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaUserPlus className="mr-2 h-5 w-5"/>
//                                     Registrar Trabajador
//                                 </>
//                             )}
//                         </button>
                        
//                         {editingId && (
//                             <button
//                                 type="button"
//                                 onClick={handleCancelEdit}
//                                 className="w-32 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                                 Cancelar
//                             </button>
//                         )}
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
//                                 {/* 💡 COLUMNA DE ACCIONES */}
//                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {employees.map((emp) => (
//                                 // 💡 Resalta la fila que se está editando
//                                 <tr key={emp.id} className={editingId === emp.id ? 'bg-yellow-50/50' : ''}> 
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
//                                     {/* 💡 CELDAS DE ACCIONES */}
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center space-x-3">
//                                         <button 
//                                             onClick={() => handleEditStart(emp)}
//                                             className="text-indigo-600 hover:text-indigo-900 flex items-center disabled:opacity-50"
//                                             disabled={!!editingId && editingId !== emp.id} // Deshabilita si se está editando otra fila
//                                             title="Editar Trabajador"
//                                         >
//                                             <FaEdit className="mr-1"/> Editar
//                                         </button>
//                                         <button 
//                                             onClick={() => handleDelete(emp.id, emp.name)}
//                                             className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
//                                             disabled={!!editingId} // Deshabilita la eliminación mientras se edita
//                                             title="Eliminar Trabajador"
//                                         >
//                                             <FaTrash className="mr-1"/> Eliminar
//                                         </button>
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





// import React, { useState, useEffect } from 'react';
// import { 
//     collection, 
//     addDoc, 
//     query, 
//     onSnapshot, 
//     where,
//     serverTimestamp,
//     doc,
//     updateDoc,
//     deleteDoc
// } from 'firebase/firestore';
// import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
// // 💡 IMPORTACIONES NECESARIAS para el estilo avanzado
// import { motion, AnimatePresence } from 'framer-motion';

// // Función auxiliar para obtener el AppId
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`; 

// const EmployeeManagement = ({ db, userId, availableEntities }) => {
    
//     // 💡 CAMBIO: Usaremos 'notification' en lugar de 'errorMessage' (que ya no se necesita como prop)
//     const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

//     // Función auxiliar para mostrar la notificación
//     const showNotification = (message, type = 'success') => {
//         setNotification({ message, type });
//         // Opcional: Ocultar automáticamente después de 4 segundos
//         setTimeout(() => setNotification(null), 4000); 
//     };

//     const initialState = {
//         name: '',
//         identification: '',
//         email: '',
//         ratePerHour: '15.00',
//         entityId: '',
//         createdBy: userId,
//     };

//     const [employeeData, setEmployeeData] = useState(initialState);
//     const [employees, setEmployees] = useState([]);
//     const [loadingEmployees, setLoadingEmployees] = useState(true);
//     const [editingId, setEditingId] = useState(null); 
    

//     // --- 1. Lógica de Listado (Carga Inicial y Suscripción) ---
//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingEmployees(false);
//             return;
//         }

//         const qEmployees = query(
//             collection(db, WORKERS_COLLECTION_PATH), 
//             where("createdBy", "==", userId)
//         );

//         const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
//             const employeesData = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 ...doc.data() 
//             }));
//             setEmployees(employeesData);
//             setLoadingEmployees(false);
//         }, (error) => {
//             console.error("Firestore employee data error:", error);
//             showNotification("Error al cargar la lista de empleados.", 'error'); 
//             setLoadingEmployees(false);
//         });

//         return () => unsubscribe();
//     }, [db, userId]); // Eliminamos setErrorMessage del dependency array ya que ya no se usa

//     // --- 2. Lógica del Formulario de Registro/Edición ---
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployeeData(prev => ({ ...prev, [name]: value }));
//     };
    
//     const handleEditStart = (employee) => {
//         setEditingId(employee.id); 
//         setEmployeeData({
//             name: employee.name,
//             identification: employee.identification,
//             email: employee.email || '', // Asegura un valor por defecto
//             ratePerHour: String(employee.ratePerHour || '0.00'), 
//             entityId: employee.entityId,
//             createdBy: userId,
//         });
//         setNotification(null); // Limpia cualquier notificación previa
//     };
    
//     const handleCancelEdit = () => {
//         setEditingId(null);
//         setEmployeeData(initialState); 
//         setNotification(null); // Limpia la notificación
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setNotification(null);

//         if (!employeeData.entityId) {
//             showNotification("Debe seleccionar una Entidad/Empresa para el empleado.", 'error'); 
//             return;
//         }
        
//         if (!db) {
//             showNotification("La base de datos no está disponible.", 'error');
//             return;
//         }

//         try {
//             const dataToSave = { ...employeeData, createdBy: userId };
            
//             if (editingId) {
//                 // Modo Edición
//                 const docRef = doc(db, WORKERS_COLLECTION_PATH, editingId);
//                 delete dataToSave.createdBy; 
                
//                 await updateDoc(docRef, dataToSave);
//                 showNotification(`Trabajador "${employeeData.name}" actualizado exitosamente.`); 
//                 setEditingId(null); 
//             } else {
//                 // Modo Creación
//                 const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
//                 await addDoc(employeesCollectionRef, { 
//                     ...dataToSave, 
//                     createdAt: serverTimestamp(),
//                 });
//                 showNotification(`Trabajador "${employeeData.name}" registrado exitosamente.`); 
//             }
            
//             // Limpiar formulario SOLO después de una acción exitosa
//             setEmployeeData(initialState);
            
//         } catch (error) {
//             console.error("Error al guardar/actualizar el empleado:", error);
//             showNotification(`Error al guardar: ${error.message}`, 'error');
//         }
//     };
    
//     const handleDelete = async (employeeId, employeeName) => {
//         if (!db) {
//             showNotification("La base de datos no está disponible.", 'error');
//             return;
//         }
        
//         if (!window.confirm(`¿Está seguro de que desea eliminar al trabajador: ${employeeName}? \nEsta acción no se puede deshacer.`)) {
//             return;
//         }
        
//         try {
//             const docRef = doc(db, WORKERS_COLLECTION_PATH, employeeId);
//             await deleteDoc(docRef);
//             showNotification(`Trabajador "${employeeName}" eliminado exitosamente.`);
//         } catch (error) {
//             console.error("Error al eliminar el empleado:", error);
//             showNotification(`Error al eliminar: ${error.message}`, 'error');
//         }
//     };


//     // --- 3. Renderizado del Componente ---
//     const getEntityName = (entityId) => {
//         const entity = availableEntities.find(ent => ent.id === entityId);
//         return entity ? entity.name : 'N/A';
//     };

//     return (
//         <div className="relative p-4 bg-white rounded-xl shadow-lg">
            
//             {/* 💡 Nuevo componente de Notificación (estilo avanzado) */}
//             <AnimatePresence>
//                 {notification && (
//                     <motion.div 
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
//                         transition={{ duration: 0.3 }}
//                         className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-xl min-w-[300px] flex items-center space-x-3 
//                             ${notification.type === 'success' 
//                                 ? 'bg-green-500 text-white' 
//                                 : 'bg-red-500 text-white'}`
//                         }
//                     >
//                         {notification.type === 'success' ? <FaCheckCircle className="h-5 w-5"/> : <FaExclamationTriangle className="h-5 w-5"/>}
//                         <div className='flex-grow'>
//                             <strong className="font-bold text-sm uppercase">{notification.type === 'success' ? 'Éxito' : 'Error'}</strong>
//                             <p className="block text-sm">{notification.message}</p>
//                         </div>
//                         <span 
//                             className="text-white opacity-70 hover:opacity-100 cursor-pointer p-1 -m-1" 
//                             onClick={() => setNotification(null)}
//                         >
//                             <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                         </span>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
            
//             {/* Contenido principal... */}
//             <div className="space-y-8 border-b pb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
//                     <FaUserPlus className="text-red-600"/>
//                     <span>{editingId ? 'Editando Trabajador' : 'Registro de Nuevo Trabajador'}</span>
//                 </h2>

//                 {/* Formulario de Creación/Edición (sin cambios en la estructura interna de los campos) */}
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
//                             disabled={!!editingId} 
//                         />
//                          {editingId && (
//                             <p className="text-xs text-gray-500 mt-1">
//                                 No se puede cambiar la identificación durante la edición.
//                             </p>
//                         )}
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
//                             {availableEntities.length === 0 && (
//                                 <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
//                             )}
//                     </div>

//                     {/* Botones de envío / cancelación */}
//                     <div className="col-span-full flex space-x-4">
//                         <button
//                             type="submit"
//                             className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
//                                 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
//                         >
//                             {editingId ? (
//                                 <>
//                                     <FaEdit className="mr-2 h-5 w-5"/>
//                                     Guardar Cambios
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaUserPlus className="mr-2 h-5 w-5"/>
//                                     Registrar Trabajador
//                                 </>
//                             )}
//                         </button>
                        
//                         {editingId && (
//                             <button
//                                 type="button"
//                                 onClick={handleCancelEdit}
//                                 className="w-32 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                                 Cancelar
//                             </button>
//                         )}
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
//                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {employees.map((emp) => (
//                                 <tr key={emp.id} className={editingId === emp.id ? 'bg-yellow-50/50' : ''}> 
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center space-x-3">
//                                         <button 
//                                             onClick={() => handleEditStart(emp)}
//                                             className="text-indigo-600 hover:text-indigo-900 flex items-center disabled:opacity-50"
//                                             disabled={!!editingId && editingId !== emp.id}
//                                             title="Editar Trabajador"
//                                         >
//                                             <FaEdit className="mr-1"/>
//                                         </button>
//                                         <button 
//                                             onClick={() => handleDelete(emp.id, emp.name)}
//                                             className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
//                                             disabled={!!editingId}
//                                             title="Eliminar Trabajador"
//                                         >
//                                             <FaTrash className="mr-1"/>
//                                         </button>
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
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
// Importaciones necesarias para el estilo avanzado
import { motion, AnimatePresence } from 'framer-motion';

// Función auxiliar para obtener el AppId
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`;

const EmployeeManagement = ({ db, userId, availableEntities }) => {

    // CAMBIO: Usaremos 'notification' en lugar de 'errorMessage' (que ya no se necesita como prop)
    const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

    // Función auxiliar para mostrar la notificación
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        // Opcional: Ocultar automáticamente después de 4 segundos
        setTimeout(() => setNotification(null), 4000);
    };

    const initialState = {
        name: '',
        identification: '',
        email: '',
        ratePerHour: '15.00',
        entityId: '',
        createdBy: userId,
    };

    const [employeeData, setEmployeeData] = useState(initialState);
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [editingId, setEditingId] = useState(null);


    // --- 1. Lógica de Listado (Carga Inicial y Suscripción) ---
    useEffect(() => {
        if (!db || !userId) {
            setLoadingEmployees(false);
            return;
        }

        const qEmployees = query(
            collection(db, WORKERS_COLLECTION_PATH),
            where("createdBy", "==", userId)
        );

        const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
            const employeesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEmployees(employeesData);
            setLoadingEmployees(false);
        }, (error) => {
            console.error("Firestore employee data error:", error);
            showNotification("Error al cargar la lista de empleados.", 'error');
            setLoadingEmployees(false);
        });

        return () => unsubscribe();
    }, [db, userId]); // Eliminamos setErrorMessage del dependency array ya que ya no se usa

    // --- 2. Lógica del Formulario de Registro/Edición ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditStart = (employee) => {
        setEditingId(employee.id);
        setEmployeeData({
            name: employee.name,
            identification: employee.identification,
            email: employee.email || '', // Asegura un valor por defecto
            ratePerHour: String(employee.ratePerHour || '0.00'),
            entityId: employee.entityId,
            createdBy: userId,
        });
        setNotification(null); // Limpia cualquier notificación previa
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEmployeeData(initialState);
        setNotification(null); // Limpia la notificación
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);

        if (!employeeData.entityId) {
            showNotification("Debe seleccionar una Entidad/Empresa para el empleado.", 'error');
            return;
        }

        if (!db) {
            showNotification("La base de datos no está disponible.", 'error');
            return;
        }

        try {
            const dataToSave = { ...employeeData, createdBy: userId };

            if (editingId) {
                // Modo Edición
                const docRef = doc(db, WORKERS_COLLECTION_PATH, editingId);
                delete dataToSave.createdBy;

                await updateDoc(docRef, dataToSave);
                showNotification(`Trabajador "${employeeData.name}" actualizado exitosamente.`);
                setEditingId(null);
            } else {
                // Modo Creación
                const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
                await addDoc(employeesCollectionRef, {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                });
                showNotification(`Trabajador "${employeeData.name}" registrado exitosamente.`);
            }

            // Limpiar formulario SOLO después de una acción exitosa
            setEmployeeData(initialState);

        } catch (error) {
            console.error("Error al guardar/actualizar el empleado:", error);
            showNotification(`Error al guardar: ${error.message}`, 'error');
        }
    };

    const handleDelete = async (employeeId, employeeName) => {
        if (!db) {
            showNotification("La base de datos no está disponible.", 'error');
            return;
        }

        if (!window.confirm(`¿Está seguro de que desea eliminar al trabajador: ${employeeName}? \nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const docRef = doc(db, WORKERS_COLLECTION_PATH, employeeId);
            await deleteDoc(docRef);
            showNotification(`Trabajador "${employeeName}" eliminado exitosamente.`);
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
            showNotification(`Error al eliminar: ${error.message}`, 'error');
        }
    };


    // --- 3. Renderizado del Componente ---
    const getEntityName = (entityId) => {
        // Corrección de seguridad: Verifica que availableEntities sea un array antes de usar find
        if (!Array.isArray(availableEntities)) return 'Cargando...';
        const entity = availableEntities.find(ent => ent.id === entityId);
        return entity ? entity.name : 'Entidad Eliminada';
    };

    return (
        <div className="relative p-4 bg-white rounded-xl shadow-lg">

            {/* Nuevo componente de Notificación (estilo avanzado) */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-xl min-w-[300px] flex items-center space-x-3
                            ${notification.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'}`
                        }
                    >
                        {notification.type === 'success' ? <FaCheckCircle className="h-5 w-5"/> : <FaExclamationTriangle className="h-5 w-5"/>}
                        <div className='flex-grow'>
                            <strong className="font-bold text-sm uppercase">{notification.type === 'success' ? 'Éxito' : 'Error'}</strong>
                            <p className="block text-sm">{notification.message}</p>
                        </div>
                        <span
                            className="text-white opacity-70 hover:opacity-100 cursor-pointer p-1 -m-1"
                            onClick={() => setNotification(null)}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contenido principal... */}
            <div className="space-y-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <FaUserPlus className="text-red-600"/>
                    <span>{editingId ? 'Editando Trabajador' : 'Registro de Nuevo Trabajador'}</span>
                </h2>

                {/* Formulario de Creación/Edición (sin cambios en la estructura interna de los campos) */}
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
                            disabled={!!editingId}
                        />
                        {editingId && (
                            <p className="text-xs text-gray-500 mt-1">
                                No se puede cambiar la identificación durante la edición.
                            </p>
                        )}
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

                    {/* 5. Entidad/Empresa (PUNTO CORREGIDO) */}
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
                            {/* CORRECCIÓN: Se agrega la verificación availableEntities && */}
                            {availableEntities && availableEntities.map(entity => (
                                <option key={entity.id} value={entity.id}>{entity.name}</option>
                            ))}
                        </select>
                        {availableEntities && availableEntities.length === 0 && (
                            <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
                        )}
                    </div>

                    {/* Botones de envío / cancelación */}
                    <div className="col-span-full flex space-x-4">
                        <button
                            type="submit"
                            className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                                ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
                        >
                            {editingId ? (
                                <>
                                    <FaEdit className="mr-2 h-5 w-5"/>
                                    Guardar Cambios
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="mr-2 h-5 w-5"/>
                                    Registrar Trabajador
                                </>
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="w-32 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                        )}
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
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map((emp) => (
                                <tr key={emp.id} className={editingId === emp.id ? 'bg-yellow-50/50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center space-x-3">
                                        <button
                                            onClick={() => handleEditStart(emp)}
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center disabled:opacity-50"
                                            disabled={!!editingId && editingId !== emp.id}
                                            title="Editar Trabajador"
                                        >
                                            <FaEdit className="mr-1"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp.id, emp.name)}
                                            className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
                                            disabled={!!editingId}
                                            title="Eliminar Trabajador"
                                        >
                                            <FaTrash className="mr-1"/>
                                        </button>
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