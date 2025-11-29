import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SlDirections } from "react-icons/sl";
import { BiSearchAlt2, BiSupport, BiPackage } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { MdAdd, MdOutlineInventory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaChessKing, FaFlask, FaRegListAlt, FaSeedling } from "react-icons/fa";
import Menu from "../../data/Sidebar"; 
import SideBarItem from "./SideBarItem"; 
import Agro from "../../asset/LOGOS.svg"; 
import { useAppContext } from '../SuperUser/AppContext'; 
import AdminImpersonationSelector from '../SuperUser/AdminImpersonationSelector'; 

// Constante para la altura del encabezado móvil
const HEADER_HEIGHT_MOBILE = '4rem'; // h-16 = 4rem

// Variantes para el menú de escritorio (Desktop/Tablet)
const desktopSidebarVariants = {
    open: { width: "17rem", transition: { duration: 0.4, ease: "easeInOut" } },
    closed: { width: "5rem", transition: { duration: 0.4, ease: "easeInOut" } },
};

// Componente Auxiliar para los enlaces del Menú Móvil
const LinkItem = ({ to, icon, label, setIsMenu }) => {
    return (
        <Link to={to} onClick={() => setIsMenu(false)}>
            <motion.div
                className="px-4 py-3 flex items-center gap-4 text-sm font-medium cursor-pointer text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 mx-2"
                whileTap={{ scale: 0.98 }}
            >
                <span className="text-xl text-gray-500 group-hover:text-green-600">{icon}</span>
                {label}
            </motion.div>
        </Link>
    );
};

const SideBar = ({ children }) => {
    const { isAdmin } = useAppContext();
    const [isOpen, setIsOpen] = useState(true); 
    const [isMenu, setIsMenu] = useState(false); 
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Lógica para cerrar el menú móvil
    useEffect(() => {
        let timerId;
        if (isMenu) {
            timerId = setTimeout(() => setIsMenu(false), 7000);
            const clickOutsideHandler = (event) => {
                const menuButton = document.querySelector(".menu-toggle-button");
                if (menuButton && menuButton.contains(event.target)) return;
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setIsMenu(false);
                }
            };
            document.addEventListener('mousedown', clickOutsideHandler);
            document.addEventListener('touchstart', clickOutsideHandler);
            return () => {
                clearTimeout(timerId);
                document.removeEventListener('mousedown', clickOutsideHandler);
                document.removeEventListener('touchstart', clickOutsideHandler);
            };
        }
        return () => timerId && clearTimeout(timerId);
    }, [isMenu]);

    const goHome = () => navigate("/");

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* =======================================================
                MENÚ DE ESCRITORIO (Desktop/Tablet - sm:block)
            ======================================================= */}
            <motion.div
                variants={desktopSidebarVariants}
                animate={isOpen ? "open" : "closed"}
                initial={false}
                className="hidden lg:flex flex-col bg-green-900 text-white min-h-screen relative shadow-xl z-30 flex-shrink-0"
            >
                {/* Header del Sidebar */}
                <div className="h-16 flex items-center justify-center border-b border-green-800/50 relative">
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer overflow-hidden px-4"
                        onClick={goHome}
                    >
                        <FaSeedling className="text-2xl text-green-400 flex-shrink-0" />
                        <motion.h1
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            className="text-xl font-bold tracking-wider whitespace-nowrap overflow-hidden"
                        >
                            HORTICULTURA
                        </motion.h1>
                    </motion.div>
                </div>

                {/* Botón de Toggle Flotante */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-20 bg-white text-green-800 p-1 rounded-full shadow-md border border-gray-200 hover:bg-green-50 transition-colors z-50"
                >
                    <SlDirections className={`text-lg transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Contenido Scrollable */}
                <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                    
                    {/* Barra de Búsqueda */}
                    <div className={`flex items-center bg-green-800/50 rounded-lg px-3 py-2 mb-6 transition-all ${!isOpen ? 'justify-center' : ''}`}>
                        <BiSearchAlt2 className="text-xl text-green-300" />
                        {isOpen && (
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-green-300/70 ml-2 w-full"
                            />
                        )}
                    </div>

                    {/* Selector de Admin */}
                    {isOpen && isAdmin && (
                        <div className="mb-4">
                            <AdminImpersonationSelector />
                        </div>
                    )}

                    {/* Menú Items */}
                    <div className="space-y-1">
                        {Menu.map((product, index) => (
                            <SideBarItem key={index} product={product} isOpen={isOpen} />
                        ))}
                    </div>
                </div>

                {/* Footer del Sidebar */}
                <div className="p-4 border-t border-green-800/50">
                    <div className={`flex items-center ${!isOpen ? 'justify-center' : 'gap-3'}`}>
                        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-xs font-bold">
                            HF
                        </div>
                        {isOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">Horticultura SL</p>
                                <p className="text-xs text-green-300 truncate">Plan Enterprise</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* =======================================================
                CONTENIDO PRINCIPAL Y BARRA SUPERIOR MÓVIL
            ======================================================= */}
            <div className="w-full flex-1 flex flex-col h-screen overflow-hidden">
                
                {/* A- ENCABEZADO MÓVIL (lg:hidden) - Ahora integrado en el Header principal, 
                    pero mantenemos la lógica del menú móvil aquí si es necesario o 
                    simplemente usamos el Header global. 
                    
                    NOTA: El Header global ya maneja el botón de menú. 
                    Aquí solo necesitamos renderizar el menú desplegable si `isMenu` es true.
                */}
                
                {/* B- MENÚ DESPLEGABLE MÓVIL (Overlay) */}
                <AnimatePresence>
                    {isMenu && (
                        <>
                            {/* Backdrop Oscuro */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenu(false)}
                                className="fixed inset-0 bg-black z-40 lg:hidden"
                            />
                            
                            {/* Drawer del Menú */}
                            <motion.div
                                ref={menuRef}
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 w-72 h-full bg-white shadow-2xl z-50 lg:hidden flex flex-col"
                            >
                                {/* Header del Drawer */}
                                <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-green-900 text-white">
                                    <FaSeedling className="text-2xl text-green-400 mr-3" />
                                    <span className="font-bold text-lg">HORTICULTURA</span>
                                </div>

                                {/* Contenido del Drawer */}
                                <div className="flex-1 overflow-y-auto py-4">
                                    {isAdmin && (
                                        <div className="px-4 mb-4">
                                            <AdminImpersonationSelector />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {/* Enlaces Rápidos */}
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Accesos Directos
                                        </div>
                                        <LinkItem to={"/panel"} icon={<MdOutlineInventory />} label="Inventario" setIsMenu={setIsMenu} />
                                        <LinkItem to={"/add-product"} icon={<MdAdd />} label="Añadir Producto" setIsMenu={setIsMenu} />
                                        
                                        <div className="my-4 border-t border-gray-100"></div>
                                        
                                        {/* Menú Principal (Reutilizando lógica si es posible, o hardcodeando items clave) */}
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Navegación
                                        </div>
                                        {Menu.map((product, index) => (
                                            <SideBarItem 
                                                key={index} 
                                                product={product} 
                                                isOpen={true} 
                                                isMobile={true}
                                                closeMobileMenu={() => setIsMenu(false)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Footer del Drawer */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <Link to="/contact-us" onClick={() => setIsMenu(false)} className="flex items-center gap-3 text-gray-600 hover:text-green-600">
                                        <BiSupport className="text-xl" />
                                        <span className="text-sm font-medium">Soporte y Ayuda</span>
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Contenedor del contenido del componente hijo */}
                <div className="flex-1 w-full overflow-y-auto bg-gray-50 scroll-smooth">
                     {React.Children.map(children, child => {
                        // Intento pasar la prop onMenuToggle si el hijo la acepta
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { onMenuToggle: () => setIsMenu(true) });
                        }
                        return child;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideBar;