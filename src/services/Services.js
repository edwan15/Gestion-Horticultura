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


// import axios from "axios";
// import { toast } from "react-toastify";

// // 🛑 CLAVE: Configuración Global de Axios
// // Esto asegura que todas las solicitudes (POST, GET, PATCH, etc.)
// // incluyan automáticamente las cookies (el token JWT) y que el navegador
// // acepte la cookie de respuesta desde el dominio cruzado (Backend/Render).
// axios.defaults.withCredentials = true;

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// export const validateEmail = (email) => {
//   return email.match(
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   );
// };

// export const loginUser = async (userData) => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     const response = await axios.post(
//       `${BACKEND_URL}/api/users/login`,
//       userData
//     );
//     if (response.statusText === "OK") {
//       toast.success("Login Successful");
//       return response.data;
//     }
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//     // Lanza el error para que el componente Login.jsx lo capture
//     throw new Error(message); 
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     const response = await axios.post(
//       `${BACKEND_URL}/api/users/register`,
//       userData
//     );
//     if (response.statusText === "OK") {
//       toast.success("Registration Successful");
//     }
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//     throw new Error(message);
//   }
// };

// export const logoutUser = async () => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     await axios.get(`${BACKEND_URL}/api/users/logout`);
//     toast.success("Logout Successful");
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const getLoginStatus = async () => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };
// // Get User Profile
// export const getUser = async () => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
//     return response.data;
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// };

// export const updateUser = async (formData) => {
//   try {
//     // Ya no necesitamos { withCredentials: true } aquí, se aplica globalmente.
//     const response = await axios.patch(
//       `${BACKEND_URL}/api/users/updateuser`,
//       formData
//     );
//     return response.data
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     toast.error(message);
//   }
// }






// import { toast } from "react-toastify";
// // Importar funciones de Firebase Auth y Firestore
// import { 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword, 
//     signOut, 
//     sendPasswordResetEmail,
//     updateProfile,
// } from "firebase/auth";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// // Importar auth y db desde firebaseConfig
// import { auth, db } from "../firebaseConfig"; 

// // Esta función se mantiene, ya que es una utilidad de validación del lado del cliente.
// export const validateEmail = (email) => {
//     return email.match(
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };

// // ----------------------------------------------------
// // 1. LOGIN (Reemplaza loginUser de Axios)
// // ----------------------------------------------------
// export const loginUser = async (userData) => {
//     const { email, password } = userData;
//     try {
//         // 1. Autenticar con Firebase Auth
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // 2. Opcional: Cargar datos del perfil desde Firestore (si es necesario aquí, aunque App.jsx ya lo hace)
//         const userDocRef = doc(db, "users", user.uid);
//         const userDoc = await getDoc(userDocRef);
        
//         // 3. Mostrar éxito
//         toast.success("Login Successful");

//         // 4. Devolver la data (similar a tu backend anterior)
//         return { 
//             email: user.email, 
//             uid: user.uid, 
//             role: userDoc.data()?.role || "usuario" // Incluir el rol de Firestore
//         };

//     } catch (error) {
//         // Manejo de errores específicos de Firebase Auth
//         let message = "An error occurred during login.";
//         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//             message = "Email or password incorrect.";
//         } else if (error.code === 'auth/invalid-email') {
//             message = "Invalid email format.";
//         } else {
//             message = error.message;
//         }

//         toast.error(message);
//         throw new Error(message); 
//     }
// };

// // ----------------------------------------------------
// // 2. REGISTER (Reemplaza registerUser de Axios)
// // ----------------------------------------------------
// export const registerUser = async (userData) => {
//     const { name, email, password } = userData;
//     try {
//         // 1. Crear usuario en Firebase Auth
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // 2. Guardar nombre en el perfil de Auth
//         await updateProfile(user, {
//             displayName: name,
//         });

