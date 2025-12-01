import React, { useState } from 'react';
import { Trash2, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import TareaEstadisticosModal from '../components/Carga/TareaEstadisticosModal';
import { colors, spacing, shadows, borderRadius } from '../styles/designSystem';

/**
 * Página de demostración para los nuevos componentes modernos
 * Esta página muestra:
 * - ConfirmationModal con diferentes variantes
 * - TareaEstadisticosModal para datos estadísticos
 * - Sistema de diseño aplicado
 */
const ComponentDemo = () => {
  // Estados para los modales
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Datos de ejemplo
  const [calendarName] = useState("Invernadero Principal");
  const [statsData, setStatsData] = useState({});

  // Handlers
  const handleDelete = async () => {
    setIsLoading(true);
    // Simular operación async
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsDeleteModalOpen(false);
    alert('¡Registro eliminado exitosamente!');
  };

  const handleSaveStats = async (calendarId, data) => {
    console.log('Guardando datos estadísticos:', data);
    setStatsData(data);
    alert('¡Datos guardados exitosamente!');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
      padding: spacing['2xl']
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          boxShadow: shadows.lg
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: colors.neutral[900],
            marginBottom: spacing.md
          }}>
            🎨 Demostración de Componentes Modernos
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: colors.neutral[600]
          }}>
            Prueba los nuevos componentes creados para la modernización de Tarea.js
          </p>
        </div>

        {/* Grid de tarjetas de demostración */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing.lg
        }}>
          {/* Card 1: Modal de Eliminación */}
          <div style={{
            background: 'white',
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.md,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.full,
              background: colors.error[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md
            }}>
              <Trash2 size={24} color={colors.error[600]} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: colors.neutral[900],
              marginBottom: spacing.sm
            }}>
              Modal de Confirmación (Danger)
            </h3>
            <p style={{
              color: colors.neutral[600],
              marginBottom: spacing.lg,
              lineHeight: '1.5'
            }}>
              Modal moderno con animaciones para confirmar acciones destructivas como eliminar registros.
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.error[600],
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.error[700]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.error[600]}
            >
              <Trash2 size={18} />
              Abrir Modal de Eliminación
            </button>
          </div>

          {/* Card 2: Modal de Éxito */}
          <div style={{
            background: 'white',
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.md,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.full,
              background: colors.success[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md
            }}>
              <CheckCircle size={24} color={colors.success[600]} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: colors.neutral[900],
              marginBottom: spacing.sm
            }}>
              Modal de Confirmación (Success)
            </h3>
            <p style={{
              color: colors.neutral[600],
              marginBottom: spacing.lg,
              lineHeight: '1.5'
            }}>
              Variante de éxito para confirmar acciones positivas con estilo visual diferente.
            </p>
            <button
              onClick={() => setIsSuccessModalOpen(true)}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.success[600],
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.success[700]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.success[600]}
            >
              <CheckCircle size={18} />
              Abrir Modal de Éxito
            </button>
          </div>

          {/* Card 3: Modal de Advertencia */}
          <div style={{
            background: 'white',
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.md,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.full,
              background: colors.warning[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md
            }}>
              <AlertTriangle size={24} color={colors.warning[600]} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: colors.neutral[900],
              marginBottom: spacing.sm
            }}>
              Modal de Confirmación (Warning)
            </h3>
            <p style={{
              color: colors.neutral[600],
              marginBottom: spacing.lg,
              lineHeight: '1.5'
            }}>
              Variante de advertencia para acciones que requieren atención especial del usuario.
            </p>
            <button
              onClick={() => setIsWarningModalOpen(true)}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.warning[600],
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.warning[700]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.warning[600]}
            >
              <AlertTriangle size={18} />
              Abrir Modal de Advertencia
            </button>
          </div>

          {/* Card 4: Modal Estadístico */}
          <div style={{
            background: 'white',
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            boxShadow: shadows.md,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            gridColumn: 'span 2'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: borderRadius.full,
              background: colors.secondary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md
            }}>
              <BarChart3 size={24} color={colors.secondary[600]} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: colors.neutral[900],
              marginBottom: spacing.sm
            }}>
              Modal de Datos Estadísticos
            </h3>
            <p style={{
              color: colors.neutral[600],
              marginBottom: spacing.lg,
              lineHeight: '1.5'
            }}>
              Modal completo con formulario de acordeón para registrar información del invernadero, metas de producción y notas.
              Incluye validación y guardado en Firestore.
            </p>
            <button
              onClick={() => setIsStatsModalOpen(true)}
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                background: colors.secondary[600],
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.secondary[700]}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.secondary[600]}
            >
              <BarChart3 size={18} />
              Abrir Modal Estadístico
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div style={{
          background: 'white',
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
          marginTop: spacing.xl,
          boxShadow: shadows.md
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: colors.neutral[900],
            marginBottom: spacing.md
          }}>
            📚 Componentes Disponibles
          </h2>
          <ul style={{
            color: colors.neutral[700],
            lineHeight: '1.8',
            paddingLeft: spacing.lg
          }}>
            <li><strong>ConfirmationModal:</strong> Modal reutilizable con 4 variantes (danger, warning, success, info)</li>
            <li><strong>TareaEstadisticosModal:</strong> Formulario completo para datos estadísticos del invernadero</li>
            <li><strong>Design System:</strong> Sistema centralizado de colores, espaciado, tipografía y más</li>
          </ul>
        </div>
      </div>

      {/* Modales */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Registro"
        message={`¿Estás seguro de que deseas eliminar el registro "${calendarName}"? Esta acción eliminará todos los productos asociados y no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={isLoading}
      />

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          alert('¡Acción confirmada!');
        }}
        title="Confirmar Acción"
        message="Esta es una acción positiva que será confirmada."
        confirmText="Confirmar"
        variant="success"
      />

      <ConfirmationModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onConfirm={() => {
          setIsWarningModalOpen(false);
          alert('¡Advertencia aceptada!');
        }}
        title="Advertencia Importante"
        message="Esta acción requiere tu atención. ¿Deseas continuar?"
        confirmText="Continuar"
        variant="warning"
      />

      <TareaEstadisticosModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        calendarId="demo-calendar-1"
        calendarName={calendarName}
        onSave={handleSaveStats}
        initialData={statsData}
      />
    </div>
  );
};

export default ComponentDemo;
