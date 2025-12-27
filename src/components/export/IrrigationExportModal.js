import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IrrigationExportModal = ({ isOpen, onClose, onPreview }) => {
  const [reportConfig, setReportConfig] = useState({
    farm: 'Riego de Invernaderos',
    version: 'Informe de Riego - Sistema de Gestión',
    dateRange: 'last_month', 
    sortBy: 'date_asc', // New: date_asc, date_desc, m2_desc, m2_asc, sectors_desc, greenhouse_asc
    showEmptyTables: false,
    observations: '', // User custom observations
    
    // Toggleable sections
    sections: {
      summary: true,
      dailyRecords: true,
      sectorDetails: true,
      waterConsumption: true,
      efficiency: true,
      observations: true,
      logos: {
        pepac: true
      }
    }
  });

  const toggleSection = (key) => {
    setReportConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: !prev.sections[key]
      }
    }));
  };

  const toggleLogo = (key) => {
      setReportConfig(prev => ({
          ...prev,
          sections: {
              ...prev.sections,
              logos: {
                  ...prev.sections.logos,
                  [key]: !prev.sections.logos[key]
              }
          }
      }))
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-white/40">
            <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-3">
               <span className="text-3xl">💧</span> Exportar Informe de Riego
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white/20 to-indigo-50/20">
            
            {/* Top Config Section */}
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 mb-8">
                <div className="flex items-center gap-2 mb-6 text-indigo-700 font-bold text-lg border-b border-indigo-100 pb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Configuración del Informe
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm">
                        <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Sistema Origen</label>
                        <div className="font-medium text-gray-700 text-lg">
                            {reportConfig.farm}
                        </div>
                    </div>
                     <div className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm">
                        <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Versión del Documento</label>
                         <div className="relative">
                            <select className="w-full bg-transparent font-medium text-gray-800 focus:outline-none appearance-none cursor-not-allowed" disabled>
                                <option>{reportConfig.version}</option>
                            </select>
                         </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold text-lg border-b border-indigo-100 pb-2 mt-8">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtros de Datos
                    </div>
                    
                    {/* Date Range Buttons */}
                    <div className="mt-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <label className="text-sm font-bold text-gray-500 block mb-3">Rango de Fechas:</label>
                        <div className="flex flex-wrap gap-3">
                            {['Hoy', 'Ayer', 'Última Semana', 'Último mes', 'Último año', 'Todo'].map((label) => {
                                // Map label to internal key
                                let key = 'last_month';
                                if (label === 'Hoy') key = 'today';
                                if (label === 'Ayer') key = 'yesterday';
                                if (label === 'Última Semana') key = 'last_week';
                                if (label === 'Último mes') key = 'last_month';
                                if (label === 'Último año') key = 'last_year';
                                if (label === 'Todo') key = 'all';

                                const isActive = reportConfig.dateRange === key;
                                return (
                                    <button 
                                        key={label}
                                        onClick={() => setReportConfig(prev => ({ ...prev, dateRange: key }))}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all shadow-sm ${
                                            isActive 
                                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-indigo-200 ring-2 ring-indigo-200' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-300'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Sort Options */}
                        <div className="mt-6">
                            <label className="text-sm font-bold text-gray-500 block mb-2">Criterio de Ordenación:</label>
                            <select 
                                value={reportConfig.sortBy}
                                onChange={(e) => setReportConfig(prev => ({ ...prev, sortBy: e.target.value }))}
                                className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                            >
                                <option value="date_asc">📅 Fecha (Más antigua primero)</option>
                                <option value="date_desc">📅 Fecha (Más reciente primero)</option>
                                <option value="m2_desc">💧 Cantidad M² (Mayor a menor)</option>
                                <option value="m2_asc">💧 Cantidad M² (Menor a mayor)</option>
                                <option value="sectors_desc">🏗️ Sectores (Mayor a menor)</option>
                                <option value="sectors_asc">🏗️ Sectores (Menor a mayor)</option>
                                <option value="greenhouse_asc">abc Invernadero (A-Z)</option>
                                <option value="greenhouse_desc">abc Invernadero (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                 {/* Checkboxes Area */}
                 <div className="mt-8 pt-6">
                     <div className="flex gap-8 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white group-hover:border-indigo-400 transition-colors">
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={reportConfig.showEmptyTables}
                                    onChange={() => setReportConfig(prev => ({ ...prev, showEmptyTables: !prev.showEmptyTables }))}
                                />
                                {reportConfig.showEmptyTables && (
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-base text-gray-700 font-medium">Incluir tablas vacías (sin datos)</span>
                        </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 bg-white/40 p-6 rounded-xl border border-white/50">
                        <div className="text-xs font-bold text-indigo-400 uppercase col-span-full tracking-wider border-b border-indigo-100 pb-2 mb-2">Secciones Visibles:</div>
                        
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <Checkbox label="Resumen General" checked={reportConfig.sections.summary} onChange={() => toggleSection('summary')} />
                            <Checkbox label="Registros Diarios" checked={reportConfig.sections.dailyRecords} onChange={() => toggleSection('dailyRecords')} />
                            <Checkbox label="Detalles por Sector" checked={reportConfig.sections.sectorDetails} onChange={() => toggleSection('sectorDetails')} />
                        </div>

                         {/* Column 2 */}
                        <div className="space-y-4">
                            <Checkbox label="Consumo de Agua" checked={reportConfig.sections.waterConsumption} onChange={() => toggleSection('waterConsumption')} />
                            <Checkbox label="Eficiencia de Riego" checked={reportConfig.sections.efficiency} onChange={() => toggleSection('efficiency')} />
                            <Checkbox label="Observaciones" checked={reportConfig.sections.observations} onChange={() => toggleSection('observations')} />
                        </div>
                     </div>

                     {/* Logos Section */}
                     <div className="mt-6 bg-white/40 p-6 rounded-xl border border-white/50">
                        <div className="text-xs font-bold text-indigo-400 uppercase mb-4 tracking-wider">Logotipos en Encabezado:</div>
                        <div className="flex gap-8">
                             <Checkbox label="PEPAC (Financiación)" checked={reportConfig.sections.logos.pepac} onChange={() => toggleLogo('pepac')} />
                        </div>
                     </div>
                 </div>
            </div>
            
            {/* Observations Section */}
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 mb-4">
              <label className="block text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
                📝 Observaciones Personalizadas
              </label>
              <textarea
                value={reportConfig.observations}
                onChange={(e) => setReportConfig(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Escribe aquí notas adicionales para el informe..."
                rows={4}
                className="w-full p-4 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition resize-none text-base bg-white/80"
              />
              <p className="text-sm text-gray-500 mt-2 italic">
                * Estas notas se añadirán al final del documento PDF.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200/50 bg-white/60 backdrop-blur-lg flex justify-end gap-4">
             <button 
                onClick={onClose}
                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100/50 rounded-xl transition-all"
             >
                Cancelar
             </button>
             <button
                onClick={() => onPreview(reportConfig)}
                className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 border border-indigo-200 rounded-xl transition-all flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Previsualizar
             </button>
             <button 
                onClick={() => onPreview(reportConfig)}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Generar Informe
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper Subcomponent for Checkboxes
const Checkbox = ({ label, checked, onChange, disabled }) => (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 rounded -ml-2 p-2'}`}>
        <div 
            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                checked 
                ? 'bg-indigo-500 border-indigo-500' 
                : 'bg-white border-gray-300'
            }`}
            onClick={!disabled ? onChange : undefined}
        >
            {checked && (
                 <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
            )}
        </div>
        <span className="text-sm text-gray-600">{label}</span>
    </label>
);

export default IrrigationExportModal;
