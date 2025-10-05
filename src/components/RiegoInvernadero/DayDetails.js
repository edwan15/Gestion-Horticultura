// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../firebaseConfig";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// // Importar la función toast
// import { toast } from "react-toastify";

// const initialFormState = {
//   id: null,
//   INVERNADERO: "",
//   N_INIT: "",
//   N_FIN: "",
//   M2: "",
//   H_INIT: "",
//   H_FIN: "",
//   NOTAS: "",
// };

// const DayDetails = ({ refetchCalendar }) => {
//   const { date } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState(initialFormState);
//   const [isEditing, setIsEditing] = useState(false);
//   const [records, setRecords] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const recordsCollectionRef = collection(db, "produccion_diaria");

//   const getRecordsByDate = async () => {
//     setIsLoading(true);
//     try {
//       const q = query(recordsCollectionRef, where("date", "==", date));
//       const querySnapshot = await getDocs(q);

//       const fetchedRecords = querySnapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//         M2: parseFloat(doc.data().M2),
//       }));

//       setRecords(fetchedRecords);
//     } catch (error) {
//       console.error("Error al cargar los registros:", error);
//       // Mostrar toast de error al cargar
//       toast.error("Error al cargar los datos. Inténtalo de nuevo.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getRecordsByDate();
//   }, [date]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     const key = id.replace("-", "_").toUpperCase();
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     if (
//       !form.INVERNADERO ||
//       !form.N_INIT ||
//       !form.N_FIN ||
//       !form.M2 ||
//       !form.H_INIT ||
//       !form.H_FIN
//     ) {
//       // Mostrar toast de advertencia en lugar de alert
//       toast.warn(
//         'Por favor, complete el campo "Invernadero" y los 5 campos principales.'
//       );
//       return;
//     }

//     const dataToSave = {
//       date: date,
//       INVERNADERO: form.INVERNADERO,
//       N_INIT: form.N_INIT,
//       N_FIN: form.N_FIN,
//       M2: parseFloat(form.M2),
//       H_INIT: form.H_INIT,
//       H_FIN: form.H_FIN,
//       NOTAS: form.NOTAS,
//       timestamp: new Date(),
//     };

//     try {
//       if (isEditing) {
//         // LÓGICA DE ACTUALIZACIÓN
//         const recordDoc = doc(db, "produccion_diaria", form.id);
//         await updateDoc(recordDoc, dataToSave);
//         // TOAST DE ÉXITO para ACTUALIZAR
//         toast.success(`Registro de ${form.INVERNADERO} actualizado!`);
//       } else {
//         // LÓGICA DE CREACIÓN
//         await addDoc(recordsCollectionRef, dataToSave);
//         // TOAST DE ÉXITO para CREAR
//         toast.success(`¡Nuevo registro guardado para ${form.INVERNADERO}!`);
//       }

//       refetchCalendar();
//       getRecordsByDate();
//       setForm(initialFormState);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error al guardar/actualizar el documento:", error);
//       // TOAST DE ERROR al guardar
//       toast.error("Hubo un error al guardar los datos en Firebase.");
//     }
//   };

//   const handleEdit = (record) => {
//     setForm(record);
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     toast.info("Cargado en el formulario para editar.");
//   };

//   const handleDelete = async () => {
//     if (!form.id) return;

//     // Utilizamos un confirm nativo para la confirmación crítica,
//     // pero mostramos el toast de éxito o error.
//     if (
//       window.confirm(
//         `¿Estás seguro de que quieres eliminar el registro de ${form.INVERNADERO}?`
//       )
//     ) {
//       try {
//         const recordDoc = doc(db, "produccion_diaria", form.id);
//         await deleteDoc(recordDoc);

//         // TOAST DE ÉXITO para ELIMINAR
//         toast.success(
//           `Registro de ${form.INVERNADERO} eliminado correctamente.`
//         );

//         refetchCalendar();
//         getRecordsByDate();
//         setForm(initialFormState);
//         setIsEditing(false);
//       } catch (error) {
//         console.error("Error al eliminar el documento:", error);
//         // TOAST DE ERROR al eliminar
//         toast.error("Hubo un error al eliminar los datos.");
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     setForm(initialFormState);
//     setIsEditing(false);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Clases de Tailwind (sin cambios)
//   const commonButtonClasses =
//     "px-4 py-2 font-semibold rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50";
//   const commonInputClasses =
//     "mt-1 block w-full border border-gray-300 rounded-lg shadow-inner p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150";

//   return (
//     // ... (el resto del JSX del DayDetails.js permanece igual) ...
//     <div className="container mx-auto p-4 max-w-5xl bg-gray-50 min-h-screen">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
//         <button
//           className={`${commonButtonClasses} bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300 mb-4 sm:mb-0`}
//           onClick={() => navigate("/riego")}
//         >
//           ← Volver al Calendario
//         </button>
//         <h1
//           id="date-title"
//           className="text-3xl font-extrabold text-gray-800 text-center sm:text-right"
//         >
//           Detalle para: <span className="text-indigo-600">{date}</span>
//         </h1>
//       </header>

//       {/* SECCIÓN 1: FORMULARIO CRUD */}
//       <section className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl mb-10 border border-indigo-100">
//         <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">
//           {isEditing
//             ? "📝 Editar Registro Existente"
//             : "➕ Crear Nuevo Registro"}
//         </h2>
//         <form onSubmit={handleSave}>
//           {/* CAMPO ADICIONAL: INVERNADERO */}
//           <div className="input-group mb-6">
//             <label
//               htmlFor="invernadero"
//               className="block text-lg font-bold text-gray-800 mb-2"
//             >
//               Nombre/Número del Invernadero 🌿
//             </label>
//             <input
//               type="text"
//               id="invernadero"
//               value={form.INVERNADERO}
//               onChange={handleChange}
//               required
//               placeholder="Ej: Invernadero 3B"
//               className={`${commonInputClasses} text-xl font-semibold border-indigo-400 focus:ring-indigo-600`}
//             />
//           </div>

//           <div className="border-t border-gray-200 pt-6 mb-6">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">
//               Métricas de Producción:
//             </h3>
//           </div>

//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//             {/* N.INIT, N.FIN, M2, H.INIT, H.FIN */}
//             {[
//               ["N.INIT", "number"],
//               ["N.FIN", "number"],
//               ["M2", "number"],
//               ["H.INIT", "time"],
//               ["H.FIN", "time"],
//             ].map(([label, type]) => {
//               const id = label.toLowerCase().replace(".", "-");
//               const key = label.replace(".", "_").toUpperCase();
//               return (
//                 <div key={id} className="input-group">
//                   <label
//                     htmlFor={id}
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     {label}:
//                   </label>
//                   <input
//                     type={type}
//                     id={id}
//                     value={form[key]}
//                     onChange={handleChange}
//                     required
//                     className={commonInputClasses}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Textarea para Notas Adicionales */}
//           <div className="input-group mt-6 col-span-full">
//             <label
//               htmlFor="notas"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Notas y Novedades:
//             </label>
//             <textarea
//               id="notas"
//               rows="4"
//               value={form.NOTAS}
//               onChange={handleChange}
//               className={`${commonInputClasses} resize-y`}
//             ></textarea>
//           </div>

//           {/* Botones de Acción */}
//           <div className="action-buttons flex flex-wrap gap-3 mt-8 pt-4 border-t border-gray-100">
//             <button
//               type="submit"
//               className={`${commonButtonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-300`}
//             >
//               💾 {isEditing ? "Actualizar" : "Guardar"}
//             </button>
//             <button
//               type="button"
//               className={`${commonButtonClasses} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300`}
//               onClick={handleCreateNew}
//             >
//               ➕ Crear Nuevo
//             </button>
//             {isEditing && (
//               <button
//                 type="button"
//                 className={`${commonButtonClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-300`}
//                 onClick={handleDelete}
//               >
//                 🗑️ Eliminar
//               </button>
//             )}
//           </div>
//         </form>
//       </section>

//       {/* SECCIÓN 2: VISUALIZACIÓN DE MÉTRICAS */}
//       <section className="metrics-view mt-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           Métricas Registradas ({records.length})
//         </h2>
//         {isLoading ? (
//           <div className="text-center p-6 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
//             <p className="text-indigo-600 font-semibold">
//               Cargando datos de Firebase... 🌐
//             </p>
//           </div>
//         ) : records.length === 0 ? (
//           <div className="text-center p-6 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
//             <p className="text-gray-500 italic">
//               No hay registros para este día. ¡Usa el formulario de arriba para
//               agregar uno!
//             </p>
//           </div>
//         ) : (
//           <div id="records-list" className="flex flex-col gap-5">
//             {records.map((record) => (
//               <div
//                 key={record.id}
//                 className="record-card bg-white p-4 sm:p-6 border-l-8 border-indigo-500 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.01]"
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//                   <div className="card-header font-extrabold text-xl text-indigo-700 mb-2 sm:mb-0">
//                     <span className="text-green-500">
//                       [{record.INVERNADERO}]
//                     </span>{" "}
//                     Lotes: {record.N_INIT} - {record.N_FIN}
//                   </div>
//                   <p className="text-2xl font-black text-green-600">
//                     {record.M2.toFixed(2)} M²
//                   </p>
//                 </div>

//                 <p className="text-gray-600 text-sm mt-1 border-t pt-2">
//                   <span className="font-semibold">Horario:</span>{" "}
//                   {record.H_INIT} a {record.H_FIN}
//                 </p>

//                 {record.NOTAS && (
//                   <p className="text-gray-500 text-xs mt-3 italic p-3 bg-gray-100 rounded-lg border border-gray-200">
//                     <span className="font-bold text-gray-700">Notas:</span> *
//                     {record.NOTAS.substring(0, 100)}
//                     {record.NOTAS.length > 100 ? "..." : ""}*
//                   </p>
//                 )}

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     className="text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md"
//                     onClick={() => handleEdit(record)}
//                   >
//                     ✏️ Editar Registro
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DayDetails;






// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../firebaseConfig";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { toast } from "react-toastify";
// // 🔑 Importaciones de Redux para obtener el estado de autenticación
// import { useSelector } from "react-redux";
// // Importamos el ID y también el estado de login
// import { 
//     selectUserId, 
//     selectIsLoggedIn 
// } from "../../features/auth/authSlice/authSlice"; 


// const initialFormState = {
//   id: null,
//   INVERNADERO: "",
//   N_INIT: "",
//   N_FIN: "",
//   M2: "",
//   H_INIT: "",
//   H_FIN: "",
//   NOTAS: "",
// };

// const DayDetails = ({ refetchCalendar }) => {
//   const { date } = useParams();
//   const navigate = useNavigate();
  
//   // 🔑 PASO 1: Obtener ambos estados de Redux
//   const currentUserId = useSelector(selectUserId); 
//   const isLoggedIn = useSelector(selectIsLoggedIn); // Estado booleano de la sesión

//   const [form, setForm] = useState(initialFormState);
//   const [isEditing, setIsEditing] = useState(false);
//   const [records, setRecords] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const recordsCollectionRef = collection(db, "produccion_diaria");
  
//   // Condición de seguridad para deshabilitar la interfaz si no hay sesión
//   const isFormDisabled = !isLoggedIn || currentUserId === null;

//   const getRecordsByDate = async () => {
//     // Si el ID del usuario es null o no está logueado, detenemos la operación
//     if (!currentUserId || !isLoggedIn) {
//         setRecords([]);
//         setIsLoading(false);
//         return; 
//     }
    
//     setIsLoading(true);
//     try {
//       // 🔑 Consulta filtrada por fecha Y por el ID del usuario actual
//       const q = query(
//         recordsCollectionRef, 
//         where("date", "==", date),
//         where("userId", "==", currentUserId) 
//       ); 

//       const querySnapshot = await getDocs(q);

//       const fetchedRecords = querySnapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//         M2: parseFloat(doc.data().M2),
//       }));

//       setRecords(fetchedRecords);
//     } catch (error) {
//       console.error("Error al cargar los registros:", error);
//       toast.error("Error al cargar los datos. Inténtalo de nuevo.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Solo cargamos los datos si Redux confirma el ID y el login
//     if (currentUserId && isLoggedIn) {
//       getRecordsByDate();
//     }
//     // Si isLoggedIn cambia a false, resetea para reflejar la desconexión
//     if (!isLoggedIn) {
//         setRecords([]);
//         setIsLoading(false);
//     }
//   }, [date, currentUserId, isLoggedIn]); // Dependencia CLAVE: isLoggedIn

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     const key = id.replace("-", "_").toUpperCase();
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     // Verificación de autenticación crucial
//     if (!currentUserId || !isLoggedIn) {
//         toast.error("Error de autenticación: No hay una sesión de usuario activa.");
//         return;
//     }
    
//     if (
//       !form.INVERNADERO ||
//       !form.N_INIT ||
//       !form.N_FIN ||
//       !form.M2 ||
//       !form.H_INIT ||
//       !form.H_FIN
//     ) {
//       toast.warn(
//         'Por favor, complete el campo "Invernadero" y los 5 campos principales.'
//       );
//       return;
//     }

//     const dataToSave = {
//       date: date,
//       INVERNADERO: form.INVERNADERO,
//       N_INIT: form.N_INIT,
//       N_FIN: form.N_FIN,
//       M2: parseFloat(form.M2),
//       H_INIT: form.H_INIT,
//       H_FIN: form.H_FIN,
//       NOTAS: form.NOTAS,
//       timestamp: new Date(),
//       // 🔑 Etiquetar el registro con el ID del usuario
//       userId: currentUserId, 
//     };

//     try {
//       if (isEditing) {
//         const recordDoc = doc(db, "produccion_diaria", form.id);
//         await updateDoc(recordDoc, dataToSave);
//         toast.success(`Registro de ${form.INVERNADERO} actualizado!`);
//       } else {
//         await addDoc(recordsCollectionRef, dataToSave);
//         toast.success(`¡Nuevo registro guardado para ${form.INVERNADERO}!`);
//       }

//       refetchCalendar();
//       getRecordsByDate();
//       setForm(initialFormState);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error al guardar/actualizar el documento:", error);
//       toast.error("Hubo un error al guardar los datos en Firebase.");
//     }
//   };

//   const handleEdit = (record) => {
//     if (isFormDisabled) {
//         toast.warn("Inicia sesión para editar.");
//         return;
//     }
//     setForm(record);
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     toast.info("Cargado en el formulario para editar.");
//   };

//   const handleDelete = async () => {
//     if (!form.id) return;
    
//     if (
//       window.confirm(
//         `¿Estás seguro de que quieres eliminar el registro de ${form.INVERNADERO}?`
//       )
//     ) {
//       try {
//         const recordDoc = doc(db, "produccion_diaria", form.id);
//         await deleteDoc(recordDoc);

//         toast.success(
//           `Registro de ${form.INVERNADERO} eliminado correctamente.`
//         );

//         refetchCalendar();
//         getRecordsByDate();
//         setForm(initialFormState);
//         setIsEditing(false);
//       } catch (error) {
//         console.error("Error al eliminar el documento:", error);
//         toast.error("Hubo un error al eliminar los datos.");
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     setForm(initialFormState);
//     setIsEditing(false);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Clases de Tailwind (sin cambios)
//   const commonButtonClasses =
//     "px-4 py-2 font-semibold rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50";
//   const commonInputClasses =
//     "mt-1 block w-full border border-gray-300 rounded-lg shadow-inner p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150";

//   return (
//     <div className="container mx-auto p-4 max-w-5xl bg-gray-50 min-h-screen">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
//         <button
//           className={`${commonButtonClasses} bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300 mb-4 sm:mb-0`}
//           onClick={() => navigate("/riego")}
//         >
//           ← Volver al Calendario
//         </button>
//         <h1
//           id="date-title"
//           className="text-3xl font-extrabold text-gray-800 text-center sm:text-right"
//         >
//           Detalle para: <span className="text-indigo-600">{date}</span>
//         </h1>
//       </header>

//       {/* SECCIÓN 1: FORMULARIO CRUD */}
//       <section className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl mb-10 border border-indigo-100">
//         <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">
//           {isEditing
//             ? "📝 Editar Registro Existente"
//             : "➕ Crear Nuevo Registro"}
//         </h2>
        
//         {/* Mensaje de advertencia si no está logueado */}
//         {isFormDisabled && (
//              <div className="text-center p-4 bg-red-100 text-red-700 font-bold mb-4 rounded-lg border border-red-300">
//                 ⚠️ Carga bloqueada: No hay una sesión de usuario activa en Redux. Por favor, inicia sesión.
//              </div>
//         )}

//         {/* Usamos una clase para hacer el formulario visualmente 'disabled' */}
//         <form onSubmit={handleSave} className={isFormDisabled ? 'opacity-50 pointer-events-none' : ''}>
          
//           {/* CAMPO ADICIONAL: INVERNADERO */}
//           <div className="input-group mb-6">
//             <label
//               htmlFor="invernadero"
//               className="block text-lg font-bold text-gray-800 mb-2"
//             >
//               Nombre/Número del Invernadero 🌿
//             </label>
//             <input
//               type="text"
//               id="invernadero"
//               value={form.INVERNADERO}
//               onChange={handleChange}
//               required
//               disabled={isFormDisabled} // <-- CLAVE: Deshabilita el input
//               placeholder="Ej: Invernadero 3B"
//               className={`${commonInputClasses} text-xl font-semibold border-indigo-400 focus:ring-indigo-600`}
//             />
//           </div>

//           <div className="border-t border-gray-200 pt-6 mb-6">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">
//               Métricas de Producción:
//             </h3>
//           </div>

//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//             {[
//               ["N.INIT", "number"],
//               ["N.FIN", "number"],
//               ["M2", "number"],
//               ["H.INIT", "time"],
//               ["H.FIN", "time"],
//             ].map(([label, type]) => {
//               const id = label.toLowerCase().replace(".", "-");
//               const key = label.replace(".", "_").toUpperCase();
//               return (
//                 <div key={id} className="input-group">
//                   <label
//                     htmlFor={id}
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     {label}:
//                   </label>
//                   <input
//                     type={type}
//                     id={id}
//                     value={form[key]}
//                     onChange={handleChange}
//                     required
//                     disabled={isFormDisabled} // <-- CLAVE: Deshabilita el input
//                     className={commonInputClasses}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Textarea para Notas Adicionales */}
//           <div className="input-group mt-6 col-span-full">
//             <label
//               htmlFor="notas"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Notas y Novedades:
//             </label>
//             <textarea
//               id="notas"
//               rows="4"
//               value={form.NOTAS}
//               onChange={handleChange}
//               disabled={isFormDisabled} // <-- CLAVE: Deshabilita el input
//               className={`${commonInputClasses} resize-y`}
//             ></textarea>
//           </div>

//           {/* Botones de Acción */}
//           <div className="action-buttons flex flex-wrap gap-3 mt-8 pt-4 border-t border-gray-100">
//             <button
//               type="submit"
//               disabled={isFormDisabled} // <-- CLAVE: Deshabilita el botón
//               className={`${commonButtonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-300`}
//             >
//               💾 {isEditing ? "Actualizar" : "Guardar"}
//             </button>
//             <button
//               type="button"
//               disabled={isFormDisabled} // <-- CLAVE: Deshabilita el botón
//               className={`${commonButtonClasses} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300`}
//               onClick={handleCreateNew}
//             >
//               ➕ Crear Nuevo
//             </button>
//             {isEditing && (
//               <button
//                 type="button"
//                 disabled={isFormDisabled} // <-- CLAVE: Deshabilita el botón
//                 className={`${commonButtonClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-300`}
//                 onClick={handleDelete}
//               >
//                 🗑️ Eliminar
//               </button>
//             )}
//           </div>
//         </form>
//       </section>

//       {/* SECCIÓN 2: VISUALIZACIÓN DE MÉTRICAS */}
//       <section className="metrics-view mt-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           Métricas Registradas ({records.length})
//         </h2>
//         {isLoading ? (
//           <div className="text-center p-6 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
//             <p className="text-indigo-600 font-semibold">
//               Cargando datos de Firebase... 🌐
//             </p>
//           </div>
//         ) : records.length === 0 ? (
//           <div className="text-center p-6 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
//             <p className="text-gray-500 italic">
//               No hay registros para este día. ¡Usa el formulario de arriba para
//               agregar uno!
//             </p>
//           </div>
//         ) : (
//           <div id="records-list" className="flex flex-col gap-5">
//             {records.map((record) => (
//               <div
//                 key={record.id}
//                 className="record-card bg-white p-4 sm:p-6 border-l-8 border-indigo-500 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.01]"
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//                   <div className="card-header font-extrabold text-xl text-indigo-700 mb-2 sm:mb-0">
//                     <span className="text-green-500">
//                       [{record.INVERNADERO}]
//                     </span>{" "}
//                     Lotes: {record.N_INIT} - {record.N_FIN}
//                   </div>
//                   <p className="text-2xl font-black text-green-600">
//                     {record.M2.toFixed(2)} M²
//                   </p>
//                 </div>

//                 <p className="text-gray-600 text-sm mt-1 border-t pt-2">
//                   <span className="font-semibold">Horario:</span>{" "}
//                   {record.H_INIT} a {record.H_FIN}
//                 </p>

//                 {record.NOTAS && (
//                   <p className="text-gray-500 text-xs mt-3 italic p-3 bg-gray-100 rounded-lg border border-gray-200">
//                     <span className="font-bold text-gray-700">Notas:</span> *
//                     {record.NOTAS.substring(0, 100)}
//                     {record.NOTAS.length > 100 ? "..." : ""}*
//                   </p>
//                 )}

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     className="text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md"
//                     onClick={() => handleEdit(record)}
//                     disabled={isFormDisabled} // <-- CLAVE: Deshabilita el botón
//                   >
//                     ✏️ Editar Registro
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DayDetails;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectUserId } from '../../features/auth/authSlice/authSlice'; 
// import { toast } from 'react-toastify'; 

