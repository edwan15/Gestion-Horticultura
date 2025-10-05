import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones de Firebase simuladas (asume que están instaladas)
import { 
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

// =======================================================================
// === 2. LÓGICA DE CARGA DE SCRIPTS EXTERNOS (DESPUÉS DE IMPORTS) ===
// =======================================================================
const loadScript = (src) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    }
};

// Cargar html2canvas y jspdf (UMD)
loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.js");


// === VARIABLES GLOBALES ===
const appId = 'default-app-id'; // ID usado en la ruta de la colección

// Solución al error 'no-undef'. Accede de forma segura a la variable global 'window'
const initialAuthToken = 
    (typeof window !== 'undefined' && window.__initial_auth_token) 
    ? window.__initial_auth_token 
    : null;

// ASUMIMOS QUE 'db' y 'auth' ESTÁN DISPONIBLES
const db = typeof window.db !== 'undefined' ? window.db : getFirestore(); 
const auth = typeof window.auth !== 'undefined' ? window.auth : getAuth(); 
// =======================================================================


// === CONSTANTES Y UTILIDADES ===
const HOURLY_COST_RATE = 15.5;

const formatNumber = (amount, decimals = 2) => {
    const numericAmount = parseFloat(amount) || 0;
    return numericAmount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const newProductId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

// === SUB-COMPONENTES DE UI ===
const InputField = ({ label, type, value, field, item, handleItemChange, placeholder }) => {
    // Manejo especial para InputField dentro de ProductItemForm vs. CalculatorView
    const isCostField = field === 'numWorkers' || field === 'hoursWorked';

    const displayValue = value === null || value === undefined ? '' : String(value); 
    const idSuffix = item ? `${item.id}-${field}` : field; // Adaptar el ID para CalculatorView
    const onChangeHandler = item 
        ? (e) => handleItemChange(item.id, field, e.target.value) 
        : handleItemChange; // En CalculatorView, handleItemChange es la función directa

    return (
        <div>
            <label htmlFor={idSuffix} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={idSuffix}
                type={type}
                step={type === 'number' ? "0.01" : undefined}
                value={displayValue}
                onChange={isCostField ? (e) => onChangeHandler(field, e.target.value) : onChangeHandler} 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
                placeholder={placeholder}
                required={!isCostField && field !== 'imageUrl'}
            />
        </div>
    );
};

// COMPONENTE: Maneja la selección de imagen y previsualización
const ImageUploader = ({ item, handleImageChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleImageChange(item.id, reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            handleImageChange(item.id, '');
        }
    };

    return (
        <div className="space-y-2">
            <label htmlFor={`image-upload-${item.id}`} className="block text-sm font-medium text-gray-700">
                Imagen del Producto (Opcional)
            </label>
            <input
                id={`image-upload-${item.id}`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            
            {/* Previsualización de 200px */}
            {item.imageUrl && (
                <div className="mt-3 p-2 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs text-gray-600 mb-1">Previsualización:</p>
                    <img 
                        src={item.imageUrl} 
                        alt={`Previsualización de ${item.productName}`} 
                        className="rounded-lg shadow-md object-cover"
                        style={{ width: '200px', height: '200px' }} 
                    />
                    <button
                        type="button"
                        onClick={() => handleImageChange(item.id, '')}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                    >
                        Eliminar Imagen
                    </button>
                </div>
            )}
        </div>
    );
};


// === ProductCard (Actualizado con el código del usuario)
const ProductCardDisplay = React.memo(({ item }) => {
    // Usamos item.factorA, item.factorB y item.result tal como está en el nuevo estado
    const factorA = parseFloat(item.factorA || 0);
    const factorB = parseFloat(item.factorB || 0);
    const result = parseFloat(item.result || 0);
    const imageUrl = item.imageUrl;
    const productName = item.productName || "Producto sin nombre";

    let colorClass = "border-blue-300 bg-blue-50/70 text-blue-900";
    if (result > 1500) {
        colorClass = "border-green-400 bg-green-50/70 text-green-900";
    } else if (result > 500) {
        colorClass = "border-amber-400 bg-amber-50/70 text-amber-900";
    }

    // Adaptación del URL. Si es una URL Base64 no hará nada. Si es de Cloudinary, se transforma.
    const displayImageUrl = imageUrl
        ? imageUrl.startsWith('data:') 
            ? imageUrl 
            : imageUrl.replace("/upload/", "/upload/c_fit,w_400,q_auto:good/")
        : imageUrl;

    return (
        <div
            className={`
                p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm
                transition-all duration-300 ease-in-out transform
                hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-1
                ${colorClass}
            `}
        >
            <div className="flex justify-between items-start mb-3 border-b border-current/30 pb-2">
                <h3 className="text-xl font-extrabold truncate">{productName}</h3>
            </div>

            {imageUrl && (
                <div className="mb-3">
                    <img
                        src={displayImageUrl}
                        alt={`Imagen de ${productName}`}
                        className="w-full max-h-36 object-cover rounded-lg shadow-inner border border-current/30"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                </div>
            )}

            <div className="space-y-2 mb-4 text-sm font-medium">
                <p className="flex justify-between">
                    <span>Factor A:</span>
                    <span className="font-bold">{factorA.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                    <span>Factor B:</span>
                    <span className="font-bold">{factorB.toFixed(2)}</span>
                </p>
            </div>

            <div className="p-3 mt-4 rounded-lg bg-white/70 shadow-inner border border-current/50">
                <p className="text-lg font-bold flex justify-between items-center">
                    <span className="uppercase text-gray-600">Total Producido:</span>
                    <span className="text-2xl font-extrabold text-indigo-700">
                        {result.toFixed(2)}{" "}
                        <span className="text-base font-normal">Kg</span>
                    </span>
                </p>
            </div>
        </div>
    );
});


const ProductItemForm = ({ item, index, handleItemChange, deleteItem, handleImageChange }) => {
    // Usamos el campo 'result' que ahora se actualiza automáticamente en el estado
    const totalResult = parseFloat(item.result) || 0; 
    
    return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b pb-2">
                <h4 className="text-lg font-bold text-gray-800">Producto #{index + 1}</h4>
                <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition transform hover:scale-105"
                    title="Eliminar producto"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
            
            <InputField 
                label="Nombre del Producto" // Etiqueta actualizada
                type="text" 
                value={item.productName} 
                field="productName" // Nombre del campo actualizado
                item={item}
                handleItemChange={handleItemChange} 
                placeholder="Ej: Tomate Larga Vida"
            />
            
            <ImageUploader 
                item={item}
                handleImageChange={handleImageChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <InputField 
                    label="Factor A (Kg producidos)" 
                    type="number" 
                    value={item.factorA} 
                    field="factorA" 
                    item={item}
                    handleItemChange={handleItemChange} 
                    placeholder="Ej: 50.5"
                />
                <InputField 
                    label="Factor B (Costo Unitario €/Kg)" 
                    type="number" 
                    value={item.factorB} 
                    field="factorB" 
                    item={item}
                    handleItemChange={handleItemChange} 
                    placeholder="Ej: 0.85"
                />
                <div className="p-2 bg-white rounded-lg border border-indigo-200 text-center">
                    <p className="text-sm text-gray-600">Resultado (A x B):</p>
                    <p className="text-xl font-extrabold text-indigo-700">{formatNumber(totalResult)}</p>
                </div>
            </div>
        </div>
    );
};

// === COMPONENTE: VISTA DE EDICIÓN ===
const EditProductionView = ({ 
    DATE_KEY, 
    editingItems, 
    currentDailyTotal, 
    isSaving, 
    handleItemChange, 
    handleImageChange, 
    deleteItem, 
    addItem, 
    handleSubmit, 
    handleCancel,
    showUiMessage 
}) => {
    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen font-['Inter']">
            <div className="max-w-4xl mx-auto">
                
                {/* Botón Volver al Resumen */}
                <button
                    onClick={handleCancel}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition font-medium"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver al Resumen
                </button>

                <form
                    onSubmit={handleSubmit}
                    className="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl space-y-8"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3">
                        Editar Producción para{" "}
                        {new Date(DATE_KEY).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </h2>

                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-xl shadow-inner">
                        <p className="text-xl font-medium text-green-800 flex justify-between items-center">
                            Total Actual del Día (suma de Factor A):
                            <span className="text-3xl font-extrabold text-green-700">
                                {formatNumber(currentDailyTotal)} Kg
                            </span>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {editingItems.map((item, index) => (
                            <ProductItemForm
                                key={item.id}
                                item={item}
                                index={index}
                                handleItemChange={handleItemChange}
                                deleteItem={deleteItem}
                                handleImageChange={handleImageChange}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center space-x-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            ></path>
                        </svg>
                        <span>Añadir Nuevo Producto</span>
                    </button>

                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="py-3 px-6 text-gray-600 font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className={`py-3 px-8 text-white font-bold rounded-full shadow-lg transition transform ${
                                isSaving
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
                                }`}
                                disabled={isSaving}
                            >
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// === NUEVO COMPONENTE: VISTA DE CÁLCULO DE COSTES 🔥 ===
const CalculatorView = ({ 
    DATE_KEY, 
    costData, 
    productionCostVariable, 
    finalProductionCost, 
    dailyTotalProduction,
    handleCostChange, 
    handleSaveCostData, 
    handleCancel,
    isSaving 
}) => {
    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen font-['Inter']">
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver al Resumen */}
                <button
                    onClick={handleCancel}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition font-medium"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver al Resumen
                </button>

                <div className="p-4 md:p-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl space-y-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3">
                        Análisis de Coste de Producción para {new Date(DATE_KEY).toLocaleDateString("es-ES")}
                    </h2>

                    {/* Resumen de Producción */}
                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-xl shadow-inner">
                        <p className="text-xl font-medium text-green-800 flex justify-between items-center">
                            Total de Kilogramos Producidos:
                            <span className="text-3xl font-extrabold text-green-700">
                                {formatNumber(dailyTotalProduction)} Kg
                            </span>
                        </p>
                    </div>

                    {/* Inputs de Coste */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl shadow-inner">
                        <InputField 
                            label="1. Número de Trabajadores"
                            type="number"
                            value={costData.numWorkers}
                            field="numWorkers"
                            handleItemChange={handleCostChange}
                            placeholder="Ej: 5"
                        />
                        <InputField
                            label="2. Horas Trabajadas (Promedio)"
                            type="number"
                            value={costData.hoursWorked}
                            field="hoursWorked"
                            handleItemChange={handleCostChange}
                            placeholder="Ej: 8"
                        />
                    </div>
                    
                    {/* Resultados del Cálculo */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="p-4 bg-indigo-50/70 border-2 border-indigo-300 rounded-xl shadow-lg">
                            <p className="text-lg font-bold flex justify-between items-center">
                                <span>Costo Variable de Mano de Obra (A):</span>
                                <span className="text-2xl font-extrabold text-indigo-700">
                                    {formatNumber(productionCostVariable)} €
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Base: {formatNumber(costData.numWorkers, 0)} Trabajadores x {formatNumber(costData.hoursWorked)} Horas x {HOURLY_COST_RATE.toFixed(2)} €/Hora
                            </p>
                        </div>

                        <div className="p-4 bg-teal-50/70 border-2 border-teal-300 rounded-xl shadow-lg">
                            <p className="text-xl font-bold flex justify-between items-center">
                                <span>Eficiencia de Coste (B/A):</span>
                                <span className="text-3xl font-extrabold text-teal-700">
                                    {finalProductionCost > 0 ? formatNumber(finalProductionCost) : '0.00'} Kg/€
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleSaveCostData}
                            className={`py-3 px-8 text-white font-bold rounded-full shadow-lg transition transform ${
                                isSaving
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
                            }`}
                            disabled={isSaving}
                        >
                            {isSaving ? "Guardando..." : "Guardar Costes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// === NUEVO COMPONENTE: VISTA DE RESUMEN 🔥 ===
const SummaryView = ({
    DATE_KEY,
    productionItems,
    dailyTotalProduction,
    totalCost,
    productionCostVariable,
    finalProductionCost,
    handleGoToCalendar,
    handleGoToEdit,
    handleGoToCalculator,
    exportToPDF,
    isSaving,
    formatNumber
}) => {
    const isProductionAvailable = productionItems.length > 0;
    const isCostAvailable = dailyTotalProduction > 0 && productionCostVariable > 0;

    return (
        <div className="p-4 sm:p-8 bg-white min-h-screen font-['Inter']">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Reporte Diario de Producción
                    </h1>
                    <button
                        onClick={handleGoToCalendar}
                        className="py-2 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Calendario
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-indigo-700 mb-6 border-b pb-2">
                    Detalles para {new Date(DATE_KEY).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </h2>

                {/* Área para Exportación PDF */}
                <div id="report-area" className="space-y-8 mb-8">
                    
                    {/* 1. Totales Generales */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Total Kg Producidos */}
                        <div className="p-6 bg-green-50 border-2 border-green-300 rounded-xl shadow-lg">
                            <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Kg Producidos</p>
                            <p className="text-4xl font-extrabold text-green-800 mt-1">
                                {formatNumber(dailyTotalProduction)}
                                <span className="text-xl font-normal ml-1">Kg</span>
                            </p>
                        </div>
                        
                        {/* Coste Total (Suma de Factor A x Factor B) */}
                        <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-xl shadow-lg">
                            <p className="text-sm font-medium text-blue-700 uppercase tracking-wider">Costo Estimado</p>
                            <p className="text-4xl font-extrabold text-blue-800 mt-1">
                                {formatNumber(totalCost)}
                                <span className="text-xl font-normal ml-1">€</span>
                            </p>
                        </div>

                        {/* Eficiencia de Coste */}
                        <div className={`p-6 border-2 rounded-xl shadow-lg ${
                            isCostAvailable ? 'bg-teal-50 border-teal-300' : 'bg-gray-50 border-gray-300'
                        }`}>
                            <p className="text-sm font-medium text-gray-700 uppercase tracking-wider">Eficiencia de Coste</p>
                            <p className={`text-4xl font-extrabold mt-1 ${isCostAvailable ? 'text-teal-800' : 'text-gray-500'}`}>
                                {isCostAvailable ? formatNumber(finalProductionCost) : 'N/A'}
                                <span className="text-xl font-normal ml-1">{isCostAvailable ? 'Kg/€' : ''}</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* 2. Productos Detallados */}
                    <h3 className="text-xl font-bold text-gray-800 pt-4 border-t">Productos Producidos ({productionItems.length})</h3>
                    {productionItems.length === 0 ? (
                        <div className="text-center p-8 bg-gray-100 rounded-xl text-gray-600 italic">
                            No hay productos registrados para esta fecha.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {productionItems.map((item) => (
                                <ProductCardDisplay key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Botones de Acción (Fuera del área de impresión) */}
                <div className="p-6 mt-8 border-t-2 border-gray-200 bg-gray-50 rounded-xl shadow-inner flex flex-wrap justify-between items-center space-y-4 sm:space-y-0">
                    {/* Botón Editar Producción */}
                    <button
                        onClick={handleGoToEdit}
                        className="flex justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.05]"
                        disabled={isSaving}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Editar Producción
                    </button>

                    {/* Botón Calcular Costes */}
                    <button
                        onClick={handleGoToCalculator}
                        className="flex justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.05]"
                        disabled={isSaving}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v3m-3 3h-3m3-3V7m0 0h-2m2 0h2M9 7v6m0-6h2m-2 0H7m2 6v-3m0 3h-2m2 0h2m0-6h-2m2 0h2M9 10h6m-3-3v6m0 0v-6"></path></svg>
                        Calcular Costes
                    </button>

                    {/* 🔥 BOTÓN EXPORTAR PDF */}
                    <button
                        onClick={exportToPDF}
                        className=" flex justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-[1.05]"
                        disabled={isSaving}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H5a2 2 0 01-2-2v-8a2 2 0 012-2h5l2-2h4l2 2h5a2 2 0 012 2v8a2 2 0 01-2 2z"></path>
                        </svg>
                        Exportar a PDF
                    </button>
                </div>

            </div>
        </div>
    );
};


// =======================================================================
// === COMPONENTE PRINCIPAL ===
// =======================================================================

const DailyProductionReport = ({ reportDate }) => {
    const navigate = useNavigate();

    const DATE_KEY = reportDate || '2025-10-04'; 

    // --- ESTADOS ---
    // Estructura actualizada: productName, imageUrl, y result
    const initialNewItem = { 
        id: newProductId(), 
        productName: '', // Nuevo nombre del campo
        factorA: '', 
        factorB: '', 
        imageUrl: '',
        result: 0 // Nuevo campo calculado
    };
    const [productionItems, setProductionItems] = useState([]);
    const defaultCostData = { numWorkers: '', hoursWorked: '' }; // Usar string vacío para inputs
    const [costData, setCostData] = useState(defaultCostData);
    
    // --- ESTADOS DE VISTA Y EDICIÓN ---
    const [viewMode, setViewMode] = useState('summary'); 
    const [editingItems, setEditingItems] = useState([]); 

    // --- ESTADOS DE UI Y AUTH ---
    const [isSaving, setIsSaving] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [exportMessage, setExportMessage] = useState("");
    const [uiMessage, setUiMessage] = useState(null);
    
    const showUiMessage = (message, type = 'error') => {
        setUiMessage({ message, type });
        setTimeout(() => setUiMessage(null), 5000);
    };

    // --- CÁLCULOS DERIVADOS ---
    const calculateTotals = useCallback((items) => {
        let totalCost = 0; // Suma de todos los 'result' (A * B)
        let totalProd = 0; // Suma de todos los 'factorA' (Kg producidos)
        items.forEach(item => {
            // El resultado es FactorA * FactorB
            const itemResult = (parseFloat(item.factorA) || 0) * (parseFloat(item.factorB) || 0);
            totalCost += itemResult;
            
            // La producción total diaria para la eficiencia es la suma de Factor A
            totalProd += (parseFloat(item.factorA) || 0);
        });
        return { 
            totalCost: totalCost, 
            dailyTotalProduction: totalProd,
        };
    }, []);
    const { totalCost, dailyTotalProduction } = useMemo(() => 
        calculateTotals(productionItems), 
        [productionItems, calculateTotals]
    );
    const { dailyTotalProduction: currentDailyTotal } = useMemo(() => 
        calculateTotals(editingItems), 
        [editingItems, calculateTotals]
    );
    const productionCostVariable = useMemo(() => {
        const workers = parseFloat(costData.numWorkers) || 0;
        const hours = parseFloat(costData.hoursWorked) || 0;
        return workers * hours * HOURLY_COST_RATE;
    }, [costData.numWorkers, costData.hoursWorked]);
    const finalProductionCost = useMemo(() => {
        if (dailyTotalProduction > 0 && productionCostVariable > 0) {
            return dailyTotalProduction / productionCostVariable;
        }
        return 0;
    }, [dailyTotalProduction, productionCostVariable]);

    // --- 1. CONFIGURACIÓN DE FIREBASE Y AUTENTICACIÓN ---
    useEffect(() => {
        if (!auth || !db) { 
            setError("Error: La configuración de Firebase (db o auth) no está disponible. Los datos no se guardarán/cargarán.");
            setIsAuthReady(true);
            return;
        }

        const initializeAuth = async () => {
            try {
                if (!auth.app || !auth.app.name) { 
                    await signInAnonymously(auth); 
                } else if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error("Error signing in:", e);
                setError("Error de autenticación: " + e.message);
            } finally {
                setIsAuthReady(true);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null); 
            }
        });

        initializeAuth();
        return () => unsubscribe();
    }, []); 

    // --- 2. CARGA DE DATOS EN TIEMPO REAL (onSnapshot) ---
    useEffect(() => {
        if (!db || !userId || !isAuthReady) return;
        
        // --- Carga de Productos ---
        const productsDocRef = doc(db, 
            "artifacts", appId, 
            "users", userId, 
            "dailyProduction", DATE_KEY
        );

        const unsubscribeProducts = onSnapshot(productsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                // Mapear los datos para asegurar que tengan los campos imageUrl y result
                const items = (docSnap.data().items || []).map(item => {
                    const factorA = parseFloat(item.factorA) || 0;
                    const factorB = parseFloat(item.factorB) || 0;
                    return {
                        ...item,
                        imageUrl: item.imageUrl || '',
                        result: item.result || (factorA * factorB), // Recalcular result por seguridad
                        productName: item.productName || item.name || '' // Usar productName, fallback a name
                    };
                });
                
                setProductionItems(items);
                if (viewMode !== 'edit') {
                    setEditingItems(items);
                }
            } else {
                setProductionItems([]);
                if (viewMode !== 'edit') {
                    setEditingItems([]);
                }
            }
        }, (err) => {
            console.error("Error al escuchar productos:", err);
            setError("Error al cargar productos.");
        });
        
        // --- Carga de Datos de Coste (Mantenido) ---
        const costDocRef = doc(db, 
            "artifacts", appId, 
            "users", userId, 
            "costAnalysis", DATE_KEY
        );
        const unsubscribeCost = onSnapshot(costDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().costData) {
                // Asegurar que los valores numéricos se carguen como string o número para el input
                const loadedCostData = docSnap.data().costData;
                setCostData({
                    numWorkers: String(loadedCostData.numWorkers || ''),
                    hoursWorked: String(loadedCostData.hoursWorked || '')
                });
            } else {
                setCostData(defaultCostData);
            }
        }, (err) => {
            console.error("Error al escuchar costes:", err);
            setError("Error al cargar datos de coste.");
        });
        
        return () => {
            unsubscribeProducts();
            unsubscribeCost();
        };
    }, [isAuthReady, userId, DATE_KEY, viewMode]);


    // --- 3. FUNCIONES DE ACCIÓN Y EDICIÓN ---
    
    const saveProductionData = async (itemsToSave) => {
        if (!db || !userId) {
            showUiMessage("No se puede guardar: ID de usuario no disponible.", 'error');
            return false;
        }
        setIsSaving(true);
        try {
            const docRef = doc(db, 
                "artifacts", appId, 
                "users", userId, 
                "dailyProduction", DATE_KEY
            );
            // Validamos que los campos obligatorios existan y sean válidos
            const validItems = itemsToSave.filter(item => 
                item.productName && 
                parseFloat(item.factorA) >= 0 && 
                parseFloat(item.factorB) >= 0 && 
                item.factorA !== "" && 
                item.factorB !== ""
            );
            
            await setDoc(docRef, { items: validItems, lastUpdated: new Date().toISOString() }, { merge: false });
            showUiMessage("Lista de productos guardada con éxito.", 'success');
            return true;
        } catch (e) {
            console.error("Error al guardar productos:", e);
            setError("Error al guardar los datos de producción.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };
    
    // Función genérica para manejar cambios de campos de texto/número
    const handleItemChange = (id, field, value) => {
        setEditingItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                let newItem = { ...item };

                // 1. Manejo del valor
                if (field === 'productName') {
                    newItem[field] = value;
                } else if (field === 'factorA' || field === 'factorB') {
                    // Permite el string vacío para el input
                    const numericValue = value === "" ? "" : parseFloat(value);
                    newItem[field] = isNaN(numericValue) ? (value === "" ? "" : item[field]) : numericValue;
                } else {
                    newItem[field] = value;
                }

                // 2. Recalcular 'result' y 'totalCost' (Factor A * Factor B)
                const factorA = parseFloat(newItem.factorA) || 0;
                const factorB = parseFloat(newItem.factorB) || 0;
                
                newItem.result = factorA * factorB; 
                
                return newItem;
            }
            return item;
        }));
    };

    // FUNCIÓN: Maneja el cambio de la URL de la imagen (Base64)
    const handleImageChange = (id, base64Image) => {
        setEditingItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                return { ...item, imageUrl: base64Image };
            }
            return item;
        }));
    };
    
    const addItem = () => {
        // Clonamos initialNewItem para asegurar que tiene un ID único y limpio
        setEditingItems(prevItems => [
            ...prevItems,
            {...initialNewItem, id: newProductId()} 
        ]);
    };
    
    const deleteItem = (idToDelete) => {
        setEditingItems(prevItems => prevItems.filter(item => item.id !== idToDelete));
        showUiMessage("Producto eliminado de la lista de edición. Pulsa 'Guardar Cambios' para aplicar.", 'info');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invalidItem = editingItems.find(item => 
            !item.productName || 
            parseFloat(item.factorA) < 0 || 
            parseFloat(item.factorB) < 0 || 
            item.factorA === "" || 
            item.factorB === ""
        );
        if (invalidItem) {
            showUiMessage("Asegúrate de que todos los productos tienen Nombre, Factor A y Factor B válidos (>= 0).", 'error');
            return;
        }

        const success = await saveProductionData(editingItems);
        if (success) {
            setViewMode('summary');
        }
    };

    const handleCancel = () => {
        // Restaura los ítems a la última versión guardada
        setEditingItems(productionItems);
        setViewMode('summary');
    };


    // --- 4. FUNCIONES DE ACCIÓN Y EDICIÓN (para vista 'calculator') ---
    
    const handleCostChange = (field, value) => {
        // Permite el string vacío para el input
        const numericValue = value === "" ? "" : parseFloat(value);
        setCostData(prev => ({ 
            ...prev, 
            [field]: isNaN(numericValue) ? (value === "" ? "" : prev[field]) : numericValue
        }));
    };

    const handleSaveCostData = async () => {
        if (!db || !userId) {
            showUiMessage("No se puede guardar: ID de usuario no disponible.", 'error');
            return;
        }
        
        const workers = parseFloat(costData.numWorkers);
        const hours = parseFloat(costData.hoursWorked);

        if (workers < 0 || hours < 0 || isNaN(workers) || isNaN(hours)) {
            showUiMessage("Los campos 'N. Trabajadores' y 'H. Trabajadas' deben ser números válidos y no negativos.", 'error');
            return;
        }

        setIsSaving(true);
        try {
            const docRef = doc(db, 
                "artifacts", appId, 
                "users", userId, 
                "costAnalysis", DATE_KEY
            );
            
            // Guardar los valores como números (o 0 si es string vacío)
            const costDataToSave = {
                numWorkers: parseFloat(costData.numWorkers) || 0,
                hoursWorked: parseFloat(costData.hoursWorked) || 0
            };

            await setDoc(docRef, { 
                costData: costDataToSave, 
                productionCostVariable,
                finalProductionCost,
                dailyTotalProduction,
                lastUpdated: new Date().toISOString() 
            }, 
            { merge: false });
            
            showUiMessage("Datos de costes guardados con éxito.", 'success');
            setViewMode('summary');
        } catch (e) {
            console.error("Error al guardar datos de coste:", e);
            setError("Error al guardar los datos de coste.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- 5. FUNCIONALIDAD DE EXPORTACIÓN A PDF (Mantenido) ---

    const exportToPDF = async () => {
        if (!window.html2canvas || !window.jspdf) {
            setExportMessage("⏳ Cargando librerías de exportación. Intenta de nuevo en un momento.");
            setTimeout(() => setExportMessage(""), 3000);
            return;
        }

        setExportMessage("Generando PDF... por favor, espera.");
        const input = document.getElementById('report-area');
        try {
            const canvas = await window.html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Reporte_Produccion_${DATE_KEY}.pdf`);
            setExportMessage("✅ PDF generado con éxito.");
        } catch (error) {
            console.error("Error durante la exportación a PDF:", error);
            setExportMessage("❌ Error al generar el PDF. Revisa la consola.");
        } finally {
            setTimeout(() => setExportMessage(""), 5000);
        }
    };
    
    // --- 6. FUNCIONES DE NAVEGACIÓN ---
    const handleGoToCalendar = () => {
        navigate('/produccion'); 
    };
    
    const handleGoToCalculator = () => {
        setViewMode('calculator');
    };
    const handleGoToSummary = () => {
        setViewMode('summary');
    };
    const handleGoToEdit = () => {
        // Sincroniza los ítems actuales a los ítems de edición antes de cambiar de vista
        setEditingItems(productionItems);
        setViewMode('edit');
    };


    // --- 7. RENDERIZADO DEL COMPONENTE ---

    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-xl font-semibold text-indigo-600">
                    Cargando autenticación y base de datos...
                </p>
            </div>
        );
    }
    
    // Estructura común: ID de Usuario y Mensajes
    const commonHeader = (
        <>
            {/* ID de Usuario (MANDATORIO para apps multi-user) */}
            <div className="mb-4 text-sm text-gray-500 truncate">
                ID de Usuario: <span className="font-mono text-gray-700">{userId || 'No Autenticado'}</span>
            </div>

            {/* MENSAJE DE ERROR/EXPORTACIÓN/UI */}
            {(error || exportMessage || uiMessage) && (
                <div className={`p-3 mb-4 rounded-xl font-medium ${
                    error || (uiMessage && uiMessage.type === 'error') ? 'bg-red-100 text-red-700' : 
                    (exportMessage && exportMessage.startsWith("✅")) || (uiMessage && uiMessage.type === 'success') ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700' // Default para info/loading
                }`}>
                    {error || (uiMessage && uiMessage.message) || exportMessage}
                </div>
            )}
        </>
    );

    // --- RENDERIZADO CONDICIONAL DE VISTAS (Switch) ---
    switch (viewMode) {
        case 'edit':
            return (
                <>
                    {commonHeader}
                    <EditProductionView
                        DATE_KEY={DATE_KEY}
                        editingItems={editingItems}
                        currentDailyTotal={currentDailyTotal}
                        isSaving={isSaving}
                        handleItemChange={handleItemChange}
                        handleImageChange={handleImageChange}
                        deleteItem={deleteItem}
                        addItem={addItem}
                        handleSubmit={handleSubmit}
                        handleCancel={handleCancel}
                        showUiMessage={showUiMessage}
                    />
                </>
            );
        case 'calculator':
            return (
                <>
                    {commonHeader}
                    <CalculatorView
                        DATE_KEY={DATE_KEY}
                        costData={costData}
                        productionCostVariable={productionCostVariable}
                        finalProductionCost={finalProductionCost}
                        dailyTotalProduction={dailyTotalProduction}
                        handleCostChange={handleCostChange}
                        handleSaveCostData={handleSaveCostData}
                        handleCancel={handleGoToSummary} // Usar handleGoToSummary para salir
                        isSaving={isSaving}
                    />
                </>
            );
        case 'summary':
        default:
            return (
                <>
                    {commonHeader}
                    <SummaryView
                        DATE_KEY={DATE_KEY}
                        productionItems={productionItems}
                        dailyTotalProduction={dailyTotalProduction}
                        totalCost={totalCost}
                        productionCostVariable={productionCostVariable}
                        finalProductionCost={finalProductionCost}
                        handleGoToCalendar={handleGoToCalendar}
                        handleGoToEdit={handleGoToEdit}
                        handleGoToCalculator={handleGoToCalculator}
                        exportToPDF={exportToPDF}
                        isSaving={isSaving}
                        formatNumber={formatNumber}
                    />
                </>
            );
    }
};

export default DailyProductionReport;

