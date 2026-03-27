import api from "./api";

export const login = async (username, password, fcm = "") => {
  const response = await api.post("/api/auth/login", {
    username,
    password,
    fcm,
  });
  return response;
};

export const logout = async (payload = {}) => {
  const response = await api.post("/api/auth/logout", payload);
  return response;
};

export const checkToken = async () => {
  const response = await api.post("/api/auth/refresh");
  return response;
};

export const getProfile = async () => {
  const response = await api.get("/api/auth/my/profile");
  return response;
};
