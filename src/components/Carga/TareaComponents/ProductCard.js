import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { agriColors, agriSpacing, agriBorderRadius, agriShadows, agriTransitions } from '../../../styles/agricultureDesignSystem';

/**
 * 🎴 ProductCard - Card visual para productos con tema agrícola
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
  const { title, imageBase64, valueA, valueB, result } = product;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: agriBorderRadius.xl,
        boxShadow: agriShadows.md,
        border: `2px solid ${agriColors.ui.borderLight}`,
        overflow: 'hidden',
        transition: agriTransitions.base,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      className="product-card-hover"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = agriShadows.lg;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = agriColors.pepper.green;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = agriShadows.md;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = agriColors.ui.borderLight;
      }}
    >
      {/* Imagen del producto */}
      {imageBase64 && (
        <div style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          background: agriColors.ui.background,
          position: 'relative',
        }}>
          <img
            src={imageBase64}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute',
            top: agriSpacing.sm,
            right: agriSpacing.sm,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: `${agriSpacing.xs} ${agriSpacing.sm}`,
            borderRadius: agriBorderRadius.full,
            fontSize: '1.25rem',
          }}>
            🌶️
          </div>
        </div>
      )}

      {/* Contenido */}
      <div style={{ padding: agriSpacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Título */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: agriColors.ui.text,
          marginBottom: agriSpacing.md,
          display: 'flex',
          alignItems: 'center',
          gap: agriSpacing.sm,
        }}>
          <span style={{ fontSize: '1.5rem' }}>📦</span>
          {title}
        </h3>

        {/* Valores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: agriSpacing.md,
          marginBottom: agriSpacing.md,
        }}>
          {/* Valor A */}
          <div style={{
            background: `linear-gradient(135deg, ${agriColors.pepper.greenLight}15 0%, ${agriColors.pepper.green}25 100%)`,
            padding: agriSpacing.md,
            borderRadius: agriBorderRadius.lg,
            border: `2px solid ${agriColors.pepper.greenLight}`,
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: agriColors.ui.textSecondary,
              fontWeight: 600,
              marginBottom: agriSpacing.xs,
            }}>
              Valor A
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: agriColors.pepper.green,
            }}>
              {valueA.toFixed(2)}
            </div>
          </div>

          {/* Valor B */}
          <div style={{
            background: `linear-gradient(135deg, ${agriColors.pepper.yellowLight}15 0%, ${agriColors.pepper.yellow}25 100%)`,
            padding: agriSpacing.md,
            borderRadius: agriBorderRadius.lg,
            border: `2px solid ${agriColors.pepper.yellowLight}`,
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: agriColors.ui.textSecondary,
              fontWeight: 600,
              marginBottom: agriSpacing.xs,
            }}>
              Valor B
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: agriColors.pepper.orange,
            }}>
              {valueB.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div style={{
          background: `linear-gradient(135deg, ${agriColors.pepper.red} 0%, ${agriColors.pepper.redDark} 100%)`,
          padding: agriSpacing.md,
          borderRadius: agriBorderRadius.lg,
          textAlign: 'center',
          marginBottom: agriSpacing.md,
          boxShadow: agriShadows.pepper,
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
            marginBottom: agriSpacing.xs,
          }}>
            Resultado (A × B)
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white',
          }}>
            ${result.toFixed(2)}
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          gap: agriSpacing.sm,
          marginTop: 'auto',
        }}>
          <button
            onClick={() => onEdit(product)}
            style={{
              flex: 1,
              padding: `${agriSpacing.sm} ${agriSpacing.md}`,
              background: agriColors.pepper.greenLight,
              color: 'white',
              border: 'none',
              borderRadius: agriBorderRadius.lg,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: agriSpacing.xs,
              transition: agriTransitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = agriColors.pepper.green;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = agriColors.pepper.greenLight;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            style={{
              flex: 1,
              padding: `${agriSpacing.sm} ${agriSpacing.md}`,
              background: agriColors.pepper.red,
              color: 'white',
              border: 'none',
              borderRadius: agriBorderRadius.lg,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: agriSpacing.xs,
              transition: agriTransitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = agriColors.pepper.redDark;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = agriColors.pepper.red;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={16} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
