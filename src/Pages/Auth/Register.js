import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegIdCard, FaArrowLeft } from "react-icons/fa"; // Importamos FaArrowLeft
import { GiFruitTree } from "react-icons/gi";
import { motion } from "framer-motion"; // Importamos motion para la transición
import { useDispatch } from "react-redux";
import { registerUser, validateEmail } from "../../services/Services";
import { SET_LOGIN, SET_NAME } from "../../features/auth/authSlice/authSlice";
import Loader from "../../Util/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

// =========================================================
// VARIANTE DE TRANSICIÓN PROFESIONAL (Diferente a Login)
// Se desliza desde la izquierda con una ligera rotación (Spring effect)
// =========================================================
const formVariants = {
  initial: {
    x: "-100vw", // Comienza fuera de la pantalla a la izquierda
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    x: 0, // Se mueve a su posición final (centro)
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100, // Hace que la transición sea suave pero rápida
      damping: 15,
      delay: 0.2, // Pequeño delay de 200ms
      duration: 0.8,
    },
  },
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const goToRoot = () => {
    navigate("/");
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Todos los campos son obligatorios");
    }
    if (password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }
    if (!validateEmail(email)) {
      return toast.error("Por favor, introduce un email válido");
    }
    if (password !== password2) {
      return toast.error("Las contraseñas no coinciden");
    }

    const userData = {
      name,
      email,
      password,
    };
    setIsLoading(true);

    try {
      const data = await registerUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/panel");
      setIsLoading(false);
      setformData(initialState);
      toast.success("Registro exitoso");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message || "Fallo en el registro. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <ToastContainer />
      {isLoading && <Loader />}
      
      {/* Contenedor Principal con fondo */}
      <div className="h-screen flex items-center justify-center bg-[url('https://pablomoratinos.es/wp-content/uploads/2020/01/clean-login-wordpress-2048x1338.jpg')] bg-cover bg-center bg-no-repeat">
        
        {/* Contenedor Animado con framer-motion */}
        <motion.section
          variants={formVariants}
          initial="initial"
          animate="animate"
          className="w-full max-w-sm"
        >
          {/* Contenedor del Formulario (Estilos modernos) */}
          <div
            className="p-10 border-2 border-white/10 rounded-xl shadow-2xl bg-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]"
          >
            <form className="flex flex-col gap-4" onSubmit={register}>
              
              <div className="flex gap-3 justify-center items-center mb-6">
                <p className="text-4xl text-white font-extrabold">
                  Registro
                </p>
                <FaRegIdCard className="text-3xl text-emerald-400" />
              </div>

              {/* Input Nombre con Estilos Modernos */}
              <input
                type="text"
                name="name"
                required
                value={name}
                placeholder="Nombre"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />
              
              {/* Input Email con Estilos Modernos */}
              <input
                type="email" // Aseguramos que sea tipo email
                name="email"
                required
                value={email}
                placeholder="Email"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />
              
              {/* Input Password con Estilos Modernos */}
              <input
                type="password"
                name="password"
                required
                value={password}
                placeholder="Contraseña"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />
              
              {/* Input Confirm-Password con Estilos Modernos */}
              <input
                type="password"
                name="password2"
                required
                value={password2}
                placeholder="Confirmar Contraseña"
                className="p-3 border-2 border-white/20 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300"
                onChange={handleInputChange}
              />
              
              {/* Botón de Submit con Efecto Hover */}
              <button
                type="submit"
                className="p-3 bg-blue-600 rounded-lg mt-4 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01]"
              >
                Registrar
              </button>

              <p className="text-center text-xl text-white font-extrabold mt-2">-- Opciones --</p>

              <div className="flex justify-between items-center mt-2 text-white">
                
                {/* 1. Botón Regresar a la Raíz (DENTRO DEL CUADRO) */}
                <button
                    type="button" 
                    onClick={goToRoot}
                    className="flex items-center gap-2 p-2 text-white bg-gray-700/50 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-600 hover:scale-105"
                    aria-label="Regresar a la página de inicio"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    Raíz
                </button>

                {/* 2. Enlace a Login (Estilo moderno) */}
                <div className="flex items-center gap-1">
                    <p className="text-sm">¿Ya tienes cuenta?</p>
                    <Link to="/login">
                        <span 
                            className="text-lg text-emerald-400 p-1 border-b-2 border-emerald-400 font-extrabold transition-colors duration-300 hover:text-orange-500 cursor-pointer"
                        >
                            Login
                        </span>
                    </Link>
                </div>
              </div>
            </form>

            <div className="flex justify-center mt-6 gap-2 text-white">
                <p className="font-extrabold text-2xl">AGRODOLORES</p>
                <h1 className="text-2xl font-bold">
                    <GiFruitTree className="text-emerald-400" />
                </h1>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Register;
