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
// import { productService } from "./ProductServices"; // Asegúrate de que esta ruta es correcta
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

// // ***** THUNK MODIFICADO PARA ACEPTAR EL MODO DE CARGA *****
// export const getProducts = createAsyncThunk(
//   "products/getAll",
//   async (fetchMode, thunkAPI) => { // Recibe el fetchMode ("all" o "own")
//     try {
//       // Pasa el modo de carga al servicio
//       return await productService.getProducts(fetchMode);
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
// // **********************************************************

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
//       console.log(message); // Corregí la llamada a console.log

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
//         if (productValues <= 0) { // Corregido: Es más seguro usar <= 0 para fuera de stock
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

// export const selectProduct = (state) => state.product.product;

// export default ProductSlice.reducer;


// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices"; 
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const initialState = {
//     product: null,
//     products: [],
//     // Añadido para el filtrado, si es que lo usas
//     filteredProducts: [], 
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: "",
//     totalStoreValue: 0,
//     outOfStock: 0,
//     category: [],
// };

// // =========================================================================
// // THUNKS (Mantienen el mismo código, no son la causa del TypeError)
// // =========================================================================

// export const createProduct = createAsyncThunk(/* ... */);

// export const getProducts = createAsyncThunk(
//     "products/getAll",
//     async (fetchMode, thunkAPI) => {
//         try {
//             return await productService.getProducts(fetchMode);
//         } catch (error) {
//             const message =
//                 (error.response && error.response.data && error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const deleteProduct = createAsyncThunk(/* ... */);
// export const getProduct = createAsyncThunk(/* ... */);
// export const updateProduct = createAsyncThunk(/* ... */);

// // =========================================================================
// // SLICE Y REDUCERS (¡ARREGLADO!)
// // =========================================================================

// const ProductSlice = createSlice({
//     name: "product",
//     initialState,
//     reducers: {
//         // 🛑 ARREGLO: Chequeo de Array para evitar '.map is not a function'
//         CALC_STORE_VALUE(state, action) {
//             const products = action.payload;
//             if (!Array.isArray(products)) return state; // <--- CLAVE DE PROTECCIÓN
            
//             const array = [];
//             products.map((item) => {
//                 const { entradas, salidas } = item;
//                 // Asegurar que entradas/salidas son tratados como números, no como undefined
//                 const productValue = (entradas || 0) - (salidas || 0); 
//                 return array.push(productValue);
//             });
//             const totalValue = array.reduce((a, b) => a + b, 0);
//             state.totalStoreValue = totalValue;
//         },
        
//         // 🛑 ARREGLO: Chequeo de Array para evitar '.map is not a function'
//         CALC_STORE_OUTOFSTOCK(state, action) {
//             const products = action.payload;
//             if (!Array.isArray(products)) return state; // <--- CLAVE DE PROTECCIÓN
            
//             const array = [];
//             products.map((item) => {
//                 const { entradas, salidas } = item;
//                 const productValue = (entradas || 0) - (salidas || 0);
//                 return array.push(productValue);
//             });

//             let count = 0;
//             array.forEach((productValues) => {
//                 if (productValues <= 0) {
//                     count += 1;
//                 }
//             });
//             state.outOfStock = count;
//         },
        
//         // 🛑 ARREGLO: Chequeo de Array para evitar '.map is not a function'
//         CALC_CATEGOTY(state, action) {
//             const products = action.payload;
//             if (!Array.isArray(products)) return state; // <--- CLAVE DE PROTECCIÓN
            
//             const array = [];
//             products.map((item) => {
//                 const { category } = item;
//                 return array.push(category);
//             });
//             const uniqueCategory = [...new Set(array)];
//             state.category = uniqueCategory;
//         },
        
//         // 🛑 AÑADIDO y ARREGLADO: Este era el último error reportado (TypeError: products.filter)
//         FILTER_PRODUCTS(state, action) {
//     const { products, search } = action.payload;
    
//     // 💡 SOLUCIÓN: Si no es un array, lo ignoramos o lo tratamos como vacío.
//     if (!Array.isArray(products)) {
//         state.filteredProducts = []; 
//         return state; 
//     }

//     const tempProducts = products.filter((product) => {
//         // ... tu lógica de filtrado ...
//         return (
//             product.name.toLowerCase().includes(search.toLowerCase()) ||
//             product.category.toLowerCase().includes(search.toLowerCase())
//         );
//     });
    
//     state.filteredProducts = tempProducts;
// },
//     },
//     extraReducers: (builder) => {
//         builder
//              // ... handlers para createProduct, deleteProduct, getProduct, updateProduct
            
//             .addCase(getProducts.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProducts.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 console.log(action.payload);
//                 state.products = action.payload;
//             })
//             // Es crucial que al rechazar, limpiemos la lista de productos
//             .addCase(getProducts.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 state.products = []; // <--- Limpiamos la lista al fallar la API
//                 toast.error(action.payload);
//             })
//             // ... (otros addCase)
//             // ... Asegúrate de añadir un handler para deleteProduct, getProduct, updateProduct rejected
//             .addCase(deleteProduct.rejected, (state, action) => {
//                  state.isLoading = false;
//                  state.isError = true;
//                  state.message = action.payload;
//                  toast.error(action.payload);
//             })
//             // ...
//     },
// });

// export const { CALC_STORE_VALUE, CALC_STORE_OUTOFSTOCK, CALC_CATEGOTY, FILTER_PRODUCTS } =
//     ProductSlice.actions;

// // Asegúrate de exportar también el selector para filteredProducts si lo usas en el frontend
// export const selectFilteredProducts = (state) => state.product.filteredProducts;

// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

// export const selectOutStock = (state) => state.product.outOfStock;

// export const selectCategory = (state) => state.product.category;

// export const selectIsLoading = (state) => state.product.isLoading;

// export const selectProduct = (state) => state.product.product;

// export default ProductSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productService } from "./ProductServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  totalStoreValue: 0,
  outOfStock: 0,
  category: [],
};
 
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData, thunkAPI) => {
    try {
      return await productService.createProduct(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProducts = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      console(message);

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { entradas, salidas } = item;
        const productValue = entradas - salidas;
        return array.push(productValue);
      });
      const totalValue = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalStoreValue = totalValue;
    },
    CALC_STORE_OUTOFSTOCK(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { entradas, salidas } = item;
        const productValue = entradas - salidas;
        return array.push(productValue);
      });

      let count = 0;
      array.forEach((productValues) => {
        if (productValues === 0) {
          count += 1;
        }
      });
      state.outOfStock = count;
    },
    CALC_CATEGOTY(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { category } = item;
        return array.push(category);
      });
      const uniqueCategory = [...new Set(array)];
      state.category = uniqueCategory;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.products.push(action.payload);
        toast.success("Product added successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product deleted successfully");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product updated successfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { CALC_STORE_VALUE, CALC_STORE_OUTOFSTOCK, CALC_CATEGOTY } =
  ProductSlice.actions;

export const selectTotalStoreValue = (state) => state.product.totalStoreValue;

export const selectOutStock = (state) => state.product.outOfStock;

export const selectCategory = (state) => state.product.category;

export const selectIsLoading = (state) => state.product.isLoading;

export const selectProduct = (state) => state.product.product

export default ProductSlice.reducer;


// export default ProductSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { productService } from "./ProductServices"; // Asegúrate de que esta ruta es correcta
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const initialState = {
//     product: null,
//     products: [],
//     filteredProducts: [],
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: "",
//     totalStoreValue: 0,
//     outOfStock: 0,
//     category: [],
// };

// // Función auxiliar para obtener el token de forma segura
// // Asume que tu token está en state.auth.user.token
// const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

// // =========================================================================
// // THUNKS
// // =========================================================================

// export const createProduct = createAsyncThunk(
//     "product/create",
//     async (formData, thunkAPI) => {
//         try {
//             // 🛑 CORRECCIÓN: Obtener y pasar el token
//             const token = getToken(thunkAPI);
//             if (!token) return thunkAPI.rejectWithValue("No autenticado. Inicia sesión para crear productos.");

//             return await productService.createProduct(formData, token);
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             toast.error(message);
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const getProducts = createAsyncThunk(
//     "products/getAll",
//     async (fetchMode, thunkAPI) => { // Recibe el fetchMode ("all" o "own")
//         try {
//             // 🛑 CORRECCIÓN: Obtener y pasar el token
//             const token = getToken(thunkAPI); 
//             if (!token) return thunkAPI.rejectWithValue("No autenticado. Inicia sesión para ver productos.");
//             
//             return await productService.getProducts(fetchMode, token); 
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const deleteProduct = createAsyncThunk(
//     "products/delete",
//     async (id, thunkAPI) => {
//         try {
//             // 🛑 CORRECCIÓN: Obtener y pasar el token
//             const token = getToken(thunkAPI);
//             if (!token) return thunkAPI.rejectWithValue("No autenticado. Inicia sesión para eliminar productos.");
//             
//             return await productService.deleteProduct(id, token);
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.toString() ||
//                 error.message;
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const getProduct = createAsyncThunk(
//     "products/getProduct",
//     async (id, thunkAPI) => {
//         try {
//             // 🛑 CORRECCIÓN: Obtener y pasar el token
//             const token = getToken(thunkAPI);
//             if (!token) return thunkAPI.rejectWithValue("No autenticado. Inicia sesión para ver el producto.");

//             return await productService.getProduct(id, token);
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const updateProduct = createAsyncThunk(
//     "products/updateProduct",
//     async ({ id, formData }, thunkAPI) => {
//         try {
//             // 🛑 CORRECCIÓN: Obtener y pasar el token
//             const token = getToken(thunkAPI);
//             if (!token) return thunkAPI.rejectWithValue("No autenticado. Inicia sesión para actualizar productos.");

//             return await productService.updateProduct(id, formData, token);
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// // =========================================================================
// // REDUCERS
// // =========================================================================

// const ProductSlice = createSlice({
//     name: "product",
//     initialState,
//     reducers: {
//         // Estos reductores se mantienen sin cambios
//         CALC_STORE_VALUE(state, action) { /* ... */ },
//         CALC_STORE_OUTOFSTOCK(state, action) { /* ... */ },
//         CALC_CATEGOTY(state, action) { /* ... */ },
//         FILTER_PRODUCTS(state, action) { /* ... */ },
//     },
//     // =========================================================================
//     // EXTRA REDUCERS (CON SINCRONIZACIÓN VISUAL)
//     // =========================================================================
//     extraReducers: (builder) => {
//         builder
//             // --- CREATE PRODUCT (Sincronización visual) ---
//             .addCase(createProduct.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 state.message = "Producto creado exitosamente";
//                 toast.success("Producto creado con éxito.");
                
//                 // 🛑 SOLUCIÓN VISUAL: Añadir el nuevo producto al inicio de la lista
//                 // Esto hace que el producto aparezca inmediatamente sin recargar la lista completa.
//                 state.products.unshift(action.payload); 
//             })
//             .addCase(createProduct.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 // El toast.error ya se llama dentro del Thunk
//             })

//             // --- GET PRODUCTS ---
//             .addCase(getProducts.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProducts.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 
//                 if (Array.isArray(action.payload)) {
//                     state.products = action.payload;
//                 } else {
//                     state.products = []; 
//                 }
//             })
//             .addCase(getProducts.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 state.products = []; 
//                 toast.error(action.payload);
//             })

//             // --- DELETE PRODUCT ---
//             .addCase(deleteProduct.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 toast.success(action.payload); 
//                 // Nota: Tu componente ya llama a getProducts después de eliminar. 
//             })
//             .addCase(deleteProduct.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 toast.error(action.payload);
//             })

//             // --- GET PRODUCT (Individual) ---
//             .addCase(getProduct.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 state.product = action.payload; 
//             })
//             .addCase(getProduct.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 toast.error(action.payload);
//             })

//             // --- UPDATE PRODUCT ---
//             .addCase(updateProduct.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.isError = false;
//                 state.message = "Producto actualizado exitosamente";
//                 toast.success("Producto actualizado con éxito."); 
//             })
//             .addCase(updateProduct.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//                 toast.error(action.payload);
//             });
//     },
// });

// export const { 
//     CALC_STORE_VALUE, 
//     CALC_STORE_OUTOFSTOCK, 
//     CALC_CATEGOTY, 
//     FILTER_PRODUCTS 
// } = ProductSlice.actions;

// // Selectors
// export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
// export const selectOutStock = (state) => state.product.outOfStock;
// export const selectCategory = (state) => state.product.category;
// export const selectIsLoading = (state) => state.product.isLoading;
// export const selectProduct = (state) => state.product.product;
// export const selectFilteredProducts = (state) => state.product.filteredProducts;

// export default ProductSlice.reducer;