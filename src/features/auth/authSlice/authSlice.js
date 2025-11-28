
// import { createSlice } from "@reduxjs/toolkit";

// // Helper para cargar/limpiar en localStorage
// const LOCAL_STORAGE_KEY = "user_data";

// // 1. Intentar cargar el usuario desde localStorage
// const storedUserData = localStorage.getItem(LOCAL_STORAGE_KEY);
// const initialUser = storedUserData ? JSON.parse(storedUserData) : null;
// const initialRole = initialUser?.role ? initialUser.role.toLowerCase().trim() : "invitado";
// const initialIsLoggedIn = !!initialUser;
// const initialName = initialUser?.name || "";

// const storedImpersonationState = localStorage.getItem("impersonation_state");
// const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

// const initialState = {
//     isLoggedIn: initialIsLoggedIn,
//     name: initialName,
//     user: initialUser, 
//     role: initialRole, 
//     isImpersonating: initialImpersonation.isImpersonating || false,
//     targetUserId: initialImpersonation.targetUserId || null,
//     adminToken: initialImpersonation.adminToken || null, 
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
            
//             if (!action.payload) {
//                 localStorage.removeItem(LOCAL_STORAGE_KEY); 
//                 localStorage.removeItem("impersonation_state"); 
                
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = null;
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null;
//             }
//         },
//         SET_NAME(state, action) {
//             state.name = action.payload;
//         },
//         SET_USER(state, action) {
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.name) {
//                 return; 
//             }
            
//             localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData)); 

//             state.user = userData;
//             state.name = userData.name;

//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
//         },
        
//         SET_IMPERSONATION(state, action) {
//             const { targetUserId, adminToken, activate } = action.payload;
            
//             if (activate) {
//                 state.isImpersonating = true;
//                 state.adminToken = adminToken; 
//                 state.targetUserId = targetUserId;
                
//                 localStorage.setItem("impersonation_state", JSON.stringify({
//                     isImpersonating: true,
//                     targetUserId,
//                     adminToken
//                 }));
//             } else {
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null; 
//                 localStorage.removeItem("impersonation_state");
//             }
//         }
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION } = authSlice.actions;

// export default authSlice.reducer;

// // ----------------------------------------------------
// // SELECTORES CLAVE
// // ----------------------------------------------------

// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role; 
// export const selectUser = (state) => state.auth.user; 
// export const selectIsImpersonating = (state) => state.auth.isImpersonating;
// export const selectTargetUserId = (state) => state.auth.targetUserId;
// export const selectAdminToken = (state) => state.auth.adminToken;

// /**
//  * Devuelve el ID del usuario activo (o el ID del usuario impersonado).
//  * Prioriza _id (MongoDB) para la sesión activa.
//  */
// export const selectUserId = (state) => {
//     // 1. Si estamos impersonando, devolvemos el ID del usuario objetivo
//     if (state.auth.isImpersonating) {
//         return state.auth.targetUserId;
//     }
//     // 2. Si no estamos impersonando, devolvemos el ID de la sesión activa
//     return state.auth.user?._id || state.auth.user?.id || state.auth.user?.userId || null;
// };





// import { createSlice } from "@reduxjs/toolkit";

// // 🛑 IMPORTANTE: Ya no cargamos el usuario completo ni el rol desde localStorage
// // para evitar desincronizaciones. Solo mantenemos la persistencia de la
// // suplantación (impersonation) si es necesaria.

// const storedImpersonationState = localStorage.getItem("impersonation_state");
// const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

// const initialState = {
//     isLoggedIn: false, // Inicia siempre en false, App.jsx lo pondrá en true
//     name: "",
//     // Usamos esta estructura consistente que App.jsx alimenta:
//     user: {
//         uid: null, // ID de Firebase Auth
//         name: "",
//         email: "",
//         role: "invitado",
//         // Aquí puedes incluir phone, bio, photo, etc.
//     }, 
//     role: "invitado", // Inicializa con el valor por defecto
//     
//     // Mantenemos la lógica de suplantación (impersonation)
//     isImpersonating: initialImpersonation.isImpersonating || false,
//     targetUserId: initialImpersonation.targetUserId || null,
//     adminToken: initialImpersonation.adminToken || null, 
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
//             
//             if (!action.payload) {
//                 // 🛑 Eliminado: localStorage.removeItem(LOCAL_STORAGE_KEY); 
//                 localStorage.removeItem("impersonation_state"); 
//                 
//                 // Limpiar todo el estado de usuario al cerrar sesión
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = { uid: null, name: "", email: "", role: "invitado" };
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null;
//             }
//         },
//         SET_NAME(state, action) {
//             state.name = action.payload;
//             // Opcional: actualizar el nombre dentro del objeto user
//             if (state.user) {
//                 state.user.name = action.payload; 
//             }
//         },
//         SET_USER(state, action) {
//             // Este reducer recibe el objeto completo de usuario desde App.jsx
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.uid) {
//                 return; // Debe tener un UID para ser válido
//             }
//             
//             // 🛑 Eliminado: localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData)); 

//             state.user = userData;
//             state.name = userData.name || "";

//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
//         },
//         
//         SET_IMPERSONATION(state, action) {
//             // ... (Lógica de suplantación sin cambios)
//             const { targetUserId, adminToken, activate } = action.payload;
//             
//             if (activate) {
//                 state.isImpersonating = true;
//                 state.adminToken = adminToken; 
//                 state.targetUserId = targetUserId;
//                 
//                 localStorage.setItem("impersonation_state", JSON.stringify({
//                     isImpersonating: true,
//                     targetUserId,
//                     adminToken
//                 }));
//             } else {
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null; 
//                 localStorage.removeItem("impersonation_state");
//             }
//         }
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION } = authSlice.actions;

