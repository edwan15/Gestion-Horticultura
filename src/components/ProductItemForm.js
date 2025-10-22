import React from 'react'
import {PRODUCT_CATALOG} from '../Util/util'
import InputField from './InputField';

const ProductItemForm = React.memo(
  ({ item, index, handleItemChange, handleItemBlur, deleteItem }) => {
    const factorAValue = item.productName
      ? PRODUCT_CATALOG[item.productName]
      : parseFloat(item.factorA) || 0;

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        handleItemChange(item.id, "imageUrl", reader.result);
      };
      reader.readAsDataURL(file);
    };

    const handleProductNameChange = (e) => {
      const newProductName = e.target.value;
      const newFactorA = PRODUCT_CATALOG[newProductName] || 0;

      handleItemChange(item.id, "productName", newProductName, newFactorA);
    };

    const isBase64Image =
      item.imageUrl && item.imageUrl.startsWith("data:image");

    return (
      <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
          <h4 className="text-xl font-bold text-indigo-700">
            Producto #{index + 1}
          </h4>
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
            aria-label="Eliminar producto"
          >
            {/* Icono de papelera */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* 1. CAMPO NOMBRE DEL PRODUCTO (SELECT) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <select
            value={item.productName || ""}
            onChange={handleProductNameChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition bg-white"
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {Object.keys(PRODUCT_CATALOG).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. CAMPOS DE CÁLCULO */}
        <div className="grid grid-cols-2 gap-4">
          {/* Factor A: SÓLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso(kg) (Automático)
            </label>
            <input
              type="text"
              value={factorAValue}
              readOnly
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
            />
          </div>

          {/* Factor B: INPUT NORMAL */}
          <InputField
            label="Cajas (Ingresar)"
            value={item.factorB}
            field="factorB"
            type="number"
            placeholder="0"
            item={item}
            handleItemChange={handleItemChange}
            handleItemBlur={handleItemBlur}
          />
        </div>

        {/* 3. CAMPO DE SUBIDA DE IMAGEN LOCAL */}
        <div className="border border-indigo-300 rounded-lg p-3 bg-white">
          <label
            htmlFor={`image-upload-${item.id}`}
            className="block text-sm font-medium text-indigo-700 mb-2"
          >
            Documentación Visual (Imagen)
          </label>
          <input
            type="file"
            id={`image-upload-${item.id}`}
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            className="hidden"
          />
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                document.getElementById(`image-upload-${item.id}`).click()
              }
              className="py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition flex items-center text-sm"
            >
              {/* Icono de subida */}
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                ></path>
              </svg>
              Seleccionar Imagen
            </button>

            {item.imageUrl && (
              <button
                type="button"
                onClick={() => handleItemChange(item.id, "imageUrl", "")}
                className="text-red-500 text-sm hover:text-red-700 transition"
              >
                Quitar Imagen
              </button>
            )}
          </div>

          {item.imageUrl && (
            <div className="mt-3 p-2 border border-gray-200 rounded-lg text-center bg-gray-50">
              <p className="text-xs text-gray-600 mb-1 font-semibold">
                Previsualización (Máx 200px):
              </p>
              <img
                src={item.imageUrl}
                alt={`Imagen de ${item.productName || "Producto"}`}
                style={{ maxHeight: "200px", width: "auto" }}
                className="mx-auto rounded-md shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.style.display = "none";
                  console.error(
                    "Error al cargar la imagen. Puede que sea un Base64 corrupto o no válido."
                  );
                }}
              />
              {isBase64Image && (
                <p className="text-xs text-amber-600 font-bold mt-2">
                  La imagen se subirá al guardar.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 4. RESULTADO */}
        <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-300">
          <p className="text-sm font-medium text-indigo-800">Resultado (Kg):</p>
          <p className="text-xl font-bold text-indigo-900 mt-1">
            {parseFloat(factorAValue || 0)} * {parseFloat(item.factorB || 0)} ={" "}
            <span className="text-green-700">{item.result || "0.00"}</span>
            Kg
          </p>
        </div>
      </div>
    );
  }
);

export default ProductItemForm








// import React from 'react';
// import { PRODUCT_CATALOG } from '../Util/util';
// import InputField from './InputField';

// const ProductItemForm = React.memo(
//   ({ item, index, handleItemChange, handleItemBlur, deleteItem }) => {
//     const factorAValue = item.productName
//       ? PRODUCT_CATALOG[item.productName]
//       : parseFloat(item.factorA) || 0;

//     const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         // item.id ya se está usando correctamente aquí
//         handleItemChange(item.id, 'imageUrl', reader.result);
//       };
//       reader.readAsDataURL(file);
//     };

