// // Archivo: src/components/DatosEstadisticosCard.js
// import React, { useState } from 'react';
// // ⚠️ Asegúrate de que esta ruta sea correcta para importar el modal
// import DatosEstadisticosModal from './DatosEstadisticosModal';

// // Icono (opcional, para que se vea bonito)
// const CardIcon = (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
//     </svg>
// );

// const DatosEstadisticosCard = () => {
//     // 1. LÓGICA DE ESTADO: Aquí se controla si el modal está abierto o cerrado.
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false);

//     // Datos de resumen para la tarjeta
//     const estadisticasResumen = {
//         modoProduccion: "Producción Integrada",
//         tipoProteccion: "Invernadero",
//         cultivosAdyacentes: "Tomate"
//     };

//     return (
//         <>
//             {/* 2. TARJETA (El botón que abre el modal) */}
//             <div
//                 className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 cursor-pointer hover:shadow-xl transition"
//                 onClick={openModal} // 👈 ¡Al hacer click, el estado 'isModalOpen' se pone en TRUE!
//             >
//                 <div className="flex items-center justify-between">
//                     <h3 className="text-xl font-bold text-indigo-700 flex items-center">
//                         {CardIcon}
//                         Datos Estadísticos del Cultivo
//                     </h3>
//                 </div>
//                 <div className="mt-4 space-y-2 text-sm text-gray-600">
//                     <p><span className="font-medium text-gray-800">Modo:</span> {estadisticasResumen.modoProduccion}</p>
//                     <p><span className="font-medium text-gray-800">Protección:</span> {estadisticasResumen.tipoProteccion}</p>
//                 </div>
//             </div>

//             {/* 3. MODAL (Recibe el estado isModalOpen y por eso funciona) */}
//             <DatosEstadisticosModal
//                 isOpen={isModalOpen} // 👈 Pasa TRUE o FALSE al modal
//                 closeModal={closeModal}
//             />
//         </>
//     );
// };

// export default DatosEstadisticosCard;

// // Archivo: src/components/DatosEstadisticosCard.js (MODIFICADO)
// import React, { useState } from 'react';
// // ⚠️ Asegúrate de que la ruta sea correcta
// import DatosCultivoModal from './DatosEstadisticosModal'; // HE CAMBIADO EL NOMBRE POR CONSISTENCIA CON EL ARCHIVO DE CABECERA

// const CardIcon = (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
//     </svg>
// );

// // Define los datos iniciales para TODO el formulario aquí.
// // DEBES POBLAR ESTO CON TODOS LOS CAMPOS CLAVE.
// const INITIAL_FORM_DATA = {
//     // Valores por defecto/iniciales
//     cropName: "General Balsicas 2026",
//     associatedPlot: "General Balsicas 2026 (0.01ha)", // Valor inicial del selectOptions.parcelaAsociada[0]
//     plantedArea: "0.01",
//     plantedAreaUnit: "ha", // Valor inicial del selectOptions.areaUnits[0]
//     createRecommendation: false,
//     // Asegúrate de añadir los demás campos clave con sus valores iniciales
// };

// const DatosEstadisticosCard = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // 🔥 PASO CLAVE: SACA EL ESTADO DEL FORMULARIO AQUÍ (AL COMPONENTE PADRE)
//     const [formData, setFormData] = useState(INITIAL_FORM_DATA);

//     const openModal = () => setIsModalOpen(true);

//     // Función que se llamará al guardar y que actualizará el estado
//     const handleSave = (newFormData) => {
//         console.log("GUARDANDO DATOS:", newFormData);
//         // Aquí podrías enviar los datos a una API

//         // Actualiza el estado del padre con los datos recibidos del modal
//         setFormData(newFormData);
//         setIsModalOpen(false); // Cierra el modal
//     };

//     // Función para manejar el cierre sin guardar
//     const closeModal = () => setIsModalOpen(false);

//     // Datos de resumen para la tarjeta ahora provienen del estado del formulario
//     const estadisticasResumen = {
//         modoProduccion: formData.productionMode || "Sin definir",
//         tipoProteccion: formData.protectionType || "Sin definir",
//         // Puedes poner más campos aquí si los necesitas
//     };

