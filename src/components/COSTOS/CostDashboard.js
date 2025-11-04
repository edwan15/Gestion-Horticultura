
// // src/components/COSTOS/CostDashboard.js

// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // 🚨 CORRECCIÓN 1: No importamos 'getFirestore' si la instancia 'db' ya se pasa como prop.
//     // getFirestore, 
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";

// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra",
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// // Función para obtener el ID de la aplicación, como lo tenías.
// const getAppId = () => {
//     // 🚨 NOTA: Asegúrate de que window.__app_id se define en tu entorno global si lo usas.
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: CostInputForm ---
// const CostInputForm = ({ db, userId, setErrorMessage, projects }) => {
//     const [newCost, setNewCost] = useState({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "",
//         category: COST_CATEGORIES[0], // Valor por defecto
//         project: projects.length > 0 ? projects[0] : "General", // Primer proyecto o General
//     });
//     const [isSaving, setIsSaving] = useState(false);

//     // Asegura que el proyecto seleccionado exista y se actualice si la lista de proyectos cambia.
//     useEffect(() => {
//         const defaultProject = projects.length > 0 ? projects[0] : "General";
        
//         setNewCost(prev => {
//             // Si no hay proyectos O el proyecto actual no está en la lista (y no es 'General'), actualiza.
//             if (projects.length === 0 && prev.project !== "General") {
//                 return { ...prev, project: "General" };
//             }
//             if (projects.length > 0 && !projects.includes(prev.project)) {
//                 return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });
//     }, [projects]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value, type } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             // 🚨 CORRECCIÓN 2: El 'amount' en el estado debe guardarse como string si no está completo para el input
//             [name]: value, 
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
        
//         // 🚨 CORRECCIÓN 3: Convertimos a número SÓLO antes de guardar en Firestore
//         const costAmount = parseFloat(newCost.amount); 
        
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount, // Guardamos el float
//                 category: newCost.category,
//                 project: newCost.project,
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto para registros rápidos
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     // Los estilos se basan en clases de Tailwind CSS, asumiendo que lo tienes configurado.
//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {COST_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X para Inv. 1"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {projects.length === 0 && <option value="General">General</option>}
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// // Ajustamos el Tooltip para usar el totalCost pasado como prop
// const CustomTooltip = ({ active, payload, totalCost }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         const percentage = (data.value / totalCost) * 100;
//         return (
//             <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                 <p className="font-bold text-gray-800">{data.name}</p>
//                 <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                 <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//             </div>
//         );
//     }
//     return null;
// };


// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//     // Formatea los datos para el gráfico de Pie
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0); // Solo incluye categorías con costes
//     }, [distributionData]);

//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                 📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40} // Agregado para un look de "donut"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         {/* 🚨 CORRECCIÓN 4: Pasamos totalCost al CustomTooltip */}
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} /> 
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ db, userId, setErrorMessage,errorMessage }) => {
//     const [costData, setCostData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // 1. Hook para cargar los datos de costes
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             if (!userId) {
//                 setErrorMessage("Autenticación requerida (userId no definido).");
//             }
//             return;
//         }

//         setErrorMessage(""); // Limpiar errores al iniciar la suscripción
//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         // La consulta solo trae los costes del usuario actual
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
                
//                 // Ordenar por fecha de creación descendente (el más reciente primero)
//                 costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes: " + error.message);
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Cálculo de métricas y resumen (Total, Distribución, Proyectos)
//     const { totalCost, distributionData, projects, costByProject } = useMemo(() => {
//         const total = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distribution = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const projectData = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         // Proyectos únicos para el formulario (usamos 'General' si la entrada es nula/undefined)
//         const uniqueProjects = [...new Set(costData.map(e => e.project || 'General'))].sort();

//         return { 
//             totalCost: total, 
//             distributionData: distribution,
//             projects: uniqueProjects,
//             costByProject: projectData,
//         };
//     }, [costData]);


//     // 3. Función para eliminar coste (para la tabla de historial)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             // 🚨 CORRECCIÓN 5: Usamos 'db' que ya es la instancia de Firestore, no getFirestore()
//             const docRef = doc(db, `artifacts/${appId}/public/data/costEntries`, costId); 
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
//                 <p className="text-gray-500 text-lg">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Generamos una lista ordenada de proyectos con su coste para la tabla (Card 2)
//     const projectSummaryArray = Object.entries(costByProject)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);

//     // Encuentra el coste más alto por proyecto para la barra de progreso
//     const maxProjectCost = projectSummaryArray.length > 0 ? projectSummaryArray[0].cost : 0;
    
//     // Obtiene el total de proyectos, entidades y trabajadores (Cards 1) - Dummy por ahora
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: projects.length, icon: "🏗️" },
//         { title: "Coste Total (€)", value: totalCost.toFixed(2), icon: "💶" },
//         { title: "Último Coste", value: costData.length > 0 ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
//         { title: "Registros", value: costData.length, icon: "📄" }, 
//     ];


//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
//                 Panel de Control de Costes 📈
//             </h1>

//             {/* Formulario de Ingreso de Costes */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={projects} 
//             />
            
//             {/* Mensaje de Error Global */}
//             {setErrorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//                     <span className="block sm:inline">{errorMessage}</span>

//                 </div>
//             )}

//             {/* Sección de Métricas Rápidas (Cards 1 & 3) */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-5 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
//                     >
//                         <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
//                         <p className="text-2xl font-extrabold text-gray-800 flex items-center">
//                             {card.icon} <span className="ml-2">{card.value}</span>
//                         </p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                 {/* Distribución de Costes (Card 5) - Izquierda */}
//                 <CostDistributionChartMemo 
//                     distributionData={distributionData} 
//                     totalCost={totalCost} 
//                 />
                
//                 {/* Costes por Proyecto/Cultivo (Card 2) - Derecha */}
//                 <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                         🌱 Costes Acumulados por Proyecto
//                     </h3>
//                     <div className="space-y-3 max-h-80 overflow-y-auto">
//                         {projectSummaryArray.length === 0 ? (
//                             <p className="text-gray-500 italic text-center py-4">No hay costes asociados a proyectos.</p>
//                         ) : (
//                             projectSummaryArray.map((item, index) => {
//                                 const percentage = maxProjectCost > 0 ? (item.cost / maxProjectCost) * 100 : 0;
//                                 return (
//                                     <div key={item.name} className="p-3 bg-white rounded-lg border border-gray-200 transition duration-150 hover:shadow-sm">
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
//                                             <span className="text-md font-bold text-indigo-700 ml-4">{item.cost.toFixed(2)}€</span>
//                                         </div>
//                                         {/* Barra de Progreso */}
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
//                                                 style={{ width: `${percentage}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 </section>
//             </div>

//             {/* Historial Detallado de Costes */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     📋 Historial de Registros de Costes
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes aún. ¡Empieza a registrar uno!
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-indigo-50/50 transition duration-100">
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
//                                                 {cost.category}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-indigo-700 font-semibold">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={cost.description}>
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-100"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export const CostDashboard = memo(CostDashboardComponent);




// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     getFirestore,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";

// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra",
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: CostInputForm ---
// // Este componente gestiona el formulario para añadir un nuevo coste.
// const CostInputForm = ({ db, userId, setErrorMessage, projects }) => {
    
//     // Función auxiliar para establecer el proyecto por defecto
//     const getDefaultProject = useCallback((currentProjects) => {
//         // Prioriza el primer proyecto de la lista, si no existe, usa "General".
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "",
//         category: COST_CATEGORIES[0],
//         project: getDefaultProject(projects), // Usa el proyecto inicial de la lista
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
            
//             // Si la lista de proyectos está vacía o el proyecto seleccionado no existe,
//             // volvemos al valor por defecto.
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value, type } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: type === "number" ? parseFloat(value) || "" : value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo el proyecto seleccionado
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto para registros rápidos
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             {COST_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X para Inv. 1"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             {/* Opciones de proyectos: lista maestra + opción "General" */}
//                             <option key="General" value="General">General</option>
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//     // Formatea los datos para el gráfico de Pie
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0); // Solo incluye categorías con costes
//     }, [distributionData]);

//     // Renderizado del Tooltip personalizado
//     const CustomTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             const percentage = (data.value / totalCost) * 100;
//             return (
//                 <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                     <p className="font-bold text-gray-800">{data.name}</p>
//                     <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                     <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//                 </div>
//             );
//         }
//         return null;
//     };


//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ db, userId, setErrorMessage, availableProjects = [] /* RECIBE LA LISTA MAESTRA */ }) => {
//     const [costData, setCostData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // 1. Hook para cargar los datos de costes
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             return;
//         }

//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
//                 // Ordenar por fecha descendente
//                 costs.sort((a, b) => new Date(b.date) - new Date(a.date));

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes.");
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Cálculo de métricas y resumen (Total, Distribución, Proyectos)
//     const { totalCost, distributionData, costByProject } = useMemo(() => {
//         const total = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distribution = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const projectData = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         return { 
//             totalCost: total, 
//             distributionData: distribution,
//             costByProject: projectData,
//         };
//     }, [costData]);


//     // 3. Función para eliminar coste (para la tabla de historial)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste?")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(getFirestore(), `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <p className="text-gray-500">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Generamos una lista ordenada de proyectos con su coste para la tabla (Card 2)
//     // Incluye proyectos con costes y los nuevos proyectos que aún no tienen costes (valor 0)
//     const projectSummaryMap = { ...costByProject };
//     availableProjects.forEach(proj => {
//         if (projectSummaryMap[proj] === undefined) {
//             projectSummaryMap[proj] = 0;
//         }
//     });

//     const projectSummaryArray = Object.entries(projectSummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);

//     // Encuentra el coste más alto por proyecto para la barra de progreso
//     const maxProjectCost = projectSummaryArray.length > 0 ? projectSummaryArray[0].cost : 0;
    
//     // Obtiene el total de proyectos, entidades y trabajadores (Cards 1)
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: availableProjects.length || 0, icon: "🏗️" },
//         { title: "Coste Total (€)", value: totalCost.toFixed(2), icon: "💶" },
//         { title: "Entidades/Fincas", value: 5, icon: "🏡" }, // Placeholder
//         { title: "Último Coste", value: costData[0] ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
//     ];


//     return (
//         <div className="space-y-8">
//             {/* Formulario de Ingreso de Costes: Pasa la lista de proyectos para el selector */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={availableProjects} 
//             />
            
//             {/* Sección de Métricas Rápidas (Cards 1 & 3) */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-4 rounded-xl shadow-lg border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
//                     >
//                         <p className="text-xl font-bold text-gray-800 flex items-center">
//                             {card.icon} {card.value}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1">{card.title}</p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Distribución de Costes (Card 5) - Izquierda */}
//                 <CostDistributionChartMemo distributionData={distributionData} totalCost={totalCost} />
                
//                 {/* Costes por Proyecto/Cultivo (Card 2) - Derecha */}
//                 <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                         Costes Acumulados por Proyecto
//                     </h3>
//                     <div className="space-y-3 max-h-80 overflow-y-auto">
//                         {projectSummaryArray.length === 0 ? (
//                             <p className="text-gray-500 italic">No hay costes asociados a proyectos.</p>
//                         ) : (
//                             projectSummaryArray.map((item) => {
//                                 const percentage = maxProjectCost > 0 ? (item.cost / maxProjectCost) * 100 : 0;
//                                 return (
//                                     <div key={item.name} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-sm font-medium text-gray-700">{item.name}</span>
//                                             <span className="text-md font-bold text-indigo-700">{item.cost.toFixed(2)}€</span>
//                                         </div>
//                                         {/* Barra de Progreso */}
//                                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                             <div 
//                                                 className="bg-indigo-400 h-2.5 rounded-full" 
//                                                 style={{ width: `${percentage}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 </section>
//             </div>

//             {/* Historial Detallado de Costes */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     Historial de Registros de Costes
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-gray-50">
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
//                                             {cost.category}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-indigo-600 font-medium">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-3 py-2 text-xs text-gray-700">
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-900 transition duration-150 p-1"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };
// export const CostDashboard = memo(CostDashboardComponent);



// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     getFirestore,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";
// import { FaEuroSign, FaSeedling, FaBuilding, FaUser, FaThLarge } from 'react-icons/fa';


// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra",
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: CostInputForm (CORREGIDO CON ENTIDADES) ---
// const CostInputForm = ({ db, userId, setErrorMessage, projects, entities }) => {
    
//     const getDefaultProject = useCallback((currentProjects) => {
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);
    
//     // 🟢 NUEVA FUNCIÓN AUXILIAR PARA ENTIDAD
//     const getDefaultEntity = useCallback((currentEntities) => {
//         return currentEntities.length > 0 ? currentEntities[0].name : "General";
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "",
//         category: COST_CATEGORIES[0],
//         project: getDefaultProject(projects),
//         // 🟢 NUEVO ESTADO DE ENTIDAD
//         entity: getDefaultEntity(entities), 
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     // 🟢 useEffect para asegurar que la entidad seleccionada sigue siendo válida o se actualiza
//     useEffect(() => {
//         const defaultEntity = getDefaultEntity(entities);
//         const entityNames = entities.map(e => e.name);

