// --- src/pages/AddProduct.js (COMPLETO Y CORREGIDO) ---
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/product/ProductForm";
import {
    selectIsLoading,
    createProduct,
    // 🛑 IMPORTACIÓN CLAVE 1: Necesitas getProducts
    getProducts, 
} from "../../features/product/ProductSlice";
import { 
    // 🛑 IMPORTACIÓN CLAVE 2: Necesitas el rol
    selectRole 
} from "../../features/auth/authSlice/authSlice"; 
import Loader from "../../Util/Loader";

const initialState = {
    name: "",
    category: "",
    entradas: "",
    salidas: "",

};

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Obtener el rol actual para saber qué lista cargar
    const userRole = useSelector(selectRole); 
    const [product, setProduct] = useState(initialState);
    const [description, setDescription] = useState("");
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const isLoading = useSelector(selectIsLoading);

    const { name, category, entradas, salidas } = product;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const generateKSKU = (category) => {
        const letter = category.slice(0, 3).toUpperCase();
        const number = Date.now();
        const sku = letter + "-" + number;
        return sku;
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", generateKSKU(category));
        formData.append("category", category);
        formData.append("entradas", Number(entradas));
        formData.append("salidas", salidas);
        formData.append("description", description);
        formData.append("image", productImage);
        // console.log(...formData); // Comentado para evitar log en producción

        try {
            // 1. Ejecutar la creación y esperar su finalización exitosa
            await dispatch(createProduct(formData)).unwrap(); 
            
            // 2. Determinar el modo de recarga ('all' si es admin/invitado, 'own' si es usuario)
            // Esto es crucial si elegiste la Opción A (segunda llamada a la API)
            const fetchMode = (userRole === "admin" || userRole === "invitado") ? "all" : "own";

            // 3. 🛑 RECARGAR: (Opcional si usas la Opción B en ProductSlice.js, pero seguro)
            // Nota: Si usaste la Opción B en ProductSlice, esta línea es opcional pero segura.
            // Si no usaste la Opción B, esta línea es OBLIGATORIA.
            dispatch(getProducts(fetchMode));

            // 4. Redirigir SOLO después de que la creación y la recarga se inicien
            navigate("/panel");

        } catch (error) {
            // El manejo de errores ya se hace en el ProductSlice (con toast)
            // No hacemos nada aquí.
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {isLoading && <Loader />}
            
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Agrega un Nuevo Producto
            </h3>
            
            <ProductForm
                product={product}
                productImage={productImage}
                imagePreview={imagePreview}
                description={description}
                setDescription={setDescription}
                handleInputChange={handleInputChange}
                handleImageChange={handleImageChange}
                saveProduct={saveProduct}
            />
        </div>
    );
};

export default AddProduct;