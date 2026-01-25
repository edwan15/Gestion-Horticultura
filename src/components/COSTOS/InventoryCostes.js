import React, { useState, useRef, useEffect } from 'react';
// import { useReactToPrint } from 'react-to-print'; // Removed

const InventoryCostes = () => {
  // --- STATE: INVERNADEROS & MAP EDITING ---
  const [invernaderos, setInvernaderos] = useState([
    { 
      id: 1, 
      area: '3.850 Ha', 
      points: '5,0 100,0 100,75 85,95 40,100 0,85', 
      cultivo: 'Inv 1 Pimiento Cali Rojo 2026',
      notas: '',
      lines: [],
      textPos: { x: 50, y: 50 } 
    },
    { 
      id: 2, 
      area: '1.120 Ha', 
      points: '15,0 100,10 85,100 0,85', 
      cultivo: 'Inv 2 Calabacín 2026',
      notas: '',
      lines: [],
      textPos: { x: 50, y: 50 }
    },
    { 
      id: 3, 
      area: '1.920 Ha', 
      points: '0,0 100,0 100,100 25,100 25,75 0,75', 
      cultivo: 'Pimiento Avileses',
      notas: '99.710 plantas totales',
      lines: [],
      textPos: { x: 50, y: 50 }
    },
    { 
      id: 4, 
      area: '1.550 Ha', 
      points: '20,0 100,5 80,100 0,95', 
      cultivo: 'Inv 4 Calabacín 2026',
      notas: '',
      lines: [],
      textPos: { x: 50, y: 50 }
    },
    { 
      id: 5, 
      area: '0.600 Ha', 
      points: '10,0 90,0 100,100 0,100', 
      cultivo: 'Pimiento Tallante',
      notas: '29.795 plantas totales',
      lines: [],
      textPos: { x: 50, y: 50 }
    }
  ]);

  const [mapEditMode, setMapEditMode] = useState(false);
  const [textMoveMode, setTextMoveMode] = useState(false);
  const [draggingText, setDraggingText] = useState({ active: false, invId: null, startX: 0, startY: 0 });
  const [drawingState, setDrawingState] = useState({ active: false, start: null, currentInvId: null });
  
  // --- PRINT REF & HANDLER ---
  // --- SCRIPTS LOADING & EXPORT HANDLER ---
  useEffect(() => {
    const loadScript = (src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
      }
    };

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.js");
  }, []);

  const componentRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!window.html2canvas || !window.jspdf) {
      alert("Las librerías de exportación se están cargando. Inténtalo de nuevo en unos segundos.");
      return;
    }

    setIsExporting(true);
    const input = componentRef.current;
    
    try {
      const canvas = await window.html2canvas(input, { 
        scale: 3, // Higher resolution
        useCORS: true,
        windowWidth: 1600, // Force desktop width for grid layout
        onclone: (clonedDoc) => {
            // Apply specific styles for the PDF export in the clone
            const element = clonedDoc.querySelector('.print-padding');
            if(element) {
                element.style.padding = '20px';
                element.style.backgroundColor = 'white';
            }
            
            // Hide elements with 'no-print' class manually in the clone
            // (html2canvas ignores @media print, so we do this manually)
            const noPrintElements = clonedDoc.querySelectorAll('.no-print');
            noPrintElements.forEach(el => el.style.display = 'none');

            // Force grid 3 columns if needed (tailwind lg:grid-cols-3 might rely on viewport)
            // But windowWidth: 1600 usually handles it.
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, Millimeters, A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      
      // Calculate dimensions to fit exactly on width
      let printWidth = pdfWidth;
      let printHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // LOGIC TO FIT ON ONE PAGE:
      // If the calculated height is greater than the page height,
      // scale it down to fit the height instead.
      if (printHeight > pdfHeight) {
          const scaleFactor = pdfHeight / printHeight;
          printWidth = printWidth * scaleFactor;
          printHeight = pdfHeight;
      }

      // Center the image consistently if it has been scaled down horizontally
      const xOffset = (pdfWidth - printWidth) / 2;
      const yOffset = 0; // Top aligned

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, printWidth, printHeight);
      pdf.save('Informe_Parcelas_Eurofruits.pdf');
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Hubo un error al generar el PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // Update text/notes of greenhouse
  const handleUpdateGreenhouse = (id, field, value) => {
    setInvernaderos(prev => prev.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  // --- MAP INTERACTION HANDLERS ---
  const getCoordinates = (e, svgElement) => {
    const point = svgElement.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  const handleSvgClick = (e, invId) => {
    if (!mapEditMode) return;

    const coords = getCoordinates(e, e.currentTarget);

    if (!drawingState.active) {
      setDrawingState({ active: true, start: coords, currentInvId: invId });
    } else {
      if (drawingState.currentInvId === invId) {
        setInvernaderos(prev => prev.map(inv => {
          if (inv.id === invId) {
            return {
              ...inv,
              lines: [...inv.lines, { x1: drawingState.start.x, y1: drawingState.start.y, x2: coords.x, y2: coords.y }]
            };
          }
          return inv;
        }));
      }
      setDrawingState({ active: false, start: null, currentInvId: null });
    }
  };

  const clearLines = (invId) => {
    setInvernaderos(prev => prev.map(inv => 
        inv.id === invId ? { ...inv, lines: [] } : inv
    ));
  };


  // --- TEXT DRAGGING HANDLERS ---
  const handleTextMouseDown = (e, invId) => {
    if (!textMoveMode) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent map click
    setDraggingText({ active: true, invId });
  };

  const handleTextMouseMove = (e, containerRef) => {
    if (!draggingText.active || !containerRef) return;
    
    const rect = containerRef.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Corrected calculation

    // Clamp values between 0 and 100 to keep inside container
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setInvernaderos(prev => prev.map(inv => 
      inv.id === draggingText.invId ? { ...inv, textPos: { x: clampedX, y: clampedY } } : inv
    ));
  };

  const handleTextMouseUp = () => {
    setDraggingText({ active: false, invId: null, startX: 0, startY: 0 });
  };
  
  // Effect to handle global mouse up/move for smoother dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
       if (draggingText.active) handleTextMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [draggingText.active]);



  // --- STATE: REGISTROS CRUD ---
  const [registros, setRegistros] = useState([
    { id: 1, fecha: '16/01/2026', variedad: 'TALLANTE (INVERNADERO 5)', semillas: '29.795', marco: '1-8X6 FILAS', estado: 'ACTIVO' },
    { id: 2, fecha: '12/01/2026', variedad: 'AVILESES (INVERNADERO 3)', semillas: '61.360', marco: '1-8X6 FILAS', estado: 'ACTIVO' },
    { id: 3, fecha: '10/01/2026', variedad: 'AVILESES (INVERNADERO 3)', semillas: '38.350', marco: '1-8X6 FILAS', estado: 'ACTIVO' },
    { id: 4, fecha: '12/01/2026', variedad: 'ALYSSUM LOBULA', semillas: '600', marco: 'AUXILIAR', estado: 'ACTIVO' }
  ]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [tempRowData, setTempRowData] = useState({});

  // CRUD Handlers
  const handleAddNew = () => {
    const newId = Math.max(...registros.map(r => r.id), 0) + 1;
    const newRow = { id: newId, fecha: '', variedad: '', semillas: '', marco: '', estado: 'ACTIVO' };
    setRegistros([...registros, newRow]);
    setEditingRowId(newId);
    setTempRowData(newRow);
  };

  const handleEditRow = (row) => {
    setEditingRowId(row.id);
    setTempRowData(row);
  };

  const handleSaveRow = () => {
    setRegistros(prev => prev.map(r => r.id === editingRowId ? tempRowData : r));
    setEditingRowId(null);
    setTempRowData({});
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setTempRowData({});
  };

  const handleDeleteRow = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setRegistros(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleInputChange = (field, value) => {
    setTempRowData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen font-sans text-slate-900">
      
      {/* Styles for Printing */}
      <style>{`
        @media print {
            .no-print { display: none !important; }
            .print-padding { padding: 20px !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            input, textarea { border: none !important; background: transparent !important; }
        }
      `}</style>

      {/* Printable Area Wrapper */}
      <div ref={componentRef} className="print-padding">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-lg shadow-md border-l-8 border-blue-600 print:shadow-none print:border-none">
            <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Gestión de Parcelas</h1>
            <p className="text-blue-600 font-bold italic">EUROFRUITS AGRO • Balsicas</p>
            </div>
            <div className="text-right">
            <p className="text-xs text-slate-400 font-mono uppercase">Superficie Total Registrada</p>
            <p className="text-3xl font-black text-slate-900 font-mono text-green-600">9.05 <span className="text-sm">ha</span></p>
            </div>
        </div>

        {/* Map Actions (Hidden on Print) */}
        <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="text-xl font-bold text-slate-700">Mapa General</h2>
            <button 
            onClick={() => setMapEditMode(!mapEditMode)}
            className={`px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors ${
                mapEditMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            >
            {mapEditMode ? 'Salir Modo Edición' : 'Editar / Dividir Parcelas'}
            </button>
            <button 
                onClick={() => setTextMoveMode(!textMoveMode)}
                className={`ml-2 px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors ${
                    textMoveMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-slate-700 text-white hover:bg-slate-800'
                }`}
            >
                {textMoveMode ? 'Terminar Mover' : 'Mover Etiquetas'}
            </button>
        </div>

        {/* Greenhouses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 print:grid-cols-3 gap-4">
            {invernaderos.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:break-inside-avoid">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold print:text-black print:bg-transparent print:border print:border-black">{inv.id}</span>
                    <span className="font-bold text-slate-700 uppercase text-sm">Invernadero {inv.id}</span>
                </div>
                <div className="flex items-center gap-2">
                    {mapEditMode && inv.lines.length > 0 && (
                        <button onClick={() => clearLines(inv.id)} className="text-[10px] text-red-500 underline font-bold no-print">Limpiar Líneas</button>
                    )}
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded print:text-black print:bg-transparent">{inv.area}</span>
                </div>
                </div>

                <div 
                    className={`aspect-video w-full relative flex p-4 bg-slate-50 group print:bg-white ${mapEditMode ? 'cursor-crosshair' : ''}`}
                    onMouseMove={(e) => handleTextMouseMove(e, e.currentTarget)}
                >
                {/* SVG Visualization */}
                <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="w-full h-full drop-shadow-md print:drop-shadow-none absolute inset-0 pointer-events-none" 
                    // Made pointer-events-none so we can drag text easier, 
                    // but we need to re-enable them for drawing lines.
                    // Actually, for drawing lines we need clicks on the SVG or container.
                    // Let's use logic below to handle clicks properly.
                >
                    <polygon 
                        points={inv.points} 
                        fill="#dbeafe" 
                        stroke="#3b82f6" 
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        style={{ fillOpacity: 0.6, pointerEvents: mapEditMode ? 'auto' : 'none' }}
                        // Only auto pointer events on polygon when in map edit mode
                        onClick={(e) => handleSvgClick(e, inv.id)}
                    />
                    {inv.lines.map((line, i) => (
                        <line 
                            key={i}
                            x1={line.x1} y1={line.y1}
                            x2={line.x2} y2={line.y2}
                            stroke="red"
                            strokeWidth="1.5"
                            strokeDasharray="4"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    {mapEditMode && drawingState.active && drawingState.currentInvId === inv.id && (
                        <circle cx={drawingState.start.x} cy={drawingState.start.y} r="2" fill="red" />
                    )}
                </svg>

                <div 
                    className={`absolute flex flex-col items-center justify-center p-2 text-center transition-shadow
                        ${textMoveMode ? 'cursor-move ring-2 ring-orange-400 bg-white/50 rounded-lg shadow-lg z-10' : ''} 
                        ${mapEditMode ? 'pointer-events-none opacity-50' : ''}
                    `}
                    style={{ 
                        left: `${inv.textPos ? inv.textPos.x : 50}%`, 
                        top: `${inv.textPos ? inv.textPos.y : 50}%`, 
                        transform: 'translate(-50%, -50%)',
                        width: '80%' // Constrain width reasonably
                    }}
                    onMouseDown={(e) => handleTextMouseDown(e, inv.id)}
                >
                    <input
                    type="text"
                    value={inv.cultivo}
                    onChange={(e) => handleUpdateGreenhouse(inv.id, 'cultivo', e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-blue-400 focus:border-blue-600 focus:bg-white/80 text-sm font-bold text-slate-800 w-full text-center outline-none transition-all placeholder:text-slate-400"
                    placeholder="Cultivo..."
                    disabled={textMoveMode} // Disable typing while moving
                    />
                    <textarea
                    value={inv.notas}
                    onChange={(e) => handleUpdateGreenhouse(inv.id, 'notas', e.target.value)}
                    className="bg-transparent border-none text-[11px] text-slate-600 w-full text-center mt-2 resize-none h-16 outline-none hover:bg-white/50 focus:bg-white/80 rounded p-1 transition-all placeholder:text-slate-300"
                    placeholder="Notas..."
                    disabled={textMoveMode} // Disable typing while moving
                    />
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* CRUD Table */}
        <div className="mt-10 overflow-hidden rounded-lg shadow-lg border border-slate-900 print:shadow-none print:border-gray-500">
            <div className="bg-slate-900 p-4 flex justify-between items-center print:bg-white print:border-b print:border-black">
                <h2 className="text-white text-sm font-bold uppercase tracking-widest print:text-black">Registro de Siembra y Variedades</h2>
                <button 
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded uppercase tracking-wider flex items-center gap-2 transition-colors no-print"
                >
                + Agregar
                </button>
            </div>
            <div className="bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200 print:bg-gray-100">
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Fecha</th>
                    <th className="p-4 text-[11px] font-bold text-blue-600 uppercase print:text-black">Variedad / Zona</th>
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase text-right">Semillas</th>
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Marco</th>
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase text-right">Estado</th>
                    <th className="p-4 text-[11px] font-bold text-slate-500 uppercase text-center no-print">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {registros.map((reg) => (
                    <tr key={reg.id} className="hover:bg-blue-50 transition-colors print:hover:bg-transparent">
                    {editingRowId === reg.id ? (
                        <>
                        <td className="p-2"><input type="text" className="w-full border rounded p-1 text-xs" value={tempRowData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)} /></td>
                        <td className="p-2"><input type="text" className="w-full border rounded p-1 text-xs font-bold text-blue-700" value={tempRowData.variedad} onChange={(e) => handleInputChange('variedad', e.target.value)} /></td>
                        <td className="p-2"><input type="text" className="w-full border rounded p-1 text-xs text-right font-mono" value={tempRowData.semillas} onChange={(e) => handleInputChange('semillas', e.target.value)} /></td>
                        <td className="p-2"><input type="text" className="w-full border rounded p-1 text-xs" value={tempRowData.marco} onChange={(e) => handleInputChange('marco', e.target.value)} /></td>
                        <td className="p-2 text-right">
                            <select className="border rounded p-1 text-xs" value={tempRowData.estado} onChange={(e) => handleInputChange('estado', e.target.value)}>
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="FINALIZADO">FINALIZADO</option>
                            </select>
                        </td>
                        <td className="p-2 text-center flex justify-center gap-2 no-print">
                            <button onClick={handleSaveRow} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Guardar</button>
                            <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">X</button>
                        </td>
                        </>
                    ) : (
                        <>
                        <td className="p-4 text-slate-600">{reg.fecha}</td>
                        <td className="p-4 text-blue-700 font-bold tracking-tight print:text-black">{reg.variedad}</td>
                        <td className="p-4 text-right font-mono font-bold pr-12">{reg.semillas}</td>
                        <td className="p-4 text-slate-500 font-semibold">{reg.marco}</td>
                        <td className="p-4 text-right">
                            <span className={`text-xs tracking-widest font-bold px-2 py-0.5 rounded border ${reg.estado === 'ACTIVO' ? 'text-green-600 border-green-600' : 'text-gray-500 border-gray-500'} print:text-black print:border-black`}>
                            {reg.estado}
                            </span>
                        </td>
                        <td className="p-4 text-center no-print">
                            <div className="flex justify-center gap-2">
                                <button onClick={() => handleEditRow(reg)} className="text-blue-500 hover:text-blue-700 font-bold text-xs">EDITAR</button>
                                <button onClick={() => handleDeleteRow(reg.id)} className="text-red-400 hover:text-red-600 font-bold text-xs">ELIMINAR</button>
                            </div>
                        </td>
                        </>
                    )}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em] print:text-slate-600">
            Sistema de Visualización HortiDash • {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Static Print Button (Bottom) */}
      <div className="mt-8 flex justify-center no-print pb-8">
         <button 
           onClick={exportToPDF}
           disabled={isExporting}
           className={`bg-slate-900 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2 font-bold uppercase tracking-wider text-sm ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {isExporting ? 'Generando PDF...' : 'Exportar PDF'}
         </button>
      </div>

    </div>
  );
};

export default InventoryCostes;
