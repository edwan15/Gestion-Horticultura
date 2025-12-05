import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportReportModal = ({ isOpen, onClose, onPreview, dataRange }) => {
  const [activeTab, setActiveTab] = useState('informe');
  const [reportConfig, setReportConfig] = useState({
    farm: 'Finca Balsicas Producción', // Mocked for now
    version: 'Cuaderno de Campo - PEPAC',
     cultivos: [],
    exportable: 'Exportables',
    dateRange: 'last_year', 
    showAnalysis: false,
    showEmptyTables: false,
    
    // Toggleable sections
    sections: {
      farmCharacterization: true,
      map: false,
      culturalOperation: true,
      irrigation: true,
      analysis: true,
      fertilizationPlan: true,
      fertilizations: true,
      appliedNutrients: true,
      biologicalControl: true,
      phytosanitaryTreatments: true,
      activeSubstances: true,
      harvest: true,
      observations: true,
      safety: true,
      logos: {
        pdr2020: false, // Per screenshot
        pepac: true     // Per screenshot
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
          className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-emerald-600 flex items-center gap-2">
              Exportar Informe
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
                <div className="flex items-center gap-2 mb-4 text-emerald-600 font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informe
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Finca</label>
                        <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-gray-700">
                            {reportConfig.farm}
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Versión *</label>
                         <div className="relative">
                            <select className="w-full border-b border-emerald-500 bg-transparent py-2 text-gray-800 focus:outline-none">
                                <option>{reportConfig.version}</option>
                            </select>
                             <div className="absolute right-0 top-3 text-red-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 text-emerald-600 font-medium cursor-pointer">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtro
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {/* Row 1 */}
                         <div className="border-b border-gray-200 py-1">
                            <input type="text" placeholder="Cultivos" className="w-full bg-transparent focus:outline-none text-sm" disabled />
                         </div>
                         <div className="border-b border-gray-200 py-1">
                            <input type="text" placeholder="Zonas Homogéneas" className="w-full bg-transparent focus:outline-none text-sm" disabled />
                         </div>
                         <div className="border-b border-gray-200 py-1">
                            <input type="text" placeholder="Parcelas" className="w-full bg-transparent focus:outline-none text-sm" disabled />
                         </div>

                          {/* Row 2 */}
                         <div className="border-b border-gray-200 py-1">
                            <input type="text" placeholder="Tipos de Cultivo" className="w-full bg-transparent focus:outline-none text-sm" disabled />
                         </div>
                         <div>
                            <label className="text-xs text-gray-400 block mb-1">Exportable</label>
                             <select className="w-full border-b border-gray-200 bg-transparent text-sm pb-1 focus:outline-none">
                                <option>Exportables</option>
                                <option>Todos</option>
                            </select>
                         </div>
                         <div className="border-b border-gray-200 py-1">
                            <input type="text" placeholder="Empresas" className="w-full bg-transparent focus:outline-none text-sm" disabled />
                         </div>
                    </div>
                    
                    {/* Date Range Buttons */}
                    <div className="mt-6">
                        <label className="text-xs text-gray-400 block mb-2">Fecha *</label>
                        <div className="flex flex-wrap gap-2">
                            {['Hoy', 'Ayer', 'Última Semana', 'Último mes', 'Último año', 'Personalizar', 'Todo'].map((label) => {
                                // Map label to internal key
                                let key = 'last_year';
                                if (label === 'Hoy') key = 'today';
                                if (label === 'Ayer') key = 'yesterday';
                                if (label === 'Última Semana') key = 'last_week';
                                if (label === 'Último mes') key = 'last_month';
                                if (label === 'Último año') key = 'last_year';
                                if (label === 'Personalizar') key = 'custom';
                                if (label === 'Todo') key = 'all';

                                const isActive = reportConfig.dateRange === key;
                                return (
                                    <button 
                                        key={label}
                                        onClick={() => setReportConfig(prev => ({ ...prev, dateRange: key }))}
                                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                            isActive 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 font-medium' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                 {/* Checkboxes Area */}
                 <div className="mt-8 border-t border-gray-100 pt-6">
                     <div className="flex gap-8 mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                                {/* Allow generic state hookup later */}
                                <input type="checkbox" className="hidden" />
                            </div>
                            <span className="text-sm text-gray-500">Añadir informes de análisis</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                             <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                                <input type="checkbox" className="hidden" />
                            </div>
                            <span className="text-sm text-gray-500">Incluir tablas vacías</span>
                        </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                        <div className="text-xs font-semibold text-gray-400 uppercase col-span-full mb-2">Mostrar:</div>
                        
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <Checkbox label="Caracterización de la finca" checked={reportConfig.sections.farmCharacterization} onChange={() => toggleSection('farmCharacterization')} />
                            <Checkbox label="Riego" checked={reportConfig.sections.irrigation} onChange={() => toggleSection('irrigation')} />
                            <Checkbox label="Fertilizaciones" checked={reportConfig.sections.fertilizations} onChange={() => toggleSection('fertilizations')} />
                            <Checkbox label="Tratamientos - Recomendaciones" checked={reportConfig.sections.phytosanitaryTreatments} onChange={() => toggleSection('phytosanitaryTreatments')} />
                             <Checkbox label="Cosecha" checked={reportConfig.sections.harvest} onChange={() => toggleSection('harvest')} />
                             <Checkbox label="Adquisiciones" disabled />
                        </div>

                         {/* Column 2 */}
                        <div className="space-y-4">
                            <Checkbox label="Mapa" checked={reportConfig.sections.map} onChange={() => toggleSection('map')} />
                            <Checkbox label="Análisis" checked={reportConfig.sections.analysis} onChange={() => toggleSection('analysis')} />
                            <Checkbox label="Nutrientes aplicados" checked={reportConfig.sections.appliedNutrients} onChange={() => toggleSection('appliedNutrients')} />
                            <Checkbox label="Tratamientos Fitosanitarios" checked={reportConfig.sections.phytosanitaryTreatments} onChange={() => toggleSection('phytosanitaryTreatments')} />
                            <Checkbox label="Anotaciones" checked={reportConfig.sections.observations} onChange={() => toggleSection('observations')} />
                            <Checkbox label="Ventas" disabled />
                        </div>

                         {/* Column 3 */}
                        <div className="space-y-4">
                             <Checkbox label="Operación Cultural" checked={reportConfig.sections.culturalOperation} onChange={() => toggleSection('culturalOperation')} />
                             <Checkbox label="Plan de fertilización" checked={reportConfig.sections.fertilizationPlan} onChange={() => toggleSection('fertilizationPlan')} />
                             <Checkbox label="Control Biológico" checked={reportConfig.sections.biologicalControl} onChange={() => toggleSection('biologicalControl')} />
                             <Checkbox label="Tratamientos - Sustancias activas" checked={reportConfig.sections.activeSubstances} onChange={() => toggleSection('activeSubstances')} />
                             <Checkbox label="Plan de buenas prácticas de higiene" checked={reportConfig.sections.safety} onChange={() => toggleSection('safety')} />
                        </div>
                     </div>

                     {/* Logos Section */}
                     <div className="mt-8">
                        <div className="text-xs font-semibold text-gray-400 uppercase mb-4">Mostrar - Logos:</div>
                        <div className="flex gap-8">
                             <Checkbox label="PDR2020" checked={reportConfig.sections.logos.pdr2020} onChange={() => toggleLogo('pdr2020')} />
                             <Checkbox label="PEPAC" checked={reportConfig.sections.logos.pepac} onChange={() => toggleLogo('pepac')} />
                        </div>
                     </div>
                 </div>
            </div>
            
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-emerald-500 flex justify-end gap-3 text-sm">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-transparent text-white font-medium hover:bg-emerald-600 rounded transition"
             >
                Cancelar
             </button>
             <button
                onClick={() => onPreview(reportConfig)}
                className="px-6 py-2 bg-emerald-700/50 text-white font-medium hover:bg-emerald-700/70 border border-emerald-400/50 rounded transition"
             >
                Previsualizar
             </button>
             <button 
                className="px-6 py-2 bg-white text-emerald-600 font-bold rounded shadow hover:bg-gray-50 transition"
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
                ? 'bg-emerald-500 border-emerald-500' 
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

export default ExportReportModal;
