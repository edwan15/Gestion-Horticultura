// import React, { useEffect, useState } from "react";
// import Search from "../../../search/Search";
// import Loader from "../../../Util/Loader";
// import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { motion } from "framer-motion";
// import {
//   deleteProduct,
//   getProducts,
// } from "../../../features/product/ProductSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FILTER_PRODUCTS,
//   selectFilteredProduct,
// } from "../../../features/filter/FilterSearch";
// import ReactPaginate from "react-paginate";
// import { Link } from "react-router-dom";
// import { confirmAlert } from "react-confirm-alert";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import { applyPlugin } from "jspdf-autotable";

// applyPlugin(jsPDF);

// // =======================================================
// // 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// // =======================================================
// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// // **¡IMPORTANTE!** Reemplaza esta URL con la URL de tu logo real en Base64 o accesible.
// const LOGO_URL =""

// // =======================================================
// // Selector para obtener el rol del usuario desde Redux
// // =======================================================
// const selectUser = (state) => state.auth.user || { role: "invitado" };

// const ProductList = ({ products, isLoading }) => {
//   // CLAVE 1: Obtener el rol real del usuario desde Redux
//   const user = useSelector(selectUser);
//   const userRole = user?.role?.toLowerCase() || "invitado"; // Asegura que el rol sea minúsculas o "invitado" por defecto

//   const [search, setSearch] = useState("");
//   const filteredProduct = useSelector(selectFilteredProduct);
//   const dispatch = useDispatch();
//   // --- Lógica de Fecha ---
//   let date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();

//   // --- Funciones de Utilidad ---
//   const shortenText = (text, n) => {
//     if (text.length > n) {
//       const shortenedText = text.substring(0, n).concat("...");
//       return shortenedText;
//     }
//     return text;
//   };

//   const showExportError = (title, message) => {
//     confirmAlert({
//       title: title,
//       message: message,
//       buttons: [{ label: "Aceptar" }],
//     });
//   };

//   const getBase64ImageFromURL = (url) => {
//     // NOTA: Esta función requiere que la imagen esté en el mismo dominio o tenga CORS habilitado
//     // Como tu `LOGO_URL` es Base64, esto es solo una precaución.
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "Anonymous";
//       img.onload = () => {
//         // Petición del usuario: "elimíname los espacios invisibles en todos los códigos que me generes"
//         // No se utiliza canvas en la exportación a Excel (XLSX). En PDF (jsPDF) se mantiene la lógica de imagen.
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         const dataURL = canvas.toDataURL("image/png");
//         resolve(dataURL);
//       };
//       img.onerror = (error) => reject(error);
//       img.src = url;
//     });
//   };
  
//   // --- Funciones de Exportación ---

//   const ExportToExcel = () => {
//     // Comprobación de datos antes de exportar
//     if (currentItems.length === 0) {
//       showExportError(
//         "No hay datos visibles",
//         "La lista actual está vacía. Verifica la búsqueda o la paginación."
//       );
//       return;
//     }

//     // 1. Preparación de datos y adición del Stock Calculado
//     const excelData = currentItems.map((product, index) => ({
//       ID: index + 1,
//       "Nombre del Producto": product.name,
//       Categoría: product.category,
//       "Entradas (+)": product.entradas,
//       "Salidas (-)": product.salidas,
//       "STOCK TOTAL": product.entradas - product.salidas,
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([]);

//     // =================================================================
//     // 2. ESTILOS AVANZADOS PARA EL ENCABEZADO Y LA TABLA
//     // =================================================================

//     const HEADER_ROW = 6; // Fila donde empieza la cabecera de la tabla (A7)
//     const DATA_START_ROW = HEADER_ROW + 1; // Fila de inicio de los datos (A8)
//     const lastColIndex = 5; // Columna F
//     const lastDataRow = DATA_START_ROW + excelData.length - 1;
//     const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

//     // Estilos Comunes (Adaptados para un aspecto profesional y de campo)
//     const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Oscuro (Esmeralda 600)
//     const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Claro (Esmeralda 100)
//     const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } }; // Verde Medio (Esmeralda 400)
//     const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } }; // Verde muy Claro para Totales

//     // 3. Creación del Encabezado con Estilos

//     // La función sheet_add_aoa solo añade el texto, el estilo debe aplicarse después.
//     XLSX.utils.sheet_add_aoa(ws, [
//       [COMPANY_NAME],
//       [INVENTORY_DETAIL],
//       [`Fecha de Reporte: ${day}/${month}/${year}`],
//       [""], // Fila vacía para espacio
//       [""], // Fila vacía para espacio
//       // La fila 6 es la cabecera de la tabla, se agrega en el paso 5.
//     ], { origin: "A1" });

//     // Aplicar estilos a las celdas de encabezado (Filas 1-3)
//     [
//       { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
//       { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
//       { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
//     ].forEach(({ row, text, style }) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
//       // Asegurar que el objeto celda exista antes de modificar el estilo
//       ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
//       ws[cellAddress].v = text;
//       ws[cellAddress].s = style;
//     });

//     // 4. Fusionar celdas del encabezado (Filas 1 a 3)
//     if (!ws["!merges"]) ws["!merges"] = [];
//     for (let i = 0; i < 3; i++) {
//       ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
//     }

//     // 5. Agregar los datos de la tabla (Incluye la Cabecera en la fila 7)
//     XLSX.utils.sheet_add_json(ws, excelData, {
//       origin: `A${HEADER_ROW + 1}`, // Fila 7
//       skipHeader: false,
//     });

//     // 6. Aplicar estilos a la cabecera de la tabla (Fila 7)
//     const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
//     headerKeys.forEach((key, C) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
//       if (ws[cellAddress]) {
//         ws[cellAddress].s = styleTableHeader;
//       }
//     });

//     // 7. Aplicar estilos y Formato Condicional (Stock) a las filas de datos
//     for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
//       for (let C = 0; C <= lastColIndex; C++) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (ws[cellAddress]) {
//           // Estilo de celda básico (alineación)
//           ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

//           // Formato Condicional para la columna STOCK TOTAL (Columna F / C=5)
//           if (C === 5 && ws[cellAddress].v <= 5) { // Stock Bajo (<= 5)
//             ws[cellAddress].s = {
//               ...ws[cellAddress].s,
//               fill: { fgColor: { rgb: "FEE2E2" } }, // Fondo Rojo Claro
//               font: { color: { rgb: "DC2626" }, bold: true }, // Texto Rojo Oscuro
//             };
//           }
//           if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
//              // Asegurar formato numérico para las columnas de valores
//             ws[cellAddress].s.numFmt = '#,##0'; 
//           }
//         }
//       }
//     }

//     // 8. Fila de Resumen con Fórmulas de Excel
//     const summaryRow = lastDataRow + 1; // La fila siguiente a la última de datos
    
//     // Etiqueta del total (Celda C[summaryRow + 1])
//     const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 }); // Columna C (Categoría)
//     ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } }; // Gris claro

//     // Fórmulas de Suma: Sumar Entradas, Salidas y Stock Total (Columnas D, E, F)
//     for (let C = 3; C <= lastColIndex; C++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
//       const colLetter = XLSX.utils.encode_col(C);
      
//       // La fórmula debe sumar desde la primera fila de datos (DATA_START_ROW + 1) hasta la última (lastDataRow + 1)
//       ws[cellAddress] = {
//         t: 'f', // Tipo: Fórmula
//         f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
//         s: styleSummary,
//       };
//     }
    
//     // 9. Configuración final: Auto-filtro y Ancho de Columna
//     ws["!autofilter"] = {
//       ref: XLSX.utils.encode_range({
//         s: { r: HEADER_ROW, c: 0 },
//         e: { r: lastDataRow, c: lastColIndex },
//       }),
//     };

//     const wscols = [
//       { wch: 5 }, // A: ID
//       { wch: 30 }, // B: Nombre del Producto (Más ancho)
//       { wch: 18 }, // C: Categoría
//       { wch: 15 }, // D: Entradas (+)
//       { wch: 15 }, // E: Salidas (-)
//       { wch: 20 }, // F: STOCK TOTAL (Más ancho)
//     ];
//     ws["!cols"] = wscols;
//     ws["!ref"] = range; // Actualizar el rango de la hoja

//     // 10. Escribir el archivo
//     XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
//     XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//   };

//   // CLAVE 2: ExportToPDF Modificada para centrado dinámico del encabezado
//   // (Mantengo tu código original de PDF ya que no pediste cambios aquí, solo ajusté la función `ExportToExcel`).
//   const ExportToPDF = async () => {
//     // 1. Verificación de carga y datos
//     if (isLoading || currentItems.length === 0) {
//       showExportError(
//         "Datos no disponibles",
//         "La lista está vacía o cargando. No se puede exportar."
//       );
//       return;
//     }

//     const doc = new jsPDF();
//     const logoWidth = 30; // Ancho del logo en mm
//     const logoHeight = 15; // Alto del logo en mm // Calcula el punto medio de la página para centrar
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const centerPoint = pageWidth / 2; // X donde se centrará el texto/logo // Posición Y para el inicio del encabezado

//     let currentY = 15;

//     try {
//       // --- 1. Preparar la Imagen del Header (Logo) ---
//       const base64Image = await getBase64ImageFromURL(LOGO_URL); // Centrar el logo
//       const logoX = (pageWidth - logoWidth) / 2;
//       doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight); // Mover Y debajo del logo
//       currentY += logoHeight + 4; // Espacio entre logo y texto
//     } catch (error) {
//       // console.error("Error al cargar o añadir la imagen del logo:", error);
//       // Si falla la imagen, el texto comienza desde Y=15
//       currentY = 15;
//     } // --- 2. Dibujar el Header (Texto) Centrado --- // Nombre de la Empresa
//     doc.setFontSize(14);
//     doc.setFont(undefined, "bold");
//     doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
//     currentY += 6; // Espaciado // Detalles de Inventario (Título del Reporte)

//     doc.setFontSize(18);
//     doc.setFont(undefined, "bold");
//     doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
//     currentY += 5; // Espaciado // Fecha de Exportación

//     doc.setFontSize(10);
//     doc.setFont(undefined, "normal");
//     doc.text(
//       `Fecha de Exportación: ${day}/${month}/${year}`,
//       centerPoint,
//       currentY,
//       { align: "center" }
//     );
//     currentY += 10; // Espaciado final antes de la tabla
//     const tableStart = currentY;

//     const tableColumn = [
//       "ID",
//       "Nombre",
//       "Categoría",
//       "Entradas (+)",
//       "Salidas (-)",
//       "Stock Total",
//     ];
//     const tableRows = [];

