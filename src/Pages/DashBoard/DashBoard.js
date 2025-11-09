

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/product+/ProductList";
import ProductSumer from "../../components/product/product+/ProductSumer";
import useRedirectLoggedOutUser from "../../custom/useRedirect";

import { 
    selectIsLoggedIn, 
    selectRole,
    selectUserId, 
} from "../../features/auth/authSlice/authSlice"; 
import { getProducts } from "../../features/product/ProductSlice";

// ID que se usaría para obtener los productos de otro usuario si el Admin lo necesita
const ADMIN_VIEWING_TARGET_ID = "user_target_abc_123"; 

const DashBoard = () => {
    // ----------------------------------------------------
    // 1. REGLA DE HOOKS: TODAS LAS LLAMADAS VAN AQUÍ
    // ----------------------------------------------------
    useRedirectLoggedOutUser("/login"); 
    const dispatch = useDispatch();

    // Selectores de Redux
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userRole = useSelector(selectRole); 
    const currentUserId = useSelector(selectUserId); 
    const { products, isLoading, isError, message } = useSelector(
        (state) => state.product
    );

    // ----------------------------------------------------
    // 2. LÓGICA DE CÁLCULO (Se ejecuta en cada render, después de los hooks)
    // ----------------------------------------------------
    let finalIdToFetch = currentUserId; // Valor por defecto: el ID del usuario actual
    let isAdminViewingAnotherUser = false; 

    if (userRole === "admin") {
        // En un caso real, este ID vendría de la URL (query param) o de otro estado,
        // pero usamos el constante por el ejemplo.
        finalIdToFetch = ADMIN_VIEWING_TARGET_ID; 
        
        // Determinar si el admin está viendo productos que no son los suyos (modo "own")
        if (finalIdToFetch !== currentUserId) {
            isAdminViewingAnotherUser = true;
        } else {
            // Si el admin ve su propio ID (usando "own"), asumimos que quiere ver "all"
            // si el backend lo permite. Esto es solo para lógica de presentación.
        }
    }

    // ----------------------------------------------------
    // 3. useEffect (Dispara la acción de obtención de productos)
    // ----------------------------------------------------
    useEffect(() => { 
        // 🛑 CONDICIÓN CLAVE: Si no está logueado o el ID final es nulo, salir.
        if (!isLoggedIn || !finalIdToFetch) return; 
        
        let fetchMode = "own"; 
        
        // Si el usuario es admin y el ID a buscar es su propio ID, cambia a modo "all"
        if (userRole === "admin" && finalIdToFetch === currentUserId) {
            fetchMode = "all";
        }
        
        // Si es un admin viendo a otro usuario (isAdminViewingAnotherUser = true),
        // el modo es "own" para ese otro usuario.

        dispatch(getProducts({ 
            userId: finalIdToFetch, // Usamos la variable calculada
            mode: fetchMode 
        }));

        if (isError) {
            console.log(message);
        }
        
    }, [
        isLoggedIn, 
        isError, 
        message, 
        dispatch, 
        userRole,
        currentUserId, 
        finalIdToFetch, // ⬅️ IMPORTANTE: Ahora es una dependencia
    ]); 
    
    // -----------------------------------------------------------
    // 🛑 4. BLOQUEO DE RENDERIZADO: Verifica los valores de Redux
    // -----------------------------------------------------------
    // Si el usuario no está logueado O si el ID del usuario no se ha cargado aún, 
    // muestra el mensaje de carga.
    if (!isLoggedIn || !currentUserId) {
        // 💡 Sugerencia de depuración: 
        // console.log("Bloqueado. isLoggedIn:", isLoggedIn, "currentUserId:", currentUserId);
        return (
            <div className="text-center p-10 text-xl text-gray-500">
                Verificando su sesión y cargando el Panel...
            </div>
        );
    }
    // -----------------------------------------------------------

    // 5. RENDERIZADO
    return (
        <div className="">
            {isAdminViewingAnotherUser && (
                <div className="p-2 bg-blue-100 text-blue-800 text-center font-bold mb-4 rounded **text-sm md:text-base**">
                    👁️ VISTA DE ADMINISTRADOR
                </div>
            )}
            
            <ProductSumer products={products} />
            <ProductList products={products} isLoading={isLoading} />
        </div>
    );
};

export default DashBoard;