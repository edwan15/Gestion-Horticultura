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
// // IMPORTANTE: Selector para obtener el rol del usuario
// const selectUser = (state) => state.auth.user || { role: "invitado" };
// // =======================================================

// const ProductList = ({ products, isLoading }) => {
//   // CLAVE 1: Obtener el rol real del usuario desde Redux
//   const user = useSelector(selectUser);
//   const userRole = user?.role?.toLowerCase() || "invitado"; // Asegura que el rol sea minúsculas o "invitado" por defecto

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

//   const ExportToExcel = () => {
//     // Comprobación de datos antes de exportar
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
//       "STOCK TOTAL": product.entradas - product.salidas, // Stock Calculado
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([]);
//     XLSX.utils.sheet_add_aoa(ws, [["[PEGAR LOGO DE LA EMPRESA AQUÍ]"]], {
//       origin: "A1",
//     });
//     XLSX.utils.sheet_add_aoa(ws, [["EMPRESA EJEMPLO S.A. DE C.V."]], {
//       origin: "A2",
//     });
//     XLSX.utils.sheet_add_aoa(ws, [["REPORTE DE INVENTARIO GENERAL"]], {
//       origin: "A3",
//     });
//     XLSX.utils.sheet_add_aoa(
//       ws,
//       [[`Fecha de Reporte: ${day}/${month}/${year}`]],
//       { origin: "A4" }
//     );

//     if (!ws["!merges"]) ws["!merges"] = [];
//     ws["!merges"].push(
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }
//     );

//     XLSX.utils.sheet_add_json(ws, excelData, {
//       origin: "A7",
//       skipHeader: false,
//     });

//     const range = XLSX.utils.decode_range(ws["!ref"]);
//     const headerRowIndex = 6;
//     const lastColIndex = 5;

//     for (let C = 0; C <= lastColIndex; ++C) {
//       const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
//       if (ws[cellAddress]) {
//         ws[cellAddress].s = { font: { bold: true } };
//       }
//     }

//     const lastDataRow = range.e.r;
//     ws["!autofilter"] = {
//       ref: XLSX.utils.encode_range({
//         s: { r: headerRowIndex, c: 0 },
//         e: { r: lastDataRow, c: lastColIndex },
//       }),
//     };

//     const wscols = [
//       { wch: 5 }, // A: ID
//       { wch: 15 }, // B: Nombre del Producto
//       { wch: 15 }, // C: Categoría
//       { wch: 12 }, // D: Entradas (+)
//       { wch: 12 }, // E: Salidas (-)
//       { wch: 15 }, // F: STOCK TOTAL
//     ];
//     ws["!cols"] = wscols;

//     XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");

//     XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//   };

// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// // URL de la imagen de tu empresa (Ejemplo de logo de una nube)
// // **¡IMPORTANTE!** Reemplaza esta URL con la URL de tu logo real.
// const LOGO_URL = "data:image/png;base64,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"
//   const getBase64ImageFromURL = (url) => {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = 'Anonymous';
//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(img, 0, 0);
//             const dataURL = canvas.toDataURL('image/png'); // O 'image/jpeg'
//             resolve(dataURL);
//         };
//         img.onerror = (error) => reject(error);
//         img.src = url;
//     });
// };

// const ExportToPDF = async () => {
//     // 1. Verificación de carga y datos
//     if (isLoading || currentItems.length === 0) {
//         showExportError(
//             "Datos no disponibles",
//             "La lista está vacía o cargando. No se puede exportar."
//         );
//         return;
//     }

//     const doc = new jsPDF();
//     const marginX = 14;
//     const logoWidth = 30; // Ancho del logo, usado para centrar

//     // Calcula el punto medio de la página para centrar el texto.
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const centerPoint = pageWidth / 2; // X donde se centrará el texto

//     try {
//         // --- 1. Preparar la Imagen del Header (Logo) ---
//         const base64Image = await getBase64ImageFromURL(LOGO_URL);

//         // La imagen permanece a la izquierda (X=14, Y=15)
//         doc.addImage(base64Image, 'PNG', marginX, 15, logoWidth, 15);

//         // --- 2. Dibujar el Header (Texto) Centrado ---

//         // Nombre de la Empresa
//         doc.setFontSize(14);
//         doc.setFont(undefined, 'bold');
//         // Usamos centerPoint y { align: 'center' }
//         doc.text(COMPANY_NAME, centerPoint, 19, { align: 'center' });

//         // Detalles de Inventario (Título del Reporte)
//         doc.setFontSize(18);
//         doc.setFont(undefined, 'bold');
//         // Usamos centerPoint y { align: 'center' }
//         doc.text(INVENTORY_DETAIL, centerPoint, 27, { align: 'center' });

