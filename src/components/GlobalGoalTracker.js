import React from 'react';

// =======================================================================
// === 🎯 Componente: Rastreador de Meta Global
// =======================================================================

const GlobalGoalTracker = React.memo(({ globalTotal, goal }) => {
    const total = parseFloat(globalTotal) || 0;
    const target = parseFloat(goal) || 0;
    
    let progressPercentage = 0;
    if (target > 0) {
        progressPercentage = Math.min(100, (total / target) * 100);
    }
    
    let progressColor = 'bg-indigo-500'; 
    let textColor = 'text-indigo-700';
    let icon = '🚀'; 
    
    if (progressPercentage >= 100) {
        progressColor = 'bg-green-500';
        textColor = 'text-green-700';
        icon = '✅'; 
    } else if (progressPercentage >= 75) {
        progressColor = 'bg-teal-500';
        textColor = 'text-teal-700';
    } else if (progressPercentage < 50) {
        progressColor = 'bg-red-400';
        textColor = 'text-red-700';
    }

    const remaining = Math.max(0, target - total).toFixed(2);
    
    const formattedTotal = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedTarget = target.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="p-5 bg-white rounded-2xl shadow-xl border-t-4 border-indigo-500 transition-all duration-300 ease-in-out hover:shadow-2xl">
            
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className={`text-xl font-bold ${textColor} flex items-center`}>
                    {icon} <span className="ml-2">Estado de Producción</span>
                </h3>
                <div className="text-sm font-semibold text-gray-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Meta: <span className="font-bold text-indigo-700">{formattedTarget} Kg</span>
                </div>
            </div>

            {/* 📈 Barra de Progreso y Porcentaje */}
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progreso:</span>
                    <span className={`text-xl font-extrabold ${progressPercentage >= 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                        {progressPercentage.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                        className={`h-3 rounded-full ${progressColor} transition-all duration-1000 ease-out shadow-lg`} 
                        style={{ width: `${progressPercentage}%` }}
                        role="progressbar"
                        aria-valuenow={progressPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
            </div>

            {/* 📊 Métricas de Resultado (Diseño Responsive) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                
                {/* Columna 1: Total Producido */}
                <div className="bg-indigo-50/70 p-3 rounded-lg text-center shadow-sm">
                    <p className="text-xs uppercase font-medium text-indigo-600">Total Producido</p>
                    <p className={`text-xl font-bold ${textColor} mt-1`}>
                        {formattedTotal} <span className="text-sm font-normal text-gray-500">Kg</span>
                    </p>
                </div>
                
                {/* Columna 2: Faltante */}
                <div className="bg-red-50/70 p-3 rounded-lg text-center shadow-sm">
                    <p className="text-xs uppercase font-medium text-red-600">Falta para la Meta</p>
                    <p className="text-xl font-bold text-red-500 mt-1">
                        {remaining} <span className="text-sm font-normal text-gray-500">Kg</span>
                    </p>
                </div>

                {/* Columna 3: Objetivo (visible en tablet/desktop) */}
                <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm col-span-2 sm:col-span-1">
                    <p className="text-xs uppercase font-medium text-gray-600">Meta Objetivo</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                        {formattedTarget} <span className="text-sm font-normal text-gray-500">Kg</span>
                    </p>
                </div>
            </div>
        </div>
    );
});

export default GlobalGoalTracker;