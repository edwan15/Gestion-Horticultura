import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiProductHuntFill, RiGalleryLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { VscSignIn, VscSignOut, VscArchive } from "react-icons/vsc";
import { FaPlusCircle, FaMinusCircle, FaSave, FaChevronDown, FaCheck, FaKeyboard, FaList } from "react-icons/fa"; // Añadimos FaCheck, FaChevronDown, FaKeyboard y FaList

// Lista de nombres de productos
const PRODUCT_NAMES = [
"ACIDO FOSFORICO 70%",
"ACCUDO",
"SWITCH",
"PROPLANT",
"ORGANOVIC-F",
"MIXSAP-PLUS",
"SEASUM MAX",
"LAITONE",
"MOLYBLUE",
"ATONIK",
"MICONIC MANVERT",
"ACIDO NITRICO",
"COTTON MULTIMAX",
"QROP MIX K PLUS CALCIUIM",
"VERIMARK",
"KYPRION",
"TRICHOBOT",
"AMIBOR",
"NATURPYR",
"ALTER K",
"CEREMONIA",
"COPPER",
"SPINTOR",
"MANZIC",
"COTTON MOJACID",
"TREND 90",
"KARDA",
"SPOTLIGTH PLUS",
];

const AnimatedCard = ({ children, title, icon: Icon }) => (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-100 mb-6"
>
<h2 className="flex items-center text-xl font-extrabold text-indigo-700 mb-4 border-b pb-2">
<Icon className="mr-2 text-2xl text-indigo-500" />
{title}
</h2>
{children}
</motion.div>
);

// Nuevo componente de Select Buscable
const SearchableSelect = ({ options, value, onChange, placeholder, name, icon: Icon }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Filtrar opciones basado en el término de búsqueda
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return options.filter(option => 
            option.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [searchTerm, options]);

    // Maneja el clic fuera para cerrar el desplegable
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    // Función para manejar la selección de una opción
    const handleSelectOption = (selectedValue) => {
        // Ejecutar el onChange con un objeto de evento simulado para React
        onChange({ target: { name, value: selectedValue } });
        setSearchTerm(''); // Limpiar el término de búsqueda al seleccionar
        setIsOpen(false);
    };

    // Texto a mostrar en el campo
    const displayValue = value ? value : placeholder;

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Campo principal (Input simulado) */}
            <label className="flex items-center mb-1 text-gray-700 font-medium">
                <Icon className="text-xl text-indigo-500 mr-2" /> Nombre:
            </label>
            <div 
                className={`flex items-center rounded-lg shadow-sm p-3 border w-full transition-all duration-200 cursor-pointer 
                    ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300 hover:border-indigo-400'} bg-white`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    name={`${name}-search`}
                    value={isOpen ? searchTerm : displayValue}
                    placeholder={placeholder}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className={`flex-grow outline-none border-none p-0 bg-transparent 
                        ${!value && !isOpen ? 'text-gray-500' : 'text-gray-800 font-medium'}`}
                    required={!value} // Requerido si no hay un valor seleccionado
                />
                <FaChevronDown className={`text-gray-400 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Lista desplegable animada */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {/* Opción Neutra (Deseleccionar) */}
                        {value && (
                            <li 
                                className="flex items-center justify-between p-3 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer border-b"
                                onClick={() => handleSelectOption("")} // Selecciona vacío
                            >
                                <span className="font-semibold">Limpiar Selección</span>
                            </li>
                        )}

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 transition-colors 
                                        ${option === value ? 'bg-indigo-100 font-bold text-indigo-800' : 'text-gray-700'}`}
                                    onClick={() => handleSelectOption(option)}
                                >
                                    {option}
                                    {option === value && <FaCheck className="text-indigo-600" />}
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-gray-500 italic">No se encontraron resultados.</li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

// Componente ProductForm modificado
const ProductForm = ({
product,
productImage,
imagePreview,
description,
setDescription,
handleInputChange,
handleImageChange,
saveProduct,
ingreso_cantidad,
egreso_cantidad,
total_price, // Nueva prop
handleStockChange,
}) => {
    // ... (otras lógicas como getNumericValue, baseEntradas, etc. se mantienen igual)
    const [isManualInput, setIsManualInput] = useState(false); // Estao para alternar entre input manual y select

    const getNumericValue = (value) => {
        const cleanedValue = String(value || 0).replace(',', '.');
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? 0 : number;
    };
    
    const baseEntradas = getNumericValue(product?.entradas);
    const baseSalidas = getNumericValue(product?.salidas);
    const baseStock = baseEntradas - baseSalidas;
    const ingresoDelta = getNumericValue(ingreso_cantidad);
    const egresoDelta = getNumericValue(egreso_cantidad);
    const stockFinal = baseStock + ingresoDelta - egresoDelta;

    const stockVariants = {
        blink: {
            scale: [1, 1.05, 1],
            color: stockFinal < 0 ? "#dc2626" : "#16a34a",
            transition: { duration: 0.5, repeat: 1 }
        },
    };

    const saveButtonVariants = {
        hover: { scale: 1.02, backgroundColor: "#dc2626", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
        tap: { scale: 0.98 },
    };


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto p-4 md:p-8"
        >
            <form onSubmit={saveProduct} className="w-full">
                <AnimatedCard title="Detalles del Producto" icon={RiProductHuntFill}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            {/* Uso del nuevo componente SearchableSelect */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                      {isManualInput ? "Ingreso Manual" : "Selección de Lista"}
                                   </span>
                                   <button
                                       type="button"
                                       onClick={() => setIsManualInput(!isManualInput)}
                                       className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                                   >
                                       {isManualInput ? <><FaList/> Ver Lista</> : <><FaKeyboard/> Escribir Manual</>}
                                   </button>
                                </div>

                                {isManualInput ? (
                                    <>
                                    <label className="flex items-center mb-1 text-gray-700 font-medium">
                                        <RiProductHuntFill className="text-xl text-indigo-500 mr-2" /> Nombre:
                                    </label>   
                                    <input
                                        className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border border-gray-300 w-full transition-all duration-200"
                                        type="text"
                                        placeholder="Escribe el nombre del producto..."
                                        name="name"
                                        value={product?.name || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    </>
                                ) : (
                                    <SearchableSelect
                                        options={PRODUCT_NAMES}
                                        value={product?.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="--- Seleccione un Producto ---"
                                        name="name"
                                        icon={RiProductHuntFill}
                                    />
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center mb-1 text-gray-700 font-medium">
                                    <BiCategoryAlt className="text-xl text-indigo-500 mr-2" /> Categoría:
                                </label>
                                <input
                                    required
                                    className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border border-gray-300 w-full transition-all duration-200"
                                    type="text"
                                    placeholder="Categoría del Producto"
                                    name="category"
                                    value={product?.category || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="flex items-center mb-1 text-gray-700 font-medium text-sm">
                                        Valor Total (Compra)
                                    </label>
                                    <input
                                        className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2 border border-green-200 w-full bg-green-50"
                                        type="text"
                                        placeholder="Total €"
                                        name="total_price"
                                        value={total_price}
                                        onChange={handleStockChange} // Usamos el handler de stock que tiene la lógica
                                    />
                                    <span className="text-[10px] text-gray-400">Calcula el unitario autom.</span>
                                </div>
                                <div>
                                    <label className="flex items-center mb-1 text-gray-700 font-medium text-sm">
                                        <span className="text-xl text-green-500 mr-2 font-bold">€</span> Coste Unitario:
                                    </label>
                                    <input
                                        className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 border border-gray-300 w-full transition-all duration-200"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        name="price"
                                        value={product?.price || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-start p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors duration-300">
                            <label className="flex items-center mb-2 font-bold text-gray-700">
                                <RiGalleryLine className="text-2xl text-indigo-500 mr-2" /> Imagen
                            </label>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-full flex flex-col items-center"
                            >
                                <input
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer mb-4"
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                />
                            </motion.div>
                            {imagePreview ? (
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={imagePreview}
                                    alt="product preview"
                                    className="max-w-full h-auto rounded-xl shadow-lg border-2 border-indigo-200 object-cover mt-2"
                                    style={{ maxHeight: "150px" }}
                                />
                            ) : (
                                <p className="text-center text-sm text-gray-400 mt-2">Sube una imagen para previsualizarla.</p>
                            )}
                        </div>
                    </div>
                </AnimatedCard>
                <AnimatedCard title="Gestión de Stock (Inventario)" icon={VscArchive}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">Historial Base</h4>
                            <div className="mb-3">
                                <label className="flex items-center mb-1 text-gray-600 text-sm">
                                    <VscSignIn className="text-xl text-green-600 mr-2" /> Entradas Totales:
                                </label>
                                <input
                                    className="outline-none rounded-md shadow-inner p-2 border border-gray-200 w-full bg-white text-lg font-bold"
                                    type="text"
                                    step="any"
                                    name="entradas"
                                    value={product?.entradas || 0}
                                    onChange={handleInputChange}
                                    readOnly={false}
                                />
                            </div>
                            <div>
                                <label className="flex items-center mb-1 text-gray-600 text-sm">
                                    <VscSignOut className="text-xl text-red-600 mr-2" /> Salidas Totales:
                                </label>
                                <input
                                    className="outline-none rounded-md shadow-inner p-2 border border-gray-200 w-full bg-white text-lg font-bold"
                                    type="text"
                                    step="any"
                                    name="salidas"
                                    value={product?.salidas || 0}
                                    onChange={handleInputChange}
                                    readOnly={false}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2 p-4 bg-white rounded-lg border border-indigo-200 shadow-md">
                            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-1">Transacción en Curso</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.01 }} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                                    <label className="flex items-center mb-1 text-gray-700 font-medium">
                                        <FaPlusCircle className="text-lg text-blue-600 mr-2" /> Cantidad a INGRESAR
                                    </label>
                                    <input
                                        className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 border border-blue-300 w-full text-xl font-bold"
                                        type="text"
                                        step="any"
                                        placeholder="0.0"
                                        name="ingreso_cantidad"
                                        value={ingreso_cantidad}
                                        onChange={handleStockChange}
                                    />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.01 }} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                                    <label className="flex items-center mb-1 text-gray-700 font-medium">
                                        <FaMinusCircle className="text-lg text-red-600 mr-2" /> Cantidad a EGRESAR
                                    </label>
                                    <input
                                        className="outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 p-2 border border-red-300 w-full text-xl font-bold"
                                        type="text"
                                        step="any"
                                        placeholder="0.0"
                                        name="egreso_cantidad"
                                        value={egreso_cantidad}
                                        onChange={handleStockChange}
                                    />
                                </motion.div>
                            </div>
                            <motion.div
                                animate={ingresoDelta !== 0 || egresoDelta !== 0 ? "blink" : ""}
                                variants={stockVariants}
                                className="mt-6 p-4 text-center border-4 rounded-xl shadow-inner w-full"
                                style={{
                                    borderColor: stockFinal < 0 ? '#fca5a5' : '#bbf7d0',
                                    backgroundColor: stockFinal < 0 ? '#fee2e2' : '#f0fff4',
                                }}
                            >
                                <p className="text-sm text-gray-700 font-medium mb-1">
                                    Base: <span className="font-bold text-indigo-700">{baseStock}</span>
                                    &bull; Transacción: <span className="text-green-500 font-bold">+{ingresoDelta}</span> / <span className="text-red-500 font-bold">-{egresoDelta}</span>
                                </p>
                                <div className="text-gray-700 text-xl font-extrabold flex justify-center items-center">
                                    STOCK FINAL:
                                    <motion.span
                                        className={`font-extrabold text-4xl ml-3`}
                                        style={{ color: stockFinal < 0 ? '#dc2626' : '#16a34a' }}
                                    >
                                        {stockFinal}
                                    </motion.span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedCard>
                <AnimatedCard title="Descripción Detallada" icon={BiCategoryAlt}>
                    <label className="mb-2 block text-gray-700 font-medium">Contenido:</label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={ProductForm.modules}
                        formats={ProductForm.formats}
                        className="w-full min-h-[12rem] sm:min-h-[10rem] mb-10 border-gray-300 rounded-lg shadow-md"
                    />
                </AnimatedCard>
                <div className="mt-8">
                    <motion.button
                        variants={saveButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="w-full p-4 bg-red-500 text-white text-xl font-extrabold rounded-xl shadow-xl transition-all duration-300 flex justify-center items-center"
                        type="submit"
                    >
                        <FaSave className="mr-3 text-2xl" /> GUARDAR PRODUCTO
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

ProductForm.modules = {
toolbar: [
[{ header: "1" }, { header: "2" }, { font: [] }],
[{ size: [] }],
["bold", "italic", "underline", "strike", "blockquote"],
[{ align: [] }],
[{ color: [] }, { background: [] }],
[
{ list: "ordered" },
{ list: "bullet" },
{ indent: "-1" },
{ indent: "+1" },
],
["clean"],
],
};
ProductForm.formats = [
"header",
"font",
"size",
"bold",
"italic",
"underline",
"strike",
"blockquote",
"color",
"background",
"list",
"bullet",
"indent",
"link",
"video",
"image",
"code-block",
"align",
];

export default ProductForm;

