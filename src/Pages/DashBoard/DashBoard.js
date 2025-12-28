import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRole, selectName, selectUserId, selectIsImpersonating } from '../../features/auth/authSlice/authSlice';
import useRedirectLoggedOutUser from '../../custom/useRedirect';
import useProductsFromFirestore from '../../Util/useProductsFromFirestore';
import InventoryLog from "../../components/Inventario/InventoryLog";
import InventorySummaryPhytosanitary from "../../components/DashBoard/InventorySummaryPhytosanitary";
import AlbaranProcessor from '../../components/Inventario/AlbaranProcessor';

// Icons
import { 
    FaFilter, FaBox, FaExchangeAlt, FaFileAlt, FaSearch, 
    FaLeaf, FaSprayCan, FaIndustry,
    FaArrowUp,
    FaArrowDown,
    FaEllipsisV
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
    const logs = useSelector((state) => state.log?.logs || []); // Access logs safely
    const dispatch = useDispatch();

    // Local State
    const [activeTab, setActiveTab] = useState('inventario');
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Logs on mount for Movements tab
    useEffect(() => {
        // Assuming getLogs action exists and can be dispatched
        // We import it dynamically if needed or assume it's available globaly/in slice
        // dispatch(getLogs()); // Uncomment if getLogs needs to be dispatched here
    }, [dispatch]);

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

    // Filter helper
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
                        <h1 className="text-xl font-bold text-gray-800">Inventario General (Entradas)</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{greeting} - Histórico de Ingresos</p>
                    </div>
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors">
                        <FaFilter />
                    </button>
                </div>

                {/* Main Tabs */}
                <div className="flex border-b border-gray-200">
                    {[
                        { id: 'inventario', label: 'Inventario General', icon: FaBox },
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

                {/* TAB CONTENT: INVENTARIO GENERAL (TOTAL ENTRADAS) */}
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
                        </div>

                        {/* Totals Header Row */}
                        <div className="bg-blue-50/50 p-4 grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 border-b border-gray-100 items-center">
                            <div className="col-span-3 lg:col-span-3 pl-2">Producto / Fabricante</div>
                            <div className="col-span-2 lg:col-span-1 text-right">T. Ingresado</div>
                            <div className="hidden lg:block lg:col-span-1 text-right">Valor Unit.</div>
                            <div className="col-span-2 lg:col-span-2 text-right">Valor Total (Entradas)</div>
                            <div className="col-span-2 lg:col-span-2 text-center">Finca / Fecha</div>
                            <div className="col-span-3 lg:col-span-3 text-center">Acciones</div>
                        </div>

                         {/* Table Items (Mapped from Firestore Products) */}
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-500">Cargando inventario general...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No se encontraron productos.</div>
                            ) : (
                                filteredProducts.map((item) => {
                                    // Calculate Display Values for GENERAL INVENTORY (Inputs only)
                                    const totalInputs = item.entradas || 0; // SHOW ALL INPUTS
                                    const avgValue = Number(item.price) || 0;
                                    const totalValue = totalInputs * avgValue; // Value of all inputs
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

                                            {/* Quantity (Inputs) */}
                                            <div className="col-span-2 lg:col-span-1 text-right">
                                                <span className="text-sm font-bold text-blue-700">
                                                    {totalInputs.toLocaleString('es-ES')}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">{item.unit || 'Ud'}</span>
                                                <p className="text-[9px] text-gray-400 text-right">Total Ingresado</p>
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
                    </div>
                )}

                {/* TAB CONTENT: MOVIMIENTOS */}
                {/* TAB CONTENT: MOVIMIENTOS */}
                {activeTab === 'movimientos' && (
                    <div className="animate-fadeIn p-6">
                        <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[18%]">Producto / Detalle</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[8%]">Cant.</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Valor</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Cambios (Detalle)</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Origen / Documento</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Editado por</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[4%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {logs && logs.length > 0 ? (
                                        logs.map((log) => {
                                            // 1. Parseo de Origen (Albaranes vs Manual)
                                            let origen = 'Manual';
                                            let empresa = 'Inventario General'; 
                                            
                                            const allText = JSON.stringify(log.metadata) + log.details;
                                            if (allText.includes("Importado de Albarán")) {
                                                origen = 'Albarán';
                                                const match = allText.match(/Importado de Albarán\s+([^-]+)/);
                                                if (match) empresa = match[1].trim();
                                            }

                                            // 2. Parseo de Cantidad
                                            let quantityChange = null;
                                            let quantityUnit = '';
                                            let isPositive = true;

                                            // A) Lógica para CREATE
                                            if (log.action.includes("CREATE") && log.metadata) {
                                                if (log.metadata.initialStock !== undefined) {
                                                    quantityChange = Number(log.metadata.initialStock);
                                                    isPositive = quantityChange >= 0;
                                                    quantityUnit = 'unid.';
                                                }
                                            } 
                                            // B) Lógica para UPDATE
                                            else if (log.metadata && log.metadata.changes) {
                                                 const entradasMatch = log.metadata.changes.find(c => c.includes('entradas') || c.includes('stock'));
                                                 if (entradasMatch) {
                                                     const parts = entradasMatch.split('->');
                                                     if (parts.length === 2) {
                                                         const prev = parseFloat(parts[0].replace(/[^0-9.-]/g, ''));
                                                         const curr = parseFloat(parts[1].replace(/[^0-9.-]/g, ''));
                                                         const diff = curr - prev;
                                                         if (!isNaN(diff)) {
                                                             quantityChange = Math.abs(diff);
                                                             isPositive = diff >= 0;
                                                             quantityUnit = 'unid.';
                                                         }
                                                     }
                                                 }
                                            }

                                            // 3. Estilos de Fila
                                            const rowBg = log.action.includes("CREATE") ? "bg-green-50/40" : "";

                                            return (
                                                <tr key={log.id} className={`hover:bg-blue-50/30 transition-all duration-200 ${rowBg}`}>
                                                    {/* Fecha */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {new Date(log.createdAt).toLocaleDateString('es-ES', { 
                                                                    year: 'numeric', month: '2-digit', day: '2-digit' 
                                                                })}
                                                            </span>
                                                            <span className="text-xs text-gray-400 font-mono">
                                                                {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Producto */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center mr-3
                                                                ${origen === 'Albarán' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                {origen === 'Albarán' ? <FaFileAlt className="text-sm" /> : <FaLeaf className="text-sm" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-800 leading-tight">
                                                                    {log.details.replace("Product created: ", "").replace("Product updated: ", "").split(',')[0]}
                                                                </div>
                                                                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                                                                    {log.collection || 'Producto'} <span className="text-gray-300">|</span> {log.metadata?.category || 'General'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Cantidad */}
                                                    <td className="px-6 py-4 text-center">
                                                        {quantityChange !== null && quantityChange !== 0 ? (
                                                            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold gap-1
                                                                ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                                {isPositive ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                                                                {quantityChange} {quantityUnit}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    {/* Valor */}
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-600">
                                                             {/* A) Precio directo (CREATE) */}
                                                             {log.action.includes("CREATE") && log.metadata?.price ? (
                                                                 <span>{Number(log.metadata.price).toFixed(2)} €</span>
                                                             ) : 
                                                             /* B) Precio de changes (UPDATE) */
                                                             log.metadata?.changes?.find(c => c.includes('price'))?.split('->')[1] 
                                                                ? <span>{parseFloat(log.metadata.changes.find(c => c.includes('price')).split('->')[1]).toFixed(2)} €</span>
                                                                : <span className="text-gray-300 italic text-xs">--</span>
                                                             }
                                                        </div>
                                                    </td>

                                                    {/* Cambios (NUEVA COLUMNA RECUPERADA) */}
                                                    <td className="px-6 py-4 text-xs text-gray-500">
                                                        {log.metadata && log.metadata.changes && log.metadata.changes.length > 0 ? (
                                                            <ul className="space-y-1">
                                                                {log.metadata.changes.slice(0, 3).map((c, i) => ( // Limite de 3 para no saturar
                                                                    <li key={i} className="flex items-start text-gray-600 truncate max-w-[200px]" title={c}>
                                                                        <span className="mr-1.5 text-blue-400">•</span>
                                                                        <span>{c}</span>
                                                                    </li>
                                                                ))}
                                                                {log.metadata.changes.length > 3 && (
                                                                     <li className="text-[10px] text-blue-500 pl-3 pt-1 cursor-pointer">
                                                                        +{log.metadata.changes.length - 3} más...
                                                                     </li>
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-gray-300 text-[10px] italic">Sin detalle extra</span>
                                                        )}
                                                    </td>

                                                    {/* Origen / Documento */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className={`text-xs font-bold uppercase tracking-wide
                                                                ${origen === 'Albarán' ? 'text-indigo-700' : 'text-gray-600'}`}>
                                                                {origen === 'Albarán' ? 'INNOVA AGROSOLUCIONES' : 'EUROFRUITS AGRO'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 mt-0.5">
                                                                {origen === 'Albarán' 
                                                                    ? `Albarán ${new Date(log.createdAt).toLocaleDateString()}` 
                                                                    : 'Ajuste Manual'}
                                                            </span>
                                                        </div>
                                                    </td>


                                                    {/* Editado por */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">
                                                                {(log.userName || log.userEmail || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-gray-700 leading-none">
                                                                    {log.userName || log.userEmail || 'Usuario Sistema'}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
                                                                    {new Date(log.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Menu Actions (3 dots) */}
                                                    <td className="px-6 py-4 text-center">
                                                        <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                                            <FaEllipsisV className="text-xs" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                        <FaExchangeAlt className="text-gray-300" />
                                                    </div>
                                                    <span className="font-medium">No hay movimientos recientes</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                 
                {/* TAB CONTENT: DOCUMENTOS */}
                {activeTab === 'documentos' && (
                    <div className="p-6">
                        <AlbaranProcessor />
                    </div>
                )}
            
            </div>

            {/* --- SECCIONES ADICIONALES --- */}
            
            {/* 1. Registro de Actividades (Preserved Functionality) */}
            <div className="mb-8 animate-fadeIn">
                <InventoryLog />
            </div>

            {/* 2. Resumen Inventario Fitosanitarios (HIDDEN / COMENTADO) */}
            <InventorySummaryPhytosanitary />

        </div>
    );
};

export default DashBoard;