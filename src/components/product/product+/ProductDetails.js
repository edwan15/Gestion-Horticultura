// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import useRedirectLoggedOutUser from "../../../custom/useRedirect";
// import { selectIsLoggedIn } from "../../../features/auth/authSlice/authSlice";
// import { getProduct } from "../../../features/product/ProductSlice";
// import Loader from "../../../Util/Loader";
// import DOMPurify from "dompurify";

// const ProductDetails = () => {
//   useRedirectLoggedOutUser("/login");
//   const dispatch = useDispatch();

//   const { id } = useParams();

//   const isLoggedIn = useSelector(selectIsLoggedIn);

//   const { product, isLoading, isError, message } = useSelector(
//     (state) => state.product
//   );

//   useEffect(() => {
//     if (isLoggedIn === true) {
//       dispatch(getProduct(id));
//     }
//     if (isError) {
//       console.log(message);
//     }
//   }, [dispatch, isLoggedIn, isError, message, id]);

//   return (
//     <div className="flex justify-around items-start">
//       <div className="border-solid border-2 border-gray-700 max-w-lg rounded-lg m-4 p-4 bg-cardOverlay ">
//         <h3 className="text-lg  font-extrabold mb-3 border-solid border-b-2 shadow-lg  border-gray-500 ">
//           Detalles del Producto
//         </h3>
//         <div className="">
//           {isLoading && <Loader />}
//           {product && (
//             <div className="detail ">
//               <div className="flex justify-center items-center">
//                 {product?.image ? (
//                   <img
//                     src={product?.image.filePath}
//                     width={200}
//                     alt={product?.image.fileName}
//                   />
//                 ) : (
//                   <p>No image set for this product</p>
//                 )}
//               </div>
//               <h4 className="flex justify-center mt-6 mb-2 border-solid border-b-2 shadow-lg  border-gray-500 max-w-lg ">
//                 Product Availability:{" "}
//                 {product.stock > 0 ? (
//                   <p className="text-green-500 font-extrabold text-2xl ">
//                     {" "}
//                     In Stock{" "}
//                   </p>
//                 ) : (
//                   <p className="text-red-500 font-extrabold text-2xl">
//                     Out Stock
//                   </p>
//                 )}
//               </h4>
//               <hr />
//               <h4 className="mb-6 font-extrabold text-xl">
//                 <span className="text-red-500 font-extrabold text-xl mt-6  ">
//                   Name:{" "}
//                 </span>{" "}
//                 &nbsp; {product.name}
//               </h4>
//               <p>
//                 <b>&rarr; SKU : </b> {product.sku}
//               </p>
//               <p className="mt-4   mb-2 ">
//                 <b className="text-xl">&rarr; Category : </b> {product.category}
//               </p>
//               <div className="flex justify-center gap-10">
//                 <p className="text-xl">
//                   <b>&rarr; Entradas : </b> {"$"}
//                   {product.entradas}
//                 </p>
//                 <p>
//                   <b className="text-xl">&rarr; Salidas: </b> {product.salidas}
//                 </p>
//               </div>
//               <p className="mt-5">
//                 <b className="text-xl ">&rarr; Total Stock : </b> {"$"}
//                 {product.entradas - product.salidas}
//               </p>
//               <hr />
//               <div
//                 className="mt-4 border-solid border-b-2 shadow-lg  border-gray-500  mb-2 "
//                 dangerouslySetInnerHTML={{
//                   __html: DOMPurify.sanitize(product.description),
//                 }}
//               ></div>
//               <hr />
//               <code className="--color-dark">
//                 Created on: {product.createdAt.toLocaleString("en-US")}
//               </code>
//               <br />
//               <code className="--color-dark">
//                 Last Updated: {product.updatedAt.toLocaleString("en-US")}
//               </code>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;




// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import useRedirectLoggedOutUser from "../../../custom/useRedirect";
// import { selectIsLoggedIn } from "../../../features/auth/authSlice/authSlice";
// import { getProduct } from "../../../features/product/ProductSlice";
// import Loader from "../../../Util/Loader";
// import DOMPurify from "dompurify";

// const ProductDetails = () => {
//     useRedirectLoggedOutUser("/login");
//     const dispatch = useDispatch();

//     const { id } = useParams();

//     const isLoggedIn = useSelector(selectIsLoggedIn);

//     const { product, isLoading, isError, message } = useSelector(
//         (state) => state.product
//     );

//     useEffect(() => {
//         if (isLoggedIn === true) {
//             dispatch(getProduct(id));
//         }
//         if (isError) {
//             console.log(message);
//         }
//     }, [dispatch, isLoggedIn, isError, message, id]);

//     // 🛑 Manejo robusto de la carga y el producto no encontrado
//     if (isLoading) {
//         return <Loader />;
//     }

//     if (!product || Object.keys(product).length === 0) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <h1>Producto no encontrado o datos no disponibles.</h1>
//             </div>
//         );
//     }
    
//     // Convertir a números y calcular stock de forma segura
//     const entradas = Number(product.entradas) || 0;
//     const salidas = Number(product.salidas) || 0;
//     const totalStock = entradas - salidas;

//     return (
//         <div className="flex justify-around items-start">
//             <div className="border-solid border-2 border-gray-700 max-w-lg rounded-lg m-4 p-4 bg-cardOverlay ">
//                 <h3 className="text-lg font-extrabold mb-3 border-solid border-b-2 shadow-lg border-gray-500 ">
//                     Detalles del Producto
//                 </h3>
//                 <div className="">
//                     <div className="detail ">
//                         <div className="flex justify-center items-center">
//                             {/* ✅ CORRECCIÓN 1: Usar directamente product.image (URL String de Cloudinary) */}
//                             {product.image ? (
//                                 <img
//                                     src={product.image} 
//                                     width={200}
//                                     alt={product.name || "Product Image"}
//                                     className="object-cover rounded-md"
//                                 />
//                             ) : (
//                                 <p>No hay imagen para este producto.</p>
//                             )}
//                         </div>
//                         <h4 className="flex justify-center mt-6 mb-2 border-solid border-b-2 shadow-lg border-gray-500 max-w-lg ">
//                             Disponibilidad:{" "}
//                             {/* ✅ CORRECCIÓN 2: Usar el stock calculado */}
//                             {totalStock > 0 ? (
//                                 <p className="text-green-500 font-extrabold text-2xl ">
//                                     {" "}
//                                     En Stock{" "}
//                                 </p>
//                             ) : (
//                                 <p className="text-red-500 font-extrabold text-2xl">
//                                     Agotado
//                                 </p>
//                             )}
//                         </h4>
//                         <hr />
//                         <h4 className="mb-6 font-extrabold text-xl">
//                             <span className="text-red-500 font-extrabold text-xl mt-6">
//                                 Nombre:{" "}
//                             </span>{" "}
//                             &nbsp; {product.name}
//                         </h4>
//                         <p>
//                             <b>&rarr; SKU : </b> {product.sku}
//                         </p>
//                         <p className="mt-4 mb-2 ">
//                             <b className="text-xl">&rarr; Categoría : </b> {product.category}
//                         </p>
//                         <div className="flex justify-center gap-10">
//                             <p className="text-xl">
//                                 <b>&rarr; Entradas : </b> 
//                                 {/* Mostrar valores seguros */}
//                                 {entradas}
//                             </p>
//                             <p>
//                                 <b className="text-xl">&rarr; Salidas: </b> {salidas}
//                             </p>
//                         </div>
//                         <p className="mt-5">
//                             <b className="text-xl ">&rarr; Stock Total : </b> 
//                             {totalStock}
//                         </p>
//                         <hr />
//                         <div
//                             className="mt-4 border-solid border-b-2 shadow-lg border-gray-500 mb-2 "
//                             dangerouslySetInnerHTML={{
//                                 __html: DOMPurify.sanitize(product.description || ""),
//                             }}
//                         ></div>
//                         <hr />
//                         {/* ✅ CORRECCIÓN 3: Convertir string ISO (o timestamp) a objeto Date para usar toLocaleString */}
//                         <code className="--color-dark">
//                             Creado en: {new Date(product.createdAt).toLocaleString("es-ES")}
//                         </code>
//                         <br />
//                         <code className="--color-dark">
//                             Última Actualización: {new Date(product.updatedAt || product.createdAt).toLocaleString("es-ES")}
//                         </code>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductDetails;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../custom/useRedirect";
import { selectIsLoggedIn } from "../../../features/auth/authSlice/authSlice";
import { getProduct } from "../../../features/product/ProductSlice";
import Loader from "../../../Util/Loader";
import DOMPurify from "dompurify";
// 🛑 Importar Framer Motion
import { motion } from "framer-motion";
// 🛑 Importar Íconos (ejemplos de Font Awesome)
import { FaBoxOpen, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown, FaCube, FaTag, FaInfoCircle } from 'react-icons/fa';

