import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { FaTimes, FaHistory, FaEuroSign, FaCalendarAlt, FaRulerCombined } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const GreenhouseDetailsModal = ({ isOpen, onClose, greenhouse, db, userId, position }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !greenhouse || !userId) return;

        const appId = getAppId();
        const TIMESHEET_PATH = `artifacts/${appId}/public/data/timesheets`;
        
        const q = query(
            collection(db, TIMESHEET_PATH), 
            where("localName", "==", greenhouse.name),
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
            console.error("Error fetching history by name, trying ID...", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isOpen, greenhouse, db, userId]);

    // Calculate position styles
    const modalHeight = 350; // Reduced height for better fit
    const modalWidth = 320; // Slightly narrower
    
    let style = {
        position: 'fixed',
        zIndex: 99999,
    };

    if (position) {
        let left = position.x + 20;
        if (left + modalWidth > window.innerWidth) {
            left = position.x - modalWidth - 20;
        }

        let top = position.y;
        // Add more bottom margin buffer (40px)
        if (top + modalHeight > window.innerHeight) {
            top = window.innerHeight - modalHeight - 40;
        }
        
        style.left = left;
        style.top = top;
    } else {
        style.top = '50%';
        style.left = '50%';
        style.transform = 'translate(-50%, -50%)';
    }

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={style} 
                    className="w-[320px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[380px] backdrop-blur-md bg-white/90 border border-white/50"
                >
                    {/* Header with Glass Effect Gradient */}
                    <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 p-5 text-white flex justify-between items-start backdrop-blur-sm">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2 drop-shadow-sm">
                                {greenhouse.name}
                            </h3>
                            <div className="flex items-center text-emerald-50 text-sm mt-1 font-medium bg-emerald-700/30 px-2 py-0.5 rounded-full inline-block backdrop-blur-md border border-emerald-500/30">
                                <FaRulerCombined className="mr-2" />
                                {greenhouse.area} ha
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/90 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-white/40 to-white/10">
                        
                        {/* Stats Summary - Glass Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 backdrop-blur-sm hover:bg-emerald-100/50 transition-colors">
                                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Cultivo Actual</div>
                                <div className="font-bold text-gray-800 text-sm">{greenhouse.crop}</div>
                            </div>
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 backdrop-blur-sm hover:bg-blue-100/50 transition-colors">
                                <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-1">Suelo</div>
                                <div className="font-bold text-gray-800 text-sm">{greenhouse.soilType || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Activity History */}
                        <div>
                            <h4 className="font-bold text-gray-700/90 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
                                <FaHistory className="text-emerald-500" />
                                Actividad Reciente
                            </h4>
                            
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-300/50 backdrop-blur-sm">
                                    <p className="text-gray-500 text-sm font-medium">Sin actividad registrada.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {history.map(activity => (
                                        <div key={activity.id} className="bg-white/60 border border-white/60 rounded-xl shadow-sm hover:shadow-md transition-all p-3 relative group backdrop-blur-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-gray-800 text-sm leading-tight">
                                                    {activity.operationName}
                                                </div>
                                                <span className="text-[10px] bg-gray-100/80 px-2 py-0.5 rounded-full text-gray-600 font-mono border border-gray-200">
                                                    {activity.totalHours}h
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                                <FaCalendarAlt className="mr-1 text-gray-400" />
                                                {activity.date}
                                            </div>

                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100/50">
                                                <div className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-100/50">
                                                    <FaEuroSign className="mr-0.5 text-[9px]" />
                                                    {(activity.totalHours * (activity.ratePerHour || 0)).toFixed(2)}
                                                </div>
                                                <div className="text-[10px] text-gray-400 ml-auto">
                                                    {activity.workerName}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-white/40 border-t border-white/50 text-center backdrop-blur-md">
                        <button className="text-xs text-emerald-700 font-bold hover:text-emerald-800 hover:underline uppercase tracking-wide transition-all">
                            Ver historial completo
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use Portal to render outside of the map container, avoiding overflow:hidden clipping
    return ReactDOM.createPortal(modalContent, document.body);
};

export default GreenhouseDetailsModal;
