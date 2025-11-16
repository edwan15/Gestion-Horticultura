// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { FaArrowLeft } from "react-icons/fa"; // Icono para Regresar
// // Importamos 'motion' para las animaciones
// import { motion } from "framer-motion";
// import {
//   SET_LOGIN,
//   SET_NAME,
//   SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// import { loginUser, validateEmail } from "../../services/Services";
// import Loader from "../../Util/Loader"; // Ajusta la ruta si es necesario

// const initialState = {
//   email: "",
//   password: "",
// };

// // Configuración de la animación de entrada
// const formVariants = {
//   initial: {
//     y: "100vh", // Empieza fuera de la pantalla (abajo)
//     opacity: 0,
//     scale: 0.8,
//   },
//   animate: {
//     y: 0, // Se mueve a su posición final
//     opacity: 1,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 70, // Suavidad del movimiento
//       delay: 0.3, // **DELAY de 300ms** antes de empezar la transición
//       duration: 0.8,
//     },
//   },
// };

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setformData] = useState(initialState);
//   const { email, password } = formData;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setformData({ ...formData, [name]: value });
//   };

//   const goToRoot = () => {
//     navigate("/");
//   };

//   const login = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("Todos los campos son obligatorios");
//     }

//     if (!validateEmail(email)) {
//       return toast.error("Por favor, introduce un email válido");
//     }

//     const userData = {
//       email,
//       password,
//     };
//     try {
//       setIsLoading(true);
//       const data = await loginUser(userData);

//       // 🛑 CONSOLE.LOG PARA DEPURACIÓN 🛑
//       // Abre la consola (F12) para ver si 'data' contiene el objeto de usuario completo.
//       console.log("Datos de Usuario recibidos después del login:", data);
//       // ------------------------------------

//       await dispatch(SET_LOGIN(true));

//       // 🛑 CORRECCIÓN DE SEGURIDAD 🛑
//       // 1. SET_USER: Si 'data' es null o undefined (aunque no debería), usa un objeto vacío {}.
//       await dispatch(SET_USER(data || {}));

//       // 2. SET_NAME: Usa encadenamiento opcional (?.) y valor por defecto para prevenir el fallo del 'name'.
//       await dispatch(SET_NAME(data.name || "User"));

//       // -----------------------------
//       console.log("Datos de Usuario recibidos después del login:", data.name);

//       navigate("/acumuladoC");
//       setIsLoading(false);
//       setformData(initialState);
//       toast.success("Inicio de sesión exitoso");
//     } catch (error) {
//       // Asegúrate de que el error.message aquí provenga de tu Services.js
//       setIsLoading(false);
//       toast.error(
//         error.message ||
//           "Fallo en el inicio de sesión. Verifica tus credenciales."
//       );
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="min-h-screen flex items-center justify-center 
//                 bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] 
//                 bg-cover bg-center bg-no-repeat">
//         <motion.div
//           variants={formVariants}
//           initial="initial"
//           animate="animate"
//           className="w-full max-w-sm"
//         >
//           {/* Contenedor del Formulario (Estilos modernos) */}
//           <div className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
//             <form className="flex flex-col gap-4" onSubmit={login}>
//               <div className="flex gap-3 justify-center items-center mb-6">
//                 <p className="text-4xl text-white font-extrabold">Login</p>
//                 <SlLogin className="text-3xl text-emerald-400" />
//               </div>

//               {/* Input Email */}
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 name="email"
//                 placeholder="Email"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Input Password */}
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 name="password"
//                 placeholder="Password"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Botón de Submit */}
//               <button
//                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//                 type="submit"
//               >
//                 Enviar
//               </button>

//               <p className="text-center text-xl text-white font-extrabold mt-2">
//                 -- Opciones --
//               </p>

//               {/* Sección de Opciones: Regresar y Registrar */}
//               <div className="flex justify-between items-center mt-2 text-white">
//                 {/* 1. Botón Regresar a la Raíz */}
//                 <button
//                   type="button" // Importante: evita que se envíe el formulario
//                   onClick={goToRoot}
//                   className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                   aria-label="Regresar a la página de inicio"
//                 >
//                   <FaArrowLeft className="w-4 h-4" />
//                   Raíz
//                 </button>

//                 {/* 2. Enlace a Registrar */}
//                 <Link to="/register">
//                   <span className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer">
//                     Regístrate
//                   </span>
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default Login;















// import React, { useState } from "react";
// // Importaciones requeridas para funcionalidad (Rutas, Redux, Notificaciones)
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // Importaciones de Redux y Servicios (Asegura que estas rutas son correctas)
// import {
//     SET_LOGIN,
//     SET_NAME, // <--- Esta acción es crucial para el Header
//     SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// // Asumiendo que 'loginUser' devuelve { ..., name: "Usuario Nombre" }
// import { loginUser, validateEmail } from "../../services/Services"; 

// // Eliminada la importación de Loader para mantener el código más limpio, 
// // puedes reincorporarlo si lo prefieres, pero el isLoading actual ya funciona.

// import { motion } from "framer-motion";

// const initialState = {
//     email: "",
//     password: "",
// };

// // =================================================================
// // 0. COMPONENTES AUTOSUFICIENTES (Iconos)
// // =================================================================

// // Reemplazo de SlLogin (Candado)
// const LockIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
//         <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
//     </svg>
// );

// // Reemplazo de FaArrowLeft (Flecha)
// const ArrowLeftIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="m12 19-7-7 7-7"></path>
//         <path d="M19 12H5"></path>
//     </svg>
// );

// // Reemplazo de GiFruitTree (Árbol/Logo Agrícola)
// const TreeIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         {/* Tronco */}
//         <path d="M12 13v9" stroke="currentColor" strokeWidth="2"/>
//         {/* Hojas (Relleno verde) */}
//         <circle cx="12" cy="7" r="5" className="text-emerald-500 fill-emerald-500" stroke="none"/>
//         <path d="M10 7a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" fill="#0c4532" stroke="none"/>
//     </svg>
// );


// // =================================================================
// // 1. VARIANTES DE FRAMER MOTION
// // =================================================================

// const formVariants = {
//     initial: { y: 100, opacity: 0, scale: 0.95 },
//     animate: {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         transition: {
//             type: "spring",
//             stiffness: 70,
//             damping: 10,
//             delay: 0.3,
//             when: "beforeChildren",
//             staggerChildren: 0.1,
//         },
//     },
// };

// const inputVariants = {
//     initial: { x: -20, opacity: 0 },
//     animate: {
//         x: 0,
//         opacity: 1,
//         transition: {
//             type: "tween",
//             duration: 0.3,
//         },
//     },
// };

// // =================================================================
// // 2. COMPONENTE LOGIN
// // =================================================================

// const Login = () => {
//     // Hooks de funcionalidad
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const { email, password } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/"); // RUTA: Navegar a la raíz (Home)
//     };
    
