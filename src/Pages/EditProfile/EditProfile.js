// import React,{useEffect,useState}from"react";
// import {useSelector,useDispatch}from"react-redux";
// import {useNavigate}from"react-router-dom";
// import {toast}from"react-toastify";
// import {selectUser}from"../../features/auth/authSlice/authSlice";
// import axios from"axios";
// import {SERVER_URL}from"../../App";
// import Loader from"../../Util/Loader";
// import {motion,AnimatePresence}from"framer-motion";
// import {FaSave,FaSpinner}from"react-icons/fa";

// // Credenciales de Cloudinary (tomadas de tu archivo de ejemplo)
// const CLOUD_NAME="ddoeotuge";
// const UPLOAD_PRESET="presentacion12";

// const EditProfile=()=>{
// const navigate=useNavigate();
// const dispatch=useDispatch();
// const [isLoading,setIsLoading]=useState(false);
// const user=useSelector(selectUser);
// const {email}=user;

// useEffect(()=>{
// if(!email){
// navigate("/profile");
// }
// },[email,navigate]);

// const initialState={
// name:user?.name||"",
// email:user?.email||"",
// phone:user?.phone||"",
// bio:user?.bio||"",
// photo:user?.photo||"",
// };
// const [profile,setProfile]=useState(initialState);
// const [profileImage,setProfileImage]=useState(null);

// const handleInputChange=(e)=>{
// const {name,value}=e.target;
// setProfile({...profile,[name]:value});
// };

// const handleImageChange=(e)=>{
// setProfileImage(e.target.files[0]);
// };

// // 🛑 FUNCIÓN PRINCIPAL DE SUBIDA DE IMAGEN Y ACTUALIZACIÓN DE PERFIL
// const saveProfile=async(e)=>{
// e.preventDefault();
// setIsLoading(true);

// try{
// let imageURL=profile.photo; // Mantiene la foto existente por defecto

// // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
// if(profileImage){
// // Validación básica de tamaño antes de subir
// if (profileImage.size > 2 * 1024 * 1024) { 
// throw new Error("La imagen es demasiado grande. Máximo 2MB recomendado.");
// }

// const data=new FormData();
// data.append("file",profileImage);
// data.append("upload_preset",UPLOAD_PRESET);

// // Lógica de subida directa a la API de Cloudinary
// const response=await fetch(
// `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
// {method:"POST",body:data}
// );

// const imgData=await response.json();

// if(imgData.error){
// throw new Error(imgData.error.message||"Error al subir imagen a Cloudinary.");
// }

// imageURL=imgData.secure_url; // Obtiene la URL de Cloudinary
// }

// // 2. Preparar los datos y OBTENER EL TOKEN (SOLUCIÓN AL ERROR DE AUTORIZACIÓN)
// const formData={
// name:profile.name,
// phone:profile.phone,
// bio:profile.bio,
// photo:imageURL, // Usa la URL de Cloudinary o la URL existente
// };

// // ⭐ Asegúrate que "token" sea el nombre real de tu clave en localStorage
// const token = localStorage.getItem("token"); 

// if (!token) {
//     throw new Error("No se encontró el token de sesión. Por favor, vuelve a iniciar sesión.");
// }

