import React from 'react';
import { FaChartLine, FaEuroSign, FaClock } from 'react-icons/fa';

const CostesSummary = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-emerald-600" />
                Resumen de Costes
            </h2>
            
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaEuroSign className="text-2xl" />
                </div>
                <p className="text-center font-medium">
                    Panel de Resumen en construcción
                </p>
                <p className="text-sm text-center max-w-xs">
                    Aquí se mostrarán gráficas y métricas detalladas de los costes por cultivo y operación.
                </p>
            </div>

            {/* Placeholder Loading State */}
            <div className="space-y-3 mt-8">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            </div>
        </div>
    );
};

export default CostesSummary;
