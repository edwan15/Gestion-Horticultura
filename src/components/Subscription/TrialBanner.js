import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiZap } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const TrialBanner = ({ daysRemaining, onUpgrade }) => {
    // Solo mostrar si quedan 3 días o menos
    if (!daysRemaining || daysRemaining > 3) return null;

    const isUrgent = daysRemaining <= 1;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className={`fixed top-0 left-0 right-0 z-[9998] ${
                    isUrgent 
                        ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                        : 'bg-gradient-to-r from-amber-600 to-yellow-600'
                } text-white shadow-lg`}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Mensaje */}
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-700' : 'bg-amber-700'} animate-pulse`}>
                                <FiClock className="text-xl" />
                            </div>
                            <div>
                                <p className="font-bold text-sm sm:text-base">
                                    {isUrgent 
                                        ? `¡Último día de prueba gratis!` 
                                        : `Te quedan ${daysRemaining} días de prueba gratis`
                                    }
                                </p>
                                <p className="text-xs opacity-90">
                                    Suscríbete ahora para continuar disfrutando de todas las funciones
                                </p>
                            </div>
                        </div>

                        {/* Botón CTA */}
                        <button
                            onClick={onUpgrade}
                            className="px-6 py-2 bg-white text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group whitespace-nowrap"
                        >
                            <FaCrown className="text-yellow-600 group-hover:animate-bounce" />
                            <span>Ver Planes</span>
                            <FiZap className="text-yellow-600" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TrialBanner;
