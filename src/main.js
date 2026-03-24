import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth check on app load
const authStore = useAuthStore();

app.mount("#app");

// Check token after app is mounted
router.isReady().then(async () => {
  const token = localStorage.getItem("token");

  if (token) {
    authStore.isAuthenticated = true;
    // Optionally validate token in background without blocking
    authStore
      .checkToken()
      .catch((err) => console.warn("[APP] Background token validation failed:", err.message));
  } else {
    console.log("[APP] No token found");
  }
});
