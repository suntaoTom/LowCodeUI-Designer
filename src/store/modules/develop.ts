import { getProjectData, getComponentInfoFetch } from "@/service/develop";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";

import store from "@/store/index";

@Module({
  dynamic: true,
  store: store,
  name: "developStore",
  namespaced: true
})
class developStore extends VuexModule {
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
  @Action({ commit: "" })
  public async setComponentInfo(dataStore: any) {
    const data: any = await getComponentInfoFetch(dataStore);
    return data;
  }
  @Action({ commit: "getProjectData" })
  public async setProjectData(data: any) {
    const datajson: any = await getProjectData(data);
    console.log(666999, datajson);
    return datajson;
    // 如果不存在页面返回-1
  }
}
export default getModule(developStore);
