<template>
  <div class="lcu_attribute">
    <button @click="viewClick" :disabled="pattern !== '1'">可视化</button>
    <button @click="diyClick" :disabled="pattern !== '0'">开发者</button>
    <div class="lcu_diy" v-if="pattern === '1'">
      <div class="lcu_attribute_header">
        <button @click="jsClick" :disabled="apiBll">api</button>
        <button @click="cssClick" :disabled="cssBll">css</button>
        <button @click="resetApi">重置</button>
      </div>
      <IdeComponent
        :value="apiValueTwo"
        @blur="blur($event)"
        @focus="focusPrice($event)"
        ref="textarea"
      />
    </div>
    <div class="lcu_diy" v-else>
      <ViewTemplate
        v-if="pattern !== ''"
        :activeElement="activeElement"
        :packageInfo="packageInfo"
        :data="viewData"
        v-on:resetStore="resetStore"
        @focusPriceClick="focusPriceClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import ViewTemplate from "./view-template/view-template.vue";
import IdeComponent from "./fn/code-ideJson.vue";
@Options({
  emits: {
    resetStore: null,
    resetApi: null,
    settingAPI: null,
    handleElementClick_jsCSS: null
  },
  components: { ViewTemplate, IdeComponent },
  props: {
    pattern: String,
    apiValue: String,
    thisAssemObj: Object,
    packageInfo: Object,
    activeElement: Object
  },
  watch: {
    packageInfo: [{ handler: "valueApies", immediate: false, deep: false }],
    pattern: [{ handler: "valueApies", immediate: false, deep: false }],
    apiValue: [{ handler: "apiValueApies", immediate: false, deep: false }]
  }
})
export default class IDE extends Vue {
  private thisAssemObj = JSON.parse(JSON.stringify(this.$props)).thisAssemObj;
  private packageInfo = JSON.parse(JSON.stringify(this.$props)).packageInfo;
  private activeElement = JSON.parse(JSON.stringify(this.$props)).activeElement;
  private pattern = JSON.parse(JSON.stringify(this.$props)).pattern;
  private apiBll = true;
  private cssBll = true;
  private viewData = {};
  private apiValueTwo = {};

