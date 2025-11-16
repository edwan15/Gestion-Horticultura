// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaRegIdCard, FaArrowLeft } from "react-icons/fa"; // Importamos FaArrowLeft
// import { GiFruitTree } from "react-icons/gi";
// import { motion } from "framer-motion"; // Importamos motion para la transición
// import { useDispatch } from "react-redux";
// import { registerUser, validateEmail } from "../../services/Services";
// import { SET_LOGIN, SET_NAME } from "../../features/auth/authSlice/authSlice";
// import Loader from "../../Util/Loader";

// const initialState = {
//   name: "",
//   email: "",
//   password: "",
//   password2: "",
// };

// // =========================================================
// // VARIANTE DE TRANSICIÓN PROFESIONAL (Diferente a Login)
// // Se desliza desde la izquierda con una ligera rotación (Spring effect)
// // =========================================================
// const formVariants = {
//   initial: {
//     x: "-100vw", // Comienza fuera de la pantalla a la izquierda
//     opacity: 0,
//     scale: 0.9,
//   },
//   animate: {
//     x: 0, // Se mueve a su posición final (centro)
//     opacity: 1,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100, // Hace que la transición sea suave pero rápida
//       damping: 15,
//       delay: 0.2, // Pequeño delay de 200ms
//       duration: 0.8,
//     },
//   },
// };

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setformData] = useState(initialState);
//   const { name, email, password, password2 } = formData;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setformData({ ...formData, [name]: value });
//   };

//   const goToRoot = () => {
//     navigate("/");
//   };

//   const register = async (e) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       return toast.error("Todos los campos son obligatorios");
//     }
//     if (password.length < 6) {
//       return toast.error("La contraseña debe tener al menos 6 caracteres");
//     }
//     if (!validateEmail(email)) {
//       return toast.error("Por favor, introduce un email válido");
//     }
//     if (password !== password2) {
//       return toast.error("Las contraseñas no coinciden");
//     }

//     const userData = {
//       name,
//       email,
//       password,
//     };
//     setIsLoading(true);

//     try {
//       const data = await registerUser(userData);
//       await dispatch(SET_LOGIN(true));
//       await dispatch(SET_NAME(data.name));
//       navigate("/panel");
//       setIsLoading(false);
//       setformData(initialState);
//       toast.success("Registro exitoso");
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//       toast.error(error.message || "Fallo en el registro. Inténtalo de nuevo.");
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       {isLoading && <Loader />}
      
//       {/* Contenedor Principal con fondo */}
//       <div className="h-screen flex items-center justify-center bg-[url('https://pablomoratinos.es/wp-content/uploads/2020/01/clean-login-wordpress-2048x1338.jpg')] bg-cover bg-center bg-no-repeat">
        
//         {/* Contenedor Animado con framer-motion */}
//         <motion.section
//           variants={formVariants}
//           initial="initial"
//           animate="animate"
//           className="w-full max-w-sm"
//         >
//           {/* Contenedor del Formulario (Estilos modernos) */}
//           <div
//             className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]"
//           >
//             <form className="flex flex-col gap-4" onSubmit={register}>
              
//               <div className="flex gap-3 justify-center items-center mb-6">
//                 <p className="text-4xl text-white font-extrabold">
//                   Registro
//                 </p>
//                 <FaRegIdCard className="text-3xl text-emerald-400" />
//               </div>

//               {/* Input Nombre con Estilos Modernos */}
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={name}
//                 placeholder="Nombre"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />
              
//               {/* Input Email con Estilos Modernos */}
//               <input
//                 type="email" // Aseguramos que sea tipo email
//                 name="email"
//                 required
//                 value={email}
//                 placeholder="Email"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />
              
//               {/* Input Password con Estilos Modernos */}
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 value={password}
//                 placeholder="Contraseña"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />
              
//               {/* Input Confirm-Password con Estilos Modernos */}
//               <input
//                 type="password"
//                 name="password2"
//                 required
//                 value={password2}
//                 placeholder="Confirmar Contraseña"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />
              
//               {/* Botón de Submit con Efecto Hover */}
//               <button
//                 type="submit"
//                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//               >
//                 Registrar
//               </button>

