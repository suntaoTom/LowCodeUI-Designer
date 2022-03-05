<template>
  <!-- {{ pageData }} -->
  <div id="canves" ref="canves" :style="domStyle2">
    <!--页面组件列表展示-->
    <div v-if="bll" :style="domStyle2">
      <edit-shape
        v-for="(item, index) in pageData.elements || []"
        :idname="item.uuid"
        :key="index"
        :uuid="item.uuid"
        :defaultStyle="restyle(pageData, item.commonStyle)"
        v-on:assemblyFnOne="
          assemblyFnOne(
            item.uuid,
            item.componentName,
            item.version,
            item.api,
            item.css
          )
        "
      >
      </edit-shape>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import editShape from "../components/components-template.vue";
import DesignStore from "@/store/modules/design";
import indexedDB from "@/store/indexedDB";
import fetch from "./fetch";

import {serverModuleApi} from "@/service/main";
@Options({
  components: {
    editShape
  },
  props: {}
})
export default class PC extends Vue {
  private dbObject = new indexedDB();
  private paramObjList: any = {};
  private pageData = { elements: [] };
  private domStyle2 = {};
  private bll = false;
  main() {
    this.dbObject.read(this.$route.query.uuid, (val: any) => {
      this.pageData = val;
      this.domStyle2 = {
        width: val.auto === "" ? val.pageH.left : "100%",
        height: val.auto === "XY" ? "100%" : val.pageW.top
      };
      setTimeout(() => {
        this.bll = true;
      }, 0);
    });
  }

  getReplace(para: any) {
    return para !== undefined ? parseInt(para.replace("px", "")) : 0;
  }

