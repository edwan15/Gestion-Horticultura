// import React from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { RiProductHuntFill } from "react-icons/ri";
// import { BiCategoryAlt } from "react-icons/bi";
// import { VscSignIn, VscSignOut } from "react-icons/vsc";
// import { FaPlus, FaMinus } from "react-icons/fa"; // Nuevos íconos para Ingreso/Egreso

// const ProductForm = ({
//   product,
//   productImage,
//   imagePreview,
//   description,
//   setDescription,
//   handleInputChange,
//   handleImageChange,
//   saveProduct,
//   // *** NUEVAS PROPS NECESARIAS DEL COMPONENTE PADRE ***
//   ingreso_cantidad, // Cantidad a ingresar (estado temporal)
//   egreso_cantidad,  // Cantidad a egresar (estado temporal)
//   handleStockChange, // Función para manejar los cambios de Ingreso/Egreso
// }) => {
  
//   // Función auxiliar para obtener el valor numérico o 0 si no es válido
//   const getNumericValue = (value) => parseInt(value, 10) || 0;

//   // 1. Stock Base (el que viene de 'entradas' - 'salidas')
//   const baseEntradas = getNumericValue(product?.entradas);
//   const baseSalidas = getNumericValue(product?.salidas);
//   const baseStock = baseEntradas - baseSalidas;

//   // 2. Transacciones temporales
//   const ingresoDelta = getNumericValue(ingreso_cantidad);
//   const egresoDelta = getNumericValue(egreso_cantidad);

//   // 3. Stock Final Calculado en tiempo real
//   const stockFinal = baseStock + ingresoDelta - egresoDelta;


//   return (
//     // CONTENEDOR PRINCIPAL
//     <div className="w-full border-solid border-2 rounded-lg shadow-xl bg-cardOverlay">
//       <div className="flex justify-start items-start p-4 text-lg">
//         <form onSubmit={saveProduct} className="w-full">
          
//           {/* SECCIÓN IMAGEN */}
//           <div className="flex flex-col border-solid border-2 border-gray-400 rounded-md p-4 mb-6 w-full">
//             <label className="mb-2 font-bold text-gray-700">Imagen del Producto</label>
//             <code className="font-medium mb-3 text-sm text-gray-500">
//               Supported Formats: jpg, jpeg, png
//             </code>
//             <input
//               className="border-solid p-2 rounded-md mb-3 border-gray-400 border-2 w-full text-sm"
//               type="file"
//               name="image"
//               onChange={(e) => handleImageChange(e)}
//             />

//             {imagePreview != null ? (
//               <div className="justify-center flex mt-2">
//                 <img 
//                     src={imagePreview} 
//                     alt="product preview" 
//                     // className="max-w-full h-auto rounded-md shadow-md"
//                     style={{ maxHeight: "200px", width: "auto" }}
//                 className="mx-auto rounded-md shadow-lg"
//                 />
//               </div>
//             ) : (
//               <p className="text-center text-sm text-gray-500">No image set for this product.</p>
//             )}
//           </div>

//           {/* SECCIÓN DE CAMPOS DE ENTRADA */}
//           <div className="flex flex-col p-4 w-full">
            
//             {/* 1. Nombre y Categoría */}
//             <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//               <RiProductHuntFill className="text-xl text-indigo-500" /> Nombre Producto:
//             </label>
//             <input
//               className="outline-none rounded-md shadow-sm mb-4 p-2 border border-gray-300 w-full"
//               type="text"
//               placeholder=" Nombre del Producto"
//               name="name"
//               value={product?.name || ''}
//               onChange={handleInputChange}
//             />

//             <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//               <BiCategoryAlt className="text-xl text-indigo-500" /> Categoria Producto
//             </label>
//             <input
//               required
//               className="outline-none rounded-md shadow-sm mb-4 p-2 border border-gray-300 w-full"
//               type="text"
//               placeholder=" Categoria Producto"
//               name="category"
//               value={product?.category || ''}
//               onChange={handleInputChange}
//             />

//             <hr className="my-4"/>
//             <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-1">Stock Base Histórico</h3>

//             {/* 2. ENTRADAS Y SALIDAS (Campos base para el historial) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              
//               {/* Entradas Base */}
//               <div>
//                 <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//                   <VscSignIn className="text-xl text-green-500" /> Entradas Totales:
//                 </label>
//                 <input
//                   className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full bg-gray-50"
//                   type="number"
//                   placeholder=" Entradas"
//                   name="entradas"
//                   value={product?.entradas || 0}
//                   onChange={handleInputChange} // Usar handleInputChange para los campos base
//                 />
//               </div>
              
