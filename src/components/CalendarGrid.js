// import React, { useMemo } from 'react';
// // Asumimos que formatDate es importado correctamente desde esta ruta
// import { formatDate } from '../Util/util'; 

// // 🚨 Nota: La función formatDate debe ser accesible. Si no tienes un archivo 'util',
// // asegúrate de que esté definida o pasada como prop. Aquí la definimos por si acaso.

// const CalendarGrid = ({
//   dailyData,
//   selectedDate, 
//   setSelectedDate,
//   handleDayClick,
//   globalGoal,
//   formatNumber,
// }) => {
//     // 🚨 CORRECCIÓN CLAVE 1: Manejar la cadena de fecha de forma segura
//     const dateObject = useMemo(() => {
//       if (selectedDate) {
//         // Usa 'T00:00:00' para evitar que el navegador cambie la fecha por zona horaria
//         const date = new Date(selectedDate + 'T00:00:00');
//         return isNaN(date) ? new Date() : date;
//       }
//       return new Date(); 
//     }, [selectedDate]);

//     if (isNaN(dateObject)) {
//       return <div>Error: Fecha inválida recibida en CalendarGrid.</div>;
//     }

//     const today = formatDate(new Date());

//     const getDayData = (dateKey) => dailyData[dateKey] || {};

//     const getDailyTotal = (dateKey) => {
//       const dayData = getDayData(dateKey);
//       return (
//         dayData?.items?.reduce(
//           (sum, item) => sum + parseFloat(item.result || 0),
//           0
//         ) || 0
//       );
//     };

//     const getDayStyle = (dateKey) => {
//       // 📐 AJUSTE 1: Eliminamos hover:scale y ajustamos padding para más espacio interno
//       let base =
//         "rounded-xl p-2 cursor-pointer transition duration-200 shadow-sm border border-gray-200 h-16 sm:h-24"; 

//       if (dateKey === today) {
//         base += " ring-4 ring-indigo-400 ring-offset-2"; // Resalta el día de hoy
//       }
//       
//       if (dateKey === selectedDate) {
//         base += " bg-indigo-50 border-indigo-500 shadow-lg"; // Resalta la fecha seleccionada
//       } else if (dailyData[dateKey]) {
//         base += " bg-teal-100 border-teal-500 hover:bg-teal-200";
//       } else {
//         base += " bg-white hover:bg-gray-50";
//       }
//       
//       return base;
//     };

//     // Generación del mes
//     const year = dateObject.getFullYear(); 
//     const month = dateObject.getMonth();
//     
//     // 0=Domingo, 1=Lunes...
//     const firstDayOfMonth = new Date(year, month, 1).getDay(); 
//     const daysInMonth = new Date(year, month + 1, 0).getDate(); 
//     
//     // Ajuste para que la semana empiece en Lunes
//     const emptyCellsBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

//     const days = [];
//     for (let i = 0; i < emptyCellsBefore; i++) {
//       // 📐 AJUSTE 2: Altura fija para mantener el grid estable
//       days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 p-2"></div>); 
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       const dateKey = formatDate(new Date(year, month, i));
//       const total = getDailyTotal(dateKey);
//       const costData =
//         dailyData[dateKey]?.numWorkers > 0 || dailyData[dateKey]?.hoursWorked > 0;

//       days.push(
//         <div
//           key={dateKey}
//           className={getDayStyle(dateKey)}
//           onClick={() =>
//             handleDayClick(dateKey, total > 0 || costData ? "view" : "edit")
//           }
//         >
//           {/* 🎯 Diseño de Celda - Responsividad Perfecta */}
//           <div className="text-lg font-bold text-gray-800 flex justify-between items-center h-full flex-col sm:flex-row sm:items-start sm:h-auto">
//             
//             {/* Número del Día - Siempre arriba a la izquierda */}
//             <span className="w-full text-left">{i}</span>
//             
//             {/* Indicador visual en móvil (Punto verde si hay datos) */}
//             {total > 0 && <span className="w-2 h-2 rounded-full bg-teal-500 sm:hidden"></span>}

//           </div>

//           {/* Producción en Kg - OCULTO en móvil (hidden) */}
//           <p className="text-sm font-medium text-gray-600 mt-1 hidden sm:block">
//             {total > 0 ? `${formatNumber(total)} Kg` : "Sin datos"}
//           </p>

//           {/* Costes - OCULTO en móvil (hidden) */}
//           {costData && (
//             <p className="text-xs text-blue-600 font-semibold mt-1 hidden sm:block">
//               Costes:{" "}
//               {formatNumber(dailyData[dateKey]?.finalProductionCost || 0, 4)} €/Kg
//             </p>
//           )}
//         </div>
//       );
//     }

//     const setPreviousMonth = () => {
//       // Se usa la función formatDate para asegurar que el componente padre reciba una CADENA
//       const newDate = new Date(year, month - 1, 1);
//       setSelectedDate(formatDate(newDate));
//     };

//     const setNextMonth = () => {
//       // Se usa la función formatDate para asegurar que el componente padre reciba una CADENA
//       const newDate = new Date(year, month + 1, 1);
//       setSelectedDate(formatDate(newDate));
//     };

//     return (
//       <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl transition duration-500">
//       
//         {/* Controles de Navegación del Mes */}
//         <div className="flex justify-between items-center mb-6">
//             <button
//                 onClick={setPreviousMonth}
//                 className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg"
//             >
//                 <svg
//                     className="w-5 h-5 text-indigo-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M15 19l-7-7 7-7"
//                     ></path>
//                 </svg>
//             </button>
//             
//             {/* Título del Mes y Año */}
//             <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-wide">
//                 {dateObject
//                     .toLocaleDateString("es-ES", { month: "long", year: "numeric" })
//                     .toUpperCase()}
//             </h2>
//             
//             <button
//                 onClick={setNextMonth}
//                 className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg"
//             >
//                 <svg
//                     className="w-5 h-5 text-indigo-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5l7 7-7 7"
//                     ></path>
//                 </svg>
//             </button>
//         </div>

//         {/* Encabezados de los Días de la Semana */}
//         <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs sm:text-sm text-gray-500 mb-2 border-b-2 pb-2">
//             {/* Viernes y Sábado en minúsculas en móvil para ahorrar espacio */}
//             {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day) => (
//                 <div key={day} className="tracking-wider">
//                     {day}
//                 </div>
//             ))}
//         </div>

//         {/* Grid de los Días del Mes */}
//         <div className="grid grid-cols-7 gap-1 sm:gap-2">
//             {days}
//         </div>
//       </div>
//   );
// };
// export default CalendarGrid;


// import React,{useMemo} from 'react';
// //AsumimosqueformatDateesimportadocorrectamentedesdeestaruta
// import{formatDate}from'../Util/util';
// const CalendarGrid=({dailyData,selectedDate,setSelectedDate,handleDayClick,globalGoal,formatNumber,})=>{
// //🚨CORRECCIÓNCLAVE1:Manejarlaespiraldecadenadefecha
// const dateObject=useMemo(()=>{
// if(selectedDate){
// const date=new Date(selectedDate+'T00:00:00');
// return isNaN(date)?new Date():date;
// }
// return new Date();
// },[selectedDate]);
// if(isNaN(dateObject)){
// return<div>Error:FechainválidarecibidaenCalendarGrid.</div>;
// }
// const today=formatDate(new Date());
// const getDayData=(dateKey)=>dailyData[dateKey]||{};
// const getDailyTotal=(dateKey)=>{
// const dayData=getDayData(dateKey);
// return(dayData?.items?.reduce((sum,item)=>sum+parseFloat(item.result||0),0)||0);
// };
// const getDayStyle=(dateKey)=>{
// //📐AJUSTE1:Eliminamoshover:scaleyajustamospaddingparamásespaciointerno
// let base="rounded-xl p-2 cursor-pointer transition duration-200 shadow-sm border border-gray-200 h-16 sm:h-24";
// if(dateKey===today){
// base+=" ring-4 ring-indigo-400 ring-offset-2";
// }
// if(dateKey===selectedDate){
// base+=" bg-indigo-50 border-indigo-500 shadow-lg";
// }else if(dailyData[dateKey]){
// base+=" bg-teal-100 border-teal-500 hover:bg-teal-200";
// }else{
// base+=" bg-white hover:bg-gray-50";
// }
// return base;
// };
// //Generacióndelmes
// const year=dateObject.getFullYear();
// const month=dateObject.getMonth();
// //0=Domingo,1=Lunes...
// const firstDayOfMonth=new Date(year,month,1).getDay();
// const daysInMonth=new Date(year,month+1,0).getDate();
// //AjusteparaquelaemanaempieceenLunes
// const emptyCellsBefore=firstDayOfMonth===0?6:firstDayOfMonth-1;
// const days=[];
// for(let i=0;i<emptyCellsBefore;i++){
// //📐AJUSTE2:Alturafijaparamantenerelgridestable
// days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 p-2"></div>);
// }
// for(let i=1;i<=daysInMonth;i++){
// const dateKey=formatDate(new Date(year,month,i));
// const total=getDailyTotal(dateKey);
// const costData=dailyData[dateKey]?.numWorkers>0||dailyData[dateKey]?.hoursWorked>0;
// days.push(<div key={dateKey} className={getDayStyle(dateKey)} onClick={()=>handleDayClick(dateKey,total>0||costData?"view":"edit")}>
// {/*🎯DiseñodeCelda-ResponsividadPerfecta*/}
// <div className="text-lg font-bold text-gray-800 flex justify-between items-center h-full flex-col sm:flex-row sm:items-start sm:h-auto">
// {/*NúmerodelDía-Siemprearribaalaiquierda*/}
// <span className="w-full text-left">{i}</span>
// {/*Indicadorvisualenmóvil(Puntoverdesihaydatos)*/}
// {total>0&&<span className="w-2 h-2 rounded-full bg-teal-500 sm:hidden"></span>}
// </div>
// {/*ProducciónenKg-OCULTOenmóvil(hidden)*/}
// <p className="text-sm font-medium text-gray-600 mt-1 hidden sm:block">
// {total>0?`${formatNumber(total)} Kg`:"Sin datos"}
// </p>
// {/*Costes-OCULTOenmóvil(hidden)*/}
// {costData&&(
// <p className="text-xs text-blue-600 font-semibold mt-1 hidden sm:block">
// Costes:{" "}{formatNumber(dailyData[dateKey]?.finalProductionCost||0,4)} €/Kg
// </p>
// )}
// </div>);
// }
// const setPreviousMonth=()=>{
// //Seusalaforma formatDateparaasegurarqueelcomponentepadrecibaunaCADENA
// const newDate=new Date(year,month-1,1);
// setSelectedDate(formatDate(newDate));
// };
// const setNextMonth=()=>{
// //Seusalaforma formatDateparaasegurarqueelcomponentepadrecibaunaCADENA
// const newDate=new Date(year,month+1,1);
// setSelectedDate(formatDate(newDate));
// };
// return(<div className="p-4 sm:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl transition duration-500">
// {/*ControlesdeNavegacióndelMes*/}
// <div className="flex justify-between items-center mb-6">
// <button onClick={setPreviousMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
// <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
// </svg>
// </button>
// {/*TítulodelMesyAño*/}
// <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-wide">
// {dateObject.toLocaleDateString("es-ES",{month:"long",year:"numeric"}).toUpperCase()}
// </h2>
// <button onClick={setNextMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
// <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
// </svg>
// </button>
// </div>
// {/*EncabezadosdelosDíasdelaSemana*/}
// <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs sm:text-sm text-gray-500 mb-2 border-b-2 pb-2">
// {/*ViernesySábadoenminúsculasenmóvilparaahorrarespacio*/}
// {["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"].map((day)=>(<div key={day} className="tracking-wider">{day}</div>))}
// </div>
// {/*GriddelosDíasdelMes*/}
// <div className="grid grid-cols-7 gap-1 sm:gap-2">
// {days}
// </div>
// </div>);
// };
// export default CalendarGrid;


// import React,{useMemo} from 'react';
// //AsumimosqueformatDateesimportadocorrectamentedesdeestaruta
// import{formatDate}from'../Util/util';

