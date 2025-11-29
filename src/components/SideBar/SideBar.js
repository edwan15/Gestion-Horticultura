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