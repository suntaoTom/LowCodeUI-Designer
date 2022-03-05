import Vue, { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
// import "@/utils/permission";

(<any>window).paramList = {};
createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount("#app");
