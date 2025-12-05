import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Removed onAuthStateChanged
import { getFirestore, collection, query, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { 
    FaFilter, FaSearch, FaCalendarAlt, FaEuroSign, FaEdit, FaTrash, 
    FaChevronDown, FaChevronUp, FaTimes, FaFileExport, FaSeedling,
    FaUsers, FaTools, FaBuilding, FaClock, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import { GiFarmer } from 'react-icons/gi';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();
const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`;
const PROJECTS_COLLECTION_PATH = `artifacts/${appId}/public/data/projects`;

// Operaciones disponibles (mismo que TimeSheetWizard)
const OPERATIONS = [
    { id: '01', name: 'Fumigar' },
    { id: '02', name: 'Instalar riego' },
    { id: '03', name: 'Desmontar Riego' },
    { id: '04', name: 'Riego' },
    { id: '05', name: 'Labores hierba' },
    { id: '06', name: 'Labores plástico' },
    { id: '07', name: 'Entutorado / Poda' },
    { id: '08', name: 'Trasplante/siembra' },
    { id: '09', name: 'Recolección' },
    { id: '10', name: 'Mantenimiento finca' },
    { id: '11', name: 'Ventilación Invernaderos' },
    { id: '12', name: 'Transporte mercancía' },
    { id: '13', name: 'Traslado maquinaria' },
    { id: '14', name: 'Preparación tierra' },
    { id: '15', name: 'Labores pre-trasplante' },
    { id: '16', name: 'Desbrozar' },
    { id: '17', name: 'Supervisión' },
];

// Categorías de costes
const CATEGORIES = [
    { id: 'mano_obra', name: 'Mano de Obra', color: 'blue' },
    { id: 'servicios', name: 'Servicios', color: 'green' },
    { id: 'productos', name: 'Productos', color: 'orange' },
    { id: 'equipo', name: 'Equipo', color: 'purple' },
    { id: 'infraestructura', name: 'Infraestructura', color: 'red' },
    { id: 'otros', name: 'Otros', color: 'gray' },
];

// Componente de Filtro Individual
const FilterSelect = ({ label, value, onChange, options, icon: Icon, placeholder = "Todos" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                {Icon && <Icon className="text-sm" />}
                {label}
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
                <span className={value ? "text-gray-900" : "text-gray-400"}>
                    {value ? options.find(opt => opt.value === value)?.label || placeholder : placeholder}
                </span>
                {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                            <span className="text-gray-400">{placeholder}</span>
                        </button>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 transition-colors ${
                                    value === option.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// Componente de Chip de Filtro Activo
const FilterChip = ({ label, onRemove }) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
        <span>{label}</span>
        <button onClick={onRemove} className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors">
            <FaTimes className="text-xs" />
        </button>
    </div>
);

// Componente Principal
const CostesManager = () => {
    // Estados de autenticación
    const userId = useSelector(selectUserId);
    
    // Estados de datos
    const [timesheets, setTimesheets] = useState([]);
    const [availableLocals, setAvailableLocals] = useState([]);
    const [availableWorkers, setAvailableWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    
    // Filtros
    const [filters, setFilters] = useState({
        searchText: '',
        localId: '',
        operationId: '',
        workerId: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        period: 'ultimo_mes', // último_mes, este_mes, este_año, personalizado
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Ordenamiento
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Cargar datos de Firestore - Timesheets
    useEffect(() => {
        if (!db || !userId) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, TIMESHEET_COLLECTION_PATH),
            where("createdBy", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTimesheets(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading timesheets:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // Cargar locales/proyectos
    useEffect(() => {
        if (!db || !userId) return;

        const q = query(
            collection(db, PROJECTS_COLLECTION_PATH),
            where("createdBy", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableLocals(data);
        }, (error) => {
            console.error("Error loading locals:", error);
        });

        return () => unsubscribe();
    }, [userId]);

    // Cargar trabajadores
    useEffect(() => {
        if (!db || !userId) return;

        const q = query(
            collection(db, WORKERS_COLLECTION_PATH),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableWorkers(data);
        }, (error) => {
            console.error("Error loading workers:", error);
        });

        return () => unsubscribe();
    }, [userId]);

    // Aplicar filtros de período
    const getDateRange = () => {
        const today = new Date();
        let startDate, endDate;

        switch (filters.period) {
            case 'ultimo_mes':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                endDate = today;
                break;
            case 'este_mes':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = today;
                break;
            case 'este_año':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = today;
                break;
            case 'personalizado':
                startDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
                endDate = filters.dateTo ? new Date(filters.dateTo) : null;
                break;
            default:
                return { startDate: null, endDate: null };
        }

        return { startDate, endDate };
    };

    // Datos filtrados
    const filteredData = useMemo(() => {
        let filtered = [...timesheets];

        // Filtro de búsqueda
        if (filters.searchText) {
            const search = filters.searchText.toLowerCase();
            filtered = filtered.filter(item =>
                item.workerName?.toLowerCase().includes(search) ||
                item.operationName?.toLowerCase().includes(search) ||
                item.localName?.toLowerCase().includes(search)
            );
        }

        // Filtro por local/cultivo
        if (filters.localId) {
            filtered = filtered.filter(item => item.localId === filters.localId);
        }

        // Filtro por operación
        if (filters.operationId) {
            filtered = filtered.filter(item => item.operationId === filters.operationId);
        }

        // Filtro por trabajador
        if (filters.workerId) {
            filtered = filtered.filter(item => item.workerId === filters.workerId);
        }

        // Filtro por categoría (todos son mano de obra por ahora)
        // Nota: Solo se mostrarán registros si se selecciona "Mano de Obra" o "Todos" (vacío)
        if (filters.category && filters.category !== 'mano_obra') {
            filtered = [];
        }

        // Filtro por rango de fechas
        const { startDate, endDate } = getDateRange();
        if (startDate || endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                if (startDate && itemDate < startDate) return false;
                // Para incluir el día final completo, ajustamos el endDate para ser medianoche del día siguiente
                if (endDate) {
                    const adjustedEndDate = new Date(endDate);
                    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Día siguiente
                    if (itemDate >= adjustedEndDate) return false;
                }
                return true;
            });
        }

        return filtered;
    }, [timesheets, filters]);

    // Datos ordenados
    const sortedData = useMemo(() => {
        let sorted = [...filteredData];

        if (sortConfig.key) {
            sorted.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Manejo especial para fechas
                if (sortConfig.key === 'date') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }

                // Manejo especial para números
                if (sortConfig.key === 'totalHours' || sortConfig.key === 'ratePerHour') {
                    // Usamos el operador ?? 0 para manejar null/undefined de forma segura
                    aValue = parseFloat(aValue ?? 0) || 0; 
                    bValue = parseFloat(bValue ?? 0) || 0;
                }

                // Manejo para strings (case-insensitive)
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sorted;
    }, [filteredData, sortConfig]);

    // Datos paginados
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    // Cálculo de totales
    const totals = useMemo(() => {
        const totalHours = filteredData.reduce((sum, item) => sum + (item.totalHours ?? 0), 0);
        const totalCost = filteredData.reduce((sum, item) => {
            // CORRECCIÓN CLAVE: Usar ?? 0 para ratePerHour y totalHours
            const hours = item.totalHours ?? 0;
            const rate = item.ratePerHour ?? 0;
            const cost = (hours) * (rate);
            return sum + cost;
        }, 0);

        return { totalHours, totalCost, totalRecords: filteredData.length };
    }, [filteredData]);

    // Handlers
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset a la primera página
    };

    const clearFilters = () => {
        setFilters({
            searchText: '',
            localId: '',
            operationId: '',
            workerId: '',
            category: '',
            dateFrom: '',
            dateTo: '',
            period: 'ultimo_mes',
        });
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este registro?')) return;

        try {
            await deleteDoc(doc(db, TIMESHEET_COLLECTION_PATH, id));
            // Opcional: Mostrar un mensaje de éxito
        } catch (error) {
            console.error("Error deleting record:", error);
            alert("Error al eliminar el registro");
        }
    };

    // Opciones para los filtros
    const localOptions = availableLocals.map(local => ({
        value: local.id,
        label: local.name
    }));

    const operationOptions = OPERATIONS.map(op => ({
        value: op.id,
        label: `${op.id} - ${op.name}`
    }));

    const workerOptions = availableWorkers.map(worker => ({
        value: worker.id,
        label: worker.name
    }));

    const categoryOptions = CATEGORIES.map(cat => ({
        value: cat.id,
        label: cat.name
    }));

    const periodOptions = [
        { value: 'ultimo_mes', label: 'Último mes' },
        { value: 'este_mes', label: 'Este mes' },
        { value: 'este_año', label: 'Este año' },
        { value: 'personalizado', label: 'Personalizado' },
    ];

    // Filtros activos
    const activeFilters = [];
    if (filters.localId) {
        const local = availableLocals.find(l => l.id === filters.localId);
        activeFilters.push({ key: 'localId', label: `Cultivo: ${local?.name}` });
    }
    if (filters.operationId) {
        const op = OPERATIONS.find(o => o.id === filters.operationId);
        activeFilters.push({ key: 'operationId', label: `Operación: ${op?.name}` });
    }
    if (filters.workerId) {
        const worker = availableWorkers.find(w => w.id === filters.workerId);
        activeFilters.push({ key: 'workerId', label: `Trabajador: ${worker?.name}` });
    }
    if (filters.category) {
        const cat = CATEGORIES.find(c => c.id === filters.category);
        activeFilters.push({ key: 'category', label: `Categoría: ${cat?.name}` });
    }

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // Componente Paginación
    const Pagination = () => (
        <div className="flex justify-between items-center py-4 px-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, totals.totalRecords)} de {totals.totalRecords} registros.
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaChevronLeft className="text-xs" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaChevronRight className="text-xs" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaEuroSign className="text-emerald-600" />
                                Costes
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestión y análisis de costos de actividades de campo
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                                    showFilters 
                                        ? 'bg-emerald-600 text-white shadow-lg' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <MdFilterList />
                                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                            </button>
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-blue-600 uppercase">Total Registros</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-1">{totals.totalRecords}</p>
                                </div>
                                <FaClock className="text-3xl text-blue-400" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-purple-600 uppercase">Total Horas</p>
                                    <p className="text-2xl font-bold text-purple-900 mt-1">{totals.totalHours.toFixed(2)} h</p>
                                </div>
                                <FaClock className="text-3xl text-purple-400" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-emerald-600 uppercase">Total Costes</p>
                                    <p className="text-2xl font-bold text-emerald-900 mt-1">{totals.totalCost.toFixed(2)} €</p>
                                </div>
                                <FaEuroSign className="text-3xl text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel de Filtros */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FaFilter className="text-emerald-600" />
                                Filtros
                            </h2>
                            {activeFilters.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                    <FaTimes />
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        {/* Búsqueda */}
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                                <FaSearch className="text-sm" />
                                Búsqueda
                            </label>
                            <input
                                type="text"
                                value={filters.searchText}
                                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                                placeholder="Buscar por trabajador, operación o cultivo..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>

                        {/* Filtros en Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <FilterSelect
                                label="Período"
                                value={filters.period}
                                onChange={(value) => handleFilterChange('period', value)}
                                options={periodOptions}
                                icon={FaCalendarAlt}
                            />

                            <FilterSelect
                                label="Cultivo / Local"
                                value={filters.localId}
                                onChange={(value) => handleFilterChange('localId', value)}
                                options={localOptions}
                                icon={FaSeedling}
                            />

                            <FilterSelect
                                label="Operación"
                                value={filters.operationId}
                                onChange={(value) => handleFilterChange('operationId', value)}
                                options={operationOptions}
                                icon={FaTools}
                            />

                            <FilterSelect
                                label="Trabajador"
                                value={filters.workerId}
                                onChange={(value) => handleFilterChange('workerId', value)}
                                options={workerOptions}
                                icon={FaUsers}
                            />
                        </div>

                        {/* Fechas personalizadas */}
                        {filters.period === 'personalizado' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha Desde</label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha Hasta</label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Chips de filtros activos */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                                {activeFilters.map((filter) => (
                                    <FilterChip
                                        key={filter.key}
                                        label={filter.label}
                                        onRemove={() => handleFilterChange(filter.key, '')}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tabla de Datos */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-3 text-center text-xs font-semibold text-emerald-600 uppercase tracking-wider w-8">
                                        <FaEuroSign />
                                    </th>
                                    <th 
                                        onClick={() => handleSort('date')}
                                        className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            Fecha
                                            {sortConfig.key === 'date' && (
                                                sortConfig.direction === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Operación
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Trabajador
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Cultivo/Local
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Horario
                                    </th>
                                    <th 
                                        onClick={() => handleSort('totalHours')}
                                        className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                                    >
                                        <div className="flex items-center justify-end gap-2">
                                            Horas
                                            {sortConfig.key === 'totalHours' && (
                                                sortConfig.direction === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('ratePerHour')}
                                        className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                                    >
                                        Tarifa/h
                                    </th>
                                    <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Coste Total
                                    </th>
                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Editado por
                                    </th>
                                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <FaSearch className="text-4xl text-gray-300" />
                                                <p className="text-lg font-medium">No se encontraron registros</p>
                                                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => {
                                        // APLICACIÓN DE LA CORRECCIÓN CLAVE
                                        const hours = item.totalHours ?? 0;
                                        const rate = item.ratePerHour ?? 0;
                                        const cost = Number(hours) * Number(rate);
                                        
                                        // Formato de la tarifa de hora corregido
                                        const formattedRate = Number(rate).toFixed(2);
                                        
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm">
                                                <td className="px-2 py-3 whitespace-nowrap text-center">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                                                        <FaEuroSign className="text-emerald-500 text-xs" />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap text-gray-900">
                                                    {new Date(item.date).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-2 py-3 text-gray-700 max-w-[150px] truncate" title={`${item.operationId} - ${item.operationName}`}>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                                                        {item.operationId} - {item.operationName}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={item.workerName}>
                                                    {item.workerName}
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={item.localName}>
                                                    {item.localName}
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">
                                                    {item.startTime} - {item.endTime}
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap font-mono text-right text-purple-700 font-semibold">
                                                    {Number(hours).toFixed(2)}
                                                </td>
                                                {/* CAMPO CORREGIDO */}
                                                <td className="px-2 py-3 whitespace-nowrap font-mono text-right text-gray-600">
                                                    {formattedRate} €
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap font-bold text-right text-emerald-800">
                                                    {cost.toFixed(2)} €
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap text-gray-500 max-w-[200px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 rounded bg-orange-50 border border-orange-100 flex-shrink-0">
                                                            <GiFarmer className="text-lg text-orange-500" />
                                                        </div>
                                                        <div className="flex flex-col truncate">
                                                            <span className="font-bold text-gray-700 truncate text-xs" title={item.editedBy || 'Sistema'}>
                                                                {item.editedBy || 'Sistema'}
                                                            </span>
                                                            {(item.updatedAt || item.createdAt) && (
                                                                <span className="text-[11px] text-gray-400 font-medium">
                                                                    {(() => {
                                                                        const timestamp = item.updatedAt || item.createdAt;
                                                                        // Manejar si es Timestamp de Firestore o fecha string/JS
                                                                        let date;
                                                                        if (timestamp.seconds) {
                                                                            date = new Date(timestamp.seconds * 1000);
                                                                        } else if (timestamp instanceof Date) {
                                                                            date = timestamp;
                                                                        } else {
                                                                            date = new Date(timestamp); // Intento de parsear string
                                                                        }

                                                                        return !isNaN(date) ? date.toLocaleString('es-ES', {
                                                                            year: 'numeric', 
                                                                            month: '2-digit', 
                                                                            day: '2-digit',
                                                                            hour: '2-digit', 
                                                                            minute: '2-digit',
                                                                            hour12: false
                                                                        }) : '';
                                                                    })()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-center items-center gap-1">
                                                        <button 
                                                            // onClick={() => handleEdit(item.id)} // Implementar lógica de edición
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                                                            title="Editar Registro"
                                                        >
                                                            <FaEdit className="text-sm" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                            title="Eliminar Registro"
                                                        >
                                                            <FaTrash className="text-sm" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginación */}
                    <Pagination />
                </div>
            </div>
        </div>
    );
};

export default CostesManager;