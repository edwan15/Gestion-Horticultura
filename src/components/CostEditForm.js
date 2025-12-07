// src/components/CostEditForm.js

import React, { useState } from 'react';
// Importa motion si tienes framer-motion instalado
// import { motion } from 'framer-motion';

















const CostEditForm = ({
    dateKey,
    dailyData,
    handleDayClick,
    handleSave,
    formatNumber,
    HOURLY_COST_RATE = 10, // Default to 10 if not provided
}) => {
    // --- Variants ---
    const MotionDiv = window.motion?.div || "div";

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
    };

    // --- State Initialization ---
    const existingDayData = dailyData[dateKey] || {};
    const existingCostData = existingDayData.costData || {};
    const dailyTotalProduction = parseFloat(existingDayData.dailyTotal || 0);

    // Initial State: items array
    // If we have details, use them. If not, check for legacy fields. If neither, default standard.
    const getInitialItems = () => {
        if (existingCostData.details && Array.isArray(existingCostData.details) && existingCostData.details.length > 0) {
            return existingCostData.details;
        }
        
        // Legacy fallback
        const legacyWorkers = existingCostData.numWorkers;
        const legacyHours = existingCostData.hoursWorked;
        
        if (legacyWorkers || legacyHours) {
            return [{
                id: Date.now().toString(),
                type: 'standard',
                workers: legacyWorkers?.toString() || '',
                hours: legacyHours?.toString() || '',
            }];
        }

        // Default empty standard
        return [{
            id: Date.now().toString(),
            type: 'standard',
            workers: '',
            hours: '',
        }];
    };

    const [items, setItems] = useState(getInitialItems());
    
    // UI State for adding new items
    const [newItemType, setNewItemType] = useState('extra_labor'); // 'extra_labor' | 'machinery'
    const [isSaving, setIsSaving] = useState(false);

    // --- Handlers ---

    const handleAddItem = () => {
        const newItem = {
            id: Date.now().toString() + Math.random().toString().slice(2, 5),
            type: newItemType,
            workers: '',
            hours: '',
            machineryName: '', // Only for machinery
            machineryCost: '', // Only for machinery
        };
        setItems([...items, newItem]);
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        // Basic validation for numbers if needed, but we allow typing strings for better UX
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    // --- Calculation Logic ---

    const calculateAdvancedCosts = () => {
        let totalLaborCost = 0;
        let totalMachineryCost = 0;

        items.forEach(item => {
            const workers = parseFloat(item.workers) || 0;
            const hours = parseFloat(item.hours) || 0;
            
            // Labor cost calculation (Standard & Extra & Machinery Operators)
            // Even for machinery, 'workers' (operators) * 'hours' is labor cost
            const laborCost = workers * hours * HOURLY_COST_RATE;
            totalLaborCost += laborCost;

            if (item.type === 'machinery') {
                const machineFixed = parseFloat(item.machineryCost) || 0;
                totalMachineryCost += machineFixed;
            }
        });

        const productionCostVariable = totalLaborCost + totalMachineryCost;
        
        let finalProductionCost = 0;
        if (dailyTotalProduction > 0) {
            finalProductionCost = productionCostVariable / dailyTotalProduction;
        }

        return {
            totalLaborCost,
            totalMachineryCost,
            productionCostVariable,
            finalProductionCost
        };
    };

    const { 
        totalLaborCost, 
        totalMachineryCost, 
        productionCostVariable, 
        finalProductionCost 
    } = calculateAdvancedCosts();


    const handleSaveLocal = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Prepare data structure
        // We keep legacy fields populated with the FIRST standard item found (or totals) for basic backward compat
        const standardItem = items.find(i => i.type === 'standard') || items[0];
        
        const dataToSave = {
            // Legacy / Summary fields
            numWorkers: parseFloat(standardItem?.workers) || 0, 
            hoursWorked: parseFloat(standardItem?.hours) || 0,
            
            // New Detailed Data
            details: items,
            
            // Saved Calculated Totals (Optional, but good for quick reads)
            totalLaborCost,
            totalMachineryCost,
            productionCostVariable,
            finalProductionCost
        };

        await handleSave(dateKey, null, dataToSave);
        setIsSaving(false);
    };

    // --- Render Helpers ---

    const renderItemRow = (item, index) => {
        const isStandard = item.type === 'standard';
        
        return (
            <div key={item.id} className={`p-4 rounded-xl border-2 ${isStandard ? 'bg-white border-teal-100' : 'bg-slate-50 border-slate-200'} mb-3 relative`}>
                
                {/* Header / Title of Row */}
                <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isStandard ? 'text-teal-600' : 'text-slate-500'}`}>
                        {item.type === 'standard' ? '👥 Cuadrilla Principal' : 
                         item.type === 'extra_labor' ? '👷‍♂️ Trabajadores Extra' : 
                         '🚜 Maquinaria & Operador'}
                    </span>
                    {!isStandard && (
                        <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-400 hover:text-red-600 transition p-1"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Machinery Specific Field */}
                    {item.type === 'machinery' && (
                        <div className="col-span-2 grid grid-cols-2 gap-3 mb-2">
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo Maquinaria</label>
                                <select
                                    value={item.machineryName}
                                    onChange={(e) => handleItemChange(item.id, 'machineryName', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="tractor">🚜 Tractor</option>
                                    <option value="montacarga">🏗️ Montacarga</option>
                                    <option value="camion">🚛 Camión</option>
                                    <option value="fumigadora">💨 Fumigadora</option>
                                    <option value="otro">⚙️ Otro</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Coste Máquina (€)</label>
                                <input
                                    type="number"
                                    value={item.machineryCost}
                                    onChange={(e) => handleItemChange(item.id, 'machineryCost', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                />
                             </div>
                             <div className="col-span-2 border-b border-dashed border-gray-300 my-1"></div>
                        </div>
                    )}

                    {/* Common Labor Fields */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            {item.type === 'machinery' ? '👨‍🔧 N. Operadores' : '👨‍🌾 N. Trabajadores'}
                        </label>
                        <input
                            type="number"
                            value={item.workers}
                            onChange={(e) => handleItemChange(item.id, 'workers', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-teal-500"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                             ⏱ Horas (c/u)
                        </label>
                        <input
                            type="number"
                            value={item.hours}
                            onChange={(e) => handleItemChange(item.id, 'hours', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-teal-500"
                            placeholder="0.0"
                            step="0.5"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MotionDiv
            className="p-6 bg-white rounded-2xl shadow-2xl border-t-4 border-teal-600 max-w-lg mx-auto space-y-6 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Botón Volver */}
            <button
                onClick={() => handleDayClick(dateKey, "day_view")}
                className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver a la vista del día
            </button>

            <h3 className="text-2xl font-extrabold text-teal-800 border-b-2 border-teal-100 pb-3 flex items-center">
                <span className="bg-teal-100 text-teal-700 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </span>
                Costes: {dateKey}
            </h3>

            {/* Total del Día */}
            <MotionDiv
                className="p-4 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 flex justify-between items-center"
                variants={itemVariants}
            >   
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Producción Total</span>
                    <span className="text-2xl font-black text-indigo-900">{formatNumber(dailyTotalProduction)} Kg</span>
                </div>
                <div className="h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700">
                    ⚖️
                </div>
            </MotionDiv>

            <form onSubmit={handleSaveLocal} className="space-y-4">
                
                {/* DYNAMIC COST ITEMS LIST */}
                <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {items.map((item, index) => renderItemRow(item, index))}
                </div>

                {/* ADD NEW ITEM SECTION */}
                <div className="flex gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <select
                        value={newItemType}
                        onChange={(e) => setNewItemType(e.target.value)}
                        className="flex-grow p-2 text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="extra_labor">👷‍♂️ Trabajadores Extra</option>
                        <option value="machinery">🚜 Maquinaria</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md shadow-sm transition flex items-center justify-center w-12"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>


                {/* SUMMARY CARD */}
                <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-xl space-y-4">
                    
                    <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium uppercase">Coste Fijo / Hora</span>
                            <span className="text-lg font-bold text-slate-200">{formatNumber(HOURLY_COST_RATE)} €</span>
                        </div>
                        <div className="text-right">
                             <span className="text-xs text-slate-400 font-medium uppercase block">Total Variables</span>
                             <span className="text-2xl font-black text-white">{formatNumber(productionCostVariable)} €</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-700/50 p-2 rounded-lg">
                            <span className="block text-slate-400 text-xs">Mano de Obra</span>
                            <span className="font-bold text-teal-400">{formatNumber(totalLaborCost)} €</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded-lg">
                            <span className="block text-slate-400 text-xs">Maquinaria</span>
                            <span className="font-bold text-orange-400">{formatNumber(totalMachineryCost)} €</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-300">Coste Prod. Final</span>
                            <span className="text-xs text-slate-500">(Var / Kg Total)</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex justify-between items-center">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                {formatNumber(finalProductionCost, 4)} 
                            </span>
                            <span className="text-sm text-slate-500 font-medium">€/Kg</span>
                        </div>
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <MotionDiv
                    className="pt-2"
                    variants={itemVariants}
                >
                    <button
                        type="submit" // Triggers form submit -> handleSaveLocal
                        disabled={isSaving}
                        className="w-full py-3.5 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 disabled:bg-teal-400 disabled:transform-none flex items-center justify-center text-lg"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                </svg>
                                Guardar Costes
                            </>
                        )}
                    </button>
                </MotionDiv>
            </form>
        </MotionDiv>
    );
};


export default CostEditForm;
