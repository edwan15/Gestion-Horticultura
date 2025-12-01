import React from 'react';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../../../styles/designSystem';

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/**
 * TareaHeader - Cabecera moderna y responsiva para Tarea.js
 * Muestra el título, navegación y fecha actual
 */
const TareaHeader = ({ 
  currentView, 
  backToCalendar, 
  selectedCalendarName, 
  currentDate 
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        marginBottom: spacing.xl,
        padding: `0 ${spacing.md}`,
      }}
      className="sm:flex-row sm:items-center sm:px-0"
    >
      {/* Botón de retroceso */}
      {currentView === "details" && (
        <button
          onClick={backToCalendar}
          style={{
            padding: spacing.sm,
            background: colors.neutral[100],
            border: 'none',
            borderRadius: borderRadius.full,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: shadows.sm,
            alignSelf: 'flex-start',
          }}
          className="hover:bg-gray-200 sm:self-auto"
          title="Volver al calendario"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.neutral[200];
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.neutral[100];
            e.currentTarget.style.boxShadow = shadows.sm;
          }}
        >
          <ArrowLeft size={24} color={colors.neutral[700]} />
        </button>
      )}

      {/* Título principal */}
      <h1 
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: '800',
          color: colors.neutral[900],
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          flexWrap: 'wrap',
          flex: 1,
          minWidth: 0,
        }}
      >
        <CalendarIcon
          size={36}
          color={colors.primary[600]}
          style={{ flexShrink: 0 }}
        />
        <span style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}>
          {selectedCalendarName}
        </span>
        
        {/* Fecha actual (solo en vista de calendario) */}
        {currentView === "calendar" && (
          <span 
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: colors.neutral[500],
              fontWeight: '400',
              width: '100%',
            }}
            className="sm:w-auto sm:ml-3"
          >
            | {MONTHS[currentDate?.getMonth()]} {currentDate?.getFullYear()}
          </span>
        )}
      </h1>
    </div>
  );
};

export default TareaHeader;