//     currentItems.forEach((product, index) => {
//       const stock = product.entradas - product.salidas;
//       const productData = [
//         index + 1,
//         shortenText(product.name, 20),
//         product.category,
//         product.entradas,
//         product.salidas,
//         stock, // Valor de stock calculado
//       ];
//       tableRows.push(productData);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: tableStart,
//       headStyles: {
//         fillColor: [20, 100, 170],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       theme: "striped",
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       didParseCell: function (data) {
//         if (data.column.index === 5) {
//           const stockValue = parseFloat(data.cell.text[0]);
//           if (stockValue <= 0) {
//             data.cell.styles.fillColor = [255, 153, 0];
//             data.cell.styles.textColor = [255, 255, 255];
//           }
//         }
//       },
//       didDrawPage: function (data) {
//         doc.setFontSize(10);
//         doc.text(
//           "Página " + doc.pageNumber,
//           data.settings.margin.left,
//           doc.internal.pageSize.height - 10
//         );
//       },
//     });

//     doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
//   };
  
//   // CLAVE 3: delProduct: Recarga con el modo correcto
//   const delProduct = async (id) => {
//     await dispatch(deleteProduct(id)); // Determinar el modo de recarga para mantener la vista actual (all vs own)
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";
//     await dispatch(getProducts(fetchMode));
//   };

//   const confirmDelate = (id) => {
//     // Solo Admin puede eliminar (según tu renderizado).
//     if (userRole !== "admin") {
//       confirmAlert({
//         title: "Acceso Denegado",
//         message: "Solo los administradores pueden eliminar productos.",
//         buttons: [{ label: "Aceptar" }],
//       });
//       return;
//     }

//     confirmAlert({
//       title: "Eliminar Producto",
//       message: "¿Estás seguro que quieres eliminar este producto?",
//       buttons: [
//         {
//           label: "Eliminar",
//           onClick: () => delProduct(id),
//         },
//         {
//           label: "Cancelar",
//         },
//       ],
//     });
//   };

//   // --- Lógica de Paginación ---
//   const [currentItems, setCurrentItems] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [itemOffice, setItemOffice] = useState(0);
//   const itemPerPage = 100;

//   useEffect(() => {
//     const endOffSet = itemOffice + itemPerPage;

//     setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
//     setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
//   }, [itemOffice, itemPerPage, filteredProduct]);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
//     setItemOffice(newOffset);
//   };

//   // CLAVE 4: useEffect para la carga inicial/recarga basada en el rol
//   useEffect(() => {
//     // Modo de carga: 'all' (Admin, Invitado) o 'own' (Usuario)
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";

//     dispatch(getProducts(fetchMode));
//   }, [dispatch, userRole]);
  
//   // --- Efecto para el Filtrado por Búsqueda ---
//   useEffect(() => {
//     dispatch(FILTER_PRODUCTS({ products, search }));
//   }, [products, search, dispatch]);

//   // --- Renderizado ---
//   return (
//     <div>
//       <div className="px-2 py-4">
//         <div className="flex justify-between ">
//           <h2 className="text-3xl">Productos del Inventario</h2>
//           <span>
//             <Search
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </span>
//         </div>
//         {isLoading && <Loader />}
//         <div className="mt-3">
//           {!isLoading && products.length === 0 ? (
//             <p className="flex justify-start">
//               -- No hay Productos en la Lista , Por favor agrega un producto para almacenarlo...
//             </p>
//           ) : (
//             <table className="grid border-solid border-2 border-blue-400 rounded-md p-2 bg-cardOverlay ">
//               {/* Encabezado para Escritorio (md:block) - Muestra 7 columnas */}
//               <thead className="hidden md:block border-solid border-b-2 mb-3 shadow-md">
//                 <tr className="grid grid-cols-7 text-lg">
//                   <th>ID</th>
//                   <th>Nombre</th>
//                   <th>Categoria</th>
//                   <th>Entradas</th>
//                   <th>Salidas</th>
//                   <th>Stock</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               {/* Encabezado para Móvil (md:hidden) - Muestra 5 columnas */}
//               <thead className="border-solid md:hidden border-b-2 mb-3 shadow-md">
//                 <tr className="grid grid-cols-5 text-lg">
//                   <th>ID</th>
//                   <th>Nomb</th>
//                   <th>Categ</th>
//                   <th>Stock</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className=" grid ">
//                 {currentItems.map((product, index) => {
//                   const { _id, name, category, entradas, salidas } = product; // Controla la visibilidad de los botones de Edición y Eliminación

//                   const canEditOrDelete =
//                     userRole === "admin" || userRole === "usuario"; // La eliminación es solo para Admin, según el código de confirmDelate
//                   const canDelete = userRole === "admin";

//                   return (
//                     <tr
//                       key={_id} // Clase grid-cols-5 para móvil, md:grid-cols-7 para escritorio
//                       className="grid grid-cols-5 md:grid-cols-7 border-solid border-b-2 mb-4 text-lg"
//                     >
//                       <td>{index + 1}</td>
//                       <td>{shortenText(name, 10)}</td>
//                       <td>{shortenText(category, 8)}</td>
//                       {/* Ocultar en móvil, mostrar en md */}
//                       <td className="hidden md:block">{entradas}</td>
//                       <td className="hidden md:block">{salidas}</td>
//                       <td>{entradas - salidas}</td>
//                       <motion.td
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.8 }}
//                         className="flex justify-center space-x-3"
//                       >
//                         {/* 1. Botón de Ver Detalles (Visible para todos) */}
//                         <span>
//                           <Link to={`/product-detail/${_id}`}>
//                             <AiFillEye className="text-purple-400" />
//                           </Link>
//                         </span>
//                         {/* 2. Botón de Editar (Visible para Admin y Usuario) */}
//                         {canEditOrDelete && (
//                           <span>
//                             <Link to={`/edit-product/${_id}`}>
//                               <BiEditAlt className="text-green-400" />
//                             </Link>
//                           </span>
//                         )}
//                         {/* 3. Botón de Eliminar (Visible SOLO para Admin) */}
//                         {canDelete && (
//                           <span>
//                             <Link>
//                               <AiTwotoneDelete
//                                 className="text-red-400"
//                                 onClick={() => confirmDelate(_id)}
//                               />
//                             </Link>
//                           </span>
//                         )}
//                       </motion.td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//           <div className="flex justify-center items-center mt-3 gap-4">
//             {/* Botones de Exportación */}
//             <motion.button
//               whileTap={{ scale: 0.8 }}
//               className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition duration-200 transform hover:scale-[1.05]"
//               onClick={ExportToExcel}
//             >
//               Exportar a Excel <SiMicrosoftexcel />
//             </motion.button>
//             <motion.button
//               whileTap={{ scale: 0.8 }}
//               className="px-1 p-2 bg-red-600 hover:bg-red-700 text-white border-solid border-2 border-red-800 rounded-md flex justify-center items-center gap-2"
//               onClick={ExportToPDF}
//             >
//               Exportar a PDF
//             </motion.button>
//           </div>
//           {/* Paginación */}
//           <div className="flex justify-center items-center mt-6">
//             {currentItems.length > 0 && (
//               <ReactPaginate
//                 breakLabel="..."
//                 nextLabel="Next >"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={5}
//                 pageCount={pageCount}
//                 previousLabel="< Previous"
//                 renderOnZeroPageCount={null}
//                 className="flex justify-center items-center space-x-2 text-xl"
//                 activeClassName="bg-blue-600 text-white rounded-md px-3 py-1 font-bold"
//                 pageClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
//                 previousClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
//                 nextClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
//                 disabledClassName="text-gray-400 cursor-not-allowed"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default ProductList;






// import React, { useEffect, useState } from "react";
// import Search from "../../../search/Search";
// import Loader from "../../../Util/Loader";
// import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { motion } from "framer-motion";
// import {
//   deleteProduct,
//   getProducts,
// } from "../../../features/product/ProductSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FILTER_PRODUCTS,
//   selectFilteredProduct,
// } from "../../../features/filter/FilterSearch";
// import ReactPaginate from "react-paginate";
// import { Link } from "react-router-dom";
// import { confirmAlert } from "react-confirm-alert";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import { applyPlugin } from "jspdf-autotable";

// applyPlugin(jsPDF);

// // =======================================================
// // 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// // =======================================================
// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// // **¡IMPORTANTE!** Reemplaza esta URL con la URL de tu logo real en Base64 o accesible.
// const LOGO_URL =""

// // =======================================================
// // Selector para obtener el rol del usuario desde Redux
// // =======================================================
// const selectUser = (state) => state.auth.user || { role: "invitado" };

// // =======================================================
// // ⭐ NUEVO COMPONENTE: Card para Móvil (Amplio y legible)
// // =======================================================
// const MobileProductCard = ({ product, index, shortenText, confirmDelate, userRole }) => {
//   const { _id, name, category, entradas, salidas } = product;
//   const stock = entradas - salidas;

//   // Controla la visibilidad de los botones de Edición y Eliminación
//   const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//   const canDelete = userRole === "admin";
//   const stockColor = stock <= 5 ? "text-red-600 font-bold" : "text-green-600 font-bold";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.05 }}
//       className="mb-4 p-4 border-2 border-blue-400 rounded-lg shadow-xl bg-white w-full"
//     >
//       <div className="flex justify-between items-center border-b pb-2 mb-2">
//         <span className="text-sm text-gray-500">ID: {index + 1}</span>
//         <span className="text-xl font-semibold text-blue-700">{shortenText(name, 25)}</span>
//       </div>
      
//       {/* Detalle principal en dos columnas amplias para mejor lectura */}
//       <div className="grid grid-cols-2 gap-2 text-md">
//         <div>
//           <p className="text-gray-500">Categoría</p>
//           <p className="font-medium text-gray-800">{shortenText(category, 15)}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-gray-500">STOCK TOTAL</p>
//           <p className={`text-2xl ${stockColor}`}>{stock}</p>
//         </div>
//       </div>

//       {/* Acciones */}
//       <div className="flex justify-around items-center pt-3 mt-3 border-t">
//         {/* 1. Ver Detalles */}
//         <Link to={`/product-detail/${_id}`} className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition">
//           <AiFillEye className="text-2xl text-purple-400" />
//           <span className="text-sm text-gray-600">Ver</span>
//         </Link>
        
//         {/* 2. Editar */}
//         {canEditOrDelete && (
//           <Link to={`/edit-product/${_id}`} className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition">
//             <BiEditAlt className="text-2xl text-green-400" />
//             <span className="text-sm text-gray-600">Editar</span>
//           </Link>
//         )}
        
//         {/* 3. Eliminar */}
//         {canDelete && (
//           <button
//             onClick={() => confirmDelate(_id)}
//             className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition"
//           >
//             <AiTwotoneDelete className="text-2xl text-red-400" />
//             <span className="text-sm text-gray-600">Eliminar</span>
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// };
// // =======================================================
// // FIN: NUEVO COMPONENTE DE CARD
// // =======================================================


// const ProductList = ({ products, isLoading }) => {
//   // CLAVE 1: Obtener el rol real del usuario desde Redux
//   const user = useSelector(selectUser);
//   const userRole = user?.role?.toLowerCase() || "invitado"; // Asegura que el rol sea minúsculas o "invitado" por defecto

//   const [search, setSearch] = useState("");
//   const filteredProduct = useSelector(selectFilteredProduct);
//   const dispatch = useDispatch();
//   // --- Lógica de Fecha ---
//   let date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();

//   // --- Funciones de Utilidad ---
//   const shortenText = (text, n) => {
//     if (text.length > n) {
//       const shortenedText = text.substring(0, n).concat("...");
//       return shortenedText;
//     }
//     return text;
//   };

//   const showExportError = (title, message) => {
//     confirmAlert({
//       title: title,
//       message: message,
//       buttons: [{ label: "Aceptar" }],
//     });
//   };

