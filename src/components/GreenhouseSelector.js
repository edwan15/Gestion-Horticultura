// src/components/GreenhouseSelector.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const GreenhouseSelector = ({
  greenhouses,
  greenhouseId,
  handleSelectGreenhouse,
  handleCreateGreenhouse,
  handleDeleteGreenhouse,
  showManagementButtons, // Prop para mostrar/ocultar botones de Crear/Eliminar
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGreenhouseName, setNewGreenhouseName] = useState("");

  const handleCreate = () => {
    if (newGreenhouseName.trim() === "") {
      toast.error("El nombre del invernadero no puede estar vacío.");
      return;
    }
    handleCreateGreenhouse(newGreenhouseName.trim());
    setNewGreenhouseName("");
    setIsCreating(false);
  };
  
  const handleSelectChange = (e) => {
    const id = e.target.value;
    const selected = greenhouses.find(g => g.id === id);
    if (selected) {
        handleSelectGreenhouse(id, selected.name);
    }
  };

  const currentGreenhouse = greenhouses.find(g => g.id === greenhouseId);

  return (
    <div className="flex items-center space-x-2">
        {/* Selector de Inventarios/Invernaderos */}
        <div className="relative">
            <select
                value={greenhouseId || ""}
                onChange={handleSelectChange}
                className={`py-2 pl-3 pr-10 border border-indigo-400 bg-indigo-50 text-indigo-800 
                            font-semibold rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
                            appearance-none transition duration-150 ease-in-out cursor-pointer hover:bg-indigo-100`}
            >
                {greenhouses.map((g) => (
                    <option key={g.id} value={g.id}>
                        {g.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>


      {/* Botones de Gestión (solo visibles en la vista de calendario) */}
      {showManagementButtons && (
        <>
            {/* Botón de Crear */}
            <button
                onClick={() => setIsCreating(true)}
                className="p-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                title="Crear Nuevo Invernadero"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
            
            {/* Botón de Eliminar */}
            {greenhouseId && (
                <button
                    onClick={() => handleDeleteGreenhouse(greenhouseId, currentGreenhouse.name)}
                    className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                    title={`Eliminar Invernadero ${currentGreenhouse?.name}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            )}
        </>
      )}

      {/* Modal/Formulario de Creación */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-indigo-700">
              Crear Nuevo Inventario/Invernadero
            </h3>
            <input
              type="text"
              value={newGreenhouseName}
              onChange={(e) => setNewGreenhouseName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              placeholder="Nombre del Inventario/Invernadero"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenhouseSelector;