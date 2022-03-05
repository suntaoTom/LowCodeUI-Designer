import {
  fetch,
  appCreate,
  getPageInfo,
  pageCreate,
  appDelete,
  pageDelete,
  appRename,
  pageRename
} from "@/service/application";
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
  name: "ApplicationStore",
  namespaced: true
})
class ApplicationStore extends VuexModule {
  public appInfo = "";
  public pageInfo = "";

  @Mutation
  private setAppData(data: any): void {
    this.appInfo = data.msg ? data.content : alert(data);
    console.log(888, data);
  }

  @Mutation
  private setPageData(data: any): void {
    this.pageInfo = data.msg ? data.content : alert(data);
    console.log(888, data);
  }

  @Action({ commit: "" })
  public appCreate(data: any) {
    const datajson = appCreate(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public pageCreate(data: any) {
    const datajson = pageCreate(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "setAppData" })
  public getAppInfo(data: any) {
    const datajson = fetch(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "setPageData" })
  public getPageInfo(data: any) {
    const datajson = getPageInfo(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public appDelete(data: any) {
    const datajson = appDelete(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public pageDelete(data: any) {
    const datajson = pageDelete(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }

  @Action({ commit: "" })
  public appRename(data: any) {
    const datajson = appRename(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
  @Action({ commit: "" })
  public pageRename(data: any) {
    const datajson = pageRename(data);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
}
export default getModule(ApplicationStore);
