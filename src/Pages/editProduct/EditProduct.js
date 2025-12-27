// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import ProductForm from "../../components/product/ProductForm";
// import {
//   getProduct,
//   getProducts,
//   updateProduct,
//   selectIsLoading,
//   selectProduct,
// } from "../../features/product/ProductSlice";
// import Loader from "../../Util/Loader";

// const EditProduct = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const productEdit = useSelector(selectProduct);
//   const isLoading = useSelector(selectIsLoading);
  
//   // Estados base del producto
//   const [product, setProduct] = useState(productEdit);
//   const [productImage, setProductImage] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [description, setDescription] = useState("");

//   // 1. ESTADOS PARA LOS NUEVOS CAMPOS FUNCIONALES/TRANSACCIONALES
//   const [ingresoCantidad, setIngresoCantidad] = useState("");
//   const [egresoCantidad, setEgresoCantidad] = useState("");


//   useEffect(() => {
//     dispatch(getProduct(id)); 
//   }, [dispatch , id]);

//   useEffect(() => {
//     // Aseguramos que el producto se cargue y los campos de stock sean numéricos
//     if (productEdit) {
//         setProduct({
//             ...productEdit, 
//             // Convertimos a número o a 0 para cálculos seguros
//             entradas: Number(productEdit.entradas) || 0,
//             salidas: Number(productEdit.salidas) || 0,
//         });
        
//         setImagePreview(productEdit.image ? `${productEdit.image.filePath}` : null);
//         setDescription(productEdit.description || "");
//     }
//   }, [productEdit])

//   // 2. MODIFICAMOS handleInputChange y creamos handleStockChange
  
//   // Maneja los campos base (name, category, entradas, salidas)
//   const handleInputChange = (e) => {
//     const {value , name } = e.target;
//     setProduct({ ...product, [name]: value });
//   };
  
//   // Maneja los campos transaccionales (ingreso_cantidad, egreso_cantidad)
//   const handleStockChange = (e) => {
//     const { name, value } = e.target;
//     // Aseguramos que solo sean números positivos, o vacíos si el usuario borra
//     const numValue = value === "" ? "" : Math.max(0, parseInt(value, 10)); 

//     if (name === 'ingreso_cantidad') {
//         setIngresoCantidad(numValue);
//         // Reseteamos el egreso para asegurar que solo se haga una operación a la vez
//         if (numValue !== "") setEgresoCantidad(""); 
//     } else if (name === 'egreso_cantidad') {
//         setEgresoCantidad(numValue);
//         // Reseteamos el ingreso
//         if (numValue !== "") setIngresoCantidad(""); 
//     }
//   };


//   const handleImageChange = (e) => {
//     setProductImage(e.target.files[0]);
//     setImagePreview(URL.createObjectURL(e.target.files[0]));
//   };

//   // ***************************************************************
//   // 3. Lógica CORREGIDA en saveProduct
//   // ***************************************************************
//   const saveProduct = async (e) => {
//     e.preventDefault();

//     // 1. OBTENER VALORES y CALCULAR EL NUEVO STOCK
//     const baseEntradas = Number(product?.entradas) || 0;
//     const baseSalidas = Number(product?.salidas) || 0;
    
//     const ingresoDelta = Number(ingresoCantidad) || 0; // Transacción de ingreso
//     const egresoDelta = Number(egresoCantidad) || 0;   // Transacción de egreso
    
//     // Stock para validación
//     const stockActual = baseEntradas - baseSalidas;
//     const stockFinal = stockActual + ingresoDelta - egresoDelta;

//     // Validación de Stock Negativo
//     if (stockFinal < 0) {
//       alert(`Error: No puedes tener stock negativo. El egreso de ${egresoDelta} excede el stock actual de ${stockActual}.`);
//       return;
//     }

//     // 2. CALCULAR LOS NUEVOS VALORES ACUMULADOS
//     // Las transacciones se SUMAN a los campos base
//     const newEntradas = baseEntradas + ingresoDelta;
//     const newSalidas = baseSalidas + egresoDelta;


//     // 3. PREPARAR FORMDATA PARA ENVÍO
//     const formData = new FormData();
    
//     formData.append("name", product?.name);
//     formData.append("category", product?.category || ""); 
    
//     // *** ENVIAMOS LOS NUEVOS VALORES ACUMULADOS ***
//     formData.append("entradas", newEntradas);
//     formData.append("salidas", newSalidas);
    
//     formData.append("description", description);
    
//     if (productImage) {
//         formData.append("image", productImage);
//     }
    
//     // 4. ENVÍO, MANEJO DE ESTADO Y REDIRECCIÓN
//     try {
//         await dispatch(updateProduct({ id, formData }));
        
//         // **IMPORTANTE**: Actualizar los estados locales para reflejar el cambio y limpiar la UI.
//         setProduct(prevProduct => ({
//             ...prevProduct,
//             entradas: newEntradas, // Actualizamos las entradas locales
//             salidas: newSalidas,   // Actualizamos las salidas locales
//         }));
        
//         // Limpiamos los campos funcionales
//         setIngresoCantidad(""); 
//         setEgresoCantidad(""); 
        
//         await dispatch(getProducts());
//         navigate("/panel");
//     } catch (error) {
//         console.error("Error al guardar el producto:", error);
//     }
//   };
  
//   // Cálculo del stock actual para pasar al ProductForm
//   const baseEntradas = Number(product?.entradas) || 0;
//   const baseSalidas = Number(product?.salidas) || 0;
//   const ingresoDelta = Number(ingresoCantidad) || 0;
//   const egresoDelta = Number(egresoCantidad) || 0;
//   const stockFinal = (baseEntradas - baseSalidas) + ingresoDelta - egresoDelta;


//   return (
//     <div className="flex flex-col justify-center items-center gap-5">
//       {isLoading && <Loader />}
//       <h3 className="text-2xl">Editar Producto</h3>
//       <ProductForm
//         product={product}
//         productImage={productImage}
//         imagePreview={imagePreview}
//         description={description}
//         setDescription={setDescription}
//         handleInputChange={handleInputChange} // Para campos base
//         handleImageChange={handleImageChange}
//         saveProduct={saveProduct}
        
//         // PROPS DE LOS NUEVOS CAMPOS FUNCIONALES
//         ingreso_cantidad={ingresoCantidad}
//         egreso_cantidad={egresoCantidad}
//         handleStockChange={handleStockChange} // Para campos transaccionales
//         stockFinal={stockFinal} // Pasamos el stock calculado para mostrarlo
//       />
//     </div>
//   );
// };

// export default EditProduct;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/product/ProductForm";
import {
    getProduct,
    getProducts,
    updateProduct,
    selectIsLoading,
    selectProduct,
} from "../../features/product/ProductSlice";
import Loader from "../../Util/Loader";

const EditProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productEdit = useSelector(selectProduct);
    const isLoading = useSelector(selectIsLoading);
    
    // Estados base del producto
    const [product, setProduct] = useState(productEdit);
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");

    // ESTADOS PARA LOS NUEVOS CAMPOS FUNCIONALES/TRANSACCIONALES
    const [ingresoCantidad, setIngresoCantidad] = useState("");
    const [egresoCantidad, setEgresoCantidad] = useState("");
    const [totalPrice, setTotalPrice] = useState("");


    useEffect(() => {
        dispatch(getProduct(id)); 
    }, [dispatch , id]);

    useEffect(() => {
        // Aseguramos que el producto se cargue y los campos de stock sean numéricos
        if (productEdit) {
            setProduct({
                ...productEdit, 
                // Convertimos a número o a 0 para cálculos seguros
                entradas: Number(productEdit.entradas) || 0,
                salidas: Number(productEdit.salidas) || 0,
                price: Number(productEdit.price) || 0,
            });
            
            setImagePreview(productEdit.image ? `${productEdit.image.filePath}` : null);
            setDescription(productEdit.description || "");
        }
    }, [productEdit])

    // Maneja los campos base (name, category, entradas, salidas)
    const handleInputChange = (e) => {
        const {value , name } = e.target;
        // setProduct({ ...product, [name]: value }); <-- ANTIGUO
        
        const newProduct = { ...product, [name]: value };
        setProduct(newProduct);

        // Lógica de cálculo si se cambia 'entradas' manual en Editar
        // Aunque usualmente se usa Ingreso, si editan el histórico base, recalculamos si hay Total Price puesto.
        if (name === "entradas") {
            const normalize = (val) => parseFloat(String(val).replace(',', '.') || 0);
            const qty = normalize(value);
            const total = normalize(totalPrice);
            const ingreso = normalize(ingresoCantidad);

            if (ingreso === 0 && qty > 0 && total > 0) {
                 const newUnitPrice = total / qty;
                 setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
            }
        }
    };
    
    // 👇 MODIFICACIÓN CLAVE AQUÍ: Permite números flotantes (con . o ,)
    const handleStockChange = (e) => {
        const { name, value } = e.target;
        
        // Expresión regular que permite: string vacío, dígitos, y un punto o coma (opcional)
        // La coma la reemplazamos internamente por punto para la validación.
        const cleanedValue = value.replace(',', '.');
        // El regex verifica que el valor sea un número decimal válido (ej: "123", "12.3", "0.5") or empty
        const isNumberOrDecimal = /^\d*\.?\d*$/.test(cleanedValue) || value === "";

        const normalize = (val) => parseFloat(String(val).replace(',', '.') || 0);
        
        // Solo actualizamos si es un número válido y positivo (o vacío)
        if (isNumberOrDecimal) {
            
            if (name === 'ingreso_cantidad') {
                // Guardamos el string original (puede contener coma o punto)
                setIngresoCantidad(value); 
                // Reseteamos el egreso para asegurar que solo se haga una operación a la vez
                if (value !== "") setEgresoCantidad(""); 
                
                // --- CALCULO AUTOMATICO DEL PRECIO UNITARIO ---
                const qty = normalize(value);
                const total = normalize(totalPrice);
                if (qty > 0 && total > 0) {
                     const newUnitPrice = total / qty;
                     setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
                }

            } else if (name === 'egreso_cantidad') {
                // Guardamos el string original (puede contener coma o punto)
                setEgresoCantidad(value);
                // Reseteamos el ingreso
                if (value !== "") setIngresoCantidad(""); 

            } else if (name === 'total_price') {
                setTotalPrice(value);
                
                // --- CALCULO AUTOMATICO DEL PRECIO UNITARIO ---
                const total = normalize(value);
                // Prioridad: Cantidad Ingresada > Entradas Totales Base
                const qty = normalize(ingresoCantidad) > 0 ? normalize(ingresoCantidad) : normalize(product.entradas);

                if (qty > 0 && total > 0) {
                     const newUnitPrice = total / qty;
                     setProduct(prev => ({ ...prev, price: newUnitPrice.toFixed(2) }));
                }
            }
        }
    };


    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    // ***************************************************************
    // Lógica CORREGIDA en saveProduct
    // ***************************************************************
    const saveProduct = async (e) => {
        e.preventDefault();

        // Función auxiliar local para parsear valores (maneja coma y punto)
        const getNumericValue = (val) => {
            const cleanedVal = String(val || 0).replace(',', '.');
            const number = parseFloat(cleanedVal);
            return isNaN(number) ? 0 : number; 
        };

        // 1. OBTENER VALORES y CALCULAR EL NUEVO STOCK
        const baseEntradas = getNumericValue(product?.entradas);
        const baseSalidas = getNumericValue(product?.salidas);
        
        const ingresoDelta = getNumericValue(ingresoCantidad); // Transacción de ingreso
        const egresoDelta = getNumericValue(egresoCantidad);  // Transacción de egreso
        
        // Stock para validación
        const stockActual = baseEntradas - baseSalidas;
        const stockFinal = stockActual + ingresoDelta - egresoDelta;

        // Validación de Stock Negativo
        if (stockFinal < 0) {
            alert(`Error: No puedes tener stock negativo. El egreso de ${egresoDelta} excede el stock actual de ${stockActual}.`);
            return;
        }

        // 2. CALCULAR LOS NUEVOS VALORES ACUMULADOS
        // Las transacciones se SUMAN a los campos base
        const newEntradas = baseEntradas + ingresoDelta;
        const newSalidas = baseSalidas + egresoDelta;


        // 3. PREPARAR FORMDATA PARA ENVÍO
        // Nota: Asegúrate de que el backend pueda manejar números flotantes
        const formData = new FormData();
        
        formData.append("name", product?.name);
        formData.append("category", product?.category || ""); 
        formData.append("price", product?.price || 0);

        // *** ENVIAMOS LOS NUEVOS VALORES ACUMULADOS ***
        formData.append("entradas", newEntradas);
        formData.append("salidas", newSalidas);
        
        formData.append("description", description);
        
        if (productImage) {
            formData.append("image", productImage);
        }
        
        // 4. ENVÍO, MANEJO DE ESTADO Y REDIRECCIÓN
        try {
            await dispatch(updateProduct({ id, formData }));
            
            // **IMPORTANTE**: Actualizar los estados locales para reflejar el cambio y limpiar la UI.
            setProduct(prevProduct => ({
                ...prevProduct,
                entradas: newEntradas, // Actualizamos las entradas locales
                salidas: newSalidas,  // Actualizamos las salidas locales
            }));
            
            // Limpiamos los campos funcionales
            setIngresoCantidad(""); 
            setEgresoCantidad(""); 
            setTotalPrice(""); 
            
            await dispatch(getProducts());
            navigate("/panel");
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    };
    
    // Cálculo del stock actual para pasar al ProductForm
    const getNumericValue = (val) => {
        const cleanedVal = String(val || 0).replace(',', '.');
        const number = parseFloat(cleanedVal);
        return isNaN(number) ? 0 : number; 
    };
    
    const baseEntradas = getNumericValue(product?.entradas);
    const baseSalidas = getNumericValue(product?.salidas);
    const ingresoDelta = getNumericValue(ingresoCantidad);
    const egresoDelta = getNumericValue(egresoCantidad);
    const stockFinal = (baseEntradas - baseSalidas) + ingresoDelta - egresoDelta;


    return (
        <div className="flex flex-col justify-center items-center gap-5">
            {isLoading && <Loader />}
            <h3 className="text-2xl">Editar Producto</h3>
            <ProductForm
                product={product}
                productImage={productImage}
                imagePreview={imagePreview}
                description={description}
                setDescription={setDescription}
                handleInputChange={handleInputChange} // Para campos base
                handleImageChange={handleImageChange}
                saveProduct={saveProduct}
                
                // PROPS DE LOS NUEVOS CAMPOS FUNCIONALES
                ingreso_cantidad={ingresoCantidad}
                egreso_cantidad={egresoCantidad}
                total_price={totalPrice}
                handleStockChange={handleStockChange} // 🎉 Con la lógica decimal
                stockFinal={stockFinal} // Pasamos el stock calculado para mostrarlo
            />
        </div>
    );
};

export default EditProduct;