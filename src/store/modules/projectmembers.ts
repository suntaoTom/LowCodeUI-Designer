import {
  fetch,
  addRole,
  getRole,
  delRole,
  setPermise
} from "@/service/projectmembers";
import Vue from "vue";
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
  name: "ProjectMembersStore",
  namespaced: true
})
class ProjectMembersStore extends VuexModule {
  public userInfo = "";
  public userRole = [];

  @Mutation
  private gotOtherData(data: any): void {
    this.userInfo = data.content;
    console.log(888, data);
  }

  @Mutation
  private setRole(data: any): void {
    this.userRole = data.content;
    console.log(888, data);
  }

  @Action({ commit: "gotOtherData" })
  public async Search(data: any) {
    const datajson: any = await fetch(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
  @Action({ commit: "" })
  public async addRole(data: any) {
    const datajson: any = await addRole(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "setRole" })
  public async getRole(data: any) {
    const datajson: any = await getRole(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public async delRole(data: any) {
    const datajson: any = await delRole(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public async setPermise(data: any) {
    const datajson: any = await setPermise(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
}
export default getModule(ProjectMembersStore);
