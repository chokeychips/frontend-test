<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

// 👉 import icon
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckCircle,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const openMenu = ref(null);

onMounted(() => {
  auth.getProfile();
});

const toggleMenu = (menuId) => {
  openMenu.value = openMenu.value === menuId ? null : menuId;
};

const isActive = (path) => route.path === path;

const goTo = (path) => {
  let fullPath = "/dashboard";

  if (path) {
    fullPath = path.startsWith("/dashboard")
      ? path
      : `/dashboard${path.startsWith("/") ? path : "/" + path}`;

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

const logout = async () => {
  if (!window.confirm("Apakah Anda yakin ingin logout?")) return;

  await auth.logoutFromServer();
  router.replace("/");
  window.location.reload();
};
const iconMap = {
  users: Users,
  approval: CheckCircle,
  maintenance: Settings,
  mytask: ClipboardList,
  dashboard: LayoutDashboard,
};

const renderIcon = (icon) => {
  if (!icon) return LayoutDashboard;
  const key = icon.toString().toLowerCase();
  if (iconMap[key]) return iconMap[key];

  // map common keywords if API returns generic names
  if (key.includes("user")) return Users;
  if (key.includes("approval") || key.includes("check")) return CheckCircle;
  if (key.includes("maintenance") || key.includes("setting")) return Settings;
  if (key.includes("task")) return ClipboardList;

  return LayoutDashboard;
};
</script>

<template>
  <div class="w-64 bg-gray-900 text-gray-200 h-screen p-4 flex flex-col">
    <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
      <LayoutDashboard class="w-5 h-5" />
      Dashboard
    </h2>

    <div class="flex-1 overflow-auto space-y-2">
      <div v-if="auth.user?.menu">
        <div v-for="menu in auth.user.menu" :key="menu.menuId">
          <!-- PARENT -->
          <div
            class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition"
            @click="toggleMenu(menu.menuId)"
          >
            <div class="flex items-center gap-3">
              <component :is="renderIcon(menu.icon || menu.key)" class="w-5 h-5" />
              <span class="font-medium">{{ menu.title }}</span>
            </div>

            <ChevronRight
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-90': openMenu === menu.menuId }"
            />
          </div>

          <!-- CHILD -->
          <transition name="fade">
            <div v-if="openMenu === menu.menuId" class="ml-8 mt-1 space-y-1">
              <div
                v-for="child in menu.children"
                :key="child.menuId"
                @click="goTo(child.route)"
                class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition"
                :class="
                  isActive(child.route)
                    ? 'bg-yellow-500 text-black font-semibold'
                    : 'hover:bg-gray-800'
                "
              >
                <component :is="renderIcon(child.icon || child.key)" class="w-6 h-6" />
                <span>{{ child.title }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div v-else>Loading menu...</div>
    </div>

    <!-- LOGOUT -->
    <button
      @click="logout"
      class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg mt-4 transition"
    >
      <LogOut class="w-4 h-4" />
      Logout
    </button>
  </div>
</template>
