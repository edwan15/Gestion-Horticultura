import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { FaTractor, FaWater, FaLeaf, FaStickyNote, FaFlask, FaCalendarAlt, FaUser, FaClock, FaChevronRight } from 'react-icons/fa';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const ActivitiesList = ({ db, userId, activeTab, searchTerm }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const appId = getAppId();
        const TIMESHEET_PATH = `artifacts/${appId}/public/data/timesheets`;

        let q = query(
            collection(db, TIMESHEET_PATH), 
            where("createdBy", "==", userId),
            orderBy("createdAt", "desc"),
            limit(50) // Limit initial load
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivities(data);
            setLoading(false);
        }, (err) => {
            console.error("Error loading activities:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    // Filtering Logic
    const filteredActivities = activities.filter(activity => {
        // Tab Filter
        if (activeTab !== 'all') {
            const opName = activity.operationName?.toLowerCase() || '';
            const opId = activity.operationId;
            
            if (activeTab === 'cultural') {
                // IDs 05-17 generally cultural operations
                if (['05','06','07','08','09','10','11','12','13','14','15','16','17'].includes(opId)) return true;
                if (!opId && !opName.includes('riego') && !opName.includes('fertil') && !opName.includes('fito')) return true;
                return false;
            }
            if (activeTab === 'irrigation' && (opId === '04' || opName.includes('riego'))) return true;
            if (activeTab === 'fertilization' && (opId === '98' || opName.includes('ferti'))) return true;
            if (activeTab === 'phytosanitary' && (opId === '99' || opId === '01' || opName.includes('fito') || opName.includes('fumi'))) return true;
            if (activeTab === 'annotations' && !opId) return true; // Assuming annotations have no OP ID for now
            
            return false;
        }

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                activity.operationName?.toLowerCase().includes(term) ||
                activity.localName?.toLowerCase().includes(term) ||
                activity.workerName?.toLowerCase().includes(term)
            );
        }

        return true;
    });

    const getIconForActivity = (activity) => {
        const name = activity.operationName?.toLowerCase() || '';
        if (name.includes('riego')) return <FaWater className="text-blue-500" />;
        if (name.includes('ferti')) return <FaLeaf className="text-green-500" />;
        if (name.includes('fito') || name.includes('fumi')) return <FaFlask className="text-purple-500" />;
        return <FaTractor className="text-orange-500" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
                <p>Cargando actividades...</p>
            </div>
        );
    }

    if (filteredActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-400">
                <FaStickyNote className="text-4xl mb-4 opacity-50" />
                <p>No se encontraron actividades.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Operación</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cultivos / Local</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalles</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Fuente</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredActivities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-gray-50 transition-colors group cursor-default">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completado
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-50 text-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                                            {getIconForActivity(activity)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900">
                                                {activity.operationId ? `${activity.operationId}- ` : ''}{activity.operationName || 'Sin nombre'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {activeTab === 'all' ? 'Operación Cultural' : activeTab}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        {activity.date}
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span className="text-xs text-gray-500">{activity.startTime}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                                        {activity.localName || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            <FaClock className="mr-1" />
                                            {activity.totalHours} h
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-gray-900 flex items-center justify-end gap-1">
                                                <FaUser className="text-gray-400" /> {activity.workerName}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                {new Date(activity.createdAt?.seconds * 1000).toLocaleString() || '-'}
                                            </div>
                                        </div>
                                        <div className="text-gray-400">
                                            <FaChevronRight />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivitiesList;
