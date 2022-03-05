import { createStore } from "vuex";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import { fetch } from "@/service/login";

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});
@Module({
  dynamic: true,
  store: store,
  name: "IndexStore",
  namespaced: true
})
class IndexStore extends VuexModule {
  public count = 0;
  public msage = "";
  public routerName = "";
  @Mutation
  private gotOtherData(data: any) {
    this.count++;
    this.msage = data.msg;
    console.log(555, this, data);
  }
  @Action({ commit: "gotOtherData" })
  public actionA(data: any) {
    const datajson = fetch(data);
    console.log(3333, datajson);
    return datajson;
  }
}

export const IdStore = getModule(IndexStore);
export default store;
