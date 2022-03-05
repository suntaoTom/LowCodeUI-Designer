import {
  fetch,
  getAssemblyFetch,
  getComponentInfoFetch,
  addElementName,
  setPageRule,
  setPersonRule,
  getPersonRule,
  getVersion,
  setDeploy,
  getVersionTar,
  setMerge,
  getVersionEnv,
  getOnlineVer
} from "@/service/design";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";

import store from "@/store/index";
import indexedDB from "../indexedDB";
import router from "@/router";

export interface DesignState {
  activeElementUUID: number | null;
  activeElementPosition: number | null;
}

@Module({
  dynamic: true,
  store: store,
  name: "design",
  namespaced: true
})
class DesignStore extends VuexModule implements DesignState {
  public activeElementUUID = null;
  public activeElementPosition = null;
  public projectData: any | null = {
    activeElement: {},
    commonStyle: {},
    name: "",
    uuid: (window as any).uuid,
    auto: "",
    pageW: {},
    pageH: {},
    lineList: [],
    elements: []
  };
  public activePageUUID: any | null = "";
  public assemblyData: any = null;
  public personRules: any = {};
  public pushVersion: any = [];
  public pushTarVersion: any = "";

  public deployVersion: any = [];

  public onlineVersion: any = "";
  //   //getter
  // get msaCount(): any | null {
  //   return this.projectData;
  // }
  // @Mutation
  // private getComponentInfo(data: null): void {
  //   this.assemblyData = data;
  //   console.log(67677, data);
  // }

  jsonFn(a: any) {
    return JSON.parse(a);
  }
  @Mutation
  private getAssembly(data: null): void {
    this.assemblyData = data;
    console.log(67677, data);
  }

  @Mutation
  private getOtherData(data: null): void {
    this.activeElementUUID = data;
    console.log(779997, data);
  }
  @Mutation
  private getProjectData(data: any): void {
    // this.projectData = data;
    if (data.msg && data.status === 1 && data.content[0].rule !== null) {
      this.projectData = JSON.parse(data.content[0].rule);
    } else {
      this.projectData = {
        activeElement: {},
        commonStyle: {},
        name: "",
        uuid: (window as any).uuid,
        auto: "",
        pageW: {},
        pageH: {},
        lineList: [],
        elements: []
      };
    }
    console.log(99, data);
  }
  @Mutation
  private getElementPosition(data: null): void {
    this.activeElementPosition = data;
    console.log(777, data);
  }

  @Mutation
  private setActivePageUUID_userid(data: any): void {
    this.activePageUUID = data.uuid;
    console.log(777, data);
  }

  @Mutation
  private setPersonRules(data: any): void {
    this.personRules = data;
    console.log(777, data);
  }

  @Mutation
  private setSourcevision(data: any): void {
    this.pushVersion = data.content;
    console.log(777, data);
  }

  @Mutation
  private setEnvision(data: any): void {
    this.deployVersion = data.content;
    console.log(777, data);
  }

  @Mutation
  private setTarvision(data: any): void {
    this.pushTarVersion =
      data.content[0].max === null ? "" : data.content[0].max;
    console.log(777, data);
  }

  @Mutation
  private setOnlineVer(data: any): void {
    this.onlineVersion = data.content[0].version;
    console.log(777, data);
  }

  @Action({ commit: "getElementPosition" })
  public setActiveElementPosition(data: number | null) {
    return data;
  }

  @Action({ commit: "getOtherData" })
  public setActiveElementUUID(data: number | null) {
    return data;
  }

  @Action({ commit: "getProjectData" })
  public async setProjectData(data: any) {
    const datajson: any = await fetch(data);
    console.log(666999, datajson);
    return datajson;
    // 如果不存在页面返回-1
  }
  @Action({ commit: "getAssembly" })
  public async setAssembly(dataStore: any) {
    const data: any = await getAssemblyFetch({
      user_id: dataStore.user_id,
      element_type: dataStore.element_type
    });

    let b = {};
    if (parseInt(dataStore.element_type) === 3) {
      let c = data.content[0].person_rules;
      if (c !== null) {
        b = JSON.parse(c);
      }
    } else {
      b = data.content;
    }
    dataStore.thisObj.assembly = Object.keys(b).length > 0 ? b : [];
    return b;
  }

  @Action({ commit: "" })
  public async setPersonRule(dataStore: any) {
    const data: any = await setPersonRule({
      rule: dataStore.rule,
      user_id: dataStore.user_id
    });
    return data;
  }

  @Action({ commit: "setPersonRules" })
  public async getPersonRule(dataStore: any) {
    const data: any = await getPersonRule({
      user_id: dataStore.user_id
    });
    let a = {};
    if (
      data.content[0].person_rules !== null &&
      data.content[0].person_rules !== ""
    ) {
      a = data.content[0].person_rules;
    }
    return a;
  }

  @Action({ commit: "" })
  public setStyleData(dataStore: any) {
    return dataStore;
  }
  @Action({ commit: "" })
  public async setComponentInfo(dataStore: any) {
    const data: any = await getComponentInfoFetch(dataStore);
    return data;
  }
  @Action({ commit: "" })
  public async setElementName(dataStore: any) {
    const data: any = await addElementName(dataStore);
    return data;
  }

  @Action({ commit: "" })
  public async setPageRule(dataStore: any) {
    const data: any = await setPageRule(dataStore);
    data.msg ? alert("保存成功") : alert(data);
    return data;
  }

  @Action({ commit: "setActivePageUUID_userid" })
  public setActivePageUUID(dataStore: any) {
    return dataStore;
  }

  @Action({ commit: "setSourcevision" })
  public async getVersion(dataStore: any) {
    const data: any = await getVersion(dataStore);
    return data;
  }

  @Action({ commit: "setEnvision" })
  public async getVersionEnv(dataStore: any) {
    const data: any = await getVersionEnv(dataStore);
    return data;
  }

  @Action({ commit: "setTarvision" })
  public async getVersionTar(dataStore: any) {
    const data: any = await getVersionTar(dataStore);
    return data;
  }

  @Action({ commit: "" })
  public async setMerge(dataStore: any) {
    const data: any = await setMerge(dataStore);
    data.msg ? alert("新版本创建成功！") : alert(data);
    return data;
  }

  @Action({ commit: "" })
  public async setDeploy(dataStore: any) {
    const data: any = await setDeploy(dataStore);
    data.msg ? alert("部署成功！") : alert(data);
    return data;
  }

  @Action({ commit: "setOnlineVer" })
  public async getOnlineVer(dataStore: any) {
    const data: any = await getOnlineVer(dataStore);
    return data;
  }
}
export default getModule(DesignStore);
