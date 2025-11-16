// // --- src/pages/AddProduct.js (COMPLETO Y CORREGIDO) ---
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//     selectIsLoading,
//     createProduct,
//     // 🛑 IMPORTACIÓN CLAVE 1: Necesitas getProducts
//     getProducts, 
// } from "../../features/product/ProductSlice";
// import { 
//     // 🛑 IMPORTACIÓN CLAVE 2: Necesitas el rol
//     selectRole 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// const initialState = {
//     name: "",
//     category: "",
//     entradas: "",
//     salidas: "",

// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     // Obtener el rol actual para saber qué lista cargar
//     const userRole = useSelector(selectRole); 
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     const { name, category, entradas, salidas } = product;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         const sku = letter + "-" + number;
//         return sku;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
//         formData.append("entradas", Number(entradas));
//         formData.append("salidas", salidas);
//         formData.append("description", description);
//         formData.append("image", productImage);
//         // console.log(...formData); // Comentado para evitar log en producción

//         try {
//             // 1. Ejecutar la creación y esperar su finalización exitosa
//             await dispatch(createProduct(formData)).unwrap(); 
            
//             // 2. Determinar el modo de recarga ('all' si es admin/invitado, 'own' si es usuario)
//             // Esto es crucial si elegiste la Opción A (segunda llamada a la API)
//             const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";

//             // 3. 🛑 RECARGAR: (Opcional si usas la Opción B en ProductSlice.js, pero seguro)
//             // Nota: Si usaste la Opción B en ProductSlice, esta línea es opcional pero segura.
//             // Si no usaste la Opción B, esta línea es OBLIGATORIA.
//             dispatch(getProducts(fetchMode));

//             // 4. Redirigir SOLO después de que la creación y la recarga se inicien
//             navigate("/panel");

//         } catch (error) {
//             // El manejo de errores ya se hace en el ProductSlice (con toast)
//             // No hacemos nada aquí.
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
//             
//             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//                 Agrega un Nuevo Producto
//             </h3>
//             
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;


// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//     selectIsLoading,
//     createProduct,
//     getProducts, 
// } from "../../features/product/ProductSlice";
// import { 
//     selectRole,
//     selectUserId, // 🛑 IMPORTACIÓN AÑADIDA
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// const initialState = {
//     name: "",
//     category: "",
//     entradas: "",
//     salidas: "",
// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     // 🛑 OBTENER ID y ROL
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); // 🛑 OBTENER ID
    
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     const { name, category, entradas, salidas } = product;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         const sku = letter + "-" + number;
//         return sku;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
        
//         // 🛑 VALIDACIÓN BÁSICA
//         if (!currentUserId) {
//             console.error("No se puede crear el producto: ID de usuario no disponible.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
//         formData.append("entradas", Number(entradas));
//         formData.append("salidas", salidas);
//         formData.append("description", description);
//         formData.append("image", productImage);
        
//         // 🛑 AÑADIR EL ID DEL USUARIO PARA EL BACKEND (si es necesario)
//         // Aunque el backend lo obtiene de req.user.id, a veces es necesario para el middleware.
//         // Si tu middleware lo obtiene del token, esta línea es redundante pero segura.
//         // formData.append("userId", currentUserId); 

//         try {
//             // 1. Ejecutar la creación y esperar su finalización exitosa
//             await dispatch(createProduct(formData)).unwrap(); 
            
//             // 2. Lógica para determinar el modo de recarga
//             const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";
//             const finalIdToFetch = (fetchMode === "own") ? currentUserId : null; // Solo se necesita ID en modo 'own'
            
//             // 3. 🚀 RECARGAR: Llamada correcta con el objeto { userId, mode }
//             dispatch(getProducts({ 
//                 userId: finalIdToFetch, 
//                 mode: fetchMode 
//             }));

//             // 4. Redirigir
//             navigate("/panel");

//         } catch (error) {
//             // Manejo de errores ya hecho en el ProductSlice
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
            
//             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//                 Agrega un Nuevo Producto
//             </h3>
            
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;

// // --- src/pages/AddProduct.js (COMPLETO Y CORREGIDO) ---
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//     selectIsLoading,
//     createProduct,
//     getProducts, 
// } from "../../features/product/ProductSlice";
// import { 
//     selectRole,
//     selectUserId, 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // Estado inicial del formulario
// const initialState = {
//     name: "",
//     category: "",
//     entradas: "",
//     salidas: "",
// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     // Selectores para obtener el rol y el ID del usuario
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); 
    
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     const { name, category, entradas, salidas } = product;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         // Creación segura del URL para la previsualización de la imagen
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         const sku = letter + "-" + number;
//         return sku;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
        
