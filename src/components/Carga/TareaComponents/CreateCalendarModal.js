import React from 'react';
import { X } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../../../styles/designSystem';

/**
 * CreateCalendarModal - Modal moderno para crear nuevos registros
 */
const CreateCalendarModal = ({
  isOpen,
  onClose,
  onSubmit,
  newCalendarName,
  setNewCalendarName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          width: '90%',
          maxWidth: '28rem',
          boxShadow: shadows['2xl'],
          transform: 'scale(1)',
          transition: 'all 0.3s',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
            paddingBottom: spacing.md,
            borderBottom: `2px solid ${colors.neutral[200]}`,
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: colors.neutral[900],
            }}
          >
            Crear Nuevo Registro
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: spacing.xs,
              borderRadius: borderRadius.md,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.neutral[100];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={24} color={colors.neutral[500]} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div>
            <label
              htmlFor="calendarName"
              style={{
                display: 'block',
                marginBottom: spacing.sm,
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.neutral[700],
              }}
            >
              Nombre del Registro
            </label>
            <input
              id="calendarName"
              type="text"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              placeholder="Ej: Invernadero Principal 2024"
              required
              style={{
                width: '100%',
                padding: spacing.md,
                border: `2px solid ${colors.neutral[300]}`,
                borderRadius: borderRadius.lg,
                fontSize: '1rem',
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
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: `${spacing.md} ${spacing.lg}`,
              background: colors.success[600],
              color: 'white',
              border: 'none',
              borderRadius: borderRadius.lg,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: shadows.md,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.success[700];
              e.currentTarget.style.boxShadow = shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.success[600];
              e.currentTarget.style.boxShadow = shadows.md;
            }}
          >
            Crear Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCalendarModal;
