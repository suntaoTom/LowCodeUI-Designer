<template>
  <div class="lcu_view" @click="focusPrice($event)">
    <div class="lcu_view_flex" v-for="(item, index) in data" :key="index">
      <div class="lcu_view_left">
        <label>{{ item.name }}：</label>
      </div>
      <div class="lcu_view_right">
        <div class="lcu_view_right_ide" v-if="item.type === 'input'">
          <!-- <input @blur="blur($event, index)" v-model="item.defaultvalue" /> -->
          <textarea
            @blur="blur($event, index)"
            :value="getdefaultBll(item.defaultvalue)"
          ></textarea>
          <button @click="fx(item, index)">F(x)</button>
        </div>
        <div class="lcu_view_right_ide" v-else-if="item.type === 'select'">
          <select @change="change($event, index)" v-model="item.defaultvalue">
            <option value=""></option>
            <option
              :key="index"
              :value="item.trim()"
              v-for="(item, index) in item.value"
              >{{ item }}</option
            >
          </select>
        </div>
        <div class="lcu_view_right_ide" v-else-if="item.type === 'bollean'">
          <select @change="change($event, index)" v-model="item.defaultvalue">
            <option value="true">true</option>
            <option value="false" checked>false</option>
          </select>
        </div>
        <div class="lcu_view_right_ide" v-else-if="item.type === 'textarea'">
          <textarea
            @blur="blur($event, index)"
            v-model="item.defaultvalue"
          ></textarea
          ><button @click="fx(item, index)">F(x)</button>
        </div>
      </div>
    </div>
  </div>
  <Fn
    v-if="fnBoolean"
    :data="formula"
    :index="fxIndex"
    :type="fxType"
    @init="init"
    @close="close"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DesignStore from "@/store/modules/design";
import Fn from "../fn/fn.vue";
@Options({
  emits: { resetStore: null, focusPriceClick: null },
  components: { Fn },
  props: {
    data: Object,
    packageInfo: Object,
    activeElement: Object
  }
})
export default class ViewTemplate extends Vue {
  private activeElement = JSON.parse(JSON.stringify(this.$props)).activeElement;
  private packageInfo = JSON.parse(JSON.stringify(this.$props)).packageInfo;
  private fnBoolean = false;
  private formula = "";
  private fxIndex: any = null;
  private fxType = null;
  getdefaultBll(val: any) {
    let funcTest = val;
    if (typeof funcTest === "object") {
      funcTest = JSON.stringify(funcTest);
    }

    return funcTest;
  }

  getdefaultObj(val: any) {
    let funcTest = val;
    try {
      if (typeof val === "string" && typeof JSON.parse(funcTest) === "object") {
        funcTest = JSON.parse(funcTest);
      }
    } catch (error) {
      try {
        if (funcTest[0] === "(") {
          return funcTest;
        } else {
          return eval("(" + funcTest + ")");
        }
      } catch (error) {
        return funcTest;
      }
    }
    return funcTest;
  }
  fx(item: any, index: any) {
    this.formula = this.getdefaultBll(item.defaultvalue);
    this.fxIndex = index;
    this.fxType = item.type;
    this.fnBoolean = true;
  }
  close() {
    this.fnBoolean = false;
    this.formula = "";
    this.fxIndex = null;
  }
  blur(e: any, name: any) {
    this.init(name, e.target.value);
  }
  change(e: any, name: any) {
    let a: any = e.target.value;
    if (a === "true") {
      a = true;
    }
    if (a === "false") {
      a = false;
    }
    this.init(name, a);
  }
  init(name: any, value: any) {
    this.close();
    let uuid =
      this.activeElement.domUUID +
      "_" +
      this.packageInfo.name +
      "_" +
      this.packageInfo.version;
    (window as any).visua[uuid][name].defaultvalue = this.getdefaultObj(value);
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
    this.$emit("resetStore", b.apiCssObj, DesignStore.activeElementPosition, v);
  }
  focusPrice(e: any) {
    this.$emit("focusPriceClick");
  }
  mounted() {}
}
</script>

<style lang="scss">
.lcu_view {
  width: 100%;
  height: 90%;
  overflow: auto;
}
.lcu_view_flex {
  width: 100%;
  display: flex;
  margin-top: 10px;
}
.lcu_view_left {
  width: 50%;
  text-align: right;
  font-size: 14px;
  font-weight: 700;
}
.lcu_view_right {
  width: 50%;
  text-align: left;

  .lcu_view_right_ide {
    position: relative;
    width: 100%;
    display: inline-flex;
    input,
    textarea {
      width: 50%;
    }
    select {
      width: 95%;
    }
    button {
      height: 21px;
      margin-top: 15px;
      margin-left: 6px;
    }
  }
}
</style>
