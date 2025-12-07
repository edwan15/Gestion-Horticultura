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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-indigo-600 flex items-center gap-2">
              💧 Exportar Informe de Riego
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            
            {/* Top Config Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-600 font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informe
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sistema</label>
                        <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-gray-700">
                            {reportConfig.farm}
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Versión *</label>
                         <div className="relative">
                            <select className="w-full border-b border-indigo-500 bg-transparent py-2 text-gray-800 focus:outline-none">
                                <option>{reportConfig.version}</option>
                            </select>
                             <div className="absolute right-0 top-3 text-indigo-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600 font-medium cursor-pointer">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtro
                    </div>
                    
                    {/* Date Range Buttons */}
                    <div className="mt-6">
                        <label className="text-xs text-gray-400 block mb-2">Fecha *</label>
                        <div className="flex flex-wrap gap-2">
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
                                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                            isActive 
                                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200 font-medium' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Sort Options */}
                        <div className="mt-4">
                            <label className="text-xs text-gray-400 block mb-2">Ordenar por *</label>
                            <select 
                                value={reportConfig.sortBy}
                                onChange={(e) => setReportConfig(prev => ({ ...prev, sortBy: e.target.value }))}
                                className="w-full border border-gray-200 rounded-md p-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="date_asc">Fecha (Más antigua primero)</option>
                                <option value="date_desc">Fecha (Más reciente primero)</option>
                                <option value="m2_desc">M² (Mayor a menor)</option>
                                <option value="m2_asc">M² (Menor a mayor)</option>
                                <option value="sectors_desc">Sectores (Mayor a menor)</option>
                                <option value="sectors_asc">Sectores (Menor a mayor)</option>
                                <option value="greenhouse_asc">Invernadero (A-Z)</option>
                                <option value="greenhouse_desc">Invernadero (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                 {/* Checkboxes Area */}
                 <div className="mt-8 border-t border-gray-100 pt-6">
                     <div className="flex gap-8 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={reportConfig.showEmptyTables}
                                    onChange={() => setReportConfig(prev => ({ ...prev, showEmptyTables: !prev.showEmptyTables }))}
                                />
                                {reportConfig.showEmptyTables && (
                                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-gray-500">Incluir tablas vacías</span>
                        </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="text-xs font-semibold text-gray-400 uppercase col-span-full mb-2">Mostrar:</div>
                        
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
                     <div className="mt-8">
                        <div className="text-xs font-semibold text-gray-400 uppercase mb-4">Mostrar - Logos:</div>
                        <div className="flex gap-8">
                             <Checkbox label="PEPAC" checked={reportConfig.sections.logos.pepac} onChange={() => toggleLogo('pepac')} />
                        </div>
                     </div>
                 </div>
            </div>
            
            {/* Observations Section */}
            <div className="px-6 pb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Observaciones Personalizadas
              </label>
              <textarea
                value={reportConfig.observations}
                onChange={(e) => setReportConfig(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Escribe aquí cualquier observación o nota que desees incluir en el informe..."
                rows={4}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Estas observaciones aparecerán en la sección de observaciones del informe final.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-indigo-500 flex justify-end gap-3 text-sm">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-transparent text-white font-medium hover:bg-indigo-600 rounded transition"
             >
                Cancelar
             </button>
             <button
                onClick={() => onPreview(reportConfig)}
                className="px-6 py-2 bg-indigo-700/50 text-white font-medium hover:bg-indigo-700/70 border border-indigo-400/50 rounded transition"
             >
                Previsualizar
             </button>
             <button 
                onClick={() => onPreview(reportConfig)}
                className="px-6 py-2 bg-white text-indigo-600 font-bold rounded shadow hover:bg-gray-50 transition"
             >
                Exportar
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
