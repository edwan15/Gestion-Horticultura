import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRole, selectName, selectUserId, selectIsImpersonating } from '../../features/auth/authSlice/authSlice';
import useRedirectLoggedOutUser from '../../custom/useRedirect';
import useProductsFromFirestore from '../../Util/useProductsFromFirestore';
import InventoryLog from "../../components/Inventario/InventoryLog";
import InventorySummaryPhytosanitary from "../../components/DashBoard/InventorySummaryPhytosanitary";

// Icons
import { 
    FaFilter, FaBox, FaExchangeAlt, FaFileAlt, FaSearch, 
    FaLeaf, FaSprayCan, FaIndustry
} from 'react-icons/fa';
import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { MdInventory } from "react-icons/md"; 
import { SiMicrosoftexcel } from "react-icons/si";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteProduct } from "../../features/product/ProductSlice";

// Mock Data for "Movimientos" (Placeholder as decided in plan)
const mockMovementsData = [
    { id: 1, date: '2025-11-30', time: '08:55', name: 'VERIMARK ES-01548', type: 'Fitosanitario', operation: 'Entrada', qty: '+5 kg', value: '2 275.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
    { id: 2, date: '2025-11-30', time: '08:55', name: 'QROP MIX 14-0-23', type: 'Fertilizante', operation: 'Entrada', qty: '+1 500 kg', value: '1 335.00 €', doc: '[2025-11-30]', origin: 'INNOVA AGRO...', dest: 'EURO Balsicas', source: 'Rafael Rafales', updated: '2025-12-05' },
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

const DashBoard = () => {
    useRedirectLoggedOutUser("/"); 
    
    // Auth & Redux State
    const userRole = useSelector(selectRole); 
    const userName = useSelector(selectName);
    const userId = useSelector(selectUserId);
    const isImpersonating = useSelector(selectIsImpersonating);
    const dispatch = useDispatch();

    // Local State
    const [activeTab, setActiveTab] = useState('inventario');

    // --- DATA FETCHING LOGIC (Adapted from UserProductList) ---
    // Determinación de la Lógica de Carga de Productos
    let idToFetch = null;
    let fetchMode = null;
    let filterId = null;

    if (!userId) {
        idToFetch = null;
        fetchMode = null;
    } else if (userRole === 'admin' && !isImpersonating) {
        // Admin real sees all
        idToFetch = null;
        fetchMode = 'all'; 
        filterId = 'all'; 
    } else {
        // User or Impersonated
        idToFetch = userId; 
        fetchMode = 'own'; 
        filterId = null; 
    }
    
    const { products, isLoading, error } = useProductsFromFirestore(
        idToFetch, 
        userRole, 
        fetchMode,
        filterId 
    );

    // Filter helper (Basic search implementation)
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Delete Logic
    const confirmDelate = (id) => {
        confirmAlert({
            title: "Eliminar Producto",
            message: "¿Estás seguro de eliminar este producto?",
            buttons: [
                {
                    label: "Eliminar",
                    onClick: () => dispatch(deleteProduct(id)),
                },
                {
                    label: "Cancelar",
                },
            ],
        });
    };

    const greeting = userName ? `¡Hola, ${userName}!` : 'Bienvenido/a';
    
    return (
        <div className="p-4 bg-gray-50 min-h-screen font-sans">
             {/* Main Card Container */}
            <div className="bg-white rounded-none shadow-xl border border-gray-200 overflow-hidden mb-8">
                
                {/* Header Title */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Inventario de Productos</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{greeting} - Último mes</p>
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

                {/* TAB CONTENT: INVENTARIO (REAL DATA) */}
                {activeTab === 'inventario' && (
                    <div className="animate-fadeIn">
                        {/* Filters Section */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 bg-white border-b border-gray-200">
                            <FilterInput label="Almacenes" placeholder="Todos" />
                            <FilterInput label="Catálogos" placeholder="Todos" />
                            
                            {/* Search Logic Integrated */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Productos</label>
                                <div className="relative">
                                     <input 
                                        type="text" 
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border-b border-gray-300 focus:border-emerald-500 outline-none py-1 text-sm text-gray-700 bg-transparent placeholder-gray-300 transition-colors"
                                    />
                                    <FaSearch className="absolute right-0 bottom-2 text-gray-300" />
                                </div>
                            </div>
                            
                            <FilterInput label="Tipos de productos" placeholder="Todos" />
                            {/* More filters can be added here */}
                        </div>

                        {/* Totals Header Row */}
                        <div className="bg-blue-50/50 p-4 grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 border-b border-gray-100 items-center">
                            <div className="col-span-3 lg:col-span-3 pl-2">Producto / Fabricante</div>
                            <div className="col-span-2 lg:col-span-1 text-right">Cantidad</div>
                            <div className="hidden lg:block lg:col-span-1 text-right">Valor prom.</div>
                            <div className="col-span-2 lg:col-span-2 text-right">Valor Total</div>
                            <div className="col-span-2 lg:col-span-2 text-center">Finca / Fecha</div>
                            <div className="col-span-3 lg:col-span-3 text-center">Acciones</div>
                        </div>

                        {/* Summary Totals (Calculated from Data) */}
                        <div className="bg-blue-50/80 p-3 grid grid-cols-12 gap-4 border-b border-gray-200 font-bold text-blue-800 text-sm items-center hover:bg-blue-100 transition-colors">
                            <div className="col-span-3 lg:col-span-3 pl-4 flex items-center gap-4">
                                <span className="text-xl text-blue-500">{filteredProducts.length}</span>
                                <span className="text-xs font-normal text-blue-400">Items</span>
                            </div>
                            {/* Calculated Totals would go here, using placeholders for now as detailed calc might be complex */}
                            <div className="col-span-2 lg:col-span-1 text-right">-</div>
                            <div className="hidden lg:block lg:col-span-1 text-right">-</div>
                            <div className="col-span-2 lg:col-span-2 text-right">-</div>
                            <div className="col-span-2 lg:col-span-2 text-center text-blue-500">-</div>
                            <div className="col-span-3 lg:col-span-3 text-center text-blue-500">-</div>
                        </div>

                        {/* Table Items (Mapped from Firestore Products) */}
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-500">Cargando inventario...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No se encontraron productos.</div>
                            ) : (
                                filteredProducts.map((item) => {
                                    // Calculate Display Values
                                    const stock = (item.entradas || 0) - (item.salidas || 0);
                                    const avgValue = Number(item.price) || 0;
                                    const totalValue = stock * avgValue;
                                    const categoryColor = item.category === 'Fitosanitarios' ? 'text-red-600 bg-red-100' : 'text-amber-600 bg-amber-100';
                                    const Icon = item.category === 'Fitosanitarios' ? FaSprayCan : FaLeaf;

                                    return (
                                        <div key={item.id || item._id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors group">
                                            {/* Product Name & Info */}
                                            <div className="col-span-3 lg:col-span-3 flex items-start gap-3">
                                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${categoryColor}`}>
                                                    <Icon className="text-sm" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors mb-0.5">{item.name}</h3>
                                                    <p className="text-xs text-emerald-600 mb-0.5">{item.category}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                                        <FaIndustry className="text-[9px]" /> {item.manufacturer || 'Generico'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-2 lg:col-span-1 text-right">
                                                <span className={`text-sm font-bold ${stock < 0 ? 'text-red-600' : 'text-green-700'}`}>
                                                    {stock.toLocaleString('es-ES')}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">{item.unit || 'Ud'}</span>
                                            </div>

                                            {/* Avg Value */}
                                            <div className="hidden lg:block lg:col-span-1 text-right text-sm text-gray-700">
                                                {avgValue.toFixed(2)} €
                                            </div>

                                            {/* Total Value */}
                                            <div className="col-span-2 lg:col-span-2 text-right font-bold text-gray-900 text-sm">
                                                {totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                            </div>

                                             {/* Warehouse & Date */}
                                             <div className="col-span-2 lg:col-span-2 flex flex-col items-center justify-center text-center">
                                                <span className="text-xs font-bold text-gray-800 mb-1">{item.userName || userName}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date().toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="col-span-3 lg:col-span-3 flex justify-center items-center gap-2">
                                                <Link to={`/product-detail/${item.id || item._id}`} className="text-purple-500 hover:text-purple-700 p-1 rounded hover:bg-purple-50 transition-colors" title="Ver Detalle">
                                                    <AiFillEye size={18} />
                                                </Link>
                                                {(userRole === "admin" || userRole === "usuario") && (
                                                    <Link to={`/edit-product/${item.id || item._id}`} className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors" title="Editar">
                                                        <BiEditAlt size={18} />
                                                    </Link>
                                                )}
                                                {userRole === "admin" && (
                                                    <button onClick={() => confirmDelate(item.id || item._id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" title="Eliminar">
                                                        <AiTwotoneDelete size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                         
                        {/* Pagination (Visual Only) */}
                        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                            <span className="text-xs text-gray-500">Mostrando {filteredProducts.length} resultados</span>
                            <div className="flex items-center gap-2">
                                <button disabled className="p-1 px-3 text-xs font-semibold text-gray-400 cursor-not-allowed">Anterior</button>
                                <button className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded text-xs font-bold shadow-sm">1</button>
                                <button disabled className="p-1 px-3 text-xs font-semibold text-gray-400 cursor-not-allowed">Siguiente</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: MOVIMIENTOS (PLACEHOLDER) */}
                {activeTab === 'movimientos' && (
                    <div className="animate-fadeIn p-6 text-center">
                        <p className="text-gray-500 italic mb-4">Funcionalidad de movimientos detallados en desarrollo.</p>
                        {/* Reuse placeholder table structure from implementation plan if needed, using simple map here */}
                        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
                             {mockMovementsData.map((item) => (
                                <div key={item.id} className="p-3 grid grid-cols-12 gap-2 items-center text-xs text-gray-700 bg-white">
                                    <div className="col-span-2">{item.date}</div>
                                    <div className="col-span-4 font-bold">{item.name}</div>
                                    <div className="col-span-2 text-green-600 font-bold">{item.qty}</div>
                                    <div className="col-span-4 text-right">{item.origin}</div>
                                </div>
                             ))}
                        </div>
                    </div>
                )}
                 
                 {/* TAB CONTENT: DOCUMENTOS (PLACEHOLDER) */}
                 {activeTab === 'documentos' && (
                     <div className="p-12 text-center text-gray-400">
                         <FaFileAlt className="text-4xl mx-auto mb-2 opacity-50"/>
                         <p>No hay documentos adjuntos.</p>
                     </div>
                 )}
            
            </div>

            {/* --- SECCIONES ADICIONALES --- */}
            
            {/* 1. Registro de Actividades (Preserved Functionality) */}
            <div className="mb-8 animate-fadeIn">
                <InventoryLog />
            </div>

            {/* 2. Resumen Inventario Fitosanitarios (HIDDEN / COMENTADO) */}
            {/* 
                Este componente está listo pero oculto por solicitud del usuario.
                Para activarlo, descomentar la línea de abajo o quitar la prop 'hidden' dentro del componente.
            */}
            <InventorySummaryPhytosanitary />

        </div>
    );
};

export default DashBoard;