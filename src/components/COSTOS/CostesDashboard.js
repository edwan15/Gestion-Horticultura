import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Import needed functions
import ActivitiesMap from '../FieldActivities/ActivitiesMap';
import CostesInteractiveCard from './CostesInteractiveCard';
import ProductInventoryCard from './ProductInventoryCard';
import CostDistributionCard from './CostDistributionCard';

// Helper to get App ID (same as in CostesManager)
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const CostesDashboard = () => {
    const userId = useSelector(selectUserId);
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const appId = getAppId();
        const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;

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
            console.error("Error loading timesheets in Dashboard:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return (
        <div className="p-3 md:p-4 space-y-4 bg-gray-50 min-h-screen">
            {/* Header omitted as per original file */}
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Row 1 */}
                {/* Left Column: Map */}
                <div className="h-[360px] shadow-xl border border-gray-200 bg-white">
                    <ActivitiesMap 
                        db={db} 
                        userId={userId} 
                        activeTab="all" 
                    />
                </div>

                {/* Right Column: Interactive Card */}
                <div className="h-[360px]">
                    <CostesInteractiveCard timesheets={timesheets} loading={loading} />
                </div>

                {/* Row 2 */}
                {/* Left Column: Product Inventory */}
                <div className="h-[360px]">
                    <ProductInventoryCard />
                </div>

                {/* Right Column: Cost Distribution */}
                <div className="h-[360px]">
                    <CostDistributionCard />
                </div>
            </div>
        </div>
    );
};

export default CostesDashboard;
