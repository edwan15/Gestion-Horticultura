import React from 'react';
import { Calendar } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../../../styles/designSystem';

/**
 * CalendarSelector - Selector de calendarios/registros
 * Permite cambiar entre diferentes registros
 */
const CalendarSelector = ({
  calendars,
  selectedCalendarId,
  setSelectedCalendarId,
  isAuthReady,
}) => {
  if (!isAuthReady || calendars.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: 'white',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        marginBottom: spacing.lg,
      }}
    >
      <label
        htmlFor="calendar-select"
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontSize: '0.875rem',
          fontWeight: '600',
          color: colors.neutral[700],
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Calendar size={18} color={colors.primary[600]} />
        Seleccionar Registro
      </label>
      
      <select
        id="calendar-select"
        value={selectedCalendarId || ''}
        onChange={(e) => setSelectedCalendarId(e.target.value)}
        style={{
          width: '100%',
          padding: spacing.md,
          border: `2px solid ${colors.neutral[300]}`,
          borderRadius: borderRadius.lg,
          fontSize: '1rem',
          fontWeight: '500',
          color: colors.neutral[900],
          background: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.primary[500];
          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.neutral[300];
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <option value="">-- Selecciona un registro --</option>
        {calendars.map((cal) => (
          <option key={cal.id} value={cal.id}>
            {cal.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CalendarSelector;
