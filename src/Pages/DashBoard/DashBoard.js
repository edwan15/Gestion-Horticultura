// // export default DashBoard;
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ProductList from "../../components/product/product+/ProductList";
// import ProductSumer from "../../components/product/product+/ProductSumer";
// import useRedirectLoggedOutUser from "../../custom/useRedirect";

// // 🛑 Importaciones SIMPLIFICADAS: Solo necesitamos el estado básico
// import { 
//     selectIsLoggedIn, 
//     selectRole,
//     selectUserId, // ID del usuario logueado (Admin o Estándar)
// } from "../../features/auth/authSlice/authSlice"; 
// import { getProducts } from "../../features/product/ProductSlice";

// // 🚨 PLACEHOLDER: En una aplicación real, este ID vendría de la URL (ej. useParams) o de un estado global.
// // ASUME que el Admin quiere ver a "user_target_abc_123"
// const ADMIN_VIEWING_TARGET_ID = "user_target_abc_123"; 

// const DashBoard = () => {
//     useRedirectLoggedOutUser("/login");
//     const dispatch = useDispatch();

//     const isLoggedIn = useSelector(selectIsLoggedIn);
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); // ID de la sesión activa
    
//     // 🛑 Lógica para determinar el ID FINAL a enviar al Backend
//     let finalIdToFetch = null;
//     let isAdminViewingAnotherUser = false; // Bandera para la UI

//     if (userRole === "admin") {
//         // Caso 1: Administrador. Queremos ver al TARGET_USER_ID_PLACEHOLDER.
//         finalIdToFetch = ADMIN_VIEWING_TARGET_ID; 
        
//         // Si el ID que está en la URL es diferente al ID del Admin (sesión activa),
//         // está viendo a otro usuario. (Esto es una suposición con el placeholder).
//         if (finalIdToFetch !== currentUserId) {
//              isAdminViewingAnotherUser = true;
//         }

//     } else if (currentUserId) {
//         // Caso 2: Usuario Estándar o Invitado. Solo puede ver sus propios datos.
//         finalIdToFetch = currentUserId;
//     }

//     const { products, isLoading, isError, message } = useSelector(
//         (state) => state.product
//     );

//     useEffect(() => {
//         // Solo proceder si el usuario está logueado y se ha determinado un ID objetivo
//         if (!isLoggedIn || !finalIdToFetch) return; 
        
//         // ----------------------------------------------------
//         // 🚨 LÓGICA DE FILTRADO (Simplificada)
//         // ----------------------------------------------------
//         let fetchMode = "own"; 

//         if (userRole === "admin" && !isAdminViewingAnotherUser) {
//             // Si el Admin está en su propio Dashboard (y no viendo un target específico),
//             // puede que quiera ver 'all' (si tu API lo permite).
//             fetchMode = "all";
//         }
        
//         // ----------------------------------------------------
//         // 🚨 DESPACHAR LA ACCIÓN
//         // ----------------------------------------------------
//         // El Backend recibirá el ID de la persona que debe filtrar,
//         // y su rol (a través del token) dictará si se permite filtrar por ese ID.
//         dispatch(getProducts({ 
//             userId: finalIdToFetch, // El ID que el backend usará para la cláusula WHERE
//             mode: fetchMode         // 'all' si es Admin en su propio dashboard, 'own' si filtra por un ID
//         }));

//         if (isError) {
//             console.log(message);
//         }
        
//     }, [
//         isLoggedIn, 
//         isError, 
//         message, 
//         dispatch, 
//         userRole,
//         finalIdToFetch, 
//         isAdminViewingAnotherUser 
//     ]); 

//     return (
//         <div className="">
//             {/* 🛑 Indicador visual para el Admin */}
//             {isAdminViewingAnotherUser && (
//                 <div className="p-2 bg-blue-100 text-blue-800 text-center font-bold mb-4 rounded">
//                     👁️ VISTA DE ADMINISTRADOR
//                 </div>
//             )}
            
//             <ProductSumer products={products} />
//             <ProductList products={products} isLoading={isLoading} />
//         </div>
//     );
// };

// export default DashBoard;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/product+/ProductList";
import ProductSumer from "../../components/product/product+/ProductSumer";
import useRedirectLoggedOutUser from "../../custom/useRedirect";

import { 
    selectIsLoggedIn, 
    selectRole,
    selectUserId, // ID del usuario logueado (Admin o Estándar)
} from "../../features/auth/authSlice/authSlice"; 
import { getProducts } from "../../features/product/ProductSlice";

const ADMIN_VIEWING_TARGET_ID = "user_target_abc_123"; 

const DashBoard = () => {
    // ----------------------------------------------------
    // ✅ 1. REGLA DE HOOKS: TODAS LAS LLAMADAS VAN AQUÍ (INCONDICIONALMENTE)
    // ----------------------------------------------------
    useRedirectLoggedOutUser("/login"); 
    const dispatch = useDispatch();

    // Selectores de Redux (Hooks)
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userRole = useSelector(selectRole); 
    const currentUserId = useSelector(selectUserId); 
    const { products, isLoading, isError, message } = useSelector(
        (state) => state.product
    );

    // useEffect: Aunque tiene lógica condicional dentro, LA LLAMADA AL HOOK es incondicional.
    useEffect(() => { 
        // 4. Lógica de obtención de productos: Se ejecuta SÓLO cuando las dependencias cambian
        // y la condición interna es verdadera.
        if (!isLoggedIn || !finalIdToFetch) return; 
        
        let fetchMode = "own"; 
        let isAdminViewingAnotherUser = false; // Se recalcula internamente si es necesario

        // Recalcular la lógica aquí para usar las dependencias
        let idToFetch = currentUserId;

        if (userRole === "admin") {
            idToFetch = ADMIN_VIEWING_TARGET_ID; 
            if (idToFetch !== currentUserId) {
                 isAdminViewingAnotherUser = true;
            }
        }
        
        if (userRole === "admin" && !isAdminViewingAnotherUser) {
            fetchMode = "all";
        }
        
        dispatch(getProducts({ 
            userId: idToFetch, // Usamos el ID recalculado o el finalIdToFetch del estado
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
        currentUserId, // Lo usamos como dependencia para disparar el efecto
    ]); 
    // ----------------------------------------------------

    // -----------------------------------------------------------
    // 🛑 2. BLOQUEO DE RENDERIZADO: VA DESPUÉS DE TODOS LOS HOOKS
    // -----------------------------------------------------------
    if (!isLoggedIn || !currentUserId) {
        return (
            <div className="text-center p-10 text-xl text-gray-500">
                Verificando su sesión y cargando el Panel...
            </div>
        );
    }
    // -----------------------------------------------------------

    // 3. LÓGICA NO-HOOK (Ejecución segura, porque currentUserId ya está definido)
    let finalIdToFetch = currentUserId; // Valor por defecto
    let isAdminViewingAnotherUser = false; 

    if (userRole === "admin") {
        finalIdToFetch = ADMIN_VIEWING_TARGET_ID; 
        
        if (finalIdToFetch !== currentUserId) {
             isAdminViewingAnotherUser = true;
        }
    }
    

    return (
        <div className="">
            {isAdminViewingAnotherUser && (
                <div className="p-2 bg-blue-100 text-blue-800 text-center font-bold mb-4 rounded">
                    👁️ VISTA DE ADMINISTRADOR
                </div>
            )}
            
            <ProductSumer products={products} />
            <ProductList products={products} isLoading={isLoading} />
        </div>
    );
};

export default DashBoard;