<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import "@/assets/scrollbar.css";

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  auth.getProfile();
});

const goTo = (path) => {
  let fullPath = "/dashboard";

  if (path) {
    if (path.startsWith("/dashboard")) {
      fullPath = path;
    } else {
      fullPath = `/dashboard${path.startsWith("/") ? path : "/" + path}`;
    }

    // Hanya izinkan 3 menu utama, sisanya ke maintenance
    const allowed = [
      "/dashboard/users",
      "/dashboard/mytask-maintenance",
      "/dashboard/approval",
      "/dashboard/maintenance",
    ];
    if (!allowed.includes(fullPath)) {
      fullPath = "/dashboard/maintenance";
    }
  }

  router.push(fullPath);
};

const logout = () => {
  auth.logoutFromServer();
  router.push("/");
};
</script>

<template>
  <div class="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
    <h2 class="text-xl mb-4">Dashboard</h2>

    <div class="flex-1 overflow-auto sidebar-menu">
      <div v-if="auth.user?.menu">
        <div v-for="menu in auth.user.menu" :key="menu.menuId">
          <p class="font-bold mb-2">{{ menu.title }}</p>
          <div v-if="menu.children">
            <p
              v-for="child in menu.children"
              :key="child.menuId"
              class="ml-4 cursor-pointer hover:text-yellow-300"
              @click="goTo(child.route)"
            >
              {{ child.title }}
            </p>
          </div>

          <div v-else>
            <p class="ml-2 cursor-pointer hover:text-yellow-300" @click="goTo(menu.route)">Go</p>
          </div>
        </div>
      </div>

      <div v-else>Loading menu...</div>
    </div>

    <button
      @click="logout"
      class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
    >
      Logout
    </button>
  </div>
</template>