//         // Fecha de Exportación
//         doc.setFontSize(10);
//         doc.setFont(undefined, 'normal');
//         // Usamos centerPoint y { align: 'center' }
//         doc.text(`Fecha de Exportación: ${day}/${month}/${year}`, centerPoint, 32, { align: 'center' });

//     } catch (error) {
//         // console.error("Error al cargar o añadir la imagen del logo:", error);
//         // Si falla la imagen, al menos pon el texto en la posición por defecto (izquierda)
//         doc.setFontSize(14);
//         doc.setFont(undefined, 'bold');
//         doc.text(COMPANY_NAME, marginX, 15);

//         doc.setFontSize(18);
//         doc.text(INVENTORY_DETAIL, marginX, 22);

//         doc.setFontSize(10);
//         doc.setFont(undefined, 'normal');
//         doc.text(`Fecha de Exportación: ${day}/${month}/${year}`, marginX, 27);
//     }

//     // Altura donde comenzará la tabla, debajo del header
//     const tableStart = 45;

//     const tableColumn = [
//         "ID",
//         "Nombre",
//         "Categoría",
//         "Entradas (+)",
//         "Salidas (-)",
//         "Stock Total",
//     ];
//     const tableRows = [];

//     currentItems.forEach((product, index) => {
//         const stock = product.entradas - product.salidas;
//         const productData = [
//             index + 1,
//             shortenText(product.name, 20),
//             product.category,
//             product.entradas,
//             product.salidas,
//             stock, // Valor de stock calculado
//         ];
//         tableRows.push(productData);
//     });

//     doc.autoTable({
//         head: [tableColumn],
//         body: tableRows,
//         startY: tableStart, // Inicia después del header
//         headStyles: {
//             fillColor: [20, 100, 170],
//             textColor: 255,
//             fontStyle: "bold",
//         },
//         theme: "striped",
//         alternateRowStyles: { fillColor: [240, 240, 240] },
//         didParseCell: function (data) {
//             if (data.column.index === 5) {
//                 const stockValue = parseFloat(data.cell.text[0]);
//                 if (stockValue <= 0) {
//                     data.cell.styles.fillColor = [255, 153, 0];
//                     data.cell.styles.textColor = [255, 255, 255];
//                 }
//             }
//         },
//         didDrawPage: function (data) {
//             doc.setFontSize(10);
//             doc.text(
//                 "Página " + doc.pageNumber,
//                 data.settings.margin.left,
//                 doc.internal.pageSize.height - 10
//             );
//         },
//     });

//     doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
// };

// //   const ExportToPDF = async () => { // **IMPORTANTE: Ahora es async**
// //     // 1. Verificación de carga y datos
// //     if (isLoading) {
// //         showExportError(
// //             "Cargando Datos",
// //             "Espera a que los productos terminen de cargar antes de exportar."
// //         );
// //         return;
// //     }
// //     if (currentItems.length === 0) {
// //         showExportError(
// //             "No hay datos visibles",
// //             "La lista actual está vacía. Verifica la búsqueda o la paginación."
// //         );
// //         return;
// //     }

// //     const doc = new jsPDF();
// //     const marginX = 14; // Margen X izquierdo para el texto
// //     let startY = 15;    // Posición Y inicial

// //     try {
// //         // --- 1. Preparar la Imagen del Header (Logo) ---
// //         const base64Image = await getBase64ImageFromURL(LOGO_URL);

// //         // El tamaño de la imagen es clave. Aquí usamos 30x15mm.
// //         doc.addImage(base64Image, 'PNG', marginX, startY, 30, 15);

// //         // Ajustar startY para el texto después de la imagen
// //         startY += 20;

// //         // --- 2. Dibujar el Header (Texto) ---

// //         // Nombre de la Empresa
// //         doc.setFontSize(14);
// //         doc.setFont(undefined, 'bold'); // Establecer negrita
// //         doc.text(COMPANY_NAME, 50, 19); // Mover el texto a la derecha de la imagen

// //         // Detalles de Inventario (Título del Reporte)
// //         doc.setFontSize(18);
// //         doc.setFont(undefined, 'bold');
// //         doc.text(INVENTORY_DETAIL, 50, 27);

// //         // Fecha de Exportación
// //         doc.setFontSize(10);
// //         doc.setFont(undefined, 'normal'); // Volver a normal
// //         doc.text(`Fecha de Exportación: ${day}/${month}/${year}`, 50, 32);

