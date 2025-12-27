import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBox, FaGlobe, FaPaperclip, FaFileInvoice, FaTimes, FaPlus,
    FaTrash, FaChevronDown, FaCheck, FaUserTie, FaTractor, FaWarehouse, FaTools, FaEllipsisH, FaChevronLeft
} from "react-icons/fa";

// Constantes de Categoría (Restauradas)
const COST_CATEGORIES = [
    { id: "productos", name: "Productos", icon: FaBox, color: "orange" },
    { id: "mano-obra", name: "Mano de Obra", icon: FaUserTie, color: "blue" },
    { id: "equipo", name: "Equipo", icon: FaTractor, color: "yellow" },
    { id: "infraestructuras", name: "Infraestructuras", icon: FaWarehouse, color: "purple" },
    { id: "servicios", name: "Servicios", icon: FaTools, color: "green" },
    { id: "otros", name: "Otros", icon: FaEllipsisH, color: "gray" },
];

/**
 * COMPONENTS HELPERS
 */
const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-2 pb-2 transition-colors relative min-w-[80px]
        ${active ? "text-emerald-500 font-medium" : "text-gray-400 hover:text-gray-600"}`}
    >
        <div className={`p-3 rounded-full border-2 transition-all
            ${active ? "bg-emerald-50 border-emerald-500 text-emerald-500" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            <Icon className="text-xl" />
        </div>
        <span className="text-sm">{label}</span>
        {active && (
            <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
            />
        )}
    </button>
);

const InputField = ({ label, required, ...props }) => (
    <div className="w-full">
        {label && (
            <label className="block text-xs font-semibold text-gray-500 mb-1">
                {label} {required && "*"}
            </label>
        )}
        <input
            className="w-full p-2.5 bg-white border-b-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors text-gray-700 text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400"
            {...props}
        />
    </div>
);

const SelectField = ({ label, required, options = [], ...props }) => (
    <div className="w-full">
         {label && (
            <label className="block text-xs font-semibold text-gray-500 mb-1">
                {label} {required && "*"}
            </label>
        )}
        <div className="relative">
            <select
                className="w-full p-2.5 bg-white border-b-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors text-gray-700 text-sm font-medium appearance-none cursor-pointer"
                {...props}
            >
                {props.children}
            </select>
            <FaChevronDown className="absolute right-2 top-3 text-gray-400 text-xs pointer-events-none" />
        </div>
    </div>
);


const NewCostWizardModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    projects = [], 
    entities = [], 
    workers = [],
    products = [], 
    warehouses = [],
    crops = [],
    setErrorMessage 
}) => {
    
    // --- STEP & CATEGORY STATE ---
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [activeTab, setActiveTab] = useState("documento");
    const [isSaving, setIsSaving] = useState(false);

    // --- STATE: DOCUMENTO (Productos/Entrada) ---
    const [docData, setDocData] = useState({
        code: "",
        providerId: "",
        date: new Date().toISOString().slice(0, 16),
        totalValue: "",
        totalValueWithTax: "", 
        isPaid: false,
        notes: ""
    });

    const [prodHeader, setProdHeader] = useState({ warehouseId: "", movementType: "" });
    const [productItems, setProductItems] = useState([]);
    const [serviceItems, setServiceItems] = useState([]);
    const [attachmentItems, setAttachmentItems] = useState([]);

    // --- STATE: STANDARD FORM (Otros) ---
    const [standardFormData, setStandardFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: '',
        project: '',
        entity: '',
        worker: '',
        description: '',
        hours: '',
        ratePerHour: '',
        operation: ''
    });

    // --- HANDLERS: CATEGORY & NAVIGATION ---
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedCategory(null);
    };

    // --- HANDLERS: STANDARD FORM ---
    const handleStandardInputChange = (e) => {
        const { name, value } = e.target;
        setStandardFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLERS DOCUMENTO ---
    const handleDocChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDocData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // --- HANDLERS PRODUCTOS ---
    const addProductItem = () => {
        setProductItems([...productItems, {
            id: Date.now(),
            productId: "",
            qty: "",
            unit: "kg",
            totalVal: "",
            tax: 0,
            unitPrice: 0,
            batch: "",
            date: new Date().toISOString().slice(0, 16),
            totalWithTax: 0
        }]);
    };

    const removeProductItem = (id) => {
        setProductItems(prev => prev.filter(item => item.id !== id));
    };

    const handleProductItemChange = (id, field, value) => {
        setProductItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            const updated = { ...item, [field]: value };

            // Calculations
            if (['qty', 'totalVal', 'tax'].includes(field)) {
                const qty = parseFloat(field === 'qty' ? value : item.qty) || 0;
                const total = parseFloat(field === 'totalVal' ? value : item.totalVal) || 0;
                const tax = parseFloat(field === 'tax' ? value : item.tax) || 0;

                updated.totalWithTax = parseFloat((total * (1 + tax / 100)).toFixed(2));
                updated.unitPrice = qty > 0 ? parseFloat((total / qty).toFixed(2)) : 0;
            }
            return updated;
        }));
    };

    // --- HANDLERS SERVICIOS ---
    const addServiceItem = () => {
        setServiceItems([...serviceItems, {
            id: Date.now(),
            category: "",
            type: "",
            description: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            value: "",
            tax: 0,
            valueWithTax: 0,
            quantity: 1,
            associatedCrops: []
        }]);
    };

    const removeServiceItem = (id) => {
        setServiceItems(prev => prev.filter(item => item.id !== id));
    };

    const handleServiceItemChange = (id, field, value) => {
        setServiceItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            const updated = { ...item, [field]: value };
            
            if (['value', 'tax'].includes(field)) {
                const val = parseFloat(field === 'value' ? value : item.value) || 0;
                const tax = parseFloat(field === 'tax' ? value : item.tax) || 0;
                updated.valueWithTax = parseFloat((val * (1 + tax / 100)).toFixed(2));
            }

            return updated;
        }));
    };

    const toggleCropAssociation = (itemId, cropId) => {
        setServiceItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            const current = item.associatedCrops || [];
            const exists = current.includes(cropId);
            return {
                ...item,
                associatedCrops: exists 
                    ? current.filter(id => id !== cropId)
                    : [...current, cropId]
            };
        }));
    };

    // --- HANDLERS ANEXOS ---
    const addAttachment = () => {
        setAttachmentItems([...attachmentItems, {
            id: Date.now(),
            file: null, // Placeholder for file logic
            description: ""
        }]);
    };
    
    const removeAttachment = (id) => {
         setAttachmentItems(prev => prev.filter(item => item.id !== id));
    };


    // --- SUBMISSION ---
    const handleSubmit = async () => {
        setIsSaving(true);
        setErrorMessage("");
        
        try {
            const promises = [];

            if (selectedCategory && selectedCategory.id === 'productos') {
                // --- PROCESAR PRODUCTOS FORM ---
                
                // 1. Productos
                productItems.forEach(prod => {
                    if (!prod.productId || !prod.totalVal) return;
                    const productMeta = products.find(p => p.id === prod.productId);
                    
                    promises.push(onSave({
                        date: prod.date,
                        amount: parseFloat(prod.totalVal),
                        category: 'Productos',
                        project: prodHeader.warehouseId ? warehouses.find(w => w.id === prodHeader.warehouseId)?.name : 'General',
                        description: `[DOC-${docData.code}] ${productMeta?.name} - ${docData.notes}`,
                        entity: docData.providerId,
                        
                        productType: productMeta?.category || 'General',
                        productId: prod.productId,
                        quantity: parseFloat(prod.qty),
                        unit: prod.unit,
                        unitPrice: prod.unitPrice,
                        tax: prod.tax,
                        totalWithTax: prod.totalWithTax,
                        batch: prod.batch,
                        warehouseId: prodHeader.warehouseId,
                        movementType: prodHeader.movementType
                    }));
                });

                // 2. Servicios
                serviceItems.forEach(srv => {
                    if (!srv.category || !srv.value) return;
                    const cropNames = srv.associatedCrops.map(cid => crops.find(c => c.id === cid)?.name).join(", ");

                    promises.push(onSave({
                        date: srv.startDate,
                        amount: parseFloat(srv.value),
                        category: 'Servicios',
                        project: 'General', 
                        description: `[DOC-${docData.code}] ${srv.description} - Cultivos: ${cropNames}`,
                        entity: docData.providerId,
                        
                        serviceCategory: srv.category,
                        serviceType: srv.type,
                        startDate: srv.startDate,
                        endDate: srv.endDate,
                        tax: srv.tax,
                        totalWithTax: srv.valueWithTax,
                        associatedCrops: srv.associatedCrops
                    }));
                });

                // Fallback si solo hay cabecera
                if (promises.length === 0 && (docData.totalValue)) {
                    promises.push(onSave({
                        date: docData.date,
                        amount: parseFloat(docData.totalValue || 0),
                        category: 'Productos', // Generic
                        project: 'General',
                        description: `[DOC-${docData.code}] ${docData.notes}`,
                        entity: docData.providerId,
                        isPaid: docData.isPaid
                    }));
                }

            } else {
                 // --- PROCESAR STANDARD FORM ---
                const costAmount = parseFloat(standardFormData.amount);
                if (isNaN(costAmount) || costAmount <= 0) throw new Error("El monto debe ser positivo.");

                const costData = {
                    date: standardFormData.date,
                    amount: costAmount,
                    category: selectedCategory.name,
                    project: standardFormData.project || 'General',
                    description: standardFormData.description,
                    entity: standardFormData.entity
                };

                if (selectedCategory.id === 'mano-obra') {
                    costData.worker = standardFormData.worker;
                    costData.hours = parseFloat(standardFormData.hours);
                    costData.ratePerHour = parseFloat(standardFormData.ratePerHour);
                    costData.operation = standardFormData.operation;
                }

                promises.push(onSave(costData));
            }

            await Promise.all(promises);
            onClose();
            // Reset state
            setStep(1);
            setSelectedCategory(null);
            setProductItems([]);
            setServiceItems([]);

        } catch (error) {
            console.error(error);
            setErrorMessage("Error al guardar: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };


    // --- RENDERERS ---

    const renderProductLayout = () => (
        <>
            {/* TABS UTILITY BAR */}
            <div className="flex justify-center items-end gap-12 pt-6 pb-2 px-6 border-b border-gray-100 bg-white">
                <TabButton active={activeTab === 'documento'} icon={FaFileInvoice} label="Documento" onClick={() => setActiveTab('documento')} />
                <TabButton active={activeTab === 'productos'} icon={FaBox} label="Productos" onClick={() => setActiveTab('productos')} />
                <TabButton active={activeTab === 'servicios'} icon={FaGlobe} label="Servicios" onClick={() => setActiveTab('servicios')} />
                <TabButton active={activeTab === 'anexos'} icon={FaPaperclip} label="Anexos" onClick={() => setActiveTab('anexos')} />
            </div>

            {/* CONTENT SCROLLABLE */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white min-h-[400px]">
                
                {/* --- TAB: DOCUMENTO --- */}
                {activeTab === 'documento' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <InputField label="Cód. Documento" name="code" value={docData.code} onChange={handleDocChange} />
                            <SelectField label="Proveedor" name="providerId" value={docData.providerId} onChange={handleDocChange}>
                                <option value="">---------</option>
                                {entities.map(e => <option key={e.id} value={e.id}>{e.name || e}</option>)}
                            </SelectField>
                        </div>
                        <div className="border-t border-gray-200 my-4"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-600">
                            <InputField label="Fecha" required type="datetime-local" name="date" value={docData.date} onChange={handleDocChange}/>
                            <InputField label="Valor Total (sin IVA)" required type="number" name="totalValue" value={docData.totalValue} onChange={handleDocChange} placeholder="0"/>
                            <InputField label="Valor Total (con IVA)" type="number" name="totalValueWithTax" value={docData.totalValueWithTax} onChange={handleDocChange} placeholder="0" readOnly={true} />
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${docData.isPaid ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}
                                    onClick={() => setDocData(p => ({...p, isPaid: !p.isPaid}))}>
                                    {docData.isPaid && <FaCheck className="text-white text-xs"/>}
                            </div>
                            <span className="text-sm font-medium text-gray-500">Pagado</span>
                        </div>

                        <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Notas</label>
                                <textarea name="notes" value={docData.notes} onChange={handleDocChange} rows={2} className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-emerald-500 outline-none resize-none text-sm"/>
                        </div>
                    </div>
                )}

                {/* --- TAB: PRODUCTOS --- */}
                {activeTab === 'productos' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <SelectField label="Almacén (Destino)" value={prodHeader.warehouseId} onChange={e => setProdHeader(prev => ({...prev, warehouseId: e.target.value}))}>
                                <option value="">---------</option>
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </SelectField>
                            <SelectField label="Tipo de movimiento" value={prodHeader.movementType} onChange={e => setProdHeader(prev => ({...prev, movementType: e.target.value}))}>
                                <option value="">---------</option>
                                <option value="Compra">Compra</option>
                                <option value="Transferencia">Transferencia</option>
                            </SelectField>
                        </div>
                        <div className="border-t border-gray-200"></div>

                        {/* Product List */}
                        <div className="space-y-10">
                            {productItems.map((item) => (
                                <div key={item.id} className="relative group">
                                    <button onClick={() => removeProductItem(item.id)} className="absolute -right-2 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><FaTrash/></button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div className="col-span-1">
                                            <SelectField label="Producto" required value={item.productId} onChange={(e) => handleProductItemChange(item.id, 'productId', e.target.value)}>
                                                    <option value="">---------</option>
                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </SelectField>
                                        </div>
                                        
                                        <div className="col-span-1 grid grid-cols-2 gap-4 items-end">
                                                <div className="flex gap-2">
                                                <InputField label="Cantidad adquirida" required type="number" value={item.qty} onChange={(e) => handleProductItemChange(item.id, 'qty', e.target.value)} placeholder="0"/>
                                                <div className="w-20 pt-6">
                                                    <SelectField value={item.unit} onChange={(e) => handleProductItemChange(item.id, 'unit', e.target.value)}>
                                                        <option value="kg">kg</option>
                                                        <option value="L">L</option>
                                                        <option value="un">un</option>
                                                    </SelectField>
                                                </div>
                                                </div>
                                        </div>

                                        <div className="col-span-1 grid grid-cols-2 gap-4">
                                            <InputField label="Valor Total" required type="number" value={item.totalVal} onChange={(e) => handleProductItemChange(item.id, 'totalVal', e.target.value)} placeholder="0" />
                                            <div className="flex gap-2">
                                                    <div className="w-16">
                                                    <InputField label="IVA" required type="number" value={item.tax} onChange={(e) => handleProductItemChange(item.id, 'tax', e.target.value)} placeholder="0" />
                                                    </div>
                                                    <div className="pt-6 flex-1 bg-gray-50 flex items-center px-2 text-gray-500 text-sm">%</div>
                                            </div>
                                        </div>

                                        <div className="col-span-1 grid grid-cols-2 gap-4">
                                            <InputField label="Valor Total (con IVA)" required type="number" value={item.totalWithTax} readOnly placeholder="0" />
                                            <InputField label="Valor por unidad" required type="text" value={`${item.unitPrice} €/${item.unit}`} readOnly placeholder="0" />
                                        </div>

                                        <div className="col-span-1">
                                                <InputField label="Lote" value={item.batch} onChange={(e) => handleProductItemChange(item.id, 'batch', e.target.value)} />
                                        </div>
                                        <div className="col-span-1">
                                                <InputField label="Fecha de Recepción" required type="datetime-local" value={item.date} onChange={(e) => handleProductItemChange(item.id, 'date', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-100 mt-6 mb-2"></div>
                                </div>
                            ))}

                            <button onClick={addProductItem} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                                <FaPlus/> Añadir nuevo
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TAB: SERVICIOS --- */}
                {activeTab === 'servicios' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {serviceItems.map((item) => (
                            <div key={item.id} className="relative group space-y-6">
                                <button onClick={() => removeServiceItem(item.id)} className="absolute -right-2 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><FaTrash/></button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <SelectField label="Categoría" required value={item.category} onChange={(e) => handleServiceItemChange(item.id, 'category', e.target.value)}>
                                        <option value="">---------</option>
                                        <option value="Maquinaria">Maquinaria</option>
                                        <option value="Mano de Obra">Mano de Obra</option>
                                        <option value="Consultoría">Consultoría</option>
                                    </SelectField>
                                    <SelectField label="Tipo" required value={item.type} onChange={(e) => handleServiceItemChange(item.id, 'type', e.target.value)}>
                                        <option value="">---------</option>
                                        <option value="General">General</option>
                                        <option value="Específico">Específico</option>
                                    </SelectField>
                                </div>

                                <InputField label="Descripción" value={item.description} onChange={(e) => handleServiceItemChange(item.id, 'description', e.target.value)} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <InputField label="Fecha de Inicio" required type="date" value={item.startDate} onChange={(e) => handleServiceItemChange(item.id, 'startDate', e.target.value)} />
                                    <InputField label="Fecha Final" required type="date" value={item.endDate} onChange={(e) => handleServiceItemChange(item.id, 'endDate', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InputField label="Valor" required type="number" value={item.value} onChange={(e) => handleServiceItemChange(item.id, 'value', e.target.value)} placeholder="0" />
                                        <InputField label="IVA" required type="number" value={item.tax} onChange={(e) => handleServiceItemChange(item.id, 'tax', e.target.value)} placeholder="0" />
                                        <InputField label="Valor (con IVA)" required type="number" value={item.valueWithTax} readOnly placeholder="0" />
                                </div>

                                <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">Cultivos asociados</label>
                                        <div className="flex flex-wrap gap-2">
                                            {crops.map(crop => (
                                                <div 
                                                    key={crop.id}
                                                    onClick={() => toggleCropAssociation(item.id, crop.id)}
                                                    className={`px-3 py-1 rounded-full text-xs cursor-pointer border select-none transition-colors
                                                    ${item.associatedCrops?.includes(crop.id) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-400'}`}
                                                >
                                                    {crop.name}
                                                </div>
                                            ))}
                                        </div>
                                </div>
                                <div className="border-b border-gray-100 mt-6 mb-2"></div>
                            </div>
                        ))}
                        <button onClick={addServiceItem} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            <FaPlus/> Añadir nuevo
                        </button>
                    </div>
                )}

                    {/* --- TAB: ANEXOS --- */}
                    {activeTab === 'anexos' && (
                    <div className="space-y-8 animate-in fade-in duration-300 min-h-[200px]">
                            {attachmentItems.length === 0 && <p className="text-gray-400 text-sm italic">No hay anexos.</p>}
                            {attachmentItems.map(item => (
                                <div key={item.id} className="relative group grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <button onClick={() => removeAttachment(item.id)} className="absolute -right-2 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><FaTrash/></button>
                                    <div className="flex items-center gap-3">
                                            <FaPaperclip className="text-gray-400 text-xl"/>
                                            <span className="text-sm text-emerald-600 underline cursor-pointer">Adjuntar archivo o foto</span>
                                    </div>
                                    <InputField label="Descripción" value={item.description} onChange={(e) => {
                                            setAttachmentItems(prev => prev.map(a => a.id === item.id ? {...a, description: e.target.value} : a));
                                    }} />
                                </div>
                            ))}
                            <button onClick={addAttachment} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-4">
                            <FaPlus/> Añadir nuevo
                        </button>
                    </div>
                    )}

            </div>
        </>
    );

    const renderStandardForm = () => (
        <div className="p-8 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                        <input type="date" name="date" value={standardFormData.date} onChange={handleStandardInputChange} required className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto * (€)</label>
                        <input type="number" name="amount" value={standardFormData.amount} onChange={handleStandardInputChange} required className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select name="project" value={standardFormData.project} onChange={handleStandardInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">Seleccionar</option>
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
             
             {selectedCategory.id === 'mano-obra' && (
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Trabajador</label>
                         <select name="worker" value={standardFormData.worker} onChange={handleStandardInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                             <option value="">Seleccionar</option>
                             {workers.map(w => <option key={w} value={w}>{w}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Horas</label>
                         <input type="number" name="hours" value={standardFormData.hours} onChange={handleStandardInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
                     </div>
                 </div>
             )}
             
             <textarea name="description" value={standardFormData.description} onChange={handleStandardInputChange} placeholder="Descripción..." className="w-full p-2 border border-gray-300 rounded-lg" rows="3"/>
        </div>
    );


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.98, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.98, opacity: 0, y: 20 }}
                        className="bg-white w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl rounded-none md:rounded-lg overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                             <h2 className="text-lg font-medium text-emerald-600 flex items-center gap-2">
                                {step > 1 && (
                                    <button onClick={handleBack} className="text-gray-400 hover:text-emerald-600 mr-2">
                                        <FaChevronLeft />
                                    </button>
                                )}
                                {step === 1 ? "Seleccionar categoría" : 
                                 selectedCategory?.id === 'productos' ? "Documento - Entrada" : `Nuevo Registro - ${selectedCategory?.name}`}
                             </h2>
                             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                 <FaTimes className="text-xl"/>
                             </button>
                        </div>

                         {/* CONTENT AREA */}
                         <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                             {step === 1 && (
                                 <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                                     {COST_CATEGORIES.map((category) => {
                                        const Icon = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategorySelect(category)}
                                                className="p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col items-center space-y-4 group"
                                            >
                                                <div className={`w-16 h-16 rounded-full bg-${category.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                    <Icon className={`text-3xl text-${category.color}-500`}/>
                                                </div>
                                                <span className="text-base font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                                                    {category.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                 </div>
                             )}

                            {step === 2 && (
                                selectedCategory?.id === 'productos' ? renderProductLayout() : renderStandardForm()
                            )}
                         </div>

                        {/* FOOTER - Solo mostrar en paso 2 */}
                        {step === 2 && (
                            <div className="p-4 bg-emerald-500 flex justify-between items-center text-white">
                                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium text-sm transition-colors">
                                    Borrar
                                </button>
                                <div className="flex gap-3">
                                    <button onClick={onClose} className="hover:text-emerald-100 font-medium text-sm px-4 transition-colors">
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={isSaving}
                                        className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-2 rounded font-bold text-sm shadow-sm transition-colors disabled:opacity-75"
                                    >
                                        {isSaving ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewCostWizardModal;
