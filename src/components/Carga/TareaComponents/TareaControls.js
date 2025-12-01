import React from 'react';
import { Plus, FileSpreadsheet, FileText, Trash2, BarChart3 } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../../../styles/designSystem';

/**
 * TareaControls - Panel de control con botones de acción
 * Incluye: Nuevo Registro, Exportar, Eliminar, Estadísticas
 */
const TareaControls = ({
  selectedCalendarId,
  setIsCalendarModalOpen,
  openExportModalInRangeMode,
  openExportModalInSingleDayMode,
  openDeleteModal,
  openStatsModal,
  selectedCalendarName,
}) => {
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.lg}`,
    border: 'none',
    borderRadius: borderRadius.lg,
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: shadows.md,
    width: '100%',
  };

  const createButtonStyle = (bgColor, hoverColor, disabled = false) => ({
    ...buttonBaseStyle,
    background: disabled ? colors.neutral[300] : bgColor,
    color: disabled ? colors.neutral[500] : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing.md,
        padding: spacing.lg,
        background: 'white',
        borderRadius: borderRadius.xl,
        boxShadow: shadows.lg,
        marginBottom: spacing.xl,
      }}
    >
      {/* Botón Nuevo Registro */}
      <button
        onClick={() => setIsCalendarModalOpen(true)}
        style={createButtonStyle(colors.success[600], colors.success[700])}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.success[700];
          e.currentTarget.style.boxShadow = shadows.xl;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.success[600];
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Plus size={18} />
        Nuevo Registro
      </button>

      {/* Botón Exportar Rango */}
      <button
        onClick={openExportModalInRangeMode}
        disabled={!selectedCalendarId}
        style={createButtonStyle(
          colors.primary[600],
          colors.primary[700],
          !selectedCalendarId
        )}
        onMouseEnter={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.primary[700];
            e.currentTarget.style.boxShadow = shadows.xl;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.primary[600];
            e.currentTarget.style.boxShadow = shadows.md;
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <FileSpreadsheet size={18} />
        Exportar Rango
      </button>

      {/* Botón Exportar Día */}
      <button
        onClick={openExportModalInSingleDayMode}
        disabled={!selectedCalendarId}
        style={createButtonStyle(
          colors.secondary[600],
          colors.secondary[700],
          !selectedCalendarId
        )}
        onMouseEnter={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.secondary[700];
            e.currentTarget.style.boxShadow = shadows.xl;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.secondary[600];
            e.currentTarget.style.boxShadow = shadows.md;
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <FileText size={18} />
        Exportar Día
      </button>

      {/* Botón Eliminar */}
      <button
        onClick={() => openDeleteModal(selectedCalendarId, selectedCalendarName)}
        disabled={!selectedCalendarId}
        style={createButtonStyle(
          colors.error[600],
          colors.error[700],
          !selectedCalendarId
        )}
        onMouseEnter={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.error[700];
            e.currentTarget.style.boxShadow = shadows.xl;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.error[600];
            e.currentTarget.style.boxShadow = shadows.md;
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <Trash2 size={18} />
        Eliminar Registro
      </button>

      {/* Botón Estadísticas */}
      <button
        onClick={openStatsModal}
        disabled={!selectedCalendarId}
        style={createButtonStyle(
          colors.warning[600],
          colors.warning[700],
          !selectedCalendarId
        )}
        onMouseEnter={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.warning[700];
            e.currentTarget.style.boxShadow = shadows.xl;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCalendarId) {
            e.currentTarget.style.background = colors.warning[600];
            e.currentTarget.style.boxShadow = shadows.md;
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <BarChart3 size={18} />
        Datos Estadísticos
      </button>
    </div>
  );
};

export default TareaControls;
