// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const initialState = {
//   product: null,
//   products: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
//   totalStoreValue: 0,
//   outOfStock: 0,
//   category: [],
// };

// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (formData, thunkAPI) => {
//     try {
//       return await productService.createProduct(formData);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProducts = createAsyncThunk(
//   "products/getAll",
//   async (_, thunkAPI) => {
//     try {
//       return await productService.getProducts();
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "products/delete",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.deleteProduct(id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.toString() ||
//         error.message;
//       console(message);

//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProduct = createAsyncThunk(
//   "products/getProduct",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.getProduct(id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({ id, formData }, thunkAPI) => {
//     try {
//       return await productService.updateProduct(id, formData);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// const ProductSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     CALC_STORE_VALUE(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { entradas, salidas } = item;
//         const productValue = entradas - salidas;
//         return array.push(productValue);
//       });
//       const totalValue = array.reduce((a, b) => {
//         return a + b;
//       }, 0);
//       state.totalStoreValue = totalValue;
//     },
//     CALC_STORE_OUTOFSTOCK(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { entradas, salidas } = item;
//         const productValue = entradas - salidas;
//         return array.push(productValue);
//       });

//       let count = 0;
//       array.forEach((productValues) => {
//         if (productValues === 0) {
//           count += 1;
//         }
//       });
//       state.outOfStock = count;
//     },
//     CALC_CATEGOTY(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { category } = item;
//         return array.push(category);
//       });
//       const uniqueCategory = [...new Set(array)];
//       state.category = uniqueCategory;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products.push(action.payload);
//         toast.success("Product added successfully");
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products = action.payload;
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product deleted successfully");
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         state.product = action.payload;
//       })
//       .addCase(getProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product updated successfully");
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       });
//   },
// });

// export const { CALC_STORE_VALUE, CALC_STORE_OUTOFSTOCK, CALC_CATEGOTY } =
//   ProductSlice.actions;

// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

// export const selectOutStock = (state) => state.product.outOfStock;

// export const selectCategory = (state) => state.product.category;

// export const selectIsLoading = (state) => state.product.isLoading;

// export const selectProduct = (state) => state.product.product

// export default ProductSlice.reducer;




// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useApi } from "../../hooks/useApi";

// const initialState = {
//   product: null,
//   products: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
//   totalStoreValue: 0,
//   outOfStock: 0,
//   category: [],
// };
// // ----------------------------------------------------
// // THUNKS (Funciones asíncronas)
// // ----------------------------------------------------

// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (formData, thunkAPI) => {
//     try {
//       return await productService.createProduct(formData);
//     } catch (error) {
//       // Manejo de errores simplificado para Firestore
//       const message = error.message || "Error desconocido al crear producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProducts = createAsyncThunk(
//     "products/getProducts",
//     async (credentials, thunkAPI) => {
//         const { userId, userRole } = credentials; 
        
//         // El hook useApi se llama para obtener fetchWithAuth
//         const { fetchWithAuth } = useApi(); // Asumiendo que puedes usar el hook aquí o que lo pasas
        
//         // 🛑 AHORA CONSTRUYES LOS PARÁMETROS DE CONSULTA 🛑
//         const queryParams = { 
//             userId: userId, // Necesario para el backend
//             role: userRole   // Podrías necesitar esto en el backend, aunque ya está en el token
//         };

//         // El backend no necesita el rol si ya lo obtiene del token, pero enviémoslo
//         // para asegurarnos de que el backend tiene la información.

//         // Llamar a fetchWithAuth pasando los queryParams como tercer argumento
//         const data = await fetchWithAuth(
//             "/api/products", // Endpoint
//             { method: 'GET' }, // Opciones
//             queryParams // <--- AQUI VAN LOS PARÁMETROS
//         );

