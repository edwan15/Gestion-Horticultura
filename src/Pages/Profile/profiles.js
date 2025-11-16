// import { useEffect, useState } from "react";
// import React from "react";
// import useRedirectLoggedOutUser from "../../custom/useRedirect";
// import { useDispatch } from "react-redux";
// import { getUser } from "../../services/Services";
// import { SET_NAME, SET_USER } from "../../features/auth/authSlice/authSlice";
// import Loader from "../../Util/Loader";
// import { Link } from "react-router-dom";

// const Profiles = () => {
//   useRedirectLoggedOutUser("/login");
//   const dispatch = useDispatch();

//   const [profile, setProfile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     async function getUserData() {
//       const data = await getUser();
//       console.log(data);
//       setProfile(data);
//       setIsLoading(false);
//       await dispatch(SET_USER(data));
//       await dispatch(SET_NAME(data.name));
//     }
//     getUserData();
//   }, [dispatch]);

//   return (
//     // CONTENEDOR GLOBAL: Asegura el ancho completo, padding, centrado y altura mínima.
//     <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[50vh]">
//       {isLoading && <Loader />}
      
//       {/* Contenedor Flex para Centrar Horizontal y Verticalmente */}
//       <div className="flex flex-col items-center justify-center w-full">
        
//         {!isLoading && profile === null ? (
//           <p className="text-center text-red-500 font-semibold">
//             Something went wrong, please reload the page...
//           </p>
//         ) : (
//           // CARD Y BOTÓN CONTENEDOR
//           <div className="flex flex-col items-center w-full">
            
//             {/* CARD DE PERFIL */}
//             <div 
//                 // RESPONSIVIDAD DEL CARD: w-full en móvil, max-w-lg en desktop para un tamaño óptimo.
//                 className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl my-6 bg-slate-700 text-white"
//             >
//               {/* Imagen de fondo (Cover) */}
//               <div className="h-24 sm:h-32 bg-blue-500 w-full overflow-hidden">
//                 <img 
//                     src={"https://i.imgur.com/dYcYQ7E.png"} 
//                     alt="cover" 
//                     className="w-full h-full object-cover" 
//                 />
//               </div>
              
//               {/* Foto de Perfil */}
//               <div className="flex justify-center -mt-16 mb-4">
//                 <img
//                   src={profile?.photo || "URL_DEFAULT_PROFILE_IMAGE"}
//                   alt="profile"
//                   // Tamaño responsivo y sombra para destacar
//                   className="rounded-full border-solid w-32 h-32 sm:w-40 sm:h-40 border-white border-4 object-cover shadow-xl"
//                 />
//               </div>
              
//               {/* Contenido de Texto */}
//               <div className="text-center px-4 pb-6 pt-2">
//                 <h3 className="text-2xl font-bold mb-2">
//                   {profile?.name}
//                 </h3>
//                 <p className="mt-2 font-light text-slate-300 px-4 sm:px-8">
//                   {profile?.bio || "No hay biografía disponible."}
//                 </p>
//               </div>
              
//               {/* Contacto y Detalles */}
//               <div 
//                   // FLEX WRAP: Asegura que si los datos son muy largos, se ajusten
//                   className="flex flex-wrap justify-center py-4 px-4 border-t border-slate-600 bg-slate-600/30"
//               >
                
//                 {/* Teléfono */}
//                 <div className="text-center w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-600 pb-2 sm:pb-0 pr-0 sm:pr-4 mb-2 sm:mb-0">
//                   <h2 className="text-lg font-semibold">{profile?.phone || "N/A"}</h2>
//                   <span className="text-sm text-slate-300">Teléfono</span>
//                 </div>
                
//                 {/* Email */}
//                 <div className="text-center w-full sm:w-1/2 pl-0 sm:pl-4">
//                   <h2 
//                       // Oculta el desbordamiento si el email es muy largo.
//                       className="text-sm sm:text-lg font-semibold truncate px-2" 
//                       title={profile?.email}
//                   >
//                       {profile?.email || "N/A"}
//                   </h2>
//                   <span className="text-sm text-slate-300">Email</span>
//                 </div>
//               </div>
//             </div>

//             {/* BOTÓN DE EDICIÓN */}
//             <div className="flex justify-center mt-4">
//               <Link to={"/edit-profile"}>
//                 <button 
//                     className="px-6 py-2 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition-colors"
//                 >
//                     Editar Perfil
//                 </button>
//               </Link>
//             </div>
            
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profiles;




