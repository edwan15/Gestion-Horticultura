// src/components/GreenhouseSelector.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaLeaf, FaPlus, FaTrash, FaChevronDown } from "react-icons/fa";

const GreenhouseSelector = ({
  greenhouses,
  greenhouseId,
  handleSelectGreenhouse,
  handleCreateGreenhouse,
  handleDeleteGreenhouse,
  showManagementButtons,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGreenhouseName, setNewGreenhouseName] = useState("");

  const handleCreate = () => {
    if (newGreenhouseName.trim() === "") {
      toast.error("El nombre del invernadero no puede estar vac├¡o.");
      return;
    }
    handleCreateGreenhouse(newGreenhouseName.trim());
    setNewGreenhouseName("");
    setIsCreating(false);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    const selected = greenhouses.find((g) => g.id === id);
    if (selected) {
      handleSelectGreenhouse(id, selected.name);
    }
  };

  const currentGreenhouse = greenhouses.find((g) => g.id === greenhouseId);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
      {/* Selector Wrapper */}
      <div className="relative group w-full sm:w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaLeaf className="h-4 w-4 text-emerald-600" />
        </div>
        <select
          value={greenhouseId || ""}
          onChange={handleSelectChange}
          className="block w-full pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-700 bg-white/80 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all cursor-pointer hover:bg-emerald-50/50 appearance-none"
        >
          {greenhouses.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 group-hover:text-emerald-600 transition-colors">
          <FaChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Botones de Gesti├│n */}
      {showManagementButtons && (
        <div className="flex items-center gap-2">
          {/* Bot├│n Crear */}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center p-2.5 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 hover:shadow-md transition-all duration-200 group relative"
            title="Crear Nuevo Invernadero"
          >
            <FaPlus className="w-4 h-4" />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Nuevo Invernadero
            </span>
          </button>

          {/* Bot├│n Eliminar */}
          {greenhouseId && (
            <button
              onClick={() =>
                handleDeleteGreenhouse(greenhouseId, currentGreenhouse?.name)
              }
              className="flex items-center justify-center p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 hover:shadow-md transition-all duration-200 group relative"
              title={`Eliminar ${currentGreenhouse?.name}`}
            >
              <FaTrash className="w-4 h-4" />
               <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Eliminar Actual
            </span>
            </button>
          )}
        </div>
      )}

      {/* Modal de Creaci├│n - Estilo Glassmorphism */}
      {isCreating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-slate-100">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaPlus className="text-emerald-100" />
                Nuevo Invernadero
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newGreenhouseName}
                  onChange={(e) => setNewGreenhouseName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="Ej: Sector Norte - Tomates"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Crear Invernadero
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenhouseSelector;