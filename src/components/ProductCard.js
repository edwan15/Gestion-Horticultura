import React from 'react'
import { formatNumber } from '../Util/util'; 


 const ProductCard = React.memo(({ item }) => {
  const factorA = parseFloat(item.factorA || 0);
  const factorB = parseFloat(item.factorB || 0);
  const result = parseFloat(item.result || 0);
  const imageUrl = item.imageUrl;
  const productName = item.productName || "Producto sin nombre";

  let colorClass = "border-blue-300 bg-blue-50/70 text-blue-900";
  if (result > 1500) {
    colorClass = "border-green-400 bg-green-50/70 text-green-900";
  } else if (result > 500) {
    colorClass = "border-amber-400 bg-amber-50/70 text-amber-900";
  }

  const displayImageUrl = imageUrl
    ? imageUrl.replace("/upload/", "/upload/c_fit,w_400,q_auto:good/")
    : imageUrl;

  return (
    <div
      className={`
                p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm
                transition-all duration-300 ease-in-out transform
                hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-1
                ${colorClass}
            `}
    >
      <div className="flex justify-between items-start mb-3 border-b border-current/30 pb-2">
        <h3 className="text-xl font-extrabold truncate">{productName}</h3>
      </div>

      {imageUrl && (
        <div className="mb-3">
          <img
            src={displayImageUrl}
            alt={`Imagen de ${productName}`}
            className="w-full max-h-36 object-cover rounded-lg shadow-inner border border-current/30"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="space-y-2 mb-4 text-sm font-medium">
        <p className="flex justify-between">
          <span>Peso (Kg/Caja):</span>
          <span className="font-bold">{factorA}</span>
        </p>
        <p className="flex justify-between">
          <span>Cajas Producidas:</span>
          <span className="font-bold">{factorB}</span>
        </p>
      </div>

      <div className="p-3 mt-4 rounded-lg bg-white/70 shadow-inner border border-current/50">
        <p className="text-lg font-bold flex justify-between items-center">
          <span className="uppercase text-gray-600">Total Producido:</span>
          <span className="text-3xl font-extrabold text-indigo-700">
            {formatNumber(result)}
            <span className="text-base font-normal"> Kg</span>
          </span>
        </p>
      </div>
    </div>
  );
});

export default ProductCard