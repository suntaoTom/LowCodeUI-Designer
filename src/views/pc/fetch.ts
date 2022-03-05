/**
* service组件名称
*@desc 封装了axios的get和post方法
*@author Tommy
*@date 2018.8.9
*@param  - 参数说明
*@example 调用示例
在 vuex 页面action中引入:
import {get} from '@/service/fetch.js'
     getUser({commit}){
         get(xxx).then(data=>{
           commit('changeUser',data)
         })
     }
  如有特殊需要可以新引入 axios 或者在 fetch 上在进行特殊的添加
*/
import { main } from "./axios";
(window as any).axios = main();
let axios = (window as any).axios;
const get = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then(function(response: any) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
const del = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, { params: params })
      .then(function(response: { data: unknown }) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
const head = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .head(url, { params: params })
      .then(function(response: { data: unknown }) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
const post = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(function(response: { data: unknown }) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
const put = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(function(response: { data: unknown }) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
const patch = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, params)
      .then(function(response: { data: unknown }) {
        resolve(response.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
let a = { get, del, head, post, put, patch };
export default a;
