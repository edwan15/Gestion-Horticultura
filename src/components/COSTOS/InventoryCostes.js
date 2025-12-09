import React, { useState } from 'react';
import { 
    FaFilter, FaBox, FaExchangeAlt, FaFileAlt, FaSearch, FaChevronLeft, FaChevronRight,
    FaLeaf, FaSprayCan, FaSeedling, FaIndustry, FaWarehouse
} from 'react-icons/fa';

// Mock Data based on user request
const mockInventoryData = [
    {
        id: 1,
        name: 'VERIMARK ES-01548',
        type: 'Fitosanitario',
        manufacturer: 'FMC AGRICULTURAL SOLUTIONS S.A.U.',
        quantity: 2005,
        unit: 'kg',
        avgValue: 1.59,
        totalValue: 3184.94,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-12-05 09:09',
        icon: FaSprayCan,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100'
    },
    {
        id: 2,
        name: 'QROP MIX 14-0-23+14CaO',
        type: 'Fertilizante - Sólidos Cobertera',
        manufacturer: 'SQM IBERIAN',
        quantity: 1500,
        unit: 'kg',
        avgValue: 0.89,
        totalValue: 1335.00,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-12-05 09:09',
        icon: FaLeaf,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100'
    },
    {
        id: 3,
        name: 'ECOGREEN V60',
        type: 'Fertilizante - Estimulantes',
        manufacturer: 'VITATERRA',
        quantity: 1000,
        unit: 'kg',
        avgValue: 0.99,
        totalValue: 990.00,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-11-05 13:20',
        icon: FaLeaf,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100'
    },
    {
        id: 4,
        name: 'CRISTALINO 19-6-6',
        type: 'Fertilizante - Sólidos Cobertera',
        manufacturer: 'Generico',
        quantity: 500,
        unit: 'kg',
        avgValue: 0.77,
        totalValue: 386.00,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-11-05 13:20',
        icon: FaLeaf,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    {
        id: 5,
        name: 'CRISTALINO 13-40-13',
        type: 'Fertilizante - Sólidos Cobertera',
        manufacturer: 'Generico',
        quantity: 500,
        unit: 'kg',
        avgValue: 1.44,
        totalValue: 717.50,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-11-05 13:20',
        icon: FaLeaf,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    {
        id: 6,
        name: 'ALGIKIM AGRO',
        type: 'Fertilizante - Correctores',
        manufacturer: 'IKM',
        quantity: 200,
        unit: 'kg',
        avgValue: 3.53,
        totalValue: 706.00,
        warehouse: 'EURO Balsicas',
        updatedAt: '2025-11-05 13:20',
        icon: FaLeaf,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100'
    },
];

const FilterInput = ({ label, placeholder }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder}
            className="border-b border-gray-300 focus:border-emerald-500 outline-none py-1 text-sm text-gray-700 bg-transparent placeholder-gray-300 transition-colors"
        />
    </div>
);

const InventoryCostes = () => {
    const [activeTab, setActiveTab] = useState('inventario');

    return (
        <div className="p-4 bg-gray-50 min-h-screen font-sans">
            <div className="bg-white rounded-none shadow-xl border border-gray-200 overflow-hidden">
                
                {/* Header Title */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Inventario de Productos</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Último mes</p>
                    </div>
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors">
                        <FaFilter />
                    </button>
                </div>

                {/* Main Tabs */}
                <div className="flex border-b border-gray-200">
                    {[
                        { id: 'inventario', label: 'Inventario', icon: FaBox },
                        { id: 'movimientos', label: 'Movimientos de Productos', icon: FaExchangeAlt },
                        { id: 'documentos', label: 'Documentos', icon: FaFileAlt },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 py-4 flex flex-col items-center justify-center gap-2 border-b-2 transition-colors
                                ${activeTab === tab.id 
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            <tab.icon className="text-xl" />
                            <span className="text-sm font-semibold">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'inventario' && (
                    <div className="animate-fadeIn">
                        {/* Filters Section */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 bg-white border-b border-gray-200">
                            <FilterInput label="Almacenes" placeholder="Todos" />
                            <FilterInput label="Catálogos" placeholder="Todos" />
                            <FilterInput label="Productos" placeholder="Buscar..." />
                            <FilterInput label="Tipos de productos" placeholder="Todos" />
                            <FilterInput label="Subtipos de producto" placeholder="Todos" />
                            <FilterInput label="Fabricantes" placeholder="Todos" />
                            
                            <div className="lg:col-span-2 flex items-end gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Búsqueda</label>
                                    <div className="relative">
                                        <FaSearch className="absolute left-0 bottom-2 text-gray-300" />
                                        <input 
                                            type="text" 
                                            className="w-full pl-6 border-b border-gray-300 focus:border-emerald-500 outline-none py-1 text-sm bg-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pb-1">
                                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    <span className="text-sm text-gray-600">Mostrar productos en cero</span>
                                </div>
                            </div>
                        </div>

                        {/* Totals Header Row */}
                        <div className="bg-blue-50/50 p-4 grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 border-b border-gray-100 items-center">
                            <div className="col-span-3 lg:col-span-4 pl-2">Producto / Fabricante</div>
                            <div className="col-span-2 lg:col-span-2 text-right">Cantidad</div>
                            <div className="col-span-2 lg:col-span-2 text-right">Valor promedio</div>
                            <div className="col-span-2 lg:col-span-2 text-right">Valor Total</div>
                            <div className="col-span-3 lg:col-span-2 text-center">Almacén / Fecha</div>
                        </div>

                        {/* Summary Totals */}
                        <div className="bg-blue-50/80 p-3 grid grid-cols-12 gap-4 border-b border-gray-200 font-bold text-blue-800 text-sm items-center hover:bg-blue-100 transition-colors">
                            <div className="col-span-3 lg:col-span-4 pl-4 flex items-center gap-4">
                                <span className="text-xl text-blue-500">38</span>
                                <span className="text-xl text-blue-400">24</span>
                            </div>
                            <div className="col-span-2 lg:col-span-2 text-right">6 230.700 kg</div>
                            <div className="col-span-2 lg:col-span-2 text-right">33.99 €/kg</div>
                            <div className="col-span-2 lg:col-span-2 text-right">12 219.57 €</div>
                            <div className="col-span-3 lg:col-span-2 text-center text-blue-500">1</div>
                        </div>

                        {/* Table Items */}
                        <div className="divide-y divide-gray-100">
                            {mockInventoryData.map((item) => (
                                <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors group">
                                    {/* Product Name & Info */}
                                    <div className="col-span-3 lg:col-span-4 flex items-start gap-3">
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                                            <item.icon className="text-sm" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                                            <p className="text-xs text-emerald-600 mb-0.5">{item.type}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                                <FaIndustry className="text-[9px]" /> {item.manufacturer}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 lg:col-span-2 text-right">
                                        <span className="text-sm font-bold text-green-700">{item.quantity.toLocaleString('es-ES')}</span>
                                        <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                                    </div>

                                    {/* Avg Value */}
                                    <div className="col-span-2 lg:col-span-2 text-right text-sm text-gray-700">
                                        {item.avgValue.toFixed(2)} €/kg
                                    </div>

                                    {/* Total Value */}
                                    <div className="col-span-2 lg:col-span-2 text-right font-bold text-gray-900 text-sm">
                                        {item.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                    </div>

                                    {/* Warehouse & Date */}
                                    <div className="col-span-3 lg:col-span-2 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs font-medium text-gray-700 mb-1">{item.warehouse}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {item.updatedAt.split(' ')[0]} <br/> {item.updatedAt.split(' ')[1]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando 10 por página</span>
                            <div className="flex items-center gap-2">
                                <button className="p-1 px-3 text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50">Anterior</button>
                                <button className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded text-xs font-bold shadow-sm">1</button>
                                <button className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-xs transition-colors">2</button>
                                <button className="p-1 px-3 text-xs font-semibold text-gray-500 hover:text-gray-800">Siguiente</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'movimientos' && (
                    <div className="animate-fadeIn">
                        {/* Filters Section - Specific for Component */}
                        <div className="p-6 bg-white border-b border-gray-200 space-y-6">
                            {/* Top Row Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                <FilterInput label="Almacenes" placeholder="Todos" />
                                <FilterInput label="Productos" placeholder="Todos" />
                                <FilterInput label="Tipos de productos" placeholder="Todos" />
                                <FilterInput label="Subtipos de producto" placeholder="Todos" />
                            </div>

                            {/* Middle Row Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-t border-gray-100 pt-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Entrada / Salida</label>
                                    <select className="border-b border-gray-300 focus:border-emerald-500 outline-none py-1 text-sm text-gray-700 bg-transparent w-full">
                                        <option>Todos</option>
                                        <option>Entrada</option>
                                        <option>Salida</option>
                                    </select>
                                </div>
                                <FilterInput label="Tipos de movimiento" placeholder="Todos" />
                                <FilterInput label="Cultivos" placeholder="En curso" />
                                <FilterInput label="Zonas Homogéneas" placeholder="Todos" />
                            </div>

                            {/* Checkboxes & Search */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                        <span className="text-xs text-gray-600">Mostrar transferencias</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                        <span className="text-xs text-gray-600">Mostrar cantidades disponibles</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                        <span className="text-xs text-gray-600">Con cantidades disponibles</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-4">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Búsqueda</label>
                                        <div className="relative">
                                            <FaSearch className="absolute left-0 bottom-2 text-gray-300" />
                                            <input 
                                                type="text" 
                                                className="w-full pl-6 border-b border-gray-300 focus:border-emerald-500 outline-none py-1 text-sm bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date Filter Buttons */}
                            <div className="flex items-center gap-2 pt-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase mr-2">Fecha</span>
                                {['Hoy', 'Ayer', 'Última Semana', 'Último mes', 'Siempre'].map((label, idx) => (
                                    <button 
                                        key={label}
                                        className={`px-3 py-1 text-xs rounded border transition-colors ${idx === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <button className="px-3 py-1 text-xs rounded border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 ml-2">
                                    2025-11-00 - 2025-12-30
                                </button>
                            </div>
                        </div>

                         {/* Totals Header Row (Movimientos) */}
                         <div className="bg-blue-50/50 p-3 grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-500 border-b border-gray-100 items-center uppercase tracking-wider">
                            <div className="col-span-1 text-center">Exp.</div>
                            <div className="col-span-1 text-center">Fecha</div>
                            <div className="col-span-3">Producto</div>
                            <div className="col-span-2 text-right">Cantidad</div>
                            <div className="col-span-1 text-right">Valor</div>
                            <div className="col-span-1 text-center">Documento</div>
                            <div className="col-span-1 text-center">Origen</div>
                            <div className="col-span-1 text-center">Destino</div>
                            <div className="col-span-1 text-center">Fuente/Act.</div>
                        </div>

                        {/* Summary Totals Row */}
                         <div className="bg-blue-50/80 p-3 grid grid-cols-12 gap-2 border-b border-gray-200 font-bold text-blue-800 text-xs items-center hover:bg-blue-100 transition-colors">
                            <div className="col-span-1 text-center text-blue-500 text-sm">31</div>
                            <div className="col-span-1"></div>
                            <div className="col-span-3"></div>
                            <div className="col-span-2 text-right text-sm">1 940.700 kg</div>
                            <div className="col-span-1 text-right text-sm">7 438.83 €</div>
                            <div className="col-span-4"></div>
                        </div>

                        {/* Movements Data Table */}
                        <div className="divide-y divide-gray-100">
                            {[
                                { id: 1, date: '2025-11-30', time: '08:55', name: 'VERIMARK ES-01548', type: 'Fitosanitario', operation: 'Entrada', qty: '+5 kg', value: '2 275.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                                { id: 2, date: '2025-11-30', time: '08:55', name: 'QROP MIX 14-0-23', type: 'Fertilizante', operation: 'Entrada', qty: '+1 500 kg', value: '1 335.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                                { id: 3, date: '2025-11-30', time: '08:55', name: 'COTTON MULTIMAX', type: 'Fertilizante', operation: 'Entrada', qty: '+10 kg', value: '100.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                                { id: 4, date: '2025-11-30', time: '08:55', name: 'ACIDO NITRICO', type: 'Fertilizante', operation: 'Entrada', qty: '+60 kg', value: '36.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                                { id: 5, date: '2025-11-30', time: '08:55', name: 'MANVERT MICONIC', type: 'Fertilizante', operation: 'Entrada', qty: '+60 kg', value: '36.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                                { id: 6, date: '2025-11-30', time: '08:55', name: 'ATONIK 22987', type: 'Fitosanitario', operation: 'Entrada', qty: '+25 kg', value: '283.25 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
                            ].map((item) => (
                                <div key={item.id} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition-colors group text-xs text-gray-700">
                                    <div className="col-span-1 flex justify-center">
                                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="col-span-1 text-center font-medium text-gray-600">
                                        {item.date}<br/><span className="text-[10px] text-gray-400">{item.time}</span>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-[10px] text-gray-400">{item.type}</div>
                                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5 uppercase">{item.operation}</div>
                                    </div>
                                    <div className="col-span-2 text-right font-bold text-emerald-600">{item.qty}</div>
                                    <div className="col-span-1 text-right font-medium">{item.value}</div>
                                    <div className="col-span-1 text-center text-blue-500 cursor-pointer hover:underline text-[10px]">{item.doc}</div>
                                    <div className="col-span-1 text-center truncate" title={item.origin}>{item.origin}</div>
                                    <div className="col-span-1 text-center truncate" title={item.dest}>{item.dest}</div>
                                    <div className="col-span-1 flex flex-col items-center justify-center">
                                         <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1 rounded">
                                            <span className="truncate max-w-[50px]">{item.source}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-400 mt-0.5">{item.updated}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                         {/* Pagination (Reused) */}
                         <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando 10 por página</span>
                            <div className="flex items-center gap-2">
                                <button className="p-1 px-3 text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50">Anterior</button>
                                <button className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded text-xs font-bold shadow-sm">1</button>
                                <button className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-xs transition-colors">2</button>
                                <button className="p-1 px-3 text-xs font-semibold text-gray-500 hover:text-gray-800">Siguiente</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryCostes;
