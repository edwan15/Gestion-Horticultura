import scrapedFertilizers from './mapa_fertilizers_scraped.json';

// Filter out header rows if any exist in the JSON (e.g. id="Código")
const validScrapedData = scrapedFertilizers.filter(item => item.id !== "Código");

export const catalogData = [
  ...validScrapedData,
  {
    id: "0302445",
    name: "0302445", 
    manufacturer: "ADAMA Agriculture España S.A.",
    authCode: "ES-00849",
    useDeadline: "31-08-2026",
    sellDeadline: "-",
    subtype: "GB",
    composition: "METALDEHIDO 3.0%",
    category: "Fitosanitarios",
    catalogType: "Fitosanitarios (MAPA)"
  },
  {
    id: "14SIGHT",
    name: "1,4SIGHT",
    manufacturer: "DormFresh Limited",
    authCode: "ES-01178",
    useDeadline: "30-06-2026",
    sellDeadline: "-",
    subtype: "KN",
    composition: "1,4 Dimetilnaftaleno 98.0%",
    category: "Fitosanitarios",
    catalogType: "Fitosanitarios (MAPA)"
  },
  {
    id: "24DESTER",
    name: "2,4-D ESTER ISO VALLES",
    manufacturer: "NUFARM ESPAÑA S.A.",
    authCode: "19812",
    useDeadline: "31-03-2026",
    sellDeadline: "-",
    subtype: "EC",
    composition: "2,4-DB",
    category: "Fitosanitarios",
    catalogType: "Fitosanitarios - Denominaciones Comunes (MAPA)"
  },
  {
    id: "ABAMECTINAJEDMASSO",
    name: "ABAMECTINA JED MASSO",
    manufacturer: "LAINCO S.A.",
    authCode: "24574",
    useDeadline: "28-02-2027",
    sellDeadline: "-",
    subtype: "EC",
    composition: "ABAMECTINA",
    category: "Fitosanitarios",
    catalogType: "Fitosanitarios - Denominaciones Comunes (MAPA)"
  },
  // Example hardcoded
  {
    id: "ECO_FITO",
    name: "( EFFECTIVE CONTROL ORGANISMS ) - FITOAGROACTIV",
    manufacturer: "INSTITUTO BIOTECNOLOGICO HEALTHYPLANTS, S.L.",
    authCode: "F0004525/2030", // Using as reference
    useDeadline: "-",
    sellDeadline: "-",
    subtype: "-",
    composition: "Microorganismos",
    category: "Fertilizantes", 
    catalogType: "Fertilizantes (Publico)"
  }
];

export const getUniqueManufacturers = () => {
    const manufacturers = new Set(catalogData.map(item => item.manufacturer));
    return Array.from(manufacturers).sort();
};
