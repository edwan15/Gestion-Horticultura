// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { MdKeyboardArrowRight } from "react-icons/md";
// import {motion} from "framer-motion"
// const SideBarItem = ({ isOpen, product }) => {
//   const [expandir, setExpandir] = useState(false);

//   if (product.childrens) {
//     return (
//       <div className="">
//         <div className="flex justify-between items-center">
//           <span className="flex gap-4 mt-7">
//             {product.icon && (
//               <div className="  rounded-full bg-white p-2">{product.icon}</div>
//             )}
//             {isOpen && (
//               <div
//                 className={`text-2xl font-extrabold origin-left duration-500 ${
//                   !isOpen && "scale-0"
//                 } `}
//               >
//                 {product.title}
//               </div>
//             )}
//           </span>
//           <MdKeyboardArrowRight
//             className={`cursor-pointer text-2xl mt-7 hover:rotate-90 duration-500 ${
//               !isOpen && "scale-0"
//             }`}
//             onClick={() => setExpandir(!expandir)}
//           />
//         </div>
//         <div
//           className={
//             expandir
//               ? "block duration-500 origin-center"
//               : "hidden duration-500"
//           }
//         >
//           {product.childrens.map((child, index) => {
//             return (
//               <div key={index} className=" border-2 rounded-md mt-2 ">
//                 <NavLink to={child.path}>
//                   <div className="">
//                     <div>
//                       <span>
//                         {child.icon && <div class>{child.icon} </div>}
//                         {isOpen && (
//                           <div className="text-lg px-5 m-1">{child.title}</div>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </NavLink>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <NavLink
//         to={product.path}
//         className=" gap-5  justify-center items-center"
//       >
//         <motion.div
//         whileHover={{scale:1.1}}
//         whileTap={{scale:0.8}}
        
//         className="flex gap-5 mt-3">
//           <div to={product.path} className="mt-5 bg-white rounded-full p-2 ">
//             {product.icon}
//           </div>
//           <div
//             className={`origin-left  gap-5 mt-5 flex text-2xl font-bold duration-500    ${
//               !isOpen && "scale-0"
//             }`}
//           >
//             {product.title}
//           </div>
//         </motion.div>
//       </NavLink>
//     );
//   }
// };

// export default SideBarItem;



import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Importamos useLocation
import { MdKeyboardArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence para la lista

const SideBarItem = ({ isOpen, product }) => {
  // Nota: Renombrar 'childrens' a 'subItems' en tu data/Sidebar.js es recomendable
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  // Define el color de acento para los elementos activos (Verde corporativo)
  const activeClass = "bg-green-50 text-green-700 font-semibold";
  const inactiveClass = "text-gray-700 hover:bg-gray-100 transition-colors";

  // Clase base para cualquier elemento del menú
  const baseClass = "flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-300";
  
  // Variante de Framer Motion para la lista colapsable
  const subMenuVariants = {
    // Para colapsar/expandir suavemente
    hidden: { height: 0, opacity: 0, transition: { duration: 0.3 } },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  // -----------------------------------------------------------
  // 1. ÍTEM CON SUBMENÚ (product.childrens existe)
  // -----------------------------------------------------------
  if (product.childrens && product.childrens.length > 0) {
    // Determina si alguno de los subítems está activo para resaltar el menú padre
    const isParentActive = product.childrens.some(child => 
        location.pathname.startsWith(child.path)
    );
    
    // Clase condicional para el menú padre
    const parentLinkClass = isParentActive 
        ? `${baseClass} ${activeClass}` 
        : `${baseClass} ${inactiveClass}`;


    return (
      <div className="text-sm">
        {/* ENCABEZADO DEL MENÚ PADRE */}
        <div 
            className={parentLinkClass} 
            onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Icono y Título */}
          <span className="flex gap-4 items-center w-full">
            {product.icon && (
              <div className="text-xl">{product.icon}</div>
            )}
            {isOpen && (
              <span className={`text-base flex-grow ${!isOpen && "hidden"}`}>
                {product.title}
              </span>
            )}
          </span>
          
          {/* Flecha de Expansión/Colapso */}
          {isOpen && (
            <MdKeyboardArrowRight
              className={`text-2xl duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`}
            />
          )}
        </div>
        
        {/* SUBMENÚ COLAPSABLE */}
        <AnimatePresence initial={false}>
            {isExpanded && isOpen && (
                <motion.div
                    key="subMenu"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={subMenuVariants}
                    className="overflow-hidden" // Oculta el contenido mientras se anima la altura
                >
                    {product.childrens.map((child, index) => (
                        <NavLink
                            key={index}
                            to={child.path}
                            className={({ isActive }) => 
                                `${baseClass} ml-8 text-sm ${isActive ? activeClass : inactiveClass}`
                            }
                        >
                            {/* Icono (Si existe) y Título del subítem */}
                            <div className="text-lg mr-3">{child.icon}</div>
                            <span className="truncate">{child.title}</span>
                        </NavLink>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    );
  } 
  
  // -----------------------------------------------------------
  // 2. ÍTEM SIMPLE (product.childrens NO existe)
  // -----------------------------------------------------------
  else {
    return (
      <NavLink
        to={product.path}
        className={({ isActive }) => 
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <motion.div
            // Usamos la animación solo en el icono/texto, no en el NavLink completo
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className="flex gap-4 items-center w-full"
        >
          {product.icon && (
            <div className="text-xl">{product.icon}</div>
          )}
          {isOpen && (
            <span className={`text-base font-medium ${!isOpen && "hidden"}`}>
              {product.title}
            </span>
          )}
        </motion.div>
      </NavLink>
    );
  }
};

export default SideBarItem;