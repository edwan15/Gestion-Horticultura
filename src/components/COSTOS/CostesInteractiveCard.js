import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaSeedling, FaUsers, FaUserTie, FaTags, FaChevronRight, FaEllipsisV, 
    FaArrowUp, FaArrowDown, FaEuroSign, FaChartPie 
} from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';

const TabButton = ({ id, label, icon: Icon, count, isActive, onClick, color = "emerald" }) => (
    <button
        onClick={() => onClick(id)}
        className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 group
            ${isActive ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
        `}
    >
        {isActive && (
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-${color}-500 rounded-b-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
        )}
        
        <div className={`flex items-center gap-1.5 ${isActive ? `text-${color}-600 font-bold scale-105` : 'text-gray-500 group-hover:text-gray-700'}`}>
            <Icon className={`text-base transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[11px] tracking-wide">{label}</span>
        </div>
        
        <div className={`text-lg font-bold tracking-tight transition-all duration-300 leading-none
            ${isActive ? `text-${color}-700` : 'text-gray-400'}
        `}>
            {count}
        </div>
    </button>
);

const ListItem = ({ title, subtitle, value, percentage, type = 'default' }) => {
    // Parse percentage string to number for width (e.g., "12%" -> 12)
    const percentageValue = percentage ? parseFloat(percentage) : 0;
    
    // Determine bar color based on type
    const barColor = 
        type === 'cultivo' ? 'bg-emerald-500' : 
        type === 'entidad' ? 'bg-blue-500' :
        type === 'trabajador' ? 'bg-purple-500' :
        'bg-amber-500';

    return (
        <div className="group relative p-2 hover:bg-gray-50 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-sm mb-1 cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                        ${type === 'cultivo' ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200' : 
                          type === 'entidad' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' :
                          type === 'trabajador' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                          'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}
                    `}>
                        {type === 'cultivo' ? <FaSeedling className="text-xs" /> : 
                         type === 'entidad' ? <MdBusiness className="text-xs" /> : 
                         type === 'trabajador' ? <FaUserTie className="text-xs" /> : <FaTags className="text-xs" />}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 text-xs">{title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight">{subtitle}</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-gray-900 text-xs flex items-center justify-end gap-1">
                        {value} <span className="text-[10px] text-gray-400 font-normal">€</span>
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

const CostesInteractiveCard = () => {
    const [activeTab, setActiveTab] = useState('cultivo');
    const [selectedPeriod, setSelectedPeriod] = useState('ultimo_mes');
    const navigate = useNavigate();

    // Mock Data placeholders - Replaced later with real data props
    const renderContent = () => {
        switch (activeTab) {
            case 'cultivo':
                return (
                    <div className="animate-fadeIn space-y-1">
                        <ListItem title="Inv 2 Calabacín 2026" subtitle="2.751,55 €/ha" value="3.081,73" percentage="12%" type="cultivo" />
                        <ListItem title="Inv 4 Calabacín 2026" subtitle="3.874,71 €/ha" value="6.005,80" percentage="29%" type="cultivo" />
                        <ListItem title="General Balsicas 2026" subtitle="143.444,00 €/ha" value="1.434,44" percentage="8%" type="cultivo" />
                    </div>
                );
            case 'entidad':
                return (
                    <div className="animate-fadeIn space-y-1">
                        <ListItem title="Nutricontrol S.L." subtitle="Riego y Automatización" value="2.450,00" percentage="15%" type="entidad" />
                        <ListItem title="Semillas Almería" subtitle="Insumos" value="1.200,50" percentage="5%" type="entidad" />
                        <ListItem title="Transportes Gomez" subtitle="Logística" value="890,20" percentage="2%" type="entidad" />
                    </div>
                );
            case 'trabajador':
                return (
                    <div className="animate-fadeIn space-y-1">
                        <ListItem title="Juan Pérez" subtitle="Encargado" value="1.800,00" type="trabajador" />
                        <ListItem title="María García" subtitle="Peón Especializado" value="1.450,00" type="trabajador" />
                        <ListItem title="Equipo Recolección" subtitle="Cuadrilla A" value="4.500,00" percentage="10%" type="trabajador" />
                    </div>
                );
            case 'categoria':
                return (
                    <div className="animate-fadeIn space-y-1">
                        <ListItem title="Mano de Obra" subtitle="Salarios y SS" value="8.500,00" percentage="45%" type="categoria" />
                        <ListItem title="Insumos" subtitle="Fertilizantes/Fito" value="4.200,00" percentage="22%" type="categoria" />
                        <ListItem title="Maquinaria" subtitle="Mantenimiento/Combustible" value="1.300,00" percentage="8%" type="categoria" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-none shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full font-sans">
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
                <div 
                    onClick={() => navigate('/costes')}
                    className="cursor-pointer group"
                >
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        Costes <FaChevronRight className="text-[10px] text-emerald-500 group-hover:text-emerald-600" />
                    </h2>
                    <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-[10px] text-gray-500 bg-transparent border-none focus:ring-0 p-0 font-medium cursor-pointer hover:text-emerald-600 transition-colors"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <option value="ultimo_mes">Último mes</option>
                        <option value="ultimo_trimestre">Último trimestre</option>
                        <option value="anio_actual">Año actual</option>
                    </select>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100">
                    <FaEllipsisV className="text-xs" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                <TabButton 
                    id="cultivo" 
                    label="Cultivo" 
                    icon={FaSeedling} 
                    count={7} 
                    isActive={activeTab === 'cultivo'} 
                    onClick={setActiveTab}
                    color="emerald"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="entidad" 
                    label="Entidad" 
                    icon={MdBusiness} 
                    count={10} 
                    isActive={activeTab === 'entidad'} 
                    onClick={setActiveTab}
                    color="blue"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="trabajador" 
                    label="Trabajador" 
                    icon={FaUsers} 
                    count={0} 
                    isActive={activeTab === 'trabajador'} 
                    onClick={setActiveTab}
                    color="purple"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="categoria" 
                    label="Categoría" 
                    icon={FaChartPie} 
                    count={3} 
                    isActive={activeTab === 'categoria'} 
                    onClick={setActiveTab}
                    color="amber"
                />
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

            {/* Footer Summary */}
            <div className="p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0">Promedio / ha</p>
                        <div className="text-lg font-bold text-gray-700 leading-tight">
                            21.840,20 <span className="text-[10px] font-normal text-gray-400">€/ha</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mb-0 flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Total
                        </p>
                        <div className="text-xl font-extrabold text-blue-900 tracking-tight leading-none">
                            23.820,33 <span className="text-sm font-normal text-gray-400">€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostesInteractiveCard;