//         return data;
//     }
// );
// export const deleteProduct = createAsyncThunk(
//   "products/delete",
//   async (id, thunkAPI) => {
//     try {
//       // El servicio de Firestore devuelve el ID del producto eliminado
//       return await productService.deleteProduct(id);
//     } catch (error) {
//       // Manejo de errores simplificado para Firestore
//       const message =
//         error.message || "Error desconocido al eliminar producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProduct = createAsyncThunk(
//   "products/getProduct",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.getProduct(id);
//     } catch (error) {
//       // Manejo de errores simplificado para Firestore
//       const message =
//         error.message || "Error desconocido al obtener un producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({ id, formData }, thunkAPI) => {
//     try {
//       // El servicio de Firestore devuelve el producto actualizado
//       return await productService.updateProduct(id, formData);
//     } catch (error) {
//       // Manejo de errores simplificado para Firestore
//       const message =
//         error.message || "Error desconocido al actualizar producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // ----------------------------------------------------
// // SLICE Y REDUCERS
// // ----------------------------------------------------

// const ProductSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     // La lógica de cálculo no cambia y es independiente de la base de datos
//     CALC_STORE_VALUE(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { entradas, salidas } = item;
//         const productValue = entradas - salidas;
//         return array.push(productValue);
//       });
//       const totalValue = array.reduce((a, b) => {
//         return a + b;
//       }, 0);
//       state.totalStoreValue = totalValue;
//     },
//     CALC_STORE_OUTOFSTOCK(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { entradas, salidas } = item;
//         const productValue = entradas - salidas;
//         return array.push(productValue);
//       });

//       let count = 0;
//       array.forEach((productValues) => {
//         if (productValues === 0) {
//           count += 1;
//         }
//       });
//       state.outOfStock = count;
//     },
//     CALC_CATEGOTY(state, action) {
//       const products = action.payload;
//       const array = [];
//       products.map((item) => {
//         const { category } = item;
//         return array.push(category);
//       });
//       const uniqueCategory = [...new Set(array)];
//       state.category = uniqueCategory;
//     },
//   },
//   // ----------------------------------------------------
//   // EXTRA REDUCERS (Manejo de estados de THUNKS)
//   // ----------------------------------------------------

//   extraReducers: (builder) => {
//     builder
//       .addCase(createProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products.push(action.payload);
//         toast.success("Product added successfully");
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products = action.payload;
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product deleted successfully"); // 🚀 OPTIMIZACIÓN: Filtrar el producto eliminado localmente usando el ID devuelto
//         state.products = state.products.filter(
//           (product) => product.id !== action.payload
//         );
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         state.product = action.payload;
//       })
//       .addCase(getProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product updated successfully"); // 🚀 OPTIMIZACIÓN: Reemplazar el producto actualizado en el estado local
//         const index = state.products.findIndex(
//           (product) => product.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.products[index] = action.payload;
//         }
//         state.product = action.payload; // Actualiza el producto individual view
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       });
//   },
// });

// // ----------------------------------------------------
// // EXPORTACIONES
// // ----------------------------------------------------

// export const { CALC_STORE_VALUE, CALC_STORE_OUTOFSTOCK, CALC_CATEGOTY } =
//   ProductSlice.actions;

// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

// export const selectOutStock = (state) => state.product.outOfStock;

// export const selectCategory = (state) => state.product.category;

// export const selectIsLoading = (state) => state.product.isLoading;

// export const selectProduct = (state) => state.product.product;

// export default ProductSlice.reducer;



// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices"; // Asegúrate de tener este servicio
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useApi } from "../../hooks/useApi"; // Asumo que este hook existe

// // --- FUNCIÓN AUXILIAR PARA CONVERTIR FormData (ES CRUCIAL) ---
// const formDataToObject = (formData) => {
//   const object = {};
//   // Verifica si realmente es FormData antes de intentar iterar
//   if (formData instanceof FormData) { 
//     formData.forEach((value, key) => {
//       // Nota: Aquí se maneja la imagen también. La lógica de subir a Storage
//       // debe estar en productService.updateProduct o antes de llamar al thunk.
//       object[key] = value;
//     });
//     return object;
//   }
//   // Si no es FormData (ej. ya es un objeto plano), lo devuelve como está.
//   return formData; 
// };


