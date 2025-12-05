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

// ­ƒÄ» IMPORTACI├ôN DE COMPONENTES EXTERNOS
import CostEditForm from "../../components/CostEditForm";
import CalendarGrid from "../../components/CalendarGrid";
import ProductItemForm from "../../components/ProductItemForm";
import DayProductsGrid from "../../components/DayProductsGrid";
import DatosEstadisticosCard from "./DatosEstadisticosCard";
import GreenhouseSelector from "../../components/GreenhouseSelector"; // Nuevo Componente
import HomeContent from "../../components/HomeContent.js/HomeContent";
// ­ƒöÑ REEMPLAZA ESTO CON TU CONFIGURACI├ôN REAL DE FIREBASE ­ƒöÑ
import { firebaseConfig } from "../../firebaseConfig";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// =======================================================================
// === CONFIGURACI├ôN Y UTILIDADES
// =======================================================================

const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};



const sanitizeDateKey = (date) => {
    // Implementaci├│n de la funci├│n (ej: reemplaza '-' por '_')
    if (typeof date !== 'string') return date;
    return date.replace(/-/g, '_');
};

const appId = getAppId();

const GREENHOUSE_STORAGE_KEY = `${appId}_selected_greenhouse_id`;

const preset_name = "presentacion12"; 
const cloud_name = "ddoeotuge"; 
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;



const REPORT_CONFIG = {
  COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
  REPORT_TITLE: "Finca Balsicas Producci├│n S.A.",
  LOGO_URL:"  " ,
};
    
const isProduction = process.env.NODE_ENV === "production";
const LOCAL_URL = "http://localhost:4500/api/upload/image";
const PRODUCTION_URL =
  "https://gestion-horticultura.netlify.app/api/upload/image";
const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

// Inicializaci├│n de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DATOS FIJOS Y CONSTANTES ---
const HOURLY_COST_RATE = 10;
const PRODUCT_CATALOG = {
  "IFCO 6410": 10,
  "IFCO 4312": 5,
  CARTON: 8,
  "NARANJA 2┬░": 16,
  "SAMPER 1┬░": 12,
  "SAMPER 2┬░": 15,
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
    toast.error("Selecciona un d├¡a con datos para exportar.");
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
    "Costo Final (Ôé¼/kg)",
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
  }); // Se a├▒ade BOM para codificaci├│n UTF-8
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Reporte_Produccion_${dateDisplay}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Datos de ${dateDisplay} exportados correctamente a CSV. ­ƒôÑ`);
};

const exportAllToCsv = (dailyData) => {
  // ­ƒöæ CORRECCI├ôN: Inicializaci├│n de seguridad. Si dailyData es null o undefined, usa un objeto vac├¡o {}.
  const data = dailyData || {};

  // 1. Verificar si hay datos
  // Ahora Object.keys se llama de forma segura sobre 'data'
  const allDateKeys = Object.keys(data).filter(
    (key) => data[key] && data[key].items?.length > 0
  );

  if (allDateKeys.length === 0) {
    // Asumiendo que 'toast' est├í disponible en el scope
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
    "Coste Final Diario (Ôé¼/kg)",
    "Coste Laboral Diario (Ôé¼)",
    "Total Produccion Dia (kg)",
  ].join(";");

  let csvRows = [];

  // 3. Iterar sobre CADA D├ìA en dailyData
  allDateKeys.forEach((dateKey) => {
    const dayData = data[dateKey]; // Usamos la variable 'data' segura
    const dateDisplay = dateKey; // Formato YYYY-MM-DD

    // Variables globales del d├¡a
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

    // 4. Mapear los datos de los productos de CADA D├ìA
    dayData.items.forEach((item) => {
      // dayData.items es seguro aqu├¡ gracias al filtro inicial
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
  // La adici├│n de [0xef, 0xbb, 0xbf] es para el BOM (Byte Order Mark), asegurando compatibilidad con caracteres especiales y Excel.
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

  // Asumiendo que 'toast' est├í disponible en el scope
  toast.success(
    `Exportaci├│n global completada: ${csvRows.length} l├¡neas de producto descargadas. ­ƒÆ¥`
  );
};







const uploadImages = async (imagesToUpload) => {
    const uploadedUrls = [];

    for (const item of imagesToUpload) {
        try {
            console.log(`Subiendo imagen ${item.id} directamente a Cloudinary...`);
            
            // Convertir la URL Base64 (que est├í en item.imageUrl) a un objeto File para FormData.
            // Esto es complicado, pero m├ís f├ícil si ya la tienes como objeto File/Blob.
            // Si la imagen proviene de un input 'file', DEBER├ìAMOS USAR LOS DATOS ORIGINALES DEL ARCHIVO, NO EL BASE64.

            // Dado que el item.imageUrl ahora es Base64 (porque antes usabas tu backend),
            // lo m├ís limpio es usar la subida a Cloudinary del Lado del Cliente (como en tu componente Cloudinary)
            
            // ­ƒøæ PASO CR├ìTICO: Convertir Base64 a Blob/File
            // La funci├│n item.imageUrl contiene el Base64 (ej: 'data:image/png;base64,iVBORw0KGg...')
            const base64Data = item.imageUrl.split(',')[1];
            const mimeType = item.imageUrl.split(';')[0].split(':')[1];
            const blob = await fetch(item.imageUrl).then(res => res.blob());
            
            const data = new FormData();
            data.append('file', blob); // Agregar el archivo (Blob)
            data.append('upload_preset', preset_name);
            // Tambi├®n puedes agregar un public_id ├║nico para rastrear la imagen si lo deseas
            // data.append('public_id', item.id); 

            
            const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: data // FormData gestiona el Content-Type autom├íticamente
            });
            
            if (!response.ok) {
                throw new Error(`Cloudinary error: ${response.statusText}`);
            }

            const file = await response.json(); 
            const newUrl = file.secure_url; 
            
            uploadedUrls.push({ id: item.id, url: newUrl });
            toast.success(`Imagen ${item.id} subida a Cloudinary.`);
            
        } catch (error) {
            console.error(`Error al subir la imagen ${item.id} a Cloudinary:`, error);
            toast.error(`Error al subir la imagen ${item.id}.`);
            // Si falla, mantenemos la URL Base64 antigua temporalmente, aunque no debe ser guardada en Firestore.
            uploadedUrls.push({ id: item.id, url: item.imageUrl }); 
        }
    }

    return uploadedUrls;
};




// const uploadImages = async (imagesToUpload, uploadUrl) => {
//   const uploadedUrls = [];
//   for (const item of imagesToUpload) {
//     try {
//       console.log(`Subiendo imagen ${item.id} a: ${uploadUrl}`);

//       uploadedUrls.push({ id: item.id, url: item.imageUrl });
//       // FIN SIMULACI├ôN
//     } catch (error) {
//       console.error(`Error al subir la imagen ${item.id}:`, error);
//       toast.error(`Error al subir la imagen ${item.id}.`);
//       uploadedUrls.push({ id: item.id, url: item.imageUrl }); // Mantener el Base64 si falla
//     }
//   }

//   return uploadedUrls;
// };






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

// Ruta a la configuraci├│n/meta global de un invernadero
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

  // Icono din├ímico para el estado
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

      {/* DETALLE DE FECHA L├ìMITE */}
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
            Fecha L├¡mite:
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
        {/* ├ìcono de Estado */}
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
            {remaining <= 0 ? "┬íMeta Superada!" : "Producci├│n Restante:"}
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
      console.error("Error de autenticaci├│n:", err);
      let errorMessage = "Ocurri├│ un error. Verifica tu correo/contrase├▒a.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        errorMessage = "Correo o contrase├▒a inv├ílidos.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya est├í registrado.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "La contrase├▒a debe tener al menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "El formato del correo electr├│nico es inv├ílido.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl border border-indigo-100">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        {isLogin ? "Iniciar Sesi├│n" : "Crear Cuenta"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electr├│nico
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
            Contrase├▒a
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
            placeholder="M├¡nimo 6 caracteres"
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
            ? "┬┐No tienes cuenta? Reg├¡strate aqu├¡."
            : "┬┐Ya tienes cuenta? Inicia sesi├│n aqu├¡."}
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
  // ­ƒÜ¿ CORRECCI├ôN: Agregar la URL de subida a las props
  uploadUrl,
}) => {
  // --- 1. Obtenci├│n y Estabilizaci├│n de Datos (usando dayData) ---
  const dayData = dailyData[dateKey] || { items: [] };

  // Ô£à CORRECCI├ôN ESLINT: Estabiliza la referencia de 'items'
  const items = useMemo(() => {
    return dayData.items || [];
  }, [dayData.items]);

  // Ô£à Estabiliza el c├ílculo del total (depende de la referencia estable de items)
  const dailyTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
  }, [items]);

  // --- 2. Estado Local ---
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- 3. L├│gica de Guardado Local ---
  const handleSaveLocal = async () => {
    setIsSaving(true);

    // Identificar im├ígenes Base64 para subir
    const imagesToUpload = items.filter(
      (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
    );
    console.log("Im├ígenes a subir:", imagesToUpload);

    if (imagesToUpload.length > 0) {
      setUploading(true);
      try {
        // ­ƒÜ¿ CORRECCI├ôN: Usar la prop 'uploadUrl'
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
        console.error("Error al subir im├ígenes o guardar:", error);
        toast.error("Error al guardar: Las im├ígenes no se pudieron subir.");
      } finally {
        setUploading(false);
      }
    } else {
      // Guardar sin subir im├ígenes
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
        Volver a la vista del d├¡a
      </button>
      <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
        Editar Productos del D├¡a: {dateKey}
      </h2>

      {/* Total Actualizado */}
      <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
        <p className="text-xl font-semibold text-green-800">
          Total Producci├│n (Kg) Actual:
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
          A├▒adir Producto
        </button>
        <button
          onClick={handleSaveLocal}
          className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
          disabled={isSaving} // Deshabilitar si ya est├í guardando
        >
          {isSaving || uploading
            ? `Guardando... (${uploading ? "Subiendo im├ígenes" : "Datos"})`
            : "Guardar Datos del D├¡a"}
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
  // === AUTENTICACI├ôN Y SELECCI├ôN DE INVERNADERO
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



const sanitizeForFirestore = (data) => {
    if (data === null || typeof data !== 'object') {
        return data;
    }
    
    // Si es una instancia de Date de JavaScript
    if (data instanceof Date) {
        return data.toISOString();
    }
    
    // Si es un objeto Timestamp de Firebase (Comprueba si existe el m├®todo toDate)
    if (typeof data.toDate === 'function') {
        return data.toDate().toISOString();
    }
    
    // Si es un Array
    if (Array.isArray(data)) {
        return data.map(item => sanitizeForFirestore(item));
    }
    
    // Si es un objeto normal, iterar sobre sus claves
    const cleaned = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            cleaned[key] = sanitizeForFirestore(data[key]);
        }
    }
    return cleaned;
};


  const generatePDF = useCallback(
    async (dateKey) => {
      // Objeto de d├¡a completo
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
      // ­ƒÉø Correcci├│n: Usamos una URL de logo condicional para evitar fallos si es vac├¡a
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
                    <p style="font-size: 11px; margin: 0; color: #9CA3AF;">Fecha de Impresi├│n:</p>
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
        bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este d├¡a.</p>`;
      } else {
        // Contenedor de la cuadr├¡cula de productos (Grid de 3 columnas para A4)
        bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">`;

        dailyDataEntry.items.forEach((item) => {
          const result = parseFloat(item.result || 0);

          // ­ƒÉø Correcci├│n: Usamos una imagen de placeholder si la URL es Base64
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
                        )} Ôé¼</p>
                    </div>
                </div>
            `;
      }

      const footerHtml = `
            <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 10px;">
                ${costDetailsHtml}
                <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCI├ôN TOTAL (Kg):</p>
                        <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion.toFixed(
                          2
                        )}</p>
                    </div>
                    <div style="width: 1px; background-color: #D1E5F7;"></div>
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/Ôé¼):</p>
                        <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
                    </div>
                </div>
                <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado autom├íticamente por el Sistema de Inventario - Documento Confidencial | Horticultura</p>
            </div>
        `;

      pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

      // 3. A├▒adir el contenido oculto al body y capturarlo
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
          // Usar CORS es CR├ìTICO para im├ígenes externas (como el logo)
          useCORS: true,
          // scrollY: -window.scrollY // Descomentar solo si el elemento est├í en la parte visible
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // Ancho A4 en mm
        const pageHeight = 295; // Alto A4 en mm

        // Calcula la altura de la imagen renderizada manteniendo la proporci├│n A4
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Primer renderizado
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Manejo de p├íginas m├║ltiples (si el contenido es muy largo)
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
        showMsg("PDF generado con ├®xito.", "success");
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
    // Si tienes un documento de configuraci├│n separado, usa esa ruta.
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
            // Limpieza completa al cerrar sesi├│n
            setGreenhouses([]);
            setGreenhouseId(null);
            setGreenhouseName("");
            setDailyData({});
            setGlobalGoal({});
            setGreenhouseConfig({});
            localStorage.removeItem(GREENHOUSE_STORAGE_KEY);
        }
    });

    // NO necesitas [greenhouseId] aqu├¡.
    return () => unsubscribe(); 
}, [auth]);

// --- CARGA Y SELECCI├ôN DE INVERNADEROS ---
useEffect(() => {
    if (!user) {
        setGreenhouses([]);
        setGreenhouseId(null);
        setGreenhouseName("Inicia sesi├│n para ver los datos");
        return;
    }

    const listRef = getGreenhousesListRef(db, user.uid);

    const unsubscribeList = onSnapshot(listRef, (docSnap) => {
        const data = docSnap.data() || { list: [] };
        const list = data.list || [];
        setGreenhouses(list);

        // L├ôGICA DE SELECCI├ôN INICIAL (solo si el ID actual no est├í establecido)
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



// --- SINCRONIZACI├ôN DE DATOS DIARIOS, METAS Y CONFIGURACI├ôN ---
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

    // 3. Sincronizar configuraci├│n (configRef)
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
  // === L├ôGICA DE MANEJO DE INVERNADEROS (NUEVO)
  // =======================================================================

  const updateGreenhouseConfig = async (newConfig) => {
    if (!user || !greenhouseId) {
        toast.error("Error: Usuario no autenticado o invernadero no seleccionado.");
        return;
    }

    try {
        // Obtenemos la referencia al documento de configuraci├│n del invernadero actual
        const goalRef = getGoalRef(db, user.uid, greenhouseId);

        // La funci├│n 'setDoc' con { merge: true } actualiza campos existentes 
        // y a├▒ade nuevos sin sobrescribir el documento completo.
        await setDoc(goalRef, newConfig, { merge: true });

        // Actualizamos el estado local (para evitar una recarga innecesaria si ya est├í suscrito)
        // Aunque el onSnapshot deber├¡a actualizarlo, esto asegura una respuesta inmediata.
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig // Fusionar la nueva configuraci├│n
        }));

        toast.success("Ô£à Configuraci├│n del invernadero guardada en Firebase.");
    } catch (error) {
        console.error("Error al guardar la configuraci├│n del invernadero:", error);
        toast.error("ÔØî Error al guardar la configuraci├│n. Int├®ntalo de nuevo.");
    }
};

  const handleCreateGreenhouse = async (name) => {
    if (!user) return;
    const newId = uuidv4();
    const listRef = getGreenhousesListRef(db, user.uid);
    const newGreenhouse = { id: newId, name: name };

    try {
      // 1. A├▒adir a la lista de invernaderos
      await updateDoc(listRef, {
        list: arrayUnion(newGreenhouse),
      }).catch(async (error) => {
        // Si el documento no existe (primera vez), cr├®alo
        if (error.code === "not-found") {
          await setDoc(listRef, { list: [newGreenhouse] });
        } else {
          throw error;
        }
      });

      // 2. Establecer como el invernadero seleccionado
      setGreenhouseId(newId);
      setGreenhouseName(name);
      toast.success(`Invernadero "${name}" creado con ├®xito.`);
    } catch (error) {
      console.error("Error creating greenhouse:", error);
      toast.error("Error al crear el invernadero.");
    }
  };

  const handleDeleteGreenhouse = async (id, name) => {
    if (
      !user ||
      !window.confirm(
        `┬┐Est├ís seguro de eliminar el invernadero "${name}" y TODOS sus datos? Esta acci├│n no se puede deshacer.`
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

      // 2. (OPCIONAL) Eliminar los documentos de datos y configuraci├│n
      const dailyRef = getDocRef(db, user.uid, id);
      const goalRef = getGoalRef(db, user.uid, id);
      await deleteDoc(dailyRef);
      await deleteDoc(goalRef);

      // 3. Reajustar la selecci├│n
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
  // === L├ôGICA DE MANEJO DE DATOS DIARIOS
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

  // Maneja click en un d├¡a del calendario
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

  // A├▒adir un nuevo producto al d├¡a (local)
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
      // Cl├íusulas de guardia
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

      // 2. Procesar la actualizaci├│n de PRODUCTOS (si se pasan 'items')
      if (items) {
        // Recalcular el resultado para cada ├¡tem (por si DayEditForm no lo hizo)
        const itemsToSave = items.map((item) => ({
          ...item,
          result: calculateResult(item.productName, item.factorB),
        }));

        const dailyTotal = itemsToSave.reduce(
          (sum, item) => sum + parseFloat(item.result || 0),
          0
        );

        // Actualizar el objeto con los nuevos ├¡tems y el total
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

      // 3. Procesar la actualizaci├│n de COSTES (si se pasa 'costData')
      if (costData) {
        // Actualizar solo los datos de costes
        newDayData.costData = costData;

        // Recalcular los costes con el total de producci├│n existente
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

        // ­ƒÜÇ CORRECCI├ôN CLAVE: Volver a la vista de detalle del d├¡a para ver el resultado
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
        // Usa la referencia a la configuraci├│n del invernadero (definida con getGoalRef)
        const configRef = getGoalRef(db, user.uid, greenhouseId);

        // setDoc con { merge: true } actualiza solo los campos proporcionados
        await setDoc(configRef, newConfig, { merge: true });

        // Actualizaci├│n local de la configuraci├│n (para UI inmediata)
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig 
        }));

        toast.success("Ô£à Configuraci├│n del invernadero (Meta/Config) guardada con ├®xito.");
    } catch (error) {
        console.error("Error al guardar la configuraci├│n del invernadero:", error);
        toast.error("ÔØî Error al guardar la configuraci├│n.");
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
        <p className="text-xl text-indigo-700">Cargando aplicaci├│n...</p>
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

  // Si est├í autenticado pero no hay invernaderos
  if (greenhouses.length === 0 && !greenhouseId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="flex justify-between items-center py-4 border-b border-indigo-200 mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            Horticultura App ­ƒ¬┤
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesi├│n
          </button>
        </header>
        <div className="max-w-xl mx-auto p-10 bg-white rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ┬íBienvenido!
          </h2>
          <p className="mb-6 text-gray-600">
            A├║n no tienes invernaderos registrados. Comienza creando uno para
            gestionar tus inventarios.
          </p>
          <GreenhouseSelector // Usamos el selector para la creaci├│n
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
switch(view){
case"home":
return(
<HomeContent dailyData={dailyData} greenhouses={greenhouses} selectedGreenhouseId={greenhouseId} setSelectedGreenhouseId={setGreenhouseId} updateGreenhouseConfig={saveGreenhouseConfig}/>
);
case"calendar":
return(
// 1. Contenedor principal del calendario y estad├¡sticas (Gap reducido para m├│vil)
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
<div className="lg:col-span-2">
<h2 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mb-4 border-b pb-2">
Producci├│n - {greenhouseName} ­ƒôà
</h2>
{/* ­ƒöæ CLAVE: Reducimos el padding A├ÜN M├üS en m├│vil (p-1) para que el CalendarGrid tenga m├íxima amplitud. 
     Asume que CalendarGrid es solo la rejilla de d├¡as sin su propio padding exterior.
*/}
<div className="p-1 sm:p-2">
<CalendarGrid currentDate={currentDate} dailyData={dailyData} selectedDate={selectedDate} handleMonthChange={handleMonthChange} handleDayClick={handleDayClick} formatNumber={formatNumber} setSelectedDate={setSelectedDate}/>
</div>
</div>
<div className="space-y-4 pt-4 lg:pt-0">
<DatosEstadisticosCard dailyData={dailyData} formatNumber={formatNumber} initialConfig={greenhouseConfig} onSaveConfig={saveGreenhouseConfig}/>
<InlineGlobalGoalTracker globalGoal={globalGoal} dailyTotalSum={dailyTotalSum} formatNumber={formatNumber}/>
<InlineGoalInput globalGoal={globalGoal} updateGoal={updateGoal} formatNumber={formatNumber}/>
</div>
</div>
);
case"day_view":
return(
<DayProductsGrid dateKey={selectedDate} dailyData={dailyData} handleDayClick={handleDayClick} formatNumber={formatNumber} calculateCosts={calculateCosts} generatePDF={generatePDF} REPORT_CONFIG={REPORT_CONFIG}/>
);
case"edit_products":
return(
<DayEditForm dateKey={selectedDate} dailyData={dailyData} handleItemChange={handleItemChange} addItem={addItem} deleteItem={deleteItem} handleDayClick={handleDayClick} handleSave={handleSave} uploadImages={uploadImages} formatNumber={formatNumber} uploadUrl={YOUR_BACKEND_UPLOAD_URL}/>
);
case"edit_costs":
return(
<CostEditForm dateKey={selectedDate} dailyData={dailyData} handleDayClick={handleDayClick} handleSave={handleSave} formatNumber={formatNumber} calculateCosts={calculateCosts} HOURLY_COST_RATE={HOURLY_COST_RATE}/>
);
default:
return(
<div className="p-6 text-center text-gray-500">
Vista no encontrada.
</div>
);
}
};


return(
<div className="min-h-screen bg-gray-100 p-1 sm:p-4 md:p-6 lg:p-10">
<header className="bg-white p-4 rounded-xl shadow-2xl mb-6 border-t-4 border-indigo-600">
<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
<h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex items-center">
<svg className="w-7 h-7 md:w-8 md:h-8 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6m-3-6h.01M5 14h.01M12 20h.01M12 10h.01M3 20h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
</svg>
Gesti├│n de Inventario ­ƒÑ¼
</h1>
<div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">
<div className="w-full sm:w-auto">
<GreenhouseSelector greenhouses={greenhouses} greenhouseId={greenhouseId} handleSelectGreenhouse={handleSelectGreenhouse} handleCreateGreenhouse={handleCreateGreenhouse} handleDeleteGreenhouse={handleDeleteGreenhouse} showManagementButtons={view==="calendar"}/>
</div>
<button onClick={()=>signOut(auth)} className="w-full sm:w-auto py-3 px-4 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition flex items-center justify-center text-sm md:text-base">
<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
</svg>
Cerrar Sesi├│n
</button>
</div>
</div>
</header>
{view==="calendar"&&(
<div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 px-1">
<button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-600 text-white text-base rounded-lg font-semibold shadow-md hover:bg-green-500 transition duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed" onClick={()=>exportToCsv(dailyData,selectedDate)} disabled={!dailyData[selectedDate]||dailyData[selectedDate].items.length===0} title={`Descargar datos de producci├│n del d├¡a ${selectedDate} en formato CSV`}>
<FaFileCsv size={16} className="mr-2"/>
Exportar D├¡a ({selectedDate})
</button>
<button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-base rounded-lg font-semibold shadow-md hover:bg-indigo-500 transition duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed" onClick={()=>exportAllToCsv(dailyData)} disabled={!hasGlobalData} title="Descargar todos los datos hist├│ricos de producci├│n en un solo archivo CSV">
<FaFileDownload size={16} className="mr-2"/>
Exportar Datos Globales (CSV)
</button>
</div>
)}
<div className="bg-white p-3 md:p-8 rounded-xl shadow-2xl">
{renderContent()}
</div>
</div>
);
};


export default App;
