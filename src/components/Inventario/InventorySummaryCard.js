// // InventorySummaryCard.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// // Asumiendo que has instalado react-icons/fa6 o similar
// import { FaSprayCan, FaSeedling, FaBox, FaLeaf } from 'react-icons/fa6'; 
// import ProgressBarItem from './ProgressBarItem'; // Importa la barra que creamos

// // Componente para las tarjetas pequeñas de conteo (Fitosanitarios: 3)
// const CountCard = ({ title, count, Icon, colorClass }) => (
//     <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between border-b-4 border-gray-200 hover:border-indigo-500 transition duration-300">
//         <div className="flex flex-col">
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className={`text-2xl font-bold ${colorClass}`}>
//                 {count}
//             </p>
//         </div>
//         <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')} transition duration-300`}>
//             <Icon className={`${colorClass} w-6 h-6`} />
//         </div>
//     </div>
// );

// // --- MOCK DATA PARA DEMOSTRACIÓN ---
// // NOTA: En tu aplicación real, esta data debería venir de tu Redux store o de una API
// const mockSummaryData = [
//     { title: 'Fitosanitarios', count: 3, Icon: FaSprayCan, colorClass: 'text-green-600' },
//     { title: 'Fertilizantes', count: 8, Icon: FaSeedling, colorClass: 'text-yellow-600' },
//     { title: 'Trampas', count: 0, Icon: FaBox, colorClass: 'text-red-500' },
//     { title: 'Plantas', count: 0, Icon: FaLeaf, colorClass: 'text-indigo-500' },
// ];

// const mockProgressData = [
//     { name: 'VERIMARK', weight: '2,000.00 kg', totalValue: '910.00', stockPercentage: 45.5 },
//     { name: 'PROPLANT', weight: '10.00 kg', totalValue: '248.80', stockPercentage: 80 },
//     { name: 'TREND 90', weight: '30.00 kg', totalValue: '217.50', stockPercentage: 30 },
// ];

// const InventorySummaryCard = ({ totalInventoryValue = '4 780.80', categoryStockValue = '1 376.30' }) => {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="bg-white p-6 rounded-2xl shadow-2xl mb-8 border border-gray-100"
//         >
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
//                 Inventario de Productos 📈
//                 <span className="text-green-500 text-xl ml-3">›</span>
//             </h2>

//             {/* 1. Resumen de Conteo (4 Cards) */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {mockSummaryData.map((item, index) => (
//                     <CountCard key={index} {...item} />
//                 ))}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 2. Barras de Progreso (Detalle de Stock Clave) */}
//             <h3 className="text-xl font-bold text-gray-700 mb-4">Detalle de Stock Crítico</h3>
//             <div className="space-y-4">
//                 {mockProgressData.map((item, index) => (
//                     <ProgressBarItem key={index} {...item} />
//                 ))}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 3. Totales Financieros */}
//             <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
                
//                 {/* Total Global */}
//                 <div className="mb-4 sm:mb-0">
//                     <p className="text-sm text-gray-500 uppercase font-medium">Total del inventario valorado</p>
//                     <p className="text-3xl font-extrabold text-indigo-700">{totalInventoryValue} €</p>
//                 </div>

//                 {/* Total Categoría Clave */}
//                 <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg shadow-inner">
//                     <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
//                     <div>
//                         <p className="text-sm font-semibold text-blue-600">Valor en Fitosanitarios</p>
//                         <p className="text-2xl font-extrabold text-blue-800">{categoryStockValue} €</p>
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default InventorySummaryCard;



// // InventorySummaryCard.jsx

// // Componente para las tarjetas pequeñas de conteo (Fitosanitarios: 3)
// // Asegúrate de importar los iconos de FaSprayCan, FaSeedling, etc.
// import { FaSprayCan, FaSeedling, FaBox, FaLeaf } from 'react-icons/fa6'; 
// import { motion } from 'framer-motion';
// import ProgressBarItem from './ProgressBarItem';
// // Mapeo de Categorías a Iconos
// const categoryIconMap = {
//     'Fitosanitarios': { Icon: FaSprayCan, colorClass: 'text-green-600' },
//     'Fertilizantes': { Icon: FaSeedling, colorClass: 'text-yellow-600' },
//     'Trampas': { Icon: FaBox, colorClass: 'text-red-500' },
//     'Otros': { Icon: FaLeaf, colorClass: 'text-indigo-500' },
// };