//         setNewCost(prev => {
//             const entityExists = entityNames.includes(prev.entity) || prev.entity === "General";
//             if (!entityExists) {
//                  return { ...prev, entity: defaultEntity };
//             }
//             return prev;
//         });

//     }, [entities, getDefaultEntity]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value, type } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: type === "number" ? parseFloat(value) || "" : value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 // 🟢 GUARDAR LA ENTIDAD SELECCIONADA
//                 entity: newCost.entity, 
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo el proyecto y la entidad seleccionados
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES[0],
//                 project: prev.project, 
//                 entity: prev.entity, // Mantiene la Entidad
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             {COST_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* 🟢 NUEVO: Asociar a Entidad (Empresa) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Entidad (Empresa):</label>
//                         <select
//                             name="entity"
//                             value={newCost.entity}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             <option key="General" value="General">General</option>
//                             {entities.map((ent) => (
//                                 <option key={ent.id} value={ent.name}>{ent.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             <option key="General" value="General">General</option>
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                     {/* Espacio reservado para Trabajador/Responsable (Opcional) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-400 mb-1">Trabajador/Responsable (Opcional)</label>
//                         <input
//                             type="text"
//                             disabled
//                             placeholder="En desarrollo..."
//                             className="w-full p-2 text-sm border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
//                         />
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// // (Mantenemos este componente sin cambios)
// const CostDistributionChart = ({ distributionData, totalCost }) => {
//     // ... (Tu código de PieChart aquí) ...
    
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0);
//     }, [distributionData]);

//     const CustomTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             const percentage = (data.value / totalCost) * 100;
//             return (
//                 <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                     <p className="font-bold text-gray-800">{data.name}</p>
//                     <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                     <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//                 </div>
//             );
//         }
//         return null;
//     };


//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Distribución de Costes por Categoría
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- SUB-COMPONENTE: CostSummaryTabs (NUEVO) ---
// const CostSummaryTabs = ({ 
//     activeTab, 
//     setActiveTab, 
//     costByProject, 
//     costByEntity,
//     totalCost,
//     distributionData,
//     availableProjects,
//     availableEntities // Ya viene como {id, name}
// }) => {

//     // --- Lógica para Proyectos (Cultivos) ---
//     const projectSummaryMap = { ...costByProject };
//     availableProjects.forEach(proj => {
//         if (projectSummaryMap[proj] === undefined) {
//             projectSummaryMap[proj] = 0;
//         }
//     });

//     const projectSummaryArray = Object.entries(projectSummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxProjectCost = projectSummaryArray.length > 0 ? projectSummaryArray[0].cost : 0;
//     const projectCount = availableProjects.length;

//     // --- Lógica para Entidades (Empresas) ---
//     const entitySummaryMap = { ...costByEntity };
//     availableEntities.forEach(ent => {
//         if (entitySummaryMap[ent.name] === undefined) {
//             entitySummaryMap[ent.name] = 0;
//         }
//     });

//     const entitySummaryArray = Object.entries(entitySummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxEntityCost = entitySummaryArray.length > 0 ? entitySummaryArray[0].cost : 0;
//     const entityCount = availableEntities.length;
//     const averageEntityCost = entityCount > 0 ? totalCost / entityCount : 0;


//     // --- Lógica para Categorías ---
//     const categorySummaryArray = Object.entries(distributionData)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxCategoryCost = categorySummaryArray.length > 0 ? categorySummaryArray[0].cost : 0;
//     const categoryCount = categorySummaryArray.length;
//     const averageCategoryCost = categoryCount > 0 ? totalCost / categoryCount : 0;

//     // Métricas Fijas (Adaptadas a tus capturas)
//     const fixedMetrics = [
//         { key: 'project', title: 'Cultivo', icon: <FaSeedling className="text-xl"/>, count: projectCount, data: projectSummaryArray },
//         { key: 'entity', title: 'Entidad', icon: <FaBuilding className="text-xl"/>, count: entityCount, data: entitySummaryArray },
//         { key: 'worker', title: 'Trabajador', icon: <FaUser className="text-xl"/>, count: 0, data: [] }, // Trabajador pendiente
//         { key: 'category', title: 'Categoría', icon: <FaThLarge className="text-xl"/>, count: categoryCount, data: categorySummaryArray },
//     ];
    
//     // Función de renderizado de la lista de costes por criterio (Entidad, Proyecto, Categoría)
//     const renderSummaryList = (data, maxCost) => {
//         if (data.length === 0) {
//             return (
//                 <div className="flex items-center justify-center h-24">
//                     <p className="text-gray-500 italic">No hay costes registrados para este criterio.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="space-y-3 max-h-80 overflow-y-auto mt-4">
//                 {data.map((item) => {
//                     const percentage = maxCost > 0 ? (item.cost / maxCost) * 100 : 0;
//                     return (
//                         <div key={item.name} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="flex justify-between items-center mb-1">
//                                 <span className="text-sm font-medium text-gray-700">{item.name}</span>
//                                 <span className="text-md font-bold text-indigo-700">{item.cost.toFixed(2)}€</span>
//                             </div>
//                             {/* Barra de Progreso */}
//                             <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                 <div 
//                                     className="bg-indigo-400 h-2.5 rounded-full" 
//                                     style={{ width: `${percentage}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     };

//     // Obtenemos los datos y el máximo del tab activo
//     const currentMetric = fixedMetrics.find(m => m.key === activeTab);
//     const currentData = currentMetric.data;
//     const currentMax = activeTab === 'project' ? maxProjectCost : activeTab === 'entity' ? maxEntityCost : maxCategoryCost;
//     const currentAverage = activeTab === 'project' ? 0 : activeTab === 'entity' ? averageEntityCost : averageCategoryCost;


//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex justify-between items-center">
//                 <span>Análisis Rápido de Costes</span>
//                 <span className="text-xs text-gray-500">Último mes</span>
//             </h3>

//             {/* Tarjetas de Métrica (Tabs) */}
//             <div className="grid grid-cols-4 gap-4 mb-6">
//                 {fixedMetrics.map((metric) => (
//                     <button
//                         key={metric.key}
//                         onClick={() => setActiveTab(metric.key)}
//                         className={`p-3 rounded-lg shadow-md transition-all duration-200 border-2 ${
//                             activeTab === metric.key 
//                                 ? 'bg-green-50 border-green-500 text-green-700' 
//                                 : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
//                         }`}
//                     >
//                         <div className="flex items-center justify-center mb-1 text-2xl">
//                             {metric.icon}
//                         </div>
//                         <p className="text-lg font-bold">{metric.count}</p>
//                         <p className="text-xs font-medium">{metric.title}</p>
//                     </button>
//                 ))}
//             </div>

//             {/* Contenido de la Lista Activa */}
//             <div className="mb-4">
//                 <h4 className="text-md font-bold text-gray-700 border-b pb-1 mb-2">
//                     {currentMetric.title} ({currentMetric.count})
//                 </h4>
//                 {renderSummaryList(currentData, currentMax)}
//             </div>

//             {/* Pie de Métricas */}
//             <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-200">
//                 <div className="text-sm font-medium text-gray-500">
//                     {currentMetric.title}s
//                     <div className="text-lg font-semibold text-gray-800">
//                          {/* Puedes añadir una métrica secundaria aquí */}
//                     </div>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-sm text-gray-500">Promedio {currentMetric.title}s</p>
//                     <p className="text-xl font-bold text-gray-800">{currentAverage.toFixed(2)} €</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-sm text-blue-500">• Total</p>
//                     <p className="text-2xl font-extrabold text-blue-700">{totalCost.toFixed(2)} €</p>
//                 </div>
//             </div>

//         </section>
//     );
// };
// const CostSummaryTabsMemo = memo(CostSummaryTabs);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ db, userId, setErrorMessage, availableProjects = [], availableEntities = [] }) => {
//     const [costData, setCostData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('project'); // Estado para la pestaña activa

//     // 1. Hook para cargar los datos de costes
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             return;
//         }

//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
//                 costs.sort((a, b) => new Date(b.date) - new Date(a.date));

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes.");
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Cálculo de métricas y resumen (Total, Distribución, Proyectos, 🟢 Entidades)
//     const { totalCost, distributionData, costByProject, costByEntity } = useMemo(() => {
//         const total = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distribution = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const projectData = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         // 🟢 CÁLCULO DE COSTES POR ENTIDAD
//         const entityData = costData.reduce((acc, entry) => {
//             // Aseguramos que se use el campo 'entity' que acabamos de agregar al guardar.
//             const entity = entry.entity || 'General'; 
//             acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         return { 
//             totalCost: total, 
//             distributionData: distribution,
//             costByProject: projectData,
//             costByEntity: entityData, // 🟢 Agregamos el resumen por Entidad
//         };
//     }, [costData]);


//     // 3. Función para eliminar coste
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste?")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(getFirestore(), `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <p className="text-gray-500">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Obtiene el total de proyectos, entidades y trabajadores (Cards rápidas)
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: availableProjects.length || 0, icon: "🏗️", color: "bg-indigo-50 border-indigo-500" },
//         { title: "Entidades Registradas", value: availableEntities.length || 0, icon: "🏭", color: "bg-green-50 border-green-500" },
//         { title: "Coste Total (€)", value: totalCost.toFixed(2), icon: "💶", color: "bg-red-50 border-red-500" },
//         { title: "Último Coste", value: costData[0] ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸", color: "bg-yellow-50 border-yellow-500" },
//     ];


//     return (
//         <div className="space-y-8">
//             {/* Formulario de Ingreso de Costes: Pasa ambas listas */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={availableProjects} 
//                 entities={availableEntities} // 🟢 Pasamos las Entidades
//             />
            
//             {/* Sección de Métricas Rápidas */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-4 rounded-xl shadow-lg border-l-4 ${card.color}`}
//                     >
//                         <p className="text-xl font-bold text-gray-800 flex items-center">
//                             {card.icon} {card.value}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1">{card.title}</p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* 🟢 NUEVO: Pestañas de Resumen (Cultivo, Entidad, Categoría) */}
//                 <CostSummaryTabsMemo 
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                     costByProject={costByProject}
//                     costByEntity={costByEntity}
//                     totalCost={totalCost}
//                     distributionData={distributionData}
//                     availableProjects={availableProjects}
//                     availableEntities={availableEntities}
//                 />
                
//                 {/* Distribución de Costes (Gráfico de Tarta) */}
//                 <CostDistributionChartMemo distributionData={distributionData} totalCost={totalCost} />
//             </div>

//             {/* Historial Detallado de Costes */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     Historial de Registros de Costes
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Entidad", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-gray-50">
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
//                                             {cost.category}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-indigo-600 font-medium">
//                                             {cost.project}
//                                         </td>
//                                         {/* 🟢 NUEVA COLUMNA DE ENTIDAD */}
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
//                                             {cost.entity}
//                                         </td>
//                                         <td className="px-3 py-2 text-xs text-gray-700">
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-900 transition duration-150 p-1"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };
// export const CostDashboard = memo(CostDashboardComponent);


// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     getFirestore,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";
// import { FaEuroSign, FaSeedling, FaBuilding, FaUser, FaThLarge } from 'react-icons/fa';


// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra",
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: CostInputForm (MODIFICADO CON TRABAJADORES) ---
// const CostInputForm = ({ db, userId, setErrorMessage, projects, entities, workers }) => {
    
//     const getDefaultProject = useCallback((currentProjects) => {
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);
    
//     const getDefaultEntity = useCallback((currentEntities) => {
//         return currentEntities.length > 0 ? currentEntities[0].name : "General";
//     }, []);
    
//     // 🟢 NUEVA FUNCIÓN AUXILIAR PARA TRABAJADOR
//     const getDefaultWorker = useCallback((currentWorkers) => {
//         return currentWorkers.length > 0 ? currentWorkers[0].name : "N/A"; 
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "",
//         category: COST_CATEGORIES[0],
//         project: getDefaultProject(projects),
//         entity: getDefaultEntity(entities), 
//         worker: getDefaultWorker(workers), // 🟢 NUEVO ESTADO DE TRABAJADOR
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     // useEffect para asegurar que la entidad seleccionada sigue siendo válida o se actualiza
//     useEffect(() => {
//         const defaultEntity = getDefaultEntity(entities);
//         const entityNames = entities.map(e => e.name);

//         setNewCost(prev => {
//             const entityExists = entityNames.includes(prev.entity) || prev.entity === "General";
//             if (!entityExists) {
//                  return { ...prev, entity: defaultEntity };
//             }
//             return prev;
//         });

//     }, [entities, getDefaultEntity]);

//     // 🟢 useEffect para asegurar que el trabajador seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultWorker = getDefaultWorker(workers);
//         const workerNames = workers.map(w => w.name);

//         setNewCost(prev => {
//             const workerExists = workerNames.includes(prev.worker) || prev.worker === "N/A";
//             if (!workerExists) {
//                 return { ...prev, worker: defaultWorker };
//             }
//             return prev;
//         });

//     }, [workers, getDefaultWorker]); // Dependencia de la lista de workers


//     const handleInputChange = useCallback((e) => {
//         const { name, value, type } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: type === "number" ? parseFloat(value) || "" : value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 entity: newCost.entity, 
//                 worker: newCost.worker, // 🟢 GUARDAR EL TRABAJADOR
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo project, entity y worker seleccionados
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES[0],
//                 project: prev.project, 
//                 entity: prev.entity, 
//                 worker: prev.worker, // Mantiene el Trabajador
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             {COST_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     {/* Asociar a Entidad (Empresa) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Entidad (Empresa):</label>
//                         <select
//                             name="entity"
//                             value={newCost.entity}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             <option key="General" value="General">General</option>
//                             {entities.map((ent) => (
//                                 <option key={ent.id} value={ent.name}>{ent.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             <option key="General" value="General">General</option>
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                     {/* 🟢 INPUT DE TRABAJADOR */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador/Responsable (Opcional):</label>
//                         <select
//                             name="worker"
//                             value={newCost.worker}
//                             onChange={handleInputChange}
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                         >
//                             <option key="N/A" value="N/A">N/A (No Asignado)</option>
//                             {workers.map((worker) => (
//                                 <option key={worker.id} value={worker.name}>{worker.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// const CostDistributionChart = ({ distributionData, totalCost }) => {
//     // ... (Tu código de PieChart aquí) ...
    
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0);
//     }, [distributionData]);

//     const CustomTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             const percentage = (data.value / totalCost) * 100;
//             return (
//                 <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                     <p className="font-bold text-gray-800">{data.name}</p>
//                     <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                     <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//                 </div>
//             );
//         }
//         return null;
//     };


//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 Distribución de Costes por Categoría
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- SUB-COMPONENTE: CostSummaryTabs (MODIFICADO CON TRABAJADORES) ---
// const CostSummaryTabs = ({ 
//     activeTab, 
//     setActiveTab, 
//     costByProject, 
//     costByEntity,
//     costByWorker,      // 🟢 NUEVO: Costes por Trabajador
//     totalCost,
//     distributionData,
//     availableProjects,
//     availableEntities,
//     availableWorkers // 🟢 NUEVO: Lista de trabajadores {id, name}
// }) => {

//     // --- Lógica para Proyectos (Cultivos) ---
//     const projectSummaryMap = { ...costByProject };
//     availableProjects.forEach(proj => {
//         if (projectSummaryMap[proj] === undefined) {
//             projectSummaryMap[proj] = 0;
//         }
//     });

//     const projectSummaryArray = Object.entries(projectSummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxProjectCost = projectSummaryArray.length > 0 ? projectSummaryArray[0].cost : 0;
//     const projectCount = availableProjects.length;

//     // --- Lógica para Entidades (Empresas) ---
//     const entitySummaryMap = { ...costByEntity };
//     availableEntities.forEach(ent => {
//         if (entitySummaryMap[ent.name] === undefined) {
//             entitySummaryMap[ent.name] = 0;
//         }
//     });

//     const entitySummaryArray = Object.entries(entitySummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxEntityCost = entitySummaryArray.length > 0 ? entitySummaryArray[0].cost : 0;
//     const entityCount = availableEntities.length;
//     const averageEntityCost = entityCount > 0 ? totalCost / entityCount : 0;


//     // 🟢 --- Lógica para Trabajadores ---
//     const workerSummaryMap = { ...costByWorker };
//     availableWorkers.forEach(worker => {
//         if (workerSummaryMap[worker.name] === undefined) {
//             workerSummaryMap[worker.name] = 0;
//         }
//     });

//     const workerSummaryArray = Object.entries(workerSummaryMap)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxWorkerCost = workerSummaryArray.length > 0 ? workerSummaryArray[0].cost : 0;
//     const workerCount = availableWorkers.length;
//     const averageWorkerCost = workerCount > 0 ? totalCost / workerCount : 0;


//     // --- Lógica para Categorías ---
//     const categorySummaryArray = Object.entries(distributionData)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);
//     const maxCategoryCost = categorySummaryArray.length > 0 ? categorySummaryArray[0].cost : 0;
//     const categoryCount = categorySummaryArray.length;
//     const averageCategoryCost = categoryCount > 0 ? totalCost / categoryCount : 0;

//     // Métricas Fijas (Adaptadas a tus capturas)
//     const fixedMetrics = [
//         { key: 'project', title: 'Cultivo', icon: <FaSeedling className="text-xl"/>, count: projectCount, data: projectSummaryArray, maxCost: maxProjectCost, averageCost: 0 },
//         { key: 'entity', title: 'Entidad', icon: <FaBuilding className="text-xl"/>, count: entityCount, data: entitySummaryArray, maxCost: maxEntityCost, averageCost: averageEntityCost },
//         // 🟢 TRABAJADOR AÑADIDO
//         { key: 'worker', title: 'Trabajador', icon: <FaUser className="text-xl"/>, count: workerCount, data: workerSummaryArray, maxCost: maxWorkerCost, averageCost: averageWorkerCost }, 
//         { key: 'category', title: 'Categoría', icon: <FaThLarge className="text-xl"/>, count: categoryCount, data: categorySummaryArray, maxCost: maxCategoryCost, averageCost: averageCategoryCost },
//     ];
    
//     // Función de renderizado de la lista de costes por criterio (Entidad, Proyecto, Categoría)
//     const renderSummaryList = (data, maxCost) => {
//         if (data.length === 0) {
//             return (
//                 <div className="flex items-center justify-center h-24">
//                     <p className="text-gray-500 italic">No hay costes registrados para este criterio.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="space-y-3 max-h-80 overflow-y-auto mt-4">
//                 {data.map((item) => {
//                     const percentage = maxCost > 0 ? (item.cost / maxCost) * 100 : 0;
//                     return (
//                         <div key={item.name} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="flex justify-between items-center mb-1">
//                                 <span className="text-sm font-medium text-gray-700">{item.name}</span>
//                                 <span className="text-md font-bold text-indigo-700">{item.cost.toFixed(2)}€</span>
//                             </div>
//                             {/* Barra de Progreso */}
//                             <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                 <div 
//                                     className="bg-indigo-400 h-2.5 rounded-full" 
//                                     style={{ width: `${percentage}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     };

//     // Obtenemos los datos y el máximo del tab activo
//     const currentMetric = fixedMetrics.find(m => m.key === activeTab);
//     const currentData = currentMetric.data;
//     const currentMax = currentMetric.maxCost;
//     const currentAverage = currentMetric.averageCost;

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex justify-between items-center">
//                 <span>Análisis Rápido de Costes</span>
//                 <span className="text-xs text-gray-500">Último mes</span>
//             </h3>

//             {/* Tarjetas de Métrica (Tabs) */}
//             <div className="grid grid-cols-4 gap-4 mb-6">
//                 {fixedMetrics.map((metric) => (
//                     <button
//                         key={metric.key}
//                         onClick={() => setActiveTab(metric.key)}
//                         className={`p-3 rounded-lg shadow-md transition-all duration-200 border-2 ${
//                             activeTab === metric.key 
//                                 ? 'bg-green-50 border-green-500 text-green-700' 
//                                 : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
//                         }`}
//                     >
//                         <div className="flex items-center justify-center mb-1 text-2xl">
//                             {metric.icon}
//                         </div>
//                         <p className="text-lg font-bold">{metric.count}</p>
//                         <p className="text-xs font-medium">{metric.title}</p>
//                     </button>
//                 ))}
//             </div>

//             {/* Contenido de la Lista Activa */}
//             <div className="mb-4">
//                 <h4 className="text-md font-bold text-gray-700 border-b pb-1 mb-2">
//                     {currentMetric.title} ({currentMetric.count})
//                 </h4>
//                 {renderSummaryList(currentData, currentMax)}
//             </div>

//             {/* Pie de Métricas */}
//             <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-200">
//                 <div className="text-sm font-medium text-gray-500">
//                     {currentMetric.title}s
//                     <div className="text-lg font-semibold text-gray-800">
//                          {/* Puedes añadir una métrica secundaria aquí */}
//                     </div>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-sm text-gray-500">Promedio {currentMetric.title}s</p>
//                     <p className="text-xl font-bold text-gray-800">{currentAverage.toFixed(2)} €</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-sm text-blue-500">• Total</p>
//                     <p className="text-2xl font-extrabold text-blue-700">{totalCost.toFixed(2)} €</p>
//                 </div>
//             </div>

//         </section>
//     );
// };
// const CostSummaryTabsMemo = memo(CostSummaryTabs);


// // --- COMPONENTE PRINCIPAL: CostDashboard (MODIFICADO CON TRABAJADORES) ---
// const CostDashboardComponent = ({ db, userId, setErrorMessage, availableProjects = [], availableEntities = [] }) => {
//     const [costData, setCostData] = useState([]);
//     const [workers, setWorkers] = useState([]); // 🟢 NUEVO: Estado para trabajadores
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('project'); // Estado para la pestaña activa

//     // 1. Hook para cargar los datos de costes (Existente)
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             return;
//         }

//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
//                 costs.sort((a, b) => new Date(b.date) - new Date(a.date));

//                 setCostData(costs);
//                 // NOTA: No desactivamos isLoading aquí, sino después de cargar *todos* los datos.
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes.");
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);

//     // 🟢 2. Hook para cargar la lista de Trabajadores
//     useEffect(() => {
//         if (!db || !userId) return;

//         // Asume que la colección de trabajadores está en /artifacts/{appId}/public/data/workers
//         const workersPath = `artifacts/${appId}/public/data/workers`; 
//         const workersCollection = collection(db, workersPath);

//         const unsubscribeWorkers = onSnapshot(query(workersCollection), (snapshot) => {
//             const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setWorkers(list);
//             setIsLoading(false); // 🟢 Desactivamos la carga aquí si este es el último dato necesario.
//         }, (error) => {
//             console.error("Error loading workers:", error);
//             setErrorMessage("Error al cargar la lista de trabajadores.");
//             setIsLoading(false);
//         });
        
//         return () => unsubscribeWorkers();
//     }, [db, userId, setErrorMessage]);


//     // 3. Cálculo de métricas y resumen (Total, Distribución, Proyectos, Entidades, Trabajadores)
//     const { totalCost, distributionData, costByProject, costByEntity, costByWorker } = useMemo(() => {
//         const total = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distribution = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const projectData = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         const entityData = costData.reduce((acc, entry) => {
//             const entity = entry.entity || 'General'; 
//             acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         // 🟢 CÁLCULO DE COSTES POR TRABAJADOR
//         const workerData = costData.reduce((acc, entry) => {
//             const worker = entry.worker || 'N/A'; // Usa 'N/A' si no está asignado
//             acc[worker] = (acc[worker] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
//         return { 
//             totalCost: total, 
//             distributionData: distribution,
//             costByProject: projectData,
//             costByEntity: entityData,
//             costByWorker: workerData, // 🟢 Nuevo resumen
//         };
//     }, [costData]);


//     // 4. Función para eliminar coste (Existente)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste?")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(getFirestore(), `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48">
//                 <p className="text-gray-500">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Obtiene el total de proyectos, entidades y trabajadores (Cards rápidas)
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: availableProjects.length || 0, icon: "🏗️", color: "bg-indigo-50 border-indigo-500" },
//         { title: "Entidades Registradas", value: availableEntities.length || 0, icon: "🏭", color: "bg-green-50 border-green-500" },
//         { title: "Trabajadores Registrados", value: workers.length || 0, icon: "👤", color: "bg-purple-50 border-purple-500" }, // 🟢 Nueva tarjeta
//         { title: "Coste Total (€)", value: totalCost.toFixed(2), icon: "💶", color: "bg-red-50 border-red-500" },
//     ];


//     return (
//         <div className="space-y-8">
//             {/* Formulario de Ingreso de Costes: Pasa ambas listas */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={availableProjects} 
//                 entities={availableEntities} 
//                 workers={workers} // 🟢 Pasamos la lista de Trabajadores
//             />
            
//             {/* Sección de Métricas Rápidas */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-4 rounded-xl shadow-lg border-l-4 ${card.color}`}
//                     >
//                         <p className="text-xl font-bold text-gray-800 flex items-center">
//                             {card.icon} {card.title.includes('Coste') ? card.value : card.value}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1">{card.title}</p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* Pestañas de Resumen (Cultivo, Entidad, Categoría, Trabajador) */}
//                 <CostSummaryTabsMemo 
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                     costByProject={costByProject}
//                     costByEntity={costByEntity}
//                     costByWorker={costByWorker} // 🟢 Nuevo
//                     totalCost={totalCost}
//                     distributionData={distributionData}
//                     availableProjects={availableProjects}
//                     availableEntities={availableEntities}
//                     availableWorkers={workers} // 🟢 Nuevo
//                 />
                
//                 {/* Distribución de Costes (Gráfico de Tarta) */}
//                 <CostDistributionChartMemo distributionData={distributionData} totalCost={totalCost} />
//             </div>

//             {/* Historial Detallado de Costes */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     Historial de Registros de Costes
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 {/* 🟢 AGREGADA COLUMNA "Trabajador" */}
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Entidad", "Trabajador", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="8" className="px-3 py-4 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-gray-50">
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
//                                             {cost.category}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-indigo-600 font-medium">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
//                                             {cost.entity}
//                                         </td>
//                                         {/* 🟢 CELDA TRABAJADOR */}
//                                         <td className="px-3 py-2 whitespace-nowrap text-xs text-purple-600 font-medium">
//                                             {cost.worker || 'N/A'}
//                                         </td>
//                                         <td className="px-3 py-2 text-xs text-gray-700">
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-900 transition duration-150 p-1"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };
// export const CostDashboard = memo(CostDashboardComponent);




// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // Importaciones de Firebase Firestore necesarias
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";
// import { FaEuroSign } from "react-icons/fa"; // Usamos un icono para consistencia

// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra", // Categoría clave para los costes de timesheets
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// // Función para obtener el ID de la aplicación, como lo tenías.
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: CostInputForm ---
// // Este componente gestiona el formulario para añadir un nuevo coste.
// const CostInputForm = ({ db, userId, setErrorMessage, projects }) => {
    
//     // Función auxiliar para establecer el proyecto por defecto
//     const getDefaultProject = useCallback((currentProjects) => {
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "", // Mantenido como string para la entrada del formulario
//         category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
//         project: getDefaultProject(projects),
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
            
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo el proyecto seleccionado
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto para registros rápidos
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste Manual
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Excluimos "Mano de Obra" para evitar duplicidad, ya se calcula auto */}
//                             {COST_CATEGORIES.filter(c => c !== "Mano de Obra").map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Proyectos combinados (manuales + mano de obra) */}
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// const CustomTooltip = ({ active, payload, totalCost }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         const percentage = (data.value / totalCost) * 100;
//         return (
//             <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                 <p className="font-bold text-gray-800">{data.name}</p>
//                 <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                 <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//             </div>
//         );
//     }
//     return null;
// };


// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//     // Formatea los datos para el gráfico de Pie
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0); // Solo incluye categorías con costes
//     }, [distributionData]);

//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                 📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40} 
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ 
//     db, 
//     userId, 
//     setErrorMessage, 
//     errorMessage, 
//     // 💡 Props necesarias para integrar costes de mano de obra
//     timesheetTotalCostByProject = {}, 
//     timesheetTotalCost = 0, 
// }) => {
//     const [costData, setCostData] = useState([]); // Costes manuales de Firestore
//     const [isLoading, setIsLoading] = useState(true);

//     // 1. Hook para cargar los datos de costes (se mantiene igual)
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             if (!userId) {
//                 setErrorMessage("Autenticación requerida (userId no definido).");
//             }
//             return;
//         }

//         setErrorMessage("");
//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
                
//                 costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes: " + error.message);
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Cálculo de métricas y resumen (MODIFICADO PARA COMBINAR COSTES)
//     const { 
//         totalCostCombined, 
//         distributionDataCombined, 
//         projectsCombined, 
//         costByProjectCombined 
//     } = useMemo(() => {
        
//         // --- A. Calcular Costes Manuales (Firestore) ---
//         const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distributionManual = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByProjectManual = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
        
//         // --- B. Combinar con Costes de Timesheets (Mano de Obra) ---
        
//         // 1. Coste Total Combinado
//         const totalCombined = totalManual + timesheetTotalCost;
        
//         // 2. Coste por Proyecto Combinado
//         const combinedProjectCosts = { ...costByProjectManual };
        
//         Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
//             if (cost > 0) {
//                 // Sumar el coste de la hoja de tiempo al proyecto existente, o inicializarlo
//                 combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
//             }
//         });
        
//         // 3. Distribución Combinada
//         const combinedDistribution = { ...distributionManual };
        
//         // El coste de los timesheets siempre va a 'Mano de Obra'
//         combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;
        
        
//         // 4. Proyectos Combinados (para el formulario)
//         const uniqueProjectsManual = new Set(costData.map(e => e.project || 'General'));
//         const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
//         const allProjects = new Set([...uniqueProjectsManual, ...uniqueProjectsTimesheet]);
        
//         const projects = Array.from(allProjects).sort();

//         return { 
//             totalCostCombined: totalCombined, 
//             distributionDataCombined: combinedDistribution,
//             projectsCombined: projects,
//             costByProjectCombined: combinedProjectCosts,
//         };
//     }, [costData, timesheetTotalCost, timesheetTotalCostByProject]);


//     // 3. Función para eliminar coste (se mantiene igual)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(db, `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
//                 <p className="text-gray-500 text-lg">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Generamos una lista ordenada de proyectos con su coste para la tabla (Card 2)
//     const projectSummaryArray = Object.entries(costByProjectCombined)
//         .map(([name, cost]) => ({ name, cost }))
//         .sort((a, b) => b.cost - a.cost);

//     const maxProjectCost = projectSummaryArray.length > 0 ? projectSummaryArray[0].cost : 0;
    
//     // Obtiene el total de proyectos, entidades y trabajadores (Cards 1)
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: projectsCombined.length, icon: "🏗️" },
//         { title: "Coste TOTAL (€)", value: totalCostCombined.toFixed(2), icon: "💶" },
//         { title: "Último Coste Manual", value: costData.length > 0 ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
//         { title: "Registros Manuales", value: costData.length, icon: "📄" }, 
//     ];


//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
//                 Panel de Control de Costes 📈
//             </h1>

//             {/* Formulario de Ingreso de Costes */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={projectsCombined} // Usamos la lista COMBINADA de proyectos
//             />
            
//             {/* Mensaje de Error Global */}
//             {errorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//                     <span className="block sm:inline">{errorMessage}</span>
//                 </div>
//             )}

//             {/* Sección de Métricas Rápidas (Cards 1 & 3) */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-5 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
//                     >
//                         <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
//                         <p className="text-2xl font-extrabold text-gray-800 flex items-center">
//                             {card.icon} <span className="ml-2">{card.value}</span>
//                         </p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                 {/* Distribución de Costes (Card 5) - Izquierda */}
//                 <CostDistributionChartMemo 
//                     distributionData={distributionDataCombined} // DATOS COMBINADOS
//                     totalCost={totalCostCombined} // TOTAL COMBINADO
//                 />
                
//                 {/* Costes por Proyecto/Cultivo (Card 2) - Derecha */}
//                 <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                         🌱 Costes Acumulados por Proyecto
//                     </h3>
//                     <div className="space-y-3 max-h-80 overflow-y-auto">
//                         {projectSummaryArray.length === 0 && totalCostCombined === 0 ? (
//                             <p className="text-gray-500 italic text-center py-4">No hay costes asociados a proyectos.</p>
//                         ) : (
//                             projectSummaryArray.map((item, index) => {
//                                 const percentage = maxProjectCost > 0 ? (item.cost / maxProjectCost) * 100 : 0;
//                                 return (
//                                     <div key={item.name} className="p-3 bg-white rounded-lg border border-gray-200 transition duration-150 hover:shadow-sm">
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
//                                             <span className="text-md font-bold text-indigo-700 ml-4 flex items-center">
//                                                 <FaEuroSign className='text-sm mr-1'/> {item.cost.toFixed(2)}
//                                             </span>
//                                         </div>
//                                         {/* Barra de Progreso */}
//                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
//                                                 style={{ width: `${percentage}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 </section>
//             </div>

//             {/* Historial Detallado de Costes (Solo los manuales de Firestore) */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     📋 Historial de Registros de Costes MANUALES
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes manuales aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-indigo-50/50 transition duration-100">
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
//                                                 {cost.category}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-indigo-700 font-semibold">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={cost.description}>
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-100"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export const CostDashboard = memo(CostDashboardComponent);









// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // Importaciones de Firebase Firestore necesarias
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";
// // 🚨 Importamos FaChartBar, FaRulerCombined y FaSeedling para el nuevo componente
// import { FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling } from "react-icons/fa"; 


// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra", // Categoría clave para los costes de timesheets
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// // Función para obtener el ID de la aplicación, como lo tenías.
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- NUEVO SUB-COMPONENTE: ProjectCostSummaryCard (Card 2 Profesional) ---
// const BAR_COLOR = 'bg-indigo-600';

// /**
//  * Muestra un listado profesional de costes por proyecto/cultivo con barra de progreso
//  * y la métrica de coste por hectárea (€/ha).
//  */
// const ProjectCostSummaryCard = ({ costByProjectCombined, totalCostCombined, availableLocals = [] }) => {
    
//     // Convertir la lista de locales (proyectos) en un mapa para acceso rápido a la superficie
//     const projectSurfaceMap = useMemo(() => {
//         return availableLocals.reduce((acc, local) => {
//             // Asumo que 'local.surfaceArea' contiene el valor en hectáreas.
//             acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1; 
//             return acc;
//         }, { 'General': 1 }); // 'General' tendrá 1 como área para evitar NaN
//     }, [availableLocals]);

//     // Procesa y ordena los datos para la visualización
//     const projectSummaryArray = useMemo(() => {
//         if (totalCostCombined === 0) return [];
        
//         const projects = Object.entries(costByProjectCombined)
//             .map(([name, cost]) => {
//                 const surfaceArea = projectSurfaceMap[name] || 1; 
//                 const costPerHectare = cost / surfaceArea; 

//                 return { 
//                     name, 
//                     cost,
//                     costPerHectare: costPerHectare,
//                     percentageOfTotal: (cost / totalCostCombined) * 100,
//                     isGeneral: name === 'General',
//                 };
//             })
//             .filter(item => item.cost > 0) 
//             .sort((a, b) => b.cost - a.cost); 

//         return projects;
//     }, [costByProjectCombined, totalCostCombined, projectSurfaceMap]);

//     const averageProjectCost = projectSummaryArray.length > 0 
//         ? totalCostCombined / projectSummaryArray.length 
//         : 0;


//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
//                 <FaSeedling className="mr-3 text-2xl text-green-600"/> 
//                 Detalle de Costes por Cultivo/Proyecto
//             </h3>

//             <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
                
//                 {totalCostCombined === 0 ? (
//                     <div className="flex items-center justify-center h-full min-h-[200px]">
//                         <p className="text-gray-500 italic text-lg">
//                             No hay costes registrados para proyectos.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {projectSummaryArray.map((item) => {
//                             const { name, cost, costPerHectare, percentageOfTotal, isGeneral } = item;
                            
//                             return (
//                                 <div 
//                                     key={name} 
//                                     className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
//                                 >
//                                     {/* Métrica /ha (al estilo de tu imagen) */}
//                                     <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
//                                         <FaRulerCombined className='mr-1 text-xs text-gray-400'/> 
//                                         <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
//                                         {/* Solo mostramos €/ha si no es el proyecto 'General' */}
//                                         {!isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
//                                     </p>

//                                     {/* Barra y Coste Total */}
//                                     <div className="flex items-center justify-between">
                                        
//                                         {/* Barra de Progreso */}
//                                         <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`} 
//                                                 style={{ width: `${percentageOfTotal}%` }}
//                                             ></div>
//                                         </div>
                                        
//                                         {/* Coste Total y Porcentaje */}
//                                         <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
//                                             {cost.toFixed(2)} € 
//                                             <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* Pie de Página con Totales (como en tu imagen) */}
//             {totalCostCombined > 0 && (
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between text-sm font-semibold text-gray-700">
//                         <span className='text-gray-500'>Promedio por Proyectos</span>
//                         <span className='text-indigo-700 font-extrabold'>
//                             {averageProjectCost.toFixed(2)} €
//                         </span>
//                     </div>
//                     <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
//                         <span className='mr-2 text-sm text-gray-600'>Total Global</span>
//                         <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };
// const ProjectCostSummaryCardMemo = memo(ProjectCostSummaryCard);


// // --- SUB-COMPONENTE: CostInputForm ---
// // Este componente gestiona el formulario para añadir un nuevo coste.
// const CostInputForm = ({ db, userId, setErrorMessage, projects }) => {
    
//     // Función auxiliar para establecer el proyecto por defecto
//     const getDefaultProject = useCallback((currentProjects) => {
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "", // Mantenido como string para la entrada del formulario
//         category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
//         project: getDefaultProject(projects),
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
            
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo el proyecto seleccionado
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto para registros rápidos
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste Manual
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Excluimos "Mano de Obra" para evitar duplicidad, ya se calcula auto */}
//                             {COST_CATEGORIES.filter(c => c !== "Mano de Obra").map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Proyectos combinados (manuales + mano de obra) */}
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// const CustomTooltip = ({ active, payload, totalCost }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         const percentage = (data.value / totalCost) * 100;
//         return (
//             <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                 <p className="font-bold text-gray-800">{data.name}</p>
//                 <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                 <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//             </div>
//         );
//     }
//     return null;
// };


// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//     // Formatea los datos para el gráfico de Pie
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0); // Solo incluye categorías con costes
//     }, [distributionData]);

//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                 📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40} 
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ 
//     db, 
//     userId, 
//     setErrorMessage, 
//     errorMessage, 
//     // Props necesarias para integrar costes de mano de obra
//     timesheetTotalCostByProject = {}, 
//     timesheetTotalCost = 0, 
//     // 💡 NUEVA PROP: Necesaria para el cálculo de €/ha en el nuevo componente
//     availableLocals = [], 
// }) => {
//     const [costData, setCostData] = useState([]); // Costes manuales de Firestore
//     const [isLoading, setIsLoading] = useState(true);

//     // 1. Hook para cargar los datos de costes (se mantiene igual)
//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             if (!userId) {
//                 setErrorMessage("Autenticación requerida (userId no definido).");
//             }
//             return;
//         }

//         setErrorMessage("");
//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
                
//                 costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes: " + error.message);
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     // 2. Cálculo de métricas y resumen (COMBINADO)
//     const { 
//         totalCostCombined, 
//         distributionDataCombined, 
//         projectsCombined, 
//         costByProjectCombined 
//     } = useMemo(() => {
        
//         // --- A. Calcular Costes Manuales (Firestore) ---
//         const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distributionManual = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByProjectManual = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
        
//         // --- B. Combinar con Costes de Timesheets (Mano de Obra) ---
        
//         // 1. Coste Total Combinado
//         const totalCombined = totalManual + timesheetTotalCost;
        
//         // 2. Coste por Proyecto Combinado
//         const combinedProjectCosts = { ...costByProjectManual };
        
//         Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
//             if (cost > 0) {
//                 // Sumar el coste de la hoja de tiempo al proyecto existente, o inicializarlo
//                 combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
//             }
//         });
        
//         // 3. Distribución Combinada
//         const combinedDistribution = { ...distributionManual };
        
//         // El coste de los timesheets siempre va a 'Mano de Obra'
//         combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;
        
        
//         // 4. Proyectos Combinados (para el formulario)
//         const uniqueProjectsManual = new Set(costData.map(e => e.project || 'General'));
//         const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
//         const allProjects = new Set([...uniqueProjectsManual, ...uniqueProjectsTimesheet]);
        
//         const projects = Array.from(allProjects).sort();

//         return { 
//             totalCostCombined: totalCombined, 
//             distributionDataCombined: combinedDistribution,
//             projectsCombined: projects,
//             costByProjectCombined: combinedProjectCosts,
//         };
//     }, [costData, timesheetTotalCost, timesheetTotalCostByProject]);


//     // 3. Función para eliminar coste (se mantiene igual)
//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(db, `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
//                 <p className="text-gray-500 text-lg">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     // Las variables auxiliares para la vieja card 2 se han eliminado ya que no se usan

//     const metricCardsData = [
//         { title: "Proyectos Activos", value: projectsCombined.length, icon: "🏗️" },
//         { title: "Coste TOTAL (€)", value: totalCostCombined.toFixed(2), icon: "💶" },
//         { title: "Último Coste Manual", value: costData.length > 0 ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
//         { title: "Registros Manuales", value: costData.length, icon: "📄" }, 
//     ];


//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
//                 Panel de Control de Costes 📈
//             </h1>

//             {/* Formulario de Ingreso de Costes */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={projectsCombined} 
//             />
            
//             {/* Mensaje de Error Global */}
//             {errorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//                     <span className="block sm:inline">{errorMessage}</span>
//                 </div>
//             )}

//             {/* Sección de Métricas Rápidas (Cards 1 & 3) */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-5 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
//                     >
//                         <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
//                         <p className="text-2xl font-extrabold text-gray-800 flex items-center">
//                             {card.icon} <span className="ml-2">{card.value}</span>
//                         </p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                 {/* Distribución de Costes (Card 5) - Izquierda */}
//                 <CostDistributionChartMemo 
//                     distributionData={distributionDataCombined}
//                     totalCost={totalCostCombined}
//                 />
                
//                 {/* 🚀 NUEVA CARD DE RESUMEN DE PROYECTOS (Card 2) - Derecha 🚀 */}
//                 {/* Reemplaza el bloque anterior de la Card 2 */}
//                 <ProjectCostSummaryCardMemo
//                     costByProjectCombined={costByProjectCombined}
//                     totalCostCombined={totalCostCombined}
//                     availableLocals={availableLocals} 
//                 />
//             </div>

//             {/* Historial Detallado de Costes (Solo los manuales de Firestore) */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     📋 Historial de Registros de Costes MANUALES
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes manuales aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-indigo-50/50 transition duration-100">
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
//                                                 {cost.category}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-indigo-700 font-semibold">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={cost.description}>
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-100"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export const CostDashboard = memo(CostDashboardComponent);




// import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import {
//     // Importaciones de Firebase Firestore necesarias
//     collection,
//     query,
//     onSnapshot,
//     addDoc,
//     serverTimestamp,
//     where,
//     deleteDoc,
//     doc,
// } from "firebase/firestore";
// // 🚨 Importamos todos los iconos necesarios para las tabs y cards
// import { 
//     FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling, 
//     FaBuilding, FaUserTie, FaTags // Iconos para Entidad, Trabajador, Categoría
// } from "react-icons/fa"; 


// // Definimos los tipos de caja que ya usas y sus categorías de coste
// const COST_CATEGORIES = [
//     "Mano de Obra", // Categoría clave para los costes de timesheets
//     "Productos",
//     "Equipo",
//     "Servicios",
//     "Otros",
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// // Función para obtener el ID de la aplicación, como lo tenías.
// const getAppId = () => {
//     if (typeof window.__app_id !== "undefined") {
//         return window.__app_id;
//     }
//     return "default-calendar-app-id";
// };
// const appId = getAppId();


// // --- SUB-COMPONENTE: GeneralSummaryCard (Ahora es más genérico) ---
// const BAR_COLOR = 'bg-indigo-600';

// /**
//  * Componente genérico para mostrar un resumen de costes por una dimensión (Proyecto, Entidad, Categoría, Trabajador).
//  * Recibe un array de items con { name, cost, ...otrasProps }
//  * Puede mostrar €/ha si se le pasa 'surfaceAreaMap' y 'showCostPerHectare'.
//  */
// const GeneralSummaryCard = ({ 
//     title, 
//     icon: CardIcon, 
//     dataArray, 
//     totalCostCombined, 
//     averageLabel,
//     showCostPerHectare = false, 
//     surfaceAreaMap = {}, // Solo si showCostPerHectare es true
//     emptyMessage = "No hay costes registrados.",
//     renderItemExtra = null // Función para renderizar contenido extra por item
// }) => {
    
//     // Calcula el coste promedio
//     const averageCost = dataArray.length > 0 
//         ? totalCostCombined / dataArray.length 
//         : 0;

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
//                 {CardIcon && <CardIcon className="mr-3 text-2xl text-green-600"/>} 
//                 {title}
//             </h3>

//             <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
                
//                 {dataArray.length === 0 ? (
//                     <div className="flex items-center justify-center h-full min-h-[200px]">
//                         <p className="text-gray-500 italic text-lg">
//                             {emptyMessage}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {dataArray.map((item) => {
//                             const { name, cost, percentageOfTotal, isGeneral } = item;
                            
//                             // Calcula coste por hectárea si aplica
//                             const surfaceArea = showCostPerHectare ? (surfaceAreaMap[name] || 1) : 1; 
//                             const costPerHectare = showCostPerHectare ? (cost / surfaceArea) : 0;

//                             return (
//                                 <div 
//                                     key={name} 
//                                     className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
//                                 >
//                                     <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
//                                         {showCostPerHectare && <FaRulerCombined className='mr-1 text-xs text-gray-400'/>} 
//                                         <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
//                                         {showCostPerHectare && !isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
//                                         {renderItemExtra && renderItemExtra(item)}
//                                     </p>

//                                     <div className="flex items-center justify-between">
//                                         <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
//                                             <div 
//                                                 className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`} 
//                                                 style={{ width: `${percentageOfTotal}%` }}
//                                             ></div>
//                                         </div>
//                                         <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
//                                             {cost.toFixed(2)} € 
//                                             <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {totalCostCombined > 0 && (
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                     <div className="flex justify-between text-sm font-semibold text-gray-700">
//                         <span className='text-gray-500'>Promedio {averageLabel}</span>
//                         <span className='text-indigo-700 font-extrabold'>
//                             {averageCost.toFixed(2)} €
//                         </span>
//                     </div>
//                     <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
//                         <span className='mr-2 text-sm text-gray-600'>Total Global</span>
//                         <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };
// const GeneralSummaryCardMemo = memo(GeneralSummaryCard);


// // --- NUEVO SUB-COMPONENTE: CostSummaryTabs ---
// const CostSummaryTabs = ({ 
//     costByProjectCombined, 
//     costByEntityCombined, // Nueva prop
//     costByWorkerCombined, // Nueva prop
//     distributionDataCombined, // Para categorías
//     totalCostCombined, 
//     availableLocals 
// }) => {
//     const [activeTab, setActiveTab] = useState('project'); // 'project', 'entity', 'worker', 'category'

//     // Mapa de superficie para proyectos (se pasa a GeneralSummaryCard)
//     const projectSurfaceMap = useMemo(() => {
//         return availableLocals.reduce((acc, local) => {
//             acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1; 
//             return acc;
//         }, { 'General': 1 });
//     }, [availableLocals]);

//     // Preprocesar datos para cada pestaña usando GeneralSummaryCard
//     const processDataForSummaryCard = useCallback((dataObject, currentTotalCost) => {
//         if (currentTotalCost === 0) return [];
//         return Object.entries(dataObject)
//             .map(([name, cost]) => ({
//                 name, 
//                 cost,
//                 percentageOfTotal: (cost / currentTotalCost) * 100,
//                 isGeneral: name === 'General',
//             }))
//             .filter(item => item.cost > 0)
//             .sort((a, b) => b.cost - a.cost);
//     }, []);

//     const projectDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByProjectCombined, totalCostCombined), 
//         [costByProjectCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const entityDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByEntityCombined, totalCostCombined), 
//         [costByEntityCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     const workerDataForCard = useMemo(() => 
//         processDataForSummaryCard(costByWorkerCombined, totalCostCombined), 
//         [costByWorkerCombined, totalCostCombined, processDataForSummaryCard]
//     );

//     // Para la categoría, distributionDataCombined ya está casi listo
//     const categoryDataForCard = useMemo(() => 
//         processDataForSummaryCard(distributionDataCombined, totalCostCombined), 
//         [distributionDataCombined, totalCostCombined, processDataForSummaryCard]
//     );


//     // Renderizado condicional del contenido de la pestaña
//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'project':
//                 return (
//                     <GeneralSummaryCard
//                         title="Detalle de Costes por Cultivo/Proyecto"
//                         icon={FaSeedling}
//                         dataArray={projectDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Proyectos"
//                         showCostPerHectare={true}
//                         surfaceAreaMap={projectSurfaceMap}
//                         emptyMessage="No hay costes registrados para proyectos."
//                     />
//                 );
//             case 'entity':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Entidad Proveedora"
//                         icon={FaBuilding}
//                         dataArray={entityDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Entidades"
//                         emptyMessage="No hay costes registrados para entidades."
//                     />
//                 );
//             case 'worker':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Trabajador"
//                         icon={FaUserTie}
//                         dataArray={workerDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Trabajadores"
//                         emptyMessage="No hay costes registrados para trabajadores."
//                         // Aquí podríamos añadir un renderItemExtra para mostrar horas, etc.
//                     />
//                 );
//             case 'category':
//                 return (
//                     <GeneralSummaryCard
//                         title="Costes por Categoría"
//                         icon={FaTags}
//                         dataArray={categoryDataForCard}
//                         totalCostCombined={totalCostCombined}
//                         averageLabel="por Categorías"
//                         emptyMessage="No hay costes registrados para categorías."
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     const tabClasses = "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 text-center cursor-pointer";
//     const activeTabClasses = "border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50";
//     const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";


//     return (
//         <section className="bg-white shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]"> {/* Altura fija para visualización */}
//             {/* Navegación por pestañas */}
//             <div className="flex border-b border-gray-200">
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'project' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('project')}
//                 >
//                     <FaSeedling className="inline-block mr-2 text-lg"/> Cultivo
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'entity' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('entity')}
//                 >
//                     <FaBuilding className="inline-block mr-2 text-lg"/> Entidad
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'worker' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('worker')}
//                 >
//                     <FaUserTie className="inline-block mr-2 text-lg"/> Trabajador
//                 </button>
//                 <button 
//                     className={`${tabClasses} ${activeTab === 'category' ? activeTabClasses : inactiveTabClasses}`} 
//                     onClick={() => setActiveTab('category')}
//                 >
//                     <FaTags className="inline-block mr-2 text-lg"/> Categoría
//                 </button>
//             </div>

//             {/* Contenido de la pestaña activa */}
//             <div className="flex-grow p-4 sm:p-6 overflow-hidden">
//                 {renderTabContent()}
//             </div>
//         </section>
//     );
// };
// const CostSummaryTabsMemo = memo(CostSummaryTabs);


// // --- SUB-COMPONENTE: CostInputForm (se mantiene igual) ---
// // ... (El código de CostInputFormMemo sigue aquí) ...
// const CostInputForm = ({ db, userId, setErrorMessage, projects }) => {
    
//     // Función auxiliar para establecer el proyecto por defecto
//     const getDefaultProject = useCallback((currentProjects) => {
//         return currentProjects.length > 0 ? currentProjects[0] : "General";
//     }, []);

//     const [newCost, setNewCost] = useState(() => ({
//         date: new Date().toISOString().split("T")[0],
//         description: "",
//         amount: "", // Mantenido como string para la entrada del formulario
//         category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
//         project: getDefaultProject(projects),
//         entity: "", // Nueva prop para entidad
//         worker: "", // Nueva prop para trabajador
//     }));
//     const [isSaving, setIsSaving] = useState(false);

//     // useEffect para asegurar que el proyecto seleccionado sigue siendo válido o se actualiza
//     useEffect(() => {
//         const defaultProject = getDefaultProject(projects);
        
//         setNewCost(prev => {
//             const projectExists = projects.includes(prev.project) || prev.project === "General";
            
//             if (!projectExists) {
//                  return { ...prev, project: defaultProject };
//             }
//             return prev;
//         });

//     }, [projects, getDefaultProject]);


//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setNewCost((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     }, []);

//     const addCost = useCallback(async (e) => {
//         e.preventDefault();
//         setErrorMessage("");

//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }

//         const costAmount = parseFloat(newCost.amount);
//         if (isNaN(costAmount) || costAmount <= 0) {
//             setErrorMessage("El monto debe ser un número positivo.");
//             return;
//         }
//         if (!newCost.description.trim()) {
//             setErrorMessage("La descripción no puede estar vacía.");
//             return;
//         }
//         if (newCost.category !== "Mano de Obra" && !newCost.entity.trim()) {
//             setErrorMessage("La entidad es obligatoria para costes que no son de 'Mano de Obra'.");
//             return;
//         }
//         if (newCost.category === "Mano de Obra" && !newCost.worker.trim()) {
//             setErrorMessage("El trabajador es obligatorio para costes de 'Mano de Obra'.");
//             return;
//         }


//         setIsSaving(true);
//         try {
//             const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//             await addDoc(collection(db, collectionPath), {
//                 userId: userId,
//                 date: newCost.date,
//                 description: newCost.description.trim(),
//                 amount: costAmount,
//                 category: newCost.category,
//                 project: newCost.project,
//                 entity: newCost.entity.trim(), // Guardar entidad
//                 worker: newCost.worker.trim(), // Guardar trabajador
//                 createdAt: serverTimestamp(),
//             });

//             // Restablecer el formulario, manteniendo el proyecto seleccionado
//             setNewCost((prev) => ({
//                 date: new Date().toISOString().split("T")[0],
//                 description: "",
//                 amount: "",
//                 category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
//                 project: prev.project, // Mantiene el proyecto para registros rápidos
//                 entity: "", // Resetear entidad
//                 worker: "", // Resetear trabajador
//             }));

//         } catch (error) {
//             console.error("Error adding cost: ", error);
//             setErrorMessage("Error al guardar el coste: " + error.message);
//         } finally {
//             setIsSaving(false);
//         }
//     }, [db, userId, newCost, setErrorMessage]);

//     return (
//         <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
//                 💰 Registrar Nuevo Coste Manual
//             </h2>
//             <form onSubmit={addCost} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Fecha */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={newCost.date}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Monto */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={newCost.amount}
//                             onChange={handleInputChange}
//                             min="0.01"
//                             step="0.01"
//                             required
//                             placeholder="Ej: 150.50"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Categoría */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
//                         <select
//                             name="category"
//                             value={newCost.category}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Excluimos "Mano de Obra" para evitar duplicidad, ya se calcula auto */}
//                             {COST_CATEGORIES.filter(c => c !== "Mano de Obra").map((cat) => (
//                                 <option key={cat} value={cat}>{cat}</option>
//                             ))}
//                             {/* Incluir "Mano de Obra" para costes manuales si se permite */}
//                             <option value="Mano de Obra">Mano de Obra</option>
//                         </select>
//                     </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Descripción */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
//                         <input
//                             type="text"
//                             name="description"
//                             value={newCost.description}
//                             onChange={handleInputChange}
//                             required
//                             placeholder="Ej: Compra de fertilizante X"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     {/* Proyecto/Cultivo */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Asociar a Proyecto:</label>
//                         <select
//                             name="project"
//                             value={newCost.project}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             {/* Proyectos combinados (manuales + mano de obra) */}
//                             {projects.map((proj) => (
//                                 <option key={proj} value={proj}>{proj}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Nuevos campos para Entidad y Trabajador */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora (si aplica):</label>
//                         <input
//                             type="text"
//                             name="entity"
//                             value={newCost.entity}
//                             onChange={handleInputChange}
//                             placeholder="Ej: Agro S.L."
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador (si es Mano de Obra):</label>
//                         <input
//                             type="text"
//                             name="worker"
//                             value={newCost.worker}
//                             onChange={handleInputChange}
//                             placeholder="Ej: Juan Pérez"
//                             className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isSaving}
//                     className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                         isSaving
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                     }`}
//                 >
//                     {isSaving ? "Guardando..." : "Guardar Coste"}
//                 </button>
//             </form>
//         </section>
//     );
// };
// const CostInputFormMemo = memo(CostInputForm);


// // --- SUB-COMPONENTE: CostDistributionChart (Card 5) ---
// const CustomTooltip = ({ active, payload, totalCost }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         const percentage = (data.value / totalCost) * 100;
//         return (
//             <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
//                 <p className="font-bold text-gray-800">{data.name}</p>
//                 <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
//                 <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
//             </div>
//         );
//     }
//     return null;
// };


// const CostDistributionChart = ({ distributionData, totalCost }) => {
    
//     // Formatea los datos para el gráfico de Pie
//     const pieData = useMemo(() => {
//         return COST_CATEGORIES.map((category, index) => ({
//             name: category,
//             value: distributionData[category] || 0,
//             color: COLORS[index % COLORS.length],
//         })).filter(item => item.value > 0); // Solo incluye categorías con costes
//     }, [distributionData]);

//     return (
//         <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
//                 📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
//             </h3>
//             {totalCost === 0 ? (
//                 <div className="flex items-center justify-center h-4/5">
//                     <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
//                 </div>
//             ) : (
//                 <ResponsiveContainer width="100%" height="90%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={40} 
//                             outerRadius={80}
//                             fill="#8884d8"
//                             labelLine={false}
//                             label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                         >
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
//                         <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
//                     </PieChart>
//                 </ResponsiveContainer>
//             )}
//         </div>
//     );
// };
// const CostDistributionChartMemo = memo(CostDistributionChart);


// // --- COMPONENTE PRINCIPAL: CostDashboard ---
// const CostDashboardComponent = ({ 
//     db, 
//     userId, 
//     setErrorMessage, 
//     errorMessage, 
//     timesheetTotalCostByProject = {}, 
//     timesheetTotalCost = 0, 
//     availableLocals = [], 
// }) => {
//     const [costData, setCostData] = useState([]); 
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (!db || !userId) {
//             setCostData([]);
//             setIsLoading(false);
//             if (!userId) {
//                 setErrorMessage("Autenticación requerida (userId no definido).");
//             }
//             return;
//         }

//         setErrorMessage("");
//         const collectionPath = `artifacts/${appId}/public/data/costEntries`;
//         const entriesCollection = collection(db, collectionPath);
        
//         const q = query(entriesCollection, where("userId", "==", userId));

//         const unsubscribe = onSnapshot(
//             q,
//             (snapshot) => {
//                 const costs = [];
//                 snapshot.forEach((doc) => {
//                     costs.push({ id: doc.id, ...doc.data() });
//                 });
                
//                 costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

//                 setCostData(costs);
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Firestore cost data error:", error);
//                 setErrorMessage("Error al cargar los datos de costes: " + error.message);
//                 setIsLoading(false);
//             }
//         );

//         return () => unsubscribe();
//     }, [db, userId, setErrorMessage]);


//     const { 
//         totalCostCombined, 
//         distributionDataCombined, 
//         projectsCombined, 
//         costByProjectCombined,
//         costByEntityCombined, // Nuevo cálculo
//         costByWorkerCombined, // Nuevo cálculo
//         allEntities, // Para el formulario
//         allWorkers // Para el formulario
//     } = useMemo(() => {
        
//         // --- A. Calcular Costes Manuales (Firestore) ---
//         const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
//         const distributionManual = costData.reduce((acc, entry) => {
//             const category = entry.category || 'Otros';
//             acc[category] = (acc[category] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByProjectManual = costData.reduce((acc, entry) => {
//             const project = entry.project || 'General';
//             acc[project] = (acc[project] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         // --- Nuevos cálculos para Entidad y Trabajador ---
//         const costByEntityManual = costData.reduce((acc, entry) => {
//             const entity = entry.entity || 'Sin Entidad';
//             acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});

//         const costByWorkerManual = costData.reduce((acc, entry) => {
//             const worker = entry.worker || 'Sin Trabajador';
//             acc[worker] = (acc[worker] || 0) + (entry.amount || 0);
//             return acc;
//         }, {});
        
        
//         // --- B. Combinar con Costes de Timesheets (Mano de Obra) ---
        
//         const totalCombined = totalManual + timesheetTotalCost;
        
//         const combinedProjectCosts = { ...costByProjectManual };
//         Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
//             if (cost > 0) {
//                 combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
//             }
//         });
        
//         const combinedDistribution = { ...distributionManual };
//         combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;

//         // Si los timesheets tienen información de trabajador, se agregaría aquí.
//         // Por ahora, asumo que timesheetTotalCostByProject no tiene detalle por trabajador/entidad,
//         // así que solo el coste total de timesheets va a "Mano de Obra".
//         // Si tienes esos detalles, necesitarías una lógica similar a combinedProjectCosts.
//         const combinedEntityCosts = { ...costByEntityManual };
//         const combinedWorkerCosts = { ...costByWorkerManual };
        
//         // Recopilar todas las entidades y trabajadores únicos para los selectores del formulario
//         const uniqueEntities = new Set(costData.map(e => e.entity).filter(Boolean));
//         const allEntities = Array.from(uniqueEntities).sort();

//         const uniqueWorkers = new Set(costData.map(e => e.worker).filter(Boolean));
//         const allWorkers = Array.from(uniqueWorkers).sort();

//         // Proyectos combinados (para el formulario de input)
//         const uniqueProjectsManual = new Set(costData.map(e => e.project || 'General'));
//         const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
//         const allProjects = new Set([...uniqueProjectsManual, ...uniqueProjectsTimesheet]);
//         const projects = Array.from(allProjects).sort();

//         return { 
//             totalCostCombined: totalCombined, 
//             distributionDataCombined: combinedDistribution,
//             projectsCombined: projects,
//             costByProjectCombined: combinedProjectCosts,
//             costByEntityCombined: combinedEntityCosts,
//             costByWorkerCombined: combinedWorkerCosts,
//             allEntities,
//             allWorkers
//         };
//     }, [costData, timesheetTotalCost, timesheetTotalCostByProject]);


//     const deleteCostEntry = useCallback(async (costId) => {
//         if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
//             return;
//         }
//         setErrorMessage("");
//         if (!db) {
//             setErrorMessage("La base de datos no está lista.");
//             return;
//         }
//         try {
//             const docRef = doc(db, `artifacts/${appId}/public/data/costEntries`, costId);
//             await deleteDoc(docRef);
//         } catch (error) {
//             console.error("Error deleting cost entry: ", error);
//             setErrorMessage("Error al eliminar el registro de coste: " + error.message);
//         }
//     }, [db, setErrorMessage]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
//                 <p className="text-gray-500 text-lg">Cargando datos de costes...</p>
//             </div>
//         );
//     }
    
//     const metricCardsData = [
//         { title: "Proyectos Activos", value: projectsCombined.length, icon: "🏗️" },
//         { title: "Coste TOTAL (€)", value: totalCostCombined.toFixed(2), icon: "💶" },
//         { title: "Último Coste Manual", value: costData.length > 0 ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
//         { title: "Registros Manuales", value: costData.length, icon: "📄" }, 
//     ];


//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
//                 Panel de Control de Costes 📈
//             </h1>

//             {/* Formulario de Ingreso de Costes */}
//             <CostInputFormMemo 
//                 db={db} 
//                 userId={userId} 
//                 setErrorMessage={setErrorMessage} 
//                 projects={projectsCombined}
//                 entities={allEntities} // Pasar todas las entidades conocidas
//                 workers={allWorkers}   // Pasar todos los trabajadores conocidos
//             />
            
//             {/* Mensaje de Error Global */}
//             {errorMessage && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//                     <span className="block sm:inline">{errorMessage}</span>
//                 </div>
//             )}

//             {/* Sección de Métricas Rápidas (Cards 1 & 3) */}
//             <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {metricCardsData.map((card, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-5 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
//                     >
//                         <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
//                         <p className="text-2xl font-extrabold text-gray-800 flex items-center">
//                             {card.icon} <span className="ml-2">{card.value}</span>
//                         </p>
//                     </div>
//                 ))}
//             </section>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                 {/* Distribución de Costes (Card 5) - Izquierda */}
//                 <CostDistributionChartMemo 
//                     distributionData={distributionDataCombined}
//                     totalCost={totalCostCombined}
//                 />
                
//                 {/* 🚀 NUEVO BLOQUE CON PESTAÑAS (reemplaza la Card 2 individual) 🚀 */}
//                 <CostSummaryTabsMemo
//                     costByProjectCombined={costByProjectCombined}
//                     costByEntityCombined={costByEntityCombined}
//                     costByWorkerCombined={costByWorkerCombined}
//                     distributionDataCombined={distributionDataCombined} // Para la pestaña de Categoría
//                     totalCostCombined={totalCostCombined}
//                     availableLocals={availableLocals} 
//                 />
//             </div>

//             {/* Historial Detallado de Costes (Solo los manuales de Firestore) */}
//             <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
//                     📋 Historial de Registros de Costes MANUALES
//                 </h3>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Entidad", "Trabajador", "Descripción", "Acciones"].map(header => (
//                                     <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {costData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-500 italic">
//                                         No hay registros de costes manuales aún.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 costData.map((cost) => (
//                                     <tr key={cost.id} className="hover:bg-indigo-50/50 transition duration-100">
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
//                                             -{cost.amount.toFixed(2)}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
//                                                 {cost.category}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-indigo-700 font-semibold">
//                                             {cost.project}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-700">
//                                             {cost.entity || 'N/A'}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-xs text-purple-700">
//                                             {cost.worker || 'N/A'}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={cost.description}>
//                                             {cost.description}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
//                                             <button
//                                                 onClick={() => deleteCostEntry(cost.id)}
//                                                 className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-100"
//                                                 title="Eliminar Coste"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export const CostDashboard = memo(CostDashboardComponent);



import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    // Importaciones de Firebase Firestore necesarias
    collection,
    query,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    deleteDoc,
    doc,
} from "firebase/firestore";
// Importamos todos los iconos necesarios para las tabs y cards
import { 
    FaEuroSign, FaChartBar, FaRulerCombined, FaSeedling, 
    FaBuilding, FaUserTie, FaTags // Iconos para Entidad, Trabajador, Categoría
} from "react-icons/fa"; 

// Definimos los tipos de caja que ya usas y sus categorías de coste
const COST_CATEGORIES = [
    "Mano de Obra", // Categoría clave para los costes de timesheets
    "Productos",
    "Equipo",
    "Servicios",
    "Otros",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Función para obtener el ID de la aplicación
const getAppId = () => {
    if (typeof window.__app_id !== "undefined") {
        return window.__app_id;
    }
    return "default-calendar-app-id";
};
const appId = getAppId();


// --- SUB-COMPONENTE: GeneralSummaryCard (Genérico para las 4 vistas) ---
const BAR_COLOR = 'bg-indigo-600';

const GeneralSummaryCard = ({ 
    title, 
    icon: CardIcon, 
    dataArray, 
    totalCostCombined, 
    averageLabel,
    showCostPerHectare = false, 
    surfaceAreaMap = {}, 
    emptyMessage = "No hay costes registrados.",
    renderItemExtra = null 
}) => {
    
    const averageCost = dataArray.length > 0 
        ? totalCostCombined / dataArray.length 
        : 0;

    return (
        <section className="bg-white p-4 sm:p-6 shadow-2xl rounded-xl border border-gray-100 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2 flex items-center">
                {CardIcon && <CardIcon className="mr-3 text-2xl text-green-600"/>} 
                {title}
            </h3>

            <div className="flex-grow space-y-4 max-h-[calc(100%-120px)] overflow-y-auto pr-2">
                
                {dataArray.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                        <p className="text-gray-500 italic text-lg">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {dataArray.map((item) => {
                            const { name, cost, percentageOfTotal, isGeneral } = item;
                            
                            const surfaceArea = showCostPerHectare ? (surfaceAreaMap[name] || 1) : 1; 
                            const costPerHectare = showCostPerHectare ? (cost / surfaceArea) : 0;

                            return (
                                <div 
                                    key={name} 
                                    className="pt-2 pb-1 border-b border-gray-200 transition duration-150 hover:bg-gray-50"
                                >
                                    <p className="text-sm font-medium text-gray-500 flex items-center mb-1">
                                        {showCostPerHectare && <FaRulerCombined className='mr-1 text-xs text-gray-400'/>} 
                                        <span className={`font-bold ${isGeneral ? 'text-gray-700' : 'text-indigo-700'}`}>{name}</span>
                                        {showCostPerHectare && !isGeneral && <span className='ml-2 text-xs text-red-500'> ({costPerHectare.toFixed(2)} €/ha)</span>}
                                        {renderItemExtra && renderItemExtra(item)}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 mr-4 w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`${BAR_COLOR} h-2 rounded-full transition-all duration-700`} 
                                                style={{ width: `${percentageOfTotal}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-md font-extrabold text-gray-700 whitespace-nowrap">
                                            {cost.toFixed(2)} € 
                                            <span className="text-sm font-semibold text-gray-500 ml-1">({percentageOfTotal.toFixed(1)}%)</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {totalCostCombined > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                        <span className='text-gray-500'>Promedio {averageLabel}</span>
                        <span className='text-indigo-700 font-extrabold'>
                            {averageCost.toFixed(2)} €
                        </span>
                    </div>
                    <div className="flex justify-end text-xl font-extrabold text-blue-600 mt-2">
                        <span className='mr-2 text-sm text-gray-600'>Total Global</span>
                        <FaEuroSign className='text-xl mr-1'/> {totalCostCombined.toFixed(2)}
                    </div>
                </div>
            )}
        </section>
    );
};
const GeneralSummaryCardMemo = memo(GeneralSummaryCard);


// --- SUB-COMPONENTE: CostSummaryTabs (Contenedor de las 4 vistas) ---
const CostSummaryTabs = ({ 
    costByProjectCombined, 
    costByEntityCombined, 
    costByWorkerCombined, 
    distributionDataCombined, 
    totalCostCombined, 
    availableLocals 
}) => {
    const [activeTab, setActiveTab] = useState('project'); 

    const projectSurfaceMap = useMemo(() => {
        return availableLocals.reduce((acc, local) => {
            acc[local.name] = (local.surfaceArea && local.surfaceArea > 0) ? local.surfaceArea : 1; 
            return acc;
        }, { 'General': 1 });
    }, [availableLocals]);

    const processDataForSummaryCard = useCallback((dataObject, currentTotalCost) => {
        if (currentTotalCost === 0) return [];
        return Object.entries(dataObject)
            .map(([name, cost]) => ({
                name, 
                cost,
                percentageOfTotal: (cost / currentTotalCost) * 100,
                isGeneral: name === 'General',
            }))
            .filter(item => item.cost > 0)
            .sort((a, b) => b.cost - a.cost);
    }, []);

    const projectDataForCard = useMemo(() => 
        processDataForSummaryCard(costByProjectCombined, totalCostCombined), 
        [costByProjectCombined, totalCostCombined, processDataForSummaryCard]
    );

    const entityDataForCard = useMemo(() => 
        processDataForSummaryCard(costByEntityCombined, totalCostCombined), 
        [costByEntityCombined, totalCostCombined, processDataForSummaryCard]
    );

    const workerDataForCard = useMemo(() => 
        processDataForSummaryCard(costByWorkerCombined, totalCostCombined), 
        [costByWorkerCombined, totalCostCombined, processDataForSummaryCard]
    );

    const categoryDataForCard = useMemo(() => 
        processDataForSummaryCard(distributionDataCombined, totalCostCombined), 
        [distributionDataCombined, totalCostCombined, processDataForSummaryCard]
    );


    const renderTabContent = () => {
        switch (activeTab) {
            case 'project':
                return (
                    <GeneralSummaryCard
                        title="Detalle de Costes por Cultivo/Proyecto"
                        icon={FaSeedling}
                        dataArray={projectDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Proyectos"
                        showCostPerHectare={true}
                        surfaceAreaMap={projectSurfaceMap}
                        emptyMessage="No hay costes registrados para proyectos."
                    />
                );
            case 'entity':
                return (
                    <GeneralSummaryCard
                        title="Costes por Entidad Proveedora"
                        icon={FaBuilding}
                        dataArray={entityDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Entidades"
                        emptyMessage="No hay costes registrados para entidades."
                    />
                );
            case 'worker':
                return (
                    <GeneralSummaryCard
                        title="Costes por Trabajador"
                        icon={FaUserTie}
                        dataArray={workerDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Trabajadores"
                        emptyMessage="No hay costes registrados para trabajadores."
                    />
                );
            case 'category':
                // La categoría usa los datos de distribución
                return (
                    <GeneralSummaryCard
                        title="Costes por Categoría"
                        icon={FaTags}
                        dataArray={categoryDataForCard}
                        totalCostCombined={totalCostCombined}
                        averageLabel="por Categorías"
                        emptyMessage="No hay costes registrados para categorías."
                    />
                );
            default:
                return null;
        }
    };

    const tabClasses = "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 text-center cursor-pointer";
    const activeTabClasses = "border-indigo-600 text-indigo-700 font-bold bg-indigo-50/50";
    const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";


    return (
        <section className="bg-white shadow-2xl rounded-xl border border-gray-100 flex flex-col h-[600px] lg:h-[700px]"> 
            {/* Navegación por pestañas */}
            <div className="flex border-b border-gray-200">
                <button 
                    className={`${tabClasses} ${activeTab === 'project' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('project')}
                >
                    <FaSeedling className="inline-block mr-2 text-lg"/> Cultivo
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'entity' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('entity')}
                >
                    <FaBuilding className="inline-block mr-2 text-lg"/> Entidad
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'worker' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('worker')}
                >
                    <FaUserTie className="inline-block mr-2 text-lg"/> Trabajador
                </button>
                <button 
                    className={`${tabClasses} ${activeTab === 'category' ? activeTabClasses : inactiveTabClasses}`} 
                    onClick={() => setActiveTab('category')}
                >
                    <FaTags className="inline-block mr-2 text-lg"/> Categoría
                </button>
            </div>

            {/* Contenido de la pestaña activa */}
            <div className="flex-grow p-4 sm:p-6 overflow-hidden">
                {renderTabContent()}
            </div>
        </section>
    );
};
const CostSummaryTabsMemo = memo(CostSummaryTabs);


// --- SUB-COMPONENTE: CostInputForm (Con SELECTs dinámicos) ---
const CostInputForm = ({ db, userId, setErrorMessage, projects, entities, workers }) => {
    
    const getDefaultValue = useCallback((list, fallback = "") => {
        // Devuelve el primer elemento o un valor predeterminado si la lista está vacía
        return list.length > 0 ? list[0] : fallback;
    }, []);

    const [newCost, setNewCost] = useState(() => ({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "", 
        category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0], 
        project: getDefaultValue(projects, "General"),
        entity: getDefaultValue(entities, ""),
        worker: getDefaultValue(workers, ""),
    }));
    const [isSaving, setIsSaving] = useState(false);

    // useEffect para sincronizar los valores por defecto si las listas cambian
    useEffect(() => {
        setNewCost(prev => {
            const projectExists = projects.includes(prev.project);
            const entityExists = entities.includes(prev.entity);
            const workerExists = workers.includes(prev.worker);
            
            return { 
                ...prev, 
                project: projectExists ? prev.project : getDefaultValue(projects, "General"),
                entity: entityExists ? prev.entity : getDefaultValue(entities, ""),
                worker: workerExists ? prev.worker : getDefaultValue(workers, ""),
            };
        });

    }, [projects, entities, workers, getDefaultValue]);


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewCost((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const addCost = useCallback(async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }

        const costAmount = parseFloat(newCost.amount);
        if (isNaN(costAmount) || costAmount <= 0) {
            setErrorMessage("El monto debe ser un número positivo.");
            return;
        }
        if (!newCost.description.trim()) {
            setErrorMessage("La descripción no puede estar vacía.");
            return;
        }
        
        // Validaciones de Selects
        if (newCost.category !== "Mano de Obra" && !newCost.entity.trim()) {
            setErrorMessage("Debe seleccionar una entidad proveedora.");
            return;
        }
        if (newCost.category === "Mano de Obra" && !newCost.worker.trim()) {
             setErrorMessage("Debe seleccionar un trabajador para costes de Mano de Obra.");
             return;
        }
        if (!newCost.project.trim()) {
             setErrorMessage("Debe seleccionar un proyecto.");
             return;
        }


        setIsSaving(true);
        try {
            const collectionPath = `artifacts/${appId}/public/data/costEntries`;
            await addDoc(collection(db, collectionPath), {
                userId: userId,
                date: newCost.date,
                description: newCost.description.trim(),
                amount: costAmount,
                category: newCost.category,
                project: newCost.project,
                entity: newCost.entity.trim() || 'N/A', 
                worker: newCost.worker.trim() || 'N/A', 
                createdAt: serverTimestamp(),
            });

            // Restablecer el formulario
            setNewCost((prev) => ({
                date: new Date().toISOString().split("T")[0],
                description: "",
                amount: "",
                category: COST_CATEGORIES.filter(c => c !== "Mano de Obra")[0] || COST_CATEGORIES[0],
                project: prev.project, // Mantiene el proyecto seleccionado
                entity: getDefaultValue(entities, ""),
                worker: getDefaultValue(workers, ""),
            }));

        } catch (error) {
            console.error("Error adding cost: ", error);
            setErrorMessage("Error al guardar el coste: " + error.message);
        } finally {
            setIsSaving(false);
        }
    }, [db, userId, newCost, setErrorMessage, getDefaultValue, entities, workers]);

    return (
        <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                💰 Registrar Nuevo Coste Manual
            </h2>
            <form onSubmit={addCost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha:</label>
                        <input
                            type="date"
                            name="date"
                            value={newCost.date}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€):</label>
                        <input
                            type="number"
                            name="amount"
                            value={newCost.amount}
                            onChange={handleInputChange}
                            min="0.01"
                            step="0.01"
                            required
                            placeholder="Ej: 150.50"
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría:</label>
                        <select
                            name="category"
                            value={newCost.category}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {COST_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Proyecto/Cultivo (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Proyecto:</label>
                        <select
                            name="project"
                            value={newCost.project}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={projects.length === 0}
                        >
                            {projects.length === 0 && <option value="">Cargando Proyectos...</option>}
                            {projects.map((proj) => (
                                <option key={proj} value={proj}>{proj}</option>
                            ))}
                        </select>
                    </div>

                    {/* Entidad Proveedora (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Entidad Proveedora:</label>
                        <select
                            name="entity"
                            value={newCost.entity}
                            onChange={handleInputChange}
                            required={newCost.category !== "Mano de Obra"} 
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={entities.length === 0}
                        >
                            <option value="">{entities.length > 0 ? 'Seleccionar Entidad' : 'Cargando Entidades...'}</option>
                            {entities.map((entity) => (
                                <option key={entity} value={entity}>{entity}</option>
                            ))}
                        </select>
                    </div>

                    {/* Trabajador (SELECT) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador (Solo Mano de Obra):</label>
                        <select
                            name="worker"
                            value={newCost.worker}
                            onChange={handleInputChange}
                            required={newCost.category === "Mano de Obra"} 
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={workers.length === 0}
                        >
                            <option value="">{workers.length > 0 ? 'Seleccionar Trabajador' : 'Cargando Trabajadores...'}</option>
                            {workers.map((worker) => (
                                <option key={worker} value={worker}>{worker}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Descripción/Detalle:</label>
                    <input
                        type="text"
                        name="description"
                        value={newCost.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Compra de fertilizante X"
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>


                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
                        isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {isSaving ? "Guardando..." : "Guardar Coste"}
                </button>
            </form>
        </section>
    );
};
const CostInputFormMemo = memo(CostInputForm);


// --- SUB-COMPONENTE: CostDistributionChart (Gráfico de Tarta) ---
const CustomTooltip = ({ active, payload, totalCost }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = (data.value / totalCost) * 100;
        return (
            <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-xs">
                <p className="font-bold text-gray-800">{data.name}</p>
                <p className="text-gray-600">Monto: <span className="font-semibold">{data.value.toFixed(2)}€</span></p>
                <p className="text-gray-600">Porcentaje: <span className="font-semibold">{percentage.toFixed(1)}%</span></p>
            </div>
        );
    }
    return null;
};


const CostDistributionChart = ({ distributionData, totalCost }) => {
    
    const pieData = useMemo(() => {
        return COST_CATEGORIES.map((category, index) => ({
            name: category,
            value: distributionData[category] || 0,
            color: COLORS[index % COLORS.length],
        })).filter(item => item.value > 0); 
    }, [distributionData]);

    return (
        <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 h-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                📊 Distribución de Costes (Total: {totalCost.toFixed(2)}€)
            </h3>
            {totalCost === 0 ? (
                <div className="flex items-center justify-center h-4/5">
                    <p className="text-gray-500 italic">No hay costes registrados para calcular la distribución.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40} 
                            outerRadius={80}
                            fill="#8884d8"
                            labelLine={false}
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip totalCost={totalCost} />} />
                        <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};
const CostDistributionChartMemo = memo(CostDistributionChart);


// --- COMPONENTE PRINCIPAL: CostDashboard ---
const CostDashboardComponent = ({ 
    db, 
    userId, 
    setErrorMessage, 
    errorMessage, 
    timesheetTotalCostByProject = {}, 
    timesheetTotalCost = 0, 
    availableLocals = [], 
    availableProjects = [], 
    availableEntities = [], 
    availableWorkers = [], 
}) => {
    const [costData, setCostData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    // 1. Hook de Lectura de Datos de Costes
    useEffect(() => {
        if (!db || !userId) {
            setCostData([]);
            setIsLoading(false);
            if (!userId) {
                setErrorMessage("Autenticación requerida (userId no definido).");
            }
            return;
        }

        setErrorMessage("");
        const collectionPath = `artifacts/${appId}/public/data/costEntries`;
        const entriesCollection = collection(db, collectionPath);
        
        const q = query(entriesCollection, where("userId", "==", userId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const costs = [];
                snapshot.forEach((doc) => {
                    costs.push({ id: doc.id, ...doc.data() });
                });
                
                costs.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

                setCostData(costs);
                setIsLoading(false);
            },
            (error) => {
                console.error("Firestore cost data error:", error);
                setErrorMessage("Error al cargar los datos de costes: " + error.message);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [db, userId, setErrorMessage]);


    const { 
        totalCostCombined, 
        distributionDataCombined, 
        projectsForSelect, 
        costByProjectCombined,
        costByEntityCombined, 
        costByWorkerCombined, 
    } = useMemo(() => {
        
        // --- 1. Cálculos de Costes Manuales (desde Firestore) ---
        const totalManual = costData.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        
        const distributionManual = costData.reduce((acc, entry) => {
            const category = entry.category || 'Otros';
            acc[category] = (acc[category] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByProjectManual = costData.reduce((acc, entry) => {
            const project = entry.project || 'General';
            acc[project] = (acc[project] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByEntityManual = costData.reduce((acc, entry) => {
            // Agrupamos por la entidad registrada, o 'N/A' si es Mano de Obra (o no se registró)
            const entity = entry.entity || 'N/A';
            acc[entity] = (acc[entity] || 0) + (entry.amount || 0);
            return acc;
        }, {});

        const costByWorkerManual = costData.reduce((acc, entry) => {
            // Agrupamos por el trabajador registrado, o 'N/A' si no es Mano de Obra
            const worker = entry.worker || 'N/A';
            acc[worker] = (acc[worker] || 0) + (entry.amount || 0);
            return acc;
        }, {});
        
        
        // --- 2. Combinar con Costes de Timesheets (Mano de Obra) ---
        
        const totalCombined = totalManual + timesheetTotalCost;
        
        // Proyectos
        const combinedProjectCosts = { ...costByProjectManual };
        Object.entries(timesheetTotalCostByProject).forEach(([project, cost]) => {
            if (cost > 0) {
                combinedProjectCosts[project] = (combinedProjectCosts[project] || 0) + cost;
            }
        });
        
        // Distribución por Categoría
        const combinedDistribution = { ...distributionManual };
        combinedDistribution["Mano de Obra"] = (combinedDistribution["Mano de Obra"] || 0) + timesheetTotalCost;
        
        // Entidad/Trabajador: El coste total de Timesheet (Mano de Obra) va al grupo 'N/A' si no tenemos detalle granular
        if (timesheetTotalCost > 0) {
             costByEntityManual['N/A'] = (costByEntityManual['N/A'] || 0) + timesheetTotalCost;
             costByWorkerManual['N/A'] = (costByWorkerManual['N/A'] || 0) + timesheetTotalCost;
        }

        // Proyectos para el SELECT del formulario: Proyectos definidos + 'General' + Proyectos con timesheets
        const uniqueProjectsTimesheet = new Set(Object.keys(timesheetTotalCostByProject));
        const projects = Array.from(new Set([...availableProjects, 'General', ...uniqueProjectsTimesheet])).sort();

        return { 
            totalCostCombined: totalCombined, 
            distributionDataCombined: combinedDistribution,
            projectsForSelect: projects,
            costByProjectCombined: combinedProjectCosts,
            costByEntityCombined: costByEntityManual, 
            costByWorkerCombined: costByWorkerManual, 
        };
    }, [costData, timesheetTotalCost, timesheetTotalCostByProject, availableProjects]);


    const deleteCostEntry = useCallback(async (costId) => {
        if (!window.confirm("¿Estás seguro de eliminar este registro de coste? Esta acción es permanente.")) {
            return;
        }
        setErrorMessage("");
        if (!db) {
            setErrorMessage("La base de datos no está lista.");
            return;
        }
        try {
            const docRef = doc(db, `artifacts/${appId}/public/data/costEntries`, costId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting cost entry: ", error);
            setErrorMessage("Error al eliminar el registro de coste: " + error.message);
        }
    }, [db, setErrorMessage]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
                <p className="text-gray-500 text-lg">Cargando datos de costes...</p>
            </div>
        );
    }
    
    const metricCardsData = [
        { title: "Proyectos Activos", value: projectsForSelect.length, icon: "🏗️" },
        { title: "Coste TOTAL (€)", value: totalCostCombined.toFixed(2), icon: "💶" },
        { title: "Último Coste Manual", value: costData.length > 0 ? costData[0].amount.toFixed(2) + '€' : 'N/A', icon: "💸" },
        { title: "Registros Manuales", value: costData.length, icon: "📄" }, 
    ];


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
                Panel de Control de Costes 📈
            </h1>

            {/* Formulario de Ingreso de Costes */}
            <CostInputFormMemo 
                db={db} 
                userId={userId} 
                setErrorMessage={setErrorMessage} 
                projects={projectsForSelect} // Proyectos combinados para el select
                entities={availableEntities}   // Lista de entidades (prop)
                workers={availableWorkers}     // Lista de trabajadores (prop)
            />
            
            {/* Mensaje de Error Global */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}

            {/* Sección de Métricas Rápidas */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {metricCardsData.map((card, index) => (
                    <div 
                        key={index} 
                        className={`p-5 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border-l-4 ${index % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-green-50 border-green-500'}`}
                    >
                        <p className="text-sm text-gray-600 font-medium mb-1">{card.title}</p>
                        <p className="text-2xl font-extrabold text-gray-800 flex items-center">
                            {card.icon} <span className="ml-2">{card.value}</span>
                        </p>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Distribución de Costes (Gráfico) */}
                <CostDistributionChartMemo 
                    distributionData={distributionDataCombined}
                    totalCost={totalCostCombined}
                />
                
                {/* BLOQUE CON PESTAÑAS (4 Vistas) */}
                <CostSummaryTabsMemo
                    costByProjectCombined={costByProjectCombined}
                    costByEntityCombined={costByEntityCombined}
                    costByWorkerCombined={costByWorkerCombined}
                    distributionDataCombined={distributionDataCombined} 
                    totalCostCombined={totalCostCombined}
                    availableLocals={availableLocals} 
                />
            </div>

            {/* Historial Detallado de Costes (Tabla) */}
            <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    📋 Historial de Registros de Costes MANUALES
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {["Fecha", "Monto (€)", "Categoría", "Proyecto", "Entidad", "Trabajador", "Descripción", "Acciones"].map(header => (
                                    <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {costData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-500 italic">
                                        No hay registros de costes manuales aún.
                                    </td>
                                </tr>
                            ) : (
                                costData.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-indigo-50/50 transition duration-100">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cost.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
                                            -{cost.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                                {cost.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-indigo-700 font-semibold">
                                            {cost.project}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-700">
                                            {cost.entity || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-purple-700">
                                            {cost.worker || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={cost.description}>
                                            {cost.description}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => deleteCostEntry(cost.id)}
                                                className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full hover:bg-red-100"
                                                title="Eliminar Coste"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export const CostDashboard = memo(CostDashboardComponent);