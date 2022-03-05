import { get, post } from "@/utils/fetch";
import title from "./main";

export function fetch(data: any) {
  return post(`${title}/getProjects/`, data);
  //return post(`http://192.168.20.225:8007/login/`, data);
}