// //     } catch (error) {
// //         console.error("Error al cargar o añadir la imagen del logo:", error);
// //         // Si falla la imagen, al menos pon el texto en la posición por defecto
// //         doc.setFontSize(14);
// //         doc.setFont(undefined, 'bold');
// //         doc.text(COMPANY_NAME, marginX, startY);
// //         startY += 5;

// //         doc.setFontSize(18);
// //         doc.text(INVENTORY_DETAIL, marginX, startY);
// //         startY += 5;

// //         doc.setFontSize(10);
// //         doc.setFont(undefined, 'normal');
// //         doc.text(`Fecha de Exportación: ${day}/${month}/${year}`, marginX, startY);
// //         startY += 5;
// //     }

// //     // Altura donde comenzará la tabla, debajo del header
// //     const tableStart = 45;

// //     const tableColumn = [
// //         "ID",
// //         "Nombre",
// //         "Categoría",
// //         "Entradas (+)",
// //         "Salidas (-)",
// //         "Stock Total",
// //     ];
// //     const tableRows = [];

// //     currentItems.forEach((product, index) => {
// //         const stock = product.entradas - product.salidas;
// //         const productData = [
// //             index + 1,
// //             shortenText(product.name, 20),
// //             product.category,
// //             product.entradas,
// //             product.salidas,
// //             stock, // Valor de stock calculado
// //         ];
// //         tableRows.push(productData);
// //     });

// //     doc.autoTable({
// //         head: [tableColumn],
// //         body: tableRows,
// //         startY: tableStart, // Inicia después del header
// //         headStyles: {
// //             fillColor: [20, 100, 170],
// //             textColor: 255,
// //             fontStyle: "bold",
// //         },
// //         theme: "striped",
// //         alternateRowStyles: { fillColor: [240, 240, 240] },
// //         didParseCell: function (data) {
// //             if (data.column.index === 5) {
// //                 const stockValue = parseFloat(data.cell.text[0]);
// //                 if (stockValue <= 0) {
// //                     data.cell.styles.fillColor = [255, 153, 0];
// //                     data.cell.styles.textColor = [255, 255, 255];
// //                 }
// //             }
// //         },
// //         didDrawPage: function (data) {
// //             doc.setFontSize(10);
// //             doc.text(
// //                 "Página " + doc.pageNumber,
// //                 data.settings.margin.left,
// //                 doc.internal.pageSize.height - 10
// //             );
// //         },
// //     });

// //     doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
// // };

//   // const ExportToPDF = () => {
//   //   // 1. Verificación de carga y datos
//   //   if (isLoading) {
//   //     showExportError(
//   //       "Cargando Datos",
//   //       "Espera a que los productos terminen de cargar antes de exportar."
//   //     );
//   //     return;
//   //   }
//   //   if (currentItems.length === 0) {
//   //     showExportError(
//   //       "No hay datos visibles",
//   //       "La lista actual está vacía. Verifica la búsqueda o la paginación."
//   //     );
//   //     return;
//   //   }

//   //   const doc = new jsPDF(); // Añadir Título y Subtítulo
//   //   doc.setFontSize(22);
//   //   doc.text("REPORTE DE INVENTARIO", 14, 15);
//   //   doc.setFontSize(10);
//   //   doc.text(`Generado el: ${day}/${month}/${year}`, 14, 20);

//   //   const tableColumn = [
//   //     "ID",
//   //     "Nombre",
//   //     "Categoría",
//   //     "Entradas (+)",
//   //     "Salidas (-)",
//   //     "Stock Total",
//   //   ];
//   //   const tableRows = [];

//   //   currentItems.forEach((product, index) => {
//   //     const stock = product.entradas - product.salidas;
//   //     const productData = [
//   //       index + 1,
//   //       shortenText(product.name, 20),
//   //       product.category,
//   //       product.entradas,
//   //       product.salidas,
//   //       stock, // Valor de stock calculado
//   //     ];
//   //     tableRows.push(productData);
//   //   });

