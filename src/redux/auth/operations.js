import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

// --- 401 Auto-Refresh Interceptor ---
let isRefreshingToken = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 geldiğinde ve daha önce retry edilmemişse refresh dene
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      if (isRefreshingToken) {
        // Zaten refresh çalışıyorsa kuyruğa ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        const response = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken, token } = response.data.data;
        const newToken = accessToken || token;

        if (newToken) {
          setAuthHeader(newToken);
          processQueue(null, newToken);

          // Orijinal isteği yeni token ile tekrarla
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthHeader();
        return Promise.reject(refreshError);
      } finally {
        isRefreshingToken = false;
      }
    }

    return Promise.reject(error);
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, surname, email, password }, thunkAPI) => {
    try {
      const response = await axios.post("/auth/register", {
        name,
        surname,
        email,
        password,
      });

      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // Backend dönerken hem user hem token döner (accessToken veya token ismiyle gelebilir)
      const { user, accessToken, token } = response.data.data;
      const finalToken = accessToken || token;

      if (!user) {
        return thunkAPI.rejectWithValue("User not found in response");
      }

      if (finalToken) {
        setAuthHeader(finalToken);
      }

      // Sadece user bilgisini sakla
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token: finalToken };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      clearAuthHeader();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// REFRESH
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    // Önce persist'ten gelen token'ı kontrol et
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    // Eğer persisted token varsa, önce onu set et
    if (persistedToken) {
      setAuthHeader(persistedToken);
    }

    try {
      // POST request, cookie otomatik gönderilecek (withCredentials)
      const response = await axios.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );

      const { user, accessToken, token } = response.data.data;
      const finalToken = accessToken || token;

      if (!finalToken) throw new Error("Access token not found from refresh");
      if (!user) throw new Error("User data not found from refresh");

      // access token'ı header'a set et
      setAuthHeader(finalToken);

      // localStorage'ı güncelle
      localStorage.setItem("user", JSON.stringify(user));
      return { user, token: finalToken };
    } catch (error) {
      // Refresh başarısız ama persisted token varsa, onu kullanmaya devam et
      // (cross-origin cookie sorunu olabilir)
      if (persistedToken) {
        setAuthHeader(persistedToken);
        // fulfilled olarak dönmüyoruz ama reject de etmiyoruz —
        // mevcut state'i korumak için fulfilled olarak dön
        const persistedUser = state.auth.user;
        return { user: persistedUser, token: persistedToken };
      }

      clearAuthHeader();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//password reset mail
export const sendPasswordResetEmail = createAsyncThunk(
  "/auth/send-reset-email",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/send-reset-email",
        { email },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Bir hata oluştu";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
//password reset
export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/auth/reset-password",
        { token, password: newPassword },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// user update
export const updateUser = createAsyncThunk(
  "auth/update-user",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.patch(`/auth/update-user/${id}`, data, {
        withCredentials: true,
      });

      const updatedUser = response.data.data;

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : {};

      const newUser = { ...user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUser));

      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
