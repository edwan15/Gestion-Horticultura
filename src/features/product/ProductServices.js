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



// // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
// import { db } from "../../firebaseConfig"; 
// import { 
//     collection, 
//     addDoc, 
//     getDocs, 
//     doc, 
//     deleteDoc, 
//     getDoc, 
//     updateDoc, 
//     query, 
//     where 
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT (Reemplaza la llamada POST de Axios)
// // ----------------------------------------------------------------------
// const createProduct = async (productData) => {
//     try {
//         // Se asume que productData incluye el 'userId' (UID de Firebase)
//         const docRef = await addDoc(productsCollectionRef, { 
//             ...productData,
//             createdAt: new Date().toISOString(), // Añadir timestamp de creación
//         });
        
//         // Devolvemos el producto con el ID de Firestore
//         return { 
//             id: docRef.id, 
//             ...productData 
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         toast.error("Error al crear el producto.");
//         throw new Error("Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Reemplaza la llamada GET de Axios)
// // ----------------------------------------------------------------------
// // Recibe los parámetros del Dashboard: { userId: finalIdToFetch, mode: fetchMode }
// const getProducts = async ({ userId, mode }) => {
//     let q;

//     if (mode === "all" && userId) {
//         // Modo Admin "all": Obtener todos los productos (sin filtro)
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Modo Usuario/Admin "own": Obtener solo los productos de ese usuario
//         q = query(productsCollectionRef, where("userId", "==", userId));
//     } else {
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }
    
//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             // Mapear el ID de Firestore como 'id' (compatible con tu frontend)
//             id: doc.id,
//             ...doc.data()
//         }));
        
//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT (Reemplaza la llamada DELETE de Axios)
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);
        
//         // Devolver el ID eliminado es útil para actualizar el estado de Redux
//         return id; 

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT (Reemplaza la llamada GET de Axios con ID)
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT (Reemplaza la llamada PATCH de Axios)
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await updateDoc(docRef, formData);

//         // Opcional: obtener los datos actualizados para devolverlos al slice
//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };





// // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
// import { db } from "../../firebaseConfig";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     doc,
//     deleteDoc,
//     getDoc,
//     updateDoc,
//     query,
//     where
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT (Reemplaza la llamada POST de Axios)
// // ----------------------------------------------------------------------
// const createProduct = async (productData) => {
//     try {
//         // Se asume que productData incluye el 'userId' (UID de Firebase)
//         const docRef = await addDoc(productsCollectionRef, {
//             ...productData,
//             createdAt: new Date().toISOString(), // Añadir timestamp de creación
//         });

//         // Devolvemos el producto con el ID de Firestore
//         return {
//             id: docRef.id,
//             ...productData
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         toast.error("Error al crear el producto.");
//         throw new Error("Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Reemplaza la llamada GET de Axios)
// // ----------------------------------------------------------------------
// // Recibe los parámetros del Dashboard: { userId: finalIdToFetch, mode: fetchMode }
// const getProducts = async ({ userId, mode }) => {
//     let q;

//     // 🛑 CORRECCIÓN APLICADA AQUÍ:
//     // Permitir mode === "all" sin un userId explícito para el rol "invitado" o "admin" que ve todo.
//     if (mode === "all") {
//         // Modo Admin/Invitado "all": Obtener todos los productos (sin filtro)
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Modo Usuario/Admin "own": Obtener solo los productos de ese usuario
//         q = query(productsCollectionRef, where("userId", "==", userId));
//     } else {
//         // Esto se ejecutará si mode es 'own' y falta userId, o si mode no es reconocido.
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }

//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             // Mapear el ID de Firestore como 'id' (compatible con tu frontend)
//             id: doc.id,
//             ...doc.data()
//         }));

//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT (Reemplaza la llamada DELETE de Axios)
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);

//         // Devolver el ID eliminado es útil para actualizar el estado de Redux
//         return id;

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT (Reemplaza la llamada GET de Axios con ID)
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT (Reemplaza la llamada PATCH de Axios)
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await updateDoc(docRef, formData);

