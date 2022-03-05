import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";
import Design from "@/views/Design.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "/",
    component: Design,
    meta: { hidden: true },
    children: []
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/pc/index.vue")
  }
];

const router: any = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
