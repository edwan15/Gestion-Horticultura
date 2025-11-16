// --- src/components/dashboard/AnnouncementCard.js ---
import React from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// Colores según el tipo de alerta
const styles = {
    info: { 
        bg: "bg-blue-50 border-blue-400", 
        text: "text-blue-700", 
        icon: FaInfoCircle 
    },
    warning: { 
        bg: "bg-yellow-50 border-yellow-400", 
        text: "text-yellow-700", 
        icon: FaExclamationTriangle 
    },
    success: { 
        bg: "bg-green-50 border-green-400", 
        text: "text-green-700", 
        icon: FaCheckCircle 
    },
};

const AnnouncementCard = ({ title, message, type = 'info' }) => {
    const { bg, text, icon: Icon } = styles[type] || styles.info;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className={`p-6 rounded-xl border-l-8 ${bg} shadow-lg h-full`}
        >
            <div className="flex items-start">
                <Icon className={`text-2xl mr-4 mt-1 ${text}`} />
                <div>
                    <h3 className={`text-xl font-bold mb-2 ${text}`}>{title}</h3>
                    <p className={`text-sm ${text}`}>{message}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AnnouncementCard;