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
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Backdrop con blur */}
                    <motion.div
                        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Contenedor del Modal - Fullscreen en tablet/desktop, responsive en móvil */}
                    <motion.div
                        className="relative w-full h-full md:w-full md:h-full bg-gradient-to-br from-gray-50 to-white md:rounded-none rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del Modal - Más grande en pantallas grandes */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 md:px-8 py-4 md:py-6 flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3 md:space-x-4">
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-2xl md:text-4xl">⏱️</span>
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                        Registro de Horas
                                    </h2>
                                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-red-100">
                                        Gestión de tiempo y actividades
                                    </p>
                                </div>
                            </div>

                            {/* Botón de cierre - Más grande en pantallas grandes */}
                            <button
                                onClick={onClose}
                                className="group w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                                aria-label="Cerrar modal"
                            >
                                <FaTimes className="text-white text-xl md:text-2xl lg:text-3xl group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Contenido del Modal - TimeSheetWizard con scroll */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12">
                            <TimeSheetWizard
                                db={db}
                                userId={userId}
                                setErrorMessage={setErrorMessage}
                                availableLocals={availableLocals}
                            />
                        </div>

                        {/* Decoración inferior */}
                        <div className="h-1 md:h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TimeSheetWizardModal;
