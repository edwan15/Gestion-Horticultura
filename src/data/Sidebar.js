import { RxDashboard } from "react-icons/rx";
import { AiFillFileAdd, AiFillFileText } from "react-icons/ai";
import { MdManageAccounts, MdOutlineSupportAgent, MdPeopleOutline, MdLocalShipping, MdOutlineGrass } from "react-icons/md";
import { SiAdafruit } from "react-icons/si";
import { WiDaySunny, WiHumidity } from "react-icons/wi";
import { GiFarmTractor } from "react-icons/gi"; 
import { IoIosListBox } from "react-icons/io"; 
import { FaUsersCog, FaChessKing, FaExchangeAlt, FaFileContract, FaCommentDollar, FaTractor, FaChartLine } from "react-icons/fa";
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
        title: "Actividad de Campo",
        icon: <AiFillFileText /> ,
        path: "/field-activities",
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
     
      {
        title: "Orden Fumigacion",
        icon: <FaFileContract />,
        path: "/order-product",
      },
      {
        title: "Inventario Costes",
        icon: <FaCommentDollar />, // Using FaCommentDollar or similar relevant icon
        path: "/inventario-costes",
      },
     
    ],
  },

  // ----------------------------------------------------
  // COSTES
  // ----------------------------------------------------
  {
    title: "Costes",
    icon: <FaCommentDollar />,
    path: "/costes",
  },
  {
    title: "Seguimiento Costes",
    icon: <FaChartLine />, // You might need to import FaChartLine or use another icon
    path: "/seguimiento-costes",
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
        title: "Gestión de Finca",
        icon: <FaTractor />,
        path: "/farm-settings",
      },
      {
        title: "Mi Perfil",
        icon: <MdManageAccounts />, 
        path: "/profiles",
      },
      {
        title: "Editar Perfil",
        icon: <MdManageAccounts />, 
        path: "/edit-profile",
      },
    ],
  },

  {
  title: "Clima y Fitosanidad",
  icon: <WiDaySunny />, 
  path: "/clima",
},
    
  // ----------------------------------------------------
  // 5. 👑 SUPERADMINISTRADOR (NUEVA SECCIÓN)
  // ----------------------------------------------------
  {
    title: "Superadministración",
    icon: <FaChessKing />, 
    childrens: [
      {
        title: "Gestión de Roles",
        icon: <FaUsersCog />,
        path: "/user-management", 
      },
      {
        title: "Log de Auditoría",
        icon: <FaExchangeAlt />, 
        path: "/user-master", 
      },
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