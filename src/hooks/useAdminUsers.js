import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

/**
 * Hook personalizado para obtener y gestionar la lista de usuarios
 * Solo para administradores
 */
const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cacheRef = useRef(null);
    const lastFetchRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            // Cache de 5 minutos
            const CACHE_DURATION = 5 * 60 * 1000;
            const now = Date.now();

            if (cacheRef.current && lastFetchRef.current && (now - lastFetchRef.current < CACHE_DURATION)) {
                setUsers(cacheRef.current);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const db = getFirestore();
                const usersCollectionRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersCollectionRef);

                const usersList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        uid: doc.id,
                        name: data.name || 'Sin nombre',
                        email: data.email || '',
                        role: data.role || 'usuario',
                        farmName: data.farmName || data.name || 'Finca',
                        createdAt: data.createdAt,
                        avatar: data.photoURL || null,
                    };
                });

                // Ordenar por nombre
                usersList.sort((a, b) => a.name.localeCompare(b.name));

                cacheRef.current = usersList;
                lastFetchRef.current = now;
                setUsers(usersList);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const refreshUsers = async () => {
        cacheRef.current = null;
        lastFetchRef.current = null;
        const db = getFirestore();
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);

        const usersList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                name: data.name || 'Sin nombre',
                email: data.email || '',
                role: data.role || 'usuario',
                farmName: data.farmName || data.name || 'Finca',
                createdAt: data.createdAt,
                avatar: data.photoURL || null,
            };
        });

        usersList.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(usersList);
    };

    return { users, loading, error, refreshUsers };
};

export default useAdminUsers;
