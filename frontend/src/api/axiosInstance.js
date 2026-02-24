import axios from "axios";

// ✅ Change this URL depending on environment
const BASE_URL =
    "https://vyoobam-bix-backend.onrender.com/api"
 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor - Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - Handle 401 (Token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;















// COMMENTED DUE TO SALESAGE

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Request interceptor - Automatically attach token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ✅ Response interceptor - Handle 401 errors (token expired/invalid)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // ✅ Token expired or invalid - clear auth and redirect to login
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;