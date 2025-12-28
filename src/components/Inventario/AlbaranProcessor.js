
import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, updateProduct, selectProducts, createProduct, selectIsLoading } from '../../features/product/ProductSlice';
import { selectUserId, selectName } from '../../features/auth/authSlice/authSlice';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaSpinner, FaCheck, FaExclamationTriangle, FaSave, FaTrash } from 'react-icons/fa';

const AlbaranProcessor = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const userId = useSelector(selectUserId);
    const userName = useSelector(selectName);
    const isLoadingGlobal = useSelector(selectIsLoading);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [parsedData, setParsedData] = useState(null);
    const [detectedCompany, setDetectedCompany] = useState(null);
    const [detectedDate, setDetectedDate] = useState(null);

    // Cargar productos si no están cargados
    useEffect(() => {
        if (!products.length) {
            dispatch(getProducts());
        }
    }, [dispatch, products.length]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setParsedData(null); // Resetear datos anteriores
            setDetectedCompany(null);
        }
    };

    const normalizeQuantity = (qtyStr) => {
        // Formato español: 1.000,00 -> 1000.00
        // Eliminar puntos de miles
        let clean = qtyStr.replace(/\./g, '');
        // Reemplazar coma decimal por punto
        clean = clean.replace(',', '.');
        return parseFloat(clean) || 0;
    };

    const processImage = async () => {
        if (!image) return;

        setIsProcessing(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                image,
                'spa', // Usar español
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(parseInt(m.progress * 100));
                        }
                    }
                }
            );

            parseText(result.data.text);

        } catch (error) {
            console.error("Error OCR:", error);
            toast.error("Error al procesar la imagen.");
        } finally {
            setIsProcessing(false);
        }
    };

    const parseText = (text) => {
        const lines = text.split('\n');
        const extractedProducts = [];
        let company = "Desconocida";
        let date = null;

        // 1. Detectar Empresa
        if (text.toLowerCase().includes('innova')) {
            company = "Innova Agrosoluciones";
        }

        // 2. Detectar Fecha (buscar patrones DD/MM/YYYY)
        const dateRegex = /(\d{2})\/(\d{2})\/(\d{4})/;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
            date = dateMatch[0];
        }

        // 3. Detectar Productos (Lógica específica para el formato Innova)
        // Patrón esperado visual en el albarán: CÓDIGO (espacio) NOMBRE (espacio) CANTIDAD
        // Ojo: La cantidad suele estar al final de la línea.
        // Ejemplo: "03111 KAPASOIL (5KG) ... 5,000"
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            // Regex: Empieza con dígitos (codigo), texto en medio, termina con número (cantidad)
            // El número final puede tener puntos y comas (ej: 1.000,000)
            const lineRegex = /^(\d+)\s+(.+?)\s+([\d.,]+)$/;
            
            const match = trimmedLine.match(lineRegex);

            if (match) {
                const code = match[1];
                let name = match[2];
                const quantityStr = match[3];

                // Limpieza del nombre (quitar basura OCR común al final si se mezcló)
                // A veces "..." o "RPP" se cuelan
                name = name.replace(/\.{2,}/g, '').trim(); 

                // Validar que la cantidad parezca un número
                if (/[0-9]/.test(quantityStr)) {
                    extractedProducts.push({
                        code,
                        name,
                        originalQty: quantityStr,
                        quantity: normalizeQuantity(quantityStr),
                        status: 'pending' // pending, matched, new
                    });
                }
            }
        });

        setDetectedCompany(company);
        setDetectedDate(date);
        
        // Intentar emparejar con productos existentes
        const matchedProducts = extractedProducts.map(p => {
            // Busqueda difusa simple o exacta por nombre (mejorable)
            // Aquí buscamos si el nombre extraído contiene alguna parte del nombre en BD o viceversa
            const existing = products.find(prod => 
                prod.name.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(prod.name.toLowerCase())
            );

            return {
                ...p,
                matchId: existing ? existing._id : null,
                matchName: existing ? existing.name : '',
                status: existing ? 'matched' : 'new'
            };
        });

        setParsedData(matchedProducts);
    };

    const handleUpdateProduct = (index, field, value) => {
        const updated = [...parsedData];
        updated[index][field] = value;
        
        // Si cambiamos el nombre de match, intentar buscar de nuevo el ID si es un select (a futuro)
        // Por ahora es edición manual de texto
        if (field === 'quantity') {
            updated[index].originalQty = value; // Actualizar visual
        }
        
        setParsedData(updated);
    };
    
    const handleDeleteRow = (index) => {
        const updated = [...parsedData];
        updated.splice(index, 1);
        setParsedData(updated);
    };

    const confirmStockUpdate = async () => {
        if (!parsedData || parsedData.length === 0) return;

        let processedCount = 0;

        for (const item of parsedData) {
            // Solo procesar si tiene cantidad válida
            if (item.quantity <= 0) continue;

            const productData = new FormData();
            
            // Si existe el producto (MATCHED), actualizamos
            if (item.status === 'matched' && item.matchId) {
                const existingProduct = products.find(p => p._id === item.matchId);
                if (existingProduct) {
                    const newEntradas = (parseFloat(existingProduct.entradas) || 0) + item.quantity;
                    // No tocamos salidas, el stock se recalcula automaticamente: entradas - salidas
                    
                    productData.append("name", existingProduct.name);
                    productData.append("category", existingProduct.category);
                    productData.append("price", existingProduct.price);
                    productData.append("entradas", newEntradas);
                    productData.append("salidas", existingProduct.salidas);
                    productData.append("description", existingProduct.description);

                    // LOG DE MOVIMIENTO (Idealmente el backend lo maneja, pero aquí simulamos la actualización completa)
                    try {
                        await dispatch(updateProduct({ id: item.matchId, formData: productData })).unwrap();
                        processedCount++;
                    } catch (error) {
                        console.error(`Error actualizando ${item.name}`, error);
                        toast.error(`Error al actualizar ${item.name}`);
                    }
                }
            } 
            // Si es NUEVO, lo creamos (Opcional, según reglas de negocio. Aquí asumimos que si no existe, se crea)
            else if (item.status === 'new') {
                // Crear producto nuevo
                productData.append("name", item.name); // Usamos el nombre del albarán
                productData.append("sku", item.code);  // Usamos el código del albarán como SKU
                productData.append("category", "Fitosanitarios"); // Default
                productData.append("price", 0); 
                productData.append("userId", userId);
                productData.append("userName", userName);
                productData.append("entradas", item.quantity);
                productData.append("salidas", 0);
                productData.append("description", `Importado de Albarán ${detectedCompany} - ${detectedDate || 'S/F'}`);

                try {
                    await dispatch(createProduct(productData)).unwrap();
                    processedCount++;
                } catch (error) {
                    console.error(`Error creando ${item.name}`, error);
                    toast.error(`Error al crear ${item.name}`);
                }
            }
        }

        toast.success(`${processedCount} productos procesados correctamente.`);
        setParsedData(null);
        setImage(null);
        setImagePreview(null);
        // Recargar productos para reflejar cambios
        dispatch(getProducts());
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCloudUploadAlt className="mr-3 text-blue-600" /> 
                Procesar Albarán (OCR)
            </h3>

            {/* AREA DE CARGA */}
            {!imagePreview && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FaCloudUploadAlt className="text-5xl text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium">Arrastra una imagen o haz clic para subir</p>
                    <p className="text-xs text-gray-400 mt-2">Formatos: JPG, PNG</p>
                </div>
            )}

            {/* PREVISUALIZACION Y PROCESAMIENTO */}
            {imagePreview && !parsedData && (
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-h-64 overflow-hidden rounded-lg mb-4 border">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-gray-900" />
                    </div>
                    
                    {isProcessing ? (
                        <div className="w-full">
                            <div className="flex justify-between text-sm mb-1 text-blue-600 font-semibold">
                                <span>Analizando documento...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <button 
                                onClick={processImage}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md flex items-center"
                            >
                                <FaCheck className="mr-2" /> Extraer Datos
                            </button>
                            <button 
                                onClick={() => { setImage(null); setImagePreview(null); }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* RESULTADOS */}
            {parsedData && (
                <div className="mt-6 animation-fade-in">
                    <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div>
                            <p className="text-sm text-gray-500">Empresa detectada:</p>
                            <p className="font-bold text-blue-800">{detectedCompany}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Fecha:</p>
                            <p className="font-bold text-blue-800">{detectedDate || "No detectada"}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-lg mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto Detectado</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coincidencia BD</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parsedData.map((item, index) => (
                                    <tr key={index} className={item.quantity > 1000 ? "bg-yellow-50" : ""}>
                                        <td className="px-4 py-2 text-sm text-gray-600">{item.code}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-800">
                                            <input 
                                                type="text" 
                                                value={item.name}
                                                onChange={(e) => handleUpdateProduct(index, 'name', e.target.value)}
                                                className="w-full border-none bg-transparent focus:ring-0"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {item.status === 'matched' ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    {item.matchName}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    NUEVO
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            <input 
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateProduct(index, 'quantity', parseFloat(e.target.value))}
                                                className="w-20 p-1 border rounded text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                onClick={() => handleDeleteRow(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={() => { setParsedData(null); setImagePreview(null); setImage(null); }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Descartar
                        </button>
                        <button 
                            onClick={confirmStockUpdate}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg flex items-center"
                            disabled={isLoadingGlobal}
                        >
                            {isLoadingGlobal ? <FaSpinner className="animate-spin mr-2"/> : <FaSave className="mr-2" />}
                            Confirmar y Actualizar Stock
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbaranProcessor;