// // ⭐ Configuración de la cabecera (Header) con el Token para la autenticación en el backend
// const config = {
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`, 
//     },
// };

// // 3. Llamada al backend para actualizar el usuario
// const {data}=await axios.patch(
//     `${SERVER_URL}/api/users/updateuser`,
//     formData,
//     config // <-- ¡PASAMOS LA CONFIGURACIÓN CON EL TOKEN!
// );

// // 4. Actualizar el estado y finalizar
// // if (data.user) {
// // dispatch(SET_USER(data.user)); // Descomentar si usas esta acción
// // }

// toast.success("Perfil actualizado con éxito. ✨");
// navigate("/profile");
// setIsLoading(false);

// }catch(error){
// console.error("Error al guardar el perfil:",error);
// setIsLoading(false);
// const errorMessage=error.response?.data?.message||error.message||"Error desconocido al actualizar.";
// toast.error(errorMessage);
// }
// };

// // URL de la foto para la previsualización
// const currentPhotoURL=profileImage?URL.createObjectURL(profileImage):profile.photo;

// // Componente auxiliar para InputField
// const InputField=({label,name,value,onChange})=>(
// <div>
// <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
// <motion.input
// type="text"
// name={name}
// value={value}
// onChange={onChange}
// whileFocus={{scale:1.01,boxShadow:"0 0 0 2px rgba(59, 130, 246, 0.5)"}}
// className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500"
// />
// </div>
// );

// // Animación de entrada para el contenedor principal
// const cardVariants={
// hidden:{opacity:0,y:50,scale:0.95},
// visible:{
// opacity:1,
// y:0,
// scale:1,
// transition:{type:"spring",stiffness:100,damping:15,delay:0.1}
// }
// };

// return(
// <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
// {isLoading&&<Loader/>}
// <motion.div
// variants={cardVariants}
// initial="hidden"
// animate="visible"
// className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
// >
// <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
// <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
// <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
// <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 pointer-events-none"></div>
// </div>

// <div className="flex justify-center -mt-20 z-10 relative">
// <motion.div
// whileHover={{scale:1.05,boxShadow:"0 0 0 5px rgba(59, 130, 246, 0.5)"}} 
// className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
// >
// <img
// src={currentPhotoURL}
// alt="Editar Perfil"
// className="w-full h-full object-cover aspect-square"
// />
// </motion.div>
// </div>

// <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
// <div className="space-y-4">

// <InputField 
// label="Nombre"
// name="name"
// value={profile.name}
// onChange={handleInputChange}
// />

// <div className="relative">
// <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
// <input
// type="text"
// name="email"
// value={profile.email}
// className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
// disabled
// />
// <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
// </div>

// <InputField 
// label="Teléfono"
// name="phone"
// value={profile.phone}
// onChange={handleInputChange}
// />

// <div>
// <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
// <motion.textarea
// name="bio"
// value={profile.bio}
// onChange={handleInputChange}
// rows="3"
// whileFocus={{scale:1.01,boxShadow:"0 0 0 2px rgba(59, 130, 246, 0.5)"}}
// className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
// ></motion.textarea>
// </div>

// <div className="pt-2">
// <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
// <input 
// type="file" 
// name="image" 
// accept="image/*"
// onChange={handleImageChange} 
// className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
// />
// </div>
// </div>

// <motion.div
// className="pt-4"
// initial={{opacity:0,y:20}}
// animate={{opacity:1,y:0}}
// transition={{delay:0.3}}
// >
// <motion.button 
// type="submit"
// whileHover={{scale:1.02,boxShadow:"0 4px 15px rgba(220, 38, 38, 0.4)"}}
// whileTap={{scale:0.98}}
// className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
// disabled={isLoading}
// >
// <AnimatePresence mode="wait">
// {isLoading?(
// <motion.div
// key="loading"
// initial={{opacity:0}}
// animate={{opacity:1}}
// exit={{opacity:0}}
// className="flex items-center"
// >
// <FaSpinner className="animate-spin mr-2"/>
// Guardando Cambios...
// </motion.div>
// ):(
// <motion.span
// key="save"
// initial={{opacity:0}}
// animate={{opacity:1}}
// exit={{opacity:0}}
// className="flex items-center"
// >
// <FaSave className="mr-2"/>
// Actualizar Perfil
// </motion.span>
// )}
// </AnimatePresence>
// </motion.button>
// </motion.div>
// </form>
// </motion.div>
// </div>
// );
// };

// export default EditProfile;



// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice"; // Importa SET_USER
// import axios from "axios";
// import { SERVER_URL } from "../../App";
// import Loader from "../../Util/Loader";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSave, FaSpinner } from "react-icons/fa";

// // Credenciales de Cloudinary (tomadas de tu archivo de ejemplo)
// const CLOUD_NAME = "ddoeotuge";
// const UPLOAD_PRESET = "presentacion12";

// const EditProfile = () => {
// const navigate = useNavigate();
// const dispatch = useDispatch();
// const [isLoading, setIsLoading] = useState(false);
// const user = useSelector(selectUser);
// const { email } = user;

// useEffect(() => {
// if (!email) {
// navigate("/profile");
// }
// }, [email, navigate]);

// const initialState = {
// name: user?.name || "",
// email: user?.email || "",
// phone: user?.phone || "",
// bio: user?.bio || "",
// photo: user?.photo || "",
// };
// const [profile, setProfile] = useState(initialState);
// const [profileImage, setProfileImage] = useState(null);

// const handleInputChange = (e) => {
// const { name, value } = e.target;
// setProfile({ ...profile, [name]: value });
// };

// const handleImageChange = (e) => {
// setProfileImage(e.target.files[0]);
// };

// // 🛑 FUNCIÓN PRINCIPAL DE SUBIDA DE IMAGEN Y ACTUALIZACIÓN DE PERFIL (CORREGIDA)
// const saveProfile = async (e) => {
// e.preventDefault();
// setIsLoading(true);

// try {
// let imageURL = profile.photo; // Mantiene la foto existente por defecto

// // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
// if (profileImage) {
// // Validación básica de tamaño antes de subir
// if (profileImage.size > 2 * 1024 * 1024) { 
// throw new Error("La imagen es demasiado grande. Máximo 2MB recomendado.");
// }

// const data = new FormData();
// data.append("file", profileImage);
// data.append("upload_preset", UPLOAD_PRESET);

// // Lógica de subida directa a la API de Cloudinary
// const response = await fetch(
// `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
// { method: "POST", body: data }
// );

// const imgData = await response.json();

// if (imgData.error) {
// throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
// }

// imageURL = imgData.secure_url; // Obtiene la URL de Cloudinary
// }

// // 2. Preparar los datos y OBTENER Y CONFIGURAR EL TOKEN
// const formData = {
// name: profile.name,
// phone: profile.phone,
// bio: profile.bio,
// photo: imageURL, // Usa la URL de Cloudinary o la URL existente
// };

// // ⭐ PASO CRÍTICO: OBTENER EL TOKEN Y CONFIGURAR LA CABECERA
// const token = localStorage.getItem("token");

// if (!token) {
// throw new Error("No se encontró el token de sesión. Por favor, vuelve a iniciar sesión.");
// }

// // Configuración de la cabecera (Header) con el Token para la autenticación en el backend
// const config = {
// headers: {
// "Content-Type": "application/json",
// "Authorization": `Bearer ${token}`, // FORMATO ESTÁNDAR PARA ENVIAR JWT
// },
// };

// // 3. Llamada al backend para actualizar el usuario
// const { data } = await axios.patch(
// `${SERVER_URL}/api/users/updateuser`,
// formData,
// config // <-- ¡PASAMOS LA CONFIGURACIÓN CON EL TOKEN!
// );

// // 4. Actualizar el estado y finalizar
// if (data.user) {
// dispatch(SET_USER(data.user)); // ✅ Sincroniza el estado de Redux con los nuevos datos
// }

// toast.success("Perfil actualizado con éxito. ✨");
// navigate("/profile");
// // setIsLoading(false); // Ya se hace en el 'finally' si lo tuvieras, sino al final del 'try'
// } catch (error) {
// console.error("Error al guardar el perfil:", error);
// const errorMessage = error.response?.data?.message || error.message || "Error desconocido al actualizar.";
// toast.error(errorMessage);
// } finally {
// setIsLoading(false);
// }
// };

// // URL de la foto para la previsualización
// const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : profile.photo;

// // Componente auxiliar para InputField
// const InputField = ({ label, name, value, onChange }) => (
// <div>
// <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
// <motion.input
// type="text"
// name={name}
// value={value}
// onChange={onChange}
// whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
// className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500"
// />
// </div>
// );

// // Animación de entrada para el contenedor principal
// const cardVariants = {
// hidden: { opacity: 0, y: 50, scale: 0.95 },
// visible: {
// opacity: 1,
// y: 0,
// scale: 1,
// transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
// }
// };

// return (
// <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
// {isLoading && <Loader />}
// <motion.div
// variants={cardVariants}
// initial="hidden"
// animate="visible"
// className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
// >
// <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
// <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
// <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
// <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 pointer-events-none"></div>
// </div>