  restyle(pageData: any, css: any) {
    if (pageData.auto === "X" || pageData.auto === "XY") {
      //let noW = window.screen.width;
      let g: any = this.$refs.canves;
      let noW = g.clientWidth;
      let noH =
        pageData.auto === "X"
          ? this.getReplace(pageData.pageW.top)
          : g.clientHeight;
      let width = this.getReplace(pageData.pageH.left);
      let height = this.getReplace(pageData.pageW.top);
      let l = this.getReplace(css.left);
      let t = this.getReplace(css.top);
      let w = this.getReplace(css.width);
      let h = this.getReplace(css.height);
      //计算位置
      let lpro = l / width;
      let tpro = t / height;
      css.left = noW * lpro + "px";
      css.top = noH * tpro + "px";
      // 计算宽高

      let widthPro = w / width;
      let heightPro = h / height;
      css.width = noW * widthPro + "px";
      css.height = noH * heightPro + "px";
      console.log(2424);
    }
    return css;
  }
  // 初始化每个组件的css样式
  styleHtml(css: any, uuid: any, name: any) {
    let c = "";
    let url = `${serverModuleApi}/` + name + "/dist/fonts";
    for (let key in css) {
      let k = css[key].slice(0, css[key].length - 1);
      let p = k
        .replace("#app", "#" + uuid)
        .replace(";.", ";#" + uuid + " " + ".")
        .replace("../fonts", url)
        .replace("../fonts", url);
      let l = p.replace(/,/g, "," + "#" + uuid + " ");
      let m = l.replace(/}/g, "}" + "#" + uuid + " ") + "}";
      let v = "#" + uuid + " " + "url";
      let v1 = "#" + uuid + " " + "@font-sface";
      c = m.replace(v, "url").replace(v1, "@font-face");
      //动态创建每个组件的style
      let nod: any = document.createElement("style");
      nod.type = "text/css";
      if (nod.styleSheet) {
        //ie下
        nod.styleSheet.cssText = c;
      } else {
        nod.innerHTML = c; //或者写成 nod.appendChild(document.createTextNode(c))
      }
      document.getElementsByTagName("head")[0].appendChild(nod);
    }
  }

  // 动态添加每个组件的css样式
  styleHtmlCss(css: any, uuid: any, name: any) {
    let c = "";
    let url = `${serverModuleApi}/` + name + "/dist/fonts";
    let k = css.slice(0, css.length - 1);
    let p = k
      .replace("#app", "#" + uuid)
      .replace(";.", ";#" + uuid + " " + ".")
      .replace("../fonts", url)
      .replace("../fonts", url);
    let l = p.replace(/,/g, "," + "#" + uuid + " ");
    let m = "#" + uuid + " " + l.replace(/}/g, "}" + "#" + uuid + " ") + "}";
    let v = "#" + uuid + " " + "url";
    let v1 = "#" + uuid + " " + "@font-face";
    c = m.replace(v, "url").replace(v1, "@font-face");
    //动态创建每个组件的style
    let nod: any = document.createElement("style");
    nod.type = "text/css";
    nod.setAttribute("cssid", "#" + uuid);
    if (nod.styleSheet) {
      //ie下
      nod.styleSheet.cssText = c;
    } else {
      nod.innerHTML = c; //或者写成 nod.appendChild(document.createTextNode(c))
    }
    document.getElementsByTagName("head")[0].appendChild(nod);
  }
  //根据接口已有数据，将组件渲染进画布中
  assemblyFnOne(idname: any, name: any, version: any, api: any, css: any) {
    console.log(2929, idname, name, version);
    const s = idname + "_" + name;
    this.dbObject.read(name, async (val: any) => {
      let domObj = null;
      if (val === false) {
        domObj = await DesignStore.setComponentInfo({
          name: name,
          version: version
        });
        if (domObj.status === 1) {
          this.dbObject.addPerson(
            JSON.parse(JSON.stringify({ uuid: name, ...domObj }))
          );
        } else {
          alert(domObj.message);
        }
      } else {
        domObj = val;
      }
      let b = domObj.js;
      let x = domObj.css;
      this.styleHtml(x, idname, name);
      let d: any[] = [];
      for (let key in b) {
        const c = b[key].replace("#app", "#" + idname);
        d.push(c);
      }
      setTimeout(() => {
        (window as any).uuidName = s;
        (window as any).apiParam = api;
        this.styleHtmlCss(css, idname, name);

        try {
          for (let key in d) {
            eval(d[key]);
          }
        } catch (err) {
          let k = d.reverse();
          for (let key in k) {
            eval(k[key]);
          }
        }
      }, 0);
      setTimeout(() => {
        let c = Object.keys(eval("(" + api + ")"));
        this.fnInit(s, c);
      }, 0);
    });
  }
  paramObj(namelement: any, key: any, fn: Function) {
    if (!namelement.includes("undefined")) {
      let a = namelement.split("_");
      let name = a[0] + "_" + a[1] + "_" + a[2];
      if (this.paramObjList[name] !== undefined) {
        console.log(111112, namelement, key, fn);
        this.paramObjList[name][key] = fn;
        (window as any).paramList[name][key] = fn;
      } else {
        console.log(3334, namelement, key, fn);
        this.paramObjList[name] = {};
        (window as any).paramList[name] = {};
        this.paramObjList[name][key] = fn;
        (window as any).paramList[name][key] = fn;
      }
    }

    // this.paramObjList[name][key]=fn
  }
  remChange() {
    this.remove();
    let width = window.screen.width;
    let fixedw = 750;
    let scale = width / fixedw; //获取到的屏幕宽度比上自定义的750宽度 获得对应比例
    let meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    //将对应比例填入meta标签即可实现宽度自适应
    meta.setAttribute(
      "content",
      `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
    );
    //meta将标签添加到文档中即可
    document.head.appendChild(meta);
  }
  remove() {
    let meta = document.querySelector("meta[name='viewport']");
    if (meta != null) {
      document.head.removeChild(meta);
    }
  }
  fnInit(param: any, name: any) {
    let b = (window as any).paramList[param];
    for (let key of name) {
      (window as any).paramList[param][key]();
    }
  }
  mounted() {
    (window as any).paramObj = this.paramObj;
    document.getElementsByTagName("body")[0].style.overflow = "scroll";
    // this.remChange();
    // window.addEventListener("resize", this.remChange);
    let html: any = document.getElementsByTagName("html")[0].style;
    html.minWidth = 0;
    html.minHeight = 0;
    //内置http方法
    (window as any).fetch = fetch;
  }
  created() {
    console.log(33, this.$route.query.uuid);
    this.dbObject.openIndexedDB(this.main);
  }
}
</script>

<style lang="scss">
body {
  height: 97%;
  width: 99%;
}
#canves {
  position: relative;
  z-index: 0;
  overflow: hidden;
}
#canves div {
  outline: transparent dashed 1px !important;
}
</style>
