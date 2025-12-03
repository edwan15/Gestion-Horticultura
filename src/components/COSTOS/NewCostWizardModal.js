import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBox, FaTractor, FaWarehouse, FaTools, FaEllipsisH,
    FaUserTie, FaPlus, FaTimes, FaChevronLeft, FaSave
} from "react-icons/fa";

// Constantes
const COST_CATEGORIES = [
    { id: "productos", name: "Productos", icon: FaBox, color: "orange" },
    { id: "mano-obra", name: "Mano de Obra", icon: FaUserTie, color: "blue" },
    { id: "equipo", name: "Equipo", icon: FaTractor, color: "yellow" },
    { id: "infraestructuras", name: "Infraestructuras", icon: FaWarehouse, color: "purple" },
    { id: "servicios", name: "Servicios", icon: FaTools, color: "green" },
    { id: "otros", name: "Otros", icon: FaEllipsisH, color: "gray" },
];

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

export default NewCostWizardModal;
