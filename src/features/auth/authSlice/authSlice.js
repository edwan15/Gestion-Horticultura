import { createSlice } from "@reduxjs/toolkit";

const storedImpersonationState = localStorage.getItem("impersonation_state");
const initialImpersonation = storedImpersonationState ? JSON.parse(storedImpersonationState) : {};

const userToken = localStorage.getItem('userToken');

const initialState = {
    isLoggedIn: !!userToken,
    name: "",
    token: userToken || null,
    user: {
        uid: null,
        name: "",
        email: "",
        createdAt: null,
        role: "invitado",
    },
    role: "invitado",
    isImpersonating: initialImpersonation.isImpersonating || false,
    targetUserId: initialImpersonation.targetUserId || null,
    adminToken: initialImpersonation.adminToken || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_TOKEN(state, action) {
            state.token = action.payload;
        },
        SET_LOGIN(state, action) {
            state.isLoggedIn = action.payload;
            if (!action.payload) {
                localStorage.removeItem("impersonation_state");
                localStorage.removeItem("userToken");
                state.role = "invitado";
                state.name = "";
                state.user = { uid: null, name: "", email: "", createdAt: null, role: "invitado" };
                state.isImpersonating = false;
                state.targetUserId = null;
                state.adminToken = null;
                state.token = null;
            }
        },
        SET_NAME(state, action) {
            state.name = action.payload;
        },
        SET_USER(state, action) {
            const userData = action.payload;
            if (!userData || typeof userData !== 'object' || !userData.uid) {
                return; 
            }
            
            // 🛑 CORRECCIÓN: Sanear los campos `createdAt` y `updatedAt` si son objetos Timestamp de Firebase
            const sanitizedUser = {
                ...userData,
                createdAt: userData.createdAt && typeof userData.createdAt.toDate === 'function' 
                           ? userData.createdAt.toDate().toISOString() 
                           : userData.createdAt,
                updatedAt: userData.updatedAt && typeof userData.updatedAt.toDate === 'function' 
                           ? userData.updatedAt.toDate().toISOString() 
                           : userData.updatedAt,
            };
            
            state.user = sanitizedUser;
            state.name = sanitizedUser.name || "";
            
            const rawRole = sanitizedUser.role ?? "usuario"; 
            state.role = rawRole.toLowerCase().trim();
            state.user.role = state.role; 
        },
        SET_IMPERSONATION(state, action) {
            const { isImpersonating, targetUserId, adminToken } = action.payload;
            state.isImpersonating = isImpersonating;
            if (isImpersonating) {
                state.adminToken = adminToken;
                state.targetUserId = targetUserId;
                localStorage.setItem("impersonation_state", JSON.stringify({
                    isImpersonating: true,
                    targetUserId,
                    adminToken
                }));
            } else {
                state.targetUserId = null;
                state.adminToken = null;
                localStorage.removeItem("impersonation_state");
            }
        }
    },
});

export const { SET_LOGIN, SET_NAME, SET_USER, SET_IMPERSONATION, SET_TOKEN } = authSlice.actions;

export default authSlice.reducer;

export const selectToken = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectRole = (state) => state.auth.role;
export const selectUser = (state) => state.auth.user;
export const selectIsImpersonating = (state) => state.auth.isImpersonating;
export const selectTargetUserId = (state) => state.auth.targetUserId;
export const selectAdminToken = (state) => state.auth.adminToken;

export const selectUserId = (state) => {
    if (state.auth.isImpersonating) {
        return state.auth.targetUserId;
    }
    return state.auth.user?.uid || null;
};