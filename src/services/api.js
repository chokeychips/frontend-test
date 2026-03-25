import axios from "axios";

const api = axios.create({
  baseURL: "http://110.239.67.31:9110",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(
      "[API] Authorization header added to request:",
      config.method.toUpperCase(),
      config.url,
    );
  } else {
    console.log(
      "[API] No token found - request will be sent without authorization:",
      config.method.toUpperCase(),
      config.url,
    );
  }

  // Log request body if POST/PUT
  if (config.data) {
    console.log("[API] Request body:", JSON.stringify(config.data, null, 2));
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("[API] Response received:", response.status, response.config.url);
    console.log("[API] Full response data:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error("[API] Error response:", error.response?.status, error.response?.data?.message);
    console.error("[API] Full error data:", JSON.stringify(error.response?.data, null, 2));

    // Handle 401 Unauthorized - Session expired
    if (error.response?.status === 401) {
      console.error("[API] 401 Unauthorized - Session expired");

      // Clear token and redirect to login
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;
