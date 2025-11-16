// import React from "react";
// import { AiFillGithub, AiOutlineCloudServer } from "react-icons/ai";
// import { FaUnity } from "react-icons/fa";
// import { DiMongodb } from "react-icons/di";
// import { GrNode } from "react-icons/gr";
// import IMAGE from "../../asset/inventary.png";
// import LOGO from "../../asset/LOGOS.svg";
// import { Link } from "react-router-dom";
// import { ShowOnLogout, ShowOnLogin } from "../../protect/HiddenLiks";
// import { motion } from "framer-motion";
// import { FiLogIn, FiUserPlus, FiGrid } from "react-icons/fi";

// const Home = () => {
//   return (
//     // CONTENEDOR PRINCIPAL: max-w-7xl para limitar el ancho y mx-auto para centrarlo.
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//       {/* ======================================================= */}
//       {/* 1. CABECERA / NAVEGACIÓN (Responsive Navbar) */}
//       {/* ======================================================= */}
//       {/* Simplificamos el HEADER. El control de separación se hace en el DIV interno. */}
//       <header className="w-full mb-8 sm:mb-16">
        
//         {/* CORRECCIÓN CLAVE: Añadimos 'w-full' para que 'justify-between' funcione en todo el ancho. */}
//         <div className="flex justify-between items-center px-4 py-2 w-full">
          
//           {/* DIV 1: Logo (Se irá a la izquierda) */}
//           <div className="mb-4 sm:mb-0">
//             <motion.h1 whileHover={{ scale: 1.05 }}>
//               <a
//                 href="https://horticulturadelsureste.com/"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <img src={LOGO} alt="logo" className="w-32 sm:w-48" />
//               </a>
//             </motion.h1>
//           </div>

//           {/* DIV 2: Botones (Se irá a la derecha) */}
//           <div className="flex gap-4 items-center">
            
//             {/* BOTÓN 1: REGISTER */}
//             <ShowOnLogout>
//               <Link to="/register">
//                 <motion.h1
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   // Estilo moderno para Register (borde)
//                   className="py-2 px-4 border-2 border-white/50 text-white font-semibold text-lg rounded-full cursor-pointer transition duration-300 hover:bg-white/10 hover:border-blue-500 flex items-center gap-2"
//                 >
//                   <FiUserPlus className="text-xl text-blue-300" /> Register
//                 </motion.h1>
//               </Link>
//             </ShowOnLogout>

//             {/* BOTÓN 2: LOGIN */}
//             <ShowOnLogout>
//               <Link to="/login">
//                 <motion.h1
//                   whileHover={{
//                     scale: 1.05,
//                     boxShadow: "0 4px 20px rgba(29, 78, 216, 0.5)",
//                   }}
//                   whileTap={{ scale: 0.95 }}
//                   // Estilo moderno para Login (fondo sólido)
//                   className="py-2 px-4 bg-blue-600 rounded-full text-white cursor-pointer font-bold text-lg shadow-lg transition duration-300 hover:bg-blue-700 flex items-center gap-2"
//                 >
//                   <FiLogIn className="text-xl" /> Login
//                 </motion.h1>
//               </Link>
//             </ShowOnLogout>

//             {/* BOTÓN 3: PANEL DE ADMINISTRACIÓN */}
//           <ShowOnLogin>
//   <Link
//     to="/panel"
//     className="
//       py-2 px-3 sm:px-4                                
//       bg-emerald-600 rounded-full text-white cursor-pointer font-bold 
//       text-sm md:text-lg                             
//       shadow-lg transition duration-300 hover:bg-emerald-700 
//       flex items-center gap-2
//     "
//     onMouseEnter={(e) =>
//       (e.currentTarget.style.boxShadow =
//         "0 4px 20px rgba(16, 185, 129, 0.5)")
//     }
//     onMouseLeave={(e) =>
//       (e.currentTarget.style.boxShadow =
//         "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)")
//     }
//   >
//     <FiGrid className="text-xl" />
//     Panel de Administración
//   </Link>
// </ShowOnLogin>
//           </div>
//         </div>
//       </header>
//       {/* ======================================================= */}
//       {/* 2. CONTENIDO PRINCIPAL (Título e Imagen) */}
//       {/* ======================================================= */}
//       <main className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 justify-center items-center mt-2 px-4 sm:px-10">
//         {/* COLUMNA DE TEXTO */}
//         <div className="md:col-span-6 order-2 md:order-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
//           <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
//             Inventario & Stock De productos
//           </h1>
//           <h2 className="text-white text-lg sm:text-xl mt-6 sm:mt-8 max-w-xl">
//             Sistema de inventario y control de Administración para ser integrado
//             en tiempo real utilizando una base de Datos implementada en la nube.
//           </h2>

