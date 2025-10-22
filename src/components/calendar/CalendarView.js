import React, { useState, useEffect, useCallback, useMemo } from "react";
// Importaciones de Firebase (necesitarás pasarlas o mantenerlas en un contexto/archivo de configuración)
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// Componentes externos (asegúrate de que estas rutas sean correctas)
import GlobalGoalTracker from "../GlobalGoalTracker";
import GoalInput from "../GoalInput";
import  ProductItemForm  from "./ProductItemForm"; // Deberás extraer este componente también si no existe
import  DayProductsGrid  from "./DayProductsGrid"; // Deberás extraer este componente también si no existe

// Imports de Utilidad y Hooks de Lógica
import { useDailyDataLogic, getDocRef } from "./formDataLogic";
import { exportToCsv, formatDate, calculateResult, HOURLY_COST_RATE, PRODUCT_CATALOG } from "../../Util/util"; // Necesitas crear este archivo de utilidades

// 🔥 NUEVOS IMPORTS para la exportación a PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- CONFIGURACIÓN E INICIALIZACIÓN ---

// Mueve esto a tu archivo de configuración de Firebase si es posible
import { firebaseConfig } from "../../firebaseConfig"; 
import InputField from "./InputField";

const getAppId = () => {
  if (typeof window.__app_id !== "undefined") {
    return window.__app_id;
  }
  return "default-calendar-app-id";
};
const appId = getAppId();

const isProduction = process.env.NODE_ENV === "production";
const LOCAL_URL = "http://localhost:4500/api/upload/image";
const PRODUCTION_URL = "https://gestion-horticultura.netlify.app/api/upload/image";
const YOUR_BACKEND_UPLOAD_URL = isProduction ? PRODUCTION_URL : LOCAL_URL;

// Inicialización de Firebase (Idealmente, mover a un contexto/hook)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================================================================
// === CONFIGURACIÓN DE REPORTE (Mantener aquí o en un archivo de constantes) 📄
// =======================================================================
const REPORT_CONFIG = {
  COMPANY_NAME: "REPORTE DE INVENTARIO DIARIO",
  REPORT_TITLE: "Finca Balsicas Producción S.A.",
  LOGO_URL:
    "data:image/png;base64,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",
};

// =======================================================================
// === CALENDAR VIEW PRINCIPAL COMPONENT
// =======================================================================