//   const getBase64ImageFromURL = (url) => {
//     // NOTA: Esta función requiere que la imagen esté en el mismo dominio o tenga CORS habilitado
//     // Como tu `LOGO_URL` es Base64, esto es solo una precaución.
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "Anonymous";
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         const dataURL = canvas.toDataURL("image/png");
//         resolve(dataURL);
//       };
//       img.onerror = (error) => reject(error);
//       img.src = url;
//     });
//   };
  
//   // --- Funciones de Exportación ---

//   const ExportToExcel = () => {
//     // Comprobación de datos antes de exportar
//     if (currentItems.length === 0) {
//       showExportError(
//         "No hay datos visibles",
//         "La lista actual está vacía. Verifica la búsqueda o la paginación."
//       );
//       return;
//     }

//     // 1. Preparación de datos y adición del Stock Calculado
//     const excelData = currentItems.map((product, index) => ({
//       ID: index + 1,
//       "Nombre del Producto": product.name,
//       Categoría: product.category,
//       "Entradas (+)": product.entradas,
//       "Salidas (-)": product.salidas,
//       "STOCK TOTAL": product.entradas - product.salidas,
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([]);

//     // =================================================================
//     // 2. ESTILOS AVANZADOS PARA EL ENCABEZADO Y LA TABLA
//     // =================================================================

//     const HEADER_ROW = 6; // Fila donde empieza la cabecera de la tabla (A7)
//     const DATA_START_ROW = HEADER_ROW + 1; // Fila de inicio de los datos (A8)
//     const lastColIndex = 5; // Columna F
//     const lastDataRow = DATA_START_ROW + excelData.length - 1;
//     const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

//     // Estilos Comunes (Adaptados para un aspecto profesional y de campo)
//     const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Oscuro (Esmeralda 600)
//     const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Claro (Esmeralda 100)
//     const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } }; // Verde Medio (Esmeralda 400)
//     const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } }; // Verde muy Claro para Totales

//     // 3. Creación del Encabezado con Estilos

//     // La función sheet_add_aoa solo añade el texto, el estilo debe aplicarse después.
//     XLSX.utils.sheet_add_aoa(ws, [
//       [COMPANY_NAME],
//       [INVENTORY_DETAIL],
//       [`Fecha de Reporte: ${day}/${month}/${year}`],
//       [""], // Fila vacía para espacio
//       [""], // Fila vacía para espacio
//       // La fila 6 es la cabecera de la tabla, se agrega en el paso 5.
//     ], { origin: "A1" });

//     // Aplicar estilos a las celdas de encabezado (Filas 1-3)
//     [
//       { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
//       { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
//       { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
//     ].forEach(({ row, text, style }) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
//       // Asegurar que el objeto celda exista antes de modificar el estilo
//       ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
//       ws[cellAddress].v = text;
//       ws[cellAddress].s = style;
//     });

//     // 4. Fusionar celdas del encabezado (Filas 1 a 3)
//     if (!ws["!merges"]) ws["!merges"] = [];
//     for (let i = 0; i < 3; i++) {
//       ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
//     }

//     // 5. Agregar los datos de la tabla (Incluye la Cabecera en la fila 7)
//     XLSX.utils.sheet_add_json(ws, excelData, {
//       origin: `A${HEADER_ROW + 1}`, // Fila 7
//       skipHeader: false,
//     });

//     // 6. Aplicar estilos a la cabecera de la tabla (Fila 7)
//     const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
//     headerKeys.forEach((key, C) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
//       if (ws[cellAddress]) {
//         ws[cellAddress].s = styleTableHeader;
//       }
//     });

//     // 7. Aplicar estilos y Formato Condicional (Stock) a las filas de datos
//     for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
//       for (let C = 0; C <= lastColIndex; C++) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (ws[cellAddress]) {
//           // Estilo de celda básico (alineación)
//           ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

//           // Formato Condicional para la columna STOCK TOTAL (Columna F / C=5)
//           if (C === 5 && ws[cellAddress].v <= 5) { // Stock Bajo (<= 5)
//             ws[cellAddress].s = {
//               ...ws[cellAddress].s,
//               fill: { fgColor: { rgb: "FEE2E2" } }, // Fondo Rojo Claro
//               font: { color: { rgb: "DC2626" }, bold: true }, // Texto Rojo Oscuro
//             };
//           }
//           if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
//               // Asegurar formato numérico para las columnas de valores
//             ws[cellAddress].s.numFmt = '#,##0'; 
//           }
//         }
//       }
//     }

//     // 8. Fila de Resumen con Fórmulas de Excel
//     const summaryRow = lastDataRow + 1; // La fila siguiente a la última de datos
    
//     // Etiqueta del total (Celda C[summaryRow + 1])
//     const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 }); // Columna C (Categoría)
//     ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } }; // Gris claro

//     // Fórmulas de Suma: Sumar Entradas, Salidas y Stock Total (Columnas D, E, F)
//     for (let C = 3; C <= lastColIndex; C++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
//       const colLetter = XLSX.utils.encode_col(C);
      
//       // La fórmula debe sumar desde la primera fila de datos (DATA_START_ROW + 1) hasta la última (lastDataRow + 1)
//       ws[cellAddress] = {
//         t: 'f', // Tipo: Fórmula
//         f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
//         s: styleSummary,
//       };
//     }
    
//     // 9. Configuración final: Auto-filtro y Ancho de Columna
//     ws["!autofilter"] = {
//       ref: XLSX.utils.encode_range({
//         s: { r: HEADER_ROW, c: 0 },
//         e: { r: lastDataRow, c: lastColIndex },
//       }),
//     };

//     const wscols = [
//       { wch: 5 }, // A: ID
//       { wch: 30 }, // B: Nombre del Producto (Más ancho)
//       { wch: 18 }, // C: Categoría
//       { wch: 15 }, // D: Entradas (+)
//       { wch: 15 }, // E: Salidas (-)
//       { wch: 20 }, // F: STOCK TOTAL (Más ancho)
//     ];
//     ws["!cols"] = wscols;
//     ws["!ref"] = range; // Actualizar el rango de la hoja

//     // 10. Escribir el archivo
//     XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
//     XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//   };

//   const ExportToPDF = async () => {
//     // 1. Verificación de carga y datos
//     if (isLoading || currentItems.length === 0) {
//       showExportError(
//         "Datos no disponibles",
//         "La lista está vacía o cargando. No se puede exportar."
//       );
//       return;
//     }

//     const doc = new jsPDF();
//     const logoWidth = 30; // Ancho del logo en mm
//     const logoHeight = 15; // Alto del logo en mm // Calcula el punto medio de la página para centrar
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const centerPoint = pageWidth / 2; // X donde se centrará el texto/logo // Posición Y para el inicio del encabezado

//     let currentY = 15;

//     try {
//       // --- 1. Preparar la Imagen del Header (Logo) ---
//       const base64Image = await getBase64ImageFromURL(LOGO_URL); // Centrar el logo
//       const logoX = (pageWidth - logoWidth) / 2;
//       doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight); // Mover Y debajo del logo
//       currentY += logoHeight + 4; // Espacio entre logo y texto
//     } catch (error) {
//       // console.error("Error al cargar o añadir la imagen del logo:", error);
//       // Si falla la imagen, el texto comienza desde Y=15
//       currentY = 15;
//     } // --- 2. Dibujar el Header (Texto) Centrado --- // Nombre de la Empresa
//     doc.setFontSize(14);
//     doc.setFont(undefined, "bold");
//     doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
//     currentY += 6; // Espaciado // Detalles de Inventario (Título del Reporte)

//     doc.setFontSize(18);
//     doc.setFont(undefined, "bold");
//     doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
//     currentY += 5; // Espaciado // Fecha de Exportación

//     doc.setFontSize(10);
//     doc.setFont(undefined, "normal");
//     doc.text(
//       `Fecha de Exportación: ${day}/${month}/${year}`,
//       centerPoint,
//       currentY,
//       { align: "center" }
//     );
//     currentY += 10; // Espaciado final antes de la tabla
//     const tableStart = currentY;

//     const tableColumn = [
//       "ID",
//       "Nombre",
//       "Categoría",
//       "Entradas (+)",
//       "Salidas (-)",
//       "Stock Total",
//     ];
//     const tableRows = [];

