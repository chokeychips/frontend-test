import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ROUTE_PATHS, COMPONENTS } from "@/constants/routes";

const routes = [
  { path: ROUTE_PATHS.LOGIN, component: COMPONENTS.Login },

  {
    path: ROUTE_PATHS.DASHBOARD,
    component: COMPONENTS.Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: ROUTE_PATHS.USERS, component: COMPONENTS.User, meta: { requiresAuth: true } },
      {
        path: ROUTE_PATHS.USERS_CREATE,
        component: COMPONENTS.UserCreate,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTE_PATHS.USERS_EDIT,
        component: COMPONENTS.UserEdit,
        meta: { requiresAuth: true },
      },
      {
        path: ROUTE_PATHS.MYTASK_MAINTENANCE,
        component: COMPONENTS.MyTask,
        meta: { requiresAuth: true },
      },
      { path: ROUTE_PATHS.APPROVAL, component: COMPONENTS.Approval, meta: { requiresAuth: true } },
      {
        path: ROUTE_PATHS.MAINTENANCE,
        component: COMPONENTS.Maintenance,
        meta: { requiresAuth: true },
      },
      { path: ":pathMatch(.*)*", redirect: `${ROUTE_PATHS.DASHBOARD}/${ROUTE_PATHS.MAINTENANCE}` },
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
  if (to.path === ROUTE_PATHS.LOGIN && authStore.isAuthenticated) {
    next(ROUTE_PATHS.DASHBOARD);
    return;
  }

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      next(ROUTE_PATHS.LOGIN);
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
