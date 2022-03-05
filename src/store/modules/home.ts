import { fetch } from "@/service/home";
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
  name: "home",
  namespaced: true
})
class HomeStore extends VuexModule {
  public projectsInfo = "";

  @Mutation
  private setProjectData(data: any): void {
    this.projectsInfo = data.msg ? data.content : alert(data);
    console.log(888, data);
  }

  @Action({ commit: "setProjectData" })
  public async getProjects(data: any) {
    const datajson = await fetch(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
}
export default getModule(HomeStore);
