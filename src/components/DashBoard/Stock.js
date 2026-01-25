import React from 'react';
import { useSelector } from 'react-redux';
import { selectRole, selectName } from '../../features/auth/authSlice/authSlice'; 
import useRedirectLoggedOutUser from '../../custom/useRedirect'; 
import { motion } from 'framer-motion'; // Asegúrate de que framer-motion esté instalado

// --- Componentes UI Avanzados ---
import UserProductList from "../product/product+/UserProductList"; 
import AdminSummaryWidgets from "../../Pages/DashBoard/AdminSummaryWidgets"; 
import UserSummaryWidgets from "../../Pages/DashBoard/UserSummaryWidgets"; 
import AnnouncementCard from "../../Pages/DashBoard/AnnouncementCard"; 
import { FaUserShield, FaChartLine, FaTachometerAlt } from 'react-icons/fa';

const Stock = () => {
    useRedirectLoggedOutUser("/"); 
    
    const userRole = useSelector(selectRole); 
    const userName = useSelector(selectName);
    
    const validRoles = ["usuario", "admin", "invitado", "subscriber"];
    // Título y subtítulo con enfoque en la amplitud y tipografía grande
    const greeting = userName ? `¡Hola, ${userName}!` : 'Bienvenido/a';

    if (!userRole || !validRoles.includes(userRole)) {
        return (
            <div className="text-center p-10 text-xl text-red-500 bg-white min-h-screen">
                {userRole ? `❌ Rol de usuario no reconocido: "${userRole}".` : "Verificando sesión..."}
            </div>
        );
    }
    
    // ---------------------------------------------------------------------
    // --- Renderizado del DASHBOARD - Diseño Amplio y Moderno ---
    // ---------------------------------------------------------------------
    
    // 1. ADMINISTRADOR
    if (userRole === "admin") {
        return (
            // AUMENTANDO EL PADDING EN MÓVIL (p-4) y fondo claro para contrastar las cards
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen"> 
                {/* Encabezado con tipografía grande y separación */}
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 flex items-center border-b-2 border-green-200 pb-2"
                >
                    <FaUserShield className="mr-3 text-green-600"/> {greeting}
                </motion.h1>
                <p className="text-gray-500 mb-6 text-base sm:text-lg">Panel de Administración Avanzado</p>

                <div className="grid grid-cols-12 gap-4 sm:gap-6">
                    
                    {/* Fila 1: Widgets de Resumen (AdminSummaryWidgets ya tiene grid-cols-2) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="col-span-12"
                    >
                        {/* Esta sección ahora usa el grid de 2 para móviles */}
                        <AdminSummaryWidgets />
                    </motion.div>

                    {/* Fila 2: Listado de Productos (Ocupa 12 columnas para amplitud) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        // Contenedor principal para la lista: amplio padding y sombra fuerte
                        className="col-span-12 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                            <FaChartLine className="mr-2 text-green-500"/> Gestión de Inventario
                        </h3>
                        <UserProductList /> 
                    </motion.div>

                </div>
            </div>
        );
    }

    // 2. USUARIO ESTÁNDAR / SUBSCRIBER / INVITADO
    const isStandardUser = userRole === "usuario" || userRole === "subscriber";

    return (
        // AUMENTANDO EL PADDING EN MÓVIL (p-4) y fondo claro para contrastar las cards
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Encabezado con tipografía grande y separación */}
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 flex items-center border-b-2 border-blue-200 pb-2"
            >
                <FaTachometerAlt className="mr-3 text-blue-600"/> {greeting}
            </motion.h1>
            <p className="text-gray-500 mb-6 text-base sm:text-lg">
                {isStandardUser ? "Vista General de tu Inventario" : "Vista Limitada del Sistema"}
            </p>

            <div className="grid grid-cols-12 gap-4 sm:gap-6">
                
                {/* Fila 1: Widgets de Resumen */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="col-span-12"
                >
                    {/* UserSummaryWidgets debe tener grid-cols-2 interno */}
                    {/* <UserSummaryWidgets /> */}
                </motion.div>
                
                {/* Fila 2: Tarjeta de Productos (Ocupa 12 columnas para amplitud) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="col-span-12 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                    <h3 className="text-xl font-bold  text-gray-700 flex items-center">
                        <FaChartLine className="mr-2 text-green-500"/> {isStandardUser ? "Mi Inventario" : "Productos Registrados"}
                    </h3>
                    <UserProductList /> 
                </motion.div>

                {/* Fila 3: Anuncio */}
                <div className="col-span-12">
                    {userRole === "invitado" && (
                        <AnnouncementCard 
                            title="Limitación de Cuenta"
                            message="Regístrate como 'usuario' para desbloquear la creación de nuevos productos y la gestión total."
                            type="warning"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stock;