// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { SET_LOGIN } from "../features/auth/authSlice/authSlice";
// import { getLoginStatus } from "../services/Services";
// const useRedirectLoggedOutUser = (path) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const redirectLoggedOutUser = async () => {
//       const isLoggedIn = await getLoginStatus();
//       dispatch(SET_LOGIN(isLoggedIn));

//       if (!isLoggedIn) {
//         toast.info("Session expired, please login to continue.");
//         navigate(path);
//         return;
//       }
//     };
//     redirectLoggedOutUser();
//   }, [navigate, path, dispatch]);
// };

// export default useRedirectLoggedOutUser;


// // custom/useRedirect.js (VERSIÓN CORREGIDA)
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { SET_LOGIN } from "../features/auth/authSlice/authSlice";
// import { getLoginStatus } from "../services/Services";

// const useRedirectLoggedOutUser = (path) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const redirectLoggedOutUser = async () => {
//       // 1. Obtiene el estado de autenticación del backend (asíncrono)
//       const isLoggedIn = await getLoginStatus();
      
//       // 2. Actualiza el estado de Redux INMEDIATAMENTE con el resultado
//       // Esto se usa para el resto de la aplicación (UI, otros componentes).
//       dispatch(SET_LOGIN(isLoggedIn));

//       // 3. 🛑 Lógica de redirección basada en el resultado de la API.
//       // Esta es la comprobación más fiable y la realiza ANTES de que otros
//       // componentes puedan ejecutar su lógica basada en Redux.
//       if (!isLoggedIn) {
//         toast.info("Session expired, please login to continue.");
//         navigate(path);
//         // No es necesario 'return' si la redirección es la última acción,
//         // pero ayuda a salir rápidamente del flujo asíncrono.
//         return; 
//       }
      
//       // 4. Si isLoggedIn es true, el hook finaliza y el componente (DashBoard)
//       // puede continuar cargando sus datos.
//     };
    
//     // Ejecuta la función de verificación inmediatamente.
//     redirectLoggedOutUser();
    
//     // NOTA: No necesitamos que Redux sea una dependencia aquí. Solo usamos navigate y path.
//   }, [navigate, path]); 
//   // Eliminé 'dispatch' de las dependencias.

// };

// export default useRedirectLoggedOutUser;


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SET_LOGIN } from "../features/auth/authSlice/authSlice";
import { getLoginStatus } from "../services/Services";
const useRedirectLoggedOutUser = (path) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const redirectLoggedOutUser = async () => {
      const isLoggedIn = await getLoginStatus();
      dispatch(SET_LOGIN(isLoggedIn));

      if (!isLoggedIn) {
        toast.info("Session expired, please login to continue.");
        navigate(path);
        return;
      }
    };
    redirectLoggedOutUser();
  }, [navigate, path, dispatch]);
};

export default useRedirectLoggedOutUser;

