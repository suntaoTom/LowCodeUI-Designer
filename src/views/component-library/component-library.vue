<template>
  <div class="lcu_element" ref="lcu_element">
    <div class="lcu_element_title">
      <div class="lcu_element_title_left"></div>
      <div class="lcu_element_title_center"><span>元件库</span></div>
      <div class="lcu_element_title_right">
        <span @click="add" v-if="addElement === 0">添加</span>
        <span @click="search">搜索</span>
      </div>
    </div>
    <div class="lcu_element_title_add" v-if="addBlea && addElement === 0">
      <input placeholder="@lowcodeui/xx@1.0.0" v-model="addName" />
      <button @click="addClick" :disabled="okBllea">ok</button>
    </div>
    <div class="lcu_element_select">
      <select @change="lzElement($event)">
        <option value="0">公共</option>
        <option value="1">集团</option>
        <option value="2">项目</option>
        <option value="3">个人</option>
      </select>
    </div>
    <div class="lcu_element_title_search" v-if="searchBlea">
      <input placeholder="请输入要搜索的元件名" v-model="searchName" />
      <button @click="searchClick">ok</button>
    </div>
    <div class="lcu_element_content">
      <div
        class="lcu_element_content_ele"
        v-for="(item, index) in assembly"
        @mousedown="doMousedown($event, index, item)"
        :key="index"
      >
        <div
          class="lcu_element_content_ele_curs"
          :data="getJson(index, item)"
        ></div>
        <div class="lcu_element_content_ele_info">
          <p><img :src="imgUrl(index)" /></p>
          <p>{{ index }}</p>
        </div>
      </div>
    </div>
    <div class="lcu_element_content_move" ref="lcu_element_content_move"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import LoginStore from "@/store/modules/login";
import moveDirective from "./move-directive";
import { get, post } from "@/utils/fetch";
import {serverModuleApi} from "@/service/main";
@Options({
  components: {},
  //指令
  directives: {},
  props: {},
  watch: {
    searchName: [{ handler: "valueApies", immediate: false, deep: false }]
  }
})
export default class Home extends Vue {
  private assembly: any = [];
  private addBlea: Boolean = false;
  private searchBlea: Boolean = false;
  private addElement = 0;
  private addName = "";
  private searchName = "";
  private okBllea: Boolean = false;
  doMousedown(e: any, index: any, item: any) {
    let _self = this;
    //获取画布宽，高，,x,y
    let parent: any = this.$parent;
    let b = parent.$refs.lcu_body_center;
    let top = b.offsetTop;
    let left = b.offsetLeft;
    let width = b.clientWidth;
    let height = b.clientHeight;
    //获取画布滚动x,y
    let canves = parent.$refs.rightContent;
    let scrollLeft = canves.scrollLeft;
    let scrollTop = canves.scrollTop;
    //获取虚拟框
    let el: any = this.$refs.lcu_element_content_move;
    let x = 0;
    let y = 0;
    let l = 0;
    let t = 0;
    //获取x坐标和y坐标
    x = e.clientX;
    y = e.clientY;
    //获取左部和顶部的偏移量
    l = el.offsetLeft;
    t = el.offsetTop;
    //设置样式
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width =
      item.style !== undefined && item.style.width !== undefined
        ? item.style.width
        : "50px";
    el.style.height =
      item.style !== undefined && item.style.height !== undefined
        ? item.style.height
        : "50px";
    el.style.display = "block";
    el.style.backgroundImage = `url(${this.imgUrl(index)})`;

    document.onmousemove = function(e: any) {
      //获取x和y
      let nx = e.clientX;
      let ny = e.clientY;
      //计算移动后的左偏移量和顶部的偏移量
      let nl = nx - (x - l);
      let nt = ny - (y - t);
      console.log(19191, nx, ny, left, top);
      el.style.left = nx + "px";
      el.style.top = ny + "px";
      //可以是鼠标拖动，不选中文字
      return false;
    };
    document.onmouseup = function(e: any) {
      el.style.left = 0 + "px";
      el.style.top = 0 + "px";
      el.style.display = "none";
      document.onmousemove = null;
      document.onmouseup = null;
      console.log(101010, e.clientX, left + width);
      if (
        e.clientX > left &&
        e.clientX < left + width &&
        e.clientY > top &&
        e.clientY < top + height
      ) {
        let a = e.clientX - left + scrollLeft - 18;
        let b = e.clientY - top + scrollTop - 18;
        console.log(181818, a, b);
        _self.assemblyFn(index, item, a, b);
      }
    };
  }

  getJson(key: any, value: any) {
    let a: any = {};
    a[key] = value;
    return JSON.stringify(a);
  }

  valueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      if (newV === "") {
        this.assembly = DesignStore.assemblyData;
      }
      console.log(1515, newV, oldV);
    }
  }
  imgUrl(url: any) {
    return `${serverModuleApi}/` + url + "/public/logo.png";
  }

  created() {
    let b: any = LoginStore.personInfo;
    //初始化组件集
    DesignStore.setAssembly({
      user_id: b?.id,
      element_type: 0,
      thisObj: this
    });
  }
  async addClick() {
    let a = /^(@)([0-9]\d|[0-9])(.([0-9]\d|\d)){2}$/;
    let b: any = this.addName.lastIndexOf("@");
    let c = this.addName.substr(b, b.length);
    let e: any = this.addName.lastIndexOf("/");
    let d = this.addName.substr(0, e);
    console.log(232323, b);
    if (d === "@lowcodeui" && a.test(c)) {
      let f = this.addName.slice(0, b);
      let g = this.addName.slice(b + 1, this.addName.length);
      console.log(33, DesignStore.assemblyData);
      let h = "npm:" + f + "@^" + g;
      if (DesignStore.assemblyData!==null&&DesignStore.assemblyData[f + "_" + g] === h) {
        alert("此元件已存在");
      } else {
        this.okBllea = true;
        let z: any = await DesignStore.setElementName({
          name: f,
          version: g
        });
        if (z.msg === "success") {
          let b: any = LoginStore.personInfo;
          await DesignStore.setAssembly({
            user_id: b.id,
            element_type: this.addElement,
            thisObj: this
          });
          this.assembly = DesignStore.assemblyData;
          console.log(33, DesignStore.assemblyData);
          alert("添加成功");
        } else {
          alert("元件库没有此元件，请核对输入是否正确");
        }
        this.okBllea = false;
      }
      console.log(44, d, c, a.test(c));
    } else {
      console.error("请输入正确内容，例（名称@版本）：@lowcodeui/xx@1.0.0");
      alert("请输入正确内容，例（名称@版本）：@lowcodeui/xx@1.0.0");
    }
  }
  add() {
    this.addBlea = this.addBlea === false ? true : false;
  }
  searchClick() {
    this.assembly = this.searchByIndexOf(
      this.searchName,
      DesignStore.assemblyData
    );
  }
  search() {
    this.searchBlea = this.searchBlea === false ? true : false;
  }
  //模糊查询
  searchByIndexOf(keyWord: any, list: any) {
    let len = list.length;
    let arr: any = {};
    for (let key in list) {
      let a = key + list[key];
      //如果字符串中不包含目标字符会返回-1
      if (a.indexOf(keyWord) >= 0) {
        arr[key] = list[key];
      }
    }
    return arr;
  }

  async lzElement(e: any) {
    let b: any = LoginStore.personInfo;
    console.log(e.target.value);
    this.addElement = parseInt(e.target.value);
    await DesignStore.setAssembly({
      user_id: b.id,
      element_type: e.target.value,
      thisObj: this
    });
    this.assembly = DesignStore.assemblyData;
  }
  // 初始化每个组件的css样式
  styleHtml(css: any, uuid: any, name: any) {
    console.log(16161, name);
    document.querySelectorAll(`style[cssid='${uuid}']`).forEach(val => {
      document.getElementsByTagName("head")[0].removeChild(val);
    });
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
      let v1 = "#" + uuid + " " + "@font-face";
      c = m.replace(v, "url").replace(v1, "@font-face");
      //动态创建每个组件的style
      let nod: any = document.createElement("style");
      nod.type = "text/css";
      nod.setAttribute("cssid", uuid);
      if (nod.styleSheet) {
        //ie下
        nod.styleSheet.cssText = c;
      } else {
        nod.innerHTML = c; //或者写成 nod.appendChild(document.createTextNode(c))
      }
      document.getElementsByTagName("head")[0].appendChild(nod);
    }
  }

  //将组件渲染进画布中
  async assemblyFn(name: any, item: any, X?: number, Y?: number) {
    let p: any = null;
    let z: any = this.$parent;
    z.dbObject.read(name, async (val: any) => {
      let domObj = null;
      console.log(161616, val);
      if (val === false) {
        domObj = await DesignStore.setComponentInfo({
          name: name,
          version: item.version
        });
        if (domObj.status === 1) {
          z.dbObject.addPerson(
            JSON.parse(JSON.stringify({ uuid: name, ...domObj }))
          );
        } else {
          alert(domObj.message);
        }
      } else {
        domObj = val;
      }
      const a = {
        uuid:
          "lz" +
          (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        componentName: name,
        version: item.version,
        commonStyle: {
          cursor: "move",
          width:
            item.style !== undefined && item.style.width !== undefined
              ? item.style.width
              : "50px",
          height:
            item.style !== undefined && item.style.height !== undefined
              ? item.style.height
              : "50px",
          left: X + "px",
          top: Y + "px",
          outline: "1px dashed #25a589",
          "z-index": "1",
          position: "absolute"
        },
        propsValue: "",
        value: "",
        api: "{}",
        css: "",
        pattern: "0"
      };
      // z.dataEle.elements.push(a);
      let b = domObj.js;
      let x = domObj.css;
      this.styleHtml(x, a.uuid, name);
      let d: any[] = [];
      for (let key in b) {
        const c = b[key].replace(/#app/g, "#" + a.uuid);
        d.push(c);
      }
      console.log(123987, x);
      const s = a.uuid + "_" + a.componentName;
      (window as any).uuidName = s;
      (window as any).apiParam = a.api;
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
      z.thisAssemObj = (window as any).thisAssemObj;
      a.api = this.init();
      z.dataEle.elements.push(a);
      z.handleElementClick(
        a.uuid,
        z.dataEle.elements.length > 1 ? z.dataEle.elements.length - 1 : 0
      );
      let l: any = z.$refs.homeheader;
      l.revoke.push(JSON.parse(JSON.stringify(z.dataEle)));
      setTimeout(() => {
        z.api((window as any).thisAssemObj, "", item);
        z.pattern = "0";
        z.$refs.ide.viewData = (window as any).visua[s];
      }, 0);
    });
  }

  init() {
    let uuid = (window as any).uuidName;
    let x: any = ``;
    for (const key in (window as any).visua[uuid]) {
      if (
        (window as any).visua[uuid][key].type === "textarea" ||
        (window as any).visua[uuid][key].type === "input"
      ) {
        let funcTest = (window as any).visua[uuid][key].defaultvalue;
        try {
          if (typeof funcTest === "object") {
            funcTest = JSON.stringify(funcTest);
          } else if (
            typeof funcTest !== "function" &&
            funcTest.substring(funcTest.length - 2, funcTest.length) !== "()"
          ) {
            try {
              if (
                typeof eval(funcTest) !== "function" &&
                !funcTest.includes("function") &&
                !funcTest.includes("=>")
              ) {
                funcTest = `'${funcTest.trim()}'`;
              }
            } catch (error) {
              try {
                if (typeof eval("(" + funcTest + ")") !== "function") {
                  funcTest = `'${funcTest.trim()}'`;
                }
              } catch (error) {
                funcTest = `'${funcTest.trim()}'`;
              }
            }
          } else {
            funcTest = funcTest.toString();
          }
        } catch (error) {
          if (typeof funcTest === "number") {
            continue;
          } else {
            funcTest = `'${funcTest.trim()}'`;
          }
        }

        let z = funcTest;
        x = x + `this.${key}=${z};\n`;
        console.log(1919, typeof funcTest);
      } else {
        let c: any = typeof (window as any).visua[uuid][key].defaultvalue;
        let z =
          c !== "boolean"
            ? `'${(window as any).visua[uuid][key].defaultvalue.trim()}'`
            : (window as any).visua[uuid][key].defaultvalue;
        x = x + `this.${key}=${z};\n`;
      }

      console.log(6868, x);
    }
    let a: any = this.$parent;
    let b: any = a.$parent;
    let v: any = `{
        defaulType:function() {
            ${x}
        },
        self:function() {
            return this;
        }
    }`;
    return v;
  }
}
</script>

<style lang="scss">
.lcu_element {
  width: 100%;
  height: 100%;
}
.lcu_element_title {
  height: 30px;
  width: 100%;
  display: flex;
  text-align: center;
  .lcu_element_title_left {
    width: 30%;
  }
  .lcu_element_title_center {
    width: 40%;
    text-align: center;
  }
  .lcu_element_title_right {
    width: 30%;
    font-size: 10px;
    margin: 5px;
    span {
      color: blue;
      margin: 2px;
      cursor: pointer;
    }
  }
}
.lcu_element_select {
  height: 30px;
  width: 100%;
  text-align: left;
  select {
    width: 95%;
  }
}
.lcu_element_content {
  overflow: auto;
  height: 80%;
  width: 100%;
  font-size: 1px;

  .lcu_element_content_ele {
    height: 100px;
    width: 100px;
    float: left;
    cursor: pointer;
    position: relative;
    .lcu_element_content_ele_curs {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
    }
    .lcu_element_content_ele_info {
      width: 80%;
      height: 80%;
      margin-left: 10px;
      margin-top: 10px;
      text-align: center;
      p {
        word-break: break-word;
      }
      img {
        max-height: 50px;
        max-width: 75px;
      }
    }
  }
  .lcu_element_content_ele:hover {
    background-color: #b6d6f7;
    border-color: #66a9ed;
  }
}

.lcu_element_title_add,
.lcu_element_title_search {
  position: relative;
  top: 1px;
  text-align: left;
  height: 30px;
  width: 100%;
  input {
    width: 80%;
  }
  button {
    margin: 4px;
    cursor: pointer;
  }
}
.lcu_element_content_move {
  position: fixed;
  top: 0px;
  border-style: dotted;
  display: none;
  z-index: 999;
  background-size: 100% 100%;
}
</style>
