import { useState, useCallback, useMemo } from "react";
import { setDoc, doc } from "firebase/firestore";
import { calculateResult, calculateCosts, formatDate } from "../../Util/util"; // Necesitas crear este archivo de utilidades

const getDocRef = (dbInstance, userId) => {
  // Asegúrate de que esta función se exporte y se use en CalendarView.jsx
  const appId = "default-calendar-app-id"; // O la función real de getAppId()
  return doc(dbInstance, `artifacts/${appId}/users/${userId}/daily_data/data`);
};

// Función para generar un ID único para los ítems de producto
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// =======================================================================
// === CUSTOM HOOK PARA GESTIÓN DE DATOS DIARIOS
// =======================================================================

export const useDailyDataLogic = (
  db,
  userId,
  selectedDateKey,
  YOUR_BACKEND_UPLOAD_URL,
  PRODUCT_CATALOG,
  HOURLY_COST_RATE
) => {
  const [dailyData, setDailyData] = useState({});

  // Obtener los datos del día actualmente seleccionado (o inicializar)
  const currentDayData = useMemo(() => {
    return dailyData[selectedDateKey] || {
      items: [],
      numWorkers: 0,
      hoursWorked: 0,
      productionCostVariable: 0,
      finalProductionCost: 0,
    };
  }, [dailyData, selectedDateKey]);

  // =======================================================================
  // === Lógica de Guardado en Firebase
  // =======================================================================

  const saveToFirebase = useCallback(async (dataToSave) => {
    if (!userId) {
      console.error("Usuario no autenticado. No se puede guardar en Firebase.");
      return;
    }
    try {
      const docRef = getDocRef(db, userId);
      await setDoc(docRef, { daily_data: dataToSave }, { merge: true });
      // El setDailyData se gestiona por el listener onSnapshot en CalendarView
      console.log("Datos guardados con éxito en Firebase.");
    } catch (e) {
      console.error("Error al añadir/actualizar documento: ", e);
    }
  }, [db, userId]);

  // =======================================================================
  // === Handlers de Items (Productos)
  // =======================================================================

  const calculateAndApplyResults = useCallback((data) => {
    const updatedItems = data.items.map(item => {
      const factorA = PRODUCT_CATALOG[item.productName] || 0;
      const result = calculateResult(item.productName, item.factorB);
      return { ...item, factorA, result };
    });

    const dailyTotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.result || 0),
      0
    );

    const { productionCostVariable, finalProductionCost } = calculateCosts(
      dailyTotal,
      data.numWorkers,
      data.hoursWorked,
      HOURLY_COST_RATE // Pasar HOURLY_COST_RATE si es necesario
    );

    return {
      ...data,
      items: updatedItems,
      productionCostVariable,
      finalProductionCost,
    };
  }, [PRODUCT_CATALOG, HOURLY_COST_RATE]);

  const updateAndSaveData = useCallback((dateKey, newDayData) => {
    const finalDayData = calculateAndApplyResults(newDayData);
    setDailyData((prev) => {
      const newData = {
        ...prev,
        [dateKey]: finalDayData,
      };
      saveToFirebase(newData);
      return newData;
    });
  }, [calculateAndApplyResults, saveToFirebase]);


  const handleItemChange = useCallback((itemId, field, value) => {
    setDailyData((prev) => {
      const dayData = prev[selectedDateKey] || currentDayData;
      const newItems = dayData.items.map((item) => {
        if (item.id === itemId) {
          // Si cambiamos productName, reseteamos factorA y result
          const updatedItem = { ...item, [field]: value };
          if (field === "productName") {
            const factorA = PRODUCT_CATALOG[value] || 0;
            updatedItem.factorA = factorA;
            updatedItem.result = calculateResult(value, updatedItem.factorB);
          }
          return updatedItem;
        }
        return item;
      });

      const newDayData = { ...dayData, items: newItems };
      return { ...prev, [selectedDateKey]: calculateAndApplyResults(newDayData) };
    });
  }, [selectedDateKey, currentDayData, PRODUCT_CATALOG, calculateAndApplyResults]);

  const handleItemBlur = useCallback((itemId, field) => {
    // Recalcula y guarda en Firebase cuando se hace blur del input (factorB)
    if (field === "factorB") {
      const dayData = dailyData[selectedDateKey] || currentDayData;
      updateAndSaveData(selectedDateKey, dayData);
    }
  }, [dailyData, selectedDateKey, currentDayData, updateAndSaveData]);

  const addItem = useCallback(() => {
    const newItem = {
      id: generateUniqueId(),
      productName: Object.keys(PRODUCT_CATALOG)[0] || "", // Valor por defecto
      factorA: PRODUCT_CATALOG[Object.keys(PRODUCT_CATALOG)[0]] || 0,
      factorB: 0,
      result: 0,
      imageUrl: "",
    };

    setDailyData((prev) => {
      const dayData = prev[selectedDateKey] || currentDayData;
      const newItems = [...dayData.items, newItem];
      const newDayData = { ...dayData, items: newItems };
      return { ...prev, [selectedDateKey]: newDayData };
    });
  }, [selectedDateKey, currentDayData, PRODUCT_CATALOG]);

  const deleteItem = useCallback((itemId) => {
    setDailyData((prev) => {
      const dayData = prev[selectedDateKey] || currentDayData;
      const newItems = dayData.items.filter((item) => item.id !== itemId);
      const newDayData = { ...dayData, items: newItems };

      // Guardar en Firebase después de calcular los nuevos totales
      updateAndSaveData(selectedDateKey, newDayData);

      return { ...prev, [selectedDateKey]: newDayData };
    });
  }, [selectedDateKey, currentDayData, updateAndSaveData]);


  // =======================================================================
  // === Handler de Costes
  // =======================================================================

  const handleCostChange = useCallback((field, value) => {
    setDailyData((prev) => {
      const dayData = prev[selectedDateKey] || currentDayData;
      const numericValue = parseFloat(value) || 0;

      const newDayData = { ...dayData, [field]: numericValue };

      // Recalcular costes
      const dailyTotal = newDayData.items.reduce(
        (sum, item) => sum + parseFloat(item.result || 0),
        0
      );

      const { productionCostVariable, finalProductionCost } = calculateCosts(
        dailyTotal,
        newDayData.numWorkers,
        newDayData.hoursWorked,
        HOURLY_COST_RATE
      );

      const finalNewDayData = {
        ...newDayData,
        productionCostVariable,
        finalProductionCost,
      };

      return { ...prev, [selectedDateKey]: finalNewDayData };
    });
  }, [selectedDateKey, currentDayData, HOURLY_COST_RATE]);


  const saveDailyData = useCallback((dateKey) => {
    const dayData = dailyData[dateKey] || currentDayData;
    updateAndSaveData(dateKey, dayData); // La función updateAndSaveData ya recalcula y guarda en Firebase
  }, [dailyData, currentDayData, updateAndSaveData]);

  // =======================================================================
  // === Lógica de Subida de Imagen
  // =======================================================================

  const uploadImageAndSaveData = useCallback(async (dateKey) => {
    const dayData = dailyData[dateKey];
    if (!dayData) {
      alert("Error: No hay datos para guardar.");
      return;
    }

    let updatedItems = dayData.items;

    // 1. Procesar todas las imágenes Base64
    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.imageUrl && item.imageUrl.startsWith("data:image")) {
        console.log(`Subiendo imagen para el producto ${item.id}...`);

        try {
          const response = await fetch(YOUR_BACKEND_UPLOAD_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: item.imageUrl,
              date: dateKey,
              product_name: item.productName || "producto_sin_nombre",
            }),
          });

          if (!response.ok) {
            throw new Error("Error al subir la imagen al backend.");
          }

          const result = await response.json();
          console.log("Resultado de subida:", result);

          // Reemplazar la URL Base64 con la URL externa
          updatedItems = updatedItems.map((updateItem) =>
            updateItem.id === item.id
              ? { ...updateItem, imageUrl: result.secure_url }
              : updateItem
          );
        } catch (error) {
          console.error(`Fallo al subir imagen para el producto ${item.id}:`, error);
          // Opcional: Manejo de errores (ej. dejar la Base64, o setear a null)
          updatedItems = updatedItems.map((updateItem) =>
            updateItem.id === item.id
              ? { ...updateItem, imageUrl: null }
              : updateItem
          );
        }
      }
    }

    // 2. Guardar los datos actualizados (con las nuevas URLs de imagen) en Firebase
    const newDayData = { ...dayData, items: updatedItems };
    updateAndSaveData(dateKey, newDayData);

    // 3. Volver a la vista de detalle
    // Esto se haría en el componente padre, así que aquí solo devolvemos el control.
    // En CalendarView, el botón llama a esto y luego a handleDayClick(dateKey, "day-view").

  }, [dailyData, YOUR_BACKEND_UPLOAD_URL, updateAndSaveData]);


  return {
    dailyData,
    setDailyData,
    saveDailyData,
    handleItemChange,
    handleItemBlur,
    handleCostChange,
    deleteItem,
    addItem,
    uploadImageAndSaveData,
  };
};

export { getDocRef }; // Exportar getDocRef para usarla en CalendarView