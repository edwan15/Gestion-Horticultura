// import React, { useState, useMemo, useCallback, Fragment } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { XMarkIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

// // =========================================================================
// // === UTILIDADES / SIMULACIÓN DE COMPONENTES
// // =========================================================================

// const formatNumber = (num, decimales = 2) => {
//     const numericNum = Number(num);
//     if (num === null || num === undefined || isNaN(numericNum)) return "0.00";
//     return numericNum.toLocaleString("es-ES", {
//         minimumFractionDigits: decimales,
//         maximumFractionDigits: decimales,
//     });
// };

// const DUMMY_STATS = {
//     historicalMax: 15000,
//     historicalMin: 8000,
//     historicalAvg: 12500,
//     lastHarvest: "2025-10-01",
//     totalGrowthDays: 180,
//     dailyTotalSum: 11200, // Suma diaria de producción (ejemplo)
// };

// const StatItem = ({ title, value, unit }) => (
//     <div className="border-l-4 border-blue-400 pl-3">
//         <p className="text-sm text-gray-500">{title}</p>
//         <p className="text-lg font-semibold text-blue-800">{value} <span className="text-xs font-normal text-gray-600">{unit}</span></p>
//     </div>
// );

// const DatosEstadisticosCard = ({ stats, formatNumber }) => (
//     <div className="bg-blue-50 p-6 rounded-xl border border-blue-300 shadow-lg col-span-1 md:col-span-3">
//         <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
//             Datos Estadísticos del Cultivo
//         </h3>
//         <div className="grid grid-cols-2 gap-4">
//             <StatItem title="Producción Histórica Máx (Kg/ha)" value={formatNumber(stats.historicalMax)} unit="Kg/ha" />
//             <StatItem title="Producción Histórica Mín (Kg/ha)" value={formatNumber(stats.historicalMin)} unit="Kg/ha" />
//             <StatItem title="Producción Promedio (Kg/ha)" value={formatNumber(stats.historicalAvg)} unit="Kg/ha" />
//             <StatItem title="Días totales de crecimiento" value={stats.totalGrowthDays} unit="días" />
//             <StatItem title="Última Cosecha" value={stats.lastHarvest || "N/A"} unit="" />
//         </div>
//     </div>
// );

// const InlineGoalInput = ({ globalGoal, updateGoal }) => {
//     const [goal, setGoal] = useState(globalGoal.goal.toString() || '0');
//     const [deadline, setDeadline] = useState(globalGoal.deadline || "");

//     const handleSave = () => {
//         updateGoal(Number(goal), deadline);
//     };

//     return (
//         <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-300 shadow-lg col-span-1 md:col-span-3">
//             <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">
//                 Establecer Meta Global (Kg)
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <input
//                     type="number"
//                     value={goal}
//                     onChange={(e) => setGoal(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//                     placeholder="Meta de Producción (Kg)"
//                 />
//                 <input
//                     type="date"
//                     value={deadline}
//                     onChange={(e) => setDeadline(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
//                     placeholder="Fecha Límite"
//                 />
//                 <button
//                     onClick={handleSave}
//                     type="button"
//                     className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//                 >
//                     Guardar Meta
//                 </button>
//             </div>
//         </div>
//     );
// };

// // =========================================================================
// // === CONFIGURACIÓN Y FORMULARIO
// // =========================================================================

// const TABS = [
//     { name: "Finca", icon: "🏠" },
//     { name: "Parcela", icon: "🗺️" },
//     { name: "Cultivo", icon: "🌱", current: true },
//     { name: "Zona Hom...", icon: "📍" }
// ];

// const initialCultivoData = {
//     cropName: 'Tomate Chonto',
//     cultivar: 'Tipo A',
//     sowingDate: '2025-05-15',
//     harvestDate: '2025-10-15',
//     expectedYield: 15000,
//     greenhouse: true,
//     greenhouseType: 'Plástico',
//     irrigationType: 'Goteo',
//     plantingDensity: 25000,
//     plantingUnit: 'plants/ha',
//     estimatedCost: 12000000,
//     currentProduction: 11200,
//     goal: 13000,
//     deadline: '2025-11-30',
// };

// const formSections = {
//     'Información General': [
//         { key: 'cropName', label: 'Nombre del Cultivo', type: 'text', readOnly: true },
//         { key: 'cultivar', label: 'Variedad/Cultivar', type: 'text', readOnly: true },
//         { key: 'sowingDate', label: 'Fecha de Siembra', type: 'date', readOnly: true },
//         { key: 'harvestDate', label: 'Fecha de Cosecha (Est.)', type: 'date', readOnly: true },
//     ],
//     'Producción': [
//         { key: 'greenhouse', label: 'Bajo Invernadero', type: 'boolean', readOnly: true, options: ['Sí', 'No'] },
//         { key: 'greenhouseType', label: 'Tipo de Invernadero', type: 'text', readOnly: true, dependsOn: 'greenhouse', showIf: true },
//         { key: 'irrigationType', label: 'Tipo de Riego', type: 'text', readOnly: true },
//         { key: 'plantingDensity', label: 'Densidad de Siembra', type: 'number', readOnly: true, unit: 'pl/ha' },
//         { key: 'currentProduction', label: 'Producción Actual', type: 'number', readOnly: true, unit: 'Kg' },
//         { key: 'expectedYield', label: 'Rendimiento Esperado', type: 'number', readOnly: true, unit: 'Kg/ha' },
//     ],
//     'Economía': [
//         { key: 'estimatedCost', label: 'Costo Est. Total', type: 'currency', readOnly: true },
//         // Otros campos económicos si los hubiere
//     ],
// };

// // =========================================================================
// // === COMPONENTE PRINCIPAL
// // =========================================================================

// export default function DetallesCultivoProduccionModal({ open, onClose, initialData = initialCultivoData }) {
//     const [cultivoData, setCultivoData] = useState(initialData);
//     const [openSections, setOpenSections] = useState({
//         'Información General': true,
//         'Producción': true,
//         'Economía': false,
//     });
//     const [globalGoal, setGlobalGoal] = useState({
//         goal: initialData.goal,
//         deadline: initialData.deadline
//     });

//     const toggleSection = (sectionTitle) => {
//         setOpenSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
//     };

//     const updateGoal = useCallback((newGoal, newDeadline) => {
//         setGlobalGoal({ goal: newGoal, deadline: newDeadline });
//         // Lógica para guardar en API aquí
//         console.log(`Meta global actualizada: ${newGoal} Kg para el ${newDeadline}`);
//     }, []);

//     const renderField = useCallback((fieldConfig) => {
//         if (!fieldConfig) return null;

//         let displayValue;
//         const value = cultivoData[fieldConfig.key];

//         switch (fieldConfig.type) {
//             case 'boolean':
//                 // Manejo de valores booleanos para mostrar 'Sí'/'No'
//                 displayValue = value ? 'Sí' : 'No';
//                 break;
//             case 'date':
//                 // Formato de fecha
//                 displayValue = value ? new Date(value).toLocaleDateString('es-ES') : 'N/A';
//                 break;
//             case 'currency':
//                 // Formato de moneda (simulado como COP en este caso)
//                 displayValue = `$ ${formatNumber(value, 0)}`;
//                 break;
//             case 'number':
//                 // Formato de números con unidad
//                 displayValue = `${formatNumber(value)} ${fieldConfig.unit || ''}`;
//                 break;
//             default:
//                 // Texto simple o cualquier otro tipo
//                 displayValue = value || 'N/A';
//         }

//         return (
//             <div key={fieldConfig.key} className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-500">{fieldConfig.label}</label>
//                 <p className="text-lg font-semibold text-gray-900">{displayValue}</p>
//             </div>
//         );
//     }, [cultivoData]); // Depende de los datos del cultivo para la actualización

//     // Mantenemos el useMemo para la estructura del formulario si los datos o secciones cambian.
//     const formContent = useMemo(() => {
//         return Object.keys(formSections).map((sectionTitle) => {
//             // Lógica para determinar si el campo 'greenhouseType' debe mostrarse
//             const isGreenhouse = cultivoData.greenhouse;

//             return (
//                 <div key={sectionTitle} className="mb-4 border border-gray-200 rounded-lg shadow-sm">
//                     <button
//                         className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
//                         onClick={() => toggleSection(sectionTitle)}
//                     >
//                         {sectionTitle}
//                         <ChevronUpIcon
//                             className={`w-5 h-5 transition-transform ${openSections[sectionTitle] ? 'transform rotate-0' : 'transform rotate-180'}`}
//                         />
//                     </button>
//                     {openSections[sectionTitle] && (
//                         <div className="p-6 bg-white rounded-b-lg">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
//                                 {formSections[sectionTitle]
//                                     .filter(field => {
//                                         // Filtra el campo 'greenhouseType' si greenhouse es false (No)
//                                         if (field.key === 'greenhouseType' && !isGreenhouse) {
//                                             return false;
//                                         }
//                                         return true; // Mostrar todos los demás campos
//                                     })
//                                     .map((field) => renderField(field))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             );
//         });
//     }, [cultivoData, openSections, renderField]); // Dependencias: Datos, estado de secciones y renderField

//     return (
//         <Transition appear show={open} as={Fragment}>
//             <Dialog as="div" className="relative z-50" onClose={onClose}>
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black bg-opacity-25" />
//                 </Transition.Child>

//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                                 <div className="flex justify-between items-start border-b pb-4">
//                                     <Dialog.Title
//                                         as="h3"
//                                         className="text-2xl font-bold leading-6 text-gray-900"
//                                     >
//                                         Detalles de Producción: {cultivoData.cropName}
//                                     </Dialog.Title>
//                                     <button
//                                         type="button"
//                                         className="text-gray-400 hover:text-gray-600 transition"
//                                         onClick={onClose}
//                                     >
//                                         <XMarkIcon className="w-6 h-6" />
//                                     </button>
//                                 </div>

//                                 {/* Contenido del Modal */}
//                                 <div className="mt-6 space-y-8">
//                                     {/* Componentes de Metas y Estadísticas */}
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <InlineGoalInput globalGoal={globalGoal} updateGoal={updateGoal} />
//                                         <DatosEstadisticosCard stats={DUMMY_STATS} formatNumber={formatNumber} />
//                                     </div>

//                                     {/* Navegación (Simulada) */}
//                                     <nav className="flex space-x-4 border-b pb-2">
//                                         {TABS.map((tab) => (
//                                             <a
//                                                 key={tab.name}
//                                                 href="#"
//                                                 className={`px-3 py-2 font-medium text-sm rounded-md transition-colors ${tab.current
//                                                     ? 'bg-green-100 text-green-700'
//                                                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                                                     }`}
//                                                 aria-current={tab.current ? 'page' : undefined}
//                                             >
//                                                 {tab.icon} {tab.name}
//                                             </a>
//                                         ))}
//                                     </nav>

//                                     {/* Secciones del Acordeón (useMemo) */}
//                                     <div className="mt-4">
//                                         {formContent}
//                                     </div>
//                                 </div>
//                                 {/* Fin Contenido del Modal */}

//                                 <div className="mt-6 pt-4 border-t flex justify-end">
//                                     <button
//                                         type="button"
//                                         className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 transition"
//                                         onClick={onClose}
//                                     >
//                                         Cerrar
//                                     </button>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// }





// DetallesCultivoProduccionModal.js
import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

// =========================================================================
// === UTILIDADES / SIMULACIÓN DE COMPONENTES (MOVILIZADOS)
// =========================================================================

// Usamos el formatNumber que ya tenías
const formatNumber = (num, decimales = 2) => {
    const numericNum = Number(num);
    if (num === null || num === undefined || isNaN(numericNum)) return "0.00";
    return numericNum.toLocaleString("es-ES", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    });
};

const DUMMY_STATS = {
    historicalMax: 15000,
    historicalMin: 8000,
    historicalAvg: 12500,
    lastHarvest: "2025-10-01",
    totalGrowthDays: 180,
    dailyTotalSum: 11200, // Suma diaria de producción (ejemplo)
};

const StatItem = ({ title, value, unit }) => (
    <div className="border-l-4 border-blue-400 pl-3">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-blue-800">{value} <span className="text-xs font-normal text-gray-600">{unit}</span></p>
    </div>
);