//           {/* ÍCONOS DE TECNOLOGÍA */}
//           <div className="flex mt-8 gap-5 items-center">
//             <h1 className="text-3xl text-white">
//               <FaUnity />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <AiOutlineCloudServer />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <DiMongodb />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <GrNode />
//             </h1>
//           </div>
//         </div>

//         {/* COLUMNA DE IMAGEN */}
//         <div className="md:col-span-6 order-1 md:order-2 flex justify-center items-center p-4">
//           <img
//             src={IMAGE}
//             alt="Inventario Dashboard"
//             className="w-full max-w-md md:max-w-none h-auto object-contain"
//           />
//         </div>
//       </main>

//       {/* ======================================================= */}
//       {/* 3. FOOTER / ETIQUETA FIJA (Este elemento ignora el contenedor) */}
//       {/* ======================================================= */}
//       <footer className="fixed bottom-4 right-4 z-50  text-right">
//         <p className="text-lg font-semibold text-white">
//           HORTICULTURA -{" "}
//           <a
//             href="https://agrodolores.com/"
//             className="lowercase text-blue-500 hover:text-blue-700 transition"
//           >
//             Finca BALSICAS
//           </a>
//         </p>
//         <div className="flex justify-center">
//           <a href="https://agrodolores.com/" target="_blank" rel="noopener noreferrer">
//             <h1 className="text-3xl text-white hover:text-gray-300 transition">
//               <AiFillGithub />
//             </h1>
//           </a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;
// import React from "react";
// import { AiFillGithub, AiOutlineCloudServer } from "react-icons/ai";
// import { FaUnity } from "react-icons/fa";
// import { DiMongodb } from "react-icons/di";
// import { GrNode } from "react-icons/gr";
// import IMAGE from "../../asset/inventary.png";
// import LOGO from "../../asset/LOGOS.svg";
// import { Link } from "react-router-dom";
// import { ShowOnLogout, ShowOnLogin } from "../../protect/HiddenLiks";
// import { motion } from "framer-motion";
// import { FiLogIn, FiUserPlus, FiGrid } from "react-icons/fi";

// const Home = () => {
//   return (
//     // CONTENEDOR PRINCIPAL: max-w-7xl para limitar el ancho y mx-auto para centrarlo.
//     // Añadimos 'min-h-screen' al contenedor principal para forzar que el footer llegue al final de la pantalla si el contenido es corto.
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col"> 
      
//       {/* 1. CABECERA / NAVEGACIÓN */}
//       <header className="w-full mb-8 sm:mb-16">
//         {/* ... (Contenido de Header sin cambios) ... */}
//         <div className="flex justify-between items-center px-4 py-2 w-full">
          
//           {/* DIV 1: Logo */}
//           <div className="mb-4 sm:mb-0">
//             <motion.h1 whileHover={{ scale: 1.05 }}>
//               <a
//                 href="https://horticulturadelsureste.com/"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <img src={LOGO} alt="logo" className="w-32 sm:w-48" />
//               </a>
//             </motion.h1>
//           </div>

//           {/* DIV 2: Botones */}
//           <div className="flex gap-4 items-center">
            
//             <ShowOnLogout>
//               <Link to="/register">
//                 <motion.h1
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="py-2 px-4 border-2 border-white/50 text-white font-semibold text-lg rounded-full cursor-pointer transition duration-300 hover:bg-white/10 hover:border-blue-500 flex items-center gap-2"
//                 >
//                   <FiUserPlus className="text-xl text-blue-300" /> Register
//                 </motion.h1>
//               </Link>
//             </ShowOnLogout>

//             <ShowOnLogout>
//               <Link to="/login">
//                 <motion.h1
//                   whileHover={{
//                     scale: 1.05,
//                     boxShadow: "0 4px 20px rgba(29, 78, 216, 0.5)",
//                   }}
//                   whileTap={{ scale: 0.95 }}
//                   className="py-2 px-4 bg-blue-600 rounded-full text-white cursor-pointer font-bold text-lg shadow-lg transition duration-300 hover:bg-blue-700 flex items-center gap-2"
//                 >
//                   <FiLogIn className="text-xl" /> Login
//                 </motion.h1>
//               </Link>
//             </ShowOnLogout>

