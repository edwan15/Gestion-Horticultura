import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
import { SlDirections } from "react-icons/sl";
import { BiSearchAlt2, BiSupport } from "react-icons/bi";
import { motion } from "framer-motion";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaChessKing } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import Menu from "../../data/Sidebar";
import SideBarItem from "./SideBarItem";
import { Link } from "react-router-dom";
import Agro from "../../asset/LOGOS.svg";

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMenu, setIsMenu] = useState(false);
  // const toggle = () => {
  //   setIsOpen(!isOpen);
  // };
  const navigate = useNavigate();

  const menuRef = useRef(null);

  // =========================================================================
  // 2. LÓGICA DE CIERRE: Clic fuera Y Temporizador (7 segundos)
  // =========================================================================
  useEffect(() => {
    let timerId;

    // Solo se activa la lógica de cierre si el menú está ABIERTO
    if (isMenu) {
      // A. Lógica de Cierre por TEMPORIZADOR (7000ms = 7 segundos)
      timerId = setTimeout(() => {
        setIsMenu(false);
      }, 7000); // 👈 Temporizador de 7 segundos

      // B. Lógica de Cierre al hacer CLIC FUERA
      const clickOutsideHandler = (event) => {
        // Si el clic NO está dentro del menú referenciado, cerrarlo.
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenu(false);
        }
      };

      document.addEventListener('mousedown', clickOutsideHandler);
      document.addEventListener('touchstart', clickOutsideHandler);

      // C. Función de limpieza (Cleanup)
      return () => {
        // Limpiar el temporizador para evitar que se cierre si el usuario interactúa
        clearTimeout(timerId); 
        // Remover los listeners de eventos para evitar fugas de memoria
        document.removeEventListener('mousedown', clickOutsideHandler);
        document.removeEventListener('touchstart', clickOutsideHandler);
      };
    }

    // Limpieza al cambiar 'isMenu' o desmontar (si 'isMenu' es false, el 'return' solo limpia)
    return () => {
        if (timerId) {
            clearTimeout(timerId);
        }
    };
  }, [isMenu]); 

  const goHome = () => {
    navigate("/");
  };

  return (
    // <header className="grid sm:flex min-h-screen   ">
    //   {" "}
    //   <div
    //     className={`min-h-scree hidden sm:block bg-blue-300 p-5 pt-8   ${
    //       isOpen ? " w-30  md:w-72 " : " w-0 sm:w-24  "
    //     } relative duration-500`}
    //   >
    //     <div className="inline-flex gap-5  justify-center items-center">
    //       <p
    //         className="text-4xl font-bold mt-1   text-white cursor-pointer "
    //         onClick={goHome}
    //       >
    //         <AiFillGithub />
    //       </p>
    //       <h1
    //         className={`origin-left text-2xl font-bold duration-500    ${
    //           !isOpen && "scale-0"
    //         }`}
    //       >
    //         DashBoard
    //       </h1>
    //     </div>

    //     <SlDirections
    //       className=" text-4xl rounded-full bg-white p-2 cursor-pointer absolute -right-3 top-9  text-blue-500 border border-gray-500"
    //       onClick={() => setIsOpen(!isOpen)}
    //     />

    //     <div className=" flex items-center   bg-white rounded-md mt-6 px-4 py-2 ">
    //       <BiSearchAlt2 className="text-lg  origin-left cursor-pointer" />
    //       <input
    //         type="search"
    //         placeholder=" Search"
    //         className="w-full focus:outline-none"
    //       />
    //     </div>

    //     {/* <div className=" inline-flex gap-5 mt-8 justify-center items-center   ">
    //       <RiDirectionFill className=" inline-block float-left  text-4xl rounded-full  border border-gray-500  mr-2 cursor-pointer bg-white " />
    //       <h1
    //         className={`origin-left text-2xl font-extrabold duration-500    ${
    //           !isOpen && "scale-0"
    //         }`}
    //       >
    //         DashBoard
    //       </h1>
    //     </div> */}

    //     <div>
    //       {Menu.map((product, index) => {
    //         return (
    //           <SideBarItem key={index} product={product} isOpen={isOpen} />
    //         );
    //       })}
    //     </div>
    //   </div>
    //   <div className="flex bg-blue-300  sm:hidden justify-between p-4 py-5">
    //     <div>
    //       <img src={Agro} alt="agro" className="absolute -top-2  w-[160px]  " />
    //     </div>

    //     {isMenu && (
    //       <motion.div
    //         variants={variants}
    //         className="md:hidden w-35 bg-slate-100 shadow-xl rounded-lg flex-col  absolute top-20 right-0"
    //       >
    //         <Link to={"/panel"} onClick={() => setIsMenu(!isMenu)}>
    //           <motion.p
    //             initial="hidden"
    //             animate="visible"
    //             variants={variants}
    //             className="px-4 py-2 flex jus items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out  "
    //           >
    //             <GrDashboard />
    //             Inventario
    //           </motion.p>
    //         </Link>
    //         <Link to={"/add-product"} onClick={() => setIsMenu(!isMenu)}>
    //           <motion.p
    //             initial="hidden"
    //             animate="visible"
    //             variants={variants}
    //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out  "
    //           >
    //             <MdAdd />
    //             Product+
    //           </motion.p>
    //         </Link>
    //         <Link to={"/profiles"}>
    //           <motion.p
    //             initial="hidden"
    //             animate="visible"
    //             variants={variants}
    //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
    //           >
    //             <CgProfile /> Profile
    //           </motion.p>
    //         </Link>
    //         <Link to={"/produccionC"}>
    //           <motion.p
    //             initial="hidden"
    //             animate="visible"
    //             variants={variants}
    //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
    //           >
    //             <BiSupport /> Support
    //           </motion.p>
    //         </Link>
    //         <Link to={"/contact-us"}>
    //           <motion.p
    //             initial="hidden"
    //             animate="visible"
    //             variants={variants}
    //             className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
    //           >
    //             <BiSupport /> Support
    //           </motion.p>
    //         </Link>
    //         <motion.p
    //           initial="hidden"
    //           animate="visible"
    //           variants={variants}
    //           className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-boton hover:rounded-lg transition-all duration-100 ease-in-out "
    //         >
    //           New item <MdAdd />
    //         </motion.p>
    //       </motion.div>
    //     )}
    //     <div className="flex p-3 justify-end items-end rounded-full bg-white">
    //       <BsMenuButtonWideFill onClick={() => setIsMenu(!isMenu)} />
    //     </div>
    //   </div>
    //   <div className={`text-center  w-full bg-slate-50`}>
    //     <div className="bg-gray-200 ">{children}</div>
    //   </div>
    // </header>

    <header className="grid sm:flex min-h-screen">
  {" "}
  {/* ... Menú de Escritorio (sm:block) - Sin Cambios ... */}
  <div
    className={`min-h-screen hidden sm:block bg-blue-300 p-5 pt-8 ${
      isOpen ? " w-30 md:w-72 " : " w-0 sm:w-24 "
    } relative duration-500`}
  >
    {/* ... Contenido del Menú de Escritorio ... */}
    <div className="inline-flex gap-5 justify-center items-center">
      <p
        className="text-4xl font-bold mt-1 text-white cursor-pointer"
        onClick={goHome}
      >
        <AiFillGithub />
      </p>
      <h1
        className={`origin-left text-2xl font-bold duration-500 ${
          !isOpen && "scale-0"
        }`}
      >
        DashBoard
      </h1>
    </div>

    <SlDirections
      className=" text-4xl rounded-full bg-white p-2 cursor-pointer absolute -right-3 top-9 text-blue-500 border border-gray-500"
      onClick={() => setIsOpen(!isOpen)}
    />

    <div className=" flex items-center bg-white rounded-md mt-6 px-4 py-2 ">
      <BiSearchAlt2 className="text-lg origin-left cursor-pointer" />
      <input
        type="search"
        placeholder=" Search"
        className="w-full focus:outline-none"
      />
    </div>

    <div>
      {Menu.map((product, index) => {
        return <SideBarItem key={index} product={product} isOpen={isOpen} />;
      })}
    </div>
  </div>
  
  {/* =======================================================
      MENÚ MÓVIL (sm:hidden) - MEJORADO
      ======================================================= */}
  <div className="flex bg-blue-300 sm:hidden justify-between p-4 py-5 relative z-10">
    <div>
      <img src={Agro} alt="agro" className="absolute -top-2 w-[160px]" />
    </div>

    {isMenu && (
      <motion.div
        // Aumenté la duración de la animación a 0.5s para suavizar la entrada/salida
        ref={menuRef} 
        initial={{ opacity: 0, x: 50, scale: 0.9 }} 
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }} 
        
        // Clases de diseño más compacto y elegante
        className="w-48 bg-white shadow-2xl rounded-lg flex-col absolute top-16 right-4 z-20 overflow-hidden border border-gray-100" 
      >
        <Link to={"/user-management"} onClick={() => setIsMenu(!isMenu)}>
          <motion.p
            className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
          >
            <FaChessKing  className="text-lg"/>
            SuperUser
          </motion.p>
        </Link>
        <Link to={"/user-master"} onClick={() => setIsMenu(!isMenu)}>
          <motion.p
            className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
          >
            <FaExchangeAlt className="text-lg"/>
            Admin
          </motion.p>
        </Link>
        <Link to={"/profiles"}>
          <motion.p
            className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
          >
            <CgProfile className="text-lg"/> Profile
          </motion.p>
        </Link>
        {/* ... Otros Links con clases ajustadas ... */}
       
        <Link to={"/contact-us"}>
          <motion.p
            className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
          >
            <BiSupport className="text-lg"/> Contacto
          </motion.p>
        </Link>
        <motion.p
          className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-t border-gray-100" // Línea separadora
        >
          New item <MdAdd className="text-lg"/>
        </motion.p>
      </motion.div>
    )}
    <div className="flex p-3 justify-end items-end rounded-full bg-white">
      <BsMenuButtonWideFill onClick={() => setIsMenu(!isMenu)} />
    </div>
  </div>

  {/* ... Contenido Principal ... */}
  <div className={`text-center w-full bg-slate-50`}>
    <div className="bg-gray-200">{children}</div>
  </div>
</header>
  );
};

export default SideBar;





