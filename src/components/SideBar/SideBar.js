import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SlDirections } from "react-icons/sl";
import { BiSearchAlt2, BiSupport, BiPackage } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { MdAdd, MdOutlineInventory } from "react-icons/md";
import { FaSeedling } from "react-icons/fa";
import Menu from "../../data/Sidebar"; 
import SideBarItem from "./SideBarItem"; 
import { useAppContext } from '../SuperUser/AppContext'; 


// Variantes para el menú de escritorio (Desktop/Tablet)
const desktopSidebarVariants = {
    open: { width: "15rem", transition: { duration: 0.4, ease: "easeInOut" } },
    closed: { width: "5rem", transition: { duration: 0.4, ease: "easeInOut" } },
};

// Componente Auxiliar para los enlaces del Menú Móvil
const LinkItem = ({ to, icon, label, setIsMenu }) => {
    return (
        <Link to={to} onClick={() => setIsMenu(false)}>
            <motion.div
                className="px-4 py-3 flex items-center gap-4 text-sm font-extrabold cursor-pointer text-gray-900 hover:bg-white/80 hover:text-green-700 rounded-xl transition-all duration-300 mx-2 backdrop-blur-sm border border-transparent hover:border-green-200 hover:shadow-md"
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ x: 4 }}
            >
                <span className="text-xl text-green-600">{icon}</span>
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
                className="hidden lg:flex flex-col bg-white text-gray-700 min-h-screen relative shadow-xl z-[3000] flex-shrink-0 border-r border-gray-200"
            >
                {/* Header del Sidebar */}
                <div className="h-16 flex items-center justify-center bg-green-600 relative overflow-hidden">
                     {/* Decorative background pattern or gradient could go here */}
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer z-10 px-4"
                        onClick={goHome}
                    >
                        <FaSeedling className="text-2xl text-white flex-shrink-0" />
                        <motion.h1
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            className="text-xl font-bold tracking-wider whitespace-nowrap overflow-hidden text-white"
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
                <div className="flex-1 overflow-y-auto py-4 px-0 custom-scrollbar">
                    
                    {/* Barra de Búsqueda */}
                    <div className={`mx-3 flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6 transition-all border border-gray-200 ${!isOpen ? 'justify-center' : ''}`}>
                        <BiSearchAlt2 className="text-xl text-gray-500" />
                        {isOpen && (
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 ml-2 w-full"
                            />
                        )}
                    </div>
                    {/* Menú Items */}
                    <div className="space-y-1">
                        {Menu.map((product, index) => (
                            <SideBarItem key={index} product={product} isOpen={isOpen} />
                        ))}
                    </div>
                </div>

                {/* Footer del Sidebar */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className={`flex items-center ${!isOpen ? 'justify-center' : 'gap-3'}`}>
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                            HF
                        </div>
                        {isOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-800 truncate">Horticultura SL</p>
                                <p className="text-xs text-green-600 font-semibold truncate">Plan Enterprise</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* =======================================================
                CONTENIDO PRINCIPAL Y BARRA SUPERIOR MÓVIL
            ======================================================= */}
            <div className="w-full flex-1 flex flex-col">
                
                {/* MENÚ DESPLEGABLE MÓVIL (Overlay) - GLASSMORPHISM DESIGN */}
                <AnimatePresence>
                    {isMenu && (
                        <>
                            {/* Backdrop con efecto blur y transparencia */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setIsMenu(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                                style={{ backdropFilter: 'blur(8px)' }}
                            />
                            
                            {/* Drawer del Menú con Glassmorphism */}
                            <motion.div
                                ref={menuRef}
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    damping: 30, 
                                    stiffness: 300,
                                    opacity: { duration: 0.2 }
                                }}
                                className="fixed top-0 left-0 w-80 h-full z-[3050] lg:hidden flex flex-col shadow-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.85)',
                                    backdropFilter: 'blur(20px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                {/* Header del Drawer con gradiente y glassmorphism */}
                                <motion.div 
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="h-20 flex items-center px-6 relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.95) 0%, rgba(21, 128, 61, 0.9) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    {/* Efecto de brillo animado */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        animate={{
                                            x: ['-100%', '100%']
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 5
                                        }}
                                    />
                                    
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="relative z-10"
                                    >
                                        <FaSeedling className="text-3xl text-green-300 mr-3 drop-shadow-lg" />
                                    </motion.div>
                                    <div className="relative z-10">
                                        <span className="font-bold text-xl text-white tracking-wide drop-shadow-md">HORTICULTURA</span>
                                        <p className="text-xs text-green-200 font-medium">Sistema Empresarial</p>
                                    </div>
                                </motion.div>

                                {/* Contenido del Drawer con scroll suave */}
                                <div className="flex-1 overflow-y-auto py-6 px-2 custom-scrollbar">
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="space-y-2"
                                    >
                                        {/* Enlaces Rápidos con diseño premium */}
                                         <div className="px-4 py-2 text-xs font-extrabold text-gray-900 uppercase tracking-widest flex items-center gap-2" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)' }}>                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                                            <span>Accesos Directos</span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                                        </div>
                                        
                                        <LinkItem to={"/panel"} icon={<MdOutlineInventory />} label="Inventario" setIsMenu={setIsMenu} />
                                        <LinkItem to={"/add-product"} icon={<MdAdd />} label="Añadir Producto" setIsMenu={setIsMenu} />
                                        
                                        {/* Separador con efecto glassmorphism */}
                                        <div className="my-6 mx-4">
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                        </div>
                                        
                                        {/* Menú Principal */}
                                        <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                                            <span>Navegación</span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                                        </div>
                                        
                                        {Menu.map((product, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 + (index * 0.05) }}
                                            >
                                                <SideBarItem 
                                                    product={product} 
                                                    isOpen={true} 
                                                    isMobile={true}
                                                    closeMobileMenu={() => setIsMenu(false)}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Footer del Drawer con glassmorphism */}
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-4 relative"
                                    style={{
                                        background: 'rgba(249, 250, 251, 0.8)',
                                        backdropFilter: 'blur(10px)',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.5)'
                                    }}
                                >
                                    <Link 
                                        to="/contact-us" 
                                        onClick={() => setIsMenu(false)} 
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-md hover:shadow-xl hover:bg-white/80 transition-all duration-300 group"
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <BiSupport className="text-2xl text-green-600 group-hover:text-green-700" />
                                        </motion.div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 block">Soporte y Ayuda</span>
                                            <span className="text-xs text-gray-500">Estamos aquí para ti</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Contenedor del contenido del componente hijo */}
                <div className="flex-1 w-full bg-gray-50">
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