//         // Opcional: obtener los datos actualizados para devolverlos al slice
//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };



// --- src/features/product/ProductServices.js (COMPLETO Y CORREGIDO) ---

// // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
// import { db } from "../../firebaseConfig";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     doc,
//     deleteDoc,
//     getDoc,
//     updateDoc,
//     query,
//     where
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT
// // ----------------------------------------------------------------------
// const createProduct = async (productData) => {
//     try {
//         // Se asume que productData incluye el ID del usuario (uid)
//         const docRef = await addDoc(productsCollectionRef, {
//             ...productData,
//             createdAt: new Date().toISOString(), // Añadir timestamp de creación
//         });

//         // Devolvemos el producto con el ID de Firestore
//         return {
//             id: docRef.id,
//             ...productData
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         toast.error("Error al crear el producto.");
//         throw new Error("Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Filtro CORREGIDO) 🚀
// // ----------------------------------------------------------------------
// // Recibe los parámetros del Dashboard: { userId: finalIdToFetch, mode: fetchMode }
// const getProducts = async ({ userId, mode }) => {
//     let q;

//     if (mode === "all") {
//         // Modo Admin/Invitado "all": Obtener todos los productos (sin filtro)
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Modo Usuario/Admin "own": Obtener solo los productos de ese usuario
//         // 🛑 CORRECCIÓN CLAVE: Se cambia a 'uid' para coincidir con el selectUserId.
//         // Si tu clave es 'user' o 'userId', ajústala aquí.
//         q = query(productsCollectionRef, where("uid", "==", userId));
//     } else {
//         // Esta excepción es manejada en DashBoard.js para evitar el dispatch cuando falta el ID.
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }

//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             // Mapear el ID de Firestore como 'id' (compatible con tu frontend)
//             id: doc.id,
//             ...doc.data()
//         }));

//         // console.log(productsList); // Para depuración

//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT 
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);

//         return id;

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT 
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT 
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await updateDoc(docRef, formData);

//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };



// // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
// import { db } from "../../firebaseConfig";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     doc,
//     deleteDoc,
//     getDoc,
//     updateDoc,
//     query,
//     where
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // **ATENCIÓN: Campo que guarda el ID del propietario en Firestore**
// const USER_ID_FIELD = "uid"; 

// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT
// // ----------------------------------------------------------------------
// const createProduct = async (productData) => {
//     try {
//         // 🛑 Log de Depuración 1: Datos que entran a la función
//         console.log("🔥 [CREATE] Datos iniciales de producto:", productData);

//         // Se asume que productData incluye el ID del usuario (ej: productData.userId o productData.uid)
//         // Si el componente que llama a createProduct no incluye el ID, el valor será "anonimo".
//         const ownerId = productData.userId || productData.uid || "anonimo";

//         const productToSave = {
//             ...productData,
//             [USER_ID_FIELD]: ownerId, // <--- ESTO ASEGURA QUE SE GUARDE EL CAMPO "uid"
//             createdAt: new Date().toISOString(),
//         };

//         // 🛑 Log de Depuración 2: Datos finales a guardar
//         console.log("🔥 [CREATE] Datos finales a guardar (¡Verifica que 'uid' esté aquí!):", productToSave);

//         const docRef = await addDoc(productsCollectionRef, productToSave);

//         toast.success("Producto creado exitosamente.");
//         return {
//             id: docRef.id,
//             ...productToSave
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         toast.error("Error al crear el producto.");
//         throw new Error("Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Filtro Corregido) 🚀
// // ----------------------------------------------------------------------
// const getProducts = async ({ userId, mode }) => {
//     let q;
//     // 🛑 Log de Depuración 3: Qué se está buscando
//     console.log(`🔎 [FETCH] Iniciando búsqueda. Modo: ${mode}, Filtrando por UserID: ${userId}`);

//     if (mode === "all") {
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Usamos el campo 'uid' para filtrar
//         q = query(productsCollectionRef, where(USER_ID_FIELD, "==", userId)); 
//     } else {
//         console.warn("⚠️ [FETCH] No se puede buscar. userId es nulo o modo incorrecto.");
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }

//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
        
//         // 🛑 Log de Depuración 4: Resultado de la búsqueda
//         console.log(`✅ [FETCH] Consulta exitosa. Productos encontrados: ${productsList.length}`); 
        
//         if (productsList.length > 0) {
//             // Log para verificar la estructura del dato
//             console.log("✅ [FETCH] Primer producto encontrado (¡Verifica el campo 'uid'!):", productsList[0]);
//         }

//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT 
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);

//         return id;

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT 
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT 
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await updateDoc(docRef, formData);

//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };


// import { db } from "../../firebaseConfig";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     doc,
//     deleteDoc,
//     getDoc,
//     updateDoc,
//     query,
//     where
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // **ATENCIÓN: Campo que guarda el ID del propietario en Firestore**
// // Debe coincidir con el campo que envías desde AddProduct.js (currentUserId)
// const USER_ID_FIELD = "userId"; 

// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT
// // ----------------------------------------------------------------------
// // productData AHORA DEBE INCLUIR productData.userId enviado desde el componente
// const createProduct = async (productData) => {
//     try {
//         console.log("🔥 [CREATE] Datos iniciales de producto:", productData);

//         const productToSave = {
//             ...productData,
//             // Utilizamos productData.userId, que debe venir del componente AddProduct
//             [USER_ID_FIELD]: productData.userId, 
//             createdAt: new Date().toISOString(),
//         };

//         // Log de Depuración: Datos finales a guardar
//         console.log("🔥 [CREATE] Datos finales a guardar (¡Verifica que 'userId' tenga el UID real!):", productToSave);

//         const docRef = await addDoc(productsCollectionRef, productToSave);

//         toast.success("Producto creado exitosamente.");
//         return {
//             id: docRef.id,
//             ...productToSave
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         toast.error("Error al crear el producto.");
//         throw new Error("Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Filtro Corregido) 🚀
// // ----------------------------------------------------------------------
// const getProducts = async ({ userId, mode }) => {
//     let q;
//     console.log(`🔎 [FETCH] Iniciando búsqueda. Modo: ${mode}, Filtrando por UserID: ${userId}`);

//     if (mode === "all") {
//         // Modo "all": Obtener todos los productos (sin filtro)
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Modo "own": Filtrar por el ID del usuario
//         // Usamos el campo 'userId' para filtrar, que es el que guardamos en createProduct
//         q = query(productsCollectionRef, where(USER_ID_FIELD, "==", userId)); 
//     } else {
//         console.warn("⚠️ [FETCH] No se puede buscar. userId es nulo o modo incorrecto.");
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }

//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
        
//         console.log(`✅ [FETCH] Consulta exitosa. Productos encontrados: ${productsList.length}`); 

//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT 
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);

//         return id;

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT 
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT 
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await updateDoc(docRef, formData);

//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };


// import { db } from "../../firebaseConfig";
// import {
//     collection,
//     addDoc,
//     getDocs,
//     doc,
//     deleteDoc,
//     getDoc,
//     updateDoc,
//     query,
//     where
// } from "firebase/firestore";
// import { toast } from "react-toastify";

// // Referencia a la colección principal de productos
// const productsCollectionRef = collection(db, "products");

// // **ATENCIÓN: Campo que guarda el ID del propietario en Firestore**
// const USER_ID_FIELD = "userId"; 

// // ======================================================================
// // 🚀 FUNCIÓN AUXILIAR CRÍTICA PARA CONVERTIR FormData A OBJETO PLANO
// // Esto resuelve el error 'undefined' al intentar acceder a productData.userId
// // ======================================================================
// const convertFormDataToObject = (formData) => {
//     const productObject = {};
    
//     // Usamos formData.entries() para iterar correctamente sobre el FormData
//     for (const [key, value] of formData.entries()) {
        
//         // 1. Manejo de archivos (imagen): lo ignoramos aquí si no se sube inmediatamente
//         if (key === 'image' && typeof value === 'object' && value.name) {
//              continue; 
//         }

//         // 2. Aseguramos números para stock
//         if (key === "entradas" || key === "salidas") {
//             // El valor viene como string desde FormData, lo parseamos a número
//             productObject[key] = Number(value);
//         } 
        
//         // 3. Manejo del ID de Usuario (CLAVE para corregir el error)
//         // Si el valor es una cadena vacía "" o la cadena "null" (que viene de Redux),
//         // lo convertimos a null, que Firestore sí soporta.
//         else if (key === USER_ID_FIELD && (value === "" || value === "null")) {
//             productObject[key] = null;
//         } 
        
//         // 4. Resto de campos (strings)
//         else {
//             // Si el valor sigue siendo el string literal "undefined", lo convertimos a null
//              productObject[key] = value === "undefined" ? null : value;
//         }
//     }
//     return productObject;
// };


// // ----------------------------------------------------------------------
// // 1. CREATE PRODUCT
// // ----------------------------------------------------------------------
// // Recibe el FormData enviado desde el componente AddProduct
// const createProduct = async (formData) => {
//     try {
//         console.log("🔥 [CREATE] Datos iniciales de producto:", formData); // Muestra FormData {}

//         // 🚨 PASO CLAVE: Convertir FormData a un objeto plano 🚨
//         const productData = convertFormDataToObject(formData);
        
//         // Aquí debe salir el objeto con los datos, incluyendo 'userId' como string o null
//         console.log("🚀 [CREATE] Datos planos convertidos:", productData);
        
//         // Subida de imagen... (Asumimos que aquí iría la lógica de Storage para obtener la URL)
//         // const imageFile = formData.get('image');
//         let imageURL = ""; 

//         // 🚨 VALIDACIÓN CRÍTICA: Si el userId es null, fallamos aquí antes de Firestore
//         if (!productData[USER_ID_FIELD]) {
//             // Si llega un null, lo lanzamos como error.
//             // Si tu App.js aún no cargó el usuario, esto protege el código.
//             throw new Error("El ID de usuario es nulo. No se pudo guardar el producto.");
//         }
//         // -----------------------------------------------------

//         const productToSave = {
//             ...productData, // Ahora esto funciona porque productData es un objeto plano
//             imageURL: imageURL, 
            
//             // Re-asignamos el userId para asegurar que no se pierda (aunque ya está en ...productData)
//             [USER_ID_FIELD]: productData[USER_ID_FIELD], 
            
//             createdAt: new Date().toISOString(),
//         };

//         // Log de Depuración: Datos finales a guardar
//         // Aquí debes ver el UID real o el mensaje de error si el ID era nulo.
//         console.log("✅ [CREATE] Datos finales a guardar:", productToSave);

//         // La verificación de que productToSave.userId NO sea 'undefined' es clave.
//         const docRef = await addDoc(productsCollectionRef, productToSave);

//         toast.success("Producto creado exitosamente.");
//         return {
//             id: docRef.id,
//             ...productToSave
//         };

//     } catch (error) {
//         console.error("Error creating product in Firestore:", error);
//         // Si el error es una excepción que lanzamos nosotros (ID nulo), la propagamos.
//         toast.error("Error al crear el producto: " + error.message); 
//         throw new Error(error.message || "Error al intentar crear el producto en la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 2. GET ALL PRODUCTS (Filtro Corregido) 
// // ----------------------------------------------------------------------
// const getProducts = async ({ userId, mode }) => {
//     let q;
//     console.log(`🔎 [FETCH] Iniciando búsqueda. Modo: ${mode}, Filtrando por UserID: ${userId}`);

//     if (mode === "all") {
//         q = productsCollectionRef;
//     } else if (mode === "own" && userId) {
//         // Aseguramos que userId no sea null/undefined para el filtro
//         if (typeof userId !== 'string' || userId === 'null') {
//              throw new Error("ID de usuario no válido para filtrar productos propios.");
//         }
//         q = query(productsCollectionRef, where(USER_ID_FIELD, "==", userId)); 
//     } else {
//         console.warn("⚠️ [FETCH] No se puede buscar. userId es nulo o modo incorrecto.");
//         throw new Error("Parámetros de consulta de productos insuficientes.");
//     }

