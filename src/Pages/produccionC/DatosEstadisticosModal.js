// import React, { useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/20/solid';

// // =========================================================================
// // 1. DEFINICIÓN DE DATOS DEL FORMULARIO
// // =========================================================================

// const selectOptions = {
//     parcelaAsociada: [
//         "General Balsicas 2026 (0.01ha)",
//         "Inv 2 calabacin 2026 (1.12ha)",
//         "Inv 4 calabacin 2026 (1.55ha)",
//         "Invernadero 1 (3.85ha)",
//         "Invernadero 3 (1.92ha)",
//         "Invernadero 5 (0.6ha)"
//     ],
//     areaUnits: ["ha", "m²"],
//     daysUnits: ["días"],
//     distUnits: ["m", "cm"],
//     numPlantsUnits: ["Total", "Plantas/ha"],
//     depthUnits: ["cm"],
//     tipoCultivo: [
//         "Abacaxi", "Abobra", "Abrotano", "Abrótano hembra", "Abrótano Hembra", "Acedera Común (Rumex acetosa)", 
//         "Acelga", "Achicoria", "Achicoria común", "Aciano", "Adormidera", "Aguacate", "Ajo", "Albahaca", 
//         "Alcachofa", "Algodón", "Almendro", "Apio", "Arándano", "Arroz", "Avena", "Barbecho", "Berenjena", 
//         "Brócoli", "Café", "Calabacín", "Calabaza", "Cebada", "Cebolla", "Cebollino", "Cerezo", "Cilantro", 
//         "Ciruelo", "Coliflor", "Colza", "Cultivos Temporários", "Culturas Hortícolas", "Endivia", "Espinaca", 
//         "Espárragos", "Fresa", "Garbanzo", "Girasol", "Haba", "Higuera", "Hinojo", "Jengibre", "Judías", 
//         "Kiwi", "Lechuga", "Lentejas", "Limonero", "Maiz", "Mandarino", "Mango", "Manzano", "Melón", "Naranja", 
//         "Nectarina", "Olivo", "Patata", "Pepino", "Pimiento", "Piña", "Pistachero", "Platanero", "Puerro", 
//         "Rábano", "Remolacha azucarera", "Romero", "Rucula Oruga", "Rúcula salvaje", "Sandía", "Soja", 
//         "Tabaco", "Tomate", "Trigo", "Viñedo", "Zanahoria", "Otro" // Lista acortada por espacio
//     ],
//     tipoSuelo: [
//         "Muy arcilloso", "Arcilloso", "Franco arcilloso", "Franco", "Arcillo arenoso", "Franco arcillo arenoso",
//         "Franco arenoso", "Areno francoso", "Arenoso", "Arcillo limoso", "Franco arcilo limoso",
//         "Franco limoso", "Limoso", "Turba", "Fibra de coco", "Corteza de pino", "Serrín de madera",
//         "Vermiculita", "Perlita", "Lana mineral", "Arcilla expandida", "Arena", "Fibra de coco con perlita"
//     ],
//     sistemaConduccion: ["Palmeta", "Sebe", "Eje", "Florera"],
//     sistemaRiego: ["Goteo", "Aspersión", "Inundación", "Sin Riego"], // Deducción
//     cubiertaSuelo: [
//         "Suelo desprotegido", "Cubierta vegetal del suelo espontánea", "Cubierta vegetal del suelo sembrada", 
//         "Mulching inorgánico", "Mulching orgánico", "Cubierta vegetal del suelo y Acolchado", "Cubierta Natural"
//     ],
//     conservacionSuelo: [
//         "Mobilização mínima", "Cobertura del suelo", "Contornos de nivel", "Cubierta verde", 
//         "Movilización mínima", "Siembra directa"
//     ],
//     medidasPreventivas: [
//         "Bandas de compensación ecológica", "Bordes herbales", "Introducción de enemigos naturales", 
//         "Podas de aireación", "Refugios para la vida silvestre", "Setos vegetales", "Variedades resistentes"
//     ],
//     modoProduccion: [
//         "Convencional", "Producción Integrada", "Protección Integrada", "Agricultura Ecológica", 
//         "Conversión de Agricultura Ecológica 1er Año", "Conversión de Agricultura Ecológica 2º Año", 
//         "Conversión de Agricultura Ecológica 3er Año"
//     ],
//     tipoProteccion: ["Aire libre", "Túnel", "Invernadero", "Red antigranizo"],
//     tipoSistemaAgricola: ["Tradicional", "Intensivo", "Super intensivo"],
//     sistemaCultivo: ["rotación", "Conocimientos", "Sucesión", "Escalado", "Culturas intermedias"],
//     produccionEsperada: ["kg/ha", "ton/ha", "L", "kg", "g", "ton", "cx", "palote"],
//     certificaciones: [
//         "AH-DLL GROW", "AZACA - Apoio Zonal Alto e Centro Alentejo", "BRC Global Standard for Food Safety", 
//         "GlobalG.A.P.", "ZERYA - ZERYA Sin residuos" // Lista acortada por espacio
//     ],
//     usoSigpac: [
//         "AG - CORRIENTES Y SUPERFICIES DE AGUA", "CA - VIALES", "CI - CITRICOS", "CO - CONTORNO OLIVAR", 
//         "ED - EDIFICACIONES", "FO - FORESTAL", "IV - INVERNADEROS Y CULTIVOS BAJO PLASTICO", 
//         "MT - MATORRAL", "OV - OLIVAR", "TA - TIERRAS ARABLES", "VI - VIÑEDO", "ZU - ZONA URBANA" // Lista acortada por espacio
//     ]
// };

// // Estructura del formulario, siguiendo las secciones de las imágenes
// const formSections = {
//     'General': [
//         { label: "Nombre del cultivo *", key: "cropName", type: "text", required: true, widthClass: "lg:col-span-1" },
//         { label: "Parcela Asociada *", key: "associatedPlot", type: "select", options: selectOptions.parcelaAsociada, required: true, widthClass: "lg:col-span-1" },
//         { label: "Área plantada *", key: "plantedArea", type: "numberWithUnit", unitOptions: selectOptions.areaUnits, required: true, widthClass: "lg:col-span-1" },
//         { label: "Fecha de Plantación / Semilla", key: "plantingDate", type: "date", widthClass: "lg:col-span-1" },
//         { label: "Fecha de eliminación del cultivo", key: "removalDate", type: "date", widthClass: "lg:col-span-1" },
//         { label: "Código de Cultivo", key: "cropCode", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Tipo de Cultivo *", key: "cropType", type: "select", options: selectOptions.tipoCultivo, required: true, widthClass: "lg:col-span-1" },
//         { label: "Variedades", key: "varieties", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Tipo de suelo", key: "soilType", type: "select", options: selectOptions.tipoSuelo, widthClass: "lg:col-span-1" },
//         { label: "Portainjerto", key: "rootstock", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Días para la cosecha", key: "daysToHarvest", type: "numberWithUnit", unitOptions: selectOptions.daysUnits, widthClass: "lg:col-span-1" },
//         { label: "Crear recomendación de cosecha en actividades de campo", key: "createRecommendation", type: "checkbox", widthClass: "lg:col-span-1 mt-6" },
//     ],
//     'Instalación': [
//         { label: "Distancia entre plantas en la línea", key: "plantDistance", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
//         { label: "Espacio entre filas", key: "rowSpace", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
//         { label: "Anchura de la planta en línea", key: "plantWidth", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
//         { label: "Número de plantas", key: "numPlants", type: "numberWithUnit", unitOptions: selectOptions.numPlantsUnits, widthClass: "lg:col-span-1" },
//         { label: "Sistema de conducción", key: "drivingSystem", type: "select", options: selectOptions.sistemaConduccion, widthClass: "lg:col-span-1" },
//         { label: "Filas (Ejemplo: 1-5, 8, 11-13)", key: "rowsExample", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Profundidad de Plantación / Semilla", key: "plantingDepth", type: "numberWithUnit", unitOptions: selectOptions.depthUnits, widthClass: "lg:col-span-1" },
//         { label: "Sistema de Riego", key: "irrigationSystem", type: "select", options: selectOptions.sistemaRiego, widthClass: "lg:col-span-1" },
//     ],
//     'Buenas Prácticas': [
//         { label: "Cubierta del Suelo", key: "soilCover", type: "select", options: selectOptions.cubiertaSuelo, widthClass: "lg:col-span-1" },
//         { label: "Conservación del suelo", key: "soilConservation", type: "select", options: selectOptions.conservacionSuelo, widthClass: "lg:col-span-1" },
//         { label: "Medidas preventivas", key: "preventiveMeasures", type: "select", options: selectOptions.medidasPreventivas, widthClass: "lg:col-span-1" },
//     ],
//     'Otros': [
//         { label: "Modo de Producción", key: "productionMode", type: "select", options: selectOptions.modoProduccion, widthClass: "lg:col-span-1" },
//         { label: "Tipo de protección *", key: "protectionType", type: "select", options: selectOptions.tipoProteccion, required: true, widthClass: "lg:col-span-1" },
//         { label: "Tipo de sistema agrícola *", key: "agriculturalSystemType", type: "select", options: selectOptions.tipoSistemaAgricola, required: true, widthClass: "lg:col-span-1" },
//         { label: "Sistema de cultivo", key: "croppingSystem", type: "select", options: selectOptions.sistemaCultivo, widthClass: "lg:col-span-1" },
//         { label: "Cultivo Anterior", key: "previousCrop", type: "select", options: selectOptions.tipoCultivo, widthClass: "lg:col-span-1" }, // Reutilizamos lista de cultivos
//         { label: "Cultivos adyacentes", key: "adjacentCrops", type: "select", options: selectOptions.tipoCultivo, widthClass: "lg:col-span-1" }, // Reutilizamos lista de cultivos
//         { label: "Producción Esperada", key: "expectedProduction", type: "numberWithUnit", unitOptions: selectOptions.produccionEsperada, widthClass: "lg:col-span-1" },
//         { label: "Certificaciones / interventions", key: "certifications", type: "select", options: selectOptions.certificaciones, widthClass: "lg:col-span-1" },
//         { label: "Ancho de trabajo (m)", key: "workWidth", type: "number", widthClass: "lg:col-span-1" },
//         { label: "Código interno", key: "internalCode", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Color *", key: "color", type: "text", required: true, widthClass: "lg:col-span-1" }, // Asumimos input de texto/color para simplificar
//         { label: "Vivero", key: "nursery", type: "text", widthClass: "lg:col-span-1" },
//         { label: "Archivado", key: "archived", type: "select", options: ["Sí", "No"], widthClass: "lg:col-span-1" }, // Deducción
//         { label: "Uso SIGPAC", key: "sigpacUse", type: "select", options: selectOptions.usoSigpac, widthClass: "lg:col-span-1" },
//     ],
// };


// // =========================================================================
// // 2. COMPONENTE MODAL DE REACT
// // =========================================================================

// const DatosCultivoModal = ({ isOpen, closeModal }) => {
//     const [expandedSection, setExpandedSection] = useState('General'); // 'General' abierta por defecto
//     const [formData, setFormData] = useState({
//         // Inicialización de un campo simple para el ejemplo
//         cropName: "General Balsicas 2026",
//         associatedPlot: selectOptions.parcelaAsociada[0],
//         plantedArea: "0.01",
//         plantedAreaUnit: selectOptions.areaUnits[0],
//         createRecommendation: false,
//         // ... otros campos
//     });

//     const handleFieldChange = (key, value) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Datos del Cultivo Guardados:", formData);
//         closeModal();
//     };

//     const toggleAccordion = (title) => {
//         setExpandedSection(expandedSection === title ? null : title);
//     };

//     // 💡 FUNCIÓN DE RENDERING DE INPUTS (La misma que antes, pero robusta)
//     const renderUnitInput = (field) => {
//         const value = formData[field.key] || '';
//         const unit = formData[`${field.key}Unit`] || field.unitOptions[0];

//         return (
//             <div className="flex space-x-2">
//                 <input
//                     type="number"
//                     step="any"
//                     value={value}
//                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                     className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm p-2"
//                 />
//                 <select
//                     value={unit}
//                     onChange={(e) => handleFieldChange(`${field.key}Unit`, e.target.value)}
//                     className="w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm p-2"
//                 >
//                     {field.unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                 </select>
//             </div>
//         );
//     };