//   //   doc.autoTable({
//   //     head: [tableColumn],
//   //     body: tableRows,
//   //     startY: 30, // Inicia después del título y subtítulo
//   //     headStyles: {
//   //       fillColor: [20, 100, 170], // Azul oscuro más profesional
//   //       textColor: 255,
//   //       fontStyle: "bold",
//   //     },
//   //     theme: "striped",
//   //     alternateRowStyles: { fillColor: [240, 240, 240] }, // Hook para modificar el estilo de las filas o celdas
//   //     didParseCell: function (data) {
//   //       // Verificar la columna 'Stock Total' (índice 5)
//   //       if (data.column.index === 5) {
//   //         // data.cell.text es un array, tomamos el primer elemento que es el valor de stock
//   //         const stockValue = parseFloat(data.cell.text[0]); // Si el stock es 0 o negativo, resaltar la celda
//   //         if (stockValue <= 0) {
//   //           data.cell.styles.fillColor = [255, 153, 0]; // Naranja para bajo/cero stock
//   //           data.cell.styles.textColor = [255, 255, 255];
//   //         }
//   //       }
//   //     }, // Añadir número de página
//   //     didDrawPage: function (data) {
//   //       doc.setFontSize(10);
//   //       doc.text(
//   //         "Página " + doc.pageNumber,
//   //         data.settings.margin.left,
//   //         doc.internal.pageSize.height - 10
//   //       );
//   //     },
//   //   });

//   //   doc.save(`Inventario-Reporte-Estructurado-${day}-${month}-${year}.pdf`);
//   // };

//   // CLAVE 2: Modificar delProduct para que recargue con el rol correcto

//   const delProduct = async (id) => {
//     await dispatch(deleteProduct(id));

//     // Determinar el modo de recarga después de eliminar (para mantener la vista actual)
//     const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";
//     // Asumimos que getProducts acepta un parámetro para la ruta (o es la ruta por defecto si es 'own')
//     await dispatch(getProducts(fetchMode));
//   };

//   const confirmDelate = (id) => {
//     // Solo Admin puede eliminar. Si el rol fuera 'usuario' solo podría eliminar sus propios productos (lógica en el backend).
//     if (userRole !== "admin" && userRole !== "usuario") {
//       confirmAlert({
//         title: "Acceso Denegado",
//         message: "Solo los administradores pueden eliminar productos.",
//         buttons: [{ label: "Aceptar" }],
//       });
//       return;
//     }

//     confirmAlert({
//       title: "Eliminar Producto",
//       message: "Estás seguro que quieres eliminar este producto",
//       buttons: [
//         {
//           label: "Delete",
//           onClick: () => delProduct(id),
//         },
//         {
//           label: "Cancel",
//         },
//       ],
//     });
//   };

//   // nuevo tema Paginacion

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

//   // CLAVE 3: Modificar useEffect para la carga inicial/recarga
//   useEffect(() => {
//     // 1. Determinamos el modo de carga: 'all' (para Admin e Invitado) o 'own' (para Usuario)
//     const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";

//     // 2. Despachamos la acción getProducts, pasando el modo
//     dispatch(getProducts(fetchMode));

//   }, [dispatch, userRole]);

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
//               -- No hay Productos en la Lista , Por favor agrega un producto
//               para almacenarlo...
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
//                   {/* Se eliminan <th>Ent +</th> y <th>Sal -</th> */}
//                   <th>Stock</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody className=" grid ">
//                 {currentItems.map((product, index) => {
//                   const { _id, name, category, entradas, salidas } = product;

//                   // Controla la visibilidad de los botones de Edición y Eliminación
//                   const canEditOrDelete =
//                     userRole === "admin" || userRole === "usuario";
//                   const canDelete = userRole === "admin";

//                   return (
//                     <tr
//                       key={_id}
//                       // CLASE MODIFICADA: grid-cols-5 para móvil, md:grid-cols-7 para escritorio
//                       className="grid grid-cols-5 md:grid-cols-7 border-solid border-b-2 mb-4 text-lg"
//                     >
//                       <td>{index + 1}</td>
//                       <td>{shortenText(name, 10)}</td>
//                       <td>{shortenText(category, 8)}</td>
//                       {/* CLASE MODIFICADA: Ocultar en móvil, mostrar en md */}
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
//             {/* Botones de Exportación (visibles para todos los que ven la lista) */}
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
//               PDF (Reporte Estructurado)
//               <span className="text-xl">📄</span>
//             </motion.button>
//           </div>
//         </div>
//       </div>
//       <div className="">
//         <ReactPaginate
//           className="flex gap-5 text-xl justify-center items-center "
//           breakLabel="..."
//           nextLabel="Next "
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={3}
//           pageCount={pageCount}
//           previousLabel="Prev"
//           renderOnZeroPageCount={null}
//           containerClassName="pagination"
//           pageLinkClassName="page-num"
//           previousLinkClassName="page-num"
//           nextLinkClassName="page-num"
//           activeLinkClassName="activePage"
//         />
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
// // =======================================================
// const COMPANY_NAME = "FINCA HORTICULTURA-BALSICAS";
// const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
// // **¡IMPORTANTE!** Reemplaza esta URL con la URL de tu logo real en Base64 o accesible.
// const LOGO_URL =
//   "data:image/png;base64,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";

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
//   const dispatch = useDispatch(); // --- Lógica de Fecha ---