// import React from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// // Importaciones corregidas
// import useRedirectLoggedOutUser from "../../custom/useRedirect";
// // 🛑 Eliminado: import { getUser } from "../../services/Services";
// import { 
//     selectUser, // Usaremos el selector para obtener el objeto de usuario completo
//     selectIsLoggedIn // Opcional, pero bueno para confirmar estado
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// const Profiles = () => {
//     // 1. Redirección si no está logueado
//     useRedirectLoggedOutUser("/login"); 
    
//     // 2. Obtener el perfil directamente desde Redux
//     const profile = useSelector(selectUser);
//     const isLoggedIn = useSelector(selectIsLoggedIn);
    
//     // NOTA: No necesitamos 'useState' ni 'useEffect' para cargar el perfil aquí,
//     // ya que App.jsx ya lo hace al inicio y lo guarda en Redux.
    
//     // Simulamos un estado de carga mientras Redux tiene los valores por defecto
//     const isLoading = !isLoggedIn || !profile || !profile.email; 

//     // ----------------------------------------------------
//     // 3. BLOQUEO DE CARGA
//     // ----------------------------------------------------
//     if (isLoading) {
//         return (
//             <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[50vh] flex items-center justify-center">
//                 <Loader />
//             </div>
//         );
//     }

//     // ----------------------------------------------------
//     // 4. RENDERIZADO
//     // ----------------------------------------------------
//     return (
//         // CONTENEDOR GLOBAL: Asegura el ancho completo, padding, centrado y altura mínima.
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[50vh]">
            
//             {/* Contenedor Flex para Centrar Horizontal y Verticalmente */}
//             <div className="flex flex-col items-center justify-center w-full">
                
//                 {/* Asumimos que profile no será null aquí debido al 'if (isLoading)' */}
//                 {profile && (
//                     // CARD Y BOTÓN CONTENEDOR
//                     <div className="flex flex-col items-center w-full">
                        
//                         {/* CARD DE PERFIL */}
//                         <div 
//                             // RESPONSIVIDAD DEL CARD: w-full en móvil, max-w-lg en desktop para un tamaño óptimo.
//                             className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl my-6 bg-slate-700 text-white"
//                         >
//                             {/* Imagen de fondo (Cover) */}
//                             <div className="h-24 sm:h-32 bg-blue-500 w-full overflow-hidden">
//                                 <img 
//                                     src={"https://i.imgur.com/dYcYQ7E.png"} 
//                                     alt="cover" 
//                                     className="w-full h-full object-cover" 
//                                 />
//                             </div>
                            
//                             {/* Foto de Perfil */}
//                             <div className="flex justify-center -mt-16 mb-4">
//                                 <img
//                                     src={profile.photo || "URL_DEFAULT_PROFILE_IMAGE"}
//                                     alt="profile"
//                                     // Tamaño responsivo y sombra para destacar
//                                     className="rounded-full border-solid w-32 h-32 sm:w-40 sm:h-40 border-white border-4 object-cover shadow-xl"
//                                 />
//                             </div>
                            
//                             {/* Contenido de Texto */}
//                             <div className="text-center px-4 pb-6 pt-2">
//                                 <h3 className="text-2xl font-bold mb-2">
//                                     {profile.name}
//                                 </h3>
//                                 <p className="mt-2 font-light text-slate-300 px-4 sm:px-8">
//                                     {profile.bio || "No hay biografía disponible."}
//                                 </p>
//                             </div>
                            
//                             {/* Contacto y Detalles */}
//                             <div 
//                                 // FLEX WRAP: Asegura que si los datos son muy largos, se ajusten
//                                 className="flex flex-wrap justify-center py-4 px-4 border-t border-slate-600 bg-slate-600/30"
//                             >
                                
//                                 {/* Teléfono */}
//                                 <div className="text-center w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-600 pb-2 sm:pb-0 pr-0 sm:pr-4 mb-2 sm:mb-0">
//                                     <h2 className="text-lg font-semibold">{profile.phone || "N/A"}</h2>
//                                     <span className="text-sm text-slate-300">Teléfono</span>
//                                 </div>
                                
//                                 {/* Email */}
//                                 <div className="text-center w-full sm:w-1/2 pl-0 sm:pl-4">
//                                     <h2 
//                                         // Oculta el desbordamiento si el email es muy largo.
//                                         className="text-sm sm:text-lg font-semibold truncate px-2" 
//                                         title={profile.email}
//                                     >
//                                         {profile.email || "N/A"}
//                                     </h2>
//                                     <span className="text-sm text-slate-300">Email</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* BOTÓN DE EDICIÓN */}
//                         <div className="flex justify-center mt-4">
//                             <Link to={"/edit-profile"}>
//                                 <button 
//                                     className="px-6 py-2 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition-colors"
//                                 >
//                                     Editar Perfil
//                                 </button>
//                             </Link>
//                         </div>
                        
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Profiles;


// import React from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion"; // 🚀 Importamos framer-motion
// import { FaUserEdit, FaEnvelope, FaPhone, FaRulerCombined, FaCalendarAlt, FaUserTie } from "react-icons/fa";

// // Importaciones
// import useRedirectLoggedOutUser from "../../custom/useRedirect";
// import { 
//     selectUser, // Usamos el selector para obtener el objeto de usuario completo
//     selectIsLoggedIn // Para confirmar el estado de login
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // ----------------------------------------------------
// // VARIABLES DE DISEÑO Y ANIMACIÓN
// // ----------------------------------------------------

// // Animación de la tarjeta principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { 
//             type: "spring", 
//             stiffness: 70, 
//             damping: 15, 
//             delay: 0.1 
//         }
//     }
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL: Profiles
// // ----------------------------------------------------
// const Profiles = () => {
//     // 1. Redirección si no está logueado
//     useRedirectLoggedOutUser("/login"); 
    
//     // 2. Obtener el perfil directamente desde Redux
//     const profile = useSelector(selectUser);
//     const isLoggedIn = useSelector(selectIsLoggedIn);
    
//     // 3. Estado de carga
//     const isLoading = !isLoggedIn || !profile || !profile.email; 

//     // ----------------------------------------------------
//     // Funciones Auxiliares
//     // ----------------------------------------------------

//     // Función para formatear la fecha de creación
//     const formatCreationDate = (dateString) => {
//         if (!dateString) return "N/A";
//         // Convertimos la cadena ISO (ej. 2023-10-26T10:00:00.000Z) a un formato legible
//         try {
//             return new Date(dateString).toLocaleDateString('es-ES', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             });
//         } catch (e) {
//             return dateString; // En caso de error, devolvemos el string original
//         }
//     };

//     // Componente auxiliar para las filas de datos
//     const DetailRow = ({ icon: Icon, label, value }) => (
//         <motion.div 
//             className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <div className="flex items-center text-gray-500">
//                 <Icon className="mr-3 text-lg text-blue-600" />
//                 <span className="font-medium">{label}</span>
//             </div>
//             <p className="text-gray-800 font-semibold max-w-[60%] truncate" title={value}>
//                 {value || "No especificado"}
//             </p>
//         </motion.div>
//     );

//     // ----------------------------------------------------
//     // BLOQUEO DE CARGA
//     // ----------------------------------------------------
//     if (isLoading) {
//         return (
//             <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[70vh] flex items-center justify-center">
//                 <Loader />
//             </div>
//         );
//     }

//     // ----------------------------------------------------
//     // RENDERIZADO DEL PERFIL (MODERNO)
//     // ----------------------------------------------------
//     const defaultPhoto = "https://i.imgur.com/k9b6Yw3.png"; // Placeholder
//     const coverPhoto = "https://images.unsplash.com/photo-1549880192-369e9008d5dd?fit=crop&q=80&w=2560&h=1000"; // Imagen de fondo

//     return (
//         <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4 sm:p-8">
            
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 // CARD PRINCIPAL: Sombra profunda, esquinas redondeadas, fondo blanco
//                 className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
//             >
//                 {/* 1. SECCIÓN DE CABECERA (COVER Y FOTO) */}
//                 <div className="relative">
//                     {/* Cover Photo */}
//                     <div className="h-36 bg-gray-200 overflow-hidden">
//                         <img 
//                             src={coverPhoto} 
//                             alt="cover" 
//                             className="w-full h-full object-cover opacity-70" 
//                         />
//                     </div>
                    
//                     {/* Foto de Perfil */}
//                     <motion.div
//                         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//                     >
//                         <motion.img
//                             src={profile.photo || defaultPhoto}
//                             alt="profile"
//                             // Borde de color de marca y tamaño grande
//                             className="rounded-full w-36 h-36 border-4 border-white object-cover shadow-xl ring-4 ring-blue-500/50"
//                             whileHover={{ scale: 1.05 }}
//                         />
//                     </motion.div>
//                 </div>
                
//                 {/* 2. SECCIÓN DE CONTENIDO */}
//                 <div className="pt-20 pb-8 px-6 sm:px-10 text-center">
                    
//                     {/* Nombre y Rol */}
//                     <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//                         {profile.name || "Usuario Desconocido"}
//                     </h1>
//                     <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md">
//                         {profile.role?.toUpperCase() || "USUARIO"}
//                     </span>

//                     {/* Biografía */}
//                     <motion.p 
//                         className="mt-4 text-gray-600 italic max-w-md mx-auto"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5 }}
//                     >
//                         "{profile.bio || "Una breve biografía sobre ti."}"
//                     </motion.p>
//                 </div>

//                 {/* 3. SECCIÓN DE DETALLES Y ACCIÓN */}
//                 <div className="bg-gray-50 p-6 sm:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
//                         <FaRulerCombined className="mr-2 text-blue-600" /> Detalles del Contacto
//                     </h2>
                    
//                     {/* Filas de Detalles */}
//                     <div className="space-y-3">
//                         <DetailRow icon={FaEnvelope} label="Email" value={profile.email} />
//                         <DetailRow icon={FaPhone} label="Teléfono" value={profile.phone} />
//                         <DetailRow 
//                             icon={FaCalendarAlt} 
//                             label="Miembro Desde" 
//                             value={formatCreationDate(profile.createdAt)} 
//                         />
//                         <DetailRow icon={FaUserTie} label="UID" value={profile.uid} />
//                     </div>

//                     {/* Botón de Edición */}
//                     <div className="mt-8">
//                         <Link to={"/edit-profile"}>
//                             <motion.button 
//                                 className="w-full flex items-center justify-center px-6 py-3 bg-red-500 rounded-xl text-white font-bold shadow-lg transition-colors hover:bg-red-600"
//                                 whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(239, 68, 68, 0.5)" }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <FaUserEdit className="mr-3" />
//                                 Editar Perfil
//                             </motion.button>
//                         </Link>
//                     </div>
//                 </div>

//             </motion.div>
//         </div>
//     );
// };

// export default Profiles;

// import React from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { 
//     FaEnvelope, 
//     FaPhone, 
//     FaRulerCombined, 
//     FaUserTie, 
//     FaSeedling, 
//     FaLocationDot,
//     FaCalendarDays,  // ✅ CORREGIDO: Reemplaza FaCalendarAlt
//     FaPenToSquare    // ✅ CORREGIDO: Reemplaza FaUserEdit
// } from "react-icons/fa6"; 

// // Importaciones
// import useRedirectLoggedOutUser from "../../custom/useRedirect";
// import { 
//     selectUser, 
//     selectIsLoggedIn 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // ----------------------------------------------------
// // VARIABLES DE DISEÑO Y ANIMACIÓN
// // ----------------------------------------------------

// // Animación de la tarjeta principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { 
//             type: "spring", 
//             stiffness: 70, 
//             damping: 15, 
//             delay: 0.1 
//         }
//     }
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL: Profiles
// // ----------------------------------------------------
// const Profiles = () => {
//     // 1. Redirección si no está logueado
//     useRedirectLoggedOutUser("/login"); 
    
//     // 2. Obtener el perfil directamente desde Redux
//     const profile = useSelector(selectUser);
//     const isLoggedIn = useSelector(selectIsLoggedIn);
    
//     // 3. Estado de carga
//     const isLoading = !isLoggedIn || !profile || !profile.email; 

//     // ----------------------------------------------------
//     // Funciones Auxiliares
//     // ----------------------------------------------------

//     // Función para formatear la fecha de creación
//     const formatCreationDate = (timestamp) => {
//         if (!timestamp) return "N/A";

//         let date;
//         // Manejo de Firebase Timestamps
//         if (typeof timestamp === 'object' && timestamp._seconds) {
//             date = new Date(timestamp._seconds * 1000);
//         } else if (typeof timestamp === 'string') {
//             date = new Date(timestamp);
//         } else {
//             return "N/A";
//         }
        
//         try {
//             return date.toLocaleDateString('es-ES', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             });
//         } catch (e) {
//             console.error("Error al formatear fecha:", e);
//             return "N/A";
//         }
//     };

//     // Componente auxiliar para las filas de datos
//     const DetailRow = ({ icon: Icon, label, value }) => (
//         <motion.div 
//             className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <div className="flex items-center text-gray-500">
//                 <Icon className="mr-3 text-lg text-blue-600" />
//                 <span className="font-medium">{label}</span>
//             </div>
//             <p className="text-gray-800 font-semibold max-w-[60%] truncate" title={value}>
//                 {value || "No especificado"}
//             </p>
//         </motion.div>
//     );

//     // ----------------------------------------------------
//     // BLOQUEO DE CARGA
//     // ----------------------------------------------------
//     if (isLoading) {
//         return (
//             <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[70vh] flex items-center justify-center">
//                 <Loader />
//             </div>
//         );
//     }

//     // ----------------------------------------------------
//     // RENDERIZADO DEL PERFIL (MODERNO CON COVER)
//     // ----------------------------------------------------
//     const defaultPhoto = "https://i.imgur.com/k9b6Yw3.png"; // Placeholder
    
//     // 🚀 Imagen de Cover por defecto relacionada con el campo
//     const coverPhoto = "https://images.unsplash.com/photo-1542828362-e67c8008e317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTZ8MHwxfHNlYXJjaHw0fHZhZ2V0YWJsZSUyMGZhcm0lMjBhZXJpYWx8ZW58MHx8fHwxNjk5MjI3MDcwfDA&ixlib=rb-4.0.3&q=80&w=1080";
    
//     return (
//         <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4 sm:p-8">
            
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
//             >
//                 {/* 1. SECCIÓN DE CABECERA (COVER Y FOTO) */}
//                 <div className="relative">
//                     {/* Cover Photo */}
//                     <div className="h-44 bg-gray-200 overflow-hidden">
//                         <img 
//                             src={coverPhoto} 
//                             alt="cover" 
//                             className="w-full h-full object-cover opacity-80" 
//                         />
//                     </div>
                    
//                     {/* Foto de Perfil */}
//                     <motion.div
//                         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//                     >
//                         <motion.img
//                             src={profile.photo || defaultPhoto}
//                             alt="profile"
//                             className="rounded-full w-40 h-40 border-6 border-white object-cover shadow-xl ring-4 ring-blue-500/50"
//                             whileHover={{ scale: 1.05 }}
//                         />
//                     </motion.div>
//                 </div>
                
//                 {/* 2. SECCIÓN DE CONTENIDO */}
//                 <div className="pt-24 pb-8 px-6 sm:px-10 text-center">
                    
//                     {/* Nombre y Rol */}
//                     <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//                         {profile.name || "Usuario Desconocido"}
//                     </h1>
//                     <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md">
//                         {profile.role?.toUpperCase() || "USUARIO"}
//                     </span>

//                     {/* Biografía */}
//                     <motion.p 
//                         className="mt-4 text-gray-600 italic max-w-md mx-auto"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5 }}
//                     >
//                         "{profile.bio || "Una breve biografía sobre tu empresa o a qué te dedicas."}"
//                     </motion.p>
//                 </div>

//                 {/* 3. SECCIÓN DE DETALLES Y ACCIÓN */}
//                 <div className="bg-gray-50 p-6 sm:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
//                         <FaSeedling className="mr-2 text-green-600" /> 
//                         Información de la Empresa
//                     </h2>
                    
//                     {/* Filas de Detalles */}
//                     <div className="space-y-3">
//                         <DetailRow icon={FaEnvelope} label="Email" value={profile.email} />
//                         <DetailRow icon={FaPhone} label="Teléfono" value={profile.phone} />
//                         <DetailRow 
//                             icon={FaCalendarDays} // ✅ CORREGIDO: Usando FaCalendarDays
//                             label="Miembro Desde" 
//                             value={formatCreationDate(profile.createdAt)} 
//                         />
//                         <DetailRow icon={FaUserTie} label="UID" value={profile.uid} />
//                     </div>

//                     {/* Botón de Edición */}
//                     <div className="mt-8">
//                         <Link to={"/edit-profile"}>
//                             <motion.button 
//                                 className="w-full flex items-center justify-center px-6 py-3 bg-red-500 rounded-xl text-white font-bold shadow-lg transition-colors hover:bg-red-600"
//                                 whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(239, 68, 68, 0.5)" }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <FaPenToSquare className="mr-3" /> {/* ✅ CORREGIDO: Usando FaPenToSquare */}
//                                 Editar Perfil
//                             </motion.button>
//                         </Link>
//                     </div>
//                 </div>

