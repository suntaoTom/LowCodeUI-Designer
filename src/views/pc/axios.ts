/**
 * 管理端axios插件
 */
import httpAxios from "axios";

(window as any).http = httpAxios;
export function main() {
  let axios = (window as any).http;
  // 创建axios实例
  const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000
  });
  // request拦截器
  service.interceptors.request.use(
    (config: any) => {
      return config;
    },
    (error: any) => {
      Promise.reject(error);
    }
  );

  // 响应拦截器
  service.interceptors.response.use(
    (res: any) => {
      return res;
    },
    (error: string) => {
      console.log("err" + error);
      return Promise.reject(error);
    }
  );
  return service;
}
