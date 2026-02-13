import { createSlice } from "@reduxjs/toolkit";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "./operations";

const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.products || [];
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            });
    },
});

export const wishlistReducer = wishlistSlice.reducer;