// const CountCard = ({ title, count, colorClass }) => {
//     const { Icon, colorClass: defaultColor } = categoryIconMap[title] || { Icon: FaBox, colorClass: 'text-gray-500' };
//     const finalColor = colorClass || defaultColor;

//     return (
//         <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between border-b-4 border-gray-200 hover:border-indigo-500 transition duration-300">
//             <div className="flex flex-col">
//                 <p className="text-sm font-medium text-gray-500">{title}</p>
//                 <p className={`text-2xl font-bold ${finalColor}`}>
//                     {count}
//                 </p>
//             </div>
//             {/* Usamos finalColor para el círculo de fondo */}
//             <div className={`p-3 rounded-full bg-opacity-10 ${finalColor.replace('text-', 'bg-')} transition duration-300`}>
//                 <Icon className={`${finalColor} w-6 h-6`} />
//             </div>
//         </div>
//     );
// };

// // Componente principal actualizado
// const InventorySummaryCard = ({ 
//     summaryData = [], 
//     progressData = [], 
//     totalInventoryValue = '0.00', 
//     categoryStockValue = '0.00' 
// }) => {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="bg-white p-6 rounded-2xl shadow-2xl mb-8 border border-gray-100"
//         >
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
//                 Resumen de Inventario 📊
//                 <span className="text-green-500 text-xl ml-3">›</span>
//             </h2>

//             {/* 1. Resumen de Conteo (Cards) */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {/* Usamos los datos reales pasados por prop */}
//                 {summaryData.map((item, index) => (
//                     <CountCard key={index} {...item} />
//                 ))}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 2. Barras de Progreso (Detalle de Stock Clave) */}
//             <h3 className="text-xl font-bold text-gray-700 mb-4">Stock Crítico (Top 3)</h3>
//             <div className="space-y-4">
//                  {/* Usamos los datos reales pasados por prop */}
//                 {progressData.map((item, index) => (
//                     <ProgressBarItem key={index} {...item} />
//                 ))}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 3. Totales Financieros */}
//             <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
                
//                 <div className="mb-4 sm:mb-0">
//                     <p className="text-sm text-gray-500 uppercase font-medium">Valor Total del Inventario</p>
//                     <p className="text-3xl font-extrabold text-indigo-700">{totalInventoryValue} €</p>
//                 </div>

//                 <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg shadow-inner">
//                     <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
//                     <div>
//                         <p className="text-sm font-semibold text-blue-600">Valor en Categoría Fitosanitarios</p>
//                         <p className="text-2xl font-extrabold text-blue-800">{categoryStockValue} €</p>
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default InventorySummaryCard;





// import React from 'react';
// import { FaSprayCan, FaSeedling, FaBox, FaLeaf } from 'react-icons/fa6'; // Iconos
// import { motion } from 'framer-motion';

// // --- Subcomponentes de la Tarjeta ---

// // Iconos y colores
// const categoryIconMap = {
//     'Fitosanitarios': { Icon: FaSprayCan, colorClass: 'text-green-600', hoverBg: 'hover:bg-green-50', focusBorder: 'border-green-500' },
//     'Fertilizantes': { Icon: FaSeedling, colorClass: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', focusBorder: 'border-yellow-500' },
//     'Trampas': { Icon: FaBox, colorClass: 'text-red-500', hoverBg: 'hover:bg-red-50', focusBorder: 'border-red-500' },
//     'Otros': { Icon: FaLeaf, colorClass: 'text-indigo-500', hoverBg: 'hover:bg-indigo-50', focusBorder: 'border-indigo-500' },
// };

// // Componente de Tarjeta de Conteo (Botón)
// const CountCard = ({ title, count, onClick, isSelected }) => {
//     const { Icon, colorClass, hoverBg, focusBorder } = categoryIconMap[title] || { 
//         Icon: FaBox, 
//         colorClass: 'text-gray-500', 
//         hoverBg: 'hover:bg-gray-50', 
//         focusBorder: 'border-gray-500' 
//     };

//     // Clases condicionales para el estado de "Seleccionado"
//     const selectedClass = isSelected 
//         ? `ring-4 ring-offset-2 ${colorClass.replace('text-', 'ring-')} ${focusBorder}` 
//         : `border-gray-200 ${hoverBg}`;

