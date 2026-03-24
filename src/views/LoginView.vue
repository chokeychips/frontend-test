<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const isValid = await authStore.checkToken();

    if (isValid && authStore.isAuthenticated) {
      router.push("/dashboard");
    } else {
      localStorage.removeItem("token");
    }
  }
});

const validateForm = () => {
  errorMessage.value = "";

  if (!username.value.trim()) {
    errorMessage.value = "⚠️ Username wajib diisi";
    return false;
  }

  if (!password.value.trim()) {
    errorMessage.value = "⚠️ Password wajib diisi";
    return false;
  }

  return true;
};

const login = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    let loginResponse = await api.post("/api/auth/login", {
      username: username.value,
      password: password.value,
      fcm: "",
    });

    // Check if response status is false (even if HTTP 200)
    if (loginResponse.data?.status === false) {
      if (loginResponse.data?.message?.toLowerCase().includes("user sudah login")) {
        errorMessage.value = "❗Sesi aktif terdeteksi; mencoba reset sesi dan login ulang...";

        try {
          await api.post("/api/auth/logout");
          authStore.logout();
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");

          const retry = await api.post("/api/auth/login", {
            username: username.value,
            password: password.value,
            fcm: "",
          });

          if (retry.data?.status === true) {
            loginResponse = retry;
          } else {
            errorMessage.value = retry.data?.message || "Login gagal setelah retry session reset";
            return;
          }
        } catch (retryErr) {
          errorMessage.value = "❌ Tidak dapat menyelesaikan login karena sesi lama masih aktif";
          return;
        }
      } else {
        errorMessage.value = loginResponse.data?.message || "Login ditolak oleh server";
        return;
      }
    }

    let token =
      loginResponse.data?.data?.token ||
      loginResponse.data?.data?.[0]?.token ||
      loginResponse.headers?.authorization ||
      loginResponse.headers?.["x-auth-token"];

    if (!token) {
      throw new Error("Token tidak ditemukan di response");
    }

    if (token && token.startsWith?.("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    localStorage.setItem("token", token);

    // Update auth store
    authStore.isAuthenticated = true;

    // Redirect to dashboard - router guard will validate token
    await router.push("/dashboard");
  } catch (err) {
    // Determine error message
    if (err.response?.status === 401) {
      errorMessage.value = "❌ Username atau password salah";
    } else if (err.response?.status === 400) {
      errorMessage.value = "❌ Data login tidak valid";
    } else if (err.message.includes("Token validation failed")) {
      errorMessage.value = "❌ Verifikasi token gagal";
    } else if (err.message.includes("Token tidak ditemukan")) {
      errorMessage.value = "⚠️ Periksa respons server (token tidak ditemukan)";
    } else {
      errorMessage.value = err.response?.data?.message || "❌ Login gagal. Coba lagi";
    }
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    login();
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-2xl font-bold text-center mb-6">SKYWORX LOGIN</h1>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ errorMessage }}
      </div>

      <!-- Username Input -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Masukkan username"
          @keypress="handleKeyPress"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          :disabled="isLoading"
        />
      </div>

      <!-- Password Input -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Masukkan password"
          @keypress="handleKeyPress"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          :disabled="isLoading"
        />
      </div>

      <!-- Login Button -->
      <button
        @click="login"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
      >
        {{ isLoading ? "Menunggu..." : "Login" }}
      </button>
    </div>
  </div>
</template>
