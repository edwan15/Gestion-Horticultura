import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRole, selectIsLoggedIn } from '../features/auth/authSlice/authSlice'; 

/**
 * Componente para proteger rutas basadas en los roles.
 * Redirige si el usuario no está logeado o no tiene el rol permitido.
 * * @param {Array<string>} allowedRoles - Roles permitidos para esta ruta (ej: ['admin', 'usuario']).
 * @param {JSX.Element} children - El componente de la página a renderizar.
 */
const RoleRoute = ({ allowedRoles, children }) => {
    // 1. Obtener el estado del usuario desde Redux
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userRole = useSelector(selectRole);

    // 2. Chequeo de Autenticación: Si no está logeado, lo enviamos al login.
    // Esto debería pasar solo si la verificación en App.js falló o el token expiró.
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />; 
    }
    
    // 3. Chequeo de Autorización: Si el rol del usuario NO está en la lista de roles permitidos.
    // Usamos el operador ternario para asegurarnos de que userRole sea una cadena de texto, 
    // y manejamos si allowedRoles no es un array válido (aunque en App.js siempre lo es).
    if (!Array.isArray(allowedRoles) || !allowedRoles.includes(userRole)) {
        // 403 Forbidden en el frontend: Redirige a una página de "Acceso Denegado"
        return <Navigate to="/unauthorized" replace />; 
    }

    // 4. Si está logeado y tiene el rol correcto, permite el acceso.
    return children;
};

export default RoleRoute;