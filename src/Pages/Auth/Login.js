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
// // CORRECCIÓN: Se requiere importar 'getProfile' para obtener el nombre completo.
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
// // 1. VARIANTES DE FRAMER MOTION (AJUSTADAS PARA RAPIDEZ)
// // =================================================================

// const formVariants = {
//     initial: { y: 100, opacity: 0, scale: 0.95 },
//     animate: {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         transition: {
//             type: "spring",
//             // 🛑 AJUSTE DE RAPIDEZ: Aumentar stiffness y ajustar damping
//             stiffness: 150, // Más rígido = más rápido
//             damping: 20,    // Menos rebote
//             delay: 0.1, // 🛑 AJUSTE DE RAPIDEZ: Retardo reducido a 0.1s
//             when: "beforeChildren",
//             staggerChildren: 0.05, // Retardo entre hijos (inputs) también reducido
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
//             duration: 0.15, // 🛑 AJUSTE DE RAPIDEZ: Duración reducida de 0.3s a 0.15s
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

//             // 2. CORRECCIÓN CLAVE: Llama a getProfile para obtener el nombre real.
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
//                                  shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🛑 Importación CRÍTICA de Firebase Auth
import { getAuth } from "firebase/auth";

// Importaciones de Redux y Servicios
import {
    SET_LOGIN,
    SET_NAME,
    SET_USER,
    SET_TOKEN, // 🔑 Importar el nuevo reducer
} from "../../features/auth/authSlice/authSlice";
import { loginUser, validateEmail, getProfile } from "../../services/Services";

import { motion } from "framer-motion";

const initialState = {
    email: "",
    password: "",
};

// =================================================================
// 0. COMPONENTES AUTOSUFICIENTES (Iconos)
// ... (Iconos omitidos por brevedad, asumiendo que son idénticos a los que enviaste)
// =================================================================

const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const ArrowLeftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19-7-7 7-7"></path>
        <path d="M19 12H5"></path>
    </svg>
);

const TreeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13v9" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="5" className="text-emerald-500 fill-emerald-500" stroke="none"/>
        <path d="M10 7a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" fill="#0c4532" stroke="none"/>
    </svg>
);

// ... (Variantes de Framer Motion omitidas por brevedad)

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
        navigate("/");
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
            
            // 1. Llama a loginUser (Autenticación)
            await loginUser(userData);

            // 🛑 CORRECCIÓN CLAVE: Obtener y guardar el ID Token
            const auth = getAuth();
            const firebaseUser = auth.currentUser; 
            
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken(); 

                // 🔑 PASO CRÍTICO A: Guardar en Local Storage
                localStorage.setItem('userToken', idToken);
                
                // 🔑 PASO CRÍTICO B: Guardar en el estado de Redux
                await dispatch(SET_TOKEN(idToken));
            }
            
            // 2. Llama a getProfile (para obtener el nombre y el rol)
            const profileData = await getProfile(); 
            
            const userName = profileData.name || (profileData.email ? profileData.email.split('@')[0] : "Usuario");

            // 3. Despachar acciones
            await dispatch(SET_LOGIN(true));
            await dispatch(SET_USER(profileData || {})); 
            await dispatch(SET_NAME(userName));        

            setIsLoading(false);
            setformData(initialState);
            toast.success(`Bienvenido, ${userName}! Sesión iniciada.`);
            
            // 4. Redireccionar
            navigate("/acumuladoC"); 

        } catch (error) {
            setIsLoading(false);
            
            const errorMessage = error.response?.data?.message || error.message; 
            toast.error(
                errorMessage ||
                "Fallo en la autenticación. Verifique las credenciales."
            );
        }
    };

    // ... (El renderizado del componente HTML/Tailwind es el mismo)
    return (
        <>
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
                    // ... (propiedades de motion.div)
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
                            <motion.div>
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
                            <motion.div>
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