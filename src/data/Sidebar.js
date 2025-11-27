// import { RxDashboard } from "react-icons/rx";
// import { AiFillFileAdd } from "react-icons/ai";
// import { MdManageAccounts, MdOutlineSupportAgent, MdPeopleOutline, MdLocalShipping, MdOutlineGrass } from "react-icons/md";
// import { SiAdafruit } from "react-icons/si";
// import { WiHumidity } from "react-icons/wi";

// // Nuevo Icono para la sección Producción/Cultivos
// import { GiFarmTractor } from "react-icons/gi"; 
// // Nuevo Icono para Logística/Inventario
// import { IoIosListBox } from "react-icons/io"; 
// // Nuevo Icono para Administración/RRHH
// import { FaUsersCog } from "react-icons/fa"; 
// // Nuevo Icono para Riego
// import { BsDropletFill } from "react-icons/bs"; 


// const Menu = [
//   // ----------------------------------------------------
//   // 1. DASHBOARD (Ítem principal, sin submenús)
//   // ----------------------------------------------------
//   {
//     title: "Dashboard",
//     icon: <RxDashboard />, // Icono de panel de control
//     path: "/homeCard",
//   },

//   // ----------------------------------------------------
//   // 2. PRODUCCIÓN Y CULTIVOS (Menú agrupador)
//   // ----------------------------------------------------
//   {
//     title: "Producción y Cultivos",
//     icon: <MdOutlineGrass />, // Icono temático de cultivo
//     childrens: [
//       {
//         title: "Riego",
//         icon: <BsDropletFill />,
//         path: "/riego",
//       },
//       {
//         title: "Calabacín",
//         icon: <SiAdafruit />,
//         path: "/produccionC",
//       },
//       {
//         title: "Pimientos",
//         icon: <SiAdafruit />, // Usamos el mismo icono si no hay uno específico
//         path: "/tarea",
//       },
//     ],
//   },
  
//   // ----------------------------------------------------
//   // 3. GESTIÓN Y LOGÍSTICA (Menú agrupador)
//   // ----------------------------------------------------
//   {
//     title: "Inventario y Logística",
//     icon: <MdLocalShipping />, // Icono temático de envío/logística
//     childrens: [
//       {
//         title: "Inventario General",
//         icon: <IoIosListBox />,
//         path: "/panel", // Reusamos la ruta de panel para el inventario
//       },
//       {
//         title: "Añadir Producto",
//         icon: <AiFillFileAdd />,
//         path: "/add-product",
//       },
//       {
//         title: "Carga de Trailer",
//         icon: <MdLocalShipping />,
//         path: "/produccion",
//       },
//     ],
//   },
  
//   // ----------------------------------------------------
//   // 4. ADMINISTRACIÓN (Menú agrupador)
//   // ----------------------------------------------------
//   {
//     title: "Administración",
//     icon: <FaUsersCog />, // Icono temático de gestión de usuarios/rrhh
//     childrens: [
//       {
//         title: "H. Trabajadores",
//         icon: <MdPeopleOutline />,
//         path: "/analizer",
//       },
//       // Ítems de la cuenta que ya tenías
//       {
//         title: "Mi Perfil",
//         path: "/profiles",
//       },
//       {
//         title: "Editar Perfil",
//         path: "/edit-profile",
//       },
//     ],
//   },

//   // ----------------------------------------------------
//   // 5. SOPORTE (Ítem principal, sin submenús)
//   // ----------------------------------------------------
//   {
//     title: "Soporte",
//     icon: <MdOutlineSupportAgent />,
//     path: "/contact-us",
//   },
// ];

// export default Menu;



import { RxDashboard } from "react-icons/rx";
import { AiFillFileAdd } from "react-icons/ai";
import { MdManageAccounts, MdOutlineSupportAgent, MdPeopleOutline, MdLocalShipping, MdOutlineGrass } from "react-icons/md";
import { SiAdafruit } from "react-icons/si";
import { WiHumidity } from "react-icons/wi";

// Nuevas importaciones de iconos
import { GiFarmTractor } from "react-icons/gi"; 
import { IoIosListBox } from "react-icons/io"; 
import { FaUsersCog, FaChessKing, FaExchangeAlt, FaCommentDollar } from "react-icons/fa"; // FaChessKing y FaExchangeAlt son nuevas
import { BsDropletFill } from "react-icons/bs"; 


const Menu = [
  // ----------------------------------------------------
  // 1. DASHBOARD
  // ----------------------------------------------------
  {
    title: "Dashboard",
    icon: <RxDashboard />, 
    path: "/homeCard",
  },

  // ----------------------------------------------------
  // 2. PRODUCCIÓN Y CULTIVOS
  // ----------------------------------------------------
  {
    title: "Producción y Cultivos",
    icon: <MdOutlineGrass />, 
    childrens: [
      {
        title: "Riego",
        icon: <BsDropletFill />,
        path: "/riego",
      },
      {
        title: "Calabacín",
        icon: <SiAdafruit />,
        path: "/produccionC",
      },
      {
        title: "Pimientos",
        icon: <SiAdafruit />, 
        path: "/tarea",
      },
       {
        title: "Carga de Trailer",
        icon: <MdLocalShipping />,
        path: "/produccion",
      },
    ],
  },
  
  // ----------------------------------------------------
  // 3. GESTIÓN Y LOGÍSTICA
  // ----------------------------------------------------
  {
    title: "Inventario y Logística",
    icon: <MdLocalShipping />, 
    childrens: [
      {
        title: "Inventario General",
        icon: <IoIosListBox />,
        path: "/panel", 
      },
      {
        title: "Añadir Producto",
        icon: <AiFillFileAdd />,
        path: "/add-product",
      },
     
    ],
  },
  
  // ----------------------------------------------------
  // 4. ADMINISTRACIÓN (Recursos Humanos)
  // ----------------------------------------------------
  {
    title: "Administración",
    icon: <FaUsersCog />,
    childrens: [
      {
        title: "H. Trabajadores",
        icon: <MdPeopleOutline />,
        path: "/analizer",
      },
      {
        title: "Analisis De Trabajadores",
        icon: <FaCommentDollar />,
        path: "/analizer-work",
      },
      {
        title: "Mi Perfil",
        icon: <MdManageAccounts />, // Añadido un ícono para mantener la estética
        path: "/profiles",
      },
      {
        title: "Editar Perfil",
        icon: <MdManageAccounts />, // Reutilizado
        path: "/edit-profile",
      },
    ],
  },
    
  // ----------------------------------------------------
  // 5. 👑 SUPERADMINISTRADOR (NUEVA SECCIÓN)
  // ----------------------------------------------------
  {
    title: "Superadministración",
    icon: <FaChessKing />, // Ícono que denota rol superior
    childrens: [
      {
        title: "Gestión de Roles",
        icon: <FaUsersCog />,
        path: "/user-management", // Ruta típica para gestión de roles
      },
      {
        title: "Log de Auditoría",
        icon: <FaExchangeAlt />, // Ícono para movimientos/cambios
        path: "/user-master", // Nueva ruta de ejemplo
      },
      // 🛑 Añade aquí cualquier otra función de superusuario
      // EJEMPLO: { title: "Configuración Global", icon: <IoIosListBox />, path: "/config-global" }, 
    ],
  },

  // ----------------------------------------------------
  // 6. SOPORTE
  // ----------------------------------------------------
  {
    title: "Soporte",
    icon: <MdOutlineSupportAgent />,
    path: "/contact-us",
  },
];

export default Menu;