// <div className="flex justify-center -mt-20 z-10 relative">
// <motion.div
// whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
// className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
// >
// <img
// src={currentPhotoURL}
// alt="Editar Perfil"
// className="w-full h-full object-cover aspect-square"
// />
// </motion.div>
// </div>

// <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
// <div className="space-y-4">

// <InputField
// label="Nombre"
// name="name"
// value={profile.name}
// onChange={handleInputChange}
// />

// <div className="relative">
// <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
// <input
// type="text"
// name="email"
// value={profile.email}
// className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
// disabled
// />
// <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
// </div>

// <InputField
// label="Teléfono"
// name="phone"
// value={profile.phone}
// onChange={handleInputChange}
// />

// <div>
// <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
// <motion.textarea
// name="bio"
// value={profile.bio}
// onChange={handleInputChange}
// rows="3"
// whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
// className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
// ></motion.textarea>
// </div>

// <div className="pt-2">
// <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
// <input
// type="file"
// name="image"
// accept="image/*"
// onChange={handleImageChange}
// className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
// />
// </div>
// </div>

// <motion.div
// className="pt-4"
// initial={{ opacity: 0, y: 20 }}
// animate={{ opacity: 1, y: 0 }}
// transition={{ delay: 0.3 }}
// >
// <motion.button
// type="submit"
// whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
// whileTap={{ scale: 0.98 }}
// className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
// disabled={isLoading}
// >
// <AnimatePresence mode="wait">
// {isLoading ? (
// <motion.div
// key="loading"
// initial={{ opacity: 0 }}
// animate={{ opacity: 1 }}
// exit={{ opacity: 0 }}
// className="flex items-center"
// >
// <FaSpinner className="animate-spin mr-2" />
// Guardando Cambios...
// </motion.div>
// ) : (
// <motion.span
// key="save"
// initial={{ opacity: 0 }}
// animate={{ opacity: 1 }}
// exit={{ opacity: 0 }}
// className="flex items-center"
// >
// <FaSave className="mr-2" />
// Actualizar Perfil
// </motion.span>
// )}
// </AnimatePresence>
// </motion.button>
// </motion.div>
// </form>
// </motion.div>
// </div>
// );
// };

// export default EditProfile;


// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice";
// import axios from "axios";
// import { SERVER_URL } from "../../App";
// import Loader from "../../Util/Loader";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSave, FaSpinner } from "react-icons/fa";

// // 🛑 IMPORTAR FIREBASE AUTH para obtener el token 🛑
// // Ajusta la ruta si es necesario.
// import { auth } from "../../firebaseConfig"; // <-- Importa tu objeto 'auth' de Firebase

// // Credenciales de Cloudinary (tomadas de tu archivo de ejemplo)
// const CLOUD_NAME = "ddoeotuge";
// const UPLOAD_PRESET = "presentacion12";

// const EditProfile = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isLoading, setIsLoading] = useState(false);
//     const user = useSelector(selectUser);
    
//     // Verifica que el usuario de Redux y Firebase esté cargado
//     const currentUser = auth.currentUser; 

//     // Destructuramos solo si el usuario de Redux existe
//     const { email } = user || {}; 

//     useEffect(() => {
//         // Redirige si el usuario no está logueado en Redux o Firebase
//         if (!email && !currentUser) { 
//             navigate("/profile");
//         }
//     }, [email, navigate, currentUser]);

//     const initialState = {
//         name: user?.name || "",
//         email: user?.email || "",
//         phone: user?.phone || "",
//         bio: user?.bio || "",
//         photo: user?.photo || "",
//     };
//     const [profile, setProfile] = useState(initialState);
//     const [profileImage, setProfileImage] = useState(null);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile({ ...profile, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProfileImage(e.target.files[0]);
//     };

//     // 🛑 FUNCIÓN PRINCIPAL DE SUBIDA DE IMAGEN Y ACTUALIZACIÓN DE PERFIL (CORREGIDA)
//     const saveProfile = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         // 🛑 Verificación de usuario activo 🛑
//         const activeUser = auth.currentUser;
//         if (!activeUser) {
//             toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
//             setIsLoading(false);
//             navigate('/login'); 
//             return;
//         }

//         try {
//             let imageURL = profile.photo; // Mantiene la foto existente por defecto

//             // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
//             if (profileImage) {
//                 if (profileImage.size > 2 * 1024 * 1024) { 
//                     throw new Error("La imagen es demasiado grande. Máximo 2MB recomendado.");
//                 }

//                 const data = new FormData();
//                 data.append("file", profileImage);
//                 data.append("upload_preset", UPLOAD_PRESET);

//                 const response = await fetch(
//                     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//                     { method: "POST", body: data }
//                 );

//                 const imgData = await response.json();

//                 if (imgData.error) {
//                     throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
//                 }

//                 imageURL = imgData.secure_url;
//             }

//             // 2. Preparar los datos
//             const formData = {
//                 name: profile.name,
//                 phone: profile.phone,
//                 bio: profile.bio,
//                 photo: imageURL,
//             };

//             // ⭐ PASO CRÍTICO: OBTENER EL TOKEN DE FIREBASE (ID TOKEN) ⭐
//             // Este token es el que tu servidor debe validar para saber quién es el usuario.
//             const idToken = await activeUser.getIdToken(); 

//             // Configuración de la cabecera (Header) con el Token
//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${idToken}`, // ¡USAMOS EL ID TOKEN DE FIREBASE!
//                 },
//             };

//             // 3. Llamada al backend para actualizar el usuario
//             const { data: responseData } = await axios.patch(
//                 `${SERVER_URL}/api/users/updateuser`,
//                 formData,
//                 config
//             );

//             // 4. Actualizar el estado y finalizar
//             if (responseData.user) {
//                 dispatch(SET_USER(responseData.user)); // Sincroniza el estado de Redux
//             }

//             toast.success("Perfil actualizado con éxito. ✨");
//             navigate("/profile");

//         } catch (error) {
//             console.error("Error al guardar el perfil:", error);
            