//               <p className="text-center text-xl text-white font-extrabold mt-2">-- Opciones --</p>

//               <div className="flex justify-between items-center mt-2 text-white">
                
//                 {/* 1. Botón Regresar a la Raíz (DENTRO DEL CUADRO) */}
//                 <button
//                     type="button" 
//                     onClick={goToRoot}
//                     className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                     aria-label="Regresar a la página de inicio"
//                 >
//                     <FaArrowLeft className="w-4 h-4" />
//                     Raíz
//                 </button>

//                 {/* 2. Enlace a Login (Estilo moderno) */}
//                 <div className="flex items-center gap-1">
//                     <p className="text-sm">¿Ya tienes cuenta?</p>
//                     <Link to="/login">
//                         <span 
//                             className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer"
//                         >
//                             Login
//                         </span>
//                     </Link>
//                 </div>
//               </div>
//             </form>

//             <div className="flex justify-center mt-6 gap-2 text-white">
//                 <p className="font-extrabold text-2xl">AGRODOLORES</p>
//                 <h1 className="text-2xl font-bold">
//                     <GiFruitTree className="text-emerald-400" />
//                 </h1>
//             </div>
//           </div>
//         </motion.section>
//       </div>
//     </>
//   );
// };

// export default Register;










// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaRegIdCard, FaArrowLeft } from "react-icons/fa";
// import { GiFruitTree } from "react-icons/gi";
// import { motion } from "framer-motion";
// import { useDispatch } from "react-redux";

// // 🛑 Mantener validateEmail si es una función de utilidades local
// import { validateEmail } from "../../services/Services"; 
// import { SET_LOGIN, SET_NAME, SET_USER } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // 🌟 Importaciones de Firebase Auth y Firestore
// import { auth, db } from "../../firebaseConfig"; // Asegúrate que la ruta a tu archivo sea correcta
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore"; // Importamos doc y setDoc para Firestore

// const initialState = {
//     name: "",
//     email: "",
//     password: "",
//     password2: "",
// };

// // ... [formVariants sin cambios]

// const formVariants = {
//     initial: {
//         x: "-100vw",
//         opacity: 0,
//         scale: 0.9,
//     },
//     animate: {
//         x: 0,
//         opacity: 1,
//         scale: 1,
//         transition: {
//             type: "spring",
//             stiffness: 100,
//             damping: 15,
//             delay: 0.2,
//             duration: 0.8,
//         },
//     },
// };

// const Register = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const { name, email, password, password2 } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/");
//     };

//     const register = async (e) => {
//         e.preventDefault();

//         // 📝 Validaciones
//         if (!name || !email || !password || !password2) {
//             return toast.error("Todos los campos son obligatorios");
//         }
//         if (password.length < 6) {
//             return toast.error("La contraseña debe tener al menos 6 caracteres");
//         }
//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce un email válido");
//         }
//         if (password !== password2) {
//             return toast.error("Las contraseñas no coinciden");
//         }

//         setIsLoading(true);

//         try {
//             // 1. 🔑 Crear usuario con Email y Contraseña en Firebase Auth
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 email,
//                 password
//             );
//             const user = userCredential.user;

//             // 2. 📝 Guardar el nombre de usuario en Firebase Auth (displayName)
//             // Esto es crucial para que el Header muestre el nombre.
//             await updateProfile(user, {
//                 displayName: name,
//             });

//             // 3. 💾 Guardar perfil y ROL en Firestore
//             // Usamos el UID de Firebase como ID del documento para asegurar unicidad
//             const userDocRef = doc(db, "users", user.uid);
//             await setDoc(userDocRef, {
//                 uid: user.uid,
//                 name: name,
//                 email: email,
//                 // Por defecto, asignamos el rol 'subscriber'.
//                 role: "subscriber", 
//                 createdAt: new Date(),
//             });

//             // 4. Actualizar el estado de Redux
//             const userData = {
//                 email: user.email,
//                 uid: user.uid,
//                 name: user.displayName,
//                 role: "subscriber", // Establecemos el rol inicial
//             };

//             await dispatch(SET_LOGIN(true));
//             await dispatch(SET_USER(userData)); // Almacenar más datos del usuario
//             await dispatch(SET_NAME(userData.name));
            
//             // 5. Redirigir y notificar
//             navigate("/panel");
//             toast.success("Registro y sesión iniciada exitosamente con Firebase");
//             setformData(initialState);

//         } catch (error) {
//             // 6. Manejo de errores de Firebase Auth
//             let errorMessage = "Fallo en el registro. Inténtalo de nuevo.";

//             if (error.code === "auth/email-already-in-use") {
//                 errorMessage = "El email ya está registrado.";
//             } else if (error.code === "auth/weak-password") {
//                 errorMessage = "La contraseña debe tener al menos 6 caracteres.";
//             } else if (error.code) {
//                 // Para otros errores, intentamos limpiar el código para el usuario
//                 errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
//             }
            
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <ToastContainer />
//             {isLoading && <Loader />}
            
//             {/* Contenedor Principal con fondo */}
//             <div className="h-screen flex items-center justify-center bg-[url('https://pablomoratinos.es/wp-content/uploads/2020/01/clean-login-wordpress-2048x1338.jpg')] bg-cover bg-center bg-no-repeat">
                
//                 {/* Contenedor Animado con framer-motion */}
//                 <motion.section
//                     variants={formVariants}
//                     initial="initial"
//                     animate="animate"
//                     className="w-full max-w-sm"
//                 >
//                     {/* Contenedor del Formulario (Estilos modernos) */}
//                     <div
//                         className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]"
//                     >
//                         <form className="flex flex-col gap-4" onSubmit={register}>
                            
//                             <div className="flex gap-3 justify-center items-center mb-6">
//                                 <p className="text-4xl text-white font-extrabold">
//                                     Registro
//                                 </p>
//                                 <FaRegIdCard className="text-3xl text-emerald-400" />
//                             </div>

//                             {/* Input Nombre con Estilos Modernos */}
//                             <input
//                                 type="text"
//                                 name="name"
//                                 required
//                                 value={name}
//                                 placeholder="Nombre"
//                                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                                 onChange={handleInputChange}
//                             />
                            
//                             {/* Input Email con Estilos Modernos */}
//                             <input
//                                 type="email"
//                                 name="email"
//                                 required
//                                 value={email}
//                                 placeholder="Email"
//                                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                                 onChange={handleInputChange}
//                             />
                            
//                             {/* Input Password con Estilos Modernos */}
//                             <input
//                                 type="password"
//                                 name="password"
//                                 required
//                                 value={password}
//                                 placeholder="Contraseña"
//                                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                                 onChange={handleInputChange}
//                             />
                            
//                             {/* Input Confirm-Password con Estilos Modernos */}
//                             <input
//                                 type="password"
//                                 name="password2"
//                                 required
//                                 value={password2}
//                                 placeholder="Confirmar Contraseña"
//                                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                                 onChange={handleInputChange}
//                             />
                            
//                             {/* Botón de Submit con Efecto Hover */}
//                             <button
//                                 type="submit"
//                                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//                             >
//                                 Registrar
//                             </button>

//                             <p className="text-center text-xl text-white font-extrabold mt-2">-- Opciones --</p>

//                             <div className="flex justify-between items-center mt-2 text-white">
                                
//                                 {/* 1. Botón Regresar a la Raíz (DENTRO DEL CUADRO) */}
//                                 <button
//                                     type="button" 
//                                     onClick={goToRoot}
//                                     className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                                     aria-label="Regresar a la página de inicio"
//                                 >
//                                     <FaArrowLeft className="w-4 h-4" />
//                                     Raíz
//                                 </button>

//                                 {/* 2. Enlace a Login (Estilo moderno) */}
//                                 <div className="flex items-center gap-1">
//                                     <p className="text-sm">¿Ya tienes cuenta?</p>
//                                     <Link to="/login">
//                                         <span 
//                                             className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer"
//                                         >
//                                             Login
//                                         </span>
//                                     </Link>
//                                 </div>
//                             </div>
//                         </form>

//                         <div className="flex justify-center mt-6 gap-2 text-white">
//                             <p className="font-extrabold text-2xl">AGRODOLORES</p>
//                             <h1 className="text-2xl font-bold">
//                                 <GiFruitTree className="text-emerald-400" />
//                             </h1>
//                         </div>
//                     </div>
//                 </motion.section>
//             </div>
//         </>
//     );
// };

// export default Register;






// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaRegIdCard, FaArrowLeft } from "react-icons/fa";
// import { GiFruitTree } from "react-icons/gi";
// import { motion } from "framer-motion";
// import { useDispatch } from "react-redux";

// // 🛑 Mantener validateEmail si es una función de utilidades local
// import { validateEmail } from "../../services/Services";
// import { SET_LOGIN, SET_NAME, SET_USER } from "../../features/auth/authSlice/authSlice";
// import Loader from "../../Util/Loader";

// // 🌟 Importaciones de Firebase Auth y Firestore
// import { auth, db } from "../../firebaseConfig"; // Asegúrate que la ruta a tu archivo sea correcta
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore"; // Importamos doc y setDoc para Firestore

// const initialState = {
//     name: "",
//     email: "",
//     password: "",
//     password2: "",
// };

// // =================================================================
// // 1. VARIANTES DE FRAMER MOTION (Más fluidas y profesionales)
// // =================================================================

// // Variante para la entrada principal del formulario (efecto de ascenso)
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
//             delay: 0.3, // Retardo para que el fondo cargue primero
//             when: "beforeChildren",
//             staggerChildren: 0.1,
//         },
//     },
// };

// // Variante para los inputs (animación de entrada lateral)
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


// const Register = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setformData] = useState(initialState);
//     const { name, email, password, password2 } = formData;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setformData({ ...formData, [name]: value });
//     };

//     const goToRoot = () => {
//         navigate("/");
//     };

//     const register = async (e) => {
//         e.preventDefault();

//         // 📝 Validaciones
//         if (!name || !email || !password || !password2) {
//             return toast.error("Todos los campos son obligatorios");
//         }
//         if (password.length < 6) {
//             return toast.error("La contraseña debe tener al menos 6 caracteres");
//         }
//         if (!validateEmail(email)) {
//             return toast.error("Por favor, introduce un email válido");
//         }
//         if (password !== password2) {
//             return toast.error("Las contraseñas no coinciden");
//         }

//         setIsLoading(true);

//         try {
//             // 1. 🔑 Crear usuario con Email y Contraseña en Firebase Auth
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 email,
//                 password
//             );
//             const user = userCredential.user;

//             // 2. 📝 Guardar el nombre de usuario en Firebase Auth (displayName)
//             await updateProfile(user, {
//                 displayName: name,
//             });

//             // 3. 💾 Guardar perfil y ROL en Firestore
//             const userDocRef = doc(db, "users", user.uid);
//             await setDoc(userDocRef, {
//                 uid: user.uid,
//                 name: name,
//                 email: email,
//                 role: "subscriber",
//                 createdAt: new Date(),
//             });

//             // 4. Actualizar el estado de Redux
//             const userData = {
//                 email: user.email,
//                 uid: user.uid,
//                 name: user.displayName,
//                 role: "subscriber",
//             };

//             await dispatch(SET_LOGIN(true));
//             await dispatch(SET_USER(userData));
//             await dispatch(SET_NAME(userData.name));
            
//             // 5. Redirigir y notificar
//             navigate("/panel");
//             toast.success("Registro y sesión iniciada exitosamente.");
//             setformData(initialState);

//         } catch (error) {
//             // 6. Manejo de errores de Firebase Auth
//             let errorMessage = "Fallo en el registro. Inténtalo de nuevo.";

//             if (error.code === "auth/email-already-in-use") {
//                 errorMessage = "El email ya está registrado.";
//             } else if (error.code === "auth/weak-password") {
//                 errorMessage = "La contraseña debe tener al menos 6 caracteres.";
//             } else if (error.code) {
//                 errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
//             }
            
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <ToastContainer />
//             {isLoading && <Loader />}
            
