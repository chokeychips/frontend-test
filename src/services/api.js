import axios from "axios";

const api = axios.create({
  baseURL: "http://110.239.67.31:9110",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Session expired
    if (error.response?.status === 401) {
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
