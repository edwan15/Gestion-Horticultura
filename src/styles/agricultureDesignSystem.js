/**
 * 🌶️ Agricultural Design System - Pepper Production Theme
 * Sistema de diseño empresarial para producción agrícola de pimientos
 */

// 🎨 Paleta de Colores Agrícola
export const agriColors = {
  // Colores principales (Pimientos)
  pepper: {
    red: '#C62828',      // Pimiento rojo maduro
    redLight: '#E53935',
    redDark: '#B71C1C',
    green: '#2E7D32',    // Planta/hojas
    greenLight: '#43A047',
    greenDark: '#1B5E20',
    yellow: '#F9A825',   // Pimiento amarillo
    yellowLight: '#FBC02D',
    orange: '#EF6C00',   // Pimiento naranja
    orangeLight: '#FB8C00',
  },
  
  // Colores del campo
  field: {
    earth: '#5D4037',    // Tierra fértil
    earthLight: '#6D4C41',
    earthDark: '#4E342E',
    sky: '#0277BD',      // Cielo
    skyLight: '#039BE5',
    grass: '#1B5E20',    // Pasto
    sun: '#FFA000',      // Sol
  },
  
  // Colores de UI
  ui: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    divider: '#BDBDBD',
  },
  
  // Estados
  status: {
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F9A825',
    warningLight: '#FFF9C4',
    error: '#C62828',
    errorLight: '#FFEBEE',
    info: '#0277BD',
    infoLight: '#E1F5FE',
  }
};

// 🌈 Gradientes Temáticos
export const agriGradients = {
  primary: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  harvest: 'linear-gradient(135deg, #F9A825 0%, #EF6C00 100%)',
  earth: 'linear-gradient(135deg, #5D4037 0%, #4E342E 100%)',
  pepper: 'linear-gradient(135deg, #C62828 0%, #B71C1C 100%)',
  sky: 'linear-gradient(135deg, #0277BD 0%, #01579B 100%)',
  field: 'linear-gradient(135deg, #2E7D32 0%, #5D4037 50%, #0277BD 100%)',
  sunset: 'linear-gradient(135deg, #FFA000 0%, #EF6C00 50%, #C62828 100%)',
};

// 📏 Espaciado
export const agriSpacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

// 🔤 Tipografía
export const agriTypography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    secondary: "'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// 🔲 Border Radius
export const agriBorderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
};

// 🌑 Sombras
export const agriShadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Sombras temáticas
  pepper: '0 10px 25px -5px rgba(198, 40, 40, 0.3)',
  field: '0 10px 25px -5px rgba(46, 125, 50, 0.3)',
  earth: '0 10px 25px -5px rgba(93, 64, 55, 0.3)',
};

// ⚡ Transiciones
export const agriTransitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// 📱 Breakpoints
export const agriBreakpoints = {
  mobile: '640px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
  wide: '1536px',
};

// 🎯 Z-Index
export const agriZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// 🌶️ Iconos Temáticos (Emojis)
export const agriIcons = {
  pepper: '🌶️',
  plant: '🌱',
  harvest: '🧺',
  sun: '☀️',
  water: '💧',
  earth: '🌍',
  tractor: '🚜',
  greenhouse: '🏡',
  calendar: '📅',
  chart: '📊',
  money: '💰',
  worker: '👷',
  clock: '⏰',
  package: '📦',
};

// 🎨 Utilidades de Estilo
export const agriUtils = {
  // Card con tema agrícola
  card: {
    base: {
      background: agriColors.ui.surface,
      borderRadius: agriBorderRadius.xl,
      boxShadow: agriShadows.md,
      border: `1px solid ${agriColors.ui.border}`,
      transition: agriTransitions.base,
    },
    hover: {
      boxShadow: agriShadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  
  // Botón con tema agrícola
  button: {
    primary: {
      background: agriGradients.primary,
      color: '#FFFFFF',
      borderRadius: agriBorderRadius.lg,
      padding: `${agriSpacing.md} ${agriSpacing.xl}`,
      fontWeight: agriTypography.fontWeight.semibold,
      boxShadow: agriShadows.field,
      transition: agriTransitions.base,
    },
    secondary: {
      background: agriGradients.harvest,
      color: '#FFFFFF',
      borderRadius: agriBorderRadius.lg,
      padding: `${agriSpacing.md} ${agriSpacing.xl}`,
      fontWeight: agriTypography.fontWeight.semibold,
      boxShadow: agriShadows.md,
      transition: agriTransitions.base,
    },
  },
  
  // Badge
  badge: {
    success: {
      background: agriColors.status.successLight,
      color: agriColors.status.success,
      padding: `${agriSpacing.xs} ${agriSpacing.sm}`,
      borderRadius: agriBorderRadius.full,
      fontSize: agriTypography.fontSize.xs,
      fontWeight: agriTypography.fontWeight.semibold,
    },
    warning: {
      background: agriColors.status.warningLight,
      color: agriColors.pepper.orange,
      padding: `${agriSpacing.xs} ${agriSpacing.sm}`,
      borderRadius: agriBorderRadius.full,
      fontSize: agriTypography.fontSize.xs,
      fontWeight: agriTypography.fontWeight.semibold,
    },
  },
};

export default {
  colors: agriColors,
  gradients: agriGradients,
  spacing: agriSpacing,
  typography: agriTypography,
  borderRadius: agriBorderRadius,
  shadows: agriShadows,
  transitions: agriTransitions,
  breakpoints: agriBreakpoints,
  zIndex: agriZIndex,
  icons: agriIcons,
  utils: agriUtils,
};
