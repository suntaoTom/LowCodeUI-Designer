import { get, post } from "@/utils/fetch";
import title,{serverModuleApi} from "./main";

export function getProjectData(data: any) {
  return post(`${title}/getDevProjectData`, data);
}

export function getComponentInfoFetch(data: any) {
  return post(`${serverModuleApi}/updateAnswer`, data);
}
