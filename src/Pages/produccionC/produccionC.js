import React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { FaFileCsv } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

// 🎯 IMPORTACIÓN DE COMPONENTES EXTERNOS
import CostEditForm from "../../components/CostEditForm";
import CalendarGrid from "../../components/CalendarGrid";
import ProductItemForm from "../../components/ProductItemForm";
import DayProductsGrid from "../../components/DayProductsGrid";
import DatosEstadisticosCard from "./DatosEstadisticosCard";
import GreenhouseSelector from "../../components/GreenhouseSelector"; // Nuevo Componente
import HomeContent from "../../components/HomeContent.js/HomeContent";
// 🔥 REEMPLAZA ESTO CON TU CONFIGURACIÓN REAL DE FIREBASE 🔥
import { firebaseConfig } from "../../firebaseConfig";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// =======================================================================
// === CONFIGURACIÓN Y UTILIDADES
// =======================================================================

const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};

const appId = getAppId();

const GREENHOUSE_STORAGE_KEY = `${appId}_selected_greenhouse_id`;

const REPORT_CONFIG = {
  COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
  REPORT_TITLE: "Finca Balsicas Producción S.A.",
  LOGO_URL:
    "data:image/png;base64,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",
};
const isProduction = process.env.NODE_ENV === "production";
const LOCAL_URL = "http://localhost:4500/api/upload/image";
const PRODUCTION_URL =
  "https://gestion-horticultura.netlify.app/api/upload/image";
const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DATOS FIJOS Y CONSTANTES ---
const HOURLY_COST_RATE = 10;
const PRODUCT_CATALOG = {
  "IFCO 6410": 10,
  "IFCO 4312": 5,
  CARTON: 8,
  "NARANJA 2°": 16,
  "SAMPER 1°": 12,
  "SAMPER 2°": 15,
};

// --- FUNCIONES DE UTILIDAD ---

const formatNumber = (num, decimales = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  return Number(num).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: true,
  });
};
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const calculateResult = (productName, factorB) => {
  const factorA = PRODUCT_CATALOG[productName] || 0;
  const b = parseFloat(factorB) || 0;
  return (factorA * b).toFixed(2);
};

const calculateCosts = (dailyTotal, numWorkers, hoursWorked) => {
  const dailyLaborCost =
    (parseFloat(numWorkers) || 0) *
    (parseFloat(hoursWorked) || 0) *
    HOURLY_COST_RATE;
  const productionCostVariable = parseFloat(dailyLaborCost).toFixed(2);

  let finalProductionCost = 0;
  if (dailyTotal > 0) {
    finalProductionCost = (dailyLaborCost / dailyTotal).toFixed(4);
  }

  return { productionCostVariable, finalProductionCost };
};

const exportToCsv = (dailyData, dateKeyToExport = null) => {
  // Si no se proporciona una clave, no podemos exportar.
  if (!dateKeyToExport || !dailyData[dateKeyToExport]) {
    toast.error("Selecciona un día con datos para exportar.");
    return;
  }

  const data = dailyData[dateKeyToExport];
  const dateDisplay = dateKeyToExport; // Formato YYYY-MM-DD

  // 1. Definir las cabeceras del CSV
  const headers = [
    "Fecha",
    "Nombre Producto",
    "Peso (kg)",
    "Cajas",
    "Produccion Total (kg)",
    "Costo Final (€/kg)",
  ].join(";"); // Usamos el punto y coma (;) como separador para compatibilidad

  // 2. Mapear los datos de los productos
  const csvRows = data.items.map((item) => {
    const row = [
      dateDisplay,
      item.productName || "N/A",
      parseFloat(item.factorA || 0)
        .toFixed(2)
        .replace(".", ","), // Usar coma para decimales
      parseFloat(item.factorB || 0)
        .toFixed(2)
        .replace(".", ","),
      parseFloat(item.result || 0)
        .toFixed(2)
        .replace(".", ","),
      Number(data.finalProductionCost || 0)
        .toFixed(2)
        .replace(".", ","),
    ];
    return row.join(";");
  });

  // 3. Unir cabeceras y filas
  const csvContent = [headers, ...csvRows].join("\n");

  // 4. Crear y descargar el archivo
  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: "text/csv;charset=utf-8;",
  }); // Se añade BOM para codificación UTF-8
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Reporte_Produccion_${dateDisplay}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Datos de ${dateDisplay} exportados correctamente a CSV. 📥`);
};

const exportAllToCsv = (dailyData) => {
  // 🔑 CORRECCIÓN: Inicialización de seguridad. Si dailyData es null o undefined, usa un objeto vacío {}.
  const data = dailyData || {};

  // 1. Verificar si hay datos
  // Ahora Object.keys se llama de forma segura sobre 'data'
  const allDateKeys = Object.keys(data).filter(
    (key) => data[key] && data[key].items?.length > 0
  );

  if (allDateKeys.length === 0) {
    // Asumiendo que 'toast' está disponible en el scope
    toast.error("No hay datos registrados en el calendario para exportar.");
    return;
  }

  // 2. Definir las cabeceras del CSV
  const headers = [
    "Fecha",
    "Nombre Producto",
    "Peso (kg)",
    "Cajas",
    "Produccion Total Producto (kg)",
    "Coste Final Diario (€/kg)",
    "Coste Laboral Diario (€)",
    "Total Produccion Dia (kg)",
  ].join(";");

  let csvRows = [];

  // 3. Iterar sobre CADA DÍA en dailyData
  allDateKeys.forEach((dateKey) => {
    const dayData = data[dateKey]; // Usamos la variable 'data' segura
    const dateDisplay = dateKey; // Formato YYYY-MM-DD

    // Variables globales del día
    const costeFinalDia = Number(dayData.finalProductionCost || 0)
      .toFixed(2)
      .replace(".", ",");
    const costeLaboralDia = Number(dayData.productionCostVariable || 0)
      .toFixed(2)
      .replace(".", ",");

    const totalProduccionDia = dayData.items
      .reduce((sum, item) => sum + parseFloat(item.result || 0), 0)
      .toFixed(2)
      .replace(".", ",");

    // 4. Mapear los datos de los productos de CADA DÍA
    dayData.items.forEach((item) => {
      // dayData.items es seguro aquí gracias al filtro inicial
      const row = [
        dateDisplay,
        item.productName || "N/A",
        parseFloat(item.factorA || 0)
          .toFixed(2)
          .replace(".", ","),
        parseFloat(item.factorB || 0)
          .toFixed(2)
          .replace(".", ","),
        parseFloat(item.result || 0)
          .toFixed(2)
          .replace(".", ","),
        costeFinalDia,
        costeLaboralDia,
        totalProduccionDia,
      ];
      csvRows.push(row.join(";"));
    });
  });

  // 5. Unir cabeceras y filas
  const csvContent = [headers, ...csvRows].join("\n");

  // 6. Crear y descargar el archivo
  // La adición de [0xef, 0xbb, 0xbf] es para el BOM (Byte Order Mark), asegurando compatibilidad con caracteres especiales y Excel.
  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const today = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `Reporte_Produccion_GLOBAL_${today}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Asumiendo que 'toast' está disponible en el scope
  toast.success(
    `Exportación global completada: ${csvRows.length} líneas de producto descargadas. 💾`
  );
};

const uploadImages = async (imagesToUpload, uploadUrl) => {
  const uploadedUrls = [];
  for (const item of imagesToUpload) {
    try {
      console.log(`Subiendo imagen ${item.id} a: ${uploadUrl}`);

      uploadedUrls.push({ id: item.id, url: item.imageUrl });
      // FIN SIMULACIÓN
    } catch (error) {
      console.error(`Error al subir la imagen ${item.id}:`, error);
      toast.error(`Error al subir la imagen ${item.id}.`);
      uploadedUrls.push({ id: item.id, url: item.imageUrl }); // Mantener el Base64 si falla
    }
  }

  return uploadedUrls;
};


const getGreenhousesListRef = (dbInstance, userId) => {
  return doc(
    dbInstance,
    `artifacts/${appId}/users/${userId}/greenhouse_list/meta`
  );
};

// Ruta a los datos diarios de un invernadero
const getDocRef = (dbInstance, userId, greenhouseId) => {
  return doc(
    dbInstance,
    `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/daily_data/data`
  );
};

// Ruta a la configuración/meta global de un invernadero
const getGoalRef = (dbInstance, userId, greenhouseId) => {
  return doc(
    dbInstance,
    `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/config/config_doc`
  );
};



const InlineGoalInput = ({ globalGoal, updateGoal, formatNumber }) => {
  const [goal, setGoal] = useState(globalGoal.goal || 0);
  const [deadline, setDeadline] = useState(globalGoal.deadline || "");

  useEffect(() => {
    setGoal(globalGoal.goal || 0);
    setDeadline(globalGoal.deadline || "");
  }, [globalGoal]);
  const handleSave = () => {
    updateGoal(goal, deadline);
  };
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">
        Establecer Meta Global (Kg)
      </h3>
      <div className="space-y-3">
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
          placeholder="Ej: 50000"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
        />
        <button
          onClick={handleSave}
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Guardar Meta
        </button>
      </div>
    </div>
  );
};

