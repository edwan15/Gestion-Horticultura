// // import { createSlice } from "@reduxjs/toolkit";

// // const name = JSON.parse(localStorage.getItem("name"))

// // const initialState = {
// //   isLoggedIn: false,
// //   name: name ? name : "",

// //   user: {
// //     name: "",
// //     email: "",
// //     phone: "",
// //     bio: "",
// //     photo: "",
// //   },
// // };

// // const authSlice = createSlice({
// //   name: "auth",
// //   initialState,
// //   reducers: {
// //     SET_LOGIN(state, action) {
// //       state.isLoggedIn = action.payload;
// //     },
// //     SET_NAME(state, action) {
// //       localStorage.setItem("name", JSON.stringify(action.payload));
// //       state.name = action.payload;
// //     },
// //     SET_USER(state, action) {
// //       const profile = action.payload;
// //       state.user.name = profile.name;
// //       state.user.email = profile.email;
// //       state.user.phone = profile.phone;
// //       state.user.bio = profile.bio;
// //       state.user.photo = profile.photo;
// //     },
// //   },
// // });

// // export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// // export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// // export const selectName = (state) => state.auth.name;
// // export const selectUser = (state) => state.auth.user;

// // export default authSlice.reducer




// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoggedIn: false,
//   name: "",
//   user: null, // Para guardar el objeto completo del usuario
//   role: "invitado", // Rol por defecto si no está logeado
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     SET_LOGIN(state, action) {
//       state.isLoggedIn = action.payload;
//       // Si se cierra la sesión, reiniciamos el rol a 'invitado'
//       if (!action.payload) {
//         state.role = "invitado";
//         state.name = "";
//         state.user = null;
//       }
//     },
//     SET_NAME(state, action) {
//       state.name = action.payload;
//     },
//     SET_USER(state, action) {
//       const userData = action.payload;
//       state.user = userData;
//       state.name = userData.name;

//       // SOLUCIÓN FINAL: Extraer y normalizar el rol de forma segura.
//       // 1. Usa el encadenamiento opcional para evitar errores si userData es nulo.
//       // 2. Usa el operador de anulación lógica (??) para establecer 'usuario' como valor predeterminado si el rol no existe.
//       const rawRole = userData?.role ?? "usuario";

//       // Guardar el rol normalizado (limpio y en minúsculas)
//       state.role = rawRole.toLowerCase().trim();
//     },
//   },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// export default authSlice.reducer;

// // Selectores
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// // Selector que devuelve el rol ya normalizado
// export const selectRole = (state) => state.auth.role;
// export const selectUser = (state) => state.auth.user;

// --- src/redux/slice/authSlice.js ---
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     isLoggedIn: false,
//     name: "",
//     user: null, 
//     role: "invitado", // Rol por defecto si no está logeado
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
//             // Si se cierra la sesión, reiniciamos el rol a 'invitado'
//             if (!action.payload) {
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = null;
//             }
//         },
//         SET_NAME(state, action) {
//             state.name = action.payload;
//         },
//         SET_USER(state, action) {
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.name) {
//                 console.error("Payload de usuario no válido, forzando logout.");
//                 state.isLoggedIn = false;
//                 state.name = "";
//                 state.user = null;
//                 state.role = "invitado";
//                 return; 
//             }
            
//             state.user = userData;
//             state.name = userData.name;

//             // CLAVE: Asignar 'usuario' si el rol no viene, para asegurar un rol funcional.
//             // Siempre se almacena en minúsculas.
//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
//         },
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// export default authSlice.reducer;

// // Selectores para fácil acceso
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role;
// export const selectUser = (state) => state.auth.user;

// --- src/redux/slice/authSlice.js ---
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     isLoggedIn: false,
//     name: "",
//     user: null, // Debe contener .token y .role
//     role: "invitado", // Rol por defecto si no está logeado
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
//             // Limpiar el estado al cerrar la sesión
//             if (!action.payload) {
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = null;
//             }
//         },
//         SET_NAME(state, action) {
//             state.name = action.payload;
//         },
//         SET_USER(state, action) {
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.name) {
//                 return; 
//             }
//             
//             state.user = userData;
//             state.name = userData.name;

//             // CLAVE: Extraer el rol, usando "usuario" si no viene.
//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
//         },
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// export default authSlice.reducer;

// // Selectores
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role;
// export const selectUser = (state) => state.auth.user;

// --- src/features/auth/authSlice/authSlice.js (CORREGIDO) ---
// import { createSlice } from "@reduxjs/toolkit";

// // 1. Intentar cargar el usuario desde localStorage al iniciar el slice
// const storedUserData = localStorage.getItem("user_data");
// const initialUser = storedUserData ? JSON.parse(storedUserData) : null;
// const initialRole = initialUser?.role ? initialUser.role.toLowerCase().trim() : "invitado";
// const initialIsLoggedIn = !!initialUser;
// const initialName = initialUser?.name || "";

// const initialState = {
//     isLoggedIn: initialIsLoggedIn,
//     name: initialName,
//     user: initialUser, // Carga el usuario completo (incluyendo token) si existe
//     role: initialRole, 
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
//             
//             if (!action.payload) {
//                 // CLAVE 2: Limpiar el localStorage al cerrar sesión
//                 localStorage.removeItem("user_data"); 
//                 
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = null;
//             }
//         },
//         SET_NAME(state, action) {
//             state.name = action.payload;
//         },
//         SET_USER(state, action) {
//             const userData = action.payload;

//             if (!userData || typeof userData !== 'object' || !userData.name) {
//                 return; 
//             }
//             
//             // CLAVE 3: Persistir los datos del usuario (incluyendo token)
//             localStorage.setItem("user_data", JSON.stringify(userData)); 

//             state.user = userData;
//             state.name = userData.name;

//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
//         },
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// export default authSlice.reducer;

// // Selectores
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role;
// export const selectUser = (state) => state.auth.user;












// import { createSlice } from "@reduxjs/toolkit";

// // Helper para cargar/limpiar en localStorage
// const LOCAL_STORAGE_KEY = "user_data";

// // 1. Intentar cargar el usuario (Admin o Usuario normal) desde localStorage
// const storedUserData = localStorage.getItem(LOCAL_STORAGE_KEY);
// const initialUser = storedUserData ? JSON.parse(storedUserData) : null;
// const initialRole = initialUser?.role ? initialUser.role.toLowerCase().trim() : "invitado";
// const initialIsLoggedIn = !!initialUser;
// const initialName = initialUser?.name || "";

// // 🚨 Cargar estados de Impersonación si existen (ej. al recargar la página)
// const storedImpersonationState = localStorage.getItem("impersonation_state");
// const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

// const initialState = {
//     isLoggedIn: initialIsLoggedIn,
//     name: initialName,
//     user: initialUser,             // Usuario actualmente activo (o el Admin logueado)
//     role: initialRole, 
    
//     // 🚨 NUEVOS ESTADOS PARA LA IMPERSONACIÓN
//     isImpersonating: initialImpersonation.isImpersonating || false,
//     targetUserId: initialImpersonation.targetUserId || null,
//     // Aquí podrías guardar el user/token del Admin original, pero por ahora solo guardaremos el token si lo necesitas:
//     adminToken: initialImpersonation.adminToken || null, 
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         SET_LOGIN(state, action) {
//             state.isLoggedIn = action.payload;
            
//             if (!action.payload) {
//                 // CLAVE 2: Limpiar al cerrar sesión (tanto el user como la impersonación)
//                 localStorage.removeItem(LOCAL_STORAGE_KEY); 
//                 localStorage.removeItem("impersonation_state"); 
                
//                 state.role = "invitado";
//                 state.name = "";
//                 state.user = null;
//                 // Limpiar estados de impersonación
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
            
//             // CLAVE 3: Persistir los datos del usuario (incluyendo token)
//             localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData)); 

//             state.user = userData;
//             state.name = userData.name;

//             const rawRole = userData.role ?? "usuario"; 
//             state.role = rawRole.toLowerCase().trim();
            
//             // NOTA: Si esta función es llamada DESPUÉS de un login de Impersonación,
//             // sobrescribirá el user con el ID del usuario objetivo (Maria Rosa).
//         },
        
//         // 🚨 NUEVO REDUCER: Activar/desactivar el modo Impersonación
//         SET_IMPERSONATION(state, action) {
//             const { targetUserId, adminToken, activate } = action.payload;
            
//             if (activate) {
//                 // GUARDAR el estado original del Admin (su token) y el ID del objetivo
//                 state.isImpersonating = true;
//                 state.adminToken = adminToken; 
//                 state.targetUserId = targetUserId;
                
//                 // Persistir el estado de la impersonación
//                 localStorage.setItem("impersonation_state", JSON.stringify({
//                     isImpersonating: true,
//                     targetUserId,
//                     adminToken
//                 }));
//             } else {
//                 // DESACTIVAR: Se usa cuando el Admin quiere volver a su sesión
//                 state.isImpersonating = false;
//                 state.targetUserId = null;
//                 state.adminToken = null; 
//                 localStorage.removeItem("impersonation_state");
                
//                 // NOTA: La restauración de la sesión del Admin debe manejarse
//                 // en el componente/acción que llama a este reducer (ej. cargar el adminToken anterior)
//             }
//         }
//     },
// });

// export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION } = authSlice.actions;

// export default authSlice.reducer;

// // ----------------------------------------------------
// // 🚨 NUEVOS Y MODIFICADOS SELECTORES CLAVE
// // ----------------------------------------------------

// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectName = (state) => state.auth.name;
// export const selectRole = (state) => state.auth.role;
// export const selectUser = (state) => state.auth.user;

// // 1. Selector para el modo Impersonación
// export const selectIsImpersonating = (state) => state.auth.isImpersonating;

// // 2. Selector para el ID del usuario cuyos datos estamos viendo (Maria Rosa)
// export const selectTargetUserId = (state) => state.auth.targetUserId;

// // 3. Selector para el ID de la sesión actual (el que está "logueado" en el token actual)
// // Asumimos que el ID se almacena en user.id o user.userId. Si no existe, devuelve null.
// export const selectUserId = (state) => {
//     // Si estamos impersonando, el ID DE LOS DATOS es el targetUserId
//     if (state.auth.isImpersonating) {
//         return state.auth.targetUserId;
//     }
//     // Si no estamos impersonando, es el ID de la sesión activa
//     return state.auth.user?.id || state.auth.user?.userId || null;
// };

// // 4. Selector del ID del Admin original (necesario para restaurar la sesión)
// export const selectAdminToken = (state) => state.auth.adminToken;








// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // 🛑 RUTA AHORA ES VÁLIDA:
// import authService from '../../../services/authService'; 

// // Helper para cargar/limpiar en localStorage
// const LOCAL_STORAGE_KEY = "user_data";

// // ... (Resto del initialState sin cambios)
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

// // ----------------------------------------------------
// // THUNKS REALES (USANDO authService)
// // ----------------------------------------------------

// export const startImpersonation = createAsyncThunk(
//     "auth/startImpersonation",
//     async (targetUserId, thunkAPI) => {
//         const { auth } = thunkAPI.getState();
//         const currentAdminUser = auth.user;
        
//         try {
//             // 1. Obtener el token del Admin actual (para guardarlo)
//             const adminToken = currentAdminUser?.token;
            
//             // 2. 🛑 LLAMADA REAL A LA API
//             const response = await authService.requestImpersonationToken(targetUserId);

//             const { impersonationToken, userData } = response;
            
//             // 3. GUARDAR EL ESTADO DE IMPERSONACIÓN
//             thunkAPI.dispatch(SET_IMPERSONATION({
//                 targetUserId: targetUserId,
//                 adminToken: adminToken, 
//                 activate: true 
//             }));

//             // 4. Reemplazar el usuario activo con el usuario objetivo
//             thunkAPI.dispatch(SET_USER({ ...userData, token: impersonationToken }));
            
//             return { success: true };

//         } catch (error) {
//             const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );


// export const stopImpersonation = () => (dispatch, getState) => {
//     const { auth } = getState();
//     const adminToken = auth.adminToken;
    
//     // 1. Desactivar el modo Impersonación en Redux
//     dispatch(SET_IMPERSONATION({ activate: false }));
    
//     if (adminToken) {
//         // 2. Restaurar la sesión del Admin: 
//         // Lógica placeholder: debes tener una forma de cargar los datos de la sesión del Admin
        
//         const adminDataPlaceholder = { 
//             name: "Administrador Restaurado", 
//             role: "admin", 
//             token: adminToken,
//             id: auth.user?.impersonatorId || "admin_1" // Usar un ID si se conoce
//         };
//         dispatch(SET_USER(adminDataPlaceholder));
        
//     } else {
//         // Si no se guardó el adminToken, forzar el cierre de sesión
//         dispatch(SET_LOGIN(false));
//     }
// };

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

// // export const selectUserId = (state) => {
// //     if (state.auth.isImpersonating) {
// //         return state.auth.targetUserId;
// //     }
// //     return state.auth.user?.id || state.auth.user?.userId || null;
// // };

// export const selectUserId = (state) => {
//     // Si estamos en modo impersonación, el ID es el targetUserId.
//     if (state.auth.isImpersonating) {
//         return state.auth.targetUserId;
//     }
    
//     // 🔑 CORRECCIÓN CLAVE: 
//     // Ahora buscamos 'id', 'userId', o '_id' (que es el ID devuelto por MongoDB).
//     return state.auth.user?.id || state.auth.user?.userId || state.auth.user?._id || null;
// };


import { createSlice } from "@reduxjs/toolkit";

// Helper para cargar/limpiar en localStorage
const LOCAL_STORAGE_KEY = "user_data";

// 1. Intentar cargar el usuario desde localStorage
const storedUserData = localStorage.getItem(LOCAL_STORAGE_KEY);
const initialUser = storedUserData ? JSON.parse(storedUserData) : null;
const initialRole = initialUser?.role ? initialUser.role.toLowerCase().trim() : "invitado";
const initialIsLoggedIn = !!initialUser;
const initialName = initialUser?.name || "";

const storedImpersonationState = localStorage.getItem("impersonation_state");
const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

const initialState = {
    isLoggedIn: initialIsLoggedIn,
    name: initialName,
    user: initialUser, 
    role: initialRole, 
    isImpersonating: initialImpersonation.isImpersonating || false,
    targetUserId: initialImpersonation.targetUserId || null,
    adminToken: initialImpersonation.adminToken || null, 
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_LOGIN(state, action) {
            state.isLoggedIn = action.payload;
            
            if (!action.payload) {
                localStorage.removeItem(LOCAL_STORAGE_KEY); 
                localStorage.removeItem("impersonation_state"); 
                
                state.role = "invitado";
                state.name = "";
                state.user = null;
                state.isImpersonating = false;
                state.targetUserId = null;
                state.adminToken = null;
            }
        },
        SET_NAME(state, action) {
            state.name = action.payload;
        },
        SET_USER(state, action) {
            const userData = action.payload;

            if (!userData || typeof userData !== 'object' || !userData.name) {
                return; 
            }
            
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData)); 

            state.user = userData;
            state.name = userData.name;

            const rawRole = userData.role ?? "usuario"; 
            state.role = rawRole.toLowerCase().trim();
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

export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION } = authSlice.actions;

export default authSlice.reducer;

// ----------------------------------------------------
// SELECTORES CLAVE
// ----------------------------------------------------

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectRole = (state) => state.auth.role; 
export const selectUser = (state) => state.auth.user; 
export const selectIsImpersonating = (state) => state.auth.isImpersonating;
export const selectTargetUserId = (state) => state.auth.targetUserId;
export const selectAdminToken = (state) => state.auth.adminToken;

/**
 * Devuelve el ID del usuario activo (o el ID del usuario impersonado).
 * Prioriza _id (MongoDB) para la sesión activa.
 */
export const selectUserId = (state) => {
    // 1. Si estamos impersonando, devolvemos el ID del usuario objetivo
    if (state.auth.isImpersonating) {
        return state.auth.targetUserId;
    }
    // 2. Si no estamos impersonando, devolvemos el ID de la sesión activa
    return state.auth.user?._id || state.auth.user?.id || state.auth.user?.userId || null;
};