import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebaseConfig';
import { FaTractor, FaMapMarkedAlt, FaSeedling, FaLayerGroup } from 'react-icons/fa';
import FarmForm from '../../components/FarmSettings/FarmForm';
import ParcelTable from '../../components/FarmSettings/ParcelTable';
import CropTable from '../../components/FarmSettings/CropTable';
import HomogeneousZoneTable from '../../components/FarmSettings/HomogeneousZoneTable';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const TABS = [
    { id: 'farm', name: 'Finca', icon: FaTractor },
    { id: 'parcels', name: 'Parcelas', icon: FaMapMarkedAlt },
    { id: 'crops', name: 'Cultivos', icon: FaSeedling },
    { id: 'zones', name: 'Zona Homogénea', icon: FaLayerGroup }
];

const FarmSettings = () => {
    const [activeTab, setActiveTab] = useState('farm');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Autenticación
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando configuración de finca...</p>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Debes iniciar sesión para acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'farm':
                return <FarmForm db={db} userId={userId} />;
            case 'parcels':
                return <ParcelTable db={db} userId={userId} />;
            case 'crops':
                return <CropTable db={db} userId={userId} />;
            case 'zones':
                return <HomogeneousZoneTable db={db} userId={userId} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Finca
                    </h1>
                    <p className="text-gray-600">
                        Administra la estructura de tu finca: parcelas, cultivos y zonas homogéneas
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-200">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex-1 flex items-center justify-center gap-2 px-4 py-4 sm:py-5
                                        font-semibold text-sm sm:text-base
                                        transition-all duration-200
                                        border-b-4
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-600 text-emerald-700' 
                                            : 'bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                        }
                                    `}
                                >
                                    <Icon className={`text-lg sm:text-xl ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                                    <span className="hidden sm:inline">{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default FarmSettings;
