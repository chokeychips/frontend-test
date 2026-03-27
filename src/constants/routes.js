// Route constants to avoid hardcoding paths
export const ROUTE_PATHS = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  USERS: "users",
  USERS_CREATE: "users/create",
  USERS_EDIT: "users/edit/:id",
  MYTASK_MAINTENANCE: "mytask-maintenance",
  APPROVAL: "approval",
  MAINTENANCE: "maintenance",
};

// Component lazy loading to avoid hardcoding imports
export const COMPONENTS = {
  Login: () => import("@/views/LoginView.vue"),
  Dashboard: () => import("@/views/DashboardView.vue"),
  User: () => import("@/views/menu/UserView.vue"),
  UserCreate: () => import("@/views/menu/UserCreateView.vue"),
  UserEdit: () => import("@/views/menu/UserEditView.vue"),
  MyTask: () => import("@/views/menu/MyTaskView.vue"),
  Approval: () => import("@/views/menu/ApprovalView.vue"),
  Maintenance: () => import("@/views/menu/MaintenanceView.vue"),
};
