import React from 'react';
import { FaLeaf, FaSprayCan, FaInfoCircle } from 'react-icons/fa';

// Componente placeholder oculto/comentado en el DashBoard
// Diseñado para futuras implementaciones de Resumen de Fitosanitarios
const InventorySummaryPhytosanitary = () => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hidden">
             <div className="flex items-center gap-2 mb-4">
                <FaSprayCan className="text-green-600 text-xl" />
                <h3 className="text-lg font-bold text-gray-800">Resumen de Inventario - Fitosanitarios</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Card 1: Total Stock */}
                 <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-700 font-medium">Stock Total</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">1,250 kg</p>
                 </div>

                 {/* Card 2: Valor Estimado */}
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">Valor Estimado</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">4.500 €</p>
                 </div>

                 {/* Card 3: Alertas */}
                 <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 font-medium">Alertas de Stock Bajo</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">3 Productos</p>
                 </div>
            </div>

            <div className="mt-6 flex items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                    <FaInfoCircle className="mx-auto text-gray-400 text-2xl mb-2" />
                    <p className="text-gray-500 font-medium">Gráficas de consumo mensual próximamente...</p>
                </div>
            </div>
        </div>
    );
};

export default InventorySummaryPhytosanitary;
