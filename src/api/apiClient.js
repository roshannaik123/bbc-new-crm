import BASE_URL from "@/config/base-url";
import { store, persistor } from "@/store/store";
import { logout } from "@/store/auth/authSlice";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      store.dispatch(logout());
      localStorage.clear();
      persistor.purge();
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
