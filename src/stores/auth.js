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
        // Jangan lempar error di UI, profile mungkin opsional
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
        // Continue local logout even if server request gagal
      } finally {
        this.logout();
      }
    },
  },
});
