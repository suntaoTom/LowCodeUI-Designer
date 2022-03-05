import { get, post } from "@/utils/fetch";
import title,{serverModuleApi} from "@/service/main";
import compData from "./compData.json";
import {fileDisplay} from './fy'

export function fetch(data: any) {
  return post(`${title}/getPageDesign`, data);
}

export function getAssemblyFetch(data: any) {
  if (parseInt(data.element_type) === 3) {
    return getPersonRule(data);
  } else {
    return compData
    //return get(`${serverModuleApi}/getList`, data);
  }
}

export async function getComponentInfoFetch(data: any) {
  return await fileDisplay(data);
  //return post(`${serverModuleApi}/updateAnswer`, data);
}

export function addElementName(data: any) {
  return post(`${serverModuleApi}/addElementName`, data);
}

export function setPageRule(data: any) {
  return post(`${title}/setPageRule/`, data);
}

export function setPersonRule(data: any) {
  return post(`${title}/setWorkRule/`, data);
}

export function getPersonRule(data: any) {
  return post(`${title}/getWorkRule/`, data);
}

export function getVersion(data: any) {
  return post(`${title}/getVersion`, data);
}

export function getVersionTar(data: any) {
  return post(`${title}/getVersionTar`, data);
}

export function setDeploy(data: any) {
  return post(`${title}/setDeploy`, data);
}

export function setMerge(data: any) {
  return post(`${title}/setMerge`, data);
}

export function getVersionEnv(data: any) {
  return post(`${title}/getVersion`, data);
}

export function getOnlineVer(data: any) {
  return post(`${title}/getOnlineVer`, data);
}