const CalendarView = () => {
  // --- Estados de la Aplicación ---
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateKey, setSelectedDateKey] = useState(formatDate(new Date()));
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar', 'day-view', 'edit', 'cost-edit'

  // --- Lógica de Datos y Handlers desde el Hook de Lógica ---
  const {
    dailyData,
    setDailyData,
    saveDailyData,
    handleItemChange,
    handleItemBlur,
    handleCostChange,
    deleteItem,
    addItem,
    uploadImageAndSaveData,
  } = useDailyDataLogic(
    db,
    userId,
    selectedDateKey,
    YOUR_BACKEND_UPLOAD_URL,
    PRODUCT_CATALOG,
    HOURLY_COST_RATE
  );

  // --- Efecto de Autenticación y Carga de Datos ---
  useEffect(() => {
    // 1. Autenticación Anónima o Verificación de Estado
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // 2. Suscripción a Datos (se activa al tener userId)
        const docRef = getDocRef(db, user.uid);
        const unsubscribeSnapshot = onSnapshot(
          docRef,
          (doc) => {
            if (doc.exists()) {
              setDailyData(doc.data().daily_data || {});
            } else {
              setDailyData({});
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error al obtener los datos diarios:", error);
            setLoading(false);
          }
        );
        return () => unsubscribeSnapshot(); // Limpiar el listener de Firestore
      } else {
        signInAnonymously(auth)
          .catch((error) => {
            console.error("Error al iniciar sesión anónimamente:", error);
            setLoading(false);
          });
      }
    });

    return () => unsubscribeAuth(); // Limpiar el listener de Auth
  }, [db, setDailyData]); // Dependencias del useEffect

  // --- Handlers de Vista ---
  const handleDayClick = useCallback((dateKey, mode = "day-view") => {
    setSelectedDateKey(dateKey);
    setViewMode(dateKey ? mode : "calendar");
  }, []);

  // --- Lógica de Manejo de Fechas en Calendario ---
  const today = formatDate(new Date());
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const calendarDays = useMemo(() => {
    const days = [];
    let date = new Date(monthStart);
    // Rellena hasta el final del mes actual
    while (date.getMonth() === monthStart.getMonth()) {
      days.push(formatDate(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [monthStart]);

  // --- Lógica de Exportación a PDF ---
  const generatePDF = async (dateKey) => {
    // ... Implementación de generatePDF (la misma que en tu código)
    const dailyDataForPdf = dailyData[dateKey];
    if (!dailyDataForPdf || dailyDataForPdf.items.length === 0) {
      alert("No hay datos para generar el PDF de este día.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    let yOffset = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const lineHeight = 7;
    const smallLineHeight = 5;

    // Header con Logo y Títulos
    if (REPORT_CONFIG.LOGO_URL) {
      doc.addImage(
        REPORT_CONFIG.LOGO_URL,
        "PNG",
        margin,
        yOffset,
        30,
        15
      ); // Ajusta tamaño y posición
    }
    doc.setFontSize(16);
    doc.setTextColor(52, 73, 94); // Azul oscuro
    doc.text(REPORT_CONFIG.COMPANY_NAME, pageWidth / 2, yOffset + 5, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141); // Gris
    doc.text(
      REPORT_CONFIG.REPORT_TITLE,
      pageWidth / 2,
      yOffset + 11,
      { align: "center" }
    );
    yOffset += 25;

    // Título del Reporte Diario
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185); // Azul
    doc.text(
      `REPORTE DIARIO DE PRODUCCIÓN: ${new Date(
        dateKey + "T00:00:00"
      ).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      margin,
      yOffset
    );
    yOffset += lineHeight;

    // Datos de Coste y Totales
    const dailyTotal = dailyDataForPdf.items.reduce(
      (sum, item) => sum + parseFloat(item.result || 0),
      0
    );
    const finalProductionCost =
      parseFloat(dailyDataForPdf.finalProductionCost) || 0;
    const productionCostVariable =
      parseFloat(dailyDataForPdf.productionCostVariable) || 0;
    const numWorkers = parseFloat(dailyDataForPdf.numWorkers) || 0;
    const hoursWorked = parseFloat(dailyDataForPdf.hoursWorked) || 0;

    yOffset += 3;
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text(
      `Total Producido (Kg): ${dailyTotal.toFixed(2)}`,
      margin,
      yOffset
    );
    yOffset += smallLineHeight;
    doc.text(
      `Coste Laboral Diario (€): ${productionCostVariable.toFixed(2)}`,
      margin,
      yOffset
    );
    yOffset += smallLineHeight;
    doc.text(
      `Coste/Kg de Producción (€/Kg): ${finalProductionCost.toFixed(4)}`,
      margin,
      yOffset
    );
    yOffset += smallLineHeight;
    doc.text(
      `Trabajadores: ${numWorkers}, Horas Trabajadas: ${hoursWorked}`,
      margin,
      yOffset
    );
    yOffset += lineHeight;

    // Tabla de Productos
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Detalle de Productos", margin, yOffset);
    yOffset += lineHeight / 2;

    const tableHeaders = [
      "Producto",
      "Peso/Caja (Kg)",
      "Cajas",
      "Total (Kg)",
      "Imagen",
    ];
    const columnWidths = [50, 30, 30, 30, 30]; // Ajustar si es necesario
    const startX = margin;
    const startY = yOffset;
    const rowHeight = 8;
    const imageSize = 10;
    let currentY = startY;

    // Dibuja la cabecera de la tabla
    doc.setFillColor(236, 240, 241); // Gris claro
    doc.rect(
      startX,
      currentY,
      columnWidths.reduce((a, b) => a + b) + 10,
      rowHeight,
      "F"
    );
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(9);
    let currentX = startX + 2;
    tableHeaders.forEach((header, index) => {
      doc.text(header, currentX, currentY + rowHeight / 2 + 1);
      currentX += columnWidths[index];
    });
    currentY += rowHeight;

    // Dibuja las filas de la tabla
    doc.setFontSize(9);
    doc.setTextColor(44, 62, 80);
    for (const item of dailyDataForPdf.items) {
      if (currentY + rowHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        currentY = margin;
      }

      doc.setFillColor(255, 255, 255);
      doc.rect(
        startX,
        currentY,
        columnWidths.reduce((a, b) => a + b) + 10,
        rowHeight,
        "F"
      );

      currentX = startX + 2;
      const data = [
        item.productName || "",
        parseFloat(item.factorA || 0).toFixed(0),
        parseFloat(item.factorB || 0).toFixed(0),
        parseFloat(item.result || 0).toFixed(2),
        "",
      ];

      data.forEach((text, index) => {
        if (index === 4 && item.imageUrl) {
          // Columna de Imagen
          // Solo si no es Base64 (porque Base64 puede ser muy grande y colapsar)
          if (!item.imageUrl.startsWith("data:image")) {
            const displayImageUrl = item.imageUrl.replace(
              "/upload/",
              "/upload/c_fit,w_100,q_auto:eco/"
            );
            doc.addImage(
              displayImageUrl,
              "JPEG",
              currentX,
              currentY + (rowHeight - imageSize) / 2,
              imageSize,
              imageSize
            );
          } else {
            doc.text("Local", currentX, currentY + rowHeight / 2 + 1);
          }
        } else {
          doc.text(text, currentX, currentY + rowHeight / 2 + 1);
        }
        currentX += columnWidths[index];
      });

      currentY += rowHeight;
    }

    doc.save(`reporte_produccion_${dateKey}.pdf`);
  };

  // --- Renderizado de Vistas ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-indigo-600 animate-pulse">
          Cargando datos...
        </div>
      </div>
    );
  }

  // Vista de Edición (Productos)
  if (viewMode === "edit") {
    const dayData = dailyData[selectedDateKey] || { items: [] };
    const dateDisplay = new Date(
      selectedDateKey + "T00:00:00"
    ).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl min-h-screen">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
          Editar Producción
        </h2>
        <p className="text-xl text-gray-600 mb-6 border-b pb-3">
          Día: {dateDisplay}
        </p>

        {dayData.items.map((item, index) => (
          <ProductItemForm
            key={item.id}
            item={item}
            index={index}
            handleItemChange={handleItemChange}
            handleItemBlur={handleItemBlur}
            deleteItem={deleteItem}
          />
        ))}

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={addItem}
            className="flex items-center justify-center px-6 py-3 border border-indigo-500 text-base font-bold rounded-full shadow-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
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
            onClick={() => uploadImageAndSaveData(selectedDateKey)}
            className="px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 transition"
          >
            Guardar y Volver
          </button>
          <button
            onClick={() => handleDayClick(selectedDateKey, "day-view")}
            className="text-gray-500 hover:text-gray-700 mt-2 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Vista de Edición (Costes)
  if (viewMode === "cost-edit") {
    const dayData = dailyData[selectedDateKey] || {};
    const dateDisplay = new Date(
      selectedDateKey + "T00:00:00"
    ).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl min-h-screen">
        <h2 className="text-3xl font-extrabold text-teal-700 mb-2">
          Editar Costes Laborales
        </h2>
        <p className="text-xl text-gray-600 mb-6 border-b pb-3">
          Día: {dateDisplay}
        </p>

        <div className="space-y-6">
          <InputField
            label="Número de Trabajadores"
            value={dayData.numWorkers || ""}
            field="numWorkers"
            type="number"
            placeholder="Ej: 5"
            handleItemChange={(id, field, value) =>
              handleCostChange(field, value)
            }
          />

          <InputField
            label="Horas Trabajadas por Día"
            value={dayData.hoursWorked || ""}
            field="hoursWorked"
            type="number"
            placeholder="Ej: 8.5"
            handleItemChange={(id, field, value) =>
              handleCostChange(field, value)
            }
          />

          <div className="p-4 bg-teal-50 rounded-lg border border-teal-300">
            <p className="text-sm font-medium text-teal-800">
              Coste Fijo por Hora (Base):
            </p>
            <p className="text-xl font-bold text-teal-900 mt-1">
              {HOURLY_COST_RATE.toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Este valor se multiplica por (Trabajadores * Horas Trabajadas).
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => saveDailyData(selectedDateKey)}
            className="px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 transition"
          >
            Guardar Costes y Volver
          </button>
          <button
            onClick={() => handleDayClick(selectedDateKey, "day-view")}
            className="text-gray-500 hover:text-gray-700 mt-2 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Vista de Detalle del Día
  if (viewMode === "day-view") {
    return (
      <DayProductsGrid
        dateKey={selectedDateKey}
        dailyData={dailyData}
        handleDayClick={handleDayClick}
        generatePDF={generatePDF}
        exportToCsv={exportToCsv}
      />
    );
  }

  // Vista de Calendario (por defecto)
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        📊 Tracker de Producción Diaria
      </h1>

      {/* Global Goal Tracker */}
      <GlobalGoalTracker dailyData={dailyData} />

      <h2 className="text-2xl font-bold text-indigo-700 mt-10 mb-5">
        📅 Navegación Mensual
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {calendarDays.map((dateKey) => {
          const dayData = dailyData[dateKey];
          const hasData = dayData && dayData.items && dayData.items.length > 0;
          const isToday = dateKey === today;
          const totalKg = dayData
            ? dayData.items.reduce(
                (sum, item) => sum + parseFloat(item.result || 0),
                0
              )
            : 0;

          let bgColor = "bg-gray-100 hover:bg-gray-200";
          let textColor = "text-gray-600";
          let borderColor = "border-gray-200";

          if (isToday) {
            bgColor = "bg-indigo-100/70 hover:bg-indigo-200/90";
            textColor = "text-indigo-800 font-extrabold";
            borderColor = "border-indigo-400 border-2";
          }

          if (hasData) {
            bgColor = "bg-green-100/70 hover:bg-green-200/90";
            textColor = "text-green-800 font-extrabold";
            borderColor = "border-green-400 border-2";
          }

          return (
            <div
              key={dateKey}
              onClick={() => handleDayClick(dateKey)}
              className={`p-4 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-[1.03] ${bgColor} ${textColor} ${borderColor}`}
            >
              <p className="text-lg font-bold mb-1">
                {new Date(dateKey + "T00:00:00").getDate()}
                {isToday && " (Hoy)"}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {new Date(dateKey + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "short",
                })}
              </p>
              {hasData && (
                <div className="mt-2 pt-1 border-t border-current/30">
                  <p className="text-sm font-bold text-green-700">
                    {totalKg.toFixed(0)} Kg
                  </p>
                </div>
              )}
              {!hasData && (
                <div className="mt-2 pt-1 border-t border-current/30">
                  <p className="text-xs text-gray-400 font-medium">Sin Datos</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-4 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Exportación de Datos
        </h2>
        <p className="text-gray-600 mb-4">
          Exporta todos los datos del calendario a un archivo CSV para su
          análisis externo.
        </p>
        <button
          onClick={() => exportToCsv(dailyData)}
          className="flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-gray-700 hover:bg-gray-800 transition"
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
              d="M17 17h2v5h-2v-5zm-5 0h2v5h-2v-5zm-5 0h2v5H7v-5zM12 1a9 9 0 019 9v3H3v-3a9 9 0 019-9z"
            ></path>
          </svg>
          Exportar Calendario Completo (CSV)
        </button>
      </div>
    </div>
  );
};

export default CalendarView;