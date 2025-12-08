import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { FaTimes, FaHistory, FaEuroSign, FaTractor, FaCalendarAlt, FaRulerCombined } from 'react-icons/fa';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const GreenhouseDetailsModal = ({ isOpen, onClose, greenhouse, db, userId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !greenhouse || !userId) return;

        const appId = getAppId();
        const TIMESHEET_PATH = `artifacts/${appId}/public/data/timesheets`;

        // Query activities for this specific local/parcel
        // Note: This relies on localId matching greenhouse.id or localName matching greenhouse.name
        // We will try to match by ID first, then fallback or check logic.
        // Assuming TimeSheetWizard saves 'localId' which matches Parcel ID.
        
        let q = query(
            collection(db, TIMESHEET_PATH), 
            where("localId", "==", greenhouse.id),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setHistory(data);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isOpen, greenhouse, db, userId]);

    if (!isOpen) return null;

    return (
        <div className="absolute top-4 right-4 z-[1000] w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100%-2rem)]">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {greenhouse.name}
                    </h3>
                    <div className="flex items-center text-emerald-100 text-sm mt-1">
                        <FaRulerCombined className="mr-2" />
                        {greenhouse.area} ha
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-semibold uppercase">Cultivo Actual</div>
                        <div className="font-bold text-gray-800">{greenhouse.crop}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-blue-600 font-semibold uppercase">Suelo</div>
                        <div className="font-bold text-gray-800">{greenhouse.soilType || 'N/A'}</div>
                    </div>
                </div>

                {/* Activity History */}
                <div>
                    <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
                        <FaHistory className="text-emerald-500" />
                        Últimas 5 Actividades
                    </h4>
                    
                    {loading ? (
                        <div className="text-center py-4 text-gray-400">Cargando historial...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">No hay actividad reciente.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map(activity => (
                                <div key={activity.id} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-gray-800 text-sm">
                                            {activity.operationName}
                                        </div>
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                                            {activity.totalHours}h
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                        <FaCalendarAlt className="mr-1 text-gray-400" />
                                        {activity.date}
                                        <span className="mx-2">•</span>
                                        {activity.workerName}
                                    </div>

                                    {/* Cost calculation (estimated) */}
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                                        <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                            <FaEuroSign className="mr-1" />
                                            {(activity.totalHours * (activity.ratePerHour || 0)).toFixed(2)} cost. est.
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 hover:underline">
                    Ver historial completo
                </button>
            </div>
        </div>
    );
};

export default GreenhouseDetailsModal;
