import React from 'react';
import { FaSprayCan, FaSeedling, FaBox, FaLeaf, FaTriangleExclamation, FaUpRightAndDownLeftFromCenter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

// =======================================================
// --- Subcomponentes de la Tarjeta ---
// =======================================================

// Iconos y colores
const categoryIconMap = {
    'Fitosanitarios': { Icon: FaSprayCan, colorClass: 'text-green-600', hoverBg: 'hover:bg-green-50', focusBorder: 'border-green-500' },
    'Fertilizantes': { Icon: FaSeedling, colorClass: 'text-yellow-600', hoverBg: 'hover:bg-yellow-50', focusBorder: 'border-yellow-500' },
    'Trampas': { Icon: FaBox, colorClass: 'text-red-500', hoverBg: 'hover:bg-red-50', focusBorder: 'border-red-500' },
    'Otros': { Icon: FaLeaf, colorClass: 'text-indigo-500', hoverBg: 'hover:bg-indigo-50', focusBorder: 'border-indigo-500' },
};

// Componente de Tarjeta de Conteo (sin cambios funcionales)
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

// Componente para la barra de progreso - AHORA MANEJA STOCK 0
const StockItem = ({ name, stock, totalValue }) => {
    // Si stock es 0 o negativo, es stock crítico
    const isCritical = stock <= 0;
    // La barra de progreso solo se muestra para stock positivo, sino es 0
    const progress = Math.min(100, Math.max(0, (stock / 50) * 100)); // Stock máximo de referencia 50

    const containerClasses = isCritical 
        ? 'bg-red-50 border-l-4 border-red-500 p-3 rounded-lg shadow-sm animate-pulse' // Alarma visual
        : 'p-3 rounded-lg'; // Normal

    return (
        <div className={containerClasses}>
            <div className="text-sm">
                <div className="flex justify-between mb-1 font-semibold text-gray-700">
                    <span className="flex items-center">
                        {isCritical && <FaTriangleExclamation className="text-red-500 w-4 h-4 mr-2" />}
                        {name}
                    </span>
                    <span className={isCritical ? 'text-red-600 font-extrabold' : 'text-gray-700'}>
                        {isCritical ? '¡AGOTADO!' : `${stock} Unds.`}
                    </span>
                </div>
                
                {/* Solo mostramos la barra de progreso si el stock es positivo */}
                {!isCritical && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="h-2.5 rounded-full bg-green-500 transition-all duration-700" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
            <p className="text-xs text-right text-gray-500 mt-1">Valor: {totalValue} €</p>
        </div>
    );
};


// =======================================================
// --- Componente Principal InventorySummaryCard ---
// =======================================================

const InventorySummaryCard = ({ products, onCategorySelect, selectedCategory }) => {

    const activeCategory = selectedCategory || 'Fitosanitarios';

    // 📌 CÁLCULO DE RESUMEN POR CATEGORÍA
    const calculateInventorySummary = (productList, currentCategory) => {
        const safeProductList = productList || [];
        
        let totalInventoryValue = 0;
        const categoryCounts = {};
        const stockItems = []; // Nuevo nombre

        safeProductList.forEach(product => {
            const stock = (product.entradas || 0) - (product.salidas || 0); 
            const productValue = stock * (product.price || 1); 
            totalInventoryValue += productValue;

            // 1. Conteo de Categorías
            const category = product.category || 'Otros';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            
            // 2. Stock Crítico y de Muestra
            // Filtramos solo productos de la CATEGORÍA SELECCIONADA.
            // A diferencia de antes, AHORA INCLUIMOS productos con stock <= 0
            if (category === currentCategory) {
                stockItems.push({
                    name: product.name,
                    stock: stock,
                    totalValue: productValue.toFixed(2),
                    // No necesitamos stockPercentage aquí, la lógica de la barra va en StockItem
                });
            }
        });

        // Aseguramos categorías principales
        const categoryTitles = ['Fitosanitarios', 'Fertilizantes', 'Trampas', 'Otros'];
        const summaryData = categoryTitles.map(title => ({ 
            title, 
            count: categoryCounts[title] || 0 
        }));
        
        // Valor de la CATEGORÍA SELECCIONADA
        const categoryStockValue = safeProductList
            .filter(p => (p.category || 'Otros') === currentCategory) 
            .reduce((sum, p) => sum + ((p.entradas || 0) - (p.salidas || 0)) * (p.price || 1), 0)
            .toFixed(2);
        
        // 3. Ordenamos: Primero Stock Crítico (<=0), luego Stock Positivo
        stockItems.sort((a, b) => a.stock - b.stock);

        return {
            summaryData,
            stockItems, // Lista de productos (críticos y positivos)
            totalInventoryValue: totalInventoryValue.toFixed(2),
            categoryStockValue,
        };
    };
    
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

            {/* 2. Lista de Productos con Scroll y Alerta */}
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center justify-between">
                <span>Stock de Muestra en {activeCategory}</span>
                <FaUpRightAndDownLeftFromCenter className="text-gray-400 w-4 h-4" title="Scroll disponible si hay más productos" />
            </h3>
            
            {/* 💡 IMPLEMENTACIÓN DEL SCROLL */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2"> {/* max-h-48 ~ 3 items */}
                {summary.stockItems.map((item, index) => (
                    <StockItem key={index} {...item} />
                ))}
                
                {/* Mensaje si la lista está vacía */}
                {summary.stockItems.length === 0 && (
                    <p className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-lg">
                        No hay productos registrados en la categoría {activeCategory}.
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