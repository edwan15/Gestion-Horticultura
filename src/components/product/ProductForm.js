import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiProductHuntFill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { VscSignIn, VscSignOut } from "react-icons/vsc";
import { FaPlus, FaMinus } from "react-icons/fa"; // Nuevos íconos para Ingreso/Egreso

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveProduct,
  // *** NUEVAS PROPS NECESARIAS DEL COMPONENTE PADRE ***
  ingreso_cantidad, // Cantidad a ingresar (estado temporal)
  egreso_cantidad,  // Cantidad a egresar (estado temporal)
  handleStockChange, // Función para manejar los cambios de Ingreso/Egreso
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


  return (
    // CONTENEDOR PRINCIPAL
    <div className="w-full border-solid border-2 rounded-lg shadow-xl bg-cardOverlay">
      <div className="flex justify-start items-start p-4 text-lg">
        <form onSubmit={saveProduct} className="w-full">
          
          {/* SECCIÓN IMAGEN */}
          <div className="flex flex-col border-solid border-2 border-gray-400 rounded-md p-4 mb-6 w-full">
            <label className="mb-2 font-bold text-gray-700">Imagen del Producto</label>
            <code className="font-medium mb-3 text-sm text-gray-500">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              className="border-solid p-2 rounded-md mb-3 border-gray-400 border-2 w-full text-sm"
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className="justify-center flex mt-2">
                <img 
                    src={imagePreview} 
                    alt="product preview" 
                    // className="max-w-full h-auto rounded-md shadow-md"
                    style={{ maxHeight: "200px", width: "auto" }}
                className="mx-auto rounded-md shadow-lg"
                />
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">No image set for this product.</p>
            )}
          </div>

          {/* SECCIÓN DE CAMPOS DE ENTRADA */}
          <div className="flex flex-col p-4 w-full">
            
            {/* 1. Nombre y Categoría */}
            <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
              <RiProductHuntFill className="text-xl text-indigo-500" /> Nombre Producto:
            </label>
            <input
              className="outline-none rounded-md shadow-sm mb-4 p-2 border border-gray-300 w-full"
              type="text"
              placeholder=" Nombre del Producto"
              name="name"
              value={product?.name || ''}
              onChange={handleInputChange}
            />

            <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
              <BiCategoryAlt className="text-xl text-indigo-500" /> Categoria Producto
            </label>
            <input
              required
              className="outline-none rounded-md shadow-sm mb-4 p-2 border border-gray-300 w-full"
              type="text"
              placeholder=" Categoria Producto"
              name="category"
              value={product?.category || ''}
              onChange={handleInputChange}
            />

            <hr className="my-4"/>
            <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-1">Stock Base Histórico</h3>

            {/* 2. ENTRADAS Y SALIDAS (Campos base para el historial) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              
              {/* Entradas Base */}
              <div>
                <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
                  <VscSignIn className="text-xl text-green-500" /> Entradas Totales:
                </label>
                <input
                  className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full bg-gray-50"
                  type="number"
                  placeholder=" Entradas"
                  name="entradas"
                  value={product?.entradas || 0}
                  onChange={handleInputChange} // Usar handleInputChange para los campos base
                />
              </div>
              
              {/* Salidas Base */}
              <div>
                <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
                  <VscSignOut className="text-xl text-red-500" /> Salidas Totales:
                </label>
                <input
                  className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full bg-gray-50"
                  type="number"
                  placeholder=" Salidas"
                  name="salidas"
                  value={product?.salidas || 0}
                  onChange={handleInputChange} // Usar handleInputChange para los campos base
                />
              </div>
            </div>
            
            <hr className="my-4"/>
            <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-1">Transacción Rápida</h3>

            {/* 3. INGRESAR Y EGRESAR (Campos funcionales para modificar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Campo Ingresar */}
                <div>
                    <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
                        <FaPlus className="text-sm text-blue-500" /> Cantidad a **INGRESAR**
                    </label>
                    <input
                        className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full"
                        type="number"
                        placeholder=" Ingreso (+)"
                        name="ingreso_cantidad"
                        value={ingreso_cantidad}
                        onChange={handleStockChange} // Usar la nueva función para Ingreso/Egreso
                    />
                </div>
                
                {/* Campo Egresar */}
                <div>
                    <label className="gap-2 flex items-center mb-1 text-gray-700 font-medium">
                        <FaMinus className="text-sm text-orange-500" /> Cantidad a **EGRESAR**
                    </label>
                    <input
                        className="outline-none rounded-md shadow-sm p-2 border border-gray-300 w-full"
                        type="number"
                        placeholder=" Egreso (-)"
                        name="egreso_cantidad"
                        value={egreso_cantidad}
                        onChange={handleStockChange} // Usar la nueva función para Ingreso/Egreso
                    />
                </div>
            </div>

            {/* 4. Stock Actual Calculado */}
            <div className="mt-6 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-md">
                <p className="text-sm text-gray-700 font-medium mb-1">Stock Base (Entradas - Salidas): <span className="font-bold text-indigo-700">{baseStock}</span></p>
                <p className="text-sm text-gray-700 font-medium mb-3">Transacción: <span className="text-green-500 font-bold">+{ingresoDelta}</span> / <span className="text-red-500 font-bold">-{egresoDelta}</span></p>

                <div className="text-gray-700 text-lg font-bold">
                    STOCK FINAL:
                    <span className={`font-extrabold text-2xl ml-2 ${stockFinal < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {stockFinal}
                    </span>
                </div>
            </div>
          </div>

          {/* SECCIÓN DESCRIPCIÓN (ReactQuill) */}
          <div className="p-4 w-full">
            <label className="mb-2 block text-gray-700 font-medium">Descripción del Producto:</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={ProductForm.modules}
              formats={ProductForm.formats}
              className="w-full"
            />
          </div>

          {/* SECCIÓN BOTÓN */}
          <div className="p-4 w-full">
            <button
              className="w-full mt-2 p-3 bg-red-500 text-white font-bold rounded-md shadow-lg hover:bg-red-600 transition-colors duration-200"
              type="submit"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
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
