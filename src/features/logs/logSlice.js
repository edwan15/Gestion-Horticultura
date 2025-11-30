// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import logService from "../../services/logService";
// import { toast } from "react-toastify";

// const initialState = {
//     logs: [],
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: "",
// };

// // 🔑 Obtener logs (Acción Asíncrona)
// export const getLogs = createAsyncThunk(
//     "logs/getAll",
//     async (_, thunkAPI) => {
//         try {
//             // 🛑 CORRECCIÓN CRÍTICA: Obtener un token FRESCO de Firebase
//             const { auth } = await import("../../firebaseConfig");
//             const currentUser = auth.currentUser;
            
//             if (!currentUser) {
//                 return thunkAPI.rejectWithValue("No hay usuario autenticado. Por favor, inicia sesión.");
//             }

//             // 🔑 Obtener un token fresco (esto maneja automáticamente la expiración)
//             const freshToken = await currentUser.getIdToken(true); // true = forzar refresh
            
//             // Pasar el token fresco al servicio
//             return await logService.getLogs(freshToken);
            
//         } catch (error) {
//             // Manejo de errores de red o errores 401/500 del backend
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// // --- SLICE ---
// const logSlice = createSlice({
//     name: "log",
//     initialState,
//     reducers: {
//         RESET_LOGS(state) {
//             state.isError = false;
//             state.isSuccess = false;
//             state.isLoading = false;
//             state.message = "";
//         },
//     },
//     // Manejo del ciclo de vida de la acción asíncrona getLogs
//     extraReducers: (builder) => {
//         builder
//             .addCase(getLogs.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getLogs.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.logs = action.payload; // Los logs cargados
//             })
//             .addCase(getLogs.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 // Muestra la alerta con el mensaje de error
//                 toast.error(action.payload); 
//             });
//     },
// });

// export const { RESET_LOGS } = logSlice.actions;

// // --- Selectors ---
// export const selectLogs = (state) => state.log.logs;
// export const selectIsLogLoading = (state) => state.log.isLoading;
// export const selectLogMessage = (state) => state.log.message;

// export default logSlice.reducer;



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
            const { auth } = await import("../../firebaseConfig");
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                return thunkAPI.rejectWithValue("No hay usuario autenticado. Por favor, inicia sesión.");
            }

            // 🔑 Obtener un token fresco
            const freshToken = await currentUser.getIdToken(true); 
            
            // 1. Obtener los logs del servicio
            const logs = await logService.getLogs(freshToken);

            // 🛑 2. CORRECCIÓN DE SERIALIZACIÓN: Convertir Timestamp a string
            const sanitizedLogs = logs.map(log => ({
                ...log,
                // Si 'createdAt' es un Timestamp de Firebase (tiene el método toDate), lo convertimos.
                createdAt: log.createdAt && typeof log.createdAt.toDate === 'function' 
                           ? log.createdAt.toDate().toISOString() 
                           : log.createdAt, 
                
                // Si tienes otros campos de fecha (como 'updatedAt'), también deberías convertirlos aquí.
                // updatedAt: log.updatedAt && typeof log.updatedAt.toDate === 'function' 
                //            ? log.updatedAt.toDate().toISOString() 
                //            : log.updatedAt,
            }));
            
            // Devolvemos el array saneado, listo para ser guardado en Redux
            return sanitizedLogs;
            
        } catch (error) {
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
                // Ahora action.payload contiene objetos serializables
                state.logs = action.payload; 
            })
            .addCase(getLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
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