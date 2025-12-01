import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";
const API_URL = `${BACKEND_URL}/api/notifications`;

// Async Thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchActive',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-id': thunkAPI.getState().auth.user?.uid
                }
            };
            const response = await axios.get(`${API_URL}/active`, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-id': thunkAPI.getState().auth.user?.uid
                }
            };
            await axios.put(`${API_URL}/${id}/read`, {}, config);
            return id;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectIsLoading = (state) => state.notifications.isLoading;

export default notificationSlice.reducer;