//     const handleProductNameChange = (e) => {
//       const newProductName = e.target.value;
//       const newFactorA = PRODUCT_CATALOG[newProductName] || 0;

//       // item.id ya se está usando correctamente aquí
//       handleItemChange(item.id, 'productName', newProductName, newFactorA);
//     };

//     const isBase64Image =
//       item.imageUrl && item.imageUrl.startsWith('data:image');

//     return (
//       <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl shadow-md space-y-4">
//         {/* Encabezado y Botón de Eliminar */}
//         <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
//           <h4 className="text-xl font-bold text-indigo-700">
//             Producto #{index + 1}
//           </h4>
//           <button
//             type="button"
//             // item.id ya se está usando correctamente aquí
//             onClick={() => deleteItem(item.id)}
//             className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
//             aria-label="Eliminar producto"
//           >
//             {/* Icono de papelera */}
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* 1. CAMPO NOMBRE DEL PRODUCTO (SELECT) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nombre del Producto
//           </label>
//           <select
//             value={item.productName || ''}
//             onChange={handleProductNameChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition bg-white"
//           >
//             <option value="" disabled>
//               Selecciona un producto
//             </option>
//             {Object.keys(PRODUCT_CATALOG).map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 2. CAMPOS DE CÁLCULO */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Factor A: SÓLO LECTURA */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Peso(kg) (Automático)
//             </label>
//             <input
//               type="text"
//               value={factorAValue}
//               readOnly
//               placeholder="0"
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
//             />
//           </div>

//           {/* Factor B: INPUT NORMAL */}
//           <InputField
//             label="Cajas (Ingresar)"
//             value={item.factorB}
//             field="factorB"
//             // ⚠️ CORRECCIÓN DE DECIMALES: Cambiamos a text para evitar que el input se "congele"
//             type="text" 
//             inputMode="decimal"
//             placeholder="0"
//             item={item} // Pasamos item para que InputField pueda obtener item.id internamente
//             handleItemChange={handleItemChange}
//             handleItemBlur={handleItemBlur}
//           />
//         </div>

//         {/* 3. CAMPO DE SUBIDA DE IMAGEN LOCAL */}
//         <div className="border border-indigo-300 rounded-lg p-3 bg-white">
//           <label className="block text-sm font-medium text-indigo-700 mb-2">
//             Documentación Visual (Imagen)
//           </label>
//           <input
//             type="file"
//             id={`image-upload-${item.id}`}
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />

//           {/* CONTENEDOR FLEXIBLE Y CENTRADO DE BOTONES */}
//           <div className={`flex flex-col sm:flex-row items-stretch ${item.imageUrl ? 'sm:justify-between' : 'sm:justify-start'} space-y-3 sm:space-y-0 sm:space-x-3`}>
//             
//             {/* Botón Principal (Seleccionar/Cambiar) */}
//             <button
//               type="button"
//               onClick={() =>
//                 document.getElementById(`image-upload-${item.id}`).click()
//               }
//               className="w-full sm:w-auto py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition flex items-center justify-center text-sm font-semibold"
//             >
//               {/* Icono de subida */}
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
//                 />
//               </svg>
//               {item.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
//             </button>

//             {item.imageUrl && (
//               /* Botón Secundario (Quitar) */
//               <button
//                 type="button"
//                 // item.id ya se está usando correctamente aquí
//                 onClick={() => handleItemChange(item.id, 'imageUrl', '')}
//                 className="w-full sm:w-auto py-2 px-4 bg-red-50 text-red-600 rounded-lg shadow-md hover:bg-red-100 transition flex items-center justify-center text-sm font-semibold border border-red-200"
//               >
//                 {/* Icono de X para quitar */}
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
//                 </svg>
//                 Quitar Imagen
//               </button>
//             )}
//           </div>

//           {item.imageUrl && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-lg text-center bg-gray-50">
//               <p className="text-xs text-gray-600 mb-2 font-semibold">
//                 Previsualización (Máx 200px):
//               </p>
//               <img
//                 src={item.imageUrl}
//                 alt={`Imagen de ${item.productName || 'Producto'}`}
//                 style={{ maxHeight: '200px', width: 'auto' }}
//                 className="mx-auto rounded-md shadow-lg w-full object-contain"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = '';
//                   e.target.style.display = 'none';
//                   console.error(
//                     'Error al cargar la imagen. Puede que sea un Base64 corrupto o no válido.'
//                   );
//                 }}
//               />
//               {isBase64Image && (
//                 <p className="text-xs text-amber-600 font-bold mt-3">
//                   La imagen se subirá al guardar (Base64 detectado).
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* 4. RESULTADO */}
//         <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-300">
//           <p className="text-sm font-medium text-indigo-800">Resultado (Kg):</p>
//           <p className="text-xl font-bold text-indigo-900 mt-1">
//             {parseFloat(factorAValue || 0)} * {parseFloat(item.factorB || 0)} ={' '}
//             <span className="text-green-700">{item.result || '0.00'}</span>
//             Kg
//           </p>
//         </div>
//       </div>
//     );
//   }
// );

