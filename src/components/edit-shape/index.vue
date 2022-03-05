<template>
  <div
    class="components-edit-shape"
    :class="{ active: this.active }"
    :style="defaultStyle"
    @click="topWrapperClick($event)"
    @mousedown="mousedown($event)"
  >
    <div
      class="edit-shape-point"
      v-for="(item, index) in active ? pointList : []"
      :key="item"
      @mousedown="onPoint($event, item, index)"
      :style="getStyle(item)"
    ></div>
    <span v-if="this.active === true" class="lcu_dom_delete" @click="domDelete"
      >删除</span
    >
    <div class="lcu_curs" :index="position"></div>
    <div :id="idname" class="lcu_slot"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, emits } from "vue-class-component";
import {
  doMove,
  handleMouseDownOnPoint,
  getPointStyle,
  handleTopWrapperClick
} from "./index";
@Options({
  //Vue 3 建议对组件中所有发出的事件 emit 进行记录 emits 。如果你声明了 emits 选项，并且发送的事件没有被 emits 记录，则会收到一个警告
  emits: {
    handleElementClick: null,
    resetStore: null,
    assemblyFnOne: null,
    domDelete: null
  },
  components: {},
  props: {
    idname: String,
    active: {
      type: Boolean,
      default: false
    },
    defaultStyle: {
      type: Object
    },
    position: Number,
    uuid: String
  },
  watch: {}
})
export default class editShape extends Vue {
  private canvesDom!: string | HTMLElement | null;
  private uuid = JSON.parse(JSON.stringify(this.$props)).uuid;
  private pointList = ["lt", "rt", "lb", "rb", "l", "r", "t", "b"];
  // 上下左右 对应的 东南西北
  private directionKey = {
    t: "n",
    b: "s",
    l: "w",
    r: "e"
  };

  valueApies(newV: any, oldV: any) {
    if (newV !== oldV) {
      console.log(1515, newV, oldV);
    }
  }
  domDelete() {
    this.$emit("domDelete");
  }
  topWrapperClick(event: any) {
    handleTopWrapperClick(event);
  }

  getStyle(item: Number) {
    return getPointStyle(this, item);
  }
  onPoint(e: any, item: Number) {
    let a: any = this.$props;
    handleMouseDownOnPoint(
      a.defaultStyle,
      this.canvesDom,
      e,
      item,
      this.resetStyle
    );
  }

  mousedown(e: any) {
    const a = JSON.parse(JSON.stringify(this.$props)).position;
    let b: any = this.$props;
    if (e.button == 0) {
      const currentTarget = e.currentTarget;
      this.$emit("handleElementClick", a);
      setTimeout(() => {
        console.log(90);
        doMove(
          currentTarget,
          b.defaultStyle,
          e,
          this.canvesDom,
          this.resetStyle
        );
      }, 0);
    }
  }

  resetStyle() {
    console.log(161616);
    const a = JSON.parse(JSON.stringify(this.$props)).position;
    let b: any = this.$props;
    this.$emit(
      "resetStore",
      "commonStyle",
      a,
      JSON.parse(JSON.stringify(b.defaultStyle))
    );
  }
  created() {
    console.log(
      2222,
      this.$options,
      JSON.parse(JSON.stringify(this.$props)).position
    );
  }
  mounted() {
    //这里不能用虚拟dom（因为类型是Proxy），所以要用document拿取原生Dom
    this.canvesDom = document.getElementById("lcu_canves");
    setTimeout(() => {
      this.$emit("assemblyFnOne");
    }, 0);
  }
}
</script>

<style lang="scss">
.edit-shape-point {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  border-radius: 10px;
  position: absolute;
  z-index: 1001;
}

.components-edit-shape {
  cursor: move;
  &.active {
    outline: 1px dashed #25a589;
  }
  &:hover {
    outline: 1px dashed #25a589;
  }
}
.lcu_slot {
  width: 100%;
  height: 100%;
}
.lcu_dom_delete {
  color: blue;
  font-size: 0.1rem;
  position: absolute;
  right: -2rem;
  cursor: pointer;
  z-index: 1;
}
.lcu_curs {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
