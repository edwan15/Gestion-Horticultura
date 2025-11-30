import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../../features/product/ProductSlice';
import { selectUserId, selectRole } from '../../../../features/auth/authSlice/authSlice';

// =========================================================================
// 🧪 HELPER FUNCTIONS
// =========================================================================

const getDate = (daysOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

const createNewOrderRow = (id) => ({
    id,
    productoId: null,
    cantidadUsada: '',
    stockRestante: null,
    stockBase: null,
    stockUnidad: null,
    alerta: false,
    // Campos de la tabla 
    porcentaje: '100', 
    composicion: '', 
    numRegistro: '',
    ps: '',
    dosisHa: '',
    dosisCuba: '', 
    motivo: '',
    real: '',
    eficacia: '',
    previsto: '', 
});

const createNewConfirmationRow = () => ({
    fecha: '', 
    horaInicio: '', 
    horaFinal: '', 
    numCubas: '', 
    caldoSobrante: '', 
    condAmbientales: '' 
});

// 🚩 MAPA DE PARCELAS Y SUPERFICIES 🚩
const PARCELA_OPTIONS_MAP = {
    '1': '3,8 ha',
    '2': '1,1 ha',
    '3': '2,5 ha',
    '4': '1,5 ha',
    '5': '1,0 ha',
    '6': '1,0 ha',
    '7': '1,0 ha',
    '8': '1,0 ha',
    '9': '1,0 ha',
    '10': '1,0 ha', 
};
const PARCELA_OPTIONS = Object.keys(PARCELA_OPTIONS_MAP);


const createNewPlan = (id, daysOffset = 0) => ({
    id,
    nombre: `EUROFRUITS AGRO SL`, 
    codigoHDS: `HDS-${id}-${Math.floor(Math.random() * 100)}`,
    version: '1.0',
    date: getDate(daysOffset), 
    caldoTotal: 1000,
    caldoHa: 1000,
    capacidadCuba: 1000,
    metodo: 'PISTOLETE',
    cuba: 'CUBA HERBICIDA',
    cultivo: 'UNIDAD',
    fincaUbicacion: 'BALSICAS',
    parcelas: '1',
    superficie: PARCELA_OPTIONS_MAP['1'],
    numCubasAplicar: 1,
    ordenes: [
        createNewOrderRow(1),
        createNewOrderRow(2),
        createNewOrderRow(3),
    ],
    confirmaciones: [
        createNewConfirmationRow(),
        createNewConfirmationRow(),
        createNewConfirmationRow(),
        createNewConfirmationRow(),
    ],
});


// =========================================================================
// 🚨 MODAL DE ALERTA PROFESIONAL 🚨
// =========================================================================
const CriticalStockModal = ({ visible, mensaje, onClose }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform scale-100 transition-transform duration-300 border-t-8 border-red-600">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-12 w-12 text-red-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <div className="ml-5 w-full">
                        <h4 className="text-2xl font-extrabold text-red-700 mb-3 pb-1">¡ERROR CRÍTICO! INVENTARIO INSUFICIENTE</h4>
                        <p className="text-gray-700 mb-6 font-medium leading-relaxed text-lg">
                            {mensaje}
                        </p>
                        <div className="text-sm text-gray-600 bg-red-50 p-4 rounded border border-red-300">
                            **Detalle Importante:** La cantidad solicitada excede el stock disponible, lo que resultaría en un inventario negativo. Por favor, corrija la cantidad a usar en la tabla.
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={onClose}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-95 duration-200"
                            >
                                Cerrar y Corregir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// =========================================================================
// 📄 COMPONENTE DISEÑO IMPRESO 📄
// =========================================================================

const OrdenFitosanitarioImpreso = ({ plan, ordenesCalculadas, onOrderChange, onAddRow, onDeleteRow, productOptions }) => { 
    const ordersArray = Array.isArray(ordenesCalculadas) ? ordenesCalculadas : [];
    
    const cellStyle = "p-1 border border-gray-500 text-[10px] whitespace-nowrap overflow-hidden leading-tight"; 
    const cellHeaderStyle = "p-1 border border-gray-500 bg-gray-200 text-center font-extrabold text-[10px] uppercase leading-tight";
    const cellInputStyle = "w-full p-0 border-none text-[10px] focus:ring-0 bg-transparent";

    const rightColStyle = "col-span-2 border-l border-gray-500";
    
    const tableHeaderClasses = [
        "w-[6.5%]", "w-[4%]", "w-[14.5%]", "w-[12%]", "w-[6%]", "w-[3%]", "w-[6%]", "w-[6%]", 
        "w-[6%]", "w-[6%]", "w-[8%]", "w-[8%]", "w-[8%]", "w-[6%]", 
        "w-[2%]",
    ];
    
    const tallCellStyle = "p-1 border border-gray-500 text-[10px] leading-tight flex flex-col justify-start h-12"; 
    
    const stockColumnClass = "stock-col";
    const hiddenInPrintClass = "print:hidden";

    const CUBA_CAPACITY_OPTIONS = [1000, 2000, 3000];
    const METODO_OPTIONS = ["PISTOLETE", "TRADICIONAL"];
    const CUBA_OPTIONS = ["CUBA HERBICIDA", "CUBA BIOESTIMULATE"];
    const FINCA_OPTIONS = ["BALSICAS", "DOLORES", "PALMERO"];

    const handlePlanDataChange = (key, value) => {
        let updates = { [key]: value };

        if (key === 'capacidadCuba') {
            const numValue = parseFloat(value);
            updates.caldoHa = numValue;
            updates.caldoTotal = numValue;
        }

        if (key === 'parcelas' && PARCELA_OPTIONS_MAP[value]) {
            updates.superficie = PARCELA_OPTIONS_MAP[value];
        }
        
        if (key === 'numCubasAplicar') {
             updates[key] = parseInt(value, 10);
        }

        Object.keys(updates).forEach(updateKey => {
            onOrderChange(null, updateKey, updates[updateKey]);
        });
    };

    const handleConfirmationChange = (index, key, value) => {
        onOrderChange(null, 'actualizarConfirmacion', { index, key, value });
    };
    
    const NUM_CUBAS_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);


    return (
        <div className="bg-white border-4 border-black shadow-2xl max-w-6xl mx-auto font-sans text-gray-900 text-xs print:shadow-none print:border-none">
            <div className="grid grid-cols-10 border-b border-black">
                
                <div className="col-span-8 border-r-2 border-gray-500">
                    <div className="grid grid-cols-8">
                        
                        <div className="col-span-2 row-span-3 h-[70px] flex items-center justify-center bg-gray-50 border-r border-b border-gray-500 text-center font-bold text-gray-700">
                            <div className="py-1 px-1 text-center font-serif text-lg font-black text-green-700 border-b-2 border-green-700 leading-none">
                                HORTICULTURA <br/><span className="text-[10px]">DEL SURESTE</span>
                            </div>
                        </div>
                        
                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 bg-blue-600 text-white font-bold text-center text-sm`}>
                                ORDEN FITOSANITARIOS
                            </div>
                        </div>

                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 bg-blue-100 text-center font-extrabold text-sm`}>
                                {plan.nombre}
                            </div>
                        </div>
                        
                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 h-[10px] border-b-0`}></div>
                        </div>


                        <div className="col-span-8 grid grid-cols-8 border-b border-gray-500">
                            <div className={`${tallCellStyle} col-span-2 font-bold justify-center`}>
                                <label className="flex-shrink-0 mr-1">FECHA:</label>
                                <input type="date" value={plan.date} onChange={(e) => handlePlanDataChange('date', e.target.value)} className={`${cellInputStyle} mt-0.5`} />
                            </div>
                            <div className={`${tallCellStyle} col-span-2 font-bold justify-center`}>
                                <label className="flex-shrink-0 mr-1">CÓDIGO HDS:</label>
                                <input type="text" value={plan.codigoHDS} onChange={(e) => handlePlanDataChange('codigoHDS', e.target.value)} className={`${cellInputStyle} mt-0.5`} />
                            </div>
                            
                            <div className={`${tallCellStyle} col-span-1 `}>
                                PARCELAS: <br/>
                                <select 
                                    value={plan.parcelas} 
                                    onChange={(e) => handlePlanDataChange('parcelas', e.target.value)} 
                                    className={`${cellInputStyle} mt-1 h-auto font-medium print-as-text`} 
                                >
                                    {PARCELA_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            
                            <div className={`${tallCellStyle} col-span-2 `}>
                                SUPERFICIE: <br/>
                                <span className="font-extrabold text-sm text-gray-700 mt-1.5">{plan.superficie}</span>
                            </div>
                            
                            <div className={`${tallCellStyle} col-span-1 font-bold text-center justify-center bg-gray-50`}>
                                CALDO TOTAL: <br/>
                                <span className="font-extrabold text-sm text-blue-700">{plan.caldoTotal.toFixed(0)} lt</span>
                            </div>
                        </div>

                        <div className="col-span-8 grid grid-cols-8 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-3 font-bold flex items-center`}>
                                CULTIVO UNIDAD: 
                                <input type="text" value={plan.cultivo} onChange={(e) => handlePlanDataChange('cultivo', e.target.value)} className={`${cellInputStyle} ml-1`} />
                            </div>
                            <div className={`${cellStyle} col-span-5 font-bold flex items-center`}>
                                FINCA:
                                <select 
                                    value={plan.fincaUbicacion} 
                                    onChange={(e) => handlePlanDataChange('fincaUbicacion', e.target.value)} 
                                    className={`${cellInputStyle} ml-1 font-medium bg-transparent print-as-text`} 
                                >
                                    {FINCA_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div className="col-span-8 grid grid-cols-8 border-t border-gray-500">
                            <div className={`${cellStyle} col-span-2 font-bold flex justify-between items-center`}>
                                CALDO HA: <span className="float-right text-blue-700 font-extrabold">{plan.caldoHa.toFixed(0)} lt</span>
                            </div>
                            
                            <div className={`${cellStyle} col-span-2 font-bold flex items-center`}>
                                CAPACIDAD CUBA: 
                                <select 
                                    value={plan.capacidadCuba} 
                                    onChange={(e) => handlePlanDataChange('capacidadCuba', e.target.value)} 
                                    className={`${cellInputStyle} ml-1 font-extrabold text-right print-as-text`} 
                                >
                                    {CUBA_CAPACITY_OPTIONS.map(cap => (
                                        <option key={cap} value={cap}>{cap} lt</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`${cellStyle} col-span-2 font-bold flex items-center`}>
                                CUBA:
                                <select 
                                    value={plan.cuba} 
                                    onChange={(e) => handlePlanDataChange('cuba', e.target.value)} 
                                    className={`${cellInputStyle} ml-1 font-medium bg-transparent print-as-text`} 
                                >
                                    {CUBA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className={`${cellStyle} col-span-2 font-bold flex items-center`}>
                                MÉTODO: 
                                <select 
                                    value={plan.metodo} 
                                    onChange={(e) => handlePlanDataChange('metodo', e.target.value)} 
                                    className={`${cellInputStyle} ml-1 font-medium bg-transparent print-as-text`} 
                                >
                                    {METODO_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-8 grid grid-cols-8 border-t border-gray-500">
                            <div className={`${cellStyle} col-span-1 font-bold flex items-center justify-between`}>
                                N° CUBAS:
                                <select 
                                    value={plan.numCubasAplicar} 
                                    onChange={(e) => handlePlanDataChange('numCubasAplicar', e.target.value)} 
                                    className={`${cellInputStyle} w-10 text-right font-extrabold text-sm print-as-text`} 
                                >
                                    {NUM_CUBAS_OPTIONS.map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            
                             <div className={`${cellStyle} col-span-1 font-bold`}>ROMA:</div>
                             <div className={`${cellStyle} col-span-3 font-bold text-center bg-gray-100`}>DOSIS</div>
                             <div className={`${cellStyle} col-span-3 font-bold text-center bg-gray-100`}>CONSUMO</div> 
                        </div>
                    </div>
                </div>

                <div className={rightColStyle}>
                    <div className="grid grid-cols-2 h-full">
                        
                        <div className={`${cellStyle} col-span-2 text-center bg-yellow-100 font-bold border-b border-gray-500 h-[70px] flex flex-col justify-start`}>
                            OBSERVACIONES:
                            <textarea className={`${cellInputStyle} bg-transparent h-full resize-none text-left font-normal text-xs mt-1`} rows="5" placeholder="Escribe aquí las observaciones..." />
                        </div>
                        
                        <div className={`${cellStyle} col-span-2 text-center bg-yellow-100 font-bold border-b border-gray-500`}>NORMAS PARA EL USO EFICAZ Y SEGURO DE FITOSANITARIOS</div>
                        
                        <div className={`${cellStyle} col-span-2 text-[8px] h-full overflow-hidden text-justify`} style={{ lineHeight: '1.2' }}>
                             <ol className="list-decimal pl-3 space-y-0.5">
                                <li>Sigue las instrucciones del técnico para el uso de plaguicidas.</li>
                                <li>No fumes, ni comas, ni bebas durante el tratamiento.</li>
                                <li>Si la ropa se impregna de producto, cámbiate o dúchate inmediatamente.</li>
                                <li>Comprueba que los equipos estén en perfecto estado para su uso.</li>
                                <li>No deje los productos al alcance de los niños o personas no autorizadas.</li>
                                <li>Guarde los productos bajo llave.</li>
                                <li>Nunca almacene un producto fitosanitario en un envase distinto al original.</li>
                                <li>No utilice los envases para guardar alimentos.</li>
                                <li>Lea atentamente las instrucciones.</li>
                                <li>Respete el plazo de seguridad y dosis indicada.</li>
                                <li>El caldo sobrante o residuos de lavado se aplican en tierras de barbecho.</li>
                                <li>En caso de intoxicación llamar al servicio de toxicología 915620420.</li>
                                <li>No contamine el medio ambiente.</li>
                                <li>El plazo de re-entrada mínima es de 24 horas.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border-b-2 border-black">
                <table className="min-w-full border-collapse"> 
                    <thead className="bg-gray-100"> 
                        <tr className="text-gray-700">
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[0]}`}>MOTIVO</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[1]}`}>%</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[2]}`}>PRODUCTO</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[3]}`}>COMPOSICION</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[4]}`}>N° REGIST</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[5]}`}>PS</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[6]}`}>1.000 lt</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[7]}`}>HA</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[8]}`}>CUBA</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[9]}`}>UNIDAD</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[10]} text-green-700 ${stockColumnClass} ${hiddenInPrintClass}`}>STOCK</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[11]} text-red-700`}>PREVISTO</th> 
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[12]}`}>REAL</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[13]}`}>EFICACIA</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[14]} text-red-700 ${hiddenInPrintClass}`}>X</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white"> 
                        {ordersArray.map((orden) => (
                             <tr key={orden.id} className="hover:bg-gray-50 transition duration-100">
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.motivo} onChange={(e) => onOrderChange(orden.id, 'motivo', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. MOJANTE"/>
                                </td>
                                
                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} font-bold text-center`}>
                                    <input type="number" value={orden.porcentaje} onChange={(e) => onOrderChange(orden.id, 'porcentaje', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-center`} placeholder="100"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <select
                                        value={orden.productoId || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            onOrderChange(orden.id, 'productoId', value);
                                        }}
                                        className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} font-medium print-as-text`} 
                                    >
                                        <option value="" disabled>--- Seleccionar Producto ---</option>
                                        {productOptions.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.composicion} onChange={(e) => onOrderChange(orden.id, 'composicion', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. 90% MOJANTE"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.numRegistro} onChange={(e) => onOrderChange(orden.id, 'numRegistro', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. 24.087"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.ps} onChange={(e) => onOrderChange(orden.id, 'ps', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')}/>
                                </td>
                                
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.cantidadUsada} onChange={(e) => onOrderChange(orden.id, 'cantidadUsada', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right font-extrabold text-red-700`} placeholder="0.00"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.dosisHa} onChange={(e) => onOrderChange(orden.id, 'dosisHa', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.dosisCuba} onChange={(e) => onOrderChange(orden.id, 'dosisCuba', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>

                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} text-center font-bold text-gray-600`}>
                                    {orden.stockUnidad || 'L/Kg'}
                                </td>

                                <td 
                                    className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} ${stockColumnClass} text-center font-extrabold ${hiddenInPrintClass} ${
                                        orden.alerta 
                                            ? 'bg-red-200 text-red-800 animate-pulse'
                                            : 'text-green-700'
                                    }`}
                                >
                                    {orden.productoId 
                                        ? (orden.stockRestante !== null 
                                            ? (orden.stockRestante < 0 ? `-${Math.abs(orden.stockRestante).toFixed(2)}` : orden.stockRestante.toFixed(2)) 
                                            : '---') 
                                        : 'N/A'}
                                </td>
                                
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.previsto} onChange={(e) => onOrderChange(orden.id, 'previsto', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right font-extrabold text-red-700`} placeholder="0.00"/>
                                </td>

                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.real} onChange={(e) => onOrderChange(orden.id, 'real', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>
                                
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.eficacia} onChange={(e) => onOrderChange(orden.id, 'eficacia', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-center`} placeholder="B"/>
                                </td>

                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} text-center ${hiddenInPrintClass}`}>
                                    <button
                                        onClick={() => onDeleteRow(orden.id)}
                                        disabled={ordersArray.length === 1}
                                        title="Eliminar esta fila de producto"
                                        className={`p-0 w-full h-full font-extrabold transition duration-150 active:scale-90 
                                            ${ordersArray.length === 1 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-red-600 hover:text-red-800'
                                            }
                                        `}
                                    >
                                        <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-center py-2 bg-gray-50 border-b border-black print:hidden">
                <button
                    onClick={onAddRow}
                    className="inline-flex items-center px-4 py-1.5 border border-indigo-600 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-150"
                >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Agregar Producto/Fila
                </button>
            </div>
            
            <div className="grid grid-cols-10 border-t-2 border-black">
                
                <div className="col-span-8 border-r border-gray-500">
                    <div className="grid grid-cols-8">
                        <div className={`${cellStyle} col-span-4 font-bold h-10`}>
                            RESPONSABLE TÉCNICO: ISMAEL BLAZQUEZ FERNANDEZ <br/> RaPe 143059911SA
                        </div>
                        <div className={`${cellStyle} col-span-4 font-bold h-10`}>
                            APLICADOR: JOAQUIN CONESA EGEA <br/> 143020257SU/2
                        </div>
                        <div className={`${cellStyle} col-span-8 font-bold text-[9px] bg-red-50 border-t border-gray-500`}>
                            INSTRUCCIONES ESPECIALES: Uso obligatorio de EPIS (mascarilla con filtro, botas, guantes, mono y gafas). Limpiar la cuba tras la aplicación. Enjuagar tres veces e inutilizar el envase fitosanitario.
                        </div>
                    </div>
                </div>

                 <div className="col-span-2">
                    <div className="grid grid-cols-2">
                        <div className={`${cellStyle} col-span-2 text-center bg-blue-100 font-bold border-b border-gray-500`}>
                            CONFIRMACIÓN DEL TRATAMIENTO POR EL APLICADOR
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto border-t border-black">
                <table className="min-w-full border-collapse"> 
                    <thead className="bg-gray-100"> 
                        <tr className="text-gray-700">
                            <th className={`${cellHeaderStyle} w-[15%]`}>FECHA DE APLICACIÓN</th>
                            <th className={`${cellHeaderStyle} w-[15%]`}>HORA INICIO</th>
                            <th className={`${cellHeaderStyle} w-[15%]`}>HORA FINAL</th>
                            <th className={`${cellHeaderStyle} w-[15%]`}>Nº CUBAS</th>
                            <th className={`${cellHeaderStyle} w-[20%]`}>CALDO SOBRANTE</th>
                            <th className={`${cellHeaderStyle} w-[20%]`}>COND. AMBIENTALES / TEMP. / VIENTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plan.confirmaciones.map((conf, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className={`${cellStyle} h-8`}>
                                    <input type="date" value={conf.fecha} onChange={(e) => handleConfirmationChange(index, 'fecha', e.target.value)} className={cellInputStyle} />
                                </td>
                                <td className={`${cellStyle} h-8`}>
                                    <input type="time" value={conf.horaInicio} onChange={(e) => handleConfirmationChange(index, 'horaInicio', e.target.value)} className={cellInputStyle} />
                                </td>
                                <td className={`${cellStyle} h-8`}>
                                    <input type="time" value={conf.horaFinal} onChange={(e) => handleConfirmationChange(index, 'horaFinal', e.target.value)} className={cellInputStyle} />
                                </td>
                                <td className={`${cellStyle} h-8`}>
                                    <input type="number" value={conf.numCubas} onChange={(e) => handleConfirmationChange(index, 'numCubas', e.target.value)} className={`${cellInputStyle} text-right`} />
                                </td>
                                <td className={`${cellStyle} h-8`}>
                                    <input type="text" value={conf.caldoSobrante} onChange={(e) => handleConfirmationChange(index, 'caldoSobrante', e.target.value)} className={cellInputStyle} />
                                </td>
                                <td className={`${cellStyle} h-8`}>
                                    <input type="text" value={conf.condAmbientales} onChange={(e) => handleConfirmationChange(index, 'condAmbientales', e.target.value)} className={cellInputStyle} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};


// =========================================================================
// 🚀 COMPONENTE PRINCIPAL: OrdenFumigacionSimulador
// =========================================================================

const OrdenFumigacionSimulador = () => { 
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const userRole = useSelector(selectRole);
    const products = useSelector(state => state.product.products);

    // Cargar productos al montar
    useEffect(() => {
        if (userId) {
            dispatch(getProducts({ userId, userRole }));
        }
    }, [dispatch, userId, userRole]);

    // Transformar productos de Redux al formato esperado por el simulador
    const inventory = useMemo(() => {
        return products.map(p => {
            // El stock se calcula como entradas - salidas
            const entradas = parseInt(p.entradas, 10) || 0;
            const salidas = parseInt(p.salidas, 10) || 0;
            const stockCalculado = entradas - salidas;
            
            return {
                id: p.id || p._id,
                nombre: p.name,
                stock: stockCalculado,
                unidad: p.unit || 'Unidad'
            };
        });
    }, [products]);

    const productOptions = useMemo(() => {
        return inventory.map(p => ({
            id: p.id,
            nombre: `${p.nombre} (${p.unidad})`
        }));
    }, [inventory]);

    const findProduct = useCallback((id) => {
        return inventory.find(p => String(p.id) === String(id));
    }, [inventory]);


    const [planes, setPlanes] = useState([
        createNewPlan(1, 0), 
    ]);

    const [alertaModalState, setAlertaModalState] = useState({ visible: false, mensaje: null });
    const [alertaCriticaId, setAlertaCriticaId] = useState(null); 
    
    // Lógica de cálculo de stock
    const planesCalculados = useMemo(() => {
        let allOrders = [];
        planes.forEach(plan => {
            plan.ordenes.forEach(orden => {
                allOrders.push({
                    ...orden,
                    planId: plan.id,
                    date: plan.date,
                });
            });
        });

        allOrders.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            if (a.planId < b.planId) return -1;
            if (a.planId > b.planId) return 1;
            return a.id - b.id; 
        });
        
        const stockActual = new Map(inventory.map(p => [p.id, p.stock]));
        const ordersProcessed = [];

        for (const orden of allOrders) {
            const ordenCalculada = { ...orden };
            const productoBase = orden.productoId ? findProduct(orden.productoId) : null;
            
            ordenCalculada.stockBase = productoBase?.stock || null;
            ordenCalculada.stockUnidad = productoBase?.unidad || null;
            
            if (orden.productoId) {
                const cantidad = parseFloat(orden.cantidadUsada) || 0;
                
                let stockDisponibleAntes = stockActual.get(String(orden.productoId)) || 0;
                
                let stockDespues = stockDisponibleAntes - cantidad;
                ordenCalculada.alerta = false;

                if (cantidad > stockDisponibleAntes && cantidad > 0) {
                     ordenCalculada.alerta = true;
                }
                
                stockActual.set(String(orden.productoId), stockDespues);
                ordenCalculada.stockRestante = stockDespues;
                
            } else {
                 ordenCalculada.stockRestante = null; 
            }
            
            ordersProcessed.push(ordenCalculada);
        }

        const planesActualizados = planes.map(plan => {
            return {
                ...plan,
                ordenesCalculadas: ordersProcessed.filter(o => o.planId === plan.id)
            };
        });

        return planesActualizados;
    }, [planes, inventory, findProduct]); 
    
    // Lógica para mostrar el MODAL de Alerta 
    useEffect(() => {
        const primerAlertaCritica = planesCalculados.flatMap(p => p.ordenesCalculadas).find(o => o.alerta);
        
        if (primerAlertaCritica) {
            const prod = findProduct(primerAlertaCritica.productoId);
            const newAlertaId = `${primerAlertaCritica.planId}-${primerAlertaCritica.id}`;
            
            if (alertaCriticaId !== newAlertaId) {
                const allOrdersBeforeCurrent = planesCalculados.flatMap(p => p.ordenesCalculadas)
                    .filter(o => o.planId < primerAlertaCritica.planId || (o.planId === primerAlertaCritica.planId && o.id < primerAlertaCritica.id));

                let stockDisponibleEnEseMomento = findProduct(primerAlertaCritica.productoId)?.stock || 0; 
                
                for(const orden of allOrdersBeforeCurrent) {
                    if(String(orden.productoId) === String(primerAlertaCritica.productoId) && orden.cantidadUsada) {
                         const cantidad = parseFloat(orden.cantidadUsada) || 0;
                         stockDisponibleEnEseMomento -= cantidad;
                    }
                }
                stockDisponibleEnEseMomento = Math.max(0, stockDisponibleEnEseMomento); 
                
                const cantidadSolicitada = parseFloat(primerAlertaCritica.cantidadUsada);
                const unidad = prod?.unidad || 'Unidades';

                const mensajeJSX = (
                    <>
                        El producto <span className="font-extrabold text-red-800">{prod?.nombre}</span> (Orden <span className="font-extrabold">#{primerAlertaCritica.id}</span> del Plan <span className="font-extrabold">#{primerAlertaCritica.planId}</span>) requiere <span className="font-extrabold text-red-700">{cantidadSolicitada.toFixed(2)} {unidad}</span>, pero el stock actual disponible es de <span className="font-extrabold text-green-700">{stockDisponibleEnEseMomento.toFixed(2)} {unidad}</span>.
                    </>
                );

                setAlertaModalState({
                    visible: true,
                    mensaje: mensajeJSX,
                });
                setAlertaCriticaId(newAlertaId);
            }
        } else {
            if (alertaModalState.visible) {
                 setAlertaModalState({ visible: false, mensaje: null });
            }
            setAlertaCriticaId(null);
        }
    }, [planesCalculados, alertaCriticaId, alertaModalState.visible, findProduct]); 

    const closeModal = () => {
        setAlertaModalState({ visible: false, mensaje: null });
    };

    const handlePlanChange = useCallback((planId, key, value, ordenId = null) => {
        setPlanes(prevPlanes => 
            prevPlanes.map(plan => {
                if (plan.id === planId) {
                    if (ordenId === null && key !== 'nuevaFila' && key !== 'actualizarConfirmacion' && key !== 'eliminarFila') {
                         return { ...plan, [key]: value };
                    } 
                    
                    if (key === 'actualizarConfirmacion') {
                        const { index, key: confKey, value: confValue } = value;
                        const newConfirmaciones = [...plan.confirmaciones];
                        newConfirmaciones[index] = { ...newConfirmaciones[index], [confKey]: confValue };
                        return { ...plan, confirmaciones: newConfirmaciones };
                    }
                    
                    if (key === 'nuevaFila') {
                        const nextId = plan.ordenes.length > 0 
                            ? Math.max(...plan.ordenes.map(o => o.id)) + 1 
                            : 1;

                        return { 
                            ...plan, 
                            ordenes: [...plan.ordenes, createNewOrderRow(nextId)] 
                        };
                    }
                    
                    if (key === 'eliminarFila') {
                        const idToDelete = value;
                        
                        if (plan.ordenes.length <= 1) {
                             return plan;
                        }

                        const newOrdenes = plan.ordenes.filter(orden => orden.id !== idToDelete);
                        return { ...plan, ordenes: newOrdenes };
                    }

                    const newOrdenes = plan.ordenes.map(orden => {
                        if (orden.id === ordenId) {
                            const newOrder = { ...orden, [key]: value };
                            
                            if (key === 'productoId') {
                                const product = findProduct(value);
                                newOrder.stockUnidad = product?.unidad || null;
                                newOrder.stockBase = product?.stock || null;
                            }
                            return newOrder;
                        }
                        return orden;
                    });
                    return { ...plan, ordenes: newOrdenes };
                }
                return plan;
            })
        );
    }, [findProduct]); 

    const addPlan = () => {
        const newId = (planes.length ? planes[planes.length - 1].id : 0) + 1;
        setPlanes([...planes, createNewPlan(newId, planes.length)]); 
    };

    const deletePlan = useCallback((planId) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el Plan Fitosanitario #${planId}?\nEsta acción es irreversible.`)) {
            return;
        }
        setPlanes(prevPlanes => {
            const newPlanes = prevPlanes.filter(plan => plan.id !== planId);
            const isAlertPlan = alertaCriticaId && alertaCriticaId.startsWith(`${planId}-`);
            if (isAlertPlan) {
                setAlertaCriticaId(null);
                setAlertaModalState({ visible: false, mensaje: null });
            }
            return newPlanes;
        });
    }, [alertaCriticaId]);


    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-100 min-h-screen">
            <style jsx global>{`
                @media print {
                    /* Ocultar TODOS los elementos de la aplicación excepto este componente */
                    body > *:not(#root) {
                        display: none !important;
                    }
                    
                    /* Ocultar header, sidebar, navbar, etc. */
                    header, nav, aside, footer, 
                    [class*="sidebar"], [class*="Sidebar"],
                    [class*="header"], [class*="Header"],
                    [class*="navbar"], [class*="Navbar"],
                    [class*="nav"], [class*="Nav"],
                    [class*="menu"], [class*="Menu"] {
                        display: none !important;
                    }
                    
                    /* Resetear estilos de página para impresión */
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                    }
                    
                    /* Ocultar elementos específicos del componente */
                    .print\\:hidden, .print-button {
                        display: none !important;
                    }
                    
                    /* Configurar saltos de página */
                    .print-page-break {
                        page-break-after: always;
                        break-after: page;
                    }
                    
                    .print-page-break:last-child {
                        page-break-after: avoid;
                        break-after: avoid;
                    }
                    
                    /* Ocultar columna de stock en impresión */
                    .stock-col {
                        display: none !important;
                    }
                    
                    /* Hacer que los selects se vean como texto */
                    .print-as-text {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        background: none !important;
                        border: none !important;
                        padding-right: 0 !important;
                        color: #000 !important;
                    }
                    
                    .print-as-text option {
                        display: none;
                    }
                    
                    /* Ajustar el contenedor principal */
                    .space-y-8 {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: white !important;
                    }
                    
                    /* Asegurar que cada plan ocupe una página completa */
                    .pb-8 {
                        padding-bottom: 0 !important;
                    }
                    
                    /* Optimizar para tamaño de página A4 */
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                }
            `}</style>
            
            <CriticalStockModal
                visible={alertaModalState.visible}
                mensaje={alertaModalState.mensaje}
                onClose={closeModal}
            />
            
            <h1 className="text-2xl text-center font-sans font-extrabold text-gray-800 print:hidden">
                HORTICULTURA DEL SURESTE
            </h1>

            {planesCalculados.map((plan) => (
                <div key={plan.id} className="pb-8 print-page-break"> 
                    
                    <div className="flex justify-between items-center mb-2 px-2 print:hidden">
                        <h2 className="text-xl font-bold text-gray-700">Plan Fitosanitario <span className="text-indigo-600">#{plan.id}</span></h2>
                        
                        <button 
                            onClick={() => deletePlan(plan.id)}
                            disabled={planes.length === 1}
                            className={`
                                font-semibold py-1 px-3 border rounded-lg transition duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${planes.length === 1 
                                    ? 'text-gray-400 border-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'text-red-600 border-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500'
                                }
                            `}
                            title={planes.length === 1 ? "Debe haber al menos un plan." : `Eliminar Plan Fitosanitario #${plan.id}`}
                        >
                            <svg className="h-4 w-4 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Eliminar Plan
                        </button>
                    </div>

                    <OrdenFitosanitarioImpreso
                        plan={plan}
                        ordenesCalculadas={plan.ordenesCalculadas} 
                        onOrderChange={(ordenId, key, value) => {
                            if (ordenId === null) {
                                handlePlanChange(plan.id, key, value); 
                            } else {
                                handlePlanChange(plan.id, key, value, ordenId); 
                            }
                        }}
                        onAddRow={() => handlePlanChange(plan.id, 'nuevaFila', true)}
                        onDeleteRow={(ordenId) => handlePlanChange(plan.id, 'eliminarFila', ordenId)}
                        productOptions={productOptions}
                    />
                </div>
            ))}
            
            <div className="flex flex-col sm:flex-row justify-center items-center pt-4 space-y-4 sm:space-y-0 sm:space-x-8 print:hidden">
                
                <button 
                    onClick={addPlan}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                >
                    + Agregar Nuevo Plan/Día
                </button>
                
                <button 
                    onClick={handlePrint}
                    className="
                        inline-flex items-center px-8 py-3 
                        border-2 border-green-600 
                        text-lg font-bold rounded-xl 
                        shadow-2xl text-white bg-green-500 
                        transition duration-300 transform 
                        hover:bg-green-600 hover:scale-[1.05] active:scale-[0.98] 
                        hover:shadow-green-500/50 
                        focus:outline-none focus:ring-4 focus:ring-green-300
                        print-button
                    "
                >
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4m3 11v-4"></path></svg>
                    Imprimir / Exportar a PDF
                </button>
            </div>
        </div>
    );
};

export default OrdenFumigacionSimulador;