//     currentItems.forEach((product, index) => {
//       const stock = product.entradas - product.salidas;
//       const productData = [
//         index + 1,
//         shortenText(product.name, 20),
//         product.category,
//         product.entradas,
//         product.salidas,
//         stock, // Valor de stock calculado
//       ];
//       tableRows.push(productData);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: tableStart,
//       headStyles: {
//         fillColor: [20, 100, 170],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       theme: "striped",
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       didParseCell: function (data) {
//         if (data.column.index === 5) {
//           const stockValue = parseFloat(data.cell.text[0]);
//           if (stockValue <= 0) {
//             data.cell.styles.fillColor = [255, 153, 0];
//             data.cell.styles.textColor = [255, 255, 255];
//           }
//         }
//       },
//       didDrawPage: function (data) {
//         doc.setFontSize(10);
//         doc.text(
//           "Página " + doc.pageNumber,
//           data.settings.margin.left,
//           doc.internal.pageSize.height - 10
//         );
//       },
//     });

//     doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
//   };
  
//   // CLAVE 3: delProduct: Recarga con el modo correcto
//   const delProduct = async (id) => {
//     await dispatch(deleteProduct(id)); // Determinar el modo de recarga para mantener la vista actual (all vs own)
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";
//     await dispatch(getProducts(fetchMode));
//   };

//   const confirmDelate = (id) => {
//     // Solo Admin puede eliminar (según tu renderizado).
//     if (userRole !== "admin") {
//       confirmAlert({
//         title: "Acceso Denegado",
//         message: "Solo los administradores pueden eliminar productos.",
//         buttons: [{ label: "Aceptar" }],
//       });
//       return;
//     }

//     confirmAlert({
//       title: "Eliminar Producto",
//       message: "¿Estás seguro que quieres eliminar este producto?",
//       buttons: [
//         {
//           label: "Eliminar",
//           onClick: () => delProduct(id),
//         },
//         {
//           label: "Cancelar",
//         },
//       ],
//     });
//   };

//   // --- Lógica de Paginación ---
//   const [currentItems, setCurrentItems] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [itemOffice, setItemOffice] = useState(0);
//   const itemPerPage = 100;

//   useEffect(() => {
//     const endOffSet = itemOffice + itemPerPage;

//     setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
//     setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
//   }, [itemOffice, itemPerPage, filteredProduct]);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
//     setItemOffice(newOffset);
//   };

//   // CLAVE 4: useEffect para la carga inicial/recarga basada en el rol
//   useEffect(() => {
//     // Modo de carga: 'all' (Admin, Invitado) o 'own' (Usuario)
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";

//     dispatch(getProducts(fetchMode));
//   }, [dispatch, userRole]);
  
//   // --- Efecto para el Filtrado por Búsqueda ---
//   useEffect(() => {
//     dispatch(FILTER_PRODUCTS({ products, search }));
//   }, [products, search, dispatch]);

//   // --- Renderizado ---
//   return (
//     <div>
//       <div className="px-2 py-4">
//         <div className="flex justify-between items-center ">
//           <h2 className="text-3xl">Productos del Inventario</h2>
//           <span>
//             <Search
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </span>
//         </div>
//         {isLoading && <Loader />}
//         <div className="mt-3">
//           {!isLoading && products.length === 0 ? (
//             <p className="flex justify-start">
//               -- No hay Productos en la Lista , Por favor agrega un producto para almacenarlo...
//             </p>
//           ) : (
//             <>
//               {/* === VISTA DE ESCRITORIO (md:block) === */}
//               <div className="hidden md:block">
//                 <table className="w-full border-solid border-2 border-blue-400 rounded-md p-2 bg-white">
//                   {/* Encabezado para Escritorio (md:block) - Muestra 7 columnas */}
//                   <thead className="border-solid border-b-2 mb-3 shadow-md">
//                     <tr className="grid grid-cols-7 text-lg text-left">
//                       <th className="pl-4">ID</th>
//                       <th>Nombre</th>
//                       <th>Categoria</th>
//                       <th className="text-center">Entradas</th>
//                       <th className="text-center">Salidas</th>
//                       <th className="text-center">Stock</th>
//                       <th className="text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="w-full">
//                     {currentItems.map((product, index) => {
//                       const { _id, name, category, entradas, salidas } = product;
//                       const stock = entradas - salidas;

//                       const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//                       const canDelete = userRole === "admin";
//                       const stockColor = stock <= 5 ? "text-red-600 font-bold" : "text-green-600 font-bold";

//                       return (
//                         <tr
//                           key={_id}
//                           className="grid grid-cols-7 border-solid border-b text-lg hover:bg-gray-50 transition duration-150"
//                         >
//                           <td className="py-2 pl-4">{index + 1}</td>
//                           <td className="py-2">{shortenText(name, 15)}</td>
//                           <td className="py-2">{shortenText(category, 10)}</td>
//                           <td className="py-2 text-center">{entradas}</td>
//                           <td className="py-2 text-center">{salidas}</td>
//                           <td className={`py-2 text-center ${stockColor}`}>{stock}</td>
//                           <motion.td
//                             className="flex justify-center items-center space-x-3 py-2"
//                           >
//                             {/* 1. Botón de Ver Detalles */}
//                             <Link to={`/product-detail/${_id}`}>
//                               <AiFillEye className="text-2xl text-purple-400 hover:text-purple-600 transition" />
//                             </Link>
//                             {/* 2. Botón de Editar */}
//                             {canEditOrDelete && (
//                               <Link to={`/edit-product/${_id}`}>
//                                 <BiEditAlt className="text-2xl text-green-400 hover:text-green-600 transition" />
//                               </Link>
//                             )}
//                             {/* 3. Botón de Eliminar */}
//                             {canDelete && (
//                               <button onClick={() => confirmDelate(_id)}>
//                                 <AiTwotoneDelete className="text-2xl text-red-400 hover:text-red-600 transition" />
//                               </button>
//                             )}
//                           </motion.td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* === VISTA DE MÓVIL (hidden md:block) === */}
//               <div className="md:hidden">
//                 <div className="text-center text-sm text-gray-500 mb-4">
//                     Desliza para ver más detalles.
//                 </div>
//                 {currentItems.map((product, index) => (
//                     <MobileProductCard 
//                         key={product._id} 
//                         product={product} 
//                         index={index} 
//                         shortenText={shortenText} 
//                         confirmDelate={confirmDelate} 
//                         userRole={userRole} 
//                     />
//                 ))}
//               </div>
//             </>
//           )}
          
//           <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
//             {/* Botones de Exportación */}
//             <motion.button
//               whileTap={{ scale: 0.8 }}
//               className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition duration-200 transform hover:scale-[1.05]"
//               onClick={ExportToExcel}
//             >
//               Exportar a Excel <SiMicrosoftexcel />
//             </motion.button>
//             <motion.button
//               whileTap={{ scale: 0.8 }}
//               className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold border-solid border-2 border-red-800 rounded-md flex justify-center items-center gap-2 transition duration-200 transform hover:scale-[1.05]"
//               onClick={ExportToPDF}
//             >
//               Exportar a PDF
//             </motion.button>
//           </div>
//           {/* Paginación */}
//           <div className="flex justify-center items-center mt-6">
//             {currentItems.length > 0 && (
//               <ReactPaginate
//                 breakLabel="..."
//                 nextLabel="Siguiente >"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={3} // Reducido para móvil
//                 marginPagesDisplayed={2} // Reducido para móvil
//                 pageCount={pageCount}
//                 previousLabel="< Anterior"
//                 renderOnZeroPageCount={null}
//                 containerClassName="flex justify-center items-center space-x-2 text-md sm:text-lg"
//                 activeClassName="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
//                 pageClassName="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-200 transition"
//                 previousClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
//                 nextClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
//                 disabledClassName="text-gray-400 cursor-not-allowed hover:bg-white"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;





// import React, { useEffect, useState } from "react";
// import Search from "../../../search/Search";
// import Loader from "../../../Util/Loader";
// import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { motion } from "framer-motion";
// import {
//   deleteProduct,
//   getProducts,
// } from "../../../features/product/ProductSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FILTER_PRODUCTS,
//   selectFilteredProduct,
// } from "../../../features/filter/FilterSearch";
// import ReactPaginate from "react-paginate";
// import { Link } from "react-router-dom";
// import { confirmAlert } from "react-confirm-alert";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import { applyPlugin } from "jspdf-autotable";

// applyPlugin(jsPDF);

// // =======================================================
// // 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// // (Mantengo estas constantes por si las necesitas)
// // =======================================================
// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// const LOGO_URL =""

// const selectUser = (state) => state.auth.user || { role: "invitado" };

// // =======================================================
// // 💎 NUEVO COMPONENTE: Card Móvil Avanzada y Profesional
// // =======================================================
// const MobileProductCard = ({ product, index, shortenText, confirmDelate, userRole }) => {
//   const { _id, name, category, entradas, salidas } = product;
//   const stock = entradas - salidas;

//   const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//   const canDelete = userRole === "admin";
  
//   // Estilos de stock avanzados (chip)
//   const stockBg = stock > 5 
//     ? "bg-green-100 text-green-800" // Stock OK: Verde suave
//     : stock > 0 ? "bg-yellow-100 text-yellow-800" // Stock Bajo: Amarillo
//     : "bg-red-100 text-red-800"; // Agotado: Rojo

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.05 }}
//       // Estilo de tarjeta avanzada: rounded-2xl, sombra fuerte, fondo blanco sutil
//       className="mb-6 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 w-full hover:shadow-2xl transition duration-300"
//     >
//       {/* 1. Encabezado / Título */}
//       <div className="flex justify-between items-center mb-3">
//         {/* Nombre del Producto (Audaz y visible) */}
//         <h3 className="text-xl font-extrabold text-blue-800 break-words max-w-[80%]">
//           {shortenText(name, 10)}
//         </h3>
//         {/* ID/Index (Chip moderno) */}
//         <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 shadow-sm">
//           #{index + 1}
//         </span>
//       </div>
      
//       {/* 2. Detalles Clave (Dos columnas profesionales) */}
//       <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
//         {/* Categoría */}
//         <div>
//           <p className="text-xs font-medium text-gray-500 uppercase">Categoría</p>
//           <p className="text-lg font-semibold text-gray-700">
//             {shortenText(category, 7)}
//           </p>
//         </div>
        
//         {/* Stock Total (Foco visual) */}
//         <div className="text-right">
//           <p className="text-xs font-medium text-gray-500 uppercase">Stock Total</p>
//           <span className={`inline-flex items-center justify-center h-10 px-4 mt-1 text-2xl font-bold rounded-lg shadow-inner ${stockBg}`}>
//             {stock}
//           </span>
//         </div>
//       </div>
      
//       {/* 3. Acciones (Iconos grandes y centrados) */}
//       <div className="flex justify-around items-center pt-4 mt-1">
        
//         {/* Ver Detalles */}
//         <Link to={`/product-detail/${_id}`} className="flex flex-col items-center hover:bg-purple-50 p-2 rounded-lg transition group">
//           <AiFillEye className="text-3xl text-purple-500 group-hover:text-purple-700 transition duration-150" />
//           <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Ver</span>
//         </Link>
        
//         {/* Editar */}
//         {canEditOrDelete && (
//           <Link to={`/edit-product/${_id}`} className="flex flex-col items-center hover:bg-green-50 p-2 rounded-lg transition group">
//             <BiEditAlt className="text-3xl text-green-500 group-hover:text-green-700 transition duration-150" />
//             <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Editar</span>
//           </Link>
//         )}
        
//         {/* Eliminar */}
//         {canDelete && (
//           <button
//             onClick={() => confirmDelate(_id)}
//             className="flex flex-col items-center hover:bg-red-50 p-2 rounded-lg transition group"
//           >
//             <AiTwotoneDelete className="text-3xl text-red-500 group-hover:text-red-700 transition duration-150" />
//             <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Eliminar</span>
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// };
// // =======================================================
// // FIN: NUEVO COMPONENTE DE CARD AVANZADA
// // =======================================================


// const ProductList = ({ products, isLoading }) => {
//   // ... (Resto de la lógica de ProductList, useState, useEffect, etc. se mantiene igual)
//   const user = useSelector(selectUser);
//   const userRole = user?.role?.toLowerCase() || "invitado";

//   const [search, setSearch] = useState("");
//   const filteredProduct = useSelector(selectFilteredProduct);
//   const dispatch = useDispatch();

//   let date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear();

//   const shortenText = (text, n) => {
//     if (text.length > n) {
//       const shortenedText = text.substring(0, n).concat("...");
//       return shortenedText;
//     }
//     return text;
//   };

//   const showExportError = (title, message) => {
//     confirmAlert({
//       title: title,
//       message: message,
//       buttons: [{ label: "Aceptar" }],
//     });
//   };

//   const getBase64ImageFromURL = (url) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = "Anonymous";
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         const dataURL = canvas.toDataURL("image/png");
//         resolve(dataURL);
//       };
//       img.onerror = (error) => reject(error);
//       img.src = url;
//     });
//   };
  
//   const ExportToExcel = () => {
//     if (currentItems.length === 0) {
//       showExportError(
//         "No hay datos visibles",
//         "La lista actual está vacía. Verifica la búsqueda o la paginación."
//       );
//       return;
//     }

//     const excelData = currentItems.map((product, index) => ({
//       ID: index + 1,
//       "Nombre del Producto": product.name,
//       Categoría: product.category,
//       "Entradas (+)": product.entradas,
//       "Salidas (-)": product.salidas,
//       "STOCK TOTAL": product.entradas - product.salidas,
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([]);

//     const HEADER_ROW = 6;
//     const DATA_START_ROW = HEADER_ROW + 1;
//     const lastColIndex = 5;
//     const lastDataRow = DATA_START_ROW + excelData.length - 1;
//     const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

//     const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } };
//     const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } };
//     const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } };
//     const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } };

//     XLSX.utils.sheet_add_aoa(ws, [
//       [COMPANY_NAME],
//       [INVENTORY_DETAIL],
//       [`Fecha de Reporte: ${day}/${month}/${year}`],
//       [""],
//       [""],
//     ], { origin: "A1" });

//     [
//       { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
//       { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
//       { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
//     ].forEach(({ row, text, style }) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
//       ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
//       ws[cellAddress].v = text;
//       ws[cellAddress].s = style;
//     });

