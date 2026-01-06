import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/auth/authSlice/authSlice';
import ActivitiesMap from '../../components/FieldActivities/ActivitiesMap';
import { db } from '../../firebaseConfig';
import { FaSeedling, FaArrowLeft } from 'react-icons/fa';

import ActivityManager from './ActivityManager';

const ActivitiesPage = () => {
    const userId = useSelector(selectUserId);
    const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);

    // Wrapper to handle greenhouse selection from the map
    // We might need to adjust ActivitiesMap to support this "Enter" mode better 
    // or wrap the marker click event. 
    // For now, let's assume we can pass a prop or use the existing modal to "Enter".
    
    // However, the user wants "al darle un click primero enumerarlos , luego que al ingresar a ellos..."
    // The existing ActivitiesMap has a modal on click. 
    // We should probably modify ActivitiesMap or create a specialized version.
    // For this first step, I'll use the existing one and perhaps overlay a control or 
    // just let it be for now and refine the "Click to Enter" interaction in Phase 2.
    
    // WAIT: The user said "que se vean en modo completo es decir que sea un solo componente"
    // So this page IS the map initially.

    return (
        <div className="h-[calc(100vh-64px)] w-full overflow-hidden relative">
            {selectedGreenhouse ? (
                <ActivityManager 
                    greenhouse={selectedGreenhouse} 
                    onBack={() => setSelectedGreenhouse(null)} 
                />
            ) : (
                <div className="h-full w-full relative">
                     {/* Overlay Title */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-green-100">
                        <h1 className="text-lg font-bold text-green-800 flex items-center gap-2">
                             <FaSeedling /> Mapa de Actividades
                        </h1>
                    </div>

                    {/* reusing ActivitiesMap but we need to intercept the 'open details' to 'open activity manager' 
                        This might require modifying ActivitiesMap to accept an 'onGreenhouseSelect' prop 
                        that overrides the default modal. 
                        
                        Checking ActivitiesMap code... it ignores passed props for selection details logic mostly.
                        I'll need to modify ActivitiesMap in Phase 2 to accept an override.
                        For now, I will render it as is.
                     */}
                    <ActivitiesMap 
                        db={db} 
                        userId={userId} 
                        onGreenhouseSelect={setSelectedGreenhouse}
                    />
                </div>
            )}
        </div>
    );
};

export default ActivitiesPage;
