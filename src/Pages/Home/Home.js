import React from "react";
import { AiFillGithub, AiOutlineCloudServer } from "react-icons/ai";
import { FaUnity } from "react-icons/fa";
import { DiMongodb } from "react-icons/di";
import { GrNode } from "react-icons/gr";
import IMAGE from "../../asset/inventary.png";
import LOGO from "../../asset/LOGOS.svg";
import { Link } from "react-router-dom";
import { ShowOnLogout, ShowOnLogin } from "../../protect/HiddenLiks";
import { motion } from "framer-motion";
import { FiLogIn, FiUserPlus, FiGrid } from "react-icons/fi";

const Home = () => {
  return (
    // CONTENEDOR PRINCIPAL: max-w-7xl para limitar el ancho y mx-auto para centrarlo.
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* ======================================================= */}
      {/* 1. CABECERA / NAVEGACIÓN (Responsive Navbar) */}
      {/* ======================================================= */}
      {/* Simplificamos el HEADER. El control de separación se hace en el DIV interno. */}
      <header className="w-full mb-8 sm:mb-16">
        
        {/* CORRECCIÓN CLAVE: Añadimos 'w-full' para que 'justify-between' funcione en todo el ancho. */}
        <div className="flex justify-between items-center px-4 py-2 w-full">
          
          {/* DIV 1: Logo (Se irá a la izquierda) */}
          <div className="mb-4 sm:mb-0">
            <motion.h1 whileHover={{ scale: 1.05 }}>
              <a
                href="https://horticulturadelsureste.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={LOGO} alt="logo" className="w-32 sm:w-48" />
              </a>
            </motion.h1>
          </div>

          {/* DIV 2: Botones (Se irá a la derecha) */}
          <div className="flex gap-4 items-center">
            
            {/* BOTÓN 1: REGISTER */}
            <ShowOnLogout>
              <Link to="/register">
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // Estilo moderno para Register (borde)
                  className="py-2 px-4 border-2 border-white/50 text-white font-semibold text-lg rounded-full cursor-pointer transition duration-300 hover:bg-white/10 hover:border-blue-500 flex items-center gap-2"
                >
                  <FiUserPlus className="text-xl text-blue-300" /> Register
                </motion.h1>
              </Link>
            </ShowOnLogout>

            {/* BOTÓN 2: LOGIN */}
            <ShowOnLogout>
              <Link to="/login">
                <motion.h1
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(29, 78, 216, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  // Estilo moderno para Login (fondo sólido)
                  className="py-2 px-4 bg-blue-600 rounded-full text-white cursor-pointer font-bold text-lg shadow-lg transition duration-300 hover:bg-blue-700 flex items-center gap-2"
                >
                  <FiLogIn className="text-xl" /> Login
                </motion.h1>
              </Link>
            </ShowOnLogout>

            {/* BOTÓN 3: PANEL DE ADMINISTRACIÓN */}
            <ShowOnLogin>
              <Link
                to="/panel"
                className="py-2 px-4 bg-emerald-600 rounded-full text-white cursor-pointer font-bold text-lg shadow-lg transition duration-300 hover:bg-emerald-700 flex items-center gap-2"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(16, 185, 129, 0.5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)")
                }
              >
                <FiGrid className="text-xl" />
                Panel de Administración
              </Link>
            </ShowOnLogin>
          </div>
        </div>
      </header>
      {/* ======================================================= */}
      {/* 2. CONTENIDO PRINCIPAL (Título e Imagen) */}
      {/* ======================================================= */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 justify-center items-center mt-2 px-4 sm:px-10">
        {/* COLUMNA DE TEXTO */}
        <div className="md:col-span-6 order-2 md:order-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
            Inventario & Stock De productos
          </h1>
          <h2 className="text-white text-lg sm:text-xl mt-6 sm:mt-8 max-w-xl">
            Sistema de inventario y control de Administración para ser integrado
            en tiempo real utilizando una base de Datos implementada en la nube.
          </h2>

          {/* ÍCONOS DE TECNOLOGÍA */}
          <div className="flex mt-8 gap-5 items-center">
            <h1 className="text-3xl text-white">
              <FaUnity />
            </h1>
            <h1 className="text-3xl text-white">
              <AiOutlineCloudServer />
            </h1>
            <h1 className="text-3xl text-white">
              <DiMongodb />
            </h1>
            <h1 className="text-3xl text-white">
              <GrNode />
            </h1>
          </div>
        </div>

        {/* COLUMNA DE IMAGEN */}
        <div className="md:col-span-6 order-1 md:order-2 flex justify-center items-center p-4">
          <img
            src={IMAGE}
            alt="Inventario Dashboard"
            className="w-full max-w-md md:max-w-none h-auto object-contain"
          />
        </div>
      </main>

      {/* ======================================================= */}
      {/* 3. FOOTER / ETIQUETA FIJA (Este elemento ignora el contenedor) */}
      {/* ======================================================= */}
      <footer className="fixed bottom-4 right-4 z-50  text-right">
        <p className="text-lg font-semibold text-white">
          HORTICULTURA -{" "}
          <a
            href="https://agrodolores.com/"
            className="lowercase text-blue-500 hover:text-blue-700 transition"
          >
            Finca BALSICAS
          </a>
        </p>
        <div className="flex justify-center">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <h1 className="text-3xl text-white hover:text-gray-300 transition">
              <AiFillGithub />
            </h1>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
