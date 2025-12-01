# 🔧 GUÍA DE INTEGRACIÓN MANUAL - Tarea.js

## ✅ Preparación
Has visto los componentes funcionando en la demo. Ahora vamos a integrarlos en Tarea.js de forma **100% segura y manual**.

---

## 📋 PASO 1: Agregar Imports

**Ubicación**: Líneas 1-10 de `Tarea.js`

**Busca esta línea** (alrededor de línea 4):
```javascript
import DailyView from "./DailyView";
```

**JUSTO DESPUÉS**, agrega estas 2 líneas:
```javascript
import ConfirmationModal from "../shared/ConfirmationModal";
import TareaEstadisticosModal from "./TareaEstadisticosModal";
```

**Resultado esperado**:
```javascript
import DailyView from "./DailyView";
import ConfirmationModal from "../shared/ConfirmationModal";
import TareaEstadisticosModal from "./TareaEstadisticosModal";
```

✅ **Guarda el archivo** y verifica que no hay errores en la consola.

---

## 📋 PASO 2: Agregar Iconos

**Ubicación**: Alrededor de línea 37-55

**Busca el import de lucide-react** que tiene:
```javascript
import {
  Plus,
  Trash2,
  X,
  Calendar as CalendarIcon,
  // ... más iconos
} from "lucide-react";
```

**Agrega `BarChart3`** a la lista (si no está ya):
```javascript
import {
  Plus,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Loader,
  Zap,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Activity,
  CheckCircle,
  Package,
  Edit,
  Upload,
  Clock,
  AlertTriangle,
  BarChart3,  // <-- AGREGAR ESTA LÍNEA
} from "lucide-react";
```

✅ **Guarda** y verifica.

---

## 📋 PASO 3: Agregar Estado

**Ubicación**: Dentro del componente `Tarea`, alrededor de línea 3310-3320

**Busca esta línea**:
```javascript
const [error, setError] = useState("");
```

**JUSTO DESPUÉS**, agrega estas 4 líneas:
```javascript
// Estados para los nuevos modales
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [calendarToDelete, setCalendarToDelete] = useState(null);
const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
const [statsData, setStatsData] = useState({});
```

**Resultado esperado**:
```javascript
const [error, setError] = useState("");

// Estados para los nuevos modales
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [calendarToDelete, setCalendarToDelete] = useState(null);
const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
const [statsData, setStatsData] = useState({});
```

✅ **Guarda** y verifica.

---

## 📋 PASO 4: Agregar Funciones

**Ubicación**: Después de la función `saveNewCalendar`, alrededor de línea 3385-3395

**Busca el final de `saveNewCalendar`**:
```javascript
  },
  [userId, newCalendarName]
);
```

**JUSTO DESPUÉS**, agrega estas funciones completas:

```javascript
// 🔥 Función para eliminar calendario con confirmación
const handleDeleteCalendar = useCallback(
  async (calendarId) => {
    if (!userId || !calendarId) return;
    
    try {
      // Eliminar todos los eventos del calendario primero
      const eventsRef = getEventsCollectionRef(userId, calendarId);
      if (eventsRef) {
        const eventsSnapshot = await getDocs(eventsRef);
        const deletePromises = eventsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
      }
      
      // Eliminar el calendario
      const calendarsRef = getCalendarsCollectionRef(userId);
      const calendarDocRef = doc(calendarsRef, calendarId);
      await deleteDoc(calendarDocRef);
      
      // Resetear selección si se eliminó el calendario seleccionado
      if (selectedCalendarId === calendarId) {
        setSelectedCalendarId(null);
      }
      
      // Cerrar modal
      setIsDeleteModalOpen(false);
      setCalendarToDelete(null);
    } catch (e) {
      console.error("Error deleting calendar:", e);
      setError("Error al eliminar el registro: " + e.message);
    }
  },
  [userId, selectedCalendarId]
);

// 🔥 Abrir modal de confirmación de eliminación
const openDeleteModal = useCallback((calendarId, calendarName) => {
  setCalendarToDelete({ id: calendarId, name: calendarName });
  setIsDeleteModalOpen(true);
}, []);

// 🔥 Guardar datos estadísticos
const handleSaveStats = useCallback(
  async (calendarId, data) => {
    if (!userId || !calendarId) return;
    
    try {
      // Guardar en Firestore
      const statsRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/calendars/${calendarId}/stats/data`
      );
      await setDoc(statsRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      // Actualizar estado local
      setStatsData(prev => ({
        ...prev,
        [calendarId]: data,
      }));
      
      console.log('✅ Datos estadísticos guardados');
    } catch (e) {
      console.error("Error saving stats:", e);
      throw e;
    }
  },
  [userId]
);
```

✅ **Guarda** y verifica que no hay errores.

---

## 📋 PASO 5: Actualizar Props de CalendarView

**Ubicación**: Donde se llama a `<CalendarView>`, alrededor de línea 4503-4522

**Busca**:
```javascript
<CalendarView
  currentDate={currentDate}
  navigateMonth={navigateMonth}
  // ... más props
  dailyData={dailyData}
/>
```

**Agrega estas 2 props** al final (antes del `/>`):
```javascript
<CalendarView
  currentDate={currentDate}
  navigateMonth={navigateMonth}
  handleDayClick={handleDayClick}
  setSelectedCalendarId={setSelectedCalendarId}
  selectedCalendarId={selectedCalendarId}
  calendars={calendars}
  events={events}
  isAuthReady={isAuthReady}
  setIsCalendarModalOpen={setIsCalendarModalOpen}
  selectedCalendarName={selectedCalendarName}
  globalTotals={globalTotals}
  setIsExportModalOpen={openExportModalInRangeMode}
  openExportModalInSingleDayMode={openExportModalInSingleDayMode}
  dailyData={dailyData}
  handleDeleteCalendar={openDeleteModal}
  openStatsModal={() => setIsStatsModalOpen(true)}
/>
```

✅ **Guarda** y verifica.

---

## 📋 PASO 6: Agregar Modales al Render

**Ubicación**: Al final del componente Tarea, ANTES del último `</div>`, alrededor de línea 4648-4651

**Busca**:
```javascript
        </div>
      </div>
    </div>
  );
};
```

**REEMPLAZA con**:
```javascript
        </div>
      </div>

      {/* Modal de Confirmación para Eliminar */}
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

      {/* Modal de Datos Estadísticos */}
      <TareaEstadisticosModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        calendarId={selectedCalendarId}
        calendarName={selectedCalendarName}
        onSave={handleSaveStats}
        initialData={statsData[selectedCalendarId] || {}}
      />
    </div>
  );
};
```

✅ **Guarda** y verifica.

---

## 📋 PASO 7: Actualizar CalendarView Component

**Ubicación**: Dentro del componente `CalendarView`, alrededor de línea 484-520

**Busca la definición de CalendarView**:
```javascript
const CalendarView = ({
  currentDate,
  navigateMonth,
  // ... props existentes
  dailyData,
}) => {
```

**Agrega las nuevas props**:
```javascript
const CalendarView = ({
  currentDate,
  navigateMonth,
  handleDayClick,
  setSelectedCalendarId,
  selectedCalendarId,
  calendars,
  events,
  dailyData,
  isAuthReady,
  setIsCalendarModalOpen,
  selectedCalendarName,
  globalTotals,
  setIsExportModalOpen,
  openExportModalInSingleDayMode,
  handleDeleteCalendar,  // <-- NUEVA
  openStatsModal,        // <-- NUEVA
}) => {
```

✅ **Guarda** y verifica.

---

## 📋 PASO 8: Agregar Botones en CalendarView

**Ubicación**: Dentro de CalendarView, en el panel de control, alrededor de línea 2350-2380

**Busca el botón "Exportar Día"** (último botón de exportar).

**DESPUÉS de ese botón**, agrega estos 2 botones:

```javascript
{/* Botón de Eliminar Registro */}
<button
  onClick={() => handleDeleteCalendar(selectedCalendarId, selectedCalendarName)}
  disabled={!selectedCalendarId}
  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full mt-4
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

{/* Botón de Datos Estadísticos */}
<button
  onClick={openStatsModal}
  disabled={!selectedCalendarId}
  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full mt-3
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

✅ **Guarda** y verifica.

---

## ✅ VERIFICACIÓN FINAL

Después de completar todos los pasos:

1. **Verifica que no hay errores** en la consola del navegador
2. **Recarga la página** de Tarea.js
3. **Deberías ver**:
   - 🗑️ Botón rojo "Eliminar Registro"
   - 📊 Botón morado "Datos Estadísticos"
4. **Prueba**:
   - Click en "Eliminar Registro" → Modal de confirmación
   - Click en "Datos Estadísticos" → Modal con formulario

---

## 🆘 Si Algo Sale Mal

Si hay errores:
1. **No entres en pánico** 😊
2. **Copia el error** de la consola
3. **Dime en qué paso estás**
4. Te ayudo a solucionarlo

---

## 🎉 ¡Éxito!

Una vez que funcione, tendrás:
- ✅ Eliminación de registros con confirmación
- ✅ Modal estadístico funcionando
- ✅ Diseño moderno y profesional
- ✅ Base para más mejoras

**¿Listo para empezar?** Empieza con el PASO 1 y avísame cuando termines cada paso. 🚀
