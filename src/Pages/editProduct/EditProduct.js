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

  // 1. ESTADOS PARA LOS NUEVOS CAMPOS FUNCIONALES/TRANSACCIONALES
  const [ingresoCantidad, setIngresoCantidad] = useState("");
  const [egresoCantidad, setEgresoCantidad] = useState("");


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
        });
        
        setImagePreview(productEdit.image ? `${productEdit.image.filePath}` : null);
        setDescription(productEdit.description || "");
    }
  }, [productEdit])

  // 2. MODIFICAMOS handleInputChange y creamos handleStockChange
  
  // Maneja los campos base (name, category, entradas, salidas)
  const handleInputChange = (e) => {
    const {value , name } = e.target;
    setProduct({ ...product, [name]: value });
  };
  
  // Maneja los campos transaccionales (ingreso_cantidad, egreso_cantidad)
  const handleStockChange = (e) => {
    const { name, value } = e.target;
    // Aseguramos que solo sean números positivos, o vacíos si el usuario borra
    const numValue = value === "" ? "" : Math.max(0, parseInt(value, 10)); 

    if (name === 'ingreso_cantidad') {
        setIngresoCantidad(numValue);
        // Reseteamos el egreso para asegurar que solo se haga una operación a la vez
        if (numValue !== "") setEgresoCantidad(""); 
    } else if (name === 'egreso_cantidad') {
        setEgresoCantidad(numValue);
        // Reseteamos el ingreso
        if (numValue !== "") setIngresoCantidad(""); 
    }
  };


  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  // ***************************************************************
  // 3. Lógica CORREGIDA en saveProduct
  // ***************************************************************
  const saveProduct = async (e) => {
    e.preventDefault();

    // 1. OBTENER VALORES y CALCULAR EL NUEVO STOCK
    const baseEntradas = Number(product?.entradas) || 0;
    const baseSalidas = Number(product?.salidas) || 0;
    
    const ingresoDelta = Number(ingresoCantidad) || 0; // Transacción de ingreso
    const egresoDelta = Number(egresoCantidad) || 0;   // Transacción de egreso
    
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
    const formData = new FormData();
    
    formData.append("name", product?.name);
    formData.append("category", product?.category || ""); 
    
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
            salidas: newSalidas,   // Actualizamos las salidas locales
        }));
        
        // Limpiamos los campos funcionales
        setIngresoCantidad(""); 
        setEgresoCantidad(""); 
        
        await dispatch(getProducts());
        navigate("/panel");
    } catch (error) {
        console.error("Error al guardar el producto:", error);
    }
  };
  
  // Cálculo del stock actual para pasar al ProductForm
  const baseEntradas = Number(product?.entradas) || 0;
  const baseSalidas = Number(product?.salidas) || 0;
  const ingresoDelta = Number(ingresoCantidad) || 0;
  const egresoDelta = Number(egresoCantidad) || 0;
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
        handleStockChange={handleStockChange} // Para campos transaccionales
        stockFinal={stockFinal} // Pasamos el stock calculado para mostrarlo
      />
    </div>
  );
};

export default EditProduct;
