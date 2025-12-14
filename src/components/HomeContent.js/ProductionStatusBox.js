import React from 'react';
import { FaSeedling, FaChevronRight } from 'react-icons/fa';

// Componente individual de Tarjeta de Cultivo
const WisecropCard = ({ item }) => {
    // Calcular porcentaje para el gráfico (simulado o real)
    // En este caso, simulamos un progreso basado en algún dato o aleatorio si no existe
    const progress = item.progress || Math.floor(Math.random() * 100); 
    const isConfiguring = true; // O lógica para determinar si está en configuración

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow duration-300">
            {/* 1. Gráfico Circular con Icono */}
            <div className="relative w-20 h-20 flex-shrink-0">
                {/* SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={progress > 50 ? "#10b981" : "#f59e0b"} // Green or Orange based on progress
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={226} // 2 * PI * 36
                        strokeDashoffset={226 - (226 * progress) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Icono Central */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {item.icon ? (
                         // Si es una URL de imagen
                        <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                    ) : (
                        // Fallback icon
                        <FaSeedling className="text-2xl text-green-600" />
                    )}
                </div>
            </div>

            {/* 2. Información Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-blue-900 truncate">
                        {item.name || "Sin Nombre"}
                    </h3>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-2">
                    <span className="font-bold text-gray-600 mr-1">· {item.area || 0}</span> ha
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                     {/* Contadores */}
                    <div className="flex items-center text-gray-500">
                        <FaSeedling className="mr-1 text-gray-400" />
                        <span className="font-bold">{item.cropsCount || 1}</span>
                    </div>

                    {/* Estado */}
                    {isConfiguring && (
                        <span className="text-orange-500 text-xs font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                            En configuración
                        </span>
                    )}
                    
                    {/* Variedades */}
                    <span className="text-gray-400 text-xs">
                        <strong className="text-gray-600">{item.varietiesCount || 0}</strong> Variedades
                    </span>
                </div>
            </div>

            {/* 3. Botón de Acción */}
            <button className="text-green-500 hover:text-green-600 transition-colors p-2">
                <FaChevronRight className="text-xl" />
            </button>
        </div>
    );
};

const ProductionStatusBox = ({ data = [] }) => {
    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg mb-6">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                     <h4 className="font-semibold text-gray-600 uppercase tracking-wider text-sm">
                        Estado de Producción
                    </h4>
                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                        Hoy
                    </span>
                </div>
                {/* Opciones adicionales si se requieren (filtros, menu) */}
            </div>

            {/* Content Body */}
            <div className="p-4 bg-gray-50/30">
                {data.length === 0 ? (
                     <div className="text-center py-6 text-gray-400 text-sm">
                        No hay cultivos configurados.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.map((item, index) => (
                            <WisecropCard key={item.id || index} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionStatusBox;
