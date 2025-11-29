import React, { useState, useMemo, useEffect, useCallback } from 'react';

// =========================================================================
// 🧪 CONFIGURACIÓN DE DATOS (Simulación de Firebase/Stock)
// =========================================================================
const INVENTARIO_BASE = [
  { id: 1, nombre: "COTTON ALG...", stock: 3.0, unidad: "L" },       
  { id: 2, nombre: "ALGIKIM AG...", stock: 100.0, unidad: "Kg" },    
  { id: 3, nombre: "ACCUDO XTS...", stock: 2.0, unidad: "L" },       
  { id: 4, nombre: "PROPLANT", stock: 10.0, unidad: "L" },           
  { id: 5, nombre: "AMINAGRO F...", stock: 40.0, unidad: "L" },       
  { id: 6, nombre: "VERIMARK", stock: 2.0, unidad: "L" },            
  { id: 7, nombre: "CRISTALINO...", stock: 500.0, unidad: "Kg" },    
  { id: 8, nombre: "CRISTALINO... (2)", stock: 500.0, unidad: "Kg" }, 
  { id: 9, nombre: "ECOGREEN", stock: 1000.0, unidad: "Kg" },        
  { id: 10, nombre: "KAPASOIL", stock: 5.0, unidad: "L" },           
];

const PRODUCT_OPTIONS = INVENTARIO_BASE.map(p => ({
    id: p.id,
    nombre: `${p.nombre} (${p.unidad})`
}));

const findProduct = (id) => INVENTARIO_BASE.find(p => p.id === id);

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
    capacidadCuba: 1000, // Valor inicial
    metodo: 'PISTOLETE', // Valor inicial
    cuba: 'CUBA HERBICIDA', // Nuevo campo inicial
    cultivo: 'UNIDAD',
    fincaUbicacion: 'BALSICAS', // Valor inicial
    parcelas: '1', // Valor inicial (Ahora enlazado a 3,8 ha)
    superficie: PARCELA_OPTIONS_MAP['1'], // Inicializar con el valor de la parcela 1
    numCubasAplicar: 1, // 👈 Nuevo campo para el SELECT de Nº CUBAS
    ordenes: [
        createNewOrderRow(1),
        createNewOrderRow(2),
        createNewOrderRow(3),
    ],
    // 4 Filas de datos para la confirmación
    confirmaciones: [
        createNewConfirmationRow(),
        createNewConfirmationRow(),
        createNewConfirmationRow(),
        createNewConfirmationRow(),
    ],
});


// =========================================================================
// 🚨 MODAL DE ALERTA PROFESIONAL (Se mantiene la funcionalidad de stock) 🚨
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
// 📄 COMPONENTE DISEÑO IMPRESO (SÚPER IDÉNTICO) 📄
// =========================================================================

