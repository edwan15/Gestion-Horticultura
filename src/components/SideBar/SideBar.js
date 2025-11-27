// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AiFillGithub } from "react-icons/ai";
// import { SlDirections } from "react-icons/sl";
// import { BiSearchAlt2, BiSupport } from "react-icons/bi";
// import { motion } from "framer-motion";
// import { BsMenuButtonWideFill } from "react-icons/bs";
// import { MdAdd } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { FaChessKing } from "react-icons/fa";
// import { FaExchangeAlt } from "react-icons/fa";
// import Menu from "../../data/Sidebar";
// import SideBarItem from "./SideBarItem";
// import { Link } from "react-router-dom";
// import Agro from "../../asset/LOGOS.svg";

// const SideBar = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMenu, setIsMenu] = useState(false);
//   // const toggle = () => {
//   //   setIsOpen(!isOpen);
//   // };
//   const navigate = useNavigate();

//   const menuRef = useRef(null);

//   // =========================================================================
//   // 2. LÓGICA DE CIERRE: Clic fuera Y Temporizador (7 segundos)
//   // =========================================================================
//   useEffect(() => {
//     let timerId;

//     // Solo se activa la lógica de cierre si el menú está ABIERTO
//     if (isMenu) {
//       // A. Lógica de Cierre por TEMPORIZADOR (7000ms = 7 segundos)
//       timerId = setTimeout(() => {
//         setIsMenu(false);
//       }, 7000); // 👈 Temporizador de 7 segundos

//       // B. Lógica de Cierre al hacer CLIC FUERA
//       const clickOutsideHandler = (event) => {
//         // Si el clic NO está dentro del menú referenciado, cerrarlo.
//         if (menuRef.current && !menuRef.current.contains(event.target)) {
//           setIsMenu(false);
//         }
//       };

//       document.addEventListener('mousedown', clickOutsideHandler);
//       document.addEventListener('touchstart', clickOutsideHandler);

//       // C. Función de limpieza (Cleanup)
//       return () => {
//         // Limpiar el temporizador para evitar que se cierre si el usuario interactúa
//         clearTimeout(timerId); 
//         // Remover los listeners de eventos para evitar fugas de memoria
//         document.removeEventListener('mousedown', clickOutsideHandler);
//         document.removeEventListener('touchstart', clickOutsideHandler);
//       };
//     }

//     // Limpieza al cambiar 'isMenu' o desmontar (si 'isMenu' es false, el 'return' solo limpia)
//     return () => {
//         if (timerId) {
//             clearTimeout(timerId);
//         }
//     };
//   }, [isMenu]); 

//   const goHome = () => {
//     navigate("/");
//   };

//   return (
//     // <header className="grid sm:flex min-h-screen   ">
//     //   {" "}
//     //   <div
//     //     className={`min-h-scree hidden sm:block bg-blue-300 p-5 pt-8   ${
//     //       isOpen ? " w-30  md:w-72 " : " w-0 sm:w-24  "
//     //     } relative duration-500`}
//     //   >
//     //     <div className="inline-flex gap-5  justify-center items-center">
//     //       <p
//     //         className="text-4xl font-bold mt-1   text-white cursor-pointer "
//     //         onClick={goHome}
//     //       >
//     //         <AiFillGithub />
//     //       </p>
//     //       <h1
//     //         className={`origin-left text-2xl font-bold duration-500    ${
//     //           !isOpen && "scale-0"
//     //         }`}
//     //       >
//     //         DashBoard
//     //       </h1>
//     //     </div>

//     //     <SlDirections
//     //       className=" text-4xl rounded-full bg-white p-2 cursor-pointer absolute -right-3 top-9  text-blue-500 border border-gray-500"
//     //       onClick={() => setIsOpen(!isOpen)}
//     //     />

//     //     <div className=" flex items-center   bg-white rounded-md mt-6 px-4 py-2 ">
//     //       <BiSearchAlt2 className="text-lg  origin-left cursor-pointer" />
//     //       <input
//     //         type="search"
//     //         placeholder=" Search"
//     //         className="w-full focus:outline-none"
//     //       />
//     //     </div>

//     //     {/* <div className=" inline-flex gap-5 mt-8 justify-center items-center   ">
//     //       <RiDirectionFill className=" inline-block float-left  text-4xl rounded-full  border border-gray-500  mr-2 cursor-pointer bg-white " />
//     //       <h1
//     //         className={`origin-left text-2xl font-extrabold duration-500    ${
//     //           !isOpen && "scale-0"
//     //         }`}
//     //       >
//     //         DashBoard
//     //       </h1>
//     //     </div> */}

//     //     <div>
//     //       {Menu.map((product, index) => {
//     //         return (
//     //           <SideBarItem key={index} product={product} isOpen={isOpen} />
//     //         );
//     //       })}
//     //     </div>
//     //   </div>
//     //   <div className="flex bg-blue-300  sm:hidden justify-between p-4 py-5">
//     //     <div>
//     //       <img src={Agro} alt="agro" className="absolute -top-2  w-[160px]  " />
//     //     </div>

//     //     {isMenu && (
//     //       <motion.div
//     //         variants={variants}
//     //         className="md:hidden w-35 bg-slate-100 shadow-xl rounded-lg flex-col  absolute top-20 right-0"
//     //       >
//     //         <Link to={"/panel"} onClick={() => setIsMenu(!isMenu)}>
//     //           <motion.p
//     //             initial="hidden"
//     //             animate="visible"
//     //             variants={variants}
//     //             className="px-4 py-2 flex jus items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out  "
//     //           >
//     //             <GrDashboard />
//     //             Inventario
//     //           </motion.p>
//     //         </Link>
//     //         <Link to={"/add-product"} onClick={() => setIsMenu(!isMenu)}>
//     //           <motion.p
//     //             initial="hidden"
//     //             animate="visible"
//     //             variants={variants}
//     //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out  "
//     //           >
//     //             <MdAdd />
//     //             Product+
//     //           </motion.p>
//     //         </Link>
//     //         <Link to={"/profiles"}>
//     //           <motion.p
//     //             initial="hidden"
//     //             animate="visible"
//     //             variants={variants}
//     //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
//     //           >
//     //             <CgProfile /> Profile
//     //           </motion.p>
//     //         </Link>
//     //         <Link to={"/produccionC"}>
//     //           <motion.p
//     //             initial="hidden"
//     //             animate="visible"
//     //             variants={variants}
//     //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
//     //           >
//     //             <BiSupport /> Support
//     //           </motion.p>
//     //         </Link>
//     //         <Link to={"/contact-us"}>
//     //           <motion.p
//     //             initial="hidden"
//     //             animate="visible"
//     //             variants={variants}
//     //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
//     //           >
//     //             <BiSupport /> Support
//     //           </motion.p>
//     //         </Link>
//     //         <motion.p
//     //           initial="hidden"
//     //           animate="visible"
//     //           variants={variants}
//     //           className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
//     //         >
//     //           New item <MdAdd />
//     //         </motion.p>
//     //       </motion.div>
//     //     )}
//     //     <div className="flex p-3 justify-end items-end rounded-full bg-white">
//     //       <BsMenuButtonWideFill onClick={() => setIsMenu(!isMenu)} />
//     //     </div>
//     //   </div>
//     //   <div className={`text-center  w-full bg-slate-50`}>
//     //     <div className="bg-gray-200 ">{children}</div>
//     //   </div>
//     // </header>

//     <header className="grid sm:flex min-h-screen">
//   {" "}
//   {/* ... Menú de Escritorio (sm:block) - Sin Cambios ... */}
//   <div
//     className={`min-h-screen hidden sm:block bg-blue-300 p-5 pt-8 ${
//       isOpen ? " w-30 md:w-72 " : " w-0 sm:w-24 "
//     } relative duration-500`}
//   >
//     {/* ... Contenido del Menú de Escritorio ... */}
//     <div className="inline-flex gap-5 justify-center items-center">
//       <p
//         className="text-4xl font-bold mt-1 text-white cursor-pointer"
//         onClick={goHome}
//       >
//         <AiFillGithub />
//       </p>
//       <h1
//         className={`origin-left text-2xl font-bold duration-500 ${
//           !isOpen && "scale-0"
//         }`}
//       >
//         DashBoard
//       </h1>
//     </div>

