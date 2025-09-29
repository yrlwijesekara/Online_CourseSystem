import axios from "axios";
import jwtDecode from "jwt-decode";

const api = axios.create({
    baseURL: "http://localhost:3001/api", // backend URL
    withCredentials: true, // if backend uses cookies
});

// Attach JWT dynamically if stored in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decoded = jwtDecode(token);

            // Check expiration
            if (decoded.exp * 1000 < Date.now()) {
                console.log("Token expired, redirecting to signin...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("currentPage");

                // redirect user to signin (force page reload)
                window.location.href = "/signin";
                return Promise.reject("Token expired");
            }

            config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("currentPage");
            window.location.href = "/signin";
            return Promise.reject("Invalid token");
        }
    }

    return config;
});

export default api;