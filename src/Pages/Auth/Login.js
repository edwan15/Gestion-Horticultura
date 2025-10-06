// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { FaArrowLeft } from "react-icons/fa"; // Icono para Regresar
// // Importamos 'motion' para las animaciones
// import { motion } from "framer-motion";
// import {
//   SET_LOGIN,
//   SET_NAME,
//   SET_USER,
// } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// import { loginUser, validateEmail } from "../../services/Services";
// import Loader from "../../Util/Loader"; // Ajusta la ruta si es necesario

// const initialState = {
//   email: "",
//   password: "",
// };

// // Configuración de la animación de entrada
// const formVariants = {
//   initial: {
//     y: "100vh", // Empieza fuera de la pantalla (abajo)
//     opacity: 0,
//     scale: 0.8,
//   },
//   animate: {
//     y: 0, // Se mueve a su posición final
//     opacity: 1,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 70, // Suavidad del movimiento
//       delay: 0.3, // **DELAY de 300ms** antes de empezar la transición
//       duration: 0.8,
//     },
//   },
// };

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setformData] = useState(initialState);
//   const { email, password } = formData;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setformData({ ...formData, [name]: value });
//   };

//   const goToRoot = () => {
//     navigate("/");
//   };

//   const login = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("Todos los campos son obligatorios");
//     }

//     if (!validateEmail(email)) {
//       return toast.error("Por favor, introduce un email válido");
//     }

//     const userData = {
//       email,
//       password,
//     };
//     try {
//       setIsLoading(true);
//       const data = await loginUser(userData);

//       await dispatch(SET_LOGIN(true));
//       await dispatch(SET_USER(data));
//       await dispatch(SET_NAME(data.name));
//       navigate("/acumuladoC");
//       setIsLoading(false);
//       setformData(initialState);
//       toast.success("Inicio de sesión exitoso");
//     } catch (error) {
//       setIsLoading(false);
//       toast.error(
//         error.message ||
//           "Fallo en el inicio de sesión. Verifica tus credenciales."
//       );
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="h-screen flex items-center justify-center bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] bg-cover bg-center bg-no-repeat">
//         {/* Usamos motion.div con las variantes para la animación de entrada */}
//         <motion.div
//           variants={formVariants}
//           initial="initial"
//           animate="animate"
//           className="w-full max-w-sm"
//         >
//           {/* Contenedor del Formulario (Estilos modernos) */}
//           <div className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
//             <form className="flex flex-col gap-4" onSubmit={login}>
//               <div className="flex gap-3 justify-center items-center mb-6">
//                 <p className="text-4xl text-white font-extrabold">Login</p>
//                 <SlLogin className="text-3xl text-emerald-400" />
//               </div>

//               {/* Input Email */}
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 name="email"
//                 placeholder="Email"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Input Password */}
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 name="password"
//                 placeholder="Password"
//                 className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
//                 onChange={handleInputChange}
//               />

//               {/* Botón de Submit */}
//               <button
//                 className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
//                 type="submit"
//               >
//                 Enviar
//               </button>

//               <p className="text-center text-xl text-white font-extrabold mt-2">
//                 -- Opciones --
//               </p>

//               {/* Sección de Opciones: Regresar y Registrar */}
//               <div className="flex justify-between items-center mt-2 text-white">
//                 {/* 1. Botón Regresar a la Raíz (MOVIDO DENTRO) */}
//                 <button
//                   type="button" // Importante: evita que se envíe el formulario
//                   onClick={goToRoot}
//                   className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                   aria-label="Regresar a la página de inicio"
//                 >
//                   <FaArrowLeft className="w-4 h-4" />
//                   Raíz
//                 </button>

//                 {/* 2. Enlace a Registrar */}
//                 <Link to="/register">
//                   <span className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer">
//                     Regístrate
//                   </span>
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { FaArrowLeft } from "react-icons/fa"; // Icono para Regresar
// Importamos 'motion' para las animaciones
import { motion } from "framer-motion";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../../features/auth/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { loginUser, validateEmail } from "../../services/Services";
import Loader from "../../Util/Loader"; // Ajusta la ruta si es necesario

const initialState = {
  email: "",
  password: "",
};

// Configuración de la animación de entrada
const formVariants = {
  initial: {
    y: "100vh", // Empieza fuera de la pantalla (abajo)
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    y: 0, // Se mueve a su posición final
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70, // Suavidad del movimiento
      delay: 0.3, // **DELAY de 300ms** antes de empezar la transición
      duration: 0.8,
    },
  },
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const goToRoot = () => {
    navigate("/");
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Todos los campos son obligatorios");
    }

    if (!validateEmail(email)) {
      return toast.error("Por favor, introduce un email válido");
    }

    const userData = {
      email,
      password,
    };
    try {
      setIsLoading(true);
      const data = await loginUser(userData);

      // 🛑 CONSOLE.LOG PARA DEPURACIÓN 🛑
      // Abre la consola (F12) para ver si 'data' contiene el objeto de usuario completo.
      console.log("Datos de Usuario recibidos después del login:", data);
      // ------------------------------------

      await dispatch(SET_LOGIN(true));

      // 🛑 CORRECCIÓN DE SEGURIDAD 🛑
      // 1. SET_USER: Si 'data' es null o undefined (aunque no debería), usa un objeto vacío {}.
      await dispatch(SET_USER(data || {}));

      // 2. SET_NAME: Usa encadenamiento opcional (?.) y valor por defecto para prevenir el fallo del 'name'.
      await dispatch(SET_NAME(data.name || "User"));

      // -----------------------------
      console.log("Datos de Usuario recibidos después del login:", data.name);

      navigate("/panel");
      setIsLoading(false);
      setformData(initialState);
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      // Asegúrate de que el error.message aquí provenga de tu Services.js
      setIsLoading(false);
      toast.error(
        error.message ||
          "Fallo en el inicio de sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="h-screen flex items-center justify-center bg-[url('https://s2.glbimg.com/aFWwcIq0YX0bvSyT4J1HliK7q78=/e.glbimg.com/og/ed/f/original/2015/12/16/thinkstockphotos-476743286.jpg')] bg-cover bg-center bg-no-repeat">
        {/* Usamos motion.div con las variantes para la animación de entrada */}
        <motion.div
          variants={formVariants}
          initial="initial"
          animate="animate"
          className="w-full max-w-sm"
        >
          {/* Contenedor del Formulario (Estilos modernos) */}
          <div className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
            <form className="flex flex-col gap-4" onSubmit={login}>
              <div className="flex gap-3 justify-center items-center mb-6">
                <p className="text-4xl text-white font-extrabold">Login</p>
                <SlLogin className="text-3xl text-emerald-400" />
              </div>

              {/* Input Email */}
              <input
                type="email"
                required
                value={email}
                name="email"
                placeholder="Email"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />

              {/* Input Password */}
              <input
                type="password"
                required
                value={password}
                name="password"
                placeholder="Password"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />

              {/* Botón de Submit */}
              <button
                className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
                type="submit"
              >
                Enviar
              </button>

              <p className="text-center text-xl text-white font-extrabold mt-2">
                -- Opciones --
              </p>

              {/* Sección de Opciones: Regresar y Registrar */}
              <div className="flex justify-between items-center mt-2 text-white">
                {/* 1. Botón Regresar a la Raíz */}
                <button
                  type="button" // Importante: evita que se envíe el formulario
                  onClick={goToRoot}
                  className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
                  aria-label="Regresar a la página de inicio"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Raíz
                </button>

                {/* 2. Enlace a Registrar */}
                <Link to="/register">
                  <span className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer">
                    Regístrate
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
