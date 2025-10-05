// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { selectName, SET_LOGIN } from "../../features/auth/authSlice/authSlice";
// import { logoutUser } from "../../services/Services";
// import { motion } from "framer-motion";
// const Header = () => {
//   const dispath = useDispatch();
//   const navigate = useNavigate();
//   const name = useSelector(selectName);

//   const logout = async () => {
//     await logoutUser();
//     await dispath(SET_LOGIN(false));
//     navigate("/");
//   };

//   const panel = async () => {
//     // await logoutUser();
//     // await dispath(SET_LOGIN(false));
//     navigate("/acumuladoC");
//   };

//   return (
//  <div className="flex justify-between items-center px-4 py-4"> {/* CLAVE 1: Añadir items-center aquí y reducir padding vertical */}
//     {/* Contenedor del Título */}
//     <div className="text-xl sm:text-3xl"> {/* CLAVE 2: Adaptar el tamaño de fuente para móvil (text-xl) */}
//         Welcome, <span className="font-bold text-red-500">{name}</span>
//     </div>

//     {/* Contenedor de Botones (Limpiado) */}
//     <div className="flex items-center"> {/* CLAVE 3: Eliminar el 'p-4' redundante que desalineaba */}
//         <div className="flex space-x-2 sm:space-x-4"> {/* Reducir el espacio para móvil (space-x-2) */}
            
//             <motion.button
//                 whileHover={{ scale: 1.05 }} 
//                 whileTap={{ scale: 0.95 }} 
//                 className="
//                     px-3 py-1.5 sm:px-4 sm:py-2 /* Ajustar padding para móvil */
//                     rounded-full
//                     bg-blue-600
//                     hover:bg-blue-700
//                     text-white 
//                     font-medium 
//                     text-sm sm:text-base /* Ajustar el tamaño del texto del botón */
//                     shadow-md transition-colors 
//                 "
//                 onClick={panel}
//             >
//                 Panel
//             </motion.button>

//             <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="
//                     px-3 py-1.5 sm:px-4 sm:py-2 /* Ajustar padding para móvil */
//                     rounded-full
//                     bg-red-600
//                     hover:bg-red-700
//                     text-white 
//                     font-medium 
//                     text-sm sm:text-base /* Ajustar el tamaño del texto del botón */
//                     shadow-md transition-colors
//                 "
//                 onClick={logout}
//             >
//                 Logout
//             </motion.button>
//         </div>
//     </div>
// </div>
//   );
// };

// export default Header;



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
    <div className="flex justify-between items-center px-4 py-4">
      {/* Contenedor del Título */}
      <div className="text-xl sm:text-3xl">
        Welcome,
        {/* 🛑 CORRECCIÓN: Usamos '|| "Invitado"' para evitar que 'name' sea undefined al renderizar */}
        <span className="font-bold text-red-500">{name || "Invitado"}</span>
      </div>

      {/* Contenedor de Botones */}
      <div className="flex items-center">
        <div className="flex space-x-2 sm:space-x-4">
            
            <motion.button
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="
                    px-3 py-1.5 sm:px-4 sm:py-2
                    rounded-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white 
                    font-medium 
                    text-sm sm:text-base
                    shadow-md transition-colors 
                "
                onClick={panel}
            >
                Panel
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                    px-3 py-1.5 sm:px-4 sm:py-2
                    rounded-full
                    bg-red-600
                    hover:bg-red-700
                    text-white 
                    font-medium 
                    text-sm sm:text-base
                    shadow-md transition-colors
                "
                onClick={logout}
            >
                Logout
            </motion.button>
        </div>
    </div>
  </div>
  );
};

export default Header;