//     if (!ws["!merges"]) ws["!merges"] = [];
//     for (let i = 0; i < 3; i++) {
//       ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
//     }

//     XLSX.utils.sheet_add_json(ws, excelData, {
//       origin: `A${HEADER_ROW + 1}`,
//       skipHeader: false,
//     });

//     const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
//     headerKeys.forEach((key, C) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
//       if (ws[cellAddress]) {
//         ws[cellAddress].s = styleTableHeader;
//       }
//     });

//     for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
//       for (let C = 0; C <= lastColIndex; C++) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (ws[cellAddress]) {
//           ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

//           if (C === 5 && ws[cellAddress].v <= 5) {
//             ws[cellAddress].s = {
//               ...ws[cellAddress].s,
//               fill: { fgColor: { rgb: "FEE2E2" } },
//               font: { color: { rgb: "DC2626" }, bold: true },
//             };
//           }
//           if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
//             ws[cellAddress].s.numFmt = '#,##0'; 
//           }
//         }
//       }
//     }

//     const summaryRow = lastDataRow + 1;
//     const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 });
//     ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } };

//     for (let C = 3; C <= lastColIndex; C++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
//       const colLetter = XLSX.utils.encode_col(C);
      
//       ws[cellAddress] = {
//         t: 'f',
//         f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
//         s: styleSummary,
//       };
//     }
    
//     ws["!autofilter"] = {
//       ref: XLSX.utils.encode_range({
//         s: { r: HEADER_ROW, c: 0 },
//         e: { r: lastDataRow, c: lastColIndex },
//       }),
//     };

//     const wscols = [
//       { wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
//     ];
//     ws["!cols"] = wscols;
//     ws["!ref"] = range;

//     XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
//     XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//   };

//   const ExportToPDF = async () => {
//     if (isLoading || currentItems.length === 0) {
//       showExportError(
//         "Datos no disponibles",
//         "La lista está vacía o cargando. No se puede exportar."
//       );
//       return;
//     }

//     const doc = new jsPDF();
//     const logoWidth = 30;
//     const logoHeight = 15;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const centerPoint = pageWidth / 2;

//     let currentY = 15;

//     try {
//       const base64Image = await getBase64ImageFromURL(LOGO_URL);
//       const logoX = (pageWidth - logoWidth) / 2;
//       doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight);
//       currentY += logoHeight + 4;
//     } catch (error) {
//       currentY = 15;
//     }

//     doc.setFontSize(14);
//     doc.setFont(undefined, "bold");
//     doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
//     currentY += 6;

//     doc.setFontSize(18);
//     doc.setFont(undefined, "bold");
//     doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
//     currentY += 5;

//     doc.setFontSize(10);
//     doc.setFont(undefined, "normal");
//     doc.text(
//       `Fecha de Exportación: ${day}/${month}/${year}`,
//       centerPoint,
//       currentY,
//       { align: "center" }
//     );
//     currentY += 10;
//     const tableStart = currentY;

//     const tableColumn = [
//       "ID",
//       "Nombre",
//       "Categoría",
//       "Entradas (+)",
//       "Salidas (-)",
//       "Stock Total",
//     ];
//     const tableRows = [];

//     currentItems.forEach((product, index) => {
//       const stock = product.entradas - product.salidas;
//       const productData = [
//         index + 1,
//         shortenText(product.name, 20),
//         product.category,
//         product.entradas,
//         product.salidas,
//         stock,
//       ];
//       tableRows.push(productData);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: tableStart,
//       headStyles: {
//         fillColor: [20, 100, 170],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       theme: "striped",
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       didParseCell: function (data) {
//         if (data.column.index === 5) {
//           const stockValue = parseFloat(data.cell.text[0]);
//           if (stockValue <= 0) {
//             data.cell.styles.fillColor = [255, 153, 0];
//             data.cell.styles.textColor = [255, 255, 255];
//           }
//         }
//       },
//       didDrawPage: function (data) {
//         doc.setFontSize(10);
//         doc.text(
//           "Página " + doc.pageNumber,
//           data.settings.margin.left,
//           doc.internal.pageSize.height - 10
//         );
//       },
//     });

//     doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
//   };
  
//   const delProduct = async (id) => {
//     await dispatch(deleteProduct(id));
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";
//     await dispatch(getProducts(fetchMode));
//   };

//   const confirmDelate = (id) => {
//     if (userRole !== "admin") {
//       confirmAlert({
//         title: "Acceso Denegado",
//         message: "Solo los administradores pueden eliminar productos.",
//         buttons: [{ label: "Aceptar" }],
//       });
//       return;
//     }

//     confirmAlert({
//       title: "Eliminar Producto",
//       message: "¿Estás seguro que quieres eliminar este producto?",
//       buttons: [
//         {
//           label: "Eliminar",
//           onClick: () => delProduct(id),
//         },
//         {
//           label: "Cancelar",
//         },
//       ],
//     });
//   };

//   const [currentItems, setCurrentItems] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [itemOffice, setItemOffice] = useState(0);
//   const itemPerPage = 100;

//   useEffect(() => {
//     const endOffSet = itemOffice + itemPerPage;

//     setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
//     setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
//   }, [itemOffice, itemPerPage, filteredProduct]);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
//     setItemOffice(newOffset);
//   };

//   useEffect(() => {
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";

//     dispatch(getProducts(fetchMode));
//   }, [dispatch, userRole]);
  
//   useEffect(() => {
//     dispatch(FILTER_PRODUCTS({ products, search }));
//   }, [products, search, dispatch]);

//   // --- Renderizado Modificado ---
//   return (
//     <div>
//       <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"> 
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-4 border-blue-500 pb-1">
//             Inventario
//           </h2>
//           <span>
//             <Search
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </span>
//         </div>
        
//         {isLoading && <Loader />}
        
//         <div className="mt-3">
//           {!isLoading && products.length === 0 ? (
//             <div className="p-6 bg-white rounded-xl shadow-lg">
//               <p className="text-gray-600 font-medium">
//                 -- No hay Productos en la Lista. Por favor agrega un producto para almacenarlo...
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* === VISTA DE ESCRITORIO (md:block) === */}
//               <div className="hidden md:block">
//                 <table className="w-full border border-blue-400 rounded-lg overflow-hidden bg-white shadow-lg">
//                   {/* Encabezado para Escritorio */}
//                   <thead className="bg-blue-600 text-white shadow-md">
//                     <tr className="grid grid-cols-7 text-lg text-left">
//                       <th className="pl-4 py-3">ID</th>
//                       <th className="py-3">Nombre</th>
//                       <th className="py-3">Categoria</th>
//                       <th className="py-3 text-center">Entradas</th>
//                       <th className="py-3 text-center">Salidas</th>
//                       <th className="py-3 text-center">Stock</th>
//                       <th className="py-3 text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="w-full divide-y divide-gray-200">
//                     {currentItems.map((product, index) => {
//                       const { _id, name, category, entradas, salidas } = product;
//                       const stock = entradas - salidas;

//                       const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//                       const canDelete = userRole === "admin";
//                       const stockColor = stock <= 5 ? "text-red-600 font-bold" : "text-green-600 font-bold";

//                       return (
//                         <tr
//                           key={_id}
//                           className="grid grid-cols-7 text-base hover:bg-blue-50 transition duration-150"
//                         >
//                           <td className="py-3 pl-4">{index + 1}</td>
//                           <td className="py-3">{shortenText(name, 10)}</td>
//                           <td className="py-3">{shortenText(category, 10)}</td>
//                           <td className="py-3 text-center">{entradas}</td>
//                           <td className="py-3 text-center">{salidas}</td>
//                           <td className={`py-3 text-center ${stockColor}`}>{stock}</td>
//                           <motion.td
//                             className="flex justify-center items-center space-x-3 py-2"
//                           >
//                             <Link to={`/product-detail/${_id}`}>
//                               <AiFillEye className="text-2xl text-purple-500 hover:text-purple-700 transition" />
//                             </Link>
//                             {canEditOrDelete && (
//                               <Link to={`/edit-product/${_id}`}>
//                                 <BiEditAlt className="text-2xl text-green-500 hover:text-green-700 transition" />
//                               </Link>
//                             )}
//                             {canDelete && (
//                               <button onClick={() => confirmDelate(_id)}>
//                                 <AiTwotoneDelete className="text-2xl text-red-500 hover:text-red-700 transition" />
//                               </button>
//                             )}
//                           </motion.td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* === VISTA DE MÓVIL (md:hidden) === */}
//               <div className="md:hidden pt-4">
//                 {currentItems.map((product, index) => (
//                     <MobileProductCard 
//                         key={product._id} 
//                         product={product} 
//                         index={index} 
//                         shortenText={shortenText} 
//                         confirmDelate={confirmDelate} 
//                         userRole={userRole} 
//                     />
//                 ))}
//               </div>
//             </>
//           )}
          
//           <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
//             {/* Botones de Exportación con estilo más limpio y profesional */}
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
//               onClick={ExportToExcel}
//             >
//               Exportar a Excel <SiMicrosoftexcel className="text-xl" />
//             </motion.button>
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
//               onClick={ExportToPDF}
//             >
//               Exportar a PDF
//             </motion.button>
//           </div>
          
//           {/* Paginación */}
//           <div className="flex justify-center items-center mt-10">
//             {currentItems.length > 0 && (
//               <ReactPaginate
//                 breakLabel="..."
//                 nextLabel="Siguiente >"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={3}
//                 marginPagesDisplayed={2}
//                 pageCount={pageCount}
//                 previousLabel="< Anterior"
//                 renderOnZeroPageCount={null}
//                 containerClassName="flex justify-center items-center space-x-2 text-md sm:text-lg"
//                 activeClassName="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-lg"
//                 pageClassName="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-blue-100 transition"
//                 previousClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
//                 nextClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
//                 disabledClassName="text-gray-400 cursor-not-allowed hover:bg-white"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;



// import React, { useEffect, useState } from "react";
// import Search from "../../../search/Search";
// import Loader from "../../../Util/Loader";
// import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import { SiMicrosoftexcel } from "react-icons/si";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import InventorySummaryCard from "../../Inventario/InventorySummaryCard"
// import { motion } from "framer-motion";
// import {
//     deleteProduct,
//     getProducts,
// } from "../../../features/product/ProductSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     FILTER_PRODUCTS,
//     selectFilteredProduct,
// } from "../../../features/filter/FilterSearch";
// import ReactPaginate from "react-paginate";
// import { Link } from "react-router-dom";
// import { confirmAlert } from "react-confirm-alert";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import { applyPlugin } from "jspdf-autotable";

// applyPlugin(jsPDF);

// // =======================================================
// // 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// // =======================================================
// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// const LOGO_URL = "";

// const selectUser = (state) => state.auth.user || { role: "invitado" };

// // =======================================================
// // 💎 COMPONENTE: Card Móvil Avanzada y Profesional
// // =======================================================
// const MobileProductCard = ({ product, index, shortenText, confirmDelate, userRole }) => {
//     const { _id, name, category, entradas, salidas } = product;
//     const stock = entradas - salidas;

//     const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//     const canDelete = userRole === "admin";
    
