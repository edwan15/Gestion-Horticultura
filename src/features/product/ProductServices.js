import { db } from "../../firebaseConfig";
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
const logsCollectionRef = collection(db, "logs");

// Campo que guarda el ID del propietario en Firestore
const USER_ID_FIELD = "userId"; 

// 🚨 CONFIGURACIÓN DE CLOUDINARY 🚨
const CLOUD_NAME = "ddoeotuge";
const UPLOAD_PRESET = "presentacion12"; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ======================================================================
// 🚀 HELPER: SUBIR IMAGEN A CLOUDINARY
// ======================================================================
const uploadImageToCloudinary = async (file) => {
    if (!file || !(file instanceof File)) {
        return ""; 
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
        throw new Error("Fallo la subida de la imagen a Cloudinary.");
    }
};

// ======================================================================
// 🚀 HELPER: CONVERTIR FORMDATA A OBJETO
// ======================================================================
const convertFormDataToObject = (formData) => {
    const productObject = {};
    if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
            if (key === 'image' && typeof value === 'object' && value.name) {
                 continue; // La imagen se maneja aparte
            }
            if (key === "entradas" || key === "salidas") {
                productObject[key] = Number(value);
            } else if (key === USER_ID_FIELD && (value === "" || value === "null")) {
                productObject[key] = null;
            } else {
                 productObject[key] = value === "undefined" ? null : value;
            }
        }
        return productObject;
    }
    return formData; // Si ya es objeto, lo devolvemos tal cual
};

// ======================================================================
// 🚀 HELPER: CREAR LOG (FRONTEND)
// ======================================================================
const createLog = async (action, details, userId, metadata = {}) => {
    try {
        if (!userId) {
            console.warn("⚠️ No se pudo crear log: userId no disponible");
            return;
        }
        await addDoc(logsCollectionRef, {
            user: userId,
            action,
            details,
            metadata,
            createdAt: new Date()
        });
        console.log(`📝 Log creado desde Frontend: ${action} - ${details}`);
    } catch (error) {
        console.error("❌ Error al crear log en Frontend:", error);
    }
};

// ======================================================================
// 1. CREATE PRODUCT
// ======================================================================
const createProduct = async (formData) => {
    try {
        // 1. Convertir FormData a Objeto
        const productData = convertFormDataToObject(formData);
        
        // 2. Manejar Imagen
        let imageURL = "";
        const imageFile = formData instanceof FormData ? formData.get('image') : productData.image;
        
        if (imageFile instanceof File) {
            imageURL = await uploadImageToCloudinary(imageFile);
        } else if (typeof imageFile === 'string') {
             imageURL = imageFile;
        }

        if (!productData[USER_ID_FIELD]) {
            throw new Error("El ID de usuario es nulo. No se pudo guardar el producto.");
        }

        const productToSave = {
            ...productData,
            image: imageURL,
            [USER_ID_FIELD]: productData[USER_ID_FIELD],
            createdAt: new Date().toISOString(),
        };

        // 3. Guardar en Firestore
        const docRef = await addDoc(productsCollectionRef, productToSave);

        // 4. Crear Log
        await createLog(
            "CREATE", 
            `Producto creado: ${productToSave.name}`, 
            productToSave[USER_ID_FIELD], 
            { productId: docRef.id, name: productToSave.name }
        );

        toast.success("Producto creado exitosamente.");
        return {
            id: docRef.id,
            ...productToSave
        };

    } catch (error) {
        console.error("Error creating product in Firestore:", error);
        toast.error("Error al crear el producto: " + error.message); 
        throw new Error(error.message || "Error al intentar crear el producto.");
    }
};

// ======================================================================
// 2. GET PRODUCTS
// ======================================================================
const getProducts = async ({ userId, mode }) => {
    let q;
    const isValidUserId = userId && typeof userId === 'string' && userId !== 'null';

    if (mode === "all") {
        q = productsCollectionRef;
    } else if (mode === "own" && isValidUserId) {
        q = query(productsCollectionRef, where(USER_ID_FIELD, "==", userId)); 
    } else if (mode === "own" && !isValidUserId) {
        console.warn("Modo 'own' solicitado, pero el ID de usuario no es válido.");
        return []; 
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

// ======================================================================
// 3. DELETE PRODUCT
// ======================================================================
const deleteProduct = async (id) => {
    try {
        const docRef = doc(db, "products", id);
        
        // Obtener datos antes de eliminar para el log
        const docSnap = await getDoc(docRef);
        const productData = docSnap.exists() ? docSnap.data() : null;

        await deleteDoc(docRef);

        if (productData) {
            await createLog(
                "DELETE", 
                `Producto eliminado: ${productData.name}`, 
                productData[USER_ID_FIELD], 
                { productId: id, name: productData.name }
            );
        }

        return id;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Error al eliminar el producto.");
    }
};

// ======================================================================
// 4. GET SINGLE PRODUCT
// ======================================================================
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
// 5. UPDATE PRODUCT
// ======================================================================
const updateProduct = async (id, productData) => {
    let updateObject = { ...productData };
    
    try {
        const docRef = doc(db, "products", id);
        
        // 1. Manejo de Imagen
        if (updateObject.image && updateObject.image instanceof File) {
            const downloadURL = await uploadImageToCloudinary(updateObject.image);
            updateObject.image = downloadURL; 
        } else {
             updateObject.image = updateObject.image ? updateObject.image.toString() : "";
        }
        
        // Limpieza de objeto File si quedó
        if (updateObject.image instanceof File) {
            delete updateObject.image; 
        }

        // 2. Obtener datos ACTUALES antes de actualizar (para comparar)
        const docSnapBefore = await getDoc(docRef);
        const currentData = docSnapBefore.exists() ? docSnapBefore.data() : {};

        // 3. Actualizar en Firestore
        await updateDoc(docRef, updateObject); 

        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();

        // 4. Comparar y encontrar cambios reales
        const changedFields = [];
        Object.keys(updateObject).forEach(key => {
            if (key === 'updatedAt' || key === 'createdAt') return;
            
            const oldValue = currentData[key];
            const newValue = updateObject[key];

            // Comparación laxa
            if (newValue != oldValue) {
                // Formato: "Campo: NuevoValor" (o puedes poner "Campo: Anterior -> Nuevo")
                changedFields.push(`${key}: ${newValue}`);
            }
        });

        // 5. Log de actualización (Solo si hubo cambios)
        if (changedFields.length > 0) {
            await createLog(
                "UPDATE", 
                `Producto actualizado: ${updatedData.name}`, 
                updatedData[USER_ID_FIELD], 
                { productId: id, changes: changedFields }
            );
        }

        return { id: updatedDoc.id, ...updatedData };

    } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Error al actualizar el producto: " + error.message);
        throw new Error("Error al actualizar el producto.");
    }
};

export const productService = {
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
    getProducts
};