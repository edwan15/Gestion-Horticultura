import React, { useState, useMemo } from 'react';
import { catalogData } from '../../data/catalogData'; // Adjust path as needed
// Adjust path as needed
// Importing large JSONs directly can cause heap memory issues.
// We will fetch them from public/data instead.
import { FaFilter, FaSearch, FaLeaf, FaBug, FaSeedling, FaBoxOpen, FaEllipsisV, FaChevronLeft } from 'react-icons/fa';
import CatalogProductModal from './CatalogProductModal';
import CatalogList from './CatalogList'; // Import the new List component

const Catalog = () => {
  // Navigation State
  const [view, setView] = useState('list'); // 'list' (catalogs) or 'browser' (products)
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  // Large Data State
  const [fitosData, setFitosData] = useState([]);
  const [fertsData, setFertsData] = useState([]);

  // Fetch Data on Mount
  React.useEffect(() => {
    // Fetch Fitosanitarios
    fetch('/data/mapa_fitosanitarios_scraped.json')
        .then(res => res.json())
        .then(data => setFitosData(data))
        .catch(err => console.error("Error loading fitos data:", err));

    // Fetch Fertilizers
    fetch('/data/fertilizers_detailed_scraped.json')
        .then(res => res.json())
        .then(data => setFertsData(data))
        .catch(err => console.error("Error loading ferts data:", err));
  }, []);

  // --- CATALOG BROWSER LOGIC ---
  const [activeTab, setActiveTab] = useState('Fitosanitarios');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Tabs configuration
  const tabs = [
    { id: 'Fitosanitarios', icon: FaBoxOpen, label: 'Fitosanitarios' },
    { id: 'Fertilizantes', icon: FaLeaf, label: 'Fertilizantes' },
    { id: 'EnemigosNaturales', icon: FaBug, label: 'Enemigos naturales' },
    { id: 'Trampas', icon: FaFilter, label: 'Trampas' }, 
    { id: 'Plantas', icon: FaSeedling, label: 'Plantas' },
    { id: 'Semillas', icon: FaSeedling, label: 'Semillas' },
    { id: 'Otros', icon: FaBoxOpen, label: 'Otros' },
  ];

  // Filtering Logic
  const filteredData = useMemo(() => {
    // 1. Determine Source Data
    let sourceData = [];
    if (activeTab === 'Fitosanitarios') {
        sourceData = fitosData;
    } else if (activeTab === 'Fertilizantes') {
        sourceData = fertsData.map(item => ({
            ...item,
            id: item.id || item.general_info?.registration_number,
            name: item.name || item.general_info?.commercial_name,
            manufacturer: item.general_info?.manufacturer || item.manufacturer,
            authCode: item.general_info?.registration_number || item.id,
            subtype: item.general_info?.product_type, // Map Product Type to Subtype
            composition: item.presentation?.form || 'No especificada', // Use Form (Liquid/Solid) or parsing
            useDeadline: (item.general_info?.registration_number || item.id)?.split('/')[1] || '-', // Extract Year from F000XXX/20XX
            catalogType: 'MAPA - Registro de Productos Fertilizantes',
            category: 'Fertilizantes'
        }));
    } else {
        sourceData = catalogData.filter(item => item.category === activeTab);
    }
    
    // 2. Filter by Search Term
    if (!searchTerm) return sourceData;
    
    const lowerTerm = searchTerm.toLowerCase();
    return sourceData.filter(item => (
        item.name?.toLowerCase().includes(lowerTerm) ||
        item.manufacturer?.toLowerCase().includes(lowerTerm) ||
        item.authCode?.toLowerCase().includes(lowerTerm) ||
        item.composition?.toLowerCase().includes(lowerTerm) ||
        item.id?.toLowerCase().includes(lowerTerm)
    ));
  }, [activeTab, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]); // Added itemsPerPage dependency

  // Search/Tab Handlers
  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset page on search
  };

  const handleTabChange = (tabId) => {
      setActiveTab(tabId);
      setCurrentPage(1); // Reset page on tab switch
  };

  const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleProductClick = (product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
  };

  const handleSaveProduct = (updatedData) => {
      console.log("Saving product data:", updatedData);
      setIsModalOpen(false);
  };

  const handleCatalogSelect = (catalog) => {
      setSelectedCatalog(catalog);
      setView('browser');
      // Auto-switch tab based on catalog?
      if (catalog.id.includes('fert')) {
          setActiveTab('Fertilizantes');
      } else {
          setActiveTab('Fitosanitarios');
      }
      setCurrentPage(1);
  };

  const handleBackToList = () => {
      setView('list');
      setSelectedCatalog(null);
  };

  // --- RENDER VIEW: LIST OF CATALOGS ---
  if (view === 'list') {
      return (
          <div className="bg-gray-50 min-h-screen p-6">
              <CatalogList onSelectCatalog={handleCatalogSelect} />
          </div>
      );
  }

  // --- RENDER VIEW: PRODUCT BROWSER ---
  return (
    <div className="bg-gray-50 min-h-screen p-6 relative">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button onClick={handleBackToList} className="text-gray-400 hover:text-emerald-600 p-1 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                    <FaChevronLeft />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {selectedCatalog ? selectedCatalog.name : 'Catálogo'}
                        {selectedCatalog?.flag && <span className="text-xl">{selectedCatalog.flag}</span>}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedCatalog 
                            ? `Fuente: ${selectedCatalog.source} • Actualizado: ${selectedCatalog.updatedAt}` 
                            : 'Explora tus productos disponibles'}
                    </p>
                </div>
             </div>
             <button className="bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-emerald-600 transition-colors">
                 Nuevo registro
             </button>
        </div>
        
        {/* TABS */}
        <div className="flex overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <tab.icon className={activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'} />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative col-span-1 md:col-span-2">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar por nombre, fabricante, sustancia..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:border-emerald-500 outline-none text-sm"
            />
          </div>
      </div>

      {/* LIST HEADER */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Nombre <span className="text-gray-300 font-normal normal-case ml-1">Fabricante</span></div>
          <div className="col-span-2">Cód. Aut. <span className="text-gray-300 font-normal normal-case ml-1">Fechas límite</span></div>
          <div className="col-span-1">Subtipo</div>
          <div className="col-span-2">Formulación <span className="text-gray-300 font-normal normal-case ml-1">Sustancias</span></div>
          <div className="col-span-2">Catálogo</div>
          <div className="col-span-2 text-right">Acciones</div>
      </div>

      {/* DATA LIST */}
      <div className="space-y-2">
        {currentData.map((item) => (
            <div 
                key={item.id} 
                onClick={() => handleProductClick(item)} 
                className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-12 gap-4 items-center hover:shadow-md transition-shadow group cursor-pointer"
            >
                {/* COL 1: Name & Manufacturer */}
                <div className="col-span-3">
                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase">{item.manufacturer}</p>
                </div>

                {/* COL 2: Codes & Deadline */}
                <div className="col-span-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-700">{item.authCode}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Uso {item.useDeadline || '-'}</span>
                        </div>
                    </div>
                </div>

                 {/* COL 3: Subtype */}
                 <div className="col-span-1">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{item.subtype || '-'}</span>
                </div>

                {/* COL 4: Formulation */}
                <div className="col-span-2">
                     <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                        {item.composition || '-'}
                     </p>
                </div>

                 {/* COL 5: Catalog Type */}
                 <div className="col-span-2">
                    <span className="text-xs text-gray-500 italic block">{item.catalogType}</span>
                    <a href="#" className="text-xs text-emerald-600 hover:underline mt-1 inline-block">Seleccionar cultivo en filtros</a>
                </div>

                 {/* COL 6: Actions */}
                 <div className="col-span-2 flex justify-end">
                    <button className="text-gray-400 hover:text-emerald-600 p-2 transition-colors">
                        <FaEllipsisV />
                    </button>
                 </div>
            </div>
        ))}

        {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                <p>No se encontraron productos en esta categoría.</p>
            </div>
        )}
      </div>

       {/* PAGINATION CONTROLS */}
       {totalPages > 1 && (
           <div className="mt-6 flex justify-center gap-2 text-sm text-gray-600 items-center">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`font-medium px-3 py-1 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:text-emerald-600 cursor-pointer'}`}
              >
                Anterior
              </button>
              
              <div className="flex gap-1">
                  {/* Sliding Window Pagination */}
                  {Array.from({ length: 5 }, (_, i) => {
                      // Center around current page
                      let p = currentPage - 2 + i;
                      // Adjust if close to start
                      if (currentPage < 3) p = 1 + i;
                      // Adjust if close to end
                      if (currentPage > totalPages - 2) p = totalPages - 4 + i;
                      
                      // Bounds check
                      if (p < 1 || p > totalPages) return null;

                      return (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded transition-colors ${currentPage === p ? 'bg-emerald-500 text-white' : 'hover:bg-gray-200'}`}
                          >
                              {p}
                          </button>
                      );
                  })}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`font-medium px-3 py-1 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:text-emerald-600 cursor-pointer'}`}
              >
                Siguiente
              </button>
              
              <span className="ml-4 text-xs text-gray-400">
                  Página {currentPage} de {totalPages}
              </span>
          </div>
       )}

      <CatalogProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
          onSave={handleSaveProduct}
      />

    </div>
  );
};

export default Catalog;
