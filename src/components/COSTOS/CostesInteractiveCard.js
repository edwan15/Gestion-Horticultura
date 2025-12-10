import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaSeedling, FaUsers, FaUserTie, FaTags, FaChevronRight, FaEllipsisV, 
    FaArrowUp, FaEuroSign, FaChartPie, FaSpinner
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

const CostesInteractiveCard = ({ timesheets = [], loading = false }) => {
    const [activeTab, setActiveTab] = useState('cultivo');
    const [selectedPeriod, setSelectedPeriod] = useState('ultimo_mes');
    const navigate = useNavigate();

    // 1. DATA FILTERING LOGIC (Same as CostesManager)
    const filteredData = useMemo(() => {
        if (!timesheets.length) return [];
        
        const today = new Date();
        let startDate, endDate;

        switch (selectedPeriod) {
            case 'ultimo_mes':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30); 
                break;
            case 'ultimo_trimestre':
                 startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                 endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
                 break;
            case 'anio_actual':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;
            default:
                startDate = null; endDate = null;
        }

        return timesheets.filter(item => {
            if (!startDate) return true;
            const itemDate = new Date(item.date);
            // Adjust end date to include the full day
            let adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
            
            return itemDate >= startDate && itemDate < adjustedEndDate;
        });
    }, [timesheets, selectedPeriod]);

    // 2. AGGREGATION LOGIC
    const aggregatedData = useMemo(() => {
        const groups = {};
        let grandTotal = 0;

        filteredData.forEach(item => {
            const hours = parseFloat(item.totalHours || 0);
            const rate = parseFloat(item.ratePerHour || 0);
            const cost = hours * rate;
            grandTotal += cost;

            // Determine grouping key and name based on activeTab
            let key, name, subtitle;
            
            switch (activeTab) {
                case 'cultivo':
                    key = item.localId || 'unknown';
                    name = item.localName || 'Desconocido';
                    subtitle = 'Cultivo / Local'; // Could be €/ha if area data was available
                    break;
                case 'trabajador':
                    key = item.workerId || 'unknown';
                    name = item.workerName || 'Desconocido';
                    subtitle = 'Personal';
                    break;
                case 'entidad':
                    // Current timesheets don't have supplier entities, so this is mostly empty
                    // We could map it to something else or just leave it blank
                    key = 'na';
                    // Optional: You could group by 'Supplier' if you had expense records
                    name = 'Sin registros'; 
                    subtitle = 'N/A';
                    break;
                case 'categoria':
                    key = 'mano_obra';
                    name = 'Mano de Obra';
                    subtitle = 'Salarios y SS';
                    break;
                default:
                    key = 'unknown'; name = 'Unknown'; subtitle = '';
            }

            // Skip invalid keys? No, show them as Unknown
            if (activeTab === 'entidad') return; // Skip for now as we don't have data

            if (!groups[key]) {
                groups[key] = {
                    key,
                    name,
                    subtitle,
                    totalCost: 0,
                };
            }
            groups[key].totalCost += cost;
        });

        // Convert groups to array and sort by cost descending
        const results = Object.values(groups).sort((a, b) => b.totalCost - a.totalCost);

        // Calculate percentages
        return {
            items: results.map(group => ({
                ...group,
                percentage: grandTotal > 0 ? ((group.totalCost / grandTotal) * 100).toFixed(1) : 0
            })),
            totalFilteredCost: grandTotal
        };

    }, [filteredData, activeTab]);

    // 3. COUNTS FOR TABS
    const counts = useMemo(() => {
        // We need to count unique items for each category based on FULL filtered data, regardless of active tab
        const uniqueCultivos = new Set(filteredData.map(i => i.localId).filter(Boolean)).size;
        const uniqueWorkers = new Set(filteredData.map(i => i.workerId).filter(Boolean)).size;
        // const uniqueEntities = 0; // Placeholder
        const uniqueCategories = 1; // "Mano de Obra"

        return {
            cultivo: uniqueCultivos,
            entidad: 0,
            trabajador: uniqueWorkers,
            categoria: uniqueCategories
        };
    }, [filteredData]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-40">
                    <FaSpinner className="animate-spin text-emerald-500 text-2xl" />
                </div>
            );
        }

        if (aggregatedData.items.length === 0) {
             return (
                <div className="flex flex-col justify-center items-center h-40 text-gray-400">
                    <p className="text-sm">No hay datos para este periodo</p>
                </div>
            );
        }

        return (
            <div className="animate-fadeIn space-y-1">
                {aggregatedData.items.map((item) => (
                    <ListItem 
                        key={item.key}
                        title={item.name} 
                        subtitle={item.subtitle} 
                        value={item.totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                        percentage={`${item.percentage}%`} 
                        type={activeTab} 
                    />
                ))}
            </div>
        );
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
                    count={counts.cultivo} 
                    isActive={activeTab === 'cultivo'} 
                    onClick={setActiveTab}
                    color="emerald"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="entidad" 
                    label="Entidad" 
                    icon={MdBusiness} 
                    count={counts.entidad} 
                    isActive={activeTab === 'entidad'} 
                    onClick={setActiveTab}
                    color="blue"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="trabajador" 
                    label="Trabajador" 
                    icon={FaUsers} 
                    count={counts.trabajador} 
                    isActive={activeTab === 'trabajador'} 
                    onClick={setActiveTab}
                    color="purple"
                />
                <div className="w-[1px] bg-gray-200 my-2" />
                <TabButton 
                    id="categoria" 
                    label="Categoría" 
                    icon={FaChartPie} 
                    count={counts.categoria} 
                    isActive={activeTab === 'categoria'} 
                    onClick={setActiveTab}
                    color="amber"
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar bg-white">
                {renderContent()}
                
                {aggregatedData.items.length > 5 && (
                    <div className="mt-2 flex justify-center">
                        <button className="text-[10px] font-semibold text-gray-400 hover:text-emerald-600 border border-gray-100 hover:border-emerald-300 px-3 py-1 rounded-full transition-all duration-300">
                            Mostrar más
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0">Promedio / ha</p>
                        <div className="text-lg font-bold text-gray-700 leading-tight">
                            {/* Placeholder for now as we don't have hectare data */}
                            -- <span className="text-[10px] font-normal text-gray-400">€/ha</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mb-0 flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Total
                        </p>
                        <div className="text-xl font-extrabold text-blue-900 tracking-tight leading-none">
                            {aggregatedData.totalFilteredCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400">€</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostesInteractiveCard;
