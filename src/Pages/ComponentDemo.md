# 🎨 Página de Demostración de Componentes

## 📍 Ubicación
`src/Pages/ComponentDemo.js`

## 🎯 Propósito
Esta página demuestra todos los componentes modernos creados para la modernización de Tarea.js sin modificar el archivo original.

## ✨ Características

### 1. **ConfirmationModal - Variante Danger**
- Modal rojo para acciones destructivas
- Ejemplo: Eliminar registro
- Incluye estado de carga
- Animaciones suaves

### 2. **ConfirmationModal - Variante Success**
- Modal verde para acciones positivas
- Ejemplo: Confirmar operación exitosa
- Diseño optimista

### 3. **ConfirmationModal - Variante Warning**
- Modal naranja para advertencias
- Ejemplo: Acciones que requieren atención
- Énfasis visual en precaución

### 4. **TareaEstadisticosModal**
- Formulario completo con acordeón
- Secciones: General, Metas, Notas
- Validación de campos
- Guardado simulado

## 🚀 Cómo Usar

### Opción 1: Agregar a App.js (Recomendado)

```javascript
// En src/App.js
import ComponentDemo from './Pages/ComponentDemo';

// Agregar ruta
<Route path="/demo" element={<ComponentDemo />} />
```

Luego visita: `http://localhost:3000/demo`

### Opción 2: Reemplazar temporalmente Home

```javascript
// En src/App.js
import ComponentDemo from './Pages/ComponentDemo';

// Reemplazar temporalmente
<Route path="/" element={<ComponentDemo />} />
```

### Opción 3: Ejecutar directamente

```bash
# Crear archivo temporal de prueba
# src/index-demo.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import ComponentDemo from './Pages/ComponentDemo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ComponentDemo />);
```

## 📦 Componentes Demostrados

1. **ConfirmationModal** (`src/components/shared/ConfirmationModal.js`)
   - Props: isOpen, onClose, onConfirm, title, message, confirmText, variant, isLoading
   - Variantes: danger, warning, success, info
   - Características: Animaciones, keyboard support (ESC), backdrop click

2. **TareaEstadisticosModal** (`src/components/Carga/TareaEstadisticosModal.js`)
   - Props: isOpen, onClose, calendarId, calendarName, onSave, initialData
   - Secciones con acordeón
   - Formulario completo
   - Integración con Firestore

3. **Design System** (`src/styles/designSystem.js`)
   - Colores consistentes
   - Espaciado estandarizado
   - Sombras y efectos
   - Tipografía

## 🎨 Diseño Visual

- **Layout**: Grid responsivo
- **Colores**: Gradiente de fondo con colores del sistema
- **Tarjetas**: Hover effects con elevación
- **Botones**: Estados hover con transiciones
- **Iconos**: Lucide React icons

## 🔧 Personalización

Puedes modificar fácilmente:
- Colores de fondo
- Tamaño de tarjetas
- Textos de ejemplo
- Datos iniciales del modal estadístico

## ✅ Próximos Pasos

Una vez que veas los componentes funcionando:

1. **Si te gustan**: Podemos integrarlos en Tarea.js de forma segura
2. **Si quieres cambios**: Modificamos los componentes según tus necesidades
3. **Si quieres más**: Creamos componentes adicionales

## 📝 Notas

- Esta página es completamente independiente
- No afecta Tarea.js en absoluto
- Puedes eliminarla cuando quieras
- Sirve como documentación viva de los componentes
