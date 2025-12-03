import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import CostesManager from '../../components/COSTOS/CostesManager';
import Loader from '../../Util/Loader';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};

const appId = getAppId();

const CostesPage = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [availableLocals, setAvailableLocals] = useState([]);
    const [availableWorkers, setAvailableWorkers] = useState([]);

    // Authentication listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // Load available locals and workers from Firestore
    useEffect(() => {
        if (!userId || !db) return;

        // Import Firestore functions
        import('firebase/firestore').then(({ collection, query, where, onSnapshot }) => {
            // Load locals/projects
            const localsPath = `artifacts/${appId}/public/data/projects`;
            const localsQuery = query(
                collection(db, localsPath),
                where("createdBy", "==", userId)
            );

            const unsubLocals = onSnapshot(localsQuery, (snapshot) => {
                const locals = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvailableLocals(locals);
            });

            // Load workers
            const workersPath = `artifacts/${appId}/public/data/workers`;
            const workersQuery = query(
                collection(db, workersPath),
                where("userId", "==", userId)
            );

            const unsubWorkers = onSnapshot(workersQuery, (snapshot) => {
                const workers = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvailableWorkers(workers);
            });

            return () => {
                unsubLocals();
                unsubWorkers();
            };
        });
    }, [userId]);

    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>
                    <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    return (
        <CostesManager
            db={db}
            userId={userId}
            availableLocals={availableLocals}
            availableWorkers={availableWorkers}
        />
    );
};

export default CostesPage;
