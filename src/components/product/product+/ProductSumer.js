// import React, { useEffect } from "react";
// import { AiOutlineAppstoreAdd, AiOutlineFileProtect } from "react-icons/ai";
// import { GrDocumentStore } from "react-icons/gr";
// import { MdReportProblem } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectTotalStoreValue,
//   selectOutStock,
//   selectCategory,
//   CALC_STORE_VALUE,
//   CALC_STORE_OUTOFSTOCK,
//   CALC_CATEGOTY,
// } from "../../../features/product/ProductSlice";
// import Card from "../../Caja.js/Card";

// // icons

// const productsIcons = <AiOutlineFileProtect />;
// const totalProduct = <GrDocumentStore />;
// const outStock = <MdReportProblem />;
// const allCategory = <AiOutlineAppstoreAdd />;

// export const formatNumbers = (x) => {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const ProductSumer = ({ products }) => {
//   const dispatch = useDispatch();
//   const totalStore = useSelector(selectTotalStoreValue);
//   const stockProduct = useSelector(selectOutStock);
//   const category = useSelector(selectCategory);

//   useEffect(() => {
//     dispatch(CALC_STORE_VALUE(products));
//     dispatch(CALC_STORE_OUTOFSTOCK(products));
//     dispatch(CALC_CATEGOTY(products));
//   }, [dispatch, products]);

//   return (
//     <div className="">
//       {/* <h1 className="px-1 border-solid border-b-2 border-gray-300"></h1> */}
//        <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//       <h2 className="flex p-2 text-3xl justify-start items-start ">
//         Estado del Inventario
//       </h2>
//       <div className="flex items-center justify-center ">
//         <div  className="grid grid-cols-2 w-96 sm:grid-cols-2 md:grid-cols-4 gap-5 p-2  sm:w-full">
//           <Card
//             icon={productsIcons}
//             title="productos"
//             count={products.length}
//             className=""
//           />
//           <Card
//             icon={totalProduct}
//             title={"total  productos"}
//             count={totalStore}

//           />
//           <Card
//             icon={outStock}
//             title={" fuera del Stock"}
//             count={stockProduct}
//           />
//           <Card
//             icon={allCategory}
//             title={"todas las Categorias"}
//             count={category.length}
//           />
//         </div>
//       </div>
//       <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//     </div>
//   );
// };

// export default ProductSumer;

// import React, { useState, useEffect } from "react";
// import { AiOutlineAppstoreAdd, AiOutlineFileProtect } from "react-icons/ai";
// import { GrDocumentStore } from "react-icons/gr";
// import { MdReportProblem } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     selectTotalStoreValue,
//     selectOutStock,
//     selectCategory,
//     CALC_STORE_VALUE,
//     CALC_STORE_OUTOFSTOCK,
//     CALC_CATEGOTY,
// } from "../../../features/product/ProductSlice";

// // IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu componente base Card
// import Card from "../../Caja.js/Card"

// // =========================================================================
// // 1. COMPONENTE AUXILIAR: HoverDetailCard (Interno)
// // Se mantiene igual para manejar el hover y el modal.
// // =========================================================================
// const HoverDetailCard = ({ icon, title, count, detailTitle, detailContent }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//         <div
//             className="relative"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* La tarjeta principal del resumen */}
//             <Card
//                 icon={icon}
//                 title={title}
//                 count={count}
//             />

//             {/* El Modal/Tooltip flotante que aparece al hacer hover */}
//             {isHovered && (
//                 <div
//                     className="absolute z-10 p-3 mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-lg
//                                sm:w-80 md:w-96
//                                top-full left-1/2 transform -translate-x-1/2"
//                 >
//                     <h4 className="text-md font-bold text-indigo-600 mb-1 border-b pb-1">
//                         {detailTitle}
//                     </h4>
//                     <p className="text-sm text-gray-700">{detailContent}</p>
//                 </div>
//             )}
//         </div>
//     );
// };
// // =========================================================================

// // Icons
// const productsIcons = <AiOutlineFileProtect />;
// const totalProduct = <GrDocumentStore />;
// const outStock = <MdReportProblem />;
// const allCategory = <AiOutlineAppstoreAdd />;

// export const formatNumbers = (x) => {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// // =========================================================================
// // 2. COMPONENTE PRINCIPAL: ProductSumer
// // =========================================================================
// const ProductSumer = ({ products }) => {
//     const dispatch = useDispatch();
//     const totalStore = useSelector(selectTotalStoreValue);
//     const stockProduct = useSelector(selectOutStock);
//     const category = useSelector(selectCategory); // Array de nombres de categorías

//     useEffect(() => {
//         dispatch(CALC_STORE_VALUE(products));
//         dispatch(CALC_STORE_OUTOFSTOCK(products));
//         dispatch(CALC_CATEGOTY(products));
//     }, [dispatch, products]);

//     // Función auxiliar para obtener nombres de categorías (limita a 3 para el tooltip)
//     const getCategoryNames = () => {
//         if (!category || category.length === 0) return "Ninguna categoría registrada.";

//         const names = category.slice(0, 3).join(', ');
//         return category.length > 3 ? `${names} y ${category.length - 3} más.` : names + ".";
//     };

//     return (
//         <div className="">
//             <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//             <h2 className="flex p-2 text-3xl justify-start items-start">
//                 Estado del Inventario
//             </h2>
//             <div className="flex items-center justify-center">
//                 <div className="grid grid-cols-2 w-96 sm:grid-cols-2 md:grid-cols-4 gap-5 p-2 sm:w-full">

//                     {/* Tarjeta 1: Productos Registrados */}
//                     <HoverDetailCard
//                         icon={productsIcons}
//                         title="Productos Registrados"
//                         count={products.length}
//                         detailTitle="Resumen de Productos"
//                         // Detalle mejorado: Muestra si hay productos o no.
//                         detailContent={
//                             products.length > 0
//                             ? `Tienes un total de ${products.length} productos únicos registrados. El inventario está activo.`
//                             : `No hay productos registrados en el sistema. Empieza a agregar algunos.`
//                         }
//                     />

//                     {/* Tarjeta 2: Valor Total */}
//                     <HoverDetailCard
//                         icon={totalProduct}
//                         title={"Valor Total"}
//                         count={formatNumbers(totalStore)}
//                         detailTitle="Valor Monetario del Inventario"
//                         detailContent={`Representa el valor total de compra de todas las unidades de productos: $${formatNumbers(totalStore)}. Este es el valor actual de tus existencias.`}
//                     />

//                     {/* Tarjeta 3: Productos Agotados */}
//                     <HoverDetailCard
//                         icon={outStock}
//                         title={"Productos Agotados"}
//                         count={stockProduct}
//                         detailTitle="Alerta de Stock Crítico"
//                         // Detalle mejorado: Mensaje de urgencia basado en el conteo.
//                         detailContent={
//                             stockProduct > 0
//                             ? `¡Alerta! Hay ${stockProduct} productos críticos (Stock 0) que necesitan ser reabastecidos urgentemente para evitar pérdidas en ventas.`
//                             : `¡Excelente! Ningún producto está actualmente agotado. Mantente vigilante.`
//                         }
//                     />

//                     {/* Tarjeta 4: Total de Categorías */}
//                     <HoverDetailCard
//                         icon={allCategory}
//                         title={"Total de Categorías"}
//                         count={category.length}
//                         detailTitle="Diversidad y Organización"
//                         // Detalle mejorado: Muestra una lista de categorías.
//                         detailContent={`El inventario está organizado en ${category.length} categorías. Las principales son: ${getCategoryNames()}`}
//                     />
//                 </div>
//             </div>
//             <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//         </div>
//     );
// };

// export default ProductSumer;

// import React, { useState, useEffect } from "react";
// import { AiOutlineAppstoreAdd, AiOutlineFileProtect } from "react-icons/ai";
// import { GrDocumentStore } from "react-icons/gr";
// import { MdReportProblem } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     selectTotalStoreValue,
//     selectOutStock,
//     selectCategory,
//     CALC_STORE_VALUE,
//     CALC_STORE_OUTOFSTOCK,
//     CALC_CATEGOTY,
// } from "../../../features/product/ProductSlice";

// // IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu componente base Card
// import Card from "../../Caja.js/Card";

// // =========================================================================
// // 1. COMPONENTE AUXILIAR: HoverDetailCard (Interno y Limpio)
// // Este componente añade el comportamiento de hover/tooltip a las Cards.
// // =========================================================================
// const HoverDetailCard = ({ icon, title, count, detailTitle, detailContent }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//         <div
//             className="relative"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* La tarjeta principal del resumen */}
//             <Card
//                 icon={icon}
//                 title={title}
//                 count={count}
//             />

//             {/* El Modal/Tooltip flotante que aparece al hacer hover */}
//             {isHovered && (
//                 <div
//                     className="absolute z-10 p-3 mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-lg
//                                 sm:w-80 md:w-96
//                                 top-full left-1/2 transform -translate-x-1/2"
//                 >
//                     <h4 className="text-md font-bold text-indigo-600 mb-1 border-b pb-1">
//                         {detailTitle}
//                     </h4>
//                     <p className="text-sm text-gray-700">{detailContent}</p>
//                 </div>
//             )}
//         </div>
//     );
// };
// // =========================================================================

// // Icons
// const productsIcons = <AiOutlineFileProtect />;
// const totalProduct = <GrDocumentStore />;
// const outStock = <MdReportProblem />;
// const allCategory = <AiOutlineAppstoreAdd />;

// export const formatNumbers = (x) => {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// // =========================================================================
// // 2. COMPONENTE PRINCIPAL: ProductSumer (Limpio y Funcional)
// // =========================================================================
// const ProductSumer = ({ products }) => {
//     const dispatch = useDispatch();
//     const totalStore = useSelector(selectTotalStoreValue);
//     const stockProduct = useSelector(selectOutStock);
//     const category = useSelector(selectCategory); // Array de nombres de categorías

//     // Ejecuta las funciones de cálculo de Redux cada vez que 'products' cambie.
//     // Esto es crucial para reflejar los datos que llegan del API.
//     useEffect(() => {
//         dispatch(CALC_STORE_VALUE(products));
//         dispatch(CALC_STORE_OUTOFSTOCK(products));
//         dispatch(CALC_CATEGOTY(products));
//     }, [dispatch, products]);

//     // Función auxiliar para obtener nombres de categorías (limita a 3 para el tooltip)
//     const getCategoryNames = () => {
//         if (!category || category.length === 0) return "Ninguna categoría registrada.";

//         const names = category.slice(0, 3).join(', ');
//         return category.length > 3 ? `${names} y ${category.length - 3} más.` : names + ".";
//     };

//     return (
//         <div className="">
//             <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//             <h2 className="flex p-2 text-3xl justify-start items-start">
//                 Estado del Inventario
//             </h2>
//             <div className="flex items-center justify-center">
//                 <div className="grid grid-cols-2 w-96 sm:grid-cols-2 md:grid-cols-4 gap-5 p-2 sm:w-full">

//                     {/* Tarjeta 1: Productos Registrados */}
//                     <HoverDetailCard
//                         icon={productsIcons}
//                         title="Productos Registrados"
//                         count={products.length}
//                         detailTitle="Resumen de Productos"
//                         detailContent={
//                             products.length > 0
//                             ? `Tienes un total de ${products.length} productos únicos registrados. El inventario está activo.`
//                             : `No hay productos registrados en el sistema. Empieza a agregar algunos.`
//                         }
//                     />

//                     {/* Tarjeta 2: Valor Total */}
//                     <HoverDetailCard
//                         icon={totalProduct}
//                         title={"Valor Total"}
//                         count={formatNumbers(totalStore)}
//                         detailTitle="Valor Monetario del Inventario"
//                         detailContent={`Representa la suma de stock de todos los productos: ${formatNumbers(totalStore)} unidades. Este es el valor actual de tus existencias.`}
//                     />

//                     {/* Tarjeta 3: Productos Agotados */}
//                     <HoverDetailCard
//                         icon={outStock}
//                         title={"Productos Agotados"}
//                         count={stockProduct}
//                         detailTitle="Alerta de Stock Crítico"
//                         detailContent={
//                             stockProduct > 0
//                             ? `¡Alerta! Hay ${stockProduct} productos críticos (Stock 0 o menos) que necesitan ser reabastecidos urgentemente para evitar pérdidas en ventas.`
//                             : `¡Excelente! Ningún producto está actualmente agotado. Mantente vigilante.`
//                         }
//                     />

//                     {/* Tarjeta 4: Total de Categorías */}
//                     <HoverDetailCard
//                         icon={allCategory}
//                         title={"Total de Categorías"}
//                         count={category.length}
//                         detailTitle="Diversidad y Organización"
//                         detailContent={`El inventario está organizado en ${category.length} categorías. Las principales son: ${getCategoryNames()}`}
//                     />
//                 </div>
//             </div>
//             <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
//         </div>
//     );
// };

// export default ProductSumer;












// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion"; // 🚨 Importamos Framer Motion

// // --- Iconos profesionales de React Icons (más modernos) ---
// import { BiBox, BiDollar, BiCategory, BiErrorCircle } from "react-icons/bi";
// import { FaBoxes } from "react-icons/fa"; // Usaremos este para 'Productos Registrados'

// import {
//   selectTotalStoreValue,
//   selectOutStock,
//   selectCategory,
//   CALC_STORE_VALUE,
//   CALC_STORE_OUTOFSTOCK,
//   CALC_CATEGOTY,
// } from "../../../features/product/ProductSlice";

// // IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu componente base Card
// import Card from "../../Caja.js/Card";

// // --- Configuración de Animación para las tarjetas ---
// const cardVariants = {
//   hidden: { opacity: 0, scale: 0.9 },
//   visible: { opacity: 1, scale: 1 },
// };

// // =========================================================================
// // 1. COMPONENTE AUXILIAR: AnimatedDetailCard (Interno y Limpio)
// // Reemplaza HoverDetailCard para usar Framer Motion.
// // =========================================================================
// const AnimatedDetailCard = ({
//   icon,
//   title,
//   count,
//   detailTitle,
//   detailContent,
//   delay,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   // Envolvemos el componente Card con motion.div para aplicar la animación
//   return (
//     <motion.div
//       className="relative"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       transition={{
//         duration: 0.6,
//         delay: delay,
//         type: "spring",
//         stiffness: 150,
//       }}
//     >
//       {/* El componente Card base con estilos mejorados (si Card lo permite) */}
//       <Card
//         icon={icon}
//         title={title}
//         count={count}
//         // Añadimos clases Tailwind al Card para un look más moderno
//         className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 transition duration-300 hover:shadow-2xl cursor-pointer"
//       />

//       {/* El Modal/Tooltip flotante que aparece al hacer hover */}
//       {isHovered && (
//         <div
//           className="absolute z-10 p-4 mt-2 w-60 bg-gray-800 text-white rounded-xl shadow-2xl border-2 border-indigo-400
//                                 sm:w-80 md:w-96
//                                 top-full left-1/2 transform -translate-x-1/2 transition-opacity duration-300"
//         >
//           <h4 className="text-lg font-bold text-indigo-300 mb-2 border-b border-indigo-600 pb-1">
//             {detailTitle}
//           </h4>
//           <p className="text-sm text-gray-200">{detailContent}</p>
//           <div className="absolute w-3 h-3 bg-gray-800 border-t-2 border-l-2 border-indigo-400 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
//         </div>
//       )}
//     </motion.div>
//   );
// };
// // =========================================================================

// // --- Nuevos Iconos (más profesionales) ---
// const totalUniqueProducts = <FaBoxes />; // Productos Únicos
// const totalProductValue = <BiDollar />; // Valor Total (Monetario)
// const outOfStockIcon = <BiErrorCircle />; // Problema de Stock
// const totalCategories = <BiCategory />; // Categorías

// export const formatNumbers = (x) => {
//   // Aseguramos que el valor sea un número antes de formatear
//   if (typeof x !== "number") return x;
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// // =========================================================================
// // 2. COMPONENTE PRINCIPAL: ProductSumer
// // =========================================================================
// const ProductSumer = ({ products }) => {
//   const dispatch = useDispatch();
//   const totalStore = useSelector(selectTotalStoreValue);
//   const stockProduct = useSelector(selectOutStock);
//   const category = useSelector(selectCategory);

//   useEffect(() => {
//     dispatch(CALC_STORE_VALUE(products));
//     dispatch(CALC_STORE_OUTOFSTOCK(products));
//     dispatch(CALC_CATEGOTY(products));
//   }, [dispatch, products]);
//   const getCategoryNames = () => {
//     if (!category || category.length === 0)
//       return "Ninguna categoría registrada.";
//     const names = category.slice(0, 3).join(", ");
//     return category.length > 3
//       ? `${names} y ${category.length - 3} más.`
//       : names + ".";
//   };

//   return (
//     <div className="p-4 rounded-xl">
//                  {" "}
//       <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
//                         📦 Resumen del Inventario            {" "}
//       </h2>
//                               {/* GRID ANIMADA CON FRAMER-MOTION */}           {" "}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//                                                {" "}
//         {/* Tarjeta 1: Productos Únicos */}
//                            {" "}
//         <AnimatedDetailCard
//           icon={totalUniqueProducts}
//           title="Productos Únicos"
//           count={products.length}
//           detailTitle="Diversidad del Inventario"
//           detailContent={`Tienes un total de ${products.length} productos diferentes registrados en tu sistema. Cada uno representa un SKU único.`}
//           delay={0}
//         />
//                                                 {/* Tarjeta 2: Valor Total */}
//                            {" "}
//         <AnimatedDetailCard
//           icon={totalProductValue}
//           title={"Valor Monetario"}
//           count={`$${formatNumbers(totalStore)}`} // Muestra el símbolo de moneda
//           detailTitle="Valor Estimado de Compra"
//           detailContent={`El valor total de compra de todo tu stock es de $${formatNumbers(
//             totalStore
//           )}. Este valor es clave para la contabilidad.`}
//           delay={0.1}
//         />
//                                                {" "}
//         {/* Tarjeta 3: Productos Agotados */}
//                            {" "}
//         <AnimatedDetailCard
//           icon={outOfStockIcon}
//           title={"¡Stock Crítico!"}
//           count={stockProduct}
//           detailTitle="Alerta de Productos Agotados"
//           detailContent={
//             stockProduct > 0
//               ? `¡Atención! ${stockProduct} productos están agotados (stock 0 o menos). Prioriza la reposición.`
//               : `Status: Óptimo. Ningún producto está actualmente agotado.`
//           }
//           delay={0.2}
//         />
//                                                {" "}
//         {/* Tarjeta 4: Total de Categorías */}
//                            {" "}
//         <AnimatedDetailCard
//           icon={totalCategories}
//           title={"Total de Categorías"}
//           count={category.length}
//           detailTitle="Organización del Inventario"
//           detailContent={`El inventario se clasifica en ${
//             category.length
//           } grupos. Principales categorías: ${getCategoryNames()}`}
//           delay={0.3}
//         />
//                    {" "}
//       </div>
//              {" "}
//     </div>
//   );
// };

// export default ProductSumer;



// import React,{useState,useEffect} from "react";
// import {useDispatch,useSelector} from "react-redux";
// import {motion} from "framer-motion";
// import {BiDollar,BiCategory,BiErrorCircle} from "react-icons/bi";
// import {FaBoxes} from "react-icons/fa";
// import {
//   selectTotalStoreValue,
//   selectOutStock,
//   selectCategory,
//   CALC_STORE_VALUE,
//   CALC_STORE_OUTOFSTOCK,
//   CALC_CATEGOTY,
// } from "../../../features/product/ProductSlice";
// import Card from "../../Caja.js/Card";

// const cardVariants = {
//   hidden: {opacity: 0,scale: 0.9},
//   visible: {opacity: 1,scale: 1},
// };

// const AnimatedDetailCard = ({
//   icon,
//   title,
//   count,
//   detailTitle,
//   detailContent,
//   delay,
// }) => {
//   const [isHovered,setIsHovered] = useState(false);

//   return (
//     <motion.div
//       className="relative"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       transition={{
//         duration: 0.6,
//         delay: delay,
//         type: "spring",
//         stiffness: 150,
//       }}
//     >
//       <Card
//         icon={icon}
//         title={title}
//         count={count}
//         className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 transition duration-300 hover:shadow-2xl cursor-pointer"
//       />
//       {isHovered && (
//         <div
//           className="absolute z-10 p-4 mt-2 w-60 bg-gray-800 text-white rounded-xl shadow-2xl border-2 border-indigo-400
//                      sm:w-80 md:w-96
//                      top-full left-1/2 transform -translate-x-1/2 transition-opacity duration-300"
//         >
//           <h4 className="text-lg font-bold text-indigo-300 mb-2 border-b border-indigo-600 pb-1">
//             {detailTitle}
//           </h4>
//           <p className="text-sm text-gray-200">{detailContent}</p>
//           <div className="absolute w-3 h-3 bg-gray-800 border-t-2 border-l-2 border-indigo-400 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// const totalUniqueProducts = <FaBoxes />;
// const totalProductValue = <BiDollar />;
// const outOfStockIcon = <BiErrorCircle />;
// const totalCategories = <BiCategory />;

// export const formatNumbers = (x) => {
//   if (typeof x !== "number") return x;
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// const ProductSumer = ({products}) => {
//   const dispatch = useDispatch();
//   const totalStore = useSelector(selectTotalStoreValue);
//   const stockProduct = useSelector(selectOutStock);
//   const category = useSelector(selectCategory);

//   useEffect(() => {
//     dispatch(CALC_STORE_VALUE(products));
//     dispatch(CALC_STORE_OUTOFSTOCK(products));
//     dispatch(CALC_CATEGOTY(products));
//   }, [dispatch,products]);

//   const getCategoryNames = () => {
//     if (!category || category.length === 0)
//       return "Ninguna categoría registrada.";
//     const names = category.slice(0, 3).join(", ");
//     return category.length > 3
//       ? `${names} y ${category.length - 3} más.`
//       : names + ".";
//   };

//   return (
//     <div className="p-4 rounded-xl">
//       <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
//         📦 Resumen del Inventario
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         <AnimatedDetailCard
//           icon={totalUniqueProducts}
//           title="Productos Únicos"
//           count={products.length}
//           detailTitle="Diversidad del Inventario"
//           detailContent={`Tienes un total de ${products.length} productos diferentes registrados en tu sistema. Cada uno representa un SKU único.`}
//           delay={0}
//         />
//         <AnimatedDetailCard
//           icon={totalProductValue}
//           title={"Valor Monetario"}
//           count={`$${formatNumbers(totalStore)}`}
//           detailTitle="Valor Estimado de Compra"
//           detailContent={`El valor total de compra de todo tu stock es de $${formatNumbers(
//             totalStore
//           )}. Este valor es clave para la contabilidad.`}
//           delay={0.1}
//         />
//         <AnimatedDetailCard
//           icon={outOfStockIcon}
//           title={"¡Stock Crítico!"}
//           count={stockProduct}
//           detailTitle="Alerta de Productos Agotados"
//           detailContent={
//             stockProduct > 0
//               ? `¡Atención! ${stockProduct} productos están agotados (stock 0 o menos). Prioriza la reposición.`
//               : `Status: Óptimo. Ningún producto está actualmente agotado.`
//           }
//           delay={0.2}
//         />
//         <AnimatedDetailCard
//           icon={totalCategories}
//           title={"Total de Categorías"}
//           count={category.length}
//           detailTitle="Organización del Inventario"
//           detailContent={`El inventario se clasifica en ${
//             category.length
//           } grupos. Principales categorías: ${getCategoryNames()}`}
//           delay={0.3}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductSumer;



import React,{useState,useEffect} from "react";
import {useDispatch,useSelector} from "react-redux";
import {motion} from "framer-motion";
import {BiDollar,BiCategory,BiErrorCircle} from "react-icons/bi";
import {FaBoxes} from "react-icons/fa";
// 📌 Nuevos iconos para categorías específicas
import { FaSprayCan, FaSeedling, FaFlask } from 'react-icons/fa6'; 

import {
  selectTotalStoreValue,
  selectOutStock,
  selectCategory,
  CALC_STORE_VALUE,
  CALC_STORE_OUTOFSTOCK,
  CALC_CATEGOTY,
  // 📌 Nuevas importaciones de Redux Slice
  CALC_SPECIFIC_CATEGORY_COUNTS,
  selectSpecificCategoryCounts,
} from "../../../features/product/ProductSlice";
import Card from "../../Caja.js/Card";

const cardVariants = {
  hidden: {opacity: 0,scale: 0.9},
  visible: {opacity: 1,scale: 1},
};

const AnimatedDetailCard = ({
  icon,
  title,
  count,
  detailTitle,
  detailContent,
  delay,
  onClick, // Añadido para interactividad futura
}) => {
  const [isHovered,setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.6,
        delay: delay,
        type: "spring",
        stiffness: 150,
      }}
      // Permite hacer clic en la tarjeta
      onClick={onClick}
    >
      <Card
        icon={icon}
        title={title}
        count={count}
        className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 transition duration-300 hover:shadow-2xl cursor-pointer"
      />
      {isHovered && (
        <div
          className="absolute z-10 p-4 mt-2 w-60 bg-gray-800 text-white rounded-xl shadow-2xl border-2 border-indigo-400
                     sm:w-80 md:w-96
                     top-full left-1/2 transform -translate-x-1/2 transition-opacity duration-300"
        >
          <h4 className="text-lg font-bold text-indigo-300 mb-2 border-b border-indigo-600 pb-1">
            {detailTitle}
          </h4>
          <p className="text-sm text-gray-200">{detailContent}</p>
          <div className="absolute w-3 h-3 bg-gray-800 border-t-2 border-l-2 border-indigo-400 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </motion.div>
  );
};

const totalUniqueProducts = <FaBoxes />;
const totalProductValue = <BiDollar />;
const outOfStockIcon = <BiErrorCircle />;
const totalCategories = <BiCategory />;

export const formatNumbers = (x) => {
  if (typeof x !== "number") return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSumer = ({products}) => {
  const dispatch = useDispatch();
  const totalStore = useSelector(selectTotalStoreValue);
  const stockProduct = useSelector(selectOutStock);
  const category = useSelector(selectCategory);
  // 📌 Obtener el nuevo estado de conteo específico
  const specificCounts = useSelector(selectSpecificCategoryCounts); 

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_STORE_OUTOFSTOCK(products));
    dispatch(CALC_CATEGOTY(products));
    // 📌 Despachar la nueva acción de cálculo
    dispatch(CALC_SPECIFIC_CATEGORY_COUNTS(products)); 
  }, [dispatch,products]);

  const getCategoryNames = () => {
    if (!category || category.length === 0)
      return "Ninguna categoría registrada.";
    const names = category.slice(0, 3).join(", ");
    return category.length > 3
      ? `${names} y ${category.length - 3} más.`
      : names + ".";
  };

  return (
    <div className="p-4 rounded-xl">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        📦 Resumen General del Inventario
      </h2>
      
      {/* --- FILA 1: Tarjetas de Resumen General --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <AnimatedDetailCard
          icon={totalUniqueProducts}
          title="Productos Únicos"
          count={products.length}
          detailTitle="Diversidad del Inventario"
          detailContent={`Tienes un total de ${products.length} productos diferentes registrados en tu sistema. Cada uno representa un SKU único.`}
          delay={0}
        />
        <AnimatedDetailCard
          icon={totalProductValue}
          title={"Stock Total"}
          // Nota: El slice calcula el total de unidades (entradas - salidas)
          count={`${formatNumbers(totalStore)} Unds.`} 
          detailTitle="Conteo Total de Unidades"
          detailContent={`El total de unidades de stock es de ${formatNumbers(
            totalStore
          )} unidades. Este valor es clave para la contabilidad.`}
          delay={0.1}
        />
        <AnimatedDetailCard
          icon={outOfStockIcon}
          title={"¡Stock Crítico!"}
          count={stockProduct}
          detailTitle="Alerta de Productos Agotados"
          detailContent={
            stockProduct > 0
              ? `¡Atención! ${stockProduct} productos están agotados (stock 0 o menos). Prioriza la reposición.`
              : `Status: Óptimo. Ningún producto está actualmente agotado.`
          }
          delay={0.2}
        />
        <AnimatedDetailCard
          icon={totalCategories}
          title={"Total de Categorías"}
          count={category.length}
          detailTitle="Organización del Inventario"
          detailContent={`El inventario se clasifica en ${
            category.length
          } grupos. Principales categorías: ${getCategoryNames()}`}
          delay={0.3}
        />
      </div>
      
      {/* --- SEPARADOR Y TÍTULO PARA CATEGORÍAS ESPECÍFICAS --- */}
      <h3 className="text-xl font-extrabold text-gray-800 mt-8 mb-6 border-b pb-2">
        Análisis por Categorías de Insumos 🌱
      </h3>

      {/* --- FILA 2: Tarjetas de Categorías Específicas --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        <AnimatedDetailCard
          icon={<FaSprayCan className="text-green-600"/>}
          title="Fitosanitarios"
          count={specificCounts.Fitosanitarios}
          detailTitle="Total de Fitosanitarios"
          detailContent={`Tienes ${specificCounts.Fitosanitarios} tipos de productos Fitosanitarios en tu stock.`}
          delay={0.4}
        />
        
        <AnimatedDetailCard
          icon={<FaSeedling className="text-yellow-600"/>}
          title="Fertilizantes"
          count={specificCounts.Fertilizantes}
          detailTitle="Total de Fertilizantes"
          detailContent={`Tienes ${specificCounts.Fertilizantes} tipos de Fertilizantes en tu stock.`}
          delay={0.5}
        />

        <AnimatedDetailCard
          icon={<FaFlask className="text-blue-600"/>}
          title="Trampas / Monitoreo"
          count={specificCounts.Trampas}
          detailTitle="Total de Trampas y Monitoreo"
          detailContent={`Tienes ${specificCounts.Trampas} tipos de productos registrados para Monitoreo o Trampas.`}
          delay={0.6}
        />
        
        <AnimatedDetailCard
          icon={totalCategories}
          title="Otras Categorías"
          count={specificCounts.Otros}
          detailTitle="Productos Restantes"
          detailContent={`Existen ${specificCounts.Otros} tipos de productos en otras categorías no clasificadas como Fitosanitarios, Fertilizantes o Trampas.`}
          delay={0.7}
        />
      </div>
    </div>
  );
};

export default ProductSumer;