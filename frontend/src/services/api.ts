import axios from "axios";

// Create Axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8080", // Backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
