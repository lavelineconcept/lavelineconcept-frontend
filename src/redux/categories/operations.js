import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
    "categories/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("categories");
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addCategory = createAsyncThunk(
    "categories/add",
    async (categoryData, thunkAPI) => {
        try {
            const isFormData = categoryData instanceof FormData;
            const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };

            const response = await axios.post("categories", categoryData, {
                withCredentials: true,
                headers
            });
            return response.data.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/update",
    async ({ categoryId, categoryData }, thunkAPI) => {
        try {
            const isFormData = categoryData instanceof FormData;
            const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };

            const response = await axios.patch(`categories/${categoryId}`, categoryData, {
                withCredentials: true,
                headers
            });

            // Yanıt kontrolü ve normalizasyonu
            if (response.data && (response.data.status === "error" || response.data.success === false)) {
                return thunkAPI.rejectWithValue(response.data.message || "Güncelleme başarısız oldu");
            }

            // Backend bazen güncellenen nesneyi doğrudan data içinde, bazen data.data içinde dönebilir
            const result = response.data.data || (response.data._id ? response.data : null);

            if (!result) {
                // Eğer backend güncellenmiş nesneyi dönmüyorsa, thunk'ın başarılı sayılması için ID'yi dönelim
                return { _id: categoryId, ...categoryData };
            }

            return result;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async (categoryId, thunkAPI) => {
        try {
            const response = await axios.delete(`categories/${categoryId}`, {
                withCredentials: true
            });

            // Bazı durumlarda backend 200 dönüp body'de hata mesajı gönderebilir
            if (response.data && (response.data.status === "error" || response.data.success === false)) {
                return thunkAPI.rejectWithValue(response.data.message || "Silme işlemi başarısız oldu");
            }

            return categoryId;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
