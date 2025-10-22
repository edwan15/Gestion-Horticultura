import { RxDashboard } from "react-icons/rx";
import { AiFillFileAdd } from "react-icons/ai";
import { MdManageAccounts, MdOutlineSupportAgent } from "react-icons/md";
import { SiAdafruit } from "react-icons/si";
import { WiHumidity } from "react-icons/wi";

const Menu = [
  {
    title: "Inventario",
    icon: <RxDashboard />,
    path: "/panel",
  },
  {
    title: "Product+",
    icon: <AiFillFileAdd />,
    path: "/add-product",
  },
  {
    title: "Riego",
    icon: <WiHumidity />,
    path: "/riego",
  },
  {
    title: "Calabacin",
    icon: <SiAdafruit />,
    path: "/produccionC",
  },

  {
    title: "pimientos",
    icon: <MdManageAccounts />,
    path: "/tarea",
  },
  {
    title: "Carga-Trailer",
    icon: <AiFillFileAdd />,
    path: "/produccion",
  },
  {
    title: "H.Trabajadores",
    icon: <AiFillFileAdd />,
    path: "/add-product",
  },
  {
    title: "Cuenta",
    icon: <MdManageAccounts />,
    childrens: [
      {
        title: "profile",
        path: "/profiles",
      },
      {
        title: "Editar Perfil",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Soporte",
    icon: <MdOutlineSupportAgent />,
    path: "/contact-us",
  },
];

export default Menu;
