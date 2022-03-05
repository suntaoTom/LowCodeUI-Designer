<template>
  <HomeHeader
    ref="homeheader"
    :dataEle="dataEle"
    :pageW="dataEle.pageW"
    :pageH="dataEle.pageH"
    :commonStyle="commonStyle"
  />
  <!-- <Fn /> -->
  <div class="lcu_body">
    <div class="lcu_body_left">
      <ComponentLibrary ref="componentlibrary" />
    </div>
    <div class="lcu_body_center" :style="bodyHeight" ref="lcu_body_center">
      <RulerTool ref="rulertool" />
      <div class="lcu_ruler_v_canves" ref="rightContent" @scroll="scrool">
        <div
          id="lcu_canves"
          ref="canves"
          :style="domStyle2"
          @click="handleClickCanvas"
        >
          <div class="lz-ruler-ref-dot-v" :style="dataEle.pageW"></div>
          <div class="lz-ruler-ref-dot-h" :style="dataEle.pageH"></div>
          <div
            v-for="(item, index) in dataEle.lineList"
            :style="getLineStyle(item)"
            :key="index"
            :id="item.id"
            :class="`lz-ruler-ref-line-${item.type}`"
            @mousedown="
              item.type === 'h'
                ? dragHorizontalLine($event, index)
                : dragVerticalLine($event, index)
            "
          ></div>
          <!-- <div
            class="lz-ruler-ref-line-h"
            ref="line"
            @mousedown="handleDragLine($event)"
          ></div> -->
          <!--页面组件列表展示-->
          <EditShape
            v-for="(item, index) in dataEle.elements"
            :idname="item.uuid"
            :key="index"
            :position="index"
            :uuid="item.uuid"
            :defaultStyle="item.commonStyle"
            :active="item.uuid === getActiveeElementUUID"
            v-on:handleElementClick="handleElementClick(item.uuid, $event)"
            v-on:resetStore="resetStore"
            @domDelete="
              domDelete(
                index,
                item.uuid,
                item.componentName,
                item.version,
                $event
              )
            "
            v-on:assemblyFnOne="
              assemblyFnOne(
                item.uuid,
                item.componentName,
                item.version,
                item.api,
                item.css
              )
            "
            :apiList="item.api"
          />
        </div>
      </div>
    </div>
    <div class="lcu_body_right">
      <IDE
        :apiValue="apies"
        :pattern="pattern"
        v-on:resetStore="resetStore"
        @resetApi="resetApi"
        v-on:handleElementClick_jsCSS="handleElementClick_jsCSS"
        v-on:settingAPI="settingAPI"
        :thisAssemObj="thisAssemObj"
        :packageInfo="packageInfo"
        :activeElement="dataEle.activeElement"
        ref="ide"
      />
      <PackageInfo
        :getActiveeElementUUID="getActiveeElementUUID"
        :packageInfo="packageInfo"
        :paramObjList="paramObjList"
      />
    </div>
    <Tool />
  </div>
</template>

<script lang="ts">
import { Options, Vue, emits } from "vue-class-component";
import HomeHeader from "@/views/home-header/home-header.vue";
import ComponentLibrary from "@/views/component-library/component-library.vue";
import RulerTool from "@/views/rulers/rulers.vue";
import EditShape from "@/components/edit-shape/index.vue";
import IDE from "@/views/ide/ide.vue";
import PackageInfo from "@/views/packageInfo/packageInfo.vue";
import Tool from "@/views/tool/tool.vue";
import DesignStore from "@/store/modules/design";
import indexedDB from "@/store/indexedDB";
import LoginStore from "@/store/modules/login";
import fetch from "./pc/fetch";
import {serverModuleApi} from "@/service/main";
import { selectEvents } from "element-plus/lib/el-select/src/token";
import Fn from "./ide/fn/code-ideJson.vue";

