import Vue from "vue";
import routers from "@/router";
import store from "@/store";
import LoginStore from "@/store/modules/login";

import { setDocumentTitle, domTitle } from "@/utils/domUtil";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import App from "@/App.vue";
let router: any = routers;
const whiteList = ["login", "design"]; // no redirect whitelist
router.beforeEach((to: any, from: any, next: any) => {
  console.log(22, App.router, to, from);
  to.meta &&
    typeof to.meta.title !== "undefined" &&
    setDocumentTitle(`${to.meta.title} - ${domTitle}`);
  //   let a: any = Vue.ls.get(ACCESS_TOKEN);
  if (to.path) {
    /* has token */
    if (to.path === "/") {
      console.log(33, to);
      next({ path: "/login" });
    } else {
      let a: any = LoginStore.personInfo;
      console.log(111, a.status);
      if (to.path == "/login") {
        next();
      } else {
        if (a.status) {
          next();
        } else {
          console.log(88, a.status);
          next({ path: "/login" });
        }
      }
      //   if (store.getters.roles.length === 0) {
      //     store
      //       .dispatch("GetInfo")
      //       .then(res => {
      //         const roles = res[0] && eval("(" + res[0].role + ")");
      //         roles.permissionList = roles.permissions.map(
      //           (permission: { permissionId: any }) => {
      //             return permission.permissionId;
      //           }
      //         );
      //         store.dispatch("GenerateRoutes", { roles }).then(() => {
      //           // 根据roles权限生成可访问的路由表
      //           // 动态添加可访问路由表
      //           router.addRoutes(store.getters.addRouters);
      //           const redirect = decodeURIComponent(
      //             from.query.redirect || to.path
      //           );
      //           if (to.path === redirect) {
      //             // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //             next({ ...to, replace: true });
      //           } else {
      //             // 跳转到目的路由
      //             next({ path: redirect });
      //           }
      //         });
      //       })
      //       .catch(() => {
      //         console.error({
      //           message: "错误",
      //           description: "请求用户信息失败，请重试"
      //         });
      //         store.dispatch("Logout").then(() => {
      //           next({ path: "/login", query: { redirect: to.fullPath } });
      //         });
      //       });
      //   } else {
      //     next();
      //   }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
  }
  App.router = to.path;
});

router.afterEach(() => {});
