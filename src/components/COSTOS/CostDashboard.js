import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { 
    FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling, 
    FaBuilding, FaUserTie, FaTags, FaTrashAlt, FaEdit, FaTimes,
    FaPlus, FaBox, FaTractor, FaWarehouse, FaTools, FaEllipsisH,
    FaChevronRight, FaChevronLeft, FaSave
} from "react-icons/fa"; 
import { motion, AnimatePresence } from "framer-motion";

// Constantes
const COST_CATEGORIES = [
    { id: "productos", name: "Productos", icon: FaBox, color: "orange" },
    { id: "mano-obra", name: "Mano de Obra", icon: FaUserTie, color: "blue" },
    { id: "equipo", name: "Equipo", icon: FaTractor, color: "yellow" },
    { id: "infraestructuras", name: "Infraestructuras", icon: FaWarehouse, color: "purple" },
    { id: "servicios", name: "Servicios", icon: FaTools, color: "green" },
    { id: "otros", name: "Otros", icon: FaEllipsisH, color: "gray" },
];

const COLORS = ["#FF8042", "#0088FE", "#FFBB28", "#8884d8", "#00C49F", "#94a3b8"];

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();

// Componente DashboardCard reutilizable
const DashboardCard = ({ 
    title, 
    icon, 
    titleColor = 'text-gray-800', 
    className = '', 
    children,
    badge = null 
}) => (
    <div className={`
        bg-white 
        rounded-lg 
        shadow-sm 
        border border-gray-200
        hover:shadow-md 
        transition-all 
        duration-300 
        overflow-hidden
        ${className}
    `}>
        <div className={`
            flex items-center justify-between 
            px-5 py-4 
            border-b border-gray-100
            bg-gradient-to-r from-gray-50 to-white
        `}>
            <div className="flex items-center space-x-3">
                {icon && (
                    <div className={`
                        w-10 h-10 
                        rounded-lg 
                        bg-gradient-to-br from-gray-100 to-gray-50
                        flex items-center justify-center
                        text-xl
                        ${titleColor}
                    `}>
                        {icon}
                    </div>
                )}
                <h3 className={`text-base font-semibold ${titleColor}`}>
                    {title}
                </h3>
            </div>
            {badge && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {badge}
                </span>
            )}
        </div>
        
        <div className="p-5">
            {children}
        </div>
    </div>
);

// --- NUEVO: NewCostWizardModal ---
const NewCostWizardModal = ({ isOpen, onClose, onSave, projects, entities, workers, setErrorMessage }) => {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: '',
        project: '',
        entity: '',
        worker: '',
        description: '',
        // Campos específicos por categoría
        productType: '',
        quantity: '',
        unit: '',
        hours: '',
        ratePerHour: '',
        operation: '',
        equipmentType: '',
        equipmentUse: '',
        infrastructureType: '',
        area: '',
        serviceType: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStep(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedCategory(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const costAmount = parseFloat(formData.amount);
        if (isNaN(costAmount) || costAmount <= 0) {
            setErrorMessage("El monto debe ser un número positivo.");
            return;
        }

        setIsSaving(true);
        try {
            const costData = {
                date: formData.date,
                amount: costAmount,
                category: selectedCategory.name,
                project: formData.project || 'General',
                description: formData.description,
                createdAt: serverTimestamp(),
            };

            // Agregar campos específicos según categoría
            if (selectedCategory.id === 'productos') {
                costData.productType = formData.productType;
                costData.quantity = formData.quantity;
                costData.unit = formData.unit;
                costData.entity = formData.entity;
            } else if (selectedCategory.id === 'mano-obra') {
                costData.worker = formData.worker;
                costData.hours = parseFloat(formData.hours) || 0;
                costData.ratePerHour = parseFloat(formData.ratePerHour) || 0;
                costData.operation = formData.operation;
            } else if (selectedCategory.id === 'equipo') {
                costData.equipmentType = formData.equipmentType;
                costData.equipmentUse = formData.equipmentUse;
                costData.entity = formData.entity;
            } else if (selectedCategory.id === 'infraestructuras') {
                costData.infrastructureType = formData.infrastructureType;
                costData.area = formData.area;
                costData.entity = formData.entity;
            } else if (selectedCategory.id === 'servicios') {
                costData.serviceType = formData.serviceType;
                costData.entity = formData.entity;
            } else {
                costData.entity = formData.entity;
            }

            await onSave(costData);
            
            // Reset form
            setFormData({
                date: new Date().toISOString().split("T")[0],
                amount: '',
                project: '',
                entity: '',
                worker: '',
                description: '',
                productType: '',
                quantity: '',
                unit: '',
                hours: '',
                ratePerHour: '',
                operation: '',
                equipmentType: '',
                equipmentUse: '',
                infrastructureType: '',
                area: '',
                serviceType: '',
            });
            setStep(1);
            setSelectedCategory(null);
            onClose();
        } catch (error) {
            setErrorMessage("Error al guardar el coste: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const renderCategoryForm = () => {
        if (!selectedCategory) return null;

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comunes */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (sin IVA) * (€)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0.01"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto/Cultivo *</label>
                    <select
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Seleccionar Proyecto</option>
                        {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Campos específicos por categoría */}
                {selectedCategory.id === 'productos' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Producto</label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Fertilizantes">Fertilizantes</option>
                                    <option value="Semillas">Semillas</option>
                                    <option value="Pesticidas">Pesticidas</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <select
                                    name="entity"
                                    value={formData.entity}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar Proveedor</option>
                                    {entities.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    placeholder="kg, L, unidades..."
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </>
                )}

                {selectedCategory.id === 'mano-obra' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trabajador *</label>
                                <select
                                    name="worker"
                                    value={formData.worker}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar Trabajador</option>
                                    {workers.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Operación</label>
                                <input
                                    type="text"
                                    name="operation"
                                    value={formData.operation}
                                    onChange={handleInputChange}
                                    placeholder="Poda, Cosecha, Siembra..."
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Horas Trabajadas</label>
                                <input
                                    type="number"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    step="0.5"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tasa por Hora (€)</label>
                                <input
                                    type="number"
                                    name="ratePerHour"
                                    value={formData.ratePerHour}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </>
                )}

                {selectedCategory.id === 'equipo' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo</label>
                                <select
                                    name="equipmentType"
                                    value={formData.equipmentType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Tractor">Tractor</option>
                                    <option value="Herramientas">Herramientas</option>
                                    <option value="Maquinaria">Maquinaria</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uso</label>
                                <select
                                    name="equipmentUse"
                                    value={formData.equipmentUse}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Compra">Compra</option>
                                    <option value="Alquiler">Alquiler</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                            <select
                                name="entity"
                                value={formData.entity}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Seleccionar Proveedor</option>
                                {entities.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </>
                )}

                {selectedCategory.id === 'infraestructuras' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    name="infrastructureType"
                                    value={formData.infrastructureType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Invernadero">Invernadero</option>
                                    <option value="Sistema de Riego">Sistema de Riego</option>
                                    <option value="Almacén">Almacén</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área/Tamaño</label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 100 m²"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                            <select
                                name="entity"
                                value={formData.entity}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Seleccionar Proveedor</option>
                                {entities.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </>
                )}

                {selectedCategory.id === 'servicios' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Consultoría">Consultoría</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <select
                                    name="entity"
                                    value={formData.entity}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Seleccionar Proveedor</option>
                                    {entities.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>
                    </>
                )}

                {selectedCategory.id === 'otros' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                        <select
                            name="entity"
                            value={formData.entity}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Seleccionar Proveedor</option>
                            {entities.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                )}

                {/* Notas - común para todos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas/Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Detalles adicionales..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-between pt-4 border-t">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center"
                    >
                        <FaChevronLeft className="mr-2"/> Atrás
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-2 text-white font-bold rounded-lg transition flex items-center ${
                            isSaving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {isSaving ? "Guardando..." : "Guardar Coste"} <FaSave className="ml-2"/>
                    </button>
                </div>
            </form>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        >
                            <FaTimes className="text-2xl"/>
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b-2 border-green-200 pb-3 flex items-center">
                            <FaPlus className="mr-3 text-green-600"/> 
                            {step === 1 ? "Seleccionar categoría" : `Nuevo Registro - ${selectedCategory?.name}`}
                        </h2>

                        {/* Progress indicator */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                <span>Paso {step} de 2</span>
                                <span className="text-green-600">{step === 1 ? 'Categoría' : 'Detalles'}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(step / 2) * 100}%` }}
                                />
                            </div>
                        </div>

                        {step === 1 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {COST_CATEGORIES.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategorySelect(category)}
                                            className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex flex-col items-center space-y-3 group"
                                        >
                                            <div className={`w-16 h-16 rounded-full bg-${category.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`text-3xl text-${category.color}-600`}/>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 text-center">
                                                {category.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            renderCategoryForm()
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- SUB-COMPONENTE: EditCostModal (mantenido del original) ---
const EditCostModal = ({ cost, onClose, onSave, projects, entities, workers, setErrorMessage }) => {
    const [editData, setEditData] = useState({
        date: cost.date || new Date().toISOString().split("T")[0],
        description: cost.description || '',
        amount: cost.amount || 0, 
        category: cost.category || COST_CATEGORIES[0].name, 
        project: cost.project || 'General',
        entity: cost.entity || '',
        worker: cost.worker || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const costAmount = parseFloat(editData.amount);
        if (isNaN(costAmount) || costAmount <= 0) {
            setErrorMessage("El monto debe ser un número positivo.");
            return;
        }
        if (!editData.description.trim()) {
            setErrorMessage("La descripción no puede estar vacía.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(cost.id, {
                ...editData,
                amount: costAmount,
                entity: editData.entity.trim() || 'N/A', 
                worker: editData.worker.trim() || 'N/A', 
            });
            onClose();
        } catch (error) {
            setErrorMessage("Error al guardar la edición: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    <FaEdit className="inline mr-2 text-indigo-600"/> Editar Coste
                </h2>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                >
                    <FaTimes className="text-xl"/>
                </button>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Descripción:</label>
                        <input type="text" name="description" value={editData.description} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
                            <input type="date" name="date" value={editData.date} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
                            <input type="number" name="amount" value={editData.amount} onChange={handleInputChange} min="0.01" step="0.01" required className="w-full p-2 border rounded"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
                        <select name="category" value={editData.category} onChange={handleInputChange} required className="w-full p-2 border rounded">
                            {COST_CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
                            <select name="project" value={editData.project} onChange={handleInputChange} required className="w-full p-2 border rounded">
                                {projects.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
                            <select 
                                name="entity" 
                                value={editData.entity} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Seleccionar Entidad</option>
                                {entities.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 text-white font-bold rounded-lg transition duration-200 ${
                                isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente principal
const CostDashboardComponent = ({ db, userId, availableLocals, availableEntities, availableWorkers, timesheets = [] }) => {
    const [costs, setCosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showNewCostWizard, setShowNewCostWizard] = useState(false);
    const [editingCost, setEditingCost] = useState(null);

    // Preparar listas para selects
    const projectsForSelect = useMemo(() => {
        return ['General', ...availableLocals.map(l => l.name)];
    }, [availableLocals]);

    const entitiesForSelect = useMemo(() => {
        return availableEntities.map(e => e.name || e);
    }, [availableEntities]);

    const workersForSelect = useMemo(() => {
        return availableWorkers;
    }, [availableWorkers]);

    // Cargar costos desde Firebase
    useEffect(() => {
        if (!db || !userId) {
            setLoading(false);
            return;
        }

        const costsPath = `artifacts/${appId}/public/data/costs`;
        const q = query(
            collection(db, costsPath),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedCosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCosts(fetchedCosts);
            setLoading(false);
        }, (error) => {
            console.error("Error loading costs:", error);
            setErrorMessage("Error al cargar los costes.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    // Calcular costes de mano de obra desde timesheets
    const timesheetLaborCosts = useMemo(() => {
        let totalLaborCost = 0;
        const laborCostByProject = {};

        timesheets.forEach(record => {
            const totalHours = parseFloat(record.totalHours) || 0;
            const ratePerHour = parseFloat(record.ratePerHour) || 0;
            const workersCount = (record.workerNames?.length || (record.workerName ? 1 : 1));
            
            if (totalHours > 0 && ratePerHour > 0) {
                const cost = totalHours * ratePerHour * workersCount;
                totalLaborCost += cost;
                
                const projectName = record.localName || 'General';
                laborCostByProject[projectName] = (laborCostByProject[projectName] || 0) + cost;
            }
        });

        return {
            total: totalLaborCost,
            byProject: laborCostByProject
        };
    }, [timesheets]);

    // Calcular datos agregados COMBINANDO costes manuales + timesheets
    const { totalCost, distributionData, costByProject } = useMemo(() => {
        const categoryMap = COST_CATEGORIES.reduce((acc, cat) => {
            acc[cat.name] = 0;
            return acc;
        }, {});

        const projectMap = { 'General': 0 };

        let total = 0;

        // Sumar costes manuales
        costs.forEach(cost => {
            const amount = parseFloat(cost.amount) || 0;
            total += amount;
            
            if (categoryMap.hasOwnProperty(cost.category)) {
                categoryMap[cost.category] += amount;
            }

            const project = cost.project || 'General';
            projectMap[project] = (projectMap[project] || 0) + amount;
        });

        // SUMAR costes de mano de obra desde timesheets
        total += timesheetLaborCosts.total;
        categoryMap["Mano de Obra"] += timesheetLaborCosts.total;

        // Sumar costes de timesheets por proyecto
        Object.entries(timesheetLaborCosts.byProject).forEach(([project, cost]) => {
            projectMap[project] = (projectMap[project] || 0) + cost;
        });

        const chartData = Object.entries(categoryMap)
            .filter(([, cost]) => cost > 0)
            .map(([name, cost], index) => ({
                name,
                value: cost,
                color: COLORS[index % COLORS.length],
            }));

        return {
            totalCost: total,
            distributionData: categoryMap,
            costByProject: projectMap,
            chartData
        };
    }, [costs, timesheetLaborCosts]);

    // Funciones CRUD
    const handleAddCost = useCallback(async (newCostData) => {
        try {
            const costsPath = `artifacts/${appId}/public/data/costs`;
            await addDoc(collection(db, costsPath), {
                ...newCostData,
                userId,
                createdAt: serverTimestamp(),
            });
            setErrorMessage("");
        } catch (e) {
            console.error("Error adding cost:", e);
            setErrorMessage("Error al crear el coste.");
            throw e;
        }
    }, [db, userId]);

    const handleEditCost = useCallback(async (costId, updatedData) => {
        try {
            const costsPath = `artifacts/${appId}/public/data/costs`;
            await updateDoc(doc(db, costsPath, costId), updatedData);
            setErrorMessage("");
        } catch (e) {
            console.error("Error updating cost:", e);
            setErrorMessage("Error al actualizar el coste.");
            throw e;
        }
    }, [db]);

    const handleDeleteCost = useCallback(async (costId) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este coste?")) {
            return;
        }
        try {
            const costsPath = `artifacts/${appId}/public/data/costs`;
            await deleteDoc(doc(db, costsPath, costId));
            setErrorMessage("");
        } catch (e) {
            console.error("Error deleting cost:", e);
            setErrorMessage("Error al eliminar el coste.");
        }
    }, [db]);

    if (loading) {
        return <div className="p-8 text-center text-lg text-indigo-600 font-semibold">Cargando datos...</div>;
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            {/* Header con botón "Nuevo registro" */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <FaChartBar className="mr-3 text-4xl text-indigo-600"/> 
                    Análisis de Costes Empresarial
                </h1>
                <button
                    onClick={() => setShowNewCostWizard(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                >
                    <FaPlus className="mr-2"/> Nuevo registro
                </button>
            </header>

            {/* Mensaje de Error */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{errorMessage}</span>
                    <button onClick={() => setErrorMessage("")} className="absolute top-0 right-0 px-4 py-3">
                        <FaTimes/>
                    </button>
                </div>
            )}

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Tarjeta de Resumen */}
                <DashboardCard
                    title="Resumen de Costes"
                    icon={<FaEuroSign />}
                    titleColor="text-indigo-700"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Total de Costos Registrados</p>
                            <p className="text-4xl font-extrabold text-indigo-700 mt-2">
                                {totalCost.toFixed(2)} €
                            </p>
                            <div className="mt-3 pt-3 border-t border-indigo-200 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Costes Manuales:</span>
                                    <span className="font-semibold text-gray-700">
                                        {costs.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0).toFixed(2)} €
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Mano de Obra (Timesheets):</span>
                                    <span className="font-semibold text-gray-700">
                                        {timesheetLaborCosts.total.toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{costs.length} movimientos manuales + {timesheets.length} registros de tiempo</p>
                        </div>
                    </div>
                </DashboardCard>

                {/* Gráfico de Distribución */}
                <DashboardCard
                    title="Distribución por Categoría"
                    icon={<FaTags />}
                    titleColor="text-green-700"
                >
                    <div className="h-64">
                        {Object.values(distributionData).some(v => v > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(distributionData)
                                            .filter(([, cost]) => cost > 0)
                                            .map(([name, cost], index) => ({
                                                name,
                                                value: cost,
                                                color: COLORS[index % COLORS.length],
                                            }))}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {Object.entries(distributionData)
                                            .filter(([, cost]) => cost > 0)
                                            .map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 italic">
                                No hay datos para mostrar
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </div>

            {/* Tabla de Historial */}
            <DashboardCard
                title="Historial de Costes Manuales"
                icon={<FaTags />}
                titleColor="text-gray-800"
                badge={`${costs.length} registros`}
            >
                <div className="overflow-x-auto">
                    {costs.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-10">No hay costes manuales registrados.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalle</th>
                                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {costs.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-red-600">{cost.amount.toFixed(2)} €</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{cost.category}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-indigo-600 font-medium">{cost.project}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{cost.description}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => setEditingCost(cost)} 
                                                className="text-blue-500 hover:text-blue-700 transition"
                                                title="Editar"
                                            >
                                                <FaEdit className="text-lg"/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCost(cost.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Eliminar"
                                            >
                                                <FaTrashAlt className="text-lg"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </DashboardCard>

            {/* Modales */}
            <NewCostWizardModal
                isOpen={showNewCostWizard}
                onClose={() => {
                    setShowNewCostWizard(false);
                    setErrorMessage("");
                }}
                onSave={handleAddCost}
                projects={projectsForSelect}
                entities={entitiesForSelect}
                workers={workersForSelect}
                setErrorMessage={setErrorMessage}
            />

            {editingCost && (
                <EditCostModal
                    cost={editingCost}
                    onClose={() => {
                        setEditingCost(null);
                        setErrorMessage("");
                    }}
                    onSave={handleEditCost}
                    projects={projectsForSelect}
                    entities={entitiesForSelect}
                    workers={workersForSelect}
                    setErrorMessage={setErrorMessage}
                />
            )}
        </div>
    );
};

export const CostDashboard = memo(CostDashboardComponent);
