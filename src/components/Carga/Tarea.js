import { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
// setDoc es el error 5
// import DailyView from "./DailyView"; // Removed unused component
import ConfirmationModal from "../shared/ConfirmationModal";
import TareaEstadisticosModal from "./TareaEstadisticosModal";
// Desde tu archivo de utilidades (asumiendo la estructura de carpetas anterior)
import { calculateCosts, formatNumber, HOURLY_COST_RATE } from "../../Util/costCalculations"; // calculateCosts es el error 1

import { InlineMath } from "react-katex"; // 👈 ¡NECESARIO!
import "katex/dist/katex.min.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUserId } from "../../features/auth/authSlice/authSlice";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword, // 👈 Para registrar nuevos usuarios
  signInWithEmailAndPassword, // 👈 Para iniciar sesión
  signOut, // 👈 Para cerrar sesión
  setPersistence, // 👈 Para configurar la persistencia
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  X,
  BarChart3,
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
  Filter,
  Clock,
  AlertTriangle,
  Settings,
  Users,
  DollarSign,
  Save,
  PlusCircle,
  Calculator,
  Camera,
  Sheet,
  Edit3,
  TrendingUp,
} from "lucide-react";

// 🔑 CORRECCIÓN 2: Definición de la función getCostsCollectionRef
const getDailyCostsCollectionRef = (userId, calendarId) => {
  return collection(
    db,
    "users",
    userId,
    "calendars",
    calendarId,
    "dailyCosts" // Nueva subcolección para los costes
  );
};

const getDailyCostDocRef = (userId, calendarId, dateKey) => {
  // dateKey debe ser el formato "YYYY-MM-DD"
  return doc(getDailyCostsCollectionRef(userId, calendarId), dateKey);
};

// --- Global Variables (Provided by Canvas Environment) ---
const firebaseConfig = {
  apiKey: "AIzaSyBA8jQcPrJ9FV1_kNt5FreioM8jgOTAcEA",
  authDomain: "calend-e5f32.firebaseapp.com",
  projectId: "calend-e5f32",
  storageBucket: "calend-e5f32.firebasestorage.app",
  messagingSenderId: "960965784873",
  appId: "1:960965784873:web:f79aa27e2c1bcbe0b4b338",
};
const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};
const appId = getAppId();

const initialAuthToken = typeof window.__initial_auth_token !== "undefined";

// Inicialización de Firebase (se realiza una sola vez)
const app =
  Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// Constantes
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Utilidad para obtener referencias de colecciones de Firestore */
const getCalendarsCollectionRef = (userId) => {
  if (!db || !userId) return null;
  return collection(db, `artifacts/${appId}/users/${userId}/calendars`);
};
const getEventsCollectionRef = (userId, calendarId) => {
  if (!db || !userId || !calendarId) return null;
  return collection(
    db,
    `artifacts/${appId}/users/${userId}/calendars/${calendarId}/events`
  );
};

/** Formatea una fecha a 'YYYY-MM-DD' */
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

/** Formatea una fecha a 'YYYY-MM' */
const formatMonthYear = (date) => {
  if (!date) return "";
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  return [year, month].join("-");
};

// =========================================================================
// === Nuevo Componente: Modal de Exportación Global (ExportModal) =========
// =========================================================================

const ExportModal = ({
  isOpen,
  onClose,
  events,
  selectedCalendarName,
  handleGlobalExport,
  isLoadingExport,
  initialMode = "range", // Nuevo prop para modo inicial
}) => {
  const today = formatDate(new Date());

  // --- HOOKS: Deben declararse siempre al principio, sin condiciones ---

  // Modo de exportación: 'range' o 'single'. Usa initialMode al abrir.
  const [exportMode, setExportMode] = useState(initialMode);

  // Estado para Rango
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Estado para Día Único
  const [singleDate, setSingleDate] = useState(today);

  // Opciones de Filtro y Formato
  const [filterPositiveResult, setFilterPositiveResult] = useState(false);
  const [exportFormat, setExportFormat] = useState("CSV");

  // Sincronizar estado del modo al abrir el modal
  useEffect(() => {
    setExportMode(initialMode);
  }, [initialMode, isOpen]);

  // Conteo de días y eventos basado en el modo y filtro (useMemo es un hook, debe ir antes del return condicional)
  const filteredDays = useMemo(() => {
    let dayKeys = [];

    if (exportMode === "range") {
      dayKeys = Object.keys(events)
        .filter((dateKey) => {
          return dateKey >= startDate && dateKey <= endDate;
        })
        .sort();
    } else if (exportMode === "single") {
      if (events[singleDate]) {
        dayKeys = [singleDate];
      }
    }

    // Aplicar filtro de resultado positivo si está activo
    if (filterPositiveResult) {
      dayKeys = dayKeys.filter((dateKey) => {
        const dayEvents = events[dateKey] || [];
        const totalResult = dayEvents.reduce(
          (sum, event) => sum + (event.result || 0),
          0
        );
        return totalResult > 0;
      });
    }

    let totalEvents = 0;
    dayKeys.forEach((dateKey) => {
      totalEvents += (events[dateKey] || []).length;
    });

    return { dayKeys, totalEvents };
  }, [
    events,
    exportMode,
    startDate,
    endDate,
    singleDate,
    filterPositiveResult,
  ]);

  // --- RETURN CONDICIONAL (después de los hooks) ---
  if (!isOpen) return null;

  const handleExport = () => {
    if (filteredDays.dayKeys.length === 0) return;

    // Determinar las fechas a enviar para el nombre del archivo
    const exportStart = exportMode === "range" ? startDate : singleDate;
    const exportEnd = exportMode === "range" ? endDate : singleDate;

    handleGlobalExport({
      startDate: exportStart,
      endDate: exportEnd,
      dayKeys: filteredDays.dayKeys,
      format: exportFormat,
      filterPositiveResult,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Upload size={24} className="mr-2 text-blue-600" />
            Exportar Registros de {selectedCalendarName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Selector de Modo de Exportación */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              1. Seleccionar Modo de Exportación
            </h3>
            <div className="flex space-x-4">
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition flex-1 justify-center ${
                  exportMode === "range"
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="range"
                  checked={exportMode === "range"}
                  onChange={() => setExportMode("range")}
                  className="hidden"
                />
                <CalendarIcon size={20} className="mr-2 text-blue-600" />
                <span className="font-medium text-blue-700">
                  Rango de Fechas
                </span>
              </label>
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition flex-1 justify-center ${
                  exportMode === "single"
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="single"
                  checked={exportMode === "single"}
                  onChange={() => setExportMode("single")}
                  className="hidden"
                />
                <Clock size={20} className="mr-2 text-blue-700" />
                <span className="font-medium text-blue-700">Día Único</span>
              </label>
            </div>
          </div>

          {/* Filtro de Fechas/Día */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              2. Especificar Fechas
            </h3>

            {exportMode === "range" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="startDate"
                  >
                    Desde
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="endDate"
                  >
                    Hasta
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="singleDate"
                >
                  Seleccionar Día
                </label>
                <input
                  type="date"
                  id="singleDate"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Filtro de Resultados */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Filter size={18} className="mr-2 text-purple-600" />
              3. Opciones de Filtro
            </h3>
            <div className="flex items-center">
              <input
                id="filterPositive"
                type="checkbox"
                checked={filterPositiveResult}
                onChange={(e) => setFilterPositiveResult(e.target.checked)}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="filterPositive"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Incluir solo días con Resultado Acumulado ($A \times B$) mayor
                que cero.
              </label>
            </div>
          </div>

          {/* Formato de Exportación */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              4. Seleccionar Formato
            </h3>
            <div className="flex space-x-4">
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                  exportFormat === "CSV"
                    ? "bg-green-100 border-green-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="CSV"
                  checked={exportFormat === "CSV"}
                  onChange={() => setExportFormat("CSV")}
                  className="hidden"
                />
                <FileSpreadsheet size={20} className="mr-2 text-green-600" />
                <span className="font-medium text-green-700">Excel (CSV)</span>
              </label>
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                  exportFormat === "PDF"
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  value="PDF"
                  checked={exportFormat === "PDF"}
                  onChange={() => setExportFormat("PDF")}
                  className="hidden"
                />
                <FileText size={20} className="mr-2 text-red-600" />
                <span className="font-medium text-red-700">PDF</span>
              </label>
            </div>
          </div>

          {/* Resumen y Botón de Acción */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="font-semibold text-blue-800">
              Días a Exportar:{" "}
              <span className="text-xl font-bold">
                {filteredDays.dayKeys.length}
              </span>
            </p>
            <p className="text-sm text-blue-700">
              Productos Totales: {filteredDays.totalEvents}
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={filteredDays.dayKeys.length === 0 || isLoadingExport}
            className={`w-full py-3 font-semibold rounded-lg transition duration-150 shadow-lg text-xl flex items-center justify-center 
                            ${
                              filteredDays.dayKeys.length > 0 &&
                              !isLoadingExport
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50"
                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                            }`}
          >
            {isLoadingExport ? (
              <>
                <Loader size={20} className="animate-spin mr-2" />
                Generando {exportFormat}...
              </>
            ) : (
              `Exportar ${filteredDays.totalEvents} Productos`
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

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
handleDeleteCalendar,
openStatsModal,
}) => {
const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// CORRECCIÓN DE ZONA HORARIA: Utiliza la fecha local (getFullYear, getMonth, getDate)
const formatDate = (date) => {
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
return `${year}-${month}-${day}`;
};

const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDayOfMonth = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const days = [];
const prevMonthDaysTotal = new Date(year, month, 0).getDate();
const startDay = prevMonthDaysTotal - firstDayOfMonth + 1;

// Días del mes anterior
for (let i = startDay; i <= prevMonthDaysTotal; i++) {
if (i > prevMonthDaysTotal - firstDayOfMonth) {
const fullDate = new Date(year, month - 1, i);
days.push({
key: `prev-${i}`,
day: i,
isCurrentMonth: false,
fullDate,
dateKey: formatDate(fullDate),
events: [],
});
}
}

// Días del mes actual
for (let i = 1; i <= daysInMonth; i++) {
const fullDate = new Date(year, month, i);
const dateKey = formatDate(fullDate);
days.push({
key: `curr-${i}`,
day: i,
isCurrentMonth: true,
fullDate,
dateKey,
events: events[dateKey] || [],
});
}

// Días del mes siguiente (para completar la cuadrícula)
let nextDay = 1;
while (days.length < 42) {
const fullDate = new Date(year, month + 1, nextDay);
days.push({
key: `next-${nextDay}`,
day: nextDay,
isCurrentMonth: false,
fullDate,
dateKey: formatDate(fullDate),
events: [],
});
nextDay++;
}

const today = formatDate(new Date());
const selectedCalendarColor =
calendars.find((c) => c.id === selectedCalendarId)?.color || "#3b82f6";

// --- RENDERING (JSX) ---
return (
// 1. Contenedor Principal: Bordes súper redondeados y sombra elevada
<div className="bg-white p-1 sm:p-6 md:p-8 rounded-3xl shadow-2xl shadow-indigo-100 border border-gray-100 transition-all duration-300">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

{/* COLUMNA IZQUIERDA: CALENDARIO (2/3) */}
<div className="lg:col-span-2 flex flex-col space-y-6">
<div className="p-4 bg-white border-2 border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
<h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-100 pb-3 flex items-center gap-2">
🌶️ Vista del Mes - Producción de Pimientos
</h2>

{selectedCalendarId ? (
<>
{/* Navegación del Calendario */}
<div className="flex justify-between items-center mb-6 ">
<button
onClick={() => navigateMonth(-1)}
className="p-3 bg-green-100 hover:bg-green-300 text-green-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
title="Mes Anterior"
>
⬅️
</button>
<h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">
{MONTHS[month]} {year}
</h2>
<button
onClick={() => navigateMonth(1)}
className="p-3 bg-indigo-100 hover:bg-indigo-300 text-indigo-700 rounded-full transition-all duration-300 rotate-180 shadow-lg hover:shadow-xl"
title="Mes Siguiente"
>
⬅️
</button>
</div>

{/* Días de la semana */}
<div className="grid grid-cols-7 text-center font-bold text-green-800 border-b-2 border-green-300 pb-3 mb-1">
{DAYS_OF_WEEK.map((day) => (
<div key={day} className="text-sm sm:text-base p-1">
{day}
</div>
))}
</div>

{/* Grid de Días del Mes */}
<div className="grid grid-cols-7 gap-1 mt-2 p-0">
{days.map((dayData) => {
// Lógica de Cálculo de Métricas Diarias
const eventCount = dayData.events.length;

const dailyTotalResult = dayData.events.reduce(
(sum, event) => sum + (event.result || 0),
0
);

const dailyCostEntry = dailyData[dayData.dateKey]?.costs;
const costPerUnitFinal = parseFloat(dailyCostEntry?.finalResult) || 0;

const isToday = dayData.isCurrentMonth && dayData.dateKey === today;

return (
// Estilos de la celda de día: Compactos y con estilo
<div
key={dayData.key}
onClick={() => handleDayClick(dayData)}
className={`
flex flex-col cursor-pointer transition-all duration-300 rounded-xl p-1 sm:p-2
shadow-md border border-transparent
hover:shadow-lg hover:border-blue-400 hover:scale-[1.02]
relative group h-auto aspect-square

${
dayData.isCurrentMonth
? "bg-white text-gray-800"
: "bg-gray-50 text-gray-400 opacity-70"
}

${
isToday
? "border-2 border-red-500 ring-4 ring-red-200 shadow-xl z-20 bg-red-50 hover:bg-red-100"
: "z-10"
}
`}
>
{/* Número del día */}
<span
className={`font-extrabold text-lg text-right w-full
${dayData.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
${isToday ? "text-red-700" : ""}
`}
>
{dayData.day}
</span>

{/* Contenido Dinámico (Métricas) */}
{eventCount > 0 && (
<div className="flex flex-col items-end px-0 space-y-0.5 opacity-90 group-hover:opacity-100">

{/* 1. INDICADOR DE EVENTO (PUNTO) - SOLO EN MÓVIL */}
<div className="flex justify-end w-full sm:hidden">
<div
className="w-2.5 h-2.5 rounded-full shadow-md ring-2 ring-white"
style={{ backgroundColor: selectedCalendarColor }}
title={`${eventCount} producto(s) registrado(s)`}
></div>
</div>

{/* 2. INFORMACIÓN DETALLADA - OCULTA EN MÓVIL, VISIBLE EN TABLET/ESCRITORIO */}
<div className="hidden sm:flex flex-col items-center w-full space-y-0.5 mt-auto">

{/* Total de Productos Guardados */}
<p className="font-medium text-[8px] sm:text-xs text-gray-700 leading-tight bg-gray-100/70 rounded-full px-2">
{eventCount} Prod(s)
</p>

{/* COSTO DE PRODUCCIÓN POR UNIDAD */}
<p className="font-bold text-[8px] sm:text-xs text-blue-600 leading-tight">
C/u: {costPerUnitFinal > 0 ? `$${costPerUnitFinal.toFixed(4)}` : '$0.0000'}
</p>

{/* TOTAL ACUMULADO DEL DÍA */}
<p className="font-extrabold text-[8px] sm:text-xs text-green-700 leading-tight">
Total: {dailyTotalResult > 0 ? `$${dailyTotalResult.toFixed(2)}` : '$0.00'}
</p>

</div>

</div>
)}

{/* Mensaje sutil si no hay eventos */}
{eventCount === 0 && dayData.isCurrentMonth && (
<p className="text-gray-300 text-[8px] sm:text-[10px] mt-2 text-right invisible group-hover:visible">
Click
</p>
)}
</div>
);
})}
</div>
</>
) : (
// Mensaje cuando no hay registro seleccionado
<div className="p-10 text-center text-gray-500 bg-white rounded-2xl border-dashed border-4 border-gray-200 mt-4 shadow-inner">
📦
<p className="text-xl font-semibold">
Crea un registro para comenzar
</p>
<p className="mt-2">
Selecciona un registro o utiliza el botón Nuevo Registro
en el panel lateral.
</p>
</div>
)}
</div>
</div>

{/* COLUMNA DERECHA: CONTROLES Y TOTALES (1/3) */}
<div className="lg:col-span-1 flex flex-col space-y-8">
{/* Controles Superiores (Select, Export, New, Delete, Stats) */}
<div className="p-5 bg-white border-t-8 border-green-600 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
<h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b-2 border-gray-100 pb-3">
🚜 Gestión del Invernadero
</h3>
<div className="space-y-4">
{/* Selector de Registro */}
<div className="flex flex-col space-y-2">
<label
htmlFor="calendar-select"
className="text-sm font-semibold text-gray-700"
>
Registro Actual:
</label>
<select
id="calendar-select"
value={selectedCalendarId || ""}
onChange={(e) => setSelectedCalendarId(e.target.value)}
className={`w-full p-3 border-2 rounded-xl shadow-inner text-base font-medium transition duration-200
${
selectedCalendarId
? "bg-indigo-50 text-gray-800 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
: "bg-gray-100 text-gray-500 border-dashed border-gray-400"
}`}
disabled={!isAuthReady || calendars.length === 0}
>
{calendars.length === 0 ? (
<option value="">Crea un registro</option>
) : (
calendars.map((c) => (
<option key={c.id} value={c.id}>
{c.name}
</option>
))
)}
</select>
</div>

{/* Botones de Acción */}
<div className="flex flex-col space-y-3 pt-2">
{/* Botón de Nuevo Registro */}
<button
onClick={() => setIsCalendarModalOpen(true)}
className="flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-lg bg-green-600 hover:bg-green-700 text-white w-full transform hover:scale-[1.01]"
title="Crear Nuevo Registro/Calendario"
>
➕
Nuevo Registro
</button>

{/* Botón de Exportar Rango */}
<button
onClick={() => setIsExportModalOpen("range")}
disabled={
!selectedCalendarId || globalTotals?.totalResult === 0
}
className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full transform hover:scale-[1.01]
${
selectedCalendarId && globalTotals?.totalResult > 0
? "bg-blue-600 hover:bg-blue-700 text-white"
: "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}
title="Exportar todos los registros filtrados (Rango de Fechas)"
>
⬆️
Exportar Rango de Fechas
</button>

{/* Botón de Exportar Día Único */}
<button
onClick={openExportModalInSingleDayMode}
disabled={
!selectedCalendarId || globalTotals?.totalResult === 0
}
className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full transform hover:scale-[1.01]
${
selectedCalendarId && globalTotals?.totalResult > 0
? "bg-orange-600 hover:bg-orange-700 text-white"
: "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}
title="Exportar registros de un día específico"
>
🕒
Exportar Día
</button>

{/* 🗑️ BOTÓN ELIMINAR REGISTRO */}
<button
onClick={() =>
// Confirmación de seguridad antes de llamar a la función de eliminación
selectedCalendarId && selectedCalendarName &&
window.confirm(`¿Estás seguro de que quieres ELIMINAR el registro "${selectedCalendarName}" y todos sus datos? Esta acción es irreversible.`) &&
handleDeleteCalendar(selectedCalendarId)
}
disabled={!selectedCalendarId}
className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-lg w-full transform hover:scale-[1.01] mt-4
${
selectedCalendarId
? "bg-red-600 hover:bg-red-700 text-white"
: "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}
title="Eliminar el registro seleccionado y todos sus datos (¡Cuidado!)"
>
🗑️
Eliminar Registro
</button>

{/* 📊 BOTÓN DATOS ESTADÍSTICOS */}
<button
onClick={() => openStatsModal(true)}
disabled={!selectedCalendarId}
className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-lg w-full transform hover:scale-[1.02] mt-3
${
selectedCalendarId
? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-300"
: "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}
title="Ver y editar datos estadísticos del invernadero"
>
📊
Datos Estadísticos
</button>
{/* ---------------------------------- */}
</div>
</div>
</div>

{/* Totales Globales del Registro Seleccionado */}
<div className="p-5 bg-white border-t-8 border-orange-500 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
<h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2 border-b-2 border-gray-100 pb-3">
🧺 Cosecha Total
</h3>
<div className="space-y-4">
<div className="grid grid-cols-2 gap-4">
<div className="p-3 bg-green-100 rounded-xl text-center shadow-inner border-2 border-green-200 hover:border-green-400 transition-colors">
<p className="font-medium text-xs text-green-700 uppercase flex items-center justify-center gap-1">
🌱 Total Valor A
</p>
<p className="font-semibold text-green-900 text-xl mt-1">
{globalTotals?.totalA?.toFixed(2) || "0.00"}
</p>
</div>

<div className="p-3 bg-yellow-100 rounded-xl text-center shadow-inner border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
<p className="font-medium text-xs text-yellow-700 uppercase flex items-center justify-center gap-1">
☀️ Total Valor B
</p>
<p className="font-semibold text-yellow-900 text-xl mt-1">
{globalTotals?.totalB?.toFixed(2) || "0.00"}
</p>
</div>
</div>

<div className="p-4 bg-gradient-to-r from-orange-600 via-red-600 to-red-700 rounded-2xl text-white shadow-xl shadow-orange-300 text-center transform hover:scale-[1.02] transition-transform">
<p className="font-medium text-sm uppercase flex items-center justify-center gap-2">
🌶️ PRODUCCIÓN TOTAL ($A \times B$)
</p>
<p className="font-extrabold text-4xl mt-2">
${globalTotals?.totalResult?.toFixed(2) || "0.00"}
</p>
</div>
</div>
</div>
</div>
</div>
</div>
);
};




const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-4 border-b pb-3">
          <div className="flex items-center">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del mensaje */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};


const ProductList = ({
  eventsForDay,
  deleteEvent,
  loadEventForEdit,
  resetFormAndScroll,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="bg-green-100 p-2 rounded-lg text-green-700">
            📦
          </span>
          Productos Guardados
          <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm font-bold">
            {eventsForDay.length}
          </span>
        </h3>
        <button
          onClick={resetFormAndScroll}
          className="flex items-center px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 shadow-md bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200 hover:scale-105 active:scale-95"
          title="Añadir Nuevo Producto"
        >
          <Plus size={18} className="mr-2" />
          Añadir Nuevo
        </button>
      </div>

      {eventsForDay.length > 0 ? (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow" style={{ maxHeight: '600px' }}>
          {eventsForDay.map((event) => (
            <div
              key={event.id}
              className="group relative p-5 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Encabezado de la Card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-green-700 transition-colors">
                      {event.title}
                    </h4>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Producto Registrado
                    </span>
                  </div>
                </div>
                
                {/* Botones de Acción (Flotantes en Desktop) */}
                <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => loadEventForEdit(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar Producto"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar Producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Imagen del Producto */}
              {event.imageBase64 && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                  <img
                    src={event.imageBase64}
                    alt={`Imagen para ${event.title}`}
                    className="w-full h-32 object-contain mix-blend-multiply"
                  />
                </div>
              )}

              {/* Grid de Datos */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Valor A
                  </p>
                  <p className="font-bold text-gray-800 text-base">
                    {event.valueA?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Valor B
                  </p>
                  <p className="font-bold text-gray-800 text-base">
                    {event.valueB?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white text-center shadow-lg shadow-green-200 transform scale-105">
                  <p className="text-[10px] font-bold text-green-100 uppercase tracking-wide mb-1">
                    Total
                  </p>
                  <p className="font-extrabold text-lg leading-none">
                    ${event.result?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Package size={40} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No hay productos registrados
          </p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Utiliza el formulario para añadir tu primer producto del día.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Convierte un objeto Date a una cadena de fecha simple (YYYY-MM-DD).
 * @param {Date | null} dateObj - El objeto Date a formatear.
 * @returns {string | null} La cadena de fecha formateada o null si no hay fecha.
 */
// const formatDate = (dateObj) => {
//     if (!dateObj) return null;
//     const year = dateObj.getFullYear();
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

// ===================================================
// COMIENZO DEL COMPONENTE
// ===================================================

const CostEditorView = ({
  selectedDate,
  initialCostData,
  handleSaveCosts,
  backToDayView,
  globalCostDivisor,
  setGlobalCostDivisor,
}) => {
  // --- 1. ESTADO: ITEMS DE COSTO (Dinámico) ---
  const getInitialItems = () => {
    if (
      initialCostData?.details &&
      Array.isArray(initialCostData.details) &&
      initialCostData.details.length > 0
    ) {
      return initialCostData.details;
    }

    // Fallback Legacy: Si existen valores antiguos, crea un ítem estándar
    const legacyWorkers = initialCostData?.numWorkers;
    const legacyHours = initialCostData?.hoursWorked;

    if (
      legacyWorkers &&
      legacyWorkers !== 0 &&
      legacyWorkers !== "0" &&
      legacyHours &&
      legacyHours !== 0
    ) {
      return [
        {
          id: Date.now().toString(),
          type: "standard",
          workers: String(legacyWorkers),
          hours: String(legacyHours),
        },
      ];
    }

    // Default: Lista vacía o un ítem estándar vacío
    return [
      {
        id: Date.now().toString(),
        type: "standard",
        workers: "",
        hours: "",
      },
    ];
  };

  const [items, setItems] = useState(getInitialItems());
  const [localDivisor, setLocalDivisor] = useState(
    String(initialCostData?.divisor || globalCostDivisor || "1.0")
  );
  const [newItemType, setNewItemType] = useState("extra_labor");
  const [isSaving, setIsSaving] = useState(false);

  // --- 2. IMAGEN (Manteniendo lógica existente) ---
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImageBase64, setFormImageBase64] = useState(
    initialCostData?.imageBase64 || null
  );

  // Efecto para actualizar cuando cambian props (ej. al cambiar de día)
  useEffect(() => {
    setItems(getInitialItems());
    setLocalDivisor(
      String(initialCostData?.divisor || globalCostDivisor || "1.0")
    );
    setFormImageBase64(initialCostData?.imageBase64 || null);
  }, [initialCostData, globalCostDivisor]);

  // --- 3. HANDLERS DE ITEMS ---
  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      type: newItemType,
      workers: "",
      hours: "",
      machineryName: "",
      machineryCost: "",
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // --- 4. CÁLCULOS (Lógica portada) ---
  const calculateTotals = () => {
    let totalLaborCost = 0;
    let totalMachineryCost = 0;

    items.forEach((item) => {
      const workers = parseFloat(item.workers) || 0;
      const hours = parseFloat(item.hours) || 0;

      // Coste laboral básico
      const laborCost = workers * hours * HOURLY_COST_RATE;
      totalLaborCost += laborCost;

      if (item.type === "machinery") {
        const machineFixed = parseFloat(item.machineryCost) || 0;
        totalMachineryCost += machineFixed;
      }
    });

    const productionCostVariable = totalLaborCost + totalMachineryCost;
    const divisorFloat = parseFloat(localDivisor) || 1.0;

    let finalResult = 0;
    if (divisorFloat > 0) {
      finalResult = productionCostVariable / divisorFloat;
    }

    return {
      totalLaborCost,
      totalMachineryCost,
      productionCostVariable,
      finalResult,
      divisorFloat,
    };
  };

  const {
    totalLaborCost,
    totalMachineryCost,
    productionCostVariable,
    finalResult,
    divisorFloat,
  } = calculateTotals();

  // --- 5. IMAGEN HANDLER ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormImageFile(null);
      setFormImageBase64(null);
    }
  };

  // --- 6. GUARDAR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const dateKey = selectedDate ? formatDate(selectedDate) : null;
    if (!dateKey) {
      console.error("No date key");
      setIsSaving(false);
      return;
    }

    // Compatibilidad Legacy: Usamos el primer item Standard para llenar los campos antiguos
    const standardItem = items.find((i) => i.type === "standard") || items[0];

    const costData = {
      // Legacy fields
      numWorkers: parseFloat(standardItem?.workers) || 0,
      hoursWorked: parseFloat(standardItem?.hours) || 0,
      
      // Nuevos campos
      details: items,
      divisor: divisorFloat,
      
      // Totales calculados (opcional guardarlos)
      totalCost: productionCostVariable,
      finalResult: finalResult,
      
      ...(formImageBase64 && { imageBase64: formImageBase64 }),
    };

    await handleSaveCosts(dateKey, costData);
    setIsSaving(false);
    backToDayView();
  };

  // --- HELPER DE RENDERIZADO DE FILA ---
  const renderItemRow = (item, index) => {
    const isStandard = item.type === "standard";
    return (
      <div
        key={item.id}
        className={`p-4 rounded-xl border-2 mb-3 relative transition-all ${
          isStandard ? "bg-white border-teal-100" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isStandard ? "text-teal-600" : "text-gray-500"
            }`}
          >
            {item.type === "standard"
              ? "👥 Cuadrilla Principal"
              : item.type === "extra_labor"
              ? "👷‍♂️ Trabajadores Extra"
              : "🚜 Maquinaria & Operador"}
          </span>
          {!isStandard && (
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-md transition"
              type="button"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {item.type === "machinery" && (
            <div className="col-span-2 grid grid-cols-2 gap-3 mb-2 pb-3 border-b border-dashed border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tipo Maquinaria
                </label>
                <select
                  value={item.machineryName}
                  onChange={(e) =>
                    handleItemChange(item.id, "machineryName", e.target.value)
                  }
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="tractor">🚜 Tractor</option>
                  <option value="montacarga">🏗️ Montacarga</option>
                  <option value="camion">🚛 Camión</option>
                  <option value="fumigadora">💨 Fumigadora</option>
                  <option value="otro">⚙️ Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Costo Máquina (€)
                </label>
                <input
                  type="number"
                  value={item.machineryCost}
                  onChange={(e) =>
                    handleItemChange(item.id, "machineryCost", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {item.type === "machinery"
                ? "👨‍🔧 N. Operadores"
                : "👨‍🌾 N. Trabajadores"}
            </label>
            <input
              type="number"
              value={item.workers}
              onChange={(e) =>
                handleItemChange(item.id, "workers", e.target.value)
              }
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-teal-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              ⏱ Horas (c/u)
            </label>
            <input
              type="number"
              value={item.hours}
              onChange={(e) => handleItemChange(item.id, "hours", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-teal-500"
              placeholder="0.0"
              step="0.5"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border-t-8 border-teal-600 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <span className="bg-teal-100 p-3 rounded-xl text-teal-700 mr-4 shadow-sm">
            <Settings size={32} />
          </span>
          <div>
            <span className="block text-sm font-semibold text-teal-600 uppercase tracking-widest mb-1">
              Configuración
            </span>
            Costos de Producción
          </div>
        </h2>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500 font-medium">
            Fecha Seleccionada
          </p>
          <p className="text-lg font-bold text-gray-800">
            {selectedDate ? formatDate(selectedDate) : "N/A"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Lista de Items + Divisor */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">
                Desglose de Costos
              </label>
              
              <div className="flex gap-2">
                 <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    className="p-1.5 text-xs border border-gray-300 rounded-lg focus:ring-teal-500"
                  >
                    <option value="extra_labor">👷‍♂️ Extra</option>
                    <option value="machinery">🚜 Maquinaria</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-sm"
                  >
                    <Plus size={14} className="mr-1" /> Agregar
                  </button>
              </div>
            </div>

            {/* LISTA DE ITEMS */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => renderItemRow(item, index))}
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Divisor */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-focus-within:text-yellow-600 transition-colors">
                <Package
                  size={18}
                  className="mr-2 text-gray-400 group-focus-within:text-yellow-500"
                />
                Unidades Producidas (Divisor)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={localDivisor}
                  onChange={(e) => setLocalDivisor(e.target.value)}
                  className="w-full pl-4 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 text-lg font-semibold text-gray-800 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="1.00"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium text-sm">
                    Unidades
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen y Foto */}
          <div className="space-y-6">
            {/* Resumen de Cálculo */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-inner space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200 pb-2">
                Resumen de Costos
              </h4>

              <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                 <div className="bg-green-50 p-2 rounded-lg text-center">
                    <span className="block text-green-700 font-bold mb-1">Mano de Obra</span>
                    <span className="text-lg font-bold text-green-800">${formatNumber(totalLaborCost)}</span>
                 </div>
                 <div className="bg-orange-50 p-2 rounded-lg text-center">
                    <span className="block text-orange-700 font-bold mb-1">Maquinaria</span>
                    <span className="text-lg font-bold text-orange-800">${formatNumber(totalMachineryCost)}</span>
                 </div>
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="text-gray-600 font-medium">
                  Costo Total Diario
                </span>
                <span className="text-2xl font-extrabold text-teal-700">
                  $ {formatNumber(productionCostVariable)}
                </span>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-dashed border-gray-300">
                <span className="text-gray-700 font-bold flex items-center">
                  <DollarSign size={16} className="mr-1 text-yellow-600" />
                  Costo Por Unidad
                </span>
                <span className="text-3xl font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200 shadow-sm">
                  $ {formatNumber(finalResult, 4)}
                </span>
              </div>
            </div>

            {/* Campo Carga de Imagen */}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-center cursor-pointer relative group">
              <input
                id="formImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                {formImageBase64 ? (
                  <div className="relative">
                    <img
                      src={formImageBase64}
                      alt="Vista previa"
                      className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-white ring-2 ring-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">
                        Cambiar Foto
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-1 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-600">
                      Subir Foto de Evidencia
                    </p>
                    <p className="text-xs text-gray-400">(Opcional) JPG, PNG</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={backToDayView}
            className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 w-1/3 sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-4 rounded-xl font-extrabold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-lg shadow-teal-200 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-lg"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Guardando...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Guardar Configuración de Costos
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const EventDetailsView = ({
  selectedDate,
  events,
  dailyCosts, // Contiene { numWorkers, hoursWorked, divisor, totalCost, finalResult } del día
  handleSaveCosts,
  saveEvent,
  formTitle,
  setFormTitle,
  formImageBase64,
  handleImageChange,
  formValueA,
  setFormValueA,
  formValueB,
  setFormValueB,
  multiplicationResult,
  deleteEvent,
  exportToPDF,
  exportToCSV,
  lastSaved,
  setLastSaved,
  currentDate,
  monthlyTotals,
  resetFormAndScroll,
  editingEventId,
  loadEventForEdit,
  // PROPS RELACIONADAS CON COSTOS DESDE TAREA
  globalCostDivisor,
  setGlobalCostDivisor,
  userId,
  calendarId,
  initialNumWorkers,
  initialHoursWorked,
}) => {
  // ESTADO LOCAL PARA SUB-VISTAS
  const [currentView, setCurrentView] = useState("day_view");

  const backToDayView = () => {
    setCurrentView("day_view");
  };

  // Lógica interna
  const dateStr =
    selectedDate?.toLocaleDateString("es-ES", { dateStyle: "full" }) ||
    "Día No Seleccionado";

  // ✅ CORRECCIÓN CLAVE 2: Uso seguro de formatDate
  // Si selectedDate es null, formatDate(null) lanzaría un error.
  const formattedDateKey = selectedDate ? formatDate(selectedDate) : null;
  const eventsForDay = formattedDateKey ? events[formattedDateKey] || [] : [];

  const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const saveButtonText = editingEventId
    ? "Actualizar Producto"
    : "Guardar Producto y Agregar Otro";

  useEffect(() => {
    if (lastSaved) {
      const timer = setTimeout(() => {
        setLastSaved(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, setLastSaved]);

  // 🌟 LÓGICA CLAVE: Determinar si hay datos de costos para mostrar la tarjeta de resumen 🌟
  // Chequea si dailyCosts existe y si tiene valores que no sean cero/nulo para totalCost o finalResult
  const hasCostData =
    dailyCosts &&
    (parseFloat(dailyCosts.numWorkers || 0) > 0 ||
      parseFloat(dailyCosts.hoursWorked || 0) > 0 ||
      parseFloat(dailyCosts.divisor || 0) !== 1.0); // O si el divisor no es el valor por defecto

  const costButtonText = hasCostData
    ? "✏️ Editar Costos"
    : "⚙️ Configurar Costos";

  console.log("DEBUG 1: Objeto monthlyTotals completo:", monthlyTotals);
  console.log(
    "DEBUG 2: Valor del TOTAL ACUMULADO (monthlyTotals.totalResult):",
    monthlyTotals.totalResult
  );

  // ---------------------------------------------------------------------
  // 🚨 RENDERIZADO CONDICIONAL DE VISTAS 🚨
  // ---------------------------------------------------------------------
  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-3xl shadow-inner min-h-full animate-fade-in">
      {/* Renderizado Condicional: Muestra el Editor de Costos o la Vista de Productos */}
      {currentView === "cost_edit" ? (
        // 🔑 1. Renderizar la vista de edición de costos 🔑
        <CostEditorView
          globalCostDivisor={globalCostDivisor}
          setGlobalCostDivisor={setGlobalCostDivisor}
          initialCostData={dailyCosts}
          handleSaveCosts={handleSaveCosts}
          backToDayView={backToDayView}
          selectedDate={selectedDate}
          userId={userId}
          calendarId={calendarId}
        />
      ) : (
        // 2. Renderizar la vista de productos (day_view)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA 1: Formulario para Añadir/Editar Evento (Span 4/12) */}
          <div className="lg:col-span-4 xl:col-span-3 order-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 sticky top-4">
              {/* Encabezado del Formulario */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className={`text-2xl font-black ${editingEventId ? "text-orange-600" : "text-blue-700"} flex items-center`}>
                    {editingEventId ? (
                      <>
                        <Edit size={24} className="mr-2" /> Editar
                      </>
                    ) : (
                      <>
                        <PlusCircle size={24} className="mr-2" /> Nuevo
                      </>
                    )}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                    {editingEventId ? "Modificar existente" : "Registrar Producción"}
                  </p>
                </div>
                
                {editingEventId && (
                  <button
                    onClick={resetFormAndScroll}
                    className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="mb-6 bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase">Fecha:</span>
                <span className="font-bold text-blue-900 text-sm">{dateStr}</span>
              </div>

              {lastSaved && (
                <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 flex items-center font-bold border border-green-200 shadow-sm animate-bounce-in">
                  <CheckCircle size={20} className="mr-2" />
                  <span>{editingEventId ? "Actualizado" : "Guardado"} con éxito</span>
                </div>
              )}

              <form onSubmit={saveEvent} className="space-y-5">
                {/* Campo 1: Título/Nombre del Producto */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    Nombre del Producto <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="formTitle"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-800 font-semibold transition-all"
                    placeholder="Ej: Pimiento Rojo Lote A"
                    required
                  />
                </div>

                {/* Campos de Multiplicación (Valor A y Valor B) */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center">
                    <Calculator size={14} className="mr-1" /> Cálculo de Producción
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Valor A</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formValueA}
                        onChange={(e) => setFormValueA(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-mono font-bold text-gray-800 text-center"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">Valor B</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formValueB}
                        onChange={(e) => setFormValueB(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-mono font-bold text-gray-800 text-center"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-center shadow-lg shadow-purple-200">
                    <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-1">
                      Resultado Total
                    </p>
                    <p className="text-3xl font-black tracking-tight">
                      {multiplicationResult.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Campo 2: Carga y Vista Previa de Imagen */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Evidencia Fotográfica
                  </label>
                  <div className="relative group cursor-pointer">
                    <input
                      id="formImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${formImageBase64 ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                      {formImageBase64 ? (
                        <div className="flex items-center gap-3">
                          <img src={formImageBase64} alt="Preview" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-blue-700">Imagen Seleccionada</p>
                            <p className="text-[10px] text-blue-500">Click para cambiar</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2">
                          <Camera size={20} className="text-gray-400 mb-1" />
                          <span className="text-xs font-bold text-gray-500">Subir Foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-extrabold text-white text-lg shadow-xl transform transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2
                    ${editingEventId 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-200" 
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200"
                    }`}
                >
                  <Save size={20} />
                  {saveButtonText}
                </button>
              </form>
            </div>
          </div>

          {/* COLUMNA 2: Lista de Productos y Resumen (Span 6/12) */}
          <div className="lg:col-span-5 xl:col-span-6 order-2 flex flex-col space-y-6">
            
            {/* Barra de Herramientas */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={exportToPDF}
                  disabled={eventsForDay.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={16} className="mr-2" /> PDF
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={eventsForDay.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sheet size={16} className="mr-2" /> Excel
                </button>
              </div>
              
              <button
                onClick={() => setCurrentView("cost_edit")}
                className={`w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg transition-transform hover:scale-105
                  ${hasCostData ? "bg-teal-600 hover:bg-teal-700 shadow-teal-200" : "bg-gray-800 hover:bg-gray-900 shadow-gray-300"}`}
              >
                {hasCostData ? <Edit3 size={16} className="mr-2" /> : <Settings size={16} className="mr-2" />}
                {costButtonText}
              </button>
            </div>

            {/* 💰 TARJETA DE RESUMEN DE COSTOS DIARIOS 💰 */}
            {hasCostData && (
              <div className="bg-white rounded-2xl shadow-xl border-l-8 border-teal-500 overflow-hidden transform transition-all hover:shadow-2xl">
                <div className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
                  <h3 className="text-teal-800 font-extrabold flex items-center gap-2">
                    <TrendingUp size={20} />
                    Resumen de Costos
                  </h3>
                  <span className="text-xs font-bold text-teal-600 bg-white px-2 py-1 rounded-md shadow-sm">
                    {dailyCosts.numWorkers || 0} Trabajadores
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="text-center border-r border-gray-100 last:border-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Costo Total</p>
                    <p className="text-2xl font-black text-gray-800">${parseFloat(dailyCosts.totalCost || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Costo Unitario</p>
                    <p className="text-2xl font-black text-yellow-600">${parseFloat(dailyCosts.finalResult || 0).toFixed(4)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Productos */}
            <div className="flex-grow">
              <ProductList
                eventsForDay={eventsForDay}
                deleteEvent={deleteEvent}
                loadEventForEdit={loadEventForEdit}
                resetFormAndScroll={resetFormAndScroll}
              />
            </div>
          </div>

          {/* COLUMNA 3: Totales Mensuales (Span 3/12) */}
          <div className="lg:col-span-3 xl:col-span-3 order-3">
            <div className="bg-gradient-to-b from-purple-700 to-indigo-800 p-6 rounded-2xl shadow-2xl text-white sticky top-4">
              <h3 className="text-lg font-bold mb-6 flex items-center border-b border-purple-500 pb-4">
                <CalendarIcon size={20} className="mr-2 text-purple-300" />
                Acumulado Mensual
              </h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">
                    Total General
                  </p>
                  <p className="text-4xl font-black tracking-tight text-white drop-shadow-md">
                    ${monthlyTotals.totalResult.toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-purple-200">Total Valor A</span>
                    <span className="font-bold">{monthlyTotals.totalA.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-purple-500/30 pt-2">
                    <span className="font-medium text-purple-200">Total Valor B</span>
                    <span className="font-bold">{monthlyTotals.totalB.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t border-purple-500">
                  <span className="inline-block bg-purple-900/50 px-3 py-1 rounded-full text-xs font-bold text-purple-200">
                    {MONTH_NAMES[currentDate.getMonth()]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoginMode,
  setIsLoginMode,
  authError,
  isLoadingAuth,
  handleAuth,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
          {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
          className="space-y-4"
        >
          {/* Input de Email */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="ejemplo@correo.com"
            />
          </div>
          {/* Input de Contraseña */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Mensaje de Error */}
          {authError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}

          {/* Botón de Login/Registro */}
          <button
            type="submit"
            disabled={isLoadingAuth}
            className={`w-full py-3 font-bold rounded-lg transition duration-150 shadow-md text-white flex items-center justify-center ${
              isLoadingAuth
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoadingAuth ? (
              <>
                {/* Aquí podrías usar un icono de cargando como Loader */}
                <span className="animate-spin mr-2">🔄</span> Cargando...
              </>
            ) : isLoginMode ? (
              "Entrar"
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        {/* Alternar modo Login/Registro */}
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isLoginMode
            ? "¿No tienes cuenta? Regístrate aquí"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
};

const Tarea = () => {
  // --- Estado de la Aplicación ---
  const [dailyData, setDailyData] = useState({});
  // const [user, setUser] = useState(null); // REMOVED: Managed by Redux
  const userId = useSelector(selectUserId); // ADDED: Use Redux selector
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState(
    localStorage.getItem("selectedGreenhouseId") || null
  );
  const [globalCostDivisor, setGlobalCostDivisor] = useState(() => {
    // Inicializa el estado desde localStorage. Si no existe, usa "1.0".
    // Lo inicializamos como string para un mejor manejo en el input type="text".
    return localStorage.getItem("globalCostDivisor") || "1.0";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // true = Login, false = Registro
  const [authError, setAuthError] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  // Estados clave para el rendimiento y la lógica
  // const [userId, setUserId] = useState(null); // REMOVED: Managed by Redux
  const isAuthReady = true; // ADDED: Assumed ready as App.js handles it
  // const [isAuthReady, setIsAuthReady] = useState(false); // REMOVED
  const [currentView, setCurrentView] = useState("calendar");
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({
    totalA: 0,
    totalB: 0,
    totalResult: 0,
  });
  const [globalTotals, setGlobalTotals] = useState({
    totalA: 0,
    totalB: 0,
    totalResult: 0,
  });
  const [lastSaved, setLastSaved] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formImageBase64, setFormImageBase64] = useState("");
  const [formValueA, setFormValueA] = useState("");
  const [formValueB, setFormValueB] = useState("");
  const [newCalendarName, setNewCalendarName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [calendarToDelete, setCalendarToDelete] = useState(null);
const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
const [statsData, setStatsData] = useState({});
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportModalInitialMode, setExportModalInitialMode] = useState("range");
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const multiplicationResult = useMemo(() => {
    return (parseFloat(formValueA) || 0) * (parseFloat(formValueB) || 0);
  }, [formValueA, formValueB]);

  // REMOVED: onAuthStateChanged listener is no longer needed here as App.js handles it and we use Redux.
  /*
  useEffect(() => {
    if (!auth) return;

    // 1. Configurar la persistencia al inicio
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error(
        "Error al configurar persistencia: ",
        error.code,
        error.message
      );
    });

    // 2. Observar el estado de la autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario logueado (sesión recuperada o recién logueado)
        setUserId(user.uid);
        setIsAuthReady(true);
        setAuthError(null);
      } else {
        // No hay usuario logueado (muestra la UI de Login)
        setUserId(null);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe(); // Limpiar la suscripción al desmontar
  }, [auth]); // Asegúrate de que 'auth' sea una dependencia
  */

  // --- Inicialización y Autenticación de Firebase ---

  // 🟢 FUNCIÓN ESTABLE: Crea el calendario por defecto
  const createDefaultCalendar = useCallback(async () => {
    if (!userId) return;
    try {
      const calendarsRef = getCalendarsCollectionRef(userId);
      const newCalendar = {
        name: "Registro Principal",
        color: "#3b82f6",
        createdAt: new Date(),
      };
      const docRef = await addDoc(calendarsRef, newCalendar);
      setSelectedCalendarId(docRef.id);
    } catch (e) {
      console.error("Error creating default calendar:", e);
    }
  }, [userId]);

  const saveNewCalendar = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userId || !newCalendarName.trim()) return;
      try {
        const calendarsRef = getCalendarsCollectionRef(userId);
        const newCalendar = {
          name: newCalendarName.trim(),
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          createdAt: new Date(),
        };
        const docRef = await addDoc(calendarsRef, newCalendar);
        setSelectedCalendarId(docRef.id);
        setNewCalendarName("");
        setIsCalendarModalOpen(false);
      } catch (e) {
        console.error("Error adding calendar:", e);
      }
    },
    [userId, newCalendarName]
  );

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

  // 🟢 LISTENER PARA CALENDARIOS (Registros) - Evita el bucle
  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const calendarsRef = getCalendarsCollectionRef(userId);
    if (!calendarsRef) return;

    const unsubscribe = onSnapshot(
      calendarsRef,
      (snapshot) => {
        const fetchedCalendars = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCalendars(fetchedCalendars);

        // Usar el callback para setSelectedCalendarId para evitar dependencias circulares
        setSelectedCalendarId((prevId) => {
          if (fetchedCalendars.length === 0) {
            createDefaultCalendar();
            setIsLoading(false);
            return null;
          }

          if (prevId && fetchedCalendars.find((c) => c.id === prevId)) {
            setIsLoading(false);
            return prevId;
          }

          setIsLoading(false);
          return fetchedCalendars[0].id;
        });
      },
      (err) => {
        console.error("Error fetching calendars:", err);
        setError("Error al cargar registros: " + err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();

    // Dependencias limpias: selectedCalendarId se maneja internamente.
  }, [
    isAuthReady,
    userId,
    createDefaultCalendar,
    setSelectedCalendarId,
    setIsLoading,
    setError,
    setCalendars,
  ]);

  useEffect(() => {
    // Solo si el usuario está listo y un calendario está seleccionado
    if (!isAuthReady || !userId || !selectedCalendarId) {
      setDailyData({}); // Limpiar si no hay datos seleccionados
      return;
    }

    // Usamos la referencia a la nueva subcolección de costes
    const costsRef = getDailyCostsCollectionRef(userId, selectedCalendarId);
    if (!costsRef) return;

    // Escuchar la colección de costes en tiempo real
    const unsubscribe = onSnapshot(
      costsRef,
      (snapshot) => {
        const fetchedDailyCosts = {};

        // Mapear los documentos de Firestore a la estructura de estado dailyData
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const dateKey = doc.id; // Asumimos que la fecha es el ID del documento

          fetchedDailyCosts[dateKey] = {
            items: [], // Dejamos vacío, los ítems están en el estado 'events'
            costs: {
              ...data, // Mantener todos los campos (incluyendo details e imageBase64)
              // Convertimos todos los campos numéricos a float para evitar problemas
              numWorkers: parseFloat(data.numWorkers) || 0,
              hoursWorked: parseFloat(data.hoursWorked) || 0,
              divisor: parseFloat(data.divisor) || 1.0,
              totalCost: parseFloat(data.totalCost) || 0,
              finalResult: parseFloat(data.finalResult) || 0,
              costPerHour: data.costPerHour,
            },
          };
        });

        // Actualizar el estado central de los costes
        setDailyData(fetchedDailyCosts);
      },
      (err) => {
        console.error("Error fetching daily costs:", err);
        setError("Error al cargar costes: " + err.message);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, userId, selectedCalendarId, setDailyData, setError]);

  // 🟢 LISTENER PARA EVENTOS (Productos) - Prevención de re-render
  useEffect(() => {
    if (!isAuthReady || !userId || !selectedCalendarId) {
      setEvents({});
      return;
    }

    const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);
    if (!eventsRef) return;

    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        const newEvents = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const dateKey = data.date;

          const eventData = {
            id: doc.id,
            ...data,
            valueA: parseFloat(data.valueA) || 0,
            valueB: parseFloat(data.valueB) || 0,
            result:
              (parseFloat(data.valueA) || 0) * (parseFloat(data.valueB) || 0),
          };

          if (!newEvents[dateKey]) {
            newEvents[dateKey] = [];
          }
          newEvents[dateKey].push(eventData);
        }); // ⚠️ ELIMINAR ESTA COMPROBACIÓN: // if (JSON.stringify(events) !== JSON.stringify(newEvents)) {

        setEvents(newEvents); // }
      },
      (err) => {
        console.error("Error fetching events:", err);
        setError("Error al cargar productos: " + err.message);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, userId, selectedCalendarId, setEvents, setError]);

  useEffect(() => {
    // Asegura que no guardemos valores nulos o indefinidos si el usuario borra todo,
    // pero guardamos el string vacío para que el input se vea vacío.
    // Solo guardamos si no es una cadena vacía, o forzamos '1.0' para evitar problemas en el cálculo.
    if (globalCostDivisor !== "") {
      localStorage.setItem("globalCostDivisor", globalCostDivisor);
    }
  }, [globalCostDivisor]);

  // --- Cálculo de Totales (Estables) ---
  const calculateMonthlyTotals = useCallback(() => {
    const yearMonth = formatMonthYear(currentDate);
    let totalA = 0;
    let totalB = 0;
    let totalResult = 0;

    Object.keys(events).forEach((dateKey) => {
      if (dateKey.startsWith(yearMonth)) {
        events[dateKey].forEach((event) => {
          totalA += event.valueA;
          totalB += event.valueB;
          totalResult += event.result;
        });
      }
    });
    setMonthlyTotals({ totalA, totalB, totalResult });
  }, [events, currentDate]);

  const calculateGlobalTotals = useCallback(() => {
    let totalA = 0;
    let totalB = 0;
    let totalResult = 0;

    Object.keys(events).forEach((dateKey) => {
      events[dateKey].forEach((event) => {
        totalA += event.valueA;
        totalB += event.valueB;
        totalResult += event.result;
      });
    });
    setGlobalTotals({ totalA, totalB, totalResult });
  }, [events]);

  useEffect(() => {
    calculateMonthlyTotals();
    calculateGlobalTotals();
  }, [events, currentDate, calculateMonthlyTotals, calculateGlobalTotals]);

  // 🟢 CORRECCIÓN DE NAVEGACIÓN: handleDayClick
  const handleDayClick = (dayData) => {
    if (!dayData.isCurrentMonth) {
      setCurrentDate(dayData.fullDate);
    }

    // 🔑 CLAVE: Estas dos líneas restauran la navegación
    setSelectedDate(dayData.fullDate);
    setCurrentView("details");

    setEditingEventId(null);
    resetFormAndScroll();
  };

  const handleSave = async (dateKey, items, costData = null) => {
    /* ... */
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormImageBase64("");
    }
  };
  const navigateMonth = (amount) => {
    // Usamos el callback del setter para asegurar que trabajamos con el estado más reciente
    setCurrentDate((prevDate) => {
      // Creamos una nueva fecha para no mutar el objeto de estado anterior
      const newDate = new Date(prevDate);

      // Obtenemos el mes actual y le sumamos la cantidad (1 para avanzar, -1 para retroceder)
      newDate.setMonth(newDate.getMonth() + amount);

      // Al modificar el mes, React detectará que 'newDate' es un objeto diferente,
      // lo que forzará el re-renderizado del <CalendarView/>
      return newDate;
    });
  };

  const handleAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      if (isLoginMode) {
        // Modo Login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Modo Registro
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Limpia el formulario al tener éxito
      setEmail("");
      setPassword("");
    } catch (error) {
      // Manejo de errores comunes (puedes expandir este bloque)
      let errorMessage = "Ocurrió un error de autenticación.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado. Revisa tu email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta.";
      } // ... y más errores
      setAuthError(errorMessage);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const backToCalendar = () => {
    setCurrentView("calendar");
    setSelectedDate(null);
    resetFormAndScroll();
  };

  const resetFormAndScroll = useCallback(() => {
    setEditingEventId(null);
    setFormTitle("");
    setFormImageBase64("");
    setFormValueA("");
    setFormValueB("");

    if (currentView === "details") {
      const formContainer = document.getElementById("product-form-container");
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentView]);

  const loadEventForEdit = useCallback((event) => {
    setEditingEventId(event.id);
    setFormTitle(event.title);
    setFormImageBase64(event.imageBase64 || "");
    setFormValueA(event.valueA.toString());
    setFormValueB(event.valueB.toString());

    const formContainer = document.getElementById("product-form-container");
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const saveEvent = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedDate || !selectedCalendarId || !formTitle.trim()) return;

      const dateKey = formatDate(selectedDate);

      const eventData = {
        date: dateKey,
        title: formTitle.trim(),
        imageBase64: formImageBase64,
        valueA: parseFloat(formValueA) || 0,
        valueB: parseFloat(formValueB) || 0,
        createdAt: new Date(),
      };

      try {
        const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);

        if (editingEventId) {
          const eventDocRef = doc(eventsRef, editingEventId);
          await updateDoc(eventDocRef, eventData);
          setLastSaved("Producto");
          resetFormAndScroll();
        } else {
          await addDoc(eventsRef, eventData);
          setLastSaved("Producto");
          resetFormAndScroll();
        }
      } catch (e) {
        console.error("Error saving event:", e);
        setError("Error al guardar el producto: " + e.message);
      }
    },
    [
      userId,
      selectedDate,
      formTitle,
      selectedCalendarId,
      formImageBase64,
      formValueA,
      formValueB,
      editingEventId,
      resetFormAndScroll,
    ]
  );

  const handleSaveCosts = useCallback(
    async (dateKey, costDataToSave) => {
      // 1. Convertir el divisor a número flotante de forma segura
      const finalDivisor = parseFloat(costDataToSave.divisor) || 1.0;

      // 2. Preparar los datos finales para la base de datos (DB)
      const finalCostData = {
        ...costDataToSave,
        divisor: finalDivisor,
        updatedAt: new Date(),
      };

      try {
        // 3. 🚨 CORRECCIÓN DEL ERROR 'no-undef': DEFINIR docRef
        const docRef = getDailyCostDocRef(userId, selectedCalendarId, dateKey);

        // 4. 💾 GUARDAR EN FIRESTORE
        // Usamos { merge: true } para no sobrescribir otros campos del día (como los eventos)
        await setDoc(docRef, finalCostData, { merge: true });

        console.log(`✅ Costes guardados en Firestore para: ${dateKey}`);

        // 5. 🌐 SINCRONIZACIÓN DE ESTADO: ACTUALIZAR EL DIVISOR GLOBAL
        // Esto actualiza el divisor que se usa en cálculos futuros.
        const newDivisorString = String(finalDivisor);
        setGlobalCostDivisor(newDivisorString);
        localStorage.setItem("globalCostDivisor", newDivisorString); // Persistencia local

        // 6. ♻️ SINCRONIZACIÓN DE ESTADO: ACTUALIZAR dailyData
        // Esto fuerza al componente padre y a <EventDetailsView/> a re-renderizarse
        // con los nuevos datos al instante.
        setDailyData((prevDailyData) => ({
          ...prevDailyData,
          [dateKey]: {
            // Mantiene el resto de datos del día si existen (items/eventos)
            ...(prevDailyData[dateKey] || { items: [] }),
            costs: finalCostData, // ⬅️ Sobrescribe los costos con los datos frescos
          },
        }));
      } catch (error) {
        console.error("❌ Error al guardar costes en DB/Estado:", error);
      }
    },
    // 7. Dependencias del useCallback
    [
      userId,
      selectedCalendarId,
      getDailyCostDocRef,
      setDailyData,
      setGlobalCostDivisor,
    ]
  );

  // 🌟 NUEVA FUNCIÓN: Obtener los datos de Coste del día 🌟
  const getDailyCosts = useCallback(
    (date) => {
      if (!date) return {};
      const dateKey = formatDate(date); // Asume que formatDate está definida

      const defaultCosts = {
        numWorkers: 0,
        hoursWorked: 0,
        // Usar globalCostDivisor como fallback, convertido a float
        divisor: parseFloat(globalCostDivisor) || 1.0,
        totalCost: 0,
        finalResult: 0,
      };

      // Retorna los costos del día o los costos por defecto
      return dailyData[dateKey]?.costs || defaultCosts;
    },
    [dailyData, globalCostDivisor]
  );

  const dailyCosts = useMemo(() => {
    return getDailyCosts(selectedDate);
  }, [selectedDate, getDailyCosts]);

  const deleteEvent = useCallback(
    async (eventId) => {
      if (!selectedCalendarId || !eventId) return;

      const confirmation = window.confirm(
        "¿Estás seguro de que quieres eliminar este producto?"
      );
      if (!confirmation) return;

      try {
        const eventsRef = getEventsCollectionRef(userId, selectedCalendarId);
        const eventDocRef = doc(eventsRef, eventId);
        await deleteDoc(eventDocRef);
      } catch (e) {
        console.error("Error deleting event:", e);
        setError("Error al eliminar el producto: " + e.message);
      }
    },
    [userId, selectedCalendarId]
  );

  const selectedCalendarName = useMemo(
    () =>
      calendars.find((c) => c.id === selectedCalendarId)?.name ||
      "Sin Registro",
    [calendars, selectedCalendarId]
  );

  // --- Exportación (Funciones y Handlers) ---
  const loadJsPDF = useCallback(() => {
    /* ... */
  }, []);
  const exportToPDF = useCallback(async () => {
    /* ... */
  }, [
    selectedDate,
    events,
    loadJsPDF,
    selectedCalendarName,
    selectedCalendarId,
  ]);
  const exportToCSV = useCallback(() => {
    /* ... */
  }, [selectedDate, events, selectedCalendarName, selectedCalendarId]);

  const openExportModalInSingleDayMode = () => {
    setExportModalInitialMode("single");
    setIsExportModalOpen(true);
  };

  const openExportModalInRangeMode = () => {
    setExportModalInitialMode("range");
    setIsExportModalOpen(true);
  };

  const handleGlobalExport = useCallback(
    async ({ startDate, endDate, dayKeys, format, filterPositiveResult }) => {
      /* ... */
    },
    [events, selectedCalendarName, loadJsPDF]
  );
  const performGlobalCSVExport = (data, startDate, endDate) => {
    /* ... */
  };
  const performGlobalPDFExport = async (data, startDate, endDate) => {
    /* ... */
  };

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={32} />
        <p className="ml-3 text-lg text-gray-700">Cargando aplicación...</p>
      </div>
    );
  }

  // 2. Manejo del Estado de Autenticación (¡NUEVO!)
  if (!isAuthReady) {
    // ⚠️ Si la autenticación aún está cargando o verificando la sesión
    return (
      <div className="text-center p-10 flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={32} />
        <p className="mt-4 text-lg text-gray-700">Verificando sesión...</p>
      </div>
    );
  }

  // 3. Mostrar Formulario de Login
  if (!userId) {
    // 🛑 Muestra el formulario de autenticación si NO hay userId
    return (
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoginMode={isLoginMode}
        setIsLoginMode={setIsLoginMode}
        authError={authError}
        isLoadingAuth={isLoadingAuth}
        handleAuth={handleAuth}
      />
    );
  }



return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      {/* --- Botón de Cierre de Sesión --- */}
      {/* <div className="max-w-full lg:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto flex justify-end mb-4 px-4 sm:px-0">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
        >
          Cerrar Sesión
        </button>
      </div> */}
      {/* ------------------------------------------- */}

      {/* Modal para Crear Calendario */}
      <div
        className={`fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center ${
          isCalendarModalOpen ? "" : "hidden"
        }`}
      >
        <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-2xl transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">
              Crear Nuevo Registro
            </h2>
            {/* El ícono X debe estar importado */}
            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={saveNewCalendar} className="space-y-4">
            <input
              type="text"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Nombre del Registro (Ej: Ventas 2024)"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg"
            >
              Crear Registro
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Exportación Global/Día Único */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        events={events}
        selectedCalendarName={selectedCalendarName}
        handleGlobalExport={handleGlobalExport}
        isLoadingExport={isLoadingExport}
        initialMode={exportModalInitialMode}
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

      {/* 🔑 CONTENEDOR PRINCIPAL DEL CALENDARIO Y TÍTULO */}
      <div className="max-w-full lg:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto">
        {/* Contenedor del Título y Botón de Retroceso (Mejorado para móvil) */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 px-4 sm:px-0">
          {currentView === "details" && (
            <button
              onClick={backToCalendar}
              className="mb-4 sm:mb-0 mr-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition shadow-md self-start sm:self-auto"
              title="Volver al calendario"
            >
              {/* El ícono ArrowLeft debe estar importado */}
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center flex-wrap">
            {/* El ícono CalendarIcon debe estar importado */}
            <CalendarIcon
              className="mr-3 text-blue-600 flex-shrink-0"
              size={36}
            />
            <span className="truncate flex-1 min-w-0">
              {selectedCalendarName}
            </span>
            {currentView === "calendar" && (
              <span className="text-xl text-gray-400 ml-0 sm:ml-3 mt-1 sm:mt-0 w-full sm:w-auto">
                {/* Asegúrate de que MONTHS esté definido/importado */}
                | {MONTHS && MONTHS[currentDate?.getMonth()]}{" "}
                {currentDate?.getFullYear()}
              </span>
            )}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 font-medium border border-red-300 mx-4 sm:mx-0">
            {error}
          </div>
        )}

        {/* Renderizado Condicional de Vistas */}
        <div className="w-full overflow-x-auto">
          {currentView === "calendar" ? (
            <CalendarView
              // Aseguramos que CalendarView ocupe todo el ancho disponible
              className="w-full"
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

            
          ) : (
            <EventDetailsView
              selectedDate={selectedDate}
              userId={userId}
              calendarId={selectedCalendarId}
              globalCostDivisor={globalCostDivisor}
              setGlobalCostDivisor={setGlobalCostDivisor}
              dailyCosts={getDailyCosts(selectedDate)}
              handleSaveCosts={handleSaveCosts}
              events={events}
              saveEvent={saveEvent}
              formTitle={formTitle}
              setFormTitle={setFormTitle}
              formImageBase64={formImageBase64}
              handleImageChange={handleImageChange}
              formValueA={formValueA}
              setFormValueA={setFormValueA}
              formValueB={formValueB}
              setFormValueB={setFormValueB}
              multiplicationResult={multiplicationResult}
              deleteEvent={deleteEvent}
              exportToPDF={exportToPDF}
              exportToCSV={exportToCSV}
              lastSaved={lastSaved}
              setLastSaved={setLastSaved}
              currentDate={currentDate}
              monthlyTotals={monthlyTotals}
              resetFormAndScroll={resetFormAndScroll}
              editingEventId={editingEventId}
              loadEventForEdit={loadEventForEdit}
            />
          )}
        </div>

        {/* Bloque de ID de Usuario */}
        <div className="mt-8 pt-4 border-t border-gray-200 px-4 sm:px-0">
          <p className="text-xs text-gray-400">
            <span className="font-semibold">ID de Usuario:</span>
            <span className="truncate font-mono text-gray-500 ml-1">
              {userId || "N/A (Error de autenticación)"}
            </span>
          </p>
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


export default Tarea;
