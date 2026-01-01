
// src/components/ProductItemForm.js
import React from 'react'
import {PRODUCT_CATALOG} from '../Util/util'
import InputField from './InputField';
import { FaTrash, FaImage, FaTimesCircle, FaBoxOpen, FaWeightHanging, FaCalculator } from 'react-icons/fa';

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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md hover:border-emerald-200 group relative">
        {/* Header del Producto */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg font-bold text-sm">
                #{index + 1}
             </div>
             <h4 className="text-lg font-bold text-slate-700">
                Detalle de Cosecha
             </h4>
          </div>
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="p-2 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
            title="Eliminar registro"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
            {/* 1. SELECCI├ôN DE PRODUCTO */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Variedad / Producto
              </label>
              <div className="relative">
                  <select
                    value={item.productName || ""}
                    onChange={handleProductNameChange}
                    className="w-full p-3 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-emerald-50/30"
                  >
                    <option value="" disabled>Seleccionar cultivo...</option>
                    {Object.keys(PRODUCT_CATALOG).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <FaBoxOpen />
                  </div>
              </div>
            </div>

            {/* 2. C├üLCULOS (PESO Y CAJAS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Peso Autom├ítico */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                   <FaWeightHanging /> Peso Unitario (Kg)
                </label>
                <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono font-semibold">
                    {factorAValue || "0.00"}
                </div>
              </div>

              {/* Input Cajas (Factor B) */}
              <InputField
                label="Cantidad de Cajas"
                value={item.factorB}
                field="factorB"
                type="number"
                placeholder="0"
                item={item}
                handleItemChange={handleItemChange}
                handleItemBlur={handleItemBlur}
              />
            </div>
            
            {/* 3. RESULTADO CALCULADO */}
             <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                    <FaCalculator />
                    <span className="text-sm font-bold">Total Calculado</span>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-black text-emerald-700 leading-none">
                        {item.result || "0.00"}
                    </span>
                    <span className="text-xs font-bold text-emerald-500 uppercase">Kilogramos</span>
                </div>
             </div>

            {/* 4. IMAGEN (DOCUMENTACI├ôN VISUAL) */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3">
                Evidencia Visual
              </label>
              
              {!item.imageUrl ? (
                  <div className="relative group">
                      <input
                        type="file"
                        id={`image-upload-${item.id}`}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor={`image-upload-${item.id}`}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                      >
                           <FaImage className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 mb-2 transition-colors" />
                           <span className="text-sm text-slate-500 font-medium group-hover:text-emerald-600">Subir foto de evidencia</span>
                      </label>
                  </div>
              ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                      <img
                        src={item.imageUrl}
                        alt="Evidencia"
                        className="w-full h-32 object-contain object-center bg-slate-50"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button
                             type="button"
                             onClick={() => handleItemChange(item.id, "imageUrl", "")}
                             className="p-2 bg-white rounded-full text-rose-500 hover:text-rose-600 shadow-lg transform hover:scale-110 transition-all"
                             title="Eliminar imagen"
                           >
                               <FaTimesCircle className="w-6 h-6" />
                           </button>
                      </div>
                      {isBase64Image && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-bold uppercase tracking-wider">
                              Pendiente de guardar
                          </div>
                      )}
                  </div>
              )}
            </div>
        </div>
      </div>
    );
  }
);

export default ProductItemForm
