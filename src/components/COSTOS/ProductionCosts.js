import React, { useMemo, useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { 
  FaChartLine, FaCoins, FaWeightHanging, FaTractor, FaCalendarAlt, 
  FaArrowUp, FaArrowDown, FaLeaf
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { db } from '../../firebaseConfig';
import { doc, onSnapshot, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; 
import GreenhouseSelector from '../GreenhouseSelector';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

const getAppId = () => {
    if (typeof window !== 'undefined' && window.__app_id) {
      return window.__app_id;
    }
    return "default-calendar-app-id";
};

const StatCard = ({ title, value, unit, icon: Icon, trend, color = "emerald" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-${color}-500`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
                    <span className="ml-1 text-sm font-medium text-gray-500">{unit}</span>
                </div>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon className="text-xl" />
            </div>
        </div>
        
        {trend && (
            <div className={`flex items-center text-xs font-semibold ${trend > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {trend > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                <span>{Math.abs(trend)}% vs mes anterior</span>
            </div>
        )}
    </div>
);

const ProductionCosts = () => {
    const userId = useSelector(selectUserId);
    const [dailyData, setDailyData] = useState({});
    
    // Filtering State
    const [filterMode, setFilterMode] = useState('month'); // 'month' | 'range'
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(true);
    
    // Greenhouse State
    const [greenhouses, setGreenhouses] = useState([]);
    const [greenhouseId, setGreenhouseId] = useState(null);
    const [greenhouseName, setGreenhouseName] = useState("");

    // Pagination State
    const [visibleRows, setVisibleRows] = useState(10);

    // Fetch Logic
    // --- Greenhouse Management Logic ---
    useEffect(() => {
        if (!userId) return;

        const appId = getAppId();
        const listRef = doc(db, `artifacts/${appId}/users/${userId}/greenhouse_list/meta`);

        const unsubscribe = onSnapshot(listRef, (docSnap) => {
            const data = docSnap.data() || { list: [] };
            const list = data.list || [];
            setGreenhouses(list);

            if (list.length > 0) {
                const STORAGE_KEY = `${appId}_selected_greenhouse_id`;
                const storedId = localStorage.getItem(STORAGE_KEY);
                
                const initialGreenhouse = 
                    list.find(g => g.id === storedId) ||
                    list.find(g => g.id === greenhouseId) ||
                    list[0];

                if (initialGreenhouse) {
                    setGreenhouseId(initialGreenhouse.id);
                    setGreenhouseName(initialGreenhouse.name);
                }
            } else {
                setGreenhouseId(null);
                setGreenhouseName("Sin invernaderos");
            }
        });

        return () => unsubscribe();
    }, [userId]);

    // --- Data Fetching Logic ---
    useEffect(() => {
        if (!userId || !greenhouseId) {
             setLoading(false);
             return;
        }

        const appId = getAppId();
        const docRef = doc(db, `artifacts/${appId}/users/${userId}/greenhouses/${greenhouseId}/daily_data/data`);
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDailyData(docSnap.data());
            } else {
                setDailyData({});
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching production daily data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, greenhouseId]);

    // Greenhouse Actions
    const handleSelectGreenhouse = (id, name) => {
        setGreenhouseId(id);
        setGreenhouseName(name);
        const appId = getAppId();
        localStorage.setItem(`${appId}_selected_greenhouse_id`, id);
    };

    const handleCreateGreenhouse = async (name) => {
        if (!userId) return;
        const newId = uuidv4();
        const appId = getAppId();
        const listRef = doc(db, `artifacts/${appId}/users/${userId}/greenhouse_list/meta`);
        const newGreenhouse = { id: newId, name: name };

        try {
            await updateDoc(listRef, {
                list: arrayUnion(newGreenhouse),
            }).catch(async (error) => {
                if (error.code === "not-found") {
                    await setDoc(listRef, { list: [newGreenhouse] });
                } else {
                    throw error;
                }
            });
            handleSelectGreenhouse(newId, name);
            toast.success(`Invernadero "${name}" creado.`);
        } catch (error) {
            console.error("Error creating greenhouse:", error);
            toast.error("Error al crear invernadero.");
        }
    };

    const handleDeleteGreenhouse = async (id, name) => {
        if (!window.confirm(`¿Eliminar ${name}?`)) return;
        // Simplified delete for Cost view (full delete logic usually in main production page)
        // Here we just remove from list to update view
        try {
             const appId = getAppId();
             const listRef = doc(db, `artifacts/${appId}/users/${userId}/greenhouse_list/meta`);
             const ghToDelete = greenhouses.find(g => g.id === id);
             if(ghToDelete) {
                await updateDoc(listRef, {
                    list: arrayRemove(ghToDelete)
                });
                toast.success("Invernadero eliminado.");
             }
        } catch(e) {
            console.error(e);
            toast.error("Error al eliminar.");
        }
    };

    const processedData = useMemo(() => {
        // Transform dailyData (Object) to Array
        const rawArray = Object.keys(dailyData).map(dateKey => {
            const dayData = dailyData[dateKey];
            
            // Calculate total Kg for the day
            const totalKg = dayData.items ? 
                dayData.items.reduce((sum, item) => sum + (parseFloat(item.result) || 0), 0) 
                : 0;

            // Cost calculation (similar to export logic)
            const costPerKg = parseFloat(dayData.finalProductionCost) || 0;
            const dailyInvestment = parseFloat(dayData.productionCostVariable) || 0;

            return {
                date: dateKey,
                day: parseInt(dateKey.split('-')[2]),
                month: parseInt(dateKey.split('-')[1]) - 1,
                year: parseInt(dateKey.split('-')[0]),
                production: totalKg,
                costPerKg: costPerKg,
                investment: dailyInvestment,
                efficiency: totalKg > 0 ? (dailyInvestment / totalKg) : 0,
                // Add formatted date here for global usage
                formattedDate: `${dateKey.split('-')[2]}/${dateKey.split('-')[1]}`
            };
        });

        // Sort by date
        return rawArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [dailyData]);

    // Filter logic
    const filteredData = useMemo(() => {
        if (filterMode === 'month') {
            return processedData.filter(d => d.month === selectedMonth);
        } else {
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59); // Include full end day

            return processedData.filter(d => {
                const currentDate = new Date(d.date);
                return currentDate >= start && currentDate <= end;
            });
        }
    }, [processedData, selectedMonth, filterMode, dateRange]);

    // Calculate Aggregates
    const totals = useMemo(() => {
        const totalProd = filteredData.reduce((acc, curr) => acc + curr.production, 0);
        const totalInv = filteredData.reduce((acc, curr) => acc + curr.investment, 0);
        const avgCost = totalProd > 0 ? (totalInv / totalProd) : 0;
        
        return {
            production: totalProd,
            investment: totalInv,
            avgCost: avgCost,
            days: filteredData.length
        };
    }, [filteredData]);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Chart Data Formatter
    const chartData = filteredData.map(d => ({
        ...d,
        tooltipCost: d.costPerKg.toFixed(2),
        tooltipProd: d.production.toFixed(0)
    }));

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <FaChartLine />
                        </div>
                        Costos de Producción
                    </h1>
                    <p className="text-gray-500 mt-1">Análisis financiero y métricas de rendimiento agrícola</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
                    {/* Greenhouse Selector */}
                    <div>
                        <GreenhouseSelector
                            greenhouses={greenhouses}
                            greenhouseId={greenhouseId}
                            handleSelectGreenhouse={handleSelectGreenhouse}
                            handleCreateGreenhouse={handleCreateGreenhouse}
                            handleDeleteGreenhouse={handleDeleteGreenhouse}
                            showManagementButtons={true}
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                            className="text-xs font-bold text-gray-600 bg-transparent border-r border-gray-200 pr-2 mr-2 outline-none"
                        >
                            <option value="month">Mensual</option>
                            <option value="range">Rango/Campaña</option>
                        </select>

                        {filterMode === 'month' ? (
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-400" />
                                <select 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                                >
                                    {months.map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2 text-sm">
                                <input 
                                    type="date" 
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                    className="bg-transparent border-none outline-none text-gray-600 font-medium w-28"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="date" 
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                    className="bg-transparent border-none outline-none text-gray-600 font-medium w-28"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Inversión Total" 
                    value={totals.investment.toLocaleString('es-ES', { maximumFractionDigits: 2 })} 
                    unit="€" 
                    icon={FaCoins} 
                    color="amber"
                />
                <StatCard 
                    title="Producción Total" 
                    value={totals.production.toLocaleString('es-ES', { maximumFractionDigits: 0 })} 
                    unit="Kg" 
                    icon={FaWeightHanging} 
                    color="emerald"
                />
                <StatCard 
                    title="Costo Promedio" 
                    value={totals.avgCost.toLocaleString('es-ES', { maximumFractionDigits: 2 })} 
                    unit="€/Kg" 
                    icon={FaLeaf} 
                    color="blue"
                />
                <StatCard 
                    title="Días Operativos" 
                    value={totals.days} 
                    unit="Días" 
                    icon={FaTractor} 
                    color="purple"
                    trend={0} 
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cost vs Production Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Relación Costo vs Producción</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Producción (Kg)
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Costo (€/kg)
                            </span>
                        </div>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="formattedDate" 
                                    tick={{fontSize: 12, fill: '#9ca3af'}} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <YAxis 
                                    yAxisId="left" 
                                    orientation="left" 
                                    stroke="#10b981" 
                                    tick={{fontSize: 12}}
                                    axisLine={false}
                                    tickLine={false}
                                    label={{ value: 'Kg', angle: -90, position: 'insideLeft', fill: '#10b981' }}
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    stroke="#f59e0b" 
                                    tick={{fontSize: 12}}
                                    axisLine={false}
                                    tickLine={false}
                                    label={{ value: '€/Kg', angle: 90, position: 'insideRight', fill: '#f59e0b' }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area 
                                    yAxisId="left" 
                                    type="monotone" 
                                    dataKey="production" 
                                    fill="url(#colorProd)" 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    name="Producción"
                                />
                                <Line 
                                    yAxisId="right" 
                                    type="monotone" 
                                    dataKey="costPerKg" 
                                    stroke="#f59e0b" 
                                    strokeWidth={3} 
                                    dot={{r: 4, strokeWidth: 2, fill: '#fff'}} 
                                    name="Costo Unitario"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Analysis / Insights */}
                <div className="bg-gradient-to-b from-gray-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg border border-gray-700 lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <FaLeaf className="text-emerald-400" />
                        Análisis Inteligente
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h4 className="text-sm font-semibold text-emerald-300 mb-1">Tendencia del Mes</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {totals.avgCost < 1 
                                    ? "Excelente eficiencia. El costo promedio se mantiene por debajo de 1€/kg, maximizando márgenes." 
                                    : "Atención al costo unitario. Se observan picos que superan el objetivo de rentabilidad."}
                            </p>
                        </div>
                        
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <h4 className="text-sm font-semibold text-amber-300 mb-1">Día Más Productivo</h4>
                            {(() => {
                                const maxDay = filteredData.reduce((prev, current) => (prev.production > current.production) ? prev : current, {production: 0, day: '-', month: 0});
                                return (
                                    <>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold">{maxDay.day !== '-' ? `${maxDay.day} de ${months[maxDay.month]}` : 'N/A'}</span>
                                            <span className="text-amber-400 font-mono">{maxDay.production.toFixed(0)} Kg</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Correlaciona este pico con tus actividades de riego para replicar resultados.</p>
                                    </>
                                )
                            })()}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Eficiencia Global</span>
                                <span className="text-emerald-400 font-bold">Alta (85%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Desglose Diario de Producción</h3>
                    <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        Exportar Reporte
                    </button>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <table className="w-full text-sm text-left relative">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold text-xs sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 bg-gray-50">Fecha</th>
                                <th className="px-6 py-3 bg-gray-50">Producción (Kg)</th>
                                <th className="px-6 py-3 bg-gray-50">Inversión (€)</th>
                                <th className="px-6 py-3 text-right bg-gray-50">Costo Unitario (€/kg)</th>
                                <th className="px-6 py-3 text-center bg-gray-50">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? filteredData.slice(0, visibleRows).map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{row.formattedDate}</td>
                                    <td className="px-6 py-4">{row.production.toFixed(2)}</td>
                                    <td className="px-6 py-4">{row.investment.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-700">{row.costPerKg.toFixed(2)} €</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${row.costPerKg < 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}
                                        `}>
                                            {row.costPerKg < 1 ? 'Óptimo' : 'Revisar'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                        No hay datos de producción para este periodo
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination / Load More */}
                {filteredData.length > visibleRows && (
                    <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/30">
                        <button 
                            onClick={() => setVisibleRows(prev => prev + 10)}
                            className="text-xs font-bold text-gray-600 hover:text-emerald-600 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Cargar más resultados ({filteredData.length - visibleRows} restantes)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionCosts;