//             </motion.div>
//         </div>
//     );
// };

// export default Profiles;



// import React from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { 
//     FaEnvelope, 
//     FaPhone, 
//     FaRulerCombined, 
//     FaUserTie, 
//     FaSeedling, 
//     FaLocationDot,
//     FaCalendarDays,  // ✅ CORREGIDO: Reemplaza FaCalendarAlt
//     FaPenToSquare    // ✅ CORREGIDO: Reemplaza FaUserEdit
// } from "react-icons/fa6"; 

// // Importaciones
// import useRedirectLoggedOutUser from "../../custom/useRedirect";
// import { 
//     selectUser, 
//     selectIsLoggedIn 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // ----------------------------------------------------
// // VARIABLES DE DISEÑO Y ANIMACIÓN
// // ----------------------------------------------------

// // Animación de la tarjeta principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { 
//             type: "spring", 
//             stiffness: 70, 
//             damping: 15, 
//             delay: 0.1 
//         }
//     }
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL: Profiles
// // ----------------------------------------------------
// const Profiles = () => {
//     // 1. Redirección si no está logueado
//     useRedirectLoggedOutUser("/login"); 
    
//     // 2. Obtener el perfil directamente desde Redux
//     const profile = useSelector(selectUser);
//     const isLoggedIn = useSelector(selectIsLoggedIn);
    
//     // 3. Estado de carga
//     const isLoading = !isLoggedIn || !profile || !profile.email; 

//     // ----------------------------------------------------
//     // Funciones Auxiliares
//     // ----------------------------------------------------

//     // Función para formatear la fecha de creación
//     const formatCreationDate = (timestamp) => {
//         if (!timestamp) return "N/A";

//         let date;
//         // Manejo de Firebase Timestamps
//         if (typeof timestamp === 'object' && timestamp._seconds) {
//             date = new Date(timestamp._seconds * 1000);
//         } else if (typeof timestamp === 'string') {
//             date = new Date(timestamp);
//         } else {
//             return "N/A";
//         }
        
//         try {
//             return date.toLocaleDateString('es-ES', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             });
//         } catch (e) {
//             console.error("Error al formatear fecha:", e);
//             return "N/A";
//         }
//     };

//     // Componente auxiliar para las filas de datos
//     const DetailRow = ({ icon: Icon, label, value }) => (
//         <motion.div 
//             className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//         >
//             <div className="flex items-center text-gray-500">
//                 <Icon className="mr-3 text-lg text-blue-600" />
//                 <span className="font-medium">{label}</span>
//             </div>
//             <p className="text-gray-800 font-semibold max-w-[60%] truncate" title={value}>
//                 {value || "No especificado"}
//             </p>
//         </motion.div>
//     );

//     // ----------------------------------------------------
//     // BLOQUEO DE CARGA
//     // ----------------------------------------------------
//     if (isLoading) {
//         return (
//             <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[70vh] flex items-center justify-center">
//                 <Loader />
//             </div>
//         );
//     }

//     // ----------------------------------------------------
//     // RENDERIZADO DEL PERFIL (MODERNO CON COVER)
//     // ----------------------------------------------------
//     const defaultPhoto = "https://i.imgur.com/k9b6Yw3.png"; // Placeholder
    
//     // 🚀 Imagen de Cover por defecto relacionada con el campo
//     const coverPhoto = "https://images.unsplash.com/photo-1542828362-e67c8008e317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTMzNTZ8MHwxfHNlYXJjaHw0fHZhZ2V0YWJsZSUyMGZhcm0lMjBhZXJpYWx8ZW58MHx8fHwxNjk5MjI3MDcwfDA&ixlib=rb-4.0.3&q=80&w=1080";
    
//     return (
//         <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4 sm:p-8">
            
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
//             >
//                 {/* 1. SECCIÓN DE CABECERA (COVER Y FOTO) */}
//                 <div className="relative">
//                     {/* Cover Photo */}
//                     <div className="h-44 bg-gray-200 overflow-hidden">
//                         <img 
//                             src={coverPhoto} 
//                             alt="cover" 
//                             className="w-full h-full object-cover opacity-80" 
//                         />
//                     </div>
                    
//                     {/* Foto de Perfil */}
//                     <motion.div
//                         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//                     >
//                         <motion.img
//                             src={profile.photo || defaultPhoto}
//                             alt="profile"
//                             className="rounded-full w-40 h-40 border-6 border-white object-cover shadow-xl ring-4 ring-blue-500/50"
//                             whileHover={{ scale: 1.05 }}
//                         />
//                     </motion.div>
//                 </div>
                
//                 {/* 2. SECCIÓN DE CONTENIDO */}
//                 <div className="pt-24 pb-8 px-6 sm:px-10 text-center">
                    
//                     {/* Nombre y Rol */}
//                     <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//                         {profile.name || "Usuario Desconocido"}
//                     </h1>
//                     <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md">
//                         {profile.role?.toUpperCase() || "USUARIO"}
//                     </span>

//                     {/* Biografía */}
//                     <motion.p 
//                         className="mt-4 text-gray-600 italic max-w-md mx-auto"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5 }}
//                     >
//                         "{profile.bio || "Una breve biografía sobre tu empresa o a qué te dedicas."}"
//                     </motion.p>
//                 </div>

//                 {/* 3. SECCIÓN DE DETALLES Y ACCIÓN */}
//                 <div className="bg-gray-50 p-6 sm:p-8">
//                     <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
//                         <FaSeedling className="mr-2 text-green-600" /> 
//                         Información de la Empresa
//                     </h2>
                    
//                     {/* Filas de Detalles */}
//                     <div className="space-y-3">
//                         <DetailRow icon={FaEnvelope} label="Email" value={profile.email} />
//                         <DetailRow icon={FaPhone} label="Teléfono" value={profile.phone} />
//                         <DetailRow 
//                             icon={FaCalendarDays} // ✅ CORREGIDO: Usando FaCalendarDays
//                             label="Miembro Desde" 
//                             value={formatCreationDate(profile.createdAt)} 
//                         />
//                         <DetailRow icon={FaUserTie} label="UID" value={profile.uid} />
//                     </div>

//                     {/* Botón de Edición */}
//                     <div className="mt-8">
//                         <Link to={"/edit-profile"}>
//                             <motion.button 
//                                 className="w-full flex items-center justify-center px-6 py-3 bg-red-500 rounded-xl text-white font-bold shadow-lg transition-colors hover:bg-red-600"
//                                 whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(239, 68, 68, 0.5)" }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <FaPenToSquare className="mr-3" /> {/* ✅ CORREGIDO: Usando FaPenToSquare */}
//                                 Editar Perfil
//                             </motion.button>
//                         </Link>
//                     </div>
//                 </div>

//             </motion.div>
//         </div>
//     );
// };

// export default Profiles;



import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FaEnvelope, 
    FaPhone, 
    FaRulerCombined, 
    FaUserTie, 
    FaSeedling, 
    FaLocationDot,
    FaCalendarDays,  // ✅ CORREGIDO: Reemplaza FaCalendarAlt
    FaPenToSquare    // ✅ CORREGIDO: Reemplaza FaUserEdit
} from "react-icons/fa6"; 

// Importaciones
import useRedirectLoggedOutUser from "../../custom/useRedirect";
import { 
    selectUser, 
    selectIsLoggedIn 
} from "../../features/auth/authSlice/authSlice"; 
import Loader from "../../Util/Loader";

// ----------------------------------------------------
// 🎯 CAMBIO 1: IMPORTAR EL COVER LOCALMENTE
// ----------------------------------------------------
// AJUSTA esta ruta si el archivo está en una ubicación diferente.
import coverPhotoLocal from "../../asset/agro-pimiento.avif"; 

// ----------------------------------------------------
// VARIABLES DE DISEÑO Y ANIMACIÓN
// ----------------------------------------------------

// Animación de la tarjeta principal
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { 
            type: "spring", 
            stiffness: 70, 
            damping: 15, 
            delay: 0.1 
        }
    }
};