//             {/* Contenedor Principal con fondo y capa oscura */}
//             <div className="h-screen flex items-center justify-center relative overflow-hidden">
//                 {/* Fondo fijo de la granja (URL original mantenida) */}
//                 <div 
//                     className="absolute inset-0 bg-[url('https://pablomoratinos.es/wp-content/uploads/2020/01/clean-login-wordpress-2048x1338.jpg')] bg-cover bg-center bg-no-repeat"
//                     aria-hidden="true"
//                 ></div>

//                 {/* Capa de Oscurecimiento Futurista (Overlay más oscuro y con blur) */}
//                 <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" aria-hidden="true"></div>
                
//                 {/* Contenedor Animado con framer-motion y centrado (Responsive y más ancho) */}
//                 <motion.section
//                     variants={formVariants}
//                     initial="initial"
//                     animate="animate"
//                     // Responsive y más ancho: w-90% en móvil, max-w-md en tablets, max-w-lg en escritorio.
//                     className="w-[90%] max-w-md lg:max-w-lg relative z-10" 
//                 >
//                     {/* Contenedor del Formulario (Dark Glassmorphism Futurista con NEON GLOW) */}
//                     <div
//                         className="p-10 border border-emerald-400/20 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl transition-all duration-700 
//                                   shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
//                     >
//                         <form className="flex flex-col gap-5" onSubmit={register}>
                            
//                             {/* Título (Futurista) */}
//                             <div className="flex gap-3 justify-center items-center mb-6">
//                                 <motion.p 
//                                     className="text-4xl text-white font-extrabold tracking-widest uppercase drop-shadow-md"
//                                     initial={{ scale: 0.8 }}
//                                     animate={{ scale: 1 }}
//                                     transition={{ type: "spring", stiffness: 100 }}
//                                 >
//                                     Acceso Único
//                                 </motion.p>
//                                 <FaRegIdCard className="text-3xl text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.8)]" />
//                             </div>

//                             {/* Inputs con Animación Escalonada */}
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     required
//                                     value={name}
//                                     placeholder="Nombre de Usuario (ID)"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>
                            
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     required
//                                     value={email}
//                                     placeholder="Credencial Electrónica"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>
                            
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     required
//                                     value={password}
//                                     placeholder="Clave de Acceso"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>
                            
//                             <motion.div variants={inputVariants}>
//                                 <input
//                                     type="password"
//                                     name="password2"
//                                     required
//                                     value={password2}
//                                     placeholder="Verificar Clave"
//                                     className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
//                                     onChange={handleInputChange}
//                                 />
//                             </motion.div>
                            
//                             {/* Botón de Submit (Estilo Neón con Pulse en Hover) */}
//                             <motion.button
//                                 type="submit"
//                                 whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
//                                 whileTap={{ scale: 0.98 }}
//                                 className="w-full p-4 bg-blue-600 rounded-xl mt-4 text-white font-extrabold text-xl shadow-lg border-2 border-transparent 
//                                            transition-all duration-300 hover:bg-blue-700 hover:border-blue-400 
//                                            hover:shadow-blue-500/50 hover:animate-pulse"
//                             >
//                                 {isLoading ? "Inicializando..." : "Crear Identidad"}
//                             </motion.button>

//                             <p className="text-center text-md text-white/60 font-semibold mt-2">-- Protocolos de Acceso --</p>

//                             <div className="flex justify-between items-center text-white">
                                
//                                 {/* 1. Botón Regresar a la Raíz (Estilo Comando) */}
//                                 <motion.button
//                                     type="button" 
//                                     onClick={goToRoot}
//                                     whileHover={{ x: -5, scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-700/50 rounded-full shadow-md transition-all duration-300 hover:bg-gray-600/80 border border-gray-600/50"
//                                     aria-label="Regresar a la página de inicio"
//                                 >
//                                     <FaArrowLeft className="w-4 h-4 text-emerald-400" />
//                                     Inicio
//                                 </motion.button>

//                                 {/* 2. Enlace a Login (Destacado Neón) */}
//                                 <div className="flex items-center gap-1">
//                                     <p className="text-sm text-white/70">¿ID detectada?</p>
//                                     <Link to="/login">
//                                         <motion.span 
//                                             whileHover={{ scale: 1.1, textShadow: "0px 0px 10px rgba(52, 211, 163, 0.8)" }}
//                                             className="text-lg text-emerald-400 font-extrabold p-1 transition-colors duration-300 hover:text-emerald-300 cursor-pointer"
//                                         >
//                                             Login
//                                         </motion.span>
//                                     </Link>
//                                 </div>
//                             </div>
//                         </form>

//                         {/* Logo Footer (Estilo Marca Futurista) */}
//                         <div className="flex justify-center mt-8 gap-2 items-center text-white/80">
//                             <p className="font-extrabold text-xl tracking-[0.2em] text-gray-200">HORTICULTURA</p>
//                             <h1 className="text-3xl font-bold">
//                                 <GiFruitTree className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.5)]" />
//                             </h1>
//                         </div>
//                     </div>
//                 </motion.section>
//             </div>
//         </>
//     );
// };

// export default Register;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegIdCard, FaArrowLeft } from "react-icons/fa";
import { GiFruitTree } from "react-icons/gi";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

import { validateEmail } from "../../services/Services";
import { SET_LOGIN, SET_NAME, SET_USER } from "../../features/auth/authSlice/authSlice";
import Loader from "../../Util/Loader";

import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const initialState = {
    name: "",
    email: "",
    password: "",
    password2: "",
};

// =================================================================
// 1. VARIANTES DE FRAMER MOTION (AJUSTADAS PARA RAPIDEZ)
// =================================================================

// Variante para la entrada principal del formulario
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

// Variante para los inputs (animación de entrada lateral)
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