//             <ShowOnLogin>
//               <Link
//                 to="/acumuladoC"
//                 className="
//                   py-2 px-3 sm:px-4                                
//                   bg-emerald-600 rounded-full text-white cursor-pointer font-bold 
//                   text-sm md:text-lg                             
//                   shadow-lg transition duration-300 hover:bg-emerald-700 
//                   flex items-center gap-2
//                 "
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.boxShadow =
//                     "0 4px 20px rgba(16, 185, 129, 0.5)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.boxShadow =
//                     "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)")
//                 }
//               >
//                 <FiGrid className="text-xl" />
//                 Panel de Administración
//               </Link>
//             </ShowOnLogin>
//           </div>
//         </div>
//       </header>
      
//       {/* 2. CONTENIDO PRINCIPAL (usamos 'flex-grow' para que ocupe todo el espacio disponible) */}
//       <main className="grid flex-grow grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 justify-center items-center mt-2 px-4 sm:px-10">
//         {/* COLUMNA DE TEXTO */}
//         <div className="md:col-span-6 order-2 md:order-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
//           <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
//             Inventario & Stock De productos
//           </h1>
//           <h2 className="text-white text-lg sm:text-xl mt-6 sm:mt-8 max-w-xl">
//             Sistema de inventario y control de Administración para ser integrado
//             en tiempo real utilizando una base de Datos implementada en la nube.
//           </h2>

//           {/* ÍCONOS DE TECNOLOGÍA */}
//           <div className="flex mt-8 gap-5 items-center">
//             <h1 className="text-3xl text-white">
//               <FaUnity />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <AiOutlineCloudServer />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <DiMongodb />
//             </h1>
//             <h1 className="text-3xl text-white">
//               <GrNode />
//             </h1>
//           </div>
//         </div>

//         {/* COLUMNA DE IMAGEN */}
//         <div className="md:col-span-6 order-1 md:order-2 flex justify-center items-center p-4">
//           <img
//             src={IMAGE}
//             alt="Inventario Dashboard"
//             className="w-full max-w-md md:max-w-none h-auto object-contain"
//           />
//         </div>
//       </main>

//       {/* ======================================================= */}
//       {/* 3. FOOTER ESTATICO (Ahora siempre al final del contenido) */}
//       {/* ======================================================= */}
//       <footer className="w-full mt-10 p-4 text-right border-t border-white/10"> 
//         <p className="text-md sm:text-lg font-semibold text-white/80">
//           HORTICULTURA -{" "}
//           <a
//             href="https://agrodolores.com/"
//             className="lowercase text-blue-400 hover:text-blue-200 transition"
//           >
//             Finca BALSICAS
//           </a>
//         </p>
//         <div className="flex justify-end mt-1"> 
//           <a href="https://agrodolores.com/" target="_blank" rel="noopener noreferrer">
//             <h1 className="text-3xl text-white hover:text-gray-300 transition">
//               <AiFillGithub />
//             </h1>
//           </a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;



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

// =================================================================
// 1. VARIANTES DE FRAMER MOTION
// =================================================================

// Contenedor principal para animaciones escalonadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Retraso entre la aparición de los hijos
    },
  },
};

// Animación para el texto principal
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

// Animación para los íconos de tecnología
const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 12 },
  },
};

// Eliminamos la variante 'imageFloat' ya que el usuario no quiere que la imagen se mueva.

const Home = () => {
  return (
    // CONTENEDOR PRINCIPAL: Degradado oscuro con un borde sutil y animación de entrada
    <motion.div
      className="bg-gray-900 text-white min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Efecto de fondo sutil (Estrellas / Nebulosa) */}
      <div className="absolute inset-0 bg-repeat opacity-5" style={{ backgroundImage: "radial-gradient(#1e40af 1px, transparent 1px), radial-gradient(#6366f1 1px, transparent 1px)", backgroundSize: "40px 40px", backgroundPosition: "0 0, 20px 20px" }}></div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Contenido centrado y con max-width */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col flex-grow relative z-10">

        {/* 1. CABECERA / NAVEGACIÓN */}
        <header className="w-full mb-8 sm:mb-16">
          <motion.div
            className="flex justify-between items-center py-4 w-full border-b border-white/10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          >
            {/* DIV 1: Logo */}
            <motion.div whileHover={{ scale: 1.05, rotate: 1 }}>
              <a
                href="https://horticulturadelsureste.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={LOGO} alt="logo" className="w-28 sm:w-40 filter drop-shadow-lg" />
              </a>
            </motion.div>

            {/* DIV 2: Botones */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <ShowOnLogout>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-3 sm:px-4 bg-transparent border border-blue-400 text-blue-300 font-semibold rounded-full transition duration-300 hover:bg-blue-400/20 flex items-center gap-2 text-sm sm:text-lg"
                  >
                    <FiUserPlus className="text-xl" /> Register
                  </motion.button>
                </Link>
              </ShowOnLogout>

              <ShowOnLogout>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(29, 78, 216, 0.8)" }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-3 sm:px-4 bg-blue-600 rounded-full text-white cursor-pointer font-bold transition duration-300 hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-lg"
                  >
                    <FiLogIn className="text-xl" /> Login
                  </motion.button>
                </Link>
              </ShowOnLogout>

              <ShowOnLogin>
                <Link to="/acumuladoC">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)" }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-3 sm:px-4 bg-emerald-600 rounded-full text-white font-bold transition duration-300 hover:bg-emerald-700 flex items-center gap-2 text-sm sm:text-lg"
                  >
                    <FiGrid className="text-xl" /> Panel
                  </motion.button>
                </Link>
              </ShowOnLogin>
            </div>
          </motion.div>
        </header>

        {/* 2. CONTENIDO PRINCIPAL */}
        <main className="grid flex-grow grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 justify-center items-center mt-2 px-0 sm:px-4">

          {/* COLUMNA DE TEXTO (Animación escalonada) */}
          <motion.div
            className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-white text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter drop-shadow-xl"
              variants={itemVariants}
            >
              Inventario & Stock De Productos
            </motion.h1>
            <motion.h2
              className="text-gray-300 text-xl md:text-2xl mt-6 max-w-xl font-light"
              variants={itemVariants}
            >
              Sistema de control de Administración diseñado para ser integrado
              en tiempo real utilizando una base de Datos implementada en la nube.
            </motion.h2>

            {/* ÍCONOS DE TECNOLOGÍA (Animación escalonada) */}
            <motion.div
              className="flex mt-10 gap-6 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={iconVariants}>
                <FaUnity className="text-4xl text-purple-400 hover:text-purple-300 transition duration-300 cursor-help" title="Unity Integration" />
              </motion.div>
              <motion.div variants={iconVariants}>
                <AiOutlineCloudServer className="text-4xl text-cyan-400 hover:text-cyan-300 transition duration-300 cursor-help" title="Cloud Server" />
              </motion.div>
              <motion.div variants={iconVariants}>
                <DiMongodb className="text-4xl text-green-500 hover:text-green-400 transition duration-300 cursor-help" title="MongoDB Database" />
              </motion.div>
              <motion.div variants={iconVariants}>
                <GrNode className="text-4xl text-green-600 hover:text-green-500 transition duration-300 cursor-help" title="Node.js Backend" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* COLUMNA DE IMAGEN (Ahora solo con animación de entrada) */}
          <motion.div
            className="lg:col-span-6 order-1 lg:order-2 flex justify-center items-center p-4 lg:p-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
          >
            <img // Cambiamos de motion.img a img simple si solo queremos la animación inicial
              src={IMAGE}
              alt="Inventario Dashboard"
              className="w-full max-w-xl h-auto object-contain rounded-xl shadow-2xl shadow-blue-500/30 border border-white/10"
            />
          </motion.div>
        </main>

        {/* 3. FOOTER ESTATICO */}
        <footer className="w-full mt-16 p-4 border-t border-white/10 flex justify-between items-center relative">
          <p className="text-sm sm:text-md text-gray-500">
            © {new Date().getFullYear()} Horticultura
          </p>
          <p className="text-md sm:text-lg font-semibold text-white/80">
            HORTICULTURA -{" "}
            <a
              href="https://agrodolores.com/"
              className="lowercase text-blue-400 hover:text-blue-200 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Finca BALSICAS
            </a>
          </p>
          <motion.a
            href="https://agrodolores.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5, color: "#9CA3AF" }}
            whileTap={{ scale: 0.9 }}
          >
            <AiFillGithub className="text-3xl text-white hover:text-gray-300 transition" />
          </motion.a>
        </footer>
      </div>
    </motion.div>
  );
};

export default Home;