// import axios from "axios";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/logs/`;

// // Obtener logs
// const getLogs = async (limit = 50) => {
//     const response = await axios.get(API_URL + `?limit=${limit}`, {
//         withCredentials: true,
//     });
//     return response.data;
// };

// const logService = {
//     getLogs,
// };

// export default logService;



// // En logService.js (Código que DEBE funcionar)
// import axios from "axios";

// // Si usas una URL base en Axios, podrías acortar esto
// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/logs`; 

// // La función DEBE aceptar el token como primer argumento.
// const getLogs = async (token, limit = 50) => {
    
//     // 🛑 1. VALIDACIÓN
//     if (!token) {
//         // Esta validación debe coincidir con el error que ves.
//         throw new Error("Acceso denegado, no hay token de autenticación.");
//     }
    
//     // 🛑 2. CONFIGURACIÓN DE HEADERS: CRÍTICO
//     const config = {
//         headers: {
//             // El token debe ir en el formato Bearer <token>
//             Authorization: `Bearer ${token}`, 
//         },
//         // Mantener o eliminar 'withCredentials' dependiendo de tu backend (JWT + Cookies)
//         withCredentials: true, 
//     };

//     const response = await axios.get(API_URL + `?limit=${limit}`, config);
    
//     return response.data;
// };

// const logService = {
//     getLogs,
// };

// export default logService;



import axios from "axios";

// Si usas una URL base en Axios, podrías acortar esto
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/logs`; 

// 🚨 LÍNEA DE DEPURACIÓN CLAVE: Muestra la URL completa que se está usando
console.log("URL de Petición de Logs:", API_URL); 

// La función DEBE aceptar el token como primer argumento.
const getLogs = async (token, limit = 50) => {
    
    // 🛑 1. VALIDACIÓN
    if (!token) {
        throw new Error("Acceso denegado, no hay token de autenticación.");
    }
    
    // 🛑 2. CONFIGURACIÓN DE HEADERS: CRÍTICO
    const config = {
        headers: {
            // El token debe ir en el formato Bearer <token>
            Authorization: `Bearer ${token}`, 
        },
        // Mantener o eliminar 'withCredentials' dependiendo de tu backend (JWT + Cookies)
        withCredentials: true, 
    };

    const response = await axios.get(API_URL + `?limit=${limit}`, config);
    
    return response.data;
};

const logService = {
    getLogs,
};

export default logService;