import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// Importaciones de Servicios y Redux Auth
import { getLoginStatus, getUser } from "./services/Services";
import { SET_LOGIN, SET_USER, selectUserId } from "../src/features/auth/authSlice/authSlice";

// Importaciones de Componentes y Páginas
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

// Importaciones de Toast y Firebase
import { ToastContainer } from "react-toastify";
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// 🚨 IMPORTACIÓN CLAVE: Solo importamos el contenedor de datos de Producción
import ProduccionPage from './ProduccionPimientos/ProduccionPage' 
import Tarea from "./components/Carga/Tarea";
import HoraTrabajador from "./components/HoraTrabajadores/HoraTrabajador";
// 🚨 Nota: Eliminé las importaciones erróneas de ProduccionCalendar, DayDetails y fetchCosechaData


axios.defaults.withCredentials = true;

export const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

// Componente para evitar la repetición de SideBar y Layout
const ProtectedLayout = ({ children }) => (
  <SideBar>
    <Layout>{children}</Layout>
  </SideBar>
);

function App() {
  const dispatch = useDispatch();
  
  // LEER EL ID DE USUARIO
  const userId = useSelector(selectUserId); 

  // 1. Estados de la Aplicación
  const [isAuthReady, setIsAuthReady] = useState(false); 
  // 'dailyData' ahora solo contendrá la data de Riego/Colección 'produccion_diaria'
  const [dailyData, setDailyData] = useState({}); 

  // 2. FUNCIÓN DE CARGA DE DATOS DE FIREBASE (Solo para RIEGO/Colección 'produccion_diaria')
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

  // 3. HOOK 1: Carga de Autenticación (Backend/Redux)
  useEffect(() => {
    async function loadAuth() {
      try {
        let status = await getLoginStatus();
        dispatch(SET_LOGIN(status));

        if (status) {
          const userData = await getUser();
          dispatch(SET_USER(userData));
        }
      } catch (error) {
        console.error("Error crítico en la carga de AUTH:", error);
        dispatch(SET_LOGIN(false));
      } finally {
        setIsAuthReady(true);
      }
    }
    loadAuth();
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

        {/* --- RUTAS PROTEGIDAS POR ROL --- */}

        {/* ... (Rutas de Panel, Producto, Contacto, Perfil, etc.) ... */}
         <Route
            path="/panel"
            element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><DashBoard /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/product-detail/:id"
            element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><ProductDetails /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/contact-us"
            element={<RoleRoute allowedRoles={["admin", "usuario", "invitado"]}><ProtectedLayout><Contact /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/add-product"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AddProduct /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/edit-product/:id"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProduct /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/profile"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profile /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/profiles"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Profiles /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/edit-profile"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><EditProfile /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/produccionC"
            element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><ProduccionC /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/acumuladoC"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><AcumuladoC /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/tarea"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><Tarea /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/trabajador"
            element={<RoleRoute allowedRoles={["admin", "usuario"]}><ProtectedLayout><HoraTrabajador /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/user-management"
            element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserManagement /></ProtectedLayout></RoleRoute>}
         />
         <Route
            path="/user-master"
            element={<RoleRoute allowedRoles={["admin"]}><ProtectedLayout><UserProfe /></ProtectedLayout></RoleRoute>}
         />

        {/* 1. RUTAS DEL CALENDARIO DE RIEGO (Data manejada en App.js) */}
        <Route
          path="/riego"
          element={
            <RoleRoute allowedRoles={["admin", "usuario"]}>
              <ProtectedLayout>
                <Calendar dailyData={dailyData} />
              </ProtectedLayout>
            </RoleRoute>
          }
        />
        <Route
          path="/day/:date"
          element={
            <RoleRoute allowedRoles={["admin", "usuario"]}>
              <ProtectedLayout>
                <DayDetails refetchCalendar={refetchData} />
              </ProtectedLayout>
            </RoleRoute>
          }
        />

        {/* 2. 🚨 RUTAS DEL CALENDARIO DE PRODUCCIÓN (Data manejada en ProduccionPage.jsx) */}

        <Route
          path="/produccion/*"
          element={
            <RoleRoute allowedRoles={["admin", "usuario"]}>
              <ProtectedLayout>
                {/* Montamos el contenedor que maneja toda la lógica de Producción */}
                <ProduccionPage /> 
              </ProtectedLayout>
            </RoleRoute>
          }
        />
{/* 
        <Route
          path="/produccion-day/:date"
          element={
            <RoleRoute allowedRoles={["admin", "usuario"]}>
              <ProtectedLayout>
                <ProduccionDayDetails/>
                <ProduccionPage /> 
              </ProtectedLayout>
            </RoleRoute>
          }
        /> */}

      </Routes>

      <Routes>


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;