// export default authSlice.reducer;

// // ----------------------------------------------------
// // SELECTORES CLAVE
// // ----------------------------------------------------

// // ... (Selectores básicos sin cambios)
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role; 
// export const selectUser = (state) => state.auth.user; 
// export const selectIsImpersonating = (state) => state.auth.isImpersonating;
// export const selectTargetUserId = (state) => state.auth.targetUserId;
// export const selectAdminToken = (state) => state.auth.adminToken;

// /**
//  * Devuelve el ID del usuario activo (o el ID del usuario impersonado).
//  * CLAVE: Ahora busca 'uid' que es el ID de Firebase.
//  */
// export const selectUserId = (state) => {
//     // 1. Si estamos impersonando, devolvemos el ID del usuario objetivo
//     if (state.auth.isImpersonating) {
//         return state.auth.targetUserId;
//     }
//     // 2. Si no estamos impersonando, devolvemos el ID de la sesión activa de Firebase
//     return state.auth.user?.uid || null; // ⬅️ CAMBIO CRÍTICO: Usamos 'uid'
// };


// --- src/features/auth/authSlice/authSlice.js (CÓDIGO COMPLETO) ---

// import { createSlice } from "@reduxjs/toolkit";

// // 🛑 Importante: Recuperamos el estado de suplantación desde localStorage
// const storedImpersonationState = localStorage.getItem("impersonation_state");
// const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

// const initialState = {
//     isLoggedIn: false, // App.jsx debe ponerlo en true/false basado en la sesión de Firebase
//     name: "",
//     // Usamos esta estructura consistente para almacenar los detalles del usuario:
//     user: {
//         uid: null, // ID de Firebase Auth (CLAVE para el backend)
//         name: "",
//         email: "",
//         role: "invitado",
//     }, 
//     role: "invitado", // El rol activo (por defecto 'invitado')
    
//     // Lógica de suplantación (impersonation)
//     isImpersonating: initialImpersonation.isImpersonating || false,
//     targetUserId: initialImpersonation.targetUserId || null,
//     adminToken: initialImpersonation.adminToken || null, 
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         // Establece si el usuario está logueado o no
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
            
//             if (!action.payload) {
//                 // Limpiar persistencia y estado al cerrar sesión
//                 localStorage.removeItem("impersonation_state"); 
                
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = { uid: null, name: "", email: "", role: "invitado" };
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null;
//             }
//         },
//         // Establece el nombre del usuario
//         SET_NAME(state, action) {
//             state.name = action.payload;
//             if (state.user) {
//                 state.user.name = action.payload; 
//             }
//         },
//         // Establece todos los datos del usuario después del login/refresh
//         SET_USER(state, action) {
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.uid) {
//                 return; 
//             }
            
//             state.user = userData;
//             state.name = userData.name || "";

//             // 🛑 CRÍTICO: Asignación y normalización del Rol 
//             // Si el rol no existe en Firestore, por defecto es 'usuario'.
//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
            
//             // Aseguramos que el rol dentro del objeto user también esté normalizado
//             state.user.role = state.role; 
//         },
        
//         // Maneja la suplantación de identidad (Admin -> User)
//         SET_IMPERSONATION(state, action) {
//             const { targetUserId, adminToken, activate } = action.payload;
            
//             if (activate) {
//                 state.isImpersonating = true;
//                 state.adminToken = adminToken; 
//                 state.targetUserId = targetUserId;
                
//                 localStorage.setItem("impersonation_state", JSON.stringify({
//                     isImpersonating: true,
//                     targetUserId,
//                     adminToken
//                 }));
//             } else {
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null; 
//                 localStorage.removeItem("impersonation_state");
//             }
//         }
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION } = authSlice.actions;

// export default authSlice.reducer;

// // ----------------------------------------------------
// // SELECTORES CLAVE
// // ----------------------------------------------------

// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role; 
// export const selectUser = (state) => state.auth.user; 
// export const selectIsImpersonating = (state) => state.auth.isImpersonating;
// export const selectTargetUserId = (state) => state.auth.targetUserId;
// export const selectAdminToken = (state) => state.auth.adminToken;

// /**
//  * Devuelve el ID del usuario activo o el ID del usuario impersonado (Target).
//  * CLAVE: Utiliza 'uid' que es el ID de Firebase.
//  */
// export const selectUserId = (state) => {
//     // 1. Si estamos suplantando, devolvemos el ID del usuario objetivo
//     if (state.auth.isImpersonating) {
//         return state.auth.targetUserId;
//     }
//     // 2. Si no, devolvemos el ID de la sesión activa de Firebase
//     return state.auth.user?.uid || null; 
// };


import { createSlice } from "@reduxjs/toolkit";

// 🛑 PASO 1: Cargamos los datos de sesión persistentes
const storedImpersonationState = localStorage.getItem("impersonation_state");
const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

// 🔑 CLAVE: Cargamos el token JWT/ID Token de Firebase guardado por Login.js
const userToken = localStorage.getItem('userToken'); 

const initialState = {
    // Determinamos el estado de login basándonos en si existe el token
    isLoggedIn: !!userToken, 
    name: "",
    
    // 🛑 PROPIEDAD CRÍTICA: Almacena el token JWT
    token: userToken || null, 
    
    user: {
        uid: null, 
        name: "",
        email: "",
        role: "invitado",
    }, 
    role: "invitado", 
    
    // Lógica de suplantación (impersonation)
    isImpersonating: initialImpersonation.isImpersonating || false,
    targetUserId: initialImpersonation.targetUserId || null,
    adminToken: initialImpersonation.adminToken || null, 
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // 🛑 NUEVO REDUCER: Guarda el token en el estado
        SET_TOKEN(state, action) {
            state.token = action.payload;
        },
        
        SET_LOGIN(state, action) {
            state.isLoggedIn = action.payload;
            
            if (!action.payload) {
                // Limpieza de persistencia
                localStorage.removeItem("impersonation_state"); 
                localStorage.removeItem("userToken"); // 🔑 Limpiar el token al cerrar sesión
                
                // Limpieza de estado
                state.role = "invitado";
                state.name = "";
                state.user = { uid: null, name: "", email: "", role: "invitado" };
                state.isImpersonating = false;
                state.targetUserId = null;
                state.adminToken = null;
                state.token = null; // Limpiar el estado del token
            }
        },
        
        SET_NAME(state, action) {
            state.name = action.payload;
            if (state.user) {
                state.user.name = action.payload; 
            }
        },
        
        SET_USER(state, action) {
            const userData = action.payload;

            if (!userData || typeof userData !== 'object' || !userData.uid) {
                return; 
            }
            
            state.user = userData;
            state.name = userData.name || "";
            
            const rawRole = userData.role ?? "usuario"; 
            state.role = rawRole.toLowerCase().trim();
            state.user.role = state.role; 
        },
        
        SET_IMPERSONATION(state, action) {
            const { targetUserId, adminToken, activate } = action.payload;
            
            if (activate) {
                state.isImpersonating = true;
                state.adminToken = adminToken; 
                state.targetUserId = targetUserId;
                
                localStorage.setItem("impersonation_state", JSON.stringify({
                    isImpersonating: true,
                    targetUserId,
                    adminToken
                }));
            } else {
                state.isImpersonating = false;
                state.targetUserId = null;
                state.adminToken = null; 
                localStorage.removeItem("impersonation_state");
            }
        }
    },
});

// 🔑 Exportar el nuevo reducer SET_TOKEN
export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION, SET_TOKEN } = authSlice.actions; 

export default authSlice.reducer;

// ----------------------------------------------------
// SELECTORES CLAVE
// ----------------------------------------------------

// SELECTOR CRÍTICO: El logSlice lo lee desde aquí (thunkAPI.getState().auth.token)
export const selectToken = (state) => state.auth.token; 
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectRole = (state) => state.auth.role; 
export const selectUser = (state) => state.auth.user; 

/**
 * Devuelve el ID del usuario activo o el ID del usuario impersonado (Target).
 */
export const selectUserId = (state) => {
    // 1. Si estamos suplantando, devolvemos el ID del usuario objetivo
    if (state.auth.isImpersonating) {
        return state.auth.targetUserId;
    }
    // 2. Si no, devolvemos el ID de la sesión activa de Firebase
    return state.auth.user?.uid || null; 
};