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
    selectName,
} from "../../features/auth/authSlice/authSlice"; 
import Loader from "../../Util/Loader";
import { toast } from 'react-toastify'; 
import { MdOutlineCreateNewFolder } from "react-icons/md";

// Estado inicial del formulario base
const initialState = {
    name: "",
    category: "",
    price: 0, // NEW: Coste/Precio
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
    const userName = useSelector(selectName); 
    
    const [product, setProduct] = useState(initialState);
    const [description, setDescription] = useState("");
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const isLoading = useSelector(selectIsLoading);

    // ESTADOS para manejar el stock temporal en el formulario
    const [ingresoCantidad, setIngresoCantidad] = useState(0);
    const [egresoCantidad, setEgresoCantidad] = useState(0);
    const [totalPrice, setTotalPrice] = useState(""); // Nuevo estado: Valor Total Compra

    const { name, category, price } = product;
    
    // Función auxiliar para obtener el valor numérico o 0
    const getNumericValue = (value) => {
        const num = parseInt(value, 10);
        return isNaN(num) || num < 0 ? 0 : num;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        const newProduct = { ...product, [name]: value };
        setProduct(newProduct);

        // Lógica de cálculo si se cambia 'entradas' y no hay 'ingreso_cantidad' definido
        if (name === "entradas") {
            const normalize = (val) => parseFloat(String(val).replace(',', '.') || 0);
            const qty = normalize(value);
            const total = normalize(totalPrice);
            const ingreso = normalize(ingresoCantidad);

            // Si no estamos usando la caja de transacción (ingreso=0) y hay un total definido
            if (ingreso === 0 && qty > 0 && total > 0) {
                 const newUnitPrice = total / qty;
                 // Usamos el callback de setProduct para asegurar consistencia
                 setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
            }
        }
    };

    // FUNCIÓN para manejar los campos de Ingreso/Egreso Temporal
    const handleStockChange = (e) => {
        const { name, value } = e.target;
        
        // Función auxiliar para normalizar decimales solo para el cálculo interno (no para el input crudo)
        const normalize = (val) => parseFloat(String(val).replace(',', '.') || 0);

        if (name === "ingreso_cantidad") {
            setIngresoCantidad(value); // Guardamos el valor crudo en el input
            
            // Lógica de cálculo inverso: Si tengo un Total Price, RE-CALCULO el Unit Price
            const qty = normalize(value);
            const total = normalize(totalPrice);
            if (qty > 0 && total > 0) {
                const newUnitPrice = total / qty;
                setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
            }

        } else if (name === "egreso_cantidad") {
            setEgresoCantidad(value);
        } else if (name === "total_price") {
            setTotalPrice(value);
            
            // Lógica de cálculo: Si escribo el Total y tengo cantidad -> Calculo Unitario
            const total = normalize(value);
            // Prioridad: Cantidad Ingresada > Entradas Totales (Base)
            const qty = normalize(ingresoCantidad) > 0 ? normalize(ingresoCantidad) : normalize(product.entradas);
            
            if (qty > 0 && total > 0) {
                const newUnitPrice = total / qty;
                setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
            }
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
        const entradasBase = getNumericValue(product.entradas);
        const salidasBase = getNumericValue(product.salidas);
        
        const finalEntradas = entradasBase + ingresoCantidad;
        const finalSalidas = salidasBase + egresoCantidad;

        // 3. Preparar los datos finales (usando FormData)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", generateKSKU(category));
        formData.append("category", category);
        formData.append("price", price);
        
        // Enviamos el ID del usuario. Como ya validamos, currentUserId es un string.
        formData.append("userId", currentUserId); 
        formData.append("userName", userName);

        // ENVIAMOS los valores BASE + AJUSTE
        formData.append("entradas", finalEntradas); 
        formData.append("salidas", finalSalidas); 
        
        formData.append("description", description);
        if (productImage) {
            formData.append("image", productImage);
        }
        
        // 4. Disparar la acción
        try {
            await dispatch(createProduct(formData)).unwrap(); 
            toast.success("Producto creado exitosamente.");
            navigate("/panel"); 

        } catch (error) {
            // El error es manejado y notificado por el ProductSlice/Service
            console.error("Error al despachar createProduct:", error);
        }
    };

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
                
                // Propiedades nuevas para la funcionalidad de stock
                ingreso_cantidad={ingresoCantidad}
                egreso_cantidad={egresoCantidad}
                total_price={totalPrice} // pasamos el nuevo estado 
                handleStockChange={handleStockChange} 
                
                handleImageChange={handleImageChange}
                saveProduct={saveProduct}
            />
        </div>
    );
};

export default AddProduct;