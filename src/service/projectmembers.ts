import { get, post } from "@/utils/fetch";
import title from "./main";

export function fetch(data: any) {
  return post(`${title}/searchUser`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function addRole(data: any) {
  return post(`${title}/addRole`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function getRole(data: any) {
  return post(`${title}/getRole`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function delRole(data: any) {
  return post(`${title}/delRole`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}

export function setPermise(data: any) {
  return post(`${title}/setPermise`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}
