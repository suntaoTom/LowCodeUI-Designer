<template>
  <div @mousedown="verticalDragRuler($event)">
    <div class="lcu_ruler_horn"></div>
    <div class="lz-ruler-v" ref="horizontalRuler" style="position: relative;">
      <span
        v-for="(item, index) in Scale"
        :key="index"
        :style="{ left: index * 50 + 2 + 'px' }"
        class="n"
        >{{ item.id }}</span
      >
    </div>
  </div>
  <div
    class="lz-ruler-h"
    ref="verticalRuler"
    style="position: relative;"
    @mousedown.stop="horizontalDragRuler($event)"
  >
    <span
      v-for="(item, index) in Scale"
      :key="index"
      :style="{ top: index * 50 + 2 + 'px' }"
      class="n"
      >{{ item.id }}</span
    >
  </div>
</template>

<script lang="ts">
import { Options, Vue, emits } from "vue-class-component";
@Options({
  components: {},
  props: {},
  watch: {}
})
export default class rulers extends Vue {
  private Scale: any = [];
  restyle(scrollLeft: number, scrollTop: number) {
    let b: any = this.$refs.verticalRuler;
    let c: any = this.$refs.horizontalRuler;
    c.style.transform = "translateX(-" + scrollLeft + "px)";
    b.style.transform = "translateY(-" + scrollTop + "px)";
  }
  // 获取矫正刻度方法
  newLine(val: any) {
    // this.isDrag = true;
    // this.dragFlag = val;
  }
  // 水平标尺处按下鼠标
  async verticalDragRuler(e: any) {
    e.stopPropagation(); //阻止事件冒泡，在性能上有一定优化
    e.preventDefault();
    const a: any = this.$parent;
    let t = 0;
    let id =
      "lcu_v" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    let p = a.$refs.rightContent.scrollTop;
    let x: any = a.$refs.homeheader;
    let r: any = eval(JSON.stringify(x.revoke));
    await a.dataEle.lineList.push({ id: id, type: "v", top: p });
    const oDiv: any = document.getElementById(id); //这里一定要用currentTarget，因为这是获取事件最终的元素，而不是捕获、冒泡的元素
    const disY = e.clientY - oDiv.offsetTop;
    console.log(1313, e.clientY);
    document.onmousemove = function(ev) {
      let b: any = document.getElementById("lcu_canves");
      const oEvent = ev || event;

      if (oEvent.clientY > e.clientY + 18) {
        t = oEvent.clientY - disY - 18;
        if (t < 0) {
          t = 0;
        } else if (t > b.clientHeight - oDiv.offsetHeight) {
          t = b.clientHeight - oDiv.offsetHeight;
        }
        console.log(4848, t);
        oDiv.style.top = t + "px";
      }
    };
    document.onmouseup = function() {
      console.log(4747, t);
      // 平行辅助线操作记录
      if (t > 1) {
        a.dataEle.lineList[a.dataEle.lineList.length - 1].top = t;
        console.log(747474747447, x.revoke.length);
      } else {
        a.dataEle.lineList.splice(a.dataEle.lineList.length - 1, 1);
      }
      let o = JSON.parse(JSON.stringify(a.dataEle));
      r.push(o);
      x.revoke = r;
      //   callback !== null ? callback() : false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false; //阻止默认事件 屏蔽火狐的bug
  }
  // 垂直标尺处按下鼠标
  async horizontalDragRuler(e: any) {
    e.stopPropagation(); //阻止事件冒泡，在性能上有一定优化
    e.preventDefault();
    const a: any = this.$parent;
    let l = 0;
    let id =
      "lcu_h" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    let p = a.$refs.rightContent.scrollLeft;
    let x: any = a.$refs.homeheader;
    let r: any = eval(JSON.stringify(x.revoke));
    await a.dataEle.lineList.push({ id: id, type: "h", left: p });
    console.log(181818);

    const oDiv: any = document.getElementById(id); //这里一定要用currentTarget，因为这是获取事件最终的元素，而不是捕获、冒泡的元素
    const disX = e.clientX - oDiv.offsetLeft;
    console.log(1313, e.clientX);
    document.onmousemove = function(ev) {
      let b: any = document.getElementById("lcu_canves");
      const oEvent = ev || event;
      if (oEvent.clientX > e.clientX + 18) {
        l = oEvent.clientX - disX - 18;

        if (l < 0) {
          l = 0;
        } else if (l > b.clientHeight - oDiv.offsetWidth) {
          l = b.clientWidth - oDiv.offsetWidth;
        }
        console.log(4848, l);
        oDiv.style.left = l + "px";
      }
    };
    document.onmouseup = function() {
      console.log(4747, l);
      // 垂直辅助线操作记录
      if (l > 1) {
        a.dataEle.lineList[a.dataEle.lineList.length - 1].left = l;
        console.log(747474747447, x.revoke.length);
      } else {
        a.dataEle.lineList.splice(a.dataEle.lineList.length - 1, 1);
        // let o = JSON.parse(JSON.stringify(a.dataEle));
        // r.push(o);
        // x.revoke = r;
      }
      let o = JSON.parse(JSON.stringify(a.dataEle));
      r.push(o);
      x.revoke = r;
      //   callback !== null ? callback() : false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false; //阻止默认事件 屏蔽火狐的bug
  }
  mounted() {
    for (let i = 0; i < 400; i++) {
      let a = { id: i * 50 };
      this.Scale.push(a);
    }
  }
}
</script>

<style lang="scss">
.lz-ruler-h {
  width: 18px;
  height: 20000px;
  opacity: 0.6;
  background: url("./image/ruler_v.png") repeat-y;
  .n {
    transform: rotate(-90deg);
    left: 0px;
  }
}
// .lz-ruler-h .n {
//   transform: rotate(-90deg);
//   left: 0px;
// }

.lz-ruler-v {
  width: 20000px;
  height: 18px;
  left: 18px;
  opacity: 0.6;
  background: url("./image/ruler_h.png") repeat-x;
}

.lz-ruler-v .n,
.lz-ruler-h .n {
  position: absolute;
  font: 10px/1 Arial, sans-serif;
  color: #333;
  cursor: default;
}
.lcu_ruler_v_canves {
  width: 98%;
  height: 97%;
  top: -20001px;
  left: 17px;
  position: relative;
  overflow: scroll;
}
.lcu_ruler_horn {
  z-index: 1;
  width: 18px;
  height: 18px;
  background-color: white;
  position: absolute;
}
</style>