//     const renderField = (field) => {
//         const commonProps = {
//             id: field.key,
//             name: field.key,
//             className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm p-2",
//         };

//         if (field.type === 'select') {
//             return (
//                 <select 
//                     {...commonProps} 
//                     value={formData[field.key] || field.options[0] || ''}
//                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                 >
//                     {field.options.map(option => (
//                         <option key={option} value={option}>{option}</option>
//                     ))}
//                 </select>
//             );
//         } else if (field.type === 'numberWithUnit') {
//             return renderUnitInput(field);
//         } else if (field.type === 'checkbox') {
//             return (
//                 <div className="flex items-center h-5">
//                     <input
//                         type="checkbox"
//                         checked={formData[field.key] || false}
//                         onChange={(e) => handleFieldChange(field.key, e.target.checked)}
//                         className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                     />
//                     <label htmlFor={field.key} className="ml-2 block text-sm font-medium text-gray-700">
//                         {field.label}
//                     </label>
//                 </div>
//             );
//         } else if (field.type === 'date') {
//             return (
//                 <input
//                     {...commonProps}
//                     type="date"
//                     value={formData[field.key] || ''}
//                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                 />
//             );
//         } else { // text, number, etc.
//             return (
//                 <input
//                     {...commonProps}
//                     type={field.type || 'text'}
//                     value={formData[field.key] || ''}
//                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                 />
//             );
//         }
//     };


//     return (
//         <Transition appear show={isOpen} as={React.Fragment}>
//             <Dialog as="div" className="relative z-10" onClose={closeModal}>
//                 <Transition.Child
//                     as={React.Fragment}
//                     enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
//                     leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black/30" />
//                 </Transition.Child>

//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center">
//                         <Transition.Child
//                             as={React.Fragment}
//                             enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[90vh] flex flex-col">
                                
//                                 {/* Encabezado del Modal */}
//                                 <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 p-6 pb-4 border-b flex justify-between items-center">
//                                     Detalles - Cultivo
//                                     <button type="button" className="text-gray-400 hover:text-gray-600" onClick={closeModal}>
//                                         <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//                                     </button>
//                                 </Dialog.Title>

//                                 {/* Formulario con Contenido Desplazable */}
//                                 <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
//                                     {Object.keys(formSections).map((sectionTitle) => {
//                                         const isExpanded = expandedSection === sectionTitle;
//                                         return (
//                                             <div key={sectionTitle}>
//                                                 {/* Encabezado de la Sección (Estilo Acordeón) */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => toggleAccordion(sectionTitle)}
//                                                     className="w-full flex justify-between items-center py-2 text-left text-xl font-bold text-gray-900 border-b border-gray-300 mb-4 hover:text-green-600 transition duration-150"
//                                                 >
//                                                     <span>{sectionTitle}</span>
//                                                     <svg className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'transform rotate-180 text-green-600' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//                                                 </button>
                                                
//                                                 {/* Contenido de la Sección */}
//                                                 <div 
//                                                     className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}
//                                                 >
//                                                     {isExpanded && formSections[sectionTitle].map((field) => (
//                                                         <div key={field.key} className={field.widthClass || 'lg:col-span-1'}>
//                                                             {field.type !== 'checkbox' && (
//                                                                 <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
//                                                                     {field.label}
//                                                                     {field.required && <span className="text-red-500"> *</span>}
//                                                                     <span className="text-gray-400 text-xs ml-1">(i)</span>
//                                                                 </label>
//                                                             )}
//                                                             {renderField(field)}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </form>

//                                 {/* Pie de página con botones */}
//                                 <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 sticky bottom-0">
//                                     <button
//                                         type="button"
//                                         className="inline-flex justify-center rounded-md border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 transition"
//                                     >
//                                         Borrar
//                                     </button>
//                                     <div className="flex space-x-3">
//                                         <button
//                                             type="button"
//                                             onClick={closeModal}
//                                             className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
//                                         >
//                                             Cancelar
//                                         </button>
//                                         <button
//                                             type="button"
//                                             className="inline-flex justify-center rounded-md border border-green-500 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50 transition"
//                                         >
//                                             Guardar y duplicar
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             onClick={handleSubmit}
//                                             className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
//                                         >
//                                             Guardar
//                                         </button>
//                                     </div>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// };

