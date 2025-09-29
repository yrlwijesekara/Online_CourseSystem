import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api", // backend URL
    withCredentials: true, // if backend uses cookies
});

// Optional: attach JWT dynamically if stored in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // or wherever you store JWT
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;