//     return (
//         <motion.button 
//             onClick={() => onClick(title)}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`bg-white p-4 rounded-xl shadow-lg flex items-center justify-between transition duration-300 w-full text-left 
//             border-b-4 ${selectedClass} focus:outline-none`}
//         >
//             <div className="flex flex-col">
//                 <p className="text-sm font-medium text-gray-500">{title}</p>
//                 <p className={`text-2xl font-bold ${colorClass}`}>
//                     {count}
//                 </p>
//             </div>
//             <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')} transition duration-300`}>
//                 <Icon className={`${colorClass} w-6 h-6`} />
//             </div>
//         </motion.button>
//     );
// };

// // Componente para la barra de progreso
// const ProgressBarItem = ({ name, stockPercentage, weight, totalValue }) => {
//     const progress = Math.min(100, Math.max(0, stockPercentage));
//     return (
//         <div className="text-sm">
//             <div className="flex justify-between mb-1 font-semibold text-gray-700">
//                 <span>{name}</span>
//                 <span>{weight}</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                     className="h-2.5 rounded-full bg-green-500 transition-all duration-700" 
//                     style={{ width: `${progress}%` }}
//                 ></div>
//             </div>
//             <p className="text-xs text-right text-gray-500 mt-1">Valor: {totalValue} €</p>
//         </div>
//     );
// };


// // --- Componente Principal InventorySummaryCard CORREGIDO ---

// const InventorySummaryCard = ({ products, onCategorySelect, selectedCategory }) => {

//     // 💡 TOMA LA CATEGORÍA SELECCIONADA O 'Fitosanitarios' COMO VALOR POR DEFECTO
//     const activeCategory = selectedCategory || 'Fitosanitarios';

//     // =======================================================
//     // 📌 CÁLCULO DE RESUMEN POR CATEGORÍA
//     // =======================================================
//     const calculateInventorySummary = (productList, currentCategory) => {
//         let totalInventoryValue = 0;
//         const categoryCounts = {};
//         const criticalStockProgress = [];

//         productList.forEach(product => {
//             const stock = (product.entradas || 0) - (product.salidas || 0); 
//             const productValue = stock * (product.price || 1); 
//             totalInventoryValue += productValue;

//             // 1. Conteo de Categorías
//             const category = product.category || 'Otros';
//             categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            
//             // 2. Stock Crítico
//             // Filtramos solo productos de la CATEGORÍA SELECCIONADA para el progreso inferior
//             // 🚨 Asegúrate de que el stock sea mayor a cero
//             if (category === currentCategory && stock > 0) {
//                 // Si la lista tiene menos de 3, lo añadimos
//                 if (criticalStockProgress.length < 3) {
//                     criticalStockProgress.push({
//                         name: product.name,
//                         weight: `${stock} Unds.`,
//                         totalValue: productValue.toFixed(2),
//                         stockPercentage: (stock / 50) * 100 // Usamos 50 como stock 'ideal'
//                     });
//                 }
//             }
//         });

//         // Aseguramos que todas las categorías principales estén en el resumen
//         const categoryTitles = ['Fitosanitarios', 'Fertilizantes', 'Trampas', 'Otros'];
//         const summaryData = categoryTitles.map(title => ({ 
//             title, 
//             count: categoryCounts[title] || 0 
//         }));
        
//         // Valor de la CATEGORÍA SELECCIONADA
//         const categoryStockValue = productList
//             .filter(p => (p.category || 'Otros') === currentCategory) // FILTRA por la categoría activa
//             .reduce((sum, p) => sum + ((p.entradas || 0) - (p.salidas || 0)) * (p.price || 1), 0)
//             .toFixed(2);
        
//         return {
//             summaryData,
//             criticalStockProgress,
//             totalInventoryValue: totalInventoryValue.toFixed(2),
//             categoryStockValue,
//         };
//     };
    
//     // Recalcula el resumen CADA VEZ que cambia la categoría seleccionada
//     const summary = React.useMemo(() => calculateInventorySummary(products, activeCategory), [products, activeCategory]);

//     // ---------------------------------------------------------------------
//     // --- Renderizado de la Tarjeta Dinámica ---
//     // ---------------------------------------------------------------------
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100"
//         >
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
//                 Resumen de Inventario 📊
//             </h2>

//             {/* 1. Resumen de Conteo (Botones interactivos) */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {summary.summaryData.map((item, index) => (
//                     <CountCard 
//                         key={index} 
//                         {...item} 
//                         // Pasa la función del componente padre
//                         onClick={onCategorySelect} 
//                         // Marca si está seleccionado
//                         isSelected={item.title === activeCategory}
//                     />
//                 ))}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 2. Barras de Progreso (Detalle de Stock Clave) */}
//             <h3 className="text-xl font-bold text-gray-700 mb-4">Stock de Muestra en **{activeCategory}**</h3>
//             <div className="space-y-4">
//                 {summary.criticalStockProgress.map((item, index) => (
//                     <ProgressBarItem key={index} {...item} />
//                 ))}
//                 {summary.criticalStockProgress.length === 0 && (
//                     <p className="text-gray-500 text-sm italic">
//                         No hay productos en **{activeCategory}** con stock mayor a cero.
//                     </p>
//                 )}
//             </div>

//             {/* Separador */}
//             <hr className="my-6 border-gray-200" />

//             {/* 3. Totales Financieros */}
//             <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
                
//                 <div className="mb-4 sm:mb-0">
//                     <p className="text-sm text-gray-500 uppercase font-medium">Valor Total del Inventario</p>
//                     <p className="text-3xl font-extrabold text-indigo-700">{summary.totalInventoryValue} €</p>
//                 </div>

//                 <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg shadow-inner">
//                     <span className={`inline-block w-3 h-3 ${categoryIconMap[activeCategory]?.colorClass.replace('text-', 'bg-') || 'bg-gray-500'} rounded-full`}></span>
//                     <div>
//                         <p className="text-sm font-semibold text-blue-600">Valor Total en **{activeCategory}**</p>
//                         <p className="text-2xl font-extrabold text-blue-800">{summary.categoryStockValue} €</p>
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default InventorySummaryCard;


import React from 'react';
import { FaSprayCan, FaSeedling, FaBox, FaLeaf } from 'react-icons/fa6'; // Iconos
import { motion } from 'framer-motion';

// --- Subcomponentes de la Tarjeta ---

