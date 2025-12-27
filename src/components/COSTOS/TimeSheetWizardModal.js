import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import TimeSheetWizard from './TimeSheetWizard';

/**
 * TimeSheetWizardModal - Wrapper modal profesional para TimeSheetWizard
 * 
 * Este componente envuelve el TimeSheetWizard en un modal responsive y empresarial
 * con animaciones suaves y diseño adaptativo.
 */
const TimeSheetWizardModal = ({ 
    isOpen, 
    onClose, 
    db, 
    userId, 
    availableLocals = [],
    setErrorMessage 
}) => {
    
    // Variantes de animación para el backdrop
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    // Variantes de animación para el modal
    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.9,
            y: 50
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    // Manejar cierre con ESC
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-gray-900/60 backdrop-blur-sm flex justify-center items-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    {/* Contenedor del Modal - CENTRADO Y ESTILO UNIFICADO */}
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-[98vw] h-[95vh] flex flex-col overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del Modal - Unificado con ParcelModal */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">⏱️</span>
                                Registro de Horas
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Contenido del Modal - TimeSheetWizard con scroll */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
                             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <TimeSheetWizard
                                    db={db}
                                    userId={userId}
                                    setErrorMessage={setErrorMessage}
                                    availableLocals={availableLocals}
                                />
                             </div>
                        </div>

                        {/* Footer (Barra de estado o acciones si fuera necesario, por ahora simple borde) */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                             <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition text-sm"
                            >
                                Cerrar
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TimeSheetWizardModal;
