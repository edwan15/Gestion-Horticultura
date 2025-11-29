import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdApps, MdLocalFlorist, MdInventory, MdPeople, MdSettings, MdBarChart, MdCloud } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const apps = [
    { name: 'Producción', icon: <MdLocalFlorist className="text-green-600" />, path: '/produccionC', desc: 'Gestión de cultivos' },
    { name: 'Inventario', icon: <MdInventory className="text-blue-600" />, path: '/panel', desc: 'Control de stock' },
    { name: 'Personal', icon: <MdPeople className="text-orange-600" />, path: '/user-management', desc: 'RRHH y Usuarios' },
    { name: 'Finanzas', icon: <MdBarChart className="text-purple-600" />, path: '/finanzas', desc: 'Costes y beneficios' }, // Placeholder path
    { name: 'Clima', icon: <MdCloud className="text-sky-500" />, path: '/clima', desc: 'Monitorización' }, // Placeholder path
    { name: 'Configuración', icon: <MdSettings className="text-gray-600" />, path: '/settings', desc: 'Ajustes del sistema' },
];

const EnterpriseMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors duration-200 ${isOpen ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Aplicaciones"
            >
                <MdApps className="text-2xl" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">Aplicaciones Empresariales</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-3">
                            {apps.map((app, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigate(app.path)}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 group text-center"
                                >
                                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-2 text-2xl">
                                        {app.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{app.name}</span>
                                    <span className="text-xs text-gray-500 mt-1">{app.desc}</span>
                                </button>
                            ))}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-xs text-green-600 font-medium hover:underline">
                                Ver todas las aplicaciones
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnterpriseMenu;
