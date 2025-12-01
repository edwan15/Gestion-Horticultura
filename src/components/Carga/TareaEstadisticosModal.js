import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Save, FileText, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * Statistical Modal for Tarea.js - Track greenhouse/calendar historical data
 * Similar to ProduccionC's DatosEstadisticosModal but adapted for Tarea's data structure
 */
const TareaEstadisticosModal = ({
  isOpen,
  onClose,
  calendarId,
  calendarName,
  onSave,
  initialData = {},
}) => {
  const [expandedSection, setExpandedSection] = useState('general');
  const [formData, setFormData] = useState({
    // General Information
    greenhouseName: '',
    area: '',
    areaUnit: 'ha',
    plantingDate: '',
    harvestDate: '',
    cropType: '',
    variety: '',
    
    // Production Goals
    productionGoal: '',
    productionGoalUnit: 'kg',
    expectedYield: '',
    
    // Notes and Observations
    notes: '',
    observations: '',
    
    // Historical Data (for future chart integration)
    historicalRecords: [],
    
    ...initialData,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync form data when modal opens with new data
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [isOpen, initialData]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(calendarId, formData);
      toast.success('Datos estadísticos guardados correctamente');
      onClose();
    } catch (error) {
      console.error('Error saving statistical data:', error);
      toast.error('Error al guardar los datos');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  const sections = {
    general: {
      title: 'Información General',
      icon: FileText,
      fields: [
        { label: 'Nombre del Invernadero', key: 'greenhouseName', type: 'text', placeholder: 'Ej: Invernadero Principal' },
        { label: 'Área Cultivada', key: 'area', type: 'number', unit: 'areaUnit', unitOptions: ['ha', 'm²'] },
        { label: 'Fecha de Plantación', key: 'plantingDate', type: 'date' },
        { label: 'Fecha Estimada de Cosecha', key: 'harvestDate', type: 'date' },
        { label: 'Tipo de Cultivo', key: 'cropType', type: 'text', placeholder: 'Ej: Tomate, Pepino, etc.' },
        { label: 'Variedad', key: 'variety', type: 'text', placeholder: 'Ej: Cherry, Beefsteak, etc.' },
      ],
    },
    production: {
      title: 'Metas de Producción',
      icon: TrendingUp,
      fields: [
        { label: 'Meta de Producción', key: 'productionGoal', type: 'number', unit: 'productionGoalUnit', unitOptions: ['kg', 'ton', 'unidades'] },
        { label: 'Rendimiento Esperado (kg/ha)', key: 'expectedYield', type: 'number' },
      ],
    },
    notes: {
      title: 'Notas y Observaciones',
      icon: Calendar,
      fields: [
        { label: 'Notas Generales', key: 'notes', type: 'textarea', placeholder: 'Información importante sobre este registro...' },
        { label: 'Observaciones', key: 'observations', type: 'textarea', placeholder: 'Observaciones adicionales, problemas detectados, etc.' },
      ],
    },
  };

  const renderField = (field) => {
    const commonClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";

    if (field.type === 'textarea') {
      return (
        <textarea
          value={formData[field.key] || ''}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={`${commonClasses} min-h-[100px] resize-y`}
          rows={4}
        />
      );
    }

    if (field.unit) {
      return (
        <div className="flex space-x-2">
          <input
            type={field.type}
            value={formData[field.key] || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`${commonClasses} flex-1`}
          />
          <select
            value={formData[field.unit] || field.unitOptions[0]}
            onChange={(e) => handleFieldChange(field.unit, e.target.value)}
            className={`${commonClasses} w-24`}
          >
            {field.unitOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <input
        type={field.type}
        value={formData[field.key] || ''}
        onChange={(e) => handleFieldChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={commonClasses}
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Datos Estadísticos</h2>
              <p className="text-sm text-gray-600">{calendarName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {Object.entries(sections).map(([key, section]) => {
            const isExpanded = expandedSection === key;
            const Icon = section.icon;

            return (
              <div key={key} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">{section.title}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-300 ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Section Content */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div
                        key={field.key}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TareaEstadisticosModal;
