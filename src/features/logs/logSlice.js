import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import logService from "../../services/logService";
import { toast } from "react-toastify";

const initialState = {
    logs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// 🔑 Obtener logs (Acción Asíncrona)
export const getLogs = createAsyncThunk(
    "logs/getAll",
    async (_, thunkAPI) => {
        try {
            // 🛑 CORRECCIÓN CRÍTICA: Obtener un token FRESCO de Firebase
            const { auth } = await import("../../firebaseConfig");
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                return thunkAPI.rejectWithValue("No hay usuario autenticado. Por favor, inicia sesión.");
            }

            // 🔑 Obtener un token fresco (esto maneja automáticamente la expiración)
            const freshToken = await currentUser.getIdToken(true); // true = forzar refresh
            
            // Pasar el token fresco al servicio
            return await logService.getLogs(freshToken);
            
        } catch (error) {
            // Manejo de errores de red o errores 401/500 del backend
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- SLICE ---
const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        RESET_LOGS(state) {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    // Manejo del ciclo de vida de la acción asíncrona getLogs
    extraReducers: (builder) => {
        builder
            .addCase(getLogs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.logs = action.payload; // Los logs cargados
            })
            .addCase(getLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                // Muestra la alerta con el mensaje de error
                toast.error(action.payload); 
            });
    },
});

export const { RESET_LOGS } = logSlice.actions;

// --- Selectors ---
export const selectLogs = (state) => state.log.logs;
export const selectIsLogLoading = (state) => state.log.isLoading;
export const selectLogMessage = (state) => state.log.message;

export default logSlice.reducer;