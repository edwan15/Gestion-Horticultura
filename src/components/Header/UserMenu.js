import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPerson, MdLogout, MdSettings, MdHelp, MdBusiness } from 'react-icons/md';
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = async () => {
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
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
            >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {name ? name.charAt(0).toUpperCase() : <MdPerson />}
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700 leading-tight">{name || "Usuario"}</span>
                    <span className="text-xs text-gray-500 leading-tight">Horticultura SL</span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 bg-green-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {name ? name.charAt(0).toUpperCase() : <MdPerson />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{name || "Usuario"}</p>
                                    <p className="text-xs text-gray-500">admin@horticultura.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <MdBusiness className="text-lg text-gray-400" />
                                <span>Mi Empresa</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <MdSettings className="text-lg text-gray-400" />
                                <span>Configuración</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <MdHelp className="text-lg text-gray-400" />
                                <span>Ayuda y Soporte</span>
                            </button>
                        </div>

                        <div className="p-2 border-t border-gray-100">
                            <button
                                onClick={logout}
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
