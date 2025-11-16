// import React from 'react';
// import { useSelector } from 'react-redux';
// // Asegúrate de que este path sea correcto
// import { selectRole } from '../../features/auth/authSlice/authSlice'; 
// // Asumiendo que tienes este hook
// import useRedirectLoggedOutUser from '../../custom/useRedirect'; 
// // Este componente ahora es multi-rol gracias a la lógica del backend
// import UserProductList from "../../components/product/product+/UserProductList"; 

// const DashBoard = () => {
//     // 1. Hook para redirigir a usuarios no autenticados
//     useRedirectLoggedOutUser("/"); 
    
//     // 2. Obtener el rol normalizado del usuario desde Redux
//     const userRole = useSelector(selectRole); 
    
//     // Lista de roles válidos para entrar al Dashboard.
//     // Incluye 'subscriber' para evitar el error de rol no reconocido.
//     const validRoles = ["usuario", "admin", "invitado", "subscriber"];

//     // 3. Manejo de estado de carga o rol no reconocido
//     if (!userRole || !validRoles.includes(userRole)) {
//         return (
//             <div className="text-center p-10 text-xl text-red-500">
//                  {userRole ? `❌ Rol de usuario no reconocido: "${userRole}".` : "Verificando sesión..."}
//             </div>
//         );
//     }
    
//     // --- Lógica de Renderizado Basada en el Rol ---
    
//     // 4. ADMINISTRADOR (Vista de TODOS los productos)
//     if (userRole === "admin") {
//         return (
//             <div className="container mx-auto p-4">
//                 <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
                
//                 {/* Mensaje de notificación temporal para el admin */}
//                 <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 font-medium mb-6">
//                     ⚠️ Vista **{userRole}** activa. El Admin ve todos los productos del sistema.
//                 </div>

//                 {/* El componente UserProductList ahora muestra TODOS los productos 
//                     porque el backend no aplicó el filtro de ID de usuario. */}
//                 <UserProductList /> 
//             </div>
//         );
//     }

//     // 5. USUARIO ESTÁNDAR, INVITADO, SUBSCRIBER (Vista RESTRINGIDA: Solo sus productos)
//     if (userRole === "usuario" || userRole === "invitado" || userRole === "subscriber") {
        
//         const title = userRole === "usuario" ? "Mi Inventario" : "Productos del Sistema (Vista Limitada)";

//         return (
//             <div className="container mx-auto p-4">
//                 <h2 className="text-2xl font-bold mb-4">{title}</h2>
                
//                 {/* Mensaje de restricción para invitados/subscribers */}
//                 {(userRole === "invitado" || userRole === "subscriber") && (
//                     <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium mb-6">
//                         ⛔ Rol **{userRole}** activo. Solo puedes ver productos. Necesitas el rol **usuario** para crear.
//                     </div>
//                 )}
                
//                 {/* El backend filtrará esta lista para mostrar solo los productos propios del usuario */}
//                 <UserProductList /> 
//             </div>
//         );
//     }
    
//     // Fallback para cualquier caso no contemplado
//     return <div className="text-center p-10 text-xl">Cargando Dashboard...</div>
// };

// export default DashBoard;


// import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectRole } from '../../features/auth/authSlice/authSlice'; 
// import useRedirectLoggedOutUser from '../../custom/useRedirect'; 
// import UserProductList from "../../components/product/product+/UserProductList"; 

// const DashBoard = () => {
//     useRedirectLoggedOutUser("/"); 
//     
//     const userRole = useSelector(selectRole); 
//     
//     const validRoles = ["usuario", "admin", "invitado", "subscriber"];

//     if (!userRole || !validRoles.includes(userRole)) {
//         return (
//             <div className="text-center p-10 text-xl text-red-500">
//                  {userRole ? `❌ Rol de usuario no reconocido: "${userRole}".` : "Verificando sesión..."}
//             </div>
//         );
//     }
//     
//     // --- Lógica de Renderizado Basada en el Rol ---
//     
//     // 4. ADMINISTRADOR (Vista de TODOS los productos con filtro)
//     if (userRole === "admin") {
//         return (
//             <div className="container mx-auto p-4">
//                 <h2 className="text-2xl font-bold mb-4">Panel de Administración: Gestión de Productos</h2>
//                 
//                 <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 font-medium mb-6">
//                     🔍 Vista **{userRole}** activa. Utiliza el filtro para ver productos por finca/usuario.
//                 </div>

//                 <UserProductList /> 
//             </div>
//         );
//     }

//     // 5. USUARIO ESTÁNDAR, INVITADO, SUBSCRIBER (Vista RESTRINGIDA)
//     if (userRole === "usuario" || userRole === "invitado" || userRole === "subscriber") {
//         
//         const title = userRole === "usuario" ? "Mi Inventario" : "Productos del Sistema (Vista Limitada)";

//         return (
//             <div className="container mx-auto p-4">
//                 <h2 className="text-2xl font-bold mb-4">{title}</h2>
//                 
//                 {(userRole === "invitado" || userRole === "subscriber") && (
//                     <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium mb-6">
//                         ⛔ Rol **{userRole}** activo. Solo puedes ver productos propios.
//                     </div>
//                 )}
//                 
//                 <UserProductList /> 
//             </div>
//         );
//     }
//     
//     return <div className="text-center p-10 text-xl">Cargando Dashboard...</div>
// };

// export default DashBoard;


import React from 'react';
import { useSelector } from 'react-redux';
import { selectRole, selectName } from '../../features/auth/authSlice/authSlice'; 
import useRedirectLoggedOutUser from '../../custom/useRedirect'; 

// --- Componentes UI Avanzados ---
import UserProductList from "../../components/product/product+/UserProductList"; 
import AdminSummaryWidgets from "./AdminSummaryWidgets"; 
import UserSummaryWidgets from ".//UserSummaryWidgets";
import AnnouncementCard from ".//AnnouncementCard"; 
import { FaUserShield, FaChartLine } from 'react-icons/fa';

const DashBoard = () => {
    useRedirectLoggedOutUser("/"); 
    
    const userRole = useSelector(selectRole); 
    const userName = useSelector(selectName);
    
    const validRoles = ["usuario", "admin", "invitado", "subscriber"];
    const greeting = userName ? `¡Hola, ${userName}!` : 'Bienvenido/a';

    if (!userRole || !validRoles.includes(userRole)) {
        return (
            <div className="text-center p-10 text-xl text-red-500">
                 {userRole ? `❌ Rol de usuario no reconocido: "${userRole}".` : "Verificando sesión..."}
            </div>
        );
    }
    
    // ---------------------------------------------------------------------
    // --- Renderizado del DASHBOARD UI/UX AVANZADO ---
    // ---------------------------------------------------------------------
    
    // 1. ADMINISTRADOR
    if (userRole === "admin") {
        return (
            <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
                    <FaUserShield className="mr-3 text-green-600"/> {greeting}
                </h1>
                <p className="text-gray-500 mb-8 text-lg">Panel de Administración Avanzado</p>

                <div className="grid grid-cols-12 gap-6">
                    
                    {/* Fila 1: Widgets de Resumen (Ocupa 12 columnas) */}
                    <div className="col-span-12">
                        <AdminSummaryWidgets />
                    </div>

                    {/* Fila 2: Tarjeta de Anuncios (Ocupa 4 columnas) */}
                    {/* <div className="col-span-12 lg:col-span-4">
                        <AnnouncementCard 
                            title="Actualizaciones del Sistema"
                            message="Se ha habilitado el nuevo filtro de productos por usuario/finca. ¡Explóralo ahora!"
                            type="info"
                        />
                    </div> */}

                    {/* Fila 2: Listado de Productos (Ocupa 8 columnas) */}
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-xl shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                            <FaChartLine className="mr-2 text-green-500"/> Gestión de Inventario
                        </h3>
                        <UserProductList /> 
                    </div>

                </div>
            </div>
        );
    }

    // 2. USUARIO ESTÁNDAR / SUBSCRIBER / INVITADO
    const isStandardUser = userRole === "usuario" || userRole === "subscriber";

    return (
        <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                {greeting}
            </h1>
            <p className="text-gray-500 mb-8 text-lg">
                {isStandardUser ? "Vista General de tu Inventario" : "Vista Limitada del Sistema"}
            </p>

            <div className="grid grid-cols-12 gap-6">
                
                {/* Fila 1: Widgets de Resumen (Ocupa 12 columnas) */}
                {/* <div className="col-span-12">
                    <UserSummaryWidgets />
                </div> */}
                
                {/* Fila 2: Tarjeta de Productos (Ocupa 12 columnas) */}
                <div className="col-span-12 bg-white p-6 rounded-xl shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                        <FaChartLine className="mr-2 text-green-500"/> {isStandardUser ? "Mi Inventario" : "Productos Registrados"}
                    </h3>
                    <UserProductList /> 
                </div>

                {/* Fila 3: Anuncio (Ocupa 12 columnas) */}
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

export default DashBoard;