//     <SlDirections
//       className=" text-4xl rounded-full bg-white p-2 cursor-pointer absolute -right-3 top-9 text-blue-500 border border-gray-500"
//       onClick={() => setIsOpen(!isOpen)}
//     />

//     <div className=" flex items-center bg-white rounded-md mt-6 px-4 py-2 ">
//       <BiSearchAlt2 className="text-lg origin-left cursor-pointer" />
//       <input
//         type="search"
//         placeholder=" Search"
//         className="w-full focus:outline-none"
//       />
//     </div>

//     <div>
//       {Menu.map((product, index) => {
//         return <SideBarItem key={index} product={product} isOpen={isOpen} />;
//       })}
//     </div>
//   </div>
  
//   {/* =======================================================
//       MENÚ MÓVIL (sm:hidden) - MEJORADO
//       ======================================================= */}
//   <div className="flex bg-blue-300 sm:hidden justify-between p-4 py-5 relative z-10">
//     <div>
//       <img src={Agro} alt="agro" className="absolute -top-2 w-[160px]" />
//     </div>

//     {isMenu && (
//       <motion.div
//         // Aumenté la duración de la animación a 0.5s para suavizar la entrada/salida
//         ref={menuRef} 
//         initial={{ opacity: 0, x: 50, scale: 0.9 }} 
//         animate={{ opacity: 1, x: 0, scale: 1 }}
//         exit={{ opacity: 0, x: 50, scale: 0.9 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }} 
        
//         // Clases de diseño más compacto y elegante
//         className="w-48 bg-white shadow-2xl rounded-lg flex-col absolute top-16 right-4 z-20 overflow-hidden border border-gray-100" 
//       >
//         <Link to={"/user-management"} onClick={() => setIsMenu(!isMenu)}>
//           <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
//           >
//             <FaChessKing  className="text-lg"/>
//             SuperUser
//           </motion.p>
//         </Link>
//         <Link to={"/user-master"} onClick={() => setIsMenu(!isMenu)}>
//           <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
//           >
//             <FaExchangeAlt className="text-lg"/>
//             Admin
//           </motion.p>
//         </Link>
//         <Link to={"/profiles"}>
//           <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
//           >
//             <CgProfile className="text-lg"/> Profile
//           </motion.p>
//         </Link>
//         {/* ... Otros Links con clases ajustadas ... */}
       
//         <Link to={"/contact-us"}>
//           <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
//           >
//             <BiSupport className="text-lg"/> Contacto
//           </motion.p>
//         </Link>
//         <motion.p
//           className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-t border-gray-100" // Línea separadora
//         >
//           New item <MdAdd className="text-lg"/>
//         </motion.p>
//       </motion.div>
//     )}
//     <div className="flex p-3 justify-end items-end rounded-full bg-white">
//       <BsMenuButtonWideFill onClick={() => setIsMenu(!isMenu)} />
//     </div>
//   </div>

//   {/* ... Contenido Principal ... */}
//   <div className={`text-center w-full bg-slate-50`}>
//     <div className="bg-gray-200">{children}</div>
//   </div>
// </header>
//   );
// };

// export default SideBar;








// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AiFillGithub } from "react-icons/ai";
// import { SlDirections } from "react-icons/sl";
// import { BiSearchAlt2, BiSupport } from "react-icons/bi";
// import { motion, AnimatePresence } from "framer-motion"; // 🛑 Importar AnimatePresence
// import { BsMenuButtonWideFill } from "react-icons/bs";
// import { MdAdd } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { FaChessKing, FaExchangeAlt, FaSeedling, FaFlask } from "react-icons/fa"; // Nuevos iconos temáticos
// import Menu from "../../data/Sidebar";
// import SideBarItem from "./SideBarItem";
// import { Link } from "react-router-dom";
// import Agro from "../../asset/LOGOS.svg";

// // 🛑 Variante de animación para el menú de escritorio
// const desktopSidebarVariants = {
//     open: { width: "18rem", transition: { duration: 0.5 } }, // Ancho de 72 (18rem)
//     closed: { width: "6rem", transition: { duration: 0.5 } }, // Ancho de 24 (6rem)
// };

// const SideBar = ({ children }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [isMenu, setIsMenu] = useState(false);
//     const navigate = useNavigate();
//     const menuRef = useRef(null);

//     // ... (Lógica de cierre por Clic fuera / Temporizador - Se mantiene igual)
//     useEffect(() => {
//         let timerId;
//         if (isMenu) {
//             timerId = setTimeout(() => {
//                 setIsMenu(false);
//             }, 7000); 

//             const clickOutsideHandler = (event) => {
//                 if (menuRef.current && !menuRef.current.contains(event.target)) {
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown', clickOutsideHandler);
//             document.addEventListener('touchstart', clickOutsideHandler);

//             return () => {
//                 clearTimeout(timerId); 
//                 document.removeEventListener('mousedown', clickOutsideHandler);
//                 document.removeEventListener('touchstart', clickOutsideHandler);
//             };
//         }
//         return () => {
//             if (timerId) {
//                 clearTimeout(timerId);
//             }
//         };
//     }, [isMenu]); 
//     // ...

//     const goHome = () => {
//         navigate("/");
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-50">
            
//             {/* =======================================================
//                 MENÚ DE ESCRITORIO (sm:block) - CON FRAMER MOTION
//                 ======================================================= */}
//             <motion.div
//                 // Usamos la variante para animar el ancho
//                 variants={desktopSidebarVariants}
//                 animate={isOpen ? "open" : "closed"}
//                 initial={false}
                
//                 // 🛑 Colores y Estilo Temático
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30" 
//             >
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                     >
//                         <FaSeedling /> {/* Ícono temático */}
//                     </motion.p>
//                     <motion.h1
//                         // Animación de texto: aparece/desaparece con el menú
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
//                         transition={{ duration: 0.3 }}
//                         className="origin-left text-2xl font-bold text-sky-200"
//                     >
//                         AgroTech
//                     </motion.h1>
//                 </div>

//                 {/* BOTÓN TOGGLE (Flecha) */}
//                 <motion.div 
//                     onClick={() => setIsOpen(!isOpen)}
//                     whileHover={{ scale: 1.1, rotate: 180 }}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-9 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections 
//                         className={`transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`}
//                     />
//                 </motion.div>

//                 {/* BÚSQUEDA */}
//                 <motion.div 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isOpen ? 1 : 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-sky-400 cursor-pointer" />
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-sky-200 ml-2 placeholder-sky-400"
//                     />
//                 </motion.div>

//                 {/* ENLACES (Deberías usar SideBarItem para animar la etiqueta) */}
//                 <div className="mt-8 space-y-2">
//                     {Menu.map((product, index) => {
//                         // Asumo que SideBarItem ya usa las props 'isOpen' para animar el texto
//                         return <SideBarItem key={index} product={product} isOpen={isOpen} />;
//                     })}
//                 </div>
//             </motion.div>
            
//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden) - MEJORADO con AnimatePresence
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* La barra superior móvil ahora está en el Header, pero manejamos aquí el toggle */}
                
//                 {/* Contenido del menú desplegable (usamos AnimatePresence para la animación de salida) */}
//                 <AnimatePresence>
//                     {isMenu && (
//                         <motion.div
//                             ref={menuRef} 
//                             initial={{ opacity: 0, x: 50, scale: 0.9 }} 
//                             animate={{ opacity: 1, x: 0, scale: 1 }}
//                             exit={{ opacity: 0, x: 50, scale: 0.9 }}
//                             transition={{ duration: 0.3, ease: "easeInOut" }} 
                            
