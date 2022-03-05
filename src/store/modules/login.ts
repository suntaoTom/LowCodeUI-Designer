import { fetch } from "@/service/login";
import storage from "@/utils/storage";
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
  name: "LoginStore",
  namespaced: true
})
class LoginStore extends VuexModule {
  public personInfo = storage.get("PERSON_INFO");

  @Mutation
  private gotOtherData(data: any): void {
    this.personInfo = data;
    storage.set("PERSON_INFO", data);
    console.log(888, data);
  }

  @Action({ commit: "gotOtherData" })
  public async Login(data: any) {
    const datajson: any = await fetch(data);
    storage.set("ACCESS_TOKEN", datajson.token);
    return datajson; // 也可以写成this.gotOtherData(datajson);效果一样,这种不需要配合装饰器一起使用
  }
}
export default getModule(LoginStore);
