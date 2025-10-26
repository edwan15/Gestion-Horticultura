

import React from 'react';
import ProductCard from './ProductCard'; 
// Asume que ProductCard y el archivo de utilidades existen.
// import { formatDate } from '../Util/util'; 

// 🚨 CORRECCIÓN CLAVE: Se establece dailyData = {} como valor por defecto
const DayProductsGrid = ({
    dateKey, 
    dailyData = {}, // <--- SOLUCIÓN AL "Uncaught TypeError: Cannot read properties of undefined"
    handleDayClick, 
    generatePDF, 
    exportToCsv, // Aunque no se usa, lo mantengo en la desestructuración
    formatNumber,
    REPORT_CONFIG // Si usas esto para el PDF, asegúrate de pasarlo
}) => {
    
    // Acceso seguro: si dailyData es {}, esto devuelve un objeto vacío {}
    const dayData = dailyData[dateKey] ?? {};
    
    const productionItems = dayData.items || [];
    // Aseguramos que costData exista o sea un objeto vacío
    const costDetails = dayData.costData ?? {}; 
    
    const finalProductionCost = parseFloat(dayData.finalProductionCost) || 0;
    const productionCostVariable = parseFloat(dayData.productionCostVariable) || 0;
    
    // Acceso seguro a los detalles de coste
    const numWorkers = parseFloat(costDetails.numWorkers) || 0;
    const hoursWorked = parseFloat(costDetails.hoursWorked) || 0;
    
    const hasCostData = numWorkers > 0 || hoursWorked > 0 || productionCostVariable > 0;
    
    const dailyTotal = productionItems.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
    
    const dateDisplay = new Date(dateKey + "T00:00:00").toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div id={`day-report-${dateKey}`} className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-2xl">
            
            {/* Botón Volver al Calendario */}
            <button 
                onClick={() => handleDayClick(null, "calendar")} 
                className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition font-semibold"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver al Calendario
            </button>
            
            {/* Encabezado y Total */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Detalle de Producción
                    </h2>
                    <p className="text-xl text-indigo-600 font-semibold">{dateDisplay}</p>
                </div>
                <div className="text-right p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Total Producido:</p>
                    <p className="text-3xl font-extrabold text-green-700">
                        {formatNumber(dailyTotal)} Kg
                    </p>
                </div>
            </div>
            
            {/* Tarjeta de Coste por Kg */}
            <div className="mb-6 p-4 bg-teal-100 rounded-xl border border-teal-300 shadow-inner">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-teal-800">
                        Coste/Kg de Producción:
                    </h3>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-4xl font-extrabold text-blue-700">
                            {formatNumber(finalProductionCost, 4)}
                        </p>
                        <span className="text-lg font-semibold text-blue-600">€/Kg</span>
                    </div>
                </div>
                {hasCostData && (
                    <div className="mt-2 text-sm text-teal-700 border-t border-teal-300 pt-2">
                        <p>
                            Trabajadores: <span className="font-bold">{numWorkers}</span>,
                            Horas: <span className="font-bold">{hoursWorked}</span>
                        </p>
                        <p>
                            Coste Laboral Diario:{" "}
                            <span className="font-bold">
                                {formatNumber(productionCostVariable)} €
                            </span>
                        </p>
                    </div>
                )}
            </div>
            
            {/* Listado de Productos */}
            {productionItems.length === 0 ? (
                <p className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    No hay productos guardados para este día.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productionItems.map((item, index) => (
                        <ProductCard key={index} item={item} />
                    ))}
                </div>
            )}
            
            {/* Botones de Acción (Editar, Exportar) */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:space-x-4">
                
                {/* Botón Editar Productos */}
                <button 
                    // 🟢 CORRECCIÓN DE VISTA: Usar "edit_products"
                    onClick={() => handleDayClick(dateKey, "edit_products")} 
                    className="flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.05]"
                >
                    <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    <span className="items-center">Editar Productos</span>
                </button>
                
                {/* Botón Editar Costes */}
                <button 
                    // 🟢 CORRECCIÓN DE VISTA: Usar "edit_costs"
                    onClick={() => handleDayClick(dateKey, "edit_costs")} 
                    className="flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition transform hover:scale-[1.05]"
                >
                    <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 4v3m0-13v3"></path>
                    </svg>
                    <span className="items-center">Editar Costes</span>
                </button>

                {/* Botón Exportar PDF */}
                <button
                    onClick={() => generatePDF(dateKey)}
                    className=" flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-[1.05]"
                >
                    <svg
                        className="w-5 h-5 sm:mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l3-3m-3 3l-3-3m-3 8h12a2 2 0 002-2V7a2 2 0 00-2-2h-3.328A3 3 0 0012 3m0 18H5a2 2 0 01-2-2v-7a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                    <span className="items-center">Exportar PDF</span>
                </button>
                
            </div>
        </div>
    );
};

export default DayProductsGrid;