//                             // Clases de diseño (se mantiene el color blanco para contraste)
//                             className="w-48 bg-white shadow-2xl rounded-lg flex-col absolute top-16 right-4 z-50 overflow-hidden border border-gray-100 sm:hidden" 
//                         >
//                             <LinkItem to={"/user-management"} icon={<FaChessKing />} label="SuperUser" setIsMenu={setIsMenu} />
//                             <LinkItem to={"/user-master"} icon={<FaExchangeAlt />} label="Admin" setIsMenu={setIsMenu} />
//                             <LinkItem to={"/profiles"} icon={<CgProfile />} label="Profile" setIsMenu={setIsMenu} />
//                             {/* Nuevos enlaces temáticos */}
//                             <LinkItem to={"/produccionC"} icon={<FaFlask />} label="Producción" setIsMenu={setIsMenu} />
//                             <LinkItem to={"/contact-us"} icon={<BiSupport />} label="Contacto" setIsMenu={setIsMenu} />
                            
//                             <motion.p
//                                 className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-green-50 transition-colors duration-150 border-t border-gray-100 text-green-600 font-semibold" 
//                             >
//                                 New item <MdAdd className="text-lg"/>
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Contenido principal (children) */}
//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // Componente auxiliar para los enlaces del menú móvil (para no repetir código)
// const LinkItem = ({ to, icon, label, setIsMenu }) => (
//     <Link to={to} onClick={() => setIsMenu(false)}>
//         <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-green-50 transition-colors duration-150 text-gray-700"
//             whileHover={{ x: 5 }} // Pequeño desplazamiento horizontal al hacer hover
//         >
//             <span className="text-green-500">{icon}</span>
//             {label}
//         </motion.p>
//     </Link>
// );

// export default SideBar;


// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// // Íconos y utilidades
// import { AiFillGithub } from "react-icons/ai";
// import { SlDirections } from "react-icons/sl";
// import { BiSearchAlt2, BiSupport, BiPackage } from "react-icons/bi"; // Añadido BiPackage
// import { motion, AnimatePresence } from "framer-motion";
// import { BsMenuButtonWideFill } from "react-icons/bs";
// import { MdAdd, MdOutlineInventory } from "react-icons/md"; // Añadido MdOutlineInventory
// import { CgProfile } from "react-icons/cg";
// import { FaChessKing, FaExchangeAlt, FaSeedling, FaFlask, FaRegListAlt } from "react-icons/fa"; // Nuevos iconos
// import Menu from "../../data/Sidebar";
// import SideBarItem from "./SideBarItem";
// import Agro from "../../asset/LOGOS.svg";

// // Variante de animación para el menú de escritorio
// const desktopSidebarVariants = {
//     open: { width: "18rem", transition: { duration: 0.5 } }, // Ancho de 72 (18rem)
//     closed: { width: "6rem", transition: { duration: 0.5 } }, // Ancho de 24 (6rem)
// };

// const SideBar = ({ children }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [isMenu, setIsMenu] = useState(false);
//     const navigate = useNavigate();
//     const menuRef = useRef(null);

//     // Lógica de cierre por Clic fuera / Temporizador (se mantiene igual)
//     useEffect(() => {
//         let timerId;
//         if (isMenu) {
//             timerId = setTimeout(() => {
//                 setIsMenu(false);
//             }, 7000); 

//             const clickOutsideHandler = (event) => {
//                 // Previene que el clic en el botón de hamburguesa cierre el menú inmediatamente
//                 const menuButton = document.querySelector(".menu-toggle-button");
//                 if (menuButton && menuButton.contains(event.target)) return;

//                 if (menuRef.current && !menuRef.current.contains(event.target)) {
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown', clickOutsideHandler);
//             document.addEventListener('touchstart', clickOutsideHandler);

//             return () => {
//                 clearTimeout(timerId); 
//                 document.removeEventListener('mousedown', clickOutsideHandler);
//                 document.removeEventListener('touchstart', clickOutsideHandler);
//             };
//         }
//         return () => {
//             if (timerId) {
//                 clearTimeout(timerId);
//             }
//         };
//     }, [isMenu]); 

//     const goHome = () => {
//         navigate("/");
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-50">
            
//             {/* MENÚ DE ESCRITORIO (sm:block) - Se mantiene el código de alto contraste */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen ? "open" : "closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30" 
//             >
//                 {/* ... (Contenido del menú de escritorio - se mantiene) ... */}
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                     >
//                         <FaSeedling /> 
//                     </motion.p>
//                     <motion.h1
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
//                         transition={{ duration: 0.3 }}
//                         className="origin-left text-2xl font-bold text-white" 
//                     >
//                         AgroTech
//                     </motion.h1>
//                 </div>

//                 <motion.div 
//                     onClick={() => setIsOpen(!isOpen)}
//                     whileHover={{ scale: 1.1, rotate: 180 }}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-9 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections 
//                         className={`transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`}
//                     />
//                 </motion.div>