// Card de Estadísticas (Ahora recibe formatNumber de props)
const DatosEstadisticosCard = ({ stats, openDetailsModal, dailyTotalSum, formatNumber }) => (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-300 shadow-lg col-span-1">
        <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2 flex justify-between items-center">
            Datos Estadísticos
            <button 
                onClick={openDetailsModal} 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
                Ver Detalles
            </button>
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <StatItem title="Producción Acumulada (Kg)" value={formatNumber(dailyTotalSum)} unit="Kg" />
            <StatItem title="Rendimiento Esperado (Kg/ha)" value={formatNumber(stats.expectedYield)} unit="Kg/ha" />
            <StatItem title="Días totales de crecimiento" value={stats.totalGrowthDays} unit="días" />
            <StatItem title="Última Cosecha" value={stats.lastHarvest || "N/A"} unit="" />
        </div>
    </div>
);

const InlineGoalInput = ({ globalGoal, updateGoal }) => {
    const [goal, setGoal] = useState(globalGoal.goal.toString() || '0');
    const [deadline, setDeadline] = useState(globalGoal.deadline || "");

    const handleSave = () => {
        updateGoal(Number(goal), deadline);
    };

    return (
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-300 shadow-lg col-span-1">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">
                Establecer Meta Global (Kg)
            </h3>
            <div className="space-y-3">
                <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                    placeholder="Meta de Producción (Kg)"
                />
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                    placeholder="Fecha Límite"
                />
                <button
                    onClick={handleSave}
                    type="button"
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    Guardar Meta
                </button>
            </div>
        </div>
    );
};


// =========================================================================
// === CONFIGURACIÓN Y FORMULARIO (MANTENIDO DENTRO DEL MODAL)
// =========================================================================

const TABS = [
    { name: "Finca", icon: "🏠" },
    { name: "Parcela", icon: "🗺️" },
    { name: "Cultivo", icon: "🌱", current: true },
    { name: "Zona Hom...", icon: "📍" }
];

const initialCultivoData = {
    cropName: 'Tomate Chonto',
    cultivar: 'Tipo A',
    sowingDate: '2025-05-15',
    harvestDate: '2025-10-15',
    expectedYield: 15000,
    greenhouse: true,
    greenhouseType: 'Plástico',
    irrigationType: 'Goteo',
    plantingDensity: 25000,
    plantingUnit: 'plants/ha',
    estimatedCost: 12000000,
    currentProduction: 11200,
    goal: 13000,
    deadline: '2025-11-30',
};

const formSections = {
    'Información General': [
        { key: 'cropName', label: 'Nombre del Cultivo', type: 'text', readOnly: true },
        { key: 'cultivar', label: 'Variedad/Cultivar', type: 'text', readOnly: true },
        { key: 'sowingDate', label: 'Fecha de Siembra', type: 'date', readOnly: true },
        { key: 'harvestDate', label: 'Fecha de Cosecha (Est.)', type: 'date', readOnly: true },
    ],
    'Producción': [
        { key: 'greenhouse', label: 'Bajo Invernadero', type: 'boolean', readOnly: true, options: ['Sí', 'No'] },
        { key: 'greenhouseType', label: 'Tipo de Invernadero', type: 'text', readOnly: true, dependsOn: 'greenhouse', showIf: true },
        { key: 'irrigationType', label: 'Tipo de Riego', type: 'text', readOnly: true },
        { key: 'plantingDensity', label: 'Densidad de Siembra', type: 'number', readOnly: true, unit: 'pl/ha' },
        { key: 'currentProduction', label: 'Producción Actual', type: 'number', readOnly: true, unit: 'Kg' },
        { key: 'expectedYield', label: 'Rendimiento Esperado', type: 'number', readOnly: true, unit: 'Kg/ha' },
    ],
    'Economía': [
        { key: 'estimatedCost', label: 'Costo Est. Total', type: 'currency', readOnly: true },
        // Otros campos económicos si los hubiere
    ],
};

// =========================================================================
// === COMPONENTE PRINCIPAL DEL MODAL
// =========================================================================

export default function DetallesCultivoProduccionModal({ open, onClose, initialData = initialCultivoData }) {
    const [cultivoData, setCultivoData] = useState(initialData);
    const [openSections, setOpenSections] = useState({
        'Información General': true,
        'Producción': true,
        'Economía': false,
    });
    const [globalGoal, setGlobalGoal] = useState({
        goal: initialData.goal,
        deadline: initialData.deadline
    });

    const toggleSection = (sectionTitle) => {
        setOpenSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
    };

    const updateGoal = useCallback((newGoal, newDeadline) => {
        setGlobalGoal({ goal: newGoal, deadline: newDeadline });
        // Lógica para guardar en API aquí
        console.log(`Meta global actualizada: ${newGoal} Kg para el ${newDeadline}`);
    }, []);

    const renderField = useCallback((fieldConfig) => {
        if (!fieldConfig) return null;

        let displayValue;
        const value = cultivoData[fieldConfig.key];

        switch (fieldConfig.type) {
            case 'boolean':
                displayValue = value ? 'Sí' : 'No';
                break;
            case 'date':
                displayValue = value ? new Date(value).toLocaleDateString('es-ES') : 'N/A';
                break;
            case 'currency':
                displayValue = `$ ${formatNumber(value, 0)}`;
                break;
            case 'number':
                displayValue = `${formatNumber(value)} ${fieldConfig.unit || ''}`;
                break;
            default:
                displayValue = value || 'N/A';
        }

        return (
            <div key={fieldConfig.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">{fieldConfig.label}</label>
                <p className="text-lg font-semibold text-gray-900">{displayValue}</p>
            </div>
        );
    }, [cultivoData]);

    const formContent = useMemo(() => {
        return Object.keys(formSections).map((sectionTitle) => {
            const isGreenhouse = cultivoData.greenhouse;

            return (
                <div key={sectionTitle} className="mb-4 border border-gray-200 rounded-lg shadow-sm">
                    <button
                        className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
                        onClick={() => toggleSection(sectionTitle)}
                    >
                        {sectionTitle}
                        <ChevronUpIcon
                            className={`w-5 h-5 transition-transform ${openSections[sectionTitle] ? 'transform rotate-0' : 'transform rotate-180'}`}
                        />
                    </button>
                    {openSections[sectionTitle] && (
                        <div className="p-6 bg-white rounded-b-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                                {formSections[sectionTitle]
                                    .filter(field => {
                                        if (field.key === 'greenhouseType' && !isGreenhouse) {
                                            return false;
                                        }
                                        return true;
                                    })
                                    .map((field) => renderField(field))}
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    }, [cultivoData, openSections, renderField]);

    return (
        // ******************************************************************
        // CLAVE: Usa 'open' en la prop 'show' de Transition
        <Transition appear show={open} as={Fragment}> 
        // ******************************************************************
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start border-b pb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900"
                                    >
                                        Detalles de Producción: {cultivoData.cropName}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 transition"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Contenido del Modal */}
                                <div className="mt-6 space-y-8">
                                    {/* Componentes de Metas y Estadísticas */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InlineGoalInput globalGoal={globalGoal} updateGoal={updateGoal} />
                                        <DatosEstadisticosCard stats={{ ...DUMMY_STATS, expectedYield: cultivoData.expectedYield }} dailyTotalSum={cultivoData.currentProduction} formatNumber={formatNumber} openDetailsModal={() => {}} />
                                    </div>

                                    {/* Navegación (Simulada) */}
                                    <nav className="flex space-x-4 border-b pb-2">
                                        {TABS.map((tab) => (
                                            <a
                                                key={tab.name}
                                                href="#"
                                                className={`px-3 py-2 font-medium text-sm rounded-md transition-colors ${tab.current
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                aria-current={tab.current ? 'page' : undefined}
                                            >
                                                {tab.icon} {tab.name}
                                            </a>
                                        ))}
                                    </nav>

                                    {/* Secciones del Acordeón (useMemo) */}
                                    <div className="mt-4">
                                        {formContent}
                                    </div>
                                </div>
                                {/* Fin Contenido del Modal */}

                                <div className="mt-6 pt-4 border-t flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 transition"
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}