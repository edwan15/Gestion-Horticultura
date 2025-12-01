import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPerson, MdLogout, MdSettings, MdHelp, MdBusiness, MdNotifications, MdExpandMore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectName, SET_LOGIN, SET_USER } from "../../features/auth/authSlice/authSlice";
import { signOut } from 'firebase/auth';
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector(selectName);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await dispatch(SET_LOGIN(false));
            await dispatch(SET_USER({}));
            toast.success("Sesión cerrada exitosamente.");
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
            toast.error("Fallo al cerrar sesión.");
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                    {name ? name.charAt(0).toUpperCase() : <MdPerson />}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-700 leading-none">{name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.role || 'Invitado'}</p>
                </div>
                <MdExpandMore className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cuenta</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "usuario@horticultura.com"}</p>
                        </div>

                        <div className="p-2">
                            <button 
                                onClick={() => navigate('/profiles')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <MdPerson className="text-lg text-gray-400" />
                                <span>Mi Perfil</span>
                            </button>
                            
                            <button 
                                onClick={() => navigate('/company-settings')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <MdBusiness className="text-lg text-gray-400" />
                                <span>Mi Empresa</span>
                            </button>

                            {user?.role === 'admin' && (
                                <button 
                                    onClick={() => navigate('/notifications-manage')}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <MdNotifications className="text-lg text-gray-400" />
                                    <span>Gestionar Notificaciones</span>
                                </button>
                            )}
                            
                            <button 
                                onClick={() => navigate('/settings')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <MdSettings className="text-lg text-gray-400" />
                                <span>Configuración</span>
                            </button>
                            
                            <button 
                                onClick={() => navigate('/help-support')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <MdHelp className="text-lg text-gray-400" />
                                <span>Ayuda y Soporte</span>
                            </button>
                        </div>

                        <div className="p-2 border-t border-gray-100">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <MdLogout className="text-lg" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserMenu;