//               {/* Salidas Base */}
//               <div>
//                 <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//                   <VscSignOut className="text-xl text-red-500" /> Salidas Totales:
//                 </label>
//                 <input
//                   className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full bg-gray-50"
//                   type="number"
//                   placeholder=" Salidas"
//                   name="salidas"
//                   value={product?.salidas || 0}
//                   onChange={handleInputChange} // Usar handleInputChange para los campos base
//                 />
//               </div>
//             </div>
            
//             <hr className="my-4"/>
//             <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-1">Transacción Rápida</h3>

//             {/* 3. INGRESAR Y EGRESAR (Campos funcionales para modificar) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
//                 {/* Campo Ingresar */}
//                 <div>
//                     <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//                         <FaPlus className="text-sm text-blue-500" /> Cantidad a **INGRESAR**
//                     </label>
//                     <input
//                         className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full"
//                         type="number"
//                         placeholder=" Ingreso (+)"
//                         name="ingreso_cantidad"
//                         value={ingreso_cantidad}
//                         onChange={handleStockChange} // Usar la nueva función para Ingreso/Egreso
//                     />
//                 </div>
                
//                 {/* Campo Egresar */}
//                 <div>
//                     <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
//                         <FaMinus className="text-sm text-orange-500" /> Cantidad a **EGRESAR**
//                     </label>
//                     <input
//                         className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full"
//                         type="number"
//                         placeholder=" Egreso (-)"
//                         name="egreso_cantidad"
//                         value={egreso_cantidad}
//                         onChange={handleStockChange} // Usar la nueva función para Ingreso/Egreso
//                     />
//                 </div>
//             </div>

//             {/* 4. Stock Actual Calculado */}
//             <div className="mt-6 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-md">
//                 <p className="text-sm text-gray-700 font-medium mb-1">Stock Base (Entradas - Salidas): <span className="font-bold text-indigo-700">{baseStock}</span></p>
//                 <p className="text-sm text-gray-700 font-medium mb-3">Transacción: <span className="text-green-500 font-bold">+{ingresoDelta}</span> / <span className="text-red-500 font-bold">-{egresoDelta}</span></p>

//                 <div className="text-gray-700 text-lg font-bold">
//                     STOCK FINAL:
//                     <span className={`font-extrabold text-2xl ml-2 ${stockFinal < 0 ? 'text-red-600' : 'text-green-600'}`}>
//                         {stockFinal}
//                     </span>
//                 </div>
//             </div>
//           </div>

//           {/* SECCIÓN DESCRIPCIÓN (ReactQuill) */}
//           <div className="p-4 w-full">
//             <label className="mb-2 block text-gray-700 font-medium">Descripción del Producto:</label>
//             <ReactQuill
//               theme="snow"
//               value={description}
//               onChange={setDescription}
//               modules={ProductForm.modules}
//               formats={ProductForm.formats}
//               className="w-full"
//             />
//           </div>

//           {/* SECCIÓN BOTÓN */}
//           <div className="p-4 w-full">
//             <button
//               className="w-full mt-2 p-3 bg-red-500 text-white font-bold rounded-md shadow-lg hover:bg-red-600 transition-colors duration-200"
//               type="submit"
//             >
//               Save Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ... (Módulos y formatos de ReactQuill se mantienen sin cambios) ...
// ProductForm.modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ align: [] }],
//     [{ color: [] }, { background: [] }],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["clean"],
//   ],
// };
// ProductForm.formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "color",
//   "background",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "video",
//   "image",
//   "code-block",
//   "align",
// ];

// export default ProductForm;




import React from "react";
import { motion } from "framer-motion"; // 👈 Importamos motion para las animaciones
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiProductHuntFill, RiGalleryLine } from "react-icons/ri"; // Nuevo ícono para Imagen
import { BiCategoryAlt, BiDollar } from "react-icons/bi"; // Nuevo ícono para Precio (asumo que podría ser útil)
import { VscSignIn, VscSignOut, VscArchive } from "react-icons/vsc"; // Nuevo ícono para Stock Final
import { FaPlusCircle, FaMinusCircle, FaSave } from "react-icons/fa"; // Íconos mejorados

// --- Componente de Tarjeta de Sección con Animación (Para mayor profesionalismo) ---
const AnimatedCard = ({ children, title, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 mb-6"
  >
    <h2 className="flex items-center text-xl font-extrabold text-indigo-700 mb-4 border-b pb-2">
      <Icon className="mr-2 text-2xl text-indigo-500" />
      {title}
    </h2>
    {children}
  </motion.div>
);

const ProductForm = ({
  product,
  productImage, // Se mantiene por si se usa en el padre, pero la lógica de la imagen está aquí
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
  // *** PROPS NECESARIAS DEL COMPONENTE PADRE ***
  ingreso_cantidad,
  egreso_cantidad,
  handleStockChange,
}) => {
  // Función auxiliar para obtener el valor numérico o 0 si no es válido
  const getNumericValue = (value) => parseInt(value, 10) || 0;

  // 1. Stock Base (el que viene de 'entradas' - 'salidas')
  const baseEntradas = getNumericValue(product?.entradas);
  const baseSalidas = getNumericValue(product?.salidas);
  const baseStock = baseEntradas - baseSalidas;

  // 2. Transacciones temporales
  const ingresoDelta = getNumericValue(ingreso_cantidad);
  const egresoDelta = getNumericValue(egreso_cantidad);

  // 3. Stock Final Calculado en tiempo real
  const stockFinal = baseStock + ingresoDelta - egresoDelta;

  // Variantes para animación del botón de Stock Final
  const stockVariants = {
    blink: { 
      scale: [1, 1.05, 1], 
      color: stockFinal < 0 ? "#dc2626" : "#16a34a", // Rojo/Verde
      transition: { duration: 0.5, repeat: 1 } 
    },
  };

  // Variantes para animación del botón de Guardar
  const saveButtonVariants = {
    hover: { scale: 1.02, backgroundColor: "#ef4444", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 },
  };

  return (
    // CONTENEDOR PRINCIPAL con animación de entrada
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4 md:p-8"
    >
      <form onSubmit={saveProduct} className="w-full">
        
        {/* SECCIÓN 1: Detalles Básicos e Imagen */}
        <AnimatedCard title="Detalles del Producto" icon={RiProductHuntFill}>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Columna de Campos de Texto */}
            <div>
              {/* Nombre y Categoría */}
              <div className="mb-4">
                <label className="flex items-center mb-1 text-gray-700 font-medium">
                  <RiProductHuntFill className="text-xl text-indigo-500 mr-2" /> Nombre:
                </label>
                <input
                  className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border border-gray-300 w-full transition-all duration-200"
                  type="text"
                  placeholder="Nombre del Producto"
                  name="name"
                  value={product?.name || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center mb-1 text-gray-700 font-medium">
                  <BiCategoryAlt className="text-xl text-indigo-500 mr-2" /> Categoría:
                </label>
                <input
                  required
                  className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border border-gray-300 w-full transition-all duration-200"
                  type="text"
                  placeholder="Categoría del Producto"
                  name="category"
                  value={product?.category || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Se puede añadir un campo de precio si es relevante */}
              {/* <div className="mb-4">
                <label className="flex items-center mb-1 text-gray-700 font-medium">
                  <BiDollar className="text-xl text-indigo-500 mr-2" /> Precio:
                </label>
                <input
                  className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border border-gray-300 w-full transition-all duration-200"
                  type="number"
                  placeholder="0.00"
                  name="price"
                  value={product?.price || ''}
                  onChange={handleInputChange}
                />
              </div> */}
            </div>

            {/* Columna de Imagen */}
            <div className="flex flex-col items-center justify-start p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors duration-300">
              <label className="flex items-center mb-2 font-bold text-gray-700">
                <RiGalleryLine className="text-2xl text-indigo-500 mr-2" /> Imagen
              </label>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="w-full flex flex-col items-center"
              >
                <input
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer mb-4"
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                />
              </motion.div>
              
              {imagePreview ? (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={imagePreview} 
                  alt="product preview" 
                  className="max-w-full h-auto rounded-xl shadow-lg border-2 border-indigo-200 object-cover mt-2"
                  style={{ maxHeight: "150px" }}
                />
              ) : (
                <p className="text-center text-sm text-gray-400 mt-2">Sube una imagen para previsualizarla.</p>
              )}
            </div>
          </div>
        </AnimatedCard>

        {/* SECCIÓN 2: Gestión de Stock y Transacciones */}
        <AnimatedCard title="Gestión de Stock (Inventario)" icon={VscArchive}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMNA 1: Stock Histórico */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">Historial Base</h4>
              
              {/* Entradas Base */}
              <div className="mb-3">
                <label className="flex items-center mb-1 text-gray-600 text-sm">
                  <VscSignIn className="text-xl text-green-600 mr-2" /> Entradas Totales:
                </label>
                <input
                  className="outline-none rounded-md shadow-inner p-2 border border-gray-200 w-full bg-white text-lg font-bold"
                  type="number"
                  name="entradas"
                  value={product?.entradas || 0}
                  onChange={handleInputChange}
                  readOnly={false} // Se deja editable o se puede hacer readOnly
                />
              </div>
              
              {/* Salidas Base */}
              <div>
                <label className="flex items-center mb-1 text-gray-600 text-sm">
                  <VscSignOut className="text-xl text-red-600 mr-2" /> Salidas Totales:
                </label>
                <input
                  className="outline-none rounded-md shadow-inner p-2 border border-gray-200 w-full bg-white text-lg font-bold"
                  type="number"
                  name="salidas"
                  value={product?.salidas || 0}
                  onChange={handleInputChange}
                  readOnly={false} // Se deja editable o se puede hacer readOnly
                />
              </div>
            </div>

            {/* COLUMNA 2: Transacción Rápida */}
            <div className="lg:col-span-2 p-4 bg-white rounded-lg border border-indigo-200 shadow-md">
              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">Transacción en Curso</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Campo Ingresar */}
                <motion.div whileHover={{ scale: 1.01 }} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                  <label className="flex items-center mb-1 text-gray-700 font-medium">
                    <FaPlusCircle className="text-lg text-blue-600 mr-2" /> Cantidad a **INGRESAR**
                  </label>
                  <input
                    className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border border-blue-300 w-full text-xl font-bold"
                    type="number"
                    placeholder="0"
                    name="ingreso_cantidad"
                    value={ingreso_cantidad}
                    onChange={handleStockChange}
                  />
                </motion.div>
                
                {/* Campo Egresar */}
                <motion.div whileHover={{ scale: 1.01 }} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <label className="flex items-center mb-1 text-gray-700 font-medium">
                    <FaMinusCircle className="text-lg text-red-600 mr-2" /> Cantidad a **EGRESAR**
                  </label>
                  <input
                    className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 p-2 border border-red-300 w-full text-xl font-bold"
                    type="number"
                    placeholder="0"
                    name="egreso_cantidad"
                    value={egreso_cantidad}
                    onChange={handleStockChange}
                  />
                </motion.div>
              </div>

              {/* 4. Stock Actual Calculado (Destacado y Animado) */}
              <motion.div 
                animate={ingresoDelta !== 0 || egresoDelta !== 0 ? "blink" : ""} // Se anima al cambiar
                variants={stockVariants}
                className="mt-6 p-4 text-center border-4 rounded-xl shadow-inner"
                style={{
                  borderColor: stockFinal < 0 ? '#fca5a5' : '#bbf7d0', // Color del borde según el estado
                  backgroundColor: stockFinal < 0 ? '#fee2e2' : '#f0fff4',
                }}
              >
                <p className="text-sm text-gray-700 font-medium mb-1">
                    Base: <span className="font-bold text-indigo-700">{baseStock}</span> 
                    &bull; Transacción: <span className="text-green-500 font-bold">+{ingresoDelta}</span> / <span className="text-red-500 font-bold">-{egresoDelta}</span>
                </p>

                <div className="text-gray-700 text-xl font-extrabold flex justify-center items-center">
                    STOCK FINAL:
                    <motion.span
                        className={`font-extrabold text-4xl ml-3`}
                        style={{ color: stockFinal < 0 ? '#dc2626' : '#16a34a' }} // Color dinámico
                    >
                        {stockFinal}
                    </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedCard>
        
        {/* SECCIÓN 3: Descripción (ReactQuill) */}
        <AnimatedCard title="Descripción Detallada" icon={BiCategoryAlt}>
          <label className="mb-2 block text-gray-700 font-medium">Contenido:</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={ProductForm.modules}
            formats={ProductForm.formats}
            className="w-full h-64 mb-10 border-gray-300 rounded-lg shadow-md"
          />
        </AnimatedCard>

        {/* SECCIÓN BOTÓN */}
        <div className="mt-8">
          <motion.button
            variants={saveButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full p-4 bg-red-500 text-white text-xl font-extrabold rounded-xl shadow-xl transition-all duration-300 flex justify-center items-center"
            type="submit"
          >
            <FaSave className="mr-3 text-2xl" /> GUARDAR PRODUCTO
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// ... (Módulos y formatos de ReactQuill se mantienen sin cambios) ...
ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;