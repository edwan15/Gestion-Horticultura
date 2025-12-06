import React from "react";
import { motion } from "framer-motion";
import { FiAlertCircle, FiCreditCard, FiX } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const TrialExpiredModal = ({ isOpen, onUpgrade, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 text-white">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <FiAlertCircle className="text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-center">Prueba Finalizada</h2>
                    <p className="text-sm text-center text-red-100 mt-1">
                        Tu período de prueba de 7 días ha expirado
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 text-center mb-6">
                        Para continuar disfrutando de todas las funcionalidades de HortiDash, 
                        selecciona un plan de suscripción.
                    </p>

                    {/* Beneficios */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                        <p className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                            <FaCrown className="text-emerald-600" />
                            Con tu suscripción obtienes:
                        </p>
                        <ul className="text-sm text-emerald-800 space-y-1 ml-6">
                            <li>✓ Acceso ilimitado a todas las funciones</li>
                            <li>✓ Soporte prioritario</li>
                            <li>✓ Actualizaciones automáticas</li>
                            <li>✓ Almacenamiento en la nube</li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onUpgrade}
                            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <FiCreditCard />
                            Ver Planes y Suscribirse
                        </button>

                        <button
                            onClick={onLogout}
                            className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <FiX />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TrialExpiredModal;
