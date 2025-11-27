// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   filteredProduct: [],
// };

// const FilterSearch = createSlice({
//   name: "filter",
//   initialState,
//   reducers: {
//     FILTER_PRODUCTS(state, action) {
//       const { search, products } = action.payload;
//       const tempProducts = products.filter((product) =>
//         product.name.toLowerCase().includes(search.toLowerCase())
//       );

//       state.filteredProduct = tempProducts;
//     },
//   },
// });

// export const { FILTER_PRODUCTS } = FilterSearch.actions;

// export const  selectFilteredProduct = (state) => state.filter.filteredProduct
// export default FilterSearch.reducer;



// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   filteredProduct: [],
// };

// const FilterSearch = createSlice({
//   name: "filter",
//   initialState,
//   reducers: {
//     FILTER_PRODUCTS(state, action) {
//       const { search, products } = action.payload;
      
//       // 1. Aseguramos que 'search' sea una cadena minúscula segura
//       const searchTerm = search ? search.toLowerCase() : '';

//       const tempProducts = products.filter((product) =>
//         // 🛑 CORRECCIÓN: Usamos el encadenamiento opcional (?.) para evitar
//         // un error si 'product.name' es nulo o indefinido.
//         product.name?.toLowerCase().includes(searchTerm)
//       );

//       state.filteredProduct = tempProducts;
//     },
//   },
// });

// export const { FILTER_PRODUCTS } = FilterSearch.actions;

// export const  selectFilteredProduct = (state) => state.filter.filteredProduct
// export default FilterSearch.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filteredProduct: [],
};

const FilterSearch = createSlice({
    name: "filter",
    initialState,
    reducers: {
        FILTER_PRODUCTS(state, action) {
            const { search, products } = action.payload;
            
            // 1. Aseguramos que 'search' sea una cadena minúscula segura y eliminamos espacios
            const searchTerm = search ? search.toLowerCase().trim() : '';

            const tempProducts = products.filter((product) => {
                // 🛑 Lógica de Filtrado COMPLETA y SEGURA:
                // Buscamos tanto en el nombre como en la categoría.
                // Usamos el encadenamiento opcional (?.) para evitar errores si 'name' o 'category' son nulos.
                const nameMatch = product.name?.toLowerCase().includes(searchTerm);
                const categoryMatch = product.category?.toLowerCase().includes(searchTerm);

                return nameMatch || categoryMatch;
            });

            state.filteredProduct = tempProducts;
        },
    },
});

export const { FILTER_PRODUCTS } = FilterSearch.actions;

export const selectFilteredProduct = (state) => state.filter.filteredProduct
export default FilterSearch.reducer;