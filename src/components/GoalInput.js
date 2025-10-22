// import React, { useState } from 'react'

// // =======================================================================
// // === 📝 Componente: Input de Meta
// // =======================================================================
// const GoalInput = ({ goal, setGoal }) => {
//     const [inputValue, setInputValue] = useState(goal);

//     const handleSave = () => {
//         const newGoal = parseFloat(inputValue);
//         if (!isNaN(newGoal) && newGoal > 0) {
//             setGoal(newGoal);
//             alert(`Meta actualizada a ${newGoal.toLocaleString('es-ES')} Kg.`);
//         } else {
//             alert("Por favor, introduce un valor de meta válido y positivo.");
//             setInputValue(goal);
//         }
//     };

//     return (
//         <div className="p-5 bg-white rounded-2xl shadow-xl border-t-4 border-yellow-500 transition-all duration-300 hover:shadow-2xl">

//             <div className="flex items-center mb-4">
//                 <span className="text-3xl mr-3">🏆</span>
//                 <h3 className="text-xl font-bold text-gray-800">Establecer Meta</h3>
//             </div>

//             <label htmlFor="goal-input" className="block text-sm font-medium text-gray-500 mb-2">
//                 Producción deseada (Kg)
//             </label>

//             <div className="flex flex-col sm:flex-row gap-3">

//                 {/* Input */}
//                 <input
//                     id="goal-input"
//                     type="number"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
//                     placeholder="Ej. 50000"
//                     // Foco en móvil (w-full) y tamaño fijo en desktop
//                     className="w-full sm:w-2/3 p-3 border border-yellow-300 rounded-xl focus:ring-yellow-500 focus:border-yellow-500 transition shadow-inner text-lg font-bold"
//                 />

//                 {/* Botón */}
//                 <button
//                     onClick={handleSave}
//                     // Botón w-full en móvil, se adapta en desktop
//                     className="w-full sm:w-1/3 px-4 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition shadow-md transform hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center"
//                 >
//                     <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                     Guardar Meta
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default GoalInput

import React, { useState, useEffect } from "react";
// ✨ CORRECCIÓN: Importación con nombre desde App.js
import { formatNumber } from '../Util/util';

const GoalInput = ({
  globalGoal,
  handleGlobalGoalChange,
  handleSaveGlobalGoal,
}) => {
  // 1. Estado local para el valor que el usuario está escribiendo
  const [inputValue, setInputValue] = useState(String(globalGoal || 0));
  const [isSaving, setIsSaving] = useState(false);

  // 2. Sincronizar el estado local con la meta global de Firebase cuando esta cambie
  useEffect(() => {
    // Solo actualiza el input local si la meta global de Firebase cambia
    setInputValue(String(globalGoal || 0));
  }, [globalGoal]);

  const handleChange = (e) => {
    // Actualiza el estado local mientras el usuario teclea
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Llama a la función que guarda en Firebase, pasándole el valor local del input
    await handleSaveGlobalGoal(inputValue);
    setIsSaving(false);
  };

  const currentGoalDisplay = parseFloat(globalGoal) || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-200">
      <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19V6l2-2 2 2v13"
          ></path>
        </svg>
        Establecer Meta de Producción Diaria (Kg)
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <label
            htmlFor="goal-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meta Diaria Actual:{" "}
            <span className="font-bold text-green-600">
              {formatNumber(currentGoalDisplay)} Kg
            </span>
          </label>
          <input
            id="goal-input"
            type="number"
            value={inputValue} // Usa el estado local para el input
            onChange={handleChange}
            onBlur={() => handleGlobalGoalChange(inputValue)} // Opcional: actualiza el estado global de App.js al desenfocar para que CalendarGrid reaccione a cambios no guardados
            placeholder="Ej: 5000"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner text-lg"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center justify-center"
        >
          {isSaving ? (
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              ></path>
            </svg>
          )}
          {isSaving ? "Guardando..." : "Guardar Meta"}
        </button>
      </div>
    </div>
  );
};

export default GoalInput;
