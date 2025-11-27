// AppContext.js

import React, { createContext, useState, useContext } from 'react';

// ⚠️ NOTA: Debes pasar el objeto 'auth' de Firebase (si ya lo tienes en un contexto)
// y el estado 'isAdmin' al AppProvider desde tu componente superior (ej. App.js)

export const AppContext = createContext({
    user: null, // Objeto del usuario logueado (admin)
    isAdmin: false, 
    targetUserId: null, // El ID que la app debe usar para las consultas
    setImpersonatedUserId: () => {}, // Función para cambiar el ID
    impersonatedUserId: "", // ID del usuario seleccionado en el selector
});

export const AppProvider = ({ children, initialUser, isAdmin }) => {
    // initialUser es el objeto del usuario admin actualmente logueado
    const [impersonatedUserId, setImpersonatedUserId] = useState(""); 
    
    // El ID real a usar en las consultas: el seleccionado o el propio ID del admin
    const targetUserId = impersonatedUserId || (initialUser ? initialUser.uid : null); 

    return (
        <AppContext.Provider value={{
            user: initialUser,       
            isAdmin: isAdmin,        
            targetUserId: targetUserId, 
            setImpersonatedUserId: setImpersonatedUserId,
            impersonatedUserId: impersonatedUserId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);