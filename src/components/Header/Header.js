import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdMenu, MdLocalFlorist, MdNotifications } from 'react-icons/md';
import EnterpriseMenu from "./EnterpriseMenu";
import UserMenu from "./UserMenu";

const Header = ({ onMenuToggle }) => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/acumuladoC");
    };

    return (
        <motion.header 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 sm:px-6 bg-white shadow-sm border-b border-gray-200"
        >
            
            {/* 1. SECCIÓN IZQUIERDA: Menu + Logo/Título */}
            <div className="flex items-center gap-4">
                
                {/* BOTÓN HAMBURGUESA (MÓVIL) */}
                <div className="lg:hidden">
                    <MdMenu 
                        className="text-2xl text-gray-600 cursor-pointer hover:text-green-700 transition-colors"
                        onClick={() => {
                            console.log('🍔 Hamburger clicked!', onMenuToggle);
                            if (onMenuToggle) {
                                onMenuToggle();
                            }
                        }} 
                    />
                </div>

                {/* LOGO TEMÁTICO */}
                <div 
                    onClick={goHome} 
                    className="flex items-center cursor-pointer select-none group"
                >
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center mr-2 shadow-sm group-hover:bg-green-700 transition-colors">
                        <MdLocalFlorist className="text-xl text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
                        Horti<span className="text-green-600">Dash</span>
                    </h1>
                </div>
                
            </div>
            
            {/* 2. SECCIÓN DERECHA: Acciones y Perfil */}
            <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Notificaciones (Icono simple) */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                    <MdNotifications className="text-2xl" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Separador Vertical */}
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                {/* Menú de Aplicaciones (Waffle) */}
                <EnterpriseMenu />

                {/* Menú de Usuario */}
                <UserMenu />
            </div>
        </motion.header>
    );
};

export default Header;