// import axios from "axios";
// import { toast } from "react-toastify";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// export const validateEmail = (email) => {
//   return email.match(
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   );
// };

// export const loginUser = async (userData) => {
//   try {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/users/login`,
//       userData
//     );
//     if (response.statusText === "OK") {
//       toast.success("Login Successful");
//       return response.data;
//     }
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/users/register`,
//       userData,
//       { withCredentials: true }
//     );
//     if (response.statusText === "OK") {
//       toast.success("Registration Successful");
//     }
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const logoutUser = async () => {
//   try {
//     await axios.get(`${BACKEND_URL}/api/users/logout`);
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const getLoginStatus = async () => {
//   try {
//     const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };
// // Get User Profile
// export const getUser = async () => {
//   try {
//     const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const updateUser = async (formData) => {
//   try {
//     const response = await axios.patch(
//       `${BACKEND_URL}/api/users/updateuser`,
//       formData
//     );
//     return response.data
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// }


import axios from "axios";
import { toast } from "react-toastify";

// 🛑 CLAVE: Configuración Global de Axios
// Esto asegura que todas las solicitudes (POST, GET, PATCH, etc.)
// incluyan automáticamente las cookies (el token JWT) y que el navegador
// acepte la cookie de respuesta desde el dominio cruzado (Backend/Render).
axios.defaults.withCredentials = true;

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const loginUser = async (userData) => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Login Successful");
      return response.data;
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    // Lanza el error para que el componente Login.jsx lo capture
    throw new Error(message); 
  }
};

export const registerUser = async (userData) => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Registration Successful");
    }
    return response.data;
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    await axios.get(`${BACKEND_URL}/api/users/logout`);
    toast.success("Logout Successful");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const getLoginStatus = async () => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Get User Profile
export const getUser = async () => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const updateUser = async (formData) => {
  try {
    // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/updateuser`,
      formData
    );
    return response.data
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
}