//   let date = new Date();
//   let day = date.getDate();
//   let month = date.getMonth() + 1;
//   let year = date.getFullYear(); // --- Funciones de Utilidad ---

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
//   }; // --- Funciones de Exportación ---

//   const ExportToExcel = () => {
//     // Comprobación de datos antes de exportar
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
//       "STOCK TOTAL": product.entradas - product.salidas, // Stock Calculado
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet([]);
//     XLSX.utils.sheet_add_aoa(ws, [["[PEGAR LOGO DE LA EMPRESA AQUÍ]"]], {
//       origin: "A1",
//     });
//     XLSX.utils.sheet_add_aoa(ws, [["EMPRESA EJEMPLO S.A. DE C.V."]], {
//       origin: "A2",
//     });
//     XLSX.utils.sheet_add_aoa(ws, [["REPORTE DE INVENTARIO GENERAL"]], {
//       origin: "A3",
//     });
//     XLSX.utils.sheet_add_aoa(
//       ws,
//       [[`Fecha de Reporte: ${day}/${month}/${year}`]],
//       { origin: "A4" }
//     );

//     if (!ws["!merges"]) ws["!merges"] = [];
//     ws["!merges"].push(
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }
//     );

//     XLSX.utils.sheet_add_json(ws, excelData, {
//       origin: "A7",
//       skipHeader: false,
//     });

//     const range = XLSX.utils.decode_range(ws["!ref"]);
//     const headerRowIndex = 6;
//     const lastColIndex = 5;

//     for (let C = 0; C <= lastColIndex; ++C) {
//       const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
//       if (ws[cellAddress]) {
//         ws[cellAddress].s = { font: { bold: true } };
//       }
//     }

//     const lastDataRow = range.e.r;
//     ws["!autofilter"] = {
//       ref: XLSX.utils.encode_range({
//         s: { r: headerRowIndex, c: 0 },
//         e: { r: lastDataRow, c: lastColIndex },
//       }),
//     };

//     const wscols = [
//       { wch: 5 }, // A: ID
//       { wch: 15 }, // B: Nombre del Producto
//       { wch: 15 }, // C: Categoría
//       { wch: 12 }, // D: Entradas (+)
//       { wch: 12 }, // E: Salidas (-)
//       { wch: 15 }, // F: STOCK TOTAL
//     ];
//     ws["!cols"] = wscols;

//     XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");

//     XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
//   };

//   // CLAVE 2: ExportToPDF Modificada para centrado dinámico del encabezado
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
//   }; // CLAVE 3: delProduct: Recarga con el modo correcto

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
//   }; // --- Lógica de Paginación ---

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
//   }; // CLAVE 4: useEffect para la carga inicial/recarga basada en el rol

//   useEffect(() => {
//     // Modo de carga: 'all' (Admin, Invitado) o 'own' (Usuario)
//     const fetchMode =
//       userRole === "admin" || userRole === "invitado" ? "all" : "own";

//     dispatch(getProducts(fetchMode));
//   }, [dispatch, userRole]); // --- Efecto para el Filtrado por Búsqueda ---

//   useEffect(() => {
//     dispatch(FILTER_PRODUCTS({ products, search }));
//   }, [products, search, dispatch]); // --- Renderizado ---

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

// export default ProductList;



import React, { useEffect, useState } from "react";
import Search from "../../../search/Search";
import Loader from "../../../Util/Loader";
import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import "react-confirm-alert/src/react-confirm-alert.css";
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
// **¡IMPORTANTE!** Reemplaza esta URL con la URL de tu logo real en Base64 o accesible.
const LOGO_URL =
  "data:image/png;base64,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";

// =======================================================
// Selector para obtener el rol del usuario desde Redux
// =======================================================
const selectUser = (state) => state.auth.user || { role: "invitado" };

