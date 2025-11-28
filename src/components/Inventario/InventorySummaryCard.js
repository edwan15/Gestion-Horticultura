import React, { useState, useMemo } from 'react';
import { FaSprayCan, FaSeedling, FaBox, FaLeaf, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Mapeo de categorías a iconos y colores (matching Wisecrop)
const categoryConfig = {
    'Fitosanitarios': { 
        Icon: FaSprayCan, 
        colorClass: 'text-green-600', 
        bgClass: 'bg-green-50',
        borderClass: 'border-green-500',
        progressClass: 'bg-gradient-to-r from-green-400 to-green-600'
    },
    'Fertilizantes': { 
        Icon: FaSeedling, 
        colorClass: 'text-yellow-600', 
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-500',
        progressClass: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    },
    'Trampas': { 
        Icon: FaBox, 
        colorClass: 'text-red-500', 
        bgClass: 'bg-red-50',
        borderClass: 'border-red-500',
        progressClass: 'bg-gradient-to-r from-red-400 to-red-600'
    },
    'Plantas': { 
        Icon: FaLeaf, 
        colorClass: 'text-purple-500', 
        bgClass: 'bg-purple-50',
        borderClass: 'border-purple-500',
        progressClass: 'bg-gradient-to-r from-purple-400 to-purple-600'
    },
    'Otros': { 
        Icon: FaBox, 
        colorClass: 'text-gray-500', 
        bgClass: 'bg-gray-50',
        borderClass: 'border-gray-500',
        progressClass: 'bg-gradient-to-r from-gray-400 to-gray-600'
    },
};

// Componente de Tab de Categoría (matching Wisecrop design)
const CategoryTab = ({ title, count, isSelected, onClick }) => {
    const config = categoryConfig[title] || categoryConfig['Otros'];
    const { Icon, colorClass, bgClass, borderClass } = config;

    return (
        <button
            onClick={() => onClick(title)}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isSelected 
                    ? `${bgClass} ${borderClass} border-b-2 font-semibold` 
                    : 'bg-white hover:bg-gray-50 border-b-2 border-transparent'
                }
            `}
        >
            <Icon className={`${colorClass} text-lg`} />
            <span className={`text-sm ${isSelected ? colorClass : 'text-gray-600'}`}>
                {title}
            </span>
            <span className={`
                ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                ${isSelected ? `${colorClass} ${bgClass}` : 'bg-gray-100 text-gray-600'}
            `}>
                {count}
            </span>
        </button>
    );
};

// Componente de Producto Individual con Barra de Progreso
const ProductItem = ({ product, categoryColor }) => {
    const stock = (product.entradas || 0) - (product.salidas || 0);
    const productValue = stock * (product.price || 1);
    const stockPercentage = Math.min(100, Math.max(0, (stock / 50) * 100));
    const config = categoryConfig[product.category] || categoryConfig['Otros'];

    return (
        <div className="py-3 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{stock} Unds.</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{productValue.toFixed(2)} €</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full ${config.progressClass} transition-all duration-700`}
                    style={{ width: `${stockPercentage}%` }}
                />
            </div>
        </div>
    );
};

