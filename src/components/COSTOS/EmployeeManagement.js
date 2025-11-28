import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    where,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { FaUserPlus, FaEnvelope, FaMoneyBillWave, FaIdCard, FaBuilding, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle, FaUsers, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Función auxiliar para obtener el AppId
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/workers`;

// Componente DashboardCard reutilizable
const DashboardCard = ({ 
    title, 
    icon, 
    titleColor = 'text-gray-800', 
    className = '', 
    children,
    badge = null 
}) => (
    <div className={`
        bg-white 
        rounded-lg 
        shadow-sm 
        border border-gray-200
        hover:shadow-md 
        transition-all 
        duration-300 
        overflow-hidden
        ${className}
    `}>
        <div className={`
            flex items-center justify-between 
            px-5 py-4 
            border-b border-gray-100
            bg-gradient-to-r from-gray-50 to-white
        `}>
            <div className="flex items-center space-x-3">
                {icon && (
                    <div className={`
                        w-10 h-10 
                        rounded-lg 
                        bg-gradient-to-br from-gray-100 to-gray-50
                        flex items-center justify-center
                        text-xl
                        ${titleColor}
                    `}>
                        {icon}
                    </div>
                )}
                <h3 className={`text-base font-semibold ${titleColor}`}>
                    {title}
                </h3>
            </div>
            {badge && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {badge}
                </span>
            )}
        </div>
        
        <div className="p-5">
            {children}
        </div>
    </div>
);

const EmployeeManagement = ({ db, userId, availableEntities }) => {

    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const initialState = {
        name: '',
        identification: '',
        email: '',
        ratePerHour: '15.00',
        entityId: '',
        createdBy: userId,
    };

    const [employeeData, setEmployeeData] = useState(initialState);
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // --- 1. Lógica de Listado ---
    useEffect(() => {
        if (!db || !userId) {
            setLoadingEmployees(false);
            return;
        }

        const qEmployees = query(
            collection(db, WORKERS_COLLECTION_PATH),
            where("createdBy", "==", userId)
        );

        const unsubscribe = onSnapshot(qEmployees, (snapshot) => {
            const employeesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEmployees(employeesData);
            setLoadingEmployees(false);
        }, (error) => {
            console.error("Firestore employee data error:", error);
            showNotification("Error al cargar la lista de empleados.", 'error');
            setLoadingEmployees(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    // --- 2. Lógica del Formulario ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditStart = (employee) => {
        setEditingId(employee.id);
        setEmployeeData({
            name: employee.name,
            identification: employee.identification,
            email: employee.email || '',
            ratePerHour: String(employee.ratePerHour || '0.00'),
            entityId: employee.entityId,
            createdBy: userId,
        });
        setNotification(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEmployeeData(initialState);
        setNotification(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);

        if (!employeeData.entityId) {
            showNotification("Debe seleccionar una Entidad/Empresa para el empleado.", 'error');
            return;
        }

        if (!db) {
            showNotification("La base de datos no está disponible.", 'error');
            return;
        }

        try {
            const dataToSave = { ...employeeData, createdBy: userId };

            if (editingId) {
                const docRef = doc(db, WORKERS_COLLECTION_PATH, editingId);
                delete dataToSave.createdBy;

                await updateDoc(docRef, dataToSave);
                showNotification(`Trabajador "${employeeData.name}" actualizado exitosamente.`);
                setEditingId(null);
            } else {
                const employeesCollectionRef = collection(db, WORKERS_COLLECTION_PATH);
                await addDoc(employeesCollectionRef, {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                });
                showNotification(`Trabajador "${employeeData.name}" registrado exitosamente.`);
            }

            setEmployeeData(initialState);

        } catch (error) {
            console.error("Error al guardar/actualizar el empleado:", error);
            showNotification(`Error al guardar: ${error.message}`, 'error');
        }
    };

    const handleDelete = async (employeeId, employeeName) => {
        if (!db) {
            showNotification("La base de datos no está disponible.", 'error');
            return;
        }

        if (!window.confirm(`¿Está seguro de que desea eliminar al trabajador: ${employeeName}? \nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const docRef = doc(db, WORKERS_COLLECTION_PATH, employeeId);
            await deleteDoc(docRef);
            showNotification(`Trabajador "${employeeName}" eliminado exitosamente.`);
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
            showNotification(`Error al eliminar: ${error.message}`, 'error');
        }
    };

    // --- 3. Cálculos de Estadísticas ---
    const getEntityName = (entityId) => {
        if (!Array.isArray(availableEntities)) return 'Cargando...';
        const entity = availableEntities.find(ent => ent.id === entityId);
        return entity ? entity.name : 'Entidad Eliminada';
    };

    const averageRate = employees.length > 0 
        ? (employees.reduce((sum, emp) => sum + parseFloat(emp.ratePerHour || 0), 0) / employees.length).toFixed(2)
        : '0.00';

    return (
        <div className="relative space-y-6">

            {/* Notificación */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-xl min-w-[300px] flex items-center space-x-3
                            ${notification.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'}`
                        }
                    >
                        {notification.type === 'success' ? <FaCheckCircle className="h-5 w-5"/> : <FaExclamationTriangle className="h-5 w-5"/>}
                        <div className='flex-grow'>
                            <strong className="font-bold text-sm uppercase">{notification.type === 'success' ? 'Éxito' : 'Error'}</strong>
                            <p className="block text-sm">{notification.message}</p>
                        </div>
                        <span
                            className="text-white opacity-70 hover:opacity-100 cursor-pointer p-1 -m-1"
                            onClick={() => setNotification(null)}
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tarjetas de Resumen en Grid 2 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                    title="Estadísticas de Empleados"
                    icon={<FaChartLine />}
                    titleColor="text-blue-700"
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Total Trabajadores</span>
                            <span className="text-2xl font-bold text-blue-600">{employees.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Tarifa Promedio</span>
                            <span className="text-2xl font-bold text-green-600">{averageRate} €/h</span>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard
                    title={editingId ? "Editando Trabajador" : "Registro Rápido"}
                    icon={<FaUserPlus />}
                    titleColor="text-red-700"
                >
                    <p className="text-sm text-gray-600">
                        {editingId 
                            ? "Modifica los datos del trabajador seleccionado en el formulario de abajo."
                            : "Completa el formulario de abajo para registrar un nuevo trabajador en el sistema."
                        }
                    </p>
                </DashboardCard>
            </div>

            {/* Formulario de Registro/Edición */}
            <DashboardCard
                title={editingId ? "Editar Trabajador" : "Nuevo Trabajador"}
                icon={<FaUserPlus />}
                titleColor="text-red-700"
                badge={editingId ? "Modo Edición" : null}
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nombre Completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={employeeData.name}
                            onChange={handleChange}
                            placeholder="Ej: David García"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            required
                        />
                    </div>

                    {/* Identificación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <FaIdCard className="text-sm"/> <span>DNI/NIF/NIE</span>
                        </label>
                        <input
                            type="text"
                            name="identification"
                            value={employeeData.identification}
                            onChange={handleChange}
                            placeholder="Ej: 12345678A"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            required
                            disabled={!!editingId}
                        />
                        {editingId && (
                            <p className="text-xs text-gray-500 mt-1">
                                No se puede cambiar la identificación durante la edición.
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <FaEnvelope className="text-sm"/> <span>Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={employeeData.email}
                            onChange={handleChange}
                            placeholder="Ej: david@empresa.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        />
                    </div>

                    {/* Tarifa por Hora */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <FaMoneyBillWave className="text-sm"/> <span>Tarifa por Hora (€)</span>
                        </label>
                        <input
                            type="number"
                            name="ratePerHour"
                            value={employeeData.ratePerHour}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            required
                        />
                    </div>

                    {/* Entidad/Empresa */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <FaBuilding/> <span>Entidad/Empresa a la que pertenece</span>
                        </label>
                        <select
                            name="entityId"
                            value={employeeData.entityId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            required
                        >
                            <option value="">-- Seleccione una Entidad --</option>
                            {availableEntities && availableEntities.map(entity => (
                                <option key={entity.id} value={entity.id}>{entity.name}</option>
                            ))}
                        </select>
                        {availableEntities && availableEntities.length === 0 && (
                            <p className="text-red-500 text-xs mt-1">⚠️ No hay entidades creadas. Cree una en Gestión General.</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="col-span-full flex space-x-4">
                        <button
                            type="submit"
                            className={`flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors
                                ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            {editingId ? (
                                <>
                                    <FaEdit className="mr-2 h-5 w-5"/>
                                    Guardar Cambios
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="mr-2 h-5 w-5"/>
                                    Registrar Trabajador
                                </>
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="w-32 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </DashboardCard>

            {/* Lista de Empleados */}
            <DashboardCard
                title="Trabajadores Registrados"
                icon={<FaUsers />}
                titleColor="text-gray-800"
                badge={`${employees.length} trabajadores`}
            >
                {loadingEmployees ? (
                    <p className="text-blue-500 text-center py-4">Cargando trabajadores...</p>
                ) : employees.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-4">No hay trabajadores registrados por el usuario.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa/h</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className={`transition-colors ${editingId === emp.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.identification}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(emp.ratePerHour).toFixed(2)} €</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEntityName(emp.entityId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center space-x-3">
                                            <button
                                                onClick={() => handleEditStart(emp)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center disabled:opacity-50 transition-colors"
                                                disabled={!!editingId && editingId !== emp.id}
                                                title="Editar Trabajador"
                                            >
                                                <FaEdit className="mr-1"/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id, emp.name)}
                                                className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50 transition-colors"
                                                disabled={!!editingId}
                                                title="Eliminar Trabajador"
                                            >
                                                <FaTrash className="mr-1"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DashboardCard>
        </div>
    );
};

export default EmployeeManagement;