import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  );
};

export default Loader;
