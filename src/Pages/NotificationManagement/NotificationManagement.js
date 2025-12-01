// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { MdNotifications, MdAdd, MdDelete, MdCheckCircle, MdWarning, MdInfo, MdAnnouncement, MdSend } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { formatDistanceToNow } from 'date-fns';
// import { es } from 'date-fns/locale';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";

// const NotificationManagement = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [formData, setFormData] = useState({
//         title: '',
//         message: '',
//         type: 'info', // info, warning, success, urgent, announcement
//         target: 'all' // all, admin, user
//     });
//     const token = useSelector((state) => state.auth.token);
//     const user = useSelector((state) => state.auth.user);

//     // Cargar notificaciones
//     const fetchNotifications = async () => {
//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'x-user-id': user?.uid,
//                     'x-user-role': user?.role
//                 }
//             };
//             const response = await axios.get(`${BACKEND_URL}/api/notifications`, config);
//             setNotifications(response.data);
//             setIsLoading(false);
//         } catch (error) {
//             console.error("Error fetching notifications:", error);
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchNotifications();
//     }, []);

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.title || !formData.message) {
//             toast.error("Por favor completa todos los campos");
//             return;
//         }

//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'x-user-id': user?.uid,
//                     'x-user-role': user?.role
//                 }
//             };
//             await axios.post(`${BACKEND_URL}/api/notifications`, formData, config);
//             toast.success("Notificación enviada exitosamente");
//             setFormData({ title: '', message: '', type: 'info', target: 'all' });
//             fetchNotifications();
//         } catch (error) {
//             console.error("Error creating notification:", error);
//             toast.error("Error al enviar la notificación");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("¿Estás seguro de eliminar esta notificación?")) return;

//         try {
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'x-user-id': user?.uid,
//                     'x-user-role': user?.role
//                 }
//             };
//             await axios.delete(`${BACKEND_URL}/api/notifications/${id}`, config);
//             toast.success("Notificación eliminada");
//             fetchNotifications();
//         } catch (error) {
//             console.error("Error deleting notification:", error);
//             toast.error("Error al eliminar");
//         }
//     };

//     const getTypeIcon = (type) => {
//         switch (type) {
//             case 'warning': return <MdWarning className="text-amber-500" />;
//             case 'success': return <MdCheckCircle className="text-green-500" />;
//             case 'urgent': return <MdWarning className="text-red-500" />;
//             case 'announcement': return <MdAnnouncement className="text-blue-500" />;
//             default: return <MdInfo className="text-gray-500" />;
//         }
//     };

//     return (
//         <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex items-center gap-3 mb-8">
//                     <div className="p-3 bg-green-100 rounded-xl text-green-600">
//                         <MdNotifications className="text-2xl" />
//                     </div>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Gestión de Notificaciones</h1>
//                         <p className="text-gray-500">Envía anuncios y alertas a los usuarios del sistema</p>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Formulario de Creación */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
//                             <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                                 <MdAdd className="text-green-600" />
//                                 Nueva Notificación
//                             </h2>
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
//                                     <input 
//                                         type="text" 
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
//                                         placeholder="Ej: Mantenimiento programado"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
//                                     <textarea 
//                                         name="message"
//                                         value={formData.message}
//                                         onChange={handleInputChange}
//                                         className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none h-32"
//                                         placeholder="Escribe el contenido del anuncio..."
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
//                                         <select 
//                                             name="type"
//                                             value={formData.type}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
//                                         >
//                                             <option value="info">Información</option>
//                                             <option value="success">Éxito</option>
//                                             <option value="warning">Advertencia</option>
//                                             <option value="urgent">Urgente</option>
//                                             <option value="announcement">Anuncio</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Audiencia</label>
//                                         <select 
//                                             name="target"
//                                             value={formData.target}
//                                             onChange={handleInputChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none"
//                                         >
//                                             <option value="all">Todos</option>
//                                             <option value="user">Usuarios</option>
//                                             <option value="admin">Administradores</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <button 
//                                     type="submit" 
//                                     className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                                 >
//                                     <MdSend /> Enviar Notificación
//                                 </button>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Lista de Notificaciones */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                             <div className="p-6 border-b border-gray-100">
//                                 <h2 className="text-lg font-bold text-gray-800">Historial de Notificaciones</h2>
//                             </div>
                            
//                             {isLoading ? (
//                                 <div className="p-8 text-center text-gray-500">Cargando...</div>
//                             ) : notifications.length === 0 ? (
//                                 <div className="p-12 text-center text-gray-400 flex flex-col items-center">
//                                     <MdNotifications className="text-5xl mb-3 opacity-20" />
//                                     <p>No hay notificaciones registradas</p>
//                                 </div>
//                             ) : (
//                                 <div className="divide-y divide-gray-50">
//                                     {notifications.map((notif) => (
//                                         <motion.div 
//                                             key={notif._id}
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             className="p-6 hover:bg-gray-50 transition-colors flex gap-4"
//                                         >
//                                             <div className="mt-1 text-2xl">
//                                                 {getTypeIcon(notif.type)}
//                                             </div>
//                                             <div className="flex-1">
//                                                 <div className="flex justify-between items-start mb-1">
//                                                     <h3 className="font-bold text-gray-800">{notif.title}</h3>
//                                                     <div className="flex items-center gap-3">
//                                                         <span className="text-xs text-gray-400">
//                                                             {notif.createdAt && formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
//                                                         </span>
//                                                         <button 
//                                                             onClick={() => handleDelete(notif._id)}
//                                                             className="text-gray-400 hover:text-red-500 transition-colors"
//                                                             title="Eliminar"
//                                                         >
//                                                             <MdDelete />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
//                                                 <div className="flex gap-2">
//                                                     <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full uppercase font-medium tracking-wide">
//                                                         {notif.type}
//                                                     </span>
//                                                     <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full uppercase font-medium tracking-wide">
//                                                         {notif.target}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotificationManagement;



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdAdd, MdDelete, MdCheckCircle, MdWarning, MdInfo, MdAnnouncement, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Asegúrate de que esta variable de entorno esté configurada
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info', // info, warning, success, urgent, announcement
        target: 'all' // all, admin, user (Nota: Tu backend usa targetAudience, pero target funciona)
    });
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    // Función auxiliar para manejar errores de Axios y Toast
    const handleAxiosError = (error, defaultMessage) => {
        const message = error.response?.data?.message || defaultMessage;
        toast.error(message);
        console.error("Error API:", error.response?.data || error.message);
    };

    // Cargar notificaciones (Ajustado a /api/notifications/admin)
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-id': user?.uid,
                    'x-user-role': user?.role
                }
            };
            // Usamos /api/notifications/admin para listar el historial completo
            const response = await axios.get(`${BACKEND_URL}/api/notifications/admin`, config);
            setNotifications(response.data);
            setIsLoading(false);
        } catch (error) {
            handleAxiosError(error, "Error al cargar el historial de notificaciones.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Ejecutar fetchNotifications solo si el token y la data de usuario existen
        if (token && user) {
            fetchNotifications();
        } else {
            // Manejar caso donde el usuario no está autenticado o la data no está cargada
            setIsLoading(false);
            toast.warn("Token de autenticación o información de usuario no disponible.");
        }
    }, [token, user]); // Dependencias añadidas para re-fetch si cambian

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error("Por favor completa el Título y el Mensaje.");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-id': user?.uid,
                    'x-user-role': user?.role
                }
            };
            // Nota: El backend espera 'targetAudience' pero el form envía 'target'. 
            // Podríamos necesitar cambiar `target` en formData a `targetAudience` o mapearlo.
            // Para mantener la consistencia con el backend:
            const payload = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                targetAudience: formData.target // Mapeado a lo que el backend espera
            };

            await axios.post(`${BACKEND_URL}/api/notifications`, payload, config);
            toast.success("Notificación enviada exitosamente");
            setFormData({ title: '', message: '', type: 'info', target: 'all' });
            fetchNotifications();
        } catch (error) {
            handleAxiosError(error, "Error al enviar la notificación.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta notificación? Esta acción es irreversible.")) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-user-id': user?.uid,
                    'x-user-role': user?.role
                }
            };
            await axios.delete(`${BACKEND_URL}/api/notifications/${id}`, config);
            toast.success("Notificación eliminada");
            fetchNotifications();
        } catch (error) {
            handleAxiosError(error, "Error al eliminar la notificación.");
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
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4 lg:top-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MdAdd className="text-green-600" />
                                Nueva Notificación
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input 
                                        type="text" 
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-150"
                                        placeholder="Ej: Mantenimiento programado"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                    <textarea 
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none h-32 resize-none transition duration-150"
                                        placeholder="Escribe el contenido del anuncio..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select 
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer transition duration-150"
                                        >
                                            <option value="info">Información</option>
                                            <option value="success">Éxito</option>
                                            <option value="warning">Advertencia</option>
                                            <option value="urgent">Urgente</option>
                                            <option value="announcement">Anuncio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">Audiencia</label>
                                        <select 
                                            id="target"
                                            name="target"
                                            value={formData.target}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer transition duration-150"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="user">Usuarios</option>
                                            <option value="admin">Administradores</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
                                    disabled={isLoading}
                                >
                                    <MdSend /> {isLoading ? 'Enviando...' : 'Enviar Notificación'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Notificaciones */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">Historial de Notificaciones</h2>
                            </div>
                            
                            {isLoading ? (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className='mt-3'>Cargando historial...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                    <MdNotifications className="text-6xl mb-3 opacity-30" />
                                    <p className='text-lg'>No hay notificaciones registradas</p>
                                    <p className='text-sm mt-1'>Utiliza el formulario para enviar una nueva alerta.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notif) => (
                                        <motion.div 
                                            key={notif._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4 sm:p-6 hover:bg-green-50/50 transition-colors flex gap-4"
                                        >
                                            <div className="flex-shrink-0 mt-1 text-3xl">
                                                {getTypeIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate pr-2">{notif.title}</h3>
                                                    <div className="flex items-center flex-shrink-0 gap-3">
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {notif.createdAt && formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDelete(notif._id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                            title="Eliminar Notificación"
                                                        >
                                                            <MdDelete className='text-lg' />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3 break-words whitespace-pre-wrap">{notif.message}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`text-xs px-3 py-1 rounded-full uppercase font-medium tracking-wider 
                                                        ${notif.type === 'urgent' ? 'bg-red-100 text-red-700' : 
                                                        notif.type === 'warning' ? 'bg-amber-100 text-amber-700' : 
                                                        notif.type === 'success' ? 'bg-green-100 text-green-700' : 
                                                        'bg-gray-200 text-gray-700'}`}
                                                    >
                                                        {notif.type}
                                                    </span>
                                                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase font-medium tracking-wider">
                                                        {notif.targetAudience || notif.target || 'all'}
                                                    </span>
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