const ProductList = ({ products, isLoading }) => {
  // CLAVE 1: Obtener el rol real del usuario desde Redux
  const user = useSelector(selectUser);
  const userRole = user?.role?.toLowerCase() || "invitado"; // Asegura que el rol sea minúsculas o "invitado" por defecto

  const [search, setSearch] = useState("");
  const filteredProduct = useSelector(selectFilteredProduct);
  const dispatch = useDispatch();
  // --- Lógica de Fecha ---
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // --- Funciones de Utilidad ---
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

  const getBase64ImageFromURL = (url) => {
    // NOTA: Esta función requiere que la imagen esté en el mismo dominio o tenga CORS habilitado
    // Como tu `LOGO_URL` es Base64, esto es solo una precaución.
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        // Petición del usuario: "elimíname los espacios invisibles en todos los códigos que me generes"
        // No se utiliza canvas en la exportación a Excel (XLSX). En PDF (jsPDF) se mantiene la lógica de imagen.
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
  
  // --- Funciones de Exportación ---

  const ExportToExcel = () => {
    // Comprobación de datos antes de exportar
    if (currentItems.length === 0) {
      showExportError(
        "No hay datos visibles",
        "La lista actual está vacía. Verifica la búsqueda o la paginación."
      );
      return;
    }

    // 1. Preparación de datos y adición del Stock Calculado
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

    // =================================================================
    // 2. ESTILOS AVANZADOS PARA EL ENCABEZADO Y LA TABLA
    // =================================================================

    const HEADER_ROW = 6; // Fila donde empieza la cabecera de la tabla (A7)
    const DATA_START_ROW = HEADER_ROW + 1; // Fila de inicio de los datos (A8)
    const lastColIndex = 5; // Columna F
    const lastDataRow = DATA_START_ROW + excelData.length - 1;
    const range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastDataRow + 1, c: lastColIndex } });

    // Estilos Comunes (Adaptados para un aspecto profesional y de campo)
    const styleHeaderTitle = { font: { sz: 18, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "059669" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Oscuro (Esmeralda 600)
    const styleSubHeader = { font: { sz: 14, bold: true, color: { rgb: "047857" } }, fill: { fgColor: { rgb: "D1FAE5" } }, alignment: { horizontal: "center", vertical: "center" } }; // Verde Claro (Esmeralda 100)
    const styleTableHeader = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "34D399" } }, alignment: { horizontal: "center" } }; // Verde Medio (Esmeralda 400)
    const styleSummary = { font: { bold: true, sz: 11, color: { rgb: "1F2937" } }, alignment: { horizontal: "center" }, fill: { fgColor: { rgb: "A7F3D0" } } }; // Verde muy Claro para Totales

    // 3. Creación del Encabezado con Estilos

    // La función sheet_add_aoa solo añade el texto, el estilo debe aplicarse después.
    XLSX.utils.sheet_add_aoa(ws, [
      [COMPANY_NAME],
      [INVENTORY_DETAIL],
      [`Fecha de Reporte: ${day}/${month}/${year}`],
      [""], // Fila vacía para espacio
      [""], // Fila vacía para espacio
      // La fila 6 es la cabecera de la tabla, se agrega en el paso 5.
    ], { origin: "A1" });

    // Aplicar estilos a las celdas de encabezado (Filas 1-3)
    [
      { row: 0, text: COMPANY_NAME, style: styleHeaderTitle },
      { row: 1, text: INVENTORY_DETAIL, style: styleSubHeader },
      { row: 2, text: `Fecha de Reporte: ${day}/${month}/${year}`, style: { font: { italic: true }, alignment: { horizontal: "center" } } },
    ].forEach(({ row, text, style }) => {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
      // Asegurar que el objeto celda exista antes de modificar el estilo
      ws[cellAddress] = ws[cellAddress] || { t: 's' }; 
      ws[cellAddress].v = text;
      ws[cellAddress].s = style;
    });

    // 4. Fusionar celdas del encabezado (Filas 1 a 3)
    if (!ws["!merges"]) ws["!merges"] = [];
    for (let i = 0; i < 3; i++) {
      ws["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: lastColIndex } });
    }

    // 5. Agregar los datos de la tabla (Incluye la Cabecera en la fila 7)
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: `A${HEADER_ROW + 1}`, // Fila 7
      skipHeader: false,
    });

    // 6. Aplicar estilos a la cabecera de la tabla (Fila 7)
    const headerKeys = ["ID", "Nombre del Producto", "Categoría", "Entradas (+)", "Salidas (-)", "STOCK TOTAL"];
    headerKeys.forEach((key, C) => {
      const cellAddress = XLSX.utils.encode_cell({ r: HEADER_ROW, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = styleTableHeader;
      }
    });

    // 7. Aplicar estilos y Formato Condicional (Stock) a las filas de datos
    for (let R = DATA_START_ROW; R <= lastDataRow; R++) {
      for (let C = 0; C <= lastColIndex; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellAddress]) {
          // Estilo de celda básico (alineación)
          ws[cellAddress].s = { alignment: { horizontal: C < 3 ? "left" : "center" } };

          // Formato Condicional para la columna STOCK TOTAL (Columna F / C=5)
          if (C === 5 && ws[cellAddress].v <= 5) { // Stock Bajo (<= 5)
            ws[cellAddress].s = {
              ...ws[cellAddress].s,
              fill: { fgColor: { rgb: "FEE2E2" } }, // Fondo Rojo Claro
              font: { color: { rgb: "DC2626" }, bold: true }, // Texto Rojo Oscuro
            };
          }
          if (C >= 3 && C <= 5 && typeof ws[cellAddress].v === 'number') {
             // Asegurar formato numérico para las columnas de valores
            ws[cellAddress].s.numFmt = '#,##0'; 
          }
        }
      }
    }

    // 8. Fila de Resumen con Fórmulas de Excel
    const summaryRow = lastDataRow + 1; // La fila siguiente a la última de datos
    
    // Etiqueta del total (Celda C[summaryRow + 1])
    const totalLabelCell = XLSX.utils.encode_cell({ r: summaryRow, c: 2 }); // Columna C (Categoría)
    ws[totalLabelCell] = { t: 's', v: "TOTALES:", s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "E5E7EB" } } } }; // Gris claro

    // Fórmulas de Suma: Sumar Entradas, Salidas y Stock Total (Columnas D, E, F)
    for (let C = 3; C <= lastColIndex; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: summaryRow, c: C });
      const colLetter = XLSX.utils.encode_col(C);
      
      // La fórmula debe sumar desde la primera fila de datos (DATA_START_ROW + 1) hasta la última (lastDataRow + 1)
      ws[cellAddress] = {
        t: 'f', // Tipo: Fórmula
        f: `SUM(${colLetter}${DATA_START_ROW + 1}:${colLetter}${lastDataRow + 1})`,
        s: styleSummary,
      };
    }
    
    // 9. Configuración final: Auto-filtro y Ancho de Columna
    ws["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: HEADER_ROW, c: 0 },
        e: { r: lastDataRow, c: lastColIndex },
      }),
    };

    const wscols = [
      { wch: 5 }, // A: ID
      { wch: 30 }, // B: Nombre del Producto (Más ancho)
      { wch: 18 }, // C: Categoría
      { wch: 15 }, // D: Entradas (+)
      { wch: 15 }, // E: Salidas (-)
      { wch: 20 }, // F: STOCK TOTAL (Más ancho)
    ];
    ws["!cols"] = wscols;
    ws["!ref"] = range; // Actualizar el rango de la hoja

    // 10. Escribir el archivo
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Inventario");
    XLSX.writeFile(wb, `Inventario-Reporte-Excel-${day}-${month}-${year}.xlsx`);
  };

  // CLAVE 2: ExportToPDF Modificada para centrado dinámico del encabezado
  // (Mantengo tu código original de PDF ya que no pediste cambios aquí, solo ajusté la función `ExportToExcel`).
  const ExportToPDF = async () => {
    // 1. Verificación de carga y datos
    if (isLoading || currentItems.length === 0) {
      showExportError(
        "Datos no disponibles",
        "La lista está vacía o cargando. No se puede exportar."
      );
      return;
    }

    const doc = new jsPDF();
    const logoWidth = 30; // Ancho del logo en mm
    const logoHeight = 15; // Alto del logo en mm // Calcula el punto medio de la página para centrar
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerPoint = pageWidth / 2; // X donde se centrará el texto/logo // Posición Y para el inicio del encabezado

    let currentY = 15;

    try {
      // --- 1. Preparar la Imagen del Header (Logo) ---
      const base64Image = await getBase64ImageFromURL(LOGO_URL); // Centrar el logo
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(base64Image, "PNG", logoX, currentY, logoWidth, logoHeight); // Mover Y debajo del logo
      currentY += logoHeight + 4; // Espacio entre logo y texto
    } catch (error) {
      // console.error("Error al cargar o añadir la imagen del logo:", error);
      // Si falla la imagen, el texto comienza desde Y=15
      currentY = 15;
    } // --- 2. Dibujar el Header (Texto) Centrado --- // Nombre de la Empresa
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(COMPANY_NAME, centerPoint, currentY, { align: "center" });
    currentY += 6; // Espaciado // Detalles de Inventario (Título del Reporte)

    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(INVENTORY_DETAIL, centerPoint, currentY, { align: "center" });
    currentY += 5; // Espaciado // Fecha de Exportación

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      `Fecha de Exportación: ${day}/${month}/${year}`,
      centerPoint,
      currentY,
      { align: "center" }
    );
    currentY += 10; // Espaciado final antes de la tabla
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
        stock, // Valor de stock calculado
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
  
  // CLAVE 3: delProduct: Recarga con el modo correcto
  const delProduct = async (id) => {
    await dispatch(deleteProduct(id)); // Determinar el modo de recarga para mantener la vista actual (all vs own)
    const fetchMode =
      userRole === "admin" || userRole === "invitado" ? "all" : "own";
    await dispatch(getProducts(fetchMode));
  };

  const confirmDelate = (id) => {
    // Solo Admin puede eliminar (según tu renderizado).
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

  // --- Lógica de Paginación ---
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

  // CLAVE 4: useEffect para la carga inicial/recarga basada en el rol
  useEffect(() => {
    // Modo de carga: 'all' (Admin, Invitado) o 'own' (Usuario)
    const fetchMode =
      userRole === "admin" || userRole === "invitado" ? "all" : "own";

    dispatch(getProducts(fetchMode));
  }, [dispatch, userRole]);
  
  // --- Efecto para el Filtrado por Búsqueda ---
  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  // --- Renderizado ---
  return (
    <div>
      <div className="px-2 py-4">
        <div className="flex justify-between ">
          <h2 className="text-3xl">Productos del Inventario</h2>
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
            <p className="flex justify-start">
              -- No hay Productos en la Lista , Por favor agrega un producto para almacenarlo...
            </p>
          ) : (
            <table className="grid border-solid border-2 border-blue-400 rounded-md p-2 bg-cardOverlay ">
              {/* Encabezado para Escritorio (md:block) - Muestra 7 columnas */}
              <thead className="hidden md:block border-solid border-b-2 mb-3 shadow-md">
                <tr className="grid grid-cols-7 text-lg">
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Entradas</th>
                  <th>Salidas</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              {/* Encabezado para Móvil (md:hidden) - Muestra 5 columnas */}
              <thead className="border-solid md:hidden border-b-2 mb-3 shadow-md">
                <tr className="grid grid-cols-5 text-lg">
                  <th>ID</th>
                  <th>Nomb</th>
                  <th>Categ</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className=" grid ">
                {currentItems.map((product, index) => {
                  const { _id, name, category, entradas, salidas } = product; // Controla la visibilidad de los botones de Edición y Eliminación

                  const canEditOrDelete =
                    userRole === "admin" || userRole === "usuario"; // La eliminación es solo para Admin, según el código de confirmDelate
                  const canDelete = userRole === "admin";

                  return (
                    <tr
                      key={_id} // Clase grid-cols-5 para móvil, md:grid-cols-7 para escritorio
                      className="grid grid-cols-5 md:grid-cols-7 border-solid border-b-2 mb-4 text-lg"
                    >
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 10)}</td>
                      <td>{shortenText(category, 8)}</td>
                      {/* Ocultar en móvil, mostrar en md */}
                      <td className="hidden md:block">{entradas}</td>
                      <td className="hidden md:block">{salidas}</td>
                      <td>{entradas - salidas}</td>
                      <motion.td
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="flex justify-center space-x-3"
                      >
                        {/* 1. Botón de Ver Detalles (Visible para todos) */}
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiFillEye className="text-purple-400" />
                          </Link>
                        </span>
                        {/* 2. Botón de Editar (Visible para Admin y Usuario) */}
                        {canEditOrDelete && (
                          <span>
                            <Link to={`/edit-product/${_id}`}>
                              <BiEditAlt className="text-green-400" />
                            </Link>
                          </span>
                        )}
                        {/* 3. Botón de Eliminar (Visible SOLO para Admin) */}
                        {canDelete && (
                          <span>
                            <Link>
                              <AiTwotoneDelete
                                className="text-red-400"
                                onClick={() => confirmDelate(_id)}
                              />
                            </Link>
                          </span>
                        )}
                      </motion.td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="flex justify-center items-center mt-3 gap-4">
            {/* Botones de Exportación */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition duration-200 transform hover:scale-[1.05]"
              onClick={ExportToExcel}
            >
              Exportar a Excel <SiMicrosoftexcel />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="px-1 p-2 bg-red-600 hover:bg-red-700 text-white border-solid border-2 border-red-800 rounded-md flex justify-center items-center gap-2"
              onClick={ExportToPDF}
            >
              Exportar a PDF
            </motion.button>
          </div>
          {/* Paginación */}
          <div className="flex justify-center items-center mt-6">
            {currentItems.length > 0 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< Previous"
                renderOnZeroPageCount={null}
                className="flex justify-center items-center space-x-2 text-xl"
                activeClassName="bg-blue-600 text-white rounded-md px-3 py-1 font-bold"
                pageClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
                previousClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
                nextClassName="px-3 py-1 border rounded-md hover:bg-gray-200"
                disabledClassName="text-gray-400 cursor-not-allowed"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;