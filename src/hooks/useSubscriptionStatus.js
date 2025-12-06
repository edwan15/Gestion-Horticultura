import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useSubscriptionStatus = () => {
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [daysRemaining, setDaysRemaining] = useState(null);
    const userId = useSelector(state => state.auth.userId);

    useEffect(() => {
        const checkSubscription = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Obtener datos del usuario de Firestore
                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    // Si es usuario legacy (antiguo), tiene acceso completo
                    if (userData.isLegacyUser === undefined || userData.isLegacyUser === true) {
                        setSubscriptionData({
                            hasAccess: true,
                            status: 'legacy',
                            isLegacyUser: true
                        });
                        setLoading(false);
                        return;
                    }

                    // Si tiene suscripción activa
                    if (userData.subscriptionStatus === 'active') {
                        setSubscriptionData({
                            hasAccess: true,
                            status: 'active',
                            isLegacyUser: false
                        });
                        setLoading(false);
                        return;
                    }

                    // Si está en período de prueba
                    if (userData.subscriptionStatus === 'trial' && userData.trialEndsAt) {
                        const trialEnd = userData.trialEndsAt.toDate ? userData.trialEndsAt.toDate() : new Date(userData.trialEndsAt);
                        const now = new Date();
                        const diffTime = trialEnd - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays > 0) {
                            // Prueba activa
                            setSubscriptionData({
                                hasAccess: true,
                                status: 'trial',
                                trialEndsAt: trialEnd,
                                isLegacyUser: false
                            });
                            setDaysRemaining(diffDays);
                        } else {
                            // Prueba expirada
                            setSubscriptionData({
                                hasAccess: false,
                                status: 'expired',
                                isLegacyUser: false
                            });
                            setDaysRemaining(0);
                        }
                        setLoading(false);
                        return;
                    }

                    // Sin suscripción ni prueba
                    setSubscriptionData({
                        hasAccess: false,
                        status: 'none',
                        isLegacyUser: false
                    });
                } else {
                    // Usuario no encontrado en Firestore
                    setSubscriptionData({
                        hasAccess: false,
                        status: 'none',
                        isLegacyUser: false
                    });
                }
            } catch (error) {
                console.error('Error al verificar suscripción:', error);
                setSubscriptionData({
                    hasAccess: false,
                    status: 'error',
                    isLegacyUser: false
                });
            } finally {
                setLoading(false);
            }
        };

        checkSubscription();
    }, [userId]);

    return { subscriptionData, loading, daysRemaining };
};