//     // Función de login con Redux y Rutas
//     const login = async (e) => {
//         e.preventDefault();

//         if (!email || !password) {
//             return toast.error("Todos los campos son obligatorios.");
//         }

//         // Asume que validateEmail está importado de Services
//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce una credencial válida.");
//         }

//         const userData = { email, password };
        
//         try {
//             setIsLoading(true);
//             // Asume que loginUser está importado de Services y devuelve { name: "...", ... }
//             const data = await loginUser(userData);

//             // 1. Marcar como logueado
//             await dispatch(SET_LOGIN(true));
//             // 2. Guardar objeto de usuario completo
//             await dispatch(SET_USER(data || {}));
//             // 3. 🛑 Guardar el nombre del usuario (Corrige el problema del Header)
//             await dispatch(SET_NAME(data.name || "User")); 

//             setIsLoading(false);
//             setformData(initialState);
//             toast.success(`Bienvenido, ${data.name || 'Usuario'}! Sesión iniciada.`);
            
//             // 4. Redireccionar a la ruta del dashboard
//             navigate("/acumuladoC"); 

//         } catch (error) {
//             setIsLoading(false);
//             toast.error(
//                 error.message ||
//                 "Fallo en la autenticación. Verifique las credenciales."
//             );
//         }
//     };

//     return (
//         <>
//             {/* Si usas Loader, puedes renderizarlo condicionalmente aquí: {isLoading && <Loader />} */}
            
//             {/* Contenedor Principal con fondo y capa oscura */}
//             <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//                 {/* Fondo fijo */}
//                 <div 
//                     className="absolute inset-0 bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] bg-cover bg-center bg-no-repeat"
//                     aria-hidden="true"
//                 ></div>

//                 {/* Capa de Oscurecimiento Futurista */}
//                 <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" aria-hidden="true"></div>

//                 {/* Contenedor Animado */}
//                 <motion.div
//                     variants={formVariants}
//                     initial="initial"
//                     animate="animate"
//                     className="w-[90%] max-w-md lg:max-w-lg relative z-10" 
//                 >
//                     {/* Contenedor del Formulario */}
//                     <div className="p-10 border border-emerald-400/20 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl transition-all duration-700 
//                                      shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
//                     >
//                         <form className="flex flex-col gap-5" onSubmit={login}>
                            
//                             {/* Título (Futurista) */}
//                             <div className="flex gap-3 justify-center items-center mb-6">
//                                 <motion.p 
//                                     className="text-4xl text-white font-extrabold tracking-widest uppercase drop-shadow-md"
//                                     initial={{ scale: 0.8 }}
//                                     animate={{ scale: 1 }}
//                                     transition={{ type: "spring", stiffness: 100 }}
//                                 >
//                                     Autenticación
//                                 </motion.p>
//                                 {/* Ícono de Candado/Login */}
//                                 <LockIcon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.8)]" />
//                             </div>

//                             {/* Input Email con Animación */}
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="email"
//                                     required
//                                     value={email}
//                                     name="email"
//                                     placeholder="Credencial Electrónica"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>

//                             {/* Input Password con Animación */}
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="password"
//                                     required
//                                     value={password}
//                                     name="password"
//                                     placeholder="Clave de Acceso"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>

//                             {/* Botón de Submit */}
//                             <motion.button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
//                                 whileTap={{ scale: 0.98 }}
//                                 className="w-full p-4 bg-blue-600 rounded-xl mt-4 text-white font-extrabold text-xl shadow-lg border-2 border-transparent 
//                                              transition-all duration-300 hover:bg-blue-700 hover:border-blue-400 
//                                              hover:shadow-blue-500/50"
//                             >
//                                 {isLoading ? "Verificando Credenciales..." : "Acceder al Sistema"}
//                             </motion.button>

//                             <p className="text-center text-md text-white/60 font-semibold mt-2">-- Protocolos de Acceso --</p>

//                             {/* Sección de Opciones: Regresar y Registrar */}
//                             <div className="flex justify-between items-center text-white">
//                                 {/* 1. Botón Regresar a la Raíz */}
//                                 <motion.button
//                                     type="button" 
//                                     onClick={goToRoot}
//                                     whileHover={{ x: -5, scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-700/50 rounded-full shadow-md transition-all duration-300 hover:bg-gray-600/80 border border-gray-600/50"
//                                     aria-label="Regresar a la página de inicio"
//                                 >
//                                     {/* Ícono de Flecha Izquierda */}
//                                     <ArrowLeftIcon className="w-4 h-4 text-emerald-400" />
//                                     Inicio
//                                 </motion.button>

//                                 {/* 2. Enlace a Registrar */}
//                                 {/* Usamos <Link> con la ruta para la navegación real */}
//                                 <Link to="/register"> 
//                                     <motion.span 
//                                         whileHover={{ scale: 1.1, textShadow: "0px 0px 10px rgba(52, 211, 163, 0.8)" }}
//                                         className="text-lg text-emerald-400 font-extrabold p-1 transition-colors duration-300 hover:text-emerald-300 cursor-pointer"
//                                     >
//                                         Crear ID
//                                     </motion.span>
//                                 </Link>
//                             </div>
//                         </form>

//                         {/* Logo Footer */}
//                         <div className="flex justify-center mt-8 gap-2 items-center text-white/80">
//                             <p className="font-extrabold text-xl tracking-[0.2em] text-gray-200">HORTICULTURA</p>
//                             <h1 className="text-3xl font-bold">
//                                 {/* Ícono de Árbol */}
//                                 <TreeIcon className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.5)]" />
//                             </h1>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </>
//     );
// };

// export default Login;




// import React, { useState } from "react";
// // Importaciones requeridas para funcionalidad (Rutas, Redux, Notificaciones)
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // Importaciones de Redux y Servicios
// import {
//     SET_LOGIN,
//     SET_NAME,
//     SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// // 🛑 CORRECCIÓN: Se requiere importar 'getProfile' para obtener el nombre completo. 🛑
// import { loginUser, validateEmail, getProfile } from "../../services/Services"; 

// import { motion } from "framer-motion";

// const initialState = {
//     email: "",
//     password: "",
// };

// // =================================================================
// // 0. COMPONENTES AUTOSUFICIENTES (Iconos)
// // =================================================================

// // Reemplazo de SlLogin (Candado)
// const LockIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
//         <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
//     </svg>
// );

// // Reemplazo de FaArrowLeft (Flecha)
// const ArrowLeftIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="m12 19-7-7 7-7"></path>
//         <path d="M19 12H5"></path>
//     </svg>
// );

// // Reemplazo de GiFruitTree (Árbol/Logo Agrícola)
// const TreeIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         {/* Tronco */}
//         <path d="M12 13v9" stroke="currentColor" strokeWidth="2"/>
//         {/* Hojas (Relleno verde) */}
//         <circle cx="12" cy="7" r="5" className="text-emerald-500 fill-emerald-500" stroke="none"/>
//         <path d="M10 7a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" fill="#0c4532" stroke="none"/>
//     </svg>
// );


