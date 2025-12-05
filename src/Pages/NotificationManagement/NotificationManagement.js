import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdAdd, MdDelete, MdCheckCircle, MdWarning, MdInfo, MdAnnouncement, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { selectUserId } from '../../features/auth/authSlice/authSlice';

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();
const NOTIFICATIONS_COLLECTION_PATH = `artifacts/${appId}/public/data/notifications`;

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info', // info, warning, success, urgent, announcement
        target: 'all' // all, admin, user
    });
    
    const userId = useSelector(selectUserId);
    const user = useSelector((state) => state.auth.user);

    // Cargar notificaciones desde Firebase
    const fetchNotifications = async () => {
        try {
            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION_PATH);
            const q = query(notificationsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            
            const notifList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setNotifications(notifList);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Error al cargar notificaciones");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        try {
            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION_PATH);
            
            await addDoc(notificationsRef, {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                target: formData.target,
                createdBy: userId,
                createdByName: user?.name || user?.email || 'Sistema',
                createdAt: serverTimestamp(),
                read: false,
                readBy: [] // Array de IDs de usuarios que han leído la notificación
            });
            
            toast.success("Notificación enviada exitosamente");
            setFormData({ title: '', message: '', type: 'info', target: 'all' });
            fetchNotifications();
        } catch (error) {
            console.error("Error creating notification:", error);
            toast.error("Error al enviar la notificación");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta notificación?")) return;

        try {
            const notifDocRef = doc(db, NOTIFICATIONS_COLLECTION_PATH, id);
            await deleteDoc(notifDocRef);
            toast.success("Notificación eliminada");
            fetchNotifications();
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("Error al eliminar");
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning': return <MdWarning className="text-amber-500" />;
            case 'success': return <MdCheckCircle className="text-green-500" />;
            case 'urgent': return <MdWarning className="text-red-500" />;
            case 'announcement': return <MdAnnouncement className="text-blue-500" />;
            default: return <MdInfo className="text-gray-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'warning': return 'bg-amber-100 text-amber-700';
            case 'success': return 'bg-green-100 text-green-700';
            case 'urgent': return 'bg-red-100 text-red-700';
            case 'announcement': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                        <MdNotifications className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Notificaciones</h1>
                        <p className="text-gray-500">Envía anuncios y alertas a los usuarios del sistema</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de Creación */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MdAdd className="text-green-600" />
                                Nueva Notificación
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
                                        placeholder="Ej: Mantenimiento programado"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none h-32"
                                        placeholder="Escribe el contenido del anuncio..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select 
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
                                        >
                                            <option value="info">Información</option>
                                            <option value="success">Éxito</option>
                                            <option value="warning">Advertencia</option>
                                            <option value="urgent">Urgente</option>
                                            <option value="announcement">Anuncio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Audiencia</label>
                                        <select 
                                            name="target"
                                            value={formData.target}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="user">Usuarios</option>
                                            <option value="admin">Administradores</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MdSend /> Enviar Notificación
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Notificaciones */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800">Historial de Notificaciones</h2>
                                <p className="text-sm text-gray-500 mt-1">Total: {notifications.length} notificaciones</p>
                            </div>
                            
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-4">Cargando notificaciones...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                    <MdNotifications className="text-5xl mb-3 opacity-20" />
                                    <p>No hay notificaciones registradas</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notif) => (
                                        <motion.div 
                                            key={notif.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 hover:bg-gray-50 transition-colors flex gap-4"
                                        >
                                            <div className="mt-1 text-2xl">
                                                {getTypeIcon(notif.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-800">{notif.title}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-400">
                                                            {notif.createdAt && formatDistanceToNow(
                                                                notif.createdAt.toDate ? notif.createdAt.toDate() : new Date(notif.createdAt), 
                                                                { addSuffix: true, locale: es }
                                                            )}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDelete(notif.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                                                <div className="flex gap-2 items-center">
                                                    <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium tracking-wide ${getTypeColor(notif.type)}`}>
                                                        {notif.type}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full uppercase font-medium tracking-wide">
                                                        {notif.target}
                                                    </span>
                                                    {notif.createdByName && (
                                                        <span className="text-xs text-gray-500">
                                                            por {notif.createdByName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationManagement;