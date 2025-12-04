import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaSearch, FaExchangeAlt, FaLeaf, FaChevronDown, FaTimes } from 'react-icons/fa';
import { selectRole, selectUserId, selectUser } from '../../features/auth/authSlice/authSlice';
import { SET_IMPERSONATION } from '../../features/auth/authSlice/authSlice';
import useAdminUsers from '../../hooks/useAdminUsers';

/**
 * AdminUserSelector - Selector moderno estilo Wisecrop para suplantación de usuarios
 * Solo visible para administradores
 */
const AdminUserSelector = () => {
    // --- 1. DECLARACIÓN DE HOOKS (DEBEN IR AL PRINCIPIO) ---
    const dispatch = useDispatch();
    const role = useSelector(selectRole);
    const currentUserId = useSelector(selectUserId);
    const currentUser = useSelector(selectUser);
    
    // Custom Hook
    const { users, loading, error } = useAdminUsers();
    
    // State Hooks
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const dropdownRef = useRef(null);

    // useEffect para cerrar dropdown al hacer click fuera
    // NOTA: Este era el useEffect de la línea 35
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // useEffect para encontrar usuario actualmente suplantado
    // NOTA: Este era el useEffect de la línea 79
    useEffect(() => {
        // Solo ejecutar si hay usuarios cargados para evitar búsquedas innecesarias
        if (users.length === 0) return; 

        if (currentUserId !== currentUser.uid) {
            // Buscamos el usuario suplantado en la lista de usuarios.
            const impersonatedUser = users.find(u => u.uid === currentUserId);
            setSelectedUser(impersonatedUser || null);
        } else {
            // Estamos en la cuenta original.
            setSelectedUser(null);
        }
    }, [currentUserId, currentUser.uid, users]);
    
    // --- 2. LÓGICA CONDICIONAL Y SALIDA ANTICIPADA (AHORA SEGURO) ---
    // Solo mostrar si es admin o superuser
    if (role !== 'admin' && role !== 'superuser') {
        return null;
    }

    // --- 3. RESTO DE LA LÓGICA Y RENDERIZADO ---

    // Filtrar usuarios según búsqueda
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.farmName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar selección de usuario
    const handleSelectUser = (user) => {
        if (user.uid === currentUser.uid) {
            // Volver a mi cuenta
            dispatch(SET_IMPERSONATION({ 
                isImpersonating: false,
                targetUserId: null,
                adminToken: null 
            }));
            setSelectedUser(null);
        } else {
            // Suplantar usuario
            dispatch(SET_IMPERSONATION({ 
                isImpersonating: true,
                targetUserId: user.uid,
                adminToken: currentUser.uid // Guardar el ID del admin
            }));
            setSelectedUser(user);
        }
        setIsOpen(false);
        setSearchTerm('');
    };

    const displayName = selectedUser ? selectedUser.farmName : 'Mi Cuenta';
    const displaySubtext = selectedUser ? selectedUser.email : currentUser.email;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón Principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedUser 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
                } hover:scale-105`}
            >
                <div className="flex items-center gap-2">
                    {selectedUser ? (
                        <FaExchangeAlt className="text-base sm:text-lg" />
                    ) : (
                        <FaLeaf className="text-base sm:text-lg" />
                    )}
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-xs font-semibold leading-tight">{displayName}</span>
                        <span className="text-[10px] opacity-90 leading-tight">{displaySubtext}</span>
                    </div>
                </div>
                <FaChevronDown className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                        {/* Header del Dropdown */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-xl" />
                                    <h3 className="font-bold text-lg">Cambiar Vista</h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1 rounded transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <p className="text-xs text-green-100">Modo Administrador - {users.length} usuarios</p>
                        </div>

                        {/* Barra de Búsqueda */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o finca..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Lista de Usuarios */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                                    <p className="mt-2 text-sm">Cargando usuarios...</p>
                                </div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-500">
                                    <p className="text-sm">Error al cargar usuarios</p>
                                    <p className="text-xs mt-1">{error}</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <FaSearch className="mx-auto text-3xl mb-2 opacity-50" />
                                    <p className="text-sm">No se encontraron usuarios</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mi Cuenta */}
                                    <button
                                        onClick={() => handleSelectUser({ uid: currentUser.uid })}
                                        className={`w-full p-4 flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 ${
                                            !selectedUser ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {currentUser.name?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="font-semibold text-gray-800 truncate">Mi Cuenta (Admin)</div>
                                            <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                                        </div>
                                        {!selectedUser && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </button>

                                    {/* Separador */}
                                    <div className="px-4 py-2 bg-gray-50 border-y border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Usuarios Disponibles</p>
                                    </div>

                                    {/* Lista de Usuarios */}
                                    {filteredUsers.map((user) => {
                                        if (user.uid === currentUser.uid) return null; // No mostrar el admin en la lista
                                        
                                        const isSelected = selectedUser?.uid === user.uid;
                                        
                                        return (
                                            <button
                                                key={user.uid}
                                                onClick={() => handleSelectUser(user)}
                                                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                                                    isSelected ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                                                }`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <div className="font-semibold text-gray-800 truncate">{user.farmName}</div>
                                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full">{user.role}</span>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-[10px] text-gray-500 text-center">
                                Los cambios se aplican inmediatamente a toda la aplicación
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUserSelector;