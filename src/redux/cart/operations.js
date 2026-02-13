import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk(
    "cart/fetch",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/cart");
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/add",
    async ({ productId, quantity, selectedAttributes }, thunkAPI) => {
        try {
            const response = await axios.post("/cart", { productId, quantity, selectedAttributes });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/update",
    async ({ itemId, quantity }, thunkAPI) => {
        try {
            const response = await axios.patch(`/cart/${itemId}`, { quantity });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    "cart/remove",
    async (itemId, thunkAPI) => {
        try {
            const response = await axios.delete(`/cart/${itemId}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clear",
    async (_, thunkAPI) => {
        try {
            await axios.delete("/cart");
            return [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateGiftWrap = createAsyncThunk(
    "cart/updateGiftWrap",
    async (isGiftWrap, thunkAPI) => {
        try {
            const response = await axios.patch("/cart/gift-wrap", { isGiftWrap });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const mergeLocalCart = createAsyncThunk(
    "cart/mergeLocal",
    async (_, thunkAPI) => {
        try {
            const localCartStr = localStorage.getItem('cart');
            const localCart = localCartStr ? JSON.parse(localCartStr) : [];

            const localGiftWrapStr = localStorage.getItem('isGiftWrap');
            const localGiftWrap = localGiftWrapStr ? JSON.parse(localGiftWrapStr) : false;

            if (localCart.length === 0 && !localGiftWrap) {
                // If nothing local, just fetch remote to be sure
                const response = await axios.get("/cart");
                return response.data.data;
            }

            // Sync items
            // We use a simple loop. For production with many items, Promise.all might be faster but loop is safer for order/rate limits.
            for (const item of localCart) {
                // item.productId in local state is the full object. Backend expects string ID.
                // We must check if item.productId is object or string (just in case).
                const productId = item.productId._id || item.productId;

                await axios.post("/cart", {
                    productId,
                    quantity: item.quantity,
                    selectedAttributes: item.selectedAttributes
                });
            }

            // Sync Gift Wrap
            if (localGiftWrap) {
                await axios.patch("/cart/gift-wrap", { isGiftWrap: true });
            }

            // Clear local storage
            localStorage.removeItem('cart');
            localStorage.removeItem('isGiftWrap');

            // Return updated cart from backend
            const response = await axios.get("/cart");
            return response.data.data;

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
