import React, { useEffect, useState } from "react";
import Search from "../../../search/Search";
import Loader from "../../../Util/Loader";
import { AiFillEye, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import "react-confirm-alert/src/react-confirm-alert.css";
import InventorySummaryCard from "../../Inventario/InventorySummaryCard"
import InventoryLog from "../../Inventario/InventoryLog";
import { motion, AnimatePresence } from "framer-motion";
import {
    deleteProduct,
    getProducts,
} from "../../../features/product/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    FILTER_PRODUCTS,
    selectFilteredProduct,
} from "../../../features/filter/FilterSearch";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import logoImg from "../../../asset/EuroLevante.webp";

applyPlugin(jsPDF);

// =======================================================
// 📌 CONSTANTES DE EXPORTACIÓN (Para fácil migración)
// =======================================================
const COMPANY_NAME = "FINCA EUROFRUITS AGRO - BALSICAS";
const INVENTORY_DETAIL = "REPORTE DE INVENTARIO GENERAL";
const LOGO_URL = "https://eurofruitslevante.com/wp-content/uploads/2025/07/euro-e1753695395199.webp";

// Selector para obtener el objeto de usuario y manejar el rol inicial
const selectAuthUser = (state) => state.auth.user;

// =======================================================
// 💎 COMPONENTE: Card Móvil Avanzada y Profesional
// =======================================================
const MobileProductCard = ({ product, index, shortenText, confirmDelate, userRole }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { _id, name, category, entradas, salidas, price } = product;
    const stock = entradas - salidas;
    const productValue = stock * (price || 0);

    const canEditOrDelete = userRole === "admin" || userRole === "usuario";
    const canDelete = userRole === "admin";
    
    // Configuración de colores según stock
    const stockConfig = stock > 5 
        ? { bg: "bg-green-100", text: "text-green-700", label: "Stock Alto" }
        : stock > 0 ? { bg: "bg-yellow-100", text: "text-yellow-700", label: "Stock Bajo" }
        : { bg: "bg-red-100", text: "text-red-700", label: "Agotado" };

    // Icono según categoría (Simulado)
    const getCategoryIcon = (cat) => {
        const firstLetter = cat ? cat.charAt(0).toUpperCase() : "?";
        const colors = {
            'Fitosanitarios': 'bg-green-500',
            'Fertilizantes': 'bg-yellow-500',
            'Trampas': 'bg-red-500',
            'Plantas': 'bg-purple-500',
            'Otros': 'bg-gray-500'
        };
        return (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${colors[cat] || colors['Otros']}`}>
                {firstLetter}
            </div>
        );
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 ${isExpanded ? 'ring-2 ring-blue-100' : ''}`}
        >
            {/* Fila Principal (Siempre visible) */}
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
            >
                {/* Icono */}
                <div className="flex-shrink-0">
                    {getCategoryIcon(category)}
                </div>

                {/* Info Principal */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                        {name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        {category}
                    </p>
                </div>

                {/* Stock y Chevron */}
                <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stockConfig.bg} ${stockConfig.text}`}>
                        {stock} Unds.
                    </span>
                    {/* Indicador visual de expansión */}
                    <motion.div 
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </motion.div>
                </div>
            </div>

            {/* Contenido Expandible */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 bg-gray-50/50"
                    >
                        <div className="p-4 space-y-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Valor Total</p>
                                    <p className="text-lg font-bold text-gray-800">{productValue.toFixed(2)} €</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Estado</p>
                                    <p className={`text-sm font-bold ${stockConfig.text}`}>{stockConfig.label}</p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2">
                                <Link 
                                    to={`/product-detail/${_id}`} 
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                                >
                                    <AiFillEye className="text-purple-500 text-lg" />
                                    <span>Ver</span>
                                </Link>
                                
                                {canEditOrDelete && (
                                    <Link 
                                        to={`/edit-product/${_id}`} 
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                                    >
                                        <BiEditAlt className="text-green-500 text-lg" />
                                        <span>Editar</span>
                                    </Link>
                                )}
                                
                                {canDelete && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelate(_id);
                                        }}
                                        className="flex-none p-2.5 bg-white border border-red-100 text-red-500 rounded-lg shadow-sm hover:bg-red-50 active:scale-95 transition-all"
                                    >
                                        <AiTwotoneDelete className="text-xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// =======================================================
// 📦 COMPONENTE: ProductList
// =======================================================
const ProductList = ({ products, isLoading }) => {
    // 1. Obtención de datos de autenticación y Redux
    const user = useSelector(selectAuthUser);
    const userRole = user?.role?.toLowerCase() || "invitado";
    const userId = user?.uid;
    const dispatch = useDispatch();

    // 2. Estados locales
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Fitosanitarios");
    const filteredProduct = useSelector(selectFilteredProduct);
    
    // 3. Variables de fecha
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // 4. Paginación
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffice, setItemOffice] = useState(0);
    const itemPerPage = 100;

    // 5. Efectos
    useEffect(() => {
        const endOffSet = itemOffice + itemPerPage;
        setCurrentItems(filteredProduct.slice(itemOffice, endOffSet));
        setPageCount(Math.ceil(filteredProduct.length / itemPerPage));
    }, [itemOffice, itemPerPage, filteredProduct]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemPerPage) % filteredProduct.length;
        setItemOffice(newOffset);
    };

    useEffect(() => {
        const fetchMode = userRole === "admin" || userRole === "invitado" ? "all" : "own";
        if (fetchMode === "all" || (fetchMode === "own" && userId)) {
            dispatch(getProducts({ 
                mode: fetchMode, 
                userId: fetchMode === "own" ? userId : undefined 
            }));
        }
    }, [dispatch, userRole, userId]);
    
    useEffect(() => {
        dispatch(FILTER_PRODUCTS({ products, search }));
    }, [products, search, dispatch]);

    // 6. Funciones auxiliares
    const shortenText = (text, n) => {
        if (text.length > n) {
            return text.substring(0, n).concat("...");
        }
        return text;
    };

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

    // --- Funciones de Exportación (Excel/PDF) ---
    const showExportError = (title, message) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [{ label: "Aceptar" }],
        });
    };

    const getBase64ImageFromURL = (url) => {
        return new Promise((resolve, reject) => {
            if (typeof document === 'undefined') {
                return resolve(""); 
            }
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };
    
    const ExportToExcel = () => {
        if (currentItems.length === 0) {
            showExportError("No hay datos", "La lista está vacía.");
            return;
        }
        
        const excelData = currentItems.map((product, index) => ({
            ID: index + 1,
            "Nombre": product.name,
            "Categoría": product.category,
            "Stock": product.entradas - product.salidas,
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, "Inventario");
        XLSX.writeFile(wb, "Inventario.xlsx");
    };

    const ExportToPDF = async () => {
        if (isLoading || currentItems.length === 0) return;
        
        // Ordenar items por stock (Mayor a menor)
        const sortedItems = [...currentItems].sort((a, b) => {
            const stockA = (a.entradas || 0) - (a.salidas || 0);
            const stockB = (b.entradas || 0) - (b.salidas || 0);
            return stockB - stockA;
        });

        const doc = new jsPDF();

        // 1. Agregar Logo
        try {
            const logoBase64 = await getBase64ImageFromURL(logoImg);
            // x, y, width, height (Ajustado a 40x25 para dar más anchura)
            doc.addImage(logoBase64, "PNG", 15, 10, 40, 25); 
        } catch (error) {
            console.warn("Error cargando logo:", error);
        }

        // 2. Encabezados de Texto
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(COMPANY_NAME, 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(INVENTORY_DETAIL, 105, 28, { align: "center" });

        // 3. Tabla
        doc.autoTable({
            head: [["ID", "Nombre", "Categoría", "Stock"]],
            body: sortedItems.map((p, i) => [i + 1, p.name, p.category, (p.entradas || 0) - (p.salidas || 0)]),
            startY: 40, // Dejar espacio para logo y títulos
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] }, // Verde estilo Excel/Agrario
            styles: { fontSize: 8 }
        });
        
        doc.save("Inventario.pdf");
    };

    // --- Renderizado ---
    return (
        <div className="px-0 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm py-4 mb-6 shadow-sm px-4 sm:px-0 sm:static sm:bg-transparent sm:shadow-none sm:py-0 transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-l-4 border-blue-500 pl-3 w-full sm:w-auto">
                        Gestión de Inventario
                    </h2>
                    <div className="w-full sm:w-auto">
                        <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            {isLoading && <Loader />}

            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUMNA 1: Tarjeta de Resumen (Wisecrop Style) */}
                    <div className="space-y-6">
                        <InventorySummaryCard 
                            products={products} 
                            onCategorySelect={setSelectedCategory}
                            selectedCategory={selectedCategory}
                        />
                        <InventoryLog />
                    </div>

                    {/* COLUMNA 2: Lista de Productos (Card con Scroll) */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-blue-600">📋</span>
                                Listado de Productos
                            </h3>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {filteredProduct.length} items
                            </span>
                        </div>

                        {/* Contenedor con Scroll */}
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <p>No hay productos registrados.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Vista Desktop (Tabla Compacta) */}
                                    <table className="w-full text-sm text-left text-gray-500 hidden sm:table">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0  ">
                                            <tr>
                                                <th className="px-4 py-3">Producto</th>
                                                <th className="px-4 py-3 text-center">Categoría</th>
                                                <th className="px-4 py-3 text-center">Stock</th>
                                                <th className="px-4 py-3 text-center">Acciones</th>
                                            </tr> 
                                        </thead>
                                        <tbody>
                                            {currentItems.map((product) => {
                                                const stock = product.entradas - product.salidas;
                                                const stockColor = stock <= 0 ? "text-red-600 bg-red-50" : stock < 10 ? "text-yellow-600 bg-yellow-50" : "text-green-600 bg-green-50";
                                                
                                                return (
                                                    <tr key={product._id} className="bg-white border-b hover:bg-gray-50 transition">
                                                        <td className="px-4 py-3 font-medium text-gray-900">
                                                            {shortenText(product.name, 20)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                                                {shortenText(product.category, 10)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${stockColor}`}>
                                                                {stock}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <Link to={`/product-detail/${product._id}`} className="text-purple-500 hover:text-purple-700">
                                                                    <AiFillEye size={18} />
                                                                </Link>
                                                                {(userRole === "admin" || userRole === "usuario") && (
                                                                    <Link to={`/edit-product/${product._id}`} className="text-green-500 hover:text-green-700">
                                                                        <BiEditAlt size={18} />
                                                                    </Link>
                                                                )}
                                                                {userRole === "admin" && (
                                                                    <button onClick={() => confirmDelate(product._id)} className="text-red-500 hover:text-red-700">
                                                                        <AiTwotoneDelete size={18} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Vista Móvil (Cards Compactas) */}
                                    <div className="sm:hidden space-y-3 px-4 sm:px-0">
                                        {currentItems.map((product, index) => (
                                            <MobileProductCard 
                                                key={product._id} 
                                                product={product} 
                                                index={index} 
                                                shortenText={shortenText} 
                                                confirmDelate={confirmDelate} 
                                                userRole={userRole} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer de la Card de Lista (Paginación Compacta) */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-center">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={2}
                                pageCount={pageCount}
                                previousLabel="<"
                                renderOnZeroPageCount={null}
                                containerClassName="flex gap-2 text-sm"
                                activeClassName="bg-blue-600 text-white rounded-md"
                                pageClassName="px-3 py-1 border rounded-md hover:bg-gray-200 bg-white"
                                previousClassName="px-3 py-1 border rounded-md hover:bg-gray-200 bg-white"
                                nextClassName="px-3 py-1 border rounded-md hover:bg-gray-200 bg-white"
                                disabledClassName="opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Botones de Exportación Flotantes o al final */}
            <div className="flex justify-end mt-6 gap-3 px-4 sm:px-0">
                <button onClick={ExportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm text-sm font-medium transition">
                    <SiMicrosoftexcel /> Excel
                </button>
                <button onClick={ExportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm text-sm font-medium transition">
                    PDF
                </button>
            </div>
        </div>
    );
};

export default ProductList;