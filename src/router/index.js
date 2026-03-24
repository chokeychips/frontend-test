import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Login from "@/views/LoginView.vue";
import Dashboard from "@/views/DashboardView.vue";
import User from "@/views/menu/UserView.vue";
import MyTask from "@/views/menu/MyTaskView.vue";
import Approval from "@/views/menu/ApprovalView.vue";
import Maintenance from "@/views/menu/MaintenanceView.vue";

const routes = [
  { path: "/", component: Login },

  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: "users", component: User, meta: { requiresAuth: true } },
      { path: "mytask-maintenance", component: MyTask, meta: { requiresAuth: true } },
      { path: "approval", component: Approval, meta: { requiresAuth: true } },
      { path: "maintenance", component: Maintenance, meta: { requiresAuth: true } },
      { path: ":pathMatch(.*)*", redirect: "/dashboard/maintenance" },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // If trying to access login page and already authenticated, redirect to dashboard
  if (to.path === "/" && authStore.isAuthenticated) {
    next("/dashboard");
    return;
  }

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/");
      return;
    }

    // Set authenticated state if token exists (avoid unnecessary API calls on refresh)
    if (!authStore.isAuthenticated) {
      authStore.isAuthenticated = true;
    }

    next();
  } else {
    next();
  }
});

export default router;
