// Archivo: src/components/DatosEstadisticosCard.js
import React, { useState } from 'react';
// ⚠️ Asegúrate de que esta ruta sea correcta para importar el modal
import DatosEstadisticosModal from './DatosEstadisticosModal'; 

// Icono (opcional, para que se vea bonito)
const CardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
    </svg>
);

const DatosEstadisticosCard = () => {
    // 1. LÓGICA DE ESTADO: Aquí se controla si el modal está abierto o cerrado.
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Datos de resumen para la tarjeta
    const estadisticasResumen = {
        modoProduccion: "Producción Integrada",
        tipoProteccion: "Invernadero",
        cultivosAdyacentes: "Tomate"
    };

    return (
        <>
            {/* 2. TARJETA (El botón que abre el modal) */}
            <div 
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 cursor-pointer hover:shadow-xl transition"
                onClick={openModal} // 👈 ¡Al hacer click, el estado 'isModalOpen' se pone en TRUE!
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-700 flex items-center">
                        {CardIcon}
                        Datos Estadísticos del Cultivo
                    </h3>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Modo:</span> {estadisticasResumen.modoProduccion}</p>
                    <p><span className="font-medium text-gray-800">Protección:</span> {estadisticasResumen.tipoProteccion}</p>
                </div>
            </div>

            {/* 3. MODAL (Recibe el estado isModalOpen y por eso funciona) */}
            <DatosEstadisticosModal 
                isOpen={isModalOpen} // 👈 Pasa TRUE o FALSE al modal
                closeModal={closeModal} 
            />
        </>
    );
};

export default DatosEstadisticosCard;