// ----------------------------------------------------
// COMPONENTE PRINCIPAL: Profiles
// ----------------------------------------------------
const Profiles = () => {
    // 1. Redirección si no está logueado
    useRedirectLoggedOutUser("/login"); 
    
    // 2. Obtener el perfil directamente desde Redux
    const profile = useSelector(selectUser);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    
    // 3. Estado de carga
    const isLoading = !isLoggedIn || !profile || !profile.email; 

    // ----------------------------------------------------
    // Funciones Auxiliares
    // ----------------------------------------------------

    // Función para formatear la fecha de creación
    const formatCreationDate = (timestamp) => {
        if (!timestamp) return "N/A";

        let date;
        // Manejo de Firebase Timestamps
        if (typeof timestamp === 'object' && timestamp._seconds) {
            date = new Date(timestamp._seconds * 1000);
        } else if (typeof timestamp === 'string') {
            date = new Date(timestamp);
        } else {
            return "N/A";
        }
        
        try {
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error("Error al formatear fecha:", e);
            return "N/A";
        }
    };

    // Componente auxiliar para las filas de datos
    const DetailRow = ({ icon: Icon, label, value }) => (
        <motion.div 
            className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center text-gray-500">
                <Icon className="mr-3 text-lg text-blue-600" />
                <span className="font-medium">{label}</span>
            </div>
            <p className="text-gray-800 font-semibold max-w-[60%] truncate" title={value}>
                {value || "No especificado"}
            </p>
        </motion.div>
    );

    // ----------------------------------------------------
    // BLOQUEO DE CARGA
    // ----------------------------------------------------
    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[70vh] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    // ----------------------------------------------------
    // RENDERIZADO DEL PERFIL (MODERNO CON COVER)
    // ----------------------------------------------------
    const defaultPhoto = "https://i.imgur.com/k9b6Yw3.png"; // Placeholder
    
    // 🎯 CAMBIO 2: USAR LA VARIABLE IMPORTADA LOCALMENTE (coverPhotoLocal)
    // El valor de 'coverPhotoLocal' se usa directamente en el src
    // ---------------------------------------------------------------------
    // ELIMINADA LA LÍNEA ANTIGUA: const coverPhoto = "https://images.unsplash.com/..."
    const finalCover = coverPhotoLocal; // Renombramos para usarla abajo
    
    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4 sm:p-8">
            
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
            >
                {/* 1. SECCIÓN DE CABECERA (COVER Y FOTO) */}
                <div className="relative">
                    {/* Cover Photo */}
                    <div className="h-44 bg-gray-200 overflow-hidden">
                        <img 
                            src={finalCover} // <-- ¡USANDO EL COVER LOCAL!
                            alt="cover" 
                            className="w-full h-full object-cover opacity-80" 
                        />
                    </div>
                    
                    {/* Foto de Perfil */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                        <motion.img
                            src={profile.photo || defaultPhoto}
                            alt="profile"
                            className="rounded-full w-40 h-40 border-6 border-white object-cover shadow-xl ring-4 ring-blue-500/50"
                            whileHover={{ scale: 1.05 }}
                        />
                    </motion.div>
                </div>
                
                {/* 2. SECCIÓN DE CONTENIDO */}
                <div className="pt-24 pb-8 px-6 sm:px-10 text-center">
                    
                    {/* Nombre y Rol */}
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        {profile.name || "Usuario Desconocido"}
                    </h1>
                    <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md">
                        {profile.role?.toUpperCase() || "USUARIO"}
                    </span>

                    {/* Biografía */}
                    <motion.p 
                        className="mt-4 text-gray-600 italic max-w-md mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        "{profile.bio || "Una breve biografía sobre tu empresa o a qué te dedicas."}"
                    </motion.p>
                </div>

                {/* 3. SECCIÓN DE DETALLES Y ACCIÓN */}
                <div className="bg-gray-50 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                        <FaSeedling className="mr-2 text-green-600" /> 
                        Información de la Empresa
                    </h2>
                    
                    {/* Filas de Detalles */}
                    <div className="space-y-3">
                        <DetailRow icon={FaEnvelope} label="Email" value={profile.email} />
                        <DetailRow icon={FaPhone} label="Teléfono" value={profile.phone} />
                        <DetailRow 
                            icon={FaCalendarDays} // ✅ CORREGIDO: Usando FaCalendarDays
                            label="Miembro Desde" 
                            value={formatCreationDate(profile.createdAt)} 
                        />
                        <DetailRow icon={FaUserTie} label="UID" value={profile.uid} />
                    </div>

                    {/* Botón de Edición */}
                    <div className="mt-8">
                        <Link to={"/edit-profile"}>
                            <motion.button 
                                className="w-full flex items-center justify-center px-6 py-3 bg-red-500 rounded-xl text-white font-bold shadow-lg transition-colors hover:bg-red-600"
                                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(239, 68, 68, 0.5)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaPenToSquare className="mr-3" /> {/* ✅ CORREGIDO: Usando FaPenToSquare */}
                                Editar Perfil
                            </motion.button>
                        </Link>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Profiles;