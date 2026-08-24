import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://savora-railway-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle authentication and toast backend errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Extract and toast backend errors
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    if (!error._toasted) {
      toast.error(message);
      error._toasted = true;
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect only if the user is NOT already on login/register
      const publicAuthPages = ["/login", "/register"];

      if (!publicAuthPages.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
