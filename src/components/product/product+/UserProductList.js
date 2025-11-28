// // --- src/components/product/product+/UserProductList.js ---
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectUserId, selectRole } from '../../../features/auth/authSlice/authSlice'; // 🚨 IMPORTAR selectRole
// import useProductsFromFirestore from '../../../Util/useProductsFromFirestore'; 
// import { useApi } from '../../../hooks/useApi';
// import ProductList from './ProductList';
// import ProductSumer from './ProductSumer';

// const UserProductList = () => {
//     // 1. Obtener el ID y el ROL del usuario actual de Redux
//     const currentUserId = useSelector(selectUserId);
//     const userRole = useSelector(selectRole); // 🚨 NUEVO: Obtener el rol
    
//     // 2. Determinar los parámetros de carga
    
//     let idToFetch = null;
//     let fetchMode = null;
    
//     if (!currentUserId) {
//         // Si no hay ID de usuario logueado, no se intenta cargar nada.
//         idToFetch = null;
//         fetchMode = null;
//     } else if (userRole === 'admin') {
//         // Administrador: Debe ver TODOS los productos.
//         idToFetch = null; // No necesitamos filtrar por UID
//         fetchMode = 'all'; 
//     } else {
//         // Usuario estándar, invitado, etc.: Solo ve sus productos.
//         idToFetch = currentUserId; // El UID para filtrar
//         fetchMode = 'own'; 
//     }
    
//     // 3. Obtener datos con el hook (solo se dispara si fetchMode es válido)
//     const { products, isLoading, error } = useProductsFromFirestore(
//         idToFetch, // UID del usuario (solo si es modo 'own')
//         userRole,  // Pasamos el rol real
//         fetchMode  // Modo 'all', 'own', o null
//     );

//     // ... El resto del código se mantiene igual ...
    
//     if (error) {
//         return (
//             <div className="text-center p-10 text-xl text-red-500">
//                 ❌ Error al cargar tus productos: {error.message || String(error)}
//             </div>
//         );
//     }
    
//     if (isLoading) {
//         return <div className="text-center p-10">Cargando productos...</div>;
//     }
    
//     if (!isLoading && products.length === 0) {
//         return (
//             <div className="text-center p-10 text-xl text-gray-500">
//                 No tienes productos creados. ¡Empieza añadiendo uno!
//             </div>
//         );
//     }


//     return (
//         <>
//             {/* Solo mostramos el resumen y la lista si hay productos */}
//             {products.length > 0 && <ProductSumer products={products} />}
//             <ProductList products={products} isLoading={isLoading} />
//         </>
//     );
// };

// export default UserProductList;



// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { db } from '../../../firebaseConfig'; // Asegúrate de que esta ruta sea correcta
// import { collection, query, getDocs } from 'firebase/firestore'; 
// import { selectUserId, selectRole } from '../../../features/auth/authSlice/authSlice'; 
// import useProductsFromFirestore from '../../../Util/useProductsFromFirestore'; // Asegúrate de que esta ruta sea correcta
// import ProductList from './ProductList';
// import ProductSumer from './ProductSumer';

// const UserProductList = () => {
//     const currentUserId = useSelector(selectUserId);
//     const userRole = useSelector(selectRole); 
//     
//     // ESTADOS PARA EL FILTRO Y LA LISTA DE USUARIOS
//     const [selectedUserId, setSelectedUserId] = useState('all'); // 'all' para todos los productos inicialmente
//     const [allUsers, setAllUsers] = useState([]);
//     const [usersLoading, setUsersLoading] = useState(false);
//     
//     // --- Lógica para obtener TODOS los Usuarios (Solo si es Admin) ---
//     useEffect(() => {
//         if (userRole !== 'admin') {
//             setAllUsers([]); // Limpiar si no es admin
//             return;
//         }

//         const fetchAllUsers = async () => {
//             setUsersLoading(true);
//             try {
//                 // ATENCIÓN: Colección de usuarios
//                 const usersRef = collection(db, "users");
//                 const snapshot = await getDocs(query(usersRef));
//                 
//                 const userList = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));

//                 // Filtrar usuarios que tengan un rol permitido si es necesario
//                 setAllUsers(userList);
//             } catch (error) {
//                 console.error("Error al cargar la lista de usuarios:", error);
//             } finally {
//                 setUsersLoading(false);
//             }
//         };
//         
//         fetchAllUsers();
//     }, [userRole]);
//     
//     // --- Determinación de la Lógica de Carga de Productos ---
//     let idToFetch = null;
//     let fetchMode = null;
//     let filterId = null;

//     if (!currentUserId) {
//         idToFetch = null;
//         fetchMode = null;
//     } else if (userRole === 'admin') {
//         idToFetch = null;
//         fetchMode = 'all'; 
//         filterId = selectedUserId; // Usa el ID seleccionado en el filtro
//     } else {
//         idToFetch = currentUserId; 
//         fetchMode = 'own'; 
//         filterId = null; 
//     }
//     
//     // Obtener productos
//     const { products, isLoading, error } = useProductsFromFirestore(
//         idToFetch, 
//         userRole, 
//         fetchMode,
//         filterId 
//     );
//     
//     // --- Renderizado ---
//     
//     if (error) {
//         return (
//             <div className="text-center p-10 text-xl text-red-500">
//                 ❌ Error al cargar productos: {error.message || String(error)}
//             </div>
//         );
//     }
//     
//     if (isLoading || usersLoading) { 
//         return <div className="text-center p-10">Cargando datos...</div>;
//     }
//     
//     return (
//         <div className="p-4">
//             {/* CONTROLES DE FILTRO (SOLO PARA ADMIN) */}
//             {userRole === 'admin' && (
//                 <div className="mb-6 flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
//                     <label className="font-bold text-lg text-gray-800">Filtrar:</label>
//                     <select
//                         value={selectedUserId}
//                         onChange={(e) => setSelectedUserId(e.target.value)}
//                         className="p-2 border-2 border-green-500 rounded-md shadow-md bg-white hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-150"
//                     >
//                         <option value="all">-- Mostrar Todos --</option>
//                         {allUsers.map((user) => (
//                             <option key={user.id} value={user.id}>
//                                 {user.name || user.email || `Usuario ID: ${user.id.substring(0, 4)}...`}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             )}
//             
//             {/* Mensajes de Productos No Encontrados */}
//             {products.length === 0 && userRole === 'admin' && selectedUserId !== 'all' ? (
//                 <div className="text-center p-10 text-xl text-gray-500 bg-white shadow rounded-lg mt-4">
//                     El usuario seleccionado no tiene productos registrados.
//                 </div>
//             ) : products.length === 0 && fetchMode !== null ? (
//                 <div className="text-center p-10 text-xl text-gray-500 bg-white shadow rounded-lg mt-4">
//                     No tienes productos creados. ¡Empieza añadiendo uno!
//                 </div>
//             ) : (
//                 <>
//                     {products.length > 0 && <ProductSumer products={products} />}
//                     <ProductList products={products} isLoading={isLoading} />
//                 </>
//             )}
//         </div>
//     );
// };

// export default UserProductList;



// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { db } from '../../../firebaseConfig';
// import { collection, query, getDocs } from 'firebase/firestore'; 
// import { selectUserId, selectRole } from '../../../features/auth/authSlice/authSlice'; 
// import useProductsFromFirestore from '../../../Util/useProductsFromFirestore'; 
// import ProductList from './ProductList';
// import ProductSumer from '../../Inventario/ProductSumer';

// const UserProductList = () => {
//     const currentUserId = useSelector(selectUserId);
//     const userRole = useSelector(selectRole); 
    
//     // ESTADOS PARA EL FILTRO Y LA LISTA DE USUARIOS
//     const [selectedUserId, setSelectedUserId] = useState('all'); // 'all' para todos los productos inicialmente
//     const [allUsers, setAllUsers] = useState([]);
//     const [usersLoading, setUsersLoading] = useState(false);
    
//     // --- Lógica para obtener TODOS los Usuarios (Solo si es Admin) ---
//     useEffect(() => {
//         if (userRole !== 'admin') {
//             setAllUsers([]); // Limpiar si no es admin
//             return;
//         }

//         const fetchAllUsers = async () => {
//             setUsersLoading(true);
//             try {
//                 // ATENCIÓN: Colección de usuarios
//                 const usersRef = collection(db, "users");
//                 const snapshot = await getDocs(query(usersRef));
                
//                 const userList = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));

//                 // Filtrar usuarios que tengan un rol permitido si es necesario
//                 setAllUsers(userList);
//             } catch (error) {
//                 console.error("Error al cargar la lista de usuarios:", error);
//             } finally {
//                 setUsersLoading(false);
//             }
//         };
        
//         fetchAllUsers();
//     }, [userRole]);
    
//     // --- Determinación de la Lógica de Carga de Productos ---
//     let idToFetch = null;
//     let fetchMode = null;
//     let filterId = null;

//     if (!currentUserId) {
//         idToFetch = null;
//         fetchMode = null;
//     } else if (userRole === 'admin') {
//         idToFetch = null;
//         fetchMode = 'all'; 
//         filterId = selectedUserId; // Usa el ID seleccionado en el filtro
//     } else {
//         idToFetch = currentUserId; 
//         fetchMode = 'own'; 
//         filterId = null; 
//     }
    
//     // Obtener productos
//     const { products, isLoading, error } = useProductsFromFirestore(
//         idToFetch, 
//         userRole, 
//         fetchMode,
//         filterId 
//     );
    
//     // --- Renderizado ---
    
//     if (error) {
//         return (
//             <div className="text-center p-10 text-xl text-red-500">
//                 ❌ Error al cargar productos: {error.message || String(error)}
//             </div>
//         );
//     }
    
//     if (isLoading || usersLoading) { 
//         return <div className="text-center p-10">Cargando datos...</div>;
//     }
    
//     return (
//         <div className="p-4">
//             {/* CONTROLES DE FILTRO (SOLO PARA ADMIN) */}
//             {userRole === 'admin' && (
//                 <div className="mb-6 flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
//                     <label className="font-bold text-lg text-gray-800">Filtrar:</label>
//                     <select
//                         value={selectedUserId}
//                         onChange={(e) => setSelectedUserId(e.target.value)}
//                         className="p-2 border-2 border-green-500 rounded-md shadow-md bg-white hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-150"
//                     >
//                         <option value="all">-- Mostrar Todos --</option>
//                         {allUsers.map((user) => (
//                             <option key={user.id} value={user.id}>
//                                 {user.name || user.email || `Usuario ID: ${user.id.substring(0, 4)}...`}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             )}
            
//             {/* Mensajes de Productos No Encontrados */}
//             {products.length === 0 && userRole === 'admin' && selectedUserId !== 'all' ? (
//                 <div className="text-center p-10 text-xl text-gray-500 bg-white shadow rounded-lg mt-4">
//                     El usuario seleccionado no tiene productos registrados.
//                 </div>
//             ) : products.length === 0 && fetchMode !== null ? (
//                 <div className="text-center p-10 text-xl text-gray-500 bg-white shadow rounded-lg mt-4">
//                     No tienes productos creados. ¡Empieza añadiendo uno!
//                 </div>
//             ) : (
//                 <>
//                     {products.length > 0 && <ProductSumer products={products} />}
//                     <ProductList products={products} isLoading={isLoading} />
//                 </>
//             )}
//         </div>
//     );
// };

// export default UserProductList;




import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore'; 
import { selectUserId, selectRole } from '../../../features/auth/authSlice/authSlice'; 
import useProductsFromFirestore from '../../../Util/useProductsFromFirestore'; 
// Importamos los componentes hijos:
import ProductList from './ProductList';
import ProductSumer from '../../Inventario/ProductSumer'; // Asumo que es InventorySummaryCard

const UserProductList = () => {
    const currentUserId = useSelector(selectUserId);
    const userRole = useSelector(selectRole); 
    
    // ESTADOS PARA EL FILTRO POR USUARIO (Admin)
    const [selectedUserId, setSelectedUserId] = useState('all'); 
    const [allUsers, setAllUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // 🚨 ESTADO CLAVE AÑADIDO: Manejar la categoría activa (Fitosanitarios por defecto)
    const [activeCategory, setActiveCategory] = useState('Fitosanitarios');

    // 🚨 FUNCIÓN CLAVE AÑADIDA: Maneja el clic en la tarjeta de resumen
    const handleCategorySelect = (categoryTitle) => {
        setActiveCategory(categoryTitle);
    };
    
    // --- Lógica para obtener TODOS los Usuarios (Solo si es Admin) ---
    useEffect(() => {
        // ... (Tu lógica existente para obtener usuarios, sin cambios) ...
        if (userRole !== 'admin') {
             setAllUsers([]);
             return;
        }

        const fetchAllUsers = async () => {
             setUsersLoading(true);
             try {
                 const usersRef = collection(db, "users");
                 const snapshot = await getDocs(query(usersRef));
                 
                 const userList = snapshot.docs.map(doc => ({
                     id: doc.id,
                     ...doc.data()
                 }));

                 setAllUsers(userList);
             } catch (error) {
                 console.error("Error al cargar la lista de usuarios:", error);
             } finally {
                 setUsersLoading(false);
             }
        };
        
        fetchAllUsers();
    }, [userRole]);
    
    // --- Determinación de la Lógica de Carga de Productos (sin cambios) ---
    let idToFetch = null;
    let fetchMode = null;
    let filterId = null;

    if (!currentUserId) {
        idToFetch = null;
        fetchMode = null;
    } else if (userRole === 'admin') {
        idToFetch = null;
        fetchMode = 'all'; 
        filterId = selectedUserId;
    } else {
        idToFetch = currentUserId; 
        fetchMode = 'own'; 
        filterId = null; 
    }
    
    // Obtener productos
    const { products, isLoading, error } = useProductsFromFirestore(
        idToFetch, 
        userRole, 
        fetchMode,
        filterId 
    );
    
    // --- Renderizado (Modificado para pasar la categoría) ---
    
    if (error) {
        return (
            <div className="text-center p-10 text-xl text-red-500">
                ❌ Error al cargar productos: {error.message || String(error)}
            </div>
        );
    }
    
    if (isLoading || usersLoading) { 
        return <div className="text-center p-10">Cargando datos...</div>;
    }
    
    return (
        <div className="p-4">
            {/* CONTROLES DE FILTRO (SOLO PARA ADMIN) - Sin cambios */}
            {userRole === 'admin' && (
                <div className="mb-6 flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
                    <label className="font-bold text-lg text-gray-800">Filtrar:</label>
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="p-2 border-2 border-green-500 rounded-md shadow-md bg-white hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-150"
                    >
                        <option value="all">-- Mostrar Todos --</option>
                        {allUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email || `Usuario ID: ${user.id.substring(0, 4)}...`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            {/* Mensajes de Productos No Encontrados (simplificado) */}
            {products.length === 0 && fetchMode !== null ? (
                <div className="text-center p-10 text-xl text-gray-500 bg-white shadow rounded-lg mt-4">
                    No se encontraron productos para los filtros aplicados.
                </div>
            ) : (
                <>
                    {/* 🚨 AQUÍ SE PASAN LAS NUEVAS PROPS DE CATEGORÍA */}
                    {/* {products.length > 0 && (
                        <ProductSumer 
                            products={products} 
                            // 1. Pasa la función para recibir el clic
                            onCategorySelect={handleCategorySelect} 
                            // 2. Pasa la categoría activa para que se resalte
                            selectedCategory={activeCategory} 
                        />
                    )} */}
                    
                    {/* 🚨 AQUÍ SE PASA LA CATEGORÍA PARA QUE LA LISTA FILTRE */}
                    <ProductList 
                        products={products} 
                        isLoading={isLoading} 
                        // 3. Pasa la categoría activa para que ProductList filtre sus productos
                        selectedCategory={activeCategory}
                    />
                </>
            )}
        </div>
    );
};

export default UserProductList;