// import React from 'react';
// import { Link } from 'react-router-dom';

// const UnauthorizedPage = () => {
//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       minHeight: '100vh', 
//       textAlign: 'center',
//       backgroundColor: '#f8d7da',
//       color: '#721c24',
//       padding: '20px'
//     }}>
//       <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🚫 Acceso Denegado (Error 403)</h1>
//       <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
//         Tu rol actual ("invitado" o "usuario") no tiene permiso para ver esta página. 
//         Si crees que esto es un error, contacta al administrador.
//       </p>
//       <Link 
//         to="/panel" 
//         style={{ 
//           textDecoration: 'none', 
//           padding: '10px 20px', 
//           backgroundColor: '#dc3545', 
//           color: 'white', 
//           borderRadius: '5px' 
//         }}
//       >
//         Volver al Panel
//       </Link>
//     </div>
//   );
// };

// export default UnauthorizedPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, Mail } from 'lucide-react';

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
    const userRole = "Usuario Estándar";
    
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-6 transition-colors duration-300"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {/* 2. Icono animado */}
            <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                className="mb-8 p-5 bg-red-100 dark:bg-red-900/50 rounded-full shadow-xl transition-all duration-300"
            >
                <ShieldAlert className="w-20 h-20 text-red-600 dark:text-red-400"/>
            </motion.div>

            {/* 3. Título y Código de Error */}
            <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-100 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
                Acceso Denegado
            </motion.h1>
            <motion.p
                className="text-xl font-semibold text-red-500 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.4 } }}
            >
                CÓDIGO DE ERROR 403
            </motion.p>

            {/* 4. Mensaje personalizado con rol */}
           <motion.p
    className="max-w-xl text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { delay: 0.5 } }}
>
    Lo sentimos, la página que intentas visitar requiere permisos de:
    <span className="block my-2 text-xl font-bold text-green-500 dark:text-green-400">
        "Administrador"
    </span>
    Tu rol actual es:
    <span className="text-xl font-bold text-red-500 dark:text-red-400">
        "{userRole}"
    </span>
    y no tiene autorización para acceder a este recurso. Por favor, regresa a un área permitida.
</motion.p>

            {/* 5. Opciones de navegación (Botones avanzados) */}
            <div className="flex flex-col sm:flex-row gap-4">

                {/* Botón de Volver al Panel (Principal) */}
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                >
                    <Link to="/panel" className="flex items-center gap-2">
                        <Home className="w-5 h-5"/>
                        Volver al Panel
                    </Link>
                </motion.div>

                {/* Botón de Contactar al Administrador (Secundario) */}
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-base font-medium rounded-full shadow-lg text-red-600 bg-white dark:bg-gray-800 hover:bg-red-50 transition-colors duration-300 dark:hover:bg-gray-700 dark:border-red-400 dark:text-red-400 cursor-pointer"
                >
                    <Link to="/contact-us" className="flex items-center gap-2">
                        <Mail className="w-5 h-5"/>
                        Contactar Soporte
                    </Link>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default UnauthorizedPage;