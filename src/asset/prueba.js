ort React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";

// 🔥 NUEVOS IMPORTS para la exportación a PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- CONFIGURACIÓN DE FIREBASE E INICIALIZACIÓN ---

const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};
const appId = getAppId();

// 🔥🔥 ¡IMPORTANTE! URL DE TU PROPIO ENDPOINT DE BACKEND 🔥🔥
const isProduction = process.env.NODE_ENV === "production";
const LOCAL_URL = "http://localhost:4500/api/upload/image";
const PRODUCTION_URL =
  "https://gestion-horticultura.netlify.app/api/upload/image";

const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

console.log(`Usando URL: ${YOUR_BACKEND_UPLOAD_URL}`);
// =======================================================================
// === DATOS FIJOS PARA EL HEADER DEL PDF 📄
// =======================================================================
const REPORT_CONFIG = {
  COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
  REPORT_TITLE: "Finca Balsicas Producción S.A.",
  LOGO_URL:" "
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDocRef = (dbInstance, userId) => {
  return doc(dbInstance, `artifacts/${appId}/users/${userId}/daily_data/data`);
};

// =======================================================================
// === CONSTANTE DE COSTE DE HORA (MODIFICABLE) 💸
// =======================================================================
const HOURLY_COST_RATE = 10; // € o la moneda que uses. ¡Dato Fijo, Modificable en el código!

// =======================================================================
// === FUNCIÓN DE EXPORTACIÓN CSV (Sin cambios)
// =======================================================================
const exportToCsv = (data, dateKeyToExport = null) => {
  const dateKeys = dateKeyToExport
    ? [dateKeyToExport]
    : Object.keys(data).sort();

  if (dateKeys.length === 0) {
    console.error("No hay datos para exportar.");
    return;
  }

  const headers = [
    "Fecha",
    "Tipo_Linea",
    "Nombre_Producto",
    "Factor_A",
    "Factor_B",
    "Resultado_Multiplicacion_Kg",
    "URL_Imagen",
    // NUEVOS CAMPOS DE COSTE
    "N_Trabajadores",
    "H_Trabajadas",
    "Coste_Hora_Fijo",
    "Produccion_Coste_Variable_EUR",
    "Coste_Produccion_Final_Kg_EUR",
  ];
  let csvContent = headers.join(";") + "\n";

  for (const dateKey of dateKeys) {
    const dayData = data[dateKey];
    const items = dayData?.items || [];
    const dailyTotal = items.reduce(
      (sum, item) => sum + parseFloat(item.result || 0),
      0
    );

    const numWorkers = dayData.numWorkers || 0;
    const hoursWorked = dayData.hoursWorked || 0;
    const productionCostVariable = dayData.productionCostVariable || 0;
    const finalProductionCost = dayData.finalProductionCost || 0;

    for (const item of items) {
      const result = parseFloat(item.result || 0);

      const imageUrlString = item.imageUrl ? `"${item.imageUrl}"` : "";

      const row = [
        dateKey,
        "DETALLE_PRODUCTO",
        item.productName || "",
        parseFloat(item.factorA || 0).toFixed(0),
        parseFloat(item.factorB || 0).toFixed(0),
        result.toFixed(2),
        imageUrlString,
        "", // N_Trabajadores
        "", // H_Trabajadas
        "", // Coste_Hora_Fijo
        "", // Produccion_Coste_Variable_EUR
        "", // Coste_Produccion_Final_Kg_EUR
      ];
      csvContent += row.join(";") + "\n";
    }

    // Fila Total Diario (incluye los costes si existen)
    if (items.length > 0 || numWorkers > 0 || hoursWorked > 0) {
      const totalRow = [
        dateKey,
        "TOTAL_DIARIO",
        "",
        "",
        "",
        dailyTotal.toFixed(2),
        "",
        numWorkers.toFixed(0),
        hoursWorked.toFixed(2),
        HOURLY_COST_RATE.toFixed(2),
        productionCostVariable.toFixed(2),
        finalProductionCost.toFixed(4),
      ];
      csvContent += totalRow.join(";") + "\n";
    }
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);

  const fileName = dateKeyToExport
    ? `exportacion_dia_${dateKeyToExport}.csv`
    : `exportacion_calendario_${formatDate(new Date())}.csv`;

  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// =======================================================================
// === CATÁLOGO DE PRODUCTOS (Sin cambios)
// =======================================================================
const PRODUCT_CATALOG = {
  "IFCO 6410": 10,
  "IFCO 4312": 5,
  CARTON: 8,
  "NARANJA 2°": 16,
  "SAMPER 1°": 12,
  "SAMPER 2°": 15,
};

// =======================================================================
// === InputField (Sin cambios)
// =======================================================================

const InputField = ({
  label,
  value,
  field,
  type = "text",
  placeholder = "Ingresa un valor",
  item,
  handleItemChange,
  handleItemBlur,
}) => {
  const handleChange = (e) => {
    handleItemChange(item.id, field, e.target.value);
  };

  const handleBlur = () => {
    if (field === "factorB") {
      handleItemBlur(item.id, field);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && field === "factorB") {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        key={`${item.id}-${field}`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition"
      />
    </div>
  );
};

// =======================================================================
// === ProductItemForm (Sin cambios relevantes a la lógica, solo para el rendering)
// =======================================================================

const ProductItemForm = React.memo(
  ({
    item,
    index,
    handleItemChange,
    handleItemBlur,
    deleteItem,
    handleDayClick,
  }) => {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        handleItemChange(item.id, "imageUrl", reader.result);
      };
      reader.readAsDataURL(file);
    };

    const handleProductNameChange = (e) => {
      handleItemChange(item.id, "productName", e.target.value);
    };

    const isBase64Image =
      item.imageUrl && item.imageUrl.startsWith("data:image");

    return (
      <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
          <h4 className="text-xl font-bold text-indigo-700">
            Producto #{index + 1}
          </h4>
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
            aria-label="Eliminar producto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* 1. CAMPO NOMBRE DEL PRODUCTO (SELECT) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <select
            value={item.productNameInput}
            onChange={handleProductNameChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition bg-white"
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {Object.keys(PRODUCT_CATALOG).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. CAMPOS DE CÁLCULO */}
        <div className="grid grid-cols-2 gap-4">
          {/* Factor A: SÓLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso(kg) (Automático)
            </label>
            <input
              type="text"
              value={item.factorAInput}
              readOnly
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
            />
          </div>

          {/* Factor B: INPUT NORMAL */}
          <InputField
            label="Cajas (Ingresar)"
            value={item.factorBInput}
            field="factorB"
            placeholder="0"
            item={item}
            handleItemChange={handleItemChange}
            handleItemBlur={handleItemBlur}
          />
        </div>

        {/* 3. CAMPO DE SUBIDA DE IMAGEN LOCAL */}
        <div className="border border-indigo-300 rounded-lg p-3 bg-white">
          <label
            htmlFor={`image-upload-${item.id}`}
            className="block text-sm font-medium text-indigo-700 mb-2"
          >
            Documentación Visual (Imagen)
          </label>
          <input
            type="file"
            id={`image-upload-${item.id}`}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                document.getElementById(`image-upload-${item.id}`).click()
              }
              className="py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition flex items-center text-sm"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                ></path>
              </svg>
              Seleccionar Imagen
            </button>

            {item.imageUrl && (
              <button
                type="button"
                onClick={() => handleItemChange(item.id, "imageUrl", "")}
                className="text-red-500 text-sm hover:text-red-700 transition"
              >
                Quitar Imagen
              </button>
            )}
          </div>

          {item.imageUrl && (
            <div className="mt-3 p-2 border border-gray-200 rounded-lg text-center bg-gray-50">
              <p className="text-xs text-gray-600 mb-1 font-semibold">
                Previsualización (Máx 200px):
              </p>
              <img
                src={item.imageUrl}
                alt={`Imagen de ${item.productNameInput || "Producto"}`}
                style={{ maxHeight: "200px", width: "auto" }}
                className="mx-auto rounded-md shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  console.error("Error al cargar la imagen Base64 o URL");
                }}
              />
              {isBase64Image && (
                <p className="text-xs text-amber-600 font-bold mt-2">
                  La imagen se subirá a Cloudinary a través del backend al
                  guardar.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 4. RESULTADO */}
        <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-300">
          <p className="text-sm font-medium text-indigo-800">Resultado:</p>
          <p className="text-xl font-bold text-indigo-900 mt-1">
            {parseFloat(item.factorA || 0)} * {parseFloat(item.factorB || 0)} ={" "}
            <span className="text-green-700">{item.result}</span>
            Kg
          </p>
        </div>
      </div>
    );
  }
);

// =======================================================================
// === ProductCard (Sin cambios)
// =======================================================================
const ProductCard = React.memo(({ item }) => {
  const factorA = parseFloat(item.factorA || 0);
  const factorB = parseFloat(item.factorB || 0);
  const result = parseFloat(item.result || 0);
  const imageUrl = item.imageUrl;
  const productName = item.productName || "Producto sin nombre";

  let colorClass = "border-blue-300 bg-blue-50/70 text-blue-900";
  if (result > 1500) {
    colorClass = "border-green-400 bg-green-50/70 text-green-900";
  } else if (result > 500) {
    colorClass = "border-amber-400 bg-amber-50/70 text-amber-900";
  }

  const displayImageUrl = imageUrl
    ? imageUrl.replace("/upload/", "/upload/c_fit,w_400,q_auto:good/")
    : imageUrl;

  return (
    <div
      className={`
                p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm
                transition-all duration-300 ease-in-out transform
                hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-1
                ${colorClass}
            `}
    >
      <div className="flex justify-between items-start mb-3 border-b border-current/30 pb-2">
        <h3 className="text-xl font-extrabold truncate">{productName}</h3>
      </div>

      {imageUrl && (
        <div className="mb-3">
          <img
            src={displayImageUrl}
            alt={`Imagen de ${productName}`}
            className="w-full max-h-36 object-cover rounded-lg shadow-inner border border-current/30"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="space-y-2 mb-4 text-sm font-medium">
        <p className="flex justify-between">
          <span>Factor A:</span>
          <span className="font-bold">{factorA}</span>
        </p>
        <p className="flex justify-between">
          <span>Factor B:</span>
          <span className="font-bold">{factorB}</span>
        </p>
      </div>

      <div className="p-3 mt-4 rounded-lg bg-white/70 shadow-inner border border-current/50">
        <p className="text-lg font-bold flex justify-between items-center">
          <span className="uppercase text-gray-600">Total Producido:</span>
          <span className="text-lg font-extrabold text-indigo-700">
            {result.toFixed(0)}{" "}
            <span className="text-base font-normal">Kg</span>
          </span>
        </p>
      </div>
    </div>
  );
});

// =======================================================================
// === DayProductsGrid (Modificado para añadir botón de PDF)
// =======================================================================
const DayProductsGrid = ({
  dateKey,
  dailyData,
  handleDayClick,
  generatePDF,
}) => {
  // 👈 Recibe generatePDF
  const dayData = dailyData[dateKey];
  const items = dayData?.items || [];

  const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dailyTotal = items.reduce(
    (sum, item) => sum + parseFloat(item.result || 0),
    0
  );
  const finalProductionCost = dayData?.finalProductionCost || 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-2xl">
      <button
        onClick={() => handleDayClick(null)}
        className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Volver al Calendario
      </button>

      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Producción</h2>
          <p className="text-xl text-indigo-600 font-semibold">{dateDisplay}</p>
        </div>
        <div className="text-right p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total del Día:</p>
          <p className="text-3xl font-extrabold text-green-700">
            {dailyTotal.toFixed(2)} Kg
          </p>
        </div>
      </div>

      {/* Nueva Card para el Coste de Producción Final */}
      <div className="mb-6 p-4 bg-teal-100 rounded-xl border border-teal-300 shadow-inner flex justify-between items-center">
        <h3 className="text-xl font-bold text-teal-800">
          Coste de Producción Final:
        </h3>
        <div className="flex items-baseline space-x-2">
          <p className="text-4xl font-extrabold text-blue-700">
            {finalProductionCost.toFixed(4)}
          </p>
          <span className="text-lg font-semibold text-blue-600">Kg/€</span>
          <button
            onClick={() => handleDayClick(dateKey, "cost-grid")}
            className="text-sm text-teal-600 hover:text-teal-800 underline ml-4"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
          No hay productos guardados para este día.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:space-x-4">
        {/* 💡 CLASES CLAVE: flex-col y gap-3 (móvil) -> sm:flex-row y sm:space-x-4 (tableta/escritorio) */}

        {/* Botón para Editar Productos */}
        <button
          onClick={() => handleDayClick(dateKey, "edit")}
          className="flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.05]"
        >
          {/* ÍCONO: Siempre visible */}
          <svg
            className="w-5 h-5 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          {/* TEXTO: Oculto en móvil, visible a partir de tableta (sm) */}
          <span className="items-center">Editar / Añadir Productos</span>
        </button>

        {/* Botón para Editar Costes */}
        <button
          onClick={() => handleDayClick(dateKey, "cost-edit")}
          className="flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition transform hover:scale-[1.05]"
        >
          <svg
            className="w-5 h-5 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 7h6m0 10v3m-3 3h-3m3-3V7m0 0h-2m2 0h2M9 7v6m0-6h2m-2 0H7m2 6v-3m0 3h-2m2 0h2m0-6h-2m2 0h2M9 10h6m-3-3v6m0 0v-6"
            ></path>
          </svg>
          {/* TEXTO: Oculto en móvil, visible a partir de tableta (sm) */}
          <span className="items-center">Calcular Costes</span>
        </button>

        {/* 🔥 BOTÓN EXPORTAR PDF */}
        <button
          onClick={() => generatePDF(dateKey)}
          className=" flex justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-[1.05]"
        >
          <svg
            className="w-5 h-5 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l3-3m-3 3l-3-3m-3 8h12a2 2 0 002-2V7a2 2 0 00-2-2h-3.328A3 3 0 0012 3m0 18H5a2 2 0 01-2-2v-7a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2z"
            ></path>
          </svg>
          {/* TEXTO: Oculto en móvil, visible a partir de tableta (sm) */}
          <span className="items-center">Exportar PDF</span>
        </button>
      </div>
    </div>
  );
};

// =======================================================================
// === ProductionCostForm (Sin cambios)
// =======================================================================
const ProductionCostForm = React.memo(
  ({ dateKey, dailyData, saveData, handleDayClick }) => {
    // Obtener los datos existentes para el día
    const dayData = dailyData[dateKey] || {};
    const items = dayData.items || [];

    // Calcular el Total del Día (la suma de todos los results de los productos)
    const dailyTotalProduction = useMemo(() => {
      return items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0);
    }, [items]);

    // Estado local para los campos del cálculo de costes (usando los valores guardados o por defecto)
    const [costData, setCostData] = useState({
      numWorkers: dayData.numWorkers || 0,
      hoursWorked: dayData.hoursWorked || 0,
    });
    handleDayClick(dateKey, "cost-grid"); // Volver a la vista de costes

    // Función para manejar el cambio en los campos numéricos
    const handleCostChange = (field, value) => {
      const cleanValue = value.toString().replace(/,/g, ".");
      const numericValue = parseFloat(cleanValue) || 0;
      setCostData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    };

    // 1. Cálculo de Produccion (Coste Variable)
    const productionCostVariable = useMemo(() => {
      return costData.numWorkers * costData.hoursWorked * HOURLY_COST_RATE;
    }, [costData.numWorkers, costData.hoursWorked]);

    // 2. Cálculo del Coste de Producción Final (Total Día / Coste Variable)
    const finalProductionCost = useMemo(() => {
      if (productionCostVariable === 0 || dailyTotalProduction === 0) {
        return 0; // Evitar división por cero
      }
      return dailyTotalProduction / productionCostVariable;
    }, [dailyTotalProduction, productionCostVariable]);

    // Función de Guardado (Utiliza saveData con el indicador isCostSave = true)
    const handleSaveCostData = async () => {
      // Objeto a guardar: items existentes + nuevos campos de coste
      const dataToSave = {
        items: items, // Mantener los items de producción
        numWorkers: costData.numWorkers,
        hoursWorked: costData.hoursWorked,
        productionCostVariable: productionCostVariable,
        finalProductionCost: finalProductionCost,
      };

      await saveData(dateKey, dataToSave, true); // isCostSave = true

      handleDayClick(dateKey, "cost-grid"); // Volver a la vista de costes
    };

    // Formateo de números para visualización
    const formatNumber = (num, decimals = 2) => (num || 0).toFixed(decimals);

    return (
      <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-teal-500 max-w-lg mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-teal-700 border-b pb-2">
          Análisis de Coste de Producción 📊
        </h3>

        {/* Total del Día (Producción en Kg) */}
        <div className="p-3 bg-indigo-50 rounded-lg shadow-inner">
          <p className="text-md font-medium text-indigo-700">
            Total de Producción del Día (Kg):
          </p>
          <p className="text-3xl font-extrabold text-indigo-900">
            {formatNumber(dailyTotalProduction)} Kg
          </p>
        </div>

        {/* Campos de Input */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="N. Trabajadores"
            type="number"
            value={costData.numWorkers}
            field="numWorkers"
            item={{ id: "cost" }}
            handleItemChange={(_, field, value) =>
              handleCostChange(field, value)
            }
            handleItemBlur={() => {}}
            placeholder="Ejem: 5"
          />
          <InputField
            label="H. Trabajadas (p/trabajador)"
            type="number"
            value={costData.hoursWorked}
            field="hoursWorked"
            item={{ id: "cost" }}
            handleItemChange={(_, field, value) =>
              handleCostChange(field, value)
            }
            handleItemBlur={() => {}}
            placeholder="Ejem: 8"
          />
        </div>

        {/* Campo fijo: Coste de Hora */}
        <div className="p-3 bg-gray-100 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-700">
            Coste Fijo por Hora (HOURLY_COST_RATE):
          </p>
          <p className="text-xl font-bold text-gray-800">
            {formatNumber(HOURLY_COST_RATE)} €
          </p>
        </div>

        {/* Resultado 1: Produccion (Coste Variable) */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
          <p className="text-md font-medium text-yellow-800">
            1. Producción (Coste Variable):
          </p>
          <p className="text-xl font-bold text-yellow-900 mt-1">
            N.Trabajadores * H.Trabajadas * CosteHora =
            <span className="text-2xl font-extrabold text-red-700 ml-2">
              {formatNumber(productionCostVariable)} €
            </span>
          </p>
        </div>

        {/* Resultado Final: Coste de Producción */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-300">
          <p className="text-lg font-bold text-green-800">
            2. Coste de Producción (Final):
          </p>
          <p className="text-2xl font-extrabold text-green-900 mt-1">
            Total Día (Kg) / Coste Variable (€) =
            <span className="text-3xl font-extrabold text-blue-700 ml-2">
              {formatNumber(finalProductionCost, 4)} Kg/€
            </span>
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={() => handleDayClick(dateKey, "grid")}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Volver a Productos
          </button>
          <button
            onClick={handleSaveCostData}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition transform hover:scale-[1.05]"
          >
            Guardar Costes
          </button>
        </div>
      </div>
    );
  }
);

// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
const ProduccionC = () => {
  // ... (Estados, Sin cambios)
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState("calendar");
  const [detailView, setDetailView] = useState("grid");
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetAccumulated, setTargetAccumulated] = useState(
    () => parseFloat(localStorage.getItem("targetAccumulated")) || 100000
  );
  const [targetInput, setTargetInput] = useState(() =>
    (localStorage.getItem("targetAccumulated") || 100000).toString()
  );
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const showTemporaryMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // ... (useEffect para Firebase y auth, Sin cambios)

  useEffect(() => {
    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
      console.error(
        "Firebase no está configurado. La persistencia no funcionará."
      );
      setLoading(false);
      setUserId("Anonimo_Sin_DB");
      setIsAuthReady(true);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
          setLoading(false);
        } else {
          const initialToken =
            typeof window.__initial_auth_token !== "undefined" ? auth : null;
          try {
            if (initialToken) {
              await signInWithCustomToken(authInstance, initialToken);
            } else {
              await signInAnonymously(authInstance);
            }
          } catch (error) {
            console.error("Authentication failed:", error);
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
            setLoading(false);
          }
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (db && userId && isAuthReady && userId !== "Anonimo_Sin_DB") {
      const resultsDocRef = getDocRef(db, userId);

      const unsubscribe = onSnapshot(
        resultsDocRef,
        (docSnap) => {
          // 🔥 COMPLETAR AQUÍ 🔥
          if (docSnap.exists()) {
            // Cargar los datos del documento si existe
            const loadedData = docSnap.data();
            setDailyData(loadedData);
            console.log("Datos cargados/actualizados desde Firestore.");
          } else {
            // Si el documento NO existe (primera vez), inicializamos
            setDailyData({});
            console.log(
              "Documento de datos no encontrado, inicializando localmente."
            );
          }
          setLoading(false); // Ocultar el loader una vez que se cargan los datos
        },
        (error) => {
          console.error("Error al suscribirse a Firestore:", error);
          setLoading(false);
          showTemporaryMessage(
            "Error al cargar los datos en tiempo real.",
            "error"
          );
        }
      );

      return () => unsubscribe(); // Limpieza de la suscripción
    }
    // ... (El resto del useEffect de autenticación debe estar antes o separado)
  }, [db, userId, isAuthReady]);

  //   useEffect(() => {
  //     if (db && userId && isAuthReady && userId !== "Anonimo_Sin_DB") {
  //       const resultsDocRef = getDocRef(db, userId);

  //       const unsubscribe = onSnapshot(
  //         resultsDocRef,
  //         (docSnap) => {
  //           if (docSnap.exists()) {
  //             setDailyData(docSnap.data());
  //           } else {
  //             setDailyData({});
  //           }
  //           setLoading(false);
  //         },
  //         (error) => {
  //           console.error("Error listening to document: ", error);
  //           setLoading(false);
  //         }
  //       );

  //       return () => unsubscribe();
  //     } else if (userId === "Anonimo_Sin_DB") {
  //       setLoading(false);
  //     }
  //   }, [db, userId, isAuthReady]);

  // Lógica de navegación principal (Sin cambios)
  const handleDayClick = (dateKey, action = "view") => {
    if (dateKey === null) {
      setView("calendar");
      setSelectedDate(formatDate(new Date()));
      setDetailView("grid");
      return;
    }

    setSelectedDate(dateKey);
    setView("detail");

    if (action === "edit" || !dailyData[dateKey]?.items?.length) {
      setDetailView("form");
    } else if (action === "cost-edit") {
      setDetailView("cost-form");
    } else if (action === "cost-grid") {
      if (dailyData[dateKey]?.finalProductionCost) {
        setDetailView("cost-grid");
      } else {
        setDetailView("cost-form");
      }
    } else {
      setDetailView("grid");
    }
  };

  // --- FUNCIÓN deleteData (Sin cambios) ---
  const deleteData = useCallback(
    async (dateKey, suppressMessage = false) => {
      if (!db || !userId || userId === "Anonimo_Sin_DB") {
        showTemporaryMessage(
          "Error: No se puede borrar. Firebase no inicializado.",
          "error"
        );
        return;
      }

      try {
        const resultsDocRef = getDocRef(db, userId);

        const newData = { ...dailyData };
        delete newData[dateKey];

        await setDoc(resultsDocRef, newData);

        if (!suppressMessage) {
          showTemporaryMessage(`Datos borrados para ${dateKey}.`);
          setShowConfirmModal(false);
          setView("calendar");
          setDetailView("grid");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        showTemporaryMessage("Error al borrar los datos.", "error");
      }
    },
    [db, userId, dailyData, showTemporaryMessage]
  );

  // --- FUNCIÓN uploadImage (Sin cambios) ---
  const uploadImage = useCallback(
    async (base64Image, dateKey, itemId) => {
      if (!base64Image) {
        return null;
      }

      if (
        !YOUR_BACKEND_UPLOAD_URL ||
        YOUR_BACKEND_UPLOAD_URL.includes("tu-servidor.com")
      ) {
        console.error("URL de Backend NO configurada correctamente.");
        showTemporaryMessage(
          "Error: La URL de subida del backend no está configurada.",
          "error"
        );
        return null;
      }

      try {
        const response = await fetch(YOUR_BACKEND_UPLOAD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            folder: `produccion/${userId}/${dateKey}`,
            public_id: itemId,
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Respuesta de red no exitosa." }));
          throw new Error(
            errorData.message || "Fallo en la comunicación con el backend."
          );
        }

        const data = await response.json();

        if (!data.secure_url) {
          throw new Error(
            "El backend no devolvió la URL segura de Cloudinary."
          );
        }

        return data.secure_url;
      } catch (error) {
        console.error("Error al subir imagen a través del backend:", error);
        showTemporaryMessage(
          `Error de subida: ${error.message}. Verifica tu servidor y CORS.`,
          "error"
        );
        return null;
      }
    },
    [userId, showTemporaryMessage]
  );

  const saveData = useCallback(
    async (dateKey, dataToSave, isCostSave = false) => {
      if (!db || !userId || userId === "Anonimo_Sin_DB") {
        showTemporaryMessage(
          "No se puede guardar: Firebase no está disponible.",
          "error"
        );
        return;
      }

      // 1. Clonar el estado actual para evitar mutaciones directas
      const newDailyData = { ...dailyData };
      newDailyData[dateKey] = dataToSave;

      try {
        const docRef = getDocRef(db, userId);

        // 2. setDoc reemplaza/crea el documento completo.
        // Para actualizar solo el día específico, usamos la estructura anidada.
        // Aquí guardamos el objeto completo 'newDailyData' que contiene todos los días.
        // Esto crea el documento 'data' y la estructura de colecciones si no existe.
        await setDoc(docRef, newDailyData);

        // Opcional: Actualizar el estado local (aunque onSnapshot lo hará)
        setDailyData(newDailyData);

        const typeMsg = isCostSave ? "Costes" : "Productos";
        showTemporaryMessage(
          `${typeMsg} guardados con éxito en Firebase.`,
          "success"
        );
      } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        showTemporaryMessage(
          `Error al guardar ${isCostSave ? "costes" : "productos"}.`,
          "error"
        );
      }
    },
    [db, userId, dailyData]
  );
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
      // Estilo global más profesional
      pdfContent.style.fontFamily = "Helvetica, Arial, sans-serif";
      pdfContent.style.color = "#333333";
      pdfContent.style.backgroundColor = "#FFFFFF";

      // 2. Generar el HTML del reporte (Header + Cuerpo + Footer)
      const totalProduccion = dailyDataEntry.items.reduce(
        (sum, item) => sum + parseFloat(item.result || 0),
        0
      );
      const costeFinal = (dailyDataEntry.finalProductionCost || 0).toFixed(2);
      const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // --- 2.1. Header HTML (Estilo Limpio y Corporativo) ---
      // Estilo de encabezado con diseño flex de tres columnas y logo GRANDE (75px)
      const headerHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #E0E7FF; padding-bottom: 15px; margin-bottom: 25px;">
            <div style="flex: 1;">
                <!-- Aumento de la altura del logo a 75px -->
                <img src="${
                  REPORT_CONFIG.LOGO_URL
                }" alt="Logo" style="height: 75px; width: auto; max-width: 100%; border-radius: 4px;">
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

      let bodyHtml = `
       <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">Productos Detallados:</h3>
    `;

      if (dailyDataEntry.items.length === 0) {
        bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este día.</p>`;
      } else {
        // Contenedor de la cuadrícula de productos (Grid de 2 columnas)
        bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr ; gap: 15px;">`;

        dailyDataEntry.items.forEach((item, index) => {
          const result = parseFloat(item.result || 0);
          bodyHtml += `
                <div style="
                    border: 1px solid #E0E0E0;
                    padding: 15px; /* Más padding para que respire */
                    border-radius: 12px; /* Esquinas más redondeadas */
                    background-color: #FAFAFA; /* Fondo sutil */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra más avanzada */
                    display: flex;
                    align-items: flex-start;
                    transition: all 0.3s; /* Aunque no se ve en el PDF, mejora la sensación */
                ">
                    ${
                      item.imageUrl
                        ? `
                        <img
                            src="${item.imageUrl}"
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
                        <!-- Diseño de resultado con acento fuerte -->
                        <div style="background-color: #10B981; padding: 8px 10px; border-radius: 6px; text-align: center;">
                            <p style="font-size: 17px; font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: 1px;">TOTAL: ${result} Kg</p>
                        </div>
                    </div>
                </div>
            `;
        });
        bodyHtml += `</div>`; // Cierre del contenedor grid
      }

      // --- 2.3. Footer HTML ---
      const footerHtml = `

        <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 40px;">

           <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
            <div style="flex: 1;">
                <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCIÓN TOTAL (Kg):</p>
                <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion}</p>
            </div>
            <div style="width: 1px; background-color: #D1E5F7;"></div>
            <div style="flex: 1;">
                <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/€):</p>
                <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
            </div>
        </div>

            <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Horticultura <span class="pageNumber"></span></p>
        </div>
    `;

      pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

      // 3. Añadir el contenido oculto al body y capturarlo
      document.body.appendChild(pdfContent);

      try {
        showTemporaryMessage("Generando PDF...", "info");
        const canvas = await html2canvas(pdfContent, {
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY, // Asegurar que html2canvas capture desde el inicio de la página
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
        showTemporaryMessage("PDF generado con éxito.", "success");
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        showTemporaryMessage(
          "Error al generar el PDF. Verifica que la URL del logo sea accesible (CORS).",
          "error"
        );
      } finally {
        // 4. Limpiar el contenedor temporal
        document.body.removeChild(pdfContent);
      }
    },
    [dailyData, showTemporaryMessage]
  );

  // =======================================================================

  // ... (Lógica de Totales y Progreso, Sin cambios)
  const globalAccumulatedTotal = useMemo(() => {
    let total = 0;
    const dateKeys = Object.keys(dailyData);

    for (const dateKey of dateKeys) {
      const dayData = dailyData[dateKey];
      const items = dayData?.items || [];

      const dayTotal = items.reduce(
        (sum, item) => sum + parseFloat(item.result || 0),
        0
      );
      total += dayTotal;
    }

    return parseFloat(total.toFixed(2));
  }, [dailyData]);

  useEffect(() => {
    const finalProgress = globalAccumulatedTotal;
    let startTimestamp = null;
    const duration = 1000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;

      const newProgress = Math.min(progress / duration, 1) * finalProgress;
      setAnimatedProgress(newProgress);

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [globalAccumulatedTotal]);

  const handleTargetInputChange = (e) => {
    setTargetInput(e.target.value);
  };

  const handleTargetInputBlur = () => {
    const cleanValue = targetInput.replace(/,/g, ".");
    const numericValue = parseFloat(cleanValue) || 0;

    if (numericValue !== targetAccumulated) {
      setTargetAccumulated(numericValue);
      localStorage.setItem("targetAccumulated", numericValue);
    }
    setTargetInput(numericValue.toString());
  };

  const handleTargetKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const progressPercentage = Math.min(
    (animatedProgress / targetAccumulated) * 100,
    100
  );

  const handleExportAll = () => {
    exportToCsv(dailyData);
    showTemporaryMessage("Exportación CSV global iniciada.", "success");
  };

  // --- VISTA DE CALENDARIO (Sin cambios) ---
  const CalendarView = () => {
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const daysInMonth = useMemo(() => {
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );
      const numDays = endOfMonth.getDate();
      const startDayIndex = startOfMonth.getDay();
      const days = [];

      for (let i = 0; i < startDayIndex; i++) {
        days.push({ day: null, dateKey: null, isCurrentMonth: false });
      }

      for (let i = 1; i <= numDays; i++) {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          i
        );
        days.push({
          day: i,
          dateKey: formatDate(date),
          isCurrentMonth: true,
        });
      }

      return days;
    }, [currentMonth]);

    const changeMonth = (delta) => {
      setCurrentMonth(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
      );
    };

    const monthName = currentMonth.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 text-indigo-600 hover:text-indigo-800 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <h2 className="text-2xl font-extrabold text-gray-900 capitalize">
            {monthName}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 text-indigo-600 hover:text-indigo-800 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 text-center font-bold text-sm text-gray-600 border-b pb-2 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(({ day, dateKey, isCurrentMonth }, index) => {
            if (!day) return <div key={index} className="h-24"></div>;

            const dataExists = dailyData[dateKey]?.items?.length > 0;
            const hasCostData = dailyData[dateKey]?.finalProductionCost > 0;
            const dayTotal = dailyData[dateKey]?.items?.reduce(
              (sum, item) => sum + parseFloat(item.result || 0),
              0
            );
            const dayCost = dailyData[dateKey]?.finalProductionCost || 0;

            let ringColor = "border-gray-300";
            if (dataExists) {
              if (dayTotal > 1500) {
                ringColor = "border-green-500 ring-green-300";
              } else if (dayTotal > 500) {
                ringColor = "border-amber-500 ring-amber-300";
              } else {
                ringColor = "border-indigo-500 ring-indigo-300";
              }
            }

            return (
              <div
                key={dateKey}
                onClick={() => handleDayClick(dateKey)}
                className={`
                                    h-24 p-1 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-[1.05] relative
                                    ${
                                      isCurrentMonth
                                        ? "bg-white text-gray-900 border"
                                        : "bg-gray-100 text-gray-400 border-gray-200"
                                    }
                                    ${
                                      dataExists
                                        ? `border-2 ring-2 ${ringColor}`
                                        : "border-gray-200"
                                    }
                                `}
              >
                <div className="text-xl font-extrabold text-center mb-1">
                  {day}
                </div>
                {dataExists && (
                  <div className="text-xs text-center font-semibold text-green-700">
                    {dayTotal.toFixed(0)} Kg
                  </div>
                )}
                {hasCostData && (
                  <div className="text-xs text-center font-semibold text-blue-700 bg-blue-100 rounded-full mt-1">
                    {dayCost.toFixed(2)} Kg/€
                  </div>
                )}
                {!dataExists && isCurrentMonth && (
                  <div className="text-xs text-center text-gray-500 mt-2">
                    + Agregar
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- COMPONENTE MODAL DE CONFIRMACIÓN (Implementación) ---
  const ConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
        <h3 className="text-xl font-bold text-red-600">Confirmar Borrado</h3>
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar **todos los datos** para el día
          **{selectedDate}**? Esta acción es irreversible y borrará los
          productos y los costes asociados a este día.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              deleteData(selectedDate);
            }}
            className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Sí, Borrar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
  // ------------------------------------------------------------------

  // --- RENDERIZADO PRINCIPAL ---

  if (loading) {
    return (
      <div className="text-center p-20 text-indigo-600 text-lg">
        Cargando datos...
      </div>
    );
  }

  const todayData = dailyData[selectedDate] || { items: [] };

  let content = null;

  if (view === "calendar") {
    content = <CalendarView />;
  } else if (view === "detail") {
    switch (detailView) {
      case "grid":
        content = (
          <DayProductsGrid
            dateKey={selectedDate}
            dailyData={dailyData}
            handleDayClick={handleDayClick}
            generatePDF={generatePDF} // 👈 Pasa la función de PDF
          />
        );
        break;
      case "cost-form":
        content = (
          <ProductionCostForm
            dateKey={selectedDate}
            dailyData={dailyData}
            saveData={saveData}
            handleDayClick={handleDayClick}
          />
        );
        break;
      case "cost-grid":
        content = (
          <div className="p-4 md:p-8 max-w-lg mx-auto bg-white rounded-xl shadow-2xl space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-4">
              Costes Registrados para{" "}
              {new Date(selectedDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="p-3 bg-teal-50 border-l-4 border-teal-500 rounded-lg shadow-md">
              <p className="text-xl font-bold text-teal-800">
                N. Trabajadores:
              </p>
              <p className="text-2xl font-extrabold text-teal-900">
                {todayData.numWorkers || 0}
              </p>
            </div>
            <div className="p-3 bg-teal-50 border-l-4 border-teal-500 rounded-lg shadow-md">
              <p className="text-xl font-bold text-teal-800">H. Trabajadas:</p>
              <p className="text-2xl font-extrabold text-teal-900">
                {(todayData.hoursWorked || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg shadow-lg">
              <p className="text-lg font-bold text-yellow-800">
                1. Producción (Coste Variable):
              </p>
              <p className="text-3xl font-extrabold text-red-700">
                {(todayData.productionCostVariable || 0).toFixed(2)} €
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg shadow-lg">
              <p className="text-lg font-bold text-green-800">
                2. Coste de Producción Final:
              </p>
              <p className="text-4xl font-extrabold text-blue-700">
                {(todayData.finalProductionCost || 0).toFixed(4)} Kg/€
              </p>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => handleDayClick(selectedDate, "cost-edit")}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
              >
                Editar Costes
              </button>
              <button
                onClick={() => handleDayClick(selectedDate, "grid")}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Ver Productos
              </button>
            </div>
          </div>
        );
        break;
      case "form":
        content = (
          <DayProductsForm
            dateKey={selectedDate}
            initialItems={todayData.items}
            saveData={saveData}
            deleteData={deleteData}
            showTemporaryMessage={showTemporaryMessage}
            setShowConfirmModal={setShowConfirmModal}
          />
        );
        break;
      default:
        content = <p>Seleccione una vista.</p>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {message && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl text-white z-50 transition-opacity duration-300 ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* IMPLEMENTACIÓN DEL MODAL */}
        {showConfirmModal && <ConfirmModal />}

        <header className="flex justify-between items-center mb-8 pb-4 border-b-4 border-indigo-200">
          <h1 className="text-4xl font-extrabold text-indigo-800">
            Dashboard de Producción 🏭
          </h1>
          <button
            onClick={handleExportAll}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-300 transition"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Exportar CSV Global
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 1. Contenido Principal (MAIN) */}
          {/* Responsividad: Ocupa 3 columnas en LG y se coloca PRIMERO (lg:order-1) */}
          <main className="lg:col-span-3 lg:order-1">
            {/* En móvil (por defecto), 'main' aparece primero */}
            {content}
          </main>

          {/* 2. Columna Lateral (ASIDE) */}
          {/* Responsividad: Ocupa 1 columna en LG y se coloca SEGUNDO (lg:order-2) */}
          <aside className="lg:col-span-1 space-y-6 lg:order-2">
            {/* 1. TARJETA DE DATOS GENERALES Y ESTADÍSTICA (Oculta en móvil) */}
            <div className="hidden lg:block bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600">
              <p className="text-xl font-bold text-green-700 mb-5 flex items-center">
                Datos Generales y Estadística 📊
              </p>

              {/* SECCIÓN DE INFORMACIÓN DEL INVERNADERO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-200 pb-4 mb-5">
                {/* Metros Cuadrados */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-1">
                    Área de Cultivo (m²)
                  </p>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-inner text-lg font-semibold focus:ring-green-500 focus:border-green-500"
                    placeholder="Ejem: 5000"
                    min="1"
                  />
                </div>

                {/* Tipo de Cultivar */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Cultivar
                  </p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white text-lg font-semibold focus:ring-green-500 focus:border-green-500">
                    <option value="Nilo F1">Nilo F1</option>
                    <option value="Otras">Otras</option>
                  </select>
                </div>
              </div>

              {/* Placeholder para la estadística de producción por m² */}
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-green-800">
                  Producción por M² (Kg/m²):
                </p>
                <p className="text-xl font-extrabold text-green-700 mt-1">
                  2.500 Kg/m²
                </p>
              </div>
            </div>

            {/* 2. TARJETA DE META ACUMULADA (Visible en todas las resoluciones) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">
                Meta Acumulada (Kg)
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Establecer Meta
                </label>
                <input
                  type="number"
                  value={targetInput}
                  onChange={handleTargetInputChange}
                  onBlur={handleTargetInputBlur}
                  onKeyDown={handleTargetKeyDown}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition"
                  placeholder="Ejem: 100000"
                />
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Total Acumulado:</p>
                <p className="text-3xl font-extrabold text-green-700">
                  {animatedProgress} Kg
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Progreso: {progressPercentage.toFixed(2)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      progressPercentage >= 100
                        ? "bg-green-600"
                        : "bg-indigo-600"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        <span className="font-bold">ID de Usuario:</span>{" "}
        {userId || "Autenticando..."}
      </p>
    </div>
  );
};

// =======================================================================
// === DayProductsForm (Sin cambios)
// =======================================================================

const DayProductsForm = ({
  dateKey,
  initialItems = [],
  saveData,
  deleteData,
  showTemporaryMessage,
  setShowConfirmModal,
  // 👈 Recibe la función
}) => {
  const itemsWithIds = useMemo(() => {
    return initialItems.map((item) => ({
      id: item.id || crypto.randomUUID(),
      productName: item.productName || "",
      factorA: item.factorA || 0,
      factorB: item.factorB || 0,
      result: item.result || 0,
      imageUrl: item.imageUrl || "",
      factorAInput: item.factorA ? item.factorA.toString() : "0.00",
      factorBInput: item.factorB ? item.factorB.toString() : "0.00",
    }));
  }, [initialItems]);

  const [items, setItems] = useState(itemsWithIds);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(itemsWithIds);
  }, [itemsWithIds]);

  const calculateResult = useCallback((factorA, factorB) => {
    const numA = parseFloat(factorA) || 0;
    const numB = parseFloat(factorB) || 0;
    return numA * numB;
  }, []);

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, [field]: value };

          if (field === "productName") {
            const factorA = PRODUCT_CATALOG[value] || 0;
            newItem.factorA = factorA;
            newItem.factorAInput = factorA.toFixed(2);
            newItem.result = calculateResult(factorA, newItem.factorB);
          } else if (field === "factorB") {
            const cleanValue = value.toString().replace(/,/g, ".");
            const numB = parseFloat(cleanValue) || 0;
            newItem.factorB = numB;
            newItem.factorBInput = cleanValue;
            newItem.result = calculateResult(newItem.factorA, numB);
          } else if (field === "imageUrl") {
            newItem.imageUrl = value;
          }

          return newItem;
        }
        return item;
      });
    });
  };

  const handleItemBlur = (id, field) => {
    if (field === "factorB") {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            const numB = parseFloat(item.factorBInput.replace(/,/g, ".")) || 0;
            return {
              ...item,
              factorB: numB,
              factorBInput: numB.toString(),
              result: calculateResult(item.factorA, numB),
            };
          }
          return item;
        })
      );
    }
  };

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: crypto.randomUUID(),
        productName: "",
        factorA: 0,
        factorB: 0,
        result: 0,
        imageUrl: "",
        factorAInput: "0.00",
        factorBInput: "0.00",
      },
    ]);
  };

  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const itemsToSave = items.map((item) => ({
        id: item.id,
        productName: item.productName || item.productNameInput,
        factorA: parseFloat(item.factorA) || 0,
        factorB: parseFloat(item.factorB) || 0,
        result: parseFloat(item.result) || 0,
        imageUrl: item.imageUrl || "",
      }));

      const existingDayData =
        initialItems.length > 0
          ? {
              numWorkers: initialItems[0]?.numWorkers || 0,
              hoursWorked: initialItems[0]?.hoursWorked || 0,
              productionCostVariable:
                initialItems[0]?.productionCostVariable || 0,
              finalProductionCost: initialItems[0]?.finalProductionCost || 0,
            }
          : {};

      await saveData(dateKey, { items: itemsToSave, ...existingDayData });
    } catch (error) {
      showTemporaryMessage("Error al intentar guardar los datos.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const currentDailyTotal = items.reduce(
    (sum, item) => sum + parseFloat(item.result || 0),
    0
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-2xl space-y-8"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3">
        Editar Producción para{" "}
        {new Date(dateKey).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h2>

      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-inner">
        <p className="text-xl font-medium text-green-800 flex justify-between">
          Total Actual del Día:
          <span className="text-3xl font-extrabold text-green-700">
            {currentDailyTotal.toFixed(2)} Kg
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <ProductItemForm
            key={item.id}
            item={item}
            index={index}
            handleItemChange={handleItemChange}
            handleItemBlur={handleItemBlur}
            deleteItem={deleteItem}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        <span>Añadir Nuevo Producto</span>
      </button>

      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="py-3 px-6 text-gray-600 font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition"
          disabled={isSaving}
        >
          Cancelar
        </button>

        <div className="flex space-x-4">
          {/* {initialItems.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="py-3 px-6 bg-red-100 text-red-600 font-bold rounded-full shadow-md hover:bg-red-200 transition"
              disabled={isSaving}
            >
              Borrar Todos los Datos
            </button>
          )} */}

          <button
            type="submit"
            className={`py-3 px-8 text-white font-bold rounded-full shadow-lg transition transform ${
              isSaving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProduccionC;
















puedes hacer el diseño mas moderno con iconos que se vea mas visual para el usuario final algo profesional la informacion bien posicionada 

<div style="
                border: 1px solid #E0E0E0;
                padding: 15px; /* Más padding para que respire */
                border-radius: 12px; /* Esquinas más redondeadas */
                background-color: #FAFAFA; /* Fondo sutil */
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra más avanzada */
                display: flex;
                align-items: flex-start;
                transition: all 0.3s; /* Aunque no se ve en el PDF, mejora la sensación */
            ">
                ${
                  item.imageUrl
                    ? `
                    <img
                        src="${item.imageUrl}"
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
                        <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Peso(kg): ${parseFloat(item.factorA || 0)}</span>
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








PDFFFF











  <div style="
            border: 1px solid #C7D2FE; /* Color más corporativo */
            padding: 15px; 
            border-radius: 12px; 
            background-color: #FFFFFF; /* Fondo blanco limpio */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* Sombra más sutil */
            display: flex;
            flex-direction: column; /* Apilamos contenido verticalmente */
            height: 100%; /* Asegura que la tarjeta llene el espacio del grid */
        ">
            <div style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed #E0E7FF; padding-bottom: 10px;">
                ${
                    item.imageUrl
                        ? `
                        <img
                            src="${item.imageUrl}"
                            alt="Evidencia"
                            style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 10px; flex-shrink: 0; border: 2px solid #F0F4FF;"
                        >`
                        : `<div style="width: 50px; height: 50px; background-color: #E0E7FF; border-radius: 6px; margin-right: 10px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1E3A8A; font-weight: 700; flex-shrink: 0;">
                            📷
                        </div>`
                }
                <p style="font-size: 15px; font-weight: 800; color: #1E3A8A; margin: 0; line-height: 1.3;">
                    ${item.productName || "PRODUCTO DESCONOCIDO"}
                </p>
            </div>

            <div style="
                display: flex; 
                justify-content: space-between; 
                gap: 10px; 
                margin-bottom: 15px;
            ">
                
                <div style="
                    flex: 1;
                    background-color: #F8FAFF; /* Fondo claro */
                    padding: 8px; 
                    border-radius: 8px; 
                    text-align: center;
                    border: 1px solid #D1E5F7;
                ">
                    <p style="font-size: 11px; color: #4B5563; margin: 0 0 4px 0;">⚖️ Peso (kg)</p>
                    <p style="font-size: 16px; font-weight: 700; color: #2563EB; margin: 0;">
                        ${parseFloat(item.factorA || 0)}
                    </p>
                </div>

                <div style="
                    flex: 1;
                    background-color: #F8FAFF; /* Fondo claro */
                    padding: 8px; 
                    border-radius: 8px; 
                    text-align: center;
                    border: 1px solid #D1E5F7;
                ">
                    <p style="font-size: 11px; color: #4B5563; margin: 0 0 4px 0;">📦 Cajas</p>
                    <p style="font-size: 16px; font-weight: 700; color: #2563EB; margin: 0;">
                        ${parseFloat(item.factorB || 0)}
                    </p>
                </div>
            </div>

            <div style="
                background-color: #047857; /* Verde oscuro fuerte */
                padding: 10px 15px; 
                border-radius: 8px; 
                text-align: center;
                margin-top: auto; /* Empuja el resultado hacia abajo */
            ">
                <p style="font-size: 13px; font-weight: 600; color: #E0F2F1; margin: 0 0 3px 0;">✅ Producción Total</p>
                <p style="font-size: 20px; font-weight: 900; color: #FFFFFF; margin: 0; letter-spacing: 1px;">
                    ${parseFloat(item.result || 0)} Kg
                </p>
            </div>
        </div>