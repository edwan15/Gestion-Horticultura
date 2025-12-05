import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import { MdKeyboardArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; 

const SideBarItem = ({ isOpen, product, isMobile }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    // 🛑 NUEVOS COLORES PARA ALTO CONTRASTE SOBRE FONDO AZUL-900 🛑

    // 1. Clases para un elemento activo (seleccionado)
    const activeBg = "bg-green-600 shadow-xl"; // Fondo verde sólido (para que destaque mucho)
    const activeText = "text-white"; 
    
    // 2. Clases para un elemento inactivo
    // Si es Móvil (fondo claro): Texto Negro -> Hover Blanco
    // Si es Desktop (fondo oscuro): Texto Claro -> Hover Blanco
    const inactiveText = isMobile 
        ? "text-gray-900 hover:text-white" 
        : "text-gray-300 hover:text-white";
        
    const hoverBg = "hover:bg-green-800"; // Fondo verde oscuro un poco más claro para hover
    
    // 3. Color de acento para Íconos y Flechas (siempre visible)
    const iconAccent = "text-green-400";

    // Clase base para cualquier elemento del menú
    const baseClass = "flex items-center p-3 my-1 rounded-xl cursor-pointer transition-all duration-300";
    
    // Variante de Framer Motion para la lista colapsable (se mantiene igual)
    const subMenuVariants = {
        hidden: { height: 0, opacity: 0, transition: { duration: 0.3 } },
        visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    };

    // -----------------------------------------------------------
    // 1. ÍTEM CON SUBMENÚ (product.childrens existe)
    // -----------------------------------------------------------
    if (product.childrens && product.childrens.length > 0) {
        // Determina si alguno de los subítems está activo para resaltar el menú padre
        const isParentActive = product.childrens.some(child => 
            location.pathname.startsWith(child.path)
        );
        
        // Clase condicional para el menú padre
        const parentLinkClass = isParentActive 
            ? `${baseClass} ${activeBg} ${activeText}` // Activo: Fondo verde, Texto blanco
            : `${baseClass} ${inactiveText} ${hoverBg}`; // Inactivo: Texto claro, Hover azul-800


        return (
            <div className="text-sm">
                {/* ENCABEZADO DEL MENÚ PADRE */}
                <motion.div 
                    className={parentLinkClass} 
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Icono y Título */}
                    <span className="flex gap-4 items-center w-full">
                        {product.icon && (
                            // 🛑 ICONO EN COLOR DE ACENTO
                            <div className={`text-xl ${iconAccent}`}>{product.icon}</div>
                        )}
                        {isOpen && (
                            // 🛑 TEXTO PRINCIPAL MÁS GRUESO Y CLARO
                            <span className={`text-base font-semibold flex-grow ${!isOpen && "hidden"}`}>
                                {product.title}
                            </span>
                        )}
                    </span>
                    
                    {/* Flecha de Expansión/Colapso */}
                    {isOpen && (
                        // 🛑 FLECHA EN COLOR DE ACENTO
                        <MdKeyboardArrowRight
                            className={`text-2xl ${iconAccent} duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`}
                        />
                    )}
                </motion.div>
                
                {/* SUBMENÚ COLAPSABLE */}
                <AnimatePresence initial={false}>
                    {isExpanded && isOpen && (
                        <motion.div
                            key="subMenu"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={subMenuVariants}
                            className="overflow-hidden" 
                        >
                            {product.childrens.map((child, index) => (
                                <NavLink
                                    key={index}
                                    to={child.path}
                                    className={({ isActive }) => 
                                        // 🛑 Subítemes: Texto claro, Fondo/Hover azul-800
                                        `${baseClass} ml-8 text-sm 
                                        ${isActive ? activeBg + ' ' + activeText : inactiveText + ' ' + hoverBg}`
                                    }
                                >
                                    {/* Icono (Si existe) y Título del subítem */}
                                    {child.icon && <div className={`text-lg mr-3 ${iconAccent}`}>{child.icon}</div>}
                                    <span className="truncate">{child.title}</span>
                                </NavLink>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    } 
    
    // -----------------------------------------------------------
    // 2. ÍTEM SIMPLE (product.childrens NO existe)
    // -----------------------------------------------------------
    else {
        return (
            <NavLink
                to={product.path}
                className={({ isActive }) => 
                    // 🛑 Ítem simple: Activo con fondo verde, Inactivo con texto claro y hover azul-800
                    `${baseClass} ${isActive ? activeBg + ' ' + activeText : inactiveText + ' ' + hoverBg}`
                }
            >
                <motion.div
                    whileHover={{x: 5}} // Animación de desplazamiento sutil
                    whileTap={{scale: 0.98}}
                    className="flex gap-4 items-center w-full"
                >
                    {product.icon && (
                        // 🛑 ICONO EN COLOR DE ACENTO
                        <div className={`text-xl ${iconAccent}`}>{product.icon}</div>
                    )}
                    {isOpen && (
                        // 🛑 TEXTO PRINCIPAL MÁS GRUESO Y CLARO
                        <span className={`text-base font-semibold ${!isOpen && "hidden"}`}>
                            {product.title}
                        </span>
                    )}
                </motion.div>
            </NavLink>
        );
    }
};

export default SideBarItem;