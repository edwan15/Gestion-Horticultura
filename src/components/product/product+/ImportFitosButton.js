import React, { useState } from 'react';
import { productService } from '../../../features/product/ProductServices';
// Data will be fetched asynchronously
import { toast } from 'react-toastify';
import { FaFileImport } from 'react-icons/fa';

const ImportFitosButton = ({ userId, onImportComplete }) => {
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);

    const handleImport = async () => {
        if (!userId) {
            toast.error("Usuario no identificado. No se puede importar.");
            return;
        }

        if (!window.confirm("¿Estás seguro de que deseas importar los productos Fitosanitarios? Esto puede tomar varios minutos.")) {
            return;
        }

        setIsImporting(true);
        
        let fitosData = [];
        try {
            const response = await fetch('/data/mapa_fitosanitarios_scraped.json');
            fitosData = await response.json();
        } catch (error) {
            console.error("Error fetching fitos data:", error);
            toast.error("Error al cargar el archivo de datos.");
            setIsImporting(false);
            return;
        }

        // 1. Filter for "Vigente" products to avoid junk
        const activeFitos = fitosData.filter(item => item.status === "Vigente");
        setTotal(activeFitos.length);
        
        console.log(`Found ${activeFitos.length} active products to import.`);

        let successCount = 0;
        let errorCount = 0;

        // 2. Iterate and create
        for (let i = 0; i < activeFitos.length; i++) {
            const item = activeFitos[i];
            
            // Basic mapping
            const productToCreate = {
                name: item.name || "Desconocido",
                category: "Fitosanitarios",
                price: 0,
                entradas: 0,
                salidas: 0,
                image: "", // Placeholder or null
                description: item.observations || "",
                userId: userId,
                // Extra metadata fields
                sku: item.authCode || "", // Use authCode as SKU/ID reference
                brand: item.manufacturer || "",
                details: JSON.stringify({
                    composition: item.composition,
                    expiryDate: item.expiryDate,
                    inscriptionDate: item.inscriptionDate,
                    titular: item.titular,
                    url: item.url
                })
            };

            try {
                // We use a small delay to avoid freezing the browser and rate limits
                // process each product
                await productService.createProduct(productToCreate);
                successCount++;
            } catch (error) {
                console.error(`Error importing ${item.name}:`, error);
                errorCount++;
            }

            setProgress(i + 1);
            
            // Optional: Break if user cancels? (Complex to implement simple cancel, so just rely on reload)
            // Delay every 10 requests to be gentle?
            if (i % 10 === 0) {
                 await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        setIsImporting(false);
        toast.success(`Importación completada. Exitosos: ${successCount}, Errores: ${errorCount}`);
        
        if (onImportComplete) {
            onImportComplete();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isImporting ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Importando {progress} / {total}</span>
                </div>
            ) : (
                <button 
                    onClick={handleImport} 
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm text-sm font-medium transition"
                >
                    <FaFileImport /> Importar Fitosanitarios
                </button>
            )}
        </div>
    );
};

export default ImportFitosButton;