//     return (
//         <>
//             {/* ... Tarjeta (igual) ... */}
//             <div
//                 className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 cursor-pointer hover:shadow-xl transition"
//                 onClick={openModal}
//             >
//                 <div className="flex items-center justify-between">
//                     <h3 className="text-xl font-bold text-indigo-700 flex items-center">
//                         {CardIcon}
//                         Datos Estadísticos del Cultivo
//                     </h3>
//                 </div>
//                 <div className="mt-4 space-y-2 text-sm text-gray-600">
//                     <p><span className="font-medium text-gray-800">Modo:</span> {estadisticasResumen.modoProduccion}</p>
//                     <p><span className="font-medium text-gray-800">Protección:</span> {estadisticasResumen.tipoProteccion}</p>
//                 </div>
//             </div>

//             {/* 3. MODAL: Pasa los datos actuales y una función para actualizarlos */}
//             <DatosCultivoModal
//                 isOpen={isModalOpen}
//                 closeModal={closeModal}
//                 initialData={formData} // 🔥 PASA LOS DATOS AL MODAL
//                 onSave={handleSave} // 🔥 PASA LA FUNCIÓN PARA GUARDAR
//             />
//         </>
//     );
// };

// export default DatosEstadisticosCard;




// import React, { useEffect, useState } from "react";
// import DatosCultivoModal from "./DatosEstadisticosModal"; // ⚠️ Ajusta la ruta si es necesario

// // --- Importación de Iconos (React Icons - Puedes necesitar instalar: npm install react-icons) ---
// import {
//   FaSeedling,
//   FaIndustry,
//   FaShieldAlt,
//   FaChartBar,
//   FaEdit,
// } from "react-icons/fa";

// // --- Iconos y Estructura (Para la visualización del resumen) ---
// const CardIcon = <FaChartBar className="w-6 h-6 mr-2 text-indigo-500" />;

// const DatosEstadisticosCard = ({
//   initialConfig,
//   onSaveConfig,
//   dailyData,
//   formatNumber,
// }) => {
//   // 1. Estado para controlar la visibilidad del modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
  

//   // 2. Estado local para el formulario.
//   // 🔑 CLAVE: Inicialización con la prop. La 'key' en el padre fuerza el reseteo.
//   const [formData, setFormData] = useState(initialConfig);

//   // 3. Handlers de estado
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleSave = (newFormData) => {
//     // Actualiza el estado local y llama al handler del padre para guardar en Firebase
//     setFormData(newFormData);
//     onSaveConfig(newFormData);
//     closeModal();
//   };

//   // 4. Datos de resumen usando el estado local (formData)
//   const estadisticasResumen = {
//     nombreCultivo: formData.cropName || "Sin nombre",
//     modoProduccion: formData.productionMode || "Sin definir",
//     tipoProteccion: formData.protectionType || "Sin definir",
//   };

//   // --- Estilos para las filas de resumen ---
//   const ResumenItem = ({ Icon, label, value }) => (
//     <p className="flex items-center text-sm text-gray-700">
//       <Icon className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
//       <span className="font-medium text-gray-800 mr-2">{label}:</span>
//       <span className="truncate">{value}</span>
//     </p>
//   );

//   useEffect(() => {
//         // Cuando initialConfig cambie (porque cargamos un nuevo invernadero),
//         // reseteamos el estado local del formulario.
//         setFormData(initialConfig);
//     }, [initialConfig]);

//   return (
//     <>
//       <div
//         className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 cursor-pointer 
//                            hover:shadow-2xl hover:border-indigo-600 transition duration-300 ease-in-out relative"
//         onClick={openModal} // Abre el modal al hacer clic
//       >
//         {/* Botón de Edición flotante */}
//         <FaEdit
//           className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition cursor-pointer"
//           title="Editar Datos"
//         />

//         {/* Encabezado */}
//         <div className="flex items-center border-b pb-3 mb-4">
//           <h3 className="text-xl font-extrabold text-indigo-700 flex items-center">
//             {CardIcon}
//             Datos Estadísticos
//           </h3>
//         </div>

//         {/* Contenido del Resumen */}
//         <div className="space-y-3">
//           <ResumenItem
//             Icon={FaSeedling}
//             label="Cultivo"
//             value={estadisticasResumen.nombreCultivo}
//           />
//           <ResumenItem
//             Icon={FaIndustry}
//             label="Modo Producción"
//             value={estadisticasResumen.modoProduccion}
//           />
//           <ResumenItem
//             Icon={FaShieldAlt}
//             label="Tipo Protección"
//             value={estadisticasResumen.tipoProteccion}
//           />

//           {/* Ejemplo de un dato adicional (si dailyData es relevante) */}
//           {dailyData && (
//             <p className="pt-2 text-xs text-gray-500 italic border-t mt-4">
//               Haga clic para ver/editar todos los datos.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* MODAL (Asume que DatosCultivoModal maneja internamente la estructura del formulario) */}
//       <DatosCultivoModal
//         isOpen={isModalOpen}
//         closeModal={closeModal}
//         initialData={formData} // Pasa el estado local actual para edición
//         onSave={handleSave}
//       />
//     </>
//   );
// };

// export default DatosEstadisticosCard;





import React, { useEffect, useState } from "react";
import DatosCultivoModal from "./DatosEstadisticosModal"; // Asegúrate de que esta ruta sea correcta

// --- Importación de Iconos ---
import {
  FaSeedling,
  FaIndustry,
  FaShieldAlt,
  FaChartBar,
  FaEdit,
} from "react-icons/fa";

// --- Iconos y Estructura (Para la visualización del resumen) ---
const CardIcon = <FaChartBar className="w-6 h-6 mr-2 text-indigo-500" />;

const DatosEstadisticosCard = ({
  initialConfig,
  onSaveConfig,
  dailyData,
  formatNumber,
}) => {
  // 1. Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. Estado local para el formulario.
  // 🔑 CORRECCIÓN CRÍTICA: Inicialización segura. Usa {} si initialConfig es undefined/null.
  const [formData, setFormData] = useState(initialConfig || {});

  // 3. Handlers de estado
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (newFormData) => {
    // Actualiza el estado local inmediatamente
    setFormData(newFormData);
    // Llama al handler del padre para guardar en Firebase
    onSaveConfig(newFormData); 
    closeModal();
  };

  // 4. Sincronización: Actualiza el estado local cuando la prop initialConfig (del padre/Firebase) cambie.
  useEffect(() => {
    // Si la prop entrante es válida, actualiza. 
    // Usamos el mismo patrón de protección para evitar problemas.
    setFormData(initialConfig || {}); 
    // NOTA: Gracias a la 'key' en el padre, este useEffect se dispara de forma limpia.
  }, [initialConfig]);

  // 5. Datos de resumen usando el estado local (formData)
  // La protección '|| "Sin definir"' es un fallback de seguridad.
  const estadisticasResumen = {
    nombreCultivo: formData.cropName || "Sin nombre",
    modoProduccion: formData.productionMode || "Sin definir",
    tipoProteccion: formData.protectionType || "Sin definir",
  };

  // --- Componente de Fila de Resumen ---
  const ResumenItem = ({ Icon, label, value }) => (
    <p className="flex items-center text-sm text-gray-700">
      <Icon className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
      <span className="font-medium text-gray-800 mr-2">{label}:</span>
      <span className="truncate">{value}</span>
    </p>
  );

  return (
    <>
      <div
        className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 cursor-pointer 
                   hover:shadow-2xl hover:border-indigo-600 transition duration-300 ease-in-out relative"
        onClick={openModal} // Abre el modal al hacer clic
      >
        {/* Botón de Edición flotante */}
        <FaEdit
          className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition cursor-pointer"
          title="Editar Datos"
        />

        {/* Encabezado */}
        <div className="flex items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-extrabold text-indigo-700 flex items-center">
            {CardIcon}
            Datos Estadísticos
          </h3>
        </div>

        {/* Contenido del Resumen */}
        <div className="space-y-3">
          <ResumenItem
            Icon={FaSeedling}
            label="Cultivo"
            value={estadisticasResumen.nombreCultivo}
          />
          <ResumenItem
            Icon={FaIndustry}
            label="Modo Producción"
            value={estadisticasResumen.modoProduccion}
          />
          <ResumenItem
            Icon={FaShieldAlt}
            label="Tipo Protección"
            value={estadisticasResumen.tipoProteccion}
          />

          {/* Texto de información adicional */}
          {dailyData && (
            <p className="pt-2 text-xs text-gray-500 italic border-t mt-4">
              Haga clic para ver/editar todos los datos.
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      <DatosCultivoModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        initialData={formData} // Pasa el estado local actual para edición
        onSave={handleSave}
      />
    </>
  );
};

export default DatosEstadisticosCard;