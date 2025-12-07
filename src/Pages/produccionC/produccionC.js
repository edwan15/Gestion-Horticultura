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
import { useSelector } from "react-redux";
import { selectUserId } from "../../features/auth/authSlice/authSlice";

// IMPORTACION DE COMPONENTES EXTERNOS
import CostEditForm from "../../components/CostEditForm";
import CalendarGrid from "../../components/CalendarGrid";
import ProductItemForm from "../../components/ProductItemForm";
import DayProductsGrid from "../../components/DayProductsGrid";
import DatosEstadisticosCard from "./DatosEstadisticosCard";
import ExportReportModal from "../../components/export/ExportReportModal";
import ReportPreviewModal from "../../components/export/ReportPreviewModal";
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
  LOGO_URL:
    "data:image/png;base64,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",
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
  "NARANJA 2": 16,
  "SAMPER 1": 12,
  "SAMPER 2": 15,
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

const calculateCosts = (dailyTotal, costData) => {
  let productionCostVariable = 0;
  
  if (costData?.details && Array.isArray(costData.details) && costData.details.length > 0) {
      // Logic for new dynamic details
      let totalLabor = 0;
      let totalMachinery = 0;

      costData.details.forEach(item => {
          const w = parseFloat(item.workers) || 0;
          const h = parseFloat(item.hours) || 0;
          const labor = w * h * HOURLY_COST_RATE;
          
          totalLabor += labor;

          if (item.type === 'machinery') {
              totalMachinery += (parseFloat(item.machineryCost) || 0);
          }
      });
      productionCostVariable = totalLabor + totalMachinery;

  } else {
      // Legacy Logic
      const numWorkers = parseFloat(costData?.numWorkers) || 0;
      const hoursWorked = parseFloat(costData?.hoursWorked) || 0;
      
      productionCostVariable = numWorkers * hoursWorked * HOURLY_COST_RATE;
  }

  // Ensure 2 decimals for variable cost
  const variableCostFixed = parseFloat(productionCostVariable).toFixed(2);
  
  let finalProductionCost = 0;
  if (dailyTotal > 0) {
    finalProductionCost = (productionCostVariable / dailyTotal).toFixed(4);
  }

  return { productionCostVariable: variableCostFixed, finalProductionCost };
};

const exportToCsv = (dailyData, dateKeyToExport = null) => {
  // Si no se proporciona una clave, no podemos exportar.
  if (!dateKeyToExport || !dailyData[dateKeyToExport]) {
    toast.error("Selecciona un dia con datos para exportar.");
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
  }); // Se a├▒ade BOM para codificaci├│n UTF-8
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Reporte_Produccion_${dateDisplay}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Datos de ${dateDisplay} exportados correctamente a CSV`);
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
    "Coste Final Diario (€/kg)",
    "Coste Laboral Diario (€/kg)",
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 p-6 h-full transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Configurar Meta Global
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Objetivo (Kg)</label>
            <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-slate-700"
            placeholder="Ej: 50000"
            />
        </div>
        
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fecha Límite</label>
            <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-700"
            />
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
        >
          Guardar Configuración
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
  
  // Enterprise Color Logic
  const isComplete = remaining <= 0;
  const progressColor = isComplete ? "bg-emerald-500" : "bg-teal-500";
  const statusColor = isComplete ? "text-emerald-600" : "text-teal-600";
  const borderColor = isComplete ? "border-emerald-500" : "border-teal-500";
  const iconBg = isComplete ? "bg-emerald-100" : "bg-teal-100";
  const iconColor = isComplete ? "text-emerald-600" : "text-teal-600";
  
  return (
    <div className={`h-full p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border-l-4 ${borderColor} border-y border-r border-slate-100 transition-all hover:shadow-md flex flex-col justify-between`}>
      {/* HEADER Y META */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
            </svg>
            </div>
            <div>
                 <h3 className="text-sm uppercase tracking-wider font-bold text-slate-500">
                  Progreso General
                </h3>
                 <span className={`text-2xl font-extrabold ${statusColor}`}>
                  {formatNumber(target)} <span className="text-sm text-slate-400 font-normal">Kg (Meta)</span>
                </span>
            </div>
        </div>
        
        {globalGoal.deadline && (
             <div className="text-right">
                 <p className="text-xs font-semibold text-slate-400 uppercase">Fecha Limite</p>
                 <p className={`text-sm font-bold ${isPastDeadline ? "text-rose-500" : "text-slate-600"}`}>
                    {globalGoal.deadline}
                 </p>
             </div>
        )}
      </div>

      {/* METRICAS PRINCIPALES */}
      <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-xs text-slate-400 font-semibold mb-1">Recolectado</p>
               <p className="text-lg font-bold text-slate-700">{formatNumber(progress)} Kg</p>
           </div>
            <div className={`p-3 rounded-xl border ${isComplete ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
               <p className={`text-xs font-semibold mb-1 ${isComplete ? 'text-emerald-500' : 'text-orange-500'}`}>{isComplete ? 'Excedente' : 'Faltante'}</p>
               <p className={`text-lg font-bold ${isComplete ? 'text-emerald-700' : 'text-orange-700'}`}>{formatNumber(Math.abs(remaining))} Kg</p>
           </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Avance Real</span>
          <span className={`text-xs font-bold ${statusColor}`}>
            {formatNumber(safePercentage)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm ${progressColor}`}
            style={{ width: `${safePercentage}%` }}
          ></div>
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
      console.error("Error de autenticacion:", err);
      let errorMessage = "Ocurrio un error. Verifica tu correo/contraseña.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        errorMessage = "Correo o contraseña invalidos.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya esta registrado.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "El formato del correo electronico es invalido.";
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
            ? "¿No tienes cuenta? Registrate aqui."
            : "¿Ya tienes cuenta? Inicia sesion aqui."}
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

    // Identificar imágenes Base64 para subir
    const imagesToUpload = items.filter(
      (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
    );
    console.log("Imágenes a subir:", imagesToUpload);

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
        console.error("Error al subir imágenes o guardar:", error);
        toast.error("Error al guardar: Las imágenes no se pudieron subir.");
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
  const userId = useSelector(selectUserId);
  const [dailyData, setDailyData] = useState({});
  const [globalGoal, setGlobalGoal] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [view, setView] = useState("calendar"); // calendar, day_view, edit_products, edit_costs
  const [greenhouseConfig, setGreenhouseConfig] = useState({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState(null);
  const [previewData, setPreviewData] = useState(null);

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
      // ­ƒÉø Corrección: Usamos una URL de logo condicional para evitar fallos si es vacío
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
        bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este d├¡a.</p>`;
      } else {
        // Contenedor de la cuadr├¡cula de productos (Grid de 3 columnas para A4)
        bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">`;

        dailyDataEntry.items.forEach((item) => {
          const result = parseFloat(item.result || 0);

          // ­ƒÉø Corrección: Usamos una imagen de placeholder si la URL es Base64
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
          // Usar CORS es CRítico para imágenes externas (como el logo)
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
    // Si tienes un documento de configuración separado, usa esa ruta.
    // Si la config de datos se guarda con la meta global, usa getGoalRef.
    return doc(
      dbInstance,
      `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/config/data_config`
    );
  };




  useEffect(() => {
    setLoading(false);
    if (!userId) {
      // Limpieza completa al cerrar sesión
      setGreenhouses([]);
      setGreenhouseId(null);
      setGreenhouseName("");
      setDailyData({});
      setGlobalGoal({});
      setGreenhouseConfig({});
      localStorage.removeItem(GREENHOUSE_STORAGE_KEY);
    }
  }, [userId]);

// --- CARGA Y SELECCIÓN DE INVERNADEROS ---
  useEffect(() => {
    if (!userId) {
      setGreenhouses([]);
      setGreenhouseId(null);
      setGreenhouseName("Inicia sesión para ver los datos");
      return;
    }

    const listRef = getGreenhousesListRef(db, userId);

    const unsubscribeList = onSnapshot(listRef, (docSnap) => {
        const data = docSnap.data() || { list: [] };
        const list = data.list || [];
        setGreenhouses(list);

        // Lógica de selección inicial (solo si el ID actual no está establecido)
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
  }, [userId]); // Dependencia clave: [userId]



// --- SINCRONIZACIÓN DE DATOS DIARIOS, METAS Y CONFIGURACIÓN ---
  useEffect(() => {
    if (!userId || !greenhouseId) {
      setDailyData({});
      setGlobalGoal({});
      setGreenhouseConfig({});
      return;
    }

    // 1. Sincronizar datos diarios
    const dailyRef = getDocRef(db, userId, greenhouseId);
    const unsubscribeDaily = onSnapshot(dailyRef, (docSnap) => {
        setDailyData(docSnap.data() || {});
    });

    // 2. Sincronizar metas globales (goalRef)
    const goalRef = getGoalRef(db, userId, greenhouseId);
    const unsubscribeGoal = onSnapshot(goalRef, (docSnap) => {
        setGlobalGoal(docSnap.data() || {});
    });

    // 3. Sincronizar configuración (configRef)
    const configRef = getGoalRef(db, userId, greenhouseId); // Asumo que goalRef y configRef apuntan al mismo documento si ambos usan getGoalRef
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
}, [userId, greenhouseId]); // Dependencia clave: [userId, greenhouseId]

  // =======================================================================
  // === Lógica de manejo de invernaderos (NUEVO)
  // =======================================================================

  const updateGreenhouseConfig = async (newConfig) => {
    if (!userId || !greenhouseId) {
        toast.error("Error: Usuario no autenticado o invernadero no seleccionado.");
        return;
    }

    try {
        // Obtenemos la referencia al documento de configuracin del invernadero actual
        const goalRef = getGoalRef(db, userId, greenhouseId);

        // La funci├│n 'setDoc' con { merge: true } actualiza campos existentes 
        // y a├▒ade nuevos sin sobrescribir el documento completo.
        await setDoc(goalRef, newConfig, { merge: true });

        // Actualizamos el estado local (para evitar una recarga innecesaria si ya est├í suscrito)
        // Aunque el onSnapshot deber├¡a actualizarlo, esto asegura una respuesta inmediata.
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig // Fusionar la nueva configuración
        }));

        toast.success("Configuración del invernadero guardada en Firebase.");
    } catch (error) {
        console.error("Error al guardar la configuración del invernadero:", error);
        toast.error("Error al guardar la configuración. Inténtalo de nuevo.");
    }
};

  const handleCreateGreenhouse = async (name) => {
    if (!userId) return;
    const newId = uuidv4();
    const listRef = getGreenhousesListRef(db, userId);
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
      toast.success(`Invernadero "${name}" creado con exito.`);
    } catch (error) {
      console.error("Error creating greenhouse:", error);
      toast.error("Error al crear el invernadero.");
    }
  };

  const handleDeleteGreenhouse = async (id, name) => {
    if (
      !userId ||
      !window.confirm(
        `¿Estás seguro de eliminar el invernadero "${name}" y TODOS sus datos? Esta acción no se puede deshacer.`
      )
    )
      return;

    const listRef = getGreenhousesListRef(db, userId);
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

      // 2. (OPCIONAL) Eliminar los documentos de datos y configuracion
      const dailyRef = getDocRef(db, userId, id);
      const goalRef = getGoalRef(db, userId, id);
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
  // === Lógica de manejo de datos diarios
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
          currentDay.costData || {} // Use costData object
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
      if (!userId || !greenhouseId) return;

      const dailyRef = getDocRef(db, userId, greenhouseId);
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
        // Recalcular el resultado para cada item (por si DayEditForm no lo hizo)
        const itemsToSave = items.map((item) => ({
          ...item,
          result: calculateResult(item.productName, item.factorB),
        }));

        const dailyTotal = itemsToSave.reduce(
          (sum, item) => sum + parseFloat(item.result || 0),
          0
          );

        // Actualizar el objeto con los nuevos items y el total
        newDayData.items = itemsToSave;
        newDayData.dailyTotal = dailyTotal.toFixed(2);

        // Recalcular los costes si ya existen datos de costes
        const costs = calculateCosts(
          dailyTotal,
          newDayData.costData || {} // Use updated costData
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
        // Note: costData already contains details due to logic in CostEditForm
        // But we recalculate to ensure consistency with dailyTotal and server-side truth
        const dailyTotal = parseFloat(newDayData.dailyTotal || 0); // Define dailyTotal
        const costs = calculateCosts(dailyTotal, costData);

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

        // CORRECCI├ôN CLAVE: Volver a la vista de detalle del d├¡a para ver el resultado
        toast.success(`Datos guardados para ${dateKey}.`);
        handleDayClick(dateKey, "day_view");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        toast.error("Error al guardar datos.");
      }
    },
    [
      userId,
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
    if (!userId || !greenhouseId) {
        toast.error("Error: Usuario no autenticado o invernadero no seleccionado.");
        return;
    }

    try {
        // Usa la referencia a la configuración del invernadero (definida con getGoalRef)
        const configRef = getGoalRef(db, userId, greenhouseId);

        // setDoc con { merge: true } actualiza solo los campos proporcionados
        await setDoc(configRef, newConfig, { merge: true });

        // Actualización local de la configuración (para UI inmediata)
        setGreenhouseConfig(prev => ({
            ...prev,
            ...newConfig 
        }));

        toast.success("Configuración del invernadero (Meta/Config) guardada con éxito.");
    } catch (error) {
        console.error("Error al guardar la configuración del invernadero:", error);
        toast.error("✖ Error al guardar la configuración.");
    }
}, [userId, greenhouseId]); // Dependencias para useCallback

  // Guardar meta global en Firebase
  const updateGoal = useCallback(
    async (goal, deadline) => {
      if (!userId || !greenhouseId) return;

      try {
        const goalRef = getGoalRef(db, userId, greenhouseId);
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
    [userId, greenhouseId]
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

  if (!userId) {
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
            Horticultura App ­
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
            Bienvenido!
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





    const handleOpenExport = () => setIsExportModalOpen(true);

  const handlePreview = (config) => {
    setExportConfig(config);
    setIsExportModalOpen(false);

    // Filter Logic
    const allItems = [];
    let totalKg = 0;
    let totalCost = 0;
    
    // Config has config.dateRange (e.g., 'last_year', 'today', 'yesterday')
    const now = new Date();
    const todayStr = formatDate(now);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    const getStartDate = (range) => {
        const d = new Date();
        if (range === 'today') return d;
        if (range === 'yesterday') return yesterday; // Special case handled by string check usually
        if (range === 'last_week') d.setDate(d.getDate() - 7);
        if (range === 'last_month') d.setMonth(d.getMonth() - 1);
        if (range === 'last_year') d.setFullYear(d.getFullYear() - 1);
        if (range === 'all') return new Date('2000-01-01');
        return new Date('2000-01-01'); // Default to all if unknown
    };

    const startDate = getStartDate(config.dateRange);

    Object.keys(dailyData).forEach(date => {
        // Date Check
        let isValidDate = false;
        
        if (config.dateRange === 'all') isValidDate = true;
        else if (config.dateRange === 'today') isValidDate = (date === todayStr);
        else if (config.dateRange === 'yesterday') isValidDate = (date === yesterdayStr);
        else {
             // range check
             const currentDate = new Date(date);
             // Verify valid date object
             if (!isNaN(currentDate.getTime())) {
                isValidDate = currentDate >= startDate && currentDate <= now;
             }
        }

        if (isValidDate) {
            const day = dailyData[date];
            if(day.items) {
                day.items.forEach(item => {
                    const kg = parseFloat(item.factorA || 0);
                    const cost = parseFloat(item.result || 0);
                    allItems.push({
                        date,
                        product: item.productName,
                        kg: formatNumber(kg),
                        cost: formatNumber(cost)
                    });
                    totalKg += kg;
                    totalCost += cost;
                });
            }
        }
    });

    setPreviewData({
        farm: greenhouseName || config.farm,
        productionItems: allItems,
        totals: {
            kg: totalKg,
            cost: totalCost,
            efficiency: totalCost > 0 ? (totalKg/totalCost).toFixed(2) : 0
        }
    });
    
    setIsPreviewModalOpen(true);
  };

  const renderContent = () => {
switch(view){
case"home":
return(
<HomeContent dailyData={dailyData} greenhouses={greenhouses} selectedGreenhouseId={greenhouseId} setSelectedGreenhouseId={setGreenhouseId} updateGreenhouseConfig={saveGreenhouseConfig}/>
);
      case "calendar":
        return (
          // 1. Contenedor principal del calendario y estadisticas
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMNA IZQUIERDA: CALENDARIO (8 columnas) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-xl">📅</span> Calendario de Cosecha
                  </h2>
                   <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">
                      {greenhouseName || "General"}
                   </div>
                </div>
                
                <div className="p-2 sm:p-4">
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
            </div>

            {/* COLUMNA DERECHA: WIDGETS (4 columnas) */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
              {/* Widget Estadisticas */}
              <DatosEstadisticosCard
                dailyData={dailyData}
                formatNumber={formatNumber}
                initialConfig={greenhouseConfig}
                onSaveConfig={saveGreenhouseConfig}
              />
              
              {/* Widget Meta Global */}
              <div className="flex-1 min-h-[200px]">
                 <InlineGlobalGoalTracker
                    globalGoal={globalGoal}
                    dailyTotalSum={dailyTotalSum}
                    formatNumber={formatNumber}
                  />
              </div>

               {/* Widget Configuracion */}
               <div>
                  <InlineGoalInput
                    globalGoal={globalGoal}
                    updateGoal={updateGoal}
                    formatNumber={formatNumber}
                  />
               </div>
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



  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 selection:bg-emerald-100 selection:text-emerald-800">
      {/* Fondo Decorativo Sutil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8 lg:px-8 max-w-7xl">
        {/* Header Moderno con Glassmorphism */}
        <header className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 p-5 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3.5 rounded-2xl shadow-lg shadow-emerald-200/50 transform transition hover:scale-105 duration-300">
              {/* Icono de Planta/Produccion */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Gestión de Producción
              </h1>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Control de Cultivos en Tiempo Real
              </p>
            </div>
          </div>

          {/* Selector y Logout */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="w-full sm:w-auto">
                <GreenhouseSelector
                  greenhouses={greenhouses}
                  greenhouseId={greenhouseId}
                  handleSelectGreenhouse={handleSelectGreenhouse}
                  handleCreateGreenhouse={handleCreateGreenhouse}
                  handleDeleteGreenhouse={handleDeleteGreenhouse}
                  showManagementButtons={view === "calendar"}
                />
             </div>
             
             <button
              onClick={() => signOut(auth)}
              className="group flex items-center justify-center p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 shadow-sm"
              title="Cerrar Sesi├│n"
             >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
             </button>
          </div>
        </header>

        {/* Acciones Globales (Solo en calendario) */}
        {view === "calendar" && (
          <div className="flex flex-wrap items-center justify-end gap-3 mb-8 animate-fade-in-up">
            <button
              className="flex items-center px-5 py-2.5 bg-white text-slate-600 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm group"
              onClick={() => exportToCsv(dailyData, selectedDate)}
              disabled={
                !dailyData[selectedDate] ||
                dailyData[selectedDate].items.length === 0
              }
            >
              <FaFileCsv className="mr-2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
              Exportar Día ({selectedDate})
            </button>
            <button
              className="flex items-center px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all duration-200 -translate-y-0.5 transform disabled:opacity-50 disabled:translate-y-0 text-sm"
              onClick={() => exportAllToCsv(dailyData)}
              disabled={!hasGlobalData}
            >
              <FaFileDownload className="mr-2 text-emerald-400" size={16} />
              Exportar Datos Globales
            </button>
            <button
              className="flex items-center px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all duration-200 -translate-y-0.5 transform text-sm"
              onClick={handleOpenExport}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Exportar Informe
            </button>
          </div>
        )}

        {/* Contenido Principal */}
        <div className="animate-fade-in">
             {renderContent()}
        <ExportReportModal 
          isOpen={isExportModalOpen} 
          onClose={() => setIsExportModalOpen(false)} 
          onPreview={handlePreview}
        />
        <ReportPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          config={exportConfig}
          data={previewData}
        />
        </div>
      </div>
    </div>
  );
};


export default App;




