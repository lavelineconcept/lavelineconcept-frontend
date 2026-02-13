import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetch",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/wishlist");
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addToWishlist = createAsyncThunk(
    "wishlist/add",
    async (productId, thunkAPI) => {
        try {
            const response = await axios.post("/wishlist", { productId });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    "wishlist/remove",
    async (productId, thunkAPI) => {
        try {
            const response = await axios.delete(`/wishlist/${productId}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
