import { get, post } from "@/utils/fetch";
import title from "./main";

export function fetch(data: any) {
  return post(`${title}/getAppInfo/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function appCreate(data: any) {
  return post(`${title}/appCreate/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function getPageInfo(data: any) {
  return post(`${title}/getPageInfo/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function pageCreate(data: any) {
  return post(`${title}/pageCreate/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function appDelete(data: any) {
  return post(`${title}/appDelete/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function pageDelete(data: any) {
  return post(`${title}/pageDelete/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function appRename(data: any) {
  return post(`${title}/appRename`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function pageRename(data: any) {
  return post(`${title}/pageRename`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}
