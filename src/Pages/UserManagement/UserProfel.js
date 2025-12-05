import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaUser, FaBuilding, FaCheckCircle, FaTimesCircle, FaCircle } from "react-icons/fa";
import { MdSettings, MdPerson, MdBusiness, MdPeople } from "react-icons/md";

const TeamView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("equipo");

    // Fetch users from Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersCollectionRef = collection(db, "users");
                const userSnapshot = await getDocs(usersCollectionRef);
                const usersList = userSnapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error al cargar usuarios desde Firestore:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Simulate permissions based on role
    const getPermissions = (role) => {
        if (role === "admin") {
            return {
                editarEmpresa: true,
                editarCatalogo: true,
                verCatalogo: true,
                verContactos: true,
                accederBD: true
            };
        } else if (role === "usuario") {
            return {
                editarEmpresa: false,
                editarCatalogo: true,
                verCatalogo: true,
                verContactos: true,
                accederBD: true
            };
        } else {
            return {
                editarEmpresa: false,
                editarCatalogo: false,
                verCatalogo: false,
                verContactos: false,
                accederBD: false
            };
        }
    };

    const tabs = [
        { id: "configuracion", label: "Configuración", icon: <MdSettings /> },
        { id: "perfil", label: "Perfil", icon: <MdPerson /> },
        { id: "empresa", label: "Empresa", icon: <MdBusiness /> },
        { id: "equipo", label: "Equipo", icon: <MdPeople /> }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-4">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FaBuilding className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">HORTICULTURA</h1>
                            <p className="text-sm text-gray-500">Sistema Empresarial</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-green-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === "equipo" && (
                    <div className="bg-white rounded-b-xl shadow-lg">
                        {/* Section Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
                                Permisos
                            </h2>
                        </div>

                        {/* Permissions Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Nombre
                                        </th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Empresa
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Editar empresa
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Editar catálogo
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Ver catálogo
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Ver contactos
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Acceso a BD
                                        </th>
                                        <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => {
                                        const permissions = getPermissions(user.role);
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                {/* Name Column */}
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-orange-100 rounded-full flex-shrink-0">
                                                            <FaUser className="text-orange-600 text-xs" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                                {user.name || "Sin nombre"}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Company Column */}
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-green-100 rounded flex-shrink-0">
                                                            <FaBuilding className="text-green-600 text-[10px]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium text-gray-900 truncate">
                                                                Horticultura Del Sureste SL
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 truncate">
                                                                {user.role === "admin" ? "Gerente agrícola" : "Productor agrícola"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Permission Columns */}
                                                <td className="px-2 py-3 text-center">
                                                    {permissions.editarEmpresa ? (
                                                        <FaCheckCircle className="inline text-green-500 text-base" />
                                                    ) : (
                                                        <FaTimesCircle className="inline text-red-500 text-base" />
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    {permissions.editarCatalogo ? (
                                                        <FaCheckCircle className="inline text-green-500 text-base" />
                                                    ) : (
                                                        <FaTimesCircle className="inline text-red-500 text-base" />
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    {permissions.verCatalogo ? (
                                                        <FaCheckCircle className="inline text-green-500 text-base" />
                                                    ) : (
                                                        <FaTimesCircle className="inline text-red-500 text-base" />
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    {permissions.verContactos ? (
                                                        <FaCheckCircle className="inline text-green-500 text-base" />
                                                    ) : (
                                                        <FaTimesCircle className="inline text-red-500 text-base" />
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    {permissions.accederBD ? (
                                                        <FaCheckCircle className="inline text-green-500 text-base" />
                                                    ) : (
                                                        <FaTimesCircle className="inline text-red-500 text-base" />
                                                    )}
                                                </td>

                                                {/* Status Column */}
                                                <td className="px-2 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <FaCircle className="text-green-500 text-[8px]" />
                                                        <span className="text-xs font-medium text-gray-700">Activo</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Placeholder for other tabs */}
                {activeTab !== "equipo" && (
                    <div className="bg-white rounded-b-xl shadow-lg p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <MdSettings className="text-6xl mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Sección en desarrollo
                        </h3>
                        <p className="text-gray-500">
                            La pestaña "{tabs.find(t => t.id === activeTab)?.label}" estará disponible próximamente.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamView;