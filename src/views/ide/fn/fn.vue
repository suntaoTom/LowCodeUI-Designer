<template>
  <div class="lcu_fx_model" />
  <div
    class="lcu_fx"
    @mousedown="mousedown($event)"
    :style="domStyle"
    ref="lzfx"
  >
    <!-- <IdeComponent :value="cont" /> -->
    <div class="lcu_fx_title">
      请输入JS脚本：
      <div>
        <div @click="close">X</div>
        <div v-if="!fullBll" @click="full(0)"><img src="./full.png" /></div>
        <div v-else @click="full(1)"><img src="./escfull.png" /></div>
      </div>
    </div>
    <div class="lcu_fx_fun_content" v-if="type === 'textarea'">
      <div class="lcu_fx_fun_code">(query) => {</div>
      <!-- <textarea v-model="cont" ref="testInput" /> -->
      <IdeComponent :value="cont" ref="testInput" />
      <!-- <CodeIde :value="cont" ref="testInput" /> -->
      <div class="lcu_fx_fun_code">}</div>
    </div>
    <div class="lcu_fx_fun_content" v-else>
      <div class="lcu_fx_fun_code">(function(){</div>
      <!-- <textarea v-model="cont" ref="testInput" /> -->
      <IdeComponent :value="cont" ref="testInput" />
      <!-- <CodeIde :value="cont" ref="testInput" /> -->
      <div class="lcu_fx_fun_code">})()</div>
    </div>
    <div class="lcu_fx_content">
      <div class="lcu_fx_fun">
        <div class="lcu_fx_fun_type">
          <span>函数类型：</span>
          <div class="lcu_fx_var_content">
            <ul>
              <li
                v-for="(item, index) in fnArray"
                :key="index"
                v-bind:class="[
                  clickFntype === index ? 'lcu_fx_var_content_activeClass' : ''
                ]"
                @click="fnColor(index, $event)"
              >
                {{ index }}
              </li>
            </ul>
          </div>
        </div>
        <div class="lcu_fx_fun_name">
          <span>函数名：</span>
          <div class="lcu_fx_var_content">
            <ul>
              <li
                v-for="(item, index) in fnList"
                :key="index"
                v-bind:class="[
                  clickFn === item ? 'lcu_fx_var_content_activeClass' : ''
                ]"
                @click="styleColorFn(item, $event)"
                @dblclick="getPositionFn(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="lcu_fx_var">
        <span>对象：</span>
        <div class="lcu_fx_var_content">
          <ul>
            <li
              v-for="(item, index) in varList"
              :key="index"
              v-bind:class="[
                clickVarList === index ? 'lcu_fx_var_content_activeClass' : ''
              ]"
              @click="styleColor(index, $event)"
              @dblclick="getPositionForTextAreaTest(index)"
              @mouseover="mouseover(index)"
              @mouseout="mouseout(index)"
            >
              {{ index }}
            </li>
          </ul>
        </div>
      </div>
      <div class="lcu_fx_explain">
        <span>属性：</span>
        <div class="lcu_fx_var_content">
          <ul>
            <li
              v-for="(item, index) in attributeList"
              :key="index"
              v-bind:class="[
                clickAttrList === item ? 'lcu_fx_var_content_activeClass' : ''
              ]"
              @click="styleColorAttr(item, $event)"
              @dblclick="getPositionForTextAreaAttr(item)"
              @mouseover="mouseover(clickVarList)"
              @mouseout="mouseout(clickVarList)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="lcu_fx_footer">
      <div class="lcu_fx_footer_left">{{ describe }}</div>
      <div class="lcu_fx_footer_right">
        <button @click="sure(index)">确定</button>
        <button @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import { doMove } from "@/components/edit-shape/index";
import CodeIde from "./code-ide.vue";
import IdeComponent from "./ide-component.vue";
@Options({
  emits: { init: null, close: null },
  components: { CodeIde, IdeComponent },
  props: {
    data: Object || Number || String,
    index: Object || Number || String,
    type: Object || Number || String
  }
})
export default class fn extends Vue {
  private cont = "";
  private varList = [];
  private clickVarList = "";
  private attributeList: any = [];
  private clickAttr = "";
  private clickAttrList = "";

  private frontString = "";
  private afterString = "";
  private posString = "";

  private clickFntype = "";
  private fnList: any = [];
  private clickFn = "";
  private fnArray: any = {
    Http: {
      describe:
        "提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。例如：post('http://xxxx', data)"
    }
  };

  private domStyle = {};

  private describe: string = "";
  private fullBll = false;
  full(id: number) {
    this.fullBll = id === 0 ? true : false;
    this.domStyle =
      id === 0 ? { width: "100%", height: "100%", top: 0, left: 0 } : {};
  }
  fnColor(item: any, e: any) {
    this.describe = "";
    this.clickFn = "";
    this.clickFntype = item;
    this.fnList = [];
    this.describe = this.fnArray[item].describe;
    switch (item) {
      case "Http":
        this.fnList = Reflect.ownKeys((window as any).fetch);
        break;
      default:
        break;
    }
  }

  styleColorFn(item: any, e: any) {
    this.describe = "";
    this.clickFn = item;
  }
  getPositionFn(count: any) {
    let a = count;
    switch (this.clickFntype) {
      case "Http":
        a = "window.fetch." + a + "()";
        break;
      default:
        break;
    }
    this.posString = a;
    this.setTextAttr(a);
  }

  mousedown(e: any) {
    console.log(676, e.target.className);
    if (e.button == 0 && e.target.className === "lcu_fx_title") {
      const currentTarget = e.currentTarget;
      setTimeout(() => {
        console.log(90);
        doMove(currentTarget, this.domStyle, e, document.children[0], null);
      }, 0);
    }
  }
  styleColor(item: any, e: any) {
    this.describe = "";
    this.clickAttrList = "";
    this.clickVarList = item;
    this.attributeList = (window as any).paramList[item].self
      ? Reflect.ownKeys((window as any).paramList[item].self())
      : Reflect.ownKeys((window as any).paramList[item]);
  }
  mouseover(item: any) {
    const a = item.substring(0, item.indexOf("_"));
    const b: any = document.getElementById(a);
    if (b.previousSibling !== undefined && b.previousSibling !== null) {
      const c = b.previousSibling.style;
      c.backgroundColor = "#1380de";
      c.opacity = 0.5;
    } else {
      const c = b.style;
      c.boxShadow = "0px 0px 5px 5px #880384";
    }
  }
  mouseout(item: any) {
    const a = item.substring(0, item.indexOf("_"));
    const b: any = document.getElementById(a);
    if (b.previousSibling !== undefined && b.previousSibling !== null) {
      const c = b.previousSibling.style;
      c.backgroundColor = "";
      c.opacity = "";
    } else {
      const c = b.style;
      c.boxShadow = "";
    }
  }
  // 获取区域内光标开始位置  ctrl：区域
  getPositionForTextArea(ctrl: any) {
    let CaretPos = 0;
    if (ctrl.selectionStart || ctrl.selectionStart == "0") {
      // Firefox support
      CaretPos = ctrl.selectionStart;
    }
    // console.log(CaretPos);
    return CaretPos;
  }
  // 获取光标并设置区域内容  a:新增内容
  getPositionForTextAreaTest(count: any) {
    let a = count;
    if ((window as any).paramList[a].self) {
      a = "window.paramList['" + count + "']" + ".self()";
    }
    this.posString = a;
    this.setTextAttr(a);
  }
  // 设置光标位置  ctrl：区域 pos：光标位置
  setCaretPosition(ctrl: any, pos: any) {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      this.$nextTick(() => {
        ctrl.setSelectionRange(pos, pos);
      });
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  }
  styleColorAttr(item: any, e: any) {
    this.describe = "";
    if ((window as any).visua[this.clickVarList][item] !== undefined) {
      this.describe = (window as any).visua[this.clickVarList][item].name;
    }
    this.clickAttrList = item;
  }
  getPositionForTextAreaAttr(count: any) {
    let a = count;
    if ((window as any).paramList[this.clickVarList].self) {
      a = "window.paramList['" + this.clickVarList + "']" + ".self()." + count;
    } else {
      a = "window.paramList['" + this.clickVarList + "']." + count;
    }
    if (typeof eval(a) === "function") {
      a = a + "()";
    }
    console.log(22, typeof eval(a));
    this.posString = a;
    this.setTextAttr(a);
  }
  // 设置新增内容 a：内容参数
  setTextAttr(a: any) {
    let b: any = this.$refs.testInput;
    // const position: any = b.$refs.textarea;
    // const pos = this.getPositionForTextArea(position);
    // console.log(pos);
    // const y = position.value;
    // console.log(y);
    // this.frontString = y.substring(0, pos);
    // this.afterString = y.substring(pos, this.cont.toString().length);
    // console.log(this.frontString);
    // console.log(this.afterString);
    // // this.formData.smsContent = '';
    // this.cont = this.frontString + a + this.afterString;
    // this.setCaretPosition(position, pos + a.length);
    // console.log(y);
    b.refresh(a);
  }
  sure(index: any) {
    const a: any = this.$props;
    let b = "";
    if (a.type === "textarea") {
      b = "(query)=>{" + this.cont + "}";
    } else {
      b = "(function(){" + this.cont + "})()";
    }
    this.$emit("init", index, b);
  }
  close() {
    this.$emit("close");
  }
  created() {
    const a: any = this.$props;
    if (a.type === "textarea") {
      const c = a.data.toString();
      const b = c.substring(0, 10);
      if (b.includes("=>")) {
        this.cont = c.substring(c.indexOf("{") + 1, c.length - 1);
      } else {
        this.cont = a.data;
      }
    } else {
      const b = a.data.toString().substring(0, 12);
      if (b === "(function(){") {
        this.cont = a.data.substring(12, a.data.length - 4);
      } else {
        this.cont = a.data;
      }
    }
  }
  mounted() {
    this.varList = (window as any).paramList;
    const position: any = this.$refs.testInput;
    this.setCaretPosition(position, this.cont.toString().length);
  }
}
</script>

<style lang="scss">
.lcu_fx_model {
  background-color: gray;
  left: 0;
  opacity: 0.5;
  position: absolute;
  top: 0;
  z-index: 50;
  filter: alpha(opacity=50);
  width: 100%;
  height: 100%;
}
.lcu_fx_title {
  cursor: move;
  div {
    float: right;
    z-index: 10;
    cursor: pointer;
  }
  div > div {
    width: 30px;
    height: 100%;
    text-align: center;
    line-height: 20px;
    img {
      width: 60%;
      height: 60%;
    }
  }
  div > div:hover {
    background-color: #9abfe0;
  }
}
.lcu_fx {
  text-align: left;
  width: 500px;
  height: 500px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  top: 10%;
  padding: 5px;
  background: white;
  .lcu_fx_fun_content {
    height: 38%;
    width: 100%;
    textarea {
      width: 100%;
      resize: none;
    }
  }
}

.lcu_fx_content {
  display: flex;
  height: 50%;
  width: 100%;
  .lcu_fx_fun {
    display: flex;
    width: 50%;
    height: 100%;
    .lcu_fx_fun_type,
    .lcu_fx_fun_name {
      width: 50%;
      height: 100%;
    }
  }
  .lcu_fx_var {
    width: 25%;
    height: 100%;
  }
  .lcu_fx_var_content {
    width: 93%;
    height: 90%;
    border-style: ridge;
    overflow: scroll;
    display: grid;
    .lcu_fx_var_content_activeClass {
      background-color: #6363d6;
      color: white;
    }
    ul {
      padding: 0px;
      margin: 5px;
    }
    ul li {
      width: 100%;
      padding: 5px;
      white-space: pre;
      cursor: pointer;
    }
    ul li:hover {
      background-color: #9abfe0;
    }
  }
  .lcu_fx_explain {
    width: 25%;
    height: 100%;
  }
}
.lcu_fx_footer {
  height: 8%;
  width: 100%;
  display: inline-flex;
  .lcu_fx_footer_left {
    text-align: left;
    width: 80%;
    height: 100%;
    font-size: 12px;
    font-weight: 600;
    overflow: auto;
  }
  .lcu_fx_footer_right {
    width: 20%;
    text-align: right;

    button {
      margin-top: 15px;
      margin-right: 5px;
    }
  }
}
.lcu_fx_fun_code {
  padding: 5px;
}
</style>
