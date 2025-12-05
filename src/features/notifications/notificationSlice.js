import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, updateDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();
const NOTIFICATIONS_COLLECTION_PATH = `artifacts/${appId}/public/data/notifications`;

// Thunk para cargar notificaciones desde Firebase
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        try {
            const state = getState();
            const userId = state.auth.userId || state.auth.user?.uid;
            const userRole = state.auth.user?.role || 'user';

            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION_PATH);
            const q = query(notificationsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const notifications = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        _id: doc.id,
                        id: doc.id,
                        ...data,
                        // Convertir Firebase Timestamp a string ISO para Redux
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                        // Determinar si el usuario ha leído esta notificación
                        isRead: data.readBy?.includes(userId) || false,
                        readBy: data.readBy || []
                    };
                })
                .filter(notif => {
                    // Filtrar según el target
                    if (notif.target === 'all') return true;
                    if (notif.target === 'admin' && userRole === 'admin') return true;
                    if (notif.target === 'user' && userRole !== 'admin') return true;
                    return false;
                });

            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }
);

// Thunk para marcar como leída
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { getState }) => {
        try {
            const state = getState();
            const userId = state.auth.userId || state.auth.user?.uid;

            if (!userId) {
                console.error('No userId found');
                throw new Error('Usuario no identificado');
            }

            const notifDocRef = doc(db, NOTIFICATIONS_COLLECTION_PATH, notificationId);
            
            // Obtener la notificación actual
            const notification = state.notifications.items.find(n => n._id === notificationId);
            const currentReadBy = notification?.readBy || [];

            // Agregar el userId si no está ya
            if (!currentReadBy.includes(userId)) {
                await updateDoc(notifDocRef, {
                    readBy: [...currentReadBy, userId]
                });
            }

            return { notificationId, userId };
        } catch (error) {
            console.error('Error marking as read:', error);
            throw error;
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null
    },
    reducers: {
        // Acción para actualizar notificaciones en tiempo real (desde listener)
        setNotifications: (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const { notificationId, userId } = action.payload;
                const notification = state.items.find(n => n._id === notificationId);
                if (notification) {
                    notification.isRead = true;
                    if (!notification.readBy) {
                        notification.readBy = [];
                    }
                    if (!notification.readBy.includes(userId)) {
                        notification.readBy.push(userId);
                    }
                }
                state.unreadCount = state.items.filter(n => !n.isRead).length;
            });
    }
});

export const { setNotifications } = notificationSlice.actions;

// Selectores
export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.loading;

export default notificationSlice.reducer;