const InlineGlobalGoalTracker = ({
  globalGoal,
  dailyTotalSum,
  formatNumber,
}) => {
  const target = parseFloat(globalGoal.goal) || 0;
  const progress = dailyTotalSum;
  const remaining = target - progress;
  const percentage = target > 0 ? (progress / target) * 100 : 0;
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const deadlineDate = globalGoal.deadline
    ? new Date(globalGoal.deadline)
    : null;
  const isPastDeadline = deadlineDate && deadlineDate < new Date();
  // Clase para el color de la barra de progreso
  const progressColor = safePercentage >= 100 ? "bg-green-500" : "bg-teal-500";

  // Icono dinámico para el estado
  const StatusIcon = ({ isComplete, isNegative }) => {
    if (isComplete) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (isNegative) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    );
  };

  return (
    <div className="p-6 rounded-xl shadow-xl border-l-4 border-teal-500 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
      {/* HEADER Y META */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-teal-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2 text-teal-500 animate-pulse-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Seguimiento de Meta
        </h3>
        <span className="text-2xl font-extrabold text-teal-600">
          {formatNumber(target)} Kg
        </span>
      </div>

      {/* DETALLE DE FECHA LÍMITE */}
      {globalGoal.deadline && (
        <div className="flex justify-between items-center text-sm font-medium mb-4">
          <p className="text-gray-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Fecha Límite:
          </p>
          <p
            className={`${
              isPastDeadline ? "text-red-600 font-bold" : "text-gray-700"
            }`}
          >
            {globalGoal.deadline} {isPastDeadline && "(Vencida)"}
          </p>
        </div>
      )}

      {/* BARRA DE PROGRESO */}
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold text-gray-700">Progreso:</span>

          <span
            className={`text-sm font-bold ${
              safePercentage >= 100 ? "text-green-600" : "text-teal-600"
            }`}
          >
            {formatNumber(safePercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${safePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* RESULTADO (Diferencia) - Usando Grid para Responsividad */}
      <div
        className={`mt-6 p-4 rounded-xl flex items-center justify-between space-x-4
            ${
              remaining <= 0
                ? "bg-green-100 border border-green-300"
                : "bg-orange-100 border border-orange-300"
            }`}
      >
        {/* Ícono de Estado */}
        <div
          className={`flex-shrink-0 p-2 rounded-full shadow-lg ${
            remaining <= 0 ? "bg-green-500" : "bg-orange-500"
          }`}
        >
          <StatusIcon isComplete={remaining <= 0} isNegative={remaining > 0} />
        </div>

        {/* Texto de Estado */}
        <div className="flex-grow min-w-0">
          <p className="font-bold text-base md:text-lg truncate">
            {remaining <= 0 ? "¡Meta Superada!" : "Producción Restante:"}
          </p>
          <p className="text-2xl font-extrabold">
            {formatNumber(Math.abs(remaining))}
            <span className="text-lg font-normal ml-1">Kg</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthScreen = ({ app }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Error de autenticación:", err);
      let errorMessage = "Ocurrió un error. Verifica tu correo/contraseña.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        errorMessage = "Correo o contraseña inválidos.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya está registrado.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "El formato del correo electrónico es inválido.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl border border-indigo-100">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
            placeholder="ejemplo@dominio.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
        >
          {loading ? "Cargando..." : isLogin ? "Acceder" : "Registrar"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition"
        >
          {isLogin
            ? "¿No tienes cuenta? Regístrate aquí."
            : "¿Ya tienes cuenta? Inicia sesión aquí."}
        </button>
      </div>
    </div>
  );
};

const DayEditForm = ({
  dateKey,
  dailyData,
  handleItemChange,
  handleItemBlur,
  addItem,
  deleteItem,
  handleDayClick,
  handleSave,
  uploadImages,
  formatNumber,
  // 🚨 CORRECCIÓN: Agregar la URL de subida a las props
  uploadUrl,
}) => {
  // --- 1. Obtención y Estabilización de Datos (usando dayData) ---
  const dayData = dailyData[dateKey] || { items: [] };

  // ✅ CORRECCIÓN ESLINT: Estabiliza la referencia de 'items'
  const items = useMemo(() => {
    return dayData.items || [];
  }, [dayData.items]);

  // ✅ Estabiliza el cálculo del total (depende de la referencia estable de items)
  const dailyTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
  }, [items]);

  // --- 2. Estado Local ---
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- 3. Lógica de Guardado Local ---
  const handleSaveLocal = async () => {
    setIsSaving(true);

    // Identificar imágenes Base64 para subir
    const imagesToUpload = items.filter(
      (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
    );
    console.log("Imágenes a subir:", imagesToUpload);

    if (imagesToUpload.length > 0) {
      setUploading(true);
      try {
        // 🚨 CORRECCIÓN: Usar la prop 'uploadUrl'
        const uploadedUrls = await uploadImages(imagesToUpload, uploadUrl);

        const updatedItems = items.map((item) => {
          const uploaded = uploadedUrls.find(
            (urlItem) => urlItem.id === item.id
          );
          if (uploaded) {
            return { ...item, imageUrl: uploaded.url };
          }
          return item;
        });

        await handleSave(dateKey, updatedItems);
      } catch (error) {
        console.error("Error al subir imágenes o guardar:", error);
        toast.error("Error al guardar: Las imágenes no se pudieron subir.");
      } finally {
        setUploading(false);
      }
    } else {
      // Guardar sin subir imágenes
      await handleSave(dateKey, items);
    }

    setIsSaving(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
      <button
        onClick={() => handleDayClick(dateKey, "day_view")}
        className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Volver a la vista del día
      </button>
      <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
        Editar Productos del Día: {dateKey}
      </h2>

      {/* Total Actualizado */}
      <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
        <p className="text-xl font-semibold text-green-800">
          Total Producción (Kg) Actual:
        </p>
        <p className="text-3xl font-extrabold text-green-700">
          {formatNumber(dailyTotal)} Kg
        </p>
      </div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <ProductItemForm
            key={item.id}
            item={item}
            index={index}
            handleItemChange={handleItemChange}
            handleItemBlur={() => {}}
            deleteItem={deleteItem}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
        <button
          onClick={addItem}
          className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold
                    rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
          disabled={isSaving}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Añadir Producto
        </button>
        <button
          onClick={handleSaveLocal}
          className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
          disabled={isSaving} // Deshabilitar si ya está guardando
        >
          {isSaving || uploading
            ? `Guardando... (${uploading ? "Subiendo imágenes" : "Datos"})`
            : "Guardar Datos del Día"}
        </button>
      </div>
    </div>
  );
};


const App = () => {
  const [user, setUser] = useState(null);
  const [dailyData, setDailyData] = useState({});
  const [globalGoal, setGlobalGoal] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [view, setView] = useState("calendar"); // calendar, day_view, edit_products, edit_costs
  const [greenhouseConfig, setGreenhouseConfig] = useState({});

  // NUEVOS ESTADOS para el manejo de invernaderos
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [greenhousesList, setGreenhousesList] = useState([]);
  const [greenhouses, setGreenhouses] = useState([]);
  const [greenhouseId, setGreenhouseId] = useState(null);
  const [greenhouseName, setGreenhouseName] = useState("");
  const hasGlobalData = Object.keys(dailyData).some(
    (key) => dailyData[key] && dailyData[key].items.length > 0
  );

  // =======================================================================
  // === AUTENTICACIÓN Y SELECCIÓN DE INVERNADERO
  // =======================================================================

  const showTemporaryMessage = (message, type) => {
    switch (type) {
      case "info":
        toast.info(message);
        break;
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast.info(message);
    }
  };

  const generatePDF = useCallback(
    async (dateKey) => {
      // Objeto de día completo
      const dailyDataEntry = dailyData[dateKey] || { items: [] };

      // 1. Crear un contenedor temporal con el HTML que queremos capturar.
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "210mm"; // Ancho A4
      pdfContent.style.padding = "15mm 10mm";
      pdfContent.style.position = "absolute";
      pdfContent.style.left = "-9999px"; // Ocultar
      pdfContent.style.fontFamily = "Helvetica, Arial, sans-serif";
      pdfContent.style.color = "#333333";
      pdfContent.style.backgroundColor = "#FFFFFF";

      // 2. Generar el HTML del reporte (Header + Cuerpo + Footer)
      const totalProduccion = dailyDataEntry.items.reduce(
        (sum, item) => sum + parseFloat(item.result || 0),
        0
      );

      const rawCost = dailyDataEntry.finalProductionCost;
      const costeFinal = Number(rawCost || 0).toFixed(2);

      // NUEVAS VARIABLES DE COSTE
      const costData = dailyDataEntry.costData || {};
      const numWorkers = parseFloat(costData.numWorkers || 0);
      const hoursWorked = parseFloat(costData.hoursWorked || 0);
      const productionCostVariable = parseFloat(
        dailyDataEntry.productionCostVariable || 0
      );

      const hasCostData =
        numWorkers > 0 || hoursWorked > 0 || productionCostVariable > 0;

      const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // --- 2.1. Header HTML ---
      // 🐛 Corrección: Usamos una URL de logo condicional para evitar fallos si es vacía
      const logoUrl =
        REPORT_CONFIG.LOGO_URL ||
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

      const headerHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #E0E7FF; padding-bottom: 15px; margin-bottom: 25px;">
                <div style="flex: 1;">
                    <img src="${logoUrl}" alt="Logo" style="height: 75px; width: auto; max-width: 100%; border-radius: 4px; ${
        REPORT_CONFIG.LOGO_URL ? "" : "opacity: 0.2;"
      }">
                </div>
                <div style="flex: 2; text-align: center;">
                    <h1 style="font-size: 26px; font-weight: 700; margin: 0; color: #1E3A8A;">${
                      REPORT_CONFIG.REPORT_TITLE
                    }</h1>
                    <p style="font-size: 14px; margin: 3px 0 0 0; color: #6B7280; font-style: italic;">${
                      REPORT_CONFIG.COMPANY_NAME
                    }</p>
                </div>
                <div style="flex: 1; text-align: right;">
                    <p style="font-size: 11px; margin: 0; color: #9CA3AF;">Fecha de Impresión:</p>
                    <p style="font-size: 13px; font-weight: 600; margin: 2px 0 0 0; color: #4B5563;">${formatDate(
                      new Date()
                    )}</p>
                </div>
            </div>
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #059669; background-color: #F0FDF4; padding: 8px; border-radius: 4px;">Reporte Diario: ${dateDisplay}</h2>
        `;

      // --- 2.2. Cuerpo HTML (Productos) ---
      let bodyHtml = `
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">Productos Detallados:</h3>
        `;

      if (dailyDataEntry.items.length === 0) {
        bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este día.</p>`;
      } else {
        // Contenedor de la cuadrícula de productos (Grid de 3 columnas para A4)
        bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">`;

        dailyDataEntry.items.forEach((item) => {
          const result = parseFloat(item.result || 0);

          // 🐛 Corrección: Usamos una imagen de placeholder si la URL es Base64
          // (html2canvas a veces falla con Base64 muy grandes o mal formados)
          const itemImageUrl =
            item.imageUrl && item.imageUrl.startsWith("data:image")
              ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              : item.imageUrl;

          bodyHtml += `
                    <div style="
                        border: 1px solid #E0E0E0;
                        padding: 15px; 
                        border-radius: 12px; 
                        background-color: #FAFAFA; 
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
                        display: flex;
                        align-items: flex-start;
                    ">
                        ${
                          itemImageUrl
                            ? `<img
                                        src="${itemImageUrl}"
                                        alt="Evidencia"
                                        style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; flex-shrink: 0; border: 2px solid #D1E5F7;"
                                    >`
                            : `<div style="width: 60px; height: 60px; background-color: #E0E7FF; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1E3A8A; font-weight: 700; flex-shrink: 0;">
                                        EVIDENCIA
                                    </div>`
                        }
                        <div style="flex-grow: 1;">
                            <p style="font-size: 16px; font-weight: 800; color: #2563EB; margin: 0 0 8px 0; border-bottom: 1px solid #EEEEEE; padding-bottom: 4px;">
                                ${item.productName || "Producto sin nombre"}
                            </p>
                            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                                <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Peso(kg): ${parseFloat(
                                  item.factorA || 0
                                )}</span>
                                <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Cajas: ${parseFloat(
                                  item.factorB || 0
                                )}</span>
                            </div>
                            <div style="background-color: #10B981; padding: 8px 10px; border-radius: 6px; text-align: center;">
                                <p style="font-size: 17px; font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: 1px;">TOTAL: ${result} Kg</p>
                            </div>
                        </div>
                    </div>
                `;
        });
        bodyHtml += `</div>`; // Cierre del contenedor grid
      }

      // --- 2.3. Bloque de Costes y Footer ---
      let costDetailsHtml = "";
      if (hasCostData) {
        costDetailsHtml = `
                <div style="margin:25px 0 20px;padding:15px;border:2px solid #E0E7FF;border-radius:8px;background-color:#F8FAFF;">
                    <h4 style="font-size:16px;font-weight:700;color:#1E3A8A;margin-top:0;border-bottom:1px dashed #C7D2FE;padding-bottom:5px;">Detalle de Costes Laborales</h4>
                    <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:10px;">
                        <p style="margin:0;color:#4B5563;">Trabajadores:</p>
                        <p style="margin:0;font-weight:700;color:#2563EB;">${numWorkers.toFixed(
                          0
                        )}</p>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:5px;">
                        <p style="margin:0;color:#4B5563;">Horas Trabajadas:</p>
                        <p style="margin:0;font-weight:700;color:#2563EB;">${hoursWorked.toFixed(
                          2
                        )} hrs</p>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:16px;margin-top:10px;padding-top:5px;border-top:1px solid #E0E7FF;">
                        <p style="margin:0;font-weight:600;color:#1E3A8A;">Coste Laboral Diario:</p>
                        <p style="margin:0;font-weight:900;color:#059669;">${productionCostVariable.toFixed(
                          2
                        )} €</p>
                    </div>
                </div>
            `;
      }

      const footerHtml = `
            <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 10px;">
                ${costDetailsHtml}
                <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCIÓN TOTAL (Kg):</p>
                        <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion.toFixed(
                          2
                        )}</p>
                    </div>
                    <div style="width: 1px; background-color: #D1E5F7;"></div>
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/€):</p>
                        <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
                    </div>
                </div>
                <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Horticultura</p>
            </div>
        `;

      pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

      // 3. Añadir el contenido oculto al body y capturarlo
      document.body.appendChild(pdfContent);

      try {
        // Reemplazando showTemporaryMessage con toast si no existe
        const showMsg =
          typeof showTemporaryMessage === "function"
            ? showTemporaryMessage
            : (msg, type) => toast[type](msg);

        showMsg("Generando PDF...", "info");

        const canvas = await html2canvas(pdfContent, {
          scale: 2,
          // Usar CORS es CRÍTICO para imágenes externas (como el logo)
          useCORS: true,
          // scrollY: -window.scrollY // Descomentar solo si el elemento está en la parte visible
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // Ancho A4 en mm
        const pageHeight = 295; // Alto A4 en mm

        // Calcula la altura de la imagen renderizada manteniendo la proporción A4
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Primer renderizado
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Manejo de páginas múltiples (si el contenido es muy largo)
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
        showMsg("PDF generado con éxito.", "success");
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        const showMsg =
          typeof showTemporaryMessage === "function"
            ? showTemporaryMessage
            : (msg, type) => toast[type](msg);
        showMsg(
          "Error al generar el PDF. Verifica la consola para detalles (posible error de imagen o CORS).",
          "error"
        );
      } finally {
        // 4. Limpiar el contenedor temporal
        document.body.removeChild(pdfContent);
      }
    },
    [dailyData, toast] // Dependencias: dailyData y toast (si se usa directamente)
  );

  const getConfigRef = (dbInstance, userId, greenhouseId) => {
    // Si tienes un documento de configuración separado, usa esa ruta.
    // Si la config de datos se guarda con la meta global, usa getGoalRef.
    return doc(
      dbInstance,
      `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/config/data_config`
    );
  };




useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (!currentUser) {
            // Limpieza completa al cerrar sesión
            setGreenhouses([]);
            setGreenhouseId(null);
            setGreenhouseName("");
            setDailyData({});
            setGlobalGoal({});
            setGreenhouseConfig({});
            localStorage.removeItem(GREENHOUSE_STORAGE_KEY);
        }
    });

    // NO necesitas [greenhouseId] aquí.
    return () => unsubscribe(); 
}, [auth]);

// --- CARGA Y SELECCIÓN DE INVERNADEROS ---
useEffect(() => {
    if (!user) {
        setGreenhouses([]);
        setGreenhouseId(null);
        setGreenhouseName("Inicia sesión para ver los datos");
        return;
    }

    const listRef = getGreenhousesListRef(db, user.uid);

    const unsubscribeList = onSnapshot(listRef, (docSnap) => {
        const data = docSnap.data() || { list: [] };
        const list = data.list || [];
        setGreenhouses(list);

        // LÓGICA DE SELECCIÓN INICIAL (solo si el ID actual no está establecido)
        if (list.length > 0) {
            
            const storedId = localStorage.getItem(GREENHOUSE_STORAGE_KEY);
            
            // 1. Intentamos encontrar el invernadero en la lista:
            //    - Prioridad 1: ID guardado localmente (storedId)
            //    - Prioridad 2: ID actualmente seleccionado (greenhouseId)
            //    - Prioridad 3: El primero de la lista
            const initialGreenhouse = 
                list.find(g => g.id === storedId) ||
                list.find(g => g.id === greenhouseId) ||
                list[0];

            // 2. Si encontramos uno, actualizamos los estados
            if (initialGreenhouse) {
                setGreenhouseId(initialGreenhouse.id);
                setGreenhouseName(initialGreenhouse.name);
                localStorage.setItem(GREENHOUSE_STORAGE_KEY, initialGreenhouse.id);
            }
        } else {
            // Si no hay invernaderos
            setGreenhouseId(null);
            setGreenhouseName("No hay invernaderos creados");
            localStorage.removeItem(GREENHOUSE_STORAGE_KEY);
        }
    }, (error) => {
        console.error("Error al cargar la lista:", error);
        toast.error("Error al cargar la lista de invernaderos.");
    });

    return () => unsubscribeList();
}, [user]); // Dependencia clave: [user]



// --- SINCRONIZACIÓN DE DATOS DIARIOS, METAS Y CONFIGURACIÓN ---
useEffect(() => {
    if (!user || !greenhouseId) {
        setDailyData({});
        setGlobalGoal({});
        setGreenhouseConfig({});
        return;
    }

    // 1. Sincronizar datos diarios
    const dailyRef = getDocRef(db, user.uid, greenhouseId);
    const unsubscribeDaily = onSnapshot(dailyRef, (docSnap) => {
        setDailyData(docSnap.data() || {});
    });

    // 2. Sincronizar metas globales (goalRef)
    const goalRef = getGoalRef(db, user.uid, greenhouseId);
    const unsubscribeGoal = onSnapshot(goalRef, (docSnap) => {
        setGlobalGoal(docSnap.data() || {});
    });

    // 3. Sincronizar configuración (configRef)
    const configRef = getGoalRef(db, user.uid, greenhouseId); // Asumo que goalRef y configRef apuntan al mismo documento si ambos usan getGoalRef
    const unsubscribeConfig = onSnapshot(configRef, (docSnap) => {
        if (docSnap.exists()) {
            setGreenhouseConfig(docSnap.data() || {});
        } else {
            // Si no existe, lo inicializamos para evitar errores de escritura posteriores.
            const initialConfig = { goal: 0, deadline: "", numWorkers: 0, hoursWorked: 0 };
            setDoc(configRef, initialConfig, { merge: true })
                .then(() => setGreenhouseConfig(initialConfig))
                .catch(error => console.error("Error al inicializar config:", error));
        }
    });

    return () => {
        unsubscribeDaily();
        unsubscribeGoal();
        unsubscribeConfig();
    };
}, [user, greenhouseId]); // Dependencia clave: [user, greenhouseId]

  // =======================================================================
  // === LÓGICA DE MANEJO DE INVERNADEROS (NUEVO)
  // =======================================================================

  const updateGreenhouseConfig = async (newConfig) => {
    if (!user || !greenhouseId) {
        toast.error("Error: Usuario no autenticado o invernadero no seleccionado.");
        return;
    }

    try {
        // Obtenemos la referencia al documento de configuración del invernadero actual
        const goalRef = getGoalRef(db, user.uid, greenhouseId);

        // La función 'setDoc' con { merge: true } actualiza campos existentes 
        // y añade nuevos sin sobrescribir el documento completo.
        await setDoc(goalRef, newConfig, { merge: true });

        // Actualizamos el estado local (para evitar una recarga innecesaria si ya está suscrito)
        // Aunque el onSnapshot debería actualizarlo, esto asegura una respuesta inmediata.
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig // Fusionar la nueva configuración
        }));

        toast.success("✅ Configuración del invernadero guardada en Firebase.");
    } catch (error) {
        console.error("Error al guardar la configuración del invernadero:", error);
        toast.error("❌ Error al guardar la configuración. Inténtalo de nuevo.");
    }
};

  const handleCreateGreenhouse = async (name) => {
    if (!user) return;
    const newId = uuidv4();
    const listRef = getGreenhousesListRef(db, user.uid);
    const newGreenhouse = { id: newId, name: name };

    try {
      // 1. Añadir a la lista de invernaderos
      await updateDoc(listRef, {
        list: arrayUnion(newGreenhouse),
      }).catch(async (error) => {
        // Si el documento no existe (primera vez), créalo
        if (error.code === "not-found") {
          await setDoc(listRef, { list: [newGreenhouse] });
        } else {
          throw error;
        }
      });

      // 2. Establecer como el invernadero seleccionado
      setGreenhouseId(newId);
      setGreenhouseName(name);
      toast.success(`Invernadero "${name}" creado con éxito.`);
    } catch (error) {
      console.error("Error creating greenhouse:", error);
      toast.error("Error al crear el invernadero.");
    }
  };

  const handleDeleteGreenhouse = async (id, name) => {
    if (
      !user ||
      !window.confirm(
        `¿Estás seguro de eliminar el invernadero "${name}" y TODOS sus datos? Esta acción no se puede deshacer.`
      )
    )
      return;

    const listRef = getGreenhousesListRef(db, user.uid);
    const greenhouseToDelete = greenhouses.find((g) => g.id === id);

    if (!greenhouseToDelete) {
      toast.error("Invernadero no encontrado.");
      return;
    }

    try {
      // 1. Eliminar de la lista de invernaderos
      await updateDoc(listRef, {
        list: arrayRemove(greenhouseToDelete),
      });

      // 2. (OPCIONAL) Eliminar los documentos de datos y configuración
      const dailyRef = getDocRef(db, user.uid, id);
      const goalRef = getGoalRef(db, user.uid, id);
      await deleteDoc(dailyRef);
      await deleteDoc(goalRef);

      // 3. Reajustar la selección
      if (greenhouseId === id) {
        const remaining = greenhouses.filter((g) => g.id !== id);
        if (remaining.length > 0) {
          setGreenhouseId(remaining[0].id);
          setGreenhouseName(remaining[0].name);
        } else {
          setGreenhouseId(null);
          setGreenhouseName("");
        }
      }
      toast.success(`Invernadero "${name}" y sus datos han sido eliminados.`);
    } catch (error) {
      console.error("Error deleting greenhouse:", error);
      toast.error("Error al eliminar el invernadero.");
    }
  };

  const handleSelectGreenhouse = (id, name) => {
    setGreenhouseId(id);
    setGreenhouseName(name);
    setView("calendar"); // Siempre volver al calendario al cambiar
    setSelectedDate(formatDate(new Date()));
  };

  // =======================================================================
  // === LÓGICA DE MANEJO DE DATOS DIARIOS
  // =======================================================================

  // Calculo de suma total para el tracker (MEMO)
  const dailyTotalSum = useMemo(() => {
    return Object.values(dailyData).reduce((sum, day) => {
      const dayTotal = (day.items || []).reduce(
        (subSum, item) => subSum + parseFloat(item.result || 0),
        0
      );
      return sum + dayTotal;
    }, 0);
  }, [dailyData]);

  // Maneja cambios de mes en el calendario
  const handleMonthChange = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  // Maneja click en un día del calendario
  const handleDayClick = useCallback((dateKey, newView) => {
    setSelectedDate(dateKey);
    setView(newView);
  }, []);

  const handleItemChange = useCallback(
    (itemId, field, value) => {
      setDailyData((prevData) => {
        const dayData = { ...prevData[selectedDate] };

        const updatedItems = dayData.items.map((item) => {
          if (item.id === itemId) {
            const newItem = { ...item, [field]: value };

            // 1. OBTENER VALORES ACTUALIZADOS Y POR DEFECTO
            // Si cambia el nombre, actualiza factorA de PRODUCT_CATALOG.
            const productName =
              field === "productName" ? value : newItem.productName;
            const factorB = field === "factorB" ? value : newItem.factorB;

            // 2. RECALCULAR EL RESULTADO
            newItem.result = calculateResult(productName, factorB);

            // 3. ACTUALIZAR factorA si el nombre del producto fue editado
            if (field === "productName") {
              newItem.factorA = PRODUCT_CATALOG[value] || 0;
            }

            return newItem;
          }
          return item;
        });

        return {
          ...prevData,
          [selectedDate]: {
            ...dayData,
            items: updatedItems,
          },
        };
      });
    },
    [selectedDate] // Depende de selectedDate
  );

  // Añadir un nuevo producto al día (local)
  const addItem = useCallback(() => {
    setSelectedDate((dateKey) => {
      setDailyData((prev) => {
        const currentDay = prev[dateKey] || { items: [] };
        const newItem = {
          id: uuidv4(),
          productName: "",
          factorB: "",
          factorA: 0,
          result: "0.00",
          damagedBoxes: "",
          notes: "",
          imageUrl: "",
        };

        const updatedItems = [...currentDay.items, newItem];

        return {
          ...prev,
          [dateKey]: {
            ...currentDay,
            items: updatedItems,
          },
        };
      });
      return dateKey;
    });
  }, []);

  // Eliminar un producto (local)
  const deleteItem = useCallback((itemId) => {
    setSelectedDate((dateKey) => {
      setDailyData((prev) => {
        const currentDay = prev[dateKey] || { items: [] };
        const updatedItems = currentDay.items.filter(
          (item) => item.id !== itemId
        );

        // Recalcular el total diario y los costos
        const dailyTotal = updatedItems.reduce(
          (sum, item) => sum + parseFloat(item.result || 0),
          0
        );
        const costs = calculateCosts(
          dailyTotal,
          currentDay.numWorkers,
          currentDay.hoursWorked
        );

        return {
          ...prev,
          [dateKey]: {
            ...currentDay,
            items: updatedItems,
            ...costs,
          },
        };
      });
      return dateKey;
    });
  }, []);

  const handleSave = useCallback(
    async (dateKey, items = null, costData = null) => {
      // Cláusulas de guardia
      if (!user || !greenhouseId) return;

      const dailyRef = getDocRef(db, user.uid, greenhouseId);
      // Obtener los datos existentes (de Firestore o del estado 'dailyData')
      const existingDayData = dailyData[dateKey] || {};

      // 1. Determinar el estado base (el que se va a guardar)
      let newDayData = {
        ...existingDayData,
        dateKey: dateKey,
        // Inicializa items y costData si no existen en el existingData
        items: existingDayData.items || [],
        costData: existingDayData.costData || {},
      };

      // 2. Procesar la actualización de PRODUCTOS (si se pasan 'items')
      if (items) {
        // Recalcular el resultado para cada ítem (por si DayEditForm no lo hizo)
        const itemsToSave = items.map((item) => ({
          ...item,
          result: calculateResult(item.productName, item.factorB),
        }));

        const dailyTotal = itemsToSave.reduce(
          (sum, item) => sum + parseFloat(item.result || 0),
          0
        );

        // Actualizar el objeto con los nuevos ítems y el total
        newDayData.items = itemsToSave;
        newDayData.dailyTotal = dailyTotal.toFixed(2);

        // Recalcular los costes si ya existen datos de costes
        const existingNumWorkers = parseFloat(
          newDayData.costData.numWorkers || 0
        );
        const existingHoursWorked = parseFloat(
          newDayData.costData.hoursWorked || 0
        );

        const costs = calculateCosts(
          dailyTotal,
          existingNumWorkers,
          existingHoursWorked
        );

        newDayData = {
          ...newDayData,
          ...costs,
        };
      }

      // 3. Procesar la actualización de COSTES (si se pasa 'costData')
      if (costData) {
        // Actualizar solo los datos de costes
        newDayData.costData = costData;

        // Recalcular los costes con el total de producción existente
        const dailyTotal = parseFloat(newDayData.dailyTotal || 0);
        const newNumWorkers = parseFloat(costData.numWorkers || 0);
        const newHoursWorked = parseFloat(costData.hoursWorked || 0);

        const costs = calculateCosts(dailyTotal, newNumWorkers, newHoursWorked);

        newDayData = {
          ...newDayData,
          ...costs,
        };
      }

      // 4. Guardar en Firestore y cambiar de vista
      try {
        await setDoc(
          dailyRef,
          {
            [dateKey]: newDayData,
          },
          { merge: true }
        );

        // 🚀 CORRECCIÓN CLAVE: Volver a la vista de detalle del día para ver el resultado
        toast.success(`Datos guardados para ${dateKey}.`);
        handleDayClick(dateKey, "day_view");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        toast.error("Error al guardar datos.");
      }
    },
    [
      user,
      greenhouseId,
      dailyData,
      calculateCosts,
      calculateResult,
      db,
      getDocRef,
      handleDayClick,
    ]
  );

  const saveGreenhouseConfig = useCallback(async (newConfig) => {
    if (!user || !greenhouseId) {
        toast.error("Error: Usuario no autenticado o invernadero no seleccionado.");
        return;
    }

    try {
        // Usa la referencia a la configuración del invernadero (definida con getGoalRef)
        const configRef = getGoalRef(db, user.uid, greenhouseId);

        // setDoc con { merge: true } actualiza solo los campos proporcionados
        await setDoc(configRef, newConfig, { merge: true });

        // Actualización local de la configuración (para UI inmediata)
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig 
        }));

        toast.success("✅ Configuración del invernadero (Meta/Config) guardada con éxito.");
    } catch (error) {
        console.error("Error al guardar la configuración del invernadero:", error);
        toast.error("❌ Error al guardar la configuración.");
    }
}, [user, greenhouseId]); // Dependencias para useCallback

  // Guardar meta global en Firebase
  const updateGoal = useCallback(
    async (goal, deadline) => {
      if (!user || !greenhouseId) return;

      try {
        const goalRef = getGoalRef(db, user.uid, greenhouseId);
        await setDoc(
          goalRef,
          { goal: parseFloat(goal) || 0, deadline },
          { merge: true }
        );
        toast.success("Meta global actualizada.");
      } catch (error) {
        console.error("Error updating goal in Firestore:", error);
        toast.error("Error al actualizar la meta.");
      }
    },
    [user, greenhouseId]
  );

  // =======================================================================
  // === RENDERIZADO PRINCIPAL
  // =======================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-indigo-700">Cargando aplicación...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <AuthScreen app={app} />
      </div>
    );
  }

  // Si está autenticado pero no hay invernaderos
  if (greenhouses.length === 0 && !greenhouseId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="flex justify-between items-center py-4 border-b border-indigo-200 mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            Horticultura App 🪴
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </header>
        <div className="max-w-xl mx-auto p-10 bg-white rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Bienvenido!
          </h2>
          <p className="mb-6 text-gray-600">
            Aún no tienes invernaderos registrados. Comienza creando uno para
            gestionar tus inventarios.
          </p>
          <GreenhouseSelector // Usamos el selector para la creación
            greenhouses={greenhouses}
            greenhouseId={greenhouseId}
            handleSelectGreenhouse={handleSelectGreenhouse}
            handleCreateGreenhouse={handleCreateGreenhouse}
            handleDeleteGreenhouse={handleDeleteGreenhouse}
            showManagementButtons={true} // Forzar visibilidad
          />
        </div>
      </div>
    );
  }



  const renderContent = () => {
    switch (view) {
        
        // --- NUEVO CASO AGREGADO: VISTA DEL DASHBOARD/HOME ---
        case "home":
            return (
                <HomeContent
                    dailyData={dailyData} // Datos de producción (necesarios para el cálculo del total)
                    // Pasa la lista de invernaderos
                    greenhouses={greenhouses} 
                    // Pasa el ID del invernadero actualmente seleccionado
                    selectedGreenhouseId={greenhouseId} 
                    // Pasa la función para actualizar el ID seleccionado (el setter del padre)
                    setSelectedGreenhouseId={setGreenhouseId} 
                    // Pasa la función para actualizar la configuración (ej: meta) en Firebase
                    updateGreenhouseConfig={saveGreenhouseConfig} 
                />
            );
        // --------------------------------------------------------

        case "calendar":
            return (
                // Contenedor principal del calendario y estadísticas
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Columna Izquierda: Calendario */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
                            Producción - {greenhouseName} 📅
                        </h2>
                        {/* ... (Resto de CalendarGrid y contenido de la vista 'calendar') ... */}
                        <div className="bg-white p-2 md:p-6 rounded-xl shadow-2xl">
                            <CalendarGrid
                                currentDate={currentDate}
                                dailyData={dailyData}
                                selectedDate={selectedDate}
                                handleMonthChange={handleMonthChange}
                                handleDayClick={handleDayClick}
                                formatNumber={formatNumber}
                                setSelectedDate={setSelectedDate}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha: Estadísticas y Meta (Stack en móviles) */}
                    <div className="space-y-6 pt-4 lg:pt-0">
                        <DatosEstadisticosCard
                            dailyData={dailyData}
                            formatNumber={formatNumber}
                            initialConfig={greenhouseConfig}
                            onSaveConfig={saveGreenhouseConfig}
                        />
                        <InlineGlobalGoalTracker
                            globalGoal={globalGoal}
                            dailyTotalSum={dailyTotalSum}
                            formatNumber={formatNumber}
                        />
                        <InlineGoalInput
                            globalGoal={globalGoal}
                            updateGoal={updateGoal}
                            formatNumber={formatNumber}
                        />
                    </div>
                </div>
            );

        case "day_view":
            return (
                <DayProductsGrid
                    dateKey={selectedDate}
                    dailyData={dailyData}
                    handleDayClick={handleDayClick}
                    formatNumber={formatNumber}
                    calculateCosts={calculateCosts}
                    generatePDF={generatePDF}
                    REPORT_CONFIG={REPORT_CONFIG}
                />
            );

        case "edit_products":
            return (
                <DayEditForm
                    dateKey={selectedDate}
                    dailyData={dailyData}
                    handleItemChange={handleItemChange}
                    addItem={addItem}
                    deleteItem={deleteItem}
                    handleDayClick={handleDayClick}
                    handleSave={handleSave}
                    uploadImages={uploadImages}
                    formatNumber={formatNumber}
                    uploadUrl={YOUR_BACKEND_UPLOAD_URL}
                />
            );

        case "edit_costs":
            return (
                <CostEditForm
                    dateKey={selectedDate}
                    dailyData={dailyData}
                    handleDayClick={handleDayClick}
                    handleSave={handleSave}
                    formatNumber={formatNumber}
                    calculateCosts={calculateCosts}
                    HOURLY_COST_RATE={HOURLY_COST_RATE}
                />
            );

        default:
            return (
                <div className="p-6 text-center text-gray-500">
                    Vista no encontrada.
                </div>
            );
    }
};

  // const renderContent = () => {
  //   switch (view) {
      
  //     case "calendar":
  //       return (
  //         // Contenedor principal del calendario y estadísticas
  //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
  //           {/* Columna Izquierda: Calendario */}
  //           <div className="lg:col-span-2">
  //             <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
  //               Producción - {greenhouseName} 📅
  //             </h2>
  //             <div className="bg-white p-2 md:p-6 rounded-xl shadow-2xl">
  //               <CalendarGrid
  //                 currentDate={currentDate}
  //                 dailyData={dailyData}
  //                 selectedDate={selectedDate}
  //                 handleMonthChange={handleMonthChange}
  //                 handleDayClick={handleDayClick}
  //                 formatNumber={formatNumber}
  //                 setSelectedDate={setSelectedDate}
  //               />
  //             </div>
  //           </div>

  //           {/* Columna Derecha: Estadísticas y Meta (Stack en móviles) */}
  //           <div className="space-y-6 pt-4 lg:pt-0">
  //             <DatosEstadisticosCard
  //               dailyData={dailyData}
  //               formatNumber={formatNumber}
  //               initialConfig={greenhouseConfig}
  //               onSaveConfig={saveGreenhouseConfig}
  //             />
  //             <InlineGlobalGoalTracker
  //               globalGoal={globalGoal}
  //               dailyTotalSum={dailyTotalSum}
  //               formatNumber={formatNumber}
  //             />
  //             <InlineGoalInput
  //               globalGoal={globalGoal}
  //               updateGoal={updateGoal}
  //               formatNumber={formatNumber}
  //             />
  //           </div>
  //         </div>
  //       );

  //     case "day_view":
  //       return (
  //         <DayProductsGrid
  //           dateKey={selectedDate}
  //           dailyData={dailyData}
  //           handleDayClick={handleDayClick}
  //           formatNumber={formatNumber}
  //           calculateCosts={calculateCosts}
  //           generatePDF={generatePDF}
  //           REPORT_CONFIG={REPORT_CONFIG}
  //         />
  //       );

  //     case "edit_products":
  //       return (
  //         <DayEditForm
  //           dateKey={selectedDate}
  //           dailyData={dailyData}
  //           handleItemChange={handleItemChange}
  //           addItem={addItem}
  //           deleteItem={deleteItem}
  //           handleDayClick={handleDayClick}
  //           handleSave={handleSave}
  //           uploadImages={uploadImages}
  //           formatNumber={formatNumber}
  //           uploadUrl={YOUR_BACKEND_UPLOAD_URL}
  //         />
  //       );

  //     case "edit_costs":
  //       return (
  //         <CostEditForm
  //           dateKey={selectedDate}
  //           dailyData={dailyData}
  //           handleDayClick={handleDayClick}
  //           handleSave={handleSave}
  //           formatNumber={formatNumber}
  //           calculateCosts={calculateCosts}
  //           HOURLY_COST_RATE={HOURLY_COST_RATE}
  //         />
  //       );

  //     default:
  //       return (
  //         <div className="p-6 text-center text-gray-500">
  //           Vista no encontrada.
  //         </div>
  //       );
  //   }
  // };

  // =================================================================
  // Componente Principal (Retorno JSX)
  // =================================================================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white p-4 rounded-xl shadow-2xl mb-8 border-t-4 border-indigo-600">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Título Principal */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex items-center">
            <svg
              className="w-7 h-7 md:w-8 md:h-8 mr-2 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 14v6m-3-3h6m-3-6h.01M5 14h.01M12 20h.01M12 10h.01M3 20h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
              ></path>
            </svg>
            Gestión de Inventario 🥬
          </h1>

          {/* Controles y Log Out */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">
            {/* Selector de Invernaderos (Visible en todas partes) */}
            <GreenhouseSelector
              greenhouses={greenhouses}
              greenhouseId={greenhouseId}
              handleSelectGreenhouse={handleSelectGreenhouse}
              handleCreateGreenhouse={handleCreateGreenhouse}
              handleDeleteGreenhouse={handleDeleteGreenhouse}
              showManagementButtons={view === "calendar"}
            />

            {/* Botón de Cerrar Sesión */}
            <button
              onClick={() => signOut(auth)}
              className="w-full sm:w-auto py-2 px-4 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* BOTONES DE EXPORTACIÓN (Fuera del header, solo visibles en vista 'calendar' y centrados) */}
      {view === "calendar" && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          {/* Botón de Exportación Diaria */}
          <button
            className="
                      w-full sm:w-auto flex items-center justify-center 
                      px-6 py-3 
                      bg-green-600 text-white text-sm 
                      rounded-lg font-semibold shadow-md 
                      hover:bg-green-500 transition duration-300 
                      disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
                  "
            onClick={() => exportToCsv(dailyData, selectedDate)}
            disabled={
              !dailyData[selectedDate] ||
              dailyData[selectedDate].items.length === 0
            }
            title={`Descargar datos de producción del día ${selectedDate} en formato CSV`}
          >
            <FaFileCsv size={16} className="mr-2" />
            Exportar Día ({selectedDate})
          </button>

          {/* Botón de Exportación Global */}
          <button
            className="
                      w-full sm:w-auto flex items-center justify-center 
                      px-6 py-3 
                      bg-indigo-600 text-white text-sm 
                      rounded-lg font-semibold shadow-md 
                      hover:bg-indigo-500 transition duration-300 
                      disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
                  "
            onClick={() => exportAllToCsv(dailyData)}
            disabled={!hasGlobalData}
            title="Descargar todos los datos históricos de producción en un solo archivo CSV"
          >
            <FaFileDownload size={16} className="mr-2" />
            Exportar Datos Globales (CSV)
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL (CalendarGrid / DayProductsGrid / etc) */}
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;















// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { initializeApp } from "firebase/app";
// import { FaFileCsv } from 'react-icons/fa';
// import { FaFileDownload } from 'react-icons/fa';
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "react-toastify";

// // 🎯 IMPORTACIÓN DE COMPONENTES EXTERNOS
// import CostEditForm from "../../components/CostEditForm";
// import CalendarGrid from "../../components/CalendarGrid";
// import ProductItemForm from "../../components/ProductItemForm";
// import DayProductsGrid from "../../components/DayProductsGrid";
// import DatosEstadisticosCard from "./DatosEstadisticosCard";
// import GreenhouseSelector from "../../components/GreenhouseSelector"; // Nuevo Componente
// // 🔥 REEMPLAZA ESTO CON TU CONFIGURACIÓN REAL DE FIREBASE 🔥
// import { firebaseConfig } from "../../firebaseConfig";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // =======================================================================
// // === CONFIGURACIÓN Y UTILIDADES
// // =======================================================================

// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// const REPORT_CONFIG = {
//   COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
//   REPORT_TITLE: "Finca Balsicas Producción S.A.",
//   LOGO_URL: "data:image/png;base64,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",
// };
// const isProduction = process.env.NODE_ENV === "production";
// const LOCAL_URL = "http://localhost:4500/api/upload/image";
// const PRODUCTION_URL =
//   "https://gestion-horticultura.netlify.app/api/upload/image";
// const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

// // Inicialización de Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- DATOS FIJOS Y CONSTANTES ---
// const HOURLY_COST_RATE = 10;
// const PRODUCT_CATALOG = {
//   "IFCO 6410": 10,
//   "IFCO 4312": 5,
//   CARTON: 8,
//   "NARANJA 2°": 16,
//   "SAMPER 1°": 12,
//   "SAMPER 2°": 15,
// };

// // --- FUNCIONES DE UTILIDAD ---

// const formatNumber = (num, decimales = 2) => {
//   if (num === null || num === undefined || isNaN(num)) return "0.00";
//   return Number(num).toLocaleString("es-ES", {
//     minimumFractionDigits: decimales,
//     maximumFractionDigits: decimales,
//     useGrouping: true,
//   });
// };
// const formatDate = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };
// const calculateResult = (productName, factorB) => {
//   const factorA = PRODUCT_CATALOG[productName] || 0;
//   const b = parseFloat(factorB) || 0;
//   return (factorA * b).toFixed(2);
// };

// const calculateCosts = (dailyTotal, numWorkers, hoursWorked) => {
//   const dailyLaborCost =
//     (parseFloat(numWorkers) || 0) *
//     (parseFloat(hoursWorked) || 0) *
//     HOURLY_COST_RATE;
//   const productionCostVariable = parseFloat(dailyLaborCost).toFixed(2);

//   let finalProductionCost = 0;
//   if (dailyTotal > 0) {
//     finalProductionCost = (dailyLaborCost / dailyTotal).toFixed(4);
//   }

//   return { productionCostVariable, finalProductionCost };
// };

// const exportToCsv = (dailyData, dateKeyToExport = null) => {
//     // Si no se proporciona una clave, no podemos exportar.
//     if (!dateKeyToExport || !dailyData[dateKeyToExport]) {
//         toast.error("Selecciona un día con datos para exportar.");
//         return;
//     }

//     const data = dailyData[dateKeyToExport];
//     const dateDisplay = dateKeyToExport; // Formato YYYY-MM-DD

//     // 1. Definir las cabeceras del CSV
//     const headers = [
//         "Fecha",
//         "Nombre Producto",
//         "Peso (kg)",
//         "Cajas",
//         "Produccion Total (kg)",
//         "Costo Final (€/kg)",
//     ].join(";"); // Usamos el punto y coma (;) como separador para compatibilidad

//     // 2. Mapear los datos de los productos
//     const csvRows = data.items.map(item => {
//         const row = [
//             dateDisplay,
//             item.productName || "N/A",
//             parseFloat(item.factorA || 0).toFixed(2).replace('.', ','), // Usar coma para decimales
//             parseFloat(item.factorB || 0).toFixed(2).replace('.', ','),
//             parseFloat(item.result || 0).toFixed(2).replace('.', ','),
//             Number(data.finalProductionCost || 0).toFixed(2).replace('.', ','),
//         ];
//         return row.join(";");
//     });

//     // 3. Unir cabeceras y filas
//     const csvContent = [headers, ...csvRows].join("\n");

//     // 4. Crear y descargar el archivo
//     const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" }); // Se añade BOM para codificación UTF-8
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Reporte_Produccion_${dateDisplay}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     toast.success(`Datos de ${dateDisplay} exportados correctamente a CSV. 📥`);
// };

// const exportAllToCsv = (dailyData) => {
//     // 🔑 CORRECCIÓN: Inicialización de seguridad. Si dailyData es null o undefined, usa un objeto vacío {}.
//     const data = dailyData || {};

//     // 1. Verificar si hay datos
//     // Ahora Object.keys se llama de forma segura sobre 'data'
//     const allDateKeys = Object.keys(data).filter(key => data[key] && data[key].items?.length > 0);

//     if (allDateKeys.length === 0) {
//         // Asumiendo que 'toast' está disponible en el scope
//         toast.error("No hay datos registrados en el calendario para exportar.");
//         return;
//     }

//     // 2. Definir las cabeceras del CSV
//     const headers = [
//         "Fecha",
//         "Nombre Producto",
//         "Peso (kg)",
//         "Cajas",
//         "Produccion Total Producto (kg)",
//         "Coste Final Diario (€/kg)",
//         "Coste Laboral Diario (€)",
//         "Total Produccion Dia (kg)"
//     ].join(";");

//     let csvRows = [];

//     // 3. Iterar sobre CADA DÍA en dailyData
//     allDateKeys.forEach(dateKey => {
//         const dayData = data[dateKey]; // Usamos la variable 'data' segura
//         const dateDisplay = dateKey; // Formato YYYY-MM-DD

//         // Variables globales del día
//         const costeFinalDia = Number(dayData.finalProductionCost || 0).toFixed(2).replace('.', ',');
//         const costeLaboralDia = Number(dayData.productionCostVariable || 0).toFixed(2).replace('.', ',');

//         const totalProduccionDia = dayData.items.reduce(
//             (sum, item) => sum + parseFloat(item.result || 0),
//             0
//         ).toFixed(2).replace('.', ',');

//         // 4. Mapear los datos de los productos de CADA DÍA
//         dayData.items.forEach(item => { // dayData.items es seguro aquí gracias al filtro inicial
//             const row = [
//                 dateDisplay,
//                 item.productName || "N/A",
//                 parseFloat(item.factorA || 0).toFixed(2).replace('.', ','),
//                 parseFloat(item.factorB || 0).toFixed(2).replace('.', ','),
//                 parseFloat(item.result || 0).toFixed(2).replace('.', ','),
//                 costeFinalDia,
//                 costeLaboralDia,
//                 totalProduccionDia
//             ];
//             csvRows.push(row.join(";"));
//         });
//     });

//     // 5. Unir cabeceras y filas
//     const csvContent = [headers, ...csvRows].join("\n");

//     // 6. Crear y descargar el archivo
//     // La adición de [0xef, 0xbb, 0xbf] es para el BOM (Byte Order Mark), asegurando compatibilidad con caracteres especiales y Excel.
//     const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;

//     const today = new Date().toISOString().split('T')[0];
//     link.setAttribute("download", `Reporte_Produccion_GLOBAL_${today}.csv`);

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // Asumiendo que 'toast' está disponible en el scope
//     toast.success(`Exportación global completada: ${csvRows.length} líneas de producto descargadas. 💾`);
// };
// // const exportAllToCsv = (dailyData) => {
// //     // 1. Verificar si hay datos
// //     const allDateKeys = Object.keys(dailyData).filter(key => dailyData[key] && dailyData[key].items.length > 0);

// //     if (allDateKeys.length === 0) {
// //         toast.error("No hay datos registrados en el calendario para exportar.");
// //         return;
// //     }

// //     // 2. Definir las cabeceras del CSV
// //     // Incluimos el Coste Total Diario y el Coste Final (€/kg)
// //     const headers = [
// //         "Fecha",
// //         "Nombre Producto",
// //         "Peso (kg)",
// //         "Cajas",
// //         "Produccion Total Producto (kg)",
// //         "Coste Final Diario (€/kg)", // Coste calculado por Kilo ese día
// //         "Coste Laboral Diario (€)", // Coste laboral total de ese día
// //         "Total Produccion Dia (kg)" // Producción total del día
// //     ].join(";");

// //     let csvRows = [];

// //     // 3. Iterar sobre CADA DÍA en dailyData
// //     allDateKeys.forEach(dateKey => {
// //         const data = dailyData[dateKey];
// //         const dateDisplay = dateKey; // Formato YYYY-MM-DD

// //         // Variables globales del día
// //         const costeFinalDia = Number(data.finalProductionCost || 0).toFixed(2).replace('.', ',');
// //         const costeLaboralDia = Number(data.productionCostVariable || 0).toFixed(2).replace('.', ',');

// //         const totalProduccionDia = data.items.reduce(
// //             (sum, item) => sum + parseFloat(item.result || 0),
// //             0
// //         ).toFixed(2).replace('.', ',');

// //         // 4. Mapear los datos de los productos de CADA DÍA
// //         data.items.forEach(item => {
// //             const row = [
// //                 dateDisplay,
// //                 item.productName || "N/A",
// //                 parseFloat(item.factorA || 0).toFixed(2).replace('.', ','),
// //                 parseFloat(item.factorB || 0).toFixed(2).replace('.', ','),
// //                 parseFloat(item.result || 0).toFixed(2).replace('.', ','),
// //                 costeFinalDia,
// //                 costeLaboralDia,
// //                 totalProduccionDia
// //             ];
// //             csvRows.push(row.join(";"));
// //         });
// //     });

// //     // 5. Unir cabeceras y filas
// //     const csvContent = [headers, ...csvRows].join("\n");

// //     // 6. Crear y descargar el archivo
// //     const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
// //     const url = URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     // Nombre del archivo: incluir la fecha actual para que sea único
// //     const today = new Date().toISOString().split('T')[0];
// //     link.setAttribute("download", `Reporte_Produccion_GLOBAL_${today}.csv`);

// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);

// //     toast.success(`Exportación global completada: ${csvRows.length} líneas de producto descargadas. 💾`);
// // };

// const uploadImages = async (imagesToUpload, uploadUrl) => {
//   const uploadedUrls = [];
//   for (const item of imagesToUpload) {
//     try {
//       console.log(`Subiendo imagen ${item.id} a: ${uploadUrl}`);
//       // Simulación: en un entorno real, descomentarías el fetch real
//       /*
//       const response = await fetch(uploadUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           image: item.imageUrl,
//           itemId: item.id,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.secure_url) {
//         uploadedUrls.push({ id: item.id, url: data.secure_url });
//       } else {
//         console.warn(`Backend no devolvió secure_url para el ítem ${item.id}.`);
//         uploadedUrls.push({ id: item.id, url: item.imageUrl });
//       }
//       */
//       // SIMULACIÓN DE SUBIDA EXITOSA (MANTENER Base64)
//       uploadedUrls.push({ id: item.id, url: item.imageUrl });
//       // FIN SIMULACIÓN

//     } catch (error) {
//       console.error(`Error al subir la imagen ${item.id}:`, error);
//       toast.error(`Error al subir la imagen ${item.id}.`);
//       uploadedUrls.push({ id: item.id, url: item.imageUrl }); // Mantener el Base64 si falla
//     }
//   }

//   return uploadedUrls;
// };
// const getGreenhousesListRef = (dbInstance, userId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouse_list/meta`
//   );
// };

// // Ruta a los datos diarios de un invernadero
// const getDocRef = (dbInstance, userId, greenhouseId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/daily_data/data`
//   );
// };

// // Ruta a la configuración/meta global de un invernadero
// const getGoalRef = (dbInstance, userId, greenhouseId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/config/config_doc`
//   );
// };

// // =======================================================================
// // === COMPONENTES SECUNDARIOS (INCLUYENDO LOS INLINE CORREGIDOS)
// // =======================================================================
// // (Se asume que InlineGoalInput, InlineGlobalGoalTracker y AuthScreen están completos
// // y que DayEditForm es la versión que incluiste en tu prompt anterior)
// // Dado que el usuario incluyó DayEditForm en el prompt, lo reinserto aquí como
// // función para completar el código principal.

// const InlineGoalInput = ({ globalGoal, updateGoal, formatNumber }) => {
//     const [goal, setGoal] = useState(globalGoal.goal || 0);
//     const [deadline, setDeadline] = useState(globalGoal.deadline || "");

//     useEffect(() => {
//       setGoal(globalGoal.goal || 0);
//       setDeadline(globalGoal.deadline || "");
//     }, [globalGoal]);
//     const handleSave = () => {
//       updateGoal(goal, deadline);
//     };
//     return (
//       <div className="p-6 bg-white rounded-xl shadow-lg">
//         <h3 className="text-xl font-bold text-indigo-700 mb-4">
//           Establecer Meta Global (Kg)
//         </h3>
//         <div className="space-y-3">
//           <input
//             type="number"
//             value={goal}
//             onChange={(e) => setGoal(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//             placeholder="Ej: 50000"
//           />
//           <input
//             type="date"
//             value={deadline}
//             onChange={(e) => setDeadline(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//           />
//           <button
//             onClick={handleSave}
//             className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//           >
//             Guardar Meta
//           </button>
//         </div>
//       </div>
//     );
//   };

// const InlineGlobalGoalTracker = ({
//     globalGoal,
//     dailyTotalSum,
//     formatNumber,
//   }) => {
//     const target = parseFloat(globalGoal.goal) || 0;
//     const progress = dailyTotalSum;
//     const remaining = target - progress;
//     const percentage = target > 0 ? (progress / target) * 100 : 0;
//     const safePercentage = Math.min(100, Math.max(0, percentage));

//     const deadlineDate = globalGoal.deadline
//       ? new Date(globalGoal.deadline)
//       : null;
//     const isPastDeadline = deadlineDate && deadlineDate < new Date();
//     // Clase para el color de la barra de progreso
//     const progressColor = safePercentage >= 100 ? "bg-green-500" : "bg-teal-500";

//     // Icono dinámico para el estado
//     const StatusIcon = ({ isComplete, isNegative }) => {
//       if (isComplete) {
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-8 h-8 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         );
//       }
//       if (isNegative) {
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-8 h-8 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//         );
//       }
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-8 h-8 text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M13 10V3L4 14h7v7l9-11h-7z"
//           />
//         </svg>
//       );
//     };

//     return (
//       <div className="p-6 rounded-xl shadow-xl border-l-4 border-teal-500 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
//         {/* HEADER Y META */}
//         <div className="flex items-center justify-between border-b pb-3 mb-4">
//           <h3 className="text-xl font-bold text-teal-700 flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6 mr-2 text-teal-500 animate-pulse-slow"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//               />
//             </svg>
//             Seguimiento de Meta
//           </h3>
//           <span className="text-2xl font-extrabold text-teal-600">
//             {formatNumber(target)} Kg
//           </span>
//         </div>

//         {/* DETALLE DE FECHA LÍMITE */}
//         {globalGoal.deadline && (
//           <div className="flex justify-between items-center text-sm font-medium mb-4">
//             <p className="text-gray-500 flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4 mr-1"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//               Fecha Límite:
//             </p>
//             <p
//               className={`${
//                 isPastDeadline ? "text-red-600 font-bold" : "text-gray-700"
//               }`}
//             >
//               {globalGoal.deadline} {isPastDeadline && "(Vencida)"}
//             </p>
//           </div>
//         )}

//         {/* BARRA DE PROGRESO */}
//         <div className="mt-4">
//           <div className="flex justify-between mb-1">
//             <span className="text-sm font-semibold text-gray-700">Progreso:</span>

//             <span
//               className={`text-sm font-bold ${
//                 safePercentage >= 100 ? "text-green-600" : "text-teal-600"
//               }`}
//             >
//               {formatNumber(safePercentage)}%
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//             <div
//               className={`h-3 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
//               style={{ width: `${safePercentage}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* RESULTADO (Diferencia) - Usando Grid para Responsividad */}
//         <div
//           className={`mt-6 p-4 rounded-xl flex items-center justify-between space-x-4
//             ${
//               remaining <= 0
//                 ? "bg-green-100 border border-green-300"
//                 : "bg-orange-100 border border-orange-300"
//             }`}
//         >
//           {/* Ícono de Estado */}
//           <div
//             className={`flex-shrink-0 p-2 rounded-full shadow-lg ${
//               remaining <= 0 ? "bg-green-500" : "bg-orange-500"
//             }`}
//           >
//             <StatusIcon isComplete={remaining <= 0} isNegative={remaining > 0} />
//           </div>

//           {/* Texto de Estado */}
//           <div className="flex-grow min-w-0">
//             <p className="font-bold text-base md:text-lg truncate">
//               {remaining <= 0 ? "¡Meta Superada!" : "Producción Restante:"}
//             </p>
//             <p className="text-2xl font-extrabold">
//               {formatNumber(Math.abs(remaining))}
//               <span className="text-lg font-normal ml-1">Kg</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

// const AuthScreen = ({ app }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLogin, setIsLogin] = useState(true);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const auth = getAuth(app);
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setError(null);
//       setLoading(true);
//       try {
//         if (isLogin) {
//           await signInWithEmailAndPassword(auth, email, password);
//         } else {
//           await createUserWithEmailAndPassword(auth, email, password);
//         }
//       } catch (err) {
//         console.error("Error de autenticación:", err);
//         let errorMessage = "Ocurrió un error. Verifica tu correo/contraseña.";
//         if (
//           err.code === "auth/user-not-found" ||
//           err.code === "auth/wrong-password" ||
//           err.code === "auth/invalid-credential"
//         ) {
//           errorMessage = "Correo o contraseña inválidos.";
//         } else if (err.code === "auth/email-already-in-use") {
//           errorMessage = "El correo ya está registrado.";
//         } else if (err.code === "auth/weak-password") {
//           errorMessage = "La contraseña debe tener al menos 6 caracteres.";
//         } else if (err.code === "auth/invalid-email") {
//           errorMessage = "El formato del correo electrónico es inválido.";
//         }
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
//     return (
//       <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl border border-indigo-100">
//         <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
//           {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Correo Electrónico
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
//               placeholder="ejemplo@dominio.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Contraseña
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
//               placeholder="Mínimo 6 caracteres"
//             />
//           </div>
//           {error && (
//             <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
//               {error}
//             </div>
//           )}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
//           >
//             {loading ? "Cargando..." : isLogin ? "Acceder" : "Registrar"}
//           </button>
//         </form>
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setError(null);
//             }}
//             className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition"
//           >
//             {isLogin
//               ? "¿No tienes cuenta? Regístrate aquí."
//               : "¿Ya tienes cuenta? Inicia sesión aquí."}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const DayEditForm = ({
//     dateKey,
//     dailyData,
//     handleItemChange,
//     handleItemBlur,
//     addItem,
//     deleteItem,
//     handleDayClick,
//     handleSave,
//     uploadImages,
//     formatNumber,
//     // 🚨 CORRECCIÓN: Agregar la URL de subida a las props
//     uploadUrl,
// }) => {

//     // --- 1. Obtención y Estabilización de Datos (usando dayData) ---
//     const dayData = dailyData[dateKey] || { items: [] };

//     // ✅ CORRECCIÓN ESLINT: Estabiliza la referencia de 'items'
//     const items = useMemo(() => {
//         return dayData.items || [];
//     }, [dayData.items]);

//     // ✅ Estabiliza el cálculo del total (depende de la referencia estable de items)
//     const dailyTotal = useMemo(() => {
//         return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
//     }, [items]);

//     // --- 2. Estado Local ---
//     const [isSaving, setIsSaving] = useState(false);
//     const [uploading, setUploading] = useState(false);

//     // --- 3. Lógica de Guardado Local ---
//     const handleSaveLocal = async () => {
//         setIsSaving(true);

//         // Identificar imágenes Base64 para subir
//         const imagesToUpload = items.filter(
//             (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
//         );
//         console.log("Imágenes a subir:", imagesToUpload);

//         if (imagesToUpload.length > 0) {
//             setUploading(true);
//             try {
//                 // 🚨 CORRECCIÓN: Usar la prop 'uploadUrl'
//                 const uploadedUrls = await uploadImages(imagesToUpload, uploadUrl);

//                 const updatedItems = items.map((item) => {
//                     const uploaded = uploadedUrls.find(
//                         (urlItem) => urlItem.id === item.id
//                     );
//                     if (uploaded) {
//                         return { ...item, imageUrl: uploaded.url };
//                     }
//                     return item;
//                 });

//                 await handleSave(dateKey, updatedItems);
//             } catch (error) {
//                 console.error("Error al subir imágenes o guardar:", error);
//                 toast.error("Error al guardar: Las imágenes no se pudieron subir.");
//             } finally {
//                 setUploading(false);
//             }
//         } else {
//             // Guardar sin subir imágenes
//             await handleSave(dateKey, items);
//         }

//         setIsSaving(false);
//     };

//     return (
//         <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
//             <button
//                 onClick={() => handleDayClick(dateKey, "day_view")}
//                 className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
//             >
//                 <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     ></path>
//                 </svg>
//                 Volver a la vista del día
//             </button>
//             <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
//                 Editar Productos del Día: {dateKey}
//             </h2>

//             {/* Total Actualizado */}
//             <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
//                 <p className="text-xl font-semibold text-green-800">
//                     Total Producción (Kg) Actual:
//                 </p>
//                 <p className="text-3xl font-extrabold text-green-700">
//                     {formatNumber(dailyTotal)} Kg
//                 </p>
//             </div>

//             <div className="space-y-8">
//                 {items.map((item, index) => (
//                     <ProductItemForm
//                         key={item.id}
//                         item={item}
//                         index={index}
//                         handleItemChange={handleItemChange}
//                         handleItemBlur={() => {}}
//                         deleteItem={deleteItem}
//                     />
//                 ))}
//             </div>

//             <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
//                 <button
//                     onClick={addItem}
//                     className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold
//                     rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
//                     disabled={isSaving}
//                 >
//                     <svg
//                         className="w-5 h-5 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                         ></path>
//                     </svg>
//                     Añadir Producto
//                 </button>
//                 <button
//                     onClick={handleSaveLocal}
//                     className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
//                     disabled={isSaving} // Deshabilitar si ya está guardando
//                 >
//                     {isSaving || uploading
//                         ? `Guardando... (${uploading ? "Subiendo imágenes" : "Datos"})`
//                         : "Guardar Datos del Día"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// // const DayEditForm = ({
// //   dateKey,
// //   dailyData,
// //   handleItemChange,
// //   handleItemBlur,
// //   addItem,
// //   deleteItem,
// //   handleDayClick,
// //   handleSave,
// //   uploadImages,
// //   formatNumber,
// // }) => {
// //   const dayData = dailyData[dateKey] || { items: [] };
// //   // const items = dayData.items || [];
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [uploading, setUploading] = useState(false);
// //   // const dailyTotal = useMemo(
// //   //   () => items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0),
// //   //   [items]
// //   // );
// //   const handleSaveLocal = async () => {
// //     setIsSaving(true);
// //     const imagesToUpload = items.filter(
// //       (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
// //     );
// //     console.log("Imágenes a subir:", imagesToUpload);

// //     if (imagesToUpload.length > 0) {
// //       setUploading(true);
// //       try {
// //         const uploadedUrls = await uploadImages(
// //           imagesToUpload,
// //           YOUR_BACKEND_UPLOAD_URL
// //         );
// //         const updatedItems = items.map((item) => {
// //           const uploaded = uploadedUrls.find(
// //             (urlItem) => urlItem.id === item.id
// //           );
// //           if (uploaded) {
// //             return { ...item, imageUrl: uploaded.url };
// //           }
// //           return item;
// //         });

// //         await handleSave(dateKey, updatedItems);
// //       } catch (error) {
// //         console.error("Error al subir imágenes o guardar:", error);
// //         toast.error("Error al guardar: Las imágenes no se pudieron subir.");
// //       } finally {
// //         setUploading(false);
// //       }
// //     } else {
// //       await handleSave(dateKey, items);
// //     }

// //     setIsSaving(false);
// //   };

// //   const items = useMemo(() => {
// //     // Retorna el array de ítems o un array vacío si no existe
// //     return dayData.items || [];
// // }, [dayData.items]); // Dependencia específica en dayData.items

// // // Tu useMemo posterior (en la línea 32) ahora es estable:
// // const dailyTotal = useMemo(() => {
// //     return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
// // }, [items]);

// //   return (
// //     <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
// //       <button
// //         // CORRECCIÓN: Usar 'dateKey' y volver a la vista de día para ver el resumen
// //         onClick={() => handleDayClick(dateKey, "day_view")}
// //         className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
// //       >
// //         <svg
// //           className="w-4 h-4 mr-1"
// //           fill="none"
// //           stroke="currentColor"
// //           viewBox="0 0 24 24"
// //           xmlns="http://www.w3.org/2000/svg"
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             strokeWidth="2"
// //             d="M10 19l-7-7m0 0l7-7m-7 7h18"
// //           ></path>
// //         </svg>
// //         Volver a la vista del día
// //       </button>
// //       <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
// //         Editar Productos del Día: {dateKey}
// //       </h2>
// //       {/* Total Actualizado */}
// //       <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
// //         <p className="text-xl font-semibold text-green-800">
// //           Total Producción (Kg) Actual:
// //         </p>
// //         <p className="text-3xl font-extrabold text-green-700">
// //           {formatNumber(dailyTotal)} Kg
// //         </p>
// //       </div>
// //       <div className="space-y-8">
// //         {items.map((item, index) => (
// //           <ProductItemForm
// //             key={item.id}
// //             item={item}
// //             index={index}
// //             handleItemChange={handleItemChange}
// //             handleItemBlur={() => {}}
// //             deleteItem={deleteItem}
// //           />
// //         ))}
// //       </div>
// //       <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
// //         <button
// //           onClick={addItem}
// //           className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold
// // rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
// //           disabled={isSaving}
// //         >
// //           <svg
// //             className="w-5 h-5 mr-2"
// //             fill="none"
// //             stroke="currentColor"
// //             viewBox="0 0 24 24"
// //             xmlns="http://www.w3.org/2000/svg"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth="2"
// //               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// //             ></path>
// //           </svg>
// //           Añadir Producto
// //         </button>
// //         <button
// //           onClick={handleSaveLocal}
// //           className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
// //         >
// //           {isSaving || uploading
// //             ? `Guardando... (${uploading ? "Subiendo imágenes" : "Datos"})`
// //             : "Guardar Datos del Día"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // =======================================================================
// // === COMPONENTE PRINCIPAL (APP)
// // =======================================================================

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [dailyData, setDailyData] = useState({});
//   const [globalGoal, setGlobalGoal] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//   const [view, setView] = useState("calendar"); // calendar, day_view, edit_products, edit_costs

//   // NUEVOS ESTADOS para el manejo de invernaderos
//   const [greenhouses, setGreenhouses] = useState([]);
//   const [greenhouseId, setGreenhouseId] = useState(null);
//   const [greenhouseName, setGreenhouseName] = useState("");
//   const hasGlobalData = Object.keys(dailyData).some(key => dailyData[key] && dailyData[key].items.length > 0);

//   // =======================================================================
//   // === AUTENTICACIÓN Y SELECCIÓN DE INVERNADERO
//   // =======================================================================

// const showTemporaryMessage = (message, type) => {
//     switch (type) {
//         case 'info':
//             toast.info(message);
//             break;
//         case 'success':
//             toast.success(message);
//             break;
//         case 'error':
//             toast.error(message);
//             break;
//         default:
//             toast.info(message);
//     }
// };

// const generatePDF = useCallback(
//     async (dateKey) => {
//         // Objeto de día completo
//         const dailyDataEntry = dailyData[dateKey] || { items: [] };

//         // 1. Crear un contenedor temporal con el HTML que queremos capturar.
//         const pdfContent = document.createElement("div");
//         pdfContent.style.width = "210mm"; // Ancho A4
//         pdfContent.style.padding = "15mm 10mm";
//         pdfContent.style.position = "absolute";
//         pdfContent.style.left = "-9999px"; // Ocultar
//         pdfContent.style.fontFamily = "Helvetica, Arial, sans-serif";
//         pdfContent.style.color = "#333333";
//         pdfContent.style.backgroundColor = "#FFFFFF";

//         // 2. Generar el HTML del reporte (Header + Cuerpo + Footer)
//         const totalProduccion = dailyDataEntry.items.reduce(
//             (sum, item) => sum + parseFloat(item.result || 0),
//             0
//         );

//         const rawCost = dailyDataEntry.finalProductionCost;
//         const costeFinal = Number(rawCost || 0).toFixed(2);

//         // NUEVAS VARIABLES DE COSTE
//         const costData = dailyDataEntry.costData || {};
//         const numWorkers = parseFloat(costData.numWorkers || 0);
//         const hoursWorked = parseFloat(costData.hoursWorked || 0);
//         const productionCostVariable = parseFloat(
//             dailyDataEntry.productionCostVariable || 0
//         );

//         const hasCostData =
//             numWorkers > 0 || hoursWorked > 0 || productionCostVariable > 0;

//         const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         });

//         // --- 2.1. Header HTML ---
//         // 🐛 Corrección: Usamos una URL de logo condicional para evitar fallos si es vacía
//         const logoUrl = REPORT_CONFIG.LOGO_URL || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

//         const headerHtml = `
//             <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #E0E7FF; padding-bottom: 15px; margin-bottom: 25px;">
//                 <div style="flex: 1;">
//                     <img src="${logoUrl}" alt="Logo" style="height: 75px; width: auto; max-width: 100%; border-radius: 4px; ${REPORT_CONFIG.LOGO_URL ? '' : 'opacity: 0.2;'}">
//                 </div>
//                 <div style="flex: 2; text-align: center;">
//                     <h1 style="font-size: 26px; font-weight: 700; margin: 0; color: #1E3A8A;">${REPORT_CONFIG.REPORT_TITLE}</h1>
//                     <p style="font-size: 14px; margin: 3px 0 0 0; color: #6B7280; font-style: italic;">${REPORT_CONFIG.COMPANY_NAME}</p>
//                 </div>
//                 <div style="flex: 1; text-align: right;">
//                     <p style="font-size: 11px; margin: 0; color: #9CA3AF;">Fecha de Impresión:</p>
//                     <p style="font-size: 13px; font-weight: 600; margin: 2px 0 0 0; color: #4B5563;">${formatDate(new Date())}</p>
//                 </div>
//             </div>
//             <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #059669; background-color: #F0FDF4; padding: 8px; border-radius: 4px;">Reporte Diario: ${dateDisplay}</h2>
//         `;

//         // --- 2.2. Cuerpo HTML (Productos) ---
//         let bodyHtml = `
//             <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">Productos Detallados:</h3>
//         `;

//         if (dailyDataEntry.items.length === 0) {
//             bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este día.</p>`;
//         } else {
//             // Contenedor de la cuadrícula de productos (Grid de 3 columnas para A4)
//             bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">`;

//             dailyDataEntry.items.forEach((item) => {
//                 const result = parseFloat(item.result || 0);

//                 // 🐛 Corrección: Usamos una imagen de placeholder si la URL es Base64
//                 // (html2canvas a veces falla con Base64 muy grandes o mal formados)
//                 const itemImageUrl = item.imageUrl && item.imageUrl.startsWith("data:image")
//                     ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
//                     : item.imageUrl;

//                 bodyHtml += `
//                     <div style="
//                         border: 1px solid #E0E0E0;
//                         padding: 15px;
//                         border-radius: 12px;
//                         background-color: #FAFAFA;
//                         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                         display: flex;
//                         align-items: flex-start;
//                     ">
//                         ${
//                             itemImageUrl
//                                 ? `<img
//                                         src="${itemImageUrl}"
//                                         alt="Evidencia"
//                                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; flex-shrink: 0; border: 2px solid #D1E5F7;"
//                                     >`
//                                 : `<div style="width: 60px; height: 60px; background-color: #E0E7FF; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1E3A8A; font-weight: 700; flex-shrink: 0;">
//                                         EVIDENCIA
//                                     </div>`
//                         }
//                         <div style="flex-grow: 1;">
//                             <p style="font-size: 16px; font-weight: 800; color: #2563EB; margin: 0 0 8px 0; border-bottom: 1px solid #EEEEEE; padding-bottom: 4px;">
//                                 ${item.productName || "Producto sin nombre"}
//                             </p>
//                             <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280; margin-bottom: 8px;">
//                                 <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Peso(kg): ${parseFloat(
//                                     item.factorA || 0
//                                 )}</span>
//                                 <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Cajas: ${parseFloat(
//                                     item.factorB || 0
//                                 )}</span>
//                             </div>
//                             <div style="background-color: #10B981; padding: 8px 10px; border-radius: 6px; text-align: center;">
//                                 <p style="font-size: 17px; font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: 1px;">TOTAL: ${result} Kg</p>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//             });
//             bodyHtml += `</div>`; // Cierre del contenedor grid
//         }

//         // --- 2.3. Bloque de Costes y Footer ---
//         let costDetailsHtml = "";
//         if (hasCostData) {
//             costDetailsHtml = `
//                 <div style="margin:25px 0 20px;padding:15px;border:2px solid #E0E7FF;border-radius:8px;background-color:#F8FAFF;">
//                     <h4 style="font-size:16px;font-weight:700;color:#1E3A8A;margin-top:0;border-bottom:1px dashed #C7D2FE;padding-bottom:5px;">Detalle de Costes Laborales</h4>
//                     <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:10px;">
//                         <p style="margin:0;color:#4B5563;">Trabajadores:</p>
//                         <p style="margin:0;font-weight:700;color:#2563EB;">${numWorkers.toFixed(0)}</p>
//                     </div>
//                     <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:5px;">
//                         <p style="margin:0;color:#4B5563;">Horas Trabajadas:</p>
//                         <p style="margin:0;font-weight:700;color:#2563EB;">${hoursWorked.toFixed(2)} hrs</p>
//                     </div>
//                     <div style="display:flex;justify-content:space-between;font-size:16px;margin-top:10px;padding-top:5px;border-top:1px solid #E0E7FF;">
//                         <p style="margin:0;font-weight:600;color:#1E3A8A;">Coste Laboral Diario:</p>
//                         <p style="margin:0;font-weight:900;color:#059669;">${productionCostVariable.toFixed(2)} €</p>
//                     </div>
//                 </div>
//             `;
//         }

//         const footerHtml = `
//             <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 10px;">
//                 ${costDetailsHtml}
//                 <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
//                     <div style="flex: 1;">
//                         <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCIÓN TOTAL (Kg):</p>
//                         <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion.toFixed(2)}</p>
//                     </div>
//                     <div style="width: 1px; background-color: #D1E5F7;"></div>
//                     <div style="flex: 1;">
//                         <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/€):</p>
//                         <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
//                     </div>
//                 </div>
//                 <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Horticultura</p>
//             </div>
//         `;

//         pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

//         // 3. Añadir el contenido oculto al body y capturarlo
//         document.body.appendChild(pdfContent);

//         try {
//             // Reemplazando showTemporaryMessage con toast si no existe
//             const showMsg = typeof showTemporaryMessage === 'function' ? showTemporaryMessage : (msg, type) => toast[type](msg);

//             showMsg("Generando PDF...", "info");

//             const canvas = await html2canvas(pdfContent, {
//                 scale: 2,
//                 // Usar CORS es CRÍTICO para imágenes externas (como el logo)
//                 useCORS: true,
//                 // scrollY: -window.scrollY // Descomentar solo si el elemento está en la parte visible
//             });

//             const imgData = canvas.toDataURL("image/jpeg", 1.0);
//             const pdf = new jsPDF("p", "mm", "a4");
//             const imgWidth = 210; // Ancho A4 en mm
//             const pageHeight = 295; // Alto A4 en mm

//             // Calcula la altura de la imagen renderizada manteniendo la proporción A4
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             let heightLeft = imgHeight;

//             let position = 0;

//             // Primer renderizado
//             pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             // Manejo de páginas múltiples (si el contenido es muy largo)
//             while (heightLeft >= 0) {
//                 position = heightLeft - imgHeight;
//                 pdf.addPage();
//                 pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }

//             pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
//             showMsg("PDF generado con éxito.", "success");
//         } catch (error) {
//             console.error("Error al generar el PDF:", error);
//             const showMsg = typeof showTemporaryMessage === 'function' ? showTemporaryMessage : (msg, type) => toast[type](msg);
//             showMsg(
//                 "Error al generar el PDF. Verifica la consola para detalles (posible error de imagen o CORS).",
//                 "error"
//             );
//         } finally {
//             // 4. Limpiar el contenedor temporal
//             document.body.removeChild(pdfContent);
//         }
//     },
//     [dailyData, toast] // Dependencias: dailyData y toast (si se usa directamente)
// );

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//       if (currentUser) {
//         // Al iniciar sesión, cargamos la lista de invernaderos
//         const listRef = getGreenhousesListRef(db, currentUser.uid);
//         onSnapshot(listRef, (docSnap) => {
//           const data = docSnap.data() || { list: [] };
//           const list = data.list || [];
//           setGreenhouses(list);

//           // Si no hay un invernadero seleccionado, selecciona el primero
//           if (list.length > 0 && !greenhouseId) {
//             setGreenhouseId(list[0].id);
//             setGreenhouseName(list[0].name);
//           } else if (list.length > 0 && greenhouseId) {
//              // Asegurarse de que el nombre del invernadero seleccionado esté actualizado
//              const current = list.find(g => g.id === greenhouseId);
//              if(current) setGreenhouseName(current.name);
//           } else if (list.length === 0) {
//             setGreenhouseId(null);
//             setGreenhouseName("");
//           }
//         });
//       } else {
//         setGreenhouses([]);
//         setGreenhouseId(null);
//         setGreenhouseName("");
//         setDailyData({});
//         setGlobalGoal({});
//       }
//     });

//     return () => unsubscribe();
//   }, [greenhouseId]); // Dependencia agregada para asegurar selección inicial

//   // =======================================================================
//   // === FIREBASE: SINCRONIZACIÓN DE DATOS DIARIOS Y METAS
//   // =======================================================================

//   useEffect(() => {
//     if (!user || !greenhouseId) {
//       setDailyData({});
//       setGlobalGoal({});
//       return;
//     }

//     // 1. Sincronizar datos diarios
//     const dailyRef = getDocRef(db, user.uid, greenhouseId);
//     const unsubscribeDaily = onSnapshot(dailyRef, (docSnap) => {
//       const data = docSnap.data() || {};
//       setDailyData(data);
//     });

//     // 2. Sincronizar metas globales
//     const goalRef = getGoalRef(db, user.uid, greenhouseId);
//     const unsubscribeGoal = onSnapshot(goalRef, (docSnap) => {
//       const data = docSnap.data() || {};
//       setGlobalGoal(data);
//     });

//     return () => {
//       unsubscribeDaily();
//       unsubscribeGoal();
//     };
//   }, [user, greenhouseId]);

//   // =======================================================================
//   // === LÓGICA DE MANEJO DE INVERNADEROS (NUEVO)
//   // =======================================================================

//   const handleCreateGreenhouse = async (name) => {
//     if (!user) return;
//     const newId = uuidv4();
//     const listRef = getGreenhousesListRef(db, user.uid);
//     const newGreenhouse = { id: newId, name: name };

//     try {
//       // 1. Añadir a la lista de invernaderos
//       await updateDoc(listRef, {
//         list: arrayUnion(newGreenhouse)
//       }).catch(async (error) => {
//          // Si el documento no existe (primera vez), créalo
//          if (error.code === 'not-found') {
//             await setDoc(listRef, { list: [newGreenhouse] });
//          } else {
//             throw error;
//          }
//       });

//       // 2. Establecer como el invernadero seleccionado
//       setGreenhouseId(newId);
//       setGreenhouseName(name);
//       toast.success(`Invernadero "${name}" creado con éxito.`);
//     } catch (error) {
//       console.error("Error creating greenhouse:", error);
//       toast.error("Error al crear el invernadero.");
//     }
//   };

//   const handleDeleteGreenhouse = async (id, name) => {
//     if (!user || !window.confirm(`¿Estás seguro de eliminar el invernadero "${name}" y TODOS sus datos? Esta acción no se puede deshacer.`)) return;

//     const listRef = getGreenhousesListRef(db, user.uid);
//     const greenhouseToDelete = greenhouses.find(g => g.id === id);

//     if (!greenhouseToDelete) {
//         toast.error("Invernadero no encontrado.");
//         return;
//     }

//     try {
//         // 1. Eliminar de la lista de invernaderos
//         await updateDoc(listRef, {
//             list: arrayRemove(greenhouseToDelete)
//         });

//         // 2. (OPCIONAL) Eliminar los documentos de datos y configuración
//         const dailyRef = getDocRef(db, user.uid, id);
//         const goalRef = getGoalRef(db, user.uid, id);
//         await deleteDoc(dailyRef);
//         await deleteDoc(goalRef);

//         // 3. Reajustar la selección
//         if (greenhouseId === id) {
//             const remaining = greenhouses.filter(g => g.id !== id);
//             if (remaining.length > 0) {
//                 setGreenhouseId(remaining[0].id);
//                 setGreenhouseName(remaining[0].name);
//             } else {
//                 setGreenhouseId(null);
//                 setGreenhouseName("");
//             }
//         }
//         toast.success(`Invernadero "${name}" y sus datos han sido eliminados.`);
//     } catch (error) {
//         console.error("Error deleting greenhouse:", error);
//         toast.error("Error al eliminar el invernadero.");
//     }
//   };

//   const handleSelectGreenhouse = (id, name) => {
//     setGreenhouseId(id);
//     setGreenhouseName(name);
//     setView("calendar"); // Siempre volver al calendario al cambiar
//     setSelectedDate(formatDate(new Date()));
//   };

//   // =======================================================================
//   // === LÓGICA DE MANEJO DE DATOS DIARIOS
//   // =======================================================================

//   // Calculo de suma total para el tracker (MEMO)
//   const dailyTotalSum = useMemo(() => {
//     return Object.values(dailyData).reduce((sum, day) => {
//       const dayTotal = (day.items || []).reduce(
//         (subSum, item) => subSum + parseFloat(item.result || 0),
//         0
//       );
//       return sum + dayTotal;
//     }, 0);
//   }, [dailyData]);

//   // Maneja cambios de mes en el calendario
//   const handleMonthChange = useCallback((newDate) => {
//     setCurrentDate(newDate);
//   }, []);

//   // Maneja click en un día del calendario
//   const handleDayClick = useCallback((dateKey, newView) => {
//     setSelectedDate(dateKey);
//     setView(newView);
//   }, []);

//   // Maneja cambios en el formulario de costos (sólo en estado local)
//   // const handleCostChange = useCallback((dateKey, { numWorkers, hoursWorked }) => {
//   //   setDailyData((prev) => ({
//   //     ...prev,
//   //     [dateKey]: {
//   //       ...prev[dateKey],
//   //       numWorkers,
//   //       hoursWorked,
//   //       ...calculateCosts(
//   //         (prev[dateKey]?.items || []).reduce(
//   //           (sum, item) => sum + parseFloat(item.result || 0),
//   //           0
//   //         ),
//   //         numWorkers,
//   //         hoursWorked
//   //       ),
//   //     },
//   //   }));
//   // }, [dailyData]); // Agregar dailyData como dependencia

// const handleCostChange = useCallback(
//     (dateKey, field, value) => {
//         setDailyData((prevData) => {
//             const dayData = { ...prevData[dateKey] };
//             const costData = { ...dayData.costData };

//             // 1. OBTENER Y DEFINIR 'items' (¡Corregido en pasos anteriores!)
//             const items = dayData.items || [];

//             // 2. 🟢 CORRECCIÓN: Definir 'dailyTotal' aquí
//             const dailyTotal = items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);

//             // 3. (Resto de tu lógica de actualización de costData...)
//             costData[field] = value;

//             const numWorkers = field === 'numWorkers' ? value : costData.numWorkers;
//             const hoursWorked = field === 'hoursWorked' ? value : costData.hoursWorked;

//             // 4. 🟢 CORRECCIÓN: Definir 'costs' aquí
//             const costs = calculateCosts(
//                 dailyTotal, // Usa el dailyTotal DEFINIDO arriba
//                 numWorkers,
//                 hoursWorked
//             );

//             // 5. Aplicar los resultados a costData
//             costData.productionCostVariable = costs.productionCostVariable;
//             costData.finalProductionCost = costs.finalProductionCost; // Usa 'costs' DEFINIDO arriba

//             return {
//                 ...prevData,
//                 [dateKey]: {
//                     ...dayData,
//                     costData: costData,
//                 },
//             };
//         });
//     },
//      [dailyData]
// );

//   // Guarda los costos en Firebase
//   const handleSaveCosts = useCallback(async (dateKey, numWorkers, hoursWorked) => {
//     if (!user || !greenhouseId) return;

//     const currentDay = dailyData[dateKey] || { items: [] };
//     const dailyTotal = (currentDay.items || []).reduce(
//         (sum, item) => sum + parseFloat(item.result || 0),
//         0
//     );

//     const costs = calculateCosts(dailyTotal, numWorkers, hoursWorked);

//     const newData = {
//       ...currentDay,
//       numWorkers,
//       hoursWorked,
//       ...costs,
//     };

//     try {
//       const dailyRef = getDocRef(db, user.uid, greenhouseId);
//       await setDoc(
//         dailyRef,
//         {
//           [dateKey]: newData,
//         },
//         { merge: true }
//       );
//       toast.success(`Costos guardados para ${dateKey}.`);
//     } catch (error) {
//       console.error("Error saving costs to Firestore:", error);
//       toast.error("Error al guardar costos.");
//     }
//   }, [user, greenhouseId, dailyData]);

//   // Maneja cambios en el formulario de productos (sólo en estado local)
//   // const handleItemChange = useCallback((itemId, updates) => {
//   //   setSelectedDate((dateKey) => {
//   //     setDailyData((prev) => {
//   //       const currentDay = prev[dateKey] || { items: [] };
//   //       const updatedItems = currentDay.items.map((item) =>
//   //         item.id === itemId ? { ...item, ...updates } : item
//   //       );

//   //       // Recalcular el total diario y los costos
//   //       const dailyTotal = updatedItems.reduce(
//   //         (sum, item) => sum + parseFloat(item.result || 0),
//   //         0
//   //       );
//   //       const costs = calculateCosts(
//   //         dailyTotal,
//   //         currentDay.numWorkers,
//   //         currentDay.hoursWorked
//   //       );

//   //       return {
//   //         ...prev,
//   //         [dateKey]: {
//   //           ...currentDay,
//   //           items: updatedItems,
//   //           ...costs,
//   //         },
//   //       };
//   //     });
//   //     return dateKey;
//   //   });
//   // }, []);

//   const handleItemChange = useCallback(
//     (itemId, field, value) => {
//         setDailyData(prevData => {
//             const dayData = { ...prevData[selectedDate] };

//             const updatedItems = dayData.items.map(item => {
//                 if (item.id === itemId) {
//                     const newItem = { ...item, [field]: value };

//                     // 1. OBTENER VALORES ACTUALIZADOS Y POR DEFECTO
//                     // Si cambia el nombre, actualiza factorA de PRODUCT_CATALOG.
//                     const productName = field === 'productName' ? value : newItem.productName;
//                     const factorB = field === 'factorB' ? value : newItem.factorB;

//                     // 2. RECALCULAR EL RESULTADO
//                     newItem.result = calculateResult(productName, factorB);

//                     // 3. ACTUALIZAR factorA si el nombre del producto fue editado
//                     if (field === 'productName') {
//                         newItem.factorA = PRODUCT_CATALOG[value] || 0;
//                     }

//                     return newItem;
//                 }
//                 return item;
//             });

//             return {
//                 ...prevData,
//                 [selectedDate]: {
//                     ...dayData,
//                     items: updatedItems,
//                 },
//             };
//         });
//     },
//     [selectedDate] // Depende de selectedDate
// );

//   // Añadir un nuevo producto al día (local)
//   const addItem = useCallback(() => {
//     setSelectedDate((dateKey) => {
//       setDailyData((prev) => {
//         const currentDay = prev[dateKey] || { items: [] };
//         const newItem = {
//           id: uuidv4(),
//           productName: "",
//           factorB: "",
//           factorA: 0,
//           result: "0.00",
//           damagedBoxes: "",
//           notes: "",
//           imageUrl: "",
//         };

//         const updatedItems = [...currentDay.items, newItem];

//         return {
//           ...prev,
//           [dateKey]: {
//             ...currentDay,
//             items: updatedItems,
//           },
//         };
//       });
//       return dateKey;
//     });
//   }, []);

//   // Eliminar un producto (local)
//   const deleteItem = useCallback((itemId) => {
//     setSelectedDate((dateKey) => {
//       setDailyData((prev) => {
//         const currentDay = prev[dateKey] || { items: [] };
//         const updatedItems = currentDay.items.filter((item) => item.id !== itemId);

//         // Recalcular el total diario y los costos
//         const dailyTotal = updatedItems.reduce(
//           (sum, item) => sum + parseFloat(item.result || 0),
//           0
//         );
//         const costs = calculateCosts(
//           dailyTotal,
//           currentDay.numWorkers,
//           currentDay.hoursWorked
//         );

//         return {
//           ...prev,
//           [dateKey]: {
//             ...currentDay,
//             items: updatedItems,
//             ...costs,
//           },
//         };
//       });
//       return dateKey;
//     });
//   }, []);

// const handleSave = useCallback(async (dateKey, items = null, costData = null) => {
//     // Cláusulas de guardia
//     if (!user || !greenhouseId) return;

//     const dailyRef = getDocRef(db, user.uid, greenhouseId);
//     // Obtener los datos existentes (de Firestore o del estado 'dailyData')
//     const existingDayData = dailyData[dateKey] || {};

//     // 1. Determinar el estado base (el que se va a guardar)
//     let newDayData = {
//         ...existingDayData,
//         dateKey: dateKey,
//         // Inicializa items y costData si no existen en el existingData
//         items: existingDayData.items || [],
//         costData: existingDayData.costData || {},
//     };

//     // 2. Procesar la actualización de PRODUCTOS (si se pasan 'items')
//     if (items) {
//         // Recalcular el resultado para cada ítem (por si DayEditForm no lo hizo)
//         const itemsToSave = items.map(item => ({
//             ...item,
//             result: calculateResult(item.productName, item.factorB),
//         }));

//         const dailyTotal = itemsToSave.reduce(
//             (sum, item) => sum + parseFloat(item.result || 0),
//             0
//         );

//         // Actualizar el objeto con los nuevos ítems y el total
//         newDayData.items = itemsToSave;
//         newDayData.dailyTotal = dailyTotal.toFixed(2);

//         // Recalcular los costes si ya existen datos de costes
//         const existingNumWorkers = parseFloat(newDayData.costData.numWorkers || 0);
//         const existingHoursWorked = parseFloat(newDayData.costData.hoursWorked || 0);

//         const costs = calculateCosts(dailyTotal, existingNumWorkers, existingHoursWorked);

//         newDayData = {
//             ...newDayData,
//             ...costs,
//         };
//     }

//     // 3. Procesar la actualización de COSTES (si se pasa 'costData')
//     if (costData) {
//         // Actualizar solo los datos de costes
//         newDayData.costData = costData;

//         // Recalcular los costes con el total de producción existente
//         const dailyTotal = parseFloat(newDayData.dailyTotal || 0);
//         const newNumWorkers = parseFloat(costData.numWorkers || 0);
//         const newHoursWorked = parseFloat(costData.hoursWorked || 0);

//         const costs = calculateCosts(dailyTotal, newNumWorkers, newHoursWorked);

//         newDayData = {
//             ...newDayData,
//             ...costs,
//         };
//     }

//     // 4. Guardar en Firestore y cambiar de vista
//     try {
//         await setDoc(
//             dailyRef,
//             {
//                 [dateKey]: newDayData,
//             },
//             { merge: true }
//         );

//         // 🚀 CORRECCIÓN CLAVE: Volver a la vista de detalle del día para ver el resultado
//         toast.success(`Datos guardados para ${dateKey}.`);
//         handleDayClick(dateKey, "day_view");

//     } catch (error) {
//         console.error("Error saving to Firestore:", error);
//         toast.error("Error al guardar datos.");
//     }
// }, [user, greenhouseId, dailyData, calculateCosts, calculateResult, db, getDocRef, handleDayClick]);

//   // Guardar meta global en Firebase
//   const updateGoal = useCallback(async (goal, deadline) => {
//     if (!user || !greenhouseId) return;

//     try {
//       const goalRef = getGoalRef(db, user.uid, greenhouseId);
//       await setDoc(
//         goalRef,
//         { goal: parseFloat(goal) || 0, deadline },
//         { merge: true }
//       );
//       toast.success("Meta global actualizada.");
//     } catch (error) {
//       console.error("Error updating goal in Firestore:", error);
//       toast.error("Error al actualizar la meta.");
//     }
//   }, [user, greenhouseId]);

//   // =======================================================================
//   // === RENDERIZADO PRINCIPAL
//   // =======================================================================

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <p className="text-xl text-indigo-700">Cargando aplicación...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <AuthScreen app={app} />
//       </div>
//     );
//   }

//   // Si está autenticado pero no hay invernaderos
//   if (greenhouses.length === 0 && !greenhouseId) {
//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <header className="flex justify-between items-center py-4 border-b border-indigo-200 mb-6">
//                 <h1 className="text-3xl font-extrabold text-indigo-700">
//                     Horticultura App 🪴
//                 </h1>
//                 <button
//                     onClick={() => signOut(auth)}
//                     className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                 >
//                     Cerrar Sesión
//                 </button>
//             </header>
//             <div className="max-w-xl mx-auto p-10 bg-white rounded-xl shadow-2xl text-center">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
//                     ¡Bienvenido!
//                 </h2>
//                 <p className="mb-6 text-gray-600">
//                     Aún no tienes invernaderos registrados. Comienza creando uno para gestionar tus inventarios.
//                 </p>
//                 <GreenhouseSelector // Usamos el selector para la creación
//                   greenhouses={greenhouses}
//                   greenhouseId={greenhouseId}
//                   handleSelectGreenhouse={handleSelectGreenhouse}
//                   handleCreateGreenhouse={handleCreateGreenhouse}
//                   handleDeleteGreenhouse={handleDeleteGreenhouse}
//                   showManagementButtons={true} // Forzar visibilidad
//                 />
//             </div>
//         </div>
//     );
// }

// const renderContent = () => {
//     switch (view) {
//       case "calendar":
//         return (
//           // Contenedor principal del calendario y estadísticas
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

//             {/* Columna Izquierda: Calendario */}
//             <div className="lg:col-span-2">
//               <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
//                 Producción - {greenhouseName} 📅
//               </h2>
//               <div className="bg-white p-2 md:p-6 rounded-xl shadow-2xl">
//                  <CalendarGrid
//                     currentDate={currentDate}
//                     dailyData={dailyData}
//                     selectedDate={selectedDate}
//                     handleMonthChange={handleMonthChange}
//                     handleDayClick={handleDayClick}
//                     formatNumber={formatNumber}
//                     setSelectedDate={setSelectedDate}
//                  />
//               </div>
//             </div>

//             {/* Columna Derecha: Estadísticas y Meta (Stack en móviles) */}
//             <div className="space-y-6 pt-4 lg:pt-0">
//               <DatosEstadisticosCard dailyData={dailyData} formatNumber={formatNumber} />
//               <InlineGlobalGoalTracker
//                 globalGoal={globalGoal}
//                 dailyTotalSum={dailyTotalSum}
//                 formatNumber={formatNumber}
//               />
//               <InlineGoalInput
//                 globalGoal={globalGoal}
//                 updateGoal={updateGoal}
//                 formatNumber={formatNumber}
//               />
//             </div>
//           </div>
//         );

//       case "day_view":
//         return (
//           <DayProductsGrid
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleDayClick={handleDayClick}
//             formatNumber={formatNumber}
//             calculateCosts={calculateCosts}
//             generatePDF={generatePDF}
//             REPORT_CONFIG={REPORT_CONFIG}
//           />
//         );

//       case "edit_products":
//         return (
//           <DayEditForm
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleItemChange={handleItemChange}
//             addItem={addItem}
//             deleteItem={deleteItem}
//             handleDayClick={handleDayClick}
//             handleSave={handleSave}
//             uploadImages={uploadImages}
//             formatNumber={formatNumber}
//             uploadUrl={YOUR_BACKEND_UPLOAD_URL}
//           />
//         );

//       case "edit_costs":
//         return (
//           <CostEditForm
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleDayClick={handleDayClick}
//             handleSave={handleSave}
//             formatNumber ={formatNumber }
//             calculateCosts={calculateCosts}
//             HOURLY_COST_RATE={HOURLY_COST_RATE}
//           />
//         );

//       default:
//         return <div className="p-6 text-center text-gray-500">Vista no encontrada.</div>;
//     }
// };

// // =================================================================
// // Componente Principal (Retorno JSX)
// // =================================================================
// return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">

//       {/* HEADER */}
//       <header className="sticky top-0 z-10 bg-white p-4 rounded-xl shadow-2xl mb-8 border-t-4 border-indigo-600">
//         <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

//           {/* Título Principal */}
//           <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex items-center">
//             <svg
//               className="w-7 h-7 md:w-8 md:h-8 mr-2 text-indigo-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 14v6m-3-3h6m-3-6h.01M5 14h.01M12 20h.01M12 10h.01M3 20h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
//               ></path>
//             </svg>
//             Gestión de Inventario 🥬
//           </h1>

//           {/* Controles y Log Out */}
//           <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">

//             {/* Selector de Invernaderos (Visible en todas partes) */}
//             <GreenhouseSelector
//               greenhouses={greenhouses}
//               greenhouseId={greenhouseId}
//               handleSelectGreenhouse={handleSelectGreenhouse}
//               handleCreateGreenhouse={handleCreateGreenhouse}
//               handleDeleteGreenhouse={handleDeleteGreenhouse}
//               showManagementButtons={view === "calendar"}
//             />

//             {/* Botón de Cerrar Sesión */}
//             <button
//               onClick={() => signOut(auth)}
//               className="w-full sm:w-auto py-2 px-4 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base"
//             >
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
//               Cerrar Sesión
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* BOTONES DE EXPORTACIÓN (Fuera del header, solo visibles en vista 'calendar' y centrados) */}
//       {view === "calendar" && (
//           <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
//               {/* Botón de Exportación Diaria */}
//               <button
//                   className="
//                       w-full sm:w-auto flex items-center justify-center
//                       px-6 py-3
//                       bg-green-600 text-white text-sm
//                       rounded-lg font-semibold shadow-md
//                       hover:bg-green-500 transition duration-300
//                       disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//                   "
//                   onClick={() => exportToCsv(dailyData, selectedDate)}
//                   disabled={!dailyData[selectedDate] || dailyData[selectedDate].items.length === 0}
//                   title={`Descargar datos de producción del día ${selectedDate} en formato CSV`}
//               >
//                   <FaFileCsv size={16} className="mr-2" />
//                   Exportar Día ({selectedDate})
//               </button>

//               {/* Botón de Exportación Global */}
//               <button
//                   className="
//                       w-full sm:w-auto flex items-center justify-center
//                       px-6 py-3
//                       bg-indigo-600 text-white text-sm
//                       rounded-lg font-semibold shadow-md
//                       hover:bg-indigo-500 transition duration-300
//                       disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//                   "
//                   onClick={() => exportAllToCsv(dailyData)}
//                   disabled={!hasGlobalData}
//                   title="Descargar todos los datos históricos de producción en un solo archivo CSV"
//               >
//                   <FaFileDownload size={16} className="mr-2" />
//                   Exportar Datos Globales (CSV)
//               </button>
//           </div>
//       )}

//       {/* CONTENIDO PRINCIPAL (CalendarGrid / DayProductsGrid / etc) */}
//       <div className="bg-white p-4 md:p-8 rounded-xl shadow-2xl">
//           {renderContent()}
//       </div>

//     </div>
// );
// }

// export default App;

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { initializeApp } from "firebase/app";
// import { FaFileCsv } from "react-icons/fa";
// import { FaFileDownload } from "react-icons/fa";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "react-toastify";

// // 🎯 IMPORTACIÓN DE COMPONENTES EXTERNOS
// import CostEditForm from "../../components/CostEditForm";
// import CalendarGrid from "../../components/CalendarGrid";
// import ProductItemForm from "../../components/ProductItemForm";
// import DayProductsGrid from "../../components/DayProductsGrid";
// import DatosEstadisticosCard from "./DatosEstadisticosCard";
// import GreenhouseSelector from "../../components/GreenhouseSelector"; // Nuevo Componente
// // 🔥 REEMPLAZA ESTO CON TU CONFIGURACIÓN REAL DE FIREBASE 🔥
// import { firebaseConfig } from "../../firebaseConfig";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // =======================================================================
// // === CONFIGURACIÓN Y UTILIDADES
// // =======================================================================

// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// const REPORT_CONFIG = {
//   COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
//   REPORT_TITLE: "Finca Balsicas Producción S.A.",
//   LOGO_URL:
//     "data:image/png;base64,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",
// };
// const isProduction = process.env.NODE_ENV === "production";
// const LOCAL_URL = "http://localhost:4500/api/upload/image";
// const PRODUCTION_URL =
//   "https://gestion-horticultura.netlify.app/api/upload/image";
// const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

// // Inicialización de Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- DATOS FIJOS Y CONSTANTES ---
// const HOURLY_COST_RATE = 10;
// const PRODUCT_CATALOG = {
//   "IFCO 6410": 10,
//   "IFCO 4312": 5,
//   CARTON: 8,
//   "NARANJA 2°": 16,
//   "SAMPER 1°": 12,
//   "SAMPER 2°": 15,
// };
// const INITIAL_GREENHOUSE_CONFIG = {
//   goal: 0,
//   deadline: "",
//   // Campos del modal/tarjeta que quieres inicializar
//   cropName: "Sin nombre",
//   associatedPlot: "Sin asociar",
//   plantedArea: "0",
//   plantedAreaUnit: "ha",
//   createRecommendation: false,
//   productionMode: "Sin definir",
//   protectionType: "Sin definir",
// };

// // --- FUNCIONES DE UTILIDAD ---

// const formatNumber = (num, decimales = 2) => {
//   if (num === null || num === undefined || isNaN(num)) return "0.00";
//   return Number(num).toLocaleString("es-ES", {
//     minimumFractionDigits: decimales,
//     maximumFractionDigits: decimales,
//     useGrouping: true,
//   });
// };
// const formatDate = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };
// const calculateResult = (productName, factorB) => {
//   const factorA = PRODUCT_CATALOG[productName] || 0;
//   const b = parseFloat(factorB) || 0;
//   return (factorA * b).toFixed(2);
// };

// const calculateCosts = (dailyTotal, numWorkers, hoursWorked) => {
//   const dailyLaborCost =
//     (parseFloat(numWorkers) || 0) *
//     (parseFloat(hoursWorked) || 0) *
//     HOURLY_COST_RATE;
//   const productionCostVariable = parseFloat(dailyLaborCost).toFixed(2);

//   let finalProductionCost = 0;
//   if (dailyTotal > 0) {
//     finalProductionCost = (dailyLaborCost / dailyTotal).toFixed(4);
//   }

//   return { productionCostVariable, finalProductionCost };
// };

// const exportToCsv = (dailyData, dateKeyToExport = null) => {
//   // Si no se proporciona una clave, no podemos exportar.
//   if (!dateKeyToExport || !dailyData[dateKeyToExport]) {
//     toast.error("Selecciona un día con datos para exportar.");
//     return;
//   }

//   const data = dailyData[dateKeyToExport];
//   const dateDisplay = dateKeyToExport; // Formato YYYY-MM-DD

//   // 1. Definir las cabeceras del CSV
//   const headers = [
//     "Fecha",
//     "Nombre Producto",
//     "Peso (kg)",
//     "Cajas",
//     "Produccion Total (kg)",
//     "Costo Final (€/kg)",
//   ].join(";"); // Usamos el punto y coma (;) como separador para compatibilidad

//   // 2. Mapear los datos de los productos
//   const csvRows = data.items.map((item) => {
//     const row = [
//       dateDisplay,
//       item.productName || "N/A",
//       parseFloat(item.factorA || 0)
//         .toFixed(2)
//         .replace(".", ","), // Usar coma para decimales
//       parseFloat(item.factorB || 0)
//         .toFixed(2)
//         .replace(".", ","),
//       parseFloat(item.result || 0)
//         .toFixed(2)
//         .replace(".", ","),
//       Number(data.finalProductionCost || 0)
//         .toFixed(2)
//         .replace(".", ","),
//     ];
//     return row.join(";");
//   });

//   // 3. Unir cabeceras y filas
//   const csvContent = [headers, ...csvRows].join("\n");

//   // 4. Crear y descargar el archivo
//   const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
//     type: "text/csv;charset=utf-8;",
//   }); // Se añade BOM para codificación UTF-8
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", `Reporte_Produccion_${dateDisplay}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   toast.success(`Datos de ${dateDisplay} exportados correctamente a CSV. 📥`);
// };

// const exportAllToCsv = (dailyData) => {
//   // 1. Verificar si hay datos
//   const allDateKeys = Object.keys(dailyData).filter(
//     (key) => dailyData[key] && dailyData[key].items.length > 0
//   );

//   if (allDateKeys.length === 0) {
//     toast.error("No hay datos registrados en el calendario para exportar.");
//     return;
//   }

//   // 2. Definir las cabeceras del CSV
//   // Incluimos el Coste Total Diario y el Coste Final (€/kg)
//   const headers = [
//     "Fecha",
//     "Nombre Producto",
//     "Peso (kg)",
//     "Cajas",
//     "Produccion Total Producto (kg)",
//     "Coste Final Diario (€/kg)", // Coste calculado por Kilo ese día
//     "Coste Laboral Diario (€)", // Coste laboral total de ese día
//     "Total Produccion Dia (kg)", // Producción total del día
//   ].join(";");

//   let csvRows = [];

//   // 3. Iterar sobre CADA DÍA en dailyData
//   allDateKeys.forEach((dateKey) => {
//     const data = dailyData[dateKey];
//     const dateDisplay = dateKey; // Formato YYYY-MM-DD

//     // Variables globales del día
//     const costeFinalDia = Number(data.finalProductionCost || 0)
//       .toFixed(2)
//       .replace(".", ",");
//     const costeLaboralDia = Number(data.productionCostVariable || 0)
//       .toFixed(2)
//       .replace(".", ",");

//     const totalProduccionDia = data.items
//       .reduce((sum, item) => sum + parseFloat(item.result || 0), 0)
//       .toFixed(2)
//       .replace(".", ",");

//     // 4. Mapear los datos de los productos de CADA DÍA
//     data.items.forEach((item) => {
//       const row = [
//         dateDisplay,
//         item.productName || "N/A",
//         parseFloat(item.factorA || 0)
//           .toFixed(2)
//           .replace(".", ","),
//         parseFloat(item.factorB || 0)
//           .toFixed(2)
//           .replace(".", ","),
//         parseFloat(item.result || 0)
//           .toFixed(2)
//           .replace(".", ","),
//         costeFinalDia,
//         costeLaboralDia,
//         totalProduccionDia,
//       ];
//       csvRows.push(row.join(";"));
//     });
//   });

//   // 5. Unir cabeceras y filas
//   const csvContent = [headers, ...csvRows].join("\n");

