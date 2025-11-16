// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// // Importaciones de Servicios y Redux Auth
// import { getLoginStatus, getUser } from "./services/Services";
// import { SET_LOGIN, SET_USER, selectUserId } from "../src/features/auth/authSlice/authSlice";

// // Importaciones de Componentes y Páginas
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

// // Importaciones de Toast y Firebase
// import { ToastContainer } from "react-toastify";
// import { db } from "./firebaseConfig";
// import { collection, getDocs, query, where } from "firebase/firestore";

// // Importaciones de Producción
// import ProduccionPage from './ProduccionPimientos/ProduccionPage' 
// import Tarea from "./components/Carga/Tarea";
// import HoraTrabajador from "./components/HoraTrabajadores/HoraTrabajador";
// import ProductivityAnalyzer from "./Pages/ProductividadTrabajador/ProductivityAnalyzer";
// import HomeContent from "./components/HomeContent.js/HomeContent";


// axios.defaults.withCredentials = true;

// export const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// // Componente para evitar la repetición de SideBar y Layout
// const ProtectedLayout = ({ children }) => (
//   <SideBar>
//     <Layout>{children}</Layout>
//   </SideBar>
// );

// function App() {
//   const dispatch = useDispatch();
  
//   // LEER EL ID DE USUARIO
//   const userId = useSelector(selectUserId); 

//   // 1. Estados de la Aplicación
//   const [isAuthReady, setIsAuthReady] = useState(false); 
//   // 'dailyData' ahora solo contendrá la data de Riego/Colección 'produccion_diaria'
//   const [dailyData, setDailyData] = useState({}); 

//   // 2. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (Solo para RIEGO/Colección 'produccion_diaria')
//   const fetchAllData = async (uid) => {
//     if (!uid) {
//         setDailyData({}); 
//         return; 
//     }
    
//     try {
//         const recordsCollectionRef = collection(db, "produccion_diaria");
//         const q = query(recordsCollectionRef, where("userId", "==", uid));
        
//         const querySnapshot = await getDocs(q); 
//         const dataByDate = {};

//         querySnapshot.docs.forEach((doc) => {
//             const data = doc.data();
//             const record = { ...data, id: doc.id, M2: parseFloat(data.M2 || 0) };
//             const dateKey = data.date;
            
//             if (!dataByDate[dateKey]) {
//                 dataByDate[dateKey] = [];
//             }
//             dataByDate[dateKey].push(record);
//         });

//         setDailyData(dataByDate);

//     } catch (error) {
//         console.error("Error al cargar datos filtrados del calendario de Riego:", error);
//     }
//   };


//   // Función para forzar la actualización de datos de RIEGO (usada por DayDetails)
//   const refetchData = () => {
//     fetchAllData(userId);
//   };

//   // 3. HOOK 1: Carga de Autenticación (Backend/Redux)
//   useEffect(() => {
//     async function loadAuth() {
//       try {
//         let status = await getLoginStatus();
//         dispatch(SET_LOGIN(status));

//         if (status) {
//           const userData = await getUser();
//           dispatch(SET_USER(userData));
//         }
//       } catch (error) {
//         console.error("Error crítico en la carga de AUTH:", error);
//         dispatch(SET_LOGIN(false));
//       } finally {
//         setIsAuthReady(true);
//       }
//     }
//     loadAuth();
//   }, [dispatch]);

//   // 4. HOOK 2: Carga de Datos de Firebase (RIEGO)
//   useEffect(() => {
//     if (isAuthReady && userId) {
//         fetchAllData(userId); 
//     } else if (isAuthReady && !userId) {
//         setDailyData({});
//     }
//   }, [isAuthReady, userId]); 

//   // 5. PANTALLA DE CARGA GLOBAL
//   if (!isAuthReady) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader />
//       </div>
//     );
//   }

//   // 6. RENDERIZADO FINAL
//   return (
//     <BrowserRouter>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         theme="colored"
//       />
      
//       <Routes>
//         {/* RUTAS PÚBLICAS */}
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot" element={<Forgot />} />
//         <Route path="/reset" element={<Reset />} />
//         <Route path="/unauthorized" element={<UnauthorizedPage />} />

//         {/* --- RUTAS PROTEGIDAS POR ROL --- */}

//         {/* DashBoard */}
//           <Route
//             path="/panel"
//             element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><DashBoard /></ProtectedLayout></RoleRoute>}
//           />
//           {/* Productos */}
//           <Route
//             path="/product-detail/:id"
//             element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><ProductDetails /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/add-product"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AddProduct /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/edit-product/:id"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProduct /></ProtectedLayout></RoleRoute>}
//           />

//           {/* Perfil */}
//           <Route
//             path="/profile"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profile /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/profiles"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profiles /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/edit-profile"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProfile /></ProtectedLayout></RoleRoute>}
//           />

//           {/* Producción */}
//           <Route
//             path="/produccionC"
//             element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><ProduccionC /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/acumuladoC"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AcumuladoC /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/analizer"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><ProductivityAnalyzer /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/homeCard"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><HomeContent /></ProtectedLayout></RoleRoute>}
//           />

//           {/* Tareas / Horas */}
//           <Route
//             path="/tarea"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Tarea /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/trabajador"
//             element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><HoraTrabajador /></ProtectedLayout></RoleRoute>}
//           />

//           {/* Administración de Usuarios (Admin) */}
//           <Route
//             path="/user-management"
//             element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
//           />
//           <Route
//             path="/user-master"
//             element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
//           />

//           {/* Contacto */}
//           <Route
//             path="/contact-us"
//             element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><Contact /></ProtectedLayout></RoleRoute>}
//           />

//         {/* 1. RUTAS DEL CALENDARIO DE RIEGO (Data manejada en App.js) */}
//         <Route
//           path="/riego"
//           element={
//             <RoleRoute allowedRoles={["admin", "usuario"]}>
//               <ProtectedLayout>
//                 <Calendar dailyData={dailyData} />
//               </ProtectedLayout>
//             </RoleRoute>
//           }
//         />
//         <Route
//           path="/day/:date"
//           element={
//             <RoleRoute allowedRoles={["admin", "usuario"]}>
//               <ProtectedLayout>
//                 <DayDetails refetchCalendar={refetchData} />
//               </ProtectedLayout>
//             </RoleRoute>
//           }
//         />

//         {/* 2. RUTAS DEL CALENDARIO DE PRODUCCIÓN (Data manejada en ProduccionPage.jsx) */}
//         <Route
//           path="/produccion/*"
//           element={
//             <RoleRoute allowedRoles={["admin", "usuario"]}>
//               <ProtectedLayout>
//                 {/* Montamos el contenedor que maneja toda la lógica de Producción */}
//                 <ProduccionPage /> 
//               </ProtectedLayout>
//             </RoleRoute>
//           }
//         />

//         {/* Ruta comodín para manejar rutas no encontradas (opcional) */}
//         {/* <Route path="*" element={<NotFoundPage />} /> */}
        
//       </Routes>
      
//       {/* 🚨 ELIMINADO: Se ha eliminado el segundo bloque <Routes> vacío */}

//     </BrowserRouter>
//   );
// }

// export default App;











// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";

// // 🛑 ELIMINAR ESTAS IMPORTACIONES AL MIGRAR:
// // import { getLoginStatus, getUser } from "./services/Services"; 
// // 🛑 ELIMINAR ESTA IMPORTACIÓN:
// // import AuthObserver from "../src/Pages/Migration/AuthObserver"; 

// // Importaciones de Redux Auth
// import { SET_LOGIN, SET_USER, SET_NAME, selectUserId } from "../src/features/auth/authSlice/authSlice";

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
    
//     // LEER EL ID DE USUARIO
//     const userId = useSelector(selectUserId); 

//     // 1. Estados de la Aplicación
//     // isAuthReady ahora es controlado por el useEffect de Firebase
//     const [isAuthReady, setIsAuthReady] = useState(false); 
//     const [dailyData, setDailyData] = useState({}); 

//     // 2. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (RIEGO) - Mantenida igual que tu versión anterior
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

//         } catch (error) {
//             console.error("Error al cargar datos filtrados del calendario de Riego:", error);
//         }
//     };


//     // Función para forzar la actualización de datos de RIEGO (usada por DayDetails)
//     const refetchData = () => {
//         fetchAllData(userId);
//     };

//     // 🌟 3. HOOK 1: INICIALIZACIÓN DE AUTENTICACIÓN CON FIREBASE 
//     // Esto reemplaza tu HOOK de Backend (punto 3) y el componente AuthObserver.
//     useEffect(() => {
//         // La función de limpieza se encarga de detener el observador
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             try {
//                 if (user) {
//                     // Usuario logueado: Leer datos y rol de Firestore
//                     const userDocRef = doc(db, "users", user.uid);
//                     const userDoc = await getDoc(userDocRef);

//                     let userData = {
//                         email: user.email,
//                         uid: user.uid,
//                         // Usamos displayName de Auth o el nombre de Firestore
//                         name: user.displayName || userDoc.data()?.name || "Invitado", 
//                         role: userDoc.data()?.role || "usuario", // Leer el rol
//                     };
                    
//                     // Actualizar el estado de Redux
//                     dispatch(SET_LOGIN(true));
//                     dispatch(SET_USER(userData));
//                     dispatch(SET_NAME(userData.name));

//                 } else {
//                     // Usuario desconectado
//                     dispatch(SET_LOGIN(false));
//                     dispatch(SET_USER({}));
//                     dispatch(SET_NAME("")); 
//                 }
//             } catch (error) {
//                 console.error("Error al cargar datos del usuario de Firestore:", error);
//             } finally {
//                 // 🚨 ESTE ES EL PUNTO CLAVE: Señalar que la inicialización terminó.
//                 setIsAuthReady(true);
//             }
//         });

//         // Limpiar el listener cuando el componente se desmonte
//         return () => unsubscribe();
//     }, [dispatch]);

//     // 4. HOOK 2: Carga de Datos de Firebase (RIEGO)
//     // Se mantiene igual, ya que solo se ejecuta cuando isAuthReady es TRUE y userId tiene valor.
//     useEffect(() => {
//         if (isAuthReady && userId) {
//             fetchAllData(userId); 
//         } else if (isAuthReady && !userId) {
//             setDailyData({});
//         }
//     }, [isAuthReady, userId]); 

//     // 5. PANTALLA DE CARGA GLOBAL
//     if (!isAuthReady) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <Loader />
//             </div>
//         );
//     }

//     // 6. RENDERIZADO FINAL
//     return (
//         <BrowserRouter>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 pauseOnHover
//                 theme="colored"
//             />
            
//             <Routes>
//                 {/* RUTAS PÚBLICAS */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/forgot" element={<Forgot />} />
//                 <Route path="/reset" element={<Reset />} />
//                 <Route path="/unauthorized" element={<UnauthorizedPage />} />

//                 {/* --- RUTAS PROTEGIDAS POR ROL (Utiliza los roles de tu versión anterior) --- */}

//                 {/* DashBoard */}
//                 <Route
//                     path="/panel"
//                     element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><DashBoard /></ProtectedLayout></RoleRoute>}
//                 />
//                 {/* Productos */}
//                 <Route
//                     path="/product-detail/:id"
//                     element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><ProductDetails /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/add-product"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AddProduct /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/edit-product/:id"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProduct /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* Perfil */}
//                 <Route
//                     path="/profile"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profile /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/profiles"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profiles /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/edit-profile"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProfile /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* Producción */}
//                 <Route
//                     path="/produccionC"
//                     element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><ProduccionC /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/acumuladoC"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AcumuladoC /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/analizer"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><ProductivityAnalyzer /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/homeCard"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><HomeContent /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* Tareas / Horas */}
//                 <Route
//                     path="/tarea"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Tarea /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/trabajador"
//                     element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><HoraTrabajador /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* Administración de Usuarios (Admin) */}
//                 <Route
//                     path="/user-management"
//                     element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
//                 />
//                 <Route
//                     path="/user-master"
//                     element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* Contacto */}
//                 <Route
//                     path="/contact-us"
//                     element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><Contact /></ProtectedLayout></RoleRoute>}
//                 />

//                 {/* RUTAS DEL CALENDARIO DE RIEGO */}
//                 <Route
//                     path="/riego"
//                     element={
//                         <RoleRoute allowedRoles={["admin", "usuario"]}>
//                             <ProtectedLayout>
//                                 <Calendar dailyData={dailyData} />
//                             </ProtectedLayout>
//                         </RoleRoute>
//                     }
//                 />
//                 <Route
//                     path="/day/:date"
//                     element={
//                         <RoleRoute allowedRoles={["admin", "usuario"]}>
//                             <ProtectedLayout>
//                                 <DayDetails refetchCalendar={refetchData} />
//                             </ProtectedLayout>
//                         </RoleRoute>
//                     }
//                 />

//                 {/* RUTAS DEL CALENDARIO DE PRODUCCIÓN */}
//                 <Route
//                     path="/produccion/*"
//                     element={
//                         <RoleRoute allowedRoles={["admin", "usuario"]}>
//                             <ProtectedLayout>
//                                 <ProduccionPage /> 
//                             </ProtectedLayout>
//                         </RoleRoute>
//                     }
//                 />
                
//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App;








import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// Importaciones de Redux Auth
import { SET_LOGIN, SET_USER, SET_NAME, selectUserId } from "../src/features/auth/authSlice/authSlice";

// Importaciones de Firebase Auth y Firestore
import { auth, db } from "../src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

// Importaciones de Componentes y Páginas (las mantenemos)
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

// Importaciones de Layout y Utilidades
import SideBar from "./components/SideBar/SideBar";
import Layout from "./components/Layout/Layout";
import RoleRoute from "./components/RoleRoute";
import UnauthorizedPage from "./components/UnauthorizedPage";
import Loader from "./Util/Loader";
import { ToastContainer } from "react-toastify";

// Importaciones de Producción
import ProduccionPage from './ProduccionPimientos/ProduccionPage' 
import Tarea from "./components/Carga/Tarea";
import HoraTrabajador from "./components/HoraTrabajadores/HoraTrabajador";
import ProductivityAnalyzer from "./Pages/ProductividadTrabajador/ProductivityAnalyzer";
import HomeContent from "./components/HomeContent.js/HomeContent";


axios.defaults.withCredentials = true;

export const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// Componente para evitar la repetición de SideBar y Layout
const ProtectedLayout = ({ children }) => (
    <SideBar>
        <Layout>{children}</Layout>
    </SideBar>
);

// Lista de roles permitidos (para acceso universal temporal)
const ALL_ROLES = ["admin", "usuario", "subscriber", "invitado"];

function App() {
    const dispatch = useDispatch();
    
    // LEER EL ID DE USUARIO
    const userId = useSelector(selectUserId); 

    // 1. Estados de la Aplicación
    const [isAuthReady, setIsAuthReady] = useState(false); 
    const [dailyData, setDailyData] = useState({}); 

    // 2. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (RIEGO) 
    const fetchAllData = async (uid) => {
        if (!uid) {
            setDailyData({}); 
            return; 
        }
        
        try {
            const recordsCollectionRef = collection(db, "produccion_diaria");
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
            console.error("Error al cargar datos filtrados del calendario de Riego:", error);
        }
    };


    // Función para forzar la actualización de datos de RIEGO (usada por DayDetails)
    const refetchData = () => {
        fetchAllData(userId);
    };

    // 3. HOOK 1: INICIALIZACIÓN DE AUTENTICACIÓN CON FIREBASE 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    let userData = {
                        email: user.email,
                        uid: user.uid,
                        name: user.displayName || userDoc.data()?.name || "Invitado", 
                        role: userDoc.data()?.role || "usuario", 
                    };
                    
                    dispatch(SET_LOGIN(true));
                    dispatch(SET_USER(userData));
                    dispatch(SET_NAME(userData.name));

                } else {
                    dispatch(SET_LOGIN(false));
                    dispatch(SET_USER({}));
                    dispatch(SET_NAME("")); 
                }
            } catch (error) {
                console.error("Error al cargar datos del usuario de Firestore:", error);
            } finally {
                setIsAuthReady(true);
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    // 4. HOOK 2: Carga de Datos de Firebase (RIEGO)
    useEffect(() => {
        if (isAuthReady && userId) {
            fetchAllData(userId); 
        } else if (isAuthReady && !userId) {
            setDailyData({});
        }
    }, [isAuthReady, userId]); 

    // 5. PANTALLA DE CARGA GLOBAL
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    // 6. RENDERIZADO FINAL
    return (
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

                {/* --- RUTAS PROTEGIDAS POR ROL (TODAS USAN ALL_ROLES) --- */}

                {/* DashBoard */}
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

                {/* Producción */}
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
                    element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
                />
                <Route
                    path="/user-master"
                    element={<RoleRoute allowedRoles={ALL_ROLES}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
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
                                <DayDetails refetchCalendar={refetchData} />
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
    );
}

export default App;