//         // **Validación de ID de Usuario:** Esencial para asegurar la propiedad
//         if (!currentUserId && userRole !== "admin" && userRole !== "invitado") {
//             console.error("No se puede crear el producto: ID de usuario no disponible.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
//         formData.append("entradas", Number(entradas));
//         formData.append("salidas", salidas);
//         formData.append("description", description);
//         formData.append("image", productImage);
        
//         // 🛑 Importante: Asegúrate de añadir el 'uid' o 'userId' a la data 
//         // si tu servicio de Firebase lo necesita explícitamente para guardar la propiedad.
//         // Si el backend lo inyecta desde el token, esta línea es opcional.
//         // formData.append("uid", currentUserId); 
        

//         try {
//             // 1. Ejecutar la creación y esperar su finalización exitosa
//             await dispatch(createProduct(formData)).unwrap(); 
            
//             // 2. Lógica para determinar el modo de recarga (Debe coincidir con DashBoard.js)
//             const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";
//             const finalIdToFetch = (fetchMode === "own") ? currentUserId : null; 
            
//             // 3. RECARGAR: Disparar la acción para que el Dashboard vea el producto nuevo
//             dispatch(getProducts({ 
//                 userId: finalIdToFetch, 
//                 mode: fetchMode 
//             }));

//             // 4. Redirigir al Panel principal (asumiendo que /panel es la ruta correcta)
//             navigate("/panel");

//         } catch (error) {
//             // Manejo de errores ya hecho en el ProductSlice (generalmente muestra un toast)
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
            
//             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//                 Agrega un Nuevo Producto
//             </h3>
            
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;


// // --- src/pages/AddProduct.js (CORREGIDO Y SIMPLIFICADO) ---
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// // Ajusta esta ruta a donde tengas tu ProductForm
// import ProductForm from "../../components/product/ProductForm"; 
// import {
//     selectIsLoading,
//     createProduct,
// } from "../../features/product/ProductSlice";
// import { 
//     selectRole,
//     selectUserId, 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";

// // Estado inicial del formulario
// const initialState = {
//     name: "",
//     category: "",
//     entradas: 0, // Usar 0 para valores numéricos
//     salidas: 0,  // Usar 0 para valores numéricos
// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     // Selectores para obtener el ID del usuario
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); 
    
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     const { name, category, entradas, salidas } = product;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         // Creación segura del URL para la previsualización de la imagen
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         return letter + "-" + number;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
        
//         // Validación mínima
//         if (!name || !category || entradas === "" || salidas === "") {
//              alert("Por favor, completa los campos requeridos.");
//              return;
//         }

//         // **Validación de ID de Usuario:**
//         if (!currentUserId && userRole !== "admin" && userRole !== "invitado") {
//             console.error("No se puede crear el producto: ID de usuario no disponible.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
//         formData.append("entradas", Number(entradas));
//         formData.append("salidas", Number(salidas));
//         formData.append("description", description);
        
//         // Solo agrega la imagen si existe
//         if (productImage) {
//             formData.append("image", productImage);
//         }
        
//         // 🛑 Importante: Eliminamos la llamada a dispatch(getProducts) porque 
//         // tu hook de Firebase lo hará en tiempo real. Solo navegamos.
        
//         try {
//             await dispatch(createProduct(formData)).unwrap(); 
//             navigate("/panel"); // Redirigir al panel
//         } catch (error) {
//             // El error se maneja en el slice o middleware
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
            
//             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//                 Agrega un Nuevo Producto
//             </h3>
            
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;


// // --- src/pages/AddProduct.js (COMPLETO y FUNCIONAL con Ingresos/Egresos) ---
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//     selectIsLoading,
//     createProduct,
// } from "../../features/product/ProductSlice";
// import { 
//     selectRole,
//     selectUserId, 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";
// // Importamos Toast para notificaciones
// import { toast } from 'react-toastify'; 

// // Estado inicial del formulario base
// const initialState = {
//     name: "",
//     category: "",
//     // Usamos 0 para asegurar el tipo numérico al inicio
//     entradas: 0, 
//     salidas: 0,  
// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); 
    
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     // 🛑 NUEVOS ESTADOS para manejar el stock temporal en el formulario
//     const [ingresoCantidad, setIngresoCantidad] = useState(0);
//     const [egresoCantidad, setEgresoCantidad] = useState(0);

//     const { name, category } = product;
    
//     // Función auxiliar para obtener el valor numérico o 0
//     const getNumericValue = (value) => {
//         const num = parseInt(value, 10);
//         return isNaN(num) || num < 0 ? 0 : num;
//     };


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     // 🛑 NUEVA FUNCIÓN para manejar los campos de Ingreso/Egreso Temporal
//     const handleStockChange = (e) => {
//         const { name, value } = e.target;
        
//         // Asegurar que el valor es un número positivo o 0
//         const numericValue = getNumericValue(value);

//         if (name === "ingreso_cantidad") {
//             setIngresoCantidad(numericValue);
//         } else if (name === "egreso_cantidad") {
//             setEgresoCantidad(numericValue);
//         }
//     };


//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         return letter + "-" + number;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
        
//         // 1. Validaciones
//         if (!name || !category) {
//             toast.error("Por favor, ingresa el Nombre y la Categoría.");
//             return;
//         }
//         if (!currentUserId && userRole !== "admin" && userRole !== "invitado") {
//             toast.error("Error: ID de usuario no disponible. Intenta iniciar sesión de nuevo.");
//             return;
//         }

//         // 2. Cálculo del Stock Final para el envío
//         const entradasBase = getNumericValue(product.entradas);
//         const salidasBase = getNumericValue(product.salidas);
        
//         // Al crear, el stock inicial es la suma de entradas base más el ingreso_cantidad
//         const finalEntradas = entradasBase + ingresoCantidad;
//         const finalSalidas = salidasBase + egresoCantidad;


//         // 3. Preparar los datos finales para el Backend
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
        
//         // 🛑 ENVIAMOS los valores BASE + AJUSTE
//         formData.append("entradas", finalEntradas); 
//         formData.append("salidas", finalSalidas); 
        
//         formData.append("description", description);
//         if (productImage) {
//             formData.append("image", productImage);
//         }
        

//         // 4. Disparar la acción
//         try {
//             await dispatch(createProduct(formData)).unwrap(); 
//             toast.success("Producto creado exitosamente.");
//             navigate("/panel"); 

//         } catch (error) {
//             // Manejo de errores (ya gestionado en el ProductSlice)
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
            
//             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//                 Agrega un Nuevo Producto
//             </h3>
            
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
                
//                 // Propiedades nuevas para la funcionalidad de stock
//                 ingreso_cantidad={ingresoCantidad}
//                 egreso_cantidad={egresoCantidad}
//                 handleStockChange={handleStockChange} 
                
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;


// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//     selectIsLoading,
//     createProduct,
// } from "../../features/product/ProductSlice";
// import { 
//     selectRole,
//     selectUserId, 
// } from "../../features/auth/authSlice/authSlice"; 
// import Loader from "../../Util/Loader";
// import { toast } from 'react-toastify'; 
// import { MdOutlineCreateNewFolder } from "react-icons/md";

// // Estado inicial del formulario base
// const initialState = {
//     name: "",
//     category: "",
//     // Usamos 0 para asegurar el tipo numérico al inicio
//     entradas: 0, 
//     salidas: 0, 
// };

// const AddProduct = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     // ** VALORES CLAVE DE REDUX **
//     const userRole = useSelector(selectRole); 
//     const currentUserId = useSelector(selectUserId); // Debe ser string o null
    
//     const [product, setProduct] = useState(initialState);
//     const [description, setDescription] = useState("");
//     const [productImage, setProductImage] = useState("");
//     const [imagePreview, setImagePreview] = useState(null);
//     const isLoading = useSelector(selectIsLoading);

//     // ESTADOS para manejar el stock temporal en el formulario
//     const [ingresoCantidad, setIngresoCantidad] = useState(0);
//     const [egresoCantidad, setEgresoCantidad] = useState(0);

//     const { name, category } = product;
    
//     // Función auxiliar para obtener el valor numérico o 0
//     const getNumericValue = (value) => {
//         const num = parseInt(value, 10);
//         return isNaN(num) || num < 0 ? 0 : num;
//     };


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     // FUNCIÓN para manejar los campos de Ingreso/Egreso Temporal
//     const handleStockChange = (e) => {
//         const { name, value } = e.target;
        
//         // Asegurar que el valor es un número positivo o 0
//         const numericValue = getNumericValue(value);

//         if (name === "ingreso_cantidad") {
//             setIngresoCantidad(numericValue);
//         } else if (name === "egreso_cantidad") {
//             setEgresoCantidad(numericValue);
//         }
//     };


//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//         setImagePreview(URL.createObjectURL(e.target.files[0]));
//     };

//     const generateKSKU = (category) => {
//         const letter = category.slice(0, 3).toUpperCase();
//         const number = Date.now();
//         return letter + "-" + number;
//     };

//     const saveProduct = async (e) => {
//         e.preventDefault();
        
//         // 1. Validaciones
//         if (!name || !category) {
//             toast.error("Por favor, ingresa el Nombre y la Categoría.");
//             return;
//         }
        
//         // 🚨 VALIDACIÓN CRÍTICA PARA EVITAR EL ERROR DE UNDEFINED 🚨
//         if (!currentUserId || typeof currentUserId !== 'string') {
//             toast.error("Error de autenticación: ID de usuario no disponible. Intenta iniciar sesión de nuevo.");
//             console.error("Error: currentUserId es nulo o inválido:", currentUserId);
//             return;
//         }

//         // 2. Cálculo del Stock Final para el envío
//         const entradasBase = getNumericValue(product.entradas);
//         const salidasBase = getNumericValue(product.salidas);
        
//         const finalEntradas = entradasBase + ingresoCantidad;
//         const finalSalidas = salidasBase + egresoCantidad;

//         // 3. Preparar los datos finales (usando FormData)
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("sku", generateKSKU(category));
//         formData.append("category", category);
        
//         // Enviamos el ID del usuario. Como ya validamos, currentUserId es un string.
//         formData.append("userId", currentUserId); 

//         // ENVIAMOS los valores BASE + AJUSTE
//         formData.append("entradas", finalEntradas); 
//         formData.append("salidas", finalSalidas); 
        
//         formData.append("description", description);
//         if (productImage) {
//             formData.append("image", productImage);
//         }
        
//         // 4. Disparar la acción
//         try {
//             await dispatch(createProduct(formData)).unwrap(); 
//             toast.success("Producto creado exitosamente.");
//             navigate("/panel"); 

//         } catch (error) {
//             // El error es manejado y notificado por el ProductSlice/Service
//             console.error("Error al despachar createProduct:", error);
//         }
//     };

//     return (
//         <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             {isLoading && <Loader />}
            
//             <div className="flex items-center justify-center py-4 px-6 bg-indigo-50 border-b-4 border-indigo-500 rounded-t-xl mb-6">
//   <MdOutlineCreateNewFolder className="text-4xl text-indigo-600 mr-3" />
//   <h1 className="text-3xl font-extrabold text-indigo-800 tracking-wide">
//     REGISTRO DE PRODUCTO
//   </h1>
// </div>
            
//             <ProductForm
//                 product={product}
//                 productImage={productImage}
//                 imagePreview={imagePreview}
//                 description={description}
//                 setDescription={setDescription}
//                 handleInputChange={handleInputChange}
                
//                 // Propiedades para la funcionalidad de stock
//                 ingreso_cantidad={ingresoCantidad}
//                 egreso_cantidad={egresoCantidad}
//                 handleStockChange={handleStockChange} 
                
//                 handleImageChange={handleImageChange}
//                 saveProduct={saveProduct}
//             />
//         </div>
//     );
// };

// export default AddProduct;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/product/ProductForm";
import {
    selectIsLoading,
    createProduct,
} from "../../features/product/ProductSlice";
import { 
    selectRole,
    selectUserId, 
} from "../../features/auth/authSlice/authSlice"; 
import Loader from "../../Util/Loader";
import { toast } from 'react-toastify'; 
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { FaLock, FaUserSlash } from "react-icons/fa"; // Nuevo icono para el mensaje de error