// const initialState = {
//   product: null,
//   products: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
//   totalStoreValue: 0,
//   outOfStock: 0,
//   category: [],
// };

// // ----------------------------------------------------
// // THUNKS (Funciones asíncronas)
// // ----------------------------------------------------

// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (formData, thunkAPI) => {
//     try {
//       return await productService.createProduct(formData);
//     } catch (error) {
//       const message = error.message || "Error desconocido al crear producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProducts = createAsyncThunk(
//   "products/getProducts",
//   async (credentials, thunkAPI) => {
//     const { userId, userRole } = credentials; 
    
//     // El hook useApi se llama para obtener fetchWithAuth
//     // NOTA: Usar hooks dentro de thunks no es estándar, asumo que 'useApi' devuelve una función.
//     const { fetchWithAuth } = useApi(); 
    
//     const queryParams = { 
//       userId: userId, 
//       role: userRole 
//     };

//     try {
//         const data = await fetchWithAuth(
//             "/api/products", 
//             { method: 'GET' }, 
//             queryParams
//         );
//         return data;
//     } catch (error) {
//         const message = error.message || "Error desconocido al obtener productos.";
//         console.log(message);
//         return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "products/delete",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.deleteProduct(id);
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al eliminar producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProduct = createAsyncThunk(
//   "products/getProduct",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.getProduct(id);
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al obtener un producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({ id, formData }, thunkAPI) => {
//     try {
//       // 🛑 SOLUCIÓN AL PROBLEMA DE FIREBASE: CONVERTIR FormData a Objeto Plano 🛑
//       const productData = formDataToObject(formData); 
      
//       // El servicio ahora recibe un objeto plano válido para Firestore (productData)
//       return await productService.updateProduct(id, productData); 
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al actualizar producto.";
//       console.log(message);
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // ----------------------------------------------------
// // SLICE Y REDUCERS
// // ----------------------------------------------------

// const ProductSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     // La lógica de cálculo no cambia y es independiente de la base de datos
//     CALC_STORE_VALUE(state, action) {
//       const products = action.payload;
//       const totalValue = products.reduce((acc, item) => {
//         const entradas = parseInt(item.entradas, 10) || 0;
//         const salidas = parseInt(item.salidas, 10) || 0;
//         return acc + (entradas - salidas);
//       }, 0);
//       state.totalStoreValue = totalValue;
//     },
//     CALC_STORE_OUTOFSTOCK(state, action) {
//       const products = action.payload;
//       const count = products.filter((item) => {
//         const entradas = parseInt(item.entradas, 10) || 0;
//         const salidas = parseInt(item.salidas, 10) || 0;
//         return (entradas - salidas) === 0;
//       }).length;
//       state.outOfStock = count;
//     },
//     CALC_CATEGOTY(state, action) {
//       const products = action.payload;
//       const categories = products.map((item) => item.category);
//       const uniqueCategory = [...new Set(categories)].filter(cat => cat); // Filtra categorías vacías
//       state.category = uniqueCategory;
//     },
//   },
//   // ----------------------------------------------------
//   // EXTRA REDUCERS (Manejo de estados de THUNKS)
//   // ----------------------------------------------------

//   extraReducers: (builder) => {
//     builder
//       .addCase(createProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products.push(action.payload);
//         toast.success("Product added successfully");
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         console.log(action.payload);
//         state.products = action.payload;
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product deleted successfully"); 
//         state.products = state.products.filter(
//           (product) => product.id !== action.payload
//         );
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(getProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         state.product = action.payload;
//       })
//       .addCase(getProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.isError = false;
//         toast.success("Product updated successfully");
//         const index = state.products.findIndex(
//           (product) => product.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.products[index] = action.payload;
//         }
//         state.product = action.payload; // Actualiza el producto individual view
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         toast.error(action.payload);
//       });
//   },
// });

// // ----------------------------------------------------
// // EXPORTACIONES
// // ----------------------------------------------------

// export const { CALC_STORE_VALUE, CALC_STORE_OUTOFSTOCK, CALC_CATEGOTY } =
//   ProductSlice.actions;

// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

// export const selectOutStock = (state) => state.product.outOfStock;

// export const selectCategory = (state) => state.product.category;

// export const selectIsLoading = (state) => state.product.isLoading;

// export const selectProduct = (state) => state.product.product;

// export default ProductSlice.reducer;



// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices"; // Asegúrate de tener este servicio
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import { useApi } from "../../hooks/useApi"; // Nota: No se puede usar hooks dentro de Redux slices o Thunks

// // --- FUNCIÓN AUXILIAR PARA CONVERTIR FormData (ES CRUCIAL) ---
// const formDataToObject = (formData) => {
//   const object = {};
//   // Verifica si realmente es FormData antes de intentar iterar
//   if (formData instanceof FormData) { 
//     formData.forEach((value, key) => {
//       object[key] = value;
//     });
//     return object;
//   }
//   return formData; 
// };


// const initialState = {
//   product: null,
//   products: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
//   // Resumen del Inventario
//   totalStoreValue: 0,
//   outOfStock: 0,
//   category: [],
//   // 📌 NUEVO ESTADO: Conteo de categorías específicas para el Dashboard
//   specificCategoryCounts: { 
//     Fitosanitarios: 0,
//     Fertilizantes: 0,
//     Trampas: 0,
//     Otros: 0,
//   },
// };

// // ----------------------------------------------------
// // THUNKS (Funciones asíncronas) - Se mantienen igual
// // ----------------------------------------------------

// // Thunk para crear producto
// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (formData, thunkAPI) => {
//     try {
//       return await productService.createProduct(formData);
//     } catch (error) {
//       const message = error.message || "Error desconocido al crear producto.";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Thunk para obtener productos
// // Nota: 'useApi' no puede usarse aquí, el servicio debería manejar la autenticación/fetch.
// export const getProducts = createAsyncThunk(
//   "products/getProducts",
//   async (credentials, thunkAPI) => {
//     const { userId, userRole } = credentials; 
//     try {
//       // **ASUMIMOS** que productService.getProducts maneja la lógica de fetch con autenticación
//       const data = await productService.getProducts(userId, userRole);
//       return data;
//     } catch (error) {
//       const message = error.message || "Error desconocido al obtener productos.";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Thunk para eliminar producto
// export const deleteProduct = createAsyncThunk(
//   "products/delete",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.deleteProduct(id);
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al eliminar producto.";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Thunk para obtener un producto
// export const getProduct = createAsyncThunk(
//   "products/getProduct",
//   async (id, thunkAPI) => {
//     try {
//       return await productService.getProduct(id);
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al obtener un producto.";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // Thunk para actualizar producto
// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({ id, formData }, thunkAPI) => {
//     try {
//       const productData = formDataToObject(formData); 
//       return await productService.updateProduct(id, productData); 
//     } catch (error) {
//       const message =
//         error.message || "Error desconocido al actualizar producto.";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // ----------------------------------------------------
// // SLICE Y REDUCERS (Lógica de Cálculo)
// // ----------------------------------------------------

// const ProductSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     // 1. Calcular Valor (Stock) Total del Inventario
//     CALC_STORE_VALUE(state, action) {
//       const products = action.payload;
//       const totalValue = products.reduce((acc, item) => {
//         const entradas = parseInt(item.entradas, 10) || 0;
//         const salidas = parseInt(item.salidas, 10) || 0;
//         // Asumo que totalStoreValue es el stock total, no el valor monetario.
//         return acc + (entradas - salidas);
//       }, 0);
//       state.totalStoreValue = totalValue;
//     },
    
//     // 2. Calcular Productos Agotados (Stock 0 o menos)
//     CALC_STORE_OUTOFSTOCK(state, action) {
//       const products = action.payload;
//       const count = products.filter((item) => {
//         const entradas = parseInt(item.entradas, 10) || 0;
//         const salidas = parseInt(item.salidas, 10) || 0;
//         return (entradas - salidas) <= 0; // Cambiado a <= 0 para incluir stock negativo/cero.
//       }).length;
//       state.outOfStock = count;
//     },
    
//     // 3. Calcular Categorías Únicas
//     CALC_CATEGOTY(state, action) {
//       const products = action.payload;
//       const categories = products.map((item) => item.category);
//       const uniqueCategory = [...new Set(categories)].filter(cat => cat); 
//       state.category = uniqueCategory;
//     },

//     // 4. 📌 NUEVO REDUCER: Cálculo de conteo por categorías específicas
//     CALC_SPECIFIC_CATEGORY_COUNTS(state, action) {
//       const products = action.payload;
//       const counts = {
//         Fitosanitarios: 0,
//         Fertilizantes: 0,
//         Trampas: 0,
//         Otros: 0,
//       };

//       products.forEach(product => {
//         const category = product.category || 'Otros'; 
//         const stock = (parseInt(product.entradas, 10) || 0) - (parseInt(product.salidas, 10) || 0);
        
//         // Solo contamos si hay stock
//         if (stock > 0) {
//             if (category === 'Fitosanitarios') {
//                 counts.Fitosanitarios += 1;
//             } else if (category === 'Fertilizantes') {
//                 counts.Fertilizantes += 1;
//             } else if (category === 'Trampas') {
//                 counts.Trampas += 1;
//             } else {
//                 // Cualquier otra categoría va a 'Otros'
//                 counts.Otros += 1;
//             }
//         }
//       });

//       state.specificCategoryCounts = counts;
//     },
//   },
//   // ----------------------------------------------------
//   // EXTRA REDUCERS (Manejo de estados de THUNKS)
//   // ----------------------------------------------------

//   extraReducers: (builder) => {
//     builder
//       // Crear Producto
//       .addCase(createProduct.pending, (state) => { state.isLoading = true; })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.isLoading = false; state.isSuccess = true; state.isError = false;
//         state.products.push(action.payload);
//         toast.success("Producto añadido exitosamente");
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.isLoading = false; state.isError = true; state.message = action.payload;
//         toast.error(action.payload);
//       })
//       // Obtener Productos
//       .addCase(getProducts.pending, (state) => { state.isLoading = true; })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.isLoading = false; state.isSuccess = true; state.isError = false;
//         state.products = action.payload;
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.isLoading = false; state.isError = true; state.message = action.payload;
//         toast.error(action.payload);
//       })
//       // Eliminar Producto
//       .addCase(deleteProduct.pending, (state) => { state.isLoading = true; })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.isLoading = false; state.isSuccess = true; state.isError = false;
//         toast.success("Producto eliminado exitosamente"); 
//         state.products = state.products.filter(
//           (product) => product.id !== action.payload
//         );
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.isLoading = false; state.isError = true; state.message = action.payload;
//         toast.error(action.payload);
//       })
//       // Obtener un Producto (Detalle)
//       .addCase(getProduct.pending, (state) => { state.isLoading = true; })
//       .addCase(getProduct.fulfilled, (state, action) => {
//         state.isLoading = false; state.isSuccess = true; state.isError = false;
//         state.product = action.payload;
//       })
//       .addCase(getProduct.rejected, (state, action) => {
//         state.isLoading = false; state.isError = true; state.message = action.payload;
//         toast.error(action.payload);
//       })
//       // Actualizar Producto
//       .addCase(updateProduct.pending, (state) => { state.isLoading = true; })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.isLoading = false; state.isSuccess = true; state.isError = false;
//         toast.success("Producto actualizado exitosamente");
//         const index = state.products.findIndex(
//           (product) => product.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.products[index] = action.payload;
//         }
//         state.product = action.payload;
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.isLoading = false; state.isError = true; state.message = action.payload;
//         toast.error(action.payload);
//       });
//   },
// });

// // ----------------------------------------------------
// // EXPORTACIONES
// // ----------------------------------------------------

// export const { 
//     CALC_STORE_VALUE, 
//     CALC_STORE_OUTOFSTOCK, 
//     CALC_CATEGOTY,
//     CALC_SPECIFIC_CATEGORY_COUNTS, // 👈 Exportación de la nueva acción
// } = ProductSlice.actions;

// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

// export const selectOutStock = (state) => state.product.outOfStock;

// export const selectCategory = (state) => state.product.category;

// // 👈 Exportación del nuevo selector
// export const selectSpecificCategoryCounts = (state) => state.product.specificCategoryCounts; 

// export const selectIsLoading = (state) => state.product.isLoading;

// export const selectProduct = (state) => state.product.product;

// export default ProductSlice.reducer;




import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "./ProductServices"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- FUNCIÓN AUXILIAR PARA CONVERTIR FormData (ES CRUCIAL) ---
const formDataToObject = (formData) => {
  const object = {};
  // Verifica si realmente es FormData antes de intentar iterar
  if (formData instanceof FormData) { 
    formData.forEach((value, key) => {
      object[key] = value;
    });
    return object;
  }
  return formData; 
};

// --- FUNCIÓN AUXILIAR PARA NORMALIZAR EL CAMPO ID ---
// Asegura que 'userId' o 'user' siempre sea un string plano, no un objeto { _ref: ... }
const normalizeUserId = (product) => {
    // Lógica para limpiar 'userId'
    const cleanUserId = (
        product.userId && typeof product.userId === 'object' && product.userId._ref
    ) ? product.userId._ref 
      : product.userId;

    // Lógica para limpiar 'user' (por si acaso la DB usa este nombre)
    const cleanUser = (
        product.user && typeof product.user === 'object' && product.user._ref
    ) ? product.user._ref 
      : product.user;

    return {
        ...product,
        // Usamos la versión limpia, si es que se limpió algo
        userId: cleanUserId || product.userId, 
        user: cleanUser || product.user, 
    };
};


const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  // Resumen del Inventario
  totalStoreValue: 0,
  outOfStock: 0,
  category: [],
  // 📌 NUEVO ESTADO: Conteo de categorías específicas para el Dashboard
  specificCategoryCounts: { 
    Fitosanitarios: 0,
    Fertilizantes: 0,
    Trampas: 0,
    Otros: 0,
  },
};

// ----------------------------------------------------
// THUNKS (Funciones asíncronas) 
// ----------------------------------------------------

// Thunk para crear producto
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData, thunkAPI) => {
    try {
      return await productService.createProduct(formData);
    } catch (error) {
      const message = error.message || "Error desconocido al crear producto.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para obtener productos
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (credentials, thunkAPI) => {
    const { userId, userRole } = credentials; 
    try {
      const data = await productService.getProducts({ userId, userRole, mode: 'own' }); // Usamos el objeto de credenciales
      return data;
    } catch (error) {
      const message = error.message || "Error desconocido al obtener productos.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para eliminar producto
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      const message =
        error.message || "Error desconocido al eliminar producto.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para obtener un producto
export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
    } catch (error) {
      const message =
        error.message || "Error desconocido al obtener un producto.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para actualizar producto
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const productData = formDataToObject(formData); 
      return await productService.updateProduct(id, productData); 
    } catch (error) {
      const message =
        error.message || "Error desconocido al actualizar producto.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ----------------------------------------------------
// SLICE Y REDUCERS (Lógica de Cálculo)
// ----------------------------------------------------

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // 1. Calcular Valor (Stock) Total del Inventario
    CALC_STORE_VALUE(state, action) {
      const products = action.payload;
      const totalValue = products.reduce((acc, item) => {
        const entradas = parseInt(item.entradas, 10) || 0;
        const salidas = parseInt(item.salidas, 10) || 0;
        return acc + (entradas - salidas);
      }, 0);
      state.totalStoreValue = totalValue;
    },
    
    // 2. Calcular Productos Agotados (Stock 0 o menos)
    CALC_STORE_OUTOFSTOCK(state, action) {
      const products = action.payload;
      const count = products.filter((item) => {
        const entradas = parseInt(item.entradas, 10) || 0;
        const salidas = parseInt(item.salidas, 10) || 0;
        return (entradas - salidas) <= 0; 
      }).length;
      state.outOfStock = count;
    },
    
    // 3. Calcular Categorías Únicas
    CALC_CATEGOTY(state, action) {
      const products = action.payload;
      const categories = products.map((item) => item.category);
      const uniqueCategory = [...new Set(categories)].filter(cat => cat); 
      state.category = uniqueCategory;
    },

    // 4. Cálculo de conteo por categorías específicas
    CALC_SPECIFIC_CATEGORY_COUNTS(state, action) {
      const products = action.payload;
      const counts = {
        Fitosanitarios: 0,
        Fertilizantes: 0,
        Trampas: 0,
        Otros: 0,
      };

      products.forEach(product => {
        const category = product.category || 'Otros'; 
        const stock = (parseInt(product.entradas, 10) || 0) - (parseInt(product.salidas, 10) || 0);
        
        // Solo contamos si hay stock
        if (stock > 0) {
            if (category === 'Fitosanitarios') {
                counts.Fitosanitarios += 1;
            } else if (category === 'Fertilizantes') {
                counts.Fertilizantes += 1;
            } else if (category === 'Trampas') {
                counts.Trampas += 1;
            } else {
                counts.Otros += 1;
            }
        }
      });

      state.specificCategoryCounts = counts;
    },
  },
  // ----------------------------------------------------
  // EXTRA REDUCERS (Manejo de estados de THUNKS)
  // ----------------------------------------------------

  extraReducers: (builder) => {
    builder
      // Crear Producto
      .addCase(createProduct.pending, (state) => { state.isLoading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isError = false;
        state.products.push(action.payload);
        toast.success("Producto añadido exitosamente");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
        toast.error(action.payload);
      })
      // Obtener Productos (Lista) - CORRECCIÓN APLICADA AQUÍ ⬇️
      .addCase(getProducts.pending, (state) => { state.isLoading = true; })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isError = false;

        // 🛑 LÓGICA DE NORMALIZACIÓN PARA LA LISTA 🛑
        const cleanedProducts = action.payload.map(normalizeUserId);

        state.products = cleanedProducts;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
        toast.error(action.payload);
      })
      // Eliminar Producto
      .addCase(deleteProduct.pending, (state) => { state.isLoading = true; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isError = false;
        toast.success("Producto eliminado exitosamente"); 
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
        toast.error(action.payload);
      })
      // Obtener un Producto (Detalle) - CORRECCIÓN APLICADA AQUÍ ⬇️
      .addCase(getProduct.pending, (state) => { state.isLoading = true; })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isError = false;
        
        // 🛑 LÓGICA DE NORMALIZACIÓN PARA EL PRODUCTO INDIVIDUAL 🛑
        state.product = normalizeUserId(action.payload);
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
        toast.error(action.payload);
      })
      // Actualizar Producto
      .addCase(updateProduct.pending, (state) => { state.isLoading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isError = false;
        toast.success("Producto actualizado exitosamente");
        const updatedProduct = normalizeUserId(action.payload); // Normalizamos al actualizar
        
        const index = state.products.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.product = updatedProduct;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

// ----------------------------------------------------
// EXPORTACIONES
// ----------------------------------------------------

export const { 
    CALC_STORE_VALUE, 
    CALC_STORE_OUTOFSTOCK, 
    CALC_CATEGOTY,
    CALC_SPECIFIC_CATEGORY_COUNTS, 
} = ProductSlice.actions;

export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

export const selectOutStock = (state) => state.product.outOfStock;

export const selectCategory = (state) => state.product.category;

export const selectSpecificCategoryCounts = (state) => state.product.specificCategoryCounts; 

export const selectIsLoading = (state) => state.product.isLoading;

export const selectProduct = (state) => state.product.product;

export default ProductSlice.reducer;