const OrdenFitosanitarioImpreso = ({ plan, ordenesCalculadas, onOrderChange, onAddRow, onDeleteRow }) => { 
    const ordersArray = Array.isArray(ordenesCalculadas) ? ordenesCalculadas : [];
    
    // Estilos base para replicar los bordes de la hoja de cálculo
    const cellStyle = "p-1 border border-gray-500 text-[10px] whitespace-nowrap overflow-hidden leading-tight"; 
    const cellHeaderStyle = "p-1 border border-gray-500 bg-gray-200 text-center font-extrabold text-[10px] uppercase leading-tight";
    // Ajustado para permitir selectores sin bordes nativos
    const cellInputStyle = "w-full p-0 border-none text-[10px] focus:ring-0 bg-transparent";

    // Estilo para la columna de NORMAS (Derecha)
    const rightColStyle = "col-span-2 border-l border-gray-500";
    
    // Anchos de columna para la tabla principal (14 campos de dato + 1 de control)
    const tableHeaderClasses = [
        "w-[6.5%]", "w-[4%]", "w-[14.5%]", "w-[12%]", "w-[6%]", "w-[3%]", "w-[6%]", "w-[6%]", 
        "w-[6%]", "w-[6%]", "w-[8%]", "w-[8%]", "w-[8%]", "w-[6%]", 
        "w-[2%]", // 🛑 NUEVA COLUMNA DE ELIMINAR 🛑
    ];
    
    // Altura mayor para las celdas del header
    const tallCellStyle = "p-1 border border-gray-500 text-[10px] leading-tight flex flex-col justify-start h-12"; 
    
    // Identificadores de clase para ocultar columnas en impresión
    const stockColumnClass = "stock-col"; // Clase para la columna STOCK (Índice 10)
    const hiddenInPrintClass = "print:hidden";

    // --- Opciones de Select ---
    const CUBA_CAPACITY_OPTIONS = [1000, 2000, 3000];
    const METODO_OPTIONS = ["PISTOLETE", "TRADICIONAL"];
    const CUBA_OPTIONS = ["CUBA HERBICIDA", "CUBA BIOESTIMULATE"];
    const FINCA_OPTIONS = ["BALSICAS", "DOLORES", "PALMERO"];
    // -------------------------

    // Manejar el cambio en los datos principales del plan, incluyendo la lógica de vinculación
    const handlePlanDataChange = (key, value) => {
        let updates = { [key]: value };

        // 🚨 Lógica de VINCULACIÓN: Si cambia CAPACIDAD CUBA, actualiza CALDO HA y CALDO TOTAL
        if (key === 'capacidadCuba') {
            const numValue = parseFloat(value);
            updates.caldoHa = numValue;
            updates.caldoTotal = numValue;
        }

        // 🚩 Lógica de VINCULACIÓN: Si cambia PARCELAS, actualiza SUPERFICIE
        if (key === 'parcelas' && PARCELA_OPTIONS_MAP[value]) {
            updates.superficie = PARCELA_OPTIONS_MAP[value];
        }
        
        // 🚩 Lógica de VINCULACIÓN: Asegurar que numCubasAplicar sea un número
        if (key === 'numCubasAplicar') {
             updates[key] = parseInt(value, 10);
        }

        // Aplicar todos los cambios
        Object.keys(updates).forEach(updateKey => {
            onOrderChange(null, updateKey, updates[updateKey]);
        });
    };

    // Manejar el cambio en las filas de confirmación del footer
    const handleConfirmationChange = (index, key, value) => {
        onOrderChange(null, 'actualizarConfirmacion', { index, key, value });
    };
    
    // Opciones para el select de Nº CUBAS
    const NUM_CUBAS_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);


    return (
        <div className="bg-white border-4 border-black shadow-2xl max-w-6xl mx-auto font-sans text-gray-900 text-xs print:shadow-none print:border-none">
            {/* Contenedor Principal: 80% Formulario (Izquierda), 20% Normas (Derecha) */}
            <div className="grid grid-cols-10 border-b border-black">
                
                {/* -------------------- COLUMNA IZQUIERDA (80% - COL SPAN 8) -------------------- */}
                <div className="col-span-8 border-r-2 border-gray-500">
                    <div className="grid grid-cols-8">
                        
                        {/* 1. LOGO/TÍTULO (Filas 1-3) */}
                        <div className="col-span-2 row-span-3 h-[70px] flex items-center justify-center bg-gray-50 border-r border-b border-gray-500 text-center font-bold text-gray-700">
                            {/* Logo "HORTICULTURA DEL SURESTE" */}
                            <div className="py-1 px-1 text-center font-serif text-lg font-black text-green-700 border-b-2 border-green-700 leading-none">
                                HORTICULTURA <br/><span className="text-[10px]">DEL SURESTE</span>
                            </div>
                        </div>
                        
                        {/* Título Principal */}
                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 bg-blue-600 text-white font-bold text-center text-sm`}>
                                ORDEN FITOSANITARIOS
                            </div>
                        </div>

                        {/* Finca/Olores */}
                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 bg-blue-100 text-center font-extrabold text-sm`}>
                                {plan.nombre}
                            </div>
                        </div>
                        
                        {/* Fila vacía para espacio */}
                        <div className="col-span-6 grid grid-cols-6 border-b border-gray-500">
                            <div className={`${cellStyle} col-span-6 h-[10px] border-b-0`}></div>
                        </div>


                        {/* 2. DATOS DE IDENTIFICACIÓN (Filas 4-6) */}
                        <div className="col-span-8 grid grid-cols-8 border-b border-gray-500">
                            {/* FECHA y CÓDIGO HDS */}
                            <div className={`${tallCellStyle} col-span-2 font-bold justify-center`}>
                                <label className="flex-shrink-0 mr-1">FECHA:</label>
                                <input type="date" value={plan.date} onChange={(e) => handlePlanDataChange('date', e.target.value)} className={`${cellInputStyle} mt-0.5`} />
                            </div>
                            <div className={`${tallCellStyle} col-span-2 font-bold justify-center`}>
                                <label className="flex-shrink-0 mr-1">CÓDIGO HDS:</label>
                                <input type="text" value={plan.codigoHDS} onChange={(e) => handlePlanDataChange('codigoHDS', e.target.value)} className={`${cellInputStyle} mt-0.5`} />
                            </div>
                            
                            {/* PARCELAS (Alto) - AHORA SELECT Y VINCULADO */}
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
                            
                            {/* SUPERFICIE (Alto) - AHORA SOLO MOSTRADO */}
                            <div className={`${tallCellStyle} col-span-2 `}>
                                SUPERFICIE: <br/>
                                {/* 🚩 SOLO TEXTO MOSTRADO (Superficie) 🚩 */}
                                <span className="font-extrabold text-sm text-gray-700 mt-1.5">{plan.superficie}</span>
                            </div>
                            
                            {/* CALDO TOTAL (POSICIÓN CORREGIDA) - AHORA VINCULADO */}
                            <div className={`${tallCellStyle} col-span-1 font-bold text-center justify-center bg-gray-50`}>
                                CALDO TOTAL: <br/>
                                <span className="font-extrabold text-sm text-blue-700">{plan.caldoTotal.toFixed(0)} lt</span>
                            </div>
                        </div>

                        {/* Fila 5: CULTIVO, UNIDAD, FINCA BALSICAS - AHORA SELECT */}
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
                        
                        {/* Fila 6: DETALLES DE APLICACIÓN (Ahora es la Fila 6) */}
                        <div className="col-span-8 grid grid-cols-8 border-t border-gray-500">
                            {/* CALDO HA - AHORA VINCULADO */}
                            <div className={`${cellStyle} col-span-2 font-bold flex justify-between items-center`}>
                                CALDO HA: <span className="float-right text-blue-700 font-extrabold">{plan.caldoHa.toFixed(0)} lt</span>
                            </div>
                            
                            {/* CAPACIDAD CUBA - AHORA SELECT */}
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

                            {/* CUBA - AHORA SELECT */}
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

                            {/* MÉTODO - AHORA SELECT */}
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

                        {/* Fila 7: N° CUBAS y DOSIS/CONSUMO */}
                        <div className="col-span-8 grid grid-cols-8 border-t border-gray-500">
                            {/* 🚀 N° CUBAS (SELECT 1-10) 🚀 */}
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

                {/* -------------------- COLUMNA DERECHA (20% - Normas y Observaciones) -------------------- */}
                <div className={rightColStyle}>
                    <div className="grid grid-cols-2 h-full">
                        
                        {/* OBSERVACIONES (CELDAS GRANDES) - Altura Ajustada de h-[100px] a h-[70px] */}
                        <div className={`${cellStyle} col-span-2 text-center bg-yellow-100 font-bold border-b border-gray-500 h-[70px] flex flex-col justify-start`}>
                            OBSERVACIONES:
                            <textarea className={`${cellInputStyle} bg-transparent h-full resize-none text-left font-normal text-xs mt-1`} rows="5" placeholder="Escribe aquí las observaciones..." />
                        </div>
                        
                        {/* NORMAS */}
                        <div className={`${cellStyle} col-span-2 text-center bg-yellow-100 font-bold border-b border-gray-500`}>NORMAS PARA EL USO EFICAZ Y SEGURO DE FITOSANITARIOS</div>
                        
                        {/* Lista de normas */}
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

            {/* -------------------- TABLA DE PRODUCTOS (Cuerpo del Recibo) -------------------- */}
            <div className="overflow-x-auto border-b-2 border-black">
                <table className="min-w-full border-collapse"> 
                    <thead className="bg-gray-100"> 
                        <tr className="text-gray-700">
                            {/* Encabezados de la Tabla */}
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
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[10]} text-green-700 ${stockColumnClass} ${hiddenInPrintClass}`}>STOCK</th> {/* OCULTAR EN IMPRESIÓN */}
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[11]} text-red-700`}>PREVISTO</th> 
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[12]}`}>REAL</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[13]}`}>EFICACIA</th>
                            <th className={`${cellHeaderStyle} ${tableHeaderClasses[14]} text-red-700 ${hiddenInPrintClass}`}>X</th> {/* 🛑 ENCABEZADO ELIMINAR 🛑 */}
                        </tr>
                    </thead>
                    <tbody className="bg-white"> 
                         {/* INTEGRACIÓN DIRECTA DE FILAS */}
                        {ordersArray.map((orden) => (
                             <tr key={orden.id} className="hover:bg-gray-50 transition duration-100">
                                {/* MOTIVO (Columna 1) */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.motivo} onChange={(e) => onOrderChange(orden.id, 'motivo', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. MOJANTE"/>
                                </td>
                                
                                {/* % (Porcentaje) (Columna 2) */}
                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} font-bold text-center`}>
                                    <input type="number" value={orden.porcentaje} onChange={(e) => onOrderChange(orden.id, 'porcentaje', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-center`} placeholder="100"/>
                                </td>

                                {/* PRODUCTO (Columna 3) - Selector */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <select
                                        value={orden.productoId || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            onOrderChange(orden.id, 'productoId', isNaN(value) ? null : value);
                                        }}
                                        className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} font-medium print-as-text`} 
                                    >
                                        <option value="" disabled>--- Seleccionar Producto ---</option>
                                        {PRODUCT_OPTIONS.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* COMPOSICION (Columna 4) */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.composicion} onChange={(e) => onOrderChange(orden.id, 'composicion', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. 90% MOJANTE"/>
                                </td>

                                {/* N° REGISTRO (Columna 5) */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.numRegistro} onChange={(e) => onOrderChange(orden.id, 'numRegistro', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')} placeholder="Ej. 24.087"/>
                                </td>

                                {/* PS (Columna 6) - Producto Sustitutivo */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                     <input type="text" value={orden.ps} onChange={(e) => onOrderChange(orden.id, 'ps', e.target.value)} className={cellInputStyle.replace('text-[10px]', 'text-[9px]')}/>
                                </td>
                                
                                {/* 1.000 lt (Columna 7) - Cantidad a Usar (INPUT CONECTADO AL STOCK) */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.cantidadUsada} onChange={(e) => onOrderChange(orden.id, 'cantidadUsada', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right font-extrabold text-red-700`} placeholder="0.00"/>
                                </td>

                                {/* HA (Columna 8) - Dosis por Hectárea */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.dosisHa} onChange={(e) => onOrderChange(orden.id, 'dosisHa', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>

                                {/* CUBA (Columna 9) - Dosis por Cuba */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.dosisCuba} onChange={(e) => onOrderChange(orden.id, 'dosisCuba', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>

                                {/* UNIDAD (Columna 10) - Stock Unidad (Display) */}
                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} text-center font-bold text-gray-600`}>
                                    {orden.stockUnidad || 'L/Kg'}
                                </td>

                                {/* STOCK (Columna 11) - Stock Restante/Final (CALCULADO) */}
                                <td 
                                    className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} ${stockColumnClass} text-center font-extrabold ${hiddenInPrintClass} ${
                                        orden.alerta 
                                            ? 'bg-red-200 text-red-800 animate-pulse' // Alerta visual
                                            : 'text-green-700'
                                    }`}
                                >
                                    {orden.productoId 
                                        ? (orden.stockRestante !== null 
                                            ? (orden.stockRestante < 0 ? `-${Math.abs(orden.stockRestante).toFixed(2)}` : orden.stockRestante.toFixed(2)) 
                                            : '---') 
                                        : 'N/A'}
                                </td>
                                
                                {/* PREVISTO (Columna 12) - INDEPENDIENTE */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.previsto} onChange={(e) => onOrderChange(orden.id, 'previsto', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right font-extrabold text-red-700`} placeholder="0.00"/>
                                </td>

                                {/* REAL (Columna 13) - Cantidad Real Aplicada */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="number" step="0.01" value={orden.real} onChange={(e) => onOrderChange(orden.id, 'real', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-right`} placeholder="0.00"/>
                                </td>
                                
                                {/* EFICACIA (Columna 14) - Calificación */}
                                <td className={cellStyle.replace('text-[10px]', 'text-[9px]')}>
                                    <input type="text" value={orden.eficacia} onChange={(e) => onOrderChange(orden.id, 'eficacia', e.target.value)} className={`${cellInputStyle.replace('text-[10px]', 'text-[9px]')} text-center`} placeholder="B"/>
                                </td>

                                {/* 🛑 BOTÓN ELIMINAR (Columna 15) 🛑 */}
                                <td className={`${cellStyle.replace('text-[10px]', 'text-[9px]')} text-center ${hiddenInPrintClass}`}>
                                    <button
                                        onClick={() => onDeleteRow(orden.id)}
                                        // Deshabilitar si solo hay una fila
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
            
            {/* 🚨 BOTÓN PARA AÑADIR FILAS 🚨 */}
            <div className="flex justify-center py-2 bg-gray-50 border-b border-black print:hidden">
                <button
                    onClick={onAddRow}
                    className="inline-flex items-center px-4 py-1.5 border border-indigo-600 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-150"
                >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Agregar Producto/Fila
                </button>
            </div>
            
            {/* -------------------- PIE DE PÁGINA (Footer) -------------------- */}
            <div className="grid grid-cols-10 border-t-2 border-black">
                
                {/* 1. Responsable/Aplicador/Instrucciones */}
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

                {/* 2. Confirmación del Tratamiento */}
                 <div className="col-span-2">
                    <div className="grid grid-cols-2">
                        <div className={`${cellStyle} col-span-2 text-center bg-blue-100 font-bold border-b border-gray-500`}>
                            CONFIRMACIÓN DEL TRATAMIENTO POR EL APLICADOR
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 3. Tabla de Confirmación Final (con 4 filas de datos) */}
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
                         {/* 4 Filas de datos para la confirmación (mantenidas) */}
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
// 🚀 COMPONENTE PRINCIPAL: OrdenFumigacionSimulador (Lógica de Stock)
// =========================================================================

const OrdenFumigacionSimulador = () => { 
    // Ahora, solo se inicia con el primer plan.
    const [planes, setPlanes] = useState([
        createNewPlan(1, 0), 
    ]);

    const [alertaModalState, setAlertaModalState] = useState({ visible: false, mensaje: null });
    const [alertaCriticaId, setAlertaCriticaId] = useState(null); 
    
    // Lógica de cálculo de stock (REVISADA Y CORREGIDA)
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
        
        // Inicializa el stock con el inventario base
        const stockActual = new Map(INVENTARIO_BASE.map(p => [p.id, p.stock]));
        const ordersProcessed = [];

        for (const orden of allOrders) {
            const ordenCalculada = { ...orden };
            const productoBase = orden.productoId ? findProduct(orden.productoId) : null;
            
            ordenCalculada.stockBase = productoBase?.stock || null;
            ordenCalculada.stockUnidad = productoBase?.unidad || null;
            
            if (orden.productoId) {
                const cantidad = parseFloat(orden.cantidadUsada) || 0;
                
                // Obtener el stock disponible ANTES de esta orden
                let stockDisponibleAntes = stockActual.get(orden.productoId) || 0;
                
                let stockDespues = stockDisponibleAntes - cantidad;
                ordenCalculada.alerta = false;

                if (cantidad > stockDisponibleAntes && cantidad > 0) {
                     ordenCalculada.alerta = true;
                }
                
                // 🚀 ESTO ASEGURA LA ACUMULACIÓN SECUENCIAL
                // El stock restante es el stock que queda DESPUÉS de esta orden
                stockActual.set(orden.productoId, stockDespues);
                ordenCalculada.stockRestante = stockDespues;
                
            } else {
                 // Si no hay producto, el stock restante es N/A
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
    }, [planes]); 
    
    // Lógica para mostrar el MODAL de Alerta 
    useEffect(() => {
        const primerAlertaCritica = planesCalculados.flatMap(p => p.ordenesCalculadas).find(o => o.alerta);
        
        if (primerAlertaCritica) {
            const prod = findProduct(primerAlertaCritica.productoId);
            const newAlertaId = `${primerAlertaCritica.planId}-${primerAlertaCritica.id}`;
            
            if (alertaCriticaId !== newAlertaId) {
                // Calcular stock disponible justo antes de esta orden
                const allOrdersBeforeCurrent = planesCalculados.flatMap(p => p.ordenesCalculadas)
                    .filter(o => o.planId < primerAlertaCritica.planId || (o.planId === primerAlertaCritica.planId && o.id < primerAlertaCritica.id));

                let stockDisponibleEnEseMomento = findProduct(primerAlertaCritica.productoId)?.stock || 0; 
                
                for(const orden of allOrdersBeforeCurrent) {
                    if(orden.productoId === primerAlertaCritica.productoId && orden.cantidadUsada) {
                         const cantidad = parseFloat(orden.cantidadUsada) || 0;
                         stockDisponibleEnEseMomento -= cantidad;
                    }
                }
                stockDisponibleEnEseMomento = Math.max(0, stockDisponibleEnEseMomento); 
                
                const cantidadSolicitada = parseFloat(primerAlertaCritica.cantidadUsada);
                const unidad = prod?.unidad || 'Unidades';

                // *** MENSAJE CON FORMATO JSX ***
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
    }, [planesCalculados, alertaCriticaId, alertaModalState.visible]); 

    const closeModal = () => {
        setAlertaModalState({ visible: false, mensaje: null });
    };

    const handlePlanChange = useCallback((planId, key, value, ordenId = null) => {
        setPlanes(prevPlanes => 
            prevPlanes.map(plan => {
                if (plan.id === planId) {
                    // Cambios a nivel de Plan (ordenId === null)
                    if (ordenId === null && key !== 'nuevaFila' && key !== 'actualizarConfirmacion' && key !== 'eliminarFila') {
                         return { ...plan, [key]: value };
                    } 
                    
                    // Manejar la actualización de filas de confirmación
                    if (key === 'actualizarConfirmacion') {
                        const { index, key: confKey, value: confValue } = value;
                        const newConfirmaciones = [...plan.confirmaciones];
                        newConfirmaciones[index] = { ...newConfirmaciones[index], [confKey]: confValue };
                        return { ...plan, confirmaciones: newConfirmaciones };
                    }
                    
                    // 🚨 AGREGAR NUEVA FILA DE PRODUCTO 🚨
                    if (key === 'nuevaFila') {
                        // Calcula el ID único (máximo ID existente + 1)
                        const nextId = plan.ordenes.length > 0 
                            ? Math.max(...plan.ordenes.map(o => o.id)) + 1 
                            : 1;
                        return { 
                            ...plan, 
                            ordenes: [...plan.ordenes, createNewOrderRow(nextId)] 
                        };
                    }
                    
                    // 🛑 NUEVA LÓGICA: ELIMINAR FILA DE PRODUCTO 🛑
                    if (key === 'eliminarFila') {
                        const idToDelete = value; // value contiene el ordenId a eliminar
                        
                        // Asegura que siempre quede al menos una fila
                        if (plan.ordenes.length <= 1) {
                             // No hay necesidad de mostrar alerta ya que el botón está deshabilitado en el componente hijo
                             return plan;
                        }

                        const newOrdenes = plan.ordenes.filter(orden => orden.id !== idToDelete);
                        return { ...plan, ordenes: newOrdenes };
                    }

                    // Cambios a nivel de Orden
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
    }, []); 

    const addPlan = () => {
        // Asegura que el nuevo ID sea el siguiente del último plan existente
        const newId = (planes.length ? planes[planes.length - 1].id : 0) + 1;
        setPlanes([...planes, createNewPlan(newId, planes.length)]); 
    };

    // 🛑 FUNCIÓN PARA ELIMINAR PLAN 🛑
    const deletePlan = useCallback((planId) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el Plan Fitosanitario #${planId}?\nEsta acción es irreversible.`)) {
            return;
        }
        setPlanes(prevPlanes => {
            const newPlanes = prevPlanes.filter(plan => plan.id !== planId);
            // Lógica para limpiar la alerta si el plan eliminado era el que la causaba
            const isAlertPlan = alertaCriticaId && alertaCriticaId.startsWith(`${planId}-`);
            if (isAlertPlan) {
                setAlertaCriticaId(null);
                setAlertaModalState({ visible: false, mensaje: null });
            }
            return newPlanes;
        });
    }, [alertaCriticaId]);


    // Función para manejar la impresión/exportación
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 p-4 md:p-8 bg-gray-100 min-h-screen">
            {/* Estilos CSS para impresión (saltos de página, ocultar stock y SELECTS) */}
            <style jsx global>{`
                @media print {
                    /* Oculta los elementos que no deben imprimirse */
                    .print:hidden, .print-button {
                        display: none !important;
                    }
                    
                    /* Fuerza un salto de página después de cada plan fitosanitario */
                    .print-page-break {
                        page-break-after: always;
                    }
                    
                    /* Asegura que el último plan no tenga un salto de página extra */
                    .print-page-break:last-child {
                        page-break-after: avoid;
                    }
                    
                    /* Oculta la columna STOCK (header y celdas) */
                    .stock-col {
                        display: none !important;
                    }
                    
                    /* 🚩 ESTILOS PARA OCULTAR SELECTS Y MOSTRAR SOLO EL TEXTO 🚩 */
                    .print-as-text {
                        -webkit-appearance: none; /* Chrome/Safari */
                        -moz-appearance: none; /* Firefox */
                        appearance: none; /* Standard */
                        background: none !important;
                        border: none !important;
                        padding-right: 0 !important; /* Elimina espacio para la flecha */
                        color: #000 !important; /* Asegura que el texto sea visible */
                    }
                    
                    /* Asegura que los selects impresos mantengan el valor de texto visible */
                    .print-as-text option {
                        display: none;
                    }
                    .print-as-text:after {
                        content: attr(value);
                        white-space: pre;
                    }
                }
            `}</style>
            
            <CriticalStockModal
                visible={alertaModalState.visible}
                mensaje={alertaModalState.mensaje}
                onClose={closeModal}
            />
            
            <h1 className="text-2xl text-center font-sans font-extrabold text-gray-800 print:hidden">
                Fitosanitario (Prueba v.06) - Planes
            </h1>

            {planesCalculados.map((plan) => (
                // 🛑 AÑADIMOS LA CLASE CLAVE AQUÍ 🛑
                <div key={plan.id} className="pb-8 print-page-break"> 
                    
                    {/* 🛑 Header con botón de eliminación (Solo en vista de simulación) 🛑 */}
                    <div className="flex justify-between items-center mb-2 px-2 print:hidden">
                        <h2 className="text-xl font-bold text-gray-700">Plan Fitosanitario <span className="text-indigo-600">#{plan.id}</span></h2>
                        
                        <button 
                            // Deshabilita el botón si solo queda un plan para evitar un estado vacío no deseado
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
                        // 🛑 PROP PARA ELIMINAR FILA 🛑
                        onDeleteRow={(ordenId) => handlePlanChange(plan.id, 'eliminarFila', ordenId)}
                    />
                </div>
            ))}
            
            <div className="flex flex-col sm:flex-row justify-center items-center pt-4 space-y-4 sm:space-y-0 sm:space-x-8 print:hidden">
                
                {/* Botón de Añadir Nuevo Plan (mantenido) */}
                <button 
                    onClick={addPlan}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                >
                    + Agregar Nuevo Plan/Día
                </button>
                
                {/* Botón de Impresión/Exportación (Diseño Avanzado) */}
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