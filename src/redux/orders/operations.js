import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// GET All Orders
export const fetchOrders = createAsyncThunk(
    "orders/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/orders");
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// GET Order Details
export const getOrderById = createAsyncThunk(
    "orders/getById",
    async (orderId, thunkAPI) => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// CREATE Order
export const createOrder = createAsyncThunk(
    "orders/create",
    async (orderData, thunkAPI) => {
        try {
            const response = await axios.post("/orders", orderData);
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