//     // ESTILOS DE STOCK CORREGIDOS (Rojo solo si <= 0)
//     const stockBg = stock > 5 
//         ? "bg-green-100 text-green-800" // Stock OK (> 5): Verde suave
//         : stock > 0 ? "bg-yellow-100 text-yellow-800" // Stock Bajo (1-5): Amarillo
//         : "bg-red-100 text-red-800"; // Agotado/Negativo (<= 0): Rojo

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.05 }}
//             className="mb-6 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 w-full hover:shadow-2xl transition duration-300"
//         >
//             {/* 1. Encabezado / Título */}
//             <div className="flex justify-between items-center mb-3">
//                 {/* Nombre del Producto (Audaz y visible) */}
//                 <h3 className="text-xl font-extrabold text-blue-800 break-words max-w-[80%]">
//                     {shortenText(name, 10)}
//                 </h3>
//                 {/* ID/Index (Chip moderno) */}
//                 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 shadow-sm">
//                     #{index + 1}
//                 </span>
//             </div>
            
//             {/* 2. Detalles Clave (Dos columnas profesionales) */}
//             <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
//                 {/* Categoría */}
//                 <div>
//                     <p className="text-xs font-medium text-gray-500 uppercase">Categoría</p>
//                     <p className="text-lg font-semibold text-gray-700">
//                         {shortenText(category, 7)}
//                     </p>
//                 </div>
                
//                 {/* Stock Total (Foco visual) */}
//                 <div className="text-right">
//                     <p className="text-xs font-medium text-gray-500 uppercase">Stock Total</p>
//                     <span className={`inline-flex items-center justify-center h-10 px-4 mt-1 text-2xl font-bold rounded-lg shadow-inner ${stockBg}`}>
//                         {stock}
//                     </span>
//                 </div>
//             </div>
            
//             {/* 3. Acciones (Iconos grandes y centrados) */}
//             <div className="flex justify-around items-center pt-4 mt-1">
                
//                 {/* Ver Detalles */}
//                 <Link to={`/product-detail/${_id}`} className="flex flex-col items-center hover:bg-purple-50 p-2 rounded-lg transition group">
//                     <AiFillEye className="text-3xl text-purple-500 group-hover:text-purple-700 transition duration-150" />
//                     <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Ver</span>
//                 </Link>
                
//                 {/* Editar */}
//                 {canEditOrDelete && (
//                     <Link to={`/edit-product/${_id}`} className="flex flex-col items-center hover:bg-green-50 p-2 rounded-lg transition group">
//                         <BiEditAlt className="text-3xl text-green-500 group-hover:text-green-700 transition duration-150" />
//                         <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Editar</span>
//                     </Link>
//                 )}
                
//                 {/* Eliminar */}
//                 {canDelete && (
//                     <button
//                         onClick={() => confirmDelate(_id)}
//                         className="flex flex-col items-center hover:bg-red-50 p-2 rounded-lg transition group"
//                     >
//                         <AiTwotoneDelete className="text-3xl text-red-500 group-hover:text-red-700 transition duration-150" />
//                         <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Eliminar</span>
//                     </button>
//                 )}
//             </div>
//         </motion.div>
//     );
// };
// // =======================================================
// // FIN: COMPONENTE DE CARD AVANZADA
// // =======================================================


// const ProductList = ({ products, isLoading }) => {
//     const user = useSelector(selectUser);
//     const userRole = user?.role?.toLowerCase() || "invitado";

//     const [search, setSearch] = useState("");
//     const filteredProduct = useSelector(selectFilteredProduct);
//     const dispatch = useDispatch();

//     let date = new Date();
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     let year = date.getFullYear();

//     const shortenText = (text, n) => {
//         if (text.length > n) {
//             const shortenedText = text.substring(0, n).concat("...");
//             return shortenedText;
//         }
//         return text;
//     };

//     const showExportError = (title, message) => {
//         confirmAlert({
//             title: title,
//             message: message,
//             buttons: [{ label: "Aceptar" }],
//         });
//     };

//     const getBase64ImageFromURL = (url) => {
//         return new Promise((resolve, reject) => {
//             const img = new Image();
//             img.crossOrigin = "Anonymous";
//             img.onload = () => {
//                 const canvas = document.createElement("canvas");
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 const ctx = canvas.getContext("2d");
//                 ctx.drawImage(img, 0, 0);
//                 const dataURL = canvas.toDataURL("image/png");
//                 resolve(dataURL);
//             };
//             img.onerror = (error) => reject(error);
//             img.src = url;
//         });
//     };
    
//     const ExportToExcel = () => {
//         if (currentItems.length === 0) {
//             showExportError(
//                 "No hay datos visibles",
//                 "La lista actual está vacía. Verifica la búsqueda o la paginación."
//             );
//             return;
//         }

//         const excelData = currentItems.map((product, index) => ({
//             ID: index + 1,
//             "Nombre del Producto": product.name,
//             Categoría: product.category,
//             "Entradas (+)": product.entradas,
//             "Salidas (-)": product.salidas,
//             "STOCK TOTAL": product.entradas - product.salidas,
//         }));

//         const wb = XLSX.utils.book_new();
//         const ws = XLSX.utils.json_to_sheet([]);

//         const HEADER_ROW = 6;
//         const DATA_START_ROW = HEADER_ROW + 1;
//         const lastColIndex = 5;
//         const lastDataRow = DATA_START_ROW + excelData.length - 1;
//         const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

//         const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } };
//         const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } };
//         const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } };
//         const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } };

//         XLSX.utils.sheet_add_aoa(ws, [
//             [COMPANY_NAME],
//             [INVENTORY_DETAIL],
//             [`Fecha de Reporte: ${day}/${month}/${year}`],
//             [""],
//             [""],
//         ], { origin: "A1" });

//         [
//             { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
//             { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
//             { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
//         ].forEach(({ row, text, style }) => {
//             const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
//             ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
//             ws[cellAddress].v = text;
//             ws[cellAddress].s = style;
//         });

//         if (!ws["!merges"]) ws["!merges"] = [];
//         for (let i = 0; i < 3; i++) {
//             ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
//         }

//         XLSX.utils.sheet_add_json(ws, excelData, {
//             origin: `A${HEADER_ROW + 1}`,
//             skipHeader: false,
//         });

//         const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
//         headerKeys.forEach((key, C) => {
//             const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
//             if (ws[cellAddress]) {
//                 ws[cellAddress].s = styleTableHeader;
//             }
//         });

//         for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
//             for (let C = 0; C <= lastColIndex; C++) {
//                 const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//                 if (ws[cellAddress]) {
//                     ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

//                     if (C === 5 && ws[cellAddress].v <= 5) {
//                         ws[cellAddress].s = {
//                             ...ws[cellAddress].s,
//                             fill: { fgColor: { rgb: "FEE2E2" } },
//                             font: { color: { rgb: "DC2626" }, bold: true },
//                         };
//                     }
//                     if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
//                         ws[cellAddress].s.numFmt = '#,##0'; 
//                     }
//                 }
//             }
//         }

//         const summaryRow = lastDataRow + 1;
//         const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 });
//         ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } };

//         for (let C = 3; C <= lastColIndex; C++) {
//             const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
//             const colLetter = XLSX.utils.encode_col(C);
            
//             ws[cellAddress] = {
//                 t: 'f',
//                 f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
//                 s: styleSummary,
//             };
//         }
        
//         ws["!autofilter"] = {
//             ref: XLSX.utils.encode_range({
//                 s: { r: HEADER_ROW, c: 0 },
//                 e: { r: lastDataRow, c: lastColIndex },
//             }),
//         };

//         const wscols = [
//             { wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
//         ];
//         ws["!cols"] = wscols;
//         ws["!ref"] = range;

//         XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
//         XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//     };

//     const ExportToPDF = async () => {
//         if (isLoading || currentItems.length === 0) {
//             showExportError(
//                 "Datos no disponibles",
//                 "La lista está vacía o cargando. No se puede exportar."
//             );
//             return;
//         }

//         const doc = new jsPDF();
//         const logoWidth = 30;
//         const logoHeight = 15;
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const centerPoint = pageWidth / 2;

//         let currentY = 15;

//         try {
//             const base64Image = await getBase64ImageFromURL(LOGO_URL);
//             const logoX = (pageWidth - logoWidth) / 2;
//             doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight);
//             currentY += logoHeight + 4;
//         } catch (error) {
//             currentY = 15;
//         }

//         doc.setFontSize(14);
//         doc.setFont(undefined, "bold");
//         doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
//         currentY += 6;

//         doc.setFontSize(18);
//         doc.setFont(undefined, "bold");
//         doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
//         currentY += 5;

//         doc.setFontSize(10);
//         doc.setFont(undefined, "normal");
//         doc.text(
//             `Fecha de Exportación: ${day}/${month}/${year}`,
//             centerPoint,
//             currentY,
//             { align: "center" }
//         );
//         currentY += 10;
//         const tableStart = currentY;

//         const tableColumn = [
//             "ID",
//             "Nombre",
//             "Categoría",
//             "Entradas (+)",
//             "Salidas (-)",
//             "Stock Total",
//         ];
//         const tableRows = [];

//         currentItems.forEach((product, index) => {
//             const stock = product.entradas - product.salidas;
//             const productData = [
//                 index + 1,
//                 shortenText(product.name, 20),
//                 product.category,
//                 product.entradas,
//                 product.salidas,
//                 stock,
//             ];
//             tableRows.push(productData);
//         });

//         doc.autoTable({
//             head: [tableColumn],
//             body: tableRows,
//             startY: tableStart,
//             headStyles: {
//                 fillColor: [20, 100, 170],
//                 textColor: 255,
//                 fontStyle: "bold",
//             },
//             theme: "striped",
//             alternateRowStyles: { fillColor: [240, 240, 240] },
//             didParseCell: function (data) {
//                 if (data.column.index === 5) {
//                     const stockValue = parseFloat(data.cell.text[0]);
//                     // Lógica de color de PDF: stock <= 0 es rojo/naranja
//                     if (stockValue <= 0) {
//                         data.cell.styles.fillColor = [255, 153, 0];
//                         data.cell.styles.textColor = [255, 255, 255];
//                     }
//                 }
//             },
//             didDrawPage: function (data) {
//                 doc.setFontSize(10);
//                 doc.text(
//                     "Página " + doc.pageNumber,
//                     data.settings.margin.left,
//                     doc.internal.pageSize.height - 10
//                 );
//             },
//         });

//         doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
//     };
    
//     const delProduct = async (id) => {
//         await dispatch(deleteProduct(id));
//         const fetchMode =
//             userRole === "admin" || userRole === "invitado" ? "all" : "own";
//         await dispatch(getProducts(fetchMode));
//     };

//     const confirmDelate = (id) => {
//         if (userRole !== "admin") {
//             confirmAlert({
//                 title: "Acceso Denegado",
//                 message: "Solo los administradores pueden eliminar productos.",
//                 buttons: [{ label: "Aceptar" }],
//             });
//             return;
//         }

//         confirmAlert({
//             title: "Eliminar Producto",
//             message: "¿Estás seguro que quieres eliminar este producto?",
//             buttons: [
//                 {
//                     label: "Eliminar",
//                     onClick: () => delProduct(id),
//                 },
//                 {
//                     label: "Cancelar",
//                 },
//             ],
//         });
//     };

//     const [currentItems, setCurrentItems] = useState([]);
//     const [pageCount, setPageCount] = useState(0);
//     const [itemOffice, setItemOffice] = useState(0);
//     const itemPerPage = 100;

//     useEffect(() => {
//         const endOffSet = itemOffice + itemPerPage;

//         setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
//         setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
//     }, [itemOffice, itemPerPage, filteredProduct]);

//     const handlePageClick = (event) => {
//         const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
//         setItemOffice(newOffset);
//     };

//     useEffect(() => {
//         const fetchMode =
//             userRole === "admin" || userRole === "invitado" ? "all" : "own";

//         dispatch(getProducts(fetchMode));
//     }, [dispatch, userRole]);
    
//     useEffect(() => {
//         dispatch(FILTER_PRODUCTS({ products, search }));
//     }, [products, search, dispatch]);

//     // --- Renderizado Modificado ---
//     return (
//         <div>
//             <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"> 
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-4 border-blue-500 pb-1">
//                         Inventario
//                     </h2>
//                     <span>
//                         <Search
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                     </span>
//                 </div>
                

//                 <InventorySummaryCard />

//                 {isLoading && <Loader />}
                
//                 <div className="mt-3">
//                     {!isLoading && products.length === 0 ? (
//                         <div className="p-6 bg-white rounded-xl shadow-lg">
//                             <p className="text-gray-600 font-medium">
//                                 -- No hay Productos en la Lista. Por favor agrega un producto para almacenarlo...
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* === VISTA DE ESCRITORIO (md:block) === */}
//                             <div className="hidden md:block">
//                                 <table className="w-full border border-blue-400 rounded-lg overflow-hidden bg-white shadow-lg">
//                                     {/* Encabezado para Escritorio */}
//                                     <thead className="bg-blue-600 text-white shadow-md">
//                                         <tr className="grid grid-cols-7 text-lg text-left">
//                                             <th className="pl-4 py-3">ID</th>
//                                             <th className="py-3">Nombre</th>
//                                             <th className="py-3">Categoria</th>
//                                             <th className="py-3 text-center">Entradas</th>
//                                             <th className="py-3 text-center">Salidas</th>
//                                             <th className="py-3 text-center">Stock</th>
//                                             <th className="py-3 text-center">Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="w-full divide-y divide-gray-200">
//                                         {currentItems.map((product, index) => {
//                                             const { _id, name, category, entradas, salidas } = product;
//                                             const stock = entradas - salidas;

//                                             const canEditOrDelete = userRole === "admin" || userRole === "usuario";
//                                             const canDelete = userRole === "admin";
//                                             // LÓGICA DE COLOR CORREGIDA (Rojo solo si stock <= 0)
//                                             const stockColor = stock <= 0 ? "text-red-600 font-bold" : "text-green-600 font-bold";

//                                             return (
//                                                 <tr
//                                                     key={_id}
//                                                     className="grid grid-cols-7 text-base hover:bg-blue-50 transition duration-150"
//                                                 >
//                                                     <td className="py-3 pl-4">{index + 1}</td>
//                                                     <td className="py-3">{shortenText(name, 10)}</td>
//                                                     <td className="py-3">{shortenText(category, 10)}</td>
//                                                     <td className="py-3 text-center">{entradas}</td>
//                                                     <td className="py-3 text-center">{salidas}</td>
//                                                     <td className={`py-3 text-center ${stockColor}`}>{stock}</td>
//                                                     <motion.td
//                                                         className="flex justify-center items-center space-x-3 py-2"
//                                                     >
//                                                         <Link to={`/product-detail/${_id}`}>
//                                                             <AiFillEye className="text-2xl text-purple-500 hover:text-purple-700 transition" />
//                                                         </Link>
//                                                         {canEditOrDelete && (
//                                                             <Link to={`/edit-product/${_id}`}>
//                                                                 <BiEditAlt className="text-2xl text-green-500 hover:text-green-700 transition" />
//                                                             </Link>
//                                                         )}
//                                                         {canDelete && (
//                                                             <button onClick={() => confirmDelate(_id)}>
//                                                                 <AiTwotoneDelete className="text-2xl text-red-500 hover:text-red-700 transition" />
//                                                             </button>
//                                                         )}
//                                                     </motion.td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* === VISTA DE MÓVIL (md:hidden) === */}
//                             <div className="md:hidden pt-4">
//                                 {currentItems.map((product, index) => (
//                                     <MobileProductCard 
//                                         key={product._id} 
//                                         product={product} 
//                                         index={index} 
//                                         shortenText={shortenText} 
//                                         confirmDelate={confirmDelate} 
//                                         userRole={userRole} 
//                                     />
//                                 ))}
//                             </div>
//                         </>
//                     )}
                    
//                     <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
//                         {/* Botones de Exportación con estilo más limpio y profesional */}
//                         <motion.button
//                             whileTap={{ scale: 0.95 }}
//                             className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
//                             onClick={ExportToExcel}
//                         >
//                             Exportar a Excel <SiMicrosoftexcel className="text-xl" />
//                         </motion.button>
//                         <motion.button
//                             whileTap={{ scale: 0.95 }}
//                             className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
//                             onClick={ExportToPDF}
//                         >
//                             Exportar a PDF
//                         </motion.button>
//                     </div>
                    
//                     {/* Paginación */}
//                     <div className="flex justify-center items-center mt-10">
//                         {currentItems.length > 0 && (
//                             <ReactPaginate
//                                 breakLabel="..."
//                                 nextLabel="Siguiente >"
//                                 onPageChange={handlePageClick}
//                                 pageRangeDisplayed={3}
//                                 marginPagesDisplayed={2}
//                                 pageCount={pageCount}
//                                 previousLabel="< Anterior"
//                                 renderOnZeroPageCount={null}
//                                 containerClassName="flex justify-center items-center space-x-2 text-md sm:text-lg"
//                                 activeClassName="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-lg"
//                                 pageClassName="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-blue-100 transition"
//                                 previousClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
//                                 nextClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
//                                 disabledClassName="text-gray-400 cursor-not-allowed hover:bg-white"
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductList;



import React, { useEffect, useState } from "react";
import Search from "../../../search/Search";
import Loader from "../../../Util/Loader";
import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import "react-confirm-alert/src/react-confirm-alert.css";
import InventorySummaryCard from "../../Inventario/InventorySummaryCard"
import { motion } from "framer-motion";
import {
    deleteProduct,
    getProducts,
} from "../../../features/product/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    FILTER_PRODUCTS,
    selectFilteredProduct,
} from "../../../features/filter/FilterSearch";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF);

// =======================================================
// 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// =======================================================
const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
const LOGO_URL = "";

// Selector para obtener el objeto de usuario y manejar el rol inicial
const selectAuthUser = (state) => state.auth.user; 

