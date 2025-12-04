import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore'; 
import { selectUserId, selectRole, selectIsImpersonating } from '../../../features/auth/authSlice/authSlice'; 
import useProductsFromFirestore from '../../../Util/useProductsFromFirestore'; 
// Importamos los componentes hijos:
import ProductList from './ProductList';
// import ProductSumer from '../../Inventario/ProductSumer'; // Asumo que es InventorySummaryCard

const UserProductList = () => {
    const currentUserId = useSelector(selectUserId);
    const userRole = useSelector(selectRole); 
    const isImpersonating = useSelector(selectIsImpersonating);
    
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
    
    // --- Lógica para obtener TODOS los Usuarios (Solo si es Admin y NO está impersonando) ---
    useEffect(() => {
        if (userRole !== 'admin' || isImpersonating) {
            setAllUsers([]); // Limpiar si no es admin o si está impersonando
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
    }, [userRole, isImpersonating]);
    
    // --- Determinación de la Lógica de Carga de Productos ---
    let idToFetch = null;
    let fetchMode = null;
    let filterId = null;

    if (!currentUserId) {
        idToFetch = null;
        fetchMode = null;
    } else if (userRole === 'admin' && !isImpersonating) {
        // Admin real (no impersonando) ve todo o filtra
        idToFetch = null;
        fetchMode = 'all'; 
        filterId = selectedUserId;
    } else {
        // Usuario normal O Admin impersonando
        idToFetch = currentUserId; // selectUserId ya devuelve el ID del target si es impersonation
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
            {/* CONTROLES DE FILTRO (SOLO PARA ADMIN REAL) */}
            {userRole === 'admin' && !isImpersonating && (
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