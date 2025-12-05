import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdMenu, MdLocalFlorist } from 'react-icons/md';
import { FiZap } from 'react-icons/fi';
import EnterpriseMenu from "./EnterpriseMenu";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import AdminUserSelector from "./AdminUserSelector";
import ImpersonationBadge from "./ImpersonationBadge";
import SubscriptionPlans from "../Subscription/SubscriptionPlans";
import { selectRole } from "../../features/auth/authSlice/authSlice";

const Header = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const role = useSelector(selectRole);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const goHome = () => {
        navigate("/acumuladoC");
    };

    const isAdmin = role === 'admin' || role === 'superuser';

    return (
        <>
            {/* Badge de Impersonación (flotante) */}
            <ImpersonationBadge />

            <motion.header 
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 sm:px-6 bg-white shadow-sm border-b border-gray-200"
            >
                
                {/* 1. SECCIÓN IZQUIERDA: Menu + Logo/Título + Admin Selector */}
                <div className="flex items-center gap-3 sm:gap-4">
                    
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

                    {/* SELECTOR DE USUARIO ADMIN (Solo visible para admins) */}
                    {isAdmin && (
                        <>
                            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                            <AdminUserSelector />
                        </>
                    )}
                    
                </div>
                
                {/* 2. SECCIÓN DERECHA: Acciones y Perfil */}
                <div className="flex items-center gap-2 sm:gap-4">
                    
                    {/* Notificaciones (Componente Funcional) */}
                    <NotificationBell />

                    {/* Separador Vertical */}
                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                    {/* Botón de Planes de Suscripción */}
                    <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <FiZap className="text-lg" />
                        <span>Planes</span>
                    </button>

                    {/* Separador Vertical */}
                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                    {/* Menú de Aplicaciones (Waffle) */}
                    <EnterpriseMenu />

                    {/* Menú de Usuario */}
                    <UserMenu />
                </div>
            </motion.header>

            {/* Modal de Suscripciones */}
            <SubscriptionPlans 
                isOpen={showSubscriptionModal} 
                onClose={() => setShowSubscriptionModal(false)} 
            />
        </>
    );
};

export default Header;