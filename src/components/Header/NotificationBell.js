import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNotifications, MdNotificationsNone, MdInfo, MdWarning, MdCheckCircle, MdAnnouncement, MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, selectNotifications, selectUnreadCount } from '../../features/notifications/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const unreadCount = useSelector(selectUnreadCount);

    useEffect(() => {
        // Cargar notificaciones al montar
        dispatch(fetchNotifications());
        
        // Polling cada 60 segundos
        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 60000);

        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = (id, e) => {
        e.stopPropagation();
        dispatch(markAsRead(id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <MdWarning className="text-amber-500" />;
            case 'success': return <MdCheckCircle className="text-green-500" />;
            case 'urgent': return <MdWarning className="text-red-500" />;
            case 'announcement': return <MdAnnouncement className="text-blue-500" />;
            default: return <MdInfo className="text-gray-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'warning': return 'bg-amber-50';
            case 'success': return 'bg-green-50';
            case 'urgent': return 'bg-red-50';
            case 'announcement': return 'bg-blue-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors duration-200 relative ${isOpen ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                {unreadCount > 0 ? <MdNotifications className="text-2xl" /> : <MdNotificationsNone className="text-2xl" />}
                
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-gray-800">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                    <MdNotificationsNone className="text-4xl mb-2 text-gray-300" />
                                    <p>No tienes notificaciones</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification._id} 
                                            className={`p-4 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 p-2 rounded-full h-fit ${getBgColor(notification.type)}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <button 
                                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Marcar como leída"
                                                            >
                                                                Marcar leída
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                                                    </span>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-xs text-gray-500 hover:text-green-600 font-medium transition-colors">
                                Ver historial completo
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
