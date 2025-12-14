import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectRole } from '../features/auth/authSlice/authSlice';

// 1. Variantes para animaciones de Framer Motion
const containerVariants = {
initial: { opacity: 0, y: -20 },
animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const iconVariants = {
initial: { scale: 0.8, rotate: 0 },
animate: { scale: 1, rotate: 5, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
};

const buttonVariants = {
hover: { scale: 1.05, transition: { duration: 0.2 } },
tap: { scale: 0.95 },
};

const UnauthorizedPage = () => {
    const userRole = useSelector(selectRole) || "Usuario";
    
    return (
        <div className="relative h-screen w-full overflow-hidden font-sans">
            {/* 1. Fondo de Agricultura (Imagen Generada) */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
                style={{ 
                    backgroundImage: "url('/assets/unauthorized_bg.png')",
                    filter: "brightness(0.8)" 
                }}
            />
            
            {/* 2. Overlay Oscuro y Difuso para legibilidad */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-sm" />

            {/* 3. Contenido Principal - Usamos h-full y flex para centrar mejor */}
            <motion.div
                className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Icono animado */}
                <motion.div
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    className="mb-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl transition-all duration-300"
                >
                    <ShieldAlert className="w-16 h-16 text-red-500 dropping-shadow-lg"/>
                </motion.div>

                {/* Título y Código de Error */}
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold text-white mb-1 tracking-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                    Acceso Denegado
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl font-bold text-red-400 mb-6 tracking-wider uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                >
                    Código de Error 403
                </motion.p>

                {/* Mensaje personalizado con rol */}
                <motion.div
                    className="max-w-xl bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl mb-8 text-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
                >
                    <p className="text-base md:text-lg leading-snug">
                        Lo sentimos, el recurso que intentas consultar requiere permisos de nivel
                        <span className="block my-1 text-xl font-bold text-green-400">
                            Administrador
                        </span>
                        Tu perfil actual está identificado como:
                        <span className="block my-1 text-xl font-bold text-red-400">
                            "{userRole}"
                        </span>
                        Por motivos de seguridad, no tienes autorización para acceder aquí.
                    </p>
                </motion.div>

                {/* Opciones de navegación (Botones avanzados) */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">

                    {/* Botón de Volver al Panel (Principal) */}
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="inline-flex"
                    >
                        <Link 
                            to="/panel" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-base shadow-lg hover:shadow-green-500/30 transition-all duration-300 w-full sm:w-auto"
                        >
                            <Home className="w-5 h-5"/>
                            Volver al Panel
                        </Link>
                    </motion.div>

                    {/* Botón de Contactar al Administrador (Secundario) */}
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="inline-flex"
                    >
                        <Link 
                            to="/contact-us" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-base shadow-lg backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                        >
                            <Mail className="w-5 h-5"/>
                            Contactar Soporte
                        </Link>
                    </motion.div>

                </div>
                
                {/* Footer sencillo */}
                <motion.p 
                    className="mt-6 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1 } }}
                >
                    &copy; {new Date().getFullYear()} Gestión Agrícola Integral Horticultura
                </motion.p>
            </motion.div>
        </div>
    );
};

export default UnauthorizedPage;