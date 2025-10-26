import React from 'react';
import { MdOutlineGrass, MdStorage } from 'react-icons/md';
import { FaSeedling } from 'react-icons/fa';

// Función de utilidad para formatear (asegúrate de que esté disponible o pásala como prop)
const formatNumber = (num, decimales = 2) => {
    if (num === null || num === undefined || isNaN(num)) return "0.00";
    return Number(num).toLocaleString("es-ES", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    });
};

const GreenhouseSummaryCard = ({ greenhouseList, dailyTotalSum, loading }) => {
    const totalGreenhouses = greenhouseList.length;
    const totalArea = greenhouseList.reduce((sum, g) => sum + (parseFloat(g.area) || 0), 0);
    const hasData = totalGreenhouses > 0;

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 animate-pulse">
                <p className="font-semibold text-gray-500">Cargando datos de invernaderos...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-2xl transition duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                    <MdStorage className="w-6 h-6 mr-2 text-indigo-500" />
                    Resumen de Invernaderos
                </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
                {/* CARD 1: Cantidad de Invernaderos */}
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <FaSeedling className="w-6 h-6 mx-auto text-indigo-600 mb-1" />
                    <p className="text-sm text-gray-500 font-medium">Invernaderos</p>
                    <p className="text-2xl font-extrabold text-indigo-800">{totalGreenhouses}</p>
                </div>
                
                {/* CARD 2: Área Total */}
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <MdOutlineGrass className="w-6 h-6 mx-auto text-green-600 mb-1" />
                    <p className="text-sm text-gray-500 font-medium">Área Total</p>
                    <p className="text-2xl font-extrabold text-green-800">
                        {formatNumber(totalArea)} <span className="text-base font-normal">ha</span>
                    </p>
                </div>
                
                {/* CARD 3: Producción Total (Acumulada) */}
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <FaSeedling className="w-6 h-6 mx-auto text-orange-600 mb-1" />
                    <p className="text-sm text-gray-500 font-medium">Prod. Acumulada</p>
                    <p className="text-2xl font-extrabold text-orange-800">
                        {formatNumber(dailyTotalSum)} <span className="text-base font-normal">Kg</span>
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Lista de Invernaderos:</h4>
                <div className="max-h-24 overflow-y-auto space-y-1 text-sm text-gray-600">
                    {hasData ? (
                        greenhouseList.map((g) => (
                            <p key={g.id} className="flex justify-between">
                                <span className="truncate">{g.name}</span>
                                <span className="font-mono text-gray-500 text-xs ml-2">{formatNumber(g.area, 1)} ha</span>
                            </p>
                        ))
                    ) : (
                        <p className="text-center italic text-gray-400">Aún no hay invernaderos creados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GreenhouseSummaryCard;