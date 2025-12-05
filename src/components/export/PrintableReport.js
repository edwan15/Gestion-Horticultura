import React from 'react';

const PrintableReport = ({ data, config, reportRef }) => {
    // Mock data if not provided (for development/preview structure)
    // In real usage, 'data' will contain the production items, costs, etc.
    const { 
        farm = 'Finca Balsicas Producción', 
        dateRange = 'Último año',
        productionItems = [],
        totals = { kg: 0, cost: 0, efficiency: 0 }
    } = data || {};

    return (
        <div ref={reportRef} className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-none print:shadow-none text-slate-800 font-sans">
            {/* Report CSS for Print Media */}
            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        body {
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                    }
                `}
            </style>

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-emerald-800 uppercase tracking-wide mb-1">
                        Informe de Producción
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {config.version || 'Cuaderno de Campo - PEPAC'}
                    </p>
                </div>
                <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-700">{farm}</h2>
                    <p className="text-xs text-slate-400 mt-1">Generado: {new Date().toLocaleDateString()}</p>
                    {/* Placeholder for Logo if selected */}
                    {config.sections?.logos?.pepac && (
                        <div className="mt-2 text-xs font-bold text-emerald-600 border border-emerald-200 px-2 py-1 inline-block rounded bg-emerald-50">
                            PEPAC
                        </div>
                    )}
                </div>
            </div>

            {/* Config/Filter Summary (Context) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-sm flex flex-wrap gap-8">
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Rango de Fechas</span>
                    <span className="font-semibold text-slate-700">{dateRange}</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Cultivos</span>
                    <span className="font-semibold text-slate-700">Todos</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Responsable</span>
                    <span className="font-semibold text-slate-700">Admin</span>
                </div>
            </div>

            {/* Summary Section */}
            {config.sections?.farmCharacterization && (
                <section className="mb-8">
                    <h3 className="text-emerald-700 font-bold border-l-4 border-emerald-500 pl-3 mb-4 text-lg">
                        Resumen de Actividad
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-bold uppercase">Total Producción</p>
                            <p className="text-2xl font-bold text-emerald-800">{totals.kg.toLocaleString()} Kg</p>
                        </div>
                        {config.sections?.analysis && (
                            <>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Costo Estimado</p>
                                    <p className="text-2xl font-bold text-blue-800">{totals.cost.toLocaleString()} €</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <p className="text-xs text-indigo-600 font-bold uppercase">Eficiencia</p>
                                    <p className="text-2xl font-bold text-indigo-800">{totals.efficiency} Kg/€</p>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* Detailed Table */}
            {config.sections?.harvest && (
                <section className="mb-8">
                    <h3 className="text-emerald-700 font-bold border-l-4 border-emerald-500 pl-3 mb-4 text-lg">
                        Detalle de Cosecha
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3 text-right">Cantidad (Kg)</th>
                                    {config.sections?.analysis && (
                                        <th className="px-4 py-3 text-right">Costo Total (€)</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {productionItems.length > 0 ? (
                                    productionItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-medium text-slate-700">{item.date}</td>
                                            <td className="px-4 py-2 text-slate-600">{item.product}</td>
                                            <td className="px-4 py-2 text-right font-mono text-slate-700">{item.kg}</td>
                                            {config.sections?.analysis && (
                                                <td className="px-4 py-2 text-right font-mono text-slate-700">{item.cost}</td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                            No hay registros para este periodo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

             {/* Signatures / Footer */}
             <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-16 break-inside-avoid">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-8">Firma del Responsable</p>
                   <div className="border-b border-slate-300"></div>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-8">Sello de la Empresa</p>
                   <div className="border-b border-slate-300"></div>
                </div>
             </div>
        </div>
    );
};

export default PrintableReport;