//             let errorMessage = "Error desconocido al actualizar.";
//             if (axios.isAxiosError(error)) {
//                 // Manejo de errores de Axios (como 401 Unauthorized)
//                 const status = error.response?.status;
//                 const serverMessage = error.response?.data?.message;

//                 if (status === 401 || status === 403) {
//                     errorMessage = `No autorizado (Código ${status}). Por favor, vuelve a iniciar sesión.`;
//                     navigate('/login'); 
//                 } else if (serverMessage) {
//                     errorMessage = serverMessage;
//                 } else {
//                     errorMessage = `Fallo de red o servidor no disponible (Código ${status || 'N/A'}).`;
//                 }
//             } else {
//                 errorMessage = error.message;
//             }
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // URL de la foto para la previsualización
//     const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : profile.photo;

//     // Componente auxiliar para InputField
//     const InputField = ({ label, name, value, onChange }) => (
//         <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
//             <motion.input
//                 type="text"
//                 name={name}
//                 value={value}
//                 onChange={onChange}
//                 whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
//                 className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500"
//             />
//         </div>
//     );

//     // Animación de entrada para el contenedor principal
//     const cardVariants = {
//         hidden: { opacity: 0, y: 50, scale: 0.95 },
//         visible: {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
//         }
//     };

//     return (
//         <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
//             {isLoading && <Loader />}
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
//             >
//                 <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
//                     <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
//                     <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
//                     <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 pointer-events-none"></div>
//                 </div>

//                 <div className="flex justify-center -mt-20 z-10 relative">
//                     <motion.div
//                         whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
//                         className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
//                     >
//                         <img
//                             src={currentPhotoURL}
//                             alt="Editar Perfil"
//                             className="w-full h-full object-cover aspect-square"
//                         />
//                     </motion.div>
//                 </div>

//                 <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
//                     <div className="space-y-4">

//                         <InputField
//                             label="Nombre"
//                             name="name"
//                             value={profile.name}
//                             onChange={handleInputChange}
//                         />

//                         <div className="relative">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//                             <input
//                                 type="text"
//                                 name="email"
//                                 value={profile.email}
//                                 className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
//                                 disabled
//                             />
//                             <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
//                         </div>

//                         <InputField
//                             label="Teléfono"
//                             name="phone"
//                             value={profile.phone}
//                             onChange={handleInputChange}
//                         />

//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
//                             <motion.textarea
//                                 name="bio"
//                                 value={profile.bio}
//                                 onChange={handleInputChange}
//                                 rows="3"
//                                 whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
//                                 className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
//                             ></motion.textarea>
//                         </div>

//                         <div className="pt-2">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                             />
//                         </div>
//                     </div>

//                     <motion.div
//                         className="pt-4"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.3 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
//                             whileTap={{ scale: 0.98 }}
//                             className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
//                             disabled={isLoading}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.div
//                                         key="loading"
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         className="flex items-center"
//                                     >
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Guardando Cambios...
//                                     </motion.div>
//                                 ) : (
//                                     <motion.span
//                                         key="save"
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         className="flex items-center"
//                                     >
//                                         <FaSave className="mr-2" />
//                                         Actualizar Perfil
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>
//                     </motion.div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default EditProfile;



// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice";
// import axios from "axios";
// import { SERVER_URL } from "../../App"; // Asegúrate de que esta ruta es correcta
// import Loader from "../../Util/Loader"; // Asegúrate de que esta ruta es correcta
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSave, FaSpinner, FaUserCircle } from "react-icons/fa";

// // 🛑 IMPORTAR FIREBASE AUTH para obtener el token 🛑
// import { auth } from "../../firebaseConfig"; // <-- Importa tu objeto 'auth' de Firebase

// // Credenciales de Cloudinary (tomadas de tu archivo de ejemplo)
// const CLOUD_NAME = "ddoeotuge"; 
// const UPLOAD_PRESET = "presentacion12";

// // Animación de entrada para el contenedor principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
//     }
// };

// // Componente auxiliar para InputField
// const InputField = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
//     <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
//         <motion.input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             disabled={disabled}
//             whileFocus={!disabled ? { scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" } : {}}
//             className={`w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
//         />
//     </div>
// );


// const EditProfile = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isLoading, setIsLoading] = useState(false);
//     const user = useSelector(selectUser);
    
//     const currentUser = auth.currentUser; 

//     // Destructuramos solo si el usuario de Redux existe
//     const { email } = user || {}; 

//     useEffect(() => {
//         // Si Redux NO tiene un email válido Y Firebase NO tiene un usuario activo, redirige al login.
//         if (!email && !currentUser) { 
//             navigate("/login"); 
//             toast.error("Tu sesión ha expirado o no has iniciado sesión.");
//         }
//     }, [email, navigate, currentUser]);

//     // Usamos el estado inicial basado en Redux
//     const initialState = {
//         name: user?.name || "",
//         email: user?.email || "",
//         phone: user?.phone || "",
//         bio: user?.bio || "",
//         photo: user?.photo || "",
//     };
//     const [profile, setProfile] = useState(initialState);
//     const [profileImage, setProfileImage] = useState(null);