// export default ProductItemForm;
























// import React from 'react';
// import { PRODUCT_CATALOG } from '../Util/util';
// import InputField from './InputField';

// const ProductItemForm = React.memo(
//   ({ item, index, handleItemChange, handleItemBlur, deleteItem }) => {
//     const factorAValue = item.productName
//       ? PRODUCT_CATALOG[item.productName]
//       : parseFloat(item.factorA) || 0;

//     const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         // item.id ya se está usando correctamente aquí
//         handleItemChange(item.id, 'imageUrl', reader.result);
//       };
//       reader.readAsDataURL(file);
//     };

//     const handleProductNameChange = (e) => {
//       const newProductName = e.target.value;
//       const newFactorA = PRODUCT_CATALOG[newProductName] || 0;

//       // item.id ya se está usando correctamente aquí
//       handleItemChange(item.id, 'productName', newProductName, newFactorA);
//     };

//     const isBase64Image =
//       item.imageUrl && item.imageUrl.startsWith('data:image');

//     return (
//       <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl shadow-md space-y-4">
//         {/* Encabezado y Botón de Eliminar */}
//         <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
//           <h4 className="text-xl font-bold text-indigo-700">
//             Producto #{index + 1}
//           </h4>
//           <button
//             type="button"
//             // item.id ya se está usando correctamente aquí
//             onClick={() => deleteItem(item.id)}
//             className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
//             aria-label="Eliminar producto"
//           >
//             {/* Icono de papelera */}
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* 1. CAMPO NOMBRE DEL PRODUCTO (SELECT) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nombre del Producto
//           </label>
//           <select
//             value={item.productName || ''}
//             onChange={handleProductNameChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition bg-white"
//           >
//             <option value="" disabled>
//               Selecciona un producto
//             </option>
//             {Object.keys(PRODUCT_CATALOG).map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 2. CAMPOS DE CÁLCULO */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Factor A: SÓLO LECTURA */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Peso(kg) (Automático)
//             </label>
//             <input
//               type="text"
//               value={factorAValue}
//               readOnly
//               placeholder="0"
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
//             />
//           </div>

//           {/* Factor B: INPUT NORMAL */}
//           <InputField
//             label="Cajas (Ingresar)"
//             value={item.factorB}
//             field="factorB"
//             // ⚠️ CORRECCIÓN DE DECIMALES: Cambiamos a text para evitar que el input se "congele"
//             type="text" 
//             inputMode="decimal"
//             placeholder="0"
//             item={item} // Pasamos item para que InputField pueda obtener item.id internamente
//             handleItemChange={handleItemChange}
//             handleItemBlur={handleItemBlur}
//           />
//         </div>

//         {/* 3. CAMPO DE SUBIDA DE IMAGEN LOCAL */}
//         <div className="border border-indigo-300 rounded-lg p-3 bg-white">
//           <label className="block text-sm font-medium text-indigo-700 mb-2">
//             Documentación Visual (Imagen)
//           </label>
//           <input
//             type="file"
//             id={`image-upload-${item.id}`}
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />

//           {/* CONTENEDOR FLEXIBLE Y CENTRADO DE BOTONES */}
//           <div className={`flex flex-col sm:flex-row items-stretch ${item.imageUrl ? 'sm:justify-between' : 'sm:justify-start'} space-y-3 sm:space-y-0 sm:space-x-3`}>
            
//             {/* Botón Principal (Seleccionar/Cambiar) */}
//             <button
//               type="button"
//               onClick={() =>
//                 document.getElementById(`image-upload-${item.id}`).click()
//               }
//               className="w-full sm:w-auto py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition flex items-center justify-center text-sm font-semibold"
//             >
//               {/* Icono de subida */}
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
//                 />
//               </svg>
//               {item.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
//             </button>

