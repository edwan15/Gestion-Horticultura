
// // export default HomeContent;
// import React, { useState, useEffect } from 'react'; 
// import { FaEuroSign, FaHome } from 'react-icons/fa';
// import { BsDropletFill } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth'; 

// // 🚨 IMPORTACIÓN CRUCIAL:
// // Asegúrate de que esta ruta sea correcta para tu proyecto (ej. './firebaseConfig' o '../firebaseConfig')
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';


// // --- Custom Hook para gestionar el Usuario Autenticado ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         // Suscripción al estado de autenticación de Firebase
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         // La instancia 'db' (Firestore) ya la tenemos por la importación directa.
        
//         return () => unsubscribe(); // Limpiar la suscripción
//     }, []); 

//     // Devolvemos la instancia de la DB y el ID del usuario
//     return { db, userId, loadingAuth };
// };


// // --- Componente Auxiliar para las Tarjetas de Resumen (Mantengo la estructura) ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de la Vista Inicial (Dashboard) (Utiliza props recibidas de HomeContent) ---
// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
// }) => {
    
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     // Cálculo de la producción total
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const summaryData = [
//         { 
//             title: `${currentCropName} Cosechado`, 
//             value: totalProduction.toFixed(1), 
//             unit: "Kg", 
//             icon: <FaSeedling />, 
//             color: "border-green-500" 
//         },
//         { 
//             title: "Área Total", 
//             value: config.plantedArea || "0.0", 
//             unit: config.plantedAreaUnit || "ha", 
//             icon: <FaRulerCombined />, 
//             color: "border-blue-500" 
//         },
//         { 
//             title: "Riego Programado", 
//             value: config.scheduledIrrigationTime || "0", 
//             unit: "horas", 
//             icon: <BsDropletFill />, 
//             color: "border-cyan-500" 
//         },
//         { 
//             title: "Cargas Pendientes", 
//             value: config.pendingLoads || "0", 
//             unit: "pendientes", 
//             icon: <FaTruckLoading />, 
//             color: "border-orange-500" 
//         },
//     ];

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (DINÁMICO) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CONEXIÓN Y AUTH INTEGRADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 💥 OBTENER DB, USERID y estado de carga del Hook
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('costs'); 
//     const [errorMessage, setErrorMessage] = useState(null);
    

//     // Destructurar las props restantes
//     const { ...restOfProps } = props;


//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             <button
//                 onClick={() => { setActiveView('home'); setErrorMessage(null); }} // Limpiar error al cambiar
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setErrorMessage(null); }} // Limpiar error al cambiar
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//             onClick={() => { setActiveView('management'); setErrorMessage(null); }} // <-- Nuevo estado
//             className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                 activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold" // Usamos un color nuevo para diferenciar
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//             }`}
//         >
//             <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//         </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">Cargando autenticación...</p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         // Muestra una UI simple para pedir al usuario que inicie sesión
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR MENSAJE DE ERROR */}
//             {errorMessage && (
//                 <div className="mx-4 sm:mx-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//                     <strong className="font-bold">Error de Base de Datos:</strong>
//                     <span className="block sm:inline ml-2">{errorMessage}</span>
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                             onClick={() => setErrorMessage(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView {...restOfProps} /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         // 💥 Props obtenidas internamente
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setErrorMessage}
//                         errorMessage={errorMessage}
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//     <div className="p-4 sm:p-6 pt-0">
//         <EntityAndProjectManager 
//             db={db}
//             userId={userId}
//             setErrorMessage={setErrorMessage}
//             errorMessage={errorMessage}
//         />
//     </div>
// )}

            
//         </div>
//     );
// };

// export default HomeContent;


// import React, { useState, useEffect } from 'react'; 
// import { FaEuroSign, FaHome, FaUserFriends } from 'react-icons/fa';
// import { BsDropletFill } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth'; 
// import { 
//     collection, 
//     query, 
//     onSnapshot, 
//     where, 
//     getFirestore,
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import LaborCostDashboard from '../COSTOS/LaborCostInputForm';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- Custom Hook 1: Autenticación de Usuario ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         return () => unsubscribe(); // Limpiar la suscripción
//     }, []); 

//     return { db, userId, loadingAuth };
// };


// // --- Custom Hook 2: Gestión de Proyectos y Entidades (NUEVO Y CRUCIAL) ---
// const useProjectAndEntityData = (db, userId, setErrorMessage) => {
//     const [availableProjects, setAvailableProjects] = useState([]);
//     const [availableEntities, setAvailableEntities] = useState([]);
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingData(false);
//             return;
//         }

//         const firestore = getFirestore();
//         const projectsPath = `artifacts/${appId}/public/data/projects`;
//         const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
//         // 1. Suscripción a Proyectos
//         // Solo obtenemos el nombre del proyecto.
//         const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => doc.data().name);
//             setAvailableProjects(projects);
//             setLoadingData(false); // La primera carga de datos crucial es Projects
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setErrorMessage("Error al cargar la lista de proyectos.");
//             setLoadingData(false);
//         });

//         // 2. Suscripción a Entidades
//         const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntities(entities);
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setErrorMessage("Error al cargar la lista de entidades.");
//         });

//         return () => {
//             unsubscribeProjects();
//             unsubscribeEntities();
//         };
//     }, [db, userId, setErrorMessage]);

//     return { availableProjects, availableEntities, loadingData };
// };


// // --- Componente Auxiliar para las Tarjetas de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de la Vista Inicial (Dashboard) ---
// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
// }) => {
    
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     // Cálculo de la producción total
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const summaryData = [
//         { 
//             title: `${currentCropName} Cosechado`, 
//             value: totalProduction.toFixed(1), 
//             unit: "Kg", 
//             icon: <FaSeedling />, 
//             color: "border-green-500" 
//         },
//         { 
//             title: "Área Total", 
//             value: config.plantedArea || "0.0", 
//             unit: config.plantedAreaUnit || "ha", 
//             icon: <FaRulerCombined />, 
//             color: "border-blue-500" 
//         },
//         { 
//             title: "Riego Programado", 
//             value: config.scheduledIrrigationTime || "0", 
//             unit: "horas", 
//             icon: <BsDropletFill />, 
//             color: "border-cyan-500" 
//         },
//         { 
//             title: "Cargas Pendientes", 
//             value: config.pendingLoads || "0", 
//             unit: "pendientes", 
//             icon: <FaTruckLoading />, 
//             color: "border-orange-500" 
//         },
//     ];

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (DINÁMICO) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CONEXIÓN Y AUTH INTEGRADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('costs'); 
//     const [errorMessage, setErrorMessage] = useState(null);
    

//     // 2. OBTENER PROYECTOS Y ENTIDADES (CRUCIAL)
//     const { 
//         availableProjects, 
//         availableEntities, 
//         loadingData 
//     } = useProjectAndEntityData(db, userId, setErrorMessage); 


//     // Destructurar las props restantes
//     const { ...restOfProps } = props;


//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             <button
//                 onClick={() => { setActiveView('home'); setErrorMessage(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setErrorMessage(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setErrorMessage(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'employee_management'
//                         ? "border-purple-600 text-purple-600 font-bold" // Usamos el color de gestión, o uno nuevo
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setErrorMessage(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setErrorMessage(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'labor'
//                         ? "border-red-600 text-red-600 font-bold" // 🔴 Nuevo color para diferenciar
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : "Cargando datos maestros..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         // Muestra una UI simple para pedir al usuario que inicie sesión
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR MENSAJE DE ERROR */}
//             {errorMessage && (
//                 <div className="mx-4 sm:mx-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//                     <strong className="font-bold">Error de Base de Datos:</strong>
//                     <span className="block sm:inline ml-2">{errorMessage}</span>
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                             onClick={() => setErrorMessage(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView {...restOfProps} /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setErrorMessage}
//                         errorMessage={errorMessage}
//                         // 🟢 ¡PROP PASADA CORRECTAMENTE!
//                         availableProjects={availableProjects} 
//                         availableEntities={availableEntities}
                        
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setErrorMessage}
//                         errorMessage={errorMessage}
//                         // Opcional: Pasamos los datos que ya tenemos cargados
//                         initialProjects={availableProjects}
//                         initialEntities={availableEntities}
//                     />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setErrorMessage}
//                         // 💥 CONEXIÓN CRUCIAL: Pasamos las entidades/empresas disponibles
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // 🆕 NUEVA VISTA
//                 <div className="p-4 sm:p-6 pt-0">
//                     <LaborCostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setErrorMessage}
//                         // Pasamos los datos maestros que cargamos centralmente
//                         availableProjects={availableProjects} 
//                         availableEntities={availableEntities} // Necesario para seleccionar la Empresa
//                     />
//                 </div>
//             )}
            
//         </div>
//     );
// };

// export default HomeContent;



// import React, { useState, useEffect } from 'react'; 
// import { FaEuroSign, FaHome, FaUserFriends } from 'react-icons/fa';
// import { BsDropletFill } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth'; 
// import { 
//     collection, 
//     query, 
//     onSnapshot, 
//     where, 
//     getFirestore,
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import LaborCostDashboard from '../COSTOS/LaborCostInputForm';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- Custom Hook 1: Autenticación de Usuario ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         return () => unsubscribe(); // Limpiar la suscripción
//     }, []); 

//     return { db, userId, loadingAuth };
// };


// // --- Custom Hook 2: Gestión de Proyectos y Entidades (CORREGIDO) ---
// // Ahora usa setNotification y envía objetos {message, type}
// const useProjectAndEntityData = (db, userId, setNotification) => {
//     const [availableProjects, setAvailableProjects] = useState([]);
//     const [availableEntities, setAvailableEntities] = useState([]);
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingData(false);
//             return;
//         }

//         const firestore = getFirestore();
//         const projectsPath = `artifacts/${appId}/public/data/projects`;
//         const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
//         // 1. Suscripción a Proyectos
//         const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => doc.data().name);
//             setAvailableProjects(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             // ✅ CORRECCIÓN APLICADA: Pasa el objeto {message, type}
//             setNotification({ message: "Error al cargar la lista de proyectos.", type: "error" });
//             setLoadingData(false);
//         });

//         // 2. Suscripción a Entidades
//         const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntities(entities);
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             // ✅ CORRECCIÓN APLICADA: Pasa el objeto {message, type}
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => {
//             unsubscribeProjects();
//             unsubscribeEntities();
//         };
//     }, [db, userId, setNotification]);

//     return { availableProjects, availableEntities, loadingData };
// };


// // --- Componente Auxiliar para las Tarjetas de Resumen ---
// const SummaryCard = ({ title, value, unit, icon, color }) => (
//     <motion.div
//         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 400 }}
//     >
//         <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-3xl font-bold text-gray-800 mt-1">
//                 {value}
//                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
//             </p>
//         </div>
//         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
//             {icon}
//         </div>
//     </motion.div>
// );

// // --- Componente de la Vista Inicial (Dashboard) ---
// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
// }) => {
    
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     // Cálculo de la producción total
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const summaryData = [
//         { 
//             title: `${currentCropName} Cosechado`, 
//             value: totalProduction.toFixed(1), 
//             unit: "Kg", 
//             icon: <FaSeedling />, 
//             color: "border-green-500" 
//         },
//         { 
//             title: "Área Total", 
//             value: config.plantedArea || "0.0", 
//             unit: config.plantedAreaUnit || "ha", 
//             icon: <FaRulerCombined />, 
//             color: "border-blue-500" 
//         },
//         { 
//             title: "Riego Programado", 
//             value: config.scheduledIrrigationTime || "0", 
//             unit: "horas", 
//             icon: <BsDropletFill />, 
//             color: "border-cyan-500" 
//         },
//         { 
//             title: "Cargas Pendientes", 
//             value: config.pendingLoads || "0", 
//             unit: "pendientes", 
//             icon: <FaTruckLoading />, 
//             color: "border-orange-500" 
//         },
//     ];

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (DINÁMICO) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CONEXIÓN Y AUTH INTEGRADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('costs'); 
//     // ✅ Estado para notificaciones: { message: string, type: 'success' | 'error' }
//     const [notification, setNotification] = useState(null); 
    

//     // 2. OBTENER PROYECTOS Y ENTIDADES (CRUCIAL)
//     // Pasamos setNotification para que el hook envíe mensajes estructurados
//     const { 
//         availableProjects, 
//         availableEntities, 
//         loadingData 
//     } = useProjectAndEntityData(db, userId, setNotification); 


//     // Destructurar las props restantes
//     const { ...restOfProps } = props;


//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             <button
//                 // Limpiamos la notificación al cambiar de vista
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                  // Limpiamos la notificación al cambiar de vista
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                  // Limpiamos la notificación al cambiar de vista
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'employee_management'
//                         ? "border-purple-600 text-purple-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                  // Limpiamos la notificación al cambiar de vista
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                  // Limpiamos la notificación al cambiar de vista
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'labor'
//                         ? "border-red-600 text-red-600 font-bold" 
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : "Cargando datos maestros..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         // Muestra una UI simple para pedir al usuario que inicie sesión
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR NOTIFICACIÓN (Lógica dinámica para ÉXITO o ERROR) */}
//             {notification && (
//                 <div className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4
//                     ${notification.type === 'success' 
//                         ? 'bg-green-100 border border-green-400 text-green-700' 
//                         : 'bg-red-100 border border-red-400 text-red-700'}
//                 `}>
                    
//                     {/* 💥 TÍTULO DINÁMICO */}
//                     <strong className="font-bold">
//                         {notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}
//                     </strong>
                    
//                     {/* 💥 MENSAJE DEL OBJETO */}
//                     <span className="block sm:inline ml-2">{notification.message}</span>
                    
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                         onClick={() => setNotification(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView {...restOfProps} /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} // Alias a setNotification
//                         errorMessage={notification}         // Pasa el objeto notification
//                         availableProjects={availableProjects} 
//                         availableEntities={availableEntities}
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} // Alias a setNotification
//                         errorMessage={notification}         // Pasa el objeto notification
//                         initialProjects={availableProjects}
//                         initialEntities={availableEntities}
//                     />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} // Alias a setNotification
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // 🆕 NUEVA VISTA
//                 <div className="p-4 sm:p-6 pt-0">
//                     <LaborCostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} // Alias a setNotification
//                         availableProjects={availableProjects} 
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}
            
//         </div>
//     );
// };

// export default HomeContent;


// import React, { useState, useEffect } from 'react'; 
// import { FaEuroSign, FaHome, FaUserFriends } from 'react-icons/fa';
// import { BsDropletFill } from 'react-icons/bs';
// import { FaSeedling, FaTruckLoading, FaRulerCombined } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth'; 
// import { 
//     collection, 
//     query, 
//     onSnapshot, 
//     where, 
//     getFirestore,
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// // import LaborCostDashboard from '../COSTOS/LaborCostInputForm'; // ❌ Lo comentamos, ya que usaremos el Wizard directamente para las pruebas.
// import EmployeeManagement from '../COSTOS/EmployeeManagement';

// // 🚀 IMPORTACIÓN DEL NUEVO COMPONENTE WIZARD
// import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; // <-- RUTA ASUMIDA: Ajusta si TimeSheetWizard está en otra ubicación.
// import LaborCostDashboard from '../COSTOS/LaborCostInputForm';
// import SummaryCard from '../COSTOS/SummaryCard';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- Custom Hook 1: Autenticación de Usuario ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         return () => unsubscribe(); // Limpiar la suscripción
//     }, []); 

//     return { db, userId, loadingAuth };
// };


// // --- Custom Hook 2: Gestión de Proyectos y Entidades (CORREGIDO) ---
// const useProjectAndEntityData = (db, userId, setNotification,) => {
//     // CAMBIAMOS el nombre a 'availableLocals' para que coincida con la prop del Wizard
//     const [availableLocals, setAvailableLocals] = useState([]); 
//     const [availableEntities, setAvailableEntities] = useState([]);
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingData(false);
//             return;
//         }

//         const firestore = getFirestore();
//         const projectsPath = `artifacts/${appId}/public/data/projects`;
//         const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
//         // 1. Suscripción a Proyectos (Ahora son los Locales/Cultivos)
//         const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             // Mapear los proyectos para que tengan la estructura esperada por el Wizard: {id, name, type}
//             const projects = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 name: doc.data().name, 
//                 type: doc.data().cropType || 'Proyecto General' // Asumimos un campo tipo cultivo
//             }));
//             setAvailableLocals(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
//             setLoadingData(false);
//         });

//         // 2. Suscripción a Entidades (Se mantiene igual)
//         const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntities(entities);
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => {
//             unsubscribeProjects();
//             unsubscribeEntities();
//         };
//     }, [db, userId, setNotification]);

//     // Devolvemos el estado renombrado
//     return { availableLocals, availableEntities, loadingData };
// };


// // --- Componente Auxiliar para las Tarjetas de Resumen (Se mantiene igual) ---


// // const SummaryCard = ({ title, value, unit, icon, color }) => (
// //     <motion.div
// //         className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
// //         whileHover={{ scale: 1.01 }}
// //         transition={{ type: "spring", stiffness: 400 }}
// //     >
// //         <div>
// //             <p className="text-sm font-medium text-gray-500">{title}</p>
// //             <p className="text-3xl font-bold text-gray-800 mt-1">
// //                 {value}
// //                 <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
// //             </p>
// //         </div>
// //         <div className={`p-3 rounded-full text-white text-3xl opacity-80 ${color.replace('border-', 'bg-')}`}>
// //             {icon}
// //         </div>
// //     </motion.div>
// // );

// // --- Componente de la Vista Inicial (Dashboard) (Se mantiene igual) ---
// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets
// }) => {
//     // ... (Lógica de HomeView sin cambios) ...
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     // Cálculo de la producción total
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);

//     const summaryData = [
//         { 
//             title: `${currentCropName} Cosechado`, 
//             value: totalProduction.toFixed(1), 
//             unit: "Kg", 
//             icon: <FaSeedling />, 
//             color: "border-green-500" 
//         },
//         { 
//             title: "Área Total", 
//             value: config.plantedArea || "0.0", 
//             unit: config.plantedAreaUnit || "ha", 
//             icon: <FaRulerCombined />, 
//             color: "border-blue-500" 
//         },
//         { 
//             title: "Riego Programado", 
//             value: config.scheduledIrrigationTime || "0", 
//             unit: "horas", 
//             icon: <BsDropletFill />, 
//             color: "border-cyan-500" 
//         },
//         { 
//             title: "Cargas Pendientes", 
//             value: config.pendingLoads || "0", 
//             unit: "pendientes", 
//             icon: <FaTruckLoading />, 
//             color: "border-orange-500" 
//         },
//     ];

//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. GRID PRINCIPAL - Resumen de datos clave (DINÁMICO) */}
//             {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {summaryData.map((data, index) => (
//                     <SummaryCard key={index} {...data} />
//                 ))}
//             </div> */}



// <div className="mb-8">
//                 <SummaryCard timesheets={timesheets} />
//             </div>


//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CONEXIÓN Y AUTH INTEGRADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('labor'); // 🚨 CAMBIADO A 'labor' para prueba inmediata
//     // Estado para notificaciones: { message: string, type: 'success' | 'error' }
//     const [notification, setNotification] = useState(null); 
    

//     // 2. OBTENER PROYECTOS Y ENTIDADES (CRUCIAL)
//     // Renombramos los proyectos a 'availableLocals' para el Wizard
//     const { 
//         availableLocals, // <-- Ahora contiene los proyectos mapeados
//         availableEntities, 
//         loadingData 
//     } = useProjectAndEntityData(db, userId, setNotification); 


//     // Destructurar las props restantes
//     const { ...restOfProps } = props;


//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             <button
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'employee_management'
//                         ? "border-purple-600 text-purple-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'labor'
//                         ? "border-red-600 text-red-600 font-bold" // 🚨 ESTILO ROJO PARA LA VISTA DE PRUEBA
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso (Se mantiene igual) ---
//     if (loadingAuth || loadingData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : "Cargando datos maestros..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR NOTIFICACIÓN (Lógica dinámica para ÉXITO o ERROR) */}
//             {notification && (
//                 <div className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4
//                     ${notification.type === 'success' 
//                         ? 'bg-green-100 border border-green-400 text-green-700' 
//                         : 'bg-red-100 border border-red-400 text-red-700'}
//                 `}>
                    
//                     {/* 💥 TÍTULO DINÁMICO */}
//                     <strong className="font-bold">
//                         {notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}
//                     </strong>
                    
//                     {/* 💥 MENSAJE DEL OBJETO */}
//                     <span className="block sm:inline ml-2">{notification.message}</span>
                    
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                         onClick={() => setNotification(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView {...restOfProps} /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         availableProjects={availableLocals.map(l => l.name)} // Volvemos a pasar solo el nombre
//                         availableEntities={availableEntities}
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         // Necesitarías mapear los "Locales" de vuelta a la estructura de proyectos si fuera necesario
//                         initialProjects={availableLocals.map(l => l.name)} 
//                         initialEntities={availableEntities}
//                     />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // 🆕 NUEVA VISTA
//                 <div className="p-4 sm:p-6 pt-0">
//                     {/* 🚀 1. WIZARD (EL FORMULARIO DE INGRESO) 🚀 */}
//                     <div className="mb-8">
//                         <TimeSheetWizard 
//                             db={db}
//                             userId={userId}
//                             setErrorMessage={setNotification} 
//                             availableLocals={availableLocals} 
//                         />
//                     </div>
                    
//                     {/* 📊 2. DASHBOARD (EL VISUALIZADOR DE DATOS) 📊 */}
//                     <LaborCostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} // Usa el mismo sistema de notificación
//                     />
//                 </div>
//             )}
            
//         </div>
//     );
// };

// export default HomeContent;



















// import React, { useState, useEffect, useMemo } from 'react';
// import { FaEuroSign, FaHome, FaUserFriends, FaCalculator, FaHourglassHalf, FaMoneyBillWave, FaListAlt, FaSeedling, FaTruckLoading, FaRulerCombined, FaClock, FaUser, FaTools, FaCalendarDay, FaTruck } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth';
// import {
//     collection,
//     query,
//     onSnapshot,
//     where,
//     orderBy,
//     getFirestore,
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';
// import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
// import SummaryCard from '../COSTOS/SummaryCard';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;

// // =======================================================================
// // === HOOKS PERSONALIZADOS
// // =======================================================================

// // --- Custom Hook 1: Autenticación de Usuario ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         return () => unsubscribe(); 
//     }, []); 

//     return { db, userId, loadingAuth };
// };


// // --- Custom Hook 2: Gestión de Proyectos y Entidades ---
// const useProjectAndEntityData = (db, userId, setNotification) => {
//     const [availableLocals, setAvailableLocals] = useState([]); 
//     const [availableEntities, setAvailableEntities] = useState([]);
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingData(false);
//             return;
//         }

//         const firestore = getFirestore();
//         const projectsPath = `artifacts/${appId}/public/data/projects`;
//         const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
//         // Suscripción a Proyectos (Locales/Cultivos)
//         const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 name: doc.data().name, 
//                 type: doc.data().cropType || 'Proyecto General' 
//             }));
//             setAvailableLocals(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
//             setLoadingData(false);
//         });

//         // Suscripción a Entidades
//         const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntities(entities);
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => {
//             unsubscribeProjects();
//             unsubscribeEntities();
//         };
//     }, [db, userId, setNotification]);

//     return { availableLocals, availableEntities, loadingData };
// };


// // --- Custom Hook 3: Carga de Timesheets (EXTRAÍDO DE LaborCostDashboard) ---
// const useTimesheetsData = (db, userId, setErrorMessage) => {
//     const [timesheets, setTimesheets] = useState([]);
//     const [loadingTimesheets, setLoadingTimesheets] = useState(true);
//     const [errorTimesheets, setErrorTimesheets] = useState(null);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingTimesheets(false);
//             return;
//         }

//         setErrorTimesheets(null);
//         setLoadingTimesheets(true);

//         try {
//             const firestore = db || getFirestore();
            
//             const timesheetQuery = query(
//                 collection(firestore, TIMESHEET_COLLECTION_PATH),
//                 where("createdBy", "==", userId),
//                 orderBy("createdAt", "desc") 
//             );

//             const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
                
//                 setTimesheets(data);
//                 setLoadingTimesheets(false);
//                 if (errorTimesheets) setErrorTimesheets(null); 

//             }, (err) => {
//                 console.error("Error al cargar timesheets:", err);
//                 const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
//                 setErrorTimesheets(userMessage);
//                 setErrorMessage({ message: userMessage, type: 'error' });
//                 setLoadingTimesheets(false);
//             });

//             return () => unsubscribe(); 
//         } catch (e) {
//             console.error("Error setting up timesheet listener:", e);
//             const userMessage = "Error interno al configurar la escucha de datos.";
//             setErrorTimesheets(userMessage);
//             setErrorMessage({ message: userMessage, type: 'error' });
//             setLoadingTimesheets(false);
//         }
//     }, [db, userId, setErrorMessage, errorTimesheets]);

//     return { timesheets, loadingTimesheets, errorTimesheets };
// };


// // =======================================================================
// // === COMPONENTE SummaryCard 
// // =======================================================================

// // const SummaryCard = ({ timesheets = [] }) => {
// //     const { totalHours, totalCost } = useMemo(() => {
// //         if (timesheets.length === 0) {
// //             return { totalHours: 0, totalCost: 0 };
// //         }

// //         const calculated = timesheets.reduce((acc, record) => {
// //             if (!record) return acc;
            
// //             const hours = record.totalHours || 0;
// //             const rate = record.ratePerHour || 0;
            
// //             acc.totalHours += hours;
// //             acc.totalCost += hours * rate;

// //             return acc;
// //         }, { totalHours: 0, totalCost: 0 });

// //         return {
// //             totalHours: calculated.totalHours.toFixed(2),
// //             totalCost: calculated.totalCost.toFixed(2)
// //         };
// //     }, [timesheets]); 

// //     const cardStyle = "bg-white p-6 rounded-lg shadow-xl border-l-4 border-indigo-600";
    
// //     return (
// //         <div className={cardStyle}>
// //             <div className="flex items-center justify-between mb-4 border-b pb-2">
// //                 <h3 className="text-xl font-bold text-indigo-800 flex items-center">
// //                     <FaCalculator className="mr-3 text-2xl"/> 📊 Resumen de Costes de Mano de Obra
// //                 </h3>
// //                 <span className="text-sm text-gray-500">
// //                     <FaListAlt className="inline mr-1"/> Registros: {timesheets.length}
// //                 </span>
// //             </div>

// //             <div className="space-y-4">
// //                 {/* Métrica 1: Total de Horas */}
// //                 <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-md">
// //                     <p className="text-sm font-semibold text-indigo-700 flex items-center">
// //                         <FaHourglassHalf className="mr-3 text-xl"/> Horas Trabajadas Totales:
// //                     </p>
// //                     <span className="text-2xl font-extrabold text-indigo-900">
// //                         {totalHours} h
// //                     </span>
// //                 </div>

// //                 {/* Métrica 2: Coste Total Estimado */}
// //                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-200">
// //                     <p className="text-sm font-semibold text-red-700 flex items-center">
// //                         <FaMoneyBillWave className="mr-3 text-xl"/> Coste Total Estimado:
// //                     </p>
// //                     <span className="text-2xl font-extrabold text-red-900">
// //                         {totalCost} €
// //                     </span>
// //                 </div>
// //             </div>

// //             <div className="mt-4 text-xs text-gray-500 pt-3 border-t">
// //                 <p>Este cálculo es un resumen de los {timesheets.length} registros mostrados abajo.</p>
// //             </div>
// //         </div>
// //     );
// // };


// // =======================================================================
// // === COMPONENTE LaborCostDashboardDisplay (SIMPLIFICADO)
// // =======================================================================

// const LaborCostDashboardDisplay = ({ timesheets = [], error }) => {
    
//     if (error) {
//         return (
//             <div className="text-center p-10 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <p className="text-lg font-semibold text-red-800">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

//             {timesheets.length === 0 ? (
//                 <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
//                     <p className="text-lg text-yellow-800">No se encontraron registros de tiempo.</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {timesheets.map((record) => {
//                         const cost = (record.totalHours * (record.ratePerHour || 0)).toFixed(2);
//                         const machineryInfo = record.machineryId ? `ID: ${record.machineryId}` : 'No aplica';
                        
//                         return (
//                             <div key={record.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500">
//                                 <div className="text-sm text-gray-500 mb-3 flex items-center">
//                                     <FaCalendarDay className="mr-2 text-red-500"/> **{record.date}** | Reg. ID: {record.id.substring(0, 4)}...
//                                 </div>
                                
//                                 <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
//                                     <FaUser className="mr-2"/> {record.workerName}
//                                 </h3>

//                                 <ul className="space-y-1 text-sm text-gray-700">
//                                     <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
//                                     <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
//                                     <li className="flex items-center"><FaTruck className="mr-2 text-orange-500"/> Maquinaria: {machineryInfo}</li>
//                                     <li className="flex items-center mt-2 pt-2 border-t"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{record.totalHours.toFixed(2)} h</span></li>
//                                 </ul>

//                                 <div className="mt-3 p-2 bg-red-50 rounded-md">
//                                     <p className="flex items-center font-bold text-lg text-red-700">
//                                         <FaEuroSign className="mr-2"/> Coste Estimado: {cost} €
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };


// // =======================================================================
// // === COMPONENTE HomeView 
// // =======================================================================

// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets 
// }) => {
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);


//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. Tarjeta de Resumen de Mano de Obra */}
//             <div className="mb-8">
//                 <SummaryCard timesheets={timesheets} /> 
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CARGA DE DATOS CENTRALIZADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('labor'); 
//     const [notification, setNotification] = useState(null); 
    

//     // 2. OBTENER PROYECTOS Y ENTIDADES
//     const { 
//         availableLocals, 
//         availableEntities, 
//         loadingData 
//     } = useProjectAndEntityData(db, userId, setNotification); 

//     // 💥 3. CARGAR LOS TIMESHEETS GLOBALMENTE
//     const { 
//         timesheets, 
//         loadingTimesheets, 
//         errorTimesheets 
//     } = useTimesheetsData(db, userId, setNotification); 


//     const { ...restOfProps } = props;


//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             {/* ... (Botones de navegación de vistas) ... */}
//             <button
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'employee_management'
//                         ? "border-purple-600 text-purple-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'labor'
//                         ? "border-red-600 text-red-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData || loadingTimesheets) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : loadingData ? "Cargando datos maestros..." : "Cargando registros de trabajo..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR NOTIFICACIÓN */}
//             {notification && (
//                 <div className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4
//                     ${notification.type === 'success' 
//                         ? 'bg-green-100 border border-green-400 text-green-700' 
//                         : 'bg-red-100 border border-red-400 text-red-700'}
//                 `}>
                    
//                     <strong className="font-bold">
//                         {notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}
//                     </strong>
                    
//                     <span className="block sm:inline ml-2">{notification.message}</span>
                    
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                         onClick={() => setNotification(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView 
//                     {...restOfProps}
//                     timesheets={timesheets} 
//                 /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         availableProjects={availableLocals.map(l => l.name)} 
//                         availableEntities={availableEntities}
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         initialProjects={availableLocals.map(l => l.name)} 
//                         initialEntities={availableEntities}
//                     />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
//                 <div className="p-4 sm:p-6 pt-0">
                    
//                     {/* 🚀 1. WIZARD (FORMULARIO DE INGRESO) 🚀 */}
//                     <div className="mb-8">
//                         <TimeSheetWizard 
//                             db={db}
//                             userId={userId}
//                             setErrorMessage={setNotification} 
//                             availableLocals={availableLocals} 
//                         />
//                     </div>
                    
//                     {/* 📊 2. DASHBOARD (VISUALIZADOR DE DATOS) 📊 */}
//                     <SummaryCard timesheets={timesheets} /> 
                    
//                     <div className="mt-6">
//                         <LaborCostDashboardDisplay 
//                             timesheets={timesheets} 
//                             error={errorTimesheets}
//                         />
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default HomeContent;






// import React, { useState, useEffect, useMemo } from 'react';
// import { FaEuroSign, FaHome, FaUserFriends, FaCalculator, FaHourglassHalf, FaMoneyBillWave, FaListAlt, FaSeedling, FaTruckLoading, FaRulerCombined, FaClock, FaUser, FaTools, FaCalendarDay, FaTruck } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { onAuthStateChanged } from 'firebase/auth';
// import {
//     collection,
//     query,
//     onSnapshot,
//     where,
//     orderBy,
//     getFirestore,
// } from "firebase/firestore";

// // 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
// import { db, auth } from '../../firebaseConfig'; 

// // Componentes Requeridos para el Home (Dashboard)
// import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
// import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
// import { CostDashboard } from '../COSTOS/CostDashboard'; 
// import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
// import EmployeeManagement from '../COSTOS/EmployeeManagement';
// import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
// import SummaryCard from '../COSTOS/SummaryCard';

// // --- CONFIGURACIÓN DE FIREBASE/APP ID ---
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();
// const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;

// // =======================================================================
// // === HOOKS PERSONALIZADOS
// // =======================================================================

// // --- Custom Hook 1: Autenticación de Usuario ---
// const useUserAuth = () => {
//     const [userId, setUserId] = useState(null);
//     const [loadingAuth, setLoadingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//             } else {
//                 setUserId(null);
//             }
//             setLoadingAuth(false);
//         });

//         return () => unsubscribe(); 
//     }, []); 

//     return { db, userId, loadingAuth };
// };


// // --- Custom Hook 2: Gestión de Proyectos y Entidades ---
// const useProjectAndEntityData = (db, userId, setNotification) => {
//     const [availableLocals, setAvailableLocals] = useState([]); 
//     const [availableEntities, setAvailableEntities] = useState([]);
//     const [loadingData, setLoadingData] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingData(false);
//             return;
//         }

//         const firestore = getFirestore();
//         const projectsPath = `artifacts/${appId}/public/data/projects`;
//         const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
//         // Suscripción a Proyectos (Locales/Cultivos)
//         const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
//         const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
//             const projects = snapshot.docs.map(doc => ({ 
//                 id: doc.id, 
//                 name: doc.data().name, 
//                 type: doc.data().cropType || 'Proyecto General' 
//             }));
//             setAvailableLocals(projects);
//             setLoadingData(false);
//         }, (error) => {
//             console.error("Firestore project data error:", error);
//             setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
//             setLoadingData(false);
//         });

//         // Suscripción a Entidades
//         const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
//         const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
//             const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setAvailableEntities(entities);
//         }, (error) => {
//             console.error("Firestore entity data error:", error);
//             setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
//         });

//         return () => {
//             unsubscribeProjects();
//             unsubscribeEntities();
//         };
//     }, [db, userId, setNotification]);

//     return { availableLocals, availableEntities, loadingData };
// };


// // --- Custom Hook 3: Carga de Timesheets (EXTRAÍDO DE LaborCostDashboard) ---
// const useTimesheetsData = (db, userId, setErrorMessage) => {
//     const [timesheets, setTimesheets] = useState([]);
//     const [loadingTimesheets, setLoadingTimesheets] = useState(true);
//     const [errorTimesheets, setErrorTimesheets] = useState(null);

//     useEffect(() => {
//         if (!db || !userId) {
//             setLoadingTimesheets(false);
//             return;
//         }

//         setErrorTimesheets(null);
//         setLoadingTimesheets(true);

//         try {
//             const firestore = db || getFirestore();
            
//             const timesheetQuery = query(
//                 collection(firestore, TIMESHEET_COLLECTION_PATH),
//                 where("createdBy", "==", userId),
//                 orderBy("createdAt", "desc") 
//             );

//             const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
                
//                 setTimesheets(data);
//                 setLoadingTimesheets(false);
//                 if (errorTimesheets) setErrorTimesheets(null); 

//             }, (err) => {
//                 console.error("Error al cargar timesheets:", err);
//                 const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
//                 setErrorTimesheets(userMessage);
//                 setErrorMessage({ message: userMessage, type: 'error' });
//                 setLoadingTimesheets(false);
//             });

//             return () => unsubscribe(); 
//         } catch (e) {
//             console.error("Error setting up timesheet listener:", e);
//             const userMessage = "Error interno al configurar la escucha de datos.";
//             setErrorTimesheets(userMessage);
//             setErrorMessage({ message: userMessage, type: 'error' });
//             setLoadingTimesheets(false);
//         }
//     }, [db, userId, setErrorMessage, errorTimesheets]);

//     return { timesheets, loadingTimesheets, errorTimesheets };
// };


// // =======================================================================
// // === COMPONENTE LaborCostDashboardDisplay (SIMPLIFICADO)
// // =======================================================================
// const LaborCostDashboardDisplay = ({ timesheets = [], error }) => {
    
//     if (error) {
//         return (
//             <div className="text-center p-10 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                 <p className="text-lg font-semibold text-red-800">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

//             {timesheets.length === 0 ? (
//                 <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
//                     <p className="text-lg text-yellow-800">No se encontraron registros de tiempo.</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {timesheets.map((record) => {
//                         const cost = (record.totalHours * (record.ratePerHour || 0)).toFixed(2);
//                         const machineryInfo = record.machineryId ? `ID: ${record.machineryId}` : 'No aplica';
                        
//                         return (
//                             <div key={record.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500">
//                                 <div className="text-sm text-gray-500 mb-3 flex items-center">
//                                     <FaCalendarDay className="mr-2 text-red-500"/> **{record.date}** | Reg. ID: {record.id.substring(0, 4)}...
//                                 </div>
                                
//                                 <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
//                                     <FaUser className="mr-2"/> {record.workerName}
//                                 </h3>

//                                 <ul className="space-y-1 text-sm text-gray-700">
//                                     <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
//                                     <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
//                                     <li className="flex items-center"><FaTruck className="mr-2 text-orange-500"/> Maquinaria: {machineryInfo}</li>
//                                     <li className="flex items-center mt-2 pt-2 border-t"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{record.totalHours.toFixed(2)} h</span></li>
//                                 </ul>

//                                 <div className="mt-3 p-2 bg-red-50 rounded-md">
//                                     <p className="flex items-center font-bold text-lg text-red-700">
//                                         <FaEuroSign className="mr-2"/> Coste Estimado: {cost} €
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };


// // =======================================================================
// // === COMPONENTE HomeView 
// // =======================================================================

// const HomeView = ({ 
//     dailyData, 
//     greenhouses = [], 
//     selectedGreenhouseId, 
//     setSelectedGreenhouseId, 
//     updateGreenhouseConfig, 
//     greenhouseConfig, 
//     timesheets 
// }) => {
//     const config = greenhouseConfig || {}; 
//     const currentCropName = config.cropName || "Cultivo no asignado"; 
    
//     const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
//         const dayTotal = (day.items || []).reduce((itemSum, item) => 
//             itemSum + parseFloat(item.result || 0), 0);
//         return sum + dayTotal;
//     }, 0);


//     const handleMapSelect = (id) => {
//         setSelectedGreenhouseId(id); 
//     };

//     const handleCardSelect = (e) => {
//         setSelectedGreenhouseId(e.target.value);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-gray-50">
//             {/* 1. Tarjeta de Resumen de Mano de Obra */}
//             <div className="mb-8">
//                 <SummaryCard timesheets={timesheets} /> 
//             </div>

//             {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 <div className="lg:col-span-2 space-y-6">
                    
//                     {/* 2.1. MAPA */}
//                     <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
//                         <div className="flex-grow">
//                             <GreenhouseMap 
//                                 greenhouses={greenhouses} 
//                                 onGreenhouseSelect={handleMapSelect} 
//                                 selectedGreenhouseId={selectedGreenhouseId} 
//                             />
//                         </div>
//                     </div>

//                     {/* 2.2. SUB-GRID para Resumen y Gráfica */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
//                         {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
//                         <GreenhouseSummaryCard 
//                             config={config} 
//                             totalProduction={totalProduction} 
//                             currentCrop={currentCropName} 
//                             selectedGreenhouseId={selectedGreenhouseId} 
//                             updateGreenhouseConfig={updateGreenhouseConfig} 
//                             greenhouses={greenhouses} 
//                             onSelectGreenhouse={handleCardSelect}
//                         />

//                         {/* Espacio para Gráficas de Producción */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
//                             <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Columna 3 (Pronóstico y Actividades) */}
//                 <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
//                         <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
//                         <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // =======================================================================
// // === HOME CONTENT PRINCIPAL (CON CARGA DE DATOS CENTRALIZADA)
// // =======================================================================

// const HomeContent = (props) => {
    
//     // 1. OBTENER DB, USERID y estado de carga de Autenticación
//     const { db, userId, loadingAuth } = useUserAuth(); 
    
//     const [activeView, setActiveView] = useState('labor'); 
//     const [notification, setNotification] = useState(null); 
    

//     // 2. OBTENER PROYECTOS Y ENTIDADES
//     const { 
//         availableLocals, 
//         availableEntities, 
//         loadingData 
//     } = useProjectAndEntityData(db, userId, setNotification); 

//     // 💥 3. CARGAR LOS TIMESHEETS GLOBALMENTE
//     const { 
//         timesheets, 
//         loadingTimesheets, 
//         errorTimesheets 
//     } = useTimesheetsData(db, userId, setNotification); 


//     const { ...restOfProps } = props;


//     // =======================================================================
//     // === CÁLCULO DE COSTES DE MANO DE OBRA (¡BLOQUE CLAVE AÑADIDO!)
//     // =======================================================================
//     const { timesheetTotalCost, timesheetTotalCostByProject } = useMemo(() => {
//         let totalCost = 0;
//         const costByProject = {};

//         timesheets.forEach(record => {
//             // Aseguramos que los campos existan antes de calcular
//             if (record && record.totalHours && record.ratePerHour) {
//                 const cost = record.totalHours * record.ratePerHour;
//                 totalCost += cost;
                
//                 // Usamos 'localName' (el proyecto/cultivo) como clave
//                 const projectName = record.localName || 'General'; 
//                 costByProject[projectName] = (costByProject[projectName] || 0) + cost;
//             }
//         });

//         return {
//             timesheetTotalCost: totalCost, // El coste total para la categoría "Mano de Obra"
//             timesheetTotalCostByProject: costByProject, // El desglose por proyecto
//         };
//     }, [timesheets]); // Se recalcula cuando los datos de tiempo cambian

    
//     // --- Barra de Navegación de Vistas ---
//     const ViewTabs = () => (
//         <div className="flex justify-start mb-6 border-b border-gray-300">
//             {/* ... (Botones de navegación de vistas) ... */}
//             <button
//                 onClick={() => { setActiveView('home'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'home'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaHome className="text-lg"/> <span>Dashboard</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('costs'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'costs'
//                         ? "border-blue-600 text-blue-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaEuroSign className="text-lg"/> <span>Costes</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('employee_management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'employee_management'
//                         ? "border-purple-600 text-purple-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <FaUserFriends className="text-lg"/> <span>Personal</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('management'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'management'
//                     ? "border-purple-600 text-purple-600 font-bold"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
//             </button>
//             <button
//                 onClick={() => { setActiveView('labor'); setNotification(null); }}
//                 className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                     activeView === 'labor'
//                         ? "border-red-600 text-red-600 font-bold"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//                 <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
//             </button>
//         </div>
//     );


//     // --- Estado de Carga y Restricciones de Acceso ---
//     if (loadingAuth || loadingData || loadingTimesheets) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <p className="text-xl text-indigo-600 animate-pulse">
//                     {loadingAuth ? "Cargando autenticación..." : loadingData ? "Cargando datos maestros..." : "Cargando registros de trabajo..."}
//                 </p>
//             </div>
//         );
//     }
    
//     if (!userId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="p-10 text-center bg-white rounded-xl shadow-lg">
//                     <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
//                     <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* Título y Navegación de Vistas */}
//             <div className="p-4 sm:p-6 pb-0">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
//                     {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
//                 </h1>
//                 <ViewTabs />
//             </div>

//             {/* 💥 MOSTRAR NOTIFICACIÓN */}
//             {notification && (
//                 <div className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4
//                     ${notification.type === 'success' 
//                         ? 'bg-green-100 border border-green-400 text-green-700' 
//                         : 'bg-red-100 border border-red-400 text-red-700'}
//                 `}>
                    
//                     <strong className="font-bold">
//                         {notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}
//                     </strong>
                    
//                     <span className="block sm:inline ml-2">{notification.message}</span>
                    
//                     <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
//                         onClick={() => setNotification(null)}
//                     >
//                         ❌
//                     </span>
//                 </div>
//             )}

//             {/* Renderizado de la Vista Activa */}
//             {activeView === 'home' && (
//                 <HomeView 
//                     {...restOfProps}
//                     timesheets={timesheets} 
//                 /> 
//             )}

//             {activeView === 'costs' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <CostDashboard 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         errorMessage={notification} 
//                         availableProjects={availableLocals.map(l => l.name)} 
//                         availableEntities={availableEntities}
//                         timesheetTotalCost={timesheetTotalCost}
//                         timesheetTotalCostByProject={timesheetTotalCostByProject}
//                     />
//                 </div>
//             )}


//             {activeView === 'management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EntityAndProjectManager 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         initialProjects={availableLocals.map(l => l.name)} 
//                         initialEntities={availableEntities}
//                     />
//                 </div>
//             )}

//             {activeView === 'employee_management' && (
//                 <div className="p-4 sm:p-6 pt-0">
//                     <EmployeeManagement 
//                         db={db}
//                         userId={userId}
//                         setErrorMessage={setNotification} 
//                         availableEntities={availableEntities} 
//                     />
//                 </div>
//             )}

//             {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
//                 <div className="p-4 sm:p-6 pt-0">
                    
//                     {/* 🚀 1. WIZARD (FORMULARIO DE INGRESO) 🚀 */}
//                     <div className="mb-8">
//                         <TimeSheetWizard 
//                             db={db}
//                             userId={userId}
//                             setErrorMessage={setNotification} 
//                             availableLocals={availableLocals} 
//                         />
//                     </div>
                    
//                     {/* 📊 2. DASHBOARD (VISUALIZADOR DE DATOS) 📊 */}
//                     <SummaryCard timesheets={timesheets} /> 
                    
//                     <div className="mt-6">
//                         <LaborCostDashboardDisplay 
//                             timesheets={timesheets} 
//                             error={errorTimesheets}
//                         />
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default HomeContent;



import React, { useState, useEffect, useMemo } from 'react';
import { FaEuroSign, FaHome, FaUserFriends, FaCalculator, FaHourglassHalf, FaMoneyBillWave, FaListAlt, FaSeedling, FaTruckLoading, FaRulerCombined, FaClock, FaUser, FaTools, FaCalendarDay, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    query,
    onSnapshot,
    where,
    orderBy,
    getFirestore,
} from "firebase/firestore";

// 🚨 Asegúrate de que esta ruta sea correcta para tu proyecto
import { db, auth } from '../../firebaseConfig'; 

// Componentes Requeridos para el Home (Dashboard)
import GreenhouseMap from '../GreenhouseMap/GreenhouseMap'; 
import GreenhouseSummaryCard from '../../Pages/produccionC/GreenhouseSummaryCard'; 
import { CostDashboard } from '../COSTOS/CostDashboard'; 
import EntityAndProjectManager from '../COSTOS/EntityAndProjectManager';
import EmployeeManagement from '../COSTOS/EmployeeManagement';
import TimeSheetWizard from '../COSTOS/TimeSheetWizard'; 
import SummaryCard from '../COSTOS/SummaryCard';

// --- CONFIGURACIÓN DE FIREBASE/APP ID ---
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();
const TIMESHEET_COLLECTION_PATH = `artifacts/${appId}/public/data/timesheets`;
// 🚨 Colección de trabajadores/empleados
const WORKERS_COLLECTION_PATH = `artifacts/${appId}/public/data/employees`; 

// =======================================================================
// === HOOKS PERSONALIZADOS
// =======================================================================

// --- Custom Hook 1: Autenticación de Usuario ---
const useUserAuth = () => {
    const [userId, setUserId] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setLoadingAuth(false);
        });

        return () => unsubscribe(); 
    }, []); 

    return { db, userId, loadingAuth };
};


// --- Custom Hook 2: Gestión de Proyectos y Entidades ---
const useProjectAndEntityData = (db, userId, setNotification) => {
    const [availableLocals, setAvailableLocals] = useState([]); // Array de objetos {id, name, type...}
    const [availableEntityObjects, setAvailableEntityObjects] = useState([]); // Array de objetos {id, name, type...}
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!db || !userId) {
            setLoadingData(false);
            return;
        }

        const firestore = getFirestore();
        const projectsPath = `artifacts/${appId}/public/data/projects`;
        const entitiesPath = `artifacts/${appId}/public/data/entities`;
        
        // Suscripción a Proyectos (Locales/Cultivos)
        const qProjects = query(collection(firestore, projectsPath), where("userId", "==", userId));
        const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                name: doc.data().name, 
                type: doc.data().cropType || 'Proyecto General',
                ...doc.data() // Incluye el resto de la data (ej: area)
            }));
            setAvailableLocals(projects);
            setLoadingData(false);
        }, (error) => {
            console.error("Firestore project data error:", error);
            setNotification({ message: "Error al cargar la lista de proyectos (Locales).", type: "error" });
            setLoadingData(false);
        });

        // Suscripción a Entidades
        const qEntities = query(collection(firestore, entitiesPath), where("userId", "==", userId));
        const unsubscribeEntities = onSnapshot(qEntities, (snapshot) => {
            const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvailableEntityObjects(entities); // Guarda los objetos completos
        }, (error) => {
            console.error("Firestore entity data error:", error);
            setNotification({ message: "Error al cargar la lista de entidades.", type: "error" });
        });

        return () => {
            unsubscribeProjects();
            unsubscribeEntities();
        };
    }, [db, userId, setNotification]);

    // Devolvemos los objetos completos de entidades, pero para HomeContent
    // lo renombramos a availableEntityObjects
    return { availableLocals, availableEntityObjects, loadingData }; 
};


// --- Custom Hook 3: Gestión de Trabajadores (NUEVO) ---
const useWorkerData = (db, userId, setNotification) => {
    // Lista de nombres de trabajadores (strings)
    const [availableWorkers, setAvailableWorkers] = useState([]); 
    const [loadingWorkers, setLoadingWorkers] = useState(true);

    useEffect(() => {
        if (!db || !userId) {
            setLoadingWorkers(false);
            return;
        }

        const firestore = getFirestore();
        
        const qWorkers = query(collection(firestore, WORKERS_COLLECTION_PATH), where("userId", "==", userId));
        
        const unsubscribeWorkers = onSnapshot(qWorkers, (snapshot) => {
            // Mapeamos a un array de strings (solo el nombre)
            const workers = snapshot.docs.map(doc => doc.data().name).sort(); 
            setAvailableWorkers(workers);
            setLoadingWorkers(false);
        }, (error) => {
            console.error("Firestore worker data error:", error);
            setNotification({ message: "Error al cargar la lista de trabajadores.", type: "error" });
            setLoadingWorkers(false);
        });

        return () => unsubscribeWorkers();
    }, [db, userId, setNotification]);

    return { availableWorkers, loadingWorkers };
};


// --- Custom Hook 4: Carga de Timesheets ---
const useTimesheetsData = (db, userId, setErrorMessage) => {
    const [timesheets, setTimesheets] = useState([]);
    const [loadingTimesheets, setLoadingTimesheets] = useState(true);
    const [errorTimesheets, setErrorTimesheets] = useState(null);

    useEffect(() => {
        if (!db || !userId) {
            setLoadingTimesheets(false);
            return;
        }

        setErrorTimesheets(null);
        setLoadingTimesheets(true);

        try {
            const firestore = db || getFirestore();
            
            const timesheetQuery = query(
                collection(firestore, TIMESHEET_COLLECTION_PATH),
                where("createdBy", "==", userId),
                orderBy("createdAt", "desc") 
            );

            const unsubscribe = onSnapshot(timesheetQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setTimesheets(data);
                setLoadingTimesheets(false);
                if (errorTimesheets) setErrorTimesheets(null); 

            }, (err) => {
                console.error("Error al cargar timesheets:", err);
                const userMessage = "Error al cargar los registros de tiempo. Confirme permisos.";
                setErrorTimesheets(userMessage);
                setErrorMessage({ message: userMessage, type: 'error' });
                setLoadingTimesheets(false);
            });

            return () => unsubscribe(); 
        } catch (e) {
            console.error("Error setting up timesheet listener:", e);
            const userMessage = "Error interno al configurar la escucha de datos.";
            setErrorTimesheets(userMessage);
            setErrorMessage({ message: userMessage, type: 'error' });
            setLoadingTimesheets(false);
        }
    }, [db, userId, setErrorMessage, errorTimesheets]);

    return { timesheets, loadingTimesheets, errorTimesheets };
};


// =======================================================================
// === COMPONENTE LaborCostDashboardDisplay (SIMPLIFICADO)
// =======================================================================
const LaborCostDashboardDisplay = ({ timesheets = [], error }) => {
    
    // ... (el código de display se mantiene) ...
    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-lg font-semibold text-red-800">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">📋 Historial de Registros Guardados ({timesheets.length})</h2>

            {timesheets.length === 0 ? (
                <div className="text-center p-10 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <p className="text-lg text-yellow-800">No se encontraron registros de tiempo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timesheets.map((record) => {
                        const cost = (record.totalHours * (record.ratePerHour || 0)).toFixed(2);
                        const machineryInfo = record.machineryId ? `ID: ${record.machineryId.substring(0, 4)}...` : 'No aplica';
                        
                        return (
                            <div key={record.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-red-500">
                                <div className="text-sm text-gray-500 mb-3 flex items-center">
                                    <FaCalendarDay className="mr-2 text-red-500"/> **{record.date}** | Reg. ID: {record.id.substring(0, 4)}...
                                </div>
                                
                                <h3 className="text-xl font-semibold mb-3 text-red-700 flex items-center">
                                    <FaUser className="mr-2"/> {record.workerName}
                                </h3>

                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li className="flex items-center"><FaTools className="mr-2 text-blue-500"/> Operación: **{record.operationName}**</li>
                                    <li className="flex items-center"><FaSeedling className="mr-2 text-green-500"/> Cultivo: {record.localName}</li>
                                    <li className="flex items-center"><FaTruck className="mr-2 text-orange-500"/> Maquinaria: {machineryInfo}</li>
                                    <li className="flex items-center mt-2 pt-2 border-t"><FaClock className="mr-2 text-gray-500"/> Horas Netas: <span className="font-bold ml-1">{record.totalHours.toFixed(2)} h</span></li>
                                </ul>

                                <div className="mt-3 p-2 bg-red-50 rounded-md">
                                    <p className="flex items-center font-bold text-lg text-red-700">
                                        <FaEuroSign className="mr-2"/> Coste Estimado: {cost} €
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// =======================================================================
// === COMPONENTE HomeView 
// =======================================================================

const HomeView = ({ 
    dailyData, 
    greenhouses = [], 
    selectedGreenhouseId, 
    setSelectedGreenhouseId, 
    updateGreenhouseConfig, 
    greenhouseConfig, 
    timesheets 
}) => {
    // ... (El código de HomeView se mantiene igual) ...
    const config = greenhouseConfig || {}; 
    const currentCropName = config.cropName || "Cultivo no asignado"; 
    
    const totalProduction = Object.values(dailyData || {}).reduce((sum, day) => { 
        const dayTotal = (day.items || []).reduce((itemSum, item) => 
            itemSum + parseFloat(item.result || 0), 0);
        return sum + dayTotal;
    }, 0);


    const handleMapSelect = (id) => {
        setSelectedGreenhouseId(id); 
    };

    const handleCardSelect = (e) => {
        setSelectedGreenhouseId(e.target.value);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50">
            {/* 1. Tarjeta de Resumen de Mano de Obra */}
            <div className="mb-8">
                <SummaryCard timesheets={timesheets} /> 
            </div>

            {/* 2. GRID SECUNDARIO - Mapa, Producción, Gestión */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 2.1. MAPA */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[400px] flex flex-col z-10 relative"> 
                        <div className="flex-grow">
                            <GreenhouseMap 
                                greenhouses={greenhouses} 
                                onGreenhouseSelect={handleMapSelect} 
                                selectedGreenhouseId={selectedGreenhouseId} 
                            />
                        </div>
                    </div>

                    {/* 2.2. SUB-GRID para Resumen y Gráfica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 🚀 TARJETA DE GESTIÓN 🚀 */}
                        <GreenhouseSummaryCard 
                            config={config} 
                            totalProduction={totalProduction} 
                            currentCrop={currentCropName} 
                            selectedGreenhouseId={selectedGreenhouseId} 
                            updateGreenhouseConfig={updateGreenhouseConfig} 
                            greenhouses={greenhouses} 
                            onSelectGreenhouse={handleCardSelect}
                        />

                        {/* Espacio para Gráficas de Producción */}
                        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
                            <p className="text-gray-500 italic">Gráfica de Producción vs. Meta</p>
                        </div>
                    </div>
                </div>

                {/* Columna 3 (Pronóstico y Actividades) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">☀️ Pronóstico</h3>
                        <p className="text-gray-500 italic">Aquí va el pronóstico del tiempo</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg h-[350px]">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Actividades Recientes</h3>
                        <p className="text-gray-500 italic">Aquí van las actividades recientes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// =======================================================================
// === HOME CONTENT PRINCIPAL (CON CARGA DE DATOS CENTRALIZADA)
// =======================================================================

const HomeContent = (props) => {
    
    // 1. OBTENER DB, USERID y estado de carga de Autenticación
    const { db, userId, loadingAuth } = useUserAuth(); 
    
    const [activeView, setActiveView] = useState('labor'); 
    const [notification, setNotification] = useState(null); 
    

    // 2. OBTENER PROYECTOS Y ENTIDADES (Objetos)
    const { 
        availableLocals, // Array de objetos {id, name, type...}
        availableEntityObjects, // Array de objetos {id, name, type...}
        loadingData 
    } = useProjectAndEntityData(db, userId, setNotification); 
    
    // 3. OBTENER TRABAJADORES (Nombres)
    const { 
        availableWorkers, // Array de strings ['Worker 1', 'Worker 2']
        loadingWorkers 
    } = useWorkerData(db, userId, setNotification); 

    // 4. CARGAR LOS TIMESHEETS GLOBALMENTE
    const { 
        timesheets, 
        loadingTimesheets, 
        errorTimesheets 
    } = useTimesheetsData(db, userId, setNotification); 


    const { ...restOfProps } = props;


    // =======================================================================
    // === CÁLCULO DE COSTES Y PREPARACIÓN DE LISTAS PARA SELECTS
    // =======================================================================
    const { 
        timesheetTotalCost, 
        timesheetTotalCostByProject, 
        availableProjectsNames, 
        availableEntitiesNames 
    } = useMemo(() => {
        let totalCost = 0;
        const costByProject = {};

        timesheets.forEach(record => {
            // Cálculo de costes de mano de obra
            if (record && record.totalHours && record.ratePerHour) {
                const cost = record.totalHours * record.ratePerHour;
                totalCost += cost;
                
                const projectName = record.localName || 'General'; 
                costByProject[projectName] = (costByProject[projectName] || 0) + cost;
            }
        });

        // PREPARAR LISTAS DE NOMBRES (STRINGS) PARA EL CostDashboard
        const projectsNames = availableLocals.map(l => l.name).sort();
        const entitiesNames = availableEntityObjects.map(e => e.name).sort();

        return {
            timesheetTotalCost: totalCost, 
            timesheetTotalCostByProject: costByProject, 
            availableProjectsNames: projectsNames, 
            availableEntitiesNames: entitiesNames, 
        };
    }, [timesheets, availableLocals, availableEntityObjects]); 

    
    // --- Barra de Navegación de Vistas (Se mantiene igual) ---
    const ViewTabs = () => (
        <div className="flex justify-start mb-6 border-b border-gray-300">
            {/* ... (Botones de navegación de vistas) ... */}
            <button
                onClick={() => { setActiveView('home'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeView === 'home'
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                <FaHome className="text-lg"/> <span>Dashboard</span>
            </button>
            <button
                onClick={() => { setActiveView('costs'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeView === 'costs'
                        ? "border-blue-600 text-blue-600 font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                <FaEuroSign className="text-lg"/> <span>Costes</span>
            </button>
            <button
                onClick={() => { setActiveView('employee_management'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeView === 'employee_management'
                        ? "border-purple-600 text-purple-600 font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                <FaUserFriends className="text-lg"/> <span>Personal</span>
            </button>
            <button
                onClick={() => { setActiveView('management'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeView === 'management'
                    ? "border-purple-600 text-purple-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                <span role="img" aria-label="settings">⚙️</span> <span>Gestión</span>
            </button>
            <button
                onClick={() => { setActiveView('labor'); setNotification(null); }}
                className={`py-2 px-4 flex items-center space-x-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeView === 'labor'
                        ? "border-red-600 text-red-600 font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                <span role="img" aria-label="man">👨‍🌾</span> <span>Mano de Obra</span>
            </button>
        </div>
    );


    // --- Estado de Carga y Restricciones de Acceso ---
    if (loadingAuth || loadingData || loadingTimesheets || loadingWorkers) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-indigo-600 animate-pulse">
                    {loadingAuth 
                        ? "Cargando autenticación..." 
                        : loadingData 
                            ? "Cargando datos maestros (proyectos/entidades)..." 
                            : loadingWorkers
                                ? "Cargando lista de trabajadores..."
                                : "Cargando registros de trabajo..."}
                </p>
            </div>
        );
    }
    
    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-10 text-center bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-red-600 font-semibold mb-4">Acceso Denegado</p>
                    <p className="text-gray-600">Debe iniciar sesión para acceder al panel de gestión.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* Título y Navegación de Vistas */}
            <div className="p-4 sm:p-6 pb-0">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    {activeView === 'home' ? 'Gestión de Producción' : 'Análisis de Costes Empresarial'}
                </h1>
                <ViewTabs />
            </div>

            {/* MOSTRAR NOTIFICACIÓN */}
            {notification && (
                <div className={`mx-4 sm:mx-6 px-4 py-3 rounded relative mb-4
                    ${notification.type === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'}
                `}>
                    
                    <strong className="font-bold">
                        {notification.type === 'success' ? 'Éxito:' : 'Error de Base de Datos:'}
                    </strong>
                    
                    <span className="block sm:inline ml-2">{notification.message}</span>
                    
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
                        onClick={() => setNotification(null)}
                    >
                        ❌
                    </span>
                </div>
            )}

            {/* Renderizado de la Vista Activa */}
            {activeView === 'home' && (
                <HomeView 
                    {...restOfProps}
                    timesheets={timesheets} 
                /> 
            )}

            {activeView === 'costs' && (
                <div className="p-4 sm:p-6 pt-0">
                    <CostDashboard 
                        db={db}
                        userId={userId}
                        setErrorMessage={setNotification} 
                        errorMessage={notification} 
                        // 🚀 PROPS CORRECTAS PARA CostDashboard (listas de NOMBRES)
                        availableProjects={availableProjectsNames} // Lista de NOMBRES de proyectos
                        availableEntities={availableEntitiesNames} // Lista de NOMBRES de entidades
                        availableWorkers={availableWorkers}        // Lista de NOMBRES de trabajadores
                        timesheetTotalCost={timesheetTotalCost}
                        timesheetTotalCostByProject={timesheetTotalCostByProject}
                        availableLocals={availableLocals} // Se mantiene, por si CostDashboard necesita detalles (ej: superficie)
                    />
                </div>
            )}


            {activeView === 'management' && (
                <div className="p-4 sm:p-6 pt-0">
                    <EntityAndProjectManager 
                        db={db}
                        userId={userId}
                        setErrorMessage={setNotification} 
                        // PROPS CORRECTAS PARA EntityAndProjectManager (Objetos completos)
                        initialProjects={availableLocals} 
                        initialEntities={availableEntityObjects}
                    />
                </div>
            )}

            {activeView === 'employee_management' && (
                <div className="p-4 sm:p-6 pt-0">
                    <EmployeeManagement 
                        db={db}
                        userId={userId}
                        setErrorMessage={setNotification} 
                        // EmployeeManagement gestiona empleados, pero puede usar las entidades
                        availableEntities={availableEntityObjects} 
                    />
                </div>
            )}

            {activeView === 'labor' && ( // VISTA DE MANO DE OBRA
                <div className="p-4 sm:p-6 pt-0">
                    
                    {/* 🚀 1. WIZARD (FORMULARIO DE INGRESO) 🚀 */}
                    <div className="mb-8">
                        <TimeSheetWizard 
                            db={db}
                            userId={userId}
                            setErrorMessage={setNotification} 
                            // availableLocals (Objetos) para tener ID/tipo de cultivo
                            availableLocals={availableLocals} 
                            // availableWorkers (Nombres) para el select de trabajadores
                            availableWorkers={availableWorkers} 
                        />
                    </div>
                    
                    {/* 📊 2. DASHBOARD (VISUALIZADOR DE DATOS) 📊 */}
                    <SummaryCard timesheets={timesheets} /> 
                    
                    <div className="mt-6">
                        <LaborCostDashboardDisplay 
                            timesheets={timesheets} 
                            error={errorTimesheets}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default HomeContent;