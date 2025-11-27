// AdminImpersonationSelector.jsx (Crea este archivo en una carpeta de componentes)

import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useAppContext } from './AppContext'; // Asegúrate de tener la ruta correcta

// ⚠️ Asume que ya tienes inicializado Firebase y getFirestore() funciona
const db = getFirestore();

// Función para obtener la lista ligera de usuarios (solo ID y nombre)
const getLightUsersList = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef); 
        
        return querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            displayName: doc.data().name || doc.data().email || doc.id // Usar nombre, email o ID
        }));
    } catch (error) {
        console.error("Error al cargar la lista de usuarios (solo visible para admin):", error);
        return [];
    }
};

const AdminImpersonationSelector = () => {
    const { setImpersonatedUserId, impersonatedUserId } = useAppContext();
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLightUsersList()
            .then(list => setUserOptions(list))
            .finally(() => setLoading(false));
    }, []);

    const handleSelectChange = (e) => {
        setImpersonatedUserId(e.target.value); 
    };
    
    // Estilos basados en Tailwind (para que coincida con tu Sidebar)
    const selectStyles = "w-full p-2 bg-blue-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer";

    if (loading) return <div className="p-4 text-gray-400 text-sm">Cargando usuarios...</div>;

    return (
        <div className="p-4 bg-blue-700/50 my-4 rounded-lg shadow-inner">
            <label htmlFor="user-select" className="block text-sm font-semibold text-green-400 mb-2">
                👥 Modo Súper Usuario
            </label>
            <select 
                id="user-select"
                value={impersonatedUserId} 
                onChange={handleSelectChange}
                className={selectStyles}
            >
                <option value="">-- Mi Contexto (Admin: {userOptions.length} total) --</option>
                {userOptions.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AdminImpersonationSelector;