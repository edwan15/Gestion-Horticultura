import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../features/auth/authSlice/authSlice";
import { logoutUser } from "../../services/Services";
import { motion } from "framer-motion";

const Header = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  // El selector de nombre puede devolver undefined si el estado no está listo
  const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispath(SET_LOGIN(false));
    navigate("/");
  };

  const panel = async () => {
    navigate("/acumuladoC");
  };

  return (

    <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 sm:py-6 border-b border-gray-200 shadow-sm">
      
    
      <div className="w-full text-center sm:text-left mb-3 sm:mb-0">
        {/* Usamos un tamaño de fuente que escala mejor: 'text-lg' para móvil, 'sm:text-xl' para tablet y 'lg:text-2xl' para desktop */}
        <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl font-normal">
          Welcome, 
          {/* El nombre del usuario siempre está en negrita y es el foco principal */}
          <span className="font-bold text-red-600 ml-1">{name || "Invitado"}</span>
        </p>
      </div>

      {/* Contenedor de Botones 
        En móvil, usa 'w-full' para que los botones se estiren o se organicen bien.
        'space-x-2' separa los botones horizontalmente, y 'justify-center' los centra en móvil.
        En 'sm' (tablet+), se alinea a la derecha.
      */}
      <div className="w-full sm:w-auto flex justify-center sm:justify-end items-center">
        <div className="flex space-x-3 sm:space-x-4">
          
          {/* Botón "Panel" */}
          <motion.button
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="
              px-4 py-2 
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white 
              font-semibold 
              text-sm sm:text-base
              shadow-md transition-all duration-200
              // Añadido 'w-full sm:w-auto' para mejor manejo del ancho en móvil (opcional, si quieres que se estiren)
            "
            onClick={panel}
          >
            Panel
          </motion.button>

          {/* Botón "Logout" */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-4 py-2
              rounded-lg
              bg-red-600
              hover:bg-red-700
              text-white 
              font-semibold 
              text-sm sm:text-base
              shadow-md transition-all duration-200
              // Añadido 'w-full sm:w-auto'
            "
            onClick={logout}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;


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