//   // 6. Crear y descargar el archivo
//   const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
//     type: "text/csv;charset=utf-8;",
//   });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   // Nombre del archivo: incluir la fecha actual para que sea único
//   const today = new Date().toISOString().split("T")[0];
//   link.setAttribute("download", `Reporte_Produccion_GLOBAL_${today}.csv`);

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   toast.success(
//     `Exportación global completada: ${csvRows.length} líneas de producto descargadas. 💾`
//   );
// };

// const uploadImages = async (imagesToUpload, uploadUrl) => {
//   const uploadedUrls = [];
//   for (const item of imagesToUpload) {
//     try {
//       console.log(`Subiendo imagen ${item.id} a: ${uploadUrl}`);
//       // Simulación: en un entorno real, descomentarías el fetch real
//       /*
//       const response = await fetch(uploadUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           image: item.imageUrl,
//           itemId: item.id,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.secure_url) {
//         uploadedUrls.push({ id: item.id, url: data.secure_url });
//       } else {
//         console.warn(`Backend no devolvió secure_url para el ítem ${item.id}.`);
//         uploadedUrls.push({ id: item.id, url: item.imageUrl });
//       }
//       */
//       // SIMULACIÓN DE SUBIDA EXITOSA (MANTENER Base64)
//       uploadedUrls.push({ id: item.id, url: item.imageUrl });
//       // FIN SIMULACIÓN
//     } catch (error) {
//       console.error(`Error al subir la imagen ${item.id}:`, error);
//       toast.error(`Error al subir la imagen ${item.id}.`);
//       uploadedUrls.push({ id: item.id, url: item.imageUrl }); // Mantener el Base64 si falla
//     }
//   }

//   return uploadedUrls;
// };
// const getGreenhousesListRef = (dbInstance, userId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouse_list/meta`
//   );
// };

// // Ruta a los datos diarios de un invernadero
// const getDocRef = (dbInstance, userId, greenhouseId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/daily_data/data`
//   );
// };

// // Ruta a la configuración/meta global de un invernadero
// const getGoalRef = (dbInstance, userId, greenhouseId) => {
//   return doc(
//     dbInstance,
//     `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/config/config_doc`
//   );
// };

// // =======================================================================
// // === COMPONENTES SECUNDARIOS (INCLUYENDO LOS INLINE CORREGIDOS)
// // =======================================================================
// // (Se asume que InlineGoalInput, InlineGlobalGoalTracker y AuthScreen están completos
// // y que DayEditForm es la versión que incluiste en tu prompt anterior)
// // Dado que el usuario incluyó DayEditForm en el prompt, lo reinserto aquí como
// // función para completar el código principal.

// const InlineGoalInput = ({ globalGoal, updateGoal, formatNumber }) => {
//   const [goal, setGoal] = useState(globalGoal.goal || 0);
//   const [deadline, setDeadline] = useState(globalGoal.deadline || "");

//   useEffect(() => {
//     setGoal(globalGoal.goal || 0);
//     setDeadline(globalGoal.deadline || "");
//   }, [globalGoal]);
//   const handleSave = () => {
//     updateGoal(goal, deadline);
//   };
//   return (
//     <div className="p-6 bg-white rounded-xl shadow-lg">
//       <h3 className="text-xl font-bold text-indigo-700 mb-4">
//         Establecer Meta Global (Kg)
//       </h3>
//       <div className="space-y-3">
//         <input
//           type="number"
//           value={goal}
//           onChange={(e) => setGoal(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//           placeholder="Ej: 50000"
//         />
//         <input
//           type="date"
//           value={deadline}
//           onChange={(e) => setDeadline(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//         />
//         <button
//           onClick={handleSave}
//           className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//         >
//           Guardar Meta
//         </button>
//       </div>
//     </div>
//   );
// };

// const InlineGlobalGoalTracker = ({
//   globalGoal,
//   dailyTotalSum,
//   formatNumber,
// }) => {
//   const target = parseFloat(globalGoal.goal) || 0;
//   const progress = dailyTotalSum;
//   const remaining = target - progress;
//   const percentage = target > 0 ? (progress / target) * 100 : 0;
//   const safePercentage = Math.min(100, Math.max(0, percentage));

//   const deadlineDate = globalGoal.deadline
//     ? new Date(globalGoal.deadline)
//     : null;
//   const isPastDeadline = deadlineDate && deadlineDate < new Date();
//   // Clase para el color de la barra de progreso
//   const progressColor = safePercentage >= 100 ? "bg-green-500" : "bg-teal-500";

//   // Icono dinámico para el estado
//   const StatusIcon = ({ isComplete, isNegative }) => {
//     if (isComplete) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-8 h-8 text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       );
//     }
//     if (isNegative) {
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-8 h-8 text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//           />
//         </svg>
//       );
//     }
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-8 h-8 text-white"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth={2}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M13 10V3L4 14h7v7l9-11h-7z"
//         />
//       </svg>
//     );
//   };

//   return (
//     <div className="p-6 rounded-xl shadow-xl border-l-4 border-teal-500 bg-white hover:shadow-2xl transition duration-300 ease-in-out">
//       {/* HEADER Y META */}
//       <div className="flex items-center justify-between border-b pb-3 mb-4">
//         <h3 className="text-xl font-bold text-teal-700 flex items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 mr-2 text-teal-500 animate-pulse-slow"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//             />
//           </svg>
//           Seguimiento de Meta
//         </h3>
//         <span className="text-2xl font-extrabold text-teal-600">
//           {formatNumber(target)} Kg
//         </span>
//       </div>

//       {/* DETALLE DE FECHA LÍMITE */}
//       {globalGoal.deadline && (
//         <div className="flex justify-between items-center text-sm font-medium mb-4">
//           <p className="text-gray-500 flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//             Fecha Límite:
//           </p>
//           <p
//             className={`${
//               isPastDeadline ? "text-red-600 font-bold" : "text-gray-700"
//             }`}
//           >
//             {globalGoal.deadline} {isPastDeadline && "(Vencida)"}
//           </p>
//         </div>
//       )}

//       {/* BARRA DE PROGRESO */}
//       <div className="mt-4">
//         <div className="flex justify-between mb-1">
//           <span className="text-sm font-semibold text-gray-700">Progreso:</span>

//           <span
//             className={`text-sm font-bold ${
//               safePercentage >= 100 ? "text-green-600" : "text-teal-600"
//             }`}
//           >
//             {formatNumber(safePercentage)}%
//           </span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//           <div
//             className={`h-3 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
//             style={{ width: `${safePercentage}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* RESULTADO (Diferencia) - Usando Grid para Responsividad */}
//       <div
//         className={`mt-6 p-4 rounded-xl flex items-center justify-between space-x-4
//             ${
//               remaining <= 0
//                 ? "bg-green-100 border border-green-300"
//                 : "bg-orange-100 border border-orange-300"
//             }`}
//       >
//         {/* Ícono de Estado */}
//         <div
//           className={`flex-shrink-0 p-2 rounded-full shadow-lg ${
//             remaining <= 0 ? "bg-green-500" : "bg-orange-500"
//           }`}
//         >
//           <StatusIcon isComplete={remaining <= 0} isNegative={remaining > 0} />
//         </div>

//         {/* Texto de Estado */}
//         <div className="flex-grow min-w-0">
//           <p className="font-bold text-base md:text-lg truncate">
//             {remaining <= 0 ? "¡Meta Superada!" : "Producción Restante:"}
//           </p>
//           <p className="text-2xl font-extrabold">
//             {formatNumber(Math.abs(remaining))}
//             <span className="text-lg font-normal ml-1">Kg</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ app }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLogin, setIsLogin] = useState(true);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const auth = getAuth(app);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       console.error("Error de autenticación:", err);
//       let errorMessage = "Ocurrió un error. Verifica tu correo/contraseña.";
//       if (
//         err.code === "auth/user-not-found" ||
//         err.code === "auth/wrong-password" ||
//         err.code === "auth/invalid-credential"
//       ) {
//         errorMessage = "Correo o contraseña inválidos.";
//       } else if (err.code === "auth/email-already-in-use") {
//         errorMessage = "El correo ya está registrado.";
//       } else if (err.code === "auth/weak-password") {
//         errorMessage = "La contraseña debe tener al menos 6 caracteres.";
//       } else if (err.code === "auth/invalid-email") {
//         errorMessage = "El formato del correo electrónico es inválido.";
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl border border-indigo-100">
//       <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
//         {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Correo Electrónico
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
//             placeholder="ejemplo@dominio.com"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Contraseña
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
//             placeholder="Mínimo 6 caracteres"
//           />
//         </div>
//         {error && (
//           <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
//             {error}
//           </div>
//         )}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
//         >
//           {loading ? "Cargando..." : isLogin ? "Acceder" : "Registrar"}
//         </button>
//       </form>
//       <div className="mt-6 text-center">
//         <button
//           onClick={() => {
//             setIsLogin(!isLogin);
//             setError(null);
//           }}
//           className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition"
//         >
//           {isLogin
//             ? "¿No tienes cuenta? Regístrate aquí."
//             : "¿Ya tienes cuenta? Inicia sesión aquí."}
//         </button>
//       </div>
//     </div>
//   );
// };

// const DayEditForm = ({
//   dateKey,
//   dailyData,
//   handleItemChange,
//   handleItemBlur,
//   addItem,
//   deleteItem,
//   handleDayClick,
//   handleSave,
//   uploadImages,
//   formatNumber,
//   // 🚨 CORRECCIÓN: Agregar la URL de subida a las props
//   uploadUrl,
// }) => {
//   // --- 1. Obtención y Estabilización de Datos (usando dayData) ---
//   const dayData = dailyData[dateKey] || { items: [] };

//   // ✅ CORRECCIÓN ESLINT: Estabiliza la referencia de 'items'
//   const items = useMemo(() => {
//     return dayData.items || [];
//   }, [dayData.items]);

//   // ✅ Estabiliza el cálculo del total (depende de la referencia estable de items)
//   const dailyTotal = useMemo(() => {
//     return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
//   }, [items]);

//   // --- 2. Estado Local ---
//   const [isSaving, setIsSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   // --- 3. Lógica de Guardado Local ---
//   const handleSaveLocal = async () => {
//     setIsSaving(true);

//     // Identificar imágenes Base64 para subir
//     const imagesToUpload = items.filter(
//       (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
//     );
//     console.log("Imágenes a subir:", imagesToUpload);

//     if (imagesToUpload.length > 0) {
//       setUploading(true);
//       try {
//         // 🚨 CORRECCIÓN: Usar la prop 'uploadUrl'
//         const uploadedUrls = await uploadImages(imagesToUpload, uploadUrl);

//         const updatedItems = items.map((item) => {
//           const uploaded = uploadedUrls.find(
//             (urlItem) => urlItem.id === item.id
//           );
//           if (uploaded) {
//             return { ...item, imageUrl: uploaded.url };
//           }
//           return item;
//         });

//         await handleSave(dateKey, updatedItems);
//       } catch (error) {
//         console.error("Error al subir imágenes o guardar:", error);
//         toast.error("Error al guardar: Las imágenes no se pudieron subir.");
//       } finally {
//         setUploading(false);
//       }
//     } else {
//       // Guardar sin subir imágenes
//       await handleSave(dateKey, items);
//     }

//     setIsSaving(false);
//   };

//   return (
//     <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
//       <button
//         onClick={() => handleDayClick(dateKey, "day_view")}
//         className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
//       >
//         <svg
//           className="w-4 h-4 mr-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M10 19l-7-7m0 0l7-7m-7 7h18"
//           ></path>
//         </svg>
//         Volver a la vista del día
//       </button>
//       <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
//         Editar Productos del Día: {dateKey}
//       </h2>

//       {/* Total Actualizado */}
//       <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
//         <p className="text-xl font-semibold text-green-800">
//           Total Producción (Kg) Actual:
//         </p>
//         <p className="text-3xl font-extrabold text-green-700">
//           {formatNumber(dailyTotal)} Kg
//         </p>
//       </div>

//       <div className="space-y-8">
//         {items.map((item, index) => (
//           <ProductItemForm
//             key={item.id}
//             item={item}
//             index={index}
//             handleItemChange={handleItemChange}
//             handleItemBlur={() => {}}
//             deleteItem={deleteItem}
//           />
//         ))}
//       </div>

//       <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
//         <button
//           onClick={addItem}
//           className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold
//                     rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
//           disabled={isSaving}
//         >
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//             ></path>
//           </svg>
//           Añadir Producto
//         </button>
//         <button
//           onClick={handleSaveLocal}
//           className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
//           disabled={isSaving} // Deshabilitar si ya está guardando
//         >
//           {isSaving || uploading
//             ? `Guardando... (${uploading ? "Subiendo imágenes" : "Datos"})`
//             : "Guardar Datos del Día"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // const DayEditForm = ({
// //   dateKey,
// //   dailyData,
// //   handleItemChange,
// //   handleItemBlur,
// //   addItem,
// //   deleteItem,
// //   handleDayClick,
// //   handleSave,
// //   uploadImages,
// //   formatNumber,
// // }) => {
// //   const dayData = dailyData[dateKey] || { items: [] };
// //   // const items = dayData.items || [];
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [uploading, setUploading] = useState(false);
// //   // const dailyTotal = useMemo(
// //   //   () => items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0),
// //   //   [items]
// //   // );
// //   const handleSaveLocal = async () => {
// //     setIsSaving(true);
// //     const imagesToUpload = items.filter(
// //       (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
// //     );
// //     console.log("Imágenes a subir:", imagesToUpload);

// //     if (imagesToUpload.length > 0) {
// //       setUploading(true);
// //       try {
// //         const uploadedUrls = await uploadImages(
// //           imagesToUpload,
// //           YOUR_BACKEND_UPLOAD_URL
// //         );
// //         const updatedItems = items.map((item) => {
// //           const uploaded = uploadedUrls.find(
// //             (urlItem) => urlItem.id === item.id
// //           );
// //           if (uploaded) {
// //             return { ...item, imageUrl: uploaded.url };
// //           }
// //           return item;
// //         });

// //         await handleSave(dateKey, updatedItems);
// //       } catch (error) {
// //         console.error("Error al subir imágenes o guardar:", error);
// //         toast.error("Error al guardar: Las imágenes no se pudieron subir.");
// //       } finally {
// //         setUploading(false);
// //       }
// //     } else {
// //       await handleSave(dateKey, items);
// //     }

// //     setIsSaving(false);
// //   };

// //   const items = useMemo(() => {
// //     // Retorna el array de ítems o un array vacío si no existe
// //     return dayData.items || [];
// // }, [dayData.items]); // Dependencia específica en dayData.items

// // // Tu useMemo posterior (en la línea 32) ahora es estable:
// // const dailyTotal = useMemo(() => {
// //     return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
// // }, [items]);

// //   return (
// //     <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
// //       <button
// //         // CORRECCIÓN: Usar 'dateKey' y volver a la vista de día para ver el resumen
// //         onClick={() => handleDayClick(dateKey, "day_view")}
// //         className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
// //       >
// //         <svg
// //           className="w-4 h-4 mr-1"
// //           fill="none"
// //           stroke="currentColor"
// //           viewBox="0 0 24 24"
// //           xmlns="http://www.w3.org/2000/svg"
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             strokeWidth="2"
// //             d="M10 19l-7-7m0 0l7-7m-7 7h18"
// //           ></path>
// //         </svg>
// //         Volver a la vista del día
// //       </button>
// //       <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
// //         Editar Productos del Día: {dateKey}
// //       </h2>
// //       {/* Total Actualizado */}
// //       <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
// //         <p className="text-xl font-semibold text-green-800">
// //           Total Producción (Kg) Actual:
// //         </p>
// //         <p className="text-3xl font-extrabold text-green-700">
// //           {formatNumber(dailyTotal)} Kg
// //         </p>
// //       </div>
// //       <div className="space-y-8">
// //         {items.map((item, index) => (
// //           <ProductItemForm
// //             key={item.id}
// //             item={item}
// //             index={index}
// //             handleItemChange={handleItemChange}
// //             handleItemBlur={() => {}}
// //             deleteItem={deleteItem}
// //           />
// //         ))}
// //       </div>
// //       <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
// //         <button
// //           onClick={addItem}
// //           className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold
// // rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
// //           disabled={isSaving}
// //         >
// //           <svg
// //             className="w-5 h-5 mr-2"
// //             fill="none"
// //             stroke="currentColor"
// //             viewBox="0 0 24 24"
// //             xmlns="http://www.w3.org/2000/svg"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               strokeWidth="2"
// //               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// //             ></path>
// //           </svg>
// //           Añadir Producto
// //         </button>
// //         <button
// //           onClick={handleSaveLocal}
// //           className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
// //         >
// //           {isSaving || uploading
// //             ? `Guardando... (${uploading ? "Subiendo imágenes" : "Datos"})`
// //             : "Guardar Datos del Día"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // =======================================================================
// // === COMPONENTE PRINCIPAL (APP)
// // =======================================================================

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [dailyData, setDailyData] = useState({});
//   const [globalGoal, setGlobalGoal] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
//   const [view, setView] = useState("calendar"); // calendar, day_view, edit_products, edit_costs

//   // 🎯 NUEVOS ESTADOS PARA GESTIÓN DE INVERNADEROS 🎯
//   // 1. Lista de todos los invernaderos disponibles para el selector
//   const [greenhousesList, setGreenhousesList] = useState([]);
//   // Ejemplo inicial: [{ id: 'inv-1', name: 'Invernadero 1' }, { id: 'inv-2', name: 'Invernadero 2' }]

//   // 2. ID del invernadero actualmente seleccionado
//   const [selectedGreenhouseId, setSelectedGreenhouseId] = useState(null);

//   // 3. Configuración específica del cultivo para el invernadero seleccionado
//   // Estos son los datos que maneja DatosEstadisticosCard / Datos
//   const [greenhouseConfig, setGreenhouseConfig] = useState(
//     INITIAL_GREENHOUSE_CONFIG
//   );

//   // NUEVOS ESTADOS para el manejo de invernaderos
//   const [greenhouses, setGreenhouses] = useState([]);
//   const [greenhouseId, setGreenhouseId] = useState(null);
//   const [greenhouseName, setGreenhouseName] = useState("");
//   const hasGlobalData = Object.keys(dailyData).some(
//     (key) => dailyData[key]?.items?.length > 0
//   );

//   // =======================================================================
//   // === AUTENTICACIÓN Y SELECCIÓN DE INVERNADERO
//   // =======================================================================

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       if (!currentUser) {
//         setLoading(false);
//         return;
//       }

//       // --- Suscripción a la Lista de Invernaderos ---
//       const listRef = getGreenhousesListRef(db, currentUser.uid);
//       const unsubscribeList = onSnapshot(listRef, (docSnap) => {
//         if (docSnap.exists()) {
//           // Asume que el documento tiene un campo 'list' con el array de invernaderos
//           const list = docSnap.data().list || [];
//           setGreenhousesList(list);

//           // Si aún no hay un invernadero seleccionado, elige el primero
//           if (!selectedGreenhouseId && list.length > 0) {
//             setSelectedGreenhouseId(list[0].id);
//           }
//         } else {
//           // Inicializa el primer invernadero si no existe la lista
//           const defaultId = "inv-1";
//           const defaultName = "Invernadero Principal";
//           const defaultList = [{ id: defaultId, name: defaultName }];
//           setGreenhousesList(defaultList);
//           setSelectedGreenhouseId(defaultId);
//           // Opcional: crea el documento en Firebase si no existe
//           setDoc(listRef, { list: defaultList }, { merge: true });
//         }
//       });

//       // ... (Tu lógica de goal y dailyData existente)

//       return () => {
//         // ... (Tus limpiadores existentes: unsubscribeDailyData, unsubscribeGoal)
//         unsubscribeList(); // Limpiar el listener de la lista
//       };
//     });

//     // ... (Resto de tu useEffect de autenticación)

//     return () => unsubscribeAuth();
//   }, [selectedGreenhouseId]);

//   useEffect(() => {
//     if (!user || !selectedGreenhouseId) {
//       setGreenhouseConfig(INITIAL_GREENHOUSE_CONFIG);
//       return;
//     }

//     // 🔑 CORRECCIÓN 1: Usar la misma referencia para leer y escribir.
//     const configRef = getDocRef(db, user.uid, selectedGreenhouseId);

//     const unsubscribeConfig = onSnapshot(
//       configRef,
//       (docSnap) => {
//         if (docSnap.exists()) {
//           // 🔑 CORRECCIÓN 2: Leer el campo anidado 'config' de forma segura.
//           const loadedConfig = docSnap.data()?.config;

//           if (loadedConfig) {
//             // Carga los datos guardados (ej: 'edwan')
//             setGreenhouseConfig({
//               ...INITIAL_GREENHOUSE_CONFIG,
//               ...loadedConfig,
//             });
//           } else {
//             // Si el documento existe pero 'config' está vacío
//             setGreenhouseConfig(INITIAL_GREENHOUSE_CONFIG);
//           }
//         } else {
//           // El documento no existe
//           setGreenhouseConfig(INITIAL_GREENHOUSE_CONFIG);
//         }
//       },
//       (error) => {
//         console.error("Error al cargar la configuración:", error);
//         setGreenhouseConfig(INITIAL_GREENHOUSE_CONFIG);
//       }
//     );
//     return () => {
//       unsubscribeConfig();
//     };
//   }, [
//     user,
//     selectedGreenhouseId,
//     setGreenhouseConfig,
//     INITIAL_GREENHOUSE_CONFIG,
//     db,
//     getDocRef,
//   ]);

//   const showTemporaryMessage = (message, type) => {
//     switch (type) {
//       case "info":
//         toast.info(message);
//         break;
//       case "success":
//         toast.success(message);
//         break;
//       case "error":
//         toast.error(message);
//         break;
//       default:
//         toast.info(message);
//     }
//   };

//   const generatePDF = useCallback(
//     async (dateKey) => {
//       // Objeto de día completo
//       const dailyDataEntry = dailyData[dateKey] || { items: [] };

//       // 1. Crear un contenedor temporal con el HTML que queremos capturar.
//       const pdfContent = document.createElement("div");
//       pdfContent.style.width = "210mm"; // Ancho A4
//       pdfContent.style.padding = "15mm 10mm";
//       pdfContent.style.position = "absolute";
//       pdfContent.style.left = "-9999px"; // Ocultar
//       pdfContent.style.fontFamily = "Helvetica, Arial, sans-serif";
//       pdfContent.style.color = "#333333";
//       pdfContent.style.backgroundColor = "#FFFFFF";

//       // 2. Generar el HTML del reporte (Header + Cuerpo + Footer)
//       const totalProduccion = dailyDataEntry.items.reduce(
//         (sum, item) => sum + parseFloat(item.result || 0),
//         0
//       );

//       const rawCost = dailyDataEntry.finalProductionCost;
//       const costeFinal = Number(rawCost || 0).toFixed(2);

//       // NUEVAS VARIABLES DE COSTE
//       const costData = dailyDataEntry.costData || {};
//       const numWorkers = parseFloat(costData.numWorkers || 0);
//       const hoursWorked = parseFloat(costData.hoursWorked || 0);
//       const productionCostVariable = parseFloat(
//         dailyDataEntry.productionCostVariable || 0
//       );

//       const hasCostData =
//         numWorkers > 0 || hoursWorked > 0 || productionCostVariable > 0;

//       const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       // --- 2.1. Header HTML ---
//       // 🐛 Corrección: Usamos una URL de logo condicional para evitar fallos si es vacía
//       const logoUrl =
//         REPORT_CONFIG.LOGO_URL ||
//         "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

//       const headerHtml = `
//             <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #E0E7FF; padding-bottom: 15px; margin-bottom: 25px;">
//                 <div style="flex: 1;">
//                     <img src="${logoUrl}" alt="Logo" style="height: 75px; width: auto; max-width: 100%; border-radius: 4px; ${
//         REPORT_CONFIG.LOGO_URL ? "" : "opacity: 0.2;"
//       }">
//                 </div>
//                 <div style="flex: 2; text-align: center;">
//                     <h1 style="font-size: 26px; font-weight: 700; margin: 0; color: #1E3A8A;">${
//                       REPORT_CONFIG.REPORT_TITLE
//                     }</h1>
//                     <p style="font-size: 14px; margin: 3px 0 0 0; color: #6B7280; font-style: italic;">${
//                       REPORT_CONFIG.COMPANY_NAME
//                     }</p>
//                 </div>
//                 <div style="flex: 1; text-align: right;">
//                     <p style="font-size: 11px; margin: 0; color: #9CA3AF;">Fecha de Impresión:</p>
//                     <p style="font-size: 13px; font-weight: 600; margin: 2px 0 0 0; color: #4B5563;">${formatDate(
//                       new Date()
//                     )}</p>
//                 </div>
//             </div>
//             <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #059669; background-color: #F0FDF4; padding: 8px; border-radius: 4px;">Reporte Diario: ${dateDisplay}</h2>
//         `;

//       // --- 2.2. Cuerpo HTML (Productos) ---
//       let bodyHtml = `
//             <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">Productos Detallados:</h3>
//         `;

//       if (dailyDataEntry.items.length === 0) {
//         bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este día.</p>`;
//       } else {
//         // Contenedor de la cuadrícula de productos (Grid de 3 columnas para A4)
//         bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">`;

//         dailyDataEntry.items.forEach((item) => {
//           const result = parseFloat(item.result || 0);

//           // 🐛 Corrección: Usamos una imagen de placeholder si la URL es Base64
//           // (html2canvas a veces falla con Base64 muy grandes o mal formados)
//           const itemImageUrl =
//             item.imageUrl && item.imageUrl.startsWith("data:image")
//               ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
//               : item.imageUrl;

//           bodyHtml += `
//                     <div style="
//                         border: 1px solid #E0E0E0;
//                         padding: 15px;
//                         border-radius: 12px;
//                         background-color: #FAFAFA;
//                         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                         display: flex;
//                         align-items: flex-start;
//                     ">
//                         ${
//                           itemImageUrl
//                             ? `<img
//                                         src="${itemImageUrl}"
//                                         alt="Evidencia"
//                                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; flex-shrink: 0; border: 2px solid #D1E5F7;"
//                                     >`
//                             : `<div style="width: 60px; height: 60px; background-color: #E0E7FF; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1E3A8A; font-weight: 700; flex-shrink: 0;">
//                                         EVIDENCIA
//                                     </div>`
//                         }
//                         <div style="flex-grow: 1;">
//                             <p style="font-size: 16px; font-weight: 800; color: #2563EB; margin: 0 0 8px 0; border-bottom: 1px solid #EEEEEE; padding-bottom: 4px;">
//                                 ${item.productName || "Producto sin nombre"}
//                             </p>
//                             <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280; margin-bottom: 8px;">
//                                 <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Peso(kg): ${parseFloat(
//                                   item.factorA || 0
//                                 )}</span>
//                                 <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Cajas: ${parseFloat(
//                                   item.factorB || 0
//                                 )}</span>
//                             </div>
//                             <div style="background-color: #10B981; padding: 8px 10px; border-radius: 6px; text-align: center;">
//                                 <p style="font-size: 17px; font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: 1px;">TOTAL: ${result} Kg</p>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//         });
//         bodyHtml += `</div>`; // Cierre del contenedor grid
//       }

//       // --- 2.3. Bloque de Costes y Footer ---
//       let costDetailsHtml = "";
//       if (hasCostData) {
//         costDetailsHtml = `
//                 <div style="margin:25px 0 20px;padding:15px;border:2px solid #E0E7FF;border-radius:8px;background-color:#F8FAFF;">
//                     <h4 style="font-size:16px;font-weight:700;color:#1E3A8A;margin-top:0;border-bottom:1px dashed #C7D2FE;padding-bottom:5px;">Detalle de Costes Laborales</h4>
//                     <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:10px;">
//                         <p style="margin:0;color:#4B5563;">Trabajadores:</p>
//                         <p style="margin:0;font-weight:700;color:#2563EB;">${numWorkers.toFixed(
//                           0
//                         )}</p>
//                     </div>
//                     <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:5px;">
//                         <p style="margin:0;color:#4B5563;">Horas Trabajadas:</p>
//                         <p style="margin:0;font-weight:700;color:#2563EB;">${hoursWorked.toFixed(
//                           2
//                         )} hrs</p>
//                     </div>
//                     <div style="display:flex;justify-content:space-between;font-size:16px;margin-top:10px;padding-top:5px;border-top:1px solid #E0E7FF;">
//                         <p style="margin:0;font-weight:600;color:#1E3A8A;">Coste Laboral Diario:</p>
//                         <p style="margin:0;font-weight:900;color:#059669;">${productionCostVariable.toFixed(
//                           2
//                         )} €</p>
//                     </div>
//                 </div>
//             `;
//       }

//       const footerHtml = `
//             <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 10px;">
//                 ${costDetailsHtml}
//                 <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
//                     <div style="flex: 1;">
//                         <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCIÓN TOTAL (Kg):</p>
//                         <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion.toFixed(
//                           2
//                         )}</p>
//                     </div>
//                     <div style="width: 1px; background-color: #D1E5F7;"></div>
//                     <div style="flex: 1;">
//                         <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/€):</p>
//                         <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
//                     </div>
//                 </div>
//                 <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Horticultura</p>
//             </div>
//         `;

//       pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

//       // 3. Añadir el contenido oculto al body y capturarlo
//       document.body.appendChild(pdfContent);

//       try {
//         // Reemplazando showTemporaryMessage con toast si no existe
//         const showMsg =
//           typeof showTemporaryMessage === "function"
//             ? showTemporaryMessage
//             : (msg, type) => toast[type](msg);

//         showMsg("Generando PDF...", "info");

//         const canvas = await html2canvas(pdfContent, {
//           scale: 2,
//           // Usar CORS es CRÍTICO para imágenes externas (como el logo)
//           useCORS: true,
//           // scrollY: -window.scrollY // Descomentar solo si el elemento está en la parte visible
//         });

//         const imgData = canvas.toDataURL("image/jpeg", 1.0);
//         const pdf = new jsPDF("p", "mm", "a4");
//         const imgWidth = 210; // Ancho A4 en mm
//         const pageHeight = 295; // Alto A4 en mm

//         // Calcula la altura de la imagen renderizada manteniendo la proporción A4
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;

//         let position = 0;

//         // Primer renderizado
//         pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         // Manejo de páginas múltiples (si el contenido es muy largo)
//         while (heightLeft >= 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//         }

//         pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
//         showMsg("PDF generado con éxito.", "success");
//       } catch (error) {
//         console.error("Error al generar el PDF:", error);
//         const showMsg =
//           typeof showTemporaryMessage === "function"
//             ? showTemporaryMessage
//             : (msg, type) => toast[type](msg);
//         showMsg(
//           "Error al generar el PDF. Verifica la consola para detalles (posible error de imagen o CORS).",
//           "error"
//         );
//       } finally {
//         // 4. Limpiar el contenedor temporal
//         document.body.removeChild(pdfContent);
//       }
//     },
//     [dailyData, toast] // Dependencias: dailyData y toast (si se usa directamente)
//   );

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//       if (currentUser) {
//         // Al iniciar sesión, cargamos la lista de invernaderos
//         const listRef = getGreenhousesListRef(db, currentUser.uid);
//         onSnapshot(listRef, (docSnap) => {
//           const data = docSnap.data() || { list: [] };
//           const list = data.list || [];
//           setGreenhouses(list);

//           // Si no hay un invernadero seleccionado, selecciona el primero
//           if (list.length > 0 && !greenhouseId) {
//             setGreenhouseId(list[0].id);
//             setGreenhouseName(list[0].name);
//           } else if (list.length > 0 && greenhouseId) {
//             // Asegurarse de que el nombre del invernadero seleccionado esté actualizado
//             const current = list.find((g) => g.id === greenhouseId);
//             if (current) setGreenhouseName(current.name);
//           } else if (list.length === 0) {
//             setGreenhouseId(null);
//             setGreenhouseName("");
//           }
//         });
//       } else {
//         setGreenhouses([]);
//         setGreenhouseId(null);
//         setGreenhouseName("");
//         setDailyData({});
//         setGlobalGoal({});
//       }
//     });

//     return () => unsubscribe();
//   }, [greenhouseId]); // Dependencia agregada para asegurar selección inicial

//   // =======================================================================
//   // === FIREBASE: SINCRONIZACIÓN DE DATOS DIARIOS Y METAS
//   // =======================================================================

//   useEffect(() => {
//     if (!user || !greenhouseId) {
//       setDailyData({});
//       setGlobalGoal({});
//       return;
//     }

//     // 1. Sincronizar datos diarios
//     const dailyRef = getDocRef(db, user.uid, greenhouseId);
//     const unsubscribeDaily = onSnapshot(dailyRef, (docSnap) => {
//       const data = docSnap.data() || {};
//       setDailyData(data);
//     });

//     // 2. Sincronizar metas globales
//     const goalRef = getGoalRef(db, user.uid, greenhouseId);
//     const unsubscribeGoal = onSnapshot(goalRef, (docSnap) => {
//       const data = docSnap.data() || {};
//       setGlobalGoal(data);
//     });

//     return () => {
//       unsubscribeDaily();
//       unsubscribeGoal();
//     };
//   }, [user, greenhouseId]);

//   // =======================================================================
//   // === LÓGICA DE MANEJO DE INVERNADEROS (NUEVO)
//   // =======================================================================

//   const handleCreateGreenhouse = async (name) => {
//     if (!user) return;
//     const newId = uuidv4();
//     const listRef = getGreenhousesListRef(db, user.uid);
//     const newGreenhouse = { id: newId, name: name };

//     try {
//       // 1. Añadir a la lista de invernaderos
//       await updateDoc(listRef, {
//         list: arrayUnion(newGreenhouse),
//       }).catch(async (error) => {
//         // Si el documento no existe (primera vez), créalo
//         if (error.code === "not-found") {
//           await setDoc(listRef, { list: [newGreenhouse] });
//         } else {
//           throw error;
//         }
//       });

//       // 2. Establecer como el invernadero seleccionado
//       setGreenhouseId(newId);
//       setGreenhouseName(name);
//       toast.success(`Invernadero "${name}" creado con éxito.`);
//     } catch (error) {
//       console.error("Error creating greenhouse:", error);
//       toast.error("Error al crear el invernadero.");
//     }
//   };

//   const handleDeleteGreenhouse = async (id, name) => {
//     if (
//       !user ||
//       !window.confirm(
//         `¿Estás seguro de eliminar el invernadero "${name}" y TODOS sus datos? Esta acción no se puede deshacer.`
//       )
//     )
//       return;

//     const listRef = getGreenhousesListRef(db, user.uid);
//     const greenhouseToDelete = greenhouses.find((g) => g.id === id);

//     if (!greenhouseToDelete) {
//       toast.error("Invernadero no encontrado.");
//       return;
//     }

//     try {
//       // 1. Eliminar de la lista de invernaderos
//       await updateDoc(listRef, {
//         list: arrayRemove(greenhouseToDelete),
//       });

//       // 2. (OPCIONAL) Eliminar los documentos de datos y configuración
//       const dailyRef = getDocRef(db, user.uid, id);
//       const goalRef = getGoalRef(db, user.uid, id);
//       await deleteDoc(dailyRef);
//       await deleteDoc(goalRef);

//       // 3. Reajustar la selección
//       if (greenhouseId === id) {
//         const remaining = greenhouses.filter((g) => g.id !== id);
//         if (remaining.length > 0) {
//           setGreenhouseId(remaining[0].id);
//           setGreenhouseName(remaining[0].name);
//         } else {
//           setGreenhouseId(null);
//           setGreenhouseName("");
//         }
//       }
//       toast.success(`Invernadero "${name}" y sus datos han sido eliminados.`);
//     } catch (error) {
//       console.error("Error deleting greenhouse:", error);
//       toast.error("Error al eliminar el invernadero.");
//     }
//   };

//   // const handleSelectGreenhouse = (id, name) => {
//   //   setGreenhouseId(id);
//   //   setGreenhouseName(name);
//   //   setView("calendar"); // Siempre volver al calendario al cambiar
//   //   setSelectedDate(formatDate(new Date()));
//   // };

//   // =======================================================================
//   // === LÓGICA DE MANEJO DE DATOS DIARIOS
//   // =======================================================================

//   // Calculo de suma total para el tracker (MEMO)
//   const dailyTotalSum = useMemo(() => {
//     return Object.values(dailyData).reduce((sum, day) => {
//       const dayTotal = (day.items || []).reduce(
//         (subSum, item) => subSum + parseFloat(item.result || 0),
//         0
//       );
//       return sum + dayTotal;
//     }, 0);
//   }, [dailyData]);

//   // Maneja cambios de mes en el calendario
//   const handleMonthChange = useCallback((newDate) => {
//     setCurrentDate(newDate);
//   }, []);

//   // Maneja click en un día del calendario
//   const handleDayClick = useCallback((dateKey, newView) => {
//     setSelectedDate(dateKey);
//     setView(newView);
//   }, []);

//   // Maneja cambios en el formulario de costos (sólo en estado local)
//   // const handleCostChange = useCallback((dateKey, { numWorkers, hoursWorked }) => {
//   //   setDailyData((prev) => ({
//   //     ...prev,
//   //     [dateKey]: {
//   //       ...prev[dateKey],
//   //       numWorkers,
//   //       hoursWorked,
//   //       ...calculateCosts(
//   //         (prev[dateKey]?.items || []).reduce(
//   //           (sum, item) => sum + parseFloat(item.result || 0),
//   //           0
//   //         ),
//   //         numWorkers,
//   //         hoursWorked
//   //       ),
//   //     },
//   //   }));
//   // }, [dailyData]); // Agregar dailyData como dependencia

//   const handleCostChange = useCallback(
//     (dateKey, field, value) => {
//       setDailyData((prevData) => {
//         const dayData = { ...prevData[dateKey] };
//         const costData = { ...dayData.costData };

//         // 1. OBTENER Y DEFINIR 'items' (¡Corregido en pasos anteriores!)
//         const items = dayData.items || [];

//         // 2. 🟢 CORRECCIÓN: Definir 'dailyTotal' aquí
//         const dailyTotal = items.reduce(
//           (sum, item) => sum + parseFloat(item.result || 0),
//           0
//         );

//         // 3. (Resto de tu lógica de actualización de costData...)
//         costData[field] = value;

//         const numWorkers = field === "numWorkers" ? value : costData.numWorkers;
//         const hoursWorked =
//           field === "hoursWorked" ? value : costData.hoursWorked;

//         // 4. 🟢 CORRECCIÓN: Definir 'costs' aquí
//         const costs = calculateCosts(
//           dailyTotal, // Usa el dailyTotal DEFINIDO arriba
//           numWorkers,
//           hoursWorked
//         );

//         // 5. Aplicar los resultados a costData
//         costData.productionCostVariable = costs.productionCostVariable;
//         costData.finalProductionCost = costs.finalProductionCost; // Usa 'costs' DEFINIDO arriba

//         return {
//           ...prevData,
//           [dateKey]: {
//             ...dayData,
//             costData: costData,
//           },
//         };
//       });
//     },
//     [dailyData]
//   );

//   // Guarda los costos en Firebase
//   const handleSaveCosts = useCallback(
//     async (dateKey, numWorkers, hoursWorked) => {
//       if (!user || !greenhouseId) return;

//       const currentDay = dailyData[dateKey] || { items: [] };
//       const dailyTotal = (currentDay.items || []).reduce(
//         (sum, item) => sum + parseFloat(item.result || 0),
//         0
//       );

//       const costs = calculateCosts(dailyTotal, numWorkers, hoursWorked);

//       const newData = {
//         ...currentDay,
//         numWorkers,
//         hoursWorked,
//         ...costs,
//       };

//       try {
//         const dailyRef = getDocRef(db, user.uid, greenhouseId);
//         await setDoc(
//           dailyRef,
//           {
//             [dateKey]: newData,
//           },
//           { merge: true }
//         );
//         toast.success(`Costos guardados para ${dateKey}.`);
//       } catch (error) {
//         console.error("Error saving costs to Firestore:", error);
//         toast.error("Error al guardar costos.");
//       }
//     },
//     [user, greenhouseId, dailyData]
//   );

//   // Maneja cambios en el formulario de productos (sólo en estado local)
//   // const handleItemChange = useCallback((itemId, updates) => {
//   //   setSelectedDate((dateKey) => {
//   //     setDailyData((prev) => {
//   //       const currentDay = prev[dateKey] || { items: [] };
//   //       const updatedItems = currentDay.items.map((item) =>
//   //         item.id === itemId ? { ...item, ...updates } : item
//   //       );

//   //       // Recalcular el total diario y los costos
//   //       const dailyTotal = updatedItems.reduce(
//   //         (sum, item) => sum + parseFloat(item.result || 0),
//   //         0
//   //       );
//   //       const costs = calculateCosts(
//   //         dailyTotal,
//   //         currentDay.numWorkers,
//   //         currentDay.hoursWorked
//   //       );

//   //       return {
//   //         ...prev,
//   //         [dateKey]: {
//   //           ...currentDay,
//   //           items: updatedItems,
//   //           ...costs,
//   //         },
//   //       };
//   //     });
//   //     return dateKey;
//   //   });
//   // }, []);

//   const handleItemChange = useCallback(
//     (itemId, field, value) => {
//       setDailyData((prevData) => {
//         const dayData = { ...prevData[selectedDate] };

//         const updatedItems = dayData.items.map((item) => {
//           if (item.id === itemId) {
//             const newItem = { ...item, [field]: value };

//             // 1. OBTENER VALORES ACTUALIZADOS Y POR DEFECTO
//             // Si cambia el nombre, actualiza factorA de PRODUCT_CATALOG.
//             const productName =
//               field === "productName" ? value : newItem.productName;
//             const factorB = field === "factorB" ? value : newItem.factorB;

//             // 2. RECALCULAR EL RESULTADO
//             newItem.result = calculateResult(productName, factorB);

//             // 3. ACTUALIZAR factorA si el nombre del producto fue editado
//             if (field === "productName") {
//               newItem.factorA = PRODUCT_CATALOG[value] || 0;
//             }

//             return newItem;
//           }
//           return item;
//         });

//         return {
//           ...prevData,
//           [selectedDate]: {
//             ...dayData,
//             items: updatedItems,
//           },
//         };
//       });
//     },
//     [selectedDate] // Depende de selectedDate
//   );

//   // Añadir un nuevo producto al día (local)
//   const addItem = useCallback(() => {
//     setSelectedDate((dateKey) => {
//       setDailyData((prev) => {
//         const currentDay = prev[dateKey] || { items: [] };
//         const newItem = {
//           id: uuidv4(),
//           productName: "",
//           factorB: "",
//           factorA: 0,
//           result: "0.00",
//           damagedBoxes: "",
//           notes: "",
//           imageUrl: "",
//         };

//         const updatedItems = [...currentDay.items, newItem];

//         return {
//           ...prev,
//           [dateKey]: {
//             ...currentDay,
//             items: updatedItems,
//           },
//         };
//       });
//       return dateKey;
//     });
//   }, []);

//   // Eliminar un producto (local)
//   const deleteItem = useCallback((itemId) => {
//     setSelectedDate((dateKey) => {
//       setDailyData((prev) => {
//         const currentDay = prev[dateKey] || { items: [] };
//         const updatedItems = currentDay.items.filter(
//           (item) => item.id !== itemId
//         );

//         // Recalcular el total diario y los costos
//         const dailyTotal = updatedItems.reduce(
//           (sum, item) => sum + parseFloat(item.result || 0),
//           0
//         );
//         const costs = calculateCosts(
//           dailyTotal,
//           currentDay.numWorkers,
//           currentDay.hoursWorked
//         );

//         return {
//           ...prev,
//           [dateKey]: {
//             ...currentDay,
//             items: updatedItems,
//             ...costs,
//           },
//         };
//       });
//       return dateKey;
//     });
//   }, []);

//   // Guardar datos diarios en Firebase (maneja items, total, costos)
//   // const handleSave = useCallback(async (dateKey, items) => {
//   //   if (!user || !greenhouseId) return;

//   //   const dailyTotal = items.reduce(
//   //     (sum, item) => sum + parseFloat(item.result || 0),
//   //     0
//   //   );
//   //   const { numWorkers, hoursWorked } = dailyData[dateKey] || {};
//   //   const costs = calculateCosts(dailyTotal, numWorkers, hoursWorked);

//   //   const newData = {
//   //     items,
//   //     dailyTotal: dailyTotal.toFixed(2),
//   //     numWorkers: numWorkers || "",
//   //     hoursWorked: hoursWorked || "",
//   //     ...costs,
//   //   };

//   //   try {
//   //     const dailyRef = getDocRef(db, user.uid, greenhouseId);
//   //     await setDoc(
//   //       dailyRef,
//   //       {
//   //         [dateKey]: newData,
//   //       },
//   //       { merge: true }
//   //     );
//   //     toast.success(`Datos guardados para ${dateKey}.`);
//   //     setView("day_view"); // Volver a la vista del día
//   //   } catch (error) {
//   //     console.error("Error saving to Firestore:", error);
//   //     toast.error("Error al guardar datos.");
//   //   }
//   // }, [user, greenhouseId, dailyData]);

//   //   const handleSave = useCallback(async (dateKey, items) => {
//   //     // ... (rest of your guard clauses)

//   //     // 1. 🟢 CRÍTICO: Obtener los datos existentes ANTES de calcular.
//   //     const existingDayData = dailyData[dateKey] || {};

//   //     // Usar los valores existentes, pero forzando a 0 para el cálculo si están vacíos.
//   //     const numWorkers = parseFloat(existingDayData.numWorkers) || 0;
//   //     const hoursWorked = parseFloat(existingDayData.hoursWorked) || 0;

//   //     // ... (rest of your calculation for dailyTotal and costs)

//   //     const newData = {
//   //         // 2. 🟢 CRÍTICO: Preservar todos los campos existentes
//   //         ...existingDayData, // <-- Esto asegura que NUNCA pierdas datos previos.

//   //         // Sobrescribir los campos que estás actualizando
//   //         items,
//   //         dailyTotal: dailyTotal.toFixed(2),
//   //         numWorkers: numWorkers.toString(), // Guardar el valor que usamos para el cálculo
//   //         hoursWorked: hoursWorked.toString(),
//   //         ...costs,
//   //     };

//   //     // ... (rest of your setDoc logic)
//   // }, [user, greenhouseId, dailyData, calculateCosts])

//   // const handleGreenhouseConfigSave = useCallback(
//   //   async (id, data) => {
//   //     if (!user) {
//   //       toast.error("Debes iniciar sesión para guardar.");
//   //       return;
//   //     }

//   //     const configRef = getGoalRef(db, user.uid, id); // Usa el ID pasado por el modal

//   //     try {
//   //       await updateDoc(
//   //         configRef,
//   //         {
//   //           config: data,
//   //         },
//   //         { merge: true }
//   //       ); // Guarda solo el objeto 'config'

//   //       toast.success("¡Datos del Cultivo actualizados con éxito! 🚀");
//   //     } catch (error) {
//   //       console.error(
//   //         "Error al guardar la configuración del invernadero:",
//   //         error
//   //       );
//   //       toast.error("Error al guardar los datos.");
//   //     }
//   //   },
//   //   [user]
//   // );

//   const handleGreenhouseConfigSave = useCallback(
//     (newConfig) => {
//       if (!user || !selectedGreenhouseId) {
//         toast.error(
//           "No se puede guardar: Invernadero no seleccionado o usuario no autenticado."
//         );
//         return;
//       }

//       const configRef = getDocRef(db, user.uid, selectedGreenhouseId);

//       // Actualiza el documento de Firebase con la nueva configuración
//       setDoc(configRef, { config: newConfig }, { merge: true })
//         .then(() => {
//           // 💡 IMPORTANTE: Después de guardar, actualiza el estado local para reflejar el cambio.
//           // Esto asegura que la tarjeta y otros componentes se actualicen inmediatamente.
//           setGreenhouseConfig(newConfig);
//           toast.success("Configuración guardada en Firebase.");
//         })
//         .catch((error) => {
//           console.error("Error al guardar la configuración:", error);
//           toast.error("Error al guardar la configuración.");
//         });
//     },
//     [user, db, selectedGreenhouseId, setGreenhouseConfig, toast]
//   );

//   const handleSelectGreenhouse = useCallback(
//     (id, name) => {
//       // The function logic is correct:
//       setGreenhouseConfig(INITIAL_GREENHOUSE_CONFIG);
//       setDailyData({});
//       setGreenhouseId(id);
//       setGreenhouseName(name);
//       setView("calendar");
//       setSelectedDate(formatDate(new Date()));

//       toast.info(`Cargando datos para el invernadero: ${name}...`);
//     },
//     [
//       setGreenhouseConfig,
//       setDailyData,
//       setGreenhouseId,
//       setGreenhouseName,
//       setView,
//       setSelectedDate,
//       toast,
//     ]
//   );

//   const handleSave = useCallback(
//     async (dateKey, items = null, costData = null) => {
//       // Cláusulas de guardia
//       if (!user || !greenhouseId) return;

//       const dailyRef = getDocRef(db, user.uid, greenhouseId);
//       // Obtener los datos existentes (de Firestore o del estado 'dailyData')
//       const existingDayData = dailyData[dateKey] || {};

//       // 1. Determinar el estado base (el que se va a guardar)
//       let newDayData = {
//         ...existingDayData,
//         dateKey: dateKey,
//         // Inicializa items y costData si no existen en el existingData
//         items: existingDayData.items || [],
//         costData: existingDayData.costData || {},
//       };

//       // 2. Procesar la actualización de PRODUCTOS (si se pasan 'items')
//       if (items) {
//         // Recalcular el resultado para cada ítem (por si DayEditForm no lo hizo)
//         const itemsToSave = items.map((item) => ({
//           ...item,
//           result: calculateResult(item.productName, item.factorB),
//         }));

//         const dailyTotal = itemsToSave.reduce(
//           (sum, item) => sum + parseFloat(item.result || 0),
//           0
//         );

//         // Actualizar el objeto con los nuevos ítems y el total
//         newDayData.items = itemsToSave;
//         newDayData.dailyTotal = dailyTotal.toFixed(2);

//         // Recalcular los costes si ya existen datos de costes
//         const existingNumWorkers = parseFloat(
//           newDayData.costData.numWorkers || 0
//         );
//         const existingHoursWorked = parseFloat(
//           newDayData.costData.hoursWorked || 0
//         );

//         const costs = calculateCosts(
//           dailyTotal,
//           existingNumWorkers,
//           existingHoursWorked
//         );

//         newDayData = {
//           ...newDayData,
//           ...costs,
//         };
//       }

//       // 3. Procesar la actualización de COSTES (si se pasa 'costData')
//       if (costData) {
//         // Actualizar solo los datos de costes
//         newDayData.costData = costData;

//         // Recalcular los costes con el total de producción existente
//         const dailyTotal = parseFloat(newDayData.dailyTotal || 0);
//         const newNumWorkers = parseFloat(costData.numWorkers || 0);
//         const newHoursWorked = parseFloat(costData.hoursWorked || 0);

//         const costs = calculateCosts(dailyTotal, newNumWorkers, newHoursWorked);

//         newDayData = {
//           ...newDayData,
//           ...costs,
//         };
//       }

//       // 4. Guardar en Firestore y cambiar de vista
//       try {
//         await setDoc(
//           dailyRef,
//           {
//             [dateKey]: newDayData,
//           },
//           { merge: true }
//         );

//         // 🚀 CORRECCIÓN CLAVE: Volver a la vista de detalle del día para ver el resultado
//         toast.success(`Datos guardados para ${dateKey}.`);
//         handleDayClick(dateKey, "day_view");
//       } catch (error) {
//         console.error("Error saving to Firestore:", error);
//         toast.error("Error al guardar datos.");
//       }
//     },
//     [
//       user,
//       greenhouseId,
//       dailyData,
//       calculateCosts,
//       calculateResult,
//       db,
//       getDocRef,
//       handleDayClick,
//     ]
//   );

//   // Guardar meta global en Firebase
//   const updateGoal = useCallback(
//     async (goal, deadline) => {
//       if (!user || !greenhouseId) return;

//       try {
//         const goalRef = getGoalRef(db, user.uid, greenhouseId);
//         await setDoc(
//           goalRef,
//           { goal: parseFloat(goal) || 0, deadline },
//           { merge: true }
//         );
//         toast.success("Meta global actualizada.");
//       } catch (error) {
//         console.error("Error updating goal in Firestore:", error);
//         toast.error("Error al actualizar la meta.");
//       }
//     },
//     [user, greenhouseId]
//   );

//   // =======================================================================
//   // === RENDERIZADO PRINCIPAL
//   // =======================================================================

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <p className="text-xl text-indigo-700">Cargando aplicación...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-4">
//         <AuthScreen app={app} />
//       </div>
//     );
//   }

//   // Si está autenticado pero no hay invernaderos
//   if (greenhouses.length === 0 && !greenhouseId) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-8">
//         <header className="flex justify-between items-center py-4 border-b border-indigo-200 mb-6">
//           <h1 className="text-3xl font-extrabold text-indigo-700">
//             Horticultura App 🪴
//           </h1>
//           <button
//             onClick={() => signOut(auth)}
//             className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//           >
//             Cerrar Sesión
//           </button>
//         </header>
//         <div className="max-w-xl mx-auto p-10 bg-white rounded-xl shadow-2xl text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             ¡Bienvenido!
//           </h2>
//           <p className="mb-6 text-gray-600">
//             Aún no tienes invernaderos registrados. Comienza creando uno para
//             gestionar tus inventarios.
//           </p>
//           <GreenhouseSelector // Usamos el selector para la creación
//             greenhouses={greenhouses}
//             greenhouseId={greenhouseId}
//             handleSelectGreenhouse={handleSelectGreenhouse}
//             handleCreateGreenhouse={handleCreateGreenhouse}
//             handleDeleteGreenhouse={handleDeleteGreenhouse}
//             showManagementButtons={true} // Forzar visibilidad
//             onSelect={setSelectedGreenhouseId} // Esta función actualizará el estado y disparará los useEffects
//             // Opcional: si quieres añadir invernaderos
//             // onAddGreenhouse={handleAddGreenhouse}
//           />
//         </div>
//       </div>
//     );
//   }

//   //  const renderContent = () => {
//   //     // La línea 'const dailyDataForSelectedDate = dailyData[selectedDate] || {};' ya no es necesaria
//   //     // para 'day_view' si pasas el objeto completo.

//   //     switch (view) {
//   //       case "calendar":
//   //         return (
//   //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//   //             {/* Columna Izquierda: Calendario */}
//   //             <div className="lg:col-span-2">
//   //               <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">
//   //                 Producción - {greenhouseName}
//   //               </h2>
//   //               <CalendarGrid
//   //                 currentDate={currentDate}
//   //                 dailyData={dailyData}
//   //                 selectedDate={selectedDate}
//   //                 handleMonthChange={handleMonthChange}
//   //                 handleDayClick={handleDayClick}
//   //                 formatNumber={formatNumber}
//   //                 setSelectedDate={setSelectedDate}
//   //               />
//   //             </div>

//   //             {/* Columna Derecha: Estadísticas y Meta */}
//   //             <div className="space-y-6">
//   //               <DatosEstadisticosCard dailyData={dailyData} formatNumber={formatNumber} />
//   //               <InlineGlobalGoalTracker
//   //                 globalGoal={globalGoal}
//   //                 dailyTotalSum={dailyTotalSum}
//   //                 formatNumber={formatNumber}
//   //               />
//   //               <InlineGoalInput
//   //                 globalGoal={globalGoal}
//   //                 updateGoal={updateGoal}
//   //                 formatNumber={formatNumber}
//   //               />
//   //             </div>
//   //           </div>
//   //         );

//   //       case "day_view":
//   //         return (
//   //           <DayProductsGrid
//   //             dateKey={selectedDate}
//   //             dailyData={dailyData} // ✅ CORRECCIÓN 1: Pasa el objeto completo dailyData
//   //             handleDayClick={handleDayClick}
//   //             formatNumber={formatNumber}
//   //             calculateCosts={calculateCosts}
//   //             generatePDF={generatePDF}
//   //             REPORT_CONFIG={REPORT_CONFIG}
//   //           />
//   //         );

//   //       case "edit_products":
//   //         return (
//   //           <DayEditForm
//   //             dateKey={selectedDate}
//   //             dailyData={dailyData}
//   //             handleItemChange={handleItemChange}
//   //             addItem={addItem}
//   //             deleteItem={deleteItem}
//   //             handleDayClick={handleDayClick}
//   //             handleSave={handleSave}
//   //             uploadImages={uploadImages}
//   //             formatNumber={formatNumber}
//   //             uploadUrl={YOUR_BACKEND_UPLOAD_URL} // ✅ CORRECCIÓN 2: Asegura que se pasa la URL
//   //           />
//   //         );

//   //       case "edit_costs":
//   //         return (
//   //           <CostEditForm
//   //            dateKey={selectedDate}
//   //             dailyData={dailyData}
//   //             handleDayClick={handleDayClick}
//   //             handleSave={handleSave} // Función unificada de guardado
//   //             formatNumber ={formatNumber }
//   //             calculateCosts={calculateCosts}
//   //             HOURLY_COST_RATE={HOURLY_COST_RATE}
//   //           />
//   //         );

//   //       default:
//   //         return <div>Vista no encontrada.</div>;
//   //     }
//   // };

//   //   return (
//   //     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//   //       {/* HEADER */}
//   //       <header className="bg-white p-4 rounded-xl shadow-lg mb-8 border-t-4 border-indigo-600">
//   //         <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//   //           <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
//   //             <svg
//   //               className="w-8 h-8 mr-2 text-indigo-500"
//   //               fill="none"
//   //               stroke="currentColor"
//   //               viewBox="0 0 24 24"
//   //               xmlns="http://www.w3.org/2000/svg"
//   //             >
//   //               <path
//   //                 strokeLinecap="round"
//   //                 strokeLinejoin="round"
//   //                 strokeWidth="2"
//   //                 d="M17 14v6m-3-3h6m-3-6h.01M5 14h.01M12 20h.01M12 10h.01M3 20h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
//   //               ></path>
//   //             </svg>
//   //             Gestión de Inventario 🥬
//   //           </h1>

//   //           <div className="flex items-center space-x-4">

//   //             <button
//   //                 className="
//   //                     flex items-center justify-center
//   //                     mx-auto my-4 px-6 py-2
//   //                     bg-green-700 text-white
//   //                     rounded-lg font-semibold shadow-lg
//   //                     hover:bg-green-600 transition duration-300
//   //                     transform hover:scale-[1.01]
//   //                     disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//   //                 "
//   //                 onClick={() => exportToCsv(dailyData, selectedDate)}
//   //                 // Deshabilitar si no hay datos para el día seleccionado
//   //                 disabled={!dailyData[selectedDate] || dailyData[selectedDate].items.length === 0}
//   //                 title="Descargar datos de producción del día seleccionado en formato CSV"
//   //             >
//   //                 <FaFileCsv size={18} className="mr-2" />
//   //                 Exportar a CSV ({selectedDate})
//   //             </button>

//   //             <button
//   //                 className="
//   //                     flex items-center justify-center
//   //                     mx-auto my-4 px-6 py-2
//   //                     bg-blue-600 text-white
//   //                     rounded-lg font-semibold shadow-lg
//   //                     hover:bg-blue-500 transition duration-300
//   //                     transform hover:scale-[1.01]
//   //                     disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//   //                 "
//   //                 onClick={() => exportAllToCsv(dailyData)}
//   //                 // Deshabilitar si no hay datos en todo el calendario
//   //                 disabled={!hasGlobalData}
//   //                 title="Descargar todos los datos históricos de producción en un solo archivo CSV"
//   //             >
//   //                 <FaFileDownload size={18} className="mr-2" />
//   //                 Exportar Datos Globales (CSV)
//   //             </button>

//   //             {/* Selector de Invernaderos */}
//   //             <GreenhouseSelector
//   //               greenhouses={greenhouses}
//   //               greenhouseId={greenhouseId}
//   //               handleSelectGreenhouse={handleSelectGreenhouse}
//   //               handleCreateGreenhouse={handleCreateGreenhouse}
//   //               handleDeleteGreenhouse={handleDeleteGreenhouse}
//   //               showManagementButtons={view === "calendar"}
//   //             />

//   //             <button
//   //               onClick={() => signOut(auth)}
//   //               className="py-2 px-4 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition flex items-center"
//   //             >
//   //                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
//   //               Cerrar Sesión
//   //             </button>
//   //           </div>
//   //         </div>
//   //       </header>

//   //       {/* CONTENIDO PRINCIPAL */}
//   //       {renderContent()}
//   //     </div>
//   //   );
//   // };

//   const renderContent = () => {
//     switch (view) {
//       case "calendar":
//         return (
//           // Contenedor principal del calendario y estadísticas
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             {/* Columna Izquierda: Calendario */}
//             <div className="lg:col-span-2">
//               <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
//                 Producción - {greenhouseName} 📅
//               </h2>
//               <div className="bg-white p-2 md:p-6 rounded-xl shadow-2xl">
//                 <CalendarGrid
//                   currentDate={currentDate}
//                   dailyData={dailyData}
//                   selectedDate={selectedDate}
//                   handleMonthChange={handleMonthChange}
//                   handleDayClick={handleDayClick}
//                   formatNumber={formatNumber}
//                   setSelectedDate={setSelectedDate}
//                 />
//               </div>
//             </div>

//             {/* Columna Derecha: Estadísticas y Meta (Stack en móviles) */}
//             <div className="space-y-6 pt-4 lg:pt-0">
//               <DatosEstadisticosCard
//                 key={selectedGreenhouseId} // <-- ¡Clave para la estabilidad!
//                 initialConfig={greenhouseConfig}
//                 onSaveConfig={handleGreenhouseConfigSave}
//                 dailyData={dailyData}
//                 formatNumber={formatNumber}
//               />

//               <InlineGlobalGoalTracker
//                 globalGoal={globalGoal}
//                 dailyTotalSum={dailyTotalSum}
//                 formatNumber={formatNumber}
//               />
//               <InlineGoalInput
//                 globalGoal={globalGoal}
//                 updateGoal={updateGoal}
//                 formatNumber={formatNumber}
//               />
//             </div>
//           </div>
//         );

//       case "day_view":
//         return (
//           <DayProductsGrid
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleDayClick={handleDayClick}
//             formatNumber={formatNumber}
//             calculateCosts={calculateCosts}
//             generatePDF={generatePDF}
//             REPORT_CONFIG={REPORT_CONFIG}
//           />
//         );

//       case "edit_products":
//         return (
//           <DayEditForm
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleItemChange={handleItemChange}
//             addItem={addItem}
//             deleteItem={deleteItem}
//             handleDayClick={handleDayClick}
//             handleSave={handleSave}
//             uploadImages={uploadImages}
//             formatNumber={formatNumber}
//             uploadUrl={YOUR_BACKEND_UPLOAD_URL}
//           />
//         );

//       case "edit_costs":
//         return (
//           <CostEditForm
//             dateKey={selectedDate}
//             dailyData={dailyData}
//             handleDayClick={handleDayClick}
//             handleSave={handleSave}
//             formatNumber={formatNumber}
//             calculateCosts={calculateCosts}
//             HOURLY_COST_RATE={HOURLY_COST_RATE}
//           />
//         );

//       default:
//         return (
//           <div className="p-6 text-center text-gray-500">
//             Vista no encontrada.
//           </div>
//         );
//     }
//   };

//   // =================================================================
//   // Componente Principal (Retorno JSX)
//   // =================================================================
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
//       {/* HEADER */}
//       <header className="sticky top-0 z-10 bg-white p-4 rounded-xl shadow-2xl mb-8 border-t-4 border-indigo-600">
//         <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           {/* Título Principal */}
//           <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex items-center">
//             <svg
//               className="w-7 h-7 md:w-8 md:h-8 mr-2 text-indigo-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 14v6m-3-3h6m-3-6h.01M5 14h.01M12 20h.01M12 10h.01M3 20h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
//               ></path>
//             </svg>
//             Gestión de Inventario 🥬
//           </h1>

//           {/* Controles y Log Out */}
//           <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">
//             {/* Selector de Invernaderos (Visible en todas partes) */}
//             <GreenhouseSelector
//               greenhouses={greenhouses}
//               greenhouseId={greenhouseId}
//               handleSelectGreenhouse={handleSelectGreenhouse}
//               handleCreateGreenhouse={handleCreateGreenhouse}
//               handleDeleteGreenhouse={handleDeleteGreenhouse}
//               showManagementButtons={view === "calendar"}
//             />

//             {/* Botón de Cerrar Sesión */}
//             <button
//               onClick={() => signOut(auth)}
//               className="w-full sm:w-auto py-2 px-4 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base"
//             >
//               <svg
//                 className="w-5 h-5 mr-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                 ></path>
//               </svg>
//               Cerrar Sesión
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* BOTONES DE EXPORTACIÓN (Fuera del header, solo visibles en vista 'calendar' y centrados) */}
//       {view === "calendar" && (
//         <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
//           {/* Botón de Exportación Diaria */}
//           <button
//             className="
//                       w-full sm:w-auto flex items-center justify-center
//                       px-6 py-3
//                       bg-green-600 text-white text-sm
//                       rounded-lg font-semibold shadow-md
//                       hover:bg-green-500 transition duration-300
//                       disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//                   "
//             onClick={() => exportToCsv(dailyData, selectedDate)}
//             disabled={
//               !dailyData[selectedDate] ||
//               dailyData[selectedDate].items.length === 0
//             }
//             title={`Descargar datos de producción del día ${selectedDate} en formato CSV`}
//           >
//             <FaFileCsv size={16} className="mr-2" />
//             Exportar Día ({selectedDate})
//           </button>

//           {/* Botón de Exportación Global */}
//           <button
//             className="
//                       w-full sm:w-auto flex items-center justify-center
//                       px-6 py-3
//                       bg-indigo-600 text-white text-sm
//                       rounded-lg font-semibold shadow-md
//                       hover:bg-indigo-500 transition duration-300
//                       disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed
//                   "
//             onClick={() => exportAllToCsv(dailyData)}
//             disabled={!hasGlobalData}
//             title="Descargar todos los datos históricos de producción en un solo archivo CSV"
//           >
//             <FaFileDownload size={16} className="mr-2" />
//             Exportar Datos Globales (CSV)
//           </button>
//         </div>
//       )}

//       {/* CONTENIDO PRINCIPAL (CalendarGrid / DayProductsGrid / etc) */}
//       <div className="bg-white p-4 md:p-8 rounded-xl shadow-2xl">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default App;
