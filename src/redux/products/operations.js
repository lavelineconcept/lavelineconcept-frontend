import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (params, thunkAPI) => {
        try {
            const response = await axios.get("/products", { params });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProductById = createAsyncThunk(
    "products/getById",
    async (productId, thunkAPI) => {
        try {
            const response = await axios.get(`/products/${productId}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (productData, thunkAPI) => {
        try {
            const response = await axios.post("/products", productData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productId, productData }, thunkAPI) => {
        try {
            const response = await axios.patch(`/products/${productId}`, productData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId, thunkAPI) => {
        try {
            await axios.delete(`/products/${productId}`, { withCredentials: true });
            return productId;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
