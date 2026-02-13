import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, getProductById, addProduct, updateProduct, deleteProduct } from "./operations";

const initialState = {
    items: [],
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    currentProduct: null,
    isLoading: false,
    error: null,
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data;
                state.page = action.payload.page;
                state.perPage = action.payload.perPage;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.hasPreviousPage = action.payload.hasPreviousPage;
                state.hasNextPage = action.payload.hasNextPage;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // ADD
            .addCase(addProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // UPDATE
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.items.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
                if (state.currentProduct?._id === action.payload._id) state.currentProduct = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // DELETE
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const productsReducer = productsSlice.reducer;
