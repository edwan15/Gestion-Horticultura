// // ////////////////////////////////////////////////////////////////////
// // src/hooks/useApi.js (Frontend)
// // ////////////////////////////////////////////////////////////////////

import { useCallback } from "react";

// import { useCallback } from 'react';

// // URL base del servidor (Asegúrate de que esta sea la URL de tu Backend)
const SERVER_URL = "http://localhost:4500"; 

// export const useApi = () => {
    
//     // Usamos useCallback para que la función fetchWithAuth sea estable
//     const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
        
//         // 1. Obtiene el token de la sesión activa (será el token de Impersonación si está activo)
//         const token = localStorage.getItem('user_token'); 

//         const defaultHeaders = {
//             'Content-Type': 'application/json',
//             // 2. Adjunta el token a CADA solicitud
//             ...(token && { 'Authorization': `Bearer ${token}` }), 
//         };

//         const url = `${SERVER_URL}${endpoint}`;

//         const response = await fetch(url, {
//             ...options,
//             headers: {
//                 ...defaultHeaders,
//                 ...options.headers,
//             },
//         });

//         // 3. Manejo básico de errores de respuesta
//         if (!response.ok) {
//             let errorDetail = 'Error al conectar con la API.';
//             try {
//                 const error = await response.json();
//                 errorDetail = error.message || errorDetail;
//             } catch (e) {
//                 // Si la respuesta no es JSON, usa el estado
//                 errorDetail = `Error ${response.status}: ${response.statusText}`;
//             }
//             throw new Error(errorDetail);
//         }

//         return response.json();
//     }, []); // Dependencias vacías: la función es la misma en cada render

//     return { fetchWithAuth };
// };


export const useApi = () => {
    
    // Función auxiliar para construir la URL con parámetros de consulta
    const buildUrl = (endpoint, params = {}) => {
        const url = new URL(`${SERVER_URL}${endpoint}`);
        // Si hay parámetros, los añade a la URL
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    };


    const fetchWithAuth = useCallback(async (endpoint, options = {}, queryParams = {}) => {
        
        // ... (obtención del token y headers) ...

        // 🛑 CAMBIO CLAVE: Usar buildUrl 🛑
        const url = buildUrl(endpoint, queryParams);

        const response = await fetch(url, {
            // ... (resto de la función) ...
        });
        
        // ... (manejo de errores y return) ...

    }, []); 

    return { fetchWithAuth };
};