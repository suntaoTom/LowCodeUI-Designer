<template>
  <div
    class="lcu_packageInfo"
    v-if="
      getActiveeElementUUID !== null &&
        packageInfo.name !== undefined &&
        packageInfo.version !== undefined
    "
  >
    <p>UUID：{{ getActiveeElementUUID }}</p>
    <p>
      版本：{{ packageInfo.version
      }}<a :href="getUrl(packageInfo)" target="blank" class="lcu_a">了解详情</a>
    </p>
    <p>组件名：{{ packageInfo.name }}</p>
    <p>
      参数名：{{
        getActiveeElementUUID +
          "_" +
          packageInfo.name +
          "_" +
          packageInfo.version
      }}<span @click="copy" class="lcu_copy">复制</span>
    </p>
  </div>
  <div class="lcu_packageInfo" v-else>
    <p>UUID：</p>
    <p>版本：</p>
    <p>组件名：</p>
    <p>
      参数名：
    </p>
  </div>
  <!-- <div>
    {{ JSON.stringify(paramObjList) }}
  </div> -->
</template>

<script lang="ts">
import { Options, Vue, emits } from "vue-class-component";
@Options({
  emits: {},
  props: {
    packageInfo: Object,
    getActiveeElementUUID: String,
    paramObjList: Object
  }
})
export default class PackageInfo extends Vue {
  getUrl(packageInfo: any) {
    let a =
      "http://192.168.200.16:7002/package/" +
      packageInfo.name +
      "/" +
      packageInfo.version;
    return a;
  }
  copy() {
    let z: any = this.$parent;
    const input = document.createElement("input");
    document.body.appendChild(input);
    const a =
      z.getActiveeElementUUID +
      "_" +
      z.packageInfo.name +
      "_" +
      z.packageInfo.version;
    input.setAttribute("value", "window.paramList['" + a + "']");
    input.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
    }
    document.body.removeChild(input);
  }

  created() {}
  mounted() {}
}
</script>

<style lang="scss">
.lcu_copy,
.lcu_a {
  color: blue;
  cursor: pointer;
  font-size: 0.1rem;
}
.lcu_packageInfo {
  text-align: left;
}
</style>
