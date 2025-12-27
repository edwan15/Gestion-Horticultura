import React from 'react';
import { FaGlobe, FaBuilding, FaChevronRight, FaSync } from 'react-icons/fa';

const CatalogList = ({ onSelectCatalog }) => {
    // Mock Data based on screenshot
    const catalogs = [
        {
            id: 'fert_mapa',
            name: 'Fertilizantes (MAPA)',
            type: 'Público',
            source: 'MAPA',
            flag: '🇪🇸',
            sharedWith: ['EURO Balsicas', 'Fichajes EcosAgile', 'Finca Fruitrack Prueba', 'WFC Otras Fincas'],
            productsCount: 1681,
            updatedAt: '2024-06-25',
            status: 'Catálogo público'
        },
        {
            id: 'fitos_comunes',
            name: 'Fitos Denom Comunes',
            type: 'Privado',
            source: 'Horticultura Del Sureste SL', // inferred
            flag: null,
            sharedWith: ['COE', 'EURO Balsicas', 'Fichajes EcosAgile', '...'],
            productsCount: 13,
            updatedAt: '2023-02-14',
            status: 'Israel Martínez' // Updated by
        },
        {
            id: 'fito_mapa',
            name: 'Fitosanitarios (MAPA)',
            type: 'Público',
            source: 'MAPA',
            flag: '🇪🇸',
            sharedWith: ['COE', 'EURO Balsicas', 'Fichajes EcosAgile', '...'],
            productsCount: 2191,
            updatedAt: '2025-11-07',
            status: 'Catálogo público'
        },
        {
            id: 'fito_comunes_mapa',
            name: 'Fitosanitarios - Denominaciones Comunes (MAPA)',
            type: 'Público',
            source: 'MAPA',
            flag: null, 
            sharedWith: ['COE', 'EURO Balsicas', 'Fichajes EcosAgile', '...'],
            productsCount: 2052,
            updatedAt: '2025-11-07',
            status: 'Catálogo público'
        },
         {
            id: 'abonos_grupo',
            name: 'Listado Abonos GRUPO',
            type: 'Privado',
            source: 'Horticultura Del Sureste SL',
            flag: null, 
            sharedWith: ['COE', 'EURO Balsicas', 'Fichajes EcosAgile', '...'],
            productsCount: 369,
            updatedAt: '2024-08-01',
            status: 'Israel Martínez'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">Catálogos</h2>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">{catalogs.length} activos</span>
                </div>
                <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-emerald-600 p-2">
                        <FaSync />
                    </button>
                </div>
             </div>

             {/* Table Header */}
             <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                <div className="col-span-4">Nombre</div>
                <div className="col-span-4">Compartido con - Fincas</div>
                <div className="col-span-1 text-center">Productos</div>
                <div className="col-span-2">Actualizado en</div>
                <div className="col-span-1"></div>
             </div>

             {/* List */}
            <div className="divide-y divide-gray-100">
                {catalogs.map((catalog) => (
                    <div 
                        key={catalog.id} 
                        onClick={() => onSelectCatalog(catalog)}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        {/* Name Column */}
                        <div className="col-span-4">
                            <div className="flex items-start gap-3">
                                <div className="text-gray-300 mt-1">
                                    <FaBuilding /> {/* Placeholder icon for vertical dots/logo */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                        {catalog.name}
                                        {catalog.flag && <span className="text-base">{catalog.flag}</span>}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs mt-0.5">
                                        <span className={`px-1.5 py-0.5 rounded ${catalog.type === 'Público' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {catalog.type}
                                        </span>
                                        <span className="text-gray-400">{catalog.source}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shared Column */}
                        <div className="col-span-4">
                             <div className="flex flex-wrap gap-1">
                                 {catalog.sharedWith.slice(0, 3).map((farm, idx) => (
                                     <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded border border-gray-200">
                                         {farm}
                                     </span>
                                 ))}
                                 {catalog.sharedWith.length > 3 && (
                                     <span className="text-[10px] text-emerald-600 font-medium cursor-pointer hover:underline">
                                         Mostrar todo (+{catalog.sharedWith.length - 3})
                                     </span>
                                 )}
                             </div>
                        </div>

                        {/* Products Count */}
                        <div className="col-span-1 text-center">
                            <span className="text-sm font-semibold text-gray-700">{catalog.productsCount}</span>
                        </div>

                        {/* Updated At */}
                        <div className="col-span-2">
                             <div className="text-xs text-gray-800 font-medium">{catalog.updatedAt}</div>
                             <div className={`text-[10px] ${catalog.status === 'Catálogo público' ? 'text-amber-600' : 'text-gray-500'}`}>
                                 {catalog.status}
                             </div>
                        </div>

                        {/* Arrow */}
                        <div className="col-span-1 flex justify-end text-gray-300 group-hover:text-emerald-500">
                            <FaChevronRight />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogList;
