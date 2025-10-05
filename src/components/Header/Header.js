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
    // 🛑 CAMBIO CLAVE: Usa 'flex-col' por defecto (móvil) y 'sm:flex-row' para tablet/desktop.
    // Además, aumenta el relleno (padding) en el eje Y para darle más aire.
    <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 sm:py-6 border-b border-gray-200 shadow-sm">
      
      {/* Contenedor del Título 
        En móvil, ocupa todo el ancho ('w-full') y centra el texto. 
        En 'sm' (tablet+), el texto se alinea a la izquierda ('sm:text-left').
      */}
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