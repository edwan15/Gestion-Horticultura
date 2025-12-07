import React from 'react';

const PrintableReport = ({ data, config, reportRef }) => {
    // Mock data for demonstration
    const productionItems = data?.productionItems || [];
    const totals = data?.totals || { kg: 0, cost: 0, efficiency: 0 };
    const farmName = data?.farm || 'Finca Balsicas Producción';

    return (
        <div ref={reportRef} className="bg-white text-slate-800 font-sans">
            {/* Report CSS for Print Media */}
            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 15mm 15mm 15mm 15mm;
                        }
                        
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        
                        /* Avoid breaking inside elements */
                        .avoid-break {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        
                        /* Allow table to break across pages */
                        table {
                            page-break-inside: auto;
                            width: 100%;
                        }
                        
                        /* Allow rows to break if needed */
                        tr {
                            page-break-inside: auto;
                        }
                        
                        /* Table header repeat on each page */
                        thead {
                            display: table-header-group;
                        }
                        
                        /* Table footer only at the end */
                        tfoot {
                            display: table-row-group;
                        }
                        
                        /* Footer ONLY at absolute bottom - minimal height */
                        .print-footer {
                            position: running(footer);
                        }
                        
                        @page {
                            @bottom-center {
                                content: element(footer);
                            }
                        }
                        
                        /* Alternative: Fixed footer at very bottom */
                        .print-footer {
                            position: fixed;
                            bottom: 5mm;
                            left: 15mm;
                            right: 15mm;
                            height: auto;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 5px 0;
                            font-size: 8pt;
                            color: #64748b;
                            border-top: 1px solid #e2e8f0;
                            background: white;
                        }
                        
                        /* Page number styling */
                        .page-counter {
                            font-weight: bold;
                            font-size: 10pt;
                            color: #334155;
                        }
                        
                        .page-counter:before {
                            content: counter(page) " / " counter(pages);
                        }
                    }
                    
                    /* Screen styles */
                    @media screen {
                        .print-footer {
                            display: none;
                        }
                    }
                `}
            </style>

            {/* Main Content Container */}
            <div className="p-8 max-w-[210mm] mx-auto min-h-[297mm]">
                
                {/* Header - Only on first page */}
                <div className="avoid-break mb-8">
                    <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Informe de Producción</h1>
                            <p className="text-lg text-gray-700 font-semibold">{farmName}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Generado: {new Date().toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        
                        {/* Logo PEPAC (conditional) */}
                        {config?.sections?.logos?.pepac && (
                            <div className="ml-4">
                                <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <span className="text-4xl">🌱</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Configuration Summary */}
                {config?.sections?.farmCharacterization && (
                    <div className="avoid-break mb-6">
                        <h2 className="text-xl font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-2">
                            Configuración del Informe
                        </h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="font-semibold text-gray-600">Finca:</span>
                                <span className="ml-2 text-gray-800">{config.farm}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600">Versión:</span>
                                <span className="ml-2 text-gray-800">{config.version}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600">Período:</span>
                                <span className="ml-2 text-gray-800">
                                    {config.dateRange === 'today' && 'Hoy'}
                                    {config.dateRange === 'yesterday' && 'Ayer'}
                                    {config.dateRange === 'last_week' && 'Última Semana'}
                                    {config.dateRange === 'last_month' && 'Último Mes'}
                                    {config.dateRange === 'last_year' && 'Último Año'}
                                    {config.dateRange === 'all' && 'Todo el Período'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overall Activity Summary */}
                <div className="avoid-break mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <h2 className="text-lg font-bold text-emerald-800 mb-3">Resumen de Actividad General</h2>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">{totals.kg}</p>
                            <p className="text-xs text-gray-600 mt-1">Producción (Kg)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">{totals.cost}</p>
                            <p className="text-xs text-gray-600 mt-1">Coste (€)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">{totals.efficiency}</p>
                            <p className="text-xs text-gray-600 mt-1">Eficiencia</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Table - Cosecha */}
                {config?.sections?.harvest && productionItems.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-2">
                            Cosecha
                        </h2>
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-emerald-600 text-white">
                                    <th className="border border-emerald-700 p-2 text-left font-bold">FECHA</th>
                                    <th className="border border-emerald-700 p-2 text-left font-bold">PRODUCTO</th>
                                    <th className="border border-emerald-700 p-2 text-right font-bold">KG</th>
                                    <th className="border border-emerald-700 p-2 text-right font-bold">COSTE (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionItems.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 p-2 text-gray-700">{item.date}</td>
                                        <td className="border border-gray-300 p-2 text-gray-700">{item.product}</td>
                                        <td className="border border-gray-300 p-2 text-right text-gray-700">{item.kg}</td>
                                        <td className="border border-gray-300 p-2 text-right font-semibold text-gray-800">{item.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-emerald-600 text-white font-bold">
                                    <td colSpan="2" className="border border-emerald-700 p-2 text-right">TOTAL:</td>
                                    <td className="border border-emerald-700 p-2 text-right">{totals.kg}</td>
                                    <td className="border border-emerald-700 p-2 text-right">{totals.cost}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Observations Section */}
                {config?.sections?.observations && (
                    <div className="avoid-break mb-6">
                        <h2 className="text-lg font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-2">
                            Anotaciones
                        </h2>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[80px]">
                            <p className="text-xs text-gray-600 italic">
                                {data?.observations || 'Sin anotaciones registradas para este período.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Signatures Section */}
                <div className="avoid-break mt-12 pt-8 border-t border-gray-300">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="border-t border-gray-400 pt-2 mt-16">
                                <p className="text-sm font-semibold">Responsable de Producción</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-400 pt-2 mt-16">
                                <p className="text-sm font-semibold">Supervisor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Footer - Appears on every page */}
            <div className="print-footer">
                <div className="text-left" style={{ flex: 1 }}>
                    <p>Sistema de Gestión de Producción - WiseCrop® | Horticultura</p>
                </div>
                <div className="text-right">
                    <span className="page-counter"></span>
                </div>
            </div>
        </div>
    );
};

export default PrintableReport;