//     // Sincronizar el estado local con Redux si Redux cambia (ej. al refrescar)
//     useEffect(() => {
//         setProfile(initialState);
//     }, [user]); // Esto asegura que si `user` cambia desde fuera, el formulario se actualiza.


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile({ ...profile, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProfileImage(e.target.files[0]);
//     };

//     const saveProfile = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const activeUser = auth.currentUser;
//         if (!activeUser) {
//             toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
//             setIsLoading(false);
//             navigate('/login'); 
//             return;
//         }

//         try {
//             let imageURL = profile.photo; // Mantiene la foto existente por defecto

//             // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
//             if (profileImage) {
//                 if (profileImage.size > 5 * 1024 * 1024) { 
//                     throw new Error("La imagen es demasiado grande. Máximo 5MB recomendado.");
//                 }

//                 const data = new FormData();
//                 data.append("file", profileImage);
//                 data.append("upload_preset", UPLOAD_PRESET);

//                 const response = await fetch(
//                     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//                     { method: "POST", body: data }
//                 );

//                 const imgData = await response.json();

//                 if (imgData.error) {
//                     throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
//                 }

//                 imageURL = imgData.secure_url;
//             }

//             // 2. Preparar los datos y Token
//             const formData = {
//                 name: profile.name,
//                 phone: profile.phone,
//                 bio: profile.bio,
//                 photo: imageURL,
//             };

//             const idToken = await activeUser.getIdToken(); 

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${idToken}`,
//                 },
//             };

//             // 3. Llamada al backend para actualizar el usuario
//             const { data: responseData } = await axios.patch(
//                 `${SERVER_URL}/api/users/updateuser`,
//                 formData,
//                 config
//             );

//             // 4. Actualizar el estado y finalizar
//             if (responseData.user) {
//                 dispatch(SET_USER(responseData.user)); // 🚀 ¡CLAVE! Actualiza Redux
//             }

//             toast.success("Perfil actualizado con éxito. ✨");
            
//             // 🛑 CORRECCIÓN DE RUTA: Asumo que la ruta de tu perfil es /profiles
//             navigate("/profiles"); 

//         } catch (error) {
//             console.error("Error al guardar el perfil:", error);
            
//             let errorMessage = "Error desconocido al actualizar.";
//             if (axios.isAxiosError(error)) {
//                 const serverMessage = error.response?.data?.message;
//                 errorMessage = serverMessage || "Fallo de red o servidor no disponible.";
//             } else {
//                 errorMessage = error.message;
//             }
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // URL de la foto para la previsualización
//     const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : (profile.photo || 'https://i.imgur.com/k9b6Yw3.png');
    
//     // Si Redux aún no tiene los datos, muestra el Loader
//     if (!profile.email) {
//         return (
//             <div className="flex justify-center items-center min-h-[50vh]">
//                 <Loader />
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
//             <AnimatePresence>
//                 {isLoading && <Loader />}
//             </AnimatePresence>
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
//             >
//                 <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
//                     <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
//                     <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
//                 </div>

//                 <div className="flex justify-center -mt-20 z-10 relative">
//                     <motion.div
//                         whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
//                         className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
//                     >
//                         <img
//                             src={currentPhotoURL}
//                             alt="Editar Perfil"
//                             className="w-full h-full object-cover aspect-square"
//                         />
//                     </motion.div>
//                 </div>

//                 <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
//                     <div className="space-y-4">

//                         <InputField
//                             label="Nombre"
//                             name="name"
//                             value={profile.name}
//                             onChange={handleInputChange}
//                         />

//                         <div className="relative">
//                             <InputField
//                                 label="Email"
//                                 name="email"
//                                 value={profile.email}
//                                 disabled={true}
//                             />
//                             <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
//                         </div>

//                         <InputField
//                             label="Teléfono"
//                             name="phone"
//                             value={profile.phone}
//                             onChange={handleInputChange}
//                         />

//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
//                             <motion.textarea
//                                 name="bio"
//                                 value={profile.bio}
//                                 onChange={handleInputChange}
//                                 rows="3"
//                                 whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
//                                 className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
//                             ></motion.textarea>
//                         </div>

//                         <div className="pt-2">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                             />
//                         </div>
//                     </div>

//                     <motion.div className="pt-4">
//                         <motion.button
//                             type="submit"
//                             whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
//                             whileTap={{ scale: 0.98 }}
//                             className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
//                             disabled={isLoading}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Guardando Cambios...
//                                     </motion.div>
//                                 ) : (
//                                     <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSave className="mr-2" />
//                                         Actualizar Perfil
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>
//                     </motion.div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default EditProfile;



// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice";
// import axios from "axios";
// import { SERVER_URL } from "../../App";
// import Loader from "../../Util/Loader"; 
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSave, FaSpinner } from "react-icons/fa";

// // Importa tu objeto 'auth' de Firebase
// import { auth } from "../../firebaseConfig"; 

// // Credenciales de Cloudinary
// const CLOUD_NAME = "ddoeotuge"; 
// const UPLOAD_PRESET = "presentacion12";

// // Animación de entrada para el contenedor principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
//     }
// };

// // Componente auxiliar para InputField
// const InputField = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
//     <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
//         <motion.input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             disabled={disabled}
//             whileFocus={!disabled ? { scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" } : {}}
//             className={`w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
//         />
//     </div>
// );


// const EditProfile = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isLoading, setIsLoading] = useState(false);
//     const user = useSelector(selectUser);
    
//     const currentUser = auth.currentUser; 

//     // Destructuramos solo si el usuario de Redux existe
//     const { email } = user || {}; 

//     useEffect(() => {
//         // Si Redux NO tiene un email válido Y Firebase NO tiene un usuario activo, redirige al login.
//         if (!email && !currentUser) { 
//             navigate("/login"); 
//             toast.error("Tu sesión ha expirado o no has iniciado sesión.");
//         }
//     }, [email, navigate, currentUser]);

//     // Usamos el estado inicial basado en Redux
//     const initialState = {
//         name: user?.name || "",
//         email: user?.email || "",
//         phone: user?.phone || "",
//         bio: user?.bio || "",
//         photo: user?.photo || "",
//     };
//     const [profile, setProfile] = useState(initialState);
//     const [profileImage, setProfileImage] = useState(null);

//     // Sincronizar el estado local con Redux si Redux cambia (ej. al refrescar)
//     useEffect(() => {
//         setProfile(initialState);
//     }, [user]); 


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile({ ...profile, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProfileImage(e.target.files[0]);
//     };

//     const saveProfile = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const activeUser = auth.currentUser;
//         if (!activeUser) {
//             toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
//             setIsLoading(false);
//             navigate('/login'); 
//             return;
//         }

//         try {
//             let imageURL = profile.photo; // Mantiene la foto existente por defecto

//             // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
//             if (profileImage) {
//                 if (profileImage.size > 5 * 1024 * 1024) { 
//                     throw new Error("La imagen es demasiado grande. Máximo 5MB recomendado.");
//                 }

//                 const data = new FormData();
//                 data.append("file", profileImage);
//                 data.append("upload_preset", UPLOAD_PRESET);

//                 const response = await fetch(
//                     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//                     { method: "POST", body: data }
//                 );

//                 const imgData = await response.json();

//                 if (imgData.error) {
//                     throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
//                 }

//                 imageURL = imgData.secure_url;
//             }

//             // 2. Preparar los datos y Token
//             const formData = {
//                 name: profile.name,
//                 phone: profile.phone,
//                 bio: profile.bio,
//                 photo: imageURL,
//             };

//             const idToken = await activeUser.getIdToken(); 

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${idToken}`,
//                 },
//             };

//             // 3. Llamada al backend para actualizar el usuario
//             const { data: responseData } = await axios.patch(
//                 `${SERVER_URL}/api/users/updateuser`,
//                 formData,
//                 config
//             );

//             // 4. Actualizar el estado y finalizar
//             let userToDispatch = null;
            
//             // 🛑 LÓGICA DE ACTUALIZACIÓN MEJORADA (SOLUCIÓN)
//             if (responseData.user) {
//                 // Opción A: Si el backend anida la respuesta (lo que se espera)
//                 userToDispatch = responseData.user;
//             } else if (responseData._id) { 
//                 // Opción B: Si el backend devuelve el objeto plano (la estructura que me enviaste)
//                 userToDispatch = responseData; 
//             }

//             if (userToDispatch) {
//                 dispatch(SET_USER(userToDispatch)); // 🚀 ¡CLAVE! Actualiza Redux
//                 toast.success("Perfil actualizado con éxito. ✨");
//             } else {
//                 throw new Error("Respuesta del servidor no válida para la actualización.");
//             }

//             // Redirigir a la vista de perfil después de actualizar
//             navigate("/profiles"); 

//         } catch (error) {
//             console.error("Error al guardar el perfil:", error);
            
//             let errorMessage = "Error desconocido al actualizar.";
//             if (axios.isAxiosError(error)) {
//                 const serverMessage = error.response?.data?.message;
//                 errorMessage = serverMessage || "Fallo de red o servidor no disponible.";
//             } else {
//                 errorMessage = error.message;
//             }
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // URL de la foto para la previsualización
//     const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : (profile.photo || 'https://i.imgur.com/k9b6Yw3.png');
    
//     // Si Redux aún no tiene los datos, muestra el Loader
//     if (!profile.email) {
//         return (
//             <div className="flex justify-center items-center min-h-[50vh]">
//                 <Loader />
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
//             <AnimatePresence>
//                 {isLoading && <Loader />}
//             </AnimatePresence>
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
//             >
//                 <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
//                     <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
//                     <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
//                 </div>

//                 <div className="flex justify-center -mt-20 z-10 relative">
//                     <motion.div
//                         whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
//                         className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
//                     >
//                         <img
//                             src={currentPhotoURL}
//                             alt="Editar Perfil"
//                             className="w-full h-full object-cover aspect-square"
//                         />
//                     </motion.div>
//                 </div>

//                 <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
//                     <div className="space-y-4">

//                         <InputField
//                             label="Nombre"
//                             name="name"
//                             value={profile.name}
//                             onChange={handleInputChange}
//                         />

//                         <div className="relative">
//                             <InputField
//                                 label="Email"
//                                 name="email"
//                                 value={profile.email}
//                                 disabled={true}
//                             />
//                             <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
//                         </div>

//                         <InputField
//                             label="Teléfono"
//                             name="phone"
//                             value={profile.phone}
//                             onChange={handleInputChange}
//                         />

//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
//                             <motion.textarea
//                                 name="bio"
//                                 value={profile.bio}
//                                 onChange={handleInputChange}
//                                 rows="3"
//                                 whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
//                                 className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
//                             ></motion.textarea>
//                         </div>

//                         <div className="pt-2">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                             />
//                         </div>
//                     </div>

//                     <motion.div className="pt-4">
//                         <motion.button
//                             type="submit"
//                             whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
//                             whileTap={{ scale: 0.98 }}
//                             className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
//                             disabled={isLoading}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Guardando Cambios...
//                                     </motion.div>
//                                 ) : (
//                                     <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSave className="mr-2" />
//                                         Actualizar Perfil
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>
//                     </motion.div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default EditProfile;








// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice";
// import axios from "axios";
// import { SERVER_URL } from "../../App";
// import Loader from "../../Util/Loader"; 
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSave, FaSpinner } from "react-icons/fa";

// // Importa tu objeto 'auth' de Firebase
// import { auth } from "../../firebaseConfig"; 

// // Credenciales de Cloudinary
// const CLOUD_NAME = "ddoeotuge"; 
// const UPLOAD_PRESET = "presentacion12";

// // Animación de entrada para el contenedor principal
// const cardVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
//     }
// };

// // Componente auxiliar para InputField
// const InputField = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
//     <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
//         <motion.input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             disabled={disabled}
//             whileFocus={!disabled ? { scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" } : {}}
//             className={`w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
//         />
//     </div>
// );


// const EditProfile = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [isLoading, setIsLoading] = useState(false);
//     const user = useSelector(selectUser);
    
//     const currentUser = auth.currentUser; 

//     // 🎯 CORRECCIÓN CLAVE: Inicializar el estado local usando una función para el cálculo diferido.
//     // Esto asegura que el estado solo se inicialice con los valores de Redux en el primer render.
//     const [profile, setProfile] = useState(() => ({
//         name: user?.name || "",
//         email: user?.email || "",
//         phone: user?.phone || "",
//         bio: user?.bio || "",
//         photo: user?.photo || "",
//     }));
    
//     const [profileImage, setProfileImage] = useState(null);

//     // Destructuramos solo si el usuario de Redux existe
//     const { email } = user || {}; 

//     // Efecto de Redirección (Mantenido)
//     useEffect(() => {
//         if (!email && !currentUser) { 
//             navigate("/login"); 
//             toast.error("Tu sesión ha expirado o no has iniciado sesión.");
//         }
//     }, [email, navigate, currentUser]);

//     // ❌ ELIMINADO: Se eliminó el useEffect problemático que sobrescribía el estado local
//     //              cuando Redux se actualizaba después de guardar.
//     // ----------------------------------------------------------------------------


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile({ ...profile, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProfileImage(e.target.files[0]);
//     };

//     // Usamos useCallback para envolver saveProfile, mejorando el rendimiento
//     const saveProfile = useCallback(async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const activeUser = auth.currentUser;
//         if (!activeUser) {
//             toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
//             setIsLoading(false);
//             navigate('/login'); 
//             return;
//         }

//         try {
//             let imageURL = profile.photo; // Mantiene la foto existente por defecto

//             // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
//             if (profileImage) {
//                 if (profileImage.size > 5 * 1024 * 1024) { 
//                     throw new Error("La imagen es demasiado grande. Máximo 5MB recomendado.");
//                 }

//                 const data = new FormData();
//                 data.append("file", profileImage);
//                 data.append("upload_preset", UPLOAD_PRESET);

//                 const response = await fetch(
//                     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//                     { method: "POST", body: data }
//                 );

//                 const imgData = await response.json();

//                 if (imgData.error) {
//                     throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
//                 }

//                 imageURL = imgData.secure_url;
//             }

//             // 2. Preparar los datos y Token
//             const formData = {
//                 name: profile.name,
//                 phone: profile.phone,
//                 bio: profile.bio,
//                 photo: imageURL,
//             };

//             const idToken = await activeUser.getIdToken(); 

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${idToken}`,
//                 },
//             };

//             // 3. Llamada al backend para actualizar el usuario
//             const { data: responseData } = await axios.patch(
//                 `${SERVER_URL}/api/users/updateuser`,
//                 formData,
//                 config
//             );

//             // 4. Actualizar el estado y finalizar
//             let userToDispatch = null;
            
//             // 🛑 LÓGICA DE ACTUALIZACIÓN MEJORADA
//             if (responseData.user) {
//                 // Opción A: Si el backend anida la respuesta (lo que se espera)
//                 userToDispatch = responseData.user;
//             } else if (responseData._id) { 
//                 // Opción B: Si el backend devuelve el objeto plano (la estructura que me enviaste)
//                 userToDispatch = responseData; 
//             }

//             if (userToDispatch) {
//                 dispatch(SET_USER(userToDispatch)); // 🚀 ¡CLAVE! Actualiza Redux
//                 toast.success("Perfil actualizado con éxito. ✨");
//             } else {
//                 throw new Error("Respuesta del servidor no válida para la actualización.");
//             }

//             // Redirigir a la vista de perfil después de actualizar
//             navigate("/profiles"); 

//         } catch (error) {
//             console.error("Error al guardar el perfil:", error);
            
//             let errorMessage = "Error desconocido al actualizar.";
//             if (axios.isAxiosError(error)) {
//                 const serverMessage = error.response?.data?.message;
//                 errorMessage = serverMessage || "Fallo de red o servidor no disponible.";
//             } else {
//                 errorMessage = error.message;
//             }
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [profile, profileImage, navigate, dispatch]);


//     // URL de la foto para la previsualización
//     const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : (profile.photo || 'https://i.imgur.com/k9b6Yw3.png');
    
//     // Si Redux aún no tiene los datos (solo si el componente superior no cargó Redux)
//     if (!profile.email) {
//         return (
//             <div className="flex justify-center items-center min-h-[50vh]">
//                 <Loader />
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
//             <AnimatePresence>
//                 {/* La superposición de Loader durante la carga (opcional, ya manejado en el botón) */}
//             </AnimatePresence>
//             <motion.div
//                 variants={cardVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
//             >
//                 <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
//                     <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
//                     <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
//                 </div>

//                 <div className="flex justify-center -mt-20 z-10 relative">
//                     <motion.div
//                         whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
//                         className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200"
//                     >
//                         <img
//                             src={currentPhotoURL}
//                             alt="Editar Perfil"
//                             className="w-full h-full object-cover aspect-square"
//                         />
//                     </motion.div>
//                 </div>

//                 <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
//                     <div className="space-y-4">

//                         <InputField
//                             label="Nombre"
//                             name="name"
//                             value={profile.name}
//                             onChange={handleInputChange}
//                         />

//                         <div className="relative">
//                             <InputField
//                                 label="Email"
//                                 name="email"
//                                 value={profile.email}
//                                 disabled={true}
//                             />
//                             <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
//                         </div>

//                         <InputField
//                             label="Teléfono"
//                             name="phone"
//                             value={profile.phone}
//                             onChange={handleInputChange}
//                         />

//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
//                             <motion.textarea
//                                 name="bio"
//                                 value={profile.bio}
//                                 onChange={handleInputChange}
//                                 rows="3"
//                                 whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
//                                 className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
//                             ></motion.textarea>
//                         </div>

//                         <div className="pt-2">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                             />
//                         </div>
//                     </div>

//                     <motion.div className="pt-4">
//                         <motion.button
//                             type="submit"
//                             whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
//                             whileTap={{ scale: 0.98 }}
//                             className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
//                             disabled={isLoading}
//                         >
//                             <AnimatePresence mode="wait">
//                                 {isLoading ? (
//                                     <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSpinner className="animate-spin mr-2" />
//                                         Guardando Cambios...
//                                     </motion.div>
//                                 ) : (
//                                     <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
//                                         <FaSave className="mr-2" />
//                                         Actualizar Perfil
//                                     </motion.span>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>
//                     </motion.div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default EditProfile;


import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectUser, SET_USER } from "../../features/auth/authSlice/authSlice";
import axios from "axios";
// Asegúrate de que esta URL esté bien definida y SIN barra final (/)
import { SERVER_URL } from "../../App"; 
import Loader from "../../Util/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaSave, FaSpinner, FaCamera } from "react-icons/fa";

// Importa tu objeto 'auth' de Firebase
import { auth } from "../../firebaseConfig";

// Credenciales de Cloudinary
const CLOUD_NAME = "ddoeotuge";
const UPLOAD_PRESET = "presentacion12";

// Animación de entrada para el contenedor principal
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 }
    }
};

// Componente auxiliar para InputField
const InputField = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <motion.input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            whileFocus={!disabled ? { scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" } : {}}
            className={`w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />
    </div>
);


const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector(selectUser);

    const currentUser = auth.currentUser;

    const [profile, setProfile] = useState(() => ({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
        photo: user?.photo || "",
    }));

    const [profileImage, setProfileImage] = useState(null);
    const [imageFileName, setImageFileName] = useState("Ningún archivo seleccionado");


    const { email } = user || {};

    // Efecto de Redirección
    useEffect(() => {
        if (!email && !currentUser) {
            navigate("/login");
            toast.error("Tu sesión ha expirado o no has iniciado sesión.");
        }
    }, [email, navigate, currentUser]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            setImageFileName(file.name);
        } else {
            setImageFileName("Ningún archivo seleccionado");
        }
    };

    const saveProfile = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const activeUser = auth.currentUser;
        if (!activeUser) {
            toast.error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
            setIsLoading(false);
            navigate('/login');
            return;
        }

        try {
            let imageURL = profile.photo;

            // 1. Subir la imagen a Cloudinary (si se seleccionó una nueva)
            if (profileImage) {
                if (profileImage.size > 5 * 1024 * 1024) {
                    throw new Error("La imagen es demasiado grande. Máximo 5MB recomendado.");
                }

                const data = new FormData();
                data.append("file", profileImage);
                data.append("upload_preset", UPLOAD_PRESET);

                // No necesitamos el ID token para Cloudinary
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    { method: "POST", body: data }
                );

                const imgData = await response.json();

                if (imgData.error) {
                    throw new Error(imgData.error.message || "Error al subir imagen a Cloudinary.");
                }

                imageURL = imgData.secure_url;
            }

            // 2. Preparar los datos y Token
            const formData = {
                name: profile.name,
                phone: profile.phone,
                bio: profile.bio,
                photo: imageURL,
            };

            const idToken = await activeUser.getIdToken();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
            };
            
            // 🚨 RUTA DE ACCESO: Se arma la URL completa
            const apiURL = `${SERVER_URL}/api/users/updateuser`;

            // 🚨 DEBUGGING: Registra la URL que se va a usar para verificar el 404
            console.log("Intentando llamar a PATCH:", apiURL); 

            // 3. Llamada al backend para actualizar el usuario
            const { data: responseData } = await axios.patch(
                apiURL,
                formData,
                config
            );

            // 4. Actualizar el estado y finalizar
            let userToDispatch = responseData.user || responseData; 

            if (userToDispatch && userToDispatch._id) {
                dispatch(SET_USER(userToDispatch)); 
                toast.success("Perfil actualizado con éxito. ✨");
            } else {
                throw new Error("Respuesta del servidor no válida para la actualización.");
            }

            // Redirigir a la vista de perfil después de actualizar
            navigate("/profiles");

        } catch (error) {
            console.error("Error al guardar el perfil:", error.message);
            // Si es un error de Axios, muestra detalles sobre el 404
            if (axios.isAxiosError(error) && error.response) {
                console.error("Detalles del Error del Servidor:", error.response.status, error.response.data);
            }
            
            let errorMessage = "Error desconocido al actualizar.";
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message;
                // Si el status es 404, indicamos un problema de URL
                if (error.response?.status === 404) {
                    errorMessage = "Error 404: La ruta del servidor no se encontró. Verifica SERVER_URL y la ruta de la API.";
                } else {
                    errorMessage = serverMessage || `Fallo de red o servidor no disponible (Status: ${error.response?.status || 'N/A'}).`;
                }
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [profile, profileImage, navigate, dispatch]);


    // URL de la foto para la previsualización
    const currentPhotoURL = profileImage ? URL.createObjectURL(profileImage) : (profile.photo || 'https://i.imgur.com/k9b6Yw3.png');

    // Muestra Loader si el perfil de Redux aún no se ha cargado
    if (!profile.email) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-screen p-4 sm:p-8 bg-gray-100">
            <AnimatePresence>
            </AnimatePresence>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden my-10 transform transition-all duration-300 hover:shadow-2xl"
            >
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
                    <h1 className="text-3xl font-extrabold tracking-tight">Editar Perfil ⚙️</h1>
                    <p className="text-blue-200 mt-1">Actualiza tus datos y tu imagen.</p>
                </div>

                <div className="flex justify-center -mt-20 z-10 relative">
                    <motion.label
                        htmlFor="photo-upload" 
                        whileHover={{ scale: 1.05, boxShadow: "0 0 0 5px rgba(59, 130, 246, 0.5)" }}
                        className="rounded-full border-8 border-white shadow-lg w-40 h-40 overflow-hidden cursor-pointer transition-all duration-200 group relative"
                    >
                        <img
                            src={currentPhotoURL}
                            alt="Editar Perfil"
                            className="w-full h-full object-cover aspect-square transition-opacity duration-300 group-hover:opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 text-white text-xl font-bold">
                            <FaCamera className="mr-2" /> Cambiar
                        </div>
                    </motion.label>
                </div>

                <form className="p-6 sm:p-8 space-y-6" onSubmit={saveProfile}>
                    <div className="space-y-4">

                        <InputField
                            label="Nombre"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                        />

                        <div className="relative">
                            <InputField
                                label="Email"
                                name="email"
                                value={profile.email}
                                disabled={true}
                            />
                            <p className="text-xs text-red-500 mt-1">El Email no puede cambiarse.</p>
                        </div>

                        <InputField
                            label="Teléfono"
                            name="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
                            <motion.textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleInputChange}
                                rows="3"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                                className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-blue-500 resize-none"
                            ></motion.textarea>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Cambiar Foto</label>
                            <input
                                id="photo-upload" 
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden" 
                            />
                            <div className="flex items-center space-x-3 mt-2">
                                <span className={`flex-1 p-3 border rounded-lg text-sm ${profileImage ? 'bg-blue-50 text-blue-800 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                                    {imageFileName}
                                </span>
                                <label htmlFor="photo-upload" className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 cursor-pointer text-sm">
                                    Seleccionar Archivo
                                </label>
                            </div>
                        </div>
                    </div>

                    <motion.div className="pt-4">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center p-3 rounded-xl bg-red-500 text-white font-bold transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Guardando Cambios...
                                    </motion.div>
                                ) : (
                                    <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                                        <FaSave className="mr-2" />
                                        Actualizar Perfil
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfile;