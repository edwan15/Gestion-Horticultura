// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { selectName, SET_LOGIN } from "../../features/auth/authSlice/authSlice";
// import { logoutUser } from "../../services/Services";
// import { motion } from "framer-motion";

// const Header = () => {
//   const dispath = useDispatch();
//   const navigate = useNavigate();
//   // El selector de nombre puede devolver undefined si el estado no está listo
//   const name = useSelector(selectName);

//   const logout = async () => {
//     await logoutUser();
//     await dispath(SET_LOGIN(false));
//     navigate("/");
//   };

//   const panel = async () => {
//     navigate("/acumuladoC");
//   };

//   return (

//     <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 sm:py-6 border-b border-gray-200 shadow-sm">
      
    
//       <div className="w-full text-center sm:text-left mb-3 sm:mb-0">
//         {/* Usamos un tamaño de fuente que escala mejor: 'text-lg' para móvil, 'sm:text-xl' para tablet y 'lg:text-2xl' para desktop */}
//         <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl font-normal">
//           Welcome, 
//           {/* El nombre del usuario siempre está en negrita y es el foco principal */}
//           <span className="font-bold text-red-600 ml-1">{name || "Invitado"}</span>
//         </p>
//       </div>

//       {/* Contenedor de Botones 
//         En móvil, usa 'w-full' para que los botones se estiren o se organicen bien.
//         'space-x-2' separa los botones horizontalmente, y 'justify-center' los centra en móvil.
//         En 'sm' (tablet+), se alinea a la derecha.
//       */}
//       <div className="w-full sm:w-auto flex justify-center sm:justify-end items-center">
//         <div className="flex space-x-3 sm:space-x-4">
          
//           {/* Botón "Panel" */}
//           <motion.button
//             whileHover={{ scale: 1.05 }} 
//             whileTap={{ scale: 0.95 }} 
//             className="
//               px-4 py-2 
//               rounded-lg
//               bg-blue-600
//               hover:bg-blue-700
//               text-white 
//               font-semibold 
//               text-sm sm:text-base
//               shadow-md transition-all duration-200
//               // Añadido 'w-full sm:w-auto' para mejor manejo del ancho en móvil (opcional, si quieres que se estiren)
//             "
//             onClick={panel}
//           >
//             Panel
//           </motion.button>

//           {/* Botón "Logout" */}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="
//               px-4 py-2
//               rounded-lg
//               bg-red-600
//               hover:bg-red-700
//               text-white 
//               font-semibold 
//               text-sm sm:text-base
//               shadow-md transition-all duration-200
//               // Añadido 'w-full sm:w-auto'
//             "
//             onClick={logout}
//           >
//             Logout
//           </motion.button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// // Ajusta la ruta de importación de tu slice si es diferente
// import { selectName, SET_LOGIN } from "../../features/auth/authSlice/authSlice"; 
// import { logoutUser } from "../../services/Services";
// import { motion } from "framer-motion";

// // Importamos los iconos necesarios
// import { MdOutlineDashboard, MdLogout, MdMenu } from 'react-icons/md'; 

// // El componente ahora acepta 'onMenuToggle' para abrir/cerrar el menú móvil
// const Header = ({ onMenuToggle }) => {
//     const dispath = useDispatch();
//     const navigate = useNavigate();
//     const name = useSelector(selectName);

//     const logout = async () => {
//         // Lógica de logout (usando tu lógica existente)
//         await logoutUser();
//         await dispath(SET_LOGIN(false));
//         navigate("/");
//     };

//     const panel = async () => {
//         // Lógica de navegación al panel principal
//         navigate("/acumuladoC");
//     };

//     return (
//         // Barra Superior: Estilo limpio (fondo blanco, altura fija, sombra sutil)
//         <header className="flex justify-between items-center h-16 px-4 sm:px-6 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
            
//             {/* 1. SECCIÓN IZQUIERDA (Botón Menú Móvil / Saludo Escritorio) */}
//             <div className="flex items-center gap-4">
                
//                 {/* BOTÓN DE MENÚ (Solo visible en Móvil) */}
//                 <div className="sm:hidden">
//                     <MdMenu 
//                         className="text-2xl text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
//                         onClick={onMenuToggle} // Función para abrir el SideBar
//                     />
//                 </div>
                
//                 {/* SALUDO DE USUARIO (Visible en todas partes, con ajuste de clase para centrado) */}
//                 <p className="text-gray-600 text-sm sm:text-base">
//                     Bienvenido, 
//                     {/* Color Verde Corporativo para el nombre */}
//                     <span className="font-bold text-green-700 ml-1">{name || "Invitado"}</span>
//                 </p>
//             </div>
            

//             {/* 2. SECCIÓN DERECHA (Botones de Acción) */}
//             <div className="flex items-center space-x-3">
                
//                 {/* Botón "Panel" (Acción principal - Color Verde) */}
//                 <motion.button
//                     whileHover={{ scale: 1.05 }} 
//                     whileTap={{ scale: 0.95 }} 
//                     className="
//                         flex items-center gap-2 
//                         px-3 py-2 
//                         rounded-lg
//                         bg-green-600
//                         hover:bg-green-700
//                         text-white 
//                         font-medium 
//                         text-sm 
//                         transition-all duration-200
//                     "
//                     onClick={panel}
//                 >
//                     <MdOutlineDashboard className="text-lg" />
//                     <span className="hidden sm:inline">Panel</span> 
//                 </motion.button>

//                 {/* Botón "Logout" (Acción secundaria/Advertencia - Rojo con borde) */}
//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="
//                         flex items-center gap-2
//                         px-3 py-2
//                         rounded-lg
//                         border border-red-500
//                         text-red-500 
//                         font-medium 
//                         text-sm 
//                         hover:bg-red-500 hover:text-white transition-colors duration-200
//                     "
//                     onClick={logout}
//                 >
//                     <MdLogout className="text-lg" />
//                     <span className="hidden sm:inline">Logout</span>
//                 </motion.button>
//             </div>
//         </header>
//     );
// };

// export default Header;


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { 
//     selectName, 
//     SET_LOGIN,
//     SET_USER // Importamos para limpiar el objeto completo
// } from "../../features/auth/authSlice/authSlice"; 

// // 🌟 Importaciones de Firebase Auth
// import { signOut } from 'firebase/auth';
// import { auth } from "../../firebaseConfig"; // RUTA CORRECTA A TU ARCHIVO DE CONFIGURACIÓN
// import { motion } from "framer-motion";

// // Importaciones de Íconos
// import { MdOutlineDashboard, MdLogout, MdMenu } from 'react-icons/md'; 
// import { toast } from "react-toastify"; 

// // Se recomienda envolver el Header en un <nav> en lugar de <header> si es solo una barra de navegación
// const Header = ({ onMenuToggle }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     // 🌟 Ahora selectName debería devolver el nombre correcto
//     const name = useSelector(selectName); 

//     const logout = async () => {
//         try {
//             await signOut(auth);
            
//             // Limpiar estado de Redux completamente
//             await dispatch(SET_LOGIN(false));
//             await dispatch(SET_USER({})); 
            
//             toast.success("Sesión cerrada exitosamente.");
//             navigate("/login"); 
            
//         } catch (error) {
//             console.error("Error al cerrar sesión:", error.message);
//             toast.error("Fallo al cerrar sesión.");
//         }
//     };

//     const panel = () => {
//         navigate("/acumuladoC");
//     };

//     return (
//         // 🚨 Estructura de barra superior (h-16 es el estándar de altura, z-index alto para estar encima de todo)
//         <header className="flex justify-between items-center h-16 px-4 sm:px-6 bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
            
//             {/* 1. SECCIÓN IZQUIERDA: Botón Menú (Móvil) + Saludo */}
//             <div className="flex items-center gap-4">
                
//                 {/* BOTÓN HAMBURGUESA (Solo visible en pantallas pequeñas) */}
//                 <div className="sm:hidden">
//                     <MdMenu 
//                         className="text-3xl text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
//                         onClick={onMenuToggle} 
//                     />
//                 </div>
                
//                 {/* SALUDO DE USUARIO (Diseño más elegante) */}
//                 <p className="text-gray-700 text-base sm:text-lg font-light">
//                     Bienvenido, 
//                     {/* El nombre con un color destacado y font-bold */}
//                     <span className="font-semibold text-green-600 ml-1">
//                         {/* 🌟 Muestra el nombre o "Invitado" si aún no está cargado */}
//                         {name || "Invitado"}
//                     </span>
//                 </p>
//             </div>
            
//             {/* 2. SECCIÓN DERECHA: Botones de Acción */}
//             <div className="flex items-center space-x-3">
                
//                 {/* Botón "Panel" (Acción Principal - Estilo Sólido y Profesional) */}
//                 <motion.button
//                     whileHover={{ scale: 1.05 }} 
//                     whileTap={{ scale: 0.95 }} 
//                     className="
//                         flex items-center gap-2 
//                         px-4 py-2 
//                         rounded-full
//                         bg-green-600
//                         hover:bg-green-700
//                         text-white 
//                         font-medium 
//                         text-sm
//                         shadow-lg shadow-green-500/50
//                         transition-all duration-300
//                     "
//                     onClick={panel}
//                 >
//                     <MdOutlineDashboard className="text-xl" />
//                     {/* Ocultamos el texto en móvil para ahorrar espacio */}
//                     <span className="hidden md:inline">Panel Principal</span> 
//                 </motion.button>

//                 {/* Botón "Logout" (Acción Secundaria - Estilo Delineado/Ghost) */}
//                 <motion.button
//                     whileHover={{ scale: 1.05, borderColor: '#ef4444' }} // Efecto visual en el borde
//                     whileTap={{ scale: 0.95 }}
//                     className="
//                         flex items-center gap-2
//                         px-4 py-2
//                         rounded-full
//                         border-2 border-gray-300 // Borde sutil
//                         text-red-500 
//                         font-medium 
//                         text-sm 
//                         hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300
//                     "
//                     onClick={logout}
//                 >
//                     <MdLogout className="text-xl" />
//                     <span className="hidden md:inline">Cerrar Sesión</span>
//                 </motion.button>
//             </div>
//         </header>
//     );
// };

// export default Header;


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { 
//     selectName, 
//     SET_LOGIN,
//     SET_USER
// } from "../../features/auth/authSlice/authSlice"; 
// import { signOut } from 'firebase/auth';
// import { auth } from "../../firebaseConfig"; 
// import { motion } from "framer-motion";
// import { MdOutlineDashboard, MdLogout, MdMenu, MdLocalFlorist } from 'react-icons/md'; // Añadimos MdLocalFlorist
// import { toast } from "react-toastify"; 

// const Header = ({ onMenuToggle }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const name = useSelector(selectName); 

//     const logout = async () => {
//         // ... (Lógica de Logout - Se mantiene igual)
//         try {
//             await signOut(auth);
//             await dispatch(SET_LOGIN(false));
//             await dispatch(SET_USER({})); 
//             toast.success("Sesión cerrada exitosamente.");
//             navigate("/login"); 
//         } catch (error) {
//             console.error("Error al cerrar sesión:", error.message);
//             toast.error("Fallo al cerrar sesión.");
//         }
//     };

//     const panel = () => {
//         navigate("/acumuladoC");
//     };

//     return (
//         <motion.header 
//             // 🛑 Animación de aparición suave
//             initial={{ y: -50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             // 🛑 Colores: Fondo blanco/claro, sombra sutil, borde verde acento
//             className="flex justify-between items-center h-16 px-4 sm:px-6 bg-white shadow-lg border-b-2 border-green-500 sticky top-0 z-40"
//         >
            
//             {/* 1. SECCIÓN IZQUIERDA: Logo/Título + Botón Menú + Saludo */}
//             <div className="flex items-center gap-6">
                
//                 {/* LOGO TEMÁTICO */}
//                 <motion.div 
//                     onClick={panel} 
//                     className="flex items-center cursor-pointer"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     <MdLocalFlorist className="text-3xl text-green-600 mr-2" />
//                     <h1 className="text-xl font-extrabold text-blue-800 hidden sm:block">AgroDash</h1>
//                 </motion.div>

//                 {/* BOTÓN HAMBURGUESA */}
//                 <div className="sm:hidden">
//                     <MdMenu 
//                         className="text-3xl text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
//                         onClick={onMenuToggle} 
//                     />
//                 </div>
                
//                 {/* SALUDO DE USUARIO */}
//                 <p className="text-gray-700 text-base sm:text-lg font-light hidden md:block">
//                     Bienvenido, 
//                     <span className="font-semibold text-green-600 ml-1">
//                         {name || "Invitado"}
//                     </span>
//                 </p>
//             </div>
            
//             {/* 2. SECCIÓN DERECHA: Botones de Acción */}
//             <div className="flex items-center space-x-3">
                
//                 {/* Botón "Panel" */}
//                 <motion.button
//                     whileHover={{ scale: 1.05 }} 
//                     whileTap={{ scale: 0.95 }} 
//                     className="
//                         flex items-center gap-2 
//                         px-4 py-2 
//                         rounded-full
//                         bg-green-600 // Color temático
//                         hover:bg-green-700
//                         text-white 
//                         font-medium 
//                         text-sm
//                         shadow-md shadow-green-500/50
//                         transition-all duration-300
//                     "
//                     onClick={panel}
//                 >
//                     <MdOutlineDashboard className="text-xl" />
//                     <span className="hidden md:inline">Panel Principal</span> 
//                 </motion.button>

//                 {/* Botón "Logout" */}
//                 <motion.button
//                     whileHover={{ scale: 1.05, backgroundColor: '#fecaca', color: '#dc2626' }} // Hover con fondo claro y texto rojo
//                     whileTap={{ scale: 0.95 }}
//                     className="
//                         flex items-center gap-2
//                         px-4 py-2
//                         rounded-full
//                         border-2 border-red-500 // Borde rojo para Logout
//                         text-red-600 
//                         font-medium 
//                         text-sm 
//                         transition-all duration-300
//                         hover:bg-red-500 hover:text-white hover:border-red-500 // Invertir colores al hacer hover
//                     "
//                     onClick={logout}
//                 >
//                     <MdLogout className="text-xl" />
//                     <span className="hidden md:inline">Cerrar Sesión</span>
//                 </motion.button>
//             </div>
//         </motion.header>
//     );
// };

// export default Header;



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    selectName, 
    SET_LOGIN,
    SET_USER
} from "../../features/auth/authSlice/authSlice"; 
import { signOut } from 'firebase/auth';
import { auth } from "../../firebaseConfig"; 
import { motion } from "framer-motion";
import { MdOutlineDashboard, MdLogout, MdMenu, MdLocalFlorist, MdPerson } from 'react-icons/md';
import { toast } from "react-toastify"; 

const Header = ({ onMenuToggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector(selectName); 

    const logout = async () => {
        try {
            await signOut(auth);
            await dispatch(SET_LOGIN(false));
            await dispatch(SET_USER({})); 
            toast.success("Sesión cerrada exitosamente.");
            navigate("/login"); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
            toast.error("Fallo al cerrar sesión.");
        }
    };

    const panel = () => {
        navigate("/acumuladoC");
    };

    return (
        <motion.header 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            
            // 🛑 CLASES REVISADAS: 
            // - Cambiado 'fixed top-0 left-0 w-full z-50' por 'sticky top-0 z-40'.
            // - El encabezado ahora respeta el flujo del documento.
            className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 sm:px-8 bg-white shadow-xl border-b-4 border-green-600 transition-all duration-300"
        >
            
            {/* 1. SECCIÓN IZQUIERDA: Menu + Logo/Título */}
            <div className="flex items-center gap-4">
                
                {/* BOTÓN HAMBURGUESA (SIEMPRE VISIBLE EN MÓVIL/TABLET) */}
                <div className="lg:hidden">
                    <MdMenu 
                        className="text-3xl text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={onMenuToggle} 
                    />
                </div>

                {/* LOGO TEMÁTICO (AgroDash) */}
                <motion.div 
                    onClick={panel} 
                    className="flex items-center cursor-pointer select-none"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <MdLocalFlorist className="text-3xl text-green-600 mr-1" />
                    <h1 className="text-2xl font-black text-blue-800 hidden sm:block">HortiDash</h1>
                </motion.div>
                
            </div>
            
            {/* 2. SECCIÓN CENTRAL: Saludo de Usuario */}
            <div className="flex items-center hidden md:flex p-2 bg-gray-50 rounded-full border border-gray-200">
                <MdPerson className="text-xl text-green-500 mr-2" />
                <p className="text-gray-700 text-sm font-medium">
                    Bienvenido, 
                    <span className="font-bold text-blue-800 ml-1">
                        {name || "Invitado"}
                    </span>
                </p>
            </div>
            
            {/* 3. SECCIÓN DERECHA: Botones de Acción */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                
                {/* Botón "Panel" - El CTA principal */}
                <motion.button
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="
                        flex items-center gap-2 
                        px-3 sm:px-5 py-2 
                        rounded-full
                        bg-green-600 
                        hover:bg-green-700
                        text-white 
                        font-semibold 
                        text-sm
                        shadow-lg shadow-green-500/50
                        transition-all duration-300
                    "
                    onClick={panel}
                >
                    <MdOutlineDashboard className="text-xl" />
                    <span className="hidden sm:inline">Panel Principal</span> 
                </motion.button>

                {/* Botón "Logout" - Minimalista y claro */}
                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgb(254, 226, 226)' }}
                    whileTap={{ scale: 0.95 }}
                    className="
                        flex items-center justify-center
                        w-10 h-10 sm:w-auto sm:h-auto
                        px-2 sm:px-4 py-2
                        rounded-full
                        border-2 border-red-500 
                        text-red-600 
                        font-medium 
                        text-sm 
                        transition-all duration-300
                        hover:bg-red-500 hover:text-white hover:border-red-500
                    "
                    onClick={logout}
                >
                    <MdLogout className="text-xl" />
                    <span className="hidden sm:inline ml-1">Salir</span>
                </motion.button>
            </div>
        </motion.header>
    );
};

export default Header;