// // =================================================================
// // 1. VARIANTES DE FRAMER MOTION
// // =================================================================

// const formVariants = {
//     initial: { y: 100, opacity: 0, scale: 0.95 },
//     animate: {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         transition: {
//             type: "spring",
//             stiffness: 70,
//             damping: 10,
//             delay: 0.3,
//             when: "beforeChildren",
//             staggerChildren: 0.1,
//         },
//     },
// };

// const inputVariants = {
//     initial: { x: -20, opacity: 0 },
//     animate: {
//         x: 0,
//         opacity: 1,
//         transition: {
//             type: "tween",
//             duration: 0.3,
//         },
//     },
// };

// // =================================================================
// // 2. COMPONENTE LOGIN
// // =================================================================

// const Login = () => {
//     // Hooks de funcionalidad
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const { email, password } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/"); // RUTA: Navegar a la raíz (Home)
//     };
    
//     // Función de login con Redux y Rutas
//     const login = async (e) => {
//         e.preventDefault();

//         if (!email || !password) {
//             return toast.error("Todos los campos son obligatorios.");
//         }

//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce una credencial válida.");
//         }

//         const userData = { email, password };
        
//         try {
//             setIsLoading(true);
            
//             // 1. Llama a loginUser (para autenticación y token/cookie de sesión)
//             await loginUser(userData);

//             // 2. 🛑 CORRECCIÓN CLAVE: Llama a getProfile para obtener el nombre real. 🛑
//             const profileData = await getProfile(); 
            
//             // Determinar el nombre a mostrar (usando 'name' o el email como respaldo)
//             const userName = profileData.name || (profileData.email ? profileData.email.split('@')[0] : "Usuario");

//             // 3. Despachar acciones
//             await dispatch(SET_LOGIN(true));
//             await dispatch(SET_USER(profileData || {})); // Guarda el objeto completo del perfil
//             await dispatch(SET_NAME(userName));        // Asegura que el nombre se actualice inmediatamente en el Header

//             setIsLoading(false);
//             setformData(initialState);
//             toast.success(`Bienvenido, ${userName}! Sesión iniciada.`);
            
//             // 4. Redireccionar a la ruta del dashboard
//             navigate("/acumuladoC"); 

//         } catch (error) {
//             setIsLoading(false);
//             // Captura el mensaje de error si existe (por ejemplo, "Email o contraseña incorrectos")
//             const errorMessage = error.response?.data?.message || error.message; 
//             toast.error(
//                 errorMessage ||
//                 "Fallo en la autenticación. Verifique las credenciales."
//             );
//         }
//     };

//     return (
//         <>
//             {/* Si usas Loader, puedes renderizarlo condicionalmente aquí: {isLoading && <Loader />} */}
            
//             {/* Contenedor Principal con fondo y capa oscura */}
//             <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//                 {/* Fondo fijo */}
//                 <div 
//                     className="absolute inset-0 bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] bg-cover bg-center bg-no-repeat"
//                     aria-hidden="true"
//                 ></div>

//                 {/* Capa de Oscurecimiento Futurista */}
//                 <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" aria-hidden="true"></div>

//                 {/* Contenedor Animado */}
//                 <motion.div
//                     variants={formVariants}
//                     initial="initial"
//                     animate="animate"
//                     className="w-[90%] max-w-md lg:max-w-lg relative z-10" 
//                 >
//                     {/* Contenedor del Formulario */}
//                     <div className="p-10 border border-emerald-400/20 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl transition-all duration-700 
//                                   shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
//                     >
//                         <form className="flex flex-col gap-5" onSubmit={login}>
                            
//                             {/* Título (Futurista) */}
//                             <div className="flex gap-3 justify-center items-center mb-6">
//                                 <motion.p 
//                                     className="text-4xl text-white font-extrabold tracking-widest uppercase drop-shadow-md"
//                                     initial={{ scale: 0.8 }}
//                                     animate={{ scale: 1 }}
//                                     transition={{ type: "spring", stiffness: 100 }}
//                                 >
//                                     Autenticación
//                                 </motion.p>
//                                 {/* Ícono de Candado/Login */}
//                                 <LockIcon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.8)]" />
//                             </div>

//                             {/* Input Email con Animación */}
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="email"
//                                     required
//                                     value={email}
//                                     name="email"
//                                     placeholder="Credencial Electrónica"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>

//                             {/* Input Password con Animación */}
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="password"
//                                     required
//                                     value={password}
//                                     name="password"
//                                     placeholder="Clave de Acceso"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>

//                             {/* Botón de Submit */}
//                             <motion.button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
//                                 whileTap={{ scale: 0.98 }}
//                                 className="w-full p-4 bg-blue-600 rounded-xl mt-4 text-white font-extrabold text-xl shadow-lg border-2 border-transparent 
//                                              transition-all duration-300 hover:bg-blue-700 hover:border-blue-400 
//                                              hover:shadow-blue-500/50"
//                             >
//                                 {isLoading ? "Verificando Credenciales..." : "Acceder al Sistema"}
//                             </motion.button>

//                             <p className="text-center text-md text-white/60 font-semibold mt-2">-- Protocolos de Acceso --</p>

//                             {/* Sección de Opciones: Regresar y Registrar */}
//                             <div className="flex justify-between items-center text-white">
//                                 {/* 1. Botón Regresar a la Raíz */}
//                                 <motion.button
//                                     type="button" 
//                                     onClick={goToRoot}
//                                     whileHover={{ x: -5, scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-700/50 rounded-full shadow-md transition-all duration-300 hover:bg-gray-600/80 border border-gray-600/50"
//                                     aria-label="Regresar a la página de inicio"
//                                 >
//                                     {/* Ícono de Flecha Izquierda */}
//                                     <ArrowLeftIcon className="w-4 h-4 text-emerald-400" />
//                                     Inicio
//                                 </motion.button>

//                                 {/* 2. Enlace a Registrar */}
//                                 {/* Usamos <Link> con la ruta para la navegación real */}
//                                 <Link to="/register"> 
//                                     <motion.span 
//                                         whileHover={{ scale: 1.1, textShadow: "0px 0px 10px rgba(52, 211, 163, 0.8)" }}
//                                         className="text-lg text-emerald-400 font-extrabold p-1 transition-colors duration-300 hover:text-emerald-300 cursor-pointer"
//                                     >
//                                         Crear ID
//                                     </motion.span>
//                                 </Link>
//                             </div>
//                         </form>

//                         {/* Logo Footer */}
//                         <div className="flex justify-center mt-8 gap-2 items-center text-white/80">
//                             <p className="font-extrabold text-xl tracking-[0.2em] text-gray-200">HORTICULTURA</p>
//                             <h1 className="text-3xl font-bold">
//                                 {/* Ícono de Árbol */}
//                                 <TreeIcon className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.5)]" />
//                             </h1>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </>
//     );
// };

// export default Login;






import React, { useState } from "react";
// Importaciones requeridas para funcionalidad (Rutas, Redux, Notificaciones)
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Importaciones de Redux y Servicios
import {
    SET_LOGIN,
    SET_NAME,
    SET_USER,
} from "../../features/auth/authSlice/authSlice";
// CORRECCIÓN: Se requiere importar 'getProfile' para obtener el nombre completo.
import { loginUser, validateEmail, getProfile } from "../../services/Services";

import { motion } from "framer-motion";

const initialState = {
    email: "",
    password: "",
};

// =================================================================
// 0. COMPONENTES AUTOSUFICIENTES (Iconos)
// =================================================================

// Reemplazo de SlLogin (Candado)
const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

// Reemplazo de FaArrowLeft (Flecha)
const ArrowLeftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19-7-7 7-7"></path>
        <path d="M19 12H5"></path>
    </svg>
);

// Reemplazo de GiFruitTree (Árbol/Logo Agrícola)
const TreeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Tronco */}
        <path d="M12 13v9" stroke="currentColor" strokeWidth="2"/>
        {/* Hojas (Relleno verde) */}
        <circle cx="12" cy="7" r="5" className="text-emerald-500 fill-emerald-500" stroke="none"/>
        <path d="M10 7a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" fill="#0c4532" stroke="none"/>
    </svg>
);


// =================================================================
// 1. VARIANTES DE FRAMER MOTION (AJUSTADAS PARA RAPIDEZ)
// =================================================================

const formVariants = {
    initial: { y: 100, opacity: 0, scale: 0.95 },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            // 🛑 AJUSTE DE RAPIDEZ: Aumentar stiffness y ajustar damping
            stiffness: 150, // Más rígido = más rápido
            damping: 20,    // Menos rebote
            delay: 0.1, // 🛑 AJUSTE DE RAPIDEZ: Retardo reducido a 0.1s
            when: "beforeChildren",
            staggerChildren: 0.05, // Retardo entre hijos (inputs) también reducido
        },
    },
};

const inputVariants = {
    initial: { x: -20, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: "tween",
            duration: 0.15, // 🛑 AJUSTE DE RAPIDEZ: Duración reducida de 0.3s a 0.15s
        },
    },
};

// =================================================================
// 2. COMPONENTE LOGIN
// =================================================================

const Login = () => {
    // Hooks de funcionalidad
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(initialState);
    const { email, password } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    const goToRoot = () => {
        navigate("/"); // RUTA: Navegar a la raíz (Home)
    };
    
    // Función de login con Redux y Rutas
    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error("Todos los campos son obligatorios.");
        }

        if (!validateEmail(email)) {
            return toast.error("Por favor, introduce una credencial válida.");
        }

        const userData = { email, password };
        
        try {
            setIsLoading(true);
            
            // 1. Llama a loginUser (para autenticación y token/cookie de sesión)
            await loginUser(userData);

            // 2. CORRECCIÓN CLAVE: Llama a getProfile para obtener el nombre real.
            const profileData = await getProfile(); 
            
            // Determinar el nombre a mostrar (usando 'name' o el email como respaldo)
            const userName = profileData.name || (profileData.email ? profileData.email.split('@')[0] : "Usuario");

            // 3. Despachar acciones
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_USER(profileData || {})); // Guarda el objeto completo del perfil
            await dispatch(SET_NAME(userName));        // Asegura que el nombre se actualice inmediatamente en el Header

            setIsLoading(false);
            setformData(initialState);
            toast.success(`Bienvenido, ${userName}! Sesión iniciada.`);
            
            // 4. Redireccionar a la ruta del dashboard
            navigate("/acumuladoC"); 

        } catch (error) {
            setIsLoading(false);
            // Captura el mensaje de error si existe (por ejemplo, "Email o contraseña incorrectos")
            const errorMessage = error.response?.data?.message || error.message; 
            toast.error(
                errorMessage ||
                "Fallo en la autenticación. Verifique las credenciales."
            );
        }
    };

    return (
        <>
            {/* Si usas Loader, puedes renderizarlo condicionalmente aquí: {isLoading && <Loader />} */}
            
            {/* Contenedor Principal con fondo y capa oscura */}
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Fondo fijo */}
                <div 
                    className="absolute inset-0 bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] bg-cover bg-center bg-no-repeat"
                    aria-hidden="true"
                ></div>

                {/* Capa de Oscurecimiento Futurista */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" aria-hidden="true"></div>

                {/* Contenedor Animado */}
                <motion.div
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    className="w-[90%] max-w-md lg:max-w-lg relative z-10" 
                >
                    {/* Contenedor del Formulario */}
                    <div className="p-10 border border-emerald-400/20 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl transition-all duration-700 
                                 shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
                    >
                        <form className="flex flex-col gap-5" onSubmit={login}>
                            
                            {/* Título (Futurista) */}
                            <div className="flex gap-3 justify-center items-center mb-6">
                                <motion.p 
                                    className="text-4xl text-white font-extrabold tracking-widest uppercase drop-shadow-md"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    Autenticación
                                </motion.p>
                                {/* Ícono de Candado/Login */}
                                <LockIcon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.8)]" />
                            </div>

                            {/* Input Email con Animación */}
                            <motion.div variants={inputVariants}>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    name="email"
                                    placeholder="Credencial Electrónica"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>

                            {/* Input Password con Animación */}
                            <motion.div variants={inputVariants}>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    name="password"
                                    placeholder="Clave de Acceso"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>

                            {/* Botón de Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-4 bg-blue-600 rounded-xl mt-4 text-white font-extrabold text-xl shadow-lg border-2 border-transparent 
                                             transition-all duration-300 hover:bg-blue-700 hover:border-blue-400 
                                             hover:shadow-blue-500/50"
                            >
                                {isLoading ? "Verificando Credenciales..." : "Acceder al Sistema"}
                            </motion.button>

                            <p className="text-center text-md text-white/60 font-semibold mt-2">-- Protocolos de Acceso --</p>

                            {/* Sección de Opciones: Regresar y Registrar */}
                            <div className="flex justify-between items-center text-white">
                                {/* 1. Botón Regresar a la Raíz */}
                                <motion.button
                                    type="button" 
                                    onClick={goToRoot}
                                    whileHover={{ x: -5, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-700/50 rounded-full shadow-md transition-all duration-300 hover:bg-gray-600/80 border border-gray-600/50"
                                    aria-label="Regresar a la página de inicio"
                                >
                                    {/* Ícono de Flecha Izquierda */}
                                    <ArrowLeftIcon className="w-4 h-4 text-emerald-400" />
                                    Inicio
                                </motion.button>

                                {/* 2. Enlace a Registrar */}
                                {/* Usamos <Link> con la ruta para la navegación real */}
                                <Link to="/register"> 
                                    <motion.span 
                                        whileHover={{ scale: 1.1, textShadow: "0px 0px 10px rgba(52, 211, 163, 0.8)" }}
                                        className="text-lg text-emerald-400 font-extrabold p-1 transition-colors duration-300 hover:text-emerald-300 cursor-pointer"
                                    >
                                        Crear ID
                                    </motion.span>
                                </Link>
                            </div>
                        </form>

                        {/* Logo Footer */}
                        <div className="flex justify-center mt-8 gap-2 items-center text-white/80">
                            <p className="font-extrabold text-xl tracking-[0.2em] text-gray-200">HORTICULTURA</p>
                            <h1 className="text-3xl font-bold">
                                {/* Ícono de Árbol */}
                                <TreeIcon className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.5)]" />
                            </h1>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Login;



// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// // Importaciones de Firebase reubicadas en el componente para autocontención
// import { initializeApp } from "firebase/app"; 
// import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
// import { doc, getDoc, getFirestore } from "firebase/firestore";

// // --- 🔥 Configuración de Firebase - REINTEGRADA PARA AUTOCONTENIDO 🔥 ---
// const firebaseConfig = {
//     apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
//     authDomain: "calend-e5f32.firebaseapp.com",
//     projectId: "calend-e5f32",
//     storageBucket: "calend-e5f32.firebasestorage.app",
//     messagingSenderId: "960965784873",
//     appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app); 
// // --- ---------------------------------------------------------------- ---

// // --- 🔥 Simulación de Dependencias para Autocontenido 🔥 ---

// // 1. Simulación de Redux (Reemplaza "react-redux" y slices)
// const SET_LOGIN = (payload) => ({ type: 'SET_LOGIN', payload });
// const SET_NAME = (payload) => ({ type: 'SET_NAME', payload });
// const SET_USER = (payload) => ({ type: 'SET_USER', payload });
// // El useDispatch es un mock
// const useDispatch = () => (action) => console.log(`[Redux Mock] Dispatch: ${action.type}`, action.payload);

// // 2. Simulación de Toastify (Reemplaza "react-toastify")
// const useStatusMessage = () => {
//     const [message, setMessage] = useState(null);
//     const [isError, setIsError] = useState(false);
    
//     const displayMessage = (msg, error = false) => {
//         setMessage(msg);
//         setIsError(error);
//         setTimeout(() => setMessage(null), 4000); 
//     };
    
//     return { 
//         message, 
//         isError, 
//         toastSuccess: (msg) => displayMessage(msg, false),
//         toastError: (msg) => displayMessage(msg, true)
//     };
// };

// // 3. Loader Componente Mock (Reemplaza "../../Util/Loader")
// const Loader = () => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
//   </div>
// );

// // 4. Simulación de validateEmail (Reemplaza el service)
// const validateEmail = (email) => {
//     return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
// };

// // --- -------------------------------------------------------- ---

// const initialState = {
//   email: "",
//   password: "",
// };

// const formVariants = {
//   initial: { y: "100vh", opacity: 0, scale: 0.8 },
//   animate: {
//     y: 0, 
//     opacity: 1,
//     scale: 1,
//     transition: { type: "spring", stiffness: 70, delay: 0.3, duration: 0.8 },
//   },
// };

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { message, isError, toastError, toastSuccess } = useStatusMessage(); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setformData] = useState(initialState);
//   const { email, password } = formData;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setformData({ ...formData, [name]: value });
//   };

//   const goToRoot = () => {
//     navigate("/");
//   };

//   // Función para obtener el nombre del usuario desde Firestore
//   const fetchUserProfile = async (uid) => {
//     try {
//         // Usa la constante 'db' definida en el scope del archivo
//         const userRef = doc(db, "users", uid);
//         const docSnap = await getDoc(userRef);

//         if (docSnap.exists()) {
//             return docSnap.data().name || "User"; // Retorna el nombre si existe
//         } else {
//             console.warn("No se encontró el perfil de usuario en Firestore.");
//             return "User"; // Nombre por defecto
//         }
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return "User"; // Nombre por defecto en caso de error
//     }
//   };


//   // --- Función de Login con Firebase Auth ---
//   const login = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toastError("Todos los campos son obligatorios");
//     }

//     if (!validateEmail(email)) {
//       return toastError("Por favor, introduce un email válido");
//     }

//     setIsLoading(true);

//     try {
//         const userCredential = await signInWithEmailAndPassword(
//             auth, // Usa la constante 'auth' definida en el scope del archivo
//             email,
//             password
//         );
//         const firebaseUser = userCredential.user;
        
//         // Obtenemos el nombre del usuario para el estado
//         const name = await fetchUserProfile(firebaseUser.uid);

//         // Objeto de datos del usuario
//         const data = {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             name: name,
//         };
        
//         dispatch(SET_LOGIN(true));
//         dispatch(SET_USER(data));
//         dispatch(SET_NAME(name));

//         navigate("/acumuladoC");
//         setIsLoading(false);
//         setformData(initialState);
//         toastSuccess("Inicio de sesión exitoso");

//     } catch (error) {
//         setIsLoading(false);
//         let errorMessage;
        
//         // Mapeo de errores comunes de Firebase Authentication
//         switch (error.code) {
//             case 'auth/user-not-found':
//             case 'auth/wrong-password':
//                 errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
//                 break;
//             case 'auth/invalid-email':
//                 errorMessage = 'El formato del correo electrónico es inválido.';
//                 break;
//             case 'auth/too-many-requests':
//                 errorMessage = 'Acceso bloqueado temporalmente debido a demasiados intentos fallidos.';
//                 break;
//             default:
//                 errorMessage = 'Fallo en el inicio de sesión. Verifica tus credenciales.';
//         }
        
//         toastError(errorMessage);
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="min-h-screen flex items-center justify-center 
//                 bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] 
//                 bg-cover bg-center bg-no-repeat">
//         <motion.div
//           variants={formVariants}
//           initial="initial"
//           animate="animate"
//           className="w-full max-w-sm"
//         >
//           {/* Contenedor del Formulario (Estilos modernos) */}
//           <div className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
//             <form className="flex flex-col gap-4" onSubmit={login}>
//               <div className="flex gap-3 justify-center items-center mb-6">
//                 <p className="text-4xl text-white font-extrabold">Login</p>
//                 {/* Ícono de Login */}
//                 <span role="img" aria-label="login" className="text-3xl text-emerald-400">➡️</span> 
//               </div>

//               {/* Input Email */}
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 name="email"
//                 placeholder="Email"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Input Password */}
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 name="password"
//                 placeholder="Password"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Botón de Submit */}
//               <button
//                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Iniciando Sesión...' : 'Enviar'}
//               </button>
              
//               {/* Mensaje de estado (Reemplazo de Toastify) */}
//               {message && (
//                 <div className={`mt-2 p-3 text-center rounded-lg font-semibold ${isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
//                   {message}
//                 </div>
//               )}

