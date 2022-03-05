<template>
  <div class="lcu_header" id="lcu_header">
    <!-- {{ dataEle }}
    {{ revoke.length }} -->
    <div class="lcu_header_tool">
      <div class="lcu_button_item">
        <div class="lcu_button_item_left">
          <div>
            <router-link
              target="_blank"
              :to="{ path: '/about', query: { uuid: dataEle.uuid } }"
              ><button>预览</button></router-link
            >
            <button @click="savePreview">保存</button>
            <button
              @click="clickRevoke"
              :disabled="revoke.length > 1 ? false : true"
            >
              撤销
            </button>
            <button
              @click="clickRecovery"
              :disabled="recovery.length > 0 ? false : true"
            >
              恢复
            </button>
            <button @click="copydataEle">拷贝</button>
            <button @click="saveDevelop">push</button>
            <span>粘贴板：</span>
            <input v-model="pastedataEleValue" />
            <button @click="pastedataEle">ok</button>
          </div>
          <div class="lcu_button_item_util">
            <span
              >1、预览之前，记住要点击本地保存哦，预览，是以本地环境为准。</span
            ><br />
            <span>2、首次打开工作台，是以线上develop环境数据为准。</span>
          </div>
        </div>
        <div class="lcu_button_item_right">
          <div>
            <label>Source：</label>
            <select @change="sourceValChange" v-model="sourceValue">
              <option value="0">个人</option>
              <option
                :value="index + 1"
                v-for="(item, index) in envArray"
                :key="index"
                >{{ item }}</option
              >
            </select>
            <select v-model="sourceVersion">
              <option
                v-for="(item, index) in sourceArray"
                :value="item.version"
                :key="index"
                >{{ item.version }}</option
              >
            </select>
            <label>Target：</label>
            <select @change="tarChange" v-model="targetValue">
              <option value="0"></option>
              <option
                :value="index + 1"
                v-for="(item, index) in envArray"
                :key="index"
                >{{ item }}</option
              >
            </select>
            <input
              style="width:50px;"
              v-model="tarInpVal"
              :placeholder="tarMaxVal"
              @input="onlyNonNegative($event)"
            />
            <button @click="merge" :disabled="mergeBll">merge</button>
          </div>
          <div>
            <span>
              <label>Env：</label>
              <select @change="envChange" v-model="envValue">
                <option value="0"></option>
                <option
                  :value="index + 1"
                  v-for="(item, index) in envArray"
                  :key="index"
                  >{{ item }}</option
                >
              </select>
              <label>版本：</label>
              <select v-model="envVersion">
                <option
                  v-for="(item, index) in envArrayVer"
                  :value="item.version"
                  :key="index"
                  >{{ item.version }}</option
                >
              </select>
              <label>在线版本：{{ onLineVersion }}</label>
            </span>
            <button @click="deploy" :disabled="deployBll">部署</button>
            <!-- <button @click="" disabled>回滚</button> -->
            <button @click="details">详情</button>
          </div>
        </div>
      </div>
    </div>
    <div class="lcu_header_style">
      <div class="lcu_header_style_left">
        自适应：
        <span>
          <input
            type="radio"
            name="categor"
            :value="dataEle.auto === 'XY' ? true : false"
            :checked="dataEle.auto === 'XY' ? true : false"
            @click="checkAuto('XY', $event)"
          />双向
        </span>
        <span>
          <input
            type="radio"
            name="categor"
            :value="dataEle.auto === 'X' ? true : false"
            :checked="dataEle.auto === 'X' ? true : false"
            @click="checkAuto('X', $event)"
          />横向
        </span>
      </div>
      <div class="lcu_header_style_right">
        <span>
          推荐像素：
          <select @change="sel($event)">
            <option value="0"></option>
            <option value="1">PC(1280*854)</option>
            <option value="2">PC(1366*768)</option>
            <option value="3">H5(375*812)</option>
            <option value="4">H5(414*736)</option>
          </select>
        </span>
        W：<input
          type="text"
          :value="pageH != undefined ? getReplace(pageH.left) : 0"
          name=""
          @blur="wBlur($event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        H：<input
          type="text"
          :value="pageW != undefined ? getReplace(pageW.top) : 0"
          name=""
          @blur="hBlur($event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        x：<input
          type="text"
          name=""
          :disabled="commonStyle.left === undefined ? true : false"
          :value="getReplace(commonStyle.left)"
          @blur="X_Y_W_H_Blur('x', $event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        y：<input
          type="text"
          :disabled="commonStyle.left === undefined ? true : false"
          :value="getReplace(commonStyle.top)"
          name=""
          @blur="X_Y_W_H_Blur('y', $event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        z：<input
          type="text"
          :disabled="commonStyle['z-index'] === undefined ? true : false"
          :value="getReplaceZ(commonStyle['z-index'])"
          name=""
          @blur="X_Y_W_H_Blur('z', $event)"
          oninput="value=value.replace(/[^\-?\d]/g,'')"
        />
        w：<input
          type="text"
          :disabled="commonStyle.left === undefined ? true : false"
          :value="getReplace(commonStyle.width)"
          name=""
          @blur="X_Y_W_H_Blur('w', $event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        h：<input
          type="text"
          :disabled="commonStyle.left === undefined ? true : false"
          :value="getReplace(commonStyle.height)"
          name=""
          @blur="X_Y_W_H_Blur('h', $event)"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </div>
    </div>
  </div>
  <div class="lcu_details" v-if="detailBll">
    <span @click="close">关闭</span>
    <h4>
      在线地址：
      <span @click="copy">复制</span>
      <span style="margin-right:5px;" @click="viewUrl">查看</span>
    </h4>
    <h5>{{ url }}</h5>
    <h4>扫码查看：</h4>
    <div id="qrcode"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, emits } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import LoginStore from "@/store/modules/login";
import { qrcanvas } from "qrcanvas";
import { jsmethod } from "@/utils/axios";
@Options({
  components: {},
  props: {
    dataEle: Object,
    pageW: Object,
    pageH: Object,
    commonStyle: Object
  },
  watch: {}
})
export default class homeHeader extends Vue {
  //撤销
  private revoke: Array<any> = [];
  //恢复
  private recovery: Array<any> = [];
  private bll = false;
  private pastedataEleValue = "";

  private envArray: any = ["开发", "测试", "UAT", "灰度", "生产"];
  //Env
  private envValue: any = "0";
  private envVersion: any = "";
  private envArrayVer: Array<any> = [];
  private onLineVersion: any = "";
  //source
  private sourceValue: any = "0";
  private sourceVersion: any = "";
  private sourceArray: Array<any> = [];
  //target
  private targetValue: any = "0";
  private tarInpVal: any = "";
  private tarMaxVal: any = "";

  private mergeBll = false;
  private deployBll = false;

  private detailBll = false;
  private url = "";

  viewUrl() {
    window.open(this.url);
  }

  copy() {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", this.url);
    input.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(input);
  }

  useqrcode(data: any) {
    let a = qrcanvas({
      data: data,
      size: 110
    });
    let c: any = document.getElementById("qrcode");
    c.innerHTML = "";
    c.appendChild(a);
  }

  close() {
    this.detailBll = false;
  }
  details() {
    let c: any = this.$route.query;
    if (parseInt(this.envValue) !== 0 && this.onLineVersion !== "") {
      this.url =
        "http://192.168.18.41:8089/#/?project_id=" +
        c.project_id +
        "&uuid=" +
        c.uuid +
        "&env=" +
        this.envValue;
      this.detailBll = true;
      setTimeout(() => {
        this.useqrcode(this.url);
      }, 0);
    } else {
      alert("当前环境无在线版本信息！");
    }
    //localhost:8080/#/about?uuid=8129725
    http: console.log(
      32,
      c.uuid,
      c.project_id,
      this.envValue,
      this.onLineVersion
    );
  }
  async getOnlineVer() {
    let c: any = this.$route.query;
    let b: any = LoginStore.personInfo;
    await DesignStore.getOnlineVer({
      type: this.envValue,
      uuid: c.uuid,
      view_user_id: b.id,
      project_id: this.$route.query.project_id
    });
    this.onLineVersion = DesignStore.onlineVersion;
  }

  async envChange() {
    if (this.envValue !== "0") {
      let c: any = this.$route.query;
      let b: any = LoginStore.personInfo;
      await DesignStore.getVersionEnv({
        type: this.envValue,
        uuid: c.uuid,
        view_user_id: b.id,
        project_id: this.$route.query.project_id
      });
      this.envArrayVer = DesignStore.deployVersion;
      this.envVersion = "";
      this.getOnlineVer();
    } else {
      this.envArrayVer = [];
      this.envVersion = "";
      this.onLineVersion = "";
    }
  }
  onlyNonNegative(e: any) {
    let obj = e.target;
    //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //只保留第一个. 清除多余的
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    obj.value = obj.value
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
    //只能输入一个小数
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3");
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
    if (obj.value.indexOf(".") < 0 && obj.value != "") {
      obj.value = parseFloat(obj.value);
    }
    this.tarInpVal = obj.value;
  }

  async deploy() {
    if (confirm(`是否部署当前环境的版本？`) == true) {
      if (this.envValue !== 0 && this.envVersion !== "") {
        this.deployBll = true;
        let b: any = LoginStore.personInfo;
        let c: any = this.$route.query;
        await DesignStore.setDeploy({
          version: this.envVersion,
          type: this.envValue,
          uuid: c.uuid,
          view_user_id: b.id,
          project_id: this.$route.query.project_id
        });
        this.getOnlineVer();
        this.deployBll = false;
      } else {
        alert("部署环境信息不全");
      }
    }
  }
  async tarChange() {
    if (this.targetValue !== "0") {
      let c: any = this.$route.query;
      let b: any = LoginStore.personInfo;
      await DesignStore.getVersionTar({
        type: this.targetValue,
        uuid: c.uuid,
        view_user_id: b.id,
        project_id: this.$route.query.project_id
      });
      console.log(33, DesignStore.pushTarVersion);
      this.tarMaxVal =
        DesignStore.pushTarVersion !== ""
          ? parseFloat(DesignStore.pushTarVersion)
          : "0.0";
      this.tarInpVal = "";
      this.envValue = "0";
      this.envChange();
      this.sourceValChange();
    } else {
      this.tarInpVal = "";
      this.tarMaxVal = "";
    }
  }

  async sourceValChange() {
    if (this.sourceValue !== "0") {
      let c: any = this.$route.query;
      let b: any = LoginStore.personInfo;
      await DesignStore.getVersion({
        type: this.sourceValue,
        uuid: c.uuid,
        view_user_id: b.id,
        project_id: this.$route.query.project_id
      });
      this.sourceArray = DesignStore.pushVersion;
      //this.sourceVersion = "";
    } else {
      this.sourceArray = [];
      this.sourceVersion = "";
    }
  }

  async merge() {
    if (this.sourceValue !== "0" && this.sourceVersion === "") {
      alert("Source：内容填写有误，请检查");
    } else if (this.targetValue === "0" || this.tarInpVal === "") {
      alert("Target：内容填写有误，请检查");
    } else {
      if (
        this.tarMaxVal !== "" &&
        parseFloat(this.tarInpVal) > parseFloat(this.tarMaxVal)
      ) {
        this.mergeBll = true;
        let c: any = this.$route.query;
        let b: any = LoginStore.personInfo;
        await DesignStore.setMerge({
          source: this.sourceValue,
          sourceVersion: this.sourceVersion,
          target: this.targetValue,
          targetVersion: this.tarInpVal,
          uuid: c.uuid,
          view_user_id: b.id,
          project_id: this.$route.query.project_id
        });
        this.tarChange();
        this.mergeBll = false;
      } else {
        alert(`Target:版本填写有误`);
      }
    }
  }
  saveDevelop() {
    let c: any = this.$route.query;
    let a = JSON.parse(JSON.stringify(this.$props)).dataEle;
    let b: any = LoginStore.personInfo;
    DesignStore.setPageRule({
      rule: a,
      uuid: c.uuid,
      view_user_id: b.id,
      project_id: this.$route.query.project_id
    });
  }

  isJSON(str: any) {
    if (typeof str == "string") {
      try {
        let obj = JSON.parse(str);
        if (typeof obj == "object" && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log("error：" + str + "!!!" + e);
        return false;
      }
    }
  }

  pastedataEle() {
    if (this.pastedataEleValue !== "") {
      let m = this.isJSON(this.pastedataEleValue);
      if (m) {
        let a: any = this.$parent;
        let b = JSON.parse(this.pastedataEleValue);
        if (b.elements !== undefined) {
          let c: any = this.$route.query;
          let newJson = JSON.parse(JSON.stringify(a.dataEle));
          b.uuid = newJson.uuid !== undefined ? newJson.uuid : c.uuid;
          b.activeElement = {};
          let z = JSON.stringify(b);
          b.elements.map((val: any) => {
            z = z.replace(
              RegExp(val.uuid, "g"),
              "lz" +
                (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            );
          });

          b = JSON.parse(z);
          a.dataEle = "";
          a.reset();
          setTimeout(() => {
            a.dataEle = b;
            let x: any = a.$refs.homeheader;
            x.revoke.push(JSON.stringify(b));
          }, 0);
        } else {
          let c: any = this.$route.query;
          let newJson = JSON.parse(JSON.stringify(a.dataEle));
          let z = JSON.stringify(b);
          z = z.replace(
            RegExp(b.uuid, "g"),
            "lz" +
              (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
          );
          b = JSON.parse(z);

          newJson.elements.push(b);
          a.dataEle = "";
          a.reset();
          a.handleClickCanvas();
          setTimeout(() => {
            a.dataEle = newJson;
            let x: any = a.$refs.homeheader;
            x.revoke.push(JSON.stringify(newJson));
          }, 0);
        }
      } else {
        alert("数据格式不对，请核对!");
      }
    } else {
      alert("内容不能为空");
    }
  }
  copydataEle() {
    let z: any = this.$parent;
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", JSON.stringify(z.dataEle));
    input.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(input);
  }

  checkAuto(x_y: any, e: any) {
    console.log(2323, e.target.value);
    let a: any = this.$parent;
    let newJson = JSON.parse(JSON.stringify(a.dataEle));
    if (x_y === "X") {
      newJson.auto = newJson.auto === "X" ? "" : "X";
    } else {
      newJson.auto = newJson.auto === "XY" ? "" : "XY";
    }

    console.log(1919, newJson);
    a.dataEle = {};
    setTimeout(() => {
      a.dataEle = newJson;
      let x: any = a.$refs.homeheader;
      x.revoke.push(newJson);
    }, 0);
  }
  // checkAuto(e: any) {
  //   console.log(2323, e.target.value);
  //   let a: any = this.$parent;
  //   let newJson = JSON.parse(JSON.stringify(a.dataEle));
  //   e.target.value == "true" ? (newJson.auto = false) : (newJson.auto = true);

  //   console.log(1919, newJson);
  //   a.dataEle = {};
  //   setTimeout(() => {
  //     a.dataEle = newJson;
  //     let x: any = a.$refs.homeheader;
  //     x.revoke.push(newJson);
  //   }, 0);
  // }

  sel(e: any) {
    let a: any = this.$parent;
    let newJson: any = JSON.parse(JSON.stringify(a.dataEle));

    switch (parseInt(e.target.value)) {
      case 1:
        newJson.pageW.top = "854px";
        newJson.pageH.left = "1280px";
        break;
      case 2:
        newJson.pageW.top = "768px";
        newJson.pageH.left = "1366px";
        break;
      case 3:
        newJson.pageW.top = "812px";
        newJson.pageH.left = "375px";
        break;
      case 4:
        newJson.pageW.top = "736px";
        newJson.pageH.left = "414px";
        break;
      default:
        break;
    }

    if (parseInt(e.target.value) !== 0) {
      a.dataEle = {};
      setTimeout(() => {
        a.dataEle = newJson;
        let x: any = a.$refs.homeheader;
        x.revoke.push(newJson);
      }, 0);
    }
  }
  getReplaceZ(para: any) {
    return para !== undefined ? parseInt(para) : 0;
  }
  getReplace(para: any) {
    return para !== undefined ? parseInt(para.replace("px", "")) : 0;
  }
  X_Y_W_H_Blur(param: any, e: any) {
    let a: any = this.$parent;
    let b = a.dataEle.activeElement.domPosition;
    let newJson = JSON.parse(JSON.stringify(a.dataEle));
    a.commonStyle = {};
    switch (param) {
      case "x":
        newJson.elements[b].commonStyle.left = e.target.value + "px";
        break;
      case "y":
        newJson.elements[b].commonStyle.top = e.target.value + "px";
        break;
      case "z":
        newJson.elements[b].commonStyle["z-index"] = e.target.value;
        break;
      case "w":
        newJson.elements[b].commonStyle.width = e.target.value + "px";
        break;
      case "h":
        newJson.elements[b].commonStyle.height = e.target.value + "px";
        break;
      default:
        break;
    }
    a.dataEle = {};
    setTimeout(() => {
      a.dataEle = newJson;
      a.pattern = "";
      let x: any = a.$refs.homeheader;
      x.revoke.push(newJson);
    }, 0);
  }

  wBlur(e: any) {
    console.log(e.target.value);
    let a: any = this.$parent;
    let x: any = a.$refs.homeheader;
    let newJson = JSON.parse(JSON.stringify(a.dataEle));
    newJson.pageH = { left: e.target.value + "px" };
    a.dataEle = {};
    a.dataEle = newJson;
    x.revoke.push(newJson);
  }
  hBlur(e: any) {
    console.log(e.target.value);
    let a: any = this.$parent;
    let x: any = a.$refs.homeheader;
    let newJson = JSON.parse(JSON.stringify(a.dataEle));
    newJson.pageW = { top: e.target.value + "px" };
    a.dataEle = {};
    a.dataEle = newJson;
    x.revoke.push(newJson);
  }

  savePreview() {
    this.bll = true;
    let a: any = this.$parent;
    console.log(
      123456,
      a.dataEle
    );
    a.dbObject.addPerson(JSON.parse(JSON.stringify(a.dataEle)));
  }

  clickRevoke() {
    let a: any = this.$parent;
    DesignStore.setActiveElementUUID(null);
    a.apies = "";
    a.thisAssemObj = "";
    a.dataEle = {}; //这里dataEle变量，一定要全部赋值空值，千万不能操作dataEle里的其他属性变量，不然会一起改变recovery的值
    const b = this.revoke.pop();
    this.recovery.push(b);
    setTimeout(() => {
      a.dataEle = this.revoke[this.revoke.length - 1];
    }, 0);
  }
  clickRecovery() {
    DesignStore.setActiveElementUUID(null);
    let a: any = this.$parent;
    a.apies = "";
    a.thisAssemObj = "";
    a.dataEle = {};
    const b = this.recovery.pop();
    let newJson = JSON.parse(JSON.stringify(b));
    this.revoke.push(newJson);
    setTimeout(() => {
      a.dataEle = b;
    }, 0);
  }

  mounted() {
    console.log(38383, this.revoke);
    jsmethod(this.copydataEle);
  }
  created() {
    setTimeout(() => {
      let newJson = JSON.parse(JSON.stringify(DesignStore.projectData));
      this.revoke.push(newJson);
    }, 0);
  }
}
</script>

<style lang="scss">
.lcu_header {
  height: 20%;
  width: 100%;
}
.lcu_header_util {
  width: 100%;
  text-align: left;
}
.lcu_header_tool {
  height: 5rem;
  width: 100%;
  text-align: left;
  .lcu_button_item_util {
    span {
      color: brown;
      font-size: 10px;
    }
  }
  .lcu_button_item {
    display: flex;
  }
  .lcu_button_item button {
    margin: 2px;
  }
  .lcu_button_item_left {
    width: 50%;
  }
  .lcu_button_item_right {
    width: 50%;
    text-align: right;
  }
}
.lcu_header_style {
  height: 2rem;
  width: 100%;
  display: flex;
}

.lcu_header_style_left {
  text-align: left;
  width: 40%;
}

.lcu_header_style_right {
  text-align: right;
  width: 60%;
  input {
    width: 38px;
  }
}
.lcu_details {
  position: fixed;
  width: 250px;
  height: 270px;
  top: 0px;
  right: 0px;
  background-color: #e8eeee;
  text-align: left;
  padding: 10px;
  word-wrap: break-word;
  word-break: break-all;
  box-shadow: -10px 10px 10px #888888;
  z-index: 999;
  span {
    float: right;
    font-size: 10px;
    cursor: pointer;
    color: blue;
  }
  img {
    width: 100px;
    height: 100px;
  }
}
</style>
