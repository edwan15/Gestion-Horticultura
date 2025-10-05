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


import React, { useState, useEffect } from "react";
import { AiOutlineAppstoreAdd, AiOutlineFileProtect } from "react-icons/ai";
import { GrDocumentStore } from "react-icons/gr";
import { MdReportProblem } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    selectTotalStoreValue,
    selectOutStock,
    selectCategory,
    CALC_STORE_VALUE,
    CALC_STORE_OUTOFSTOCK,
    CALC_CATEGOTY,
} from "../../../features/product/ProductSlice";

// IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu componente base Card
import Card from "../../Caja.js/Card"; 

// =========================================================================
// 1. COMPONENTE AUXILIAR: HoverDetailCard (Interno y Limpio)
// Este componente añade el comportamiento de hover/tooltip a las Cards.
// =========================================================================
const HoverDetailCard = ({ icon, title, count, detailTitle, detailContent }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* La tarjeta principal del resumen */}
            <Card 
                icon={icon}
                title={title}
                count={count}
            />

            {/* El Modal/Tooltip flotante que aparece al hacer hover */}
            {isHovered && (
                <div 
                    className="absolute z-10 p-3 mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-lg 
                                sm:w-80 md:w-96
                                top-full left-1/2 transform -translate-x-1/2" 
                >
                    <h4 className="text-md font-bold text-indigo-600 mb-1 border-b pb-1">
                        {detailTitle}
                    </h4>
                    <p className="text-sm text-gray-700">{detailContent}</p>
                </div>
            )}
        </div>
    );
};
// =========================================================================

// Icons
const productsIcons = <AiOutlineFileProtect />;
const totalProduct = <GrDocumentStore />;
const outStock = <MdReportProblem />;
const allCategory = <AiOutlineAppstoreAdd />;

export const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// =========================================================================
// 2. COMPONENTE PRINCIPAL: ProductSumer (Limpio y Funcional)
// =========================================================================
const ProductSumer = ({ products }) => {
    const dispatch = useDispatch();
    const totalStore = useSelector(selectTotalStoreValue);
    const stockProduct = useSelector(selectOutStock);
    const category = useSelector(selectCategory); // Array de nombres de categorías

    // Ejecuta las funciones de cálculo de Redux cada vez que 'products' cambie.
    // Esto es crucial para reflejar los datos que llegan del API.
    useEffect(() => {
        dispatch(CALC_STORE_VALUE(products));
        dispatch(CALC_STORE_OUTOFSTOCK(products));
        dispatch(CALC_CATEGOTY(products));
    }, [dispatch, products]);
    
    // Función auxiliar para obtener nombres de categorías (limita a 3 para el tooltip)
    const getCategoryNames = () => {
        if (!category || category.length === 0) return "Ninguna categoría registrada.";
        
        const names = category.slice(0, 3).join(', ');
        return category.length > 3 ? `${names} y ${category.length - 3} más.` : names + ".";
    };

    return (
        <div className="">
            <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
            <h2 className="flex p-2 text-3xl justify-start items-start">
                Estado del Inventario
            </h2>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 w-96 sm:grid-cols-2 md:grid-cols-4 gap-5 p-2 sm:w-full">
                    
                    {/* Tarjeta 1: Productos Registrados */}
                    <HoverDetailCard
                        icon={productsIcons}
                        title="Productos Registrados"
                        count={products.length}
                        detailTitle="Resumen de Productos"
                        detailContent={
                            products.length > 0
                            ? `Tienes un total de ${products.length} productos únicos registrados. El inventario está activo.`
                            : `No hay productos registrados en el sistema. Empieza a agregar algunos.`
                        }
                    />
                    
                    {/* Tarjeta 2: Valor Total */}
                    <HoverDetailCard
                        icon={totalProduct}
                        title={"Valor Total"}
                        count={formatNumbers(totalStore)}
                        detailTitle="Valor Monetario del Inventario"
                        detailContent={`Representa la suma de stock de todos los productos: ${formatNumbers(totalStore)} unidades. Este es el valor actual de tus existencias.`}
                    />
                    
                    {/* Tarjeta 3: Productos Agotados */}
                    <HoverDetailCard
                        icon={outStock}
                        title={"Productos Agotados"}
                        count={stockProduct}
                        detailTitle="Alerta de Stock Crítico"
                        detailContent={
                            stockProduct > 0
                            ? `¡Alerta! Hay ${stockProduct} productos críticos (Stock 0 o menos) que necesitan ser reabastecidos urgentemente para evitar pérdidas en ventas.`
                            : `¡Excelente! Ningún producto está actualmente agotado. Mantente vigilante.`
                        }
                    />
                    
                    {/* Tarjeta 4: Total de Categorías */}
                    <HoverDetailCard
                        icon={allCategory}
                        title={"Total de Categorías"}
                        count={category.length}
                        detailTitle="Diversidad y Organización"
                        detailContent={`El inventario está organizado en ${category.length} categorías. Las principales son: ${getCategoryNames()}`}
                    />
                </div>
            </div>
            <p className="px-1 w-full border-solid border-b-2 border-gray-300 mt-2"></p>
        </div>
    );
};

export default ProductSumer;