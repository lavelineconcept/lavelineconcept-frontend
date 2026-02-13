import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders, getOrderById, createOrder } from "./operations";

const initialState = {
    items: [],
    currentOrder: null,
    isLoading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Order By Id
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const ordersReducer = ordersSlice.reducer;
