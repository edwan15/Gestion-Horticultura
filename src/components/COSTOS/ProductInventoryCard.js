import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaSprayCan, FaLeaf, FaSeedling, FaBoxOpen, FaBug, FaTree, 
    FaChevronRight, FaEllipsisV, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { getProducts } from '../../features/product/ProductSlice';
// Nota: selectAuthUser no se exporta en authSlice, pero ProductList lo usa así:
const selectAuthUser = (state) => state.auth.user; 

const TabButton = ({ id, label, icon: Icon, count, isActive, onClick, color = "emerald" }) => (
    <button
        onClick={() => onClick(id)}
        className={`relative min-w-[25%] snap-start py-3 px-2 flex flex-col items-center justify-between gap-2 transition-all duration-300 group
            ${isActive ? 'bg-white' : 'bg-white hover:bg-gray-50'}
        `}
    >
        {isActive && (
            <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500 rounded-b shadow-sm`} />
        )}
        
        <span className={`text-[10px] font-bold uppercase tracking-wide truncate max-w-full
            ${isActive ? `text-${color}-600` : 'text-gray-400 group-hover:text-gray-600'}
        `}>
            {label}
        </span>

        <div className="flex items-center gap-2 mt-1">
             <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? `bg-${color}-50 text-${color}-600` : 'text-gray-300 group-hover:text-gray-500'}`}>
                <Icon className={`text-xl ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
            </div>
            <span className={`text-xl font-bold tracking-tight leading-none ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
                {count}
            </span>
        </div>
    </button>
);

const ListItem = ({ title, subtitle, value, percentage, type = 'default' }) => {
    const percentageValue = percentage ? parseFloat(percentage) : 0;
    
    // Determine bar color and icon style based on type (lowercase comparison for safety)
    let barColor = 'bg-emerald-500';
    let iconBg = 'bg-emerald-100 text-emerald-600';
    let Icon = FaBoxOpen; // Default

    switch(type.toLowerCase()) {
        case 'fitosanitarios': barColor = 'bg-red-500'; iconBg = 'bg-red-100 text-red-600'; Icon = FaSprayCan; break;
        case 'fertilizantes': barColor = 'bg-amber-500'; iconBg = 'bg-amber-100 text-amber-600'; Icon = FaLeaf; break;
        case 'trampas': barColor = 'bg-stone-500'; iconBg = 'bg-stone-100 text-stone-600'; Icon = FaBug; break;
        case 'plantas': barColor = 'bg-green-500'; iconBg = 'bg-green-100 text-green-600'; Icon = FaTree; break;
        case 'semillas': barColor = 'bg-lime-500'; iconBg = 'bg-lime-100 text-lime-600'; Icon = FaSeedling; break;
        case 'otros': barColor = 'bg-gray-500'; iconBg = 'bg-gray-100 text-gray-600'; Icon = FaBoxOpen; break;
        default: break;
    }

    return (
        <div className="group relative p-2 hover:bg-gray-50 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-sm mb-1 cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${iconBg}`}>
                        <Icon className="text-xs" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 text-xs truncate max-w-[120px]">{title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight">{subtitle}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-gray-900 text-xs flex items-center justify-end gap-1">
                        {value} <span className="text-[10px] text-gray-400 font-normal">€</span>
                    </div>
                    {percentage && (
                        <div className="text-[10px] font-medium text-emerald-500 flex items-center justify-end gap-0.5">
                            {percentage > 50 ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px] text-red-500" />}
                            <span className={percentage > 50 ? "" : "text-red-500"}>{percentage}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full mt-1">
                 <div 
                    className={`h-full ${barColor} rounded-r-full opacity-80 transition-all duration-1000 ease-out`}
                    style={{ width: `${percentageValue}%` }}
                />
            </div>
        </div>
    );
};

const ProductInventoryCard = () => {
    const [activeTab, setActiveTab] = useState('fitosanitarios'); // Lowercase default
    const [visibleItems, setVisibleItems] = useState(5); // Estado para controlar items visibles
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Resetear items visibles al cambiar de tab
    useEffect(() => {
        setVisibleItems(5);
    }, [activeTab]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filterView, setFilterView] = useState('default'); // 'default', 'critical', 'strategic'
    const menuRef = React.useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 1. Obtener datos de Redux
    const user = useSelector(selectAuthUser);
    const products = useSelector((state) => state.product.products);
    const userRole = user?.role?.toLowerCase() || "invitado";
    const userId = user?.uid;

    // 2. Fetch de datos al montar (similar a ProductList)
    useEffect(() => {
        const fetchMode = userRole === "admin" || userRole === "invitado" ? "all" : "own";
        if (products.length === 0 || (fetchMode === "own" && userId)) {
             if (fetchMode === "all" || (fetchMode === "own" && userId)) {
                dispatch(getProducts({ 
                    mode: fetchMode, 
                    userId: fetchMode === "own" ? userId : undefined 
                }));
            }
        }
    }, [dispatch, userRole, userId, products.length]);

    // 3. Lógica de Filtrado y Agrupación (Memoizada)
    const inventoryData = useMemo(() => {
        const data = {
            fitosanitarios: [],
            fertilizantes: [],
            trampas: [],
            plantas: [],
            semillas: [],
            otros: []
        };
        let totalVal = 0;

        products.forEach(product => {
            // Normalización: Si category es null/undefined, usar 'otros'
            const rawCat = product.category ? product.category.toLowerCase().trim() : 'otros';
            let key = 'otros';
            if (rawCat === 'fitosanitarios') key = 'fitosanitarios';
            else if (rawCat === 'fertilizantes') key = 'fertilizantes';
            else if (rawCat === 'trampas') key = 'trampas';
            else if (rawCat === 'plantas') key = 'plantas';
            else if (rawCat === 'semillas') key = 'semillas';
            
            const stock = (parseFloat(product.entradas) || 0) - (parseFloat(product.salidas) || 0);
            const value = stock * (parseFloat(product.price) || 0);

            // LOGICA DE FILTRO GLOBAL (Pre-clasificación)
            // Si es 'critical' (Agotados), queremos ver stock <= 0
            // Si es 'default' o 'strategic', queremos ver stock > 0
            
            if (filterView === 'critical') {
                 if (stock <= 0) {
                    data[key].push({ ...product, stock, value });
                 }
            } else {
                // Default & Strategic muestran items con stock
                if (stock > 0) {
                    totalVal += value;
                    data[key].push({ ...product, stock, value });
                }
            }
        });

        return { data, totalVal };
    }, [products, filterView]);

    // 4. Renderizado del contenido del Tab activo
    const renderContent = () => {
        const items = inventoryData.data[activeTab] || [];
        
        if (items.length === 0) {
             let emptyMessage = `Sin stock en ${activeTab}`;
             if (filterView === 'critical') emptyMessage = `No hay productos agotados en ${activeTab}`;
             
             return (
                <div className="flex bg-white flex-col items-center justify-center h-40 text-gray-400">
                    <FaBoxOpen className="text-3xl mb-2 opacity-50"/>
                    <p className="text-xs">{emptyMessage}</p>
                </div>
            );
        }

        // Ordenamiento según vista
        let sortedItems = [...items];
        
        if (filterView === 'strategic') {
            // Insumos Estratégicos: Orden estricto por Valor
            sortedItems = sortedItems.sort((a, b) => b.value - a.value);
        } else if (filterView === 'critical') {
             // Agotados: Orden alfabético
             sortedItems = sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Default: Orden por valor también (es buen default), pero quizás mezclado con reciente?
            // Mantengamos valor por ahora
            sortedItems = sortedItems.sort((a, b) => b.value - a.value);
        }

        const displayedItems = sortedItems.slice(0, visibleItems);

        return (
            <div className="animate-fadeIn space-y-1">
                {displayedItems.map((item, idx) => (
                    <ListItem 
                        key={item._id || idx}
                        title={item.name} 
                        subtitle={filterView === 'critical' ? 'Agotado' : `Stock: ${item.stock}`} 
                        value={item.value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                        percentage={filterView === 'critical' ? "0" : "100"} 
                        type={activeTab} 
                    />
                ))}
            </div>
        );
    };

    const tabsRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - tabsRef.current.offsetLeft);
        setScrollLeft(tabsRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - tabsRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        tabsRef.current.scrollLeft = scrollLeft - walk;
    };

    const hasMoreItems = (inventoryData.data[activeTab]?.length || 0) > visibleItems;

    return (
        <div 
            className="bg-white rounded-none shadow-xl border border-gray-200 overflow-visible flex flex-col h-full font-sans hover:shadow-2xl transition-all duration-300 relative"
        >
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white relative z-20">
                <div 
                    onClick={() => navigate('/inventario-costes')}
                    className="cursor-pointer group"
                >
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        Inventario de Productos <FaChevronRight className="text-[10px] text-emerald-500 group-hover:text-emerald-600" />
                    </h2>
                    <span className="text-[10px] text-gray-500 font-medium">
                        {filterView === 'default' && "Vista General"}
                        {filterView === 'critical' && <span className="text-red-500 font-bold">Análisis de Agotados</span>}
                        {filterView === 'strategic' && <span className="text-amber-600 font-bold">Insumos Estratégicos</span>}
                    </span>
                </div>
                
                {/* Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-full transition-colors ${isMenuOpen ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaEllipsisV className="text-xs" />
                    </button>
                    
                    {isMenuOpen && (
                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn origin-top-right">
                            <div className="py-1">
                                <button 
                                    onClick={() => { setFilterView('default'); setIsMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 flex items-center gap-2 ${filterView === 'default' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${filterView === 'default' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                    Vista Estándar
                                </button>
                                <button 
                                    onClick={() => { setFilterView('strategic'); setIsMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 flex items-center gap-2 ${filterView === 'strategic' ? 'text-amber-600 bg-amber-50' : 'text-gray-700'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${filterView === 'strategic' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                                    Insumos Estratégicos
                                </button>
                                <div className="h-px bg-gray-100 my-1"/>
                                <button 
                                    onClick={() => { setFilterView('critical'); setIsMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 flex items-center gap-2 ${filterView === 'critical' ? 'text-red-600 bg-red-50' : 'text-gray-700'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${filterView === 'critical' ? 'bg-red-500' : 'bg-gray-300'}`} />
                                    Análisis de Agotados
                                </button>
                            </div>
                         </div>
                    )}
                </div>
            </div>

            {/* Tabs - Scrollable */}
            <div 
                ref={tabsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex border-b border-gray-100 bg-white overflow-x-auto no-scrollbar scroll-smooth snap-x mandatory cursor-grab active:cursor-grabbing relative z-10"
            >
                <TabButton id="fitosanitarios" label="Fitosanitarios" icon={FaSprayCan} count={inventoryData.data.fitosanitarios.length} isActive={activeTab === 'fitosanitarios'} onClick={setActiveTab} color="red" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="fertilizantes" label="Fertilizantes" icon={FaLeaf} count={inventoryData.data.fertilizantes.length} isActive={activeTab === 'fertilizantes'} onClick={setActiveTab} color="amber" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="trampas" label="Trampas" icon={FaBug} count={inventoryData.data.trampas.length} isActive={activeTab === 'trampas'} onClick={setActiveTab} color="stone" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="plantas" label="Plantas" icon={FaTree} count={inventoryData.data.plantas.length} isActive={activeTab === 'plantas'} onClick={setActiveTab} color="green" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="semillas" label="Semillas" icon={FaSeedling} count={inventoryData.data.semillas.length} isActive={activeTab === 'semillas'} onClick={setActiveTab} color="lime" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="otros" label="Otros" icon={FaBoxOpen} count={inventoryData.data.otros.length} isActive={activeTab === 'otros'} onClick={setActiveTab} color="gray" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-white relative z-0">
                {renderContent()}
                {hasMoreItems && (
                    <div className="mt-2 flex justify-center">
                        <button 
                            onClick={() => setVisibleItems(prev => prev + 5)}
                            className="text-[10px] font-semibold text-gray-400 hover:text-emerald-600 border border-gray-100 hover:border-emerald-300 px-3 py-1 rounded-full transition-all duration-300"
                        >
                            Ver más productos
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0">Total Valor Inventario</p>
                        <div className="text-lg font-bold text-gray-700 leading-tight">
                            {inventoryData.totalVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-normal text-gray-400">€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInventoryCard;