//             {item.imageUrl && (
//               /* Botón Secundario (Quitar) */
//               <button
//                 type="button"
//                 // item.id ya se está usando correctamente aquí
//                 onClick={() => handleItemChange(item.id, 'imageUrl', '')}
//                 className="w-full sm:w-auto py-2 px-4 bg-red-50 text-red-600 rounded-lg shadow-md hover:bg-red-100 transition flex items-center justify-center text-sm font-semibold border border-red-200"
//               >
//                 {/* Icono de X para quitar */}
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
//                 </svg>
//                 Quitar Imagen
//               </button>
//             )}
//           </div>

//           {item.imageUrl && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-lg text-center bg-gray-50">
//               <p className="text-xs text-gray-600 mb-2 font-semibold">
//                 Previsualización (Máx 200px):
//               </p>
//               <img
//                 src={item.imageUrl}
//                 alt={`Imagen de ${item.productName || 'Producto'}`}
//                 style={{ maxHeight: '200px', width: 'auto' }}
//                 className="mx-auto rounded-md shadow-lg w-full object-contain"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = '';
//                   e.target.style.display = 'none';
//                   console.error(
//                     'Error al cargar la imagen. Puede que sea un Base64 corrupto o no válido.'
//                   );
//                 }}
//               />
//               {isBase64Image && (
//                 <p className="text-xs text-amber-600 font-bold mt-3">
//                   La imagen se subirá al guardar (Base64 detectado).
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* 4. RESULTADO */}
//         <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-300">
//           <p className="text-sm font-medium text-indigo-800">Resultado (Kg):</p>
//           <p className="text-xl font-bold text-indigo-900 mt-1">
//             {parseFloat(factorAValue || 0)} * {parseFloat(item.factorB || 0)} ={' '}
//             <span className="text-green-700">{item.result || '0.00'}</span>
//             Kg
//           </p>
//         </div>
//       </div>
//     );
//   }
// );

// export default ProductItemForm;


// import React from 'react';
// import { PRODUCT_CATALOG } from '../Util/util';
// import InputField from './InputField';

// // === FUNCIÓN AUXILIAR PARA COMPRESIÓN DE IMAGEN ===
// // Esta función utiliza la API de Canvas para redimensionar y comprimir una imagen.
// const compressImageFile = (file) => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
        
//         reader.onload = (event) => {
//             const img = new Image();
//             img.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 // Reducir la imagen a un ancho máximo sensato
//                 const MAX_WIDTH = 800; 
//                 let width = img.width;
//                 let height = img.height;

//                 // Si el ancho es mayor al máximo, lo reajustamos proporcionalmente
//                 if (width > MAX_WIDTH) {
//                     height = height * (MAX_WIDTH / width);
//                     width = MAX_WIDTH;
//                 }

//                 canvas.width = width;
//                 canvas.height = height;

//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0, width, height);
                
//                 // Convertimos el Canvas a Base64 con calidad reducida (0.7 = 70%)
//                 const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); 
//                 resolve(compressedBase64);
//             };
//             img.onerror = reject;
//             img.src = event.target.result;
//         };
        
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// };
// // ==================================================


// const ProductItemForm = React.memo(
//   ({ item, index, handleItemChange, handleItemBlur, deleteItem }) => {
//     const factorAValue = item.productName
//       ? PRODUCT_CATALOG[item.productName]
//       : parseFloat(item.factorA) || 0;

//     // 🎯 MODIFICACIÓN CLAVE: Función ahora es ASÍNCRONA y comprime la imagen.
//     const handleImageChange = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       // Opcional: Impedir archivos demasiado grandes (por encima de 5MB)
//       const MAX_SIZE_MB = 5;
//       if (file.size > MAX_SIZE_MB * 1024 * 1024) {
//           alert(`La imagen es demasiado grande. Por favor, selecciona un archivo menor a ${MAX_SIZE_MB}MB.`);
//           e.target.value = null; // Limpiar el input file
//           return;
//       }
      
//       try {
//           // 🚀 Usamos la función de compresión antes de actualizar el estado
//           const compressedBase64 = await compressImageFile(file);
//           handleItemChange(item.id, 'imageUrl', compressedBase64);
//       } catch (error) {
//           console.error("Error al procesar la imagen:", error);
//           alert("Hubo un error al procesar la imagen. Intenta con otra imagen.");
//       }
//     };
//     // ===============================================

//     const handleProductNameChange = (e) => {
//       const newProductName = e.target.value;
//       const newFactorA = PRODUCT_CATALOG[newProductName] || 0;

//       handleItemChange(item.id, 'productName', newProductName, newFactorA);
//     };

//     const isBase64Image =
//       item.imageUrl && item.imageUrl.startsWith('data:image');