//     try {
//         const querySnapshot = await getDocs(q);
//         const productsList = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
        
//         console.log(`✅ [FETCH] Consulta exitosa. Productos encontrados: ${productsList.length}`); 

//         return productsList;

//     } catch (error) {
//         console.error("Error fetching products from Firestore:", error);
//         throw new Error("Error al obtener productos de la base de datos.");
//     }
// };

// // ----------------------------------------------------------------------
// // 3. DELETE PRODUCT 
// // ----------------------------------------------------------------------
// const deleteProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         await deleteDoc(docRef);

//         return id;

//     } catch (error) {
//         console.error("Error deleting product:", error);
//         throw new Error("Error al eliminar el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 4. GET SINGLE PRODUCT 
// // ----------------------------------------------------------------------
// const getProduct = async (id) => {
//     try {
//         const docRef = doc(db, "products", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             return { id: docSnap.id, ...docSnap.data() };
//         } else {
//             throw new Error("Producto no encontrado.");
//         }
//     } catch (error) {
//         console.error("Error fetching single product:", error);
//         throw new Error("Error al obtener el producto.");
//     }
// };

// // ----------------------------------------------------------------------
// // 5. UPDATE PRODUCT 
// // ----------------------------------------------------------------------
// const updateProduct = async (id, formData) => {
//     try {
//         const docRef = doc(db, "products", id);
//         // Nota: Si pasas FormData aquí, también necesitarás la función de conversión
//         // para asegurarte de que updateDoc reciba un objeto plano, no FormData.
//         await updateDoc(docRef, formData); 

//         const updatedDoc = await getDoc(docRef);
//         return { id: updatedDoc.id, ...updatedDoc.data() };

//     } catch (error) {
//         console.error("Error updating product:", error);
//         throw new Error("Error al actualizar el producto.");
//     }
// };


// export const productService = {
//     createProduct,
//     deleteProduct,
//     getProduct,
//     updateProduct,
//     getProducts
// };


import { db } from "../../firebaseConfig";
// Nota: Ya no necesitamos importar 'storage', 'ref', 'uploadBytes', 'getDownloadURL' de Firebase Storage
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    getDoc,
    updateDoc,
    query,
    where
} from "firebase/firestore";
import { toast } from "react-toastify";

// Referencia a la colección principal de productos
const productsCollectionRef = collection(db, "products");

// Campo que guarda el ID del propietario en Firestore
const USER_ID_FIELD = "userId"; 

