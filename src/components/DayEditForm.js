import React, { useState, useMemo } from 'react';
// Asume que ProductItemForm y el toast de notificaciones (si lo usas) están disponibles
import ProductItemForm from './ProductItemForm'; 
// Asume que toast se usa para notificaciones (si no, quítalo)
// import toast from 'react-hot-toast'; 

// Nota: Asegúrate de que 'YOUR_BACKEND_UPLOAD_URL' esté definido o se pase como prop si es necesario.
const YOUR_BACKEND_UPLOAD_URL = "/api/upload"; // Placeholder

const DayEditForm = ({
    dateKey,
    dailyData,
    handleItemChange,
    handleItemBlur,
    addItem,
    deleteItem,
    handleDayClick,
    handleSave,
    uploadImages,
    formatNumber,
}) => {
    // ⚠️ Importante: Aseguramos que los hooks de estado estén en el cuerpo del componente
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Acceso seguro a los datos
    const dayData = dailyData[dateKey] || { items: [] };
    const items = dayData.items || [];
    
    const dailyTotal = useMemo(
        () => items.reduce((sum, item) => sum + parseFloat(item.result || 0), 0),
        [items]
    );

    const handleSaveLocal = async () => {
        setIsSaving(true);
        const imagesToUpload = items.filter(
            (item) => item.imageUrl && item.imageUrl.startsWith("data:image")
        );
        console.log("Imágenes a subir:", imagesToUpload);

        if (imagesToUpload.length > 0) {
            setUploading(true);
            try {
                // Suponiendo que uploadImages es una función asíncrona que retorna URLs
                const uploadedUrls = await uploadImages(
                    imagesToUpload,
                    YOUR_BACKEND_UPLOAD_URL // Usando el placeholder o la URL real
                );
                
                const updatedItems = items.map((item) => {
                    const uploaded = uploadedUrls.find(
                        (urlItem) => urlItem.id === item.id
                    );
                    if (uploaded) {
                        return { ...item, imageUrl: uploaded.url };
                    }
                    return item;
                });

                await handleSave(dateKey, updatedItems);
            } catch (error) {
                console.error("Error al subir imágenes o guardar:", error);
                // Si usas toast: toast.error("Error al guardar: Las imágenes no se pudieron subir.");
            } finally {
                setUploading(false);
            }
        } else {
            await handleSave(dateKey, items);
        }

        setIsSaving(false);
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl space-y-6">
            
            {/* 🟢 CORRECCIÓN DE VISTA: El botón de volver ya está usando "day_view" */}
            <button
                onClick={() => handleDayClick(dateKey, "day_view")}
                className="text-gray-500 hover:text-gray-700 flex items-center transition font-medium text-sm"
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                Volver a la vista del día
            </button>
            
            <h2 className="text-3xl font-extrabold text-indigo-700 border-b pb-3">
                Editar Productos del Día: {dateKey}
            </h2>
            
            {/* Total Actualizado */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-300 shadow-md flex justify-between items-center">
                <p className="text-xl font-semibold text-green-800">
                    Total Producción (Kg) Actual:
                </p>
                <p className="text-3xl font-extrabold text-green-700">
                    {formatNumber(dailyTotal)} Kg
                </p>
            </div>
            
            {/* Renderizado de formularios de producto */}
            <div className="space-y-8">
                {items.map((item, index) => (
                    <ProductItemForm
                        key={item.id}
                        item={item}
                        index={index}
                        handleItemChange={handleItemChange}
                        handleItemBlur={handleItemBlur} // Pasa la función real
                        deleteItem={deleteItem}
                    />
                ))}
            </div>
            
            {/* Botones de Añadir y Guardar */}
            <div className="pt-4 border-t border-gray-200 flex justify-between space-x-4">
                <button
                    onClick={addItem}
                    className="flex-grow py-3 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-lg shadow-md hover:bg-indigo-100 transition flex items-center justify-center border border-indigo-300"
                    disabled={isSaving}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Añadir Producto
                </button>
                <button
                    onClick={handleSaveLocal}
                    className="flex-grow py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition disabled:bg-indigo-400 flex items-center justify-center"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {uploading ? "Subiendo imágenes..." : "Guardando datos..."}
                        </div>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DayEditForm;