// Componente Principal - InventorySummaryCard (Wisecrop Style)
const InventorySummaryCard = ({ products = [], onCategorySelect, selectedCategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const activeCategory = selectedCategory || 'Fitosanitarios';

    // Cálculos de inventario
    const inventoryData = useMemo(() => {
        const safeProducts = products || [];
        let totalValue = 0;
        const categoryCounts = {
            'Fitosanitarios': 0,
            'Fertilizantes': 0,
            'Trampas': 0,
            'Plantas': 0,
            'Otros': 0
        };

        // Contar productos por categoría y calcular valor total
        safeProducts.forEach(product => {
            const category = product.category || 'Otros';
            const stock = (product.entradas || 0) - (product.salidas || 0);
            const value = stock * (product.price || 1);
            
            totalValue += value;
            if (categoryCounts.hasOwnProperty(category)) {
                categoryCounts[category]++;
            } else {
                categoryCounts['Otros']++;
            }
        });

        // Filtrar productos de la categoría activa con stock > 0
        const categoryProducts = safeProducts
            .filter(p => (p.category || 'Otros') === activeCategory)
            .filter(p => ((p.entradas || 0) - (p.salidas || 0)) > 0)
            .sort((a, b) => {
                const stockA = (a.entradas || 0) - (a.salidas || 0);
                const stockB = (b.entradas || 0) - (b.salidas || 0);
                return stockB - stockA; // Ordenar por stock descendente
            });

        // Calcular valor de la categoría activa
        const categoryValue = categoryProducts.reduce((sum, p) => {
            const stock = (p.entradas || 0) - (p.salidas || 0);
            return sum + (stock * (p.price || 1));
        }, 0);

        // Calcular promedio de stock
        const avgStock = categoryProducts.length > 0
            ? categoryProducts.reduce((sum, p) => sum + ((p.entradas || 0) - (p.salidas || 0)), 0) / categoryProducts.length
            : 0;

        return {
            totalValue: totalValue.toFixed(2),
            categoryCounts,
            categoryProducts,
            categoryValue: categoryValue.toFixed(2),
            avgStock: avgStock.toFixed(0),
            totalProducts: categoryProducts.length
        };
    }, [products, activeCategory]);

    // Determinar cuántos productos mostrar
    const displayedProducts = isExpanded 
        ? inventoryData.categoryProducts 
        : inventoryData.categoryProducts.slice(0, 3);

    const hasMoreProducts = inventoryData.categoryProducts.length > 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
        >
            {/* Header con título */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {/* Añade un título descriptivo aquí. 
                       Por ejemplo, podrías usar la categoría activa. 
                       Aquí estaba el principal error de JSX.
                    */}
                    Resumen de Inventario - {activeCategory}
                </h3>
            </div>
            
            {/* Tabs de Categoría */}
            <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-100 bg-white">
                {Object.keys(categoryConfig).map(category => (
                    <CategoryTab
                        key={category}
                        title={category}
                        count={inventoryData.categoryCounts[category]}
                        isSelected={category === activeCategory}
                        onClick={onCategorySelect}
                    />
                ))}
            </div>

            {/* Contenido/Lista de Productos (Movido aquí) */}
            <div className="px-6 pt-4 pb-2">
                <AnimatePresence initial={false}>
                    {displayedProducts.length > 0 ? (
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-1"
                        >
                            {displayedProducts.map((product, index) => (
                                <ProductItem 
                                    key={product._id || index} 
                                    product={product}
                                    categoryColor={categoryConfig[activeCategory]?.colorClass}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 italic text-sm">
                            No hay productos en {activeCategory} con stock disponible
                        </div>
                    )}
                </AnimatePresence>

                {/* Botón "Mostrar más" / "Mostrar menos" */}
                {hasMoreProducts && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
                    >
                        {isExpanded ? (
                            <>
                                Mostrar menos <FaChevronUp className="text-xs" />
                            </>
                        ) : (
                            <>
                                Mostrar más <FaChevronDown className="text-xs" />
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Footer con Totales (matching Wisecrop) */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    {/* Promedio en Stock */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Promedio en stock</p>
                        <p className="text-xl font-bold text-gray-800">{inventoryData.avgStock}</p>
                    </div>
                    
                    {/* Total Valor de Categoría */}
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Valor de {activeCategory}</p>
                        <p className="text-xl font-bold text-gray-800">
                            {inventoryData.categoryValue} <span className="text-sm text-gray-600">€</span>
                        </p>
                    </div>
                </div>
                {/* Total Global */}
                <div className="mt-4 pt-4 border-t border-gray-300 text-right">
                    <p className="text-sm text-gray-600 mb-1">Valor Total de Inventario</p>
                    <p className="text-2xl font-extrabold text-gray-900">
                        {inventoryData.totalValue} <span className="text-base text-gray-700">€</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default InventorySummaryCard;