// 🚨 CONFIGURACIÓN DE CLOUDINARY (USANDO TUS VALORES) 🚨
const CLOUD_NAME = "ddoeotuge";
const UPLOAD_PRESET = "presentacion12"; // Tu Upload Preset Unsigned
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ======================================================================
// 🚀 FUNCIÓN AUXILIAR PARA SUBIR LA IMAGEN A CLOUDINARY
// Utiliza la misma lógica de 'fetch' que ya tenías en tu componente.
// Recibe un objeto File (la imagen) y devuelve la URL de subida.
// ======================================================================
const uploadImageToCloudinary = async (file) => {
    if (!file || !(file instanceof File)) {
        throw new Error("El archivo de imagen no es válido para subir a Cloudinary.");
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    
    try {
        console.log("Iniciando subida de imagen a Cloudinary...");
        
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudinary API error: ${response.status} - ${errorText}`);
        }

        const fileData = await response.json(); 
        
        console.log("Subida a Cloudinary exitosa. URL:", fileData.secure_url);
        return fileData.secure_url; 
        
    } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
        // Propagamos un error más amigable para el usuario
        throw new Error("Fallo la subida de la imagen a Cloudinary.");
    }
};


// ======================================================================
// 1. CREATE PRODUCT (MODIFICADO para Cloudinary)
// ======================================================================
// Recibe productData (asumiendo que el Thunk ya hizo la conversión a objeto plano)
const createProduct = async (productData) => {
    try {
        let imageURL = productData.image || "";

        // 🚨 Subir la imagen si existe un objeto File 🚨
        if (imageURL instanceof File) {
            imageURL = await uploadImageToCloudinary(imageURL);
        } else {
             imageURL = imageURL.toString(); 
        }

        if (!productData[USER_ID_FIELD]) {
            throw new Error("El ID de usuario es nulo. No se pudo guardar el producto.");
        }
        
        // Formateo de datos numéricos
        const entradas = Number(productData.entradas) || 0;
        const salidas = Number(productData.salidas) || 0;

        const productToSave = {
            ...productData, 
            entradas,
            salidas,
            image: imageURL, // Reemplazamos el File por la URL de Cloudinary
            [USER_ID_FIELD]: productData[USER_ID_FIELD], 
            createdAt: new Date().toISOString(),
        };

        // Limpieza de seguridad
        if (productToSave.image instanceof File) {
             delete productToSave.image; 
        }

        const docRef = await addDoc(productsCollectionRef, productToSave);

        toast.success("Producto creado exitosamente.");
        return {
            id: docRef.id,
            ...productToSave
        };

    } catch (error) {
        console.error("Error creating product in Firestore:", error);
        toast.error("Error al crear el producto: " + error.message); 
        throw new Error(error.message || "Error al intentar crear el producto en la base de datos.");
    }
};

// ======================================================================
// 5. UPDATE PRODUCT (MODIFICADO para Cloudinary)
// ======================================================================
const updateProduct = async (id, productData) => {
    
    let updateObject = { ...productData };
    
    try {
        const docRef = doc(db, "products", id);
        
        // ----------------------------------------------------
        // 🚨 MANEJO DE LA IMAGEN CON CLOUDINARY 🚨
        // ----------------------------------------------------
        
        // Verificar si 'image' es un objeto File (es decir, una nueva imagen)
        if (updateObject.image && updateObject.image instanceof File) {
            
            // Subir la nueva imagen a Cloudinary
            const downloadURL = await uploadImageToCloudinary(updateObject.image);
            
            // Reemplazar el objeto File con la URL de descarga
            updateObject.image = downloadURL; 

        } else {
             // Si no es un File, se asegura que sea un string.
             updateObject.image = updateObject.image ? updateObject.image.toString() : "";
        }
        
        // Formateo de datos numéricos
        updateObject.entradas = Number(updateObject.entradas) || 0;
        updateObject.salidas = Number(updateObject.salidas) || 0;

        // Limpieza final
        if (updateObject.image instanceof File) {
            delete updateObject.image; 
        }

        // ----------------------------------------------------
        // 3. ACTUALIZACIÓN DE FIRESTORE
        // ----------------------------------------------------
        await updateDoc(docRef, updateObject); 

        const updatedDoc = await getDoc(docRef);
        return { id: updatedDoc.id, ...updatedDoc.data() };

    } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Error al actualizar el producto: " + error.message);
        throw new Error("Error al actualizar el producto.");
    }
};


// ======================================================================
// 2, 3, 4. GET ALL, DELETE, GET SINGLE PRODUCTS (Sin cambios)
// ======================================================================
const getProducts = async ({ userId, mode }) => {
    let q;
    if (mode === "all") {
        q = productsCollectionRef;
    } else if (mode === "own" && userId && typeof userId === 'string' && userId !== 'null') {
        q = query(productsCollectionRef, where(USER_ID_FIELD, "==", userId)); 
    } else if (mode === "own") {
        throw new Error("Parámetros de consulta de productos insuficientes.");
    } else {
        q = productsCollectionRef; 
    }

    try {
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return productsList;
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        throw new Error("Error al obtener productos de la base de datos.");
    }
};

const deleteProduct = async (id) => {
    try {
        const docRef = doc(db, "products", id);
        await deleteDoc(docRef);
        return id;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Error al eliminar el producto.");
    }
};

const getProduct = async (id) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Producto no encontrado.");
        }
    } catch (error) {
        console.error("Error fetching single product:", error);
        throw new Error("Error al obtener el producto.");
    }
};
// ======================================================================


export const productService = {
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
    getProducts
};