//         // 3. Crear el documento del usuario en Firestore (para guardar datos adicionales como el rol)
//         await setDoc(doc(db, "users", user.uid), {
//             uid: user.uid,
//             name: name,
//             email: email,
//             role: "usuario", // Asignar un rol por defecto
//             createdAt: new Date().toISOString(),
//         });
        
//         toast.success("Registration Successful");
        
//         return {
//             email: user.email,
//             uid: user.uid,
//             name: name,
//             role: "usuario",
//         };

//     } catch (error) {
//         let message = "An error occurred during registration.";
//         if (error.code === 'auth/email-already-in-use') {
//             message = "The email address is already in use by another account.";
//         } else if (error.code === 'auth/weak-password') {
//             message = "Password should be at least 6 characters.";
//         } else {
//             message = error.message;
//         }

//         toast.error(message);
//         throw new Error(message);
//     }
// };

// // ----------------------------------------------------
// // 3. LOGOUT (Reemplaza logoutUser de Axios)
// // ----------------------------------------------------
// export const logoutUser = async () => {
//     try {
//         await signOut(auth);
//         toast.success("Logout Successful");
//     } catch (error) {
//         toast.error(error.message);
//     }
// };

// // ----------------------------------------------------
// // 4. RECUPERAR CONTRASEÑA (Nueva función de Firebase)
// // ----------------------------------------------------
// export const resetPassword = async (email) => {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         toast.success("Password reset email sent. Check your inbox.");
//     } catch (error) {
//         let message = "Could not send reset email.";
//         if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
//             message = "No user found with that email.";
//         } else {
//             message = error.message;
//         }
//         toast.error(message);
//         throw new Error(message);
//     }
// };

// // ----------------------------------------------------
// // 5. ACTUALIZAR PERFIL (Reemplaza updateUser de Axios)
// // ----------------------------------------------------
// export const updateUser = async (uid, userData) => {
//     const { name, phone, bio } = userData; 
//     try {
//         // 1. Actualizar datos en Auth (solo el nombre)
//         const user = auth.currentUser;
//         if (user && name) {
//             await updateProfile(user, { displayName: name });
//         }
        
//         // 2. Actualizar datos en Firestore (nombre, teléfono, bio, etc.)
//         const userDocRef = doc(db, "users", uid);
//         await updateDoc(userDocRef, {
//             name: name,
//             phone: phone || '', 
//             bio: bio || '',
//             updatedAt: new Date().toISOString(),
//         });

//         toast.success("Profile Updated Successfully");
        
//         // Devolver los datos actualizados de Firestore
//         const updatedDoc = await getDoc(userDocRef);
//         return updatedDoc.data();

//     } catch (error) {
//         const message = error.message;
//         toast.error(message);
//         throw new Error(message);
//     }
// }





// import { toast } from "react-toastify";
// // Importar funciones de Firebase Auth y Firestore
// import { 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword, 
//     signOut, 
//     sendPasswordResetEmail,
//     updateProfile,
// } from "firebase/auth";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// // Importar auth y db desde firebaseConfig
// // 🛑 Asegúrate de que esta ruta sea correcta para tu proyecto 🛑
// import { auth, db } from "../firebaseConfig"; 

// // ----------------------------------------------------
// // UTILIDAD
// // ----------------------------------------------------
// export const validateEmail = (email) => {
//     return email.match(
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };

// // ----------------------------------------------------
// // 1. LOGIN
// // ----------------------------------------------------
// export const loginUser = async (userData) => {
//     const { email, password } = userData;
//     try {
//         // 1. Autenticar con Firebase Auth
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // 2. Opcional: Cargar datos del perfil desde Firestore para el rol
//         const userDocRef = doc(db, "users", user.uid);
//         const userDoc = await getDoc(userDocRef);
        
//         // 3. Mostrar éxito
//         // toast.success("Login Successful"); // Ya manejado en Login.js

//         // 4. Devolver la data básica
//         return { 
//             email: user.email, 
//             uid: user.uid, 
//             role: userDoc.data()?.role || "usuario" // Incluir el rol de Firestore
//         };

//     } catch (error) {
//         // Manejo de errores específicos de Firebase Auth
//         let message = "An error occurred during login.";
//         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//             message = "Email o contraseña incorrectos.";
//         } else if (error.code === 'auth/invalid-email') {
//             message = "Formato de email inválido.";
//         } else {
//             message = error.message;
//         }

//         // toast.error(message); // Ya manejado en Login.js
//         throw new Error(message); 
//     }
// };

// // ----------------------------------------------------
// // 2. REGISTER
// // ----------------------------------------------------
// export const registerUser = async (userData) => {
//     const { name, email, password } = userData;
//     try {
//         // 1. Crear usuario en Firebase Auth
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // 2. Guardar nombre en el perfil de Auth
//         await updateProfile(user, {
//             displayName: name,
//         });

//         // 3. Crear el documento del usuario en Firestore (para guardar datos adicionales como el rol)
//         await setDoc(doc(db, "users", user.uid), {
//             uid: user.uid,
//             name: name,
//             email: email,
//             role: "usuario", // Asignar un rol por defecto
//             createdAt: new Date().toISOString(),
//         });
        
//         toast.success("Registration Successful");
        
//         return {
//             email: user.email,
//             uid: user.uid,
//             name: name,
//             role: "usuario",
//         };

//     } catch (error) {
//         let message = "An error occurred during registration.";
//         if (error.code === 'auth/email-already-in-use') {
//             message = "El correo ya está en uso por otra cuenta.";
//         } else if (error.code === 'auth/weak-password') {
//             message = "La contraseña debe tener al menos 6 caracteres.";
//         } else {
//             message = error.message;
//         }

//         toast.error(message);
//         throw new Error(message);
//     }
// };

// // ----------------------------------------------------
// // 3. LOGOUT
// // ----------------------------------------------------
// export const logoutUser = async () => {
//     try {
//         await signOut(auth);
//         // toast.success("Logout Successful"); // Ya manejado en Header.js
//     } catch (error) {
//         toast.error(error.message);
//     }
// };

// // ----------------------------------------------------
// // 4. RECUPERAR CONTRASEÑA
// // ----------------------------------------------------
// export const resetPassword = async (email) => {
//     try {
//         await sendPasswordResetEmail(auth, email);
//         toast.success("Correo de restablecimiento de contraseña enviado.");
//     } catch (error) {
//         let message = "No se pudo enviar el correo de restablecimiento.";
//         if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
//             message = "No se encontró ningún usuario con ese correo.";
//         } else {
//             message = error.message;
//         }
//         toast.error(message);
//         throw new Error(message);
//     }
// };

// // ----------------------------------------------------
// // 5. ACTUALIZAR PERFIL
// // ----------------------------------------------------
// export const updateUser = async (uid, userData) => {
//     const { name, phone, bio } = userData; 
//     try {
//         // 1. Actualizar datos en Auth (solo el nombre/displayName)
//         const user = auth.currentUser;
//         if (user && name) {
//             await updateProfile(user, { displayName: name });
//         }
        
//         // 2. Actualizar datos en Firestore
//         const userDocRef = doc(db, "users", uid);
//         await updateDoc(userDocRef, {
//             name: name,
//             phone: phone || '', 
//             bio: bio || '',
//             updatedAt: new Date().toISOString(),
//         });

//         toast.success("Perfil actualizado exitosamente");
        
//         // Devolver los datos actualizados de Firestore
//         const updatedDoc = await getDoc(userDocRef);
//         return updatedDoc.data();

//     } catch (error) {
//         const message = error.message;
//         toast.error(message);
//         throw new Error(message);
//     }
// }

// // ----------------------------------------------------
// // 6. OBTENER PERFIL (LA FUNCIÓN QUE NECESITABAS) 🚀
// // ----------------------------------------------------
// /**
//  * Obtiene el documento completo del usuario desde Firestore, 
//  * que incluye el nombre, rol y otros datos.
//  * Esta función es llamada desde Login.js para actualizar Redux.
//  */
// export const getProfile = async () => {
//     // 1. Obtener el usuario actualmente autenticado
//     const user = auth.currentUser;

//     if (!user) {
//         // Si no hay usuario autenticado, devuelve un error o un objeto vacío
//         throw new Error("No hay usuario autenticado.");
//     }

//     try {
//         // 2. Referencia al documento de Firestore usando el UID
//         const userDocRef = doc(db, "users", user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//             // 3. Devolver los datos de Firestore (¡donde está el nombre real!)
//             return userDoc.data();
//         } else {
//             // Si el documento de Firestore no existe, usa los datos de Firebase Auth como fallback
//             return {
//                 uid: user.uid,
//                 email: user.email,
//                 name: user.displayName || user.email.split('@')[0],
//                 role: "usuario"
//             };
//         }
//     } catch (error) {
//         console.error("Error al obtener el perfil de Firestore:", error);
//         // Aquí no usamos toast para no duplicar si Login.js ya lo maneja
//         throw new Error("Fallo al obtener el perfil.");
//     }
// };

import { toast } from "react-toastify";
import axios from "axios"; 
// Importar funciones de Firebase Auth y Firestore
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Importar auth y db desde firebaseConfig
import { auth, db } from "../firebaseConfig"; 

// ----------------------------------------------------
// CONFIGURACIÓN AXIOS PARA EL BACKEND EXPRESS
// ----------------------------------------------------
// 🛑 CORRECCIÓN CLAVE: Usamos el puerto 4500
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";


// ----------------------------------------------------
// UTILIDAD
// ----------------------------------------------------
export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// ----------------------------------------------------
// 1. LOGIN (Usa Firebase Auth y Firestore)
// ----------------------------------------------------
export const loginUser = async (userData) => {
    const { email, password } = userData;
    try {
        // 1. Autenticar con Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Cargar datos del perfil desde Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // 3. Devolver la data básica
        return { 
            email: user.email, 
            uid: user.uid, 
            role: userDoc.data()?.role || "usuario"
        };

    } catch (error) {
        let message = "Ocurrió un error durante el inicio de sesión.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "Email o contraseña incorrectos.";
        } else if (error.code === 'auth/invalid-email') {
            message = "Formato de email inválido.";
        } else {
            message = error.message;
        }

        throw new Error(message); 
    }
};

// ----------------------------------------------------
// 2. REGISTER (Usa Firebase Auth y Firestore)
// ----------------------------------------------------
export const registerUser = async (userData) => {
    const { name, email, password } = userData;
    try {
        // 1. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Guardar nombre en el perfil de Auth
        await updateProfile(user, {
            displayName: name,
        });

        // 3. Crear el documento del usuario en Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            role: "usuario", // Asignar un rol por defecto
            createdAt: new Date().toISOString(), 
        });
        
        toast.success("Registro exitoso");
        
        return {
            email: user.email,
            uid: user.uid,
            name: name,
            role: "usuario",
        };

    } catch (error) {
        let message = "Ocurrió un error durante el registro.";
        if (error.code === 'auth/email-already-in-use') {
            message = "El correo ya está en uso por otra cuenta.";
        } else if (error.code === 'auth/weak-password') {
            message = "La contraseña debe tener al menos 6 caracteres.";
        } else {
            message = error.message;
        }

        toast.error(message);
        throw new Error(message);
    }
};

// ----------------------------------------------------
// 3. LOGOUT (Usa Firebase Auth)
// ----------------------------------------------------
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        toast.error(error.message);
    }
};

// ----------------------------------------------------
// 4. RECUPERAR CONTRASEÑA (Usa Firebase Auth)
// ----------------------------------------------------
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Correo de restablecimiento de contraseña enviado.");
    } catch (error) {
        let message = "No se pudo enviar el correo de restablecimiento.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            message = "No se encontró ningún usuario con ese correo.";
        } else {
            message = error.message;
        }
        toast.error(message);
        throw new Error(message);
    }
};

// ----------------------------------------------------
// 5. ACTUALIZAR PERFIL (Usa Firebase Auth y Firestore)
// ----------------------------------------------------
export const updateUser = async (uid, userData) => {
    const { name, phone, bio } = userData; 
    try {
        const user = auth.currentUser;
        if (user && name) {
            await updateProfile(user, { displayName: name });
        }
        
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
            name: name,
            phone: phone || '', 
            bio: bio || '',
            updatedAt: new Date().toISOString(), 
        });

        toast.success("Perfil actualizado exitosamente");
        
        const updatedDoc = await getDoc(userDocRef);
        
        const convertTimestamp = (data) => {
            if (data && typeof data.toDate === 'function') {
                return data.toDate().toISOString();
            }
            return data;
        };
        
        const updatedData = updatedDoc.data();
        updatedData.createdAt = convertTimestamp(updatedData.createdAt);
        updatedData.updatedAt = convertTimestamp(updatedData.updatedAt);

        return updatedData;

    } catch (error) {
        const message = error.message;
        toast.error(message);
        throw new Error(message);
    }
}

// ----------------------------------------------------
// 6. OBTENER PERFIL (Usa Firebase Auth y Firestore)
// ----------------------------------------------------
export const getProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No hay usuario autenticado.");
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        const convertTimestamp = (data) => {
            if (data && typeof data.toDate === 'function') {
                return data.toDate().toISOString();
            }
            return data;
        };

        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Convertimos Timestamp a ISO string para Redux
            userData.createdAt = convertTimestamp(userData.createdAt);
            userData.updatedAt = convertTimestamp(userData.updatedAt);
            
            return userData;
        } else {
            // Fallback (Datos de Auth)
            return {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                role: "usuario",
                createdAt: new Date().toISOString(), 
            };
        }
    } catch (error) {
        console.error("Error al obtener el perfil de Firestore:", error);
        throw new Error("Fallo al obtener el perfil.");
    }
};

// ----------------------------------------------------
// 7. SERVICIOS DE BACKEND (Usando Axios y Token) 🚀
// ----------------------------------------------------

/**
 * Función general para hacer peticiones al backend Express/Node.
 * Incluye automáticamente el token de autenticación de Firebase en la cabecera.
 */
export const fetchFromBackend = async (method, path, data = null) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error("Acceso denegado: No hay token de autenticación disponible.");
    }
    
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        }
    };

    const url = `${BACKEND_URL}${path}`; // Utiliza la URL con el puerto 4500

    try {
        let response;
        
        switch (method.toLowerCase()) {
            case 'get':
                response = await axios.get(url, config);
                break;
            case 'post':
                response = await axios.post(url, data, config);
                break;
            // Añade más métodos (put, delete) si es necesario
            default:
                throw new Error(`Método HTTP no soportado: ${method}`);
        }

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Fallo en la petición al Backend:", errorMessage);
        
        throw new Error(`Fallo en el servidor: ${errorMessage}`);
    }
};

// ----------------------------------------------------
// EJEMPLOS DE USO PARA LOS SLICES DE REDUX
// ----------------------------------------------------
/**
 * Llama a tu backend para obtener la lista de logs (GET http://localhost:4500/api/logs)
 */
export const getLogs = async () => {
    return fetchFromBackend('GET', '/api/logs'); 
}

/**
 * Llama a tu backend para obtener la lista de inventario (GET http://localhost:4500/api/inventario)
 */
export const getInventario = async () => {
    return fetchFromBackend('GET', '/api/inventario'); 
}