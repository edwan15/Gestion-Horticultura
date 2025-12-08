import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FaList, FaMapMarkedAlt, FaFilter, FaSearch } from 'react-icons/fa';
import ActivitiesList from './ActivitiesList';
import ActivitiesMap from './ActivitiesMap';
import { db } from '../../firebaseConfig';
import { selectUserId } from '../../features/auth/authSlice/authSlice';

const FieldActivities = () => {
    const userId = useSelector(selectUserId);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'all', label: 'Todo', icon: null },
        { id: 'cultural', label: 'Operación Cultural', icon: '🚜' },
        { id: 'irrigation', label: 'Riego', icon: '💧' },
        { id: 'fertilization', label: 'Fertilización', icon: '🌾' },
        { id: 'annotations', label: 'Anotaciones', icon: '📝' },
         { id: 'phytosanitary', label: 'Fitosanidad', icon: '🧪' },
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50 min-h-screen p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Actividades de Campo</h1>
                    <p className="text-gray-500 mt-1">Gestión y visualización de operaciones agrícolas</p>
                </div>
                
                {/* View Switcher */}
                <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            viewMode === 'list' 
                                ? 'bg-emerald-100 text-emerald-700 font-bold' 
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaList /> Lista
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            viewMode === 'map' 
                                ? 'bg-emerald-100 text-emerald-700 font-bold' 
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaMapMarkedAlt /> Mapa
                    </button>
                </div>
            </div>

            {/* Controls & Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                                activeTab === tab.id
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar actividad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {viewMode === 'list' ? (
                    <ActivitiesList 
                        db={db} 
                        userId={userId} 
                        activeTab={activeTab} 
                        searchTerm={searchTerm} 
                    />
                ) : (
                    <ActivitiesMap 
                        db={db} 
                        userId={userId} 
                        activeTab={activeTab} 
                    />
                )}
            </div>
        </div>
    );
};

export default FieldActivities;
