// src/components/auth/RoleGuard.js
import React from 'react';
import { useSelector } from 'react-redux';
// ⚠️ Asegúrate de que esta ruta sea correcta para importar tu selector de Redux
import { selectRole } from '../../features/auth/authSlice/authSlice'; 

/**
 * Componente que protege el contenido basándose en el rol del usuario.
 * El Admin siempre tendrá acceso, a menos que se restrinja explícitamente.
 * * @param {string[]} rolesPermitidos - Array de roles que pueden ver el contenido (ej: ['admin', 'usuario']).
 * @param {React.ReactNode} children - Componentes a renderizar si el rol está permitido.
 * @param {React.ReactNode} [fallback=null] - Contenido alternativo a mostrar si el acceso es denegado.
 */
const RoleGuard = ({ rolesPermitidos, children, fallback = null }) => {
  const userRole = useSelector(selectRole);

  // 1. Normalizar el rol para la comparación
  const normalizedUserRole = userRole ? userRole.toLowerCase().trim() : '';

  // 2. Normalizar los roles permitidos a minúsculas
  const roles = Array.isArray(rolesPermitidos) 
    ? rolesPermitidos.map(r => r.toLowerCase().trim())
    : [];

  // 3. Lógica de acceso:
  //    - Siempre se verifica si el rol está en la lista de rolesPermitidos.
  const tieneAcceso = roles.includes(normalizedUserRole);

  if (tieneAcceso) {
    return <>{children}</>;
  }

  // Si no tiene acceso, devolvemos el contenido de reemplazo (fallback) o null
  return fallback;
};

export default RoleGuard;