// Estado inicial del formulario base
const initialState = {
    name: "",
    category: "",
    // Usamos 0 para asegurar el tipo numérico al inicio
    entradas: 0, 
    salidas: 0, 
};

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // ** VALORES CLAVE DE REDUX **
    const userRole = useSelector(selectRole); 
    const currentUserId = useSelector(selectUserId); // Debe ser string o null
    
    const [product, setProduct] = useState(initialState);
    const [description, setDescription] = useState("");
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const isLoading = useSelector(selectIsLoading);

    // ESTADOS para manejar el stock temporal en el formulario
    const [ingresoCantidad, setIngresoCantidad] = useState(0);
    const [egresoCantidad, setEgresoCantidad] = useState(0);

    const { name, category } = product;
    
    // Función auxiliar para obtener el valor numérico o 0
    const getNumericValue = (value) => {
        const num = parseInt(value, 10);
        return isNaN(num) || num < 0 ? 0 : num;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // FUNCIÓN para manejar los campos de Ingreso/Egreso Temporal
    const handleStockChange = (e) => {
        const { name, value } = e.target;
        
        // Asegurar que el valor es un número positivo o 0
        const numericValue = getNumericValue(value);

        if (name === "ingreso_cantidad") {
            setIngresoCantidad(numericValue);
        } else if (name === "egreso_cantidad") {
            setEgresoCantidad(numericValue);
        }
    };


    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const generateKSKU = (category) => {
        const letter = category.slice(0, 3).toUpperCase();
        const number = Date.now();
        return letter + "-" + number;
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        
        // 1. Validaciones
        if (!name || !category) {
            toast.error("Por favor, ingresa el Nombre y la Categoría.");
            return;
        }
        
        // 🚨 VALIDACIÓN CRÍTICA PARA EVITAR EL ERROR DE UNDEFINED 🚨
        if (!currentUserId || typeof currentUserId !== 'string') {
            toast.error("Error de autenticación: ID de usuario no disponible. Intenta iniciar sesión de nuevo.");
            console.error("Error: currentUserId es nulo o inválido:", currentUserId);
            return;
        }

        // 2. Cálculo del Stock Final para el envío
        // Usamos el estado del producto, pero lo aseguramos numéricamente
        const finalEntradas = getNumericValue(product.entradas) + ingresoCantidad;
        const finalSalidas = getNumericValue(product.salidas) + egresoCantidad;

        // 3. Preparar los datos finales (usando FormData)
        // ** NOTA: Firestore no maneja FormData directamente. 
        // Tu ProductService debe estar deserializando esto a un objeto JSON 
        // o estás usando una capa de servidor que lo maneja. 
        // Asumo que el ProductService.js que me mostraste maneja la imagen 
        // de forma especial si recibe un objeto File. 
        // Aquí ajusto para usar un objeto simple si tu servicio lo permite, 
        // sino, el FormData es correcto si pasa por un backend que lo parsea. 
        
        const finalProductData = {
            name: name,
            sku: generateKSKU(category),
            category: category,
            userId: currentUserId, // El campo crítico que estaba faltando/nulo
            entradas: finalEntradas,
            salidas: finalSalidas,
            description: description,
            image: productImage, // productImage es el objeto File
        };
        
        // 4. Disparar la acción
        try {
            // Enviamos el objeto de datos final
            await dispatch(createProduct(finalProductData)).unwrap(); 
            toast.success("Producto creado exitosamente.");
            navigate("/panel"); 

        } catch (error) {
            // El error ya debería ser notificado por el ProductSlice/Service
            // Este log es solo para desarrollo
            console.error("Error al despachar createProduct:", error);
        }
    };
    
    // -----------------------------------------------------------
    // 🛑 NUEVA VERIFICACIÓN DE SEGURIDAD (Manejar el estado Nulo)
    // -----------------------------------------------------------
    if (!currentUserId) {
        return (
            <div className="w-full max-w-7xl mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
                <FaLock className="text-6xl text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Error de Sincronización</h1>
                <p className="text-xl text-gray-600 text-center">
                    Tu sesión se está cargando o está incompleta. Por favor, espera un momento o 
                    <span className="font-semibold text-indigo-600 cursor-pointer" onClick={() => navigate("/login")}> haz clic aquí para iniciar sesión de nuevo.</span>
                </p>
                {isLoading && <Loader />}
            </div>
        );
    }

    // -----------------------------------------------------------
    
    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {isLoading && <Loader />}
            
            <div className="flex items-center justify-center py-4 px-6 bg-indigo-50 border-b-4 border-indigo-500 rounded-t-xl mb-6">
                <MdOutlineCreateNewFolder className="text-4xl text-indigo-600 mr-3" />
                <h1 className="text-3xl font-extrabold text-indigo-800 tracking-wide">
                    REGISTRO DE PRODUCTO
                </h1>
            </div>
            
            <ProductForm
                product={product}
                productImage={productImage}
                imagePreview={imagePreview}
                description={description}
                setDescription={setDescription}
                handleInputChange={handleInputChange}
                
                // Propiedades para la funcionalidad de stock
                ingreso_cantidad={ingresoCantidad}
                egreso_cantidad={egresoCantidad}
                handleStockChange={handleStockChange} 
                
                handleImageChange={handleImageChange}
                saveProduct={saveProduct}
            />
        </div>
    );
};

export default AddProduct;