// Definición de las variantes de animación para Framer Motion
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const ProductDetails = () => {
    useRedirectLoggedOutUser("/login");
    const dispatch = useDispatch();
    const { id } = useParams();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { product, isLoading, isError, message } = useSelector((state) => state.product);

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getProduct(id));
        }
        if (isError) {
            console.log(message);
        }
    }, [dispatch, isLoggedIn, isError, message, id]);

    if (isLoading) {
        return <Loader />;
    }

    if (!product || Object.keys(product).length === 0) {
        return (
            <div className="flex justify-center items-center h-48 text-gray-700">
                <FaInfoCircle className="w-6 h-6 mr-2" />
                <h1 className="text-xl font-semibold">Producto no encontrado o datos no disponibles.</h1>
            </div>
        );
    }
    
    // Convertir a números y calcular stock de forma segura
    const entradas = Number(product.entradas) || 0;
    const salidas = Number(product.salidas) || 0;
    const totalStock = entradas - salidas;
    const isAvailable = totalStock > 0;

    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const createdAtFormatted = new Date(product.createdAt).toLocaleString("es-ES", dateOptions);
    const updatedAtFormatted = new Date(product.updatedAt || product.createdAt).toLocaleString("es-ES", dateOptions);

    // Renderizado con Framer Motion y diseño avanzado
    return (
        // Contenedor principal con animación de entrada
        <motion.div
            className="p-4 sm:p-8 min-h-screen bg-gray-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 
                className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 sm:text-4xl"
                variants={itemVariants}
            >
                <FaBoxOpen className="inline-block mr-3 text-red-500" /> 
                Detalles del Producto: **{product.name}**
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Columna de Imagen y Disponibilidad (Responsive) --- */}
                <motion.div 
                    className="lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                    variants={itemVariants}
                >
                    <div className="flex justify-center items-center mb-6">
                        {product.image ? (
                            <motion.img
                                src={product.image} 
                                alt={product.name || "Product Image"}
                                className="w-full h-auto max-h-80 object-cover rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            />
                        ) : (
                            <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 border border-dashed border-gray-300">
                                No hay imagen disponible
                            </div>
                        )}
                    </div>
                    
                    <motion.div 
                        className={`flex items-center justify-center p-3 rounded-full text-white text-lg font-bold shadow-md transition-all duration-300 
                            ${isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        whileHover={{ scale: 1.05 }}
                        variants={itemVariants}
                    >
                        {isAvailable ? (
                            <>
                                <FaCheckCircle className="mr-2" />
                                <span className="text-xl">En Stock</span>
                            </>
                        ) : (
                            <>
                                <FaTimesCircle className="mr-2" />
                                <span className="text-xl">Agotado</span>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* --- Columna de Detalles (Responsive) --- */}
                <motion.div 
                    className="lg:w-2/3 bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Datos Principales</h3>
                    
                    {/* Fila de Datos Clave */}
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" variants={itemVariants}>
                        <DetailItem icon={<FaTag />} label="SKU" value={product.sku} />
                        <DetailItem icon={<FaCube />} label="Categoría" value={product.category} />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Inventario</h3>
                    
                    {/* Fila de Stock */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center" variants={itemVariants}>
                        <StockItem icon={<FaArrowUp />} label="Entradas" value={entradas} color="text-blue-600" />
                        <StockItem icon={<FaArrowDown />} label="Salidas" value={salidas} color="text-orange-600" />
                        <StockItem icon={<FaCube />} label="Stock Total" value={totalStock} color={isAvailable ? "text-green-600" : "text-red-600"} />
                    </motion.div>

                    {/* Descripción */}
                    <h3 className="text-2xl font-bold text-gray-700 mb-3 border-b pb-2">Descripción</h3>
                    <motion.div 
                        className="p-4 bg-gray-50 rounded-lg shadow-inner text-gray-700 leading-relaxed"
                        variants={itemVariants}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(product.description || "<p>No se ha proporcionado una descripción.</p>"),
                        }}
                    ></motion.div>

                    {/* Fechas */}
                    <h3 className="text-2xl font-bold text-gray-700 mb-3 mt-6 border-b pb-2">Historial</h3>
                    <motion.div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 mt-4 space-y-2 sm:space-y-0" variants={itemVariants}>
                        <DateItem label="Creado" date={createdAtFormatted} />
                        <DateItem label="Última Actualización" date={updatedAtFormatted} />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- Componentes Auxiliares (Para mayor claridad y reusabilidad) ---

const DetailItem = ({ icon, label, value }) => (
    <motion.p className="flex items-center text-lg text-gray-700 bg-gray-100 p-3 rounded-md font-medium" variants={itemVariants}>
        <span className="mr-3 text-red-500">{icon}</span> 
        **{label}:** <span className="ml-2 font-semibold text-gray-800">{value}</span>
    </motion.p>
);

const StockItem = ({ icon, label, value, color }) => (
    <motion.div 
        className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
    >
        <div className={`text-4xl ${color} mb-2`}>{icon}</div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </motion.div>
);

const DateItem = ({ label, date }) => (
    <motion.p className="flex items-center text-sm text-gray-600" variants={itemVariants}>
        <FaCalendarAlt className="mr-2 text-red-400" />
        **{label}**: <span className="ml-1 font-mono">{date}</span>
    </motion.p>
);

export default ProductDetails;