// AuthObserver.jsx
import React, { useEffect } from 'react'; // Eliminamos 'useState'
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { auth, db } from '../../firebaseConfig'; 
import { 
    SET_LOGIN, 
    SET_NAME, 
    SET_USER 
} from "../../features/auth/authSlice/authSlice"; 

// Eliminamos 'loading' del estado local
const AuthObserver = ({ children, onAuthReady }) => { 
    const dispatch = useDispatch();
    
    // Usamos una referencia para asegurar que onAuthReady se llama solo una vez en la carga inicial
    // aunque la sesión cambie posteriormente.
    const isReadyRef = React.useRef(false); 

    useEffect(() => {
        // 🌟 onAuthStateChanged se ejecuta al cargar y al cambiar el estado de Auth
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Lógica de usuario logueado (sin cambios)
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                let userData = {
                    email: user.email,
                    uid: user.uid,
                    name: user.displayName || userDoc.data()?.name || "Invitado", 
                    role: userDoc.data()?.role || "subscriber",
                };
                
                dispatch(SET_LOGIN(true));
                dispatch(SET_USER(userData));
                dispatch(SET_NAME(userData.name));
            } else {
                // Lógica de usuario desconectado (sin cambios)
                dispatch(SET_LOGIN(false));
                dispatch(SET_USER({}));
                dispatch(SET_NAME("")); 
            }
            
            // 🚨 SOLUCIÓN: Llama a onAuthReady SÓLO la primera vez que se ejecuta el callback.
            if (!isReadyRef.current) {
                isReadyRef.current = true;
                onAuthReady(true); 
            }
        });

        // Limpiar la suscripción al desmontar
        return () => unsubscribe();
        
    // Dependencias limpias: ¡Ya no necesitamos 'loading'!
    }, [dispatch, onAuthReady]); 

    // Ya no chequeamos 'loading' aquí. Devolvemos los children para que App.jsx maneje el Loader.
    return children; 
};

export default AuthObserver;