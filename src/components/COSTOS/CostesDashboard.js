import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import { db } from '../../firebaseConfig';
import ActivitiesMap from '../FieldActivities/ActivitiesMap';
import CostesInteractiveCard from './CostesInteractiveCard';
import ProductInventoryCard from './ProductInventoryCard';
import CostDistributionCard from './CostDistributionCard';

const CostesDashboard = () => {
    const userId = useSelector(selectUserId);

    return (
        <div className="p-3 md:p-4 space-y-4 bg-gray-50 min-h-screen">
            {/* Header */}
            {/* <div>
                <h1 className="text-2xl font-bold text-gray-800">Costes</h1>
                <p className="text-gray-500 mt-1 text-sm">Visión general de costes y distribución geográfica</p>
            </div> */}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Row 1 */}
                {/* Left Column: Map */}
                <div className="h-[360px] shadow-xl border border-gray-200 bg-white">
                    <ActivitiesMap 
                        db={db} 
                        userId={userId} 
                        activeTab="all" // Show all activities by default
                    />
                </div>

                {/* Right Column: Interactive Card */}
                <div className="h-[360px]">
                    <CostesInteractiveCard />
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
