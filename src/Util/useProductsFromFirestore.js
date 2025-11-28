// // --- src/hooks/useProductsFromFirestore.js (CORREGIDO) ---
// import { useState, useEffect }  from 'react';
// import { db } from '../firebaseConfig'; 
// import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';

// // El campo en Firestore donde se guarda el UID del propietario es "userId"
// const USER_ID_DB_FIELD = "userId"; 

// const useProductsFromFirestore = (userId, userRole, fetchMode) => {
//     const [products, setProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // ... (Lógica de validación inicial) ...

//         if (!userId && fetchMode === 'own') {
//             setIsLoading(false);
//             return;
//         }

//         let q;
//         const productsRef = collection(db, "products");

//         if (fetchMode === 'all') {
//             // Admin: Ver todos.
//             q = query(productsRef, orderBy("createdAt", "desc"));
//         } else if (fetchMode === 'own') {
//             // Usuario Estándar: Ver solo sus productos.
//             // 🚨 CORRECCIÓN CLAVE: Usar el nombre del campo correcto ("userId") 🚨
//             q = query(productsRef, where(USER_ID_DB_FIELD, "==", userId), orderBy("createdAt", "desc"));
//         } else {
//             setIsLoading(false);
//             return;
//         }
        
//         setIsLoading(true);
//         setError(null);

//         // 🛑 USAMOS ON-SNAPSHOT (LECTURA EN TIEMPO REAL) 🛑
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const productList = snapshot.docs.map(doc => ({
//                 _id: doc.id,
//                 ...doc.data(),
//                 // ... (conversión de Timestamp) ...
//             }));
            
//             setProducts(productList);
//             setIsLoading(false);
//         }, (err) => {
//             console.error("Error al obtener productos de Firestore:", err);
//             setError("No se pudieron cargar los productos: " + err.message);
//             setIsLoading(false);
//         });

//         return () => unsubscribe();

//     }, [userId, fetchMode]); 

//     return { products, isLoading, error };
// };

// export default useProductsFromFirestore;


// import { useState, useEffect } from 'react';
// import { db } from '../firebaseConfig'; 
// import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// const USER_ID_DB_FIELD = "userId"; 

// const useProductsFromFirestore = (currentUserId, userRole, fetchMode, filterUserId = null) => {
//     const [products, setProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!currentUserId && fetchMode === 'own') {
//             setIsLoading(false);
//             return;
//         }

//         let q;
//         const productsRef = collection(db, "products");

//         setIsLoading(true);
//         setError(null);

//         // --- Lógica de la consulta (query) ---
//         if (fetchMode === 'all') {
//             // 1. MODO ADMIN - VISTA GLOBAL CON FILTRO
//             if (filterUserId && filterUserId !== 'all') {
//                 // Filtrar por un usuario específico seleccionado
//                 q = query(productsRef, 
//                     where(USER_ID_DB_FIELD, "==", filterUserId), 
//                     orderBy("createdAt", "desc")
//                 );
//             } else {
//                 // Mostrar todos los productos
//                 q = query(productsRef, orderBy("createdAt", "desc"));
//             }
//         } else if (fetchMode === 'own') {
//             // 2. MODO USUARIO ESTÁNDAR - VISTA PROPIA
//             q = query(productsRef, where(USER_ID_DB_FIELD, "==", currentUserId), orderBy("createdAt", "desc"));
//         } else {
//             setIsLoading(false);
//             return;
//         }
//         
//         // USAMOS ON-SNAPSHOT (LECTURA EN TIEMPO REAL)
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const productList = snapshot.docs.map(doc => ({
//                 _id: doc.id,
//                 ...doc.data(),
//                 // ... (conversión de Timestamp si es necesaria) ...
//             }));
//             
//             setProducts(productList);
//             setIsLoading(false);
//         }, (err) => {
//             console.error("Error al obtener productos de Firestore:", err);
//             setError("No se pudieron cargar los productos: " + err.message);
//             setIsLoading(false);
//         });

//         return () => unsubscribe();

//     }, [currentUserId, fetchMode, filterUserId]); 

//     return { products, isLoading, error };
// };

// export default useProductsFromFirestore;



import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const USER_ID_DB_FIELD = "userId"; 

const useProductsFromFirestore = (currentUserId, userRole, fetchMode, filterUserId = null) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🛑 1. VALIDACIÓN CRÍTICA: Bloquear la carga si el modo 'own' no tiene un ID
        if (fetchMode === 'own' && !currentUserId) {
            // Esto evita que se intente construir una consulta inválida de Firestore.
            console.warn("Modo 'own' solicitado, pero el ID de usuario no es válido. Devolviendo lista vacía.");
            setProducts([]);
            setIsLoading(false);
            return;
        }

        // 🛑 2. Bloquear si no hay modo de carga definido
        if (!fetchMode) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        // --- Inicialización de la Carga ---
        let q;
        const productsRef = collection(db, "products");
        
        // La carga comienza solo si estamos a punto de hacer la consulta
        setIsLoading(true);
        setError(null);

        // --- Lógica de la consulta (query) ---
        if (fetchMode === 'all') {
            // 1. MODO ADMIN - VISTA GLOBAL CON FILTRO
            if (filterUserId && filterUserId !== 'all') {
                // Filtrar por un usuario específico seleccionado
                q = query(productsRef, 
                    where(USER_ID_DB_FIELD, "==", filterUserId), 
                    orderBy("createdAt", "desc")
                );
            } else {
                // Mostrar todos los productos
                q = query(productsRef, orderBy("createdAt", "desc"));
            }
        } else if (fetchMode === 'own') {
            // 2. MODO USUARIO ESTÁNDAR - VISTA PROPIA (currentUserId ya está garantizado)
            q = query(productsRef, 
                where(USER_ID_DB_FIELD, "==", currentUserId), 
                orderBy("createdAt", "desc")
            );
        }
        
        // USAMOS ON-SNAPSHOT (LECTURA EN TIEMPO REAL)
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productList = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data(),
                // Aquí puedes añadir lógica para convertir Timestamps si es necesario
            }));
            
            setProducts(productList);
            setIsLoading(false);
        }, (err) => {
            console.error("Error al obtener productos de Firestore:", err);
            setError("No se pudieron cargar los productos: " + err.message);
            setIsLoading(false);
        });

        return () => unsubscribe();

    }, [currentUserId, fetchMode, filterUserId]); 

    return { products, isLoading, error };
};

export default useProductsFromFirestore;