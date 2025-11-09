
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
