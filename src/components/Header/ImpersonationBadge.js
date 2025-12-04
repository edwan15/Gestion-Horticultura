import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExchangeAlt, FaTimes, FaUserShield } from 'react-icons/fa';
import { selectUser } from '../../features/auth/authSlice/authSlice';
import { SET_IMPERSONATION } from '../../features/auth/authSlice/authSlice';
import useAdminUsers from '../../hooks/useAdminUsers';

/**
 * ImpersonationBadge - Badge flotante que indica cuando el admin está viendo como otro usuario
 * Permite volver rápidamente a la cuenta de administrador
 */
const ImpersonationBadge = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectUser);
    const { users } = useAdminUsers();

    // Verificar si estamos en modo impersonación
    const impersonationState = JSON.parse(localStorage.getItem('impersonation_state') || '{}');
    const isImpersonating = impersonationState.isImpersonating || false;
    const targetUserId = impersonationState.targetUserId || null;

    if (!isImpersonating || !targetUserId) {
        return null;
    }

    // Encontrar el usuario que estamos suplantando
    const impersonatedUser = users.find(u => u.uid === targetUserId);

    const handleStopImpersonation = () => {
        dispatch(SET_IMPERSONATION({ 
            isImpersonating: false,
            targetUserId: null,
            adminToken: null 
        }));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-20 right-4 z-50"
            >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-orange-400 max-w-sm">
                    <div className="flex items-start gap-3">
                        {/* Icono */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FaExchangeAlt className="text-xl animate-pulse" />
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <FaUserShield className="text-sm" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Modo Admin</span>
                            </div>
                            <p className="text-sm font-bold truncate">
                                Viendo como: {impersonatedUser?.farmName || 'Usuario'}
                            </p>
                            <p className="text-xs opacity-90 truncate">
                                {impersonatedUser?.email || targetUserId}
                            </p>
                        </div>

                        {/* Botón de cierre */}
                        <button
                            onClick={handleStopImpersonation}
                            className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors group"
                            title="Volver a mi cuenta"
                        >
                            <FaTimes className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Botón de acción */}
                    <button
                        onClick={handleStopImpersonation}
                        className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FaTimes className="text-xs" />
                        Volver a mi cuenta de Admin
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImpersonationBadge;