//                 <motion.div 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isOpen ? 1 : 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer" /> 
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400" 
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {Menu.map((product, index) => {
//                         return <SideBarItem key={index} product={product} isOpen={isOpen} />;
//                     })}
//                 </div>
//             </motion.div>
            
//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden) - AVANZADO Y ELEGANTE
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 <div className="flex bg-blue-900 sm:hidden justify-between p-4 py-5 relative z-10">
//                     <div>
//                         {/* Puedes usar el logo de imagen o el logo textual/ícono */}
//                         <img src={Agro} alt="agro" className="absolute -top-2 w-[160px]" />
//                     </div>

//                     <div className="flex p-3 justify-end items-end rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill 
//                             onClick={() => setIsMenu(!isMenu)} 
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu && (
//                         <motion.div
//                             ref={menuRef} 
//                             // Animación más fluida: deslizar desde la derecha y un ligero rebote
//                             initial={{ opacity: 0, x: '100%' }} 
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: '100%' }}
//                             transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                            
//                             // Estilo: Fondo blanco, sombra muy profunda, borde de acento verde
//                             className="w-64 bg-white shadow-2xl border-t-4 border-green-500 flex-col absolute top-[4.5rem] right-0 z-50 overflow-hidden sm:hidden rounded-bl-lg" 
//                         >
//                             {/* ENLACES CLAVE */}
//                             <div className="p-3 border-b border-gray-100 space-y-1">
//                                 <LinkItem to={"/panel"} icon={<MdOutlineInventory />} label="Inventario" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/add-product"} icon={<MdAdd />} label="Añadir Producto" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/user-management"} icon={<FaChessKing />} label="Gestión de Roles" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/produccionC"} icon={<FaFlask />} label="Rutas de Producción" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/movimientos"} icon={<FaRegListAlt />} label="Historial de Movimientos" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* ENLACES DE PERFIL Y SOPORTE */}
//                             <div className="p-3 space-y-1">
//                                 <LinkItem to={"/profiles"} icon={<CgProfile />} label="Mi Perfil" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/contact-us"} icon={<BiSupport />} label="Soporte y Contacto" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* BOTÓN EXTRA/ACENTO */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-green-50 text-green-700 font-semibold transition-colors duration-150 border-t border-gray-100" 
//                                 whileHover={{ backgroundColor: '#d1fae5' }} // Hover más suave
//                             >
//                                 <BiPackage className="text-lg"/> 
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // Componente auxiliar LinkItem (Ajustado el estilo para ser elegante)
// const LinkItem = ({ to, icon, label, setIsMenu }) => (
//     <Link to={to} onClick={() => setIsMenu(false)}>
//         <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-green-50 rounded-md transition-all duration-200 text-gray-700 font-medium"
//             whileHover={{ x: 5, backgroundColor: '#f0fdf4' }} // Desplazamiento sutil al hacer hover
//             whileTap={{ scale: 0.98 }}
//         >
//             <span className="text-green-500 text-lg">{icon}</span> 
//             {label}
//         </motion.p>
//     </Link>
// );

// export default SideBar;






// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// // Íconos y utilidades
// import { AiFillGithub } from "react-icons/ai";
// import { SlDirections } from "react-icons/sl";
// import { BiSearchAlt2, BiSupport, BiPackage } from "react-icons/bi"; // Añadido BiPackage
// import { motion, AnimatePresence } from "framer-motion";
// import { BsMenuButtonWideFill } from "react-icons/bs";
// import { MdAdd, MdOutlineInventory } from "react-icons/md"; // Añadido MdOutlineInventory
// import { CgProfile } from "react-icons/cg";
// import { FaChessKing, FaExchangeAlt, FaSeedling, FaFlask, FaRegListAlt } from "react-icons/fa"; // Nuevos iconos
// import Menu from "../../data/Sidebar";
// import SideBarItem from "./SideBarItem";
// import Agro from "../../asset/LOGOS.svg";

// // Variante de animación para el menú de escritorio
// const desktopSidebarVariants = {
//     open: { width: "18rem", transition: { duration: 0.5 } }, // Ancho de 72 (18rem)
//     closed: { width: "6rem", transition: { duration: 0.5 } }, // Ancho de 24 (6rem)
// };

// const SideBar = ({ children }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [isMenu, setIsMenu] = useState(false);
//     const navigate = useNavigate();
//     const menuRef = useRef(null);

//     // Lógica de cierre por Clic fuera / Temporizador (se mantiene igual)
//     useEffect(() => {
//         let timerId;
//         if (isMenu) {
//             timerId = setTimeout(() => {
//                 setIsMenu(false);
//             }, 7000); 

//             const clickOutsideHandler = (event) => {
//                 // Previene que el clic en el botón de hamburguesa cierre el menú inmediatamente
//                 const menuButton = document.querySelector(".menu-toggle-button");
//                 if (menuButton && menuButton.contains(event.target)) return;

//                 if (menuRef.current && !menuRef.current.contains(event.target)) {
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown', clickOutsideHandler);
//             document.addEventListener('touchstart', clickOutsideHandler);

//             return () => {
//                 clearTimeout(timerId); 
//                 document.removeEventListener('mousedown', clickOutsideHandler);
//                 document.removeEventListener('touchstart', clickOutsideHandler);
//             };
//         }
//         return () => {
//             if (timerId) {
//                 clearTimeout(timerId);
//             }
//         };
//     }, [isMenu]); 

//     const goHome = () => {
//         navigate("/");
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-50">
            
//             {/* MENÚ DE ESCRITORIO (sm:block) - Se mantiene el código de alto contraste */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen ? "open" : "closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30" 
//             >
//                 {/* ... (Contenido del menú de escritorio - se mantiene) ... */}
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                     >
//                         <FaSeedling /> 
//                     </motion.p>
//                     <motion.h1
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
//                         transition={{ duration: 0.3 }}
//                         className="origin-left text-2xl font-bold text-white" 
//                     >
//                         AgroTech
//                     </motion.h1>
//                 </div>

//                 <motion.div 
//                     onClick={() => setIsOpen(!isOpen)}
//                     whileHover={{ scale: 1.1, rotate: 180 }}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-9 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections 
//                         className={`transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`}
//                     />
//                 </motion.div>

//                 <motion.div 
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: isOpen ? 1 : 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer" /> 
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400" 
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {Menu.map((product, index) => {
//                         return <SideBarItem key={index} product={product} isOpen={isOpen} />;
//                     })}
//                 </div>
//             </motion.div>
            
//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden) - AVANZADO Y ELEGANTE
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 <div className="flex bg-blue-900 sm:hidden justify-between p-4 py-5 relative z-10">
//                     <div>
//                         {/* Puedes usar el logo de imagen o el logo textual/ícono */}
//                         <img src={Agro} alt="agro" className="absolute -top-2 w-[160px]" />
//                     </div>

//                     <div className="flex p-3 justify-end items-end rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill 
//                             onClick={() => setIsMenu(!isMenu)} 
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu && (
//                         <motion.div
//                             ref={menuRef} 
//                             // Animación más fluida: deslizar desde la derecha y un ligero rebote
//                             initial={{ opacity: 0, x: '100%' }} 
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: '100%' }}
//                             transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                            
//                             // Estilo: Fondo blanco, sombra muy profunda, borde de acento verde
//                             className="w-64 bg-white shadow-2xl border-t-4 border-green-500 flex-col absolute top-[4.5rem] right-0 z-50 overflow-hidden sm:hidden rounded-bl-lg" 
//                         >
//                             {/* ENLACES CLAVE */}
//                             <div className="p-3 border-b border-gray-100 space-y-1">
//                                 <LinkItem to={"/panel"} icon={<MdOutlineInventory />} label="Inventario" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/add-product"} icon={<MdAdd />} label="Añadir Producto" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/user-management"} icon={<FaChessKing />} label="Gestión de Roles" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/produccionC"} icon={<FaFlask />} label="Rutas de Producción" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/movimientos"} icon={<FaRegListAlt />} label="Historial de Movimientos" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* ENLACES DE PERFIL Y SOPORTE */}
//                             <div className="p-3 space-y-1">
//                                 <LinkItem to={"/profiles"} icon={<CgProfile />} label="Mi Perfil" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/contact-us"} icon={<BiSupport />} label="Soporte y Contacto" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* BOTÓN EXTRA/ACENTO */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-green-50 text-green-700 font-semibold transition-colors duration-150 border-t border-gray-100" 
//                                 whileHover={{ backgroundColor: '#d1fae5' }} // Hover más suave
//                             >
//                                 <BiPackage className="text-lg"/> 
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // Componente auxiliar LinkItem (Ajustado el estilo para ser elegante)
// const LinkItem = ({ to, icon, label, setIsMenu }) => (
//     <Link to={to} onClick={() => setIsMenu(false)}>
//         <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-green-50 rounded-md transition-all duration-200 text-gray-700 font-medium"
//             whileHover={{ x: 5, backgroundColor: '#f0fdf4' }} // Desplazamiento sutil al hacer hover
//             whileTap={{ scale: 0.98 }}
//         >
//             <span className="text-green-500 text-lg">{icon}</span> 
//             {label}
//         </motion.p>
//     </Link>
// );

// export default SideBar;



// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";
// import Menu from"../../data/Sidebar";
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg";

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const [isOpen,setIsOpen]=useState(true);
//     const [isMenu,setIsMenu]=useState(false);
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem'; // h-20 = 5rem

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10" // 🛑 FIX: Cambiado top-9 a top-20
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {Menu.map((product,index)=>{
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* 🛑 A- CONTENEDOR MÓVIL (Header/Barra) - Altura fija h-20 (5rem) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             // 🛑 FIX: Cambiado top-[4.5rem] a top-[5rem] (HEADER_HEIGHT_MOBILE)
//                             className={`w-64 bg-white shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-hidden sm:hidden rounded-bl-lg`}
//                         >
//                             {/* ENLACES CLAVE */}
//                             <div className="p-3 border-b border-gray-100 space-y-1">
//                                 <LinkItem to={"/panel"}icon={<MdOutlineInventory/>}label="Inventario"setIsMenu={setIsMenu}/>
//                                 <LinkItem to={"/add-product"}icon={<MdAdd/>}label="Añadir Producto"setIsMenu={setIsMenu}/>
//                                 <LinkItem to={"/user-management"}icon={<FaChessKing/>}label="Gestión de Roles"setIsMenu={setIsMenu}/>
//                                 <LinkItem to={"/produccionC"}icon={<FaFlask/>}label="Rutas de Producción"setIsMenu={setIsMenu}/>
//                                 <LinkItem to={"/movimientos"}icon={<FaRegListAlt/>}label="Historial de Movimientos"setIsMenu={setIsMenu}/>
//                             </div>

//                             {/* ENLACES DE PERFIL Y SOPORTE */}
//                             <div className="p-3 space-y-1">
//                                 <LinkItem to={"/profiles"}icon={<CgProfile/>}label="Mi Perfil"setIsMenu={setIsMenu}/>
//                                 <LinkItem to={"/contact-us"}icon={<BiSupport/>}label="Soporte y Contacto"setIsMenu={setIsMenu}/>
//                             </div>

//                             {/* BOTÓN EXTRA/ACENTO */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-green-50 text-green-700 font-semibold transition-colors duration-150 border-t border-gray-100"
//                                 whileHover={{backgroundColor:'#d1fae5'}}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // Componente auxiliar LinkItem (Ajustado el estilo para ser elegante)
// const LinkItem=({to,icon,label,setIsMenu})=>(
//     <Link to={to}onClick={()=>setIsMenu(false)}>
//         <motion.p
//             className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-green-50 rounded-md transition-all duration-200 text-gray-700 font-medium"
//             whileHover={{x:5,backgroundColor:'#f0fdf4'}}
//             whileTap={{scale:0.98}}
//         >
//             <span className="text-green-500 text-lg">{icon}</span>
//             {label}
//         </motion.p>
//     </Link>
// );

// export default SideBar;




// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";
// // Importaciones de Íconos (mantienen la misma estructura)
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// // Componentes y Datos
// import Menu from"../../data/Sidebar";
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg";

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const [isOpen,setIsOpen]=useState(true);
//     // isMenu: Controla si el menú móvil está abierto
//     const [isMenu,setIsMenu]=useState(false); 
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     // Ajuste al useEffect para cerrar el menú móvil al hacer clic fuera o al pasar el tiempo
//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             // Temporizador para cerrar automáticamente (7 segundos)
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem'; // h-20 = 5rem

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) - Sin cambios, usa SideBarItem */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {/* Renderiza el SideBarItem para Escritorio */}
//                     {Menu.map((product,index)=>{
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* 🛑 A- CONTENEDOR MÓVIL (Header/Barra) - Altura fija h-20 (5rem) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             // 🛑 Ajustamos la posición para que caiga justo debajo del header fijo (5rem)
//                             className={`w-64 bg-white shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg`}
//                         >
//                             {/* 🚀 CAMBIO CLAVE: Usamos SideBarItem para renderizar el menú completo. */}
//                             <div className="p-2 space-y-1">
//                                 {Menu.map((product,index)=>{
//                                     // Pasamos 'isOpen=true' para que se vea el texto en el móvil.
//                                     // Pasamos 'setIsMenu' como prop para cerrar el menú al hacer clic.
//                                     return <MobileSideBarItem 
//                                         key={index}
//                                         product={product}
//                                         isOpen={true}
//                                         setIsMenu={setIsMenu}
//                                     />;
//                                 })}
//                             </div>

//                             {/* ENLACES EXTRA (Mantenido el botón de acento) */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-green-50 text-green-700 font-semibold transition-colors duration-150 border-t border-gray-100"
//                                 whileHover={{backgroundColor:'#d1fae5'}}
//                                 whileTap={{scale:0.98}}
//                                 onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // 🛑 NUEVO COMPONENTE: MobileSideBarItem 
// // Simplemente envuelve el SideBarItem original para agregar la lógica de cierre 
// // del menú móvil (setIsMenu(false)) después de hacer clic en un enlace final.
// const MobileSideBarItem = ({ product, isOpen, setIsMenu }) => {
//     // Necesitamos manejar el click en NavLink para cerrar el menú
    
//     // Si tiene submenús, renderiza el SideBarItem normal (la lógica de NavLink está dentro)
//     if (product.childrens && product.childrens.length > 0) {
//         return <SideBarItem product={product} isOpen={isOpen} />;
//     }

//     // Si es un ítem simple, envolvemos NavLink con la lógica de cierre del menú.
//     return (
//         <SideBarItemWrapper onClick={() => setIsMenu(false)} to={product.path}>
//             <SideBarItem product={product} isOpen={isOpen} />
//         </SideBarItemWrapper>
//     );
// };

// // Componente Wrapper para manejar el clic en el ítem simple
// const SideBarItemWrapper = ({ children, onClick, to }) => {
//     return (
//         <Link to={to} onClick={onClick}>
//             {children}
//         </Link>
//     );
// };


// // Componente auxiliar LinkItem (Se elimina porque ya no se usa la lista plana)
// // const LinkItem=({to,icon,label,setIsMenu})=>( ... ); 

// export default SideBar;



// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";
// // Importaciones de Íconos
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// // Componentes y Datos
// import Menu from"../../data/Sidebar";
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg";

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const [isOpen,setIsOpen]=useState(true);
//     // isMenu: Controla si el menú móvil está abierto
//     const [isMenu,setIsMenu]=useState(false); 
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     // Lógica de cierre automático y clic fuera
//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             // Temporizador para cerrar automáticamente (7 segundos)
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem'; // h-20 = 5rem

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 {/* ... (Contenido del Header de Escritorio) ... */}
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {/* Renderiza el SideBarItem para Escritorio */}
//                     {Menu.map((product,index)=>{
//                         // No se pasa 'closeMobileMenu' ya que no aplica aquí
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* A- CONTENEDOR MÓVIL (Header/Barra) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             className={`w-64 bg-white shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg`}
//                         >
//                             {/* 🚀 CORRECCIÓN CLAVE: Usamos SideBarItem directamente. */}
//                             <div className="p-2 space-y-1">
//                                 {Menu.map((product,index)=>{
//                                     return (
//                                         <SideBarItem 
//                                             key={index}
//                                             product={product}
//                                             isOpen={true} // Siempre visible en móvil
//                                             // 🛑 La función de cierre se pasa como prop al SideBarItem
//                                             // para que se ejecute al hacer clic en cualquier NavLink interno.
//                                             closeMobileMenu={() => setIsMenu(false)} 
//                                         />
//                                     );
//                                 })}
//                             </div>

//                             {/* ENLACES EXTRA */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-green-50 text-green-700 font-semibold transition-colors duration-150 border-t border-gray-100"
//                                 whileHover={{backgroundColor:'#d1fae5'}}
//                                 whileTap={{scale:0.98}}
//                                 // 🛑 Aseguramos que el menú se cierre al navegar
//                                 onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// // 🛑 COMPONENTES ELIMINADOS/NO NECESARIOS: MobileSideBarItem y SideBarItemWrapper
// // La lógica se ha movido directamente a SideBarItem.js y la sección móvil de SideBar.js.

// export default SideBar;


// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";
// // Importaciones de Íconos
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// // Componentes y Datos
// import Menu from"../../data/Sidebar"; // Asume que este archivo ya tiene la estructura de Superadministración
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg"; // Asegúrate de que esta ruta sea correcta

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const [isOpen,setIsOpen]=useState(true);
//     const [isMenu,setIsMenu]=useState(false); 
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     // Lógica de cierre automático y clic fuera
//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem'; // h-20 = 5rem

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {/* Renderiza el SideBarItem para Escritorio */}
//                     {Menu.map((product,index)=>{
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* A- CONTENEDOR MÓVIL (Header/Barra) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             // 🛑 CLASES MEJORADAS: Fondo oscuro para alto contraste
//                             className={`w-64 bg-blue-900 shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg`}
//                         >
//                             {/* Renderiza el SideBarItem para móvil, pasando la función de cierre */}
//                             <div className="p-2 space-y-1">
//                                 {Menu.map((product,index)=>{
//                                     return (
//                                         <SideBarItem 
//                                             key={index}
//                                             product={product}
//                                             isOpen={true} // Siempre visible en móvil
//                                             closeMobileMenu={() => setIsMenu(false)} // Función de cierre
//                                         />
//                                     );
//                                 })}
//                             </div>

//                             {/* ENLACES EXTRA */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-blue-800 text-green-400 font-semibold transition-colors duration-150 border-t border-gray-700"
//                                 whileHover={{backgroundColor:'#1e40af'}}
//                                 whileTap={{scale:0.98}}
//                                 onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// export default SideBar;




// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";
// // Importaciones de Íconos
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// // Componentes y Datos
// import Menu from"../../data/Sidebar"; 
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg"; 

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const [isOpen,setIsOpen]=useState(true);
//     const [isMenu,setIsMenu]=useState(false); 
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     // Lógica de cierre automático y clic fuera
//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem'; // h-20 = 5rem

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 {/* ... (Contenido del Header de Escritorio) ... */}
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 <div className="mt-8 space-y-2">
//                     {/* Renderiza el SideBarItem para Escritorio */}
//                     {Menu.map((product,index)=>{
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* A- CONTENEDOR MÓVIL (Header/Barra) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             // 🛑 CAMBIO CLAVE: Fondo semi-transparente (bg-blue-900/90) y sombra más fuerte
//                             className={`w-64 bg-blue-900/90 shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg backdrop-blur-sm`}
//                         >
//                             {/* Renderiza el SideBarItem para móvil, pasando la función de cierre */}
//                             <div className="p-2 space-y-1">
//                                 {Menu.map((product,index)=>{
//                                     return (
//                                         <SideBarItem 
//                                             key={index}
//                                             product={product}
//                                             isOpen={true} // Siempre visible en móvil
//                                             closeMobileMenu={() => setIsMenu(false)} // Función de cierre
//                                         />
//                                     );
//                                 })}
//                             </div>

//                             {/* ENLACES EXTRA (Mantiene buen contraste) */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-blue-800 text-green-400 font-semibold transition-colors duration-150 border-t border-gray-700"
//                                 whileHover={{backgroundColor:'#1e40af'}}
//                                 whileTap={{scale:0.98}}
//                                 onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// export default SideBar;






// import React,{useEffect,useRef,useState}from"react";
// import {useNavigate,Link}from"react-router-dom";

// // ⚠️ IMPORTACIONES DE CONTEXTO Y COMPONENTE ADMIN
// import { useAppContext } from '../SuperUser/AppContext'; // Asegúrate de la ruta correcta
// import AdminImpersonationSelector from '../SuperUser/AdminImpersonationSelector'; // Asegúrate de la ruta correcta

// // Importaciones de Íconos
// import {AiFillGithub}from"react-icons/ai";
// import {SlDirections}from"react-icons/sl";
// import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
// import {motion,AnimatePresence}from"framer-motion";
// import {BsMenuButtonWideFill}from"react-icons/bs";
// import {MdAdd,MdOutlineInventory}from"react-icons/md";
// import {CgProfile}from"react-icons/cg";
// import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// // Componentes y Datos
// import Menu from"../../data/Sidebar"; 
// import SideBarItem from"./SideBarItem";
// import Agro from"../../asset/LOGOS.svg"; 

// const desktopSidebarVariants={
//     open:{width:"18rem",transition:{duration:0.5}},
//     closed:{width:"6rem",transition:{duration:0.5}},
// };

// const SideBar=({children})=>{
//     const { isAdmin } = useAppContext(); // 👈 OBTENER EL ROL DEL CONTEXTO
//     const [isOpen,setIsOpen]=useState(true);
//     const [isMenu,setIsMenu]=useState(false); 
//     const navigate=useNavigate();
//     const menuRef=useRef(null);

//     // Lógica de cierre automático y clic fuera
//     useEffect(()=>{
//         let timerId;
//         if(isMenu){
//             timerId=setTimeout(()=>{
//                 setIsMenu(false);
//             },7000);

//             const clickOutsideHandler=(event)=>{
//                 const menuButton=document.querySelector(".menu-toggle-button");
//                 if(menuButton&&menuButton.contains(event.target))return;

//                 if(menuRef.current&&!menuRef.current.contains(event.target)){
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown',clickOutsideHandler);
//             document.addEventListener('touchstart',clickOutsideHandler);

//             return()=>{
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown',clickOutsideHandler);
//                 document.removeEventListener('touchstart',clickOutsideHandler);
//             };
//         }
//         return()=>{
//             if(timerId){
//                 clearTimeout(timerId);
//             }
//         };
//     },[isMenu]);

//     const goHome=()=>{
//         navigate("/");
//     };

//     const HEADER_HEIGHT_MOBILE='5rem';

//     return(
//         <div className="flex min-h-screen bg-gray-50">

//             {/* MENÚ DE ESCRITORIO (sm:block) */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen?"open":"closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
//             >
//                 {/* Logo y Título */}
//                 <div className="inline-flex gap-5 justify-center items-center">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{scale:1.1,rotate:5}}
//                     >
//                         <FaSeedling/>
//                     </motion.p>
//                     <motion.h1
//                         initial={{opacity:0,x:-10}}
//                         animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
//                         transition={{duration:0.3}}
//                         className="origin-left text-2xl font-bold text-white"
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 {/* Botón de expansión */}
//                 <motion.div
//                     onClick={()=>setIsOpen(!isOpen)}
//                     whileHover={{scale:1.1,rotate:180}}
//                     className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
//                     />
//                 </motion.div>

//                 {/* Barra de Búsqueda */}
//                 <motion.div
//                     initial={{opacity:0}}
//                     animate={{opacity:isOpen?1:0}}
//                     transition={{duration:0.3}}
//                     className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
//                 >
//                     <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
//                     <input
//                         type="search"
//                         placeholder=" Buscar..."
//                         className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                     />
//                 </motion.div>

//                 {/* 👑 SELECTOR DE SUPER USUARIO (ESCRITORIO) 👑 */}
//                 {isOpen && isAdmin && (
//                     <AdminImpersonationSelector /> 
//                 )}

//                 <div className="mt-8 space-y-2">
//                     {/* Renderiza el SideBarItem para Escritorio */}
//                     {Menu.map((product,index)=>{
//                         return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 MENÚ MÓVIL (sm:hidden)
//                 ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
//                 {/* A- CONTENEDOR MÓVIL (Header/Barra) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
//                     <div className="flex items-center">
//                         <img src={Agro}alt="agro"className="w-[140px]"/>
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
//                         <BsMenuButtonWideFill
//                             onClick={()=>setIsMenu(!isMenu)}
//                             className="text-white text-xl"
//                         />
//                     </div>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
//                 <AnimatePresence>
//                     {isMenu&&(
//                         <motion.div
//                             ref={menuRef}
//                             initial={{opacity:0,x:'100%'}}
//                             animate={{opacity:1,x:0}}
//                             exit={{opacity:0,x:'100%'}}
//                             transition={{type:"spring",stiffness:300,damping:30}}
//                             className={`w-64 bg-blue-900/90 shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg backdrop-blur-sm`}
//                         >
//                             {/* 👑 SELECTOR DE SUPER USUARIO (MÓVIL) 👑 */}
//                             {isAdmin && (
//                                 <AdminImpersonationSelector />
//                             )}
                            
//                             {/* Renderiza el SideBarItem para móvil */}
//                             <div className="p-2 space-y-1">
//                                 {Menu.map((product,index)=>{
//                                     return (
//                                         <SideBarItem 
//                                             key={index}
//                                             product={product}
//                                             isOpen={true}
//                                             closeMobileMenu={() => setIsMenu(false)}
//                                         />
//                                     );
//                                 })}
//                             </div>

//                             {/* ENLACES EXTRA */}
//                             <motion.p
//                                 className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-blue-800 text-green-400 font-semibold transition-colors duration-150 border-t border-gray-700"
//                                 whileHover={{backgroundColor:'#1e40af'}}
//                                 whileTap={{scale:0.98}}
//                                 onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
//                             >
//                                 <BiPackage className="text-lg"/>
//                                 Nueva Expedición
//                             </motion.p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="flex-1 w-full">{children}</div>
//             </div>
//         </div>
//     );
// };

// export default SideBar;




import React,{useEffect,useRef,useState}from"react";
import {useNavigate,Link}from"react-router-dom";

// ⚠️ IMPORTACIONES DE CONTEXTO Y COMPONENTE ADMIN
import { useAppContext } from '../SuperUser/AppContext'; // Asegúrate de la ruta correcta
import AdminImpersonationSelector from '../SuperUser/AdminImpersonationSelector'; // Asegúrate de la ruta correcta

// Importaciones de Íconos
import {AiFillGithub}from"react-icons/ai";
import {SlDirections}from"react-icons/sl";
import {BiSearchAlt2,BiSupport,BiPackage}from"react-icons/bi";
import {motion,AnimatePresence}from"framer-motion";
import {BsMenuButtonWideFill}from"react-icons/bs";
import {MdAdd,MdOutlineInventory}from"react-icons/md";
import {CgProfile}from"react-icons/cg";
import {FaChessKing,FaExchangeAlt,FaSeedling,FaFlask,FaRegListAlt}from"react-icons/fa";

// Componentes y Datos
import Menu from"../../data/Sidebar"; 
import SideBarItem from"./SideBarItem";
import Agro from"../../asset/LOGOS.svg"; 

const desktopSidebarVariants={
    open:{width:"18rem",transition:{duration:0.5}},
    closed:{width:"6rem",transition:{duration:0.5}},
};

const SideBar=({children})=>{
    const { isAdmin } = useAppContext(); // 👈 OBTENER EL ROL DEL CONTEXTO
    const [isOpen,setIsOpen]=useState(true);
    const [isMenu,setIsMenu]=useState(false); 
    const navigate=useNavigate();
    const menuRef=useRef(null);

    // Lógica de cierre automático y clic fuera
    useEffect(()=>{
        let timerId;
        if(isMenu){
            timerId=setTimeout(()=>{
                setIsMenu(false);
            },7000);

            const clickOutsideHandler=(event)=>{
                const menuButton=document.querySelector(".menu-toggle-button");
                if(menuButton&&menuButton.contains(event.target))return;

                if(menuRef.current&&!menuRef.current.contains(event.target)){
                    setIsMenu(false);
                }
            };

            document.addEventListener('mousedown',clickOutsideHandler);
            document.addEventListener('touchstart',clickOutsideHandler);

            return()=>{
                clearTimeout(timerId);
                document.removeEventListener('mousedown',clickOutsideHandler);
                document.removeEventListener('touchstart',clickOutsideHandler);
            };
        }
        return()=>{
            if(timerId){
                clearTimeout(timerId);
            }
        };
    },[isMenu]);

    const goHome=()=>{
        navigate("/");
    };

    const HEADER_HEIGHT_MOBILE='5rem';

    return(
        <div className="flex min-h-screen bg-gray-50">

            {/* MENÚ DE ESCRITORIO (sm:block) */}
            <motion.div
                variants={desktopSidebarVariants}
                animate={isOpen?"open":"closed"}
                initial={false}
                className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30"
            >
                {/* Logo y Título */}
                <div className="inline-flex gap-5 justify-center items-center">
                    <motion.p
                        className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
                        onClick={goHome}
                        whileHover={{scale:1.1,rotate:5}}
                    >
                        <FaSeedling/>
                    </motion.p>
                    <motion.h1
                        initial={{opacity:0,x:-10}}
                        animate={{opacity:isOpen?1:0,x:isOpen?0:-10}}
                        transition={{duration:0.3}}
                        className="origin-left text-2xl font-bold text-white"
                    >
                        HORTICULTURA
                    </motion.h1>
                </div>

                {/* Botón de expansión */}
                <motion.div
                    onClick={()=>setIsOpen(!isOpen)}
                    whileHover={{scale:1.1,rotate:180}}
                    className=" text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10"
                >
                    <SlDirections
                        className={`transition-transform duration-500 ${!isOpen?"rotate-180":""}`}
                    />
                </motion.div>

                {/* Barra de Búsqueda */}
                <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:isOpen?1:0}}
                    transition={{duration:0.3}}
                    className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2"
                >
                    <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer"/>
                    <input
                        type="search"
                        placeholder=" Buscar..."
                        className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
                    />
                </motion.div>

                {/* 👑 SELECTOR DE SUPER USUARIO (ESCRITORIO) 👑 */}
                {/* ESTE SÓLO SE MUESTRA SI isOpen es true Y el usuario es Admin */}
                {isOpen && isAdmin && (
                    <AdminImpersonationSelector /> 
                )}

                <div className="mt-8 space-y-2">
                    {/* Renderiza el SideBarItem para Escritorio */}
                    {/* Todos los menús (product) se renderizan aquí */}
                    {Menu.map((product,index)=>{
                        return <SideBarItem key={index}product={product}isOpen={isOpen}/>;
                    })}
                </div>
            </motion.div>

            {/* =======================================================
                MENÚ MÓVIL (sm:hidden)
                ======================================================= */}
            <div className="w-full flex-1 flex flex-col">
                {/* A- CONTENEDOR MÓVIL (Header/Barra) */}
                <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 relative z-10 shadow-md">
                    <div className="flex items-center">
                        <img src={Agro}alt="agro"className="w-[140px]"/>
                    </div>
                    
                    {/* BOTÓN HAMBURGUESA CIRCULAR */}
                    <div className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button">
                        <BsMenuButtonWideFill
                            onClick={()=>setIsMenu(!isMenu)}
                            className="text-white text-xl"
                        />
                    </div>
                </div>

                {/* B- MENÚ DESPLEGABLE CON ANIMACIÓN Y EFECTOS */}
                <AnimatePresence>
                    {isMenu&&(
                        <motion.div
                            ref={menuRef}
                            initial={{opacity:0,x:'100%'}}
                            animate={{opacity:1,x:0}}
                            exit={{opacity:0,x:'100%'}}
                            transition={{type:"spring",stiffness:300,damping:30}}
                            className={`w-64 bg-blue-900/90 shadow-2xl border-t-4 border-green-500 flex-col absolute top-[${HEADER_HEIGHT_MOBILE}] right-0 z-50 overflow-y-auto max-h-[calc(100vh-5rem)] sm:hidden rounded-bl-lg backdrop-blur-sm`}
                        >
                            {/* 👑 SELECTOR DE SUPER USUARIO (MÓVIL) 👑 */}
                            {/* ESTE SÓLO SE MUESTRA SI el usuario es Admin */}
                            {isAdmin && (
                                <AdminImpersonationSelector />
                            )}
                            
                            {/* Renderiza el SideBarItem para móvil */}
                            <div className="p-2 space-y-1">
                                {Menu.map((product,index)=>{
                                    return (
                                        <SideBarItem 
                                            key={index}
                                            product={product}
                                            isOpen={true}
                                            closeMobileMenu={() => setIsMenu(false)}
                                        />
                                    );
                                })}
                            </div>

                            {/* ENLACES EXTRA */}
                            <motion.p
                                className="px-4 py-3 flex items-center gap-3 text-sm cursor-pointer bg-blue-800 text-green-400 font-semibold transition-colors duration-150 border-t border-gray-700"
                                whileHover={{backgroundColor:'#1e40af'}}
                                whileTap={{scale:0.98}}
                                onClick={() => { navigate("/expedicion-nueva"); setIsMenu(false); }}
                            >
                                <BiPackage className="text-lg"/>
                                Nueva Expedición
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 w-full">{children}</div>
            </div>
        </div>
    );
};

export default SideBar;






// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AiFillGithub } from "react-icons/ai";
// import { SlDirections } from "react-icons/sl";
// import { BiSearchAlt2, BiSupport, BiPackage } from "react-icons/bi";
// import { motion, AnimatePresence } from "framer-motion";
// import { BsMenuButtonWideFill } from "react-icons/bs";
// import { MdAdd, MdOutlineInventory } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { FaChessKing, FaExchangeAlt, FaSeedling, FaFlask, FaRegListAlt } from "react-icons/fa";
// import Menu from "../../data/Sidebar"; // Asumo que este archivo existe
// import SideBarItem from "./SideBarItem"; // Asumo que este componente existe
// import Agro from "../../asset/LOGOS.svg"; // Asumo que esta imagen existe

// // Constante para la altura del encabezado móvil
// const HEADER_HEIGHT_MOBILE = '5rem'; // h-20 = 5rem

// // Variantes para el menú de escritorio (Desktop/Tablet)
// const desktopSidebarVariants = {
//     open: { width: "18rem", transition: { duration: 0.5 } },
//     closed: { width: "6rem", transition: { duration: 0.5 } },
// };

// // Componente Auxiliar para los enlaces del Menú Móvil
// const LinkItem = ({ to, icon, label, setIsMenu }) => {
//     const handleCloseMenu = () => {
//         // Cierra el menú móvil al hacer clic
//         setIsMenu(false);
//     };

//     return (
//         <Link to={to} onClick={handleCloseMenu}>
//             <motion.p
//                 className="px-4 py-3 flex items-center gap-4 text-base cursor-pointer hover:bg-green-50 rounded-lg transition-all duration-200 text-gray-700 font-semibold"
//                 whileHover={{ x: 5, backgroundColor: '#f0fdf4' }}
//                 whileTap={{ scale: 0.95 }}
//             >
//                 <span className="text-green-600 text-xl">{icon}</span>
//                 {label}
//             </motion.p>
//         </Link>
//     );
// };

// const SideBar = ({ children }) => {
//     const [isOpen, setIsOpen] = useState(true); // Estado del sidebar de escritorio
//     const [isMenu, setIsMenu] = useState(false); // Estado del menú desplegable móvil
//     const navigate = useNavigate();
//     const menuRef = useRef(null);

//     // Lógica para cerrar el menú móvil al hacer clic fuera o después del temporizador
//     useEffect(() => {
//         let timerId;
//         if (isMenu) {
//             // Temporizador de cierre automático después de 7 segundos
//             timerId = setTimeout(() => {
//                 setIsMenu(false);
//             }, 7000);

//             const clickOutsideHandler = (event) => {
//                 const menuButton = document.querySelector(".menu-toggle-button");
//                 // Si haces clic en el botón de hamburguesa, no cierres el menú
//                 if (menuButton && menuButton.contains(event.target)) return;

//                 // Si el clic es fuera del área del menú, ciérralo
//                 if (menuRef.current && !menuRef.current.contains(event.target)) {
//                     setIsMenu(false);
//                 }
//             };

//             document.addEventListener('mousedown', clickOutsideHandler);
//             document.addEventListener('touchstart', clickOutsideHandler);

//             return () => {
//                 clearTimeout(timerId);
//                 document.removeEventListener('mousedown', clickOutsideHandler);
//                 document.removeEventListener('touchstart', clickOutsideHandler);
//             };
//         }
//         return () => {
//             if (timerId) {
//                 clearTimeout(timerId);
//             }
//         };
//     }, [isMenu]);

//     const goHome = () => {
//         navigate("/");
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-50">

//             {/* =======================================================
//                 MENÚ DE ESCRITORIO (Desktop/Tablet - sm:block)
//             ======================================================= */}
//             <motion.div
//                 variants={desktopSidebarVariants}
//                 animate={isOpen ? "open" : "closed"}
//                 initial={false}
//                 className="hidden sm:block bg-blue-900 p-5 pt-8 min-h-screen relative shadow-2xl z-30 flex-shrink-0"
//             >
//                 {/* Logo y Título */}
//                 <div className="inline-flex gap-5 justify-center items-center overflow-hidden">
//                     <motion.p
//                         className="text-4xl font-bold mt-1 text-green-400 cursor-pointer"
//                         onClick={goHome}
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                         title="Inicio"
//                     >
//                         <FaSeedling />
//                     </motion.p>
//                     <motion.h1
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
//                         transition={{ duration: 0.3 }}
//                         className={`origin-left text-2xl font-bold text-white whitespace-nowrap ${!isOpen && 'hidden'}`}
//                     >
//                         HORTICULTURA
//                     </motion.h1>
//                 </div>

//                 {/* Botón de Toggle */}
//                 <motion.div
//                     onClick={() => setIsOpen(!isOpen)}
//                     whileHover={{ scale: 1.1, rotate: 180 }}
//                     className="text-4xl rounded-full bg-green-500 p-2 cursor-pointer absolute -right-4 top-20 text-white border-4 border-blue-900 z-10 shadow-lg"
//                 >
//                     <SlDirections
//                         className={`transition-transform duration-500 ${!isOpen ? "rotate-180" : ""}`}
//                     />
//                 </motion.div>

//                 {/* Campo de Búsqueda (solo visible si está abierto) */}
//                 <AnimatePresence>
//                     {isOpen && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 'auto' }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="flex items-center bg-blue-800 rounded-md mt-6 px-4 py-2 overflow-hidden"
//                         >
//                             <BiSearchAlt2 className="text-lg text-green-400 cursor-pointer" />
//                             <input
//                                 type="search"
//                                 placeholder=" Buscar..."
//                                 className="w-full focus:outline-none bg-transparent text-white ml-2 placeholder-green-400"
//                             />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Enlaces Principales del Sidebar */}
//                 <div className="mt-8 space-y-2">
//                     {Menu.map((product, index) => {
//                         // Asegúrate de que SideBarItem maneje el estado `isOpen` correctamente
//                         return <SideBarItem key={index} product={product} isOpen={isOpen} />;
//                     })}
//                 </div>
//             </motion.div>

//             {/* =======================================================
//                 CONTENIDO PRINCIPAL Y BARRA SUPERIOR MÓVIL
//             ======================================================= */}
//             <div className="w-full flex-1 flex flex-col">
                
//                 {/* A- ENCABEZADO MÓVIL (sm:hidden) */}
//                 <div className="flex bg-blue-900 sm:hidden justify-between items-center px-4 h-20 sticky top-0 left-0 w-full z-40 shadow-xl">
//                     <div className="flex items-center">
//                         <img src={Agro} alt="agro" className="w-[140px]" />
//                     </div>
                    
//                     {/* BOTÓN HAMBURGUESA CIRCULAR */}
//                     <motion.button
//                         onClick={() => setIsMenu(!isMenu)}
//                         className="flex p-3 justify-center items-center rounded-full bg-green-500 menu-toggle-button shadow-md"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <BsMenuButtonWideFill
//                             className="text-white text-xl"
//                         />
//                     </motion.button>
//                 </div>

//                 {/* B- MENÚ DESPLEGABLE MÓVIL (AnimatePresence para entrada/salida) */}
//                 <AnimatePresence>
//                     {isMenu && (
//                         <motion.div
//                             ref={menuRef}
//                             initial={{ opacity: 0, x: '100%' }} // Inicia fuera de la pantalla a la derecha
//                             animate={{ opacity: 1, x: 0 }} // Se desliza a la posición 0
//                             exit={{ opacity: 0, x: '100%' }} // Vuelve a deslizarse a la derecha al salir
//                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             // FIX: Usar 'fixed' para que cubra la pantalla y z-50 para superponerse
//                             className={`w-64 max-w-[80%] bg-white shadow-2xl border-t-4 border-green-500 flex-col fixed top-[${HEADER_HEIGHT_MOBILE}] right-0 h-[calc(100vh-${HEADER_HEIGHT_MOBILE})] z-50 overflow-y-auto rounded-bl-lg`}
//                         >
//                             {/* ENLACES CLAVE */}
//                             <div className="p-3 border-b border-gray-100 space-y-1">
//                                 <LinkItem to={"/panel"} icon={<MdOutlineInventory />} label="Inventario" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/add-product"} icon={<MdAdd />} label="Añadir Producto" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/user-management"} icon={<FaChessKing />} label="Gestión de Roles" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/produccionC"} icon={<FaFlask />} label="Rutas de Producción" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/movimientos"} icon={<FaRegListAlt />} label="Historial de Movimientos" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* ENLACES DE PERFIL Y SOPORTE */}
//                             <div className="p-3 space-y-1 border-b border-gray-100">
//                                 <LinkItem to={"/profiles"} icon={<CgProfile />} label="Mi Perfil" setIsMenu={setIsMenu} />
//                                 <LinkItem to={"/contact-us"} icon={<BiSupport />} label="Soporte y Contacto" setIsMenu={setIsMenu} />
//                             </div>

//                             {/* BOTÓN EXTRA/ACENTO */}
//                             <Link to="/new-expedition" onClick={() => setIsMenu(false)}>
//                                 <motion.div
//                                     className="px-4 py-3 flex items-center gap-4 text-base cursor-pointer bg-green-50 text-green-700 font-bold transition-colors duration-150 border-t border-gray-100"
//                                     whileHover={{ backgroundColor: '#d1fae5', scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                 >
//                                     <BiPackage className="text-xl" />
//                                     Nueva Expedición
//                                 </motion.div>
//                             </Link>

//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Contenedor del contenido del componente hijo */}
//                 <div className="flex-1 w-full p-4 sm:p-6 overflow-x-hidden">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SideBar;