// // Importa aquí tus funciones de Firebase (asegúrate de que las rutas son correctas)
// import { db } from '../../firebaseConfig'; 
// import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; 

// function DayDetails({ refetchCalendar }) {
//     const { date } = useParams(); // La fecha (ej: 2025-10-04)
//     const navigate = useNavigate();
    
//     // OBTENER EL ID DE USUARIO USANDO EL SELECTOR
//     const userId = useSelector(selectUserId); 
    
//     const [isLoading, setIsLoading] = useState(true);
//     const [isAdding, setIsAdding] = useState(false);
//     const [dayRecords, setDayRecords] = useState([]);
//     const [newRecord, setNewRecord] = useState({
//         INVERNADERO: '',
//         M2: '',
//         date: date,
//     });
//     const [error, setError] = useState(null); 
    
//     // --- FUNCIÓN PARA CARGAR LOS DATOS FILTRADOS DEL DÍA ---
//     const loadDayData = async (uid) => {
//         setIsLoading(true);
//         setError(null);
        
//         if (!uid) {
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const recordsCollection = collection(db, "produccion_diaria");
//             // 🔑 FILTRO POR USUARIO Y FECHA
//             const q = query(recordsCollection, 
//                 where("date", "==", date),
//                 where("userId", "==", uid) 
//             );
//             const querySnapshot = await getDocs(q);
            
