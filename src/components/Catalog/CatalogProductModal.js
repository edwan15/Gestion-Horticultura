import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLeaf, FaSlidersH, FaUserTie, FaGlobe, FaBoxOpen } from 'react-icons/fa';
import { getUniqueManufacturers } from '../../data/catalogData';

const CatalogProductModal = ({ isOpen, onClose, product, onSave }) => {
    // Determine initial tab based on product category if possible, default to 'Fertilizante' style from screenshot
    const [activeTab, setActiveTab] = useState('producto'); 
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        type: '',
        subtype: '',
        technology: '',
        reference: '',
        usage: {
            pulverization: false,
            fertilization: false,
            biologicalControl: false
        }
    });

    // Populate form data when product changes
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                manufacturer: product.manufacturer || '',
                type: product.category || 'Fertilizante', // Map catalog category to Type
                subtype: product.subtype || '',
                technology: product.technology || '', // New field
                reference: product.authCode || '',     // Map authCode to Reference
                usage: {
                    pulverization: true, // Mock defaults
                    fertilization: product.category === 'Fertilizantes',
                    biologicalControl: false
                }
            });
            // Set icon/tab based on category
            if (product.category === 'Fertilizantes') setActiveTab('producto');
        }
    }, [product]);

    const manufacturers = getUniqueManufacturers();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (field) => {
        setFormData(prev => ({
            ...prev,
            usage: { ...prev.usage, [field]: !prev.usage[field] }
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-medium text-emerald-600">Detalles - Producto</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <FaTimes className="text-xl" />
                        </button>
                    </div>



                    {/* TABS ICON HEADER */}
                    <div className="flex justify-center gap-12 pt-8 pb-4 overflow-x-auto">
                        <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'producto' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('producto')}>
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'producto' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                <FaLeaf />
                            </div>
                            <span className="text-sm font-medium">General</span>
                        </div>
                        {formData.type === 'Fitosanitarios' && (
                             <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'detalles' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('detalles')}>
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'detalles' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                    <FaSlidersH />
                                </div>
                                <span className="text-sm font-medium">Detalles Técnicos</span>
                            </div>
                        )}
                        {/* New Tabs for Fertilizers */}
                         {(formData.type === 'Fertilizantes' || formData.type === 'Abono órgano-mineral PK líquido' || (product && product.nutrients)) && (
                            <>
                                <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'nutrientes' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('nutrientes')}>
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'nutrientes' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                        <FaLeaf />
                                    </div>
                                    <span className="text-sm font-medium">Nutrientes</span>
                                </div>
                                <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'componentes' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('componentes')}>
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'componentes' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                        <FaBoxOpen />
                                    </div>
                                    <span className="text-sm font-medium">Componentes</span>
                                </div>
                                 <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'seguridad' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('seguridad')}>
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'seguridad' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                        <FaUserTie />
                                    </div>
                                    <span className="text-sm font-medium">Seguridad</span>
                                </div>
                            </>
                        )}

                        <div className={`flex flex-col items-center gap-2 cursor-pointer ${activeTab === 'parametros' ? 'text-emerald-500' : 'text-gray-300'}`} onClick={() => setActiveTab('parametros')}>
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors ${activeTab === 'parametros' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                                <FaSlidersH />
                            </div>
                            <span className="text-sm font-medium">Configuración</span>
                        </div>
                    </div>

                    {/* BANNER CATALOGO PUBLICO */}
                    <div className="mx-8 bg-amber-50 border border-amber-100 rounded text-center py-3 mb-6">
                        <p className="text-amber-700 text-sm">
                            Este producto pertenece a un catálogo público. La información es de solo lectura.
                        </p>
                    </div>

                    {/* FORM CONTENT */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                        {activeTab === 'producto' && (
                            <div className="space-y-6">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400">Nombre</label>
                                        <div className="bg-gray-100 p-3 rounded text-gray-800 font-bold border border-gray-200">
                                            {formData.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400">Fabricante / Titular</label>
                                        <div className="bg-gray-100 p-3 rounded text-gray-700 font-medium border border-gray-200">
                                            {formData.manufacturer}
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400">Nº Registro</label>
                                        <div className="bg-gray-100 p-3 rounded text-gray-700 font-medium border border-gray-200">
                                            {formData.reference || '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                         <label className="text-xs font-bold text-gray-400">Subtipo</label>
                                        <div className="bg-gray-100 p-3 rounded text-gray-700 font-medium border border-gray-200">
                                            {formData.subtype || '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                         <label className="text-xs font-bold text-gray-400">Estado</label>
                                        <div className="bg-emerald-100 text-emerald-800 p-3 rounded font-bold border border-emerald-200">
                                            Vigente
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400">Composición</label>
                                    <div className="bg-blue-50 p-3 rounded text-blue-900 border border-blue-100 text-sm leading-relaxed">
                                        {product?.composition || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'detalles' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400">Fecha Inscripción</label>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700">
                                            {product?.inscriptionDate || '-'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400">Fecha Caducidad</label>
                                        <div className="bg-red-50 p-3 rounded border border-red-100 text-red-700 font-medium">
                                             {product?.expiryDate || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400">Observaciones / Usos</label>
                                    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-gray-600 text-sm whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto custom-scrollbar">
                                        {product?.observations || 'Sin observaciones registradas.'}
                                    </div>
                                </div>
                                
                                {product?.url && (
                                    <div className="pt-4">
                                        <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                                            <FaGlobe /> Ver ficha oficial en MAPA
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'nutrientes' && product?.nutrients && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Nutrient List */}
                                     {product.nutrients.map((nut, index) => (
                                         <div key={index} className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                                             <div className="text-sm font-bold text-emerald-800">{nut.name}</div>
                                             <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                                  <div><span className="text-emerald-600 font-medium">Total:</span> {nut.total}</div>
                                                  <div><span className="text-emerald-600 font-medium">Soluble:</span> {nut.soluble}</div>
                                                  {nut.chelated && nut.chelated !== '-' && (
                                                       <div className="col-span-2"><span className="text-emerald-600 font-medium">Quelado:</span> {nut.chelated}</div>
                                                  )}
                                             </div>
                                         </div>
                                     ))}
                                </div>
                                
                                <h3 className="text-sm font-bold text-gray-500 mt-4 uppercase">Propiedades Físico-Químicas</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {product.other_characteristics && Object.entries(product.other_characteristics).map(([key, val]) => (
                                         (val && val !== '-' && val !== '') && (
                                            <div key={key} className="bg-gray-50 p-3 rounded border border-gray-200">
                                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">{key}</div>
                                                <div className="text-sm font-bold text-gray-700">{val}</div>
                                            </div>
                                         )
                                     ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'componentes' && product?.raw_materials && (
                             <div className="space-y-6">
                                 <h3 className="text-lg font-bold text-gray-700">Materias Primas</h3>
                                 <div className="overflow-hidden border border-gray-200 rounded-lg">
                                     <table className="min-w-full divide-y divide-gray-200">
                                         <thead className="bg-gray-50">
                                             <tr>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                                             </tr>
                                         </thead>
                                         <tbody className="bg-white divide-y divide-gray-200">
                                             {product.raw_materials.map((mat, idx) => (
                                                 <tr key={idx}>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mat.description}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.code}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.percentage} %</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                     {product.raw_materials.length === 0 && (
                                         <div className="p-8 text-center text-gray-400">No se han especificado materias primas.</div>
                                     )}
                                 </div>
                                 
                                 {product?.microorganisms && Object.keys(product.microorganisms).length > 0 && (
                                     <>
                                         <h3 className="text-lg font-bold text-gray-700 mt-6">Microorganismos</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {Object.entries(product.microorganisms).map(([key, val]) => (
                                                  <div key={key} className="flex justify-between p-3 bg-purple-50 border border-purple-100 rounded">
                                                      <span className="text-sm font-medium text-purple-800">{key}</span>
                                                      <span className="text-sm font-bold text-purple-900">{val}</span>
                                                  </div>
                                              ))}
                                         </div>
                                     </>
                                 )}
                             </div>
                        )}

                        {activeTab === 'seguridad' && (
                             <div className="space-y-6">
                                 {product?.heavy_metals && (
                                     <div className="bg-white border border-gray-200 rounded-lg p-6">
                                         <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Metales Pesados</h3>
                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(product.heavy_metals).map(([key, val]) => (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-xs text-gray-400">{key}</span>
                                                    <span className={`font-bold ${parseFloat(val.replace(',','.')) > 0 ? 'text-gray-800' : 'text-gray-300'}`}>{val}</span>
                                                </div>
                                            ))}
                                         </div>
                                     </div>
                                 )}
                                 
                                 <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                                     <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2"><FaUserTie /> Información de Peligrosidad</h3>
                                      {product?.hazards && product.hazards.length > 0 ? (
                                          <div className="space-y-2 text-red-700 text-sm">
                                              {product.hazards.map((h, i) => <p key={i}>{h}</p>)}
                                          </div>
                                      ) : (
                                          <p className="text-gray-500 text-sm">No hay información de peligrosidad disponible.</p>
                                      )}
                                 </div>
                             </div>
                        )}

                        {activeTab === 'parametros' && (
                             <div className="text-center text-gray-400 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                 <p>Configuración de dosis y parámetros agronómicos no disponible para catálogos externos.</p>
                             </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="h-16 bg-emerald-500 flex justify-between items-center px-6 text-white shrink-0">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium text-sm transition-colors">
                            Borrar
                        </button>
                        <div className="flex gap-4 items-center">
                            <button onClick={onClose} className="hover:text-emerald-100 font-medium text-sm px-2 transition-colors">
                                Cancelar
                            </button>
                            <button className="hover:text-emerald-100 font-medium text-sm px-2 transition-colors">
                                Guardar y duplicar
                            </button>
                            <button 
                                onClick={() => onSave(formData)}
                                className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CatalogProductModal;