//     return (
//       <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl shadow-md space-y-4">
//         {/* Encabezado y Botón de Eliminar */}
//         <div className="flex justify-between items-center pb-2 border-b border-indigo-200">
//           <h4 className="text-xl font-bold text-indigo-700">
//             Producto #{index + 1}
//           </h4>
//           <button
//             type="button"
//             onClick={() => deleteItem(item.id)}
//             className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
//             aria-label="Eliminar producto"
//           >
//             {/* Icono de papelera */}
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* 1. CAMPO NOMBRE DEL PRODUCTO (SELECT) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nombre del Producto
//           </label>
//           <select
//             value={item.productName || ''}
//             onChange={handleProductNameChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition bg-white"
//           >
//             <option value="" disabled>
//               Selecciona un producto
//             </option>
//             {Object.keys(PRODUCT_CATALOG).map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 2. CAMPOS DE CÁLCULO */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Factor A: SÓLO LECTURA */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Peso(kg) (Automático)
//             </label>
//             <input
//               type="text"
//               value={factorAValue}
//               readOnly
//               placeholder="0"
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner"
//             />
//           </div>

//           {/* Factor B: INPUT NORMAL */}
//           <InputField
//             label="Cajas (Ingresar)"
//             value={item.factorB}
//             field="factorB"
//             type="text" 
//             inputMode="decimal"
//             placeholder="0"
//             item={item} 
//             handleItemChange={handleItemChange}
//             handleItemBlur={handleItemBlur}
//           />
//         </div>

//         {/* 3. CAMPO DE SUBIDA DE IMAGEN LOCAL */}
//         <div className="border border-indigo-300 rounded-lg p-3 bg-white">
//           <label className="block text-sm font-medium text-indigo-700 mb-2">
//             Documentación Visual (Imagen)
//           </label>
//           <input
//             type="file"
//             id={`image-upload-${item.id}`}
//             accept="image/*"
//             // 🎯 Usamos la función modificada
//             onChange={handleImageChange}
//             className="hidden"
//           />

//           {/* CONTENEDOR FLEXIBLE Y CENTRADO DE BOTONES */}
//           <div className={`flex flex-col sm:flex-row items-stretch ${item.imageUrl ? 'sm:justify-between' : 'sm:justify-start'} space-y-3 sm:space-y-0 sm:space-x-3`}>
//             
//             {/* Botón Principal (Seleccionar/Cambiar) */}
//             <button
//               type="button"
//               onClick={() =>
//                 document.getElementById(`image-upload-${item.id}`).click()
//               }
//               className="w-full sm:w-auto py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition flex items-center justify-center text-sm font-semibold"
//             >
//               {/* Icono de subida */}
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
//                 />
//               </svg>
//               {item.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
//             </button>

//             {item.imageUrl && (
//               /* Botón Secundario (Quitar) */
//               <button
//                 type="button"
//                 onClick={() => handleItemChange(item.id, 'imageUrl', '')}
//                 className="w-full sm:w-auto py-2 px-4 bg-red-50 text-red-600 rounded-lg shadow-md hover:bg-red-100 transition flex items-center justify-center text-sm font-semibold border border-red-200"
//               >
//                 {/* Icono de X para quitar */}
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
//                 </svg>
//                 Quitar Imagen
//               </button>
//             )}
//           </div>

//           {item.imageUrl && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-lg text-center bg-gray-50">
//               <p className="text-xs text-gray-600 mb-2 font-semibold">
//                 Previsualización (Máx 200px):
//               </p>
//               <img
//                 src={item.imageUrl}
//                 alt={`Imagen de ${item.productName || 'Producto'}`}
//                 style={{ maxHeight: '200px', width: 'auto' }}
//                 className="mx-auto rounded-md shadow-lg w-full object-contain"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = '';
//                   e.target.style.display = 'none';
//                   console.error(
//                     'Error al cargar la imagen. Puede que sea un Base64 corrupto o no válido.'
//                   );
//                 }}
//               />
//               {isBase64Image && (
//                 <p className="text-xs text-amber-600 font-bold mt-3">
//                   La imagen se subirá al guardar (Base64 detectado).
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* 4. RESULTADO */}
//         <div className="p-3 bg-indigo-100 rounded-lg border border-indigo-300">
//           <p className="text-sm font-medium text-indigo-800">Resultado (Kg):</p>
//           <p className="text-xl font-bold text-indigo-900 mt-1">
//             {parseFloat(factorAValue || 0)} * {parseFloat(item.factorB || 0)} ={' '}
//             <span className="text-green-700">{item.result || '0.00'}</span>
//             Kg
//           </p>
//         </div>
//       </div>
//     );
//   }
// );

// export default ProductItemForm;