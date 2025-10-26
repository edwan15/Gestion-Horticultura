
// import React, { useState, useMemo, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// import { firebaseConfig } from "../../firebaseConfig";

// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// // ----------------------------------------------------
// // DEFINICIÓN DEL GRÁFICO (ProductivityChart)
// // ----------------------------------------------------
// const ProductivityChart = ({ summaryArray }) => {
//   const colors = {
//     typeA: '#8884d8',
//     typeB: '#82ca9d',
//     typeC: '#ffc658',
//     typeD: '#ff7300',
//     typeE: '#00c49f',
//   };

//   if (!summaryArray || summaryArray.length === 0) {
//     return (
//       <div className="h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100">
//         <p className="text-gray-500 italic">No hay datos suficientes para generar el gráfico.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={summaryArray}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//           <XAxis dataKey="name" stroke="#333" tick={{ fill: '#4b5563', fontSize: 12 }} />
//           <YAxis stroke="#333" tick={{ fill: '#4b5563', fontSize: 12 }} />
//           <Tooltip 
//             cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//             contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', background: '#fff', fontSize: '14px' }}
//             labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
//             formatter={(value, name) => [value, name.replace('type', 'Caja ')]}
//           />
//           <Legend 
//             wrapperStyle={{ paddingTop: '10px' }} 
//             formatter={(value) => value.replace('type', 'Caja ')}
//           />

//           <Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL
// // ----------------------------------------------------
// const ProductivityAnalyzer = () => {
//   const [productionData, setProductionData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [db, setDb] = useState(null);
//   const [auth, setAuth] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAuthReady, setIsAuthReady] = useState(false);
  
//   const [newEntry, setNewEntry] = useState({ 
//     name: '', 
//     date: new Date().toISOString().split('T')[0],
//     typeA: 0, 
//     typeB: 0, 
//     typeC: 0, 
//     typeD: 0, 
//     typeE: 0 
//   });

//   const [selectedWorkerName, setSelectedWorkerName] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   // Inicialización y Autenticación Anónima de Firebase
//   useEffect(() => {
//     try {
//       if (Object.keys(firebaseConfig).length === 0) {
//         throw new Error("Firebase config not available.");
//       }
//       const app = initializeApp(firebaseConfig);
//       const firestore = getFirestore(app);
//       const firebaseAuth = getAuth(app);
//       setDb(firestore);
//       setAuth(firebaseAuth);

//       onAuthStateChanged(firebaseAuth, async (user) => {
//         if (!user) {
//           try {
//             await signInAnonymously(firebaseAuth);
//           } catch (e) {
//             console.error("Firebase auth error:", e);
//           }
//         }
//         setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
//         setIsAuthReady(true);
//       });
      
//     } catch (e) {
//       console.error("Firebase Initialization Error:", e);
//       setErrorMessage("Error al inicializar la base de datos.");
//       setIsAuthReady(true);
//       setIsLoading(false);
//     }
//   }, []);

//   // Suscripción a los datos de Firestore (onSnapshot)
//   useEffect(() => {
//     if (!db || !isAuthReady) return;

//     const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//     const entriesCollection = collection(db, collectionPath);
//     const q = query(entriesCollection); 

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const entries = [];
//       snapshot.forEach((doc) => {
//         entries.push({ id: doc.id, ...doc.data() });
//       });
//       setProductionData(entries);
//       setIsLoading(false);

//       if (entries.length > 0 && !selectedWorkerName) {
//         const uniqueNames = [...new Set(entries.map(e => e.name))];
//         setSelectedWorkerName(uniqueNames[0]);
//       }
//     }, (error) => {
//       console.error("Firestore data snapshot error:", error);
//       setErrorMessage("Error al cargar los datos de la base de datos.");
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, [db, isAuthReady]);

//   // Handlers y Lógica
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     setNewEntry({
//       ...newEntry,
//       [name]: type === 'number' ? parseInt(value) || 0 : value,
//     });
//   };

//   const addProduction = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!newEntry.name || newEntry.name.trim() === '') {
//       setErrorMessage('Por favor, ingresa un nombre.');
//       return;
//     }
    
//     if (!db) {
//         setErrorMessage('La base de datos no está lista.');
//         return;
//     }
    
//     try {
//         const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//         await addDoc(collection(db, collectionPath), {
//             ...newEntry,
//             typeA: newEntry.typeA || 0, 
//             typeB: newEntry.typeB || 0,
//             typeC: newEntry.typeC || 0,
//             typeD: newEntry.typeD || 0,
//             typeE: newEntry.typeE || 0,
//             userId: userId,
//             createdAt: serverTimestamp(),
//         });

//         setNewEntry(prev => ({ 
//             name: prev.name, 
//             date: prev.date, 
//             typeA: 0, 
//             typeB: 0, 
//             typeC: 0, 
//             typeD: 0, 
//             typeE: 0 
//         }));
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         setErrorMessage('Error al registrar la producción: ' + error.message);
//     }
//   };


//   // Lógica de Análisis y Agrupación
//   const summary = useMemo(() => {
//     const uniqueNames = [...new Set(productionData.map(e => e.name))].sort();

//     const totals = productionData.reduce((acc, entry) => {
//       const entryA = Number(entry.typeA) || 0;
//       const entryB = Number(entry.typeB) || 0;
//       const entryC = Number(entry.typeC) || 0;
//       const entryD = Number(entry.typeD) || 0;
//       const entryE = Number(entry.typeE) || 0;

//       if (!acc[entry.name]) {
//         acc[entry.name] = { 
//           total: 0, typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
//         };
//       }

//       acc[entry.name].typeA += entryA;
//       acc[entry.name].typeB += entryB;
//       acc[entry.name].typeC += entryC;
//       acc[entry.name].typeD += entryD;
//       acc[entry.name].typeE += entryE;

//       acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;

//       return acc;
//     }, {});

//     const summaryArray = Object.entries(totals)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.total - a.total);

//     return { summaryArray, uniqueNames };
//   }, [productionData]);

//   const topPerformer = summary.summaryArray[0] || { name: 'N/A', total: 0 };
  
//   const getMaxByType = (type) => Math.max(...summary.summaryArray.map(w => w[type] || 0));

//   const dailyEntries = useMemo(() => {
//     if (!selectedWorkerName || !selectedDate) return [];

//     return productionData
//         .filter(entry => entry.name === selectedWorkerName && entry.date === selectedDate)
//         .sort((a, b) => (new Date(a.date) - new Date(b.date))); 
//   }, [productionData, selectedWorkerName, selectedDate]);
  
//   // ----------------------------------------------------
//   // RENDERIZADO (JSX con Tailwind)
//   // ----------------------------------------------------
//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
//       <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 border-b-4 border-blue-200 pb-3 mb-8">
//         📦 Analizador de Productividad (Real-Time)
//       </h1>
      
//       {/* Mensajes de estado y error */}
//       {isLoading && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
//             Cargando datos...
//         </div>
//       )}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="font-bold">Error:</span> {errorMessage}
//         </div>
//       )}
//       {userId && (
//           <p className="text-xs text-gray-500 mb-4">
//               ID de Sesión: <span className="font-mono text-gray-700">{userId}</span>
//           </p>
//       )}

      
//       {/* SECCIÓN 1: Ingreso de Datos */}
//       <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">➕ Registrar Producción</h2>
//         <form onSubmit={addProduction} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Nombre del Trabajador"
//                 value={newEntry.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro:</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={newEntry.date}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h3 className="text-lg font-medium text-blue-800 mb-4">Cajas por Tipo (Cantidad)</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//               {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                 <div key={type}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Tipo {type}:</label>
//                   <input
//                     type="number"
//                     name={`type${type}`}
//                     value={newEntry[`type${type}`]}
//                     onChange={handleInputChange}
//                     min="0"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <button 
//             type="submit" 
//             disabled={!isAuthReady || isLoading}
//             className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                 !isAuthReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Guardando...' : 'Registrar Entrada'}
//           </button>
//         </form>
//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />
      
//       {/* SECCIÓN 5: Vista de Historial Diario */}
//       <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">🗓️ Historial por Trabajador y Fecha</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Trabajador:</label>
//                 <select
//                     value={selectedWorkerName}
//                     onChange={(e) => setSelectedWorkerName(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 >
//                     <option value="">-- Seleccione un trabajador --</option>
//                     {summary.uniqueNames.map(name => (
//                         <option key={name} value={name}>{name}</option>
//                     ))}
//                 </select>
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Fecha:</label>
//                 <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//             </div>
//         </div>

//         {selectedWorkerName && dailyEntries.length > 0 ? (
//             <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
//                 <h3 className="text-xl font-bold text-indigo-800 mb-3">
//                     Producción de {selectedWorkerName} el {selectedDate}
//                 </h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                     {['A', 'B', 'C', 'D', 'E'].map((type) => {
//                         const totalType = dailyEntries.reduce((sum, entry) => sum + (entry[`type${type}`] || 0), 0);
//                         return (
//                             <div key={type} className="p-3 bg-white rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-500">Caja {type}</p>
//                                 <p className="text-2xl font-extrabold text-indigo-600">{totalType}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         ) : selectedWorkerName && (
//              <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50">
//                  No se encontraron entradas para {selectedWorkerName} en la fecha {selectedDate}.
//              </p>
//         )}

//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />

//       {/* SECCIÓN 2: Resumen Ejecutivo */}
//       <section className="bg-yellow-100 p-6 rounded-lg shadow-inner mb-8 border border-yellow-300">
//         <h2 className="text-2xl font-semibold text-yellow-800 mb-3">⭐ Resumen General Acumulado</h2>
//         <p className="text-lg text-yellow-900">
//           El trabajador más productivo (por volumen total histórico) es: 
//           <strong className="text-2xl text-red-600 ml-2">{topPerformer.name}</strong> con 
//           <span className="text-2xl font-extrabold ml-1"> {topPerformer.total}</span> cajas.
//         </p>
//       </section>

//       {/* SECCIÓN 3: CANVAS / GRÁFICO */}
//       <section className="mb-8">
//         <h2 className="text-3xl font-bold text-blue-800 mb-6">📊 Visualización de Competitividad (Acumulado)</h2>
//         <ProductivityChart summaryArray={summary.summaryArray} />
//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />

//       {/* SECCIÓN 4: Tabla de Análisis */}
//       <section className="bg-white p-6 shadow-xl rounded-lg">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">🥇 Desempeño por Categoría (Acumulado)</h2>
        
//         {summary.summaryArray.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">Trabajador</th>
//                   <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider bg-blue-800">TOTAL GENERAL</th>
//                   {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                     <th key={type} className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Caja {type}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {summary.summaryArray.map((item, index) => (
//                   <tr 
//                     key={item.name} 
//                     className={index === 0 ? 'bg-yellow-50 font-bold border-l-4 border-yellow-500' : 'hover:bg-gray-100'}
//                   >
//                     <td className="px-4 py-3 whitespace-nowrap text-left text-gray-900">{item.name}</td>
                    
//                     <td className="px-4 py-3 whitespace-nowrap text-center text-lg font-extrabold bg-blue-100 text-blue-900">
//                       {item.total}
//                     </td>
                    
//                     {['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
//                       <td key={typeIndex} 
//                           className={`px-4 py-3 whitespace-nowrap text-center ${item[type] === getMaxByType(type) ? 'bg-green-100 font-bold text-green-800' : 'text-gray-700'}`}
//                       >
//                         {item[type]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 italic">No hay datos de producción registrados aún.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default ProductivityAnalyzer;





// import React, { useState, useMemo, useEffect } from 'react';
// // Importaciones de Recharts para el gráfico
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // Importaciones de Firebase Firestore
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// import { firebaseConfig } from "../../firebaseConfig"; // Asegúrate de que esta ruta sea correcta

// // --- Lógica de la Aplicación Base ---
// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// // ----------------------------------------------------
// // COMPONENTE DE GRÁFICO (ProductivityChart)
// // ----------------------------------------------------
// const ProductivityChart = ({ summaryArray }) => {
//   const colors = {
//     typeA: '#10b981', // Verde esmeralda (A)
//     typeB: '#3b82f6', // Azul (B)
//     typeC: '#f59e0b', // Amarillo/Ámbar (C)
//     typeD: '#ef4444', // Rojo (D)
//     typeE: '#8b5cf6', // Violeta (E)
//   };

//   if (!summaryArray || summaryArray.length === 0) {
//     return (
//       <div className="h-64 w-full p-4 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
//         <p className="text-gray-500 italic text-sm">No hay datos suficientes para generar el gráfico.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-64 sm:h-80 w-full p-2 md:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={summaryArray}
//           margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//           <XAxis 
//             dataKey="name" 
//             stroke="#4b5563" 
//             tick={{ fill: '#4b5563', fontSize: 10 }} 
//             height={40}
//             angle={-30} // Rotación para mejor legibilidad en móvil
//             textAnchor="end"
//             interval={0} // Muestra todas las etiquetas
//           />
//           <YAxis stroke="#4b5563" tick={{ fill: '#4b5563', fontSize: 10 }} />
//           <Tooltip 
//             cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//             contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', background: '#fff', fontSize: '12px', padding: '5px' }}
//             labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
//             formatter={(value, name) => [value, name.replace('type', 'Caja ')]}
//           />
//           <Legend 
//             wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
//             formatter={(value) => value.replace('type', 'Caja ')}
//             layout="horizontal"
//             align="center"
//             verticalAlign="top"
//           />

//           <Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[3, 3, 0, 0]} />
//           <Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[3, 3, 0, 0]} />
//           <Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[3, 3, 0, 0]} />
//           <Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[3, 3, 0, 0]} />
//           <Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[3, 3, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL
// // ----------------------------------------------------
// const ProductivityAnalyzer = () => {
//   const [productionData, setProductionData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [db, setDb] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAuthReady, setIsAuthReady] = useState(false);
//   const [activeTab, setActiveTab] = useState('input'); // 'input' o 'analysis'
  
//   const [newEntry, setNewEntry] = useState({ 
//     name: '', 
//     date: new Date().toISOString().split('T')[0],
//     typeA: 0, 
//     typeB: 0, 
//     typeC: 0, 
//     typeD: 0, 
//     typeE: 0 
//   });

//   const [selectedWorkerName, setSelectedWorkerName] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   // --- 1. Inicialización y Autenticación Firebase ---
//   useEffect(() => {
//     try {
//       if (Object.keys(firebaseConfig).length === 0) {
//         throw new Error("Firebase config not available.");
//       }
//       const app = initializeApp(firebaseConfig);
//       const firestore = getFirestore(app);
//       const firebaseAuth = getAuth(app);
//       setDb(firestore);

//       onAuthStateChanged(firebaseAuth, async (user) => {
//         if (!user) {
//           try {
//             await signInAnonymously(firebaseAuth);
//           } catch (e) {
//             console.error("Firebase auth error:", e);
//           }
//         }
//         setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
//         setIsAuthReady(true);
//       });
      
//     } catch (e) {
//       console.error("Firebase Initialization Error:", e);
//       setErrorMessage("Error al inicializar la base de datos.");
//       setIsAuthReady(true);
//       setIsLoading(false);
//     }
//   }, []);

//   // --- 2. Suscripción a los datos de Firestore ---
//   useEffect(() => {
//     if (!db || !isAuthReady) return;

//     const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//     const entriesCollection = collection(db, collectionPath);
//     const q = query(entriesCollection); 

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const entries = [];
//       snapshot.forEach((doc) => {
//         entries.push({ id: doc.id, ...doc.data() });
//       });
//       setProductionData(entries);
//       setIsLoading(false);

//       if (entries.length > 0 && !selectedWorkerName) {
//         const uniqueNames = [...new Set(entries.map(e => e.name))];
//         setSelectedWorkerName(uniqueNames[0]);
//       }
//     }, (error) => {
//       console.error("Firestore data snapshot error:", error);
//       setErrorMessage("Error al cargar los datos de la base de datos.");
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, [db, isAuthReady]);

//   // --- 3. Handlers y Lógica de Ingreso ---
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     setNewEntry({
//       ...newEntry,
//       [name]: type === 'number' ? parseInt(value) || 0 : value,
//     });
//   };

//   const addProduction = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!newEntry.name || newEntry.name.trim() === '') {
//       setErrorMessage('Por favor, ingresa un nombre.');
//       return;
//     }
    
//     if (!db) {
//         setErrorMessage('La base de datos no está lista.');
//         return;
//     }
    
//     try {
//         const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//         await addDoc(collection(db, collectionPath), {
//             ...newEntry,
//             typeA: newEntry.typeA || 0, 
//             typeB: newEntry.typeB || 0,
//             typeC: newEntry.typeC || 0,
//             typeD: newEntry.typeD || 0,
//             typeE: newEntry.typeE || 0,
//             userId: userId,
//             createdAt: serverTimestamp(),
//         });

//         setNewEntry(prev => ({ 
//             name: prev.name, 
//             date: prev.date, 
//             typeA: 0, 
//             typeB: 0, 
//             typeC: 0, 
//             typeD: 0, 
//             typeE: 0 
//         }));
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         setErrorMessage('Error al registrar la producción: ' + error.message);
//     }
//   };


//   // --- 4. Lógica de Análisis (useMemo) ---
//   const summary = useMemo(() => {
//     const uniqueNames = [...new Set(productionData.map(e => e.name))].sort();

//     const totals = productionData.reduce((acc, entry) => {
//       const entryA = Number(entry.typeA) || 0;
//       const entryB = Number(entry.typeB) || 0;
//       const entryC = Number(entry.typeC) || 0;
//       const entryD = Number(entry.typeD) || 0;
//       const entryE = Number(entry.typeE) || 0;

//       if (!acc[entry.name]) {
//         acc[entry.name] = { 
//           total: 0, typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
//         };
//       }

//       acc[entry.name].typeA += entryA;
//       acc[entry.name].typeB += entryB;
//       acc[entry.name].typeC += entryC;
//       acc[entry.name].typeD += entryD;
//       acc[entry.name].typeE += entryE;

//       acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;

//       return acc;
//     }, {});

//     const summaryArray = Object.entries(totals)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.total - a.total);

//     return { summaryArray, uniqueNames };
//   }, [productionData]);

//   const topPerformer = summary.summaryArray[0] || { name: 'N/A', total: 0 };
  
//   const getMaxByType = (type) => Math.max(...summary.summaryArray.map(w => w[type] || 0));

//   const dailyEntries = useMemo(() => {
//     if (!selectedWorkerName || !selectedDate) return [];

//     return productionData
//         .filter(entry => entry.name === selectedWorkerName && entry.date === selectedDate)
//         .sort((a, b) => (new Date(b.createdAt?.toDate() || b.date) - new Date(a.createdAt?.toDate() || a.date))); // Ordenar por hora de registro (si está disponible)
//   }, [productionData, selectedWorkerName, selectedDate]);
  
//   // ----------------------------------------------------
//   // VISTA DE INGRESO DE DATOS (TAB 'input')
//   // ----------------------------------------------------
//   const InputSection = () => (
//     <section className="bg-white p-4 shadow-xl rounded-lg border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Registro Diario</h2>
//       <form onSubmit={addProduction} className="space-y-4">
//         <div className="grid grid-cols-1 gap-4">
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Trabajador:</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Nombre (ej. Juan Pérez)"
//               value={newEntry.name}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Registro:</label>
//             <input
//               type="date"
//               name="date"
//               value={newEntry.date}
//               onChange={handleInputChange}
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
        
//         <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
//           <h3 className="text-base font-semibold text-indigo-800 mb-3">Cajas Producidas (Cantidad)</h3>
//           <div className="grid grid-cols-2 gap-3">
//             {['A', 'B', 'C', 'D', 'E'].map((type) => (
//               <div key={type} className="flex items-center space-x-2">
//                 <label className="text-sm font-medium text-gray-700 w-12">Caja {type}:</label>
//                 <input
//                   type="number"
//                   name={`type${type}`}
//                   value={newEntry[`type${type}`]}
//                   onChange={handleInputChange}
//                   min="0"
//                   className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <button 
//           type="submit" 
//           disabled={!isAuthReady || isLoading}
//           className={`w-full px-4 py-2 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//               !isAuthReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//           }`}
//         >
//           {isLoading ? 'Guardando...' : 'Guardar Producción'}
//         </button>
//       </form>
//     </section>
//   );

//   // ----------------------------------------------------
//   // VISTA DE ANÁLISIS/HISTORIAL (TAB 'analysis')
//   // ----------------------------------------------------
//   const AnalysisSection = () => (
//     <div className="space-y-6">
//       {/* Resumen Ejecutivo */}
//       <section className="bg-yellow-50 p-4 rounded-xl shadow-md border-l-4 border-yellow-400">
//         <h2 className="text-base font-bold text-yellow-800 mb-1">🏆 Top Desempeño Acumulado</h2>
//         <p className="text-sm text-yellow-900">
//           El líder es: <strong className="text-lg text-red-600">{topPerformer.name}</strong> con 
//           <span className="text-lg font-extrabold ml-1"> {topPerformer.total}</span> cajas totales.
//         </p>
//       </section>

//       {/* Gráfico */}
//       <section>
//         <h2 className="text-lg font-bold text-gray-700 mb-3">📊 Competitividad General</h2>
//         <ProductivityChart summaryArray={summary.summaryArray} />
//       </section>

//       {/* Tabla de Desempeño por Categoría */}
//       <section className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//         <h2 className="text-lg font-bold text-gray-700 mb-3">📋 Desglose por Caja</h2>
        
//         {summary.summaryArray.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-xs">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left font-semibold text-gray-600">Trabajador</th>
//                   <th className="px-3 py-2 text-center font-semibold text-white bg-blue-600">TOTAL</th>
//                   {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                     <th key={type} className="px-2 py-2 text-center font-semibold text-gray-600">Caja {type}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {summary.summaryArray.map((item, index) => (
//                   <tr 
//                     key={item.name} 
//                     className={index === 0 ? 'bg-yellow-50 font-medium' : 'hover:bg-gray-50'}
//                   >
//                     <td className="px-3 py-2 whitespace-nowrap text-left text-gray-800">{item.name}</td>
//                     <td className="px-3 py-2 whitespace-nowrap text-center font-bold bg-blue-50 text-blue-800">
//                       {item.total}
//                     </td>
//                     {['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
//                       <td key={typeIndex} 
//                           className={`px-2 py-2 whitespace-nowrap text-center ${item[type] === getMaxByType(type) ? 'bg-green-100 font-bold text-green-700' : 'text-gray-600'}`}
//                       >
//                         {item[type]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 italic text-sm">No hay datos para mostrar en la tabla.</p>
//         )}
//       </section>

//       {/* Historial Diario */}
//       <section className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//         <h2 className="text-lg font-bold text-gray-700 mb-4">🔎 Historial Diario</h2>
        
//         <div className="grid grid-cols-2 gap-3 mb-4">
//             <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Trabajador:</label>
//                 <select
//                     value={selectedWorkerName}
//                     onChange={(e) => setSelectedWorkerName(e.target.value)}
//                     className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                 >
//                     <option value="">-- Seleccione --</option>
//                     {summary.uniqueNames.map(name => (
//                         <option key={name} value={name}>{name}</option>
//                     ))}
//                 </select>
//             </div>
//             <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Fecha:</label>
//                 <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full p-2 text-sm border border-gray-300 rounded-lg"
//                 />
//             </div>
//         </div>

//         {selectedWorkerName && dailyEntries.length > 0 ? (
//             <div className="border border-purple-200 rounded-lg p-3 bg-purple-50 space-y-3">
//                 <h3 className="text-base font-bold text-purple-800">
//                     Total de {selectedWorkerName} el {selectedDate}:
//                 </h3>
//                 {/* Resumen diario en formato tarjeta */}
//                 <div className="grid grid-cols-3 gap-2">
//                     {['A', 'B', 'C', 'D', 'E'].map((type) => {
//                         const totalType = dailyEntries.reduce((sum, entry) => sum + (entry[`type${type}`] || 0), 0);
//                         return (
//                             <div key={type} className="p-2 bg-white rounded-lg shadow-sm text-center border border-purple-100">
//                                 <p className="text-xs text-gray-500">Caja {type}</p>
//                                 <p className="text-lg font-extrabold text-purple-600">{totalType}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
                
//                 {/* Detalles de entradas individuales (útil para verificar) */}
//                 <details className="text-sm">
//                     <summary className="font-semibold text-purple-700 cursor-pointer">Ver Entradas Individuales ({dailyEntries.length})</summary>
//                     <ul className="mt-2 space-y-1 p-2 bg-white rounded-md border border-gray-100">
//                         {dailyEntries.map((entry, index) => (
//                             <li key={index} className="flex justify-between items-center text-xs text-gray-700 border-b border-gray-100 last:border-b-0 py-1">
//                                 <span className="font-mono text-[10px] text-gray-500">
//                                     {entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleTimeString() : 'N/A'}
//                                 </span>
//                                 <div className="flex space-x-2">
//                                     {['A', 'B', 'C', 'D', 'E'].map(type => 
//                                         entry[`type${type}`] > 0 ? (
//                                             <span key={type} className="font-bold text-purple-600">
//                                                 C{type}: {entry[`type${type}`]}
//                                             </span>
//                                         ) : null
//                                     )}
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </details>

//             </div>
//         ) : selectedWorkerName && (
//              <p className="text-gray-500 italic p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
//                  No se encontraron entradas para **{selectedWorkerName}** el {selectedDate}.
//              </p>
//         )}

//       </section>

//     </div>
//   );


//   // ----------------------------------------------------
//   // RENDERIZADO PRINCIPAL (JSX con Tailwind)
//   // ----------------------------------------------------
//   return (
//     <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
      
//       {/* Encabezado */}
//       <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 border-b-2 border-indigo-200 pb-3 mb-6">
//         📦 Analizador de Producción Móvil
//       </h1>
      
//       {/* Mensajes de Estado */}
//       {isLoading && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-sm mb-4" role="alert">
//             <span className="animate-spin inline-block mr-2">⚙️</span> Cargando datos en tiempo real...
//         </div>
//       )}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4" role="alert">
//             <span className="font-bold">🚨 Error:</span> {errorMessage}
//         </div>
//       )}

//       {/* Navegación por Pestañas para Móvil */}
//       <div className="flex justify-between bg-white rounded-lg shadow-md mb-6 p-1 border border-gray-200">
//         <button
//           onClick={() => setActiveTab('input')}
//           className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
//             activeTab === 'input' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           📝 Registrar Producción
//         </button>
//         <button
//           onClick={() => setActiveTab('analysis')}
//           className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
//             activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           📈 Ver Análisis
//         </button>
//       </div>

//       {/* Contenido según la Pestaña Activa */}
//       {activeTab === 'input' && <InputSection />}
//       {activeTab === 'analysis' && <AnalysisSection />}
      
//       {/* Info de debug al final */}
//       {userId && (
//           <p className="text-[10px] text-gray-400 mt-6 text-center">
//               ID de Sesión: <span className="font-mono">{userId}</span>
//           </p>
//       )}

//     </div>
//   );
// };

// export default ProductivityAnalyzer;






// import React, { useState, useMemo, useEffect } from 'react';
// // Importaciones de Recharts para el gráfico
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // Importaciones de Firebase Firestore
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// // Asume que la configuración de Firebase está disponible en este archivo
// import { firebaseConfig } from "../../firebaseConfig"; 

// // --- Lógica de la Aplicación Base ---
// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// // ----------------------------------------------------
// // DEFINICIÓN DEL GRÁFICO (ProductivityChart)
// // *Adaptado ligeramente para ser más compacto en móvil*
// // ----------------------------------------------------
// const ProductivityChart = ({ summaryArray }) => {
//   const colors = {
//     typeA: '#8884d8', 
//     typeB: '#82ca9d', 
//     typeC: '#ffc658', 
//     typeD: '#ff7300', 
//     typeE: '#00c49f', 
//   };

//   if (!summaryArray || summaryArray.length === 0) {
//     return (
//       <div className="h-64 sm:h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100">
//         <p className="text-gray-500 italic">No hay datos suficientes para generar el gráfico.</p>
//       </div>
//     );
//   }

//   return (
//     // Altura: 64 en móvil (h-64), 96 en desktop (sm:h-96)
//     <div className="h-64 sm:h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={summaryArray}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//           {/* Tamaño de fuente más pequeño para ejes en móvil (fontSize: 10) */}
//           <XAxis dataKey="name" stroke="#333" tick={{ fill: '#4b5563', fontSize: 10 }} /> 
//           <YAxis stroke="#333" tick={{ fill: '#4b5563', fontSize: 10 }} />
//           <Tooltip 
//             cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//             contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', background: '#fff', fontSize: '12px', padding: '5px' }}
//             labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
//             formatter={(value, name) => [value, name.replace('type', 'Caja ')]}
//           />
//           {/* Leyenda más pequeña en móvil (fontSize: 12px) */}
//           <Legend 
//             wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
//             formatter={(value) => value.replace('type', 'Caja ')}
//           />

//           <Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL: ProductivityAnalyzer
// // ----------------------------------------------------
// const ProductivityAnalyzer = () => {
//   // --- Estados de la Aplicación ---
//   const [productionData, setProductionData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [db, setDb] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAuthReady, setIsAuthReady] = useState(false);
//   // Estado para controlar la pestaña activa en MÓVIL
//   const [activeTab, setActiveTab] = useState('input'); 
  
//   const [newEntry, setNewEntry] = useState({ 
//     name: '', 
//     date: new Date().toISOString().split('T')[0],
//     typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
//   });

//   const [selectedWorkerName, setSelectedWorkerName] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   // --- Inicialización y Suscripción a Firebase (sin cambios funcionales) ---
//   useEffect(() => {
//     try {
//       if (Object.keys(firebaseConfig).length === 0) throw new Error("Firebase config not available.");
//       const app = initializeApp(firebaseConfig);
//       const firestore = getFirestore(app);
//       const firebaseAuth = getAuth(app);
//       setDb(firestore);

//       onAuthStateChanged(firebaseAuth, async (user) => {
//         if (!user) {
//           try { await signInAnonymously(firebaseAuth); } catch (e) { console.error("Firebase auth error:", e); }
//         }
//         setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
//         setIsAuthReady(true);
//       });
//     } catch (e) {
//       console.error("Firebase Initialization Error:", e);
//       setErrorMessage("Error al inicializar la base de datos.");
//       setIsAuthReady(true);
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!db || !isAuthReady) return;

//     const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//     const entriesCollection = collection(db, collectionPath);
//     const q = query(entriesCollection); 

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const entries = [];
//       snapshot.forEach((doc) => {
//         entries.push({ id: doc.id, ...doc.data() });
//       });
//       setProductionData(entries);
//       setIsLoading(false);

//       if (entries.length > 0 && !selectedWorkerName) {
//         const uniqueNames = [...new Set(entries.map(e => e.name))];
//         setSelectedWorkerName(uniqueNames[0]);
//       }
//     }, (error) => {
//       console.error("Firestore data snapshot error:", error);
//       setErrorMessage("Error al cargar los datos de la base de datos.");
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, [db, isAuthReady, selectedWorkerName]); // Incluimos selectedWorkerName en dependencies

//   // --- Handlers y Lógica (sin cambios funcionales) ---
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     setNewEntry({
//       ...newEntry,
//       [name]: type === 'number' ? parseInt(value) || 0 : value,
//     });
//   };

//   const addProduction = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     if (!newEntry.name || newEntry.name.trim() === '') { setErrorMessage('Por favor, ingresa un nombre.'); return; }
//     if (!db) { setErrorMessage('La base de datos no está lista.'); return; }
    
//     try {
//         const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//         await addDoc(collection(db, collectionPath), {
//             ...newEntry,
//             typeA: newEntry.typeA || 0, typeB: newEntry.typeB || 0,
//             typeC: newEntry.typeC || 0, typeD: newEntry.typeD || 0,
//             typeE: newEntry.typeE || 0,
//             userId: userId,
//             createdAt: serverTimestamp(),
//         });
//         setNewEntry(prev => ({ 
//             name: prev.name, date: prev.date, 
//             typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
//         }));
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         setErrorMessage('Error al registrar la producción: ' + error.message);
//     }
//   };

//   const summary = useMemo(() => {
//     const uniqueNames = [...new Set(productionData.map(e => e.name))].sort();
//     const totals = productionData.reduce((acc, entry) => {
//       const entryA = Number(entry.typeA) || 0; const entryB = Number(entry.typeB) || 0;
//       const entryC = Number(entry.typeC) || 0; const entryD = Number(entry.typeD) || 0;
//       const entryE = Number(entry.typeE) || 0;
//       if (!acc[entry.name]) acc[entry.name] = { total: 0, typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 };
//       acc[entry.name].typeA += entryA; acc[entry.name].typeB += entryB;
//       acc[entry.name].typeC += entryC; acc[entry.name].typeD += entryD;
//       acc[entry.name].typeE += entryE;
//       acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;
//       return acc;
//     }, {});
//     const summaryArray = Object.entries(totals)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.total - a.total);
//     return { summaryArray, uniqueNames };
//   }, [productionData]);

//   const topPerformer = summary.summaryArray[0] || { name: 'N/A', total: 0 };
//   const getMaxByType = (type) => Math.max(...summary.summaryArray.map(w => w[type] || 0));

//   const dailyEntries = useMemo(() => {
//     if (!selectedWorkerName || !selectedDate) return [];
//     return productionData
//         .filter(entry => entry.name === selectedWorkerName && entry.date === selectedDate)
//         .sort((a, b) => (new Date(a.date) - new Date(b.date))); 
//   }, [productionData, selectedWorkerName, selectedDate]);
  
//   // ----------------------------------------------------
//   // SUB-COMPONENTE: SECCIÓN 1 - INGRESO DE DATOS 📝
//   // Adaptado para ser más compacto en móvil (p-4, text-sm)
//   // ----------------------------------------------------
//   const InputSection = () => (
//     <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8 sm:mb-0">
//       <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">➕ Registrar Producción</h2>
//       <form onSubmit={addProduction} className="space-y-4 sm:space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Nombre del Trabajador"
//               value={newEntry.name}
//               onChange={handleInputChange}
//               required
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro:</label>
//             <input
//               type="date"
//               name="date"
//               value={newEntry.date}
//               onChange={handleInputChange}
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
        
//         <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
//           <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-3 sm:mb-4">Cajas por Tipo (Cantidad)</h3>
//           {/* GRID: 2 columnas en móvil (default), 5 en desktop (lg:grid-cols-5) */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
//             {['A', 'B', 'C', 'D', 'E'].map((type) => (
//               <div key={type}>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tipo {type}:</label>
//                 <input
//                   type="number"
//                   name={`type${type}`}
//                   value={newEntry[`type${type}`]}
//                   onChange={handleInputChange}
//                   min="0"
//                   className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <button 
//           type="submit" 
//           disabled={!isAuthReady || isLoading}
//           className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//               !isAuthReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//           }`}
//         >
//           {isLoading ? 'Guardando...' : 'Registrar Entrada'}
//         </button>
//       </form>
//     </section>
//   );

//   // ----------------------------------------------------
//   // SUB-COMPONENTE: SECCIONES DE ANÁLISIS 📈
//   // Incluye Resumen, Gráfico, Historial y Tabla
//   // ----------------------------------------------------
//   const AnalysisSection = () => (
//     <div className="space-y-6 sm:space-y-8">
      
//       {/* SECCIÓN 2: Resumen Ejecutivo */}
//       <section className="bg-yellow-100 p-4 sm:p-6 rounded-lg shadow-inner border border-yellow-300">
//         <h2 className="text-xl sm:text-2xl font-semibold text-yellow-800 mb-3">⭐ Resumen General Acumulado</h2>
//         <p className="text-base sm:text-lg text-yellow-900">
//           El trabajador más productivo es: 
//           <strong className="text-xl sm:text-2xl text-red-600 ml-2">{topPerformer.name}</strong> con 
//           <span className="text-xl sm:text-2xl font-extrabold ml-1"> {topPerformer.total}</span> cajas.
//         </p>
//       </section>

//       {/* SECCIÓN 3: CANVAS / GRÁFICO */}
//       <section>
//         <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">📊 Visualización de Competitividad</h2>
//         <ProductivityChart summaryArray={summary.summaryArray} />
//       </section>

//       <hr className="border-t-2 border-gray-300 my-6 sm:my-8" />
      
//       {/* SECCIÓN 5: Vista de Historial Diario */}
//       <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 border-b pb-2">🗓️ Historial por Trabajador y Fecha</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Trabajador:</label>
//                 <select
//                     value={selectedWorkerName}
//                     onChange={(e) => setSelectedWorkerName(e.target.value)}
//                     className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 >
//                     <option value="">-- Seleccione un trabajador --</option>
//                     {summary.uniqueNames.map(name => (
//                         <option key={name} value={name}>{name}</option>
//                     ))}
//                 </select>
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Fecha:</label>
//                 <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//             </div>
//         </div>

//         {selectedWorkerName && dailyEntries.length > 0 ? (
//             <div className="border border-indigo-200 rounded-lg p-3 sm:p-4 bg-indigo-50">
//                 <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-3">
//                     Producción de {selectedWorkerName} el {selectedDate}
//                 </h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
//                     {['A', 'B', 'C', 'D', 'E'].map((type) => {
//                         const totalType = dailyEntries.reduce((sum, entry) => sum + (entry[`type${type}`] || 0), 0);
//                         return (
//                             <div key={type} className="p-3 bg-white rounded-lg shadow text-center">
//                                 <p className="text-xs sm:text-sm text-gray-500">Caja {type}</p>
//                                 <p className="text-xl sm:text-2xl font-extrabold text-indigo-600">{totalType}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         ) : selectedWorkerName && (
//              <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
//                  No se encontraron entradas para {selectedWorkerName} en la fecha {selectedDate}.
//              </p>
//         )}

//       </section>

//       <hr className="border-t-2 border-gray-300 my-6 sm:my-8" />

//       {/* SECCIÓN 4: Tabla de Análisis */}
//       <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg">
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">🥇 Desempeño por Categoría (Acumulado)</h2>
        
//         {summary.summaryArray.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tl-lg">Trabajador</th>
//                   <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-blue-800">TOTAL</th>
//                   {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                     <th key={type} className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">Caja {type}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {summary.summaryArray.map((item, index) => (
//                   <tr 
//                     key={item.name} 
//                     className={index === 0 ? 'bg-yellow-50 font-bold border-l-4 border-yellow-500' : 'hover:bg-gray-100'}
//                   >
//                     <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-left text-gray-900">{item.name}</td>
                    
//                     <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm sm:text-lg font-extrabold bg-blue-100 text-blue-900">
//                       {item.total}
//                     </td>
                    
//                     {['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
//                       <td key={typeIndex} 
//                           className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm ${item[type] === getMaxByType(type) ? 'bg-green-100 font-bold text-green-800' : 'text-gray-700'}`}
//                       >
//                         {item[type]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 italic text-sm">No hay datos de producción registrados aún.</p>
//         )}
//       </section>
//     </div>
//   );


//   // ----------------------------------------------------
//   // RENDERIZADO PRINCIPAL (Control de Responsividad con Tailwind)
//   // ----------------------------------------------------
//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      
//       <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 border-b-4 border-blue-200 pb-3 mb-6 sm:mb-8">
//         📦 Analizador de Productividad (Real-Time)
//       </h1>
      
//       {/* Mensajes de Estado y Error */}
//       {isLoading && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
//             <span className="animate-spin inline-block mr-2">⚙️</span> Cargando datos en tiempo real...
//         </div>
//       )}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
//             <span className="font-bold">🚨 Error:</span> {errorMessage}
//         </div>
//       )}

//       {/* 1. VISTA MÓVIL (Menos de 640px) - CON PESTAÑAS */}
//       <div className="sm:hidden">
        
//         {/* Navegación por Pestañas */}
//         <div className="flex justify-between bg-white rounded-lg shadow-md mb-6 p-1 border border-gray-200">
//             <button
//               onClick={() => setActiveTab('input')}
//               className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
//                 activeTab === 'input' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               📝 Registrar
//             </button>
//             <button
//               onClick={() => setActiveTab('analysis')}
//               className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
//                 activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               📈 Análisis
//             </button>
//         </div>

//         {/* Contenido de la Pestaña Activa */}
//         {activeTab === 'input' && <InputSection />}
//         {activeTab === 'analysis' && <AnalysisSection />}

//       </div>

//       {/* 2. VISTA ESCRITORIO/TABLET (640px o más) - TODO APILADO */}
//       <div className="hidden sm:block">
//         <InputSection />
//         <hr className="border-t-2 border-gray-300 my-8" />
//         <AnalysisSection />
//       </div>
      
//       {/* Info de debug al final */}
//       {userId && (
//           <p className="text-xs text-gray-500 mt-6 text-center">
//               ID de Sesión: <span className="font-mono text-gray-700">{userId}</span>
//           </p>
//       )}

//     </div>
//   );
// };

// export default ProductivityAnalyzer;



// import React, { useState, useMemo, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// import { firebaseConfig } from "../../firebaseConfig";

// const getAppId = () => {
//   if (typeof window.__app_id !== "undefined") {
//     return window.__app_id;
//   }
//   return "default-calendar-app-id";
// };
// const appId = getAppId();

// // ----------------------------------------------------
// // DEFINICIÓN DEL GRÁFICO (ProductivityChart)
// // ----------------------------------------------------
// const ProductivityChart = ({ summaryArray }) => {
//   const colors = {
//     typeA: '#8884d8',
//     typeB: '#82ca9d',
//     typeC: '#ffc658',
//     typeD: '#ff7300',
//     typeE: '#00c49f',
//   };

//   if (!summaryArray || summaryArray.length === 0) {
//     return (
//       <div className="h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100">
//         <p className="text-gray-500 italic">No hay datos suficientes para generar el gráfico.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={summaryArray}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//           <XAxis dataKey="name" stroke="#333" tick={{ fill: '#4b5563', fontSize: 12 }} />
//           <YAxis stroke="#333" tick={{ fill: '#4b5563', fontSize: 12 }} />
//           <Tooltip 
//             cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//             contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', background: '#fff', fontSize: '14px' }}
//             labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
//             formatter={(value, name) => [value, name.replace('type', 'Caja ')]}
//           />
//           <Legend 
//             wrapperStyle={{ paddingTop: '10px' }} 
//             formatter={(value) => value.replace('type', 'Caja ')}
//           />

//           <Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[4, 4, 0, 0]} />
//           <Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[4, 4, 0, 0]} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // ----------------------------------------------------
// // COMPONENTE PRINCIPAL: ProductivityAnalyzer
// // ----------------------------------------------------
// const ProductivityAnalyzer = () => {
//   const [productionData, setProductionData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [db, setDb] = useState(null);
//   const [auth, setAuth] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAuthReady, setIsAuthReady] = useState(false);
  
//   const [newEntry, setNewEntry] = useState({ 
//     name: '', 
//     date: new Date().toISOString().split('T')[0],
//     typeA: 0, 
//     typeB: 0, 
//     typeC: 0, 
//     typeD: 0, 
//     typeE: 0 
//   });

//   const [selectedWorkerName, setSelectedWorkerName] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   // Inicialización y Autenticación Anónima de Firebase
//   useEffect(() => {
//     try {
//       if (Object.keys(firebaseConfig).length === 0) {
//         throw new Error("Firebase config not available.");
//       }
//       const app = initializeApp(firebaseConfig);
//       const firestore = getFirestore(app);
//       const firebaseAuth = getAuth(app);
//       setDb(firestore);
//       setAuth(firebaseAuth);

//       onAuthStateChanged(firebaseAuth, async (user) => {
//         if (!user) {
//           try {
//             await signInAnonymously(firebaseAuth);
//           } catch (e) {
//             console.error("Firebase auth error:", e);
//           }
//         }
//         setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
//         setIsAuthReady(true);
//       });
      
//     } catch (e) {
//       console.error("Firebase Initialization Error:", e);
//       setErrorMessage("Error al inicializar la base de datos.");
//       setIsAuthReady(true);
//       setIsLoading(false);
//     }
//   }, []);

//   // Suscripción a los datos de Firestore (onSnapshot) - CORREGIDO
//   // Solo actualiza productionData.
//   useEffect(() => {
//     if (!db || !isAuthReady) return;

//     const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//     const entriesCollection = collection(db, collectionPath);
//     const q = query(entriesCollection); 

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const entries = [];
//       snapshot.forEach((doc) => {
//         entries.push({ id: doc.id, ...doc.data() });
//       });
      
//       // Actualización de datos (fuerza un re-render)
//       setProductionData(entries);
//       setIsLoading(false);
      
//     }, (error) => {
//       console.error("Firestore data snapshot error:", error);
//       setErrorMessage("Error al cargar los datos de la base de datos.");
//       setIsLoading(false);
//     });

//     // selectedWorkerName eliminado de las dependencias.
//     return () => unsubscribe();
//   }, [db, isAuthReady]); 

//   // NUEVO useEffect: Inicialización de selectedWorkerName
//   // Se encarga de seleccionar el primer trabajador solo la primera vez.
//   useEffect(() => {
//     if (productionData.length > 0 && !selectedWorkerName) {
//       const uniqueNames = [...new Set(productionData.map(e => e.name))];
//       setSelectedWorkerName(uniqueNames[0]);
//     }
//   }, [productionData, selectedWorkerName]);


//   // Handlers y Lógica
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     setNewEntry({
//       ...newEntry,
//       [name]: type === 'number' ? parseInt(value) || 0 : value,
//     });
//   };

//   const addProduction = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!newEntry.name || newEntry.name.trim() === '') {
//       setErrorMessage('Por favor, ingresa un nombre.');
//       return;
//     }
    
//     if (!db) {
//         setErrorMessage('La base de datos no está lista.');
//         return;
//     }
    
//     try {
//         const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
//         await addDoc(collection(db, collectionPath), {
//             ...newEntry,
//             typeA: newEntry.typeA || 0, 
//             typeB: newEntry.typeB || 0,
//             typeC: newEntry.typeC || 0,
//             typeD: newEntry.typeD || 0,
//             typeE: newEntry.typeE || 0,
//             userId: userId,
//             createdAt: serverTimestamp(),
//         });

//         // Mantiene el nombre del trabajador para evitar que el input pierda foco.
//         setNewEntry(prev => ({ 
//             name: prev.name, 
//             date: prev.date, 
//             typeA: 0, 
//             typeB: 0, 
//             typeC: 0, 
//             typeD: 0, 
//             typeE: 0 
//         }));
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         setErrorMessage('Error al registrar la producción: ' + error.message);
//     }
//   };


//   // Lógica de Análisis y Agrupación
//   const summary = useMemo(() => {
//     const uniqueNames = [...new Set(productionData.map(e => e.name))].sort();

//     const totals = productionData.reduce((acc, entry) => {
//       const entryA = Number(entry.typeA) || 0;
//       const entryB = Number(entry.typeB) || 0;
//       const entryC = Number(entry.typeC) || 0;
//       const entryD = Number(entry.typeD) || 0;
//       const entryE = Number(entry.typeE) || 0;

//       if (!acc[entry.name]) {
//         acc[entry.name] = { 
//           total: 0, typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
//         };
//       }

//       acc[entry.name].typeA += entryA;
//       acc[entry.name].typeB += entryB;
//       acc[entry.name].typeC += entryC;
//       acc[entry.name].typeD += entryD;
//       acc[entry.name].typeE += entryE;

//       acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;

//       return acc;
//     }, {});

//     const summaryArray = Object.entries(totals)
//       .map(([name, data]) => ({ name, ...data }))
//       .sort((a, b) => b.total - a.total);

//     return { summaryArray, uniqueNames };
//   }, [productionData]);

//   const topPerformer = summary.summaryArray[0] || { name: 'N/A', total: 0 };
  
//   const getMaxByType = (type) => Math.max(...summary.summaryArray.map(w => w[type] || 0));

//   const dailyEntries = useMemo(() => {
//     if (!selectedWorkerName || !selectedDate) return [];

//     return productionData
//         .filter(entry => entry.name === selectedWorkerName && entry.date === selectedDate)
//         .sort((a, b) => (new Date(a.date) - new Date(b.date))); 
//   }, [productionData, selectedWorkerName, selectedDate]);
  
//   // ----------------------------------------------------
//   // RENDERIZADO (JSX con Tailwind)
//   // ----------------------------------------------------
//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
//       <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 border-b-4 border-blue-200 pb-3 mb-8">
//         📦 Analizador de Productividad (Real-Time)
//       </h1>
      
//       {/* Mensajes de estado y error */}
//       {isLoading && (
//         <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
//             Cargando datos...
//         </div>
//       )}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="font-bold">Error:</span> {errorMessage}
//         </div>
//       )}
//       {userId && (
//           <p className="text-xs text-gray-500 mb-4">
//               ID de Sesión: <span className="font-mono text-gray-700">{userId}</span>
//           </p>
//       )}

      
//       {/* SECCIÓN 1: Ingreso de Datos */}
//       <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">➕ Registrar Producción</h2>
//         <form onSubmit={addProduction} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Nombre del Trabajador"
//                 value={newEntry.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro:</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={newEntry.date}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h3 className="text-lg font-medium text-blue-800 mb-4">Cajas por Tipo (Cantidad)</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//               {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                 <div key={type}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Tipo {type}:</label>
//                   <input
//                     type="number"
//                     name={`type${type}`}
//                     value={newEntry[`type${type}`]}
//                     onChange={handleInputChange}
//                     min="0"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <button 
//             type="submit" 
//             disabled={!isAuthReady || isLoading}
//             className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${
//                 !isAuthReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Guardando...' : 'Registrar Entrada'}
//           </button>
//         </form>
//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />
      
//       {/* SECCIÓN 5: Vista de Historial Diario */}
//       <section className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">🗓️ Historial por Trabajador y Fecha</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Trabajador:</label>
//                 <select
//                     value={selectedWorkerName}
//                     onChange={(e) => setSelectedWorkerName(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 >
//                     <option value="">-- Seleccione un trabajador --</option>
//                     {summary.uniqueNames.map(name => (
//                         <option key={name} value={name}>{name}</option>
//                     ))}
//                 </select>
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Fecha:</label>
//                 <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//             </div>
//         </div>

//         {selectedWorkerName && dailyEntries.length > 0 ? (
//             <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
//                 <h3 className="text-xl font-bold text-indigo-800 mb-3">
//                     Producción de {selectedWorkerName} el {selectedDate}
//                 </h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                     {['A', 'B', 'C', 'D', 'E'].map((type) => {
//                         const totalType = dailyEntries.reduce((sum, entry) => sum + (entry[`type${type}`] || 0), 0);
//                         return (
//                             <div key={type} className="p-3 bg-white rounded-lg shadow text-center">
//                                 <p className="text-sm text-gray-500">Caja {type}</p>
//                                 <p className="text-2xl font-extrabold text-indigo-600">{totalType}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         ) : selectedWorkerName && (
//              <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50">
//                  No se encontraron entradas para {selectedWorkerName} en la fecha {selectedDate}.
//              </p>
//         )}

//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />

//       {/* SECCIÓN 2: Resumen Ejecutivo */}
//       <section className="bg-yellow-100 p-6 rounded-lg shadow-inner mb-8 border border-yellow-300">
//         <h2 className="text-2xl font-semibold text-yellow-800 mb-3">⭐ Resumen General Acumulado</h2>
//         <p className="text-lg text-yellow-900">
//           El trabajador más productivo (por volumen total histórico) es: 
//           <strong className="text-2xl text-red-600 ml-2">{topPerformer.name}</strong> con 
//           <span className="text-2xl font-extrabold ml-1"> {topPerformer.total}</span> cajas.
//         </p>
//       </section>

//       {/* SECCIÓN 3: CANVAS / GRÁFICO */}
//       <section className="mb-8">
//         <h2 className="text-3xl font-bold text-blue-800 mb-6">📊 Visualización de Competitividad (Acumulado)</h2>
//         <ProductivityChart summaryArray={summary.summaryArray} />
//       </section>

//       <hr className="border-t-2 border-gray-300 my-8" />

//       {/* SECCIÓN 4: Tabla de Análisis */}
//       <section className="bg-white p-6 shadow-xl rounded-lg">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">🥇 Desempeño por Categoría (Acumulado)</h2>
        
//         {summary.summaryArray.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">Trabajador</th>
//                   <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider bg-blue-800">TOTAL GENERAL</th>
//                   {['A', 'B', 'C', 'D', 'E'].map((type) => (
//                     <th key={type} className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Caja {type}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {summary.summaryArray.map((item, index) => (
//                   <tr 
//                     key={item.name} 
//                     className={index === 0 ? 'bg-yellow-50 font-bold border-l-4 border-yellow-500' : 'hover:bg-gray-100'}
//                   >
//                     <td className="px-4 py-3 whitespace-nowrap text-left text-gray-900">{item.name}</td>
                    
//                     <td className="px-4 py-3 whitespace-nowrap text-center text-lg font-extrabold bg-blue-100 text-blue-900">
//                       {item.total}
//                     </td>
                    
//                     {['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
//                       <td key={typeIndex} 
//                           className={`px-4 py-3 whitespace-nowrap text-center ${item[type] === getMaxByType(type) ? 'bg-green-100 font-bold text-green-800' : 'text-gray-700'}`}
//                       >
//                         {item[type]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 italic">No hay datos de producción registrados aún.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default ProductivityAnalyzer;

















// import React,{useState,useMemo,useEffect}from'react';
// import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer}from'recharts';
// import{initializeApp}from'firebase/app';
// import{getAuth,signInAnonymously,onAuthStateChanged}from'firebase/auth';
// import{getFirestore,collection,query,onSnapshot,addDoc,serverTimestamp}from'firebase/firestore';
// import{firebaseConfig}from"../../firebaseConfig";
// const getAppId=()=>{if(typeof window.__app_id!=="undefined"){return window.__app_id;}return"default-calendar-app-id";};
// const appId=getAppId();
// const ProductivityChart=({summaryArray})=>{
// const colors={typeA:'#8884d8',typeB:'#82ca9d',typeC:'#ffc658',typeD:'#ff7300',typeE:'#00c49f',};
// if(!summaryArray||summaryArray.length===0){return(<div className="h-64 sm:h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100"><p className="text-gray-500 italic">No hay datos suficientes para generar el gráfico.</p></div>);}
// return(<div className="h-64 sm:h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
// <ResponsiveContainer width="100%" height="100%">
// <BarChart data={summaryArray} margin={{top:20,right:30,left:20,bottom:5}}>
// <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
// <XAxis dataKey="name" stroke="#333" tick={{fill:'#4b5563',fontSize:10}}/>
// <YAxis stroke="#333" tick={{fill:'#4b5563',fontSize:10}}/>
// <Tooltip cursor={{fill:'rgba(0,0,0,0.05)'}}contentStyle={{borderRadius:'8px',border:'1px solid #ccc',background:'#fff',fontSize:'12px',padding:'5px'}}labelStyle={{fontWeight:'bold',color:'#1f2937'}}formatter={(value,name)=>[value,name.replace('type','Caja ')]}/>
// <Legend wrapperStyle={{paddingTop:'10px',fontSize:'12px'}}formatter={(value)=>value.replace('type','Caja ')}/>
// <Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[4,4,0,0]}/>
// <Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[4,4,0,0]}/>
// <Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[4,4,0,0]}/>
// <Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[4,4,0,0]}/>
// <Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[4,4,0,0]}/>
// </BarChart>
// </ResponsiveContainer>
// </div>);
// };

// const ProductivityAnalyzer=()=>{
// const[productionData,setProductionData]=useState([]);
// const[errorMessage,setErrorMessage]=useState('');
// const[isLoading,setIsLoading]=useState(true);
// const[db,setDb]=useState(null);
// const[userId,setUserId]=useState(null);
// const[isAuthReady,setIsAuthReady]=useState(false);
// const[activeTab,setActiveTab]=useState('input');
// const[newEntry,setNewEntry]=useState({name:'',date:new Date().toISOString().split('T')[0],typeA:0,typeB:0,typeC:0,typeD:0,typeE:0});
// const[selectedWorkerName,setSelectedWorkerName]=useState('');
// const[selectedDate,setSelectedDate]=useState(new Date().toISOString().split('T')[0]);

// useEffect(()=>{
// try{
// if(Object.keys(firebaseConfig).length===0)throw new Error("Firebase config not available.");
// const app=initializeApp(firebaseConfig);
// const firestore=getFirestore(app);
// const firebaseAuth=getAuth(app);
// setDb(firestore);
// onAuthStateChanged(firebaseAuth,async(user)=>{
// if(!user){try{await signInAnonymously(firebaseAuth);}catch(e){console.error("Firebase auth error:",e);}}
// setUserId(firebaseAuth.currentUser?.uid||'anonymous');
// setIsAuthReady(true);
// });
// }catch(e){console.error("Firebase Initialization Error:",e);setErrorMessage("Error al inicializar la base de datos.");setIsAuthReady(true);setIsLoading(false);}
// },[]);

// useEffect(()=>{
// if(!db||!isAuthReady)return;
// const collectionPath=`artifacts/${appId}/public/data/productivityEntries`;
// const entriesCollection=collection(db,collectionPath);
// const q=query(entriesCollection); 
// const unsubscribe=onSnapshot(q,(snapshot)=>{
// const entries=[];
// snapshot.forEach((doc)=>{entries.push({id:doc.id,...doc.data()});});
// setProductionData(entries);
// setIsLoading(false);
// },(error)=>{
// console.error("Firestore data snapshot error:",error);
// setErrorMessage("Error al cargar los datos de la base de datos.");
// setIsLoading(false);
// });
// return()=>unsubscribe();
// },[db,isAuthReady]);

// useEffect(()=>{
// if(productionData.length>0&&!selectedWorkerName){
// const uniqueNames=[...new Set(productionData.map(e=>e.name))];
// setSelectedWorkerName(uniqueNames[0]);
// }
// },[productionData,selectedWorkerName]);

// const handleInputChange=(e)=>{
// const{name,value,type}=e.target;
// setNewEntry({...newEntry,[name]:type==='number'?parseInt(value)||0:value,});
// };

// const addProduction=async(e)=>{
// e.preventDefault();
// setErrorMessage('');
// if(!newEntry.name||newEntry.name.trim()===''){{setErrorMessage('Por favor, ingresa un nombre.');return;}}
// if(!db){setErrorMessage('La base de datos no está lista.');return;}
// try{
// const collectionPath=`artifacts/${appId}/public/data/productivityEntries`;
// await addDoc(collection(db,collectionPath),{
// ...newEntry,
// typeA:newEntry.typeA||0,typeB:newEntry.typeB||0,
// typeC:newEntry.typeC||0,typeD:newEntry.typeD||0,
// typeE:newEntry.typeE||0,
// userId:userId,
// createdAt:serverTimestamp(),
// });
// setNewEntry(prev=>({name:prev.name,date:prev.date,typeA:0,typeB:0,typeC:0,typeD:0,typeE:0}));
// }catch(error){
// console.error("Error adding document: ",error);
// setErrorMessage('Error al registrar la producción: '+error.message);
// }
// };

// const summary=useMemo(()=>{
// const uniqueNames=[...new Set(productionData.map(e=>e.name))].sort();
// const totals=productionData.reduce((acc,entry)=>{
// const entryA=Number(entry.typeA)||0;const entryB=Number(entry.typeB)||0;
// const entryC=Number(entry.typeC)||0;const entryD=Number(entry.typeD)||0;
// const entryE=Number(entry.typeE)||0;
// if(!acc[entry.name])acc[entry.name]={total:0,typeA:0,typeB:0,typeC:0,typeD:0,typeE:0};
// acc[entry.name].typeA+=entryA;acc[entry.name].typeB+=entryB;
// acc[entry.name].typeC+=entryC;acc[entry.name].typeD+=entryD;
// acc[entry.name].typeE+=entryE;
// acc[entry.name].total+=entryA+entryB+entryC+entryD+entryE;
// return acc;
// },{});
// const summaryArray=Object.entries(totals)
// .map(([name,data])=>({name,...data}))
// .sort((a,b)=>b.total-a.total);
// return{summaryArray,uniqueNames};
// },[productionData]);

// const topPerformer=summary.summaryArray[0]||{name:'N/A',total:0};
// const getMaxByType=(type)=>Math.max(...summary.summaryArray.map(w=>w[type]||0));

// const dailyEntries=useMemo(()=>{
// if(!selectedWorkerName||!selectedDate)return[];
// return productionData
// .filter(entry=>entry.name===selectedWorkerName&&entry.date===selectedDate)
// .sort((a,b)=>(new Date(a.date)-new Date(b.date))); 
// },[productionData,selectedWorkerName,selectedDate]);

// const InputSection=()=>(
// <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8 sm:mb-0">
// <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">➕ Registrar Producción</h2>
// <form onSubmit={addProduction} className="space-y-4 sm:space-y-6">
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// <div>
// <label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
// <input type="text" name="name" placeholder="Nombre del Trabajador" value={newEntry.name} onChange={handleInputChange} required className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
// </div>
// <div>
// <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro:</label>
// <input type="date" name="date" value={newEntry.date} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
// </div>
// </div>
// <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
// <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-3 sm:mb-4">Cajas por Tipo (Cantidad)</h3>
// <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
// {['A','B','C','D','E'].map((type)=>(
// <div key={type}>
// <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tipo {type}:</label>
// <input type="number" name={`type${type}`} value={newEntry[`type${type}`]} onChange={handleInputChange} min="0" className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
// </div>
// ))}
// </div>
// </div>
// <button type="submit" disabled={!isAuthReady||isLoading}className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${!isAuthReady||isLoading?'bg-gray-400 cursor-not-allowed':'bg-green-600 hover:bg-green-700'}`}>
// {isLoading?'Guardando...':'Registrar Entrada'}
// </button>
// </form>
// </section>
// );

// const AnalysisSection=()=>(
// <div className="space-y-6 sm:space-y-8">
// <section className="bg-yellow-100 p-4 sm:p-6 rounded-lg shadow-inner border border-yellow-300">
// <h2 className="text-xl sm:text-2xl font-semibold text-yellow-800 mb-3">⭐ Resumen General Acumulado</h2>
// <p className="text-base sm:text-lg text-yellow-900">
// El trabajador más productivo es: 
// <strong className="text-xl sm:text-2xl text-red-600 ml-2">{topPerformer.name}</strong> con 
// <span className="text-xl sm:text-2xl font-extrabold ml-1"> {topPerformer.total}</span> cajas.
// </p>
// </section>
// <section>
// <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">📊 Visualización de Competitividad</h2>
// <ProductivityChart summaryArray={summary.summaryArray}/>
// </section>
// <hr className="border-t-2 border-gray-300 my-6 sm:my-8"/>
// <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
// <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 border-b pb-2">🗓️ Historial por Trabajador y Fecha</h2>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// <div>
// <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Trabajador:</label>
// <select value={selectedWorkerName} onChange={(e)=>setSelectedWorkerName(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
// <option value="">-- Seleccione un trabajador --</option>
// {summary.uniqueNames.map(name=>(<option key={name} value={name}>{name}</option>))}
// </select>
// </div>
// <div>
// <label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Fecha:</label>
// <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
// </div>
// </div>
// {selectedWorkerName&&dailyEntries.length>0?(
// <div className="border border-indigo-200 rounded-lg p-3 sm:p-4 bg-indigo-50">
// <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-3">
// Producción de {selectedWorkerName} el {selectedDate}
// </h3>
// <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
// {['A','B','C','D','E'].map((type)=>{
// const totalType=dailyEntries.reduce((sum,entry)=>sum+(entry[`type${type}`]||0),0);
// return(<div key={type} className="p-3 bg-white rounded-lg shadow text-center">
// <p className="text-xs sm:text-sm text-gray-500">Caja {type}</p>
// <p className="text-xl sm:text-2xl font-extrabold text-indigo-600">{totalType}</p>
// </div>);
// })}
// </div>
// </div>
// ):selectedWorkerName&&(
// <p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
// No se encontraron entradas para {selectedWorkerName} en la fecha {selectedDate}.
// </p>
// )}
// </section>
// <hr className="border-t-2 border-gray-300 my-6 sm:my-8"/>
// <section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg">
// <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">🥇 Desempeño por Categoría (Acumulado)</h2>
// {summary.summaryArray.length>0?(
// <div className="overflow-x-auto">
// <table className="min-w-full divide-y divide-gray-200 text-sm">
// <thead className="bg-blue-600 text-white">
// <tr>
// <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tl-lg">Trabajador</th>
// <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-blue-800">TOTAL</th>
// {['A','B','C','D','E'].map((type)=>(
// <th key={type} className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">Caja {type}</th>
// ))}
// </tr>
// </thead>
// <tbody className="bg-white divide-y divide-gray-200">
// {summary.summaryArray.map((item,index)=>(
// <tr key={item.name} className={index===0?'bg-yellow-50 font-bold border-l-4 border-yellow-500':'hover:bg-gray-100'}>
// <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-left text-gray-900">{item.name}</td>
// <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm sm:text-lg font-extrabold bg-blue-100 text-blue-900">
// {item.total}
// </td>
// {['typeA','typeB','typeC','typeD','typeE'].map((type,typeIndex)=>(
// <td key={typeIndex} className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm ${item[type]===getMaxByType(type)?'bg-green-100 font-bold text-green-800':'text-gray-700'}`}>
// {item[type]}
// </td>
// ))}
// </tr>
// ))}
// </tbody>
// </table>
// </div>
// ):(<p className="text-gray-500 italic text-sm">No hay datos de producción registrados aún.</p>)}
// </section>
// </div>
// );

// return(
// <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
// <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 border-b-4 border-blue-200 pb-3 mb-6 sm:mb-8">
// 📦 Analizador de Productividad (Real-Time)
// </h1>
// {isLoading&&(
// <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
// <span className="animate-spin inline-block mr-2">⚙️</span> Cargando datos en tiempo real...
// </div>
// )}
// {errorMessage&&(
// <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
// <span className="font-bold">🚨 Error:</span> {errorMessage}
// </div>
// )}
// <div className="sm:hidden">
// <div className="flex justify-between bg-white rounded-lg shadow-md mb-6 p-1 border border-gray-200">
// <button
// onClick={()=>setActiveTab('input')}
// className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
// activeTab==='input'?'bg-indigo-600 text-white shadow-indigo-400 shadow-md':'text-gray-600 hover:bg-gray-100'
// }`}
// >
// 📝 Registrar
// </button>
// <button
// onClick={()=>setActiveTab('analysis')}
// className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${
// activeTab==='analysis'?'bg-indigo-600 text-white shadow-indigo-400 shadow-md':'text-gray-600 hover:bg-gray-100'
// }`}
// >
// 📈 Análisis
// </button>
// </div>
// {activeTab==='input'&&<InputSection/>}
// {activeTab==='analysis'&&<AnalysisSection/>}
// </div>
// <div className="hidden sm:block">
// <InputSection/>
// <hr className="border-t-2 border-gray-300 my-8"/>
// <AnalysisSection/>
// </div>
// {userId&&(
// <p className="text-xs text-gray-500 mt-6 text-center">
// ID de Sesión: <span className="font-mono text-gray-700">{userId}</span>
// </p>
// )}
// </div>
// );
// };

// export default ProductivityAnalyzer;



import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from "../../firebaseConfig";
const getAppId = () => { if (typeof window.__app_id !== "undefined") { return window.__app_id; } return "default-calendar-app-id"; };
const appId = getAppId();
const ProductivityChart = ({ summaryArray }) => {
const colors = {typeA: '#8884d8',typeB: '#82ca9d',typeC: '#ffc658',typeD: '#ff7300',typeE: '#00c49f',};
if (!summaryArray || summaryArray.length === 0) { return (<div className="h-64 sm:h-96 w-full p-4 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-100"><p className="text-gray-500 italic">No hay datos suficientes para generar el gráfico.</p></div>); }
return (<div className="h-64 sm:h-96 w-full p-4 bg-white rounded-lg shadow-md border border-gray-100">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={summaryArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
<XAxis dataKey="name" stroke="#333" tick={{ fill: '#4b5563', fontSize: 10 }} />
<YAxis stroke="#333" tick={{ fill: '#4b5563', fontSize: 10 }} />
<Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', background: '#fff', fontSize: '12px', padding: '5px' }} labelStyle={{ fontWeight: 'bold', color: '#1f2937' }} formatter={(value, name) => [value, name.replace('type', 'Caja ')]}/>
<Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} formatter={(value) => value.replace('type', 'Caja ')} />
<Bar dataKey="typeA" stackId="a" fill={colors.typeA} name="Caja A" radius={[4, 4, 0, 0]} />
<Bar dataKey="typeB" stackId="a" fill={colors.typeB} name="Caja B" radius={[4, 4, 0, 0]} />
<Bar dataKey="typeC" stackId="a" fill={colors.typeC} name="Caja C" radius={[4, 4, 0, 0]} />
<Bar dataKey="typeD" stackId="a" fill={colors.typeD} name="Caja D" radius={[4, 4, 0, 0]} />
<Bar dataKey="typeE" stackId="a" fill={colors.typeE} name="Caja E" radius={[4, 4, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>);
};
const InputSectionComponent = ({ db, userId, isAuthReady, setErrorMessage, isLoading }) => {
const [newEntry, setNewEntry] = useState({ 
name: '', 
date: new Date().toISOString().split('T')[0],
typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
});
const handleInputChange = useCallback((e) => {
const { name, value, type } = e.target;
setNewEntry(prev => ({
...prev,
[name]: type === 'number' ? parseInt(value) || 0 : value,
}));
}, []);
const addProduction = useCallback(async (e) => {
e.preventDefault();
setErrorMessage('');
if (!newEntry.name || newEntry.name.trim() === '') { setErrorMessage('Por favor, ingresa un nombre.'); return; }
if (!db) { setErrorMessage('La base de datos no está lista.'); return; }
try {
const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
await addDoc(collection(db, collectionPath), {
...newEntry,
typeA: newEntry.typeA || 0, typeB: newEntry.typeB || 0,
typeC: newEntry.typeC || 0, typeD: newEntry.typeD || 0,
typeE: newEntry.typeE || 0,
userId: userId,
createdAt: serverTimestamp(),
});
setNewEntry(prev => ({ 
name: prev.name, 
date: prev.date, 
typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 
}));
} catch (error) {
console.error("Error adding document: ", error);
setErrorMessage('Error al registrar la producción: ' + error.message);
}
}, [db, newEntry, userId, setErrorMessage]);
return (
<section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200 mb-8 sm:mb-0">
<h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">➕ Registrar Producción</h2>
<form onSubmit={addProduction} className="space-y-4 sm:space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-600 mb-1">Trabajador:</label>
<input type="text" name="name" placeholder="Nombre del Trabajador" value={newEntry.name} onChange={handleInputChange} required className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
</div>
<div>
<label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro:</label>
<input type="date" name="date" value={newEntry.date} onChange={handleInputChange} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
</div>
</div>
<div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
<h3 className="text-base sm:text-lg font-medium text-blue-800 mb-3 sm:mb-4">Cajas por Tipo (Cantidad)</h3>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
{['A', 'B', 'C', 'D', 'E'].map((type) => (
<div key={type}>
<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tipo {type}:</label>
<input type="number" name={`type${type}`} value={newEntry[`type${type}`]} onChange={handleInputChange} min="0" className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
</div>
))}
</div>
</div>
<button type="submit" disabled={!isAuthReady || isLoading} className={`w-full md:w-auto px-6 py-3 text-white font-bold rounded-lg transition duration-200 shadow-md ${!isAuthReady || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
{isLoading ? 'Guardando...' : 'Registrar Entrada'}
</button>
</form>
</section>
);
};
const InputSection = memo(InputSectionComponent);
const ProductivityAnalyzer = () => {
const [productionData, setProductionData] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [db, setDb] = useState(null);
const [userId, setUserId] = useState(null);
const [isAuthReady, setIsAuthReady] = useState(false);
const [activeTab, setActiveTab] = useState('input');
const [selectedWorkerName, setSelectedWorkerName] = useState('');
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
useEffect(() => {
try {
if (Object.keys(firebaseConfig).length === 0) throw new Error("Firebase config not available.");
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const firebaseAuth = getAuth(app);
setDb(firestore);
onAuthStateChanged(firebaseAuth, async (user) => {
if (!user) { try { await signInAnonymously(firebaseAuth); } catch (e) { console.error("Firebase auth error:", e); } }
setUserId(firebaseAuth.currentUser?.uid || 'anonymous');
setIsAuthReady(true);
});
} catch (e) {
console.error("Firebase Initialization Error:", e);
setErrorMessage("Error al inicializar la base de datos.");
setIsAuthReady(true);
setIsLoading(false);
}
}, []);
useEffect(() => {
if (!db || !isAuthReady) return;
const collectionPath = `artifacts/${appId}/public/data/productivityEntries`;
const entriesCollection = collection(db, collectionPath);
const q = query(entriesCollection); 
const unsubscribe = onSnapshot(q, (snapshot) => {
const entries = [];
snapshot.forEach((doc) => { entries.push({ id: doc.id, ...doc.data() }); });
setProductionData(entries);
setIsLoading(false);
}, (error) => {
console.error("Firestore data snapshot error:", error);
setErrorMessage("Error al cargar los datos de la base de datos.");
setIsLoading(false);
});
return () => unsubscribe();
}, [db, isAuthReady, setErrorMessage]);
useEffect(() => {
if (productionData.length > 0 && !selectedWorkerName) {
const uniqueNames = [...new Set(productionData.map(e => e.name))];
setSelectedWorkerName(uniqueNames[0]);
}
}, [productionData, selectedWorkerName]);
const summary = useMemo(() => {
const uniqueNames = [...new Set(productionData.map(e => e.name))].sort();
const totals = productionData.reduce((acc, entry) => {
const entryA = Number(entry.typeA) || 0; const entryB = Number(entry.typeB) || 0;
const entryC = Number(entry.typeC) || 0; const entryD = Number(entry.typeD) || 0;
const entryE = Number(entry.typeE) || 0;
if (!acc[entry.name]) acc[entry.name] = { total: 0, typeA: 0, typeB: 0, typeC: 0, typeD: 0, typeE: 0 };
acc[entry.name].typeA += entryA; acc[entry.name].typeB += entryB;
acc[entry.name].typeC += entryC; acc[entry.name].typeD += entryD;
acc[entry.name].typeE += entryE;
acc[entry.name].total += entryA + entryB + entryC + entryD + entryE;
return acc;
}, {});
const summaryArray = Object.entries(totals).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total);
return { summaryArray, uniqueNames };
}, [productionData]);
const topPerformer = summary.summaryArray[0] || { name: 'N/A', total: 0 };
const getMaxByType = (type) => Math.max(...summary.summaryArray.map(w => w[type] || 0));
const dailyEntries = useMemo(() => {
if (!selectedWorkerName || !selectedDate) return [];
return productionData.filter(entry => entry.name === selectedWorkerName && entry.date === selectedDate).sort((a, b) => (new Date(a.date) - new Date(b.date))); 
}, [productionData, selectedWorkerName, selectedDate]);
const AnalysisSection = () => (
<div className="space-y-6 sm:space-y-8">
<section className="bg-yellow-100 p-4 sm:p-6 rounded-lg shadow-inner border border-yellow-300">
<h2 className="text-xl sm:text-2xl font-semibold text-yellow-800 mb-3">⭐ Resumen General Acumulado</h2>
<p className="text-base sm:text-lg text-yellow-900">
El trabajador más productivo es: 
<strong className="text-xl sm:text-2xl text-red-600 ml-2">{topPerformer.name}</strong> con 
<span className="text-xl sm:text-2xl font-extrabold ml-1"> {topPerformer.total}</span> cajas.
</p>
</section>
<section>
<h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">📊 Visualización de Competitividad</h2>
<ProductivityChart summaryArray={summary.summaryArray} />
</section>
<hr className="border-t-2 border-gray-300 my-6 sm:my-8" />
<section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-200">
<h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 border-b pb-2">🗓️ Historial por Trabajador y Fecha</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div>
<label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Trabajador:</label>
<select value={selectedWorkerName} onChange={(e) => setSelectedWorkerName(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
<option value="">-- Seleccione un trabajador --</option>
{summary.uniqueNames.map(name => (<option key={name} value={name}>{name}</option>))}
</select>
</div>
<div>
<label className="block text-sm font-medium text-gray-600 mb-1">Seleccionar Fecha:</label>
<input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
</div>
</div>
{selectedWorkerName && dailyEntries.length > 0 ? (
<div className="border border-indigo-200 rounded-lg p-3 sm:p-4 bg-indigo-50">
<h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-3">
Producción de {selectedWorkerName} el {selectedDate}
</h3>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
{['A', 'B', 'C', 'D', 'E'].map((type) => {
const totalType = dailyEntries.reduce((sum, entry) => sum + (entry[`type${type}`] || 0), 0);
return (
<div key={type} className="p-3 bg-white rounded-lg shadow text-center">
<p className="text-xs sm:text-sm text-gray-500">Caja {type}</p>
<p className="text-xl sm:text-2xl font-extrabold text-indigo-600">{totalType}</p>
</div>
);
})}
</div>
</div>
) : selectedWorkerName && (
<p className="text-gray-500 italic p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
No se encontraron entradas para {selectedWorkerName} en la fecha {selectedDate}.
</p>
)}
</section>
<hr className="border-t-2 border-gray-300 my-6 sm:my-8" />
<section className="bg-white p-4 sm:p-6 shadow-xl rounded-lg">
<h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">🥇 Desempeño por Categoría (Acumulado)</h2>
{summary.summaryArray.length > 0 ? (
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200 text-sm">
<thead className="bg-blue-600 text-white">
<tr>
<th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-tl-lg">Trabajador</th>
<th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-blue-800">TOTAL</th>
{['A', 'B', 'C', 'D', 'E'].map((type) => (
<th key={type} className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">Caja {type}</th>
))}
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
{summary.summaryArray.map((item, index) => (
<tr key={item.name} className={index === 0 ? 'bg-yellow-50 font-bold border-l-4 border-yellow-500' : 'hover:bg-gray-100'}>
<td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-left text-gray-900">{item.name}</td>
<td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm sm:text-lg font-extrabold bg-blue-100 text-blue-900">
{item.total}
</td>
{['typeA', 'typeB', 'typeC', 'typeD', 'typeE'].map((type, typeIndex) => (
<td key={typeIndex} className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-center text-sm ${item[type] === getMaxByType(type) ? 'bg-green-100 font-bold text-green-800' : 'text-gray-700'}`}>
{item[type]}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
) : (
<p className="text-gray-500 italic text-sm">No hay datos de producción registrados aún.</p>
)}
</section>
</div>
);
return (
<div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
<h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 border-b-4 border-blue-200 pb-3 mb-6 sm:mb-8">
📦 Analizador de Productividad (Real-Time)
</h1>
{isLoading && (
<div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
<span className="animate-spin inline-block mr-2">⚙️</span> Cargando datos en tiempo real...
</div>
)}
{errorMessage && (
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
<span className="font-bold">🚨 Error:</span> {errorMessage}
</div>
)}
<div className="sm:hidden">
<div className="flex justify-between bg-white rounded-lg shadow-md mb-6 p-1 border border-gray-200">
<button onClick={() => setActiveTab('input')} className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${activeTab === 'input' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
📝 Registrar
</button>
<button onClick={() => setActiveTab('analysis')} className={`flex-1 text-center py-2 px-1 text-sm font-semibold rounded-lg transition duration-200 ${activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-indigo-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
📈 Análisis
</button>
</div>
{activeTab === 'input' && <InputSection db={db} userId={userId} isAuthReady={isAuthReady} setErrorMessage={setErrorMessage} isLoading={isLoading} />}
{activeTab === 'analysis' && <AnalysisSection />}
</div>
<div className="hidden sm:block">
<InputSection db={db} userId={userId} isAuthReady={isAuthReady} setErrorMessage={setErrorMessage} isLoading={isLoading} />
<hr className="border-t-2 border-gray-300 my-8" />
<AnalysisSection />
</div>
{userId && (
<p className="text-xs text-gray-500 mt-6 text-center">
ID de Sesión: <span className="font-mono text-gray-700">{userId}</span>
</p>
)}
</div>
);
};
export default ProductivityAnalyzer;