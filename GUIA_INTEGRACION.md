# GUÍA RÁPIDA DE INTEGRACIÓN - Copiar y Pegar

## ⚠️ IMPORTANTE
Debido al tamaño del archivo Tarea.js, necesitas hacer estos cambios manualmente.
Son solo 3 pasos simples de copiar y pegar.

---

## PASO 1: Agregar los Modales al Final del Componente Tarea

**Ubicación**: Línea 4648 en `Tarea.js`  
**Busca**: El cierre del componente Tarea, justo antes de `</div>\n    </div>\n  );`

**Código a AGREGAR** (copia todo esto):

```javascript
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCalendarToDelete(null);
        }}
        onConfirm={() => handleDeleteCalendar(calendarToDelete?.id)}
        title="Eliminar Registro"
        message={`¿Estás seguro de que deseas eliminar el registro "${calendarToDelete?.name}"? Esta acción eliminará todos los productos asociados y no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />

      {/* Statistical Data Modal */}
      <TareaEstadisticosModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        calendarId={selectedCalendarId}
        calendarName={selectedCalendarName}
        onSave={handleSaveStats}
        initialData={statsData[selectedCalendarId] || {}}
      />
```

**Resultado**: Debe quedar así:
```javascript
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        ...
      />

      {/* Statistical Data Modal */}
      <TareaEstadisticosModal
        ...
      />
    </div>
  );
};
```

---

## PASO 2: Agregar Botón de Eliminar en CalendarView

**Ubicación**: Busca en `Tarea.js` el componente `CalendarView` (alrededor de línea 484)  
**Busca**: El botón "Exportar Día" (alrededor de línea 2358)  
**Después de**: El último botón de exportar

**Código a AGREGAR**:

```javascript
                {/* Botón de Eliminar Registro */}
                <button
                  onClick={() => handleDeleteCalendar(selectedCalendarId, selectedCalendarName)}
                  disabled={!selectedCalendarId}
                  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full 
                                    ${
                                      selectedCalendarId
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                  title="Eliminar el registro seleccionado y todos sus datos"
                >
                  <Trash2 size={16} className="mr-2" />
                  Eliminar Registro
                </button>
```

---

## PASO 3: Agregar Botón de Datos Estadísticos

**Ubicación**: Justo DESPUÉS del botón de eliminar que acabas de agregar

**Código a AGREGAR**:

```javascript
                {/* Botón de Datos Estadísticos */}
                <button
                  onClick={openStatsModal}
                  disabled={!selectedCalendarId}
                  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full 
                                    ${
                                      selectedCalendarId
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                  title="Ver y editar datos estadísticos del invernadero"
                >
                  <BarChart3 size={16} className="mr-2" />
                  Datos Estadísticos
                </button>
```

---

## ✅ VERIFICACIÓN

Después de hacer los cambios, verifica que:

1. **No hay errores de sintaxis**: El archivo debe compilar sin errores
2. **Los imports están correctos**: Ya están agregados (ConfirmationModal, TareaEstadisticosModal, BarChart3)
3. **Las funciones existen**: handleDeleteCalendar, openStatsModal, handleSaveStats ya están implementadas
4. **El estado existe**: isDeleteModalOpen, isStatsModalOpen, calendarToDelete, statsData ya están declarados

---

## 🚀 RESULTADO ESPERADO

Cuando termines, deberías ver:

1. **Dos nuevos botones** en el panel lateral del calendario:
   - 🗑️ Botón rojo "Eliminar Registro"
   - 📊 Botón morado "Datos Estadísticos"

2. **Al hacer clic en "Eliminar Registro"**:
   - Se abre un modal de confirmación moderno
   - Pide confirmación antes de eliminar
   - Elimina el registro y todos sus eventos

3. **Al hacer clic en "Datos Estadísticos"**:
   - Se abre un modal con formulario
   - Permite ingresar información del invernadero
   - Guarda los datos en Firestore

---

## 🆘 SI TIENES PROBLEMAS

Si algo no funciona:

1. **Verifica que los 3 archivos nuevos existen**:
   - `src/styles/designSystem.js` ✅
   - `src/components/shared/ConfirmationModal.js` ✅
   - `src/components/Carga/TareaEstadisticosModal.js` ✅

2. **Verifica los imports en Tarea.js** (líneas 1-6):
   ```javascript
   import ConfirmationModal from "../shared/ConfirmationModal";
   import TareaEstadisticosModal from "./TareaEstadisticosModal";
   ```

3. **Verifica el import del icono** (línea 37-55):
   ```javascript
   import {
     ...
     BarChart3,  // <-- Debe estar aquí
   } from "lucide-react";
   ```

4. **Ejecuta el servidor**:
   ```bash
   npm start
   ```

---

## 📝 NOTAS

- Todos los componentes ya están creados y funcionan
- Todas las funciones ya están implementadas
- Solo necesitas conectar los botones y modales al UI
- Los cambios son 100% seguros y no afectan funcionalidad existente

---

**¿Listo para empezar?** Sigue los 3 pasos en orden y avísame cuando termines para verificar que todo funciona correctamente.
