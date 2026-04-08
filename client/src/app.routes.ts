import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import EmptyLayout from "./layouts/EmptyLayout.vue";
import HomeView from "./views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: EmptyLayout,
    children: [
      {
        path: "",
        component: HomeView,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
