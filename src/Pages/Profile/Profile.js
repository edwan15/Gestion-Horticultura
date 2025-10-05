import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsLoggedIn, selectRole } from '../../features/auth/authSlice/authSlice';

// Este componente protege las rutas basándose en el rol requerido.
// Si no se especifica un rol (como en /panel, donde solo requiere estar logeado), 
// se asume que cualquier usuario autenticado puede acceder.
const RequireAuth = ({ children, allowedRoles = ['admin', 'usuario'] }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userRole = useSelector(selectRole); 
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Verificar si el usuario está logeado
        if (!isLoggedIn) {
            // Si no está logeado, redirigir al login
            navigate('/login');
            return;
        }

        // 2. Verificar si el rol del usuario está permitido en esta ruta
        // Nota: Solo aplicamos esta restricción si la ruta es explícitamente protegida (ej: /produccionC)
        if (allowedRoles.length > 0) {
            // Convierte el rol a minúsculas por si acaso
            const currentRole = userRole ? userRole.toLowerCase() : '';

            // Comprueba si el rol del usuario está en la lista de roles permitidos para esta ruta
            if (!allowedRoles.includes(currentRole)) {
                // Si el rol no está permitido, redirigir a la página de No Autorizado
                console.log(`Acceso denegado: Rol actual (${userRole}) no permitido.`);
                navigate('/unauthorized');
                return;
            }
        }
    }, [isLoggedIn, userRole, navigate, allowedRoles]);

    // Si está logeado y el rol es correcto o no se requiere restricción de rol, muestra el componente hijo (la ruta)
    if (isLoggedIn && allowedRoles.includes((userRole || '').toLowerCase())) {
        return children;
    } 
    
    // Fallback: Si el rol es correcto pero Redux tarda en cargar, devuelve null temporalmente
    // o si el usuario no ha pasado la verificación inicial.
    return null;
};

// Componente Wrapper para rutas que SOLO requieren ser 'admin' (ej. /produccionC)
export const RequireAdmin = ({ children }) => {
    return <RequireAuth allowedRoles={['admin']}>{children}</RequireAuth>;
};

// Componente Wrapper para rutas que requieren 'admin' o 'usuario' (ej. /panel si es la ruta principal)
export const RequireUserOrAdmin = ({ children }) => {
    return <RequireAuth allowedRoles={['admin', 'usuario']}>{children}</RequireAuth>;
};

export default RequireAuth;