// Iconos y colores
const categoryIconMap = {
    'Fitosanitarios': { Icon: FaSprayCan, colorClass: 'text-green-600', hoverBg: 'hover:bg-green-50', focusBorder: 'border-green-500' },
    'Fertilizantes': { Icon: FaSeedling, colorClass: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', focusBorder: 'border-yellow-500' },
    'Trampas': { Icon: FaBox, colorClass: 'text-red-500', hoverBg: 'hover:bg-red-50', focusBorder: 'border-red-500' },
    'Otros': { Icon: FaLeaf, colorClass: 'text-indigo-500', hoverBg: 'hover:bg-indigo-50', focusBorder: 'border-indigo-500' },
};

// Componente de Tarjeta de Conteo (Botón)
const CountCard = ({ title, count, onClick, isSelected }) => {
    const { Icon, colorClass, hoverBg, focusBorder } = categoryIconMap[title] || { 
        Icon: FaBox, 
        colorClass: 'text-gray-500', 
        hoverBg: 'hover:bg-gray-50', 
        focusBorder: 'border-gray-500' 
    };

    const selectedClass = isSelected 
        ? `ring-4 ring-offset-2 ${colorClass.replace('text-', 'ring-')} ${focusBorder}` 
        : `border-gray-200 ${hoverBg}`;

    return (
        <motion.button 
            onClick={() => onClick(title)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white p-4 rounded-xl shadow-lg flex items-center justify-between transition duration-300 w-full text-left 
            border-b-4 ${selectedClass} focus:outline-none`}
        >
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className={`text-2xl font-bold ${colorClass}`}>
                    {count}
                </p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')} transition duration-300`}>
                <Icon className={`${colorClass} w-6 h-6`} />
            </div>
        </motion.button>
    );
};

// Componente para la barra de progreso
const ProgressBarItem = ({ name, stockPercentage, weight, totalValue }) => {
    const progress = Math.min(100, Math.max(0, stockPercentage));
    return (
        <div className="text-sm">
            <div className="flex justify-between mb-1 font-semibold text-gray-700">
                <span>{name}</span>
                <span>{weight}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="h-2.5 rounded-full bg-green-500 transition-all duration-700" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-right text-gray-500 mt-1">Valor: {totalValue} €</p>
        </div>
    );
};


// --- Componente Principal InventorySummaryCard ---

const InventorySummaryCard = ({ products, onCategorySelect, selectedCategory }) => {

    // 💡 Usa 'Fitosanitarios' como categoría activa por defecto.
    const activeCategory = selectedCategory || 'Fitosanitarios';

    // =======================================================
    // 📌 CÁLCULO DE RESUMEN POR CATEGORÍA
    // =======================================================
    const calculateInventorySummary = (productList, currentCategory) => {
        // 🚨 CORRECCIÓN CLAVE: Aseguramos que productList sea un array. 
        // Si es null o undefined, usamos un array vacío ([]).
        const safeProductList = productList || [];
        
        let totalInventoryValue = 0;
        const categoryCounts = {};
        const criticalStockProgress = [];

        // Usamos safeProductList para evitar el error 'forEach'
        safeProductList.forEach(product => {
            const stock = (product.entradas || 0) - (product.salidas || 0); 
            const productValue = stock * (product.price || 1); 
            totalInventoryValue += productValue;

            // 1. Conteo de Categorías
            const category = product.category || 'Otros';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            
            // 2. Stock Crítico (Top 3 de la Categoría Activa)
            if (category === currentCategory && stock > 0) {
                if (criticalStockProgress.length < 3) {
                    criticalStockProgress.push({
                        name: product.name,
                        weight: `${stock} Unds.`,
                        totalValue: productValue.toFixed(2),
                        stockPercentage: (stock / 50) * 100 
                    });
                }
            }
        });

        // Aseguramos que todas las categorías principales estén en el resumen
        const categoryTitles = ['Fitosanitarios', 'Fertilizantes', 'Trampas', 'Otros'];
        const summaryData = categoryTitles.map(title => ({ 
            title, 
            count: categoryCounts[title] || 0 
        }));
        
        // Valor de la CATEGORÍA SELECCIONADA
        const categoryStockValue = safeProductList
            .filter(p => (p.category || 'Otros') === currentCategory) // FILTRA por la categoría activa
            .reduce((sum, p) => sum + ((p.entradas || 0) - (p.salidas || 0)) * (p.price || 1), 0)
            .toFixed(2);
        
        return {
            summaryData,
            criticalStockProgress,
            totalInventoryValue: totalInventoryValue.toFixed(2),
            categoryStockValue,
        };
    };
    
    // Recalcula el resumen
    const summary = React.useMemo(() => calculateInventorySummary(products, activeCategory), [products, activeCategory]);

    // ---------------------------------------------------------------------
    // --- Renderizado de la Tarjeta Dinámica ---
    // ---------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100"
        >
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
                Resumen de Inventario 📊
            </h2>

            {/* 1. Resumen de Conteo (Botones interactivos) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {summary.summaryData.map((item, index) => (
                    <CountCard 
                        key={index} 
                        {...item} 
                        onClick={onCategorySelect} 
                        isSelected={item.title === activeCategory}
                    />
                ))}
            </div>

            {/* Separador */}
            <hr className="my-6 border-gray-200" />

            {/* 2. Barras de Progreso (Detalle de Stock Clave) */}
            <h3 className="text-xl font-bold text-gray-700 mb-4">Stock de Muestra en {activeCategory}</h3>
            <div className="space-y-4">
                {summary.criticalStockProgress.map((item, index) => (
                    <ProgressBarItem key={index} {...item} />
                ))}
                {summary.criticalStockProgress.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                        No hay productos en {activeCategory} con stock mayor a cero.
                    </p>
                )}
            </div>

            {/* Separador */}
            <hr className="my-6 border-gray-200" />

            {/* 3. Totales Financieros */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
                
                <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-500 uppercase font-medium">Valor Total del Inventario</p>
                    <p className="text-3xl font-extrabold text-indigo-700">{summary.totalInventoryValue} €</p>
                </div>

                <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg shadow-inner">
                    <span className={`inline-block w-3 h-3 ${categoryIconMap[activeCategory]?.colorClass.replace('text-', 'bg-') || 'bg-gray-500'} rounded-full`}></span>
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Valor Total en {activeCategory}</p>
                        <p className="text-2xl font-extrabold text-blue-800">{summary.categoryStockValue} €</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InventorySummaryCard;