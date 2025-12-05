

// 🚨 CORRECCIÓN CLAVE: Se establece dailyData = {} como valor por defecto
// src/components/DayProductsGrid.js
import React from 'react';
import ProductCard from './ProductCard'; 
import { FaChevronLeft, FaEdit, FaFilePdf, FaCalculator } from 'react-icons/fa';

const DayProductsGrid = ({
    dateKey, 
    dailyData = {}, 
    handleDayClick, 
    generatePDF, 
    exportToCsv,
    formatNumber,
    REPORT_CONFIG 
}) => {
    
    const dayData = dailyData[dateKey] ?? {};
    const productionItems = dayData.items || [];
    const costDetails = dayData.costData ?? {}; 
    
    const finalProductionCost = parseFloat(dayData.finalProductionCost) || 0;
    const productionCostVariable = parseFloat(dayData.productionCostVariable) || 0;
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
        <div id={`day-report-${dateKey}`} className="max-w-7xl mx-auto space-y-6">
            
            {/* Header de Navegación */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-100">
                <div>
                   <button 
                        onClick={() => handleDayClick(null, "calendar")} 
                        className="group flex items-center text-slate-500 hover:text-emerald-600 transition-colors font-semibold mb-2"
                    >
                        <FaChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Volver al Calendario
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
                        {dateDisplay}
                    </h2>
                    <p className="text-slate-500 font-medium">Detalle de Producción y Costes</p>
                </div>
                
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 text-right">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Producido</p>
                        <p className="text-3xl font-black text-emerald-700 leading-none">
                            {formatNumber(dailyTotal)} <span className="text-lg text-emerald-500 font-bold">Kg</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Central: Lista de Productos (2/3 ancho) */}
                <div className="lg:col-span-2 space-y-6">
                     {productionItems.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 border-dashed text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">Sin producción registrada</h3>
                             <p className="text-slate-500 mb-6">No hay registros de cosecha para este día.</p>
                             <button 
                                onClick={() => handleDayClick(dateKey, "edit_products")} 
                                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-all"
                            >
                                Registrar Producción
                             </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {productionItems.map((item, index) => (
                                <ProductCard key={index} item={item} />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Panel Lateral: Costes y Acciones (1/3 ancho) */}
                <div className="space-y-6">
                     {/* Tarjeta de Costes */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                 <FaCalculator />
                             </div>
                             <h3 className="text-lg font-bold text-slate-800">Métricas Financieras</h3>
                         </div>
                         
                         <div className="space-y-4">
                             <div>
                                 <p className="text-sm text-slate-500 font-medium">Coste Final</p>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-800">{formatNumber(finalProductionCost, 4)}</span>
                                    <span className="text-base font-bold text-slate-400">€/Kg</span>
                                 </div>
                             </div>
                             
                             <div className="h-px bg-slate-100 w-full"></div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <p className="text-xs font-bold text-slate-400 uppercase">Personal</p>
                                     <p className="text-lg font-bold text-slate-700">{numWorkers}</p>
                                 </div>
                                  <div>
                                     <p className="text-xs font-bold text-slate-400 uppercase">Horas</p>
                                     <p className="text-lg font-bold text-slate-700">{hoursWorked}</p>
                                 </div>
                             </div>
                              <div>
                                 <p className="text-xs font-bold text-slate-400 uppercase">Coste Laboral Total</p>
                                 <p className="text-lg font-bold text-red-600">{formatNumber(productionCostVariable)} €</p>
                             </div>
                         </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-3">
                         <button 
                            onClick={() => handleDayClick(dateKey, "edit_products")} 
                            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm"
                        >
                            <FaEdit className="mr-2" /> Editar Productos
                        </button>
                        
                         <button 
                            onClick={() => handleDayClick(dateKey, "edit_costs")} 
                            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm"
                        >
                            <FaCalculator className="mr-2" /> Editar Costes
                        </button>
                        
                         <button
                            onClick={() => generatePDF(dateKey)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-50 border border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-100 hover:shadow-md transition-all"
                        >
                            <FaFilePdf className="mr-2" /> Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayProductsGrid;


