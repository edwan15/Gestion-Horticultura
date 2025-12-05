import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableReport from './PrintableReport';

const ReportPreviewModal = ({ isOpen, onClose, config, data }) => {
    const reportRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => reportRef.current,
        documentTitle: `Reporte_${new Date().toISOString().split('T')[0]}`,
        onAfterPrint: () => console.log('Print success'), // Optional callback
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95 backdrop-blur-md">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-lg shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold">Vista Previa del Informe</h2>
                </div>
                <div className="flex items-center gap-3">
                     <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-300 rounded hover:text-white transition text-sm font-medium"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2 bg-emerald-600 text-white rounded shadow-lg hover:bg-emerald-500 hover:shadow-emerald-500/20 transition flex items-center gap-2 font-bold transform hover:-translate-y-0.5"
                    >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Exportar a PDF / Imprimir
                    </button>
                </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-auto bg-slate-900 p-8 flex justify-center">
                <div className="shadow-2xl">
                    <PrintableReport config={config} data={data} reportRef={reportRef} />
                </div>
            </div>
        </div>
    );
};

export default ReportPreviewModal;
