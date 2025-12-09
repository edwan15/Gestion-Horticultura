import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaBox, FaUserFriends, FaTractor, FaConciergeBell, FaWarehouse, FaQuestionCircle,
    FaChevronRight, FaEllipsisV, FaArrowUp 
} from 'react-icons/fa';

const TabButton = ({ id, label, icon: Icon, percentage, isActive, onClick, color = "blue" }) => (
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
            <span className={`text-lg font-bold tracking-tight leading-none ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
                {percentage}%
            </span>
        </div>
    </button>
);

const ListItem = ({ title, value, percentage, type = 'default' }) => {
    const percentageValue = percentage ? parseFloat(percentage) : 0;
    
    let barColor = 'bg-blue-500';
    let iconBg = 'bg-blue-100 text-blue-600';
    let Icon = FaBox;

    switch(type) {
        case 'productos': barColor = 'bg-emerald-500'; iconBg = 'bg-emerald-100 text-emerald-600'; Icon = FaBox; break;
        case 'mano_de_obra': barColor = 'bg-orange-500'; iconBg = 'bg-orange-100 text-orange-600'; Icon = FaUserFriends; break;
        case 'equipo': barColor = 'bg-indigo-500'; iconBg = 'bg-indigo-100 text-indigo-600'; Icon = FaTractor; break;
        case 'servicios': barColor = 'bg-cyan-500'; iconBg = 'bg-cyan-100 text-cyan-600'; Icon = FaConciergeBell; break;
        case 'infraestructuras': barColor = 'bg-slate-500'; iconBg = 'bg-slate-100 text-slate-600'; Icon = FaWarehouse; break;
        case 'otros': barColor = 'bg-gray-500'; iconBg = 'bg-gray-100 text-gray-600'; Icon = FaQuestionCircle; break;
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
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-gray-900 text-xs flex items-center justify-end gap-1">
                        {value} <span className="text-[10px] text-gray-400 font-normal">€</span>
                    </div>
                    {percentage && (
                        <div className="text-[10px] font-medium text-blue-500 flex items-center justify-end gap-0.5">
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

const CostDistributionCard = () => {
    const [activeTab, setActiveTab] = useState('productos');
    const navigate = useNavigate();

    const renderContent = () => {
        const type = activeTab;
        return (
            <div className="animate-fadeIn space-y-1">
                <ListItem title={`Categoría A`} value="6.376,27" percentage="52%" type={type} />
                <ListItem title={`Categoría B`} value="5.843,36" percentage="45%" type={type} />
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
        <div className="bg-white rounded-none shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full font-sans">
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
                <div 
                    onClick={() => navigate('/costes')}
                    className="cursor-pointer group"
                >
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        Distribución de Costes <FaChevronRight className="text-[10px] text-emerald-500 group-hover:text-emerald-600" />
                    </h2>
                    <span className="text-[10px] text-gray-500 font-medium">Siempre</span>
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
                <TabButton id="productos" label="Productos" icon={FaBox} percentage={25.6} isActive={activeTab === 'productos'} onClick={setActiveTab} color="emerald" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="mano_de_obra" label="Mano de Obra" icon={FaUserFriends} percentage={0.0} isActive={activeTab === 'mano_de_obra'} onClick={setActiveTab} color="orange" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="equipo" label="Equipo" icon={FaTractor} percentage={0.0} isActive={activeTab === 'equipo'} onClick={setActiveTab} color="indigo" />
                <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                <TabButton id="servicios" label="Servicios" icon={FaConciergeBell} percentage={27.1} isActive={activeTab === 'servicios'} onClick={setActiveTab} color="cyan" />
                 <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                 <TabButton id="infraestructuras" label="Infraestructuras" icon={FaWarehouse} percentage={10} isActive={activeTab === 'infraestructuras'} onClick={setActiveTab} color="slate" />
                 <div className="w-[1px] bg-gray-100 flex-shrink-0 my-3" />
                 <TabButton id="otros" label="Otros" icon={FaQuestionCircle} percentage={37.3} isActive={activeTab === 'otros'} onClick={setActiveTab} color="gray" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-white">
                {renderContent()}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0">Valor promedio</p>
                        <div className="text-lg font-bold text-gray-700 leading-tight">
                            6.109,81 <span className="text-[10px] font-normal text-gray-400">€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostDistributionCard;
