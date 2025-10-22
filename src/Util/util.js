// constantes
export const HOURLY_COST_RATE = 10; // € o la moneda que uses.
export const PRODUCT_CATALOG = {
  "IFCO 6410": 10,
  "IFCO 4312": 5,
  "CARTON": 8,
  "NARANJA 2°": 16,
  "SAMPER 1°": 12,
  "SAMPER 2°": 15,
};

// funciones

export  const formatNumber = (num, decimales = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  return Number(num).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateResult = (productName, factorB) => {
  const factorA = PRODUCT_CATALOG[productName] || 0;
  const b = parseFloat(factorB) || 0;
  return (factorA * b).toFixed(2);
};

export const calculateCosts = (dailyTotal, numWorkers, hoursWorked) => {
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

export const exportToCsv = (data, dateKeyToExport = null) => {
  // *TODA* la lógica de exportToCsv que tenías en el archivo original va aquí.
  // ...
};