  resetStore(key: any, position: any, dataStore: any) {
    this.$emit("resetStore", key, position, dataStore);
  }
  apiValueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      this.apiValueTwo = newV;
      setTimeout(() => {
        let b: any = this.$props;
        let a: any = this.$refs.textarea;
        if (a) {
          a.refresh(b.apiValue);
        }
      }, 0);
    }
  }
  valueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      this.viewData = {};
      setTimeout(() => {
        let a =
          this.activeElement.domUUID +
          "_" +
          this.packageInfo.name +
          "_" +
          this.packageInfo.version;
        let b: any = "";
        if ((window as any).paramList[a] !== undefined) {
          b = (window as any).paramList[a];
          let fn = new b.defaulType();
          for (const key of Reflect.ownKeys(fn)) {
            if (Array.isArray(fn[key])) {
              if ((window as any).visua[a] && (window as any).visua[a][key]) {
                (window as any).visua[a][key].defaultvalue = fn[key];
              }
            } else {
              try {
                if ((window as any).anony && (window as any).anony[a][key]) {
                  (window as any).visua[a][
                    key
                  ].defaultvalue = (window as any).anony[a][key];
                } else {
                  (window as any).visua[a][key].defaultvalue = fn[key];
                }
              } catch (error) {
                if ((window as any).visua[a] && (window as any).visua[a][key]) {
                  (window as any).visua[a][key].defaultvalue = fn[key];
                }
              }
            }
          }
        }
        console.log(
          7979,
          a,
          (window as any).visua[a],
          (window as any).paramList[a]
        );
        this.viewData = (window as any).visua[a];
      }, 0);
    }
  }
  //初始化匿名函数集
  // anone(value: any) {
  //   (window as any).anony = {};

  //   let uuid =
  //     this.activeElement.domUUID +
  //     "_" +
  //     this.packageInfo.name +
  //     "_" +
  //     this.packageInfo.version;
  //   (window as any).anony[uuid] = {};
  //   let b = eval("(" + value + ")");
  //   let str = b.defaulType.toString();
  //   let v = Reflect.ownKeys(new b.defaulType());
  //   for (let key of v) {
  //     let z = str.indexOf(key);
  //     let x = str.substring(z, str.length);
  //     let j = x.substring(x.indexOf("=") + 1, str.length + 1);
  //     if (j.indexOf(")()") !== -1) {
  //       let m = j.substring(0, j.indexOf(")()") + 3);
  //       try {
  //         if (
  //           typeof eval(m) !== "function" &&
  //           !m.includes("function") &&
  //           !m.includes("=>")
  //         ) {
  //         } else {
  //           (window as any).anony[uuid][key] = m;
  //         }
  //       } catch (error) {
  //         continue;
  //       }
  //     }
  //   }
  // }
  diyClick() {
    if (
      this.thisAssemObj !== "" &&
      DesignStore.activeElementPosition !== null
    ) {
      this.diy_view("1");
    }
  }
  viewClick() {
    if (
      this.thisAssemObj !== "" &&
      DesignStore.activeElementPosition !== null
    ) {
      //防止切换  自执行函数不渲染
      let a: any = this.$refs.textarea;
      // this.anone(a.value);
      this.diy_view("0");
    }
  }

  diy_view(param: any) {
    let a: any = this.$parent;
    let b = a.dataEle.activeElement.domPosition;
    let newJson = JSON.parse(JSON.stringify(a.dataEle));
    switch (param) {
      case "0":
        newJson.elements[b].pattern = "0";
        break;
      case "1":
        newJson.elements[b].pattern = "1";
        break;
      default:
        break;
    }
    setTimeout(() => {
      a.dataEle = newJson;
      a.pattern = param;
      let x: any = a.$refs.homeheader;
      x.revoke.push(newJson);
    }, 0);
  }

  jsClick() {
    if (
      this.thisAssemObj !== "" &&
      DesignStore.activeElementPosition !== null
    ) {
      this.apiBll = true;
      this.cssBll = false;
      let a: any = this.$parent;
      let b: any = DesignStore.activeElementPosition;
      a.apiCssObj = "api";
      this.$emit("resetStore", "api", b, a.dataEle.elements[b]["api"]);
      setTimeout(() => {
        console.log(21212, this.$props);
        let b: any = this.$props;
        let a: any = this.$refs.textarea;
        a.refresh(b.apiValue, "application/json");
      }, 0);
    }
  }
  cssClick() {
    if (
      this.thisAssemObj !== "" &&
      DesignStore.activeElementPosition !== null
    ) {
      this.apiBll = false;
      this.cssBll = true;
      let a: any = this.$parent;
      let b: any = DesignStore.activeElementPosition;
      a.apiCssObj = "css";
      this.$emit("resetStore", "css", b, a.dataEle.elements[b]["css"]);
      setTimeout(() => {
        console.log(21212, this.$props);
        let b: any = this.$props;
        let a: any = this.$refs.textarea;
        a.refresh(b.apiValue, "css");
      }, 0);
    }
  }
  focusPrice(value: any) {
    if (this.thisAssemObj !== "" && this.activeElement.domUUID !== undefined) {
      // this.anone(e.target.value);
      this.$emit(
        "handleElementClick_jsCSS",
        this.activeElement.domUUID,
        this.activeElement.domPosition
      );
      //this.$emit("settingAPI", this.thisAssemObj, value, this.packageInfo);
    }
  }
  focusPriceClick(e: any) {
    if (
      this.thisAssemObj !== null &&
      this.thisAssemObj !== "" &&
      this.activeElement.domUUID !== undefined
    ) {
      this.$emit(
        "handleElementClick_jsCSS",
        this.activeElement.domUUID,
        this.activeElement.domPosition
      );
    }
  }
  blur(value: any) {
    console.log(888, DesignStore.activeElementUUID, value);
    if (
      this.thisAssemObj !== "" &&
      this.thisAssemObj !== null &&
      DesignStore.activeElementPosition !== undefined
    ) {
      // this.anone(e.target.value);
      let a: any = this.$parent;
      this.$emit(
        "resetStore",
        a.apiCssObj,
        DesignStore.activeElementPosition,
        value
      );
    }
  }
  resetApi() {
    if (
      this.thisAssemObj !== "" &&
      DesignStore.activeElementPosition !== null
    ) {
      this.$emit("resetApi", DesignStore.activeElementPosition);
      setTimeout(() => {
        console.log(21212, this.$props);
        let b: any = this.$props;
        let a: any = this.$refs.textarea;
        a.refresh(b.apiValue);
      }, 0);
    }
  }
  created() {
    // let a: any = this.$props;
    // this.apiValueTwo = a.apiValue;
  }
  mounted() {}
}
</script>

<style lang="scss">
.lcu_attribute {
  top: 0rem;
  right: 0rem;
  width: 100%;
  height: 20rem;
  border: 1px solid black;
  background-color: #e9dfdf;
}
.lcu_attribute textarea {
  width: 98%;
  height: 70%;
}
.lcu_attribute_header {
  text-align: left;
  button {
    margin: 2px;
  }
}
.lcu_diy {
  height: 100%;
  width: 100%;
}
</style>
