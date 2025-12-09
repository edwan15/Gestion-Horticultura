import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaSprayCan, FaLeaf, FaSeedling, FaBoxOpen, FaBug, FaTree, 
    FaChevronRight, FaEllipsisV, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';

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
    
    // Determine bar color and icon style based on type
    let barColor = 'bg-emerald-500';
    let iconBg = 'bg-emerald-100 text-emerald-600';
    let Icon = FaBoxOpen; // Default

    switch(type) {
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
                        <h4 className="font-semibold text-gray-800 text-xs">{title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight">{subtitle}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-gray-900 text-xs flex items-center justify-end gap-1">
                        {value} <span className="text-[10px] text-gray-400 font-normal">kg</span>
                    </div>
                    {percentage && (
                        <div className="text-[10px] font-medium text-emerald-500 flex items-center justify-end gap-0.5">
                            <FaArrowUp className="text-[8px]" />
                            {percentage}
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
    const [activeTab, setActiveTab] = useState('fitosanitarios');
    const navigate = useNavigate();

    // Mock Data rendering
    const renderContent = () => {
        // Just generic items for demo, varying slightly by tab
        const type = activeTab;
        return (
            <div className="animate-fadeIn space-y-1">
                <ListItem title={`Producto A (${type})`} subtitle="Stock actual" value="2.005,00" percentage="45%" type={type} />
                <ListItem title={`Producto B (${type})`} subtitle="Stock reservado" value="547,30" percentage="12%" type={type} />
                <ListItem title={`Producto C (${type})`} subtitle="En tránsito" value="387,51" percentage="8%" type={type} />
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

    return (
        <div 
            className="bg-white rounded-none shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full font-sans hover:shadow-2xl transition-all duration-300"
        >
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
                <div 
                    onClick={() => navigate('/inventario-costes')}
                    className="cursor-pointer group"
                >
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        Inventario de Productos <FaChevronRight className="text-[10px] text-emerald-500 group-hover:text-emerald-600" />
                    </h2>
                    <span className="text-[10px] text-gray-500 font-medium">Ahora</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100">
                    <FaEllipsisV className="text-xs" />
                </button>
            </div>

            {/* Tabs - Scrollable with 4 visible items */}
            <div 
                ref={tabsRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex border-b border-gray-100 bg-white overflow-x-auto no-scrollbar scroll-smooth snap-x mandatory cursor-grab active:cursor-grabbing"
            >
                <TabButton id="fitosanitarios" label="Fitosanitarios" icon={FaSprayCan} count={16} isActive={activeTab === 'fitosanitarios'} onClick={setActiveTab} color="red" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="fertilizantes" label="Fertilizantes" icon={FaLeaf} count={22} isActive={activeTab === 'fertilizantes'} onClick={setActiveTab} color="amber" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="trampas" label="Trampas" icon={FaBug} count={0} isActive={activeTab === 'trampas'} onClick={setActiveTab} color="stone" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="plantas" label="Plantas" icon={FaTree} count={0} isActive={activeTab === 'plantas'} onClick={setActiveTab} color="green" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="semillas" label="Semillas" icon={FaSeedling} count={5} isActive={activeTab === 'semillas'} onClick={setActiveTab} color="lime" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="otros" label="Otros" icon={FaBoxOpen} count={2} isActive={activeTab === 'otros'} onClick={setActiveTab} color="gray" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-white">
                {renderContent()}
                <div className="mt-2 flex justify-center">
                    <button className="text-[10px] font-semibold text-gray-400 hover:text-emerald-600 border border-gray-100 hover:border-emerald-300 px-3 py-1 rounded-full transition-all duration-300">
                        Mostrar más
                    </button>
                </div>
            </div>

            {/* Footer Summary - Clean version */}
            <div className="p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0">Total del inventario</p>
                        <div className="text-lg font-bold text-gray-700 leading-tight">
                            12.219,57 <span className="text-[10px] font-normal text-gray-400">€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInventoryCard;
