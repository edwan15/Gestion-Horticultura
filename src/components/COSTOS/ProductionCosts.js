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
import { doc, onSnapshot } from 'firebase/firestore';

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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [loading, setLoading] = useState(true);
    const [greenhouseName, setGreenhouseName] = useState("");

    // Fetch Logic
    useEffect(() => {
        if (!userId) return;

        const appId = getAppId();
        const STORAGE_KEY = `${appId}_selected_greenhouse_id`;
        const storedGreenhouseId = localStorage.getItem(STORAGE_KEY);
        // We can optionally fetch the greenhouse name if needed, but the ID is enough for data
        
        if (storedGreenhouseId) {
            console.log("ProductionCosts: Fetching data for greenhouse", storedGreenhouseId);
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/greenhouses/${storedGreenhouseId}/daily_data/data`);
            
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setDailyData(docSnap.data());
                } else {
                    console.log("No data found for this greenhouse");
                    setDailyData({});
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching production daily data:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            console.log("No greenhouse selected in localStorage");
            setLoading(false);
        }
    }, [userId]);

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
                efficiency: totalKg > 0 ? (dailyInvestment / totalKg) : 0
            };
        });

        // Sort by date
        return rawArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [dailyData]);

    // Filter by selected month
    const monthlyData = useMemo(() => {
        return processedData.filter(d => d.month === selectedMonth);
    }, [processedData, selectedMonth]);

    // Calculate Aggregates
    const totals = useMemo(() => {
        const totalProd = monthlyData.reduce((acc, curr) => acc + curr.production, 0);
        const totalInv = monthlyData.reduce((acc, curr) => acc + curr.investment, 0);
        const avgCost = totalProd > 0 ? (totalInv / totalProd) : 0;
        
        return {
            production: totalProd,
            investment: totalInv,
            avgCost: avgCost,
            days: monthlyData.length
        };
    }, [monthlyData]);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Chart Data Formatter
    const chartData = monthlyData.map(d => ({
        ...d,
        formattedDate: `${d.day}/${d.month + 1}`,
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
                
                <div className="mt-4 md:mt-0 flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
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
                                const maxDay = monthlyData.reduce((prev, current) => (prev.production > current.production) ? prev : current, {production: 0, day: '-'});
                                return (
                                    <>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold">{maxDay.day !== '-' ? `${maxDay.day} de ${months[selectedMonth]}` : 'N/A'}</span>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Producción (Kg)</th>
                                <th className="px-6 py-3">Inversión (€)</th>
                                <th className="px-6 py-3 text-right">Costo Unitario (€/kg)</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {monthlyData.length > 0 ? monthlyData.map((row, idx) => (
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
                                        No hay datos de producción para este mes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductionCosts;