var data = require("@/service/data.json");
Vue.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate" // for vue-router 2.2+
]);
@Options({
  components: {
    EditShape,
    IDE,
    RulerTool,
    HomeHeader,
    ComponentLibrary,
    PackageInfo,
    Tool,
    Fn
  },
  props: {},
  watch: {
    dataEle: [{ handler: "valueApies", immediate: false, deep: false }],
    apies: [{ handler: "valueApies", immediate: false, deep: false }]
  }
})
export default class Home extends Vue {
  private thisAssemObj: any = null; //选中组件this对象
  private dbObject = new indexedDB();
  private dataEle: any = DesignStore.projectData;
  private activeElementUUID: number | null = DesignStore.activeElementUUID;
  private domStyle2 = {
    width: "20000px",
    height: "20000px",
    border: " 1px solid black",
    "z-index": "0",
    position: "relative"
  };
  private apies: any = "";
  private pattern: any = "";
  private packageInfo: any = {};
  private defaultRules: any = null;
  private paramObjList: any = {};
  private commonStyle = {};
  private bodyHeight = { height: "0px" };

  private apiCssObj = "api";

  //获取当前选中元素的uuid
  get getActiveeElementUUID() {
    return DesignStore.activeElementUUID;
  }
  reset() {
    this.apies = "";
    this.pattern = "";
    this.packageInfo = {};
    this.defaultRules = null;
    this.paramObjList = {};
    this.commonStyle = {};
    this.apiCssObj = "api";
    this.activeElementUUID = null;
  }
  valueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      console.log(1515, newV, oldV);
    }
  }
  getLineStyle(item: any) {
    return item.type === "v"
      ? { top: typeof item.top === "number" ? item.top + "px" : item.top }
      : { left: typeof item.left === "number" ? item.left + "px" : item.left };
  }
  // 垂直标尺处按下鼠标
  dragHorizontalLine(e: any, index: any) {
    e.stopPropagation(); //阻止事件冒泡，在性能上有一定优化
    e.preventDefault();
    let oDiv = e.currentTarget; //这里一定要用currentTarget，因为这是获取事件最终的元素，而不是捕获、冒泡的元素
    let disX = e.clientX - oDiv.offsetLeft;
    let l = 0;
    let self = this;
    let x: any = this.$refs.homeheader;
    let r: any = eval(JSON.stringify(x.revoke));
    document.onmousemove = function(ev) {
      let b: any = document.getElementById("lcu_canves");
      const oEvent = ev || event;
      l = oEvent.clientX - disX;
      console.log(4848, l);
      if (l < 0) {
        // t = 0;
        return false;
      } else if (l > b.clientWidth - oDiv.offsetWidth) {
        l = b.clientWidth - oDiv.offsetWidth;
      }
      oDiv.style.left = l + "px";
    };
    document.onmouseup = function() {
      console.log(4747);
      // l < 0 ? self.dataEle.lineList.splice(index, 1) : false;
      if (l !== 0) {
        if (l < 0) {
          self.dataEle.lineList.splice(index, 1);
        } else {
          let v: any = self.dataEle.lineList[index];
          v.left = l + "px";
        }
        let o = JSON.parse(JSON.stringify(self.dataEle));
        r.push(o);
        x.revoke = r;
      }

      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false; //阻止默认事件 屏蔽火狐的bug
  }
  // 水平线处按下鼠标
  dragVerticalLine(e: any, index: any) {
    e.stopPropagation(); //阻止事件冒泡，在性能上有一定优化
    e.preventDefault();
    let oDiv = e.currentTarget; //这里一定要用currentTarget，因为这是获取事件最终的元素，而不是捕获、冒泡的元素
    let disY = e.clientY - oDiv.offsetTop;
    let t = 0;
    let self = this;
    document.onmousemove = function(ev) {
      let b: any = document.getElementById("lcu_canves");
      const oEvent = ev || event;
      t = oEvent.clientY - disY;
      console.log(4848, t);
      if (t < 0) {
        // t = 0;
        return false;
      } else if (t > b.clientHeight - oDiv.offsetHeight) {
        t = b.clientHeight - oDiv.offsetHeight;
      }
      oDiv.style.top = t + "px";
      let v: any = self.dataEle.lineList[index];
      v.top = t + "px";
    };
    document.onmouseup = function() {
      console.log(4747);
      if (t !== 0) {
        t < 0 ? self.dataEle.lineList.splice(index, 1) : false;
      }
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false; //阻止默认事件 屏蔽火狐的bug
  }

  scrool() {
    let a: any = this.$refs.rightContent;
    let b: any = this.$refs.rulertool;
    b.restyle(a.scrollLeft, a.scrollTop);
  }

  domDelete(position: any, idname: any, name: any, version: any, e: any) {
    this.reset();
    document.querySelectorAll(`style[cssid='#${idname}']`).forEach(val => {
      document.getElementsByTagName("head")[0].removeChild(val);
    });
    document.querySelectorAll(`style[cssid='${idname}']`).forEach(val => {
      document.getElementsByTagName("head")[0].removeChild(val);
    });
    DesignStore.setActiveElementUUID(null);
    this.apies = "";
    this.thisAssemObj = "";
    const a = [...this.dataEle.elements];
    a.splice(position, 1);
    // this.dataEle.activeElement = {};
    const b = this.dataEle;
    b.elements = a;
    this.dataEle = { activeElement: {}, elements: [] };
    try {
      delete (window as any).visua[idname + "_" + name];
      delete (window as any).objList[idname + "_" + name];
    } catch (error) {
      console.log(error);
    }
    //delete (window as any).visua[idname + "_" + name + "_" + version];
    setTimeout(() => {
      let x: any = this.$refs.homeheader;
      let newJson = JSON.parse(JSON.stringify(b));
      x.revoke.push(newJson);
      this.dataEle = newJson;
      const c = idname + "_" + name;
      if (this.paramObjList[c]) {
        delete this.paramObjList[c];
        delete (window as any).paramList[c];
        delete (window as any).objList[c];
      }
    }, 0);
    console.log(4545, a);
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
      let lib: any = this.$refs.componentlibrary;
      lib.styleHtml(x, idname, name);
      let d: any[] = [];
      for (let key in b) {
        const c = b[key].replace("#app", "#" + idname);
        d.push(c);
      }
      setTimeout(() => {
        (window as any).uuidName = s;
        (window as any).apiParam = api;
        this.styleHtml(css, idname, name);
        // eval(d[1]);
        // eval(d[0]);
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
        //这里是为了解决A元件加载B元件，导致thisAssemObj对象指向B，应该指向A
        (window as any).thisAssemObj = (window as any).objList[s];
        this.thisAssemObj = (window as any).objList[s];
        //代码里有特殊关键api，将不执行函数
        if (api.includes("alert") || api.includes("window.location.")) {
          alert(s + "元件有敏感关键词，请手动执行此元件脚本");
          return false;
        } else {
          let c = Object.keys(eval("(" + api + ")"));
          this.fnInit(s, c);
        }
      }, 0);
    });
  }

  paramObj(name: any, key: any, fn: Function) {
    console.log(222, name, fn);
    if (!name.includes("undefined")) {
      if (this.paramObjList[name] !== undefined) {
        this.paramObjList[name][key] = fn;
        (window as any).paramList[name][key] = fn;
      } else {
        this.paramObjList[name] = {};
        (window as any).paramList[name] = {};
        this.paramObjList[name][key] = fn;
        (window as any).paramList[name][key] = fn;
      }
    }

    // this.paramObjList[name][key]=fn
  }
  resetApi(position: any) {
    if (this.apiCssObj === "api") {
      let a: any = this.$refs.componentlibrary;
      this.apies = a.init();
      this.resetStore(this.apiCssObj, position, a.init());
    } else {
      this.resetStore(this.apiCssObj, position, "");
      // console.log(333, thisObj, rules, packageInfo);
      this.apies = "";
    }
  }
  api(thisObj?: any, rules?: any, packageInfo?: any) {
    console.log(
      787878,
      thisObj,
      rules,
      packageInfo,
      DesignStore.activeElementUUID
    );
    this.thisAssemObj = thisObj !== undefined ? thisObj.relationObj : undefined;
    this.apies = "";
    this.dataEle.elements.map((val: any) => {
      if (val.uuid === DesignStore.activeElementUUID) {
        setTimeout(() => {
          //这里使用setTimeout,是为了防止setting编辑（api）器，不更新值操作
          //场景：比如多个相同组件同时存在。初始化默认值相同，这时编辑一个a组件api结束，再点击另一个b组件，这时候，编辑框还是显示a组件的api
          this.apies = val.api;
          this.pattern = val.pattern;
          this.commonStyle = val.commonStyle;
          const b =
            this.getActiveeElementUUID +
            "_" +
            packageInfo.name +
            "_" +
            packageInfo.version;
          (window as any).apiParam = val.api;
          if (this.thisAssemObj !== undefined) {
            console.log(92922, b);
            this.thisAssemObj.setInfoApi(b, val.api);
          }
        }, 0);
      }
    });
    setTimeout(() => {
      console.log(262626, packageInfo);
      this.packageInfo = packageInfo;
      (window as any).uuidName =
        this.getActiveeElementUUID +
        "_" +
        packageInfo.name +
        "_" +
        packageInfo.version;
    }, 0);
    // this.defaultRules = rules;
  }
  settingAPI(thisObj: any, rules: any, packageInfo: any) {
    let self = this;
    console.log(7878789, thisObj, rules, packageInfo);
    this.thisAssemObj = thisObj;
    this.apies = "";
    this.dataEle.elements.map((val: any) => {
      if (val.uuid === this.dataEle.activeElement.domUUID) {
        setTimeout(() => {
          //这里使用setTimeout,是为了防止setting编辑（api）器，不更新值操作
          //场景：比如多个相同组件同时存在。初始化默认值相同，这时编辑一个a组件api结束，再点击另一个b组件，这时候，编辑框还是显示a组件的api
          this.apies = self.apiCssObj === "api" ? rules : rules;
        }, 0);
      }
    });

    setTimeout(() => {
      console.log(101010, packageInfo);
      self.packageInfo = packageInfo;
    }, 0);
    //this.defaultRules = rules;
  }
  handleElementClick(uuid: number, position: any) {
    this.apiCssObj = "api";
    let a: any = this.$refs.ide;
    a.apiBll = true;
    a.cssBll = false;
    this.handleElementClickFn(uuid, position);
  }

  handleElementClick_jsCSS(uuid: number, position: any) {
    this.handleElementClickFn(uuid, position);
  }
  handleElementClickFn(uuid: number, position: any) {
    this.commonStyle = this.dataEle.elements[position].commonStyle;
    this.dataEle.activeElement.domUUID = uuid;
    this.dataEle.activeElement.domPosition = position;
    //这里加入事件队列里执行，是因为怕和编辑框api的blur事件顺序产生冲突，一定要先blur，再执行click的事件
    setTimeout(() => {
      console.log(56567, position, uuid);
      DesignStore.setActiveElementUUID(uuid);
      DesignStore.setActiveElementPosition(position);
      // this.init();
    }, 0);
  }

  handleClickCanvas(uuid: number) {
    this.commonStyle = {};
    DesignStore.setActiveElementUUID(null);
  }
  resetStore(key: any, position: any, dataStore: any) {
    let _self = this;
    console.log(29292, key, position, dataStore);
    let x: any = this.$refs.homeheader;
    x.bll ? (x.recovery = []) : false;
    const a = JSON.parse(JSON.stringify(this.dataEle));
    a.elements[position][key] = dataStore;
    // 这里要做历史数据对比，不然，撤销记录的数据，很多都相同的数据也记录了，用户体验不好
    if (
      JSON.stringify(x.revoke[x.revoke.length - 1].elements) !==
      JSON.stringify(a.elements)
    ) {
      let newJson = JSON.parse(JSON.stringify(a));
      x.revoke.push(newJson);
    }
    console.log(123987, a, x.revoke, this.thisAssemObj);
    if (key === "api") {
      const b =
        this.getActiveeElementUUID +
        "_" +
        this.packageInfo.name +
        "_" +
        this.packageInfo.version;
      if (
        this.getActiveeElementUUID !== null &&
        this.thisAssemObj !== null &&
        this.thisAssemObj !== undefined
      ) {
        this.thisAssemObj.setInfoApi(b, dataStore);
      } else {
        //处理首次拖拽，无对象变量
        this.thisAssemObj = (window as any).thisAssemObj;
        this.thisAssemObj.setInfoApi(b, dataStore);
      }
    } else if (key === "css") {
      this.styleHtml(
        dataStore,
        a.elements[position].uuid,
        this.packageInfo.name + "_" + this.packageInfo.version
      );
    }
    setTimeout(() => {
      _self.apies = dataStore;
      _self.dataEle = a;
      if (_self.packageInfo.name !== undefined) {
        const f =
          _self.getActiveeElementUUID +
          "_" +
          _self.packageInfo.name +
          "_" +
          _self.packageInfo.version;
        if ((window as any).paramList[f] != undefined) {
          //_self.paramObjList[f] = (window as any).paramList[f];
          let c = Object.keys((window as any).paramList[f]);
          _self.fnInit(f, c);
        }
      }
    }, 0);
    // DesignStore.setStyleData(a);
  }

  // 动态添加每个组件的css样式
  styleHtml(css: any, uuid: any, name: any) {
    document.querySelectorAll(`style[cssid='#${uuid}']`).forEach(val => {
      document.getElementsByTagName("head")[0].removeChild(val);
    });
    let c = "";
    let url = `${serverModuleApi}/` + name + "/dist/fonts";
    let p = css.slice(0, css.length - 1);
    let l = p
      .replace(/,/g, "," + "#" + uuid + " ")
      .replace(";.", ";#" + uuid + " " + ".")
      .replace("../fonts", url)
      .replace("../fonts", url);
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

  beforeunloadFn(e: any) {
    e = e || window.event;
    if (e) {
      console.log(12, e);
      e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
    }
    return "您是否确认离开此页面-您输入的数据可能不会被保存";
  }

  async getPageInfo(uuid: any) {
    await DesignStore.setActivePageUUID({ uuid: uuid });
    let b: any = LoginStore.personInfo;
    await DesignStore.setProjectData({
      uuid: uuid,
      view_user_id: b.id,
      project_id: this.$route.query.project_id
    });
    this.dataEle = DesignStore.projectData;
  }
  fnInit(param: any, name: any) {
    let b = (window as any).paramList[param];
    if ((window as any).paramList[param]) {
      for (let key of name) {
        if ((window as any).paramList[param][key]) {
          setTimeout(() => {
            (window as any).paramList[param][key]();
          }, 0);
        }
      }
    }
  }
  //监听window.thisAssemObj
  defin() {
    let $value = (window as any).thisAssemObj;
    Object.defineProperty(window, "thisAssemObj", {
      get() {
        return $value;
      },
      set($newValue) {
        if ($value != $newValue) {
          if (!(window as any).objList) {
            (window as any).objList = {};
          }
          (window as any).objList[(window as any).uuidName] = $newValue;
          $value = $newValue;
        }
      }
    });
  }
  beforeRouteLeave(to: any, form: any, next: any) {
    let x: any = this.$refs.homeheader;
    if (confirm("是否保存对“文件”的更改？")) {
      x.savePreview();
      next();
    } else {
      next();
    }
  }
  created() {
    this.dbObject.openIndexedDB(null);
  }

  mounted() {
    //内置http方法
    (window as any).fetch = fetch;
    window.onbeforeunload = (e: any) => {
      e = e || window.event;
      if (e) {
        e.returnValue = "关闭提示";
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";
    };
    (window as any).api = this.api;
    (window as any).paramObj = this.paramObj;
    let a: any = document.getElementById("lcu_header");
    let b: any = document.body;
    this.bodyHeight = { height: b.clientHeight - a.clientHeight + "px" };

    // 初始化页面配置数据
    let c: any = this.$route.query;
    this.getPageInfo(c.uuid);
    (window as any).uuid = c.uuid;
    this.defin();
    // DesignStore.setProjectData(1);
    // setTimeout(() => {
    // }, 0);
  }
}
</script>

<style lang="scss">
#lcu_canves {
  border: 1px solid black;
  position: relative;
  z-index: 0;
}

.lcu_body {
  height: 75%;
  width: 100%;
  display: flex;
}
.lcu_body_left {
  width: 20%;
  position: relative;
}
.lcu_body_center {
  width: 60%;
  overflow: hidden;
}
.lcu_body_right {
  width: 20%;
}
.lz-ruler-ref-line-v {
  z-index: 99;
  width: 100%;
  height: 3px;
  background: url("./rulers/image/line_h.png") repeat-x left center;
  cursor: n-resize;
  position: absolute;
}
.lz-ruler-ref-line-h {
  z-index: 99;
  width: 3px;
  height: 100%;
  background: url("./rulers/image/line_v.png") repeat-y center top;
  cursor: w-resize;
  position: absolute;
}

.lz-ruler-ref-dot-v {
  width: 100%;
  height: 3px;
  background: url("./rulers/image/line_dot.png") repeat-x left 1px;
  position: absolute;
}
.lz-ruler-ref-dot-h {
  width: 3px;
  height: 100%;
  background: url("./rulers/image/line_dot.png") repeat-y 1px top;
  position: absolute;
}
</style>
