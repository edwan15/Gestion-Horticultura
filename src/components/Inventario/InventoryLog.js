import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs, selectLogs, selectIsLogLoading } from '../../features/logs/logSlice';
import { FaHistory, FaPlusCircle, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import Loader from '../../Util/Loader';

const InventoryLog = ({ module = "INVENTORY" }) => { // Por defecto INVENTORY para no romper compatibilidad
    const dispatch = useDispatch();
    const logs = useSelector(selectLogs) || []; 
    const isLoading = useSelector(selectIsLogLoading);

    useEffect(() => {
        dispatch(getLogs(module));
    }, [dispatch, module]);

    const getIcon = (action) => {
        switch (action) {
            case 'CREATE': return <FaPlusCircle className="text-green-500" />;
            case 'UPDATE': return <FaEdit className="text-blue-500" />;
            case 'DELETE': return <FaTrash className="text-red-500" />;
            default: return <FaInfoCircle className="text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaHistory className="text-blue-600" />
                    Registro de Actividad
                </h3>
                <button 
                    onClick={() => dispatch(getLogs(module))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    Actualizar
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader />
                    </div>
                ) : !Array.isArray(logs) || logs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 italic">
                        No hay actividad registrada recientemente.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                <div className="mt-1 text-lg">
                                    {getIcon(log.action)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-gray-800 break-words whitespace-normal break-all">
                                            <span className="text-blue-600 font-bold text-xs mr-2">[{log.userName || "Usuario"}]</span>
                                            {log.details}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {formatDate(log.createdAt)}
                                        </span>
                                    </div>
                                    {log.metadata && log.metadata.changes && (
                                        <div className="mt-1 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                                            <p className="font-medium mb-1">Cambios:</p>
                                            <ul className="list-disc list-inside">
                                                {log.metadata.changes.map((change, idx) => (
                                                    <li key={idx} className="break-all whitespace-normal">{change}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryLog;