//             const data = querySnapshot.docs.map(doc => ({ 
//                 ...doc.data(), 
//                 id: doc.id,
//                 M2: parseFloat(doc.data().M2 || 0) // Asegura que M2 es un número
//             }));
            
//             setDayRecords(data);
            
//         } catch (err) {
//             console.error("Error al cargar datos del día:", err);
//             setError("Hubo un error al cargar los datos. Revisa la consola para más detalles.");
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     // --- EFECTO CLAVE QUE ESPERA POR EL ID Y CARGA LOS DATOS ---
//     useEffect(() => {
//         if (userId) {
//             loadDayData(userId);
//         } else {
//             // Esto solo ocurre si la Auth ha fallado o el usuario no está logueado
//             setIsLoading(false);
//         }
        
//         // Inicializar el formulario con la fecha correcta
//         setNewRecord(prev => ({ ...prev, date: date }));
        
//     }, [userId, date]); 

//     // --- MANEJO DEL FORMULARIO ---
    
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewRecord(prev => ({
//             ...prev,
//             [name]: name === 'M2' ? value.replace(',', '.') : value.toUpperCase()
//         }));
//     };
    
//     const handleAddRecord = async (e) => {
//         e.preventDefault();
        
//         if (!userId) {
//             toast.error("No se puede registrar. El ID de usuario no está disponible.");
//             return;
//         }
        
//         if (!newRecord.INVERNADERO || !newRecord.M2 || isNaN(parseFloat(newRecord.M2)) || parseFloat(newRecord.M2) <= 0) {
//             toast.error("Por favor, rellena todos los campos con valores válidos.");
//             return;
//         }

//         setIsAdding(true);

//         try {
//             const recordToSave = {
//                 ...newRecord,
//                 // 🔑 CLAVE: Añadir el ID de usuario de MongoDB
//                 userId: userId, 
//                 // Añadir un timestamp para el orden de creación
//                 createdAt: serverTimestamp(),
//                 // Asegurar que M2 es numérico al guardar
//                 M2: parseFloat(newRecord.M2), 
//             };
            
//             const recordsCollection = collection(db, "produccion_diaria");
//             await addDoc(recordsCollection, recordToSave);
            
//             toast.success("Registro de producción añadido con éxito.");
            
//             // 1. Refrescar la vista actual
//             await loadDayData(userId);
//             // 2. Notificar al Calendar para que se actualice (resalta el día)
//             refetchCalendar(); 
            
//             // Limpiar el formulario, manteniendo la fecha y el invernadero por defecto
//             setNewRecord(prev => ({
//                 INVERNADERO: prev.INVERNADERO,
//                 M2: '',
//                 date: date,
//             }));
            
//         } catch (err) {
//             console.error("Error al añadir registro:", err);
//             toast.error("Error al guardar el registro en Firebase.");
//         } finally {
//             setIsAdding(false);
//         }
//     };

//     // --- RENDERIZADO CONDICIONAL ---

//     if (!userId) {
//         return (
//             <div className="p-6 my-8 rounded-lg text-center bg-red-100 border-2 border-red-500 text-red-800 shadow-lg">
//                 <p className="font-bold text-xl mb-2">⚠️ Acceso Denegado</p>
//                 <p>No hay una sesión de usuario activa. Por favor, inicia sesión para ver y gestionar los datos.</p>
//             </div>
//         );
//     }
    
//     if (isLoading) {
//         return <div className="p-6 text-center text-indigo-600">Cargando registros del día...</div>;
//     }

//     return (
//         <div className="mx-auto p-4 max-w-4xl bg-white shadow-xl rounded-xl mt-6">
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
            
//             <p className="text-sm text-gray-500 mb-6 border-b pb-2">
//                 UID Activo: **{userId}**. Solo se muestran los registros asociados a este ID.
//             </p>

//             {/* SECCIÓN 1: FORMULARIO DE NUEVO REGISTRO */}
//             <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
//                 <h2 className="text-xl font-bold mb-4 text-indigo-700">Añadir Nuevo Registro</h2>
//                 <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    
//                     {/* Campo INVERNADERO */}
//                     <div>
//                         <label htmlFor="invernadero" className="block text-sm font-medium text-gray-700">Invernadero/Sección</label>
//                         <input
//                             type="text"
//                             id="invernadero"
//                             name="INVERNADERO"
//                             value={newRecord.INVERNADERO}
//                             onChange={handleInputChange}
//                             placeholder="Ej: A1, F-Central"
//                             required
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                     </div>
                    
//                     {/* Campo M2 */}
//                     <div>
//                         <label htmlFor="m2" className="block text-sm font-medium text-gray-700">Producción (M²)</label>
//                         <input
//                             type="number"
//                             step="0.01"
//                             id="m2"
//                             name="M2"
//                             value={newRecord.M2}
//                             onChange={handleInputChange}
//                             placeholder="Ej: 150.75"
//                             required
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
//                         />
//                     </div>
                    
//                     {/* Botón de Añadir */}
//                     <button
//                         type="submit"
//                         disabled={isAdding}
//                         className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200 
//                             ${isAdding ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
//                         }
//                     >
//                         {isAdding ? 'Guardando...' : '💾 Registrar Producción'}
//                     </button>
//                 </form>
//             </div>


//             {/* SECCIÓN 2: LISTA DE REGISTROS EXISTENTES */}
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Registros Existentes ({dayRecords.length})</h2>
            
//             {error && <p className="text-red-500 bg-red-50 p-3 rounded">{error}</p>}
            
//             {dayRecords.length > 0 ? (
//                 <ul className="space-y-3">
//                     {dayRecords.map(record => (
//                         <li key={record.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center transition duration-100 hover:shadow-md">
//                             <div className="flex flex-col">
//                                 <span className="text-lg font-semibold text-gray-900">
//                                     {record.M2.toFixed(2)} M²
//                                 </span>
//                                 <span className="text-sm text-indigo-600">
//                                     Invernadero: **{record.INVERNADERO}**
//                                 </span>
//                             </div>
//                             <div className="text-xs text-gray-500">
//                                 Registrado a las: {record.createdAt?.toDate ? record.createdAt.toDate().toLocaleTimeString() : 'N/A'}
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <div className="p-6 text-center bg-gray-100 rounded-lg">
//                     <p className="text-gray-600 italic">Aún no hay registros de producción para esta fecha.</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DayDetails;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice'; 
import { toast } from 'react-toastify'; 

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
    updateDoc 
} from 'firebase/firestore'; 

// Estado inicial del formulario con los nuevos campos
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


function DayDetails({ refetchCalendar }) {
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
    
    
    // --- EFECTO CLAVE PARA CARGA INICIAL (LEER) ---
    useEffect(() => {
        // 1. Inicializa el formulario al cambiar de fecha
        setNewRecord(initialNewRecordState(date)); 
        
        // Función de carga inicial
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null); 
            
            if (!userId) { 
                setIsLoading(false);
                return;
            }

            try {
                // Ejecuta la lógica de carga
                await reloadData();
                
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
    // Nota: recordsCollectionRef es constante de Firebase, no necesita estar en deps.

    
    // --- MANEJO DEL FORMULARIO DE ADICIÓN (CREAR) ---
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Permite comas y puntos para números (M2, N_INIT, N_FIN)
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN')) 
            ? value.replace(',', '.') 
            : value;
            
        setNewRecord(prev => ({
            ...prev,
            [name]: processedValue 
        }));
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
            
            await addDoc(recordsCollectionRef, recordToSave);
            
            toast.success("Registro de producción añadido con éxito.");
            
            await reloadData(); // Recarga los datos del día
            refetchCalendar(); // Notifica al calendario para actualizar puntos
            setNewRecord(initialNewRecordState(date)); // Limpia el formulario
            
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
        const processedValue = (name === 'M2' || name.includes('INIT') || name.includes('FIN')) 
            ? value.replace(',', '.') 
            : value;
            
        setEditForm(prev => ({
            ...prev,
            [name]: processedValue 
        }));
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
            refetchCalendar(); 
            
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
            refetchCalendar(); 
            
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
                            <input
                                type="text"
                                id="invernadero"
                                name="INVERNADERO"
                                value={newRecord.INVERNADERO}
                                onChange={handleInputChange}
                                placeholder="Ej: A1, F-Central"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
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
                <ul className="space-y-4">
                    {dayRecords.map(record => (
                        <li key={record.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                            {editingId === record.id ? (
                                
                                <form onSubmit={(e) => { e.preventDefault(); saveEdit(record.id); }} className="space-y-4">
                                    <h3 className="text-lg font-bold text-indigo-700 border-b pb-2 mb-2">Editando Registro</h3>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Invernadero y M2 */}
                                        <input type="text" name="INVERNADERO" value={editForm.INVERNADERO} onChange={handleEditChange} placeholder="Invernadero" required className="p-2 border rounded" />
                                        <input type="text" name="M2" value={editForm.M2} onChange={handleEditChange} placeholder="M²" required className="p-2 border rounded" />
                                        
                                        {/* Horas y N */}
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
                                
                               
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <p className="text-xl font-bold text-gray-900 mb-1">
                                            {record.M2.toFixed(2)} M² en {record.INVERNADERO}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                                            <span>⏱️ **{record.H_INIT || 'N/A'}** a **{record.H_FIN || 'N/A'}**</span>
                                            <span>🔢 N: **{record.N_INIT || 'N/A'}** a **{record.N_FIN || 'N/A'}**</span>
                                        </div>
                                        {record.NOTAS && (
                                            <p className="text-sm mt-2 p-2 bg-gray-100 rounded italic border-l-2 border-indigo-400">
                                                Notas: {record.NOTAS}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="md:col-span-1 flex space-x-2 justify-end items-center">
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
                    <p className="text-gray-600 italic">Aún no hay registros de producción para esta fecha.</p>
                </div>
            )}
        </div>
    );
}

export default DayDetails;
