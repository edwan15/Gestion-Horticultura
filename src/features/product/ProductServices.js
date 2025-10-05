// import axios from "axios";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// // create New Product

// const createProduct = async (formData) => {
//   const response = await axios.post(`${BACKEND_URL}/api/products/`, formData);
//   return response.data;
// };

// const getProducts = async () => {
//   const response = await axios.get(`${BACKEND_URL}/api/products/`);
//   return response.data;
// };

// const deleteProduct = async (id) => {
//   const response = await axios.delete(`${BACKEND_URL}/api/products/` + id);
//   return response.data;
// };

// const getProduct = async (id) => {
//   const response = await axios.get(`${BACKEND_URL}/api/products/` + id);
//   return response.data;
// };

// const updateProduct = async (id, formData) => {
//   const response = await axios.patch(
//     `${BACKEND_URL}/api/products/` + id,
//     formData
//   );
//   return response.data;
// };

// export const productService = {
//   createProduct,
//   deleteProduct,
//   getProduct,
//   updateProduct,
//   getProducts,
// };


// import axios from "axios";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// const createProduct = async (formData) => {
//   const response = await axios.post(`${BACKEND_URL}/api/products/`, formData);
//   return response.data;
// };

// // ***** FUNCIÓN getProducts CORREGIDA *****
// const getProducts = async (fetchMode) => {
//   let endpoint = "";
  
//   if (fetchMode === "all") {
//     // RUTA 1: Usar una ruta CLARA para cargar TODOS (Admin/Invitado)
//     // Asume que tu backend tiene una ruta GET /api/products/all
//     endpoint = "/api/products/all"; 
//   } else if (fetchMode === "own") {
//     // RUTA 2: Usar una ruta CLARA para cargar PROPIOS (Usuario)
//     // Asume que tu backend tiene una ruta GET /api/products/own
//     endpoint = "/api/products/own";
//   } else {
//     // FALLBACK: Si por alguna razón el modo no es claro, usa el endpoint de tus productos propios
//     endpoint = "/api/products/own"; 
//   }

//   // Realiza la llamada con la URL construida. No hay ambigüedad con el ID.
//   const response = await axios.get(`${BACKEND_URL}${endpoint}`);
//   return response.data;
// };
// // *****************************************

// const deleteProduct = async (id) => {
//   // Nota: La ruta de deleteProduct/getProduct SI debe incluir el ID.
//   const response = await axios.delete(`${BACKEND_URL}/api/products/` + id);
//   return response.data;
// };

// const getProduct = async (id) => {
//   const response = await axios.get(`${BACKEND_URL}/api/products/` + id);
//   return response.data;
// };

// const updateProduct = async (id, formData) => {
//   const response = await axios.patch(
//     `${BACKEND_URL}/api/products/` + id,
//     formData
//   );
//   return response.data;
// };

// export const productService = {
//   createProduct,
//   deleteProduct,
//   getProduct,
//   updateProduct,
//   getProducts,
// };


// --- src/redux/service/ProductServices.js (CORREGIDO) ---
// import axios from "axios";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// // Función auxiliar para configurar los headers con el token
// const getConfig = (token) => ({
//     headers: {
//         // Ajusta el Content-Type si no envías archivos (usa 'application/json' si es solo JSON)
//         "Content-Type": "multipart/form-data", 
//         Authorization: `Bearer ${token}`,
//     }
// });

// // 1. Crear Producto (REQUIERE TOKEN)
// const createProduct = async (formData, token) => {
//     // CLAVE: Usar getConfig para incluir el token
//     const response = await axios.post(`${BACKEND_URL}/api/products/`, formData, getConfig(token));
//     return response.data;
// };

// // 2. Obtener Productos (REQUIERE TOKEN y fetchMode)
// const getProducts = async (fetchMode, token) => {
//     let endpoint = "";
    
//     // Si no hay token (ej. es invitado), o el modo es "all", usamos la ruta de todos.
//     if (!token || fetchMode === "all") {
//         // **Asegúrate que tu backend tenga esta ruta sin protección fuerte si es para invitados**
//         endpoint = "/api/products/all"; 
//     } else if (fetchMode === "own") {
//         // Usamos la ruta de productos propios. El backend debe usar el token para filtrar.
//         endpoint = "/api/products/own";
//     }

//     // CLAVE: Usar getConfig para incluir el token
//     const response = await axios.get(`${BACKEND_URL}${endpoint}`, getConfig(token));
//     return response.data;
// };

// // 3. Eliminar Producto (REQUIERE TOKEN)
// const deleteProduct = async (id, token) => {
//     // CLAVE: Usar getConfig para incluir el token
//     const response = await axios.delete(`${BACKEND_URL}/api/products/${id}`, getConfig(token));
//     return response.data;
// };

// // 4. Obtener Producto Individual (REQUIERE TOKEN)
// const getProduct = async (id, token) => {
//     // CLAVE: Usar getConfig para incluir el token
//     const response = await axios.get(`${BACKEND_URL}/api/products/${id}`, getConfig(token));
//     return response.data;
// };

// // 5. Actualizar Producto (REQUIERE TOKEN)
// const updateProduct = async (id, formData, token) => {
//     // CLAVE: Usar getConfig para incluir el token
//     const response = await axios.patch(
//         `${BACKEND_URL}/api/products/${id}`,
//         formData,
//         getConfig(token)
//     );
//     return response.data;
// };

// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts,
// };


// // --- src/redux/service/ProductServices.js ---
// import axios from "axios";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// // Función auxiliar para configurar los headers con el token
// const getConfig = (token) => ({
//     headers: {
//         "Content-Type": "multipart/form-data", // Mantener si usas archivos
//         Authorization: `Bearer ${token}`,
//     }
// });

// // 1. Crear producto (REQUIERE TOKEN)
// const createProduct = async (formData, token) => {
//     const response = await axios.post(`${BACKEND_URL}/api/products/`, formData, getConfig(token)); 
//     return response.data;
// };

// // 2. Obtener productos (REQUIERE TOKEN y fetchMode)
// const getProducts = async (fetchMode, token) => {
//     let endpoint = "";
    
//     // El frontend ya determina si es 'all' o 'own'
//     if (fetchMode === "all") {
//         endpoint = "/api/products/all"; // Para 'admin' o 'invitado'
//     } else { 
//         endpoint = "/api/products/own"; // Para 'usuario' o fallback
//     }
    
//     // Todas las llamadas GET de productos ahora llevan el token
//     const response = await axios.get(`${BACKEND_URL}${endpoint}`, getConfig(token)); 
//     return response.data;
// };

// // 3. Eliminar producto (REQUIERE TOKEN)
// const deleteProduct = async (id, token) => {
//     const response = await axios.delete(`${BACKEND_URL}/api/products/${id}`, getConfig(token));
//     return response.data;
// };

// // 4. Obtener un solo producto (REQUIERE TOKEN)
// const getProduct = async (id, token) => {
//     const response = await axios.get(`${BACKEND_URL}/api/products/${id}`, getConfig(token));
//     return response.data;
// };

// // 5. Actualizar producto (REQUIERE TOKEN)
// const updateProduct = async (id, formData, token) => {
//     const response = await axios.patch(
//         `${BACKEND_URL}/api/products/${id}`, 
//         formData, 
//         getConfig(token)
//     );
//     return response.data;
// };

// export const productService = {
//     createProduct,
//     getProducts,
//     deleteProduct,
//     getProduct,
//     updateProduct
// };

import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// create New Product

const createProduct = async (formData) => {
  const response = await axios.post(`${BACKEND_URL}/api/products/`, formData);
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/products/`);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/api/products/` + id);
  return response.data;
};

const getProduct = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/` + id);
  return response.data;
};

const updateProduct = async (id, formData) => {
  const response = await axios.patch(
    `${BACKEND_URL}/api/products/` + id,
    formData
  );
  return response.data;
};

export const productService = {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  getProducts,
};
