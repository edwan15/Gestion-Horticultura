import React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import {firebaseConfig} from "../../firebaseConfig"

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
const YOUR_BACKEND_UPLOAD_URL = "http://localhost:4500/api/upload/image";

// =======================================================================
// === DATOS FIJOS PARA EL HEADER DEL PDF 📄
// =======================================================================
const REPORT_CONFIG = {
  COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
  REPORT_TITLE: "Finca Balsicas Producción S.A.",
  LOGO_URL:"data:image/png;base64,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"
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
const HOURLY_COST_RATE = 25.5; // € o la moneda que uses. ¡Dato Fijo, Modificable en el código!

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
        parseFloat(item.factorA || 0).toFixed(2),
        parseFloat(item.factorB || 0).toFixed(2),
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
  ({ item, index, handleItemChange, handleItemBlur, deleteItem }) => {
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
              Factor A (Automático)
            </label>
            <input
              type="text"
              value={item.factorAInput}
              readOnly
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
            />
          </div>

          {/* Factor B: INPUT NORMAL */}
          <InputField
            label="Factor B (Ingresar)"
            value={item.factorBInput}
            field="factorB"
            placeholder="0.00"
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
            {parseFloat(item.factorA || 0).toFixed(2)} *{" "}
            {parseFloat(item.factorB || 0).toFixed(2)} ={" "}
            <span className="text-green-700">{item.result.toFixed(2)}</span>
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
          <span className="font-bold">{factorA.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Factor B:</span>
          <span className="font-bold">{factorB.toFixed(2)}</span>
        </p>
      </div>

      <div className="p-3 mt-4 rounded-lg bg-white/70 shadow-inner border border-current/50">
        <p className="text-lg font-bold flex justify-between items-center">
          <span className="uppercase text-gray-600">Total Producido:</span>
          <span className="text-2xl font-extrabold text-indigo-700">
            {result.toFixed(2)}{" "}
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
          if (docSnap.exists()) {
            setDailyData(docSnap.data());
          } else {
            setDailyData({});
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to document: ", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else if (userId === "Anonimo_Sin_DB") {
      setLoading(false);
    }
  }, [db, userId, isAuthReady]);

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

  // --- FUNCIÓN saveData (Sin cambios) ---
  const saveData = useCallback(
    async (dateKey, formData, isCostSave = false) => {
      if (!db || !userId || userId === "Anonimo_Sin_DB") {
        showTemporaryMessage(
          "Error: No se puede guardar. Firebase no inicializado.",
          "error"
        );
        return;
      }

      let cleanedItems = formData.items.filter(
        (item) => item.productName || item.factorA !== 0 || item.factorB !== 0
      );

      let dataToSave = { ...formData };
      dataToSave.items = cleanedItems;

      if (
        !isCostSave &&
        cleanedItems.length === 0 &&
        !formData.numWorkers &&
        !formData.hoursWorked
      ) {
        await deleteData(dateKey, true);
        showTemporaryMessage(`Datos borrados para ${dateKey} (vacíos).`);
        setView("calendar");
        return;
      }

      if (!isCostSave) {
        const itemsToSavePromises = cleanedItems.map(async (item) => {
          if (item.imageUrl && item.imageUrl.startsWith("data:image")) {
            const imageId = item.id || crypto.randomUUID();
            const publicUrl = await uploadImage(
              item.imageUrl,
              dateKey,
              imageId
            );
            return {
              ...item,
              imageUrl: publicUrl || "",
            };
          }
          return item;
        });
        dataToSave.items = (await Promise.all(itemsToSavePromises)).filter(
          (item) => item.productName || item.factorA !== 0 || item.factorB !== 0
        );
      }

      try {
        const resultsDocRef = getDocRef(db, userId);

        await setDoc(
          resultsDocRef,
          {
            ...dailyData,
            [dateKey]: dataToSave,
          },
          { merge: true }
        );

        showTemporaryMessage(
          `¡Datos ${
            isCostSave ? "de Coste" : "de Producción"
          } guardados para ${dateKey}!`
        );
        setView("detail");
      } catch (error) {
        console.error("Error saving data:", error);
        showTemporaryMessage(
          "Error al guardar los datos en Firestore. Revisa la consola.",
          "error"
        );
      }
    },
    [db, userId, dailyData, deleteData, showTemporaryMessage, uploadImage]
  );

  // === FUNCIÓN generatePDF (NUEVA IMPLEMENTACIÓN) 📄
  // =======================================================================
  //   const generatePDF = useCallback(async (dateKey) => {
  //     // Objeto de día completo
  //     const dailyDataEntry = dailyData[dateKey] || { items: [] };

  //     // 1. Crear un contenedor temporal con el HTML que queremos capturar.
  //     const pdfContent = document.createElement('div');
  //     pdfContent.style.width = '210mm'; // Ancho A4
  //     pdfContent.style.padding = '15mm 10mm';
  //     pdfContent.style.position = 'absolute';
  //     pdfContent.style.left = '-9999px'; // Ocultar
  //     // Estilo global más profesional
  //     pdfContent.style.fontFamily = 'Helvetica, Arial, sans-serif';
  //     pdfContent.style.color = '#333333';
  //     pdfContent.style.backgroundColor = '#FFFFFF';

  //     // 2. Generar el HTML del reporte (Header + Cuerpo + Footer)
  //     const totalProduccion = dailyDataEntry.items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0).toFixed(2);
  //     const costeFinal = (dailyDataEntry.finalProductionCost || 0).toFixed(4);
  //     const dateDisplay = new Date(dateKey).toLocaleDateString("es-ES", {
  //         weekday: "long", year: "numeric", month: "long", day: "numeric",
  //     });

  //     // --- 2.1. Header HTML (Estilo Limpio y Corporativo) ---
  //     const headerHtml = `
  //         <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #E0E7FF; padding-bottom: 15px; margin-bottom: 25px;">
  //             <div style="flex: 1;">
  //                 <img src="${REPORT_CONFIG.LOGO_URL}" alt="Logo" style="height: 45px; width: auto; max-width: 100%; border-radius: 4px;">
  //             </div>
  //             <div style="flex: 2; text-align: center;">
  //                 <h1 style="font-size: 26px; font-weight: 700; margin: 0; color: #1E3A8A;">${REPORT_CONFIG.REPORT_TITLE}</h1>
  //                 <p style="font-size: 14px; margin: 3px 0 0 0; color: #6B7280; font-style: italic;">${REPORT_CONFIG.COMPANY_NAME}</p>
  //             </div>
  //             <div style="flex: 1; text-align: right;">
  //                 <p style="font-size: 11px; margin: 0; color: #9CA3AF;">Fecha de Impresión:</p>
  //                 <p style="font-size: 13px; font-weight: 600; margin: 2px 0 0 0; color: #4B5563;">${formatDate(new Date())}</p>
  //             </div>
  //         </div>
  //         <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #059669; background-color: #F0FDF4; padding: 8px; border-radius: 4px;">Reporte Diario: ${dateDisplay}</h2>
  //     `;

  //     // --- 2.2. Resumen y Cuerpo HTML ---
  //     let bodyHtml = `
  //         <div style="display: flex; gap: 20px; margin-bottom: 30px; border: 1px solid #D1E5F7; background-color: #F8FBFF; padding: 15px; border-radius: 8px;">
  //             <div style="flex: 1;">
  //                 <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">PRODUCCIÓN TOTAL (Kg):</p>
  //                 <p style="font-size: 28px; font-weight: 700; color: #10B981; margin: 5px 0 0 0;">${totalProduccion}</p>
  //             </div>
  //             <div style="width: 1px; background-color: #D1E5F7;"></div>
  //             <div style="flex: 1;">
  //                 <p style="font-size: 14px; font-weight: 600; color: #4B5563; margin: 0;">COSTE FINAL (Kg/€):</p>
  //                 <p style="font-size: 28px; font-weight: 700; color: #2563EB; margin: 5px 0 0 0;">${costeFinal}</p>
  //             </div>
  //         </div>

  //         <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">Productos Detallados:</h3>
  //     `;

  //     if (dailyDataEntry.items.length === 0) {
  //         bodyHtml += `<p style="color: #9CA3AF;">No hay productos registrados para este día.</p>`;
  //     } else {
  //         // Contenedor de la cuadrícula de productos (Grid de 2 columnas)
  //         bodyHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;

  //         dailyDataEntry.items.forEach((item, index) => {
  //             const result = parseFloat(item.result || 0).toFixed(2);
  //             bodyHtml += `
  //                 <div style="
  //                     border: 1px solid #E5E7EB;
  //                     padding: 12px;
  //                     border-radius: 8px;
  //                     background-color: #FFFFFF;
  //                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  //                     display: flex;
  //                     align-items: flex-start;
  //                 ">
  //                     ${item.imageUrl ? `
  //                         <img
  //                             src="${item.imageUrl}"
  //                             alt="Evidencia"
  //                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px; flex-shrink: 0;"
  //                         >` :
  //                         `<div style="width: 50px; height: 50px; background-color: #F3F4F6; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9CA3AF; flex-shrink: 0;">
  //                             No Img
  //                         </div>`
  //                     }
  //                     <div style="flex-grow: 1;">
  //                         <p style="font-size: 15px; font-weight: 700; color: #1F2937; margin: 0 0 5px 0;">
  //                             ${item.productName || 'Producto sin nombre'}
  //                         </p>
  //                         <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280; margin-bottom: 5px;">
  //                             <span>Factor A: ${parseFloat(item.factorA || 0).toFixed(2)}</span>
  //                             <span>Factor B: ${parseFloat(item.factorB || 0).toFixed(2)}</span>
  //                         </div>
  //                         <div style="background-color: #ECFDF5; border-left: 3px solid #059669; padding: 5px 10px; border-radius: 4px;">
  //                             <p style="font-size: 16px; font-weight: 700; color: #047857; margin: 0;">Resultado: ${result} Kg</p>
  //                         </div>
  //                     </div>
  //                 </div>
  //             `;
  //         });
  //         bodyHtml += `</div>`; // Cierre del contenedor grid
  //     }

  //     // --- 2.3. Footer HTML ---
  //     const footerHtml = `
  //         <div style="text-align: center; border-top: 1px dashed #D1D5DB; padding-top: 15px; margin-top: 40px;">
  //             <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Page <span class="pageNumber"></span></p>
  //         </div>
  //     `;

  //     pdfContent.innerHTML = headerHtml + bodyHtml + footerHtml;

  //     // 3. Añadir el contenido oculto al body y capturarlo
  //     document.body.appendChild(pdfContent);

  //     try {
  //         showTemporaryMessage("Generando PDF...", "info");
  //         const canvas = await html2canvas(pdfContent, {
  //                 scale: 2,
  //                 useCORS: true,
  //                 scrollY: -window.scrollY // Asegurar que html2canvas capture desde el inicio de la página
  //         });

  //         const imgData = canvas.toDataURL('image/jpeg', 1.0);
  //         const pdf = new jsPDF('p', 'mm', 'a4');
  //         const imgWidth = 210;
  //         const pageHeight = 295;
  //         const imgHeight = canvas.height * imgWidth / canvas.width;
  //         let heightLeft = imgHeight;

  //         let position = 0;

  //         pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;

  //         while (heightLeft >= 0) {
  //             position = heightLeft - imgHeight;
  //             pdf.addPage();
  //             pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  //             heightLeft -= pageHeight;
  //         }

  //         pdf.save(`Reporte_Produccion_${dateKey}.pdf`);
  //         showTemporaryMessage("PDF generado con éxito.", "success");

  //     } catch (error) {
  //         console.error("Error al generar el PDF:", error);
  //         showTemporaryMessage("Error al generar el PDF. Verifica que la URL del logo sea accesible (CORS).", "error");
  //     } finally {
  //         // 4. Limpiar el contenedor temporal
  //         document.body.removeChild(pdfContent);
  //     }

  // }, [dailyData, showTemporaryMessage]);

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
      const totalProduccion = dailyDataEntry.items
        .reduce((sum, item) => sum + parseFloat(item.result || 0), 0)
        .toFixed(2);
      const costeFinal = (dailyDataEntry.finalProductionCost || 0).toFixed(4);
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
          const result = parseFloat(item.result || 0).toFixed(2);
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
                            <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Factor A: ${parseFloat(
                              item.factorA || 0
                            ).toFixed(2)}</span>
                            <span style="background-color: #F0FDF4; padding: 3px 6px; border-radius: 4px;">Factor B: ${parseFloat(
                              item.factorB || 0
                            ).toFixed(2)}</span>
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

            <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Generado automáticamente por el Sistema de Inventario - Documento Confidencial | Page <span class="pageNumber"></span></p>
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
                  {animatedProgress.toFixed(2)} Kg
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
  setShowConfirmModal, // 👈 Recibe la función
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