//               <p className="text-center text-xl text-white font-extrabold mt-2">
//                 -- Opciones --
//               </p>

//               {/* Sección de Opciones: Regresar y Registrar */}
//               <div className="flex justify-between items-center mt-2 text-white">
//                 {/* 1. Botón Regresar a la Raíz */}
//                 <button
//                   type="button" 
//                   onClick={goToRoot}
//                   className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                   aria-label="Regresar a la página de inicio"
//                 >
//                   {/* Ícono de Regresar */}
//                   <span role="img" aria-label="back" className="w-4 h-4">↩️</span>
//                   Raíz
//                 </button>

//                 {/* 2. Enlace a Registrar */}
//                 <Link to="/register">
//                   <span className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer">
//                     Regístrate
//                   </span>
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default Login;








// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { FaArrowLeft } from "react-icons/fa";
// import { motion } from "framer-motion";
// import {
//   SET_LOGIN,
//   SET_NAME,
//   SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// // ❌ Eliminamos la importación del servicio de backend
// // import { loginUser, validateEmail } from "../../services/Services";
// import { validateEmail } from "../../services/Services"; // Mantengo solo validateEmail si lo necesitas
// import Loader from "../../Util/Loader";

// // 🌟 Importación de Firebase Auth
// import { auth } from "../../firebaseConfig"; // Asegúrate que la ruta a tu archivo sea correcta
// import { signInWithEmailAndPassword } from "firebase/auth";

// const initialState = {
//   email: "",
//   password: "",
// };

// // Configuración de la animación de entrada
// const formVariants = {
//   initial: {
//     y: "100vh",
//     opacity: 0,
//     scale: 0.8,
//   },
//   animate: {
//     y: 0,
//     opacity: 1,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 70,
//       delay: 0.3,
//       duration: 0.8,
//     },
//   },
// };

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setformData] = useState(initialState);
//   const { email, password } = formData;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setformData({ ...formData, [name]: value });
//   };

//   const goToRoot = () => {
//     navigate("/");
//   };

//   const login = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("Todos los campos son obligatorios");
//     }

//     if (!validateEmail(email)) {
//       return toast.error("Por favor, introduce un email válido");
//     }

//     setIsLoading(true);

//     try {
//       // 🌟 Lógica de Login con Firebase Authentication
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = userCredential.user;

//       // Adaptar el objeto de usuario de Firebase a la estructura de tu Redux
//       const userData = {
//         email: user.email,
//         uid: user.uid, // Usamos el ID de Firebase como identificador
//         // 🚨 Nota: El nombre no se obtiene directamente del login de Firebase.
//         // Lo establecemos como "User" o podrías obtenerlo de Firestore aquí.
//         name: "User",
//       };

//       await dispatch(SET_LOGIN(true));
//       await dispatch(SET_USER(userData));
//       await dispatch(SET_NAME(userData.name));

//       navigate("/acumuladoC");
//       toast.success("Inicio de sesión exitoso con Firebase");

//       // Limpieza
//       setformData(initialState);
//     } catch (error) {
//       // Manejo de errores de Firebase Auth
//       let errorMessage = "Fallo en el inicio de sesión. Verifica tus credenciales.";

//       // Opcional: Mostrar errores específicos de Firebase para mejor UX
//       if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
//         errorMessage = "Email o contraseña inválidos.";
//       } else if (error.code === "auth/too-many-requests") {
//         errorMessage = "Demasiados intentos. Inténtalo de nuevo más tarde.";
//       } else if (error.code) {
//         // Para otros errores no comunes
//         errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="min-h-screen flex items-center justify-center 
//             bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] 
//             bg-cover bg-center bg-no-repeat">
//         <motion.div
//           variants={formVariants}
//           initial="initial"
//           animate="animate"
//           className="w-full max-w-sm"
//         >
//           {/* Contenedor del Formulario (Estilos modernos) */}
//           <div className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
//             <form className="flex flex-col gap-4" onSubmit={login}>
//               <div className="flex gap-3 justify-center items-center mb-6">
//                 <p className="text-4xl text-white font-extrabold">Login</p>
//                 <SlLogin className="text-3xl text-emerald-400" />
//               </div>

//               {/* Input Email */}
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 name="email"
//                 placeholder="Email"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Input Password */}
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 name="password"
//                 placeholder="Password"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Botón de Submit */}
//               <button
//                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//                 type="submit"
//               >
//                 Enviar
//               </button>

//               <p className="text-center text-xl text-white font-extrabold mt-2">
//                 -- Opciones --
//               </p>

//               {/* Sección de Opciones: Regresar y Registrar */}
//               <div className="flex justify-between items-center mt-2 text-white">
//                 {/* 1. Botón Regresar a la Raíz */}
//                 <button
//                   type="button"
//                   onClick={goToRoot}
//                   className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                   aria-label="Regresar a la página de inicio"
//                 >
//                   <FaArrowLeft className="w-4 h-4" />
//                   Raíz
//                 </button>

//                 {/* 2. Enlace a Registrar */}
//                 <Link to="/register">
//                   <span className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer">
//                     Regístrate
//                   </span>
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default Login;



// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { FaArrowLeft, FaEye, FaEyeSlash, FaSignInAlt, FaSpinner } from "react-icons/fa"; // Nuevos iconos
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     SET_LOGIN,
//     SET_NAME,
//     SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// import { validateEmail } from "../../services/Services";
// import Loader from "../../Util/Loader";

// // 🌟 Importación de Firebase Auth
// import { auth } from "../../firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";

// const initialState = {
//     email: "",
//     password: "",
// };

// // ======================================================================
// // 🎨 VARIANTS DE ANIMACIÓN
// // ======================================================================

// // 1. Animación del contenedor principal (Zoom y Fade In)
// const containerVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { 
//         opacity: 1, 
//         scale: 1, 
//         transition: { 
//             type: "spring", 
//             stiffness: 50, 
//             delay: 0.2,
//             when: "beforeChildren" // Asegura que el formulario aparezca después
//         } 
//     },
// };

// // 2. Animación de los elementos del formulario (Staggered Fade In)
// const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//         y: 0, 
//         opacity: 1,
//         transition: { 
//             type: "tween", 
//             duration: 0.5 
//         }
//     },
// };


// const Login = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar password
//     const { email, password } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/");
//     };

//     const login = async (e) => {
//         e.preventDefault();

//         if (!email || !password) {
//             return toast.error("Todos los campos son obligatorios");
//         }

//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce un email válido");
//         }

//         setIsLoading(true);

//         try {
//             // 🌟 Lógica de Login con Firebase Authentication
//             const userCredential = await signInWithEmailAndPassword(
//                 auth,
//                 email,
//                 password
//             );

//             const user = userCredential.user;

//             // 🔑 PASO CRÍTICO: OBTENER Y GUARDAR EL ID TOKEN DE FIREBASE 🔑
//             const idToken = await user.getIdToken();
//             localStorage.setItem("token", idToken);
//             // -------------------------------------------------------------

//             const userData = {
//                 email: user.email,
//                 uid: user.uid, 
//                 name: user.displayName || "User", // Usamos displayName si existe, sino "User"
//             };

//             await dispatch(SET_LOGIN(true));
//             await dispatch(SET_USER(userData));
//             await dispatch(SET_NAME(userData.name));

//             navigate("/acumuladoC");
//             toast.success("Inicio de sesión exitoso con Firebase");

//             // Limpieza
//             setformData(initialState);
//         } catch (error) {
//             let errorMessage = "Fallo en el inicio de sesión. Verifica tus credenciales.";

//             if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
//                 errorMessage = "Email o contraseña inválidos.";
//             } else if (error.code === "auth/too-many-requests") {
//                 errorMessage = "Demasiados intentos. Inténtalo de nuevo más tarde.";
//             } else if (error.code) {
//                 errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
//             }
            
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 
//             bg-gray-900 
//             relative overflow-hidden
//             after:content-[''] after:absolute after:w-96 after:h-96 after:bg-emerald-500 after:rounded-full after:blur-[150px] after:top-0 after:left-0 after:animate-pulse-slow
//             before:content-[''] before:absolute before:w-80 before:h-80 before:bg-blue-500 after:rounded-full before:blur-[150px] before:bottom-0 before:right-0 before:animate-pulse-reverse-slow
//         ">
//             <AnimatePresence>
//                 {isLoading && <Loader />}
//             </AnimatePresence>
            
//             <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-sm z-10" // Aseguramos que esté sobre el fondo animado
//             >
//                 {/* Contenedor del Formulario (Estilo moderno, Neumórfico Oscuro) */}
//                 <motion.div
//                     className="p-10 rounded-3xl shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(40,40,40,0.5)] bg-gray-800 transition-all duration-500 hover:scale-[1.01]"
//                     transition={{ duration: 0.5 }}
//                 >
//                     <motion.form 
//                         className="flex flex-col gap-5" 
//                         onSubmit={login}
//                         initial="hidden"
//                         animate="visible"
//                         variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Animación escalonada
//                     >
//                         {/* Título y Icono */}
//                         <motion.div 
//                             className="flex gap-4 justify-center items-center mb-6"
//                             variants={itemVariants}
//                         >
//                             <p className="text-4xl text-white font-extrabold tracking-wide">Bienvenido</p>
//                             <SlLogin className="text-3xl text-emerald-400" />
//                         </motion.div>

//                         {/* Input Email */}
//                         <motion.div variants={itemVariants}>
//                             <input
//                                 type="email"
//                                 required
//                                 value={email}
//                                 name="email"
//                                 placeholder="Email"
//                                 className="w-full p-4 rounded-xl text-white bg-gray-700/50 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 shadow-inner"
//                                 onChange={handleInputChange}
//                             />
//                         </motion.div>

//                         {/* Input Password (con toggle de visibilidad) */}
//                         <motion.div className="relative" variants={itemVariants}>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 required
//                                 value={password}
//                                 name="password"
//                                 placeholder="Password"
//                                 className="w-full p-4 pr-12 rounded-xl text-white bg-gray-700/50 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 shadow-inner"
//                                 onChange={handleInputChange}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
//                                 aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//                             >
//                                 {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
//                             </button>
//                         </motion.div>

//                         {/* Botón de Submit */}
//                         <motion.button
//                             className="w-full flex items-center justify-center p-4 bg-emerald-500 rounded-xl mt-4 text-gray-900 font-bold text-lg shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400"
//                             type="submit"
//                             disabled={isLoading}
//                             variants={itemVariants}
//                             whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)" }}
//                             whileTap={{ scale: 0.98 }}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Iniciando...
//                                     </motion.span>
//                                 ) : (
//                                     <motion.span key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSignInAlt className="mr-2" />
//                                         Iniciar Sesión
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>

//                         {/* Sección de Opciones: Regresar y Registrar */}
//                         <motion.div className="flex justify-between items-center mt-3 text-white text-sm" variants={itemVariants}>
//                             {/* 1. Botón Regresar a la Raíz */}
//                             <motion.button
//                                 type="button"
//                                 onClick={goToRoot}
//                                 className="flex items-center gap-1 p-2 text-white bg-gray-700 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-[1.05]"
//                                 whileTap={{ scale: 0.95 }}
//                                 aria-label="Regresar a la página de inicio"
//                             >
//                                 <FaArrowLeft className="w-3 h-3" />
//                                 Raíz
//                             </motion.button>

//                             {/* 2. Enlace a Registrar */}
//                             <Link to="/register">
//                                 <motion.span 
//                                     className="text-emerald-400 font-semibold transition-colors duration-300 hover:text-blue-400 cursor-pointer border-b border-dashed border-emerald-400"
//                                     whileHover={{ color: "#3b82f6" }} // Cambio de color en hover
//                                 >
//                                     ¿No tienes cuenta? Regístrate
//                                 </motion.span>
//                             </Link>
//                         </motion.div>
//                     </motion.form>
//                 </motion.div>
//             </motion.div>
//         </div>
//     );
// };

// export default Login;



// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { FaArrowLeft, FaEye, FaEyeSlash, FaSignInAlt, FaSpinner } from "react-icons/fa"; // FaSpinner añadido
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     SET_LOGIN,
//     SET_NAME,
//     SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// import { validateEmail } from "../../services/Services"; // Asegúrate que esta ruta sea correcta
// import Loader from "../../Util/Loader"; // Asegúrate que esta ruta sea correcta

// // 🌟 Importación de Firebase Auth
// import { auth } from "../../firebaseConfig"; // Asegúrate que la ruta a tu archivo sea correcta
// import { signInWithEmailAndPassword } from "firebase/auth";

// const initialState = {
//     email: "",
//     password: "",
// };

// // ======================================================================
// // 🎨 VARIANTS DE ANIMACIÓN (Framer Motion)
// // ======================================================================

// // 1. Animación del contenedor principal (Zoom y Fade In)
// const containerVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { 
//         opacity: 1, 
//         scale: 1, 
//         transition: { 
//             type: "spring", 
//             stiffness: 50, 
//             delay: 0.2,
//             when: "beforeChildren" // Asegura que el formulario aparezca después
//         } 
//     },
// };

// // 2. Animación de los elementos del formulario (Staggered Fade In)
// const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//         y: 0, 
//         opacity: 1,
//         transition: { 
//             type: "tween", 
//             duration: 0.5 
//         }
//     },
// };

// const Login = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar password
//     const { email, password } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/");
//     };

//     const login = async (e) => {
//         e.preventDefault();

//         if (!email || !password) {
//             return toast.error("Todos los campos son obligatorios");
//         }

//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce un email válido");
//         }

//         setIsLoading(true);

//         try {
//             // 🌟 Lógica de Login con Firebase Authentication
//             const userCredential = await signInWithEmailAndPassword(
//                 auth,
//                 email,
//                 password
//             );

//             const user = userCredential.user;

//             // 🔑 PASO CRÍTICO: OBTENER Y GUARDAR EL ID TOKEN DE FIREBASE 🔑
//             const idToken = await user.getIdToken();
//             localStorage.setItem("token", idToken);
//             // -------------------------------------------------------------

//             // Adaptar el objeto de usuario de Firebase a la estructura de tu Redux
//             const userData = {
//                 email: user.email,
//                 uid: user.uid, 
//                 name: user.displayName || "Usuario", // Usamos displayName de Firebase si existe, sino "Usuario"
//                 photo: user.photoURL || "" // También puedes guardar la URL de la foto de perfil de Firebase
//             };

//             await dispatch(SET_LOGIN(true));
//             await dispatch(SET_USER(userData));
//             await dispatch(SET_NAME(userData.name)); // Establece el nombre en Redux

//             navigate("/acumuladoC"); // Redireccionar al usuario después del login
//             toast.success("¡Bienvenido! Inicio de sesión exitoso con Firebase");

//             // Limpieza del formulario
//             setformData(initialState);
//         } catch (error) {
//             let errorMessage = "Fallo en el inicio de sesión. Verifica tus credenciales.";

//             if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
//                 errorMessage = "Email o contraseña inválidos.";
//             } else if (error.code === "auth/too-many-requests") {
//                 errorMessage = "Demasiados intentos. Inténtalo de nuevo más tarde.";
//             } else if (error.code) {
//                 // Para otros errores no comunes de Firebase Auth
//                 errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
//             }
            
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 
//             bg-gray-900 
//             relative overflow-hidden
//             // Estos pseudo-elementos crean los brillos animados en el fondo
//             after:content-[''] after:absolute after:w-96 after:h-96 after:bg-emerald-500 after:rounded-full after:blur-[150px] after:top-0 after:left-0 after:animate-pulse-slow
//             before:content-[''] before:absolute before:w-80 before:h-80 before:bg-blue-500 before:rounded-full before:blur-[150px] before:bottom-0 before:right-0 before:animate-pulse-reverse-slow
//         ">
//             <AnimatePresence>
//                 {isLoading && <Loader />}
//             </AnimatePresence>
            
//             <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-sm z-10" // Aseguramos que esté sobre el fondo animado
//             >
//                 {/* Contenedor del Formulario (Estilo moderno, Neumórfico Oscuro) */}
//                 <motion.div
//                     className="p-10 rounded-3xl shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(40,40,40,0.5)] bg-gray-800 transition-all duration-500 hover:scale-[1.01]"
//                     transition={{ duration: 0.5 }}
//                 >
//                     <motion.form 
//                         className="flex flex-col gap-5" 
//                         onSubmit={login}
//                         initial="hidden"
//                         animate="visible"
//                         variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Animación escalonada para los elementos
//                     >
//                         {/* Título y Icono - Banner de Hortalizas (MODIFICADO) */}
//                         <motion.div 
//                             className="flex gap-4 justify-center items-center mb-6 p-4 rounded-xl relative overflow-hidden"
//                             style={{
//                                 // 🚨 REEMPLAZA ESTA URL CON LA IMAGEN DE TUS HORTALIZAS 🚨
//                                 backgroundImage: `url('https://res.cloudinary.com/ddoeotuge/image/upload/v1707929452/alcachofas_y_calabacines_z2eysu.jpg')`, // EJEMPLO: Imagen de alcachofas y calabacines
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center',
//                                 minHeight: '120px' // Asegura que el banner tenga altura
//                             }}
//                             variants={itemVariants}
//                         >
//                             {/* Overlay para asegurar la legibilidad del texto */}
//                             <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                                 <p className="text-4xl text-white font-extrabold tracking-wide text-center">
//                                     EUROFRUITS AGRO SL
//                                 </p>
//                             </div>
//                             <SlLogin className="absolute top-4 right-4 text-3xl text-emerald-400 z-10" /> {/* Icono sobre el banner */}
//                         </motion.div>

//                         {/* Input Email */}
//                         <motion.div variants={itemVariants}>
//                             <input
//                                 type="email"
//                                 required
//                                 value={email}
//                                 name="email"
//                                 placeholder="Email"
//                                 className="w-full p-4 rounded-xl text-white bg-gray-700/50 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 shadow-inner"
//                                 onChange={handleInputChange}
//                             />
//                         </motion.div>

//                         {/* Input Password (con toggle de visibilidad) */}
//                         <motion.div className="relative" variants={itemVariants}>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 required
//                                 value={password}
//                                 name="password"
//                                 placeholder="Password"
//                                 className="w-full p-4 pr-12 rounded-xl text-white bg-gray-700/50 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 shadow-inner"
//                                 onChange={handleInputChange}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
//                                 aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//                             >
//                                 {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
//                             </button>
//                         </motion.div>

//                         {/* Botón de Submit */}
//                         <motion.button
//                             className="w-full flex items-center justify-center p-4 bg-emerald-500 rounded-xl mt-4 text-gray-900 font-bold text-lg shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-xl disabled:bg-gray-600 disabled:text-gray-400"
//                             type="submit"
//                             disabled={isLoading}
//                             variants={itemVariants}
//                             whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)" }}
//                             whileTap={{ scale: 0.98 }}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Iniciando Sesión...
//                                     </motion.span>
//                                 ) : (
//                                     <motion.span key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSignInAlt className="mr-2" />
//                                         Iniciar Sesión
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>

//                         {/* Sección de Opciones: Regresar y Registrar */}
//                         <motion.div className="flex justify-between items-center mt-3 text-white text-sm" variants={itemVariants}>
//                             {/* 1. Botón Regresar a la Raíz */}
//                             <motion.button
//                                 type="button"
//                                 onClick={goToRoot}
//                                 className="flex items-center gap-1 p-2 text-white bg-gray-700 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-[1.05]"
//                                 whileTap={{ scale: 0.95 }}
//                                 aria-label="Regresar a la página de inicio"
//                             >
//                                 <FaArrowLeft className="w-3 h-3" />
//                                 Raíz
//                             </motion.button>

//                             {/* 2. Enlace a Registrar */}
//                             <Link to="/register">
//                                 <motion.span 
//                                     className="text-emerald-400 font-semibold transition-colors duration-300 hover:text-blue-400 cursor-pointer border-b border-dashed border-emerald-400"
//                                     whileHover={{ color: "#3b82f6" }} // Cambio de color en hover
//                                 >
//                                     ¿No tienes cuenta? Regístrate
//                                 </motion.span>
//                             </Link>
//                         </motion.div>
//                     </motion.form>
//                 </motion.div>
//             </motion.div>
//         </div>
//     );
// };

// export default Login;







