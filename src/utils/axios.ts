/**
 * 管理端axios插件
 */
import axios from "axios";
// import { Notification, MessageBox, Message } from 'element-ui'
import storage from "@/utils/storage";
// import { getToken } from '@admin/utils/auth'
let clone: any;
export function jsmethod(qwe: any) {
  if (qwe) {
    clone = qwe;
  }
}

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
});
// request拦截器
service.interceptors.request.use(
  config => {
    if (window.location.hash !== "#/" && window.location.hash !== "#/login") {
      if (storage.get("ACCESS_TOKEN")) {
        config.headers["Authorization"] =
          "Bearer " + storage.get("ACCESS_TOKEN"); // 让每个请求携带自定义token 请根据实际情况自行修改
      }
    }
    return config;
  },
  error => {
    console.log(111, error);
    Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    const msg = res.data.msg;
    const status = res.data.status;
    if (!msg && status == 2) {
      if (window.location.hash.indexOf("#/design") != -1) {
        clone();
        if (confirm("登录状态已过期，已为您拷贝,是否重新登陆？") == true) {
          window.open((window as any).location.origin);
          return true;
        } else {
          return false;
        }
      } else {
        if (confirm("登录状态已过期,是否重新登陆？") == true) {
          (window as any).location.href = (window as any).location.origin;
          return true;
        } else {
          return false;
        }
      }

      //alert("登录状态已过期，离开设计台前，记得一定拷贝");

      //   MessageBox.confirm(
      //     "登录状态已过期，您可以继续留在该页面，或者重新登录",
      //     "系统提示",
      //     {
      //       confirmButtonText: "重新登录",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     }
      //   ).then(() => {
      //     store.dispatch("LogOut").then(() => {
      //       location.reload(); // 为了重新实例化vue-router对象 避免bug
      //     });
      //   });
    } else if (msg == true && status == 2) {
      //   Notification.error({
      //     title: res.data.msg
      //   });
      if (res.data.message) {
        alert(res.data.message);
      } else {
        alert("身份不符，无此权限");
      }

      // return Promise.reject("error");
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error);
    // Message({
    //   message: error.message,
    //   type: "error",
    //   duration: 5 * 1000
    // });
    return Promise.reject(error);
  }
);

export default service;
