import axios from "axios";

// 🛑 AJUSTA ESTA URL a tu base de datos API
const API_URL = "/api/auth/"; 

// NOTA: Asumimos que la instancia de Axios ya está configurada
// para enviar el token JWT del Admin en los headers de todas las solicitudes.

/**
 * Llama al backend para solicitar un Token de Impersonación para un usuario específico.
 * El backend verifica el rol de Admin y emite un nuevo token con las claims de Impersonación.
 * @param {string} targetUserId - El ID del usuario cuyos datos queremos ver.
 * @returns {Promise<{impersonationToken: string, userData: object}>} La respuesta del backend.
 */
const requestImpersonationToken = async (targetUserId) => {
    
    // El Admin envía el ID del usuario objetivo al endpoint de Impersonación.
    const response = await axios.post(API_URL + "impersonate", { 
        targetUserId: targetUserId 
    });
    
    // El backend debe devolver el nuevo token y los datos de la sesión impersonada.
    return response.data;
};

// Si tienes más funciones de autenticación, agrégalas aquí.
const authService = {
    requestImpersonationToken,
    // login,
    // logout,
    // ...
};

export default authService;