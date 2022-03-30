import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFind.vue"),
  },
];

export default routes;