// =======================================================
// 💎 COMPONENTE: Card Móvil Avanzada y Profesional
// =======================================================
const MobileProductCard = ({ product, index, shortenText, confirmDelate, userRole }) => {
    const { _id, name, category, entradas, salidas } = product;
    const stock = entradas - salidas;

    const canEditOrDelete = userRole === "admin" || userRole === "usuario";
    const canDelete = userRole === "admin";
    
    // ESTILOS DE STOCK CORREGIDOS (Rojo solo si <= 0)
    const stockBg = stock > 5 
        ? "bg-green-100 text-green-800" // Stock OK (> 5): Verde suave
        : stock > 0 ? "bg-yellow-100 text-yellow-800" // Stock Bajo (1-5): Amarillo
        : "bg-red-100 text-red-800"; // Agotado/Negativo (<= 0): Rojo

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="mb-6 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 w-full hover:shadow-2xl transition duration-300"
        >
            {/* 1. Encabezado / Título */}
            <div className="flex justify-between items-center mb-3">
                {/* Nombre del Producto (Audaz y visible) */}
                <h3 className="text-xl font-extrabold text-blue-800 break-words max-w-[80%]">
                    {shortenText(name, 10)}
                </h3>
                {/* ID/Index (Chip moderno) */}
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 shadow-sm">
                    #{index + 1}
                </span>
            </div>
            
            {/* 2. Detalles Clave (Dos columnas profesionales) */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                {/* Categoría */}
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Categoría</p>
                    <p className="text-lg font-semibold text-gray-700">
                        {shortenText(category, 7)}
                    </p>
                </div>
                
                {/* Stock Total (Foco visual) */}
                <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase">Stock Total</p>
                    <span className={`inline-flex items-center justify-center h-10 px-4 mt-1 text-2xl font-bold rounded-lg shadow-inner ${stockBg}`}>
                        {stock}
                    </span>
                </div>
            </div>
            
            {/* 3. Acciones (Iconos grandes y centrados) */}
            <div className="flex justify-around items-center pt-4 mt-1">
                
                {/* Ver Detalles */}
                <Link to={`/product-detail/${_id}`} className="flex flex-col items-center hover:bg-purple-50 p-2 rounded-lg transition group">
                    <AiFillEye className="text-3xl text-purple-500 group-hover:text-purple-700 transition duration-150" />
                    <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Ver</span>
                </Link>
                
                {/* Editar */}
                {canEditOrDelete && (
                    <Link to={`/edit-product/${_id}`} className="flex flex-col items-center hover:bg-green-50 p-2 rounded-lg transition group">
                        <BiEditAlt className="text-3xl text-green-500 group-hover:text-green-700 transition duration-150" />
                        <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Editar</span>
                    </Link>
                )}
                
                {/* Eliminar */}
                {canDelete && (
                    <button
                        onClick={() => confirmDelate(_id)}
                        className="flex flex-col items-center hover:bg-red-50 p-2 rounded-lg transition group"
                    >
                        <AiTwotoneDelete className="text-3xl text-red-500 group-hover:text-red-700 transition duration-150" />
                        <span className="text-xs mt-1 text-gray-600 group-hover:font-semibold">Eliminar</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};
// =======================================================
// FIN: COMPONENTE DE CARD AVANZADA
// =======================================================


const ProductList = ({ products, isLoading }) => {
    // 1. Obtención de datos de autenticación
    const user = useSelector(selectAuthUser);
    const userRole = user?.role?.toLowerCase() || "invitado";
    const userId = user?.uid; // <--- OBTENEMOS EL ID DEL USUARIO PARA EL FILTRO

    const [search, setSearch] = useState("");
    const filteredProduct = useSelector(selectFilteredProduct);
    const dispatch = useDispatch();

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const shortenText = (text, n) => {
        if (text.length > n) {
            const shortenedText = text.substring(0, n).concat("...");
            return shortenedText;
        }
        return text;
    };

    const showExportError = (title, message) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [{ label: "Aceptar" }],
        });
    };

    // Usando una solución temporal para evitar el error de Canvas/document en entornos no-browser
    const getBase64ImageFromURL = (url) => {
        return new Promise((resolve, reject) => {
            if (typeof document === 'undefined') {
                // Simulación en un entorno que no es un navegador (SSR, etc.)
                console.warn("Función de PDF: El entorno no soporta Canvas. Se omite la imagen.");
                return resolve(""); 
            }
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };
    
    const ExportToExcel = () => {
        if (currentItems.length === 0) {
            showExportError(
                "No hay datos visibles",
                "La lista actual está vacía. Verifica la búsqueda o la paginación."
            );
            return;
        }

        const excelData = currentItems.map((product, index) => ({
            ID: index + 1,
            "Nombre del Producto": product.name,
            Categoría: product.category,
            "Entradas (+)": product.entradas,
            "Salidas (-)": product.salidas,
            "STOCK TOTAL": product.entradas - product.salidas,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([]);

        const HEADER_ROW = 6;
        const DATA_START_ROW = HEADER_ROW + 1;
        const lastColIndex = 5;
        const lastDataRow = DATA_START_ROW + excelData.length - 1;
        const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

        const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } };
        const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } };
        const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } };
        const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } };

        XLSX.utils.sheet_add_aoa(ws, [
            [COMPANY_NAME],
            [INVENTORY_DETAIL],
            [`Fecha de Reporte: ${day}/${month}/${year}`],
            [""],
            [""],
        ], { origin: "A1" });

        [
            { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
            { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
            { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
        ].forEach(({ row, text, style }) => {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
            ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
            ws[cellAddress].v = text;
            ws[cellAddress].s = style;
        });

        if (!ws["!merges"]) ws["!merges"] = [];
        for (let i = 0; i < 3; i++) {
            ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
        }

        XLSX.utils.sheet_add_json(ws, excelData, {
            origin: `A${HEADER_ROW + 1}`,
            skipHeader: false,
        });

        const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
        headerKeys.forEach((key, C) => {
            const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
            if (ws[cellAddress]) {
                ws[cellAddress].s = styleTableHeader;
            }
        });

        for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
            for (let C = 0; C <= lastColIndex; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

                    if (C === 5 && ws[cellAddress].v <= 5) {
                        ws[cellAddress].s = {
                            ...ws[cellAddress].s,
                            fill: { fgColor: { rgb: "FEE2E2" } },
                            font: { color: { rgb: "DC2626" }, bold: true },
                        };
                    }
                    if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
                        ws[cellAddress].s.numFmt = '#,##0'; 
                    }
                }
            }
        }

        const summaryRow = lastDataRow + 1;
        const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 });
        ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } };

        for (let C = 3; C <= lastColIndex; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
            const colLetter = XLSX.utils.encode_col(C);
            
            ws[cellAddress] = {
                t: 'f',
                f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
                s: styleSummary,
            };
        }
        
        ws["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: HEADER_ROW, c: 0 },
                e: { r: lastDataRow, c: lastColIndex },
            }),
        };

        const wscols = [
            { wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
        ];
        ws["!cols"] = wscols;
        ws["!ref"] = range;

        XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
        XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
    };

    const ExportToPDF = async () => {
        if (isLoading || currentItems.length === 0) {
            showExportError(
                "Datos no disponibles",
                "La lista está vacía o cargando. No se puede exportar."
            );
            return;
        }

        const doc = new jsPDF();
        const logoWidth = 30;
        const logoHeight = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerPoint = pageWidth / 2;

        let currentY = 15;

        try {
            const base64Image = await getBase64ImageFromURL(LOGO_URL);
            if (base64Image) {
                const logoX = (pageWidth - logoWidth) / 2;
                doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight);
                currentY += logoHeight + 4;
            } else {
                currentY = 15;
            }
        } catch (error) {
            currentY = 15;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
        currentY += 6;

        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
        currentY += 5;

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(
            `Fecha de Exportación: ${day}/${month}/${year}`,
            centerPoint,
            currentY,
            { align: "center" }
        );
        currentY += 10;
        const tableStart = currentY;

        const tableColumn = [
            "ID",
            "Nombre",
            "Categoría",
            "Entradas (+)",
            "Salidas (-)",
            "Stock Total",
        ];
        const tableRows = [];

        currentItems.forEach((product, index) => {
            const stock = product.entradas - product.salidas;
            const productData = [
                index + 1,
                shortenText(product.name, 20),
                product.category,
                product.entradas,
                product.salidas,
                stock,
            ];
            tableRows.push(productData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: tableStart,
            headStyles: {
                fillColor: [20, 100, 170],
                textColor: 255,
                fontStyle: "bold",
            },
            theme: "striped",
            alternateRowStyles: { fillColor: [240, 240, 240] },
            didParseCell: function (data) {
                if (data.column.index === 5) {
                    const stockValue = parseFloat(data.cell.text[0]);
                    // Lógica de color de PDF: stock <= 0 es rojo/naranja
                    if (stockValue <= 0) {
                        data.cell.styles.fillColor = [255, 153, 0];
                        data.cell.styles.textColor = [255, 255, 255];
                    }
                }
            },
            didDrawPage: function (data) {
                doc.setFontSize(10);
                doc.text(
                    "Página " + doc.pageNumber,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
            },
        });

        doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
    };
    
    const delProduct = async (id) => {
        await dispatch(deleteProduct(id));
        
        // Determinar el modo de recarga
        const fetchMode = {
            mode: userRole === "admin" || userRole === "invitado" ? "all" : "own",
            userId: userRole === "own" ? userId : undefined, 
        };
        
        await dispatch(getProducts(fetchMode));
    };

    const confirmDelate = (id) => {
        if (userRole !== "admin") {
            confirmAlert({
                title: "Acceso Denegado",
                message: "Solo los administradores pueden eliminar productos.",
                buttons: [{ label: "Aceptar" }],
            });
            return;
        }

        confirmAlert({
            title: "Eliminar Producto",
            message: "¿Estás seguro que quieres eliminar este producto?",
            buttons: [
                {
                    label: "Eliminar",
                    onClick: () => delProduct(id),
                },
                {
                    label: "Cancelar",
                },
            ],
        });
    };

    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffice, setItemOffice] = useState(0);
    const itemPerPage = 100;

    useEffect(() => {
        const endOffSet = itemOffice + itemPerPage;

        setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
        setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
    }, [itemOffice, itemPerPage, filteredProduct]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
        setItemOffice(newOffset);
    };

    // 🛑 ESTE ES EL USEEFFECT CORREGIDO 🛑
    useEffect(() => {
        const fetchMode = 
            userRole === "admin" || userRole === "invitado" ? "all" : "own";
        
        // 🚨 CONDICIÓN DE CARGA SEGURA 🚨
        // Ejecutar si: 1) El modo es 'all' (no necesita userId) O 2) El modo es 'own' Y el userId está disponible
        if (fetchMode === "all" || (fetchMode === "own" && userId)) {
             
            // Se asume que getProducts espera un objeto { mode, userId }
            dispatch(getProducts({ 
                mode: fetchMode, 
                userId: fetchMode === "own" ? userId : undefined 
            }));

        } else if (fetchMode === "own" && !userId) {
            // Este es el caso donde salía la advertencia. 
            // Ahora, simplemente esperamos a que el userId esté listo.
            console.log("Esperando userId para cargar productos propios...");
        }

    }, [dispatch, userRole, userId]); // Ahora userId es una dependencia clave
    
    useEffect(() => {
        dispatch(FILTER_PRODUCTS({ products, search }));
    }, [products, search, dispatch]);

    // --- Renderizado Modificado ---
    return (
        <div>
            {/* Usando Tailwind como preferiste */}
            <div className="px-4 py-6 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"> 
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-4 border-blue-500 pb-1">
                        Inventario
                    </h2>
                    <span>
                        <Search
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </span>
                </div>
            
                
                {isLoading && <Loader />}
                
                <div className="mt-3">
                    {!isLoading && products.length === 0 ? (
                        <div className="p-6 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-600 font-medium">
                                -- No hay Productos en la Lista. Por favor agrega un producto para almacenarlo...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* === VISTA DE ESCRITORIO (md:block) === */}
                            <div className="hidden md:block">
                                <table className="w-full border border-blue-400 rounded-lg overflow-hidden bg-white shadow-lg">
                                    {/* Encabezado para Escritorio */}
                                    <thead className="bg-blue-600 text-white shadow-md">
                                        <tr className="grid grid-cols-7 text-lg text-left">
                                            <th className="pl-4 py-3">ID</th>
                                            <th className="py-3">Nombre</th>
                                            <th className="py-3">Categoria</th>
                                            <th className="py-3 text-center">Entradas</th>
                                            <th className="py-3 text-center">Salidas</th>
                                            <th className="py-3 text-center">Stock</th>
                                            <th className="py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="w-full divide-y divide-gray-200">
                                        {currentItems.map((product, index) => {
                                            const { _id, name, category, entradas, salidas } = product;
                                            const stock = entradas - salidas;

                                            const canEditOrDelete = userRole === "admin" || userRole === "usuario";
                                            const canDelete = userRole === "admin";
                                            // LÓGICA DE COLOR CORREGIDA (Rojo solo si stock <= 0)
                                            const stockColor = stock <= 0 ? "text-red-600 font-bold" : "text-green-600 font-bold";

                                            return (
                                                <tr
                                                    key={_id}
                                                    className="grid grid-cols-7 text-base hover:bg-blue-50 transition duration-150"
                                                >
                                                    <td className="py-3 pl-4">{index + 1}</td>
                                                    <td className="py-3">{shortenText(name, 10)}</td>
                                                    <td className="py-3">{shortenText(category, 10)}</td>
                                                    <td className="py-3 text-center">{entradas}</td>
                                                    <td className="py-3 text-center">{salidas}</td>
                                                    <td className={`py-3 text-center ${stockColor}`}>{stock}</td>
                                                    <motion.td
                                                        className="flex justify-center items-center space-x-3 py-2"
                                                    >
                                                        <Link to={`/product-detail/${_id}`}>
                                                            <AiFillEye className="text-2xl text-purple-500 hover:text-purple-700 transition" />
                                                        </Link>
                                                        {canEditOrDelete && (
                                                            <Link to={`/edit-product/${_id}`}>
                                                                <BiEditAlt className="text-2xl text-green-500 hover:text-green-700 transition" />
                                                            </Link>
                                                        )}
                                                        {canDelete && (
                                                            <button onClick={() => confirmDelate(_id)}>
                                                                <AiTwotoneDelete className="text-2xl text-red-500 hover:text-red-700 transition" />
                                                            </button>
                                                        )}
                                                    </motion.td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* === VISTA DE MÓVIL (md:hidden) === */}
                            <div className="md:hidden pt-4">
                                {currentItems.map((product, index) => (
                                    <MobileProductCard 
                                        key={product._id} 
                                        product={product} 
                                        index={index} 
                                        shortenText={shortenText} 
                                        confirmDelate={confirmDelate} 
                                        userRole={userRole} 
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    
                    <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
                        {/* Botones de Exportación con estilo más limpio y profesional */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
                            onClick={ExportToExcel}
                        >
                            Exportar a Excel <SiMicrosoftexcel className="text-xl" />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
                            onClick={ExportToPDF}
                        >
                            Exportar a PDF
                        </motion.button>
                    </div>
                    
                    {/* Paginación */}
                    <div className="flex justify-center items-center mt-10">
                        {currentItems.length > 0 && (
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Siguiente >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={pageCount}
                                previousLabel="< Anterior"
                                renderOnZeroPageCount={null}
                                containerClassName="flex justify-center items-center space-x-2 text-md sm:text-lg"
                                activeClassName="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold shadow-lg"
                                pageClassName="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-blue-100 transition"
                                previousClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
                                nextClassName="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
                                disabledClassName="text-gray-400 cursor-not-allowed hover:bg-white"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;