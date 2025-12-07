import React, { useMemo } from 'react';

// Updated: 2025-12-07 19:36 - Manual pagination with 15 rows per page
const PrintableIrrigationReport = ({ data, config, reportRef, consumptionP1 = 0, consumptionP2 = 0 }) => {
    // Capacidad total
    const capacityP1 = 15000;
    const capacityP2 = 10000;

    // Mock/default data if not provided
    const irrigationData = data?.irrigationRecords || [];
    const totals = data?.totals || { totalM2: 0, totalSectors: 0, totalDays: 0 };
    const farmName = data?.farm || 'Riego de Invernaderos';

    // PAGINATION: Split data into pages (20 rows per page to fit comfortably)
    const ROWS_PER_PAGE = 20;
    const pages = useMemo(() => {
        const result = [];
        for (let i = 0; i < irrigationData.length; i += ROWS_PER_PAGE) {
            result.push(irrigationData.slice(i, i + ROWS_PER_PAGE));
        }
        return result.length > 0 ? result : [[]];
    }, [irrigationData]);

    return (
        <div ref={reportRef} className="bg-white text-slate-800 font-sans">
            {/* Report CSS for Print Media */}
            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 15mm 15mm 20mm 15mm;
                        }
                        
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        
                        /* Force page breaks */
                        .page-break {
                            page-break-after: always;
                            break-after: page;
                        }
                        
                        /* Avoid breaking inside elements */
                        .avoid-break {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        
                        /* Fixed footer at bottom */
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
                        .page-break {
                            margin: 30px 0;
                            border-bottom: 3px dashed #cbd5e1;
                            padding-bottom: 20px;
                        }
                    }
                `}
            </style>

            {/* FIRST PAGE - Header + Summary + First Table Page */}
            <div className={pages.length > 1 ? "page-break" : ""}>
                <div className="p-8 max-w-[210mm] mx-auto">
                    {/* Header */}
                    <div className="avoid-break mb-4">
                        <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-2">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-indigo-900 mb-1">Informe de Riego</h1>
                                <p className="text-base text-gray-700 font-semibold">{farmName}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Generado: {new Date().toLocaleDateString('es-ES', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                            
                            {config?.sections?.logos?.pepac && (
                                <div className="ml-4">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💧</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Configuration Summary */}
                    {config?.sections?.summary && (
                        <div className="avoid-break mb-3">
                            <h2 className="text-base font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                                Configuración del Informe
                            </h2>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="font-semibold text-gray-600">Sistema:</span>
                                    <span className="ml-2 text-gray-800">{config.farm}</span>
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
                    <div className="avoid-break mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                        <h2 className="text-base font-bold text-indigo-800 mb-2">Resumen General</h2>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center">
                                <p className="text-xl font-bold text-indigo-600">{totals.totalM2}</p>
                                <p className="text-xs text-gray-600 mt-1">M² Totales</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-indigo-600">{totals.totalSectors}</p>
                                <p className="text-xs text-gray-600 mt-1">Sectores Regados</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-indigo-600">{totals.totalDays}</p>
                                <p className="text-xs text-gray-600 mt-1">Días con Actividad</p>
                            </div>
                        </div>
                    </div>

                    {/* First Table Page */}
                    {config?.sections?.dailyRecords && pages[0] && pages[0].length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                                Registros Detallados
                            </h2>
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-emerald-600 text-white">
                                        <th className="border border-emerald-700 p-1 text-left font-bold text-xs">FECHA</th>
                                        <th className="border border-emerald-700 p-1 text-left font-bold text-xs">INVERNADERO</th>
                                        <th className="border border-emerald-700 p-1 text-right font-bold text-xs">SECTORES</th>
                                        <th className="border border-emerald-700 p-1 text-right font-bold text-xs">M²</th>
                                        <th className="border border-emerald-700 p-1 text-center font-bold text-xs">CONTADOR N.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pages[0].map((record, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 p-1 text-gray-700 text-xs">{record.date}</td>
                                            <td className="border border-gray-300 p-1 text-gray-700 text-xs">{record.invernadero}</td>
                                            <td className="border border-gray-300 p-1 text-right text-gray-700 text-xs">{record.sectors}</td>
                                            <td className="border border-gray-300 p-1 text-right font-semibold text-gray-800 text-xs">{record.m2}</td>
                                            <td className="border border-gray-300 p-1 text-center text-xs">
                                                {record.contador !== 'N/A' ? (
                                                    <span>
                                                        <span className="font-bold text-blue-600">{record.contador.split('a')[0]}</span>
                                                        <span className="text-gray-500 mx-0.5">a</span>
                                                        <span className="font-bold text-purple-600">{record.contador.split('a')[1]}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTINUATION PAGES - Only table data */}
            {pages.slice(1).map((pageData, pageIndex) => (
                <div key={pageIndex} className={pageIndex < pages.length - 2 ? "page-break" : ""}>
                    <div className="p-8 max-w-[210mm] mx-auto">
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                                Registros Detallados (continuación)
                            </h2>
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-emerald-600 text-white">
                                        <th className="border border-emerald-700 p-1 text-left font-bold text-xs">FECHA</th>
                                        <th className="border border-emerald-700 p-1 text-left font-bold text-xs">INVERNADERO</th>
                                        <th className="border border-emerald-700 p-1 text-right font-bold text-xs">SECTORES</th>
                                        <th className="border border-emerald-700 p-1 text-right font-bold text-xs">M²</th>
                                        <th className="border border-emerald-700 p-1 text-center font-bold text-xs">CONTADOR N.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageData.map((record, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 p-1 text-gray-700 text-xs">{record.date}</td>
                                            <td className="border border-gray-300 p-1 text-gray-700 text-xs">{record.invernadero}</td>
                                            <td className="border border-gray-300 p-1 text-right text-gray-700 text-xs">{record.sectors}</td>
                                            <td className="border border-gray-300 p-1 text-right font-semibold text-gray-800 text-xs">{record.m2}</td>
                                            <td className="border border-gray-300 p-1 text-center text-xs">
                                                {record.contador !== 'N/A' ? (
                                                    <span>
                                                        <span className="font-bold text-blue-600">{record.contador.split('a')[0]}</span>
                                                        <span className="text-gray-500 mx-0.5">a</span>
                                                        <span className="font-bold text-purple-600">{record.contador.split('a')[1]}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}

            {/* FINAL PAGE - Total and Observations */}
            <div>
                <div className="p-8 max-w-[210mm] mx-auto">
                    {/* Total Row */}
                    {config?.sections?.dailyRecords && irrigationData.length > 0 && (
                        <div className="mb-4">
                            <table className="w-full text-xs border-collapse">
                                <tfoot>
                                    <tr className="bg-emerald-600 text-white font-bold">
                                        <td colSpan="2" className="border border-emerald-700 p-1 text-right text-xs">TOTAL:</td>
                                        <td className="border border-emerald-700 p-1 text-right text-xs">{totals.totalSectors}</td>
                                        <td className="border border-emerald-700 p-1 text-right text-xs">{totals.totalM2}</td>
                                        <td className="border border-emerald-700 p-1 text-center text-xs">-</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}

                    {/* Observations */}
                    {/* Observations */}
                    {config?.sections?.observations && (
                        <div className="avoid-break mb-6">
                            <h2 className="text-base font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                                Observaciones
                            </h2>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[60px]">
                                {config.observations ? (
                                    <p className="text-xs text-gray-700 whitespace-pre-wrap">
                                        {config.observations}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-600 italic">
                                        Sin observaciones registradas para este período.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Water Reservoir Status */}
                    <div className="avoid-break mb-6">
                        <h2 className="text-base font-bold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                            💧 Estado de Pantanos
                        </h2>
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="border border-blue-700 p-2 text-left font-bold">Pantano</th>
                                    <th className="border border-blue-700 p-2 text-right font-bold">Capacidad</th>
                                    <th className="border border-blue-700 p-2 text-right font-bold">Consumido</th>
                                    <th className="border border-blue-700 p-2 text-right font-bold">Disponible</th>
                                    <th className="border border-blue-700 p-2 text-center font-bold">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Pantano 1 */}
                                <tr className="bg-white">
                                    <td className="border border-gray-300 p-2 font-semibold">Pantano 1</td>
                                    <td className="border border-gray-300 p-2 text-right">15,000 L</td>
                                    <td className="border border-gray-300 p-2 text-right text-orange-600 font-semibold">
                                        {consumptionP1.toLocaleString()} L
                                    </td>
                                    <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                                        {(capacityP1 - consumptionP1).toLocaleString()} L
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            ((capacityP1 - consumptionP1) / capacityP1) > 0.5 ? 'bg-green-100 text-green-700' :
                                            ((capacityP1 - consumptionP1) / capacityP1) > 0.2 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {(((capacityP1 - consumptionP1) / capacityP1) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                                {/* Pantano 2 */}
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 p-2 font-semibold">Pantano 2</td>
                                    <td className="border border-gray-300 p-2 text-right">10,000 L</td>
                                    <td className="border border-gray-300 p-2 text-right text-orange-600 font-semibold">
                                        {consumptionP2.toLocaleString()} L
                                    </td>
                                    <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                                        {(capacityP2 - consumptionP2).toLocaleString()} L
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            ((capacityP2 - consumptionP2) / capacityP2) > 0.5 ? 'bg-green-100 text-green-700' :
                                            ((capacityP2 - consumptionP2) / capacityP2) > 0.2 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {(((capacityP2 - consumptionP2) / capacityP2) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-xs text-gray-500 mt-2 italic">
                            * Los valores mostrados corresponden al consumo acumulado en el período seleccionado.
                        </p>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-12 mt-12 mb-8 avoid-break">
                        <div className="text-center">
                            <div className="border-b border-gray-400 w-3/4 mx-auto mb-2"></div>
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Firma del Responsable</p>
                        </div>
                        <div className="text-center">
                            <div className="border-b border-gray-400 w-3/4 mx-auto mb-2"></div>
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Firma del Supervisor</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Print Footer */}
            <div className="print-footer">
                <div className="text-left">
                    <span>Sistema de Gestión de Riego Horticultura</span>
                </div>
                <div className="page-counter"></div>
            </div>
        </div>
    );
};

export default PrintableIrrigationReport;
