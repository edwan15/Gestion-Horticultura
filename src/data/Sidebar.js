// import { RxDashboard } from "react-icons/rx";
// import { AiFillFileAdd } from "react-icons/ai";
// import { MdManageAccounts, MdOutlineSupportAgent } from "react-icons/md";
// import { SiAdafruit } from "react-icons/si";
// import { WiHumidity } from "react-icons/wi";

// const Menu = [
//   {
//     title: "Inventario",
//     icon: <RxDashboard />,
//     path: "/panel",
//   },
//   {
//     title: "Product+",
//     icon: <AiFillFileAdd />,
//     path: "/add-product",
//   },
//   {
//     title: "Riego",
//     icon: <WiHumidity />,
//     path: "/riego",
//   },
//   {
//     title: "Calabacin",
//     icon: <SiAdafruit />,
//     path: "/produccionC",
//   },

//   {
//     title: "pimientos",
//     icon: <MdManageAccounts />,
//     path: "/tarea",
//   },
//   {
//     title: "Carga-Trailer",
//     icon: <AiFillFileAdd />,
//     path: "/produccion",
//   },
//   {
//     title: "H.Trabajadores",
//     icon: <AiFillFileAdd />,
//     path: "/analizer",
//   },
//   {
//     title: "Cuenta",
//     icon: <MdManageAccounts />,
//     childrens: [
//       {
//         title: "profile",
//         path: "/profiles",
//       },
//       {
//         title: "Editar Perfil",
//         path: "/edit-profile",
//       },
//     ],
//   },
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

// Nuevo Icono para la sección Producción/Cultivos
import { GiFarmTractor } from "react-icons/gi"; 
// Nuevo Icono para Logística/Inventario
import { IoIosListBox } from "react-icons/io"; 
// Nuevo Icono para Administración/RRHH
import { FaUsersCog } from "react-icons/fa"; 
// Nuevo Icono para Riego
import { BsDropletFill } from "react-icons/bs"; 


const Menu = [
  // ----------------------------------------------------
  // 1. DASHBOARD (Ítem principal, sin submenús)
  // ----------------------------------------------------
  {
    title: "Dashboard",
    icon: <RxDashboard />, // Icono de panel de control
    path: "/homeCard",
  },

  // ----------------------------------------------------
  // 2. PRODUCCIÓN Y CULTIVOS (Menú agrupador)
  // ----------------------------------------------------
  {
    title: "Producción y Cultivos",
    icon: <MdOutlineGrass />, // Icono temático de cultivo
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
        icon: <SiAdafruit />, // Usamos el mismo icono si no hay uno específico
        path: "/tarea",
      },
    ],
  },
  
  // ----------------------------------------------------
  // 3. GESTIÓN Y LOGÍSTICA (Menú agrupador)
  // ----------------------------------------------------
  {
    title: "Inventario y Logística",
    icon: <MdLocalShipping />, // Icono temático de envío/logística
    childrens: [
      {
        title: "Inventario General",
        icon: <IoIosListBox />,
        path: "/panel", // Reusamos la ruta de panel para el inventario
      },
      {
        title: "Añadir Producto",
        icon: <AiFillFileAdd />,
        path: "/add-product",
      },
      {
        title: "Carga de Trailer",
        icon: <MdLocalShipping />,
        path: "/produccion",
      },
    ],
  },
  
  // ----------------------------------------------------
  // 4. ADMINISTRACIÓN (Menú agrupador)
  // ----------------------------------------------------
  {
    title: "Administración",
    icon: <FaUsersCog />, // Icono temático de gestión de usuarios/rrhh
    childrens: [
      {
        title: "H. Trabajadores",
        icon: <MdPeopleOutline />,
        path: "/analizer",
      },
      // Ítems de la cuenta que ya tenías
      {
        title: "Mi Perfil",
        path: "/profiles",
      },
      {
        title: "Editar Perfil",
        path: "/edit-profile",
      },
    ],
  },

  // ----------------------------------------------------
  // 5. SOPORTE (Ítem principal, sin submenús)
  // ----------------------------------------------------
  {
    title: "Soporte",
    icon: <MdOutlineSupportAgent />,
    path: "/contact-us",
  },
];

export default Menu;