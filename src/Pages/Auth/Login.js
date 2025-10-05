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
import { FaArrowLeft } from "react-icons/fa";
// Importamos 'motion' para las animaciones
import { motion } from "framer-motion";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../../features/auth/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { loginUser, validateEmail } from "../../services/Services";
import Loader from "../../Util/Loader"; 

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

      // --- INICIO DE LA CORRECCIÓN ---
      
      // NOTA: Si el error persiste, revisa la consola para ver qué devuelve 
      // 'data' (la respuesta de tu API). Si el nombre está anidado (ej: data.user.name),
      // deberás usar esa ruta, por ejemplo: SET_NAME(data.user?.name).
      
      // Aplicamos protección con Encadenamiento Opcional '?.', 
      // aunque es mejor asegurar que la respuesta de la API es correcta.
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data?.name)); // CAMBIO A data?.name
      
      // --- FIN DE LA CORRECCIÓN ---
      
      navigate("/acumuladoC");
      setIsLoading(false);
      setformData(initialState);
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
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
                {/* 1. Botón Regresar a la Raíz (MOVIDO DENTRO) */}
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


// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";
// import { SlLogin } from "react-icons/sl";
// import { SET_LOGIN, SET_NAME } from "../../features/auth/authSlice/authSlice";
// import { useDispatch } from "react-redux";
// import { loginUser, validateEmail } from "../../services/Services";
// import Loader from "../../Util/Loader";


// const initialState = {
//   email: "",
//   password: "",
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

//   const login = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return toast.error("All fields are required");
//     }

//     if (!validateEmail(email)) {
//       return toast.error("Please enter a valid email");
//     }

//     const userData = {
//       email,
//       password,
//     };
//     try {
//       setIsLoading(true);
//       const data = await loginUser(userData);
//       console.log(data.name);
//       await dispatch(SET_LOGIN(true));
//       await dispatch(SET_NAME(data.name));
//       navigate("/panel");
//       setIsLoading(false);
//       setformData(initialState);
//       toast.success("login  successfully");
//     } catch (error) {
//       setIsLoading(false);
//     }
//   };

//   // const initialState = {
//   //   email: "",
//   //   password: "",
//   // };
//   // const Login = () => {
//   //   const dispatch = useDispatch();
//   //   const navigate = useNavigate();
//   //   const [isLoading, setIsLoading] = useState(false);
//   //   const [formData, setFormData] = useState(initialState);
//   //   const { email, password } = formData;

//   //   const handleInputChange = (e) => {
//   //     const { name, value } = e.target;
//   //     setFormData({ ...formData, [name]: value });
//   //   };

//   //   const log = async (e) => {
//   //     e.preventDefault();

//   //     if (!email || !password) {
//   //       return toast.error("completa todos los campos");
//   //     }
//   //     if (!validateEmail) {
//   //       return toast.error("email invalido");
//   //     }

//   //     const userData = {
//   //       email,
//   //       password,
//   //     };
//   //     setIsLoading(true);

//   //     try {
//   //       const data = await loginUser(userData);
//   //       console.log(data);
//   //       await dispatch(SET_LOGIN(true));
//   //       await dispatch(SET_NAME(data.name));
//   //       navigate("/panel");
//   //       setIsLoading(false);
//   //     } catch (error) {
//   //       setIsLoading(false);
//   //       console.log(error)
//   //     }
//   //   };

//   return (
//     <>
     
//       {isLoading && <Loader />}
//       <div className="h-screen sticky  bg-[url('https://grupovillaescusa.com/wp-content/uploads/2018/03/Grupo-Villaescusa-obra-contruccion-nave-industrial-el-jimenado-empresa-de-contruccion-murcia-alicante-2.jpg')]  bg-cover  bg-center bg-no-repeat  ">
//         <section>
//           <div className="flex flex-cols-2 items-center justify-center py-16  ">
//             <div className="max-w-lg max-h-[200px flex items-end   ">
//               {/* <img src={login} alt="login" className=" h-[465px] w-[500px] " /> */}
//             </div>
//             <div className="p-2  bottom-28  mt-20   ">
//               <div className="p-12  border-solid border-2  rounded-lg shadow-lg my-10 bg-cardOverlay">
//                 <form className="flex flex-col" onSubmit={login}>
//                   <div className="flex gap-2 justify-center mb-6">
//                     <p
//                       className="text-center text-3xl text-white font-extrabold mb-5
//                       "
//                     >
//                       {" "}
//                       Login
//                     </p>
//                     <h1 className="text-2xl text-white mt-1">
//                       <SlLogin />
//                     </h1>
//                   </div>
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     name="email"
//                     placeholder="  Email "
//                     className="border-solid border-2 rounded-md mt-3  "
//                     onChange={handleInputChange}
//                   />
//                   <input
//                     type="password"
//                     required
//                     value={password}
//                     name="password"
//                     placeholder="  Password"
//                     className="border-solid border-2 rounded-md mt-2"
//                     onChange={handleInputChange}
//                   />
//                   <button
//                     className="p-1 px-2 bg-blue-500 rounded-md mt-2 text-white"
//                     type="submit"
//                   >
//                     Enviar
//                   </button>

//                   <p className="text-center  text-2xl font-extrabold">--or--</p>
//                   <p className="text-center  mt-2">
//                     <Link to={"/"}>
//                       <span className="text-lg text-white  p-1  border-solid border-b-2 border-emerald-400 font-extrabold hover:text-orange-600 cursor-pointer">
//                         {" "}
//                         Home
//                       </span>
//                     </Link>{" "}
//                     Don't have an account?
//                     <Link to="/register">
//                       <span className="text-lg text-white  p-1  border-solid border-b-2 border-emerald-400 font-extrabold hover:text-orange-600 cursor-pointer">
//                         Register
//                       </span>
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default Login