// export default DatosCultivoModal;


import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

// =========================================================================
// 1. DEFINICIÓN DE DATOS DEL FORMULARIO (Se mantiene igual por ser la lógica)
// =========================================================================

const selectOptions = {
    // ... (Tu lista de opciones de selección completa, acortada aquí por espacio)
    parcelaAsociada: ["General Balsicas 2026 (0.01ha)", "Inv 2 calabacin 2026 (1.12ha)"],
    areaUnits: ["ha", "m²"],
    daysUnits: ["días"],
    distUnits: ["m", "cm"],
    numPlantsUnits: ["Total", "Plantas/ha"],
    depthUnits: ["cm"],
    tipoCultivo: ["Calabacín", "Tomate", "Avena", "Otro"],
    tipoSuelo: ["Muy arcilloso", "Franco", "Fibra de coco"],
    sistemaConduccion: ["Palmeta", "Sebe", "Eje", "Florera"],
    sistemaRiego: ["Goteo", "Aspersión", "Inundación", "Sin Riego"], 
    cubiertaSuelo: ["Suelo desprotegido", "Cubierta vegetal del suelo sembrada", "Mulching inorgánico"],
    conservacionSuelo: ["Mobilização mínima", "Cobertura del suelo", "Siembra directa"],
    medidasPreventivas: ["Bandas de compensación ecológica", "Setos vegetales", "Variedades resistentes"],
    modoProduccion: ["Convencional", "Producción Integrada", "Agricultura Ecológica"],
    tipoProteccion: ["Aire libre", "Túnel", "Invernadero", "Red antigranizo"],
    tipoSistemaAgricola: ["Tradicional", "Intensivo", "Super intensivo"],
    sistemaCultivo: ["rotación", "Sucesión", "Escalado"],
    produccionEsperada: ["kg/ha", "ton/ha", "L"],
    certificaciones: ["GlobalG.A.P.", "ZERYA - ZERYA Sin residuos"],
    usoSigpac: ["TA - TIERRAS ARABLES", "IV - INVERNADEROS Y CULTIVOS BAJO PLASTICO"],
};

const formSections = {
    'General': [
        { label: "Nombre del cultivo *", key: "cropName", type: "text", required: true, widthClass: "lg:col-span-1" },
        { label: "Parcela Asociada *", key: "associatedPlot", type: "select", options: selectOptions.parcelaAsociada, required: true, widthClass: "lg:col-span-1" },
        { label: "Área plantada *", key: "plantedArea", type: "numberWithUnit", unitOptions: selectOptions.areaUnits, required: true, widthClass: "lg:col-span-1" },
        { label: "Fecha de Plantación / Semilla", key: "plantingDate", type: "date", widthClass: "lg:col-span-1" },
        { label: "Fecha de eliminación del cultivo", key: "removalDate", type: "date", widthClass: "lg:col-span-1" },
        { label: "Código de Cultivo", key: "cropCode", type: "text", widthClass: "lg:col-span-1" },
        { label: "Tipo de Cultivo *", key: "cropType", type: "select", options: selectOptions.tipoCultivo, required: true, widthClass: "lg:col-span-1" },
        { label: "Variedades", key: "varieties", type: "text", widthClass: "lg:col-span-1" },
        { label: "Tipo de suelo", key: "soilType", type: "select", options: selectOptions.tipoSuelo, widthClass: "lg:col-span-1" },
        { label: "Portainjerto", key: "rootstock", type: "text", widthClass: "lg:col-span-1" },
        { label: "Días para la cosecha", key: "daysToHarvest", type: "numberWithUnit", unitOptions: selectOptions.daysUnits, widthClass: "lg:col-span-1" },
        { label: "Crear recomendación de cosecha en actividades de campo", key: "createRecommendation", type: "checkbox", widthClass: "lg:col-span-1 mt-6" },
    ],
    'Instalación': [
        { label: "Distancia entre plantas en la línea", key: "plantDistance", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
        { label: "Espacio entre filas", key: "rowSpace", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
        { label: "Anchura de la planta en línea", key: "plantWidth", type: "numberWithUnit", unitOptions: selectOptions.distUnits, widthClass: "lg:col-span-1" },
        { label: "Número de plantas", key: "numPlants", type: "numberWithUnit", unitOptions: selectOptions.numPlantsUnits, widthClass: "lg:col-span-1" },
        { label: "Sistema de conducción", key: "drivingSystem", type: "select", options: selectOptions.sistemaConduccion, widthClass: "lg:col-span-1" },
        { label: "Filas (Ejemplo: 1-5, 8, 11-13)", key: "rowsExample", type: "text", widthClass: "lg:col-span-1" },
        { label: "Profundidad de Plantación / Semilla", key: "plantingDepth", type: "numberWithUnit", unitOptions: selectOptions.depthUnits, widthClass: "lg:col-span-1" },
        { label: "Sistema de Riego", key: "irrigationSystem", type: "select", options: selectOptions.sistemaRiego, widthClass: "lg:col-span-1" },
    ],
    'Buenas Prácticas': [
        { label: "Cubierta del Suelo", key: "soilCover", type: "select", options: selectOptions.cubiertaSuelo, widthClass: "lg:col-span-1" },
        { label: "Conservación del suelo", key: "soilConservation", type: "select", options: selectOptions.conservacionSuelo, widthClass: "lg:col-span-1" },
        { label: "Medidas preventivas", key: "preventiveMeasures", type: "select", options: selectOptions.medidasPreventivas, widthClass: "lg:col-span-1" },
    ],
    'Otros': [
        { label: "Modo de Producción", key: "productionMode", type: "select", options: selectOptions.modoProduccion, widthClass: "lg:col-span-1" },
        { label: "Tipo de protección *", key: "protectionType", type: "select", options: selectOptions.tipoProteccion, required: true, widthClass: "lg:col-span-1" },
        { label: "Tipo de sistema agrícola *", key: "agriculturalSystemType", type: "select", options: selectOptions.tipoSistemaAgricola, required: true, widthClass: "lg:col-span-1" },
        { label: "Sistema de cultivo", key: "croppingSystem", type: "select", options: selectOptions.sistemaCultivo, widthClass: "lg:col-span-1" },
        { label: "Cultivo Anterior", key: "previousCrop", type: "select", options: selectOptions.tipoCultivo, widthClass: "lg:col-span-1" },
        { label: "Cultivos adyacentes", key: "adjacentCrops", type: "select", options: selectOptions.tipoCultivo, widthClass: "lg:col-span-1" },
        { label: "Producción Esperada", key: "expectedProduction", type: "numberWithUnit", unitOptions: selectOptions.produccionEsperada, widthClass: "lg:col-span-1" },
        { label: "Certificaciones / interventions", key: "certifications", type: "select", options: selectOptions.certificaciones, widthClass: "lg:col-span-1" },
        { label: "Ancho de trabajo (m)", key: "workWidth", type: "number", widthClass: "lg:col-span-1" },
        { label: "Código interno", key: "internalCode", type: "text", widthClass: "lg:col-span-1" },
        { label: "Color *", key: "color", type: "text", required: true, widthClass: "lg:col-span-1" }, 
        { label: "Vivero", key: "nursery", type: "text", widthClass: "lg:col-span-1" },
        { label: "Archivado", key: "archived", type: "select", options: ["Sí", "No"], widthClass: "lg:col-span-1" }, 
        { label: "Uso SIGPAC", key: "sigpacUse", type: "select", options: selectOptions.usoSigpac, widthClass: "lg:col-span-1" },
    ],
};


// =========================================================================
// 2. COMPONENTE MODAL DE REACT (Estilos actualizados)
// =========================================================================

const DatosCultivoModal = ({ isOpen, closeModal }) => {
    const [expandedSection, setExpandedSection] = useState('General'); 
    const [formData, setFormData] = useState({
        // Valores por defecto
        cropName: "General Balsicas 2026",
        associatedPlot: selectOptions.parcelaAsociada[0],
        plantedArea: "0.01",
        plantedAreaUnit: selectOptions.areaUnits[0],
        createRecommendation: false,
    });

    const handleFieldChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del Cultivo Guardados:", formData);
        closeModal();
    };

    const toggleAccordion = (title) => {
        setExpandedSection(expandedSection === title ? null : title);
    };

    // Estilos de Tailwind unificados para los inputs
    const INPUT_CLASSES = "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-150 ease-in-out";
    
    // Función de renderizado de inputs
    const renderUnitInput = (field) => {
        const value = formData[field.key] || '';
        const unit = formData[`${field.key}Unit`] || field.unitOptions[0];

        return (
            <div className="flex space-x-2">
                <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={INPUT_CLASSES + " flex-grow"}
                />
                <select
                    value={unit}
                    onChange={(e) => handleFieldChange(`${field.key}Unit`, e.target.value)}
                    className={INPUT_CLASSES + " w-20"}
                >
                    {field.unitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        );
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.key,
            name: field.key,
            className: INPUT_CLASSES,
        };

        if (field.type === 'select') {
            return (
                <select 
                    {...commonProps} 
                    value={formData[field.key] || field.options[0] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                >
                    {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        } else if (field.type === 'numberWithUnit') {
            return renderUnitInput(field);
        } else if (field.type === 'checkbox') {
            return (
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        checked={formData[field.key] || false}
                        onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 shadow-sm transition"
                    />
                    <label htmlFor={field.key} className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                        {field.label}
                    </label>
                </div>
            );
        } else if (field.type === 'date') {
            return (
                <input
                    {...commonProps}
                    type="date"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
            );
        } else { // text, number, etc.
            return (
                <input
                    {...commonProps}
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
            );
        }
    };


    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            {/* Panel del Modal con sombra más profunda y bordes suaves */}
                            <Dialog.Panel className="w-full max-w-4xl transform rounded-xl bg-white text-left align-middle shadow-2xl transition-all h-[90vh] flex flex-col">
                                
                                {/* Encabezado (Fijo) */}
                                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                                        Detalles del Cultivo
                                    </Dialog.Title>
                                    <button type="button" className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition" onClick={closeModal}>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Formulario con Contenido Desplazable */}
                                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-8">
                                    {Object.keys(formSections).map((sectionTitle) => {
                                        const isExpanded = expandedSection === sectionTitle;
                                        return (
                                            <div key={sectionTitle} className="border border-gray-100 rounded-lg shadow-sm p-4 bg-gray-50/50">
                                                {/* Encabezado de la Sección (Estilo Acordeón mejorado) */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleAccordion(sectionTitle)}
                                                    className="w-full flex justify-between items-center py-2 text-left text-lg font-semibold text-gray-800 hover:text-green-600 transition duration-150"
                                                >
                                                    <span>{sectionTitle}</span>
                                                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'transform rotate-180 text-green-600' : 'text-gray-500'}`} aria-hidden="true" />
                                                </button>
                                                
                                                {/* Contenido de la Sección */}
                                                <div 
                                                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 pt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                                >
                                                    {formSections[sectionTitle].map((field) => (
                                                        <div key={field.key} className={field.widthClass || 'lg:col-span-1'}>
                                                            {field.type !== 'checkbox' && (
                                                                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                                                                    {field.label}
                                                                    {field.required && <span className="text-red-500"> *</span>}
                                                                    <span className="text-gray-400 text-xs ml-1 cursor-pointer" title="Información adicional">(i)</span>
                                                                </label>
                                                            )}
                                                            {renderField(field)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </form>

                                {/* Pie de página con botones (Fijo) */}
                                <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-md">
                                    {/* Botón de Borrar (Izquierda) */}
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-lg border border-transparent bg-red-50 hover:bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition duration-150"
                                    >
                                        Borrar Cultivo
                                    </button>
                                    
                                    {/* Botones de Acción (Derecha) */}
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition duration-150"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-100 transition duration-150"
                                        >
                                            Guardar y duplicar
                                        </button>
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DatosCultivoModal;