// const CalendarGrid=({dailyData,selectedDate,setSelectedDate,handleDayClick,globalGoal,formatNumber,})=>{
// //🚨CORRECCIÓNCLAVE1:Manejarlaespiraldecadenadefecha
// const dateObject=useMemo(()=>{
// if(selectedDate){
// const date=new Date(selectedDate+'T00:00:00');
// return isNaN(date)?new Date():date;
// }
// return new Date();
// },[selectedDate]);
// if(isNaN(dateObject)){
// return<div>Error:FechainválidarecibidaenCalendarGrid.</div>;
// }
// const today=formatDate(new Date());
// const getDayData=(dateKey)=>dailyData[dateKey]||{};
// const getDailyTotal=(dateKey)=>{
// const dayData=getDayData(dateKey);
// return(dayData?.items?.reduce((sum,item)=>sum+parseFloat(item.result||0),0)||0);
// };
// const getDayStyle=(dateKey)=>{
// //📐AJUSTE1:Eliminamoshover:scaleyajustamospaddingparamásespaciointerno
// let base="rounded-xl p-2 cursor-pointer transition duration-200 shadow-sm border border-gray-200 h-16 sm:h-24";
// if(dateKey===today){
// base+=" ring-4 ring-indigo-400 ring-offset-2";
// }
// if(dateKey===selectedDate){
// base+=" bg-indigo-50 border-indigo-500 shadow-lg";
// }else if(dailyData[dateKey]){
// base+=" bg-teal-100 border-teal-500 hover:bg-teal-200";
// }else{
// base+=" bg-white hover:bg-gray-50";
// }
// return base;
// };
// //Generacióndelmes
// const year=dateObject.getFullYear();
// const month=dateObject.getMonth();
// //0=Domingo,1=Lunes...
// const firstDayOfMonth=new Date(year,month,1).getDay();
// const daysInMonth=new Date(year,month+1,0).getDate();
// //AjusteparaquelaemanaempieceenLunes
// const emptyCellsBefore=firstDayOfMonth===0?6:firstDayOfMonth-1;
// const days=[];
// for(let i=0;i<emptyCellsBefore;i++){
// //📐AJUSTE2:Alturafijaparamantenerelgridestable
// days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 p-2"></div>);
// }
// for(let i=1;i<=daysInMonth;i++){
// const dateKey=formatDate(new Date(year,month,i));
// const total=getDailyTotal(dateKey);
// const costData=dailyData[dateKey]?.numWorkers>0||dailyData[dateKey]?.hoursWorked>0;
// days.push(<div 
//     key={dateKey} 
//     className={getDayStyle(dateKey)} 
//     // ✅ CORRECCIÓN APLICADA: Cambiamos "view" por "day_view" y "edit" por "day_edit"
//     onClick={() => handleDayClick && handleDayClick(dateKey, total > 0 || costData ? "day_view" : "day_edit")}
//     >
// {/*🎯DiseñodeCelda-ResponsividadPerfecta*/}
// <div className="text-lg font-bold text-gray-800 flex justify-between items-center h-full flex-col sm:flex-row sm:items-start sm:h-auto">
// {/*NúmerodelDía-Siemprearribaalaiquierda*/}
// <span className="w-full text-left">{i}</span>
// {/*Indicadorvisualenmóvil(Puntoverdesihaydatos)*/}
// {total>0&&<span className="w-2 h-2 rounded-full bg-teal-500 sm:hidden"></span>}
// </div>
// {/*ProducciónenKg-OCULTOenmóvil(hidden)*/}
// <p className="text-sm font-medium text-gray-600 mt-1 hidden sm:block">
// {total>0?`${formatNumber(total)} Kg`:"Sin datos"}
// </p>
// {/*Costes-OCULTOenmóvil(hidden)*/}
// {costData&&(
// <p className="text-xs text-blue-600 font-semibold mt-1 hidden sm:block">
// Costes:{" "}{formatNumber(dailyData[dateKey]?.finalProductionCost||0,4)} €/Kg
// </p>
// )}
// </div>);
// }
// const setPreviousMonth=()=>{
// //Seusalaforma formatDateparaasegurarqueelcomponentepadrecibaunaCADENA
// const newDate=new Date(year,month-1,1);
// setSelectedDate(formatDate(newDate));
// };
// const setNextMonth=()=>{
// //Seusalaforma formatDateparaasegurarqueelcomponentepadrecibaunaCADENA
// const newDate=new Date(year,month+1,1);
// setSelectedDate(formatDate(newDate));
// };
// return(<div className="p-4 sm:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl transition duration-500">
// {/*ControlesdeNavegacióndelMes*/}
// <div className="flex justify-between items-center mb-6">
// <button onClick={setPreviousMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
// <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
// </svg>
// </button>
// {/*TítulodelMesyAño*/}
// <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-wide">
// {dateObject.toLocaleDateString("es-ES",{month:"long",year:"numeric"}).toUpperCase()}
// </h2>
// <button onClick={setNextMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
// <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
// </svg>
// </button>
// </div>
// {/*EncabezadosdelosDíasdelaSemana*/}
// <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs sm:text-sm text-gray-500 mb-2 border-b-2 pb-2">
// {/*ViernesySábadoenminúsculasenmóvilparaahorrarespacio*/}
// {["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"].map((day)=>(<div key={day} className="tracking-wider">{day}</div>))}
// </div>
// {/*GriddelosDíasdelMes*/}
// <div className="grid grid-cols-7 gap-1 sm:gap-2">
// {days}
// </div>
// </div>);
// };
// export default CalendarGrid;





import React,{useMemo} from 'react';
// Asumimos que formatDate es importado correctamente desde esta ruta
import{formatDate}from'../Util/util';

const CalendarGrid=({dailyData,selectedDate,setSelectedDate,handleDayClick,globalGoal,formatNumber,})=>{
    
// 🚨 CORRECCIÓN CLAVE 1: Manejar la espiral de cadena de fecha
const dateObject=useMemo(()=>{
    if(selectedDate){
        const date=new Date(selectedDate+'T00:00:00');
        // Vuelve a una fecha válida si la recibida no lo es, o usa la fecha recibida.
        return isNaN(date.getTime()) ? new Date() : date; 
    }
    return new Date();
},[selectedDate]);

if(isNaN(dateObject.getTime())){
    return<div>Error: Fecha inválida recibida en CalendarGrid.</div>;
}

const today = formatDate(new Date());

const getDayData=(dateKey)=>dailyData[dateKey]||{};

const getDailyTotal=(dateKey)=>{
    const dayData=getDayData(dateKey);
    return(dayData?.items?.reduce((sum,item)=>sum+parseFloat(item.result||0),0)||0);
};

// 🎯 FUNCIÓN ACTUALIZADA: Define el estilo según la presencia de datos
const getDayStyle=(dateKey, total, hasAnyCostData)=>{
    // 📐 AJUSTE: Altura fija para mantener el grid estable y estilos base
    let base="rounded-xl p-2 cursor-pointer transition duration-200 shadow-sm border border-gray-200 h-16 sm:h-24";
    const isToday = dateKey === today;
    const isSelected = dateKey === selectedDate;

    if(isToday){
        base+=" ring-4 ring-indigo-400 ring-offset-2";
    }

    if(isSelected){
        base+=" bg-indigo-50 border-indigo-500 shadow-lg";
    } else if (total > 0 && hasAnyCostData) {
        // Caso: Producción Y Coste (Verde Lima)
        base+=" bg-lime-100 border-lime-500 hover:bg-lime-200";
    } else if (total > 0) {
        // Caso: Solo Producción (Verde Teal)
        base+=" bg-teal-100 border-teal-500 hover:bg-teal-200";
    } else if (hasAnyCostData) {
        // Caso: Solo Coste (Ámbar)
        base+=" bg-amber-100 border-amber-500 hover:bg-amber-200";
    } else {
        base+=" bg-white hover:bg-gray-50";
    }
    return base;
};

// Generación del mes
const year = dateObject.getFullYear();
const month = dateObject.getMonth();

// 0=Domingo, 1=Lunes...
const firstDayOfMonth=new Date(year,month,1).getDay();
const daysInMonth=new Date(year,month+1,0).getDate();

// Ajuste para que la semana empiece en Lunes
const emptyCellsBefore=firstDayOfMonth===0?6:firstDayOfMonth-1;
const days=[];

for(let i=0;i<emptyCellsBefore;i++){
    // 📐 AJUSTE 2: Altura fija para mantener el grid estable
    days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 p-2"></div>);
}

for(let i=1;i<=daysInMonth;i++){
    const dateKey=formatDate(new Date(year,month,i));
    const total=getDailyTotal(dateKey);
    const dayData = dailyData[dateKey]; // Objeto del día
    
    // 🎯 NUEVA LÓGICA DE COSTE
    // 1. Verificamos si hay entradas de costes (trabajadores o horas)
    //    Acceso seguro a costData anidado.
    const hasCostInputs = dayData?.costData?.numWorkers > 0 || dayData?.costData?.hoursWorked > 0;
    
    // 2. Extraemos el coste final calculado (que es lo que se muestra)
    const finalCostPerKg = parseFloat(dayData?.finalProductionCost || 0);
    const hasFinalCost = finalCostPerKg > 0;
    
    // 3. Condición unificada para el estilo y el manejo de clicks
    const hasAnyCostData = hasCostInputs || hasFinalCost;
    
    days.push(
        <div 
            key={dateKey} 
            // 4. USAR LA FUNCIÓN DE ESTILO ACTUALIZADA
            className={getDayStyle(dateKey, total, hasAnyCostData)} 
            
            // 5. CORRECCIÓN EN ONCLICK: Usar la nueva variable hasAnyCostData
            onClick={() => handleDayClick && handleDayClick(dateKey, total > 0 || hasAnyCostData ? "day_view" : "day_edit")}
        >
            {/*🎯 Diseño de Celda - Responsividad Perfecta */}
            <div className="text-lg font-bold text-gray-800 flex justify-between items-center h-full flex-col sm:flex-row sm:items-start sm:h-auto">
                {/* Número del Día - Siempre arriba a la izquierda */}
                <span className="w-full text-left">{i}</span>
                
                {/* Indicador visual en móvil (Punto) */}
                {(total > 0 || hasAnyCostData) && (
                    <span 
                        className={`w-2 h-2 rounded-full sm:hidden ${total > 0 ? 'bg-teal-500' : 'bg-amber-500'}`} 
                        title={total > 0 ? "Hay Producción" : "Hay Costes"}
                    ></span>
                )}
            </div>
            
            {/* Producción en Kg - VISIBLE en desktop (sm:block) */}
            <p className="text-sm font-medium text-gray-600 mt-1 hidden sm:block">
                {total > 0 ? `${formatNumber(total, 1)} Kg` : "Sin datos"}
            </p>
            
            {/* 6. COSTE FINAL - VISIBLE en desktop (sm:block) */}
            {hasFinalCost && (
                <p className="text-xs text-blue-600 font-semibold mt-1 hidden sm:block">
                    Coste/Kg:{" "}
                    <span className="font-bold">{formatNumber(finalCostPerKg, 4)} €</span>
                </p>
            )}
        </div>
    );
}

const setPreviousMonth=()=>{
    // Se usa la forma formatDate para asegurar que el componente padre reciba una CADENA
    const newDate=new Date(year,month-1,1);
    setSelectedDate(formatDate(newDate));
};

const setNextMonth=()=>{
    // Se usa la forma formatDate para asegurar que el componente padre reciba una CADENA
    const newDate=new Date(year,month+1,1);
    setSelectedDate(formatDate(newDate));
};

return(
    <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-2xl transition duration-500">
        {/* Controles de Navegación del Mes */}
        <div className="flex justify-between items-center mb-6">
            <button onClick={setPreviousMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            
            {/* Título del Mes y Año */}
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-wide">
                {dateObject.toLocaleDateString("es-ES",{month:"long",year:"numeric"}).toUpperCase()}
            </h2>
            
            <button onClick={setNextMonth} className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
        
        {/* Encabezados de los Días de la Semana */}
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs sm:text-sm text-gray-500 mb-2 border-b-2 pb-2">
            {["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"].map((day)=>(<div key={day} className="tracking-wider">{day}</div>))}
        </div>
        
        {/* Grid de los Días del Mes */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days}
        </div>
    </div>
);
};
export default CalendarGrid;