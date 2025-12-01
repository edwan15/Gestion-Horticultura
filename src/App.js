// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";

// // 👑 1. IMPORTACIÓN DEL CONTEXTO DE ADMINISTRADOR
// import { AppProvider } from "./components/SuperUser/AppContext"; 

// // Importaciones de Redux Auth
// import { SET_LOGIN, SET_USER, SET_NAME, selectUserId, selectUser } from "../src/features/auth/authSlice/authSlice";

// // Importaciones de Firebase Auth y Firestore
// import { auth, db } from "../src/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// // Importaciones de Componentes y Páginas (las mantenemos)
// import Home from "./Pages/Home/Home";
// import Register from "./Pages/Auth/Register";
// import Login from "./Pages/Auth/Login";
// import Forgot from "./Pages/Auth/Forgot";
// import Reset from "./Pages/Auth/Reset";
// import DashBoard from "./Pages/DashBoard/DashBoard";
// import AddProduct from "./Pages/addProduct/AddProduct";
// import EditProduct from "./Pages/editProduct/EditProduct";
// import ProductDetails from "./components/product/product+/ProductDetails";
// import Profile from "./Pages/Profile/Profile";
// import EditProfile from "./Pages/EditProfile/EditProfile";
// import ProduccionC from "./Pages/produccionC/produccionC";
// import AcumuladoC from "./Pages/acumuladoC/acumuladoC";
// import Contact from "./Pages/contact/Contact";
// import UserManagement from "./Pages/UserManagement/UserManagement";
// import Profiles from "./Pages/Profile/profiles";
// import UserProfe from "./Pages/UserManagement/UserProfel";
// import Calendar from "./components/RiegoInvernadero/Calendar";
// import DayDetails from "./components/RiegoInvernadero/DayDetails";

// // Importaciones de Layout y Utilidades
// import SideBar from "./components/SideBar/SideBar";
// import Layout from "./components/Layout/Layout";
// import RoleRoute from "./components/RoleRoute";
// import UnauthorizedPage from "./components/UnauthorizedPage";
// import Loader from "./Util/Loader";
// import { ToastContainer } from "react-toastify";

// // Importaciones de Producción
// import ProduccionPage from './ProduccionPimientos/ProduccionPage' 
// import Tarea from "./components/Carga/Tarea";
// import HoraTrabajador from "./components/HoraTrabajadores/HoraTrabajador";
// import ProductivityAnalyzer from "./Pages/ProductividadTrabajador/ProductivityAnalyzer";
// import HomeContent from "./components/HomeContent.js/HomeContent";
// import RendimientoHistoricoV10 from "./Pages/ProductividadTrabajador/Analizer";
// import OrdenFumigacionSimulador from "./components/product/product+/Fumigacion/OrdenFumigacionSimulador";


// axios.defaults.withCredentials = true;

// export const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// // Componente para evitar la repetición de SideBar y Layout
// const ProtectedLayout = ({ children }) => (
//     <SideBar>
//         <Layout>{children}</Layout>
//     </SideBar>
// );

// // Lista de roles permitidos
// const ALL_ROLES = ["admin", "usuario", "subscriber", "invitado"];

// function App() {
//     const dispatch = useDispatch();
    
//     // 2. OBTENER INFORMACIÓN CLAVE DEL USUARIO DESDE REDUX
//     const currentUserRedux = useSelector(selectUser); // Objeto completo del usuario (con campo 'role')
//     const userId = useSelector(selectUserId); 

//     // 3. Estados de la Aplicación
//     const [isAuthReady, setIsAuthReady] = useState(false); 
//     const [dailyData, setDailyData] = useState({}); 

//     // 4. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (RIEGO) 
//     const fetchAllData = async (uid) => {
//         if (!uid) {
//             setDailyData({}); 
//             return; 
//         }
        
//         try {
//             const recordsCollectionRef = collection(db, "produccion_diaria");
//             const q = query(recordsCollectionRef, where("userId", "==", uid));
            
//             const querySnapshot = await getDocs(q); 
//             const dataByDate = {};

//             querySnapshot.docs.forEach((doc) => {
//                 const data = doc.data();
//                 const record = { ...data, id: doc.id, M2: parseFloat(data.M2 || 0) };
//                 const dateKey = data.date; 
                
//                 if (!dataByDate[dateKey]) {
//                     dataByDate[dateKey] = [];
//                 }
//                 dataByDate[dateKey].push(record);
//             });

//             setDailyData(dataByDate);
//         } else if (isAuthReady && !userId) {
//             setDailyData({});
//         }
//     }, [isAuthReady, userId]); 

//     // 7. PANTALLA DE CARGA GLOBAL
//     if (!isAuthReady) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <Loader />
//             </div>
//         );
//     }

//     // 8. RENDERIZADO FINAL CON PROVIDER
//     const isUserAdmin = currentUserRedux?.role === 'admin';

//     return (
//         // 👑 ENVOLVEMOS TODA LA APLICACIÓN CON EL AppProvider
//         <AppProvider initialUser={currentUserRedux} isAdmin={isUserAdmin}>
//             <BrowserRouter>
//                 <ToastContainer
//                     position="top-right"
//                     autoClose={3000}
//                     hideProgressBar={false}
//                     newestOnTop={false}
//                     closeOnClick
//                     pauseOnHover
//                     theme="colored"
//                 />
                
//                 <Routes>
//                     {/* RUTAS PÚBLICAS */}
//                     <Route path="/" element={<Home />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/forgot" element={<Forgot />} />
//                     <Route path="/reset" element={<Reset />} />
//                     <Route path="/unauthorized" element={<UnauthorizedPage />} />

//                     {/* --- RUTAS PROTEGIDAS POR ROL (TODAS USAN ProtectedLayout) --- */}

//                     {/* DashBoard */}
//                     <Route
//                         path="/panel"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><DashBoard /></ProtectedLayout></RoleRoute>}
//                     />
//                     {/* Productos */}
//                     <Route
//                         path="/product-detail/:id"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProductDetails /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/add-product"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><AddProduct /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/order-product"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><OrdenFumigacionSimulador /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/edit-product/:id"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><EditProduct /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* Perfil */}
//                     <Route
//                         path="/profile"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Profile /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/profiles"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Profiles /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/edit-profile"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><EditProfile /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* Producción */}
//                     <Route
//                         path="/produccionC"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProduccionC /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/acumuladoC"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><AcumuladoC /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/analizer"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProductivityAnalyzer /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/analizer-work"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><RendimientoHistoricoV10 /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/homeCard"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><HomeContent /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* Tareas / Horas */}
//                     <Route
//                         path="/tarea"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Tarea /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/trabajador"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><HoraTrabajador /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* Administración de Usuarios (Admin) */}
//                     <Route
//                         path="/user-management"
//                         element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
//                     />
//                     <Route
//                         path="/user-master"
//                         element={<RoleRoute allowedRoles={"admin"}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* Contacto */}
//                     <Route
//                         path="/contact-us"
//                         element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Contact /></ProtectedLayout></RoleRoute>}
//                     />

//                     {/* RUTAS DEL CALENDARIO DE RIEGO */}
//                     <Route
//                         path="/riego"
//                         element={
//                             <RoleRoute allowedRoles={ALL_ROLES}>
//                                 <ProtectedLayout>
//                                     <Calendar dailyData={dailyData} />
//                                 </ProtectedLayout>
//                             </RoleRoute>
//                         }
//                     />
//                     <Route
//                         path="/day/:date"
//                         element={
//                             <RoleRoute allowedRoles={ALL_ROLES}>
//                                 <ProtectedLayout>
//                                     <DayDetails refetchCalendar={refetchData} />
//                                 </ProtectedLayout>
//                             </RoleRoute>
//                         }
//                     />

//                     {/* RUTAS DEL CALENDARIO DE PRODUCCIÓN */}
//                     <Route
//                         path="/produccion/*"
//                         element={
//                             <RoleRoute allowedRoles={ALL_ROLES}>
//                                 <ProtectedLayout>
//                                     <ProduccionPage /> 
//                                 </ProtectedLayout>
//                             </RoleRoute>
//                         }
//                     />
                    
//                 </Routes>
//             </BrowserRouter>
//         </AppProvider> // 👈 CIERRE DEL PROVIDER
//     );
// }

// export default App;


import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// Firebase Auth y Firestore
import { auth, db } from "../src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// Redux Auth
import { SET_LOGIN, SET_USER, SET_NAME, selectUserId, selectUser } from "../src/features/auth/authSlice/authSlice";

// Contexto de Administrador
import { AppProvider } from "./components/SuperUser/AppContext"; 

// Componentes, Layout y Utilidades
import Home from "./Pages/Home/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Forgot from "./Pages/Auth/Forgot";
import Reset from "./Pages/Auth/Reset";
import DashBoard from "./Pages/DashBoard/DashBoard";
import AddProduct from "./Pages/addProduct/AddProduct";
import EditProduct from "./Pages/editProduct/EditProduct";
import ProductDetails from "./components/product/product+/ProductDetails";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import ProduccionC from "./Pages/produccionC/produccionC";
import AcumuladoC from "./Pages/acumuladoC/acumuladoC";
import Contact from "./Pages/contact/Contact";
import UserManagement from "./Pages/UserManagement/UserManagement";
import Profiles from "./Pages/Profile/profiles";
import UserProfe from "./Pages/UserManagement/UserProfel";
import Calendar from "./components/RiegoInvernadero/Calendar";
import DayDetails from "./components/RiegoInvernadero/DayDetails";
import SideBar from "./components/SideBar/SideBar";
import Layout from "./components/Layout/Layout";
import RoleRoute from "./components/RoleRoute";
import UnauthorizedPage from "./components/UnauthorizedPage";
import Loader from "./Util/Loader";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Componentes de Producción
import ProduccionPage from './ProduccionPimientos/ProduccionPage' 
import Tarea from "./components/Carga/Tarea";
import HoraTrabajador from "./components/HoraTrabajadores/HoraTrabajador";
import ProductivityAnalyzer from "./Pages/ProductividadTrabajador/ProductivityAnalyzer";
import HomeContent from "./components/HomeContent.js/HomeContent";
import RendimientoHistoricoV10 from "./Pages/ProductividadTrabajador/Analizer";
import OrdenFumigacionSimulador from "./components/product/product+/Fumigacion/OrdenFumigacionSimulador";


axios.defaults.withCredentials = true;

export const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// Componente para evitar la repetición de SideBar y Layout (usa Tailwind)
const ProtectedLayout = ({ children }) => (
    <div className="flex">
        <SideBar />
        <div className="flex-1">
            <Layout>{children}</Layout>
        </div>
    </div>
);

// Lista de roles permitidos
const ALL_ROLES = ["admin", "usuario", "subscriber", "invitado"];

function App() {
    const dispatch = useDispatch();
    
    // 2. OBTENER INFORMACIÓN CLAVE DEL USUARIO DESDE REDUX
    const currentUserRedux = useSelector(selectUser);
    const userId = useSelector(selectUserId); 

    // 3. Estados de la Aplicación
    const [isAuthReady, setIsAuthReady] = useState(false); 
    const [dailyData, setDailyData] = useState({}); 

    // 4. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (RIEGO) 
    // Usamos useCallback para que esta función no se recree innecesariamente
    const fetchAllData = useCallback(async (uid) => {
        if (!uid) {
            setDailyData({}); 
            return; 
        }
        
        try {
            const recordsCollectionRef = collection(db, "produccion_diaria");
            // Filtramos los datos para el usuario logueado (uid)
            const q = query(recordsCollectionRef, where("userId", "==", uid));
            
            const querySnapshot = await getDocs(q); 
            const dataByDate = {};

            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                const record = { ...data, id: doc.id, M2: parseFloat(data.M2 || 0) };
                const dateKey = data.date; 
                
                if (!dataByDate[dateKey]) {
                    dataByDate[dateKey] = [];
                }
                dataByDate[dateKey].push(record);
            });

            setDailyData(dataByDate);
        } catch (error) {
            console.error("Error al cargar datos filtrados:", error);
            // Mostrar error al usuario
        }
    }, []); 

    // 5. HOOK 1: INICIALIZACIÓN DE AUTENTICACIÓN CON FIREBASE
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    dispatch(SET_LOGIN(true));
                    dispatch(SET_USER({ uid: user.uid, email: user.email, ...userData }));
                    dispatch(SET_NAME(user.displayName || userData.name || "Usuario"));
                } else {
                    dispatch(SET_LOGIN(true)); 
                    dispatch(SET_USER({ uid: user.uid, email: user.email, role: 'usuario' }));
                    dispatch(SET_NAME(user.displayName || "Usuario"));
                }
            } else {
                dispatch(SET_LOGIN(false));
                dispatch(SET_USER({}));
                dispatch(SET_NAME(""));
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, [dispatch]);

    // 6. HOOK 2: CARGA DE DATOS DESPUÉS DE LA AUTENTICACIÓN
    useEffect(() => {
        if (isAuthReady && currentUserRedux?.uid) {
            fetchAllData(currentUserRedux.uid);
        } else if (isAuthReady && !currentUserRedux?.uid) {
             setDailyData({});
        }
    }, [isAuthReady, currentUserRedux?.uid, fetchAllData]);

    // 7. FUNCIÓN PARA REFRESCO DE DATOS
    const refetchData = useCallback(() => {
        if (currentUserRedux?.uid) {
            fetchAllData(currentUserRedux.uid);
        }
    }, [currentUserRedux?.uid, fetchAllData]);
    

    // 8. PANTALLA DE CARGA GLOBAL
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    // 9. RENDERIZADO FINAL CON PROVIDER
    const isUserAdmin = currentUserRedux?.role === 'admin';

    return (
        // 👑 ENVOLVEMOS TODA LA APLICACIÓN CON EL AppProvider
        <AppProvider initialUser={currentUserRedux} isAdmin={isUserAdmin}>
            <BrowserRouter>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    theme="colored"
                />
                
                <Routes>
                    {/* RUTAS PÚBLICAS */}
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/reset" element={<Reset />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* --- RUTAS PROTEGIDAS POR ROL (TODAS USAN ProtectedLayout) --- */}

                    {/* Dashboard */}
                    <Route
                        path="/panel"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><DashBoard /></ProtectedLayout></RoleRoute>}
                    />
                    
                    {/* Productos */}
                    <Route
                        path="/product-detail/:id"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProductDetails /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/add-product"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><AddProduct /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/order-product"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><OrdenFumigacionSimulador /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/edit-product/:id"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><EditProduct /></ProtectedLayout></RoleRoute>}
                    />

                    {/* Perfil */}
                    <Route
                        path="/profile"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Profile /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/profiles"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Profiles /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/edit-profile"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><EditProfile /></ProtectedLayout></RoleRoute>}
                    />

                    {/* Producción y Productividad */}
                    <Route
                        path="/produccionC"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProduccionC /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/acumuladoC"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><AcumuladoC /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/analizer"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><ProductivityAnalyzer /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/analizer-work"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><RendimientoHistoricoV10 /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/homeCard"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><HomeContent /></ProtectedLayout></RoleRoute>}
                    />

                    {/* Tareas / Horas */}
                    <Route
                        path="/tarea"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Tarea /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/trabajador"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><HoraTrabajador /></ProtectedLayout></RoleRoute>}
                    />

                    {/* Administración de Usuarios (Admin) */}
                    <Route
                        path="/user-management"
                        element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
                    />
                    <Route
                        path="/user-master"
                        element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
                    />

                    {/* Contacto */}
                    <Route
                        path="/contact-us"
                        element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><Contact /></ProtectedLayout></RoleRoute>}
                    />

                    {/* RUTAS DEL CALENDARIO DE RIEGO */}
                    <Route
                        path="/riego"
                        element={
                            <RoleRoute allowedRoles={ALL_ROLES}>
                                <ProtectedLayout>
                                    <Calendar dailyData={dailyData} />
                                </ProtectedLayout>
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/day/:date"
                        element={
                            <RoleRoute allowedRoles={ALL_ROLES}>
                                <ProtectedLayout>
                                    <DayDetails dailyData={dailyData} refetchData={refetchData} />
                                </ProtectedLayout>
                            </RoleRoute>
                        }
                    />

                    {/* RUTAS DEL CALENDARIO DE PRODUCCIÓN */}
                    <Route
                        path="/produccion/*"
                        element={
                            <RoleRoute allowedRoles={ALL_ROLES}>
                                <ProtectedLayout>
                                    <ProduccionPage /> 
                                </ProtectedLayout>
                            </RoleRoute>
                        }
                    />
                    
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;