import { defineStore } from "pinia";
import { login, logout, checkToken, getProfile } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    async checkToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.isAuthenticated = false;
        this.user = null;
        return false;
      }

      try {
        const res = await checkToken();

        this.isAuthenticated = true;

        // Load user profile if token is valid
        await this.getProfile();
        return true;
      } catch (err) {
        console.error("[AUTH] Token validation failed:", err.message);

        localStorage.removeItem("token");
        this.isAuthenticated = false;
        this.user = null;
        return false;
      }
    },

    async getProfile() {
      try {
        const res = await getProfile();

        this.user = res.data.data[0];
      } catch (err) {
        console.error("[AUTH] Failed to fetch profile:", err.message);
        console.error("[AUTH] Profile fetch error status:", err.response?.status);
        // Don't throw - just log, profile is optional after token validation
      }
    },

    logout() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      this.user = null;
      this.isAuthenticated = false;
    },

    async logoutFromServer() {
      try {
        const id = this.user?.id || this.user?.userId || this.user?.idUser;
        const username = this.user?.username || this.user?.name || "";

        const payload = {};
        if (id !== undefined && id !== null) payload.id = id;
        if (username) payload.username = username;

        await logout(payload);
      } catch (err) {
        console.error("[AUTH] Server logout failed:", err.message);
        // Continue local logout even if server request gagal
      } finally {
        this.logout();
      }
    },
  },
});