const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(initialState);
    const { name, email, password, password2 } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    const goToRoot = () => {
        navigate("/");
    };

    const register = async (e) => {
        e.preventDefault();

        // 📝 Validaciones
        if (!name || !email || !password || !password2) {
            return toast.error("Todos los campos son obligatorios");
        }
        if (password.length < 6) {
            return toast.error("La contraseña debe tener al menos 6 caracteres");
        }
        if (!validateEmail(email)) {
            return toast.error("Por favor, introduce un email válido");
        }
        if (password !== password2) {
            return toast.error("Las contraseñas no coinciden");
        }

        setIsLoading(true);

        try {
            // 1. 🔑 Crear usuario con Email y Contraseña en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // 2. 📝 Guardar el nombre de usuario en Firebase Auth (displayName)
            await updateProfile(user, {
                displayName: name,
            });

            // 3. 💾 Guardar perfil y ROL en Firestore
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                name: name,
                email: email,
                role: "subscriber",
                createdAt: new Date(),
            });

            // 4. Actualizar el estado de Redux
            const userData = {
                email: user.email,
                uid: user.uid,
                name: user.displayName,
                role: "subscriber",
            };

            await dispatch(SET_LOGIN(true));
            await dispatch(SET_USER(userData));
            await dispatch(SET_NAME(userData.name));
            
            // 5. Redirigir y notificar
            navigate("/panel");
            toast.success("Registro y sesión iniciada exitosamente.");
            setformData(initialState);

        } catch (error) {
            // 6. Manejo de errores de Firebase Auth
            let errorMessage = "Fallo en el registro. Inténtalo de nuevo.";

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "El email ya está registrado.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "La contraseña debe tener al menos 6 caracteres.";
            } else if (error.code) {
                errorMessage = `Error de Firebase: ${error.code.split('/')[1].replace(/-/g, ' ')}`;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            {isLoading && <Loader />}
            
            {/* Contenedor Principal con fondo y capa oscura */}
            <div className="h-screen flex items-center justify-center relative overflow-hidden">
                {/* Fondo fijo de la granja (URL original mantenida) */}
                <div 
                    className="absolute inset-0 bg-[url('https://pablomoratinos.es/wp-content/uploads/2020/01/clean-login-wordpress-2048x1338.jpg')] bg-cover bg-center bg-no-repeat"
                    aria-hidden="true"
                ></div>

                {/* Capa de Oscurecimiento Futurista (Overlay más oscuro y con blur) */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" aria-hidden="true"></div>
                
                {/* Contenedor Animado con framer-motion y centrado (Responsive y más ancho) */}
                <motion.section
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    // Responsive y más ancho: w-90% en móvil, max-w-md en tablets, max-w-lg en escritorio.
                    className="w-[90%] max-w-md lg:max-w-lg relative z-10" 
                >
                    {/* Contenedor del Formulario (Dark Glassmorphism Futurista con NEON GLOW) */}
                    <div
                        className="p-10 border border-emerald-400/20 rounded-3xl shadow-2xl bg-black/20 backdrop-blur-xl transition-all duration-700 
                             shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_70px_rgba(52,211,163,0.8)]"
                    >
                        <form className="flex flex-col gap-5" onSubmit={register}>
                            
                            {/* Título (Futurista) */}
                            <div className="flex gap-3 justify-center items-center mb-6">
                                <motion.p 
                                    className="text-4xl text-white font-extrabold tracking-widest uppercase drop-shadow-md"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    Acceso Único
                                </motion.p>
                                <FaRegIdCard className="text-3xl text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.8)]" />
                            </div>

                            {/* Inputs con Animación Escalonada */}
                            <motion.div variants={inputVariants}>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={name}
                                    placeholder="Nombre de Usuario (ID)"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            
                            <motion.div variants={inputVariants}>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={email}
                                    placeholder="Credencial Electrónica"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            
                            <motion.div variants={inputVariants}>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={password}
                                    placeholder="Clave de Acceso"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            
                            <motion.div variants={inputVariants}>
                                <input
                                    type="password"
                                    name="password2"
                                    required
                                    value={password2}
                                    placeholder="Verificar Clave"
                                    className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-inner shadow-black/50"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            
                            {/* Botón de Submit (Estilo Neón con Pulse en Hover) */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-4 bg-blue-600 rounded-xl mt-4 text-white font-extrabold text-xl shadow-lg border-2 border-transparent 
                                        transition-all duration-300 hover:bg-blue-700 hover:border-blue-400 
                                        hover:shadow-blue-500/50 hover:animate-pulse"
                            >
                                {isLoading ? "Inicializando..." : "Crear Identidad"}
                            </motion.button>

                            <p className="text-center text-md text-white/60 font-semibold mt-2">-- Protocolos de Acceso --</p>

                            <div className="flex justify-between items-center text-white">
                                
                                {/* 1. Botón Regresar a la Raíz (Estilo Comando) */}
                                <motion.button
                                    type="button" 
                                    onClick={goToRoot}
                                    whileHover={{ x: -5, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 bg-gray-700/50 rounded-full shadow-md transition-all duration-300 hover:bg-gray-600/80 border border-gray-600/50"
                                    aria-label="Regresar a la página de inicio"
                                >
                                    <FaArrowLeft className="w-4 h-4 text-emerald-400" />
                                    Inicio
                                </motion.button>

                                {/* 2. Enlace a Login (Destacado Neón) */}
                                <div className="flex items-center gap-1">
                                    <p className="text-sm text-white/70">¿ID detectada?</p>
                                    <Link to="/login">
                                        <motion.span 
                                            whileHover={{ scale: 1.1, textShadow: "0px 0px 10px rgba(52, 211, 163, 0.8)" }}
                                            className="text-lg text-emerald-400 font-extrabold p-1 transition-colors duration-300 hover:text-emerald-300 cursor-pointer"
                                        >
                                            Login
                                        </motion.span>
                                    </Link>
                                </div>
                            </div>
                        </form>

                        {/* Logo Footer (Estilo Marca Futurista) */}
                        <div className="flex justify-center mt-8 gap-2 items-center text-white/80">
                            <p className="font-extrabold text-xl tracking-[0.2em] text-gray-200">HORTICULTURA</p>
                            <h1 className="text-3xl font-bold">
                                <GiFruitTree className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,163,0.5)]" />
                            </h1>
                        </div>
                    </div>
                </motion.section>
            </div>
        </>
    );
};

export default Register;